/**
 * Moules de problèmes multi-étapes du module Produits structurés & pricing
 * de structuration — LOT 2 : les niveaux durs (m9-pb-11 à m9-pb-20).
 * 4 N3 (pricing complet d'un capital garanti avec négociation, sensibilités du
 * coupon d'équilibre d'un autocall, fréquence d'observation d'un down-and-in
 * put, worst-of et corrélation vus du desk) et 6 boss N4 alignés sur le
 * chapitre 7 (Lehman 2008, les autocalls coréens HSCEI 2015-2016, mars 2020 au
 * desk parisien, le rendez-vous distributeur, le structureur sur mesure, la
 * revente avant maturité).
 * Chaque moule : 3 scénarios FR + EN, sous-questions chaînées, corrigés
 * calculés via calculs.ts (m9 + m8) — jamais de texte figé.
 * INVARIANT BILINGUE : tous les tirages aléatoires ont lieu AVANT toute branche
 * de langue — même seed + même scénario ⇒ mêmes nombres en français et en anglais.
 * PERFORMANCE : AUCUN appel Monte-Carlo dans generate() — tous les prix simulés
 * nécessaires (autocall, down-and-in put, worst-of) sont DONNÉS dans les
 * énoncés comme sorties de pricer, dans des fourchettes vérifiées hors-ligne
 * contre les fonctions MC de calculs.ts (mêmes conventions : Athéna 5 ans
 * r = 3 % vol 20 % coupon 7 ≈ 98,1 ; DIP B = 70 σ = 25 : 2,5 / 3,3 / 3,9 selon
 * l'observation ; DIP worst-of 3 ans σ 22-25 : ~5-8 à ρ = 1, ~9-14 à ρ = 0).
 * Conventions (en-tête de calculs.ts) : taux et volatilités en %, durées en
 * années, actualisation CONTINUE e^{−rT} ; nominal 100, prix en % du nominal ;
 * participation en RATIO ; corrélation ρ en points de pourcentage dans les
 * énoncés ; barrières d'autocall en % du niveau initial.
 */
import { formatNombreLangue } from '../../../engine/answers';
import { mulberry32, pick, randFloat, randInt } from '../../../engine/rng';
import type { Langue, ProblemGenerator } from '../../../engine/types';
import { blackScholesCall, dfContinu } from '../08-options-volatilite/calculs';
import {
  budgetOptions, couponReverseConvertible, margeCommercialeAnnualisee,
  participationCapitalGaranti, prixZeroCoupon,
} from './calculs';

/** Un « moule » de problème est un ProblemGenerator de l'engine (alias local). */
export type ProblemeMoule = ProblemGenerator;

const M9 = '09-produits-structures';
const r0 = (v: number) => Math.round(v);
const r1 = (v: number) => Math.round(v * 10) / 10;
const r2 = (v: number) => Math.round(v * 100) / 100;

/** Petits formateurs liés à la langue (les tirages sont déjà faits quand on les crée). */
function outils(langue: Langue) {
  const en = langue === 'en';
  const f = (v: number, d = 2) => formatNombreLangue(langue, v, d);
  const pct = (v: number, d = 2) => (en ? `${f(v, d)}%` : `${f(v, d)} %`);
  // Montant en devise. Le dollar est échappé (\$) : règle du mini-parser markdown,
  // un $ nu ouvrirait un segment KaTeX.
  const mnt = (v: number, sym: string, d = 2) => {
    const s = sym === '$' ? '\\$' : sym;
    return en ? `${s}${f(v, d)}` : `${f(v, d)} ${s}`;
  };
  return { en, f, pct, mnt };
}

