export interface EmptyStateProps {
  titre: string;
  indice?: string;
  className?: string;
}

export function EmptyState({ titre, indice, className = '' }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-lg border border-dashed border-border px-6 py-12 text-center ${className}`}>
      <p className="text-sm font-medium text-text">{titre}</p>
      {indice && <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-text-muted">{indice}</p>}
    </div>
  );
}
