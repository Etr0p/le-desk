import { useState, useEffect, useCallback } from 'react';
import { useTitre } from './useTitre';
import { toutesLesFlashcards } from '../engine/registry';
import { fileDuJour } from '../engine/flashqueue';
import type { Flashcard } from '../engine/types';
import type { Grade, CardState } from '../engine/srs';
import { nouvelleCarte, reviser, addJours, cartesDues, aujourdHuiLocal } from '../engine/srs';
import { useEtat } from '../engine/useEtat';
import { toucherStreak } from '../engine/storage';
import { newSeed } from '../engine/rng';
import {
  SelecteurPerimetre,
  perimetre0,
  niveauAutorise,
} from '../components/entrainement/SelecteurPerimetre';
import type { PerimetreSelection } from '../components/entrainement/SelecteurPerimetre';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { Markdown } from '../components/Markdown';

/* ─── helpers ─── */

function aFlashcards(m: { flashcards: unknown[] }): boolean {
  return m.flashcards.length > 0;
}

type GradeInfo = { grade: Grade; libelle: string; couleur: string };

const GRADES: GradeInfo[] = [
  { grade: 'encore', libelle: 'Encore', couleur: 'border-err/30 bg-err/10 text-err hover:bg-err/20' },
  { grade: 'difficile', libelle: 'Difficile', couleur: 'border-warn/30 bg-warn/10 text-warn hover:bg-warn/20' },
  { grade: 'bien', libelle: 'Bien', couleur: 'border-ok/30 bg-ok/10 text-ok hover:bg-ok/20' },
  { grade: 'facile', libelle: 'Facile', couleur: 'border-accent/30 bg-accent/10 text-accent hover:bg-accent/20' },
];

function intervallePrevu(etatCarte: CardState | undefined, grade: Grade, aujourdHui: string): string {
  const etat = etatCarte ?? nouvelleCarte(aujourdHui);
  const apres = reviser(etat, grade, aujourdHui);
  if (apres.intervalJours === 0) return "aujourd'hui";
  if (apres.intervalJours === 1) return '1 j';
  return `${apres.intervalJours} j`;
}

/* ─── types de vue ─── */

type VueConfig = { type: 'config' };
type VueSession = { type: 'session'; file: Flashcard[]; indexCourant: number; retourne: boolean };
type VueFin = { type: 'fin'; comptes: Record<Grade, number> };
type Vue = VueConfig | VueSession | VueFin;

/* ─── Écran config ─── */

interface ConfigProps {
  selection: PerimetreSelection;
  onSelectionChange: (s: PerimetreSelection) => void;
  nouvellesParJour: number;
  aReviser: number;
  nouvelles: number;
  onCommencer: () => void;
  vide: boolean;
}

function ConfigScreen({
  selection,
  onSelectionChange,
  nouvellesParJour,
  aReviser,
  nouvelles,
  onCommencer,
  vide,
}: ConfigProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold tracking-tight text-text">Flashcards</h1>

      <SelecteurPerimetre aContenu={aFlashcards} selection={selection} onChange={onSelectionChange} />

      {/* Aperçu de la file */}
      <div className="rounded-lg border border-border bg-surface-2 p-4 space-y-2">
        <p className="text-sm font-semibold text-text">Session du jour</p>
        <div className="flex flex-wrap gap-3 text-sm text-text-muted">
          <span>{aReviser} à réviser</span>
          <span>·</span>
          <span>{nouvelles} nouvelles</span>
        </div>
        <p className="text-xs text-text-muted">
          Nouvelles cartes par jour : {nouvellesParJour}
          {' '}
          <span className="text-text-muted/60">(modifiable dans Réglages)</span>
        </p>
      </div>

      {vide ? (
        <EmptyState
          titre="Aucune carte pour aujourd'hui."
          indice="Toutes les révisions sont à jour, ou aucun module ne contient de flashcards."
        />
      ) : (
        <Button variante="primaire" onClick={onCommencer}>
          Commencer
        </Button>
      )}
    </div>
  );
}

/* ─── Carte (recto / verso) ─── */

interface CarteProps {
  carte: Flashcard;
  retournee: boolean;
  onRetourner: () => void;
  etatCarte: CardState | undefined;
  onGrade: (g: Grade) => void;
  restantes: number;
  aujourdHui: string;
}

