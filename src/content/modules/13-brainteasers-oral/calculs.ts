/**
 * Bibliothèque de référence du module Brainteasers & oral.
 *
 * CONVENTIONS (valables pour tout le fichier) :
 * — Pourcentages partout (5 = 5 %) ; aucun arrondi interne. Les PROBABILITÉS
 *   se passent et se rendent en % (50 = 50 %) — la langue de l'entretien.
 * — Les taux de la règle de 72 sont ANNUELS en % ; composition discrète
 *   annuelle, alignée sur le m2/m4.
 * — Les cotes s'entendent « pour 1 » : une cote équitable de 4 signifie
 *   toucher 4 (mise comprise) pour 1 misé.
 * — Les estimations de Fermi utilisent la MOYENNE GÉOMÉTRIQUE des bornes :
 *   sur des ordres de grandeur, le milieu multiplicatif, jamais la moyenne
 *   arithmétique (qui écrase la borne basse).
 * — Le pont quantitatif avec le m2 (probabilités, Bayes, binomiale) est
 *   assumé : ces fonctions en sont la version « calcul mental » — les
 *   chapitres renvoient au m2 pour la théorie complète.
 *
 * Toutes les fonctions sont verrouillées dans calculs.test.ts par des
 * valeurs vérifiées à la main : 72/8 = 9 ans contre 9,006468 exacts (erreur
 * −0,07 %) ; au moins un 6 en 4 lancers = 51,774691 % ; anniversaires à 23
 * personnes = 50,729723 % ; Bayes (prévalence 1 %, sensibilité 99 %, faux
 * positifs 5 %) = 16,666667 % — LE piège d'entretien ; C(52, 5) =
 * 2 598 960 ; espérance d'un d6 = 3,5 ; cinq piles d'affilée = 3,125 % ;
 * cote équitable à 25 % = 4 ; Fermi(1 000, 1 000 000) = 31 622,776602.
 * Les générateurs d'exercices DEVRONT composer ces fonctions, jamais
 * recopier une formule.
 */

// ───────────────────────── Le calcul mental du desk ─────────────────────────

/**
 * Règle de 72 : années de doublement approximatives d'un capital au taux
 * composé t %, soit 72/t. L'outil de calcul mental le plus rentable en
 * entretien : 8 % ⇒ 9 ans ; 6 % ⇒ 12 ans ; 2 % ⇒ 36 ans. Pourquoi 72 :
 * proche de 100·ln 2 ≈ 69,3 mais divisible par 2, 3, 4, 6, 8, 9, 12 —
 * l'approximation est quasi exacte vers 8 %, reste sous 2 % d'erreur
 * entre 4 et 12 % environ, et ne dépasse jamais 3,5 % sur la plage 1-15 %.
 */
export function regleDe72(tauxAnnuelPct: number): number {
  return 72 / tauxAnnuelPct;
}

/**
 * Années de doublement EXACTES : ln 2 / ln(1 + t/100), composition
 * discrète. 8 % ⇒ 9,006468 ans (la règle de 72 donne 9 : erreur −0,07 %) ;
 * 2 % ⇒ 35,002789 (72/2 = 36 : la règle surestime d'un an aux taux bas).
 * À réciter avec l'erreur : montrer qu'on connaît l'outil ET sa limite.
 */
export function anneesDoublementExactes(tauxAnnuelPct: number): number {
  return Math.log(2) / Math.log(1 + tauxAnnuelPct / 100);
}

/**
 * Erreur relative d'une approximation, en % : (approx − exact)/exact·100.
 * Le réflexe qui distingue le candidat : donner l'estimation PUIS borner
 * son erreur. (9, 9,006468) = −0,071819 %.
 */
export function erreurRelativePct(approximation: number, exact: number): number {
  return ((approximation - exact) / exact) * 100;
}

// ───────────────────────── Les probabilités d'entretien ─────────────────────────

/**
 * Probabilité d'AU MOINS un succès en n essais indépendants, en % :
 * 100·(1 − (1 − p)^n). LE réflexe : passer par le complémentaire.
 * « Au moins un 6 en 4 lancers » = 1 − (5/6)⁴ = 51,774691 % — le pari de
 * Méré, favorable de justesse ; au moins un pile en 3 lancers = 87,5 %.
 * Piège martelé : n×p (4/6 = 66,7 %) est FAUX — les succès ne s'additionnent
 * pas, ils se composent (même leçon que le défaut cumulé du m5).
 */
export function probaAuMoinsUnPct(probaSuccesPct: number, essais: number): number {
  return 100 * (1 - Math.pow(1 - probaSuccesPct / 100, essais));
}

/**
 * Paradoxe des anniversaires : probabilité qu'au moins deux personnes sur n
 * partagent leur anniversaire, en % (365 jours équiprobables) :
 * 100·(1 − 365!/(365−n)!/365ⁿ). n = 23 ⇒ 50,729723 % ; n = 50 ⇒
 * 97,037358 % ; n = 70 ⇒ 99,915958 %. L'intuition rate parce qu'elle
 * compte les personnes (23) au lieu des PAIRES (253) — le nombre de
 * collisions possibles croît en n², pas en n.
 */
