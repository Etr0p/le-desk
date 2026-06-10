import { useState, useEffect, useCallback } from 'react';
import { useTitre } from './useTitre';
import { toutesLesFlashcards } from '../engine/registry';
import { fileDuJour, apercuFileDuJour } from '../engine/flashqueue';
import type { Flashcard } from '../engine/types';
import type { Grade, CardState } from '../engine/srs';
import { nouvelleCarte, reviser, aujourdHuiLocal } from '../engine/srs';
import { useEtat } from '../engine/useEtat';
import { useLangue } from '../engine/useLangue';
import { champ } from '../engine/bilingue';
import { toucherStreak } from '../engine/storage';
import { newSeed } from '../engine/rng';
import {
  SelecteurPerimetre,
  perimetre0,
} from '../components/entrainement/SelecteurPerimetre';
import type { PerimetreSelection } from '../components/entrainement/SelecteurPerimetre';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Markdown } from '../components/Markdown';

/* ─── helpers ─── */

function aFlashcards(m: { flashcards: unknown[] }): boolean {
  return m.flashcards.length > 0;
}

type GradeInfo = { grade: Grade; libelle: string; couleur: string };

function buildGrades(
  labelEncore: string,
  labelDifficile: string,
  labelBien: string,
  labelFacile: string,
): GradeInfo[] {
  return [
    { grade: 'encore', libelle: labelEncore, couleur: 'border-err/30 bg-err/10 text-err hover:bg-err/20' },
    { grade: 'difficile', libelle: labelDifficile, couleur: 'border-warn/30 bg-warn/10 text-warn hover:bg-warn/20' },
    { grade: 'bien', libelle: labelBien, couleur: 'border-ok/30 bg-ok/10 text-ok hover:bg-ok/20' },
    { grade: 'facile', libelle: labelFacile, couleur: 'border-accent/30 bg-accent/10 text-accent hover:bg-accent/20' },
  ];
}

function intervallePrevu(etatCarte: CardState | undefined, grade: Grade, aujourdHui: string, labelAujourdhui: string): string {
  const etat = etatCarte ?? nouvelleCarte(aujourdHui);
  const apres = reviser(etat, grade, aujourdHui);
  if (apres.intervalJours === 0) return labelAujourdhui;
  if (apres.intervalJours === 1) return '1 j';
  return `${apres.intervalJours} j`;
}

/* ─── types de vue ─── */

type VueConfig = { type: 'config' };
type VueSession = {
  type: 'session';
  file: Flashcard[];
  indexCourant: number;
  retourne: boolean;
  gradeesIds: Set<string>;
  comptes: Record<Grade, number>;
};
type VueFin = { type: 'fin'; comptes: Record<Grade, number> };
type Vue = VueConfig | VueSession | VueFin;

const COMPTES_VIDES: Record<Grade, number> = { encore: 0, difficile: 0, bien: 0, facile: 0 };

/* ─── Écran config ─── */

interface ConfigProps {
  selection: PerimetreSelection;
  onSelectionChange: (s: PerimetreSelection) => void;
  nouvellesParJour: number;
  aReviser: number;
  nouvelles: number;
  onCommencer: () => void;
  vide: boolean;
  labelSessionDuJour: string;
  labelAReviser: string;
  labelNouvelles: string;
  labelNouvellesParJour: string;
  labelModifiableReglages: string;
  labelAucuneCarte: string;
  labelToutAJour: string;
  labelCommencer: string;
}

