import { useMemo, useState } from 'react';
import type { Categorie, Plat } from '../types';
import {
  CATEGORIES,
  EMOJI_CATEGORIE,
  LIBELLES_CATEGORIE,
} from '../types';

interface Props {
  plats: Plat[];
  onChanger: (plats: Plat[]) => void;
}

export default function MesPlats({ plats, onChanger }: Props) {
  const [filtre, setFiltre] = useState<Categorie | 'tous'>('tous');
  const [nom, setNom] = useState('');
  const [categorie, setCategorie] = useState<Categorie>('vegetarien');

  const visibles = useMemo(
    () => (filtre === 'tous' ? plats : plats.filter((p) => p.categorie === filtre)),
    [plats, filtre],
  );

  const comptes = useMemo(() => {
    const m: Record<string, number> = {};
    for (const p of plats) m[p.categorie] = (m[p.categorie] ?? 0) + 1;
    return m;
  }, [plats]);

  function ajouter() {
    const propre = nom.trim();
    if (!propre) return;
    const plat: Plat = {
      id: `u-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      nom: propre,
      categorie,
    };
    onChanger([...plats, plat]);
    setNom('');
  }

  function supprimer(id: string) {
    onChanger(plats.filter((p) => p.id !== id));
  }

  return (
    <div className="carte">
      <h2>Mes plats ({plats.length})</h2>

      <div className="ajout-plat">
        <div className="champ">
          <label>Nom du plat</label>
          <input
            value={nom}
            placeholder="Ex : Tartiflette"
            onChange={(e) => setNom(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && ajouter()}
          />
        </div>
        <div className="champ">
          <label>Catégorie</label>
          <select
            value={categorie}
            onChange={(e) => setCategorie(e.target.value as Categorie)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {EMOJI_CATEGORIE[c]} {LIBELLES_CATEGORIE[c]}
              </option>
            ))}
          </select>
        </div>
        <button className="btn" onClick={ajouter}>
          + Ajouter
        </button>
      </div>

      <div className="filtres">
        <button
          className={`puce ${filtre === 'tous' ? 'actif' : ''}`}
          onClick={() => setFiltre('tous')}
        >
          Tous ({plats.length})
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={`puce ${filtre === c ? 'actif' : ''}`}
            onClick={() => setFiltre(c)}
          >
            {EMOJI_CATEGORIE[c]} {LIBELLES_CATEGORIE[c]} ({comptes[c] ?? 0})
          </button>
        ))}
      </div>

      {visibles.length === 0 ? (
        <p className="vide">Aucun plat dans cette catégorie.</p>
      ) : (
        <div className="plats-grille">
          {visibles.map((p) => (
            <div className="plat-item" key={p.id}>
              <span>{EMOJI_CATEGORIE[p.categorie]}</span>
              <span className="nom">{p.nom}</span>
              <button
                className="lien"
                title="Supprimer"
                onClick={() => supprimer(p.id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
