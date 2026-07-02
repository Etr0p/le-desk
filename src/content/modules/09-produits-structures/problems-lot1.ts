/**
 * Moules de problèmes multi-étapes du module Produits structurés & pricing
 * de structuration — LOT 1 : les 10 moules N1/N2 (m9-pb-01 à m9-pb-10).
 * 4 N1 (premier capital garanti de bout en bout, brochure d'un reverse
 * convertible, zéro-coupon & funding, déroulé d'un autocall) et 6 N2 (le
 * structureur résout la participation, reverse convertible à barrière,
 * reconstitution d'un term sheet, du prix au coupon d'équilibre, worst-of à
 * maturité, le book du structureur après la vente).
 * Chaque moule : 3 scénarios FR + EN (habillages ET bornes de tirage
 * différents), sous-questions chaînées (la sortie de a) nourrit b), c)…),
 * corrigés calculés via calculs.ts (m9 + m8) — jamais de texte figé.
 * INVARIANT BILINGUE : tous les tirages aléatoires ont lieu AVANT toute branche
 * de langue — même seed + même scénario ⇒ mêmes nombres en français et en anglais.
 * PERFORMANCE : AUCUN appel Monte-Carlo dans generate() — les prix simulés
 * nécessaires (DIP, autocall, worst-of) sont DONNÉS dans les énoncés comme
 * sorties de pricer, dans des fourchettes vérifiées hors-ligne contre les
 * fonctions MC de calculs.ts (graine 42, n = 100 000) : DIP 1 an quotidien
 * r5/σ20 : B70 ≈ 1,45, B80 ≈ 3,81 ; r3/σ25 : B60 ≈ 1,48, B70 ≈ 4,21 ; r4/σ30 :
 * B60 ≈ 3,23, B70 ≈ 6,48 ; Athéna 5 ans (rappel 100, protection 60) r3/σ20 :
 * c7 ≈ 98,1, c10 ≈ 101,6 ; r5/σ20 : c8 ≈ 97,5, c11 ≈ 101,0 ; r4/σ22 : c8 ≈ 97,1,
 * c11 ≈ 100,6 ; call worst-of 1 an jumeaux σ20/r5 : ρ0,8 ≈ 7,26, ρ0,3 ≈ 4,48 ;
 * DIP worst-of 3 ans B60 mensuel r3/σ22-25 : ρ0,5 ≈ 10,7, ρ0,9 ≈ 8,6.
 * Conventions (en-tête de calculs.ts) : taux et volatilités en %, durées en
 * années, actualisation CONTINUE e^{−rT} ; nominal 100, prix en % du nominal ;
 * participation en RATIO ; corrélation ρ en points de pourcentage dans les
 * énoncés ; barrières d'autocall et de worst-of en % du niveau initial.
 */
import { formatNombreLangue } from '../../../engine/answers';
import { mulberry32, pick, randFloat, randInt } from '../../../engine/rng';
import type { Langue, ProblemGenerator } from '../../../engine/types';
import { blackScholesCall, blackScholesPut } from '../08-options-volatilite/calculs';
import {
  budgetOptions, couponReverseConvertible, margeCommercialeAnnualisee,
  participationCapitalGaranti, payoffAutocall, payoffWorstOf, prixZeroCoupon,
} from './calculs';

/** Un « moule » de problème est un ProblemGenerator de l'engine (alias local). */
export type ProblemeMoule = ProblemGenerator;

