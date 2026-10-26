// Planta de situação no navegador: mesma lógica do comando KPSITUACAO do plugin, sem servidor.
// Endereço/CEP → coordenadas (ViaCEP + Nominatim) → ruas e edificações (Overpass/OpenStreetMap)
// → metros em volta do lote (UTM SIRGAS 2000) → desenho (prévia SVG e arquivo DXF).

export const FONTE_OSM = '© colaboradores do OpenStreetMap (ODbL)';

export type P2 = { x: number; y: number };
export type Local = { lat: number; lon: number; descricao: string; aproximado: string };
export type Via = { nome: string; tipo: string; pontos: P2[] };
export type Rotulo = { nome: string; ponto: P2; angulo: number };
/** O que veio do OpenStreetMap, em metros UTM absolutos (para recentralizar sem baixar de novo). */
export type Bruto = { vias: Via[]; edificacoes: P2[][]; e0: number; n0: number; alcance: number };
export type Desenho = {
  local: Local;
  raio: number;
  vias: (Via & { largura: number })[];
  edificacoes: P2[][];
  rotulos: Rotulo[];
  fuso: number;
  sul: boolean;
  e: number;
  n: number;
  bruto: Bruto;
};

const TIPOS_VIA = 'motorway|trunk|primary|secondary|tertiary|unclassified|residential|living_street|road|service|pedestrian';
const OVERPASS = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter'];

export function largura(tipo: string) {
  switch (tipo) {
    case 'motorway': case 'trunk': return 20;
    case 'primary': return 16;
    case 'secondary': return 14;
    case 'tertiary': return 12;
    case 'service': return 5;
    case 'pedestrian': return 6;
    default: return 9;
  }
}

// ───────────────────────── UTM SIRGAS 2000 (GRS80, Snyder) ─────────────────────────

const A = 6378137.0, F = 1 / 298.257222101, K0 = 0.9996;
const E2 = F * (2 - F), EP2 = E2 / (1 - E2);

export const fusoDe = (lon: number) => Math.floor((lon + 180) / 6) + 1;

export function paraUtm(lat: number, lon: number, fuso: number) {
  const phi = (lat * Math.PI) / 180, dl = ((lon - (fuso * 6 - 183)) * Math.PI) / 180;
  const s = Math.sin(phi), c = Math.cos(phi), t = Math.tan(phi);
  const nn = A / Math.sqrt(1 - E2 * s * s), tt = t * t, cc = EP2 * c * c, aa = dl * c;
  const m = A * ((1 - E2 / 4 - (3 * E2 * E2) / 64 - (5 * E2 ** 3) / 256) * phi
    - ((3 * E2) / 8 + (3 * E2 * E2) / 32 + (45 * E2 ** 3) / 1024) * Math.sin(2 * phi)
    + ((15 * E2 * E2) / 256 + (45 * E2 ** 3) / 1024) * Math.sin(4 * phi)
    - ((35 * E2 ** 3) / 3072) * Math.sin(6 * phi));
  const e = K0 * nn * (aa + ((1 - tt + cc) * aa ** 3) / 6 + ((5 - 18 * tt + tt * tt + 72 * cc - 58 * EP2) * aa ** 5) / 120) + 500000;
  let n = K0 * (m + nn * t * ((aa * aa) / 2 + ((5 - tt + 9 * cc + 4 * cc * cc) * aa ** 4) / 24
    + ((61 - 58 * tt + tt * tt + 600 * cc - 330 * EP2) * aa ** 6) / 720));
  if (lat < 0) n += 10000000;
  return { e, n };
}

