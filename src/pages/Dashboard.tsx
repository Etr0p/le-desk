import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTitre } from './useTitre';
import { useEtat } from '../engine/useEtat';
import { modules } from '../engine/registry';
import { toutesLesFlashcards } from '../engine/registry';
import { apercuFileDuJour } from '../engine/flashqueue';
import { aujourdHuiLocal } from '../engine/srs';
import { progressionModule, pointsFaibles, dernieresSessions } from '../engine/stats';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';

/* ─── helpers ─── */

function formatPct(n: number): string {
  return `${Math.round(n * 100)} %`;
}

function formatDate(iso: string): string {
  const [annee, mois, jour] = iso.split('-');
  return `${jour}/${mois}/${annee}`;
}

function labelType(type: string): string {
  switch (type) {
    case 'qcm': return 'QCM';
    case 'exercice': return 'Exercice';
    case 'probleme': return 'Problème';
    case 'jury': return 'Jury';
    case 'examen': return 'Examen blanc';
    default: return type;
  }
}

/* ─── Page ─── */

export default function Dashboard() {
  useTitre('Tableau de bord');
  const { etat } = useEtat();
  const aujourd = useMemo(() => aujourdHuiLocal(), []);

  const toutes = toutesLesFlashcards();
  const apercu = useMemo(
    () => apercuFileDuJour(toutes, etat, aujourd),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [etat, aujourd],
  );

  const pfaibles = useMemo(
    () => pointsFaibles(modules, etat).slice(0, 3),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [etat],
  );

  const sessions = useMemo(
    () => dernieresSessions(etat.tentatives, 5),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [etat],
  );

  const totalRevisions = apercu.dues + apercu.nouvelles;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold tracking-tight text-text">Tableau de bord</h1>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Révisions du jour */}
        <Card titre="Révisions du jour">
          {totalRevisions === 0 ? (
            <EmptyState
              titre="Rien à réviser aujourd'hui."
              indice="Revenez demain pour de nouvelles cartes."
            />
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-text-muted">
                <span className="tabular-nums text-text font-semibold">{apercu.dues}</span> à réviser
                {apercu.nouvelles > 0 && (
                  <> · <span className="tabular-nums text-text font-semibold">{apercu.nouvelles}</span> nouvelles</>
                )}
              </p>
              <Link to="/entrainement/flashcards">
                <Button variante="primaire">Réviser maintenant</Button>
              </Link>
            </div>
          )}
        </Card>

        {/* Série */}
        <Card titre="Série en cours">
          <p className="text-3xl font-bold tabular-nums text-text">
            {etat.streak.serie}
          </p>
          <p className="mt-1 text-sm text-text-muted">
            {etat.streak.serie === 0
              ? 'Commencez une session pour démarrer votre série.'
              : etat.streak.serie === 1
              ? 'jour consécutif'
              : 'jours consécutifs'}
          </p>
        </Card>

        {/* Reprendre */}
        {etat.reprise && (
          <Card titre="Reprendre">
            <p className="mb-3 text-sm text-text-muted">{etat.reprise.libelle}</p>
            <Link to={etat.reprise.chemin}>
              <Button variante="secondaire">Reprendre</Button>
            </Link>
          </Card>
        )}
      </div>

      {/* Progression du cours */}
      <Card titre="Progression du cours">
        {modules.length === 0 ? (
          <EmptyState titre="Aucun module disponible." />
        ) : (
          <ul className="space-y-4">
            {modules.map(m => {
              const { acquis, total } = progressionModule(m, etat);
              return (
                <li key={m.meta.id}>
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <Link
                      to={`/cours/${m.meta.id}`}
                      className="text-sm font-medium text-text hover:text-accent transition-colors duration-150"
                    >
                      {m.meta.titre}
                    </Link>
                    <span className="text-xs tabular-nums text-text-muted shrink-0">
                      {acquis}/{total}
                    </span>
                  </div>
                  <ProgressBar valeur={total > 0 ? acquis / total : 0} />
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      {/* Points faibles */}
      <Card titre="Points faibles">
        {pfaibles.length === 0 ? (
          <EmptyState
            titre="Pas assez de données."
            indice="Faites quelques QCM pour révéler vos points faibles."
          />
        ) : (
          <ul className="space-y-2">
            {pfaibles.map((pf, i) => {
              const mod = modules.find(m => m.meta.id === pf.moduleId);
              return (
                <li key={i} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface-2/40 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text truncate">{pf.theme}</p>
                    {mod && (
                      <p className="text-xs text-text-muted">{mod.meta.titre}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm tabular-nums text-err font-semibold">{formatPct(pf.taux)}</span>
                    <Link
                      to="/entrainement/qcm"
                      className="text-xs text-accent hover:underline transition-colors duration-150"
                    >
                      Retravailler
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      {/* Dernières sessions */}
      {sessions.length > 0 && (
        <Card titre="Dernières sessions">
          <ul className="space-y-2">
            {sessions.map((s, i) => (
              <li key={i} className="flex items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-3">
                  <span className="tabular-nums text-text-muted text-xs">{formatDate(s.date)}</span>
                  <span className="text-text">{labelType(s.type)}</span>
                  <span className="text-xs text-text-muted tabular-nums">{s.nb} question{s.nb > 1 ? 's' : ''}</span>
                </div>
                <span className="tabular-nums font-semibold text-text">{formatPct(s.taux)}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
