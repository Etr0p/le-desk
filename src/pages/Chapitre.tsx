import { Suspense, lazy, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MDXProvider } from '@mdx-js/react';
import { getModule } from '../engine/registry';
import { useEtat } from '../engine/useEtat';
import { composantsMdx } from '../components/cours/mdx-components';
import { EmptyState } from '../components/ui/EmptyState';
import { useTitre } from './useTitre';

function ChargementChapitre() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-accent" />
    </div>
  );
}

export default function Chapitre() {
  const { moduleId = '', chapitreId = '' } = useParams();
  const { modifier } = useEtat();

  const module = getModule(moduleId);
  const ref = module?.chapitres.find(c => c.meta.id === chapitreId);

  useTitre(ref ? `${ref.meta.titre} — ${module!.meta.titre}` : 'Chapitre introuvable');

  // Marquer comme lu et enregistrer la reprise
  useEffect(() => {
    if (!module || !ref) return;
    const cle = `${moduleId}/${chapitreId}`;
    modifier(e => {
      e.chapitresLus[cle] = true;
      e.reprise = { chemin: `/cours/${moduleId}/${chapitreId}`, libelle: `Chapitre — ${ref.meta.titre}` };
    });
  }, [moduleId, chapitreId, module, ref, modifier]);

  if (!module || !ref) {
    return (
      <>
        <EmptyState
          titre="Chapitre introuvable"
          indice="Ce chapitre n'existe pas ou n'est pas encore disponible."
        />
        <div className="mt-4 text-center">
          <Link to="/cours" className="text-sm text-accent underline-offset-2 hover:underline">
            Retour aux cours
          </Link>
        </div>
      </>
    );
  }

  const chapitresTries = [...module.chapitres].sort((a, b) => a.meta.ordre - b.meta.ordre);
  const indexCourant = chapitresTries.findIndex(c => c.meta.id === chapitreId);
  const precedent = indexCourant > 0 ? chapitresTries[indexCourant - 1] : null;
  const suivant = indexCourant < chapitresTries.length - 1 ? chapitresTries[indexCourant + 1] : null;

  // Lazy-load du composant MDX via ref.charger
  const ContenuMdx = lazy(ref.charger);

  return (
    <>
      {/* Breadcrumb */}
      <nav className="mb-6 text-xs text-text-muted" aria-label="Fil d'Ariane">
        <Link to="/cours" className="hover:text-text">Cours</Link>
        <span className="mx-1.5">›</span>
        <Link to={`/cours/${moduleId}`} className="hover:text-text">{module.meta.titre}</Link>
        <span className="mx-1.5">›</span>
        <span className="text-text">{ref.meta.titre}</span>
      </nav>

      {/* Contenu MDX */}
      <div className="mx-auto max-w-[70ch]">
        <h1 className="mb-8 text-2xl font-semibold tracking-tight text-text">{ref.meta.titre}</h1>
        <MDXProvider components={composantsMdx}>
          <Suspense fallback={<ChargementChapitre />}>
            <ContenuMdx />
          </Suspense>
        </MDXProvider>
      </div>

      {/* Navigation prev/next */}
      <nav
        className="mx-auto mt-12 flex max-w-[70ch] items-center justify-between gap-4 border-t border-border pt-6"
        aria-label="Navigation entre chapitres"
      >
        <div className="flex-1">
          {precedent && (
            <Link
              to={`/cours/${moduleId}/${precedent.meta.id}`}
              className="group flex flex-col text-sm"
            >
              <span className="text-xs text-text-muted">Chapitre précédent</span>
              <span className="font-medium text-text transition-colors duration-150 group-hover:text-accent">
                {precedent.meta.titre}
              </span>
            </Link>
          )}
        </div>
        <div className="flex-1 text-right">
          {suivant && (
            <Link
              to={`/cours/${moduleId}/${suivant.meta.id}`}
              className="group flex flex-col items-end text-sm"
            >
              <span className="text-xs text-text-muted">Chapitre suivant</span>
              <span className="font-medium text-text transition-colors duration-150 group-hover:text-accent">
                {suivant.meta.titre}
              </span>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}
