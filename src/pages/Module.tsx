import { Link, useParams } from 'react-router-dom';
import { getModule } from '../engine/registry';
import { useEtat } from '../engine/useEtat';
import { useLangue } from '../engine/useLangue';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { EmptyState } from '../components/ui/EmptyState';
import { useTitre } from './useTitre';
import { tituleModule, descriptionModule, tituleChapitre } from '../engine/bilingue';

export default function Module() {
  const { moduleId = '' } = useParams();
  const module = getModule(moduleId);
  const { etat, version } = useEtat();
  const { t, langue } = useLangue();
  void version;

  useTitre(module ? tituleModule(module.meta, langue) : t('cours.moduleIntrouvable'));

  if (!module) {
    return (
      <>
        <EmptyState
          titre={t('cours.moduleIntrouvable')}
          indice={t('cours.moduleIntrouvableIndice')}
        />
        <div className="mt-4 text-center">
          <Link to="/cours" className="text-sm text-accent underline-offset-2 hover:underline">
            {t('cours.retourCours')}
          </Link>
        </div>
      </>
    );
  }

  const { meta, chapitres } = module;
  const totalChapitres = chapitres.length;
  const chapitresAcquis = chapitres.filter(
    c => etat.checkpointsReussis[`${meta.id}/${c.meta.id}`]
  ).length;
  const progression = totalChapitres > 0 ? chapitresAcquis / totalChapitres : 0;

  const chapitresTries = [...chapitres].sort((a, b) => a.meta.ordre - b.meta.ordre);

  function etatChapitre(chapId: string) {
    const cle = `${meta.id}/${chapId}`;
    if (etat.checkpointsReussis[cle]) return 'acquis';
    if (etat.chapitresLus[cle]) return 'lu';
    return 'non-lu';
  }

  const labelProgression = `${chapitresAcquis} / ${totalChapitres} ${totalChapitres !== 1 ? t('cours.chapitres') : t('cours.chapitre')} ${t('cours.chapitresAcquisSuffixe')}`;

  return (
    <>
      {/* Breadcrumb */}
      <nav className="mb-4 text-xs text-text-muted" aria-label={t('commun.filAriane')}>
        <Link to="/cours" className="hover:text-text">{t('nav.cours')}</Link>
        <span className="mx-1.5">›</span>
        <span className="text-text">{tituleModule(meta, langue)}</span>
      </nav>

      {/* En-tête du module */}
      <div className="mb-8">
        <div className="mb-1 flex items-center gap-2.5">
          <span className="inline-flex size-8 items-center justify-center rounded-md bg-surface-2 text-sm font-semibold tabular-nums text-text-muted">
            {meta.numero}
          </span>
          <h1 className="text-xl font-semibold tracking-tight text-text">{tituleModule(meta, langue)}</h1>
        </div>
        <p className="mt-2 mb-4 text-sm leading-relaxed text-text-muted">{descriptionModule(meta, langue)}</p>
        <ProgressBar
          valeur={progression}
          label={labelProgression}
        />
      </div>

      {/* Liste des chapitres */}
      {totalChapitres === 0 ? (
        <EmptyState
          titre={t('cours.aucunChapitre')}
          indice={t('cours.enRedaction')}
        />
      ) : (
        <ol className="flex flex-col gap-2">
          {chapitresTries.map(ref => {
            const statut = etatChapitre(ref.meta.id);
            return (
              <li key={ref.meta.id}>
                <Link
                  to={`/cours/${meta.id}/${ref.meta.id}`}
                  className="group flex items-center gap-4 rounded-lg border border-border bg-surface px-4 py-3.5 transition-colors duration-150 hover:border-accent/50 hover:bg-surface-2/40"
                >
                  {/* Numéro d'ordre */}
                  <span className="shrink-0 text-xs tabular-nums text-text-muted w-4 text-right">
                    {ref.meta.ordre}
                  </span>

                  {/* Titre */}
                  <span className="flex-1 text-sm font-medium text-text transition-colors duration-150 group-hover:text-accent leading-snug">
                    {tituleChapitre(ref.meta, langue)}
                  </span>

                  {/* Badge état */}
                  {statut === 'acquis' && (
                    <Badge variante="n3">{t('cours.acquis')}</Badge>
                  )}
                  {statut === 'lu' && (
                    <Badge variante="n2">{t('cours.lu')}</Badge>
                  )}
                  {statut === 'non-lu' && (
                    <Badge variante="neutre">{t('cours.nonLu')}</Badge>
                  )}
                </Link>
              </li>
            );
          })}
        </ol>
      )}
    </>
  );
}
