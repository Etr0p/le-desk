/**
 * Les 14 générateurs d'exercices d'application du module Produits structurés
 * & pricing de structuration.
 *
 * BILINGUES : generate(seed, langue = 'fr'). Invariant absolu : TOUS les tirages
 * aléatoires sont effectués AVANT toute branche de langue — un même seed produit
 * exactement les mêmes nombres, la même réponse et la même tolérance en français
 * et en anglais. Seuls les textes (énoncé, étapes, pièges, unité textuelle) changent.
 *
 * Tous les calculs passent par calculs.ts (aucune formule recopiée) et par les
 * briques Black-Scholes du m8 (blackScholesCall/Put, dfContinu) : le structureur
 * ACHÈTE ses options au desk. Conventions du module (en-tête de calculs.ts) :
 * actualisation CONTINUE e^{−rT} partout, nominal 100, prix en % du nominal,
 * participation en ratio, barrières d'autocall/worst-of en % du niveau initial,
 * barrières de DIP en niveau absolu. AUCUN générateur n'appelle une fonction
 * Monte-Carlo : quand un exercice a besoin d'un résultat de simulation (prix de
 * DIP, de call worst-of), il est DONNÉ dans l'énoncé, tiré dans des bornes
 * réalistes, et l'on fait calculer la suite. Les pièges martelés ici : le coupon
 * « versé dans tous les cas » n'est pas un rendement acquis, « capital garanti »
 * = à maturité ET à la signature de l'émetteur près, la participation n'est pas
 * 100 %, le DIP vaut toujours moins que le put vanille, la mémoire de l'autocall
 * ne verse rien en chemin, la corrélation basse embellit la vitrine, et diviser
 * l'erreur Monte-Carlo par 10 coûte 100 fois plus de simulations. L'ordre des
 * tirages de chaque moule est documenté dans son commentaire « Tirages (ordre
 * strict) ».
 */
import { formatNombreLangue } from '../../../engine/answers';
import { mulberry32, pick, randFloat, randInt } from '../../../engine/rng';
import type { ExerciseGenerator, Langue } from '../../../engine/types';
import { blackScholesCall, blackScholesPut, dfContinu } from '../08-options-volatilite/calculs';
import {
  budgetOptions,
  couponReverseConvertible,
  margeCommercialeAnnualisee,
  participationCapitalGaranti,
  payoffAutocall,
  payoffDownAndInPut,
  payoffWorstOf,
  prixZeroCoupon,
  type ParamsAutocall,
} from './calculs';

const M9 = '09-produits-structures';

const r2 = (v: number) => Math.round(v * 100) / 100;
const r4 = (v: number) => Math.round(v * 10_000) / 10_000;

/** Formateurs dépendants de la langue : nombre, euros, pourcentage, nombre signé. */
function formatters(langue: Langue) {
  const f = (v: number, d = 2) => formatNombreLangue(langue, v, d);
  const eur = (v: number, d = 2) => (langue === 'en' ? `€${f(v, d)}` : `${f(v, d)} €`);
  const pct = (v: number, d = 2) => (langue === 'en' ? `${f(v, d)}%` : `${f(v, d)} %`);
  /** Nombre signé (+4,20 / −12), pour afficher des P&L ou des écarts. */
  const sgn = (v: number, d = 2) => (v > 0 ? `+${f(v, d)}` : f(v, d));
  return { f, eur, pct, sgn };
}

/** « 3 ans » / « 1 an » / « 18 mois » selon la durée en années. */
function libelleMaturite(annees: number, en: boolean): string {
  if (annees < 1 || !Number.isInteger(annees)) {
    const mois = Math.round(annees * 12);
    return en ? `${mois} months` : `${mois} mois`;
  }
  if (annees === 1) return en ? '1 year' : '1 an';
  return en ? `${annees} years` : `${annees} ans`;
}

