import type { ReactNode } from 'react';
import { useLangue } from '../../engine/useLangue';
import type { CleTexte } from '../../engine/textes';

export type TypeCallout = 'definition' | 'exemple' | 'piege' | 'important';

export interface CalloutProps {
  type: TypeCallout;
  titre?: string;
  children: ReactNode;
}

const CONFIG: Record<TypeCallout, { cleLabel: CleTexte; classe: string }> = {
  definition: {
    cleLabel: 'cours.calloutDefinition',
    classe: 'border-l-[3px] border-l-accent bg-accent/6 text-text',
  },
  exemple: {
    cleLabel: 'cours.calloutExemple',
    classe: 'border-l-[3px] border-l-text-muted/50 bg-surface-2/60 text-text',
  },
  piege: {
    cleLabel: 'cours.calloutPiege',
    classe: 'border-l-[3px] border-l-warn bg-warn/8 text-text',
  },
  important: {
    cleLabel: 'cours.calloutImportant',
    classe: 'border-l-[3px] border-l-accent bg-accent/10 text-text',
  },
};

const LABEL_COULEUR: Record<TypeCallout, string> = {
  definition: 'text-accent',
  exemple: 'text-text-muted',
  piege: 'text-warn',
  important: 'text-accent',
};

export function Callout({ type, titre, children }: CalloutProps) {
  const { t } = useLangue();
  const { cleLabel, classe } = CONFIG[type];
  const labelCouleur = LABEL_COULEUR[type];
  return (
    <div className={`my-5 rounded-r-lg px-4 py-3.5 ${classe}`} role="note">
      <p className={`mb-1 text-[10px] font-semibold uppercase tracking-widest ${labelCouleur}`}>
        {t(cleLabel)}
      </p>
      {titre && (
        <p className="mb-1.5 text-sm font-semibold text-text">{titre}</p>
      )}
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}
