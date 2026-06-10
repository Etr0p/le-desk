import { Card } from '../components/ui/Card';
import { useEtat } from '../engine/useEtat';
import { useTitre } from './useTitre';

const THEMES = [
  { valeur: 'sombre', libelle: 'Sombre' },
  { valeur: 'clair', libelle: 'Clair' },
] as const;

export default function Reglages() {
  useTitre('Reglages');
  const { etat, modifier } = useEtat();
  const theme = etat.reglages.theme;

  return (
    <>
      <h1 className="mb-6 text-xl font-semibold tracking-tight text-text">Reglages</h1>
      <div className="flex flex-col gap-4">
        <Card titre="Apparence">
          <p className="mb-3 text-sm text-text-muted">Theme de l'interface</p>
          {/* Deux boutons aria-pressed plutot qu'un faux radiogroup.
              Chaque bouton indique son etat actif independamment. */}
          <div className="inline-flex rounded-md border border-border bg-surface-2 p-0.5">
            {THEMES.map(t => {
              const actif = theme === t.valeur;
              return (
                <button
                  key={t.valeur}
                  type="button"
                  aria-pressed={actif}
                  onClick={() => modifier(e => { e.reglages.theme = t.valeur; })}
                  className={`h-9 min-w-24 rounded-[5px] px-4 text-sm font-medium transition-colors duration-150 ${
                    actif ? 'border border-border bg-surface text-text shadow-sm' : 'text-text-muted hover:text-text'
                  }`}
                >
                  {t.libelle}
                </button>
              );
            })}
          </div>
        </Card>
        <Card titre="A venir">
          <p className="text-sm leading-relaxed text-text-muted">
            Nombre de nouvelles cartes par jour, export et import de la sauvegarde locale, remise a zero.
          </p>
        </Card>
      </div>
    </>
  );
}
