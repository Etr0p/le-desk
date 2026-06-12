import { describe, expect, it } from 'vitest';
import {
  prixForwardIndice, pnlFutures, margeVariation, appelDeMarge, effetLevier,
  tauxForwardImplicite, reglementFra,
  facteurActualisation, tauxSwapParitaire, valeurJambeFixe, valeurSwapPayeurFixe,
  nombreContratsCouverture,
} from './calculs';

// Toutes les valeurs de référence ci-dessous ont été calculées à la main puis
// recoupées par un script node indépendant AVANT l'implémentation (TDD strict).
//
// Conventions (documentées en tête de calculs.ts) : intérêts LINÉAIRES sur les
// horizons monétaires ≤ 1 an (forwards par portage, FRA, taux forward implicite —
// cohérent m4/m6), composition ANNUELLE au-delà (facteurs d'actualisation, swaps).
// Signes : long = +1, short = −1 ; un flux négatif est un décaissement.

describe('prixForwardIndice — forward d\'indice par portage (linéaire)', () => {
  // F = 5000 × (1 + (4 − 2)/100 × 1) = 5000 × 1,02 = 5100 exactement.
  // Le dividende (q) réduit le coût de portage : on porte l'indice en encaissant 2 %.
  it('prixForwardIndice(5000, 4, 2, 1) = 5100', () => {
    expect(prixForwardIndice(5000, 4, 2, 1)).toBeCloseTo(5100, 10);
  });
  // q > r ⇒ portage net négatif ⇒ F < S (déport, comme la backwardation du m6) :
  // 5000 × (1 + (2 − 3)/100 × 0,5) = 5000 × (1 − 0,005) = 5000 × 0,995 = 4975 exactement.
  it('prixForwardIndice(5000, 2, 3, 0.5) = 4975 (rendement > financement ⇒ F < S)', () => {
    expect(prixForwardIndice(5000, 2, 3, 0.5)).toBeCloseTo(4975, 10);
  });
  // T fractionnaire court : 4000 × (1 + 0,03 × 0,25) = 4000 × 1,0075 = 4030.
  it('prixForwardIndice(4000, 3, 0, 0.25) = 4030 (3 mois, sans dividende)', () => {
    expect(prixForwardIndice(4000, 3, 0, 0.25)).toBeCloseTo(4030, 9);
  });
  // Propriété : r = q ⇒ portage net nul ⇒ F = S, quel que soit l'horizon.
  it('propriété : r = q ⇒ F = S', () => {
    expect(prixForwardIndice(5000, 3, 3, 1)).toBeCloseTo(5000, 10);
    expect(prixForwardIndice(1234.5, 0, 0, 0.75)).toBeCloseTo(1234.5, 10);
  });
});

describe('pnlFutures — P&L d\'une position futures soldée', () => {
  // (5080 − 5000) × 10 × 3 × (+1) = 80 × 30 = +2400 exactement (long, marché monte).
  it('pnlFutures(5000, 5080, 10, 3, +1) = +2400', () => {
    expect(pnlFutures(5000, 5080, 10, 3, 1)).toBeCloseTo(2400, 10);
  });
  // Même trajet, sens vendeur : (5080 − 5000) × 10 × 3 × (−1) = −2400 — le jeu à
  // somme nulle : le gain du long est exactement la perte du short.
  it('pnlFutures(5000, 5080, 10, 3, −1) = −2400 (somme nulle)', () => {
    expect(pnlFutures(5000, 5080, 10, 3, -1)).toBeCloseTo(-2400, 10);
  });
  // Long, marché baisse : (4950 − 5000) × 10 × 2 × (+1) = −50 × 20 = −1000.
  it('pnlFutures(5000, 4950, 10, 2, +1) = −1000', () => {
    expect(pnlFutures(5000, 4950, 10, 2, 1)).toBeCloseTo(-1000, 10);
  });
  // Propriété : sortie au prix d'entrée ⇒ P&L nul.
  it('propriété : pnlFutures(p, p, m, n, s) = 0', () => {
    expect(pnlFutures(5000, 5000, 10, 7, 1)).toBeCloseTo(0, 12);
  });
});

