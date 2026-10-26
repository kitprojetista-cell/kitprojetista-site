// Depois do build: cria um index.html para cada endereço (abre direto e ao recarregar, sem erro 404),
// cada um com seu próprio título e descrição para o Google e para o compartilhamento.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { render, paginasTutoriais } from '../dist-ssr/entry-server.js';

const siteUrl = (process.env.SITE_URL || 'https://kitprojetista.com.br').replace(/\/$/, '');
const base = readFileSync('dist/index.html', 'utf8');
const basePath = process.env.BASE_PATH || '/';

/** Põe o HTML já renderizado da página dentro do <div id="root"> (o navegador monta por cima depois). */
const comConteudo = (html, rota) => {
  const corpo = render(basePath + (rota ? rota + '/' : ''));
  if (!html.includes('<div id="root"></div>')) throw new Error('index.html sem <div id="root"></div>');
  return html.replace('<div id="root"></div>', `<div id="root">${corpo}</div>`);
};
writeFileSync('dist/index.html', comConteudo(base, ''));
console.log('página: (inicial)');

const paginas = [
  {
    rota: 'en',
    titulo: 'Kit Projetista | AutoCAD plugin',
    descricao: 'AutoCAD and Civil 3D tools that turn repetitive tasks into a few clicks: line lengths by layer, quantities, auto numbering, dimensions, area schedules and batch sheets. Free 7-day trial.',
    idioma: 'en',
  },
  {
    rota: 'calculadora',
    titulo: 'Calculadora do Projetista | App grátis para sua obra',
    descricao: 'Calcule tijolo, piso, tinta, concreto e telhado, monte a lista de compras e compare o orçamento das lojas com o preço de referência do SINAPI. Grátis, sem cadastro.',
    imagem: 'og-calculadora.png',
  },
  {
    rota: 'planta-de-situacao',
    titulo: 'Planta de situação grátis pelo CEP, em DXF | Kit Projetista',
    descricao: 'Gere a planta de situação do lote pelo CEP ou endereço: ruas reais com nomes, norte, local da obra e coordenadas UTM. Baixe em DXF e abra no AutoCAD ou em qualquer CAD. Grátis.',
  },
  {
    rota: 'calculadora/privacidade',
    titulo: 'Política de privacidade | Calculadora do Projetista',
    descricao: 'O app não pede cadastro, não coleta dados e não tem anúncios. Veja o que fica no seu celular e o que usa da internet.',
  },
  {
    rota: 'privacidade',
    titulo: 'Política de privacidade | Kit Projetista',
    descricao: 'Como o Kit Projetista, o site e o atendimento tratam os seus dados, conforme a LGPD.',
  },
  {
    rota: 'termos',
    titulo: 'Termos de uso | Kit Projetista',
    descricao: 'Termos de uso do Kit Projetista: licença, teste grátis, assinatura, reembolso e suporte.',
  },
  {
    rota: 'en/privacy',
    titulo: 'Privacy policy | Kit Projetista',
    descricao: 'How Kit Projetista, its website and support handle your data.',
    idioma: 'en',
  },
  {
    rota: 'en/terms',
    titulo: 'Terms of use | Kit Projetista',
    descricao: 'Kit Projetista terms of use: license, free trial, subscription, refunds and support.',
    idioma: 'en',
  },
];

const trocarMeta = (html, chave, valor) =>
  html.replace(new RegExp(`(<meta (?:name|property)="${chave}" content=")[^"]*(")`), `$1${valor}$2`);

paginas.push(...paginasTutoriais);

for (const p of paginas) {
  let html = base.replace(/<title>[^<]*<\/title>/, `<title>${p.titulo}</title>`);
  if (p.idioma) html = html.replace(/<html lang="[^"]*"/, `<html lang="${p.idioma}"`);
  if (p.idioma === 'en') html = trocarMeta(html, 'og:locale', 'en_US');
  // hreflang só faz sentido na inicial em português e na em inglês
  if (p.rota !== 'en') html = html.replace(/\s*<link rel="alternate" hreflang="[^"]*" href="[^"]*" \/>/g, '');
  for (const k of ['description', 'og:description', 'twitter:description']) html = trocarMeta(html, k, p.descricao);
  for (const k of ['og:title', 'twitter:title']) html = trocarMeta(html, k, p.titulo);
  html = trocarMeta(html, 'og:url', `${siteUrl}/${p.rota}/`);
  html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${siteUrl}/${p.rota}/$2`);
  if (p.imagem) for (const k of ['og:image', 'twitter:image']) html = trocarMeta(html, k, `${siteUrl}/${p.imagem}`);
  mkdirSync(`dist/${p.rota}`, { recursive: true });
  writeFileSync(`dist/${p.rota}/index.html`, comConteudo(html, p.rota));
  console.log('página:', p.rota);
}
writeFileSync('dist/404.html', base);

// sitemap.xml com todas as páginas (o Google lê para achar as páginas novas)
const prioridade = { '': '1.0', 'planta-de-situacao': '0.9', tutoriais: '0.8', calculadora: '0.8', en: '0.7' };
const hoje = new Date().toISOString().slice(0, 10);
const urls = ['', ...paginas.map((p) => p.rota)].map((r) => {
  const pr = prioridade[r] ?? (paginasTutoriais.some((t) => t.rota === r) ? '0.8' : '0.3');
  return `  <url><loc>${siteUrl}/${r ? r + '/' : ''}</loc><lastmod>${hoje}</lastmod><priority>${pr}</priority></url>`;
});
writeFileSync('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);
console.log('sitemap:', urls.length, 'páginas');
