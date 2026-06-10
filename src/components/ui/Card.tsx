import type { ReactNode } from 'react';

export interface CardProps {
  titre?: string;
  children: ReactNode;
  className?: string;
}

export function Card({ titre, children, className = '' }: CardProps) {
  return (
    <section className={`rounded-lg border border-border bg-surface p-5 ${className}`}>
      {titre && <h2 className="mb-3 text-sm font-semibold tracking-wide text-text">{titre}</h2>}
      {children}
    </section>
  );
}
