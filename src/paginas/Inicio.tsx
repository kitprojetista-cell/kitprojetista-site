import { FormEvent, useEffect, useState } from 'react';
import { ArrowRight, Check, ChevronDown, FileSpreadsheet, Layers3, Move3d, Ruler, Sparkles } from 'lucide-react';
import Layout, { irPara } from '../Layout';
import TesteModal from '../TesteModal';
import { rota } from '../config';
import { enviarFormulario } from '../formulario';

const features = [
  { icon: Ruler, title: 'Medidor de Linhas', description: 'Meça trajetos complexos com um clique.', tone: 'blue' },
  { icon: FileSpreadsheet, title: 'Quantitativo', description: 'Extraia materiais sem retrabalho.', tone: 'teal' },
  { icon: Layers3, title: 'Numeração', description: 'Organize cada elemento do projeto.', tone: 'slate' },
  { icon: Move3d, title: 'Edição rápida', description: 'Acelere o que antes era repetitivo.', tone: 'steel' },
];

const plans = [
  {
    name: 'Basic',
    price: '19,90',
    description: 'Para começar a ganhar tempo',
    features: ['Medidor de linhas', 'Numeração automática', 'Atualizações mensais'],
    link: 'https://pay.hotmart.com/S107938754U?off=x9z14ao9&_hi=eyJjaWQiOiIxNzkxMzkyNDAwNDg0OTMwNTE4Nzg0NTIwMDk3NTAwIiwiYmlkIjoiMTc5MTM5MjQwMDQ4NDkzMDUxODc4NDUyMDA5NzUwMCIsInNpZCI6ImM5YmRjMGZkZDBjYzQzODFiZWQ3YmVkMDVhMzUzZGUzIn0=.1791662406725',
  },
  {
    name: 'Essencial',
    price: '27,90',
    description: 'O equilíbrio para sua rotina',
    features: ['Tudo do plano Basic', 'Quantitativo de materiais', 'Suporte prioritário'],
    link: 'https://pay.hotmart.com/S107938754U?off=hstw0pym&_hi=eyJjaWQiOiIxNzkxMzkyNDAwNDg0OTMwNTE4Nzg0NTIwMDk3NTAwIiwiYmlkIjoiMTc5MTM5MjQwMDQ4NDkzMDUxODc4NDUyMDA5NzUwMCIsInNpZCI6ImM5YmRjMGZkZDBjYzQzODFiZWQ3YmVkMDVhMzUzZGUzIn0=.1791662679501',
  },
  {
    name: 'Plus',
    price: '34,90',
    description: 'Mais potência para seus projetos',
    features: ['Tudo do plano Essencial', 'Edição rápida', 'Biblioteca de comandos'],
    link: 'https://pay.hotmart.com/S107938754U?off=w9iwxv2e&_hi=eyJjaWQiOiIxNzkxMzkyNDAwNDg0OTMwNTE4Nzg0NTIwMDk3NTAwIiwiYmlkIjoiMTc5MTM5MjQwMDQ4NDkzMDUxODc4NDUyMDA5NzUwMCIsInNpZCI6ImM5YmRjMGZkZDBjYzQzODFiZWQ3YmVkMDVhMzUzZGUzIn0=.1791659465295',
  },
  {
    name: 'Premium',
    price: '39,90',
    description: 'Para equipes que produzem mais',
    features: ['Tudo do plano Plus', 'Licença para 2 usuários', 'Atendimento especializado'],
    link: 'https://pay.hotmart.com/S107938754U?off=xwx7v2xl&_hi=eyJjaWQiOiIxNzkxMzkyNDAwNDg0OTMwNTE4Nzg0NTIwMDk3NTAwIiwiYmlkIjoiMTc5MTM5MjQwMDQ4NDkzMDUxODc4NDUyMDA5NzUwMCIsInNpZCI6ImM5YmRjMGZkZDBjYzQzODFiZWQ3YmVkMDVhMzUzZGUzIn0=.1791659521654',
  },
  {
    name: 'Ultimate',
    price: '54,90',
    description: 'O máximo do Kit Projetista',
    features: ['Tudo do plano Premium', 'Licenças ilimitadas', 'Implementação assistida'],
    featured: true,
    link: 'https://pay.hotmart.com/S107938754U?off=bkkbtij1&_hi=eyJjaWQiOiIxNzkxMzkyNDAwNDg0OTMwNTE4Nzg0NTIwMDk3NTAwIiwiYmlkIjoiMTc5MTM5MjQwMDQ4NDkzMDUxODc4NDUyMDA5NzUwMCIsInNpZCI6ImM5YmRjMGZkZDBjYzQzODFiZWQ3YmVkMDVhMzUzZGUzIn0=.1791659538171',
  },
];

export default function Inicio() {
  const [selectedPlan, setSelectedPlan] = useState('Essencial');
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
        <h1>Já pensou em otimizar o <em>seu tempo</em> com o plugin?</h1>
        <p className="hero-copy">O Kit Projetista transforma tarefas repetitivas em poucos cliques, para você projetar melhor e entregar mais.</p>
        <div className="hero-actions">
          <button className="button button-primary" onClick={() => setTesteAberto(true)}>
            Teste Gratuito por 7 dias <ArrowRight size={17} />
          </button>
          <a className="button button-glass" href={rota('calculadora/')}>Conheça a Calculadora do Projetista <Sparkles size={16} /></a>
          <button className="button button-outline" onClick={() => ir('planos')}>Ver planos <ChevronDown size={17} /></button>
        </div>
        <div className="hero-footnote"><span>Feito para quem projeta</span><span className="foot-line" /><span>Compatível com AutoCAD</span></div>
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
          <div><div className="eyebrow"><span className="eyebrow-dot" /> PLANOS QUE CABEM NO SEU PROJETO</div><h2>Escolha o seu <em>plano.</em></h2></div>
          <p style={{ fontSize: '15px' }}>Comece pequeno, cresça no seu ritmo. Todos os planos incluem <span style={{ color: '#79c3d2' }}>7 dias gratuito</span>.</p>
        </div>
        <div className="plans-list">
          {plans.map((plan) => (
            <div key={plan.name} className={`plan-card ${plan.featured ? 'plan-featured' : ''} ${selectedPlan === plan.name ? 'plan-selected' : ''}`} onClick={() => setSelectedPlan(plan.name)}>
              <div className="plan-card-top"><span className="plan-name">{plan.name}</span>{plan.featured && <span className="popular-badge">MAIS ESCOLHIDO</span>}</div>
              <div className="price"><small>R$</small> {plan.price}<span>/mês</span></div>
              <p>{plan.description}</p>
              <div className="plan-features">{plan.features.map((item) => <span key={item}><Check size={14} /> {item}</span>)}</div>
              <a href={plan.link} target="_blank" rel="noreferrer" className={`plan-cta ${plan.featured ? 'plan-cta-primary' : ''}`} style={{ textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Assinar plano <ArrowRight size={15} />
              </a>
            </div>
          ))}
        </div>
      </section>

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