// ---------------------------------------------------------------------------
// 1. Le zéro-coupon et le budget d'options (N1)
// ---------------------------------------------------------------------------
export const genZeroCouponBudget: ExerciseGenerator = {
  id: 'm9-ex-01',
  moduleId: M9,
  titre: 'Le zéro-coupon et le budget d\'options',
  titreEn: 'The zero-coupon and the options budget',
  difficulte: 1,
  // Tirages (ordre strict) : 1. r = randFloat(1.5, 5, 1) · 2. T = pick([3, 4, 5, 6, 8])
  // · 3. marge = randFloat(0.5, 2, 1).
  // ZC = prixZeroCoupon (100·e^{−rT}, actualisation CONTINUE), budget = budgetOptions
  // (100 − ZC − marge). Faux classique : composer annuellement 100/(1+r)^T au lieu de e^{−rT}.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const r = randFloat(rng, 1.5, 5, 1);
    const T = pick(rng, [3, 4, 5, 6, 8] as const);
    const marge = randFloat(rng, 0.5, 2, 1);

    const zc = r2(prixZeroCoupon(r, T));
    const reponse = r2(budgetOptions(prixZeroCoupon(r, T), marge));
    const fauxSansMarge = r2(budgetOptions(prixZeroCoupon(r, T), 0));
    const fauxAnnuel = r2(100 / (1 + r / 100) ** T);

    const en = langue === 'en';
    const { f, pct } = formatters(langue);
    const horizon = libelleMaturite(T, en);
    return {
      enonce: en
        ? `You are structuring a ${horizon} capital-guaranteed note on a nominal of 100. The continuously compounded risk-free rate is ${pct(r, 1)}, and the desk locks in a total margin of ${pct(marge, 1)} of the nominal at issuance.\n\n**What options budget is left to buy the performance engine, in % of the nominal?**`
        : `Vous structurez un produit à capital garanti de maturité ${horizon} sur un nominal de 100. Le taux sans risque en composition continue vaut ${pct(r, 1)}, et le desk verrouille à l'émission une marge totale de ${pct(marge, 1)} du nominal.\n\n**Quel budget d'options reste-t-il pour acheter le moteur de performance, en % du nominal ?**`,
      reponse,
      tolerance: 0.05,
      toleranceMode: 'absolu',
      unite: '%',
      etapes: [
        {
          titre: en ? 'The brick that guarantees the capital' : 'La brique qui garantit le capital',
          contenu: en
            ? `The 100 promised at maturity are financed TODAY by a zero-coupon: $ZC = 100\\,e^{-rT} = 100 × e^{-${f(r, 1)}\\,\\% × ${f(T, 0)}}$ = **${pct(zc, 2)}** of the nominal. Park ${f(zc, 2)} at the risk-free rate and it grows back to exactly 100 at maturity, whatever the underlying does — that is the whole guarantee, and its price moves one for one with interest rates.`
            : `Les 100 promis à l'échéance se financent AUJOURD'HUI par un zéro-coupon : $ZC = 100\\,e^{-rT} = 100 × e^{-${f(r, 1)}\\,\\% × ${f(T, 0)}}$ = **${pct(zc, 2)}** du nominal. Placez ${f(zc, 2)} au taux sans risque et ils redeviennent exactement 100 à maturité, quoi que fasse le sous-jacent — c'est toute la garantie, et son prix bouge au rythme des taux.`,
        },
        {
          titre: en ? 'What is left once everyone is served' : 'Ce qui reste une fois tout le monde servi',
          contenu: en
            ? `$\\text{budget} = 100 - ZC - \\text{margin} = 100 - ${f(zc, 2)} - ${f(marge, 1)}$ = **${pct(reponse, 2)}** of the nominal. The client's 100 split three ways: the zero-coupon secures the capital, the margin pays the structurer and the distributor, and ONLY the remainder buys options — the entire generosity of the product lives in this residual.`
            : `$\\text{budget} = 100 - ZC - \\text{marge} = 100 - ${f(zc, 2)} - ${f(marge, 1)}$ = **${pct(reponse, 2)}** du nominal. Les 100 du client se partagent en trois : le zéro-coupon sécurise le capital, la marge paie le structureur et le distributeur, et SEUL le reste achète des options — toute la générosité du produit loge dans ce résidu.`,
        },
        {
          titre: en ? 'The budget is a thermometer of rates' : 'Le budget est un thermomètre des taux',
          contenu: en
            ? `This subtraction is THE constraint of the trade: low rates ⇒ expensive zero-coupon ⇒ starved budget ⇒ stingy (or riskier) products. At ${pct(r, 1)}, the guarantee already eats ${pct(zc, 2)} of every 100; in the zero-rate decade the zero-coupon cost above 97, and capital-guaranteed notes simply vanished from the shelves — no engineering can spend a budget that does not exist.`
            : `Cette soustraction est LA contrainte du métier : taux bas ⇒ zéro-coupon cher ⇒ budget maigre ⇒ produits pingres (ou plus risqués). À ${pct(r, 1)}, la garantie mange déjà ${pct(zc, 2)} de chaque 100 ; dans la décennie des taux zéro, le zéro-coupon coûtait plus de 97, et les capitals garantis ont simplement disparu des vitrines — aucune ingénierie ne dépense un budget qui n'existe pas.`,
        },
      ],
      pieges: [
        en
          ? `Forgetting the margin: 100 − ${f(zc, 2)} = ${pct(fauxSansMarge, 2)} is the budget of a FREE product — those do not exist. The margin is inside the price, deducted from the budget before a single option is bought: every euro of margin is one euro of performance the client will never see.`
          : `Oublier la marge : 100 − ${f(zc, 2)} = ${pct(fauxSansMarge, 2)} est le budget d'un produit GRATUIT — cela n'existe pas. La marge est à l'intérieur du prix, prélevée sur le budget avant l'achat de la moindre option : chaque euro de marge est un euro de performance que le client ne verra jamais.`,
        en
          ? `Discounting with annual compounding: $100/(1+r)^T = ${f(fauxAnnuel, 2)}$ instead of ${f(zc, 2)}. The desk convention of this module is CONTINUOUS discounting ($e^{-rT}$), the natural companion of Black-Scholes — the gap is second-order, but mixing conventions inside one structure is how pricing errors are born.`
          : `Actualiser en composition annuelle : $100/(1+r)^T = ${f(fauxAnnuel, 2)}$ au lieu de ${f(zc, 2)}. La convention du desk dans ce module est l'actualisation CONTINUE ($e^{-rT}$), compagne naturelle de Black-Scholes — l'écart est du second ordre, mais mélanger les conventions au sein d'une même structure, c'est ainsi que naissent les erreurs de pricing.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 2. La participation du capital garanti (N2)
// ---------------------------------------------------------------------------
export const genParticipation: ExerciseGenerator = {
  id: 'm9-ex-02',
  moduleId: M9,
  titre: 'La participation du capital garanti',
  titreEn: 'The capital-guaranteed participation',
  difficulte: 2,
  // Tirages (ordre strict) : 1. r = randFloat(2, 5, 1) · 2. T = pick([4, 5, 6])
  // · 3. vol = randInt(15, 30) · 4. marge = randFloat(0.5, 2, 1).
  // Le call ATM est PRICÉ par blackScholesCall(100, 100, r, vol, T) (en % du nominal,
  // spot = strike = 100) et DONNÉ dans l'énoncé : le structureur achète ses briques au
  // desk options. Réponse = 100 × participationCapitalGaranti(budget, call), en %.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const r = randFloat(rng, 2, 5, 1);
    const T = pick(rng, [4, 5, 6] as const);
    const vol = randInt(rng, 15, 30);
    const marge = randFloat(rng, 0.5, 2, 1);

    const zc = r2(prixZeroCoupon(r, T));
    const budget = r2(budgetOptions(prixZeroCoupon(r, T), marge));
    const call = r2(blackScholesCall(100, 100, r, vol, T));
    const reponse = r2(100 * participationCapitalGaranti(budget, call));
    const fauxInverse = r2(100 * participationCapitalGaranti(call, budget));
    const fauxSansMarge = r2(100 * participationCapitalGaranti(r2(budget + marge), call));

    const en = langue === 'en';
    const { f, pct } = formatters(langue);
    const horizon = libelleMaturite(T, en);
    return {
      enonce: en
        ? `A ${horizon} capital-guaranteed note on an equity index: continuously compounded risk-free rate ${pct(r, 1)}, total margin ${pct(marge, 1)} of the nominal. The options desk quotes the at-the-money call on the index (implied volatility ${pct(vol, 0)}) at ${pct(call, 2)} of the nominal.\n\n**What participation in the index's rise can the term sheet display, in %?**`
        : `Un capital garanti de ${horizon} sur un indice actions : taux sans risque en composition continue ${pct(r, 1)}, marge totale ${pct(marge, 1)} du nominal. Le desk options cote le call à la monnaie sur l'indice (volatilité implicite ${pct(vol, 0)}) à ${pct(call, 2)} du nominal.\n\n**Quelle participation à la hausse de l'indice la term sheet peut-elle afficher, en % ?**`,
      reponse,
      tolerance: 0.3,
      toleranceMode: 'absolu',
      unite: '%',
      etapes: [
        {
          titre: en ? 'Guarantee first, margin second: the budget' : 'La garantie d\'abord, la marge ensuite : le budget',
          contenu: en
            ? `The zero-coupon costs $100\\,e^{-rT} = 100 × e^{-${f(r, 1)}\\,\\% × ${f(T, 0)}}$ = **${f(zc, 2)}**, and once the ${f(marge, 1)} of margin is served, the options budget is $100 - ${f(zc, 2)} - ${f(marge, 1)}$ = **${pct(budget, 2)}** of the nominal. This is all the money the product will ever spend on upside.`
            : `Le zéro-coupon coûte $100\\,e^{-rT} = 100 × e^{-${f(r, 1)}\\,\\% × ${f(T, 0)}}$ = **${f(zc, 2)}**, et une fois la marge de ${f(marge, 1)} servie, le budget d'options vaut $100 - ${f(zc, 2)} - ${f(marge, 1)}$ = **${pct(budget, 2)}** du nominal. C'est tout l'argent que le produit dépensera jamais en hausse.`,
        },
        {
          titre: en ? 'The flagship division' : 'La division phare',
          contenu: en
            ? `The $\\max(\\cdot, 0)$ on the performance is an ATM call (module 8's kink); buying $p$ calls costs $p$ times the call's price, so the budget imposes $p = \\dfrac{\\text{budget}}{\\text{ATM call}} = \\dfrac{${f(budget, 2)}}{${f(call, 2)}}$ = **${pct(reponse, 2)}**. The participation is not a commercial choice: it is the RESULT of a division — how many calls can the budget pay?`
            : `Le $\\max(\\cdot, 0)$ sur la performance est un call ATM (le coude du module 8) ; acheter $p$ calls coûte $p$ fois le prix du call, donc le budget impose $p = \\dfrac{\\text{budget}}{\\text{call ATM}} = \\dfrac{${f(budget, 2)}}{${f(call, 2)}}$ = **${pct(reponse, 2)}**. La participation n'est pas un choix commercial : c'est le RÉSULTAT d'une division — combien de calls le budget peut-il payer ?`,
        },
        {
          titre: en ? 'Reading the shop window' : 'Lire la vitrine',
          contenu: en
            ? `The client will receive ${pct(reponse, 1)} of the index's rise, capital guaranteed — one number that condenses the level of rates (through the zero-coupon) and the price of volatility (through the call). If rates soared or implied vol collapsed, the budget could exceed the call's price and $p$ would top 100 % — the market has known both worlds. Whenever the division returns a dull figure, the structurer reaches for the usual patches: cap the upside, average the performance, guarantee less than 100.`
            : `Le client touchera ${pct(reponse, 1)} de la hausse de l'indice, capital garanti — un seul chiffre qui condense le niveau des taux (via le zéro-coupon) et le prix de la volatilité (via le call). Si les taux flambaient ou si la vol implicite s'écrasait, le budget pourrait dépasser le prix du call et $p$ franchirait 100 % — le marché a connu les deux mondes. Quand la division rend un chiffre terne, le structureur sort ses rustines : plafonner la hausse, moyenner la performance, garantir moins que 100.`,
        },
      ],
      pieges: [
        en
          ? `Dividing the wrong way up: $\\text{call}/\\text{budget} = ${pct(fauxInverse, 1)}$ — a participation above 100 % with a starved budget should ring the alarm. The budget BUYS the call, so the budget goes on top: sanity-check the result against the two inputs before writing it on a term sheet.`
          : `Diviser dans le mauvais sens : $\\text{call}/\\text{budget} = ${pct(fauxInverse, 1)}$ — une participation au-dessus de 100 % avec un budget famélique devrait sonner l'alarme. Le budget ACHÈTE le call, donc le budget est au numérateur : testez la vraisemblance du résultat contre les deux entrées avant de l'écrire sur une term sheet.`,
        en
          ? `Skipping the margin: with the full ${f(r2(budget + marge), 2)} as budget, $p = ${pct(fauxSansMarge, 1)}$ instead of ${pct(reponse, 1)}. Every euro of margin is participation the client silently gives up — that is exactly WHERE the margin hides, and why it never appears as a fee line.`
          : `Sauter la marge : avec ${f(r2(budget + marge), 2)} de budget entier, $p = ${pct(fauxSansMarge, 1)}$ au lieu de ${pct(reponse, 1)}. Chaque euro de marge est de la participation silencieusement abandonnée par le client — c'est exactement LÀ que la marge se cache, et pourquoi elle n'apparaît jamais comme une ligne de frais.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 3. Taux et volatilité : la participation encaisse les chocs (N2)
// ---------------------------------------------------------------------------
export const genChocsParticipation: ExerciseGenerator = {
  id: 'm9-ex-03',
  moduleId: M9,
  titre: 'Taux et volatilité : la participation encaisse les chocs',
  titreEn: 'Rates and volatility: participation under shocks',
  difficulte: 2,
  // Tirages (ordre strict) : 1. mode = pick(['taux', 'vol']) · 2. rA = randFloat(2, 3.5, 1)
  // · 3. ecartTaux = randInt(1, 3) · 4. volA = randInt(15, 22) · 5. ecartVol = randInt(6, 12)
  // · 6. marge = randFloat(0.5, 1.5, 1). T = 5 fixe.
  // mode 'taux' : rB = rA + écart, vol inchangée — le budget gonfle ET le call renchérit,
  // l'effet budget domine. mode 'vol' : volB = volA + écart, taux inchangé — budget identique
  // au centime, call plus cher, la participation fond. Les DEUX calls (blackScholesCall)
  // sont donnés dans l'énoncé ; réponse = participation dans l'environnement B, en %.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const mode = pick(rng, ['taux', 'vol'] as const);
    const rA = randFloat(rng, 2, 3.5, 1);
    const ecartTaux = randInt(rng, 1, 3);
    const volA = randInt(rng, 15, 22);
    const ecartVol = randInt(rng, 6, 12);
    const marge = randFloat(rng, 0.5, 1.5, 1);

    const T = 5;
    const estTaux = mode === 'taux';
    const rB = estTaux ? r2(rA + ecartTaux) : rA;
    const volB = estTaux ? volA : volA + ecartVol;
    const zcA = r2(prixZeroCoupon(rA, T));
    const zcB = r2(prixZeroCoupon(rB, T));
    const budgetA = r2(budgetOptions(prixZeroCoupon(rA, T), marge));
    const budgetB = r2(budgetOptions(prixZeroCoupon(rB, T), marge));
    const callA = r2(blackScholesCall(100, 100, rA, volA, T));
    const callB = r2(blackScholesCall(100, 100, rB, volB, T));
    const pA = r2(100 * participationCapitalGaranti(budgetA, callA));
    const reponse = r2(100 * participationCapitalGaranti(budgetB, callB));
    const deltaP = r2(reponse - pA);

    const en = langue === 'en';
    const { f, pct, sgn } = formatters(langue);
    return {
      enonce: en
        ? estTaux
          ? `In January, your 5-year capital-guaranteed note prices with a risk-free rate of ${pct(rA, 1)} (continuous compounding), implied volatility ${pct(volA, 0)}, margin ${pct(marge, 1)}: the ATM call quotes ${pct(callA, 2)} of the nominal and the displayed participation is ${pct(pA, 1)}. Six months later, rates have climbed to ${pct(rB, 1)}; the same call now quotes ${pct(callB, 2)}, volatility and margin unchanged.\n\n**What participation can the new vintage display, in %?**`
          : `In January, your 5-year capital-guaranteed note prices with a risk-free rate of ${pct(rA, 1)} (continuous compounding), implied volatility ${pct(volA, 0)}, margin ${pct(marge, 1)}: the ATM call quotes ${pct(callA, 2)} of the nominal and the displayed participation is ${pct(pA, 1)}. Six months later, implied volatility has jumped to ${pct(volB, 0)}; the same call now quotes ${pct(callB, 2)}, rates and margin unchanged.\n\n**What participation can the new vintage display, in %?**`
        : estTaux
          ? `En janvier, votre capital garanti 5 ans se price avec un taux sans risque de ${pct(rA, 1)} (composition continue), une volatilité implicite de ${pct(volA, 0)}, une marge de ${pct(marge, 1)} : le call ATM cote ${pct(callA, 2)} du nominal et la participation affichée vaut ${pct(pA, 1)}. Six mois plus tard, les taux sont montés à ${pct(rB, 1)} ; le même call cote désormais ${pct(callB, 2)}, volatilité et marge inchangées.\n\n**Quelle participation le nouveau millésime peut-il afficher, en % ?**`
          : `En janvier, votre capital garanti 5 ans se price avec un taux sans risque de ${pct(rA, 1)} (composition continue), une volatilité implicite de ${pct(volA, 0)}, une marge de ${pct(marge, 1)} : le call ATM cote ${pct(callA, 2)} du nominal et la participation affichée vaut ${pct(pA, 1)}. Six mois plus tard, la volatilité implicite a bondi à ${pct(volB, 0)} ; le même call cote désormais ${pct(callB, 2)}, taux et marge inchangés.\n\n**Quelle participation le nouveau millésime peut-il afficher, en % ?**`,
      reponse,
      tolerance: 0.3,
      toleranceMode: 'absolu',
      unite: '%',
      etapes: [
        {
          titre: en ? 'Re-price the guarantee, re-cut the budget' : 'Re-pricer la garantie, retailler le budget',
          contenu: en
            ? estTaux
              ? `New zero-coupon: $100\\,e^{-${f(rB, 1)}\\,\\% × 5}$ = **${f(zcB, 2)}**, against ${f(zcA, 2)} in January — higher rates make the guarantee cheaper. New budget: $100 - ${f(zcB, 2)} - ${f(marge, 1)}$ = **${pct(budgetB, 2)}**, against ${f(budgetA, 2)} before: the rate shock hands the structurer ${f(r2(budgetB - budgetA), 2)} extra points to spend.`
              : `The zero-coupon depends on r and T only: $100\\,e^{-${f(rB, 1)}\\,\\% × 5}$ = **${f(zcB, 2)}**, unchanged to the cent, and the budget stays at $100 - ${f(zcB, 2)} - ${f(marge, 1)}$ = **${pct(budgetB, 2)}**. A volatility shock does not move ONE euro of the budget — σ appears nowhere in $e^{-rT}$.`
            : estTaux
              ? `Nouveau zéro-coupon : $100\\,e^{-${f(rB, 1)}\\,\\% × 5}$ = **${f(zcB, 2)}**, contre ${f(zcA, 2)} en janvier — des taux plus hauts rendent la garantie moins chère. Nouveau budget : $100 - ${f(zcB, 2)} - ${f(marge, 1)}$ = **${pct(budgetB, 2)}**, contre ${f(budgetA, 2)} avant : le choc de taux offre au structureur ${f(r2(budgetB - budgetA), 2)} points de plus à dépenser.`
              : `Le zéro-coupon ne dépend que de r et T : $100\\,e^{-${f(rB, 1)}\\,\\% × 5}$ = **${f(zcB, 2)}**, inchangé au centime, et le budget reste à $100 - ${f(zcB, 2)} - ${f(marge, 1)}$ = **${pct(budgetB, 2)}**. Un choc de volatilité ne déplace pas UN euro du budget — σ n'apparaît nulle part dans $e^{-rT}$.`,
        },
        {
          titre: en ? 'The same division, new inputs' : 'La même division, nouvelles entrées',
          contenu: en
            ? `$p = \\dfrac{\\text{budget}}{\\text{ATM call}} = \\dfrac{${f(budgetB, 2)}}{${f(callB, 2)}}$ = **${pct(reponse, 2)}**, against ${pct(pA, 2)} in January — a move of ${sgn(deltaP, 2)} points of participation for the same product on the same index.`
            : `$p = \\dfrac{\\text{budget}}{\\text{call ATM}} = \\dfrac{${f(budgetB, 2)}}{${f(callB, 2)}}$ = **${pct(reponse, 2)}**, contre ${pct(pA, 2)} en janvier — un mouvement de ${sgn(deltaP, 2)} points de participation pour le même produit sur le même indice.`,
        },
        {
          titre: en ? (estTaux ? 'The budget effect crushes the premium effect' : 'The client of a guarantee BUYS volatility') : estTaux ? 'L\'effet budget écrase l\'effet prime' : 'Le client d\'un capital garanti ACHÈTE la volatilité',
          contenu: en
            ? estTaux
              ? `Both floors of the fraction moved in opposite directions: the budget swelled (${f(budgetA, 2)} → ${f(budgetB, 2)}) while the call got dearer (${f(callA, 2)} → ${f(callB, 2)} — Black-Scholes calls rise with r). The budget effect dominates by far, and the arrow is worth memorising: rates ↑ ⇒ zero-coupon ↓ ⇒ budget ↑ ⇒ participation ↑. The generosity of guaranteed products is a thermometer of long rates, not a feat of engineering.`
              : `Same budget to the cent, dearer call (${f(callA, 2)} → ${f(callB, 2)} — vega, module 8): the participation melts from ${pct(pA, 1)} to ${pct(reponse, 1)}. The buyer of participation pays volatility at its market price: the best vintages of capital-guaranteed notes are built in CALM markets, on quiet underlyings — and the mirror product (the reverse convertible, which SELLS volatility) loves exactly the opposite weather.`
            : estTaux
              ? `Les deux étages de la fraction ont bougé en sens opposés : le budget a gonflé (${f(budgetA, 2)} → ${f(budgetB, 2)}) pendant que le call renchérissait (${f(callA, 2)} → ${f(callB, 2)} — le call Black-Scholes est croissant en r). L'effet budget domine largement, et la flèche mérite d'être mémorisée : taux ↑ ⇒ zéro-coupon ↓ ⇒ budget ↑ ⇒ participation ↑. La générosité des produits garantis est un thermomètre des taux longs, pas un exploit d'ingénierie.`
              : `Budget identique au centime, call plus cher (${f(callA, 2)} → ${f(callB, 2)} — le vega, module 8) : la participation fond de ${pct(pA, 1)} à ${pct(reponse, 1)}. L'acheteur de participation paie la volatilité à son prix de marché : les meilleurs millésimes de capital garanti se fabriquent dans les marchés CALMES, sur des sous-jacents tranquilles — et le produit miroir (le reverse convertible, qui VEND de la volatilité) aime exactement la météo inverse.`,
        },
      ],
      pieges: [
        en
          ? estTaux
            ? `Concluding "dearer call ⇒ lower participation": wrong here, because rates moved BOTH floors of the fraction. The budget effect (through the zero-coupon) dominates the premium effect: the participation ROSE by ${f(Math.abs(deltaP), 1)} points despite the dearer call. Always re-price the budget before reading the division.`
            : `Recomputing the budget: with an unchanged rate, the zero-coupon has not moved and the budget is IDENTICAL — the whole shock passes through the call's price. Splitting the effect between the two floors of the fraction double-counts it and misses the true reading: pure vega.`
          : estTaux
            ? `Conclure « call plus cher ⇒ participation plus basse » : faux ici, car les taux ont bougé les DEUX étages de la fraction. L'effet budget (via le zéro-coupon) domine l'effet prime : la participation a MONTÉ de ${f(Math.abs(deltaP), 1)} points malgré le call renchéri. Re-pricez toujours le budget avant de lire la division.`
            : `Recalculer le budget : à taux inchangé, le zéro-coupon n'a pas bougé et le budget est IDENTIQUE — tout le choc passe par le prix du call. Répartir l'effet entre les deux étages de la fraction le compte deux fois et rate la vraie lecture : du pur vega.`,
        en
          ? `Comparing the two participations as if they were the same product: ${pct(pA, 1)} in January and ${pct(reponse, 1)} today are two different market quotes, not two levels of generosity. One never compares two participations — one compares two formulas, priced on their respective market days.`
          : `Comparer les deux participations comme si c'était le même produit : ${pct(pA, 1)} en janvier et ${pct(reponse, 1)} aujourd'hui sont deux cotes de marché différentes, pas deux niveaux de générosité. On ne compare jamais deux participations — on compare deux formules, pricées chacune aux conditions de marché de leur jour.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 4. Le remboursement du capital garanti plafonné (N1)
// ---------------------------------------------------------------------------
export const genRemboursementCap: ExerciseGenerator = {
  id: 'm9-ex-04',
  moduleId: M9,
  titre: 'Le remboursement du capital garanti plafonné',
  titreEn: 'The capped capital-guaranteed redemption',
  difficulte: 1,
  // Tirages (ordre strict) : 1. p = randInt(55, 95) · 2. cap = pick([25, 30, 35, 40, 50])
  // · 3. scenario = pick(['dessus', 'dessous', 'baisse']) · 4. hausseAuDela = randInt(5, 40)
  // · 5. hausseSous = randInt(5, cap − 5) · 6. niveauBaisse = randInt(60, 95).
  // S_T selon le scénario, performance retenue = max(min(perf, cap), 0),
  // remboursement = 100 + p × retenue — la rustine « cap » du chapitre 2 (call spread).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const p = randInt(rng, 55, 95);
    const cap = pick(rng, [25, 30, 35, 40, 50] as const);
    const scenario = pick(rng, ['dessus', 'dessous', 'baisse'] as const);
    const hausseAuDela = randInt(rng, 5, 40);
    const hausseSous = randInt(rng, 5, cap - 5);
    const niveauBaisse = randInt(rng, 60, 95);

    const sT = scenario === 'dessus' ? 100 + cap + hausseAuDela : scenario === 'dessous' ? 100 + hausseSous : niveauBaisse;
    const perf = sT - 100;
    const retenue = Math.max(Math.min(perf, cap), 0);
    const reponse = r2(100 + (p / 100) * retenue);
    const fauxSansCap = r2(100 + (p / 100) * perf);
    const fauxSansParticipation = r2(100 + retenue);

    const en = langue === 'en';
    const { f, pct } = formatters(langue);
    return {
      enonce: en
        ? `A capital-guaranteed note on an equity index (initial level 100) redeems at maturity 100 plus ${pct(p, 0)} of the index's positive performance, capped at +${pct(cap, 0)}. At maturity the index closes at ${f(sT, 0)}.\n\n**What redemption does the client receive, in % of the nominal?**`
        : `Un capital garanti sur indice actions (niveau initial 100) rembourse à l'échéance 100 plus ${pct(p, 0)} de la performance positive de l'indice, plafonnée à +${pct(cap, 0)}. À maturité, l'indice cote ${f(sT, 0)}.\n\n**Quel remboursement le client reçoit-il, en % du nominal ?**`,
      reponse,
      tolerance: 0.1,
      toleranceMode: 'absolu',
      unite: '%',
      etapes: [
        {
          titre: en ? 'The performance the formula retains' : 'La performance que la formule retient',
          contenu: en
            ? `Raw performance: $(S_T - S_0)/S_0 = (${f(sT, 0)} - 100)/100$ = **${pct(perf, 0)}**. The formula clips it twice: floor at zero (the guarantee — no negative performance ever reaches the client) and ceiling at the cap: $\\text{retained} = \\max(\\min(${f(perf, 0)}\\,\\%,\\ ${f(cap, 0)}\\,\\%),\\ 0)$ = **${pct(retenue, 0)}**.`
            : `Performance brute : $(S_T - S_0)/S_0 = (${f(sT, 0)} - 100)/100$ = **${pct(perf, 0)}**. La formule la rabote deux fois : plancher à zéro (la garantie — aucune performance négative n'atteint jamais le client) et plafond au cap : $\\text{retenue} = \\max(\\min(${f(perf, 0)}\\,\\%,\\ ${f(cap, 0)}\\,\\%),\\ 0)$ = **${pct(retenue, 0)}**.`,
        },
        {
          titre: en ? 'The redemption' : 'Le remboursement',
          contenu: en
            ? `$\\text{redemption} = 100 + p × \\text{retained} = 100 + ${f(p, 0)}\\,\\% × ${f(retenue, 0)}$ = **${pct(reponse, 2)}** of the nominal. ${scenario === 'baisse' ? 'The index fell, the client gets 100 — not one euro less, and not one euro more: the worst case of a guaranteed note is not a loss, it is an opportunity cost (years immobilised at zero return).' : scenario === 'dessus' ? `The index rose ${f(perf, 0)} points but only ${f(cap, 0)} count: everything above the cap belongs to the option the structurer SOLD to finance the flattering participation.` : 'The cap did not bite here: below the ceiling, the product pays like a plain capped-free note — the cap only shows its teeth in the big rallies.'}`
            : `$\\text{remboursement} = 100 + p × \\text{retenue} = 100 + ${f(p, 0)}\\,\\% × ${f(retenue, 0)}$ = **${pct(reponse, 2)}** du nominal. ${scenario === 'baisse' ? 'L\'indice a baissé, le client touche 100 — pas un euro de moins, ni un de plus : le pire scénario d\'un capital garanti n\'est pas une perte, c\'est un coût d\'opportunité (des années immobilisées pour un rendement nul).' : scenario === 'dessus' ? `L'indice a gagné ${f(perf, 0)} points mais seuls ${f(cap, 0)} comptent : tout ce qui dépasse le cap appartient à l'option que le structureur a VENDUE pour financer la participation flatteuse.` : 'Le cap n\'a pas mordu ici : sous le plafond, le produit paie comme sans cap — le plafond ne montre les dents que dans les grands rallyes.'}`,
        },
        {
          titre: en ? 'Where the cap comes from: a call spread' : 'D\'où vient le cap : un call spread',
          contenu: en
            ? `A capped participation is bought with a *call spread* (buy the ATM call, sell the ${f(100 + cap, 0)} call — module 8 grammar: every sold leg cuts the cost and abandons a piece of the profile). The sold leg refunds part of the premium, so the same budget displays a bigger $p$ — that is how shop windows show "118% of the performance" with an asterisk. Reading rule: a participation number means nothing until you have read the exact definition of "the performance" — final or averaged? capped at what?`
            : `Une participation plafonnée s'achète avec un *call spread* (acheter le call ATM, vendre le call ${f(100 + cap, 0)} — grammaire du module 8 : toute jambe vendue réduit le coût et abandonne un morceau du profil). La jambe vendue rembourse une partie de la prime, donc le même budget affiche un $p$ plus gros — c'est ainsi que les vitrines affichent « 118 % de la performance » avec un astérisque. Règle de lecture : un chiffre de participation ne veut rien dire tant qu'on n'a pas lu la définition exacte de « la performance » — finale ou moyennée ? plafonnée à combien ?`,
        },
      ],
      pieges: [
        en
          ? scenario === 'dessus'
            ? `Forgetting the cap: $100 + ${f(p, 0)}\\,\\% × ${f(perf, 0)} = ${f(fauxSansCap, 2)}$ instead of ${f(reponse, 2)}. The cap is precisely the clause that made the displayed participation possible — ignoring it at maturity is reading the shop window and skipping the asterisk.`
            : scenario === 'baisse'
              ? `Applying the participation to the fall: $100 + ${f(p, 0)}\\,\\% × (${f(perf, 0)}) = ${f(fauxSansCap, 2)}$. The $\\max(\\cdot, 0)$ is the whole point of the product: the client bought a CALL, not the index — the downside belongs to nobody but the zero-coupon, which pays 100.`
              : `Applying the cap anyway: the ceiling only clips performances ABOVE ${f(cap, 0)} % — here ${f(perf, 0)} % passes untouched. Symmetrically, do not forget the participation: $100 + ${f(retenue, 0)} = ${f(fauxSansParticipation, 2)}$ is the payoff of a 100 % participation product, which this is not.`
          : scenario === 'dessus'
            ? `Oublier le cap : $100 + ${f(p, 0)}\\,\\% × ${f(perf, 0)} = ${f(fauxSansCap, 2)}$ au lieu de ${f(reponse, 2)}. Le cap est précisément la clause qui a rendu possible la participation affichée — l'ignorer à maturité, c'est lire la vitrine en sautant l'astérisque.`
            : scenario === 'baisse'
              ? `Appliquer la participation à la baisse : $100 + ${f(p, 0)}\\,\\% × (${f(perf, 0)}) = ${f(fauxSansCap, 2)}$. Le $\\max(\\cdot, 0)$ est tout le produit : le client a acheté un CALL, pas l'indice — la baisse ne regarde que le zéro-coupon, qui paie 100.`
              : `Appliquer le cap quand même : le plafond ne rabote que les performances AU-DESSUS de ${f(cap, 0)} % — ici ${f(perf, 0)} % passe intact. Symétriquement, ne pas oublier la participation : $100 + ${f(retenue, 0)} = ${f(fauxSansParticipation, 2)}$ est le payoff d'un produit à participation 100 %, ce que celui-ci n'est pas.`,
        en
          ? `Believing the guarantee lives at all times: the 100 floor holds AT MATURITY only, and subject to the issuer's signature (Lehman 2008). In between, the note trades at the price of its bricks — a rate rise sinks the zero-coupon, and selling back a "guaranteed" note at 85 violates nothing.`
          : `Croire que la garantie vit à tout instant : le plancher de 100 ne vaut qu'À MATURITÉ, et à la signature de l'émetteur près (Lehman 2008). Entre-temps, la note cote au prix de ses briques — une hausse des taux fait plonger le zéro-coupon, et revendre à 85 un produit « garanti » ne viole rien.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 5. Le coupon du reverse convertible (N2)
// ---------------------------------------------------------------------------
export const genCouponReverse: ExerciseGenerator = {
  id: 'm9-ex-05',
  moduleId: M9,
  titre: 'Le coupon du reverse convertible',
  titreEn: 'The reverse convertible coupon',
  difficulte: 2,
  // Tirages (ordre strict) : 1. r = randFloat(2, 5, 1) · 2. T = pick([1, 1.5, 2])
  // · 3. vol = randInt(18, 35).
  // Le put ATM est PRICÉ par blackScholesPut(100, 100, r, vol, T) et DONNÉ dans
  // l'énoncé (le structureur achète/vend ses briques au desk options). Réponse =
  // couponReverseConvertible(prime, r, T) : (100 − ZC + prime)/e^{−rT}/T, en %/an.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const r = randFloat(rng, 2, 5, 1);
    const T = pick(rng, [1, 1.5, 2] as const);
    const vol = randInt(rng, 18, 35);

    const zc = r2(prixZeroCoupon(r, T));
    const put = r2(blackScholesPut(100, 100, r, vol, T));
    const disponible = r2(100 - zc + put);
    const reponse = r2(couponReverseConvertible(put, r, T));
    const couponSansRisque = r2(couponReverseConvertible(0, r, T));
    const partPrime = r2(reponse - couponSansRisque);
    const fauxSansCapitaliser = r2(disponible / T);

    const en = langue === 'en';
    const { f, pct } = formatters(langue);
    const horizon = libelleMaturite(T, en);
    return {
      enonce: en
        ? `You are structuring a ${horizon} reverse convertible on a stock trading at 100, strike 100 (physical delivery below the strike). The continuously compounded risk-free rate is ${pct(r, 1)}, and the options desk quotes the at-the-money put (implied volatility ${pct(vol, 0)}) at ${pct(put, 2)} of the nominal.\n\n**What fair annual coupon (before margin) can the structure pay, in % of the nominal per year?**`
        : `Vous structurez un reverse convertible de ${horizon} sur une action cotée 100, strike 100 (remise en titres sous le strike). Le taux sans risque en composition continue vaut ${pct(r, 1)}, et le desk options cote le put à la monnaie (volatilité implicite ${pct(vol, 0)}) à ${pct(put, 2)} du nominal.\n\n**Quel coupon annuel équitable (hors marge) la structure peut-elle verser, en % du nominal par an ?**`,
      reponse,
      tolerance: 0.15,
      toleranceMode: 'absolu',
      unite: '%',
      etapes: [
        {
          titre: en ? 'Follow the money: a loan plus an insurance sold' : 'Suivre l\'argent : un prêt plus une assurance vendue',
          contenu: en
            ? `The client brings 100. The structurer parks a zero-coupon, $100\\,e^{-rT} = 100 × e^{-${f(r, 1)}\\,\\% × ${f(T, 1)}}$ = **${f(zc, 2)}**, which will give the nominal back — and, ON THE CLIENT'S BEHALF, sells the ATM put to the desk: the premium of ${f(put, 2)} lands in the till today. Available today: $100 - ${f(zc, 2)} + ${f(put, 2)}$ = **${f(disponible, 2)}**.`
            : `Le client apporte 100. Le structureur loge un zéro-coupon, $100\\,e^{-rT} = 100 × e^{-${f(r, 1)}\\,\\% × ${f(T, 1)}}$ = **${f(zc, 2)}**, qui redonnera le nominal — et, AU NOM DU CLIENT, vend le put ATM au desk : la prime de ${f(put, 2)} tombe dans la caisse aujourd'hui. Disponible du jour : $100 - ${f(zc, 2)} + ${f(put, 2)}$ = **${f(disponible, 2)}**.`,
        },
        {
          titre: en ? 'Capitalise, then spread over the years' : 'Capitaliser, puis répartir sur les années',
          contenu: en
            ? `The available cash is collected TODAY and earns the risk-free rate until maturity, then gets spread per year: $\\text{coupon} = \\dfrac{100 - ZC + \\text{premium}}{e^{-rT} × T} = \\dfrac{${f(disponible, 2)}}{${f(r2(zc / 100), 4)} × ${f(T, 1)}}$ = **${pct(reponse, 2)}** per year. That is the number in big print on the brochure.`
            : `Le disponible est encaissé AUJOURD'HUI et fructifie au taux sans risque jusqu'à l'échéance, puis se répartit par année : $\\text{coupon} = \\dfrac{100 - ZC + \\text{prime}}{e^{-rT} × T} = \\dfrac{${f(disponible, 2)}}{${f(r2(zc / 100), 4)} × ${f(T, 1)}}$ = **${pct(reponse, 2)}** par an. C'est le chiffre en gros caractères de la brochure.`,
        },
        {
          titre: en ? 'The split that tells the whole truth' : 'Le découpage qui dit toute la vérité',
          contenu: en
            ? `Set the premium to zero and the formula returns **${pct(couponSansRisque, 2)}** — the capitalised risk-free rate, what the same loan would pay with no risk at all. The remaining **${f(partPrime, 2)}** points are the capitalised premium of the insurance the client just sold. The module's reading grid: every coupon point above the risk-free rate is the price of a risk sold — in front of any "8% when rates are at 3%" product, ask *which option did I sell without knowing?*`
            : `Posez prime nulle et la formule rend **${pct(couponSansRisque, 2)}** — le taux sans risque capitalisé, ce que paierait le même prêt sans aucun risque. Les **${f(partPrime, 2)}** points restants sont la prime capitalisée de l'assurance que le client vient de vendre. La grille de lecture du module : tout point de coupon au-dessus du taux sans risque est le prix d'un risque vendu — devant n'importe quel produit « à 8 % quand les taux sont à 3 % », demandez *quelle option ai-je vendue sans le savoir ?*`,
        },
      ],
      pieges: [
        en
          ? `Dividing without capitalising: $${f(disponible, 2)}/${f(T, 1)} = ${pct(fauxSansCapitaliser, 2)}$ instead of ${pct(reponse, 2)}. The available cash is in hand today and earns the risk-free rate until maturity — skipping the $÷\\,e^{-rT}$ shortchanges the coupon.`
          : `Diviser sans capitaliser : $${f(disponible, 2)}/${f(T, 1)} = ${pct(fauxSansCapitaliser, 2)}$ au lieu de ${pct(reponse, 2)}. Le disponible est en caisse aujourd'hui et fructifie au taux sans risque jusqu'à l'échéance — sauter le $÷\\,e^{-rT}$ ampute le coupon.`,
        en
          ? `Reading "coupon paid in all cases" as "guaranteed return": the coupon IS always paid, but the client's return is coupon PLUS capital variation — below the strike he is delivered the stock and takes the whole fall. The certain number is the small one; the uncertain number is the big one. And "it's a scam" is the symmetric error: it is a correctly priced put sale — the problem is never the product, it is the gap between what it is and what the buyer believes it is.`
          : `Lire « coupon versé dans tous les cas » comme « rendement garanti » : le coupon EST toujours versé, mais le rendement du client est coupon PLUS variation du capital — sous le strike, il reçoit les titres et subit toute la baisse. Le chiffre certain est le petit, le chiffre incertain est le gros. Et « c'est une arnaque » est l'erreur symétrique : c'est une vente de put correctement pricée — le problème n'est jamais le produit, c'est l'écart entre ce qu'il est et ce que l'acheteur croit qu'il est.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 6. Le P&L du porteur de reverse convertible (N2)
// ---------------------------------------------------------------------------
export const genPnlReverse: ExerciseGenerator = {
  id: 'm9-ex-06',
  moduleId: M9,
  titre: 'Le P&L du porteur de reverse convertible',
  titreEn: 'The reverse convertible holder\'s P&L',
  difficulte: 2,
  // Tirages (ordre strict) : 1. coupon = randFloat(8, 14, 1) · 2. scenario =
  // pick(['chute', 'sousStrike', 'dessus']) · 3. sChute = randInt(50, 80)
  // · 4. sSous = randInt(85, 99) · 5. sDessus = randInt(101, 130).
  // Strike = niveau initial = 100, T = 1 an, remise en titres (100/K = 1 titre).
  // Sous le strike : reçu = S_T + coupon ; sinon : 100 + coupon. P&L = reçu − 100.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const coupon = randFloat(rng, 8, 14, 1);
    const scenario = pick(rng, ['chute', 'sousStrike', 'dessus'] as const);
    const sChute = randInt(rng, 50, 80);
    const sSous = randInt(rng, 85, 99);
    const sDessus = randInt(rng, 101, 130);

    const sT = scenario === 'chute' ? sChute : scenario === 'sousStrike' ? sSous : sDessus;
    const recu = sT < 100 ? r2(sT + coupon) : r2(100 + coupon);
    const reponse = r2(recu - 100);
    const pointMort = r2(100 - coupon);
    const pnlActionnaire = r2(sT - 100);

    const en = langue === 'en';
    const { f, pct, sgn } = formatters(langue);
    return {
      enonce: en
        ? `One year ago, a client invested 100 in a 1-year reverse convertible on a stock (initial level and strike both 100): coupon of ${pct(coupon, 1)} "paid in all cases", physical delivery of the shares below the strike (100/K = 1 share per 100 of nominal). At maturity the stock trades at ${f(sT, 0)}.\n\n**What is the client's total P&L, in % of the nominal (sign included)?**`
        : `Il y a un an, un client a investi 100 dans un reverse convertible d'un an sur une action (niveau initial et strike à 100) : coupon de ${pct(coupon, 1)} « versé dans tous les cas », remise en titres sous le strike (100/K = 1 titre par 100 de nominal). À maturité, l'action cote ${f(sT, 0)}.\n\n**Quel est le P&L total du client, en % du nominal (signe compris) ?**`,
      reponse,
      tolerance: 0.1,
      toleranceMode: 'absolu',
      unite: '%',
      etapes: [
        {
          titre: en ? 'What the structure delivers' : 'Ce que la structure verse',
          contenu: en
            ? sT < 100
              ? `${f(sT, 0)} < 100: the strike is breached, physical delivery applies — the client receives one share worth **${f(sT, 0)}**, plus the coupon of ${f(coupon, 1)} which is indeed paid (the brochure did not lie). Total received: $${f(sT, 0)} + ${f(coupon, 1)}$ = **${f(recu, 2)}**. The put he had sold has just been exercised against him: he "bought" at 100 (his nominal) a share worth less.`
              : `${f(sT, 0)} ≥ 100: the stock finished at or above the strike — the client gets his 100 back plus the coupon of ${f(coupon, 1)}. Total received: **${f(recu, 2)}**. Note that ${f(sT, 0)} or 200 would pay exactly the same: the upside beyond the coupon does not belong to him, he sold it.`
            : sT < 100
              ? `${f(sT, 0)} < 100 : le strike est enfoncé, la remise en titres s'applique — le client reçoit un titre valant **${f(sT, 0)}**, plus le coupon de ${f(coupon, 1)} qui est bel et bien versé (la brochure ne mentait pas). Total reçu : $${f(sT, 0)} + ${f(coupon, 1)}$ = **${f(recu, 2)}**. Le put qu'il avait vendu vient de s'exercer contre lui : il « achète » à 100 (son nominal) un titre qui vaut moins.`
              : `${f(sT, 0)} ≥ 100 : l'action finit au niveau du strike ou au-dessus — le client récupère ses 100 plus le coupon de ${f(coupon, 1)}. Total reçu : **${f(recu, 2)}**. Notez que ${f(sT, 0)} ou 200 paieraient exactement pareil : la hausse au-delà du coupon ne lui appartient pas, il l'a vendue.`,
        },
        {
          titre: en ? 'The P&L and the break-even' : 'Le P&L et le point mort',
          contenu: en
            ? `$\\text{P\\&L} = ${f(recu, 2)} - 100$ = **${sgn(reponse, 2)}** per 100 invested. The break-even sits at $100 - \\text{coupon} = ${f(pointMort, 1)}$: as long as the stock loses less than the coupon, the holder stays ahead; below, every euro of fall is his. The gain, meanwhile, is CAPPED at +${f(coupon, 1)} whatever happens — the whole distribution of happy scenarios is crushed onto one number.`
            : `$\\text{P\\&L} = ${f(recu, 2)} - 100$ = **${sgn(reponse, 2)}** pour 100 investis. Le point mort est à $100 - \\text{coupon} = ${f(pointMort, 1)}$ : tant que l'action perd moins que le coupon, le porteur reste gagnant ; en dessous, chaque euro de baisse est pour lui. Le gain, lui, est PLAFONNÉ à +${f(coupon, 1)} quoi qu'il arrive — toute la distribution des scénarios heureux est écrasée sur un seul chiffre.`,
        },
        {
          titre: en ? 'The comparison that anaesthetises' : 'La comparaison qui anesthésie',
          contenu: en
            ? sT < 100
              ? `The direct shareholder is at ${sgn(pnlActionnaire, 0)}; the note holder at ${sgn(reponse, 2)}. "He loses less than the shareholder" — true, and that is the commercial argument. But the coupon was the PRICE of the risk that just materialised, not a consolation prize on top: the insurer collected his premium, then the claim arrived. And receiving shares rather than cash feeds the illusion that "waiting for the rebound" erases the loss.`
              : `The direct shareholder is at ${sgn(pnlActionnaire, 0)}; the note holder at ${sgn(reponse, 2)}. The note wins when the stock stagnates — that is its natural habitat: a moderately constructive view, held by someone who would sell that put knowingly. In a real rally, the shareholder leaves the note holder far behind: the upside was traded away for the coupon, literally (with $S = K$, the available cash equals the price of the abandoned call — put-call parity, module 8).`
            : sT < 100
              ? `L'actionnaire direct est à ${sgn(pnlActionnaire, 0)} ; le porteur de la note à ${sgn(reponse, 2)}. « Il perd moins que l'actionnaire » — c'est vrai, et c'est l'argument commercial. Mais le coupon était le PRIX du risque qui vient de se matérialiser, pas un lot de consolation par-dessus : l'assureur a encaissé sa prime, puis le sinistre est arrivé. Et recevoir des titres plutôt que du cash entretient l'illusion qu'« attendre que ça remonte » effacera la perte.`
              : `L'actionnaire direct est à ${sgn(pnlActionnaire, 0)} ; le porteur de la note à ${sgn(reponse, 2)}. La note gagne quand l'action stagne — c'est son habitat naturel : une vue modérément constructive, tenue par quelqu'un qui vendrait ce put en connaissance de cause. Dans un vrai rallye, l'actionnaire laisse le porteur loin derrière : la hausse a été troquée contre le coupon, littéralement (avec $S = K$, le disponible vaut le prix du call abandonné — parité call-put, module 8).`,
        },
      ],
      pieges: [
        en
          ? `Reading "guaranteed coupon" as "guaranteed capital": answering +${f(coupon, 1)} whatever $S_T$. The coupon is certain, the capital is not — the P&L is coupon PLUS capital variation, and below the strike the delivery of shares passes the whole fall to the client.`
          : `Lire « coupon garanti » comme « capital garanti » : répondre +${f(coupon, 1)} quel que soit $S_T$. Le coupon est certain, le capital ne l'est pas — le P&L est coupon PLUS variation du capital, et sous le strike la remise en titres transmet toute la baisse au client.`,
        en
          ? sT < 100
            ? `Stopping at "he beat the shareholder" (${sgn(reponse, 2)} against ${sgn(pnlActionnaire, 0)}): the comparison forgets that in every happy scenario the shareholder's gain is unlimited while the holder's is capped at +${f(coupon, 1)}. An insurer who pays out a claim did not "win" because the claim could have been bigger.`
            : `Forgetting the cap in the happy scenario: at $S_T = ${f(sT, 0)}$, answering ${sgn(pnlActionnaire, 0)} (the shareholder's P&L) instead of +${f(coupon, 1)}. Above the strike, the note holder's world is flat: 100 plus the coupon, never a euro more — he sold the upside the day he signed.`
          : sT < 100
            ? `S'arrêter à « il a battu l'actionnaire » (${sgn(reponse, 2)} contre ${sgn(pnlActionnaire, 0)}) : la comparaison oublie que dans tous les scénarios heureux le gain de l'actionnaire est illimité quand celui du porteur plafonne à +${f(coupon, 1)}. Un assureur qui paie un sinistre n'a pas « gagné » parce que le sinistre aurait pu être plus gros.`
            : `Oublier le plafond dans le scénario heureux : à $S_T = ${f(sT, 0)}$, répondre ${sgn(pnlActionnaire, 0)} (le P&L de l'actionnaire) au lieu de +${f(coupon, 1)}. Au-dessus du strike, le monde du porteur est plat : 100 plus le coupon, jamais un euro de plus — il a vendu la hausse le jour de la signature.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 7. Le payoff du down-and-in put (N1)
// ---------------------------------------------------------------------------
export const genPayoffDIP: ExerciseGenerator = {
  id: 'm9-ex-07',
  moduleId: M9,
  titre: 'Le payoff du down-and-in put',
  titreEn: 'The down-and-in put payoff',
  difficulte: 1,
  // Tirages (ordre strict) : 1. barriere = pick([60, 70, 80]) · 2. scenario =
  // pick(['activePaie', 'nonActive', 'activeFinitDessus']) · 3. minTouche =
  // randInt(B − 15, B) · 4. minNonTouche = randInt(B + 3, B + 15) · 5. sTPaie =
  // randInt(B, 95) · 6. sTNonActive = randInt(minNonTouche, 97) · 7. sTDessus = randInt(101, 130).
  // Strike = 100 (niveau initial), minimum de trajectoire DONNÉ dans l'énoncé.
  // Réponse = payoffDownAndInPut(sT, min, 100, B) — l'indicatrice d'abord, le put ensuite.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const barriere = pick(rng, [60, 70, 80] as const);
    const scenario = pick(rng, ['activePaie', 'nonActive', 'activeFinitDessus'] as const);
    const minTouche = randInt(rng, barriere - 15, barriere);
    const minNonTouche = randInt(rng, barriere + 3, barriere + 15);
    const sTPaie = randInt(rng, barriere, 95);
    const sTNonActive = randInt(rng, minNonTouche, 97);
    const sTDessus = randInt(rng, 101, 130);

    const minimum = scenario === 'nonActive' ? minNonTouche : minTouche;
    const sT = scenario === 'activePaie' ? sTPaie : scenario === 'nonActive' ? sTNonActive : sTDessus;
    const touche = minimum <= barriere;
    const reponse = r2(payoffDownAndInPut(sT, minimum, 100, barriere));
    const payoffVanille = r2(Math.max(100 - sT, 0));

    const en = langue === 'en';
    const { f, eur } = formatters(langue);
    return {
      enonce: en
        ? `A down-and-in put with strike 100 and barrier ${f(barriere, 0)} (daily observation) on a stock that started at 100. Over the product's life, the lowest level ever touched by the stock is ${f(minimum, 0)}, and it finishes at ${f(sT, 0)}.\n\n**What payoff does the put deliver at maturity, in €?**`
        : `Un put down-and-in de strike 100 et de barrière ${f(barriere, 0)} (observation quotidienne) sur une action partie de 100. Sur la vie du produit, le plus bas touché par l'action est ${f(minimum, 0)}, et elle termine à ${f(sT, 0)}.\n\n**Quel payoff le put verse-t-il à l'échéance, en € ?**`,
      reponse,
      tolerance: 0.01,
      toleranceMode: 'absolu',
      unite: '€',
      etapes: [
        {
          titre: en ? 'The barrier first: is the put born?' : 'La barrière d\'abord : le put est-il né ?',
          contenu: en
            ? touche
              ? `Minimum ${f(minimum, 0)} ≤ barrier ${f(barriere, 0)}: the indicator $\\mathbb{1}\\left\\{\\min_{t \\le T} S_t \\le B\\right\\}$ equals **1** — the barrier was touched, the put is ACTIVATED. From that moment on it is an ordinary vanilla put, and nothing can deactivate it: a barrier once touched stays touched, even if the stock later recovers.`
              : `Minimum ${f(minimum, 0)} > barrier ${f(barriere, 0)}: the indicator $\\mathbb{1}\\left\\{\\min_{t \\le T} S_t \\le B\\right\\}$ equals **0** — the barrier was never touched. The put was never born: it expires without ever having existed, whatever the final level.`
            : touche
              ? `Minimum ${f(minimum, 0)} ≤ barrière ${f(barriere, 0)} : l'indicatrice $\\mathbb{1}\\left\\{\\min_{t \\le T} S_t \\le B\\right\\}$ vaut **1** — la barrière a été touchée, le put est ACTIVÉ. Dès cet instant c'est un put vanille ordinaire, et rien ne peut le désactiver : une barrière touchée reste touchée, même si l'action remonte ensuite.`
              : `Minimum ${f(minimum, 0)} > barrière ${f(barriere, 0)} : l'indicatrice $\\mathbb{1}\\left\\{\\min_{t \\le T} S_t \\le B\\right\\}$ vaut **0** — la barrière n'a jamais été touchée. Le put n'est jamais né : il expire sans avoir existé, quel que soit le niveau final.`,
        },
        {
          titre: en ? 'Then the vanilla payoff' : 'Ensuite le payoff vanille',
          contenu: en
            ? scenario === 'activePaie'
              ? `Activated put, and $S_T = ${f(sT, 0)} < 100$: it pays $\\max(K - S_T,\\ 0) = \\max(100 - ${f(sT, 0)},\\ 0)$ = **${eur(reponse, 2)}**. Two conditions, both met: the trajectory touched the barrier AND the arrival is below the strike.`
              : scenario === 'nonActive'
                ? `Payoff = ${f(reponse, 0)}. The stock finishes at ${f(sT, 0)}, below the strike — a vanilla put would pay $100 - ${f(sT, 0)} = ${f(payoffVanille, 0)}$ — but the DIP pays **zero**: the min never reached ${f(barriere, 0)}, the option that should pay does not exist. This gap, trajectory by trajectory, is exactly why the DIP is cheaper than the vanilla.`
                : `Activated put, but $S_T = ${f(sT, 0)} \\ge 100$: $\\max(100 - ${f(sT, 0)},\\ 0)$ = **${f(reponse, 0)}**. Activation creates the put; payment still requires finishing below the strike. Touched then recovered: the client of an autocall lives this scenario as a relief — the desk as a hedging rollercoaster.`
            : scenario === 'activePaie'
              ? `Put activé, et $S_T = ${f(sT, 0)} < 100$ : il paie $\\max(K - S_T,\\ 0) = \\max(100 - ${f(sT, 0)},\\ 0)$ = **${eur(reponse, 2)}**. Deux conditions, toutes deux remplies : la trajectoire a touché la barrière ET l'arrivée est sous le strike.`
              : scenario === 'nonActive'
                ? `Payoff = ${f(reponse, 0)}. L'action finit à ${f(sT, 0)}, sous le strike — un put vanille paierait $100 - ${f(sT, 0)} = ${f(payoffVanille, 0)}$ — mais le DIP paie **zéro** : le minimum n'a jamais atteint ${f(barriere, 0)}, l'option qui devrait payer n'existe pas. Cet écart, trajectoire par trajectoire, est exactement ce qui rend le DIP moins cher que la vanille.`
                : `Put activé, mais $S_T = ${f(sT, 0)} \\ge 100$ : $\\max(100 - ${f(sT, 0)},\\ 0)$ = **${f(reponse, 0)}**. L'activation crée le put ; le paiement exige encore de finir sous le strike. Touchée puis remontée : le client d'un autocall vit ce scénario comme un soulagement — le desk comme des montagnes russes de couverture.`,
        },
        {
          titre: en ? 'Why this brick matters' : 'Pourquoi cette brique compte',
          contenu: en
            ? `This conditional put is THE brick of "protected" products: the reverse convertible with barrier and the autocall both make the client SELL it — the protection clause "capital repaid unless the barrier was touched" is its mirror image. Its payoff is ≤ the vanilla's in every state of the world, hence its lower price, hence the lower coupon it finances: the barrier is a commercial dial, never a free lunch.`
            : `Ce put conditionnel est LA brique des produits « protégés » : le reverse convertible à barrière et l'autocall le font tous deux VENDRE au client — la clause de protection « capital remboursé sauf si la barrière a été touchée » en est l'image miroir. Son payoff est ≤ celui de la vanille dans tous les états du monde, d'où son prix plus faible, d'où le coupon plus faible qu'il finance : la barrière est un curseur commercial, jamais un repas gratuit.`,
        },
      ],
      pieges: [
        en
          ? scenario === 'nonActive'
            ? `Confusing "finishes below the strike" with "pays": answering ${f(payoffVanille, 0)} is the VANILLA put's payoff. The DIP demands the barrier touched first — the min of ${f(minimum, 0)} stayed above ${f(barriere, 0)}, so the answer is 0, and that clemency (accidents recovered before touching the barrier are forgiven) is what the seller of the DIP gives up in premium.`
            : scenario === 'activeFinitDessus'
              ? `Believing that touching the barrier triggers a payment: activation only CREATES the put. At $S_T = ${f(sT, 0)}$ the put is out of the money — payoff 0. Symmetrically, remember the barrier never "un-touches": had the stock finished at 90, the put would pay 10 even with the stock far above ${f(barriere, 0)} at maturity.`
              : `Believing the recovery above the barrier deactivates the put: the minimum of ${f(minimum, 0)} touched ${f(barriere, 0)} and that is final — the indicator never switches back to 0. The put pays like a vanilla from the touch onwards; only $S_T$ decides the amount.`
          : scenario === 'nonActive'
            ? `Confondre « finit sous le strike » et « paie » : répondre ${f(payoffVanille, 0)} est le payoff du put VANILLE. Le DIP exige d'abord la barrière touchée — le minimum de ${f(minimum, 0)} est resté au-dessus de ${f(barriere, 0)}, donc la réponse est 0, et cette clémence (les accidents rattrapés avant de toucher la barrière sont pardonnés) est ce que le vendeur du DIP abandonne en prime.`
            : scenario === 'activeFinitDessus'
              ? `Croire que toucher la barrière déclenche un paiement : l'activation ne fait que CRÉER le put. À $S_T = ${f(sT, 0)}$, le put est hors de la monnaie — payoff 0. Symétriquement, retenez qu'une barrière ne se « détouche » jamais : si l'action avait fini à 90, le put paierait 10 même avec l'action loin au-dessus de ${f(barriere, 0)} à l'échéance.`
              : `Croire que la remontée au-dessus de la barrière désactive le put : le minimum de ${f(minimum, 0)} a touché ${f(barriere, 0)} et c'est définitif — l'indicatrice ne rebascule jamais à 0. Le put paie comme une vanille dès le toucher ; seul $S_T$ décide du montant.`,
        en
          ? `Deducing "small premium, small risk" from the low price of the DIP: the price is low because the scenario is RARE, not because it is mild. Conditional on touching a barrier at ${f(barriere, 0)}, the average loss is enormous — a stock that has crossed −${f(100 - barriere, 0)}% does not stop there out of politeness. The DIP seller wrote catastrophe insurance: collect often, lose massively once.`
          : `Déduire « petite prime, petit risque » du prix faible du DIP : le prix est faible parce que le scénario est RARE, pas parce qu'il est doux. Conditionnellement au toucher d'une barrière à ${f(barriere, 0)}, la perte moyenne est énorme — une action qui a traversé −${f(100 - barriere, 0)} % ne s'arrête pas là par politesse. Le vendeur de DIP a signé une assurance catastrophe : encaisser souvent, perdre énormément une fois.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 8. Le déroulé de l'autocall (N2)
// ---------------------------------------------------------------------------
export const genDerouleAutocall: ExerciseGenerator = {
  id: 'm9-ex-08',
  moduleId: M9,
  titre: 'Le déroulé de l\'autocall',
  titreEn: 'Walking through the autocall',
  difficulte: 2,
  // Tirages (ordre strict) : 1. couponPct = randInt(5, 9) · 2. r = randFloat(2, 4, 1)
  // · 3. protection = pick([50, 60]) · 4. scenario = pick(['rappel', 'protege', 'perte'])
  // · 5. periodeRappel = randInt(2, 4) · 6-10. cinq niveaux bas = randInt(70, 99) chacun
  // · 11. obsRappel = randInt(101, 125) · 12. sFinalProtege = randInt(protection + 3, 95)
  // · 13. sFinalPerte = randInt(30, protection − 5).
  // Athena 5 ans, dt = 1, rappel à 100 % : observations DONNÉES, mécanique via
  // payoffAutocall (coupon mémoire, protection à maturité seulement), réponse =
  // flux actualisé en continu à sa date (fluxActualise).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const couponPct = randInt(rng, 5, 9);
    const r = randFloat(rng, 2, 4, 1);
    const protection = pick(rng, [50, 60] as const);
    const scenario = pick(rng, ['rappel', 'protege', 'perte'] as const);
    const periodeRappel = randInt(rng, 2, 4);
    const basses = [randInt(rng, 70, 99), randInt(rng, 70, 99), randInt(rng, 70, 99), randInt(rng, 70, 99), randInt(rng, 70, 99)];
    const obsRappel = randInt(rng, 101, 125);
    const sFinalProtege = randInt(rng, protection + 3, 95);
    const sFinalPerte = randInt(rng, 30, protection - 5);

    const observations = basses.slice();
    if (scenario === 'rappel') observations[periodeRappel - 1] = obsRappel;
    else observations[4] = scenario === 'protege' ? sFinalProtege : sFinalPerte;

    const params: ParamsAutocall = {
      barriereRappelPct: 100,
      couponPct,
      barriereProtectionPct: protection,
      rPct: r,
      dtAnnees: 1,
      nbPeriodes: 5,
    };
    const resultat = payoffAutocall(observations, 100, params);
    const flux = r2(resultat.flux);
    const dateFlux = resultat.dateFlux;
    const reponse = r2(resultat.fluxActualise);
    const fauxActualiseMaturite = r2(resultat.flux * dfContinu(r, 5));

    const en = langue === 'en';
    const { f, pct } = formatters(langue);
    const listeObs = observations.map((o) => f(o, 0)).join(en ? ', ' : ' ; ');
    return {
      enonce: en
        ? `A 5-year Athena autocall on an index (initial level 100): annual observations, autocall trigger at 100% of the initial level, memory coupon of ${pct(couponPct, 0)} per year, protection barrier at ${pct(protection, 0)} observed at maturity only, continuously compounded risk-free rate ${pct(r, 1)}. At the five anniversary dates, the index prints: ${listeObs}.\n\n**What single cash flow does the client receive, discounted continuously back to today, in % of the nominal?**`
        : `Un autocall Athena 5 ans sur indice (niveau initial 100) : observations annuelles, barrière de rappel à 100 % du niveau initial, coupon à effet mémoire de ${pct(couponPct, 0)} par an, barrière de protection à ${pct(protection, 0)} observée à maturité seulement, taux sans risque en composition continue ${pct(r, 1)}. Aux cinq dates anniversaires, l'indice relève : ${listeObs}.\n\n**Quel flux unique le client reçoit-il, actualisé en continu à aujourd'hui, en % du nominal ?**`,
      reponse,
      tolerance: 0.2,
      toleranceMode: 'absolu',
      unite: '%',
      etapes: [
        {
          titre: en ? 'Run the observations through the machine' : 'Passer les observations dans la machine',
          contenu: en
            ? scenario === 'rappel'
              ? `Years 1 to ${f(periodeRappel - 1, 0)}: every print is below 100 — no recall, no coupon, but the memory keeps count. Year ${f(periodeRappel, 0)}: ${f(obsRappel, 0)} ≥ 100 — **automatic recall**. The product dies on the spot; the later observations will never exist. Note that dipping below 100 along the way cancelled nothing: only the protection barrier threatens the capital, and it is only read at maturity.`
              : scenario === 'protege'
                ? `All five prints are below 100: the product is never recalled and crawls to maturity, without ever paying a coupon. At maturity, the protection barrier is read — for the first and only time: $S_5 = ${f(sFinalProtege, 0)} \\ge ${f(protection, 0)}$, the capital is safe.`
                : `All five prints are below 100: never recalled, no coupon, the product goes to maturity. There, the protection barrier is read — for the first and only time: $S_5 = ${f(sFinalPerte, 0)} < ${f(protection, 0)}$. The down-and-in put the client had implicitly sold wakes up: degraded redemption $S_5/S_0 × 100$.`
            : scenario === 'rappel'
              ? `Années 1 à ${f(periodeRappel - 1, 0)} : chaque relevé est sous 100 — pas de rappel, pas de coupon, mais la mémoire tient le compte. Année ${f(periodeRappel, 0)} : ${f(obsRappel, 0)} ≥ 100 — **rappel automatique**. Le produit meurt sur-le-champ ; les observations suivantes n'existeront jamais. Notez que passer sous 100 en chemin n'a rien annulé : seule la barrière de protection menace le capital, et elle ne se lit qu'à maturité.`
              : scenario === 'protege'
                ? `Les cinq relevés sont sous 100 : le produit n'est jamais rappelé et rampe jusqu'à maturité, sans jamais verser de coupon. À maturité, la barrière de protection se lit — pour la première et seule fois : $S_5 = ${f(sFinalProtege, 0)} \\ge ${f(protection, 0)}$, le capital est sauf.`
                : `Les cinq relevés sont sous 100 : jamais rappelé, aucun coupon, le produit va à maturité. Là, la barrière de protection se lit — pour la première et seule fois : $S_5 = ${f(sFinalPerte, 0)} < ${f(protection, 0)}$. Le put down-and-in que le client avait implicitement vendu se réveille : remboursement dégradé $S_5/S_0 × 100$.`,
        },
        {
          titre: en ? 'The single flow and its date' : 'Le flux unique et sa date',
          contenu: en
            ? scenario === 'rappel'
              ? `Memory effect: the recall pays the current year's coupon plus all the missed ones, in one go — $\\text{flow} = 100 + c × i = 100 + ${f(couponPct, 0)} × ${f(periodeRappel, 0)}$ = **${f(flux, 0)}**, paid at $t = ${f(dateFlux, 0)}$ years. ${f(periodeRappel - 1, 0)} blank year(s) caught up at once.`
              : scenario === 'protege'
                ? `Above the protection barrier without ever triggering the recall: the client gets **100**, at $t = 5$ years — and not one coupon. "Capital safe" hides the invisible cost: five years immobilised for a zero return, while the risk-free rate was running at ${pct(r, 1)}.`
                : `Degraded redemption: $\\text{flow} = 100 × S_5/S_0 = 100 × ${f(sFinalPerte, 0)}/100$ = **${f(flux, 0)}**, at $t = 5$ years. The protection was not a cushion but a cliff: at ${f(protection, 0)} the client would touch 100, at ${f(sFinalPerte, 0)} he takes the ENTIRE fall from the initial level — not just the part below the barrier.`
            : scenario === 'rappel'
              ? `Effet mémoire : le rappel paie le coupon de l'année en cours plus tous ceux des années blanches, d'un coup — $\\text{flux} = 100 + c × i = 100 + ${f(couponPct, 0)} × ${f(periodeRappel, 0)}$ = **${f(flux, 0)}**, versé en $t = ${f(dateFlux, 0)}$ ans. ${f(periodeRappel - 1, 0)} année(s) blanche(s) rattrapée(s) d'un coup.`
              : scenario === 'protege'
                ? `Au-dessus de la barrière de protection sans jamais avoir déclenché le rappel : le client touche **100**, en $t = 5$ ans — et pas un coupon. « Capital sauf » cache le coût invisible : cinq ans immobilisés pour un rendement nul, pendant que le taux sans risque courait à ${pct(r, 1)}.`
                : `Remboursement dégradé : $\\text{flux} = 100 × S_5/S_0 = 100 × ${f(sFinalPerte, 0)}/100$ = **${f(flux, 0)}**, en $t = 5$ ans. La protection n'était pas un amortisseur mais une falaise : à ${f(protection, 0)} le client toucherait 100, à ${f(sFinalPerte, 0)} il subit la baisse ENTIÈRE depuis le niveau initial — pas seulement la part sous la barrière.`,
        },
        {
          titre: en ? 'Discount at the date of the flow' : 'Actualiser à la date du flux',
          contenu: en
            ? `Continuous discounting, at the flow's own date: $${f(flux, 0)} × e^{-${f(r, 1)}\\,\\% × ${f(dateFlux, 0)}}$ = **${pct(reponse, 2)}** of the nominal. This is exactly what the Monte-Carlo pricer averages over thousands of trajectories — one mechanical walk-through, one discounted flow per path, and the mean is the price.`
            : `Actualisation continue, à la date propre du flux : $${f(flux, 0)} × e^{-${f(r, 1)}\\,\\% × ${f(dateFlux, 0)}}$ = **${pct(reponse, 2)}** du nominal. C'est exactement ce que le pricer Monte-Carlo moyenne sur des milliers de trajectoires — un déroulé mécanique, un flux actualisé par trajectoire, et la moyenne est le prix.`,
        },
      ],
      pieges: [
        en
          ? scenario === 'rappel'
            ? `Paying coupons along the way, or discounting at the facial maturity: the memory pays NOTHING before the recall (a print below 100 is a blank year, not a lost coupon), and the flow leaves at $t = ${f(dateFlux, 0)}$, not at 5 years — $${f(flux, 0)} × e^{-${f(r, 1)}\\,\\% × 5} = ${f(fauxActualiseMaturite, 2)}$ instead of ${f(reponse, 2)}.`
            : scenario === 'protege'
              ? `Granting a coupon at maturity because $S_5 \\ge ${f(protection, 0)}$: the protection barrier protects the CAPITAL, it pays no coupon — coupons only ever travel with a recall at 100 %. The correct flow is 100, flat, after five years of memory that never got the chance to pay.`
              : `Believing the barrier caps the loss at −${f(100 - protection, 0)} %: at ${f(sFinalPerte, 0)}, the client receives ${f(flux, 0)} — the whole fall from 100, as if he had held the index. The barrier decides IF the put exists, never how much it costs: one index point separates 100 from ${f(flux, 0)}.`
          : scenario === 'rappel'
            ? `Verser les coupons en chemin, ou actualiser à la maturité faciale : la mémoire ne paie RIEN avant le rappel (un relevé sous 100 est une année blanche, pas un coupon perdu), et le flux part en $t = ${f(dateFlux, 0)}$, pas à 5 ans — $${f(flux, 0)} × e^{-${f(r, 1)}\\,\\% × 5} = ${f(fauxActualiseMaturite, 2)}$ au lieu de ${f(reponse, 2)}.`
            : scenario === 'protege'
              ? `Accorder un coupon à maturité parce que $S_5 \\ge ${f(protection, 0)}$ : la barrière de protection protège le CAPITAL, elle ne paie aucun coupon — les coupons ne voyagent jamais qu'avec un rappel à 100 %. Le bon flux est 100, tout rond, après cinq ans d'une mémoire qui n'a jamais eu l'occasion de payer.`
              : `Croire que la barrière plafonne la perte à −${f(100 - protection, 0)} % : à ${f(sFinalPerte, 0)}, le client reçoit ${f(flux, 0)} — toute la baisse depuis 100, comme s'il avait détenu l'indice. La barrière décide SI le put existe, jamais combien il coûte : un point d'indice sépare 100 de ${f(flux, 0)}.`,
        en
          ? `Reading "5 years" as the product's duration: the recall makes it random — short when the market rises (and the client must reinvest higher, with a new margin), long when it falls (stuck without coupons). On risk-neutral trajectories more than half of these products die at the first observation; the facial maturity describes the tail of the distribution, not its centre.`
          : `Lire « 5 ans » comme la durée du produit : le rappel la rend aléatoire — courte quand le marché monte (et le client doit se replacer plus haut, avec une nouvelle marge), longue quand il baisse (collé sans coupon). Sur les trajectoires risque-neutres, plus d'un produit sur deux meurt à la première observation ; la maturité faciale décrit la queue de la distribution, pas son centre.`,
      ],
    };
  },
};

