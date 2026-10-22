// Configurações do site: troque aqui e o site inteiro acompanha.

/** E-mail que recebe os formulários (contato, teste grátis, testadores). */
export const EMAIL_FORMULARIOS = 'contato@kitprojetista.com.br';

/** E-mail mostrado ao público. */
export const EMAIL_CONTATO = 'contato@kitprojetista.com.br';

export const WHATSAPP =
  'https://wa.me/5519992797870?text=' + encodeURIComponent('Olá! Gostaria de tirar dúvidas sobre o Kit Projetista!');

/** Redes sociais (rodapé do site e dados para o Google). */
export const REDES = {
  instagram: 'https://www.instagram.com/kitprojetista/',
  youtube: 'https://www.youtube.com/@KitProjetista',
  tiktok: 'https://www.tiktok.com/@kitprojetista',
  linkedin: 'https://www.linkedin.com/company/kit-projetista/',
};

/** Pasta com o instalador do teste grátis (liberada depois do formulário). */
export const LINK_TESTE_GRATIS =
  'https://drive.google.com/drive/folders/1ptgHDdMY3EdYjNpjO7veeJzzWjYXIGhA?usp=drive_link';

/** Link da Calculadora na Play Store. Vazio = botão escondido (app ainda em teste). */
export const PLAY_STORE = '';

/** ID do Short do YouTube mostrado na página da Calculadora (o que vem depois de /shorts/). Vazio = sem vídeo. */
export const YOUTUBE_SHORT = 'OU_fz9o2fj4';

/** Caminho base do site (vem do build: "/" com domínio próprio, "/nome-do-repo/" no github.io). */
export const BASE = import.meta.env.BASE_URL;

/** Monta um link interno respeitando o caminho base. */
export const rota = (caminho = '') => BASE + caminho.replace(/^\//, '');

/**
 * Planos para quem é de fora (página /en/): preço em dólar e link da oferta internacional da Hotmart.
 * Link vazio = o botão leva ao formulário de contato. A página em inglês nunca mostra os preços em reais.
 */
export const PLANOS_EN = {
  mensal: { preco: '9.90', link: 'https://pay.hotmart.com/S107938754U?off=4lxmsw4s' },
  anual: { preco: '89', link: 'https://pay.hotmart.com/S107938754U?off=uz739tzs' },
};

/** Quem está por trás do Kit (seção "Quem faz o Kit" no site). CREA vazio = não aparece. */
export const EQUIPE = {
  nome: 'Danielle Prendin',
  foto: 'danielle-prendin.jpg',
  linkedin: 'https://www.linkedin.com/in/danielleprendin/',
  crea: '5071393854',
};
