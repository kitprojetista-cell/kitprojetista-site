import { FormEvent, useEffect, useState } from 'react';
import { ArrowRight, Check, X, ChevronDown, FileSpreadsheet, Layers3, Move3d, Ruler, Sparkles } from 'lucide-react';
import Layout, { irPara } from '../Layout';
import TesteModal from '../TesteModal';
import QuemFaz from '../QuemFaz';
import { rota } from '../config';
import { enviarFormulario } from '../formulario';

const features = [
  { icon: Ruler, title: 'Medidor de Linhas', description: 'Grátis para sempre: meça trajetos complexos com um clique.', tone: 'blue' },
  { icon: FileSpreadsheet, title: 'Quantitativo', description: 'Extraia materiais sem retrabalho.', tone: 'teal' },
  { icon: Layers3, title: 'Numeração', description: 'Organize cada elemento do projeto.', tone: 'slate' },
  { icon: Move3d, title: 'Edição rápida', description: 'Acelere o que antes era repetitivo.', tone: 'steel' },
];

// Um plano só (Kit Projetista: todas as ferramentas + KPCad no celular), com três jeitos de pagar.
// Os links são as ofertas da Hotmart (se um ficar vazio, o botão leva ao formulário de contato).
const incluso = ['Todas as ferramentas do plugin', 'KPCad: a planta no celular', 'Atualizações e ferramentas novas', 'Suporte pelo WhatsApp e e-mail'];

const plans = [
  {
    name: 'Fundador',
    price: '15,00',
    period: '/mês',
    description: 'Preço de fundador mantido nas renovações, só para os primeiros assinantes',
    features: incluso,
    featured: true,
    badge: 'VAGAS LIMITADAS',
    link: 'https://pay.hotmart.com/S107938754U?off=x9z14ao9',
  },
  {
    name: 'Mensal',
    price: '29,90',
    period: '/mês',
    description: 'Sem renovação automática: você renova quando quiser',
    features: incluso,
    link: 'https://pay.hotmart.com/S107938754U?off=syxo5ars',
  },
  {
    name: 'Anual',
    price: '249',
    period: '/ano',
    description: 'Sai por R$ 20,75 por mês, economia de R$ 109,80 no ano',
    features: incluso,
    link: 'https://pay.hotmart.com/S107938754U?off=nggyym5n',
  },
];

