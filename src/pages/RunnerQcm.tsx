import { useState, useRef, useCallback } from 'react';
import { useTitre } from './useTitre';
import { touteLaBanqueQcm } from '../engine/registry';
import { composerSession, corrigerSession } from '../engine/quiz';
import type { QcmSessionQuestion, ResultatQcm } from '../engine/quiz';
import { newSeed } from '../engine/rng';
import { useEtat } from '../engine/useEtat';
import { toucherStreak } from '../engine/storage';
import type { Tentative } from '../engine/storage';
import { aujourdHuiLocal } from '../engine/srs';
import {
  SelecteurPerimetre,
  perimetre0,
  niveauAutorise,
} from '../components/entrainement/SelecteurPerimetre';
import type { PerimetreSelection } from '../components/entrainement/SelecteurPerimetre';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Collapsible } from '../components/ui/Collapsible';
import { Timer } from '../components/ui/Timer';
import { Markdown } from '../components/Markdown';

/* ─── helpers ─── */

const LETTRES = ['A', 'B', 'C', 'D'] as const;
const NB_OPTIONS = [10, 20, 40] as const;
const CHRONOS_S = [0, 30, 60] as const; // 0 = aucun

function aQcm(m: { qcm: unknown[] }): boolean {
  return m.qcm.length > 0;
}

function formatPct(n: number, total: number): string {
  if (total === 0) return '0 %';
  return `${Math.round((n / total) * 100)} %`;
}

function formatMs(ms: number): string {
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s} s`;
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m} min ${sec.toString().padStart(2, '0')} s`;
}

/* ─── types de vue ─── */

type VueConfig = { type: 'config' };
type VueSession = { type: 'session'; session: QcmSessionQuestion[]; chronoS: number };
type VueResultats = { type: 'resultats'; session: QcmSessionQuestion[]; reponses: (number | null)[]; tempsMs: number[]; resultat: ResultatQcm };
type Vue = VueConfig | VueSession | VueResultats;

/* ─── Écran config ─── */

interface ConfigProps {
  selection: PerimetreSelection;
  onSelectionChange: (s: PerimetreSelection) => void;
  nb: number;
  onNbChange: (n: number) => void;
  chronoS: number;
  onChronoChange: (c: number) => void;
  onCommencer: () => void;
}

