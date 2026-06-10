import { useEffect, useRef, useState } from 'react';

export interface TimerProps {
  /** Duree initiale du compte a rebours, en secondes. */
  secondes: number;
  enMarche: boolean;
  onFin?: () => void;
  className?: string;
}

export function Timer({ secondes, enMarche, onFin, className = '' }: TimerProps) {
  const [restant, setRestant] = useState(secondes);
  const onFinRef = useRef(onFin);
  const dejaFiniRef = useRef(false);
  /** Timestamp (ms) auquel le compte se termine. Null quand en pause. */
  const finARef = useRef<number | null>(null);

  useEffect(() => { onFinRef.current = onFin; });

  // Nouvelle duree -> remise a zero du decompte.
  useEffect(() => {
    setRestant(secondes);
    dejaFiniRef.current = false;
    finARef.current = null;
  }, [secondes]);

  useEffect(() => {
    if (!enMarche) {
      // Pause : figer finA (sera recalcule a la reprise).
      finARef.current = null;
      return;
    }
    // Debut ou reprise : calculer la deadline a partir du restant courant.
    setRestant(r => {
      finARef.current = Date.now() + r * 1000;
      return r;
    });

    const recalculer = () => {
      if (finARef.current === null) return;
      const r = Math.max(0, Math.ceil((finARef.current - Date.now()) / 1000));
      setRestant(r);
    };

    const id = window.setInterval(recalculer, 250);

    const onVisibility = () => {
      if (document.visibilityState === 'visible') recalculer();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [enMarche]);

  // Reprise apres pause : recalculer finA avec le restant courant fige.
  useEffect(() => {
    if (enMarche && finARef.current === null) {
      finARef.current = Date.now() + restant * 1000;
    }
  }, [enMarche, restant]);

  useEffect(() => {
    if (restant === 0 && enMarche && !dejaFiniRef.current) {
      dejaFiniRef.current = true;
      onFinRef.current?.();
    }
  }, [restant, enMarche]);

  const mm = String(Math.floor(restant / 60)).padStart(2, '0');
  const ss = String(restant % 60).padStart(2, '0');
  const alerte = restant < 10;

  return (
    <span
      role="timer"
      aria-label={`Temps restant : ${mm} minutes ${ss} secondes`}
      className={`inline-flex items-center gap-1.5 font-mono text-sm tabular-nums transition-colors duration-150 ${
        alerte ? 'font-semibold text-warn' : 'text-text'
      } ${className}`}
    >
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="size-3.5">
        <circle cx="8" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.3" />
        <path d="M8 6v2.5l1.8 1.4M6.5 1.5h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
      {mm}:{ss}
    </span>
  );
}
