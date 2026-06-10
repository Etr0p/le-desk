import type { ButtonHTMLAttributes } from 'react';

type Variante = 'primaire' | 'secondaire' | 'fantome';
type Taille = 'sm' | 'md';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante;
  taille?: Taille;
}

const VARIANTES: Record<Variante, string> = {
  // text-bg sur accent : lisible dans les deux thèmes (fond sombre / vert profond).
  primaire: 'bg-accent text-bg hover:bg-accent/85 active:bg-accent/75',
  secondaire: 'border border-border bg-surface-2 text-text hover:border-text-muted/40 hover:bg-surface-2/70 active:bg-surface-2/50',
  fantome: 'text-text-muted hover:bg-surface-2 hover:text-text active:bg-surface-2/70',
};

const TAILLES: Record<Taille, string> = {
  sm: 'h-8 px-3 text-[13px]',
  md: 'h-10 px-4 text-sm',
};

export function Button({ variante = 'primaire', taille = 'md', className = '', type = 'button', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex select-none items-center justify-center gap-2 rounded-md font-medium transition-colors duration-150 disabled:pointer-events-none disabled:opacity-45 ${VARIANTES[variante]} ${TAILLES[taille]} ${className}`}
      {...props}
    />
  );
}