function CarteView({ carte, retournee, onRetourner, etatCarte, onGrade, restantes, aujourdHui }: CarteProps) {
  // Keyboard handler
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === ' ' || e.key === 'Enter') {
        if (!retournee) {
          e.preventDefault();
          onRetourner();
        }
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [retournee, onRetourner]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-text-muted tabular-nums">
          {restantes} carte{restantes > 1 ? 's' : ''} restante{restantes > 1 ? 's' : ''}
        </span>
        <span className="text-xs text-text-muted">{aujourdHui}</span>
      </div>

      {/* Recto */}
      <button
        type="button"
        onClick={onRetourner}
        disabled={retournee}
        className={`w-full rounded-xl border border-border bg-surface p-8 text-center transition-colors duration-150 ${
          !retournee ? 'cursor-pointer hover:border-accent/40 hover:bg-surface-2/40' : 'cursor-default'
        }`}
      >
        <Markdown
          texte={carte.recto}
          className="text-lg font-semibold leading-relaxed text-text"
        />
        {!retournee && (
          <p className="mt-4 text-xs text-text-muted">Appuyez pour retourner (Espace / Entrée)</p>
        )}
      </button>

      {/* Verso */}
      {retournee && (
        <div className="rounded-xl border border-border bg-surface-2 p-6">
          <Markdown
            texte={carte.verso}
            className="text-sm leading-relaxed text-text"
          />
        </div>
      )}

      {/* Boutons de notation */}
      {retournee && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {GRADES.map(({ grade, libelle, couleur }) => (
            <button
              key={grade}
              type="button"
              onClick={() => onGrade(grade)}
              className={`flex flex-col items-center gap-1 rounded-lg border p-3 text-sm font-medium transition-colors duration-150 ${couleur}`}
            >
              <span>{libelle}</span>
              <span className="text-xs opacity-75">
                {intervallePrevu(etatCarte, grade, aujourdHui)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Écran fin ─── */

interface FinProps {
  comptes: Record<Grade, number>;
  onRetour: () => void;
}

function FinScreen({ comptes, onRetour }: FinProps) {
  const total = Object.values(comptes).reduce((a, b) => a + b, 0);
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-text">Session terminée</h2>
      <p className="text-sm text-text-muted">{total} carte{total > 1 ? 's' : ''} révisée{total > 1 ? 's' : ''}.</p>
      <ul className="space-y-2">
        {GRADES.map(({ grade, libelle }) => (
          comptes[grade] > 0 ? (
            <li key={grade} className="flex items-center justify-between text-sm">
              <span className="text-text-muted">{libelle}</span>
              <span className="font-medium tabular-nums text-text">{comptes[grade]}</span>
            </li>
          ) : null
        ))}
      </ul>
      <Button variante="primaire" onClick={onRetour}>
        Retour
      </Button>
    </div>
  );
}

/* ─── Page principale ─── */

export default function RunnerFlashcards() {
  useTitre('Flashcards');

  const { etat, modifier } = useEtat();
  const [selection, setSelection] = useState<PerimetreSelection>(perimetre0);
  const [vue, setVue] = useState<Vue>({ type: 'config' });
  const [seed] = useState(() => newSeed());
  const aujourd = aujourdHuiLocal();

  // Filtrer les flashcards selon la sélection
  function getCartesFiltrees(): Flashcard[] {
    const toutes = toutesLesFlashcards();
    return toutes.filter(c => {
      const modOk = selection.modulesChoisis.length === 0 || selection.modulesChoisis.includes(c.moduleId);
      return modOk;
    });
  }

  // Calculer les comptes de prévisualisation
  const cartesFiltrees = getCartesFiltrees();
  const idsDues = new Set(cartesDues(etat.cartes, aujourd));
  const aReviser = cartesFiltrees.filter(c => idsDues.has(c.id)).length;
  const introduitesAujourdhui = Object.values(etat.cartesIntroduites).filter(d => d === aujourd).length;
  const capNouvelles = Math.max(0, etat.reglages.nouvellesCartesParJour - introduitesAujourdhui);
  const nouvellesCount = cartesFiltrees.filter(
    c => etat.cartesIntroduites[c.id] === undefined && !idsDues.has(c.id)
  ).slice(0, capNouvelles).length;

  function commencer() {
    const cartes = getCartesFiltrees();
    const file = fileDuJour(cartes, etat, aujourd, seed);
    if (file.length === 0) return;
    setVue({ type: 'session', file, indexCourant: 0, retourne: false });
  }

  const handleGrade = useCallback((grade: Grade) => {
    if (vue.type !== 'session') return;

    const { file, indexCourant } = vue;
    const carte = file[indexCourant];

    // Mettre à jour l'état SRS
    modifier(e => {
      const estNouvelle = e.cartesIntroduites[carte.id] === undefined;
      if (estNouvelle) {
        e.cartesIntroduites[carte.id] = aujourd;
        e.cartes[carte.id] = reviser(nouvelleCarte(aujourd), grade, aujourd);
      } else {
        const etatActuel = e.cartes[carte.id] ?? nouvelleCarte(aujourd);
        e.cartes[carte.id] = reviser(etatActuel, grade, aujourd);
      }
      toucherStreak(e, aujourd);
    });

    // Mettre à jour la file
    let nouvelleFile = [...file];

    if (grade === 'encore') {
      // Ré-enqueuer à la fin
      const carteRemise = file[indexCourant];
      nouvelleFile = [...file.slice(0, indexCourant), ...file.slice(indexCourant + 1), carteRemise];
      // Rester au même index (qui pointe maintenant vers la carte suivante)
      setVue({ ...vue, file: nouvelleFile, retourne: false });
      return;
    }

    // Avancer dans la file
    const prochainIndex = indexCourant + 1;
    if (prochainIndex >= file.length) {
      // Fin de session — calculer les comptes
      // (on doit recalculer sur les grades effectués — simplification : compter via modifier post)
      // On passe en vue fin avec des comptes provisoires depuis l'état actuel
      // Pour avoir les comptes par grade, on les track localement via update
      setVue({ type: 'fin', comptes: { encore: 0, difficile: 0, bien: 0, facile: 0 } });
      return;
    }

    setVue({ ...vue, file: nouvelleFile, indexCourant: prochainIndex, retourne: false });
  }, [vue, modifier, aujourd]);

  // Track comptes de grade localement pour l'écran de fin
  const [comptesGrade, setComptesGrade] = useState<Record<Grade, number>>({
    encore: 0, difficile: 0, bien: 0, facile: 0,
  });

  const handleGradeAvecCompte = useCallback((grade: Grade) => {
    if (vue.type !== 'session') return;
    const { file, indexCourant } = vue;

    const carte = file[indexCourant];

    modifier(e => {
      const estNouvelle = e.cartesIntroduites[carte.id] === undefined;
      if (estNouvelle) {
        e.cartesIntroduites[carte.id] = aujourd;
        e.cartes[carte.id] = reviser(nouvelleCarte(aujourd), grade, aujourd);
      } else {
        const etatActuel = e.cartes[carte.id] ?? nouvelleCarte(aujourd);
        e.cartes[carte.id] = reviser(etatActuel, grade, aujourd);
      }
      toucherStreak(e, aujourd);
    });

    const nouveauxComptes = { ...comptesGrade, [grade]: comptesGrade[grade] + 1 };
    setComptesGrade(nouveauxComptes);

    if (grade === 'encore') {
      const carteRemise = file[indexCourant];
      const nouvelleFile = [...file.slice(0, indexCourant), ...file.slice(indexCourant + 1), carteRemise];
      setVue({ ...vue, file: nouvelleFile, retourne: false });
      return;
    }

    const prochainIndex = indexCourant + 1;
    if (prochainIndex >= file.length) {
      setVue({ type: 'fin', comptes: nouveauxComptes });
      return;
    }

    setVue({ ...vue, file: [...file], indexCourant: prochainIndex, retourne: false });
  }, [vue, modifier, aujourd, comptesGrade]);

  /* ─── rendu ─── */

  if (vue.type === 'config') {
    return (
      <ConfigScreen
        selection={selection}
        onSelectionChange={setSelection}
        nouvellesParJour={etat.reglages.nouvellesCartesParJour}
        aReviser={aReviser}
        nouvelles={nouvellesCount}
        onCommencer={commencer}
        vide={aReviser + nouvellesCount === 0}
      />
    );
  }

  if (vue.type === 'session') {
    const { file, indexCourant, retourne } = vue;
    const carteCourante = file[indexCourant];
    const etatCarte = etat.cartes[carteCourante.id];

    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setVue({ type: 'config' })}
          className="text-sm text-text-muted hover:text-text transition-colors duration-150"
        >
          ← Retour
        </button>
        <CarteView
          carte={carteCourante}
          retournee={retourne}
          onRetourner={() => setVue({ ...vue, retourne: true })}
          etatCarte={etatCarte}
          onGrade={handleGradeAvecCompte}
          restantes={file.length - indexCourant}
          aujourdHui={aujourd}
        />
      </div>
    );
  }

  // fin
  return (
    <div className="space-y-4">
      <FinScreen
        comptes={vue.comptes}
        onRetour={() => {
          setComptesGrade({ encore: 0, difficile: 0, bien: 0, facile: 0 });
          setVue({ type: 'config' });
        }}
      />
    </div>
  );
}
