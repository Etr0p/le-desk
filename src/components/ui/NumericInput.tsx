/**
 * NumericInput — saisie numerique libre.
 *
 * CONTRAT D'ACCESSIBILITE (appelants obligatoires)
 * ─────────────────────────────────────────────────
 * La couleur du cadre n'est PAS le seul canal d'information du verdict.
 * Tout composant qui affiche un verdict ("juste" | "faux") DOIT accompagner
 * ce champ d'un texte lisible par les technologies d'assistance
 * (ex. "Bonne reponse !" ou "Reponse incorrecte."), soit via un <p>
 * adjacent, soit via aria-describedby pointant vers cet element.
 * Le glyphe SVG ci-dessous (slot "unite") est un complement visuel,
 * non un substitut au texte.
 */

export interface NumericInputProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit?: () => void;
  unite?: string;
  disabled?: boolean;
  /** Verdict affiche apres correction — colore subtilement le champ. */
  verdict?: 'juste' | 'faux' | null;
  placeholder?: string;
  autoFocus?: boolean;
  /** Libelle accessible du champ. */
  label?: string;
}

const CADRES = {
  neutre: 'border-border bg-surface-2 focus-within:border-accent',
  juste: 'border-ok/60 bg-ok/5',
  faux: 'border-err/60 bg-err/5',
} as const;

/** Glyphe SVG inline indiquant le verdict (complement visuel uniquement). */
function GlypheVerdict({ verdict }: { verdict: 'juste' | 'faux' }) {
  if (verdict === 'juste') {
    return (
      <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" className="size-3.5 shrink-0 text-ok">
        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" className="size-3.5 shrink-0 text-err">
      <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/** Saisie numerique libre (virgule ou point) — la validation vit dans le moteur. */
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
        aria-label={label ?? 'Reponse numerique'}
        aria-invalid={verdict === 'faux' || undefined}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' && onSubmit) { e.preventDefault(); onSubmit(); } }}
        className="h-full min-w-0 flex-1 bg-transparent px-3 font-mono text-[15px] tabular-nums text-text outline-none placeholder:text-text-muted/60"
      />
      {verdict && (
        <span className="flex items-center pr-2">
          <GlypheVerdict verdict={verdict} />
        </span>
      )}
      {unite && <span className="select-none pr-3 text-sm text-text-muted">{unite}</span>}
    </div>
  );
}