describe('margeVariation — flux quotidien de marge (mark-to-market)', () => {
  // (4960 − 5000) × 10 × 2 × (+1) = −40 × 20 = −800 : le long DÉCAISSE 800 ce
  // soir-là (flux signé, négatif = appel sur le compte de marge).
  it('margeVariation(5000, 4960, 10, 2, +1) = −800 (le long paie)', () => {
    expect(margeVariation(5000, 4960, 10, 2, 1)).toBeCloseTo(-800, 10);
  });
  // Le short reçoit ce que le long paie : même journée, sens −1 ⇒ +800.
  it('margeVariation(5000, 4960, 10, 2, −1) = +800 (le short reçoit)', () => {
    expect(margeVariation(5000, 4960, 10, 2, -1)).toBeCloseTo(800, 10);
  });
  // Journée de hausse : (5025 − 5000) × 10 × 2 × (+1) = +500 crédités au long.
  it('margeVariation(5000, 5025, 10, 2, +1) = +500', () => {
    expect(margeVariation(5000, 5025, 10, 2, 1)).toBeCloseTo(500, 10);
  });
  // Propriété : règlement inchangé ⇒ flux nul.
  it('propriété : margeVariation(p, p, m, n, s) = 0', () => {
    expect(margeVariation(5000, 5000, 10, 3, 1)).toBeCloseTo(0, 12);
  });
});

describe('appelDeMarge — versement pour revenir à la marge initiale (convention US)', () => {
  // Solde 4200 < maintenance 4500 ⇒ appel. Convention futures US (documentée dans
  // calculs.ts) : on reverse jusqu'à la marge INITIALE, pas la maintenance :
  // 6000 − 4200 = 1800 exactement.
  it('appelDeMarge(4200, 4500, 6000) = 1800 (retour à l\'initiale)', () => {
    expect(appelDeMarge(4200, 4500, 6000)).toBeCloseTo(1800, 10);
  });
  // Solde 4800 ≥ maintenance 4500 ⇒ aucun appel, même si l'on est sous l'initiale.
  it('appelDeMarge(4800, 4500, 6000) = 0 (au-dessus de la maintenance)', () => {
    expect(appelDeMarge(4800, 4500, 6000)).toBeCloseTo(0, 12);
  });
  // Bord : solde EXACTEMENT à la maintenance ⇒ pas d'appel (le seuil n'est franchi
  // que strictement en dessous).
  it('appelDeMarge(4500, 4500, 6000) = 0 (pile au seuil)', () => {
    expect(appelDeMarge(4500, 4500, 6000)).toBeCloseTo(0, 12);
  });
  // Solde négatif (perte au-delà du dépôt) : 6000 − (−500) = 6500 à reverser.
  it('appelDeMarge(−500, 4500, 6000) = 6500 (solde négatif)', () => {
    expect(appelDeMarge(-500, 4500, 6000)).toBeCloseTo(6500, 10);
  });
});

describe('effetLevier — variation en % de la mise pour une variation du spot', () => {
  // Marge initiale 10 % ⇒ levier ×10 : un spot à +2 % fait +2/0,10 = +20 % sur la mise.
  it('effetLevier(2, 10) = +20', () => {
    expect(effetLevier(2, 10)).toBeCloseTo(20, 10);
  });
  // −12 % de spot sous 10 % de marge : −12/0,10 = −120 % — la mise est PERDUE et
  // il faut remettre au pot : la ruine au-delà de la marge.
  it('effetLevier(−12, 10) = −120 (perte supérieure à la mise)', () => {
    expect(effetLevier(-12, 10)).toBeCloseTo(-120, 10);
  });
  // Marge plus fine, même levier en proportion : 1/0,05 = ×20 ⇒ +20 %.
  it('effetLevier(1, 5) = +20 (levier ×20)', () => {
    expect(effetLevier(1, 5)).toBeCloseTo(20, 10);
  });
  // Propriété : spot immobile ⇒ 0 %, quel que soit le levier.
  it('propriété : effetLevier(0, m) = 0', () => {
    expect(effetLevier(0, 10)).toBeCloseTo(0, 12);
    expect(effetLevier(0, 2)).toBeCloseTo(0, 12);
  });
});