/** UTM → latitude/longitude (SIRGAS 2000), para quando o usuário move o local da obra. */
export function paraGeograficas(e: number, n: number, fuso: number, sul: boolean) {
  const x = e - 500000, y = sul ? n - 10000000 : n;
  const mu = y / K0 / (A * (1 - E2 / 4 - (3 * E2 * E2) / 64 - (5 * E2 ** 3) / 256));
  const e1 = (1 - Math.sqrt(1 - E2)) / (1 + Math.sqrt(1 - E2));
  const phi1 = mu + ((3 * e1) / 2 - (27 * e1 ** 3) / 32) * Math.sin(2 * mu)
    + ((21 * e1 * e1) / 16 - (55 * e1 ** 4) / 32) * Math.sin(4 * mu)
    + ((151 * e1 ** 3) / 96) * Math.sin(6 * mu) + ((1097 * e1 ** 4) / 512) * Math.sin(8 * mu);
  const s = Math.sin(phi1), c = Math.cos(phi1), t = Math.tan(phi1);
  const c1 = EP2 * c * c, t1 = t * t;
  const n1 = A / Math.sqrt(1 - E2 * s * s), r1 = (A * (1 - E2)) / (1 - E2 * s * s) ** 1.5;
  const d = x / (n1 * K0);
  const lat = phi1 - ((n1 * t) / r1) * ((d * d) / 2 - ((5 + 3 * t1 + 10 * c1 - 4 * c1 * c1 - 9 * EP2) * d ** 4) / 24
    + ((61 + 90 * t1 + 298 * c1 + 45 * t1 * t1 - 252 * EP2 - 3 * c1 * c1) * d ** 6) / 720);
  const lon = (d - ((1 + 2 * t1 + c1) * d ** 3) / 6 + ((5 - 2 * c1 + 28 * t1 - 3 * c1 * c1 + 8 * EP2 + 24 * t1 * t1) * d ** 5) / 120) / c;
  return { lat: (lat * 180) / Math.PI, lon: fuso * 6 - 183 + (lon * 180) / Math.PI };
}

// ───────────────────────── endereço → coordenadas ─────────────────────────

async function json<T>(url: string, init?: RequestInit, ms = 25000): Promise<T> {
  const ctl = new AbortController();
  const prazo = setTimeout(() => ctl.abort(), ms);
  try {
    const r = await fetch(url, { ...init, signal: ctl.signal });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return (await r.json()) as T;
  } finally {
    clearTimeout(prazo);
  }
}

const espera = (ms: number) => new Promise((ok) => setTimeout(ok, ms));

/** "-23.5614, -46.6559", "-23,5614 -46,6559" ou "-23.5614;-46.6559". */
export function lerCoordenadas(texto: string): Local | null {
  const m = texto.match(/^\s*(-?\d{1,2}(?:[.,]\d+)?)\s*[,;\s]\s*(-?\d{1,3}(?:[.,]\d+)?)\s*$/);
  if (!m) return null;
  const lat = parseFloat(m[1].replace(',', '.')), lon = parseFloat(m[2].replace(',', '.'));
  if (!isFinite(lat) || !isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) return null;
  return { lat, lon, descricao: `${lat.toFixed(6)}, ${lon.toFixed(6)}`, aproximado: '' };
}

type ViaCep = { logradouro?: string; bairro?: string; localidade?: string; uf?: string; erro?: boolean | string };
type Nominatim = { lat: string; lon: string; display_name: string };

async function nominatim(q: string): Promise<Nominatim | null> {
  const url = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=br&accept-language=pt-BR&q=' + encodeURIComponent(q);
  const lista = await json<Nominatim[]>(url);
  return lista.length ? lista[0] : null;
}

/**
 * Acha o local. Para CEP, tenta do mais preciso ao mais geral (rua → bairro → cidade) e avisa quando
 * só achou um ponto aproximado. Lança Error com mensagem para o usuário.
 */
