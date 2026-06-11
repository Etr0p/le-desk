/**
 * Bibliothèque de référence du module Actions & indices.
 * Conventions : taux, croissances et rendements en % (8 = 8 %), montants et prix en €,
 * quantités en nombre de titres. Aucun arrondi interne (les appelants arrondissent).
 * Toutes les fonctions sont verrouillées par des valeurs de référence vérifiées à la main
 * dans calculs.test.ts — les générateurs d'exercices DEVRONT composer ces fonctions,
 * jamais recopier une formule.
 */

// ───────────────────────── Modèles de dividendes (DDM) ─────────────────────────

/**
 * Gordon-Shapiro : P₀ = D₁ / (r − g), avec D₁ le dividende attendu dans un an.
 * r et g en %. Exige r > g : sinon la perpétuité croissante diverge (somme infinie).
 */
export function gordon(d1: number, rPct: number, gPct: number): number {
  if (rPct <= gPct) {
    throw new Error(
      `Gordon-Shapiro exige r > g : r = ${rPct} % ≤ g = ${gPct} % (la perpétuité croissante diverge).`,
    );
  }
  return d1 / ((rPct - gPct) / 100);
}

/**
 * Valeur terminale de Gordon, exprimée EN VALEUR À L'ANNÉE n :
 * VTₙ = fluxₙ × (1 + g) / (r − g) — c'est Gordon appliqué au flux de l'année n+1.
 * L'appelant doit encore l'actualiser de n années pour revenir en t = 0.
 */
export function valeurTerminaleGordon(fluxN: number, gPct: number, rPct: number): number {
  return gordon(fluxN * (1 + gPct / 100), rPct, gPct);
}

/**
 * DDM deux étapes : dividendes croissant à g1 pendant n1 ans (D₁ = d0 × (1+g1)),
 * puis croissance perpétuelle à g2. P₀ = Σ VA(D₁..Dₙ₁) + VA(VTₙ₁), où la valeur
 * terminale est Gordon sur D_{n1+1} = Dₙ₁ × (1 + g2). Exige r > g2 (phase terminale).
 */
export function ddmDeuxEtapes(d0: number, g1Pct: number, n1: number, g2Pct: number, rPct: number): number {
  const r = 1 + rPct / 100;
  const g1 = 1 + g1Pct / 100;
  let dividende = d0;
  let vaDividendes = 0;
  for (let t = 1; t <= n1; t++) {
    dividende *= g1;
    vaDividendes += dividende / r ** t;
  }
  const vt = valeurTerminaleGordon(dividende, g2Pct, rPct); // valeur en t = n1 ; throw si r ≤ g2
  return vaDividendes + vt / r ** n1;
}

// ───────────────────────── DCF ─────────────────────────

/**
 * DCF simple : VA des FCF reçus en t = 1..n + VA de la valeur terminale
 * (exprimée en valeur à l'année n, donc actualisée de n années).
 */
export function dcfSimple(fcfs: number[], rPct: number, valeurTerminale: number): number {
  const r = 1 + rPct / 100;
  let va = 0;
  for (let t = 1; t <= fcfs.length; t++) va += fcfs[t - 1] / r ** t;
  return va + valeurTerminale / r ** fcfs.length;
}

// ───────────────────────── Multiples et ratios ─────────────────────────

/** PER = prix / bénéfice par action. */
export function per(prix: number, bpa: number): number {
  return prix / bpa;
}

/** Bénéfice par action = bénéfice net / nombre d'actions. */
export function bpa(beneficeNet: number, nbActions: number): number {
  return beneficeNet / nbActions;
}

/**
 * EV/EBITDA = (capitalisation + dette nette) / EBITDA.
 * Une dette nette négative (trésorerie nette) diminue l'EV.
 */
export function evSurEbitda(capitalisation: number, detteNette: number, ebitda: number): number {
  return (capitalisation + detteNette) / ebitda;
}

/** Rendement du dividende = dividende / prix, en %. */
export function rendementDividende(dividende: number, prix: number): number {
  return (dividende / prix) * 100;
}

/** Taux de distribution (payout) = dividende / BPA, en %. */
export function tauxDistribution(dividende: number, bpa: number): number {
  return (dividende / bpa) * 100;
}

// ───────────────────────── Opérations sur titres ─────────────────────────

/** Au détachement du coupon, le prix baisse mécaniquement du dividende : prix − dividende. */
export function prixTheoriqueExDividende(prix: number, dividende: number): number {
  return prix - dividende;
}

/** Split ratio:1 → prix / ratio (split 5:1 : 750 € → 150 €, capitalisation inchangée). */
export function ajustementSplit(prix: number, ratio: number): number {
  return prix / ratio;
}

/**
 * Valeur théorique du droit préférentiel de souscription :
 * DPS = (cours coté − prix d'émission) / (nb de droits pour une action neuve + 1).
 * C'est la décote du cours théorique ex-droit par rapport au cours coté.
 */
export function valeurDroitSouscription(prixCote: number, prixEmission: number, nbDroitsPourUneNeuve: number): number {
  return (prixCote - prixEmission) / (nbDroitsPourUneNeuve + 1);
}

// ───────────────────────── Indices ─────────────────────────

export interface ConstituantIndice {
  prix: number;        // cours en €
  nbTitres: number;    // nombre de titres en circulation
  flottantPct: number; // part du capital réellement négociable, en % (100 = tout flotte)
}

/**
 * Capitalisation flottante totale d'un indice pondéré par la capitalisation :
 * Σ prix × nbTitres × flottant. C'est le NUMÉRATEUR du niveau d'indice :
 * indice = capi flottante / diviseur, le diviseur étant un simple choix de base à la
 * création (ex. base 1 000 le 31/12/1987 pour le CAC 40), ajusté ensuite à chaque
 * changement de composition ou opération sur titres pour assurer la continuité du niveau.
 */
export function indiceCapiPonderee(constituants: ConstituantIndice[]): number {
  return constituants.reduce((s, c) => s + c.prix * c.nbTitres * (c.flottantPct / 100), 0);
}

/** Poids de chaque constituant dans l'indice, en % de la capi flottante totale (somme = 100). */
export function poidsDansIndice(constituants: ConstituantIndice[]): number[] {
  const total = indiceCapiPonderee(constituants);
  return constituants.map(c => ((c.prix * c.nbTitres * (c.flottantPct / 100)) / total) * 100);
}

// ───────────────────────── Vente à découvert ─────────────────────────

/** Coût d'emprunt de titres en convention monétaire Exact/360 : notionnel × taux × jours/360. */
export function coutEmprunTitres(notionnel: number, tauxPct: number, jours: number): number {
  return notionnel * (tauxPct / 100) * (jours / 360);
}

/**
 * P&L net d'une vente à découvert : (prix de vente − prix de rachat) × quantité,
 * moins les frais d'emprunt courus au prorata Exact/360 sur le NOTIONNEL VENDU
 * (prix de vente × quantité). Positif si le titre a baissé plus que le coût du prêt.
 */
export function pnlVenteADecouvert(prixVente: number, prixRachat: number, quantite: number, fraisEmpruntPct: number, jours: number): number {
  const brut = (prixVente - prixRachat) * quantite;
  return brut - coutEmprunTitres(prixVente * quantite, fraisEmpruntPct, jours);
}
