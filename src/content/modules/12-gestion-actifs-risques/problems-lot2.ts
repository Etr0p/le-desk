/**
 * Moules de problèmes multi-étapes du module Gestion d'actifs & risques —
 * LOT 2 : 4 moules N3 (m12-pb-11 à m12-pb-14) et 6 boss N4 narratifs
 * (m12-pb-15 à m12-pb-20), alignés sur les chapitres 1-7 du module
 * (portefeuille, frontière, Sharpe/alpha/IR, VaR et stress, Bâle III, ESG)
 * et ancrés sur les chapitres 3 et 7 du module 11 (LTCM, gilts/LDI 2022,
 * SVB 2023).
 * Chaque moule : 3 scénarios FR + EN, 5-6 sous-questions chaînées (la sortie
 * de a) nourrit b), c)…), corrigés calculés via calculs.ts (m12), deux ponts
 * m11 (financement repo, vente forcée) et un pont m5 (variation de prix par
 * la duration, −D × Δr) — jamais de texte figé.
 * INVARIANT BILINGUE : tous les tirages aléatoires ont lieu AVANT toute
 * branche de langue — même seed + même scénario ⇒ mêmes nombres en français
 * et en anglais.
 * FAITS DE COURS ET D'HISTOIRE : exactement ceux des chapitres — Sharpe
 * 0,3-0,5 pour de l'actions passif, > 1 excellent, > 2 suspect ; LTCM :
 * Sharpe > 4 avant 1998, capital ~4,7 Md$ pour ~125 Md$ d'actifs (levier
 * ~27, variation fatale −3,7 %), −44 % en août 1998, consortium privé de
 * 3,625 Md$ le 23 septembre (aucun argent public), convergences réalisées
 * en 1999 ; VaR : z = 1,65 (95 %) et 2,33 (99 %), année de 252 jours,
 * ~12,6 dépassements attendus par an à 95 %, feux tricolores de Bâle à
 * 99 % (vert ≤ 4, orange 5-9, rouge ≥ 10) ; Bâle III : CET1 ≥ 4,5 % +
 * coussin de conservation 2,5 % + coussins systémiques, banques européennes
 * à 12-15 %, LCR ≥ 100 %, ratio de levier ≥ 3 % (Lehman ~31, soit ~3,2 %) ;
 * gilts 2022 : mini-budget du 23 septembre (~45 Md£), +130 pb en trois
 * séances sur le 30 ans, BoE le 28 septembre — treize jours ouvrés,
 * ~19 Md£, Truss démissionne après 44 jours ; SVB 2023 : duration ~5,7,
 * +425 pb de Fed, ~−16 Md$ de moins-values latentes sur ~140 Md$ de titres,
 * 42 Md$ de retraits le 9 mars, fermée le 10 au matin ; ESG : corrélation
 * 0,4-0,6 entre noteurs (0,99 en crédit), DWS (perquisition mai 2022,
 * démission du CEO, 19 M$ d'amende SEC), ~40 % des encours article 9
 * rétrogradés en article 8 fin 2022.
 * Conventions (en-tête de calculs.ts m12) : pourcentages partout, poids en %
 * (le complément à 100 sur le second actif), ratios sans unité, valeurs en
 * millions, VaR en millions, z explicite, année de 252 jours ; pertes
 * SIGNÉES côté écrans ; FR virgule décimale et espace avant %, EN point
 * décimal.
 */
import { formatNombreLangue } from '../../../engine/answers';
import { mulberry32, randFloat, randInt } from '../../../engine/rng';
import type { Langue, ProblemGenerator } from '../../../engine/types';
import { variationPrixSpreadPct } from '../05-credit/calculs';
import { financementRepo, venteForceePourCash } from '../11-histoire-crises/calculs';
import {
  actifsPonderesRisqueMillions, alphaJensen, lcrPct, perteStressMillions, ratioCet1Pct,
  ratioInformation, ratioSharpe, rendementCapm, rendementPortefeuille2Actifs, varHorizon,
  varParametrique, volatilitePortefeuille2Actifs,
} from './calculs';

/** Un « moule » de problème est un ProblemGenerator de l'engine (alias local). */
export type ProblemeMoule = ProblemGenerator;

const M12 = '12-gestion-actifs-risques';
const r0 = (v: number) => Math.round(v);
const r1 = (v: number) => Math.round(v * 10) / 10;
const r2 = (v: number) => Math.round(v * 100) / 100;

/** Petits formateurs liés à la langue (les tirages sont déjà faits quand on les crée). */
function outils(langue: Langue) {
  const en = langue === 'en';
  const f = (v: number, d = 2) => formatNombreLangue(langue, v, d);
  const pct = (v: number, d = 2) => (en ? `${f(v, d)}%` : `${f(v, d)} %`);
  const pb = (v: number, d = 0) => (en ? `${f(v, d)} bp` : `${f(v, d)} pb`);
  return { en, f, pct, pb };
}

