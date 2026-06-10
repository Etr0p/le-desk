import { Card } from '../components/ui/Card';
import { useTitre } from './useTitre';

/** Gabarit des pages en attente d'implémentation (tâches suivantes). */
export function PageProvisoire({ titre, description }: { titre: string; description: string }) {
  useTitre(titre);
  return (
    <>
      <h1 className="mb-6 text-xl font-semibold tracking-tight text-text">{titre}</h1>
      <Card>
        <p className="text-sm leading-relaxed text-text-muted">{description}</p>
      </Card>
    </>
  );
}
