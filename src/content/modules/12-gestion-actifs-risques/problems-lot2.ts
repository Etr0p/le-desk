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

/* ------------------------------------------------------------------ */
/* 13. m12-pb-13 — Le rapport VaR du desk — N3                         */
/* ------------------------------------------------------------------ */
const rapportVar: ProblemeMoule = {
  id: 'm12-pb-13', moduleId: M12,
  titre: 'Le rapport VaR du desk : 16 h 15, un chiffre — et tout ce qu\'il ne dit pas',
  titreEn: 'The desk\'s VaR report: 4:15 p.m., one number — and everything it does not say',
  typeDeCas: 'VaR, horizon et backtesting',
  typeDeCasEn: 'VaR, horizon and backtesting',
  difficulte: 3,
  scenarios: ['Le nouveau risk manager qui rédige le rapport de 16 h 15', 'Le comité des risques après une année agitée', 'L\'oral : « votre VaR a été dépassée hier, votre modèle est-il faux ? »'],
  scenariosEn: ['The new risk manager drafting the 4:15 p.m. report', 'The risk committee after a rough year', 'The oral exam: "your VaR was exceeded yesterday — is your model wrong?"'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const valeur = randInt(rng, 80, 150);
    const vol = randInt(rng, 15, 25);
    const depObs = randInt(rng, 5, 9);
    const kJour = randFloat(rng, 2.5, 4, 1);
    const var95 = varParametrique(valeur, vol, 1.65, 1);
    const var99 = varParametrique(valeur, vol, 2.33, 1);
    const var99h10 = varHorizon(var99, 10);
    const perteJour = -kJour * var95;
    const repVar95 = r2(var95);
    const repVar99 = r2(var99);
    const repVar10 = r2(var99h10);
    const repAtt95 = 12.6;
    const repAtt99 = 2.52;
    const repPerteJour = r2(perteJour);
    const varAnnuelle = r2(valeur * 1.65 * vol / 100);

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `the desk's portfolio is worth €${f(valeur, 0)}m for an annual volatility of ${pct(vol, 0)}; house conventions: parametric VaR, z = 1.65 at 95% and 2.33 at 99%, a 252-trading-day year; at last year's backtest, the 99% VaR was exceeded ${f(depObs, 0)} times, and the worst day cost ${f(kJour, 1)} times the 95% VaR`
      : `le portefeuille du desk vaut ${f(valeur, 0)} M€ pour une volatilité annuelle de ${pct(vol, 0)} ; les conventions de la maison : VaR paramétrique, z = 1,65 à 95 % et 2,33 à 99 %, année de 252 jours de bourse ; au backtest de l'an dernier, la VaR 99 % a été dépassée ${f(depObs, 0)} fois, et le pire jour a coûté ${f(kJour, 1)} fois la VaR 95 %`;
    const contexte = (en
      ? [
        `Monday, 3:40 p.m. You are the equity desk's new risk manager, and at 4:15 p.m. — the hour Dennis Weatherstone imposed at JPMorgan in 1994 and every trading floor has copied since — a single number must leave for management: the VaR. The file: ${desc}. Your predecessor sent the number without reading it; you will do better: compute it at both confidence levels, extend it to ten days, count the exceedances it promises — and write at the bottom of the page what the number does not say. That last line is what makes a good report.`,
        `Thursday, the quarterly risk committee. The year was rough, and the CRO opens with the ritual question: "does the model hold?". On the table: ${desc}. Before judging, recount everything: the VaR at both thresholds, the ten-day extension, the number of exceedances theory predicts — then confront the backtest and place the desk on Basel's traffic lights. The verdict is neither "the model is right" nor "the model is wrong": it is a colour, and the colour has a price in capital.`,
        `The oral. The examiner needs only one line: ${desc}. Then he unrolls the questions in the order candidates fall: "compute the VaR at both levels, scale it to ten days, tell me how many exceedances are normal in a year — and explain why your desk, exceeded ${f(depObs, 0)} times at 99%, is perhaps not lying to you." The trap is not in the arithmetic: it is in the reading.`,
      ]
      : [
        `Lundi, 15 h 40. Vous êtes le nouveau risk manager du desk actions, et à 16 h 15 — l'heure que Dennis Weatherstone a imposée chez JPMorgan en 1994 et que toutes les salles ont copiée depuis — un chiffre unique doit partir vers la direction : la VaR. Le dossier : ${desc}. Votre prédécesseur envoyait le chiffre sans le lire ; vous allez faire mieux : le calculer aux deux seuils, l'étendre à dix jours, compter les dépassements qu'il promet — et écrire en bas de page ce que le chiffre ne dit pas. C'est cette dernière ligne qui fait les bons rapports.`,
        `Jeudi, comité des risques trimestriel. L'année a été agitée, et le directeur des risques ouvre la séance par la question rituelle : « le modèle tient-il ? ». Sur la table : ${desc}. Avant de juger, il faut tout recompter : la VaR aux deux seuils, l'extension à dix jours, le nombre de dépassements que la théorie prévoit — puis confronter le backtest et placer le desk sur les feux tricolores de Bâle. Le verdict n'est ni « le modèle est bon » ni « le modèle est faux » : c'est une couleur, et la couleur a un prix en capital.`,
        `L'oral. L'examinateur n'a besoin que d'une ligne : ${desc}. Puis il déroule les questions dans l'ordre où les candidats tombent : « calculez la VaR aux deux seuils, passez-la à dix jours, dites-moi combien de dépassements sont normaux sur un an — et expliquez-moi pourquoi votre desk, dépassé ${f(depObs, 0)} fois à 99 %, n'est peut-être pas en train de vous mentir. » Le piège n'est pas dans l'arithmétique : il est dans la lecture.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The one-day 95% VaR' : 'a) La VaR 95 % à un jour',
          enonce: en
            ? `Portfolio of €${f(valeur, 0)}m, annual volatility ${pct(vol, 0)}, z = 1.65, 252-day year. What is the one-day 95% VaR (in €m)?`
            : `Portefeuille de ${f(valeur, 0)} M€, volatilité annuelle ${pct(vol, 0)}, z = 1,65, année de 252 jours. Quelle est la VaR 95 % à 1 jour (en M€) ?`,
          reponse: repVar95, tolerance: 0.05, toleranceMode: 'absolu', unite: 'M€',
          etapes: [{
            titre: en ? 'The back-of-the-envelope formula' : 'La formule de coin de table',
            contenu: en
              ? `VaR = ${f(valeur, 0)} × 1.65 × ${f(vol, 0)}% × √(1/252) = **€${f(repVar95, 2)}m**. Regulatory reading: "we should not lose more than €${f(repVar95, 2)}m in one day, 19 trading days out of 20". This is the 4:15 p.m. number RiskMetrics invented in 1994: a threshold, a confidence level, a horizon — three management decisions, not three constants. And note right now what the number is NOT: a maximum loss. The VaR says where the tail begins, never what is inside it.`
              : `VaR = ${f(valeur, 0)} × 1,65 × ${f(vol, 0)} % × √(1/252) = **${f(repVar95, 2)} M€**. Lecture réglementaire : « on ne devrait pas perdre plus de ${f(repVar95, 2)} M€ en une journée, 19 jours de bourse sur 20 ». C'est le chiffre de 16 h 15 inventé par RiskMetrics en 1994 : un seuil, un niveau de confiance, un horizon — trois décisions de gestion, pas trois constantes. Et notez dès maintenant ce que le chiffre n'est PAS : une perte maximale. La VaR dit où commence la queue, jamais ce qu'il y a dedans.`,
          }],
          pieges: [en
            ? `Forgetting the time scaling (${f(valeur, 0)} × 1.65 × ${f(vol, 0)}% = €${f(varAnnuelle, 2)}m) gives a ONE-YEAR VaR: the annual volatility must be brought down to one day by √(1/252), because variances add up, not standard deviations.`
            : `Oublier la mise à l'échelle (${f(valeur, 0)} × 1,65 × ${f(vol, 0)} % = ${f(varAnnuelle, 2)} M€) donne une VaR à horizon UN AN : la volatilité annuelle doit être ramenée au jour par √(1/252), parce que ce sont les variances qui s'additionnent, pas les écarts-types.`],
        },
        {
          intitule: en ? 'b) The 99% VaR: four points of confidence further out' : 'b) La VaR 99 % : quatre points de confiance plus loin',
          enonce: en
            ? `Same portfolio, z = 2.33. What is the one-day 99% VaR (in €m)?`
            : `Même portefeuille, z = 2,33. Quelle est la VaR 99 % à 1 jour (en M€) ?`,
          reponse: repVar99, tolerance: 0.05, toleranceMode: 'absolu', unite: 'M€',
          etapes: [{
            titre: en ? 'Buying confidence costs threshold' : 'Acheter de la confiance coûte du seuil',
            contenu: en
              ? `VaR = ${f(valeur, 0)} × 2.33 × ${f(vol, 0)}% × √(1/252) = **€${f(repVar99, 2)}m** — i.e. 2.33/1.65 = 1.41 times the 95% VaR of a). Buying four points of confidence costs 41% more threshold, because you are walking further into the normal distribution's tail — precisely where the normal lies the most (fat tails, module 2). This 99% level is the one Basel's backtesting traffic lights are built on.`
              : `VaR = ${f(valeur, 0)} × 2,33 × ${f(vol, 0)} % × √(1/252) = **${f(repVar99, 2)} M€** — soit 2,33/1,65 = 1,41 fois la VaR 95 % du a). Acheter quatre points de confiance coûte 41 % de seuil en plus, parce qu'on s'enfonce dans la queue de la normale — précisément là où la normale ment le plus (queues épaisses, module 2). C'est sur ce seuil à 99 % que sont bâtis les feux tricolores du backtesting de Bâle.`,
          }],
          pieges: [en
            ? `Believing 99% "covers almost everything": the remaining 1% is 2 to 3 trading days a year — and the VaR is mute about their size, by construction.`
            : `Croire que 99 % « couvre presque tout » : le 1 % restant, c'est 2 à 3 jours de bourse par an — et la VaR est muette sur leur taille, par construction.`],
        },
        {
          intitule: en ? 'c) Ten days: the square root of time' : 'c) Dix jours : la racine du temps',
          enonce: en
            ? `Extend the 99% VaR of b) (€${f(repVar99, 2)}m) to a 10-day horizon using the square-root-of-time rule.`
            : `Étendez la VaR 99 % du b) (${f(repVar99, 2)} M€) à un horizon de 10 jours par la règle de la racine du temps.`,
          reponse: repVar10, tolerance: 0.1, toleranceMode: 'absolu', unite: 'M€',
          etapes: [{
            titre: en ? 'A convenient floor, an optimistic ceiling' : 'Un plancher commode, un plafond optimiste',
            contenu: en
              ? `VaR 10d = ${f(repVar99, 2)} × √10 = **€${f(repVar10, 2)}m** — not €${f(r2(repVar99 * 10), 2)}m. The rule comes from i.i.d. returns: variances add up, so the standard deviation grows in √h — 99%/10 days is Basel's historical trading-book convention. But independence breaks exactly when you need it: in a crisis, losses chain into each other (margin calls, forced sales — module 11), and the true multi-day VaR exceeds the square root. A convenient floor in calm weather, an optimistic ceiling in a storm.`
              : `VaR 10 j = ${f(repVar99, 2)} × √10 = **${f(repVar10, 2)} M€** — pas ${f(r2(repVar99 * 10), 2)} M€. La règle vient des rendements i.i.d. : les variances s'additionnent, donc l'écart-type croît en √h — 99 %/10 jours est la combinaison historique de Bâle pour le trading book. Mais l'indépendance casse exactement quand on en a besoin : en crise, les pertes s'enchaînent (appels de marge, ventes forcées — module 11), et la vraie VaR multi-jours dépasse la racine. Plancher commode par temps calme, plafond optimiste par gros temps.`,
          }],
          pieges: [en
            ? `Multiplying by 10 instead of √10 (€${f(r2(repVar99 * 10), 2)}m) adds standard deviations as if losses repeated identically every day — it is the variances that add, hence √10 ≈ 3.16.`
            : `Multiplier par 10 au lieu de √10 (${f(r2(repVar99 * 10), 2)} M€) additionne des écarts-types comme si la perte se répétait à l'identique chaque jour — ce sont les variances qui s'additionnent, d'où √10 ≈ 3,16.`],
        },
        {
          intitule: en ? 'd) The exceedance contract' : 'd) Le contrat des dépassements',
          enonce: en
            ? `At 95% confidence, how many exceedances of the VaR should you expect over a 252-trading-day year?`
            : `À 95 % de confiance, combien de dépassements de la VaR attend-on sur une année de 252 jours de bourse ?`,
          reponse: repAtt95, tolerance: 0.5, toleranceMode: 'absolu', unite: en ? 'days/year' : 'jours/an',
          etapes: [{
            titre: en ? 'The exceedance is planned' : 'Le dépassement est prévu',
            contenu: en
              ? `252 × 5% = **12.6 exceedances per year** — about one trading day in twenty. An exceedance is not a model failure: it is WRITTEN into the statistical contract. Turn the argument around: a desk whose 95% VaR is never exceeded has a model that is too cautious — it overestimates the risk and wastes capital. What you monitor is the FREQUENCY of exceedances, and that is the whole point of backtesting.`
              : `252 × 5 % = **12,6 dépassements par an** — environ un jour de bourse sur vingt. Un dépassement n'est pas un échec du modèle : il est ÉCRIT dans le contrat statistique. Retournez l'argument : un desk dont la VaR 95 % n'est jamais dépassée a un modèle trop prudent — il surestime le risque et gaspille du capital. Ce qu'on surveille, c'est la FRÉQUENCE des dépassements, et c'est tout l'objet du backtesting.`,
          }],
          pieges: [en
            ? `"Your VaR was exceeded yesterday, your model is wrong": the right answer starts with "not necessarily — it is expected once in twenty days". The oral reflex the chapter drills.`
            : `« Votre VaR a été dépassée hier, votre modèle est faux » : la bonne réponse commence par « pas nécessairement — c'est prévu une fois sur vingt ». Le réflexe d'oral que le chapitre martèle.`],
        },
        {
          intitule: en ? 'e) The backtest: the model\'s colour' : 'e) Le backtest : la couleur du modèle',
          enonce: en
            ? `At 99%, how many exceedances are expected over 252 days — and in which Basel traffic-light zone do the ${f(depObs, 0)} observed exceedances place the desk?`
            : `À 99 %, combien de dépassements attend-on sur 252 jours — et dans quelle zone des feux tricolores de Bâle les ${f(depObs, 0)} dépassements observés placent-ils le desk ?`,
          reponse: repAtt99, tolerance: 0.2, toleranceMode: 'absolu', unite: en ? 'days/year' : 'jours/an',
          etapes: [
            {
              titre: en ? 'Green, orange, red' : 'Vert, orange, rouge',
              contenu: en
                ? `252 × 1% = **2.52 expected exceedances**. Basel turns the count into colours: up to 4, GREEN zone, the model lives its life; 5 to 9, ORANGE, the capital multiplier applied to the VaR (at least 3) increases; 10 or more, RED, the model is presumed wrong and capital is raised automatically. Your ${f(depObs, 0)} exceedances against 2.5 expected: **orange zone** — the desk's VaR now costs more regulatory capital. The device's elegance: it judges no hypothesis, only results — an underestimated VaR ends up costing capital.`
                : `252 × 1 % = **2,52 dépassements attendus**. Bâle transforme le comptage en couleurs : jusqu'à 4, zone VERTE, le modèle vit sa vie ; de 5 à 9, ORANGE, le multiplicateur de capital appliqué à la VaR (au moins 3) augmente ; à 10 ou plus, ROUGE, le modèle est présumé faux et le capital est majoré d'office. Vos ${f(depObs, 0)} dépassements contre 2,5 attendus : **zone orange** — la VaR du desk coûte désormais plus de capital réglementaire. L'élégance du dispositif : il ne juge aucune hypothèse, seulement les résultats — une VaR sous-estimée finit par coûter du capital.`,
            },
            {
              titre: en ? 'What the colour does not say' : 'Ce que la couleur ne dit pas',
              contenu: en
                ? `Counting exceedances says nothing about their SIZE: a model can stay green and die of a single day. That is exactly the argument that pushed the Basel committee, in the FRTB review, to replace the VaR with the expected shortfall at 97.5% — the average of the losses beyond the threshold, instead of the threshold.`
                : `Compter les dépassements ne dit rien de leur TAILLE : un modèle peut rester en zone verte et mourir d'un seul jour. C'est exactement l'argument qui a poussé le comité de Bâle, dans la revue FRTB, à remplacer la VaR par l'expected shortfall à 97,5 % — la moyenne des pertes au-delà du seuil, plutôt que le seuil.`,
            },
          ],
          pieges: [en
            ? `Reading the orange zone as "the desk traded badly": the backtest judges the MODEL against its own promise, not the positions — a desk can lose money in the green zone and make money in the red one.`
            : `Lire la zone orange comme « le desk a mal tradé » : le backtest juge le MODÈLE contre sa propre promesse, pas les positions — un desk peut perdre de l'argent en zone verte et en gagner en zone rouge.`],
        },
        {
          intitule: en ? 'f) The day of the exceedance: the killer question' : 'f) Le jour du dépassement : la question qui tue',
          enonce: en
            ? `The worst day of the year cost ${f(kJour, 1)} times the 95% VaR of a). What loss (in €m, signed) did the desk take that day?`
            : `Le pire jour de l'année a coûté ${f(kJour, 1)} fois la VaR 95 % du a). Quelle perte (en M€, signée) le desk a-t-il subie ce jour-là ?`,
          reponse: repPerteJour, tolerance: 0.15, toleranceMode: 'absolu', unite: 'M€',
          etapes: [
            {
              titre: en ? 'The VaR had promised nothing else' : 'La VaR n\'avait rien promis d\'autre',
              contenu: en
                ? `Loss = −${f(kJour, 1)} × ${f(repVar95, 2)} = **−€${f(Math.abs(repPerteJour), 2)}m**. And the VaR had promised NOTHING about that day: it gave the threshold, never the loss beyond. Two desks with identical VaR can lose 1.1 times or 8 times the threshold on the exceedance day — same number in the report, risks that have nothing in common. The institutional answer to the killer question ("and that day, how much?") is the expected shortfall — the average of losses beyond the VaR, the FRTB metric.`
                : `Perte = −${f(kJour, 1)} × ${f(repVar95, 2)} = **${f(repPerteJour, 2)} M€**. Et la VaR n'avait RIEN promis sur ce jour-là : elle donnait le seuil, jamais la perte au-delà. Deux desks à VaR identique peuvent perdre 1,1 fois ou 8 fois le seuil le jour du dépassement — même chiffre au rapport, des risques sans rapport. La réponse institutionnelle à la question qui tue (« et ce jour-là, on perd combien ? ») est l'expected shortfall — la moyenne des pertes au-delà de la VaR, la métrique du FRTB.`,
            },
            {
              titre: en ? 'The bottom line of the report' : 'La ligne du bas du rapport',
              contenu: en
                ? `Three lines for management. One: the number — €${f(repVar95, 2)}m at 95%, €${f(repVar99, 2)}m at 99%. Two: the contract — about 12.6 exceedances a year at 95% are NORMAL. Three: the reserve — beyond the threshold the number is mute: LTCM had an impeccable VaR (module 11, chapter 3), which is why the desk also runs stress tests (chapter 5): a quantile for ordinary days, a scenario for the days that count.`
                : `Trois lignes pour la direction. Un : le chiffre — ${f(repVar95, 2)} M€ à 95 %, ${f(repVar99, 2)} M€ à 99 %. Deux : le contrat — environ 12,6 dépassements par an à 95 % sont NORMAUX. Trois : la réserve — au-delà du seuil, le chiffre est muet : LTCM avait une VaR impeccable (module 11, chapitre 3), et c'est pourquoi le desk fait aussi tourner des stress tests (chapitre 5) : un quantile pour les jours ordinaires, un scénario pour les jours qui comptent.`,
            },
          ],
          pieges: [en
            ? `Presenting the VaR to a committee as a "maximum loss" is the misreading that costs points at the oral and careers on the floor: the VaR bounds nothing — it says where the tail begins, not what it contains.`
            : `Présenter la VaR à un comité comme une « perte maximale » est le contresens qui coûte des points à l'oral et des carrières en salle : la VaR ne borne rien — elle dit où commence la queue, pas ce qu'elle contient.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 14. m12-pb-14 — La banque au stress test — N3                       */
/* ------------------------------------------------------------------ */
const stressTestBce: ProblemeMoule = {
  id: 'm12-pb-14', moduleId: M12,
  titre: 'La banque au stress test : la copie BCE, du RWA au coussin',
  titreEn: 'The bank in the stress test: the ECB submission, from RWA to buffer',
  typeDeCas: 'capital réglementaire sous stress',
  typeDeCasEn: 'regulatory capital under stress',
  difficulte: 3,
  scenarios: ['L\'équipe ALM qui prépare la copie du stress test', 'Le superviseur qui contre-calcule la copie', 'L\'oral : « stress-testez-moi cette banque en cinq nombres »'],
  scenariosEn: ['The ALM team preparing the stress-test submission', 'The supervisor recomputing the submission', 'The oral exam: "stress-test this bank for me in five numbers"'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const expoSouv = randInt(rng, 200, 300);
    const expoBanq = randInt(rng, 100, 160);
    const expoRet = randInt(rng, 180, 260);
    const expoCorp = randInt(rng, 180, 260);
    const cet1Cible = randFloat(rng, 13, 15, 1);
    const vMarche = randInt(rng, 60, 90);
    const choc = -randInt(rng, 18, 25);
    const beta = randFloat(rng, 1, 1.2, 1);
    const sys = randFloat(rng, 1, 2, 1);
    const rwaBanq = actifsPonderesRisqueMillions(expoBanq, 20);
    const rwaRet = actifsPonderesRisqueMillions(expoRet, 75);
    const rwaCorp = actifsPonderesRisqueMillions(expoCorp, 100);
    const rwa = actifsPonderesRisqueMillions(expoSouv, 0) + rwaBanq + rwaRet + rwaCorp;
    const fp = r0(rwa * cet1Cible / 100);
    const perte = perteStressMillions(vMarche, choc, beta);
    const cet1 = ratioCet1Pct(fp, rwa);
    const cet1Post = ratioCet1Pct(fp + perte, rwa);
    const exigence = r1(4.5 + 2.5 + sys);
    const marge = cet1Post - exigence;
    const coussinM = (marge / 100) * rwa;
    const brut = expoSouv + expoBanq + expoRet + expoCorp;
    const repRwa = r0(rwa);
    const repCet1 = r2(cet1);
    const repPerte = r1(perte);
    const repCet1Post = r2(cet1Post);
    const repMarge = r2(marge);
    const repCoussin = r1(coussinM);

    const { en, f, pct } = outils(langue);
    const mEur = (v: number, d = 0) => (en ? `€${f(v, d)}m` : `${f(v, d)} M€`);
    const desc = en
      ? `the simplified balance sheet: ${mEur(expoSouv)} of AAA sovereign (0% weight), ${mEur(expoBanq)} of well-rated interbank exposure (20%), ${mEur(expoRet)} of retail (75%), ${mEur(expoCorp)} of corporates (100%); ${mEur(fp)} of common equity tier 1; a market book of ${mEur(vMarche)} with a beta of ${f(beta, 1)}; the supervisor's adverse scenario: a market at ${pct(choc, 0)}, risk weights held constant; the total requirement: 4.5% minimum, plus the 2.5% conservation buffer, plus a ${pct(sys, 1)} systemic buffer`
      : `le bilan simplifié : ${mEur(expoSouv)} de souverain AAA (pondération 0 %), ${mEur(expoBanq)} d'interbancaire bien noté (20 %), ${mEur(expoRet)} de clientèle de détail (75 %), ${mEur(expoCorp)} de corporates (100 %) ; ${mEur(fp)} de fonds propres durs (CET1) ; une poche de marché de ${mEur(vMarche)} de bêta ${f(beta, 1)} ; le scénario adverse du superviseur : un marché à ${pct(choc, 0)}, pondérations tenues constantes ; l'exigence totale : 4,5 % de minimum, plus le coussin de conservation de 2,5 %, plus un coussin systémique de ${pct(sys, 1)}`;
    const contexte = (en
      ? [
        `Three weeks before the submission deadline. The ECB's stress-test template sits open on your screen, and the executive committee wants the headline number before the supervisor gets it: how much buffer survives the adverse scenario? The file: ${desc}. The mechanics are chapter 6 end to end: weight the assets, measure the capital, take the hit, measure again. Five numbers — and the fifth decides whether the bank spends next year growing or restoring.`,
        `You sit on the other side: supervision team, quality-assurance week. The bank's submission claims a comfortable pass, and your job is to recompute every line before the number becomes official. The data: ${desc}. The rule of the exercise: no benefit of the doubt — weight, divide, shock, divide again, and compare to the stacked requirement. Banks fail stress tests on arithmetic more often than on strategy.`,
        `The oral. The examiner slides one card across the table: ${desc}. "You have five numbers to compute: the risk-weighted assets, the starting CET1, the stress loss, the landing CET1, and what remains above the requirement — in millions, because a board does not think in percentages. Go."`,
      ]
      : [
        `Trois semaines avant la remise de la copie. Le modèle de stress test de la BCE est ouvert à l'écran, et le comité exécutif veut le chiffre-titre avant que le superviseur ne l'ait : combien de coussin survit au scénario adverse ? Le dossier : ${desc}. La mécanique est le chapitre 6 de bout en bout : pondérer les actifs, mesurer le capital, encaisser le choc, remesurer. Cinq nombres — et le cinquième décide si la banque passe l'année prochaine à croître ou à réparer.`,
        `Vous êtes de l'autre côté : équipe de supervision, semaine d'assurance qualité. La copie de la banque revendique une réussite confortable, et votre travail est de recalculer chaque ligne avant que le chiffre ne devienne officiel. Les données : ${desc}. La règle de l'exercice : aucun bénéfice du doute — pondérer, diviser, choquer, rediviser, et comparer à l'exigence empilée. Les banques échouent aux stress tests sur l'arithmétique plus souvent que sur la stratégie.`,
        `L'oral. L'examinateur pousse une seule fiche sur la table : ${desc}. « Vous avez cinq nombres à calculer : les actifs pondérés du risque, le CET1 de départ, la perte de stress, le CET1 d'arrivée, et ce qui reste au-dessus de l'exigence — en millions, parce qu'un conseil d'administration ne pense pas en pourcentages. Allez-y. »`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) Weigh first: the RWA' : 'a) Pondérer d\'abord : les RWA',
          enonce: en
            ? `Compute the total risk-weighted assets (in €m) of the four exposures.`
            : `Calculez le total des actifs pondérés du risque (en M€) des quatre expositions.`,
          reponse: repRwa, tolerance: 2, toleranceMode: 'absolu', unite: 'M€',
          etapes: [{
            titre: en ? 'A euro is not a euro' : 'Un euro n\'est pas un euro',
            contenu: en
              ? `RWA = ${f(expoSouv, 0)} × 0% + ${f(expoBanq, 0)} × 20% + ${f(expoRet, 0)} × 75% + ${f(expoCorp, 0)} × 100% = 0 + ${f(rwaBanq, 0)} + ${f(rwaRet, 0)} + ${f(rwaCorp, 0)} = **${mEur(repRwa)}** — against ${mEur(brut)} of gross balance sheet. The weight encodes the regulatory risk: ~0% for AAA sovereigns, 20-50% for well-rated banks and corporates, 75% for retail, 100% and above for the rest — module 5's ratings wired straight into the world's bank capital, cliff effects included.`
              : `RWA = ${f(expoSouv, 0)} × 0 % + ${f(expoBanq, 0)} × 20 % + ${f(expoRet, 0)} × 75 % + ${f(expoCorp, 0)} × 100 % = 0 + ${f(rwaBanq, 0)} + ${f(rwaRet, 0)} + ${f(rwaCorp, 0)} = **${mEur(repRwa)}** — contre ${mEur(brut)} de bilan brut. La pondération encode le risque réglementaire : ~0 % pour le souverain AAA, 20-50 % pour les banques et entreprises bien notées, 75 % pour le détail, 100 % et plus pour le reste — la notation du module 5 câblée directement dans le capital bancaire mondial, effets de falaise compris.`,
          }],
          pieges: [en
            ? `Summing the gross exposures (${mEur(brut)}) computes the denominator of the LEVERAGE ratio — Basel III's deliberately crude backstop (≥ 3%, no weights, no models) — not the CET1 denominator.`
            : `Sommer les expositions brutes (${mEur(brut)}) calcule le dénominateur du ratio de LEVIER — le garde-fou volontairement fruste de Bâle III (≥ 3 %, aucune pondération, aucun modèle) — pas celui du CET1.`],
        },
        {
          intitule: en ? 'b) The starting CET1' : 'b) Le CET1 de départ',
          enonce: en
            ? `With ${mEur(fp)} of common equity against the RWA of a), what is the starting CET1 ratio (in %)?`
            : `Avec ${mEur(fp)} de fonds propres durs contre les RWA du a), quel est le ratio CET1 de départ (en %) ?`,
          reponse: repCet1, tolerance: 0.1, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The post-2008 answer, in one ratio' : 'La réponse à 2008, en un ratio',
            contenu: en
              ? `CET1 = ${f(fp, 0)} / ${f(repRwa, 0)} × 100 = **${pct(repCet1, 2)}** — squarely in the 12-15% where large European banks live, far above the bare minimum. Why so far above? Because the market itself demands the margin: remember Lehman at leverage ~31, about 3.2% of capital on its balance sheet (module 11). More capital, of better quality, against weighted risks: this ratio IS the regulatory answer to 2008. Now comes the question the ratio cannot answer alone: what happens to it under stress?`
              : `CET1 = ${f(fp, 0)} / ${f(repRwa, 0)} × 100 = **${pct(repCet1, 2)}** — en plein dans les 12-15 % où vivent les grandes banques européennes, loin au-dessus du minimum nu. Pourquoi si loin au-dessus ? Parce que le marché lui-même exige la marge : souvenez-vous de Lehman à levier ~31, environ 3,2 % de capital sur bilan (module 11). Plus de capital, de meilleure qualité, contre des risques pondérés : ce ratio EST la réponse réglementaire à 2008. Reste la question à laquelle le ratio seul ne répond pas : que devient-il sous stress ?`,
          }],
          pieges: [en
            ? `Dividing by the gross balance sheet (${f(fp, 0)}/${f(brut, 0)} = ${pct(r2((fp / brut) * 100), 2)}) computes the leverage ratio: a useful number, but a different question — CET1 lives on WEIGHTED assets.`
            : `Diviser par le bilan brut (${f(fp, 0)}/${f(brut, 0)} = ${pct(r2((fp / brut) * 100), 2)}) calcule le ratio de levier : un nombre utile, mais une autre question — le CET1 vit sur les actifs PONDÉRÉS.`],
        },
        {
          intitule: en ? 'c) The stress loss' : 'c) La perte de stress',
          enonce: en
            ? `The adverse scenario sends the market to ${pct(choc, 0)}; the market book is ${mEur(vMarche)} with a beta of ${f(beta, 1)}. What loss (in €m, signed) does the scenario inflict?`
            : `Le scénario adverse envoie le marché à ${pct(choc, 0)} ; la poche de marché fait ${mEur(vMarche)} pour un bêta de ${f(beta, 1)}. Quelle perte (en M€, signée) le scénario inflige-t-il ?`,
          reponse: repPerte, tolerance: 0.5, toleranceMode: 'absolu', unite: 'M€',
          etapes: [{
            titre: en ? 'No probability — a scenario' : 'Pas de probabilité — un scénario',
            contenu: en
              ? `Loss = ${f(vMarche, 0)} × (${f(choc, 0)}%) × ${f(beta, 1)} = **${mEur(repPerte, 1)}** — a signed, brutal number with no confidence interval. That crudeness is deliberate: the stress test is the anti-VaR (chapter 5). It renounces "with what probability?" to ask the only question left when the distributions have burned: "what if?". Its virtue is not in the refinement of the multiplication — it is in the conversation the number forces.`
              : `Perte = ${f(vMarche, 0)} × (${f(choc, 0)} %) × ${f(beta, 1)} = **${mEur(repPerte, 1)}** — un chiffre signé, brutal, sans intervalle de confiance. Cette frustesse est voulue : le stress test est l'anti-VaR (chapitre 5). Il renonce au « avec quelle probabilité ? » pour poser la seule question qui reste quand les lois ont brûlé : « et si ? ». Sa vertu n'est pas dans le raffinement de la multiplication — elle est dans la conversation que le chiffre déclenche.`,
          }],
          pieges: [en
            ? `Forgetting the beta (${f(vMarche, 0)} × ${f(choc, 0)}% = ${mEur(r1(vMarche * choc / 100), 1)}) understates the hit: a ${f(beta, 1)}-beta book amplifies the market's move — that is what the beta was bought for, in both directions.`
            : `Oublier le bêta (${f(vMarche, 0)} × ${f(choc, 0)} % = ${mEur(r1(vMarche * choc / 100), 1)}) sous-estime le choc : une poche de bêta ${f(beta, 1)} amplifie le mouvement du marché — c'est pour cela que le bêta a été acheté, dans les deux sens.`],
        },
        {
          intitule: en ? 'd) The landing CET1' : 'd) Le CET1 d\'arrivée',
          enonce: en
            ? `The loss of c) hits the capital; the RWA are held constant by assumption. What is the post-stress CET1 ratio (in %)?`
            : `La perte du c) frappe le capital ; les RWA sont tenus constants par hypothèse. Quel est le ratio CET1 après stress (en %) ?`,
          reponse: repCet1Post, tolerance: 0.1, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The capital absorbs, the ratio descends' : 'Le capital absorbe, le ratio descend',
            contenu: en
              ? `CET1 = (${f(fp, 0)} − ${f(Math.abs(repPerte), 1)}) / ${f(repRwa, 0)} × 100 = **${pct(repCet1Post, 2)}**, down from ${pct(repCet1, 2)}: the loss ate ${f(r2(repCet1 - repCet1Post), 2)} points of ratio. That is what capital is FOR — absorbing losses without triggering default. One honesty note: holding RWA constant is generous. In a real adverse scenario, downgrades push weights UP while capital falls — the ratio takes the double hit. Real stress tests model both; the submission must say which convention it uses.`
              : `CET1 = (${f(fp, 0)} − ${f(Math.abs(repPerte), 1)}) / ${f(repRwa, 0)} × 100 = **${pct(repCet1Post, 2)}**, contre ${pct(repCet1, 2)} au départ : la perte a mangé ${f(r2(repCet1 - repCet1Post), 2)} points de ratio. C'est À CELA que sert le capital — absorber des pertes sans déclencher de défaut. Une honnêteté au passage : tenir les RWA constants est généreux. Dans un vrai scénario adverse, les dégradations poussent les pondérations À LA HAUSSE pendant que le capital baisse — le ratio prend la double peine. Les vrais stress tests modélisent les deux ; la copie doit dire quelle convention elle prend.`,
          }],
          pieges: [en
            ? `Subtracting the loss from the RATIO (${f(repCet1, 2)} − ${f(Math.abs(repPerte), 1)}) mixes units: the loss lives in millions, the ratio in per cent — the loss hits the NUMERATOR, then you divide again.`
            : `Soustraire la perte du RATIO (${f(repCet1, 2)} − ${f(Math.abs(repPerte), 1)}) mélange les unités : la perte vit en millions, le ratio en pour cent — la perte frappe le NUMÉRATEUR, puis on redivise.`],
        },
        {
          intitule: en ? 'e) Against the stacked requirement' : 'e) Contre l\'exigence empilée',
          enonce: en
            ? `The total requirement stacks 4.5% + 2.5% + ${pct(sys, 1)} = ${pct(exigence, 1)}. By how many points (signed) does the post-stress CET1 of d) clear it?`
            : `L'exigence totale empile 4,5 % + 2,5 % + ${pct(sys, 1)} = ${pct(exigence, 1)}. De combien de points (signés) le CET1 post-stress du d) la dépasse-t-il ?`,
          reponse: repMarge, tolerance: 0.1, toleranceMode: 'absolu', unite: 'points',
          etapes: [{
            titre: en ? 'The bar is not 4.5%' : 'La barre n\'est pas à 4,5 %',
            contenu: en
              ? `Margin = ${f(repCet1Post, 2)} − ${f(exigence, 1)} = **${f(repMarge, 2)} points**. ${repMarge >= 0 ? `The bank passes: even after the shock it stays above the full stack — minimum, conservation buffer, systemic buffer. That is the design working as intended: the buffers exist precisely to be consumed in stress without the bank failing.` : `The bank lands BELOW the stack: not a default — the 4.5% floor holds — but the buffers are breached, and breaching the conservation buffer triggers automatic restrictions on dividends and bonuses, then a remediation plan. This is exactly what the buffers are for: a shock absorber zone between "healthy" and "failed".`} The requirement is a staircase, not a single bar — and supervisory life happens on the buffer steps, not at the 4.5% floor.`
              : `Marge = ${f(repCet1Post, 2)} − ${f(exigence, 1)} = **${f(repMarge, 2)} points**. ${repMarge >= 0 ? `La banque passe : même après le choc, elle reste au-dessus de la pile complète — minimum, coussin de conservation, coussin systémique. C'est le dispositif qui fonctionne comme prévu : les coussins existent précisément pour être consommés sous stress sans que la banque tombe.` : `La banque atterrit SOUS la pile : pas un défaut — le plancher de 4,5 % tient — mais les coussins sont entamés, et entamer le coussin de conservation déclenche des restrictions automatiques sur dividendes et bonus, puis un plan de remédiation. C'est exactement à cela que servent les coussins : une zone d'amortissement entre « sain » et « tombé ».`} L'exigence est un escalier, pas une barre unique — et la vie prudentielle se joue sur les marches des coussins, pas au plancher de 4,5 %.`,
          }],
          pieges: [en
            ? `Comparing to the bare 4.5% and declaring victory: the effective bar stacks the buffers to ${pct(exigence, 1)} — a bank can be miles above the minimum and still under distribution restrictions.`
            : `Comparer au 4,5 % nu et crier victoire : la barre effective empile les coussins jusqu'à ${pct(exigence, 1)} — une banque peut être loin au-dessus du minimum et quand même sous restrictions de distribution.`],
        },
        {
          intitule: en ? 'f) The buffer, in millions' : 'f) Le coussin, en millions',
          enonce: en
            ? `Convert the margin of e) into euros: how many €m of capital (signed) separate the bank from its requirement, on ${mEur(repRwa)} of RWA?`
            : `Convertissez la marge du e) en euros : combien de M€ de capital (signés) séparent la banque de son exigence, sur ${mEur(repRwa)} de RWA ?`,
          reponse: repCoussin, tolerance: 1, toleranceMode: 'absolu', unite: 'M€',
          etapes: [
            {
              titre: en ? 'A board thinks in millions' : 'Un conseil pense en millions',
              contenu: en
                ? `Buffer = ${f(repMarge, 2)}% × ${f(repRwa, 0)} = **${mEur(repCoussin, 1)}**. ${repMarge >= 0 ? `That is the bank's real room: what it can lose beyond the scenario, or the capital freed for growth if the scenario never comes.` : `That is the hole to fill: capital to raise, RWA to shed, or dividends to withhold — the supervisor will not debate the decimal.`} Same information as e), but this is the version the board can act on: percentages describe, millions decide.`
                : `Coussin = ${f(repMarge, 2)} % × ${f(repRwa, 0)} = **${mEur(repCoussin, 1)}**. ${repMarge >= 0 ? `C'est la vraie marge de la banque : ce qu'elle peut encore perdre au-delà du scénario, ou le capital libéré pour croître si le scénario ne vient pas.` : `C'est le trou à combler : du capital à lever, des RWA à céder, ou des dividendes à retenir — le superviseur ne discutera pas la virgule.`} Même information que le e), mais c'est la version sur laquelle un conseil peut agir : les pourcentages décrivent, les millions décident.`,
            },
            {
              titre: en ? 'The five-number summary' : 'La synthèse en cinq nombres',
              contenu: en
                ? `The whole submission on one line: ${mEur(brut)} gross become ${mEur(repRwa)} weighted; ${mEur(fp)} of capital make ${pct(repCet1, 2)}; the scenario takes ${mEur(repPerte, 1)}; the ratio lands at ${pct(repCet1Post, 2)} against a ${pct(exigence, 1)} bar; ${repMarge >= 0 ? 'remainder' : 'shortfall'}: ${mEur(repCoussin, 1)}. Solvency measured — and remember chapter 6's warning before celebrating: SVB was regulatorily solvent the day before it died. The stress test of capital never replaces the stress test of LIQUIDITY.`
                : `Toute la copie en une ligne : ${mEur(brut)} bruts deviennent ${mEur(repRwa)} pondérés ; ${mEur(fp)} de capital font ${pct(repCet1, 2)} ; le scénario prend ${mEur(repPerte, 1)} ; le ratio atterrit à ${pct(repCet1Post, 2)} contre une barre à ${pct(exigence, 1)} ; ${repMarge >= 0 ? 'reste' : 'déficit'} : ${mEur(repCoussin, 1)}. La solvabilité est mesurée — et rappelez-vous l'avertissement du chapitre 6 avant de fêter : SVB était réglementairement solvable la veille de sa mort. Le stress test du capital ne remplace jamais celui de la LIQUIDITÉ.`,
            },
          ],
          pieges: [en
            ? `Reading points of ratio as millions (${f(repMarge, 2)} "million") forgets the scale: one point of CET1 on this balance sheet is worth ${mEur(r1(rwa / 100), 1)} — the conversion factor IS the RWA.`
            : `Lire des points de ratio comme des millions (${f(repMarge, 2)} « millions ») oublie l'échelle : un point de CET1 sur ce bilan vaut ${mEur(r1(rwa / 100), 1)} — le facteur de conversion EST le RWA.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 15. m12-pb-15 — BOSS : le fonds au Sharpe de 4 — N4                 */
/* ------------------------------------------------------------------ */
const fondsSharpe4: ProblemeMoule = {
  id: 'm12-pb-15', moduleId: M12,
  titre: 'Le fonds au Sharpe de 4 : l\'arbitrage parfait et le mois qui ne pouvait pas arriver',
  titreEn: 'The fund with a Sharpe of 4: the perfect arbitrage and the month that could not happen',
  typeDeCas: 'levier, VaR et risque de queue',
  typeDeCasEn: 'leverage, VaR and tail risk',
  difficulte: 4,
  scenarios: ['La due diligence du family office invité au fonds miracle', 'Le risk manager du prime broker qui revoit les haircuts', 'L\'oral : « un Sharpe de 4, impressionné ? »'],
  scenariosEn: ['The family office\'s due diligence on the miracle fund', 'The prime broker\'s risk manager reviewing the haircuts', 'The oral exam: "a Sharpe of 4 — impressed?"'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const capital = randFloat(rng, 4.8, 5.4, 1);       // Md$
    const actifs = randInt(rng, 115, 135);             // Md$
    const volActifs = randFloat(rng, 0.28, 0.34, 2);   // % annuelle, mesurée
    const sharpeCible = randFloat(rng, 3.8, 4.4, 1);
    const rf = randFloat(rng, 4.5, 5.5, 1);
    const duration = randFloat(rng, 4.2, 4.8, 1);      // spread duration du book
    const dSpread = randInt(rng, 55, 68);              // pb, l'écartement d'août
    const levier = actifs / capital;
    const volFonds = r1(levier * volActifs);
    const rFonds = r1(rf + sharpeCible * volFonds);
    const sharpe = ratioSharpe(rFonds, rf, volFonds);
    const varJour = varParametrique(actifs * 1000, volActifs, 2.33, 1);   // M$
    const sigmaJour = (actifs * 1000) * (volActifs / 100) / Math.sqrt(252); // M$
    const perteJour4 = -4 * sigmaJour;                 // M$
    const pertePct = variationPrixSpreadPct(duration, dSpread); // % signé des actifs
    const perteMd = (pertePct / 100) * actifs;         // Md$ signé
    const capitalApres = capital + perteMd;
    const fatale = -100 / levier;
    const levierApres = (actifs + perteMd) / capitalApres;
    const repSharpe = r2(sharpe);
    const repLevier = r1(levier);
    const repVarJour = r1(varJour);
    const repJour4 = r1(perteJour4);
    const repPerteMd = r2(perteMd);
    const repCapApres = r2(capitalApres);

    const { en, f, pct, pb: bp } = outils(langue);
    const mdUsd = (v: number, d = 1) => (en ? `\\$${f(v, d)}bn` : `${f(v, d)} Md\\$`);
    const mUsd = (v: number, d = 0) => (en ? `\\$${f(v, d)}m` : `${f(v, d)} M\\$`);
    const desc = en
      ? `the fund returned ${pct(rFonds, 1)} last year for a volatility of ${pct(volFonds, 1)}, while cash paid ${pct(rf, 1)}; under the hood: ${mdUsd(capital)} of capital carry ${mdUsd(actifs, 0)} of convergence-arbitrage positions, financed in repo at negotiated near-zero haircuts; the MEASURED volatility of the asset portfolio is ${pct(volActifs, 2)} a year; the book's spread duration is about ${f(duration, 1)}; the scenario nobody prices: all the spreads widening by ${bp(dSpread)} together`
      : `le fonds a rendu ${pct(rFonds, 1)} l'an dernier pour une volatilité de ${pct(volFonds, 1)}, quand le cash payait ${pct(rf, 1)} ; sous le capot : ${mdUsd(capital)} de capital portent ${mdUsd(actifs, 0)} de positions d'arbitrage de convergence, financées en repo à haircuts négociés quasi nuls ; la volatilité MESURÉE du portefeuille d'actifs est de ${pct(volActifs, 2)} par an ; la spread duration du book est d'environ ${f(duration, 1)} ; le scénario que personne ne price : tous les spreads qui s'écartent de ${bp(dSpread)} ensemble`;
    const contexte = (en
      ? [
        `The pitch deck is magnificent. Two future Nobel laureates on the board, four years without a losing quarter, and a Sharpe ratio the marketer writes in bold. Your family office is invited into the fund, and your job is the due diligence everyone else skipped: ${desc}. Chapter 3 gave you the reflex — above 2, a Sharpe is not impressive, it is a question. Ask it all the way down: where the return comes from, what the leverage is, what the VaR sees, and what happens the day the impossible month arrives. History has already run this experiment once (module 11, chapter 3); tonight you rerun it with a calculator.`,
        `You manage the fund's repo desk at the prime broker, and your credit committee meets tomorrow: the fund wants MORE leverage at LOWER haircuts, and its argument is the track record — ${desc}. Your predecessor granted everything; the fund is so prestigious that saying no feels absurd. Before the committee, do what the chapter demands: decompose the Sharpe, compute the distance to death, price the scenario where every convergence trade is the same bet. The haircut you set tonight is the system's only brake.`,
        `The oral, final round. The examiner smiles: "A fund shows me a Sharpe of 4. Impressed?" Then he hands you the sheet: ${desc}. "Take it apart: the ratio, the leverage, the VaR, the day at four sigmas, the capital after. I want numbers, and then I want the sentence that connects them to August 1998."`,
      ]
      : [
        `La plaquette est magnifique. Deux futurs prix Nobel au conseil, quatre ans sans un trimestre perdant, et un ratio de Sharpe que le commercial écrit en gras. Votre family office est invité au capital du fonds, et votre travail est la due diligence que tous les autres ont sautée : ${desc}. Le chapitre 3 vous a donné le réflexe — au-dessus de 2, un Sharpe n'est pas impressionnant, c'est une question. Posez-la jusqu'au bout : d'où vient le rendement, quel est le levier, ce que voit la VaR, et ce qui arrive le jour où le mois impossible arrive. L'histoire a déjà fait tourner cette expérience une fois (module 11, chapitre 3) ; ce soir, vous la refaites à la calculatrice.`,
        `Vous tenez le desk repo du prime broker, et votre comité de crédit se réunit demain : le fonds veut PLUS de levier à haircuts PLUS BAS, et son argument est le track record — ${desc}. Votre prédécesseur accordait tout ; le fonds est si prestigieux que dire non paraît absurde. Avant le comité, faites ce que le chapitre exige : décomposez le Sharpe, calculez la distance à la mort, pricez le scénario où chaque trade de convergence est le même pari. Le haircut que vous fixez ce soir est le seul frein du système.`,
        `L'oral, dernier tour. L'examinateur sourit : « Un fonds m'affiche un Sharpe de 4. Impressionné ? » Puis il vous tend la fiche : ${desc}. « Démontez-le : le ratio, le levier, la VaR, le jour à quatre sigmas, le capital d'après. Je veux des nombres, puis je veux la phrase qui les relie à août 1998. »`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The pitch-book Sharpe' : 'a) Le Sharpe de la plaquette',
          enonce: en
            ? `Return ${pct(rFonds, 1)}, cash ${pct(rf, 1)}, volatility ${pct(volFonds, 1)}. What Sharpe ratio does the fund display?`
            : `Rendement ${pct(rFonds, 1)}, cash ${pct(rf, 1)}, volatilité ${pct(volFonds, 1)}. Quel ratio de Sharpe le fonds affiche-t-il ?`,
          reponse: repSharpe, tolerance: 0.05, toleranceMode: 'absolu', unite: '×',
          etapes: [{
            titre: en ? 'Off the scale — which is the point' : 'Hors échelle — et c\'est le point',
            contenu: en
              ? `Sharpe = (${f(rFonds, 1)} − ${f(rf, 1)}) / ${f(volFonds, 1)} = **${f(repSharpe, 2)}**. Place it on chapter 3's scale: 0.3-0.5 for passive equities, above 1 excellent, above 2 SUSPECT. LTCM displayed above 4 before 1998, with returns over 40% in 1995-96 — and half of Wall Street begging to invest. The desk reflex in front of such a number is not admiration, it is a question: WHERE does the return come from? A Sharpe is a mean divided by a standard deviation — it sees neither the leverage nor the tail.`
              : `Sharpe = (${f(rFonds, 1)} − ${f(rf, 1)}) / ${f(volFonds, 1)} = **${f(repSharpe, 2)}**. Placez-le sur l'échelle du chapitre 3 : 0,3-0,5 pour de l'actions passif, au-dessus de 1 excellent, au-dessus de 2 SUSPECT. LTCM affichait plus de 4 avant 1998, avec plus de 40 % de rendement en 1995-96 — et la moitié de Wall Street suppliait d'investir. Le réflexe de desk devant un tel nombre n'est pas l'admiration, c'est une question : D'OÙ vient le rendement ? Un Sharpe est une moyenne divisée par un écart-type — il ne voit ni le levier ni la queue.`,
          }],
          pieges: [en
            ? `Treating ${f(repSharpe, 2)} as "four times better than excellent": past a certain level the ratio stops measuring skill and starts measuring what the volatility window FAILED to contain — a risk that has not happened yet.`
            : `Lire ${f(repSharpe, 2)} comme « quatre fois mieux qu'excellent » : passé un certain niveau, le ratio cesse de mesurer du talent et commence à mesurer ce que la fenêtre de volatilité N'A PAS contenu — un risque qui n'a pas encore eu lieu.`],
        },
        {
          intitule: en ? 'b) The leverage under the hood' : 'b) Le levier sous le capot',
          enonce: en
            ? `${mdUsd(capital)} of capital carry ${mdUsd(actifs, 0)} of positions. What is the fund's balance-sheet leverage?`
            : `${mdUsd(capital)} de capital portent ${mdUsd(actifs, 0)} de positions. Quel est le levier de bilan du fonds ?`,
          reponse: repLevier, tolerance: 0.3, toleranceMode: 'absolu', unite: '×',
          etapes: [
            {
              titre: en ? 'The distance to death' : 'La distance à la mort',
              contenu: en
                ? `Leverage = ${f(actifs, 0)} / ${f(capital, 1)} = **${f(repLevier, 1)}** — and the fatal asset move follows immediately: −100/${f(repLevier, 1)} = **${pct(r2(fatale), 2)}**. A ${f(r2(Math.abs(fatale)), 1)}% dip in positions deemed "riskless arbitrage" erases every dollar of capital. LTCM's real numbers: 125/4.7 ≈ 27, fatal move −3.7%, plus over \\$1,000bn of derivatives notional off balance sheet. How is such leverage even financeable? Repo with negotiated haircuts: a 2% haircut alone allows 100/2 = 50× — the Nobel prestige was not marketing, it was a funding condition.`
                : `Levier = ${f(actifs, 0)} / ${f(capital, 1)} = **${f(repLevier, 1)}** — et la variation d'actifs fatale suit immédiatement : −100/${f(repLevier, 1)} = **${pct(r2(fatale), 2)}**. Une baisse de ${f(r2(Math.abs(fatale)), 1)} % sur des positions réputées « arbitrage sans risque » efface chaque dollar de capital. Les vrais nombres de LTCM : 125/4,7 ≈ 27, variation fatale −3,7 %, plus de 1 000 Md\\$ de notionnels de dérivés hors bilan. Comment un tel levier se finance-t-il seulement ? Le repo à haircuts négociés : un haircut de 2 % autorise à lui seul 100/2 = 50 — le prestige des Nobel n'était pas du marketing, c'était une condition de financement.`,
            },
            {
              titre: en ? 'What leverage does to a Sharpe: nothing' : 'Ce que le levier fait au Sharpe : rien',
              contenu: en
                ? `Check the consistency: fund volatility ${pct(volFonds, 1)} ≈ ${f(repLevier, 1)} × ${pct(volActifs, 2)}, the asset volatility. Leverage multiplies the numerator AND the denominator of the Sharpe: the ratio of 4 comes from the STRATEGY, not from the gearing. What leverage changes is not the ratio — it is the distance to death. Two funds with the same Sharpe, one at leverage 2 and one at ${f(repLevier, 1)}, are not the same investment: one can wait out a bad year, the other cannot wait out a bad month.`
                : `Vérifiez la cohérence : volatilité du fonds ${pct(volFonds, 1)} ≈ ${f(repLevier, 1)} × ${pct(volActifs, 2)}, la volatilité des actifs. Le levier multiplie le numérateur ET le dénominateur du Sharpe : le ratio de 4 vient de la STRATÉGIE, pas du levier. Ce que le levier change n'est pas le ratio — c'est la distance à la mort. Deux fonds au même Sharpe, l'un à levier 2 et l'autre à ${f(repLevier, 1)}, ne sont pas le même investissement : l'un peut attendre la fin d'une mauvaise année, l'autre ne peut pas attendre la fin d'un mauvais mois.`,
            },
          ],
          pieges: [en
            ? `Believing the leverage inflates the Sharpe: it scales return and volatility identically — the seduction of the ratio and the fragility of the balance sheet are two SEPARATE facts, and the pitch book only shows the first.`
            : `Croire que le levier gonfle le Sharpe : il multiplie rendement et volatilité à l'identique — la séduction du ratio et la fragilité du bilan sont deux faits SÉPARÉS, et la plaquette ne montre que le premier.`],
        },
        {
          intitule: en ? 'c) The VaR that sees nothing' : 'c) La VaR qui ne voit rien',
          enonce: en
            ? `On the asset portfolio (${mdUsd(actifs, 0)}, i.e. ${mUsd(actifs * 1000)}), measured volatility ${pct(volActifs, 2)}, z = 2.33, what is the one-day 99% VaR in \\$m?`
            : `Sur le portefeuille d'actifs (${mdUsd(actifs, 0)}, soit ${mUsd(actifs * 1000)}), volatilité mesurée ${pct(volActifs, 2)}, z = 2,33, quelle est la VaR 99 % à 1 jour en M\\$ ?`,
          reponse: repVarJour, tolerance: 2, toleranceMode: 'absolu', unite: 'M$',
          etapes: [{
            titre: en ? 'An impeccable VaR' : 'Une VaR impeccable',
            contenu: en
              ? `VaR = ${f(actifs * 1000, 0)} × 2.33 × ${f(volActifs, 2)}% × √(1/252) = **${mUsd(repVarJour)}** — that is ${pct(r2((varJour / (capital * 1000)) * 100), 2)} of the capital. The model's verdict: a fortress. And the model is not lying about what it measures — the DAILY dispersion of the calm window really is tiny. The vice is statistical (module 2): calibrating a VaR on calm years means estimating the tail of a distribution with data that contains no tail. "LTCM had an impeccable VaR" is chapter 5's warning, word for word.`
              : `VaR = ${f(actifs * 1000, 0)} × 2,33 × ${f(volActifs, 2)} % × √(1/252) = **${mUsd(repVarJour)}** — soit ${pct(r2((varJour / (capital * 1000)) * 100), 2)} du capital. Le verdict du modèle : une forteresse. Et le modèle ne ment pas sur ce qu'il mesure — la dispersion QUOTIDIENNE de la fenêtre calme est réellement minuscule. Le vice est statistique (module 2) : calibrer une VaR sur des années calmes, c'est estimer la queue d'une distribution avec des données qui n'en contiennent pas. « LTCM avait une VaR impeccable » est l'avertissement du chapitre 5, mot pour mot.`,
          }],
          pieges: [en
            ? `Concluding from the tiny VaR that the fund is safe: the hundred convergence positions are the SAME bet repeated — that calm continues — and correlations climb toward 1 exactly on the day diversification was supposed to save you.`
            : `Conclure de la VaR minuscule que le fonds est sûr : les cent positions de convergence sont le MÊME pari répété — que le calme continue — et les corrélations montent vers 1 exactement le jour où la diversification devait sauver.`],
        },
        {
          intitule: en ? 'd) The worst day the model can imagine' : 'd) Le pire jour que le modèle sait imaginer',
          enonce: en
            ? `Daily sigma = annual volatility / √252. What does a −4σ day cost on the asset portfolio (in \\$m, signed)?`
            : `Sigma quotidien = volatilité annuelle / √252. Que coûte un jour à −4σ sur le portefeuille d'actifs (en M\\$, signé) ?`,
          reponse: repJour4, tolerance: 3, toleranceMode: 'absolu', unite: 'M$',
          etapes: [{
            titre: en ? 'Even the "impossible" day is survivable' : 'Même le jour « impossible » est survivable',
            contenu: en
              ? `Daily σ = ${f(volActifs, 2)}%/√252 = ${pct(r2(volActifs / Math.sqrt(252) * 100) / 100, 3)} of assets; a −4σ day = −4 × that × ${mUsd(actifs * 1000)} = **${mUsd(repJour4)}** — about ${pct(r1((Math.abs(perteJour4) / (capital * 1000)) * 100), 1)} of the capital. Under the normal law, −4σ happens roughly once in 30,000 days: the model's WORST imaginable day is a scratch. This is how a fund convinces itself it cannot die: it stress-tests inside the same distribution that produced the calm. The question never asked — the chapter 5 reverse stress test, "what kills us?" — lives outside that distribution.`
              : `σ quotidien = ${f(volActifs, 2)} %/√252 = ${pct(r2(volActifs / Math.sqrt(252) * 100) / 100, 3)} des actifs ; un jour à −4σ = −4 × cela × ${mUsd(actifs * 1000)} = **${mUsd(repJour4)}** — environ ${pct(r1((Math.abs(perteJour4) / (capital * 1000)) * 100), 1)} du capital. Sous la loi normale, −4σ arrive à peu près une fois tous les 30 000 jours : le PIRE jour que le modèle sait imaginer est une égratignure. C'est ainsi qu'un fonds se convainc qu'il ne peut pas mourir : il se stresse à l'intérieur de la même distribution qui a produit le calme. La question jamais posée — le reverse stress test du chapitre 5, « qu'est-ce qui nous tue ? » — vit hors de cette distribution.`,
          }],
          pieges: [en
            ? `Confusing the model's −4σ with the real risk: the measured σ comes from a window without a crisis — the true tail is not four sigmas away, it is in a regime the window never saw (fat tails, module 2).`
            : `Confondre le −4σ du modèle avec le vrai risque : le σ mesuré vient d'une fenêtre sans crise — la vraie queue n'est pas à quatre sigmas, elle est dans un régime que la fenêtre n'a jamais vu (queues épaisses, module 2).`],
        },
        {
          intitule: en ? 'e) August: all the spreads together' : 'e) Août : tous les spreads ensemble',
          enonce: en
            ? `Russia defaults; flight to quality. Every spread widens by ${bp(dSpread)} on a book of spread duration ${f(duration, 1)}. What is the loss on the ${mdUsd(actifs, 0)} of assets (in \\$bn, signed)?`
            : `La Russie fait défaut ; fuite vers la qualité. Tous les spreads s'écartent de ${bp(dSpread)} sur un book de spread duration ${f(duration, 1)}. Quelle est la perte sur les ${mdUsd(actifs, 0)} d'actifs (en Md\\$, signée) ?`,
          reponse: repPerteMd, tolerance: 0.15, toleranceMode: 'absolu', unite: 'Md$',
          etapes: [{
            titre: en ? 'The same bet, a hundred times' : 'Le même pari, cent fois',
            contenu: en
              ? `ΔP = −${f(duration, 1)} × ${f(dSpread, 0)}/100 = ${pct(r2(pertePct), 2)} of assets, i.e. ${pct(r2(pertePct), 2)} × ${f(actifs, 0)} = **${mdUsd(repPerteMd, 2)}**. Compare to b): the move (${pct(r2(pertePct), 2)}) is roughly the FATAL variation (${pct(r2(fatale), 2)}). And measure it in the model's own units: ${f(r0(Math.abs(pertePct) / (volActifs / Math.sqrt(252))), 0)} daily sigmas — the normal forbids it, history schedules it for August. The fund held almost nothing in Russia; that is the whole lesson: every convergence trade was "sell quality, buy the spread" — the default merely triggered the worldwide flight to quality that made all the "independent" positions lose as one. August 1998, the real one: −44% in a month.`
              : `ΔP = −${f(duration, 1)} × ${f(dSpread, 0)}/100 = ${pct(r2(pertePct), 2)} des actifs, soit ${pct(r2(pertePct), 2)} × ${f(actifs, 0)} = **${mdUsd(repPerteMd, 2)}**. Comparez au b) : le mouvement (${pct(r2(pertePct), 2)}) est à peu près la variation FATALE (${pct(r2(fatale), 2)}). Et mesurez-le dans les unités du modèle : ${f(r0(Math.abs(pertePct) / (volActifs / Math.sqrt(252))), 0)} sigmas quotidiens — la normale l'interdit, l'histoire le programme pour un mois d'août. Le fonds n'avait presque rien en Russie ; c'est toute la leçon : chaque trade de convergence était « vendre la qualité, acheter l'écart » — le défaut n'a fait que déclencher la fuite mondiale vers la qualité qui a fait perdre toutes les positions « indépendantes » d'un seul bloc. Août 1998, le vrai : −44 % sur le mois.`,
          }],
          pieges: [en
            ? `"But the positions were diversified across markets": geographic labels are not risk factors — when the factor is "calm continues", a hundred tickers are one position, and the crowded trade means everyone else's forced sales set your exit price.`
            : `« Mais les positions étaient diversifiées entre marchés » : les étiquettes géographiques ne sont pas des facteurs de risque — quand le facteur est « le calme continue », cent lignes sont une seule position, et le crowded trade signifie que les ventes forcées des autres font votre prix de sortie.`],
        },
        {
          intitule: en ? 'f) The capital after' : 'f) Les fonds propres après',
          enonce: en
            ? `Starting capital ${mdUsd(capital)}, loss of e). What capital remains (in \\$bn)?`
            : `Capital de départ ${mdUsd(capital)}, perte du e). Quel capital reste-t-il (en Md\\$) ?`,
          reponse: repCapApres, tolerance: 0.1, toleranceMode: 'absolu', unite: 'Md$',
          etapes: [
            {
              titre: en ? 'Leverage after: the death zone' : 'Le levier d\'après : la zone de mort',
              contenu: en
                ? `Capital = ${f(capital, 1)} + (${f(repPerteMd, 2)}) = **${mdUsd(repCapApres, 2)}**. The assets barely moved (${mdUsd(r2(actifs + perteMd), 1)} remain), so leverage explodes to ${f(r0(levierApres), 0)} — LTCM's real trajectory: capital toward \\$0.4bn by late September, leverage above 250, where a 0.4% flutter is life or death. And the fund can no longer sell anything: the whole market knows its positions, and its own sales crush its own prices. The VaR of c) described a fortress; the fortress had no exit.`
                : `Capital = ${f(capital, 1)} + (${f(repPerteMd, 2)}) = **${mdUsd(repCapApres, 2)}**. Les actifs ont à peine bougé (il en reste ${mdUsd(r2(actifs + perteMd), 1)}), donc le levier explose à ${f(r0(levierApres), 0)} — la trajectoire réelle de LTCM : un capital tombé vers 0,4 Md\\$ fin septembre, un levier au-dessus de 250, où un frémissement de 0,4 % est une question de vie ou de mort. Et le fonds ne peut plus rien vendre : le marché entier connaît ses positions, et ses propres ventes écrasent ses propres prix. La VaR du c) décrivait une forteresse ; la forteresse n'avait pas de sortie.`,
            },
            {
              titre: en ? 'The epilogue of 23 September' : 'L\'épilogue du 23 septembre',
              contenu: en
                ? `The Fed of New York gathers fourteen banks; a PRIVATE consortium injects \\$3.625bn for 90% of the fund — not one public dollar: the Fed lent its meeting room and its authority. The convergences? Realised in 1999, after the fund's death: "the market can stay irrational longer than you can stay solvent". The module 12 closing line, for the oral: **the Sharpe measures a strategy's past; the leverage decides whether it has a future** — a ratio of ${f(repSharpe, 1)} and a fatal move of ${pct(r2(fatale), 1)} were, all along, the same fact read twice.`
                : `La Fed de New York réunit quatorze banques ; un consortium PRIVÉ injecte 3,625 Md\\$ pour 90 % du fonds — pas un dollar public : la Fed a prêté sa salle de réunion et son autorité. Les convergences ? Réalisées en 1999, après la mort du fonds : « le marché peut rester irrationnel plus longtemps que vous ne pouvez rester solvable ». La phrase de clôture du module 12, pour l'oral : **le Sharpe mesure le passé d'une stratégie ; le levier décide si elle a un futur** — un ratio de ${f(repSharpe, 1)} et une variation fatale de ${pct(r2(fatale), 1)} étaient, depuis le début, le même fait lu deux fois.`,
            },
          ],
          pieges: [en
            ? `Concluding "the strategy was bad": the trades converged in 1999 — at leverage ~${f(r0(levier), 0)}, being right eventually and being dead first are perfectly compatible; it was the leverage, not the arbitrage, that killed.`
            : `Conclure « la stratégie était mauvaise » : les trades ont convergé en 1999 — au levier ~${f(r0(levier), 0)}, avoir raison à terme et être mort avant sont parfaitement compatibles ; c'est le levier, pas l'arbitrage, qui a tué.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 16. m12-pb-16 — BOSS : le quant qui vendait de la volatilité — N4   */
/* ------------------------------------------------------------------ */
const vendeurVolatilite: ProblemeMoule = {
  id: 'm12-pb-16', moduleId: M12,
  titre: 'Le quant qui vendait de la volatilité : trois ans de primes, un mois de queue',
  titreEn: 'The quant who sold volatility: three years of premiums, one month of tail',
  typeDeCas: 'Sharpe et risque de queue',
  typeDeCasEn: 'Sharpe ratio and tail risk',
  difficulte: 4,
  scenarios: ['Le comité d\'allocation face au track record lisse', 'Le CRO qui audite le desk d\'options de la maison', 'L\'oral : « pourquoi un Sharpe supérieur à 2 est-il suspect ? »'],
  scenariosEn: ['The allocation committee facing the smooth track record', 'The CRO auditing the house options desk', 'The oral exam: "why is a Sharpe above 2 suspicious?"'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const primeAn = randFloat(rng, 6, 8, 1);       // excès annuel encaissé, %
    const volCalme = randFloat(rng, 2, 3, 1);      // vol réalisée, fenêtre calme
    const nCalme = randInt(rng, 3, 4);             // années calmes
    const ratioQueue = randFloat(rng, 2.7, 3.3, 1);
    const rf = randFloat(rng, 2, 3, 1);
    const perteQueue = -r1(primeAn * ratioQueue);  // % signé, le choc
    const nTot = nCalme + 1;
    const rCalme = r1(rf + primeAn);
    const sharpe0 = ratioSharpe(rCalme, rf, volCalme);
    const cumulPrimes = primeAn * nCalme;
    const anneesPrimes = Math.abs(perteQueue) / primeAn;
    const excesMoyen = (primeAn * nTot + perteQueue) / nTot;
    const volRecalc = Math.abs(perteQueue) * Math.sqrt(nTot - 1) / nTot;
    const sharpe1 = excesMoyen / volRecalc;
    const anneeChoc = r1(primeAn + perteQueue);    // excès de l'année du choc
    const devCalme = r2(primeAn - excesMoyen);     // écart des années calmes
    const devChoc = r2(primeAn + perteQueue - excesMoyen);
    const repSharpe0 = r2(sharpe0);
    const repCumul = r1(cumulPrimes);
    const repAnnees = r1(anneesPrimes);
    const repMoyen = r2(excesMoyen);
    const repVol1 = r2(volRecalc);
    const repSharpe1 = r2(sharpe1);

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `the strategy sells far out-of-the-money options and collects the premiums: ${pct(primeAn, 1)} a year above cash, with a realised volatility of ${pct(volCalme, 1)} over the last ${f(nCalme, 0)} years — not one losing month; cash pays ${pct(rf, 1)}; what the window does not contain: the month the market breaks and the sold insurance pays out — a single shock of ${pct(perteQueue, 1)}, which arrives the following year (a year that still collects its ${pct(primeAn, 1)} of premium before paying)`
      : `la stratégie vend des options loin de la monnaie et encaisse les primes : ${pct(primeAn, 1)} par an au-dessus du cash, avec une volatilité réalisée de ${pct(volCalme, 1)} sur les ${f(nCalme, 0)} dernières années — pas un mois perdant ; le cash paie ${pct(rf, 1)} ; ce que la fenêtre ne contient pas : le mois où le marché casse et où l'assurance vendue rembourse — un choc unique de ${pct(perteQueue, 1)}, qui arrive l'année suivante (une année qui encaisse quand même ses ${pct(primeAn, 1)} de prime avant de payer)`;
    const contexte = (en
      ? [
        `The deck the allocation committee is looking at has one killer slide: a return curve rising like a staircase, ${f(nCalme, 0)} years without a losing month. The quant who runs it explains, honestly, that he "harvests the volatility risk premium". You are the member who read chapter 3, and one number on the slide bothers you more than all the others reassure you: the Sharpe. The file: ${desc}. Your job tonight: recompute the ratio as displayed, then recompute it as it will look the day the premium works in reverse — because selling insurance always means exactly that.`,
        `You are the CRO, and the house options desk has become the floor's darling: steady premiums, tiny measured risk, bonuses to match. Your second line instinct (chapter 6) says: a P&L that smooth is a question, not an answer. The audit file: ${desc}. Walk the numbers the way the chapter demands — the displayed Sharpe, the cumulated premiums, the tail measured in years of premiums, then the honest recomputation over the full cycle. The desk will hate the memo; write it anyway.`,
        `The oral. "Why is a Sharpe above 2 suspicious?" The examiner does not want the slogan — he slides the sheet: ${desc}. "Show me. Compute the displayed ratio, then the tail in years of premiums, then the Sharpe over the whole period. When the number collapses, tell me WHERE the risk was hiding while the ratio looked perfect."`,
      ]
      : [
        `La plaquette que regarde le comité d'allocation a une slide qui tue : une courbe de rendement qui monte comme un escalier, ${f(nCalme, 0)} ans sans un mois perdant. Le quant qui la gère explique, honnêtement, qu'il « récolte la prime de risque de volatilité ». Vous êtes le membre du comité qui a lu le chapitre 3, et un nombre de la slide vous inquiète plus que tous les autres ne vous rassurent : le Sharpe. Le dossier : ${desc}. Votre travail ce soir : recalculer le ratio tel qu'affiché, puis le recalculer tel qu'il sera le jour où la prime marche à l'envers — parce que vendre de l'assurance veut toujours dire exactement cela.`,
        `Vous êtes le CRO, et le desk d'options de la maison est devenu le chouchou de la salle : primes régulières, risque mesuré minuscule, bonus assortis. Votre instinct de deuxième ligne (chapitre 6) dit : un P&L aussi lisse est une question, pas une réponse. Le dossier d'audit : ${desc}. Déroulez les nombres comme le chapitre l'exige — le Sharpe affiché, les primes cumulées, la queue mesurée en années de primes, puis le recalcul honnête sur le cycle complet. Le desk détestera la note ; écrivez-la quand même.`,
        `L'oral. « Pourquoi un Sharpe supérieur à 2 est-il suspect ? » L'examinateur ne veut pas du slogan — il glisse la fiche : ${desc}. « Montrez-moi. Calculez le ratio affiché, puis la queue en années de primes, puis le Sharpe sur la période entière. Quand le nombre s'effondrera, dites-moi OÙ le risque se cachait pendant que le ratio avait l'air parfait. »`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The displayed Sharpe' : 'a) Le Sharpe affiché',
          enonce: en
            ? `Over the calm window: return ${pct(rCalme, 1)}, cash ${pct(rf, 1)}, realised volatility ${pct(volCalme, 1)}. What Sharpe does the deck display?`
            : `Sur la fenêtre calme : rendement ${pct(rCalme, 1)}, cash ${pct(rf, 1)}, volatilité réalisée ${pct(volCalme, 1)}. Quel Sharpe la plaquette affiche-t-elle ?`,
          reponse: repSharpe0, tolerance: 0.05, toleranceMode: 'absolu', unite: '×',
          etapes: [{
            titre: en ? 'Genius, or a window' : 'Un génie, ou une fenêtre',
            contenu: en
              ? `Sharpe = (${f(rCalme, 1)} − ${f(rf, 1)}) / ${f(volCalme, 1)} = **${f(repSharpe0, 2)}** — deep in chapter 3's "suspect" zone (above 2). The mechanism to name in front of the committee: the strategy SELLS INSURANCE — option premiums in, tail risk out. It collects a small regular premium (smooth return, tiny measured volatility, superb Sharpe) and carries a tail that simply has NOT HAPPENED inside the window. Historical volatility cannot see a risk that has not occurred yet.`
              : `Sharpe = (${f(rCalme, 1)} − ${f(rf, 1)}) / ${f(volCalme, 1)} = **${f(repSharpe0, 2)}** — en plein dans la zone « suspect » du chapitre 3 (au-dessus de 2). Le mécanisme à nommer devant le comité : la stratégie VEND DE L'ASSURANCE — primes d'options encaissées, risque de queue porté. Elle touche une petite prime régulière (rendement lisse, volatilité mesurée minuscule, Sharpe superbe) et porte une queue qui, simplement, N'A PAS EU LIEU dans la fenêtre. La volatilité historique ne peut pas voir un risque qui ne s'est pas encore réalisé.`,
          }],
          pieges: [en
            ? `Reading the smooth curve as proof of skill: for an insurance seller, smoothness is the SYMPTOM — the premium drops in every month precisely because the tail has not come through yet.`
            : `Lire la courbe lisse comme une preuve de talent : pour un vendeur d'assurance, la régularité est le SYMPTÔME — la prime tombe chaque mois précisément parce que la queue n'est pas encore passée.`],
        },
        {
          intitule: en ? 'b) The cumulated premiums' : 'b) Le cumul des primes',
          enonce: en
            ? `Over the ${f(nCalme, 0)} calm years, how many points of excess return did the strategy accumulate (simple sum)?`
            : `Sur les ${f(nCalme, 0)} années calmes, combien de points d'excès de rendement la stratégie a-t-elle accumulés (somme simple) ?`,
          reponse: repCumul, tolerance: 0.2, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The staircase that raises money' : 'L\'escalier qui lève des fonds',
            contenu: en
              ? `Cumul = ${f(nCalme, 0)} × ${f(primeAn, 1)} = **${f(repCumul, 1)} points** above cash. This is the number that raises assets: each year seems to confirm the previous one, and the fund grows fastest exactly when the unpriced risk is largest. The desk image: picking up coins in front of a steamroller — the coins are real, the counting is honest, and the steamroller is not in the photo.`
              : `Cumul = ${f(nCalme, 0)} × ${f(primeAn, 1)} = **${f(repCumul, 1)} points** au-dessus du cash. C'est le nombre qui lève des encours : chaque année semble confirmer la précédente, et le fonds grossit le plus vite exactement quand le risque non pricé est le plus gros. L'image du desk : ramasser des pièces devant un rouleau compresseur — les pièces sont réelles, le comptage est honnête, et le rouleau n'est pas sur la photo.`,
          }],
          pieges: [en
            ? `Compounding instead of summing changes little here, but hides the point: the question is not the arithmetic of the gains, it is what has NOT been subtracted from them yet.`
            : `Composer au lieu de sommer change peu ici, mais masque le point : la question n'est pas l'arithmétique des gains, c'est ce qui n'en a pas encore été SOUSTRAIT.`],
        },
        {
          intitule: en ? 'c) The tail, in years of premiums' : 'c) La queue, en années de primes',
          enonce: en
            ? `The shock costs ${pct(perteQueue, 1)} in one month. How many years of premiums (${pct(primeAn, 1)} per year) does it give back?`
            : `Le choc coûte ${pct(perteQueue, 1)} en un mois. Combien d'années de primes (${pct(primeAn, 1)} par an) rend-il ?`,
          reponse: repAnnees, tolerance: 0.1, toleranceMode: 'absolu', unite: en ? 'years' : 'années',
          etapes: [{
            titre: en ? 'The exchange rate of sold insurance' : 'Le taux de change de l\'assurance vendue',
            contenu: en
              ? `${f(Math.abs(perteQueue), 1)} / ${f(primeAn, 1)} = **${f(repAnnees, 1)} years of premiums**, returned in one month. That is the structural asymmetry of the trade: gains capped at the premium, losses bounded only by the strike (module 8: a sold put). The exchange rate is not an accident, it is the PRICE of the smoothness — whoever buys the insurance pays those small premiums precisely so that, one month out of fifty, someone else takes this hit.`
              : `${f(Math.abs(perteQueue), 1)} / ${f(primeAn, 1)} = **${f(repAnnees, 1)} années de primes**, rendues en un mois. C'est l'asymétrie structurelle du trade : gains plafonnés à la prime, pertes bornées seulement par le strike (module 8 : un put vendu). Le taux de change n'est pas un accident, c'est le PRIX de la régularité — celui qui achète l'assurance paie ces petites primes précisément pour qu'un mois sur cinquante, quelqu'un d'autre encaisse ce choc.`,
          }],
          pieges: [en
            ? `Comparing the shock to b)'s cumul and concluding "a net gain remains" too fast: the honest comparison recomputes mean AND volatility over the whole period — next questions.`
            : `Comparer le choc au cumul du b) et conclure « il reste un gain net » trop vite : la comparaison honnête recalcule moyenne ET volatilité sur la période entière — questions suivantes.`],
        },
        {
          intitule: en ? 'd) The mean, full window' : 'd) La moyenne, fenêtre complète',
          enonce: en
            ? `Over the ${f(nTot, 0)} years (${f(nCalme, 0)} calm at +${pct(primeAn, 1)}, plus the shock year which collects its premium THEN pays: ${f(primeAn, 1)} + (${f(perteQueue, 1)}) = ${pct(anneeChoc, 1)}), what is the average annual excess return?`
            : `Sur les ${f(nTot, 0)} années (${f(nCalme, 0)} calmes à +${pct(primeAn, 1)}, plus l'année du choc qui encaisse sa prime PUIS paie : ${f(primeAn, 1)} + (${f(perteQueue, 1)}) = ${pct(anneeChoc, 1)}), quel est l'excès de rendement moyen annuel ?`,
          reponse: repMoyen, tolerance: 0.1, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The premium was mostly a loan' : 'La prime était surtout un prêt',
            contenu: en
              ? `Mean = (${f(nTot, 0)} × ${f(primeAn, 1)} + (${f(perteQueue, 1)})) / ${f(nTot, 0)} = **${pct(repMoyen, 2)}** per year — against the ${pct(primeAn, 1)} the deck displayed. Most of what the strategy "earned" was an advance on a claim it had not paid yet. What remains is not zero: the volatility risk premium is real, academically documented. But it is THIS size — a modest carry — not the miracle of slide one.`
              : `Moyenne = (${f(nTot, 0)} × ${f(primeAn, 1)} + (${f(perteQueue, 1)})) / ${f(nTot, 0)} = **${pct(repMoyen, 2)}** par an — contre les ${pct(primeAn, 1)} affichés par la plaquette. L'essentiel de ce que la stratégie « gagnait » était une avance sur un sinistre pas encore payé. Ce qui reste n'est pas nul : la prime de risque de volatilité existe, documentée académiquement. Mais elle a CETTE taille — un portage modeste — pas le miracle de la slide un.`,
          }],
          pieges: [en
            ? `Forgetting that the shock year also collects its premium: the black year's excess is ${f(primeAn, 1)} + (${f(perteQueue, 1)}) = ${pct(anneeChoc, 1)}, not ${pct(perteQueue, 1)} — the error flatters the disaster and ruins the average.`
            : `Oublier que l'année du choc encaisse aussi sa prime : l'excès de l'année noire est ${f(primeAn, 1)} + (${f(perteQueue, 1)}) = ${pct(anneeChoc, 1)}, pas ${pct(perteQueue, 1)} — l'erreur noircit le désastre et fausse la moyenne.`],
        },
        {
          intitule: en ? 'e) The volatility, recomputed' : 'e) La volatilité, recalculée',
          enonce: en
            ? `Compute the (population) standard deviation of the ${f(nTot, 0)} annual excess returns: ${f(nCalme, 0)} years at +${pct(primeAn, 1)} and one at ${pct(anneeChoc, 1)}.`
            : `Calculez l'écart-type (de population) des ${f(nTot, 0)} excès annuels : ${f(nCalme, 0)} années à +${pct(primeAn, 1)} et une à ${pct(anneeChoc, 1)}.`,
          reponse: repVol1, tolerance: 0.3, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The outlier IS the strategy' : 'L\'outlier EST la stratégie',
            contenu: en
              ? `Mean ${f(repMoyen, 2)}; deviations: ${f(devCalme, 2)} for each calm year, ${f(devChoc, 2)} for the shock year. σ = √((${f(nCalme, 0)} × ${f(devCalme, 2)}² + (${f(devChoc, 2)})²)/${f(nTot, 0)}) = **${pct(repVol1, 2)}** — against the ${pct(volCalme, 1)} measured on the calm window: the true volatility was ${f(r1(volRecalc / volCalme), 1)} times larger, waiting off-camera. This is the statistical vice of chapter 5, in miniature: estimating a distribution's dispersion with a sample that excludes its tail.`
              : `Moyenne ${f(repMoyen, 2)} ; écarts : ${f(devCalme, 2)} pour chaque année calme, ${f(devChoc, 2)} pour l'année du choc. σ = √((${f(nCalme, 0)} × ${f(devCalme, 2)}² + (${f(devChoc, 2)})²)/${f(nTot, 0)}) = **${pct(repVol1, 2)}** — contre les ${pct(volCalme, 1)} mesurés sur la fenêtre calme : la vraie volatilité était ${f(r1(volRecalc / volCalme), 1)} fois plus grande, elle attendait hors champ. C'est le vice statistique du chapitre 5, en miniature : estimer la dispersion d'une distribution avec un échantillon qui exclut sa queue.`,
          }],
          pieges: [en
            ? `Recomputing the vol WITHOUT the "outlier": the outlier is the strategy — removing the tail from a sold-insurance track record measures a product that does not exist.`
            : `Recalculer la vol SANS l'« outlier » : l'outlier est la stratégie — retirer la queue du track record d'une vente d'assurance, c'est mesurer un produit qui n'existe pas.`],
        },
        {
          intitule: en ? 'f) The Sharpe, recomputed' : 'f) Le Sharpe recalculé',
          enonce: en
            ? `Divide the full-window mean of d) by the recomputed volatility of e). What is the honest Sharpe?`
            : `Divisez la moyenne de d) par la volatilité recalculée du e). Quel est le Sharpe honnête ?`,
          reponse: repSharpe1, tolerance: 0.05, toleranceMode: 'absolu', unite: '×',
          etapes: [
            {
              titre: en ? 'From miracle to mediocre' : 'Du miracle au médiocre',
              contenu: en
                ? `Sharpe = ${f(repMoyen, 2)} / ${f(repVol1, 2)} = **${f(repSharpe1, 2)}** — the displayed ${f(repSharpe0, 2)} has collapsed BELOW the 0.3-0.5 of a passive equity tracker (chapter 3's scale). Nothing in the strategy changed between the two computations: only the window did. The ratio was never measuring talent; it was measuring the distance to the last tail event.`
                : `Sharpe = ${f(repMoyen, 2)} / ${f(repVol1, 2)} = **${f(repSharpe1, 2)}** — les ${f(repSharpe0, 2)} affichés se sont effondrés SOUS les 0,3-0,5 d'un tracker actions passif (l'échelle du chapitre 3). Rien dans la stratégie n'a changé entre les deux calculs : seulement la fenêtre. Le ratio n'a jamais mesuré du talent ; il mesurait la distance au dernier événement de queue.`,
            },
            {
              titre: en ? 'The desk rule' : 'La règle du desk',
              contenu: en
                ? `In front of any Sharpe above 2, one question before any admiration: WHERE does the return come from? Option selling, credit carry, convergence arbitrage — the strategies that sell insurance all have a superb Sharpe until the day they have a true one (LTCM displayed above 4 — module 11, chapter 3). The standard deviation does not capture the tail (kurtosis, module 2); the expected shortfall and the stress test look exactly where the Sharpe does not. The committee sentence: this fund does not have a Sharpe of ${f(repSharpe0, 1)} — it has a Sharpe of ${f(repSharpe1, 1)} and a very good marketing window.`
                : `Devant tout Sharpe au-dessus de 2, une question avant toute admiration : D'OÙ vient le rendement ? Vente d'options, portage de crédit, arbitrage de convergence — les stratégies qui vendent de l'assurance ont toutes un Sharpe superbe jusqu'au jour où elles en ont un vrai (LTCM affichait plus de 4 — module 11, chapitre 3). L'écart-type ne capte pas la queue (kurtosis, module 2) ; l'expected shortfall et le stress test regardent exactement là où le Sharpe ne regarde pas. La phrase pour le comité : ce fonds n'a pas un Sharpe de ${f(repSharpe0, 1)} — il a un Sharpe de ${f(repSharpe1, 1)} et une très bonne fenêtre de marketing.`,
            },
          ],
          pieges: [en
            ? `Blaming the shock year's "bad luck": at ${f(repAnnees, 1)} years of premiums per tail event, the strategy was close to break-even BEFORE fees — the displayed Sharpe was not measuring an edge, it was measuring a window.`
            : `Accuser la « malchance » de l'année du choc : à ${f(repAnnees, 1)} années de primes par événement de queue, la stratégie était proche de l'équilibre AVANT frais — le Sharpe affiché ne mesurait pas un avantage, il mesurait une fenêtre.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 17. m12-pb-17 — BOSS : SVB, le stress test qu'on n'a pas fait — N4  */
/* ------------------------------------------------------------------ */
const svbStressTest: ProblemeMoule = {
  id: 'm12-pb-17', moduleId: M12,
  titre: 'SVB : le stress test qu\'on n\'a pas fait',
  titreEn: 'SVB: the stress test nobody ran',
  typeDeCas: 'risque de taux et liquidité',
  typeDeCasEn: 'interest-rate and liquidity risk',
  difficulte: 4,
  scenarios: ['L\'analyste qui relit le bilan, fin 2022', 'Le superviseur qui aurait dû exiger le test', 'L\'oral : « comment meurt une banque qui ne détient que des Treasuries ? »'],
  scenariosEn: ['The analyst rereading the balance sheet, late 2022', 'The supervisor who should have required the test', 'The oral exam: "how does a bank holding only Treasuries die?"'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const titres = randInt(rng, 130, 160);      // Md$ de titres longs
    const duration = randFloat(rng, 5.5, 6, 1);
    const chocPb = randInt(rng, 190, 220);      // pb
    const fonds = randInt(rng, 14, 16);         // Md$ fonds propres
    const depots = randInt(rng, 165, 190);      // Md$
    const hqla = randInt(rng, 26, 34);          // Md$ réellement liquides
    const retraitPct = randInt(rng, 22, 26);    // % des dépôts en un jour
    const dPct = variationPrixSpreadPct(duration, chocPb);   // % signé
    const latente = (dPct / 100) * titres;                   // Md$ signé
    const fpEco = fonds + latente;
    const retraits = (retraitPct / 100) * depots;            // Md$
    const lcrJour = lcrPct(hqla, retraits);
    const besoin = retraits - hqla;
    const decote = Math.abs(dPct);
    const vente = venteForceePourCash(besoin, decote);       // Md$ valeur comptable
    const perteRealisee = vente - besoin;                    // Md$
    const repDPct = r2(dPct);
    const repLatente = r1(latente);
    const repFpEco = r1(fpEco);
    const repRetraits = r1(retraits);
    const repLcr = r1(lcrJour);
    const repVente = r1(vente);

    const { en, f, pct } = outils(langue);
    const mdUsd = (v: number, d = 1) => (en ? `\\$${f(v, d)}bn` : `${f(v, d)} Md\\$`);
    const desc = en
      ? `the balance sheet, late 2022: ${mdUsd(titres, 0)} of long Treasuries and MBS, duration ${f(duration, 1)}, bought at the top of the bond market; ${mdUsd(depots, 0)} of deposits, more than 90% above the \\$250k insurance cap; ${mdUsd(fonds, 0)} of equity; ${mdUsd(hqla, 0)} of genuinely liquid assets; the Fed has just hiked +425 bp, and the scenario nobody ran: +${f(chocPb, 0)} bp on the part of the curve carrying the portfolio, then a day when ${pct(retraitPct, 0)} of the deposits ask to leave`
      : `le bilan, fin 2022 : ${mdUsd(titres, 0)} de Treasuries et MBS longs, duration ${f(duration, 1)}, achetés au sommet du marché obligataire ; ${mdUsd(depots, 0)} de dépôts, plus de 90 % au-dessus du plafond de garantie de 250 k\\$ ; ${mdUsd(fonds, 0)} de fonds propres ; ${mdUsd(hqla, 0)} d'actifs réellement liquides ; la Fed vient de monter de +425 pb, et le scénario que personne n'a posé : +${f(chocPb, 0)} pb sur la partie de la courbe qui porte le portefeuille, puis un jour où ${pct(retraitPct, 0)} des dépôts demandent la sortie`;
    const contexte = (en
      ? [
        `December 2022. You are a bank analyst, and this regional bank's file bothers you for a reason you cannot name yet: no bad loans, no exotic trades, a balance sheet full of the safest paper on earth — and a share price that assumes nothing can happen. The file: ${desc}. Chapter 5 taught you that a stress test is one multiplication and one honest question. Run both: the duration arithmetic first, then the run arithmetic. The bank you are looking at is already dead; the computation is how you find out before March (module 11, chapter 7).`,
        `You are the supervisor, and the exemption file is on your desk: this bank, "mid-sized", sits outside the full LCR regime. The chapter 6 doctrine says solvency and liquidity are two different deaths; this balance sheet is a laboratory for the second: ${desc}. Run the test the rules did not require: mark the portfolio to a +${f(chocPb, 0)} bp world, weigh the equity against the latent loss, then time the run against the liquid assets. Then write the memo you wish had been written in 2022.`,
        `The oral. "How does a bank die holding only Treasuries and agency MBS — no defaults, not one?" The examiner hands you the sheet: ${desc}. "Four steps: duration, latent loss, economic equity, then the run. At each step, one number. And finish with the accounting detail that hid the corpse — and the reason the run always wins."`,
      ]
      : [
        `Décembre 2022. Vous êtes analyste bancaire, et le dossier de cette banque régionale vous dérange pour une raison que vous ne savez pas encore nommer : pas de mauvais prêts, pas de trades exotiques, un bilan plein du papier le plus sûr du monde — et un cours qui suppose que rien ne peut arriver. Le dossier : ${desc}. Le chapitre 5 vous a appris qu'un stress test est une multiplication et une question honnête. Faites les deux : l'arithmétique de duration d'abord, l'arithmétique du run ensuite. La banque que vous regardez est déjà morte ; le calcul est la façon de le découvrir avant mars (module 11, chapitre 7).`,
        `Vous êtes le superviseur, et le dossier d'exemption est sur votre bureau : cette banque, « moyenne », vit hors du régime LCR complet. La doctrine du chapitre 6 dit que solvabilité et liquidité sont deux morts différentes ; ce bilan est un laboratoire de la seconde : ${desc}. Faites le test que les règles n'exigeaient pas : valorisez le portefeuille dans un monde à +${f(chocPb, 0)} pb, pesez les fonds propres contre la moins-value latente, puis chronométrez le run contre les actifs liquides. Puis écrivez la note que vous auriez voulu voir écrite en 2022.`,
        `L'oral. « Comment meurt une banque qui ne détient que des Treasuries et des MBS d'agences — aucun défaut, pas un seul ? » L'examinateur vous tend la fiche : ${desc}. « Quatre étapes : la duration, la moins-value latente, les fonds propres économiques, puis le run. À chaque étape, un nombre. Et finissez par le détail comptable qui a caché le cadavre — et la raison pour laquelle le run gagne toujours. »`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The duration speaks' : 'a) La duration parle',
          enonce: en
            ? `Duration ${f(duration, 1)}, rate shock +${f(chocPb, 0)} bp. What is the price change of the portfolio, in % (signed)?`
            : `Duration ${f(duration, 1)}, choc de taux +${f(chocPb, 0)} pb. Quelle est la variation de prix du portefeuille, en % (signée) ?`,
          reponse: repDPct, tolerance: 0.1, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'One line of arithmetic' : 'Une ligne d\'arithmétique',
            contenu: en
              ? `ΔP/P ≈ −D × Δr = −${f(duration, 1)} × ${f(r2(chocPb / 100), 1)} points = **${pct(repDPct, 2)}**. The same arithmetic as module 5's spread duration, with the shock coming from rates instead of credit. The real SVB line: −5.7 × 2 ≈ −11.4%. Notice what the formula does NOT need: no default, no downgrade, no bad borrower — duration converts a rate move into a loss all by itself.`
              : `ΔP/P ≈ −D × Δr = −${f(duration, 1)} × ${f(r2(chocPb / 100), 1)} point = **${pct(repDPct, 2)}**. La même arithmétique que la spread duration du module 5, le choc venant des taux au lieu du crédit. La ligne réelle de SVB : −5,7 × 2 ≈ −11,4 %. Notez ce dont la formule n'a PAS besoin : aucun défaut, aucune dégradation, aucun mauvais emprunteur — la duration convertit un mouvement de taux en perte toute seule.`,
          }],
          pieges: [en
            ? `"Treasuries are riskless": riskless in CREDIT. Interest-rate risk is not credit risk — nothing in the portfolio ever defaulted, and it still killed the equity. Confusing the two is the exact blind spot that hid this bank.`
            : `« Les Treasuries sont sans risque » : sans risque de CRÉDIT. Le risque de taux n'est pas un risque de crédit — rien dans le portefeuille n'a jamais fait défaut, et il a quand même tué les fonds propres. Confondre les deux est exactement l'angle mort qui a caché cette banque.`],
        },
        {
          intitule: en ? 'b) The latent loss' : 'b) La moins-value latente',
          enonce: en
            ? `Apply the ${pct(repDPct, 2)} of a) to the ${mdUsd(titres, 0)} of securities. What is the latent loss, in \\$bn (signed)?`
            : `Appliquez les ${pct(repDPct, 2)} du a) aux ${mdUsd(titres, 0)} de titres. Quelle est la moins-value latente, en Md\\$ (signée) ?`,
          reponse: repLatente, tolerance: 0.5, toleranceMode: 'absolu', unite: 'Md$',
          etapes: [{
            titre: en ? 'The loss accounting does not see' : 'La perte que la comptabilité ne voit pas',
            contenu: en
              ? `${pct(repDPct, 2)} × ${f(titres, 0)} = **${mdUsd(repLatente)}** (SVB real: about −\\$16bn on ~\\$140bn). Now the accounting detail that hid the corpse: securities classified held-to-maturity stay AT COST — as long as you do not sell, the loss does not exist on paper. It exists economically all the same: it only takes being FORCED to sell for it to materialise. Keep that word, "forced" — it is the hinge of the whole problem.`
              : `${pct(repDPct, 2)} × ${f(titres, 0)} = **${mdUsd(repLatente)}** (SVB réel : environ −16 Md\\$ sur ~140 Md\\$). Maintenant, le détail comptable qui a caché le cadavre : les titres classés held-to-maturity restent AU COÛT D'ACHAT — tant qu'on ne vend pas, la perte n'existe pas sur le papier. Elle existe économiquement quand même : il suffit d'être FORCÉ de vendre pour qu'elle se matérialise. Gardez ce mot, « forcé » — c'est le gond de tout le problème.`,
          }],
          pieges: [en
            ? `"Not sold, not lost": a balance sheet can look presentable while the economic net worth is destroyed — and a run is precisely the machine that forces the sale.`
            : `« Pas vendu, pas perdu » : un bilan peut rester présentable pendant que le patrimoine économique est détruit — et un run est précisément la machine qui force la vente.`],
        },
        {
          intitule: en ? 'c) The economic equity' : 'c) Les fonds propres économiques',
          enonce: en
            ? `${mdUsd(fonds, 0)} of book equity, plus the latent loss of b). What is the ECONOMIC equity, in \\$bn (signed)?`
            : `${mdUsd(fonds, 0)} de fonds propres comptables, plus la moins-value latente du b). Que valent les fonds propres ÉCONOMIQUES, en Md\\$ (signés) ?`,
          reponse: repFpEco, tolerance: 0.3, toleranceMode: 'absolu', unite: 'Md$',
          etapes: [{
            titre: en ? 'Dead in silence' : 'Morte en silence',
            contenu: en
              ? `${f(fonds, 0)} + (${f(repLatente, 1)}) = **${mdUsd(repFpEco)}**. ${repFpEco <= 0 ? 'Negative: the bank is economically dead — the mark-to-market loss exceeds every dollar of capital' : 'Nearly nothing: the mark-to-market loss has consumed almost all the capital'}, and nobody sees it, because the accounts do not say it. The stress test nobody ran cost one line: duration × shock × holdings, chapter 5's crude question. The regulatorily solvent bank of the eve and the economically dead bank of the same evening are the same bank.`
              : `${f(fonds, 0)} + (${f(repLatente, 1)}) = **${mdUsd(repFpEco)}**. ${repFpEco <= 0 ? 'Négatif : la banque est économiquement morte — la perte en valeur de marché dépasse chaque dollar de capital' : 'Presque rien : la perte en valeur de marché a mangé la quasi-totalité du capital'}, et personne ne le voit, parce que les comptes ne le disent pas. Le stress test que personne n'a fait coûtait une ligne : duration × choc × encours, la question fruste du chapitre 5. La banque réglementairement solvable de la veille et la banque économiquement morte du même soir sont la même banque.`,
          }],
          pieges: [en
            ? `Trusting the displayed solvency ratios: the perimeter matters — SVB enjoyed exemptions from the full LCR regime, and HTM accounting kept the ratios blind. A ratio protects only those it is applied to, on numbers that tell the truth.`
            : `Se fier aux ratios de solvabilité affichés : le périmètre compte — SVB bénéficiait d'exemptions au régime LCR complet, et la comptabilité HTM gardait les ratios aveugles. Un ratio ne protège que ceux à qui on l'applique, sur des nombres qui disent la vérité.`],
        },
        {
          intitule: en ? 'd) 9 March: the run' : 'd) Le 9 mars : le run',
          enonce: en
            ? `In one day, ${pct(retraitPct, 0)} of the ${mdUsd(depots, 0)} of deposits ask out. How many \\$bn is that?`
            : `En un jour, ${pct(retraitPct, 0)} des ${mdUsd(depots, 0)} de dépôts demandent la sortie. Combien de Md\\$ cela fait-il ?`,
          reponse: repRetraits, tolerance: 0.5, toleranceMode: 'absolu', unite: 'Md$',
          etapes: [{
            titre: en ? 'The smartphone-speed run' : 'Le run à la vitesse du smartphone',
            contenu: en
              ? `${f(retraitPct, 0)}% × ${f(depots, 0)} = **${mdUsd(repRetraits)}** demanded in ONE day — the real 9 March 2023: \\$42bn, about a quarter of the deposits, coordinated by Twitter and the venture-capital group chats. The 1907 run took weeks of queues; this one takes hours, without a single queue. And note WHO runs first: the uninsured deposits — above the cap, they have nothing to gain by staying. Deposit insurance only anchors what it covers; a 90%-uninsured deposit base is a risk datum as hard as any duration.`
              : `${f(retraitPct, 0)} % × ${f(depots, 0)} = **${mdUsd(repRetraits)}** demandés en UNE journée — le 9 mars 2023 réel : 42 Md\\$, environ un quart des dépôts, coordonnés par Twitter et les group chats du capital-risque. Le run de 1907 prenait des semaines de files d'attente ; celui-ci prend des heures, sans une seule file. Et notez QUI court en premier : les dépôts non assurés — au-dessus du plafond, ils n'ont rien à gagner à rester. La garantie des dépôts n'ancre que ce qu'elle couvre ; une base de dépôts non assurée à 90 % est une donnée de risque aussi dure qu'une duration.`,
          }],
          pieges: [en
            ? `Testing liquidity against the REGULATORY 30-day scenario only: the real run put a quarter of the deposits in one morning — the ratio is necessary, not sufficient, and the scenario is a floor, not a forecast.`
            : `Tester la liquidité contre le seul scénario RÉGLEMENTAIRE à 30 jours : le run réel a mis un quart des dépôts en une matinée — le ratio est nécessaire, pas suffisant, et le scénario est un plancher, pas une prévision.`],
        },
        {
          intitule: en ? 'e) The day\'s LCR' : 'e) Le LCR du jour',
          enonce: en
            ? `${mdUsd(hqla, 0)} of liquid assets against the ${mdUsd(repRetraits)} of outflows of d). What coverage ratio does that make (in %)?`
            : `${mdUsd(hqla, 0)} d'actifs liquides contre les ${mdUsd(repRetraits)} de sorties du d). Quel taux de couverture cela fait-il (en %) ?`,
          reponse: repLcr, tolerance: 1, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Below the waterline' : 'Sous la ligne de flottaison',
            contenu: en
              ? `${f(hqla, 0)} / ${f(repRetraits, 1)} × 100 = **${pct(repLcr, 1)}** — far below the 100% that would mean surviving without the central bank. The chapter 6 lesson in one line: SOLVENCY does not protect from a run — no bank on earth covers a quarter of its deposits in same-day liquid assets. Liquidity and solvency are two separate deaths, measured separately; this bank is dying of both at once, in the wrong order for anyone to stop it.`
              : `${f(hqla, 0)} / ${f(repRetraits, 1)} × 100 = **${pct(repLcr, 1)}** — très en dessous des 100 % qui signifieraient survivre sans banque centrale. La leçon du chapitre 6 en une ligne : la SOLVABILITÉ ne protège pas d'un run — aucune banque au monde ne couvre un quart de ses dépôts en actifs liquides du jour même. Liquidité et solvabilité sont deux morts distinctes, mesurées séparément ; cette banque meurt des deux à la fois, dans le mauvais ordre pour qu'on puisse l'arrêter.`,
          }],
          pieges: [en
            ? `Believing a compliant LCR the day before would have saved it: the LCR scenario spreads outflows over 30 days of stress — a mobile-speed run compresses them into hours, beyond any prescribed scenario.`
            : `Croire qu'un LCR conforme la veille l'aurait sauvée : le scénario du LCR étale les sorties sur 30 jours de stress — un run à la vitesse du mobile les comprime en quelques heures, au-delà de tout scénario prescrit.`],
        },
        {
          intitule: en ? 'f) The forced sale — and the run wins' : 'f) La vente forcée — et le run gagne',
          enonce: en
            ? `The gap to fund is ${f(r1(besoin), 1)} \\$bn (outflows minus liquid assets). Selling bonds that trade ${pct(r2(decote), 2)} below book value, how many \\$bn of BOOK value must be sold?`
            : `Le trou à financer est de ${f(r1(besoin), 1)} Md\\$ (sorties moins actifs liquides). En vendant des titres qui cotent ${pct(r2(decote), 2)} sous leur valeur comptable, combien de Md\\$ de valeur COMPTABLE faut-il céder ?`,
          reponse: repVente, tolerance: 0.5, toleranceMode: 'absolu', unite: 'Md$',
          etapes: [
            {
              titre: en ? 'The sale that makes the death public' : 'La vente qui rend la mort publique',
              contenu: en
                ? `To raise ${f(r1(besoin), 1)} under a ${pct(r2(decote), 2)} discount: ${f(r1(besoin), 1)} / (1 − ${f(r2(decote / 100), 3)}) = **${mdUsd(repVente)}** of book value — and the sale REALISES ${mdUsd(r1(perteRealisee))} of loss: the latent becomes official. That is the real 8 March: \\$21bn sold, \\$1.8bn of realised loss, a capital raise announced the same evening — the signal that turned a worry into the \\$42bn of 9 March. Closed on the morning of the 10th, second-largest bank failure in American history.`
                : `Pour lever ${f(r1(besoin), 1)} sous une décote de ${pct(r2(decote), 2)} : ${f(r1(besoin), 1)} / (1 − ${f(r2(decote / 100), 3)}) = **${mdUsd(repVente)}** de valeur comptable — et la vente ACTE ${mdUsd(r1(perteRealisee))} de perte : la latente devient officielle. C'est le 8 mars réel : 21 Md\\$ vendus, 1,8 Md\\$ de perte réalisée, une augmentation de capital annoncée le soir même — le signal qui a transformé une inquiétude en 42 Md\\$ le 9 mars. Fermée le 10 au matin, deuxième plus grosse faillite bancaire américaine.`,
            },
            {
              titre: en ? 'Why the run wins' : 'Pourquoi le run gagne',
              contenu: en
                ? `Against a dead balance sheet, the run always wins: each sale realises the latent loss, which justifies the next withdrawal, which forces the next sale. The backstop of Sunday 12 March — ALL deposits guaranteed, and the Fed's BTFP lending AT PAR against collateral quoted below par — is Bagehot bent for a duration crisis: lend generously and pretend the mark does not exist. The module 12 close: the stress test cost one multiplication a year earlier — duration × shock × holdings — and the ${mdUsd(repLatente)} of question b) was the entire epitaph, available to anyone who did the arithmetic.`
                : `Contre un bilan mort, le run gagne toujours : chaque vente réalise la perte latente, qui justifie le retrait suivant, qui force la vente suivante. Le backstop du dimanche 12 mars — TOUS les dépôts garantis, et le BTFP de la Fed qui prête AU PAIR contre du collatéral qui cote sous le pair — est un Bagehot tordu pour une crise de duration : prêter largement en faisant semblant que la valorisation n'existe pas. La clôture module 12 : le stress test coûtait une multiplication un an plus tôt — duration × choc × encours — et les ${mdUsd(repLatente)} de la question b) étaient toute l'épitaphe, à la portée de quiconque faisait l'arithmétique.`,
            },
          ],
          pieges: [en
            ? `Looking for the culprit in credit: not one default in the portfolio. The killing trio is long duration + concentrated uninsured deposits + HTM accounting — an unhedged rate risk on a runnable balance sheet is a liquidity crisis in waiting.`
            : `Chercher le coupable dans le crédit : pas un défaut dans le portefeuille. Le trio qui tue est duration longue + dépôts concentrés non assurés + comptabilité HTM — un risque de taux non couvert sur un bilan « runnable » est une crise de liquidité en germe.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 18. m12-pb-18 — BOSS : le mandat ESG sous le feu — N4               */
/* ------------------------------------------------------------------ */
const mandatEsg: ProblemeMoule = {
  id: 'm12-pb-18', moduleId: M12,
  titre: 'Le mandat ESG sous le feu : article 9, la laisse et le pari sectoriel',
  titreEn: 'The ESG mandate under fire: Article 9, the leash and the sector bet',
  typeDeCas: 'ESG, tracking error et performance',
  typeDeCasEn: 'ESG, tracking error and performance',
  difficulte: 4,
  scenarios: ['Le gérant du fonds article 9 convoqué par le comité produits', 'Le consultant qui audite le mandat pour le fonds de pension', 'L\'oral : « l\'ESG coûte-t-il du rendement ? »'],
  scenariosEn: ['The Article 9 fund manager summoned by the product committee', 'The consultant auditing the mandate for the pension fund', 'The oral exam: "does ESG cost returns?"'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const teMandat = randFloat(rng, 2, 3, 1);
    const surp0 = randFloat(rng, 1, 1.5, 1);
    const rf = randFloat(rng, 2, 3, 1);
    const rIdx = randFloat(rng, 6, 8, 1);
    const volIdx = randInt(rng, 14, 16);
    const w = randInt(rng, 60, 70);          // % croissance/techno après exclusions
    const volTech = randInt(rng, 20, 24);
    const volAutre = randInt(rng, 12, 15);
    const rho = randFloat(rng, 0.5, 0.7, 1);
    const pExcl = randInt(rng, 8, 12);       // % de l'indice exclu
    const rEner = randInt(rng, 25, 35);      // surperformance du secteur exclu, %
    const te1 = randFloat(rng, 4, 5, 1);     // tracking error réalisée
    const ir0 = ratioInformation(surp0, teMandat);
    const vol1 = volatilitePortefeuille2Actifs(w, volTech, volAutre, rho);
    const drag = (pExcl / 100) * rEner;      // points de sous-performance mécanique
    const surpNette = surp0 - drag;          // signé, négatif
    const ir1 = ratioInformation(surpNette, te1);
    const sharpeFonds = ratioSharpe(rIdx + surpNette, rf, vol1);
    const sharpeIdx = ratioSharpe(rIdx, rf, volIdx);
    const repIr0 = r2(ir0);
    const repVol1 = r2(vol1);
    const repDrag = r2(drag);
    const repSurpNette = r2(surpNette);
    const repIr1 = r2(ir1);
    const repSharpeF = r2(sharpeFonds);
    const repSharpeI = r2(sharpeIdx);

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `the equity fund is classed Article 9 ("dark green") against a broad index: index return ${pct(rIdx, 1)}, index volatility ${pct(volIdx, 0)}, cash at ${pct(rf, 1)}; the prospectus sold ${pct(surp0, 1)} of outperformance for ${pct(teMandat, 1)} of tracking error; late 2022, the regulator tightens what "Article 9" requires: the exclusions widen — energy and materials go, i.e. ${pct(pExcl, 0)} of the index — and the portfolio ends up ${pct(w, 0)} in growth/tech (volatility ${pct(volTech, 0)}) and ${pct(100 - w, 0)} in the rest (volatility ${pct(volAutre, 0)}), correlation ${f(rho, 1)}; the year oil surges, the excluded sector beats the rest by ${pct(rEner, 0)}; the realised tracking error climbs to ${pct(te1, 1)}`
      : `le fonds actions est classé article 9 (« vert foncé ») contre un indice large : rendement de l'indice ${pct(rIdx, 1)}, volatilité de l'indice ${pct(volIdx, 0)}, cash à ${pct(rf, 1)} ; le prospectus vendait ${pct(surp0, 1)} de surperformance pour ${pct(teMandat, 1)} de tracking error ; fin 2022, le régulateur précise ce qu'« article 9 » exige : les exclusions s'élargissent — l'énergie et les matériaux sortent, soit ${pct(pExcl, 0)} de l'indice — et le portefeuille se retrouve à ${pct(w, 0)} en croissance/techno (volatilité ${pct(volTech, 0)}) et ${pct(100 - w, 0)} sur le reste (volatilité ${pct(volAutre, 0)}), corrélation ${f(rho, 1)} ; l'année où le pétrole flambe, le secteur exclu bat le reste de ${pct(rEner, 0)} ; la tracking error réalisée monte à ${pct(te1, 1)}`;
    const contexte = (en
      ? [
        `Monday, 9 a.m., product committee — and you are the item on the agenda. You run the house's flagship Article 9 fund, the year was brutal, and the head of products has the client letter in hand: "underperformance, tracking error breach, and we pay active ESG fees for this?". The file: ${desc}. Your defence cannot be a speech — DWS taught the industry what happens when ESG claims outrun ESG numbers (raid in May 2022, CEO resignation, \\$19m SEC fine). Requantify everything: the IR you sold, the volatility the exclusions built, the mechanical cost of the sector bet, and what remains of the mandate's promise.`,
        `The pension fund pays you to audit its external managers, and the ESG mandate is this year's file: an Article 9 fund that missed its index the year energy surged. The manager blames "the ESG headwind"; your job is to give the board the honest decomposition: ${desc}. Chapter 7's method: no slogans, numbers — what the exclusions did to the risk (chapter 1's algebra), what the sector bet cost (chapter 3's yardsticks), and whether the letter deserves renewal, resizing, or termination.`,
        `The oral. "Does ESG cost returns?" The examiner refuses the slogan in both directions, and slides the sheet: ${desc}. "Compute: the information ratio before, the volatility after exclusions, the mechanical drag the year oil surges, the IR after. Then give me the answer that holds: what exactly is being paid, by whom, and what would you tell the client who signed for dark green?"`,
      ]
      : [
        `Lundi, 9 h, comité produits — et le point à l'ordre du jour, c'est vous. Vous gérez le fonds article 9 vitrine de la maison, l'année a été brutale, et le directeur des produits a la lettre du client en main : « sous-performance, dépassement de tracking error, et on paie des frais de gestion active ESG pour ça ? ». Le dossier : ${desc}. Votre défense ne peut pas être un discours — DWS a appris au secteur ce qui arrive quand les promesses ESG dépassent les nombres ESG (perquisition en mai 2022, démission du CEO, 19 M\\$ d'amende SEC). Rechiffrez tout : l'IR que vous vendiez, la volatilité que les exclusions ont construite, le coût mécanique du pari sectoriel, et ce qui reste de la promesse du mandat.`,
        `Le fonds de pension vous paie pour auditer ses gérants externes, et le mandat ESG est le dossier de l'année : un fonds article 9 qui a manqué son indice l'année où l'énergie a flambé. Le gérant accuse « le vent contraire ESG » ; votre travail est de donner au conseil la décomposition honnête : ${desc}. La méthode du chapitre 7 : pas de slogans, des nombres — ce que les exclusions ont fait au risque (l'algèbre du chapitre 1), ce que le pari sectoriel a coûté (les étalons du chapitre 3), et si la lettre mérite renouvellement, redimensionnement ou résiliation.`,
        `L'oral. « L'ESG coûte-t-il du rendement ? » L'examinateur refuse le slogan dans les deux sens, et glisse la fiche : ${desc}. « Calculez : le ratio d'information d'avant, la volatilité après exclusions, le drag mécanique l'année où le pétrole flambe, l'IR d'après. Puis donnez-moi la réponse qui tient : qu'est-ce qui se paie exactement, par qui, et que diriez-vous au client qui a signé pour du vert foncé ? »`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The prospectus IR' : 'a) L\'IR du prospectus',
          enonce: en
            ? `The mandate sold ${pct(surp0, 1)} of outperformance for ${pct(teMandat, 1)} of tracking error. What information ratio was the client buying?`
            : `Le mandat vendait ${pct(surp0, 1)} de surperformance pour ${pct(teMandat, 1)} de tracking error. Quel ratio d'information le client achetait-il ?`,
          reponse: repIr0, tolerance: 0.03, toleranceMode: 'absolu', unite: '×',
          etapes: [{
            titre: en ? 'The leash, and its price' : 'La laisse, et son prix',
            contenu: en
              ? `IR = ${f(surp0, 1)} / ${f(teMandat, 1)} = **${f(repIr0, 2)}** — at or above chapter 3's "very good if sustained" bar of 0.5. Remember what each term is: the tracking error is the LEASH the client grants — it is chosen, not endured — and the IR says what each unit of leash returned. This is the contract the committee will hold you to: not "be green", but "use ${pct(teMandat, 1)} of freedom to beat the index".`
              : `IR = ${f(surp0, 1)} / ${f(teMandat, 1)} = **${f(repIr0, 2)}** — au niveau ou au-dessus de la barre « très bon si tenu dans la durée » du chapitre 3, 0,5. Rappelez ce qu'est chaque terme : la tracking error est la LAISSE que le client accorde — elle se choisit, elle ne se subit pas — et l'IR dit ce que chaque unité de laisse a rapporté. C'est le contrat que le comité vous opposera : pas « soyez vert », mais « utilisez ${pct(teMandat, 1)} de liberté pour battre l'indice ».`,
          }],
          pieges: [en
            ? `Confusing the mandate's TE (the granted budget, ${pct(teMandat, 1)}) with the realised TE (${pct(te1, 1)} this year): breaching the leash is a contract problem BEFORE it is a performance problem.`
            : `Confondre la TE du mandat (le budget accordé, ${pct(teMandat, 1)}) et la TE réalisée (${pct(te1, 1)} cette année) : dépasser la laisse est un problème de contrat AVANT d'être un problème de performance.`],
        },
        {
          intitule: en ? 'b) The exclusions concentrate: the volatility' : 'b) Les exclusions concentrent : la volatilité',
          enonce: en
            ? `After the exclusions, the fund is ${pct(w, 0)} growth/tech (vol ${pct(volTech, 0)}) and ${pct(100 - w, 0)} rest (vol ${pct(volAutre, 0)}), correlation ${f(rho, 1)}. What is the fund's volatility (in %)?`
            : `Après les exclusions, le fonds est à ${pct(w, 0)} croissance/techno (vol ${pct(volTech, 0)}) et ${pct(100 - w, 0)} sur le reste (vol ${pct(volAutre, 0)}), corrélation ${f(rho, 1)}. Quelle est la volatilité du fonds (en %) ?`,
          reponse: repVol1, tolerance: 0.15, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'A constraint cannot improve the optimum' : 'Une contrainte ne peut pas améliorer l\'optimum',
            contenu: en
              ? `σ = √((${f(w / 100, 2)})² × ${f(volTech, 0)}² + (${f((100 - w) / 100, 2)})² × ${f(volAutre, 0)}² + 2 × ${f(w / 100, 2)} × ${f((100 - w) / 100, 2)} × ${f(rho, 1)} × ${f(volTech, 0)} × ${f(volAutre, 0)}) = **${pct(repVol1, 2)}** — against ${pct(volIdx, 0)} for the index. Chapter 1's theorem in action: excluding shrinks the universe, so the efficient frontier can only recede. And name the structure the exclusion built: the typical green fund is structurally LONG tech and SHORT energy (module 3's sector compositions) — a permanent factor bet wearing an ethical label.`
              : `σ = √((${f(w / 100, 2)})² × ${f(volTech, 0)}² + (${f((100 - w) / 100, 2)})² × ${f(volAutre, 0)}² + 2 × ${f(w / 100, 2)} × ${f((100 - w) / 100, 2)} × ${f(rho, 1)} × ${f(volTech, 0)} × ${f(volAutre, 0)}) = **${pct(repVol1, 2)}** — contre ${pct(volIdx, 0)} pour l'indice. Le théorème du chapitre 1 en action : exclure réduit l'univers, donc la frontière efficiente ne peut que reculer. Et nommez la structure que l'exclusion a construite : le fonds vert typique est structurellement LONG techno et SOUS-PONDÉRÉ énergie (les compositions sectorielles du module 3) — un pari factoriel permanent en habits éthiques.`,
          }],
          pieges: [en
            ? `"Still diversified, so no harm done": diversification lives in LOW correlations — removing a sector poorly correlated with the rest concentrates the portfolio exactly where it costs.`
            : `« Toujours diversifié, donc pas de dégât » : la diversification vit dans les corrélations BASSES — retirer un secteur peu corrélé au reste concentre le portefeuille exactement là où ça coûte.`],
        },
        {
          intitule: en ? 'c) The mechanical cost of exclusion' : 'c) Le coût mécanique de l\'exclusion',
          enonce: en
            ? `The excluded sector is ${pct(pExcl, 0)} of the index and beats the rest by ${pct(rEner, 0)} this year. How many points of underperformance does the exclusion cost, mechanically?`
            : `Le secteur exclu pèse ${pct(pExcl, 0)} de l'indice et bat le reste de ${pct(rEner, 0)} cette année. Combien de points de sous-performance l'exclusion coûte-t-elle, mécaniquement ?`,
          reponse: repDrag, tolerance: 0.1, toleranceMode: 'absolu', unite: 'points',
          etapes: [{
            titre: en ? 'The label did almost nothing; the sector did everything' : 'L\'étiquette n\'a presque rien fait ; le secteur a tout fait',
            contenu: en
              ? `Drag = ${f(pExcl, 0)}% × ${f(rEner, 0)} = **${f(repDrag, 2)} points**: the index carries ${pct(pExcl, 0)} of a sector up ${pct(rEner, 0)} that the fund cannot own. This is 2022's honest anatomy — and 2020's, mirrored: the green fund outperforms when tech rises, underperforms when oil surges, and the ESG label has almost nothing to do with either. The meta-studies' verdict, to quote verbatim: no systematic sacrifice, no systematic outperformance — the results are period and sector-bias dependent.`
              : `Drag = ${f(pExcl, 0)} % × ${f(rEner, 0)} = **${f(repDrag, 2)} points** : l'indice embarque ${pct(pExcl, 0)} d'un secteur à +${pct(rEner, 0)} que le fonds n'a pas le droit de détenir. C'est l'anatomie honnête de 2022 — et celle de 2020, en miroir : le fonds vert surperforme quand la techno monte, sous-performe quand le pétrole flambe, et l'étiquette ESG n'y est presque pour rien. Le verdict des méta-études, à citer tel quel : ni sacrifice systématique, ni surperformance systématique — les résultats dépendent de la période et des biais sectoriels.`,
          }],
          pieges: [en
            ? `Blaming "the E" for the year: what cost ${f(repDrag, 2)} points is a SECTOR bet, not a climate conviction — naming the mechanism is what separates an analysis from a slogan.`
            : `Accuser « le E » pour l'année : ce qui a coûté ${f(repDrag, 2)} points est un pari SECTORIEL, pas une conviction climatique — nommer le mécanisme est ce qui sépare une analyse d'un slogan.`],
        },
        {
          intitule: en ? 'd) The net outperformance' : 'd) La surperformance nette',
          enonce: en
            ? `The stock selection still delivered its ${pct(surp0, 1)}; the sector drag of c) works against it. What is the net over/underperformance (in %, signed)?`
            : `La sélection de titres a tenu ses ${pct(surp0, 1)} ; le drag sectoriel du c) joue contre. Quelle est la sur/sous-performance nette (en %, signée) ?`,
          reponse: repSurpNette, tolerance: 0.1, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Two engines, opposite directions' : 'Deux moteurs, sens opposés',
            contenu: en
              ? `Net = ${f(surp0, 1)} − ${f(repDrag, 2)} = **${pct(repSurpNette, 2)}**. Decomposed, the year stops being a mystery: the manager's craft (selection, ${pct(surp0, 1)}) did its job; the structure (the exclusion bet, −${f(repDrag, 2)}) buried it. That decomposition is exactly what the client letter deserves — because the client did not buy a sector bet, or did not know it had.`
              : `Net = ${f(surp0, 1)} − ${f(repDrag, 2)} = **${pct(repSurpNette, 2)}**. Décomposée, l'année cesse d'être un mystère : le métier du gérant (la sélection, ${pct(surp0, 1)}) a fait son travail ; la structure (le pari d'exclusion, −${f(repDrag, 2)}) l'a enterré. Cette décomposition est exactement ce que mérite la lettre au client — parce que le client n'a pas acheté un pari sectoriel, ou ne savait pas qu'il l'avait fait.`,
          }],
          pieges: [en
            ? `Reporting the gross ${pct(surp0, 1)} of selection as "the performance": the client eats the NET line — a decomposition explains, it does not excuse.`
            : `Rapporter les ${pct(surp0, 1)} bruts de sélection comme « la performance » : le client mange la ligne NETTE — une décomposition explique, elle n'excuse pas.`],
        },
        {
          intitule: en ? 'e) The IR that melts' : 'e) L\'IR qui fond',
          enonce: en
            ? `Net underperformance of d), realised tracking error ${pct(te1, 1)}. What is the realised information ratio (signed)?`
            : `Sous-performance nette du d), tracking error réalisée ${pct(te1, 1)}. Quel est le ratio d'information réalisé (signé) ?`,
          reponse: repIr1, tolerance: 0.03, toleranceMode: 'absolu', unite: '×',
          etapes: [{
            titre: en ? 'The leash doubled, and was spent losing' : 'La laisse a doublé, et a été dépensée à perdre',
            contenu: en
              ? `IR = ${f(repSurpNette, 2)} / ${f(te1, 1)} = **${f(repIr1, 2)}** — against the ${f(repIr0, 2)} sold. Read both moves: the numerator flipped sign, and the DENOMINATOR doubled without the client signing anything — the tracking error jumped from ${pct(teMandat, 1)} to ${pct(te1, 1)} not because the manager took ideas, but because the constraint hardened. A freedom budget consumed by a constraint is the worst of both worlds: active fees, structural bets, no discretion left for actual selection.`
              : `IR = ${f(repSurpNette, 2)} / ${f(te1, 1)} = **${f(repIr1, 2)}** — contre les ${f(repIr0, 2)} vendus. Lisez les deux mouvements : le numérateur a changé de signe, et le DÉNOMINATEUR a doublé sans que le client ait rien signé — la tracking error a sauté de ${pct(teMandat, 1)} à ${pct(te1, 1)} non parce que le gérant a pris des idées, mais parce que la contrainte a durci. Un budget de liberté consommé par une contrainte est le pire des deux mondes : des frais actifs, des paris structurels, et plus de marge pour la vraie sélection.`,
          }],
          pieges: [en
            ? `Comparing ${f(repIr0, 2)} and ${f(repIr1, 2)} as "same ratio, worse year": NEITHER the numerator NOR the denominator measures the same thing anymore — the mandate changed underneath the metric.`
            : `Comparer ${f(repIr0, 2)} et ${f(repIr1, 2)} comme « même ratio, moins bonne année » : NI le numérateur NI le dénominateur ne mesurent plus la même chose — le mandat a changé sous la métrique.`],
        },
        {
          intitule: en ? 'f) The Sharpe — and the answer that holds' : 'f) Le Sharpe — et la réponse qui tient',
          enonce: en
            ? `Fund return = index ${pct(rIdx, 1)} plus the net of d); fund volatility from b); cash ${pct(rf, 1)}. What is the fund's Sharpe ratio?`
            : `Rendement du fonds = indice ${pct(rIdx, 1)} plus le net du d) ; volatilité du fonds au b) ; cash ${pct(rf, 1)}. Quel est le ratio de Sharpe du fonds ?`,
          reponse: repSharpeF, tolerance: 0.03, toleranceMode: 'absolu', unite: '×',
          etapes: [
            {
              titre: en ? 'The double penalty' : 'La double peine',
              contenu: en
                ? `Sharpe = (${f(r2(rIdx + surpNette), 2)} − ${f(rf, 1)}) / ${f(repVol1, 2)} = **${f(repSharpeF, 2)}**, against ${f(repSharpeI, 2)} for the index: less return AND more risk — the double penalty of a hardened constraint, chapter 1's receding frontier made flesh. The number the committee must see next to it: late 2022, about 40% of Article 9 assets were downgraded to Article 8 by their own managers — the industry-wide admission that the label had been outrunning the process.`
                : `Sharpe = (${f(r2(rIdx + surpNette), 2)} − ${f(rf, 1)}) / ${f(repVol1, 2)} = **${f(repSharpeF, 2)}**, contre ${f(repSharpeI, 2)} pour l'indice : moins de rendement ET plus de risque — la double peine d'une contrainte durcie, la frontière du chapitre 1 qui recule, en chair et en os. Le nombre que le comité doit voir à côté : fin 2022, environ 40 % des encours article 9 ont été rétrogradés en article 8 par leurs propres sociétés de gestion — l'aveu collectif que l'étiquette courait devant le process.`,
            },
            {
              titre: en ? 'The four-beat answer' : 'La réponse en quatre temps',
              contenu: en
                ? `For the committee and for the jury, chapter 7's answer that holds. One: distinguish RISK from IMPACT — climate risk is ordinary risk management (simple materiality); minimising the portfolio's impact on the world is a legitimate but DIFFERENT question. Two: name the measurement problem — ESG ratings correlate at 0.4-0.6 across raters, against 0.99 in credit. Three: cite one precise fact — DWS, or this fund's own ${f(repDrag, 2)}-point sector drag. Four: conclude honestly — a constraint is PAID in frontier; the only honest question is whether the client knows what he is paying, and what he is buying with it. Three minutes, zero slogans.`
                : `Pour le comité et pour le jury, la réponse du chapitre 7 qui tient. Un : distinguer le RISQUE de l'IMPACT — le risque climatique est de la gestion de risque ordinaire (simple matérialité) ; minimiser l'impact du portefeuille sur le monde est une question légitime mais DIFFÉRENTE. Deux : nommer le problème de mesure — les notes ESG corrèlent à 0,4-0,6 entre noteurs, contre 0,99 en crédit. Trois : citer un fait précis — DWS, ou le drag sectoriel de ${f(repDrag, 2)} points de ce fonds même. Quatre : conclure honnêtement — une contrainte se PAIE en frontière ; la seule question honnête est de savoir si le client sait ce qu'il paie, et ce qu'il achète avec. Trois minutes, zéro slogan.`,
            },
          ],
          pieges: [en
            ? `Answering "ESG costs nothing" or "ESG costs everything": the meta-studies say neither — what was paid HERE has a precise name, concentration and a sector bet, quantified in b) and c). Replacing an opinion with a mechanism is the whole exam.`
            : `Répondre « l'ESG ne coûte rien » ou « l'ESG coûte tout » : les méta-études ne disent ni l'un ni l'autre — ce qui s'est payé ICI a un nom précis, concentration et pari sectoriel, chiffrés en b) et c). Remplacer une opinion par un mécanisme, c'est tout l'examen.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 19. m12-pb-19 — BOSS : la gestion LDI, gilts 2022 — N4              */
/* ------------------------------------------------------------------ */
const gestionLdi: ProblemeMoule = {
  id: 'm12-pb-19', moduleId: M12,
  titre: 'La gestion LDI : gilts 2022, la spirale en laboratoire',
  titreEn: 'LDI management: gilts 2022, the spiral in a laboratory',
  typeDeCas: 'levier, collatéral et liquidité',
  typeDeCasEn: 'leverage, collateral and liquidity',
  difficulte: 4,
  scenarios: ['Le gérant LDI, lundi 26 septembre 2022, 8 h', 'Le trustee du fonds de pension qui découvre le levier', 'L\'oral : « comment un fonds ENRICHI par le choc a-t-il failli mourir ? »'],
  scenariosEn: ['The LDI manager, Monday 26 September 2022, 8 a.m.', 'The pension trustee discovering the leverage', 'The oral exam: "how did a fund ENRICHED by the shock nearly die?"'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const passif = randInt(rng, 900, 1100);   // M£, valeur actualisée
    const dPassif = randInt(rng, 18, 22);
    const gilts = randInt(rng, 300, 400);     // M£, poche LDI
    const kPoche = randInt(rng, 100, 140);    // capital de la poche
    const dGilts = randInt(rng, 18, 22);
    const cash = randInt(rng, 20, 40);        // M£, coussin
    const decote = randFloat(rng, 3, 5, 1);   // % décote de liquidation
    const choc2 = randInt(rng, 30, 50);       // pb, second tour
    const h0 = randFloat(rng, 1, 2, 1);       // haircut repo initial, %
    const dH = randInt(rng, 3, 5);            // hausse du haircut, points
    const choc1 = 130;                        // pb — le fait du chapitre
    const levier = gilts / kPoche;
    const perte1Pct = variationPrixSpreadPct(dGilts, choc1);
    const perte1 = (perte1Pct / 100) * gilts;         // M£ signé
    const appel1 = Math.abs(perte1);
    const besoin1 = appel1 - cash;
    const vente = venteForceePourCash(besoin1, decote);
    const restants = gilts - vente;
    const perte2 = (variationPrixSpreadPct(dGilts, choc2) / 100) * restants;
    const fin0 = financementRepo(restants, h0);
    const fin1 = financementRepo(restants, h0 + dH);
    const perteFin = fin0 - fin1;
    const besoin2 = Math.abs(perte2) + perteFin;
    const varPassif = (variationPrixSpreadPct(dPassif, choc1) / 100) * passif; // M£ signé
    const repLevier = r2(levier);
    const repPerte1 = r1(perte1);
    const repBesoin1 = r1(besoin1);
    const repVente = r1(vente);
    const repBesoin2 = r1(besoin2);
    const repVarPassif = r1(varPassif);

    const { en, f, pct } = outils(langue);
    const mGbp = (v: number, d = 0) => (en ? `£${f(v, d)}m` : `${f(v, d)} M£`);
    const desc = en
      ? `the pension fund's discounted liabilities are worth ${mGbp(passif)} with a duration of ${f(dPassif, 0)}; its LDI pocket holds ${mGbp(gilts)} of long gilts (duration ${f(dGilts, 0)}) against ${mGbp(kPoche)} of capital, the rest financed through repo (haircut ${pct(h0, 1)}) and swaps; the cash buffer: ${mGbp(cash)}; on 23 September, the mini-budget (~£45bn of unfunded tax cuts) sends the 30-year gilt up +130 bp in three sessions; in a fire sale, the liquidation discount is ${pct(decote, 1)}; the strained market then adds +${f(choc2, 0)} bp, and the repo lenders raise their haircut by ${f(dH, 0)} points`
      : `le passif actualisé du fonds de pension vaut ${mGbp(passif)} pour une duration de ${f(dPassif, 0)} ; sa poche LDI détient ${mGbp(gilts)} de gilts longs (duration ${f(dGilts, 0)}) contre ${mGbp(kPoche)} de capital, le reste financé en repo (haircut ${pct(h0, 1)}) et en swaps ; le coussin de cash : ${mGbp(cash)} ; le 23 septembre, le mini-budget (~45 Md£ de baisses d'impôts non financées) envoie le gilt 30 ans à +130 pb en trois séances ; en cas de vente en urgence, la décote de liquidation est de ${pct(decote, 1)} ; le marché sous tension ajoute ensuite +${f(choc2, 0)} pb, et les prêteurs repo montent leur haircut de ${f(dH, 0)} points`;
    const contexte = (en
      ? [
        `Monday 26 September 2022, 8 a.m. You run the LDI pocket of a British pension fund, and your Bloomberg is a wall of red that makes no sense to a layman: rates are UP, so your fund's solvency is UP — and your phone is ringing with margin calls. The file: ${desc}. Walk the spiral leg by leg, the way module 11 chapter 7 dissects it: the leverage, the loss, the call, the forced sale, the second round. Then compute the number that makes this episode the purest laboratory of the decade: what the same shock did to the liabilities.`,
        `You are a trustee of the pension fund, and until this week you believed the LDI line in the annual report was a hedge — boring by design. Then the consultant's emergency memo arrived: margin calls, gilts sold at a discount, talk of a "spiral". The file he attached: ${desc}. Before Thursday's emergency board you want to redo every number yourself: how much leverage was in "the hedge", what +130 bp did to it, what got sold, and why — this is the part nobody has explained to you — the fund is somehow RICHER than before the crisis.`,
        `The oral, the trap question of the year: "September 2022 — rising rates IMPROVE a pension fund's solvency; the LDI funds nearly died of it. Reconcile." The sheet: ${desc}. The examiner wants the spiral quantified leg by leg — call, sale, second-round call — and then the liability line that resolves the paradox. Solvent, illiquid, nearly dead: if you can compute those three words, the question is yours.`,
      ]
      : [
        `Lundi 26 septembre 2022, 8 h. Vous gérez la poche LDI d'un fonds de pension britannique, et votre Bloomberg est un mur de rouge qui n'a aucun sens pour un profane : les taux MONTENT, donc la solvabilité de votre fonds MONTE — et votre téléphone sonne d'appels de marge. Le dossier : ${desc}. Déroulez la spirale jambe par jambe, comme le module 11 chapitre 7 la dissèque : le levier, la perte, l'appel, la vente forcée, le second tour. Puis calculez le nombre qui fait de cet épisode le laboratoire le plus pur de la décennie : ce que le même choc a fait au passif.`,
        `Vous êtes trustee du fonds de pension, et jusqu'à cette semaine vous pensiez que la ligne LDI du rapport annuel était une couverture — ennuyeuse par construction. Puis la note d'urgence du consultant est arrivée : appels de marge, gilts vendus à la décote, un mot, « spirale ». Le dossier joint : ${desc}. Avant le conseil d'urgence de jeudi, vous voulez refaire chaque nombre vous-même : combien de levier il y avait dans « la couverture », ce que +130 pb lui ont fait, ce qui a été vendu, et pourquoi — c'est la partie que personne ne vous a expliquée — le fonds est, quelque part, plus RICHE qu'avant la crise.`,
        `L'oral, la question piège de l'année : « septembre 2022 — la hausse des taux AMÉLIORE la solvabilité d'un fonds de pension ; les fonds LDI ont failli en mourir. Réconciliez. » La fiche : ${desc}. L'examinateur veut la spirale chiffrée jambe par jambe — appel, vente, appel du second tour — puis la ligne du passif qui résout le paradoxe. Solvable, illiquide, presque mort : si vous savez calculer ces trois mots, la question est à vous.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The leveraged hedge' : 'a) La couverture à levier',
          enonce: en
            ? `The pocket holds ${mGbp(gilts)} of gilts against ${mGbp(kPoche)} of capital. What is its leverage?`
            : `La poche détient ${mGbp(gilts)} de gilts contre ${mGbp(kPoche)} de capital. Quel est son levier ?`,
          reponse: repLevier, tolerance: 0.1, toleranceMode: 'absolu', unite: '×',
          etapes: [{
            titre: en ? 'Why leverage a hedge at all' : 'Pourquoi une couverture à levier',
            contenu: en
              ? `Leverage = ${f(gilts, 0)} / ${f(kPoche, 0)} = **${f(repLevier, 2)}**. The why: the liabilities have a duration of ${f(dPassif, 0)} — every point of rates moves them by about ${mGbp(r1((dPassif / 100) * passif))}. Matching that sensitivity with unlevered gilts would immobilise most of the fund; repo and swaps buy the duration with a fraction of the cash, freeing the rest for return-seeking assets. Perfectly rational — and it converts a solvency hedge into a LIQUIDITY exposure, which is the whole story that follows.`
              : `Levier = ${f(gilts, 0)} / ${f(kPoche, 0)} = **${f(repLevier, 2)}**. Le pourquoi : le passif a une duration de ${f(dPassif, 0)} — chaque point de taux le déplace d'environ ${mGbp(r1((dPassif / 100) * passif))}. Répliquer cette sensibilité en gilts non leviérisés immobiliserait l'essentiel du fonds ; le repo et les swaps achètent la duration avec une fraction du cash, libérant le reste pour des actifs de rendement. Parfaitement rationnel — et cela convertit une couverture de solvabilité en exposition de LIQUIDITÉ, ce qui est toute l'histoire qui suit.`,
          }],
          pieges: [en
            ? `"A hedge cannot be dangerous": the hedge is in the right direction for SOLVENCY — the danger is not the sign of the position, it is that margin calls are paid in cash, not in present value.`
            : `« Une couverture ne peut pas être dangereuse » : la couverture est dans le bon sens pour la SOLVABILITÉ — le danger n'est pas le signe de la position, c'est que les appels de marge se paient en cash, pas en valeur actuelle.`],
        },
        {
          intitule: en ? 'b) +130 bp: the loss on the gilts' : 'b) +130 pb : la perte sur les gilts',
          enonce: en
            ? `Duration ${f(dGilts, 0)}, shock +${f(choc1, 0)} bp, on ${mGbp(gilts)} of gilts. What is the loss (in £m, signed)?`
            : `Duration ${f(dGilts, 0)}, choc +${f(choc1, 0)} pb, sur ${mGbp(gilts)} de gilts. Quelle est la perte (en M£, signée) ?`,
          reponse: repPerte1, tolerance: 1, toleranceMode: 'absolu', unite: 'M£',
          etapes: [{
            titre: en ? 'At duration 20, +130 bp is a massacre' : 'À duration 20, +130 pb est un massacre',
            contenu: en
              ? `ΔP = −${f(dGilts, 0)} × ${f(r2(choc1 / 100), 1)} = ${pct(r2(perte1Pct), 2)}, so ${pct(r2(perte1Pct), 2)} × ${f(gilts, 0)} = **${mGbp(repPerte1, 1)}**. A quarter of the position's value gone in three sessions — that is what +130 bp means at the long end, and why the 23 September mini-budget (~£45bn unfunded) turned a sleepy asset class into the epicentre. Module 4's duration arithmetic, at the scale where it breaks institutions.`
              : `ΔP = −${f(dGilts, 0)} × ${f(r2(choc1 / 100), 1)} = ${pct(r2(perte1Pct), 2)}, donc ${pct(r2(perte1Pct), 2)} × ${f(gilts, 0)} = **${mGbp(repPerte1, 1)}**. Un quart de la valeur de la position parti en trois séances — voilà ce que +130 pb signifie sur la partie longue, et pourquoi le mini-budget du 23 septembre (~45 Md£ non financés) a fait d'une classe d'actifs endormie l'épicentre. L'arithmétique de duration du module 4, à l'échelle où elle casse des institutions.`,
          }],
          pieges: [en
            ? `Applying the shock to the pocket's CAPITAL (${mGbp(kPoche)}): the duration bites the full ${mGbp(gilts)} of gilts — that is what leverage means, and why the loss is ${f(r1(appel1 / kPoche * 100), 0)}% of the capital.`
            : `Appliquer le choc au CAPITAL de la poche (${mGbp(kPoche)}) : la duration mord sur la totalité des ${mGbp(gilts)} de gilts — c'est le sens du levier, et pourquoi la perte fait ${f(r1(appel1 / kPoche * 100), 0)} % du capital.`],
        },
        {
          intitule: en ? 'c) The collateral call' : 'c) L\'appel de collatéral',
          enonce: en
            ? `The variation margin equals the loss of b), due in cash within 24-48 hours; the cash buffer is ${mGbp(cash)}. How much cash is missing (in £m)?`
            : `La marge de variation égale la perte du b), exigible en cash sous 24-48 h ; le coussin de cash est de ${mGbp(cash)}. Combien de cash manque-t-il (en M£) ?`,
          reponse: repBesoin1, tolerance: 1, toleranceMode: 'absolu', unite: 'M£',
          etapes: [{
            titre: en ? '"Solvent" does not answer a margin call' : '« Solvable » ne répond pas à un appel de marge',
            contenu: en
              ? `Call ${f(r1(appel1), 1)} − cash ${f(cash, 0)} = **${mGbp(repBesoin1, 1)}** to find by tomorrow. Note what does NOT count as an answer: the improved solvency, the long-term soundness of the hedge, the certainty that gilts will not default. Margin is cash. Module 7's lesson at pension-fund scale: the mark-to-market must be paid every day, and "being right at maturity" is not a means of payment.`
              : `Appel ${f(r1(appel1), 1)} − cash ${f(cash, 0)} = **${mGbp(repBesoin1, 1)}** à trouver pour demain. Notez ce qui ne compte PAS comme réponse : la solvabilité améliorée, la solidité de la couverture à long terme, la certitude que les gilts ne feront pas défaut. La marge, c'est du cash. La leçon du module 7 à l'échelle d'un fonds de pension : le mark-to-market se paie chaque jour, et « avoir raison à l'échéance » n'est pas un moyen de paiement.`,
          }],
          pieges: [en
            ? `Netting the call against the fall in liabilities: the liability side generates NO cash when it shrinks — present value and payable cash live in different worlds, and margin calls live in the second.`
            : `Compenser l'appel avec la baisse du passif : le passif ne génère AUCUN cash en fondant — valeur actuelle et cash exigible vivent dans deux mondes différents, et les appels de marge vivent dans le second.`],
        },
        {
          intitule: en ? 'd) The forced sale' : 'd) La vente forcée',
          enonce: en
            ? `To raise the ${mGbp(repBesoin1, 1)} of c) under a liquidation discount of ${pct(decote, 1)}, how many £m of gilts (pre-discount value) must be sold?`
            : `Pour lever les ${mGbp(repBesoin1, 1)} du c) sous une décote de liquidation de ${pct(decote, 1)}, combien de M£ de gilts (valeur pré-décote) faut-il vendre ?`,
          reponse: repVente, tolerance: 1, toleranceMode: 'absolu', unite: 'M£',
          etapes: [{
            titre: en ? 'Selling the liquid thing — which is the collateral' : 'Vendre le liquide — qui est le collatéral',
            contenu: en
              ? `Sale = ${f(repBesoin1, 1)} / (1 − ${f(r2(decote / 100), 3)}) = **${mGbp(repVente, 1)}**. The fund sells its most liquid asset — gilts, precisely the thing everyone else in the same position is selling. Those sales push long yields further up, which triggers new calls on everyone: the loop is closed and turns by itself. This is module 11's purest forced-sale spiral, with one aggravating feature: the sellers are all on the same side by CONSTRUCTION, because they all run the same hedge.`
              : `Vente = ${f(repBesoin1, 1)} / (1 − ${f(r2(decote / 100), 3)}) = **${mGbp(repVente, 1)}**. Le fonds vend son actif le plus liquide — des gilts, précisément ce que tous les autres dans la même position vendent aussi. Ces ventes poussent les taux longs encore plus haut, ce qui déclenche de nouveaux appels chez tout le monde : la boucle est fermée et tourne toute seule. C'est la spirale de ventes forcées la plus pure du module 11, avec une circonstance aggravante : les vendeurs sont tous du même côté par CONSTRUCTION, parce qu'ils portent tous la même couverture.`,
          }],
          pieges: [en
            ? `Selling "just" ${mGbp(repBesoin1, 1)}: the discount forces you to sell MORE than the need — the gap (${mGbp(r1(vente - besoin1), 1)}) is the spiral's fuel, in 1987, 2008 and 2022 alike.`
            : `Vendre « juste » ${mGbp(repBesoin1, 1)} : la décote oblige à vendre PLUS que le besoin — l'écart (${mGbp(r1(vente - besoin1), 1)}) est le carburant de la spirale, en 1987, 2008 et 2022 pareillement.`],
        },
        {
          intitule: en ? 'e) The second round' : 'e) Le second tour',
          enonce: en
            ? `${mGbp(r1(restants), 1)} of gilts remain. Rates add +${f(choc2, 0)} bp, and the repo haircut rises from ${pct(h0, 1)} to ${pct(r1(h0 + dH), 1)}. How much cash does the second round demand (margin loss plus funding loss, in £m)?`
            : `Il reste ${mGbp(r1(restants), 1)} de gilts. Les taux ajoutent +${f(choc2, 0)} pb, et le haircut repo passe de ${pct(h0, 1)} à ${pct(r1(h0 + dH), 1)}. Combien de cash le second tour exige-t-il (perte de marge plus perte de financement, en M£) ?`,
          reponse: repBesoin2, tolerance: 1.5, toleranceMode: 'absolu', unite: 'M£',
          etapes: [{
            titre: en ? 'Two legs, one direction' : 'Deux jambes, une seule direction',
            contenu: en
              ? `Leg one, the margin: −${f(dGilts, 0)} × ${f(r2(choc2 / 100), 2)} = ${pct(r2((variationPrixSpreadPct(dGilts, choc2))), 2)} on ${f(r1(restants), 1)} = ${mGbp(r1(Math.abs(perte2)), 1)}. Leg two, the funding: repo financing drops from ${f(r1(fin0), 1)} to ${f(r1(fin1), 1)} — the haircut rise alone reclaims ${mGbp(r1(perteFin), 1)}, cash due even if rates never move again. Total: **${mGbp(repBesoin2, 1)}**. The 2008 run was not a queue at the tellers but a run on THIS number — the haircut; in 2022 both runs arrive together.`
              : `Jambe un, la marge : −${f(dGilts, 0)} × ${f(r2(choc2 / 100), 2)} = ${pct(r2((variationPrixSpreadPct(dGilts, choc2))), 2)} sur ${f(r1(restants), 1)} = ${mGbp(r1(Math.abs(perte2)), 1)}. Jambe deux, le financement : le repo passe de ${f(r1(fin0), 1)} à ${f(r1(fin1), 1)} — la seule hausse du haircut réclame ${mGbp(r1(perteFin), 1)}, du cash dû même si les taux ne bougent plus jamais. Total : **${mGbp(repBesoin2, 1)}**. Le run de 2008 n'était pas une file aux guichets mais une ruée sur CE nombre — le haircut ; en 2022, les deux ruées arrivent ensemble.`,
          }],
          pieges: [en
            ? `Forgetting the haircut leg: a rising haircut is a cash call with NO market move — the financing melts while the asset has not moved, which is exactly how leverage dies between two price ticks.`
            : `Oublier la jambe haircut : un haircut qui monte est un appel de cash SANS mouvement de marché — le financement fond alors que l'actif n'a pas bougé, et c'est exactement ainsi que le levier meurt entre deux cotations.`],
        },
        {
          intitule: en ? 'f) The irony: the liabilities' : 'f) L\'ironie : le passif',
          enonce: en
            ? `Same +130 bp on the liability side (duration ${f(dPassif, 0)}, present value ${mGbp(passif)}). By how much does the discounted liability move (in £m, signed)?`
            : `Le même +130 pb côté passif (duration ${f(dPassif, 0)}, valeur actualisée ${mGbp(passif)}). De combien la valeur actualisée des engagements varie-t-elle (en M£, signée) ?`,
          reponse: repVarPassif, tolerance: 2, toleranceMode: 'absolu', unite: 'M£',
          etapes: [
            {
              titre: en ? 'Solvent, illiquid, nearly dead' : 'Solvable, illiquide, presque mort',
              contenu: en
                ? `ΔLiabilities = −${f(dPassif, 0)} × ${f(r2(choc1 / 100), 1)} = ${pct(r2(variationPrixSpreadPct(dPassif, choc1)), 2)} × ${f(passif, 0)} = **${mGbp(repVarPassif, 1)}** — the engagements SHRANK by ${mGbp(r1(Math.abs(varPassif)), 1)}, far more than everything the pocket lost (${mGbp(r1(appel1 + Math.abs(perte2)), 1)} over both rounds). Economically, the shock ENRICHED the fund: pure duration mechanics, the liabilities being longer than the hedge is big. Institutions made richer by the crisis nearly died of Tuesday's margin call. If you keep one example of the solvency/liquidity distinction, keep this one.`
                : `ΔPassif = −${f(dPassif, 0)} × ${f(r2(choc1 / 100), 1)} = ${pct(r2(variationPrixSpreadPct(dPassif, choc1)), 2)} × ${f(passif, 0)} = **${mGbp(repVarPassif, 1)}** — les engagements ont FONDU de ${mGbp(r1(Math.abs(varPassif)), 1)}, bien plus que tout ce que la poche a perdu (${mGbp(r1(appel1 + Math.abs(perte2)), 1)} sur les deux tours). Économiquement, le choc a ENRICHI le fonds : pure mécanique de duration, le passif étant plus long que la couverture n'est grosse. Des institutions enrichies par la crise ont failli mourir de l'appel de marge du mardi. Si vous ne gardez qu'un exemple de la distinction solvabilité/liquidité, gardez celui-là.`,
            },
            {
              titre: en ? '28 September: how the loop was killed' : 'Le 28 septembre : comment la boucle a été tuée',
              contenu: en
                ? `The Bank of England — mid-tightening, on the eve of SELLING gilts under QT — buys long gilts, explicitly temporarily: thirteen working days, about £19bn used, and the spiral dies in hours. The buyer of last resort does not need to buy everything: it only needs to CRUSH THE DISCOUNT that feeds the loop. Truss resigns after 44 days. The module 12 close, for the board and the jury: a solvency stress test would have PASSED this fund — the test nobody ran was the liquidity one: "who pays what, in cash, within 48 hours, if the long end moves 130 bp in three sessions?"`
                : `La Banque d'Angleterre — en plein resserrement, à la veille de VENDRE des gilts au titre du QT — achète du gilt long, explicitement temporaire : treize jours ouvrés, environ 19 Md£ utilisés, et la spirale meurt en quelques heures. L'acheteur en dernier ressort n'a pas besoin de tout acheter : il lui suffit d'ÉCRASER LA DÉCOTE qui nourrit la boucle. Truss démissionne après 44 jours. La clôture module 12, pour le conseil et pour le jury : un stress test de solvabilité aurait fait RÉUSSIR ce fonds — le test que personne n'a fait était celui de liquidité : « qui paie quoi, en cash, sous 48 h, si la partie longue prend 130 pb en trois séances ? »`,
            },
          ],
          pieges: [en
            ? `Concluding "the hedge was a mistake": without it, the 2010s' falling rates would have ballooned the liabilities unmatched. The mistake was not hedging — it was hedging WITH LEVERAGE while sizing the cash buffer for a world where +130 bp in three sessions cannot happen.`
            : `Conclure « la couverture était une erreur » : sans elle, la baisse des taux des années 2010 aurait creusé le passif sans contrepartie. L'erreur n'était pas de couvrir — c'était de couvrir À LEVIER en dimensionnant le coussin de cash pour un monde où +130 pb en trois séances ne peuvent pas arriver.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 20. m12-pb-20 — BOSS : le CRO face au conseil — N4                  */
/* ------------------------------------------------------------------ */
const croFaceAuConseil: ProblemeMoule = {
  id: 'm12-pb-20', moduleId: M12,
  titre: 'Le CRO face au conseil : cinq chiffres, trois décisions',
  titreEn: 'The CRO before the board: five numbers, three decisions',
  typeDeCas: 'pilotage intégré des risques',
  typeDeCasEn: 'integrated risk management',
  difficulte: 4,
  scenarios: ['Le CRO qui prépare le conseil trimestriel', 'Le consultant mandaté pour contre-expertiser le CRO', 'L\'oral final : « vous êtes le CRO, dix minutes »'],
  scenariosEn: ['The CRO preparing the quarterly board', 'The consultant hired to second-guess the CRO', 'The final oral: "you are the CRO, ten minutes"'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const expoCorp = randInt(rng, 180, 240);
    const expoRet = randInt(rng, 160, 220);
    const expoSouv = randInt(rng, 80, 120);
    const vTrading = randInt(rng, 45, 60);
    const volTrading = randInt(rng, 15, 25);
    const beta = randFloat(rng, 1.1, 1.3, 1);
    const sys = randFloat(rng, 1.5, 2.5, 1);
    const margeDepart = randFloat(rng, 0.6, 1.2, 1);
    const hqla = randInt(rng, 52, 64);
    const sorties = randInt(rng, 58, 72);
    const choc = -20;
    const rwaCorp = actifsPonderesRisqueMillions(expoCorp, 100);
    const rwaRet = actifsPonderesRisqueMillions(expoRet, 75);
    const rwaTrad = actifsPonderesRisqueMillions(vTrading, 100);
    const rwa = rwaCorp + rwaRet + actifsPonderesRisqueMillions(expoSouv, 0) + rwaTrad;
    const exigence = r1(4.5 + 2.5 + sys);
    const fp = r0(rwa * (exigence + margeDepart) / 100);
    const cet1 = ratioCet1Pct(fp, rwa);
    const lcr = lcrPct(hqla, sorties);
    const varJ = varParametrique(vTrading, volTrading, 2.33, 1);
    const perteStress = perteStressMillions(vTrading, choc, beta);
    const cet1Post = ratioCet1Pct(fp + perteStress, rwa);
    const besoinCapital = ((exigence - cet1Post) / 100) * rwa;
    const rwaCible = (fp + perteStress) * 100 / exigence;
    const reductionRwa = rwa - rwaCible;
    const perteMax = fp - (exigence / 100) * rwa;
    const betaCible = perteMax / (vTrading * 0.20);
    const repRwa = r0(rwa);
    const repCet1 = r2(cet1);
    const repLcr = r1(lcr);
    const repVar = r2(varJ);
    const repCet1Post = r2(cet1Post);
    const repBesoinCap = r1(besoinCapital);
    const repPerte = r1(perteStress);

    const { en, f, pct } = outils(langue);
    const mEur = (v: number, d = 0) => (en ? `€${f(v, d)}m` : `${f(v, d)} M€`);
    const desc = en
      ? `the balance sheet: ${mEur(expoCorp)} of corporates (100% weight), ${mEur(expoRet)} of retail (75%), ${mEur(expoSouv)} of AAA sovereign (0%), and a market book of ${mEur(vTrading)} (100% weight, volatility ${pct(volTrading, 0)}, beta ${f(beta, 1)}); common equity: ${mEur(fp)}; total CET1 requirement: 4.5% + 2.5% conservation + ${pct(sys, 1)} systemic; liquidity: ${mEur(hqla)} of HQLA against ${mEur(sorties)} of stressed 30-day net outflows; the board's scenario: a market at −20%`
      : `le bilan : ${mEur(expoCorp)} de corporates (pondération 100 %), ${mEur(expoRet)} de détail (75 %), ${mEur(expoSouv)} de souverain AAA (0 %), et une poche de marché de ${mEur(vTrading)} (pondérée 100 %, volatilité ${pct(volTrading, 0)}, bêta ${f(beta, 1)}) ; fonds propres durs : ${mEur(fp)} ; exigence CET1 totale : 4,5 % + 2,5 % de conservation + ${pct(sys, 1)} de systémique ; liquidité : ${mEur(hqla)} de HQLA contre ${mEur(sorties)} de sorties nettes à 30 jours de stress ; le scénario du conseil : un marché à −20 %`;
    const contexte = (en
      ? [
        `Sunday evening, the board deck open in front of you. You are the CRO — second line of defence, the person paid to say no (chapter 6) — and Thursday's board has one question on its agenda: "are we solid?". Answering with an adjective would be malpractice. The file: ${desc}. Build the five numbers in order — RWA, CET1, LCR, VaR, then the stress — and when the fifth number lands where you fear it will, prepare the three decisions the board can actually take, each with a figure attached. A CRO who brings a problem without priced options is a messenger, not an officer.`,
        `The board did not fully trust the CRO's deck — boards have learned that much since 2008 — and hired you to redo every number independently before Thursday. The file: ${desc}. Recompute the whole dashboard: weighted assets, capital ratio, liquidity ratio, the desk's daily VaR, the stress landing. Where your numbers diverge from the house's, the divergence is the finding. And end the memo the way the board expects: the three possible decisions, each in millions, and the one you would sign.`,
        `The final oral, the ten-minute case: "You are the CRO. Here is the bank: ${desc}. The board asks: are we solid? You have ten minutes and a whiteboard." The examiner is testing the whole module at once — weigh, capitalise, liquefy, measure the daily risk, stress the bad day, and then DECIDE: reduce, hedge, or raise capital, with numbers. The candidates who fail are the ones who stop at the diagnosis.`,
      ]
      : [
        `Dimanche soir, le deck du conseil ouvert devant vous. Vous êtes le CRO — deuxième ligne de défense, la personne payée pour dire non (chapitre 6) — et le conseil de jeudi n'a qu'une question à l'ordre du jour : « sommes-nous solides ? ». Répondre par un adjectif serait une faute professionnelle. Le dossier : ${desc}. Construisez les cinq chiffres dans l'ordre — RWA, CET1, LCR, VaR, puis le stress — et quand le cinquième atterrira là où vous le craignez, préparez les trois décisions que le conseil peut réellement prendre, chacune avec un montant. Un CRO qui apporte un problème sans options chiffrées est un messager, pas un dirigeant.`,
        `Le conseil ne faisait pas totalement confiance au deck du CRO — les conseils ont appris au moins cela depuis 2008 — et vous a mandaté pour refaire chaque nombre indépendamment avant jeudi. Le dossier : ${desc}. Recalculez tout le tableau de bord : actifs pondérés, ratio de capital, ratio de liquidité, VaR quotidienne du desk, atterrissage sous stress. Là où vos nombres divergent de ceux de la maison, la divergence est le résultat de l'audit. Et finissez la note comme le conseil l'attend : les trois décisions possibles, chacune en millions, et celle que vous signeriez.`,
        `L'oral final, le cas de dix minutes : « Vous êtes le CRO. Voici la banque : ${desc}. Le conseil demande : sommes-nous solides ? Vous avez dix minutes et un tableau blanc. » L'examinateur teste tout le module d'un coup — pondérer, capitaliser, liquéfier, mesurer le risque quotidien, stresser le mauvais jour, puis DÉCIDER : réduire, couvrir, ou lever du capital, avec des nombres. Les candidats qui échouent sont ceux qui s'arrêtent au diagnostic.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The RWA' : 'a) Les RWA',
          enonce: en
            ? `Compute the total risk-weighted assets (in €m) of the four books.`
            : `Calculez le total des actifs pondérés du risque (en M€) des quatre poches.`,
          reponse: repRwa, tolerance: 2, toleranceMode: 'absolu', unite: 'M€',
          etapes: [{
            titre: en ? 'The denominator of everything' : 'Le dénominateur de tout',
            contenu: en
              ? `RWA = ${f(expoCorp, 0)} × 100% + ${f(expoRet, 0)} × 75% + ${f(expoSouv, 0)} × 0% + ${f(vTrading, 0)} × 100% = ${f(rwaCorp, 0)} + ${f(rwaRet, 0)} + 0 + ${f(rwaTrad, 0)} = **${mEur(repRwa)}**. The sovereign counts for zero — which is exactly the kind of hole the crude leverage ratio (≥ 3%, unweighted) exists to watch: 2008 proved that models and ratings can manufacture "riskless" industrially. Every ratio that follows stands on this number.`
              : `RWA = ${f(expoCorp, 0)} × 100 % + ${f(expoRet, 0)} × 75 % + ${f(expoSouv, 0)} × 0 % + ${f(vTrading, 0)} × 100 % = ${f(rwaCorp, 0)} + ${f(rwaRet, 0)} + 0 + ${f(rwaTrad, 0)} = **${mEur(repRwa)}**. Le souverain compte pour zéro — exactement le genre de trou que le ratio de levier fruste (≥ 3 %, non pondéré) existe pour surveiller : 2008 a prouvé que les modèles et les notations peuvent fabriquer du « sans risque » industriellement. Tous les ratios qui suivent reposent sur ce nombre.`,
          }],
          pieges: [en
            ? `Forgetting the market book in the RWA: a trading position consumes capital too — pre-FRTB precisely because the old trading-book charge was far too light.`
            : `Oublier la poche de marché dans les RWA : une position de trading consomme aussi du capital — le FRTB est né précisément de ce que l'ancienne charge du trading book était bien trop légère.`],
        },
        {
          intitule: en ? 'b) The CET1, against the stacked bar' : 'b) Le CET1, contre la barre empilée',
          enonce: en
            ? `${mEur(fp)} of common equity against the RWA of a): what CET1 ratio (in %) — and how far above the ${pct(exigence, 1)} requirement is it?`
            : `${mEur(fp)} de fonds propres durs contre les RWA du a) : quel ratio CET1 (en %) — et à quelle distance de l'exigence de ${pct(exigence, 1)} ?`,
          reponse: repCet1, tolerance: 0.1, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Living at the edge of one\'s bar' : 'Vivre au ras de sa barre',
            contenu: en
              ? `CET1 = ${f(fp, 0)} / ${f(repRwa, 0)} × 100 = **${pct(repCet1, 2)}**, i.e. only ${f(r2(cet1 - exigence), 2)} points above the stacked requirement (4.5 + 2.5 + ${f(sys, 1)} = ${f(exigence, 1)}%). Large European banks live at 12-15% because the market demands the margin; this bank lives at the edge of its bar. Nothing is breached — but the whole meaning of the stress test that follows is: how much of the ${f(r2(cet1 - exigence), 2)} points survives a bad day? The board must know the answer BEFORE the day.`
              : `CET1 = ${f(fp, 0)} / ${f(repRwa, 0)} × 100 = **${pct(repCet1, 2)}**, soit seulement ${f(r2(cet1 - exigence), 2)} points au-dessus de l'exigence empilée (4,5 + 2,5 + ${f(sys, 1)} = ${f(exigence, 1)} %). Les grandes banques européennes vivent à 12-15 % parce que le marché exige la marge ; cette banque vit au ras de sa barre. Rien n'est violé — mais tout le sens du stress test qui suit est : combien des ${f(r2(cet1 - exigence), 2)} points survivent à une mauvaise journée ? Le conseil doit connaître la réponse AVANT la journée.`,
          }],
          pieges: [en
            ? `Comparing to the bare 4.5% ("comfortably capitalised"): the binding bar stacks the buffers to ${pct(exigence, 1)}, and dipping into the conservation buffer already triggers distribution restrictions.`
            : `Comparer au 4,5 % nu (« confortablement capitalisée ») : la barre effective empile les coussins jusqu'à ${pct(exigence, 1)}, et entamer le coussin de conservation déclenche déjà des restrictions de distribution.`],
        },
        {
          intitule: en ? 'c) The LCR' : 'c) Le LCR',
          enonce: en
            ? `${mEur(hqla)} of HQLA against ${mEur(sorties)} of stressed 30-day outflows. What is the LCR (in %)?`
            : `${mEur(hqla)} de HQLA contre ${mEur(sorties)} de sorties stressées à 30 jours. Quel est le LCR (en %) ?`,
          reponse: repLcr, tolerance: 1, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The other death' : 'L\'autre mort',
            contenu: en
              ? `LCR = ${f(hqla, 0)} / ${f(sorties, 0)} × 100 = **${pct(repLcr, 1)}** — ${lcr >= 100 ? 'above the 100% bar: one month of run survivable without the central bank, on the prescribed scenario. Keep the SVB caveat within reach: a smartphone-speed run can outrun the 30-day scenario — the ratio is necessary, not sufficient' : 'BELOW the 100% bar: on the prescribed scenario, the bank does not survive a month of run without the central bank. This line jumps the queue of every other item on the deck — solvency ratios are irrelevant to a bank that dies of illiquidity first (Northern Rock, SVB)'}. Solvency and liquidity are two separate deaths, measured separately.`
              : `LCR = ${f(hqla, 0)} / ${f(sorties, 0)} × 100 = **${pct(repLcr, 1)}** — ${lcr >= 100 ? 'au-dessus de la barre des 100 % : un mois de run survivable sans banque centrale, sur le scénario prescrit. Gardez la réserve SVB à portée de main : un run à la vitesse du smartphone peut déborder le scénario à 30 jours — le ratio est nécessaire, pas suffisant' : 'SOUS la barre des 100 % : sur le scénario prescrit, la banque ne survit pas à un mois de run sans banque centrale. Cette ligne passe devant tout le reste du deck — les ratios de solvabilité ne servent à rien à une banque qui meurt d\'illiquidité d\'abord (Northern Rock, SVB)'}. Solvabilité et liquidité sont deux morts distinctes, mesurées séparément.`,
          }],
          pieges: [en
            ? `Treating the LCR as a solvency indicator: it measures whether the bank survives a RUN, not whether assets exceed liabilities — 2008 and 2023 killed regulatorily solvent banks.`
            : `Traiter le LCR comme un indicateur de solvabilité : il mesure si la banque survit à un RUN, pas si les actifs dépassent les dettes — 2008 et 2023 ont tué des banques réglementairement solvables.`],
        },
        {
          intitule: en ? 'd) The desk\'s daily VaR' : 'd) La VaR quotidienne du desk',
          enonce: en
            ? `Market book of ${mEur(vTrading)}, volatility ${pct(volTrading, 0)}, z = 2.33, 252 days. What is the one-day 99% VaR (in €m)?`
            : `Poche de marché de ${mEur(vTrading)}, volatilité ${pct(volTrading, 0)}, z = 2,33, 252 jours. Quelle est la VaR 99 % à 1 jour (en M€) ?`,
          reponse: repVar, tolerance: 0.05, toleranceMode: 'absolu', unite: 'M€',
          etapes: [{
            titre: en ? 'Useful 251 days a year' : 'Utile 251 jours par an',
            contenu: en
              ? `VaR = ${f(vTrading, 0)} × 2.33 × ${f(volTrading, 0)}% × √(1/252) = **${mEur(repVar, 2)}**. This is the desk's daily thermometer — the number the limits are written against, the one the backtest counts. And it is useful exactly 251 days a year: on the day that matters, the quantile is mute by construction. Which is why the next line of the deck exists.`
              : `VaR = ${f(vTrading, 0)} × 2,33 × ${f(volTrading, 0)} % × √(1/252) = **${mEur(repVar, 2)}**. C'est le thermomètre quotidien du desk — le nombre contre lequel les limites sont écrites, celui que le backtest compte. Et il est utile exactement 251 jours par an : le jour qui compte, le quantile est muet par construction. C'est pourquoi la ligne suivante du deck existe.`,
          }],
          pieges: [en
            ? `Showing the board the VaR as "what we can lose": the stress of e) is ${f(r0(Math.abs(perteStress) / varJ), 0)} times bigger — a board that only sees the VaR is being told the weather, not the flood line.`
            : `Montrer au conseil la VaR comme « ce qu'on peut perdre » : le stress du e) est ${f(r0(Math.abs(perteStress) / varJ), 0)} fois plus gros — un conseil qui ne voit que la VaR reçoit la météo, pas la ligne de crue.`],
        },
        {
          intitule: en ? 'e) The stress: −20% and the landing CET1' : 'e) Le stress : −20 % et le CET1 d\'arrivée',
          enonce: en
            ? `Market −20%, book of ${mEur(vTrading)} with beta ${f(beta, 1)}, RWA held constant. Loss, then post-stress CET1: what ratio (in %) does the bank land at?`
            : `Marché à −20 %, poche de ${mEur(vTrading)} de bêta ${f(beta, 1)}, RWA constants. La perte, puis le CET1 post-stress : à quel ratio (en %) la banque atterrit-elle ?`,
          reponse: repCet1Post, tolerance: 0.1, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The fifth number, where it hurts' : 'Le cinquième chiffre, là où ça fait mal',
            contenu: en
              ? `Loss = ${f(vTrading, 0)} × (−20%) × ${f(beta, 1)} = ${mEur(repPerte, 1)} — about ${f(r0(Math.abs(perteStress) / varJ), 0)} times the daily VaR of d). Post-stress CET1 = (${f(fp, 0)} − ${f(r1(Math.abs(perteStress)), 1)}) / ${f(repRwa, 0)} × 100 = **${pct(repCet1Post, 2)}** — BELOW the ${pct(exigence, 1)} bar: the bank crosses into its conservation buffer, where distribution restrictions are automatic and a remediation plan is expected. No probability is attached to the scenario, and that is its virtue (chapter 5): the board cannot argue with "if". It can only decide what to do about it — next question.`
              : `Perte = ${f(vTrading, 0)} × (−20 %) × ${f(beta, 1)} = ${mEur(repPerte, 1)} — environ ${f(r0(Math.abs(perteStress) / varJ), 0)} fois la VaR quotidienne du d). CET1 post-stress = (${f(fp, 0)} − ${f(r1(Math.abs(perteStress)), 1)}) / ${f(repRwa, 0)} × 100 = **${pct(repCet1Post, 2)}** — SOUS la barre des ${pct(exigence, 1)} : la banque entre dans son coussin de conservation, où les restrictions de distribution sont automatiques et un plan de remédiation attendu. Aucune probabilité n'est attachée au scénario, et c'est sa vertu (chapitre 5) : le conseil ne peut pas discuter le « si ». Il ne peut que décider quoi en faire — question suivante.`,
          }],
          pieges: [en
            ? `Weighing the stress against the VaR ("a ${f(r0(Math.abs(perteStress) / varJ), 0)}-sigma event, impossible"): the stress test deliberately has NO probability — it is the anti-VaR, and 2008, 2020 and 2022 are the reason it exists.`
            : `Peser le stress contre la VaR (« un événement à ${f(r0(Math.abs(perteStress) / varJ), 0)} sigmas, impossible ») : le stress test n'a délibérément AUCUNE probabilité — c'est l'anti-VaR, et 2008, 2020 et 2022 sont la raison de son existence.`],
        },
        {
          intitule: en ? 'f) Three decisions, one recommendation' : 'f) Trois décisions, une recommandation',
          enonce: en
            ? `To bring the post-stress CET1 back to the ${pct(exigence, 1)} requirement, how much CET1 (in €m) would have to be raised, at constant RWA?`
            : `Pour ramener le CET1 post-stress à l'exigence de ${pct(exigence, 1)}, combien de CET1 (en M€) faudrait-il lever, à RWA constants ?`,
          reponse: repBesoinCap, tolerance: 1, toleranceMode: 'absolu', unite: 'M€',
          etapes: [
            {
              titre: en ? 'The three levers, priced' : 'Les trois leviers, chiffrés',
              contenu: en
                ? `Need = (${f(exigence, 1)} − ${f(repCet1Post, 2)}) × ${f(repRwa, 0)} / 100 = **${mEur(repBesoinCap, 1)}**. The board's three levers, each with its figure. REDUCE: shed about ${mEur(r0(reductionRwa))} of RWA (sell corporates, rotate toward sovereigns) so the stressed capital covers the bar. HEDGE: bring the market book's beta from ${f(beta, 1)} down to about ${f(r2(betaCible), 2)} (index futures, puts — module 8), so the same −20% only consumes the available margin. RAISE: ${mEur(repBesoinCap, 1)} of fresh CET1 — dilutive, and slow.`
                : `Besoin = (${f(exigence, 1)} − ${f(repCet1Post, 2)}) × ${f(repRwa, 0)} / 100 = **${mEur(repBesoinCap, 1)}**. Les trois leviers du conseil, chacun avec son montant. RÉDUIRE : céder environ ${mEur(r0(reductionRwa))} de RWA (vendre du corporate, tourner vers le souverain) pour que le capital stressé couvre la barre. COUVRIR : ramener le bêta de la poche de ${f(beta, 1)} à environ ${f(r2(betaCible), 2)} (futures sur indice, puts — module 8), pour que le même −20 % ne consomme plus que la marge disponible. LEVER : ${mEur(repBesoinCap, 1)} de CET1 frais — dilutif, et lent.`,
            },
            {
              titre: en ? 'The recommendation — and the closing sentence' : 'La recommandation — et la phrase de sortie',
              contenu: en
                ? `A real CRO combines, in calendar order: hedge NOW (a hedge goes on in a day; the market does not wait for a rights issue), reduce over the quarter, and raise only if the buffer must be rebuilt durably${lcr < 100 ? ' — and fix the LCR in parallel: capital is useless to a bank that dies of liquidity first (SVB)' : ' — keeping one eye on the LCR: compliant today, but a real run does not read the regulatory scenario'}. The closing sentence for the board, which is also the module's: the second line does not run the bank — it bounds what the first line may do, and the limits exist precisely for the days when the front office is sure of itself.`
                : `Un vrai CRO combine, dans l'ordre du calendrier : couvrir MAINTENANT (une couverture se met en place dans la journée ; le marché n'attend pas une augmentation de capital), réduire au fil du trimestre, et lever seulement si le coussin doit être reconstruit durablement${lcr < 100 ? ' — et traiter le LCR en parallèle : le capital ne sert à rien à une banque qui meurt de liquidité d\'abord (SVB)' : ' — en gardant un œil sur le LCR : conforme aujourd\'hui, mais un vrai run ne lit pas le scénario réglementaire'}. La phrase de sortie pour le conseil, qui est aussi celle du module : la deuxième ligne ne gère pas la banque — elle borne ce que la première a le droit de faire, et les limites existent précisément pour les jours où le front est sûr de lui.`,
            },
          ],
          pieges: [en
            ? `Picking "the best" option while ignoring the calendar: a capital raise takes months, a hedge takes a day — in risk management, timing is a datum, not a detail.`
            : `Choisir « la meilleure » option en ignorant le calendrier : une levée de capital prend des mois, une couverture prend une journée — en gestion des risques, le calendrier est une donnée, pas un détail.`],
        },
      ],
    };
  },
};

export const problemesLot2: ProblemGenerator[] = [
  comiteInvestissement,
  frontierePratique,
  rapportVar,
  stressTestBce,
  fondsSharpe4,
  vendeurVolatilite,
  svbStressTest,
  mandatEsg,
  gestionLdi,
  croFaceAuConseil,
];
