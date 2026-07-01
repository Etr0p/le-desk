/**
 * Moules de problèmes multi-étapes du module Options & volatilité
 * — LOT 2 : les niveaux durs (m8-pb-11 à m8-pb-20).
 * 4 N3 (delta-hedging dynamique du vendeur, implicite contre réalisée sur un
 * straddle, lecture du smile à trois strikes, collar « coût zéro ») et 6 boss
 * N4 alignés sur le chapitre 7 (Volmageddon 2018, le gamma squeeze GameStop
 * côté market maker, la portfolio insurance de 1987, les puts nus d'octobre
 * 1997, le book de vega de LTCM, l'autocall qui teasera le module 9).
 * Chaque moule : 3 scénarios FR + EN, sous-questions chaînées, corrigés
 * calculés via calculs.ts — jamais de texte figé.
 * INVARIANT BILINGUE : tous les tirages aléatoires ont lieu AVANT toute branche
 * de langue — même seed + même scénario ⇒ mêmes nombres en français et en anglais.
 * Conventions (en-tête de calculs.ts) : taux et volatilités en %, durées en
 * années ; Black-Scholes et parité call-put en composition CONTINUE (e^{−rT}) ;
 * arbre binomial à UNE période en capitalisation LINÉAIRE ; sens = +1 acheteur,
 * −1 vendeur ; vega PAR POINT de volatilité ; quotité 100 actions par contrat.
 */
import { normaleCdf } from '../02-methodes-quantitatives/calculs';
import { formatNombreLangue } from '../../../engine/answers';
import { mulberry32, pick, randFloat, randInt } from '../../../engine/rng';
import type { Langue, ProblemGenerator } from '../../../engine/types';
import {
  actionsDeltaHedge, blackScholesCall, blackScholesPut, d2BlackScholes,
  deltaCall, deltaPut, dfContinu, gammaOption, payoffCall, payoffPut,
  pnlOption, pointsMortsStraddle, putDepuisParite, vegaOption,
  volAnnualiseePct, volImplicitePct,
} from './calculs';

/** Un « moule » de problème est un ProblemGenerator de l'engine (alias local). */
export type ProblemeMoule = ProblemGenerator;

