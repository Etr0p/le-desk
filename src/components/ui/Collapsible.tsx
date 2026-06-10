import { useState, type ReactNode } from 'react';

export interface CollapsibleProps {
  titre: string;
  ouvertParDefaut?: boolean;
  children: ReactNode;
  className?: string;
}

export function Collapsible({ titre, ouvertParDefaut = false, children, className = '' }: CollapsibleProps) {
  const [ouvert, setOuvert] = useState(ouvertParDefaut);
  return (
    <div className={`rounded-lg border border-border bg-surface ${className}`}>
      <button
        type="button"
        aria-expanded={ouvert}
        onClick={() => setOuvert(o => !o)}
        className="flex min-h-11 w-full items-center justify-between gap-3 rounded-lg px-4 py-2.5 text-left text-sm font-medium text-text transition-colors duration-150 hover:bg-surface-2/60"
      >
        {titre}
        <svg
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          className={`size-4 shrink-0 text-text-muted transition-transform duration-200 ${ouvert ? 'rotate-180' : ''}`}
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {/* Animation de hauteur sans mesure : grille 0fr → 1fr. */}
      <div className={`grid transition-[grid-template-rows] duration-200 ease-out ${ouvert ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <div className="px-4 pb-4 pt-1 text-sm leading-relaxed text-text">{children}</div>
        </div>
      </div>
    </div>
  );
}