function ConfigScreen({ selection, onSelectionChange, nb, onNbChange, chronoS, onChronoChange, onCommencer }: ConfigProps) {
  const banque = touteLaBanqueQcm();
  const banqueFiltree = banque.filter(q => {
    const modOk = selection.modulesChoisis.length === 0 || selection.modulesChoisis.includes(q.moduleId);
    const niveauOk = niveauAutorise(selection.niveaux, q.difficulte);
    return modOk && niveauOk;
  });
  const dispo = banqueFiltree.length;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold tracking-tight text-text">QCM</h1>

      <SelecteurPerimetre aContenu={aQcm} selection={selection} onChange={onSelectionChange} />

      {/* Nombre de questions */}
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-text-muted">Nombre de questions</p>
        <div className="flex gap-2">
          {NB_OPTIONS.map(n => (
            <button
              key={n}
              type="button"
              onClick={() => onNbChange(n)}
              aria-pressed={nb === n}
              className={`rounded-md border px-4 py-1.5 text-sm font-medium transition-colors duration-150 ${
                nb === n
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-border bg-surface-2 text-text-muted hover:border-accent/40 hover:text-text'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Chrono par question */}
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-text-muted">Chrono par question</p>
        <div className="flex gap-2">
          {CHRONOS_S.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => onChronoChange(c)}
              aria-pressed={chronoS === c}
              className={`rounded-md border px-4 py-1.5 text-sm font-medium transition-colors duration-150 ${
                chronoS === c
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-border bg-surface-2 text-text-muted hover:border-accent/40 hover:text-text'
              }`}
            >
              {c === 0 ? 'Aucun' : `${c} s`}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variante="primaire" onClick={onCommencer} disabled={dispo === 0}>
          Commencer
        </Button>
        <span className="text-sm text-text-muted">
          {dispo === 0 ? 'Aucune question disponible' : `${dispo} question${dispo > 1 ? 's' : ''} disponible${dispo > 1 ? 's' : ''}`}
        </span>
      </div>
    </div>
  );
}

/* ─── Écran session ─── */

interface SessionProps {
  session: QcmSessionQuestion[];
  chronoS: number;
  onFin: (reponses: (number | null)[], tempsMs: number[]) => void;
}

function SessionScreen({ session, chronoS, onFin }: SessionProps) {
  const [indexQ, setIndexQ] = useState(0);
  const [reponses, setReponses] = useState<(number | null)[]>(Array(session.length).fill(null));
  const [choisi, setChoisi] = useState<number | null>(null); // index AFFICHÉ (dans ordreOptions)
  const [revele, setRevele] = useState(false);
  const [tempsExpire, setTempsExpire] = useState(false);
  const [tempsMs, setTempsMs] = useState<number[]>([]);
  const [timerKey, setTimerKey] = useState(0);
  const debutRef = useRef<number>(Date.now());

  const q = session[indexQ];
  const total = session.length;

  function enregistrerReponse(reponseAffichee: number | null) {
    const elapsed = Date.now() - debutRef.current;
    const nouvellesReponses = [...reponses];
    nouvellesReponses[indexQ] = reponseAffichee;
    setReponses(nouvellesReponses);
    setTempsMs(prev => [...prev, elapsed]);
    setRevele(true);
  }

  function choisir(indexAffiche: number) {
    if (revele) return;
    setChoisi(indexAffiche);
    enregistrerReponse(indexAffiche);
  }

  const handleExpiration = useCallback(() => {
    if (revele) return;
    setTempsExpire(true);
    enregistrerReponse(null);
  }, [revele, indexQ]);

  function suivante() {
    if (indexQ + 1 >= total) {
      const repFinal = [...reponses];
      if (!revele) repFinal[indexQ] = null;
      onFin(repFinal, tempsMs);
      return;
    }
    setIndexQ(i => i + 1);
    setChoisi(null);
    setRevele(false);
    setTempsExpire(false);
    setTimerKey(k => k + 1);
    debutRef.current = Date.now();
  }

  // Trouver la bonne réponse dans l'ordre affiché
  const bonneReponseAffichee = q.ordreOptions.indexOf(q.question.bonneReponse);

  function styleOption(indexAffiche: number): string {
    if (!revele) {
      return 'border-border bg-surface-2 text-text hover:border-accent/40 hover:bg-surface-2/70';
    }
    if (indexAffiche === bonneReponseAffichee) {
      return 'border-ok/40 bg-ok/10 text-ok';
    }
    if (indexAffiche === choisi && choisi !== bonneReponseAffichee) {
      return 'border-err/40 bg-err/10 text-err';
    }
    return 'border-border bg-surface-2/50 text-text-muted';
  }

  const estDerniere = indexQ + 1 >= total;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-text-muted tabular-nums">
          Question {indexQ + 1}/{total}
        </span>
        {chronoS > 0 && !revele && (
          <Timer
            key={timerKey}
            secondes={chronoS}
            enMarche={!revele}
            onFin={handleExpiration}
          />
        )}
      </div>

      <ProgressBar valeur={(indexQ + (revele ? 1 : 0)) / total} />

      {/* Texte de la question */}
      <div className="rounded-lg border border-border bg-surface p-4">
        <Markdown texte={q.question.question} className="text-sm leading-relaxed text-text" />
        <div className="mt-1.5 flex gap-2">
          <Badge variante="neutre">{q.question.theme}</Badge>
          <Badge variante={q.question.difficulte === 1 ? 'n1' : q.question.difficulte === 2 ? 'n2' : q.question.difficulte === 3 ? 'n3' : 'n4'}>
            N{q.question.difficulte}
          </Badge>
        </div>
      </div>

      {/* Options */}
      <ul className="space-y-2">
        {q.ordreOptions.map((origIdx, displayIdx) => (
          <li key={displayIdx}>
            <button
              type="button"
              disabled={revele}
              onClick={() => choisir(displayIdx)}
              className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors duration-150 ${styleOption(displayIdx)} ${revele ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <span className="shrink-0 font-semibold">{LETTRES[displayIdx]}.</span>
              <div className="min-w-0 flex-1 space-y-1">
                <Markdown texte={q.question.options[origIdx]} className="text-sm" />
                {revele && (
                  <p className="text-xs leading-relaxed text-text-muted">
                    {q.question.explications[origIdx]}
                  </p>
                )}
              </div>
              {revele && displayIdx === bonneReponseAffichee && (
                <Badge variante="ok" className="shrink-0">Juste</Badge>
              )}
              {revele && displayIdx === choisi && choisi !== bonneReponseAffichee && (
                <Badge variante="err" className="shrink-0">Faux</Badge>
              )}
            </button>
          </li>
        ))}
      </ul>

      {tempsExpire && (
        <p className="text-sm font-medium text-warn">Temps écoulé — la question est comptée fausse.</p>
      )}

      {revele && (
        <Button variante="primaire" onClick={suivante}>
          {estDerniere ? 'Voir les résultats' : 'Question suivante'}
        </Button>
      )}
    </div>
  );
}

/* ─── Écran résultats ─── */

interface ResultatsProps {
  session: QcmSessionQuestion[];
  reponses: (number | null)[];
  tempsMs: number[];
  resultat: ResultatQcm;
  onRefaire: () => void;
}

function ResultatsScreen({ session, tempsMs, resultat, onRefaire }: ResultatsProps) {
  const { bonnes, total, parTheme, details } = resultat;
  const pct = total > 0 ? Math.round((bonnes / total) * 100) : 0;
  const tempsMoyen = tempsMs.length > 0 ? Math.round(tempsMs.reduce((a, b) => a + b, 0) / tempsMs.length) : 0;
  const questionsEchouees = details.filter(d => !d.correcte);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tabular-nums text-text">
          {bonnes}/{total}
        </h2>
        <p className="text-lg text-text-muted">{pct} %</p>
        {tempsMoyen > 0 && (
          <p className="mt-1 text-sm text-text-muted">
            Temps moyen par question : {formatMs(tempsMoyen)}
          </p>
        )}
      </div>

      {/* Ventilation par thème */}
      {Object.keys(parTheme).length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-text">Par thème</h3>
          <ul className="space-y-3">
            {Object.entries(parTheme).map(([theme, { bonnes: b, total: t }]) => (
              <li key={theme} className="space-y-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm text-text">{theme}</span>
                  <span className="text-xs tabular-nums text-text-muted">{b}/{t} — {formatPct(b, t)}</span>
                </div>
                <ProgressBar valeur={t > 0 ? b / t : 0} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Questions échouées */}
      {questionsEchouees.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-text">
            Questions manquées ({questionsEchouees.length})
          </h3>
          <ul className="space-y-2">
            {questionsEchouees.map(d => {
              const sq = session.find(x => x.question.id === d.questionId)!;
              const repDonneeIdx = d.reponseDonnee; // index affiché
              const repDonneeOrig = repDonneeIdx !== null ? sq.ordreOptions[repDonneeIdx] : null;
              const bonneOrig = sq.question.bonneReponse;
              const bonneAffiche = sq.ordreOptions.indexOf(bonneOrig);

              return (
                <li key={d.questionId}>
                  <Collapsible titre={sq.question.question.slice(0, 80) + (sq.question.question.length > 80 ? '…' : '')}>
                    <div className="space-y-3">
                      <Markdown texte={sq.question.question} className="text-sm font-medium" />
                      <ul className="space-y-2">
                        {sq.ordreOptions.map((origIdx, displayIdx) => {
                          const estBonne = displayIdx === bonneAffiche;
                          const estChoisie = displayIdx === repDonneeIdx && repDonneeOrig !== bonneOrig;
                          return (
                            <li
                              key={displayIdx}
                              className={`rounded-md border p-2 text-sm ${
                                estBonne
                                  ? 'border-ok/30 bg-ok/5 text-ok'
                                  : estChoisie
                                  ? 'border-err/30 bg-err/5 text-err'
                                  : 'border-border text-text-muted'
                              }`}
                            >
                              <p className="font-medium">{LETTRES[displayIdx]}. {sq.question.options[origIdx]}</p>
                              <p className="mt-0.5 text-xs opacity-80">{sq.question.explications[origIdx]}</p>
                            </li>
                          );
                        })}
                      </ul>
                      {repDonneeIdx === null && (
                        <p className="text-xs text-text-muted">Temps écoulé — sans réponse.</p>
                      )}
                    </div>
                  </Collapsible>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <Button variante="primaire" onClick={onRefaire}>
        Refaire une session
      </Button>
    </div>
  );
}

/* ─── Page principale ─── */

export default function RunnerQcm() {
  useTitre('QCM');

  const { modifier } = useEtat();
  const [selection, setSelection] = useState<PerimetreSelection>(perimetre0);
  const [nb, setNb] = useState<number>(10);
  const [chronoS, setChronoS] = useState<number>(0);
  const [vue, setVue] = useState<Vue>({ type: 'config' });

  function commencer() {
    const banque = touteLaBanqueQcm();
    const banqueFiltree = banque.filter(q => {
      const modOk = selection.modulesChoisis.length === 0 || selection.modulesChoisis.includes(q.moduleId);
      const niveauOk = niveauAutorise(selection.niveaux, q.difficulte);
      return modOk && niveauOk;
    });
    if (banqueFiltree.length === 0) return;
    const moduleIds = selection.modulesChoisis.length > 0 ? selection.modulesChoisis : undefined;
    const difficultes = selection.niveaux.length > 0 ? selection.niveaux : undefined;
    const session = composerSession(banque, {
      nb,
      moduleIds,
      difficultes,
      seed: newSeed(),
    });
    modifier(e => {
      e.reprise = { chemin: '/entrainement/qcm', libelle: 'Entraînement — QCM' };
    });
    setVue({ type: 'session', session, chronoS });
  }

  function handleFinSession(reponses: (number | null)[], tempsMs: number[]) {
    if (vue.type !== 'session') return;
    const { session } = vue;
    const resultat = corrigerSession(session, reponses);

    // Enregistrer toutes les tentatives + streak en un seul modifier
    modifier(e => {
      const aujourd = aujourdHuiLocal();
      for (const detail of resultat.details) {
        const sq = session.find(x => x.question.id === detail.questionId)!;
        const tentative: Tentative = {
          type: 'qcm',
          refId: sq.question.id,
          moduleId: sq.question.moduleId,
          difficulte: sq.question.difficulte,
          reussite: detail.correcte ? 1 : 0,
          date: aujourd,
        };
        e.tentatives.push(tentative);
      }
      toucherStreak(e, aujourdHuiLocal());
    });

    setVue({ type: 'resultats', session, reponses, tempsMs, resultat });
  }

  function refaire() {
    setVue({ type: 'config' });
  }

  /* ─── rendu ─── */

  if (vue.type === 'config') {
    return (
      <ConfigScreen
        selection={selection}
        onSelectionChange={setSelection}
        nb={nb}
        onNbChange={setNb}
        chronoS={chronoS}
        onChronoChange={setChronoS}
        onCommencer={commencer}
      />
    );
  }

  if (vue.type === 'session') {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setVue({ type: 'config' })}
          className="text-sm text-text-muted hover:text-text transition-colors duration-150"
        >
          ← Retour
          {/* Abandon en cours de session : aucune tentative n'est enregistrée (écriture atomique en fin de session). */}
        </button>
        <SessionScreen
          session={vue.session}
          chronoS={vue.chronoS}
          onFin={handleFinSession}
        />
      </div>
    );
  }

  // resultats
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={refaire}
          className="text-sm text-text-muted hover:text-text transition-colors duration-150"
        >
          ← Retour
        </button>
        <h1 className="text-lg font-semibold text-text">Résultats</h1>
      </div>
      <ResultatsScreen
        session={vue.session}
        reponses={vue.reponses}
        tempsMs={vue.tempsMs}
        resultat={vue.resultat}
        onRefaire={refaire}
      />
    </div>
  );
}
