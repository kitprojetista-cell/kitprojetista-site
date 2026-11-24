import { Desenho, P2, largura } from './situacao';

/**
 * Cota do lote até a esquina (versão completa, opcional). Tudo em metros, com o local da obra em (0,0).
 * 1. A rua da frente é a mais perto do local da obra; os trechos com o mesmo nome viram uma linha só.
 * 2. Andando pela rua nos dois sentidos, a esquina é o primeiro cruzamento com outra rua
 *    (cruzamento geométrico: serve para o Overpass e para a reserva em blocos vetoriais).
 * 3. A distância vai do ponto da frente do lote até o alinhamento da rua transversal (meia largura antes do eixo).
 * É uma referência pelo mapa: a pessoa pode digitar o valor da matrícula, e o desenho avisa para conferir.
 */
export type Esquina = {
  rua: string;            // rua da frente
  cruza: string;          // rua da esquina
  distancia: number;      // m, ao longo da rua
  caminho: P2[];          // eixo da rua, da frente do lote até o alinhamento da transversal
  cota: P2[];             // o mesmo caminho deslocado para o lado do lote (onde a cota é desenhada)
};

const d2 = (a: P2, b: P2) => Math.hypot(b.x - a.x, b.y - a.y);
// Acesso de serviço (garagem, condomínio) não faz esquina; calçadão (pedestrian) faz: é rua que fecha a quadra.
const NAO_ESQUINA = new Set(['service']);

type ViaL = { nome: string; tipo: string; pontos: P2[] };

/** Junta os trechos da mesma rua que se tocam pelas pontas, a partir do trecho `base`. */
function encadear(base: ViaL, outras: ViaL[], usados: Set<ViaL>): P2[] {
  let cadeia = [...base.pontos];
  const resto = [...outras];
  const perto = (a: P2, b: P2) => d2(a, b) < 0.6;
  for (let mudou = true; mudou;) {
    mudou = false;
    for (let i = 0; i < resto.length; i++) {
      const p = resto[i].pontos, ini = cadeia[0], fim = cadeia[cadeia.length - 1];
      if (perto(fim, p[0])) cadeia = [...cadeia, ...p.slice(1)];
      else if (perto(fim, p[p.length - 1])) cadeia = [...cadeia, ...[...p].reverse().slice(1)];
      else if (perto(ini, p[p.length - 1])) cadeia = [...p.slice(0, -1), ...cadeia];
      else if (perto(ini, p[0])) cadeia = [...[...p].reverse().slice(0, -1), ...cadeia];
      else continue;
      usados.add(resto[i]); resto.splice(i, 1); mudou = true; break;
    }
  }
  return cadeia;
}

/** Projeção de (0,0) na polilinha: posição ao longo dela (s), o ponto e o segmento. */
function projetar(pts: P2[]) {
  let melhor = { s: 0, p: pts[0], k: 0, dist: Infinity }, acum = 0;
  for (let k = 1; k < pts.length; k++) {
    const a = pts[k - 1], b = pts[k], L = d2(a, b);
    if (L < 1e-9) continue;
    const t = Math.max(0, Math.min(1, -(a.x * (b.x - a.x) + a.y * (b.y - a.y)) / (L * L)));
    const p = { x: a.x + t * (b.x - a.x), y: a.y + t * (b.y - a.y) }, dist = Math.hypot(p.x, p.y);
    if (dist < melhor.dist) melhor = { s: acum + t * L, p, k, dist };
    acum += L;
  }
  return melhor;
}

/** Interseção dos segmentos ab e cd (cd estendido 0,6 m em cada ponta, para pegar o "T" que quase encosta). */
function cruzar(a: P2, b: P2, c: P2, d: P2): number | null {
  const L = d2(c, d);
  if (L < 1e-9) return null;
  const ux = (d.x - c.x) / L, uy = (d.y - c.y) / L, ext = 0.6;
  const c2 = { x: c.x - ux * ext, y: c.y - uy * ext }, d2b = { x: d.x + ux * ext, y: d.y + uy * ext };
  const r = { x: b.x - a.x, y: b.y - a.y }, s = { x: d2b.x - c2.x, y: d2b.y - c2.y };
  const den = r.x * s.y - r.y * s.x;
  if (Math.abs(den) < 1e-9) return null;
  const t = ((c2.x - a.x) * s.y - (c2.y - a.y) * s.x) / den;
  const u = ((c2.x - a.x) * r.y - (c2.y - a.y) * r.x) / den;
  return t >= 0 && t <= 1 && u >= 0 && u <= 1 ? t : null;
}

