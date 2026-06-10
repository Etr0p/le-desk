import { Link } from 'react-router-dom';
import { useTitre } from './useTitre';
import { useLangue } from '../engine/useLangue';

export default function Entrainement() {
  const { t } = useLangue();
  useTitre(t('nav.entrainement'));

  const MODES = [
    {
      vers: '/entrainement/exercices',
      titre: t('exo.modesExercicesTitre'),
      description: t('exo.modesExercicesDesc'),
    },
    {
      vers: '/entrainement/qcm',
      titre: t('qcm.titre'),
      description: t('exo.modesQcmDesc'),
    },
    {
      vers: '/entrainement/jury',
      titre: t('exo.modesJury'),
      description: t('exo.modesJuryDesc'),
    },
    {
      vers: '/entrainement/flashcards',
      titre: t('flash.titre'),
      description: t('exo.modesFlashDesc'),
    },
  ];

  return (
    <>
      <h1 className="mb-6 text-xl font-semibold tracking-tight text-text">{t('nav.entrainement')}</h1>
      <div className="grid gap-3 sm:grid-cols-2">
        {MODES.map(m => (
          <Link
            key={m.vers}
            to={m.vers}
            className="group rounded-lg border border-border bg-surface p-5 transition-colors duration-150 hover:border-accent/50 hover:bg-surface-2/40"
          >
            <p className="text-sm font-semibold text-text transition-colors duration-150 group-hover:text-accent">
              {m.titre}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-text-muted">{m.description}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
