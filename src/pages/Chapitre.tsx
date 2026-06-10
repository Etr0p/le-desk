import { Suspense, lazy, useEffect, type ComponentType, type LazyExoticComponent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MDXProvider } from '@mdx-js/react';
import { getModule } from '../engine/registry';
import { useEtat } from '../engine/useEtat';
import { useLangue } from '../engine/useLangue';
import { composantsMdx } from '../components/cours/mdx-components';
import { EmptyState } from '../components/ui/EmptyState';
import { useTitre } from './useTitre';
import { tituleChapitre, tituleModule } from '../engine/bilingue';
import type { ChapitreRef } from '../engine/types';

// Cache module-level des composants lazy : un lazy() créé pendant le rendu
// (même via useMemo) est jeté quand le rendu suspend lors d'une transition
// de navigation — chaque nouvelle tentative recréait un lazy non résolu,
// d'où une suspension infinie (contenu figé). Le cache garantit une
// instance stable par chapitre et par langue, quelle que soit la tentative de rendu.
type ComposantChapitre = LazyExoticComponent<ComponentType<Record<string, unknown>>>;
const cacheChapitres = new Map<string, ComposantChapitre>();

function getComposantChapitre(
  moduleId: string,
  ref: ChapitreRef,
  langue: 'fr' | 'en',
): ComposantChapitre {
  // Clé inclut la langue pour que FR et EN aient des instances distinctes
  const cle = `${moduleId}/${ref.meta.id}/${langue}`;
  let composant = cacheChapitres.get(cle);
  if (!composant) {
    // Si EN demandé et chargerEn disponible → charger EN ; sinon FR
    const charger = langue === 'en' && ref.chargerEn ? ref.chargerEn : ref.charger;
    composant = lazy(charger);
    cacheChapitres.set(cle, composant);
  }
  return composant;
}

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
  const { langue, t } = useLangue();

  const module = getModule(moduleId);
  const ref = module?.chapitres.find(c => c.meta.id === chapitreId);

  const titreChapitre = ref ? tituleChapitre(ref.meta, langue) : '';
  const titreModule = module ? tituleModule(module.meta, langue) : '';

  useTitre(ref ? `${titreChapitre} — ${titreModule}` : t('cours.chapitreIntrouvable'));

  // Marquer comme lu et enregistrer la reprise
  useEffect(() => {
    if (!module || !ref) return;
    const cle = `${moduleId}/${chapitreId}`;
    modifier(e => {
      e.chapitresLus[cle] = true;
      e.reprise = { chemin: `/cours/${moduleId}/${chapitreId}`, libelle: `Chapitre — ${ref.meta.titre}` };
    });
  }, [moduleId, chapitreId, module, ref, modifier]);

  const ContenuMdx = ref ? getComposantChapitre(moduleId, ref, langue) : null;

  // Indique si on est en EN mais sans version EN disponible (fallback FR)
  const fallbackFr = langue === 'en' && ref && !ref.chargerEn;

  if (!module || !ref) {
    return (
      <>
        <EmptyState
          titre={t('cours.chapitreIntrouvable')}
          indice={t('cours.chapitreIntrouvableIndice')}
        />
        <div className="mt-4 text-center">
          <Link to="/cours" className="text-sm text-accent underline-offset-2 hover:underline">
            {t('cours.retourCours')}
          </Link>
        </div>
      </>
    );
  }

  const chapitresTries = [...module.chapitres].sort((a, b) => a.meta.ordre - b.meta.ordre);
  const indexCourant = chapitresTries.findIndex(c => c.meta.id === chapitreId);
  const precedent = indexCourant > 0 ? chapitresTries[indexCourant - 1] : null;
  const suivant = indexCourant < chapitresTries.length - 1 ? chapitresTries[indexCourant + 1] : null;

  return (
    <>
      {/* Breadcrumb */}
      <nav className="mb-6 text-xs text-text-muted" aria-label={t('commun.filAriane')}>
        <Link to="/cours" className="hover:text-text">{t('nav.cours')}</Link>
        <span className="mx-1.5">›</span>
        <Link to={`/cours/${moduleId}`} className="hover:text-text">{titreModule}</Link>
        <span className="mx-1.5">›</span>
        <span className="text-text">{titreChapitre}</span>
      </nav>

      {/* Avertissement fallback FR */}
      {fallbackFr && (
        <div className="mx-auto mb-4 max-w-[70ch] rounded-md border border-border bg-surface-2/40 px-4 py-2 text-xs text-text-muted">
          {t('cours.enAnglaisIndisponible')}
        </div>
      )}

      {/* Contenu MDX */}
      <div className="mx-auto max-w-[70ch]">
        <h1 className="mb-8 text-2xl font-semibold tracking-tight text-text">{titreChapitre}</h1>
        <MDXProvider components={composantsMdx}>
          <Suspense fallback={<ChargementChapitre />}>
            {ContenuMdx && <ContenuMdx />}
          </Suspense>
        </MDXProvider>
      </div>

      {/* Navigation prev/next */}
      <nav
        className="mx-auto mt-12 flex max-w-[70ch] items-center justify-between gap-4 border-t border-border pt-6"
        aria-label={t('cours.navigationChapitres')}
      >
        <div className="flex-1">
          {precedent && (
            <Link
              to={`/cours/${moduleId}/${precedent.meta.id}`}
              className="group flex flex-col text-sm"
            >
              <span className="text-xs text-text-muted">{t('cours.chapitrePrecedent')}</span>
              <span className="font-medium text-text transition-colors duration-150 group-hover:text-accent">
                {tituleChapitre(precedent.meta, langue)}
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
              <span className="text-xs text-text-muted">{t('cours.chapitreSuivant')}</span>
              <span className="font-medium text-text transition-colors duration-150 group-hover:text-accent">
                {tituleChapitre(suivant.meta, langue)}
              </span>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}