export async function localizar(texto: string): Promise<Local> {
  texto = texto.trim();
  if (!texto) throw new Error('Digite um CEP, um endereço ou as coordenadas.');
  const coord = lerCoordenadas(texto);
  if (coord) return coord;

  const digitos = texto.replace(/\D/g, '');
  const tentativas: { q: string; aviso: string }[] = [];
  if (digitos.length === 8 && /^\s*\d{5}-?\d{3}\s*$/.test(texto)) {
    let c: ViaCep;
    try { c = await json<ViaCep>(`https://viacep.com.br/ws/${digitos}/json/`, undefined, 12000); }
    catch { throw new Error('Não deu para consultar o CEP agora. Tente o endereço por extenso.'); }
    if (!c || c.erro || !c.localidade) throw new Error('CEP não encontrado. Confira os números ou digite o endereço.');
    const cidade = [c.localidade, c.uf].filter(Boolean).join(', ');
    if (c.logradouro) tentativas.push({ q: [c.logradouro, c.bairro, cidade].filter(Boolean).join(', '), aviso: '' });
    if (c.logradouro) tentativas.push({ q: [c.logradouro, cidade].join(', '), aviso: '' });
    if (c.bairro) tentativas.push({ q: [c.bairro, cidade].join(', '), aviso: `o mapa não tem a rua ${c.logradouro || ''}; mostrando o bairro ${c.bairro}` });
    tentativas.push({ q: cidade, aviso: `o mapa só achou a cidade de ${c.localidade}` });
  } else {
    tentativas.push({ q: texto, aviso: '' });
  }

  for (let i = 0; i < tentativas.length; i++) {
    if (i > 0) await espera(1100); // regra de uso do Nominatim: no máximo 1 busca por segundo
    let r: Nominatim | null = null;
    try { r = await nominatim(tentativas[i].q); }
    catch { throw new Error('O serviço de endereços (OpenStreetMap) não respondeu. Tente de novo em alguns segundos.'); }
    if (r) return { lat: parseFloat(r.lat), lon: parseFloat(r.lon), descricao: r.display_name, aproximado: tentativas[i].aviso };
  }
  throw new Error('Endereço não encontrado. Tente com rua, número, cidade e estado, ou cole as coordenadas do Google Maps.');
}

// ───────────────────────── ruas em volta ─────────────────────────

type ElementoOsm = { type: string; tags?: Record<string, string>; geometry?: { lat: number; lon: number }[] };

export async function montar(local: Local, raio: number): Promise<Desenho> {
  const lat = local.lat.toFixed(7), lon = local.lon.toFixed(7);
  // Baixa com folga de 1 raio: dá para mover o local da obra até 1 raio sem buscar de novo.
  const alcance = raio;
  const r = Math.ceil(raio * 1.45 + alcance);
  const consulta = `[out:json][timeout:50];(way["highway"~"^(${TIPOS_VIA})$"](around:${r},${lat},${lon});way["building"](around:${r},${lat},${lon}););out tags geom;`;
  let resp: { elements?: ElementoOsm[] } | null = null;
  for (const servidor of OVERPASS) {
    try {
      resp = await json(servidor, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'data=' + encodeURIComponent(consulta),
      }, 45000);
      break;
    } catch { /* tenta o próximo servidor */ }
  }
  if (!resp) throw new Error('O serviço de mapas (OpenStreetMap) está ocupado. Tente de novo em um minuto.');

  const fuso = fusoDe(local.lon), sul = local.lat < 0;
  const { e: e0, n: n0 } = paraUtm(local.lat, local.lon, fuso);
  const vias: Via[] = [], edificacoes: P2[][] = [];
  for (const el of resp.elements ?? []) {
    if (!el.geometry || el.geometry.length < 2) continue;
    const pts = el.geometry.map((g) => { const u = paraUtm(g.lat, g.lon, fuso); return { x: u.e, y: u.n }; });
    const tags = el.tags ?? {};
    if (tags.highway) vias.push({ nome: tags.name ?? '', tipo: tags.highway, pontos: pts });
    else if (tags.building && pts.length >= 3) edificacoes.push(pts);
  }
  return compor({ vias, edificacoes, e0, n0, alcance }, local, raio, fuso, sul, e0, n0);
}

/** Monta o desenho centrado em (e, n) a partir dos dados já baixados. */
function compor(bruto: Bruto, local: Local, raio: number, fuso: number, sul: boolean, e: number, n: number): Desenho {
  const mover = (p: P2) => ({ x: p.x - e, y: p.y - n });
  const recortadas = recortar(bruto.vias.map((v) => ({ ...v, pontos: v.pontos.map(mover) })), raio);
  const edificacoes = bruto.edificacoes.map((c) => c.map(mover)).filter((c) => {
    const cx = c.reduce((s, p) => s + p.x, 0) / c.length, cy = c.reduce((s, p) => s + p.y, 0) / c.length;
    return Math.abs(cx) <= raio && Math.abs(cy) <= raio;
  });
  return {
    local, raio, fuso, sul, e, n, bruto,
    vias: recortadas.map((v) => ({ ...v, largura: largura(v.tipo) })),
    edificacoes,
    rotulos: rotulos(recortadas, raio * 0.25),
  };
}

