import { FormEvent, useState } from 'react';
import {
  ArrowRight, Calculator, Check, ChevronDown, ClipboardList, FileText, HardHat, Home, Ruler, ShieldCheck, Sparkles, Store, Wrench,
} from 'lucide-react';
import Layout from '../Layout';
import { PLAY_STORE, YOUTUBE_SHORT, rota } from '../config';
import { enviarFormulario } from '../formulario';

const recursos = [
  { icon: Calculator, title: 'Quanto material comprar', description: 'Tijolo, piso, tinta, cimento, concreto e telhas, já com a sobra certa.', tone: 'blue' },
  { icon: Ruler, title: 'Minhas medidas', description: 'Salve o terreno, os cômodos ou a casa uma vez e use em todas as contas.', tone: 'teal' },
  { icon: ClipboardList, title: 'Estimativa da obra', description: 'Veja as etapas da obra e quanto cada uma custa pelo preço de referência do SINAPI.', tone: 'slate' },
  { icon: FileText, title: 'Lista de compras', description: 'Tudo o que você calculou vira uma lista pronta para mandar no WhatsApp.', tone: 'steel' },
  { icon: Store, title: 'Compare orçamentos', description: 'Importe o orçamento da loja em PDF e veja qual sai mais barato, item por item.', tone: 'teal' },
  { icon: Wrench, title: 'Na obra', description: 'Nível, esquadro e quanto cobrar pelo serviço, direto no celular.', tone: 'blue' },
];

const perfis = ['Estou construindo ou reformando', 'Trabalho em obra', 'Sou projetista, arquiteto ou engenheiro', 'Outro'];

