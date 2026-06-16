import { useState } from 'react';
import type { Criteres, Plat, RepasPlanifie, SemaineGeneree } from '../types';
import {
  CATEGORIES,
  EMOJI_CATEGORIE,
  LIBELLES_CATEGORIE,
} from '../types';
import { genererSemaine } from '../lib/generateur';
import { creerRng, graineAleatoire } from '../lib/rng';

interface Props {
  plats: Plat[];
  criteres: Criteres;
  historique: SemaineGeneree[];
  onChangerCriteres: (c: Criteres) => void;
  onEnregistrer: (s: SemaineGeneree) => void;
}

export default function Planificateur({
  plats,
  criteres,
  historique,
  onChangerCriteres,
  onEnregistrer,
}: Props) {
  const [repas, setRepas] = useState<RepasPlanifie[] | null>(null);
  const [avertissements, setAvertissements] = useState<string[]>([]);

  function majTotal(v: number) {
    onChangerCriteres({ ...criteres, totalRepas: Math.max(1, Math.min(21, v)) });
  }

  function majCategorie(cat: string, v: number) {
    onChangerCriteres({
      ...criteres,
      parCategorie: { ...criteres.parCategorie, [cat]: Math.max(0, v) },
    });
  }

  function majEviter(v: number) {
    onChangerCriteres({ ...criteres, eviterRepetitionSemaines: Math.max(0, Math.min(8, v)) });
  }

  function generer() {
    const res = genererSemaine(plats, criteres, historique);
    setRepas(res.repas);
    setAvertissements(res.avertissements);
  }

  /** Remplace un seul repas par un autre plat varié de la même catégorie. */
  function relancer(index: number) {
    if (!repas) return;
    const courant = repas[index];
    const idsUtilises = new Set(repas.map((r) => r.platId));
    const candidats = plats.filter(
      (p) => p.categorie === courant.categorie && !idsUtilises.has(p.id),
    );
    if (candidats.length === 0) return;
    const rng = creerRng(graineAleatoire());
    const choisi = candidats[Math.floor(rng() * candidats.length)];
    const copie = [...repas];
    copie[index] = {
      ...courant,
      platId: choisi.id,
      nom: choisi.nom,
      categorie: choisi.categorie,
    };
    setRepas(copie);
  }

  function enregistrer() {
    if (!repas) return;
    onEnregistrer({
      id: `s-${Date.now()}`,
      dateGeneration: new Date().toISOString(),
      repas,
    });
  }

  return (
    <div>
      <div className="carte">
        <h2>Critères de la semaine</h2>
        <div className="grille-criteres">
          <div className="champ">
            <label>Nombre total de repas</label>
            <input
              type="number"
              min={1}
              max={21}
              value={criteres.totalRepas}
              onChange={(e) => majTotal(Number(e.target.value))}
            />
          </div>
          {CATEGORIES.filter((c) => c !== 'autre').map((cat) => (
            <div className="champ" key={cat}>
              <label>
                {EMOJI_CATEGORIE[cat]} {LIBELLES_CATEGORIE[cat]}
              </label>
              <input
                type="number"
                min={0}
                value={criteres.parCategorie[cat] ?? 0}
                onChange={(e) => majCategorie(cat, Number(e.target.value))}
              />
            </div>
          ))}
          <div className="champ">
            <label>Éviter les répétitions (semaines)</label>
            <input
              type="number"
              min={0}
              max={8}
              value={criteres.eviterRepetitionSemaines}
              onChange={(e) => majEviter(Number(e.target.value))}
            />
          </div>
        </div>
        <div className="barre-actions">
          <button className="btn" onClick={generer}>
            🎲 Générer ma semaine
          </button>
          {repas && (
            <button className="btn secondaire" onClick={generer}>
              ↻ Regénérer
            </button>
          )}
        </div>
      </div>

      {repas && (
        <div className="carte">
          <h2>Ma semaine</h2>
          {avertissements.map((a, i) => (
            <div className="avertissement" key={i}>
              ⚠️ {a}
            </div>
          ))}
          <div className="repas-liste">
            {repas.map((r, i) => (
              <div className="repas" key={`${r.platId}-${i}`}>
                <span className="jour">{r.jour}</span>
                <span className="nom">
                  {EMOJI_CATEGORIE[r.categorie]} {r.nom}
                </span>
                <span className="badge">{LIBELLES_CATEGORIE[r.categorie]}</span>
                <button
                  className="reroll"
                  title="Changer ce plat"
                  onClick={() => relancer(i)}
                >
                  🔄
                </button>
              </div>
            ))}
          </div>
          <div className="barre-actions">
            <button className="btn" onClick={enregistrer}>
              💾 Enregistrer dans l'historique
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