describe('tauxForwardImplicite — forward-forward en LINÉAIRE (boucle m4 ch5)', () => {
  // Facteurs linéaires : (1 + 0,035×1)/(1 + 0,03×0,5) = 1,035/1,015 = 1,019704433497537
  // ⇒ taux période = 0,019704433497537 sur 0,5 an ⇒ annualisé linéairement :
  // /0,5 × 100 = 3,940886699507 (script node) — figé à 4 décimales : 3,9409.
  it('tauxForwardImplicite(3, 0.5, 3.5, 1) ≈ 3,9409 % (le 6 mois dans 6 mois)', () => {
    expect(tauxForwardImplicite(3, 0.5, 3.5, 1)).toBeCloseTo(3.940886699507, 9);
    expect(Number(tauxForwardImplicite(3, 0.5, 3.5, 1).toFixed(4))).toBe(3.9409);
  });
  // Subtilité de la convention LINÉAIRE (vérifiée à la main) : courbe plate 4 %
  // ⇒ forward ≠ 4 ! (1 + 0,04×1)/(1 + 0,04×0,5) = 1,04/1,02 = 52/51 = 1,019607843…
  // ⇒ /0,5 × 100 = 3,921568627451 : le linéaire ne compose pas, le forward d'une
  // courbe monétaire plate est légèrement SOUS le taux plat.
  it('tauxForwardImplicite(4, 0.5, 4, 1) ≈ 3,9216 % (courbe plate : piège du linéaire)', () => {
    expect(tauxForwardImplicite(4, 0.5, 4, 1)).toBeCloseTo(3.921568627451, 9);
  });
  // (1 + 0,03×0,75)/(1 + 0,02×0,25) = 1,0225/1,005 = 409/402 = 1,017412935323…
  // ⇒ /0,5 × 100 = 3,482587064677 (script node).
  it('tauxForwardImplicite(2, 0.25, 3, 0.75) ≈ 3,4826 % (3 mois → 9 mois)', () => {
    expect(tauxForwardImplicite(2, 0.25, 3, 0.75)).toBeCloseTo(3.482587064677, 9);
  });
});

describe('reglementFra — règlement différentiel ACTUALISÉ au taux constaté', () => {
  // Notionnel 10 M, FRA 3 %, constaté 4 %, période 0,5 an. Différentiel non
  // actualisé : 10 000 000 × (0,04 − 0,03) × 0,5 = 50 000, payé en DÉBUT de
  // période ⇒ actualisé au taux constaté (convention FRA, documentée) :
  // 50 000/(1 + 0,04 × 0,5) = 50 000/1,02 = 49 019,607843… Le LONG (payeur du
  // fixe) GAGNE quand les taux montent.
  it('reglementFra(10, 3, 4, 0.5) ≈ +49 019,61 (taux montent, le long gagne)', () => {
    expect(reglementFra(10, 3, 4, 0.5)).toBeCloseTo(49019.607843137, 6);
  });
  // Taux baissent : 10 000 000 × (0,02 − 0,03) × 0,5 = −50 000 ⇒ /(1 + 0,02×0,5)
  // = −50 000/1,01 = −49 504,950495… : le long perd (symétrie, actualisation au
  // NOUVEAU taux constaté 2 %, d'où une valeur absolue différente du cas haussier).
  it('reglementFra(10, 3, 2, 0.5) ≈ −49 504,95 (taux baissent, le long perd)', () => {
    expect(reglementFra(10, 3, 2, 0.5)).toBeCloseTo(-49504.950495050, 6);
  });
  // Propriété : taux constaté = taux FRA ⇒ règlement nul.
  it('propriété : reglementFra(n, r, r, f) = 0', () => {
    expect(reglementFra(10, 3, 3, 0.5)).toBeCloseTo(0, 10);
    expect(reglementFra(50, 2.5, 2.5, 0.25)).toBeCloseTo(0, 10);
  });
});

