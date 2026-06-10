import type { Etape } from '../../engine/types';
import { useLangue } from '../../engine/useLangue';
import { Markdown } from '../Markdown';

interface EtapesProps {
  etapes: Etape[];
}

export function Etapes({ etapes }: EtapesProps) {
  const { t } = useLangue();
  if (etapes.length === 0) return null;
  return (
    <ol className="space-y-3">
      {etapes.map((e, i) => (
        <li key={i} className="rounded-lg border border-border bg-surface p-4">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-text-muted">
            {t('exo.etape')} {i + 1}{e.titre ? ` — ${e.titre}` : ''}
          </p>
          <Markdown texte={e.contenu} className="text-sm leading-relaxed text-text" />
        </li>
      ))}
    </ol>
  );
}
