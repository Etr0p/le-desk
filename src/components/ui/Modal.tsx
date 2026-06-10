import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

export interface ModalProps {
  ouvert: boolean;
  onFermer: () => void;
  titre?: string;
  children: ReactNode;
}

const FOCUSABLES = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function ModalInterne({ ouvert, onFermer, titre, children }: ModalProps) {
  const panneauRef = useRef<HTMLDivElement>(null);
  const onFermerRef = useRef(onFermer);
  useEffect(() => { onFermerRef.current = onFermer; });

  useEffect(() => {
    if (!ouvert) return;
    const precedent = document.activeElement as HTMLElement | null;
    panneauRef.current?.focus();
    document.body.style.overflow = 'hidden';

    const auClavier = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onFermerRef.current(); return; }
      if (e.key !== 'Tab' || !panneauRef.current) return;
      // Piege de focus basique : Tab boucle a l'interieur du panneau.
      const focusables = Array.from(panneauRef.current.querySelectorAll<HTMLElement>(FOCUSABLES));
      if (focusables.length === 0) { e.preventDefault(); return; }
      const premier = focusables[0]!;
      const dernier = focusables[focusables.length - 1]!;
      const actif = document.activeElement;
      if (e.shiftKey && (actif === premier || actif === panneauRef.current)) {
        e.preventDefault();
        dernier.focus();
      } else if (!e.shiftKey && actif === dernier) {
        e.preventDefault();
        premier.focus();
      }
    };
    document.addEventListener('keydown', auClavier);
    return () => {
      document.removeEventListener('keydown', auClavier);
      document.body.style.overflow = '';
      precedent?.focus();
    };
  }, [ouvert]);

  if (!ouvert) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={() => onFermerRef.current()} aria-hidden="true" />
      <div
        ref={panneauRef}
        role="dialog"
        aria-modal="true"
        aria-label={titre ?? 'Fenetre de dialogue'}
        tabIndex={-1}
        className="relative w-full max-w-lg rounded-xl border border-border bg-surface p-5 shadow-2xl outline-none"
      >
        {titre && <h2 className="mb-3 pr-8 text-base font-semibold text-text">{titre}</h2>}
        <button
          type="button"
          onClick={() => onFermerRef.current()}
          aria-label="Fermer"
          className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-md text-text-muted transition-colors duration-150 hover:bg-surface-2 hover:text-text"
        >
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="size-4">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
}

export function Modal(props: ModalProps) {
  return createPortal(<ModalInterne {...props} />, document.body);
}
