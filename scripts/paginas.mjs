// Depois do build: cria um index.html para cada endereço (abre direto e ao recarregar, sem erro 404),
// cada um com seu próprio título e descrição para o Google e para o compartilhamento.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const siteUrl = (process.env.SITE_URL || 'https://kitprojetista.com.br').replace(/\/$/, '');
const base = readFileSync('dist/index.html', 'utf8');

const paginas = [
  {
    rota: 'calculadora',
    titulo: 'Calculadora do Projetista | App grátis para sua obra',
    descricao: 'Calcule tijolo, piso, tinta, concreto e telhado, monte a lista de compras e compare o orçamento das lojas com o preço de referência do SINAPI. Grátis, sem cadastro.',
    imagem: 'og-calculadora.png',
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

for (const p of paginas) {
  let html = base.replace(/<title>[^<]*<\/title>/, `<title>${p.titulo}</title>`);
  if (p.idioma) html = html.replace(/<html lang="[^"]*"/, `<html lang="${p.idioma}"`);
  for (const k of ['description', 'og:description', 'twitter:description']) html = trocarMeta(html, k, p.descricao);
  for (const k of ['og:title', 'twitter:title']) html = trocarMeta(html, k, p.titulo);
  html = trocarMeta(html, 'og:url', `${siteUrl}/${p.rota}/`);
  html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${siteUrl}/${p.rota}/$2`);
  if (p.imagem) for (const k of ['og:image', 'twitter:image']) html = trocarMeta(html, k, `${siteUrl}/${p.imagem}`);
  mkdirSync(`dist/${p.rota}`, { recursive: true });
  writeFileSync(`dist/${p.rota}/index.html`, html);
  console.log('página:', p.rota);
}
writeFileSync('dist/404.html', base);
