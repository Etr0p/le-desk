import { useMemo, useState, useRef, useCallback } from 'react';
import { useTitre } from './useTitre';
import { useEtat } from '../engine/useEtat';
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
  useTitre('Examen blanc');
  const { etat, modifier } = useEtat();

  // Seed stable pour tout l'examen (généré une fois)
  const [seed] = useState(() => newSeed());
  const [vue, setVue] = useState<Vue>({ type: 'accueil' });
  const [modalAbandonOuvert, setModalAbandonOuvert] = useState(false);

  // Réponses Section A (QCM)
  const reponsesA = useRef<(number | null)[]>([]);

  // Réponses Section B (problèmes : saisies par sous-question)
  const reponsesB = useRef<{ saisie: string; soumise: boolean }[][]>([]);

  // Réponses Section C (jury)
  const reponsesC = useRef<(EvalJury | null)[]>([]);

  // Examen composé (via useMemo — recomposé à partir du seed, jamais persisté)
  const contenuDispo = useMemo(() => modules.length > 0 && modules.some(m => m.qcm.length > 0), []);

  const examen = useMemo(() => {
    if (!contenuDispo) return null;
    return composerExamen(modules, seed);
  }, [seed, contenuDispo]);

  // Tentatives examen passées
  const tentativesExamen = useMemo(
    () => etat.tentatives.filter(t => t.type === 'examen'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [etat],
  );

  /* ─── Initialisation réponses ─── */
  function initialiserReponses() {
    if (!examen) return;
    reponsesA.current = Array(examen.qcm.length).fill(null);
    reponsesB.current = examen.problemes.map(p => {
      const prob = p.generateur.generate(p.seed, p.scenario);
      return Array(prob.sousQuestions.length).fill(null).map(() => ({ saisie: '', soumise: false }));
    });
    reponsesC.current = Array(examen.jury.length).fill(null);
  }

  /* ─── Démarrer l'examen ─── */
  function commencer() {
    if (!examen) return;
    initialiserReponses();
    modifier(e => {
      e.reprise = { chemin: '/examen', libelle: 'Examen blanc en cours' };
    });
    setVue({ type: 'sectionA', indexQ: 0 });
  }

  /* ─── Abandonner ─── */
  function abandonner() {
    // Rien n'est enregistré lors d'un abandon (voir règle "quit policy" — intentionnel)
    modifier(e => { e.reprise = undefined; });
    setVue({ type: 'accueil' });
    setModalAbandonOuvert(false);
  }

  /* ─── Terminer et enregistrer ─── */
  function terminer(evalsC: (EvalJury | null)[]) {
    if (!examen) return;

    // Scores par section
    const scoreA = calculerScoreA();
    const scoreBArr = calculerScoreB();
    const scoreBMoy = scoreBArr.length > 0 ? scoreBArr.reduce((a, b) => a + b, 0) / scoreBArr.length : 0;
    const scoreCArr = evalsC.map(e => e ? evalToReussite(e) : 0);
    const scoreCMoy = scoreCArr.length > 0 ? scoreCArr.reduce((a, b) => a + b, 0) / scoreCArr.length : 0;

    // Score global pondéré : QCM 40 % + problèmes 40 % + jury 20 %
    const scoreGlobal = scoreA * 0.4 + scoreBMoy * 0.4 + scoreCMoy * 0.2;

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

  /* ─── Calcul des scores ─── */
  function calculerScoreA(): number {
    if (!examen || examen.qcm.length === 0) return 0;
    const resultat = corrigerSession(examen.qcm, reponsesA.current);
    return resultat.total > 0 ? resultat.bonnes / resultat.total : 0;
  }

  function calculerScoreB(): number[] {
    if (!examen) return [];
    return examen.problemes.map((p, pi) => {
      const prob = p.generateur.generate(p.seed, p.scenario);
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

  /* ─── Rendu accueil ─── */
  if (vue.type === 'accueil') {
    return (
      <AccueilScreen
        contenuDispo={contenuDispo}
        tentativesExamen={tentativesExamen}
        onCommencer={commencer}
      />
    );
  }

  if (!examen) return null;

  /* ─── Bouton abandonner commun ─── */
  const boutonAbandon = (
    <button
      type="button"
      onClick={() => setModalAbandonOuvert(true)}
      className="text-sm text-text-muted hover:text-err transition-colors duration-150"
    >
      Abandonner
    </button>
  );

  /* ─── Section A ─── */
  if (vue.type === 'sectionA') {
    return (
      <>
        <SectionAScreen
          examenQcm={examen.qcm}
          indexQ={vue.indexQ}
          reponses={reponsesA.current}
          onRepondre={(idx, rep) => { reponsesA.current[idx] = rep; }}
          onSuivante={(idx) => {
            const suivant = idx + 1;
            if (suivant < examen.qcm.length) {
              setVue({ type: 'sectionA', indexQ: suivant });
            } else {
              setVue({ type: 'sectionB', indexP: 0, indexSQ: 0 });
            }
          }}
          boutonAbandon={boutonAbandon}
        />
        <Modal ouvert={modalAbandonOuvert} onFermer={() => setModalAbandonOuvert(false)} titre="Abandonner l'examen">
          <AbandonModal onConfirmer={abandonner} onAnnuler={() => setModalAbandonOuvert(false)} />
        </Modal>
      </>
    );
  }

  /* ─── Section B ─── */
  if (vue.type === 'sectionB') {
    const prob = examen.problemes[vue.indexP].generateur.generate(
      examen.problemes[vue.indexP].seed,
      examen.problemes[vue.indexP].scenario,
    );
    return (
      <>
        <SectionBScreen
          indexP={vue.indexP}
          totalP={examen.problemes.length}
          probleme={prob}
          indexSQ={vue.indexSQ}
          reponsesBP={reponsesB.current[vue.indexP] ?? []}
          onSaisieChange={(si, val) => {
            if (!reponsesB.current[vue.indexP]) return;
            reponsesB.current[vue.indexP][si] = { ...reponsesB.current[vue.indexP][si], saisie: val };
          }}
          onSoumettreSQ={(si) => {
            if (!reponsesB.current[vue.indexP]) return;
            reponsesB.current[vue.indexP][si] = { ...reponsesB.current[vue.indexP][si], soumise: true };
            // Avancer
            const nSQ = prob.sousQuestions.length;
            if (si + 1 < nSQ) {
              setVue({ ...vue, indexSQ: si + 1 });
            } else {
              // Prochain problème ou section C
              const nextP = vue.indexP + 1;
              if (nextP < examen.problemes.length) {
                setVue({ type: 'sectionB', indexP: nextP, indexSQ: 0 });
              } else {
                setVue({ type: 'sectionC', indexJ: 0, phase: 'prep' });
              }
            }
          }}
          boutonAbandon={boutonAbandon}
        />
        <Modal ouvert={modalAbandonOuvert} onFermer={() => setModalAbandonOuvert(false)} titre="Abandonner l'examen">
          <AbandonModal onConfirmer={abandonner} onAnnuler={() => setModalAbandonOuvert(false)} />
        </Modal>
      </>
    );
  }

  /* ─── Section C ─── */
  if (vue.type === 'sectionC') {
    return (
      <>
        <SectionCScreen
          indexJ={vue.indexJ}
          phase={vue.phase}
          question={examen.jury[vue.indexJ]}
          totalJ={examen.jury.length}
          onEval={(eval_) => {
            reponsesC.current[vue.indexJ] = eval_;
            // Suivante ou rapport
            const nextJ = vue.indexJ + 1;
            if (nextJ < examen.jury.length) {
              setVue({ type: 'sectionC', indexJ: nextJ, phase: 'prep' });
            } else {
              terminer(reponsesC.current);
            }
          }}
          onAvancerPhase={(phase) => setVue({ ...vue, phase })}
          boutonAbandon={boutonAbandon}
        />
        <Modal ouvert={modalAbandonOuvert} onFermer={() => setModalAbandonOuvert(false)} titre="Abandonner l'examen">
          <AbandonModal onConfirmer={abandonner} onAnnuler={() => setModalAbandonOuvert(false)} />
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
    const scoreGlobal = scoreA * 0.4 + scoreBMoy * 0.4 + scoreCMoy * 0.2;

    const resultatQcm = corrigerSession(examen.qcm, reponsesA.current);

    return (
      <RapportScreen
        examen={examen}
        scoreA={scoreA}
        scoreBArr={scoreBArr}
        scoreCArr={scoreCArr}
        scoreGlobal={scoreGlobal}
        resultatQcm={resultatQcm}
        reponsesA={reponsesA.current}
        reponsesB={reponsesB.current}
        evalsC={reponsesC.current as (EvalJury | null)[]}
        onRetour={() => setVue({ type: 'accueil' })}
      />
    );
  }

  return null;
}

/* ─── Écran Accueil ─── */

interface AccueilScreenProps {
  contenuDispo: boolean;
  tentativesExamen: Tentative[];
  onCommencer: () => void;
}

function AccueilScreen({ contenuDispo, tentativesExamen, onCommencer }: AccueilScreenProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold tracking-tight text-text">Examen blanc</h1>

      {!contenuDispo ? (
        <EmptyState
          titre="Contenu insuffisant pour composer un examen."
          indice="Ajoutez des QCM, problèmes et questions jury dans les modules pour débloquer l'examen blanc."
        />
      ) : (
        <div className="space-y-5">
          {/* Format */}
          <div className="rounded-lg border border-border bg-surface p-5 space-y-3">
            <h2 className="text-sm font-semibold text-text">Format de l'examen</h2>
            <ul className="space-y-2 text-sm text-text-muted">
              <li><span className="font-medium text-text">Section A :</span> 20 QCM chronométrés — 30 secondes par question</li>
              <li><span className="font-medium text-text">Section B :</span> 4 problèmes quantitatifs — sous-questions enchaînées</li>
              <li><span className="font-medium text-text">Section C :</span> 2 questions jury — préparation 30 s + réponse 2 min</li>
            </ul>
            <p className="text-xs text-text-muted">Périmètre : tout le contenu disponible. Durée estimée : 45 à 60 minutes.</p>
          </div>

          <Button variante="primaire" onClick={onCommencer}>
            Commencer l'examen
          </Button>

          {/* Historique */}
          {tentativesExamen.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-text">Historique</h2>
              <ul className="space-y-2">
                {tentativesExamen
                  .slice()
                  .reverse()
                  .slice(0, 5)
                  .map((t, i) => (
                    <li key={i} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface p-3 text-sm">
                      <span className="text-text-muted">{formatDate(t.date)}</span>
                      <span className="tabular-nums font-semibold text-text">{formatPct(t.reussite)}</span>
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

function AbandonModal({ onConfirmer, onAnnuler }: { onConfirmer: () => void; onAnnuler: () => void }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-text-muted leading-relaxed">
        L'examen sera interrompu et aucun résultat ne sera enregistré.
      </p>
      <div className="flex gap-2">
        <Button variante="secondaire" onClick={onConfirmer} className="text-err border-err/30 hover:border-err/60">
          Abandonner
        </Button>
        <Button variante="primaire" onClick={onAnnuler}>
          Continuer l'examen
        </Button>
      </div>
    </div>
  );
}

/* ─── Section A — QCM ─── */

interface SectionAScreenProps {
  examenQcm: ReturnType<typeof composerExamen>['qcm'];
  indexQ: number;
  reponses: (number | null)[];
  onRepondre: (idx: number, rep: number | null) => void;
  onSuivante: (idx: number) => void;
  boutonAbandon: React.ReactNode;
}

function SectionAScreen({ examenQcm, indexQ, onRepondre, onSuivante, boutonAbandon }: SectionAScreenProps) {
  const [choisi, setChoisi] = useState<number | null>(null);
  const [avance, setAvance] = useState(false);
  const [timerKey, setTimerKey] = useState(0);

  const q = examenQcm[indexQ];
  const total = examenQcm.length;

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
    onRepondre(indexQ, null);
    setAvance(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [avance, indexQ]);

  function suivante() {
    setChoisi(null);
    setAvance(false);
    setTimerKey(k => k + 1);
    onSuivante(indexQ);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-text">Section A — QCM</span>
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
        <Markdown texte={q.question.question} className="text-sm leading-relaxed text-text" />
        <div className="mt-1.5 flex gap-2">
          <Badge variante="neutre">{q.question.theme}</Badge>
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
              <Markdown texte={q.question.options[origIdx]} className="text-sm min-w-0 flex-1" />
            </button>
          </li>
        ))}
      </ul>

      {/* Correction déférée : aucun verdict affiché entre questions */}
      {avance ? (
        <div className="flex items-center gap-3">
          <p className="text-sm text-text-muted">Réponse enregistrée.</p>
          <Button variante="primaire" onClick={suivante}>
            {indexQ + 1 < (examenQcm.length) ? 'Question suivante' : 'Section B'}
          </Button>
        </div>
      ) : (
        <Button variante="primaire" onClick={valider} disabled={choisi === null}>
          Valider
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
}

function SectionBScreen({
  indexP, totalP, probleme, indexSQ, reponsesBP,
  onSaisieChange, onSoumettreSQ, boutonAbandon,
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
        <span className="text-sm font-semibold text-text">Section B — Problèmes</span>
        {boutonAbandon}
      </div>
      <span className="text-sm text-text-muted tabular-nums">B · {indexP + 1}/{totalP} — Q{indexSQ + 1}/{n}</span>
      <ProgressBar valeur={(indexP * n + indexSQ) / (totalP * n)} />

      <div className="rounded-lg border border-border bg-surface p-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">Mise en situation</p>
        <Markdown texte={probleme.contexte} className="text-sm leading-relaxed text-text" />
      </div>

      {/* Sous-questions soumises précédemment */}
      {reponsesBP.slice(0, indexSQ).map((r, si) => (
        <div key={si} className="rounded-lg border border-border bg-surface-2/40 p-4 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Q{si + 1}</p>
          <p className="text-sm text-text">{probleme.sousQuestions[si].intitule}</p>
          <p className="text-xs text-text-muted">Réponse : {r.saisie || '—'}</p>
        </div>
      ))}

      {/* Sous-question active */}
      <div className="rounded-lg border border-border bg-surface p-5 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          Question {indexSQ + 1}/{n}
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
              label={`Réponse Q${indexSQ + 1}`}
              autoFocus
            />
          </div>
          <Button variante="primaire" onClick={soumettre}>
            Valider
          </Button>
        </div>
        {/* Correction déférée : aucun verdict, aucun corrigé */}
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
}

function SectionCScreen({ indexJ, totalJ, phase, question, onEval, onAvancerPhase, boutonAbandon }: SectionCScreenProps) {
  const [timerKey] = useState(0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-text">Section C — Jury</span>
        {boutonAbandon}
      </div>
      <span className="text-sm text-text-muted tabular-nums">C · {indexJ + 1}/{totalJ}</span>
      <ProgressBar valeur={indexJ / totalJ} />

      <div className="rounded-lg border border-border bg-surface p-5 space-y-3">
        <p className="text-sm font-semibold text-text">{question.question}</p>
        <div className="flex gap-2">
          <Badge variante="neutre">{question.theme}</Badge>
        </div>
      </div>

      {phase === 'prep' && (
        <div className="space-y-4">
          {/* Pas de plan attendu ici : la préparation se fait à l'aveugle,
              comme devant un vrai jury. La grille n'apparaît qu'à l'auto-évaluation. */}
          <p className="text-sm text-text-muted">
            Organisez mentalement votre réponse. Le chrono de préparation tourne.
          </p>
          <div className="flex items-center gap-3">
            <p className="text-sm text-text-muted">Préparation :</p>
            <Timer
              key={`prep-${timerKey}`}
              secondes={CHRONO_JURY_PREP_S}
              enMarche
              onFin={() => onAvancerPhase('reponse')}
            />
          </div>
          <Button variante="primaire" onClick={() => onAvancerPhase('reponse')}>
            Commencer la réponse
          </Button>
        </div>
      )}

      {phase === 'reponse' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <p className="text-sm text-text-muted">Temps de réponse :</p>
            <Timer
              key={`rep-${timerKey}`}
              secondes={CHRONO_JURY_REP_S}
              enMarche
              onFin={() => onAvancerPhase('eval')}
            />
          </div>
          <Button variante="primaire" onClick={() => onAvancerPhase('eval')}>
            Terminer et évaluer
          </Button>
        </div>
      )}

      {phase === 'eval' && (
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-surface-2/40 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">Plan attendu</p>
            <ul className="space-y-1">
              {question.plan.map((p, i) => (
                <li key={i} className="text-sm text-text-muted">{i + 1}. {p}</li>
              ))}
            </ul>
          </div>
          {question.pointsAttendus.length > 0 && (
            <div className="rounded-lg border border-border bg-surface-2/40 p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">Points attendus</p>
              <ul className="space-y-1">
                {question.pointsAttendus.map((p, i) => (
                  <li key={i} className="text-sm text-text-muted">– {p}</li>
                ))}
              </ul>
            </div>
          )}
          <p className="text-sm font-medium text-text">Auto-évaluation subjective :</p>
          <div className="flex gap-2">
            <Button variante="secondaire" onClick={() => onEval('rate')} className="text-err border-err/30">
              Raté
            </Button>
            <Button variante="secondaire" onClick={() => onEval('moyen')} className="text-warn border-warn/30">
              Moyen
            </Button>
            <Button variante="secondaire" onClick={() => onEval('bon')} className="text-ok border-ok/30">
              Bon
            </Button>
          </div>
          <p className="text-xs text-text-muted">
            La réponse modèle sera visible dans le rapport final.
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
  resultatQcm: ReturnType<typeof corrigerSession>;
  reponsesA: (number | null)[];
  reponsesB: { saisie: string; soumise: boolean }[][];
  evalsC: (EvalJury | null)[];
  onRetour: () => void;
}

function RapportScreen({
  examen, scoreA, scoreBArr, scoreCArr, scoreGlobal,
  resultatQcm, reponsesA, reponsesB, evalsC, onRetour,
}: RapportScreenProps) {
  const scoreBMoy = scoreBArr.length > 0 ? scoreBArr.reduce((a, b) => a + b, 0) / scoreBArr.length : 0;
  const scoreCMoy = scoreCArr.length > 0 ? scoreCArr.reduce((a, b) => a + b, 0) / scoreCArr.length : 0;

  const evalLabel: Record<EvalJury, string> = { rate: 'Raté', moyen: 'Moyen', bon: 'Bon' };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold tracking-tight text-text">Rapport d'examen</h1>

      {/* Score global */}
      <div className="rounded-lg border border-border bg-surface p-5 space-y-4">
        <div>
          <p className="text-3xl font-bold tabular-nums text-text">{formatPct(scoreGlobal)}</p>
          <p className="text-sm text-text-muted mt-1">Score global pondéré</p>
        </div>
        <ProgressBar valeur={scoreGlobal} />
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-semibold tabular-nums text-text">{formatPct(scoreA)}</p>
            <p className="text-xs text-text-muted">Section A (40 %)</p>
          </div>
          <div>
            <p className="text-lg font-semibold tabular-nums text-text">{formatPct(scoreBMoy)}</p>
            <p className="text-xs text-text-muted">Section B (40 %)</p>
          </div>
          <div>
            <p className="text-lg font-semibold tabular-nums text-text">{formatPct(scoreCMoy)}</p>
            <p className="text-xs text-text-muted">Section C (20 %)</p>
          </div>
        </div>
      </div>

      {/* Ventilation par thème */}
      {Object.keys(resultatQcm.parTheme).length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-text">Résultats QCM par thème</h2>
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
        <h2 className="text-sm font-semibold text-text">Corrigé — Section A (QCM)</h2>
        <div className="space-y-2">
          {examen.qcm.map((sq, qi) => {
            const repDonnee = reponsesA[qi] ?? null;
            const bonneAffiche = sq.ordreOptions.indexOf(sq.question.bonneReponse);
            const correcte = repDonnee !== null && sq.ordreOptions[repDonnee] === sq.question.bonneReponse;
            return (
              <Collapsible
                key={qi}
                titre={`Q${qi + 1} — ${correcte ? 'Juste' : repDonnee === null ? 'Sans réponse' : 'Faux'} — ${sq.question.question.slice(0, 60)}${sq.question.question.length > 60 ? '…' : ''}`}
              >
                <div className="space-y-3">
                  <Markdown texte={sq.question.question} className="text-sm font-medium" />
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
                          <p className="font-medium">{LETTRES[displayIdx]}. {sq.question.options[origIdx]}</p>
                          <p className="mt-0.5 text-xs opacity-80">{sq.question.explications[origIdx]}</p>
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
        <h2 className="text-sm font-semibold text-text">Corrigé — Section B (Problèmes)</h2>
        <div className="space-y-2">
          {examen.problemes.map((p, pi) => {
            const prob = p.generateur.generate(p.seed, p.scenario);
            const score = scoreBArr[pi] ?? 0;
            return (
              <Collapsible
                key={pi}
                titre={`Problème ${pi + 1} — ${formatPct(score)} — ${p.generateur.titre}`}
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
                            Votre réponse : {r?.saisie || '—'}
                          </span>
                          <span className="text-text-muted">
                            Réponse exacte : {formatNombre(sq.reponse, 6)}{sq.unite ? ` ${sq.unite}` : ''}
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
        <h2 className="text-sm font-semibold text-text">Corrigé — Section C (Jury)</h2>
        <div className="space-y-2">
          {examen.jury.map((j, ji) => {
            const eval_ = evalsC[ji];
            return (
              <Collapsible
                key={ji}
                titre={`Jury ${ji + 1} — ${eval_ ? evalLabel[eval_] : '—'} — ${j.question.slice(0, 60)}${j.question.length > 60 ? '…' : ''}`}
              >
                <QuestionJuryCorrige question={j} />
              </Collapsible>
            );
          })}
        </div>
      </div>

      <Button variante="secondaire" onClick={onRetour}>
        Retour à l'accueil
      </Button>
    </div>
  );
}

/* ─── Corrigé jury ─── */

function QuestionJuryCorrige({ question }: { question: JuryQuestion }) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Plan</p>
        <ul className="list-disc pl-4 space-y-1">
          {question.plan.map((p, i) => (
            <li key={i} className="text-sm text-text">{p}</li>
          ))}
        </ul>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Points attendus</p>
        <ul className="list-disc pl-4 space-y-1">
          {question.pointsAttendus.map((p, i) => (
            <li key={i} className="text-sm text-text">{p}</li>
          ))}
        </ul>
      </div>
      {question.bonus && question.bonus.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Bonus</p>
          <ul className="list-disc pl-4 space-y-1">
            {question.bonus.map((b, i) => (
              <li key={i} className="text-sm text-text-muted">{b}</li>
            ))}
          </ul>
        </div>
      )}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Réponse modèle</p>
        <Markdown texte={question.reponseModele} className="text-sm leading-relaxed text-text" />
      </div>
    </div>
  );
}
