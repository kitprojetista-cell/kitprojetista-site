import { ArrowRight, Linkedin } from 'lucide-react';
import { EQUIPE, rota } from './config';

/** Seção "Quem faz o Kit": uma pessoa real por trás do produto (português ou inglês). */
export default function QuemFaz({ en = false }: { en?: boolean }) {
  const t = (pt: string, ingles: string) => (en ? ingles : pt);
  return (
    <section id={en ? 'about' : 'quem-faz'} className="team-section section-padding">
      <div className="team-card">
        <img className="team-photo" src={rota(EQUIPE.foto)} alt={EQUIPE.nome} width={220} height={220} loading="lazy" />
        <div className="team-copy">
          <div className="eyebrow dark"><span className="eyebrow-dot" /> {t('QUEM FAZ O KIT', 'WHO IS BEHIND THE KIT')}</div>
          <h2>{t('Feito por quem vive projeto.', 'Built by people who work on real projects.')}</h2>
          <h3>{EQUIPE.nome}</h3>
          <p className="team-role">
            {t('Engenheira civil', 'Civil engineer')}{EQUIPE.crea ? ` · CREA ${EQUIPE.crea}` : ''}
          </p>
          <p>
            {t(
              'A Danielle é engenheira civil e cuida para que cada ferramenta do Kit Projetista funcione do jeito que o projeto pede. Antes de chegar até você, toda ferramenta é testada por ela em desenhos reais no AutoCAD.',
              'Danielle is a civil engineer and makes sure every Kit Projetista tool works the way real projects need. Before a tool reaches you, she tests it on real drawings in AutoCAD.',
            )}
          </p>
          <a className="button button-primary team-link" href={EQUIPE.linkedin} target="_blank" rel="noreferrer">
            <Linkedin size={17} /> {t('Ver perfil no LinkedIn', 'View LinkedIn profile')} <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
