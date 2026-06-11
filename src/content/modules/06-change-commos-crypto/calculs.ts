/**
 * Bibliothèque de référence du module Change, matières premières & crypto.
 *
 * CONVENTIONS (valables pour tout le fichier) :
 * — Taux, coûts et rendements en % (8 = 8 %) ; durées T en années ; aucun arrondi
 *   interne (les appelants arrondissent).
 * — Cotation FX : une paire s'écrit BASE/COTÉE. EUR/USD = 1,10 signifie
 *   1 EUR (devise de BASE) = 1,10 USD (devise COTÉE) : le cours est le prix
 *   d'une unité de base, exprimé en devise cotée.
 * — Parité des taux d'intérêt couverte en LINÉAIRE ACTUARIEL SIMPLE (convention
 *   marché monétaire FX) : F = S × (1 + r_cotée·T)/(1 + r_base·T). La devise au
 *   taux le plus BAS se revalorise à terme — le forward compense exactement le
 *   différentiel de portage (sinon arbitrage cash and carry).
 * — 1 pip = 0,0001 unité de cours (paires cotées à 4 décimales).
 *
 * Toutes les fonctions sont verrouillées par des valeurs de référence vérifiées
 * à la main dans calculs.test.ts — les générateurs d'exercices DEVRONT composer
 * ces fonctions, jamais recopier une formule.
 */

// ───────────────────────── Change au comptant et à terme ─────────────────────────

/**
 * Forward FX par la parité des taux d'intérêt couverte, en linéaire simple :
 * F = S × (1 + r_cotée/100 × T)/(1 + r_base/100 × T).
 * Ex. EUR/USD : r_cotée = taux USD (devise cotée), r_base = taux EUR (devise de base).
 * r_cotée > r_base ⇒ F > S (la base cote en report) ; différentiel nul ⇒ F = S.
 */
export function forwardFx(spot: number, rCoteePct: number, rBasePct: number, annees: number): number {
  return spot * (1 + (rCoteePct / 100) * annees) / (1 + (rBasePct / 100) * annees);
}

/**
 * Points de terme (points de swap) en pips : (F − S) × 10 000.
 * Positifs ⇒ report (la base cote à terme PLUS cher qu'au comptant),
 * négatifs ⇒ déport.
 */
export function pointsDeTerme(spot: number, forward: number): number {
  return (forward - spot) * 10_000;
}

// ───────────────────────── Parité des pouvoirs d'achat ─────────────────────────

/**
 * Taux de change PPA implicite « à la Big Mac » : prix du même panier dans les
 * deux devises. prixDomestique est le prix en devise COTÉE, prixEtranger le prix
 * en devise de BASE ⇒ PPA = prixDomestique/prixEtranger, homogène au cours
 * BASE/COTÉE (ex. panier à 5,80 USD et 5,00 EUR ⇒ PPA EUR/USD = 1,16).
 */
export function tauxPpa(prixDomestique: number, prixEtranger: number): number {
  return prixDomestique / prixEtranger;
}

/**
 * Écart du spot à sa valeur PPA : (spot/ppa − 1) × 100, en %.
 * SENS (vérifié à la main) : le résultat mesure la valorisation de la devise de
 * BASE par rapport à la parité. Spot < PPA ⇒ résultat NÉGATIF ⇒ la base est
 * SOUS-évaluée (1 unité de base achète moins de devise cotée que la PPA ne le
 * justifie) — et la devise cotée, symétriquement, est SURévaluée. Spot > PPA ⇒
 * base SURévaluée. Ex. spot EUR/USD 1,10 vs PPA 1,16 ⇒ −5,17 % : l'euro est
 * sous-évalué de 5,17 % (le dollar surévalué).
 */
export function surSousEvaluation(spot: number, ppa: number): number {
  return (spot / ppa - 1) * 100;
}

// ───────────────────────── Carry trade ─────────────────────────

/**
 * P&L à 1 an d'un carry trade : on emprunte la devise de financement à
 * rFinancement, on place en devise cible à rCible.
 * P&L = notionnel × [(rCible − rFinancement)/100 + variationChange/100].
 * variationChangePct : variation du cours de la devise CIBLE contre la devise de
 * financement, POSITIVE si la cible s'apprécie. Une dépréciation brutale de la
 * cible (variation très négative) efface le carry : c'est le crash du carry trade.
 */
export function pnlCarryTrade(notionnel: number, rCiblePct: number, rFinancementPct: number, variationChangePct: number): number {
  return notionnel * ((rCiblePct - rFinancementPct) / 100 + variationChangePct / 100);
}

// ───────────────────────── Matières premières ─────────────────────────

/**
 * Forward d'une matière première par le coût de portage, en linéaire :
 * F = S × (1 + (financement + stockage − convenience)/100 × T).
 * Financement et stockage renchérissent le terme ; le convenience yield (valeur
 * de détenir le physique) le réduit. Coût de portage net > 0 ⇒ F > S (contango) ;
 * convenience dominant ⇒ F < S (backwardation).
 */
export function forwardCommodity(spot: number, financementPct: number, stockagePct: number, conveniencePct: number, annees: number): number {
  return spot * (1 + ((financementPct + stockagePct - conveniencePct) / 100) * annees);
}

/**
 * Rendement de roulement annualisé d'une position LONGUE qu'on roule :
 * (prixProche/prixLointain − 1)/années × 100, en %.
 * SENS (vérifié à la main) : au roll, on VEND le contrat proche et on RACHÈTE le
 * lointain. En contango (proche < lointain) on vend moins cher qu'on rachète ⇒
 * roll yield NÉGATIF (l'érosion des trackers matières premières) ; en
 * backwardation (proche > lointain) ⇒ roll yield POSITIF.
 */
export function rollYieldAnnualise(prixProche: number, prixLointain: number, anneesEntreEcheances: number): number {
  return (prixProche / prixLointain - 1) / anneesEntreEcheances * 100;
}

/**
 * Base = spot − futures. Négative en contango, positive en backwardation ;
 * elle converge vers 0 à l'échéance (futures → spot).
 */
export function baseFutures(spot: number, futures: number): number {
  return spot - futures;
}

// ───────────────────────── Microstructure FX ─────────────────────────

/**
 * Coût d'un aller-retour au spread bid/ask : montant × (ask − bid)/milieu,
 * avec milieu = (bid + ask)/2. C'est le spread relatif appliqué au montant
 * traité — le coût de friction d'un achat immédiatement suivi d'une revente,
 * exprimé dans la devise du montant (devise cotée pour un notionnel converti).
 * Ex. : 1 M sur 1,0998/1,1002 (4 pips, milieu 1,1000) ⇒ 1 M × 0,0004/1,10 ≈ 363,64.
 */
export function coutSpreadFx(montant: number, bid: number, ask: number): number {
  const milieu = (bid + ask) / 2;
  return montant * (ask - bid) / milieu;
}

// ───────────────────────── Performance ─────────────────────────

/**
 * Taux de variation COMPOSÉ annualisé (CAGR) entre deux valeurs :
 * ((valeurFin/valeurDebut)^(1/années) − 1) × 100, en %.
 * Ex. 100 → 121 en 2 ans ⇒ 10 % exactement (et non 10,5 % en moyenne arithmétique).
 */
export function variationAnnualiseePct(valeurDebut: number, valeurFin: number, annees: number): number {
  return ((valeurFin / valeurDebut) ** (1 / annees) - 1) * 100;
}
