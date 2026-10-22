import { FormEvent, useEffect, useState } from 'react';
import { ArrowRight, Check, X, ChevronDown, FileSpreadsheet, Layers3, Move3d, Ruler } from 'lucide-react';
import Layout, { irPara } from '../Layout';
import TesteModal from '../TesteModal';
import { PLANOS_EN, rota } from '../config';
import { enviarFormulario } from '../formulario';

// Página inicial para quem é de fora: só preços em dólar (oferta internacional da Hotmart).
// Nada aqui aponta para os preços em reais.

const features = [
  { icon: Ruler, title: 'Line Meter', description: 'Free forever: measure complex runs by layer in one click.', tone: 'blue' },
  { icon: FileSpreadsheet, title: 'Quantities', description: 'Blocks, areas, doors and windows, straight into tables.', tone: 'teal' },
  { icon: Layers3, title: 'Auto numbering', description: 'Number parts, points and rooms in sequence.', tone: 'slate' },
  { icon: Move3d, title: 'Fast editing', description: 'Auto dimensions, batch sheets and PDFs.', tone: 'steel' },
];

const included = ['Every plugin tool', 'Work areas: see only the tools you use', 'Updates and new tools', 'Support by e-mail and WhatsApp'];

const plans = [
  {
    name: 'Monthly',
    price: PLANOS_EN.mensal.preco,
    period: '/month',
    description: 'No automatic renewal: renew whenever you want',
    link: PLANOS_EN.mensal.link,
    featured: false,
  },
  {
    name: 'Yearly',
    price: PLANOS_EN.anual.preco,
    period: '/year',
    description: 'Best value: a full year of every tool',
    link: PLANOS_EN.anual.link,
    featured: true,
    badge: 'BEST VALUE',
  },
];

