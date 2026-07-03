/**
 * Bibliothèque de référence du module Histoire & crises financières.
 *
 * CONVENTIONS (valables pour tout le fichier) :
 * — Pourcentages partout (5 = 5 %) ; aucun arrondi interne (les appelants
 *   arrondissent). Les spreads se RENDENT en points de base (100 pb = 1 %).
 * — Le levier est un multiple SANS UNITÉ (actifs/fonds propres) : levier 25
 *   signifie 25 € d'actifs pour 1 € de fonds propres.
 * — Une PERTE se passe en magnitude POSITIVE (50 = « −50 % ») aux fonctions
 *   de récupération (gainRequisPourRecuperer, anneesDeRecuperation) ; les
 *   drawdowns et impacts de levier se RENDENT en signé (négatif = perte),
 *   la convention des écrans de marché.
 * — Décotes et haircuts en % de la valeur de marché ; la composition est
 *   DISCRÈTE annuelle (1 + g)^n, alignée sur le m4/m10 — PAS de continu ici.
 * — Le pont quantitatif avec le m10 (duration ⇒ perte SVB) et le m7 (appels
 *   de marge) s'IMPORTE depuis ces modules, jamais recopié.
 *
 * Toutes les fonctions sont verrouillées dans calculs.test.ts par des valeurs
 * de référence vérifiées à la main : DJIA 1929-32 (381,17 → 41,22) =
 * −89,185928 % ; gain requis après −50 % = +100 % ; récupération de −50 % à
 * 7 %/an = 10,244768 ans ; levier 25 ⇒ −4 % d'actifs suffisent ; haircut 2 %
 * ⇒ levier maximal 50. Les générateurs d'exercices DEVRONT composer ces
 * fonctions, jamais recopier une formule.
 */

// ───────────────────────── Le levier : l'accélérateur de toutes les crises ─────────────────────────

/**
 * Levier de bilan : actifs totaux / fonds propres, multiple sans unité.
 * LA variable commune à toutes les catastrophes du module : 10 pour un
 * spéculateur de 1929 sur call loans, ~25-30 pour LTCM en 1998, >30 pour
 * Lehman en 2007, ~1 (pas de levier) pour l'investisseur au comptant.
 * Ex. (2500, 100) = 25 ; (100, 100) = 1.
 */
export function levierBilan(totalActifs: number, fondsPropres: number): number {
  return totalActifs / fondsPropres;
}

/**
 * Impact d'une variation d'actifs sur les fonds propres : levier × variation,
 * en % SIGNÉ. C'est la formule du malheur : au levier 25, −4 % d'actifs
 * effacent −100 % des fonds propres ; au levier 10 (1929), −10 % suffisent.
 * Elle marche aussi à la hausse — c'est pour ça qu'on se levier : (25, +2) =
 * +50 % — et c'est l'asymétrie comportementale de toutes les bulles.
 */
export function impactLevierSurFondsPropres(levier: number, variationActifsPct: number): number {
  return levier * variationActifsPct;
}

/**
 * Variation d'actifs FATALE : le choc (négatif, en %) qui efface exactement
 * les fonds propres, −100/levier. La distance à la mort d'un bilan : levier
 * 25 ⇒ −4 % ; levier 30 ⇒ −3,333333 % ; levier 1 ⇒ −100 % (il faut que tout
 * tombe à zéro : le comptant ne fait jamais faillite par les prix).
 */
export function variationActifsFatale(levier: number): number {
  return -100 / levier;
}

// ───────────────────────── Drawdowns : mesurer la catastrophe ─────────────────────────

/**
 * Drawdown pic-à-creux : (creux/pic − 1)·100, en % signé (négatif).
 * La carte d'identité chiffrée de chaque krach : DJIA 381,17 → 41,22
 * (1929-1932) = −89,185928 % ; Nasdaq 5 048,62 → 1 114,11 (2000-2002) =
 * −77,932385 % ; S&P 500 1 565,15 → 676,53 (2007-2009) = −56,775389 % ;
 * COVID 3 386,15 → 2 237,40 (fév.-mars 2020) = −33,924959 %.
 */
export function drawdownPct(pic: number, creux: number): number {
  return (creux / pic - 1) * 100;
}

/**
 * Gain requis pour récupérer une perte : (100/(100 − perte) − 1)·100, perte
 * en magnitude POSITIVE. L'asymétrie des pertes, le piège d'arithmétique le
 * plus rentable en entretien : −50 % exige +100 %, −89 % (le DJIA de 1932)
 * exige +809,090909 %, et −22,6 % (le lundi noir de 1987) « seulement »
 * +29,198966 %. D'où les 25 ans du Dow pour revoir son pic de 1929.
 */
export function gainRequisPourRecuperer(perteMagnitudePct: number): number {
  return (100 / (100 - perteMagnitudePct) - 1) * 100;
}

