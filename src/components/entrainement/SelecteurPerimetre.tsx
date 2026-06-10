import type { ModuleContenu } from '../../engine/types';
import { modules } from '../../engine/registry';

export type NiveauFiltre = 1 | 2 | 3 | 4;

export interface PerimetreSelection {
  modulesChoisis: string[]; // ids
  niveaux: NiveauFiltre[];  // vide = tous
}

interface SelecteurPerimetreProps {
  /** Prédicat qui détermine si un module a du contenu pour ce runner. */
  aContenu: (m: ModuleContenu) => boolean;
  selection: PerimetreSelection;
  onChange: (s: PerimetreSelection) => void;
  /** Afficher les chips de difficulté N1-N4 (défaut : true). Passer false pour les runners sans champ difficulte (Flashcards). */
  montrerNiveaux?: boolean;
}

const NIVEAUX: { niveau: NiveauFiltre; libelle: string }[] = [
  { niveau: 1, libelle: 'N1' },
  { niveau: 2, libelle: 'N2' },
  { niveau: 3, libelle: 'N3' },
  { niveau: 4, libelle: 'N4' },
];

export function SelecteurPerimetre({ aContenu, selection, onChange, montrerNiveaux = true }: SelecteurPerimetreProps) {
  const modulesDisponibles = modules.filter(aContenu);

  function toggleModule(id: string) {
    const actifs = selection.modulesChoisis;
    const suivants = actifs.includes(id)
      ? actifs.filter(m => m !== id)
      : [...actifs, id];
    onChange({ ...selection, modulesChoisis: suivants });
  }

  function toggleNiveau(n: NiveauFiltre) {
    const actifs = selection.niveaux;
    const suivants = actifs.includes(n)
      ? actifs.filter(x => x !== n)
      : [...actifs, n].sort((a, b) => a - b) as NiveauFiltre[];
    onChange({ ...selection, niveaux: suivants });
  }

  return (
    <div className="space-y-3">
      {/* Modules */}
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-text-muted">Modules</p>
        {modulesDisponibles.length === 0 ? (
          <p className="text-sm text-text-muted">Aucun module avec contenu disponible.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {modulesDisponibles.map(m => {
              const actif = selection.modulesChoisis.includes(m.meta.id);
              return (
                <button
                  key={m.meta.id}
                  type="button"
                  onClick={() => toggleModule(m.meta.id)}
                  aria-pressed={actif}
                  className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors duration-150 ${
                    actif
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-border bg-surface-2 text-text-muted hover:border-accent/40 hover:text-text'
                  }`}
                >
                  {m.meta.numero}. {m.meta.titre}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Niveaux */}
      {montrerNiveaux && (
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-text-muted">
            Difficulté
          </p>
          <div className="flex gap-2">
            {NIVEAUX.map(({ niveau, libelle }) => {
              const actif = selection.niveaux.length === 0 || selection.niveaux.includes(niveau);
              return (
                <button
                  key={niveau}
                  type="button"
                  onClick={() => toggleNiveau(niveau)}
                  aria-pressed={actif}
                  className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors duration-150 ${
                    actif
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-border bg-surface-2 text-text-muted hover:border-accent/40 hover:text-text'
                  }`}
                >
                  {libelle}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function perimetre0(): PerimetreSelection {
  return { modulesChoisis: [], niveaux: [] };
}

/** Prédicat par défaut : le module a des exercices ou des problèmes. */
export function aExercicesOuProblemes(m: ModuleContenu): boolean {
  return m.exercices.length + m.problemes.length > 0;
}

/** Retourne true si la difficulté passe le filtre (vide = tout). */
export function niveauAutorise(niveaux: NiveauFiltre[], difficulte: number): boolean {
  if (niveaux.length === 0) return true;
  return niveaux.includes(difficulte as NiveauFiltre);
}
