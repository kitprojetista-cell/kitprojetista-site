import { FormEvent, useEffect, useState } from 'react';
import { ArrowRight, Check, Download, X } from 'lucide-react';
import { LINK_TESTE_GRATIS, rota } from './config';
import { enviarFormulario } from './formulario';

type Props = { aberto: boolean; fechar: () => void };

/** Formulário do teste grátis: pede nome e e-mail e só então libera o download. */
export default function TesteModal({ aberto, fechar }: Props) {
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
      await enviarFormulario(`Teste grátis — ${nome}`, {
        Origem: 'Teste grátis (7 dias)',
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
        <button className="modal-close" onClick={fechar} aria-label="Fechar"><X size={18} /></button>
        <div className="eyebrow"><span className="eyebrow-dot" /> TESTE GRÁTIS POR 7 DIAS</div>

        {liberado ? (
          <div className="success-state">
            <div className="success-icon"><Check size={26} /></div>
            <h3 id="teste-titulo">Tudo pronto, {nome.split(' ')[0]}.</h3>
            <p>Baixe o Kit, rode o instalador e abra o AutoCAD. O teste de 7 dias começa no primeiro uso.</p>
            <a className="button button-primary" href={LINK_TESTE_GRATIS} target="_blank" rel="noreferrer">
              Baixar o Kit <Download size={17} />
            </a>
          </div>
        ) : (
          <>
            <h3 id="teste-titulo" className="modal-title">Comece seu teste.</h3>
            <p className="modal-copy">Deixe seu contato e o download é liberado na hora.</p>
            <form className="contact-form" onSubmit={enviar}>
              <label>Nome (obrigatório)<input required type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome e Sobrenome" /></label>
              <label>E-mail (obrigatório)<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" /></label>
              <label>WhatsApp<input type="tel" value={whats} onChange={(e) => setWhats(e.target.value)} placeholder="(00) 00000-0000" /></label>
              <label className="check-line">
                <input type="checkbox" checked={aceitaEmails} onChange={(e) => setAceitaEmails(e.target.checked)} />
                <span>Aceito receber e-mails sobre o Kit Projetista</span>
              </label>
              {erro && <p className="form-error">Não foi possível enviar agora. Tente novamente em instantes.</p>}
              <button className="button button-primary" type="submit" disabled={enviando}>
                {enviando ? 'Enviando...' : 'Liberar download'} <ArrowRight size={17} />
              </button>
              <p className="form-note">Seus dados são usados só para o teste e o suporte. Veja a <a href={rota('privacidade/')}>política de privacidade</a>.</p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
