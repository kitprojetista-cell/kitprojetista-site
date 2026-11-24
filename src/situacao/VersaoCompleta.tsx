import { FormEvent, useEffect, useState } from 'react';
import { ArrowRight, Check, Lock } from 'lucide-react';
import { PLANILHA_PLANTA_CHAVE, PLANILHA_PLANTA_URL, rota } from '../config';
import { enviarFormulario, guardarPendente } from '../formulario';

/** O que a versão completa da planta de situação vai trazer (a lista de espera mede o que pesa mais). */
export const ITENS_COMPLETA = [
  { id: 'esquina', titulo: 'Distância até a esquina, cotada', texto: 'Já disponível para quem entra na lista: a cota sai desenhada na planta, e você pode digitar o valor da matrícula.' },
  { id: 'lote', titulo: 'Contorno do lote', texto: 'Desenhado pelos cantos no mapa ou pela testada e profundidade, com quadra e número.' },
  { id: 'ruas', titulo: 'Largura das ruas cotada', texto: 'As ruas na frente do lote com a largura em metros.' },
  { id: 'localizacao', titulo: 'Planta de localização junto', texto: 'O bairro em volta, além do lote na quadra, como muitas prefeituras pedem.' },
  { id: 'pdf', titulo: 'Prancha pronta em PDF', texto: 'A4 ou A3, escala 1:1000 ou 1:2000, com carimbo preenchido. Para quem não usa CAD.' },
];

/** Quem entrou na lista (neste navegador) já usa a cota até a esquina, como presente de lançamento. */
export const CHAVE_LISTA = 'kp_lista_completa';

type Props = { nomeInicial: string; emailInicial: string; whatsInicial: string; aoEntrar?: () => void };

export default function VersaoCompleta({ nomeInicial, emailInicial, whatsInicial, aoEntrar }: Props) {
  const [marcados, setMarcados] = useState<string[]>([]);
  const [outro, setOutro] = useState('');
  const [nome, setNome] = useState(nomeInicial);
  const [email, setEmail] = useState(emailInicial);
  const [whats, setWhats] = useState(whatsInicial);
  const [enviando, setEnviando] = useState(false);
  const [feito, setFeito] = useState(false);
  const [aviso, setAviso] = useState('');

  // Quem preencheu o cadastro do download depois de a página abrir: aproveita o nome e o e-mail
  useEffect(() => { if (nomeInicial) setNome((n) => n || nomeInicial); }, [nomeInicial]);
  useEffect(() => { if (emailInicial) setEmail((v) => v || emailInicial); }, [emailInicial]);
  useEffect(() => { if (whatsInicial) setWhats((v) => v || whatsInicial); }, [whatsInicial]);

  const alternar = (id: string) => setMarcados((m) => (m.includes(id) ? m.filter((x) => x !== id) : [...m, id]));

  const enviar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!marcados.length && !outro.trim()) { setAviso('Marque pelo menos um item ou conte o que a sua prefeitura pede.'); return; }
    setAviso('');
    setEnviando(true);
    const itens = ITENS_COMPLETA.filter((i) => marcados.includes(i.id)).map((i) => i.titulo).join('; ');
    if (PLANILHA_PLANTA_URL) {
      try {
        void fetch(PLANILHA_PLANTA_URL, { method: 'POST', mode: 'no-cors',
          body: new URLSearchParams({ chave: PLANILHA_PLANTA_CHAVE, tipo: 'espera', nome, email, whats, itens, outro: outro.trim() }) });
      } catch { /* nada */ }
    }
    const assunto = `Versão completa (lista de espera) — ${nome}`;
    const dados = { Origem: 'Planta de situação: lista de espera da versão completa', Nome: nome, 'E-mail': email, WhatsApp: whats || 'Não informado',
      'Itens marcados': itens || 'Nenhum', 'Pedido da prefeitura (outro)': outro.trim() || '—' };
    try { await enviarFormulario(assunto, dados); }
    catch { guardarPendente(assunto, dados); }
    finally {
      try { localStorage.setItem(CHAVE_LISTA, '1'); } catch { /* nada */ }
      setEnviando(false); setFeito(true); aoEntrar?.();
    }
  };

  return (
    <div className="completa" id="completa">
      <div className="section-heading">
        <div><div className="eyebrow dark"><span className="eyebrow-dot" /> EM BREVE · VERSÃO COMPLETA</div><h2>A planta de situação <span style={{ color: '#1e6887' }}>pronta para a prefeitura.</span></h2></div>
        <p>A versão grátis continua do jeito que está. A completa vai trazer o que a prefeitura pede e hoje você ainda desenha à mão. Marque o que você mais precisa: é isso que define o que construímos primeiro.</p>
      </div>
      {feito ? (
        <div className="completa-feito">
          <div className="success-icon"><Check size={26} /></div>
          <div>
            <h3>Você está na lista.</h3>
            <p>Avisamos por e-mail quando a versão completa sair, com condição especial para quem entrou na lista.{outro.trim() ? ' Vamos olhar o pedido da sua prefeitura e responder por e-mail.' : ''} E já liberamos para você a <b>cota até a esquina</b>: é só ligar a opção embaixo da planta.</p>
          </div>
        </div>
      ) : (
        <form className="completa-form" onSubmit={enviar}>
          <div className="completa-itens">
            {ITENS_COMPLETA.map((i) => (
              <label key={i.id} className={'completa-item' + (marcados.includes(i.id) ? ' marcado' : '')}>
                <input type="checkbox" checked={marcados.includes(i.id)} onChange={() => alternar(i.id)} />
                <Lock size={18} strokeWidth={1.8} />
                <span><b>{i.titulo}</b><small>{i.texto}</small></span>
              </label>
            ))}
            <label className="completa-outro">
              <b>Nenhuma dessas? Conte o que a sua prefeitura pede na planta de situação</b>
              <small>Verificamos o pedido e respondemos por e-mail. Se der para fazer, elaboramos para você.</small>
              <textarea rows={3} maxLength={600} value={outro} onChange={(e) => setOutro(e.target.value)}
                placeholder="Ex.: a prefeitura pede a distância até as duas esquinas e o número dos lotes vizinhos." />
            </label>
          </div>
          <div className="completa-contato">
            <input type="text" required maxLength={80} placeholder="Seu nome" value={nome} onChange={(e) => setNome(e.target.value)} />
            <input type="email" required maxLength={120} placeholder="Seu e-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="tel" maxLength={30} placeholder="WhatsApp (opcional)" value={whats} onChange={(e) => setWhats(e.target.value)} />
            {aviso && <p className="completa-aviso">{aviso}</p>}
            <button className="button button-primary" type="submit" disabled={enviando}>{enviando ? 'Enviando...' : 'Quero a versão completa'} <ArrowRight size={17} /></button>
            <p className="form-note">Sem compromisso. Usamos seu contato só para avisar do lançamento e responder o seu pedido. Veja a <a href={rota('privacidade/')}>política de privacidade</a>.</p>
          </div>
        </form>
      )}
    </div>
  );
}
