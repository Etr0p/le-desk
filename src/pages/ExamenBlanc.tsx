import { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { useTitre } from './useTitre';
import { useEtat } from '../engine/useEtat';
import { useLangue } from '../engine/useLangue';
import { champ } from '../engine/bilingue';
import { modules } from '../engine/registry';
import { composerExamen } from '../engine/examen';
import { corrigerSession } from '../engine/quiz';
import { newSeed } from '../engine/rng';
import { parseSaisie, reponseCorrecte, formatNombre } from '../engine/answers';
import { toucherStreak } from '../engine/storage';
import { aujourdHuiLocal } from '../engine/srs';
import type { Tentative } from '../engine/storage';
import type { GeneratedProblem, JuryQuestion } from '../engine/types';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Collapsible } from '../components/ui/Collapsible';
import { Timer } from '../components/ui/Timer';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { Markdown } from '../components/Markdown';
import { Etapes } from '../components/entrainement/Etapes';
import { NumericInput } from '../components/ui/NumericInput';

/* ─── Constants ─── */

const LETTRES = ['A', 'B', 'C', 'D'] as const;
const CHRONO_QCM_S = 30;
const CHRONO_JURY_PREP_S = 30;
const CHRONO_JURY_REP_S = 120;

/* ─── Types de vue ─── */

type VueAccueil = { type: 'accueil' };
type VueSectionA = { type: 'sectionA'; indexQ: number };
type VueSectionB = { type: 'sectionB'; indexP: number; indexSQ: number };
type VueSectionC = { type: 'sectionC'; indexJ: number; phase: 'prep' | 'reponse' | 'eval' };
type VueRapport = { type: 'rapport' };
type Vue = VueAccueil | VueSectionA | VueSectionB | VueSectionC | VueRapport;

/* ─── Jury self-eval ─── */

type EvalJury = 'rate' | 'moyen' | 'bon';

/* ─── helpers ─── */

function formatPct(n: number): string {
  return `${Math.round(n * 100)} %`;
}

function formatDate(iso: string): string {
  const [annee, mois, jour] = iso.split('-');
  return `${jour}/${mois}/${annee}`;
}

function evalToReussite(e: EvalJury): number {
  if (e === 'rate') return 0;
  if (e === 'moyen') return 0.5;
  return 1;
}

/* ─── Page principale ─── */

