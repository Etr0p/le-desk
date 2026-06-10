export interface NumericInputProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit?: () => void;
  unite?: string;
  disabled?: boolean;
  /** Verdict affiché après correction — colore subtilement le champ. */
  verdict?: 'juste' | 'faux' | null;
  placeholder?: string;
  autoFocus?: boolean;
  /** Libellé accessible du champ. */
  label?: string;
}

const CADRES = {
  neutre: 'border-border bg-surface-2 focus-within:border-accent',
  juste: 'border-ok/60 bg-ok/5',
  faux: 'border-err/60 bg-err/5',
} as const;

/** Saisie numérique libre (virgule ou point) — la validation vit dans le moteur. */
export function NumericInput({
  value, onChange, onSubmit, unite, disabled = false, verdict = null, placeholder, autoFocus, label,
}: NumericInputProps) {
  const cadre = verdict === 'juste' ? CADRES.juste : verdict === 'faux' ? CADRES.faux : CADRES.neutre;
  return (
    <div className={`flex h-11 items-center overflow-hidden rounded-md border transition-colors duration-150 ${cadre} ${disabled ? 'opacity-45' : ''}`}>
      <input
        type="text"
        inputMode="decimal"
        autoComplete="off"
        spellCheck={false}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        autoFocus={autoFocus}
        aria-label={label ?? 'Réponse numérique'}
        aria-invalid={verdict === 'faux' || undefined}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' && onSubmit) { e.preventDefault(); onSubmit(); } }}
        className="h-full min-w-0 flex-1 bg-transparent px-3 font-mono text-[15px] tabular-nums text-text outline-none placeholder:text-text-muted/60"
      />
      {unite && <span className="select-none pr-3 text-sm text-text-muted">{unite}</span>}
    </div>
  );
}
