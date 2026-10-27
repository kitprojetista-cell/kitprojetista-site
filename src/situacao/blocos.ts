// Reserva do Overpass: as mesmas ruas e edificações do OpenStreetMap, lidas dos blocos vetoriais do
// OpenFreeMap (esquema OpenMapTiles). Grátis, sem chave e sem limite de pedidos; exige crédito ao
// OpenMapTiles e ao OpenStreetMap. Os blocos vêm em Mapbox Vector Tile (protobuf), lido aqui sem biblioteca.

export const FONTE_BLOCOS = '© OpenMapTiles © colaboradores do OpenStreetMap (ODbL), via OpenFreeMap';

const TILEJSON = 'https://tiles.openfreemap.org/planet';
const Z = 14; // maior zoom com todos os dados (~0,5 m de precisão no Brasil)

export type Ponto = { lat: number; lon: number };
export type ViaBloco = { nome: string; tipo: string; pontos: Ponto[] };

// ───────────────────────── protobuf mínimo ─────────────────────────

class Leitor {
  pos = 0;
  private b: Uint8Array;
  private fim: number;
  constructor(b: Uint8Array, fim = b.length) { this.b = b; this.fim = fim; }
  get acabou() { return this.pos >= this.fim; }
  varint(): number {
    let r = 0, mult = 1, byte: number;
    do {
      byte = this.b[this.pos++];
      r += (byte & 0x7f) * mult;
      mult *= 128;
    } while (byte & 0x80);
    return r;
  }
  /** Campo: [número, tipo]. */
  chave(): [number, number] { const v = this.varint(); return [Math.floor(v / 8), v & 7]; }
  sub(): Leitor { const n = this.varint(); const l = new Leitor(this.b, this.pos + n); l.pos = this.pos; this.pos += n; return l; }
  texto(): string { const n = this.varint(); const s = new TextDecoder().decode(this.b.subarray(this.pos, this.pos + n)); this.pos += n; return s; }
  empacotados(): number[] { const l = this.sub(); const r: number[] = []; while (!l.acabou) r.push(l.varint()); return r; }
  pular(tipo: number) {
    if (tipo === 0) this.varint();
    else if (tipo === 1) this.pos += 8;
    else if (tipo === 2) this.pos += this.varint();
    else if (tipo === 5) this.pos += 4;
    else throw new Error('protobuf inválido');
  }
}

type Feicao = { tipo: number; tags: Record<string, string>; geom: number[] };
type Camada = { nome: string; extent: number; feicoes: Feicao[] };

function lerValor(l: Leitor): string {
  let v = '';
  while (!l.acabou) {
    const [campo, tipo] = l.chave();
    if (campo === 1 && tipo === 2) v = l.texto();
    else if (tipo === 0) v = String(l.varint());
    else l.pular(tipo);
  }
  return v;
}

export function lerBloco(dados: Uint8Array, quero: Set<string>): Camada[] {
  const camadas: Camada[] = [];
  const t = new Leitor(dados);
  while (!t.acabou) {
    const [campo, tipo] = t.chave();
    if (campo !== 3 || tipo !== 2) { t.pular(tipo); continue; }
    const l = t.sub();
    let nome = '', extent = 4096;
    const chaves: string[] = [], valores: string[] = [], brutas: { tipo: number; tags: number[]; geom: number[] }[] = [];
    while (!l.acabou) {
      const [c, tp] = l.chave();
      if (c === 1) nome = l.texto();
      else if (c === 2) {
        const f = l.sub();
        const b = { tipo: 0, tags: [] as number[], geom: [] as number[] };
        while (!f.acabou) {
          const [cf, tf] = f.chave();
          if (cf === 2) b.tags = f.empacotados();
          else if (cf === 3) b.tipo = f.varint();
          else if (cf === 4) b.geom = f.empacotados();
          else f.pular(tf);
        }
        brutas.push(b);
      } else if (c === 3) chaves.push(l.texto());
      else if (c === 4) valores.push(lerValor(l.sub()));
      else if (c === 5) extent = l.varint();
      else l.pular(tp);
    }
    if (!quero.has(nome)) continue;
    camadas.push({
      nome, extent,
      feicoes: brutas.map((b) => {
        const tags: Record<string, string> = {};
        for (let i = 0; i + 1 < b.tags.length; i += 2) tags[chaves[b.tags[i]]] = valores[b.tags[i + 1]];
        return { tipo: b.tipo, tags, geom: b.geom };
      }),
    });
  }
  return camadas;
}

