import { useEffect, useRef, useState } from 'react';
import type { ProblemGenerator } from '../../engine/types';
import { mulberry32, newSeed, randInt } from '../../engine/rng';
import { parseSaisie, reponseCorrecte, formatNombre } from '../../engine/answers';
import { aujourdHuiLocal } from '../../engine/srs';
import { toucherStreak } from '../../engine/storage';
import { useEtat } from '../../engine/useEtat';
import { Markdown } from '../Markdown.tsx';
import { Callout } from '../cours/Callout';
import { NumericInput } from '../ui/NumericInput';
import { Button } from '../ui/Button';
import { Etapes } from './Etapes';

interface ProblemeCardProps {
  generateur: ProblemGenerator;
  onSuivant?: () => void;
  onRetour: () => void;
}

interface SQEtat {
  saisie: string;
  verdict: 'juste' | 'faux' | null;
  soumise: boolean;
}

export function ProblemeCard({ generateur, onSuivant, onRetour }: ProblemeCardProps) {
  const { modifier } = useEtat();
  const [seed, setSeed] = useState(() => newSeed());
  const [tentativeEnregistree, setTentativeEnregistree] = useState(false);
  const nextSqRef = useRef<HTMLDivElement>(null);

  // Derive scenario and problem from seed (deterministic)
  const rng = mulberry32(seed);
  const scenario = randInt(rng, 0, generateur.scenarios.length - 1);
  const probleme = generateur.generate(seed, scenario);
  const n = probleme.sousQuestions.length;

  const [sqEtats, setSqEtats] = useState<SQEtat[]>(() =>
    Array.from({ length: n }, () => ({ saisie: '', verdict: null, soumise: false })),
  );
  // Current visible index = how many have been submitted
  const indexVisible = sqEtats.filter(s => s.soumise).length;
  const fini = indexVisible >= n;

  useEffect(() => {
    // Reset when generateur changes
    setSeed(newSeed());
    setTentativeEnregistree(false);
  }, [generateur.id]);

  useEffect(() => {
    // Reset sqEtats when seed or problem length changes
    setSqEtats(Array.from({ length: n }, () => ({ saisie: '', verdict: null, soumise: false })));
    setTentativeEnregistree(false);
  }, [seed, n]);

  // When a new sous-question becomes visible, scroll to it
  useEffect(() => {
    if (indexVisible > 0 && indexVisible < n) {
      setTimeout(() => nextSqRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
    }
  }, [indexVisible, n]);

  // Record tentative when problem is finished
  useEffect(() => {
    if (fini && !tentativeEnregistree) {
      const bonnes = sqEtats.filter(s => s.verdict === 'juste').length;
      const aujourd = aujourdHuiLocal();
      modifier(etat => {
        etat.tentatives.push({
          date: aujourd,
          type: 'probleme',
          refId: generateur.id,
          moduleId: generateur.moduleId,
          difficulte: generateur.difficulte,
          reussite: n > 0 ? bonnes / n : 0,
        });
        toucherStreak(etat, aujourd);
        etat.reprise = {
          chemin: '/entrainement/exercices',
          libelle: `Entraînement — ${generateur.titre}`,
        };
      });
      setTentativeEnregistree(true);
    }
  }, [fini, tentativeEnregistree, sqEtats, generateur, modifier, n]);

  function soumettreSQ(idx: number) {
    const sq = probleme.sousQuestions[idx];
    const saisie = sqEtats[idx].saisie;
    const valeur = parseSaisie(saisie);
    const ok =
      valeur !== null &&
      reponseCorrecte(valeur, sq.reponse, sq.tolerance, sq.toleranceMode ?? 'relatif');
    setSqEtats(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], verdict: ok ? 'juste' : 'faux', soumise: true };
      return next;
    });
  }

  function rejouer() {
    setSeed(newSeed());
    setTentativeEnregistree(false);
  }

  const bonnes = sqEtats.filter(s => s.verdict === 'juste').length;

  return (
    <div className="space-y-4">
      {/* Mise en situation */}
      <div className="rounded-lg border border-border bg-surface p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
          Mise en situation
        </p>
        <Markdown texte={probleme.contexte} className="text-sm leading-relaxed text-text" />
      </div>

      {/* Sous-questions */}
      {probleme.sousQuestions.map((sq, idx) => {
        const estVisible = idx <= indexVisible;
        const estActuelle = idx === indexVisible && !fini;
        const etatSq = sqEtats[idx];
        if (!estVisible) return null;

        return (
          <div
            key={idx}
            ref={estActuelle && idx > 0 ? nextSqRef : undefined}
            className="rounded-lg border border-border bg-surface p-5 space-y-3"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Question {idx + 1}/{n}
            </p>
            {sq.intitule && (
              <p className="text-sm font-semibold text-text">{sq.intitule}</p>
            )}
            <Markdown texte={sq.enonce} className="text-sm leading-relaxed text-text" />

            {/* Saisie */}
            <div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <NumericInput
                    value={etatSq.saisie}
                    onChange={v =>
                      setSqEtats(prev => {
                        const next = [...prev];
                        next[idx] = { ...next[idx], saisie: v };
                        return next;
                      })
                    }
                    onSubmit={() => !etatSq.soumise && soumettreSQ(idx)}
                    unite={sq.unite}
                    disabled={etatSq.soumise}
                    verdict={etatSq.verdict}
                    placeholder="0"
                    autoFocus={estActuelle}
                    label={`Réponse question ${idx + 1}`}
                  />
                </div>
                {!etatSq.soumise && (
                  <Button variante="primaire" onClick={() => soumettreSQ(idx)}>
                    Valider
                  </Button>
                )}
              </div>
              {etatSq.soumise && (
                <p
                  className={`mt-2 text-sm font-medium ${etatSq.verdict === 'juste' ? 'text-ok' : 'text-err'}`}
                  role="status"
                >
                  {etatSq.verdict === 'juste' ? 'Bonne réponse !' : 'Réponse incorrecte.'}
                </p>
              )}
            </div>

            {/* Corrigé de la sous-question */}
            {etatSq.soumise && (
              <div className="space-y-3 pt-1">
                <div className="rounded-md border border-border bg-surface-2/60 px-4 py-2.5">
                  <p className="text-xs font-medium text-text-muted">Réponse exacte</p>
                  <p className="mt-0.5 font-semibold text-text">
                    {formatNombre(sq.reponse, 6)}
                    {sq.unite ? ` ${sq.unite}` : ''}
                  </p>
                </div>
                {sq.etapes.length > 0 && <Etapes etapes={sq.etapes} />}
                {sq.pieges && sq.pieges.length > 0 && (
                  <Callout type="piege">
                    <ul className="space-y-1.5">
                      {sq.pieges.map((p, i) => (
                        <li key={i} className="text-sm leading-relaxed">
                          {p}
                        </li>
                      ))}
                    </ul>
                  </Callout>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Score final */}
      {fini && (
        <div className="rounded-lg border border-border bg-surface p-5 space-y-3">
          <p className="text-sm font-semibold text-text">
            Score : {bonnes}/{n}
          </p>
          <ul className="space-y-1.5">
            {probleme.sousQuestions.map((sq, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <span
                  className={`mt-0.5 shrink-0 font-semibold ${sqEtats[idx].verdict === 'juste' ? 'text-ok' : 'text-err'}`}
                  aria-label={sqEtats[idx].verdict === 'juste' ? 'Correct' : 'Incorrect'}
                >
                  {sqEtats[idx].verdict === 'juste' ? '✓' : '✗'}
                </span>
                <span className="text-text-muted">
                  Q{idx + 1}{sq.intitule ? ` — ${sq.intitule}` : ''}
                </span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-2 pt-1">
            <Button variante="secondaire" onClick={rejouer}>
              Rejouer (autres valeurs)
            </Button>
            {onSuivant && (
              <Button variante="primaire" onClick={onSuivant}>
                Suivant
              </Button>
            )}
            <Button variante="fantome" onClick={onRetour}>
              Retour à la liste
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
