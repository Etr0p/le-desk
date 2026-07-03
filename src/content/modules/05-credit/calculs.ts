/**
 * Bibliothèque de référence du module Crédit.
 *
 * CONVENTIONS (valables pour tout le fichier) :
 * — Pourcentages partout (5 = 5 %) ; aucun arrondi interne (les appelants
 *   arrondissent). Les spreads se RENDENT et se PASSENT en points de base
 *   (100 pb = 1 %) — la langue du desk crédit.
 * — Le recouvrement R est un % du NOMINAL (convention marché : R ≈ 40 % pour
 *   du senior unsecured) ; la perte en cas de défaut est LGD = 100 − R.
 * — Les probabilités de défaut sont ANNUELLES en % ; la composition de la
 *   survie est DISCRÈTE annuelle (1 − PD)^n, alignée sur le m4/m10/m11 —
 *   PAS d'intensité continue ici (réservée au GoFurther du ch3).
 * — Les notionnels CDS se passent en MILLIONS ; la prime annuelle se rend
 *   en EUROS, le paiement contingent en MILLIONS (comme le m7 pour les FRA).
 * — Les tranches se décrivent par leurs points d'ATTACHE et de DÉTACHEMENT
 *   en % du portefeuille ; la perte d'une tranche se rend en % de SON
 *   notionnel, bornée à [0, 100].
 * — Le pont quantitatif avec le m4 (duration, prix d'obligation sans risque)
 *   et le m10 s'IMPORTE depuis ces modules quand il s'agit de TAUX ; les
 *   fonctions ci-dessous ne traitent que la dimension SPREAD/DÉFAUT.
 *
 * Toutes les fonctions sont verrouillées dans calculs.test.ts par des valeurs
 * de référence vérifiées à la main : spread(5,5, 3,5) = 200 pb ; EL(PD 2 %,
 * R 40 %) = 1,2 % ⇒ spread théorique 120 pb ; PD implicite(300 pb, R 40 %)
 * = 5 % ; survie(PD 2 %, 5 ans) = 90,392080 % ; prix(coupon 5, r 3, s 200 pb,
 * 5 ans) = 100 exactement (coupon au rendement ⇒ pair) ; ΔP(D 4,5, +50 pb)
 * = −2,25 % ; tranche 3-6 % avec 5 % de pertes = 66,666667 % ; rendement net
 * (7 %, PD 3 %, R 40 %) = 5,2 %. Les générateurs d'exercices DEVRONT composer
 * ces fonctions, jamais recopier une formule.
 */

// ───────────────────────── Le spread : le prix du risque ─────────────────────────

/**
 * Spread de crédit en POINTS DE BASE : (rendement de l'obligation risquée −
 * rendement sans risque de même maturité)·100. Le thermomètre du module :
 * (5,5, 3,5) = 200 pb. Repères à réciter : corporate IG euro 80-150 pb en
 * temps calme, high yield 300-500 pb, distressed > 1 000 pb ; iTraxx Main
 * ~50-80 pb, Crossover ~250-400 pb. C'est LE nombre que le m11 regardait
 * s'envoler dans chaque crise — ici on apprend à le lire en temps de paix.
 */
export function spreadCreditPb(rendementObligationPct: number, rendementSansRisquePct: number): number {
  return (rendementObligationPct - rendementSansRisquePct) * 100;
}

/**
 * Perte attendue annuelle en % du nominal : EL = PD × LGD = PD × (1 − R/100).
 * La formule centrale du module — trois lettres qui résument tout le métier :
 * combien je m'attends à perdre par an en portant ce nom. (PD 2 %, R 40 %)
 * = 1,2 %. C'est une ESPÉRANCE : l'année réelle donne 0 ou −60, jamais −1,2
 * — d'où la prime de risque au-dessus de l'EL dans les spreads observés.
 */
export function perteAttenduePct(pdAnnuellePct: number, tauxRecouvrementPct: number): number {
  return pdAnnuellePct * (1 - tauxRecouvrementPct / 100);
}

