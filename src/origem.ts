/**
 * De onde a pessoa veio, para medir o que traz teste do Kit: a página onde pediu o teste e, se chegou por um
 * link nosso com ?origem=... (os e-mails da sequência), essa campanha. Fica só nesta aba do navegador.
 */
const CHAVE = 'kp-origem';

export function guardarCampanha() {
  try {
    const o = new URLSearchParams(window.location.search).get('origem');
    if (o && /^[\w-]{2,40}$/.test(o)) sessionStorage.setItem(CHAVE, o);
  } catch { /* sem armazenamento: segue sem campanha */ }
}

export function campanha(): string {
  try { return sessionStorage.getItem(CHAVE) || ''; } catch { return ''; }
}