/* ------------------------------------------------------------------ */
/* 11. m9-pb-11 — Capital garanti : pricer, puis négocier — N3         */
/* ------------------------------------------------------------------ */
const capitalGarantiNegociation: ProblemeMoule = {
  id: 'm9-pb-11', moduleId: M9,
  titre: 'Le capital garanti : pricer, puis négocier',
  titreEn: 'The capital-guaranteed note: price it, then negotiate',
  typeDeCas: 'structuration capital garanti',
  typeDeCasEn: 'capital-guaranteed structuring',
  difficulte: 3,
  scenarios: ['Le structureur face au directeur de la banque privée', 'La trésorière de fondation qui négocie sa garantie', 'Grand oral : fabriquer un capital garanti de bout en bout'],
  scenariosEn: ['The structurer facing the private bank director', 'The foundation treasurer negotiating her guarantee', 'Final viva: building a capital-guaranteed note end to end'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const T = 5;
    const rTx = randFloat(rng, 3, 4.5, 1);
    const vol = randInt(rng, 18, 24);
    const marge = randFloat(rng, 1, 1.5, 1);
    const capGain = randInt(rng, 30, 45);
    const hausse = capGain + randInt(rng, 10, 25);

    const zc = prixZeroCoupon(rTx, T);
    const budget = budgetOptions(zc, marge);
    const call = blackScholesCall(100, 100, rTx, vol, T);
    const p = participationCapitalGaranti(budget, call);
    const cap = 100 + capGain;
    const callCap = blackScholesCall(100, cap, rTx, vol, T);
    const spread = call - callCap;
    const pCap = budget / spread;
    const zc90 = 0.9 * zc;
    const budget90 = 100 - zc90 - marge;
    const p90 = budget90 / call;
    const payCap = 100 + pCap * capGain;
    const pay90 = 100 + p90 * hausse;
    const ecart = pay90 - payCap;
    const repZc = r2(zc);
    const repBudget = r2(budget);
    const repPart = r1(p * 100);
    const repPCap = r1(pCap * 100);
    const repP90 = r1(p90 * 100);
    const repEcart = r1(ecart);

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `a 5-year note, 100% capital guaranteed at maturity plus a participation in the rise of the index; market data: rate ${pct(rTx, 1)}, at-the-money volatility ${pct(vol, 0)}, total margin ${pct(marge, 1)} of the nominal; the 5-year ATM call costs ${pct(r2(call), 2)} of the nominal (Black-Scholes) and the call struck at ${f(cap, 0)}% costs ${pct(r2(callCap), 2)}`
      : `une note 5 ans, capital garanti à 100 % à l'échéance plus une participation à la hausse de l'indice ; données de marché : taux ${pct(rTx, 1)}, volatilité à la monnaie ${pct(vol, 0)}, marge totale ${pct(marge, 1)} du nominal ; le call ATM 5 ans coûte ${pct(r2(call), 2)} du nominal (Black-Scholes) et le call de strike ${f(cap, 0)} % coûte ${pct(r2(callCap), 2)}`;
    const contexte = (en
      ? [
        `The private bank director slides a one-line brief across the table: "my clients want the index without the risk — build me ${desc}." You are the structurer: the recipe is chapter 2, but the meeting will not stop at the recipe. The participation your budget buys will look thin, the director will push back, and you will need the two classic patches — cap the upside, or guarantee 90 instead of 100 — priced, not pitched. Every number of the negotiation comes out of the same three bricks: a zero-coupon, a margin, and whatever calls are left affordable.`,
        `The foundation's treasurer cannot lose the endowment — the statutes say so — but the board wants equity upside: ${desc}. She has read the brochure; you must show her the factory. First the honest product: zero-coupon, budget, participation. Then the negotiation she will actually face at the bank: the flattering version with a cap, the version that guarantees 90% instead of 100 — and the scenario arithmetic that decides which trade-off her statutes can live with.`,
        `The examiner wants the whole chain, no shortcuts: "structure me ${desc} — and then negotiate: your client refuses the participation you found." He expects the zero-coupon, the option budget, the division that gives the participation, then the two patches of chapter 2 priced properly (cap, 90% guarantee) — and a final scenario, numbers in hand, showing what each patch gives up and where.`,
      ]
      : [
        `Le directeur de la banque privée fait glisser un brief d'une ligne : « mes clients veulent l'indice sans le risque — fabriquez-moi ${desc}. » Vous êtes le structureur : la recette, c'est le chapitre 2, mais la réunion ne s'arrêtera pas à la recette. La participation que votre budget peut payer paraîtra maigre, le directeur va négocier, et il vous faudra les deux rustines classiques — plafonner la hausse, ou garantir 90 au lieu de 100 — pricées, pas racontées. Chaque nombre de la négociation sort des trois mêmes briques : un zéro-coupon, une marge, et les calls que le budget restant peut payer.`,
        `La trésorière de la fondation n'a pas le droit de perdre la dotation — les statuts le disent — mais le conseil veut la hausse des actions : ${desc}. Elle a lu la plaquette ; vous devez lui montrer l'usine. D'abord le produit honnête : zéro-coupon, budget, participation. Puis la négociation qu'elle va réellement vivre au guichet : la version flatteuse avec plafond, la version qui garantit 90 % au lieu de 100 — et l'arithmétique de scénarios qui décide quel arbitrage ses statuts peuvent tolérer.`,
        `L'examinateur veut la chaîne entière, sans raccourci : « structurez-moi ${desc} — puis négociez : votre client refuse la participation que vous avez trouvée. » Il attend le zéro-coupon, le budget d'options, la division qui donne la participation, puis les deux rustines du chapitre 2 correctement pricées (plafond, garantie à 90 %) — et un scénario final, chiffres à l'appui, montrant ce que chaque rustine abandonne, et où.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The brick that guarantees' : 'a) La brique qui garantit',
          enonce: en
            ? `What does the zero-coupon that will repay the 100 at maturity cost today, in % of the nominal?`
            : `Que coûte aujourd'hui le zéro-coupon qui redonnera les 100 à l'échéance, en % du nominal ?`,
          reponse: repZc, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'A rates trade, not magic' : 'Un placement de taux, pas de la magie',
            contenu: en
              ? `ZC = 100·e^{−rT} = 100 × e^{−${f(rTx, 1)}% × 5} = **${pct(repZc, 2)}**. Park ${f(repZc, 2)} today at the risk-free rate and 100 falls out in five years, whatever the index does. The guarantee is module 4's yield curve, nothing else — which is exactly why a decade of zero rates made these products impossible to build.`
              : `ZC = 100·e^{−rT} = 100 × e^{−${f(rTx, 1)} % × 5} = **${pct(repZc, 2)}**. Placez ${f(repZc, 2)} aujourd'hui au taux sans risque et 100 tombent dans cinq ans, quoi que fasse l'indice. La garantie, c'est la courbe des taux du module 4, rien d'autre — exactement pourquoi une décennie de taux nuls a rendu ces produits infabricables.`,
          }],
        },
        {
          intitule: en ? 'b) The option budget' : "b) Le budget d'options",
          enonce: en
            ? `Once the zero-coupon is parked and the ${pct(marge, 1)} margin is taken, what remains to buy the upside, in % of the nominal?`
            : `Une fois le zéro-coupon logé et la marge de ${pct(marge, 1)} prélevée, que reste-t-il pour acheter la hausse, en % du nominal ?`,
          reponse: repBudget, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? '100 minus the guarantee, minus the margin' : '100 moins la garantie, moins la marge',
            contenu: en
              ? `Budget = 100 − ${f(repZc, 2)} − ${f(marge, 1)} = **${pct(repBudget, 2)}**. This is THE structurer's constraint: everything the term sheet will promise must be bought with this. Note where the margin sits — inside the price, taken on day one: every euro of margin is one euro of promise the client will not get.`
              : `Budget = 100 − ${f(repZc, 2)} − ${f(marge, 1)} = **${pct(repBudget, 2)}**. C'est LA contrainte du structureur : tout ce que la term sheet promettra devra s'acheter avec ça. Voyez où loge la marge — dans le prix, prélevée au jour 1 : chaque euro de marge est un euro de promesse que le client n'aura pas.`,
          }],
        },
        {
          intitule: en ? 'c) The participation — the honest division' : 'c) La participation — la division honnête',
          enonce: en
            ? `The 5-year ATM call costs ${pct(r2(call), 2)} of the nominal. What participation can the note offer, in %?`
            : `Le call ATM 5 ans coûte ${pct(r2(call), 2)} du nominal. Quelle participation la note peut-elle offrir, en % ?`,
          reponse: repPart, tolerance: 0.5, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Budget divided by the price of the call' : 'Le budget divisé par le prix du call',
            contenu: en
              ? `p = budget / ATM call = ${f(repBudget, 2)} / ${f(r2(call), 2)} = **${pct(repPart, 1)}** of the rise. The participation is not a commercial choice, it is the RESULT of a division — how many calls can the budget pay? At ${pct(repPart, 1)}, the director will frown: "${f(r0(repPart), 0)}% of the upside" sells poorly. Enter the negotiation.`
              : `p = budget / call ATM = ${f(repBudget, 2)} / ${f(r2(call), 2)} = **${pct(repPart, 1)}** de la hausse. La participation n'est pas un choix commercial, c'est le RÉSULTAT d'une division — combien de calls le budget peut-il payer ? À ${pct(repPart, 1)}, le directeur va froncer les sourcils : « ${f(r0(repPart), 0)} % de la hausse », ça se vend mal. La négociation commence.`,
          }],
          pieges: [en
            ? `Dividing the budget by the SPOT (100) instead of the call price gives a meaningless number: the budget buys options, and it is the option that delivers the upside.`
            : `Diviser le budget par le SPOT (100) au lieu du prix du call donne un nombre sans sens : le budget achète des options, et c'est l'option qui livre la hausse.`],
        },
        {
          intitule: en ? 'd) Patch 1: cap the upside' : 'd) Rustine 1 : plafonner la hausse',
          enonce: en
            ? `Replace the ATM call by a call spread 100/${f(cap, 0)} (buy the ATM call, sell the ${f(cap, 0)}% call at ${pct(r2(callCap), 2)}). What participation — capped at +${f(capGain, 0)}% — can now be displayed, in %?`
            : `Remplacez le call ATM par un call spread 100/${f(cap, 0)} (achat du call ATM, vente du call ${f(cap, 0)} % à ${pct(r2(callCap), 2)}). Quelle participation — plafonnée à +${f(capGain, 0)} % — peut-on désormais afficher, en % ?`,
          reponse: repPCap, tolerance: Math.max(1, repPCap * 0.01), toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'A cheaper option buys a bigger number' : 'Une option moins chère achète un plus gros chiffre',
            contenu: en
              ? `Call spread = ${f(r2(call), 2)} − ${f(r2(callCap), 2)} = ${f(r2(spread), 2)}; p = ${f(repBudget, 2)} / ${f(r2(spread), 2)} = **${pct(repPCap, 1)}**, capped at +${f(capGain, 0)}%. The window number jumped from ${pct(repPart, 1)} to ${pct(repPCap, 1)} — and nothing was given for free: the client SOLD the upside beyond ${f(cap, 0)} to pay for it. Maximum gain: ${f(r1(repPCap / 100 * capGain), 1)} points, full stop.`
              : `Call spread = ${f(r2(call), 2)} − ${f(r2(callCap), 2)} = ${f(r2(spread), 2)} ; p = ${f(repBudget, 2)} / ${f(r2(spread), 2)} = **${pct(repPCap, 1)}**, plafonnée à +${f(capGain, 0)} %. Le chiffre en vitrine a sauté de ${pct(repPart, 1)} à ${pct(repPCap, 1)} — et rien n'a été offert : le client a VENDU la hausse au-delà de ${f(cap, 0)} pour se le payer. Gain maximal : ${f(r1(repPCap / 100 * capGain), 1)} points, point final.`,
          }],
        },
        {
          intitule: en ? 'e) Patch 2: guarantee 90 instead of 100' : 'e) Rustine 2 : garantir 90 au lieu de 100',
          enonce: en
            ? `Back to the plain ATM call, but the guarantee drops to 90% of the capital. What participation does the enlarged budget buy, in %?`
            : `Retour au call ATM simple, mais la garantie descend à 90 % du capital. Quelle participation le budget élargi paie-t-il, en % ?`,
          reponse: repP90, tolerance: Math.max(1, repP90 * 0.01), toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Ten points of guarantee buy a lot of upside' : 'Dix points de garantie achètent beaucoup de hausse',
            contenu: en
              ? `Guaranteeing 90 costs 0.9 × ${f(repZc, 2)} = ${f(r2(zc90), 2)}; budget = 100 − ${f(r2(zc90), 2)} − ${f(marge, 1)} = ${f(r2(budget90), 2)}; p = ${f(r2(budget90), 2)} / ${f(r2(call), 2)} = **${pct(repP90, 1)}**. The trade-off is explicit and often reasonable — provided the client has SEEN that the word changed: the capital is no longer *guaranteed*, it is *protected at 90%*. Chapter 1's courtrooms were full of clients who had not seen it.`
              : `Garantir 90 coûte 0,9 × ${f(repZc, 2)} = ${f(r2(zc90), 2)} ; budget = 100 − ${f(r2(zc90), 2)} − ${f(marge, 1)} = ${f(r2(budget90), 2)} ; p = ${f(r2(budget90), 2)} / ${f(r2(call), 2)} = **${pct(repP90, 1)}**. L'arbitrage est explicite et souvent raisonnable — à condition que le client ait VU que le mot a changé : le capital n'est plus *garanti*, il est *protégé à 90 %*. Les prétoires du chapitre 1 étaient pleins de clients qui ne l'avaient pas vu.`,
          }],
          pieges: [en
            ? `Computing the 90% budget as "budget + 10" forgets the discounting: only 0.9 × ZC is saved today, i.e. ${f(r2(zc - zc90), 2)} points — not 10.`
            : `Calculer le budget à 90 % comme « budget + 10 » oublie l'actualisation : on n'économise aujourd'hui que 0,9 × ZC de moins, soit ${f(r2(zc - zc90), 2)} points — pas 10.`],
        },
        {
          intitule: en ? 'f) The arbitration, priced on a rally' : "f) L'arbitrage, chiffré sur un rallye",
          enonce: en
            ? `The index finishes at +${f(hausse, 0)}%. By how many points of nominal does the 90%-guarantee version beat (positive) or trail (negative) the capped version?`
            : `L'indice finit à +${f(hausse, 0)} %. De combien de points de nominal la version garantie à 90 % bat-elle (positif) ou est-elle battue par (négatif) la version plafonnée ?`,
          reponse: repEcart, tolerance: Math.max(0.5, Math.abs(repEcart) * 0.05), toleranceMode: 'absolu', unite: 'points',
          etapes: [
            {
              titre: en ? 'Two payoffs, same scenario' : 'Deux payoffs, même scénario',
              contenu: en
                ? `Capped: the rise is clipped at +${f(capGain, 0)}%, payoff = 100 + ${f(r2(pCap), 2)} × ${f(capGain, 0)} = ${f(r1(payCap), 1)}. Guaranteed at 90: payoff = 100 + ${f(r2(p90), 2)} × ${f(hausse, 0)} = ${f(r1(pay90), 1)}. Difference: **${f(repEcart, 1)} points**${repEcart > 0 ? ' in favour of the 90% version — in a big rally, the cap is what bites' : ' in favour of the capped version — the cap did not bite enough to lose'}.`
                : `Plafonnée : la hausse est écrêtée à +${f(capGain, 0)} %, payoff = 100 + ${f(r2(pCap), 2)} × ${f(capGain, 0)} = ${f(r1(payCap), 1)}. Garantie à 90 : payoff = 100 + ${f(r2(p90), 2)} × ${f(hausse, 0)} = ${f(r1(pay90), 1)}. Écart : **${f(repEcart, 1)} points**${repEcart > 0 ? ' en faveur de la version 90 % — dans un grand rallye, c\'est le plafond qui mord' : ' en faveur de la version plafonnée — le plafond n\'a pas assez mordu pour perdre'}.`,
            },
            {
              titre: en ? 'The other face of the trade-off' : "L'autre face de l'arbitrage",
              contenu: en
                ? `Now flip the scenario: index at −30%. The capped version repays 100; the 90% version repays 90. The negotiation table is complete: the cap pays in crashes and costs in rallies, the reduced guarantee does the opposite — and the honest structurer shows BOTH columns before the client picks. One never compares two participations; one compares two formulas, scenario by scenario.`
                : `Retournez maintenant le scénario : indice à −30 %. La version plafonnée rembourse 100 ; la version 90 % rembourse 90. La table de négociation est complète : le plafond paie dans les krachs et coûte dans les rallyes, la garantie réduite fait l'inverse — et le structureur honnête montre les DEUX colonnes avant que le client choisisse. On ne compare jamais deux participations ; on compare deux formules, scénario par scénario.`,
            },
          ],
          pieges: [en
            ? `Comparing the two versions on their participation numbers (${pct(repPCap, 1)} vs ${pct(repP90, 1)}) without the cap and the floor compares two price tags, not two products.`
            : `Comparer les deux versions sur leurs chiffres de participation (${pct(repPCap, 1)} contre ${pct(repP90, 1)}) sans le plafond ni le plancher compare deux étiquettes, pas deux produits.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 12. m9-pb-12 — Le coupon d'équilibre et ses sensibilités — N3       */
/* ------------------------------------------------------------------ */
const sensibilitesCouponAutocall: ProblemeMoule = {
  id: 'm9-pb-12', moduleId: M9,
  titre: "L'autocall au pricer : le coupon d'équilibre et ses sensibilités",
  titreEn: 'The autocall at the pricer: the fair coupon and its sensitivities',
  typeDeCas: 'pricing autocall',
  typeDeCasEn: 'autocall pricing',
  difficulte: 3,
  scenarios: ['Le junior du desk autocalls et les sorties du pricer', 'Le comité nouveaux produits relit la cotation', 'Grand oral : pourquoi ce coupon-là ?'],
  scenariosEn: ['The autocall desk junior and the pricer outputs', 'The new-products committee rereads the quote', 'Final viva: why that coupon?'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const c = randFloat(rng, 6.5, 7.5, 1);
    const pBase = r1(98.1 + (c - 7) * 1.2 + randFloat(rng, -0.3, 0.3, 1));
    const sens = randFloat(rng, 1.1, 1.3, 2);
    const dV = randFloat(rng, 3, 3.6, 1);
    const dB = randFloat(rng, 1.2, 1.8, 1);
    const dD = randFloat(rng, 1, 1.6, 1);
    const p25 = r1(pBase - dV);
    const p50 = r1(pBase + dB);
    const pDiv = r1(pBase - dD);
    const pAll = r1(pBase - dV - dD + dB);

    const marge = r2(100 - pBase);
    const margeAn = r2(margeCommercialeAnnualisee(marge, 5));
    const cEq = r2(c + (100 - pBase) / sens);
    const cEq25 = r2(c + (100 - p25) / sens);
    const cEq50 = r2(c + (100 - p50) / sens);
    const ecartBar = r2(cEq - cEq50);
    const cEqDiv = r2(c + (100 - pDiv) / sens);
    const cEqAll = r2(c + (100 - pAll) / sens);

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `a 5-year Athena on the index: annual observations, autocall trigger at 100% of the initial level, memory coupon ${pct(c, 1)} per year, protection barrier 60% observed at maturity only, rate 3%, volatility 20%; the Monte-Carlo pricer (200,000 paths) returns a value of ${f(pBase, 1)} for the product sold at 100, and states that one extra point of annual coupon adds ${f(sens, 2)} points of price; rerun with the same coupon, it gives ${f(p25, 1)} at 25% volatility, ${f(p50, 1)} with the protection barrier moved to 50%, and ${f(pDiv, 1)} with expected dividends revised up by one point`
      : `un Athéna 5 ans sur l'indice : observations annuelles, rappel à 100 % du niveau initial, coupon mémoire ${pct(c, 1)} par an, barrière de protection 60 % observée à maturité seulement, taux 3 %, volatilité 20 % ; le pricer Monte-Carlo (200 000 trajectoires) rend une valeur de ${f(pBase, 1)} pour le produit vendu 100, et indique qu'un point de coupon annuel en plus ajoute ${f(sens, 2)} points de prix ; relancé à coupon identique, il donne ${f(p25, 1)} à 25 % de volatilité, ${f(p50, 1)} avec la barrière de protection descendue à 50 %, et ${f(pDiv, 1)} avec des dividendes attendus revus en hausse d'un point`;
    const contexte = (en
      ? [
        `First week on the autocall desk, and the head trader hands you the morning's pricer outputs with one instruction: "read them like a desk, not like a spreadsheet". The product: ${desc}. Your job is the grammar of chapter 4: locate the margin, solve the fair coupon, then walk the three sensitivities — volatility, barrier, dividends — and say each time WHY the number moves, through the put the client sells without knowing it.`,
        `The new-products committee reviews the quote before launch, and the compliance officer wants the arithmetic on the table: ${desc}. The committee's questions are always the same four: how much margin at issuance, what coupon would be fair, what happens to the fair coupon if the market reprices volatility or dividends, and what the client's demand for a deeper barrier would cost. Answer with the pricer's own numbers — the desk never argues with its pricer.`,
        `The examiner pins the pricer output sheet to the board: ${desc}. "Everything I want to hear is in this table," he says. He expects the margin and its annualised reading, the fair coupon solved from the price sensitivity, the three reruns explained — volatility, barrier, dividends, each through the down-and-in put — and the requote of a stressed market. The coupon is a market quote dressed as a promise: prove it.`,
      ]
      : [
        `Première semaine au desk autocalls, et le trader senior vous tend les sorties du pricer du matin avec une seule consigne : « lisez-les comme un desk, pas comme un tableur ». Le produit : ${desc}. Votre travail, c'est la grammaire du chapitre 4 : localiser la marge, résoudre le coupon d'équilibre, puis dérouler les trois sensibilités — volatilité, barrière, dividendes — et dire à chaque fois POURQUOI le nombre bouge, via le put que le client vend sans le savoir.`,
        `Le comité nouveaux produits relit la cotation avant le lancement, et la conformité veut l'arithmétique sur la table : ${desc}. Les questions du comité sont toujours les quatre mêmes : combien de marge à l'émission, quel coupon serait équitable, que devient le coupon d'équilibre si le marché re-price la volatilité ou les dividendes, et que coûterait l'exigence du client d'une barrière plus profonde. Répondez avec les nombres du pricer lui-même — un desk ne discute jamais avec son pricer.`,
        `L'examinateur punaise la feuille de sorties du pricer au tableau : ${desc}. « Tout ce que je veux entendre est dans ce tableau », dit-il. Il attend la marge et sa lecture annualisée, le coupon d'équilibre résolu par la sensibilité de prix, les trois relances expliquées — volatilité, barrière, dividendes, chacune via le put down-and-in — et la recotation d'un marché stressé. Le coupon est une cote de marché déguisée en promesse : prouvez-le.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The margin, located' : 'a) La marge, localisée',
          enonce: en
            ? `The product is sold at 100 and the pricer values it at ${f(pBase, 1)}. What is the total margin at issuance, in % of the nominal?`
            : `Le produit est vendu 100 et le pricer le valorise ${f(pBase, 1)}. Quelle est la marge totale à l'émission, en % du nominal ?`,
          reponse: marge, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? '100 = value + margin, day one' : '100 = valeur + marge, au jour 1',
            contenu: en
              ? `Margin = 100 − ${f(pBase, 1)} = **${pct(marge, 2)}**, i.e. ${pct(margeAn, 2)} per year over the 5 facial years (margin/T, the desks' display convention) — within the market's 0.5 to 1% per year standards. Nothing hidden: since PRIIPs (2018), this issuance value is published in the KID. The client does not "lose" it; he discovers it on his first statement.`
              : `Marge = 100 − ${f(pBase, 1)} = **${pct(marge, 2)}**, soit ${pct(margeAn, 2)} par an sur les 5 ans faciaux (marge/T, la convention d'affichage des desks) — dans les standards du marché, 0,5 à 1 % par an. Rien de caché : depuis PRIIPs (2018), cette valeur à l'émission est publiée dans le KID. Le client ne la « perd » pas ; il la découvre sur son premier relevé.`,
          }],
        },
        {
          intitule: en ? 'b) The fair coupon, solved' : "b) Le coupon d'équilibre, résolu",
          enonce: en
            ? `Using the pricer's sensitivity (${f(sens, 2)} points of price per point of coupon), what annual coupon would bring the value to exactly 100, in %?`
            : `Avec la sensibilité du pricer (${f(sens, 2)} points de prix par point de coupon), quel coupon annuel amènerait la valeur à exactement 100, en % ?`,
          reponse: cEq, tolerance: 0.1, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The coupon is not chosen, it is solved' : "Le coupon n'est pas choisi, il est résolu",
            contenu: en
              ? `Missing value: 100 − ${f(pBase, 1)} = ${f(marge, 2)} points; extra coupon needed: ${f(marge, 2)} / ${f(sens, 2)} = ${f(r2((100 - pBase) / sens), 2)} points, so fair coupon = ${f(c, 1)} + ${f(r2((100 - pBase) / sens), 2)} = **${pct(cEq, 2)}**. That is the coupon of a zero-margin world; the ${f(c, 1)} offered is the same product with the factory bill deducted. Everything else in this problem is this equation rerun with new market data.`
              : `Valeur manquante : 100 − ${f(pBase, 1)} = ${f(marge, 2)} points ; coupon supplémentaire nécessaire : ${f(marge, 2)} / ${f(sens, 2)} = ${f(r2((100 - pBase) / sens), 2)} point, donc coupon d'équilibre = ${f(c, 1)} + ${f(r2((100 - pBase) / sens), 2)} = **${pct(cEq, 2)}**. C'est le coupon d'un monde sans marge ; les ${f(c, 1)} offerts sont le même produit, facture d'usine déduite. Tout le reste du problème est cette équation relancée avec de nouvelles données de marché.`,
          }],
          pieges: [en
            ? `Dividing the margin by the coupon (${f(marge, 2)}/${f(c, 1)}) instead of by the price sensitivity confuses a stock (points of price) with a flow (points of coupon per year): the pricer's ${f(sens, 2)} is the exchange rate between the two.`
            : `Diviser la marge par le coupon (${f(marge, 2)}/${f(c, 1)}) au lieu de la sensibilité de prix confond un stock (points de prix) et un flux (points de coupon par an) : le ${f(sens, 2)} du pricer est le taux de change entre les deux.`],
        },
        {
          intitule: en ? 'c) Rerun 1: volatility at 25%' : 'c) Relance 1 : volatilité à 25 %',
          enonce: en
            ? `At 25% volatility the pricer returns ${f(p25, 1)} for the same coupon. What is the fair coupon in that market, in %?`
            : `À 25 % de volatilité, le pricer rend ${f(p25, 1)} pour le même coupon. Quel est le coupon d'équilibre dans ce marché, en % ?`,
          reponse: cEq25, tolerance: 0.15, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The put the client sells got dearer' : 'Le put que vend le client a renchéri',
            contenu: en
              ? `Fair coupon = ${f(c, 1)} + (100 − ${f(p25, 1)}) / ${f(sens, 2)} = **${pct(cEq25, 2)}**, against ${pct(cEq, 2)} at 20% vol. Why: higher vol makes the down-and-in put the client sells worth more (vega, module 8), so there is more premium to recycle into coupon. The flip side travels with it — the probability of finishing under the barrier climbs too. The coupon is a thermometer: it rises exactly when the risk rises.`
              : `Coupon d'équilibre = ${f(c, 1)} + (100 − ${f(p25, 1)}) / ${f(sens, 2)} = **${pct(cEq25, 2)}**, contre ${pct(cEq, 2)} à 20 % de vol. Pourquoi : une vol plus haute renchérit le put down-and-in que vend le client (vega, module 8), donc plus de prime à recycler en coupon. Le revers voyage avec — la probabilité de finir sous la barrière grimpe aussi. Le coupon est un thermomètre : il monte exactement quand le risque monte.`,
          }],
        },
        {
          intitule: en ? 'd) Rerun 2: the deeper barrier' : 'd) Relance 2 : la barrière plus profonde',
          enonce: en
            ? `With the protection barrier at 50%, the pricer returns ${f(p50, 1)}. How many points of annual coupon does the better protection cost the client (fair coupon at 60% barrier minus fair coupon at 50%)?`
            : `Avec la barrière de protection à 50 %, le pricer rend ${f(p50, 1)}. Combien de points de coupon annuel la meilleure protection coûte-t-elle au client (coupon d'équilibre à barrière 60 % moins coupon d'équilibre à 50 %) ?`,
          reponse: ecartBar, tolerance: 0.1, toleranceMode: 'absolu', unite: en ? 'points' : 'points',
          etapes: [{
            titre: en ? 'A cheaper put, a thinner coupon' : 'Un put moins cher, un coupon plus mince',
            contenu: en
              ? `At barrier 50 the fair coupon is ${f(c, 1)} + (100 − ${f(p50, 1)}) / ${f(sens, 2)} = ${pct(cEq50, 2)}: the client sells a put that activates less often, collects less premium. Cost of the protection: ${f(cEq, 2)} − ${f(cEq50, 2)} = **${f(ecartBar, 2)} points of coupon per year**. Every "safety" line of a term sheet has this price tag — the desk reads barriers as put prices, never as favours.`
              : `À barrière 50, le coupon d'équilibre vaut ${f(c, 1)} + (100 − ${f(p50, 1)}) / ${f(sens, 2)} = ${pct(cEq50, 2)} : le client vend un put qui s'active moins souvent, il encaisse moins de prime. Coût de la protection : ${f(cEq, 2)} − ${f(cEq50, 2)} = **${f(ecartBar, 2)} point de coupon par an**. Chaque ligne « sécurité » d'une term sheet porte cette étiquette — le desk lit les barrières comme des prix de put, jamais comme des faveurs.`,
          }],
          pieges: [en
            ? `"A lower barrier protects more, so the product should pay more" reverses the causality: the client is the SELLER of the protection put — less risk sold means less rent received.`
            : `« Une barrière plus basse protège plus, donc le produit devrait payer plus » inverse la causalité : le client est le VENDEUR du put de protection — moins de risque vendu, c'est moins de loyer touché.`],
        },
        {
          intitule: en ? 'e) Rerun 3: dividends revised up' : 'e) Relance 3 : dividendes revus en hausse',
          enonce: en
            ? `With expected dividends one point higher, the pricer returns ${f(pDiv, 1)}. What is the fair coupon, in %?`
            : `Avec des dividendes attendus un point plus haut, le pricer rend ${f(pDiv, 1)}. Quel est le coupon d'équilibre, en % ?`,
          reponse: cEqDiv, tolerance: 0.15, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The forward sank, the barrier got closer' : 'Le forward a baissé, la barrière s\'est rapprochée',
            contenu: en
              ? `Fair coupon = ${f(c, 1)} + (100 − ${f(pDiv, 1)}) / ${f(sens, 2)} = **${pct(cEqDiv, 2)}**. Mechanism: pricing runs on the FORWARD (module 7), and higher dividends pull it down — recall less likely, protection barrier more threatened, the client's put dearer, coupon up. This is why autocalls love high-dividend underlyings: the dividend the client gives up finances the coupon he receives. Keep the sign in mind for the boss problems: the desk, hedged on the forward, carries that dividend risk for years.`
              : `Coupon d'équilibre = ${f(c, 1)} + (100 − ${f(pDiv, 1)}) / ${f(sens, 2)} = **${pct(cEqDiv, 2)}**. Mécanisme : le pricing se fait sur le FORWARD (module 7), et des dividendes plus hauts le tirent vers le bas — rappel moins probable, barrière de protection plus menacée, put du client plus cher, coupon en hausse. Voilà pourquoi les autocalls adorent les sous-jacents à gros dividendes : le dividende auquel le client renonce finance le coupon qu'il touche. Gardez le signe en tête pour les boss : le desk, couvert sur le forward, porte ce risque de dividendes pendant des années.`,
          }],
        },
        {
          intitule: en ? 'f) The stressed requote' : 'f) La recotation en marché stressé',
          enonce: en
            ? `Six months later the market has moved: volatility 25%, dividends up one point — and the client demands the 50% barrier. Combining the pricer's three reruns linearly, what fair coupon does the desk quote, in %?`
            : `Six mois plus tard, le marché a bougé : volatilité 25 %, dividendes en hausse d'un point — et le client exige la barrière à 50 %. En combinant linéairement les trois relances du pricer, quel coupon d'équilibre le desk cote-t-il, en % ?`,
          reponse: cEqAll, tolerance: 0.2, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'Stack the three price moves' : 'Empiler les trois mouvements de prix',
              contenu: en
                ? `Price ≈ ${f(pBase, 1)} − ${f(dV, 1)} (vol) − ${f(dD, 1)} (dividends) + ${f(dB, 1)} (barrier 50) = ${f(pAll, 1)}; fair coupon = ${f(c, 1)} + (100 − ${f(pAll, 1)}) / ${f(sens, 2)} = **${pct(cEqAll, 2)}**. Two identical shells, ${pct(cEq, 2)} and ${pct(cEqAll, 2)}: nothing changed but the market. The coupon is a market quote dressed as a promise — two autocalls issued six months apart on the same index NEVER display the same number.`
                : `Prix ≈ ${f(pBase, 1)} − ${f(dV, 1)} (vol) − ${f(dD, 1)} (dividendes) + ${f(dB, 1)} (barrière 50) = ${f(pAll, 1)} ; coupon d'équilibre = ${f(c, 1)} + (100 − ${f(pAll, 1)}) / ${f(sens, 2)} = **${pct(cEqAll, 2)}**. Deux coquilles identiques, ${pct(cEq, 2)} et ${pct(cEqAll, 2)} : rien n'a changé sauf le marché. Le coupon est une cote de marché déguisée en promesse — deux autocalls émis à six mois d'écart sur le même indice n'affichent JAMAIS le même chiffre.`,
            },
            {
              titre: en ? 'What the viva wants at the end' : "Ce que l'oral attend à la fin",
              contenu: en
                ? `The closing sentence: when the offered coupon jumps, it is not the bank turning generous — it is the risk sold by the client repricing upwards. A high coupon is a thermometer, not an opportunity; the linearised requote you just did is exactly how a desk answers "and at what level would you reissue today?" between two pricer runs.`
                : `La phrase de clôture : quand le coupon offert bondit, ce n'est pas la banque qui devient généreuse — c'est le risque vendu par le client qui se re-price à la hausse. Un coupon élevé est un thermomètre, pas une opportunité ; la recotation linéarisée que vous venez de faire est exactement la façon dont un desk répond « et vous réémettriez à quel niveau aujourd'hui ? » entre deux tours de pricer.`,
            },
          ],
          pieges: [en
            ? `Adding the three COUPON effects computed separately then re-adding the margin double-counts it: stack the PRICE moves first, then solve the coupon once.`
            : `Additionner les trois effets de COUPON calculés séparément puis rajouter la marge la compte deux fois : empilez d'abord les mouvements de PRIX, puis résolvez le coupon une seule fois.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 13. m9-pb-13 — Le DIP et sa fréquence d'observation — N3            */
/* ------------------------------------------------------------------ */
const frequenceObservationDip: ProblemeMoule = {
  id: 'm9-pb-13', moduleId: M9,
  titre: 'La petite ligne de la barrière : trois fréquences, trois coupons',
  titreEn: 'The barrier small print: three frequencies, three coupons',
  typeDeCas: 'options à barrière',
  typeDeCasEn: 'barrier options',
  difficulte: 3,
  scenarios: ['Le desk qui cote trois term sheets jumelles', 'La conseillère face à deux brochures « identiques »', "Grand oral : le prix d'une petite ligne"],
  scenariosEn: ['The desk quoting three twin term sheets', 'The adviser facing two "identical" brochures', 'Final viva: the price of one line of small print'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const rTx = randFloat(rng, 3.5, 4.5, 1);
    const vol = randInt(rng, 24, 26);
    const pV = randFloat(rng, 7.6, 8.2, 2);
    const pE = randFloat(rng, 2.4, 2.7, 2);
    const pM = r2(pE + randFloat(rng, 0.7, 0.9, 2));
    const pQ = r2(pM + randFloat(rng, 0.45, 0.65, 2));
    const sBas = randInt(rng, 64, 68);
    const margeCp = randFloat(rng, 0.8, 1.4, 1);

    const zc = prixZeroCoupon(rTx, 1);
    const cE = couponReverseConvertible(pE, rTx, 1);
    const cM = couponReverseConvertible(pM, rTx, 1);
    const cQ = couponReverseConvertible(pQ, rTx, 1);
    const ecartC = cQ - cE;
    const partVan = (pQ / pV) * 100;
    const cAff = r1(cQ - margeCp);
    const margeVal = (cQ - cAff) * dfContinu(rTx, 1);
    const repCE = r2(cE);
    const repCQ = r2(cQ);
    const repEcart = r2(ecartC);
    const repFalaise = 100 - sBas;
    const repPart = r1(partVan);
    const repMarge = r2(margeVal);

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `a 1-year reverse convertible on the index (spot 100, strike 100, rate ${pct(rTx, 1)}, volatility ${pct(vol, 0)}), whose protection rests on a down-and-in put of barrier 70 sold by the client; the Monte-Carlo pricer (200,000 paths) prices that same put at ${f(pE, 2)} if the barrier is observed at maturity only, ${f(pM, 2)} if observed monthly, ${f(pQ, 2)} if observed at the daily close — and the vanilla put at ${f(pV, 2)}`
      : `un reverse convertible 1 an sur l'indice (spot 100, strike 100, taux ${pct(rTx, 1)}, volatilité ${pct(vol, 0)}), dont la protection repose sur un put down-and-in de barrière 70 vendu par le client ; le pricer Monte-Carlo (200 000 trajectoires) price ce même put ${f(pE, 2)} si la barrière est observée à maturité seulement, ${f(pM, 2)} si elle est observée chaque mois, ${f(pQ, 2)} si elle est observée en clôture quotidienne — et le put vanille ${f(pV, 2)}`;
    const contexte = (en
      ? [
        `Three term sheets land on the desk this morning, and they look like triplets: same underlying, same strike, same barrier at 70, same maturity. One word differs, buried in the observation clause: "at maturity", "monthly", "daily". The pricer has already spoken: ${desc}. Your job is to turn those three put prices into three fair coupons, price the small print, walk the cliff at the barrier — and locate the margin the sales desk will quietly take on top.`,
        `The client brings two brochures to the adviser: "they are the same product, but one pays more — why?" She is right to ask: ${desc}. Same level, 70; different clocks. Your explanation must be numbers, not adjectives: the fair coupon under each observation clause, the annual price of the extra observations, what happens two points either side of the barrier at expiry — and the gap between the fair coupon and the printed one, which is nobody's generosity.`,
        `The examiner underlines one line of the term sheet with a red pen: "barrier 70, daily observation". Then he gives you the pricer outputs: ${desc}. He wants the chain of chapter 5 in full: the coupon each observation clause can pay, the price of one line of small print in coupon points, the cliff at maturity, the daily DIP as a fraction of the vanilla — and the discounted value of the margin once the printed coupon is set below the fair one.`,
      ]
      : [
        `Trois term sheets arrivent au desk ce matin, et elles ressemblent à des triplées : même sous-jacent, même strike, même barrière à 70, même maturité. Un seul mot diffère, enfoui dans la clause d'observation : « à maturité », « mensuelle », « quotidienne ». Le pricer a déjà parlé : ${desc}. Votre travail : convertir ces trois prix de put en trois coupons d'équilibre, pricer la petite ligne, longer la falaise à la barrière — et localiser la marge que le desk commercial prendra discrètement par-dessus.`,
        `La cliente apporte deux brochures à la conseillère : « c'est le même produit, mais l'un paie plus — pourquoi ? » Elle a raison de demander : ${desc}. Même niveau, 70 ; deux horloges différentes. Votre explication doit être des nombres, pas des adjectifs : le coupon d'équilibre sous chaque clause d'observation, le prix annuel des observations supplémentaires, ce qui se passe à deux points de part et d'autre de la barrière à l'échéance — et l'écart entre le coupon d'équilibre et celui de la brochure, qui n'est la générosité de personne.`,
        `L'examinateur souligne une ligne de la term sheet au stylo rouge : « barrière 70, observation quotidienne ». Puis il vous donne les sorties du pricer : ${desc}. Il attend la chaîne du chapitre 5 au complet : le coupon que chaque clause d'observation peut payer, le prix d'une ligne de petites lettres en points de coupon, la falaise à maturité, le DIP quotidien en fraction de la vanille — et la valeur actualisée de la marge une fois le coupon affiché posé sous le coupon d'équilibre.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The kindest clock' : "a) L'horloge la plus clémente",
          enonce: en
            ? `With the barrier observed at maturity only (put sold at ${f(pE, 2)}), what annual coupon can the product pay fairly, in %?`
            : `Avec la barrière observée à maturité seulement (put vendu ${f(pE, 2)}), quel coupon annuel le produit peut-il payer équitablement, en % ?`,
          reponse: repCE, tolerance: 0.1, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The chapter 3 factory, with a conditional put' : "L'usine du chapitre 3, avec un put conditionnel",
            contenu: en
              ? `Coupon = (100 − ZC + premium) / e^{−rT} / T = (100 − ${f(r2(zc), 2)} + ${f(pE, 2)}) / ${f(r2(dfContinu(rTx, 1) * 100) / 100, 4)} / 1 = **${pct(repCE, 2)}**. Premium zero would leave ${pct(r2(couponReverseConvertible(0, rTx, 1)), 2)} — the risk-free rate compounded; everything above it is the rent of the put the client sells. A barrier watched one single day is easy to avoid touching: cheap put, thin rent.`
              : `Coupon = (100 − ZC + prime) / e^{−rT} / T = (100 − ${f(r2(zc), 2)} + ${f(pE, 2)}) / ${f(r2(dfContinu(rTx, 1) * 100) / 100, 4)} / 1 = **${pct(repCE, 2)}**. Prime nulle laisserait ${pct(r2(couponReverseConvertible(0, rTx, 1)), 2)} — le taux sans risque capitalisé ; tout ce qui dépasse est le loyer du put que le client vend. Une barrière regardée un seul jour est facile à ne pas toucher : put bon marché, loyer mince.`,
          }],
        },
        {
          intitule: en ? 'b) The harshest clock' : "b) L'horloge la plus sévère",
          enonce: en
            ? `Same product, barrier observed at the daily close (put sold at ${f(pQ, 2)}). What fair annual coupon, in %?`
            : `Même produit, barrière observée en clôture quotidienne (put vendu ${f(pQ, 2)}). Quel coupon annuel équitable, en % ?`,
          reponse: repCQ, tolerance: 0.1, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'More observation dates, dearer put, fatter coupon' : "Plus de dates d'observation, put plus cher, coupon plus gras",
            contenu: en
              ? `Coupon = (100 − ${f(r2(zc), 2)} + ${f(pQ, 2)}) / ${f(r2(dfContinu(rTx, 1) * 100) / 100, 4)} = **${pct(repCQ, 2)}** (monthly gives ${pct(r2(cM), 2)}, in between). Each added observation date is one more chance to surprise the index under 70: a March plunge erased by April activates the daily barrier, not the European one. The client sells a dearer insurance — and a TRUE continuous barrier, which also sees intraday lows, would pay more still.`
              : `Coupon = (100 − ${f(r2(zc), 2)} + ${f(pQ, 2)}) / ${f(r2(dfContinu(rTx, 1) * 100) / 100, 4)} = **${pct(repCQ, 2)}** (la mensuelle donne ${pct(r2(cM), 2)}, entre les deux). Chaque date d'observation ajoutée est une occasion de plus de surprendre l'indice sous 70 : un plongeon de mars effacé en avril active la barrière quotidienne, pas l'européenne. Le client vend une assurance plus chère — et une vraie barrière continue, qui voit aussi les creux intrajournaliers, paierait plus encore.`,
          }],
          pieges: [en
            ? `"Same barrier level, same risk" reads a barrier as a number: a barrier is a level PLUS a frequency, and the term sheet always specifies the frequency in small print.`
            : `« Même niveau de barrière, même risque » lit une barrière comme un nombre : une barrière est un niveau PLUS une fréquence, et la term sheet précise toujours la fréquence en petites lettres.`],
        },
        {
          intitule: en ? 'c) The small print, priced' : 'c) La petite ligne, pricée',
          enonce: en
            ? `How many points of annual coupon does the daily observation add over the maturity-only clause?`
            : `Combien de points de coupon annuel l'observation quotidienne ajoute-t-elle par rapport à la clause à maturité seule ?`,
          reponse: repEcart, tolerance: 0.1, toleranceMode: 'absolu', unite: 'points',
          etapes: [{
            titre: en ? 'One line of text, a measurable rent' : 'Une ligne de texte, un loyer mesurable',
            contenu: en
              ? `${f(r2(cQ), 2)} − ${f(r2(cE), 2)} = **${f(repEcart, 2)} points of coupon per year**, entirely financed by the put price gap (${f(pQ, 2)} against ${f(pE, 2)}, +${pct(r1((pQ / pE - 1) * 100), 0)}). The desk reflex, chapter 5: between two products with the same coupon, the one whose barrier is watched more often makes the client sell a dearer put — equal coupon, higher risk. Here the coupons differ, and the difference IS the frequency.`
              : `${f(r2(cQ), 2)} − ${f(r2(cE), 2)} = **${f(repEcart, 2)} point de coupon par an**, entièrement financé par l'écart de prix du put (${f(pQ, 2)} contre ${f(pE, 2)}, +${pct(r1((pQ / pE - 1) * 100), 0)}). Le réflexe du desk, chapitre 5 : entre deux produits à coupon égal, celui dont la barrière est regardée plus souvent fait vendre au client un put plus cher — coupon égal, risque supérieur. Ici les coupons diffèrent, et la différence EST la fréquence.`,
          }],
        },
        {
          intitule: en ? 'd) The cliff at maturity' : 'd) La falaise à maturité',
          enonce: en
            ? `Maturity of the maturity-only version, barrier never touched before. The index closes at ${f(sBas, 0)} instead of 71. By how many points of nominal does the redemption drop between the two closes (coupon paid in both cases)?`
            : `Échéance de la version à maturité seule, barrière jamais touchée avant. L'indice clôture à ${f(sBas, 0)} au lieu de 71. De combien de points de nominal le remboursement chute-t-il entre les deux clôtures (coupon versé dans les deux cas) ?`,
          reponse: repFalaise, tolerance: 0.5, toleranceMode: 'absolu', unite: 'points',
          etapes: [{
            titre: en ? 'Two points of index, a canyon of nominal' : "Deux points d'indice, un canyon de nominal",
            contenu: en
              ? `At 71, the barrier is never touched: the put never existed, redemption 100. At ${f(sBas, 0)}, the close itself touches 70: the put is born in the money, redemption ${f(sBas, 0)}. Gap: **${f(repFalaise, 0)} points** for ${f(71 - sBas, 0)} points of index. This discontinuity is the cliff of chapter 5 — the delta explodes near the barrier close to expiry, which is why desks price with a shifted barrier (barrier shift) rather than get shredded hedging on the edge.`
              : `À 71, la barrière n'est jamais touchée : le put n'a jamais existé, remboursement 100. À ${f(sBas, 0)}, la clôture elle-même touche 70 : le put naît dans la monnaie, remboursement ${f(sBas, 0)}. Écart : **${f(repFalaise, 0)} points** pour ${f(71 - sBas, 0)} points d'indice. Cette discontinuité est la falaise du chapitre 5 — le delta explose près de la barrière proche de l'échéance, raison pour laquelle les desks pricent avec une barrière décalée (barrier shift) plutôt que de se faire hacher à couvrir sur le bord.`,
          }],
          pieges: [en
            ? `"The protection softens the fall" — a barrier is not an airbag but a switch: at ${f(sBas, 0)} the client loses the WHOLE fall from 100, not the part below 70.`
            : `« La protection amortit la chute » — une barrière n'est pas un airbag mais un interrupteur : à ${f(sBas, 0)}, le client perd TOUTE la baisse depuis 100, pas la partie sous 70.`],
        },
        {
          intitule: en ? 'e) The DIP against the vanilla' : 'e) Le DIP face à la vanille',
          enonce: en
            ? `Even observed daily, what fraction of the vanilla put's value (${f(pV, 2)}) does the barrier-70 put represent, in %?`
            : `Même observé quotidiennement, quelle fraction de la valeur du put vanille (${f(pV, 2)}) le put à barrière 70 représente-t-il, en % ?`,
          reponse: repPart, tolerance: 1, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Most of a put lives above the crash' : "L'essentiel d'un put vit au-dessus du krach",
            contenu: en
              ? `${f(pQ, 2)} / ${f(pV, 2)} = **${pct(repPart, 1)}**. The rest of the vanilla's value comes from scenarios where the index drops without ever losing 30%: scenarios the DIP never pays. Mirror reading for the seller: the client keeps the risk of the WORST scenarios and gives up the premium of the mild ones — small premium does not mean small risk, it means an improbable one (rare claim, huge claim: the catastrophe-insurance profile of module 8).`
              : `${f(pQ, 2)} / ${f(pV, 2)} = **${pct(repPart, 1)}**. Le reste de la valeur de la vanille vient des scénarios où l'indice baisse sans jamais perdre 30 % : des scénarios que le DIP ne paie jamais. Lecture miroir pour le vendeur : le client garde le risque des PIRES scénarios et abandonne la prime des scénarios doux — petite prime ne veut pas dire petit risque, mais risque improbable (sinistre rare, sinistre énorme : le profil d'assureur catastrophe du module 8).`,
          }],
        },
        {
          intitule: en ? 'f) The printed coupon, and the margin' : 'f) Le coupon affiché, et la marge',
          enonce: en
            ? `The daily version is sold with a printed coupon of ${pct(cAff, 1)} instead of the fair ${pct(repCQ, 2)}. Discounted at e^{−rT}, how many points of nominal does the bank lock in at issuance?`
            : `La version quotidienne se vend avec un coupon affiché de ${pct(cAff, 1)} au lieu des ${pct(repCQ, 2)} d'équilibre. Actualisée en e^{−rT}, combien de points de nominal la banque verrouille-t-elle à l'émission ?`,
          reponse: repMarge, tolerance: 0.05, toleranceMode: 'absolu', unite: 'points',
          etapes: [
            {
              titre: en ? 'The coupon gap, discounted once' : "L'écart de coupon, actualisé une fois",
              contenu: en
                ? `Margin = (${f(r2(cQ), 2)} − ${f(cAff, 1)}) × e^{−rT} = ${f(r2(cQ - cAff), 2)} × ${f(r2(dfContinu(rTx, 1) * 100) / 100, 4)} = **${f(repMarge, 2)} points** per 100 of nominal, locked at issuance whatever the index does — the same mechanics as the 10.99% fair versus 9% printed of chapter 3. On a 100 M€ issue: ${f(r1(repMarge), 1)} M€, no market view required.`
                : `Marge = (${f(r2(cQ), 2)} − ${f(cAff, 1)}) × e^{−rT} = ${f(r2(cQ - cAff), 2)} × ${f(r2(dfContinu(rTx, 1) * 100) / 100, 4)} = **${f(repMarge, 2)} points** pour 100 de nominal, verrouillés à l'émission quoi que fasse l'indice — la même mécanique que les 10,99 % d'équilibre contre 9 % affichés du chapitre 3. Sur une émission de 100 M€ : ${f(r1(repMarge), 1)} M€, sans aucune vue de marché.`,
            },
            {
              titre: en ? 'The honest summary for the client' : 'Le résumé honnête pour la cliente',
              contenu: en
                ? `The two brochures were never the same product: one clock makes the put ${pct(r1((pQ / pE - 1) * 100), 0)} dearer than the other, and the fatter coupon is the receipt. The reading order never changes: find the option sold, check WHEN its barrier is watched, then ask what the fair coupon would be — the distance to the printed one is the only number the brochure will never print.`
                : `Les deux brochures n'ont jamais été le même produit : une horloge rend le put ${pct(r1((pQ / pE - 1) * 100), 0)} plus cher que l'autre, et le coupon plus gras en est le reçu. L'ordre de lecture ne change jamais : trouver l'option vendue, vérifier QUAND sa barrière est regardée, puis demander ce que serait le coupon d'équilibre — la distance au coupon affiché est le seul nombre que la brochure n'imprimera jamais.`,
            },
          ],
          pieges: [en
            ? `Counting the margin as the raw coupon gap (${f(r2(cQ - cAff), 2)} points) forgets that the coupon is paid at maturity: the value locked TODAY is that gap discounted.`
            : `Compter la marge comme l'écart de coupon brut (${f(r2(cQ - cAff), 2)} point) oublie que le coupon se paie à l'échéance : la valeur verrouillée AUJOURD'HUI est cet écart actualisé.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 14. m9-pb-14 — Worst-of et corrélation, vus du desk — N3            */
/* ------------------------------------------------------------------ */
const worstOfCorrelation: ProblemeMoule = {
  id: 'm9-pb-14', moduleId: M9,
  titre: 'Worst-of : le paramètre que la vitrine ne montre pas',
  typeDeCas: 'worst-of et corrélation',
  titreEn: 'Worst-of: the parameter the shop window never shows',
  typeDeCasEn: 'worst-of and correlation',
  difficulte: 3,
  scenarios: ['Le junior du desk corrélation et la table du pricer', 'Le comité des risques fixe la limite de corrélation', 'Grand oral : qui est court de corrélation ?'],
  scenariosEn: ["The correlation desk junior and the pricer's table", 'The risk committee setting the correlation limit', 'Final viva: who is short correlation?'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const rTx = randFloat(rng, 3, 4, 1);
    const vol1 = randInt(rng, 22, 24);
    const vol2 = randInt(rng, 23, 25);
    const p1 = randFloat(rng, 6.3, 7.2, 1);
    const p08 = r1(p1 + randFloat(rng, 1.8, 2.4, 1));
    const p05 = r1(p08 + randFloat(rng, 1.2, 1.7, 1));
    const p0 = r1(p05 + randFloat(rng, 1.2, 1.8, 1));
    const encours = randInt(rng, 400, 900);
    const T = 3;

    const c1 = couponReverseConvertible(p1, rTx, T);
    const c05 = couponReverseConvertible(p05, rTx, T);
    const primeDisp = c05 - c1;
    const perte08 = ((p05 - p08) / 100) * encours;
    const perte1 = ((p05 - p1) / 100) * encours;
    const sensK = ((p05 - p1) / 50 / 100) * encours * 1000;
    const repC1 = r2(c1);
    const repC05 = r2(c05);
    const repDisp = r2(primeDisp);
    const repPerte08 = r1(perte08);
    const repPerte1 = r1(perte1);
    const repSens = r0(sensK);

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `a 3-year note on the WORST performance of two indices (both at 100, volatilities ${pct(vol1, 0)} and ${pct(vol2, 0)}, rate ${pct(rTx, 1)}): the client sells a worst-of down-and-in put, strike 100, barrier 60 observed on the worst performance; the Monte-Carlo pricer values that put at ${f(p1, 1)} with correlation 100%, ${f(p08, 1)} at 80%, ${f(p05, 1)} at 50% — the desk's pricing level — and ${f(p0, 1)} at 0%; the bank carries ${f(encours, 0)} M€ of these notes on its book`
      : `une note 3 ans sur la PIRE performance de deux indices (tous deux à 100, volatilités ${pct(vol1, 0)} et ${pct(vol2, 0)}, taux ${pct(rTx, 1)}) : le client vend un put down-and-in worst-of, strike 100, barrière 60 observée sur la pire performance ; le pricer Monte-Carlo valorise ce put ${f(p1, 1)} à corrélation 100 %, ${f(p08, 1)} à 80 %, ${f(p05, 1)} à 50 % — le niveau de pricing du desk — et ${f(p0, 1)} à 0 % ; la banque porte ${f(encours, 0)} M€ de ces notes dans son book`;
    const contexte = (en
      ? [
        `First rotation on the correlation desk, and the head trader pins one pricer table to your screen: the same worst-of put, four correlations, four prices. The product: ${desc}. Read the table both ways, she says: leftward, it is the client's coupon — dispersion makes the put he sells dearer; rightward, it is OUR book — we are long those puts, and every point of correlation the market gains takes money from us. Coupons first, P&L second.`,
        `The risk committee reviews the structured book's correlation limit, and the numbers on the table are: ${desc}. The committee wants the exposure stated the desk way: what coupon the pricing correlation finances, what part of it is pure dispersion premium, what the book loses if correlation reprices from 50 to 80 — and to 100, the crisis case — and finally the size in euros per correlation point, because a limit is set on a sensitivity, not on a feeling.`,
        `The examiner draws the pricer's table on the board — four correlations, four put prices — and asks the only question that matters: "who is short correlation here, and how much per point?" The data: ${desc}. He expects the mono-underlying benchmark at ρ = 100%, the coupon at the desk's 50%, the dispersion premium in coupon points, the two crisis re-marks in millions, and the sensitivity that summarises the whole book in one number.`,
      ]
      : [
        `Première rotation au desk corrélation, et la trader senior punaise une seule table du pricer sur votre écran : le même put worst-of, quatre corrélations, quatre prix. Le produit : ${desc}. Lisez la table dans les deux sens, dit-elle : vers la gauche, c'est le coupon du client — la dispersion rend le put qu'il vend plus cher ; vers la droite, c'est NOTRE book — nous sommes longs de ces puts, et chaque point de corrélation que le marché gagne nous prend de l'argent. Les coupons d'abord, le P&L ensuite.`,
        `Le comité des risques revoit la limite de corrélation du book structuré, et les nombres sur la table sont : ${desc}. Le comité veut l'exposition dite à la façon du desk : quel coupon la corrélation de pricing finance, quelle part en est pure prime de dispersion, ce que le book perd si la corrélation se re-price de 50 à 80 — puis à 100, le cas de crise — et enfin la taille en euros par point de corrélation, parce qu'une limite se fixe sur une sensibilité, pas sur une impression.`,
        `L'examinateur dessine la table du pricer au tableau — quatre corrélations, quatre prix de put — et pose la seule question qui compte : « qui est court de corrélation ici, et combien par point ? » Les données : ${desc}. Il attend l'étalon mono sous-jacent à ρ = 100 %, le coupon aux 50 % du desk, la prime de dispersion en points de coupon, les deux re-marquages de crise en millions, et la sensibilité qui résume tout le book en un nombre.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The benchmark: correlation 100%' : "a) L'étalon : corrélation 100 %",
          enonce: en
            ? `At ρ = 100% the pricer gives ${f(p1, 1)}. What annual coupon does that premium finance over 3 years, in %?`
            : `À ρ = 100 %, le pricer donne ${f(p1, 1)}. Quel coupon annuel cette prime finance-t-elle sur 3 ans, en % ?`,
          reponse: repC1, tolerance: 0.1, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Two twins moving as one' : 'Deux jumeaux qui bougent comme un seul',
            contenu: en
              ? `Coupon = (100 − ZC + ${f(p1, 1)}) / e^{−rT} / T = **${pct(repC1, 2)}** per year. At ρ = 100% with near-twin indices, the Cholesky recipe gives z₂ = z₁: identical paths, the "worst of the two" IS the single underlying — the pricer's coherence test. This coupon is the honest mono-underlying benchmark; everything the shop window adds beyond it will be paid in dispersion.`
              : `Coupon = (100 − ZC + ${f(p1, 1)}) / e^{−rT} / T = **${pct(repC1, 2)}** par an. À ρ = 100 % avec des indices quasi jumeaux, la recette de Cholesky donne z₂ = z₁ : trajectoires identiques, le « pire des deux » EST le sous-jacent unique — le test de cohérence du pricer. Ce coupon est l'étalon mono sous-jacent honnête ; tout ce que la vitrine ajoutera au-delà se paiera en dispersion.`,
          }],
        },
        {
          intitule: en ? "b) The desk's coupon: correlation 50%" : 'b) Le coupon du desk : corrélation 50 %',
          enonce: en
            ? `At the pricing correlation of 50% the put is worth ${f(p05, 1)}. What annual coupon does the note display, in %?`
            : `À la corrélation de pricing de 50 %, le put vaut ${f(p05, 1)}. Quel coupon annuel la note affiche-t-elle, en % ?`,
          reponse: repC05, tolerance: 0.1, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Dispersion sinks the worst, fattens the premium' : 'La dispersion enfonce le pire, engraisse la prime',
            contenu: en
              ? `Coupon = (100 − ZC + ${f(p05, 1)}) / e^{−rT} / T = **${pct(repC05, 2)}**. Lower correlation lets the two indices live separate lives: it only takes ONE of them to stumble for the worst to sink, so the barrier on the worst is hit more often and the put the client sells is worth ${f(p05, 1)} instead of ${f(p1, 1)}. The extra premium recycles into the printed coupon — no index got riskier; only the MINIMUM did.`
              : `Coupon = (100 − ZC + ${f(p05, 1)}) / e^{−rT} / T = **${pct(repC05, 2)}**. Une corrélation plus basse laisse les deux indices vivre chacun leur vie : il suffit qu'UN SEUL trébuche pour que le pire s'enfonce, donc la barrière sur le pire est touchée plus souvent et le put que vend le client vaut ${f(p05, 1)} au lieu de ${f(p1, 1)}. Le surcroît de prime se recycle en coupon affiché — aucun indice n'est devenu plus risqué ; seul le MINIMUM l'est devenu.`,
          }],
          pieges: [en
            ? `"Two indices = diversification = less risk" is module 2's independence reflex applied to the wrong payoff: diversification helps whoever holds the AVERAGE of a basket, never whoever is paid on its WORST.`
            : `« Deux indices = diversification = moins de risque » est le réflexe d'indépendance du module 2 appliqué au mauvais payoff : la diversification profite à qui touche la MOYENNE d'un panier, jamais à qui n'en touche que le PIRE.`],
        },
        {
          intitule: en ? 'c) The dispersion premium' : 'c) La prime de dispersion',
          enonce: en
            ? `How many points of annual coupon does the worst-of add over the mono-underlying benchmark?`
            : `Combien de points de coupon annuel le worst-of ajoute-t-il par rapport à l'étalon mono sous-jacent ?`,
          reponse: repDisp, tolerance: 0.1, toleranceMode: 'absolu', unite: 'points',
          etapes: [{
            titre: en ? 'The coupon supplement has a name' : 'Le supplément de coupon a un nom',
            contenu: en
              ? `${f(r2(c05), 2)} − ${f(r2(c1), 2)} = **${f(repDisp, 2)} points per year**: in desk jargon, the dispersion risk premium. The client encashes it without being able to name it — he compares coupons, never correlations. What he actually took is a position: if the indices decouple (one bank plunging while the index holds), the worst sinks and HE pays, in degraded redemption.`
              : `${f(r2(c05), 2)} − ${f(r2(c1), 2)} = **${f(repDisp, 2)} point par an** : dans le jargon des salles, la prime du risque de dispersion. Le client l'encaisse sans savoir la nommer — il compare des coupons, jamais des corrélations. Ce qu'il a réellement pris, c'est une position : si les indices décrochent l'un de l'autre (une banque qui plonge pendant que l'indice tient), le pire s'enfonce et c'est LUI qui paie, en remboursement dégradé.`,
          }],
        },
        {
          intitule: en ? 'd) The book when correlation reprices to 80%' : 'd) Le book quand la corrélation se re-price à 80 %',
          enonce: en
            ? `The desk is LONG the worst-of puts its clients sold (${f(encours, 0)} M€ of notes). Market stress pushes the pricing correlation from 50% to 80%. What does the book lose, in M€?`
            : `Le desk est LONG des puts worst-of que ses clients ont vendus (${f(encours, 0)} M€ de notes). Un stress de marché pousse la corrélation de pricing de 50 % à 80 %. Que perd le book, en M€ ?`,
          reponse: repPerte08, tolerance: Math.max(0.3, repPerte08 * 0.05), toleranceMode: 'absolu', unite: 'M€',
          etapes: [{
            titre: en ? 'Long the put, short the correlation' : 'Long du put, court de la corrélation',
            contenu: en
              ? `The puts the desk holds fall from ${f(p05, 1)} to ${f(p08, 1)} per 100: loss = (${f(p05, 1)} − ${f(p08, 1)}) % × ${f(encours, 0)} M€ = **${f(repPerte08, 1)} M€**. When correlation rises, dispersion disappears, the worst is less bad, and the desk's puts deflate: an autocall book is structurally SHORT correlation — the sign to burn in: the book loses exactly when markets start moving together.`
              : `Les puts que le desk détient tombent de ${f(p05, 1)} à ${f(p08, 1)} pour 100 : perte = (${f(p05, 1)} − ${f(p08, 1)}) % × ${f(encours, 0)} M€ = **${f(repPerte08, 1)} M€**. Quand la corrélation monte, la dispersion disparaît, le pire est moins pire, et les puts du desk se dégonflent : un book d'autocalls est structurellement COURT de corrélation — le signe à graver : le book perd exactement quand les marchés se mettent à bouger ensemble.`,
          }],
          pieges: [en
            ? `"The desk is long puts, so stress helps it" confuses two parameters: on the SPOT the desk's puts gain in a crash, but on the CORRELATION they lose — and crises move both at once.`
            : `« Le desk est long des puts, donc le stress l'aide » confond deux paramètres : sur le SPOT, les puts du desk gagnent dans un krach, mais sur la CORRÉLATION ils perdent — et les crises font bouger les deux à la fois.`],
        },
        {
          intitule: en ? 'e) The crisis case: correlations go to 1' : 'e) Le cas de crise : les corrélations vont à 1',
          enonce: en
            ? `2008, March 2020: panic sells everything and correlations jump towards 100%. From the 50% pricing level, what is the book's total correlation loss, in M€?`
            : `2008, mars 2020 : la panique vend tout et les corrélations bondissent vers 100 %. Depuis le niveau de pricing de 50 %, quelle est la perte totale de corrélation du book, en M€ ?`,
          reponse: repPerte1, tolerance: Math.max(0.3, repPerte1 * 0.05), toleranceMode: 'absolu', unite: 'M€',
          etapes: [{
            titre: en ? 'The diversification that dies on schedule' : "La diversification qui meurt à l'heure dite",
            contenu: en
              ? `(${f(p05, 1)} − ${f(p1, 1)}) % × ${f(encours, 0)} M€ = **${f(repPerte1, 1)} M€** — the whole dispersion premium collected from clients over the years, given back in one repricing. The client's side is the mirror: the scenario that breaches his barrier is not three independent strokes of bad luck but ONE systemic event, whose probability is that of a crash — not a crash cubed. In crisis, correlations go to 1: the module 11 sentence, and this book is why desks say it with feeling.`
              : `(${f(p05, 1)} − ${f(p1, 1)}) % × ${f(encours, 0)} M€ = **${f(repPerte1, 1)} M€** — toute la prime de dispersion collectée auprès des clients au fil des ans, rendue en un seul re-pricing. Le côté client est le miroir : le scénario qui perce sa barrière n'est pas trois malchances indépendantes mais UN SEUL événement systémique, dont la probabilité est celle d'un krach — pas d'un krach au cube. En crise, les corrélations vont à 1 : la phrase du module 11, et ce book est la raison pour laquelle les desks la prononcent avec émotion.`,
          }],
        },
        {
          intitule: en ? 'f) The limit, set in euros per point' : 'f) La limite, fixée en euros par point',
          enonce: en
            ? `Averaged between ρ = 50% and ρ = 100%, what is the book's sensitivity in thousands of euros per point of correlation (1 point = 0.01 of ρ)?`
            : `En moyenne entre ρ = 50 % et ρ = 100 %, quelle est la sensibilité du book en milliers d'euros par point de corrélation (1 point = 0,01 de ρ) ?`,
          reponse: repSens, tolerance: Math.max(3, repSens * 0.05), toleranceMode: 'absolu', unite: 'k€/point',
          etapes: [
            {
              titre: en ? 'A slope, read off the pricer table' : 'Une pente, lue sur la table du pricer',
              contenu: en
                ? `(${f(p05, 1)} − ${f(p1, 1)}) points of put over 50 points of correlation = ${f(r2((p05 - p1) / 50), 3)} point of nominal per correlation point; × ${f(encours, 0)} M€ = **${f(repSens, 0)} k€ per point**, losing when ρ rises. That is the number the committee writes into the limit — desks measure books in sensitivities (vega, correlation, dividends), never in "amounts of products".`
                : `(${f(p05, 1)} − ${f(p1, 1)}) points de put sur 50 points de corrélation = ${f(r2((p05 - p1) / 50), 3)} point de nominal par point de corrélation ; × ${f(encours, 0)} M€ = **${f(repSens, 0)} k€ par point**, perdant quand ρ monte. C'est le nombre que le comité écrit dans la limite — les desks mesurent les books en sensibilités (vega, corrélation, dividendes), jamais en « quantités de produits ».`,
            },
            {
              titre: en ? 'Why the desk buys correlation' : 'Pourquoi le desk achète de la corrélation',
              contenu: en
                ? `Book after book, this short accumulates: structuring desks have become the market's great BUYERS of equity correlation, hedging a risk whose involuntary source is their own clientele. Keep the chain for the bosses: in March 2020 the correlation leg lost at the same moment as the dividend leg and the barrier Greeks — three invisible risks, one direction.`
                : `Book après book, ce court s'accumule : les desks de structuration sont devenus les grands ACHETEURS de corrélation actions du marché, couvrant un risque dont leur propre clientèle est la source involontaire. Gardez la chaîne pour les boss : en mars 2020, la jambe corrélation a perdu au même moment que la jambe dividendes et que les grecques de barrière — trois risques invisibles, une seule direction.`,
            },
          ],
          pieges: [en
            ? `Dividing by 0.5 instead of 50 confuses ρ in decimal with ρ in points: the statement's convention (chapter 5, Cholesky) is decimal for the maths, points for the desk talk — say which one you are using.`
            : `Diviser par 0,5 au lieu de 50 confond ρ en décimal et ρ en points : la convention de l'énoncé (chapitre 5, Cholesky) est décimale pour le calcul, en points pour la salle — dites laquelle vous utilisez.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 15. m9-pb-15 — Lehman 2008 : « garanti » par qui ? — BOSS N4        */
/* ------------------------------------------------------------------ */
const lehmanGarantie: ProblemeMoule = {
  id: 'm9-pb-15', moduleId: M9,
  titre: 'Lehman 2008 : « garanti » par qui ?',
  titreEn: 'Lehman 2008: "guaranteed" — by whom?',
  typeDeCas: 'risque émetteur',
  typeDeCasEn: 'issuer risk',
  difficulte: 4,
  scenarios: ['La conseillère et sa cliente, au matin du 16 septembre', "L'avocat des porteurs chiffre le préjudice", "Grand oral : l'autopsie du capital « garanti »"],
  scenariosEn: ['The adviser and her client, on the morning of September 16', "The holders' lawyer prices the damage", 'Final viva: the autopsy of "guaranteed" capital'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const rTx = randFloat(rng, 4, 4.6, 1);
    const vol = randInt(rng, 16, 20);
    const marge = randFloat(rng, 1, 1.5, 1);
    const T = 5;
    const spreadBp = randInt(rng, 250, 400);
    const rec = randInt(rng, 20, 32);
    const bb = randInt(rng, 85, 96);
    const invest = pick(rng, [10000, 20000, 50000] as const);
    const anneesProc = randInt(rng, 8, 12);

    const zc = prixZeroCoupon(rTx, T);
    const call = blackScholesCall(100, 100, rTx, vol, T);
    const budget = budgetOptions(zc, marge);
    const p = participationCapitalGaranti(budget, call);
    const zcSain = prixZeroCoupon(rTx, 3);
    const zcRisque = prixZeroCoupon(rTx + spreadBp / 100, 3);
    const ecartSpread = zcSain - zcRisque;
    const recNominal = (invest * rec) / 100;
    const recActualise = recNominal * dfContinu(rTx, anneesProc);
    const ecartHk = ((bb - rec) / 100) * invest;
    const repZc = r2(zc);
    const repPart = r1(p * 100);
    const repEcartSpread = r2(ecartSpread);
    const repRec = r0(recNominal);
    const repRecPv = r0(recActualise);
    const repHk = r0(ecartHk);

    const { en, f, pct, mnt } = outils(langue);
    const desc = en
      ? `a 5-year note "100% capital guaranteed at maturity plus participation in the index" issued in 2006 by a large American investment bank rated A (rate at issue ${pct(rTx, 1)}, ATM volatility ${pct(vol, 0)}, margin ${pct(marge, 1)}); the 5-year ATM call cost ${pct(r2(call), 2)} of the nominal; by the summer of 2008 the market quotes the issuer's senior debt ${f(spreadBp, 0)} basis points above the risk-free curve, with 3 years left on the note; the client invested ${mnt(invest, '€', 0)}`
      : `une note 5 ans « capital garanti à 100 % à l'échéance plus participation à l'indice » émise en 2006 par une grande banque d'investissement américaine notée A (taux à l'émission ${pct(rTx, 1)}, volatilité ATM ${pct(vol, 0)}, marge ${pct(marge, 1)}) ; le call ATM 5 ans coûtait ${pct(r2(call), 2)} du nominal ; à l'été 2008, le marché cote la dette senior de l'émetteur ${f(spreadBp, 0)} points de base au-dessus de la courbe sans risque, à 3 ans de l'échéance de la note ; la cliente a investi ${mnt(invest, '€', 0)}`;
    const contexte = (en
      ? [
        `Tuesday, September 16, 2008. Yesterday, at 1:45 a.m. New York time, Lehman Brothers — fourth-largest American investment bank, rated A until the summer — filed for bankruptcy. Your client is waiting in the meeting room with her contract: ${desc}. She has underlined one line in green: "capital 100% guaranteed". She wants to know when she gets her money back. You know the answer has changed meaning overnight.\n\nBefore facing her, rebuild the file from the beginning: what the note really was — a zero-coupon plus a call, chapter 2 —, what the market's spread was already saying about the "guarantee" that summer, and what a senior claim on a bankrupt estate is worth: a few tens of cents per dollar, paid over a decade of proceedings. Then the one comparison that will matter to her: what Hong Kong's regulator obtained for the minibond holders, and what the liquidation gave everyone else.`,
        `The law firm represents several hundred retail holders of the same product: ${desc}. Germany counts around 50,000 of them — the press has invented a word, the "Lehman-Oma", the grandmother whose savings bank sold her these certificates as a safe investment; Belgium and the Netherlands tens of thousands more; Hong Kong over 40,000 "minibond" holders, for on the order of 2 billion dollars. Your task is the damage calculation the court will ask for.\n\nWalk it in order: the product decomposed at issuance (the zero-coupon IS the guarantee — and it is a bond, with all of module 5's credit risk); the warning already priced by the market in the summer of 2008; the value of the claim at the estimated recovery rate; that value discounted over the years the proceedings will take; and the gap with the Hong Kong outcome, where the regulator forced the distributing banks to buy the paper back. The KID that PRIIPs will impose in 2018 — issuer's identity on page one — is being written in this file.`,
        `The examiner opens with the sentence every jury has ready: "Capital guaranteed is never a property of the product. Prove it to me on Lehman." The data: ${desc}.\n\nHe expects the full autopsy: the zero-coupon and the participation at issuance, to show WHERE the guarantee lives; the senior spread of summer 2008 turned into points of present value, to show the market saw it coming; the recovery arithmetic of the bankruptcy — a few tens of cents per dollar, a decade of waiting —; and the Hong Kong counterfactual. He will end on regulation: which European document, born of this exact scandal, now prints the issuer's name and default scenario on its first page.`,
      ]
      : [
        `Mardi 16 septembre 2008. Hier, à 1 h 45 du matin heure de New York, Lehman Brothers — quatrième banque d'investissement américaine, notée A jusqu'à l'été — a déposé le bilan. Votre cliente attend en salle de réunion avec son contrat : ${desc}. Elle a souligné une ligne en vert : « capital garanti à 100 % ». Elle veut savoir quand elle récupère son argent. Vous savez que la réponse a changé de sens pendant la nuit.\n\nAvant de l'affronter, reconstituez le dossier depuis le début : ce que la note était vraiment — un zéro-coupon plus un call, chapitre 2 —, ce que le spread du marché disait déjà de la « garantie » cet été-là, et ce que vaut une créance senior sur une masse en faillite : quelques dizaines de cents par dollar, payés au fil d'une décennie de procédures. Puis la seule comparaison qui comptera pour elle : ce que le régulateur de Hong Kong a obtenu pour les porteurs de minibonds, et ce que la liquidation a donné à tous les autres.`,
        `Le cabinet représente plusieurs centaines de porteurs particuliers du même produit : ${desc}. L'Allemagne en compte de l'ordre de 50 000 — la presse a inventé un mot, la « Lehman-Oma », cette grand-mère à qui sa caisse d'épargne avait vendu ces certificats comme un placement sûr ; la Belgique et les Pays-Bas, des dizaines de milliers d'autres ; Hong Kong, plus de 40 000 porteurs de « minibonds », pour de l'ordre de 2 milliards de dollars. Votre travail est le chiffrage du préjudice que le tribunal demandera.\n\nDéroulez dans l'ordre : le produit décomposé à l'émission (le zéro-coupon EST la garantie — et c'est une obligation, avec tout le risque de crédit du module 5) ; l'avertissement que le marché pricait déjà à l'été 2008 ; la valeur de la créance au taux de recouvrement estimé ; cette valeur actualisée sur les années que dureront les procédures ; et l'écart avec l'issue de Hong Kong, où le régulateur a contraint les banques distributrices à racheter le papier. Le KID que PRIIPs imposera en 2018 — identité de l'émetteur en première page — est en train de s'écrire dans ce dossier.`,
        `L'examinateur ouvre avec la phrase que tout jury tient prête : « Capital garanti n'est jamais une propriété du produit. Prouvez-le-moi sur Lehman. » Les données : ${desc}.\n\nIl attend l'autopsie complète : le zéro-coupon et la participation à l'émission, pour montrer OÙ loge la garantie ; le spread senior de l'été 2008 converti en points de valeur actuelle, pour montrer que le marché voyait venir ; l'arithmétique de recouvrement de la faillite — quelques dizaines de cents par dollar, une décennie d'attente — ; et le contrefactuel de Hong Kong. Il finira sur la régulation : quel document européen, né de ce scandale précis, imprime désormais le nom de l'émetteur et le scénario de défaut en première page.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) Where the guarantee lives' : 'a) Où loge la garantie',
          enonce: en
            ? `At issuance in 2006, what did the zero-coupon carrying the "guarantee" cost, in % of the nominal?`
            : `À l'émission en 2006, que coûtait le zéro-coupon qui porte la « garantie », en % du nominal ?`,
          reponse: repZc, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The guarantee is a bond' : 'La garantie est une obligation',
            contenu: en
              ? `ZC = 100·e^{−${f(rTx, 1)}% × 5} = **${pct(repZc, 2)}**. Read the words precisely: this zero-coupon is not a vault, it is a CLAIM — senior unsecured debt of the issuer. "Capital guaranteed" means "the issuer promises to pay 100": the entire promise is worth the signature beneath it, and nothing else. In 2006, that signature is rated A and nobody asks the question.`
              : `ZC = 100·e^{−${f(rTx, 1)} % × 5} = **${pct(repZc, 2)}**. Lisez les mots précisément : ce zéro-coupon n'est pas un coffre-fort, c'est une CRÉANCE — dette senior non sécurisée de l'émetteur. « Capital garanti » signifie « l'émetteur promet de payer 100 » : toute la promesse vaut la signature qui est dessous, et rien d'autre. En 2006, cette signature est notée A et personne ne pose la question.`,
          }],
        },
        {
          intitule: en ? 'b) The promise on the brochure' : 'b) La promesse de la brochure',
          enonce: en
            ? `With the ${pct(marge, 1)} margin taken and the ATM call at ${pct(r2(call), 2)}, what participation in the index did the note display, in %?`
            : `Marge de ${pct(marge, 1)} prélevée et call ATM à ${pct(r2(call), 2)} : quelle participation à l'indice la note affichait-elle, en % ?`,
          reponse: repPart, tolerance: 0.5, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Chapter 2, standard issue' : 'Chapitre 2, modèle standard',
            contenu: en
              ? `Budget = 100 − ${f(repZc, 2)} − ${f(marge, 1)} = ${f(r2(budget), 2)}; participation = ${f(r2(budget), 2)} / ${f(r2(call), 2)} = **${pct(repPart, 1)}** of the rise. A perfectly honest machine so far — thousands of these notes were sold across Europe and Asia exactly like this one. The flaw is not in the formula: it is in the line of the term sheet nobody reads, the first one, the issuer's name.`
              : `Budget = 100 − ${f(repZc, 2)} − ${f(marge, 1)} = ${f(r2(budget), 2)} ; participation = ${f(r2(budget), 2)} / ${f(r2(call), 2)} = **${pct(repPart, 1)}** de la hausse. Une machine parfaitement honnête jusqu'ici — des milliers de ces notes ont été vendues en Europe et en Asie exactement comme celle-ci. Le défaut n'est pas dans la formule : il est dans la ligne de la term sheet que personne ne lit, la première, le nom de l'émetteur.`,
          }],
        },
        {
          intitule: en ? 'c) What the market already knew' : 'c) Ce que le marché savait déjà',
          enonce: en
            ? `Summer 2008, 3 years to maturity: the issuer's senior debt trades ${f(spreadBp, 0)} bp above the risk-free curve. By how many points of nominal does discounting the "guaranteed" 100 at r + spread, instead of r, reduce its present value?`
            : `Été 2008, 3 ans avant l'échéance : la dette senior de l'émetteur traite ${f(spreadBp, 0)} pb au-dessus de la courbe sans risque. De combien de points de nominal l'actualisation des 100 « garantis » à r + spread, au lieu de r, réduit-elle leur valeur actuelle ?`,
          reponse: repEcartSpread, tolerance: 0.1, toleranceMode: 'absolu', unite: 'points',
          etapes: [{
            titre: en ? 'The spread is the price of the signature' : 'Le spread est le prix de la signature',
            contenu: en
              ? `At r: 100·e^{−${f(rTx, 1)}% × 3} = ${f(r2(zcSain), 2)}. At r + ${f(spreadBp, 0)} bp: 100·e^{−${f(r1(rTx + spreadBp / 100), 1)}% × 3} = ${f(r2(zcRisque), 2)}. Gap: **${f(repEcartSpread, 2)} points** — the market was already saying, months before the filing, that "100 guaranteed by this signature" was worth ${f(r2(zcRisque), 2)}, not ${f(r2(zcSain), 2)}. Module 5 in one line: a guarantee is a credit exposure, and credit has a market price that moves BEFORE the default.`
              : `À r : 100·e^{−${f(rTx, 1)} % × 3} = ${f(r2(zcSain), 2)}. À r + ${f(spreadBp, 0)} pb : 100·e^{−${f(r1(rTx + spreadBp / 100), 1)} % × 3} = ${f(r2(zcRisque), 2)}. Écart : **${f(repEcartSpread, 2)} points** — le marché disait déjà, des mois avant le dépôt de bilan, que « 100 garantis par cette signature » valaient ${f(r2(zcRisque), 2)}, pas ${f(r2(zcSain), 2)}. Le module 5 en une ligne : une garantie est une exposition de crédit, et le crédit a un prix de marché qui bouge AVANT le défaut.`,
          }],
          pieges: [en
            ? `"The note was still rated A, so it was safe" reads the rating as a price: spreads reprice continuously, ratings by committee — the ${f(spreadBp, 0)} bp were public information that no brochure ever relays.`
            : `« La note était encore notée A, donc c'était sûr » lit la notation comme un prix : les spreads se re-pricent en continu, les notations en comité — les ${f(spreadBp, 0)} pb étaient une information publique qu'aucune brochure ne relaie jamais.`],
        },
        {
          intitule: en ? 'd) The claim, after the filing' : 'd) La créance, après le dépôt de bilan',
          enonce: en
            ? `The liquidation is expected to return about ${f(rec, 0)} cents per dollar of senior claim. On the ${mnt(invest, '€', 0)} invested, what nominal amount will the client eventually recover, in €?`
            : `La liquidation devrait rendre environ ${f(rec, 0)} cents par dollar de créance senior. Sur les ${mnt(invest, '€', 0)} investis, quel montant nominal la cliente finira-t-elle par récupérer, en € ?`,
          reponse: repRec, tolerance: Math.max(10, repRec * 0.01), toleranceMode: 'absolu', unite: '€',
          etapes: [{
            titre: en ? 'From "guaranteed" to "creditor"' : 'De « garanti » à « créancière »',
            contenu: en
              ? `${mnt(invest, '€', 0)} × ${f(rec, 0)}% = **${mnt(repRec, '€', 0)}**. Overnight, the client stopped being an investor with a guarantee and became an unsecured creditor in the largest bankruptcy in American history. The index no longer matters; the participation no longer matters; the only remaining variable is the recovery rate of a liquidation — and around 50,000 German savers, tens of thousands of Belgian and Dutch holders, discovered that word at the same time as she did.`
              : `${mnt(invest, '€', 0)} × ${f(rec, 0)} % = **${mnt(repRec, '€', 0)}**. Du jour au lendemain, la cliente a cessé d'être une investisseuse munie d'une garantie pour devenir créancière chirographaire de la plus grosse faillite de l'histoire américaine. L'indice ne compte plus ; la participation ne compte plus ; la seule variable restante est le taux de recouvrement d'une liquidation — et de l'ordre de 50 000 épargnants allemands, des dizaines de milliers de porteurs belges et néerlandais, ont découvert ce mot en même temps qu'elle.`,
          }],
        },
        {
          intitule: en ? 'e) A decade of proceedings, discounted' : "e) Une décennie de procédures, actualisée",
          enonce: en
            ? `Those cents will arrive after roughly ${f(anneesProc, 0)} years of proceedings. Discounted at ${pct(rTx, 1)}, what is the recovery worth today, in €?`
            : `Ces cents arriveront après environ ${f(anneesProc, 0)} ans de procédures. Actualisé à ${pct(rTx, 1)}, que vaut le recouvrement aujourd'hui, en € ?`,
          reponse: repRecPv, tolerance: Math.max(10, repRecPv * 0.02), toleranceMode: 'absolu', unite: '€',
          etapes: [{
            titre: en ? 'Time is part of the damage' : 'Le temps fait partie du préjudice',
            contenu: en
              ? `${mnt(repRec, '€', 0)} × e^{−${f(rTx, 1)}% × ${f(anneesProc, 0)}} = **${mnt(repRecPv, '€', 0)}** in today's euros — ${pct(r1((recActualise / invest) * 100), 1)} of the initial stake. The Lehman estate did pay senior creditors over the following decade, distribution after distribution; but a euro received in ${f(anneesProc, 0)} years is not a euro, and module 4's discounting applies to lawsuits as mercilessly as to bonds. This is the number a court calls the damage.`
              : `${mnt(repRec, '€', 0)} × e^{−${f(rTx, 1)} % × ${f(anneesProc, 0)}} = **${mnt(repRecPv, '€', 0)}** d'aujourd'hui — ${pct(r1((recActualise / invest) * 100), 1)} de la mise initiale. La masse Lehman a bel et bien payé les créanciers seniors au fil de la décennie suivante, distribution après distribution ; mais un euro reçu dans ${f(anneesProc, 0)} ans n'est pas un euro, et l'actualisation du module 4 s'applique aux procès aussi impitoyablement qu'aux obligations. C'est ce nombre qu'un tribunal appelle le préjudice.`,
          }],
          pieges: [en
            ? `Presenting the ${f(rec, 0)} cents as the loss already nets out the wait: the true comparison is ${mnt(repRecPv, '€', 0)} today against ${mnt(invest, '€', 0)} paid — the calendar is a creditor's second haircut.`
            : `Présenter les ${f(rec, 0)} cents comme la perte oublie l'attente : la vraie comparaison est ${mnt(repRecPv, '€', 0)} d'aujourd'hui contre ${mnt(invest, '€', 0)} payés — le calendrier est la seconde décote du créancier.`],
        },
        {
          intitule: en ? 'f) The Hong Kong counterfactual — and the KID' : 'f) Le contrefactuel de Hong Kong — et le KID',
          enonce: en
            ? `In Hong Kong, the regulator pushed the distributing banks to buy back the minibonds at about ${f(bb, 0)}% of the nominal. Per ${mnt(invest, '€', 0)} of holding, how much better is that outcome than the ${f(rec, 0)}% liquidation recovery, in €?`
            : `À Hong Kong, le régulateur a poussé les banques distributrices à racheter les minibonds à environ ${f(bb, 0)} % du nominal. Pour ${mnt(invest, '€', 0)} de détention, de combien cette issue bat-elle le recouvrement de liquidation à ${f(rec, 0)} %, en € ?`,
          reponse: repHk, tolerance: Math.max(10, repHk * 0.01), toleranceMode: 'absolu', unite: '€',
          etapes: [
            {
              titre: en ? 'Same product, two endings' : 'Même produit, deux fins',
              contenu: en
                ? `(${f(bb, 0)}% − ${f(rec, 0)}%) × ${mnt(invest, '€', 0)} = **${mnt(repHk, '€', 0)}**. Over 40,000 Hong Kong minibond holders — on the order of \\$2 billion — ended up recovering most of their stake because the REGULATOR forced the distributors to buy the paper back; the German Lehman-Oma, with the same product and the same bankruptcy, got the liquidation's cents. The difference was never in the payoff formula: it was in who distributes, to whom, under which rules.`
                : `(${f(bb, 0)} % − ${f(rec, 0)} %) × ${mnt(invest, '€', 0)} = **${mnt(repHk, '€', 0)}**. Plus de 40 000 porteurs de minibonds à Hong Kong — de l'ordre de 2 milliards de dollars — ont fini par récupérer l'essentiel de leur mise parce que le RÉGULATEUR a contraint les distributeurs à racheter le papier ; la Lehman-Oma allemande, même produit et même faillite, a eu les cents de la liquidation. La différence n'a jamais été dans la formule de payoff : elle était dans qui distribue, à qui, sous quelles règles.`,
            },
            {
              titre: en ? 'What 2008 wrote into European law' : 'Ce que 2008 a écrit dans le droit européen',
              contenu: en
                ? `This scandal is the birth certificate of the KID: since 2018, the PRIIPs regulation requires a key information document whose FIRST page states the issuer's identity and what happens if it defaults — and MiFID II polices the sale itself. The jury sentence: a structured product decomposition that omits the "issuer risk" line is a false decomposition; "capital guaranteed" is a property of the issuer, never of the product.`
                : `Ce scandale est l'acte de naissance du KID : depuis 2018, le règlement PRIIPs impose un document d'informations clés dont la PREMIÈRE page dit l'identité de l'émetteur et ce qui arrive s'il fait défaut — et MiFID II encadre la vente elle-même. La phrase de jury : une décomposition de produit structuré qui oublie la ligne « risque émetteur » est une décomposition fausse ; « capital garanti » est une propriété de l'émetteur, jamais du produit.`,
            },
          ],
          pieges: [en
            ? `"The Hong Kong holders were luckier" — luck had nothing to do with it: buyback was a regulatory decision about DISTRIBUTION liability, not a market outcome; the claim itself was worth the same ${f(rec, 0)} cents everywhere.`
            : `« Les porteurs de Hong Kong ont eu plus de chance » — la chance n'y est pour rien : le rachat fut une décision réglementaire sur la responsabilité de DISTRIBUTION, pas un résultat de marché ; la créance elle-même valait les mêmes ${f(rec, 0)} cents partout.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 16. m9-pb-16 — Corée 2015-2016 : la même barrière — BOSS N4         */
/* ------------------------------------------------------------------ */
const coreeHscei: ProblemeMoule = {
  id: 'm9-pb-16', moduleId: M9,
  titre: 'Corée 2015-2016 : quand tout un pays vend la même barrière',
  titreEn: 'Korea 2015-2016: when a whole country sells the same barrier',
  typeDeCas: 'concentration et effet retour',
  typeDeCasEn: 'concentration and feedback loop',
  difficulte: 4,
  scenarios: ['Le risk manager de la maison de titres de Séoul', 'Le desk de Hong Kong qui couvre les books coréens', 'Grand oral : la spirale HSCEI'],
  scenariosEn: ['The risk manager at the Seoul securities house', 'The Hong Kong desk hedging the Korean books', 'Final viva: the HSCEI spiral'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const i0 = randInt(rng, 13800, 14800);
    const kiPct = randInt(rng, 55, 60);
    const it = randInt(rng, 7600, 8300);
    const encoursG = randInt(rng, 30, 40);
    const frPct = randInt(rng, 55, 75);
    const d1 = randFloat(rng, 0.8, 1.0, 2);
    const d2 = randFloat(rng, 1.5, 1.9, 2);
    const volJourG = randInt(rng, 8, 14);
    const c0 = randFloat(rng, 6, 8, 1);
    const dV = randInt(rng, 10, 16);
    const aPts = randFloat(rng, 0.6, 0.9, 1);
    const sens = randFloat(rng, 1.1, 1.4, 2);
    const encours24 = randInt(rng, 12, 18);
    const perte24 = randInt(rng, 35, 50);

    const bLevel = (i0 * kiPct) / 100;
    const chute = (1 - it / i0) * 100;
    const knocked = (encoursG * frPct) / 100;
    const fluxG = (d2 - d1) * knocked;
    const partVol = (fluxG / volJourG) * 100;
    const remb = (it / i0) * 100;
    const perteCl = 100 - remb;
    const cNew = c0 + (aPts * dV) / sens;
    const pertes24 = (encours24 * perte24) / 100;
    const repB = r0(bLevel);
    const repPerteCl = r1(perteCl);
    const repKnock = r1(knocked);
    const repFlux = r1(fluxG);
    const repCoupon = r2(cNew);
    const rep24 = r1(pertes24);

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `South Korea, the world's largest autocall market, has concentrated its ELS (equity-linked securities) on the HSCEI, the index of large Chinese stocks listed in Hong Kong — more volatile than the domestic Kospi, hence bigger coupons; by the summer of 2015 the outstanding indexed to that single index is about \\$${f(encoursG, 0)} billion, knock-in barriers around ${pct(kiPct, 0)} of initial levels near ${f(i0, 0)} points; between the May 2015 peak and February 2016 the index falls to ${f(it, 0)}; the desks' pricers show the aggregate hedge delta of the books rising from ${f(d1, 2)}× the outstanding in calm zones to ${f(d2, 2)}× near the barriers, against a daily index-futures volume of about \\$${f(volJourG, 0)} billion; implied volatility jumps ${f(dV, 0)} points (each point of vol moves an autocall's value by about ${f(aPts, 1)} point, and one point of coupon by ${f(sens, 2)} points)`
      : `la Corée du Sud, premier marché d'autocalls au monde, a concentré ses ELS (equity-linked securities) sur le HSCEI, l'indice des grandes valeurs chinoises cotées à Hong Kong — plus volatil que le Kospi domestique, donc des coupons plus gros ; à l'été 2015, l'encours indexé sur ce seul indice est d'environ ${f(encoursG, 0)} G\\$, barrières de knock-in autour de ${pct(kiPct, 0)} de niveaux initiaux proches de ${f(i0, 0)} points ; entre le pic de mai 2015 et février 2016, l'indice tombe à ${f(it, 0)} ; les pricers des desks montrent le delta de couverture agrégé des books passant de ${f(d1, 2)} fois l'encours en zone calme à ${f(d2, 2)} fois près des barrières, face à un volume quotidien de futures sur l'indice d'environ ${f(volJourG, 0)} G\\$ ; la volatilité implicite saute de ${f(dV, 0)} points (chaque point de vol déplace la valeur d'un autocall d'environ ${f(aPts, 1)} point, et un point de coupon la déplace de ${f(sens, 2)} points)`;
    const contexte = (en
      ? [
        `Seoul, February 2016, the risk committee room. On the wall, the chart nobody wants to present: the HSCEI, nearly halved since May. Your securities house, like every one of its competitors, sold households ELS indexed on it — the same product, the same barrier zone, the whole country on one side of one trade: ${desc}. The knock-ins are falling like dominoes and the regulator is on the phone.\n\nYour committee file must hold the entire mechanism in six numbers: where the barrier sits, what a knocked-in household actually loses, how much outstanding is in the fire, the hedging flow the barrier zone forces onto a market too small for it, what the vol spike does to the next issue's coupon — and what 2024 will prove about the market's memory. The transversal lesson is chapter 7's: when a whole marketplace carries the same risk, hedging stops being a private matter.`,
        `Hong Kong, the delta-one desk that executes the Korean books' hedges. For months the orders were routine; since the autumn they all look the same — sell futures, buy volatility — and they all arrive at the same hours from different clients: ${desc}. You are watching, from the execution side, what concentration does to a mechanism you know healthy: delta-hedging.\n\nQuantify what you see: the barrier level everyone shares, the loss cascading to the Korean households as knock-ins trigger, the encours in the barrier zone, your own flow as a share of the futures market — the number that explains why "the hedging of some is the flow of others" —, the repricing of coupons on new issues, and the 2024 rerun that will prove nothing was learned. Somewhere in there is the line between hedging a book and moving a market.`,
        `The examiner writes two dates: "2015-2016. 2024. Same index, same product, same country. Walk me through the spiral, numbers in hand." The data: ${desc}.\n\nHe expects the chain of chapter 7: the concentration (one barrier zone for a whole country), the client arithmetic (a knock-in is not a haircut, it is the whole fall), the desk arithmetic (delta and gamma exploding near the barrier, forced sales into a falling market, vega demand igniting implied vol), the coupon as thermometer on the next issue — and the 2024 repeat with its regulatory ending. Bonus for naming the family: 1987 portfolio insurance, 2018 Volmageddon, 2016 HSCEI — the same accident in three costumes.`,
      ]
      : [
        `Séoul, février 2016, la salle du comité des risques. Au mur, le graphique que personne ne veut présenter : le HSCEI, presque divisé par deux depuis mai. Votre maison de titres, comme chacun de ses concurrents, a vendu aux ménages des ELS indexés dessus — le même produit, la même zone de barrières, le pays entier du même côté d'un seul trade : ${desc}. Les knock-ins tombent comme des dominos et le régulateur est au téléphone.\n\nVotre dossier de comité doit tenir tout le mécanisme en six nombres : où se trouve la barrière, ce qu'un ménage knocké perd réellement, combien d'encours est dans le feu, le flux de couverture que la zone de barrières impose à un marché trop petit pour lui, ce que le saut de vol fait au coupon de la prochaine émission — et ce que 2024 prouvera sur la mémoire du marché. La leçon transversale est celle du chapitre 7 : quand toute une place porte le même risque, la couverture cesse d'être une affaire privée.`,
        `Hong Kong, le desk delta-one qui exécute les couvertures des books coréens. Pendant des mois, les ordres furent de la routine ; depuis l'automne, ils se ressemblent tous — vendre des futures, acheter de la volatilité — et ils arrivent tous aux mêmes heures, de clients différents : ${desc}. Vous regardez, côté exécution, ce que la concentration fait à un mécanisme que vous connaissez sain : le delta-hedging.\n\nQuantifiez ce que vous voyez : le niveau de barrière que tout le monde partage, la perte qui déferle sur les ménages coréens à mesure que les knock-ins se déclenchent, l'encours en zone de barrières, votre propre flux en part du marché des futures — le nombre qui explique pourquoi « la couverture des uns est le flux des autres » —, la recotation des coupons des nouvelles émissions, et la redite de 2024 qui prouvera que rien n'a été appris. Quelque part là-dedans passe la ligne entre couvrir un book et déplacer un marché.`,
        `L'examinateur écrit deux dates : « 2015-2016. 2024. Même indice, même produit, même pays. Déroulez-moi la spirale, chiffres à l'appui. » Les données : ${desc}.\n\nIl attend la chaîne du chapitre 7 : la concentration (une seule zone de barrières pour un pays entier), l'arithmétique client (un knock-in n'est pas une décote, c'est toute la baisse), l'arithmétique desk (delta et gamma qui explosent près de la barrière, ventes forcées dans un marché qui baisse, demande de vega qui enflamme la vol implicite), le coupon-thermomètre sur l'émission suivante — et la redite de 2024 avec sa fin réglementaire. Bonus pour nommer la famille : portfolio insurance 1987, Volmageddon 2018, HSCEI 2016 — le même accident en trois costumes.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The barrier everyone shares' : 'a) La barrière que tout le monde partage',
          enonce: en
            ? `For products issued near the peak at ${f(i0, 0)} points with knock-in at ${pct(kiPct, 0)}, at what index level do the knock-ins sit, in points?`
            : `Pour les produits émis près du pic à ${f(i0, 0)} points avec knock-in à ${pct(kiPct, 0)}, à quel niveau d'indice se trouvent les knock-ins, en points ?`,
          reponse: repB, tolerance: Math.max(20, repB * 0.005), toleranceMode: 'absolu', unite: 'points',
          etapes: [{
            titre: en ? 'One zone, a whole country' : 'Une seule zone, un pays entier',
            contenu: en
              ? `${f(i0, 0)} × ${f(kiPct, 0)}% = **${f(repB, 0)} points**. In isolation, a −${f(r0(100 - kiPct), 0)}% barrier looks remote. The problem is not the level, it is the CROWD at the level: issuance clustered near the peak means tens of billions of dollars of puts share the same few hundred points of index — a concentration the client cannot see, because no term sheet mentions the other term sheets.`
              : `${f(i0, 0)} × ${f(kiPct, 0)} % = **${f(repB, 0)} points**. Isolée, une barrière à −${f(r0(100 - kiPct), 0)} % paraît lointaine. Le problème n'est pas le niveau, c'est la FOULE au niveau : des émissions groupées près du pic signifient des dizaines de milliards de dollars de puts partageant les mêmes quelques centaines de points d'indice — une concentration que le client ne peut pas voir, car aucune term sheet ne mentionne les autres term sheets.`,
          }],
        },
        {
          intitule: en ? 'b) What a knock-in costs a household' : 'b) Ce qu\'un knock-in coûte à un ménage',
          enonce: en
            ? `A product issued at ${f(i0, 0)} sees the index at ${f(it, 0)} at its final observation, barrier long since breached. What loss does the holder take per 100 of nominal, in points?`
            : `Un produit émis à ${f(i0, 0)} voit l'indice à ${f(it, 0)} à son observation finale, barrière enfoncée depuis longtemps. Quelle perte le porteur subit-il pour 100 de nominal, en points ?`,
          reponse: repPerteCl, tolerance: 0.5, toleranceMode: 'absolu', unite: 'points',
          etapes: [{
            titre: en ? 'The knock-in pays the WHOLE fall' : 'Le knock-in paie TOUTE la baisse',
            contenu: en
              ? `Degraded redemption = 100 × ${f(it, 0)} / ${f(i0, 0)} = ${f(r1(remb), 1)}, so a loss of **${f(repPerteCl, 1)} points** — the index's full ${pct(r1(chute), 1)} fall, not the slice below the barrier. "Coupon products" turned into dry equity losses overnight: that is the cliff of chapter 5 at country scale, and why the Korean regulator ended up restricting new issuance on the index.`
              : `Remboursement dégradé = 100 × ${f(it, 0)} / ${f(i0, 0)} = ${f(r1(remb), 1)}, soit une perte de **${f(repPerteCl, 1)} points** — l'intégralité des ${pct(r1(chute), 1)} de baisse de l'indice, pas la tranche sous la barrière. Des « placements à coupon » devenus des pertes actions sèches du jour au lendemain : c'est la falaise du chapitre 5 à l'échelle d'un pays, et la raison pour laquelle le régulateur coréen a fini par restreindre les nouvelles émissions sur l'indice.`,
          }],
          pieges: [en
            ? `"Barrier at ${pct(kiPct, 0)}, so the client loses what is below ${pct(kiPct, 0)}" — no: once knocked in, the put has strike 100, and the redemption tracks the index from the INITIAL level.`
            : `« Barrière à ${pct(kiPct, 0)}, donc le client perd ce qui est sous ${pct(kiPct, 0)} » — non : une fois le knock-in déclenché, le put a un strike à 100, et le remboursement suit l'indice depuis le niveau INITIAL.`],
        },
        {
          intitule: en ? 'c) The outstanding in the fire' : "c) L'encours dans le feu",
          enonce: en
            ? `Of the roughly \\$${f(encoursG, 0)} billion indexed to the HSCEI, about ${pct(frPct, 0)} has barriers in the zone the index is crossing. How many billions of dollars are knocking in, in G$?`
            : `Sur les quelque ${f(encoursG, 0)} G\\$ indexés sur le HSCEI, environ ${pct(frPct, 0)} ont leurs barrières dans la zone que l'indice traverse. Combien de milliards de dollars sont en train de knocker, en G\\$ ?`,
          reponse: repKnock, tolerance: Math.max(0.3, repKnock * 0.03), toleranceMode: 'absolu', unite: 'G$',
          etapes: [{
            titre: en ? 'The size that changes the nature of the event' : "La taille qui change la nature de l'événement",
            contenu: en
              ? `${f(encoursG, 0)} × ${f(frPct, 0)}% = **${f(repKnock, 1)} G\\$**. At this size, the knock-ins stop being a pricing parameter and become a market event: every desk long these puts sees its Greeks explode AT THE SAME LEVELS, and must trade the same underlying at the same time. Concentration is what turns a payoff clause into a macro fact — the sentence chapter 7 wants said before a jury.`
              : `${f(encoursG, 0)} × ${f(frPct, 0)} % = **${f(repKnock, 1)} G\\$**. À cette taille, les knock-ins cessent d'être un paramètre de pricing pour devenir un événement de marché : chaque desk long de ces puts voit ses grecques exploser AUX MÊMES NIVEAUX, et doit traiter le même sous-jacent au même moment. La concentration est ce qui transforme une clause de payoff en fait macroéconomique — la phrase que le chapitre 7 veut entendre devant un jury.`,
          }],
        },
        {
          intitule: en ? 'd) The forced flow near the barrier' : 'd) Le flux forcé près de la barrière',
          enonce: en
            ? `Approaching the barriers, the books' aggregate hedge delta rises from ${f(d1, 2)}× to ${f(d2, 2)}× the exposed outstanding. How many billions of dollars of index futures must the desks SELL into the falling market, in G$?`
            : `À l'approche des barrières, le delta de couverture agrégé des books passe de ${f(d1, 2)} à ${f(d2, 2)} fois l'encours exposé. Combien de milliards de dollars de futures sur indice les desks doivent-ils VENDRE dans le marché qui baisse, en G\\$ ?`,
          reponse: repFlux, tolerance: Math.max(0.3, repFlux * 0.04), toleranceMode: 'absolu', unite: 'G$',
          etapes: [
            {
              titre: en ? 'The delta of a DIP is not polite' : "Le delta d'un DIP n'est pas poli",
              contenu: en
                ? `(${f(d2, 2)} − ${f(d1, 2)}) × ${f(repKnock, 1)} G\\$ = **${f(repFlux, 1)} G\\$** of futures to sell — near a barrier, a down-and-in put's delta blows past 1 (the cliff concentrates the whole payoff on a few points). Against a daily futures volume of about ${f(volJourG, 0)} G\\$, that is **${pct(r0(partVol), 0)} of a full day's market**, all in the same direction, from desks who have no choice.`
                : `(${f(d2, 2)} − ${f(d1, 2)}) × ${f(repKnock, 1)} G\\$ = **${f(repFlux, 1)} G\\$** de futures à vendre — près d'une barrière, le delta d'un put down-and-in dépasse largement 1 (la falaise concentre tout le payoff sur quelques points). Face à un volume quotidien de futures d'environ ${f(volJourG, 0)} G\\$, c'est **${pct(r0(partVol), 0)} d'une journée entière de marché**, tout dans le même sens, venant de desks qui n'ont pas le choix.`,
            },
            {
              titre: en ? 'The loop, named' : 'La boucle, nommée',
              contenu: en
                ? `Their sales feed the very fall that drags the index towards more barriers; their simultaneous need for vega ignites the HSCEI's implied volatility. You know this structure — 1987's portfolio insurance, 2018's Volmageddon — transposed to barriers: the hedging of some is the flow of others, and a mechanical strategy grown too big stops taking prices and starts making them.`
                : `Leurs ventes nourrissent la baisse même qui tire l'indice vers d'autres barrières ; leur besoin simultané de vega enflamme la volatilité implicite du HSCEI. Vous connaissez cette structure — la portfolio insurance de 1987, le Volmageddon de 2018 — transposée aux barrières : la couverture des uns est le flux des autres, et une stratégie mécanique devenue trop grosse cesse de subir les prix et se met à les fabriquer.`,
            },
          ],
          pieges: [en
            ? `"The desks were speculating against China" reads the flow backwards: the sales were HEDGES, forced by the gamma of puts their own clients had sold them — nobody in the chain wanted the index lower.`
            : `« Les desks spéculaient contre la Chine » lit le flux à l'envers : les ventes étaient des COUVERTURES, forcées par le gamma de puts que leurs propres clients leur avaient vendus — personne dans la chaîne ne souhaitait l'indice plus bas.`],
        },
        {
          intitule: en ? 'e) The next issue reprices' : 'e) La prochaine émission se re-price',
          enonce: en
            ? `Implied volatility jumps ${f(dV, 0)} points. With each vol point moving the product's value by ${f(aPts, 1)} point and each coupon point by ${f(sens, 2)} points, what fair coupon replaces the pre-crisis ${pct(c0, 1)} on new issues, in %?`
            : `La volatilité implicite saute de ${f(dV, 0)} points. Chaque point de vol déplaçant la valeur du produit de ${f(aPts, 1)} point et chaque point de coupon de ${f(sens, 2)} points, quel coupon d'équilibre remplace les ${pct(c0, 1)} d'avant-crise sur les nouvelles émissions, en % ?`,
          reponse: repCoupon, tolerance: 0.2, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The thermometer spikes on schedule' : "Le thermomètre monte à l'heure dite",
            contenu: en
              ? `Value shortfall = ${f(aPts, 1)} × ${f(dV, 0)} = ${f(r1(aPts * dV), 1)} points; extra coupon = ${f(r1(aPts * dV), 1)} / ${f(sens, 2)} = ${f(r2((aPts * dV) / sens), 2)} points, so **${pct(repCoupon, 2)}**. The mid-crisis brochure will look magnificent — and it is exactly the moment the risk sold is at its dearest. The coupon is a market quote dressed as a promise: when it spikes, the put the client sells has just repriced, not the bank's generosity.`
              : `Valeur manquante = ${f(aPts, 1)} × ${f(dV, 0)} = ${f(r1(aPts * dV), 1)} points ; coupon supplémentaire = ${f(r1(aPts * dV), 1)} / ${f(sens, 2)} = ${f(r2((aPts * dV) / sens), 2)} points, donc **${pct(repCoupon, 2)}**. La brochure de milieu de crise sera magnifique — et c'est exactement le moment où le risque vendu est au plus cher. Le coupon est une cote de marché déguisée en promesse : quand il bondit, c'est le put que vend le client qui vient de se re-pricer, pas la générosité de la banque.`,
          }],
        },
        {
          intitule: en ? 'f) 2024: the same story, the same place' : 'f) 2024 : la même histoire, au même endroit',
          enonce: en
            ? `The rebuilt Korean outstanding reconcentrates on Hong Kong indices; between early 2021 and early 2024 they lose about half their value. On the roughly \\$${f(encours24, 0)} billion of ELS maturing in 2024, with an average realised loss of ${pct(perte24, 0)}, what do the holders lose, in G$?`
            : `L'encours coréen, reconstitué, se reconcentre sur les indices hongkongais ; entre début 2021 et début 2024, ils perdent environ la moitié de leur valeur. Sur les quelque ${f(encours24, 0)} G\\$ d'ELS arrivant à maturité en 2024, avec une perte réalisée moyenne de ${pct(perte24, 0)}, que perdent les porteurs, en G\\$ ?`,
          reponse: rep24, tolerance: Math.max(0.2, rep24 * 0.03), toleranceMode: 'absolu', unite: 'G$',
          etapes: [
            {
              titre: en ? 'Eight years for a full rerun' : 'Huit ans pour une redite intégrale',
              contenu: en
                ? `${f(encours24, 0)} × ${f(perte24, 0)}% = **${f(rep24, 1)} G\\$** of losses materialising as the 2024 maturities land — billions of dollars, on the same underlyings as 2016. The Korean regulator concluded to massive unsuitable sales and ordered the banks to compensate a large share of the losses. Two identical crises, eight years apart, on the same index: the market's memory is short; a jury's is not.`
                : `${f(encours24, 0)} × ${f(perte24, 0)} % = **${f(rep24, 1)} G\\$** de pertes matérialisées à mesure que tombent les maturités de 2024 — des milliards de dollars, sur les mêmes sous-jacents qu'en 2016. Le régulateur coréen a conclu à des ventes inadaptées massives et ordonné aux banques d'indemniser une large part des pertes. Deux crises identiques à huit ans d'écart, sur le même indice : la mémoire des marchés est courte, celle des jurys ne l'est pas.`,
            },
            {
              titre: en ? 'The family portrait, for the jury' : 'Le portrait de famille, pour le jury',
              contenu: en
                ? `1987: the insurers sell into the fall. 2016: the autocall desks sell futures and buy vol at the barrier zone. 2018: the short-vol products buy back VIX futures into the spike. 2020: the dividend books unwind together (next boss). One lesson in four costumes — concentrated risk stops being a pricing parameter and becomes a market event; the module 11 thread starts here.`
                : `1987 : les assureurs vendent dans la baisse. 2016 : les desks d'autocalls vendent des futures et achètent de la vol dans la zone de barrières. 2018 : les produits short-vol rachètent les futures VIX dans le pic. 2020 : les books de dividendes se débouclent ensemble (boss suivant). Une leçon en quatre costumes — le risque concentré cesse d'être un paramètre de pricing et devient un événement de marché ; le fil du module 11 commence ici.`,
            },
          ],
          pieges: [en
            ? `"After 2016, the products were safer" — the shell never changed: same worst-of barriers, same concentration; only the entry level and the calendar moved. A risk that pays coupons for eight years is not gone; it is queuing.`
            : `« Après 2016, les produits étaient plus sûrs » — la coquille n'a jamais changé : mêmes barrières worst-of, même concentration ; seuls le niveau d'entrée et le calendrier ont bougé. Un risque qui paie des coupons pendant huit ans n'a pas disparu ; il fait la queue.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 17. m9-pb-17 — Mars 2020 au desk parisien — BOSS N4                 */
/* ------------------------------------------------------------------ */
const marsVingtDesk: ProblemeMoule = {
  id: 'm9-pb-17', moduleId: M9,
  titre: 'Mars 2020 au desk parisien : les trois jambes de la perte',
  titreEn: 'March 2020 on the Paris desk: the three legs of the loss',
  typeDeCas: 'risques du book de structuration',
  typeDeCasEn: 'structuring book risks',
  difficulte: 4,
  scenarios: ['Le responsable du book autocalls, 20 mars au soir', 'La directrice des risques prépare le comité exécutif', "Grand oral : l'autopsie du premier trimestre 2020"],
  scenariosEn: ['The autocall book head, evening of March 20', 'The CRO preparing the executive committee', 'Final viva: the autopsy of Q1 2020'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const eDiv = randInt(rng, 350, 480);
    const chuteDiv = randInt(rng, 45, 55);
    const sensCorr = randFloat(rng, 3, 5, 1);
    const dRho = randInt(rng, 25, 35);
    const gammaM = randFloat(rng, 0.5, 0.9, 2);
    const move = randFloat(rng, 3.5, 4.5, 1);
    const nbJours = randInt(rng, 12, 18);
    const revAn = randInt(rng, 550, 750);
    const nbMaisons = randInt(rng, 4, 5);

    const perteDiv = (eDiv * chuteDiv) / 100;
    const perteCorr = sensCorr * dRho;
    const perteGamma = 0.5 * gammaM * move * move * nbJours;
    const total = perteDiv + perteCorr + perteGamma;
    const trimestres = total / (revAn / 4);
    const place = (nbMaisons * total) / 1000;
    const repDiv = r0(perteDiv);
    const repCorr = r0(perteCorr);
    const repGamma = r0(perteGamma);
    const repTotal = r0(total);
    const repTrim = r1(trimestres);
    const repPlace = r1(place);

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `the bank's structured equity book — one of the French houses that lead the world in equity structuring — carries autocalls written on PRICE indices (excluding dividends): to hedge them it holds the forward, so it is structurally LONG the dividends its clients never receive, for a present value of about ${f(eDiv, 0)} M€; it is short correlation through its worst-of books (sensitivity about ${f(sensCorr, 1)} M€ per correlation point) and its Greeks are concentrated near the barrier zones (re-hedging cost about ½ × ${f(gammaM, 2)} M€ × (daily move in %)² per day); in March 2020 the Euro Stoxx dividend futures for 2020-2021 lose about ${pct(chuteDiv, 0)}, average correlations jump ${f(dRho, 0)} points, and the index moves about ${pct(move, 1)} a day for ${f(nbJours, 0)} sessions while the barrier zones are crossed; the desk's normal year brings in about ${f(revAn, 0)} M€ of revenues`
      : `le book structuré actions de la banque — une des maisons françaises qui dominent la structuration actions mondiale — porte des autocalls écrits sur des indices de PRIX (hors dividendes) : pour les couvrir, il détient le forward, donc il est structurellement LONG des dividendes que ses clients ne touchent jamais, pour une valeur actuelle d'environ ${f(eDiv, 0)} M€ ; il est court de corrélation via ses books worst-of (sensibilité d'environ ${f(sensCorr, 1)} M€ par point de corrélation) et ses grecques sont concentrées près des zones de barrières (coût de re-couverture d'environ ½ × ${f(gammaM, 2)} M€ × (mouvement quotidien en %)² par jour) ; en mars 2020, les futures de dividendes Euro Stoxx 2020-2021 perdent environ ${pct(chuteDiv, 0)}, les corrélations moyennes sautent de ${f(dRho, 0)} points, et l'indice bouge d'environ ${pct(move, 1)} par jour pendant ${f(nbJours, 0)} séances pendant que les zones de barrières sont traversées ; une année normale du desk rapporte environ ${f(revAn, 0)} M€ de revenus`;
    const contexte = (en
      ? [
        `Friday, March 20, 2020, 9 p.m., La Défense. The trading floor is empty — half the desk hedges from their kitchens — and the week just closed is the worst the book has ever printed. Nothing in it was a directional bet: ${desc}. Every position was a hedge; every hedge just paid.\n\nBefore Monday's call with the executive committee, you want the loss CUT INTO ITS LEGS, because the committee will ask why "a hedged book" bleeds: the dividends the issuers are cancelling on regulators' orders — a leg no stress test weighted properly; the correlations converging to 1 exactly as chapter 5 warned; the Greeks near the barriers, rebilling the book every day the index swings ${pct(move, 1)}. Then the total, the quarters of revenue it erases, and the bill for the whole Paris marketplace — because your four competitors carry the same book, and that is precisely the problem.`,
        `The CRO has one slide to fill for the emergency executive committee, and its title is already chosen: "Why the hedged book is losing". The inputs: ${desc}. The CEO reads the press: he knows the American banks post record trading quarters while the French houses — world leaders in structured equity — head for near-zero equity revenues.\n\nYour slide must decompose the quarter leg by leg: the dividend leg (the risk the desk KEEPS by construction when it sells products on price indices), the correlation leg (short by construction on worst-of books), the barrier-Greeks leg (the gamma bill of module 8, concentrated on the falaise of chapter 5). Then the aggregation the board will remember: how many quarters of normal revenue evaporated, and what the marketplace loses if every big house carries the same exposures — the concentration lesson, again.`,
        `The examiner reads the quarter's headline: "Q1 2020 — French equity desks: revenues near zero or negative. Natixis will leave the most complex products by the summer. Explain to me how a HEDGED autocall book loses hundreds of millions." The calibrated data: ${desc}.\n\nHe wants the three legs separately — dividends kept, correlation short, Greeks at the barriers — each with its mechanism named (the forward of module 7, the Cholesky of chapter 5, the gamma bill of module 8), then the total against normal revenues, and the marketplace bill. And he wants the closing link: the same concentration that broke Korea in 2016 and the vol sellers in 2018 — the module 11 sentence about everyone carrying the same risk on the same day.`,
      ]
      : [
        `Vendredi 20 mars 2020, 21 h, La Défense. Le plateau est vide — la moitié du desk couvre depuis sa cuisine — et la semaine qui vient de se clore est la pire que le book ait jamais imprimée. Rien dedans n'était un pari directionnel : ${desc}. Chaque position était une couverture ; chaque couverture vient de payer.\n\nAvant le call de lundi avec le comité exécutif, vous voulez la perte DÉCOUPÉE EN SES JAMBES, parce que le comité demandera pourquoi « un book couvert » saigne : les dividendes que les émetteurs annulent sur injonction des régulateurs — une jambe qu'aucun stress test ne pondérait correctement ; les corrélations qui convergent vers 1 exactement comme le chapitre 5 l'avait écrit ; les grecques près des barrières, qui re-facturent le book chaque jour où l'indice bouge de ${pct(move, 1)}. Puis le total, les trimestres de revenus qu'il efface, et la facture de toute la place parisienne — parce que vos quatre concurrents portent le même book, et que c'est précisément le problème.`,
        `La directrice des risques a une seule slide à remplir pour le comité exécutif d'urgence, et son titre est déjà choisi : « Pourquoi le book couvert perd ». Les données : ${desc}. Le directeur général lit la presse : il sait que les banques américaines publient des trimestres de trading record pendant que les maisons françaises — leaders mondiaux du structuré actions — filent vers des revenus actions quasi nuls.\n\nVotre slide doit décomposer le trimestre jambe par jambe : la jambe dividendes (le risque que le desk GARDE par construction quand il vend des produits sur indices de prix), la jambe corrélation (courte par construction sur les books worst-of), la jambe grecques de barrière (la facture gamma du module 8, concentrée sur la falaise du chapitre 5). Puis l'agrégation que le conseil retiendra : combien de trimestres de revenus normaux se sont évaporés, et ce que la place perd si chaque grande maison porte les mêmes expositions — la leçon de concentration, encore.`,
        `L'examinateur lit le titre du trimestre : « T1 2020 — desks actions français : revenus quasi nuls ou négatifs. Natixis quittera les produits les plus complexes à l'été. Expliquez-moi comment un book d'autocalls COUVERT perd des centaines de millions. » Les données, calibrées : ${desc}.\n\nIl veut les trois jambes séparément — dividendes gardés, corrélation courte, grecques aux barrières — chacune avec son mécanisme nommé (le forward du module 7, le Cholesky du chapitre 5, la facture gamma du module 8), puis le total face aux revenus normaux, et la facture de place. Et il veut le lien de clôture : la même concentration qui a cassé la Corée en 2016 et les vendeurs de vol en 2018 — la phrase du module 11 sur tout le monde portant le même risque le même jour.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) Leg 1 — the dividends the desk kept' : 'a) Jambe 1 — les dividendes que le desk gardait',
          enonce: en
            ? `The book is long about ${f(eDiv, 0)} M€ of expected dividends, and the 2020-2021 dividend futures lose ${pct(chuteDiv, 0)}. What does this leg cost, in M€?`
            : `Le book est long d'environ ${f(eDiv, 0)} M€ de dividendes attendus, et les futures de dividendes 2020-2021 perdent ${pct(chuteDiv, 0)}. Que coûte cette jambe, en M€ ?`,
          reponse: repDiv, tolerance: Math.max(3, repDiv * 0.03), toleranceMode: 'absolu', unite: 'M€',
          etapes: [{
            titre: en ? 'The risk nobody had seen' : "Le risque que personne n'avait vu",
            contenu: en
              ? `${f(eDiv, 0)} × ${f(chuteDiv, 0)}% = **${f(repDiv, 0)} M€**. The mechanism: products are written on PRICE indices, so the hedge (holding the forward, F = (S − PV(dividends))·e^{rT}, module 7) collects dividends the product never pays out — the desk is long dividends BY CONSTRUCTION. When regulators and companies cancelled the 2020 payouts, the dividend futures halved in weeks and the leg of the forward evaporated. Order of magnitude at the real desks: about 200 M€ per big French house on cancellations alone.`
              : `${f(eDiv, 0)} × ${f(chuteDiv, 0)} % = **${f(repDiv, 0)} M€**. Le mécanisme : les produits sont écrits sur des indices de PRIX, donc la couverture (détenir le forward, F = (S − VA(dividendes))·e^{rT}, module 7) encaisse des dividendes que le produit ne reverse jamais — le desk est long dividendes PAR CONSTRUCTION. Quand régulateurs et entreprises ont annulé les distributions 2020, les futures de dividendes ont perdu la moitié en quelques semaines et la jambe du forward s'est évaporée. Ordre de grandeur aux vrais desks : environ 200 M€ par grande maison française sur les seules annulations.`,
          }],
          pieges: [en
            ? `"The clients lost the dividends" — no: the client's terms were fixed at signature. The gap between anticipated and realised dividends belongs to the DESK, hedged in forwards over years of future payouts.`
            : `« Ce sont les clients qui ont perdu les dividendes » — non : les termes du client sont figés à la signature. L'écart entre dividendes anticipés et réalisés appartient au DESK, couvert à terme sur des années de distributions futures.`],
        },
        {
          intitule: en ? 'b) Leg 2 — the correlation short' : 'b) Jambe 2 — le court de corrélation',
          enonce: en
            ? `The worst-of books lose about ${f(sensCorr, 1)} M€ per correlation point, and correlations jump ${f(dRho, 0)} points towards 1. What does this leg cost, in M€?`
            : `Les books worst-of perdent environ ${f(sensCorr, 1)} M€ par point de corrélation, et les corrélations sautent de ${f(dRho, 0)} points vers 1. Que coûte cette jambe, en M€ ?`,
          reponse: repCorr, tolerance: Math.max(3, repCorr * 0.03), toleranceMode: 'absolu', unite: 'M€',
          etapes: [{
            titre: en ? 'The dispersion premium, refunded at the worst time' : 'La prime de dispersion, remboursée au pire moment',
            contenu: en
              ? `${f(sensCorr, 1)} × ${f(dRho, 0)} = **${f(repCorr, 0)} M€**. The book is LONG the worst-of puts its clients sold, and those puts are worth more when dispersion is high (chapter 5): short correlation by construction. In the panic, everything falls together, correlations run to 1, the dispersion the book had paid for in coupons disappears — exactly when the other legs are bleeding too. Crisis correlation is not a tail case; it is the DEFINITION of a crisis.`
              : `${f(sensCorr, 1)} × ${f(dRho, 0)} = **${f(repCorr, 0)} M€**. Le book est LONG des puts worst-of que ses clients ont vendus, et ces puts valent plus quand la dispersion est forte (chapitre 5) : court de corrélation par construction. Dans la panique, tout tombe ensemble, les corrélations courent vers 1, la dispersion que le book avait payée en coupons disparaît — exactement quand les autres jambes saignent aussi. La corrélation de crise n'est pas un cas de queue ; c'est la DÉFINITION d'une crise.`,
          }],
        },
        {
          intitule: en ? 'c) Leg 3 — the Greeks at the barriers' : 'c) Jambe 3 — les grecques aux barrières',
          enonce: en
            ? `With the index crossing the barrier zones, the daily re-hedging bill is about ½ × ${f(gammaM, 2)} M€ × (${f(move, 1)})², for ${f(nbJours, 0)} sessions. What does this leg cost, in M€?`
            : `L'indice traversant les zones de barrières, la facture quotidienne de re-couverture est d'environ ½ × ${f(gammaM, 2)} M€ × (${f(move, 1)})², pendant ${f(nbJours, 0)} séances. Que coûte cette jambe, en M€ ?`,
          reponse: repGamma, tolerance: Math.max(3, repGamma * 0.04), toleranceMode: 'absolu', unite: 'M€',
          etapes: [{
            titre: en ? "Module 8's gamma bill, at the cliff" : 'La facture gamma du module 8, au bord de la falaise',
            contenu: en
              ? `½ × ${f(gammaM, 2)} × ${f(move, 1)}² × ${f(nbJours, 0)} = **${f(repGamma, 0)} M€**. Two aggravating factors versus an ordinary book: the products stop being autocalled and ALL lengthen at once (the duration that behaves like the worst of friends, chapter 4), and the Greeks are discontinuous near the barriers — delta jumps, gamma changes sign, and hedging means trading huge size exactly where the market is most nervous. The barrier shift softens the model, not the market.`
              : `½ × ${f(gammaM, 2)} × ${f(move, 1)}² × ${f(nbJours, 0)} = **${f(repGamma, 0)} M€**. Deux circonstances aggravantes par rapport à un book ordinaire : les produits cessent d'être rappelés et s'allongent TOUS en même temps (la duration qui se comporte comme le pire des amis, chapitre 4), et les grecques sont discontinues près des barrières — le delta saute, le gamma change de signe, et couvrir signifie traiter énorme exactement là où le marché est le plus nerveux. Le barrier shift adoucit le modèle, pas le marché.`,
          }],
        },
        {
          intitule: en ? 'd) The quarter, added up' : 'd) Le trimestre, additionné',
          enonce: en
            ? `Summing the three legs, what did the quarter cost the book, in M€?`
            : `En sommant les trois jambes, que coûte le trimestre au book, en M€ ?`,
          reponse: repTotal, tolerance: Math.max(5, repTotal * 0.03), toleranceMode: 'absolu', unite: 'M€',
          etapes: [{
            titre: en ? 'Three invisible risks, one direction' : 'Trois risques invisibles, une seule direction',
            contenu: en
              ? `${f(repDiv, 0)} + ${f(repCorr, 0)} + ${f(repGamma, 0)} = **${f(repTotal, 0)} M€**. Note what the three legs have in common: none is a market view, none appears on a client's term sheet, and all three lose IN THE SAME STATE OF THE WORLD — the crash. The book had sold nothing but products; what it kept was everything the products do not transfer: dividends, correlation, the Greeks at the cliff. A structured desk is a warehouse of second-order risks, and March 2020 was the inventory.`
              : `${f(repDiv, 0)} + ${f(repCorr, 0)} + ${f(repGamma, 0)} = **${f(repTotal, 0)} M€**. Voyez ce que les trois jambes ont en commun : aucune n'est une vue de marché, aucune ne figure sur la term sheet d'un client, et toutes trois perdent DANS LE MÊME ÉTAT DU MONDE — le krach. Le book n'avait rien vendu d'autre que des produits ; ce qu'il gardait, c'est tout ce que les produits ne transfèrent pas : les dividendes, la corrélation, les grecques de la falaise. Un desk de structuration est un entrepôt de risques de second ordre, et mars 2020 en fut l'inventaire.`,
          }],
          pieges: [en
            ? `"The desk was hedged, so the loss must be a hedging failure" — the hedges worked on the risk they covered (the spot); the loss came from the risks NO liquid instrument covered: cancelled dividends, crisis correlation, barrier gamma.`
            : `« Le desk était couvert, donc la perte est une défaillance de couverture » — les couvertures ont fonctionné sur le risque qu'elles couvraient (le spot) ; la perte vient des risques qu'AUCUN instrument liquide ne couvrait : dividendes annulés, corrélation de crise, gamma de barrière.`],
        },
        {
          intitule: en ? 'e) Against the revenue clock' : "e) Face à l'horloge des revenus",
          enonce: en
            ? `The desk's normal year brings about ${f(revAn, 0)} M€. How many QUARTERS of normal revenue does the loss erase?`
            : `Une année normale du desk rapporte environ ${f(revAn, 0)} M€. Combien de TRIMESTRES de revenus normaux la perte efface-t-elle ?`,
          reponse: repTrim, tolerance: 0.2, toleranceMode: 'absolu', unite: en ? 'quarters' : 'trimestres',
          etapes: [{
            titre: en ? 'The steamroller ratio, structured edition' : 'Le ratio du rouleau compresseur, édition structurée',
            contenu: en
              ? `${f(repTotal, 0)} / (${f(revAn, 0)}/4) = **${f(repTrim, 1)} quarters** gone in one — which is exactly what the real Q1 2020 looked like: equity revenues near zero or negative at the big French houses, cumulative dividend bill beyond a billion euros for the marketplace over the year, and Natixis announcing in the summer its retreat from the most complex products. Years of margins at 0.5-1% per year, repriced by one quarter of second-order risks.`
              : `${f(repTotal, 0)} / (${f(revAn, 0)}/4) = **${f(repTrim, 1)} trimestres** engloutis en un seul — exactement la physionomie du vrai T1 2020 : revenus actions quasi nuls ou négatifs dans les grandes maisons françaises, facture dividendes cumulée au-delà du milliard d'euros pour la place sur l'année, et Natixis annonçant à l'été son retrait des produits les plus complexes. Des années de marges à 0,5-1 % par an, re-pricées par un trimestre de risques de second ordre.`,
          }],
        },
        {
          intitule: en ? 'f) The marketplace bill — and the loop' : 'f) La facture de place — et la boucle',
          enonce: en
            ? `The ${f(nbMaisons, 0)} big houses of the marketplace carry books of comparable size and identical construction. What is the aggregate hit, in billions of euros?`
            : `Les ${f(nbMaisons, 0)} grandes maisons de la place portent des books de taille comparable et de construction identique. Quelle est la facture agrégée, en milliards d'euros ?`,
          reponse: repPlace, tolerance: Math.max(0.1, repPlace * 0.04), toleranceMode: 'absolu', unite: 'G€',
          etapes: [
            {
              titre: en ? 'Same book, every address' : 'Le même book, à toutes les adresses',
              contenu: en
                ? `${f(nbMaisons, 0)} × ${f(repTotal, 0)} M€ ≈ **${f(repPlace, 1)} G€** for the marketplace — and the aggregation is not just an addition: because every house is long the same dividends and short the same correlation, their unwinds hit the same instruments in the same weeks. The dividend futures halving is partly the desks' own selling; the correlation repricing is partly their own bid for it.`
                : `${f(nbMaisons, 0)} × ${f(repTotal, 0)} M€ ≈ **${f(repPlace, 1)} G€** pour la place — et l'agrégation n'est pas qu'une addition : parce que chaque maison est longue des mêmes dividendes et courte de la même corrélation, leurs débouclages frappent les mêmes instruments les mêmes semaines. Les futures de dividendes divisés par deux, c'est en partie les ventes des desks eux-mêmes ; la corrélation re-pricée, en partie leur propre demande pour elle.`,
            },
            {
              titre: en ? 'The sentence that closes the module' : 'La phrase qui referme le module',
              contenu: en
                ? `A structured product distributes risks its buyer does not see: the client sells volatility and dispersion — legitimate, remunerated, that is the coupon; the desk keeps what does not transfer. The accident comes when a whole marketplace carries the same risk at the same time: 1987, 2016, 2018, 2020. Concentrated risk stops being a pricing parameter and becomes a market event — say it before the jury, then prove it with this decomposition.`
                : `Un produit structuré répartit des risques que son acheteur ne voit pas : le client vend de la volatilité et de la dispersion — ventes légitimes, rémunérées, c'est le coupon ; le desk garde ce qui ne se transfère pas. L'accident survient quand toute une place porte le même risque au même moment : 1987, 2016, 2018, 2020. Le risque concentré cesse d'être un paramètre de pricing et devient un événement de marché — dites-le devant le jury, puis prouvez-le avec cette décomposition.`,
            },
          ],
          pieges: [en
            ? `"A dividend is a second-order detail" was precisely the pre-2020 consensus: a parameter every pricer carried and no stress test weighted — the invisible risks are the ones that gather unhedged until they all mature the same quarter.`
            : `« Un dividende est un détail de second ordre » était précisément le consensus d'avant 2020 : un paramètre que tous les pricers portaient et qu'aucun stress test ne pondérait — les risques invisibles sont ceux qui s'accumulent sans couverture jusqu'à échoir tous le même trimestre.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 18. m9-pb-18 — Le rendez-vous distributeur — BOSS N4                */
/* ------------------------------------------------------------------ */
const rendezVousDistributeur: ProblemeMoule = {
  id: 'm9-pb-18', moduleId: M9,
  titre: 'Le rendez-vous distributeur : lire la term sheet qui brille',
  titreEn: 'The distributor meeting: reading the term sheet that shines',
  typeDeCas: 'lecture de term sheet',
  typeDeCasEn: 'term sheet reading',
  difficulte: 4,
  scenarios: ["L'analyste du family office face au distributeur", 'La conseillère indépendante relit la brochure du réseau', 'Grand oral : la term sheet agressive'],
  scenariosEn: ['The family office analyst facing the distributor', 'The independent adviser rereading the network brochure', 'Final viva: the aggressive term sheet'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const c = randFloat(rng, 10, 12.5, 1);
    const pVal = randFloat(rng, 92, 94.5, 1);
    const vieEff = randFloat(rng, 2.6, 3.4, 1);
    const retro = randInt(rng, 55, 70);
    const ticket = pick(rng, [30000, 50000, 75000] as const);
    const sens = randFloat(rng, 2.2, 2.8, 2);
    const wFin = randInt(rng, 38, 50);
    const rf = randFloat(rng, 2.8, 3.4, 1);

    const marge = 100 - pVal;
    const margeFaciale = margeCommercialeAnnualisee(marge, 10);
    const margeEff = marge / vieEff;
    const retroEur = (ticket * (marge / 100) * retro) / 100;
    const cEq = c + marge / sens;
    const rembFinal = (ticket * wFin) / 100;
    const repMarge = r2(marge);
    const repFaciale = r2(margeFaciale);
    const repEff = r2(margeEff);
    const repRetro = r0(retroEur);
    const repCEq = r2(cEq);
    const repRemb = r0(rembFinal);

    const { en, f, pct, mnt } = outils(langue);
    const desc = en
      ? `a 10-year autocall on the WORST performance of three bank stocks (price underlyings, excluding dividends), annual coupon ${pct(c, 1)} with memory, autocall trigger at 100%, protection barrier at 50% of initial levels observed CONTINUOUSLY; the 10-year rate sits at ${pct(rf, 1)}; the KID discloses an issuance value of ${f(pVal, 1)} for 100 paid, and the pricer adds two numbers: an expected life of about ${f(vieEff, 1)} years, and a price sensitivity of ${f(sens, 2)} points per point of annual coupon; the distributor keeps about ${pct(retro, 0)} of the margin as retrocessions, and the proposed ticket is ${mnt(ticket, '€', 0)}`
      : `un autocall 10 ans sur la PIRE performance de trois valeurs bancaires (sous-jacents de prix, hors dividendes), coupon annuel ${pct(c, 1)} avec mémoire, rappel à 100 %, barrière de protection à 50 % des niveaux initiaux observée EN CONTINU ; le taux 10 ans est à ${pct(rf, 1)} ; le KID publie une valeur à l'émission de ${f(pVal, 1)} pour 100 payés, et le pricer ajoute deux nombres : une vie attendue d'environ ${f(vieEff, 1)} ans, et une sensibilité de prix de ${f(sens, 2)} points par point de coupon annuel ; le distributeur garde environ ${pct(retro, 0)} de la marge en rétrocessions, et le ticket proposé est de ${mnt(ticket, '€', 0)}`;
    const contexte = (en
      ? [
        `The distributor has saved the best slide for last: "${pct(c, 1)} a year, capital protected down to −50%, three household-name banks". The family you advise is tempted — the life-insurance fund pays ${pct(rf, 1)}. Your job starts where the slideshow stops: ${desc}. You have seen this scene before, in the case law: Bénéfic, sold by La Poste in 1999-2000 — 23% promised, the dot-com crash took the condition; Doubl'ô, Caisses d'Épargne 2001, a decade of litigation over misleading promotion. Words have been regulated since: "guaranteed" only when it truly is, "protected" when a barrier can break.\n\nYour note to the family must do what those retail brochures never did: locate the margin and annualise it on the REAL life of the product, put a euro figure on what the seller earns on the ticket, solve the coupon the product could pay without margin, and price the worst case in euros — then say, honestly, whether this product has a legitimate buyer, and whether the family is that buyer.`,
        `The independent adviser's oldest client brings her the network's brochure — "they say it is like a bond, but better". She reads the term sheet in the desk order, not the brochure order: issuer first, then "worst of three", then the barrier line with the word CONTINUOUS in small capitals: ${desc}. The memory of the profession sits on her shelf: Bénéfic and Doubl'ô, the fonds à formule scandals that taught French law the difference between "guaranteed" and "protected" — and taught advisers that the client reads the big number and nothing else.\n\nHer counter-analysis is your problem set: the margin the KID discloses, its honest annualisation on the expected life rather than the facial ten years, the retrocessions in euros on the proposed ticket, the fair coupon the pricer implies, and the euro arithmetic of the scenario the brochure never prints — the worst stock at ${f(wFin, 0)}% of its initial level after ten years.`,
        `The examiner hands you a real-looking term sheet and folds his arms: "You have ten minutes. Should your client sign?" The document: ${desc}. He wants the desk reading order — issuer, underlyings (worst-of: sold correlation), barriers and their observation (continuous: dearer put), the formula, the fees — and then the five numbers that decide: total margin, margin per year of EXPECTED life, the distributor's take in euros, the fair coupon, the worst-case redemption in euros.\n\nAnd he wants the history said properly: Bénéfic and Doubl'ô are why the scenario tables and the warnings exist; PRIIPs and its KID are why you know the issuance value at all; MiFID II is why the retrocessions have to be disclosed. The regulation is not decoration — it is the autopsy report of earlier versions of this exact meeting.`,
      ]
      : [
        `Le distributeur a gardé sa meilleure slide pour la fin : « ${pct(c, 1)} par an, capital protégé jusqu'à −50 %, trois banques que tout le monde connaît ». La famille que vous conseillez est tentée — le fonds euro rapporte ${pct(rf, 1)}. Votre travail commence où le diaporama s'arrête : ${desc}. Vous avez déjà vu cette scène, dans la jurisprudence : Bénéfic, placé par La Poste en 1999-2000 — 23 % promis, l'éclatement de la bulle Internet a emporté la condition ; Doubl'ô, Caisses d'Épargne 2001, une décennie de contentieux pour publicité trompeuse. Les mots sont réglementés depuis : « garanti » seulement quand ça l'est vraiment, « protégé » quand une barrière peut céder.\n\nVotre note à la famille doit faire ce que ces brochures grand public n'ont jamais fait : localiser la marge et l'annualiser sur la VRAIE vie du produit, mettre un chiffre en euros sur ce que le vendeur gagne sur le ticket, résoudre le coupon que le produit pourrait payer sans marge, et pricer le pire cas en euros — puis dire, honnêtement, si ce produit a un acheteur légitime, et si la famille est cet acheteur.`,
        `La plus ancienne cliente de la conseillère indépendante lui apporte la brochure du réseau — « ils disent que c'est comme une obligation, mais en mieux ». Elle lit la term sheet dans l'ordre du desk, pas dans l'ordre de la brochure : l'émetteur d'abord, puis « la moins bonne des trois », puis la ligne de barrière avec le mot CONTINUE en petites capitales : ${desc}. La mémoire du métier est sur son étagère : Bénéfic et Doubl'ô, les scandales des fonds à formule qui ont appris au droit français la différence entre « garanti » et « protégé » — et appris aux conseillers que le client lit le gros chiffre et rien d'autre.\n\nSa contre-analyse est votre énoncé : la marge que le KID publie, son annualisation honnête sur la vie attendue plutôt que sur les dix ans faciaux, les rétrocessions en euros sur le ticket proposé, le coupon d'équilibre que le pricer implique, et l'arithmétique en euros du scénario que la brochure n'imprime jamais — la pire valeur à ${f(wFin, 0)} % de son niveau initial après dix ans.`,
        `L'examinateur vous tend une term sheet plus vraie que nature et croise les bras : « Vous avez dix minutes. Votre client doit-il signer ? » Le document : ${desc}. Il veut l'ordre de lecture du desk — émetteur, sous-jacents (worst-of : corrélation vendue), barrières et leur observation (continue : put plus cher), la formule, les frais — puis les cinq nombres qui décident : marge totale, marge par année de vie ATTENDUE, la part du distributeur en euros, le coupon d'équilibre, le remboursement du pire cas en euros.\n\nEt il veut l'histoire dite proprement : Bénéfic et Doubl'ô sont la raison d'être des tableaux de scénarios et des mises en garde ; PRIIPs et son KID, la raison pour laquelle vous connaissez la valeur à l'émission ; MiFID II, la raison pour laquelle les rétrocessions doivent être publiées. La régulation n'est pas une décoration — c'est le rapport d'autopsie des versions précédentes de ce rendez-vous précis.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The margin, out of the KID' : 'a) La marge, sortie du KID',
          enonce: en
            ? `The KID discloses an issuance value of ${f(pVal, 1)} for 100 paid. What is the total margin, in % of the nominal?`
            : `Le KID publie une valeur à l'émission de ${f(pVal, 1)} pour 100 payés. Quelle est la marge totale, en % du nominal ?`,
          reponse: repMarge, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Public since 2018 — read, never shown' : 'Publique depuis 2018 — lue par personne, montrée par tous',
            contenu: en
              ? `100 − ${f(pVal, 1)} = **${pct(repMarge, 2)}**, structuring and distribution together, locked at issuance whatever the banks' stocks do. Nothing illegal, nothing hidden: PRIIPs has required this number in the KID since 2018. The question is never "is there a margin?" — it is whether ${pct(repMarge, 1)} is a fair price for what follows.`
              : `100 − ${f(pVal, 1)} = **${pct(repMarge, 2)}**, structuration et distribution confondues, verrouillés à l'émission quoi que fassent les valeurs bancaires. Rien d'illégal, rien de caché : PRIIPs impose ce nombre dans le KID depuis 2018. La question n'est jamais « y a-t-il une marge ? » — c'est de savoir si ${pct(repMarge, 1)} est un prix juste pour ce qui suit.`,
          }],
        },
        {
          intitule: en ? 'b) The flattering annualisation' : "b) L'annualisation flatteuse",
          enonce: en
            ? `Spread over the 10 facial years (the desks' display convention), what is the margin per year, in %?`
            : `Étalée sur les 10 ans faciaux (la convention d'affichage des desks), que vaut la marge par an, en % ?`,
          reponse: repFaciale, tolerance: 0.03, toleranceMode: 'absolu', unite: '%/an',
          etapes: [{
            titre: en ? 'Divided by a duration that will not happen' : 'Divisée par une durée qui n\'aura pas lieu',
            contenu: en
              ? `${f(repMarge, 2)} / 10 = **${pct(repFaciale, 2)} per year** — comfortably inside the market's 0.5 to 1% standards. This is the number the distributor will quote if challenged, and arithmetically it is true. It has one flaw: the 10-year denominator belongs to the BROCHURE, not to the product — an autocall with a 100% trigger almost never lives ten years.`
              : `${f(repMarge, 2)} / 10 = **${pct(repFaciale, 2)} par an** — confortablement dans les standards du marché, 0,5 à 1 %. C'est le nombre que le distributeur citera si on le pousse, et arithmétiquement il est vrai. Il a un seul défaut : le dénominateur de 10 ans appartient à la BROCHURE, pas au produit — un autocall à rappel 100 % ne vit presque jamais dix ans.`,
          }],
        },
        {
          intitule: en ? 'c) The honest annualisation' : "c) L'annualisation honnête",
          enonce: en
            ? `The pricer expects a life of about ${f(vieEff, 1)} years. On the EFFECTIVE life, what is the margin per year, in %?`
            : `Le pricer attend une vie d'environ ${f(vieEff, 1)} ans. Sur la vie EFFECTIVE, que vaut la marge par an, en % ?`,
          reponse: repEff, tolerance: 0.05, toleranceMode: 'absolu', unite: '%/an',
          etapes: [{
            titre: en ? 'The same margin, on the real clock' : 'La même marge, à la vraie horloge',
            contenu: en
              ? `${f(repMarge, 2)} / ${f(vieEff, 1)} = **${pct(repEff, 2)} per year** — ${f(r1(margeEff / margeFaciale), 1)}× the displayed figure. Most trajectories autocall within two or three years (the recall machine of chapter 4), so the margin is earned over ${f(vieEff, 1)} years, not ten. And recall breeds re-subscription: the client comes back, a NEW margin is taken — the effective annual cost of staying invested through this channel compounds well beyond ${pct(repFaciale, 2)}.`
              : `${f(repMarge, 2)} / ${f(vieEff, 1)} = **${pct(repEff, 2)} par an** — ${f(r1(margeEff / margeFaciale), 1)} fois le chiffre affiché. La plupart des trajectoires se font rappeler en deux ou trois ans (la machine à rappel du chapitre 4), donc la marge se gagne sur ${f(vieEff, 1)} ans, pas dix. Et le rappel nourrit la re-souscription : le client revient, une NOUVELLE marge est prélevée — le coût annuel effectif de rester investi par ce canal se compose bien au-delà de ${pct(repFaciale, 2)}.`,
          }],
          pieges: [en
            ? `Judging the margin on the facial maturity is the exact trick of the display convention: the SAME number is honest on a product that lives its full term, and flattering on one built to be recalled.`
            : `Juger la marge sur la maturité faciale est exactement le tour de la convention d'affichage : le MÊME nombre est honnête sur un produit qui vit son terme, et flatteur sur un produit construit pour être rappelé.`],
        },
        {
          intitule: en ? "d) The distributor's take, in euros" : 'd) La part du distributeur, en euros',
          enonce: en
            ? `The distributor keeps about ${pct(retro, 0)} of the margin as retrocessions. On the ${mnt(ticket, '€', 0)} ticket, how much does the network earn at issuance, in €?`
            : `Le distributeur garde environ ${pct(retro, 0)} de la marge en rétrocessions. Sur le ticket de ${mnt(ticket, '€', 0)}, combien le réseau gagne-t-il à l'émission, en € ?`,
          reponse: repRetro, tolerance: Math.max(10, repRetro * 0.02), toleranceMode: 'absolu', unite: '€',
          etapes: [{
            titre: en ? 'The incentive, made visible' : "L'incitation, rendue visible",
            contenu: en
              ? `${mnt(ticket, '€', 0)} × ${f(repMarge, 2)}% × ${f(retro, 0)}% = **${mnt(repRetro, '€', 0)}**, earned on day one, whatever happens to the client afterwards. This is the conflict of interest in its exact form: not a bet against the client — the bank is hedged — but a remuneration proportional to VOLUMES SOLD, which rewards the shiniest formula, not the best-suited one. MiFID II requires these retrocessions to be disclosed; it does not make them small.`
              : `${mnt(ticket, '€', 0)} × ${f(repMarge, 2)} % × ${f(retro, 0)} % = **${mnt(repRetro, '€', 0)}**, gagnés au jour 1, quoi qu'il arrive au client ensuite. C'est le conflit d'intérêts dans sa forme exacte : pas un pari contre le client — la banque est couverte — mais une rémunération proportionnelle aux VOLUMES VENDUS, qui récompense la formule la plus brillante, pas la mieux adaptée. MiFID II impose de publier ces rétrocessions ; il ne les rend pas petites.`,
          }],
        },
        {
          intitule: en ? 'e) The coupon without the margin' : 'e) Le coupon sans la marge',
          enonce: en
            ? `With ${f(sens, 2)} points of price per point of annual coupon, what coupon would bring the value to exactly 100, in %?`
            : `Avec ${f(sens, 2)} points de prix par point de coupon annuel, quel coupon amènerait la valeur à exactement 100, en % ?`,
          reponse: repCEq, tolerance: 0.15, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'What the risk actually pays' : 'Ce que le risque paie réellement',
            contenu: en
              ? `${f(c, 1)} + ${f(repMarge, 2)} / ${f(sens, 2)} = **${pct(repCEq, 2)}**. Now run the chapter 3 grid on it: the 10-year rate is ${pct(rf, 1)}; every point above it is the rent of risks sold — a worst-of on three banks (sold correlation), a 50% barrier observed CONTINUOUSLY (the dearest observation clause, chapter 5), price underlyings (dividends surrendered). The coupon is huge BECAUSE the basket of risks sold is huge; the margin merely trims it from ${pct(repCEq, 1)} to ${pct(c, 1)}.`
              : `${f(c, 1)} + ${f(repMarge, 2)} / ${f(sens, 2)} = **${pct(repCEq, 2)}**. Passez-y maintenant la grille du chapitre 3 : le taux 10 ans est à ${pct(rf, 1)} ; chaque point au-dessus est le loyer de risques vendus — un worst-of sur trois banques (corrélation vendue), une barrière 50 % observée EN CONTINU (la clause d'observation la plus chère, chapitre 5), des sous-jacents de prix (dividendes abandonnés). Le coupon est énorme PARCE QUE le panier de risques vendus est énorme ; la marge ne fait que le rogner de ${pct(repCEq, 1)} à ${pct(c, 1)}.`,
          }],
          pieges: [en
            ? `"${pct(c, 1)} against a ${pct(rf, 1)} rate proves the product is generous" — it proves the opposite: the gap is the market price of the risks sold, and the desk would happily display more coupon if the client sold more risk.`
            : `« ${pct(c, 1)} contre un taux à ${pct(rf, 1)}, la preuve que le produit est généreux » — c'est la preuve du contraire : l'écart est le prix de marché des risques vendus, et le desk afficherait volontiers plus de coupon si le client vendait plus de risque.`],
        },
        {
          intitule: en ? 'f) The scenario the brochure never prints' : 'f) Le scénario que la brochure n\'imprime jamais',
          enonce: en
            ? `Never recalled; sometime in the ten years the worst stock touched 50%; at maturity it stands at ${f(wFin, 0)}% of its initial level. What does the client get back on the ${mnt(ticket, '€', 0)} ticket, in €?`
            : `Jamais rappelé ; à un moment des dix ans, la pire valeur a touché 50 % ; à maturité, elle vaut ${f(wFin, 0)} % de son niveau initial. Que récupère le client sur le ticket de ${mnt(ticket, '€', 0)}, en € ?`,
          reponse: repRemb, tolerance: Math.max(10, repRemb * 0.01), toleranceMode: 'absolu', unite: '€',
          etapes: [
            {
              titre: en ? 'The cliff, in euros this time' : 'La falaise, en euros cette fois',
              contenu: en
                ? `Barrier touched (continuous observation forgives nothing) and worst under 100 at maturity: degraded redemption = ${mnt(ticket, '€', 0)} × ${f(wFin, 0)}% = **${mnt(repRemb, '€', 0)}** — a ${mnt(r0(ticket - rembFinal), '€', 0)} loss, no coupon ever paid, ten years immobilised. One stock of the three suffices: that is the worst-of, and the "protected to −50%" line was a knock-in switch, not an airbag.`
                : `Barrière touchée (l'observation continue ne pardonne rien) et pire valeur sous 100 à maturité : remboursement dégradé = ${mnt(ticket, '€', 0)} × ${f(wFin, 0)} % = **${mnt(repRemb, '€', 0)}** — une perte de ${mnt(r0(ticket - rembFinal), '€', 0)}, aucun coupon jamais versé, dix ans immobilisés. Une seule valeur sur les trois suffit : c'est le worst-of, et la ligne « protégé jusqu'à −50 % » était un interrupteur de knock-in, pas un airbag.`,
            },
            {
              titre: en ? 'The honest opinion, in three sentences' : "L'avis honnête, en trois phrases",
              contenu: en
                ? `The product is not a scam: it is a correctly priced sale of options with a disclosed margin. It has a legitimate buyer — someone who would knowingly sell a continuous-barrier worst-of put on three banks, accepts equity risk on the downside and a capped coupon upside, and needs neither liquidity nor dividends for up to ten years. If the client cannot rephrase the product that way, the answer is no — that gap between what it is and what the buyer believes it is, is exactly where Bénéfic and Doubl'ô were born.`
                : `Le produit n'est pas une arnaque : c'est une vente d'options correctement pricée, à marge publiée. Il a un acheteur légitime — quelqu'un qui vendrait sciemment un put worst-of à barrière continue sur trois banques, accepte le risque actions à la baisse et un gain plafonné au coupon, et n'a besoin ni de liquidité ni de dividendes pendant dix ans au plus. Si le client ne sait pas reformuler le produit ainsi, la réponse est non — cet écart entre ce qu'il est et ce que l'acheteur croit qu'il est, c'est exactement là que Bénéfic et Doubl'ô sont nés.`,
            },
          ],
          pieges: [en
            ? `"Protected down to −50%, so at ${f(wFin, 0)}% I lose ${f(r0(50 - wFin), 0)} points" — the barrier is a switch: once touched, the client bears the WHOLE fall from 100, coupon-less, exactly like the Korean households of the previous boss.`
            : `« Protégé jusqu'à −50 %, donc à ${f(wFin, 0)} % je perds ${f(r0(50 - wFin), 0)} points » — la barrière est un interrupteur : une fois touchée, le client porte TOUTE la baisse depuis 100, sans coupon, exactement comme les ménages coréens du boss précédent.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 19. m9-pb-19 — Le structureur sur mesure — BOSS N4                  */
/* ------------------------------------------------------------------ */
const structureurSurMesure: ProblemeMoule = {
  id: 'm9-pb-19', moduleId: M9,
  titre: 'Le structureur sur mesure : résoudre le produit, pas le vendre',
  titreEn: 'The bespoke structurer: solve the product, do not sell it',
  typeDeCas: 'structuration sur mesure',
  typeDeCasEn: 'bespoke structuring',
  difficulte: 4,
  scenarios: ['Le family office et son cahier des charges', 'La caisse de retraite qui veut sa formule exacte', 'Grand oral : construire, brique par brique'],
  scenariosEn: ['The family office and its specification sheet', 'The pension fund demanding its exact formula', 'Final viva: building, brick by brick'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const rTx = randFloat(rng, 2.8, 3.6, 1);
    const vol = randInt(rng, 17, 22);
    const marge = randFloat(rng, 1, 1.6, 1);
    const T = 6;
    const capPct = randInt(rng, 140, 160);
    const bonusTarget = randInt(rng, 6, 12);

    const zc = prixZeroCoupon(rTx, T);
    const budget = budgetOptions(zc, marge);
    const call = blackScholesCall(100, 100, rTx, vol, T);
    const pNat = participationCapitalGaranti(budget, call);
    const pT = Math.ceil(pNat * 100) + bonusTarget;
    const g = ((100 - marge - (pT / 100) * call) / zc) * 100;
    const callCap = blackScholesCall(100, capPct, rTx, vol, T);
    const spread = call - callCap;
    const pCap = budget / spread;
    const emission = 100 - marge;
    const repZc = r2(zc);
    const repBudget = r2(budget);
    const repPNat = r1(pNat * 100);
    const repG = r1(g);
    const repPCap = r1(pCap * 100);
    const repEmission = r2(emission);

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `a 6-year note on the index, with a specification sheet instead of a brochure: the client demands a participation of AT LEAST ${f(pT, 0)}% in the rise, and wants to know exactly what it costs; market data: rate ${pct(rTx, 1)}, volatility ${pct(vol, 0)}, total margin ${pct(marge, 1)}; your pricer gives the 6-year ATM call at ${pct(r2(call), 2)} of the nominal and the ${f(capPct, 0)}%-strike call at ${pct(r2(callCap), 2)} (Black-Scholes)`
      : `une note 6 ans sur l'indice, avec un cahier des charges au lieu d'une brochure : le client exige une participation d'AU MOINS ${f(pT, 0)} % à la hausse, et veut savoir exactement ce que cela coûte ; données de marché : taux ${pct(rTx, 1)}, volatilité ${pct(vol, 0)}, marge totale ${pct(marge, 1)} ; votre pricer donne le call ATM 6 ans à ${pct(r2(call), 2)} du nominal et le call de strike ${f(capPct, 0)} % à ${pct(r2(callCap), 2)} (Black-Scholes)`;
    const contexte = (en
      ? [
        `The family office does not buy off the shelf. Their letter states the terms like an engineering order: ${desc}. "And no catalogue answers," the principal adds; "if the numbers do not work, tell us WHICH parameter has to give — the guarantee, the cap, or our participation target."\n\nThis is the structurer's real métier, the one chapter 2 described and this module industrialised: not selling a formula but SOLVING one. You will build the note from its three bricks — zero-coupon, margin, options —, discover that the specification is infeasible at 100% guarantee, and then do what a desk does: hold the target fixed and solve the parameter that must move, twice (lower the guarantee; cap the upside). Then the paperwork that regulation demands: the issuance value the KID will print, and the sentence about retrocessions MiFID II forces into the appendix.`,
        `The pension fund's investment committee has voted the specification and will not revote it: ${desc}. Your sales colleague wants to answer "impossible" and move on; your job is to answer like a structurer — with the two exact products that MEET the specification, each with its price tag on a different line.\n\nWalk the committee through the factory: the zero-coupon that guarantees, the budget the margin leaves, the participation that budget honestly buys — short of the target. Then the two feasible variants: guarantee lowered to the solved level g, or upside capped at ${f(capPct, 0)}% with the target exceeded. Close with the KID line — the issuance value, published since PRIIPs 2018 — because a pension fund's auditors read that page first.`,
        `The examiner reverses the usual exercise: "I am the client. I want ${f(pT, 0)}% of the rise over 6 years. Build it, price it, and tell me what I must give up. You have the pricer outputs." The data: ${desc}.\n\nHe expects the full chain, no shortcuts: zero-coupon, budget, the natural participation and WHY it falls short (the division, not a policy), the solved guarantee level that funds the target, the capped alternative and its exact ceiling, and the issuance value for the KID. The trap he is watching for: candidates who "negotiate" with adjectives. A structurer negotiates with solved parameters — every concession has a price, and the price comes out of the same three bricks.`,
      ]
      : [
        `Le family office n'achète pas sur étagère. Sa lettre pose les termes comme un ordre d'ingénierie : ${desc}. « Et pas de réponse catalogue, ajoute le principal ; si les nombres ne passent pas, dites-nous QUEL paramètre doit céder — la garantie, le plafond, ou notre cible de participation. »\n\nC'est le vrai métier du structureur, celui que le chapitre 2 décrivait et que ce module a industrialisé : non pas vendre une formule mais en RÉSOUDRE une. Vous allez construire la note depuis ses trois briques — zéro-coupon, marge, options —, découvrir que le cahier des charges est infaisable à garantie 100 %, puis faire ce que fait un desk : tenir la cible fixe et résoudre le paramètre qui doit bouger, deux fois (baisser la garantie ; plafonner la hausse). Puis la paperasse que la régulation exige : la valeur à l'émission que le KID imprimera, et la phrase sur les rétrocessions que MiFID II force en annexe.`,
        `Le comité d'investissement de la caisse de retraite a voté le cahier des charges et ne le revotera pas : ${desc}. Votre collègue commercial veut répondre « impossible » et passer au suivant ; votre travail est de répondre en structureur — avec les deux produits exacts qui RESPECTENT le cahier des charges, chacun avec son étiquette de prix sur une ligne différente.\n\nFaites visiter l'usine au comité : le zéro-coupon qui garantit, le budget que laisse la marge, la participation que ce budget achète honnêtement — sous la cible. Puis les deux variantes faisables : garantie abaissée au niveau résolu g, ou hausse plafonnée à ${f(capPct, 0)} % avec la cible dépassée. Terminez par la ligne du KID — la valeur à l'émission, publiée depuis PRIIPs 2018 — parce que les auditeurs d'une caisse de retraite lisent cette page en premier.`,
        `L'examinateur renverse l'exercice habituel : « Je suis le client. Je veux ${f(pT, 0)} % de la hausse sur 6 ans. Construisez, pricez, et dites-moi ce que je dois abandonner. Vous avez les sorties du pricer. » Les données : ${desc}.\n\nIl attend la chaîne complète, sans raccourci : zéro-coupon, budget, la participation naturelle et POURQUOI elle est sous la cible (une division, pas une politique), le niveau de garantie résolu qui finance la cible, l'alternative plafonnée et son plafond exact, et la valeur à l'émission pour le KID. Le piège qu'il guette : les candidats qui « négocient » avec des adjectifs. Un structureur négocie avec des paramètres résolus — chaque concession a un prix, et le prix sort des trois mêmes briques.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The brick that guarantees, 6 years out' : 'a) La brique qui garantit, à 6 ans',
          enonce: en
            ? `What does the zero-coupon repaying 100 at 6 years cost today, in % of the nominal?`
            : `Que coûte aujourd'hui le zéro-coupon qui redonnera 100 à 6 ans, en % du nominal ?`,
          reponse: repZc, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The yield curve does the guaranteeing' : "C'est la courbe des taux qui garantit",
            contenu: en
              ? `ZC = 100·e^{−${f(rTx, 1)}% × 6} = **${pct(repZc, 2)}**. Six years instead of five buys a cheaper zero-coupon — time is the structurer's only free ally: every extra year of maturity releases budget. That is why bespoke guaranteed notes stretch long, and why the zero-rate decade killed them: at r = 0, the ZC costs 100 and the factory has nothing left to build with.`
              : `ZC = 100·e^{−${f(rTx, 1)} % × 6} = **${pct(repZc, 2)}**. Six ans au lieu de cinq achètent un zéro-coupon moins cher — le temps est le seul allié gratuit du structureur : chaque année de maturité en plus libère du budget. Voilà pourquoi les notes garanties sur mesure s'étirent en longueur, et pourquoi la décennie de taux nuls les a tuées : à r = 0, le ZC coûte 100 et l'usine n'a plus rien pour construire.`,
          }],
        },
        {
          intitule: en ? 'b) The budget the margin leaves' : 'b) Le budget que laisse la marge',
          enonce: en
            ? `After the zero-coupon and the ${pct(marge, 1)} margin, what budget remains for options, in % of the nominal?`
            : `Après le zéro-coupon et la marge de ${pct(marge, 1)}, quel budget reste-t-il pour les options, en % du nominal ?`,
          reponse: repBudget, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The constraint everything obeys' : 'La contrainte à laquelle tout obéit',
            contenu: en
              ? `Budget = 100 − ${f(repZc, 2)} − ${f(marge, 1)} = **${pct(repBudget, 2)}**. Every promise of the specification sheet must be bought with this. Note the client-facing honesty of the bespoke market: a specification is negotiated against a budget line, where a retail brochure hides the budget and shows only the promise.`
              : `Budget = 100 − ${f(repZc, 2)} − ${f(marge, 1)} = **${pct(repBudget, 2)}**. Toute promesse du cahier des charges devra s'acheter avec ça. Notez l'honnêteté du marché sur mesure : un cahier des charges se négocie contre une ligne de budget, là où une brochure grand public cache le budget et ne montre que la promesse.`,
          }],
        },
        {
          intitule: en ? 'c) The natural participation — and the shortfall' : 'c) La participation naturelle — et le manque',
          enonce: en
            ? `With the ATM call at ${pct(r2(call), 2)}, what participation does the budget buy at 100% guarantee, in %?`
            : `Avec le call ATM à ${pct(r2(call), 2)}, quelle participation le budget achète-t-il à garantie 100 %, en % ?`,
          reponse: repPNat, tolerance: 0.5, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'A division, not a policy' : 'Une division, pas une politique',
            contenu: en
              ? `p = ${f(repBudget, 2)} / ${f(r2(call), 2)} = **${pct(repPNat, 1)}** — short of the ${f(pT, 0)}% demanded. The shortfall is not negotiable by charm: the specification asks for ${f(pT, 0)} calls per 100 of rise and the budget pays for ${f(repPNat, 1)}. From here, exactly two parameters can give: the guarantee level, or the upside kept. Both get SOLVED, not discussed.`
              : `p = ${f(repBudget, 2)} / ${f(r2(call), 2)} = **${pct(repPNat, 1)}** — sous les ${f(pT, 0)} % exigés. Le manque ne se négocie pas au charme : le cahier des charges demande ${f(pT, 0)} calls pour 100 de hausse et le budget en paie ${f(repPNat, 1)}. À partir d'ici, exactement deux paramètres peuvent céder : le niveau de garantie, ou la hausse conservée. Les deux se RÉSOLVENT, ils ne se discutent pas.`,
          }],
          pieges: [en
            ? `Promising the target and "adjusting later" is how mis-sold products are born: the participation is the RESULT of a division — if the inputs do not move, the result cannot.`
            : `Promettre la cible et « ajuster ensuite » est la naissance des produits mal vendus : la participation est le RÉSULTAT d'une division — si les entrées ne bougent pas, le résultat non plus.`],
        },
        {
          intitule: en ? 'd) Variant 1: solve the guarantee' : 'd) Variante 1 : résoudre la garantie',
          enonce: en
            ? `Hold the participation at ${f(pT, 0)}% with the plain ATM call, and let the guarantee level g give way. Solve g (in % of capital) such that g × ZC + ${f(pT, 0)}% × call + margin = 100.`
            : `Tenez la participation à ${f(pT, 0)} % avec le call ATM simple, et laissez céder le niveau de garantie g. Résolvez g (en % du capital) tel que g × ZC + ${f(pT, 0)} % × call + marge = 100.`,
          reponse: repG, tolerance: 0.3, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The missing parameter, isolated' : 'Le paramètre manquant, isolé',
            contenu: en
              ? `g = (100 − ${f(marge, 1)} − ${f(r2((pT / 100) * call), 2)}) / ${f(repZc, 2)} = **${pct(repG, 1)}**. The client gets the full ${f(pT, 0)}% — and the word on page one changes: the capital is no longer *guaranteed*, it is *protected at ${f(r1(repG), 1)}%*. In the worst case he bears ${f(r1(100 - repG), 1)} points. A bespoke desk prices the concession to one decimal; the client decides with open eyes — this transparency is exactly what the litigation of chapter 1 was about not having.`
              : `g = (100 − ${f(marge, 1)} − ${f(r2((pT / 100) * call), 2)}) / ${f(repZc, 2)} = **${pct(repG, 1)}**. Le client obtient ses ${f(pT, 0)} % pleins — et le mot de la première page change : le capital n'est plus *garanti*, il est *protégé à ${f(r1(repG), 1)} %*. Dans le pire cas, il porte ${f(r1(100 - repG), 1)} points. Un desk sur mesure price la concession à la décimale ; le client décide en connaissance de cause — cette transparence est exactement ce dont les contentieux du chapitre 1 manquaient.`,
          }],
        },
        {
          intitule: en ? 'e) Variant 2: cap the upside' : 'e) Variante 2 : plafonner la hausse',
          enonce: en
            ? `Back to 100% guarantee, but the ATM call is replaced by a 100/${f(capPct, 0)} call spread (sell the ${f(capPct, 0)}% call at ${pct(r2(callCap), 2)}). What participation, capped at +${f(capPct - 100, 0)}%, does the budget now buy, in %?`
            : `Retour à la garantie 100 %, mais le call ATM est remplacé par un call spread 100/${f(capPct, 0)} (vente du call ${f(capPct, 0)} % à ${pct(r2(callCap), 2)}). Quelle participation, plafonnée à +${f(capPct - 100, 0)} %, le budget achète-t-il désormais, en % ?`,
          reponse: repPCap, tolerance: Math.max(1, repPCap * 0.01), toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The client finances himself' : 'Le client se finance lui-même',
            contenu: en
              ? `Spread = ${f(r2(call), 2)} − ${f(r2(callCap), 2)} = ${f(r2(spread), 2)}; p = ${f(repBudget, 2)} / ${f(r2(spread), 2)} = **${pct(repPCap, 1)}**${pCap * 100 >= pT ? ` — target met and exceeded` : ``}, capped at +${f(capPct - 100, 0)}%. Nothing was given: the client SOLD the rise beyond ${f(capPct, 0)} to pay for the extra participation below it. Maximum payoff: ${f(r1(100 + (pCap * (capPct - 100))), 1)}. Two feasible products now sit on the table, each giving up a different scenario — the specification's author must finally say which scenario he cares about.`
              : `Spread = ${f(r2(call), 2)} − ${f(r2(callCap), 2)} = ${f(r2(spread), 2)} ; p = ${f(repBudget, 2)} / ${f(r2(spread), 2)} = **${pct(repPCap, 1)}**${pCap * 100 >= pT ? ` — cible atteinte et dépassée` : ``}, plafonnée à +${f(capPct - 100, 0)} %. Rien n'a été offert : le client a VENDU la hausse au-delà de ${f(capPct, 0)} pour payer le supplément de participation en dessous. Payoff maximal : ${f(r1(100 + (pCap * (capPct - 100))), 1)}. Deux produits faisables sont maintenant sur la table, chacun abandonnant un scénario différent — l'auteur du cahier des charges doit enfin dire quel scénario compte pour lui.`,
          }],
          pieges: [en
            ? `Comparing the two variants on their participation figures alone compares price tags, not products: one gives up the floor (${pct(repG, 1)} guarantee), the other the ceiling (+${f(capPct - 100, 0)}%) — only scenario arithmetic separates them.`
            : `Comparer les deux variantes sur leurs seuls chiffres de participation compare des étiquettes, pas des produits : l'une abandonne le plancher (garantie ${pct(repG, 1)}), l'autre le plafond (+${f(capPct - 100, 0)} %) — seule l'arithmétique de scénarios les départage.`],
        },
        {
          intitule: en ? 'f) The page the auditors read first' : 'f) La page que les auditeurs lisent en premier',
          enonce: en
            ? `Whatever variant is chosen, what issuance value will the KID publish for 100 paid, in % of the nominal?`
            : `Quelle que soit la variante retenue, quelle valeur à l'émission le KID publiera-t-il pour 100 payés, en % du nominal ?`,
          reponse: repEmission, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? '100 = value + margin, printed and public' : '100 = valeur + marge, imprimé et public',
              contenu: en
                ? `Issuance value = 100 − ${f(marge, 1)} = **${pct(repEmission, 2)}** — the margin annualises to ${pct(r2(margeCommercialeAnnualisee(marge, T)), 2)} per year over the 6 years, inside the 0.5-1% standards. Since PRIIPs (2018) this number is in the KID; since MiFID II the retrocessions, if any, must be disclosed to the client. For an institutional buyer these pages are the FIRST filter: a specification met with an undisclosed margin is a specification not met.`
                : `Valeur à l'émission = 100 − ${f(marge, 1)} = **${pct(repEmission, 2)}** — la marge s'annualise à ${pct(r2(margeCommercialeAnnualisee(marge, T)), 2)} par an sur les 6 ans, dans les standards de 0,5 à 1 %. Depuis PRIIPs (2018), ce nombre figure au KID ; depuis MiFID II, les rétrocessions éventuelles doivent être publiées au client. Pour un acheteur institutionnel, ces pages sont le PREMIER filtre : un cahier des charges respecté avec une marge non publiée est un cahier des charges non respecté.`,
            },
            {
              titre: en ? 'What the viva keeps from the métier' : "Ce que l'oral retient du métier",
              contenu: en
                ? `The structurer's craft in one breath: three bricks (a zero-coupon that guarantees, options that promise, a margin that constrains), one equation (everything sums to 100), and a discipline — when the client's demand does not fit, SOLVE the parameter that must give and price the concession. The seller shows the formula's best face; the structurer shows its budget line. Between the two sits everything this module — and its case law — has been about.`
                : `Le métier du structureur en une respiration : trois briques (un zéro-coupon qui garantit, des options qui promettent, une marge qui contraint), une équation (tout se somme à 100), et une discipline — quand la demande du client ne passe pas, RÉSOUDRE le paramètre qui doit céder et pricer la concession. Le vendeur montre le meilleur profil de la formule ; le structureur montre sa ligne de budget. Entre les deux tient tout ce que ce module — et sa jurisprudence — a raconté.`,
            },
          ],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 20. m9-pb-20 — La revente avant maturité — BOSS N4                  */