/** Bornes réalistes du ratio prix DIP / prix vanille selon la barrière (cf. ch. 5 :
 * 0,24/5,57 ≈ 0,04 à B = 60 ; 1,45/5,57 ≈ 0,26 à B = 70 ; 3,82/5,57 ≈ 0,69 à B = 80). */
const BORNES_FACTEUR_DIP: Record<60 | 70 | 80, readonly [number, number]> = {
  60: [0.03, 0.12],
  70: [0.2, 0.4],
  80: [0.55, 0.75],
};

// ---------------------------------------------------------------------------
// 9. Le down-and-in put contre le put vanille (N2)
// ---------------------------------------------------------------------------
export const genDipContreVanille: ExerciseGenerator = {
  id: 'm9-ex-09',
  moduleId: M9,
  titre: 'Le down-and-in put contre le put vanille',
  titreEn: 'The down-and-in put versus the vanilla put',
  difficulte: 2,
  // Tirages (ordre strict) : 1. r = randFloat(2, 5, 1) · 2. vol = randInt(18, 30)
  // · 3. barriere = pick([60, 70, 80]) · 4. facteur = randFloat(bornes[B], 2).
  // T = 1 an, strike = 100. La vanille est PRICÉE par blackScholesPut et donnée ;
  // le DIP est un résultat Monte-Carlo DONNÉ (vanille × facteur, bornes réalistes
  // par barrière — AUCUN appel MC ici). Réponse = vanille − DIP, l'écart de prime.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const r = randFloat(rng, 2, 5, 1);
    const vol = randInt(rng, 18, 30);
    const barriere = pick(rng, [60, 70, 80] as const);
    const facteur = randFloat(rng, BORNES_FACTEUR_DIP[barriere][0], BORNES_FACTEUR_DIP[barriere][1], 2);

    const vanille = r2(blackScholesPut(100, 100, r, vol, 1));
    const dip = r2(vanille * facteur);
    const reponse = r2(vanille - dip);
    const ratioPct = r2(100 * (dip / vanille));

    const en = langue === 'en';
    const { f, pct } = formatters(langue);
    return {
      enonce: en
        ? `On a stock trading at 100, the desk quotes the 1-year vanilla put, strike 100 (implied volatility ${pct(vol, 0)}, risk-free rate ${pct(r, 1)}), at ${pct(vanille, 2)} of the nominal. Your Monte-Carlo pricer (200,000 paths, daily observation, fixed seed) prices the down-and-in put with the same strike and maturity, barrier ${f(barriere, 0)}, at ${pct(dip, 2)}.\n\n**By how much does the premium collected shrink if the client sells the DIP instead of the vanilla put, in % of the nominal?**`
        : `Sur une action cotée 100, le desk cote le put vanille 1 an de strike 100 (volatilité implicite ${pct(vol, 0)}, taux sans risque ${pct(r, 1)}) à ${pct(vanille, 2)} du nominal. Votre pricer Monte-Carlo (200 000 trajectoires, observation quotidienne, graine figée) donne pour le put down-and-in de mêmes strike et échéance, barrière ${f(barriere, 0)}, un prix de ${pct(dip, 2)}.\n\n**De combien la prime encaissée fond-elle si le client vend le DIP plutôt que le put vanille, en % du nominal ?**`,
      reponse,
      tolerance: 0.05,
      toleranceMode: 'absolu',
      unite: '%',
      etapes: [
        {
          titre: en ? 'An inequality that needs no model' : 'Une inégalité qui ne demande aucun modèle',
          contenu: en
            ? `Compare the two payoffs path by path: when the minimum touched ${f(barriere, 0)}, the DIP pays exactly what the vanilla pays; when it did not, the DIP pays zero where the vanilla could pay. Its payoff is ≤ the vanilla's in EVERY state of the world — so its price must be lower today, whatever the model: $\\text{DIP} \\le \\text{vanilla put}$, always. A pricer that ever returns the opposite is broken (and the limit case barrier = strike, where the DIP becomes the vanilla again, is one of the consistency tests that lock the course's engine).`
            : `Comparez les deux payoffs trajectoire par trajectoire : quand le minimum a touché ${f(barriere, 0)}, le DIP paie exactement ce que paie la vanille ; quand il ne l'a pas touché, le DIP paie zéro là où la vanille pouvait payer. Son payoff est ≤ celui de la vanille dans TOUS les états du monde — donc son prix d'aujourd'hui est plus faible, quel que soit le modèle : $\\text{DIP} \\le \\text{put vanille}$, toujours. Un pricer qui rend l'inverse est cassé (et le cas limite barrière = strike, où le DIP redevient la vanille, est l'un des tests de cohérence qui verrouillent le moteur du cours).`,
        },
        {
          titre: en ? 'The gap, and what it says' : 'L\'écart, et ce qu\'il raconte',
          contenu: en
            ? `$\\text{gap} = ${f(vanille, 2)} - ${f(dip, 2)}$ = **${pct(reponse, 2)}** of the nominal: the DIP retains only ${pct(ratioPct, 0)} of the vanilla's value. Almost all of a put's worth comes from scenarios where the stock does NOT collapse all the way to ${f(barriere, 0)} — remove those scenarios and the option empties out.`
            : `$\\text{écart} = ${f(vanille, 2)} - ${f(dip, 2)}$ = **${pct(reponse, 2)}** du nominal : le DIP ne retient que ${pct(ratioPct, 0)} de la valeur de la vanille. Presque toute la valeur d'un put vient de scénarios où l'action ne s'effondre PAS jusqu'à ${f(barriere, 0)} — retirez ces scénarios et l'option se vide.`,
        },
        {
          titre: en ? 'The commercial dial' : 'Le curseur commercial',
          contenu: en
            ? `Recycled into a coupon, this smaller premium buys a smaller coupon: the barrier is a dial on one single frontier — lower barrier, more probable protection, thinner coupon. No setting delivers both the fat coupon and the real protection; a term sheet claiming otherwise is hiding an ingredient (longer maturity, wilder underlying, worst-of…). The height of the barrier, and its observation frequency, are the first small print a desk reads.`
            : `Recyclée en coupon, cette prime plus faible achète un coupon plus faible : la barrière est un curseur sur une même frontière — barrière plus basse, protection plus probable, coupon plus maigre. Aucun réglage ne donne à la fois le gros coupon et la vraie protection ; la term sheet qui prétend le contraire cache un ingrédient (maturité plus longue, sous-jacent plus nerveux, worst-of…). La hauteur de la barrière, et sa fréquence d'observation, sont les premières petites lettres qu'un desk lit.`,
        },
      ],
      pieges: [
        en
          ? `Believing a DIP could quote above the vanilla "because the barrier adds risk": the barrier removes payoffs, it never adds any — the price is increasing in the barrier level and capped by the vanilla. Sanity-check every barrier quote against these two bounds before using it.`
          : `Croire qu'un DIP puisse coter au-dessus de la vanille « parce que la barrière ajoute du risque » : la barrière retire des payoffs, elle n'en ajoute jamais — le prix est croissant en la hauteur de barrière et plafonné par la vanille. Testez chaque cote à barrière contre ces deux bornes avant de vous en servir.`,
        en
          ? `Reading the small DIP premium as a small risk for its seller: the premium is the probability-weighted average of a frequent zero and a rare, enormous claim — conditional on touching −${f(100 - barriere, 0)}%, the loss is massive. Selling the DIP is writing catastrophe insurance, the module 8 put sale in concentrated form.`
          : `Lire la petite prime du DIP comme un petit risque pour son vendeur : la prime est la moyenne pondérée d'un zéro fréquent et d'un sinistre rare et énorme — conditionnellement au toucher de −${f(100 - barriere, 0)} %, la perte est massive. Vendre le DIP, c'est signer une assurance catastrophe, la vente de puts du module 8 en concentré.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 10. Le payoff du worst-of (N2)
// ---------------------------------------------------------------------------
export const genPayoffWorstOfExo: ExerciseGenerator = {
  id: 'm9-ex-10',
  moduleId: M9,
  titre: 'Le payoff du worst-of',
  titreEn: 'The worst-of payoff',
  difficulte: 2,
  // Tirages (ordre strict) : 1. s02 = pick([50, 80, 150, 200]) · 2. perf1 = randInt(−15, 40)
  // · 3. perf2Brut = randInt(−15, 40), décalé de +7 si égal à perf1 (aucun tirage
  // supplémentaire — même graine, mêmes nombres dans les deux langues).
  // Indice A part de 100, indice B de s02 (niveaux initiaux différents pour forcer
  // la normalisation). Réponse = payoffWorstOf(sT1, sT2, 100, s02, 100), en % du nominal.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const s02 = pick(rng, [50, 80, 150, 200] as const);
    const perf1 = randInt(rng, -15, 40);
    const perf2Brut = randInt(rng, -15, 40);

    const perf2 = perf2Brut === perf1 ? perf2Brut + 7 : perf2Brut;
    const sT1 = 100 + perf1;
    const sT2 = r2(s02 * (1 + perf2 / 100));
    const pire = Math.min(perf1, perf2);
    const reponse = r2(payoffWorstOf(sT1, sT2, 100, s02, 100));
    const fauxMoyenne = r2(Math.max((perf1 + perf2) / 2, 0));
    const fauxMeilleur = r2(Math.max(Math.max(perf1, perf2), 0));

    const en = langue === 'en';
    const { f, pct, sgn } = formatters(langue);
    return {
      enonce: en
        ? `A worst-of call, strike 100% of the initial levels, on two indices: index A starts at 100, index B at ${f(s02, 0)}. At maturity, A trades at ${f(sT1, 0)} and B at ${f(sT2, 2)}.\n\n**What payoff does the call deliver, in % of the nominal?**`
        : `Un call worst-of de strike 100 % des niveaux initiaux, sur deux indices : l'indice A part de 100, l'indice B de ${f(s02, 0)}. À maturité, A cote ${f(sT1, 0)} et B cote ${f(sT2, 2)}.\n\n**Quel payoff le call verse-t-il, en % du nominal ?**`,
      reponse,
      tolerance: 0.1,
      toleranceMode: 'absolu',
      unite: '%',
      etapes: [
        {
          titre: en ? 'Bring each index back to its performance' : 'Ramener chaque indice à sa performance',
          contenu: en
            ? `Absolute levels mean nothing here — each underlying is rebased to its own starting point: A: $${f(sT1, 0)}/100$ = **${sgn(perf1, 0)}%** ; B: $${f(sT2, 2)}/${f(s02, 0)}$ = **${sgn(perf2, 0)}%**. The term sheet always says "the performance of", never "the level of": a stock at 55 that started at 50 is UP 10%, whatever the neighbours quote.`
            : `Les niveaux absolus ne disent rien ici — chaque sous-jacent est ramené à son propre point de départ : A : $${f(sT1, 0)}/100$ = **${sgn(perf1, 0)} %** ; B : $${f(sT2, 2)}/${f(s02, 0)}$ = **${sgn(perf2, 0)} %**. La term sheet dit toujours « la performance de », jamais « le niveau de » : un titre à 55 parti de 50 a GAGNÉ 10 %, quoi que cotent les voisins.`,
        },
        {
          titre: en ? 'The minimum, then the kink' : 'Le minimum, puis le coude',
          contenu: en
            ? `Only the worst counts: $\\min(${sgn(perf1, 0)}\\,\\%,\\ ${sgn(perf2, 0)}\\,\\%)$ = **${sgn(pire, 0)}%**. Then the module 8 kink: $\\text{payoff} = 100 × \\max(\\text{worst} - 0,\\ 0)$ = **${pct(reponse, 2)}** of the nominal. ${reponse === 0 ? 'One index disappointing is enough to zero the whole payoff — the other\'s rally counts for nothing.' : 'Both indices had to rise for this payoff to exist: the worst-of only pays when EVERYONE delivers.'}`
            : `Seul le pire compte : $\\min(${sgn(perf1, 0)}\\,\\%,\\ ${sgn(perf2, 0)}\\,\\%)$ = **${sgn(pire, 0)} %**. Puis le coude du module 8 : $\\text{payoff} = 100 × \\max(\\text{pire} - 0,\\ 0)$ = **${pct(reponse, 2)}** du nominal. ${reponse === 0 ? 'Qu\'un seul indice déçoive suffit à annuler tout le payoff — le rallye de l\'autre ne compte pour rien.' : 'Il a fallu que les deux indices montent pour que ce payoff existe : le worst-of ne paie que quand TOUT LE MONDE livre.'}`,
        },
        {
          titre: en ? 'Why structurers love this brick' : 'Pourquoi les structureurs adorent cette brique',
          contenu: en
            ? `Unfavourable by construction — to rise, all must rise; to disappoint, one stumble suffices, and the expectation of the minimum always sits below the minimum of expectations — the worst-of call is far cheaper than a vanilla on either index: the same options budget buys a much bigger DISPLAYED participation. The dial that sets the discount is the correlation, and the client, who compares coupons but never correlations, does not see it.`
            : `Défavorable par construction — pour monter, il faut que tous montent ; pour décevoir, un seul faux pas suffit, et l'espérance du minimum est toujours sous le minimum des espérances — le call worst-of coûte bien moins cher qu'une vanille sur l'un ou l'autre indice : le même budget d'options achète une participation AFFICHÉE bien plus grosse. Le curseur qui règle la décote est la corrélation, et le client, qui compare des coupons mais jamais des corrélations, ne la voit pas.`,
        },
      ],
      pieges: [
        en
          ? `Comparing absolute levels: ${f(sT2, 2)} ${sT2 < sT1 ? 'looks lower than' : 'looks higher than'} ${f(sT1, 0)}, but B started at ${f(s02, 0)} — only rebased performances enter the formula. The "worst" is the worst PERFORMER (${sgn(pire, 0)}%), not the lowest print.`
          : `Comparer les niveaux absolus : ${f(sT2, 2)} ${sT2 < sT1 ? 'semble plus bas que' : 'semble plus haut que'} ${f(sT1, 0)}, mais B partait de ${f(s02, 0)} — seules les performances rebasées entrent dans la formule. Le « pire » est la pire PERFORMANCE (${sgn(pire, 0)} %), pas le relevé le plus bas.`,
        en
          ? `Averaging (${pct(fauxMoyenne, 1)}) or taking the best (${pct(fauxMeilleur, 1)}): the basket's diversification benefits whoever receives its AVERAGE, never whoever receives its minimum. The client of a worst-of holds the anti-diversified version of the basket — that is precisely what makes the option cheap.`
          : `Moyenner (${pct(fauxMoyenne, 1)}) ou prendre le meilleur (${pct(fauxMeilleur, 1)}) : la diversification du panier profite à qui touche sa MOYENNE, jamais à qui touche son minimum. Le client d'un worst-of détient la version anti-diversifiée du panier — c'est précisément ce qui rend l'option bon marché.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 11. La corrélation lue dans les prix (N3)
// ---------------------------------------------------------------------------
export const genCorrelationVitrine: ExerciseGenerator = {
  id: 'm9-ex-11',
  moduleId: M9,
  titre: 'La corrélation lue dans les prix',
  titreEn: 'Correlation read from the prices',
  difficulte: 3,
  // Tirages (ordre strict) : 1. r = randFloat(2, 3.5, 1) · 2. T = pick([4, 5])
  // · 3. marge = randFloat(0.5, 1.5, 1) · 4. rhoHaut = randFloat(0.7, 0.9, 2)
  // · 5. rhoBas = randFloat(0.2, 0.45, 2) · 6. prixHaut = randFloat(14, 20, 2)
  // · 7. facteurBaisse = randFloat(0.55, 0.75, 2).
  // Les DEUX prix du call worst-of sont des résultats Monte-Carlo DONNÉS (même
  // graine, seul ρ bouge — comparaison propre, aucun appel MC ici) ; prixBas =
  // prixHaut × facteur. Réponse = participation avec le pricing à ρ bas, en %.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const r = randFloat(rng, 2, 3.5, 1);
    const T = pick(rng, [4, 5] as const);
    const marge = randFloat(rng, 0.5, 1.5, 1);
    const rhoHaut = randFloat(rng, 0.7, 0.9, 2);
    const rhoBas = randFloat(rng, 0.2, 0.45, 2);
    const prixHaut = randFloat(rng, 14, 20, 2);
    const facteurBaisse = randFloat(rng, 0.55, 0.75, 2);

    const prixBas = r2(prixHaut * facteurBaisse);
    const zc = r2(prixZeroCoupon(r, T));
    const budget = r2(budgetOptions(prixZeroCoupon(r, T), marge));
    const pHaut = r2(100 * participationCapitalGaranti(budget, prixHaut));
    const reponse = r2(100 * participationCapitalGaranti(budget, prixBas));

    const en = langue === 'en';
    const { f, pct } = formatters(langue);
    const horizon = libelleMaturite(T, en);
    return {
      enonce: en
        ? `A ${horizon} capital-guaranteed note indexed on the WORST performance of two indices: continuously compounded risk-free rate ${pct(r, 1)}, total margin ${pct(marge, 1)}. Your Monte-Carlo pricer (200,000 paths, fixed seed — only ρ changes between runs) prices the ATM worst-of call at ${pct(prixHaut, 2)} of the nominal with a correlation of ${f(rhoHaut, 2)}, and at ${pct(prixBas, 2)} with a correlation of ${f(rhoBas, 2)}. The desk retains ${f(rhoBas, 2)} for the pricing.\n\n**What participation can the term sheet display, in %?**`
        : `Un capital garanti de ${horizon} indexé sur la PIRE performance de deux indices : taux sans risque en composition continue ${pct(r, 1)}, marge totale ${pct(marge, 1)}. Votre pricer Monte-Carlo (200 000 trajectoires, graine figée — seul ρ change entre les runs) donne pour le call worst-of ATM ${pct(prixHaut, 2)} du nominal avec une corrélation de ${f(rhoHaut, 2)}, et ${pct(prixBas, 2)} avec une corrélation de ${f(rhoBas, 2)}. Le desk retient ${f(rhoBas, 2)} pour le pricing.\n\n**Quelle participation la term sheet peut-elle afficher, en % ?**`,
      reponse,
      tolerance: 0.5,
      toleranceMode: 'absolu',
      unite: '%',
      etapes: [
        {
          titre: en ? 'The budget has not heard about correlation' : 'Le budget n\'a pas entendu parler de corrélation',
          contenu: en
            ? `Zero-coupon: $100\\,e^{-${f(r, 1)}\\,\\% × ${f(T, 0)}}$ = **${f(zc, 2)}** ; budget: $100 - ${f(zc, 2)} - ${f(marge, 1)}$ = **${pct(budget, 2)}** of the nominal. Neither ρ nor the choice of underlyings moves it by one cent — the guarantee side and the engine side of the product live separate lives.`
            : `Zéro-coupon : $100\\,e^{-${f(r, 1)}\\,\\% × ${f(T, 0)}}$ = **${f(zc, 2)}** ; budget : $100 - ${f(zc, 2)} - ${f(marge, 1)}$ = **${pct(budget, 2)}** du nominal. Ni ρ ni le choix des sous-jacents ne le déplacent d'un centime — le versant garantie et le versant moteur du produit vivent des vies séparées.`,
        },
        {
          titre: en ? 'The same division, with the worst-of brick' : 'La même division, avec la brique worst-of',
          contenu: en
            ? `$p = \\dfrac{\\text{budget}}{\\text{worst-of call}} = \\dfrac{${f(budget, 2)}}{${f(prixBas, 2)}}$ = **${pct(reponse, 1)}**, against ${pct(pHaut, 1)} had the pricing kept ρ = ${f(rhoHaut, 2)}. Same seed, same trajectories, one parameter moved: the whole gap between the two participations is the price of correlation. Lower ρ ⇒ more dispersion ⇒ the worst is worse ⇒ the call is cheaper ⇒ the SAME budget buys a fatter shop window.`
            : `$p = \\dfrac{\\text{budget}}{\\text{call worst-of}} = \\dfrac{${f(budget, 2)}}{${f(prixBas, 2)}}$ = **${pct(reponse, 1)}**, contre ${pct(pHaut, 1)} si le pricing avait retenu ρ = ${f(rhoHaut, 2)}. Même graine, mêmes trajectoires, un seul paramètre bougé : tout l'écart entre les deux participations est le prix de la corrélation. ρ plus bas ⇒ plus de dispersion ⇒ le pire est pire ⇒ le call est moins cher ⇒ le MÊME budget achète une vitrine plus flatteuse.`,
        },
        {
          titre: en ? 'The parameter the client cannot name' : 'Le paramètre que le client ne sait pas nommer',
          contenu: en
            ? `The client compares participations, never correlations — yet he just took a position on ρ: if the indices decouple, the worst sinks and the fat participation evaporates exactly when he counted on it. The extra shop-window generosity is the dispersion risk premium. On the other side, the desk that sold this worst-of engine is structurally SHORT correlation — and it is in crises, precisely, that correlations jump towards 1: book after book, structured desks have become the market's great buyers of correlation, their own clients being the involuntary source of the risk.`
            : `Le client compare des participations, jamais des corrélations — il vient pourtant de prendre position sur ρ : si les indices décrochent l'un de l'autre, le pire s'enfonce et la belle participation s'évapore exactement quand il comptait dessus. Le supplément de générosité de la vitrine est la prime du risque de dispersion. En face, le desk qui a vendu ce moteur worst-of est structurellement COURT de corrélation — et c'est en crise, précisément, que les corrélations bondissent vers 1 : book après book, les desks de structurés sont devenus les grands acheteurs de corrélation du marché, leur propre clientèle étant la source involontaire du risque.`,
        },
      ],
      pieges: [
        en
          ? `Reasoning "two indices = diversification = less risk, so the low ρ makes the product safer": diversification benefits whoever receives the basket's average — the worst-of client receives its MINIMUM, and dispersion is his enemy. Low correlation embellishes the window AND deepens the bad scenarios; the two effects are the same coin.`
          : `Raisonner « deux indices = diversification = moins de risque, donc le ρ bas rend le produit plus sûr » : la diversification profite à qui touche la moyenne du panier — le client du worst-of touche son MINIMUM, et la dispersion est son ennemie. La corrélation basse embellit la vitrine ET creuse les mauvais scénarios ; les deux effets sont la même pièce.`,
        en
          ? `Comparing ${pct(reponse, 1)} and ${pct(pHaut, 1)} as two levels of generosity: they are two quotes of the same product under two correlation assumptions. And beware the crisis clause: "it would take BOTH indices to collapse — improbable squared" is the independence fallacy; the scenario that kills the worst-of is ONE systemic event, whose probability is that of a crash, not of a crash squared.`
          : `Comparer ${pct(reponse, 1)} et ${pct(pHaut, 1)} comme deux niveaux de générosité : ce sont deux cotes du même produit sous deux hypothèses de corrélation. Et gare à la clause de crise : « il faudrait que les DEUX indices s'effondrent — improbable au carré » est le sophisme d'indépendance ; le scénario qui tue le worst-of est UN événement systémique, dont la probabilité est celle d'un krach, pas d'un krach au carré.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 12. La marge dans la décomposition (N2)
// ---------------------------------------------------------------------------
export const genMargeDecomposition: ExerciseGenerator = {
  id: 'm9-ex-12',
  moduleId: M9,
  titre: 'La marge dans la décomposition',
  titreEn: 'The margin inside the decomposition',
  difficulte: 2,
  // Tirages (ordre strict) : 1. r = randFloat(2, 5, 1) · 2. T = pick([4, 5, 6, 8])
  // · 3. valeurEmission = randFloat(97, 99, 1).
  // Marge totale = 100 − valeur d'émission (le chiffre du KID), réponse =
  // margeCommercialeAnnualisee(marge, T) ; la poche options se retrouve par
  // budgetOptions(ZC, marge) = valeur d'émission − ZC (décomposition 100 = ZC + options + marge).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const r = randFloat(rng, 2, 5, 1);
    const T = pick(rng, [4, 5, 6, 8] as const);
    const valeurEmission = randFloat(rng, 97, 99, 1);

    const margeTotale = r2(100 - valeurEmission);
    const reponse = r2(margeCommercialeAnnualisee(margeTotale, T));
    const zc = r2(prixZeroCoupon(r, T));
    const options = r2(budgetOptions(prixZeroCoupon(r, T), margeTotale));

    const en = langue === 'en';
    const { f, pct } = formatters(langue);
    const horizon = libelleMaturite(T, en);
    return {
      enonce: en
        ? `The KID of a ${horizon} capital-guaranteed structured note, sold at 100, discloses an issuance value of ${pct(valeurEmission, 1)} of the nominal; the continuously compounded risk-free rate is ${pct(r, 1)}.\n\n**What total annualised margin do the structurer and the distributor share, in % of the nominal per year?**`
        : `Le KID d'un produit structuré à capital garanti de ${horizon}, vendu 100, publie une valeur à l'émission de ${pct(valeurEmission, 1)} du nominal ; le taux sans risque en composition continue vaut ${pct(r, 1)}.\n\n**Quelle marge totale annualisée le structureur et le distributeur se partagent-ils, en % du nominal par an ?**`,
      reponse,
      tolerance: 0.02,
      toleranceMode: 'absolu',
      unite: '%',
      etapes: [
        {
          titre: en ? 'The total margin: 100 minus the KID value' : 'La marge totale : 100 moins la valeur du KID',
          contenu: en
            ? `The client pays 100 for a product worth ${f(valeurEmission, 1)} the very day he buys it: $\\text{total margin} = 100 - ${f(valeurEmission, 1)}$ = **${pct(margeTotale, 1)}** of the nominal, locked in at issuance whatever happens to the underlying — like the swap margin of module 7, or a market maker's spread. Nothing hidden: PRIIPs has forced this number into the KID since 2018.`
            : `Le client paie 100 un produit qui vaut ${f(valeurEmission, 1)} le jour même de l'achat : $\\text{marge totale} = 100 - ${f(valeurEmission, 1)}$ = **${pct(margeTotale, 1)}** du nominal, verrouillée à l'émission quoi qu'il arrive au sous-jacent — comme la marge du swap au module 7, ou la fourchette d'un market maker. Rien de caché : PRIIPs impose ce chiffre dans le KID depuis 2018.`,
        },
        {
          titre: en ? 'Annualise, the desk way' : 'Annualiser, à la façon des desks',
          contenu: en
            ? `$\\text{annualised margin} = \\dfrac{\\text{total margin}}{T} = \\dfrac{${f(margeTotale, 1)}}{${f(T, 0)}}$ = **${pct(reponse, 2)}** per year — the linear display convention of the desks, and squarely inside the market standard of 0.5 to 1% per year (structuring plus the distributor's retrocessions, which often take the bigger share).`
            : `$\\text{marge annualisée} = \\dfrac{\\text{marge totale}}{T} = \\dfrac{${f(margeTotale, 1)}}{${f(T, 0)}}$ = **${pct(reponse, 2)}** par an — la convention d'affichage linéaire des desks, en plein dans le standard de marché de 0,5 à 1 % par an (structuration plus rétrocessions du distributeur, qui en prennent souvent la plus grosse part).`,
        },
        {
          titre: en ? 'The full decomposition of the 100' : 'La décomposition complète des 100',
          contenu: en
            ? `At issuance: $100 = \\underbrace{${f(zc, 2)}}_{ZC} + \\underbrace{${f(options, 2)}}_{\\text{options}} + \\underbrace{${f(margeTotale, 1)}}_{\\text{margin}}$. The zero-coupon secures the capital, the options pocket ($${f(valeurEmission, 1)} - ${f(zc, 2)}$) buys the performance, and every euro of margin is one euro of options budget removed — a lower coupon or a thinner participation, never a visible fee line.`
            : `À l'émission : $100 = \\underbrace{${f(zc, 2)}}_{ZC} + \\underbrace{${f(options, 2)}}_{\\text{options}} + \\underbrace{${f(margeTotale, 1)}}_{\\text{marge}}$. Le zéro-coupon sécurise le capital, la poche d'options ($${f(valeurEmission, 1)} - ${f(zc, 2)}$) achète la performance, et chaque euro de marge est un euro de budget d'options en moins — un coupon plus bas ou une participation plus maigre, jamais une ligne de frais visible.`,
        },
      ],
      pieges: [
        en
          ? `Looking for the margin on a fee line: it does not exist as one — the margin lives INSIDE the price, deducted from the options budget before a single brick is bought. A structured note worth 97 to 99 on day one is not a scam, it is the price of manufacturing and distribution; the scandal would be a KID pretending it is worth 100.`
          : `Chercher la marge sur une ligne de frais : elle n'existe pas sous cette forme — la marge vit À L'INTÉRIEUR du prix, prélevée sur le budget d'options avant l'achat de la moindre brique. Un structuré qui vaut 97 à 99 le premier jour n'est pas une arnaque, c'est le prix de la fabrication et de la distribution ; le scandale serait un KID prétendant qu'il vaut 100.`,
        en
          ? `Annualising a callable product over its facial maturity: an autocall displayed "${f(T, 0)} years" lives on average around 2 — on its EFFECTIVE life, the annualised margin can more than double the ${pct(reponse, 2)} computed here. The facial division is the standard display, not the real cost per year of client money at work.`
          : `Annualiser un produit rappelable sur sa maturité faciale : un autocall affiché « ${f(T, 0)} ans » vit en moyenne autour de 2 — sur sa vie EFFECTIVE, la marge annualisée peut plus que doubler les ${pct(reponse, 2)} calculés ici. La division faciale est l'affichage standard, pas le vrai coût par année d'argent client au travail.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 13. L'erreur Monte-Carlo en 1/√n (N2)
// ---------------------------------------------------------------------------
export const genErreurMonteCarlo: ExerciseGenerator = {
  id: 'm9-ex-13',
  moduleId: M9,
  titre: 'L\'erreur Monte-Carlo en 1/√n',
  titreEn: 'The Monte-Carlo error in 1/√n',
  difficulte: 2,
  // Tirages (ordre strict) : 1. n1 = pick([10 000, 40 000, 90 000]) · 2. erreur1 =
  // randFloat(0.08, 0.2, 2) · 3. facteur = pick([2, 4, 5, 10]).
  // Erreur-type = σ_payoff/√n (TCL) : diviser l'erreur par k exige n × k².
  // Réponse = n1 × facteur² (nombre de simulations requis).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const n1 = pick(rng, [10_000, 40_000, 90_000] as const);
    const erreur1 = randFloat(rng, 0.08, 0.2, 2);
    const facteur = pick(rng, [2, 4, 5, 10] as const);

    const erreur2 = r4(erreur1 / facteur);
    const reponse = n1 * facteur * facteur;
    const fauxLineaire = n1 * facteur;

    const en = langue === 'en';
    const { f } = formatters(langue);
    return {
      enonce: en
        ? `Your Monte-Carlo pricer estimates an autocall's price with a standard error of ${f(erreur1, 2)} (in % of the nominal) using ${f(n1, 0)} simulations. The desk quotes a thin margin and demands a standard error of ${f(erreur2, 4)} at most.\n\n**How many simulations are needed, at minimum?**`
        : `Votre pricer Monte-Carlo estime le prix d'un autocall avec une erreur-type de ${f(erreur1, 2)} (en % du nominal) pour ${f(n1, 0)} simulations. Le desk cote une marge fine et exige une erreur-type d'au plus ${f(erreur2, 4)}.\n\n**Combien de simulations faut-il, au minimum ?**`,
      reponse,
      tolerance: 0.5,
      toleranceMode: 'absolu',
      unite: 'simulations',
      etapes: [
        {
          titre: en ? 'The law: a sample mean' : 'La loi : une moyenne d\'échantillon',
          contenu: en
            ? `A Monte-Carlo price is a mean of $n$ simulated payoffs, so the central limit theorem (module 2) rules its precision: $\\text{standard error} = \\dfrac{\\sigma_{\\text{payoff}}}{\\sqrt{n}}$. The payoff dispersion $\\sigma_{\\text{payoff}}$ is a property of the product; the only lever in the formula is $n$ — and it sits under a square root.`
            : `Un prix Monte-Carlo est une moyenne de $n$ payoffs simulés, donc le théorème central limite (module 2) commande sa précision : $\\text{erreur-type} = \\dfrac{\\sigma_{\\text{payoff}}}{\\sqrt{n}}$. La dispersion des payoffs $\\sigma_{\\text{payoff}}$ est une propriété du produit ; le seul levier de la formule est $n$ — et il vit sous une racine carrée.`,
        },
        {
          titre: en ? 'Divide the error by k, multiply n by k²' : 'Diviser l\'erreur par k, multiplier n par k²',
          contenu: en
            ? `Target: $${f(erreur1, 2)} → ${f(erreur2, 4)}$, an error divided by **${f(facteur, 0)}**. Since the error goes as $1/\\sqrt{n}$, $\\sqrt{n}$ must be multiplied by ${f(facteur, 0)}, hence $n$ by ${f(facteur, 0)}^2 = ${f(facteur * facteur, 0)}$: $n = ${f(n1, 0)} × ${f(facteur * facteur, 0)}$ = **${f(reponse, 0)}** simulations. The square-root curse of module 2, to the euro.`
            : `Cible : $${f(erreur1, 2)} → ${f(erreur2, 4)}$, une erreur divisée par **${f(facteur, 0)}**. Comme l'erreur va en $1/\\sqrt{n}$, il faut multiplier $\\sqrt{n}$ par ${f(facteur, 0)}, donc $n$ par ${f(facteur, 0)}^2 = ${f(facteur * facteur, 0)}$ : $n = ${f(n1, 0)} × ${f(facteur * facteur, 0)}$ = **${f(reponse, 0)}** simulations. La malédiction de la racine carrée du module 2, à l'euro près.`,
        },
        {
          titre: en ? 'The bill, and how quants dodge it' : 'La facture, et comment les quants la contournent',
          contenu: en
            ? `Computing time is linear in $n$: dividing the error by ${f(facteur, 0)} costs ${f(facteur * facteur, 0)} times the run time — multiply by the thousands of positions of a book, the greeks, the stress scenarios, and you get the desks' compute farms. The real cunning attacks the numerator, not $n$: antithetic draws, control variates — reduce $\\sigma_{\\text{payoff}}$ instead of inflating the sample. And the required precision is not aesthetic: the pricing error must be small against the quoted margin, otherwise the margin itself is noise.`
            : `Le temps de calcul est linéaire en $n$ : diviser l'erreur par ${f(facteur, 0)} coûte ${f(facteur * facteur, 0)} fois le temps de run — multipliez par les milliers de positions d'un book, les grecques, les scénarios de stress, et vous obtenez les fermes de calcul des desks. La vraie ruse attaque le numérateur, pas $n$ : tirages antithétiques, variables de contrôle — réduire $\\sigma_{\\text{payoff}}$ plutôt que gonfler l'échantillon. Et la précision exigée n'est pas esthétique : l'erreur de pricing doit être petite devant la marge cotée, sinon la marge elle-même est du bruit.`,
        },
      ],
      pieges: [
        en
          ? `Scaling linearly: $${f(n1, 0)} × ${f(facteur, 0)} = ${f(fauxLineaire, 0)}$ simulations would only divide the error by $\\sqrt{${f(facteur, 0)}}$. The error decays in $1/\\sqrt{n}$, not $1/n$ — the factor on $n$ is always the SQUARE of the factor on precision.`
          : `Extrapoler linéairement : $${f(n1, 0)} × ${f(facteur, 0)} = ${f(fauxLineaire, 0)}$ simulations ne diviserait l'erreur que par $\\sqrt{${f(facteur, 0)}}$. L'erreur décroît en $1/\\sqrt{n}$, pas en $1/n$ — le facteur sur $n$ est toujours le CARRÉ du facteur sur la précision.`,
        en
          ? `Hoping a new seed will help: changing the seed replays the same LEVEL of noise elsewhere, it reduces nothing. Corollary for reading results: comparing two Monte-Carlo prices whose gap is below their standard errors is reading noise — a price without its standard error is an incomplete sentence.`
          : `Espérer qu'une nouvelle graine aide : changer de graine rejoue le même NIVEAU de bruit ailleurs, cela ne réduit rien. Corollaire de lecture : comparer deux prix Monte-Carlo dont l'écart est inférieur à leurs erreurs-types, c'est lire du bruit — un prix sans son erreur-type est une phrase incomplète.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 14. Le coupon du reverse convertible à barrière (N3)
// ---------------------------------------------------------------------------
export const genCouponBarriere: ExerciseGenerator = {
  id: 'm9-ex-14',
  moduleId: M9,
  titre: 'Le coupon du reverse convertible à barrière',
  titreEn: 'The barrier reverse convertible coupon',
  difficulte: 3,
  // Tirages (ordre strict) : 1. r = randFloat(2, 5, 1) · 2. vol = randInt(18, 30)
  // · 3. barriere = pick([60, 70, 80]) · 4. facteur = randFloat(bornes[B], 2).
  // T = 1 an, strike = 100. Vanille pricée par blackScholesPut et donnée ; DIP =
  // résultat Monte-Carlo DONNÉ (vanille × facteur, bornes réalistes). Le client de
  // la version barrière vend le DIP, pas la vanille : réponse =
  // couponReverseConvertible(DIP, r, 1). L'échelle sans risque → DIP → vanille en corrigé.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const r = randFloat(rng, 2, 5, 1);
    const vol = randInt(rng, 18, 30);
    const barriere = pick(rng, [60, 70, 80] as const);
    const facteur = randFloat(rng, BORNES_FACTEUR_DIP[barriere][0], BORNES_FACTEUR_DIP[barriere][1], 2);

    const zc = r2(prixZeroCoupon(r, 1));
    const vanille = r2(blackScholesPut(100, 100, r, vol, 1));
    const dip = r2(vanille * facteur);
    const reponse = r2(couponReverseConvertible(dip, r, 1));
    const couponVanille = r2(couponReverseConvertible(vanille, r, 1));
    const couponSansRisque = r2(couponReverseConvertible(0, r, 1));

    const en = langue === 'en';
    const { f, pct } = formatters(langue);
    return {
      enonce: en
        ? `A 1-year barrier reverse convertible on a stock trading at 100, strike 100: the capital is repaid in full unless the stock has touched ${f(barriere, 0)} at any point (daily observation), in which case everything happens as in the plain version. Continuously compounded risk-free rate ${pct(r, 1)}. The desk quotes the vanilla ATM put (implied volatility ${pct(vol, 0)}) at ${pct(vanille, 2)} of the nominal; your Monte-Carlo pricer gives ${pct(dip, 2)} for the down-and-in put with barrier ${f(barriere, 0)}.\n\n**What fair annual coupon (before margin) can the barrier version pay, in % of the nominal?**`
        : `Un reverse convertible à barrière de 1 an sur une action cotée 100, strike 100 : le capital est intégralement remboursé sauf si l'action a touché ${f(barriere, 0)} à un moment quelconque (observation quotidienne), auquel cas tout se passe comme dans la version simple. Taux sans risque en composition continue ${pct(r, 1)}. Le desk cote le put vanille ATM (volatilité implicite ${pct(vol, 0)}) à ${pct(vanille, 2)} du nominal ; votre pricer Monte-Carlo donne ${pct(dip, 2)} pour le put down-and-in de barrière ${f(barriere, 0)}.\n\n**Quel coupon annuel équitable (hors marge) la version à barrière peut-elle verser, en % du nominal ?**`,
      reponse,
      tolerance: 0.15,
      toleranceMode: 'absolu',
      unite: '%',
      etapes: [
        {
          titre: en ? 'Identify the option actually sold' : 'Identifier l\'option réellement vendue',
          contenu: en
            ? `The protection clause — "capital repaid UNLESS the barrier was touched" — is the mirror image of a down-and-in put: the client of the barrier version sells the DIP, not the vanilla. The premium collected on his behalf is therefore **${f(dip, 2)}**, the Monte-Carlo price (no closed formula exists for a path-dependent payoff — the pricer measures the expectation the formula cannot integrate).`
            : `La clause de protection — « capital remboursé SAUF si la barrière a été touchée » — est l'image miroir d'un put down-and-in : le client de la version à barrière vend le DIP, pas la vanille. La prime encaissée en son nom est donc **${f(dip, 2)}**, le prix Monte-Carlo (aucune formule fermée n'existe pour un payoff dépendant du chemin — le pricer mesure l'espérance que la formule ne sait plus intégrer).`,
        },
        {
          titre: en ? 'The coupon formula, with the right premium' : 'La formule du coupon, avec la bonne prime',
          contenu: en
            ? `Same machine as the plain reverse convertible: $\\text{coupon} = \\dfrac{100 - ZC + \\text{premium}}{e^{-rT} × T} = \\dfrac{100 - ${f(zc, 2)} + ${f(dip, 2)}}{${f(r2(zc / 100), 4)} × 1}$ = **${pct(reponse, 2)}** per year. A cheaper option sold means a thinner available pot, means a thinner coupon — the protection is paid for, euro for euro, out of the headline number.`
            : `La même machine que le reverse convertible simple : $\\text{coupon} = \\dfrac{100 - ZC + \\text{prime}}{e^{-rT} × T} = \\dfrac{100 - ${f(zc, 2)} + ${f(dip, 2)}}{${f(r2(zc / 100), 4)} × 1}$ = **${pct(reponse, 2)}** par an. Option vendue moins chère, disponible plus maigre, coupon plus maigre — la protection se paie, euro pour euro, sur le chiffre en gros caractères.`,
        },
        {
          titre: en ? 'The scale that reads every term sheet' : 'L\'échelle qui lit toutes les term sheets',
          contenu: en
            ? `Three rungs, same formula: premium zero → **${pct(couponSansRisque, 2)}** (the capitalised risk-free rate, a pure loan); DIP at barrier ${f(barriere, 0)} → **${pct(reponse, 2)}**; vanilla put → **${pct(couponVanille, 2)}**. The barrier is a dial between the last two: lower it and the coupon slides towards the risk-free rung, raise it and it climbs towards the vanilla rung. No setting delivers the fat coupon AND the real protection — when a term sheet seems to, look for the hidden ingredient (worst-of, longer maturity, wilder stock).`
            : `Trois barreaux, même formule : prime nulle → **${pct(couponSansRisque, 2)}** (le taux sans risque capitalisé, un prêt pur) ; DIP à barrière ${f(barriere, 0)} → **${pct(reponse, 2)}** ; put vanille → **${pct(couponVanille, 2)}**. La barrière est un curseur entre les deux derniers : abaissez-la et le coupon glisse vers le barreau sans risque, remontez-la et il grimpe vers le barreau vanille. Aucun réglage ne donne le gros coupon ET la vraie protection — quand une term sheet semble le faire, cherchez l'ingrédient caché (worst-of, maturité plus longue, action plus nerveuse).`,
        },
      ],
      pieges: [
        en
          ? `Feeding the vanilla premium into the formula: ${pct(couponVanille, 2)} instead of ${pct(reponse, 2)}. The client sells a CONDITIONAL insurance — one that only exists if ${f(barriere, 0)} is touched — and a policy that pays less often collects a smaller premium. Using the vanilla price is pricing a different product.`
          : `Injecter la prime vanille dans la formule : ${pct(couponVanille, 2)} au lieu de ${pct(reponse, 2)}. Le client vend une assurance CONDITIONNELLE — qui n'existe que si ${f(barriere, 0)} est touché — et une police qui paie moins souvent encaisse une prime plus faible. Utiliser le prix vanille, c'est pricer un autre produit.`,
        en
          ? `Reading the protection as acquired: one single touch of ${f(barriere, 0)}, even followed by a full recovery before an out-of-the-money finish being avoided, wakes the vanilla put for good — and conditional on that touch, the loss is the ENTIRE fall from the strike, not the part below the barrier. Small premium means improbable risk, never small risk: the coupon gap with the vanilla version is exactly what this cliff is worth.`
          : `Lire la protection comme acquise : un seul toucher de ${f(barriere, 0)}, même suivi d'une remontée, réveille le put vanille pour de bon — et conditionnellement à ce toucher, la perte est la baisse ENTIÈRE depuis le strike, pas la part sous la barrière. Petite prime signifie risque improbable, jamais petit risque : l'écart de coupon avec la version vanille est exactement le prix de cette falaise.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// Export : les 14 générateurs du module, dans l'ordre de progression du cours
// ---------------------------------------------------------------------------
export const exercices: ExerciseGenerator[] = [
  genZeroCouponBudget,
  genParticipation,
  genChocsParticipation,
  genRemboursementCap,
  genCouponReverse,
  genPnlReverse,
  genPayoffDIP,
  genDerouleAutocall,
  genDipContreVanille,
  genPayoffWorstOfExo,
  genCorrelationVitrine,
  genMargeDecomposition,
  genErreurMonteCarlo,
  genCouponBarriere,
];