/** Comandos de geometria do MVT → partes (linhas ou anéis) em coordenadas do bloco. */
export function partes(geom: number[]): [number, number][][] {
  const r: [number, number][][] = [];
  let x = 0, y = 0, i = 0, atual: [number, number][] = [];
  const zz = (n: number) => (n >>> 1) ^ -(n & 1);
  while (i < geom.length) {
    const cmd = geom[i] & 7, n = geom[i] >>> 3;
    i++;
    if (cmd === 7) { if (atual.length) atual.push(atual[0]); continue; }
    for (let k = 0; k < n; k++) {
      x += zz(geom[i++]); y += zz(geom[i++]);
      if (cmd === 1) { if (atual.length) r.push(atual); atual = []; }
      atual.push([x, y]);
    }
  }
  if (atual.length) r.push(atual);
  return r;
}

// ───────────────────────── blocos em volta do lote ─────────────────────────

const blocoX = (lon: number) => ((lon + 180) / 360) * 2 ** Z;
const blocoY = (lat: number) => { const r = (lat * Math.PI) / 180; return ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * 2 ** Z; };
const lonDe = (x: number) => (x / 2 ** Z) * 360 - 180;
const latDe = (y: number) => (Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / 2 ** Z))) * 180) / Math.PI;

/** Tipo do OpenMapTiles → tipo de via do OpenStreetMap usado no desenho (null = não é rua). */
function tipoVia(t: Record<string, string>): string | null {
  switch (t.class) {
    case 'motorway': case 'trunk': case 'primary': case 'secondary': case 'tertiary': case 'service': return t.class;
    case 'minor': return t.subclass === 'living_street' ? 'living_street' : 'residential';
    case 'path': return t.subclass === 'pedestrian' ? 'pedestrian' : null;
    default: return null;
  }
}

/** Recorta uma linha no quadrado do bloco (os blocos repetem um pedaço do vizinho na borda). */
function recortarNoBloco(linha: [number, number][], ext: number): [number, number][][] {
  const saida: [number, number][][] = [];
  let atual: [number, number][] = [];
  const dentro = (p: [number, number]) => p[0] >= 0 && p[0] <= ext && p[1] >= 0 && p[1] <= ext;
  for (let i = 1; i < linha.length; i++) {
    const a = linha[i - 1], b = linha[i];
    let t0 = 0, t1 = 1;
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const p = [-dx, dx, -dy, dy], q = [a[0], ext - a[0], a[1], ext - a[1]];
    let fora = false;
    for (let k = 0; k < 4 && !fora; k++) {
      if (p[k] === 0) { if (q[k] < 0) fora = true; continue; }
      const t = q[k] / p[k];
      if (p[k] < 0) { if (t > t1) fora = true; else if (t > t0) t0 = t; } else { if (t < t0) fora = true; else if (t < t1) t1 = t; }
    }
    if (fora) { if (atual.length > 1) saida.push(atual); atual = []; continue; }
    const pa: [number, number] = [a[0] + t0 * dx, a[1] + t0 * dy], pb: [number, number] = [a[0] + t1 * dx, a[1] + t1 * dy];
    if (!atual.length) atual.push(pa);
    atual.push(pb);
    if (t1 < 1 || !dentro(b)) { if (atual.length > 1) saida.push(atual); atual = []; }
  }
  if (atual.length > 1) saida.push(atual);
  return saida;
}

function distPontoLinha(p: [number, number], l: [number, number][]) {
  let m = Infinity;
  for (let i = 1; i < l.length; i++) {
    const [ax, ay] = l[i - 1], [bx, by] = l[i];
    const dx = bx - ax, dy = by - ay, d2 = dx * dx + dy * dy;
    const t = d2 ? Math.max(0, Math.min(1, ((p[0] - ax) * dx + (p[1] - ay) * dy) / d2)) : 0;
    m = Math.min(m, Math.hypot(p[0] - ax - t * dx, p[1] - ay - t * dy));
  }
  return m;
}

let urlBlocos: string | null = null;