export default function Calculadora() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cidade, setCidade] = useState('');
  const [perfil, setPerfil] = useState(perfis[0]);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(false);
  const [ok, setOk] = useState(false);

  const rolar = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const enviar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEnviando(true);
    setErro(false);
    try {
      await enviarFormulario(`Testador da Calculadora — ${nome}`, {
        Origem: 'Testador da Calculadora do Projetista',
        Nome: nome,
        'E-mail': email,
        'Cidade/UF': cidade || 'Não informado',
        Perfil: perfil,
      });
      setOk(true);
    } catch {
      setErro(true);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Layout naInicial={false}>
      <section className="hero hero-compact section-padding">
        <div className="hero-orbit orbit-one" />
        <div className="hero-orbit orbit-two" />
        <div className="eyebrow"><span className="eyebrow-dot" /> APP GRÁTIS PARA ANDROID</div>
        <h1>Saiba quanto material comprar <em>antes de ir à loja.</em></h1>
        <p className="hero-copy">A Calculadora do Projetista faz a conta da sua obra, monta a lista de compras e mostra qual loja sai mais barato. Grátis, sem cadastro e sem anúncios.</p>
        <div className="hero-actions">
          {PLAY_STORE ? (
            <a className="button button-primary" href={PLAY_STORE} target="_blank" rel="noreferrer">Baixar na Play Store <ArrowRight size={17} /></a>
          ) : (
            <button className="button button-primary" onClick={() => rolar('testadores')}>Quero ser testador <ArrowRight size={17} /></button>
          )}
          <button className="button button-outline" onClick={() => rolar(YOUTUBE_SHORT ? 'video' : 'recursos')}>Ver como funciona <ChevronDown size={17} /></button>
        </div>
        <div className="hero-footnote"><span>{PLAY_STORE ? 'Disponível na Play Store' : 'Em fase de testes'}</span><span className="foot-line" /><span>Android</span></div>
      </section>

      {YOUTUBE_SHORT && (
        <section id="video" className="features-section section-padding video-section">
          <div className="section-heading">
            <div><div className="eyebrow dark"><span className="eyebrow-dot" /> VEJA EM 40 SEGUNDOS</div><h2>Da medida à <span style={{ color: '#1e6887' }}>lista de compras.</span></h2></div>
          </div>
          <div className="video-frame">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_SHORT}`}
              title="Calculadora do Projetista em 40 segundos"
              allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </section>
      )}

      <section id="recursos" className="features-section section-padding">
        <div className="section-heading">
          <div><div className="eyebrow dark"><span className="eyebrow-dot" /> TUDO NO SEU CELULAR</div><h2>Sua obra.<br /><span style={{ color: '#1e6887' }}>Sem conta errada.</span></h2></div>
          <p>Ferramentas simples para quem está construindo, reformando ou trabalhando na obra.</p>
        </div>
        <div className="features-grid features-grid-3">
          {recursos.map(({ icon: Icon, title, description, tone }) => (
            <article className={`feature-card feature-${tone}`} key={title}>
              <div className="feature-top"><Icon size={25} strokeWidth={1.6} /></div>
              <h3>{title}</h3><p>{description}</p>
            </article>
          ))}
        </div>

        <div className="audience">
          <div className="eyebrow dark"><span className="eyebrow-dot" /> FEITO PARA QUEM CONSTRÓI</div>
          <div className="audience-grid">
            <div className="audience-item"><Home size={22} strokeWidth={1.6} /><h3>Vai construir ou reformar</h3><p>Saiba quanto vai gastar antes de começar.</p></div>
            <div className="audience-item"><HardHat size={22} strokeWidth={1.6} /><h3>Trabalha na obra</h3><p>Faça a conta na hora e mande a lista para o cliente.</p></div>
            <div className="audience-item"><Sparkles size={22} strokeWidth={1.6} /><h3>Projeta</h3><p>Use as ferramentas de projeto e conheça o <a href={rota('')}>Kit Projetista para AutoCAD</a>.</p></div>
          </div>
        </div>

        <div className="privacy-card">
          <ShieldCheck size={26} strokeWidth={1.6} />
          <div>
            <h3>Seus dados ficam no seu celular.</h3>
            <p>O app não pede cadastro, não coleta dados e não tem anúncios. Os orçamentos em PDF são lidos no próprio aparelho. A internet é usada só para baixar a tabela pública de preços do SINAPI.</p>
            <a href={rota('calculadora/privacidade/')}>Ler a política de privacidade <ArrowRight size={14} /></a>
          </div>
        </div>
        <div className="section-rule"><span>KP</span><div /></div>
      </section>

      <section id="testadores" className="contact-section section-padding">
        <div className="contact-panel">
          <div className="contact-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> SEJA UM DOS PRIMEIROS</div>
            <h2>Entre para o grupo de <em>testadores.</em></h2>
            <p>O app está quase na Play Store. Para lançar, precisamos de pessoas testando por 14 dias. Deixe seu e-mail do Google e mandamos o convite para baixar antes de todo mundo.</p>
            <div className="contact-detail"><span className="detail-line" /><span>Grátis, sem compromisso</span></div>
          </div>

          {ok ? (
            <div className="success-state">
              <div className="success-icon"><Check size={26} /></div>
              <h3>Pronto!</h3>
              <p>Você vai receber o convite no seu e-mail do Google em breve. Fique de olho também na caixa de spam.</p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={enviar}>
              <label>Nome (obrigatório)<input required type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome e Sobrenome" /></label>
              <label>E-mail do Google, o mesmo da Play Store (obrigatório)<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@gmail.com" /></label>
              <label>Cidade / UF<input type="text" value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Campinas / SP" /></label>
              <label style={{ display: 'block', marginBottom: '4px' }}>Você é:</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                {perfis.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPerfil(p)}
                    className={`button ${perfil === p ? 'button-primary' : 'button-outline'}`}
                    style={{ padding: '12px 16px', textAlign: 'left', justifyContent: 'flex-start', width: '100%' }}
                  >
                    {perfil === p ? '✓ ' : ''}{p}
                  </button>
                ))}
              </div>
              {erro && <p className="form-error">Não foi possível enviar agora. Tente novamente em instantes.</p>}
              <button className="button button-primary" type="submit" disabled={enviando}>
                {enviando ? 'Enviando...' : 'Quero testar'} <ArrowRight size={17} />
              </button>
              <p className="form-note">Usamos seu e-mail só para enviar o convite de teste e avisar do lançamento. Veja a <a href={rota('calculadora/privacidade/')}>política de privacidade</a>.</p>
            </form>
          )}
        </div>
        <p className="disclaimer">Os resultados são de apoio e pré-dimensionamento. Eles não substituem o projeto e a responsabilidade técnica de um profissional habilitado.</p>
      </section>
    </Layout>
  );
}
