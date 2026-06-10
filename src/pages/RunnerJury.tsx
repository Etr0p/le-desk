import { useState } from 'react';
import { useTitre } from './useTitre';
import { toutesLesQuestionsJury } from '../engine/registry';
import type { JuryQuestion } from '../engine/types';
import { useEtat } from '../engine/useEtat';
import { useLangue } from '../engine/useLangue';
import { champ } from '../engine/bilingue';
import { toucherStreak } from '../engine/storage';
import type { Tentative } from '../engine/storage';
import { aujourdHuiLocal } from '../engine/srs';
import { mulberry32, newSeed } from '../engine/rng';
import {
  SelecteurPerimetre,
  perimetre0,
  niveauAutorise,
} from '../components/entrainement/SelecteurPerimetre';
import type { PerimetreSelection } from '../components/entrainement/SelecteurPerimetre';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Collapsible } from '../components/ui/Collapsible';
import { Timer } from '../components/ui/Timer';
import { Markdown } from '../components/Markdown';

/* ─── helpers ─── */

function aJury(m: { jury: unknown[] }): boolean {
  return m.jury.length > 0;
}

/* ─── types chrono ─── */

const PREP_OPTIONS_LIBELLES = ['jury.aucune', '30 s', '60 s'] as const;
const PREP_OPTIONS_S = [0, 30, 60] as const;
const REP_OPTIONS_S = [60, 120, 180] as const;

/* ─── tirage sans répétition ─── */

function tirerQuestion(
  banque: JuryQuestion[],
  vues: Set<string>,
  seed: number,
): { question: JuryQuestion; vuesMaj: Set<string> } | null {
  if (banque.length === 0) return null;
  let pool = banque.filter(q => !vues.has(q.id));
  let nouvellesVues = new Set(vues);
  if (pool.length === 0) {
    pool = [...banque];
    nouvellesVues = new Set<string>();
  }
  const rng = mulberry32(seed);
  const idx = Math.floor(rng() * pool.length);
  const question = pool[idx];
  nouvellesVues.add(question.id);
  return { question, vuesMaj: nouvellesVues };
}

/* ─── types de vue ─── */

type PhasePrep = { type: 'prep' };
type PhaseRep = { type: 'rep' };
type PhaseCorrection = { type: 'correction' };
type PhaseEval = { type: 'eval' };
type Phase = PhasePrep | PhaseRep | PhaseCorrection | PhaseEval;

type VueConfig = { type: 'config' };
type VueQuestion = {
  type: 'question';
  question: JuryQuestion;
  phase: Phase;
  prepS: number;
  repS: number;
  timerKey: number;
};
type Vue = VueConfig | VueQuestion;

/* ─── Écran config ─── */

interface ConfigProps {
  selection: PerimetreSelection;
  onSelectionChange: (s: PerimetreSelection) => void;
  prepS: number;
  onPrepChange: (s: number) => void;
  repS: number;
  onRepChange: (s: number) => void;
  onTirer: () => void;
  dispo: number;
  labelPreparation: string;
  labelAucune: string;
  labelTirerQuestion: string;
  labelAucuneQuestion: string;
}