export default function ExamenBlanc() {
  const { t, langue } = useLangue();
  useTitre(t('examen.titre'));
  const { etat, modifier } = useEtat();

  const [seed, setSeed] = useState(() => newSeed());
  const [vue, setVue] = useState<Vue>({ type: 'accueil' });
  const [modalAbandonOuvert, setModalAbandonOuvert] = useState(false);

  const reponsesA = useRef<(number | null)[]>([]);
  const reponsesB = useRef<{ saisie: string; soumise: boolean }[][]>([]);
  const reponsesC = useRef<(EvalJury | null)[]>([]);

  const contenuDispo = useMemo(() => modules.length > 0 && modules.some(m => m.qcm.length > 0), []);

  const examen = useMemo(() => {
    if (!contenuDispo) return null;
    return composerExamen(modules, seed);
  }, [seed, contenuDispo]);

  const tentativesExamen = useMemo(
    () => etat.tentatives.filter(t => t.type === 'examen'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [etat],
  );

  function initialiserReponses() {
    if (!examen) return;
    reponsesA.current = Array(examen.qcm.length).fill(null);
    reponsesB.current = examen.problemes.map(p => {
      const prob = p.generateur.generate(p.seed, p.scenario, langue);
      return Array(prob.sousQuestions.length).fill(null).map(() => ({ saisie: '', soumise: false }));
    });
    reponsesC.current = Array(examen.jury.length).fill(null);
  }

  useEffect(() => {
    if (vue.type === 'accueil' || vue.type === 'rapport') {
      modifier(e => {
        if (e.reprise?.chemin === '/examen') e.reprise = undefined;
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vue.type]);

  function commencer() {
    if (!examen) return;
    initialiserReponses();
    modifier(e => {
      e.reprise = { chemin: '/examen', libelle: t('examen.enCours') };
    });
    if (examen.qcm.length > 0) {
      setVue({ type: 'sectionA', indexQ: 0 });
    } else if (examen.problemes.length > 0) {
      setVue({ type: 'sectionB', indexP: 0, indexSQ: 0 });
    } else if (examen.jury.length > 0) {
      setVue({ type: 'sectionC', indexJ: 0, phase: 'prep' });
    } else {
      setVue({ type: 'rapport' });
    }
  }

  function abandonner() {
    setSeed(newSeed());
    modifier(e => { e.reprise = undefined; });
    setVue({ type: 'accueil' });
    setModalAbandonOuvert(false);
  }

  function terminer(evalsC: (EvalJury | null)[]) {
    if (!examen) return;

    const scoreA = calculerScoreA();
    const scoreBArr = calculerScoreB();
    const scoreBMoy = scoreBArr.length > 0 ? scoreBArr.reduce((a, b) => a + b, 0) / scoreBArr.length : 0;
    const scoreCArr = evalsC.map(e => e ? evalToReussite(e) : 0);
    const scoreCMoy = scoreCArr.length > 0 ? scoreCArr.reduce((a, b) => a + b, 0) / scoreCArr.length : 0;

    const wA = examen.qcm.length > 0 ? 0.4 : 0;
    const wB = examen.problemes.length > 0 ? 0.4 : 0;
    const wC = examen.jury.length > 0 ? 0.2 : 0;
    const wTotal = wA + wB + wC;
    const scoreGlobal = wTotal > 0
      ? (scoreA * wA + scoreBMoy * wB + scoreCMoy * wC) / wTotal
      : 0;

    const aujourd = aujourdHuiLocal();
    modifier(e => {
      const tentative: Tentative = {
        date: aujourd,
        type: 'examen',
        refId: `examen-${seed}`,
        moduleId: 'global',
        reussite: scoreGlobal,
      };
      e.tentatives.push(tentative);
      toucherStreak(e, aujourd);
      e.reprise = undefined;
    });

    setVue({ type: 'rapport' });
  }

  function calculerScoreA(): number {
    if (!examen || examen.qcm.length === 0) return 0;
    const resultat = corrigerSession(examen.qcm, reponsesA.current);
    return resultat.total > 0 ? resultat.bonnes / resultat.total : 0;
  }

  function calculerScoreB(): number[] {
    if (!examen) return [];
    return examen.problemes.map((p, pi) => {
      const prob = p.generateur.generate(p.seed, p.scenario, langue);
      const n = prob.sousQuestions.length;
      if (n === 0) return 0;
      const reponses = reponsesB.current[pi] ?? [];
      let bonnes = 0;
      prob.sousQuestions.forEach((sq, si) => {
        const r = reponses[si];
        if (!r || !r.soumise) return;
        const val = parseSaisie(r.saisie);
        if (val !== null && reponseCorrecte(val, sq.reponse, sq.tolerance, sq.toleranceMode ?? 'relatif')) {
          bonnes++;
        }
      });
      return bonnes / n;
    });
  }

  if (vue.type === 'accueil') {
    return (
      <AccueilScreen
        contenuDispo={contenuDispo}
        tentativesExamen={tentativesExamen}
        examen={examen}
        onCommencer={commencer}
        langue={langue}
        t={t}
      />
    );
  }

  if (!examen) return null;

  const boutonAbandon = (
    <button
      type="button"
      onClick={() => setModalAbandonOuvert(true)}
      className="text-sm text-text-muted hover:text-err transition-colors duration-150"
    >
      {t('examen.abandonner')}
    </button>
  );

  /* ─── Section A ─── */
  if (vue.type === 'sectionA') {
    return (
      <>
        <SectionAScreen
          examenQcm={examen.qcm}
          indexQ={vue.indexQ}
          onRepondre={(idx, rep) => { reponsesA.current[idx] = rep; }}
          onSuivante={(idx) => {
            const suivant = idx + 1;
            if (suivant < examen.qcm.length) {
              setVue({ type: 'sectionA', indexQ: suivant });
            } else if (examen.problemes.length > 0) {
              setVue({ type: 'sectionB', indexP: 0, indexSQ: 0 });
            } else if (examen.jury.length > 0) {
              setVue({ type: 'sectionC', indexJ: 0, phase: 'prep' });
            } else {
              terminer(reponsesC.current);
            }
          }}
          boutonAbandon={boutonAbandon}
          langue={langue}
          t={t}
        />
        <Modal ouvert={modalAbandonOuvert} onFermer={() => setModalAbandonOuvert(false)} titre={t('examen.abandonnerTitre')}>
          <AbandonModal onConfirmer={abandonner} onAnnuler={() => setModalAbandonOuvert(false)} t={t} />
        </Modal>
      </>
    );
  }

  /* ─── Section B ─── */
  if (vue.type === 'sectionB') {
    if (vue.indexP >= examen.problemes.length) return null;
    const prob = examen.problemes[vue.indexP].generateur.generate(
      examen.problemes[vue.indexP].seed,
      examen.problemes[vue.indexP].scenario,
      langue,
    );
    const sousQtotaux = examen.problemes.map(p =>
      p.generateur.generate(p.seed, p.scenario, langue).sousQuestions.length,
    );
    const totalSQ = sousQtotaux.reduce((a, b) => a + b, 0);
    const cumulSQAvant = sousQtotaux.slice(0, vue.indexP).reduce((a, b) => a + b, 0);
    return (
      <>
        <SectionBScreen
          indexP={vue.indexP}
          totalP={examen.problemes.length}
          probleme={prob}
          indexSQ={vue.indexSQ}
          cumulSQAvant={cumulSQAvant}
          totalSQ={totalSQ}
          reponsesBP={reponsesB.current[vue.indexP] ?? []}
          onSaisieChange={(si, val) => {
            if (!reponsesB.current[vue.indexP]) return;
            reponsesB.current[vue.indexP][si] = { ...reponsesB.current[vue.indexP][si], saisie: val };
          }}
          onSoumettreSQ={(si) => {
            if (!reponsesB.current[vue.indexP]) return;
            reponsesB.current[vue.indexP][si] = { ...reponsesB.current[vue.indexP][si], soumise: true };
            const nSQ = prob.sousQuestions.length;
            if (si + 1 < nSQ) {
              setVue({ ...vue, indexSQ: si + 1 });
            } else {
              const nextP = vue.indexP + 1;
              if (nextP < examen.problemes.length) {
                setVue({ type: 'sectionB', indexP: nextP, indexSQ: 0 });
              } else if (examen.jury.length > 0) {
                setVue({ type: 'sectionC', indexJ: 0, phase: 'prep' });
              } else {
                terminer(reponsesC.current);
              }
            }
          }}
          boutonAbandon={boutonAbandon}
          t={t}
        />
        <Modal ouvert={modalAbandonOuvert} onFermer={() => setModalAbandonOuvert(false)} titre={t('examen.abandonnerTitre')}>
          <AbandonModal onConfirmer={abandonner} onAnnuler={() => setModalAbandonOuvert(false)} t={t} />
        </Modal>
      </>
    );
  }

  /* ─── Section C ─── */
  if (vue.type === 'sectionC') {
    if (vue.indexJ >= examen.jury.length) return null;
    return (
      <>
        <SectionCScreen
          indexJ={vue.indexJ}
          phase={vue.phase}
          question={examen.jury[vue.indexJ]}
          totalJ={examen.jury.length}
          onEval={(eval_) => {
            reponsesC.current[vue.indexJ] = eval_;
            const nextJ = vue.indexJ + 1;
            if (nextJ < examen.jury.length) {
              setVue({ type: 'sectionC', indexJ: nextJ, phase: 'prep' });
            } else {
              terminer(reponsesC.current);
            }
          }}
          onAvancerPhase={(phase) => setVue({ ...vue, phase })}
          boutonAbandon={boutonAbandon}
          langue={langue}
          t={t}
        />
        <Modal ouvert={modalAbandonOuvert} onFermer={() => setModalAbandonOuvert(false)} titre={t('examen.abandonnerTitre')}>
          <AbandonModal onConfirmer={abandonner} onAnnuler={() => setModalAbandonOuvert(false)} t={t} />
        </Modal>
      </>
    );
  }

  /* ─── Rapport ─── */
  if (vue.type === 'rapport') {
    const scoreA = calculerScoreA();
    const scoreBArr = calculerScoreB();
    const scoreBMoy = scoreBArr.length > 0 ? scoreBArr.reduce((a, b) => a + b, 0) / scoreBArr.length : 0;
    const scoreCArr = (reponsesC.current as (EvalJury | null)[]).map(e => e ? evalToReussite(e) : 0);
    const scoreCMoy = scoreCArr.length > 0 ? scoreCArr.reduce((a, b) => a + b, 0) / scoreCArr.length : 0;
    const wA = examen.qcm.length > 0 ? 0.4 : 0;
    const wB = examen.problemes.length > 0 ? 0.4 : 0;
    const wC = examen.jury.length > 0 ? 0.2 : 0;
    const wTotal = wA + wB + wC;
    const scoreGlobal = wTotal > 0 ? (scoreA * wA + scoreBMoy * wB + scoreCMoy * wC) / wTotal : 0;

    const resultatQcm = corrigerSession(examen.qcm, reponsesA.current);

    return (
      <RapportScreen
        examen={examen}
        scoreA={scoreA}
        scoreBArr={scoreBArr}
        scoreCArr={scoreCArr}
        scoreGlobal={scoreGlobal}
        poidsA={wTotal > 0 ? wA / wTotal : 0}
        poidsB={wTotal > 0 ? wB / wTotal : 0}
        poidsC={wTotal > 0 ? wC / wTotal : 0}
        resultatQcm={resultatQcm}
        reponsesA={reponsesA.current}
        reponsesB={reponsesB.current}
        evalsC={reponsesC.current as (EvalJury | null)[]}
        onRetour={() => { setSeed(newSeed()); setVue({ type: 'accueil' }); }}
        langue={langue}
        t={t}
      />
    );
  }

  return null;
}

/* ─── Écran Accueil ─── */

type TFn = (cle: Parameters<ReturnType<typeof useLangue>['t']>[0]) => string;

interface AccueilScreenProps {
  contenuDispo: boolean;
  tentativesExamen: Tentative[];
  examen: ReturnType<typeof composerExamen> | null;
  onCommencer: () => void;
  langue: 'fr' | 'en';
  t: TFn;
}

function AccueilScreen({ contenuDispo, tentativesExamen, examen, onCommencer, t }: AccueilScreenProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold tracking-tight text-text">{t('examen.titre')}</h1>

      {!contenuDispo ? (
        <EmptyState
          titre={t('examen.contenuInsuffisant')}
          indice={t('examen.contenuInsuffisantIndice')}
        />
      ) : (
        <div className="space-y-5">
          <div className="rounded-lg border border-border bg-surface p-5 space-y-3">
            <h2 className="text-sm font-semibold text-text">{t('examen.format')}</h2>
            <ul className="space-y-2 text-sm text-text-muted">
              {examen && examen.qcm.length > 0 && (
                <li><span className="font-medium text-text">{t('examen.sectionA')} :</span> {examen.qcm.length} {t('examen.qcmChronometres')}</li>
              )}
              {examen && examen.problemes.length > 0 && (
                <li><span className="font-medium text-text">{t('examen.sectionB')} :</span> {examen.problemes.length} {examen.problemes.length > 1 ? t('examen.problemesQuantitatifs') : t('examen.problemeQuantitatif')}</li>
              )}
              {examen && examen.jury.length > 0 && (
                <li><span className="font-medium text-text">{t('examen.sectionC')} :</span> {examen.jury.length} {examen.jury.length > 1 ? t('examen.questionsJury') : t('examen.questionJury')}</li>
              )}
            </ul>
            <p className="text-xs text-text-muted">{t('examen.perimetreDuree')}</p>
          </div>

          <Button variante="primaire" onClick={onCommencer}>
            {t('examen.commencerExamen')}
          </Button>

          {tentativesExamen.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-text">{t('examen.historique')}</h2>
              <ul className="space-y-2">
                {tentativesExamen
                  .slice()
                  .reverse()
                  .slice(0, 5)
                  .map((tentative, i) => (
                    <li key={i} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface p-3 text-sm">
                      <span className="text-text-muted">{formatDate(tentative.date)}</span>
                      <span className="tabular-nums font-semibold text-text">{formatPct(tentative.reussite)}</span>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Modal abandon ─── */

function AbandonModal({ onConfirmer, onAnnuler, t }: { onConfirmer: () => void; onAnnuler: () => void; t: TFn }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-text-muted leading-relaxed">
        {t('examen.abandonMessage')}
      </p>
      <div className="flex gap-2">
        <Button variante="secondaire" onClick={onConfirmer} className="text-err border-err/30 hover:border-err/60">
          {t('examen.abandonner')}
        </Button>
        <Button variante="primaire" onClick={onAnnuler}>
          {t('examen.continuerExamen')}
        </Button>
      </div>
    </div>
  );
}

/* ─── Section A — QCM ─── */

interface SectionAScreenProps {
  examenQcm: ReturnType<typeof composerExamen>['qcm'];
  indexQ: number;
  onRepondre: (idx: number, rep: number | null) => void;
  onSuivante: (idx: number) => void;
  boutonAbandon: React.ReactNode;
  langue: 'fr' | 'en';
  t: TFn;
}

function SectionAScreen({ examenQcm, indexQ, onRepondre, onSuivante, boutonAbandon, langue, t }: SectionAScreenProps) {
  const [choisi, setChoisi] = useState<number | null>(null);
  const [avance, setAvance] = useState(false);
  const [timerKey, setTimerKey] = useState(0);

  const q = examenQcm[indexQ];
  const total = examenQcm.length;

  // Localisation QCM
  const questionTexte = champ(langue, q.question.question, q.question.questionEn);
  const optionsLocalises = q.question.optionsEn && langue === 'en' ? q.question.optionsEn : q.question.options;
  const themeLocalise = champ(langue, q.question.theme, q.question.themeEn);

  function choisir(displayIdx: number) {
    if (avance) return;
    setChoisi(displayIdx);
  }

  function valider() {
    if (avance) return;
    onRepondre(indexQ, choisi);
    setAvance(true);
  }

  const handleExpiration = useCallback(() => {
    if (avance) return;
    onRepondre(indexQ, choisi);
    setAvance(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [avance, indexQ, choisi]);

  function suivante() {
    setChoisi(null);
    setAvance(false);
    setTimerKey(k => k + 1);
    onSuivante(indexQ);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-text">{t('examen.sectionATitre')}</span>
        {boutonAbandon}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-text-muted tabular-nums">A · {indexQ + 1}/{total}</span>
        {!avance && (
          <Timer
            key={timerKey}
            secondes={CHRONO_QCM_S}
            enMarche={!avance}
            onFin={handleExpiration}
          />
        )}
      </div>
      <ProgressBar valeur={(indexQ + (avance ? 1 : 0)) / total} />

      <div className="rounded-lg border border-border bg-surface p-4">
        <Markdown texte={questionTexte} className="text-sm leading-relaxed text-text" />
        <div className="mt-1.5 flex gap-2">
          <Badge variante="neutre">{themeLocalise}</Badge>
        </div>
      </div>

      <ul className="space-y-2">
        {q.ordreOptions.map((origIdx, displayIdx) => (
          <li key={displayIdx}>
            <button
              type="button"
              disabled={avance}
              onClick={() => choisir(displayIdx)}
              className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors duration-150 ${
                avance
                  ? 'border-border bg-surface-2/50 text-text-muted cursor-default'
                  : choisi === displayIdx
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-border bg-surface-2 text-text hover:border-accent/40 cursor-pointer'
              }`}
            >
              <span className="shrink-0 font-semibold">{LETTRES[displayIdx]}.</span>
              <Markdown texte={optionsLocalises[origIdx]} className="text-sm min-w-0 flex-1" />
            </button>
          </li>
        ))}
      </ul>

      {avance ? (
        <div className="flex items-center gap-3">
          <p className="text-sm text-text-muted">{t('jury.reponseEnregistree')}</p>
          <Button variante="primaire" onClick={suivante}>
            {indexQ + 1 < examenQcm.length ? t('commun.questionSuivante') : t('examen.sectionB')}
          </Button>
        </div>
      ) : (
        <Button variante="primaire" onClick={valider} disabled={choisi === null}>
          {t('commun.valider')}
        </Button>
      )}
    </div>
  );
}

/* ─── Section B — Problèmes ─── */

interface SectionBScreenProps {
  indexP: number;
  totalP: number;
  probleme: GeneratedProblem;
  indexSQ: number;
  reponsesBP: { saisie: string; soumise: boolean }[];
  onSaisieChange: (si: number, val: string) => void;
  onSoumettreSQ: (si: number) => void;
  boutonAbandon: React.ReactNode;
  cumulSQAvant: number;
  totalSQ: number;
  t: TFn;
}

function SectionBScreen({
  indexP, totalP, probleme, indexSQ, reponsesBP,
  onSaisieChange, onSoumettreSQ, boutonAbandon,
  cumulSQAvant, totalSQ, t,
}: SectionBScreenProps) {
  const [saisieLocale, setSaisieLocale] = useState('');
  const n = probleme.sousQuestions.length;

  function soumettre() {
    onSaisieChange(indexSQ, saisieLocale);
    setSaisieLocale('');
    onSoumettreSQ(indexSQ);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-text">{t('examen.sectionBTitre')}</span>
        {boutonAbandon}
      </div>
      <span className="text-sm text-text-muted tabular-nums">B · {indexP + 1}/{totalP} — Q{indexSQ + 1}/{n}</span>
      <ProgressBar valeur={totalSQ > 0 ? (cumulSQAvant + indexSQ) / totalSQ : 0} />

      <div className="rounded-lg border border-border bg-surface p-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">{t('exo.miseEnSituation')}</p>
        <Markdown texte={probleme.contexte} className="text-sm leading-relaxed text-text" />
      </div>

      {reponsesBP.slice(0, indexSQ).map((r, si) => (
        <div key={si} className="rounded-lg border border-border bg-surface-2/40 p-4 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Q{si + 1}</p>
          <p className="text-sm text-text">{probleme.sousQuestions[si].intitule}</p>
          <p className="text-xs text-text-muted">{t('commun.reponse')} : {r.saisie || '—'}</p>
        </div>
      ))}

      <div className="rounded-lg border border-border bg-surface p-5 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          {t('commun.question')} {indexSQ + 1}/{n}
        </p>
        {probleme.sousQuestions[indexSQ].intitule && (
          <p className="text-sm font-semibold text-text">{probleme.sousQuestions[indexSQ].intitule}</p>
        )}
        <Markdown texte={probleme.sousQuestions[indexSQ].enonce} className="text-sm leading-relaxed text-text" />

        <div className="flex gap-2">
          <div className="flex-1">
            <NumericInput
              value={saisieLocale}
              onChange={setSaisieLocale}
              onSubmit={soumettre}
              unite={probleme.sousQuestions[indexSQ].unite}
              placeholder="0"
              label={`${t('commun.reponse')} Q${indexSQ + 1}`}
              autoFocus
            />
          </div>
          <Button variante="primaire" onClick={soumettre}>
            {t('commun.valider')}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ─── Section C — Jury ─── */

interface SectionCScreenProps {
  indexJ: number;
  totalJ: number;
  phase: 'prep' | 'reponse' | 'eval';
  question: JuryQuestion;
  onEval: (e: EvalJury) => void;
  onAvancerPhase: (phase: 'prep' | 'reponse' | 'eval') => void;
  boutonAbandon: React.ReactNode;
  langue: 'fr' | 'en';
  t: TFn;
}

function SectionCScreen({ indexJ, totalJ, phase, question, onEval, onAvancerPhase, boutonAbandon, langue, t }: SectionCScreenProps) {
  const questionTexte = champ(langue, question.question, question.questionEn);
  const themeLocalise = champ(langue, question.theme, question.themeEn);
  const planLocalise = champ(langue, question.plan, question.planEn) ?? question.plan;
  const pointsLocalises = champ(langue, question.pointsAttendus, question.pointsAttendusEn) ?? question.pointsAttendus;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-text">{t('examen.sectionCTitre')}</span>
        {boutonAbandon}
      </div>
      <span className="text-sm text-text-muted tabular-nums">C · {indexJ + 1}/{totalJ}</span>
      <ProgressBar valeur={indexJ / totalJ} />

      <div className="rounded-lg border border-border bg-surface p-5 space-y-3">
        <p className="text-sm font-semibold text-text">{questionTexte}</p>
        <div className="flex gap-2">
          <Badge variante="neutre">{themeLocalise}</Badge>
        </div>
      </div>

      {phase === 'prep' && (
        <div className="space-y-4">
          <p className="text-sm text-text-muted">
            {t('examen.organisezMentalement')}
          </p>
          <div className="flex items-center gap-3">
            <p className="text-sm text-text-muted">{t('jury.preparation')} :</p>
            <Timer
              secondes={CHRONO_JURY_PREP_S}
              enMarche
              onFin={() => onAvancerPhase('reponse')}
            />
          </div>
          <Button variante="primaire" onClick={() => onAvancerPhase('reponse')}>
            {t('examen.commencerReponse')}
          </Button>
        </div>
      )}

      {phase === 'reponse' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <p className="text-sm text-text-muted">{t('examen.tempsReponse')} :</p>
            <Timer
              secondes={CHRONO_JURY_REP_S}
              enMarche
              onFin={() => onAvancerPhase('eval')}
            />
          </div>
          <Button variante="primaire" onClick={() => onAvancerPhase('eval')}>
            {t('examen.terminerEvaluer')}
          </Button>
        </div>
      )}

      {phase === 'eval' && (
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-surface-2/40 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">{t('jury.planAttendu')}</p>
            <ul className="space-y-1">
              {planLocalise.map((p, i) => (
                <li key={i} className="text-sm text-text-muted">{i + 1}. {p}</li>
              ))}
            </ul>
          </div>
          {pointsLocalises.length > 0 && (
            <div className="rounded-lg border border-border bg-surface-2/40 p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">{t('jury.pointsAttendus')}</p>
              <ul className="space-y-1">
                {pointsLocalises.map((p, i) => (
                  <li key={i} className="text-sm text-text-muted">– {p}</li>
                ))}
              </ul>
            </div>
          )}
          <p className="text-sm font-medium text-text">{t('examen.autoEvalSubjective')}</p>
          <div className="flex gap-2">
            <Button variante="secondaire" onClick={() => onEval('rate')} className="text-err border-err/30">
              {t('jury.rate')}
            </Button>
            <Button variante="secondaire" onClick={() => onEval('moyen')} className="text-warn border-warn/30">
              {t('jury.moyen')}
            </Button>
            <Button variante="secondaire" onClick={() => onEval('bon')} className="text-ok border-ok/30">
              {t('jury.bon')}
            </Button>
          </div>
          <p className="text-xs text-text-muted">
            {t('examen.reponseModeleRapport')}
          </p>
        </div>
      )}
    </div>
  );
}

/* ─── Rapport final ─── */

interface RapportScreenProps {
  examen: ReturnType<typeof composerExamen>;
  scoreA: number;
  scoreBArr: number[];
  scoreCArr: number[];
  scoreGlobal: number;
  poidsA: number;
  poidsB: number;
  poidsC: number;
  resultatQcm: ReturnType<typeof corrigerSession>;
  reponsesA: (number | null)[];
  reponsesB: { saisie: string; soumise: boolean }[][];
  evalsC: (EvalJury | null)[];
  onRetour: () => void;
  langue: 'fr' | 'en';
  t: TFn;
}

function RapportScreen({
  examen, scoreA, scoreBArr, scoreCArr, scoreGlobal,
  poidsA, poidsB, poidsC,
  resultatQcm, reponsesA, reponsesB, evalsC, onRetour, langue, t,
}: RapportScreenProps) {
  const scoreBMoy = scoreBArr.length > 0 ? scoreBArr.reduce((a, b) => a + b, 0) / scoreBArr.length : 0;
  const scoreCMoy = scoreCArr.length > 0 ? scoreCArr.reduce((a, b) => a + b, 0) / scoreCArr.length : 0;

  const evalLabel: Record<EvalJury, string> = {
    rate: t('jury.rate'),
    moyen: t('jury.moyen'),
    bon: t('jury.bon'),
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold tracking-tight text-text">{t('examen.rapportTitre')}</h1>

      {/* Score global */}
      <div className="rounded-lg border border-border bg-surface p-5 space-y-4">
        <div>
          <p className="text-3xl font-bold tabular-nums text-text">{formatPct(scoreGlobal)}</p>
          <p className="text-sm text-text-muted mt-1">{t('examen.scoreGlobal')}</p>
        </div>
        <ProgressBar valeur={scoreGlobal} />
        <div className="grid grid-cols-3 gap-4 text-center">
          {poidsA > 0 && (
            <div>
              <p className="text-lg font-semibold tabular-nums text-text">{formatPct(scoreA)}</p>
              <p className="text-xs text-text-muted">{t('examen.sectionA')} ({formatPct(poidsA)})</p>
            </div>
          )}
          {poidsB > 0 && (
            <div>
              <p className="text-lg font-semibold tabular-nums text-text">{formatPct(scoreBMoy)}</p>
              <p className="text-xs text-text-muted">{t('examen.sectionB')} ({formatPct(poidsB)})</p>
            </div>
          )}
          {poidsC > 0 && (
            <div>
              <p className="text-lg font-semibold tabular-nums text-text">{formatPct(scoreCMoy)}</p>
              <p className="text-xs text-text-muted">{t('examen.sectionC')} ({formatPct(poidsC)})</p>
            </div>
          )}
        </div>
      </div>

      {/* Ventilation par thème */}
      {Object.keys(resultatQcm.parTheme).length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-text">{t('examen.resultatsQcmTheme')}</h2>
          <ul className="space-y-2">
            {Object.entries(resultatQcm.parTheme).map(([theme, { bonnes, total }]) => (
              <li key={theme} className="space-y-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm text-text">{theme}</span>
                  <span className="text-xs tabular-nums text-text-muted">{bonnes}/{total} — {formatPct(total > 0 ? bonnes / total : 0)}</span>
                </div>
                <ProgressBar valeur={total > 0 ? bonnes / total : 0} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Corrigé Section A */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-text">{t('examen.corrigeA')}</h2>
        <div className="space-y-2">
          {examen.qcm.map((sq, qi) => {
            const repDonnee = reponsesA[qi] ?? null;
            const bonneAffiche = sq.ordreOptions.indexOf(sq.question.bonneReponse);
            const correcte = repDonnee !== null && sq.ordreOptions[repDonnee] === sq.question.bonneReponse;
            const questionTexte = champ(langue, sq.question.question, sq.question.questionEn);
            const optionsLocalises = sq.question.optionsEn && langue === 'en' ? sq.question.optionsEn : sq.question.options;
            const explicationsLocalises = sq.question.explicationsEn && langue === 'en' ? sq.question.explicationsEn : sq.question.explications;
            const verdictLabel = correcte ? t('qcm.juste') : repDonnee === null ? t('examen.sansReponse') : t('qcm.faux');
            return (
              <Collapsible
                key={qi}
                titre={`Q${qi + 1} — ${verdictLabel} — ${questionTexte.slice(0, 60)}${questionTexte.length > 60 ? '…' : ''}`}
              >
                <div className="space-y-3">
                  <Markdown texte={questionTexte} className="text-sm font-medium" />
                  <ul className="space-y-2">
                    {sq.ordreOptions.map((origIdx, displayIdx) => {
                      const estBonne = displayIdx === bonneAffiche;
                      const estChoisie = displayIdx === repDonnee && !correcte;
                      return (
                        <li
                          key={displayIdx}
                          className={`rounded-md border p-2 text-sm ${
                            estBonne ? 'border-ok/30 bg-ok/5 text-ok'
                            : estChoisie ? 'border-err/30 bg-err/5 text-err'
                            : 'border-border text-text-muted'
                          }`}
                        >
                          <p className="font-medium">{LETTRES[displayIdx]}. {optionsLocalises[origIdx]}</p>
                          <p className="mt-0.5 text-xs opacity-80">{explicationsLocalises[origIdx]}</p>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </Collapsible>
            );
          })}
        </div>
      </div>

      {/* Corrigé Section B */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-text">{t('examen.corrigeB')}</h2>
        <div className="space-y-2">
          {examen.problemes.map((p, pi) => {
            const prob = p.generateur.generate(p.seed, p.scenario, langue);
            const score = scoreBArr[pi] ?? 0;
            return (
              <Collapsible
                key={pi}
                titre={`${t('examen.probleme')} ${pi + 1} — ${formatPct(score)} — ${champ(langue, p.generateur.titre, p.generateur.titreEn)}`}
              >
                <div className="space-y-4">
                  <Markdown texte={prob.contexte} className="text-sm text-text-muted" />
                  {prob.sousQuestions.map((sq, si) => {
                    const r = reponsesB[pi]?.[si];
                    const val = r ? parseSaisie(r.saisie) : null;
                    const correct = val !== null && reponseCorrecte(val, sq.reponse, sq.tolerance, sq.toleranceMode ?? 'relatif');
                    return (
                      <div key={si} className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Q{si + 1}</p>
                        {sq.intitule && <p className="text-sm font-medium text-text">{sq.intitule}</p>}
                        <Markdown texte={sq.enonce} className="text-sm text-text" />
                        <div className="flex gap-4 text-sm">
                          <span className={correct ? 'text-ok' : 'text-err'}>
                            {t('examen.votreReponseLabel')} {r?.saisie || '—'}
                          </span>
                          <span className="text-text-muted">
                            {t('examen.reponseExacteLabel')} {formatNombre(sq.reponse, 6)}{sq.unite ? ` ${sq.unite}` : ''}
                          </span>
                        </div>
                        {sq.etapes.length > 0 && <Etapes etapes={sq.etapes} />}
                      </div>
                    );
                  })}
                </div>
              </Collapsible>
            );
          })}
        </div>
      </div>

      {/* Corrigé Section C */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-text">{t('examen.corrigeC')}</h2>
        <div className="space-y-2">
          {examen.jury.map((j, ji) => {
            const eval_ = evalsC[ji];
            const questionTexte = champ(langue, j.question, j.questionEn);
            return (
              <Collapsible
                key={ji}
                titre={`${t('examen.juryLabel')} ${ji + 1} — ${eval_ ? evalLabel[eval_] : '—'} — ${questionTexte.slice(0, 60)}${questionTexte.length > 60 ? '…' : ''}`}
              >
                <QuestionJuryCorrige question={j} langue={langue} t={t} />
              </Collapsible>
            );
          })}
        </div>
      </div>

      <Button variante="secondaire" onClick={onRetour}>
        {t('examen.retourAccueil')}
      </Button>
    </div>
  );
}

/* ─── Corrigé jury ─── */

function QuestionJuryCorrige({ question, langue, t }: { question: JuryQuestion; langue: 'fr' | 'en'; t: TFn }) {
  const planLocalise = champ(langue, question.plan, question.planEn) ?? question.plan;
  const pointsLocalises = champ(langue, question.pointsAttendus, question.pointsAttendusEn) ?? question.pointsAttendus;
  const bonusLocalises = question.bonus
    ? (champ(langue, question.bonus, question.bonusEn) ?? question.bonus)
    : undefined;
  const reponseModeleLocalise = champ(langue, question.reponseModele, question.reponseModeleEn);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">{t('examen.plan')}</p>
        <ul className="list-disc pl-4 space-y-1">
          {planLocalise.map((p, i) => (
            <li key={i} className="text-sm text-text">{p}</li>
          ))}
        </ul>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">{t('jury.pointsAttendus')}</p>
        <ul className="list-disc pl-4 space-y-1">
          {pointsLocalises.map((p, i) => (
            <li key={i} className="text-sm text-text">{p}</li>
          ))}
        </ul>
      </div>
      {bonusLocalises && bonusLocalises.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">{t('examen.bonusTitre')}</p>
          <ul className="list-disc pl-4 space-y-1">
            {bonusLocalises.map((b, i) => (
              <li key={i} className="text-sm text-text-muted">{b}</li>
            ))}
          </ul>
        </div>
      )}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">{t('examen.reponseModele')}</p>
        <Markdown texte={reponseModeleLocalise} className="text-sm leading-relaxed text-text" />
      </div>
    </div>
  );
}