async function baixar(url: string, ms: number): Promise<Response> {
  const ctl = new AbortController();
  const prazo = setTimeout(() => ctl.abort(), ms);
  try {
    const r = await fetch(url, { signal: ctl.signal });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r;
  } finally { clearTimeout(prazo); }
}

/** Ruas (com nome e tipo) e contornos de edificações num círculo de `raio` metros em volta do ponto. */
export async function arredoresPorBlocos(lat: number, lon: number, raio: number): Promise<{ vias: ViaBloco[]; edificacoes: Ponto[][] }> {
  if (!urlBlocos) urlBlocos = ((await (await baixar(TILEJSON, 15000)).json()) as { tiles: string[] }).tiles[0];
  const dLat = raio / 111320, dLon = raio / (111320 * Math.cos((lat * Math.PI) / 180));
  const x0 = Math.floor(blocoX(lon - dLon)), x1 = Math.floor(blocoX(lon + dLon));
  const y0 = Math.floor(blocoY(lat + dLat)), y1 = Math.floor(blocoY(lat - dLat));
  const pedidos: Promise<{ x: number; y: number; camadas: Camada[] }>[] = [];
  for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) {
    const url = urlBlocos.replace('{z}', String(Z)).replace('{x}', String(x)).replace('{y}', String(y));
    pedidos.push(baixar(url, 20000).then(async (r) => ({
      x, y, camadas: lerBloco(new Uint8Array(await r.arrayBuffer()), new Set(['transportation', 'transportation_name', 'building'])),
    })));
  }
  // Um bloco que falhar (ou não existir, no mar) não derruba os outros; só desiste se todos falharem.
  const blocos = (await Promise.all(pedidos.map((p) => p.catch(() => null)))).filter((b): b is { x: number; y: number; camadas: Camada[] } => b !== null);
  if (!blocos.length) throw new Error('blocos');

  const vias: ViaBloco[] = [], edificacoes: Ponto[][] = [];
  const vistos = new Set<string>();
  for (const b of blocos) {
    const geo = (ext: number) => (p: [number, number]): Ponto => ({ lon: lonDe(b.x + p[0] / ext), lat: latDe(b.y + p[1] / ext) });
    const nomes: { nome: string; linha: [number, number][] }[] = [];
    const camada = (n: string) => b.camadas.find((c) => c.nome === n);
    const tn = camada('transportation_name');
    for (const f of tn?.feicoes ?? []) if (f.tags.name) for (const l of partes(f.geom)) nomes.push({ nome: f.tags.name, linha: l });

    const tr = camada('transportation');
    if (tr) for (const f of tr.feicoes) {
      const tipo = tipoVia(f.tags);
      if (!tipo || f.tipo !== 2) continue;
      for (const l of partes(f.geom)) for (const pedaco of recortarNoBloco(l, tr.extent)) {
        // nome: o da linha de nome mais próxima do meio do trecho (as duas camadas têm o mesmo traçado)
        const meio = pedaco[Math.floor(pedaco.length / 2)];
        let nome = '', melhor = 4; // até ~2 m (unidades do bloco)
        for (const n of nomes) { const d = distPontoLinha(meio, n.linha); if (d < melhor) { melhor = d; nome = n.nome; } }
        vias.push({ nome, tipo, pontos: pedaco.map(geo(tr.extent)) });
      }
    }

    const ed = camada('building');
    if (ed) for (const f of ed.feicoes) {
      if (f.tipo !== 3) continue;
      for (const anel of partes(f.geom)) {
        if (anel.length < 4) continue;
        let area = 0;
        for (let i = 1; i < anel.length; i++) area += anel[i - 1][0] * anel[i][1] - anel[i][0] * anel[i - 1][1];
        if (area <= 0) continue; // furo (no MVT o contorno externo tem área positiva)
        const cx = anel.reduce((s, p) => s + p[0], 0) / anel.length, cy = anel.reduce((s, p) => s + p[1], 0) / anel.length;
        if (cx < 0 || cx > ed.extent || cy < 0 || cy > ed.extent) continue; // repetido do bloco vizinho
        const pts = anel.slice(0, -1).map(geo(ed.extent));
        const chave = pts.map((p) => p.lat.toFixed(6) + ',' + p.lon.toFixed(6)).sort().join(';');
        if (vistos.has(chave)) continue;
        vistos.add(chave);
        edificacoes.push(pts);
      }
    }
  }
  return { vias, edificacoes };
}
