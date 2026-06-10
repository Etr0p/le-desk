import { useState, useMemo } from 'react';
import { useTitre } from './useTitre';
import { modules } from '../engine/registry';
import type { ExerciseGenerator, ProblemGenerator, ModuleContenu } from '../engine/types';
import { useEtat } from '../engine/useEtat';
import { useLangue } from '../engine/useLangue';
import { champ } from '../engine/bilingue';
import { Tabs } from '../components/ui/Tabs';
import { Badge } from '../components/ui/Badge';
import type { VarianteBadge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import {
  SelecteurPerimetre,
  perimetre0,
  niveauAutorise,
  aExercicesOuProblemes,
} from '../components/entrainement/SelecteurPerimetre';
import type { PerimetreSelection } from '../components/entrainement/SelecteurPerimetre';
import { ExerciceCard } from '../components/entrainement/ExerciceCard';
import { ProblemeCard } from '../components/entrainement/ProblemeCard';
import { tentativeReussie } from '../engine/reussite';

/* ─── Helpers ─── */

function aContenu(m: ModuleContenu): boolean {
  return aExercicesOuProblemes(m);
}

function badgeDifficulte(d: number): VarianteBadge {
  if (d === 1) return 'n1';
  if (d === 2) return 'n2';
  if (d === 3) return 'n3';
  return 'n4';
}

type ItemExercice = { kind: 'exercice'; gen: ExerciseGenerator };
type ItemProbleme = { kind: 'probleme'; gen: ProblemGenerator };
type Item = ItemExercice | ItemProbleme;

function getRefId(item: Item): string {
  return item.gen.id;
}

function trierItems(items: Item[]): Item[] {
  return [...items].sort((a, b) => {
    if (a.gen.difficulte !== b.gen.difficulte) return a.gen.difficulte - b.gen.difficulte;
    return a.gen.titre.localeCompare(b.gen.titre, 'fr');
  });
}

/* ─── Types de vue ─── */

type VueListe = { type: 'liste' };
type VueLancementExercice = { type: 'exercice'; item: ItemExercice; indexListe: number };
type VueLancementProbleme = { type: 'probleme'; item: ItemProbleme; indexListe: number };
type Vue = VueListe | VueLancementExercice | VueLancementProbleme;

/* ─── Composant item de liste ─── */

interface ListeItemProps {
  item: Item;
  reussi: boolean;
  onClick: () => void;
  langue: 'fr' | 'en';
  labelReussi: string;
  labelNonReussi: string;
}

function ListeItem({ item, reussi, onClick, langue, labelReussi, labelNonReussi }: ListeItemProps) {
  const { gen } = item;
  const titre = champ(langue, gen.titre, gen.titreEn);
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-start gap-3 rounded-lg border p-4 text-left transition-colors duration-150 hover:border-accent/50 hover:bg-surface-2/40 ${
        reussi ? 'border-ok/30 bg-ok/5' : 'border-border bg-surface'
      }`}
    >
      <span
        className={`mt-0.5 shrink-0 text-sm font-semibold ${reussi ? 'text-ok' : 'text-text-muted/40'}`}
        aria-label={reussi ? labelReussi : labelNonReussi}
      >
        {reussi ? '✓' : '○'}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-text">{titre}</p>
        {item.kind === 'probleme' && (
          <p className="mt-0.5 text-xs text-text-muted">
            {champ(langue, item.gen.typeDeCas, item.gen.typeDeCasEn)}
          </p>
        )}
      </div>
      <Badge variante={badgeDifficulte(gen.difficulte)}>N{gen.difficulte}</Badge>
    </button>
  );
}

/* ─── Palier du parcours ─── */

interface ParcoursPalierProps {
  palierLibelle: string;
  items: Item[];
  itemsReussis: Set<string>;
  onLancer: (item: Item, indexGlobal: number) => void;
  itemsGlobaux: Item[];
  langue: 'fr' | 'en';
  labelReussi: string;
  labelNonReussi: string;
}

function ParcoursPalier({ palierLibelle, items, itemsReussis, onLancer, itemsGlobaux, langue, labelReussi, labelNonReussi }: ParcoursPalierProps) {
  if (items.length === 0) return null;
  const reussisNb = items.filter(i => itemsReussis.has(getRefId(i))).length;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-text">{palierLibelle}</h3>
        <span className="text-xs tabular-nums text-text-muted">
          {reussisNb}/{items.length}
        </span>
      </div>
      <ProgressBar valeur={reussisNb / items.length} />
      <ul className="space-y-2">
        {items.map(item => {
          const globalIdx = itemsGlobaux.indexOf(item);
          return (
            <li key={item.gen.id}>
              <ListeItem
                item={item}
                reussi={itemsReussis.has(getRefId(item))}
                onClick={() => onLancer(item, globalIdx)}
                langue={langue}
                labelReussi={labelReussi}
                labelNonReussi={labelNonReussi}
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ─── Onglet Parcours ─── */

interface ParcoursTabProps {
  moduleId: string;
  onLancer: (item: Item, indexListe: number) => void;
  langue: 'fr' | 'en';
  labelReussi: string;
  labelNonReussi: string;
  labelParcoursTermine: string;
  labelContinuerParcours: string;
  labelModuleIntrouvable: string;
  labelSansExercices: string;
  labelRevenezBientot: string;
  palierLibelles: string[];
}

function ParcoursTab({ moduleId, onLancer, langue, labelReussi, labelNonReussi, labelParcoursTermine, labelContinuerParcours, labelModuleIntrouvable, labelSansExercices, labelRevenezBientot, palierLibelles }: ParcoursTabProps) {
  const { etat, version } = useEtat();
  const mod = modules.find(m => m.meta.id === moduleId);

  const items: Item[] = useMemo(() => {
    if (!mod) return [];
    const exItems: ItemExercice[] = mod.exercices.map(gen => ({ kind: 'exercice', gen }));
    const pbItems: ItemProbleme[] = mod.problemes.map(gen => ({ kind: 'probleme', gen }));
    return trierItems([...exItems, ...pbItems]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mod, version]);

  const itemsReussis = useMemo(() => {
    const ok = new Set<string>();
    for (const t of etat.tentatives) {
      if (tentativeReussie(t)) ok.add(t.refId);
    }
    return ok;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [etat.tentatives, version]);

  if (!mod) return <EmptyState titre={labelModuleIntrouvable} />;

  if (items.length === 0) {
    return (
      <EmptyState
        titre={labelSansExercices}
        indice={labelRevenezBientot}
      />
    );
  }

  const premierNonAcquis = items.find(i => !itemsReussis.has(getRefId(i)));
  const toutAcquis = premierNonAcquis === undefined;

  const PALIER_NIVEAUX: (1 | 2 | 3 | 4)[] = [1, 2, 3, 4];

  return (
    <div className="space-y-8">
      <div>
        {toutAcquis ? (
          <p className="text-sm text-text-muted">
            {labelParcoursTermine}
          </p>
        ) : (
          <Button
            variante="primaire"
            onClick={() => {
              const idx = items.indexOf(premierNonAcquis);
              onLancer(premierNonAcquis, idx);
            }}
          >
            {labelContinuerParcours}
          </Button>
        )}
      </div>

      {PALIER_NIVEAUX.map((niveau, pi) => {
        const itemsDuPalier = items.filter(i => i.gen.difficulte === niveau);
        return (
          <ParcoursPalier
            key={niveau}
            palierLibelle={palierLibelles[pi]}
            items={itemsDuPalier}
            itemsReussis={itemsReussis}
            onLancer={onLancer}
            itemsGlobaux={items}
            langue={langue}
            labelReussi={labelReussi}
            labelNonReussi={labelNonReussi}
          />
        );
      })}
    </div>
  );
}

/* ─── Onglet Libre ─── */

interface LibreTabProps {
  selection: PerimetreSelection;
  onSelectionChange: (s: PerimetreSelection) => void;
  onLancer: (item: Item, indexListe: number) => void;
  langue: 'fr' | 'en';
  labelReussi: string;
  labelNonReussi: string;
  labelExercicesApplication: string;
  labelAucunExercice: string;
  labelModifiezFiltres: string;
  labelProblemesDeCas: string;
  labelAucunProbleme: string;
}

function LibreTab({ selection, onSelectionChange, onLancer, langue, labelReussi, labelNonReussi, labelExercicesApplication, labelAucunExercice, labelModifiezFiltres, labelProblemesDeCas, labelAucunProbleme }: LibreTabProps) {
  const { etat, version } = useEtat();

  const { exercicesFiltres, problemesFiltres } = useMemo(() => {
    const modsFiltres =
      selection.modulesChoisis.length === 0
        ? modules.filter(m => m.exercices.length + m.problemes.length > 0)
        : modules.filter(m => selection.modulesChoisis.includes(m.meta.id));

    const ex: ItemExercice[] = modsFiltres
      .flatMap(m => m.exercices)
      .filter(g => niveauAutorise(selection.niveaux, g.difficulte))
      .map(gen => ({ kind: 'exercice' as const, gen }));

    const pb: ItemProbleme[] = modsFiltres
      .flatMap(m => m.problemes)
      .filter(g => niveauAutorise(selection.niveaux, g.difficulte))
      .map(gen => ({ kind: 'probleme' as const, gen }));

    return { exercicesFiltres: ex, problemesFiltres: pb };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection, version]);

  const itemsReussis = useMemo(() => {
    const ok = new Set<string>();
    for (const t of etat.tentatives) {
      if (tentativeReussie(t)) ok.add(t.refId);
    }
    return ok;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [etat.tentatives, version]);

  const tousLesItems: Item[] = [...exercicesFiltres, ...problemesFiltres];

  return (
    <div className="space-y-6">
      <SelecteurPerimetre
        aContenu={aContenu}
        selection={selection}
        onChange={onSelectionChange}
      />

      {/* Exercices d'application */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-text">{labelExercicesApplication}</h3>
        {exercicesFiltres.length === 0 ? (
          <EmptyState
            titre={labelAucunExercice}
            indice={labelModifiezFiltres}
          />
        ) : (
          <ul className="space-y-2">
            {exercicesFiltres.map(item => (
              <li key={item.gen.id}>
                <ListeItem
                  item={item}
                  reussi={itemsReussis.has(item.gen.id)}
                  onClick={() => onLancer(item, tousLesItems.indexOf(item))}
                  langue={langue}
                  labelReussi={labelReussi}
                  labelNonReussi={labelNonReussi}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Problèmes de cas */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-text">{labelProblemesDeCas}</h3>
        {problemesFiltres.length === 0 ? (
          <EmptyState
            titre={labelAucunProbleme}
            indice={labelModifiezFiltres}
          />
        ) : (
          <ul className="space-y-2">
            {problemesFiltres.map(item => (
              <li key={item.gen.id}>
                <ListeItem
                  item={item}
                  reussi={itemsReussis.has(item.gen.id)}
                  onClick={() => onLancer(item, tousLesItems.indexOf(item))}
                  langue={langue}
                  labelReussi={labelReussi}
                  labelNonReussi={labelNonReussi}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

/* ─── Page principale ─── */

export default function RunnerExercices() {
  const { t, langue } = useLangue();
  useTitre(t('exo.titre'));

  const [selection, setSelection] = useState<PerimetreSelection>(perimetre0);
  const [onglet, setOnglet] = useState<'parcours' | 'libre'>('libre');
  const [vue, setVue] = useState<Vue>({ type: 'liste' });

  const parcoursDisponible =
    selection.modulesChoisis.length === 1 && selection.niveaux.length === 0;

  const moduleId = selection.modulesChoisis[0];
  const modParcours = moduleId ? modules.find(m => m.meta.id === moduleId) : undefined;

  const itemsParcours: Item[] = useMemo(() => {
    if (!modParcours) return [];
    const ex: ItemExercice[] = modParcours.exercices.map(gen => ({ kind: 'exercice', gen }));
    const pb: ItemProbleme[] = modParcours.problemes.map(gen => ({ kind: 'probleme', gen }));
    return trierItems([...ex, ...pb]);
  }, [modParcours]);

  const itemsLibre: Item[] = useMemo(() => {
    const modsFiltres =
      selection.modulesChoisis.length === 0
        ? modules.filter(m => m.exercices.length + m.problemes.length > 0)
        : modules.filter(m => selection.modulesChoisis.includes(m.meta.id));
    const ex: ItemExercice[] = modsFiltres
      .flatMap(m => m.exercices)
      .filter(g => niveauAutorise(selection.niveaux, g.difficulte))
      .map(gen => ({ kind: 'exercice', gen }));
    const pb: ItemProbleme[] = modsFiltres
      .flatMap(m => m.problemes)
      .filter(g => niveauAutorise(selection.niveaux, g.difficulte))
      .map(gen => ({ kind: 'probleme', gen }));
    return [...ex, ...pb];
  }, [selection]);

  function lancerItem(item: Item, indexListe: number) {
    if (item.kind === 'exercice') {
      setVue({ type: 'exercice', item, indexListe });
    } else {
      setVue({ type: 'probleme', item, indexListe });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function suivant() {
    if (vue.type === 'liste') return;
    const liste = onglet === 'parcours' ? itemsParcours : itemsLibre;
    const idx = vue.indexListe;
    if (idx + 1 < liste.length) {
      lancerItem(liste[idx + 1], idx + 1);
    } else {
      setVue({ type: 'liste' });
    }
  }

  const palierLibelles = [
    t('exo.palier1'),
    t('exo.palier2'),
    t('exo.palier3'),
    t('exo.palier4'),
  ];

  const onglets = [
    ...(parcoursDisponible ? [{ id: 'parcours', libelle: t('exo.parcours') }] : []),
    { id: 'libre', libelle: t('exo.libre') },
  ];
  const ongletActif = parcoursDisponible ? onglet : 'libre';

  /* ─── Vue exercice ─── */
  if (vue.type === 'exercice') {
    const liste = onglet === 'parcours' ? itemsParcours : itemsLibre;
    const hasNext = vue.indexListe + 1 < liste.length;
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setVue({ type: 'liste' })}
            className="text-sm text-text-muted hover:text-text transition-colors duration-150"
          >
            ← {t('commun.retour')}
          </button>
          <h1 className="text-lg font-semibold text-text">
            {champ(langue, vue.item.gen.titre, vue.item.gen.titreEn)}
          </h1>
          <Badge variante={badgeDifficulte(vue.item.gen.difficulte)}>
            N{vue.item.gen.difficulte}
          </Badge>
        </div>
        <ExerciceCard
          generateur={vue.item.gen}
          onSuivant={hasNext ? suivant : undefined}
          onRetour={() => setVue({ type: 'liste' })}
        />
      </div>
    );
  }

  /* ─── Vue problème ─── */
  if (vue.type === 'probleme') {
    const liste = onglet === 'parcours' ? itemsParcours : itemsLibre;
    const hasNext = vue.indexListe + 1 < liste.length;
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setVue({ type: 'liste' })}
            className="text-sm text-text-muted hover:text-text transition-colors duration-150"
          >
            ← {t('commun.retour')}
          </button>
          <h1 className="text-lg font-semibold text-text">
            {champ(langue, vue.item.gen.titre, vue.item.gen.titreEn)}
          </h1>
          <Badge variante={badgeDifficulte(vue.item.gen.difficulte)}>
            N{vue.item.gen.difficulte}
          </Badge>
        </div>
        <ProblemeCard
          generateur={vue.item.gen}
          onSuivant={hasNext ? suivant : undefined}
          onRetour={() => setVue({ type: 'liste' })}
        />
      </div>
    );
  }

  /* ─── Vue liste ─── */
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold tracking-tight text-text">{t('exo.titre')}</h1>

      {onglets.length > 1 && (
        <Tabs
          onglets={onglets}
          actif={ongletActif}
          onChange={id => setOnglet(id as 'parcours' | 'libre')}
          label={t('exo.modeEntrainement')}
        />
      )}

      <div role="tabpanel">
        {ongletActif === 'parcours' && moduleId ? (
          <ParcoursTab
            moduleId={moduleId}
            onLancer={lancerItem}
            langue={langue}
            labelReussi={t('exo.reussi')}
            labelNonReussi={t('exo.nonReussi')}
            labelParcoursTermine={t('exo.parcoursTermine')}
            labelContinuerParcours={t('exo.continuerParcours')}
            labelModuleIntrouvable={t('cours.moduleIntrouvable')}
            labelSansExercices={t('exo.moduleSansExercices')}
            labelRevenezBientot={t('exo.revenezBientot')}
            palierLibelles={palierLibelles}
          />
        ) : (
          <LibreTab
            selection={selection}
            onSelectionChange={s => {
              setSelection(s);
              if (s.modulesChoisis.length === 1 && s.niveaux.length === 0) {
                setOnglet('parcours');
              }
            }}
            onLancer={lancerItem}
            langue={langue}
            labelReussi={t('exo.reussi')}
            labelNonReussi={t('exo.nonReussi')}
            labelExercicesApplication={t('exo.exercicesApplication')}
            labelAucunExercice={t('exo.aucunExercice')}
            labelModifiezFiltres={t('exo.modifiezFiltres')}
            labelProblemesDeCas={t('exo.problemesDeCas')}
            labelAucunProbleme={t('exo.aucunProbleme')}
          />
        )}
      </div>
    </div>
  );
}
