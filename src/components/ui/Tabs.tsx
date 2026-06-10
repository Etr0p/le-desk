import { useRef } from 'react';

export interface Onglet {
  id: string;
  libelle: string;
}

export interface TabsProps {
  onglets: Onglet[];
  actif: string;
  onChange: (id: string) => void;
  /** Libellé accessible de la liste d'onglets. */
  label?: string;
}

/** Onglets contrôlés, navigables au clavier (flèches, Début, Fin). */
export function Tabs({ onglets, actif, onChange, label }: TabsProps) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const auClavier = (e: React.KeyboardEvent) => {
    const courant = onglets.findIndex(o => o.id === actif);
    let cible = -1;
    if (e.key === 'ArrowRight') cible = (courant + 1) % onglets.length;
    else if (e.key === 'ArrowLeft') cible = (courant - 1 + onglets.length) % onglets.length;
    else if (e.key === 'Home') cible = 0;
    else if (e.key === 'End') cible = onglets.length - 1;
    if (cible === -1) return;
    e.preventDefault();
    const onglet = onglets[cible];
    if (onglet) {
      onChange(onglet.id);
      refs.current[cible]?.focus();
    }
  };

  return (
    <div role="tablist" aria-label={label} onKeyDown={auClavier} className="flex gap-1 border-b border-border">
      {onglets.map((o, i) => {
        const estActif = o.id === actif;
        return (
          <button
            key={o.id}
            ref={el => { refs.current[i] = el; }}
            type="button"
            role="tab"
            aria-selected={estActif}
            tabIndex={estActif ? 0 : -1}
            onClick={() => onChange(o.id)}
            className={`-mb-px min-h-11 border-b-2 px-3 text-sm font-medium transition-colors duration-150 ${
              estActif ? 'border-accent text-text' : 'border-transparent text-text-muted hover:text-text'
            }`}
          >
            {o.libelle}
          </button>
        );
      })}
    </div>
  );
}
