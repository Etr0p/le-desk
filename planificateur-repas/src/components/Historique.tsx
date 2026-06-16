import type { SemaineGeneree } from '../types';
import { EMOJI_CATEGORIE, LIBELLES_CATEGORIE } from '../types';

interface Props {
  historique: SemaineGeneree[];
  onSupprimer: (id: string) => void;
  onVider: () => void;
}

export default function Historique({ historique, onSupprimer, onVider }: Props) {
  if (historique.length === 0) {
    return (
      <div className="carte">
        <h2>Historique</h2>
        <p className="vide">
          Aucune semaine enregistrée pour l'instant. Générez une semaine puis
          cliquez sur « Enregistrer ».
        </p>
      </div>
    );
  }

  return (
    <div className="carte">
      <h2>Historique ({historique.length})</h2>
      <div className="barre-actions" style={{ marginTop: 0, marginBottom: '1rem' }}>
        <button className="btn danger" onClick={onVider}>
          Vider l'historique
        </button>
      </div>
      {historique.map((s) => (
        <div className="semaine-histo" key={s.id}>
          <div className="date">
            📅 {new Date(s.dateGeneration).toLocaleDateString('fr-FR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}{' '}
            — {s.repas.length} repas
            <button
              className="lien"
              style={{ marginLeft: '0.75rem' }}
              onClick={() => onSupprimer(s.id)}
            >
              supprimer
            </button>
          </div>
          <div className="repas-liste">
            {s.repas.map((r, i) => (
              <div className="repas" key={`${s.id}-${i}`}>
                <span className="jour">{r.jour}</span>
                <span className="nom">
                  {EMOJI_CATEGORIE[r.categorie]} {r.nom}
                </span>
                <span className="badge">{LIBELLES_CATEGORIE[r.categorie]}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
