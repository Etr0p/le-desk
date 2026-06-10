import { useEffect, useRef, useState } from 'react';
import type { ExerciseGenerator } from '../../engine/types';
import { newSeed } from '../../engine/rng';
import { parseSaisie, reponseCorrecte, formatNombre } from '../../engine/answers';
import { aujourdHuiLocal } from '../../engine/srs';
import { toucherStreak } from '../../engine/storage';
import { useEtat } from '../../engine/useEtat';
import { useLangue } from '../../engine/useLangue';
import { Markdown } from '../Markdown';
import { Callout } from '../cours/Callout';
import { NumericInput } from '../ui/NumericInput';
import { Button } from '../ui/Button';
import { Etapes } from './Etapes';

interface ExerciceCardProps {
  generateur: ExerciseGenerator;
  /** Appelé quand l'utilisateur clique « Suivant ». */
  onSuivant?: () => void;
  /** Appelé quand l'utilisateur clique « Retour à la liste ». */
  onRetour: () => void;
  /** Seed initial (optionnel — généré si absent). */
  seedInitial?: number;
}

type Phase = 'saisie' | 'corrige';

export function ExerciceCard({ generateur, onSuivant, onRetour, seedInitial }: ExerciceCardProps) {
  const { modifier } = useEtat();
  const { t, langue } = useLangue();
  const [seed, setSeed] = useState(() => seedInitial ?? newSeed());
  const [saisie, setSaisie] = useState('');
  const [phase, setPhase] = useState<Phase>('saisie');
  const [reussite, setReussite] = useState<boolean | null>(null);
  const corrigeRef = useRef<HTMLDivElement>(null);

  // Regénérer si le générateur change
  useEffect(() => {
    setSeed(seedInitial ?? newSeed());
    setSaisie('');
    setPhase('saisie');
    setReussite(null);
  }, [generateur.id, seedInitial]);

  // Passer la langue au générateur pour que les énoncés soient dans la bonne langue
  const exercice = generateur.generate(seed, langue);

  function soumettre() {
    if (phase === 'corrige') return;
    const valeur = parseSaisie(saisie);
    const ok = valeur !== null && reponseCorrecte(
      valeur,
      exercice.reponse,
      exercice.tolerance,
      exercice.toleranceMode ?? 'relatif',
    );
    setReussite(ok);
    setPhase('corrige');

    // Enregistrer la tentative
    const aujourd = aujourdHuiLocal();
    modifier(etat => {
      etat.tentatives.push({
        date: aujourd,
        type: 'exercice',
        refId: generateur.id,
        moduleId: generateur.moduleId,
        difficulte: generateur.difficulte,
        reussite: ok ? 1 : 0,
      });
      toucherStreak(etat, aujourd);
      etat.reprise = {
        chemin: '/entrainement/exercices',
        libelle: `Entraînement — ${generateur.titre}`,
      };
    });

    // Scroll vers le corrigé
    setTimeout(() => corrigeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }

  function rejouer() {
    setSeed(newSeed());
    setSaisie('');
    setPhase('saisie');
    setReussite(null);
  }

  const verdict = phase === 'corrige' ? (reussite ? 'juste' : 'faux') : null;

  return (
    <div className="space-y-4">
      {/* Énoncé */}
      <div className="rounded-lg border border-border bg-surface p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
          {t('exo.enonce')}
        </p>
        <Markdown texte={exercice.enonce} className="text-sm leading-relaxed text-text" />
      </div>

      {/* Saisie */}
      <div>
        <p className="mb-2 text-sm font-medium text-text">{t('commun.votreReponse')}</p>
        <div className="flex gap-2">
          <div className="flex-1">
            <NumericInput
              value={saisie}
              onChange={setSaisie}
              onSubmit={soumettre}
              unite={exercice.unite}
              disabled={phase === 'corrige'}
              verdict={verdict}
              placeholder="0"
              autoFocus
              label={t('commun.reponseNumerique')}
            />
          </div>
          {phase === 'saisie' && (
            <Button onClick={soumettre} variante="primaire">
              {t('commun.valider')}
            </Button>
          )}
        </div>
        {phase === 'corrige' && (
          <p
            className={`mt-2 text-sm font-medium ${reussite ? 'text-ok' : 'text-err'}`}
            role="status"
          >
            {reussite ? t('commun.bonneReponse') : t('commun.reponseIncorrecte')}
          </p>
        )}
      </div>

      {/* Corrigé */}
      {phase === 'corrige' && (
        <div ref={corrigeRef} className="space-y-4">
          {/* Réponse exacte */}
          <div className="rounded-lg border border-border bg-surface p-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-text-muted">
              {t('commun.reponseExacte')}
            </p>
            <p className="text-base font-semibold text-text">
              {formatNombre(exercice.reponse, 6)}
              {exercice.unite ? ` ${exercice.unite}` : ''}
            </p>
          </div>

          {/* Étapes */}
          {exercice.etapes.length > 0 && (
            <div>
              <p className="mb-3 text-sm font-semibold text-text">{t('exo.corrigePasAPas')}</p>
              <Etapes etapes={exercice.etapes} />
            </div>
          )}

          {/* Pièges */}
          {exercice.pieges && exercice.pieges.length > 0 && (
            <Callout type="piege">
              <ul className="space-y-1.5">
                {exercice.pieges.map((p, i) => (
                  <li key={i} className="text-sm leading-relaxed">
                    {p}
                  </li>
                ))}
              </ul>
            </Callout>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <Button variante="secondaire" onClick={rejouer}>
              {t('exo.rejouer')}
            </Button>
            {onSuivant && (
              <Button variante="primaire" onClick={onSuivant}>
                {t('commun.suivant')}
              </Button>
            )}
            <Button variante="fantome" onClick={onRetour}>
              {t('commun.retourListe')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
