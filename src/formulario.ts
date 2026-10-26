import { EMAIL_FORMULARIOS, WEB3FORMS_CHAVE } from './config';

const CHAVE_PENDENTES = 'kp_formularios_pendentes';
const TEMPO_LIMITE_MS = 8000;

type Pendente = { assunto: string; dados: Record<string, string>; quando: string };

/** POST com prazo: desiste depois de 8 s, para o visitante não ficar preso num serviço fora do ar. */
async function postar(url: string, corpo: Record<string, string>) {
  const controle = new AbortController();
  const prazo = setTimeout(() => controle.abort(), TEMPO_LIMITE_MS);
  try {
    const resposta = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(corpo),
      signal: controle.signal,
    });
    if (!resposta.ok) throw new Error('Falha no envio');
    const json = await resposta.json().catch(() => ({}));
    if (json && (json.success === false || json.success === 'false')) throw new Error(json.message || 'Falha no envio');
  } finally {
    clearTimeout(prazo);
  }
}

/**
 * Envia um formulário para o e-mail do Kit. Tenta o Web3Forms e, se falhar, o FormSubmit.
 * Só dá erro se os dois falharem.
 */
export async function enviarFormulario(assunto: string, dados: Record<string, string>) {
  const email = dados['E-mail'] ?? '';
  try {
    await postar('https://api.web3forms.com/submit', {
      ...dados,
      access_key: WEB3FORMS_CHAVE,
      subject: assunto,
      from_name: 'Site Kit Projetista',
      ...(email ? { replyto: email } : {}),
    });
    return;
  } catch {
    // segue para o serviço de reserva
  }
  await postar(`https://formsubmit.co/ajax/${EMAIL_FORMULARIOS}`, {
    ...dados,
    _subject: assunto,
    _template: 'table',
    _replyto: email,
  });
}

/** Guarda no navegador um formulário que não foi enviado, para tentar de novo na próxima visita. */
export function guardarPendente(assunto: string, dados: Record<string, string>) {
  try {
    const lista: Pendente[] = JSON.parse(localStorage.getItem(CHAVE_PENDENTES) || '[]');
    lista.push({ assunto, dados, quando: new Date().toISOString() });
    localStorage.setItem(CHAVE_PENDENTES, JSON.stringify(lista.slice(-5)));
  } catch { /* navegador sem armazenamento: segue sem guardar */ }
}

/** Reenvia, em segundo plano, os formulários que ficaram pendentes. Chamado ao abrir o site. */
export async function reenviarPendentes() {
  let lista: Pendente[] = [];
  try { lista = JSON.parse(localStorage.getItem(CHAVE_PENDENTES) || '[]'); } catch { return; }
  if (!lista.length) return;
  const sobra: Pendente[] = [];
  for (const p of lista) {
    try {
      await enviarFormulario(p.assunto, { ...p.dados, 'Enviado com atraso': `sim (preenchido em ${p.quando})` });
    } catch {
      sobra.push(p);
    }
  }
  try {
    if (sobra.length) localStorage.setItem(CHAVE_PENDENTES, JSON.stringify(sobra));
    else localStorage.removeItem(CHAVE_PENDENTES);
  } catch { /* nada */ }
}
