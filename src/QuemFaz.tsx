import { ArrowRight, Linkedin } from 'lucide-react';
import { EQUIPE, REDES, rota } from './config';

/** Seção "Quem faz o Kit": uma pessoa real por trás do produto (português ou inglês). */
export default function QuemFaz({ en = false }: { en?: boolean }) {
  const t = (pt: string, ingles: string) => (en ? ingles : pt);
  return (
    <section id={en ? 'about' : 'quem-faz'} className="team-section section-padding">
      <div className="team-card">
        <img className="team-photo" src={rota(EQUIPE.foto)} alt={EQUIPE.nome} width={220} height={220} loading="lazy" />
        <div className="team-copy">
          <div className="eyebrow dark"><span className="eyebrow-dot" /> {t('QUEM FAZ O KIT', 'WHO IS BEHIND THE KIT')}</div>
          <h2>{t('A engenheira por trás do Kit.', 'The engineer behind the Kit.')}</h2>
          <h3>{EQUIPE.nome}</h3>
          <p className="team-role">
            {t('Engenheira civil', 'Civil engineer')}{EQUIPE.crea ? ` · CREA ${EQUIPE.crea}` : ''}
          </p>
          <p>
            {t(
              'O Kit Projetista nasceu da rotina de projeto da Danielle. As ideias das ferramentas vêm do que ela vive no AutoCAD: medir, contar, calcular área e montar prancha. Cada ferramenta é testada por ela em desenhos reais antes de chegar até você.',
              "Kit Projetista was born from Danielle's day-to-day design work. The tool ideas come from what she does in AutoCAD every day: measuring, counting, calculating areas and building sheets. She tests every tool on real drawings before it reaches you.",
            )}
          </p>
          <p className="team-dev">
            {t(
              'O desenvolvimento fica com a equipe Kit Projetista, que transforma cada ideia em ferramenta e cuida do suporte.',
              'Development is handled by the Kit Projetista team, which turns each idea into a tool and takes care of support.',
            )}
          </p>
          <div className="team-links">
            <a className="button button-primary team-link" href={EQUIPE.linkedin} target="_blank" rel="noreferrer">
              <Linkedin size={17} /> {t('LinkedIn da Danielle', "Danielle's LinkedIn")} <ArrowRight size={16} />
            </a>
            <a className="button button-outline team-link team-link-kit" href={REDES.linkedin} target="_blank" rel="noreferrer">
              <Linkedin size={17} /> {t('Kit Projetista no LinkedIn', 'Kit Projetista on LinkedIn')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
