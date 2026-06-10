import type { ReactNode } from 'react';

export type VarianteBadge = 'neutre' | 'n1' | 'n2' | 'n3' | 'n4' | 'ok' | 'err';

export interface BadgeProps {
  variante?: VarianteBadge;
  children: ReactNode;
  className?: string;
}

/* Gradation des niveaux : N1 discret (contour) → N4 accent plein. */
const VARIANTES: Record<VarianteBadge, string> = {
  neutre: 'border-border bg-surface-2 text-text-muted',
  n1: 'border-border bg-transparent text-text-muted',
  n2: 'border-border bg-surface-2 text-text',
  n3: 'border-accent/30 bg-accent/10 text-accent',
  n4: 'border-accent bg-accent text-bg',
  ok: 'border-ok/30 bg-ok/10 text-ok',
  err: 'border-err/30 bg-err/10 text-err',
};

export function Badge({ variante = 'neutre', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded border px-1.5 py-px text-[11px] font-medium tabular-nums tracking-wide ${VARIANTES[variante]} ${className}`}
    >
      {children}
    </span>
  );
}
