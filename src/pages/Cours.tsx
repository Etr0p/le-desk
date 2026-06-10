import { Link } from 'react-router-dom';
import { modules } from '../engine/registry';
import { useEtat } from '../engine/useEtat';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useTitre } from './useTitre';

export default function Cours() {
  useTitre('Cours');
  const { etat, version } = useEtat();
  void version; // dépendance explicite pour re-render sur mutation

  return (
    <>
      <h1 className="mb-6 text-xl font-semibold tracking-tight text-text">Cours</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {modules.map(module => {
          const { meta, chapitres } = module;
          const totalChapitres = chapitres.length;
          const chapitresAcquis = chapitres.filter(
            c => etat.checkpointsReussis[`${meta.id}/${c.meta.id}`]
          ).length;
          const progression = totalChapitres > 0 ? chapitresAcquis / totalChapitres : 0;
          const sansChapitres = totalChapitres === 0;

          const contenu = (
            <div className="flex h-full flex-col">
              {/* En-tête */}
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-md bg-surface-2 text-xs font-semibold tabular-nums text-text-muted">
                    {meta.numero}
                  </span>
                  <p className="text-sm font-semibold text-text leading-snug">{meta.titre}</p>
                </div>
                {sansChapitres && (
                  <Badge variante="neutre" className="shrink-0">Bientôt disponible</Badge>
                )}
              </div>

              {/* Description */}
              <p className="mb-4 flex-1 text-sm leading-relaxed text-text-muted">{meta.description}</p>

              {/* Pied */}
              <div className="flex flex-col gap-2">
                <ProgressBar
                  valeur={progression}
                  label={totalChapitres > 0
                    ? `${chapitresAcquis} / ${totalChapitres} chapitre${totalChapitres > 1 ? 's' : ''}`
                    : '0 chapitre'}
                />
              </div>
            </div>
          );

          if (sansChapitres) {
            return (
              <div
                key={meta.id}
                className="rounded-lg border border-border bg-surface p-5 opacity-60"
              >
                {contenu}
              </div>
            );
          }

          return (
            <Link
              key={meta.id}
              to={`/cours/${meta.id}`}
              className="group rounded-lg border border-border bg-surface p-5 transition-colors duration-150 hover:border-accent/50 hover:bg-surface-2/40"
            >
              {contenu}
            </Link>
          );
        })}
      </div>
    </>
  );
}
