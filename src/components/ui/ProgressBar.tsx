export interface ProgressBarProps {
  /** Avancement entre 0 et 1. */
  valeur: number;
  label?: string;
  className?: string;
}

export function ProgressBar({ valeur, label, className = '' }: ProgressBarProps) {
  const pct = Math.round(Math.min(1, Math.max(0, valeur)) * 100);
  return (
    <div className={className}>
      {label && (
        <div className="mb-1.5 flex items-baseline justify-between gap-2">
          <span className="text-xs text-text-muted">{label}</span>
          <span className="text-xs tabular-nums text-text-muted">{pct} %</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label={label}
        className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2"
      >
        <div className="h-full rounded-full bg-accent transition-[width] duration-200" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