const M8 = '08-options-volatilite';
const QUOTITE = 100; // actions par contrat — le standard listé depuis le CBOE de 1973 (ch1)
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
/* 11. m8-pb-11 — Le vendeur couvert : la facture gamma — N3           */
/* ------------------------------------------------------------------ */
const vendeurGamma: ProblemeMoule = {
  id: 'm8-pb-11', moduleId: M8,
  titre: 'Le vendeur couvert : deux réajustements, une facture gamma',
  titreEn: 'The hedged seller: two rebalances, one gamma bill',
  typeDeCas: 'delta-hedging et gamma',
  typeDeCasEn: 'delta hedging and gamma',
  difficulte: 3,
  scenarios: ['Market maker sur une valeur du CAC, semaine agitée', 'Contrôle des risques : auditer le coût de couverture', 'Grand oral : pourquoi le vendeur couvert perd quand ça bouge'],
  scenariosEn: ['Market maker on a CAC stock, choppy week', 'Risk control: auditing the hedging cost', 'Final viva: why the hedged seller loses when it moves'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const cfg = ([
      { sym: '€', sMin: 80, sMax: 120, nMin: 20, nMax: 40 },
      { sym: '$', sMin: 150, sMax: 250, nMin: 10, nMax: 25 },
      { sym: '€', sMin: 40, sMax: 70, nMin: 10, nMax: 30 },
    ] as const)[sIdx];
    const S0 = randInt(rng, cfg.sMin, cfg.sMax);
    const K = S0; // vente à la monnaie : gamma maximal, le cas d'école du ch5
    const vol = randInt(rng, 20, 34);
    const rTx = randFloat(rng, 2, 4, 1);
    const n = randInt(rng, cfg.nMin, cfg.nMax);
    const h1 = randFloat(rng, 3, 6, 1);
    const h2 = randFloat(rng, 3, 6, 1);
    const T = 0.25;
    const T1 = T - 1 / 52;
    const T2 = T - 2 / 52;
    const dS1 = r2((S0 * h1) / 100);
    const S1 = r2(S0 + dS1);
    const dS2 = r2((S1 * h2) / 100);
    const S2 = r2(S1 - dS2);

    const prime = blackScholesCall(S0, K, rTx, vol, T);
    const primeTot = prime * QUOTITE * n;
    const delta0 = deltaCall(S0, K, rTx, vol, T);
    const act0 = actionsDeltaHedge(delta0, n, QUOTITE);
    const delta1 = deltaCall(S1, K, rTx, vol, T1);
    const act1 = actionsDeltaHedge(delta1, n, QUOTITE);
    const achat1 = act1 - act0;
    const delta2 = deltaCall(S2, K, rTx, vol, T2);
    const act2 = actionsDeltaHedge(delta2, n, QUOTITE);
    const ajust2 = act2 - act1;
    const gamma0 = gammaOption(S0, K, rTx, vol, T);
    const gamma1 = gammaOption(S1, K, rTx, vol, T1);
    const perteG1 = -0.5 * gamma0 * dS1 * dS1 * QUOTITE * n;
    const perteG2 = -0.5 * gamma1 * dS2 * dS2 * QUOTITE * n;
    const perteTot = perteG1 + perteG2;
    const partPrime = (Math.abs(perteTot) / primeTot) * 100;
    const repPrime = r0(primeTot);
    const repAct0 = act0;
    const repAchat1 = achat1;
    const repPerte1 = r0(perteG1);
    const repAjust2 = ajust2;
    const repPart = r1(partPrime);

    const { en, f, pct, mnt } = outils(langue);
    const desc = en
      ? `the stock trades at ${mnt(S0, cfg.sym, 0)}; you SELL ${f(n, 0)} at-the-money calls of strike ${f(K, 0)}, 3 months (T = 0.25), implied volatility ${pct(vol, 0)}, rate ${pct(rTx, 1)} (contract size ${f(QUOTITE, 0)} shares); week 1, the stock jumps to ${mnt(S1, cfg.sym)} (+${f(h1, 1)}%); week 2, it falls back to ${mnt(S2, cfg.sym)} (−${f(h2, 1)}%)`
      : `l'action cote ${mnt(S0, cfg.sym, 0)} ; vous VENDEZ ${f(n, 0)} calls à la monnaie de strike ${f(K, 0)}, 3 mois (T = 0,25), volatilité implicite ${pct(vol, 0)}, taux ${pct(rTx, 1)} (quotité ${f(QUOTITE, 0)} actions) ; semaine 1, l'action saute à ${mnt(S1, cfg.sym)} (+${f(h1, 1)} %) ; semaine 2, elle retombe à ${mnt(S2, cfg.sym)} (−${f(h2, 1)} %)`;
    const contexte = (en
      ? [
        `You make markets on a CAC 40 name, and a client just lifted your offer: ${desc}. House rule, chapter 5: a sold option is hedged the minute it is booked, and re-hedged every time the delta moves. This week the stock will do a round trip — up, then back down — and your job is to price what that round trip costs a short-gamma book: the premium collected, the initial hedge, the two rebalances, and the bill the Greeks send you at the end.`,
        `Risk control asked you to audit the options desk's hedging cost on one simple position: ${desc}. The desk claims "the book is delta-neutral, nothing to report". Your audit walks the week step by step — hedge at inception, rebalance after the jump, rebalance after the fall — and quantifies, with the gamma approximation, what "neutral" actually cost when the stock moved twice.`,
        `The examiner draws the V-shaped week on the board: up ${f(h1, 1)}%, down ${f(h2, 1)}%. "The seller is delta-hedged. Show me why he still loses money." The data: ${desc}. He wants the premium, the initial hedge, the two rebalances share for share — buy high, sell low — and the gamma bill as a share of the premium collected.`,
      ]
      : [
        `Vous tenez le marché sur une valeur du CAC 40, et un client vient de lever votre offre : ${desc}. Règle maison, chapitre 5 : une option vendue se couvre à la minute où elle est bookée, et se recouvre chaque fois que le delta bouge. Cette semaine, l'action va faire un aller-retour — hausse, puis rechute — et votre travail est de chiffrer ce que cet aller-retour coûte à un book gamma négatif : la prime encaissée, le hedge initial, les deux réajustements, et la facture que les grecques envoient à la fin.`,
        `Le contrôle des risques vous demande d'auditer le coût de couverture du desk options sur une position simple : ${desc}. Le desk affirme « le book est delta-neutre, rien à signaler ». Votre audit refait la semaine pas à pas — couverture à l'initiation, réajustement après le saut, réajustement après la rechute — et quantifie, par l'approximation gamma, ce que « neutre » a réellement coûté quand l'action a bougé deux fois.`,
        `L'examinateur dessine la semaine en V au tableau : +${f(h1, 1)} %, puis −${f(h2, 1)} %. « Le vendeur est couvert en delta. Montrez-moi pourquoi il perd quand même de l'argent. » Les données : ${desc}. Il attend la prime, le hedge initial, les deux réajustements action par action — acheter haut, revendre bas — et la facture gamma en proportion de la prime encaissée.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The premium collected' : 'a) La prime encaissée',
          enonce: en
            ? `What total premium do the ${f(n, 0)} sold calls bring in, in ${cfg.sym} (Black-Scholes price)?`
            : `Quelle prime totale les ${f(n, 0)} calls vendus rapportent-ils, en ${cfg.sym} (prix Black-Scholes) ?`,
          reponse: repPrime, tolerance: Math.max(2, repPrime * 0.01), toleranceMode: 'absolu', unite: cfg.sym,
          etapes: [{
            titre: en ? 'The price of the insurance you just wrote' : "Le prix de l'assurance que vous venez de vendre",
            contenu: en
              ? `Black-Scholes at-the-money: C = ${mnt(r2(prime), cfg.sym)} per share, so ${f(r2(prime), 2)} × ${f(QUOTITE, 0)} × ${f(n, 0)} = **${mnt(repPrime, cfg.sym, 0)}** collected today. This premium is your salary for the whole trade: everything the hedging will cost must come out of it — theta pays you day after day, gamma sends the bills.`
              : `Black-Scholes à la monnaie : C = ${mnt(r2(prime), cfg.sym)} par action, donc ${f(r2(prime), 2)} × ${f(QUOTITE, 0)} × ${f(n, 0)} = **${mnt(repPrime, cfg.sym, 0)}** encaissés aujourd'hui. Cette prime est votre salaire pour tout le trade : tout ce que la couverture coûtera devra en sortir — le theta vous paie jour après jour, le gamma envoie les factures.`,
          }],
        },
        {
          intitule: en ? 'b) The initial hedge' : 'b) Le hedge initial',
          enonce: en
            ? `The delta of the sold calls must be neutralised. How many shares do you buy at ${mnt(S0, cfg.sym, 0)}?`
            : `Le delta des calls vendus doit être neutralisé. Combien d'actions achetez-vous à ${mnt(S0, cfg.sym, 0)} ?`,
          reponse: repAct0, tolerance: Math.max(2, repAct0 * 0.01), toleranceMode: 'absolu', unite: en ? 'shares' : 'actions',
          etapes: [{
            titre: en ? 'Delta × contracts × contract size' : 'Delta × contrats × quotité',
            contenu: en
              ? `Δ = N(d₁) = ${f(r2(delta0), 2)} (at the money, a touch above 0.5 — the r and σ²/2 terms push d₁ up). Sold calls leave the book short delta: you BUY ${f(r2(delta0), 2)} × ${f(n, 0)} × ${f(QUOTITE, 0)} = **${f(repAct0, 0)} shares**. At this instant, a small move in the stock changes nothing to the P&L — that is all "delta-neutral" promises: immunity to SMALL moves.`
              : `Δ = N(d₁) = ${f(r2(delta0), 2)} (à la monnaie, un peu au-dessus de 0,5 — les termes r et σ²/2 poussent d₁ vers le haut). Les calls vendus laissent le book delta négatif : vous ACHETEZ ${f(r2(delta0), 2)} × ${f(n, 0)} × ${f(QUOTITE, 0)} = **${f(repAct0, 0)} actions**. À cet instant, un petit mouvement de l'action ne change rien au P&L — c'est tout ce que « delta-neutre » promet : l'immunité aux PETITS mouvements.`,
          }],
          pieges: [en
            ? `Hedging a SOLD call by selling shares doubles the exposure instead of cancelling it: the seller of a call replicates by HOLDING delta shares — chapter 5's recipe read from the seller's side.`
            : `Couvrir un call VENDU en vendant des actions double l'exposition au lieu de l'annuler : le vendeur d'un call se réplique en DÉTENANT delta actions — la recette du chapitre 5 lue côté vendeur.`],
        },
        {
          intitule: en ? 'c) Rebalance 1: buying the rally' : 'c) Réajustement 1 : acheter la hausse',
          enonce: en
            ? `Week 1, the stock jumps to ${mnt(S1, cfg.sym)}. How many ADDITIONAL shares must the hedge buy (delta recomputed at T = 0.25 − 1/52)?`
            : `Semaine 1, l'action saute à ${mnt(S1, cfg.sym)}. Combien d'actions SUPPLÉMENTAIRES le hedge doit-il acheter (delta recalculé à T = 0,25 − 1/52) ?`,
          reponse: repAchat1, tolerance: Math.max(2, Math.abs(repAchat1) * 0.02), toleranceMode: 'absolu', unite: en ? 'shares' : 'actions',
          etapes: [{
            titre: en ? 'The delta ran away — chase it' : 'Le delta a filé — il faut le rattraper',
            contenu: en
              ? `New delta: Δ₁ = ${f(r2(delta1), 2)} (the call moved into the money, N(d₁) climbed). Target ${f(act1, 0)} shares, held ${f(act0, 0)}: BUY **${f(repAchat1, 0)} shares at ${mnt(S1, cfg.sym)}** — after the rise, at the top. That is not a choice: short gamma forces you to trade WITH the market, buying what just got expensive.`
              : `Nouveau delta : Δ₁ = ${f(r2(delta1), 2)} (le call est entré dans la monnaie, N(d₁) a grimpé). Cible ${f(act1, 0)} actions, détenues ${f(act0, 0)} : ACHETER **${f(repAchat1, 0)} actions à ${mnt(S1, cfg.sym)}** — après la hausse, au sommet. Ce n'est pas un choix : le gamma négatif vous force à traiter AVEC le marché, à acheter ce qui vient de devenir cher.`,
          }],
        },
        {
          intitule: en ? 'd) The gamma bill of jump 1' : 'd) La facture gamma du saut 1',
          enonce: en
            ? `Using the gamma approximation (seller's P&L ≈ −½ Γ (ΔS)² per share), what does the ${mnt(dS1, cfg.sym)} jump cost on the whole book, in ${cfg.sym} (negative = loss)?`
            : `Par l'approximation gamma (P&L du vendeur ≈ −½ Γ (ΔS)² par action), que coûte le saut de ${mnt(dS1, cfg.sym)} sur tout le book, en ${cfg.sym} (négatif = perte) ?`,
          reponse: repPerte1, tolerance: Math.max(2, Math.abs(repPerte1) * 0.03), toleranceMode: 'absolu', unite: cfg.sym,
          etapes: [{
            titre: en ? 'The curvature is the cost' : 'La courbure est le coût',
            contenu: en
              ? `$-\\tfrac{1}{2}\\Gamma (\\Delta S)^2$ = −0.5 × ${f(r2(gamma0 * 1000) / 1000, 4)} × ${f(dS1, 2)}² × ${f(QUOTITE, 0)} × ${f(n, 0)} = **${mnt(repPerte1, cfg.sym, 0)}**. The hedge was right for the FIRST cent of the move and increasingly wrong after: the loss grows with the SQUARE of the jump. Note what the formula does not contain: the direction. Up or down, (ΔS)² is positive — the short-gamma book loses on any big move.`
              : `$-\\tfrac{1}{2}\\Gamma (\\Delta S)^2$ = −0,5 × ${f(r2(gamma0 * 1000) / 1000, 4)} × ${f(dS1, 2)}² × ${f(QUOTITE, 0)} × ${f(n, 0)} = **${mnt(repPerte1, cfg.sym, 0)}**. Le hedge était juste pour le PREMIER centime du mouvement et de plus en plus faux ensuite : la perte croît avec le CARRÉ du saut. Voyez ce que la formule ne contient pas : la direction. Hausse ou baisse, (ΔS)² est positif — le book gamma négatif perd sur tout grand mouvement.`,
          }],
          pieges: [en
            ? `"The book is delta-neutral, so the move cost nothing" ignores the second order: delta protects against the move you had already priced; gamma bills the move itself.`
            : `« Le book est delta-neutre, donc le mouvement n'a rien coûté » ignore le second ordre : le delta protège du mouvement déjà pricé ; le gamma facture le mouvement lui-même.`],
        },
        {
          intitule: en ? 'e) Rebalance 2: selling the fall' : 'e) Réajustement 2 : revendre la baisse',
          enonce: en
            ? `Week 2, the stock falls back to ${mnt(S2, cfg.sym)}. What adjustment does the hedge require, in shares (negative = sell)?`
            : `Semaine 2, l'action retombe à ${mnt(S2, cfg.sym)}. Quel ajustement le hedge exige-t-il, en actions (négatif = vendre) ?`,
          reponse: repAjust2, tolerance: Math.max(2, Math.abs(repAjust2) * 0.02), toleranceMode: 'absolu', unite: en ? 'shares' : 'actions',
          etapes: [{
            titre: en ? 'Buy high, sell low — by construction' : 'Acheter haut, revendre bas — par construction',
            contenu: en
              ? `Δ₂ = ${f(r2(delta2), 2)}: target ${f(act2, 0)} shares, held ${f(act1, 0)} — SELL **${f(Math.abs(repAjust2), 0)} shares at ${mnt(S2, cfg.sym)}**, below the ${mnt(S1, cfg.sym)} where you had just bought. The round trip is complete: bought ${f(repAchat1, 0)} shares high, sold ${f(Math.abs(repAjust2), 0)} low. Short gamma turns every zig-zag of the stock into a small forced buy-high-sell-low — that, made systematic, is the hedging cost the premium must cover.`
              : `Δ₂ = ${f(r2(delta2), 2)} : cible ${f(act2, 0)} actions, détenues ${f(act1, 0)} — VENDRE **${f(Math.abs(repAjust2), 0)} actions à ${mnt(S2, cfg.sym)}**, sous le ${mnt(S1, cfg.sym)} où vous veniez d'acheter. L'aller-retour est complet : ${f(repAchat1, 0)} actions achetées haut, ${f(Math.abs(repAjust2), 0)} revendues bas. Le gamma négatif transforme chaque zigzag de l'action en un petit achat-haut-vente-bas forcé — c'est cela, systématisé, le coût de couverture que la prime doit payer.`,
          }],
        },
        {
          intitule: en ? 'f) Two weeks of gamma against the premium' : 'f) Deux semaines de gamma contre la prime',
          enonce: en
            ? `Adding the gamma bill of the second move (Γ recomputed at ${mnt(S1, cfg.sym)}), what share of the collected premium have the two jumps already consumed, in %?`
            : `En ajoutant la facture gamma du second mouvement (Γ recalculé à ${mnt(S1, cfg.sym)}), quelle part de la prime encaissée les deux sauts ont-ils déjà consommée, en % ?`,
          reponse: repPart, tolerance: Math.max(0.5, repPart * 0.05), toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'The two bills, summed' : 'Les deux factures, sommées',
              contenu: en
                ? `Move 2: −½ × ${f(r2(gamma1 * 1000) / 1000, 4)} × ${f(dS2, 2)}² × ${f(QUOTITE, 0)} × ${f(n, 0)} = ${mnt(r0(perteG2), cfg.sym, 0)}; total gamma bill = ${mnt(r0(perteTot), cfg.sym, 0)}, against ${mnt(repPrime, cfg.sym, 0)} of premium: **${pct(repPart, 1)}** consumed in two weeks — out of thirteen in the option's life.`
                : `Mouvement 2 : −½ × ${f(r2(gamma1 * 1000) / 1000, 4)} × ${f(dS2, 2)}² × ${f(QUOTITE, 0)} × ${f(n, 0)} = ${mnt(r0(perteG2), cfg.sym, 0)} ; facture gamma totale = ${mnt(r0(perteTot), cfg.sym, 0)}, contre ${mnt(repPrime, cfg.sym, 0)} de prime : **${pct(repPart, 1)}** consommés en deux semaines — sur les treize que vivra l'option.`,
            },
            {
              titre: en ? 'The verdict is a volatility comparison' : 'Le verdict est une comparaison de volatilités',
              contenu: en
                ? `Weekly moves of ${f(h1, 1)}% and ${f(h2, 1)}% annualise far above the ${pct(vol, 0)} implied you sold: the REALISED volatility is beating the implied, and the gamma bills are how the beating reaches your P&L. The theta you collect every day is the rent for exactly this risk: the seller wins if the stock moves LESS than the implied vol promised — that arbitration is the whole subject of the next problem.`
                : `Des mouvements hebdomadaires de ${f(h1, 1)} % et ${f(h2, 1)} % s'annualisent bien au-dessus des ${pct(vol, 0)} d'implicite que vous avez vendus : la volatilité RÉALISÉE bat l'implicite, et les factures gamma sont le chemin par lequel la correction atteint votre P&L. Le theta encaissé chaque jour est le loyer d'exactement ce risque : le vendeur gagne si l'action bouge MOINS que ce que la vol implicite promettait — cet arbitrage est tout le sujet du problème suivant.`,
            },
          ],
          pieges: [en
            ? `Comparing the gamma bill to the FULL premium flatters the seller: the premium must last thirteen weeks, and two ordinary jumps just ate ${pct(repPart, 1)} of it.`
            : `Comparer la facture gamma à la prime ENTIÈRE flatte le vendeur : la prime doit durer treize semaines, et deux sauts ordinaires viennent d'en manger ${pct(repPart, 1)}.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 12. m8-pb-12 — Implicite contre réalisée : le straddle — N3         */
/* ------------------------------------------------------------------ */
const impliciteRealisee: ProblemeMoule = {
  id: 'm8-pb-12', moduleId: M8,
  titre: 'Implicite contre réalisée : le procès du straddle',
  titreEn: 'Implied versus realised: the straddle on trial',
  typeDeCas: 'trading de volatilité',
  typeDeCasEn: 'volatility trading',
  difficulte: 3,
  scenarios: ["Le fonds d'arbitrage de volatilité et son écran de vols", 'Le desk prop qui achète la vol avant un trimestre agité', 'Grand oral : acheter de la volatilité, gagner comment ?'],
  scenariosEn: ['The volatility arbitrage fund and its vol screen', 'The prop desk buying vol before a stormy quarter', 'Final viva: buying volatility — and winning how?'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const S0 = randInt(rng, 90, 110);
    const K = S0;
    const rTx = randFloat(rng, 2, 4, 1);
    const T = 0.25;
    const volImp = randFloat(rng, 16, 24, 1);
    const volQuot = randFloat(rng, 0.9, 1.9, 2);
    const n = randInt(rng, 20, 80);
    const dir = pick(rng, [1, -1] as const);
    const ampl = randFloat(rng, 0.7, 1.5, 2);

    const call = blackScholesCall(S0, K, rTx, volImp, T);
    const put = blackScholesPut(S0, K, rTx, volImp, T);
    const cout = call + put;
    const coutTot = cout * QUOTITE * n;
    const bornes = pointsMortsStraddle(K, r2(cout));
    const volReal = volAnnualiseePct(volQuot);
    const vegaStraddle = 2 * vegaOption(S0, K, rTx, volImp, T);
    const vegaTot = vegaStraddle * QUOTITE * n;
    const ecartVol = volReal - volImp;
    const gainMark = vegaTot * ecartVol;
    const coutReal = blackScholesCall(S0, K, rTx, r2(volReal), T) + blackScholesPut(S0, K, rTx, r2(volReal), T);
    const gainExact = (coutReal - cout) * QUOTITE * n;
    const move = S0 * (volReal / 100) * Math.sqrt(T) * ampl;
    const sT = r2(K + dir * move);
    const payoffT = payoffCall(sT, K) + payoffPut(sT, K);
    const pnlEch = pnlOption(payoffT, cout, 1) * QUOTITE * n;
    const gagneVol = ecartVol > 0;
    const gagneEch = pnlEch > 0;
    const repCout = r0(coutTot);
    const repBe = r2(bornes.haut);
    const repVolReal = r1(volReal);
    const repVega = r0(vegaTot);
    const repMark = r0(gainMark);
    const repEch = r0(pnlEch);

    const { en, f, pct, mnt } = outils(langue);
    const sym = '€';
    const desc = en
      ? `the stock trades at ${mnt(S0, sym, 0)}; the 3-month at-the-money straddle (T = 0.25) quotes at ${pct(volImp, 1)} implied volatility — call ${mnt(r2(call), sym)}, put ${mnt(r2(put), sym)} — and you BUY ${f(n, 0)} of them (contract size ${f(QUOTITE, 0)}); rate ${pct(rTx, 1)}; over the quarter the realised DAILY volatility comes out at ${pct(volQuot, 2)} per day, and at expiry the stock finishes at ${mnt(sT, sym)}`
      : `l'action cote ${mnt(S0, sym, 0)} ; le straddle 3 mois à la monnaie (T = 0,25) se traite à ${pct(volImp, 1)} de volatilité implicite — call ${mnt(r2(call), sym)}, put ${mnt(r2(put), sym)} — et vous en ACHETEZ ${f(n, 0)} (quotité ${f(QUOTITE, 0)}) ; taux ${pct(rTx, 1)} ; sur le trimestre, la volatilité QUOTIDIENNE réalisée ressort à ${pct(volQuot, 2)} par jour, et à l'échéance l'action finit à ${mnt(sT, sym)}`;
    const contexte = (en
      ? [
        `The vol screen at the arbitrage fund shows a gap between what the market charges and what the stock actually does: ${desc}. The house method never changes: price the straddle, place its break-evens, convert the daily realised into annual terms (module 2's √252), measure the position in vega — and only then judge the trade, on BOTH clocks: the mark-to-market if implied reprices, and the payoff if you hold to the end.`,
        `Earnings season promises chaos and the prop desk wants to own volatility before it is repriced: ${desc}. The head of desk signs off only on a full file: total cost, break-evens, the realised-vol conversion, the vega — and the two ways the trade can be judged, because "being right on the vol" and "making money at expiry" are two different sentences.`,
        `The examiner is direct: "You buy a straddle. The realised volatility turns out ${pct(volQuot, 2)} a day. Did you win?" The data: ${desc}. He wants the cost, the break-evens, the annualisation, the vega in euros per vol point, the repricing P&L — and the expiry P&L, because the two do not have to agree, and explaining WHY they disagree is the whole answer.`,
      ]
      : [
        `L'écran de vols du fonds d'arbitrage affiche un écart entre ce que le marché fait payer et ce que l'action fait vraiment : ${desc}. La méthode maison ne varie pas : pricer le straddle, poser ses points morts, convertir la réalisée quotidienne en annuel (le √252 du module 2), mesurer la position en vega — et alors seulement juger le trade, sur les DEUX horloges : le re-marquage si l'implicite se re-price, et le payoff si l'on tient jusqu'au bout.`,
        `La saison des résultats promet du chaos et le desk prop veut détenir de la volatilité avant qu'elle ne soit re-pricée : ${desc}. Le chef de desk ne signe que sur dossier complet : coût total, points morts, conversion de la vol réalisée, vega — et les deux façons de juger le trade, car « avoir raison sur la vol » et « gagner à l'échéance » sont deux phrases différentes.`,
        `L'examinateur est direct : « Vous achetez un straddle. La volatilité réalisée ressort à ${pct(volQuot, 2)} par jour. Avez-vous gagné ? » Les données : ${desc}. Il attend le coût, les points morts, l'annualisation, le vega en euros par point de vol, le P&L de re-pricing — et le P&L à l'échéance, car les deux n'ont aucune obligation d'être d'accord, et expliquer POURQUOI ils divergent est toute la réponse.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The cost of owning both sides' : 'a) Le coût de détenir les deux côtés',
          enonce: en
            ? `What do the ${f(n, 0)} straddles cost in total, in ${sym}?`
            : `Que coûtent les ${f(n, 0)} straddles au total, en ${sym} ?`,
          reponse: repCout, tolerance: Math.max(2, repCout * 0.01), toleranceMode: 'absolu', unite: sym,
          etapes: [{
            titre: en ? 'Call plus put, same strike, same expiry' : 'Call plus put, même strike, même échéance',
            contenu: en
              ? `(${f(r2(call), 2)} + ${f(r2(put), 2)}) × ${f(QUOTITE, 0)} × ${f(n, 0)} = **${mnt(repCout, sym, 0)}**. You own the right to a big move in EITHER direction — what you are short of is calm: every quiet day, theta clips the position. A straddle is not a market view; it is a bet that ${pct(volImp, 1)} understates the storm.`
              : `(${f(r2(call), 2)} + ${f(r2(put), 2)}) × ${f(QUOTITE, 0)} × ${f(n, 0)} = **${mnt(repCout, sym, 0)}**. Vous détenez le droit à un grand mouvement dans LES DEUX sens — ce qui vous manque, c'est le calme : chaque journée tranquille, le theta rogne la position. Un straddle n'est pas une vue de marché ; c'est un pari que ${pct(volImp, 1)} sous-estime la tempête.`,
          }],
        },
        {
          intitule: en ? 'b) The upper break-even' : 'b) Le point mort haut',
          enonce: en
            ? `Above what price at expiry does the straddle make money, in ${sym}?`
            : `Au-dessus de quel cours à l'échéance le straddle gagne-t-il, en ${sym} ?`,
          reponse: repBe, tolerance: 0.05, toleranceMode: 'absolu', unite: sym,
          etapes: [{
            titre: en ? 'Strike plus the whole double premium' : 'Le strike plus toute la double prime',
            contenu: en
              ? `K ± total cost: upper break-even = ${f(K, 0)} + ${f(r2(cout), 2)} = **${mnt(repBe, sym)}**, lower = ${mnt(r2(bornes.bas), sym)}. The corridor of death is ${f(r2(2 * cout), 2)} wide — ${pct(r1((2 * cout / S0) * 100), 1)} of the spot. Anything that finishes inside it loses at expiry, however agitated the path was: the break-evens judge the DESTINATION only.`
              : `K ± coût total : point mort haut = ${f(K, 0)} + ${f(r2(cout), 2)} = **${mnt(repBe, sym)}**, bas = ${mnt(r2(bornes.bas), sym)}. Le corridor de la mort fait ${f(r2(2 * cout), 2)} de large — ${pct(r1((2 * cout / S0) * 100), 1)} du spot. Tout ce qui finit dedans perd à l'échéance, aussi agité le chemin fût-il : les points morts ne jugent que la DESTINATION.`,
          }],
          pieges: [en
            ? `Placing the break-even at K + call premium forgets you paid for TWO options: the stock must repay the put too.`
            : `Mettre le point mort à K + prime du call oublie que vous avez payé DEUX options : l'action doit aussi rembourser le put.`],
        },
        {
          intitule: en ? 'c) The realised, annualised' : 'c) La réalisée, annualisée',
          enonce: en
            ? `The realised daily volatility is ${pct(volQuot, 2)}. What is it in annual terms (√252 convention), in % (1 decimal)?`
            : `La volatilité quotidienne réalisée est ${pct(volQuot, 2)}. Que vaut-elle en termes annuels (convention √252), en % (1 décimale) ?`,
          reponse: repVolReal, tolerance: 0.2, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Module 2\'s square root of time' : 'La racine du temps du module 2',
            contenu: en
              ? `σ_annual = ${f(volQuot, 2)} × √252 = **${pct(repVolReal, 1)}**, against ${pct(volImp, 1)} implied at inception: the market ${gagneVol ? 'UNDER-charged the storm — realised beats implied' : 'OVER-charged the calm — implied beats realised'} by ${f(r1(Math.abs(ecartVol)), 1)} points. This one comparison is the entire economics of volatility trading: the option seller's margin is the average gap between the two (chapter 6) — and you are on the other side of it.`
              : `σ_annuelle = ${f(volQuot, 2)} × √252 = **${pct(repVolReal, 1)}**, contre ${pct(volImp, 1)} d'implicite à l'initiation : le marché ${gagneVol ? 'a SOUS-facturé la tempête — la réalisée bat l\'implicite' : 'a SUR-facturé le calme — l\'implicite bat la réalisée'} de ${f(r1(Math.abs(ecartVol)), 1)} points. Cette seule comparaison est toute l'économie du trading de volatilité : la marge du vendeur d'options est l'écart moyen entre les deux (chapitre 6) — et vous êtes de l'autre côté.`,
          }],
        },
        {
          intitule: en ? 'd) The position, measured in vega' : 'd) La position, mesurée en vega',
          enonce: en
            ? `By how much does the value of the whole position move for ONE point of implied volatility, in ${sym}?`
            : `De combien la valeur de toute la position bouge-t-elle pour UN point de volatilité implicite, en ${sym} ?`,
          reponse: repVega, tolerance: Math.max(2, repVega * 0.02), toleranceMode: 'absolu', unite: en ? `${sym}/point` : `${sym}/point`,
          etapes: [{
            titre: en ? 'Twice the vega — call and put pull together' : 'Deux fois le vega — call et put tirent ensemble',
            contenu: en
              ? `Vega is IDENTICAL for call and put (parity, chapter 5): straddle vega = 2 × ${f(r2(vegaOption(S0, K, rTx, volImp, T)), 2)} per share, so × ${f(QUOTITE, 0)} × ${f(n, 0)} = **${mnt(repVega, sym, 0)} per vol point**. This is the honest size of the trade: not "${f(n, 0)} straddles" but "${mnt(repVega, sym, 0)} a point" — desks set their limits in vega, not in contracts.`
              : `Le vega est IDENTIQUE pour le call et le put (parité, chapitre 5) : vega du straddle = 2 × ${f(r2(vegaOption(S0, K, rTx, volImp, T)), 2)} par action, donc × ${f(QUOTITE, 0)} × ${f(n, 0)} = **${mnt(repVega, sym, 0)} par point de vol**. C'est la taille honnête du trade : pas « ${f(n, 0)} straddles » mais « ${mnt(repVega, sym, 0)} le point » — les desks fixent leurs limites en vega, pas en contrats.`,
          }],
        },
        {
          intitule: en ? 'e) If implied joins realised' : "e) Si l'implicite rejoint la réalisée",
          enonce: en
            ? `The market reprices the implied at the realised level (${pct(repVolReal, 1)}). Using the vega, what is the mark-to-market P&L, sign included, in ${sym}?`
            : `Le marché re-price l'implicite au niveau de la réalisée (${pct(repVolReal, 1)}). Par le vega, quel est le P&L de re-marquage, signe compris, en ${sym} ?`,
          reponse: repMark, tolerance: Math.max(5, Math.abs(repMark) * 0.06), toleranceMode: 'absolu', unite: sym,
          etapes: [{
            titre: en ? 'Vega times the vol gap' : "Le vega fois l'écart de vol",
            contenu: en
              ? `P&L ≈ ${mnt(repVega, sym, 0)} × (${f(repVolReal, 1)} − ${f(volImp, 1)}) = **${mnt(repMark, sym, 0)}**${gagneVol ? '' : ' — a loss: you bought a storm the market stopped believing in'}. Exact repricing gives ${mnt(r0(gainExact), sym, 0)} (vega itself moves with σ; the linear estimate is the desk's reflex, the pricer does the rest). Note what changed: nothing happened to the stock — the PRICE OF RISK moved, and vega converted it to cash.`
              : `P&L ≈ ${mnt(repVega, sym, 0)} × (${f(repVolReal, 1)} − ${f(volImp, 1)}) = **${mnt(repMark, sym, 0)}**${gagneVol ? '' : ' — une perte : vous avez acheté une tempête à laquelle le marché a cessé de croire'}. Le re-pricing exact donne ${mnt(r0(gainExact), sym, 0)} (le vega bouge lui-même avec σ ; l'estimation linéaire est le réflexe du desk, le pricer fait le reste). Voyez ce qui a changé : rien n'est arrivé à l'action — le PRIX DU RISQUE a bougé, et le vega l'a converti en cash.`,
          }],
        },
        {
          intitule: en ? 'f) The expiry verdict — two clocks, two answers' : 'f) Le verdict à l\'échéance — deux horloges, deux réponses',
          enonce: en
            ? `Held to expiry with the stock at ${mnt(sT, sym)}, what is the total P&L, sign included, in ${sym}?`
            : `Tenu jusqu'à l'échéance avec l'action à ${mnt(sT, sym)}, quel est le P&L total, signe compris, en ${sym} ?`,
          reponse: repEch, tolerance: Math.max(5, Math.abs(repEch) * 0.02), toleranceMode: 'absolu', unite: sym,
          etapes: [
            {
              titre: en ? 'The destination, netted of the double premium' : 'La destination, nette de la double prime',
              contenu: en
                ? `Payoff = max(S_T − K, 0) + max(K − S_T, 0) = ${f(r2(payoffT), 2)}; P&L = (${f(r2(payoffT), 2)} − ${f(r2(cout), 2)}) × ${f(QUOTITE, 0)} × ${f(n, 0)} = **${mnt(repEch, sym, 0)}**. The stock finished ${f(r2(Math.abs(sT - K)), 2)} away from the strike, against a corridor half-width of ${f(r2(cout), 2)}: ${gagneEch ? 'outside the corridor — the destination paid' : 'inside the corridor — the destination did not repay the premium'}.`
                : `Payoff = max(S_T − K, 0) + max(K − S_T, 0) = ${f(r2(payoffT), 2)} ; P&L = (${f(r2(payoffT), 2)} − ${f(r2(cout), 2)}) × ${f(QUOTITE, 0)} × ${f(n, 0)} = **${mnt(repEch, sym, 0)}**. L'action a fini à ${f(r2(Math.abs(sT - K)), 2)} du strike, contre un demi-corridor de ${f(r2(cout), 2)} : ${gagneEch ? 'hors du corridor — la destination a payé' : 'dans le corridor — la destination n\'a pas remboursé la prime'}.`,
            },
            {
              titre: en ? 'Why the two clocks may disagree' : 'Pourquoi les deux horloges peuvent diverger',
              contenu: en
                ? `${gagneVol === gagneEch
                  ? `Here the two verdicts agree — but they did not have to.`
                  : `Here the two verdicts DISAGREE: ${gagneVol ? 'right on the vol, losing at expiry' : 'wrong on the vol, saved by the destination'}.`} A long straddle held to expiry is paid on the ARRIVAL POINT; the volatility thesis is paid on the PATH — either by re-selling when implied reprices, or by delta-hedging the straddle and harvesting the moves day after day (the seller's gamma bill of the previous problem, received instead of paid). A vol trader who does not hedge his delta is not trading volatility; he is trading a destination and calling it volatility.`
                : `${gagneVol === gagneEch
                  ? `Ici les deux verdicts concordent — mais rien ne les y obligeait.`
                  : `Ici les deux verdicts DIVERGENT : ${gagneVol ? 'raison sur la vol, perdant à l\'échéance' : 'tort sur la vol, sauvé par la destination'}.`} Un straddle tenu à l'échéance est payé sur le POINT D'ARRIVÉE ; la thèse de volatilité se paie sur le CHEMIN — soit en revendant quand l'implicite se re-price, soit en delta-hedgeant le straddle pour récolter les mouvements jour après jour (la facture gamma du problème précédent, reçue au lieu de payée). Un trader de vol qui ne couvre pas son delta ne trade pas la volatilité ; il trade une destination et l'appelle volatilité.`,
            },
          ],
          pieges: [en
            ? `"Realised beat implied, so the straddle won" confuses the two clocks: unhedged and held to expiry, only |S_T − K| against the double premium decides.`
            : `« La réalisée a battu l'implicite, donc le straddle a gagné » confond les deux horloges : non couvert et tenu à l'échéance, seul |S_T − K| face à la double prime décide.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 13. m8-pb-13 — Lire le smile : trois strikes, trois vols — N3       */
/* ------------------------------------------------------------------ */
const lectureSmile: ProblemeMoule = {
  id: 'm8-pb-13', moduleId: M8,
  titre: 'Lire le smile : trois strikes, trois volatilités',
  titreEn: 'Reading the smile: three strikes, three volatilities',
  typeDeCas: 'smile et skew',
  typeDeCasEn: 'smile and skew',
  difficulte: 3,
  scenarios: ['Le junior qui calibre le smile du matin sur indice', "La gérante qui trouve les puts « trop chers »", 'Grand oral : la cicatrice de 1987 sur trois strikes'],
  scenariosEn: ['The junior calibrating the morning index smile', 'The fund manager who finds the puts "too expensive"', 'Final viva: the 1987 scar across three strikes'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const S = randInt(rng, 46, 54) * 100;
    const K1 = Math.round((S * 0.9) / 100) * 100;
    const K2 = Math.round(S / 100) * 100;
    const K3 = Math.round((S * 1.1) / 100) * 100;
    const rTx = randFloat(rng, 2, 4, 1);
    const T = 0.25;
    const volAtm = randFloat(rng, 17, 22, 1);
    const vol90 = r1(volAtm + randFloat(rng, 4, 8, 1));
    const vol110 = r1(volAtm - randFloat(rng, 1, 3, 1));
    const n = randInt(rng, 20, 60);

    const c90 = r2(blackScholesCall(S, K1, rTx, vol90, T));
    const cAtm = r2(blackScholesCall(S, K2, rTx, volAtm, T));
    const c110 = r2(blackScholesCall(S, K3, rTx, vol110, T));
    const iv90 = volImplicitePct(c90, S, K1, rTx, T);
    const ivAtm = volImplicitePct(cAtm, S, K2, rTx, T);
    const iv110 = volImplicitePct(c110, S, K3, rTx, T);
    const skew = iv90 - iv110;
    const putMkt = putDepuisParite(c90, S, K1, rTx, T);
    const putNaif = blackScholesPut(S, K1, rTx, volAtm, T);
    const erreur = putMkt - putNaif;
    const book = erreur * QUOTITE * n;
    const repIvAtm = r1(ivAtm);
    const repIv90 = r1(iv90);
    const repIv110 = r1(iv110);
    const repSkew = r1(skew);
    const repErreur = r2(erreur);
    const repBook = r0(book);

    const { en, f, pct, mnt } = outils(langue);
    const sym = '€';
    const desc = en
      ? `the index trades at ${f(S, 0)} points; three 3-month calls (T = 0.25, rate ${pct(rTx, 1)}, €10-per-point contracts here quoted per unit of index) show on screen: strike ${f(K1, 0)} at ${f(c90, 2)} points, strike ${f(K2, 0)} at ${f(cAtm, 2)} points, strike ${f(K3, 0)} at ${f(c110, 2)} points`
      : `l'indice cote ${f(S, 0)} points ; trois calls 3 mois (T = 0,25, taux ${pct(rTx, 1)}, cotés ici par unité d'indice) s'affichent à l'écran : strike ${f(K1, 0)} à ${f(c90, 2)} points, strike ${f(K2, 0)} à ${f(cAtm, 2)} points, strike ${f(K3, 0)} à ${f(c110, 2)} points`;
    const contexte = (en
      ? [
        `First job of the morning on the index desk: rebuild the smile from the screen before the sales calls start. ${desc}. One Black-Scholes, one price, one implied vol per strike — the pricer inverts, you interpret. The head of desk wants the three vols, the shape they draw, and the price of the classic mistake: quoting the out-of-the-money put with the at-the-money vol.`,
        `A fund manager wants to insure her portfolio and finds the 10%-out-of-the-money puts "scandalously expensive": ${desc}. Before negotiating, she asks you to translate the three prices into the only language that makes them comparable — implied volatility — and to quantify exactly how much of the put's price is the smile, not the model.`,
        `The examiner writes three strikes and three prices, nothing else: ${desc}. "Same underlying, same expiry, one model. Extract the three implied volatilities and tell me what their shape says — and what it costs to ignore it." He expects the inversion, the smirk, the 1987 scar, and the mispricing in points and in euros.`,
      ]
      : [
        `Premier travail du matin au desk indice : reconstruire le smile depuis l'écran avant les appels des vendeurs. ${desc}. Un Black-Scholes, un prix, une vol implicite par strike — le pricer inverse, vous interprétez. Le chef de desk veut les trois vols, la forme qu'elles dessinent, et le prix de l'erreur classique : coter le put hors de la monnaie avec la vol à la monnaie.`,
        `Une gérante veut assurer son portefeuille et trouve les puts 10 % hors de la monnaie « scandaleusement chers » : ${desc}. Avant de négocier, elle vous demande de traduire les trois prix dans la seule langue qui les rende comparables — la volatilité implicite — et de chiffrer exactement quelle part du prix du put est le smile, pas le modèle.`,
        `L'examinateur écrit trois strikes et trois prix, rien d'autre : ${desc}. « Même sous-jacent, même échéance, un seul modèle. Extrayez les trois volatilités implicites et dites-moi ce que leur forme raconte — et ce qu'ignorer cette forme coûte. » Il attend l'inversion, le smirk, la cicatrice de 1987, et l'erreur de pricing en points et en euros.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The at-the-money vol' : 'a) La vol à la monnaie',
          enonce: en
            ? `What implied volatility does the ${f(cAtm, 2)}-point price of the strike-${f(K2, 0)} call carry, in % (1 decimal)?`
            : `Quelle volatilité implicite le prix de ${f(cAtm, 2)} points du call strike ${f(K2, 0)} porte-t-il, en % (1 décimale) ?`,
          reponse: repIvAtm, tolerance: 0.4, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The price is read in vol' : 'Le prix se lit en vol',
            contenu: en
              ? `Implied volatility is the unique σ such that BS(S, K, r, σ, T) = quoted price — the Black-Scholes price is strictly increasing in σ, so the inversion (your pricer's bisection) has one answer: **${pct(repIvAtm, 1)}**. Desks quote and think in this number, not in points: "the 3-month trades at ${f(repIvAtm, 1)}" is a complete sentence (chapter 6).`
              : `La volatilité implicite est l'unique σ tel que BS(S, K, r, σ, T) = prix coté — le prix Black-Scholes est strictement croissant en σ, donc l'inversion (la dichotomie de votre pricer) a une seule réponse : **${pct(repIvAtm, 1)}**. Les desks cotent et pensent dans ce nombre, pas en points : « le 3 mois se traite à ${f(repIvAtm, 1)} » est une phrase complète (chapitre 6).`,
          }],
        },
        {
          intitule: en ? 'b) The 90% strike — the insurance side' : "b) Le strike 90 % — le côté assurance",
          enonce: en
            ? `Same inversion on the strike-${f(K1, 0)} call quoted ${f(c90, 2)}: what implied vol, in %?`
            : `Même inversion sur le call strike ${f(K1, 0)} coté ${f(c90, 2)} : quelle vol implicite, en % ?`,
          reponse: repIv90, tolerance: 0.4, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Low strikes trade RICH' : 'Les strikes bas se paient CHER',
            contenu: en
              ? `**${pct(repIv90, 1)}** — ${f(r1(iv90 - ivAtm), 1)} points ABOVE the at-the-money. By parity, the call and the put of strike ${f(K1, 0)} carry the SAME implied vol: what is expensive at this strike is downside protection. One model, one underlying, one expiry — and the market refuses the single-σ assumption.`
              : `**${pct(repIv90, 1)}** — ${f(r1(iv90 - ivAtm), 1)} points AU-DESSUS de la monnaie. Par parité, le call et le put de strike ${f(K1, 0)} portent la MÊME vol implicite : ce qui se paie cher à ce strike, c'est la protection contre la baisse. Un modèle, un sous-jacent, une échéance — et le marché refuse l'hypothèse du σ unique.`,
          }],
          pieges: [en
            ? `"The put is expensive but the call at the same strike is fine" cannot happen: parity ties them — one strike, ONE implied vol, whatever the option type.`
            : `« Le put est cher mais le call du même strike est correct » est impossible : la parité les lie — un strike, UNE vol implicite, quel que soit le type d'option.`],
        },
        {
          intitule: en ? 'c) The 110% strike — the quiet side' : 'c) Le strike 110 % — le côté calme',
          enonce: en
            ? `And the strike-${f(K3, 0)} call quoted ${f(c110, 2)}: what implied vol, in %?`
            : `Et le call strike ${f(K3, 0)} coté ${f(c110, 2)} : quelle vol implicite, en % ?`,
          reponse: repIv110, tolerance: 0.4, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The smirk, complete' : 'Le smirk, au complet',
            contenu: en
              ? `**${pct(repIv110, 1)}** — slightly BELOW the money. The three points now draw the equity-index signature: high on the left, sliding down to the right — a SMIRK more than a smile. The market prices crashes as more likely (and more feared) than rallies of the same size: lognormal Black-Scholes does not believe that; option PRICES do.`
              : `**${pct(repIv110, 1)}** — légèrement SOUS la monnaie. Les trois points dessinent maintenant la signature des indices actions : haut à gauche, glissant vers la droite — un SMIRK plus qu'un smile. Le marché price les krachs comme plus probables (et plus craints) que les rallyes de même taille : le Black-Scholes lognormal n'y croit pas ; les PRIX d'options, si.`,
          }],
        },
        {
          intitule: en ? 'd) The slope of fear' : 'd) La pente de la peur',
          enonce: en
            ? `What is the 90/110 skew — implied vol at ${f(K1, 0)} minus implied vol at ${f(K3, 0)} — in vol points?`
            : `Que vaut le skew 90/110 — vol implicite en ${f(K1, 0)} moins vol implicite en ${f(K3, 0)} — en points de vol ?`,
          reponse: repSkew, tolerance: 0.5, toleranceMode: 'absolu', unite: 'points',
          etapes: [{
            titre: en ? 'A number desks quote daily' : 'Un nombre que les desks cotent chaque jour',
            contenu: en
              ? `${f(repIv90, 1)} − ${f(repIv110, 1)} = **${f(repSkew, 1)} points** of skew. Before October 19, 1987, this number was roughly ZERO — the smile was flat, as the model assumed. Since the crash (Dow −22.6% in one session, chapter 7), the market has never again believed in symmetric moves: the skew is the scar, re-quoted every morning for nearly forty years. A steepening skew reads as rising crash fear — it is a risk thermometer as much as a price.`
              : `${f(repIv90, 1)} − ${f(repIv110, 1)} = **${f(repSkew, 1)} points** de skew. Avant le 19 octobre 1987, ce nombre valait à peu près ZÉRO — le smile était plat, comme le modèle le suppose. Depuis le krach (Dow −22,6 % en une séance, chapitre 7), le marché n'a plus jamais cru aux mouvements symétriques : le skew est la cicatrice, recotée chaque matin depuis bientôt quarante ans. Un skew qui se pentifie se lit comme une peur du krach qui monte — c'est un thermomètre de risque autant qu'un prix.`,
          }],
        },
        {
          intitule: en ? 'e) The price of ignoring the smile' : "e) Le prix d'ignorer le smile",
          enonce: en
            ? `A junior quotes the strike-${f(K1, 0)} PUT with the at-the-money vol (${pct(volAtm, 1)}). By how many points does he under-price it against the market (put deduced from the quoted call by parity)?`
            : `Un junior cote le PUT de strike ${f(K1, 0)} avec la vol à la monnaie (${pct(volAtm, 1)}). De combien de points le sous-price-t-il par rapport au marché (put déduit du call coté par parité) ?`,
          reponse: repErreur, tolerance: Math.max(0.3, repErreur * 0.05), toleranceMode: 'absolu', unite: 'points',
          etapes: [{
            titre: en ? 'Two puts, one strike, two vols' : 'Deux puts, un strike, deux vols',
            contenu: en
              ? `Market put (parity on the quoted call): P = C − S + K·e^{−rT} = ${f(r2(putMkt), 2)} points; naive put at ${pct(volAtm, 1)}: ${f(r2(putNaif), 2)} points. Gap = **${f(repErreur, 2)} points** — ${pct(r0((erreur / putNaif) * 100), 0)} of the naive price. The smile is not a decoration on the model; at this strike it IS a large share of the price.`
              : `Put de marché (parité sur le call coté) : P = C − S + K·e^{−rT} = ${f(r2(putMkt), 2)} points ; put naïf à ${pct(volAtm, 1)} : ${f(r2(putNaif), 2)} points. Écart = **${f(repErreur, 2)} points** — ${pct(r0((erreur / putNaif) * 100), 0)} du prix naïf. Le smile n'est pas une décoration sur le modèle ; à ce strike, il EST une grande part du prix.`,
          }],
          pieges: [en
            ? `The junior's price is not "wrong by a model": it is an arbitrage GIFT — clients would buy his cheap puts and resell at market all day long.`
            : `Le prix du junior n'est pas « faux selon un modèle » : c'est un CADEAU d'arbitrage — les clients achèteraient ses puts bon marché et les revendraient au marché toute la journée.`],
        },
        {
          intitule: en ? 'f) The same mistake, at book scale' : 'f) La même erreur, à l\'échelle du book',
          enonce: en
            ? `Selling ${f(n, 0)} contracts (${f(QUOTITE, 0)} units each) at the naive price, what does the desk hand to the market instantly, in ${sym}?`
            : `En vendant ${f(n, 0)} contrats (quotité ${f(QUOTITE, 0)}) au prix naïf, que donne le desk au marché instantanément, en ${sym} ?`,
          reponse: repBook, tolerance: Math.max(10, repBook * 0.05), toleranceMode: 'absolu', unite: sym,
          etapes: [
            {
              titre: en ? 'Points times size' : 'Les points fois la taille',
              contenu: en
                ? `${f(repErreur, 2)} × ${f(QUOTITE, 0)} × ${f(n, 0)} = **${mnt(repBook, sym, 0)}** of negative mark-to-market the second the tickets print: buyers pay the naive price and hold something worth the market price. No scenario, no luck involved — the loss is booked at inception.`
                : `${f(repErreur, 2)} × ${f(QUOTITE, 0)} × ${f(n, 0)} = **${mnt(repBook, sym, 0)}** de mark-to-market négatif à la seconde où les tickets s'impriment : les acheteurs paient le prix naïf et détiennent ce qui vaut le prix de marché. Aucun scénario, aucune chance là-dedans — la perte est comptabilisée dès l'initiation.`,
            },
            {
              titre: en ? 'What the smile is FOR' : 'À quoi sert le smile',
              contenu: en
                ? `The professional reading: Black-Scholes is not "wrong", it is the QUOTATION LANGUAGE — one vol per strike, and the whole surface carries what the model alone cannot (fat tails, crash fear, supply and demand for protection). The manager of scenario 2 gets her answer too: the put is not overpriced by a greedy seller; it is priced by a market that remembers 1987 — and that memory, quantified, is the ${f(repSkew, 1)} points of question d).`
                : `La lecture professionnelle : Black-Scholes n'est pas « faux », c'est la LANGUE DE COTATION — une vol par strike, et la surface entière porte ce que le modèle seul ne peut pas (queues épaisses, peur du krach, offre et demande de protection). La gérante du scénario 2 a aussi sa réponse : le put n'est pas surfacturé par un vendeur avide ; il est pricé par un marché qui se souvient de 1987 — et cette mémoire, chiffrée, ce sont les ${f(repSkew, 1)} points de la question d).`,
            },
          ],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 14. m8-pb-14 — Le collar « coût zéro » — N3                         */
/* ------------------------------------------------------------------ */
const collarCoutZero: ProblemeMoule = {
  id: 'm8-pb-14', moduleId: M8,
  titre: 'Le collar « coût zéro » : le plancher payé en plafond',
  titreEn: 'The "zero-cost" collar: a floor paid for with a cap',
  typeDeCas: "couverture optionnelle d'entreprise",
  typeDeCasEn: 'corporate option hedging',
  difficulte: 3,
  scenarios: ["Le DAF et la participation à céder dans un an", 'Le family office et la ligne du fondateur', 'Grand oral : démonter un « coût zéro »'],
  scenariosEn: ['The CFO and the stake to be sold in a year', "The family office and the founder's line", 'Final viva: dismantling a "zero cost"'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const S0 = randInt(rng, 40, 80);
    const kp = Math.round(S0 * randFloat(rng, 0.86, 0.92, 2));
    const kc = Math.round(S0 * randFloat(rng, 1.08, 1.16, 2));
    const vol = randFloat(rng, 20, 30, 1);
    const rTx = randFloat(rng, 2, 4, 1);
    const T = 1;
    const nbActions = randInt(rng, 50, 200) * 1000;
    const sUp = r2(kc * (1 + randFloat(rng, 0.08, 0.2, 2)));
    const sDown = r2(kp * (1 - randFloat(rng, 0.1, 0.25, 2)));

    const put = blackScholesPut(S0, kp, rTx, vol, T);
    const call = blackScholesCall(S0, kc, rTx, vol, T);
    const netPS = put - call;
    const putTotK = (put * nbActions) / 1000;
    const callTotK = (call * nbActions) / 1000;
    const netK = (netPS * nbActions) / 1000;
    const plancher = kp - netPS;
    const plafond = kc - netPS;
    const manqueK = ((sUp - kc) * nbActions) / 1000;
    const pnlCrashCouvert = (plancher - S0) * nbActions;
    const pnlCrashNu = (sDown - S0) * nbActions;
    const repPut = r1(putTotK);
    const repCall = r1(callTotK);
    const repNet = r1(netK);
    const repPlancher = r2(plancher);
    const repPlafond = r2(plafond);
    const repManque = r0(manqueK);

    const { en, f, pct, mnt } = outils(langue);
    const sym = '€';
    const desc = en
      ? `the line holds ${f(nbActions, 0)} shares trading at ${mnt(S0, sym, 0)}; over 1 year (rate ${pct(rTx, 1)}, vol ${pct(vol, 1)}), the bank proposes to BUY the put of strike ${f(kp, 0)} and SELL the call of strike ${f(kc, 0)}, "at zero cost" says the term sheet`
      : `la ligne détient ${f(nbActions, 0)} actions cotant ${mnt(S0, sym, 0)} ; sur 1 an (taux ${pct(rTx, 1)}, vol ${pct(vol, 1)}), la banque propose d'ACHETER le put de strike ${f(kp, 0)} et de VENDRE le call de strike ${f(kc, 0)}, « à coût zéro » dit la term sheet`;
    const contexte = (en
      ? [
        `The CFO must protect a listed stake the group will sell in a year — the budget is committed, a crash would be unexplainable to the board, and the CEO refuses to "pay for insurance": ${desc}. Your note prices each leg separately, computes the true net cost, then draws the tunnel — floor, cap — and puts a number on the sentence the banker left out: what the collar gives up if the stock flies.`,
        `A family office holds the founder's historic line, unsellable for tax and sentimental reasons, and the patriarch wants protection "that costs nothing": ${desc}. Before signing, the investment committee wants the two premiums, the real net, the guaranteed floor, the cap — and the rally scenario in euros, because "free" deserves a definition.`,
        `The examiner slides the term sheet across the table: "zero-cost collar, they say. Price it and tell me who pays what." The data: ${desc}. He wants the two legs priced separately, the net, the floor and cap net of that net cost, the forgone upside in a rally — and the parity-based requalification that closes the discussion.`,
      ]
      : [
        `Le DAF doit protéger une participation cotée que le groupe cédera dans un an — le budget est engagé, un krach serait inexplicable au conseil, et le PDG refuse de « payer de l'assurance » : ${desc}. Votre note price chaque jambe séparément, calcule le vrai coût net, puis dessine le tunnel — plancher, plafond — et met un chiffre sur la phrase que le banquier a omise : ce que le collar abandonne si l'action s'envole.`,
        `Un family office détient la ligne historique du fondateur, invendable pour des raisons fiscales et sentimentales, et le patriarche veut une protection « qui ne coûte rien » : ${desc}. Avant de signer, le comité d'investissement veut les deux primes, le net réel, le plancher garanti, le plafond — et le scénario de rallye en euros, parce que « gratuit » mérite une définition.`,
        `L'examinateur fait glisser la term sheet : « collar à coût zéro, disent-ils. Pricez-le et dites-moi qui paie quoi. » Les données : ${desc}. Il attend les deux jambes pricées séparément, le net, le plancher et le plafond nets de ce coût, le manque à gagner dans un rallye — et la requalification par la parité qui clôt la discussion.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The protection leg' : 'a) La jambe de protection',
          enonce: en
            ? `What does the strike-${f(kp, 0)} put cost on the whole line, in thousands of ${sym}?`
            : `Que coûte le put de strike ${f(kp, 0)} sur toute la ligne, en milliers de ${sym} ?`,
          reponse: repPut, tolerance: Math.max(1, repPut * 0.02), toleranceMode: 'absolu', unite: 'k€',
          etapes: [{
            titre: en ? 'An out-of-the-money put, priced by the model' : 'Un put hors de la monnaie, pricé par le modèle',
            contenu: en
              ? `Black-Scholes: P = ${mnt(r2(put), sym)} per share (strike ${f(r0((kp / S0) * 100), 0)}% of spot — the deductible is the first ${f(r2(S0 - kp), 2)} of decline, module's protective-put logic). Total: ${f(r2(put), 2)} × ${f(nbActions, 0)} = **${f(repPut, 1)} k€**. That is the insurance bill the CEO refused to pay in cash.`
              : `Black-Scholes : P = ${mnt(r2(put), sym)} par action (strike à ${f(r0((kp / S0) * 100), 0)} % du spot — la franchise est les premiers ${f(r2(S0 - kp), 2)} de baisse, la logique du put protecteur du module). Total : ${f(r2(put), 2)} × ${f(nbActions, 0)} = **${f(repPut, 1)} k€**. C'est la facture d'assurance que le PDG a refusé de payer en cash.`,
          }],
        },
        {
          intitule: en ? 'b) The financing leg' : 'b) La jambe de financement',
          enonce: en
            ? `What does selling the strike-${f(kc, 0)} call bring in on the whole line, in thousands of ${sym}?`
            : `Que rapporte la vente du call de strike ${f(kc, 0)} sur toute la ligne, en milliers de ${sym} ?`,
          reponse: repCall, tolerance: Math.max(1, repCall * 0.02), toleranceMode: 'absolu', unite: 'k€',
          etapes: [{
            titre: en ? 'The upside, sold to pay for the downside' : 'La hausse, vendue pour payer la baisse',
            contenu: en
              ? `C = ${mnt(r2(call), sym)} per share, total **${f(repCall, 1)} k€** collected. This is the covered-call mechanics of chapter 7: the premium is not income, it is the PRICE of the upside beyond ${f(kc, 0)} that you just sold to the bank. The collar's "zero" is manufactured by making this leg pay for the other.`
              : `C = ${mnt(r2(call), sym)} par action, total **${f(repCall, 1)} k€** encaissés. C'est la mécanique du covered call du chapitre 7 : la prime n'est pas un revenu, c'est le PRIX de la hausse au-delà de ${f(kc, 0)} que vous venez de vendre à la banque. Le « zéro » du collar se fabrique en faisant payer cette jambe pour l'autre.`,
          }],
        },
        {
          intitule: en ? 'c) The "zero", audited' : 'c) Le « zéro », audité',
          enonce: en
            ? `What is the true net cost of the collar (put paid − call received), sign included, in thousands of ${sym}?`
            : `Quel est le vrai coût net du collar (put payé − call reçu), signe compris, en milliers de ${sym} ?`,
          reponse: repNet, tolerance: Math.max(1, Math.abs(repNet) * 0.05 + 0.5), toleranceMode: 'absolu', unite: 'k€',
          etapes: [{
            titre: en ? 'Almost zero is not zero' : 'Presque zéro n\'est pas zéro',
            contenu: en
              ? `${f(repPut, 1)} − ${f(repCall, 1)} = **${f(repNet, 1)} k€** (${mnt(r2(netPS), sym)} per share). ${netPS > 0 ? 'The put costs more than the call brings in: the "zero cost" needs a small cheque after all' : 'The call brings in more than the put costs: the structure even pays a small credit'} — in practice the bank slides one strike until the net is exactly zero, and pockets its margin INSIDE the strikes, invisible on the term sheet. Rule: always price the legs separately; "zero" is a marketing total, not a price.`
              : `${f(repPut, 1)} − ${f(repCall, 1)} = **${f(repNet, 1)} k€** (${mnt(r2(netPS), sym)} par action). ${netPS > 0 ? 'Le put coûte plus que le call ne rapporte : le « coût zéro » demande quand même un petit chèque' : 'Le call rapporte plus que le put ne coûte : la structure paie même un petit crédit'} — en pratique la banque décale un strike jusqu'à ce que le net fasse exactement zéro, et loge sa marge DANS les strikes, invisible sur la term sheet. Règle : toujours pricer les jambes séparément ; « zéro » est un total marketing, pas un prix.`,
          }],
          pieges: [en
            ? `Judging the collar on its net cost alone hides where the value moved: the strikes. A "zero-cost" collar with a low cap is expensive; the price is just paid in upside, not in cash.`
            : `Juger le collar sur son seul coût net cache où la valeur a bougé : dans les strikes. Un collar « coût zéro » au plafond bas est cher ; le prix est simplement payé en hausse, pas en cash.`],
        },
        {
          intitule: en ? 'd) The floor' : 'd) Le plancher',
          enonce: en
            ? `Net of the collar's cost, below what value per share can the line not fall at expiry, in ${sym}?`
            : `Net du coût du collar, sous quelle valeur par action la ligne ne peut-elle pas tomber à l'échéance, en ${sym} ?`,
          reponse: repPlancher, tolerance: 0.05, toleranceMode: 'absolu', unite: sym,
          etapes: [{
            titre: en ? 'Strike of the put, minus the net' : 'Le strike du put, moins le net',
            contenu: en
              ? `Below ${f(kp, 0)}, the put pays the difference one for one: floor = ${f(kp, 0)} − ${f(r2(netPS), 2)} = **${mnt(repPlancher, sym)}** per share, i.e. ${mnt(r2((plancher * nbActions) / 1e6), sym)}m guaranteed for the whole line. In the crash scenario at ${mnt(sDown, sym)}, the hedged line loses ${mnt(r0(Math.abs(pnlCrashCouvert) / 1000), sym, 0)}k where the naked line would lose ${mnt(r0(Math.abs(pnlCrashNu) / 1000), sym, 0)}k — the put's payoff max(K − S_T, 0) absorbs everything below the strike.`
              : `Sous ${f(kp, 0)}, le put paie la différence un pour un : plancher = ${f(kp, 0)} − ${f(r2(netPS), 2)} = **${mnt(repPlancher, sym)}** par action, soit ${mnt(r2((plancher * nbActions) / 1e6), sym)} M garantis pour toute la ligne. Dans le scénario de krach à ${mnt(sDown, sym)}, la ligne couverte perd ${mnt(r0(Math.abs(pnlCrashCouvert) / 1000), sym, 0)} k là où la ligne nue perdrait ${mnt(r0(Math.abs(pnlCrashNu) / 1000), sym, 0)} k — le payoff du put max(K − S_T, 0) absorbe tout sous le strike.`,
          }],
        },
        {
          intitule: en ? 'e) The ceiling' : 'e) Le plafond',
          enonce: en
            ? `Symmetrically, above what net value per share can the line not rise, in ${sym}?`
            : `Symétriquement, au-dessus de quelle valeur nette par action la ligne ne peut-elle pas monter, en ${sym} ?`,
          reponse: repPlafond, tolerance: 0.05, toleranceMode: 'absolu', unite: sym,
          etapes: [{
            titre: en ? 'The tunnel is closed on both sides' : 'Le tunnel est fermé des deux côtés',
            contenu: en
              ? `Beyond ${f(kc, 0)}, the sold call takes every euro: cap = ${f(kc, 0)} − ${f(r2(netPS), 2)} = **${mnt(repPlafond, sym)}**. The position now lives in a tunnel [${f(repPlancher, 2)} ; ${f(repPlafond, 2)}]: maximum loss ${pct(r1(Math.abs((plancher / S0 - 1) * 100)), 1)}, maximum gain ${pct(r1((plafond / S0 - 1) * 100), 1)} versus today's ${f(S0, 0)}. For the CFO's mandate — deliver a known budget in one year — this tunnel is exactly the product; for a growth bet, it would be a cage.`
              : `Au-delà de ${f(kc, 0)}, le call vendu prend chaque euro : plafond = ${f(kc, 0)} − ${f(r2(netPS), 2)} = **${mnt(repPlafond, sym)}**. La position vit désormais dans un tunnel [${f(repPlancher, 2)} ; ${f(repPlafond, 2)}] : perte maximale ${pct(r1(Math.abs((plancher / S0 - 1) * 100)), 1)}, gain maximal ${pct(r1((plafond / S0 - 1) * 100), 1)} par rapport aux ${f(S0, 0)} d'aujourd'hui. Pour le mandat du DAF — livrer un budget connu dans un an — ce tunnel est exactement le produit ; pour un pari de croissance, ce serait une cage.`,
          }],
        },
        {
          intitule: en ? 'f) What "free" costs in a rally' : 'f) Ce que « gratuit » coûte dans un rallye',
          enonce: en
            ? `The stock finishes at ${mnt(sUp, sym)}. How much upside did the sold call confiscate versus the unhedged line, in thousands of ${sym}?`
            : `L'action finit à ${mnt(sUp, sym)}. Quelle hausse le call vendu a-t-il confisquée par rapport à la ligne non couverte, en milliers de ${sym} ?`,
          reponse: repManque, tolerance: Math.max(2, repManque * 0.02), toleranceMode: 'absolu', unite: 'k€',
          etapes: [
            {
              titre: en ? 'The bill arrives in forgone euros' : 'La facture arrive en euros non gagnés',
              contenu: en
                ? `(${f(sUp, 2)} − ${f(kc, 0)}) × ${f(nbActions, 0)} = **${f(repManque, 0)} k€** delivered to the call's buyer — the counterparty exercises and takes everything above ${f(kc, 0)}. This is the real price of the collar, paid only in the scenario where paying hurts least psychologically… and most politically: explaining to the board that the "free hedge" cost ${f(repManque, 0)} k€ of rally is scenario 1's whole drama.`
                : `(${f(sUp, 2)} − ${f(kc, 0)}) × ${f(nbActions, 0)} = **${f(repManque, 0)} k€** livrés à l'acheteur du call — la contrepartie exerce et prend tout au-dessus de ${f(kc, 0)}. C'est le vrai prix du collar, payé seulement dans le scénario où payer fait le moins mal psychologiquement… et le plus mal politiquement : expliquer au conseil que la « couverture gratuite » a coûté ${f(repManque, 0)} k€ de rallye est tout le drame du scénario 1.`,
            },
            {
              titre: en ? 'The parity requalification' : 'La requalification par la parité',
              contenu: en
                ? `Read the payoffs, not the marketing: stock + put − call at close strikes ≈ a FORWARD SALE around ${f(r0((kp + kc) / 2), 0)} (module 7), and the tighter the tunnel, the closer the collar is to just locking the price. The professional summary for the committee: a collar buys a floor and sells the ceiling to pay for it — "zero cost" describes the cash flows at inception, never the position.`
                : `Lisez les payoffs, pas le marketing : action + put − call à strikes proches ≈ une VENTE À TERME autour de ${f(r0((kp + kc) / 2), 0)} (module 7), et plus le tunnel est étroit, plus le collar revient à figer le prix tout court. Le résumé professionnel pour le comité : un collar achète un plancher et vend le plafond pour le payer — « coût zéro » décrit les flux à l'initiation, jamais la position.`,
            },
          ],
          pieges: [en
            ? `"The collar cost nothing since no scenario shows a cash outflow" — the ${f(repManque, 0)} k€ of confiscated rally ARE the cost; an opportunity cost settles in regret, then in board minutes.`
            : `« Le collar n'a rien coûté puisqu'aucun scénario ne montre de sortie de cash » — les ${f(repManque, 0)} k€ de rallye confisqués SONT le coût ; un coût d'opportunité se règle en regrets, puis en procès-verbal de conseil.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 15. m8-pb-15 — Volmageddon, 5 février 2018 — BOSS N4                */
/* ------------------------------------------------------------------ */
const volmageddon: ProblemeMoule = {
  id: 'm8-pb-15', moduleId: M8,
  titre: 'Volmageddon : le jour où les vendeurs de peur ont payé',
  titreEn: 'Volmageddon: the day the fear sellers paid up',
  typeDeCas: 'vente de volatilité',
  typeDeCasEn: 'volatility selling',
  difficulte: 4,
  scenarios: ['Gérant du fonds « revenu absolu », lundi 5 février au soir', "Analyste risques chez l'émetteur du tracker short-vol", "Grand oral : l'autopsie du Volmageddon"],
  scenariosEn: ['Manager of the "absolute income" fund, Monday February 5, evening', 'Risk analyst at the short-vol tracker issuer', 'Final viva: the Volmageddon autopsy'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const S = randInt(rng, 2600, 2900);
    const K = S;
    const rTx = randFloat(rng, 1.5, 2.5, 1);
    const T = 1 / 12;
    const vol1 = randFloat(rng, 10, 13, 1);
    const gapCalme = randFloat(rng, 1.5, 3, 1);
    const n = randInt(rng, 250, 600);
    const dVol = randInt(rng, 12, 18);
    const chutePct = randFloat(rng, 3.5, 4.5, 1);
    const pTracker = randInt(rng, 85, 110);
    const navM = randInt(rng, 1200, 2000);

    const call0 = blackScholesCall(S, K, rTx, vol1, T);
    const put0 = blackScholesPut(S, K, rTx, vol1, T);
    const prime = call0 + put0;
    const primeTotM = (prime * QUOTITE * n) / 1e6;
    const vegaTot = 2 * vegaOption(S, K, rTx, vol1, T) * QUOTITE * n;
    const volCalme = r1(vol1 - gapCalme);
    const straddleCalme = blackScholesCall(S, K, rTx, volCalme, T) + blackScholesPut(S, K, rTx, volCalme, T);
    const edgeMens = (prime - straddleCalme) * QUOTITE * n;
    const vol2 = vol1 + dVol;
    const S1 = r2(S * (1 - chutePct / 100));
    const straddle1 = blackScholesCall(S1, K, rTx, vol2, T) + blackScholesPut(S1, K, rTx, vol2, T);
    const perteExact = (straddle1 - prime) * QUOTITE * n;
    const perteVega = vegaTot * dVol;
    const moisEffaces = perteExact / edgeMens;
    const perteTrackerM = (navM * Math.min(pTracker, 100)) / 100;
    const repPrime = r2(primeTotM);
    const repVega = r0(vegaTot / 1000);
    const repPerteVega = r1(perteVega / 1e6);
    const repExact = r1(perteExact / 1e6);
    const repMois = r1(moisEffaces);
    const repTracker = r0(perteTrackerM);

    const { en, f, pct, mnt } = outils(langue);
    const desc = en
      ? `every month, the fund sells ${f(n, 0)} at-the-money straddles on the index (spot ${f(S, 0)} points, 1 month, rate ${pct(rTx, 1)}, contract size ${f(QUOTITE, 0)}) at ${pct(vol1, 1)} implied volatility, while the calm-years realised volatility has been running around ${pct(volCalme, 1)}; this Monday, the index drops ${pct(chutePct, 1)} and the implied JUMPS from ${pct(vol1, 1)} to ${pct(r1(vol2), 1)}; on the side, the firm's clients hold a short-vol tracker with \\$${f(navM, 0)} million of assets, whose benchmark — the inverse of VIX futures — moves ${f(pTracker, 0)}% against it on the day`
      : `chaque mois, le fonds vend ${f(n, 0)} straddles à la monnaie sur l'indice (spot ${f(S, 0)} points, 1 mois, taux ${pct(rTx, 1)}, quotité ${f(QUOTITE, 0)}) à ${pct(vol1, 1)} de volatilité implicite, quand la réalisée des années calmes tourne autour de ${pct(volCalme, 1)} ; ce lundi, l'indice perd ${pct(chutePct, 1)} et l'implicite SAUTE de ${pct(vol1, 1)} à ${pct(r1(vol2), 1)} ; à côté, les clients de la maison détiennent un tracker short-vol de ${f(navM, 0)} M\\$ d'encours, dont l'indice de référence — l'inverse des futures VIX — bouge de ${f(pTracker, 0)} % contre lui dans la journée`;
    const contexte = (en
      ? [
        `Five years that the strategy has never had a losing quarter. Your fund is called "absolute income"; the investor deck shows a straight, gently rising line, and the machine behind it fits on one line too: ${desc}. Investors call it yield. Chapter 6 calls it the volatility risk premium; chapter 7 calls it picking up coins in front of the steamroller.\n\nMonday, February 5, 2018, 10 p.m. The US close was ugly, the vol screens are red everywhere, and tomorrow at 9 a.m. you face the management committee. Before the meeting you redo, alone, the five numbers that tell the truth: the monthly rent, the real size of the book in vega, the linear estimate of today's damage, the exact re-mark — and how many months of patient collecting this single session just burned. Then the tracker, because your clients hold it, and its arithmetic tonight is not a stress test.`,
        `You sit in the risk department of the bank that issues the short-vol tracker — the retail product that turns "the market is calm" into a performance line: ${desc}. For years the product printed 40, 60, 80% a year; the prospectus said, page 12, that it could lose almost everything in a day. Nobody reads page 12.\n\nTonight the VIX futures your product shorts have exploded, and the rebalancing rule — buy back the futures as they rise, mechanically, before the close of the rebalancing window — is amplifying the very spike that kills it. The issuer's termination clause is on the table. Before the 2 a.m. call with Zurich, reconstruct the professional version of the story on the desk's own straddle book: the rent, the vega, the shock, the exact loss, the months erased — then the retail bill, in millions, as the clients will read it tomorrow.`,
        `The examiner reads the date out loud: "February 5, 2018. The VIX rises 115% in one session — its record. A short-vol tracker loses 96% and is liquidated. Explain the mechanism to me, numbers in hand." The calibrated data: ${desc}.\n\nHe wants the canonical chain of the volatility seller: the monthly rent of the calm years and its vega, the shock in linear approximation, the exact re-mark that beats it — convexity works against the seller too —, the ratio that compares one day to years of collecting, and the retail tracker's arithmetic. Then the sentence that links it to 1987 and to GameStop: the hedging of some is the flow of others, and when the mechanical strategy grows too big, it stops taking prices and starts making them.`,
      ]
      : [
        `Cinq ans que la stratégie n'a pas connu un trimestre perdant. Votre fonds s'appelle « revenu absolu » ; la plaquette investisseurs montre une ligne droite qui monte doucement, et la machine derrière tient en une ligne elle aussi : ${desc}. Les investisseurs appellent cela du rendement. Le chapitre 6 appelle cela la prime de risque de volatilité ; le chapitre 7, ramasser des pièces devant le rouleau compresseur.\n\nLundi 5 février 2018, 22 h. La clôture américaine a été laide, les écrans de vol sont rouges partout, et demain 9 h vous passez devant le comité de gestion. Avant la réunion, vous refaites seul les cinq nombres qui disent la vérité : la rente mensuelle, la vraie taille du book en vega, l'estimation linéaire des dégâts du jour, le re-marquage exact — et combien de mois de collecte patiente cette seule séance vient de brûler. Puis le tracker, parce que vos clients le détiennent, et que son arithmétique de ce soir n'est pas un stress test.`,
        `Vous êtes au département des risques de la banque qui émet le tracker short-vol — le produit grand public qui transforme « le marché est calme » en ligne de performance : ${desc}. Pendant des années, le produit a imprimé 40, 60, 80 % par an ; le prospectus disait, page 12, qu'il pouvait presque tout perdre en une journée. Personne ne lit la page 12.\n\nCe soir, les futures VIX que votre produit vend à découvert ont explosé, et la règle de rebalancement — racheter les futures à mesure qu'ils montent, mécaniquement, avant la fin de la fenêtre — amplifie le pic même qui le tue. La clause de liquidation de l'émetteur est sur la table. Avant le call de 2 h du matin avec Zurich, reconstituez la version professionnelle de l'histoire sur le book de straddles du desk : la rente, le vega, le choc, la perte exacte, les mois effacés — puis la facture retail, en millions, telle que les clients la liront demain.`,
        `L'examinateur lit la date à voix haute : « 5 février 2018. Le VIX monte de 115 % en une séance — son record. Un tracker short-vol perd 96 % et il est liquidé. Expliquez-moi le mécanisme, chiffres à l'appui. » Les données, calibrées : ${desc}.\n\nIl attend la chaîne canonique du vendeur de volatilité : la rente mensuelle des années calmes et son vega, le choc en approximation linéaire, le re-marquage exact qui la dépasse — la convexité travaille aussi contre le vendeur —, le ratio qui compare une journée à des années de collecte, et l'arithmétique du tracker retail. Puis la phrase qui relie à 1987 et à GameStop : la couverture des uns est le flux des autres, et quand la stratégie mécanique devient trop grosse, elle cesse de subir les prix et se met à les fabriquer.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The rent of the calm years' : 'a) La rente des années calmes',
          enonce: en
            ? `What premium does one month of sold straddles collect, in millions of dollars?`
            : `Quelle prime un mois de straddles vendus encaisse-t-il, en millions de dollars ?`,
          reponse: repPrime, tolerance: Math.max(0.05, repPrime * 0.02), toleranceMode: 'absolu', unite: 'M$',
          etapes: [{
            titre: en ? 'Call plus put, sold at the money' : 'Call plus put, vendus à la monnaie',
            contenu: en
              ? `Straddle = ${f(r2(call0), 2)} + ${f(r2(put0), 2)} = ${f(r2(prime), 2)} points; × ${f(QUOTITE, 0)} × ${f(n, 0)} = **${mnt(repPrime, '$')}m** collected this month. The true PROFIT is thinner: replicating the straddle at the calm realised vol (${pct(volCalme, 1)}) costs ${f(r2(straddleCalme), 2)} points, so the edge ≈ ${mnt(r0(edgeMens / 1000), '$', 0)}k a month — the volatility risk premium of chapter 6, harvested industrially. Small, regular, seductive.`
              : `Straddle = ${f(r2(call0), 2)} + ${f(r2(put0), 2)} = ${f(r2(prime), 2)} points ; × ${f(QUOTITE, 0)} × ${f(n, 0)} = **${f(repPrime, 2)} M\\$** encaissés ce mois-ci. Le PROFIT vrai est plus mince : répliquer le straddle à la réalisée calme (${pct(volCalme, 1)}) coûte ${f(r2(straddleCalme), 2)} points, donc l'edge ≈ ${f(r0(edgeMens / 1000), 0)} k\\$ par mois — la prime de risque de volatilité du chapitre 6, récoltée industriellement. Petit, régulier, séduisant.`,
          }],
          pieges: [en
            ? `Reading the whole premium as profit forgets the claim payments: over a calm month the seller keeps only the implied-minus-realised gap — the rest pays for the moves that do happen.`
            : `Lire toute la prime comme un profit oublie les sinistres : sur un mois calme, le vendeur ne garde que l'écart implicite-réalisée — le reste paie les mouvements qui ont bel et bien lieu.`],
        },
        {
          intitule: en ? 'b) The book, measured honestly' : 'b) Le book, mesuré honnêtement',
          enonce: en
            ? `What is the vega of the sold book, in thousands of dollars per point of implied volatility?`
            : `Quel est le vega du book vendu, en milliers de dollars par point de volatilité implicite ?`,
          reponse: repVega, tolerance: Math.max(2, repVega * 0.03), toleranceMode: 'absolu', unite: 'k$/point',
          etapes: [{
            titre: en ? 'Short vega is the real position' : 'Le vrai poste, c\'est le vega vendu',
            contenu: en
              ? `Straddle vega = 2 × ${f(r2(vegaOption(S, K, rTx, vol1, T)), 2)} per unit (call and put pull together); × ${f(QUOTITE, 0)} × ${f(n, 0)} = **${mnt(repVega, '$', 0)}k per vol point**, SHORT. That is the honest description of the fund: not "an income strategy" but "short ${mnt(repVega, '$', 0)}k a point of fear". As long as nobody says that sentence out loud in the committee, the position keeps growing.`
              : `Vega du straddle = 2 × ${f(r2(vegaOption(S, K, rTx, vol1, T)), 2)} par unité (call et put tirent ensemble) ; × ${f(QUOTITE, 0)} × ${f(n, 0)} = **${f(repVega, 0)} k\\$ par point de vol**, VENDEUR. C'est la description honnête du fonds : pas « une stratégie de revenu » mais « short ${f(repVega, 0)} k\\$ le point de peur ». Tant que personne ne prononce cette phrase en comité, la position continue de grossir.`,
          }],
        },
        {
          intitule: en ? 'c) The shock, first estimate' : 'c) Le choc, première estimation',
          enonce: en
            ? `The implied jumps ${f(dVol, 0)} points. By the vega, what does the day cost, in millions of dollars?`
            : `L'implicite saute de ${f(dVol, 0)} points. Par le vega, que coûte la journée, en millions de dollars ?`,
          reponse: repPerteVega, tolerance: Math.max(0.2, repPerteVega * 0.05), toleranceMode: 'absolu', unite: 'M$',
          etapes: [{
            titre: en ? 'Vega times the jump' : 'Le vega fois le saut',
            contenu: en
              ? `${mnt(repVega, '$', 0)}k × ${f(dVol, 0)} points = **${mnt(repPerteVega, '$', 1)}m** on the vol move alone. Years of two-point edges, and the market just repriced ${f(dVol, 0)} points in a session: the asymmetry of the seller is not in the formula, it is in the CALENDAR — edges arrive monthly, shocks arrive whole.`
              : `${f(repVega, 0)} k\\$ × ${f(dVol, 0)} points = **${f(repPerteVega, 1)} M\\$** sur le seul mouvement de vol. Des années d'edges de deux points, et le marché vient de re-pricer ${f(dVol, 0)} points en une séance : l'asymétrie du vendeur n'est pas dans la formule, elle est dans le CALENDRIER — les edges arrivent au mois, les chocs arrivent entiers.`,
          }],
        },
        {
          intitule: en ? 'd) The exact re-mark' : 'd) Le re-marquage exact',
          enonce: en
            ? `Repricing the straddles at spot ${f(S1, 0)} (−${pct(chutePct, 1)}) and ${pct(r1(vol2), 1)} vol, what is the exact loss of the book, in millions of dollars?`
            : `En re-pricant les straddles au spot ${f(S1, 0)} (−${pct(chutePct, 1)}) et à ${pct(r1(vol2), 1)} de vol, quelle est la perte exacte du book, en millions de dollars ?`,
          reponse: repExact, tolerance: Math.max(0.2, repExact * 0.05), toleranceMode: 'absolu', unite: 'M$',
          etapes: [
            {
              titre: en ? 'Black-Scholes, rerun with tonight\'s inputs' : 'Black-Scholes, relancé avec les données du soir',
              contenu: en
                ? `New straddle value = ${f(r2(straddle1), 2)} points against ${f(r2(prime), 2)} collected: loss = (${f(r2(straddle1), 2)} − ${f(r2(prime), 2)}) × ${f(QUOTITE, 0)} × ${f(n, 0)} = **${mnt(repExact, '$', 1)}m** — MORE than the ${mnt(repPerteVega, '$', 1)}m of the vega estimate. The gap is the second order: the spot moved (short gamma pays), and vega itself is not constant. Convexity, which made the buyer's fortune in the crash, presents the seller with the same bill, sign flipped.`
                : `Nouvelle valeur du straddle = ${f(r2(straddle1), 2)} points contre ${f(r2(prime), 2)} encaissés : perte = (${f(r2(straddle1), 2)} − ${f(r2(prime), 2)}) × ${f(QUOTITE, 0)} × ${f(n, 0)} = **${f(repExact, 1)} M\\$** — PLUS que les ${f(repPerteVega, 1)} M\\$ de l'estimation vega. L'écart est le second ordre : le spot a bougé (le gamma vendu paie), et le vega lui-même n'est pas constant. La convexité, qui fait la fortune de l'acheteur dans le krach, présente au vendeur la même facture, signe inversé.`,
            },
            {
              titre: en ? 'And the margin call is tonight' : 'Et l\'appel de marge, c\'est ce soir',
              contenu: en
                ? `This mark is not an accounting curiosity: cleared options are margined daily (module 7). The ${mnt(repExact, '$', 1)}m leave in cash before tomorrow's open, at the exact moment every other volatility seller is looking for cash too. Liquidity dies first; solvency arguments come later.`
                : `Ce mark n'est pas une curiosité comptable : les options compensées sont margées quotidiennement (module 7). Les ${f(repExact, 1)} M\\$ partent en cash avant l'ouverture de demain, au moment exact où tous les autres vendeurs de volatilité cherchent du cash aussi. La liquidité meurt d'abord ; les arguments de solvabilité viennent après.`,
            },
          ],
        },
        {
          intitule: en ? 'e) One day against the collection' : 'e) Une journée contre la collecte',
          enonce: en
            ? `Taking the calm-month edge (straddle sold at ${pct(vol1, 1)} minus its value at the ${pct(volCalme, 1)} realised) as the monthly rent, how many months of rent does the day erase?`
            : `En prenant pour rente mensuelle l'edge des mois calmes (straddle vendu à ${pct(vol1, 1)} moins sa valeur à la réalisée de ${pct(volCalme, 1)}), combien de mois de rente la journée efface-t-elle ?`,
          reponse: repMois, tolerance: Math.max(0.5, repMois * 0.08), toleranceMode: 'absolu', unite: en ? 'months' : 'mois',
          etapes: [{
            titre: en ? 'The steamroller ratio' : 'Le ratio du rouleau compresseur',
            contenu: en
              ? `Monthly edge = (${f(r2(prime), 2)} − ${f(r2(straddleCalme), 2)}) × ${f(QUOTITE, 0)} × ${f(n, 0)} = ${mnt(r0(edgeMens / 1000), '$', 0)}k; erased = ${mnt(repExact, '$', 1)}m / ${mnt(r0(edgeMens / 1000), '$', 0)}k = **${f(repMois, 1)} months** in one session — and the mark kept sliding the following days. This ratio is the signature of every sold insurance: the Sharpe ratio of the calm years measured the absence of the event, not the absence of the risk (chapter 7, and the corporate boss of module 7).`
              : `Edge mensuel = (${f(r2(prime), 2)} − ${f(r2(straddleCalme), 2)}) × ${f(QUOTITE, 0)} × ${f(n, 0)} = ${f(r0(edgeMens / 1000), 0)} k\\$ ; effacés = ${f(repExact, 1)} M\\$ / ${f(r0(edgeMens / 1000), 0)} k\\$ = **${f(repMois, 1)} mois** en une séance — et le mark a continué de glisser les jours suivants. Ce ratio est la signature de toute assurance vendue : le ratio de Sharpe des années calmes mesurait l'absence de l'événement, pas l'absence du risque (chapitre 7, et le boss corporate du module 7).`,
          }],
        },
        {
          intitule: en ? 'f) The retail bill — and the loop' : 'f) La facture retail — et la boucle',
          enonce: en
            ? `The short-vol tracker holds \\$${f(navM, 0)}m and its inverse benchmark moves ${f(pTracker, 0)}% against it. How many millions do the holders lose on the day (a daily inverse product cannot lose more than 100%)?`
            : `Le tracker short-vol porte ${f(navM, 0)} M\\$ et son indice inverse bouge de ${f(pTracker, 0)} % contre lui. Combien de millions les porteurs perdent-ils dans la journée (un produit inverse quotidien ne peut pas perdre plus de 100 %) ?`,
          reponse: repTracker, tolerance: Math.max(5, repTracker * 0.02), toleranceMode: 'absolu', unite: 'M$',
          etapes: [
            {
              titre: en ? 'The arithmetic of minus one' : "L'arithmétique du moins un",
              contenu: en
                ? `Loss ≈ ${f(navM, 0)} × ${f(Math.min(pTracker, 100), 0)}% = **${mnt(repTracker, '$', 0)}m** — the near-totality of the assets, in one session. The historical case: on February 5, 2018, the VIX rose 115.6% (its largest one-day jump ever); the XIV note, about \\$1.9 billion at its January peak, lost roughly 96% after hours and its issuer, Credit Suisse, announced its liquidation within days. The holders thought they owned an investment; they were selling insurance against fear, with leverage, without knowing it (chapter 7, word for word).`
                : `Perte ≈ ${f(navM, 0)} × ${f(Math.min(pTracker, 100), 0)} % = **${f(repTracker, 0)} M\\$** — la quasi-totalité de l'encours, en une séance. Le cas historique : le 5 février 2018, le VIX monte de 115,6 % (sa plus forte hausse en une journée) ; le produit XIV, environ 1,9 milliard de dollars à son pic de janvier, perd à peu près 96 % après la clôture et son émetteur, Credit Suisse, annonce sa liquidation dans les jours qui suivent. Les porteurs croyaient détenir un placement ; ils vendaient de l'assurance contre la peur, avec du levier, sans le savoir (chapitre 7, mot pour mot).`,
            },
            {
              titre: en ? 'Why the spike fed itself' : 'Pourquoi le pic s\'est nourri lui-même',
              contenu: en
                ? `The mechanism the examiners want: to keep their −1 daily exposure, short-vol products had to BUY BACK VIX futures as they rose — a rebalancing estimated at around a hundred thousand contracts into the close, amplifying the spike that was destroying them. 1987: the insurers sell into the fall. 2018: the short-vol products buy into the vol rise. 2021: the market makers buy into the stock rise. Three accidents, one lesson — the hedging of some is the flow of others, and a mechanical strategy that grows too big stops taking prices: it makes them.`
                : `Le mécanisme que les jurys attendent : pour conserver leur exposition quotidienne de −1, les produits short-vol devaient RACHETER les futures VIX à mesure qu'ils montaient — un rebalancement estimé à l'ordre de la centaine de milliers de contrats dans la clôture, amplifiant le pic qui les détruisait. 1987 : les assureurs vendent dans la baisse. 2018 : les produits short-vol rachètent dans la hausse de la vol. 2021 : les market makers achètent dans la hausse de l'action. Trois accidents, une leçon — la couverture des uns est le flux des autres, et une stratégie mécanique devenue trop grosse cesse de subir les prix : elle les fabrique.`,
            },
          ],
          pieges: [en
            ? `"The VIX rose 115%, so the tracker should lose 115%" — an inverse product's value cannot go below zero: the loss caps at (almost) 100%, which is why XIV printed −96% and died, not −115%.`
            : `« Le VIX a pris 115 %, donc le tracker devrait perdre 115 % » — la valeur d'un produit inverse ne passe pas sous zéro : la perte plafonne à (presque) 100 %, raison pour laquelle le XIV a imprimé −96 % et est mort, pas −115 %.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 16. m8-pb-16 — Gamma squeeze : côté market maker — BOSS N4          */
/* ------------------------------------------------------------------ */
const gammaSqueeze: ProblemeMoule = {
  id: 'm8-pb-16', moduleId: M8,
  titre: "Gamma squeeze : de l'autre côté du ticket GameStop",
  titreEn: 'Gamma squeeze: the other side of the GameStop ticket',
  typeDeCas: 'gamma et couverture en spirale',
  typeDeCasEn: 'gamma and spiral hedging',
  difficulte: 4,
  scenarios: ['Market maker options, le mardi de la flambée', 'Risk officer avant le comité de crise', 'Grand oral : décomposer le gamma squeeze'],
  scenariosEn: ['Options market maker, on squeeze Tuesday', 'Risk officer before the crisis committee', 'Final viva: decomposing the gamma squeeze'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const S0 = randInt(rng, 18, 45);
    const K = Math.round(S0 * randFloat(rng, 1.3, 1.6, 2));
    const rTx = randFloat(rng, 0.5, 1.5, 1);
    const T = 2 / 52;
    const T1 = 1 / 52;
    const vol0 = randInt(rng, 100, 160);
    const nK = randInt(rng, 150, 400);
    const n = nK * 100;
    const S1 = r2(K * randFloat(rng, 1.05, 1.25, 2));
    const dVol = randInt(rng, 40, 80);
    const vol1 = vol0 + dVol;
    const volJourM = randInt(rng, 30, 80);

    const prime0 = blackScholesCall(S0, K, rTx, vol0, T);
    const delta0 = deltaCall(S0, K, rTx, vol0, T);
    const act0 = actionsDeltaHedge(delta0, n, QUOTITE);
    const gamma0 = gammaOption(S0, K, rTx, vol0, T);
    const gammaActions = gamma0 * n * QUOTITE;
    const delta1 = deltaCall(S1, K, rTx, vol1, T1);
    const act1 = actionsDeltaHedge(delta1, n, QUOTITE);
    const achat = act1 - act0;
    const cashM = (achat * S1) / 1e6;
    const val1 = blackScholesCall(S1, K, rTx, vol1, T1);
    const perteM = ((val1 - prime0) * n * QUOTITE) / 1e6;
    const partVolume = (achat / (volJourM * 1e6)) * 100;
    const repAct0 = act0;
    const repGamma = r0(gammaActions);
    const repAchat = achat;
    const repCash = r1(cashM);
    const repPerte = r1(-perteM);
    const repPart = r1(partVolume);

    const { en, f, pct, mnt } = outils(langue);
    const desc = en
      ? `the stock trades at \\$${f(S0, 0)}; retail buyers hoover up ${f(nK, 0)} hundred (${f(n, 0)}) calls of strike ${f(K, 0)}, two weeks to expiry, and your desk sells them at ${pct(vol0, 0)} implied vol (rate ${pct(rTx, 1)}, contract size ${f(QUOTITE, 0)}); within days the stock blows through the strike to \\$${f(S1, 2)} while the implied jumps to ${pct(vol1, 0)}; the stock's average daily volume runs at ${f(volJourM, 0)} million shares`
      : `l'action cote ${f(S0, 0)} \\$ ; les particuliers aspirent ${f(n, 0)} calls de strike ${f(K, 0)}, échéance deux semaines, et votre desk les leur vend à ${pct(vol0, 0)} de vol implicite (taux ${pct(rTx, 1)}, quotité ${f(QUOTITE, 0)}) ; en quelques jours, l'action pulvérise le strike jusqu'à ${f(S1, 2)} \\$ pendant que l'implicite saute à ${pct(vol1, 0)} ; le volume quotidien moyen du titre tourne à ${f(volJourM, 0)} millions de titres`;
    const contexte = (en
      ? [
        `January 2021. A forum with an ironic name has decided that a struggling video-game retailer will be the battlefield, and the order flow reaching your market-making desk no longer looks like anything in the manuals: ${desc}. You are not betting on the company — you never do. You sell what clients want to buy, you hedge the delta, chapter 5, business as usual.\n\nExcept "usual" assumes the Greeks stay put. Tonight the stock has gone vertical, your sold calls have turned into near-forwards, and every hundred cents of rise forces your own execution algos to BUY the stock that is exploding — you, the hedger, have become the fuel. Before the risk call, rebuild the spiral in numbers: the initial hedge, the gamma that commanded everything, the chase, the cash it drank, the re-mark of the book — and your share of the day's volume, because that percentage is the mechanism.`,
        `Wednesday, 7:40 a.m., crisis committee at the market-making firm. The overnight file on the table: ${desc}. The CFO wants to understand one paradox: the desk is "hedged", and yet it wired nine figures of cash yesterday and the clearing house doubled the margin requirement overnight — module 1 told this part of the story from the broker's side; today you sit where the mechanism starts.\n\nYour presentation must hold in six numbers: the shares bought at inception, the book's gamma in shares per dollar, the shares the rally forced you to buy, the cash they consumed, the mark-to-market loss on the sold calls, and the fraction of the daily volume your own hedging represented. The committee's real question hides behind the last one: at what size does a hedger stop following the price — and start making it?`,
        `The examiner asks for the mechanism, not the folklore: "January 2021. Retail buys short-dated out-of-the-money calls in mass. Explain to me, as the market maker, why your hedging amplified the rise." The data: ${desc}.\n\nHe wants the chain in order: the modest initial delta-hedge, the gamma concentrated near the money and near expiry, the forced chase when the stock crossed the strike, the cash and the mark-to-market, the hedging flow as a share of the volume — and the conclusion of chapter 7, said cleanly: the derivative stopped reflecting the underlying and started steering it. Bonus for linking it to module 1: what the clearing house's margin calls did to the brokers is the same story, one floor down.`,
      ]
      : [
        `Janvier 2021. Un forum au nom ironique a décidé qu'un distributeur de jeux vidéo à la peine serait le champ de bataille, et le flux d'ordres qui atteint votre desk de market making ne ressemble plus à rien de connu : ${desc}. Vous ne pariez pas sur l'entreprise — jamais. Vous vendez ce que les clients veulent acheter, vous couvrez le delta, chapitre 5, routine.\n\nSauf que la routine suppose des grecques qui restent en place. Ce soir, l'action est partie à la verticale, vos calls vendus sont devenus des quasi-forwards, et chaque dollar de hausse force vos propres algos d'exécution à ACHETER le titre qui explose — vous, le couvreur, êtes devenu le carburant. Avant le call risques, reconstituez la spirale en nombres : le hedge initial, le gamma qui a tout commandé, la course-poursuite, le cash qu'elle a bu, le re-marquage du book — et votre part du volume du jour, parce que ce pourcentage EST le mécanisme.`,
        `Mercredi, 7 h 40, comité de crise chez le market maker. Le dossier de la nuit sur la table : ${desc}. Le directeur financier veut comprendre un paradoxe : le desk est « couvert », et pourtant il a viré hier un montant à neuf chiffres, et la chambre de compensation a doublé l'exigence de marge dans la nuit — le module 1 a raconté cette partie de l'histoire côté courtier ; aujourd'hui, vous êtes assis là où le mécanisme commence.\n\nVotre présentation doit tenir en six nombres : les actions achetées à l'initiation, le gamma du book en actions par dollar, les actions que la flambée a forcé d'acheter, le cash qu'elles ont consommé, la perte de re-marquage sur les calls vendus, et la fraction du volume quotidien que votre propre couverture a représentée. La vraie question du comité se cache derrière le dernier : à partir de quelle taille un couvreur cesse-t-il de suivre le prix — pour se mettre à le faire ?`,
        `L'examinateur demande le mécanisme, pas le folklore : « Janvier 2021. Les particuliers achètent en masse des calls courts hors de la monnaie. Expliquez-moi, en tant que market maker, pourquoi votre couverture a amplifié la hausse. » Les données : ${desc}.\n\nIl attend la chaîne dans l'ordre : le delta-hedge initial modeste, le gamma concentré près de la monnaie et de l'échéance, la course forcée quand l'action a franchi le strike, le cash et le mark-to-market, le flux de couverture en part du volume — et la conclusion du chapitre 7, énoncée proprement : le dérivé a cessé de refléter le sous-jacent pour se mettre à le piloter. Bonus pour le pont vers le module 1 : ce que les appels de marge de la chambre ont fait aux courtiers est la même histoire, un étage plus bas.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The initial hedge — modest' : 'a) Le hedge initial — modeste',
          enonce: en
            ? `At inception (spot ${f(S0, 0)}, vol ${pct(vol0, 0)}), how many shares does the delta-hedge of the ${f(n, 0)} sold calls require?`
            : `À l'initiation (spot ${f(S0, 0)}, vol ${pct(vol0, 0)}), combien d'actions le delta-hedge des ${f(n, 0)} calls vendus exige-t-il ?`,
          reponse: repAct0, tolerance: Math.max(100, repAct0 * 0.03), toleranceMode: 'absolu', unite: en ? 'shares' : 'actions',
          etapes: [{
            titre: en ? 'Out of the money, the delta is small' : 'Hors de la monnaie, le delta est petit',
            contenu: en
              ? `Δ = N(d₁) = ${f(r2(delta0), 2)}: the strike sits ${pct(r0((K / S0 - 1) * 100), 0)} above the spot, two weeks out — cheap lottery tickets, exactly what the forum wants (maximum leverage per dollar of premium, at ${mnt(r2(prime0), '$')} each). Hedge = ${f(r2(delta0), 2)} × ${f(n, 0)} × ${f(QUOTITE, 0)} = **${f(repAct0, 0)} shares** bought. So far the book looks harmless; the danger is not in the delta, it is one Greek further down.`
              : `Δ = N(d₁) = ${f(r2(delta0), 2)} : le strike est ${pct(r0((K / S0 - 1) * 100), 0)} au-dessus du spot, à deux semaines — des billets de loterie bon marché, exactement ce que veut le forum (levier maximal par dollar de prime, à ${f(r2(prime0), 2)} \\$ pièce). Hedge = ${f(r2(delta0), 2)} × ${f(n, 0)} × ${f(QUOTITE, 0)} = **${f(repAct0, 0)} actions** achetées. Pour l'instant, le book a l'air inoffensif ; le danger n'est pas dans le delta, il est une grecque plus bas.`,
          }],
        },
        {
          intitule: en ? 'b) The gamma, in shares per dollar' : 'b) Le gamma, en actions par dollar',
          enonce: en
            ? `By how many shares does the book's hedge requirement change for each \\$1 move of the stock (Γ at inception)?`
            : `De combien d'actions l'exigence de couverture du book change-t-elle pour chaque dollar de mouvement du titre (Γ à l'initiation) ?`,
          reponse: repGamma, tolerance: Math.max(50, repGamma * 0.05), toleranceMode: 'absolu', unite: en ? 'shares/$' : 'actions/$',
          etapes: [{
            titre: en ? 'The derivative of the hedge itself' : 'La dérivée du hedge lui-même',
            contenu: en
              ? `Γ = ${f(r2(gamma0 * 1000) / 1000, 4)} per share, so Γ × ${f(n, 0)} × ${f(QUOTITE, 0)} = **${f(repGamma, 0)} shares per dollar** of stock move — and it will GROW as the stock approaches the strike near expiry (the gamma peak of chapter 5). This is the number the retail buyers weaponised, knowingly or not: they did not buy exposure, they bought YOUR future forced purchases.`
              : `Γ = ${f(r2(gamma0 * 1000) / 1000, 4)} par action, donc Γ × ${f(n, 0)} × ${f(QUOTITE, 0)} = **${f(repGamma, 0)} actions par dollar** de mouvement du titre — et il va GROSSIR à mesure que l'action approche du strike près de l'échéance (le pic de gamma du chapitre 5). C'est ce nombre que les acheteurs particuliers ont transformé en arme, sciemment ou non : ils n'ont pas acheté de l'exposition, ils ont acheté VOS futurs achats forcés.`,
          }],
          pieges: [en
            ? `Reading a small delta as a small risk: the position's danger is the SPEED at which that delta can change — gamma is maximal precisely on short-dated options near the money.`
            : `Lire un petit delta comme un petit risque : le danger de la position est la VITESSE à laquelle ce delta peut changer — le gamma est maximal précisément sur les options courtes près de la monnaie.`],
        },
        {
          intitule: en ? 'c) The forced chase' : 'c) La course forcée',
          enonce: en
            ? `The stock blows through the strike to \\$${f(S1, 2)} (vol ${pct(vol1, 0)}, one week left). How many ADDITIONAL shares must the hedge buy?`
            : `L'action pulvérise le strike jusqu'à ${f(S1, 2)} \\$ (vol ${pct(vol1, 0)}, une semaine restante). Combien d'actions SUPPLÉMENTAIRES le hedge doit-il acheter ?`,
          reponse: repAchat, tolerance: Math.max(500, Math.abs(repAchat) * 0.03), toleranceMode: 'absolu', unite: en ? 'shares' : 'actions',
          etapes: [{
            titre: en ? 'The delta ran to one' : 'Le delta a couru vers un',
            contenu: en
              ? `New Δ = ${f(r2(delta1), 2)}: the calls are now in the money and behave almost like the stock itself. Target ${f(act1, 0)} shares, held ${f(repAct0, 0)}: BUY **${f(repAchat, 0)} shares** — into a rising market, at whatever price the book demands, because an unhedged short call at this size is not a position, it is a resignation letter. Multiply by every market maker carrying the same flow: the "mysterious" buying pressure has a name and a formula.`
              : `Nouveau Δ = ${f(r2(delta1), 2)} : les calls sont désormais dans la monnaie et se comportent presque comme l'action elle-même. Cible ${f(act1, 0)} actions, détenues ${f(repAct0, 0)} : ACHETER **${f(repAchat, 0)} actions** — dans un marché qui monte, au prix qu'il faudra, parce qu'un call vendu non couvert à cette taille n'est pas une position, c'est une lettre de démission. Multipliez par tous les market makers qui portent le même flux : la pression acheteuse « mystérieuse » a un nom et une formule.`,
          }],
        },
        {
          intitule: en ? 'd) The cash the chase drinks' : 'd) Le cash que la course boit',
          enonce: en
            ? `What do those additional shares cost at \\$${f(S1, 2)}, in millions of dollars?`
            : `Que coûtent ces actions supplémentaires à ${f(S1, 2)} \\$, en millions de dollars ?`,
          reponse: repCash, tolerance: Math.max(0.3, repCash * 0.03), toleranceMode: 'absolu', unite: 'M$',
          etapes: [{
            titre: en ? 'Hedging is solvency-neutral, never cash-neutral' : 'Couvrir est neutre en solvabilité, jamais en cash',
            contenu: en
              ? `${f(repAchat, 0)} × ${mnt(S1, '$')} = **${mnt(repCash, '$', 1)}m** of stock to fund TODAY — plus the clearing house raising margins on the whole book as volatility explodes (module 1's mechanism, seen from upstream). The hedge protects the P&L at expiry; it does nothing for tonight's treasury. Desks die of cash long before they die of P&L — Metallgesellschaft's lesson, at a market maker's clock speed.`
              : `${f(repAchat, 0)} × ${f(S1, 2)} \\$ = **${f(repCash, 1)} M\\$** de titres à financer AUJOURD'HUI — plus la chambre de compensation qui relève les marges sur tout le book à mesure que la volatilité explose (le mécanisme du module 1, vu d'amont). Le hedge protège le P&L à l'échéance ; il ne fait rien pour la trésorerie de ce soir. Les desks meurent de cash bien avant de mourir de P&L — la leçon de Metallgesellschaft, à la vitesse d'horloge d'un market maker.`,
          }],
        },
        {
          intitule: en ? 'e) The mark-to-market of the sold calls' : 'e) Le re-marquage des calls vendus',
          enonce: en
            ? `Repriced at spot ${f(S1, 2)}, vol ${pct(vol1, 0)}, one week left, what have the sold calls cost since inception, in millions of dollars (loss as a positive number)?`
            : `Re-pricés au spot ${f(S1, 2)}, vol ${pct(vol1, 0)}, une semaine restante, que coûtent les calls vendus depuis l'initiation, en millions de dollars (perte en positif) ?`,
          reponse: repPerte, tolerance: Math.max(0.5, repPerte * 0.03), toleranceMode: 'absolu', unite: 'M$',
          etapes: [{
            titre: en ? 'Both Greeks fired at once' : 'Les deux grecques ont tiré en même temps',
            contenu: en
              ? `New call value = ${mnt(r2(val1), '$')} against ${mnt(r2(prime0), '$')} collected: loss = (${f(r2(val1), 2)} − ${f(r2(prime0), 2)}) × ${f(n, 0)} × ${f(QUOTITE, 0)} = **${mnt(repPerte, '$', 1)}m**. The spot demolished you (short gamma) AND the implied jumped ${f(dVol, 0)} points (short vega): in a squeeze, the seller's two exposures lose together — the same one-scenario concentration that killed the "diversified" book in Singapore (module 7). The hedge shares offset part of it; the gamma gap and the vol jump, nothing offsets.`
              : `Nouvelle valeur du call = ${f(r2(val1), 2)} \\$ contre ${f(r2(prime0), 2)} \\$ encaissés : perte = (${f(r2(val1), 2)} − ${f(r2(prime0), 2)}) × ${f(n, 0)} × ${f(QUOTITE, 0)} = **${f(repPerte, 1)} M\\$**. Le spot vous a démoli (gamma vendu) ET l'implicite a sauté de ${f(dVol, 0)} points (vega vendu) : dans un squeeze, les deux expositions du vendeur perdent ensemble — la même concentration sur un seul scénario qui a tué le book « diversifié » de Singapour (module 7). Les actions de couverture en compensent une partie ; le trou de gamma et le saut de vol, rien ne les compense.`,
          }],
        },
        {
          intitule: en ? 'f) Your share of the flow — the loop, quantified' : 'f) Votre part du flux — la boucle, chiffrée',
          enonce: en
            ? `Against an average daily volume of ${f(volJourM, 0)} million shares, what share of one day's volume did your hedging purchases alone represent, in %?`
            : `Face à un volume quotidien moyen de ${f(volJourM, 0)} millions de titres, quelle part d'une journée de volume vos seuls achats de couverture ont-ils représentée, en % ?`,
          reponse: repPart, tolerance: Math.max(0.2, repPart * 0.05), toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'One desk, measurable pressure' : 'Un seul desk, une pression mesurable',
              contenu: en
                ? `${f(repAchat, 0)} / ${f(volJourM, 0)}M = **${pct(repPart, 1)}** of a normal day's volume — from ONE market maker, on ONE strike. Add every strike being crossed, every desk carrying the same retail flow, and the short sellers forced to buy back on top, and the mechanical demand overwhelms the float: the stock rises because the plumbing of delta-hedging REQUIRES it to be bought, not because anyone re-valued the company (chapter 7's definition of the gamma squeeze).`
                : `${f(repAchat, 0)} / ${f(volJourM, 0)} M = **${pct(repPart, 1)}** d'une journée normale de volume — pour UN market maker, sur UN strike. Ajoutez tous les strikes franchis, tous les desks portant le même flux retail, et par-dessus les vendeurs à découvert forcés de racheter, et la demande mécanique submerge le flottant : l'action monte parce que la tuyauterie du delta-hedging EXIGE qu'on l'achète, pas parce que quiconque a réévalué l'entreprise (la définition du gamma squeeze au chapitre 7).`,
            },
            {
              titre: en ? 'The verdict, and the bridge to module 1' : 'Le verdict, et le pont vers le module 1',
              contenu: en
                ? `The historical episode: GameStop rose from about \\$17 to an intraday \\$483 in January 2021. The market makers were not the villains of the story — they were its ENGINE, hedging exactly as chapter 5 teaches; and when the clearing house saw the volatility, it multiplied the brokers' margin deposits overnight (about \\$3 billion demanded of Robinhood on January 28), forcing the purchase restrictions module 1 recounted. Front of the mechanism: gamma. Back of the mechanism: margin. Same event, two floors — and a market where the derivative steered the underlying for several days.`
                : `L'épisode historique : GameStop passe d'environ 17 \\$ à 483 \\$ en intraday en janvier 2021. Les market makers n'étaient pas les méchants de l'histoire — ils en étaient le MOTEUR, couvrant exactement comme le chapitre 5 l'enseigne ; et quand la chambre de compensation a vu la volatilité, elle a multiplié les dépôts de marge des courtiers du jour au lendemain (environ 3 milliards de dollars exigés de Robinhood le 28 janvier), forçant les restrictions d'achat que le module 1 a racontées. Devant le mécanisme : le gamma. Derrière : la marge. Un seul événement, deux étages — et un marché où le dérivé a piloté le sous-jacent pendant plusieurs jours.`,
            },
          ],
          pieges: [en
            ? `"The market makers speculated against retail" reads the story backwards: their buying AMPLIFIED the rise. The maker's book is flat by design; what it cannot be is instantaneous — and the lag, times the size, is the squeeze.`
            : `« Les market makers ont spéculé contre les particuliers » lit l'histoire à l'envers : leurs achats ont AMPLIFIÉ la hausse. Le book du maker est plat par construction ; ce qu'il ne peut pas être, c'est instantané — et le retard, multiplié par la taille, c'est le squeeze.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 17. m8-pb-17 — Octobre 1987 : la portfolio insurance — BOSS N4      */
/* ------------------------------------------------------------------ */
const octobre87: ProblemeMoule = {
  id: 'm8-pb-17', moduleId: M8,
  titre: "Octobre 1987 : l'assurance qui a vendu dans la baisse",
  titreEn: 'October 1987: the insurance that sold into the fall',
  typeDeCas: 'réplication et liquidité',
  typeDeCasEn: 'replication and liquidity',
  difficulte: 4,
  scenarios: ["Quant du programme d'assurance, vendredi 16 octobre au soir", 'Directeur des placements du fonds de pension client, le lundi', 'Grand oral : la naissance du skew'],
  scenariosEn: ['Quant at the insurance program, Friday October 16, evening', "The pension fund's CIO, on the Monday", 'Final viva: the birth of the skew'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const S0 = randInt(rng, 280, 320);
    const kp = Math.round(S0 * 0.95);
    const vol0 = randFloat(rng, 15, 20, 1);
    const rTx = randFloat(rng, 5, 8, 1);
    const T = 1;
    const portM = randInt(rng, 2000, 6000);
    const aumMd = randInt(rng, 60, 100);
    const k1 = randFloat(rng, 8, 12, 1);
    const k2 = randFloat(rng, 20, 23, 1);
    const volPanique = randInt(rng, 40, 55);
    const slipPct = randFloat(rng, 3, 6, 1);
    const volSkew = randInt(rng, 38, 48);

    const d0 = deltaPut(S0, kp, rTx, vol0, T);
    const ventes0 = Math.abs(d0) * portM;
    const S1 = r2(S0 * (1 - k1 / 100));
    const d1 = deltaPut(S1, kp, rTx, vol0, T);
    const ventesMidi = (Math.abs(d1) - Math.abs(d0)) * portM;
    const ventesAggMd = (Math.abs(d1) - Math.abs(d0)) * aumMd;
    const S2 = r2(S0 * (1 - k2 / 100));
    const primeVendredi = blackScholesPut(S0, kp, rTx, vol0, T);
    const valPutLundi = blackScholesPut(S2, kp, rTx, volPanique, T);
    const unites = (portM * 1e6) / S0;
    const gainVraiPutM = ((valPutLundi - primeVendredi) * unites) / 1e6;
    const d2th = deltaPut(S2, kp, rTx, vol0, T);
    const ventesLundi = (Math.abs(d2th) - Math.abs(d0)) * portM;
    const slipM = (ventesLundi * slipPct) / 100;
    const k90 = Math.round(0.9 * S2);
    const primeOtm = r2(blackScholesPut(S2, k90, rTx, volSkew, 0.25));
    const callEquiv = primeOtm + S2 - k90 * dfContinu(rTx, 0.25);
    const ivOtm = volImplicitePct(callEquiv, S2, k90, rTx, 0.25);
    const repVentes0 = r0(ventes0);
    const repVentesMidi = r0(ventesMidi);
    const repAgg = r1(ventesAggMd);
    const repVraiPut = r0(gainVraiPutM);
    const repSlip = r0(slipM);
    const repIvOtm = r1(ivOtm);

    const { en, f, pct, mnt } = outils(langue);
    const desc = en
      ? `the program "insures" \\$${f(portM, 0)} million of equities by REPLICATING a 1-year put struck at ${f(kp, 0)} (95% of the index at ${f(S0, 0)} points): no option is bought — the model (vol ${pct(vol0, 1)}, rate ${pct(rTx, 1)}) prescribes selling index futures in the proportion of the put's delta, and adjusting as the market moves; across Wall Street, portfolio insurance covers about \\$${f(aumMd, 0)} billion on the same recipe; a real 1-year put at ${f(kp, 0)} costs ${f(r2(primeVendredi), 2)} points today`
      : `le programme « assure » ${f(portM, 0)} M\\$ d'actions en RÉPLIQUANT un put 1 an de strike ${f(kp, 0)} (95 % de l'indice à ${f(S0, 0)} points) : aucune option n'est achetée — le modèle (vol ${pct(vol0, 1)}, taux ${pct(rTx, 1)}) prescrit de vendre des futures sur indice dans la proportion du delta du put, et d'ajuster à mesure que le marché bouge ; sur toute la place, la portfolio insurance couvre environ ${f(aumMd, 0)} Md\\$ avec la même recette ; un vrai put 1 an de strike ${f(kp, 0)} coûte aujourd'hui ${f(r2(primeVendredi), 2)} points`;
    const contexte = (en
      ? [
        `Friday, October 16, 1987, 7 p.m. You are the quant who runs the replication engine: ${desc}. The sales pitch is beautiful and true — in a liquid market: why pay ${f(r2(primeVendredi), 2)} points of premium when chapter 5 teaches you to MANUFACTURE the put by delta-hedging? The week has been bad, the worst since the war says the radio, and your model has already been selling for three sessions.\n\nMonday morning will open in a void. Before it does, redo the arithmetic that history will do for you: the futures sold at inception, the additional sales the model demands mid-fall, what the entire industry's identical models demand at the same second — and then, Monday night, compare your synthetic put to the real one you refused to buy: the protection it delivered, the slippage it cost, and the price the market will put on real puts from Tuesday on.`,
        `You run the pension fund that bought the "insurance". Your consultant's slide deck promised a floor at 95% for a fraction of the cost of real options: ${desc}. Monday, October 19, the floor met the market: down ${pct(k1, 1)} by midday, ${pct(k2, 1)} by the close — the worst session in the index's history, and your insurer sold futures into every leg of it.\n\nTuesday, you demand the post-mortem in numbers, not adjectives: what the program sold before the crash, what it was forced to sell during it, what everyone else's programs sold at the same time, what a REAL put would have paid that night, what the forced execution cost against the theory — and what protection now costs, since the market has repriced disaster forever. The consultant calls it a "twenty-sigma event"; you want the mechanism.`,
        `The examiner opens with the chapter's sentence: "when everyone has the same plan, the plan fails. Prove it on October 19, 1987." The data: ${desc}.\n\nHe wants the full autopsy: the initial hedge in futures, the mid-fall rebalancing, the industry-wide aggregation that turned a hedge into an avalanche, the comparison with the real put at the close, the slippage bill of a replication executed into gaps — and the birth certificate of the skew: the implied volatility of out-of-the-money puts once the market reopened. The candidate who says "the model was wrong" fails; the model assumed liquidity, and liquidity is precisely what identical plans destroy.`,
      ]
      : [
        `Vendredi 16 octobre 1987, 19 h. Vous êtes le quant qui fait tourner le moteur de réplication : ${desc}. L'argumentaire commercial est beau et vrai — dans un marché liquide : pourquoi payer ${f(r2(primeVendredi), 2)} points de prime quand le chapitre 5 vous apprend à FABRIQUER le put par delta-hedging ? La semaine a été mauvaise, la pire depuis la guerre dit la radio, et votre modèle vend déjà depuis trois séances.\n\nLundi matin ouvrira dans le vide. Avant cela, refaites l'arithmétique que l'histoire fera pour vous : les futures vendus à l'initiation, les ventes supplémentaires que le modèle exige au milieu de la chute, ce que les modèles identiques de toute l'industrie exigent à la même seconde — puis, lundi soir, comparez votre put synthétique au vrai que vous avez refusé d'acheter : la protection qu'il a livrée, le slippage qu'il a coûté, et le prix que le marché mettra sur les vrais puts dès mardi.`,
        `Vous dirigez le fonds de pension qui a acheté l'« assurance ». La présentation du consultant promettait un plancher à 95 % pour une fraction du coût des vraies options : ${desc}. Lundi 19 octobre, le plancher a rencontré le marché : −${pct(k1, 1)} à la mi-journée, −${pct(k2, 1)} à la clôture — la pire séance de l'histoire de l'indice, et votre assureur a vendu des futures dans chaque jambe de la chute.\n\nMardi, vous exigez l'autopsie en nombres, pas en adjectifs : ce que le programme a vendu avant le krach, ce qu'il a été forcé de vendre pendant, ce que les programmes des autres ont vendu au même moment, ce qu'un VRAI put aurait payé ce soir-là, ce que l'exécution forcée a coûté par rapport à la théorie — et ce que coûte désormais la protection, puisque le marché a re-pricé le désastre pour toujours. Le consultant parle d'un « événement à vingt sigmas » ; vous voulez le mécanisme.`,
        `L'examinateur ouvre avec la phrase du chapitre : « quand tout le monde a le même plan, le plan échoue. Prouvez-le sur le 19 octobre 1987. » Les données : ${desc}.\n\nIl attend l'autopsie complète : le hedge initial en futures, le réajustement au milieu de la chute, l'agrégation à l'échelle de l'industrie qui a changé une couverture en avalanche, la comparaison avec le vrai put à la clôture, la facture de slippage d'une réplication exécutée dans les gaps — et l'acte de naissance du skew : la vol implicite des puts hors de la monnaie à la réouverture. Le candidat qui dit « le modèle était faux » échoue ; le modèle supposait la liquidité, et la liquidité est précisément ce que les plans identiques détruisent.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The synthetic put, at rest' : 'a) Le put synthétique, au repos',
          enonce: en
            ? `At inception (index ${f(S0, 0)}), what notional of index futures must the program SELL to replicate the put's delta, in millions of dollars?`
            : `À l'initiation (indice à ${f(S0, 0)}), quel notionnel de futures sur indice le programme doit-il VENDRE pour répliquer le delta du put, en millions de dollars ?`,
          reponse: repVentes0, tolerance: Math.max(20, repVentes0 * 0.04), toleranceMode: 'absolu', unite: 'M$',
          etapes: [{
            titre: en ? 'A put is minus-delta of underlying' : 'Un put, c\'est moins-delta de sous-jacent',
            contenu: en
              ? `Δ_put = N(d₁) − 1 = ${f(r2(d0), 2)}: replicating the put means holding ${pct(r0(Math.abs(d0) * 100), 0)} LESS equity exposure, i.e. selling |Δ| × ${f(portM, 0)} = **${mnt(repVentes0, '$', 0)}m** of futures. So far, chapter 5 exactly: the synthetic put is cheaper than the real one because you only "pay" it through the rebalancing trades. The premium you saved is not gone — it is deferred, and it will be invoiced by the market path.`
              : `Δ_put = N(d₁) − 1 = ${f(r2(d0), 2)} : répliquer le put, c'est détenir ${pct(r0(Math.abs(d0) * 100), 0)} d'exposition actions EN MOINS, donc vendre |Δ| × ${f(portM, 0)} = **${f(repVentes0, 0)} M\\$** de futures. Jusqu'ici, le chapitre 5 exactement : le put synthétique est moins cher que le vrai parce qu'on ne le « paie » qu'à travers les trades de réajustement. La prime économisée n'a pas disparu — elle est différée, et c'est le chemin du marché qui la facturera.`,
          }],
        },
        {
          intitule: en ? 'b) Midday Monday: the model says SELL' : 'b) Lundi midi : le modèle dit VENDRE',
          enonce: en
            ? `The index is down ${pct(k1, 1)} at ${f(S1, 2)}. How many additional millions must the program sell to follow the put's new delta?`
            : `L'indice perd ${pct(k1, 1)} à ${f(S1, 2)}. Combien de millions supplémentaires le programme doit-il vendre pour suivre le nouveau delta du put ?`,
          reponse: repVentesMidi, tolerance: Math.max(20, repVentesMidi * 0.05), toleranceMode: 'absolu', unite: 'M$',
          etapes: [{
            titre: en ? 'Sell AFTER the fall — always after' : 'Vendre APRÈS la baisse — toujours après',
            contenu: en
              ? `New delta: Δ = ${f(r2(d1), 2)} (the put slid toward the money, N(d₁) fell). Additional sales = (${f(r2(Math.abs(d1)), 2)} − ${f(r2(Math.abs(d0)), 2)}) × ${f(portM, 0)} = **${mnt(repVentesMidi, '$', 0)}m** — executed INTO the fall, by construction. Replication is short gamma in its trading pattern: it buys after rises, sells after falls. One program, it is a cost; a whole industry, it is a direction.`
              : `Nouveau delta : Δ = ${f(r2(d1), 2)} (le put a glissé vers la monnaie, N(d₁) a chuté). Ventes supplémentaires = (${f(r2(Math.abs(d1)), 2)} − ${f(r2(Math.abs(d0)), 2)}) × ${f(portM, 0)} = **${f(repVentesMidi, 0)} M\\$** — exécutées DANS la baisse, par construction. La réplication a le profil de trading d'un gamma vendu : elle achète après les hausses, vend après les baisses. Un programme, c'est un coût ; une industrie entière, c'est une direction.`,
          }],
          pieges: [en
            ? `"The program should have waited for a bounce" misses the point: waiting means being UNDER-hedged in a crash — the discipline that makes replication work in calm markets is what makes it lethal in crowded ones.`
            : `« Le programme aurait dû attendre un rebond » manque le point : attendre, c'est être SOUS-couvert dans un krach — la discipline qui fait marcher la réplication par temps calme est ce qui la rend létale quand tout le monde l'applique.`],
        },
        {
          intitule: en ? 'c) Everyone has the same model' : 'c) Tout le monde a le même modèle',
          enonce: en
            ? `The \\$${f(aumMd, 0)} billion insured across the street run the same recipe. What do the identical models order sold on that same move, in billions of dollars?`
            : `Les ${f(aumMd, 0)} Md\\$ assurés sur la place tournent avec la même recette. Que commandent de vendre les modèles identiques sur ce même mouvement, en milliards de dollars ?`,
          reponse: repAgg, tolerance: Math.max(0.5, repAgg * 0.05), toleranceMode: 'absolu', unite: 'Md$',
          etapes: [{
            titre: en ? 'The avalanche, in one multiplication' : 'L\'avalanche, en une multiplication',
            contenu: en
              ? `Same delta shift, applied to the industry: (${f(r2(Math.abs(d1)), 2)} − ${f(r2(Math.abs(d0)), 2)}) × ${f(aumMd, 0)} = **${mnt(repAgg, '$', 1)}bn** of mechanical sell orders hitting a futures market whose entire normal day trades a fraction of that. Every sale pushes the index lower; every lower print raises every program's |delta|; every delta demands more selling. The loop of chapter 7, drawn in one session — the sellers were not panicking, they were OBEYING.`
              : `Le même décalage de delta, appliqué à l'industrie : (${f(r2(Math.abs(d1)), 2)} − ${f(r2(Math.abs(d0)), 2)}) × ${f(aumMd, 0)} = **${f(repAgg, 1)} Md\\$** d'ordres de vente mécaniques frappant un marché de futures dont la journée normale entière traite une fraction de cela. Chaque vente enfonce l'indice ; chaque cours plus bas augmente le |delta| de chaque programme ; chaque delta exige de nouvelles ventes. La boucle du chapitre 7, dessinée en une séance — les vendeurs ne paniquaient pas, ils OBÉISSAIENT.`,
          }],
        },
        {
          intitule: en ? 'd) What the real put would have paid' : 'd) Ce que le vrai put aurait payé',
          enonce: en
            ? `The index closes at ${f(S2, 2)} (−${pct(k2, 1)}) and panic vol hits ${pct(volPanique, 0)}. Marked that night, what would REAL puts bought Friday at ${f(r2(primeVendredi), 2)} points have earned on the \\$${f(portM, 0)}m portfolio, in millions?`
            : `L'indice clôture à ${f(S2, 2)} (−${pct(k2, 1)}) et la vol de panique atteint ${pct(volPanique, 0)}. Marqués ce soir-là, que rapporteraient de VRAIS puts achetés vendredi à ${f(r2(primeVendredi), 2)} points sur le portefeuille de ${f(portM, 0)} M\\$, en millions ?`,
          reponse: repVraiPut, tolerance: Math.max(20, repVraiPut * 0.05), toleranceMode: 'absolu', unite: 'M$',
          etapes: [{
            titre: en ? 'The insurance you actually own' : "L'assurance qu'on possède vraiment",
            contenu: en
              ? `Put marked Monday night: BS(${f(S2, 2)}, ${f(kp, 0)}, vol ${pct(volPanique, 0)}) = ${f(r2(valPutLundi), 2)} points, against ${f(r2(primeVendredi), 2)} paid: gain = (${f(r2(valPutLundi), 2)} − ${f(r2(primeVendredi), 2)}) × ${f(r0(unites), 0)} units = **${mnt(repVraiPut, '$', 0)}m** — intrinsic value PLUS the vol explosion, delivered by a contract, enforceable, with no execution needed in the storm. The real put's seller carries the replication problem; the holder just holds. That difference is what the premium buys, and October 19 is its price tag.`
              : `Put marqué lundi soir : BS(${f(S2, 2)}, ${f(kp, 0)}, vol ${pct(volPanique, 0)}) = ${f(r2(valPutLundi), 2)} points, contre ${f(r2(primeVendredi), 2)} payés : gain = (${f(r2(valPutLundi), 2)} − ${f(r2(primeVendredi), 2)}) × ${f(r0(unites), 0)} unités = **${f(repVraiPut, 0)} M\\$** — la valeur intrinsèque PLUS l'explosion de vol, livrées par un contrat, opposables, sans aucune exécution à réussir dans la tempête. Le vendeur du vrai put porte le problème de réplication ; le porteur, lui, se contente de porter. Cette différence est ce que la prime achète, et le 19 octobre en est l'étiquette de prix.`,
          }],
        },
        {
          intitule: en ? 'e) The slippage bill of the synthetic' : 'e) La facture de slippage du synthétique',
          enonce: en
            ? `Following the model, Monday's total sales reach ${mnt(r0(ventesLundi), '$', 0)}m, but in the gaps they execute on average ${pct(slipPct, 1)} below their theoretical levels. What does the execution alone cost, in millions?`
            : `En suivant le modèle, les ventes totales du lundi atteignent ${f(r0(ventesLundi), 0)} M\\$, mais dans les gaps elles s'exécutent en moyenne ${pct(slipPct, 1)} sous leurs niveaux théoriques. Que coûte la seule exécution, en millions ?`,
          reponse: repSlip, tolerance: Math.max(5, repSlip * 0.05), toleranceMode: 'absolu', unite: 'M$',
          etapes: [
            {
              titre: en ? 'The model assumed a price that no longer existed' : 'Le modèle supposait un prix qui n\'existait plus',
              contenu: en
                ? `${mnt(r0(ventesLundi), '$', 0)}m × ${pct(slipPct, 1)} = **${mnt(repSlip, '$', 0)}m** lost between the theoretical put and the manufactured one — before counting the sales that simply could NOT be executed when futures went offerless. Black-Scholes replication assumes you trade continuously, at the quoted price, without moving it. On October 19 all three assumptions died at once, and they died BECAUSE the replicators were trading.`
                : `${f(r0(ventesLundi), 0)} M\\$ × ${pct(slipPct, 1)} = **${f(repSlip, 0)} M\\$** perdus entre le put théorique et le put fabriqué — avant de compter les ventes qui n'ont simplement PAS pu être exécutées quand les futures n'avaient plus d'acheteurs. La réplication de Black-Scholes suppose qu'on traite en continu, au prix affiché, sans le déplacer. Le 19 octobre, les trois hypothèses sont mortes ensemble, et elles sont mortes PARCE QUE les réplicateurs traitaient.`,
            },
            {
              titre: en ? 'Synthetic versus real: the honest comparison' : 'Synthétique contre vrai : la comparaison honnête',
              contenu: en
                ? `The synthetic put saved ${f(r2(primeVendredi), 2)} points of premium (${mnt(r0((primeVendredi * unites) / 1e6), '$', 0)}m) and returned a protection amputated by ${mnt(repSlip, '$', 0)}m of slippage plus the unexecuted tail. The premium of a real option is not a fee: it is the price of transferring the REPLICATION RISK to a professional — a price that looks expensive in calm markets and cheap exactly once.`
                : `Le put synthétique a économisé ${f(r2(primeVendredi), 2)} points de prime (${f(r0((primeVendredi * unites) / 1e6), 0)} M\\$) et rendu une protection amputée de ${f(repSlip, 0)} M\\$ de slippage, plus la queue non exécutée. La prime d'une vraie option n'est pas une commission : c'est le prix du transfert du RISQUE DE RÉPLICATION à un professionnel — un prix qui paraît cher par temps calme et bon marché exactement une fois.`,
            },
          ],
        },
        {
          intitule: en ? 'f) Tuesday: the scar is priced' : 'f) Mardi : la cicatrice est cotée',
          enonce: en
            ? `At the reopening, the 3-month put struck 10% below the new spot quotes ${f(primeOtm, 2)} points. What implied volatility is the market now charging on it, in %?`
            : `À la réouverture, le put 3 mois frappé 10 % sous le nouveau spot cote ${f(primeOtm, 2)} points. Quelle volatilité implicite le marché facture-t-il désormais dessus, en % ?`,
          reponse: repIvOtm, tolerance: 1.5, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'Invert the price, read the fear' : 'Inverser le prix, lire la peur',
              contenu: en
                ? `Convert to the same-strike call by parity (C = P + S − K·e^{−rT} = ${f(r2(callEquiv), 2)}) and invert Black-Scholes: **${pct(repIvOtm, 1)}** implied — against ${pct(vol0, 1)} quoted on everything the week before. The market is not "mispricing"; it has understood that sold insurance can fail collectively, and it now charges downside protection accordingly.`
                : `Convertissez vers le call de même strike par parité (C = P + S − K·e^{−rT} = ${f(r2(callEquiv), 2)}) et inversez Black-Scholes : **${pct(repIvOtm, 1)}** d'implicite — contre ${pct(vol0, 1)} coté sur tout la semaine d'avant. Le marché ne « se trompe » pas ; il a compris que l'assurance vendue peut échouer collectivement, et il facture désormais la protection contre la baisse en conséquence.`,
            },
            {
              titre: en ? 'The verdict of October 19' : 'Le verdict du 19 octobre',
              contenu: en
                ? `The historical record: Monday, October 19, 1987 — Dow Jones −22.6%, the worst session in its history; portfolio insurance covered an estimated \\$60–90 billion, and official post-mortems (the Brady report) named its mechanical selling among the crash's amplifiers. Nobody was ruined by the formula; they were ruined by the ASSUMPTION behind it — sell without moving prices — applied by everyone at once. Two permanent legacies: the skew, requoted every day since (chapter 6), and the circuit breakers. When everyone has the same plan, the plan fails; the skew is the market writing that sentence into prices, permanently.`
                : `Le constat historique : lundi 19 octobre 1987 — Dow Jones −22,6 %, la pire séance de son histoire ; la portfolio insurance couvrait un montant estimé entre 60 et 90 Md\\$, et les autopsies officielles (rapport Brady) ont désigné ses ventes mécaniques parmi les amplificateurs du krach. Personne n'a été ruiné par la formule ; ils l'ont été par l'HYPOTHÈSE derrière elle — vendre sans déplacer les prix — appliquée par tous en même temps. Deux héritages permanents : le skew, recoté chaque jour depuis (chapitre 6), et les coupe-circuits. Quand tout le monde a le même plan, le plan échoue ; le skew, c'est le marché qui écrit cette phrase dans les prix, pour toujours.`,
            },
          ],
          pieges: [en
            ? `Blaming Black-Scholes for 1987 confuses the tool and its deployment: the same formula prices the real put of d), which protected perfectly — what failed is replication at systemic scale, not the pricing.`
            : `Accuser Black-Scholes de 1987 confond l'outil et son déploiement : la même formule price le vrai put du d), qui a protégé parfaitement — ce qui a échoué, c'est la réplication à l'échelle systémique, pas le pricing.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 18. m8-pb-18 — Les puts nus d'octobre 1997 — BOSS N4                */
/* ------------------------------------------------------------------ */
const putsNus97: ProblemeMoule = {
  id: 'm8-pb-18', moduleId: M8,
  titre: "Ramasser des pièces : les puts nus d'octobre 1997",
  titreEn: 'Picking up pennies: the naked puts of October 1997',
  typeDeCas: "vente d'assurance et marges",
  typeDeCasEn: 'insurance selling and margins',
  difficulte: 4,
  scenarios: ['Le prime broker, lundi 27 octobre au soir', "L'investisseur du fonds qui lit la lettre", 'Grand oral : le rouleau compresseur, pièce à conviction'],
  scenariosEn: ['The prime broker, Monday October 27, evening', 'The fund investor reading the letter', 'Final viva: the steamroller, exhibit A'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const S0 = randInt(rng, 920, 970);
    const K = Math.round((S0 * randFloat(rng, 0.9, 0.93, 2)) / 5) * 5;
    const T = 1 / 12;
    const rTx = randFloat(rng, 5, 6, 1);
    const vol1 = randFloat(rng, 18, 24, 1);
    const nK = randInt(rng, 8, 15);
    const n = nK * 1000;
    const levier = randFloat(rng, 10, 14, 1);
    const chute = randFloat(rng, 6.5, 7.5, 1);
    const dVol2 = randInt(rng, 15, 25);
    const margePct = randFloat(rng, 10, 13, 1);
    const gapOuv = randFloat(rng, 1, 2.5, 1);
    const dVol3 = randInt(rng, 6, 12);
    const rebond = randFloat(rng, 4.5, 5.5, 1);
    const dVol4 = randInt(rng, 4, 8);

    const prime = blackScholesPut(S0, K, rTx, vol1, T);
    const primeTotM = (prime * QUOTITE * n) / 1e6;
    const notionnelM = (S0 * QUOTITE * n) / 1e6;
    const capitalM = r0(notionnelM / levier);
    const levierEff = notionnelM / capitalM;
    const vol2 = vol1 + dVol2;
    const S1 = r2(S0 * (1 - chute / 100));
    const val1 = blackScholesPut(S1, K, rTx, vol2, T);
    const perteM = ((val1 - prime) * QUOTITE * n) / 1e6;
    const margeM = (margePct / 100) * ((S1 * QUOTITE * n) / 1e6);
    const manqueM = margeM - (capitalM - perteM);
    const vol3 = vol2 + dVol3;
    const S2 = r2(S1 * (1 - gapOuv / 100));
    const val2 = blackScholesPut(S2, K, rTx, vol3, T);
    const surcoutM = ((val2 - val1) * QUOTITE * n) / 1e6;
    const vol4 = vol1 + dVol4;
    const S3 = r2(S1 * (1 + rebond / 100));
    const val3 = blackScholesPut(S3, K, rTx, vol4, T);
    const renduM = ((val2 - val3) * QUOTITE * n) / 1e6;
    const repPrime = r2(primeTotM);
    const repLevier = r1(levierEff);
    const repPerte = r1(perteM);
    const repManque = r1(manqueM);
    const repSurcout = r1(surcoutM);
    const repRendu = r1(renduM);

    const { en, f, pct, mnt } = outils(langue);
    const desc = en
      ? `every month, the fund sells ${f(n, 0)} NAKED puts on the index (spot ${f(S0, 0)} points, strike ${f(K, 0)} — about ${pct(r0((1 - K / S0) * 100), 0)} out of the money —, 1 month, rate ${pct(rTx, 1)}, contract size ${f(QUOTITE, 0)}) at ${pct(vol1, 1)} implied vol, with \\$${f(capitalM, 0)} million of capital; this Monday the index drops ${pct(chute, 1)} to ${f(S1, 2)} and the implied leaps to ${pct(r1(vol2), 1)}; the broker's margin requirement runs at ${pct(margePct, 1)} of the notional`
      : `chaque mois, le fonds vend ${f(n, 0)} puts NUS sur l'indice (spot ${f(S0, 0)} points, strike ${f(K, 0)} — environ ${pct(r0((1 - K / S0) * 100), 0)} hors de la monnaie —, 1 mois, taux ${pct(rTx, 1)}, quotité ${f(QUOTITE, 0)}) à ${pct(vol1, 1)} de vol implicite, avec ${f(capitalM, 0)} M\\$ de capital ; ce lundi, l'indice perd ${pct(chute, 1)} à ${f(S1, 2)} et l'implicite bondit à ${pct(r1(vol2), 1)} ; l'exigence de marge du broker tourne à ${pct(margePct, 1)} du notionnel`;
    const contexte = (en
      ? [
        `You run the prime brokerage account of a famous client — a brilliant, decorated fund manager whose strategy has printed money for years by selling what everyone wants to own after a bad day: downside insurance. The account tonight: ${desc}. The premiums arrive every month with the regularity of rent; the fund's track record is a straight line that your risk department has learned to distrust.\n\nMonday, October 27, 1997. Asia has been cracking for weeks, and today the contagion reached New York: the session closed early, circuit breakers triggered for the first time in their history. Your terminal shows the client's puts marked at many times their sale price, and the margin engine is printing a number his capital cannot meet. Before you call him — the hardest call of your career — rebuild the file: the monthly rent, the leverage, today's re-mark, the margin shortfall, the cost of liquidating into tomorrow's panic open… and what the position would be worth twenty-four hours later, because that last number is the cruellest.`,
        `Eighteen months ago you invested in the fund because its returns looked like a savings account with a rocket engine: ${desc}. The manager's letters explained the strategy with total candour — sell out-of-the-money puts, collect the premium, "the market pays you for other people's fear". You never quite computed what happened if fear was right.\n\nNow it is November 1997 and the letter in your hands announces that the fund's accounts were liquidated by its brokers on the morning of October 28. You want to understand, number by number, how a strategy that never had a losing year died in a day: the rent it earned, the leverage it carried, the mark of Black Monday, the margin call it could not meet, the fire-sale surcharge — and the rebound of October 29 that would have saved it, had it survived one more day.`,
        `The examiner produces a single chart: October 27, 1997, Dow −7.2%; October 28, +4.7%. "A famous fund sold naked index puts and did not see the 29th. Walk me through the mechanics." The data: ${desc}.\n\nHe wants the chapter's steamroller made flesh: the premium rent, the leverage that turns a market dip into a capital event, the re-mark when spot AND vol strike together, the margin arithmetic that decides survival — not the P&L —, the liquidation surcharge in the panic, and the counterfactual of the rebound. The lesson he is fishing for closes module 7 and this one at once: being right at expiry is worthless if the treasury dies before the expiry arrives.`,
      ]
      : [
        `Vous gérez le compte de prime brokerage d'un client célèbre — un gérant brillant, couvert de récompenses, dont la stratégie imprime de l'argent depuis des années en vendant ce que tout le monde veut posséder après une mauvaise journée : de l'assurance contre la baisse. Le compte, ce soir : ${desc}. Les primes tombent chaque mois avec la régularité d'un loyer ; le track record du fonds est une ligne droite que votre département des risques a appris à regarder de travers.\n\nLundi 27 octobre 1997. L'Asie craque depuis des semaines, et aujourd'hui la contagion a atteint New York : la séance a fermé en avance, coupe-circuits déclenchés pour la première fois de leur histoire. Votre terminal marque les puts du client à plusieurs fois leur prix de vente, et le moteur de marge imprime un nombre que son capital ne peut pas honorer. Avant de l'appeler — l'appel le plus dur de votre carrière —, reconstituez le dossier : la rente mensuelle, le levier, le re-marquage du jour, le manque de marge, le coût d'une liquidation dans l'ouverture paniquée de demain… et ce que la position vaudrait vingt-quatre heures plus tard, parce que ce dernier nombre est le plus cruel.`,
        `Il y a dix-huit mois, vous avez investi dans le fonds parce que ses rendements ressemblaient à un livret d'épargne équipé d'un réacteur : ${desc}. Les lettres du gérant expliquaient la stratégie avec une candeur totale — vendre des puts hors de la monnaie, encaisser la prime, « le marché vous paie pour la peur des autres ». Vous n'avez jamais vraiment calculé ce qui arrivait si la peur avait raison.\n\nNous voilà en novembre 1997, et la lettre entre vos mains annonce que les comptes du fonds ont été liquidés par ses brokers au matin du 28 octobre. Vous voulez comprendre, nombre par nombre, comment une stratégie qui n'avait jamais connu d'année perdante est morte en un jour : la rente qu'elle gagnait, le levier qu'elle portait, le mark du lundi noir, l'appel de marge impossible à honorer, le surcoût de la vente forcée — et le rebond du 29 octobre qui l'aurait sauvée, si elle avait survécu un jour de plus.`,
        `L'examinateur sort un seul graphique : 27 octobre 1997, Dow −7,2 % ; 28 octobre, +4,7 %. « Un fonds célèbre vendait des puts nus sur indice et n'a pas vu le 29. Déroulez-moi la mécanique. » Les données : ${desc}.\n\nIl attend le rouleau compresseur du chapitre, incarné : la rente de primes, le levier qui change un creux de marché en événement de capital, le re-marquage quand le spot ET la vol frappent ensemble, l'arithmétique de marge qui décide de la survie — pas le P&L —, le surcoût de liquidation dans la panique, et le contrefactuel du rebond. La leçon qu'il pêche referme le module 7 et celui-ci d'un coup : avoir raison à l'échéance ne vaut rien si la trésorerie meurt avant que l'échéance n'arrive.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The monthly rent' : 'a) La rente mensuelle',
          enonce: en
            ? `What premium does one month of sold puts collect, in millions of dollars?`
            : `Quelle prime un mois de puts vendus encaisse-t-il, en millions de dollars ?`,
          reponse: repPrime, tolerance: Math.max(0.05, repPrime * 0.03), toleranceMode: 'absolu', unite: 'M$',
          etapes: [{
            titre: en ? 'Small, regular, intoxicating' : 'Petit, régulier, grisant',
            contenu: en
              ? `BS put ${pct(r0((1 - K / S0) * 100), 0)} out of the money: ${f(r2(prime), 2)} points × ${f(QUOTITE, 0)} × ${f(n, 0)} = **${mnt(repPrime, '$', 2)}m** a month — roughly ${pct(r1((primeTotM / capitalM) * 100 * 12), 0)} a year on the capital, with no losing month in living memory. The P&L signature of the insurance seller (chapter 7): a long series of small certain-looking gains. The question the track record cannot answer: what pays for them.`
              : `Put BS ${pct(r0((1 - K / S0) * 100), 0)} hors de la monnaie : ${f(r2(prime), 2)} points × ${f(QUOTITE, 0)} × ${f(n, 0)} = **${f(repPrime, 2)} M\\$** par mois — environ ${pct(r1((primeTotM / capitalM) * 100 * 12), 0)} par an sur le capital, sans un mois perdant de mémoire d'investisseur. La signature de P&L du vendeur d'assurance (chapitre 7) : une longue série de petits gains d'apparence certaine. La question à laquelle le track record ne répond pas : qui les paie.`,
          }],
        },
        {
          intitule: en ? 'b) The leverage nobody wrote down' : "b) Le levier que personne n'a écrit",
          enonce: en
            ? `The sold puts insure a notional of ${mnt(r0(notionnelM), '$', 0)}m against \\$${f(capitalM, 0)}m of capital. What is the leverage (notional / capital)?`
            : `Les puts vendus assurent un notionnel de ${f(r0(notionnelM), 0)} M\\$ contre ${f(capitalM, 0)} M\\$ de capital. Quel est le levier (notionnel / capital) ?`,
          reponse: repLevier, tolerance: 0.4, toleranceMode: 'absolu', unite: '×',
          etapes: [{
            titre: en ? 'An insurer without an insurer\'s reserves' : "Un assureur sans les réserves d'un assureur",
            contenu: en
              ? `${f(r0(notionnelM), 0)} / ${f(capitalM, 0)} = **${f(repLevier, 1)}×**. Each 1% the index loses BELOW the strike costs about ${mnt(r1(notionnelM / 100), '$', 1)}m — ${pct(r1((notionnelM / 100 / capitalM) * 100), 0)} of the capital. A real insurer holds reserves against the claim; this book holds a track record. Note that nothing here is hidden or illegal: the size is simply calibrated on the premium income, not on the worst path — the exact sizing error chapter 7 warns against.`
              : `${f(r0(notionnelM), 0)} / ${f(capitalM, 0)} = **${f(repLevier, 1)}×**. Chaque 1 % que l'indice perd SOUS le strike coûte environ ${f(r1(notionnelM / 100), 1)} M\\$ — ${pct(r1((notionnelM / 100 / capitalM) * 100), 0)} du capital. Un vrai assureur détient des réserves contre le sinistre ; ce book détient un track record. Notez que rien ici n'est caché ni illégal : la taille est simplement calibrée sur le revenu de primes, pas sur le pire chemin — l'erreur de dimensionnement exacte contre laquelle le chapitre 7 met en garde.`,
          }],
        },
        {
          intitule: en ? "c) Black Monday's re-mark" : 'c) Le re-marquage du lundi noir',
          enonce: en
            ? `Spot at ${f(S1, 2)} (−${pct(chute, 1)}), implied at ${pct(r1(vol2), 1)}. What is the mark-to-market loss on the sold puts, in millions of dollars?`
            : `Spot à ${f(S1, 2)} (−${pct(chute, 1)}), implicite à ${pct(r1(vol2), 1)}. Quelle est la perte de re-marquage sur les puts vendus, en millions de dollars ?`,
          reponse: repPerte, tolerance: Math.max(1, repPerte * 0.04), toleranceMode: 'absolu', unite: 'M$',
          etapes: [{
            titre: en ? 'Spot and vol strike together — they always do' : 'Le spot et la vol frappent ensemble — toujours',
            contenu: en
              ? `The puts reprice at BS(${f(S1, 2)}, ${f(K, 0)}, ${pct(r1(vol2), 1)}) = ${f(r2(val1), 2)} points, against ${f(r2(prime), 2)} collected: loss = (${f(r2(val1), 2)} − ${f(r2(prime), 2)}) × ${f(QUOTITE, 0)} × ${f(n, 0)} = **${mnt(repPerte, '$', 1)}m** — ${f(r0((perteM / primeTotM) * 10) / 10, 1)} months of rent, or ${pct(r0((perteM / capitalM) * 100), 0)} of the capital, in ONE session. The puts are not even in the money yet: most of this loss is the vol jump and the shortened distance — the market repricing the INSURANCE, not paying the claim. For a margined seller, that distinction changes nothing: the mark IS the cash call.`
              : `Les puts se re-pricent à BS(${f(S1, 2)}, ${f(K, 0)}, ${pct(r1(vol2), 1)}) = ${f(r2(val1), 2)} points, contre ${f(r2(prime), 2)} encaissés : perte = (${f(r2(val1), 2)} − ${f(r2(prime), 2)}) × ${f(QUOTITE, 0)} × ${f(n, 0)} = **${f(repPerte, 1)} M\\$** — ${f(r0((perteM / primeTotM) * 10) / 10, 1)} mois de rente, ou ${pct(r0((perteM / capitalM) * 100), 0)} du capital, en UNE séance. Les puts ne sont même pas encore dans la monnaie : l'essentiel de cette perte est le saut de vol et la distance raccourcie — le marché re-price l'ASSURANCE, il ne paie pas le sinistre. Pour un vendeur sous marge, cette distinction ne change rien : le mark EST l'appel de cash.`,
          }],
          pieges: [en
            ? `"The index is still above the strike, so nothing is lost" reads the position like a hold-to-expiry buyer: a margined seller lives on the mark, and the mark just moved ${f(r0(val1 / prime), 0)}-fold against him.`
            : `« L'indice est encore au-dessus du strike, donc rien n'est perdu » lit la position comme un acheteur qui tient à l'échéance : un vendeur sous marge vit sur le mark, et le mark vient de bouger d'un facteur ${f(r0(val1 / prime), 0)} contre lui.`],
        },
        {
          intitule: en ? 'd) The margin arithmetic' : "d) L'arithmétique de marge",
          enonce: en
            ? `The broker requires ${pct(margePct, 1)} of the revalued notional. After the day's loss, by how many millions does the requirement exceed the remaining capital?`
            : `Le broker exige ${pct(margePct, 1)} du notionnel réévalué. Après la perte du jour, de combien de millions l'exigence dépasse-t-elle le capital restant ?`,
          reponse: repManque, tolerance: Math.max(1, repManque * 0.06), toleranceMode: 'absolu', unite: 'M$',
          etapes: [{
            titre: en ? 'Survival is a margin equation, not a P&L one' : 'La survie est une équation de marge, pas de P&L',
            contenu: en
              ? `Requirement = ${pct(margePct, 1)} × ${mnt(r0((S1 * QUOTITE * n) / 1e6), '$', 0)}m = ${mnt(r1(margeM), '$', 1)}m; remaining capital = ${f(capitalM, 0)} − ${f(repPerte, 1)} = ${mnt(r1(capitalM - perteM), '$', 1)}m; shortfall = **${mnt(repManque, '$', 1)}m**, due before tomorrow's open. There is no negotiation clause in a margin agreement, and the assets that could be pledged are the very puts that are collapsing. This is the same sentence as Metallgesellschaft's (module 7), one derivative later: the position may be defensible at expiry; the ACCOUNT dies tonight.`
              : `Exigence = ${pct(margePct, 1)} × ${f(r0((S1 * QUOTITE * n) / 1e6), 0)} M\\$ = ${f(r1(margeM), 1)} M\\$ ; capital restant = ${f(capitalM, 0)} − ${f(repPerte, 1)} = ${f(r1(capitalM - perteM), 1)} M\\$ ; manque = **${f(repManque, 1)} M\\$**, exigibles avant l'ouverture de demain. Il n'y a pas de clause de négociation dans un contrat de marge, et les actifs qu'on pourrait nantir sont les puts mêmes qui s'effondrent. C'est la phrase de Metallgesellschaft (module 7), un dérivé plus tard : la position est peut-être défendable à l'échéance ; le COMPTE meurt ce soir.`,
          }],
        },
        {
          intitule: en ? 'e) The fire sale' : 'e) La vente au son du canon',
          enonce: en
            ? `Tuesday opens down another ${pct(gapOuv, 1)} with panic vol at ${pct(r1(vol3), 1)}, and the broker buys the puts back there. What does the liquidation cost BEYOND Monday's mark, in millions?`
            : `Mardi ouvre encore −${pct(gapOuv, 1)} avec une vol de panique à ${pct(r1(vol3), 1)}, et le broker y rachète les puts. Que coûte la liquidation AU-DELÀ du mark du lundi, en millions ?`,
          reponse: repSurcout, tolerance: Math.max(1, repSurcout * 0.06), toleranceMode: 'absolu', unite: 'M$',
          etapes: [{
            titre: en ? 'Liquidated at the worst print of the crisis' : 'Liquidé au pire cours de la crise',
            contenu: en
              ? `Puts bought back at BS(${f(S2, 2)}, ${pct(r1(vol3), 1)}) = ${f(r2(val2), 2)} points: surcharge = (${f(r2(val2), 2)} − ${f(r2(val1), 2)}) × ${f(QUOTITE, 0)} × ${f(n, 0)} = **${mnt(repSurcout, '$', 1)}m** on top of Monday. A forced buyer in a panicked options market pays the widest spreads of the year, at the highest vol of the year: the counterparties know WHY you are buying. The broker is not cruel — he is margined too, one floor up; the cascade of module 1, running through people this time.`
              : `Puts rachetés à BS(${f(S2, 2)}, ${pct(r1(vol3), 1)}) = ${f(r2(val2), 2)} points : surcoût = (${f(r2(val2), 2)} − ${f(r2(val1), 2)}) × ${f(QUOTITE, 0)} × ${f(n, 0)} = **${f(repSurcout, 1)} M\\$** par-dessus le lundi. Un acheteur forcé dans un marché d'options paniqué paie les fourchettes les plus larges de l'année, à la vol la plus haute de l'année : les contreparties savent POURQUOI vous achetez. Le broker n'est pas cruel — il est lui-même sous marge, un étage plus haut ; la cascade du module 1, version humaine cette fois.`,
          }],
        },
        {
          intitule: en ? 'f) Twenty-four hours too early' : 'f) Vingt-quatre heures trop tôt',
          enonce: en
            ? `The next day the market rebounds ${pct(rebond, 1)} and vol falls back to ${pct(r1(vol4), 1)}. Marked there, how many millions would NOT closing at the panic open have given back?`
            : `Le lendemain, le marché rebondit de ${pct(rebond, 1)} et la vol retombe à ${pct(r1(vol4), 1)}. Marqués là, combien de millions le fait de NE PAS avoir clôturé dans l'ouverture paniquée aurait-il rendus ?`,
          reponse: repRendu, tolerance: Math.max(1, repRendu * 0.05), toleranceMode: 'absolu', unite: 'M$',
          etapes: [
            {
              titre: en ? 'The cruellest column of the file' : 'La colonne la plus cruelle du dossier',
              contenu: en
                ? `Puts at BS(${f(S3, 2)}, ${pct(r1(vol4), 1)}) = ${f(r2(val3), 2)} points: versus the ${f(r2(val2), 2)} paid in the liquidation, that is **${mnt(repRendu, '$', 1)}m** returned by one day of patience the fund did not have the capital to afford. He was "right": the index never went near the strike again that year. Being right was never the question — funding the path was.`
                : `Puts à BS(${f(S3, 2)}, ${pct(r1(vol4), 1)}) = ${f(r2(val3), 2)} points : contre les ${f(r2(val2), 2)} payés à la liquidation, cela fait **${f(repRendu, 1)} M\\$** rendus par un jour de patience que le fonds n'avait pas le capital de s'offrir. Il avait « raison » : l'indice n'est plus repassé près du strike de l'année. Avoir raison n'a jamais été la question — financer le chemin, si.`,
            },
            {
              titre: en ? 'The historical verdict' : 'Le verdict historique',
              contenu: en
                ? `The real case: Victor Niederhoffer — celebrated trader, best-selling author, years of stellar returns — was selling naked S&P 500 puts in October 1997, already weakened by losses on Thai stocks. On October 27 the Dow fell 554 points (−7.2%, first-ever circuit-breaker close); unable to meet the margin calls, his funds (about \\$130 million) were liquidated by his brokers on the morning of the 28th — the very session that closed UP 337 points. Everything in this problem is that story with the serial numbers filed off. Recite the chapter's image before any jury: selling options is picking up coins in front of a steamroller — and the steamroller does not check whether you were, on average, right.`
                : `Le cas réel : Victor Niederhoffer — trader célébré, auteur à succès, des années de rendements éclatants — vendait des puts nus sur le S&P 500 en octobre 1997, déjà affaibli par des pertes sur les actions thaïlandaises. Le 27 octobre, le Dow perd 554 points (−7,2 %, première clôture par coupe-circuits de l'histoire) ; incapables d'honorer les appels de marge, ses fonds (environ 130 M\\$) sont liquidés par ses brokers au matin du 28 — la séance même qui clôture en hausse de 337 points. Tout ce problème est cette histoire, numéros de série limés. Récitez l'image du chapitre devant tout jury : vendre des options, c'est ramasser des pièces devant un rouleau compresseur — et le rouleau ne vérifie pas si vous aviez, en moyenne, raison.`,
            },
          ],
          pieges: [en
            ? `"He was unlucky by one day, so the strategy was fine" inverts the lesson: a strategy whose survival depends on the ORDER of two market days is not a strategy with bad luck, it is a position with too much size.`
            : `« À un jour près, donc la stratégie était bonne » inverse la leçon : une stratégie dont la survie dépend de l'ORDRE de deux séances de bourse n'est pas une stratégie malchanceuse, c'est une position trop grosse.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 19. m8-pb-19 — Le book de vega de LTCM — BOSS N4                    */
/* ------------------------------------------------------------------ */
const vegaLtcm: ProblemeMoule = {
  id: 'm8-pb-19', moduleId: M8,
  titre: 'La banque centrale de la volatilité : le book de vega de LTCM',
  titreEn: "The central bank of volatility: LTCM's vega book",
  typeDeCas: 'vega et risque de queue',
  typeDeCasEn: 'vega and tail risk',
  difficulte: 4,
  scenarios: ['Jeune quant au desk vol du fonds, août 1998', 'Le trésorier face aux appels de collatéral, septembre 1998', 'Grand oral : avoir raison trop tard'],
  scenariosEn: ["Young quant on the fund's vol desk, August 1998", 'The treasurer facing the collateral calls, September 1998', 'Final viva: being right too late'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const S = randInt(rng, 1050, 1150);
    const K = S;
    const T = 5;
    const rTx = randFloat(rng, 4.5, 5.5, 1);
    const volVendue = randFloat(rng, 20, 24, 1);
    const volReal = randFloat(rng, 12, 16, 1);
    const vegaCibleM = randInt(rng, 30, 50);
    const dVol = randInt(rng, 8, 14);
    const capitalM = randInt(rng, 400, 800);

    const vegaUnit = 2 * vegaOption(S, K, rTx, volVendue, T);
    const n = Math.round((vegaCibleM * 1e6) / (vegaUnit * QUOTITE));
    const call0 = blackScholesCall(S, K, rTx, volVendue, T);
    const put0 = blackScholesPut(S, K, rTx, volVendue, T);
    const prime = call0 + put0;
    const primeMdUsd = (prime * QUOTITE * n) / 1e9;
    const straddleJuste = blackScholesCall(S, K, rTx, volReal, T) + blackScholesPut(S, K, rTx, volReal, T);
    const edgeM = ((prime - straddleJuste) * QUOTITE * n) / 1e6;
    const vegaBookM = (vegaUnit * QUOTITE * n) / 1e6;
    const perteVegaM = vegaBookM * dVol;
    const volCrise = volVendue + dVol;
    const straddleCrise = blackScholesCall(S, K, rTx, volCrise, T) + blackScholesPut(S, K, rTx, volCrise, T);
    const perteExactM = ((straddleCrise - prime) * QUOTITE * n) / 1e6;
    const partCapital = (perteExactM / capitalM) * 100;
    const ratioEdge = perteExactM / edgeM;
    const repPrime = r2(primeMdUsd);
    const repEdge = r0(edgeM);
    const repVega = r1(vegaBookM);
    const repPerteVega = r0(perteVegaM);
    const repPart = r0(partCapital);
    const repRatio = r2(ratioEdge);

    const { en, f, pct, mnt } = outils(langue);
    const desc = en
      ? `the fund sells ${f(n, 0)} FIVE-YEAR at-the-money straddles on the index (spot ${f(S, 0)} points, rate ${pct(rTx, 1)}, contract size ${f(QUOTITE, 0)}) at ${pct(volVendue, 1)} implied — long-dated vol it judges absurdly rich against a realised running near ${pct(volReal, 1)}; the desk describes the book as "short about \\$${f(vegaCibleM, 0)} million per vol point"; the capital allocated to the strategy is \\$${f(capitalM, 0)} million; after Russia defaults, five-year implied vol gaps ${f(dVol, 0)} points higher`
      : `le fonds vend ${f(n, 0)} straddles CINQ ANS à la monnaie sur l'indice (spot ${f(S, 0)} points, taux ${pct(rTx, 1)}, quotité ${f(QUOTITE, 0)}) à ${pct(volVendue, 1)} d'implicite — de la vol longue qu'il juge absurdement chère face à une réalisée proche de ${pct(volReal, 1)} ; le desk décrit le book comme « short environ ${f(vegaCibleM, 0)} M\\$ par point de vol » ; le capital alloué à la stratégie est de ${f(capitalM, 0)} M\\$ ; après le défaut de la Russie, la vol implicite cinq ans saute de ${f(dVol, 0)} points`;
    const contexte = (en
      ? [
        `Greenwich, Connecticut, summer 1998. You were hired out of your PhD by the fund everyone wants to join — two Nobel laureates in the partners' room, the very names on this module's formula. Your desk's thesis is elegant: ${desc}. Banks keep buying long-dated vol to hedge the guaranteed products they sell to retail; that flow pushes the five-year implied far above any reasonable realised. So the fund sells it — so much of it that the street has nicknamed the firm "the central bank of volatility": whoever needs vol comes to you.\n\nAugust 17, Russia defaults. Flight to quality everywhere, and the implied vols your book is short are gapping upward with no seller in sight — except you, who cannot be. Tonight you must put the honest numbers in front of the partners: what the book collected, what the edge was worth if the thesis held, the vega that measures the position, the loss the gap inflicts, its share of the capital — and the ratio that compares what one month destroyed to what five years were supposed to earn.`,
        `September 1998. You are the treasurer, and your day is a list of collateral calls: ${desc}. Every counterparty marks the straddles at the new implied and demands the difference in cash or Treasuries, tonight. The positions have five YEARS to be proven right; the calls have twenty-four HOURS.\n\nThe partners repeat, correctly, that the trade's logic is intact — the realised volatility has barely moved, only its PRICE has. You are past that argument: rebuild the file for the banks. The premium collected, the theoretical edge, the vega, the mark-to-market hole after the gap, the fraction of capital it consumes — and the number that ends the meeting: how many times the strategy's entire expected profit the market has just clawed back, while the leverage of the whole fund (assets around \\$125 billion against roughly \\$4 billion of equity by now) forbids waiting.`,
        `The examiner quotes the nickname first: "the market called LTCM the central bank of volatility. Explain the trade, then explain the funeral." The data: ${desc}.\n\nHe wants the full arc: the rich premium of long-dated straddles, the edge against realised vol that made the trade "obviously" good, the vega that made its size legible, the repricing loss when the implied gapped — no earthquake in the REALISED needed, note —, the capital arithmetic, and the ratio of one crisis month to five patient years. Then the closing lesson, which chapter 7 attributes to the whole species of convergence trades: markets can stay irrational longer than a leveraged fund can stay liquid — being right at expiry is a luxury reserved for those who survive until expiry.`,
      ]
      : [
        `Greenwich, Connecticut, été 1998. Vous avez été recruté à la sortie de votre thèse par le fonds que tout le monde veut rejoindre — deux prix Nobel dans la salle des associés, les noms mêmes de la formule de ce module. La thèse de votre desk est élégante : ${desc}. Les banques achètent sans cesse de la vol longue pour couvrir les produits garantis qu'elles vendent aux particuliers ; ce flux pousse l'implicite cinq ans très au-dessus de toute réalisée raisonnable. Alors le fonds la vend — en telle quantité que la place a surnommé la maison « la banque centrale de la volatilité » : qui a besoin de vol vient chez vous.\n\n17 août, la Russie fait défaut. Fuite vers la qualité partout, et les vols implicites que votre book a vendues gappent vers le haut sans un vendeur en vue — sauf vous, qui ne pouvez plus l'être. Ce soir, il faut poser les chiffres honnêtes devant les associés : ce que le book a encaissé, ce que valait l'edge si la thèse tenait, le vega qui mesure la position, la perte que le gap inflige, sa part du capital — et le ratio qui compare ce qu'un mois a détruit à ce que cinq ans devaient rapporter.`,
        `Septembre 1998. Vous êtes le trésorier, et votre journée est une liste d'appels de collatéral : ${desc}. Chaque contrepartie marque les straddles à la nouvelle implicite et exige la différence en cash ou en Treasuries, ce soir. Les positions ont cinq ANS pour avoir raison ; les appels ont vingt-quatre HEURES.\n\nLes associés répètent, à juste titre, que la logique du trade est intacte — la volatilité réalisée n'a presque pas bougé, seul son PRIX a changé. Vous avez dépassé cet argument : reconstituez le dossier pour les banques. La prime encaissée, l'edge théorique, le vega, le trou de mark-to-market après le gap, la fraction du capital qu'il consomme — et le nombre qui met fin à la réunion : combien de fois le profit total espéré de la stratégie le marché vient de reprendre, quand le levier du fonds entier (environ 125 Md\\$ d'actifs contre à peu près 4 Md\\$ de fonds propres désormais) interdit d'attendre.`,
        `L'examinateur commence par le surnom : « le marché appelait LTCM la banque centrale de la volatilité. Expliquez le trade, puis expliquez l'enterrement. » Les données : ${desc}.\n\nIl attend l'arc complet : la prime riche des straddles longs, l'edge contre la réalisée qui rendait le trade « évidemment » bon, le vega qui rendait sa taille lisible, la perte de re-pricing quand l'implicite a gappé — sans le moindre séisme dans la RÉALISÉE, notez-le —, l'arithmétique du capital, et le ratio d'un mois de crise contre cinq années patientes. Puis la leçon finale, que le chapitre 7 attribue à toute l'espèce des trades de convergence : les marchés peuvent rester irrationnels plus longtemps qu'un fonds léveragé ne peut rester liquide — avoir raison à l'échéance est un luxe réservé à ceux qui survivent jusqu'à l'échéance.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The war chest of premiums' : 'a) Le trésor de primes',
          enonce: en
            ? `What do the ${f(n, 0)} five-year straddles collect at sale, in billions of dollars?`
            : `Que rapportent les ${f(n, 0)} straddles cinq ans à la vente, en milliards de dollars ?`,
          reponse: repPrime, tolerance: Math.max(0.03, repPrime * 0.03), toleranceMode: 'absolu', unite: 'Md$',
          etapes: [{
            titre: en ? 'Long-dated options are premium monsters' : 'Les options longues sont des monstres de prime',
            contenu: en
              ? `Five-year straddle at ${pct(volVendue, 1)}: ${f(r2(call0), 2)} + ${f(r2(put0), 2)} = ${f(r2(prime), 2)} points per unit — about ${pct(r0((prime / S) * 100), 0)} of the spot, against a few percent for the module's 3-month versions: premium scales with σ√T. Total collected: **${mnt(repPrime, '$', 2)}bn**. Money in the bank, says the intuition; a LIABILITY marked to market every day, says the treasurer — and this module has already buried several owners of that intuition.`
              : `Straddle cinq ans à ${pct(volVendue, 1)} : ${f(r2(call0), 2)} + ${f(r2(put0), 2)} = ${f(r2(prime), 2)} points l'unité — environ ${pct(r0((prime / S) * 100), 0)} du spot, contre quelques pour cent pour les versions 3 mois du module : la prime croît en σ√T. Total encaissé : **${f(repPrime, 2)} Md\\$**. De l'argent en banque, dit l'intuition ; un PASSIF marqué au marché chaque jour, dit le trésorier — et ce module a déjà enterré plusieurs propriétaires de cette intuition.`,
          }],
        },
        {
          intitule: en ? 'b) The edge, if the thesis holds' : 'b) L\'edge, si la thèse tient',
          enonce: en
            ? `Valued at the ${pct(volReal, 1)} realised vol, the straddles are worth less than they were sold for. What is the theoretical edge, in millions of dollars?`
            : `Valorisés à la réalisée de ${pct(volReal, 1)}, les straddles valent moins que leur prix de vente. Quel est l'edge théorique, en millions de dollars ?`,
          reponse: repEdge, tolerance: Math.max(10, repEdge * 0.04), toleranceMode: 'absolu', unite: 'M$',
          etapes: [{
            titre: en ? 'The whole five-year profit, in one number' : 'Tout le profit des cinq ans, en un nombre',
            contenu: en
              ? `Straddle at ${pct(volReal, 1)}: ${f(r2(straddleJuste), 2)} points; edge = (${f(r2(prime), 2)} − ${f(r2(straddleJuste), 2)}) × ${f(QUOTITE, 0)} × ${f(n, 0)} = **${mnt(repEdge, '$', 0)}m** — IF realised vol stays near ${pct(volReal, 1)} for five years and IF the position can be carried to the end. Both ifs are about the path, and the edge says nothing about the path. That silence is where the story turns.`
              : `Straddle à ${pct(volReal, 1)} : ${f(r2(straddleJuste), 2)} points ; edge = (${f(r2(prime), 2)} − ${f(r2(straddleJuste), 2)}) × ${f(QUOTITE, 0)} × ${f(n, 0)} = **${f(repEdge, 0)} M\\$** — SI la réalisée reste proche de ${pct(volReal, 1)} pendant cinq ans et SI la position peut être portée jusqu'au bout. Les deux « si » parlent du chemin, et l'edge ne dit rien du chemin. Ce silence est l'endroit où l'histoire bascule.`,
          }],
        },
        {
          intitule: en ? 'c) The book, in vega' : 'c) Le book, en vega',
          enonce: en
            ? `Check the desk's sentence: what is the book's vega, in millions of dollars per point of implied vol?`
            : `Vérifiez la phrase du desk : quel est le vega du book, en millions de dollars par point de vol implicite ?`,
          reponse: repVega, tolerance: Math.max(1, repVega * 0.04), toleranceMode: 'absolu', unite: 'M$/point',
          etapes: [{
            titre: en ? 'Why long maturities carry giant vega' : 'Pourquoi les maturités longues portent un vega géant',
            contenu: en
              ? `Straddle vega = 2 × ${f(r2(vegaUnit / 2), 2)} per unit — vega grows like √T (chapter 5), so five-year options carry roughly ${f(r1(Math.sqrt(5 / 0.25)), 1)}× the vega of 3-month ones. Book: ${f(r2(vegaUnit), 2)} × ${f(QUOTITE, 0)} × ${f(n, 0)} = **${mnt(repVega, '$', 1)}m per point**, short — the desk's sentence, verified. One point of repricing = ${mnt(repVega, '$', 0)}m. The nickname "central bank of volatility" was a compliment about liquidity; it was also, read correctly, a size warning nobody chose to read.`
              : `Vega du straddle = 2 × ${f(r2(vegaUnit / 2), 2)} l'unité — le vega croît en √T (chapitre 5), donc des options cinq ans portent environ ${f(r1(Math.sqrt(5 / 0.25)), 1)} fois le vega des 3 mois. Book : ${f(r2(vegaUnit), 2)} × ${f(QUOTITE, 0)} × ${f(n, 0)} = **${f(repVega, 1)} M\\$ par point**, vendeur — la phrase du desk, vérifiée. Un point de re-pricing = ${f(repVega, 0)} M\\$. Le surnom « banque centrale de la volatilité » était un compliment sur la liquidité ; c'était aussi, bien lu, un avertissement de taille que personne n'a choisi de lire.`,
          }],
        },
        {
          intitule: en ? 'd) Russia defaults: the gap' : 'd) La Russie fait défaut : le gap',
          enonce: en
            ? `Five-year implied vol jumps ${f(dVol, 0)} points. By the vega, what does the repricing cost, in millions of dollars?`
            : `L'implicite cinq ans saute de ${f(dVol, 0)} points. Par le vega, que coûte le re-pricing, en millions de dollars ?`,
          reponse: repPerteVega, tolerance: Math.max(10, repPerteVega * 0.04), toleranceMode: 'absolu', unite: 'M$',
          etapes: [
            {
              titre: en ? 'No disaster in the realised — only in the price of fear' : 'Aucun désastre dans la réalisée — seulement dans le prix de la peur',
              contenu: en
                ? `${mnt(repVega, '$', 1)}m × ${f(dVol, 0)} = **${mnt(repPerteVega, '$', 0)}m** (exact Black-Scholes re-mark at ${pct(r1(volCrise), 1)}: ${mnt(r0(perteExactM), '$', 0)}m — ATM straddle vega is nearly flat in σ, so the linear estimate is honest here). Read what happened: the index did not crash, the realised barely moved. The MARKET PRICE of five-year insurance repriced, because every desk wanted the same protection at the same time — and the mark-to-market does not ask whether the repricing is "rational".`
                : `${f(repVega, 1)} M\\$ × ${f(dVol, 0)} = **${f(repPerteVega, 0)} M\\$** (re-marquage Black-Scholes exact à ${pct(r1(volCrise), 1)} : ${f(r0(perteExactM), 0)} M\\$ — le vega d'un straddle ATM est quasi plat en σ, l'estimation linéaire est honnête ici). Lisez ce qui s'est passé : l'indice n'a pas krashé, la réalisée a à peine bougé. Le PRIX DE MARCHÉ de l'assurance cinq ans s'est re-pricé, parce que tous les desks voulaient la même protection au même moment — et le mark-to-market ne demande pas si le re-pricing est « rationnel ».`,
            },
            {
              titre: en ? 'Who else is selling? Nobody' : 'Qui d\'autre vend ? Personne',
              contenu: en
                ? `In calm markets the fund WAS the offer side of long-dated vol; in the crisis, the only natural seller is the one bleeding. Unwinding means buying back vol in a market that knows you must: the exit prices would be worse than the marks. The central bank of volatility discovers what real central banks know — you cannot resign during a run.`
                : `Par temps calme, le fonds ÉTAIT le côté offreur de la vol longue ; dans la crise, le seul vendeur naturel est celui qui saigne. Déboucler, c'est racheter de la vol sur un marché qui sait que vous y êtes obligé : les prix de sortie seraient pires que les marks. La banque centrale de la volatilité découvre ce que savent les vraies banques centrales — on ne démissionne pas pendant une panique.`,
            },
          ],
        },
        {
          intitule: en ? 'e) The capital arithmetic' : "e) L'arithmétique du capital",
          enonce: en
            ? `The counterparties call collateral for the full re-mark. What share of the strategy's \\$${f(capitalM, 0)}m capital does the loss consume, in %?`
            : `Les contreparties appellent du collatéral pour tout le re-marquage. Quelle part du capital de ${f(capitalM, 0)} M\\$ de la stratégie la perte consomme-t-elle, en % ?`,
          reponse: repPart, tolerance: Math.max(2, repPart * 0.05), toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Five-year positions, twenty-four-hour funding' : 'Des positions à cinq ans, un financement à vingt-quatre heures',
            contenu: en
              ? `${mnt(r0(perteExactM), '$', 0)}m / ${f(capitalM, 0)} = **${pct(repPart, 0)}** of the capital, payable in collateral NOW — for positions that cannot be "wrong" before 2003. The maturity mismatch is the whole tragedy: the thesis lives on a five-year clock, the funding on a daily one, and it is always the shorter clock that rings first. Metallgesellschaft heard it on oil futures (module 7); LTCM hears it on vega.`
              : `${f(r0(perteExactM), 0)} M\\$ / ${f(capitalM, 0)} = **${pct(repPart, 0)}** du capital, payables en collatéral MAINTENANT — pour des positions qui ne peuvent pas avoir « tort » avant 2003. Le décalage de maturité est toute la tragédie : la thèse vit sur une horloge à cinq ans, le financement sur une horloge quotidienne, et c'est toujours l'horloge courte qui sonne la première. Metallgesellschaft l'a entendue sur les futures pétroliers (module 7) ; LTCM l'entend sur le vega.`,
          }],
          pieges: [en
            ? `"The loss is only on paper until expiry" — under a collateral agreement there is no paper: every mark settles in cash or securities the next morning, exactly like the clearing house margins of module 7.`
            : `« La perte n'est que sur le papier jusqu'à l'échéance » — sous contrat de collatéral, il n'y a pas de papier : chaque mark se règle en cash ou en titres dès le lendemain matin, exactement comme les marges de chambre du module 7.`],
        },
        {
          intitule: en ? 'f) One month against five years' : 'f) Un mois contre cinq ans',
          enonce: en
            ? `How many times the strategy's ENTIRE theoretical edge (question b) has the repricing clawed back?`
            : `Combien de fois l'edge théorique TOTAL de la stratégie (question b) le re-pricing a-t-il repris ?`,
          reponse: repRatio, tolerance: Math.max(0.1, repRatio * 0.06), toleranceMode: 'absolu', unite: '×',
          etapes: [
            {
              titre: en ? 'The ratio that ends the meeting' : 'Le ratio qui met fin à la réunion',
              contenu: en
                ? `${mnt(r0(perteExactM), '$', 0)}m / ${mnt(repEdge, '$', 0)}m = **${f(repRatio, 2)}×** the total profit the trade was ever supposed to make, taken back in weeks. Even if the thesis is RIGHT — and history suggests it broadly was — the position cannot be held: the fund's overall leverage (assets near \\$125bn on equity shrinking toward \\$400m by late September) turns every additional mark into an existential event.`
                : `${f(r0(perteExactM), 0)} M\\$ / ${f(repEdge, 0)} M\\$ = **${f(repRatio, 2)}×** le profit total que le trade devait jamais rapporter, repris en quelques semaines. Même si la thèse est JUSTE — et l'histoire suggère qu'elle l'était en gros —, la position ne peut pas être tenue : le levier global du fonds (près de 125 Md\\$ d'actifs sur des fonds propres fondant vers 400 M\\$ fin septembre) transforme chaque mark supplémentaire en événement existentiel.`,
            },
            {
              titre: en ? 'The historical verdict — and the module 11 bridge' : 'Le verdict historique — et le pont vers le module 11',
              contenu: en
                ? `The real case: LTCM, with Merton and Scholes among its partners, lost about \\$4.6 billion in 1998 — its short long-dated equity volatility (nicknamed by the street exactly as in this problem) among the biggest single losers, alongside convergence trades that all widened together when Russia defaulted. On September 23, 1998, fourteen banks injected \\$3.65 billion in a rescue orchestrated by the New York Fed — not to save the partners, but because the fund's unwind threatened everyone's books: the systemic sequel is module 11's story. The desk lesson stands on its own: tail risk does not diversify (all the trades were short the same panic), and the market can stay irrational longer than a leveraged fund can stay liquid.`
                : `Le cas réel : LTCM, avec Merton et Scholes parmi ses associés, perd environ 4,6 Md\\$ en 1998 — sa vente de volatilité actions à long terme (surnommée par la place exactement comme dans ce problème) parmi les premières lignes de pertes, aux côtés de trades de convergence qui se sont tous écartés ensemble au défaut russe. Le 23 septembre 1998, quatorze banques injectent 3,65 Md\\$ dans un sauvetage orchestré par la Fed de New York — non pour sauver les associés, mais parce que le débouclage du fonds menaçait les books de tous : la suite systémique est l'histoire du module 11. La leçon de desk tient seule : le risque de queue ne se diversifie pas (tous les trades étaient short la même panique), et le marché peut rester irrationnel plus longtemps qu'un fonds léveragé ne peut rester liquide.`,
            },
          ],
          pieges: [en
            ? `"The best minds in finance failed, so the models are useless" — the models priced correctly; the SIZE and the funding structure failed. The examiners want the mechanism, never the sneer.`
            : `« Les meilleurs esprits de la finance ont échoué, donc les modèles ne servent à rien » — les modèles priçaient correctement ; c'est la TAILLE et la structure de financement qui ont cédé. Les jurys veulent le mécanisme, jamais le ricanement.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 20. m8-pb-20 — L'autocall décomposé (pont module 9) — BOSS N4       */
/* ------------------------------------------------------------------ */
const autocallDecompose: ProblemeMoule = {
  id: 'm8-pb-20', moduleId: M8,
  titre: "Le produit « sans risque » : l'autocall décomposé",
  titreEn: 'The "riskless" product: the autocall, decomposed',
  typeDeCas: 'produits structurés (pont module 9)',
  typeDeCasEn: 'structured products (bridge to module 9)',
  difficulte: 4,
  scenarios: ['Structureur junior avant le comité produit', 'Le banquier privé face au client retraité', 'Grand oral : ouvrir la boîte du produit à coupon'],
  scenariosEn: ['Junior structurer before the product committee', 'The private banker facing the retired client', 'Final viva: opening the coupon product\'s box'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const bPct = pick(rng, [85, 88, 90] as const);
    const vol = randFloat(rng, 19, 25, 1);
    const rTx = randFloat(rng, 2.5, 4, 1);
    const T = 1;
    const margeCible = randFloat(rng, 0.8, 1.6, 1);
    const notionnelM = randInt(rng, 50, 300);
    const chuteSous = randFloat(rng, 8, 20, 1);

    const putPer100 = blackScholesPut(100, bPct, rTx, vol, T);
    const proba = normaleCdf(-d2BlackScholes(100, bPct, rTx, vol, T)) * 100;
    const df = dfContinu(rTx, T);
    const cFair = (100 + putPer100) / df - 100;
    const cAffiche = r1(cFair - margeCible);
    const margePer100 = (cFair - cAffiche) * df;
    const margeTotM = (margePer100 / 100) * notionnelM;
    const sT = r1(bPct - chuteSous);
    const perteClient = payoffPut(sT, bPct) - cAffiche;
    const deltaP = deltaPut(100, bPct, rTx, vol, T);
    const hedgeM = Math.abs(deltaP) * notionnelM;
    const repPut = r2(putPer100);
    const repProba = r1(proba);
    const repFair = r2(cFair);
    const repMarge = r2(margeTotM);
    const repPerte = r1(-perteClient);
    const repHedge = r1(hedgeM);

    const { en, f, pct, mnt } = outils(langue);
    const desc = en
      ? `the note, sold at 100, promises a ${pct(cAffiche, 1)} coupon over 1 year; at maturity, if the index (normalised at 100) finishes at or above the ${f(bPct, 0)} barrier, the client gets capital plus coupon back; below, the client absorbs the index's fall BEYOND the barrier (repaid 100 − (${f(bPct, 0)} − final index), plus the coupon); parameters: vol ${pct(vol, 1)}, rate ${pct(rTx, 1)}; the bank plans a €${f(notionnelM, 0)} million issue`
      : `la note, vendue 100, promet un coupon de ${pct(cAffiche, 1)} sur 1 an ; à l'échéance, si l'indice (normalisé à 100) finit à la barrière de ${f(bPct, 0)} ou au-dessus, le client récupère capital plus coupon ; en dessous, le client absorbe la baisse de l'indice AU-DELÀ de la barrière (remboursé 100 − (${f(bPct, 0)} − indice final), plus le coupon) ; paramètres : vol ${pct(vol, 1)}, taux ${pct(rTx, 1)} ; la banque prévoit une émission de ${f(notionnelM, 0)} M€`;
    const contexte = (en
      ? [
        `Tomorrow, 9 a.m., product committee. You are the junior structurer and the term sheet you must defend is the bank's bread and butter — the one-observation little brother of the autocalls module 9 will industrialise: ${desc}. Marketing has already chosen the name: "Serenity Yield".\n\nYour director's instruction is the profession's oldest: "a structured product is priced by taking it apart." Tonight you decompose: the put the client sells without reading it, the risk-neutral probability that the barrier gives way, the coupon the parameters would honestly pay, the margin the bank pockets on the gap, the client's statement if the index breaks — and the desk's hedge on day one, because the bank keeps none of the market risk: it manufactures, it does not bet.`,
        `The client is seventy-one, sold his company two years ago, and reads slowly. His branch advisor has shown him "an investment that pays ${pct(cAffiche, 1)} when the savings account pays ${pct(r1(rTx - 1), 1)}": ${desc}. You are the private banker the family asked for a second opinion, and the compliance file requires the sentence the brochure avoids: where does the extra yield come from?\n\nYour answer must hold in numbers a non-financier can check: the insurance premium hidden in the coupon, the probability — as the market prices it — that the barrier breaks, the coupon the product would pay if the bank kept nothing, the bank's margin on this issue, and what his statement shows if the index finishes ${pct(chuteSous, 1)} below the barrier. The verdict is not "never buy"; it is "know what you are selling when you buy".`,
        `The examiner holds up a retail brochure, gold letters on navy blue: "guaranteed ${pct(cAffiche, 1)} unless the index falls more than ${f(100 - bPct, 0)}%. Where is the trick?" The data: ${desc}.\n\nHe wants the decomposition that module 9 will generalise: the client is a lender who has SOLD a put struck at the barrier — the coupon is interest plus the insurance premium, minus the bank's margin. Then the numbers: put value, risk-neutral probability of breach, fair coupon, margin on the issue, client's loss in the bad scenario, and the desk's delta-hedge. The candidate who can requalify a coupon as a sold option, price the gap and name the buyer of last resort of the risk has understood this module; the one who says "it's a scam" or "it's free money" has understood nothing.`,
      ]
      : [
        `Demain, 9 h, comité produit. Vous êtes le structureur junior et la term sheet que vous devez défendre est le pain quotidien de la banque — le petit frère à une observation des autocalls que le module 9 industrialisera : ${desc}. Le marketing a déjà choisi le nom : « Rendement Sérénité ».\n\nLa consigne de votre directeur est la plus vieille du métier : « un produit structuré se price en le démontant. » Ce soir, vous décomposez : le put que le client vend sans le lire, la probabilité risque-neutre que la barrière cède, le coupon que les paramètres paieraient honnêtement, la marge que la banque empoche sur l'écart, le relevé du client si l'indice casse — et la couverture du desk au premier jour, parce que la banque ne garde rien du risque de marché : elle fabrique, elle ne parie pas.`,
        `Le client a soixante et onze ans, a vendu son entreprise il y a deux ans, et lit lentement. Son conseiller d'agence lui a montré « un placement qui paie ${pct(cAffiche, 1)} quand le livret paie ${pct(r1(rTx - 1), 1)} » : ${desc}. Vous êtes le banquier privé à qui la famille a demandé un second avis, et le dossier de conformité exige la phrase que la brochure évite : d'où vient le rendement en plus ?\n\nVotre réponse doit tenir en nombres qu'un non-financier peut vérifier : la prime d'assurance cachée dans le coupon, la probabilité — telle que le marché la price — que la barrière casse, le coupon que le produit paierait si la banque ne gardait rien, la marge de la banque sur cette émission, et ce que son relevé affiche si l'indice finit ${pct(chuteSous, 1)} sous la barrière. Le verdict n'est pas « n'achetez jamais » ; c'est « sachez ce que vous vendez quand vous achetez ».`,
        `L'examinateur brandit une brochure grand public, lettres dorées sur bleu marine : « ${pct(cAffiche, 1)} garantis sauf si l'indice perd plus de ${f(100 - bPct, 0)} %. Où est le truc ? » Les données : ${desc}.\n\nIl attend la décomposition que le module 9 généralisera : le client est un prêteur qui a VENDU un put frappé à la barrière — le coupon, c'est l'intérêt plus la prime d'assurance, moins la marge de la banque. Puis les nombres : valeur du put, probabilité risque-neutre de cassure, coupon équitable, marge sur l'émission, perte du client dans le mauvais scénario, et le delta-hedge du desk. Le candidat qui sait requalifier un coupon en option vendue, pricer l'écart et nommer l'acheteur en dernier ressort du risque a compris ce module ; celui qui dit « c'est une arnaque » ou « c'est de l'argent gratuit » n'a rien compris.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The put the client signs without reading' : 'a) Le put que le client signe sans le lire',
          enonce: en
            ? `Per 100 of nominal, what is the strike-${f(bPct, 0)} put the note embeds worth (Black-Scholes)?`
            : `Pour 100 de nominal, que vaut le put de strike ${f(bPct, 0)} que la note embarque (Black-Scholes) ?`,
          reponse: repPut, tolerance: Math.max(0.15, repPut * 0.05), toleranceMode: 'absolu', unite: '€',
          etapes: [{
            titre: en ? 'Read the payoff, find the option' : 'Lisez le payoff, trouvez l\'option',
            contenu: en
              ? `Below ${f(bPct, 0)}, the client loses one for one what the index loses: that clause IS a short put struck at ${f(bPct, 0)} (module 9 will refine it into a down-and-in barrier put — the vanilla is the honest first-order approximation, and it slightly overstates the client's protection cost). BS value: **${mnt(repPut, '€')}** per 100. The client did not buy a savings product; he bought a bond AND SOLD this insurance — the coupon is how the premium reaches him.`
              : `Sous ${f(bPct, 0)}, le client perd un pour un ce que l'indice perd : cette clause EST un put vendu de strike ${f(bPct, 0)} (le module 9 le raffinera en put à barrière down-and-in — la vanille est l'approximation honnête au premier ordre, légèrement majorante). Valeur BS : **${f(repPut, 2)} €** pour 100. Le client n'a pas acheté un produit d'épargne ; il a acheté une obligation ET VENDU cette assurance — le coupon est le chemin par lequel la prime lui parvient.`,
          }],
          pieges: [en
            ? `"The barrier protects me" reverses the roles: the barrier is where the client's PROTECTION of others ends and his own losses begin — he is the insurer, not the insured.`
            : `« La barrière me protège » inverse les rôles : la barrière est l'endroit où la PROTECTION que le client vend aux autres s'arrête et où ses pertes commencent — il est l'assureur, pas l'assuré.`],
        },
        {
          intitule: en ? 'b) The odds, as the market prices them' : 'b) Les chances, telles que le marché les price',
          enonce: en
            ? `What is the risk-neutral probability that the index finishes BELOW the ${f(bPct, 0)} barrier, in % (N(−d₂))?`
            : `Quelle est la probabilité risque-neutre que l'indice finisse SOUS la barrière de ${f(bPct, 0)}, en % (N(−d₂)) ?`,
          reponse: repProba, tolerance: 1, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'One chance in — say it out loud' : 'Une chance sur — dites-le à voix haute',
            contenu: en
              ? `N(−d₂) = **${pct(repProba, 1)}** — about one issue in ${f(r0(100 / proba), 0)} ends with the client paying the claim (module 2's N(·), read on module 8's d₂). Two honesty notes for the committee: this is the RISK-NEUTRAL probability — the hedging-consistent one, not a forecast — and the brochure's "only if the index falls ${f(100 - bPct, 0)}%" describes an event the market considers perfectly ordinary over one year at ${pct(vol, 1)} vol.`
              : `N(−d₂) = **${pct(repProba, 1)}** — environ une émission sur ${f(r0(100 / proba), 0)} se termine avec le client qui paie le sinistre (le N(·) du module 2, lu sur le d₂ du module 8). Deux notes d'honnêteté pour le comité : c'est la probabilité RISQUE-NEUTRE — celle qui rend la couverture cohérente, pas une prévision — et le « seulement si l'indice perd ${f(100 - bPct, 0)} % » de la brochure décrit un événement que le marché juge parfaitement ordinaire sur un an à ${pct(vol, 1)} de vol.`,
          }],
        },
        {
          intitule: en ? 'c) The fair coupon' : 'c) Le coupon équitable',
          enonce: en
            ? `If the bank kept nothing, what coupon would exactly balance the note at 100 — c such that (100 + c)·e^{−rT} − put = 100 — in % (2 decimals)?`
            : `Si la banque ne gardait rien, quel coupon équilibrerait exactement la note à 100 — c tel que (100 + c)·e^{−rT} − put = 100 — en % (2 décimales) ?`,
          reponse: repFair, tolerance: 0.1, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Interest plus insurance premium' : "L'intérêt plus la prime d'assurance",
            contenu: en
              ? `c* = (100 + put)/e^{−rT} − 100 = (100 + ${f(repPut, 2)})/${f(r2(df * 100) / 100, 4)} − 100 = **${pct(repFair, 2)}** — decomposable as ≈ ${pct(r1((1 / df - 1) * 100), 1)} of pure interest plus ≈ ${pct(r2(putPer100 / df), 2)} of capitalised put premium. THAT is where the extra yield comes from: not from the bank's generosity, but from the insurance the client writes. Anything below c* is margin.`
              : `c* = (100 + put)/e^{−rT} − 100 = (100 + ${f(repPut, 2)})/${f(r2(df * 100) / 100, 4)} − 100 = **${pct(repFair, 2)}** — décomposable en ≈ ${pct(r1((1 / df - 1) * 100), 1)} d'intérêt pur plus ≈ ${pct(r2(putPer100 / df), 2)} de prime de put capitalisée. VOILÀ d'où vient le rendement en plus : pas de la générosité de la banque, mais de l'assurance que le client vend. Tout ce qui est sous c* est de la marge.`,
          }],
        },
        {
          intitule: en ? "d) The bank's margin on the issue" : "d) La marge de la banque sur l'émission",
          enonce: en
            ? `The note pays ${pct(cAffiche, 1)} instead of the fair ${pct(repFair, 2)}. On the €${f(notionnelM, 0)}m issue, what margin does the bank lock in at inception, in millions of euros?`
            : `La note paie ${pct(cAffiche, 1)} au lieu du ${pct(repFair, 2)} équitable. Sur l'émission de ${f(notionnelM, 0)} M€, quelle marge la banque verrouille-t-elle à l'initiation, en millions d'euros ?`,
          reponse: repMarge, tolerance: Math.max(0.1, repMarge * 0.06), toleranceMode: 'absolu', unite: 'M€',
          etapes: [{
            titre: en ? 'The gap, discounted, times the size' : "L'écart, actualisé, fois la taille",
            contenu: en
              ? `Margin per 100 = (${f(repFair, 2)} − ${f(cAffiche, 1)}) × e^{−rT} = ${f(r2(margePer100), 2)}; on the issue: **${mnt(repMarge, '€')}m**, locked at inception like the swap margin of module 7 — no market view involved. It pays the distribution network, the structuring desk, the hedging costs and the shareholder. Legitimate, even ordinary; what the committee (and the regulator) require is that it be KNOWABLE — which is exactly what your decomposition just made it.`
              : `Marge pour 100 = (${f(repFair, 2)} − ${f(cAffiche, 1)}) × e^{−rT} = ${f(r2(margePer100), 2)} ; sur l'émission : **${f(repMarge, 2)} M€**, verrouillés à l'initiation comme la marge du swap au module 7 — aucune vue de marché là-dedans. Elle paie le réseau de distribution, le desk de structuration, les coûts de couverture et l'actionnaire. Légitime, banale même ; ce que le comité (et le régulateur) exigent, c'est qu'elle soit CONNAISSABLE — exactement ce que votre décomposition vient de la rendre.`,
          }],
        },
        {
          intitule: en ? "e) The client's statement, bad scenario" : 'e) Le relevé du client, mauvais scénario',
          enonce: en
            ? `The index finishes at ${f(sT, 1)}, below the barrier. Per 100 invested, what is the client's net loss (loss on capital minus the coupon received), in €?`
            : `L'indice finit à ${f(sT, 1)}, sous la barrière. Pour 100 investis, quelle est la perte nette du client (perte en capital moins le coupon touché), en € ?`,
          reponse: repPerte, tolerance: 0.3, toleranceMode: 'absolu', unite: '€',
          etapes: [{
            titre: en ? 'The put exercises — against him' : "Le put s'exerce — contre lui",
            contenu: en
              ? `Below the barrier, the client bears exactly the sold put's payoff: max(K − S_T, 0) = ${f(bPct, 0)} − ${f(sT, 1)} = ${f(r2(payoffPut(sT, bPct)), 1)} per 100 of capital lost; net of the ${pct(cAffiche, 1)} coupon received, the statement reads **−${f(repPerte, 1)} €** per 100. The sold put stopped being an abstraction: it is a line on a retiree's statement. Same instrument as Niederhoffer's (previous problem) — smaller size, softer wrapper, identical asymmetry; and real autocalls, whose down-and-in put is usually struck at 100, bite HARDER than this simplified note once the barrier breaks (module 9).`
              : `Sous la barrière, le client porte exactement le payoff du put vendu : max(K − S_T, 0) = ${f(bPct, 0)} − ${f(sT, 1)} = ${f(r2(payoffPut(sT, bPct)), 1)} pour 100 de capital perdus ; net du coupon de ${pct(cAffiche, 1)} touché, le relevé affiche **−${f(repPerte, 1)} €** pour 100. Le put vendu a cessé d'être une abstraction : c'est une ligne sur le relevé d'un retraité. Le même instrument que chez Niederhoffer (problème précédent) — taille plus petite, emballage plus doux, asymétrie identique ; et les vrais autocalls, dont le put down-and-in est en général frappé à 100, mordent PLUS FORT que cette note simplifiée une fois la barrière cassée (module 9).`,
          }],
          pieges: [en
            ? `"I still got my ${pct(cAffiche, 1)} coupon, so I lost less than the index" is true and is precisely the anaesthetic: the coupon was the PRICE of the risk that just materialised, not a consolation prize on top.`
            : `« J'ai quand même touché mon coupon de ${pct(cAffiche, 1)}, donc j'ai perdu moins que l'indice » est vrai et c'est précisément l'anesthésiant : le coupon était le PRIX du risque qui vient de se matérialiser, pas un lot de consolation par-dessus.`],
        },
        {
          intitule: en ? "f) The desk's first-day hedge — and module 9" : 'f) La couverture du desk au premier jour — et le module 9',
          enonce: en
            ? `The bank is LONG the client's put and hedges its delta. What notional of index must the desk hold long against the €${f(notionnelM, 0)}m issue, in millions of euros?`
            : `La banque est LONGUE du put du client et couvre son delta. Quel notionnel d'indice le desk doit-il détenir à l'achat face à l'émission de ${f(notionnelM, 0)} M€, en millions d'euros ?`,
          reponse: repHedge, tolerance: Math.max(0.5, repHedge * 0.05), toleranceMode: 'absolu', unite: 'M€',
          etapes: [
            {
              titre: en ? 'The factory, not the casino' : "L'usine, pas le casino",
              contenu: en
                ? `Δ_put = ${f(r2(deltaP), 2)}: long the put, the desk carries a negative delta and neutralises it by BUYING |Δ| × ${f(notionnelM, 0)} = **${mnt(repHedge, '€', 1)}m** of index (futures, in practice — module 7's tool). It is also long vega and long gamma through the client's put: the structuring desk LIKES fear. From here, module 9: multiply the observations, make the call automatic ("autocall"), move the barrier to a down-and-in, and this one-page product becomes the autocall industry — same put, same client, same decomposition method.`
                : `Δ_put = ${f(r2(deltaP), 2)} : long du put, le desk porte un delta négatif et le neutralise en ACHETANT |Δ| × ${f(notionnelM, 0)} = **${f(repHedge, 1)} M€** d'indice (des futures, en pratique — l'outil du module 7). Il est aussi long vega et long gamma à travers le put du client : le desk de structuration AIME la peur. À partir d'ici, module 9 : multipliez les observations, rendez le rappel automatique (« autocall »), transformez la barrière en down-and-in, et ce produit d'une page devient l'industrie de l'autocall — même put, même client, même méthode de décomposition.`,
            },
            {
              titre: en ? 'The closing sentence of the module' : 'La phrase qui referme le module',
              contenu: en
                ? `Everything in this module converges here: payoffs to READ the product, parity and Black-Scholes to PRICE it, N(−d₂) to state its odds, the Greeks to HEDGE it, and chapter 7 to remember who ends up holding the risk. Taken one by one, options are desk tools; assembled, they are the bricks of everything banks sell to clients — say that sentence to the jury, then prove it with this decomposition.`
                : `Tout le module converge ici : les payoffs pour LIRE le produit, la parité et Black-Scholes pour le PRICER, N(−d₂) pour dire ses chances, les grecques pour le COUVRIR, et le chapitre 7 pour se rappeler qui finit par porter le risque. Prises une à une, les options sont des outils de desk ; assemblées, elles sont les briques de tout ce que les banques vendent à leurs clients — dites cette phrase au jury, puis prouvez-la avec cette décomposition.`,
            },
          ],
        },
      ],
    };
  },
};

export const problemesLot2: ProblemeMoule[] = [
  vendeurGamma, impliciteRealisee, lectureSmile, collarCoutZero,
  volmageddon, gammaSqueeze, octobre87, putsNus97,
  vegaLtcm, autocallDecompose,
];

