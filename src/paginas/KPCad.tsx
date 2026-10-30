import {
  ArrowRight, Calculator, ChevronDown, DoorOpen, FileDown, FileText, Layers, Monitor, PencilRuler, Ruler, Smartphone, HardHat,
} from 'lucide-react';
import { useState } from 'react';
import Layout from '../Layout';
import TesteModal from '../TesteModal';
import { PLAY_STORE, rota } from '../config';

const KPCAD_SHORT = 'P-U_qdp_X8k';

const recursos = [
  { icon: Layers, title: 'Abre a planta do AutoCAD', description: 'Abra o DXF (ou o PDF de CAD) no celular, com zoom e as camadas do desenho, sem precisar do computador.', tone: 'blue' },
  { icon: Ruler, title: 'Mede e cota na obra', description: 'Meça qualquer trecho com encaixe nos cantos das paredes e cote a parede inteira com um toque, ou todas de uma vez com a cota automática.', tone: 'teal' },
  { icon: PencilRuler, title: 'Desenha com o dedo', description: 'Paredes com espessura, portas e janelas encaixadas, textos e linhas. Mover, copiar, girar e espelhar.', tone: 'slate' },
  { icon: DoorOpen, title: 'Cômodos com a área', description: 'Dê nome ao cômodo e a área aparece sozinha quando as paredes fecham o espaço.', tone: 'steel' },
  { icon: FileDown, title: 'Volta para o AutoCAD', description: 'Exporte em DXF para abrir no AutoCAD, ou em PDF com a sua logo para mandar ao cliente.', tone: 'teal' },
  { icon: Calculator, title: 'Vira material', description: 'Os cômodos desenhados viram medidas para as calculadoras: tijolo, piso, tinta e a lista de compras.', tone: 'blue' },
];

const perguntas = [
  { p: 'O KPCad abre DWG?', r: 'Ele abre DXF e PDF de CAD. No AutoCAD, use Salvar como › DXF, ou o comando KPCELULAR do Kit Projetista, que já salva a planta em DXF (e o PDF das pranchas) prontos para o celular.' },
  { p: 'Precisa de internet na obra?', r: 'Não. A planta fica no celular e o KPCad funciona sem internet.' },
  { p: 'Funciona em iPhone?', r: 'Por enquanto o app é só para Android.' },
  { p: 'Quanto custa?', r: `O KPCad vem dentro do app Calculadora do Projetista. Dá para testar grátis por 7 dias, e depois ele faz parte do plano do Kit Projetista, junto com o plugin para AutoCAD. As calculadoras de obra do app continuam grátis.` },
  { p: 'Substitui o AutoCAD?', r: 'Não: é para conferir, medir e ajustar a planta na obra, longe do computador. O projeto continua no AutoCAD, e o desenho feito no celular volta para ele em DXF.' },
];

function Video() {
  return (
    <div className="video-frame">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${KPCAD_SHORT}`}
        title="KPCad: a planta do AutoCAD no celular"
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}

export default function KPCad() {
  const rolar = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  const [testeAberto, setTesteAberto] = useState(false);

  return (
    <Layout naInicial={false}>
      <section className="hero hero-compact section-padding kpcad-hero">
        <div className="hero-orbit orbit-one" />
        <div className="hero-orbit orbit-two" />
        <div className="hero-text">
          <div className="eyebrow"><span className="eyebrow-dot" /> KPCAD · APP PARA ANDROID</div>
          <h1>Sua planta do AutoCAD <em>no celular, na obra.</em></h1>
          <p className="hero-copy">O KPCad abre o DXF do seu projeto no celular para medir, cotar e desenhar por cima na obra, e devolve tudo para o AutoCAD. Feito para engenheiros, arquitetos e projetistas.</p>
          <div className="hero-actions">
            {PLAY_STORE ? (
              <a className="button button-primary" href={PLAY_STORE} target="_blank" rel="noreferrer">Baixar na Play Store <ArrowRight size={17} /></a>
            ) : (
              <span className="button button-primary kpcad-embreve">Em breve na Google Play</span>
            )}
            <button className="button button-outline" onClick={() => rolar('como-funciona')}>Ver como funciona <ChevronDown size={17} /></button>
          </div>
        </div>
        <div className="hero-media"><Video /></div>
      </section>

      <section id="como-funciona" className="features-section section-padding">
        <div className="section-heading">
          <div><div className="eyebrow dark"><span className="eyebrow-dot" /> COMO FUNCIONA</div><h2>Do escritório <span style={{ color: '#1e6887' }}>à obra.</span></h2></div>
          <p>O mesmo desenho, do computador ao canteiro, sem imprimir prancha nem redesenhar nada.</p>
        </div>
        <div className="kpcad-passos">
          <article><Monitor size={26} strokeWidth={1.6} /><span>1</span><h3>No AutoCAD</h3><p>Salve a planta em DXF. Com o Kit Projetista, o comando KPCELULAR faz isso num clique.</p></article>
          <article><Smartphone size={26} strokeWidth={1.6} /><span>2</span><h3>No celular</h3><p>Abra o arquivo no KPCad, pelo WhatsApp, e-mail ou Google Drive.</p></article>
          <article><HardHat size={26} strokeWidth={1.6} /><span>3</span><h3>Na obra</h3><p>Meça, cote, anote e desenhe por cima. Depois exporte em DXF ou PDF.</p></article>
        </div>

        <div className="features-grid features-grid-3" style={{ marginTop: 56 }}>
          {recursos.map(({ icon: Icon, title, description, tone }) => (
            <article className={`feature-card feature-${tone}`} key={title}>
              <div className="feature-top"><Icon size={25} strokeWidth={1.6} /></div>
              <h3>{title}</h3><p>{description}</p>
            </article>
          ))}
        </div>

        <div className="kpcad-ponte">
          <div>
            <div className="eyebrow"><span className="eyebrow-dot" /> KIT PROJETISTA + KPCAD</div>
            <h2>O plugin prepara. <em>O KPCad leva para a obra.</em></h2>
            <p>No AutoCAD, o Kit Projetista faz o quadro de áreas, as cotas, os carimbos e a planta de situação. No celular, o KPCad leva o mesmo desenho para o canteiro. Os dois vêm no mesmo plano.</p>
          </div>
          <button className="button button-primary" onClick={() => setTesteAberto(true)}>Testar o Kit 7 dias grátis <ArrowRight size={17} /></button>
        </div>
      </section>

      <section className="features-section section-padding kpcad-faq">
        <div className="section-heading">
          <div><div className="eyebrow dark"><span className="eyebrow-dot" /> PERGUNTAS FREQUENTES</div><h2>Antes de <span style={{ color: '#1e6887' }}>baixar.</span></h2></div>
        </div>
        {perguntas.map(({ p, r }) => (
          <div className="kpcad-pergunta" key={p}><h3>{p}</h3><p>{r}</p></div>
        ))}
        <p className="kpcad-calc"><FileText size={16} /> Também quer calcular material? O KPCad fica dentro da <a href={rota('calculadora/')}>Calculadora do Projetista</a>, com as calculadoras de obra grátis.</p>
      </section>
      <TesteModal aberto={testeAberto} fechar={() => setTesteAberto(false)} />
    </Layout>
  );
}