/**
 * Move o local da obra (dx, dy em metros, a partir do centro atual) e recentraliza a planta.
 * null quando o ponto novo sai da área já baixada: aí é preciso chamar montar() de novo.
 */
export function recentrar(d: Desenho, dx: number, dy: number): Desenho | null {
  const e = d.e + dx, n = d.n + dy;
  if (Math.abs(e - d.bruto.e0) > d.bruto.alcance || Math.abs(n - d.bruto.n0) > d.bruto.alcance) return null;
  const g = paraGeograficas(e, n, d.fuso, d.sul);
  const local: Local = { ...d.local, lat: g.lat, lon: g.lon, aproximado: '', descricao: descricaoAjustada(d.local.descricao, g.lat, g.lon) };
  return compor(d.bruto, local, d.raio, d.fuso, d.sul, e, n);
}

/** Endereço: mantém e marca "(ponto ajustado no mapa)". Coordenadas: troca pelas novas. */
function descricaoAjustada(antes: string, lat: number, lon: number) {
  const base = antes.replace(/ \(ponto ajustado no mapa\)$/, '');
  return lerCoordenadas(base) ? `${lat.toFixed(6)}, ${lon.toFixed(6)}` : base + ' (ponto ajustado no mapa)';
}

/** Ponto ajustado longe demais: busca de novo em volta das novas coordenadas. */
export async function remontar(d: Desenho, dx: number, dy: number): Promise<Desenho> {
  const g = paraGeograficas(d.e + dx, d.n + dy, d.fuso, d.sul);
  const novo = await montar({ ...d.local, lat: g.lat, lon: g.lon, aproximado: '' }, d.raio);
  novo.local.descricao = descricaoAjustada(d.local.descricao, g.lat, g.lon);
  return novo;
}

const dist = (a: P2, b: P2) => Math.hypot(b.x - a.x, b.y - a.y);
const comprimento = (v: Via) => v.pontos.slice(1).reduce((s, p, i) => s + dist(v.pontos[i], p), 0);

/** Liang–Barsky: recorta o segmento no quadrado [-meio, meio]; null se ficar todo fora. */
export function cortar(a: P2, b: P2, meio: number): [P2, P2] | null {
  const dx = b.x - a.x, dy = b.y - a.y;
  let t0 = 0, t1 = 1;
  const p = [-dx, dx, -dy, dy], q = [a.x + meio, meio - a.x, a.y + meio, meio - a.y];
  for (let i = 0; i < 4; i++) {
    if (Math.abs(p[i]) < 1e-12) { if (q[i] < 0) return null; continue; }
    const t = q[i] / p[i];
    if (p[i] < 0) { if (t > t1) return null; if (t > t0) t0 = t; }
    else { if (t < t0) return null; if (t < t1) t1 = t; }
  }
  return [{ x: a.x + t0 * dx, y: a.y + t0 * dy }, { x: a.x + t1 * dx, y: a.y + t1 * dy }];
}

export function recortar(vias: Via[], meio: number): Via[] {
  const saida: Via[] = [];
  for (const v of vias) {
    let atual: Via | null = null;
    for (let i = 1; i < v.pontos.length; i++) {
      const c = cortar(v.pontos[i - 1], v.pontos[i], meio);
      if (!c) { atual = null; continue; }
      const [a, b] = c;
      if (!atual || dist(atual.pontos[atual.pontos.length - 1], a) > 1e-6) {
        atual = { nome: v.nome, tipo: v.tipo, pontos: [a] };
        saida.push(atual);
      }
      atual.pontos.push(b);
      if (dist(b, v.pontos[i]) > 1e-6) atual = null;
    }
  }
  return saida.filter((x) => x.pontos.length >= 2 && comprimento(x) > 0.5);
}