/**
 * Spread « actuariel » théorique en pb : la perte attendue convertie en pb,
 * spread ≈ PD × LGD. (PD 2 %, R 40 %) = 120 pb. Le spread observé est
 * SYSTÉMATIQUEMENT au-dessus (prime de risque, de liquidité, fiscalité) :
 * l'écart spread de marché − spread actuariel est la rémunération du stress,
 * pas du défaut moyen — le « credit risk premium puzzle » du ch3.
 */
export function spreadTheoriquePb(pdAnnuellePct: number, tauxRecouvrementPct: number): number {
  return perteAttenduePct(pdAnnuellePct, tauxRecouvrementPct) * 100;
}

/**
 * Probabilité de défaut annuelle IMPLICITE dans un spread, en % :
 * PD = spread / LGD = (spread/100) / (1 − R/100). La lecture inverse, celle
 * du desk : « le marché price quoi ? ». (300 pb, R 40 %) = 5 %/an.
 * C'est une PD RISQUE-NEUTRE : elle surestime la fréquence historique des
 * défauts précisément parce que le spread contient une prime de risque.
 */
export function pdImplicitePct(spreadPb: number, tauxRecouvrementPct: number): number {
  return (spreadPb / 100) / (1 - tauxRecouvrementPct / 100);
}

// ───────────────────────── Survie et défaut cumulés ─────────────────────────

/**
 * Probabilité de SURVIE cumulée sur n années, en % : 100·(1 − PD)^n,
 * composition discrète annuelle. (PD 2 %, 5 ans) = 90,392080 %. Le piège
 * classique : la survie ne décroît PAS linéairement — survivre 10 ans à
 * PD 5 % n'a rien de « 50/50 », c'est 59,873694 %.
 */
export function probaSurvieCumuleePct(pdAnnuellePct: number, annees: number): number {
  return 100 * Math.pow(1 - pdAnnuellePct / 100, annees);
}

/**
 * Probabilité de DÉFAUT cumulée sur n années, en % : 100 − survie cumulée.
 * (PD 2 %, 5 ans) = 9,607920 % — et PAS 10 % (l'erreur additive n×PD, piège
 * n° 1 du chapitre 3) ; (PD 5 %, 10 ans) = 40,126306 % et non 50 %.
 * L'écart grandit avec l'horizon : les défauts ne s'additionnent pas,
 * ils se composent — il faut être vivant pour mourir.
 */
export function probaDefautCumuleePct(pdAnnuellePct: number, annees: number): number {
  return 100 - probaSurvieCumuleePct(pdAnnuellePct, annees);
}

// ───────────────────────── Pricing de l'obligation risquée ─────────────────────────

/**
 * Prix d'une obligation risquée (coupon annuel, remboursement au pair 100) :
 * actualisation de tous les flux au rendement y = taux sans risque + spread.
 * C'est la méthode « spread sur la courbe » du desk — le défaut est DANS le
 * taux d'actualisation, pas dans les flux. (coupon 5, r 3, s 200 pb, 5 ans)
 * = 100 exactement (coupon = rendement ⇒ pair, l'ancre mentale du m4) ;
 * (coupon 4, r 3, s 200 pb, 5 ans) = 95,670523 ; le même sans spread vaut
 * 104,579707 — le spread « coûte » 8,909184 points de prix ici.
 */
export function prixObligationRisquee(couponPct: number, tauxSansRisquePct: number, spreadPb: number, maturiteAnnees: number): number {
  const y = (tauxSansRisquePct + spreadPb / 100) / 100;
  let prix = 0;
  for (let t = 1; t <= maturiteAnnees; t++) {
    prix += couponPct / Math.pow(1 + y, t);
  }
  prix += 100 / Math.pow(1 + y, maturiteAnnees);
  return prix;
}

/**
 * Variation de prix due à un mouvement de SPREAD, en % : −D_mod × Δs/100,
 * Δs en pb. La spread duration : même arithmétique que la duration du m4,
 * mais le choc vient du crédit, pas des taux. (D 4,5, +50 pb) = −2,25 % ;
 * (D 7, +300 pb — un écartement type crise) = −21 %. C'est pour ça qu'un
 * portefeuille HY long peut perdre comme une action : le spread EST une
 * classe de risque à part entière, avec sa propre duration.
 */
