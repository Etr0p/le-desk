/**
 * Bibliothèque de référence du module Panorama des marchés & acteurs.
 * Module de culture (quantitatif: false) : ces fonctions servent uniquement
 * aux exercices de microstructure (fourchette, carnet d'ordres, coûts d'exécution).
 *
 * Conventions :
 * — prix, bid, ask en € par titre ; montants (coûts, PnL, commissions) en € ;
 * — spreads en € par titre (unités du prix), sauf spreadPb en points de base ;
 * — tauxPb en points de base (1 pb = 0,01 %) ;
 * — slippage signé en € par titre : positif = coût, négatif = amélioration.
 * Aucun arrondi interne (les appelants arrondissent). Toutes les fonctions sont
 * verrouillées par des valeurs de référence vérifiées à la main dans calculs.test.ts —
 * les générateurs d'exercices DOIVENT composer ces fonctions, jamais recopier une formule.
 */

export type SensOrdre = 'achat' | 'vente';

export interface NiveauCarnet {
  prix: number;   // € par titre
  taille: number; // nombre de titres offerts à ce prix
}

export interface ResultatExecutionCarnet {
  prixMoyen: number;        // € par titre, pondéré par les quantités exécutées
  coutTotal: number;        // € (somme des quantités × prix de chaque niveau)
  niveauxConsommes: number; // nombre de niveaux entamés (le dernier peut l'être partiellement)
}

// ───────────────────────── Fourchette bid/ask ─────────────────────────

/** Spread absolu : ask − bid, en € par titre. */
export function spreadAbsolu(bid: number, ask: number): number {
  return ask - bid;
}

/** Milieu de fourchette : (bid + ask) / 2, en € par titre. */
export function milieuFourchette(bid: number, ask: number): number {
  return (bid + ask) / 2;
}

/** Spread relatif en points de base : (ask − bid) / milieu × 10 000. */
export function spreadPb(bid: number, ask: number): number {
  return (spreadAbsolu(bid, ask) / milieuFourchette(bid, ask)) * 10_000;
}

// ───────────────────────── Coûts d'exécution ─────────────────────────

/**
 * Coût d'une exécution immédiate (ordre au marché) par rapport au milieu, en € :
 * à l'achat on paie l'ask → quantite × (ask − milieu) ;
 * à la vente on touche le bid → quantite × (milieu − bid).
 * Pour une fourchette symétrique, c'est quantite × spread/2 dans les deux sens.
 */
export function coutTraverseeSpread(quantite: number, bid: number, ask: number, sens: SensOrdre): number {
  const milieu = milieuFourchette(bid, ask);
  return sens === 'achat' ? quantite * (ask - milieu) : quantite * (milieu - bid);
}

/**
 * « Marcher le carnet » : consommer les niveaux dans l'ordre donné jusqu'à
 * remplir `quantite`. Throw si la profondeur cumulée est insuffisante.
 */
export function executionCarnet(quantite: number, niveaux: NiveauCarnet[]): ResultatExecutionCarnet {
  let restant = quantite;
  let coutTotal = 0;
  let niveauxConsommes = 0;
  for (const niveau of niveaux) {
    if (restant <= 0) break;
    const executee = Math.min(restant, niveau.taille);
    coutTotal += executee * niveau.prix;
    restant -= executee;
    niveauxConsommes += 1;
  }
  if (restant > 0) {
    throw new Error(
      `Profondeur de carnet insuffisante : ${quantite} titres demandés, ${quantite - restant} disponibles.`,
    );
  }
  return { prixMoyen: coutTotal / quantite, coutTotal, niveauxConsommes };
}

/**
 * Slippage signé en € par titre (positif = coût) :
 * à l'achat, prixMoyenExecution − prixReference (payer plus cher coûte) ;
 * à la vente, prixReference − prixMoyenExecution (recevoir moins coûte).
 */
export function slippage(prixMoyenExecution: number, prixReference: number, sens: SensOrdre): number {
  return sens === 'achat' ? prixMoyenExecution - prixReference : prixReference - prixMoyenExecution;
}

// ───────────────────────── Économie des intermédiaires ─────────────────────────

/**
 * PnL d'un market maker, en € : chaque aller-retour capture le spread (en € par titre)
 * sur `taille` titres, net du coût de couverture (en € par titre).
 */
export function pnlMarketMaker(nbAllersRetours: number, taille: number, spread: number, coutCouverture: number): number {
  return nbAllersRetours * taille * (spread - coutCouverture);
}

/** Commission de courtage en € : max(notionnel × tauxPb / 10 000, minimum). */
export function commissionTotale(notionnel: number, tauxPb: number, minimum: number): number {
  return Math.max((notionnel * tauxPb) / 10_000, minimum);
}