/**
 * Années de récupération d'une perte à croissance composée constante :
 * ln(1/(1 − perte)) / ln(1 + g), perte en magnitude positive, g en %/an.
 * Ex. récupérer −50 % à 7 %/an = 10,244768 ans ; −89 % à 7 %/an =
 * 32,623692 ans — l'ordre de grandeur des 25 ans du Dow (dividendes et
 * déflation compris, la réalité fut un peu plus clémente que le prix seul).
 * Perte nulle ⇒ 0 an.
 */
export function anneesDeRecuperation(perteMagnitudePct: number, croissanceAnnuellePct: number): number {
  return Math.log(1 / (1 - perteMagnitudePct / 100)) / Math.log(1 + croissanceAnnuellePct / 100);
}

// ───────────────────────── Repo, haircuts et la course au financement ─────────────────────────

/**
 * Financement obtenu en repo contre des titres : valeur·(1 − haircut), le
 * prêteur garde le haircut comme coussin. Ex. (100, 2) = 98. Le run de 2008
 * ne fut pas une ruée aux guichets mais une ruée SUR CE NOMBRE : quand le
 * haircut sur un même portefeuille passe de 2 % à 25 %, le financement fond
 * de 98 à 75 — il faut trouver 23 tout de suite ou vendre.
 */
export function financementRepo(valeurTitres: number, haircutPct: number): number {
  return valeurTitres * (1 - haircutPct / 100);
}

/**
 * Levier maximal permis par un haircut : 100/haircut. Avec 1 de capital et
 * un haircut h, chaque tour de repo re-nantit le reste : à la limite, actifs
 * = capital/h. Haircut 2 % ⇒ levier 50 ; 10 % ⇒ 10 ; 50 % ⇒ 2. C'est la
 * mécanique qui a permis à LTCM (haircuts négociés quasi nuls) de porter
 * plus de 125 Md$ d'actifs sur moins de 5 Md$ de capital.
 */
export function levierMaximalRepo(haircutPct: number): number {
  return 100 / haircutPct;
}

/**
 * Vente forcée : la valeur de marché PRÉ-DÉCOTE à vendre pour lever un
 * montant de cash sous une décote de liquidation d : besoin/(1 − d).
 * Ex. lever 95 avec une décote de 5 % oblige à vendre 100. C'est le moteur
 * de la spirale : vendre déprime les prix, la décote augmente, il faut
 * vendre plus — 1987 (assurance de portefeuille), 2008 (CDO), 2022 (gilts).
 */
export function venteForceePourCash(besoinCash: number, decoteLiquidationPct: number): number {
  return besoinCash / (1 - decoteLiquidationPct / 100);
}

// ───────────────────────── Runs bancaires et dette souveraine ─────────────────────────

/**
 * Taux de couverture des dépôts par les actifs liquides : liquide/dépôts·100.
 * La solvabilité ne protège pas d'un run : une banque à 25 % de couverture
 * meurt si plus d'un quart des dépôts part — et en mars 2023, SVB a vu
 * partir 42 Md$ en UNE journée (un quart de ses dépôts), à la vitesse d'une
 * app mobile. Ex. (25, 100) = 25 % ; (120, 100) = 120 % (narrow bank).
 */
export function tauxCouvertureDepots(actifsLiquides: number, depotsExigibles: number): number {
  return (actifsLiquides / depotsExigibles) * 100;
}

/**
 * Charge d'intérêts d'un État en % du PIB : (dette/PIB)·taux moyen/100.
 * L'arithmétique de la doom loop souveraine : à 180 % de dette/PIB (Grèce
 * 2011), chaque point de taux coûte 1,8 point de PIB — à 5 %, le service de
 * la dette absorbe 9 % du PIB avant le premier euro de dépense. Ex. (180, 5)
 * = 9 ; (120, 1,5) = 1,8 (l'Italie sous QE : la même dette, soutenable).
 */
export function chargeInteretsDette(detteSurPibPct: number, tauxMoyenPct: number): number {
  return (detteSurPibPct * tauxMoyenPct) / 100;
}

/**
 * Spread souverain en POINTS DE BASE : (taux − taux de référence)·100.
 * Le thermomètre de la crise de l'euro, coté contre le Bund : l'OAT vit à
 * 30-60 pb, l'Italie 2011 a dépassé 500 pb, la Grèce 2012 a coté plus de
 * 3 000 pb — (35, 1,5) = 3 350 pb, des niveaux qui SONT le défaut anticipé.
 * Négatif si le pays emprunte moins cher que la référence.
 */
export function spreadSouverainPb(tauxPaysPct: number, tauxReferencePct: number): number {
  return (tauxPaysPct - tauxReferencePct) * 100;
}
