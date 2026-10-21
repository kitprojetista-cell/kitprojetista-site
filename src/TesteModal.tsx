import { FormEvent, useEffect, useState } from 'react';
import { ArrowRight, Check, Download, X } from 'lucide-react';
import { LINK_TESTE_GRATIS, rota } from './config';
import { enviarFormulario } from './formulario';

type Props = { aberto: boolean; fechar: () => void; en?: boolean };

/** Formulário do teste grátis: pede nome e e-mail e só então libera o download. */
export default function TesteModal({ aberto, fechar, en = false }: Props) {
  const t = (pt: string, ingles: string) => (en ? ingles : pt);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [whats, setWhats] = useState('');
  const [aceitaEmails, setAceitaEmails] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(false);
  const [liberado, setLiberado] = useState(false);

  useEffect(() => {
    if (!aberto) return;
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') fechar(); };
    document.addEventListener('keydown', esc);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', esc); document.body.style.overflow = ''; };
  }, [aberto, fechar]);

  if (!aberto) return null;

  const enviar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEnviando(true);
    setErro(false);
    try {
      await enviarFormulario(`Teste grátis — ${nome}${en ? ' (EN)' : ''}`, {
        Origem: en ? 'Teste grátis (7 dias), página em inglês' : 'Teste grátis (7 dias)',
        Nome: nome,
        'E-mail': email,
        WhatsApp: whats || 'Não informado',
        'Aceita e-mails': aceitaEmails ? 'Sim' : 'Não',
      });
      setLiberado(true);
    } catch {
      setErro(true);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={fechar} role="presentation">
      <div className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="teste-titulo" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={fechar} aria-label={t('Fechar', 'Close')}><X size={18} /></button>
        <div className="eyebrow"><span className="eyebrow-dot" /> {t('TESTE GRÁTIS POR 7 DIAS', '7-DAY FREE TRIAL')}</div>

        {liberado ? (
          <div className="success-state">
            <div className="success-icon"><Check size={26} /></div>
            <h3 id="teste-titulo">{t('Tudo pronto', 'All set')}, {nome.split(' ')[0]}.</h3>
            <p>{t('Baixe o Kit, rode o instalador e abra o AutoCAD. O teste de 7 dias começa no primeiro uso.', 'Download the Kit, run the installer and open AutoCAD. The installer has a Português / English button, and the 7-day trial starts the first time you use it.')}</p>
            <a className="button button-primary" href={LINK_TESTE_GRATIS} target="_blank" rel="noreferrer">
              {t('Baixar o Kit', 'Download the Kit')} <Download size={17} />
            </a>
          </div>
        ) : (
          <>
            <h3 id="teste-titulo" className="modal-title">{t('Comece seu teste.', 'Start your trial.')}</h3>
            <p className="modal-copy">{t('Deixe seu contato e o download é liberado na hora. Funciona no AutoCAD 2015 a 2027 e no Civil 3D, no Windows (não funciona no AutoCAD LT).', 'Leave your contact details and the download opens right away. Works in AutoCAD 2015 to 2027 and Civil 3D on Windows (not in AutoCAD LT).')}</p>
            <form className="contact-form" onSubmit={enviar}>
              <label>{t('Nome (obrigatório)', 'Name (required)')}<input required type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder={t('Nome e Sobrenome', 'First and last name')} /></label>
              <label>{t('E-mail (obrigatório)', 'E-mail (required)')}<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('seu@email.com', 'you@email.com')} /></label>
              <label>{t('WhatsApp', 'WhatsApp (optional)')}<input type="tel" value={whats} onChange={(e) => setWhats(e.target.value)} placeholder={t('(00) 00000-0000', '+1 555 123 4567')} /></label>
              <label className="check-line">
                <input type="checkbox" checked={aceitaEmails} onChange={(e) => setAceitaEmails(e.target.checked)} />
                <span>{t('Aceito receber e-mails sobre o Kit Projetista', 'Send me e-mails about Kit Projetista')}</span>
              </label>
              {erro && <p className="form-error">{t('Não foi possível enviar agora. Tente novamente em instantes.', 'Could not send right now. Please try again in a moment.')}</p>}
              <button className="button button-primary" type="submit" disabled={enviando}>
                {enviando ? t('Enviando...', 'Sending...') : t('Liberar download', 'Get the download')} <ArrowRight size={17} />
              </button>
              <p className="form-note">{t('Seus dados são usados só para o teste e o suporte. Veja a ', 'Your details are only used for the trial and support. See the ')}<a href={rota(en ? 'en/privacy/' : 'privacidade/')}>{t('política de privacidade', 'privacy policy')}</a>.</p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