/* ------------------------------------------------------------------ */
/* 11. m12-pb-11 — Le comité d'investissement — N3                     */
/* ------------------------------------------------------------------ */
const comiteInvestissement: ProblemeMoule = {
  id: 'm12-pb-11', moduleId: M12,
  titre: 'Le comité d\'investissement : deux fonds, trois étalons, un classement qui s\'inverse',
  titreEn: 'The investment committee: two funds, three yardsticks, a ranking that flips',
  typeDeCas: 'mesure de performance',
  typeDeCasEn: 'performance measurement',
  difficulte: 3,
  scenarios: ['L\'analyste de la caisse de retraite qui prépare le comité', 'Le consultant en sélection de gérants face aux deux plaquettes', 'L\'oral : « lequel des deux est le meilleur gérant ? »'],
  scenariosEn: ['The pension fund analyst preparing the committee', 'The manager-selection consultant with the two pitchbooks', 'The oral exam: "which of the two is the better manager?"'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const rf = randFloat(rng, 2, 3, 1);
    const prime = randFloat(rng, 5, 7, 1);
    const rm = r1(rf + prime);
    const betaA = randFloat(rng, 1.1, 1.3, 1);
    const volA = randInt(rng, 18, 22);
    const alphaAv = randFloat(rng, 1.5, 2.5, 1);
    const betaB = randFloat(rng, 0.5, 0.7, 1);
    const alphaBv = randFloat(rng, 0.2, 0.6, 1);
    const teA = randFloat(rng, 4, 6, 1);
    const teB = randFloat(rng, 2, 3, 1);
    const ecart = randFloat(rng, 0.1, 0.2, 2);
    const rA = r1(rendementCapm(rf, betaA, prime) + alphaAv);
    const sharpeA = ratioSharpe(rA, rf, volA);
    const volB = r1((betaB * prime + alphaBv) / (sharpeA + ecart));
    const rB = r1(rendementCapm(rf, betaB, prime) + alphaBv);
    const sharpeB = ratioSharpe(rB, rf, volB);
    const alphaA = alphaJensen(rA, rf, betaA, rm);
    const alphaB = alphaJensen(rB, rf, betaB, rm);
    const surperfA = rA - rm;
    const surperfB = rB - rm;
    const irA = ratioInformation(surperfA, teA);
    const irB = ratioInformation(surperfB, teB);
    const repSharpeA = r2(sharpeA);
    const repSharpeB = r2(sharpeB);
    const repAlphaA = r2(alphaA);
    const repAlphaB = r2(alphaB);
    const repIrA = r2(irA);
    const repIrB = r2(irB);

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `fund A, an equity stock-picker: return ${pct(rA, 1)} this year, volatility ${pct(volA, 0)}, beta ${f(betaA, 1)} against the index, tracking error ${pct(teA, 1)}; fund B, a cautious multi-asset fund: return ${pct(rB, 1)}, volatility ${pct(volB, 1)}, beta ${f(betaB, 1)}, tracking error ${pct(teB, 1)}; the year's data: risk-free rate ${pct(rf, 1)}, equity index return ${pct(rm, 1)}; both funds are measured against that same index, per the mandate`
      : `le fonds A, un stock-picker actions : rendement ${pct(rA, 1)} cette année, volatilité ${pct(volA, 0)}, bêta ${f(betaA, 1)} contre l'indice, tracking error ${pct(teA, 1)} ; le fonds B, un fonds patrimonial prudent : rendement ${pct(rB, 1)}, volatilité ${pct(volB, 1)}, bêta ${f(betaB, 1)}, tracking error ${pct(teB, 1)} ; les données de l'année : taux sans risque ${pct(rf, 1)}, rendement de l'indice actions ${pct(rm, 1)} ; les deux fonds sont mesurés contre ce même indice, mandat oblige`;
    const contexte = (en
      ? [
        `Thursday, 4 p.m. The pension fund's investment committee meets Monday, and one line of the agenda hides the whole debate: renew fund A or fund B — only one keeps its allocation. You are the analyst, and the two pitchbooks on your desk each scream victory: A brandishes its return, B its serenity. The file: ${desc}. Chapter 3's rule is your method: never judge a return without a yardstick — and there are three, nested: cash (Sharpe), the market adjusted for beta (alpha), the mandate (information ratio). Run all three. The ranking will not survive the journey intact.`,
        `You are the manager-selection consultant a family office pays precisely so that marketing does not decide. Two funds compete for the same equity mandate: ${desc}. Your client saw fund A's return and has already half-decided. Your job is the chapter 3 checklist: risk-adjust against cash, then against the beta actually taken, then against the benchmark of the mandate — and only then speak. Build the table the client cannot argue with.`,
        `The oral. The examiner lays two lines of numbers side by side: ${desc}. Then: "Sharpe, Jensen's alpha, information ratio — compute all six numbers, and tell me which fund is the better managed. Careful: the answer changes depending on the yardstick, and I want you to tell me why, not just notice it."`,
      ]
      : [
        `Jeudi, 16 h. Le comité d'investissement de la caisse de retraite se réunit lundi, et une ligne de l'ordre du jour cache tout le débat : renouveler le fonds A ou le fonds B — un seul garde son allocation. Vous êtes l'analyste, et les deux plaquettes sur votre bureau crient chacune victoire : A brandit son rendement, B sa sérénité. Le dossier : ${desc}. La règle du chapitre 3 est votre méthode : ne jamais juger un rendement sans étalon — et il y en a trois, emboîtés : le cash (Sharpe), le marché ajusté du bêta (alpha), le mandat (ratio d'information). Déroulez les trois. Le classement ne survivra pas intact au voyage.`,
        `Vous êtes le consultant en sélection de gérants qu'un family office paie précisément pour que le marketing ne décide pas. Deux fonds se disputent le même mandat actions : ${desc}. Votre client a vu le rendement du fonds A et a déjà à moitié décidé. Votre travail est la checklist du chapitre 3 : ajuster du risque contre le cash, puis contre le bêta réellement pris, puis contre le benchmark du mandat — et seulement ensuite parler. Montez le tableau que le client ne pourra pas discuter.`,
        `L'oral. L'examinateur pose deux lignes de nombres côte à côte : ${desc}. Puis : « Sharpe, alpha de Jensen, ratio d'information — calculez les six nombres, et dites-moi lequel des deux fonds est le mieux géré. Attention : la réponse change selon l'étalon, et je veux que vous me disiez pourquoi, pas seulement que vous le remarquiez. »`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) Fund A against cash: the Sharpe ratio' : 'a) Le fonds A contre le cash : le ratio de Sharpe',
          enonce: en
            ? `Fund A returned ${pct(rA, 1)} with a volatility of ${pct(volA, 0)}; cash paid ${pct(rf, 1)}. What is its Sharpe ratio?`
            : `Le fonds A a rendu ${pct(rA, 1)} avec une volatilité de ${pct(volA, 0)} ; le cash payait ${pct(rf, 1)}. Quel est son ratio de Sharpe ?`,
          reponse: repSharpeA, tolerance: 0.03, toleranceMode: 'absolu', unite: '×',
          etapes: [{
            titre: en ? 'The most primitive yardstick' : 'L\'étalon le plus primitif',
            contenu: en
              ? `Sharpe = (${f(rA, 1)} − ${f(rf, 1)}) / ${f(volA, 0)} = **${f(repSharpeA, 2)}**: each point of volatility endured paid ${f(repSharpeA, 2)} points of excess return over cash. Place it on chapter 3's scale — 0.3-0.5 for passive equities over long periods, above 1 excellent, above 2 suspect: fund A sits in the honest zone of a good active equity fund. First yardstick done; two remain, and they ask different questions.`
              : `Sharpe = (${f(rA, 1)} − ${f(rf, 1)}) / ${f(volA, 0)} = **${f(repSharpeA, 2)}** : chaque point de volatilité subie a payé ${f(repSharpeA, 2)} point d'excès de rendement sur le cash. Placez-le sur l'échelle du chapitre 3 — 0,3-0,5 pour de l'actions passif en longue période, au-dessus de 1 excellent, au-dessus de 2 suspect : le fonds A se loge dans la zone honnête d'un bon fonds actions actif. Premier étalon fait ; il en reste deux, et ils posent d'autres questions.`,
          }],
          pieges: [en
            ? `Dividing the RAW return (${f(rA, 1)}/${f(volA, 0)} = ${f(r2(rA / volA), 2)}) forgets that cash was free: the Sharpe rewards the excess OVER ${pct(rf, 1)}, not the return itself.`
            : `Diviser le rendement BRUT (${f(rA, 1)}/${f(volA, 0)} = ${f(r2(rA / volA), 2)}) oublie que le cash était gratuit : le Sharpe rémunère l'excès AU-DESSUS de ${pct(rf, 1)}, pas le rendement lui-même.`],
        },
        {
          intitule: en ? 'b) Fund B against cash' : 'b) Le fonds B contre le cash',
          enonce: en
            ? `Fund B returned ${pct(rB, 1)} with a volatility of ${pct(volB, 1)}. What is its Sharpe ratio — and which fund wins on this first yardstick?`
            : `Le fonds B a rendu ${pct(rB, 1)} avec une volatilité de ${pct(volB, 1)}. Quel est son ratio de Sharpe — et lequel des deux fonds gagne sur ce premier étalon ?`,
          reponse: repSharpeB, tolerance: 0.03, toleranceMode: 'absolu', unite: '×',
          etapes: [{
            titre: en ? 'Less return, better paid risk' : 'Moins de rendement, un risque mieux payé',
            contenu: en
              ? `Sharpe = (${f(rB, 1)} − ${f(rf, 1)}) / ${f(volB, 1)} = **${f(repSharpeB, 2)}** — HIGHER than fund A's ${f(repSharpeA, 2)}, even though B returned ${f(r1(rA - rB), 1)} points less. That is the whole point of risk-adjusting: B took ${f(r1(volA / volB), 1)} times less volatility to earn its excess return. Per unit of risk endured, the quiet fund beats the flashy one. Verdict of yardstick one: fund B. Do not close the file — the next yardstick reverses it.`
              : `Sharpe = (${f(rB, 1)} − ${f(rf, 1)}) / ${f(volB, 1)} = **${f(repSharpeB, 2)}** — PLUS HAUT que les ${f(repSharpeA, 2)} du fonds A, alors que B a rendu ${f(r1(rA - rB), 1)} points de moins. C'est tout l'intérêt de l'ajustement au risque : B a pris ${f(r1(volA / volB), 1)} fois moins de volatilité pour gagner son excès de rendement. Par unité de risque subie, le fonds discret bat le fonds brillant. Verdict de l'étalon un : le fonds B. Ne fermez pas le dossier — l'étalon suivant l'inverse.`,
          }],
          pieges: [en
            ? `Ranking on raw returns (${pct(rA, 1)} > ${pct(rB, 1)}, "A wins") is exactly the client reflex chapter 3 dismantles: a return without its risk is a numerator without a denominator.`
            : `Classer sur les rendements bruts (${pct(rA, 1)} > ${pct(rB, 1)}, « A gagne ») est exactement le réflexe client que le chapitre 3 démonte : un rendement sans son risque est un numérateur sans dénominateur.`],
        },
        {
          intitule: en ? 'c) Fund A against its beta: Jensen\'s alpha' : 'c) Le fonds A contre son bêta : l\'alpha de Jensen',
          enonce: en
            ? `With a beta of ${f(betaA, 1)}, a market at ${pct(rm, 1)} and cash at ${pct(rf, 1)}, what is fund A's Jensen alpha (in %)?`
            : `Avec un bêta de ${f(betaA, 1)}, un marché à ${pct(rm, 1)} et un cash à ${pct(rf, 1)}, quel est l'alpha de Jensen du fonds A (en %) ?`,
          reponse: repAlphaA, tolerance: 0.1, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'What the CAPM demanded first' : 'Ce que le CAPM exigeait d\'abord',
            contenu: en
              ? `The CAPM demanded ${f(rf, 1)} + ${f(betaA, 1)} × (${f(rm, 1)} − ${f(rf, 1)}) = ${pct(r2(rendementCapm(rf, betaA, prime)), 2)}; alpha = ${f(rA, 1)} − ${f(r2(rendementCapm(rf, betaA, prime)), 2)} = **${pct(repAlphaA, 2)}**. Read what the subtraction just did: fund A's beta of ${f(betaA, 1)} is bought amplification, not skill — in a rising market, a riskier portfolio MUST beat the index. Once the beta is paid at CAPM rates, ${pct(repAlphaA, 2)} of genuine selection remains: the rarest and most expensive commodity of the buy-side.`
              : `Le CAPM exigeait ${f(rf, 1)} + ${f(betaA, 1)} × (${f(rm, 1)} − ${f(rf, 1)}) = ${pct(r2(rendementCapm(rf, betaA, prime)), 2)} ; alpha = ${f(rA, 1)} − ${f(r2(rendementCapm(rf, betaA, prime)), 2)} = **${pct(repAlphaA, 2)}**. Lisez ce que la soustraction vient de faire : le bêta de ${f(betaA, 1)} du fonds A est une amplification achetée, pas fabriquée — sur un marché haussier, un portefeuille plus risqué DOIT battre l'indice. Une fois le bêta payé au tarif du CAPM, il reste ${pct(repAlphaA, 2)} de vraie sélection : la denrée la plus rare et la plus chère du buy-side.`,
          }],
          pieges: [en
            ? `"A beat the market by ${f(r2(surperfA), 1)} points, so ${f(r2(surperfA), 1)} points of talent" ignores the beta: part of that gap is just the normal pay of a ${f(betaA, 1)}-beta portfolio in a rising market.`
            : `« A a battu le marché de ${f(r2(surperfA), 1)} points, donc ${f(r2(surperfA), 1)} points de talent » ignore le bêta : une partie de cet écart n'est que la rémunération normale d'un portefeuille de bêta ${f(betaA, 1)} sur un marché haussier.`],
        },
        {
          intitule: en ? 'd) Fund B against its beta: the ranking flips' : 'd) Le fonds B contre son bêta : le classement s\'inverse',
          enonce: en
            ? `Same computation for fund B (beta ${f(betaB, 1)}): what is its Jensen alpha (in %)?`
            : `Même calcul pour le fonds B (bêta ${f(betaB, 1)}) : quel est son alpha de Jensen (en %) ?`,
          reponse: repAlphaB, tolerance: 0.1, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The quiet fund has less to show for itself' : 'Le fonds discret a moins à montrer',
            contenu: en
              ? `The CAPM demanded ${f(rf, 1)} + ${f(betaB, 1)} × ${f(r1(prime), 1)} = ${pct(r2(rendementCapm(rf, betaB, prime)), 2)}; alpha = ${f(rB, 1)} − ${f(r2(rendementCapm(rf, betaB, prime)), 2)} = **${pct(repAlphaB, 2)}** — positive, but ${f(r1(alphaA - alphaB), 1)} points BELOW fund A's. The ranking just flipped: on the Sharpe, B won; on the alpha, A wins. Neither number is wrong — they answer different questions. The Sharpe asks "was the total risk worth leaving cash?"; the alpha asks "is there skill beyond the risk?". B's serenity is mostly a LOW BETA — cheap to replicate with an ETF and a cash pocket; A's excess is mostly SELECTION — the thing you actually pay an active manager for.`
              : `Le CAPM exigeait ${f(rf, 1)} + ${f(betaB, 1)} × ${f(r1(prime), 1)} = ${pct(r2(rendementCapm(rf, betaB, prime)), 2)} ; alpha = ${f(rB, 1)} − ${f(r2(rendementCapm(rf, betaB, prime)), 2)} = **${pct(repAlphaB, 2)}** — positif, mais ${f(r1(alphaA - alphaB), 1)} points SOUS celui du fonds A. Le classement vient de s'inverser : au Sharpe, B gagnait ; à l'alpha, A gagne. Aucun des deux nombres n'est faux — ils répondent à des questions différentes. Le Sharpe demande « le risque total valait-il de quitter le cash ? » ; l'alpha demande « y a-t-il du talent au-delà du risque ? ». La sérénité de B est surtout un BÊTA FAIBLE — réplicable pour trois points de base avec un ETF et une poche de cash ; l'excès de A est surtout de la SÉLECTION — ce pour quoi on paie réellement un gérant actif.`,
          }],
          pieges: [en
            ? `Concluding "B is badly managed" from the smaller alpha overshoots: ${pct(repAlphaB, 2)} after fees is already rare (chapter 3) — the point is that B's PROFILE, not B's skill, did most of its work.`
            : `Conclure « B est mal géré » du plus petit alpha va trop loin : ${pct(repAlphaB, 2)} après frais est déjà rare (chapitre 3) — le point est que le PROFIL de B, pas son talent, a fait l'essentiel de son travail.`],
        },
        {
          intitule: en ? 'e) Fund A against the mandate: the information ratio' : 'e) Le fonds A contre le mandat : le ratio d\'information',
          enonce: en
            ? `Fund A beat the index by ${pct(r2(surperfA), 1)} with a tracking error of ${pct(teA, 1)}. What is its information ratio?`
            : `Le fonds A a battu l'indice de ${pct(r2(surperfA), 1)} avec une tracking error de ${pct(teA, 1)}. Quel est son ratio d'information ?`,
          reponse: repIrA, tolerance: 0.05, toleranceMode: 'absolu', unite: '×',
          etapes: [{
            titre: en ? 'The Sharpe of the active manager' : 'Le Sharpe du gérant actif',
            contenu: en
              ? `IR = ${f(r2(surperfA), 1)} / ${f(teA, 1)} = **${f(repIrA, 2)}**. Same construction as the Sharpe — an excess divided by the risk taken to earn it — but the yardstick is the MANDATE, not cash: the tracking error is the leash the client granted (${pct(teA, 1)}, a classic active-manager budget of 2-6%), and the IR says what each unit of leash returned. Chapter 3's benchmark: above 0.5 sustained over time is already very good. Fund A used its freedom and got paid for it.`
              : `IR = ${f(r2(surperfA), 1)} / ${f(teA, 1)} = **${f(repIrA, 2)}**. Même construction que le Sharpe — un excès divisé par le risque pris pour l'obtenir — mais l'étalon est le MANDAT, pas le cash : la tracking error est la laisse que le client a accordée (${pct(teA, 1)}, un budget classique de gérant actif, 2-6 %), et l'IR dit ce que chaque unité de laisse a rapporté. Le repère du chapitre 3 : plus de 0,5 tenu dans la durée est déjà très bon. Le fonds A a utilisé sa liberté et en a été payé.`,
          }],
          pieges: [en
            ? `Dividing the excess over CASH (${f(r1(rA - rf), 1)}) by the tracking error mixes yardsticks: the IR numerator is the excess over the BENCHMARK (${f(r2(surperfA), 1)}), the mandate's reference.`
            : `Diviser l'excès sur le CASH (${f(r1(rA - rf), 1)}) par la tracking error mélange les étalons : le numérateur de l'IR est l'excès sur le BENCHMARK (${f(r2(surperfA), 1)}), la référence du mandat.`],
        },
        {
          intitule: en ? 'f) Fund B against the mandate: the verdict' : 'f) Le fonds B contre le mandat : le verdict',
          enonce: en
            ? `Fund B finished ${pct(r2(Math.abs(surperfB)), 1)} BELOW the index with a tracking error of ${pct(teB, 1)}. What is its information ratio (signed) — and what do you tell the committee?`
            : `Le fonds B a fini ${pct(r2(Math.abs(surperfB)), 1)} SOUS l'indice avec une tracking error de ${pct(teB, 1)}. Quel est son ratio d'information (signé) — et que dites-vous au comité ?`,
          reponse: repIrB, tolerance: 0.05, toleranceMode: 'absolu', unite: '×',
          etapes: [
            {
              titre: en ? 'Three yardsticks, three verdicts' : 'Trois étalons, trois verdicts',
              contenu: en
                ? `IR = ${f(r2(surperfB), 1)} / ${f(teB, 1)} = **${f(repIrB, 2)}** — negative: against the equity mandate it signed, fund B LOST ground, and every unit of its (small) tracking error was spent losing. The full table: Sharpe ${f(repSharpeB, 2)} vs ${f(repSharpeA, 2)} — B wins; alpha ${pct(repAlphaA, 2)} vs ${pct(repAlphaB, 2)} — A wins; IR ${f(repIrA, 2)} vs ${f(repIrB, 2)} — A wins. The ranking flipped once and stayed flipped.`
                : `IR = ${f(r2(surperfB), 1)} / ${f(teB, 1)} = **${f(repIrB, 2)}** — négatif : contre le mandat actions qu'il a signé, le fonds B a PERDU du terrain, et chaque unité de sa (petite) tracking error a été dépensée à perdre. Le tableau complet : Sharpe ${f(repSharpeB, 2)} contre ${f(repSharpeA, 2)} — B gagne ; alpha ${pct(repAlphaA, 2)} contre ${pct(repAlphaB, 2)} — A gagne ; IR ${f(repIrA, 2)} contre ${f(repIrB, 2)} — A gagne. Le classement s'est inversé une fois et l'est resté.`,
            },
            {
              titre: en ? 'The sentence for the committee' : 'La phrase pour le comité',
              contenu: en
                ? `The argued verdict, in three lines. One: B is the better PORTFOLIO in absolute terms — best Sharpe, each unit of risk better paid. Two: A is the better MANAGER — more alpha once the beta is paid, and a positive IR against the mandate both signed. Three: the committee's question is "which manager do we pay for this equity mandate?" — so the mandate's yardstick rules: fund A. If the committee's real need is less risk, the answer is not hiring B — it is buying the index with a smaller allocation: you do not pay active fees for a beta of ${f(betaB, 1)}.`
                : `Le verdict argumenté, en trois lignes. Un : B est le meilleur PORTEFEUILLE dans l'absolu — meilleur Sharpe, chaque unité de risque mieux payée. Deux : A est le meilleur GÉRANT — plus d'alpha une fois le bêta payé, et un IR positif contre le mandat que les deux ont signé. Trois : la question du comité est « quel gérant payons-nous pour ce mandat actions ? » — donc l'étalon du mandat tranche : le fonds A. Si le vrai besoin du comité est moins de risque, la réponse n'est pas d'embaucher B — c'est d'acheter l'indice avec une allocation plus petite : on ne paie pas des frais de gestion active pour un bêta de ${f(betaB, 1)}.`,
            },
          ],
          pieges: [en
            ? `Announcing a single "best fund" without naming the yardstick is the trap the whole problem builds: the honest answer states WHICH question each ratio answers — and lets the mandate pick.`
            : `Annoncer un seul « meilleur fonds » sans nommer l'étalon est le piège que tout le problème construit : la réponse honnête dit QUELLE question chaque ratio pose — et laisse le mandat trancher.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 12. m12-pb-12 — La frontière en pratique — N3                       */
/* ------------------------------------------------------------------ */
const frontierePratique: ProblemeMoule = {
  id: 'm12-pb-12', moduleId: M12,
  titre: 'La frontière en pratique : trois corrélations, un repas gratuit chiffré',
  titreEn: 'The frontier in practice: three correlations, one quantified free lunch',
  typeDeCas: 'diversification et variance minimale',
  typeDeCasEn: 'diversification and minimum variance',
  difficulte: 3,
  scenarios: ['L\'allocation d\'un family office, premier comité de l\'année', 'La leçon au stagiaire : « pourquoi pas 100 % obligations ? »', 'Le client qui ne croit plus à la diversification'],
  scenariosEn: ['A family office allocation, first committee of the year', 'The lesson to the intern: "why not 100% bonds?"', 'The client who no longer believes in diversification'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const volAct = randInt(rng, 18, 22);
    const volObl = randInt(rng, 10, 12);
    const rAct = randFloat(rng, 7, 9, 1);
    const rObl = randFloat(rng, 2.5, 3.5, 1);
    const w = randInt(rng, 55, 65);
    const rho = randFloat(rng, 0.1, 0.3, 1);
    const rend = rendementPortefeuille2Actifs(w, rAct, rObl);
    const volRho1 = volatilitePortefeuille2Actifs(w, volAct, volObl, 1);
    const volMid = volatilitePortefeuille2Actifs(w, volAct, volObl, rho);
    const volZero = volatilitePortefeuille2Actifs(w, volAct, volObl, 0);
    let wStar = 0;
    let vMin = Number.POSITIVE_INFINITY;
    for (let wi = 0; wi <= 100; wi += 5) {
      const v = volatilitePortefeuille2Actifs(wi, volAct, volObl, rho);
      if (v < vMin) { vMin = v; wStar = wi; }
    }
    const repas = volRho1 - volMid;
    const repRend = r2(rend);
    const repVol1 = r2(volRho1);
    const repVolMid = r2(volMid);
    const repVolZero = r2(volZero);
    const repWStar = wStar;
    const repVMin = r2(vMin);

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `two building blocks: an equity bloc with expected return ${pct(rAct, 1)} and volatility ${pct(volAct, 0)}, a bond bloc with expected return ${pct(rObl, 1)} and volatility ${pct(volObl, 0)}; the proposed allocation is ${pct(w, 0)} equities / ${pct(100 - w, 0)} bonds; the estimated equity-bond correlation is ${f(rho, 1)}, but the committee wants the whole range explored: ρ = 1 (the world where diversification is a myth), ρ = ${f(rho, 1)} (the estimate), ρ = 0 (independence)`
      : `deux briques : une poche actions de rendement espéré ${pct(rAct, 1)} et de volatilité ${pct(volAct, 0)}, une poche obligataire de rendement espéré ${pct(rObl, 1)} et de volatilité ${pct(volObl, 0)} ; l'allocation proposée est ${pct(w, 0)} actions / ${pct(100 - w, 0)} obligations ; la corrélation actions-obligations estimée est ${f(rho, 1)}, mais le comité veut explorer toute la gamme : ρ = 1 (le monde où la diversification est un mythe), ρ = ${f(rho, 1)} (l'estimation), ρ = 0 (l'indépendance)`;
    const contexte = (en
      ? [
        `Monday, 9 a.m., the family office's first committee of the year. The patriarch has one question — "how much risk am I taking?" — and a healthy suspicion of anything that sounds like theory. Your job: make Markowitz concrete, number by number. The file: ${desc}. Chapter 1's promise is precise: the return averages, the risk does not — and the gap between the two IS the only free lunch in finance. Quantify the lunch. Then push further than the committee asked: find the weight that minimises the risk entirely, and show them something no intuition predicts.`,
        `Tuesday, 2 p.m. The intern watches the screen and asks the honest question: "if the client hates risk, why not 100% bonds?". You could answer with a sentence; the desk answers with a computation. The data: ${desc}. Walk the intern through the whole chapter 1 mechanics: the linear return, the volatility at three correlations, the sweep that finds the minimum-variance weight — and the punchline that ADDING the riskier asset can REDUCE the portfolio's risk.`,
        `Thursday. The client on the phone is bitter: "in the last crisis everything fell together — your diversification is a fair-weather story". He is half right, and chapter 1 says exactly which half: correlations rise toward 1 in crises, and the free lunch shrinks precisely when you need it. Before conceding anything, quantify what the lunch is worth in normal times: ${desc}. Then you can have the honest conversation: what ρ = ${f(rho, 1)} buys, what ρ = 1 takes away, and what weight would minimise the damage.`,
      ]
      : [
        `Lundi, 9 h, premier comité de l'année du family office. Le patriarche a une seule question — « combien de risque est-ce que je prends ? » — et une saine méfiance pour tout ce qui ressemble à de la théorie. Votre travail : rendre Markowitz concret, nombre par nombre. Le dossier : ${desc}. La promesse du chapitre 1 est précise : le rendement se moyenne, le risque non — et l'écart entre les deux EST le seul repas gratuit de la finance. Chiffrez le repas. Puis poussez plus loin que le comité ne demande : trouvez le poids qui minimise entièrement le risque, et montrez-leur quelque chose qu'aucune intuition ne prédit.`,
        `Mardi, 14 h. Le stagiaire regarde l'écran et pose la question honnête : « si le client déteste le risque, pourquoi pas 100 % obligations ? ». Vous pourriez répondre par une phrase ; le desk répond par un calcul. Les données : ${desc}. Déroulez pour lui toute la mécanique du chapitre 1 : le rendement linéaire, la volatilité à trois corrélations, le balayage qui trouve le poids de variance minimale — et la chute : AJOUTER l'actif le plus risqué peut RÉDUIRE le risque du portefeuille.`,
        `Jeudi. Le client au téléphone est amer : « à la dernière crise, tout a baissé ensemble — votre diversification est une histoire de beau temps ». Il a à moitié raison, et le chapitre 1 dit exactement quelle moitié : les corrélations montent vers 1 dans les crises, et le repas gratuit rétrécit précisément quand on en a besoin. Avant de concéder quoi que ce soit, chiffrez ce que le repas vaut par temps normal : ${desc}. Ensuite vous pourrez avoir la conversation honnête : ce que ρ = ${f(rho, 1)} achète, ce que ρ = 1 retire, et quel poids minimiserait les dégâts.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The return: the easy half' : 'a) Le rendement : la moitié facile',
          enonce: en
            ? `What is the expected return (in %) of the ${pct(w, 0)}/${pct(100 - w, 0)} portfolio?`
            : `Quel est le rendement espéré (en %) du portefeuille ${pct(w, 0)}/${pct(100 - w, 0)} ?`,
          reponse: repRend, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The return averages, full stop' : 'Le rendement se moyenne, point',
            contenu: en
              ? `r = ${f(w, 0)}% × ${f(rAct, 1)} + ${f(100 - w, 0)}% × ${f(rObl, 1)} = **${pct(repRend, 2)}**. Linear, no surprise, no magic — and hold that sentence, because the whole module lives in its contrast with the next one: diversification costs NOTHING in expected return. Whatever happens to the risk in the following questions, this number never moves.`
              : `r = ${f(w, 0)} % × ${f(rAct, 1)} + ${f(100 - w, 0)} % × ${f(rObl, 1)} = **${pct(repRend, 2)}**. Linéaire, sans surprise, sans magie — et gardez cette phrase, car tout le module vit dans son contraste avec la suivante : diversifier ne coûte RIEN en rendement espéré. Quoi qu'il arrive au risque dans les questions suivantes, ce nombre ne bougera pas.`,
          }],
          pieges: [en
            ? `Weighting by anything else (50/50, or by volatilities) forgets that expected return follows the CAPITAL weights: ${pct(w, 0)} of the money earns ${pct(rAct, 1)}.`
            : `Pondérer par autre chose (50/50, ou par les volatilités) oublie que le rendement espéré suit les poids du CAPITAL : ${pct(w, 0)} de l'argent gagne ${pct(rAct, 1)}.`],
        },
        {
          intitule: en ? 'b) ρ = 1: the world without a lunch' : 'b) ρ = 1 : le monde sans repas',
          enonce: en
            ? `At ρ = 1, what is the portfolio's volatility (in %)?`
            : `À ρ = 1, quelle est la volatilité du portefeuille (en %) ?`,
          reponse: repVol1, tolerance: 0.1, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Two assets, one asset in disguise' : 'Deux actifs, un seul actif déguisé',
            contenu: en
              ? `At ρ = 1 the square root closes onto the weighted average: σ = ${f(w, 0)}% × ${f(volAct, 0)} + ${f(100 - w, 0)}% × ${f(volObl, 0)} = **${pct(repVol1, 2)}** — not a basis point less. Two perfectly correlated assets are ONE asset in disguise: stacking them diversifies nothing. This is the benchmark number for the whole problem: everything the next questions shave off this ${pct(repVol1, 2)} is the free lunch, and it all comes from ρ < 1.`
              : `À ρ = 1, la racine se referme sur la moyenne pondérée : σ = ${f(w, 0)} % × ${f(volAct, 0)} + ${f(100 - w, 0)} % × ${f(volObl, 0)} = **${pct(repVol1, 2)}** — pas un point de base de moins. Deux actifs parfaitement corrélés sont UN SEUL actif déguisé : les empiler ne diversifie rien. C'est le nombre-étalon de tout le problème : tout ce que les questions suivantes raboteront sous ces ${pct(repVol1, 2)} est le repas gratuit, et tout vient de ρ < 1.`,
          }],
          pieges: [en
            ? `Believing diversification comes from the NUMBER of lines: at ρ = 1, two lines or two hundred change nothing — it is the correlation between them that diversifies.`
            : `Croire que la diversification vient du NOMBRE de lignes : à ρ = 1, deux lignes ou deux cents ne changent rien — c'est la corrélation entre elles qui diversifie.`],
        },
        {
          intitule: en ? `c) ρ = ${f(rho, 1)}: the lunch, quantified` : `c) ρ = ${f(rho, 1)} : le repas, chiffré`,
          enonce: en
            ? `At the estimated correlation ρ = ${f(rho, 1)}, what is the portfolio's volatility (in %)?`
            : `À la corrélation estimée ρ = ${f(rho, 1)}, quelle est la volatilité du portefeuille (en %) ?`,
          reponse: repVolMid, tolerance: 0.1, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Three terms under the root, one that matters' : 'Trois termes sous la racine, un seul qui compte',
            contenu: en
              ? `σ² = (${f(w / 100, 2)})² × ${f(volAct, 0)}² + (${f((100 - w) / 100, 2)})² × ${f(volObl, 0)}² + 2 × ${f(w / 100, 2)} × ${f((100 - w) / 100, 2)} × ${f(rho, 1)} × ${f(volAct, 0)} × ${f(volObl, 0)}, so σ = **${pct(repVolMid, 2)}** — against ${pct(repVol1, 2)} at ρ = 1: **${f(r2(repas), 2)} points of volatility vanished**, while question a)'s return did not move by a cent. That gap is the free lunch, and it lives entirely in the cross term, the only one where ρ appears. Same return, less risk, by pure assembly: that is the buy-side's founding trade.`
              : `σ² = (${f(w / 100, 2)})² × ${f(volAct, 0)}² + (${f((100 - w) / 100, 2)})² × ${f(volObl, 0)}² + 2 × ${f(w / 100, 2)} × ${f((100 - w) / 100, 2)} × ${f(rho, 1)} × ${f(volAct, 0)} × ${f(volObl, 0)}, d'où σ = **${pct(repVolMid, 2)}** — contre ${pct(repVol1, 2)} à ρ = 1 : **${f(r2(repas), 2)} points de volatilité ont disparu**, pendant que le rendement de la question a) ne bougeait pas d'un centime. Cet écart est le repas gratuit, et il vit entièrement dans le terme croisé, le seul où ρ apparaît. Même rendement, moins de risque, par pur assemblage : c'est le trade fondateur du buy-side.`,
          }],
          pieges: [en
            ? `Averaging the volatilities (${pct(repVol1, 2)}) at ρ = ${f(rho, 1)} is THE error of the module: the risk only averages at ρ = 1 — below, the root comes out under the average.`
            : `Moyenner les volatilités (${pct(repVol1, 2)}) à ρ = ${f(rho, 1)} est L'ERREUR du module : le risque ne se moyenne qu'à ρ = 1 — en dessous, la racine sort sous la moyenne.`],
        },
        {
          intitule: en ? 'd) ρ = 0: independence' : 'd) ρ = 0 : l\'indépendance',
          enonce: en
            ? `At ρ = 0, what is the portfolio's volatility (in %)?`
            : `À ρ = 0, quelle est la volatilité du portefeuille (en %) ?`,
          reponse: repVolZero, tolerance: 0.1, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The cross term dies, the lunch grows' : 'Le terme croisé meurt, le repas grandit',
            contenu: en
              ? `At ρ = 0 the cross term vanishes: σ = √((${f(w / 100, 2)})² × ${f(volAct, 0)}² + (${f((100 - w) / 100, 2)})² × ${f(volObl, 0)}²) = **${pct(repVolZero, 2)}**. The staircase is now visible: ${pct(repVol1, 2)} at ρ = 1, ${pct(repVolMid, 2)} at ρ = ${f(rho, 1)}, ${pct(repVolZero, 2)} at ρ = 0 — every step down in correlation is risk removed for free. And the module 11 warning belongs here: crises push ρ UP this staircase, toward 1 — the lunch is a fair-weather meal, which is exactly why stress tests exist (chapter 5).`
              : `À ρ = 0, le terme croisé disparaît : σ = √((${f(w / 100, 2)})² × ${f(volAct, 0)}² + (${f((100 - w) / 100, 2)})² × ${f(volObl, 0)}²) = **${pct(repVolZero, 2)}**. L'escalier est maintenant visible : ${pct(repVol1, 2)} à ρ = 1, ${pct(repVolMid, 2)} à ρ = ${f(rho, 1)}, ${pct(repVolZero, 2)} à ρ = 0 — chaque marche de corrélation en moins est du risque retiré gratuitement. Et l'avertissement du module 11 se place ici : les crises font REMONTER ρ le long de cet escalier, vers 1 — le repas est un repas de beau temps, et c'est exactement pourquoi les stress tests existent (chapitre 5).`,
          }],
          pieges: [en
            ? `Expecting ρ = 0 to erase the risk confuses independence with hedging: only ρ = −1 allows a zero-volatility combination — at ρ = 0, the specific risks dilute, they do not cancel.`
            : `Attendre de ρ = 0 qu'il efface le risque confond indépendance et couverture : seul ρ = −1 permet une combinaison à volatilité nulle — à ρ = 0, les risques se diluent, ils ne s'annulent pas.`],
        },
        {
          intitule: en ? 'e) The sweep: the minimum-variance weight' : 'e) Le balayage : le poids de variance minimale',
          enonce: en
            ? `Sweep the equity weight from 0 to 100% in steps of 5, at ρ = ${f(rho, 1)}, and recompute the volatility at each step. Which equity weight (in %) minimises the portfolio's volatility?`
            : `Balayez le poids actions de 0 à 100 % par pas de 5, à ρ = ${f(rho, 1)}, en recalculant la volatilité à chaque pas. Quel poids actions (en %) minimise la volatilité du portefeuille ?`,
          reponse: repWStar, tolerance: 5, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Walking down the frontier' : 'Descendre le long de la frontière',
            contenu: en
              ? `Feed the formula weight by weight: at 0% equities, σ = ${pct(volObl, 0)}; the volatility first FALLS as equities enter, bottoms out around **${pct(repWStar, 0)} equities** (σ = ${pct(repVMin, 2)}), then climbs toward ${pct(volAct, 0)} at 100%. You have just drawn chapter 2's frontier point by point: the left tip of the bullet is the minimum-variance portfolio, and every weight below ${pct(repWStar, 0)} equities is DOMINATED — less return AND more risk than the minimum. The sweep is crude on purpose; the geometry it reveals is the whole of Markowitz.`
              : `Passez les poids un à un dans la formule : à 0 % d'actions, σ = ${pct(volObl, 0)} ; la volatilité BAISSE d'abord quand les actions entrent, touche son creux vers **${pct(repWStar, 0)} d'actions** (σ = ${pct(repVMin, 2)}), puis remonte vers ${pct(volAct, 0)} à 100 %. Vous venez de dessiner point par point la frontière du chapitre 2 : la pointe gauche de la balle est le portefeuille de variance minimale, et tout poids sous ${pct(repWStar, 0)} d'actions est DOMINÉ — moins de rendement ET plus de risque que le minimum. Le balayage est fruste exprès ; la géométrie qu'il révèle est tout Markowitz.`,
          }],
          pieges: [en
            ? `Assuming the minimum risk is at 0% equities ("the least risky asset alone") is precisely what the sweep refutes: the first equity slices REDUCE the total risk, because their correlation with bonds is low.`
            : `Supposer que le risque minimal est à 0 % d'actions (« l'actif le moins risqué tout seul ») est précisément ce que le balayage réfute : les premières tranches d'actions RÉDUISENT le risque total, parce que leur corrélation aux obligations est basse.`],
        },
        {
          intitule: en ? 'f) Less risky than the least risky asset' : 'f) Moins risqué que l\'actif le moins risqué',
          enonce: en
            ? `What is the portfolio's volatility (in %) at that minimum-variance weight of ${pct(repWStar, 0)} equities?`
            : `Quelle est la volatilité du portefeuille (en %) à ce poids de variance minimale de ${pct(repWStar, 0)} d'actions ?`,
          reponse: repVMin, tolerance: 0.1, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'The number no intuition predicts' : 'Le nombre qu\'aucune intuition ne prédit',
              contenu: en
                ? `σ(${f(repWStar, 0)}%) = **${pct(repVMin, 2)}** — BELOW the ${pct(volObl, 0)} of bonds alone. Read that again: adding ${pct(repWStar, 0)} of an asset twice as volatile has made the whole LESS risky than the safest component. No stock-picking, no forecast, no talent — only a correlation of ${f(rho, 1)} doing the work. This is the cleanest demonstration in finance that risk is a property of the ASSEMBLY, not of the pieces.`
                : `σ(${f(repWStar, 0)} %) = **${pct(repVMin, 2)}** — SOUS les ${pct(volObl, 0)} des obligations seules. Relisez : ajouter ${pct(repWStar, 0)} d'un actif deux fois plus volatil a rendu l'ensemble MOINS risqué que le composant le plus sûr. Aucun stock-picking, aucune prévision, aucun talent — seulement une corrélation de ${f(rho, 1)} qui fait le travail. C'est la démonstration la plus propre de la finance que le risque est une propriété de l'ASSEMBLAGE, pas des pièces.`,
            },
            {
              titre: en ? 'The oral takeaway' : 'La phrase pour l\'oral',
              contenu: en
                ? `Three lines for the committee. One: the return averages, the risk does not — the gap (${f(r2(repas), 2)} points here) is the only free lunch in finance. Two: the lunch lives in the cross term — it is correlation, not line count, that diversifies. Three: the lunch is fair-weather — crises push ρ toward 1 (module 11), so the allocation that protects in a storm is a question for stress tests, not for the frontier.`
                : `Trois lignes pour le comité. Un : le rendement se moyenne, le risque non — l'écart (${f(r2(repas), 2)} points ici) est le seul repas gratuit de la finance. Deux : le repas vit dans le terme croisé — c'est la corrélation, pas le nombre de lignes, qui diversifie. Trois : le repas est de beau temps — les crises poussent ρ vers 1 (module 11), donc l'allocation qui protège dans la tempête est une question de stress test, pas de frontière.`,
            },
          ],
          pieges: [en
            ? `Announcing "impossible, a portfolio cannot be less volatile than its safest asset" is intuition against algebra: with ρ低 enough (ρ < σ_bonds/σ_equities), the cross term makes it not only possible but automatic.`
            : `Annoncer « impossible, un portefeuille ne peut pas être moins volatil que son actif le plus sûr » oppose l'intuition à l'algèbre : avec un ρ assez bas (ρ < σ_obl/σ_act), le terme croisé le rend non seulement possible mais automatique.`],
        },
      ],
    };
  },
};

// __SUITE__
