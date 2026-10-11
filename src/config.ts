// Configurações do site: troque aqui e o site inteiro acompanha.

/** E-mail que recebe os formulários (contato, teste grátis, testadores). */
export const EMAIL_FORMULARIOS = 'kitprojetista@gmail.com';

/** E-mail mostrado ao público. */
export const EMAIL_CONTATO = 'contato@kitprojetista.com.br';

export const WHATSAPP =
  'https://wa.me/5519992797870?text=' + encodeURIComponent('Olá! Gostaria de tirar dúvidas sobre o Kit Projetista!');

/** Pasta com o instalador do teste grátis (liberada depois do formulário). */
export const LINK_TESTE_GRATIS =
  'https://drive.google.com/drive/folders/1ptgHDdMY3EdYjNpjO7veeJzzWjYXIGhA?usp=drive_link';

/** Link da Calculadora na Play Store. Vazio = botão escondido (app ainda em teste). */
export const PLAY_STORE = '';

/** ID do Short do YouTube mostrado na página da Calculadora (o que vem depois de /shorts/). Vazio = sem vídeo. */
export const YOUTUBE_SHORT = '';

/** Caminho base do site (vem do build: "/" com domínio próprio, "/nome-do-repo/" no github.io). */
export const BASE = import.meta.env.BASE_URL;

/** Monta um link interno respeitando o caminho base. */
export const rota = (caminho = '') => BASE + caminho.replace(/^\//, '');