/** Ponto e trecho da polilinha entre as posições s1 e s2 (s1 < s2). */
function trecho(pts: P2[], s1: number, s2: number): P2[] {
  const saida: P2[] = [];
  let acum = 0;
  const em = (a: P2, b: P2, t: number) => ({ x: a.x + t * (b.x - a.x), y: a.y + t * (b.y - a.y) });
  for (let k = 1; k < pts.length; k++) {
    const a = pts[k - 1], b = pts[k], L = d2(a, b), ini = acum, fim = acum + L;
    if (L > 1e-9 && fim > s1 && ini < s2) {
      if (!saida.length) saida.push(em(a, b, Math.max(0, (s1 - ini) / L)));
      if (fim <= s2) saida.push(b); else { saida.push(em(a, b, (s2 - ini) / L)); break; }
    }
    acum = fim;
  }
  return saida.filter((p, i) => i === 0 || d2(p, saida[i - 1]) > 1e-6);
}

/** Desloca a polilinha `dist` metros para a esquerda (dist > 0) ou direita (dist < 0) do sentido dela. */
function deslocar(pts: P2[], dist: number): P2[] {
  const normal = (a: P2, b: P2) => { const L = d2(a, b) || 1; return { x: -(b.y - a.y) / L, y: (b.x - a.x) / L }; };
  return pts.map((p, i) => {
    const n1 = i > 0 ? normal(pts[i - 1], p) : normal(p, pts[i + 1]);
    const n2 = i < pts.length - 1 ? normal(p, pts[i + 1]) : n1;
    const n = { x: n1.x + n2.x, y: n1.y + n2.y }, L = Math.hypot(n.x, n.y) || 1;
    return { x: p.x + (n.x / L) * dist, y: p.y + (n.y / L) * dist };
  });
}

/** As esquinas mais próximas do lote, uma para cada lado da rua da frente (a mais perto primeiro). */
export function esquinas(d: Desenho): Esquina[] {
  const vias: ViaL[] = d.bruto.vias.map((v) => ({ ...v, pontos: v.pontos.map((p) => ({ x: p.x - d.e, y: p.y - d.n })) }))
    .filter((v) => v.pontos.length >= 2);
  if (!vias.length) return [];
  // 1. rua da frente
  let frente = vias[0], menor = Infinity;
  for (const v of vias) { const p = projetar(v.pontos); if (p.dist < menor) { menor = p.dist; frente = v; } }
  const mesma = (v: ViaL) => v === frente || (!!frente.nome && v.nome === frente.nome);
  const membros = new Set<ViaL>([frente]);
  const cadeia = encadear(frente, vias.filter((v) => v !== frente && mesma(v)), membros);
  const f = projetar(cadeia);
  // 2. cruzamentos com as outras ruas, como posição ao longo da cadeia
  const cruzamentos: { s: number; via: ViaL }[] = [];
  let acum = 0;
  for (let k = 1; k < cadeia.length; k++) {
    const a = cadeia[k - 1], b = cadeia[k], L = d2(a, b);
    for (const v of vias) {
      // trechos da própria cadeia não contam; um trecho com o mesmo nome que cruza a rua (fora da cadeia) conta
      if (membros.has(v) || NAO_ESQUINA.has(v.tipo)) continue;
      for (let j = 1; j < v.pontos.length; j++) {
        const t = cruzar(a, b, v.pontos[j - 1], v.pontos[j]);
        if (t !== null) cruzamentos.push({ s: acum + t * L, via: v });
      }
    }
    acum += L;
  }
  // 3. a mais próxima de cada lado
  const lado = (sinal: 1 | -1) => cruzamentos.filter((c) => (c.s - f.s) * sinal > 0.5)
    .sort((x, y) => Math.abs(x.s - f.s) - Math.abs(y.s - f.s))[0];
  // lado do lote: à esquerda ou à direita do sentido da cadeia no ponto da frente
  const a = cadeia[Math.max(0, f.k - 1)], b = cadeia[Math.min(cadeia.length - 1, f.k)];
  const esquerda = (b.x - a.x) * (0 - f.p.y) - (b.y - a.y) * (0 - f.p.x) >= 0;
  const afastar = largura(frente.tipo) / 2 + Math.max(2, d.raio / 40);
  const saida: Esquina[] = [];
  for (const sinal of [1, -1] as const) {
    const c = lado(sinal);
    if (!c) continue;
    const meia = largura(c.via.tipo) / 2;
    const sEsq = c.s - sinal * meia;
    const distancia = Math.max(0, Math.abs(sEsq - f.s));
    if (distancia < 0.5) continue;
    let caminho = sinal > 0 ? trecho(cadeia, f.s, sEsq) : trecho(cadeia, sEsq, f.s).reverse();
    if (caminho.length < 2) continue;
    // o sentido do caminho pode ter invertido em relação à cadeia: o lado do lote segue a cadeia
    const desl = (esquerda ? 1 : -1) * (sinal > 0 ? 1 : -1) * afastar;
    saida.push({ rua: frente.nome || 'rua sem nome', cruza: !c.via.nome ? 'rua sem nome' : c.via.nome === frente.nome ? 'rua transversal' : c.via.nome, distancia, caminho, cota: deslocar(caminho, desl) });
  }
  return saida.sort((x, y) => x.distancia - y.distancia);
}
