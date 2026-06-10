import { useEffect, useRef, useState } from 'react';

export interface TimerProps {
  /** Durée initiale du compte à rebours, en secondes. */
  secondes: number;
  enMarche: boolean;
  onFin?: () => void;
  className?: string;
}

export function Timer({ secondes, enMarche, onFin, className = '' }: TimerProps) {
  const [restant, setRestant] = useState(secondes);
  const onFinRef = useRef(onFin);
  const dejaFiniRef = useRef(false);
  useEffect(() => { onFinRef.current = onFin; });

  // Nouvelle durée → remise à zéro du décompte.
  useEffect(() => {
    setRestant(secondes);
    dejaFiniRef.current = false;
  }, [secondes]);

  useEffect(() => {
    if (!enMarche) return;
    const id = window.setInterval(() => setRestant(r => Math.max(0, r - 1)), 1000);
    return () => window.clearInterval(id);
  }, [enMarche]);

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
