import { EMAIL_FORMULARIOS } from './config';

/**
 * Envia um formulário por e-mail usando o FormSubmit (funciona em site estático).
 * Na primeira vez, o FormSubmit manda um e-mail de ativação para EMAIL_FORMULARIOS.
 */
export async function enviarFormulario(assunto: string, dados: Record<string, string>) {
  const resposta = await fetch(`https://formsubmit.co/ajax/${EMAIL_FORMULARIOS}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      ...dados,
      _subject: assunto,
      _template: 'table',
      _replyto: dados['E-mail'] ?? '',
    }),
  });
  if (!resposta.ok) throw new Error('Falha no envio');
  const json = await resposta.json().catch(() => ({}));
  if (json && (json.success === false || json.success === 'false')) throw new Error(json.message || 'Falha no envio');
}