describe('facteurActualisation — zéro-coupon composé annuel', () => {
  // 1/1,04² = 1/1,0816 = 0,924556213018 (vérif : 0,924556 × 1,0816 = 1,000000).
  it('facteurActualisation(4, 2) ≈ 0,924556', () => {
    expect(facteurActualisation(4, 2)).toBeCloseTo(0.924556213018, 10);
  });
  // 1/1,03 = 0,970873786408 (le df1 de la courbe [3 ; 3,5 ; 4] du swap ci-dessous).
  it('facteurActualisation(3, 1) ≈ 0,970874', () => {
    expect(facteurActualisation(3, 1)).toBeCloseTo(0.970873786408, 10);
  });
  // 1/1,04³ = 1/1,124864 = 0,888996358671 (le df3 des deux courbes de swap testées).
  it('facteurActualisation(4, 3) ≈ 0,888996', () => {
    expect(facteurActualisation(4, 3)).toBeCloseTo(0.888996358671, 10);
  });
  // Propriété : taux nul ⇒ df = 1 (un euro demain vaut un euro).
  it('propriété : facteurActualisation(0, t) = 1', () => {
    expect(facteurActualisation(0, 5)).toBeCloseTo(1, 12);
  });
});

describe('tauxSwapParitaire — taux fixe qui annule la valeur du swap (annuel)', () => {
  // Vérité de cohérence : courbe PLATE 4 % ⇒ taux paritaire = 4 exactement.
  // Démonstration (à la main) : avec v = 1/1,04, Σvⁱ = v(1 − vⁿ)/(1 − v), donc
  // (1 − vⁿ)/Σvⁱ = (1 − v)/v = 1,04 − 1 = 0,04 — indépendant de n.
  it('tauxSwapParitaire([4, 4, 4]) = 4,0000 exactement (courbe plate)', () => {
    expect(tauxSwapParitaire([4, 4, 4])).toBeCloseTo(4, 10);
  });
  // Courbe [3 ; 3,5 ; 4] (calcul à la main, recoupé script node) :
  //   df1 = 1/1,03      = 0,970874
  //   df2 = 1/1,035²    = 1/1,071225  = 0,933511
  //   df3 = 1/1,04³     = 1/1,124864  = 0,888996
  //   Σdf = 2,793381 ; 1 − df3 = 0,111004
  //   taux = 0,111004/2,793381 × 100 = 3,973809783585 — figé à 4 déc. : 3,9738.
  // Le taux de swap est une MOYENNE pondérée de la courbe : entre 3 et 4, près du long.
  it('tauxSwapParitaire([3, 3.5, 4]) ≈ 3,9738 % (courbe croissante)', () => {
    expect(tauxSwapParitaire([3, 3.5, 4])).toBeCloseTo(3.973809783585, 9);
    expect(Number(tauxSwapParitaire([3, 3.5, 4]).toFixed(4))).toBe(3.9738);
  });
  // À 1 an, le swap se réduit au taux zéro : (1 − v)/v = 5 % exactement pour [5].
  it('tauxSwapParitaire([5]) = 5,0000 (un seul flux : le taux zéro 1 an)', () => {
    expect(tauxSwapParitaire([5])).toBeCloseTo(5, 10);
  });
});