export function probaAnniversairesPct(personnes: number): number {
  let produit = 1;
  for (let k = 0; k < personnes; k++) {
    produit *= (365 - k) / 365;
  }
  return 100 * (1 - produit);
}

/**
 * Bayes en une fonction : probabilité a posteriori d'être « positif réel »
 * sachant un test positif, en % — P = prev·sens / (prev·sens + (1−prev)·fp).
 * LE classique absolu : maladie à 1 % de prévalence, test sensible à 99 %,
 * 5 % de faux positifs ⇒ 16,666667 % seulement. La méthode d'oral : 10 000
 * personnes → 100 malades dont 99 détectés, 9 900 saines dont 495 faux
 * positifs → 99/(99 + 495) = 1/6. Les faux positifs NOIENT les vrais quand
 * la prévalence est faible — même structure que les faux signaux d'un
 * indicateur de crise rare (m10, m11).
 */
export function bayesAPosterioriPct(prevalencePct: number, sensibilitePct: number, tauxFauxPositifsPct: number): number {
  const vraisPositifs = (prevalencePct / 100) * (sensibilitePct / 100);
  const fauxPositifs = (1 - prevalencePct / 100) * (tauxFauxPositifsPct / 100);
  return 100 * vraisPositifs / (vraisPositifs + fauxPositifs);
}

/**
 * Combinaisons C(n, k) : nombre de façons de choisir k objets parmi n,
 * sans ordre. C(52, 5) = 2 598 960 mains de poker ; C(10, 3) = 120 ;
 * C(6, 2) = 15. Calcul en produit progressif (n−k+i)/i pour rester exact
 * en flottant, arrondi final — la version « à la main » : simplifier AVANT
 * de multiplier.
 */
export function combinaisons(n: number, k: number): number {
  let resultat = 1;
  for (let i = 1; i <= k; i++) {
    resultat = resultat * (n - k + i) / i;
  }
  return Math.round(resultat);
}

/**
 * Probabilité de n succès CONSÉCUTIFS, en % : 100·pⁿ. Cinq piles
 * d'affilée = 3,125 % ; trois 6 d'affilée = 0,462963 %. Le piège en sens
 * inverse du « au moins un » : ici on multiplie les succès, là-bas on
 * multipliait les échecs.
 */
export function probaSerieConsecutivePct(probaSuccesPct: number, essais: number): number {
  return 100 * Math.pow(probaSuccesPct / 100, essais);
}

// ───────────────────────── Jeux, cotes et espérances ─────────────────────────

/**
 * Espérance du lancer d'un dé à f faces : (f + 1)/2. E[d6] = 3,5 ;
 * E[d100] = 50,5. La brique de tous les jeux de dés d'entretien — et la
 * base du market making sur un dé : coter un bid/ask autour de 3,5, pas
 * autour de 3 (l'erreur du « milieu des faces » 1-6 lue comme 3).
 */
export function esperanceLancerDe(faces: number): number {
  return (faces + 1) / 2;
}

/**
 * Espérance d'un jeu discret : Σ pᵢ·gᵢ, probabilités en %, gains dans
 * l'unité du jeu. « Vous gagnez la face du dé en euros » ⇒ 3,5 €. La
 * question qui suit est TOUJOURS : « combien payez-vous pour jouer ? » —
 * au plus l'espérance, moins votre marge (le réflexe market maker).
 */
export function esperanceJeu(probasPct: number[], gains: number[]): number {
  let esperance = 0;
  for (let i = 0; i < probasPct.length; i++) {
    esperance += (probasPct[i] / 100) * gains[i];
  }
  return esperance;
}

/**
 * Cote équitable « pour 1 » d'un pari à probabilité p : 100/p. Gagner à
 * 25 % « mérite » une cote de 4 (toucher 4 pour 1 misé, espérance nulle) ;
 * un 6 sur un dé, une cote de 6. Toute cote au-dessus est un edge pour le
 * parieur, en dessous pour la maison — la lecture inverse donne la
 * probabilité implicite d'une cote (1/cote), exactement comme la PD
 * implicite d'un spread au m5.
 */
export function coteEquitable(probaGainPct: number): number {
  return 100 / probaGainPct;
}

/**
 * Estimation de Fermi : la moyenne GÉOMÉTRIQUE des bornes, √(basse × haute).
 * Entre « au moins 1 000 » et « au plus 1 000 000 », le milieu multiplicatif
 * est 31 622,776602 (≈ 30 000), PAS 500 000 : sur des ordres de grandeur,
 * la moyenne arithmétique écrase la borne basse et se trompe d'un facteur
 * 15. Le réflexe Fermi : encadrer par deux bornes « sûres », prendre le
 * milieu géométrique, annoncer l'ordre de grandeur.
 */
export function estimationFermi(borneBasse: number, borneHaute: number): number {
  return Math.sqrt(borneBasse * borneHaute);
}
