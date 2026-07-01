/**
 * Moules de problèmes multi-étapes du module Options & volatilité
 * — LOT 1 : les 10 moules N1/N2 (m8-pb-01 à m8-pb-10).
 * 4 N1 (premier call, put protecteur, lecture d'une chaîne d'options,
 * straddle de résultats) et 6 N2 (covered call, bull call spread, parité &
 * arbitrage, arbre binomial complet, chaîne Black-Scholes, book du vendeur).
 * Chaque moule : 3 scénarios FR + EN (habillages ET bornes de tirage
 * différents), sous-questions chaînées (la sortie de a) nourrit b), c)…),
 * corrigés calculés via calculs.ts — jamais de texte figé.
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
  actionsDeltaHedge, blackScholesCall, blackScholesPut, d1BlackScholes,
  d2BlackScholes, deltaCall, dfContinu, gammaOption, payoffCall, payoffPut,
  pnlOption, pointMortCall, pointsMortsStraddle, probaRisqueNeutre,
  putDepuisParite, valeurBinomiale, vegaOption,
} from './calculs';

/** Un « moule » de problème est un ProblemGenerator de l'engine (alias local). */
export type ProblemeMoule = ProblemGenerator;

const M8 = '08-options-volatilite';
const QUOTITE = 100; // actions par contrat — le standard listé depuis le CBOE de 1973 (ch1)
const r2 = (v: number) => Math.round(v * 100) / 100;
const r4 = (v: number) => Math.round(v * 10_000) / 10_000;

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
/* 1. m8-pb-01 — Première option : acheter un call — N1                */
/* ------------------------------------------------------------------ */
const premierCall: ProblemeMoule = {
  id: 'm8-pb-01', moduleId: M8,
  titre: 'Première option : un call de bout en bout',
  titreEn: 'A first option: one call, end to end',
  typeDeCas: 'mécanique du call',
  typeDeCasEn: 'call mechanics',
  difficulte: 1,
  scenarios: ['Le junior au desk options sur une pétrolière du CAC 40', 'La gérante et son call sur une tech américaine', "L'étudiant du jeu de bourse sur une biotech française"],
  scenariosEn: ['The junior on the options desk, CAC 40 oil major', 'The portfolio manager and her US tech call', 'The trading-game student on a French biotech'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : grille de strike, prime, contrats, amplitude des mouvements.
    const cfg = ([
      { sym: '€', kMin: 8, kMax: 12, kPas: 5, cMin: 1.5, cMax: 4, nMin: 2, nMax: 5, dMin: 3, dMax: 12 },
      { sym: '$', kMin: 10, kMax: 18, kPas: 10, cMin: 4, cMax: 12, nMin: 1, nMax: 3, dMin: 8, dMax: 30 },
      { sym: '€', kMin: 9, kMax: 15, kPas: 2, cMin: 0.8, cMax: 2.2, nMin: 5, nMax: 10, dMin: 1.5, dMax: 6 },
    ] as const)[sIdx];
    const K = randInt(rng, cfg.kMin, cfg.kMax) * cfg.kPas;
    const prime = randFloat(rng, cfg.cMin, cfg.cMax, 1);
    const n = randInt(rng, cfg.nMin, cfg.nMax);
    const s0 = r2(K + pick(rng, [1, -1] as const) * randFloat(rng, 0, cfg.dMin, 1));
    // Trois zones d'atterrissage : sous K (abandon), entre K et le point mort
    // (exercé mais perdant), au-delà du point mort (profit).
    const zone = pick(rng, [0, 1, 2] as const);
    const be = r2(pointMortCall(K, prime));
    const sT = zone === 0 ? r2(K - randFloat(rng, cfg.dMin, cfg.dMax, 1))
      : zone === 1 ? r2(K + randFloat(rng, 0.2, prime - 0.2, 1))
        : r2(be + randFloat(rng, cfg.dMin, cfg.dMax, 1));
    const primeTotale = r2(prime * QUOTITE * n);
    const payoff = r2(payoffCall(sT, K));
    const pnlTotal = r2(pnlOption(payoff, prime, 1) * QUOTITE * n);
    const exerce = sT > K;

    const { en, f, mnt } = outils(langue);
    const desc = en
      ? `the stock trades at ${mnt(s0, cfg.sym)}; the 3-month call of strike ${f(K, 0)} quotes ${mnt(prime, cfg.sym)} (contract size: ${f(QUOTITE, 0)} shares); you buy ${f(n, 0)} contract${n > 1 ? 's' : ''}, and at expiry the stock trades at ${mnt(sT, cfg.sym)}`
      : `l'action cote ${mnt(s0, cfg.sym)} ; le call 3 mois de strike ${f(K, 0)} se traite à ${mnt(prime, cfg.sym)} (quotité : ${f(QUOTITE, 0)} actions par contrat) ; vous achetez ${f(n, 0)} contrat${n > 1 ? 's' : ''}, et à l'échéance l'action cote ${mnt(sT, cfg.sym)}`;
    const contexte = (en
      ? [
        `First week on the options desk, on a CAC 40 oil major: ${desc}. Before the debrief, the senior trader wants the four numbers that tell the whole story: the cash actually paid, what the contract delivers at expiry, the P&L sign included, and the level the stock had to beat for the trade to make money.`,
        `A portfolio manager wants the upside of a US tech stock without its downside, and buys calls instead of shares: ${desc}. For her investment committee, she documents the premium paid, the payoff at expiry, the net result — and the break-even that separates a good story from a good trade.`,
        `Trading-game finale at the business school, on a mid-cap French biotech: ${desc}. The jury wants more than a screenshot: total premium, payoff, P&L — and the proof that you know where exercising starts and where winning starts.`,
      ]
      : [
        `Première semaine au desk options, sur une pétrolière du CAC 40 : ${desc}. Avant le débrief, le trader senior veut les quatre chiffres qui racontent tout : le cash réellement payé, ce que le contrat verse à l'échéance, le P&L signe compris, et le niveau que l'action devait battre pour que l'opération rapporte.`,
        `Une gérante veut la hausse d'une tech américaine sans sa baisse, et achète des calls plutôt que les titres : ${desc}. Pour son comité d'investissement, elle documente la prime payée, le payoff à l'échéance, le résultat net — et le point mort qui sépare une belle histoire d'un bon trade.`,
        `Finale du jeu de bourse de l'école, sur une biotech française de taille moyenne : ${desc}. Le jury veut mieux qu'une capture d'écran : prime totale, payoff, P&L — et la preuve que vous savez où commence l'exercice et où commence le gain.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The cash out the door' : 'a) Le cash qui sort',
          enonce: en
            ? `The call quotes ${mnt(prime, cfg.sym)} per share and you buy ${f(n, 0)} contract${n > 1 ? 's' : ''} of ${f(QUOTITE, 0)} shares each. How much premium do you pay in total, in ${cfg.sym}?`
            : `Le call cote ${mnt(prime, cfg.sym)} par action et vous achetez ${f(n, 0)} contrat${n > 1 ? 's' : ''} de ${f(QUOTITE, 0)} actions chacun. Quelle prime payez-vous au total, en ${cfg.sym} ?`,
          reponse: primeTotale, tolerance: 0.005, unite: cfg.sym,
          etapes: [{
            titre: en ? 'Premium × contract size × number of contracts' : 'Prime × quotité × nombre de contrats',
            contenu: en
              ? `Total premium = ${f(prime, 2)} × ${f(QUOTITE, 0)} × ${f(n, 0)} = **${mnt(primeTotale, cfg.sym)}**. A listed option always trades by blocks of ${f(QUOTITE, 0)} shares: a premium quoted ${f(prime, 2)} costs ${mnt(r2(prime * QUOTITE), cfg.sym)} per contract. This cash leaves your account today — and it is the MOST you can ever lose on the position.`
              : `Prime totale = ${f(prime, 2)} × ${f(QUOTITE, 0)} × ${f(n, 0)} = **${mnt(primeTotale, cfg.sym)}**. Une option listée se traite toujours par blocs de ${f(QUOTITE, 0)} actions : une prime cotée ${f(prime, 2)} se paie ${mnt(r2(prime * QUOTITE), cfg.sym)} par contrat. Ce cash sort du compte aujourd'hui — et c'est le MAXIMUM que la position pourra jamais vous coûter.`,
          }],
          pieges: [en
            ? `Reading the quoted premium as the price of the position forgets the contract size: the screen says ${f(prime, 2)}, the broker debits ${mnt(primeTotale, cfg.sym)}.`
            : `Lire la prime cotée comme le prix de la position oublie la quotité : l'écran dit ${f(prime, 2)}, le courtier débite ${mnt(primeTotale, cfg.sym)}.`],
        },
        {
          intitule: en ? 'b) The payoff at expiry' : "b) Le payoff à l'échéance",
          enonce: en
            ? `At expiry the stock trades at ${mnt(sT, cfg.sym)}. What does ONE call pay, per share, in ${cfg.sym}?`
            : `À l'échéance, l'action cote ${mnt(sT, cfg.sym)}. Que verse UN call, par action, en ${cfg.sym} ?`,
          reponse: payoff, tolerance: 0.01, toleranceMode: 'absolu', unite: cfg.sym,
          etapes: [{
            titre: en ? 'max(S_T − K, 0): a right is exercised or abandoned' : "max(S_T − K, 0) : un droit s'exerce ou s'abandonne",
            contenu: en
              ? `Payoff = $\\max(S_T - K,\\ 0)$ = max(${f(sT, 2)} − ${f(K, 0)}, 0) = **${mnt(payoff, cfg.sym)}**. ${exerce ? `The stock finishes above the strike: you exercise — buying at ${f(K, 0)} what is worth ${f(sT, 2)} pockets the difference.` : `Nobody buys at ${f(K, 0)} what the market sells for ${f(sT, 2)}: the right dies, payoff zero — not a loss of ${f(r2(K - sT), 2)}. That floor at zero is exactly what the premium bought.`}`
              : `Payoff = $\\max(S_T - K,\\ 0)$ = max(${f(sT, 2)} − ${f(K, 0)}, 0) = **${mnt(payoff, cfg.sym)}**. ${exerce ? `L'action finit au-dessus du strike : vous exercez — acheter à ${f(K, 0)} ce qui en vaut ${f(sT, 2)} empoche la différence.` : `Personne n'achète à ${f(K, 0)} ce que le marché vend ${f(sT, 2)} : le droit meurt, payoff nul — pas une perte de ${f(r2(K - sT), 2)}. Ce plancher à zéro est exactement ce que la prime a acheté.`}`,
          }],
        },
        {
          intitule: en ? 'c) The P&L of the position' : 'c) Le P&L de la position',
          enonce: en
            ? `Netting the premium paid in a), what is the total P&L of your ${f(n, 0)} contract${n > 1 ? 's' : ''}, sign included, in ${cfg.sym}?`
            : `En retranchant la prime payée en a), quel est le P&L total de vos ${f(n, 0)} contrat${n > 1 ? 's' : ''}, signe compris, en ${cfg.sym} ?`,
          reponse: pnlTotal, tolerance: Math.max(1, Math.abs(pnlTotal) * 0.01), toleranceMode: 'absolu', unite: cfg.sym,
          etapes: [
            {
              titre: en ? 'P&L = payoff − premium, then the block size' : 'P&L = payoff − prime, puis la taille du bloc',
              contenu: en
                ? `Per share: ${f(payoff, 2)} − ${f(prime, 2)} = ${f(r2(payoff - prime), 2)} ; times ${f(QUOTITE, 0)} × ${f(n, 0)} = **${mnt(pnlTotal, cfg.sym)}**. ${zone === 1 ? `In the money, exercised — and yet LOSING: recovering ${f(payoff, 2)} beats nothing, but does not pay back the ${f(prime, 2)} premium.` : zone === 0 ? `The loss is the whole premium — and nothing more: the buyer's loss is capped, known, paid up front.` : `Above the break-even, every extra point of stock is a point of profit, on a stake of only ${mnt(primeTotale, cfg.sym)}.`}`
                : `Par action : ${f(payoff, 2)} − ${f(prime, 2)} = ${f(r2(payoff - prime), 2)} ; fois ${f(QUOTITE, 0)} × ${f(n, 0)} = **${mnt(pnlTotal, cfg.sym)}**. ${zone === 1 ? `Dans la monnaie, exercé — et pourtant PERDANT : récupérer ${f(payoff, 2)} vaut mieux que rien, mais ne rembourse pas les ${f(prime, 2)} de prime.` : zone === 0 ? `La perte est la prime entière — et rien de plus : la perte de l'acheteur est plafonnée, connue, payée d'avance.` : `Au-delà du point mort, chaque point d'action supplémentaire est un point de profit, pour une mise de seulement ${mnt(primeTotale, cfg.sym)}.`}`,
            },
            {
              titre: en ? 'The asymmetry, seen from the other side' : "L'asymétrie, vue d'en face",
              contenu: en
                ? `The seller of your calls booked the exact mirror: ${mnt(r2(-pnlTotal), cfg.sym)}. He can never make more than the ${mnt(primeTotale, cfg.sym)} of premium — and can lose much more: selling an option is selling insurance (chapter 1).`
                : `Le vendeur de vos calls a enregistré le miroir exact : ${mnt(r2(-pnlTotal), cfg.sym)}. Il ne pourra jamais gagner plus que les ${mnt(primeTotale, cfg.sym)} de prime — et peut perdre bien davantage : vendre une option, c'est vendre de l'assurance (chapitre 1).`,
            },
          ],
          pieges: [en
            ? `"It finished in the money, so I made money" confuses payoff and P&L: between the strike and the break-even, you exercise to REDUCE the loss, not to win.`
            : `« Ça a fini dans la monnaie, donc j'ai gagné » confond payoff et P&L : entre le strike et le point mort, on exerce pour RÉDUIRE la perte, pas pour gagner.`],
        },
        {
          intitule: en ? 'd) The break-even' : 'd) Le point mort',
          enonce: en
            ? `At what stock price at expiry does the position make exactly zero, in ${cfg.sym}?`
            : `À quel cours de l'action à l'échéance la position fait-elle exactement zéro, en ${cfg.sym} ?`,
          reponse: be, tolerance: 0.005, unite: cfg.sym,
          etapes: [{
            titre: en ? 'Strike PLUS premium — three zones, not two' : 'Strike PLUS prime — trois zones, pas deux',
            contenu: en
              ? `Break-even = K + premium = ${f(K, 0)} + ${f(prime, 2)} = **${mnt(be, cfg.sym)}**. The stock must rise BEYOND the strike to pay the premium back. Three zones to recite: below ${f(K, 0)}, the whole premium is lost; between ${f(K, 0)} and ${f(be, 2)}, exercised but still losing; beyond ${f(be, 2)} only, profit begins. Here the stock finished at ${f(sT, 2)} — zone ${zone === 0 ? '1' : zone === 1 ? '2' : '3'}, which is the whole verdict of c).`
              : `Point mort = K + prime = ${f(K, 0)} + ${f(prime, 2)} = **${mnt(be, cfg.sym)}**. L'action doit monter AU-DELÀ du strike pour rembourser la prime. Trois zones à réciter : sous ${f(K, 0)}, la prime entière est perdue ; entre ${f(K, 0)} et ${f(be, 2)}, exercé mais toujours perdant ; au-delà de ${f(be, 2)} seulement, le profit commence. Ici l'action a fini à ${f(sT, 2)} — zone ${zone === 0 ? '1' : zone === 1 ? '2' : '3'}, ce qui résume tout le verdict du c).`,
          }],
          pieges: [en
            ? `Placing the break-even at the strike is the most common mistake on P&L diagrams: the kink is at ${f(K, 0)}, the zero is at ${f(be, 2)} — the premium separates them.`
            : `Mettre le point mort au strike est l'erreur la plus fréquente sur les diagrammes de P&L : le coude est à ${f(K, 0)}, le zéro est à ${f(be, 2)} — la prime les sépare.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 2. m8-pb-02 — Le put protecteur : assurer un portefeuille — N1      */
/* ------------------------------------------------------------------ */
const putProtecteur: ProblemeMoule = {
  id: 'm8-pb-02', moduleId: M8,
  titre: "Le put protecteur : l'assurance du portefeuille",
  titreEn: 'The protective put: portfolio insurance',
  typeDeCas: 'couverture optionnelle',
  typeDeCasEn: 'option hedging',
  difficulte: 1,
  scenarios: ['La gérante de patrimoine avant un automne incertain', 'Le family office américain et sa ligne historique', "L'étudiant qui protège son premier portefeuille"],
  scenariosEn: ['The wealth manager before an uncertain autumn', 'The US family office and its legacy position', 'The student insuring his first portfolio'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : cours, grille de strike (décote = franchise), prime, taille, chocs.
    const cfg = ([
      { sym: '€', sMin: 16, sMax: 24, pas: 5, decMax: 2, cMin: 2, cMax: 5, nMin: 3, nMax: 8, crMin: 8, crMax: 25, upMin: 8, upMax: 25 },
      { sym: '$', sMin: 15, sMax: 25, pas: 10, decMax: 1, cMin: 5, cMax: 12, nMin: 2, nMax: 5, crMin: 20, crMax: 50, upMin: 15, upMax: 45 },
      { sym: '€', sMin: 18, sMax: 35, pas: 1, decMax: 2, cMin: 0.8, cMax: 2.5, nMin: 1, nMax: 3, crMin: 3, crMax: 8, upMin: 2.5, upMax: 7 },
    ] as const)[sIdx];
    const s0 = randInt(rng, cfg.sMin, cfg.sMax) * cfg.pas;
    const dec = randInt(rng, 0, cfg.decMax);          // décote du strike, en pas de grille
    const K = s0 - dec * cfg.pas;
    const p = randFloat(rng, cfg.cMin, cfg.cMax, 1);
    const n = randInt(rng, cfg.nMin, cfg.nMax);
    const nbActions = n * QUOTITE;
    const sCrash = r2(K - randFloat(rng, cfg.crMin, cfg.crMax, 1));
    const sUp = r2(s0 + randFloat(rng, cfg.upMin, cfg.upMax, 1));
    const coutAssurance = r2(p * QUOTITE * n);
    const plancher = r2(K - p);
    const pnlCrash = r2(((sCrash - s0) + pnlOption(payoffPut(sCrash, K), p, 1)) * nbActions);
    const pnlCrashNu = r2((sCrash - s0) * nbActions);
    const evite = r2(pnlCrash - pnlCrashNu);
    const pnlUp = r2(((sUp - s0) - p) * nbActions);
    const atm = dec === 0;

    const { en, f, mnt } = outils(langue);
    const desc = en
      ? `the portfolio holds ${f(nbActions, 0)} shares trading at ${mnt(s0, cfg.sym)}; the put of strike ${f(K, 0)}${atm ? ' (at the money)' : ''} quotes ${mnt(p, cfg.sym)} per share, and you buy ${f(n, 0)} contract${n > 1 ? 's' : ''} of ${f(QUOTITE, 0)} shares to cover the whole line`
      : `le portefeuille détient ${f(nbActions, 0)} actions cotant ${mnt(s0, cfg.sym)} ; le put de strike ${f(K, 0)}${atm ? ' (à la monnaie)' : ''} se traite à ${mnt(p, cfg.sym)} par action, et vous achetez ${f(n, 0)} contrat${n > 1 ? 's' : ''} de ${f(QUOTITE, 0)} actions pour couvrir toute la ligne`;
    const contexte = (en
      ? [
        `A wealth manager refuses to sell a client's favourite stock but cannot stomach another autumn like the last one: ${desc}. Before signing the ticket she lays out the cost of the insurance, the guaranteed floor, and the P&L in the two scenarios that matter — the crash and the rally.`,
        `A US family office holds a legacy position it is forbidden to sell, and earnings season looks stormy: ${desc}. The investment memo must show what the protection costs, what it guarantees, and what the books would show after a crash to ${f(sCrash, 2)} — versus a rally to ${f(sUp, 2)}.`,
        `A student finally owns a real portfolio and discovers anxiety: ${desc}. Before paying for protection, he wants the four numbers: the premium bill, the worst case once insured, and the result if the market collapses — or if it rallies and the insurance dies unused.`,
      ]
      : [
        `Une gérante de patrimoine refuse de vendre la valeur fétiche de sa cliente mais ne supportera pas un autre automne comme le dernier : ${desc}. Avant de signer le ticket, elle pose le coût de l'assurance, le plancher garanti, et le P&L dans les deux scénarios qui comptent — le krach et le rallye.`,
        `Un family office américain détient une ligne historique qu'il lui est interdit de vendre, et la saison des résultats s'annonce orageuse : ${desc}. La note d'investissement doit montrer ce que coûte la protection, ce qu'elle garantit, et ce que diraient les comptes après un krach à ${f(sCrash, 2)} — contre un rallye à ${f(sUp, 2)}.`,
        `Un étudiant possède enfin un vrai portefeuille et découvre l'anxiété : ${desc}. Avant de payer la protection, il veut les quatre chiffres : la facture de prime, le pire cas une fois assuré, et le résultat si le marché s'effondre — ou s'il monte et que l'assurance meurt sans servir.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The insurance bill' : "a) La facture d'assurance",
          enonce: en
            ? `What does the protection cost in total — ${f(n, 0)} contract${n > 1 ? 's' : ''} at ${mnt(p, cfg.sym)} per share — in ${cfg.sym}?`
            : `Combien coûte la protection au total — ${f(n, 0)} contrat${n > 1 ? 's' : ''} à ${mnt(p, cfg.sym)} par action — en ${cfg.sym} ?`,
          reponse: coutAssurance, tolerance: 0.005, unite: cfg.sym,
          etapes: [{
            titre: en ? 'Premium × contract size × contracts' : 'Prime × quotité × contrats',
            contenu: en
              ? `Cost = ${f(p, 2)} × ${f(QUOTITE, 0)} × ${f(n, 0)} = **${mnt(coutAssurance, cfg.sym)}** — ${f(r2((p / s0) * 100), 1)}% of the ${mnt(r2(s0 * nbActions), cfg.sym)} portfolio. That is the insurance PREMIUM, in the literal sense: paid up front, kept by the insurer whatever happens, like a fire policy on a house that does not burn.`
              : `Coût = ${f(p, 2)} × ${f(QUOTITE, 0)} × ${f(n, 0)} = **${mnt(coutAssurance, cfg.sym)}** — soit ${f(r2((p / s0) * 100), 1)} % du portefeuille de ${mnt(r2(s0 * nbActions), cfg.sym)}. C'est la COTISATION d'assurance, au sens propre : payée d'avance, conservée par l'assureur quoi qu'il arrive, comme la police incendie d'une maison qui ne brûle pas.`,
          }],
        },
        {
          intitule: en ? 'b) The guaranteed floor' : 'b) Le plancher garanti',
          enonce: en
            ? `Whatever happens at expiry, below what net value per share can the position not fall, in ${cfg.sym}?`
            : `Quoi qu'il arrive à l'échéance, sous quelle valeur nette par action la position ne peut-elle pas tomber, en ${cfg.sym} ?`,
          reponse: plancher, tolerance: 0.005, unite: cfg.sym,
          etapes: [
            {
              titre: en ? 'Strike minus premium' : 'Strike moins prime',
              contenu: en
                ? `Below ${f(K, 0)}, every euro lost by the share is paid back by the put, one for one: the pair "share + put" is worth exactly ${f(K, 0)} at expiry. Net of the premium: ${f(K, 0)} − ${f(p, 2)} = **${mnt(plancher, cfg.sym)}** per share, i.e. ${mnt(r2(plancher * nbActions), cfg.sym)} for the whole line. A floor, whatever the disaster.`
                : `Sous ${f(K, 0)}, chaque euro perdu par l'action est rendu par le put, un pour un : le couple « action + put » vaut exactement ${f(K, 0)} à l'échéance. Net de la prime : ${f(K, 0)} − ${f(p, 2)} = **${mnt(plancher, cfg.sym)}** par action, soit ${mnt(r2(plancher * nbActions), cfg.sym)} pour toute la ligne. Un plancher, quel que soit le désastre.`,
            },
            {
              titre: en ? 'The strike is the deductible' : 'Le strike est la franchise',
              contenu: en
                ? `${atm ? `Strike at the money: the insurance starts paying from the first euro of decline — the most expensive version of the policy.` : `Between ${f(s0, 0)} and ${f(K, 0)}, the first ${f(r2(s0 - K), 0)} of decline stay with you: that is the DEDUCTIBLE. A lower strike means a cheaper put and a larger deductible — exactly the trade-off of any insurance contract (chapter 2).`}`
                : `${atm ? `Strike à la monnaie : l'assurance paie dès le premier euro de baisse — la version la plus chère de la police.` : `Entre ${f(s0, 0)} et ${f(K, 0)}, les premiers ${f(r2(s0 - K), 0)} de baisse restent pour vous : c'est la FRANCHISE. Un strike plus bas, c'est un put moins cher et une franchise plus grande — exactement l'arbitrage de tout contrat d'assurance (chapitre 2).`}`,
            },
          ],
        },
        {
          intitule: en ? `c) The crash: the stock falls to ${f(sCrash, 2)}` : `c) Le krach : l'action tombe à ${f(sCrash, 2)}`,
          enonce: en
            ? `At expiry the stock has collapsed to ${mnt(sCrash, cfg.sym)}. What is the total P&L of the insured position (shares + puts − premium), sign included, in ${cfg.sym}?`
            : `À l'échéance, l'action s'est effondrée à ${mnt(sCrash, cfg.sym)}. Quel est le P&L total de la position assurée (actions + puts − prime), signe compris, en ${cfg.sym} ?`,
          reponse: pnlCrash, tolerance: Math.max(1, Math.abs(pnlCrash) * 0.01), toleranceMode: 'absolu', unite: cfg.sym,
          etapes: [
            {
              titre: en ? 'Two legs, one floor' : 'Deux jambes, un plancher',
              contenu: en
                ? `Shares: ${f(sCrash, 2)} − ${f(s0, 0)} = ${f(r2(sCrash - s0), 2)} per share. Puts: payoff $\\max(K - S_T,\\ 0)$ = ${f(r2(payoffPut(sCrash, K)), 2)}, minus the ${f(p, 2)} premium. Net per share: ${f(r2(plancher - s0), 2)} — the floor of b) minus the entry price. Total: × ${f(nbActions, 0)} shares = **${mnt(pnlCrash, cfg.sym)}**.`
                : `Actions : ${f(sCrash, 2)} − ${f(s0, 0)} = ${f(r2(sCrash - s0), 2)} par action. Puts : payoff $\\max(K - S_T,\\ 0)$ = ${f(r2(payoffPut(sCrash, K)), 2)}, moins les ${f(p, 2)} de prime. Net par action : ${f(r2(plancher - s0), 2)} — le plancher du b) moins le prix d'entrée. Total : × ${f(nbActions, 0)} actions = **${mnt(pnlCrash, cfg.sym)}**.`,
            },
            {
              titre: en ? 'What the insurance avoided' : "Ce que l'assurance a évité",
              contenu: en
                ? `Uninsured, the line would show (${f(sCrash, 2)} − ${f(s0, 0)}) × ${f(nbActions, 0)} = ${mnt(pnlCrashNu, cfg.sym)}. The puts avoided **${mnt(evite, cfg.sym)}** of losses — that is the claim payment, and the deeper the crash, the bigger it gets, while your loss stays frozen at the floor.`
                : `Sans assurance, la ligne afficherait (${f(sCrash, 2)} − ${f(s0, 0)}) × ${f(nbActions, 0)} = ${mnt(pnlCrashNu, cfg.sym)}. Les puts ont évité **${mnt(evite, cfg.sym)}** de pertes — c'est le remboursement du sinistre, et plus le krach est profond, plus il grossit, pendant que votre perte reste figée au plancher.`,
            },
          ],
          pieges: [en
            ? `Counting the put's payoff without subtracting its premium overstates the rescue: the insurance pays the claim, but the premium was paid whatever happened.`
            : `Compter le payoff du put sans retrancher sa prime surestime le sauvetage : l'assurance paie le sinistre, mais la cotisation a été versée quoi qu'il arrive.`],
        },
        {
          intitule: en ? `d) The rally: the stock rises to ${f(sUp, 2)}` : `d) Le rallye : l'action monte à ${f(sUp, 2)}`,
          enonce: en
            ? `Same position, but the stock finishes at ${mnt(sUp, cfg.sym)}. What is the total P&L, sign included, in ${cfg.sym}?`
            : `Même position, mais l'action finit à ${mnt(sUp, cfg.sym)}. Quel est le P&L total, signe compris, en ${cfg.sym} ?`,
          reponse: pnlUp, tolerance: Math.max(1, Math.abs(pnlUp) * 0.01), toleranceMode: 'absolu', unite: cfg.sym,
          etapes: [{
            titre: en ? 'The upside stays yours — minus the premium' : 'La hausse reste à vous — moins la cotisation',
            contenu: en
              ? `The put dies out of the money: payoff zero, the premium is gone. P&L = (${f(sUp, 2)} − ${f(s0, 0)} − ${f(p, 2)}) × ${f(nbActions, 0)} = **${mnt(pnlUp, cfg.sym)}**. Compare with the futures hedge of module 7, which would have locked EVERYTHING, gains included: the option protects the downside and leaves the upside — that asymmetry is precisely what the ${mnt(coutAssurance, cfg.sym)} premium bought.`
              : `Le put meurt hors de la monnaie : payoff nul, la prime est perdue. P&L = (${f(sUp, 2)} − ${f(s0, 0)} − ${f(p, 2)}) × ${f(nbActions, 0)} = **${mnt(pnlUp, cfg.sym)}**. Comparez avec la couverture futures du module 7, qui aurait TOUT verrouillé, gains compris : l'option protège la baisse et laisse la hausse — cette asymétrie est précisément ce que la prime de ${mnt(coutAssurance, cfg.sym)} a acheté.`,
          }],
          pieges: [en
            ? `"The insurance was useless, it was a bad trade" misreads the product: the put was not a bet on a crash, it was the right to sleep — permanent protection, rolled put after put, is what durably eats performance (chapter 2).`
            : `« L'assurance n'a pas servi, c'était un mauvais trade » lit mal le produit : le put n'était pas un pari sur le krach, c'était le droit de dormir — c'est l'assurance permanente, roulée put après put, qui ampute durablement la performance (chapitre 2).`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 3. m8-pb-03 — Lire une chaîne d'options : intrinsèque et temps — N1 */
/* ------------------------------------------------------------------ */
const lectureChaine: ProblemeMoule = {
  id: 'm8-pb-03', moduleId: M8,
  titre: "Lire une chaîne d'options : intrinsèque contre valeur temps",
  titreEn: 'Reading an option chain: intrinsic versus time value',
  typeDeCas: "lecture de chaîne d'options",
  typeDeCasEn: 'option chain reading',
  difficulte: 1,
  scenarios: ['Le stagiaire devant sa première chaîne (valeur du CAC 40)', "L'analyste qui vérifie la chaîne d'une tech du Nasdaq", 'La candidate au jeu de bourse et sa chaîne de mid-cap'],
  scenariosEn: ['The intern and his first chain (CAC 40 stock)', 'The analyst checking a Nasdaq tech chain', 'The trading-game candidate and her mid-cap chain'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : pas de la grille de strikes, valeurs temps petites/grandes.
    const cfg = ([
      { sym: '€', kMin: 10, kMax: 18, pas: 5, tvsMin: 0.3, tvsMax: 0.9, tvbMin: 1.4, tvbMax: 2.6 },
      { sym: '$', kMin: 12, kMax: 30, pas: 10, tvsMin: 0.8, tvsMax: 2.2, tvbMin: 3.5, tvbMax: 6.5 },
      { sym: '€', kMin: 12, kMax: 25, pas: 2, tvsMin: 0.15, tvsMax: 0.4, tvbMin: 0.6, tvbMax: 1.1 },
    ] as const)[sIdx];
    const kMid = randInt(rng, cfg.kMin, cfg.kMax) * cfg.pas;
    const k1 = kMid - cfg.pas;                       // call ITM
    const k3 = kMid + cfg.pas;                       // put ITM
    const s0 = r2(kMid + pick(rng, [1, -1] as const) * randFloat(rng, 0.1, 0.4, 2) * cfg.pas);
    // Primes fabriquées comme intrinsèque + valeur temps (la valeur temps culmine ATM).
    const tv1 = randFloat(rng, cfg.tvsMin, cfg.tvsMax, 2);
    const tv2 = randFloat(rng, cfg.tvbMin, cfg.tvbMax, 2);
    const tvP3 = randFloat(rng, cfg.tvsMin, cfg.tvsMax, 2);
    const int1 = r2(payoffCall(s0, k1));             // intrinsèque du call K1
    const int2 = r2(payoffCall(s0, kMid));           // intrinsèque (éventuelle) du call ATM
    const intP3 = r2(payoffPut(s0, k3));             // intrinsèque du put K3
    const c1 = r2(int1 + tv1);
    const c2 = r2(int2 + tv2);
    const p3 = r2(intP3 + tvP3);
    const tvC1 = r2(c1 - int1);
    const tvPut3 = r2(p3 - intP3);
    const be2 = r2(pointMortCall(kMid, c2));

    const { en, f, mnt } = outils(langue);
    const desc = en
      ? `the stock trades at ${mnt(s0, cfg.sym)}; the 2-month chain shows, for the calls, ${f(k1, 0)} → ${mnt(c1, cfg.sym)} and ${f(kMid, 0)} → ${mnt(c2, cfg.sym)}, and for the puts, ${f(k3, 0)} → ${mnt(p3, cfg.sym)}`
      : `l'action cote ${mnt(s0, cfg.sym)} ; la chaîne 2 mois affiche, côté calls, ${f(k1, 0)} → ${mnt(c1, cfg.sym)} et ${f(kMid, 0)} → ${mnt(c2, cfg.sym)}, et côté puts, ${f(k3, 0)} → ${mnt(p3, cfg.sym)}`;
    const contexte = (en
      ? [
        `First morning on the desk, the screen shows an option chain on a CAC 40 stock and the intern must prove he can read it: ${desc}. The senior asks him to split each premium into its two ingredients — what the option is worth if exercised RIGHT NOW, and what the market pays for the time left — then to place the break-even of the at-the-money call.`,
        `An equity analyst cross-checks a Nasdaq tech chain before publishing a note: ${desc}. Her editor wants the decomposition that never lies: intrinsic value, time value, and the level the stock must reach for the at-the-money call buyer to actually make money.`,
        `Trading-game semi-final, and the candidate gets a mid-cap chain to dissect: ${desc}. The jury's grid is explicit: intrinsic value of the in-the-money call, its time value, the same surgery on the in-the-money put — and the break-even of the at-the-money call.`,
      ]
      : [
        `Premier matin au desk, l'écran affiche une chaîne d'options sur une valeur du CAC 40 et le stagiaire doit prouver qu'il sait la lire : ${desc}. Le senior lui demande de découper chaque prime en ses deux ingrédients — ce que l'option vaudrait exercée TOUT DE SUITE, et ce que le marché paie pour le temps restant — puis de placer le point mort du call à la monnaie.`,
        `Une analyste actions recoupe la chaîne d'une tech du Nasdaq avant de publier une note : ${desc}. Son rédacteur en chef veut la décomposition qui ne ment jamais : valeur intrinsèque, valeur temps, et le niveau que l'action doit atteindre pour que l'acheteur du call à la monnaie gagne vraiment de l'argent.`,
        `Demi-finale du jeu de bourse, et la candidate reçoit une chaîne de mid-cap à disséquer : ${desc}. La grille du jury est explicite : valeur intrinsèque du call dans la monnaie, sa valeur temps, la même chirurgie sur le put dans la monnaie — et le point mort du call à la monnaie.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? `a) Intrinsic value of the ${f(k1, 0)} call` : `a) La valeur intrinsèque du call ${f(k1, 0)}`,
          enonce: en
            ? `The stock trades at ${mnt(s0, cfg.sym)}. What is the intrinsic value of the ${f(k1, 0)} call, per share, in ${cfg.sym}?`
            : `L'action cote ${mnt(s0, cfg.sym)}. Quelle est la valeur intrinsèque du call ${f(k1, 0)}, par action, en ${cfg.sym} ?`,
          reponse: int1, tolerance: 0.01, toleranceMode: 'absolu', unite: cfg.sym,
          etapes: [{
            titre: en ? 'What exercising right now would pocket' : 'Ce que rapporterait un exercice immédiat',
            contenu: en
              ? `Intrinsic value = $\\max(S - K,\\ 0)$ = max(${f(s0, 2)} − ${f(k1, 0)}, 0) = **${mnt(int1, cfg.sym)}**. It is the payoff formula applied TODAY, at the current spot: the ${f(k1, 0)} call is in the money, so it already "contains" ${f(int1, 2)} of certain value. An intrinsic value can never be negative — an option is a right, never a burden (chapter 1).`
              : `Valeur intrinsèque = $\\max(S - K,\\ 0)$ = max(${f(s0, 2)} − ${f(k1, 0)}, 0) = **${mnt(int1, cfg.sym)}**. C'est la formule du payoff appliquée AUJOURD'HUI, au spot courant : le call ${f(k1, 0)} est dans la monnaie, il « contient » déjà ${f(int1, 2)} de valeur certaine. Une valeur intrinsèque n'est jamais négative — une option est un droit, jamais une charge (chapitre 1).`,
          }],
          pieges: [en
            ? `Confusing intrinsic value with the premium: the screen quotes ${f(c1, 2)}, but only ${f(int1, 2)} of it is "already there" — the rest is a bet on the remaining two months.`
            : `Confondre valeur intrinsèque et prime : l'écran cote ${f(c1, 2)}, mais seuls ${f(int1, 2)} sont « déjà là » — le reste est un pari sur les deux mois restants.`],
        },
        {
          intitule: en ? 'b) Its time value' : 'b) Sa valeur temps',
          enonce: en
            ? `The ${f(k1, 0)} call quotes ${mnt(c1, cfg.sym)}. Using a), what is its time value, per share, in ${cfg.sym}?`
            : `Le call ${f(k1, 0)} cote ${mnt(c1, cfg.sym)}. À partir du a), quelle est sa valeur temps, par action, en ${cfg.sym} ?`,
          reponse: tvC1, tolerance: 0.01, toleranceMode: 'absolu', unite: cfg.sym,
          etapes: [
            {
              titre: en ? 'Premium = intrinsic + time value' : 'Prime = intrinsèque + valeur temps',
              contenu: en
                ? `Time value = premium − intrinsic = ${f(c1, 2)} − ${f(int1, 2)} = **${mnt(tvC1, cfg.sym)}**. That is the price of hope: two months during which the stock can still climb, while the downside stays floored at zero. It erodes day after day and dies at expiry — at maturity, an option is worth exactly its intrinsic value.`
                : `Valeur temps = prime − intrinsèque = ${f(c1, 2)} − ${f(int1, 2)} = **${mnt(tvC1, cfg.sym)}**. C'est le prix de l'espoir : deux mois pendant lesquels l'action peut encore monter, pendant que la baisse reste plafonnée à zéro. Elle s'érode jour après jour et meurt à l'échéance — à maturité, une option vaut exactement son intrinsèque.`,
            },
            {
              titre: en ? 'Why the ATM call carries MORE time value' : "Pourquoi le call ATM porte PLUS de valeur temps",
              contenu: en
                ? `Compare with the ${f(kMid, 0)} call: intrinsic ${f(int2, 2)}, time value ${f(r2(c2 - int2), 2)} — larger than the ${f(tvC1, 2)} of the ${f(k1, 0)}. Time value peaks AT the money: that is where the uncertainty about finishing in or out is greatest, so where the optionality is worth the most (chapter 2).`
                : `Comparez avec le call ${f(kMid, 0)} : intrinsèque ${f(int2, 2)}, valeur temps ${f(r2(c2 - int2), 2)} — plus grosse que les ${f(tvC1, 2)} du ${f(k1, 0)}. La valeur temps culmine À la monnaie : c'est là que l'incertitude entre finir dedans ou dehors est maximale, donc là que l'optionalité vaut le plus cher (chapitre 2).`,
            },
          ],
        },
        {
          intitule: en ? `c) Same surgery on the ${f(k3, 0)} put` : `c) Même chirurgie sur le put ${f(k3, 0)}`,
          enonce: en
            ? `The ${f(k3, 0)} put quotes ${mnt(p3, cfg.sym)}. What is ITS time value, per share, in ${cfg.sym}?`
            : `Le put ${f(k3, 0)} cote ${mnt(p3, cfg.sym)}. Quelle est SA valeur temps, par action, en ${cfg.sym} ?`,
          reponse: tvPut3, tolerance: 0.01, toleranceMode: 'absolu', unite: cfg.sym,
          etapes: [{
            titre: en ? 'The put mirror: max(K − S, 0) first' : "Le miroir put : max(K − S, 0) d'abord",
            contenu: en
              ? `Intrinsic = $\\max(K - S,\\ 0)$ = max(${f(k3, 0)} − ${f(s0, 2)}, 0) = ${f(intP3, 2)} — this put is in the money since the stock trades BELOW its strike. Time value = ${f(p3, 2)} − ${f(intP3, 2)} = **${mnt(tvPut3, cfg.sym)}**. Same decomposition, mirrored moneyness: a put is in the money when the stock is low, a call when it is high.`
              : `Intrinsèque = $\\max(K - S,\\ 0)$ = max(${f(k3, 0)} − ${f(s0, 2)}, 0) = ${f(intP3, 2)} — ce put est dans la monnaie puisque l'action cote SOUS son strike. Valeur temps = ${f(p3, 2)} − ${f(intP3, 2)} = **${mnt(tvPut3, cfg.sym)}**. Même décomposition, monnaie inversée : un put est dans la monnaie quand l'action est basse, un call quand elle est haute.`,
          }],
          pieges: [en
            ? `Applying max(S − K, 0) to a put gives a "negative intrinsic" nonsense: the put formula flips the difference — max(K − S, 0).`
            : `Appliquer max(S − K, 0) à un put fabrique une « intrinsèque négative » absurde : la formule du put retourne la différence — max(K − S, 0).`],
        },
        {
          intitule: en ? `d) The break-even of the ${f(kMid, 0)} call` : `d) Le point mort du call ${f(kMid, 0)}`,
          enonce: en
            ? `A trader buys the ${f(kMid, 0)} call at ${mnt(c2, cfg.sym)}. At what stock price at expiry does she break exactly even, in ${cfg.sym}?`
            : `Une trader achète le call ${f(kMid, 0)} à ${mnt(c2, cfg.sym)}. À quel cours de l'action à l'échéance est-elle exactement à l'équilibre, en ${cfg.sym} ?`,
          reponse: be2, tolerance: 0.005, unite: cfg.sym,
          etapes: [{
            titre: en ? 'Strike + premium — and the whole time value must be recouped' : 'Strike + prime — et toute la valeur temps à rembourser',
            contenu: en
              ? `Break-even = K + premium = ${f(kMid, 0)} + ${f(c2, 2)} = **${mnt(be2, cfg.sym)}**. From today's ${f(s0, 2)}, the stock must gain ${f(r2(be2 - s0), 2)} in two months just to pay the premium back — the ${f(r2(c2 - int2), 2)} of time value bought in b) must be RE-EARNED by the move. That is why reading a chain starts with splitting the premium: the time value is exactly what the underlying owes you.`
              : `Point mort = K + prime = ${f(kMid, 0)} + ${f(c2, 2)} = **${mnt(be2, cfg.sym)}**. Depuis les ${f(s0, 2)} d'aujourd'hui, l'action doit gagner ${f(r2(be2 - s0), 2)} en deux mois rien que pour rembourser la prime — les ${f(r2(c2 - int2), 2)} de valeur temps achetés au b) doivent être REGAGNÉS par le mouvement. Voilà pourquoi lire une chaîne commence par découper la prime : la valeur temps est exactement ce que le sous-jacent vous doit.`,
          }],
          pieges: [en
            ? `Counting the break-even from the spot (${f(s0, 2)} + ${f(c2, 2)}) instead of the strike: the exercise pivots on K, so the premium is recouped from ${f(kMid, 0)}, not from the current price.`
            : `Compter le point mort depuis le spot (${f(s0, 2)} + ${f(c2, 2)}) au lieu du strike : l'exercice pivote sur K, la prime se rembourse donc depuis ${f(kMid, 0)}, pas depuis le cours du jour.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 4. m8-pb-04 — Le straddle de résultats : parier sur le mouvement — N1 */
/* ------------------------------------------------------------------ */
const straddleResultats: ProblemeMoule = {
  id: 'm8-pb-04', moduleId: M8,
  titre: 'Le straddle de résultats : parier sur le mouvement, pas sur le sens',
  titreEn: 'The earnings straddle: betting on the move, not the direction',
  typeDeCas: 'stratégie de volatilité',
  typeDeCasEn: 'volatility strategy',
  difficulte: 1,
  scenarios: ["Le trader avant les résultats trimestriels d'un géant du luxe", 'La gérante avant le verdict de la FDA sur une biotech', "L'étudiant avant une décision de banque centrale"],
  scenariosEn: ['The trader before a luxury giant reports earnings', 'The fund manager before an FDA verdict on a biotech', 'The student ahead of a central-bank decision'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : niveau du strike, primes call/put, contrats, ampleur des chocs.
    const cfg = ([
      { sym: '€', kMin: 12, kMax: 20, pas: 50, cMin: 18, cMax: 40, pMin: 15, pMax: 35, nMin: 1, nMax: 3, exMin: 20, exMax: 90 },
      { sym: '$', kMin: 4, kMax: 12, pas: 10, cMin: 6, cMax: 14, pMin: 5, pMax: 12, nMin: 2, nMax: 6, exMin: 15, exMax: 60 },
      { sym: '€', kMin: 16, kMax: 30, pas: 5, cMin: 2, cMax: 5, pMin: 1.8, pMax: 4.5, nMin: 3, nMax: 8, exMin: 2, exMax: 10 },
    ] as const)[sIdx];
    const K = randInt(rng, cfg.kMin, cfg.kMax) * cfg.pas;      // strike ATM, l'action cote K
    const c = randFloat(rng, cfg.cMin, cfg.cMax, 1);
    const p = randFloat(rng, cfg.pMin, cfg.pMax, 1);
    const n = randInt(rng, cfg.nMin, cfg.nMax);
    const cout = r2(c + p);                                    // coût du straddle par action
    const coutTotal = r2(cout * QUOTITE * n);
    const bornes = pointsMortsStraddle(K, cout);
    const beHaut = r2(bornes.haut);
    const beBas = r2(bornes.bas);
    // Deux atterrissages tirés AVANT toute branche de langue : le choc et le pétard mouillé.
    const dir = pick(rng, [1, -1] as const);
    const sChoc = r2(K + dir * (cout + randFloat(rng, cfg.exMin, cfg.exMax, 1)));
    const sCalme = r2(K + pick(rng, [1, -1] as const) * randFloat(rng, 0.1, cout * 0.6, 1));
    const payoffChoc = r2(payoffCall(sChoc, K) + payoffPut(sChoc, K));
    const pnlChoc = r2(pnlOption(payoffChoc, cout, 1) * QUOTITE * n);
    const payoffCalme = r2(payoffCall(sCalme, K) + payoffPut(sCalme, K));
    const pnlCalme = r2(pnlOption(payoffCalme, cout, 1) * QUOTITE * n);
    const hausse = dir === 1;

    const { en, f, mnt } = outils(langue);
    const desc = en
      ? `the stock trades at ${mnt(K, cfg.sym)}; the ${f(K, 0)} call quotes ${mnt(c, cfg.sym)} and the ${f(K, 0)} put quotes ${mnt(p, cfg.sym)} (same expiry, just after the event); you buy ${f(n, 0)} straddle${n > 1 ? 's' : ''} — call + put — of ${f(QUOTITE, 0)} shares each`
      : `l'action cote ${mnt(K, cfg.sym)} ; le call ${f(K, 0)} se traite à ${mnt(c, cfg.sym)} et le put ${f(K, 0)} à ${mnt(p, cfg.sym)} (même échéance, juste après l'événement) ; vous achetez ${f(n, 0)} straddle${n > 1 ? 's' : ''} — call + put — de ${f(QUOTITE, 0)} actions chacun`;
    const contexte = (en
      ? [
        `Earnings night on a luxury giant: the trader has NO idea whether the numbers will delight or disgust, only that the reaction will be violent — ${desc}. Before the print, he lays out the cost of the bet, the two prices between which he loses, the P&L if the stock jumps to ${f(sChoc, 2)} — and the sobering case where it barely moves.`,
        `FDA verdict at dawn on a biotech: approval and the stock flies, rejection and it craters — ${desc}. For her risk committee, the manager quantifies the premium at risk, the upper break-even, the P&L on a decision that sends the stock to ${f(sChoc, 2)}, and what happens if the agency simply postpones.`,
        `Central-bank day, and the student is convinced the market underprices the surprise: ${desc}. His trading-game logbook must show the total stake, the break-evens, the payoff if the index-like stock lands at ${f(sChoc, 2)} — and the trap where the decision is exactly what everyone expected.`,
      ]
      : [
        `Soir de résultats sur un géant du luxe : le trader n'a AUCUNE idée du sens de la réaction, seulement de sa violence — ${desc}. Avant la publication, il pose le coût du pari, les deux cours entre lesquels il perd, le P&L si l'action saute à ${f(sChoc, 2)} — et le cas dégrisant où elle bouge à peine.`,
        `Verdict de la FDA à l'aube sur une biotech : approbation et l'action s'envole, rejet et elle s'effondre — ${desc}. Pour son comité des risques, la gérante chiffre la prime en jeu, le point mort haut, le P&L sur une décision qui envoie le titre à ${f(sChoc, 2)}, et ce qui arrive si l'agence se contente de reporter.`,
        `Jour de banque centrale, et l'étudiant est convaincu que le marché sous-estime la surprise : ${desc}. Son journal du jeu de bourse doit montrer la mise totale, les points morts, le résultat si l'action atterrit à ${f(sChoc, 2)} — et le piège où la décision est exactement celle que tout le monde attendait.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The cost of the bet' : 'a) Le coût du pari',
          enonce: en
            ? `What do the ${f(n, 0)} straddle${n > 1 ? 's' : ''} cost in total — call AND put — in ${cfg.sym}?`
            : `Combien coûtent les ${f(n, 0)} straddle${n > 1 ? 's' : ''} au total — call ET put — en ${cfg.sym} ?`,
          reponse: coutTotal, tolerance: 0.005, unite: cfg.sym,
          etapes: [{
            titre: en ? 'Two premiums, one stake' : 'Deux primes, une seule mise',
            contenu: en
              ? `Cost per share = ${f(c, 2)} + ${f(p, 2)} = ${f(cout, 2)} ; total = ${f(cout, 2)} × ${f(QUOTITE, 0)} × ${f(n, 0)} = **${mnt(coutTotal, cfg.sym)}**. Buying a straddle is paying the insurance premium TWICE — once for the upside, once for the downside. This stake is the maximum loss, reached in one single scenario: the stock pinned exactly at ${f(K, 0)} at expiry.`
              : `Coût par action = ${f(c, 2)} + ${f(p, 2)} = ${f(cout, 2)} ; total = ${f(cout, 2)} × ${f(QUOTITE, 0)} × ${f(n, 0)} = **${mnt(coutTotal, cfg.sym)}**. Acheter un straddle, c'est payer la prime d'assurance DEUX fois — une pour la hausse, une pour la baisse. Cette mise est la perte maximale, atteinte dans un seul scénario : l'action clouée exactement à ${f(K, 0)} à l'échéance.`,
          }],
        },
        {
          intitule: en ? 'b) The upper break-even' : 'b) Le point mort haut',
          enonce: en
            ? `Above what stock price at expiry does the straddle start making money, in ${cfg.sym}?`
            : `Au-dessus de quel cours à l'échéance le straddle commence-t-il à gagner de l'argent, en ${cfg.sym} ?`,
          reponse: beHaut, tolerance: 0.005, unite: cfg.sym,
          etapes: [{
            titre: en ? 'K plus the DOUBLE premium — and its mirror below' : 'K plus la prime DOUBLE — et son miroir en bas',
            contenu: en
              ? `Upper break-even = K + total cost = ${f(K, 0)} + ${f(cout, 2)} = **${mnt(beHaut, cfg.sym)}** ; the mirror below sits at ${f(K, 0)} − ${f(cout, 2)} = ${f(beBas, 2)}. Between the two, the straddle loses. The stock must move by ${f(r2((cout / K) * 100), 1)}% in either direction just to pay for itself: the chain had ALREADY priced that much move — a straddle is only cheap when the market's imagination is (chapter 6).`
              : `Point mort haut = K + coût total = ${f(K, 0)} + ${f(cout, 2)} = **${mnt(beHaut, cfg.sym)}** ; le miroir bas est à ${f(K, 0)} − ${f(cout, 2)} = ${f(beBas, 2)}. Entre les deux, le straddle perd. L'action doit bouger de ${f(r2((cout / K) * 100), 1)} % dans un sens ou l'autre rien que pour se rembourser : la chaîne avait DÉJÀ mis ce mouvement dans les prix — un straddle n'est bon marché que quand l'imagination du marché l'est (chapitre 6).`,
          }],
          pieges: [en
            ? `Using only ONE premium for the break-even (K + ${f(c, 2)}) forgets that the winning leg must also pay for the leg that dies: the threshold uses the FULL ${f(cout, 2)}.`
            : `Ne compter qu'UNE prime dans le point mort (K + ${f(c, 2)}) oublie que la jambe gagnante doit aussi rembourser celle qui meurt : le seuil utilise les ${f(cout, 2)} ENTIERS.`],
        },
        {
          intitule: en ? `c) The shock: the stock lands at ${f(sChoc, 2)}` : `c) Le choc : l'action atterrit à ${f(sChoc, 2)}`,
          enonce: en
            ? `The event ${hausse ? 'delights' : 'horrifies'} the market and the stock finishes at ${mnt(sChoc, cfg.sym)}. What is the total P&L of the position, sign included, in ${cfg.sym}?`
            : `L'événement ${hausse ? 'enchante' : 'horrifie'} le marché et l'action finit à ${mnt(sChoc, cfg.sym)}. Quel est le P&L total de la position, signe compris, en ${cfg.sym} ?`,
          reponse: pnlChoc, tolerance: Math.max(1, Math.abs(pnlChoc) * 0.01), toleranceMode: 'absolu', unite: cfg.sym,
          etapes: [
            {
              titre: en ? 'One leg pays, the other dies' : "Une jambe paie, l'autre meurt",
              contenu: en
                ? `Call: max(${f(sChoc, 2)} − ${f(K, 0)}, 0) = ${f(r2(payoffCall(sChoc, K)), 2)} ; put: max(${f(K, 0)} − ${f(sChoc, 2)}, 0) = ${f(r2(payoffPut(sChoc, K)), 2)}. Combined payoff = ${f(payoffChoc, 2)} — the straddle always pays |S_T − K|, the SIZE of the move, whatever its sign.`
                : `Call : max(${f(sChoc, 2)} − ${f(K, 0)}, 0) = ${f(r2(payoffCall(sChoc, K)), 2)} ; put : max(${f(K, 0)} − ${f(sChoc, 2)}, 0) = ${f(r2(payoffPut(sChoc, K)), 2)}. Payoff combiné = ${f(payoffChoc, 2)} — le straddle paie toujours |S_T − K|, la TAILLE du mouvement, quel que soit son signe.`,
            },
            {
              titre: en ? 'Net of the double premium' : 'Net de la prime double',
              contenu: en
                ? `P&L = (${f(payoffChoc, 2)} − ${f(cout, 2)}) × ${f(QUOTITE, 0)} × ${f(n, 0)} = **${mnt(pnlChoc, cfg.sym)}**. The direction was never the bet: ${hausse ? 'had the stock CRASHED' : 'had the stock SOARED'} by the same distance, the P&L would be identical — that is precisely what "long volatility" means.`
                : `P&L = (${f(payoffChoc, 2)} − ${f(cout, 2)}) × ${f(QUOTITE, 0)} × ${f(n, 0)} = **${mnt(pnlChoc, cfg.sym)}**. Le sens n'a jamais été le pari : ${hausse ? "si l'action s'était EFFONDRÉE" : "si l'action s'était ENVOLÉE"} de la même distance, le P&L serait identique — c'est exactement ce que veut dire « long de volatilité ».`,
            },
          ],
        },
        {
          intitule: en ? `d) The damp squib: the stock finishes at ${f(sCalme, 2)}` : `d) Le pétard mouillé : l'action finit à ${f(sCalme, 2)}`,
          enonce: en
            ? `Alternative scenario: the event was priced in, the stock finishes at ${mnt(sCalme, cfg.sym)}. What is the total P&L, sign included, in ${cfg.sym}?`
            : `Scénario alternatif : l'événement était dans les prix, l'action finit à ${mnt(sCalme, cfg.sym)}. Quel est le P&L total, signe compris, en ${cfg.sym} ?`,
          reponse: pnlCalme, tolerance: Math.max(1, Math.abs(pnlCalme) * 0.01), toleranceMode: 'absolu', unite: cfg.sym,
          etapes: [{
            titre: en ? 'A move, but not ENOUGH move' : 'Un mouvement, mais pas ASSEZ de mouvement',
            contenu: en
              ? `Payoff = |${f(sCalme, 2)} − ${f(K, 0)}| = ${f(payoffCalme, 2)}, against ${f(cout, 2)} of premium: P&L = **${mnt(pnlCalme, cfg.sym)}**. The stock DID move — but stayed inside the [${f(beBas, 2)} ; ${f(beHaut, 2)}] corridor of b). The buyer of a straddle does not win when something happens: he wins when MORE happens than the market had already paid for. That is the classic post-earnings disappointment — the news drops, the stock shrugs, and both premiums evaporate.`
              : `Payoff = |${f(sCalme, 2)} − ${f(K, 0)}| = ${f(payoffCalme, 2)}, contre ${f(cout, 2)} de prime : P&L = **${mnt(pnlCalme, cfg.sym)}**. L'action a BIEN bougé — mais elle est restée dans le corridor [${f(beBas, 2)} ; ${f(beHaut, 2)}] du b). L'acheteur d'un straddle ne gagne pas quand il se passe quelque chose : il gagne quand il se passe PLUS que ce que le marché avait déjà payé. C'est la déception classique d'après-résultats — la nouvelle tombe, l'action hausse les épaules, et les deux primes s'évaporent.`,
          }],
          pieges: [en
            ? `"The stock moved, so the straddle won" ignores the corridor: between the two break-evens, one leg's payoff never repays TWO premiums.`
            : `« L'action a bougé, donc le straddle a gagné » ignore le corridor : entre les deux points morts, le payoff d'une jambe ne rembourse jamais DEUX primes.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 5. m8-pb-05 — Le covered call : louer une ligne qui dort — N2       */
/* ------------------------------------------------------------------ */
const coveredCall: ProblemeMoule = {
  id: 'm8-pb-05', moduleId: M8,
  titre: 'Le covered call : louer la ligne qui dort',
  titreEn: 'The covered call: renting out a sleepy position',
  typeDeCas: 'vente couverte',
  typeDeCasEn: 'covered writing',
  difficulte: 2,
  scenarios: ['Le gérant qui monétise une ligne endormie du portefeuille', 'Le family office américain et son rendement d\'appoint', 'La particulière qui vend des calls couverts chaque mois'],
  scenariosEn: ['The manager monetising a dormant portfolio line', 'The US family office and its yield top-up', 'The retail investor selling covered calls every month'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : cours, grille, décote du strike, prime, contrats, chocs.
    const cfg = ([
      { sym: '€', sMin: 12, sMax: 20, pas: 5, dMin: 1, dMax: 2, cMin: 1.2, cMax: 3, nMin: 4, nMax: 10, drMin: 2, drMax: 12, upMin: 2, upMax: 15 },
      { sym: '$', sMin: 10, sMax: 22, pas: 10, dMin: 1, dMax: 1, cMin: 2.5, cMax: 6, nMin: 2, nMax: 6, drMin: 5, drMax: 25, upMin: 4, upMax: 30 },
      { sym: '€', sMin: 20, sMax: 45, pas: 1, dMin: 1, dMax: 3, cMin: 0.5, cMax: 1.4, nMin: 1, nMax: 3, drMin: 1, drMax: 5, upMin: 1, upMax: 6 },
    ] as const)[sIdx];
    const s0 = randInt(rng, cfg.sMin, cfg.sMax) * cfg.pas;
    const K = s0 + randInt(rng, cfg.dMin, cfg.dMax) * cfg.pas;   // strike AU-DESSUS du spot
    const c = randFloat(rng, cfg.cMin, cfg.cMax, 1);
    const n = randInt(rng, cfg.nMin, cfg.nMax);
    const nbActions = n * QUOTITE;
    const primeTotale = r2(c * QUOTITE * n);
    const sBas = r2(K - randFloat(rng, cfg.drMin, cfg.drMax, 1));      // sous le strike
    const sHaut = r2(K + c + randFloat(rng, cfg.upMin, cfg.upMax, 1)); // au-delà du seuil de regret
    const pnlBas = r2(((sBas - s0) + pnlOption(payoffCall(sBas, K), c, -1)) * nbActions);
    const pnlBasNu = r2((sBas - s0) * nbActions);
    const pnlHaut = r2(((sHaut - s0) + pnlOption(payoffCall(sHaut, K), c, -1)) * nbActions);
    const pnlHautNu = r2((sHaut - s0) * nbActions);
    const manque = r2(pnlHautNu - pnlHaut);
    const seuilRegret = r2(pointMortCall(K, c));   // au-delà, mieux valait ne pas vendre le call
    const venteEffective = r2(K + c);              // prix de vente effectif si exercé

    const { en, f, mnt } = outils(langue);
    const desc = en
      ? `the line holds ${f(nbActions, 0)} shares bought long ago and now trading at ${mnt(s0, cfg.sym)}; the 1-month call of strike ${f(K, 0)} quotes ${mnt(c, cfg.sym)} per share, and you SELL ${f(n, 0)} contract${n > 1 ? 's' : ''} of ${f(QUOTITE, 0)} shares against the position`
      : `la ligne détient ${f(nbActions, 0)} actions achetées il y a longtemps et cotant aujourd'hui ${mnt(s0, cfg.sym)} ; le call 1 mois de strike ${f(K, 0)} se traite à ${mnt(c, cfg.sym)} par action, et vous VENDEZ ${f(n, 0)} contrat${n > 1 ? 's' : ''} de ${f(QUOTITE, 0)} actions adossé${n > 1 ? 's' : ''} à la position`;
    const contexte = (en
      ? [
        `A fund manager stares at a line that has gone nowhere for months and decides to make it pay rent: ${desc}. For the client's report he wants the rent collected, the P&L if the stock keeps dozing below ${f(K, 0)}, the P&L if it suddenly wakes up at ${f(sHaut, 2)} — and the exact price above which he will regret the whole idea.`,
        `A US family office tops up the yield of a legacy holding by writing calls against it: ${desc}. The investment memo must lay out the premium banked, the outcome in the sideways scenario, the capped outcome in the rally to ${f(sHaut, 2)}, and the regret threshold the committee keeps asking about.`,
        `A retail investor has turned covered calls into a monthly ritual on her favourite stock: ${desc}. This month she documents it properly: the premium credited, the result if the stock stalls at ${f(sBas, 2)}, the result if it jumps to ${f(sHaut, 2)} — and the level where her strategy starts costing her money against simply holding.`,
      ]
      : [
        `Un gérant contemple une ligne qui ne va nulle part depuis des mois et décide de lui faire payer un loyer : ${desc}. Pour le rapport client, il veut le loyer encaissé, le P&L si l'action continue de somnoler sous ${f(K, 0)}, le P&L si elle se réveille brutalement à ${f(sHaut, 2)} — et le prix exact au-delà duquel il regrettera toute l'idée.`,
        `Un family office américain complète le rendement d'une participation historique en vendant des calls dessus : ${desc}. La note d'investissement doit poser la prime encaissée, le résultat dans le scénario sans tendance, le résultat plafonné dans le rallye à ${f(sHaut, 2)}, et le seuil de regret que le comité réclame à chaque fois.`,
        `Une particulière a fait de la vente de calls couverts un rituel mensuel sur sa valeur préférée : ${desc}. Ce mois-ci, elle documente proprement : la prime créditée, le résultat si l'action cale à ${f(sBas, 2)}, le résultat si elle bondit à ${f(sHaut, 2)} — et le niveau où sa stratégie commence à lui coûter face à la simple détention.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The rent collected' : 'a) Le loyer encaissé',
          enonce: en
            ? `How much premium do you collect today by selling the ${f(n, 0)} contract${n > 1 ? 's' : ''}, in ${cfg.sym}?`
            : `Quelle prime encaissez-vous aujourd'hui en vendant les ${f(n, 0)} contrat${n > 1 ? 's' : ''}, en ${cfg.sym} ?`,
          reponse: primeTotale, tolerance: 0.005, unite: cfg.sym,
          etapes: [{
            titre: en ? 'The seller receives — because he promises' : 'Le vendeur encaisse — parce qu\'il promet',
            contenu: en
              ? `Premium = ${f(c, 2)} × ${f(QUOTITE, 0)} × ${f(n, 0)} = **${mnt(primeTotale, cfg.sym)}**, credited immediately — ${f(r2((c / s0) * 100), 1)}% of the position in one month. In exchange, you PROMISE to deliver the ${f(nbActions, 0)} shares at ${f(K, 0)} if asked. "Covered" means the shares are already in the book: no naked-seller abyss here, only a promise you can keep (chapter 2).`
              : `Prime = ${f(c, 2)} × ${f(QUOTITE, 0)} × ${f(n, 0)} = **${mnt(primeTotale, cfg.sym)}**, créditée immédiatement — ${f(r2((c / s0) * 100), 1)} % de la position en un mois. En échange, vous PROMETTEZ de livrer les ${f(nbActions, 0)} actions à ${f(K, 0)} si on vous le demande. « Couvert » signifie que les actions sont déjà dans le livre : pas d'abîme du vendeur nu ici, seulement une promesse tenable (chapitre 2).`,
          }],
        },
        {
          intitule: en ? `b) The stock dozes on: expiry at ${f(sBas, 2)}` : `b) L'action somnole : échéance à ${f(sBas, 2)}`,
          enonce: en
            ? `At expiry the stock trades at ${mnt(sBas, cfg.sym)}, below the strike. What is the total P&L of the covered position (shares + sold calls), sign included, in ${cfg.sym}?`
            : `À l'échéance, l'action cote ${mnt(sBas, cfg.sym)}, sous le strike. Quel est le P&L total de la position couverte (actions + calls vendus), signe compris, en ${cfg.sym} ?`,
          reponse: pnlBas, tolerance: Math.max(1, Math.abs(pnlBas) * 0.01), toleranceMode: 'absolu', unite: cfg.sym,
          etapes: [
            {
              titre: en ? 'The call dies, the premium stays' : 'Le call meurt, la prime reste',
              contenu: en
                ? `Below ${f(K, 0)}, nobody exercises: payoff of the sold call = max(${f(sBas, 2)} − ${f(K, 0)}, 0) = 0, and the seller's P&L on the option is the full premium, +${f(c, 2)} per share. Total: (${f(sBas, 2)} − ${f(s0, 0)} + ${f(c, 2)}) × ${f(nbActions, 0)} = **${mnt(pnlBas, cfg.sym)}**.`
                : `Sous ${f(K, 0)}, personne n'exerce : payoff du call vendu = max(${f(sBas, 2)} − ${f(K, 0)}, 0) = 0, et le P&L du vendeur sur l'option est la prime entière, +${f(c, 2)} par action. Total : (${f(sBas, 2)} − ${f(s0, 0)} + ${f(c, 2)}) × ${f(nbActions, 0)} = **${mnt(pnlBas, cfg.sym)}**.`,
            },
            {
              titre: en ? 'The rent cushions the line' : 'Le loyer amortit la ligne',
              contenu: en
                ? `Unhedged, the line would show ${mnt(pnlBasNu, cfg.sym)}; with the calls, ${mnt(pnlBas, cfg.sym)} — the premium improves the result by ${mnt(primeTotale, cfg.sym)} in EVERY scenario where the stock finishes below ${f(K, 0)}. The cushion is real but thin: it lowers the pain threshold to ${f(r2(s0 - c), 2)}, it does not protect against a crash — a covered call is a yield trade, not a hedge.`
                : `Sans les calls, la ligne afficherait ${mnt(pnlBasNu, cfg.sym)} ; avec, ${mnt(pnlBas, cfg.sym)} — la prime améliore le résultat de ${mnt(primeTotale, cfg.sym)} dans TOUS les scénarios où l'action finit sous ${f(K, 0)}. Le coussin est réel mais mince : il abaisse le seuil de douleur à ${f(r2(s0 - c), 2)}, il ne protège pas d'un krach — le covered call est un trade de rendement, pas une couverture.`,
            },
          ],
          pieges: [en
            ? `Reading the covered call as downside protection: the premium absorbs the first ${f(c, 2)} of decline, then the line falls one for one, exactly like an unhedged position.`
            : `Lire le covered call comme une protection à la baisse : la prime absorbe les premiers ${f(c, 2)} de baisse, puis la ligne chute un pour un, exactement comme une position nue.`],
        },
        {
          intitule: en ? `c) The stock wakes up: expiry at ${f(sHaut, 2)}` : `c) L'action se réveille : échéance à ${f(sHaut, 2)}`,
          enonce: en
            ? `Other scenario: the stock rallies to ${mnt(sHaut, cfg.sym)}. What is the total P&L of the covered position, sign included, in ${cfg.sym}?`
            : `Autre scénario : l'action s'envole à ${mnt(sHaut, cfg.sym)}. Quel est le P&L total de la position couverte, signe compris, en ${cfg.sym} ?`,
          reponse: pnlHaut, tolerance: Math.max(1, Math.abs(pnlHaut) * 0.01), toleranceMode: 'absolu', unite: cfg.sym,
          etapes: [
            {
              titre: en ? 'The sold call claws back everything above K' : 'Le call vendu reprend tout au-dessus de K',
              contenu: en
                ? `Shares: ${f(sHaut, 2)} − ${f(s0, 0)} = +${f(r2(sHaut - s0), 2)}. Sold call: payoff max(${f(sHaut, 2)} − ${f(K, 0)}, 0) = ${f(r2(payoffCall(sHaut, K)), 2)} against you, plus the ${f(c, 2)} premium kept: ${f(r2(pnlOption(payoffCall(sHaut, K), c, -1)), 2)} per share. Net: (${f(K, 0)} − ${f(s0, 0)} + ${f(c, 2)}) × ${f(nbActions, 0)} = **${mnt(pnlHaut, cfg.sym)}** — the gain is CAPPED at the strike plus the premium, however high the stock flies.`
                : `Actions : ${f(sHaut, 2)} − ${f(s0, 0)} = +${f(r2(sHaut - s0), 2)}. Call vendu : payoff max(${f(sHaut, 2)} − ${f(K, 0)}, 0) = ${f(r2(payoffCall(sHaut, K)), 2)} contre vous, plus les ${f(c, 2)} de prime conservés : ${f(r2(pnlOption(payoffCall(sHaut, K), c, -1)), 2)} par action. Net : (${f(K, 0)} − ${f(s0, 0)} + ${f(c, 2)}) × ${f(nbActions, 0)} = **${mnt(pnlHaut, cfg.sym)}** — le gain est PLAFONNÉ au strike plus la prime, aussi haut que monte l'action.`,
            },
            {
              titre: en ? 'The opportunity cost, in hard cash' : "Le manque à gagner, en argent sonnant",
              contenu: en
                ? `Unhedged, the line would show ${mnt(pnlHautNu, cfg.sym)}: the calls cost **${mnt(manque, cfg.sym)}** of forgone upside. Delivered at ${f(K, 0)} with the premium in pocket, the effective sale price is ${f(K, 0)} + ${f(c, 2)} = ${f(venteEffective, 2)} — the manager sold the rally he had promised away.`
                : `Sans les calls, la ligne afficherait ${mnt(pnlHautNu, cfg.sym)} : les calls ont coûté **${mnt(manque, cfg.sym)}** de hausse abandonnée. Livré à ${f(K, 0)} avec la prime en poche, le prix de vente effectif est ${f(K, 0)} + ${f(c, 2)} = ${f(venteEffective, 2)} — le gérant a vendu le rallye qu'il avait promis.`,
            },
          ],
          pieges: [en
            ? `Adding the stock's full rise AND the premium double-counts: above ${f(K, 0)}, every point gained by the share is repaid to the call buyer — only the corridor up to the strike stays yours.`
            : `Additionner toute la hausse de l'action ET la prime compte double : au-dessus de ${f(K, 0)}, chaque point gagné par le titre est rendu à l'acheteur du call — seul le corridor jusqu'au strike vous reste.`],
        },
        {
          intitule: en ? 'd) The regret threshold' : 'd) Le seuil de regret',
          enonce: en
            ? `Above what stock price at expiry would you have been better off NOT selling the calls, in ${cfg.sym}?`
            : `Au-delà de quel cours à l'échéance auriez-vous mieux fait de NE PAS vendre les calls, en ${cfg.sym} ?`,
          reponse: seuilRegret, tolerance: 0.005, unite: cfg.sym,
          etapes: [{
            titre: en ? 'K + premium: where the cap starts to bite' : 'K + prime : là où le plafond commence à mordre',
            contenu: en
              ? `Below ${f(K, 0)}, selling the call is pure gain (+ premium). Between ${f(K, 0)} and K + c, what the call gives back is still smaller than the premium received. The covered position only trails the naked one beyond K + c = ${f(K, 0)} + ${f(c, 2)} = **${mnt(seuilRegret, cfg.sym)}** — the same K-plus-premium threshold as the call buyer's break-even, read from the other side of the trade. The scenario of c), at ${f(sHaut, 2)}, sits beyond it: hence the regret. The honest summary of a covered call: paid in ALL scenarios, punished only in the very ones the holder had stopped believing in.`
              : `Sous ${f(K, 0)}, vendre le call est un gain pur (+ prime). Entre ${f(K, 0)} et K + c, ce que le call rend reste inférieur à la prime reçue. La position couverte ne fait moins bien que la position nue qu'au-delà de K + c = ${f(K, 0)} + ${f(c, 2)} = **${mnt(seuilRegret, cfg.sym)}** — le même seuil strike-plus-prime que le point mort de l'acheteur du call, lu de l'autre côté du trade. Le scénario du c), à ${f(sHaut, 2)}, est au-delà : d'où le regret. Le résumé honnête du covered call : payé dans TOUS les scénarios, puni seulement dans ceux auxquels le détenteur ne croyait plus.`,
          }],
          pieges: [en
            ? `Placing the regret at the strike: between ${f(K, 0)} and ${f(seuilRegret, 2)}, the covered position STILL beats the naked one — the premium outweighs what the call gives back.`
            : `Placer le regret au strike : entre ${f(K, 0)} et ${f(seuilRegret, 2)}, la position couverte bat ENCORE la position nue — la prime pèse plus que ce que le call rend.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 6. m8-pb-06 — Le bull call spread : la hausse à prix réduit — N2    */
/* ------------------------------------------------------------------ */
const bullCallSpread: ProblemeMoule = {
  id: 'm8-pb-06', moduleId: M8,
  titre: 'Le bull call spread : acheter la hausse, revendre le rêve',
  titreEn: 'The bull call spread: buying the rise, selling back the dream',
  typeDeCas: 'stratégie à jambes multiples',
  typeDeCasEn: 'multi-leg strategy',
  difficulte: 2,
  scenarios: ['Le trader modérément haussier sur une banque française', 'Le hedge fund qui finance sa vue sur une tech américaine', "L'étudiante du jeu de bourse qui allège sa prime"],
  scenariosEn: ['The moderately bullish trader on a French bank', 'The hedge fund funding its view on a US tech', 'The trading-game student trimming her premium'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : grille de strikes, largeur du spread, primes, contrats.
    const cfg = ([
      { sym: '€', kMin: 10, kMax: 16, pas: 5, wMin: 1, wMax: 2, c1Min: 2.5, c1Max: 5, ecMin: 1.2, ecMax: 2, nMin: 2, nMax: 6, exMin: 2, exMax: 10 },
      { sym: '$', kMin: 15, kMax: 25, pas: 10, wMin: 1, wMax: 2, c1Min: 8, c1Max: 15, ecMin: 4, ecMax: 7, nMin: 1, nMax: 4, exMin: 5, exMax: 25 },
      { sym: '€', kMin: 20, kMax: 40, pas: 2, wMin: 2, wMax: 3, c1Min: 1.5, c1Max: 3, ecMin: 0.8, ecMax: 1.1, nMin: 3, nMax: 8, exMin: 1, exMax: 5 },
    ] as const)[sIdx];
    const K1 = randInt(rng, cfg.kMin, cfg.kMax) * cfg.pas;
    const largeur = randInt(rng, cfg.wMin, cfg.wMax) * cfg.pas;
    const K2 = K1 + largeur;
    const s0 = r2(K1 + pick(rng, [1, -1] as const) * randFloat(rng, 0, 0.3, 2) * cfg.pas);
    const c1 = randFloat(rng, cfg.c1Min, cfg.c1Max, 1);
    const c2 = r2(c1 - randFloat(rng, cfg.ecMin, cfg.ecMax, 1)); // le call K2 vaut moins cher
    const n = randInt(rng, cfg.nMin, cfg.nMax);
    const cNet = r2(c1 - c2);
    const coutTotal = r2(cNet * QUOTITE * n);
    const payoffMax = r2(payoffCall(K2, K1));                    // = K2 − K1, plafond du spread
    const profitMax = r2((payoffMax - cNet) * QUOTITE * n);
    const be = r2(pointMortCall(K1, cNet));
    // Atterrissage tiré dans l'une des trois zones : sous K1, entre K1 et K2, au-delà de K2.
    const zone = pick(rng, [0, 1, 2] as const);
    const sT = zone === 0 ? r2(K1 - randFloat(rng, cfg.exMin, cfg.exMax, 1))
      : zone === 1 ? r2(K1 + randFloat(rng, largeur * 0.2, largeur * 0.8, 1))
        : r2(K2 + randFloat(rng, cfg.exMin, cfg.exMax, 1));
    const payoffT = r2(payoffCall(sT, K1) - payoffCall(sT, K2));
    const pnlT = r2(pnlOption(payoffT, cNet, 1) * QUOTITE * n);
    const economiePct = r2((c2 / c1) * 100);

    const { en, f, mnt } = outils(langue);
    const desc = en
      ? `the stock trades at ${mnt(s0, cfg.sym)}; on the 3-month expiry, the ${f(K1, 0)} call quotes ${mnt(c1, cfg.sym)} and the ${f(K2, 0)} call quotes ${mnt(c2, cfg.sym)}; you BUY the ${f(K1, 0)} call and SELL the ${f(K2, 0)} call, ${f(n, 0)} spread${n > 1 ? 's' : ''} of ${f(QUOTITE, 0)} shares each`
      : `l'action cote ${mnt(s0, cfg.sym)} ; sur l'échéance 3 mois, le call ${f(K1, 0)} se traite à ${mnt(c1, cfg.sym)} et le call ${f(K2, 0)} à ${mnt(c2, cfg.sym)} ; vous ACHETEZ le call ${f(K1, 0)} et VENDEZ le call ${f(K2, 0)}, soit ${f(n, 0)} spread${n > 1 ? 's' : ''} de ${f(QUOTITE, 0)} actions chacun`;
    const contexte = (en
      ? [
        `A trader believes a French bank will grind higher — but not fly — and refuses to pay full price for a naked call: ${desc}. The desk head wants the whole geometry before the ticket goes in: net cost, maximum profit, break-even, and the P&L at the level where the stock actually lands.`,
        `A hedge fund likes a US tech into its product launch but finds the calls expensive after the run-up: ${desc}. The PM's memo prices the structure: what it costs net, the most it can ever pay, where it breaks even — and what the books show at expiry.`,
        `In the trading game, a student wants leveraged upside without burning her budget on premium: ${desc}. Her write-up for the jury: the net stake, the capped jackpot, the break-even that moved closer — and the verdict at the final fixing.`,
      ]
      : [
        `Un trader croit qu'une banque française va grimper — sans s'envoler — et refuse de payer plein tarif un call sec : ${desc}. Le chef de desk veut toute la géométrie avant d'envoyer le ticket : coût net, profit maximum, point mort, et le P&L au niveau où l'action atterrit réellement.`,
        `Un hedge fund aime une tech américaine avant le lancement de son produit mais trouve les calls chers après le rallye : ${desc}. La note du gérant price la structure : ce qu'elle coûte net, le maximum qu'elle peut payer, où elle s'équilibre — et ce qu'affichent les livres à l'échéance.`,
        `Au jeu de bourse, une étudiante veut du levier haussier sans brûler son budget en prime : ${desc}. Son dossier pour le jury : la mise nette, le jackpot plafonné, le point mort qui s'est rapproché — et le verdict au fixing final.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The net cost' : 'a) Le coût net',
          enonce: en
            ? `What does the position cost in total, net of the premium received on the sold leg, in ${cfg.sym}?`
            : `Combien coûte la position au total, net de la prime reçue sur la jambe vendue, en ${cfg.sym} ?`,
          reponse: coutTotal, tolerance: 0.005, unite: cfg.sym,
          etapes: [{
            titre: en ? 'Paid on one leg, received on the other' : "Payée sur une jambe, reçue sur l'autre",
            contenu: en
              ? `Net premium = ${f(c1, 2)} − ${f(c2, 2)} = ${f(cNet, 2)} per share ; total = ${f(cNet, 2)} × ${f(QUOTITE, 0)} × ${f(n, 0)} = **${mnt(coutTotal, cfg.sym)}**. The sold ${f(K2, 0)} call refunds ${f(economiePct, 0)}% of the bought call: the trader financed his bullish view by SELLING the part of the dream he does not believe in — everything above ${f(K2, 0)}.`
              : `Prime nette = ${f(c1, 2)} − ${f(c2, 2)} = ${f(cNet, 2)} par action ; total = ${f(cNet, 2)} × ${f(QUOTITE, 0)} × ${f(n, 0)} = **${mnt(coutTotal, cfg.sym)}**. Le call ${f(K2, 0)} vendu rembourse ${f(economiePct, 0)} % du call acheté : le trader a financé sa vue haussière en VENDANT la part du rêve à laquelle il ne croit pas — tout ce qui dépasse ${f(K2, 0)}.`,
          }],
          pieges: [en
            ? `A "cheaper" position is not a "better" one: the discount is paid for with the cap of b) — options never give something for nothing.`
            : `Une position « moins chère » n'est pas une position « meilleure » : la remise se paie avec le plafond du b) — les options ne donnent jamais rien gratuitement.`],
        },
        {
          intitule: en ? 'b) The capped jackpot' : 'b) Le jackpot plafonné',
          enonce: en
            ? `What is the MAXIMUM total profit of the position, whatever the stock does, in ${cfg.sym}?`
            : `Quel est le profit total MAXIMUM de la position, quoi que fasse l'action, en ${cfg.sym} ?`,
          reponse: profitMax, tolerance: Math.max(1, Math.abs(profitMax) * 0.01), toleranceMode: 'absolu', unite: cfg.sym,
          etapes: [
            {
              titre: en ? 'Beyond K2, the two legs neutralise each other' : 'Au-delà de K2, les deux jambes se neutralisent',
              contenu: en
                ? `At or above ${f(K2, 0)}, the bought call pays S_T − ${f(K1, 0)} and the sold call claws back S_T − ${f(K2, 0)}: the net payoff freezes at ${f(K2, 0)} − ${f(K1, 0)} = ${f(payoffMax, 2)} per share — the WIDTH of the spread, and not a cent more.`
                : `À ${f(K2, 0)} et au-delà, le call acheté paie S_T − ${f(K1, 0)} et le call vendu reprend S_T − ${f(K2, 0)} : le payoff net se fige à ${f(K2, 0)} − ${f(K1, 0)} = ${f(payoffMax, 2)} par action — la LARGEUR du spread, et pas un centime de plus.`,
            },
            {
              titre: en ? 'Net of the stake' : 'Net de la mise',
              contenu: en
                ? `Max profit = (${f(payoffMax, 2)} − ${f(cNet, 2)}) × ${f(QUOTITE, 0)} × ${f(n, 0)} = **${mnt(profitMax, cfg.sym)}**, for ${mnt(coutTotal, cfg.sym)} at risk — a ${f(r2(payoffMax / cNet), 1)}-to-1 payout if the stock closes beyond ${f(K2, 0)}. The whole strategy in one sentence: max loss = the net premium, max gain = the width minus that premium.`
                : `Profit max = (${f(payoffMax, 2)} − ${f(cNet, 2)}) × ${f(QUOTITE, 0)} × ${f(n, 0)} = **${mnt(profitMax, cfg.sym)}**, pour ${mnt(coutTotal, cfg.sym)} en risque — un rapport de ${f(r2(payoffMax / cNet), 1)} contre 1 si l'action clôture au-delà de ${f(K2, 0)}. Toute la stratégie en une phrase : perte max = la prime nette, gain max = la largeur moins cette prime.`,
            },
          ],
        },
        {
          intitule: en ? 'c) The break-even' : 'c) Le point mort',
          enonce: en
            ? `At what stock price at expiry does the position make exactly zero, in ${cfg.sym}?`
            : `À quel cours à l'échéance la position fait-elle exactement zéro, en ${cfg.sym} ?`,
          reponse: be, tolerance: 0.005, unite: cfg.sym,
          etapes: [{
            titre: en ? 'K1 + NET premium — the discount moves the threshold closer' : 'K1 + prime NETTE — la remise rapproche le seuil',
            contenu: en
              ? `Between ${f(K1, 0)} and ${f(K2, 0)}, only the bought call is alive: break-even = ${f(K1, 0)} + ${f(cNet, 2)} = **${mnt(be, cfg.sym)}**. A naked ${f(K1, 0)} call would need ${f(r2(pointMortCall(K1, c1)), 2)} to break even: by selling the ${f(K2, 0)} leg, the trader pulled his threshold ${f(r2(c2), 2)} closer — the real reason spreads exist. The price: c) is where winning STARTS, b) is where it STOPS growing.`
              : `Entre ${f(K1, 0)} et ${f(K2, 0)}, seul le call acheté est vivant : point mort = ${f(K1, 0)} + ${f(cNet, 2)} = **${mnt(be, cfg.sym)}**. Un call ${f(K1, 0)} sec exigerait ${f(r2(pointMortCall(K1, c1)), 2)} pour s'équilibrer : en vendant la jambe ${f(K2, 0)}, le trader a rapproché son seuil de ${f(r2(c2), 2)} — la vraie raison d'être des spreads. Le prix à payer : c) est là où le gain COMMENCE, b) est là où il CESSE de grandir.`,
          }],
          pieges: [en
            ? `Computing the break-even with the FULL premium of the bought call (${f(K1, 0)} + ${f(c1, 2)}) ignores the refund from the sold leg: the position only needs to recoup ${f(cNet, 2)}.`
            : `Calculer le point mort avec la prime PLEINE du call acheté (${f(K1, 0)} + ${f(c1, 2)}) ignore le remboursement de la jambe vendue : la position n'a que ${f(cNet, 2)} à récupérer.`],
        },
        {
          intitule: en ? `d) The verdict: expiry at ${f(sT, 2)}` : `d) Le verdict : échéance à ${f(sT, 2)}`,
          enonce: en
            ? `At expiry the stock trades at ${mnt(sT, cfg.sym)}. What is the total P&L of the position, sign included, in ${cfg.sym}?`
            : `À l'échéance, l'action cote ${mnt(sT, cfg.sym)}. Quel est le P&L total de la position, signe compris, en ${cfg.sym} ?`,
          reponse: pnlT, tolerance: Math.max(1, Math.abs(pnlT) * 0.01), toleranceMode: 'absolu', unite: cfg.sym,
          etapes: [
            {
              titre: en ? 'Each leg separately, then net' : 'Chaque jambe séparément, puis le net',
              contenu: en
                ? `Bought ${f(K1, 0)} call: max(${f(sT, 2)} − ${f(K1, 0)}, 0) = ${f(r2(payoffCall(sT, K1)), 2)}. Sold ${f(K2, 0)} call: −max(${f(sT, 2)} − ${f(K2, 0)}, 0) = ${f(r2(-payoffCall(sT, K2)), 2)}. Net payoff = ${f(payoffT, 2)} per share — ${zone === 0 ? `both legs die below ${f(K1, 0)}.` : zone === 1 ? `only the bought leg is in the money.` : `the payoff is pinned at the ${f(payoffMax, 2)} cap of b).`}`
                : `Call ${f(K1, 0)} acheté : max(${f(sT, 2)} − ${f(K1, 0)}, 0) = ${f(r2(payoffCall(sT, K1)), 2)}. Call ${f(K2, 0)} vendu : −max(${f(sT, 2)} − ${f(K2, 0)}, 0) = ${f(r2(-payoffCall(sT, K2)), 2)}. Payoff net = ${f(payoffT, 2)} par action — ${zone === 0 ? `les deux jambes meurent sous ${f(K1, 0)}.` : zone === 1 ? `seule la jambe achetée est dans la monnaie.` : `le payoff est cloué au plafond de ${f(payoffMax, 2)} du b).`}`,
            },
            {
              titre: en ? 'Net of the premium, times the block' : 'Net de la prime, fois le bloc',
              contenu: en
                ? `P&L = (${f(payoffT, 2)} − ${f(cNet, 2)}) × ${f(QUOTITE, 0)} × ${f(n, 0)} = **${mnt(pnlT, cfg.sym)}**. ${zone === 0 ? `The loss stops at the net stake of a) — the sold leg already refunded part of the failed bet.` : zone === 1 ? `Landed between the strikes: the verdict depends on which side of the ${f(be, 2)} break-even the stock stopped — here, ${sT >= be ? 'just beyond it: a modest win.' : 'short of it: exercised, yet losing.'}` : `Cap reached: this is exactly the maximum profit of b) — beyond ${f(K2, 0)}, the trader watches the rally like a spectator: he sold that part of the dream.`}`
                : `P&L = (${f(payoffT, 2)} − ${f(cNet, 2)}) × ${f(QUOTITE, 0)} × ${f(n, 0)} = **${mnt(pnlT, cfg.sym)}**. ${zone === 0 ? `La perte s'arrête à la mise nette du a) — la jambe vendue avait déjà remboursé une partie du pari manqué.` : zone === 1 ? `Atterrissage entre les strikes : le verdict dépend du côté du point mort de ${f(be, 2)} où l'action s'est arrêtée — ici, ${sT >= be ? 'juste au-delà : gain modeste.' : 'en deçà : exercé, et pourtant perdant.'}` : `Plafond atteint : c'est exactement le profit maximum du b) — au-delà de ${f(K2, 0)}, le trader regarde le rallye en spectateur : il a vendu cette part du rêve.`}`,
            },
          ],
          pieges: [en
            ? `Forgetting the sold leg beyond ${f(K2, 0)}: the bought call's payoff keeps growing on paper, but every extra point is owed to the buyer of the ${f(K2, 0)} call.`
            : `Oublier la jambe vendue au-delà de ${f(K2, 0)} : le payoff du call acheté continue de grossir sur le papier, mais chaque point supplémentaire est dû à l'acheteur du call ${f(K2, 0)}.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 7. m8-pb-07 — Parité call-put : le prix qui ne discute pas — N2     */
/* ------------------------------------------------------------------ */
const pariteArbitrage: ProblemeMoule = {
  id: 'm8-pb-07', moduleId: M8,
  titre: 'Parité call-put : le prix qui ne se discute pas',
  titreEn: 'Put-call parity: the price that brooks no argument',
  typeDeCas: 'parité et arbitrage',
  typeDeCasEn: 'parity and arbitrage',
  difficulte: 2,
  scenarios: ["L'arbitragiste devant deux écrans qui se contredisent", 'Le desk de Chicago et le put trop généreux', 'La contrôleuse des risques face au prix d\'un courtier'],
  scenariosEn: ['The arbitrageur and two screens that disagree', 'The Chicago desk and the too-generous put', "The risk controller versus a broker's price"],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : strike, taux, maturité, valeur temps, taille de l'anomalie.
    const cfg = ([
      { sym: '€', kMin: 8, kMax: 14, pas: 10, rMin: 2, rMax: 4, T: 0.5, tLbl: '6 mois', tLblEn: '6 months', tvMin: 1, tvMax: 2.5, epsMin: 0.3, epsMax: 0.7, nMin: 5, nMax: 15 },
      { sym: '$', kMin: 3, kMax: 8, pas: 25, rMin: 4, rMax: 6, T: 0.25, tLbl: '3 mois', tLblEn: '3 months', tvMin: 2, tvMax: 5, epsMin: 0.6, epsMax: 1.5, nMin: 10, nMax: 30 },
      { sym: '€', kMin: 10, kMax: 20, pas: 5, rMin: 1.5, rMax: 3.5, T: 1, tLbl: '12 mois', tLblEn: '12 months', tvMin: 1.5, tvMax: 3.5, epsMin: 0.25, epsMax: 0.6, nMin: 2, nMax: 8 },
    ] as const)[sIdx];
    const K = randInt(rng, cfg.kMin, cfg.kMax) * cfg.pas;
    const S = r2(K + randFloat(rng, 0, 0.05, 3) * K);            // spot au strike ou un peu au-dessus
    const r = randFloat(rng, cfg.rMin, cfg.rMax, 1);
    const df = dfContinu(r, cfg.T);
    // Prime du call fabriquée : intrinsèque + valeur temps SUPÉRIEURE au coût de portage
    // du strike, pour garantir un put théorique strictement positif.
    const tv = r2(K * (1 - df) + randFloat(rng, cfg.tvMin, cfg.tvMax, 2));
    const c = r2(payoffCall(S, K) + tv);
    const eps = pick(rng, [1, -1] as const) * randFloat(rng, cfg.epsMin, cfg.epsMax, 2);
    const n = randInt(rng, cfg.nMin, cfg.nMax);
    const kAct = r2(K * df);
    const pTheo = r2(putDepuisParite(c, S, K, r, cfg.T));
    const pMkt = r2(pTheo + eps);
    const ecart = r2(pMkt - pTheo);
    const cherPut = ecart > 0;                                   // le put coté est-il trop cher ?
    const gainTotal = r2(Math.abs(ecart) * QUOTITE * n);
    const gainEcheance = r2((Math.abs(ecart) / df) * QUOTITE * n);

    const { en, f, pct, mnt } = outils(langue);
    const tl = en ? cfg.tLblEn : cfg.tLbl;
    const desc = en
      ? `the stock trades at ${mnt(S, cfg.sym)} (no dividend before expiry); on the ${tl} maturity, the ${f(K, 0)} call quotes ${mnt(c, cfg.sym)}, the ${f(K, 0)} put quotes ${mnt(pMkt, cfg.sym)}, and the risk-free rate is ${pct(r, 1)} (continuous compounding)`
      : `l'action cote ${mnt(S, cfg.sym)} (aucun dividende avant l'échéance) ; sur la maturité ${tl}, le call ${f(K, 0)} se traite à ${mnt(c, cfg.sym)}, le put ${f(K, 0)} à ${mnt(pMkt, cfg.sym)}, et le taux sans risque vaut ${pct(r, 1)} (composition continue)`;
    const contexte = (en
      ? [
        `Late afternoon, and the arbitrageur's two screens refuse to agree: ${desc}. Before pulling the trigger she rebuilds the chain of certainties: the discounted strike, the put price that parity DICTATES, the riskless profit if the market disagrees — and its value at expiry, whatever the stock does.`,
        `On the Chicago desk, the morning sheet flags a put that looks ${cherPut ? 'too rich' : 'suspiciously cheap'} against its call: ${desc}. The junior gets the classic drill: discount the strike, derive the parity price, size the arbitrage on ${f(n, 0)} contracts, and prove the profit is locked to the final fixing.`,
        `A risk controller reviews the valuation a broker sent for an illiquid ${tl} put: ${desc}. No model, no debate — parity only: the present value of the strike, the price the call IMPOSES on the put, the money left on the table, and what it compounds to at expiry.`,
      ]
      : [
        `Fin d'après-midi, et les deux écrans de l'arbitragiste refusent de se mettre d'accord : ${desc}. Avant d'appuyer sur la détente, elle reconstruit la chaîne des certitudes : le strike actualisé, le prix du put que la parité DICTE, le profit sans risque si le marché s'entête — et sa valeur à l'échéance, quoi que fasse l'action.`,
        `Au desk de Chicago, la feuille du matin signale un put qui paraît ${cherPut ? 'trop riche' : 'étrangement bon marché'} face à son call : ${desc}. Le junior hérite de l'exercice classique : actualiser le strike, dériver le prix de parité, dimensionner l'arbitrage sur ${f(n, 0)} contrats, et prouver que le profit est verrouillé jusqu'au fixing final.`,
        `Une contrôleuse des risques examine la valorisation qu'un courtier a envoyée pour un put ${tl} illiquide : ${desc}. Pas de modèle, pas de débat — la parité seule : la valeur actuelle du strike, le prix que le call IMPOSE au put, l'argent laissé sur la table, et ce qu'il devient capitalisé à l'échéance.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The discounted strike' : 'a) Le strike actualisé',
          enonce: en
            ? `What is the present value of the ${f(K, 0)} strike, discounted at ${pct(r, 1)} continuous over ${tl}, in ${cfg.sym}?`
            : `Quelle est la valeur actuelle du strike ${f(K, 0)}, actualisé à ${pct(r, 1)} continu sur ${tl}, en ${cfg.sym} ?`,
          reponse: kAct, tolerance: 0.02, toleranceMode: 'absolu', unite: cfg.sym,
          etapes: [{
            titre: en ? 'K·e^{−rT}: the cash leg of the parity' : 'K·e^{−rT} : la jambe cash de la parité',
            contenu: en
              ? `$K e^{-rT}$ = ${f(K, 0)} × e^(−${f(r, 1)}% × ${f(cfg.T, 2)}) = ${f(K, 0)} × ${f(r4(df), 4)} = **${mnt(kAct, cfg.sym)}**. This is the amount to lend TODAY at the risk-free rate to hold exactly ${f(K, 0)} at expiry — the cash that, added to a call, replicates "put + stock". Continuous compounding: the convention of the option world (chapter 3).`
              : `$K e^{-rT}$ = ${f(K, 0)} × e^(−${f(r, 1)} % × ${f(cfg.T, 2)}) = ${f(K, 0)} × ${f(r4(df), 4)} = **${mnt(kAct, cfg.sym)}**. C'est la somme à placer AUJOURD'HUI au taux sans risque pour détenir exactement ${f(K, 0)} à l'échéance — le cash qui, ajouté à un call, réplique « put + action ». Composition continue : la convention du monde des options (chapitre 3).`,
          }],
        },
        {
          intitule: en ? 'b) The put price that parity dictates' : 'b) Le prix du put que la parité dicte',
          enonce: en
            ? `From the call at ${mnt(c, cfg.sym)} and a), what should the ${f(K, 0)} put be worth, in ${cfg.sym}?`
            : `À partir du call à ${mnt(c, cfg.sym)} et du a), combien le put ${f(K, 0)} devrait-il valoir, en ${cfg.sym} ?`,
          reponse: pTheo, tolerance: 0.02, toleranceMode: 'absolu', unite: cfg.sym,
          etapes: [
            {
              titre: en ? 'C − P = S − K·e^{−rT}, rearranged' : 'C − P = S − K·e^{−rT}, réarrangée',
              contenu: en
                ? `$P = C - S + K e^{-rT}$ = ${f(c, 2)} − ${f(S, 2)} + ${f(kAct, 2)} = **${mnt(pTheo, cfg.sym)}**. No volatility, no model, no opinion: "call + riskless cash" and "put + stock" deliver the SAME payoff at expiry in every state of the world, so they must cost the same today.`
                : `$P = C - S + K e^{-rT}$ = ${f(c, 2)} − ${f(S, 2)} + ${f(kAct, 2)} = **${mnt(pTheo, cfg.sym)}**. Aucune volatilité, aucun modèle, aucune opinion : « call + cash sans risque » et « put + action » versent le MÊME payoff à l'échéance dans tous les états du monde, donc coûtent le même prix aujourd'hui.`,
            },
            {
              titre: en ? 'Parity is an ARBITRAGE relation' : 'La parité est une relation d\'ARBITRAGE',
              contenu: en
                ? `Black-Scholes can be wrong about the world; parity cannot: it needs only "no free lunch" and a European option without dividends. That is why a desk checks parity BEFORE any model — a chain violating it is a cash machine, whatever the true volatility is (chapter 3).`
                : `Black-Scholes peut se tromper sur le monde ; la parité, non : elle n'exige que « pas de repas gratuit » et une option européenne sans dividende. Voilà pourquoi un desk vérifie la parité AVANT tout modèle — une chaîne qui la viole est un distributeur de billets, quelle que soit la vraie volatilité (chapitre 3).`,
            },
          ],
          pieges: [en
            ? `Using the raw strike ${f(K, 0)} instead of the discounted ${f(kAct, 2)}: the strike is paid AT EXPIRY — forgetting the discounting shifts every parity price by ${f(r2(K - kAct), 2)}.`
            : `Utiliser le strike brut ${f(K, 0)} au lieu des ${f(kAct, 2)} actualisés : le strike se paie À L'ÉCHÉANCE — oublier l'actualisation décale tous les prix de parité de ${f(r2(K - kAct), 2)}.`],
        },
        {
          intitule: en ? 'c) The money on the table' : "c) L'argent sur la table",
          enonce: en
            ? `The market quotes the put at ${mnt(pMkt, cfg.sym)}. Exploiting the anomaly on ${f(n, 0)} contract${n > 1 ? 's' : ''} of ${f(QUOTITE, 0)} shares, what riskless profit is locked in TODAY, in ${cfg.sym}?`
            : `Le marché cote le put à ${mnt(pMkt, cfg.sym)}. En exploitant l'anomalie sur ${f(n, 0)} contrat${n > 1 ? 's' : ''} de ${f(QUOTITE, 0)} actions, quel profit sans risque est verrouillé DÈS AUJOURD'HUI, en ${cfg.sym} ?`,
          reponse: gainTotal, tolerance: Math.max(1, gainTotal * 0.01), toleranceMode: 'absolu', unite: cfg.sym,
          etapes: [
            {
              titre: en ? 'The gap, then the size' : "L'écart, puis la taille",
              contenu: en
                ? `Quoted ${f(pMkt, 2)} against a parity price of ${f(pTheo, 2)}: the put is ${cherPut ? 'RICH' : 'CHEAP'} by ${f(r2(Math.abs(ecart)), 2)} per share. On ${f(n, 0)} contract${n > 1 ? 's' : ''}: ${f(r2(Math.abs(ecart)), 2)} × ${f(QUOTITE, 0)} × ${f(n, 0)} = **${mnt(gainTotal, cfg.sym)}**, cashed at initiation.`
                : `Coté ${f(pMkt, 2)} contre un prix de parité de ${f(pTheo, 2)} : le put est ${cherPut ? 'trop CHER' : 'trop BON MARCHÉ'} de ${f(r2(Math.abs(ecart)), 2)} par action. Sur ${f(n, 0)} contrat${n > 1 ? 's' : ''} : ${f(r2(Math.abs(ecart)), 2)} × ${f(QUOTITE, 0)} × ${f(n, 0)} = **${mnt(gainTotal, cfg.sym)}**, encaissés au montage.`,
            },
            {
              titre: en ? 'The trade: sell the expensive side, buy the cheap one' : "Le montage : vendre le côté cher, acheter le côté bon marché",
              contenu: en
                ? `${cherPut
                  ? `Sell the quoted put at ${f(pMkt, 2)} and BUILD the cheap synthetic put: buy the call (−${f(c, 2)}), short the stock (+${f(S, 2)}), lend ${f(kAct, 2)} at the risk-free rate. Net cash today: +${f(r2(Math.abs(ecart)), 2)} per share.`
                  : `Buy the quoted put at ${f(pMkt, 2)} and SELL the expensive synthetic put: sell the call (+${f(c, 2)}), buy the stock (−${f(S, 2)}), borrow ${f(kAct, 2)} at the risk-free rate. Net cash today: +${f(r2(Math.abs(ecart)), 2)} per share.`} At expiry, the option legs and the stock cancel each other exactly, state by state: the profit was made at the SIGNING, not at the fixing.`
                : `${cherPut
                  ? `Vendre le put coté à ${f(pMkt, 2)} et FABRIQUER le put synthétique bon marché : acheter le call (−${f(c, 2)}), vendre l'action à découvert (+${f(S, 2)}), placer ${f(kAct, 2)} au taux sans risque. Cash net aujourd'hui : +${f(r2(Math.abs(ecart)), 2)} par action.`
                  : `Acheter le put coté à ${f(pMkt, 2)} et VENDRE le put synthétique trop cher : vendre le call (+${f(c, 2)}), acheter l'action (−${f(S, 2)}), emprunter ${f(kAct, 2)} au taux sans risque. Cash net aujourd'hui : +${f(r2(Math.abs(ecart)), 2)} par action.`} À l'échéance, les jambes optionnelles et l'action s'annulent exactement, état par état : le profit s'est fait à la SIGNATURE, pas au fixing.`,
            },
          ],
          pieges: [en
            ? `Trading only the mispriced put and "waiting to be right" is a volatility BET, not an arbitrage: without the three replicating legs, the position lives and dies with the stock.`
            : `Ne traiter que le put mal coté et « attendre d'avoir raison » est un PARI de volatilité, pas un arbitrage : sans les trois jambes de réplication, la position vit et meurt avec l'action.`],
        },
        {
          intitule: en ? 'd) The profit, seen from expiry' : "d) Le profit, vu de l'échéance",
          enonce: en
            ? `The locked cash of c) is invested at ${pct(r, 1)} until expiry. What is the profit worth at that date, whatever the final stock price, in ${cfg.sym}?`
            : `Le cash verrouillé du c) est placé à ${pct(r, 1)} jusqu'à l'échéance. Que vaut le profit à cette date, quel que soit le cours final de l'action, en ${cfg.sym} ?`,
          reponse: gainEcheance, tolerance: Math.max(1, gainEcheance * 0.01), toleranceMode: 'absolu', unite: cfg.sym,
          etapes: [{
            titre: en ? 'Divide by the discount factor — and note what is absent' : 'Diviser par le facteur d\'actualisation — et noter l\'absent',
            contenu: en
              ? `${mnt(gainTotal, cfg.sym)} / ${f(r4(df), 4)} = **${mnt(gainEcheance, cfg.sym)}** at expiry. Notice what this number does NOT depend on: the final stock price. Whether the stock doubles or halves, the replication nets to zero and the profit compounds quietly on the money market. One gap of ${f(r2(Math.abs(ecart)), 2)} on one screen, and the machine runs — which is precisely why real chains almost never show it for longer than a blink.`
              : `${mnt(gainTotal, cfg.sym)} / ${f(r4(df), 4)} = **${mnt(gainEcheance, cfg.sym)}** à l'échéance. Remarquez de quoi ce nombre ne dépend PAS : du cours final de l'action. Que le titre double ou s'effondre, la réplication se solde à zéro et le profit capitalise tranquillement sur le monétaire. Un écart de ${f(r2(Math.abs(ecart)), 2)} sur un écran, et la machine tourne — c'est précisément pourquoi les vraies chaînes ne l'affichent presque jamais plus d'un clignement d'œil.`,
          }],
          pieges: [en
            ? `"The profit depends on where the stock finishes" is the reflex to unlearn here: the whole point of the parity trade is that S_T appears in every leg — and cancels out of the sum.`
            : `« Le profit dépend d'où finit l'action » est le réflexe à désapprendre ici : tout l'intérêt du montage de parité est que S_T apparaît dans chaque jambe — et disparaît de la somme.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 8. m8-pb-08 — L'arbre binomial : pricer dans un monde à deux états — N2 */
/* ------------------------------------------------------------------ */
const arbreBinomial: ProblemeMoule = {
  id: 'm8-pb-08', moduleId: M8,
  titre: "L'arbre binomial : pricer dans un monde à deux états",
  titreEn: 'The binomial tree: pricing in a two-state world',
  typeDeCas: 'pricing binomial',
  typeDeCasEn: 'binomial pricing',
  difficulte: 2,
  scenarios: ['Le professeur au tableau : un monde à deux états', 'La structureuse qui price sans modèle continu', "Le candidat à l'oral face à l'arbre du jury"],
  scenariosEn: ['The professor at the board: a two-state world', 'The structurer pricing without a continuous model', "The candidate facing the jury's tree"],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : spot, amplitudes de hausse/baisse (%), taux, maturité, strike.
    const cfg = ([
      { sym: '€', sMin: 8, sMax: 15, pas: 10, hMin: 15, hMax: 30, bMin: 10, bMax: 25, rMin: 2, rMax: 5, T: 1, tLbl: '1 an', tLblEn: '1 year', kPasDiv: 10, kOffMax: 1, nMin: 5, nMax: 15 },
      { sym: '$', sMin: 3, sMax: 9, pas: 25, hMin: 12, hMax: 22, bMin: 8, bMax: 18, rMin: 3, rMax: 7, T: 0.5, tLbl: '6 mois', tLblEn: '6 months', kPasDiv: 25, kOffMax: 0, nMin: 10, nMax: 30 },
      { sym: '€', sMin: 12, sMax: 30, pas: 5, hMin: 18, hMax: 35, bMin: 12, bMax: 28, rMin: 1.5, rMax: 4, T: 1, tLbl: '1 an', tLblEn: '1 year', kPasDiv: 5, kOffMax: 2, nMin: 2, nMax: 8 },
    ] as const)[sIdx];
    const S0 = randInt(rng, cfg.sMin, cfg.sMax) * cfg.pas;
    const h = randInt(rng, cfg.hMin, cfg.hMax);          // hausse en %
    const b = randInt(rng, cfg.bMin, cfg.bMax);          // baisse en %
    const u = 1 + h / 100;
    const d = 1 - b / 100;
    const r = randFloat(rng, cfg.rMin, cfg.rMax, 1);
    const K = S0 + randInt(rng, 0, cfg.kOffMax) * cfg.kPasDiv;   // ATM ou un cran au-dessus
    const n = randInt(rng, cfg.nMin, cfg.nMax);
    const sU = r2(S0 * u);
    const sD = r2(S0 * d);
    const vU = r2(payoffCall(sU, K));
    const vD = r2(payoffCall(sD, K));                    // = 0 : K ≥ S0 > S0·d par construction
    const q = r4(probaRisqueNeutre(u, d, r, cfg.T));
    const prix = r4(valeurBinomiale(vU, vD, u, d, r, cfg.T));
    const deltaRep = r4((vU - vD) / (sU - sD));          // ratio de couverture de l'arbre
    const actions = actionsDeltaHedge(deltaRep, n, QUOTITE);
    const capit = 1 + (r / 100) * cfg.T;                 // capitalisation LINÉAIRE sur la période

    const { en, f, pct, mnt } = outils(langue);
    const tl = en ? cfg.tLblEn : cfg.tLbl;
    const desc = en
      ? `the stock trades at ${mnt(S0, cfg.sym)} and, in ${tl}, can only rise by ${pct(h, 0)} (to ${f(sU, 2)}) or fall by ${pct(b, 0)} (to ${f(sD, 2)}); the riskless rate is ${pct(r, 1)} (linear over the period); the option to price is the ${tl} call of strike ${f(K, 0)}`
      : `l'action cote ${mnt(S0, cfg.sym)} et, dans ${tl}, ne peut que monter de ${pct(h, 0)} (à ${f(sU, 2)}) ou baisser de ${pct(b, 0)} (à ${f(sD, 2)}) ; le taux sans risque vaut ${pct(r, 1)} (linéaire sur la période) ; l'option à pricer est le call ${tl} de strike ${f(K, 0)}`;
    const contexte = (en
      ? [
        `Last lecture before the exam, and the professor draws two branches on the board: ${desc}. "Everything Black-Scholes will do with a thousand branches, this tree does with two. Give me the payoffs, the risk-neutral probability, the price — and the hedge that makes the whole thing bulletproof."`,
        `A structurer must quote a client option on an illiquid stock — no usable vol surface, so she falls back on the tree her first boss taught her: ${desc}. Four numbers to send with the quote: both terminal payoffs, the probability the model MANUFACTURES, the price, and the shares to hold against ${f(n, 0)} sold contracts.`,
        `Oral exam, and the jury slides a hand-drawn tree across the table: ${desc}. "You have four questions and one trap: the payoff up, the probability q — and tell us what it is NOT —, the call price, and the replication that lets you sell ${f(n, 0)} contracts and sleep."`,
      ]
      : [
        `Dernier cours avant l'examen, et le professeur dessine deux branches au tableau : ${desc}. « Tout ce que Black-Scholes fera avec mille branches, cet arbre le fait avec deux. Donnez-moi les payoffs, la probabilité risque-neutre, le prix — et la couverture qui rend l'ensemble inattaquable. »`,
        `Une structureuse doit coter une option client sur un titre illiquide — pas de nappe de vol exploitable, alors elle ressort l'arbre que son premier chef lui a appris : ${desc}. Quatre chiffres à joindre à la cote : les deux payoffs terminaux, la probabilité que le modèle FABRIQUE, le prix, et les actions à détenir contre ${f(n, 0)} contrats vendus.`,
        `Oral de M2, et le jury fait glisser un arbre dessiné à la main : ${desc}. « Quatre questions et un piège : le payoff en haut, la probabilité q — et dites-nous ce qu'elle N'EST PAS —, le prix du call, et la réplication qui vous permet de vendre ${f(n, 0)} contrats et de dormir. »`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The payoffs at the tips of the branches' : 'a) Les payoffs au bout des branches',
          enonce: en
            ? `In the UP state the stock is worth ${mnt(sU, cfg.sym)}. What does the ${f(K, 0)} call pay in that state, per share, in ${cfg.sym}?`
            : `Dans l'état HAUT, l'action vaut ${mnt(sU, cfg.sym)}. Que paie le call ${f(K, 0)} dans cet état, par action, en ${cfg.sym} ?`,
          reponse: vU, tolerance: 0.01, toleranceMode: 'absolu', unite: cfg.sym,
          etapes: [{
            titre: en ? 'Two states, two certainties' : 'Deux états, deux certitudes',
            contenu: en
              ? `Up: max(${f(sU, 2)} − ${f(K, 0)}, 0) = **${mnt(vU, cfg.sym)}**. Down: max(${f(sD, 2)} − ${f(K, 0)}, 0) = ${f(vD, 2)} — the option dies. At the tips of the tree there is no more uncertainty: the option is a known amount in each state. The WHOLE difficulty of pricing has been pushed back to a single question: how to weigh two known futures.`
              : `Haut : max(${f(sU, 2)} − ${f(K, 0)}, 0) = **${mnt(vU, cfg.sym)}**. Bas : max(${f(sD, 2)} − ${f(K, 0)}, 0) = ${f(vD, 2)} — l'option meurt. Au bout de l'arbre, plus aucune incertitude : l'option est un montant connu dans chaque état. TOUTE la difficulté du pricing s'est réduite à une seule question : comment pondérer deux futurs connus.`,
          }],
        },
        {
          intitule: en ? 'b) The manufactured probability' : 'b) La probabilité fabriquée',
          enonce: en
            ? `What is the risk-neutral probability q of the up state (a number between 0 and 1, 4 decimals)?`
            : `Quelle est la probabilité risque-neutre q de l'état haut (nombre entre 0 et 1, 4 décimales) ?`,
          reponse: q, tolerance: 0.005, toleranceMode: 'absolu',
          etapes: [
            {
              titre: en ? 'The weight that makes the stock "fair"' : 'Le poids qui rend l\'action « équitable »',
              contenu: en
                ? `$q = \\frac{(1 + rT) - d}{u - d}$ = (${f(capit, 4)} − ${f(d, 2)}) / (${f(u, 2)} − ${f(d, 2)}) = **${f(q, 4)}**. It is the unique weight under which the stock, discounted, is a fair game: q·${f(sU, 2)} + (1 − q)·${f(sD, 2)} = ${f(r2(S0 * capit), 2)} = ${f(S0, 0)} capitalised. No survey, no history: q comes from u, d and r alone.`
                : `$q = \\frac{(1 + rT) - d}{u - d}$ = (${f(capit, 4)} − ${f(d, 2)}) / (${f(u, 2)} − ${f(d, 2)}) = **${f(q, 4)}**. C'est l'unique poids sous lequel l'action, actualisée, est un jeu équitable : q·${f(sU, 2)} + (1 − q)·${f(sD, 2)} = ${f(r2(S0 * capit), 2)} = ${f(S0, 0)} capitalisé. Aucun sondage, aucun historique : q sort de u, d et r seuls.`,
            },
            {
              titre: en ? 'What q is NOT' : 'Ce que q N\'EST PAS',
              contenu: en
                ? `q is NOT the real probability that the stock rises — nobody knows that one, and the price does not need it. Risk aversion is already inside today's prices; q simply reads it back. That idea — pricing without forecasting — is the deepest one in the module, and the tree exposes it with two branches (chapter 4).`
                : `q N'EST PAS la vraie probabilité de hausse — personne ne la connaît, et le prix n'en a pas besoin. L'aversion au risque est déjà dans les prix d'aujourd'hui ; q ne fait que la relire. Cette idée — pricer sans prévoir — est la plus profonde du module, et l'arbre l'expose avec deux branches (chapitre 4).`,
            },
          ],
          pieges: [en
            ? `Answering "50/50, two states" or hunting for the historical frequency of up moves: q is an arbitrage weight, not a statistic — change r and q changes, with the same stock.`
            : `Répondre « 50/50, deux états » ou chercher la fréquence historique des hausses : q est un poids d'arbitrage, pas une statistique — changez r et q change, avec la même action.`],
        },
        {
          intitule: en ? 'c) The price of the call' : 'c) Le prix du call',
          enonce: en
            ? `What is the ${f(K, 0)} call worth today, per share, in ${cfg.sym}?`
            : `Combien vaut le call ${f(K, 0)} aujourd'hui, par action, en ${cfg.sym} ?`,
          reponse: r2(prix), tolerance: 0.03, toleranceMode: 'absolu', unite: cfg.sym,
          etapes: [{
            titre: en ? 'Risk-neutral expectation, discounted' : 'Espérance risque-neutre, actualisée',
            contenu: en
              ? `$C = \\frac{q V_u + (1 - q) V_d}{1 + rT}$ = (${f(q, 4)} × ${f(vU, 2)} + ${f(r4(1 - q), 4)} × ${f(vD, 2)}) / ${f(capit, 4)} = **${mnt(r2(prix), cfg.sym)}**. Expected payoff under q, brought back one period at the riskless rate — the same two-step recipe Black-Scholes applies at the limit of infinitely many, infinitely small branches (chapter 4).`
              : `$C = \\frac{q V_u + (1 - q) V_d}{1 + rT}$ = (${f(q, 4)} × ${f(vU, 2)} + ${f(r4(1 - q), 4)} × ${f(vD, 2)}) / ${f(capit, 4)} = **${mnt(r2(prix), cfg.sym)}**. Payoff espéré sous q, ramené d'une période au taux sans risque — la même recette en deux temps que Black-Scholes applique à la limite d'une infinité de branches infiniment petites (chapitre 4).`,
          }],
          pieges: [en
            ? `Forgetting to discount: the expectation lives at expiry, the price lives today — dividing by ${f(capit, 4)} is not optional.`
            : `Oublier d'actualiser : l'espérance vit à l'échéance, le prix vit aujourd'hui — diviser par ${f(capit, 4)} n'est pas optionnel.`],
        },
        {
          intitule: en ? `d) Selling ${f(n, 0)} contracts and sleeping` : `d) Vendre ${f(n, 0)} contrats et dormir`,
          enonce: en
            ? `You sell ${f(n, 0)} contract${n > 1 ? 's' : ''} of ${f(QUOTITE, 0)} shares at this price. How many shares must you BUY so that your book is worth the same in both states?`
            : `Vous vendez ${f(n, 0)} contrat${n > 1 ? 's' : ''} de ${f(QUOTITE, 0)} actions à ce prix. Combien d'actions devez-vous ACHETER pour que votre livre vaille la même chose dans les deux états ?`,
          reponse: actions, tolerance: 1, toleranceMode: 'absolu', unite: en ? 'shares' : 'actions',
          etapes: [
            {
              titre: en ? 'The tree\'s hedge ratio' : "Le ratio de couverture de l'arbre",
              contenu: en
                ? `$\\Delta = \\frac{V_u - V_d}{S_u - S_d}$ = (${f(vU, 2)} − ${f(vD, 2)}) / (${f(sU, 2)} − ${f(sD, 2)}) = ${f(deltaRep, 4)}. Holding Δ shares per option sold makes the book INSENSITIVE to the branch: ${f(deltaRep, 4)} × ${f(n, 0)} × ${f(QUOTITE, 0)} ≈ **${f(actions, 0)} ${en ? 'shares' : 'actions'}** (rounded — one only trades whole shares).`
                : `$\\Delta = \\frac{V_u - V_d}{S_u - S_d}$ = (${f(vU, 2)} − ${f(vD, 2)}) / (${f(sU, 2)} − ${f(sD, 2)}) = ${f(deltaRep, 4)}. Détenir Δ actions par option vendue rend le livre INSENSIBLE à la branche : ${f(deltaRep, 4)} × ${f(n, 0)} × ${f(QUOTITE, 0)} ≈ **${f(actions, 0)} actions** (arrondi — on ne traite que des actions entières).`,
            },
            {
              titre: en ? 'Why this LOCKS the price of c)' : 'Pourquoi cela VERROUILLE le prix du c)',
              contenu: en
                ? `Check per option: up, the shares gain ${f(r2(deltaRep * (sU - S0)), 2)} and the sold call costs ${f(vU, 2)} → net ${f(r2(deltaRep * (sU - S0) - vU), 2)} ; down, the shares lose ${f(r2(deltaRep * (sD - S0)), 2)} and the call pays ${f(vD, 2)} → net ${f(r2(deltaRep * (sD - S0) - vD), 2)}. Identical. A riskless book must earn the riskless rate — and forcing that equality is exactly what produced the price of c). The hedge is not an accessory to the model: it IS the model.`
                : `Vérification par option : en haut, les actions gagnent ${f(r2(deltaRep * (sU - S0)), 2)} et le call vendu coûte ${f(vU, 2)} → net ${f(r2(deltaRep * (sU - S0) - vU), 2)} ; en bas, les actions perdent ${f(r2(deltaRep * (sD - S0)), 2)} et le call paie ${f(vD, 2)} → net ${f(r2(deltaRep * (sD - S0) - vD), 2)}. Identique. Un livre sans risque doit rapporter le taux sans risque — et imposer cette égalité est exactement ce qui a produit le prix du c). La couverture n'est pas un accessoire du modèle : elle EST le modèle.`,
            },
          ],
          pieges: [en
            ? `Hedging "one share per option" because the contract covers ${f(QUOTITE, 0)} shares: the call only reacts to ${f(r2(deltaRep * 100), 0)}% of the stock's move here — the ratio is Δ, never 1.`
            : `Se couvrir « une action par option » parce que le contrat porte sur ${f(QUOTITE, 0)} actions : le call ne réagit ici qu'à ${f(r2(deltaRep * 100), 0)} % du mouvement du titre — le ratio est Δ, jamais 1.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 9. m8-pb-09 — La chaîne Black-Scholes : de d1 au put de parité — N2 */
/* ------------------------------------------------------------------ */
const chaineBlackScholes: ProblemeMoule = {
  id: 'm8-pb-09', moduleId: M8,
  titre: 'La chaîne Black-Scholes : de d1 au put, sans sauter de maillon',
  titreEn: 'The Black-Scholes chain: from d1 to the put, link by link',
  typeDeCas: 'pricing Black-Scholes',
  typeDeCasEn: 'Black-Scholes pricing',
  difficulte: 2,
  scenarios: ["Le quant junior qui recalcule le prix de l'écran", 'La salle qui teste la stagiaire, Hull en tête', 'Le desk qui vérifie un prix avant de coter'],
  scenariosEn: ['The junior quant re-deriving the screen price', 'The trading floor testing the intern, Hull in mind', 'The desk double-checking a price before quoting'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : spot, écart au strike, taux, vol, maturité.
    const cfg = ([
      { sym: '€', sMin: 90, sMax: 120, kPas: 5, kOffMin: -1, kOffMax: 1, rMin: 3, rMax: 6, vMin: 18, vMax: 30, T: 1, tLbl: '1 an', tLblEn: '1 year' },
      { sym: '$', sMin: 38, sMax: 55, kPas: 5, kOffMin: -1, kOffMax: 0, rMin: 6, rMax: 10, vMin: 15, vMax: 25, T: 0.5, tLbl: '6 mois', tLblEn: '6 months' },
      { sym: '€', sMin: 180, sMax: 260, kPas: 10, kOffMin: 0, kOffMax: 2, rMin: 1.5, rMax: 4, vMin: 25, vMax: 45, T: 0.25, tLbl: '3 mois', tLblEn: '3 months' },
    ] as const)[sIdx];
    const S = randInt(rng, cfg.sMin, cfg.sMax);
    const K = Math.round(S / cfg.kPas) * cfg.kPas + randInt(rng, cfg.kOffMin, cfg.kOffMax) * cfg.kPas;
    const r = randFloat(rng, cfg.rMin, cfg.rMax, 1);
    const vol = randFloat(rng, cfg.vMin, cfg.vMax, 0);
    const d1 = r4(d1BlackScholes(S, K, r, vol, cfg.T));
    const d2 = r4(d2BlackScholes(S, K, r, vol, cfg.T));
    const nD1 = r4(normaleCdf(d1));
    const nD2 = r4(normaleCdf(d2));
    const df = dfContinu(r, cfg.T);
    const call = r2(blackScholesCall(S, K, r, vol, cfg.T));
    const put = r2(putDepuisParite(call, S, K, r, cfg.T));
    const putDirect = r2(blackScholesPut(S, K, r, vol, cfg.T));
    const deltaC = r4(deltaCall(S, K, r, vol, cfg.T));

    const { en, f, pct, mnt } = outils(langue);
    const tl = en ? cfg.tLblEn : cfg.tLbl;
    const desc = en
      ? `spot ${mnt(S, cfg.sym)}, strike ${f(K, 0)}, riskless rate ${pct(r, 1)} (continuous), implied volatility ${pct(vol, 0)}, maturity ${tl}, no dividend`
      : `spot ${mnt(S, cfg.sym)}, strike ${f(K, 0)}, taux sans risque ${pct(r, 1)} (continu), volatilité implicite ${pct(vol, 0)}, maturité ${tl}, pas de dividende`;
    const contexte = (en
      ? [
        `First week in the quant team, and the rite of passage has not changed since 1973: re-derive the screen price by hand — ${desc}. The head quant wants the FULL chain, link by link: d1, d2, the call, then the put through parity — "anyone can press a button; I want to know you can rebuild the button."`,
        `On the floor, the intern gets the classic textbook drill, Hull-style: ${desc}. Around the desk, they want to see the method more than the numbers: the distance d1, the shifted d2, the price of the call — and the put obtained WITHOUT redoing any of it, by parity alone.`,
        `Before quoting a client, the desk re-checks the pricer's output on a clean example: ${desc}. Protocol: recompute d1 and d2, price the call, then derive the put two ways — parity and direct formula — and verify they collide on the same cent.`,
      ]
      : [
        `Première semaine dans l'équipe quant, et le rite de passage n'a pas changé depuis 1973 : refaire à la main le prix de l'écran — ${desc}. Le chef quant veut la chaîne COMPLÈTE, maillon par maillon : d1, d2, le call, puis le put par la parité — « appuyer sur un bouton, tout le monde sait faire ; je veux savoir que vous savez reconstruire le bouton. »`,
        `En salle, la stagiaire hérite de l'exercice classique des manuels, façon Hull : ${desc}. Autour du desk, on veut voir la méthode plus que les nombres : la distance d1, le d2 décalé, le prix du call — et le put obtenu SANS rien refaire, par la seule parité.`,
        `Avant de coter un client, le desk revérifie la sortie du priceur sur un exemple propre : ${desc}. Protocole : recalculer d1 et d2, pricer le call, puis dériver le put de deux façons — parité et formule directe — et vérifier qu'ils tombent sur le même centime.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: 'a) d1',
          enonce: en
            ? `Compute d1 (4 decimals).`
            : `Calculez d1 (4 décimales).`,
          reponse: d1, tolerance: 0.01, toleranceMode: 'absolu',
          etapes: [{
            titre: en ? 'The distance from spot to strike, in volatility units' : 'La distance du spot au strike, en unités de volatilité',
            contenu: en
              ? `$d_1 = \\frac{\\ln(S/K) + (r + \\sigma^2/2)T}{\\sigma\\sqrt{T}}$ = [ln(${f(S, 0)}/${f(K, 0)}) + (${f(r / 100, 3)} + ${f(vol / 100, 2)}²/2) × ${f(cfg.T, 2)}] / (${f(vol / 100, 2)} × √${f(cfg.T, 2)}) = **${f(d1, 4)}**. Read it as a z-score: how far the (risk-neutral, drifted) stock stands from the strike, measured in standard deviations of the move to expiry. N(d1) = ${f(nD1, 4)} — which is also the DELTA of the call.`
              : `$d_1 = \\frac{\\ln(S/K) + (r + \\sigma^2/2)T}{\\sigma\\sqrt{T}}$ = [ln(${f(S, 0)}/${f(K, 0)}) + (${f(r / 100, 3)} + ${f(vol / 100, 2)}²/2) × ${f(cfg.T, 2)}] / (${f(vol / 100, 2)} × √${f(cfg.T, 2)}) = **${f(d1, 4)}**. Lisez-le comme un z-score : la distance du titre (dérivé risque-neutre compris) au strike, mesurée en écarts-types du mouvement jusqu'à l'échéance. N(d1) = ${f(nD1, 4)} — qui est aussi le DELTA du call.`,
          }],
          pieges: [en
            ? `Feeding percentages straight into the formula: r and σ enter as decimals (${f(r / 100, 3)}, ${f(vol / 100, 2)}) — mixing 5 and 0.05 is the classic exam wreck.`
            : `Injecter des pourcentages bruts dans la formule : r et σ y entrent en décimales (${f(r / 100, 3)}, ${f(vol / 100, 2)}) — mélanger 5 et 0,05 est le naufrage d'examen classique.`],
        },
        {
          intitule: 'b) d2',
          enonce: en
            ? `Deduce d2 from a) (4 decimals).`
            : `Déduisez d2 du a) (4 décimales).`,
          reponse: d2, tolerance: 0.01, toleranceMode: 'absolu',
          etapes: [{
            titre: en ? 'One step down the volatility ladder' : "Un cran plus bas sur l'échelle de volatilité",
            contenu: en
              ? `$d_2 = d_1 - \\sigma\\sqrt{T}$ = ${f(d1, 4)} − ${f(vol / 100, 2)} × √${f(cfg.T, 2)} = **${f(d2, 4)}**. Its meaning is the most quotable line of the module: N(d2) = ${f(nD2, 4)} is the RISK-NEUTRAL probability that the option finishes in the money — the chance the strike actually gets paid.`
              : `$d_2 = d_1 - \\sigma\\sqrt{T}$ = ${f(d1, 4)} − ${f(vol / 100, 2)} × √${f(cfg.T, 2)} = **${f(d2, 4)}**. Son sens est la phrase la plus citable du module : N(d2) = ${f(nD2, 4)} est la probabilité RISQUE-NEUTRE de finir dans la monnaie — la chance que le strike soit réellement payé.`,
          }],
          pieges: [en
            ? `Calling N(d2) "the real probability of exercise": like q in the tree, it lives in the risk-neutral world — the market's pricing weight, not a forecast.`
            : `Appeler N(d2) « la vraie probabilité d'exercice » : comme q dans l'arbre, elle vit dans le monde risque-neutre — un poids de pricing du marché, pas une prévision.`],
        },
        {
          intitule: en ? 'c) The price of the call' : 'c) Le prix du call',
          enonce: en
            ? `Compute the Black-Scholes price of the call, in ${cfg.sym}.`
            : `Calculez le prix Black-Scholes du call, en ${cfg.sym}.`,
          reponse: call, tolerance: 0.05, toleranceMode: 'absolu', unite: cfg.sym,
          etapes: [
            {
              titre: en ? 'Two terms, two stories' : 'Deux termes, deux histoires',
              contenu: en
                ? `$C = S N(d_1) - K e^{-rT} N(d_2)$ = ${f(S, 0)} × ${f(nD1, 4)} − ${f(K, 0)} × ${f(r4(df), 4)} × ${f(nD2, 4)} = **${mnt(call, cfg.sym)}**. Left term: what you expect to HOLD (the stock, weighted by the delta ${f(deltaC, 4)}); right term: what you expect to PAY (the discounted strike, weighted by the probability of paying it).`
                : `$C = S N(d_1) - K e^{-rT} N(d_2)$ = ${f(S, 0)} × ${f(nD1, 4)} − ${f(K, 0)} × ${f(r4(df), 4)} × ${f(nD2, 4)} = **${mnt(call, cfg.sym)}**. Terme de gauche : ce qu'on s'attend à DÉTENIR (l'action, pondérée par le delta ${f(deltaC, 4)}) ; terme de droite : ce qu'on s'attend à PAYER (le strike actualisé, pondéré par la probabilité de le payer).`,
            },
            {
              titre: en ? 'Sanity checks a desk actually runs' : 'Les contrôles de cohérence qu\'un desk fait vraiment',
              contenu: en
                ? `The price must beat the intrinsic value, max(${f(S, 0)} − ${f(K, 0)}, 0) = ${f(r2(payoffCall(S, K)), 2)} — here time value = ${f(r2(call - payoffCall(S, K)), 2)} ; and it must be increasing in σ: at ${pct(vol, 0)} of vol on ${tl}, ${mnt(call, cfg.sym)} is ${f(r2((call / S) * 100), 1)}% of the spot — the right order of magnitude before quoting.`
                : `Le prix doit battre l'intrinsèque, max(${f(S, 0)} − ${f(K, 0)}, 0) = ${f(r2(payoffCall(S, K)), 2)} — ici valeur temps = ${f(r2(call - payoffCall(S, K)), 2)} ; et il doit croître avec σ : à ${pct(vol, 0)} de vol sur ${tl}, ${mnt(call, cfg.sym)} représente ${f(r2((call / S) * 100), 1)} % du spot — le bon ordre de grandeur avant de coter.`,
            },
          ],
        },
        {
          intitule: en ? 'd) The put, without redoing anything' : 'd) Le put, sans rien refaire',
          enonce: en
            ? `Using ONLY the call price of c) and parity, what is the ${f(K, 0)} put worth, in ${cfg.sym}?`
            : `En n'utilisant QUE le prix du call du c) et la parité, combien vaut le put ${f(K, 0)}, en ${cfg.sym} ?`,
          reponse: put, tolerance: 0.05, toleranceMode: 'absolu', unite: cfg.sym,
          etapes: [
            {
              titre: en ? 'Parity as a shortcut' : 'La parité comme raccourci',
              contenu: en
                ? `$P = C - S + K e^{-rT}$ = ${f(call, 2)} − ${f(S, 0)} + ${f(r2(K * df), 2)} = **${mnt(put, cfg.sym)}**. No new d1, no new table lookup: once the call is priced, the put is free — parity does the work.`
                : `$P = C - S + K e^{-rT}$ = ${f(call, 2)} − ${f(S, 0)} + ${f(r2(K * df), 2)} = **${mnt(put, cfg.sym)}**. Pas de nouveau d1, pas de nouvelle table : une fois le call pricé, le put est gratuit — la parité fait le travail.`,
            },
            {
              titre: en ? 'The cross-check that closes the loop' : 'Le recoupement qui ferme la boucle',
              contenu: en
                ? `The direct formula $P = K e^{-rT} N(-d_2) - S N(-d_1)$ gives ${mnt(putDirect, cfg.sym)} — same number, to the rounding. If your two routes disagree, one of your links is broken: THAT is why the chain is computed in this order. Black-Scholes and parity are not two theories; the model is built to respect the arbitrage (chapters 3 and 4).`
                : `La formule directe $P = K e^{-rT} N(-d_2) - S N(-d_1)$ donne ${mnt(putDirect, cfg.sym)} — le même nombre, aux arrondis près. Si vos deux chemins divergent, l'un de vos maillons est cassé : VOILÀ pourquoi la chaîne se calcule dans cet ordre. Black-Scholes et la parité ne sont pas deux théories ; le modèle est construit pour respecter l'arbitrage (chapitres 3 et 4).`,
            },
          ],
          pieges: [en
            ? `Recomputing the put from scratch and flipping a sign in N(−d1)/N(−d2) is the traditional way to lose ten minutes: parity gives the answer in one line, error-proof.`
            : `Recalculer le put de zéro et inverser un signe dans N(−d1)/N(−d2) est la façon traditionnelle de perdre dix minutes : la parité donne la réponse en une ligne, à l'épreuve des signes.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 10. m8-pb-10 — Le book du vendeur : delta, gamma, vega au travail — N2 */
/* ------------------------------------------------------------------ */
const bookVendeur: ProblemeMoule = {
  id: 'm8-pb-10', moduleId: M8,
  titre: 'Le book du vendeur : delta-hedger, puis courir après le gamma',
  titreEn: "The seller's book: delta-hedge, then chase the gamma",
  typeDeCas: 'gestion en grecques',
  typeDeCasEn: 'greeks management',
  difficulte: 2,
  scenarios: ['Le market-maker qui vient de vendre des calls à un client', 'Le desk exotiques et son book court sur une tech', 'La banque qui a vendu la couverture d\'un corporate'],
  scenariosEn: ['The market-maker who just sold calls to a client', 'The exotics desk short a tech name', 'The bank that sold a hedge to a corporate'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : spot, taux, vol, maturité, contrats vendus, choc de spot.
    const cfg = ([
      { sym: '€', sMin: 90, sMax: 130, kPas: 5, rMin: 2, rMax: 4, vMin: 18, vMax: 28, T: 0.5, tLbl: '6 mois', tLblEn: '6 months', nMin: 10, nMax: 30, dsMin: 2, dsMax: 5 },
      { sym: '$', sMin: 150, sMax: 260, kPas: 10, rMin: 3, rMax: 6, vMin: 30, vMax: 50, T: 0.25, tLbl: '3 mois', tLblEn: '3 months', nMin: 20, nMax: 60, dsMin: 5, dsMax: 12 },
      { sym: '€', sMin: 40, sMax: 70, kPas: 2, rMin: 1.5, rMax: 3.5, vMin: 20, vMax: 35, T: 1, tLbl: '12 mois', tLblEn: '12 months', nMin: 5, nMax: 15, dsMin: 1, dsMax: 3 },
    ] as const)[sIdx];
    const S = randInt(rng, cfg.sMin, cfg.sMax);
    const K = Math.round(S / cfg.kPas) * cfg.kPas;       // strike à la monnaie (grille)
    const r = randFloat(rng, cfg.rMin, cfg.rMax, 1);
    const vol = randFloat(rng, cfg.vMin, cfg.vMax, 0);
    const n = randInt(rng, cfg.nMin, cfg.nMax);
    const dS = randFloat(rng, cfg.dsMin, cfg.dsMax, 1);
    const delta0 = r4(deltaCall(S, K, r, vol, cfg.T));
    const actions0 = actionsDeltaHedge(delta0, n, QUOTITE);
    const s1 = r2(S + dS);
    const delta1 = r4(deltaCall(s1, K, r, vol, cfg.T));
    const actions1 = actionsDeltaHedge(delta1, n, QUOTITE);
    const rachat = actions1 - actions0;
    const gamma = r4(gammaOption(S, K, r, vol, cfg.T));
    const rachatGamma = Math.round(gamma * dS * n * QUOTITE); // l'estimation gamma du réajustement
    const vega = r4(vegaOption(S, K, r, vol, cfg.T));
    const pnlVega = r2(-vega * QUOTITE * n);             // +1 point de vol CONTRE le vendeur

    const { en, f, pct, mnt } = outils(langue);
    const tl = en ? cfg.tLblEn : cfg.tLbl;
    const desc = en
      ? `you have just SOLD ${f(n, 0)} contracts (${f(QUOTITE, 0)} shares each) of the ${tl} call, strike ${f(K, 0)}, on a stock at ${mnt(S, cfg.sym)}; rate ${pct(r, 1)}, implied volatility ${pct(vol, 0)}`
      : `vous venez de VENDRE ${f(n, 0)} contrats (${f(QUOTITE, 0)} actions chacun) du call ${tl} de strike ${f(K, 0)}, sur une action à ${mnt(S, cfg.sym)} ; taux ${pct(r, 1)}, volatilité implicite ${pct(vol, 0)}`;
    const contexte = (en
      ? [
        `A client lifted the offer and the market-maker is now short calls he never wanted to keep: ${desc}. Reflex sequence, taught on day one: measure the delta, buy the shares that neutralise it, re-adjust when the stock moves to ${f(s1, 2)} — and know what one point of volatility does to the book while you sleep.`,
        `The exotics desk wakes up short a tech name after a big structured trade: ${desc}. Risk control wants the morning file: delta of the position, the hedge in shares, the rebalancing bill if the stock pops ${f(dS, 1)} — and the vega line, because on this desk the volatility moves faster than the spot.`,
        `A corporate bought calls from its bank to hedge a stock-linked commitment, and the bank now runs the mirror book: ${desc}. The risk memo spells out the whole discipline: the delta to carry, the shares to hold, the chase when the spot climbs to ${f(s1, 2)}, and the cost of a volatility surprise.`,
      ]
      : [
        `Un client a tapé dans l'offre et le market-maker se retrouve vendeur de calls qu'il n'a jamais voulu garder : ${desc}. Séquence réflexe, apprise le premier jour : mesurer le delta, acheter les actions qui le neutralisent, réajuster quand l'action monte à ${f(s1, 2)} — et savoir ce qu'un point de volatilité fait au book pendant qu'on dort.`,
        `Le desk exotiques se réveille vendeur d'une tech après un gros trade structuré : ${desc}. Le contrôle des risques veut le dossier du matin : delta de la position, couverture en actions, facture de réajustement si le titre saute de ${f(dS, 1)} — et la ligne vega, parce que sur ce desk la volatilité bouge plus vite que le spot.`,
        `Un corporate a acheté des calls à sa banque pour couvrir un engagement indexé sur l'action, et la banque porte maintenant le book miroir : ${desc}. La note de risque déroule toute la discipline : le delta à porter, les actions à détenir, la course quand le spot grimpe à ${f(s1, 2)}, et le coût d'une surprise de volatilité.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The delta of the sold call' : 'a) Le delta du call vendu',
          enonce: en
            ? `What is the delta of ONE ${f(K, 0)} call (4 decimals)?`
            : `Quel est le delta d'UN call ${f(K, 0)} (4 décimales) ?`,
          reponse: delta0, tolerance: 0.01, toleranceMode: 'absolu',
          etapes: [{
            titre: en ? 'N(d1), read on the chain' : 'N(d1), lu sur la chaîne',
            contenu: en
              ? `Delta = $N(d_1)$ = **${f(delta0, 4)}**: if the stock gains 1, the call gains ≈ ${f(delta0, 2)}. At the money it hovers just above 0.5 — the option reacts to about half the move. For the SELLER, the sign flips: the book carries −${f(delta0, 4)} per option, it LOSES when the stock rises. Delta is also the equivalent stock position: ${f(n, 0)} sold contracts behave like being short ${f(actions0, 0)} shares (chapter 5).`
              : `Delta = $N(d_1)$ = **${f(delta0, 4)}** : si l'action gagne 1, le call gagne ≈ ${f(delta0, 2)}. À la monnaie, il flotte juste au-dessus de 0,5 — l'option réagit à la moitié du mouvement environ. Pour le VENDEUR, le signe s'inverse : le book porte −${f(delta0, 4)} par option, il PERD quand l'action monte. Le delta est aussi la position action équivalente : ${f(n, 0)} contrats vendus se comportent comme être court de ${f(actions0, 0)} actions (chapitre 5).`,
          }],
        },
        {
          intitule: en ? 'b) The hedge, in whole shares' : 'b) La couverture, en actions entières',
          enonce: en
            ? `How many shares must the desk BUY so that the book no longer reacts to a small move of the stock?`
            : `Combien d'actions le desk doit-il ACHETER pour que le book ne réagisse plus à un petit mouvement de l'action ?`,
          reponse: actions0, tolerance: 2, toleranceMode: 'absolu', unite: en ? 'shares' : 'actions',
          etapes: [{
            titre: en ? 'Delta × contracts × contract size' : 'Delta × contrats × quotité',
            contenu: en
              ? `Shares = ${f(delta0, 4)} × ${f(n, 0)} × ${f(QUOTITE, 0)} ≈ **${f(actions0, 0)} shares** (whole shares only). Bought at ${mnt(S, cfg.sym)}, they gain exactly what the sold calls lose on a small move: the book is delta-NEUTRAL. Neutral, not immune — the delta itself will move, and that is the whole point of c).`
              : `Actions = ${f(delta0, 4)} × ${f(n, 0)} × ${f(QUOTITE, 0)} ≈ **${f(actions0, 0)} actions** (actions entières uniquement). Achetées à ${mnt(S, cfg.sym)}, elles gagnent exactement ce que les calls vendus perdent sur un petit mouvement : le book est delta-NEUTRE. Neutre, pas immunisé — le delta lui-même va bouger, et c'est tout l'enjeu du c).`,
          }],
          pieges: [en
            ? `Hedging the full ${f(n * QUOTITE, 0)} shares of the contracts ("one share per share sold") over-hedges massively: the option only mimics ${f(r2(delta0 * 100), 0)}% of the stock today.`
            : `Couvrir les ${f(n * QUOTITE, 0)} actions pleines des contrats (« une action par action vendue ») sur-couvre massivement : l'option ne mime aujourd'hui que ${f(r2(delta0 * 100), 0)} % du titre.`],
        },
        {
          intitule: en ? `c) The chase: the stock climbs to ${f(s1, 2)}` : `c) La course : l'action grimpe à ${f(s1, 2)}`,
          enonce: en
            ? `The stock rises to ${mnt(s1, cfg.sym)} (same day, same volatility). How many ADDITIONAL shares must be bought to stay delta-neutral?`
            : `L'action monte à ${mnt(s1, cfg.sym)} (même jour, même volatilité). Combien d'actions SUPPLÉMENTAIRES faut-il acheter pour rester delta-neutre ?`,
          reponse: rachat, tolerance: Math.max(3, Math.abs(rachat) * 0.05), toleranceMode: 'absolu', unite: en ? 'shares' : 'actions',
          etapes: [
            {
              titre: en ? 'The delta has moved — the hedge must follow' : 'Le delta a bougé — la couverture doit suivre',
              contenu: en
                ? `At ${f(s1, 2)}, the delta becomes ${f(delta1, 4)}: target = ${f(delta1, 4)} × ${f(n, 0)} × ${f(QUOTITE, 0)} ≈ ${f(actions1, 0)} shares, hence **${f(rachat, 0)}** to buy on top of b). The gamma had announced it: Γ = ${f(gamma, 4)}, so ≈ Γ × ΔS × ${f(n, 0)} × ${f(QUOTITE, 0)} = ${f(rachatGamma, 0)} shares — the convexity measured this morning predicted today's shopping list.`
                : `À ${f(s1, 2)}, le delta devient ${f(delta1, 4)} : cible = ${f(delta1, 4)} × ${f(n, 0)} × ${f(QUOTITE, 0)} ≈ ${f(actions1, 0)} actions, donc **${f(rachat, 0)}** à acheter en plus du b). Le gamma l'avait annoncé : Γ = ${f(gamma, 4)}, soit ≈ Γ × ΔS × ${f(n, 0)} × ${f(QUOTITE, 0)} = ${f(rachatGamma, 0)} actions — la convexité mesurée ce matin prédisait la liste de courses du jour.`,
            },
            {
              titre: en ? 'Short gamma: buy high, sell low, by contract' : 'Court gamma : acheter haut, vendre bas, par contrat',
              contenu: en
                ? `Notice the direction: the stock ROSE and the seller must BUY — dearer than this morning. Had it fallen, he would have to SELL — cheaper. Short gamma means systematically trading WITH the market against yourself; that steady bleed is what the premium collected at the sale is supposed to pay for. The buyer of the calls lives the mirror image: he sells rallies and buys dips, pocket by pocket (chapter 5).`
                : `Notez le sens : l'action a MONTÉ et le vendeur doit ACHETER — plus cher que ce matin. Si elle avait baissé, il devrait VENDRE — moins cher. Être court gamma, c'est traiter systématiquement AVEC le marché contre soi ; ce saignement régulier est ce que la prime encaissée à la vente est censée payer. L'acheteur des calls vit le miroir : il vend les rallyes et achète les creux, poche après poche (chapitre 5).`,
            },
          ],
          pieges: [en
            ? `"The book was delta-neutral, so nothing to do": neutrality is a snapshot, not a state — gamma is precisely the rate at which the snapshot goes stale.`
            : `« Le book était delta-neutre, donc rien à faire » : la neutralité est une photographie, pas un état — le gamma est précisément la vitesse à laquelle la photo se périme.`],
        },
        {
          intitule: en ? 'd) The night risk: one point of volatility' : 'd) Le risque de la nuit : un point de volatilité',
          enonce: en
            ? `Implied volatility jumps from ${pct(vol, 0)} to ${pct(vol + 1, 0)}, spot unchanged. What is the mark-to-market P&L of the sold book, sign included, in ${cfg.sym}?`
            : `La volatilité implicite saute de ${pct(vol, 0)} à ${pct(vol + 1, 0)}, spot inchangé. Quel est le P&L mark-to-market du book vendu, signe compris, en ${cfg.sym} ?`,
          reponse: pnlVega, tolerance: Math.max(1, Math.abs(pnlVega) * 0.02), toleranceMode: 'absolu', unite: cfg.sym,
          etapes: [
            {
              titre: en ? 'Vega, per point, times the block' : 'Le vega, par point, fois le bloc',
              contenu: en
                ? `Vega = ${f(vega, 4)} per share PER POINT of volatility: each call gains ${f(vega, 4)} when σ ticks from ${f(vol, 0)} to ${f(vol + 1, 0)}. The desk is SHORT: P&L = −${f(vega, 4)} × ${f(QUOTITE, 0)} × ${f(n, 0)} = **${mnt(pnlVega, cfg.sym)}**, with the stock NOT having moved an inch.`
                : `Vega = ${f(vega, 4)} par action et PAR POINT de volatilité : chaque call gagne ${f(vega, 4)} quand σ passe de ${f(vol, 0)} à ${f(vol + 1, 0)}. Le desk est COURT : P&L = −${f(vega, 4)} × ${f(QUOTITE, 0)} × ${f(n, 0)} = **${mnt(pnlVega, cfg.sym)}**, sans que l'action ait bougé d'un centimètre.`,
            },
            {
              titre: en ? 'The delta hedge is blind to this' : 'La couverture delta n\'y voit rien',
              contenu: en
                ? `The ${f(actions0, 0)} shares of b) hedge the SPOT, not the volatility: a share has no vega. Selling options is being short volatility, and no quantity of stock repairs that — this line is why option desks quote their risk in vega before anything else, and why a re-mark of the surface can hurt more than a full day of spot (chapters 5 and 6).`
                : `Les ${f(actions0, 0)} actions du b) couvrent le SPOT, pas la volatilité : une action n'a pas de vega. Vendre des options, c'est être court de volatilité, et aucune quantité d'actions ne répare cela — cette ligne est la raison pour laquelle les desks options citent leur risque en vega avant tout le reste, et pourquoi un re-marquage de la nappe peut faire plus mal qu'une pleine journée de spot (chapitres 5 et 6).`,
            },
          ],
          pieges: [en
            ? `"Delta-neutral, therefore riskless" is the module's most expensive shortcut: b) killed the first-order spot risk, and left gamma (c) and vega (d) fully alive.`
            : `« Delta-neutre, donc sans risque » est le raccourci le plus coûteux du module : le b) a tué le risque spot au premier ordre, et laissé le gamma (c) et le vega (d) parfaitement vivants.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* Export du lot 1 — fusionné dans problems.ts par le contrôleur.      */
/* ------------------------------------------------------------------ */
export const problemesLot1: ProblemeMoule[] = [
  premierCall,          // m8-pb-01 · N1
  putProtecteur,        // m8-pb-02 · N1
  lectureChaine,        // m8-pb-03 · N1
  straddleResultats,    // m8-pb-04 · N1
  coveredCall,          // m8-pb-05 · N2
  bullCallSpread,       // m8-pb-06 · N2
  pariteArbitrage,      // m8-pb-07 · N2
  arbreBinomial,        // m8-pb-08 · N2
  chaineBlackScholes,   // m8-pb-09 · N2
  bookVendeur,          // m8-pb-10 · N2
];
