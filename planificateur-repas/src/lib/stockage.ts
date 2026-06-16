import type { Criteres, EtatApp } from '../types';
import { PLATS_PAR_DEFAUT } from '../data/plats';

const CLE = 'planificateur-repas-v1';

export const CRITERES_PAR_DEFAUT: Criteres = {
  totalRepas: 7,
  parCategorie: { vegetarien: 2, pates: 1, viande: 2, poisson: 1, oeufs: 1 },
  eviterRepetitionSemaines: 2,
};

export function etatInitial(): EtatApp {
  return {
    plats: PLATS_PAR_DEFAUT,
    criteres: CRITERES_PAR_DEFAUT,
    historique: [],
  };
}

/** Charge l'état depuis le localStorage, ou renvoie l'état initial. */
export function chargerEtat(): EtatApp {
  try {
    const brut = localStorage.getItem(CLE);
    if (!brut) return etatInitial();
    const parse = JSON.parse(brut) as Partial<EtatApp>;
    return {
      plats: parse.plats?.length ? parse.plats : PLATS_PAR_DEFAUT,
      criteres: { ...CRITERES_PAR_DEFAUT, ...parse.criteres },
      historique: parse.historique ?? [],
    };
  } catch {
    return etatInitial();
  }
}

/** Sauvegarde l'état dans le localStorage. */
export function sauvegarderEtat(etat: EtatApp): void {
  try {
    localStorage.setItem(CLE, JSON.stringify(etat));
  } catch {
    // Quota dépassé ou stockage indisponible : on ignore silencieusement.
  }
}
