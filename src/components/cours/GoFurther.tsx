import type { ReactNode } from 'react';
import { Collapsible } from '../ui/Collapsible';

export interface GoFurtherProps {
  /** Suffixe optionnel ajouté au titre : « Pour aller plus loin — {suffixe} ». */
  suffixe?: string;
  children: ReactNode;
}

export function GoFurther({ suffixe, children }: GoFurtherProps) {
  const titre = suffixe ? `Pour aller plus loin — ${suffixe}` : 'Pour aller plus loin';
  return (
    <div className="my-5 ml-2 pl-3 border-l-2 border-border opacity-80">
      <Collapsible titre={titre} className="bg-surface-2/40 border-border/60">
        {children}
      </Collapsible>
    </div>
  );
}
