import type { ReactNode } from 'react';
import { useLangue } from '../../engine/useLangue';
import { Collapsible } from '../ui/Collapsible';

export interface GoFurtherProps {
  /** Suffixe optionnel ajouté au titre. */
  suffixe?: string;
  children: ReactNode;
}

export function GoFurther({ suffixe, children }: GoFurtherProps) {
  const { t } = useLangue();
  const base = t('cours.pourAllerPlusLoin');
  const titre = suffixe ? `${base} — ${suffixe}` : base;
  return (
    <div className="my-5 ml-2 pl-3 border-l-2 border-border opacity-80">
      <Collapsible titre={titre} className="bg-surface-2/40 border-border/60">
        {children}
      </Collapsible>
    </div>
  );
}
