import { Link } from 'react-router-dom';
import { useTitre } from './useTitre';

const MODES = [
  { vers: '/entrainement/exercices', titre: 'Exercices', description: 'Calculs paramétrés avec corrigé pas à pas.' },
  { vers: '/entrainement/qcm', titre: 'QCM', description: 'Questions à choix multiples, pièges expliqués.' },
  { vers: '/entrainement/jury', titre: 'Questions de jury', description: 'Questions ouvertes type entretien ou grand oral.' },
  { vers: '/entrainement/flashcards', titre: 'Flashcards', description: 'Révision espacée des notions et formules clés.' },
];

export default function Entrainement() {
  useTitre('Entraînement');
  return (
    <>
      <h1 className="mb-6 text-xl font-semibold tracking-tight text-text">Entraînement</h1>
      <div className="grid gap-3 sm:grid-cols-2">
        {MODES.map(m => (
          <Link
            key={m.vers}
            to={m.vers}
            className="group rounded-lg border border-border bg-surface p-5 transition-colors duration-150 hover:border-accent/50 hover:bg-surface-2/40"
          >
            <p className="text-sm font-semibold text-text transition-colors duration-150 group-hover:text-accent">{m.titre}</p>
            <p className="mt-1 text-sm leading-relaxed text-text-muted">{m.description}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