function ConfigScreen({
  selection, onSelectionChange, nouvellesParJour, aReviser, nouvelles, onCommencer, vide,
  labelSessionDuJour, labelAReviser, labelNouvelles, labelNouvellesParJour, labelModifiableReglages,
  labelAucuneCarte, labelToutAJour, labelCommencer,
}: ConfigProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold tracking-tight text-text">{/* titre injecté par parent */}</h1>

      <SelecteurPerimetre
        aContenu={aFlashcards}
        selection={selection}
        onChange={onSelectionChange}
        montrerNiveaux={false}
      />

      {/* Aperçu de la file */}
      <div className="rounded-lg border border-border bg-surface-2 p-4 space-y-2">
        <p className="text-sm font-semibold text-text">{labelSessionDuJour}</p>
        <div className="flex flex-wrap gap-3 text-sm text-text-muted">
          <span>{aReviser} {labelAReviser}</span>
          <span>·</span>
          <span>{nouvelles} {labelNouvelles}</span>
        </div>
        <p className="text-xs text-text-muted">
          {labelNouvellesParJour} : {nouvellesParJour}
          {' '}
          <span className="text-text-muted/60">{labelModifiableReglages}</span>
        </p>
      </div>

      {vide ? (
        <EmptyState
          titre={labelAucuneCarte}
          indice={labelToutAJour}
        />
      ) : (
        <Button variante="primaire" onClick={onCommencer}>
          {labelCommencer}
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
  langue: 'fr' | 'en';
  labelCarteRestante: string;
  labelCartesRestantes: string;
  labelAppuyezRetourner: string;
  labelAujourdhui: string;
  grades: GradeInfo[];
}

function CarteView({ carte, retournee, onRetourner, etatCarte, onGrade, restantes, aujourdHui, langue, labelCarteRestante, labelCartesRestantes, labelAppuyezRetourner, labelAujourdhui, grades }: CarteProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === ' ' || e.key === 'Enter') {
        const target = e.target as Element | null;
        const active = document.activeElement;
        const INTERACTIFS = ['BUTTON', 'A', 'INPUT', 'TEXTAREA', 'SELECT'];
        const elementActif = target ?? active;
        if (elementActif && elementActif !== document.body) {
          const tagName = elementActif.tagName;
          const roleButton = elementActif.getAttribute('role') === 'button';
          if (INTERACTIFS.includes(tagName) || roleButton) return;
        }
        if (!retournee) {
          e.preventDefault();
          onRetourner();
        }
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [retournee, onRetourner]);

  // Texte localisé recto/verso
  const rectoTexte = champ(langue, carte.recto, carte.rectoEn);
  const versoTexte = champ(langue, carte.verso, carte.versoEn);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-text-muted tabular-nums">
          {restantes} {restantes > 1 ? labelCartesRestantes : labelCarteRestante}
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
          texte={rectoTexte}
          className="text-lg font-semibold leading-relaxed text-text"
        />
        {!retournee && (
          <p className="mt-4 text-xs text-text-muted">{labelAppuyezRetourner}</p>
        )}
      </button>

      {/* Verso */}
      {retournee && (
        <div className="rounded-xl border border-border bg-surface-2 p-6">
          <Markdown
            texte={versoTexte}
            className="text-sm leading-relaxed text-text"
          />
        </div>
      )}

      {/* Boutons de notation */}
      {retournee && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {grades.map(({ grade, libelle, couleur }) => (
            <button
              key={grade}
              type="button"
              onClick={() => onGrade(grade)}
              className={`flex flex-col items-center gap-1 rounded-lg border p-3 text-sm font-medium transition-colors duration-150 ${couleur}`}
            >
              <span>{libelle}</span>
              <span className="text-xs opacity-75">
                {intervallePrevu(etatCarte, grade, aujourdHui, labelAujourdhui)}
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
  grades: GradeInfo[];
  labelSessionTerminee: string;
  labelCarteRevisee: string;
  labelCartesRevisees: string;
  labelRetour: string;
}

function FinScreen({ comptes, onRetour, grades, labelSessionTerminee, labelCarteRevisee, labelCartesRevisees, labelRetour }: FinProps) {
  const total = Object.values(comptes).reduce((a, b) => a + b, 0);
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-text">{labelSessionTerminee}</h2>
      <p className="text-sm text-text-muted">{total} {total > 1 ? labelCartesRevisees : labelCarteRevisee}.</p>
      <ul className="space-y-2">
        {grades.map(({ grade, libelle }) => (
          comptes[grade] > 0 ? (
            <li key={grade} className="flex items-center justify-between text-sm">
              <span className="text-text-muted">{libelle}</span>
              <span className="font-medium tabular-nums text-text">{comptes[grade]}</span>
            </li>
          ) : null
        ))}
      </ul>
      <Button variante="primaire" onClick={onRetour}>
        {labelRetour}
      </Button>
    </div>
  );
}

/* ─── Page principale ─── */

export default function RunnerFlashcards() {
  const { t, langue } = useLangue();
  useTitre(t('flash.titre'));

  const { etat, modifier } = useEtat();
  const [selection, setSelection] = useState<PerimetreSelection>(perimetre0);
  const [vue, setVue] = useState<Vue>({ type: 'config' });
  const aujourd = aujourdHuiLocal();

  const grades = buildGrades(
    t('flash.encore'),
    t('flash.difficile'),
    t('flash.bien'),
    t('flash.facile'),
  );

  function getCartesFiltrees(): Flashcard[] {
    const toutes = toutesLesFlashcards();
    return toutes.filter(c => {
      const modOk = selection.modulesChoisis.length === 0 || selection.modulesChoisis.includes(c.moduleId);
      return modOk;
    });
  }

  const cartesFiltrees = getCartesFiltrees();
  const { dues: aReviser, nouvelles: nouvellesCount } = apercuFileDuJour(cartesFiltrees, etat, aujourd);

  function commencer() {
    const cartes = getCartesFiltrees();
    const seed = newSeed();
    const file = fileDuJour(cartes, etat, aujourd, seed);
    if (file.length === 0) return;

    modifier(e => {
      e.reprise = { chemin: '/entrainement/flashcards', libelle: 'Entraînement — Flashcards' };
    });

    setVue({
      type: 'session',
      file,
      indexCourant: 0,
      retourne: false,
      gradeesIds: new Set(),
      comptes: { ...COMPTES_VIDES },
    });
  }

  const handleGrade = useCallback((grade: Grade) => {
    if (vue.type !== 'session') return;

    const { file, indexCourant, gradeesIds, comptes } = vue;
    const carte = file[indexCourant];
    const estPremierGrade = !gradeesIds.has(carte.id);

    if (estPremierGrade) {
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
    }

    const nouveauxGradeesIds = new Set(gradeesIds).add(carte.id);
    const nouveauxComptes = estPremierGrade
      ? { ...comptes, [grade]: comptes[grade] + 1 }
      : { ...comptes };

    if (grade === 'encore') {
      const carteRemise = file[indexCourant];
      const nouvelleFile = [...file.slice(0, indexCourant), ...file.slice(indexCourant + 1), carteRemise];
      setVue({ ...vue, file: nouvelleFile, retourne: false, gradeesIds: nouveauxGradeesIds, comptes: nouveauxComptes });
      return;
    }

    const prochainIndex = indexCourant + 1;
    if (prochainIndex >= file.length) {
      setVue({ type: 'fin', comptes: nouveauxComptes });
      return;
    }

    setVue({ ...vue, file, indexCourant: prochainIndex, retourne: false, gradeesIds: nouveauxGradeesIds, comptes: nouveauxComptes });
  }, [vue, modifier, aujourd]);

  /* ─── rendu ─── */

  if (vue.type === 'config') {
    return (
      <div className="space-y-6">
        <h1 className="text-xl font-semibold tracking-tight text-text">{t('flash.titre')}</h1>
        <ConfigScreen
          selection={selection}
          onSelectionChange={setSelection}
          nouvellesParJour={etat.reglages.nouvellesCartesParJour}
          aReviser={aReviser}
          nouvelles={nouvellesCount}
          onCommencer={commencer}
          vide={aReviser + nouvellesCount === 0}
          labelSessionDuJour={t('flash.sessionDuJour')}
          labelAReviser={t('flash.aReviser')}
          labelNouvelles={t('flash.nouvelles')}
          labelNouvellesParJour={t('flash.nouvellesParJour')}
          labelModifiableReglages={t('flash.modifiableReglages')}
          labelAucuneCarte={t('flash.aucuneCarte')}
          labelToutAJour={t('flash.toutAJour')}
          labelCommencer={t('commun.commencer')}
        />
      </div>
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
          ← {t('commun.retour')}
        </button>
        <CarteView
          carte={carteCourante}
          retournee={retourne}
          onRetourner={() => setVue({ ...vue, retourne: true })}
          etatCarte={etatCarte}
          onGrade={handleGrade}
          restantes={file.length - indexCourant}
          aujourdHui={aujourd}
          langue={langue}
          labelCarteRestante={t('flash.carteRestante')}
          labelCartesRestantes={t('flash.cartesRestantes')}
          labelAppuyezRetourner={t('flash.appuyezRetourner')}
          labelAujourdhui={t('flash.aujourdhui')}
          grades={grades}
        />
      </div>
    );
  }

  // fin
  return (
    <div className="space-y-4">
      <FinScreen
        comptes={vue.comptes}
        onRetour={() => setVue({ type: 'config' })}
        grades={grades}
        labelSessionTerminee={t('flash.sessionTerminee')}
        labelCarteRevisee={t('flash.carteRevisee')}
        labelCartesRevisees={t('flash.cartesRevisees')}
        labelRetour={t('commun.retour')}
      />
    </div>
  );
}
