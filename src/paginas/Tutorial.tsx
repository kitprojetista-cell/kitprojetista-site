import { useState } from 'react';
import { ArrowRight, BookOpen, Check, Clock, MousePointerClick } from 'lucide-react';
import Layout from '../Layout';
import TesteModal from '../TesteModal';
import { rota } from '../config';
import { TUTORIAIS, Tutorial as TipoTutorial } from '../tutoriais/dados';

/** Dados estruturados de perguntas e respostas (o Google pode mostrar direto no resultado da busca). */
function JsonLdPerguntas({ t }: { t: TipoTutorial }) {
  const dados = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: t.perguntas.map((q) => ({ '@type': 'Question', name: q.p, acceptedAnswer: { '@type': 'Answer', text: q.r } })),
  };
  const video = t.youtube ? {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: t.h1 + ' ' + t.destaque,
    description: t.descricao,
    thumbnailUrl: `https://i.ytimg.com/vi/${t.youtube}/maxresdefault.jpg`,
    // O Google exige data e hora com fuso (ISO 8601); a data do tutorial vale como meio-dia em Brasília.
    uploadDate: t.youtubeData && t.youtubeData.length === 10 ? t.youtubeData + 'T12:00:00-03:00' : t.youtubeData,
    embedUrl: `https://www.youtube.com/embed/${t.youtube}`,
    contentUrl: `https://www.youtube.com/watch?v=${t.youtube}`,
  } : null;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(dados) }} />
      {video && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(video) }} />}
    </>
  );
}

export function Tutorial({ t }: { t: TipoTutorial }) {
  const [testeAberto, setTesteAberto] = useState(false);
  const outros = TUTORIAIS.filter((x) => x.slug !== t.slug);
  return (
    <Layout naInicial={false}>
      <section className="hero hero-legal section-padding">
        <div className="hero-orbit orbit-one" />
        <div className="eyebrow"><span className="eyebrow-dot" /> {t.selo}</div>
        <h1>{t.h1} <em>{t.destaque}</em></h1>
        <p className="hero-copy">{t.chamada}</p>
      </section>

      <section className="features-section section-padding tutorial-secao">
        {t.video && (
          <figure className="tutorial-video">
            <video src={rota(t.video.mp4)} poster={rota(t.video.poster)} autoPlay muted loop playsInline preload="metadata" aria-label={t.video.legenda} />
            <figcaption>{t.video.legenda}</figcaption>
          </figure>
        )}

        {t.youtube && (
          <figure className="tutorial-video tutorial-youtube">
            <iframe src={`https://www.youtube-nocookie.com/embed/${t.youtube}`} title={t.h1 + ' ' + t.destaque} loading="lazy"
              allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          </figure>
        )}

        {t.guia && (
          <div className="tutorial-guia">
            <h2>{t.guia.titulo}</h2>
            <ol>
              {t.guia.passos.map((p, i) => (
                <li key={p.titulo}><span className="tutorial-num">{i + 1}</span><div><h3>{p.titulo}</h3><p>{p.texto}</p></div></li>
              ))}
            </ol>
            <button className="button button-primary" onClick={() => setTesteAberto(true)}>Começar meu teste grátis <ArrowRight size={17} /></button>
          </div>
        )}

        {t.manual && t.kit && (
        <div className="tutorial-comparacao">
          <article className="tutorial-coluna">
            <div className="tutorial-coluna-topo"><Clock size={20} strokeWidth={1.8} /> <h2>{t.manual.titulo}</h2></div>
            <ol>{t.manual.passos.map((p) => <li key={p}>{p}</li>)}</ol>
            <p className="tutorial-problema">{t.manual.problema}</p>
          </article>
          <article className="tutorial-coluna tutorial-kit">
            <div className="tutorial-coluna-topo"><MousePointerClick size={20} strokeWidth={1.8} /> <h2>Com o Kit Projetista: <code>{t.kit.comando}</code></h2></div>
            <ol>{t.kit.passos.map((p) => <li key={p}>{p}</li>)}</ol>
            {t.kit.gratis && <p className="tutorial-gratis"><Check size={16} /> {t.kit.gratis}</p>}
            <button className="button button-primary" onClick={() => setTesteAberto(true)}>Testar 7 dias grátis <ArrowRight size={17} /></button>
            <p className="form-note">Para AutoCAD 2015 a 2027 e Civil 3D, no Windows. Não funciona no AutoCAD LT.</p>
          </article>
        </div>
        )}

        <div className="situacao-texto tutorial-perguntas">
          <h2>Perguntas frequentes</h2>
          {t.perguntas.map((q) => (
            <div key={q.p}>
              <h3>{q.p}</h3>
              <p>{q.r}</p>
            </div>
          ))}
        </div>

        <div className="tutorial-outros">
          <h2>Outros tutoriais</h2>
          <div className="tutorial-cartoes">
            {outros.map((x) => (
              <a key={x.slug} className="tutorial-cartao" href={rota(x.slug + '/')}>
                <BookOpen size={20} strokeWidth={1.7} />
                <span>{x.h1}</span>
                <ArrowRight size={16} />
              </a>
            ))}
            <a className="tutorial-cartao" href={rota('planta-de-situacao/')}>
              <BookOpen size={20} strokeWidth={1.7} />
              <span>Planta de situação grátis pelo CEP, em DXF</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      <JsonLdPerguntas t={t} />
      <TesteModal aberto={testeAberto} fechar={() => setTesteAberto(false)} />
    </Layout>
  );
}

/** Página /tutoriais/: lista de todos os "como fazer". */
export function ListaTutoriais() {
  return (
    <Layout naInicial={false}>
      <section className="hero hero-legal section-padding">
        <div className="hero-orbit orbit-one" />
        <div className="eyebrow"><span className="eyebrow-dot" /> TUTORIAIS DE AUTOCAD</div>
        <h1>Como fazer no AutoCAD <em>o que toma seu tempo.</em></h1>
        <p className="hero-copy">Passo a passo das tarefas que mais se repetem em projeto: do jeito manual, no AutoCAD puro, e do jeito rápido, com o Kit Projetista.</p>
      </section>
      <section className="features-section section-padding tutorial-secao">
        <div className="tutorial-cartoes tutorial-cartoes-grandes">
          {TUTORIAIS.map((x) => (
            <a key={x.slug} className="tutorial-cartao" href={rota(x.slug + '/')}>
              <BookOpen size={22} strokeWidth={1.7} />
              <span><b>{x.h1}</b><small>{x.descricao}</small></span>
              <ArrowRight size={16} />
            </a>
          ))}
          <a className="tutorial-cartao" href={rota('planta-de-situacao/')}>
            <BookOpen size={22} strokeWidth={1.7} />
            <span><b>Planta de situação pelo CEP</b><small>Gere a planta de situação com as ruas reais e baixe em DXF. Grátis, direto no navegador.</small></span>
            <ArrowRight size={16} />
          </a>
        </div>
      </section>
    </Layout>
  );
}