export default function InicioEn() {
  const [selectedPlan, setSelectedPlan] = useState('Yearly');
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(false);
  const [trialOpen, setTrialOpen] = useState(false);

  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 150);
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSending(true);
    setSendError(false);
    try {
      await enviarFormulario(`Novo contato (EN) — ${name} (plano ${selectedPlan})`, {
        Origem: 'Formulário da página em inglês',
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

  const ir = (id: string) => irPara(id, true, true);

  return (
    <Layout naInicial en>
      <section id="home" className="hero section-padding">
        <div className="hero-orbit orbit-one" />
        <div className="hero-orbit orbit-two" />
        <div className="eyebrow"><span className="eyebrow-dot" /> AUTOCAD PLUGIN</div>
        <h1>Ever thought about getting <em>your time</em> back in AutoCAD?</h1>
        <p className="hero-copy">Kit Projetista is an AutoCAD plugin that measures lines, numbers elements, builds quantity and area schedules and speeds up everyday edits. What used to take hours now takes a few clicks, so you can design better and deliver more. In English, with metric units.</p>
        <div className="hero-actions">
          <button className="button button-primary" onClick={() => setTrialOpen(true)}>
            Free 7-day trial <ArrowRight size={17} />
          </button>
          <button className="button button-outline" onClick={() => ir('plans')}>See pricing <ChevronDown size={17} /></button>
        </div>
        <div className="hero-footnote"><span>Made for designers</span><span className="foot-line" /><span>AutoCAD 2015 to 2027 · Civil 3D</span></div>
      </section>

      <section id="features" className="features-section section-padding">
        <div className="section-heading">
          <div><div className="eyebrow dark"><span className="eyebrow-dot" /> MORE TIME TO DESIGN</div><h2>Your project.<br /><span style={{ color: '#1e6887' }}>Without the repetitive work.</span></h2></div>
          <p>Tools that make every step simpler, more accurate and faster.</p>
        </div>
        <div className="features-grid">
          {features.map(({ icon: Icon, title, description, tone }) => (
            <article className={`feature-card feature-${tone}`} key={title}>
              <div className="feature-top"><Icon size={25} strokeWidth={1.6} /></div>
              <h3>{title}</h3><p>{description}</p><button onClick={() => ir('contact')} aria-label={`Learn more about ${title}`}><ArrowRight size={16} /></button>
            </article>
          ))}
        </div>
        <div className="section-rule"><span>KP</span><div /></div>
      </section>

      <section id="plans" className="pricing-section section-padding">
        <div className="section-heading pricing-heading">
          <div><div className="eyebrow"><span className="eyebrow-dot" /> ONE PLAN, EVERYTHING INCLUDED</div><h2>The whole Kit, <em>one price.</em></h2></div>
          <p style={{ fontSize: '15px' }}>Every plugin tool, no modules to choose. Try it <span style={{ color: '#79c3d2' }}>free for 7 days</span>, and after buying you still have a 7-day money-back guarantee. The Line Meter stays free forever. Prices in US dollars; you pay in your local currency at checkout.</p>
        </div>
        <div className="plans-list plans-unico plans-dois">
          {plans.map((plan) => (
            <div key={plan.name} className={`plan-card ${plan.featured ? 'plan-featured' : ''} ${selectedPlan === plan.name ? 'plan-selected' : ''}`} onClick={() => setSelectedPlan(plan.name)}>
              <div className="plan-card-top"><span className="plan-name">{plan.name}</span>{plan.badge && <span className="popular-badge">{plan.badge}</span>}</div>
              <div className="price"><small>US$</small> {plan.price}<span>{plan.period}</span></div>
              <p>{plan.description}</p>
              <div className="plan-features">{included.map((item) => <span key={item}><Check size={14} /> {item}</span>)}</div>
              {plan.link ? (
                <a href={plan.link} target="_blank" rel="noreferrer" className={`plan-cta ${plan.featured ? 'plan-cta-primary' : ''}`} style={{ textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  Subscribe <ArrowRight size={15} />
                </a>
              ) : (
                <button type="button" onClick={() => ir('contact')} className={`plan-cta ${plan.featured ? 'plan-cta-primary' : ''}`} style={{ background: 'none', border: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', font: 'inherit' }}>
                  I want this one <ArrowRight size={15} />
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="compat" id="compatibility">
          <div>
            <h3><Check size={16} /> Works in</h3>
            <p>AutoCAD 2015 to 2027 on Windows (64-bit), and products based on it: Civil 3D, Architecture, MEP, Electrical, Mechanical, Map 3D and Plant 3D.</p>
          </div>
          <div>
            <h3><X size={16} /> Does not work in</h3>
            <p>AutoCAD LT (it does not accept plugins), AutoCAD for Mac, AutoCAD Web and other CAD programs such as BricsCAD and ZWCAD. Not sure? Try it free for 7 days before subscribing.</p>
          </div>
        </div>
      </section>

      <section id="contact" className="contact-section section-padding">
        <div className="contact-panel">
          <div className="contact-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> LET'S TALK</div>
            <h2>Your next project starts <em>here.</em></h2>
            <p>Send us a message and find out how Kit Projetista fits your workflow. We answer in English and Portuguese.</p>
            <div className="contact-detail"><span className="detail-line" /><span>Reply within 1 business day (Brasília time, UTC-3)</span></div>
          </div>

          {submitted ? (
            <div className="success-state">
              <div className="success-icon"><Check size={26} /></div>
              <h3>Message received.</h3>
              <p>Thank you for your interest. We will get back to you soon.</p>
              <button className="button button-outline" onClick={() => setSubmitted(false)}>Send another message</button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <label>Name (required)<input required type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="First and last name" /></label>
              <label>E-mail (required)<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" /></label>
              <label>Message<textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Questions" rows={4} /></label>

              <label style={{ display: 'block', marginBottom: '12px' }}>Which plan are you interested in?</label>
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

              {sendError && <p className="form-error">Could not send right now. Please try again in a moment.</p>}
              <button className="button button-primary" type="submit" disabled={sending}>
                {sending ? 'Sending...' : 'Send message'} <ArrowRight size={17} />
              </button>
              <p className="form-note">Your details are only used to reply to you. See the <a href={rota('en/privacy/')}>privacy policy</a>.</p>
            </form>
          )}
        </div>
      </section>

      <TesteModal aberto={trialOpen} fechar={() => setTrialOpen(false)} en />
    </Layout>
  );
}