const M9 = '09-produits-structures';
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
/* 1. m9-pb-01 — Mon premier capital garanti, de bout en bout — N1     */
/* ------------------------------------------------------------------ */
const premierCapitalGaranti: ProblemeMoule = {
  id: 'm9-pb-01', moduleId: M9,
  titre: 'Mon premier capital garanti : du zéro-coupon au remboursement',
  titreEn: 'A first capital-guaranteed note: from zero-coupon to redemption',
  typeDeCas: 'capital garanti',
  typeDeCasEn: 'capital-guaranteed note',
  difficulte: 1,
  scenarios: ['Le stagiaire du desk de structuration et sa première term sheet (Euro Stoxx 50)', 'La banquière privée qui doit expliquer la formule à sa cliente (CAC 40)', 'Le candidat du jeu de bourse qui reconstruit la brochure (S&P 500)'],
  scenariosEn: ['The structuring-desk intern and his first term sheet (Euro Stoxx 50)', 'The private banker walking her client through the formula (CAC 40)', 'The trading-game candidate rebuilding the brochure (S&P 500)'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : taux, maturité, marge, volatilité, chocs de scénario.
    const cfg = ([
      { rMin: 4.2, rMax: 5.4, T: 5, mMin: 0.8, mMax: 1.2, vMin: 18, vMax: 22, upMin: 25, upMax: 60, dnMin: 15, dnMax: 40 },
      { rMin: 2.6, rMax: 3.4, T: 8, mMin: 1.0, mMax: 2.0, vMin: 16, vMax: 20, upMin: 30, upMax: 80, dnMin: 10, dnMax: 35 },
      { rMin: 3.6, rMax: 4.6, T: 4, mMin: 0.5, mMax: 1.0, vMin: 20, vMax: 26, upMin: 20, upMax: 50, dnMin: 20, dnMax: 45 },
    ] as const)[sIdx];
    const r = randFloat(rng, cfg.rMin, cfg.rMax, 1);
    const marge = randFloat(rng, cfg.mMin, cfg.mMax, 1);
    const vol = randInt(rng, cfg.vMin, cfg.vMax);
    const perfUp = randInt(rng, cfg.upMin, cfg.upMax);
    const perfDn = randInt(rng, cfg.dnMin, cfg.dnMax);
    const T = cfg.T;
    const zc = r2(prixZeroCoupon(r, T));
    const budget = r2(budgetOptions(zc, marge));
    const callAtm = r2(blackScholesCall(100, 100, r, vol, T));
    const partPct = r2(100 * participationCapitalGaranti(budget, callAtm));
    const rembUp = r2(100 + (partPct / 100) * perfUp);

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `${f(T, 0)}-year note, risk-free rate ${pct(r, 1)}, total margin ${pct(marge, 1)} of par, index implied volatility ${pct(vol, 0)}; the options desk quotes the ${f(T, 0)}-year ATM call at ${pct(callAtm, 2)} of par`
      : `note à ${f(T, 0)} ans, taux sans risque ${pct(r, 1)}, marge totale ${pct(marge, 1)} du nominal, volatilité implicite de l'indice ${pct(vol, 0)} ; le desk options cote le call ATM ${f(T, 0)} ans à ${pct(callAtm, 2)} du nominal`;
    const contexte = (en
      ? [
        `First week on the structuring desk, and the intern must rebuild the flagship product line by line — "your capital back at maturity, plus a share of the Euro Stoxx 50 upside": ${desc}. The senior structurer wants the four numbers of the assembly: the zero-coupon, the option budget, the participation, and what the client actually receives if the index gains ${pct(perfUp, 0)} — or loses ${pct(perfDn, 0)}.`,
        `A private-banking client refuses any capital loss but wants "some of the CAC 40": ${desc}. Before the meeting, the banker rebuilds the guaranteed note her bank issues, brick by brick, to answer the only questions that matter — what guarantees the capital, what is left to buy upside, what fraction of the rise is hers, and what lands on the statement if the index gains ${pct(perfUp, 0)} or drops ${pct(perfDn, 0)}.`,
        `Trading-game final: each candidate receives a real brochure — "capital guaranteed at maturity + participation in the S&P 500" — and must prove the numbers add up: ${desc}. The jury grid: price of the guarantee, option budget, participation, and the redemption in the two scenarios (+${f(perfUp, 0)}% / −${f(perfDn, 0)}%).`,
      ]
      : [
        `Première semaine au desk de structuration, et le stagiaire doit reconstruire le produit vitrine ligne à ligne — « votre capital à l'échéance, plus une fraction de la hausse de l'Euro Stoxx 50 » : ${desc}. Le structureur senior veut les quatre chiffres du montage : le zéro-coupon, le budget d'options, la participation, et ce que le client touche vraiment si l'indice gagne ${pct(perfUp, 0)} — ou perd ${pct(perfDn, 0)}.`,
        `Une cliente de banque privée refuse toute perte en capital mais veut « un peu de CAC 40 » : ${desc}. Avant le rendez-vous, la banquière remonte brique par brique la note garantie que sa banque émet, pour répondre aux seules questions qui comptent — qu'est-ce qui garantit le capital, que reste-t-il pour acheter de la hausse, quelle fraction de la hausse revient à la cliente, et qu'affiche le relevé si l'indice gagne ${pct(perfUp, 0)} ou perd ${pct(perfDn, 0)}.`,
        `Finale du jeu de bourse : chaque candidat reçoit une vraie brochure — « capital garanti à l'échéance + participation au S&P 500 » — et doit prouver que les chiffres s'additionnent : ${desc}. La grille du jury : prix de la garantie, budget d'options, participation, et le remboursement dans les deux scénarios (+${f(perfUp, 0)} % / −${f(perfDn, 0)} %).`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The brick that guarantees: the zero-coupon' : 'a) La brique qui garantit : le zéro-coupon',
          enonce: en
            ? `At ${pct(r, 1)} over ${f(T, 0)} years (continuous compounding), what does the zero-coupon that will repay 100 at maturity cost today, in % of par?`
            : `À ${pct(r, 1)} sur ${f(T, 0)} ans (actualisation continue), combien coûte aujourd'hui le zéro-coupon qui remboursera 100 à l'échéance, en % du nominal ?`,
          reponse: zc, tolerance: 0.005, unite: en ? '% of par' : '% du nominal',
          etapes: [{
            titre: en ? 'ZC = 100·e^{−rT}: a rates trade, not magic' : 'ZC = 100·e^{−rT} : un placement de taux, pas de la magie',
            contenu: en
              ? `$ZC = 100 \\cdot e^{-rT}$ = 100 × e^(−${f(r / 100, 3)} × ${f(T, 0)}) = **${f(zc, 2)}** % of par. Park ${f(zc, 2)} today at ${pct(r, 1)} and compounding alone returns 100 at maturity, whatever the index does. The capital guarantee is a bond from module 4 — and in practice the issuing bank IS the zero-coupon: the client is lending it money (funding).`
              : `$ZC = 100 \\cdot e^{-rT}$ = 100 × e^(−${f(r / 100, 3)} × ${f(T, 0)}) = **${f(zc, 2)}** % du nominal. Placez ${f(zc, 2)} aujourd'hui à ${pct(r, 1)} et la capitalisation seule redonne 100 à l'échéance, quoi que fasse l'indice. La garantie du capital est une obligation du module 4 — et en pratique la banque émettrice EST le zéro-coupon : le client lui prête son argent (le funding).`,
          }],
          pieges: [en
            ? `Using linear discounting 100/(1 + rT) is the module 4 money-market convention; the structuring desk discounts CONTINUOUSLY, e^{−rT} — the Black-Scholes convention of module 8.`
            : `Actualiser en linéaire 100/(1 + rT) est la convention monétaire du module 4 ; le desk de structuration actualise en CONTINU, e^{−rT} — la convention Black-Scholes du module 8.`],
        },
        {
          intitule: en ? 'b) What is left to dream: the option budget' : 'b) Ce qui reste pour rêver : le budget d\'options',
          enonce: en
            ? `The client pays 100, the zero-coupon of a) locks up its share, the margin takes ${pct(marge, 1)}. What option budget is left, in % of par?`
            : `Le client apporte 100, le zéro-coupon du a) immobilise sa part, la marge prélève ${pct(marge, 1)}. Quel budget d'options reste-t-il, en % du nominal ?`,
          reponse: budget, tolerance: 0.005, unite: en ? '% of par' : '% du nominal',
          etapes: [{
            titre: en ? 'Budget = 100 − ZC − margin' : 'Budget = 100 − ZC − marge',
            contenu: en
              ? `Budget = 100 − ${f(zc, 2)} − ${f(marge, 1)} = **${f(budget, 2)}** % of par. Of the client's 100, ${f(zc, 2)} sleep in the guarantee, ${f(marge, 1)} pays the chain (structurer + distributor, locked in on day one) — only ${f(budget, 2)} go to the options desk to buy conditional promise. Every ounce of generosity in the formula must fit inside this number.`
              : `Budget = 100 − ${f(zc, 2)} − ${f(marge, 1)} = **${f(budget, 2)}** % du nominal. Sur les 100 du client, ${f(zc, 2)} dorment dans la garantie, ${f(marge, 1)} rémunère la chaîne (structureur + distributeur, verrouillée le jour 1) — seuls ${f(budget, 2)} partent au desk d'options acheter de la promesse conditionnelle. Toute la générosité de la formule devra tenir dans ce chiffre.`,
          }],
          pieges: [en
            ? `Forgetting the margin (100 − ZC) overstates the budget by ${f(marge, 1)} points — the margin is inside the price, not billed on top (chapter 1).`
            : `Oublier la marge (100 − ZC) surestime le budget de ${f(marge, 1)} point${marge >= 2 ? 's' : ''} — la marge est à l'intérieur du prix, pas facturée en plus (chapitre 1).`],
        },
        {
          intitule: en ? 'c) The shop-window number: the participation' : 'c) Le chiffre de la vitrine : la participation',
          enonce: en
            ? `The ${f(T, 0)}-year ATM call on the index costs ${pct(callAtm, 2)} of par. What participation in the index upside can the structurer offer, in %?`
            : `Le call ATM ${f(T, 0)} ans sur l'indice coûte ${pct(callAtm, 2)} du nominal. Quelle participation à la hausse de l'indice le structureur peut-il offrir, en % ?`,
          reponse: partPct, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'Participation = budget / ATM call price' : 'Participation = budget / prix du call ATM',
            contenu: en
              ? `$p = \\text{budget} / \\text{call ATM}$ = ${f(budget, 2)} / ${f(callAtm, 2)} = **${pct(partPct, 2)}** of the rise. THE formula of the chapter: the participation is not a commercial choice, it is the result of a division — how many calls can the budget pay for? ${partPct < 100 ? `The budget is smaller than the call, so the client gets less than the full upside.` : `The budget exceeds the call price: the client gets MORE than the rise — the two-worlds market of 2023.`}`
              : `$p = \\text{budget} / \\text{call ATM}$ = ${f(budget, 2)} / ${f(callAtm, 2)} = **${pct(partPct, 2)}** de la hausse. LA formule du chapitre : la participation n'est pas un choix commercial, c'est le résultat d'une division — combien de calls le budget peut-il payer ? ${partPct < 100 ? `Le budget est plus petit que le call : le client touche moins que la hausse entière.` : `Le budget dépasse le prix du call : le client touche PLUS que la hausse — le marché retrouvé de 2023.`}`,
          }],
          pieges: [en
            ? `The inverted ratio (call/budget = ${f(r2(100 * callAtm / budget), 1)}%) is the classic slip. Detector: if the budget is SMALLER than the call price, the participation must be BELOW 100%.`
            : `Le ratio inversé (call/budget = ${f(r2(100 * callAtm / budget), 1)} %) est l'étourderie classique. Détecteur : si le budget est PLUS PETIT que le prix du call, la participation doit être INFÉRIEURE à 100 %.`],
        },
        {
          intitule: en ? `d) The client reading: +${f(perfUp, 0)}% or −${f(perfDn, 0)}%` : `d) La lecture client : +${f(perfUp, 0)} % ou −${f(perfDn, 0)} %`,
          enonce: en
            ? `At maturity the index has gained ${pct(perfUp, 0)}. Using the participation of c), what does the note repay per 100 of par? (The corrigé also settles the −${f(perfDn, 0)}% scenario.)`
            : `À l'échéance, l'indice a gagné ${pct(perfUp, 0)}. Avec la participation du c), combien la note rembourse-t-elle pour 100 de nominal ? (Le corrigé règle aussi le scénario à −${f(perfDn, 0)} %.)`,
          reponse: rembUp, tolerance: 0.005, unite: en ? '% of par' : '% du nominal',
          etapes: [
            {
              titre: en ? '100 + p × max(performance, 0)' : '100 + p × max(performance, 0)',
              contenu: en
                ? `Redemption = $100 + p \\times \\max(\\text{perf},\\ 0) \\times 100$ = 100 + ${f(partPct / 100, 4)} × ${f(perfUp, 0)} = **${f(rembUp, 2)}** per 100. The zero-coupon delivers the 100, the ${f(partPct / 100, 4)} calls deliver the upside share — each brick pays its own line of the formula.`
                : `Remboursement = $100 + p \\times \\max(\\text{perf},\\ 0) \\times 100$ = 100 + ${f(partPct / 100, 4)} × ${f(perfUp, 0)} = **${f(rembUp, 2)}** pour 100. Le zéro-coupon verse les 100, les ${f(partPct / 100, 4)} calls versent la fraction de hausse — chaque brique paie sa ligne de la formule.`,
            },
            {
              titre: en ? `The −${f(perfDn, 0)}% scenario: the real price of the guarantee` : `Le scénario à −${f(perfDn, 0)} % : le vrai prix de la garantie`,
              contenu: en
                ? `Index down ${pct(perfDn, 0)}: the calls die worthless, the zero-coupon repays **100** — no loss, but ${f(T, 0)} years immobilised for zero return. The worst case of a guaranteed note is an OPPORTUNITY COST, not a capital loss. Two asterisks before signing: the guarantee only lives at maturity (sold mid-life, the note trades at the price of its bricks), and it is only worth the issuer's signature (Lehman, chapter 7).`
                : `Indice à −${f(perfDn, 0)} % : les calls meurent sans valeur, le zéro-coupon rembourse **100** — aucune perte, mais ${f(T, 0)} ans immobilisés pour un rendement nul. Le pire cas d'une note garantie est un COÛT D'OPPORTUNITÉ, pas une perte en capital. Deux astérisques avant de signer : la garantie ne vit qu'à maturité (revendue en cours de route, la note cote au prix de ses briques), et elle ne vaut que la signature de l'émetteur (Lehman, chapitre 7).`,
            },
          ],
          pieges: [en
            ? `Applying the participation to the NEGATIVE performance (100 − ${f(partPct / 100, 2)} × ${f(perfDn, 0)}) misreads the payoff: the max(·, 0) is a call — the downside belongs to the zero-coupon, floored at 100.`
            : `Appliquer la participation à la performance NÉGATIVE (100 − ${f(partPct / 100, 2)} × ${f(perfDn, 0)}) lit mal le payoff : le max(·, 0) est un call — la baisse appartient au zéro-coupon, plancher à 100.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 2. m9-pb-02 — La brochure du reverse convertible — N1               */
/* ------------------------------------------------------------------ */
const brochureReverse: ProblemeMoule = {
  id: 'm9-pb-02', moduleId: M9,
  titre: 'La brochure du reverse convertible, décomposée',
  titreEn: 'The reverse convertible brochure, taken apart',
  typeDeCas: 'reverse convertible',
  typeDeCasEn: 'reverse convertible',
  difficulte: 1,
  scenarios: ["Le conseiller de l'agence reçoit la brochure du mois (pétrolière du CAC 40)", "La cliente demande d'où sort le coupon (banque de la zone euro)", "L'oral du jury : « décomposez-moi ce coupon » (tech du Nasdaq)"],
  scenariosEn: ['The branch adviser gets the product of the month (CAC 40 oil major)', 'The client asks where the coupon comes from (euro-area bank)', 'The oral exam: "take this coupon apart" (Nasdaq tech stock)'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : taux, volatilité (donc prime du put), chute du titre.
    const cfg = ([
      { rMin: 4.5, rMax: 5.5, vMin: 18, vMax: 22, dnMin: 60, dnMax: 82 },
      { rMin: 2.5, rMax: 3.5, vMin: 24, vMax: 30, dnMin: 55, dnMax: 80 },
      { rMin: 3.5, rMax: 4.5, vMin: 30, vMax: 38, dnMin: 45, dnMax: 75 },
    ] as const)[sIdx];
    const r = randFloat(rng, cfg.rMin, cfg.rMax, 1);
    const vol = randInt(rng, cfg.vMin, cfg.vMax);
    const sDown = randInt(rng, cfg.dnMin, cfg.dnMax);
    const T = 1; // brochure canonique : un an, strike au niveau initial (base 100)
    const putAtm = r2(blackScholesPut(100, 100, r, vol, T));
    const zc = r2(prixZeroCoupon(r, T));
    const couponEq = r2(couponReverseConvertible(putAtm, r, T));
    const couponRf = r2(couponReverseConvertible(0, r, T));
    const partRisque = r2(couponEq - couponRf);
    const totalDown = r2(sDown + couponEq);
    const pointMort = r2(100 - couponEq);

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `1-year note on the stock (initial level rebased to 100, strike 100); coupon "paid whatever happens"; below the strike at maturity, redemption in shares; risk-free rate ${pct(r, 1)}; the options desk quotes the 1-year ATM put at ${pct(putAtm, 2)} of par`
      : `note à 1 an sur l'action (niveau initial rebasé à 100, strike 100) ; coupon « versé quoi qu'il arrive » ; sous le strike à l'échéance, remboursement en titres ; taux sans risque ${pct(r, 1)} ; le desk options cote le put ATM 1 an à ${pct(putAtm, 2)} du nominal`;
    const contexte = (en
      ? [
        `The product of the month lands in the branch: a big "guaranteed coupon" on an oil major, capital not guaranteed in small print: ${desc}. Before selling a single unit, the adviser does what chapter 3 teaches — follow the money: rebuild the fair coupon, split it into risk-free rate and put premium, then settle the crash scenario and the break-even.`,
        `"The savings account pays ${pct(r, 1)} — where does your coupon come from?" The client's question deserves the structurer's answer: ${desc}. Rebuild the coupon from its bricks, isolate the part that is just the risk-free rate, then show her what she receives if the bank stock finishes at ${f(sDown, 0)} — and below what level she starts losing.`,
        `Oral exam, and the examiner slides a Nasdaq-tech term sheet across the table: ${desc}. The expected demonstration: the fair coupon from the decomposition, the split rate/put premium, the settlement when the stock collapses to ${f(sDown, 0)}, and the break-even — with the sentence every jury waits for: any coupon above the risk-free rate is the price of a risk sold.`,
      ]
      : [
        `La brochure du mois arrive à l'agence : un gros « coupon garanti » sur une pétrolière, capital non garanti en petits caractères : ${desc}. Avant d'en vendre une seule part, le conseiller fait ce que le chapitre 3 enseigne — suivre l'argent : reconstruire le coupon équitable, le découper en taux sans risque et prime du put, puis régler le scénario de krach et le point mort.`,
        `« Le livret paie ${pct(r, 1)} — d'où sort votre coupon ? » La question de la cliente mérite la réponse du structureur : ${desc}. Reconstruisez le coupon depuis ses briques, isolez la part qui n'est que le taux sans risque, puis montrez-lui ce qu'elle reçoit si l'action de la banque finit à ${f(sDown, 0)} — et sous quel niveau elle commence à perdre.`,
        `Oral de fin de module, et l'examinateur pousse une term sheet sur une tech du Nasdaq : ${desc}. La démonstration attendue : le coupon équitable par la décomposition, le découpage taux/prime du put, le règlement quand l'action s'effondre à ${f(sDown, 0)}, et le point mort — avec la phrase que tout jury attend : tout coupon au-dessus du taux sans risque est le prix d'un risque vendu.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The fair coupon, rebuilt' : 'a) Le coupon équitable, reconstruit',
          enonce: en
            ? `The structurer places a zero-coupon and sells, on the client's behalf, the ATM put quoted ${pct(putAtm, 2)}. Today's proceeds, 100 − ZC + premium, are capitalised to maturity. What annual coupon does that finance, in % of par?`
            : `Le structureur place un zéro-coupon et vend, au nom du client, le put ATM coté ${pct(putAtm, 2)}. Le disponible du jour, 100 − ZC + prime, est capitalisé jusqu'à l'échéance. Quel coupon annuel cela finance-t-il, en % du nominal ?`,
          reponse: couponEq, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'coupon = (100 − ZC + premium) / e^{−rT} / T' : 'coupon = (100 − ZC + prime) / e^{−rT} / T',
            contenu: en
              ? `ZC = $100 \\cdot e^{-rT}$ = ${f(zc, 2)}. Proceeds = 100 − ${f(zc, 2)} + ${f(putAtm, 2)} = ${f(r2(100 - zc + putAtm), 2)}, capitalised one year (÷ ${f(r2(zc) / 100, 4)}): coupon = **${pct(couponEq, 2)}**. That is the number on the brochure — not generosity, an assembly: a loan to the bank, plus an insurance policy sold by the client without reading its name.`
              : `ZC = $100 \\cdot e^{-rT}$ = ${f(zc, 2)}. Disponible = 100 − ${f(zc, 2)} + ${f(putAtm, 2)} = ${f(r2(100 - zc + putAtm), 2)}, capitalisé un an (÷ ${f(r2(zc) / 100, 4)}) : coupon = **${pct(couponEq, 2)}**. C'est le chiffre de la brochure — pas de la générosité, un assemblage : un prêt à la banque, plus une police d'assurance vendue par le client sans en avoir lu le nom.`,
          }],
          pieges: [en
            ? `Forgetting to capitalise (100 − ZC + premium spread as-is) understates the coupon: the proceeds sit invested at ${pct(r, 1)} until maturity — divide by e^{−rT}.`
            : `Oublier la capitalisation (répartir 100 − ZC + prime tel quel) sous-estime le coupon : le disponible reste placé à ${pct(r, 1)} jusqu'à l'échéance — on divise par e^{−rT}.`],
        },
        {
          intitule: en ? 'b) The risk-free share of the coupon' : 'b) La part sans risque du coupon',
          enonce: en
            ? `Set the put premium to ZERO in the formula of a). What coupon is left — the share that is just the capitalised risk-free rate, in %?`
            : `Posez la prime du put à ZÉRO dans la formule du a). Quel coupon reste-t-il — la part qui n'est que le taux sans risque capitalisé, en % ?`,
          reponse: couponRf, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'Premium = 0 ⇒ coupon = 100·(e^{rT} − 1)' : 'Prime = 0 ⇒ coupon = 100·(e^{rT} − 1)',
            contenu: en
              ? `Without the put, coupon = $100\\,(e^{rT} - 1)$ = **${pct(couponRf, 2)}** — what the same loan would pay with zero risk. The decomposition that never lies: ${f(couponEq, 2)} = ${f(couponRf, 2)} (risk-free rate) + ${f(partRisque, 2)} (capitalised put premium). Those ${f(partRisque, 2)} points are the price of the insurance the client just sold — the reflex in front of any "${f(couponEq, 0)}% when rates are at ${f(r, 0)}%": where are the missing points, which option did I sell without knowing?`
              : `Sans le put, coupon = $100\\,(e^{rT} - 1)$ = **${pct(couponRf, 2)}** — ce que paierait le même prêt sans aucun risque. La décomposition qui ne ment jamais : ${f(couponEq, 2)} = ${f(couponRf, 2)} (taux sans risque) + ${f(partRisque, 2)} (prime du put capitalisée). Ces ${f(partRisque, 2)} points sont le prix de l'assurance que le client vient de vendre — le réflexe devant tout « ${f(couponEq, 0)} % quand les taux sont à ${f(r, 0)} % » : où sont les points manquants, quelle option ai-je vendue sans le savoir ?`,
          }],
          pieges: [en
            ? `Reading the extra ${f(partRisque, 2)} points as the bank's generosity or skill: at market prices there is no free coupon — only risks more or less visible (chapter 4).`
            : `Lire les ${f(partRisque, 2)} points d'écart comme la générosité ou le talent de la banque : à prix de marché il n'y a pas de coupon gratuit — seulement des risques plus ou moins visibles (chapitre 4).`],
        },
        {
          intitule: en ? `c) The crash: the stock finishes at ${f(sDown, 0)}` : `c) Le krach : l'action finit à ${f(sDown, 0)}`,
          enonce: en
            ? `At maturity the stock (started at 100) finishes at ${f(sDown, 0)}, below the strike: the client is repaid in shares and still receives the coupon of a). What does he collect in total, per 100 of par?`
            : `À l'échéance, l'action (partie de 100) finit à ${f(sDown, 0)}, sous le strike : le client est remboursé en titres et touche quand même le coupon du a). Que récupère-t-il au total, pour 100 de nominal ?`,
          reponse: totalDown, tolerance: 0.005, unite: en ? '% of par' : '% du nominal',
          etapes: [
            {
              titre: en ? 'Share + coupon: the put exercised against the client' : 'Titre + coupon : le put exercé contre le client',
              contenu: en
                ? `Physical settlement: one share worth ${f(sDown, 0)}, plus the coupon ${f(couponEq, 2)} = **${f(totalDown, 2)}** per 100 — a P&L of ${f(r2(totalDown - 100), 2)}. The put sold in a) has exercised: the client "buys" at 100 (his par) a share worth ${f(sDown, 0)}. That is exactly the short-put payoff of module 8, delivered in kind.`
                : `Remise en titres : une action valant ${f(sDown, 0)}, plus le coupon ${f(couponEq, 2)} = **${f(totalDown, 2)}** pour 100 — un P&L de ${f(r2(totalDown - 100), 2)}. Le put vendu au a) s'est exercé : le client « achète » à 100 (son nominal) un titre qui en vaut ${f(sDown, 0)}. C'est exactement le payoff du vendeur de put du module 8, livré en nature.`,
            },
            {
              titre: en ? 'The anaesthetic comparison' : 'La comparaison anesthésiante',
              contenu: en
                ? `The direct shareholder shows ${f(r2(sDown - 100), 0)}; the note holder shows ${f(r2(totalDown - 100), 2)} — he loses LESS, and that is the sales pitch. But the coupon was the PRICE of the risk that just materialised, not a consolation prize on top — and the shareholder had not capped his upside at ${f(couponEq, 2)}, unlike the note, whose best case is ${f(r2(100 + couponEq), 2)} whatever the rally.`
                : `L'actionnaire direct affiche ${f(r2(sDown - 100), 0)} ; le porteur de la note affiche ${f(r2(totalDown - 100), 2)} — il perd MOINS, et c'est l'argument commercial. Mais le coupon était le PRIX du risque qui vient de se matérialiser, pas un lot de consolation par-dessus — et l'actionnaire, lui, n'avait pas plafonné sa hausse à ${f(couponEq, 2)}, contrairement à la note, dont le meilleur cas est ${f(r2(100 + couponEq), 2)} quel que soit le rallye.`,
            },
          ],
          pieges: [en
            ? `"The coupon is guaranteed, so the capital is too" inverts the brochure's hierarchy: the certain number is the small print (capital at risk), the uncertain one is the big print.`
            : `« Le coupon est garanti, donc le capital aussi » inverse la hiérarchie de la brochure : le chiffre certain est en petits caractères (capital en risque), le chiffre incertain en gros.`],
        },
        {
          intitule: en ? 'd) The break-even' : 'd) Le point mort',
          enonce: en
            ? `Below what stock level at maturity does the holder (coupon included) start losing money, per 100 of initial level?`
            : `Sous quel niveau de l'action à l'échéance le porteur (coupon compris) commence-t-il à perdre de l'argent, pour 100 de niveau initial ?`,
          reponse: pointMort, tolerance: 0.005, unite: en ? '% of initial level' : '% du niveau initial',
          etapes: [{
            titre: en ? '100 − coupon: the cushion is exactly the premium' : '100 − coupon : le coussin est exactement la prime',
            contenu: en
              ? `Break-even = 100 − ${f(couponEq, 2)} = **${f(pointMort, 2)}**. As long as the stock loses less than the coupon, the holder stays ahead; below, every point of decline is his. Note the profile: gains CAPPED at ${f(couponEq, 2)} (reached as soon as S_T ≥ 100), losses open down to ${f(r2(couponEq - 100), 0)} — the insurer's profile of module 8: regular premiums, one rare heavy claim. Here the stock finished at ${f(sDown, 0)}, ${f(r2(pointMort - sDown), 2)} below the break-even.`
              : `Point mort = 100 − ${f(couponEq, 2)} = **${f(pointMort, 2)}**. Tant que l'action perd moins que le coupon, le porteur reste gagnant ; en dessous, chaque point de baisse est pour lui. Notez le profil : gain PLAFONNÉ à ${f(couponEq, 2)} (atteint dès que S_T ≥ 100), perte ouverte jusqu'à ${f(r2(couponEq - 100), 0)} — le profil de l'assureur du module 8 : des primes régulières, un sinistre rare et lourd. Ici l'action a fini à ${f(sDown, 0)}, soit ${f(r2(pointMort - sDown), 2)} sous le point mort.`,
          }],
          pieges: [en
            ? `Placing the break-even at the strike (100): the coupon, received whatever happens, cushions the first ${f(couponEq, 2)} points of decline — the zero is at ${f(pointMort, 2)}, not at 100.`
            : `Mettre le point mort au strike (100) : le coupon, touché quoi qu'il arrive, amortit les ${f(couponEq, 2)} premiers points de baisse — le zéro est à ${f(pointMort, 2)}, pas à 100.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 3. m9-pb-03 — Le zéro-coupon, les taux et le funding — N1           */
/* ------------------------------------------------------------------ */
const zeroCouponFunding: ProblemeMoule = {
  id: 'm9-pb-03', moduleId: M9,
  titre: 'Le zéro-coupon, les taux et le funding : la matière première',
  titreEn: 'The zero-coupon, rates and funding: the raw material',
  typeDeCas: "budget d'options",
  typeDeCasEn: 'option budget',
  difficulte: 1,
  scenarios: ['Le comité produit de 2021 : pourquoi la vitrine est vide', '2023 : le retour du capital garanti en banque privée', "Le junior et l'archive des term sheets (2019 contre 2024)"],
  scenariosEn: ['The 2021 product committee: why the shop window is empty', '2023: the guaranteed note returns to private banking', 'The junior and the term-sheet archive (2019 versus 2024)'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : taux bas / taux hauts, maturité, marge, spread de funding.
    const cfg = ([
      { rbMin: 0.3, rbMax: 0.8, rhMin: 3.5, rhMax: 4.5, T: 5, mMin: 0.8, mMax: 1.2, vMin: 18, vMax: 22, spMin: 0.3, spMax: 0.9 },
      { rbMin: 0.4, rbMax: 1.0, rhMin: 3.8, rhMax: 4.8, T: 6, mMin: 1.0, mMax: 1.5, vMin: 16, vMax: 20, spMin: 0.4, spMax: 1.0 },
      { rbMin: 0.3, rbMax: 0.6, rhMin: 3.2, rhMax: 4.2, T: 8, mMin: 0.6, mMax: 0.9, vMin: 17, vMax: 21, spMin: 0.5, spMax: 1.2 },
    ] as const)[sIdx];
    const rBas = randFloat(rng, cfg.rbMin, cfg.rbMax, 1);
    const rHaut = randFloat(rng, cfg.rhMin, cfg.rhMax, 1);
    const marge = randFloat(rng, cfg.mMin, cfg.mMax, 1);
    const vol = randInt(rng, cfg.vMin, cfg.vMax);
    const spread = randFloat(rng, cfg.spMin, cfg.spMax, 1);
    const T = cfg.T;
    const zcBas = r2(prixZeroCoupon(rBas, T));
    const budgetBas = r2(budgetOptions(zcBas, marge));
    const zcHaut = r2(prixZeroCoupon(rHaut, T));
    const budgetHaut = r2(budgetOptions(zcHaut, marge));
    const callBas = r2(blackScholesCall(100, 100, rBas, vol, T));
    const callHaut = r2(blackScholesCall(100, 100, rHaut, vol, T));
    const partBas = r2(100 * participationCapitalGaranti(budgetBas, callBas));
    const partHaut = r2(100 * participationCapitalGaranti(budgetHaut, callHaut));
    const rFund = r2(rHaut + spread);
    const zcFund = r2(prixZeroCoupon(rFund, T));
    const budgetFund = r2(budgetOptions(zcFund, marge));

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `${f(T, 0)}-year guaranteed note, margin ${pct(marge, 1)} of par, index volatility ${pct(vol, 0)}; low-rate world: ${pct(rBas, 1)}; post-2022 world: ${pct(rHaut, 1)}; the bank funds itself ${pct(spread, 1)} above the risk-free rate`
      : `note garantie à ${f(T, 0)} ans, marge ${pct(marge, 1)} du nominal, volatilité de l'indice ${pct(vol, 0)} ; monde de taux bas : ${pct(rBas, 1)} ; monde post-2022 : ${pct(rHaut, 1)} ; la banque se finance ${pct(spread, 1)} au-dessus du taux sans risque`;
    const contexte = (en
      ? [
        `Product committee, zero-rate era: the sales head demands a guaranteed note "like before" and the structurer must demonstrate, numbers in hand, why the shop window is empty: ${desc}. Then rates rise — and the same division brings the product back to life. Show the whole mechanism, budget by budget, down to the funding detail everybody forgets.`,
        `A private banker digs out the guaranteed-note pitch her bank had shelved for years: rates are back, so is the product: ${desc}. Her presentation must chain the two worlds — the starving budget of the low-rate years, the comfortable one of 2023 — and finish on the raw material's dirty secret: the bank's own funding rate.`,
        `The junior finds two term sheets in the archive, same formula, five years apart — one stingy, one generous: ${desc}. His task for the morning meeting: prove with the zero-coupon arithmetic that no engineering genius separates them, just the rate cycle — plus the funding spread that quietly fattens the budget.`,
      ]
      : [
        `Comité produit, ère des taux zéro : le directeur commercial exige une note garantie « comme avant » et le structureur doit démontrer, chiffres à l'appui, pourquoi la vitrine est vide : ${desc}. Puis les taux remontent — et la même division ressuscite le produit. Montrez tout le mécanisme, budget par budget, jusqu'au détail du funding que tout le monde oublie.`,
        `Une banquière privée ressort l'argumentaire de la note garantie que sa banque avait remisé depuis des années : les taux sont revenus, le produit aussi : ${desc}. Sa présentation doit enchaîner les deux mondes — le budget famélique des années de taux bas, le budget confortable de 2023 — et finir sur le secret peu avouable de la matière première : le taux de funding de la banque elle-même.`,
        `Le junior retrouve deux term sheets dans l'archive, même formule, cinq ans d'écart — l'une avare, l'autre généreuse : ${desc}. Sa mission pour le morning meeting : prouver par l'arithmétique du zéro-coupon qu'aucun génie d'ingénierie ne les sépare, juste le cycle des taux — plus le spread de funding qui engraisse discrètement le budget.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? `a) The low-rate world (${pct(rBas, 1)}): the starving budget` : `a) Le monde des taux bas (${pct(rBas, 1)}) : le budget famélique`,
          enonce: en
            ? `At ${pct(rBas, 1)} over ${f(T, 0)} years, after the ${pct(marge, 1)} margin, what option budget is left, in % of par?`
            : `À ${pct(rBas, 1)} sur ${f(T, 0)} ans, une fois la marge de ${pct(marge, 1)} servie, quel budget d'options reste-t-il, en % du nominal ?`,
          reponse: budgetBas, tolerance: 0.02, toleranceMode: 'absolu', unite: en ? '% of par' : '% du nominal',
          etapes: [{
            titre: en ? 'ZC near 100 ⇒ budget near zero' : 'ZC proche de 100 ⇒ budget proche de zéro',
            contenu: en
              ? `ZC = $100 \\cdot e^{-rT}$ = ${f(zcBas, 2)} : when r tends to zero, the guarantee eats almost everything. Budget = 100 − ${f(zcBas, 2)} − ${f(marge, 1)} = **${f(budgetBas, 2)}** % of par. With that, the formula has almost nothing to promise — this is why the zero-rate decade made guaranteed notes UNMAKEABLE, and pushed savings toward products where the client SELLS options to create yield (reverse convertibles, autocalls).`
              : `ZC = $100 \\cdot e^{-rT}$ = ${f(zcBas, 2)} : quand r tend vers zéro, la garantie mange presque tout. Budget = 100 − ${f(zcBas, 2)} − ${f(marge, 1)} = **${f(budgetBas, 2)}** % du nominal. Avec ça, la formule n'a presque rien à promettre — voilà pourquoi la décennie de taux zéro a rendu les notes garanties INFABRICABLES, et poussé l'épargne vers les produits où le client VEND des options pour créer du rendement (reverse convertibles, autocalls).`,
          }],
          pieges: [en
            ? `Believing the low budget comes from expensive options: the volatility has not moved — 100% of the squeeze comes from the zero-coupon at ${f(zcBas, 2)}.`
            : `Croire que le budget maigre vient d'options chères : la volatilité n'a pas bougé — 100 % de l'étranglement vient du zéro-coupon à ${f(zcBas, 2)}.`],
        },
        {
          intitule: en ? `b) The post-2022 world (${pct(rHaut, 1)}): the budget reborn` : `b) Le monde post-2022 (${pct(rHaut, 1)}) : le budget ressuscité`,
          enonce: en
            ? `Same note, but the central bank has hiked and the ${f(T, 0)}-year rate is now ${pct(rHaut, 1)}. What is the new option budget, in % of par?`
            : `Même note, mais la banque centrale a remonté ses taux et le ${f(T, 0)} ans vaut désormais ${pct(rHaut, 1)}. Quel est le nouveau budget d'options, en % du nominal ?`,
          reponse: budgetHaut, tolerance: 0.005, unite: en ? '% of par' : '% du nominal',
          etapes: [{
            titre: en ? 'Rates ↑ ⇒ ZC ↓ ⇒ budget ↑' : 'Taux ↑ ⇒ ZC ↓ ⇒ budget ↑',
            contenu: en
              ? `ZC = ${f(zcHaut, 2)}; budget = 100 − ${f(zcHaut, 2)} − ${f(marge, 1)} = **${f(budgetHaut, 2)}** — ${f(r2(budgetHaut / Math.max(budgetBas, 0.01)), 1)} times the budget of a), with the SAME formula and the SAME margin. The 2022-2023 hikes (ECB from −0.5% to 4% in eighteen months) made the zero-coupon cheap again — and guaranteed notes reappeared in the windows, sometimes with participations above 100%. No financial genius: the same division, with another r.`
              : `ZC = ${f(zcHaut, 2)} ; budget = 100 − ${f(zcHaut, 2)} − ${f(marge, 1)} = **${f(budgetHaut, 2)}** — ${f(r2(budgetHaut / Math.max(budgetBas, 0.01)), 1)} fois le budget du a), avec la MÊME formule et la MÊME marge. La remontée de 2022-2023 (BCE de −0,5 % à 4 % en dix-huit mois) a rendu le zéro-coupon bon marché — et les notes garanties sont réapparues en vitrine, parfois avec des participations au-delà de 100 %. Aucun génie financier : la même division, avec un autre r.`,
          }],
        },
        {
          intitule: en ? 'c) The shop window in both worlds' : 'c) La vitrine dans les deux mondes',
          enonce: en
            ? `The ATM call costs ${pct(callBas, 2)} of par in the low-rate world and ${pct(callHaut, 2)} in the high-rate world (the call is increasing in r, module 8). What participation does the ${pct(rHaut, 1)} world display, in %?`
            : `Le call ATM coûte ${pct(callBas, 2)} du nominal dans le monde de taux bas et ${pct(callHaut, 2)} dans le monde de taux hauts (le call est croissant en r, module 8). Quelle participation le monde à ${pct(rHaut, 1)} affiche-t-il, en % ?`,
          reponse: partHaut, tolerance: 0.005, unite: '%',
          etapes: [
            {
              titre: en ? 'Two floors of the fraction, one dominant effect' : 'Deux étages de la fraction, un effet dominant',
              contenu: en
                ? `p = budget / call = ${f(budgetHaut, 2)} / ${f(callHaut, 2)} = **${pct(partHaut, 2)}**. In the low-rate world: ${f(budgetBas, 2)} / ${f(callBas, 2)} = ${pct(partBas, 2)} — nobody locks ${f(T, 0)} years of savings for that. Both floors of the fraction moved with r (the call too: ${f(callBas, 2)} → ${f(callHaut, 2)}), but the budget effect crushes the premium effect. The chain to recite: rates ↑ ⇒ ZC ↓ ⇒ budget ↑ ⇒ participation ↑.`
                : `p = budget / call = ${f(budgetHaut, 2)} / ${f(callHaut, 2)} = **${pct(partHaut, 2)}**. Dans le monde de taux bas : ${f(budgetBas, 2)} / ${f(callBas, 2)} = ${pct(partBas, 2)} — personne n'immobilise ${f(T, 0)} ans d'épargne pour ça. Les deux étages de la fraction ont bougé avec r (le call aussi : ${f(callBas, 2)} → ${f(callHaut, 2)}), mais l'effet budget écrase l'effet prime. La chaîne à réciter : taux ↑ ⇒ ZC ↓ ⇒ budget ↑ ⇒ participation ↑.`,
            },
            {
              titre: en ? 'The macro argument that makes good copies' : 'L\'argument macro qui fait les bonnes copies',
              contenu: en
                ? `The generosity of guaranteed products is a THERMOMETER OF LONG RATES, not an engineering feat. Jury question "why did guaranteed notes come back in 2023?" — answer in one sentence: because $ZC = 100 \\cdot e^{-rT}$ collapsed when rates rose, and everything no longer immobilised in the guarantee becomes option budget again.`
                : `La générosité des produits garantis est un THERMOMÈTRE DES TAUX LONGS, pas un exploit d'ingénierie. Question de jury « pourquoi les notes garanties sont-elles revenues en 2023 ? » — réponse en une phrase : parce que $ZC = 100 \\cdot e^{-rT}$ s'est effondré quand les taux ont remonté, et que tout ce qui n'est plus immobilisé dans la garantie redevient du budget d'options.`,
            },
          ],
          pieges: [en
            ? `"Rates up ⇒ calls more expensive ⇒ participation down" reads only the bottom floor of the fraction: the budget effect (numerator) dominates by far — ${pct(partBas, 1)} versus ${pct(partHaut, 1)} here.`
            : `« Taux en hausse ⇒ calls plus chers ⇒ participation en baisse » ne lit que l'étage du bas de la fraction : l'effet budget (numérateur) domine de loin — ${pct(partBas, 1)} contre ${pct(partHaut, 1)} ici.`],
        },
        {
          intitule: en ? 'd) The funding detail: the bank IS the zero-coupon' : 'd) Le détail du funding : la banque EST le zéro-coupon',
          enonce: en
            ? `The bank does not buy the zero-coupon from a third party: the client lends it 100, and it discounts its own repayment at its FUNDING rate, ${pct(rHaut, 1)} + ${pct(spread, 1)} = ${pct(rFund, 1)}. What does the internal budget become, in % of par?`
            : `La banque n'achète pas le zéro-coupon à un tiers : le client lui prête 100, et elle actualise son propre remboursement à son taux de FUNDING, ${pct(rHaut, 1)} + ${pct(spread, 1)} = ${pct(rFund, 1)}. Que devient le budget interne, en % du nominal ?`,
          reponse: budgetFund, tolerance: 0.005, unite: en ? '% of par' : '% du nominal',
          etapes: [
            {
              titre: en ? 'A dearer funding makes a cheaper internal ZC' : 'Un funding plus cher fait un ZC interne moins cher',
              contenu: en
                ? `ZC at ${pct(rFund, 1)} = ${f(zcFund, 2)}; budget = 100 − ${f(zcFund, 2)} − ${f(marge, 1)} = **${f(budgetFund, 2)}** — ${f(r2(budgetFund - budgetHaut), 2)} point${budgetFund - budgetHaut >= 1.995 ? 's' : ''} more than at the risk-free rate. Issuing the note is a debt issue: the relevant r is the rate at which the bank borrows, slightly above the risk-free rate.`
                : `ZC à ${pct(rFund, 1)} = ${f(zcFund, 2)} ; budget = 100 − ${f(zcFund, 2)} − ${f(marge, 1)} = **${f(budgetFund, 2)}** — soit ${f(r2(budgetFund - budgetHaut), 2)} point${budgetFund - budgetHaut >= 1.995 ? 's' : ''} de plus qu'au taux sans risque. Émettre la note est une émission de dette : le r pertinent est le taux auquel la banque emprunte, légèrement au-dessus du taux sans risque.`,
            },
            {
              titre: en ? 'The paradox to keep for chapter 7' : 'Le paradoxe à garder pour le chapitre 7',
              contenu: en
                ? `The more fragile the signature, the dearer its funding, the cheaper its internal zero-coupon — and the prettier its formulas. At equal formulas, the most generous product is often the one from the least safe issuer: Lehman's summer-2008 notes were, in the shop window, among the most generous on the market. A guaranteed note does not remove risk — it moves it from the market to the signature.`
                : `Plus la signature est fragile, plus son funding est cher, plus son zéro-coupon interne est bon marché — et plus ses formules sont belles. À formule égale, le produit le plus généreux est souvent celui de l'émetteur le moins sûr : les notes Lehman de l'été 2008 étaient, en vitrine, parmi les plus généreuses du marché. Une note garantie ne supprime pas le risque — elle le déplace du marché vers la signature.`,
            },
          ],
          pieges: [en
            ? `Reading the extra budget as a client gift: it is the remuneration of the CREDIT RISK the client now carries on the issuer — the guarantee is a senior unsecured claim, nothing more.`
            : `Lire le budget supplémentaire comme un cadeau au client : c'est la rémunération du RISQUE DE CRÉDIT qu'il porte désormais sur l'émetteur — la garantie est une créance senior non sécurisée, rien de plus.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 4. m9-pb-04 — Un autocall année par année — N1                      */
/* ------------------------------------------------------------------ */
const autocallDeroule: ProblemeMoule = {
  id: 'm9-pb-04', moduleId: M9,
  titre: 'Un autocall année par année',
  titreEn: 'An autocall, year by year',
  typeDeCas: 'mécanique autocall',
  typeDeCasEn: 'autocall mechanics',
  difficulte: 1,
  scenarios: ["Le client qui reçoit son avis de remboursement anticipé (Euro Stoxx 50)", 'Le conseiller qui déroule le produit au téléphone (CAC 40)', "La candidate au jury et l'Athena sur une action française"],
  scenariosEn: ['The client who receives his early-redemption notice (Euro Stoxx 50)', 'The adviser walking through the product on the phone (CAC 40)', 'The jury candidate and the Athena on a French stock'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : niveau initial, coupon, taux, barrière de protection.
    const cfg = ([
      { s0Min: 80, s0Max: 104, s0Pas: 50, cMin: 11, cMax: 17, rMin: 2.5, rMax: 4.5, prot: 60 },
      { s0Min: 68, s0Max: 82, s0Pas: 100, cMin: 10, cMax: 14, rMin: 2.5, rMax: 3.8, prot: 65 },
      { s0Min: 80, s0Max: 120, s0Pas: 1, cMin: 12, cMax: 18, rMin: 3.0, rMax: 5.0, prot: 60 },
    ] as const)[sIdx];
    const s0 = randInt(rng, cfg.s0Min, cfg.s0Max) * cfg.s0Pas;
    const c = randInt(rng, cfg.cMin, cfg.cMax) * 0.5;   // coupon par an, pas de 0,5
    const r = randFloat(rng, cfg.rMin, cfg.rMax, 1);
    const k = pick(rng, [2, 3, 4] as const);            // année du rappel
    // Trajectoire rappelée : sous la barrière avant k, au-dessus en k.
    const obs: number[] = [];
    for (let i = 1; i <= 5; i++) {
      const pctNiveau = i < k ? randFloat(rng, 80, 99, 0)
        : i === k ? randFloat(rng, 101, 118, 0)
          : randFloat(rng, 80, 99, 0); // après le rappel : ignoré par la mécanique
      obs.push(Math.round((s0 * pctNiveau) / 100));
    }
    // Trajectoire alternative : jamais rappelée, maturité sous la barrière de protection.
    const obsAlt: number[] = [];
    for (let i = 1; i <= 4; i++) obsAlt.push(Math.round((s0 * randFloat(rng, 72, 98, 0)) / 100));
    obsAlt.push(Math.round((s0 * randFloat(rng, cfg.prot - 22, cfg.prot - 3, 0)) / 100));
    const params = { barriereRappelPct: 100, couponPct: c, barriereProtectionPct: cfg.prot, rPct: r, dtAnnees: 1, nbPeriodes: 5 };
    const res = payoffAutocall(obs, s0, params);
    const resAlt = payoffAutocall(obsAlt, s0, params);
    const flux = r2(res.flux);
    const fluxAct = r2(res.fluxActualise);
    const rembAlt = r2(resAlt.flux);

    const { en, f, pct } = outils(langue);
    const obsTxt = obs.slice(0, k).map((v, i) => `${en ? 'year' : 'année'} ${i + 1} : ${f(v, 0)}`).join(' ; ');
    const desc = en
      ? `5-year Athena on the underlying at ${f(s0, 0)} initially; annual observations; autocall trigger at 100% of the initial level; memory coupon ${pct(c, 1)} per year; protection barrier ${pct(cfg.prot, 0)} observed at maturity only; risk-free rate ${pct(r, 1)}. Recorded observations — ${obsTxt}`
      : `Athena 5 ans sur le sous-jacent à ${f(s0, 0)} au départ ; observations annuelles ; barrière de rappel à 100 % du niveau initial ; coupon mémoire ${pct(c, 1)} par an ; barrière de protection ${pct(cfg.prot, 0)} observée à maturité seulement ; taux sans risque ${pct(r, 1)}. Observations relevées — ${obsTxt}`;
    const contexte = (en
      ? [
        `The letter says "early redemption" and the client wants to understand every line before cashing the transfer: ${desc}. Walk the product year by year: when it is called, what it pays (memory effect included), what that flow is worth discounted to day one — and what the OTHER life of the product, the one that goes to maturity below the barrier, would have paid.`,
        `On the phone, a client is about to sign and the adviser has promised to run the machine live, with the recorded history: ${desc}. Year by year: the recall date, the single flow with its caught-up coupons, its discounted value — then the dark scenario the brochure prints in footnotes.`,
        `The jury hands the candidate an Athena on a French stock and a filled-in observation table: ${desc}. Expected: the exact mechanics — no coupon before the recall, everything caught up at the recall — the discounting of the flow, and the degraded redemption of the never-recalled twin product.`,
      ]
      : [
        `La lettre dit « remboursement anticipé » et le client veut comprendre chaque ligne avant d'encaisser le virement : ${desc}. Déroulez le produit année par année : quand il est rappelé, ce qu'il verse (effet mémoire compris), ce que vaut ce flux actualisé au jour 1 — et ce qu'aurait payé l'AUTRE vie du produit, celle qui va à maturité sous la barrière.`,
        `Au téléphone, un client s'apprête à signer et le conseiller a promis de faire tourner la machine en direct, avec l'historique relevé : ${desc}. Année par année : la date du rappel, le flux unique avec ses coupons rattrapés, sa valeur actualisée — puis le scénario noir que la brochure imprime en note de bas de page.`,
        `Le jury tend à la candidate un Athena sur une action française et un tableau d'observations rempli : ${desc}. Attendu : la mécanique exacte — pas de coupon avant le rappel, tout rattrapé au rappel —, l'actualisation du flux, et le remboursement dégradé du produit jumeau jamais rappelé.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The recall date' : 'a) La date du rappel',
          enonce: en
            ? `The trigger is at 100% of the initial level (${f(s0, 0)}). At which observation date (1 to 5) is the product automatically called?`
            : `La barrière de rappel est à 100 % du niveau initial (${f(s0, 0)}). À quelle date d'observation (1 à 5) le produit est-il automatiquement rappelé ?`,
          reponse: k, tolerance: 0.001, toleranceMode: 'absolu',
          etapes: [{
            titre: en ? 'One test per anniversary: S_i ≥ initial level?' : 'Un test par anniversaire : S_i ≥ niveau initial ?',
            contenu: en
              ? `${obs.slice(0, k - 1).map((v, i) => `Year ${i + 1}: ${f(v, 0)} < ${f(s0, 0)}, no recall, no coupon — but the memory keeps count.`).join(' ')} Year ${k}: ${f(obs[k - 1], 0)} ≥ ${f(s0, 0)} — **automatic recall at date ${f(k, 0)}**, nobody decides anything. Between two observations, the product sleeps: dipping below the trigger mid-life cancels NOTHING, only the anniversary snapshots count.`
              : `${obs.slice(0, k - 1).map((v, i) => `Année ${i + 1} : ${f(v, 0)} < ${f(s0, 0)}, pas de rappel, pas de coupon — mais la mémoire garde le compte.`).join(' ')} Année ${k} : ${f(obs[k - 1], 0)} ≥ ${f(s0, 0)} — **rappel automatique à la date ${f(k, 0)}**, personne ne décide rien. Entre deux observations, le produit dort : passer sous la barrière en cours de vie n'annule RIEN, seules les photos d'anniversaire comptent.`,
          }],
          pieges: [en
            ? `Believing the product is "cancelled" because year 1 printed ${f(obs[0], 0)}, below the trigger: the recall barrier tests each date independently — only the PROTECTION barrier threatens the capital, and only at maturity.`
            : `Croire le produit « annulé » parce que l'année 1 affiche ${f(obs[0], 0)}, sous la barrière : la barrière de rappel se teste date par date — seule la barrière de PROTECTION menace le capital, et seulement à maturité.`],
        },
        {
          intitule: en ? 'b) The single flow, memory included' : 'b) Le flux unique, mémoire comprise',
          enonce: en
            ? `At the recall of a), what does the client receive per 100 of par — capital plus caught-up coupons?`
            : `Au rappel du a), que reçoit le client pour 100 de nominal — capital plus coupons rattrapés ?`,
          reponse: flux, tolerance: 0.005, unite: en ? '% of par' : '% du nominal',
          etapes: [{
            titre: en ? 'Flow = 100 + coupon × recall year' : 'Flux = 100 + coupon × année du rappel',
            contenu: en
              ? `Flow = 100 + ${f(c, 1)} × ${f(k, 0)} = **${f(flux, 2)}**. The memory effect catches up the ${f(k - 1, 0)} blank year${k > 2 ? 's' : ''} in one payment: ${f(k, 0)} coupons at once, then the product disappears — observations ${f(k + 1, 0)} to 5 will never exist. Annualised: ${pct(r2((Math.pow(flux / 100, 1 / k) - 1) * 100), 2)} compounded — the memory catches up, it never improves the annual rate.`
              : `Flux = 100 + ${f(c, 1)} × ${f(k, 0)} = **${f(flux, 2)}**. L'effet mémoire rattrape ${k - 1 > 1 ? 'les' : "l'"} ${f(k - 1, 0)} année${k > 2 ? 's' : ''} blanche${k > 2 ? 's' : ''} en un versement : ${f(k, 0)} coupons d'un coup, puis le produit disparaît — les observations ${f(k + 1, 0)} à 5 n'existeront jamais. En annualisé : ${pct(r2((Math.pow(flux / 100, 1 / k) - 1) * 100), 2)} composés — la mémoire rattrape, elle n'améliore jamais le taux annuel.`,
          }],
          pieges: [en
            ? `Paying a coupon for every year the underlying was above the PROTECTION barrier: no recall, no coupon — the protection barrier protects the capital, it never pays coupons.`
            : `Verser un coupon pour chaque année où le sous-jacent était au-dessus de la barrière de PROTECTION : pas de rappel, pas de coupon — la barrière de protection protège le capital, elle ne paie jamais de coupon.`],
        },
        {
          intitule: en ? 'c) The flow, discounted to day one' : 'c) Le flux, actualisé au jour 1',
          enonce: en
            ? `Discounting continuously at ${pct(r, 1)}, what is the flow of b), received in year ${f(k, 0)}, worth at issue date, in % of par?`
            : `En actualisant en continu à ${pct(r, 1)}, que vaut le flux du b), reçu à l'année ${f(k, 0)}, à la date d'émission, en % du nominal ?`,
          reponse: fluxAct, tolerance: 0.005, unite: en ? '% of par' : '% du nominal',
          etapes: [{
            titre: en ? 'flow × e^{−r·τ}: one flow, one date, one discount' : 'flux × e^{−r·τ} : un flux, une date, un facteur',
            contenu: en
              ? `Discounted value = ${f(flux, 2)} × e^(−${f(r / 100, 3)} × ${f(k, 0)}) = **${f(fluxAct, 2)}**. This is exactly what the Monte-Carlo pricer does to EACH simulated trajectory: apply the recall mechanics, find the (random) date of the single flow, discount it continuously to today, then average. The price of the autocall is the mean of thousands of numbers built like this one.`
              : `Valeur actualisée = ${f(flux, 2)} × e^(−${f(r / 100, 3)} × ${f(k, 0)}) = **${f(fluxAct, 2)}**. C'est exactement ce que le pricer Monte-Carlo fait subir à CHAQUE trajectoire simulée : appliquer la mécanique de rappel, trouver la date (aléatoire) du flux unique, l'actualiser en continu à aujourd'hui, puis moyenner. Le prix de l'autocall est la moyenne de milliers de nombres construits comme celui-ci.`,
          }],
          pieges: [en
            ? `Discounting over 5 years because "it is a 5-year product": the flow falls in year ${f(k, 0)} — the duration of an autocall is random, short when markets rise, long when they fall.`
            : `Actualiser sur 5 ans parce que « c'est un produit 5 ans » : le flux tombe à l'année ${f(k, 0)} — la duration d'un autocall est aléatoire, courte quand le marché monte, longue quand il baisse.`],
        },
        {
          intitule: en ? `d) The other life: never recalled, finish at ${f(obsAlt[4], 0)}` : `d) L'autre vie : jamais rappelé, arrivée à ${f(obsAlt[4], 0)}`,
          enonce: en
            ? `Twin product, other history: never at or above ${f(s0, 0)} on any anniversary, and the underlying finishes at ${f(obsAlt[4], 0)} at maturity — below the ${pct(cfg.prot, 0)} barrier (${f(r2(s0 * cfg.prot / 100), 0)}). What does the client get per 100 of par?`
            : `Produit jumeau, autre histoire : jamais au niveau de ${f(s0, 0)} à aucun anniversaire, et le sous-jacent finit à ${f(obsAlt[4], 0)} à maturité — sous la barrière de ${pct(cfg.prot, 0)} (${f(r2(s0 * cfg.prot / 100), 0)}). Que touche le client pour 100 de nominal ?`,
          reponse: rembAlt, tolerance: 0.005, unite: en ? '% of par' : '% du nominal',
          etapes: [
            {
              titre: en ? 'Barrier breached: redemption = 100 × S_N/S_0' : 'Barrière enfoncée : remboursement = 100 × S_N/S_0',
              contenu: en
                ? `${f(obsAlt[4], 0)} < ${f(r2(s0 * cfg.prot / 100), 0)}: the protection dies. Redemption = 100 × ${f(obsAlt[4], 0)}/${f(s0, 0)} = **${f(rembAlt, 2)}** — the ENTIRE loss from the initial level, ${pct(r2(rembAlt - 100), 2)}, after five years without a single coupon. This clause IS a down-and-in put sold by the client: this is where the coupon's yield was hiding all along.`
                : `${f(obsAlt[4], 0)} < ${f(r2(s0 * cfg.prot / 100), 0)} : la protection meurt. Remboursement = 100 × ${f(obsAlt[4], 0)}/${f(s0, 0)} = **${f(rembAlt, 2)}** — la perte ENTIÈRE depuis le niveau initial, ${pct(r2(rembAlt - 100), 2)}, après cinq ans sans un seul coupon. Cette clause EST un put down-and-in vendu par le client : c'est là que le rendement du coupon se cachait depuis le début.`,
            },
            {
              titre: en ? 'The cliff, one point of index apart' : 'La falaise, à un point d\'indice près',
              contenu: en
                ? `Had the underlying finished just ABOVE ${f(r2(s0 * cfg.prot / 100), 0)}, the client would collect 100 — no coupon, but no loss. ${f(rembAlt, 2)} on one side, 100 on the other: the protection at ${pct(cfg.prot, 0)} is not a cushion, it is a CLIFF — and around it the desk's delta and gamma explode (chapter 5).`
                : `Si le sous-jacent avait fini juste AU-DESSUS de ${f(r2(s0 * cfg.prot / 100), 0)}, le client toucherait 100 — pas de coupon, mais pas de perte. ${f(rembAlt, 2)} d'un côté, 100 de l'autre : la protection à ${pct(cfg.prot, 0)} n'est pas un amortisseur, c'est une FALAISE — et autour d'elle le delta et le gamma du desk explosent (chapitre 5).`,
            },
          ],
          pieges: [en
            ? `Believing the loss only starts at the barrier: below it, the client takes the FULL fall from ${f(s0, 0)}, not just the part below the barrier — at ${pct(cfg.prot, 0)} minus one point, the loss is already ${pct(r2(100 - cfg.prot + 1), 0)}, not 1%.`
            : `Croire que la perte ne commence qu'à la barrière : sous la barrière, le client subit la chute ENTIÈRE depuis ${f(s0, 0)}, pas seulement la part sous la barrière — à ${pct(cfg.prot, 0)} moins un point, la perte est déjà de ${pct(r2(100 - cfg.prot + 1), 0)}, pas de 1 %.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 5. m9-pb-05 — Le structureur résout la participation — N2           */
/* ------------------------------------------------------------------ */
const structureurParticipation: ProblemeMoule = {
  id: 'm9-pb-05', moduleId: M9,
  titre: 'Le structureur résout la participation : du budget au call spread',
  typeDeCas: 'structuration capital garanti',
  titreEn: 'The structurer solves for participation: from budget to call spread',
  typeDeCasEn: 'guaranteed-note structuring',
  difficulte: 2,
  scenarios: ['Le distributeur exige une participation à trois chiffres', 'Le comité marketing refuse une vitrine sous les 70 %', "L'appel d'offres de l'assureur-vie"],
  scenariosEn: ['The distributor demands a three-digit participation', 'The marketing committee rejects any shop window below 70%', "The life insurer's tender"],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : taux, maturité, marge, volatilité, niveau du cap.
    const cfg = ([
      { rMin: 3.0, rMax: 4.5, T: 5, mMin: 0.8, mMax: 1.2, vMin: 17, vMax: 20, cap: 130 },
      { rMin: 2.8, rMax: 3.6, T: 6, mMin: 1.0, mMax: 1.5, vMin: 18, vMax: 22, cap: 125 },
      { rMin: 3.4, rMax: 4.4, T: 5, mMin: 0.6, mMax: 1.0, vMin: 19, vMax: 23, cap: 140 },
    ] as const)[sIdx];
    const r = randFloat(rng, cfg.rMin, cfg.rMax, 1);
    const marge = randFloat(rng, cfg.mMin, cfg.mMax, 1);
    const vol = randInt(rng, cfg.vMin, cfg.vMax);
    const T = cfg.T;
    const cap = cfg.cap;
    const zc = r2(prixZeroCoupon(r, T));
    const budget = r2(budgetOptions(zc, marge));
    const callAtm = r2(blackScholesCall(100, 100, r, vol, T));
    const partVan = r2(100 * participationCapitalGaranti(budget, callAtm));
    const callCap = r2(blackScholesCall(100, cap, r, vol, T));
    const spread = r2(callAtm - callCap);
    const partSpread = r2(100 * participationCapitalGaranti(budget, spread));
    const gainMax = r2((partSpread / 100) * (cap - 100));

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `${f(T, 0)}-year guaranteed note, rate ${pct(r, 1)}, margin ${pct(marge, 1)}, index volatility ${pct(vol, 0)}; the options desk quotes the ATM call (strike 100) at ${pct(callAtm, 2)} of par and the strike-${f(cap, 0)} call at ${pct(callCap, 2)}`
      : `note garantie ${f(T, 0)} ans, taux ${pct(r, 1)}, marge ${pct(marge, 1)}, volatilité de l'indice ${pct(vol, 0)} ; le desk options cote le call ATM (strike 100) à ${pct(callAtm, 2)} du nominal et le call de strike ${f(cap, 0)} à ${pct(callCap, 2)}`;
    const contexte = (en
      ? [
        `The distribution network wants a number that "pops" on the brochure — at least 100% participation — and the structurer must deliver without touching the guarantee: ${desc}. First price what the budget honestly buys, then engineer the classic patch: sell the strike-${f(cap, 0)} call against the ATM call, and measure exactly what the shop window gains — and what the client silently gives up.`,
        `Marketing has spoken: below 70% of the upside, the product does not launch. The structurer opens his toolbox: ${desc}. The vanilla division first, then the call spread that flatters the ratio — with the asterisk quantified: the cap on the client's maximum gain.`,
        `A life insurer tenders for a guaranteed fund and compares shop windows; the structurer wants to win without lying: ${desc}. His pitch: the honest participation, the boosted one via the ${f(cap, 0)} cap, and the maximum gain figure that the fine print must display.`,
      ]
      : [
        `Le réseau de distribution veut un chiffre qui « claque » sur la brochure — au moins 100 % de participation — et le structureur doit livrer sans toucher à la garantie : ${desc}. Pricez d'abord ce que le budget achète honnêtement, puis fabriquez la rustine classique : vendre le call de strike ${f(cap, 0)} contre le call ATM, et mesurez exactement ce que la vitrine gagne — et ce que le client abandonne en silence.`,
        `Le marketing a tranché : sous 70 % de la hausse, le produit ne sort pas. Le structureur ouvre sa boîte à outils : ${desc}. La division vanille d'abord, puis le call spread qui embellit le ratio — avec l'astérisque chiffrée : le plafond du gain maximal du client.`,
        `Un assureur-vie lance un appel d'offres pour un fonds garanti et compare les vitrines ; le structureur veut gagner sans mentir : ${desc}. Son argumentaire : la participation honnête, celle dopée par le cap à ${f(cap, 0)}, et le chiffre de gain maximal que les petites lignes devront afficher.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The raw material: the budget' : 'a) La matière première : le budget',
          enonce: en
            ? `Rate ${pct(r, 1)}, ${f(T, 0)} years, margin ${pct(marge, 1)}. What option budget does the structurer hold, in % of par?`
            : `Taux ${pct(r, 1)}, ${f(T, 0)} ans, marge ${pct(marge, 1)}. Quel budget d'options le structureur tient-il, en % du nominal ?`,
          reponse: budget, tolerance: 0.005, unite: en ? '% of par' : '% du nominal',
          etapes: [{
            titre: en ? 'Budget = 100 − ZC − margin' : 'Budget = 100 − ZC − marge',
            contenu: en
              ? `ZC = $100 \\cdot e^{-rT}$ = ${f(zc, 2)}; budget = 100 − ${f(zc, 2)} − ${f(marge, 1)} = **${f(budget, 2)}** % of par. This is the structurer's entire purchasing power: every promise of the formula must be bought with it, at the option desk's prices.`
              : `ZC = $100 \\cdot e^{-rT}$ = ${f(zc, 2)} ; budget = 100 − ${f(zc, 2)} − ${f(marge, 1)} = **${f(budget, 2)}** % du nominal. C'est tout le pouvoir d'achat du structureur : chaque promesse de la formule devra s'acheter avec, aux prix du desk d'options.`,
          }],
        },
        {
          intitule: en ? 'b) The honest division: vanilla participation' : 'b) La division honnête : la participation vanille',
          enonce: en
            ? `Spending the whole budget on ATM calls at ${pct(callAtm, 2)}, what participation can be offered, in %?`
            : `En dépensant tout le budget en calls ATM à ${pct(callAtm, 2)}, quelle participation peut-on offrir, en % ?`,
          reponse: partVan, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'p = budget / ATM call' : 'p = budget / call ATM',
            contenu: en
              ? `p = ${f(budget, 2)} / ${f(callAtm, 2)} = **${pct(partVan, 2)}** of the rise — uncapped, unaveraged, undegraded. ${partVan < 70 ? 'Below the marketing bar: hence the patch of c).' : 'Honourable, but the network wants more: hence the patch of c).'} The rule of every patch that follows: buy a CHEAPER option to display a bigger ratio — and degrade the payoff somewhere the big print does not show.`
              : `p = ${f(budget, 2)} / ${f(callAtm, 2)} = **${pct(partVan, 2)}** de la hausse — sans plafond, sans moyenne, sans dégradation. ${partVan < 70 ? 'Sous la barre du marketing : d\'où la rustine du c).' : 'Honorable, mais le réseau veut plus : d\'où la rustine du c).'} La règle de toute rustine à venir : acheter une option MOINS CHÈRE pour afficher un ratio plus gros — et dégrader le payoff là où les gros caractères ne le montrent pas.`,
          }],
          pieges: [en
            ? `Comparing two participations without comparing the two definitions of "the rise": a bigger percentage of a degraded performance can be worth less in almost every scenario (chapter 2).`
            : `Comparer deux participations sans comparer les deux définitions de « la hausse » : un pourcentage plus gros d'une performance dégradée peut valoir moins dans presque tous les scénarios (chapitre 2).`],
        },
        {
          intitule: en ? `c) The patch: sell the ${f(cap, 0)} call` : `c) La rustine : vendre le call ${f(cap, 0)}`,
          enonce: en
            ? `Replace the ATM call with the 100/${f(cap, 0)} call spread: buy the ATM call at ${pct(callAtm, 2)}, sell the ${f(cap, 0)} call at ${pct(callCap, 2)}. What participation does the SAME budget now display, in %?`
            : `Remplacez le call ATM par le call spread 100/${f(cap, 0)} : achat du call ATM à ${pct(callAtm, 2)}, vente du call ${f(cap, 0)} à ${pct(callCap, 2)}. Quelle participation le MÊME budget affiche-t-il désormais, en % ?`,
          reponse: partSpread, tolerance: 0.005, unite: '%',
          etapes: [
            {
              titre: en ? 'The sold leg refunds part of the premium' : 'La jambe vendue rembourse une partie de la prime',
              contenu: en
                ? `Spread price = ${f(callAtm, 2)} − ${f(callCap, 2)} = ${f(spread, 2)}; participation = ${f(budget, 2)} / ${f(spread, 2)} = **${pct(partSpread, 2)}** — against ${pct(partVan, 2)} vanilla. Module 8 grammar: every sold leg reduces the cost and abandons a piece of the profile. Here the abandoned piece is everything above +${f(cap - 100, 0)}%.`
                : `Prix du spread = ${f(callAtm, 2)} − ${f(callCap, 2)} = ${f(spread, 2)} ; participation = ${f(budget, 2)} / ${f(spread, 2)} = **${pct(partSpread, 2)}** — contre ${pct(partVan, 2)} en vanille. Grammaire du module 8 : toute jambe vendue réduit le coût et abandonne un morceau du profil. Ici le morceau abandonné est tout ce qui dépasse +${f(cap - 100, 0)} %.`,
            },
            {
              titre: en ? 'Same budget, two shop windows' : 'Même budget, deux vitrines',
              contenu: en
                ? `Nothing changed on the funding side: same ${f(budget, 2)} of budget, same guarantee, same margin. Only the option bought changed — the ratio ${partSpread >= 100 ? 'now exceeds 100%' : 'jumped'} because the denominator shrank. The participation is a RELATIVE price, never a generosity meter.`
                : `Rien n'a bougé côté financement : même budget de ${f(budget, 2)}, même garantie, même marge. Seule l'option achetée a changé — le ratio ${partSpread >= 100 ? 'dépasse désormais 100 %' : 'a bondi'} parce que le dénominateur a fondu. La participation est un prix RELATIF, jamais un compteur de générosité.`,
            },
          ],
          pieges: [en
            ? `Announcing "${pct(partSpread, 0)} of the rise" without the asterisk: it is ${pct(partSpread, 0)} of a rise CAPPED at +${f(cap - 100, 0)}% — the uncapped sentence describes a product that was never built.`
            : `Annoncer « ${pct(partSpread, 0)} de la hausse » sans l'astérisque : c'est ${pct(partSpread, 0)} d'une hausse PLAFONNÉE à +${f(cap - 100, 0)} % — la phrase sans plafond décrit un produit qui n'a jamais été fabriqué.`],
        },
        {
          intitule: en ? 'd) The asterisk, quantified: the maximum gain' : "d) L'astérisque, chiffrée : le gain maximal",
          enonce: en
            ? `With the participation of c) and the cap at ${f(cap, 0)}, what is the client's maximum possible gain above par, in % of par?`
            : `Avec la participation du c) et le plafond à ${f(cap, 0)}, quel est le gain maximal possible du client au-delà du nominal, en % du nominal ?`,
          reponse: gainMax, tolerance: 0.005, unite: en ? '% of par' : '% du nominal',
          etapes: [
            {
              titre: en ? 'Max gain = participation × (cap − 100)' : 'Gain max = participation × (cap − 100)',
              contenu: en
                ? `Max gain = ${f(partSpread / 100, 4)} × ${f(cap - 100, 0)} = **${pct(gainMax, 2)}** — reached as soon as the index gains ${f(cap - 100, 0)}%; beyond, the sold call confiscates everything. Redemption ceiling: ${f(r2(100 + gainMax), 2)}.`
                : `Gain max = ${f(partSpread / 100, 4)} × ${f(cap - 100, 0)} = **${pct(gainMax, 2)}** — atteint dès que l'indice gagne ${f(cap - 100, 0)} % ; au-delà, le call vendu confisque tout. Plafond de remboursement : ${f(r2(100 + gainMax), 2)}.`,
            },
            {
              titre: en ? 'The cross-check that settles the sales debate' : 'La contre-épreuve qui tranche le débat commercial',
              contenu: en
                ? `On a big rally — say +${f(Math.max(cap - 100 + 20, 40), 0)}% — the vanilla note pays ${f(r2(partVan / 100 * Math.max(cap - 100 + 20, 40)), 2)} versus ${f(gainMax, 2)} capped: the "smaller" ${pct(partVan, 0)} beats the "bigger" ${pct(partSpread, 0)}. One never compares two percentages; one compares two formulas — the reflex to bring to the term sheets of chapter 7.`
                : `Sur un gros rallye — disons +${f(Math.max(cap - 100 + 20, 40), 0)} % — la note vanille paie ${f(r2(partVan / 100 * Math.max(cap - 100 + 20, 40)), 2)} contre ${f(gainMax, 2)} plafonné : le « petit » ${pct(partVan, 0)} bat le « gros » ${pct(partSpread, 0)}. On ne compare jamais deux pourcentages ; on compare deux formules — le réflexe à emporter vers les term sheets du chapitre 7.`,
            },
          ],
          pieges: [en
            ? `Multiplying the participation by the cap LEVEL (${f(cap, 0)}) instead of the capped RISE (${f(cap - 100, 0)}): the spread pays the performance between 100 and ${f(cap, 0)}, not the level.`
            : `Multiplier la participation par le NIVEAU du cap (${f(cap, 0)}) au lieu de la HAUSSE plafonnée (${f(cap - 100, 0)}) : le spread paie la performance entre 100 et ${f(cap, 0)}, pas le niveau.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 6. m9-pb-06 — Reverse convertible à barrière — N2                   */
/* ------------------------------------------------------------------ */
const reverseBarriere: ProblemeMoule = {
  id: 'm9-pb-06', moduleId: M9,
  titre: 'Reverse convertible à barrière : le curseur commercial',
  titreEn: 'Barrier reverse convertible: the commercial dial',
  typeDeCas: 'options à barrière',
  typeDeCasEn: 'barrier options',
  difficulte: 2,
  scenarios: ["Le desk compare vanille et barrière pour le réseau (pétrolière, marché calme)", 'La cliente veut « du coupon ET de la protection » (banque, vol moyenne)', "Le produit sur une action « à histoire » (biotech, vol haute)"],
  scenariosEn: ['The desk compares vanilla and barrier for the network (oil major, calm market)', 'The client wants "coupon AND protection" (bank stock, medium vol)', 'The product on a "story stock" (biotech, high vol)'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Paramètres de marché DISCRETS par scénario ; fourchettes du prix du DIP
    // vérifiées hors-ligne contre prixDownAndInPutMC (graine 42, n = 100 000,
    // observation quotidienne) : voir l'en-tête du fichier.
    const cfgListe: { r: number; vol: number; dips: { B: number; lo: number; hi: number }[] }[] = [
      { r: 5, vol: 20, dips: [{ B: 70, lo: 1.36, hi: 1.56 }, { B: 80, lo: 3.66, hi: 3.96 }] },
      { r: 3, vol: 25, dips: [{ B: 60, lo: 1.38, hi: 1.60 }, { B: 70, lo: 4.05, hi: 4.38 }] },
      { r: 4, vol: 30, dips: [{ B: 60, lo: 3.06, hi: 3.42 }, { B: 70, lo: 6.28, hi: 6.70 }] },
    ];
    const cfg = cfgListe[sIdx];
    const choix = pick(rng, cfg.dips);
    const B = choix.B;
    const dip = randFloat(rng, choix.lo, choix.hi, 2);
    const sT = randInt(rng, Math.max(B - 15, 40), 94);
    const r = cfg.r;
    const vol = cfg.vol;
    const T = 1;
    const putVan = r2(blackScholesPut(100, 100, r, vol, T));
    const couponVan = r2(couponReverseConvertible(putVan, r, T));
    const couponDip = r2(couponReverseConvertible(dip, r, T));
    const ecart = r2(couponVan - couponDip);
    const totalDown = r2(sT + couponDip);

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `1-year note on the stock (initial level rebased to 100, strike 100), risk-free rate ${pct(r, 0)}, volatility ${pct(vol, 0)}; the desk's Black-Scholes puts the vanilla ATM put at ${pct(putVan, 2)} of par, and the Monte-Carlo pricer (daily observation) puts the down-and-in put of barrier ${f(B, 0)} at ${pct(dip, 2)}`
      : `note à 1 an sur l'action (niveau initial rebasé à 100, strike 100), taux sans risque ${pct(r, 0)}, volatilité ${pct(vol, 0)} ; le Black-Scholes du desk donne le put ATM vanille à ${pct(putVan, 2)} du nominal, et le pricer Monte-Carlo (observation quotidienne) donne le put down-and-in de barrière ${f(B, 0)} à ${pct(dip, 2)}`;
    const contexte = (en
      ? [
        `The network found the vanilla reverse convertible "too brutal" and asks for the barrier version; the desk runs both, side by side: ${desc}. Compute the two fair coupons, price the protection the barrier really buys — then settle the scenario the brochure never details: barrier touched in a spring sell-off, stock finishing at ${f(sT, 0)}.`,
        `"I want the coupon AND my capital protected" — the client's sentence every desk knows by heart. The structurer answers with the dial: ${desc}. Show her what the vanilla coupon pays, what the barrier-${f(B, 0)} coupon pays, what the difference buys — and what happens when the protection is conditional and the condition fails (barrier touched, finish at ${f(sT, 0)}).`,
        `A "story stock", ${pct(vol, 0)} of volatility: the put premium is fat and the network smells a big coupon: ${desc}. The desk's homework: fair coupon without barrier, fair coupon with the ${f(B, 0)} barrier, the price of the conditional protection — and the settlement when the story goes wrong (barrier touched, stock at ${f(sT, 0)} at maturity).`,
      ]
      : [
        `Le réseau a trouvé le reverse convertible vanille « trop brutal » et demande la version à barrière ; le desk fait tourner les deux, côte à côte : ${desc}. Calculez les deux coupons équitables, pricez la protection que la barrière achète vraiment — puis réglez le scénario que la brochure ne détaille jamais : barrière touchée dans un trou d'air de printemps, action finissant à ${f(sT, 0)}.`,
        `« Je veux le coupon ET mon capital protégé » — la phrase de cliente que tout desk connaît par cœur. Le structureur répond avec le curseur : ${desc}. Montrez-lui ce que paie le coupon vanille, ce que paie le coupon à barrière ${f(B, 0)}, ce que l'écart achète — et ce qui arrive quand la protection est conditionnelle et que la condition saute (barrière touchée, arrivée à ${f(sT, 0)}).`,
        `Une action « à histoire », ${pct(vol, 0)} de volatilité : la prime du put est grasse et le réseau flaire le gros coupon : ${desc}. Le devoir du desk : coupon équitable sans barrière, coupon équitable avec la barrière ${f(B, 0)}, le prix de la protection conditionnelle — et le règlement quand l'histoire tourne mal (barrière touchée, action à ${f(sT, 0)} à maturité).`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The vanilla coupon' : 'a) Le coupon vanille',
          enonce: en
            ? `Selling the vanilla ATM put at ${pct(putVan, 2)}, what fair annual coupon does the decomposition finance, in %?`
            : `En vendant le put ATM vanille à ${pct(putVan, 2)}, quel coupon annuel équitable la décomposition finance-t-elle, en % ?`,
          reponse: couponVan, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'coupon = (100 − ZC + premium) / e^{−rT} / T' : 'coupon = (100 − ZC + prime) / e^{−rT} / T',
            contenu: en
              ? `ZC = ${f(r2(prixZeroCoupon(r, T)), 2)}; proceeds = 100 − ${f(r2(prixZeroCoupon(r, T)), 2)} + ${f(putVan, 2)}, capitalised one year: coupon = **${pct(couponVan, 2)}**. The full-risk version: the client insures the entire fall of the stock, from the first euro below the strike.`
              : `ZC = ${f(r2(prixZeroCoupon(r, T)), 2)} ; disponible = 100 − ${f(r2(prixZeroCoupon(r, T)), 2)} + ${f(putVan, 2)}, capitalisé un an : coupon = **${pct(couponVan, 2)}**. La version plein risque : le client assure toute la chute de l'action, dès le premier euro sous le strike.`,
          }],
        },
        {
          intitule: en ? `b) The barrier-${f(B, 0)} coupon` : `b) Le coupon à barrière ${f(B, 0)}`,
          enonce: en
            ? `The pricer values the down-and-in put of barrier ${f(B, 0)} at ${pct(dip, 2)}. Same decomposition: what fair annual coupon does THIS premium finance, in %?`
            : `Le pricer valorise le put down-and-in de barrière ${f(B, 0)} à ${pct(dip, 2)}. Même décomposition : quel coupon annuel équitable CETTE prime finance-t-elle, en % ?`,
          reponse: couponDip, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'A put that must be born is worth less' : 'Un put qui doit naître vaut moins',
            contenu: en
              ? `Coupon = (100 − ZC + ${f(dip, 2)}) capitalised = **${pct(couponDip, 2)}**. The DIP pays like the vanilla IF the stock has touched ${f(B, 0)} at some point, zero otherwise: its payoff is ≤ the vanilla's on every trajectory, so its price is lower (${f(dip, 2)} against ${f(putVan, 2)}) — and the coupon melts with it. No model needed for the inequality: an asset that pays less everywhere is worth less today.`
              : `Coupon = (100 − ZC + ${f(dip, 2)}) capitalisé = **${pct(couponDip, 2)}**. Le DIP paie comme la vanille SI l'action a touché ${f(B, 0)} à un moment quelconque, zéro sinon : son payoff est ≤ celui de la vanille sur chaque trajectoire, donc son prix est plus bas (${f(dip, 2)} contre ${f(putVan, 2)}) — et le coupon fond avec. Aucun modèle pour l'inégalité : un actif qui paie moins partout vaut moins aujourd'hui.`,
          }],
          pieges: [en
            ? `A barrier is a level PLUS an observation frequency: observed at maturity only, the same DIP would be much cheaper still — at equal coupon, a continuously observed barrier makes the client sell a dearer put (chapter 5).`
            : `Une barrière est un niveau PLUS une fréquence d'observation : observée à maturité seulement, le même DIP vaudrait bien moins encore — à coupon égal, une barrière observée en continu fait vendre au client un put plus cher (chapitre 5).`],
        },
        {
          intitule: en ? 'c) What the protection costs' : 'c) Ce que coûte la protection',
          enonce: en
            ? `From a) and b), how many coupon points does the conditional protection cost, in points of annual coupon?`
            : `À partir du a) et du b), combien de points de coupon la protection conditionnelle coûte-t-elle, en points de coupon annuel ?`,
          reponse: ecart, tolerance: 0.02, toleranceMode: 'absolu', unite: en ? 'coupon points' : 'points de coupon',
          etapes: [
            {
              titre: en ? 'The dial: protection against coupon, one frontier' : 'Le curseur : protection contre coupon, une seule frontière',
              contenu: en
                ? `${f(couponVan, 2)} − ${f(couponDip, 2)} = **${f(ecart, 2)} points** per year. The barrier is a commercial dial on one frontier: lower barrier ⇒ more probable protection ⇒ cheaper put sold ⇒ thinner coupon. There is NO setting that gives both the fat coupon and the real protection — distrust any product that claims otherwise.`
                : `${f(couponVan, 2)} − ${f(couponDip, 2)} = **${f(ecart, 2)} points** par an. La barrière est un curseur commercial sur une même frontière : barrière plus basse ⇒ protection plus probable ⇒ put vendu moins cher ⇒ coupon plus maigre. Il n'existe AUCUN réglage donnant à la fois le gros coupon et la vraie protection — méfiez-vous du produit qui prétend le contraire.`,
            },
            {
              titre: en ? 'Small premium never means small risk' : 'Petite prime ne veut jamais dire petit risque',
              contenu: en
                ? `The ${f(dip, 2)} premium looks harmless because the barrier event is rare — but conditionally on touching, the stock that crossed −${f(100 - B, 0)}% does not stop there out of politeness: the client sold CATASTROPHE insurance, rare claim, huge claim. The premium is the probability-weighted average of "collect often" and "lose enormously once".`
                : `La prime de ${f(dip, 2)} a l'air inoffensive parce que l'événement de barrière est rare — mais conditionnellement au toucher, l'action qui a traversé −${f(100 - B, 0)} % ne s'y arrête pas par politesse : le client a vendu une assurance CATASTROPHE, sinistre rare, sinistre énorme. La prime est la moyenne pondérée de « encaisser souvent » et « perdre énormément une fois ».`,
            },
          ],
        },
        {
          intitule: en ? `d) Barrier touched, stock at ${f(sT, 0)}` : `d) Barrière touchée, action à ${f(sT, 0)}`,
          enonce: en
            ? `During the year the stock dipped below ${f(B, 0)} (barrier touched), then finished at ${f(sT, 0)}, below the strike. With the coupon of b), what does the holder collect in total, per 100 of par?`
            : `Dans l'année, l'action est passée sous ${f(B, 0)} (barrière touchée), puis a fini à ${f(sT, 0)}, sous le strike. Avec le coupon du b), que récupère le porteur au total, pour 100 de nominal ?`,
          reponse: totalDown, tolerance: 0.005, unite: en ? '% of par' : '% du nominal',
          etapes: [
            {
              titre: en ? 'Touched once = alive forever' : 'Touchée une fois = née pour toujours',
              contenu: en
                ? `The barrier was touched: the put is BORN, and being born, it works like a vanilla — the finish at ${f(sT, 0)} exercises it against the client. Settlement: one share worth ${f(sT, 0)} plus the coupon ${f(couponDip, 2)} = **${f(totalDown, 2)}**, a P&L of ${f(r2(totalDown - 100), 2)}.`
                : `La barrière a été touchée : le put est NÉ, et une fois né, il fonctionne comme une vanille — l'arrivée à ${f(sT, 0)} l'exerce contre le client. Règlement : une action valant ${f(sT, 0)} plus le coupon ${f(couponDip, 2)} = **${f(totalDown, 2)}**, un P&L de ${f(r2(totalDown - 100), 2)}.`,
            },
            {
              titre: en ? 'The counterfactual that sells the product' : 'Le contrefactuel qui vend le produit',
              contenu: en
                ? `Same finish at ${f(sT, 0)} WITHOUT the barrier ever touched: the put never exists, redemption 100 + ${f(couponDip, 2)} — full capital despite the fall. That clemency is precisely what the client paid ${f(ecart, 2)} coupon points for. But note the trap: "touched then recovered above the barrier" changes NOTHING — in, the put stays in.`
                : `Même arrivée à ${f(sT, 0)} SANS que la barrière ait jamais été touchée : le put n'existe pas, remboursement 100 + ${f(couponDip, 2)} — capital entier malgré la baisse. Cette clémence est exactement ce que le client a payé ${f(ecart, 2)} points de coupon. Mais notez le piège : « touchée puis revenue au-dessus » ne change RIEN — né, le put reste né.`,
            },
          ],
          pieges: [en
            ? `"The stock closed above the barrier at maturity, so the protection held": the down-and-in activates on the MINIMUM of the path (daily observation here), not on the finish line — only the never-touched scenario protects.`
            : `« L'action a fini au-dessus de la barrière, donc la protection a tenu » : le down-and-in s'active sur le MINIMUM de la trajectoire (observation quotidienne ici), pas sur la ligne d'arrivée — seul le scénario jamais-touchée protège.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 7. m9-pb-07 — Reconstituer un term sheet — N2                       */
/* ------------------------------------------------------------------ */
const reconstitutionTermSheet: ProblemeMoule = {
  id: 'm9-pb-07', moduleId: M9,
  titre: 'Reconstituer un term sheet : briques, marge, verdict',
  titreEn: 'Rebuilding a term sheet: bricks, margin, verdict',
  typeDeCas: 'lecture de term sheet',
  typeDeCasEn: 'term-sheet reading',
  difficulte: 2,
  scenarios: ["Le sélectionneur de fonds passe l'« Athéna Rendement » au crible", 'La due diligence du family office avant de signer', "L'oral : « ce document, qu'est-ce que le client vend sans le savoir ? »"],
  scenariosEn: ['The fund selector puts the "Athena Yield" through the wringer', "The family office's due diligence before signing", 'The oral exam: "in this document, what does the client sell without knowing?"'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Paramètres de marché DISCRETS ; fourchettes du prix Monte-Carlo vérifiées
    // hors-ligne contre prixAutocallMC (graine 42, n = 100 000) : voir l'en-tête.
    const cfgListe: { r: number; vol: number; offres: { c: number; lo: number; hi: number }[] }[] = [
      { r: 5, vol: 20, offres: [{ c: 8, lo: 97.32, hi: 97.60 }, { c: 9, lo: 98.52, hi: 98.80 }] },
      { r: 3, vol: 20, offres: [{ c: 7, lo: 97.95, hi: 98.22 }, { c: 7.5, lo: 98.55, hi: 98.80 }] },
      { r: 4, vol: 22, offres: [{ c: 8.5, lo: 97.52, hi: 97.80 }, { c: 9, lo: 98.12, hi: 98.40 }] },
    ];
    const cfg = cfgListe[sIdx];
    const offre = pick(rng, cfg.offres);
    const c = offre.c;
    const prixMC = randFloat(rng, offre.lo, offre.hi, 2);
    const dEff = randFloat(rng, 2.1, 2.5, 1);
    const r = cfg.r;
    const vol = cfg.vol;
    const T = 5;
    const zc = r2(prixZeroCoupon(r, T));
    const margeTot = r2(100 - prixMC);
    const margeFaciale = r2(margeCommercialeAnnualisee(margeTot, T));
    const margeEff = r2(margeTot / dEff);
    const pointsRisque = r2(c - r);

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `"Athena Yield" — issuer: senior unsecured bank debt; underlying: price index (dividends not paid); 5 years, annual observations; autocall trigger 100% of initial level, memory coupon ${pct(c, 1)} per year; protection barrier 60% at maturity only; risk-free rate ${pct(r, 0)}, volatility ${pct(vol, 0)}. The desk's Monte-Carlo pricer values the whole formula at ${f(prixMC, 2)} per 100 paid, and puts the average life at ${f(dEff, 1)} years`
      : `« Athéna Rendement » — émetteur : dette senior non sécurisée de la banque ; sous-jacent : indice de prix (dividendes non versés) ; 5 ans, observations annuelles ; barrière de rappel 100 % du niveau initial, coupon mémoire ${pct(c, 1)} par an ; barrière de protection 60 % à maturité seulement ; taux sans risque ${pct(r, 0)}, volatilité ${pct(vol, 0)}. Le pricer Monte-Carlo du desk valorise toute la formule à ${f(prixMC, 2)} pour 100 payés, et donne une durée de vie moyenne de ${f(dEff, 1)} ans`;
    const contexte = (en
      ? [
        `A fund selector receives the month's best-seller and reads it the way a desk does — issuer first, coupon last: ${desc}. His grid: the funding brick, the total margin hidden in the price, the margin per year of EFFECTIVE life, and the verdict — how many points of coupon are the rent of a risk sold.`,
        `Before signing for its clients, the family office runs its due diligence on the document: ${desc}. Four numbers to put in the memo: what the zero-coupon leg is worth, what the bank pockets at issue, what that margin becomes per year actually lived, and the coupon-versus-rate gap that names the risk.`,
        `Oral exam. The examiner slides the term sheet: "this document — what does the client sell without knowing, and how much does the bank take?" ${desc}. Expected: the bricks (funding + digitals + down-and-in put SOLD by the client), the margin at issue, its honest annualisation, and the reflex sentence about the coupon.`,
      ]
      : [
        `Un sélectionneur de fonds reçoit le best-seller du mois et le lit comme un desk — émetteur d'abord, coupon en dernier : ${desc}. Sa grille : la brique de funding, la marge totale cachée dans le prix, la marge par année de vie EFFECTIVE, et le verdict — combien de points de coupon sont le loyer d'un risque vendu.`,
        `Avant de signer pour ses clients, le family office passe le document à la due diligence : ${desc}. Quatre chiffres pour la note interne : ce que vaut la jambe zéro-coupon, ce que la banque empoche à l'émission, ce que cette marge devient par année réellement vécue, et l'écart coupon-taux qui donne son nom au risque.`,
        `Oral. L'examinateur pousse le term sheet : « ce document — qu'est-ce que le client vend sans le savoir, et combien la banque se paie-t-elle ? » ${desc}. Attendu : les briques (funding + digitales + put down-and-in VENDU par le client), la marge à l'émission, son annualisation honnête, et la phrase réflexe sur le coupon.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The funding brick' : 'a) La brique de funding',
          enonce: en
            ? `At ${pct(r, 0)} over 5 years, what is the zero-coupon that will repay the par worth today, in % of par?`
            : `À ${pct(r, 0)} sur 5 ans, que vaut aujourd'hui le zéro-coupon qui remboursera le nominal, en % du nominal ?`,
          reponse: zc, tolerance: 0.005, unite: en ? '% of par' : '% du nominal',
          etapes: [{
            titre: en ? 'The dissection starts with the firm leg' : 'La dissection commence par la jambe ferme',
            contenu: en
              ? `ZC = $100 \\cdot e^{-rT}$ = **${f(zc, 2)}**. The dissection of the formula: this zero-coupon carries the par; the conditional coupons are a basket of digitals; and the degraded-redemption clause below 60% means the client SOLD a down-and-in put — its premium pays most of the ${pct(c, 1)} coupon. First line of the desk reading: the product is DEBT of the issuer — everything, "protected capital" included, is worth that signature (Lehman, 2008).`
              : `ZC = $100 \\cdot e^{-rT}$ = **${f(zc, 2)}**. La dissection de la formule : ce zéro-coupon porte le nominal ; les coupons conditionnels sont un panier de digitales ; et la clause de remboursement dégradé sous 60 % signifie que le client a VENDU un put down-and-in — sa prime paie l'essentiel du coupon de ${pct(c, 1)}. Première ligne de la lecture desk : le produit est une DETTE de l'émetteur — tout, « capital protégé » compris, ne vaut que cette signature (Lehman, 2008).`,
          }],
          pieges: [en
            ? `Reading "protection barrier 60%" as a property of the product: the capital protection is a claim on the bank AND conditional on the barrier — two fragilities, not zero.`
            : `Lire « barrière de protection 60 % » comme une propriété du produit : la protection du capital est une créance sur la banque ET conditionnelle à la barrière — deux fragilités, pas zéro.`],
        },
        {
          intitule: en ? 'b) The margin, hidden in the price' : 'b) La marge, cachée dans le prix',
          enonce: en
            ? `The Monte-Carlo values the formula at ${f(prixMC, 2)} for 100 paid by the client. What is the total margin of the chain, in % of par?`
            : `Le Monte-Carlo valorise la formule à ${f(prixMC, 2)} pour 100 payés par le client. Quelle est la marge totale de la chaîne, en % du nominal ?`,
          reponse: margeTot, tolerance: 0.01, toleranceMode: 'absolu', unite: en ? '% of par' : '% du nominal',
          etapes: [{
            titre: en ? '100 = ZC + options + margin' : '100 = ZC + options + marge',
            contenu: en
              ? `Margin = 100 − ${f(prixMC, 2)} = **${f(margeTot, 2)}** % of par, locked in at issue whatever the index does — the twin of the swap margin of module 7. Nothing hidden in the legal sense: since 2018 the PRIIPs regulation forces the KID to publish this issue value. A structured product is typically worth 97 to 99 the day the client pays 100 — the price of manufacturing and distribution, like a market maker's spread.`
              : `Marge = 100 − ${f(prixMC, 2)} = **${f(margeTot, 2)}** % du nominal, verrouillée à l'émission quoi que fasse l'indice — la jumelle de la marge du swap du module 7. Rien de caché au sens juridique : depuis 2018, le règlement PRIIPs impose au KID de publier cette valeur à l'émission. Un produit structuré vaut typiquement 97 à 99 le jour où le client paie 100 — le prix de la fabrication et de la distribution, comme la fourchette d'un market maker.`,
          }],
          pieges: [en
            ? `Looking for the margin on a fee line: it is INSIDE the price, deducted from the option budget — each euro of margin is a euro of coupon or protection the formula no longer buys.`
            : `Chercher la marge sur une ligne de frais : elle est À L'INTÉRIEUR du prix, prélevée sur le budget d'options — chaque euro de marge est un euro de coupon ou de protection que la formule n'achète plus.`],
        },
        {
          intitule: en ? 'c) The honest annualisation' : "c) L'annualisation honnête",
          enonce: en
            ? `The pricer gives an average life of ${f(dEff, 1)} years. What is the margin of b) per year of EFFECTIVE life, in % per year?`
            : `Le pricer donne une durée de vie moyenne de ${f(dEff, 1)} ans. Que vaut la marge du b) par année de vie EFFECTIVE, en % par an ?`,
          reponse: margeEff, tolerance: 0.01, unite: en ? '% per year' : '% par an',
          etapes: [{
            titre: en ? 'Facial life versus lived life' : 'Vie faciale contre vie vécue',
            contenu: en
              ? `On the 5 facial years: ${f(margeTot, 2)}/5 = ${pct(margeFaciale, 2)} per year — within market standards (0.5 to 1%). But the product dies young: recalled early in most trajectories, average life ${f(dEff, 1)} years, so the margin really costs ${f(margeTot, 2)}/${f(dEff, 1)} = **${pct(margeEff, 2)} per year lived**. And each early recall sends the client back to the shop — a new product, a new margin: the coupon machine is also a re-subscription machine.`
              : `Sur les 5 ans faciaux : ${f(margeTot, 2)}/5 = ${pct(margeFaciale, 2)} par an — dans les standards du marché (0,5 à 1 %). Mais le produit meurt jeune : rappelé tôt dans la plupart des trajectoires, vie moyenne ${f(dEff, 1)} ans, donc la marge coûte réellement ${f(margeTot, 2)}/${f(dEff, 1)} = **${pct(margeEff, 2)} par année vécue**. Et chaque rappel anticipé renvoie le client en boutique — nouveau produit, nouvelle marge : la machine à coupons est aussi une machine à re-souscription.`,
          }],
          pieges: [en
            ? `Annualising over the 5 facial years flatters the margin by ${f(r2(margeEff - margeFaciale), 2)} points per year: "5-year product" describes the tail of the duration distribution, not its centre.`
            : `Annualiser sur les 5 ans faciaux flatte la marge de ${f(r2(margeEff - margeFaciale), 2)} point${margeEff - margeFaciale >= 2 ? 's' : ''} par an : « produit 5 ans » décrit la queue de la distribution des durées, pas son centre.`],
        },
        {
          intitule: en ? 'd) The verdict: the rent of the risk' : 'd) Le verdict : le loyer du risque',
          enonce: en
            ? `The ${f(T, 0)}-year rate is ${pct(r, 0)} and the product promises ${pct(c, 1)}. How many points of coupon are the remuneration of risks sold, in points per year?`
            : `Le taux à ${f(T, 0)} ans est à ${pct(r, 0)} et le produit promet ${pct(c, 1)}. Combien de points de coupon rémunèrent des risques vendus, en points par an ?`,
          reponse: pointsRisque, tolerance: 0.01, toleranceMode: 'absolu', unite: en ? 'points per year' : 'points par an',
          etapes: [
            {
              titre: en ? 'Coupon − rate = the option premium in disguise' : 'Coupon − taux = la prime d\'option déguisée',
              contenu: en
                ? `${f(c, 1)} − ${f(r, 0)} = **${f(pointsRisque, 2)} points** per year. That is the rent of the down-and-in put sold (plus the abandoned dividends and upside), MINUS the margin already counted in b). The oral question is never "how much does it pay?" but "WHAT RISK WAS SOLD to pay that?" — here: a crash below −40% at maturity, rare and enormous, and five years of possible immobilisation without coupon.`
                : `${f(c, 1)} − ${f(r, 0)} = **${f(pointsRisque, 2)} points** par an. C'est le loyer du put down-and-in vendu (plus les dividendes et la hausse abandonnés), MOINS la marge déjà comptée au b). La question d'oral n'est jamais « combien ça rapporte ? » mais « QUEL RISQUE A ÉTÉ VENDU pour payer ça ? » — ici : un krach sous −40 % à maturité, rare et énorme, et cinq ans d'immobilisation possible sans coupon.`,
            },
            {
              titre: en ? 'Two term sheets, one reflex' : 'Deux term sheets, un réflexe',
              contenu: en
                ? `Same coupon on another document can hide MORE risk: a continuously observed barrier (dearer put sold), a worst-of basket (correlation sold), a shakier issuer (dearer funding). The generosity of a coupon is a thermometer of the risk embarked — one compares formulas, observation clauses and signatures, never percentages.`
                : `Le même coupon sur un autre document peut cacher PLUS de risque : une barrière observée en continu (put vendu plus cher), un panier worst-of (corrélation vendue), un émetteur plus fragile (funding plus cher). La générosité d'un coupon est un thermomètre du risque embarqué — on compare des formules, des clauses d'observation et des signatures, jamais des pourcentages.`,
            },
          ],
          pieges: [en
            ? `"The index cannot lose 40%, the coupon is free money": on the pricer's trajectories the barrier scenario is rare but its loss is huge — the expectation of the two is exactly what finances those ${f(pointsRisque, 1)} points.`
            : `« L'indice ne peut pas perdre 40 %, le coupon est de l'argent gratuit » : sur les trajectoires du pricer, le scénario de barrière est rare mais sa perte est énorme — l'espérance des deux est exactement ce qui finance ces ${f(pointsRisque, 1)} points.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 8. m9-pb-08 — Du prix au coupon d'équilibre — N2                    */
/* ------------------------------------------------------------------ */
const couponEquilibre: ProblemeMoule = {
  id: 'm9-pb-08', moduleId: M9,
  titre: "Du prix au coupon d'équilibre : le coupon n'est pas choisi, il est résolu",
  titreEn: 'From price to fair coupon: the coupon is not chosen, it is solved',
  typeDeCas: 'pricing autocall',
  typeDeCasEn: 'autocall pricing',
  difficulte: 2,
  scenarios: ["Le desk résout le coupon du prochain millésime (Euro Stoxx 50)", "Le distributeur négocie le coupon affiché (indice bancaire)", "La question d'oral : « pourquoi 8 % aujourd'hui et 7 % il y a six mois ? »"],
  scenariosEn: ['The desk solves the coupon of the next vintage (Euro Stoxx 50)', 'The distributor negotiates the displayed coupon (banks index)', 'The oral question: "why 8% today and 7% six months ago?"'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Paramètres DISCRETS ; ancres de prix Monte-Carlo vérifiées hors-ligne contre
    // prixAutocallMC (graine 42, n = 100 000), bruit ±0,10 (erreur MC réaliste).
    const cfg = ([
      { r: 3, vol: 20, c1: 7, p1a: 98.08, c2: 10, p2a: 101.63, volH: 25, c1h: 10, p1ha: 98.19, c2h: 12, p2ha: 100.47 },
      { r: 5, vol: 20, c1: 8, p1a: 97.45, c2: 11, p2a: 101.03, volH: 25, c1h: 12, p1ha: 98.97, c2h: 14, p2ha: 101.27 },
      { r: 4, vol: 22, c1: 8, p1a: 97.08, c2: 11, p2a: 100.59, volH: 25, c1h: 10, p1ha: 97.43, c2h: 13, p2ha: 100.86 },
    ] as const)[sIdx];
    const p1 = randFloat(rng, cfg.p1a - 0.1, cfg.p1a + 0.1, 2);
    const p2 = randFloat(rng, cfg.p2a - 0.1, cfg.p2a + 0.1, 2);
    const p1h = randFloat(rng, cfg.p1ha - 0.1, cfg.p1ha + 0.1, 2);
    const p2h = randFloat(rng, cfg.p2ha - 0.1, cfg.p2ha + 0.1, 2);
    const cOff = r2(cfg.c1 + pick(rng, [0.5, 1] as const));
    const { c1, c2, c1h, c2h, r, vol, volH } = cfg;
    const cEq = r2(c1 + ((100 - p1) * (c2 - c1)) / (p2 - p1));
    const pOff = r2(p1 + ((cOff - c1) * (p2 - p1)) / (c2 - c1));
    const margeTot = r2(100 - pOff);
    const cEqH = r2(c1h + ((100 - p1h) * (c2h - c1h)) / (p2h - p1h));

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `5-year Athena (annual observations, trigger 100%, memory coupon, protection barrier 60% at maturity), rate ${pct(r, 0)}, volatility ${pct(vol, 0)}. The Monte-Carlo pricer (200,000 trajectories, fixed seed) returns: coupon ${pct(c1, 0)} → price ${f(p1, 2)}; coupon ${pct(c2, 0)} → price ${f(p2, 2)}. The price is linear in the coupon to an excellent approximation`
      : `Athéna 5 ans (observations annuelles, rappel à 100 %, coupon mémoire, barrière de protection 60 % à maturité), taux ${pct(r, 0)}, volatilité ${pct(vol, 0)}. Le pricer Monte-Carlo (200 000 trajectoires, graine figée) rend : coupon ${pct(c1, 0)} → prix ${f(p1, 2)} ; coupon ${pct(c2, 0)} → prix ${f(p2, 2)}. Le prix est linéaire dans le coupon avec une excellente approximation`;
    const contexte = (en
      ? [
        `Issue morning: the desk must print the coupon of the next vintage, and the coupon is never chosen — it is SOLVED so that price + margin = 100: ${desc}. Interpolate the fair coupon, price the ${pct(cOff, 1)} the sales team wants to display, lock the margin — then re-solve everything at ${pct(volH, 0)} volatility, because the market just repriced the risk.`,
        `The distributor pushes: "your competitor displays more". The desk answers with the pricer, not with opinions: ${desc}. The fair coupon first, the price of the ${pct(cOff, 1)} offer, the margin that gap locks in — and what the coupon becomes if volatility jumps to ${pct(volH, 0)}, so everyone understands WHO sets the coupon.`,
        `Oral question: "same product, 7% six months ago, more today — did the bank turn generous?" The demonstration runs on the pricer's outputs: ${desc}. Solve the fair coupon, price the offered ${pct(cOff, 1)}, extract the margin, then the high-volatility rerun — the answer to the jury is in the four numbers.`,
      ]
      : [
        `Matin d'émission : le desk doit imprimer le coupon du prochain millésime, et le coupon ne se choisit jamais — il se RÉSOUT pour que prix + marge = 100 : ${desc}. Interpolez le coupon d'équilibre, pricez le ${pct(cOff, 1)} que le commercial veut afficher, verrouillez la marge — puis re-résolvez tout à ${pct(volH, 0)} de volatilité, parce que le marché vient de repricer le risque.`,
        `Le distributeur insiste : « votre concurrent affiche plus ». Le desk répond avec le pricer, pas avec des opinions : ${desc}. Le coupon d'équilibre d'abord, le prix de l'offre à ${pct(cOff, 1)}, la marge que cet écart verrouille — et ce que devient le coupon si la volatilité saute à ${pct(volH, 0)}, pour que chacun comprenne QUI fixe le coupon.`,
        `Question d'oral : « même produit, 7 % il y a six mois, plus aujourd'hui — la banque est-elle devenue généreuse ? » La démonstration tourne sur les sorties du pricer : ${desc}. Résolvez le coupon d'équilibre, pricez le ${pct(cOff, 1)} offert, extrayez la marge, puis la re-passe à volatilité haute — la réponse au jury tient dans les quatre chiffres.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The fair coupon, by interpolation' : "a) Le coupon d'équilibre, par interpolation",
          enonce: en
            ? `The price rises linearly with the coupon: ${f(p1, 2)} at ${pct(c1, 0)}, ${f(p2, 2)} at ${pct(c2, 0)}. What coupon makes the price exactly 100, in % per year?`
            : `Le prix monte linéairement avec le coupon : ${f(p1, 2)} à ${pct(c1, 0)}, ${f(p2, 2)} à ${pct(c2, 0)}. Quel coupon amène le prix exactement à 100, en % par an ?`,
          reponse: cEq, tolerance: 0.005, unite: en ? '% per year' : '% par an',
          etapes: [{
            titre: en ? 'c* = c₁ + (100 − P₁)·(c₂ − c₁)/(P₂ − P₁)' : 'c* = c₁ + (100 − P₁)·(c₂ − c₁)/(P₂ − P₁)',
            contenu: en
              ? `Each coupon point adds ${f(r2((p2 - p1) / (c2 - c1)), 2)} to the price (the discounted expectation of the coupons actually paid). Missing to reach 100: ${f(r2(100 - p1), 2)}. So c* = ${f(c1, 0)} + ${f(r2(100 - p1), 2)}/${f(r2((p2 - p1) / (c2 - c1)), 2)} = **${pct(cEq, 2)}**. That number is a MARKET QUOTE in disguise: it moves with vol, rates and dividends, like any price.`
              : `Chaque point de coupon ajoute ${f(r2((p2 - p1) / (c2 - c1)), 2)} au prix (l'espérance actualisée des coupons effectivement versés). Il manque ${f(r2(100 - p1), 2)} pour atteindre 100. Donc c* = ${f(c1, 0)} + ${f(r2(100 - p1), 2)}/${f(r2((p2 - p1) / (c2 - c1)), 2)} = **${pct(cEq, 2)}**. Ce chiffre est une COTE DE MARCHÉ déguisée : il bouge avec la vol, les taux et les dividendes, comme n'importe quel prix.`,
          }],
          pieges: [en
            ? `Comparing two Monte-Carlo prices closer than their standard errors is reading noise — the desk interpolates on a FIXED seed precisely so the difference is the coupon effect, not a new draw of randomness (chapter 6).`
            : `Comparer deux prix Monte-Carlo plus proches que leurs erreurs-types, c'est lire du bruit — le desk interpole à graine FIGÉE précisément pour que la différence soit l'effet du coupon, pas un nouveau tirage de hasard (chapitre 6).`],
        },
        {
          intitule: en ? `b) The price of the ${pct(cOff, 1)} offer` : `b) Le prix de l'offre à ${pct(cOff, 1)}`,
          enonce: en
            ? `Sales wants to display ${pct(cOff, 1)}. By the same linearity, what is the product then worth, per 100 paid?`
            : `Le commercial veut afficher ${pct(cOff, 1)}. Par la même linéarité, combien vaut alors le produit, pour 100 payés ?`,
          reponse: pOff, tolerance: 0.005, unite: en ? '% of par' : '% du nominal',
          etapes: [{
            titre: en ? 'Same line, read the other way' : 'La même droite, lue dans l\'autre sens',
            contenu: en
              ? `P(${f(cOff, 1)}) = ${f(p1, 2)} + ${f(r2(cOff - c1), 1)} × ${f(r2((p2 - p1) / (c2 - c1)), 2)} = **${f(pOff, 2)}** for 100 paid. Below the fair coupon ${f(cEq, 2)}, the displayed coupon underpays the risk the client sells — the gap is not lost for everyone.`
              : `P(${f(cOff, 1)}) = ${f(p1, 2)} + ${f(r2(cOff - c1), 1)} × ${f(r2((p2 - p1) / (c2 - c1)), 2)} = **${f(pOff, 2)}** pour 100 payés. Sous le coupon d'équilibre ${f(cEq, 2)}, le coupon affiché sous-paie le risque que le client vend — l'écart n'est pas perdu pour tout le monde.`,
          }],
        },
        {
          intitule: en ? 'c) The locked margin' : 'c) La marge verrouillée',
          enonce: en
            ? `From b), what total margin does the ${pct(cOff, 1)} offer lock in at issue, in % of par?`
            : `À partir du b), quelle marge totale l'offre à ${pct(cOff, 1)} verrouille-t-elle à l'émission, en % du nominal ?`,
          reponse: margeTot, tolerance: 0.01, toleranceMode: 'absolu', unite: en ? '% of par' : '% du nominal',
          etapes: [{
            titre: en ? 'Margin = 100 − price of the formula' : 'Marge = 100 − prix de la formule',
            contenu: en
              ? `Margin = 100 − ${f(pOff, 2)} = **${f(margeTot, 2)}** % of par (${pct(r2(margeTot / 5), 2)} per facial year), locked at issue whatever the index does. Equivalent reading: the client receives ${f(cOff, 1)} instead of the fair ${f(cEq, 2)} — the desk kept ${f(r2(cEq - cOff), 2)} coupon points per year and sold them forward as margin. On a 100 M€ issue: ${f(r2(margeTot), 2)} M€, without any market view.`
              : `Marge = 100 − ${f(pOff, 2)} = **${f(margeTot, 2)}** % du nominal (${pct(r2(margeTot / 5), 2)} par année faciale), verrouillée à l'émission quoi que fasse l'indice. Lecture équivalente : le client touche ${f(cOff, 1)} au lieu du ${f(cEq, 2)} équitable — le desk a gardé ${f(r2(cEq - cOff), 2)} point${cEq - cOff >= 2 ? 's' : ''} de coupon par an et les a vendus d'avance comme marge. Sur une émission de 100 M€ : ${f(r2(margeTot), 2)} M€, sans aucune vue de marché.`,
          }],
          pieges: [en
            ? `Believing the bank wins if the client loses: the margin of ${f(margeTot, 2)} is the same in every scenario — the desk hedges the formula and keeps the spread, exactly like the swap desk of module 7.`
            : `Croire que la banque gagne si le client perd : la marge de ${f(margeTot, 2)} est la même dans tous les scénarios — le desk couvre la formule et garde l'écart, exactement comme le desk de swaps du module 7.`],
        },
        {
          intitule: en ? `d) The rerun at ${pct(volH, 0)} volatility` : `d) La re-passe à ${pct(volH, 0)} de volatilité`,
          enonce: en
            ? `The market repriced the risk: at ${pct(volH, 0)} volatility the pricer returns ${f(p1h, 2)} at coupon ${pct(c1h, 0)} and ${f(p2h, 2)} at ${pct(c2h, 0)}. What is the new fair coupon, in % per year?`
            : `Le marché a repricé le risque : à ${pct(volH, 0)} de volatilité le pricer rend ${f(p1h, 2)} au coupon ${pct(c1h, 0)} et ${f(p2h, 2)} à ${pct(c2h, 0)}. Quel est le nouveau coupon d'équilibre, en % par an ?`,
          reponse: cEqH, tolerance: 0.005, unite: en ? '% per year' : '% par an',
          etapes: [
            {
              titre: en ? 'Same interpolation, dearer risk' : 'Même interpolation, risque plus cher',
              contenu: en
                ? `c* = ${f(c1h, 0)} + (100 − ${f(p1h, 2)}) × ${f(r2(c2h - c1h), 0)}/${f(r2(p2h - p1h), 2)} = **${pct(cEqH, 2)}** — against ${pct(cEq, 2)} at ${pct(vol, 0)}. Higher vol ⇒ the down-and-in put the client sells is worth more ⇒ more proceeds to recycle ⇒ bigger offered coupon. The bank did not turn generous: the risk sold by the client got more expensive.`
                : `c* = ${f(c1h, 0)} + (100 − ${f(p1h, 2)}) × ${f(r2(c2h - c1h), 0)}/${f(r2(p2h - p1h), 2)} = **${pct(cEqH, 2)}** — contre ${pct(cEq, 2)} à ${pct(vol, 0)}. Vol plus haute ⇒ le put down-and-in que vend le client vaut plus cher ⇒ plus de disponible à recycler ⇒ coupon offert plus gros. La banque n'est pas devenue généreuse : le risque vendu par le client a renchéri.`,
            },
            {
              titre: en ? 'The table the client never sees side by side' : 'Le tableau que le client ne voit jamais côte à côte',
              contenu: en
                ? `The counterpart travels with the coupon: on the course's Athena, the probability of a capital loss climbs from about 2.9% (vol 15%) to 7.9% (20%) and 13% (25%). The coupon is a thermometer: it rises exactly when the risk rises — at market prices there is no free coupon, only risks more or less visible.`
                : `La contrepartie voyage avec le coupon : sur l'Athéna du cours, la probabilité de perte en capital grimpe d'environ 2,9 % (vol 15 %) à 7,9 % (20 %) puis 13 % (25 %). Le coupon est un thermomètre : il monte exactement quand le risque monte — à prix de marché, il n'y a pas de coupon gratuit, seulement des risques plus ou moins visibles.`,
            },
          ],
          pieges: [en
            ? `"Higher vol also means more early recalls, so less risk": wrong way round — high vol spreads trajectories BOTH ways: early recall less likely AND barrier breach more likely (chapter 4).`
            : `« Plus de vol, c'est aussi plus de rappels précoces, donc moins de risque » : c'est l'inverse — la vol haute écarte les trajectoires dans LES DEUX sens : rappel précoce moins probable ET barrière plus souvent percée (chapitre 4).`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 9. m9-pb-09 — Worst-of à maturité : le pire décide seul — N2        */
/* ------------------------------------------------------------------ */
const worstOfMaturite: ProblemeMoule = {
  id: 'm9-pb-09', moduleId: M9,
  titre: 'Worst-of à maturité : le pire décide seul',
  titreEn: 'Worst-of at maturity: the worst decides alone',
  typeDeCas: 'worst-of et corrélation',
  typeDeCasEn: 'worst-of and correlation',
  difficulte: 2,
  scenarios: ['Le règlement à maturité du panier pétrolière/banque', "Le duo luxe/télécom de la banque privée", 'Le panier tech/pharma du jeu de bourse'],
  scenariosEn: ['Settling the oil/bank basket at maturity', "Private banking's luxury/telecom duo", "The trading game's tech/pharma basket"],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Paramètres de marché DISCRETS ; fourchettes du prix du call worst-of
    // vérifiées hors-ligne contre prixCallWorstOfMC (graine 42, n = 200 000).
    const cfg = ([
      { r: 5, vol: 20, x1lo: 7.15, x1hi: 7.40, x2lo: 4.38, x2hi: 4.60, s1Min: 30, s1Max: 60, s2Min: 80, s2Max: 140 },
      { r: 3, vol: 25, x1lo: 7.50, x1hi: 7.75, x2lo: 4.32, x2hi: 4.55, s1Min: 300, s1Max: 700, s2Min: 10, s2Max: 25 },
      { r: 4, vol: 22, x1lo: 7.18, x1hi: 7.42, x2lo: 4.28, x2hi: 4.50, s1Min: 90, s1Max: 220, s2Min: 40, s2Max: 90 },
    ] as const)[sIdx];
    const s1 = randInt(rng, cfg.s1Min, cfg.s1Max);
    const s2 = randInt(rng, cfg.s2Min, cfg.s2Max);
    // Zone 0 : les deux montent (payoff > 0) ; zone 1 : un seul déçoit (payoff nul).
    const zone = pick(rng, [0, 1] as const);
    const pBest = zone === 0 ? randInt(rng, 10, 35) : randInt(rng, 5, 30);
    const pWorst = zone === 0 ? randInt(rng, 3, Math.max(pBest - 5, 4)) : -randInt(rng, 4, 25);
    const sT1 = r2(s1 * (1 + pBest / 100));
    const sT2 = r2(s2 * (1 + pWorst / 100));
    const X1 = randFloat(rng, cfg.x1lo, cfg.x1hi, 2);   // prix du call worst-of à ρ = 80 %
    const X2 = randFloat(rng, cfg.x2lo, cfg.x2hi, 2);   // prix du call worst-of à ρ = 30 %
    const budget = randFloat(rng, 10, 14, 1);
    const perfWorst = r2(100 * (Math.min(sT1 / s1, sT2 / s2) - 1));
    const payoff = r2(payoffWorstOf(sT1, sT2, s1, s2, 100));
    const payoffBest = r2(100 * Math.max(Math.max(sT1 / s1, sT2 / s2) - 1, 0));
    const partHaute = r2(100 * budget / X1);
    const partBasse = r2(100 * budget / X2);
    const ecartPart = r2(partBasse - partHaute);
    const { r, vol } = cfg;

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `1-year note indexed on the WORST performance of two stocks (strike 100% of initial levels); stock A started at ${f(s1, 0)} and finishes at ${f(sT1, 2)}; stock B started at ${f(s2, 0)} and finishes at ${f(sT2, 2)}; rate ${pct(r, 0)}, both volatilities ${pct(vol, 0)}`
      : `note à 1 an indexée sur la PIRE performance de deux actions (strike 100 % des niveaux initiaux) ; l'action A est partie de ${f(s1, 0)} et finit à ${f(sT1, 2)} ; l'action B est partie de ${f(s2, 0)} et finit à ${f(sT2, 2)} ; taux ${pct(r, 0)}, volatilités ${pct(vol, 0)} toutes deux`;
    const contexte = (en
      ? [
        `Maturity day on the oil/bank basket, and the middle office must settle the formula to the cent: ${desc}. Compute the worst performance, the worst-of call payoff, what a vanilla call on the best performer would have paid — then reopen the pricing file: the desk's pricer values this worst-of call at ${f(X1, 2)}% of par with correlation 80% and ${f(X2, 2)} with correlation 30%, and the participation shop window depends on that invisible parameter.`,
        `The private bank sold the luxury/telecom duo as "diversification"; at maturity the client discovers what the minimum does to a portfolio: ${desc}. The four numbers of the debrief: worst performance, formula payoff, the counterfactual on the best stock — and the correlation reading (pricer: ${f(X1, 2)} at ρ = 80%, ${f(X2, 2)} at ρ = 30%) that explains why the brochure was so generous.`,
        `Trading-game final, tech/pharma basket: the jury wants the settlement AND the theory: ${desc}. Payoff of the worst-of, the vanilla comparison, then the structurer's side: with the same option budget, what participation does each correlation assumption display (pricer: ${f(X1, 2)} at 80%, ${f(X2, 2)} at 30%)?`,
      ]
      : [
        `Jour de maturité sur le panier pétrolière/banque, et le middle office doit régler la formule au centime : ${desc}. Calculez la pire performance, le payoff du call worst-of, ce qu'aurait payé un call vanille sur la mieux orientée — puis rouvrez le dossier de pricing : le pricer du desk valorise ce call worst-of ${f(X1, 2)} % du nominal avec une corrélation de 80 % et ${f(X2, 2)} avec 30 %, et la vitrine de participation dépend de ce paramètre invisible.`,
        `La banque privée a vendu le duo luxe/télécom comme de la « diversification » ; à maturité, le client découvre ce que le minimum fait à un portefeuille : ${desc}. Les quatre chiffres du débrief : pire performance, payoff de la formule, le contrefactuel sur la meilleure action — et la lecture de corrélation (pricer : ${f(X1, 2)} à ρ = 80 %, ${f(X2, 2)} à ρ = 30 %) qui explique pourquoi la brochure était si généreuse.`,
        `Finale du jeu de bourse, panier tech/pharma : le jury veut le règlement ET la théorie : ${desc}. Payoff du worst-of, la comparaison vanille, puis le côté structureur : avec le même budget d'options, quelle participation chaque hypothèse de corrélation affiche-t-elle (pricer : ${f(X1, 2)} à 80 %, ${f(X2, 2)} à 30 %) ?`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The worst performance' : 'a) La pire performance',
          enonce: en
            ? `Rebase each stock to its initial level. What is the WORST of the two performances, in % (sign included)?`
            : `Ramenez chaque action à son niveau initial. Quelle est la PIRE des deux performances, en % (signe compris) ?`,
          reponse: perfWorst, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Two ratios, one minimum' : 'Deux ratios, un minimum',
            contenu: en
              ? `A: ${f(sT1, 2)}/${f(s1, 0)} − 1 = ${pct(r2(100 * (sT1 / s1 - 1)), 2)}; B: ${f(sT2, 2)}/${f(s2, 0)} − 1 = ${pct(r2(100 * (sT2 / s2 - 1)), 2)}. The formula only reads the minimum: **${pct(perfWorst, 2)}**. The absolute levels (${f(s1, 0)} versus ${f(s2, 0)}) are irrelevant — everything is rebased to 100 at issue; only performances compete.`
              : `A : ${f(sT1, 2)}/${f(s1, 0)} − 1 = ${pct(r2(100 * (sT1 / s1 - 1)), 2)} ; B : ${f(sT2, 2)}/${f(s2, 0)} − 1 = ${pct(r2(100 * (sT2 / s2 - 1)), 2)}. La formule ne lit que le minimum : **${pct(perfWorst, 2)}**. Les niveaux absolus (${f(s1, 0)} contre ${f(s2, 0)}) ne comptent pas — tout est rebasé à 100 à l'émission ; seules les performances concourent.`,
          }],
          pieges: [en
            ? `Taking the worst FINAL LEVEL instead of the worst PERFORMANCE: a stock at 12 that gained 20% beats a stock at 500 that lost 3% — the worst-of compares ratios, never prices.`
            : `Prendre le pire NIVEAU final au lieu de la pire PERFORMANCE : une action à 12 qui a gagné 20 % bat une action à 500 qui a perdu 3 % — le worst-of compare des ratios, jamais des prix.`],
        },
        {
          intitule: en ? 'b) The worst-of call payoff' : 'b) Le payoff du call worst-of',
          enonce: en
            ? `The note pays 100 × max(worst performance, 0) per 100 of par. What does it pay here, in % of par?`
            : `La note verse 100 × max(pire performance, 0) pour 100 de nominal. Que verse-t-elle ici, en % du nominal ?`,
          reponse: payoff, tolerance: 0.05, toleranceMode: 'absolu', unite: en ? '% of par' : '% du nominal',
          etapes: [{
            titre: en ? 'To win, ALL must rise; to lose, ONE must stumble' : 'Pour gagner, il faut que TOUT monte ; pour perdre, qu\'UN SEUL trébuche',
            contenu: en
              ? `Payoff = $100 \\times \\max(\\min_i(S_T^{(i)}/S_0^{(i)}) - 1,\\ 0)$ = **${pct(payoff, 2)}**. ${zone === 0 ? `Both stocks finished up, so the worst is positive and pays — but only ${f(perfWorst, 2)} of the ${f(pBest, 0)} points the best delivered.` : `Stock ${sT1 / s1 >= sT2 / s2 ? 'B' : 'A'} stumbled: the minimum is negative, the max(·, 0) floors at ZERO — the ${pct(pBest, 0)} rally of the other stock pays nothing. The structure is unfavourable by construction: the expectation of the minimum is always below the minimum of the expectations.`}`
              : `Payoff = $100 \\times \\max(\\min_i(S_T^{(i)}/S_0^{(i)}) - 1,\\ 0)$ = **${pct(payoff, 2)}**. ${zone === 0 ? `Les deux actions finissent en hausse : le pire est positif et paie — mais seulement ${f(perfWorst, 2)} sur les ${f(pBest, 0)} points que la meilleure a livrés.` : `L'action ${sT1 / s1 >= sT2 / s2 ? 'B' : 'A'} a trébuché : le minimum est négatif, le max(·, 0) plancher à ZÉRO — le rallye de ${pct(pBest, 0)} de l'autre action ne paie rien. La structure est défavorable par construction : l'espérance du minimum est toujours sous le minimum des espérances.`}`,
          }],
          pieges: [en
            ? `Averaging the two performances (${pct(r2((100 * (sT1 / s1 - 1) + 100 * (sT2 / s2 - 1)) / 2), 2)}): the worst-of is not a basket average — diversification benefits whoever holds the mean, never whoever holds the minimum.`
            : `Moyenner les deux performances (${pct(r2((100 * (sT1 / s1 - 1) + 100 * (sT2 / s2 - 1)) / 2), 2)}) : le worst-of n'est pas une moyenne de panier — la diversification profite à qui touche la moyenne, jamais à qui ne touche que le minimum.`],
        },
        {
          intitule: en ? 'c) The counterfactual: a vanilla call on the best stock' : 'c) Le contrefactuel : un call vanille sur la meilleure',
          enonce: en
            ? `What would a vanilla ATM call (same rebasing) on the BEST performer have paid, in % of par?`
            : `Qu'aurait payé un call vanille ATM (même rebasage) sur la MIEUX orientée des deux, en % du nominal ?`,
          reponse: payoffBest, tolerance: 0.05, toleranceMode: 'absolu', unite: en ? '% of par' : '% du nominal',
          etapes: [{
            titre: en ? 'The gap is the price of the indexation' : 'L\'écart est le prix de l\'indexation',
            contenu: en
              ? `Vanilla on the best: **${pct(payoffBest, 2)}**, against ${pct(payoff, 2)} for the worst-of — a gap of ${f(r2(payoffBest - payoff), 2)} points on this single scenario. Why accept it? Because the worst-of call COSTS much less (${f(X2, 2)} against roughly the vanilla's price at these parameters), so the same budget displays a much larger participation. The client pays the gap scenario by scenario; the shop window pockets it on day one.`
              : `Vanille sur la meilleure : **${pct(payoffBest, 2)}**, contre ${pct(payoff, 2)} pour le worst-of — un écart de ${f(r2(payoffBest - payoff), 2)} points sur ce seul scénario. Pourquoi l'accepter ? Parce que le call worst-of COÛTE bien moins cher (${f(X2, 2)} contre environ le prix de la vanille à ces paramètres), donc le même budget affiche une participation bien plus grosse. Le client paie l'écart scénario par scénario ; la vitrine l'encaisse au jour 1.`,
          }],
        },
        {
          intitule: en ? 'd) The invisible parameter: the correlation shop window' : 'd) Le paramètre invisible : la vitrine de corrélation',
          enonce: en
            ? `The desk holds ${pct(budget, 1)} of par in option budget. The pricer values the worst-of call at ${f(X1, 2)} with ρ = 80% and ${f(X2, 2)} with ρ = 30%. How many points of DISPLAYED participation does pricing at 30% instead of 80% add?`
            : `Le desk tient ${pct(budget, 1)} du nominal de budget d'options. Le pricer valorise le call worst-of ${f(X1, 2)} avec ρ = 80 % et ${f(X2, 2)} avec ρ = 30 %. Combien de points de participation AFFICHÉE le pricing à 30 % au lieu de 80 % ajoute-t-il ?`,
          reponse: ecartPart, tolerance: 0.01, unite: en ? 'participation points' : 'points de participation',
          etapes: [
            {
              titre: en ? 'Same budget, two correlations, two windows' : 'Même budget, deux corrélations, deux vitrines',
              contenu: en
                ? `At ρ = 80%: ${f(budget, 1)}/${f(X1, 2)} = ${pct(partHaute, 2)}. At ρ = 30%: ${f(budget, 1)}/${f(X2, 2)} = ${pct(partBasse, 2)}. Gap: **${f(ecartPart, 2)} points**. Lower correlation ⇒ more dispersion ⇒ the worst is worse ⇒ the worst-of call is CHEAPER — and the participation fatter. The client compares coupons and participations, never correlations: he just took a position on a parameter he cannot name.`
                : `À ρ = 80 % : ${f(budget, 1)}/${f(X1, 2)} = ${pct(partHaute, 2)}. À ρ = 30 % : ${f(budget, 1)}/${f(X2, 2)} = ${pct(partBasse, 2)}. Écart : **${f(ecartPart, 2)} points**. Corrélation plus basse ⇒ plus de dispersion ⇒ le pire est pire ⇒ le call worst-of est MOINS CHER — et la participation plus grasse. Le client compare des coupons et des participations, jamais des corrélations : il vient de prendre position sur un paramètre qu'il ne sait pas nommer.`,
            },
            {
              titre: en ? 'In a crisis, correlations go to 1' : 'En crise, les corrélations vont à 1',
              contenu: en
                ? `The "diversification" reasoning — "both would have to collapse, unlikely squared" — is the module 2 independence fallacy: correlations are not constants, they RISE toward 1 in crashes (2008, March 2020). The scenario that hurts the worst-of is ONE systemic event, with the probability of a crash — not of a crash squared. Double penalty: in calm markets dispersion sinks the worst; in a crash everything falls as one block.`
                : `Le raisonnement « diversification » — « il faudrait que les deux s'effondrent, improbable au carré » — est le contresens d'indépendance du module 2 : les corrélations ne sont pas des constantes, elles MONTENT vers 1 dans les krachs (2008, mars 2020). Le scénario qui fait mal au worst-of est UN événement systémique, avec la probabilité d'un krach — pas d'un krach au carré. Double peine : par temps calme la dispersion enfonce le pire ; par krach tout tombe d'un bloc.`,
            },
          ],
          pieges: [en
            ? `"Low correlation = a less risky, better diversified basket, so a smaller display": exactly backwards for the worst-of — the low-correlation world is the one where the client's option is cheap and his risk of touching the minimum is high.`
            : `« Corrélation basse = panier moins risqué car diversifié, donc vitrine plus petite » : exactement l'inverse pour le worst-of — le monde à corrélation basse est celui où l'option du client est bon marché et son risque de ne toucher que le minimum est haut.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 10. m9-pb-10 — Le book du structureur après la vente — N2           */
/* ------------------------------------------------------------------ */
const bookStructureur: ProblemeMoule = {
  id: 'm9-pb-10', moduleId: M9,
  titre: 'Le book du structureur après la vente : qui porte quoi',
  titreEn: "The structurer's book after the sale: who carries what",
  typeDeCas: 'risques du desk',
  typeDeCasEn: 'desk risks',
  difficulte: 2,
  scenarios: ["Le comité des risques après la campagne d'émission", 'Mars 2020 : la réunion de crise du desk', 'Le junior présente le book au responsable du desk'],
  scenariosEn: ['The risk committee after the issuance campaign', 'March 2020: the desk crisis meeting', 'The junior presents the book to the desk head'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Paramètres DISCRETS ; fourchettes du DIP worst-of (3 ans, barrière 60,
    // observation mensuelle) vérifiées hors-ligne contre un pricer MC répliquant
    // trajectoiresCorrelees + payoffDownAndInPut sur la pire perf (graine 42, n = 100 000).
    const cfg = ([
      { r: 3, vols: [22, 25], w1Lo: 10.45, w1Hi: 11.0, w2Lo: 8.38, w2Hi: 8.85 },
      { r: 3, vols: [25, 25], w1Lo: 12.15, w1Hi: 12.7, w2Lo: 9.6, w2Hi: 10.1 },
      { r: 4, vols: [22, 25], w1Lo: 9.1, w1Hi: 9.6, w2Lo: 7.3, w2Hi: 7.72 },
    ] as const)[sIdx];
    const encours = randInt(rng, 4, 10) * 50;           // encours émis, en M€
    const prixEmission = randFloat(rng, 97.0, 98.2, 1); // valeur de la formule à l'émission
    const w1 = randFloat(rng, cfg.w1Lo, cfg.w1Hi, 2);   // DIP worst-of à ρ = 50 %
    const w2 = randFloat(rng, cfg.w2Lo, cfg.w2Hi, 2);   // DIP worst-of à ρ = 90 %
    const fracDelta = randFloat(rng, 0.6, 0.85, 2);
    const q = randFloat(rng, 2.5, 4, 1);                // rendement de dividende attendu, %/an
    const deltaCouv = r2(encours * fracDelta);          // couverture en forward, M€
    const margeTot = r2(((100 - prixEmission) / 100) * encours);
    const margeAn = r2(margeTot / 5);
    const pnlCorr = r2(((w2 - w1) / 100) * encours);    // négatif : ρ monte, le book perd
    const perteDiv = r2((q / 100) * deltaCouv);         // une année de dividendes annulée
    const annees = r2((Math.abs(pnlCorr) + perteDiv) / margeAn);
    const { r, vols } = cfg;

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `${f(encours, 0)} M€ of 3-year worst-of autocalls sold at 100 for a formula worth ${f(prixEmission, 1)} (rate ${pct(r, 0)}, volatilities ${pct(vols[0], 0)} and ${pct(vols[1], 0)}); the book is LONG the clients' worst-of down-and-in puts, which the pricer values at ${f(w1, 2)}% of par with correlation 50% and ${f(w2, 2)} with correlation 90%; the hedge holds ${f(deltaCouv, 0)} M€ of underlyings via forwards, on stocks paying ${pct(q, 1)} of expected dividends per year`
      : `${f(encours, 0)} M€ d'autocalls worst-of 3 ans vendus 100 pour une formule valant ${f(prixEmission, 1)} (taux ${pct(r, 0)}, volatilités ${pct(vols[0], 0)} et ${pct(vols[1], 0)}) ; le book est LONG les puts down-and-in worst-of des clients, que le pricer valorise ${f(w1, 2)} % du nominal à corrélation 50 % et ${f(w2, 2)} à corrélation 90 % ; la couverture détient ${f(deltaCouv, 0)} M€ de sous-jacents via des forwards, sur des titres à ${pct(q, 1)} de dividendes attendus par an`;
    const contexte = (en
      ? [
        `The issuance campaign is over, the sales team celebrates — and the risk committee asks the only serious question: what does the BOOK carry now? ${desc}. Four numbers: the margin locked at issue, the P&L if correlations jump from 50% to 90%, the cost of one cancelled dividend year on the hedge — and how many years of margin one bad quarter can erase.`,
        `March 2020 in the meeting room: indices in free fall, correlations at highs, issuers cancelling dividends by decree. The desk head wants the damage, line by line: ${desc}. Margin locked, correlation P&L at ρ = 90%, the dividend hole — and the ratio that will end up in the executive committee deck.`,
        `End of rotation: the junior must present the structured book to the desk head, and prove he knows WHO carries WHAT — the client sold volatility and dispersion, paid in coupon; the desk keeps what does not transfer: ${desc}. Expected: the locked margin, the short-correlation P&L, the long-dividend exposure, and the years-of-margin arithmetic.`,
      ]
      : [
        `La campagne d'émission est bouclée, le commercial fête ses volumes — et le comité des risques pose la seule question sérieuse : que porte le BOOK maintenant ? ${desc}. Quatre chiffres : la marge verrouillée à l'émission, le P&L si les corrélations sautent de 50 % à 90 %, le coût d'une année de dividendes annulée sur la couverture — et combien d'années de marge un seul mauvais trimestre peut effacer.`,
        `Mars 2020 en salle de réunion : indices en chute libre, corrélations au plus haut, émetteurs qui annulent leurs dividendes sur injonction. Le responsable du desk veut les dégâts, ligne par ligne : ${desc}. Marge verrouillée, P&L de corrélation à ρ = 90 %, le trou de dividendes — et le ratio qui finira dans le support du comité exécutif.`,
        `Fin de rotation : le junior doit présenter le book structuré au responsable du desk, et prouver qu'il sait QUI porte QUOI — le client a vendu de la volatilité et de la dispersion, payées en coupon ; le desk garde ce qui ne se transfère pas : ${desc}. Attendu : la marge verrouillée, le P&L court-corrélation, l'exposition longue-dividendes, et l'arithmétique en années de marge.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The margin, locked at issue' : 'a) La marge, verrouillée à l\'émission',
          enonce: en
            ? `${f(encours, 0)} M€ sold at 100 for a formula worth ${f(prixEmission, 1)}. What total margin did the campaign lock in, in M€?`
            : `${f(encours, 0)} M€ vendus 100 pour une formule valant ${f(prixEmission, 1)}. Quelle marge totale la campagne a-t-elle verrouillée, en M€ ?`,
          reponse: margeTot, tolerance: 0.01, unite: 'M€',
          etapes: [{
            titre: en ? '(100 − issue value) × notional' : '(100 − valeur à l\'émission) × encours',
            contenu: en
              ? `Margin = ${f(r2(100 - prixEmission), 1)}% × ${f(encours, 0)} M€ = **${f(margeTot, 2)} M€**, i.e. ${f(margeAn, 2)} M€ per facial year, earned on day one whatever the market does — the bank is not betting against its clients. But "locked" describes the margin, NOT the book: what follows is everything the hedges cannot transfer.`
              : `Marge = ${f(r2(100 - prixEmission), 1)} % × ${f(encours, 0)} M€ = **${f(margeTot, 2)} M€**, soit ${f(margeAn, 2)} M€ par année faciale, gagnés au jour 1 quoi que fasse le marché — la banque ne parie pas contre ses clients. Mais « verrouillée » décrit la marge, PAS le book : la suite est tout ce que les couvertures ne transfèrent pas.`,
          }],
        },
        {
          intitule: en ? 'b) Short correlation: ρ jumps from 50% to 90%' : 'b) Court de corrélation : ρ saute de 50 % à 90 %',
          enonce: en
            ? `The book is LONG the clients' worst-of DIPs: ${f(w1, 2)}% of par at ρ = 50%, ${f(w2, 2)} at ρ = 90%. In a crisis, correlations jump to 90%. What is the book's P&L on this parameter, sign included, in M€?`
            : `Le book est LONG les DIP worst-of des clients : ${f(w1, 2)} % du nominal à ρ = 50 %, ${f(w2, 2)} à ρ = 90 %. En crise, les corrélations sautent à 90 %. Quel est le P&L du book sur ce paramètre, signe compris, en M€ ?`,
          reponse: pnlCorr, tolerance: Math.max(0.05, Math.abs(pnlCorr) * 0.01), toleranceMode: 'absolu', unite: 'M€',
          etapes: [
            {
              titre: en ? 'Long the worst-of put = short correlation' : 'Long le put worst-of = court de corrélation',
              contenu: en
                ? `P&L = (${f(w2, 2)} − ${f(w1, 2)})% × ${f(encours, 0)} M€ = **${f(pnlCorr, 2)} M€**. When ρ rises, the two underlyings move as one: less dispersion, the worst is less bad, and the desk's puts DEFLATE. The autocall desk is structurally SHORT correlation by construction — and ρ rises precisely in crises, when everything falls together.`
                : `P&L = (${f(w2, 2)} − ${f(w1, 2)}) % × ${f(encours, 0)} M€ = **${f(pnlCorr, 2)} M€**. Quand ρ monte, les deux sous-jacents bougent d'un bloc : moins de dispersion, le pire est moins pire, et les puts du desk se DÉGONFLENT. Le desk d'autocalls est structurellement COURT de corrélation par construction — et ρ monte précisément en crise, quand tout tombe ensemble.`,
            },
            {
              titre: en ? 'Why the desk BUYS correlation' : 'Pourquoi le desk ACHÈTE de la corrélation',
              contenu: en
                ? `Book after book, this short has made structuring desks the big BUYERS of correlation in the equity market — hedging a risk whose involuntary source is their own clientele: the dispersion premium the client pockets as extra coupon is exactly what evaporates for the desk when correlations converge to 1.`
                : `Book après book, ce court a fait des desks de structuration les grands ACHETEURS de corrélation du marché actions — la couverture d'un risque dont leur propre clientèle est la source involontaire : la prime de dispersion que le client encaisse en supplément de coupon est exactement ce qui s'évapore pour le desk quand les corrélations convergent vers 1.`,
            },
          ],
          pieges: [en
            ? `"The desk is long the puts, so a crisis pays it": on the VOLATILITY leg yes (the puts fatten) — but the correlation leg loses, the hedges churn near the barriers, and b) prices that specific parameter, everything else equal.`
            : `« Le desk est long les puts, donc la crise le paie » : sur la jambe VOLATILITÉ oui (les puts grossissent) — mais la jambe corrélation perd, les couvertures s'affolent près des barrières, et le b) price ce paramètre-là, toutes choses égales par ailleurs.`],
        },
        {
          intitule: en ? 'c) Long dividends: the cancelled year' : 'c) Long dividendes : l\'année annulée',
          enonce: en
            ? `The hedge holds ${f(deltaCouv, 0)} M€ of underlyings via forwards, on stocks expected to pay ${pct(q, 1)} per year — dividends the products (price indices) never redistribute. Regulators force a full year of cancellations. What does the book lose, in M€?`
            : `La couverture détient ${f(deltaCouv, 0)} M€ de sous-jacents via des forwards, sur des titres censés payer ${pct(q, 1)} par an — des dividendes que les produits (indices de prix) ne reversent jamais. Les régulateurs imposent une année entière d'annulations. Que perd le book, en M€ ?`,
          reponse: perteDiv, tolerance: 0.01, unite: 'M€',
          etapes: [
            {
              titre: en ? 'The desk collects dividends the product does not pay out' : 'Le desk encaisse des dividendes que le produit ne reverse pas',
              contenu: en
                ? `Loss = ${pct(q, 1)} × ${f(deltaCouv, 0)} M€ = **${f(perteDiv, 2)} M€**. The hedging forward is priced $F = S\\,e^{(r - q)T}$: the desk pays for its hedge assuming it will receive the dividend stream. Cancel the dividends and that leg evaporates — the client's terms are frozen at signature; the DESK carries the gap between expected and realised dividends, for the whole life of the product.`
                : `Perte = ${pct(q, 1)} × ${f(deltaCouv, 0)} M€ = **${f(perteDiv, 2)} M€**. Le forward de couverture se price $F = S\\,e^{(r - q)T}$ : le desk paie sa couverture en supposant qu'il touchera la chronique de dividendes. Annulez les dividendes et cette jambe s'évapore — les termes du client sont figés à la signature ; c'est le DESK qui porte l'écart entre dividendes anticipés et réalisés, sur toute la vie du produit.`,
            },
            {
              titre: en ? 'March 2020, the invisible risk' : 'Mars 2020, le risque invisible',
              contenu: en
                ? `This is exactly the 2020 accident: Euro Stoxx 50 dividend futures for 2020-2021 lost about half their value in weeks; the French banks, world leaders in equity structuring and therefore the longest dividends of all, lost on the order of 200 M€ each in Q1 — and Natixis exited the most complex products that summer. A second-order parameter bent entire desks.`
                : `C'est exactement l'accident de 2020 : les futures de dividendes Euro Stoxx 50 pour 2020-2021 ont perdu environ la moitié de leur valeur en quelques semaines ; les banques françaises, leaders mondiaux de la structuration actions et donc les plus longues dividendes de toutes, ont perdu de l'ordre de 200 M€ chacune au premier trimestre — et Natixis a quitté les produits les plus complexes à l'été 2020. Un paramètre de second ordre a fait plier des desks entiers.`,
            },
          ],
          pieges: [en
            ? `"The clients hold the products, so they carry the dividend risk": the products are written on PRICE indices — the client never had the dividends, so cannot lose them; the desk who counted on them can.`
            : `« Les clients détiennent les produits, donc ils portent le risque de dividendes » : les produits sont écrits sur des indices de PRIX — le client n'a jamais eu les dividendes, il ne peut pas les perdre ; le desk qui comptait dessus, si.`],
        },
        {
          intitule: en ? 'd) The committee ratio: years of margin erased' : 'd) Le ratio du comité : les années de marge effacées',
          enonce: en
            ? `Add the losses of b) and c) and divide by ONE year of margin (a ÷ 5 facial years). How many years of margin does this single episode erase?`
            : `Additionnez les pertes du b) et du c) et divisez par UNE année de marge (le a ÷ 5 ans faciaux). Combien d'années de marge ce seul épisode efface-t-il ?`,
          reponse: annees, tolerance: 0.02, unite: en ? 'years' : 'années',
          etapes: [
            {
              titre: en ? 'The division that sobers a committee' : 'La division qui dégrise un comité',
              contenu: en
                ? `Losses = ${f(r2(Math.abs(pnlCorr)), 2)} + ${f(perteDiv, 2)} = ${f(r2(Math.abs(pnlCorr) + perteDiv), 2)} M€; one year of margin = ${f(margeTot, 2)}/5 = ${f(margeAn, 2)} M€. Ratio: **${f(annees, 2)} years** of margin erased by one episode. The manufacturing business earns small and steady, and keeps risks that lose big and rarely — the insurer's profile, one floor up.`
                : `Pertes = ${f(r2(Math.abs(pnlCorr)), 2)} + ${f(perteDiv, 2)} = ${f(r2(Math.abs(pnlCorr) + perteDiv), 2)} M€ ; une année de marge = ${f(margeTot, 2)}/5 = ${f(margeAn, 2)} M€. Ratio : **${f(annees, 2)} années** de marge effacées par un seul épisode. Le métier de fabrication gagne petit et régulier, et garde des risques qui perdent gros et rarement — le profil de l'assureur, un étage plus haut.`,
            },
            {
              titre: en ? 'The transversal lesson' : 'La leçon transversale',
              contenu: en
                ? `A structured product distributes risks its buyer does not see: the client SELLS volatility and dispersion — legitimate, remunerated, that is the coupon; the desk KEEPS what does not transfer — the dividends of the price index, the correlation to buy back, the greeks near the barriers. The accident comes when a whole street carries the same risk at the same time: 1987, 2018, the HSCEI barriers in 2016, the European dividend in 2020 — a concentrated risk stops being a pricing parameter and becomes a market event.`
                : `Un produit structuré répartit des risques que son acheteur ne voit pas : le client VEND de la volatilité et de la dispersion — ventes légitimes, rémunérées, c'est le coupon ; le desk GARDE ce qui ne se transfère pas — les dividendes de l'indice de prix, la corrélation à racheter, les grecques près des barrières. L'accident survient quand toute une place porte le même risque au même moment : 1987, 2018, les barrières HSCEI en 2016, le dividende européen en 2020 — le risque concentré cesse d'être un paramètre de pricing et devient un événement de marché.`,
            },
          ],
          pieges: [en
            ? `Comparing the losses to the TOTAL margin (${f(margeTot, 2)} M€) flatters the ratio five-fold: the margin is earned once per vintage, the risks live on the book every year.`
            : `Comparer les pertes à la marge TOTALE (${f(margeTot, 2)} M€) flatte le ratio d'un facteur cinq : la marge se gagne une fois par millésime, les risques vivent sur le book chaque année.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* Export du lot 1 — fusionné dans problems.ts par le contrôleur.      */
/* ------------------------------------------------------------------ */
export const problemesLot1: ProblemeMoule[] = [
  premierCapitalGaranti,      // m9-pb-01 · N1
  brochureReverse,            // m9-pb-02 · N1
  zeroCouponFunding,          // m9-pb-03 · N1
  autocallDeroule,            // m9-pb-04 · N1
  structureurParticipation,   // m9-pb-05 · N2
  reverseBarriere,            // m9-pb-06 · N2
  reconstitutionTermSheet,    // m9-pb-07 · N2
  couponEquilibre,            // m9-pb-08 · N2
  worstOfMaturite,            // m9-pb-09 · N2
  bookStructureur,            // m9-pb-10 · N2
];
