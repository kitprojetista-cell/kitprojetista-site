import { EMAIL_FORMULARIOS } from './config';

const CHAVE_PENDENTES = 'kp_formularios_pendentes';
const TEMPO_LIMITE_MS = 8000;

type Pendente = { assunto: string; dados: Record<string, string>; quando: string };

/**
 * Envia um formulário por e-mail usando o FormSubmit (funciona em site estático).
 * Na primeira vez, o FormSubmit manda um e-mail de ativação para EMAIL_FORMULARIOS.
 * Desiste depois de 8 segundos, para o visitante não ficar preso esperando um serviço fora do ar.
 */
export async function enviarFormulario(assunto: string, dados: Record<string, string>) {
  const controle = new AbortController();
  const prazo = setTimeout(() => controle.abort(), TEMPO_LIMITE_MS);
  try {
    const resposta = await fetch(`https://formsubmit.co/ajax/${EMAIL_FORMULARIOS}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        ...dados,
        _subject: assunto,
        _template: 'table',
        _replyto: dados['E-mail'] ?? '',
      }),
      signal: controle.signal,
    });
    if (!resposta.ok) throw new Error('Falha no envio');
    const json = await resposta.json().catch(() => ({}));
    if (json && (json.success === false || json.success === 'false')) throw new Error(json.message || 'Falha no envio');
  } finally {
    clearTimeout(prazo);
  }
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
