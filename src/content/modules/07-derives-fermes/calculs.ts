/**
 * Bibliothèque de référence du module Dérivés fermes : futures, FRA & swaps.
 *
 * CONVENTIONS (valables pour tout le fichier) :
 * — Taux et rendements en % (4 = 4 %) ; durées T en années ; aucun arrondi
 *   interne (les appelants arrondissent), sauf nombreContratsCouverture qui
 *   retourne un entier (on ne traite que des contrats entiers).
 * — Intérêts LINÉAIRES sur les horizons monétaires ≤ 1 an (forwards par portage,
 *   FRA, taux forward implicite) — cohérent avec interetMonetaire du m4 et les
 *   forwards FX/commodities du m6 ; composition ANNUELLE au-delà (facteurs
 *   d'actualisation, courbe zéro, swaps).
 * — Le forward d'un actif à revenu vaut « spot × (1 + (r − q)·T) » : le
 *   financement r renchérit le portage, le revenu q (dividendes, convenience
 *   yield) le réduit — c'est le cash and carry du m6, appliqué aux indices.
 * — Signes : long = +1, short = −1 ; un flux NÉGATIF est un décaissement.
 *   Le long futures gagne quand le prix monte ; le long FRA (payeur du taux
 *   fixe) gagne quand les taux montent.
 * — Notionnels suffixés « M » : en millions (10 = 10 000 000) ; reglementFra
 *   rend des unités de devise, valeurJambeFixe/valeurSwapPayeurFixe restent en M.
 *
 * Toutes les fonctions sont verrouillées par des valeurs de référence vérifiées
 * à la main dans calculs.test.ts — les générateurs d'exercices DEVRONT composer
 * ces fonctions, jamais recopier une formule.
 */

// ───────────────────────── Forwards & futures sur indice ─────────────────────────

/**
 * Prix forward d'un indice par le coût de portage, en linéaire :
 * F = S × (1 + (r − q)/100 × T), r le taux de financement, q le rendement du
 * dividende. r > q ⇒ F > S (report) ; q > r ⇒ F < S (déport).
 * Ex. (5000, 4, 2, 1) = 5000 × 1,02 = 5100.
 */
export function prixForwardIndice(spot: number, rPct: number, qPct: number, annees: number): number {
  return spot * (1 + ((rPct - qPct) / 100) * annees);
}

/**
 * P&L d'une position futures soldée : (sortie − entrée) × multiplicateur ×
 * nbContrats × sens (long = +1, short = −1). Jeu à somme nulle : le gain du
 * long est exactement la perte du short.
 */
export function pnlFutures(prixEntree: number, prixSortie: number, multiplicateur: number, nbContrats: number, sens: number): number {
  return (prixSortie - prixEntree) * multiplicateur * nbContrats * sens;
}

/**
 * Marge de variation : flux QUOTIDIEN signé du mark-to-market,
 * (prixJour − prixVeille) × multiplicateur × nbContrats × sens.
 * Négatif = le compte est débité ce soir-là ; la somme des marges de variation
 * sur la vie de la position redonne pnlFutures (le P&L est juste étalé jour par jour).
 */
export function margeVariation(prixVeille: number, prixJour: number, multiplicateur: number, nbContrats: number, sens: number): number {
  return (prixJour - prixVeille) * multiplicateur * nbContrats * sens;
}

/**
 * Appel de marge, convention futures US (documentée ici car elle surprend) :
 * tant que solde ≥ margeMaintenance, aucun appel ; si solde < margeMaintenance
 * (strictement), le membre doit reverser de quoi REVENIR À LA MARGE INITIALE
 * — pas seulement à la maintenance : versement = margeInitiale − solde.
 * Ex. (4200, 4500, 6000) = 1800 ; (4800, 4500, 6000) = 0.
 */
export function appelDeMarge(solde: number, margeMaintenance: number, margeInitiale: number): number {
  return solde < margeMaintenance ? margeInitiale - solde : 0;
}

/**
 * Effet de levier de la marge : variation en % de la MISE (le dépôt de marge)
 * pour une variation du spot, = variationSpotPct/(margeInitialePct/100).
 * Marge 10 % ⇒ levier ×10 : +2 % de spot fait +20 % sur la mise — et −12 %
 * fait −120 % : la mise est perdue et il faut remettre au pot (la ruine
 * au-delà de la marge).
 */
export function effetLevier(variationSpotPct: number, margeInitialePct: number): number {
  return variationSpotPct / (margeInitialePct / 100);
}

// ───────────────────────── Taux à terme & FRA ─────────────────────────