/** Um rótulo por rua, no meio do trecho mais longo com aquele nome. */
export function rotulos(vias: Via[], minimo: number): Rotulo[] {
  const grupos = new Map<string, Via[]>();
  for (const v of vias) if (v.nome) grupos.set(v.nome, [...(grupos.get(v.nome) ?? []), v]);
  const saida: Rotulo[] = [];
  for (const [nome, lista] of grupos) {
    const maior = lista.reduce((m, v) => (comprimento(v) > comprimento(m) ? v : m));
    const total = comprimento(maior);
    if (total < minimo) continue;
    let acum = 0;
    for (let i = 1; i < maior.pontos.length; i++) {
      const a = maior.pontos[i - 1], b = maior.pontos[i], d = dist(a, b);
      if (acum + d >= total / 2 && d > 1e-9) {
        const t = (total / 2 - acum) / d;
        saida.push({ nome, ponto: { x: a.x + t * (b.x - a.x), y: a.y + t * (b.y - a.y) }, angulo: Math.atan2(b.y - a.y, b.x - a.x) });
        break;
      }
      acum += d;
    }
  }
  return saida;
}

/** Ângulo (rad) que deixa o texto de pé: entre -90° e +90°. */
export function anguloLegivel(a: number) {
  let g = (a * 180) / Math.PI;
  while (g > 90) g -= 180;
  while (g <= -90) g += 180;
  return g;
}

// ───────────────────────── legenda ─────────────────────────

const br = (v: number, casas: number) => v.toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas });

export function legenda(d: Desenho): string[] {
  const c = `Lat ${d.local.lat.toFixed(6)}°  Lon ${d.local.lon.toFixed(6)}°  ·  UTM ${d.fuso}${d.sul ? 'S' : 'N'}  E ${br(d.e, 2)}  N ${br(d.n, 2)} (SIRGAS 2000)`;
  const desc = d.local.descricao.length > 120 ? d.local.descricao.slice(0, 119) + '…' : d.local.descricao;
  return [
    'PLANTA DE SITUAÇÃO',
    desc,
    c,
    `Ruas e edificações: ${FONTE_OSM}. Confira as divisas com o levantamento do lote.`,
    'Gerado grátis em kitprojetista.com.br  ·  No AutoCAD, o Kit Projetista faz isso com um comando (KPSITUACAO).',
  ];
}

// ───────────────────────── DXF (R12, abre em qualquer CAD) ─────────────────────────

const CAMADAS: [string, number][] = [
  ['KP-SITUACAO-VIAS', 253], ['KP-SITUACAO-NOMES', 7], ['KP-SITUACAO-EDIFICACOES', 8],
  ['KP-SITUACAO-OBRA', 6], ['KP-SITUACAO-MOLDURA', 7],
];

/** Texto em Windows-1252 (o que o DXF R12 espera): acentos do português ficam certos. */
function latin1(s: string) {
  return s.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, '-').replace(/…/g, '...').replace(/°/g, '%%d')
    .replace(/[^\x00-\xff]/g, '?');
}