/* ------------------------------------------------------------------ */
const reventeAvantMaturite: ProblemeMoule = {
  id: 'm9-pb-20', moduleId: M9,
  titre: 'La revente avant maturité : le prix de la sortie',
  titreEn: 'Selling before maturity: the price of the exit',
  typeDeCas: 'valorisation en cours de vie',
  typeDeCasEn: 'mark-to-market during life',
  difficulte: 4,
  scenarios: ['Le conseiller face au client qui veut sortir', 'Le desk secondaire cote un rachat', 'Grand oral : pourquoi 100 ne vaut plus 100'],
  scenariosEn: ['The adviser facing the client who wants out', 'The secondary desk quoting a buyback', 'Final viva: why 100 no longer equals 100'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const rTx = randFloat(rng, 2.8, 3.4, 1);
    const c = randFloat(rng, 6.5, 7.5, 1);
    const sNow = randInt(rng, 70, 76);
    const vSec = randFloat(rng, 80.5, 84.5, 1);
    const dip0 = randFloat(rng, 4.2, 5.4, 1);
    const dipNow = randFloat(rng, 16.5, 19.5, 1);
    const fourch = randFloat(rng, 1, 1.6, 1);
    const invest = pick(rng, [20000, 50000] as const);
    const s5 = randInt(rng, 50, 58);

    const zc3 = prixZeroCoupon(rTx, 3);
    const ecartDip = dipNow - dip0;
    const poche = vSec - zc3 + dipNow;
    const prixSortie = vSec - fourch;
    const cashSortie = (invest * prixSortie) / 100;
    const rendRappel = (Math.sqrt((100 + 4 * c) / prixSortie) - 1) * 100;
    const ecartPire = (invest * (prixSortie - s5)) / 100;
    const repZc3 = r2(zc3);
    const repEcartDip = r1(ecartDip);
    const repPoche = r1(poche);
    const repCash = r0(cashSortie);
    const repRend = r1(rendRappel);
    const repEcartPire = r0(ecartPire);

    const { en, f, pct, mnt } = outils(langue);
    const desc = en
      ? `a 5-year Athena bought at issuance two years ago (${mnt(invest, '€', 0)} invested): annual observations, autocall trigger at 100%, memory coupon ${pct(c, 1)}, protection barrier 60% at maturity only; two observations have passed without recall and the index now stands at ${f(sNow, 0)}% of its initial level, volatility well above issuance levels; the desk's pricer values the note at ${f(vSec, 1)} per 100 — decomposition on screen: 3-year zero-coupon at rate ${pct(rTx, 1)}, the down-and-in put SOLD by the client revalued at ${f(dipNow, 1)} (it was worth ${f(dip0, 1)} at issuance), and a coupon-and-recall pocket; the desk buys back at the pricer value minus a ${f(fourch, 1)}-point spread`
      : `un Athéna 5 ans acheté à l'émission il y a deux ans (${mnt(invest, '€', 0)} investis) : observations annuelles, rappel à 100 %, coupon mémoire ${pct(c, 1)}, barrière de protection 60 % à maturité seulement ; deux observations sont passées sans rappel et l'indice vaut aujourd'hui ${f(sNow, 0)} % de son niveau initial, la volatilité bien au-dessus des niveaux d'émission ; le pricer du desk valorise la note ${f(vSec, 1)} pour 100 — décomposition à l'écran : zéro-coupon 3 ans au taux ${pct(rTx, 1)}, le put down-and-in VENDU par le client réévalué à ${f(dipNow, 1)} (il valait ${f(dip0, 1)} à l'émission), et une poche coupons-rappel ; le desk rachète à la valeur du pricer moins une fourchette de ${f(fourch, 1)} point`;
    const contexte = (en
      ? [
        `The client has stopped opening the envelopes, but this morning he called: he needs the money — a divorce, he says, and he wants to talk elsewhere. On your screen: ${desc}. He remembers one sentence from the sale: "your capital is protected down to −40%". He is about to learn that the sentence has a DATE in it — maturity — and that today has another price.\n\nBefore he arrives, do the desk's work on your own screen: the bond floor a 3-year-from-maturity note cannot exceed, the put he sold that has fattened against him, the coupon pocket the pricer's decomposition implies, the cash the exit actually leaves, the annualised return the "wait for the recall" gamble would need — and the euro distance between exiting today and the scenario where waiting goes wrong. He will decide; your job is that he decides on numbers.`,
        `On the secondary desk, the morning file is a buyback request: ${desc}. Retail structured notes have no organised secondary market — the issuer is the only bid, and your quote will be the client's whole liquidity. The compliance rule is strict: the quote must be DECOMPOSABLE, line by line, if the client's adviser asks.\n\nSo decompose it: the zero-coupon leg at three years from maturity; the short put leg, revalued by the fall AND the volatility (vega, module 8 — the client is short it without knowing); the coupon-recall pocket that balances the pricer's value; then the exit price after the spread, in euros. Finish with the two futures the adviser will have to present: the recall-in-year-4 scenario annualised from today's exit price, and the euro gap between exiting now and reaching maturity under the barrier — because a quote is honest only next to its alternatives.`,
        `The examiner reads the client's letter out loud: "I paid 100 two years ago; your pricer says ${f(vSec, 1)}; the index only lost ${f(r0(100 - sNow), 0)}%. Where is the rest?" The data: ${desc}.\n\nHe wants the mark-to-market decomposed like a desk: the bond floor (a 3-year discount, module 4), the put sold by the client that tripled (spot closer to the barrier, volatility up — delta and vega both against him), the coupon pocket deflated by the vanished recall probability, the exit cash after the issuer's spread — and then the two-sided verdict: the annualised return the recall gamble PRICES IN, against the euro cost if the gamble fails. The sentence he is fishing for: the duration that lengthens exactly when the client wants out is not bad luck; it is the product's construction.`,
      ]
      : [
        `Le client n'ouvrait plus les enveloppes, mais ce matin il a appelé : il a besoin de l'argent — un divorce, dit-il, et il veut en parler ailleurs. Sur votre écran : ${desc}. Il se souvient d'une phrase de la vente : « votre capital est protégé jusqu'à −40 % ». Il va apprendre que cette phrase contient une DATE — la maturité — et qu'aujourd'hui a un autre prix.\n\nAvant qu'il arrive, faites le travail du desk sur votre propre écran : le plancher obligataire qu'une note à 3 ans de l'échéance ne peut pas dépasser, le put qu'il a vendu et qui a grossi contre lui, la poche coupons que la décomposition du pricer implique, le cash que la sortie laisse réellement, le rendement annualisé qu'exigerait le pari « attendre le rappel » — et la distance en euros entre sortir aujourd'hui et le scénario où l'attente tourne mal. Il décidera ; votre travail est qu'il décide sur des nombres.`,
        `Au desk secondaire, le dossier du matin est une demande de rachat : ${desc}. Les notes structurées grand public n'ont pas de marché secondaire organisé — l'émetteur est la seule contrepartie à l'achat, et votre cote sera toute la liquidité du client. La règle de conformité est stricte : la cote doit être DÉCOMPOSABLE, ligne à ligne, si le conseiller du client la demande.\n\nDécomposez donc : la jambe zéro-coupon à trois ans de l'échéance ; la jambe put vendu, réévaluée par la baisse ET par la volatilité (vega, module 8 — le client en est vendeur sans le savoir) ; la poche coupons-rappel qui équilibre la valeur du pricer ; puis le prix de sortie après fourchette, en euros. Terminez par les deux futurs que le conseiller devra présenter : le scénario rappel-en-année-4 annualisé depuis le prix de sortie d'aujourd'hui, et l'écart en euros entre sortir maintenant et atteindre la maturité sous la barrière — parce qu'une cote n'est honnête qu'à côté de ses alternatives.`,
        `L'examinateur lit la lettre du client à voix haute : « J'ai payé 100 il y a deux ans ; votre pricer dit ${f(vSec, 1)} ; l'indice n'a perdu que ${f(r0(100 - sNow), 0)} %. Où est le reste ? » Les données : ${desc}.\n\nIl veut le mark-to-market décomposé comme un desk : le plancher obligataire (une actualisation à 3 ans, module 4), le put vendu par le client qui a triplé (spot plus près de la barrière, volatilité en hausse — delta et vega tous deux contre lui), la poche coupons dégonflée par la probabilité de rappel évaporée, le cash de sortie après la fourchette de l'émetteur — puis le verdict à deux faces : le rendement annualisé que le pari du rappel PRICE, contre le coût en euros si le pari échoue. La phrase qu'il pêche : la duration qui s'allonge exactement quand le client veut sortir n'est pas une malchance ; c'est la construction du produit.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The bond floor' : 'a) Le plancher obligataire',
          enonce: en
            ? `Three years from maturity at rate ${pct(rTx, 1)}, what is the 100-at-maturity zero-coupon leg worth today, in % of the nominal?`
            : `À trois ans de l'échéance au taux ${pct(rTx, 1)}, que vaut aujourd'hui la jambe zéro-coupon qui rendra 100 à maturité, en % du nominal ?`,
          reponse: repZc3, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Even perfection would not trade at 100' : 'Même la perfection ne coterait pas 100',
            contenu: en
              ? `ZC = 100·e^{−${f(rTx, 1)}% × 3} = **${pct(repZc3, 2)}**. First lesson of the meeting: even if every protection were intact, "100 at maturity" is worth ${f(repZc3, 2)} TODAY — module 4's discounting, which the brochure's "protected capital" sentence silently postpones to the last day. Everything below ${f(repZc3, 2)} in the quote is the price of the options; everything below that is the spread.`
              : `ZC = 100·e^{−${f(rTx, 1)} % × 3} = **${pct(repZc3, 2)}**. Première leçon du rendez-vous : même si toutes les protections étaient intactes, « 100 à maturité » vaut ${f(repZc3, 2)} AUJOURD'HUI — l'actualisation du module 4, que la phrase « capital protégé » de la brochure repousse silencieusement au dernier jour. Tout ce qui manque sous ${f(repZc3, 2)} dans la cote est le prix des options ; tout ce qui manque en dessous encore, la fourchette.`,
          }],
        },
        {
          intitule: en ? 'b) The put that grew against him' : 'b) Le put qui a grossi contre lui',
          enonce: en
            ? `The down-and-in put the client sold was worth ${f(dip0, 1)} at issuance; the pricer revalues it at ${f(dipNow, 1)}. By how many points has this short position moved against him?`
            : `Le put down-and-in vendu par le client valait ${f(dip0, 1)} à l'émission ; le pricer le réévalue ${f(dipNow, 1)}. De combien de points cette position vendeuse a-t-elle bougé contre lui ?`,
          reponse: repEcartDip, tolerance: 0.2, toleranceMode: 'absolu', unite: 'points',
          etapes: [{
            titre: en ? 'Delta and vega, both on the wrong side' : 'Delta et vega, tous deux du mauvais côté',
            contenu: en
              ? `${f(dipNow, 1)} − ${f(dip0, 1)} = **${f(repEcartDip, 1)} points** against the client. Two engines, both from module 8: the spot fell to ${f(sNow, 0)} — the barrier at 60 is no longer an abstraction, and the put's delta works against the seller; and volatility jumped — the put's vega inflates it further. The client sold this option for a coupon; its revaluation is not a fee, it is the market price of the risk he carries showing itself mid-life.`
              : `${f(dipNow, 1)} − ${f(dip0, 1)} = **${f(repEcartDip, 1)} points** contre le client. Deux moteurs, tous deux du module 8 : le spot est tombé à ${f(sNow, 0)} — la barrière à 60 n'est plus une abstraction, et le delta du put joue contre le vendeur ; et la volatilité a sauté — le vega du put le gonfle encore. Le client a vendu cette option contre un coupon ; sa réévaluation n'est pas un frais, c'est le prix de marché du risque qu'il porte, rendu visible en cours de vie.`,
          }],
          pieges: [en
            ? `"The barrier has not been touched, so nothing has happened" confuses the PAYOFF (intact so far) with the VALUE: an option prices its future, and the future got worse — a mark-to-market does not wait for the accident.`
            : `« La barrière n'a pas été touchée, donc rien ne s'est passé » confond le PAYOFF (intact pour l'instant) et la VALEUR : une option price son avenir, et l'avenir s'est assombri — un mark-to-market n'attend pas l'accident.`],
        },
        {
          intitule: en ? 'c) The coupon pocket, reconstructed' : 'c) La poche coupons, reconstituée',
          enonce: en
            ? `The pricer's value is ${f(vSec, 1)}. Consistently with its decomposition (value = ZC − put + coupon-recall pocket), what is the coupon-recall pocket worth, in points?`
            : `La valeur du pricer est ${f(vSec, 1)}. En cohérence avec sa décomposition (valeur = ZC − put + poche coupons-rappel), que vaut la poche coupons-rappel, en points ?`,
          reponse: repPoche, tolerance: 0.3, toleranceMode: 'absolu', unite: 'points',
          etapes: [{
            titre: en ? 'The recall probability has left the building' : 'La probabilité de rappel a quitté la salle',
            contenu: en
              ? `Pocket = ${f(vSec, 1)} − ${f(repZc3, 2)} + ${f(dipNow, 1)} = **${f(repPoche, 1)} points**, for a product that once promised ${pct(c, 1)} a year with memory. With the index at ${f(sNow, 0)}, recalling requires a +${f(r0((100 / sNow - 1) * 100), 0)}% rally to an observation date: the digitals that pay the coupons are far out of the money, and the memory effect stores promises the paths no longer visit. The three lines say the same thing in three languages: the product lengthened exactly when its holder wants it short.`
              : `Poche = ${f(vSec, 1)} − ${f(repZc3, 2)} + ${f(dipNow, 1)} = **${f(repPoche, 1)} points**, pour un produit qui promettait ${pct(c, 1)} par an avec mémoire. Avec l'indice à ${f(sNow, 0)}, un rappel exige un rallye de +${f(r0((100 / sNow - 1) * 100), 0)} % jusqu'à une date d'observation : les digitales qui paient les coupons sont loin de la monnaie, et l'effet mémoire stocke des promesses que les trajectoires ne visitent plus. Les trois lignes disent la même chose en trois langues : le produit s'est allongé exactement quand son porteur le veut court.`,
          }],
        },
        {
          intitule: en ? 'd) The exit, in euros' : 'd) La sortie, en euros',
          enonce: en
            ? `The desk buys back at the pricer value minus ${f(fourch, 1)} point. On the ${mnt(invest, '€', 0)} invested, what cash does the exit leave, in €?`
            : `Le desk rachète à la valeur du pricer moins ${f(fourch, 1)} point. Sur les ${mnt(invest, '€', 0)} investis, quel cash la sortie laisse-t-elle, en € ?`,
          reponse: repCash, tolerance: Math.max(10, repCash * 0.01), toleranceMode: 'absolu', unite: '€',
          etapes: [{
            titre: en ? 'The only bid in the room' : 'La seule contrepartie de la salle',
            contenu: en
              ? `(${f(vSec, 1)} − ${f(fourch, 1)}) % × ${mnt(invest, '€', 0)} = **${mnt(repCash, '€', 0)}**. The spread is not a punishment: the issuer is the ONLY buyer of a bespoke note, and it charges for reopening its hedge (module 1's market-making logic, without competitors). But it means the "protected" product costs ${f(r1(100 - prixSortie), 1)} points to leave mid-storm — liquidity is the risk no coupon line ever priced for the client.`
              : `(${f(vSec, 1)} − ${f(fourch, 1)}) % × ${mnt(invest, '€', 0)} = **${mnt(repCash, '€', 0)}**. La fourchette n'est pas une punition : l'émetteur est le SEUL acheteur d'une note sur mesure, et il facture la réouverture de sa couverture (la logique de market making du module 1, sans concurrents). Mais cela signifie que le produit « protégé » coûte ${f(r1(100 - prixSortie), 1)} points à quitter en pleine tempête — la liquidité est le risque qu'aucune ligne de coupon n'a jamais pricé pour le client.`,
          }],
        },
        {
          intitule: en ? 'e) What staying would have to earn' : 'e) Ce que rester devrait rapporter',
          enonce: en
            ? `If the index gets back to 100% at the year-4 observation, the note pays 100 + 4 × ${f(c, 1)} then. From today's exit price of ${f(r1(prixSortie), 1)}, what annualised return over 2 years does that recall scenario represent, in % per year?`
            : `Si l'indice repasse 100 % à l'observation de l'an 4, la note paie alors 100 + 4 × ${f(c, 1)}. Depuis le prix de sortie d'aujourd'hui de ${f(r1(prixSortie), 1)}, quel rendement annualisé sur 2 ans ce scénario de rappel représente-t-il, en % par an ?`,
          reponse: repRend, tolerance: 0.5, toleranceMode: 'absolu', unite: '%/an',
          etapes: [{
            titre: en ? 'A big number, and its condition' : 'Un gros chiffre, et sa condition',
            contenu: en
              ? `(${f(r0(100 + 4 * c), 0)} / ${f(r1(prixSortie), 1)})^{1/2} − 1 = **${pct(repRend, 1)} per year**. Read it like a desk: a return that size is a THERMOMETER, not a gift — it prices the condition attached, a +${f(r0((100 / sNow - 1) * 100), 0)}% index rally within two years. The mark-to-market is not pessimistic; it is the probability-weighted average of this scenario and all the others. Whoever stays is not "waiting for recovery"; he is buying this note at ${f(r1(prixSortie), 1)} — which may be reasonable, IF it is said that way.`
              : `(${f(r0(100 + 4 * c), 0)} / ${f(r1(prixSortie), 1)})^{1/2} − 1 = **${pct(repRend, 1)} par an**. Lisez-le comme un desk : un rendement de cette taille est un THERMOMÈTRE, pas un cadeau — il price la condition attachée, un rallye de l'indice de +${f(r0((100 / sNow - 1) * 100), 0)} % en deux ans. Le mark-to-market n'est pas pessimiste ; il est la moyenne pondérée par les probabilités de ce scénario et de tous les autres. Qui reste n'est pas « en train d'attendre la remontée » ; il achète cette note à ${f(r1(prixSortie), 1)} — ce qui peut être raisonnable, SI c'est dit ainsi.`,
          }],
          pieges: [en
            ? `"It suffices to wait for it to come back" is the physical-settlement illusion of chapter 3 in temporal form: waiting is not neutral — it is a leveraged position on a conditional rally, financed by giving up ${mnt(repCash, '€', 0)} of certain cash today.`
            : `« Il suffit d'attendre que ça remonte » est l'illusion de la remise en titres du chapitre 3, version temporelle : attendre n'est pas neutre — c'est une position à levier sur un rallye conditionnel, financée en renonçant à ${mnt(repCash, '€', 0)} de cash certain aujourd'hui.`],
        },
        {
          intitule: en ? 'f) The other branch, in euros' : "f) L'autre branche, en euros",
          enonce: en
            ? `Never recalled, and at maturity the index finishes at ${f(s5, 0)}% — under the barrier: the note repays ${f(s5, 0)}. By how many euros does exiting TODAY beat that scenario, on the ${mnt(invest, '€', 0)} invested (ignoring interim interest)?`
            : `Jamais rappelé, et à maturité l'indice finit à ${f(s5, 0)} % — sous la barrière : la note rembourse ${f(s5, 0)}. De combien d'euros sortir AUJOURD'HUI bat-il ce scénario, sur les ${mnt(invest, '€', 0)} investis (hors intérêts intermédiaires) ?`,
          reponse: repEcartPire, tolerance: Math.max(10, repEcartPire * 0.02), toleranceMode: 'absolu', unite: '€',
          etapes: [
            {
              titre: en ? 'The cliff is still three years wide' : 'La falaise a encore trois ans devant elle',
              contenu: en
                ? `(${f(r1(prixSortie), 1)} − ${f(s5, 0)}) % × ${mnt(invest, '€', 0)} = **${mnt(repEcartPire, '€', 0)}** in favour of exiting, in the branch where the market keeps falling: under the barrier, the "protection" clause pays the index — the down-and-in put exercises against the client, chapter 4's fourth destiny. The decision table now has its two branches in euros: the recall gamble at ${pct(repRend, 1)} a year against this. Neither is "right"; what was WRONG was deciding without them.`
                : `(${f(r1(prixSortie), 1)} − ${f(s5, 0)}) % × ${mnt(invest, '€', 0)} = **${mnt(repEcartPire, '€', 0)}** en faveur de la sortie, dans la branche où le marché continue de baisser : sous la barrière, la clause de « protection » paie l'indice — le put down-and-in s'exerce contre le client, quatrième destin du chapitre 4. La table de décision a maintenant ses deux branches en euros : le pari du rappel à ${pct(repRend, 1)} par an contre ceci. Aucune n'est « la bonne » ; ce qui était FAUX, c'était de décider sans elles.`,
            },
            {
              titre: en ? 'The closing sentence of the module' : 'La phrase qui referme le module',
              contenu: en
                ? `The autocall's duration behaves like the worst of friends: short when markets rise (recalled, reinvest higher, new margin), long when they fall (stuck, coupon-less, put growing). A structured note is a promise ABOUT maturity, priced continuously in a market where the issuer is the only bid: whoever may need the money before the last day is holding the wrong product — the sentence to say BEFORE the signature, and the one this whole module has been building towards.`
                : `La duration de l'autocall se comporte comme le pire des amis : courte quand les marchés montent (rappelé, se replacer plus haut, nouvelle marge), longue quand ils baissent (collé, sans coupon, put qui grossit). Une note structurée est une promesse SUR la maturité, pricée en continu dans un marché où l'émetteur est la seule contrepartie : qui peut avoir besoin de l'argent avant le dernier jour détient le mauvais produit — la phrase à dire AVANT la signature, et celle vers laquelle tout ce module a construit.`,
            },
          ],
          pieges: [en
            ? `Comparing the exit to the 100 paid ("I lose ${f(r1(100 - prixSortie), 1)} points") anchors on a sunk cost: the decision today is between ${f(r1(prixSortie), 1)} certain and the note's DISTRIBUTION of futures — the 100 belongs to the past, not to the choice.`
            : `Comparer la sortie aux 100 payés (« je perds ${f(r1(100 - prixSortie), 1)} points ») s'ancre sur un coût irrécupérable : la décision d'aujourd'hui oppose ${f(r1(prixSortie), 1)} certains à la DISTRIBUTION de futurs de la note — les 100 appartiennent au passé, pas au choix.`],
        },
      ],
    };
  },
};

export const problemesLot2: ProblemeMoule[] = [
  capitalGarantiNegociation, sensibilitesCouponAutocall,
  frequenceObservationDip, worstOfCorrelation,
  lehmanGarantie, coreeHscei, marsVingtDesk, rendezVousDistributeur,
  structureurSurMesure, reventeAvantMaturite,
];