function ConfigScreen({ selection, onSelectionChange, prepS, onPrepChange, repS, onRepChange, onTirer, dispo, labelPreparation, labelAucune, labelTirerQuestion, labelAucuneQuestion }: ConfigProps) {
  const PREP_OPTIONS = [
    { libelle: labelAucune, s: 0 },
    { libelle: '30 s', s: 30 },
    { libelle: '60 s', s: 60 },
  ];
  const REP_OPTIONS = [
    { libelle: '1 min', s: 60 },
    { libelle: '2 min', s: 120 },
    { libelle: '3 min', s: 180 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold tracking-tight text-text">{/* titre localisé injecté par parent */}</h1>

      <SelecteurPerimetre aContenu={aJury} selection={selection} onChange={onSelectionChange} />

      {/* Chrono préparation */}
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-text-muted">{labelPreparation}</p>
        <div className="flex gap-2">
          {PREP_OPTIONS.map(({ libelle, s }) => (
            <button
              key={s}
              type="button"
              onClick={() => onPrepChange(s)}
              aria-pressed={prepS === s}
              className={`rounded-md border px-4 py-1.5 text-sm font-medium transition-colors duration-150 ${
                prepS === s
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-border bg-surface-2 text-text-muted hover:border-accent/40 hover:text-text'
              }`}
            >
              {libelle}
            </button>
          ))}
        </div>
      </div>

      {/* Chrono réponse */}
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-text-muted">{/* Réponse — invariant */}Réponse</p>
        <div className="flex gap-2">
          {REP_OPTIONS.map(({ libelle, s }) => (
            <button
              key={s}
              type="button"
              onClick={() => onRepChange(s)}
              aria-pressed={repS === s}
              className={`rounded-md border px-4 py-1.5 text-sm font-medium transition-colors duration-150 ${
                repS === s
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-border bg-surface-2 text-text-muted hover:border-accent/40 hover:text-text'
              }`}
            >
              {libelle}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variante="primaire" onClick={onTirer} disabled={dispo === 0}>
          {labelTirerQuestion}
        </Button>
        {dispo === 0 && (
          <span className="text-sm text-text-muted">{labelAucuneQuestion}</span>
        )}
      </div>
    </div>
  );
}

/* ─── Phase préparation ─── */

interface PrepPhaseProps {
  question: JuryQuestion;
  prepS: number;
  timerKey: number;
  onPasser: () => void;
  langue: 'fr' | 'en';
  labelPreparation: string;
  labelPasserReponse: string;
}

function PrepPhase({ question, prepS, timerKey, onPasser, langue, labelPreparation, labelPasserReponse }: PrepPhaseProps) {
  const questionTexte = champ(langue, question.question, question.questionEn);
  const themeLocalise = champ(langue, question.theme, question.themeEn);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <Badge variante="neutre">{labelPreparation}</Badge>
        {prepS > 0 && (
          <Timer key={timerKey} secondes={prepS} enMarche={true} onFin={onPasser} />
        )}
      </div>
      <div className="rounded-lg border border-border bg-surface p-6 text-center">
        <p className="text-lg font-semibold leading-snug text-text">{questionTexte}</p>
        <div className="mt-3 flex justify-center gap-2">
          <Badge variante="neutre">{themeLocalise}</Badge>
          <Badge variante={question.difficulte === 1 ? 'n1' : question.difficulte === 2 ? 'n2' : question.difficulte === 3 ? 'n3' : 'n4'}>
            N{question.difficulte}
          </Badge>
        </div>
      </div>
      <Button variante="primaire" onClick={onPasser}>
        {labelPasserReponse}
      </Button>
    </div>
  );
}

/* ─── Phase réponse ─── */

interface RepPhaseProps {
  question: JuryQuestion;
  repS: number;
  timerKey: number;
  onTerminer: () => void;
  langue: 'fr' | 'en';
  labelReponseVoixHaute: string;
  labelRepondezVoixHaute: string;
  labelJaiTermine: string;
}

function RepPhase({ question, repS, timerKey, onTerminer, langue, labelReponseVoixHaute, labelRepondezVoixHaute, labelJaiTermine }: RepPhaseProps) {
  const questionTexte = champ(langue, question.question, question.questionEn);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <Badge variante="neutre">{labelReponseVoixHaute}</Badge>
        <Timer key={timerKey} secondes={repS} enMarche={true} onFin={onTerminer} />
      </div>
      <div className="rounded-lg border border-border bg-surface p-5">
        <p className="text-base font-semibold text-text">{questionTexte}</p>
      </div>
      <p className="text-sm text-text-muted">{labelRepondezVoixHaute}</p>
      <Button variante="primaire" onClick={onTerminer}>
        {labelJaiTermine}
      </Button>
    </div>
  );
}

/* ─── Phase correction ─── */

interface CorrectionPhaseProps {
  question: JuryQuestion;
  pointsCoches: Set<number>;
  bonusCoches: Set<number>;
  onTogglePoint: (i: number) => void;
  onToggleBonus: (i: number) => void;
  onEvaluer: () => void;
  langue: 'fr' | 'en';
  labelGrilleCorrection: string;
  labelPlanAttendu: string;
  labelPointsAttendus: string;
  labelPourImpressionner: string;
  labelBonus: string;
  labelReponseModele: string;
  labelAutoEvaluer: string;
}

function CorrectionPhase({ question, pointsCoches, bonusCoches, onTogglePoint, onToggleBonus, onEvaluer, langue, labelGrilleCorrection, labelPlanAttendu, labelPointsAttendus, labelPourImpressionner, labelBonus, labelReponseModele, labelAutoEvaluer }: CorrectionPhaseProps) {
  const planLocalise = champ(langue, question.plan, question.planEn) ?? question.plan;
  const pointsLocalises = champ(langue, question.pointsAttendus, question.pointsAttendusEn) ?? question.pointsAttendus;
  const bonusLocalises = question.bonus
    ? (champ(langue, question.bonus, question.bonusEn) ?? question.bonus)
    : undefined;
  const reponseModeleLocalise = champ(langue, question.reponseModele, question.reponseModeleEn);

  return (
    <div className="space-y-5">
      <Badge variante="neutre">{labelGrilleCorrection}</Badge>

      {/* Plan attendu */}
      {planLocalise.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-text">{labelPlanAttendu}</h3>
          <ol className="space-y-1 list-decimal list-inside">
            {planLocalise.map((p, i) => (
              <li key={i} className="text-sm text-text">{p}</li>
            ))}
          </ol>
        </div>
      )}

      {/* Points attendus */}
      {pointsLocalises.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-text">{labelPointsAttendus}</h3>
          <ul className="space-y-2">
            {pointsLocalises.map((point, i) => (
              <li key={i}>
                <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border bg-surface-2 p-3 transition-colors hover:bg-surface-2/70">
                  <input
                    type="checkbox"
                    checked={pointsCoches.has(i)}
                    onChange={() => onTogglePoint(i)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-accent)]"
                  />
                  <span className={`text-sm leading-relaxed ${pointsCoches.has(i) ? 'text-ok' : 'text-text'}`}>{point}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Bonus */}
      {bonusLocalises && bonusLocalises.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-text">
            {labelPourImpressionner}
            <Badge variante="neutre" className="ml-2">{labelBonus}</Badge>
          </h3>
          <ul className="space-y-2">
            {bonusLocalises.map((b, i) => (
              <li key={i}>
                <label className="flex cursor-pointer items-start gap-3 rounded-md border border-accent/20 bg-accent/5 p-3 transition-colors hover:bg-accent/10">
                  <input
                    type="checkbox"
                    checked={bonusCoches.has(i)}
                    onChange={() => onToggleBonus(i)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-accent)]"
                  />
                  <span className={`text-sm leading-relaxed ${bonusCoches.has(i) ? 'text-accent' : 'text-text-muted'}`}>{b}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Réponse modèle */}
      <Collapsible titre={labelReponseModele}>
        <Markdown texte={reponseModeleLocalise} className="text-sm leading-relaxed" />
      </Collapsible>

      <Button variante="primaire" onClick={onEvaluer}>
        {labelAutoEvaluer}
      </Button>
    </div>
  );
}

/* ─── Phase auto-évaluation ─── */

interface EvalPhaseProps {
  onEval: (note: 0 | 0.5 | 1) => void;
  labelAutoEvaluation: string;
  labelCommentEvaluez: string;
  labelRate: string;
  labelMoyen: string;
  labelBon: string;
}

function EvalPhase({ onEval, labelAutoEvaluation, labelCommentEvaluez, labelRate, labelMoyen, labelBon }: EvalPhaseProps) {
  return (
    <div className="space-y-5">
      <Badge variante="neutre">{labelAutoEvaluation}</Badge>
      <p className="text-sm text-text-muted">{labelCommentEvaluez}</p>
      <div className="flex flex-wrap gap-3">
        <Button variante="secondaire" onClick={() => onEval(0)}>
          {labelRate}
        </Button>
        <Button variante="secondaire" onClick={() => onEval(0.5)}>
          {labelMoyen}
        </Button>
        <Button variante="primaire" onClick={() => onEval(1)}>
          {labelBon}
        </Button>
      </div>
    </div>
  );
}

/* ─── Page principale ─── */

export default function RunnerJury() {
  const { t, langue } = useLangue();
  useTitre(t('jury.titre'));

  const { modifier } = useEtat();
  const [selection, setSelection] = useState<PerimetreSelection>(perimetre0);
  const [prepS, setPrepS] = useState(0);
  const [repS, setRepS] = useState(120);
  const [vue, setVue] = useState<Vue>({ type: 'config' });
  const [vues, setVues] = useState<Set<string>>(new Set());
  const [pointsCoches, setPointsCoches] = useState<Set<number>>(new Set());
  const [bonusCoches, setBonusCoches] = useState<Set<number>>(new Set());
  const [evalFaite, setEvalFaite] = useState(false);
  const [timerKey, setTimerKey] = useState(0);

  function getBanqueFiltree(): JuryQuestion[] {
    const banque = toutesLesQuestionsJury();
    return banque.filter(q => {
      const modOk = selection.modulesChoisis.length === 0 || selection.modulesChoisis.includes(q.moduleId);
      const niveauOk = niveauAutorise(selection.niveaux, q.difficulte);
      return modOk && niveauOk;
    });
  }

  function tirer() {
    const banque = getBanqueFiltree();
    const seed = newSeed();
    const res = tirerQuestion(banque, vues, seed);
    if (!res) return;
    setVues(res.vuesMaj);
    setPointsCoches(new Set());
    setBonusCoches(new Set());
    setEvalFaite(false);
    setTimerKey(k => k + 1);

    modifier(e => {
      e.reprise = { chemin: '/entrainement/jury', libelle: 'Mode jury' };
    });

    const phase: Phase = prepS > 0 ? { type: 'prep' } : { type: 'rep' };
    setVue({
      type: 'question',
      question: res.question,
      phase,
      prepS,
      repS,
      timerKey: 0,
    });
  }

  function passerALaReponse() {
    if (vue.type !== 'question') return;
    setVue({ ...vue, phase: { type: 'rep' }, timerKey: vue.timerKey + 1 });
  }

  function terminerReponse() {
    if (vue.type !== 'question') return;
    setVue({ ...vue, phase: { type: 'correction' } });
  }

  function passerEvaluation() {
    if (vue.type !== 'question') return;
    setVue({ ...vue, phase: { type: 'eval' } });
  }

  function evaluer(note: 0 | 0.5 | 1) {
    if (vue.type !== 'question') return;
    const { question } = vue;

    modifier(e => {
      const tentative: Tentative = {
        type: 'jury',
        refId: question.id,
        moduleId: question.moduleId,
        difficulte: question.difficulte,
        reussite: note,
        date: aujourdHuiLocal(),
      };
      e.tentatives.push(tentative);
      toucherStreak(e, aujourdHuiLocal());
    });

    setEvalFaite(true);
  }

  function questionSuivante() {
    const banque = getBanqueFiltree();
    const seed = newSeed();
    const res = tirerQuestion(banque, vues, seed);
    if (!res) {
      setVue({ type: 'config' });
      return;
    }
    setVues(res.vuesMaj);
    setPointsCoches(new Set());
    setBonusCoches(new Set());
    setEvalFaite(false);

    modifier(e => {
      e.reprise = { chemin: '/entrainement/jury', libelle: 'Mode jury' };
    });

    const phase: Phase = prepS > 0 ? { type: 'prep' } : { type: 'rep' };
    setVue({
      type: 'question',
      question: res.question,
      phase,
      prepS,
      repS,
      timerKey: timerKey + 1,
    });
    setTimerKey(k => k + 1);
  }

  const dispo = getBanqueFiltree().length;

  /* ─── rendu config ─── */

  if (vue.type === 'config') {
    return (
      <div className="space-y-6">
        <h1 className="text-xl font-semibold tracking-tight text-text">{t('jury.titre')}</h1>
        <ConfigScreen
          selection={selection}
          onSelectionChange={setSelection}
          prepS={prepS}
          onPrepChange={setPrepS}
          repS={repS}
          onRepChange={setRepS}
          onTirer={tirer}
          dispo={dispo}
          labelPreparation={t('jury.preparation')}
          labelAucune={t('jury.aucune')}
          labelTirerQuestion={t('jury.tirerQuestion')}
          labelAucuneQuestion={t('commun.aucuneQuestionDisponible')}
        />
      </div>
    );
  }

  /* ─── rendu question ─── */

  const { question, phase } = vue;

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => setVue({ type: 'config' })}
        className="text-sm text-text-muted hover:text-text transition-colors duration-150"
      >
        ← {t('commun.retour')}
      </button>

      {phase.type === 'prep' && (
        <PrepPhase
          question={question}
          prepS={vue.prepS}
          timerKey={vue.timerKey}
          onPasser={passerALaReponse}
          langue={langue}
          labelPreparation={t('jury.preparation')}
          labelPasserReponse={t('jury.passerReponse')}
        />
      )}

      {phase.type === 'rep' && (
        <RepPhase
          question={question}
          repS={vue.repS}
          timerKey={vue.timerKey}
          onTerminer={terminerReponse}
          langue={langue}
          labelReponseVoixHaute={t('jury.reponseVoixHaute')}
          labelRepondezVoixHaute={t('jury.repondezVoixHaute')}
          labelJaiTermine={t('jury.jaiTermine')}
        />
      )}

      {phase.type === 'correction' && (
        <CorrectionPhase
          question={question}
          pointsCoches={pointsCoches}
          bonusCoches={bonusCoches}
          onTogglePoint={i => setPointsCoches(prev => {
            const next = new Set(prev);
            if (next.has(i)) next.delete(i); else next.add(i);
            return next;
          })}
          onToggleBonus={i => setBonusCoches(prev => {
            const next = new Set(prev);
            if (next.has(i)) next.delete(i); else next.add(i);
            return next;
          })}
          onEvaluer={passerEvaluation}
          langue={langue}
          labelGrilleCorrection={t('jury.grilleCorrection')}
          labelPlanAttendu={t('jury.planAttendu')}
          labelPointsAttendus={t('jury.pointsAttendus')}
          labelPourImpressionner={t('jury.pourImpressionner')}
          labelBonus={t('jury.bonus')}
          labelReponseModele={t('jury.reponseModele')}
          labelAutoEvaluer={t('jury.autoEvaluer')}
        />
      )}

      {phase.type === 'eval' && (
        <div className="space-y-5">
          {!evalFaite ? (
            <EvalPhase
              onEval={evaluer}
              labelAutoEvaluation={t('jury.autoEvaluation')}
              labelCommentEvaluez={t('jury.commentEvaluez')}
              labelRate={t('jury.rate')}
              labelMoyen={t('jury.moyen')}
              labelBon={t('jury.bon')}
            />
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-text-muted">{t('jury.reponseEnregistree')}</p>
              <div className="flex flex-wrap gap-3">
                <Button variante="primaire" onClick={questionSuivante}>
                  {t('commun.questionSuivante')}
                </Button>
                <Button variante="secondaire" onClick={() => setVue({ type: 'config' })}>
                  {t('commun.terminer')}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Suppress unused warning for prep/rep options arrays that are kept for reference
void PREP_OPTIONS_LIBELLES;
void PREP_OPTIONS_S;
void REP_OPTIONS_S;