export function gerarDxf(d: Desenho): Uint8Array {
  const L: string[] = [];
  const g = (codigo: number, valor: string | number) => {
    L.push(String(codigo));
    L.push(typeof valor === 'number' ? (Number.isInteger(valor) ? String(valor) : valor.toFixed(4)) : valor);
  };
  const raio = d.raio, h = Math.max(2, raio / 45);

  g(0, 'SECTION'); g(2, 'HEADER');
  g(9, '$ACADVER'); g(1, 'AC1009');
  g(9, '$DWGCODEPAGE'); g(3, 'ANSI_1252');
  g(9, '$INSBASE'); g(10, 0); g(20, 0); g(30, 0);
  g(9, '$EXTMIN'); g(10, -raio); g(20, -raio - h * 8); g(30, 0);
  g(9, '$EXTMAX'); g(10, raio); g(20, raio); g(30, 0);
  g(0, 'ENDSEC');

  g(0, 'SECTION'); g(2, 'TABLES');
  g(0, 'TABLE'); g(2, 'LTYPE'); g(70, 1);
  g(0, 'LTYPE'); g(2, 'CONTINUOUS'); g(70, 0); g(3, 'Solid line'); g(72, 65); g(73, 0); g(40, 0);
  g(0, 'ENDTAB');
  g(0, 'TABLE'); g(2, 'LAYER'); g(70, CAMADAS.length + 1);
  g(0, 'LAYER'); g(2, '0'); g(70, 0); g(62, 7); g(6, 'CONTINUOUS');
  for (const [nome, cor] of CAMADAS) { g(0, 'LAYER'); g(2, nome); g(70, 0); g(62, cor); g(6, 'CONTINUOUS'); }
  g(0, 'ENDTAB');
  g(0, 'TABLE'); g(2, 'STYLE'); g(70, 1);
  g(0, 'STYLE'); g(2, 'STANDARD'); g(70, 0); g(40, 0); g(41, 1); g(50, 0); g(71, 0); g(42, 2.5); g(3, 'arial.ttf'); g(4, '');
  g(0, 'ENDTAB');
  g(0, 'ENDSEC');

  g(0, 'SECTION'); g(2, 'ENTITIES');
  const polilinha = (camada: string, pts: P2[], fechada: boolean, larg = 0) => {
    g(0, 'POLYLINE'); g(8, camada); g(66, 1); g(10, 0); g(20, 0); g(30, 0); g(70, fechada ? 1 : 0);
    if (larg > 0) { g(40, larg); g(41, larg); }
    for (const p of pts) { g(0, 'VERTEX'); g(8, camada); g(10, p.x); g(20, p.y); g(30, 0); }
    g(0, 'SEQEND'); g(8, camada);
  };
  const texto = (camada: string, s: string, p: P2, altura: number, rot = 0, centro = false) => {
    g(0, 'TEXT'); g(8, camada); g(10, p.x); g(20, p.y); g(30, 0); g(40, altura); g(1, latin1(s));
    if (rot) g(50, rot);
    if (centro) { g(72, 1); g(73, 2); g(11, p.x); g(21, p.y); g(31, 0); }
  };
  const linha = (camada: string, a: P2, b: P2) => { g(0, 'LINE'); g(8, camada); g(10, a.x); g(20, a.y); g(30, 0); g(11, b.x); g(21, b.y); g(31, 0); };

  for (const v of [...d.vias].sort((a, b) => b.largura - a.largura)) polilinha('KP-SITUACAO-VIAS', v.pontos, false, v.largura);
  for (const e of d.edificacoes) polilinha('KP-SITUACAO-EDIFICACOES', e, true);
  for (const r of d.rotulos) texto('KP-SITUACAO-NOMES', r.nome, r.ponto, h, anguloLegivel(r.angulo), true);

  const rObra = Math.max(4, raio / 25);
  g(0, 'CIRCLE'); g(8, 'KP-SITUACAO-OBRA'); g(10, 0); g(20, 0); g(30, 0); g(40, rObra);
  linha('KP-SITUACAO-OBRA', { x: -rObra * 1.6, y: 0 }, { x: rObra * 1.6, y: 0 });
  linha('KP-SITUACAO-OBRA', { x: 0, y: -rObra * 1.6 }, { x: 0, y: rObra * 1.6 });
  texto('KP-SITUACAO-OBRA', 'LOCAL DA OBRA', { x: rObra * 1.9, y: rObra * 1.2 }, h);

  polilinha('KP-SITUACAO-MOLDURA', [{ x: -raio, y: -raio }, { x: raio, y: -raio }, { x: raio, y: raio }, { x: -raio, y: raio }], true);

  const nt = raio * 0.09, nb = { x: raio - nt * 1.1, y: raio - nt * 2.4 };
  g(0, 'SOLID'); g(8, 'KP-SITUACAO-MOLDURA');
  g(10, nb.x); g(20, nb.y + nt * 1.6); g(30, 0);
  g(11, nb.x - nt * 0.45); g(21, nb.y); g(31, 0);
  g(12, nb.x + nt * 0.45); g(22, nb.y); g(32, 0);
  g(13, nb.x + nt * 0.45); g(23, nb.y); g(33, 0);
  texto('KP-SITUACAO-MOLDURA', 'N', { x: nb.x, y: nb.y + nt * 2.15 }, h * 1.2, 0, true);

  legenda(d).forEach((l, i) => texto('KP-SITUACAO-MOLDURA', l, { x: -raio, y: -raio - h * 1.6 * (i + 1) }, i === 0 ? h * 1.1 : h * 0.75));

  g(0, 'ENDSEC');
  g(0, 'EOF');

  const s = L.join('\r\n') + '\r\n';
  const bytes = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) bytes[i] = s.charCodeAt(i) & 0xff;
  return bytes;
}