describe('valeurJambeFixe — coupons fixes actualisés + notionnel (en M)', () => {
  // Cohérence obligataire : coupon 4 % actualisé sur courbe plate 4 % ⇒ LE PAIR.
  // 100 × 0,04 × 2,775091 + 100 × 0,888996 = 11,100364 + 88,899636 = 100 exactement.
  it('valeurJambeFixe(4, [4, 4, 4], 100) = 100 (au pair sur courbe plate)', () => {
    expect(valeurJambeFixe(4, [4, 4, 4], 100)).toBeCloseTo(100, 9);
  });
  // Coupon 5 % sur courbe plate 4 % : 5 × 2,775091033227 + 88,899635867091
  //   = 13,875455166136 + 88,899635867091 = 102,775091033227 (script node) —
  // au-dessus du pair, l'excédent vaut 1 point de coupon × Σdf.
  it('valeurJambeFixe(5, [4, 4, 4], 100) ≈ 102,775091', () => {
    expect(valeurJambeFixe(5, [4, 4, 4], 100)).toBeCloseTo(102.775091033227, 8);
  });
  // Coupon 4 % sur la courbe [3 ; 3,5 ; 4] : 4 × 2,793381 + 88,899636
  //   = 11,173523380315 + 88,899635867091 = 100,073159248872 (script node) —
  // légèrement au-dessus du pair car 4 % > taux paritaire 3,9738 %.
  it('valeurJambeFixe(4, [3, 3.5, 4], 100) ≈ 100,073159', () => {
    expect(valeurJambeFixe(4, [3, 3.5, 4], 100)).toBeCloseTo(100.073159248872, 8);
  });
});

describe('valeurSwapPayeurFixe — notionnel (jambe variable au pair) − jambe fixe', () => {
  // Cohérence FONDAMENTALE : au taux paritaire, le swap vaut zéro (par définition).
  it('cohérence : valeurSwapPayeurFixe(tauxSwapParitaire(z), z, 100) = 0', () => {
    const z = [3, 3.5, 4];
    expect(valeurSwapPayeurFixe(tauxSwapParitaire(z), z, 100)).toBeCloseTo(0, 9);
    expect(valeurSwapPayeurFixe(tauxSwapParitaire([4, 4, 4]), [4, 4, 4], 100)).toBeCloseTo(0, 9);
  });
  // Payeur d'un fixe 5 % quand le pair vaut 4 % : il paie trop cher ⇒ valeur
  // NÉGATIVE : 100 − 102,775091033227 = −2,775091033227 (script node).
  it('valeurSwapPayeurFixe(5, [4, 4, 4], 100) ≈ −2,775091 (fixe au-dessus du pair)', () => {
    expect(valeurSwapPayeurFixe(5, [4, 4, 4], 100)).toBeCloseTo(-2.775091033227, 8);
  });
  // Payeur d'un fixe 3 % quand le pair vaut 4 % : il paie moins que le marché ⇒
  // valeur POSITIVE, symétrique du cas précédent : 100 − 97,224908966773 = +2,775091.
  it('valeurSwapPayeurFixe(3, [4, 4, 4], 100) ≈ +2,775091 (fixe sous le pair)', () => {
    expect(valeurSwapPayeurFixe(3, [4, 4, 4], 100)).toBeCloseTo(2.775091033227, 8);
  });
});

describe('nombreContratsCouverture — exposition (M) / valeur d\'un contrat, arrondi', () => {
  // 25 M / (5000 × 10) = 25 000 000/50 000 = 500 contrats exactement.
  it('nombreContratsCouverture(25, 5000, 10) = 500', () => {
    expect(nombreContratsCouverture(25, 5000, 10)).toBe(500);
  });
  // 1,234 M / 50 000 = 24,68 ⇒ arrondi standard au plus proche : 25 contrats.
  it('nombreContratsCouverture(1.234, 5000, 10) = 25 (24,68 arrondi au plus proche)', () => {
    expect(nombreContratsCouverture(1.234, 5000, 10)).toBe(25);
  });
  // 1,22 M / 50 000 = 24,4 ⇒ 24 contrats (on ne peut traiter que des contrats entiers).
  it('nombreContratsCouverture(1.22, 5000, 10) = 24 (24,4 arrondi au plus proche)', () => {
    expect(nombreContratsCouverture(1.22, 5000, 10)).toBe(24);
  });
});
