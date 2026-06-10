import { useState } from 'react';
import { useEtat } from '../../engine/useEtat';
import { Button } from '../ui/Button';

export interface QuestionCheckpoint {
  q: string;
  options: string[];
  bonne: number;
  explication: string;
}

export interface CheckpointProps {
  id: string;
  questions: QuestionCheckpoint[];
}

type EtatQuestion = { repondu: false } | { repondu: true; choix: number };

function useQuestions(questions: QuestionCheckpoint[]) {
  return useState<EtatQuestion[]>(() => questions.map(() => ({ repondu: false })));
}

function EtatValide({ onRefaire }: { onRefaire: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 py-6 text-center">
      <div className="inline-flex items-center justify-center rounded-full border border-ok/30 bg-ok/10 px-4 py-1.5">
        <span className="text-sm font-medium text-ok">Checkpoint validé</span>
      </div>
      <p className="text-sm text-text-muted">Toutes les questions ont été réussies.</p>
      <button
        type="button"
        onClick={onRefaire}
        className="text-xs text-text-muted underline-offset-2 hover:text-text hover:underline"
      >
        Refaire
      </button>
    </div>
  );
}

export function Checkpoint({ id, questions }: CheckpointProps) {
  const { etat, modifier } = useEtat();
  const dejaValide = Boolean(etat.checkpointsReussis[id]);

  const [etatsQuestions, setEtatsQuestions] = useQuestions(questions);
  const [questionCourante, setQuestionCourante] = useState(0);
  const [afficherValide, setAfficherValide] = useState(dejaValide);

  function reinitialiser() {
    setEtatsQuestions(questions.map(() => ({ repondu: false })));
    setQuestionCourante(0);
    setAfficherValide(false);
  }

  function repondre(choix: number) {
    setEtatsQuestions(prev => {
      const suivant = [...prev];
      suivant[questionCourante] = { repondu: true, choix };
      return suivant;
    });
  }

  function questionSuivante() {
    const prochaine = questionCourante + 1;
    if (prochaine >= questions.length) {
      // Vérifier si tout est correct
      const toutJuste = etatsQuestions.every((eq, i) => {
        if (!eq.repondu) return false;
        return eq.choix === questions[i].bonne;
      });
      if (toutJuste) {
        modifier(e => { e.checkpointsReussis[id] = true; });
        setAfficherValide(true);
      } else {
        // Réessayer
        reinitialiser();
      }
    } else {
      setQuestionCourante(prochaine);
    }
  }

  if (afficherValide) {
    return (
      <div className="my-6 rounded-lg border border-ok/30 bg-ok/5">
        <div className="border-b border-ok/20 px-4 py-2.5">
          <p className="text-xs font-semibold uppercase tracking-widest text-ok">
            Checkpoint — vérifiez votre compréhension
          </p>
        </div>
        <EtatValide onRefaire={reinitialiser} />
      </div>
    );
  }

  const etatQ = etatsQuestions[questionCourante];
  const question = questions[questionCourante];
  const aRepondu = etatQ.repondu;
  const choix = aRepondu ? etatQ.choix : -1;
  const bonneReponse = question.bonne;
  const estJuste = aRepondu && choix === bonneReponse;
  const estLaDerniere = questionCourante === questions.length - 1;

  // Vérifier si tout est juste pour le bouton Réessayer
  const toutJustePourSuivant = aRepondu && (() => {
    const etatsMaj = etatsQuestions.map((eq, i) =>
      i === questionCourante ? { repondu: true as const, choix } : eq
    );
    return etatsMaj.every((eq, i) => eq.repondu && eq.choix === questions[i].bonne);
  })();

  function labelBoutonSuivant() {
    if (!estLaDerniere) return 'Question suivante';
    if (toutJustePourSuivant) return 'Terminer';
    return 'Réessayer';
  }

  return (
    <div className="my-6 rounded-lg border border-border bg-surface">
      {/* Titre */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
          Checkpoint — vérifiez votre compréhension
        </p>
        <span className="text-xs tabular-nums text-text-muted">
          {questionCourante + 1} / {questions.length}
        </span>
      </div>

      {/* Question */}
      <div className="px-4 py-4">
        <p className="mb-4 text-sm font-medium text-text">{question.q}</p>

        {/* Options */}
        <div className="flex flex-col gap-2">
          {question.options.map((opt, i) => {
            let variante = 'bg-surface-2 border-border text-text hover:border-text-muted/40 hover:bg-surface-2/70';
            if (aRepondu) {
              if (i === bonneReponse) {
                variante = 'bg-ok/10 border-ok/40 text-ok cursor-default';
              } else if (i === choix && !estJuste) {
                variante = 'bg-err/10 border-err/40 text-err cursor-default';
              } else {
                variante = 'border-border bg-surface-2/50 text-text-muted cursor-default opacity-60';
              }
            }
            return (
              <button
                key={i}
                type="button"
                disabled={aRepondu}
                onClick={() => repondre(i)}
                className={`rounded-md border px-3.5 py-2.5 text-left text-sm transition-colors duration-150 ${variante}`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {/* Explication */}
        {aRepondu && (
          <div className={`mt-4 rounded-md px-3.5 py-3 text-sm leading-relaxed ${estJuste ? 'bg-ok/8 text-ok' : 'bg-err/8 text-err'}`}>
            <span className="font-semibold">{estJuste ? 'Correct. ' : 'Incorrect. '}</span>
            {question.explication}
          </div>
        )}

        {/* Bouton suivant */}
        {aRepondu && (
          <div className="mt-4 flex justify-end">
            <Button variante="secondaire" taille="sm" onClick={questionSuivante}>
              {labelBoutonSuivant()}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