export function variationPrixSpreadPct(durationModifiee: number, variationSpreadPb: number): number {
  return -durationModifiee * variationSpreadPb / 100;
}

/**
 * Rendement net des défauts d'un portefeuille obligataire, en % :
 * rendement nominal − PD × LGD. L'arithmétique de l'investisseur high yield :
 * (7 %, PD 3 %, R 40 %) = 5,2 % — le portefeuille « rapporte » 7 mais PAIE
 * 1,8 de pertes de crédit attendues. Comparer ce net au sans-risque, jamais
 * le brut : un HY à 7 % avec 5 % de défauts attendus rapporte MOINS qu'une
 * OAT à 3 % (7 − 3 = 4 %). Le piège du « gros coupon » démonté au ch7.
 */
export function rendementNetDefautsPct(rendementNominalPct: number, pdAnnuellePct: number, tauxRecouvrementPct: number): number {
  return rendementNominalPct - perteAttenduePct(pdAnnuellePct, tauxRecouvrementPct);
}

// ───────────────────────── CDS : le risque de crédit détaché de l'obligation ─────────────────────────

/**
 * Prime annuelle (jambe fixe) d'un CDS en EUROS : notionnel (en millions) ×
 * spread en pb. (10 M, 200 pb) = 200 000 € par an, payés trimestriellement
 * par l'acheteur de protection tant que l'entité de référence survit.
 * L'ordre de grandeur à avoir en tête : 100 pb = 0,1 M€ par an pour 10 M
 * de notionnel — la protection se compte en dixièmes de pour cent.
 */
export function primeCdsAnnuelleEur(notionnelMillions: number, spreadPb: number): number {
  return notionnelMillions * 1e6 * (spreadPb / 10000);
}

/**
 * Paiement contingent (jambe de protection) d'un CDS au défaut, en MILLIONS :
 * notionnel × (1 − R/100). Le vendeur de protection paie la PERTE, pas le
 * notionnel : (10 M, R 40 %) = 6 M. Le règlement se fait par enchère ISDA
 * (cash settlement) — l'enchère FIXE le recouvrement, comme Lehman à 8,625 %
 * en octobre 2008 (les vendeurs ont payé 91,375 % du notionnel).
 */
export function paiementDefautCdsMillions(notionnelMillions: number, tauxRecouvrementPct: number): number {
  return notionnelMillions * (1 - tauxRecouvrementPct / 100);
}

/**
 * Base CDS-cash en pb : spread CDS − spread de l'obligation. Négative
 * (CDS 180, cash 200 ⇒ −20 pb) : la protection coûte MOINS que le spread
 * encaissé — acheter l'obligation + le CDS verrouille en théorie un gain
 * sans risque de crédit, le « negative basis trade ». En théorie : le trade
 * se finance en repo et meurt d'un appel de marge avant de converger —
 * c'est le basis trade qui dérape du m7 et de LTCM au m11.
 */
export function baseCdsPb(spreadCdsPb: number, spreadObligationPb: number): number {
  return spreadCdsPb - spreadObligationPb;
}

// ───────────────────────── Titrisation : découper le risque en tranches ─────────────────────────

/**
 * Perte d'une tranche en % de SON notionnel, pour une perte du portefeuille
 * sous-jacent L (en % du pool) et des points d'attache A et de détachement D :
 * clamp((L − A)/(D − A))·100 dans [0, 100]. La mezzanine 3-6 % : intacte à
 * L = 2 % (0 %), aux deux tiers détruite à L = 5 % (66,666667 %), rasée à
 * L = 8 % (100 %). L'equity 0-3 % : rasée dès 3 % de pertes ; à L = 1,5 %,
 * moitié détruite (50 %). TOUT l'effet de la titrisation est dans ce clamp :
 * la tranche transforme une perte continue en falaise — le levier sans
 * emprunt, et la raison pour laquelle un AAA de CDO pouvait passer de 100 à
 * 30 sans qu'aucun défaut n'ait encore eu lieu (m11 ch5).
 */
export function perteTranchePct(pertePortefeuillePct: number, attachePct: number, detachementPct: number): number {
  const part = ((pertePortefeuillePct - attachePct) / (detachementPct - attachePct)) * 100;
  return Math.min(100, Math.max(0, part));
}