/**
 * Taux forward implicite entre t1 et t2 (boucle sur m4 ch5), en LINÉAIRE
 * (convention monétaire ≤ 1 an, contrairement au tauxForward composé du m4) :
 * f = [(1 + r2/100·t2)/(1 + r1/100·t1) − 1]/(t2 − t1) × 100.
 * Le facteur de la période (t1, t2) est le ratio des facteurs linéaires, puis
 * on annualise linéairement. Subtilité du linéaire : une courbe monétaire
 * PLATE donne un forward légèrement SOUS le taux plat (le linéaire ne compose pas).
 */
export function tauxForwardImplicite(r1Pct: number, t1: number, r2Pct: number, t2: number): number {
  const facteur = (1 + (r2Pct / 100) * t2) / (1 + (r1Pct / 100) * t1);
  return ((facteur - 1) / (t2 - t1)) * 100;
}

/**
 * Règlement différentiel d'un FRA, reçu par le LONG (payeur du taux fixe) :
 * notionnelM × 1e6 × (constaté − FRA)/100 × fraction, ACTUALISÉ au taux
 * constaté (convention FRA, documentée : le différentiel est payé en DÉBUT de
 * période d'intérêt, on le ramène donc de la fin à ce début en divisant par
 * (1 + constaté/100 × fraction)). Le long gagne si les taux montent.
 * Ex. (10, 3, 4, 0.5) = 10 000 000 × 0,01 × 0,5/1,02 = 49 019,61.
 * Notionnel en millions ; résultat en unités de devise.
 */
export function reglementFra(notionnelM: number, tauxFraPct: number, tauxConstatePct: number, fractionAnnee: number): number {
  const differentiel = notionnelM * 1e6 * ((tauxConstatePct - tauxFraPct) / 100) * fractionAnnee;
  return differentiel / (1 + (tauxConstatePct / 100) * fractionAnnee);
}

// ───────────────────────── Courbe zéro & swaps de taux ─────────────────────────

/**
 * Facteur d'actualisation zéro-coupon en composition ANNUELLE (horizon > 1 an,
 * cohérent avec va() du m4) : df = 1/(1 + z/100)^T.
 * Ex. (4, 2) = 1/1,04² = 0,924556.
 */
export function facteurActualisation(tauxZeroPct: number, annees: number): number {
  return 1 / (1 + tauxZeroPct / 100) ** annees;
}

/**
 * Taux de swap paritaire (paiements annuels) : le taux fixe qui annule la
 * valeur du swap à l'initiation. tauxZerosPct[i] est le taux zéro du pilier
 * i+1 ans ; taux = (1 − df_n)/Σ df_i × 100.
 * C'est une moyenne pondérée de la courbe ; courbe plate r ⇒ taux = r exactement.
 */
export function tauxSwapParitaire(tauxZerosPct: number[]): number {
  const dfs = tauxZerosPct.map((z, i) => facteurActualisation(z, i + 1));
  const somme = dfs.reduce((a, b) => a + b, 0);
  return ((1 - dfs[dfs.length - 1]) / somme) * 100;
}

/**
 * Valeur de la jambe fixe d'un swap (paiements annuels), en M :
 * Σ coupons fixes actualisés + notionnel actualisé — c'est le prix d'une
 * obligation au taux de coupon tauxFixePct sur la courbe zéro.
 * Coupon égal au taux d'une courbe plate ⇒ vaut le pair (notionnelM) exactement.
 */
export function valeurJambeFixe(tauxFixePct: number, tauxZerosPct: number[], notionnelM: number): number {
  const dfs = tauxZerosPct.map((z, i) => facteurActualisation(z, i + 1));
  const somme = dfs.reduce((a, b) => a + b, 0);
  return notionnelM * (tauxFixePct / 100) * somme + notionnelM * dfs[dfs.length - 1];
}

/**
 * Valeur d'un swap pour le PAYEUR du fixe, en M : la jambe variable vaut le
 * pair (notionnel) juste après fixing ⇒ valeur = notionnelM − valeurJambeFixe.
 * Au taux paritaire, la valeur est nulle ; payer un fixe au-dessus du pair
 * coûte (valeur négative), en dessous rapporte.
 */
export function valeurSwapPayeurFixe(tauxFixePct: number, tauxZerosPct: number[], notionnelM: number): number {
  return notionnelM - valeurJambeFixe(tauxFixePct, tauxZerosPct, notionnelM);
}

// ───────────────────────── Couverture ─────────────────────────

/**
 * Nombre de contrats futures pour couvrir une exposition (couverture 1 pour 1,
 * bêta = 1) : N = exposition × 1e6/(prixFutures × multiplicateur), ARRONDI
 * STANDARD au plus proche entier (Math.round : 24,4 → 24 ; 24,68 → 25 ;
 * un ,5 exact monte) — on ne peut traiter que des contrats entiers.
 * Ex. (25, 5000, 10) = 25 000 000/50 000 = 500.
 */
export function nombreContratsCouverture(expositionM: number, prixFutures: number, multiplicateur: number): number {
  return Math.round((expositionM * 1e6) / (prixFutures * multiplicateur));
}