export default function Inicio() {
  const [selectedPlan, setSelectedPlan] = useState('Fundador');
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(false);
  const [testeAberto, setTesteAberto] = useState(false);

  // Chegou de outra página com #planos, #contato...: rola até a seção.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 150);
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSending(true);
    setSendError(false);
    try {
      await enviarFormulario(`Novo contato — ${name} (plano ${selectedPlan})`, {
        Origem: 'Formulário "Vamos conversar"',
        Nome: name,
        'E-mail': email,
        'Plano de interesse': selectedPlan,
        Mensagem: message || 'Não informado',
      });
      setSubmitted(true);
    } catch {
      setSendError(true);
    } finally {
      setSending(false);
    }
  };

  const ir = (id: string) => irPara(id, true);

  return (
    <Layout naInicial>
      <section id="inicio" className="hero section-padding">
        <div className="hero-orbit orbit-one" />
        <div className="hero-orbit orbit-two" />
        <div className="eyebrow"><span className="eyebrow-dot" /> PLUG-IN PARA AUTOCAD</div>
        <h1>Já pensou em otimizar o <em>seu tempo</em> no AutoCAD?</h1>
        <p className="hero-copy">O Kit Projetista é um plugin com ferramentas de CAD que medem linhas, numeram elementos, extraem quantitativos e aceleram as edições do dia a dia. O que levava horas passa a levar poucos cliques, para você projetar melhor e entregar mais.</p>
        <div className="hero-actions">
          <button className="button button-primary" onClick={() => setTesteAberto(true)}>
            Teste Gratuito por 7 dias <ArrowRight size={17} />
          </button>
          <a className="button button-glass" href={rota('calculadora/')}>Conheça a Calculadora do Projetista <Sparkles size={16} /></a>
          <button className="button button-outline" onClick={() => ir('planos')}>Ver planos <ChevronDown size={17} /></button>
        </div>
        <div className="hero-footnote"><span>Feito para quem projeta</span><span className="foot-line" /><span>AutoCAD 2015 a 2027 · Civil 3D</span></div>
      </section>

      <section id="recursos" className="features-section section-padding">
        <div className="section-heading">
          <div><div className="eyebrow dark"><span className="eyebrow-dot" /> MAIS TEMPO PARA CRIAR</div><h2>Seu projeto.<br /><span style={{ color: '#1e6887' }}>Sem o trabalho repetitivo.</span></h2></div>
          <p>Ferramentas pensadas para deixar cada etapa mais simples, precisa e veloz.</p>
        </div>
        <div className="features-grid">
          {features.map(({ icon: Icon, title, description, tone }) => (
            <article className={`feature-card feature-${tone}`} key={title}>
              <div className="feature-top"><Icon size={25} strokeWidth={1.6} /></div>
              <h3>{title}</h3><p>{description}</p><button onClick={() => ir('contato')} aria-label={`Saiba mais sobre ${title}`}><ArrowRight size={16} /></button>
            </article>
          ))}
        </div>
        <div className="section-rule"><span>KP</span><div /></div>
      </section>

      <section id="planos" className="pricing-section section-padding">
        <div className="section-heading pricing-heading">
          <div><div className="eyebrow"><span className="eyebrow-dot" /> UM PLANO, TUDO INCLUSO</div><h2>Tudo do Kit, <em>um preço só.</em></h2></div>
          <p style={{ fontSize: '15px' }}>Todas as ferramentas do plugin e o KPCad no celular, sem escolher módulo. Teste <span style={{ color: '#79c3d2' }}>7 dias grátis</span> no plugin e, depois de comprar, ainda tem 7 dias de garantia na Hotmart. O Medidor de Linhas continua grátis para sempre.</p>
        </div>
        <div className="plans-list plans-unico">
          {plans.map((plan) => (
            <div key={plan.name} className={`plan-card ${plan.featured ? 'plan-featured' : ''} ${selectedPlan === plan.name ? 'plan-selected' : ''}`} onClick={() => setSelectedPlan(plan.name)}>
              <div className="plan-card-top"><span className="plan-name">{plan.name}</span>{plan.badge && <span className="popular-badge">{plan.badge}</span>}</div>
              <div className="price"><small>R$</small> {plan.price}<span>{plan.period}</span></div>
              <p>{plan.description}</p>
              <div className="plan-features">{plan.features.map((item) => <span key={item}><Check size={14} /> {item}</span>)}</div>
              {plan.link ? (
                <a href={plan.link} target="_blank" rel="noreferrer" className={`plan-cta ${plan.featured ? 'plan-cta-primary' : ''}`} style={{ textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  Assinar <ArrowRight size={15} />
                </a>
              ) : (
                <button type="button" onClick={() => ir('contato')} className={`plan-cta ${plan.featured ? 'plan-cta-primary' : ''}`} style={{ background: 'none', border: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', font: 'inherit' }}>
                  Quero esse <ArrowRight size={15} />
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="compat" id="compatibilidade">
          <div>
            <h3><Check size={16} /> Funciona em</h3>
            <p>AutoCAD 2015 a 2027 no Windows (64 bits), e nos produtos baseados nele: Civil 3D, Architecture, MEP, Electrical, Mechanical, Map 3D e Plant 3D.</p>
          </div>
          <div>
            <h3><X size={16} /> Não funciona em</h3>
            <p>AutoCAD LT (não aceita plugins), AutoCAD para Mac, AutoCAD Web e outros programas de CAD, como BricsCAD e ZWCAD. Na dúvida, teste os 7 dias grátis antes de assinar.</p>
          </div>
        </div>
      </section>

      <QuemFaz />

      <section id="contato" className="contact-section section-padding">
        <div className="contact-panel">
          <div className="contact-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> VAMOS CONVERSAR</div>
            <h2>Seu próximo projeto começa <em>aqui.</em></h2>
            <p>Preencha o formulário e descubra como o Kit Projetista pode transformar sua rotina.</p>
            <div className="contact-detail"><span className="detail-line" /><span>Resposta em até 1 dia útil</span></div>
          </div>

          {submitted ? (
            <div className="success-state">
              <div className="success-icon"><Check size={26} /></div>
              <h3>Mensagem recebida.</h3>
              <p>Obrigado pelo interesse. Em breve, nossa equipe entra em contato com você.</p>
              <button className="button button-outline" onClick={() => setSubmitted(false)}>Enviar outra mensagem</button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <label>Nome (obrigatório)<input required type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome e Sobrenome" /></label>
              <label>E-mail (obrigatório)<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" /></label>
              <label>Mensagem<textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Dúvidas" rows={4} /></label>

              <label style={{ display: 'block', marginBottom: '12px' }}>Qual plano chamou sua atenção?</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                {plans.map((plan) => (
                  <button
                    key={plan.name}
                    type="button"
                    onClick={() => setSelectedPlan(plan.name)}
                    className={`button ${selectedPlan === plan.name ? 'button-primary' : 'button-outline'}`}
                    style={{ padding: '12px 16px', textAlign: 'left', justifyContent: 'flex-start', width: '100%' }}
                  >
                    {selectedPlan === plan.name ? '✓ ' : ''}{plan.name}
                  </button>
                ))}
              </div>

              {sendError && <p className="form-error">Não foi possível enviar agora. Tente novamente em instantes.</p>}
              <button className="button button-primary" type="submit" disabled={sending}>
                {sending ? 'Enviando...' : 'Enviar mensagem'} <ArrowRight size={17} />
              </button>
              <p className="form-note">Seus dados são usados só para responder você. Veja a <a href={rota('privacidade/')}>política de privacidade</a>.</p>
            </form>
          )}
        </div>
      </section>

      <TesteModal aberto={testeAberto} fechar={() => setTesteAberto(false)} />
    </Layout>
  );
}
