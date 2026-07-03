/**
 * Moules de problèmes multi-étapes du module Crédit — LOT 2 :
 * 4 moules N3 (m5-pb-11 à m5-pb-14) et 6 boss N4 narratifs (m5-pb-15 à
 * m5-pb-20), alignés sur les chapitres 1-7 du module (spread, notation,
 * perte attendue, pricing, CDS, titrisation, cycle) et ancrés sur les
 * chapitres 3 et 5 du module 11 (LTCM, AIG, Lehman, subprimes).
 * Chaque moule : 3 scénarios FR + EN, 5-6 sous-questions chaînées (la sortie
 * de a) nourrit b), c)…), corrigés calculés via calculs.ts (m5) et deux ponts
 * m11 (financement repo, vente forcée) — jamais de texte figé.
 * INVARIANT BILINGUE : tous les tirages aléatoires ont lieu AVANT toute
 * branche de langue — même seed + même scénario ⇒ mêmes nombres en français
 * et en anglais.
 * FAITS DE COURS ET D'HISTOIRE : exactement ceux des chapitres — falaise
 * BBB−/BB+ et Ford mars 2020 (~36 Md$ basculés en HY) ; enchère Lehman
 * octobre 2008 : R = 8,625 %, les vendeurs paient 91,375 % ; AIG : ~500 Md$
 * de protection vendue sans réserves, sauvée le 16 septembre 2008 (85 Md$
 * contre 79,9 % du capital) ; LTCM : l'arbitrage « certain à terme » tué par
 * les appels de marge (m11 ch3) ; le AAA de CDO qui cote 30 sans défaut
 * réalisé (m11 ch5) ; rétention 5 % et label STS post-2008 ; pic de défauts
 * 12-18 mois après le retournement, rendement net = nominal − PD × LGD.
 * Conventions (en-tête de calculs.ts) : spreads en pb, PD annuelles en %,
 * composition discrète (1 − PD)^n, R en % du nominal, notionnels CDS en
 * millions (prime en euros, paiement contingent en millions), tranches par
 * attache/détachement en % du pool, pertes signées côté écrans.
 */
import { formatNombreLangue } from '../../../engine/answers';
import { mulberry32, randFloat, randInt } from '../../../engine/rng';
import type { Langue, ProblemGenerator } from '../../../engine/types';
import { financementRepo, venteForceePourCash } from '../11-histoire-crises/calculs';
import {
  baseCdsPb, paiementDefautCdsMillions, pdImplicitePct, perteAttenduePct, perteTranchePct,
  primeCdsAnnuelleEur, prixObligationRisquee, probaDefautCumuleePct, probaSurvieCumuleePct,
  rendementNetDefautsPct, spreadCreditPb, spreadTheoriquePb, variationPrixSpreadPct,
} from './calculs';

/** Un « moule » de problème est un ProblemGenerator de l'engine (alias local). */
export type ProblemeMoule = ProblemGenerator;

const M5 = '05-credit';
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
/* 11. m5-pb-11 — Le fallen angel — N3                                 */
/* ------------------------------------------------------------------ */
const fallenAngel: ProblemeMoule = {
  id: 'm5-pb-11', moduleId: M5,
  titre: 'Le fallen angel : la nuit où BBB− devient BB+',
  titreEn: 'The fallen angel: the night BBB− becomes BB+',
  typeDeCas: 'dégradation et ventes forcées',
  typeDeCasEn: 'downgrade and forced selling',
  difficulte: 3,
  scenarios: ['L\'analyste crédit d\'un assureur, la veille du comité de notation', 'Le trader de flux qui devra coter la souche demain matin', 'Le gérant high yield qui attend le fallen angel de l\'autre côté'],
  scenariosEn: ['The insurer\'s credit analyst, the night before the rating committee', 'The flow trader who will have to quote the bond tomorrow morning', 'The high yield manager waiting for the fallen angel on the other side'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const rSansRisque = randFloat(rng, 2.5, 3.5, 1);
    const ecartRendement = randFloat(rng, 1.4, 1.9, 1);
    const duration = randFloat(rng, 5, 7, 1);
    const s1 = randInt(rng, 380, 480);
    const encours = randInt(rng, 24, 40);
    const partContrainte = randInt(rng, 30, 45);
    const position = randInt(rng, 40, 80);
    const rendementObligation = r2(rSansRisque + ecartRendement);

    const s0 = spreadCreditPb(rendementObligation, rSansRisque);
    const pd0 = pdImplicitePct(s0, 40);
    const dS = s1 - s0;
    const dP = variationPrixSpreadPct(duration, dS);
    const perte = (dP / 100) * position;
    const ventes = (encours * partContrainte) / 100;
    const pd1 = pdImplicitePct(s1, 40);
    const ratio = pd1 / pd0;
    const repS0 = r0(s0);
    const repPd0 = r2(pd0);
    const repDP = r2(dP);
    const repPerte = r2(perte);
    const repVentes = r2(ventes);
    const repRatio = r2(ratio);

    const { en, f, pct, pb: bp } = outils(langue);
    const desc = en
      ? `an industrial issuer rated BBB− with a negative outlook carries about €${f(encours, 0)}bn of bonds; its debt yields ${pct(rendementObligation, 2)} against a risk-free rate of ${pct(rSansRisque, 1)} at the same maturity, with a spread duration around ${f(duration, 1)}; roughly ${pct(partContrainte, 0)} of the paper sits with insurers and IG funds whose mandates forbid holding high yield; if the last agency cuts the rating one notch, the market consensus sees the spread repricing toward ${bp(s1)} — the precedent everyone quotes is Ford, March 2020, when about \\$36bn of debt crossed the border in one day; the recovery convention is R = 40%`
      : `un émetteur industriel noté BBB− sous perspective négative porte environ ${f(encours, 0)} Md€ d'obligations ; sa dette rend ${pct(rendementObligation, 2)} contre un taux sans risque de ${pct(rSansRisque, 1)} à même maturité, pour une spread duration d'environ ${f(duration, 1)} ; à peu près ${pct(partContrainte, 0)} du papier est logé chez des assureurs et des fonds IG dont les mandats interdisent le high yield ; si la dernière agence dégrade d'un cran, le consensus voit le spread se repricer vers ${bp(s1)} — le précédent que tout le monde cite est Ford, mars 2020, quand environ 36 Md\\$ de dette ont franchi la frontière en un jour ; la convention de recouvrement est R = 40 %`;
    const contexte = (en
      ? [
        `Tuesday, 7 p.m. The rating committee of the last agency still holding the issuer in investment grade meets tomorrow at noon. You are the credit analyst of an insurer that owns €${f(position, 0)}m of the bond — and your mandate says: nothing below BBB−. Your CIO wants one page before the committee: what the spread says today, what it will say tomorrow, and what the cliff costs. The file: ${desc}. Chapter 2 called the BBB−/BB+ border "the sacred frontier"; tonight you find out why it deserves the name.`,
        `Wednesday, 7:40 a.m. You run the IG flow book, and the agency's press release is twenty minutes old: one notch down, outlook stable — the issuer is high yield now. Your screens are about to fill with RFQs from every constrained seller in Europe, all the same way. The facts: ${desc}. Before the first quote, rebuild the arithmetic: the spread before, the default probability it priced, the price hit the widening implies, and the wall of paper about to look for a bid.`,
        `Wednesday, 10 a.m. You manage a high yield fund, and the fallen angel just landed in your universe: forced sellers on one side, a spread that has already blown out on the other. Your job is to know whether the panic overpays you. The situation: ${desc}. Work through the seller's arithmetic first — the spread, the implied PD, the mark-to-market, the mechanical flow — then decide what the new spread really prices.`,
      ]
      : [
        `Mardi, 19 h. Le comité de notation de la dernière agence qui tient encore l'émetteur en investment grade se réunit demain à midi. Vous êtes l'analyste crédit d'un assureur qui détient ${f(position, 0)} M€ de la souche — et votre mandat dit : rien sous BBB−. Votre directeur des investissements veut une page avant le comité : ce que le spread dit aujourd'hui, ce qu'il dira demain, et ce que coûte la falaise. Le dossier : ${desc}. Le chapitre 2 appelait la frontière BBB−/BB+ « la frontière sacrée » ; cette nuit, vous découvrez pourquoi elle mérite son nom.`,
        `Mercredi, 7 h 40. Vous tenez le book de flux IG, et le communiqué de l'agence a vingt minutes : un cran de moins, perspective stable — l'émetteur est high yield désormais. Vos écrans vont se remplir de RFQ de tous les vendeurs contraints d'Europe, tous dans le même sens. Les faits : ${desc}. Avant la première cote, refaites l'arithmétique : le spread d'avant, la probabilité de défaut qu'il priçait, le choc de prix que l'écartement implique, et le mur de papier qui va chercher un prix.`,
        `Mercredi, 10 h. Vous gérez un fonds high yield, et le fallen angel vient d'atterrir dans votre univers : des vendeurs forcés d'un côté, un spread déjà écarté de l'autre. Votre métier est de savoir si la panique vous surpaie. La situation : ${desc}. Déroulez d'abord l'arithmétique du vendeur — le spread, la PD implicite, le mark-to-market, le flux mécanique — puis décidez ce que le nouveau spread price vraiment.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The spread the day before' : 'a) Le spread de la veille',
          enonce: en
            ? `The bond yields ${pct(rendementObligation, 2)}, the risk-free rate at the same maturity is ${pct(rSansRisque, 1)}. What is the credit spread, in basis points?`
            : `L'obligation rend ${pct(rendementObligation, 2)}, le taux sans risque à même maturité est ${pct(rSansRisque, 1)}. Quel est le spread de crédit, en points de base ?`,
          reponse: repS0, tolerance: 2, toleranceMode: 'absolu', unite: 'pb',
          etapes: [{
            titre: en ? 'The thermometer of chapter 1' : 'Le thermomètre du chapitre 1',
            contenu: en
              ? `Spread = (${f(rendementObligation, 2)} − ${f(rSansRisque, 1)}) × 100 = **${bp(repS0)}**. That level sits at the top of the calm-weather IG range (80-150 bp for euro corporates): the market already charges the issuer more than a clean BBB, because a negative outlook is a probability of downgrade, and the spread prices probabilities before the agencies certify them. The spread moves first; the rating follows.`
              : `Spread = (${f(rendementObligation, 2)} − ${f(rSansRisque, 1)}) × 100 = **${bp(repS0)}**. Ce niveau se loge en haut de la fourchette IG de temps calme (80-150 pb pour du corporate euro) : le marché fait déjà payer l'émetteur plus cher qu'un BBB propre, parce qu'une perspective négative est une probabilité de dégradation, et que le spread price les probabilités avant que les agences ne les certifient. Le spread bouge en premier ; la notation suit.`,
          }],
          pieges: [en
            ? `Forgetting the ×100 gives ${f(r2(ecartRendement), 2)} "percent" instead of ${bp(repS0)}: spreads are QUOTED in basis points — the desk's language, 100 bp = 1%.`
            : `Oublier le ×100 donne ${f(r2(ecartRendement), 2)} « pour cent » au lieu de ${bp(repS0)} : les spreads se COTENT en points de base — la langue du desk, 100 pb = 1 %.`],
        },
        {
          intitule: en ? 'b) The default probability it priced' : 'b) La probabilité de défaut qu\'il priçait',
          enonce: en
            ? `With a recovery of 40%, what annual default probability (in %) does the ${bp(repS0)} spread imply?`
            : `Avec un recouvrement de 40 %, quelle probabilité de défaut annuelle (en %) le spread de ${bp(repS0)} implique-t-il ?`,
          reponse: repPd0, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Reading the spread backwards' : 'Lire le spread à l\'envers',
            contenu: en
              ? `Implied PD = (${f(repS0, 0)}/100) / (1 − 40%) = **${pct(repPd0, 2)}** per year. That is the desk's inverse reading from chapter 3: "what is the market pricing?". Careful with its nature: this is a RISK-NEUTRAL probability — it overstates the historical default frequency of a BBB− issuer (a few tenths of a percent per year) precisely because the spread also pays a risk premium, a liquidity premium and the fear of downgrades. Keep both numbers in mind: what the market charges, and what history delivers.`
              : `PD implicite = (${f(repS0, 0)}/100) / (1 − 40 %) = **${pct(repPd0, 2)}** par an. C'est la lecture inverse du chapitre 3, celle du desk : « le marché price quoi ? ». Attention à sa nature : c'est une probabilité RISQUE-NEUTRE — elle surestime la fréquence historique de défaut d'un émetteur BBB− (quelques dixièmes de pour cent par an) précisément parce que le spread paie aussi une prime de risque, une prime de liquidité et la peur des dégradations. Gardez les deux nombres en tête : ce que le marché fait payer, et ce que l'histoire livre.`,
          }],
          pieges: [en
            ? `Dividing by R instead of by LGD (1 − R) is the classic inversion: the spread compensates the LOSS given default, ${pct(60, 0)} of notional, not the recovered part.`
            : `Diviser par R au lieu de LGD (1 − R) est l'inversion classique : le spread rémunère la PERTE en cas de défaut, ${pct(60, 0)} du nominal, pas la partie recouvrée.`],
        },
        {
          intitule: en ? 'c) The mark-to-market of the cliff' : 'c) Le mark-to-market de la falaise',
          enonce: en
            ? `The downgrade reprices the spread from ${bp(repS0)} to ${bp(s1)}. With a spread duration of ${f(duration, 1)}, what price change (in %, signed) does the widening impose?`
            : `La dégradation reprice le spread de ${bp(repS0)} à ${bp(s1)}. Avec une spread duration de ${f(duration, 1)}, quelle variation de prix (en %, signée) l'écartement impose-t-il ?`,
          reponse: repDP, tolerance: 0.15, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Spread duration: chapter 4 with a credit shock' : 'La spread duration : le chapitre 4 avec un choc de crédit',
            contenu: en
              ? `ΔP = −${f(duration, 1)} × ${f(r0(dS), 0)}/100 = **${pct(repDP, 2)}**. Same arithmetic as module 4's duration, but the shock comes from credit, not rates: the spread is a risk class of its own, with its own duration. A ${bp(r0(dS))} widening on a duration of ${f(duration, 1)} costs like a bad month on equities — and it happens in one session, on a bond that was investment grade at breakfast.`
              : `ΔP = −${f(duration, 1)} × ${f(r0(dS), 0)}/100 = **${pct(repDP, 2)}**. Même arithmétique que la duration du module 4, mais le choc vient du crédit, pas des taux : le spread est une classe de risque à part entière, avec sa propre duration. Un écartement de ${bp(r0(dS))} sur une duration de ${f(duration, 1)} coûte comme un mauvais mois d'actions — et il arrive en une séance, sur une obligation qui était investment grade au petit-déjeuner.`,
          }],
          pieges: [en
            ? `Using the widening in % (${f(r2(dS / 100), 2)}) without dividing by 100 in the formula multiplies the loss by 100: variationPrixSpreadPct takes the move in BASIS POINTS.`
            : `Passer l'écartement en % (${f(r2(dS / 100), 2)}) sans le /100 de la formule multiplie la perte par 100 : la spread duration reçoit le mouvement en POINTS DE BASE.`],
        },
        {
          intitule: en ? 'd) The loss on your line' : 'd) La perte sur votre ligne',
          enonce: en
            ? `On a €${f(position, 0)}m position, what does that mark-to-market represent, in €m (signed)?`
            : `Sur une position de ${f(position, 0)} M€, que représente ce mark-to-market, en M€ (signé) ?`,
          reponse: repPerte, tolerance: Math.max(0.1, Math.abs(repPerte) * 0.03), toleranceMode: 'absolu', unite: 'M€',
          etapes: [{
            titre: en ? 'Before a single euro of default' : 'Avant le moindre euro de défaut',
            contenu: en
              ? `Loss = ${pct(repDP, 2)} × ${f(position, 0)} = **€${f(repPerte, 2)}m** — and note what did NOT happen: no coupon was missed, no default occurred, the issuer's factories run exactly as they did yesterday. The loss is pure repricing of a probability. That is the lesson the m11 kept hammering: in credit, the mark-to-market arrives long before the credit event, and it is the mark-to-market that forces decisions.`
              : `Perte = ${pct(repDP, 2)} × ${f(position, 0)} = **${f(repPerte, 2)} M€** — et notez ce qui ne s'est PAS produit : aucun coupon manqué, aucun défaut, les usines de l'émetteur tournent exactement comme hier. La perte est un pur repricing de probabilité. C'est la leçon que le m11 martelait : en crédit, le mark-to-market arrive bien avant l'événement de crédit, et c'est le mark-to-market qui force les décisions.`,
          }],
          pieges: [en
            ? `Reporting the loss as a positive number confuses the sign convention: losses are SIGNED on the screens — ${f(repPerte, 2)}, not ${f(Math.abs(repPerte), 2)}.`
            : `Rendre la perte en positif confond la convention de signe : les pertes sont SIGNÉES côté écrans — ${f(repPerte, 2)}, pas ${f(Math.abs(repPerte), 2)}.`],
        },
        {
          intitule: en ? 'e) The mechanical wall of paper' : 'e) Le mur de papier mécanique',
          enonce: en
            ? `About ${pct(partContrainte, 0)} of the €${f(encours, 0)}bn outstanding sits in IG-constrained mandates that must now sell. How many €bn of bonds hit the market mechanically?`
            : `Environ ${pct(partContrainte, 0)} des ${f(encours, 0)} Md€ d'encours sont logés dans des mandats contraints IG qui doivent désormais vendre. Combien de Md€ d'obligations arrivent mécaniquement sur le marché ?`,
          reponse: repVentes, tolerance: 0.1, toleranceMode: 'absolu', unite: 'Md€',
          etapes: [{
            titre: en ? 'Sellers who do not look at the price' : 'Des vendeurs qui ne regardent pas le prix',
            contenu: en
              ? `Mechanical flow = ${f(encours, 0)} × ${f(partContrainte, 0)}% = **€${f(repVentes, 2)}bn** — sellers whose mandate, not whose opinion, pulls the trigger. This is why the fallen angel overshoots: the selling is price-INSENSITIVE, into a HY market ten times smaller than the IG market it leaves. Chapter 7 named the buyer on the other side: the HY funds and distressed desks that harvest the overshoot — the reason fallen angels are, historically, one of the best-performing segments of credit AFTER the fall.`
              : `Flux mécanique = ${f(encours, 0)} × ${f(partContrainte, 0)} % = **${f(repVentes, 2)} Md€** — des vendeurs dont c'est le mandat, pas l'opinion, qui appuie sur la détente. Voilà pourquoi le fallen angel sur-réagit : la vente est INSENSIBLE au prix, vers un marché HY dix fois plus petit que le marché IG qu'elle quitte. Le chapitre 7 a nommé l'acheteur d'en face : les fonds HY et les desks distressed qui moissonnent la sur-réaction — la raison pour laquelle les fallen angels sont, historiquement, un des meilleurs segments du crédit APRÈS la chute.`,
          }],
          pieges: [en
            ? `"The downgrade creates the risk" reverses causality: the risk was there before — the downgrade creates the FLOW, and the flow creates the price dislocation. Ford, March 2020: ~\\$36bn crossed in one day.`
            : `« La dégradation crée le risque » inverse la causalité : le risque était là avant — la dégradation crée le FLUX, et le flux crée la dislocation de prix. Ford, mars 2020 : ~36 Md\\$ basculés en un jour.`],
        },
        {
          intitule: en ? 'f) What the new spread prices' : 'f) Ce que le nouveau spread price',
          enonce: en
            ? `At ${bp(s1)} with R = 40%, the implied PD becomes ${pct(r2(pd1), 2)}. By what factor has the implied default probability been multiplied relative to question b)?`
            : `À ${bp(s1)} avec R = 40 %, la PD implicite devient ${pct(r2(pd1), 2)}. Par quel facteur la probabilité de défaut implicite a-t-elle été multipliée par rapport à la question b) ?`,
          reponse: repRatio, tolerance: 0.1, toleranceMode: 'absolu', unite: '×',
          etapes: [
            {
              titre: en ? 'One notch, a multiplied probability' : 'Un cran, une probabilité multipliée',
              contenu: en
                ? `Factor = ${f(r2(pd1), 2)} / ${f(repPd0, 2)} = **${f(repRatio, 2)}×** (the ratio of the spreads, since R is unchanged). One rating notch — the smallest step of the scale — and the market multiplies the priced default probability by ${f(repRatio, 1)}. Nothing fundamental moved that fast: what moved is WHO is allowed to hold the paper. The border effect is an institutional discontinuity, not an economic one.`
                : `Facteur = ${f(r2(pd1), 2)} / ${f(repPd0, 2)} = **${f(repRatio, 2)}×** (le rapport des spreads, puisque R est inchangé). Un cran de notation — le plus petit pas de l'échelle — et le marché multiplie la probabilité de défaut pricée par ${f(repRatio, 1)}. Rien de fondamental n'a bougé aussi vite : ce qui a bougé, c'est QUI a le droit de porter le papier. L'effet de frontière est une discontinuité institutionnelle, pas économique.`,
            },
            {
              titre: en ? 'The oral takeaway' : 'La phrase pour l\'oral',
              contenu: en
                ? `Three lines for the jury. One: the spread anticipates, the rating certifies — the widening starts months before the committee. Two: the BBB−/BB+ border is sacred because mandates make it a cliff of FLOWS, not of fundamentals. Three: the overshoot is the entry point of the cycle's buyers — chapter 7's best vintages are built on other people's forced sales.`
                : `Trois lignes pour le jury. Un : le spread anticipe, la notation certifie — l'écartement commence des mois avant le comité. Deux : la frontière BBB−/BB+ est sacrée parce que les mandats en font une falaise de FLUX, pas de fondamentaux. Trois : la sur-réaction est le point d'entrée des acheteurs du cycle — les meilleurs millésimes du chapitre 7 se construisent sur les ventes forcées des autres.`,
            },
          ],
          pieges: [en
            ? `Comparing the SPREADS additively (${bp(r0(dS))} "more") misses the point the jury tests: in probability space, the move is MULTIPLICATIVE — the market prices ${f(repRatio, 1)} times more default risk.`
            : `Comparer les SPREADS additivement (${bp(r0(dS))} « de plus ») rate le point que le jury teste : en espace de probabilités, le mouvement est MULTIPLICATIF — le marché price ${f(repRatio, 1)} fois plus de risque de défaut.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 12. m5-pb-12 — Pricing par les probabilités — N3                    */
/* ------------------------------------------------------------------ */
const pricingProbabilites: ProblemeMoule = {
  id: 'm5-pb-12', moduleId: M5,
  titre: 'Le spread paie-t-il ? Survie, défaut cumulé et prime de risque',
  titreEn: 'Does the spread pay? Survival, cumulative default and risk premium',
  typeDeCas: 'probabilités et perte attendue',
  typeDeCasEn: 'probabilities and expected loss',
  difficulte: 3,
  scenarios: ['L\'analyste buy-side qui doit recommander la souche', 'Le comité d\'investissement qui compare deux émetteurs', 'La colle du jury : « votre spread, il rémunère quoi, exactement ? »'],
  scenariosEn: ['The buy-side analyst who must recommend the bond', 'The investment committee comparing two issuers', 'The jury\'s grilling: "your spread — what exactly does it pay for?"'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const pdHist = randFloat(rng, 1.5, 3, 1);
    const recouvrement = randInt(rng, 35, 45);
    const sMarche = randInt(rng, 220, 320);

    const survie3 = probaSurvieCumuleePct(pdHist, 3);
    const defaut5 = probaDefautCumuleePct(pdHist, 5);
    const el = perteAttenduePct(pdHist, recouvrement);
    const sTheo = spreadTheoriquePb(pdHist, recouvrement);
    const prime = sMarche - sTheo;
    const pdImp = pdImplicitePct(sMarche, recouvrement);
    const repSurvie3 = r2(survie3);
    const repDefaut5 = r2(defaut5);
    const repEl = r2(el);
    const repSTheo = r0(sTheo);
    const repPrime = r0(prime);
    const repPdImp = r2(pdImp);

    const { en, f, pct, pb: bp } = outils(langue);
    const desc = en
      ? `a high yield issuer, rating agencies' historical statistics giving an annual default probability of about ${pct(pdHist, 1)} for its rating class, a recovery convention of ${pct(recouvrement, 0)} on senior unsecured debt, and a 5-year bond whose market spread quotes ${bp(sMarche)} above the risk-free curve`
      : `un émetteur high yield, des statistiques historiques d'agences donnant une probabilité de défaut annuelle d'environ ${pct(pdHist, 1)} pour sa classe de notation, une convention de recouvrement de ${pct(recouvrement, 0)} sur la dette senior unsecured, et une obligation 5 ans dont le spread de marché cote ${bp(sMarche)} au-dessus de la courbe sans risque`;
    const contexte = (en
      ? [
        `Monday morning, the weekly credit meeting. You cover the name and the portfolio manager wants a recommendation before Thursday's primary window. The data: ${desc}. Your note must run the chapter 3 machine in order: survival, cumulative default, expected loss, actuarial spread — and end on the only question that matters: how much of the ${bp(sMarche)} is compensation for the average default, and how much is the premium for everything else?`,
        `Tuesday, the investment committee. Two names compete for the same line in the portfolio, and this one is the riskier: ${desc}. The committee's rule is chapter 3's: never compare gross spreads — compare what remains after expected losses. Build the file number by number: probability of surviving the holding period, cumulative default over the bond's life, annual expected loss, theoretical spread, and the premium the market adds on top.`,
        `The oral. The examiner slides a term sheet across the table: ${desc}. Then, with the smile of someone who has asked this a hundred times: "walk me through what this spread actually pays for — survival math first, premium last. Most candidates add default probabilities; show me you don't."`,
      ]
      : [
        `Lundi matin, la réunion crédit hebdomadaire. Vous couvrez le nom et le gérant veut une recommandation avant la fenêtre de primaire de jeudi. Les données : ${desc}. Votre note doit dérouler la machine du chapitre 3 dans l'ordre : survie, défaut cumulé, perte attendue, spread actuariel — et finir sur la seule question qui compte : combien des ${bp(sMarche)} rémunèrent le défaut moyen, et combien sont la prime pour tout le reste ?`,
        `Mardi, le comité d'investissement. Deux noms se disputent la même ligne du portefeuille, et celui-ci est le plus risqué : ${desc}. La règle du comité est celle du chapitre 3 : ne jamais comparer des spreads bruts — comparer ce qui reste après pertes attendues. Montez le dossier nombre par nombre : probabilité de survivre à la période de détention, défaut cumulé sur la vie du titre, perte attendue annuelle, spread théorique, et la prime que le marché ajoute par-dessus.`,
        `L'oral. L'examinateur fait glisser une term sheet sur la table : ${desc}. Puis, avec le sourire de celui qui l'a posée cent fois : « expliquez-moi ce que ce spread rémunère exactement — la mathématique de survie d'abord, la prime à la fin. La plupart des candidats additionnent les probabilités de défaut ; montrez-moi que pas vous. »`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) Surviving three years' : 'a) Survivre trois ans',
          enonce: en
            ? `With an annual default probability of ${pct(pdHist, 1)}, what is the probability (in %) that the issuer is still alive after 3 years?`
            : `Avec une probabilité de défaut annuelle de ${pct(pdHist, 1)}, quelle est la probabilité (en %) que l'émetteur soit encore en vie au bout de 3 ans ?`,
          reponse: repSurvie3, tolerance: 0.1, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Survival compounds, it does not subtract' : 'La survie se compose, elle ne se soustrait pas',
            contenu: en
              ? `Survival = 100 × (1 − ${f(pdHist, 1)}%)³ = **${pct(repSurvie3, 2)}**. Each year, the issuer must survive GIVEN that it survived the previous one: probabilities multiply. The discrete annual compounding (1 − PD)^n is the module's convention — the same arithmetic as compound interest, applied to staying alive.`
              : `Survie = 100 × (1 − ${f(pdHist, 1)} %)³ = **${pct(repSurvie3, 2)}**. Chaque année, l'émetteur doit survivre SACHANT qu'il a survécu à la précédente : les probabilités se multiplient. La composition discrète annuelle (1 − PD)^n est la convention du module — la même arithmétique que les intérêts composés, appliquée au fait de rester en vie.`,
          }],
          pieges: [en
            ? `Computing 100 − 3 × ${f(pdHist, 1)} = ${f(r2(100 - 3 * pdHist), 2)} is the additive error: close at short horizons, badly wrong at long ones — defaults compound, they do not add.`
            : `Calculer 100 − 3 × ${f(pdHist, 1)} = ${f(r2(100 - 3 * pdHist), 2)} est l'erreur additive : proche à horizon court, franchement fausse à horizon long — les défauts se composent, ils ne s'additionnent pas.`],
        },
        {
          intitule: en ? 'b) Cumulative default over the bond\'s life' : 'b) Le défaut cumulé sur la vie du titre',
          enonce: en
            ? `What is the cumulative default probability (in %) over the bond's 5 years?`
            : `Quelle est la probabilité de défaut cumulée (en %) sur les 5 ans de l'obligation ?`,
          reponse: repDefaut5, tolerance: 0.1, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'You have to be alive to die' : 'Il faut être vivant pour mourir',
            contenu: en
              ? `Cumulative default = 100 − 100 × (1 − ${f(pdHist, 1)}%)⁵ = **${pct(repDefaut5, 2)}** — and NOT 5 × ${f(pdHist, 1)} = ${pct(r2(5 * pdHist), 2)}, the number one trap of chapter 3. The gap between the two grows with the horizon, because a default in year 4 requires surviving years 1 to 3 first. On a 5-year holding, roughly one bond in ${f(r0(100 / defaut5), 0)} of this class will default: that is the raw material the spread must pay for.`
              : `Défaut cumulé = 100 − 100 × (1 − ${f(pdHist, 1)} %)⁵ = **${pct(repDefaut5, 2)}** — et PAS 5 × ${f(pdHist, 1)} = ${pct(r2(5 * pdHist), 2)}, le piège n° 1 du chapitre 3. L'écart entre les deux grandit avec l'horizon, parce qu'un défaut en année 4 exige d'avoir survécu aux années 1 à 3. Sur une détention de 5 ans, environ une obligation sur ${f(r0(100 / defaut5), 0)} de cette classe fera défaut : voilà la matière première que le spread doit payer.`,
          }],
          pieges: [en
            ? `5 × PD overstates the true cumulative default (${pct(r2(5 * pdHist), 2)} vs ${pct(repDefaut5, 2)}): the additive shortcut counts issuers as able to default twice.`
            : `5 × PD surestime le vrai défaut cumulé (${pct(r2(5 * pdHist), 2)} contre ${pct(repDefaut5, 2)}) : le raccourci additif compte des émetteurs capables de faire défaut deux fois.`],
        },
        {
          intitule: en ? 'c) The annual expected loss' : 'c) La perte attendue annuelle',
          enonce: en
            ? `With R = ${pct(recouvrement, 0)}, what is the annual expected loss (in % of notional)?`
            : `Avec R = ${pct(recouvrement, 0)}, quelle est la perte attendue annuelle (en % du nominal) ?`,
          reponse: repEl, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Three letters that summarise the trade' : 'Trois lettres qui résument le métier',
            contenu: en
              ? `EL = PD × LGD = ${f(pdHist, 1)}% × (1 − ${f(recouvrement, 0)}%) = **${pct(repEl, 2)}** per year. Read it as an expectation, not a forecast: the actual year delivers 0 or −${f(100 - recouvrement, 0)}, never −${f(repEl, 2)}. The EL is what an infinitely diversified portfolio of identical names would lose on average — and the reason a single line can never be judged on its EL alone.`
              : `EL = PD × LGD = ${f(pdHist, 1)} % × (1 − ${f(recouvrement, 0)} %) = **${pct(repEl, 2)}** par an. Lisez-la comme une espérance, pas une prévision : l'année réelle donne 0 ou −${f(100 - recouvrement, 0)}, jamais −${f(repEl, 2)}. L'EL est ce qu'un portefeuille infiniment diversifié de noms identiques perdrait en moyenne — et la raison pour laquelle une ligne isolée ne se juge jamais sur sa seule EL.`,
          }],
          pieges: [en
            ? `Multiplying PD by R (${f(r2(pdHist * recouvrement / 100), 2)}) instead of by LGD: you lose what is NOT recovered.`
            : `Multiplier PD par R (${f(r2(pdHist * recouvrement / 100), 2)}) au lieu de LGD : on perd ce qui n'est PAS recouvré.`],
        },
        {
          intitule: en ? 'd) The actuarial spread' : 'd) Le spread actuariel',
          enonce: en
            ? `Converted into basis points, what theoretical spread does that expected loss justify?`
            : `Convertie en points de base, quel spread théorique cette perte attendue justifie-t-elle ?`,
          reponse: repSTheo, tolerance: 3, toleranceMode: 'absolu', unite: 'pb',
          etapes: [{
            titre: en ? 'The spread that only pays the average' : 'Le spread qui ne paie que la moyenne',
            contenu: en
              ? `Theoretical spread = ${pct(repEl, 2)} × 100 = **${bp(repSTheo)}**. At that spread, the investor is compensated for the AVERAGE default and nothing else: no reward for the variance of outcomes, the illiquidity of the paper, or the fact that credit losses cluster in the exact months when everything else is falling. That spread is the floor, not the fair price.`
              : `Spread théorique = ${pct(repEl, 2)} × 100 = **${bp(repSTheo)}**. À ce spread, l'investisseur est payé pour le défaut MOYEN et rien d'autre : aucune rémunération pour la variance des scénarios, l'illiquidité du papier, ou le fait que les pertes de crédit se concentrent précisément dans les mois où tout le reste baisse. Ce spread est le plancher, pas le juste prix.`,
          }],
          pieges: [en
            ? `Presenting ${bp(repSTheo)} as "the fair value of the spread" forgets everything the EL does not measure: observed spreads sit SYSTEMATICALLY above the actuarial level.`
            : `Présenter ${bp(repSTheo)} comme « la juste valeur du spread » oublie tout ce que l'EL ne mesure pas : les spreads observés sont SYSTÉMATIQUEMENT au-dessus du niveau actuariel.`],
        },
        {
          intitule: en ? 'e) The risk premium' : 'e) La prime de risque',
          enonce: en
            ? `The market spread quotes ${bp(sMarche)}. How many basis points of premium does the market add above the actuarial spread?`
            : `Le spread de marché cote ${bp(sMarche)}. Combien de points de base de prime le marché ajoute-t-il au-dessus du spread actuariel ?`,
          reponse: repPrime, tolerance: 4, toleranceMode: 'absolu', unite: 'pb',
          etapes: [{
            titre: en ? 'What the extra basis points buy' : 'Ce que les points de base en plus achètent',
            contenu: en
              ? `Premium = ${f(sMarche, 0)} − ${f(repSTheo, 0)} = **${bp(repPrime)}** — roughly ${f(r0((prime / sMarche) * 100), 0)}% of the quoted spread. That gap is the "credit risk premium puzzle" of chapter 3: it pays for stress, not for the average default — the variance of outcomes, the liquidity you surrender, the correlation of credit losses with bad times. It is also the long-run source of return of the asset class: the patient investor harvests the premium the fearful one pays.`
              : `Prime = ${f(sMarche, 0)} − ${f(repSTheo, 0)} = **${bp(repPrime)}** — environ ${f(r0((prime / sMarche) * 100), 0)} % du spread coté. Cet écart est le « credit risk premium puzzle » du chapitre 3 : il rémunère le stress, pas le défaut moyen — la variance des scénarios, la liquidité qu'on abandonne, la corrélation des pertes de crédit avec les mauvaises années. C'est aussi la source de rendement de long terme de la classe d'actifs : l'investisseur patient moissonne la prime que le craintif paie.`,
          }],
          pieges: [en
            ? `Reading the whole ${bp(sMarche)} as default compensation double-counts: only ${bp(repSTheo)} pay the average default — the rest is premium.`
            : `Lire la totalité des ${bp(sMarche)} comme rémunération du défaut compte double : seuls ${bp(repSTheo)} paient le défaut moyen — le reste est de la prime.`],
        },
        {
          intitule: en ? 'f) The risk-neutral reading' : 'f) La lecture risque-neutre',
          enonce: en
            ? `Read backwards with R = ${pct(recouvrement, 0)}, what annual default probability (in %) does the ${bp(sMarche)} market spread imply?`
            : `Lu à l'envers avec R = ${pct(recouvrement, 0)}, quelle probabilité de défaut annuelle (en %) le spread de marché de ${bp(sMarche)} implique-t-il ?`,
          reponse: repPdImp, tolerance: 0.1, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'Two probabilities for one issuer' : 'Deux probabilités pour un même émetteur',
              contenu: en
                ? `Implied PD = (${f(sMarche, 0)}/100) / (1 − ${f(recouvrement, 0)}%) = **${pct(repPdImp, 2)}** per year — against ${pct(pdHist, 1)} in the historical statistics, a ratio of ${f(r1(pdImp / pdHist), 1)}. Both numbers are correct; they answer different questions. The historical PD says how often this class defaults; the risk-neutral PD says what the market CHARGES as if defaults were that frequent. The wedge between the two IS the risk premium of question e), expressed in probability space.`
                : `PD implicite = (${f(sMarche, 0)}/100) / (1 − ${f(recouvrement, 0)} %) = **${pct(repPdImp, 2)}** par an — contre ${pct(pdHist, 1)} dans les statistiques historiques, un rapport de ${f(r1(pdImp / pdHist), 1)}. Les deux nombres sont justes ; ils répondent à des questions différentes. La PD historique dit à quelle fréquence cette classe fait défaut ; la PD risque-neutre dit ce que le marché FAIT PAYER comme si les défauts étaient aussi fréquents. Le coin entre les deux EST la prime de risque de la question e), exprimée en espace de probabilités.`,
            },
            {
              titre: en ? 'The recommendation, in one sentence' : 'La recommandation, en une phrase',
              contenu: en
                ? `The sentence that closes the note: "the market pays me ${bp(repPrime)} above the actuarial cost of default — I am being paid ${f(r1(pdImp / pdHist), 1)} times the historical default frequency to bear the stress scenarios." Whether that is enough is a judgment on the cycle (chapter 7), not on the arithmetic — but without the arithmetic, the judgment is a guess.`
                : `La phrase qui clôt la note : « le marché me paie ${bp(repPrime)} au-dessus du coût actuariel du défaut — je suis payé ${f(r1(pdImp / pdHist), 1)} fois la fréquence historique de défaut pour porter les scénarios de stress. » Savoir si c'est assez est un jugement sur le cycle (chapitre 7), pas sur l'arithmétique — mais sans l'arithmétique, le jugement est une devinette.`,
            },
          ],
          pieges: [en
            ? `Using the risk-neutral PD (${pct(repPdImp, 2)}) to forecast actual defaults overstates them by construction: it embeds the premium. Forecast with historical PDs; price with risk-neutral ones.`
            : `Utiliser la PD risque-neutre (${pct(repPdImp, 2)}) pour prévoir les défauts réels les surestime par construction : elle embarque la prime. On prévoit avec les PD historiques ; on price avec les risque-neutres.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 13. m5-pb-13 — Le structureur de CLO — N3                           */
/* ------------------------------------------------------------------ */
const structureurClo: ProblemeMoule = {
  id: 'm5-pb-13', moduleId: M5,
  titre: 'Le structureur de CLO : vendre de l\'épaisseur de coussin',
  typeDeCas: 'titrisation et tranches',
  titreEn: 'The CLO structurer: selling cushion thickness',
  typeDeCasEn: 'securitisation and tranches',
  difficulte: 3,
  scenarios: ['Le structureur qui dessine la capital structure', 'L\'investisseur mezzanine qui stress-teste avant de signer', 'L\'agence de notation qui fixe le prix du AAA'],
  scenariosEn: ['The structurer drawing the capital structure', 'The mezzanine investor stress-testing before signing', 'The rating agency setting the price of the AAA'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const pool = randInt(rng, 400, 600);
    const pdLoans = randFloat(rng, 2, 4, 1);
    const rLoans = randInt(rng, 60, 70);
    const attache1 = randInt(rng, 7, 9);
    const epaisseurMezz = randInt(rng, 6, 8);
    const attache2 = attache1 + epaisseurMezz;
    const l1 = randFloat(rng, 2, 4, 1);
    const l2 = randInt(rng, attache1 + 2, attache2 - 2);
    const l3 = randInt(rng, attache2 + 3, attache2 + 8);

    const elPool = perteAttenduePct(pdLoans, rLoans);
    const perteEquity1 = perteTranchePct(l1, 0, attache1);
    const perteMezz2 = perteTranchePct(l2, attache1, attache2);
    const perteMezzMe = (epaisseurMezz / 100) * pool * (perteMezz2 / 100);
    const perteSenior3 = perteTranchePct(l3, attache2, 100);
    const subordination = (l3 / 100) * pool;
    const repEl = r2(elPool);
    const repEquity = r2(perteEquity1);
    const repMezz = r2(perteMezz2);
    const repMezzMe = r2(perteMezzMe);
    const repSenior = r2(perteSenior3);
    const repSub = r1(subordination);

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `a €${f(pool, 0)}m pool of leveraged loans — senior secured, actively managed —, annual default probability around ${pct(pdLoans, 1)} with recoveries near ${pct(rLoans, 0)} (secured loans recover more than the ${pct(40, 0)} bond convention); the draft structure: equity 0-${f(attache1, 0)}%, mezzanine ${f(attache1, 0)}-${f(attache2, 0)}%, senior ${f(attache2, 0)}-100%; the three scenarios on the table: a benign year at ${pct(l1, 1)} of cumulative pool losses, a recession at ${pct(l2, 0)}, and a severe stress at ${pct(l3, 0)}`
      : `un pool de ${f(pool, 0)} M€ de leveraged loans — senior secured, gérés activement —, probabilité de défaut annuelle autour de ${pct(pdLoans, 1)} avec des recouvrements proches de ${pct(rLoans, 0)} (les loans sécurisés recouvrent plus que la convention obligataire de ${pct(40, 0)}) ; la structure en projet : equity 0-${f(attache1, 0)} %, mezzanine ${f(attache1, 0)}-${f(attache2, 0)} %, senior ${f(attache2, 0)}-100 % ; les trois scénarios sur la table : une année bénigne à ${pct(l1, 1)} de pertes cumulées du pool, une récession à ${pct(l2, 0)}, et un stress sévère à ${pct(l3, 0)}`;
    const contexte = (en
      ? [
        `Wednesday, 9 a.m., the structuring desk. The term sheet of your next CLO goes to investors on Friday, and the whole commercial pitch fits in one sentence: "the AAA tranche survived 2008 without a single default." Your job today is to make that sentence true again. The raw material: ${desc}. Run the waterfall scenario by scenario — who bleeds at ${pct(l1, 1)}, who dies at ${pct(l2, 0)}, what touches the senior at ${pct(l3, 0)} — then set the attachment point the agency will accept.`,
        `Thursday, 4 p.m. You manage a credit fund and the structurer's term sheet is on your desk: the mezzanine tranche, ${f(attache1, 0)}-${f(attache2, 0)}%, yields handsomely. Before signing, you do what chapter 6 taught: feel the clamp in your fingers. The deal: ${desc}. Price your cliff — intact where, destroyed where — and check whose cushion protects whom.`,
        `Friday, the agency's structured finance committee. The arranger wants the senior tranche rated AAA, and your committee's rule is written in the methodology: the senior must remain intact through the severe stress scenario. The file: ${desc}. Verify the structure level by level, then compute the subordination the AAA actually requires — that number is the price of the rating.`,
      ]
      : [
        `Mercredi, 9 h, le desk de structuration. La term sheet de votre prochain CLO part chez les investisseurs vendredi, et tout l'argumentaire commercial tient en une phrase : « la tranche AAA a traversé 2008 sans un seul défaut. » Votre travail du jour est de rendre cette phrase à nouveau vraie. La matière première : ${desc}. Déroulez la cascade scénario par scénario — qui saigne à ${pct(l1, 1)}, qui meurt à ${pct(l2, 0)}, ce qui touche le senior à ${pct(l3, 0)} — puis fixez le point d'attache que l'agence acceptera.`,
        `Jeudi, 16 h. Vous gérez un fonds de crédit et la term sheet du structureur est sur votre bureau : la tranche mezzanine, ${f(attache1, 0)}-${f(attache2, 0)} %, rapporte généreusement. Avant de signer, vous faites ce que le chapitre 6 a appris : sentir le clamp dans les doigts. L'opération : ${desc}. Pricez votre falaise — intacte où, détruite où — et vérifiez le coussin de qui protège qui.`,
        `Vendredi, le comité financements structurés de l'agence. L'arrangeur veut le AAA sur la tranche senior, et la règle de votre comité est écrite dans la méthodologie : le senior doit rester intact à travers le scénario de stress sévère. Le dossier : ${desc}. Vérifiez la structure étage par étage, puis calculez la subordination que le AAA exige réellement — ce nombre est le prix de la notation.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The pool\'s expected loss' : 'a) La perte attendue du pool',
          enonce: en
            ? `PD ${pct(pdLoans, 1)} per year, recovery ${pct(rLoans, 0)}. What is the pool's annual expected loss, in % of notional?`
            : `PD ${pct(pdLoans, 1)} par an, recouvrement ${pct(rLoans, 0)}. Quelle est la perte attendue annuelle du pool, en % du nominal ?`,
          reponse: repEl, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The raw material of every tranche' : 'La matière première de toutes les tranches',
            contenu: en
              ? `EL = ${f(pdLoans, 1)}% × (1 − ${f(rLoans, 0)}%) = **${pct(repEl, 2)}** per year. Note the recovery: ${pct(rLoans, 0)}, not the bond market's ${pct(40, 0)} — leveraged loans are senior secured, first in line on pledged assets. This EL is the pool's average destiny; the whole point of tranching is that no tranche lives the average.`
              : `EL = ${f(pdLoans, 1)} % × (1 − ${f(rLoans, 0)} %) = **${pct(repEl, 2)}** par an. Notez le recouvrement : ${pct(rLoans, 0)}, pas les ${pct(40, 0)} du marché obligataire — les leveraged loans sont senior secured, premiers servis sur les actifs nantis. Cette EL est le destin moyen du pool ; tout l'intérêt du tranchage est qu'aucune tranche ne vit la moyenne.`,
          }],
          pieges: [en
            ? `Applying the ${pct(40, 0)} bond convention to secured loans overstates the LGD: the collateral is the whole reason CLO pools lose less than HY bond pools at equal PD.`
            : `Appliquer la convention obligataire de ${pct(40, 0)} à des loans sécurisés surestime la LGD : le collatéral est précisément la raison pour laquelle un pool de CLO perd moins qu'un pool d'obligations HY à PD égale.`],
        },
        {
          intitule: en ? 'b) The benign year: who bleeds' : 'b) L\'année bénigne : qui saigne',
          enonce: en
            ? `Cumulative pool losses reach ${pct(l1, 1)}. What fraction of ITS notional (in %) has the 0-${f(attache1, 0)}% equity tranche lost?`
            : `Les pertes cumulées du pool atteignent ${pct(l1, 1)}. Quelle fraction de SON nominal (en %) la tranche equity 0-${f(attache1, 0)} % a-t-elle perdue ?`,
          reponse: repEquity, tolerance: 0.5, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'First loss: the job description' : 'Première perte : la fiche de poste',
            contenu: en
              ? `Equity loss = clamp((${f(l1, 1)} − 0)/(${f(attache1, 0)} − 0)) = **${pct(repEquity, 2)}** of its notional. The pool lost ${pct(l1, 1)}; the equity holder lost ${f(r0(perteEquity1), 0)} times more, relative to his stake. That is the deal: the equity absorbs the ordinary losses so the floors above see nothing — in exchange for all the excess spread when the year is calm. The mezzanine and senior are, so far, untouched: 0%.`
              : `Perte equity = clamp((${f(l1, 1)} − 0)/(${f(attache1, 0)} − 0)) = **${pct(repEquity, 2)}** de son nominal. Le pool a perdu ${pct(l1, 1)} ; le porteur d'equity a perdu ${f(r0(perteEquity1), 0)} fois plus, rapporté à sa mise. C'est le contrat : l'equity absorbe les pertes ordinaires pour que les étages du dessus ne voient rien — en échange de tout l'excess spread quand l'année est calme. La mezzanine et le senior sont, pour l'instant, intacts : 0 %.`,
          }],
          pieges: [en
            ? `Reporting the pool's loss (${pct(l1, 1)}) as the tranche's confuses the two units: tranche losses are expressed in % of the TRANCHE's notional — the clamp of chapter 6.`
            : `Rendre la perte du pool (${pct(l1, 1)}) comme celle de la tranche confond les deux unités : la perte d'une tranche s'exprime en % du nominal de LA TRANCHE — le clamp du chapitre 6.`],
        },
        {
          intitule: en ? 'c) The recession: the mezzanine cliff' : 'c) La récession : la falaise mezzanine',
          enonce: en
            ? `Pool losses reach ${pct(l2, 0)}. What fraction of its notional (in %) has the ${f(attache1, 0)}-${f(attache2, 0)}% mezzanine lost?`
            : `Les pertes du pool atteignent ${pct(l2, 0)}. Quelle fraction de son nominal (en %) la mezzanine ${f(attache1, 0)}-${f(attache2, 0)} % a-t-elle perdue ?`,
          reponse: repMezz, tolerance: 0.5, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Leverage without borrowing' : 'Le levier sans emprunt',
            contenu: en
              ? `Mezzanine loss = clamp((${f(l2, 0)} − ${f(attache1, 0)})/(${f(attache2, 0)} − ${f(attache1, 0)})) = **${pct(repMezz, 2)}**. The pool lost ${pct(l2, 0)} — a bad recession, not an apocalypse — and the tranche lost ${f(r0(perteMezz2), 0)}% of itself. Between attachment and detachment, each additional point of pool losses destroys ${f(r1(100 / epaisseurMezz), 1)}% of the tranche: a ${f(r0(100 / epaisseurMezz), 0)}-to-1 sensitivity manufactured by the structure alone, without borrowing a cent. The equity below is, of course, long gone (rased at ${pct(attache1, 0)}).`
              : `Perte mezzanine = clamp((${f(l2, 0)} − ${f(attache1, 0)})/(${f(attache2, 0)} − ${f(attache1, 0)})) = **${pct(repMezz, 2)}**. Le pool a perdu ${pct(l2, 0)} — une mauvaise récession, pas une apocalypse — et la tranche a perdu ${f(r0(perteMezz2), 0)} % d'elle-même. Entre attache et détachement, chaque point de pertes du pool en plus détruit ${f(r1(100 / epaisseurMezz), 1)} % de la tranche : une sensibilité de ${f(r0(100 / epaisseurMezz), 0)} pour 1 fabriquée par la seule structure, sans un centime d'emprunt. L'equity du dessous, évidemment, a disparu depuis longtemps (rasée à ${pct(attache1, 0)}).`,
          }],
          pieges: [en
            ? `The two symmetric traps of chapter 6: "rased as soon as losses cross ${pct(attache1, 0)}" (no — the attachment is where losses BEGIN) and "intact until ${pct(attache2, 0)}" (no — the detachment is where destruction is COMPLETE).`
            : `Les deux pièges symétriques du chapitre 6 : « rasée dès que les pertes passent ${pct(attache1, 0)} » (non — l'attache est où la perte COMMENCE) et « intacte jusqu'à ${pct(attache2, 0)} » (non — le détachement est où la destruction est TOTALE).`],
        },
        {
          intitule: en ? 'd) The same cliff, in euros' : 'd) La même falaise, en euros',
          enonce: en
            ? `The mezzanine is ${pct(epaisseurMezz, 0)} of a €${f(pool, 0)}m pool. How many €m does its loss in the recession scenario represent?`
            : `La mezzanine fait ${pct(epaisseurMezz, 0)} d'un pool de ${f(pool, 0)} M€. Combien de M€ sa perte du scénario récession représente-t-elle ?`,
          reponse: repMezzMe, tolerance: Math.max(0.3, repMezzMe * 0.03), toleranceMode: 'absolu', unite: 'M€',
          etapes: [{
            titre: en ? 'From percentages to a P&L line' : 'Des pourcentages à une ligne de P&L',
            contenu: en
              ? `Tranche notional = ${f(epaisseurMezz, 0)}% × ${f(pool, 0)} = €${f(r1((epaisseurMezz / 100) * pool), 1)}m; loss = ${pct(repMezz, 2)} × ${f(r1((epaisseurMezz / 100) * pool), 1)} = **€${f(repMezzMe, 2)}m**. Chain the units carefully: % of pool → tranche notional → % of tranche → euros. The investor who bought "a diversified pool of secured loans" holds a line that just lost ${f(r0(perteMezz2), 0)}% in one cycle turn.`
              : `Nominal de la tranche = ${f(epaisseurMezz, 0)} % × ${f(pool, 0)} = ${f(r1((epaisseurMezz / 100) * pool), 1)} M€ ; perte = ${pct(repMezz, 2)} × ${f(r1((epaisseurMezz / 100) * pool), 1)} = **${f(repMezzMe, 2)} M€**. Chaînez les unités avec soin : % du pool → nominal de tranche → % de la tranche → euros. L'investisseur qui a acheté « un pool diversifié de loans sécurisés » porte une ligne qui vient de perdre ${f(r0(perteMezz2), 0)} % en un retournement de cycle.`,
          }],
          pieges: [en
            ? `Multiplying the pool (€${f(pool, 0)}m) by the tranche loss gives €${f(r1(pool * perteMezz2 / 100), 1)}m — a unit error: the ${pct(repMezz, 0)} applies to the TRANCHE's notional, not the pool's.`
            : `Multiplier le pool (${f(pool, 0)} M€) par la perte de tranche donne ${f(r1(pool * perteMezz2 / 100), 1)} M€ — une erreur d'unité : les ${pct(repMezz, 0)} s'appliquent au nominal de la TRANCHE, pas du pool.`],
        },
        {
          intitule: en ? 'e) The severe stress: what reaches the senior' : 'e) Le stress sévère : ce qui atteint le senior',
          enonce: en
            ? `Pool losses reach ${pct(l3, 0)}. What fraction of its notional (in %) does the ${f(attache2, 0)}-100% senior lose?`
            : `Les pertes du pool atteignent ${pct(l3, 0)}. Quelle fraction de son nominal (en %) le senior ${f(attache2, 0)}-100 % perd-il ?`,
          reponse: repSenior, tolerance: 0.3, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The floor the rating promised would stay dry' : 'L\'étage que la notation promettait au sec',
            contenu: en
              ? `Senior loss = clamp((${f(l3, 0)} − ${f(attache2, 0)})/(100 − ${f(attache2, 0)})) = **${pct(repSenior, 2)}**. Small in percentage — the senior is ${f(100 - attache2, 0)} points thick — but conceptually enormous: the scenario where the senior loses ANYTHING is the scenario its rating declared out of the distribution. Chapter 6's warning applies here: this arithmetic assumes the losses arrive; whether they CAN arrive together is a correlation question, and loans of varied sectors are precisely not 50,000 mortgages on one housing market — the factual reason CLO AAAs crossed 2008 without a default.`
              : `Perte senior = clamp((${f(l3, 0)} − ${f(attache2, 0)})/(100 − ${f(attache2, 0)})) = **${pct(repSenior, 2)}**. Petit en pourcentage — le senior est épais de ${f(100 - attache2, 0)} points — mais conceptuellement énorme : le scénario où le senior perd QUOI QUE CE SOIT est celui que sa notation déclarait hors de la distribution. L'avertissement du chapitre 6 s'applique : cette arithmétique suppose que les pertes arrivent ; savoir si elles PEUVENT arriver ensemble est une question de corrélation, et des loans de secteurs variés ne sont précisément pas 50 000 hypothèques adossées au même marché immobilier — la raison factuelle pour laquelle les AAA de CLO ont traversé 2008 sans défaut.`,
          }],
          pieges: [en
            ? `Answering "0% — the senior is AAA" substitutes the rating for the arithmetic: at ${pct(l3, 0)} of pool losses, the clamp says ${pct(repSenior, 2)}, whatever the letter says.`
            : `Répondre « 0 % — le senior est AAA » substitue la notation à l'arithmétique : à ${pct(l3, 0)} de pertes du pool, le clamp dit ${pct(repSenior, 2)}, quoi que dise la lettre.`],
        },
        {
          intitule: en ? 'f) The subordination the AAA requires' : 'f) La subordination que le AAA exige',
          enonce: en
            ? `The agency's methodology demands that the senior stay INTACT through the ${pct(l3, 0)} stress. What minimum subordination below the senior does that impose, in €m of the €${f(pool, 0)}m pool?`
            : `La méthodologie de l'agence exige que le senior reste INTACT à travers le stress de ${pct(l3, 0)}. Quelle subordination minimale sous le senior cela impose-t-il, en M€ du pool de ${f(pool, 0)} M€ ?`,
          reponse: repSub, tolerance: Math.max(1, repSub * 0.02), toleranceMode: 'absolu', unite: 'M€',
          etapes: [
            {
              titre: en ? 'The attachment point is the rating' : 'Le point d\'attache est la notation',
              contenu: en
                ? `Intact through ${pct(l3, 0)} means: attachment ≥ ${pct(l3, 0)}. Subordination = ${f(l3, 0)}% × ${f(pool, 0)} = **€${f(repSub, 1)}m** of equity and mezzanine stacked below the senior. The current structure attaches at ${pct(attache2, 0)}: ${attache2 >= l3 ? (en ? 'it already passes' : '') : ''}${attache2 >= l3 ? '' : ''}the gap between ${pct(attache2, 0)} and ${pct(l3, 0)} is exactly what the structurer must fund with thicker junior tranches — and junior tranches are the expensive ones to place. That is the structurer's whole trade-off: every point of AAA comfort is bought with a point of hard-to-sell subordination.`
                : `Intact à travers ${pct(l3, 0)} signifie : attache ≥ ${pct(l3, 0)}. Subordination = ${f(l3, 0)} % × ${f(pool, 0)} = **${f(repSub, 1)} M€** d'equity et de mezzanine empilés sous le senior. La structure actuelle attache à ${pct(attache2, 0)} : l'écart entre ${pct(attache2, 0)} et ${pct(l3, 0)} est exactement ce que le structureur doit financer avec des tranches junior plus épaisses — et les tranches junior sont les chères à placer. Tout l'arbitrage du structureur est là : chaque point de confort AAA s'achète avec un point de subordination difficile à vendre.`,
            },
            {
              titre: en ? 'What the whole exercise taught' : 'Ce que tout l\'exercice a appris',
              contenu: en
                ? `Read the six answers together: the pool's expected loss is ${pct(repEl, 2)} a year, yet the same pool destroys ${f(r0(perteMezz2), 0)}% of a tranche in a recession. Securitisation does not reduce aggregate risk by one euro — it redistributes it along the distribution, and the price of every tranche is a bet on that distribution's shape. The structurer sells cushion thickness; the investor's job is to check whose scenario the cushion was sized for.`
                : `Relisez les six réponses ensemble : la perte attendue du pool est de ${pct(repEl, 2)} par an, et pourtant le même pool détruit ${f(r0(perteMezz2), 0)} % d'une tranche en récession. La titrisation ne réduit pas d'un euro le risque agrégé — elle le redistribue le long de la distribution, et le prix de chaque tranche est un pari sur la forme de cette distribution. Le structureur vend de l'épaisseur de coussin ; le métier de l'investisseur est de vérifier pour le scénario de qui le coussin a été taillé.`,
            },
          ],
          pieges: [en
            ? `Sizing the subordination on the EXPECTED loss (${pct(repEl, 2)} × 5 years ≈ ${pct(r1(repEl * 5), 1)}) instead of the stress scenario is the 2006 error: ratings die on the tail, not on the mean.`
            : `Tailler la subordination sur la perte ATTENDUE (${pct(repEl, 2)} × 5 ans ≈ ${pct(r1(repEl * 5), 1)}) au lieu du scénario de stress est l'erreur de 2006 : les notations meurent sur la queue, pas sur la moyenne.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 14. m5-pb-14 — Le mur de refinancement — N3                         */
/* ------------------------------------------------------------------ */
const murRefinancement: ProblemeMoule = {
  id: 'm5-pb-14', moduleId: M5,
  titre: 'Le mur de refinancement : quand le portage ne paie plus',
  titreEn: 'The refinancing wall: when the carry no longer pays',
  typeDeCas: 'cycle du crédit',
  typeDeCasEn: 'credit cycle',
  difficulte: 3,
  scenarios: ['Le gérant high yield devant le retournement', 'Le trésorier de l\'émetteur face à son échéance', 'L\'analyste sell-side qui écrit la note « underweight »'],
  scenariosEn: ['The high yield manager facing the turn of the cycle', 'The issuer\'s treasurer staring at his maturity', 'The sell-side analyst writing the "underweight" note'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const coupon = randFloat(rng, 6.5, 7.5, 1);
    const rSansRisque = randFloat(rng, 2.8, 3.5, 1);
    const pd0 = randFloat(rng, 2.5, 3.5, 1);
    const pd1 = randInt(rng, 8, 10);
    const souche = randInt(rng, 300, 600);
    const primeRisque = randInt(rng, 120, 180);

    const net0 = rendementNetDefautsPct(coupon, pd0, 40);
    const marge0 = net0 - rSansRisque;
    const net1 = rendementNetDefautsPct(coupon, pd1, 40);
    const pdSeuil = (coupon - rSansRisque) / 0.6;
    const couponNouveau = rSansRisque + (spreadTheoriquePb(pd1, 40) + primeRisque) / 100;
    const surcout = ((couponNouveau - coupon) / 100) * souche;
    const repNet0 = r2(net0);
    const repMarge0 = r2(marge0);
    const repNet1 = r2(net1);
    const repSeuil = r2(pdSeuil);
    const repCoupon = r2(couponNouveau);
    const repSurcout = r2(surcout);

    const { en, f, pct, pb: bp } = outils(langue);
    const desc = en
      ? `a high yield portfolio — or its mirror, an issuer — paying a nominal ${pct(coupon, 1)} coupon, recovery convention ${pct(40, 0)} (LGD ${pct(60, 0)}), risk-free rate ${pct(rSansRisque, 1)}; mid-cycle, the expected default rate was ${pct(pd0, 1)}; the primary market is now closing and the 12-month default forecast climbs toward ${pct(pd1, 0)}; the issuer has a €${f(souche, 0)}m bond maturing next year, and the market will demand its actuarial spread plus a risk premium of about ${bp(primeRisque)} to underwrite a new issue`
      : `un portefeuille high yield — ou son miroir, un émetteur — au coupon nominal de ${pct(coupon, 1)}, convention de recouvrement ${pct(40, 0)} (LGD ${pct(60, 0)}), taux sans risque ${pct(rSansRisque, 1)} ; en milieu de cycle, le taux de défaut attendu était de ${pct(pd0, 1)} ; le marché primaire se ferme et l'anticipation de défauts à 12 mois monte vers ${pct(pd1, 0)} ; l'émetteur a une souche de ${f(souche, 0)} M€ à maturité l'an prochain, et le marché exigera son spread actuariel plus une prime de risque d'environ ${bp(primeRisque)} pour souscrire une nouvelle émission`;
    const contexte = (en
      ? [
        `Thursday evening. Your HY fund had a beautiful year of carry, and now the primary market is sending the signal chapter 7 told you to watch — not the price, the QUANTITY: two pulled deals this week, order books that no longer fill. The situation: ${desc}. Before Monday, redo the only arithmetic that decides whether you hold through the wall: the net yield before, the net yield after, the PD at which the carry stops paying — and what the issuer's refinancing will cost, because his cost is your default risk.`,
        `Friday, the issuer's treasury. Your CFO still reads the ${pct(coupon, 1)} coupon on the existing debt and does not understand the alarm: "our interest bill hasn't moved." He is right — and that is exactly the trap. The picture: ${desc}. Show him the numbers chapter 7 orders: the investor's net yield collapsing, the threshold where your paper stops being buyable, the coupon a re-issue would carry, and the annual bill it adds. The wall does not kill through the coupons you pay; it kills through the one you cannot roll.`,
        `Sunday night, the research floor. Your "underweight HY" note goes out at 6 a.m. and must survive the pushback of every carry-hungry client: "the coupon is ${pct(coupon, 1)}, spreads are wide, why sell now?" Your answer: ${desc}. Write the demonstration: net of expected losses before, net after, the break-even PD, the re-issue coupon — and the sentence about the 12-to-18-month lag between the primary closing and the default peak.`,
      ]
      : [
        `Jeudi soir. Votre fonds HY a eu une belle année de portage, et le marché primaire envoie maintenant le signal que le chapitre 7 disait de surveiller — pas le prix, la QUANTITÉ : deux émissions retirées cette semaine, des livres d'ordres qui ne se remplissent plus. La situation : ${desc}. Avant lundi, refaites la seule arithmétique qui décide si vous tenez à travers le mur : le rendement net avant, le rendement net après, la PD à laquelle le portage cesse de payer — et ce que coûtera le refinancement de l'émetteur, parce que son coût est votre risque de défaut.`,
        `Vendredi, la trésorerie de l'émetteur. Votre directeur financier lit encore le coupon de ${pct(coupon, 1)} sur la dette existante et ne comprend pas l'alarme : « notre charge d'intérêts n'a pas bougé. » Il a raison — et c'est exactement le piège. Le tableau : ${desc}. Montrez-lui les nombres dans l'ordre du chapitre 7 : le rendement net de l'investisseur qui s'effondre, le seuil où votre papier cesse d'être achetable, le coupon qu'une réémission porterait, et la facture annuelle qu'il ajoute. Le mur ne tue pas par les coupons qu'on paie ; il tue par celui qu'on ne peut pas rouler.`,
        `Dimanche soir, l'étage de la recherche. Votre note « underweight HY » part à 6 h et doit survivre à l'objection de tous les clients affamés de portage : « le coupon est à ${pct(coupon, 1)}, les spreads sont larges, pourquoi vendre maintenant ? » Votre réponse : ${desc}. Écrivez la démonstration : net des pertes attendues avant, net après, la PD de point mort, le coupon de réémission — et la phrase sur les 12 à 18 mois entre la fermeture du primaire et le pic de défauts.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The net yield, mid-cycle' : 'a) Le rendement net, en milieu de cycle',
          enonce: en
            ? `Nominal yield ${pct(coupon, 1)}, expected PD ${pct(pd0, 1)}, R = ${pct(40, 0)}. What is the yield net of expected defaults, in %?`
            : `Rendement nominal ${pct(coupon, 1)}, PD attendue ${pct(pd0, 1)}, R = ${pct(40, 0)}. Quel est le rendement net des défauts attendus, en % ?`,
          reponse: repNet0, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The only yield that means anything' : 'Le seul rendement qui veuille dire quelque chose',
            contenu: en
              ? `Net = ${f(coupon, 1)} − ${f(pd0, 1)} × 0.6 = **${pct(repNet0, 2)}**. The portfolio "pays" ${pct(coupon, 1)} but hands back ${pct(r2(pd0 * 0.6), 2)} a year in expected credit losses — an economic cost that exists TODAY, not a hypothetical future event. Chapter 3's reflex: never quote a HY coupon without netting it.`
              : `Net = ${f(coupon, 1)} − ${f(pd0, 1)} × 0,6 = **${pct(repNet0, 2)}**. Le portefeuille « rapporte » ${pct(coupon, 1)} mais rend ${pct(r2(pd0 * 0.6), 2)} par an de pertes de crédit attendues — un coût économique qui existe AUJOURD'HUI, pas un événement futur hypothétique. Le réflexe du chapitre 3 : ne jamais citer un coupon HY sans le netter.`,
          }],
          pieges: [en
            ? `Subtracting the full PD (${f(coupon, 1)} − ${f(pd0, 1)} = ${pct(r2(coupon - pd0), 2)}) forgets the recovery: only the LGD share of a default is lost.`
            : `Soustraire la PD entière (${f(coupon, 1)} − ${f(pd0, 1)} = ${pct(r2(coupon - pd0), 2)}) oublie le recouvrement : seule la part LGD d'un défaut est perdue.`],
        },
        {
          intitule: en ? 'b) The margin over the risk-free rate' : 'b) La marge sur le sans-risque',
          enonce: en
            ? `Against a risk-free rate of ${pct(rSansRisque, 1)}, how many points of net excess return does the portfolio earn, in %?`
            : `Contre un taux sans risque de ${pct(rSansRisque, 1)}, combien de points d'excès de rendement net le portefeuille gagne-t-il, en % ?`,
          reponse: repMarge0, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The comparison that justifies the risk' : 'La comparaison qui justifie le risque',
            contenu: en
              ? `Margin = ${f(repNet0, 2)} − ${f(rSansRisque, 1)} = **${pct(repMarge0, 2)}**. Positive and comfortable: mid-cycle, the carry pays for the risk. This is the benchmark to keep — the whole problem is about watching this number melt when the PD forecast moves.`
              : `Marge = ${f(repNet0, 2)} − ${f(rSansRisque, 1)} = **${pct(repMarge0, 2)}**. Positive et confortable : en milieu de cycle, le portage paie le risque. C'est le point de référence à garder — tout le problème consiste à regarder ce nombre fondre quand l'anticipation de PD bouge.`,
          }],
          pieges: [en
            ? `Comparing the GROSS ${pct(coupon, 1)} to the risk-free rate flatters the trade by ${pct(r2(pd0 * 0.6), 2)}: the comparison is always net versus risk-free.`
            : `Comparer le BRUT ${pct(coupon, 1)} au sans-risque flatte le trade de ${pct(r2(pd0 * 0.6), 2)} : la comparaison, c'est toujours net contre sans-risque.`],
        },
        {
          intitule: en ? 'c) The net yield after the turn' : 'c) Le rendement net après le retournement',
          enonce: en
            ? `The 12-month default forecast climbs to ${pct(pd1, 0)}. What does the net yield become, in %?`
            : `L'anticipation de défauts à 12 mois monte à ${pct(pd1, 0)}. Que devient le rendement net, en % ?`,
          reponse: repNet1, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Nothing moved in the portfolio — everything moved' : 'Rien n\'a bougé dans le portefeuille — tout a bougé',
            contenu: en
              ? `Net = ${f(coupon, 1)} − ${f(pd1, 0)} × 0.6 = **${pct(repNet1, 2)}** — below the risk-free rate of ${pct(rSansRisque, 1)}, for infinitely more risk. Not one bond changed in the portfolio; only the expectation moved, and the big coupon became an optical illusion. This is the chapter 7 example, lived from inside: the market reprices expected losses BEFORE the defaults arrive — the spread is an early indicator precisely because this arithmetic is done early.`
              : `Net = ${f(coupon, 1)} − ${f(pd1, 0)} × 0,6 = **${pct(repNet1, 2)}** — sous le taux sans risque de ${pct(rSansRisque, 1)}, pour infiniment plus de risque. Pas une obligation n'a changé dans le portefeuille ; seule l'espérance a bougé, et le gros coupon est devenu une illusion d'optique. C'est l'exemple du chapitre 7, vécu de l'intérieur : le marché reprice les pertes attendues AVANT que les défauts n'arrivent — le spread est un indicateur avancé précisément parce que cette arithmétique se fait tôt.`,
          }],
          pieges: [en
            ? `"The losses haven't happened yet, the yield is still ${pct(coupon, 1)}" is the conceptual trap: an expected loss is an immediate economic cost — waiting for the default to book it is how you ride the whole drawdown.`
            : `« Les pertes ne sont pas réalisées, le rendement est encore ${pct(coupon, 1)} » est le piège conceptuel : une perte attendue est un coût économique immédiat — attendre le défaut pour la compter, c'est encaisser tout le drawdown.`],
        },
        {
          intitule: en ? 'd) The break-even PD' : 'd) La PD de point mort',
          enonce: en
            ? `At what expected default rate (in %) does the net yield fall exactly to the risk-free rate — the point where the carry stops paying?`
            : `À quel taux de défaut attendu (en %) le rendement net tombe-t-il exactement au taux sans risque — le point où le portage cesse de payer ?`,
          reponse: repSeuil, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Inverting the only formula in play' : 'Inverser la seule formule en jeu',
            contenu: en
              ? `Solve ${f(coupon, 1)} − PD × 0.6 = ${f(rSansRisque, 1)}: PD* = (${f(coupon, 1)} − ${f(rSansRisque, 1)}) / 0.6 = **${pct(repSeuil, 2)}** (check: ${f(coupon, 1)} − ${f(repSeuil, 2)} × 0.6 = ${pct(r2(rendementNetDefautsPct(coupon, pdSeuil, 40)), 2)}). Everything below: the carry pays. Everything above: you are paid less than a government bond to hold default risk. The forecast of ${pct(pd1, 0)} is ${f(r1(pd1 - pdSeuil), 1)} points beyond the threshold — the verdict does not need an opinion, it needs a subtraction.`
              : `Résoudre ${f(coupon, 1)} − PD × 0,6 = ${f(rSansRisque, 1)} : PD* = (${f(coupon, 1)} − ${f(rSansRisque, 1)}) / 0,6 = **${pct(repSeuil, 2)}** (vérification : ${f(coupon, 1)} − ${f(repSeuil, 2)} × 0,6 = ${pct(r2(rendementNetDefautsPct(coupon, pdSeuil, 40)), 2)}). Tout ce qui est en dessous : le portage paie. Tout ce qui est au-dessus : vous êtes payé moins qu'une obligation d'État pour porter du risque de défaut. L'anticipation de ${pct(pd1, 0)} est ${f(r1(pd1 - pdSeuil), 1)} points au-delà du seuil — le verdict n'a pas besoin d'une opinion, il a besoin d'une soustraction.`,
          }],
          pieges: [en
            ? `Dividing by R (0.4) instead of LGD (0.6) puts the threshold at ${pct(r2((coupon - rSansRisque) / 0.4), 2)}: the loss per default is 1 − R, always.`
            : `Diviser par R (0,4) au lieu de LGD (0,6) met le seuil à ${pct(r2((coupon - rSansRisque) / 0.4), 2)} : la perte par défaut vaut 1 − R, toujours.`],
        },
        {
          intitule: en ? 'e) The coupon a re-issue would carry' : 'e) Le coupon qu\'une réémission porterait',
          enonce: en
            ? `To roll the maturing bond, the market demands the actuarial spread at PD ${pct(pd1, 0)} (R = ${pct(40, 0)}) plus a ${bp(primeRisque)} risk premium, over the ${pct(rSansRisque, 1)} risk-free rate. What coupon (in %) would the new issue carry?`
            : `Pour rouler la souche à maturité, le marché exige le spread actuariel à PD ${pct(pd1, 0)} (R = ${pct(40, 0)}) plus une prime de risque de ${bp(primeRisque)}, au-dessus du sans-risque de ${pct(rSansRisque, 1)}. Quel coupon (en %) la nouvelle émission porterait-elle ?`,
          reponse: repCoupon, tolerance: 0.1, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The price of the wall' : 'Le prix du mur',
            contenu: en
              ? `Actuarial spread = ${f(pd1, 0)} × 0.6 × 100 = ${bp(r0(spreadTheoriquePb(pd1, 40)))}; new coupon = ${f(rSansRisque, 1)} + (${f(r0(spreadTheoriquePb(pd1, 40)), 0)} + ${f(primeRisque, 0)})/100 = **${pct(repCoupon, 2)}** — against ${pct(coupon, 1)} on the old debt. And that is the OPTIMISTIC branch: it assumes a window opens at all. The existing coupons never moved; what exploded is the price of the next one. Chapter 7's line: the credit market kills by asphyxiation, rarely by bullet.`
              : `Spread actuariel = ${f(pd1, 0)} × 0,6 × 100 = ${bp(r0(spreadTheoriquePb(pd1, 40)))} ; nouveau coupon = ${f(rSansRisque, 1)} + (${f(r0(spreadTheoriquePb(pd1, 40)), 0)} + ${f(primeRisque, 0)})/100 = **${pct(repCoupon, 2)}** — contre ${pct(coupon, 1)} sur la dette existante. Et c'est la branche OPTIMISTE : elle suppose qu'une fenêtre s'ouvre. Les coupons existants n'ont jamais bougé ; ce qui a explosé, c'est le prix du suivant. La phrase du chapitre 7 : le marché du crédit tue par asphyxie, rarement par balle.`,
          }],
          pieges: [en
            ? `"Rising spreads raise the issuer's current interest bill" is the intuitive error the whole problem dismantles: existing debt is fixed-rate — the widening only prices the NEXT issue.`
            : `« La hausse des spreads renchérit la charge d'intérêts courante » est l'erreur intuitive que tout le problème démonte : la dette existante est à taux fixe — l'écartement ne price que la PROCHAINE émission.`],
        },
        {
          intitule: en ? 'f) The annual bill of rolling the wall' : 'f) La facture annuelle du mur',
          enonce: en
            ? `On the €${f(souche, 0)}m maturing bond, how many €m per year does refinancing at ${pct(repCoupon, 2)} instead of ${pct(coupon, 1)} add?`
            : `Sur la souche de ${f(souche, 0)} M€ à maturité, combien de M€ par an le refinancement à ${pct(repCoupon, 2)} au lieu de ${pct(coupon, 1)} ajoute-t-il ?`,
          reponse: repSurcout, tolerance: Math.max(0.3, repSurcout * 0.03), toleranceMode: 'absolu', unite: 'M€',
          etapes: [
            {
              titre: en ? 'The treasurer\'s two bad branches' : 'Les deux mauvaises branches du trésorier',
              contenu: en
                ? `Extra bill = (${f(repCoupon, 2)} − ${f(coupon, 1)})% × ${f(souche, 0)} = **€${f(repSurcout, 2)}m per year**, every year of the new bond's life. The treasurer's alternative tree: pay this — IF a window opens — or face the maturity with no buyer, which is default, even with a running business. That is why the default peak lags the spread turn by 12 to 18 months: it is the time maturities take to catch up with issuers.`
                : `Facture en plus = (${f(repCoupon, 2)} − ${f(coupon, 1)}) % × ${f(souche, 0)} = **${f(repSurcout, 2)} M€ par an**, chaque année de vie de la nouvelle souche. L'arbre du trésorier : payer cela — SI une fenêtre s'ouvre — ou affronter l'échéance sans acheteur, c'est-à-dire le défaut, même avec une exploitation qui tourne. Voilà pourquoi le pic de défauts suit le retournement de 12 à 18 mois : c'est le temps que mettent les échéances à rattraper les émetteurs.`,
            },
            {
              titre: en ? 'The note\'s closing paragraph' : 'Le paragraphe de conclusion de la note',
              contenu: en
                ? `Assemble the story: net yield ${pct(repNet0, 2)} → ${pct(repNet1, 2)}, through the ${pct(repSeuil, 2)} break-even; re-issue coupon ${pct(repCoupon, 2)}; annual bill +€${f(repSurcout, 1)}m. Every number came from ONE formula — nominal minus PD × LGD — read from both sides of the market. The investor's carry and the issuer's survival are the same arithmetic; the wall is where they meet.`
                : `Assemblez l'histoire : rendement net ${pct(repNet0, 2)} → ${pct(repNet1, 2)}, à travers le point mort de ${pct(repSeuil, 2)} ; coupon de réémission ${pct(repCoupon, 2)} ; facture annuelle +${f(repSurcout, 1)} M€. Chaque nombre est sorti d'UNE formule — nominal moins PD × LGD — lue des deux côtés du marché. Le portage de l'investisseur et la survie de l'émetteur sont la même arithmétique ; le mur est l'endroit où ils se rencontrent.`,
            },
          ],
          pieges: [en
            ? `Counting the extra bill once instead of annually understates the wall: a coupon is a flow — the €${f(repSurcout, 1)}m recur every year of the new bond.`
            : `Compter la facture une seule fois au lieu d'annuellement sous-estime le mur : un coupon est un flux — les ${f(repSurcout, 1)} M€ reviennent chaque année de la nouvelle souche.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 15. m5-pb-15 — « AIG, septembre » — BOSS N4                         */
/* ------------------------------------------------------------------ */
const aigSeptembre: ProblemeMoule = {
  id: 'm5-pb-15', moduleId: M5,
  titre: 'AIG, septembre : vendre l\'assurance de la catastrophe en masse',
  titreEn: 'AIG, September: selling catastrophe insurance in bulk',
  typeDeCas: 'vente de protection',
  typeDeCasEn: 'selling protection',
  difficulte: 4,
  scenarios: ['Le desk de l\'assureur, 2006 : la machine à primes', 'Le risk manager, 15 septembre 2008 : le téléphone de la nuit', 'La banque contrepartie, 16 septembre : compter ce qu\'on est exposé'],
  scenariosEn: ['The insurer\'s desk, 2006: the premium machine', 'The risk manager, September 15, 2008: the phone call in the night', 'The counterparty bank, September 16: counting the exposure'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const notionnelMd = randInt(rng, 380, 480);
    const sPrime = randInt(rng, 15, 25);
    const recouvrement = randInt(rng, 25, 35);
    const durRisquee = randFloat(rng, 4, 5, 1);
    const ecartement = randInt(rng, 80, 140);
    const collatK = randFloat(rng, 3, 4, 1);
    const liquides = randInt(rng, 6, 10);
    const decote = randFloat(rng, 8, 15, 1);

    const primeM = primeCdsAnnuelleEur(notionnelMd * 1000, sPrime) / 1e6;
    const expositionMd = paiementDefautCdsMillions(notionnelMd * 1000, recouvrement) / 1000;
    const ratioAnnees = (expositionMd * 1000) / primeM;
    const mtmPct = variationPrixSpreadPct(durRisquee, ecartement);
    const mtmMd = (mtmPct / 100) * notionnelMd;
    const appelMd = (collatK / 100) * notionnelMd;
    const manqueMd = appelMd - liquides;
    const venteMd = venteForceePourCash(manqueMd, decote);
    const repPrime = r0(primeM);
    const repExpo = r0(expositionMd);
    const repRatio = r0(ratioAnnees);
    const repMtm = r1(mtmMd);
    const repManque = r2(manqueMd);
    const repVente = r2(venteMd);

    const { en, f, pct, pb: bp } = outils(langue);
    const desc = en
      ? `the financial products unit of a AAA-rated insurance giant has sold protection, via CDS, on \\$${f(notionnelMd, 0)}bn of senior tranches of structured credit reputed riskless, at an average premium of ${bp(sPrime)} — the real AIG carried about \\$500bn of it; the contracts assume a recovery of ${pct(recouvrement, 0)} on the underlying if the catastrophe ever came; because the scenario was "impossible", not a dollar of reserves stands behind the promise; the contracts carry one clause nobody priced: if the seller loses its AAA, it must post collateral of about ${pct(collatK, 1)} of notional; the unit's same-day liquidity is about \\$${f(liquides, 0)}bn, and in a stressed market any asset sale executes roughly ${pct(decote, 1)} below carrying value; the risky duration of the book is about ${f(durRisquee, 1)}`
      : `la filiale produits financiers d'un géant de l'assurance noté AAA a vendu de la protection, via CDS, sur ${f(notionnelMd, 0)} Md\\$ de tranches senior de crédit structuré réputées sans risque, à une prime moyenne de ${bp(sPrime)} — le vrai AIG en portait environ 500 Md\\$ ; les contrats supposent un recouvrement de ${pct(recouvrement, 0)} sur le sous-jacent si la catastrophe arrivait ; le scénario étant « impossible », pas un dollar de réserves ne se tient derrière la promesse ; les contrats portent une clause que personne n'a pricée : si le vendeur perd son AAA, il doit poster un collatéral d'environ ${pct(collatK, 1)} du notionnel ; la liquidité du jour de la filiale est d'environ ${f(liquides, 0)} Md\\$, et dans un marché stressé toute vente d'actifs s'exécute à peu près ${pct(decote, 1)} sous la valeur comptable ; la duration risquée du book est d'environ ${f(durRisquee, 1)}`;
    const contexte = (en
      ? [
        `London, 2006, the financial products floor. The business your desk runs is the most beautiful machine in finance: sell insurance against an event your models say cannot happen, book the premium as nearly riskless income, repeat. Your boss calls the book "gold dust"; the parent company's AAA — the same signature that insures houses and lives — is the only collateral anyone asks for. The book: ${desc}.\n\nBefore the year-end review, someone in risk has asked for one page nobody wants to write: the premiums the machine earns; what it owes if the impossible happens; how many years of income one catastrophe consumes; what a mere repricing of the tranches does to the mark-to-market; and what the forgotten downgrade clause calls for in cash — against the liquidity actually in the drawer. You are the one writing the page. Chapter 5 named this profile: the option seller, small and regular against rare and massive, until the quarter that returns everything.`,
        `Monday, September 15, 2008, 11 p.m. Lehman filed this morning; the m11 chapter you lived through this afternoon says the rest. At 9 p.m., the agencies cut the insurer's rating — the AAA is gone — and the downgrade clause you flagged in a memo two years ago is now a stack of collateral notices on your desk, each one legally payable within 24 hours. The book: ${desc}.\n\nWork the night in order: the premiums that seemed free; the contingent exposure that was always there; the years-of-premium ratio that says what "picking up nickels in front of a steamroller" means in dollars; the mark-to-market the widening has already inflicted; the collateral call against the cash in the drawer; and the fire-sale arithmetic that proves the hole cannot be filled by selling. Tomorrow at 9 p.m., the Fed will lend \\$85bn against 79.9% of the company — the price of discovering that a AAA signature was the system's collateral (m11, chapter 5).`,
        `Tuesday, September 16, 2008, 7 a.m., a bank treasury in Paris. Your institution bought protection from the insurer on \\$${f(r0(notionnelMd / 20), 0)}bn of senior tranches — your hedges, your regulatory capital relief, your "riskless" book, all resting on one counterparty's signature. The overnight news: downgrade, collateral calls it cannot meet, government talks. The exposure you must quantify before the 9 a.m. crisis committee: ${desc}.\n\nRebuild the seller's arithmetic to size YOUR problem: the premiums it earned (and you paid), the protection it owes, the ratio between the two, the mark-to-market of the tranches, and the collateral call that is killing it tonight. If the seller dies, every hedge on your book dies with it — the interconnexion argument that will make the Fed choose, tonight, to save the counterparty of everyone (m11: \\$85bn against 79.9%, a de facto nationalisation).`,
      ]
      : [
        `Londres, 2006, l'étage des produits financiers. Le métier de votre desk est la plus belle machine de la finance : vendre de l'assurance contre un événement que vos modèles déclarent impossible, comptabiliser la prime en revenu quasi sans risque, recommencer. Votre chef appelle le book « de la poudre d'or » ; le AAA de la maison mère — la même signature qui assure des maisons et des vies — est le seul collatéral qu'on vous demande. Le book : ${desc}.\n\nAvant la revue de fin d'année, quelqu'un au risque a demandé la page que personne ne veut écrire : les primes que la machine encaisse ; ce qu'elle doit si l'impossible arrive ; combien d'années de revenus une seule catastrophe consomme ; ce qu'un simple repricing des tranches fait au mark-to-market ; et ce que la clause de dégradation oubliée appelle en cash — contre la liquidité réellement dans le tiroir. C'est vous qui écrivez la page. Le chapitre 5 a nommé ce profil : le vendeur d'options, petit et régulier contre rare et massif, jusqu'au trimestre où tout se rend.`,
        `Lundi 15 septembre 2008, 23 h. Lehman a déposé le bilan ce matin ; le chapitre du m11 que vous avez vécu cet après-midi dit le reste. À 21 h, les agences ont dégradé l'assureur — le AAA est parti — et la clause de dégradation que vous aviez signalée dans une note il y a deux ans est maintenant une pile d'avis de collatéral sur votre bureau, chacun juridiquement exigible sous 24 heures. Le book : ${desc}.\n\nTravaillez la nuit dans l'ordre : les primes qui semblaient gratuites ; l'exposition contingente qui a toujours été là ; le ratio en années de primes qui dit ce que « ramasser des pièces devant un rouleau compresseur » veut dire en dollars ; le mark-to-market que l'écartement a déjà infligé ; l'appel de collatéral contre le cash du tiroir ; et l'arithmétique de vente forcée qui prouve que le trou ne peut pas se combler en vendant. Demain à 21 h, la Fed prêtera 85 Md\\$ contre 79,9 % de la société — le prix de la découverte qu'une signature AAA était le collatéral du système (m11, chapitre 5).`,
        `Mardi 16 septembre 2008, 7 h, une trésorerie de banque à Paris. Votre établissement a acheté de la protection à l'assureur sur ${f(r0(notionnelMd / 20), 0)} Md\\$ de tranches senior — vos couvertures, vos allègements de capital réglementaire, votre book « sans risque », tout repose sur la signature d'une seule contrepartie. Les nouvelles de la nuit : dégradation, appels de collatéral qu'il ne peut pas honorer, discussions avec le gouvernement. L'exposition à quantifier avant le comité de crise de 9 h : ${desc}.\n\nRefaites l'arithmétique du vendeur pour mesurer VOTRE problème : les primes qu'il a encaissées (et que vous avez payées), la protection qu'il doit, le ratio entre les deux, le mark-to-market des tranches, et l'appel de collatéral qui le tue cette nuit. Si le vendeur meurt, chaque couverture de votre book meurt avec lui — l'argument d'interconnexion qui fera choisir à la Fed, ce soir, de sauver la contrepartie de tout le monde (m11 : 85 Md\\$ contre 79,9 %, une nationalisation de fait).`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The premium machine' : 'a) La machine à primes',
          enonce: en
            ? `\\$${f(notionnelMd, 0)}bn of protection sold at an average ${bp(sPrime)}. What annual premium income, in \\$m, does the fixed leg generate?`
            : `${f(notionnelMd, 0)} Md\\$ de protection vendue à ${bp(sPrime)} en moyenne. Quel revenu annuel de primes, en M\\$, la jambe fixe génère-t-elle ?`,
          reponse: repPrime, tolerance: Math.max(5, repPrime * 0.02), toleranceMode: 'absolu', unite: 'M$',
          etapes: [{
            titre: en ? 'Income booked as if riskless' : 'Un revenu comptabilisé comme sans risque',
            contenu: en
              ? `Premium = ${f(notionnelMd, 0)}bn × ${f(sPrime, 0)}/10,000 = **\\$${f(repPrime, 0)}m per year** — the fixed leg of chapter 5, at industrial scale. Notice how SMALL the premium is per unit: ${bp(sPrime)} means the market itself priced the insured event as nearly impossible. The desk booked this as almost-free money; the whole problem is the word "almost".`
              : `Prime = ${f(notionnelMd, 0)} Md × ${f(sPrime, 0)}/10 000 = **${f(repPrime, 0)} M\\$ par an** — la jambe fixe du chapitre 5, à l'échelle industrielle. Remarquez comme la prime est PETITE par unité : ${bp(sPrime)} signifie que le marché lui-même priçait l'événement assuré comme quasi impossible. Le desk comptabilisait cela comme de l'argent presque gratuit ; tout le problème tient dans le mot « presque ».`,
          }],
          pieges: [en
            ? `Selling protection is not "collecting a fee": it is being SHORT the credit event — the income is the option seller's premium, not a commission.`
            : `Vendre de la protection n'est pas « toucher une commission » : c'est être SHORT l'événement de crédit — le revenu est la prime du vendeur d'option, pas des frais.`],
        },
        {
          intitule: en ? 'b) What the promise actually owes' : 'b) Ce que la promesse doit vraiment',
          enonce: en
            ? `If the insured event hit the whole book with a recovery of ${pct(recouvrement, 0)}, what contingent payment, in \\$bn, does the protection leg owe?`
            : `Si l'événement assuré frappait tout le book avec un recouvrement de ${pct(recouvrement, 0)}, quel paiement contingent, en Md\\$, la jambe de protection doit-elle ?`,
          reponse: repExpo, tolerance: Math.max(2, repExpo * 0.02), toleranceMode: 'absolu', unite: 'Md$',
          etapes: [{
            titre: en ? 'The loss, never the notional — and still' : 'La perte, jamais le notionnel — et pourtant',
            contenu: en
              ? `Payment = ${f(notionnelMd, 0)} × (1 − ${f(recouvrement, 0)}%) = **\\$${f(repExpo, 0)}bn**. Yes, the seller owes the LOSS, not the notional — the chapter 5 reflex holds. It just does not help when the notional is \\$${f(notionnelMd, 0)}bn: the mitigation of R = ${pct(recouvrement, 0)} still leaves a number larger than the equity of any insurer on earth. And one aggravation the desk never modelled: catastrophe insurance on CORRELATED risks means all contracts trigger together — the m11 lesson, the risk the securitisation claimed to disperse, silently reconcentrated on one balance sheet.`
              : `Paiement = ${f(notionnelMd, 0)} × (1 − ${f(recouvrement, 0)} %) = **${f(repExpo, 0)} Md\\$**. Oui, le vendeur doit la PERTE, pas le notionnel — le réflexe du chapitre 5 tient. Simplement, cela n'aide pas quand le notionnel fait ${f(notionnelMd, 0)} Md\\$ : l'atténuation de R = ${pct(recouvrement, 0)} laisse encore un nombre plus grand que les fonds propres de n'importe quel assureur au monde. Et une aggravation que le desk n'a jamais modélisée : assurer la catastrophe sur des risques CORRÉLÉS signifie que tous les contrats se déclenchent ensemble — la leçon du m11, le risque que la titrisation prétendait disperser, silencieusement reconcentré sur un seul bilan.`,
          }],
          pieges: [en
            ? `Paying the full notional (\\$${f(notionnelMd, 0)}bn) is the classic error: the auction fixes R and the seller pays notional × (1 − R) — Lehman's auction set R at 8.625%, and sellers paid 91.375%.`
            : `Payer le notionnel entier (${f(notionnelMd, 0)} Md\\$) est l'erreur classique : l'enchère fixe R et le vendeur paie notionnel × (1 − R) — l'enchère Lehman a fixé R à 8,625 %, et les vendeurs ont payé 91,375 %.`],
        },
        {
          intitule: en ? 'c) The asymmetry, in years of premiums' : 'c) L\'asymétrie, en années de primes',
          enonce: en
            ? `How many YEARS of premium income (question a) does the contingent payment (question b) represent?`
            : `Combien d'ANNÉES de primes (question a) le paiement contingent (question b) représente-t-il ?`,
          reponse: repRatio, tolerance: Math.max(5, repRatio * 0.03), toleranceMode: 'absolu', unite: 'années',
          etapes: [{
            titre: en ? 'The steamroller, measured' : 'Le rouleau compresseur, mesuré',
            contenu: en
              ? `Ratio = ${f(repExpo, 0)}bn × 1,000 / ${f(repPrime, 0)}m = **${f(repRatio, 0)} years** of premiums to cover one catastrophe. That single number is the whole psychology of the trade: every quarter without an event "proves" the desk right and grows the book; the event, when it comes, returns three centuries of income. Chapter 5's asymmetry — collect small and regular, owe rare and massive — is not a metaphor; it is this division.`
              : `Ratio = ${f(repExpo, 0)} Md × 1 000 / ${f(repPrime, 0)} M = **${f(repRatio, 0)} années** de primes pour couvrir une seule catastrophe. Ce seul nombre est toute la psychologie du trade : chaque trimestre sans événement « prouve » que le desk a raison et fait grossir le book ; l'événement, quand il vient, rend trois siècles de revenus. L'asymétrie du chapitre 5 — encaisser petit et régulier, devoir rare et massif — n'est pas une métaphore ; c'est cette division.`,
          }],
          pieges: [en
            ? `Judging the trade on its hit rate ("it never paid out") ignores the asymmetry: a strategy can be right ${f(repRatio, 0) === '0' ? '99' : '99'}% of the time and still be ruinous — the size of the tail payment is the whole story.`
            : `Juger le trade à sa fréquence de gain (« il n'a jamais payé ») ignore l'asymétrie : une stratégie peut avoir raison 99 % du temps et rester ruineuse — la taille du paiement de queue est toute l'histoire.`],
        },
        {
          intitule: en ? 'd) The mark-to-market before any default' : 'd) Le mark-to-market avant tout défaut',
          enonce: en
            ? `The tranches' spreads widen by ${bp(ecartement)} with a risky duration of ${f(durRisquee, 1)}. What mark-to-market, in \\$bn (signed), does the protection seller book on \\$${f(notionnelMd, 0)}bn — without a single realised default?`
            : `Les spreads des tranches s'écartent de ${bp(ecartement)} pour une duration risquée de ${f(durRisquee, 1)}. Quel mark-to-market, en Md\\$ (signé), le vendeur de protection prend-il sur ${f(notionnelMd, 0)} Md\\$ — sans un seul défaut réalisé ?`,
          reponse: repMtm, tolerance: Math.max(0.5, Math.abs(repMtm) * 0.03), toleranceMode: 'absolu', unite: 'Md$',
          etapes: [{
            titre: en ? 'The seller is short the spread' : 'Le vendeur est short le spread',
            contenu: en
              ? `MTM = −${f(durRisquee, 1)} × ${f(ecartement, 0)}/100 = ${pct(r2(mtmPct), 2)} of notional, i.e. **\\$${f(repMtm, 1)}bn**. Selling protection is being short the spread: every basis point of widening is a mark-to-market loss, exactly like the AAA of CDO that quoted 30 with no additional default realised (m11 ch5) — the market repriced the correlation, not the losses. The desk's answer was always "we hold to maturity, the marks don't matter". The next question explains why the marks matter tonight.`
              : `MTM = −${f(durRisquee, 1)} × ${f(ecartement, 0)}/100 = ${pct(r2(mtmPct), 2)} du notionnel, soit **${f(repMtm, 1)} Md\\$**. Vendre de la protection, c'est être short le spread : chaque point de base d'écartement est une perte de mark-to-market, exactement comme le AAA de CDO qui cotait 30 sans défaut supplémentaire réalisé (m11 ch5) — le marché repriçait la corrélation, pas les pertes. La réponse du desk a toujours été « nous portons à maturité, les marks ne comptent pas ». La question suivante explique pourquoi les marks comptent cette nuit.`,
          }],
          pieges: [en
            ? `"No default, no loss" confuses the credit event with the price: the CDS is marked to market, and an unrealised loss becomes very real the day a clause turns it into a cash call.`
            : `« Pas de défaut, pas de perte » confond l'événement de crédit et le prix : le CDS est valorisé en marché, et une perte latente devient très réelle le jour où une clause la transforme en appel de cash.`],
        },
        {
          intitule: en ? 'e) The call that kills' : 'e) L\'appel qui tue',
          enonce: en
            ? `The downgrade triggers collateral of ${pct(collatK, 1)} of the \\$${f(notionnelMd, 0)}bn notional, payable in cash. Against \\$${f(liquides, 0)}bn of same-day liquidity, how many \\$bn are MISSING tonight?`
            : `La dégradation déclenche un collatéral de ${pct(collatK, 1)} du notionnel de ${f(notionnelMd, 0)} Md\\$, exigible en cash. Contre ${f(liquides, 0)} Md\\$ de liquidité du jour, combien de Md\\$ MANQUENT cette nuit ?`,
          reponse: repManque, tolerance: Math.max(0.2, repManque * 0.03), toleranceMode: 'absolu', unite: 'Md$',
          etapes: [{
            titre: en ? 'The clause nobody priced' : 'La clause que personne n\'a pricée',
            contenu: en
              ? `Call = ${f(collatK, 1)}% × ${f(notionnelMd, 0)} = \\$${f(r2(appelMd), 2)}bn; missing = ${f(r2(appelMd), 2)} − ${f(liquides, 0)} = **\\$${f(repManque, 2)}bn**, in cash, within 24 hours. Read what just happened: the company is not insolvent tonight — it is ILLIQUID. The downgrade clause converts a mark-to-market opinion into an immediate cash obligation, at the exact moment the company's signature is worth least. The same mechanism as the m11 margin calls: it is never the position that kills, it is the cash the position suddenly demands.`
              : `Appel = ${f(collatK, 1)} % × ${f(notionnelMd, 0)} = ${f(r2(appelMd), 2)} Md\\$ ; manque = ${f(r2(appelMd), 2)} − ${f(liquides, 0)} = **${f(repManque, 2)} Md\\$**, en cash, sous 24 heures. Lisez ce qui vient d'arriver : la société n'est pas insolvable ce soir — elle est ILLIQUIDE. La clause de dégradation convertit une opinion de mark-to-market en obligation de cash immédiate, au moment exact où la signature de la société vaut le moins. Le même mécanisme que les appels de marge du m11 : ce n'est jamais la position qui tue, c'est le cash qu'elle exige soudain.`,
          }],
          pieges: [en
            ? `Confusing the collateral call with the contingent payment of b): no default has occurred — the ${pct(collatK, 1)} is a GUARANTEE demanded because the seller's signature degraded, not an indemnity.`
            : `Confondre l'appel de collatéral avec le paiement contingent de b) : aucun défaut n'a eu lieu — les ${pct(collatK, 1)} sont une GARANTIE exigée parce que la signature du vendeur s'est dégradée, pas une indemnité.`],
        },
        {
          intitule: en ? 'f) Proving the hole cannot be filled' : 'f) Prouver que le trou ne peut pas se combler',
          enonce: en
            ? `To raise the missing \\$${f(repManque, 2)}bn by selling assets at a ${pct(decote, 1)} discount, what pre-discount value, in \\$bn, must be sold?`
            : `Pour lever les ${f(repManque, 2)} Md\\$ manquants en vendant des actifs sous une décote de ${pct(decote, 1)}, quelle valeur pré-décote, en Md\\$, faut-il vendre ?`,
          reponse: repVente, tolerance: Math.max(0.2, repVente * 0.03), toleranceMode: 'absolu', unite: 'Md$',
          etapes: [
            {
              titre: en ? 'The spiral, one last time' : 'La spirale, une dernière fois',
              contenu: en
                ? `To sell = ${f(repManque, 2)} / (1 − ${f(decote, 1)}%) = **\\$${f(repVente, 2)}bn** — and every sale marks the same assets lower for the rest of the book, which worsens the mark-to-market, which hardens the next collateral demand. The m11 spiral, running inside one company in one night. This is why, on September 16, the choice was binary: public money, or the simultaneous death of every hedge the world's banks had bought from this desk. The Fed lent \\$85bn against 79.9% — and the question "why AIG and not Lehman" has one answer: interconnexion. Systemic is measured in links, not in billions.`
                : `À vendre = ${f(repManque, 2)} / (1 − ${f(decote, 1)} %) = **${f(repVente, 2)} Md\\$** — et chaque vente marque les mêmes actifs plus bas pour le reste du book, ce qui aggrave le mark-to-market, ce qui durcit la prochaine exigence de collatéral. La spirale du m11, tournant à l'intérieur d'une seule société en une seule nuit. Voilà pourquoi, le 16 septembre, le choix était binaire : de l'argent public, ou la mort simultanée de toutes les couvertures que les banques du monde avaient achetées à ce desk. La Fed a prêté 85 Md\\$ contre 79,9 % — et la question « pourquoi AIG et pas Lehman » a une réponse : l'interconnexion. Le systémique se mesure en liens, pas en milliards.`,
            },
            {
              titre: en ? 'What the desk should recite forever' : 'Ce que le desk doit réciter pour toujours',
              contenu: en
                ? `Three lessons for the exit interview. One: selling unfunded protection is the option seller's profile at systemic scale — the premium is income, the tail is your whole balance sheet. Two: correlation is what turns an insurance book into a single bet — catastrophe insurance only works when claims do not arrive together. Three: the post-2009 answer is structural, not moral — central clearing, initial margin, daily calls (the Big Bang): the AIG position still exists today, but a clearing house now asks for the collateral BEFORE the downgrade, in small doses, every day.`
                : `Trois leçons pour l'entretien de sortie. Un : vendre de la protection unfunded est le profil du vendeur d'options à l'échelle systémique — la prime est un revenu, la queue est tout votre bilan. Deux : la corrélation est ce qui transforme un book d'assurance en pari unique — l'assurance catastrophe ne fonctionne que si les sinistres n'arrivent pas ensemble. Trois : la réponse post-2009 est structurelle, pas morale — compensation centrale, marge initiale, appels quotidiens (le Big Bang) : la position AIG existe encore aujourd'hui, mais une chambre demande désormais le collatéral AVANT la dégradation, à petites doses, chaque jour.`,
            },
          ],
          pieges: [en
            ? `Computing ${f(repManque, 2)} × (1 + ${f(decote, 1)}%) understates the sale: the discount applies to what you SELL, not to what you need — divide by (1 − d), the module's forced-sale reflex.`
            : `Calculer ${f(repManque, 2)} × (1 + ${f(decote, 1)} %) sous-estime la vente : la décote s'applique à ce qu'on VEND, pas à ce dont on a besoin — diviser par (1 − d), le réflexe de vente forcée du module.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 16. m5-pb-16 — « La base qui devait converger » — BOSS N4           */
/* ------------------------------------------------------------------ */
const baseQuiConverge: ProblemeMoule = {
  id: 'm5-pb-16', moduleId: M5,
  titre: 'La base qui devait converger : l\'arbitrage tué par son financement',
  titreEn: 'The basis that was supposed to converge: the arbitrage killed by its funding',
  typeDeCas: 'base et financement',
  typeDeCasEn: 'basis and funding',
  difficulte: 4,
  scenarios: ['Le trader qui monte le trade, un mardi calme', 'Le même trader, six semaines plus tard, le soir de l\'appel', 'Le risk manager qui débranche la position'],
  scenariosEn: ['The trader putting on the trade, one quiet Tuesday', 'The same trader, six weeks later, the night of the call', 'The risk manager pulling the plug'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const sObl = randInt(rng, 220, 280);
    const baseAbs = randInt(rng, 30, 60);
    const notionnel = randInt(rng, 200, 400);
    const h0 = randFloat(rng, 2, 4, 1);
    const duration = randFloat(rng, 4.5, 6, 1);
    const ecartObl = randInt(rng, 120, 200);
    const ecartCds = randInt(rng, 40, 80);
    const h1 = randInt(rng, 15, 25);
    const decoteLiq = randFloat(rng, 3, 6, 1);
    const sCds = sObl - baseAbs;

    const base0 = baseCdsPb(sCds, sObl);
    const portageEur = primeCdsAnnuelleEur(notionnel, baseAbs);
    const financement0 = financementRepo(notionnel, h0);
    const elargissement = ecartObl - ecartCds;
    const mtmPct = variationPrixSpreadPct(duration, elargissement);
    const mtmM = (mtmPct / 100) * notionnel;
    const valeurPost = notionnel + mtmM;
    const refinancement = financementRepo(valeurPost, h1);
    const cashATrouver = financement0 - refinancement;
    const perteRealisee = Math.abs(mtmM) + (valeurPost * decoteLiq) / 100;
    const anneesPortage = (perteRealisee * 1e6) / portageEur;
    const repBase = r0(base0);
    const repPortage = r0(portageEur);
    const repFin = r2(financement0);
    const repMtm = r2(mtmM);
    const repCash = r2(cashATrouver);
    const repAnnees = r0(anneesPortage);

    const { en, f, pct, pb: bp } = outils(langue);
    const desc = en
      ? `an IG financial issuer whose bond quotes ${bp(sObl)} above the risk-free curve while its 5-year CDS quotes ${bp(sCds)}; the desk can buy €${f(notionnel, 0)}m of the bond, financed in overnight repo at a ${pct(h0, 1)} haircut, and buy CDS protection on the same notional — locking the difference "risk-free" until maturity; the bond's spread duration is about ${f(duration, 1)}; the m11 precedent everyone forgets: in late 2008 the basis on financials blew out to several hundred basis points, and the trade's funding — daily repo, daily marks — is exactly the structure that killed LTCM's convergence trades (m11 ch3)`
      : `un émetteur financier IG dont l'obligation cote ${bp(sObl)} au-dessus de la courbe sans risque quand son CDS 5 ans cote ${bp(sCds)} ; le desk peut acheter ${f(notionnel, 0)} M€ de l'obligation, financés en repo au jour le jour avec un haircut de ${pct(h0, 1)}, et acheter la protection CDS sur le même notionnel — verrouillant la différence « sans risque » jusqu'à maturité ; la spread duration de l'obligation est d'environ ${f(duration, 1)} ; le précédent du m11 que tout le monde oublie : fin 2008, la base sur les financières a dépassé plusieurs centaines de points de base, et le financement du trade — repo quotidien, marks quotidiens — est exactement la structure qui a tué les trades de convergence de LTCM (m11 ch3)`;
    const contexte = (en
      ? [
        `Tuesday, 3 p.m., a quiet week. Your senior trader slides two quotes across the desk and lets you find it yourself: the bond pays more than the protection costs. Buy both, and the credit risk cancels out — a machine that prints ${bp(baseAbs)} a year, they say. The file: ${desc}.\n\nBefore the ticket goes in, your desk head demands the full map, not just the carry: the basis, the annual income, the repo financing and the equity it consumes — and then the two stress numbers nobody volunteers: what the package loses if the basis WIDENS instead of converging, and what the repo desk demands the same evening. "Every arbitrage is a loan you took from the market," he says. "Price the loan."`,
        `Six weeks later, 7:20 p.m. The market has learned a new word — a fund is rumoured dead, financials are gapping — and your "riskless" package has moved every single day, the wrong way. The bond's spread has blown out ${bp(ecartObl)}; the CDS, your hedge, only ${bp(ecartCds)}: the basis did not converge, it OPENED. And the repo desk called at 6: the haircut on financial collateral goes from ${pct(h0, 1)} to ${pct(h1, 0)} at tomorrow's roll. The position: ${desc}.\n\nRedo tonight, in order, what the quiet-Tuesday version of you should have stress-tested: the basis at inception, the carry it promised, the financing that carried it, the mark-to-market the widening inflicted, and the cash the new haircut demands before 10 a.m. Then the number that ends the discussion: the realised loss of liquidating now, measured in YEARS of the carry you were chasing.`,
        `Thursday, 9 a.m., the risk committee. You run desk risk, and the negative basis book is on the agenda with one question: cut now or hold to convergence? The trader's argument is mathematically true: at maturity, the package pays. Your counter-argument is the one from LTCM (m11 ch3): the market can stay irrational longer than the desk can stay funded. The position: ${desc}.\n\nBuild the decision file: basis, carry, funding structure, the mark-to-market already taken, the cash call falling this morning, and the liquidation cost in years of carry. Then write the sentence the committee will keep: an arbitrage certain at maturity, financed overnight, is a bet on the PATH — and the path is exactly what nobody priced.`,
      ]
      : [
        `Mardi, 15 h, une semaine calme. Votre trader senior fait glisser deux cotes sur le desk et vous laisse trouver tout seul : l'obligation paie plus que la protection ne coûte. Achetez les deux, et le risque de crédit s'annule — une machine à imprimer ${bp(baseAbs)} par an, dit-on. Le dossier : ${desc}.\n\nAvant que le ticket parte, votre chef de desk exige la carte complète, pas seulement le portage : la base, le revenu annuel, le financement repo et les fonds propres qu'il consomme — puis les deux nombres de stress que personne ne donne spontanément : ce que le package perd si la base S'ÉCARTE au lieu de converger, et ce que le desk repo exige le soir même. « Chaque arbitrage est un emprunt que vous avez pris au marché, dit-il. Pricez l'emprunt. »`,
        `Six semaines plus tard, 19 h 20. Le marché a appris un mot nouveau — un fonds serait mort, les financières gappent — et votre package « sans risque » a bougé chaque jour, du mauvais côté. Le spread de l'obligation s'est écarté de ${bp(ecartObl)} ; le CDS, votre couverture, de seulement ${bp(ecartCds)} : la base n'a pas convergé, elle s'est OUVERTE. Et le desk repo a appelé à 18 h : le haircut sur le collatéral financier passe de ${pct(h0, 1)} à ${pct(h1, 0)} au roll de demain. La position : ${desc}.\n\nRefaites ce soir, dans l'ordre, ce que le vous du mardi calme aurait dû stress-tester : la base à l'initiation, le portage promis, le financement qui la portait, le mark-to-market que l'écartement a infligé, et le cash que le nouveau haircut exige avant 10 h. Puis le nombre qui clôt la discussion : la perte réalisée d'une liquidation maintenant, mesurée en ANNÉES du portage que vous poursuiviez.`,
        `Jeudi, 9 h, le comité des risques. Vous tenez le risque du desk, et le book de base négative est à l'ordre du jour avec une seule question : couper maintenant ou porter jusqu'à la convergence ? L'argument du trader est mathématiquement vrai : à maturité, le package paie. Votre contre-argument est celui de LTCM (m11 ch3) : le marché peut rester irrationnel plus longtemps que le desk ne peut rester financé. La position : ${desc}.\n\nMontez le dossier de décision : base, portage, structure de financement, le mark-to-market déjà pris, l'appel de cash qui tombe ce matin, et le coût de liquidation en années de portage. Puis écrivez la phrase que le comité gardera : un arbitrage certain à maturité, financé au jour le jour, est un pari sur le CHEMIN — et le chemin est exactement ce que personne n'a pricé.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The basis at inception' : 'a) La base à l\'initiation',
          enonce: en
            ? `CDS at ${bp(sCds)}, bond at ${bp(sObl)}. What is the cash-CDS basis, in bp (signed)?`
            : `CDS à ${bp(sCds)}, obligation à ${bp(sObl)}. Quelle est la base cash-CDS, en pb (signée) ?`,
          reponse: repBase, tolerance: 2, toleranceMode: 'absolu', unite: 'pb',
          etapes: [{
            titre: en ? 'Same default, two wrappers' : 'Le même défaut, deux emballages',
            contenu: en
              ? `Basis = ${f(sCds, 0)} − ${f(sObl, 0)} = **${bp(repBase)}**. Negative: the protection costs LESS than the spread the bond pays. Same reference entity, same default — the two prices should match, and the gap is the trade. But hold the chapter 5 sentence now, before the euphoria: a negative basis is not a free anomaly, it is the PRICE OF BALANCE SHEET — it pays whoever can finance and carry the position. What it costs to finance and carry is the rest of this problem.`
              : `Base = ${f(sCds, 0)} − ${f(sObl, 0)} = **${bp(repBase)}**. Négative : la protection coûte MOINS que le spread que l'obligation paie. Même entité de référence, même défaut — les deux prix devraient coïncider, et l'écart est le trade. Mais gardez dès maintenant, avant l'euphorie, la phrase du chapitre 5 : une base négative n'est pas une anomalie gratuite, c'est le PRIX DU BILAN — elle rémunère celui qui peut financer et porter la position. Ce que financer et porter coûte, c'est tout le reste du problème.`,
          }],
          pieges: [en
            ? `The sign convention: basis = CDS − bond, so the "attractive" configuration is NEGATIVE — announcing +${f(baseAbs, 0)} reverses the trade.`
            : `La convention de signe : base = CDS − obligation, donc la configuration « attractive » est NÉGATIVE — annoncer +${f(baseAbs, 0)} inverse le trade.`],
        },
        {
          intitule: en ? 'b) The carry the machine promises' : 'b) Le portage que la machine promet',
          enonce: en
            ? `On €${f(notionnel, 0)}m of notional, what annual carry, in €, do the ${f(baseAbs, 0)} bp of basis generate?`
            : `Sur ${f(notionnel, 0)} M€ de notionnel, quel portage annuel, en €, les ${f(baseAbs, 0)} pb de base génèrent-ils ?`,
          reponse: repPortage, tolerance: Math.max(1000, repPortage * 0.01), toleranceMode: 'absolu', unite: '€',
          etapes: [{
            titre: en ? 'Basis points into euros' : 'Des points de base en euros',
            contenu: en
              ? `Carry = ${f(notionnel, 0)}m × ${f(baseAbs, 0)}/10,000 = **€${f(repPortage, 0)}** per year: collect ${bp(sObl)} on the bond, pay ${bp(sCds)} on the protection, keep the difference — with the default fully hedged. Per euro of notional it is thin; that is why these books are LARGE, and why the size is precisely what turns a widening into an event.`
              : `Portage = ${f(notionnel, 0)} M × ${f(baseAbs, 0)}/10 000 = **${f(repPortage, 0)} €** par an : encaisser ${bp(sObl)} sur l'obligation, payer ${bp(sCds)} sur la protection, garder la différence — avec le défaut entièrement couvert. Par euro de notionnel c'est mince ; c'est pourquoi ces books sont GROS, et pourquoi la taille est précisément ce qui transforme un écartement en événement.`,
          }],
          pieges: [en
            ? `"Risk-free" is the wrong word from the start: credit-risk-free, yes — but the funding, the marks and the basis path remain, and they are the killers here.`
            : `« Sans risque » est le mauvais mot dès le départ : sans risque de crédit, oui — mais le financement, les marks et le chemin de la base restent, et ce sont eux les tueurs ici.`],
        },
        {
          intitule: en ? 'c) The funding that carries it' : 'c) Le financement qui la porte',
          enonce: en
            ? `The €${f(notionnel, 0)}m bond is financed in repo at a ${pct(h0, 1)} haircut. What financing, in €m, does the repo provide?`
            : `L'obligation de ${f(notionnel, 0)} M€ se finance en repo avec un haircut de ${pct(h0, 1)}. Quel financement, en M€, le repo fournit-il ?`,
          reponse: repFin, tolerance: Math.max(0.5, repFin * 0.01), toleranceMode: 'absolu', unite: 'M€',
          etapes: [{
            titre: en ? 'The trade\'s real structure: a rolling loan' : 'La vraie structure du trade : un emprunt roulé',
            contenu: en
              ? `Financing = ${f(notionnel, 0)} × (1 − ${f(h0, 1)}%) = **€${f(repFin, 2)}m**; the desk's own money is only the haircut, €${f(r2(notionnel - financement0), 2)}m. Now name the structure honestly: a position that pays at MATURITY, funded by a loan renewed EVERY MORNING, marked every evening. The maturity leg is certain; every single day between now and then is not. That mismatch — not the credit — is what the ${f(baseAbs, 0)} bp actually pay for.`
              : `Financement = ${f(notionnel, 0)} × (1 − ${f(h0, 1)} %) = **${f(repFin, 2)} M€** ; l'argent du desk n'est que le haircut, ${f(r2(notionnel - financement0), 2)} M€. Nommez honnêtement la structure : une position qui paie à MATURITÉ, financée par un emprunt renouvelé CHAQUE MATIN, valorisée chaque soir. La jambe de maturité est certaine ; chacun des jours d'ici là ne l'est pas. Ce décalage — pas le crédit — est ce que les ${f(baseAbs, 0)} pb paient réellement.`,
          }],
          pieges: [en
            ? `Multiplying by the haircut (${f(notionnel, 0)} × ${f(h0, 1)}% = ${f(r2(notionnel * h0 / 100), 2)}) gives the desk's equity, not the financing: the repo lends value × (1 − h).`
            : `Multiplier par le haircut (${f(notionnel, 0)} × ${f(h0, 1)} % = ${f(r2(notionnel * h0 / 100), 2)}) donne les fonds propres du desk, pas le financement : le repo prête valeur × (1 − h).`],
        },
        {
          intitule: en ? 'd) The widening: mark-to-market of the package' : 'd) L\'écartement : le mark-to-market du package',
          enonce: en
            ? `The bond widens ${bp(ecartObl)}, the CDS only ${bp(ecartCds)}: the basis opens by ${bp(elargissement)}. With a spread duration of ${f(duration, 1)}, what mark-to-market, in €m (signed), does the PACKAGE take on €${f(notionnel, 0)}m?`
            : `L'obligation s'écarte de ${bp(ecartObl)}, le CDS de seulement ${bp(ecartCds)} : la base s'ouvre de ${bp(elargissement)}. Avec une spread duration de ${f(duration, 1)}, quel mark-to-market, en M€ (signé), le PACKAGE prend-il sur ${f(notionnel, 0)} M€ ?`,
          reponse: repMtm, tolerance: Math.max(0.3, Math.abs(repMtm) * 0.03), toleranceMode: 'absolu', unite: 'M€',
          etapes: [{
            titre: en ? 'Hedged in credit, naked in basis' : 'Couvert en crédit, nu en base',
            contenu: en
              ? `The bond loses duration × its widening; the CDS gains duration × its own. Net = −${f(duration, 1)} × (${f(ecartObl, 0)} − ${f(ecartCds, 0)})/100 = ${pct(r2(mtmPct), 2)}, i.e. **€${f(repMtm, 2)}m**. The package is hedged against DEFAULT and fully exposed to the BASIS — and in stress, the basis widens for a structural reason: everyone who holds this trade is a leveraged desk being forced to sell the bond leg, while protection buyers panic-bid the CDS. The hedge underperforms exactly when it is needed — the m9 worst-of lesson, in credit clothing.`
              : `L'obligation perd duration × son écartement ; le CDS gagne duration × le sien. Net = −${f(duration, 1)} × (${f(ecartObl, 0)} − ${f(ecartCds, 0)})/100 = ${pct(r2(mtmPct), 2)}, soit **${f(repMtm, 2)} M€**. Le package est couvert contre le DÉFAUT et totalement exposé à la BASE — et en stress, la base s'écarte pour une raison structurelle : tous ceux qui portent ce trade sont des desks leveragés forcés de vendre la jambe obligataire, pendant que les acheteurs de protection se ruent sur le CDS. La couverture sous-performe exactement quand on en a besoin — la leçon du worst-of du m9, en habits de crédit.`,
          }],
          pieges: [en
            ? `Marking only the bond leg (−${f(duration, 1)} × ${f(ecartObl, 0)}/100 = ${pct(r2(variationPrixSpreadPct(duration, ecartObl)), 2)}) forgets the CDS gain: the package's exposure is the BASIS move, not the bond's.`
            : `Ne marquer que la jambe obligataire (−${f(duration, 1)} × ${f(ecartObl, 0)}/100 = ${pct(r2(variationPrixSpreadPct(duration, ecartObl)), 2)}) oublie le gain du CDS : l'exposition du package est le mouvement de BASE, pas celui de l'obligation.`],
        },
        {
          intitule: en ? 'e) The morning\'s cash call' : 'e) L\'appel de cash du matin',
          enonce: en
            ? `At tomorrow's roll, the haircut jumps to ${pct(h1, 0)} on collateral now worth €${f(r2(valeurPost), 2)}m (post mark-to-market). Between the old financing and the new, how many €m of cash must the desk find?`
            : `Au roll de demain, le haircut saute à ${pct(h1, 0)} sur un collatéral qui vaut désormais ${f(r2(valeurPost), 2)} M€ (post mark-to-market). Entre l'ancien financement et le nouveau, combien de M€ de cash le desk doit-il trouver ?`,
          reponse: repCash, tolerance: Math.max(0.5, repCash * 0.03), toleranceMode: 'absolu', unite: 'M€',
          etapes: [{
            titre: en ? 'The run on haircuts, at desk scale' : 'La ruée sur les haircuts, à l\'échelle du desk',
            contenu: en
              ? `New financing = ${f(r2(valeurPost), 2)} × (1 − ${f(h1, 0)}%) = €${f(r2(refinancement), 2)}m, against €${f(repFin, 2)}m yesterday: the desk must produce **€${f(repCash, 2)}m** of cash by 10 a.m. Note the double blow: the collateral is worth less AND the lender keeps a bigger cushion on it. Gorton's phrase from the m11 was written for this exact mechanism — 2008 was not a run on deposits, it was a run on haircuts. The repo lender never says "no"; he says "${f(h1, 0)}%", and it is the same thing said politely.`
              : `Nouveau financement = ${f(r2(valeurPost), 2)} × (1 − ${f(h1, 0)} %) = ${f(r2(refinancement), 2)} M€, contre ${f(repFin, 2)} M€ hier : le desk doit produire **${f(repCash, 2)} M€** de cash avant 10 h. Notez le double coup : le collatéral vaut moins ET le prêteur garde un coussin plus gros dessus. La formule de Gorton au m11 a été écrite pour ce mécanisme exact — 2008 ne fut pas une ruée sur les dépôts, mais une ruée sur les haircuts. Le prêteur de repo ne dit jamais « non » ; il dit « ${f(h1, 0)} % », et c'est la même chose dite poliment.`,
          }],
          pieges: [en
            ? `Applying the new haircut to the ORIGINAL €${f(notionnel, 0)}m forgets that the collateral is marked: the lender finances (value post-MTM) × (1 − h), and both terms moved against you.`
            : `Appliquer le nouveau haircut aux ${f(notionnel, 0)} M€ D'ORIGINE oublie que le collatéral est marqué : le prêteur finance (valeur post-MTM) × (1 − h), et les deux termes ont bougé contre vous.`],
        },
        {
          intitule: en ? 'f) The liquidation, in years of carry' : 'f) La liquidation, en années de portage',
          enonce: en
            ? `The desk cannot fund the call and liquidates: it realises the €${f(r2(Math.abs(mtmM)), 2)}m mark-to-market plus a ${pct(decoteLiq, 1)} fire-sale discount on the €${f(r2(valeurPost), 2)}m package. How many YEARS of the annual carry (question b) does the total realised loss represent?`
            : `Le desk ne peut pas financer l'appel et liquide : il réalise les ${f(r2(Math.abs(mtmM)), 2)} M€ de mark-to-market plus une décote de vente forcée de ${pct(decoteLiq, 1)} sur le package de ${f(r2(valeurPost), 2)} M€. Combien d'ANNÉES du portage annuel (question b) la perte totale réalisée représente-t-elle ?`,
          reponse: repAnnees, tolerance: 2, toleranceMode: 'absolu', unite: 'années',
          etapes: [
            {
              titre: en ? 'The number that ends the meeting' : 'Le nombre qui clôt la réunion',
              contenu: en
                ? `Realised loss = ${f(r2(Math.abs(mtmM)), 2)} + ${f(r2(valeurPost), 2)} × ${f(decoteLiq, 1)}% = €${f(r2(perteRealisee), 2)}m; in carry-years: ${f(r2(perteRealisee), 2)}m / ${f(repPortage, 0)} = **${f(repAnnees, 0)} years**. The trade chased ${f(baseAbs, 0)} bp a year and returned, in one liquidation, ${f(repAnnees, 0)} years of them. And the bitterest line for the post-mortem: the basis DID converge eventually — after the desk was gone. Keynes' sentence from the m11 is the epitaph: the market can stay irrational longer than you can stay solvent.`
                : `Perte réalisée = ${f(r2(Math.abs(mtmM)), 2)} + ${f(r2(valeurPost), 2)} × ${f(decoteLiq, 1)} % = ${f(r2(perteRealisee), 2)} M€ ; en années de portage : ${f(r2(perteRealisee), 2)} M / ${f(repPortage, 0)} = **${f(repAnnees, 0)} années**. Le trade poursuivait ${f(baseAbs, 0)} pb par an et a rendu, en une liquidation, ${f(repAnnees, 0)} années de portage. Et la ligne la plus amère du post-mortem : la base A fini par converger — après la mort du desk. La phrase de Keynes au m11 est l'épitaphe : le marché peut rester irrationnel plus longtemps que vous ne pouvez rester solvable.`,
            },
            {
              titre: en ? 'What the committee writes down' : 'Ce que le comité écrit',
              contenu: en
                ? `Three rules from one corpse. One: an arbitrage certain at maturity, funded overnight, is a bet on the path — stress-test the path, not the endpoint. Two: your risk includes everyone holding the same trade — the crowded basis book is why the hedge lags exactly in stress (LTCM, m11 ch3). Three: the carry must be read as a RENT ON BALANCE SHEET — if the trade pays ${f(baseAbs, 0)} bp for lending your funding capacity, then losing that capacity at the worst moment is not bad luck, it is the risk being priced.`
                : `Trois règles tirées d'un seul cadavre. Un : un arbitrage certain à maturité, financé au jour le jour, est un pari sur le chemin — stress-testez le chemin, pas le point d'arrivée. Deux : votre risque inclut tous ceux qui portent le même trade — le book de base surpeuplé est la raison pour laquelle la couverture traîne exactement en stress (LTCM, m11 ch3). Trois : le portage doit se lire comme un LOYER DU BILAN — si le trade paie ${f(baseAbs, 0)} pb pour prêter votre capacité de financement, alors perdre cette capacité au pire moment n'est pas de la malchance, c'est le risque en train d'être payé.`,
            },
          ],
          pieges: [en
            ? `"Hold — it converges at maturity" is mathematically true and operationally void: the position dies of the margin call BEFORE maturity. Being right at the end requires surviving the middle.`
            : `« Tenir — ça converge à maturité » est mathématiquement vrai et opérationnellement vide : la position meurt de l'appel de marge AVANT la maturité. Avoir raison à la fin exige de survivre au milieu.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 17. m5-pb-17 — « La mezzanine de 2007 » — BOSS N4                   */
/* ------------------------------------------------------------------ */
const mezzanine2007: ProblemeMoule = {
  id: 'm5-pb-17', moduleId: M5,
  titre: 'La mezzanine de 2007 : la corrélation qui saute',
  titreEn: 'The 2007 mezzanine: the correlation that jumps',
  typeDeCas: 'corrélation et tranches',
  typeDeCasEn: 'correlation and tranches',
  difficulte: 4,
  scenarios: ['Le gérant du fonds « rendement AAA », juin 2007', 'Le desk de corrélation qui doit marquer le book, août 2007', 'L\'investisseur du comité de crise, novembre 2007'],
  scenariosEn: ['The "AAA yield" fund manager, June 2007', 'The correlation desk marking the book, August 2007', 'The crisis committee investor, November 2007'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const attacheMezz = randInt(rng, 3, 4);
    const detachMezz = attacheMezz + randInt(rng, 3, 4);
    const l0 = randFloat(rng, 1.5, 2.5, 1);
    const pHigh = randInt(rng, 20, 35);
    const lHigh = randInt(rng, 18, 30);
    const lLow = randFloat(rng, 1, 2, 1);
    const illiq = randInt(rng, 8, 15);

    const perteEquity0 = perteTranchePct(l0, 0, attacheMezz);
    const perteMezz0 = perteTranchePct(l0, attacheMezz, detachMezz);
    const elBimodal = (pHigh / 100) * lHigh + (1 - pHigh / 100) * lLow;
    const perteMezzHigh = perteTranchePct(lHigh, attacheMezz, detachMezz);
    const perteSeniorHigh = perteTranchePct(lHigh, detachMezz, 100);
    const perteSeniorLow = perteTranchePct(lLow, detachMezz, 100);
    const elSenior = (pHigh / 100) * perteSeniorHigh + (1 - pHigh / 100) * perteSeniorLow;
    const prixAaa = 100 - elSenior - illiq;
    const repEquity = r2(perteEquity0);
    const repMezz0 = r2(perteMezz0);
    const repElBi = r2(elBimodal);
    const repMezzHigh = r1(perteMezzHigh);
    const repElSenior = r2(elSenior);
    const repPrix = r2(prixAaa);

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `a CDO of ABS built on mezzanine tranches of subprime RMBS; the structure: equity 0-${f(attacheMezz, 0)}%, mezzanine ${f(attacheMezz, 0)}-${f(detachMezz, 0)}%, senior ${f(detachMezz, 0)}-100% rated AAA; the models — calibrated on a world where national house prices never fell — anticipate cumulative pool losses of ${pct(l0, 1)}; the repricing scenario, once the housing market turns NATIONALLY, is bimodal: with probability ${pct(pHigh, 0)} the defaults synchronise and pool losses reach ${pct(lHigh, 0)}, otherwise they stay near ${pct(lLow, 1)}; stressed structured paper also carries an illiquidity discount of about ${f(illiq, 0)} price points`
      : `un CDO d'ABS construit sur des tranches mezzanine de RMBS subprime ; la structure : equity 0-${f(attacheMezz, 0)} %, mezzanine ${f(attacheMezz, 0)}-${f(detachMezz, 0)} %, senior ${f(detachMezz, 0)}-100 % noté AAA ; les modèles — calibrés sur un monde où l'immobilier national ne baissait jamais — anticipent des pertes cumulées du pool de ${pct(l0, 1)} ; le scénario de repricing, une fois le marché immobilier retourné NATIONALEMENT, est bimodal : avec probabilité ${pct(pHigh, 0)} les défauts se synchronisent et les pertes du pool atteignent ${pct(lHigh, 0)}, sinon elles restent vers ${pct(lLow, 1)} ; le papier structuré stressé porte aussi une décote d'illiquidité d'environ ${f(illiq, 0)} points de prix`;
    const contexte = (en
      ? [
        `June 2007, the quarterly investor letter. Your fund's pitch has worked for three years: "AAA yield, twice the spread of corporate AAA, zero realised loss." The machine behind the pitch: ${desc}.\n\nHSBC warned in February; two Bear Stearns funds stuffed with CDOs are dying in the newspapers this month (m11 ch5). Your biggest client asks the question you have been dreading, politely, in writing: "what exactly happens to our AAA if house prices fall EVERYWHERE at once?" Answer with numbers, in order: what today's expected losses do to each tranche; what the loss distribution looks like when correlation jumps; and what your AAA would be worth marked against that world — before a single additional default is realised.`,
        `August 9, 2007, 6 p.m. BNP Paribas froze three funds this morning — "evaporation of liquidity", the press release says — and your correlation desk owns the senior of the structure everyone suddenly wants to price. The book: ${desc}.\n\nThe old marks are the model's; the model believes house prices cannot fall nationally; the market stopped believing that this morning. Remark the book honestly: the tranches under the old expectation, the pool's expected loss when the scenario turns bimodal, the mezzanine in the synchronised world, the senior's expected loss across both branches — and the price that comes out once the illiquidity of a market with no bids is added. The number will be ugly; the alternative is pretending, and Bear Stearns' funds pretended.`,
        `November 2007, the crisis committee. The fund's AAA line is marked at a price the CFO calls "impossible — nothing has defaulted." You have been asked to explain, with the chapter 6 arithmetic, how an intact tranche loses a third of its value. The position: ${desc}.\n\nWalk the committee through it: the losses today versus the attachment points; the bimodal repricing of the pool; the mezzanine's fate when defaults synchronise; the senior's expected loss across the two branches; and the mark once illiquidity is priced. End with the sentence the minutes must keep: the market did not reprice the DEFAULTS — it repriced the SHAPE of the distribution, and the senior had sold insurance against exactly that shape.`,
      ]
      : [
        `Juin 2007, la lettre trimestrielle aux investisseurs. Le pitch de votre fonds fonctionne depuis trois ans : « du rendement AAA, deux fois le spread d'un AAA corporate, zéro perte réalisée. » La machine derrière le pitch : ${desc}.\n\nHSBC a averti en février ; deux fonds Bear Stearns gavés de CDO agonisent dans les journaux ce mois-ci (m11 ch5). Votre plus gros client pose la question que vous redoutiez, poliment, par écrit : « qu'arrive-t-il exactement à notre AAA si l'immobilier baisse PARTOUT en même temps ? » Répondez avec des nombres, dans l'ordre : ce que les pertes attendues d'aujourd'hui font à chaque tranche ; à quoi ressemble la distribution des pertes quand la corrélation saute ; et ce que vaudrait votre AAA marqué contre ce monde-là — avant qu'un seul défaut supplémentaire ne soit réalisé.`,
        `9 août 2007, 18 h. BNP Paribas a gelé trois fonds ce matin — « évaporation de la liquidité », dit le communiqué — et votre desk de corrélation porte le senior de la structure que tout le monde veut soudain pricer. Le book : ${desc}.\n\nLes anciens marks sont ceux du modèle ; le modèle croit que l'immobilier ne peut pas baisser nationalement ; le marché a cessé d'y croire ce matin. Re-marquez le book honnêtement : les tranches sous l'ancienne anticipation, la perte attendue du pool quand le scénario devient bimodal, la mezzanine dans le monde synchronisé, la perte attendue du senior sur les deux branches — et le prix qui sort une fois ajoutée l'illiquidité d'un marché sans acheteurs. Le nombre sera laid ; l'alternative est de faire semblant, et les fonds de Bear Stearns ont fait semblant.`,
        `Novembre 2007, le comité de crise. La ligne AAA du fonds est marquée à un prix que le directeur financier déclare « impossible — rien n'a fait défaut. » On vous a demandé d'expliquer, avec l'arithmétique du chapitre 6, comment une tranche intacte perd un tiers de sa valeur. La position : ${desc}.\n\nDéroulez pour le comité : les pertes d'aujourd'hui contre les points d'attache ; le repricing bimodal du pool ; le sort de la mezzanine quand les défauts se synchronisent ; la perte attendue du senior sur les deux branches ; et le mark une fois l'illiquidité pricée. Finissez par la phrase que le procès-verbal doit garder : le marché n'a pas repricé les DÉFAUTS — il a repricé la FORME de la distribution, et le senior avait vendu de l'assurance contre exactement cette forme.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) Today, on paper: the equity' : 'a) Aujourd\'hui, sur le papier : l\'equity',
          enonce: en
            ? `Under the model's expectation of ${pct(l0, 1)} cumulative pool losses, what fraction of its notional (in %) does the 0-${f(attacheMezz, 0)}% equity lose?`
            : `Sous l'anticipation du modèle de ${pct(l0, 1)} de pertes cumulées du pool, quelle fraction de son nominal (en %) l'equity 0-${f(attacheMezz, 0)} % perd-elle ?`,
          reponse: repEquity, tolerance: 0.5, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The world where the model is right' : 'Le monde où le modèle a raison',
            contenu: en
              ? `Equity loss = clamp((${f(l0, 1)} − 0)/(${f(attacheMezz, 0)} − 0)) = **${pct(repEquity, 2)}**. In the model's world this is the whole story: the equity — priced for exactly this job — absorbs the expected losses, and every floor above stays dry. Note the load-bearing assumption hiding in "expected": losses NEAR the expectation, which requires defaults to arrive one by one, independently.`
              : `Perte equity = clamp((${f(l0, 1)} − 0)/(${f(attacheMezz, 0)} − 0)) = **${pct(repEquity, 2)}**. Dans le monde du modèle, c'est toute l'histoire : l'equity — pricée exactement pour ce travail — absorbe les pertes attendues, et tous les étages du dessus restent au sec. Notez l'hypothèse porteuse cachée dans « attendues » : des pertes PROCHES de l'anticipation, ce qui exige que les défauts arrivent un par un, indépendamment.`,
          }],
          pieges: [en
            ? `Reading ${pct(l0, 1)} as the equity's loss forgets the clamp: the tranche is thin (${f(attacheMezz, 0)} points), so it loses ${f(r0(100 / attacheMezz), 0)} times the pool's losses until rased.`
            : `Lire ${pct(l0, 1)} comme la perte de l'equity oublie le clamp : la tranche est mince (${f(attacheMezz, 0)} points), donc elle perd ${f(r0(100 / attacheMezz), 0)} fois les pertes du pool jusqu'à être rasée.`],
        },
        {
          intitule: en ? 'b) Today, on paper: the mezzanine' : 'b) Aujourd\'hui, sur le papier : la mezzanine',
          enonce: en
            ? `Same expectation, ${pct(l0, 1)} of pool losses. What fraction of its notional (in %) does the ${f(attacheMezz, 0)}-${f(detachMezz, 0)}% mezzanine lose?`
            : `Même anticipation, ${pct(l0, 1)} de pertes du pool. Quelle fraction de son nominal (en %) la mezzanine ${f(attacheMezz, 0)}-${f(detachMezz, 0)} % perd-elle ?`,
          reponse: repMezz0, tolerance: 0.5, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Intact — the word doing all the selling' : 'Intacte — le mot qui fait toute la vente',
            contenu: en
              ? `${f(l0, 1)} < ${f(attacheMezz, 0)}: the clamp gives **${pct(repMezz0, 0)}** — the mezzanine is intact, and a fortiori the senior. This 0% is the pitch of the entire 2005-2007 machine: "losses never reach you." True in the model's distribution. The rest of the problem changes the distribution, not the losses — keep this 0% in mind to measure the distance the mark travels without a single additional default.`
              : `${f(l0, 1)} < ${f(attacheMezz, 0)} : le clamp donne **${pct(repMezz0, 0)}** — la mezzanine est intacte, et a fortiori le senior. Ce 0 % est le pitch de toute la machine 2005-2007 : « les pertes ne vous atteignent jamais. » Vrai dans la distribution du modèle. La suite du problème change la distribution, pas les pertes — gardez ce 0 % en tête pour mesurer la distance que le mark parcourt sans un seul défaut de plus.`,
          }],
          pieges: [en
            ? `"Intact today" and "safe" are different claims: the first is arithmetic about realised losses, the second is a bet on the distribution of FUTURE ones.`
            : `« Intacte aujourd'hui » et « sûre » sont deux affirmations différentes : la première est de l'arithmétique sur les pertes réalisées, la seconde un pari sur la distribution des pertes FUTURES.`],
        },
        {
          intitule: en ? 'c) The correlation jumps: the pool, repriced' : 'c) La corrélation saute : le pool, repricé',
          enonce: en
            ? `The market turns bimodal: probability ${pct(pHigh, 0)} of synchronised losses at ${pct(lHigh, 0)}, otherwise ${pct(lLow, 1)}. What is the pool's expected loss (in %) under the new distribution?`
            : `Le marché devient bimodal : probabilité ${pct(pHigh, 0)} de pertes synchronisées à ${pct(lHigh, 0)}, sinon ${pct(lLow, 1)}. Quelle est la perte attendue du pool (en %) sous la nouvelle distribution ?`,
          reponse: repElBi, tolerance: 0.15, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The mean moved a little; the shape moved everything' : 'La moyenne a peu bougé ; la forme a tout bougé',
            contenu: en
              ? `E[L] = ${f(pHigh, 0)}% × ${f(lHigh, 0)} + ${f(100 - pHigh, 0)}% × ${f(lLow, 1)} = **${pct(repElBi, 2)}**. Compare with the old expectation of ${pct(l0, 1)}: the MEAN moved by a few points. But the distribution is no longer a tight bell around its mean — it is two spikes: almost nothing, or catastrophe. The chapter 6 sentence to recite: at identical (or near) expected loss, independent defaults and correlated defaults are two different worlds for a tranche — the law of large numbers only protects the floors when the draws are independent.`
              : `E[L] = ${f(pHigh, 0)} % × ${f(lHigh, 0)} + ${f(100 - pHigh, 0)} % × ${f(lLow, 1)} = **${pct(repElBi, 2)}**. Comparez à l'ancienne anticipation de ${pct(l0, 1)} : la MOYENNE a bougé de quelques points. Mais la distribution n'est plus une cloche resserrée autour de sa moyenne — c'est deux pics : presque rien, ou la catastrophe. La phrase du chapitre 6 à réciter : à perte attendue identique (ou proche), défauts indépendants et défauts corrélés sont deux mondes différents pour une tranche — la loi des grands nombres ne protège les étages que si les tirages sont indépendants.`,
          }],
          pieges: [en
            ? `Concluding "the pool barely worsened, the tranches barely will" transfers a statement about the MEAN to instruments that are non-linear in the TAIL: the clamp eats distributions, not means.`
            : `Conclure « le pool s'est à peine dégradé, les tranches à peine aussi » transfère un énoncé sur la MOYENNE à des instruments non linéaires dans la QUEUE : le clamp mange des distributions, pas des moyennes.`],
        },
        {
          intitule: en ? 'd) The mezzanine in the synchronised world' : 'd) La mezzanine dans le monde synchronisé',
          enonce: en
            ? `In the high branch (pool losses ${pct(lHigh, 0)}), what fraction of its notional (in %) does the ${f(attacheMezz, 0)}-${f(detachMezz, 0)}% mezzanine lose?`
            : `Dans la branche haute (pertes du pool ${pct(lHigh, 0)}), quelle fraction de son nominal (en %) la mezzanine ${f(attacheMezz, 0)}-${f(detachMezz, 0)} % perd-elle ?`,
          reponse: repMezzHigh, tolerance: 0.5, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The cliff, and what was built on it' : 'La falaise, et ce qu\'on avait construit dessus',
            contenu: en
              ? `${f(lHigh, 0)} ≥ ${f(detachMezz, 0)}: clamp = **${pct(repMezzHigh, 0)}** — rased, entirely, in the branch that now carries ${pct(pHigh, 0)} of probability. Now the aggravating memory: THIS is the raw material of the CDO of ABS. The structure did not pool loans; it pooled mezzanine tranches of RMBS — cliffs already concentrated on the same national housing scenario — and re-tranched them. Each floor of re-securitisation multiplies the sensitivity to the correlation assumption (m11 ch5): when the scenario arrives, all the input mezzanines die TOGETHER, and the "diversified" pool of the CDO becomes one binary bet.`
              : `${f(lHigh, 0)} ≥ ${f(detachMezz, 0)} : clamp = **${pct(repMezzHigh, 0)}** — rasée, entièrement, dans la branche qui porte désormais ${pct(pHigh, 0)} de probabilité. Et le souvenir aggravant : c'est CELA, la matière première du CDO d'ABS. La structure n'a pas poolé des prêts ; elle a poolé des tranches mezzanine de RMBS — des falaises déjà concentrées sur le même scénario immobilier national — et les a retranchées. Chaque étage de re-titrisation démultiplie la sensibilité à l'hypothèse de corrélation (m11 ch5) : quand le scénario arrive, toutes les mezzanines d'entrée meurent ENSEMBLE, et le pool « diversifié » du CDO devient un seul pari binaire.`,
          }],
          pieges: [en
            ? `Computing a partial loss forgets the detachment: at ${pct(lHigh, 0)} of pool losses, the tranche detaching at ${pct(detachMezz, 0)} is not damaged — it is GONE, and the clamp caps at 100.`
            : `Calculer une perte partielle oublie le détachement : à ${pct(lHigh, 0)} de pertes du pool, la tranche détachée à ${pct(detachMezz, 0)} n'est pas abîmée — elle a DISPARU, et le clamp plafonne à 100.`],
        },
        {
          intitule: en ? 'e) The senior across both branches' : 'e) Le senior sur les deux branches',
          enonce: en
            ? `Expected loss of the ${f(detachMezz, 0)}-100% senior under the bimodal scenario: ${pct(pHigh, 0)} × its loss at ${pct(lHigh, 0)} + ${pct(100 - pHigh, 0)} × its loss at ${pct(lLow, 1)}. How much, in % of its notional?`
            : `Perte attendue du senior ${f(detachMezz, 0)}-100 % sous le scénario bimodal : ${pct(pHigh, 0)} × sa perte à ${pct(lHigh, 0)} + ${pct(100 - pHigh, 0)} × sa perte à ${pct(lLow, 1)}. Combien, en % de son nominal ?`,
          reponse: repElSenior, tolerance: 0.2, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The AAA discovers it sold insurance' : 'Le AAA découvre qu\'il a vendu de l\'assurance',
            contenu: en
              ? `High branch: clamp((${f(lHigh, 0)} − ${f(detachMezz, 0)})/(100 − ${f(detachMezz, 0)})) = ${pct(r2(perteSeniorHigh), 2)}; low branch: ${pct(r2(perteSeniorLow), 0)}. Expected = ${f(pHigh, 0)}% × ${f(r2(perteSeniorHigh), 2)} = **${pct(repElSenior, 2)}**. Small? Look again: the AAA rating asserted this number was ZERO — not small, inexistent. The senior is structurally short correlation: it sold insurance against the one scenario where everyone dies together, and its rating was the assumption that the scenario did not exist. An AAA corporate survives almost all scenarios; an AAA of structure survives all scenarios but one. Not the same letter.`
              : `Branche haute : clamp((${f(lHigh, 0)} − ${f(detachMezz, 0)})/(100 − ${f(detachMezz, 0)})) = ${pct(r2(perteSeniorHigh), 2)} ; branche basse : ${pct(r2(perteSeniorLow), 0)}. Attendue = ${f(pHigh, 0)} % × ${f(r2(perteSeniorHigh), 2)} = **${pct(repElSenior, 2)}**. Petit ? Regardez encore : la notation AAA affirmait que ce nombre était ZÉRO — pas petit, inexistant. Le senior est structurellement short de corrélation : il a vendu de l'assurance contre le seul scénario où tout le monde meurt ensemble, et sa notation était l'hypothèse que ce scénario n'existait pas. Un AAA corporate survit à presque tous les scénarios ; un AAA de structure survit à tous les scénarios sauf un. Ce n'est pas la même lettre.`,
          }],
          pieges: [en
            ? `Weighting the POOL's losses instead of the TRANCHE's (${f(pHigh, 0)}% × ${f(lHigh, 0)} = ${f(r2((pHigh / 100) * lHigh), 2)}) skips the clamp: the senior only sees losses beyond ${pct(detachMezz, 0)}.`
            : `Pondérer les pertes du POOL au lieu de celles de la TRANCHE (${f(pHigh, 0)} % × ${f(lHigh, 0)} = ${f(r2((pHigh / 100) * lHigh), 2)}) saute le clamp : le senior ne voit que les pertes au-delà de ${pct(detachMezz, 0)}.`],
        },
        {
          intitule: en ? 'f) The mark, without a single new default' : 'f) Le mark, sans un seul défaut de plus',
          enonce: en
            ? `The market marks the senior at: 100 − expected tranche loss − ${f(illiq, 0)} points of illiquidity. What indicative price comes out?`
            : `Le marché marque le senior à : 100 − perte attendue de la tranche − ${f(illiq, 0)} points d'illiquidité. Quel prix indicatif en sort ?`,
          reponse: repPrix, tolerance: 0.3, toleranceMode: 'absolu', unite: 'points',
          etapes: [
            {
              titre: en ? 'From 100 to here, and how far 30 is' : 'De 100 à ici, et à quelle distance est 30',
              contenu: en
                ? `Price ≈ 100 − ${f(repElSenior, 2)} − ${f(illiq, 0)} = **${f(repPrix, 2)}** — from par to there with ZERO additional realised default: the mark moved because the distribution moved, plus the discount of a market where the marginal buyer has vanished. And the 2008 endpoint is further down the same road: push the high-branch probability toward certainty and the synchronised losses toward 40, and the same arithmetic prints the AAA at 30 — the m11 number, reconstructed. The engine of the fall was never the coupon flow; it was the repricing of correlation.`
                : `Prix ≈ 100 − ${f(repElSenior, 2)} − ${f(illiq, 0)} = **${f(repPrix, 2)}** — du pair jusqu'ici avec ZÉRO défaut supplémentaire réalisé : le mark a bougé parce que la distribution a bougé, plus la décote d'un marché où l'acheteur marginal a disparu. Et le point d'arrivée de 2008 est plus loin sur la même route : poussez la probabilité de la branche haute vers la certitude et les pertes synchronisées vers 40, et la même arithmétique imprime le AAA à 30 — le nombre du m11, reconstruit. Le moteur de la chute n'a jamais été le flux de coupons ; c'était le repricing de la corrélation.`,
            },
            {
              titre: en ? 'The three sentences for the committee' : 'Les trois phrases pour le comité',
              contenu: en
                ? `One: securitisation does not reduce aggregate risk — it redistributes it along the distribution, and every tranche price is a bet on that distribution's shape. Two: the senior of a structure is short correlation by construction; its AAA was conditional on a correlation regime, and regimes change faster than ratings. Three: the post-crisis fixes target exactly this file — no re-securitisation in the STS label, 5% retention so the originator keeps a slice of his own correlation bet.`
                : `Un : la titrisation ne réduit pas le risque agrégé — elle le redistribue le long de la distribution, et chaque prix de tranche est un pari sur la forme de cette distribution. Deux : le senior d'une structure est short de corrélation par construction ; son AAA était conditionnel à un régime de corrélation, et les régimes changent plus vite que les notations. Trois : les correctifs post-crise visent exactement ce dossier — pas de re-titrisation dans le label STS, rétention de 5 % pour que l'originateur garde une part de son propre pari de corrélation.`,
            },
          ],
          pieges: [en
            ? `"No default, therefore the price must be near 100" is the CFO's error the problem dismantles: a tranche price is an expectation over FUTURE scenarios plus liquidity — realised defaults are only one input, and the slowest one.`
            : `« Pas de défaut, donc le prix doit être proche de 100 » est l'erreur du directeur financier que le problème démonte : un prix de tranche est une espérance sur les scénarios FUTURS plus la liquidité — les défauts réalisés ne sont qu'une entrée, et la plus lente.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 18. m5-pb-18 — « Le desk distressed » — BOSS N4                     */
/* ------------------------------------------------------------------ */
const deskDistressed: ProblemeMoule = {
  id: 'm5-pb-18', moduleId: M5,
  titre: 'Le desk distressed : acheter ce que tout le monde jette',
  titreEn: 'The distressed desk: buying what everyone throws away',
  typeDeCas: 'distressed et recouvrement',
  typeDeCasEn: 'distressed and recovery',
  difficulte: 4,
  scenarios: ['L\'analyste du fonds distressed devant la cote', 'Le vendeur institutionnel qui doit justifier de vendre si bas', 'Le comité de restructuration, trois mois plus tard'],
  scenariosEn: ['The distressed fund analyst staring at the quote', 'The institutional seller justifying selling this low', 'The restructuring committee, three months later'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const coupon = randFloat(rng, 5, 6, 1);
    const rSansRisque = randFloat(rng, 2.5, 3.5, 1);
    const sDist = randInt(rng, 2600, 3200);
    const maturite = randInt(rng, 4, 5);
    const recouvrement = randInt(rng, 25, 35);
    const q = randInt(rng, 55, 70);
    const rLow = randInt(rng, 25, 35);
    const pUp = randInt(rng, 65, 80);
    const deltaR = randInt(rng, 10, 18);
    const rRestruct = rLow + deltaR;

    const prix = prixObligationRisquee(coupon, rSansRisque, sDist, maturite);
    const pdImp = pdImplicitePct(sDist, recouvrement);
    const survie2 = probaSurvieCumuleePct(pdImp, 2);
    const esperance = (q / 100) * rLow + (1 - q / 100) * pUp;
    const rendEspere = (esperance / prix - 1) * 100;
    const esperance2 = (q / 100) * rRestruct + (1 - q / 100) * pUp;
    const rendEspere2 = (esperance2 / prix - 1) * 100;
    const repPrix = r2(prix);
    const repPd = r2(pdImp);
    const repSurvie = r2(survie2);
    const repEsp = r2(esperance);
    const repRend = r1(rendEspere);
    const repRend2 = r1(rendEspere2);

    const { en, f, pct, pb: bp } = outils(langue);
    const desc = en
      ? `an industrial issuer in restructuring talks; its senior bond — ${pct(coupon, 1)} coupon, ${f(maturite, 0)} years to maturity — quotes at a spread of ${bp(sDist)} over a ${pct(rSansRisque, 1)} risk-free rate, deep in the distressed zone (>1,000 bp); the desk's convention for financials-in-trouble recoveries is R = ${pct(recouvrement, 0)} — remember Lehman's auction: 8.625%, the "R ≈ 40%" convention is a calm-weather average; the desk's scenario tree at 12 months: default with probability ${pct(q, 0)} and a recovery near ${f(rLow, 0)} points, otherwise the restructuring succeeds and the bond re-rates toward ${f(pUp, 0)} points; the lawyers believe a negotiated restructuring could lift the recovery by about ${f(deltaR, 0)} points`
      : `un émetteur industriel en discussions de restructuration ; son obligation senior — coupon ${pct(coupon, 1)}, ${f(maturite, 0)} ans de maturité — cote sur un spread de ${bp(sDist)} au-dessus d'un sans-risque de ${pct(rSansRisque, 1)}, en pleine zone distressed (>1 000 pb) ; la convention du desk pour les recouvrements d'émetteurs en difficulté est R = ${pct(recouvrement, 0)} — souvenez-vous de l'enchère Lehman : 8,625 %, la convention « R ≈ 40 % » est une moyenne de temps calme ; l'arbre de scénarios du desk à 12 mois : défaut avec probabilité ${pct(q, 0)} et un recouvrement vers ${f(rLow, 0)} points, sinon la restructuration réussit et l'obligation se reprice vers ${f(pUp, 0)} points ; les avocats pensent qu'une restructuration négociée pourrait relever le recouvrement d'environ ${f(deltaR, 0)} points`;
    const contexte = (en
      ? [
        `Tuesday, 8:30 a.m., the distressed fund. The bond hit your screen because it crossed the threshold where your fund is ALLOWED to look: everyone else's mandate forces them out, yours forces you in. Chapter 7 located the trade — where the analysis turns as legal as it is financial. The file: ${desc}.\n\nYour investment memo must hold five numbers, in order: the price the quoted spread implies (check the market's arithmetic before trusting your own); the default probability that spread prices; the odds of surviving the talks; the expectation your scenario tree gives against the price; and what the lawyers' recovery point is worth in expected return. The rule of the desk: at these prices you are no longer trading a coupon — you are trading R.`,
        `Tuesday, 11 a.m., an insurer's fixed-income floor. The bond has been downgraded twice in a month, your committee wants it GONE, and your job is to write the memo that explains selling at less than half of par without looking like panic. The market: ${desc}.\n\nBe honest about both sides: compute the price the spread implies and the default probability inside it; then compute what HOLDING offers — survival odds, the scenario expectation, the return the buyer on the other side is being paid. Your memo may still conclude "sell" (a constrained seller has reasons a spreadsheet does not capture), but the committee must see the number the fund across the table is buying.`,
        `Three months later, the creditors' committee. Your fund bought the line; the issuer proposes a negotiated restructuring — a haircut, longer maturities, but senior treatment that lifts the effective recovery. The lawyers say +${f(deltaR, 0)} points of R. The position: ${desc}.\n\nRe-run the tree with the new R: the expectation, the expected return against your entry price, and the answer to the only question the committee votes on — does the restructuring pay better than the courtroom? This is the moment chapter 7 promised: in distressed, the variable that moves your P&L is not the spread anymore; it is the recovery, and the recovery is NEGOTIATED, not quoted.`,
      ]
      : [
        `Mardi, 8 h 30, le fonds distressed. L'obligation est arrivée sur votre écran parce qu'elle a franchi le seuil où votre fonds a le DROIT de regarder : le mandat des autres les force à sortir, le vôtre vous force à entrer. Le chapitre 7 a situé le métier — là où l'analyse devient aussi juridique que financière. Le dossier : ${desc}.\n\nVotre mémo d'investissement doit tenir cinq nombres, dans l'ordre : le prix que le spread coté implique (vérifiez l'arithmétique du marché avant de croire la vôtre) ; la probabilité de défaut que ce spread price ; les chances de survivre aux négociations ; l'espérance de votre arbre de scénarios contre le prix ; et ce que vaut le point de recouvrement des avocats en rendement espéré. La règle du desk : à ces prix, vous ne tradez plus un coupon — vous tradez R.`,
        `Mardi, 11 h, l'étage obligataire d'un assureur. L'obligation a été dégradée deux fois en un mois, votre comité la veut DEHORS, et votre travail est d'écrire le mémo qui justifie de vendre à moins de la moitié du pair sans avoir l'air paniqué. Le marché : ${desc}.\n\nSoyez honnête sur les deux faces : calculez le prix que le spread implique et la probabilité de défaut qu'il contient ; puis calculez ce que GARDER offre — les chances de survie, l'espérance des scénarios, le rendement que l'acheteur d'en face est payé. Votre mémo peut encore conclure « vendre » (un vendeur contraint a des raisons qu'un tableur ne capture pas), mais le comité doit voir le nombre que le fonds de l'autre côté de la table est en train d'acheter.`,
        `Trois mois plus tard, le comité des créanciers. Votre fonds a acheté la ligne ; l'émetteur propose une restructuration négociée — une décote, des maturités allongées, mais un traitement senior qui relève le recouvrement effectif. Les avocats disent +${f(deltaR, 0)} points de R. La position : ${desc}.\n\nRefaites tourner l'arbre avec le nouveau R : l'espérance, le rendement espéré contre votre prix d'entrée, et la réponse à la seule question que le comité vote — la restructuration paie-t-elle mieux que le tribunal ? C'est le moment que le chapitre 7 promettait : en distressed, la variable qui bouge votre P&L n'est plus le spread ; c'est le recouvrement, et le recouvrement se NÉGOCIE, il ne se cote pas.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The price the spread implies' : 'a) Le prix que le spread implique',
          enonce: en
            ? `Coupon ${pct(coupon, 1)}, risk-free ${pct(rSansRisque, 1)}, spread ${bp(sDist)}, ${f(maturite, 0)} years. Discounting all cash flows at the full yield, what price (in % of par) does the bond quote?`
            : `Coupon ${pct(coupon, 1)}, sans-risque ${pct(rSansRisque, 1)}, spread ${bp(sDist)}, ${f(maturite, 0)} ans. En actualisant tous les flux au rendement complet, quel prix (en % du pair) l'obligation cote-t-elle ?`,
          reponse: repPrix, tolerance: 0.5, toleranceMode: 'absolu', unite: 'points',
          etapes: [{
            titre: en ? 'The chapter 4 machine, in the mud' : 'La machine du chapitre 4, dans la boue',
            contenu: en
              ? `Yield = ${f(rSansRisque, 1)}% + ${f(sDist, 0)} bp = ${pct(r2(rSansRisque + sDist / 100), 2)}; discounting the ${f(maturite, 0)} coupons of ${f(coupon, 1)} and the par at that rate gives **${f(repPrix, 2)}** — the default is IN the discount rate, not in the cash flows (the desk's "spread over the curve" method). At these levels the quote convention itself flips: a distressed name trades in PRICE (points of par), not in spread — an annualised spread means little when default can precede the second coupon.`
              : `Rendement = ${f(rSansRisque, 1)} % + ${f(sDist, 0)} pb = ${pct(r2(rSansRisque + sDist / 100), 2)} ; actualiser les ${f(maturite, 0)} coupons de ${f(coupon, 1)} et le pair à ce taux donne **${f(repPrix, 2)}** — le défaut est DANS le taux d'actualisation, pas dans les flux (la méthode « spread sur la courbe » du desk). À ces niveaux, la convention de cotation elle-même bascule : un nom distressed se traite en PRIX (points du pair), plus en spread — un spread annualisé ne veut plus dire grand-chose quand le défaut peut précéder le deuxième coupon.`,
          }],
          pieges: [en
            ? `Discounting at the spread alone (${pct(r2(sDist / 100), 0)}) or at the risk-free rate alone: the yield is the SUM — risk-free plus spread — applied to every flow.`
            : `Actualiser au seul spread (${pct(r2(sDist / 100), 0)}) ou au seul sans-risque : le rendement est la SOMME — sans-risque plus spread — appliquée à chaque flux.`],
        },
        {
          intitule: en ? 'b) The default probability inside the quote' : 'b) La probabilité de défaut dans la cote',
          enonce: en
            ? `With a distressed recovery of ${pct(recouvrement, 0)}, what annual default probability (in %) does the ${bp(sDist)} spread imply?`
            : `Avec un recouvrement distressed de ${pct(recouvrement, 0)}, quelle probabilité de défaut annuelle (en %) le spread de ${bp(sDist)} implique-t-il ?`,
          reponse: repPd, tolerance: 0.5, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The market is saying a number out loud' : 'Le marché dit un nombre à voix haute',
            contenu: en
              ? `Implied PD = (${f(sDist, 0)}/100) / (1 − ${f(recouvrement, 0)}%) = **${pct(repPd, 2)}** per year. Read it plainly: the market prices roughly one chance in ${f(r0(100 / pdImp), 0)} that the issuer dies within the year. Two caveats the desk never forgets: it is a risk-neutral number (it embeds the premium for bearing exactly this kind of horror), and it is only as good as the R you fed it — at 45 of price, your PD estimate moves with every point of assumed recovery.`
              : `PD implicite = (${f(sDist, 0)}/100) / (1 − ${f(recouvrement, 0)} %) = **${pct(repPd, 2)}** par an. Lisez-le simplement : le marché price environ une chance sur ${f(r0(100 / pdImp), 0)} que l'émetteur meure dans l'année. Deux réserves que le desk n'oublie jamais : c'est un nombre risque-neutre (il embarque la prime pour porter exactement ce genre d'horreur), et il ne vaut que le R qu'on lui a donné — à 45 de prix, votre estimation de PD bouge avec chaque point de recouvrement supposé.`,
          }],
          pieges: [en
            ? `Keeping the calm-weather R = ${pct(40, 0)} here understates the PD: distressed recoveries are LOWER precisely because the assets are sold in bad times — Lehman's auction printed 8.625%.`
            : `Garder le R = ${pct(40, 0)} de temps calme ici sous-estime la PD : les recouvrements distressed sont PLUS BAS précisément parce que les actifs se vendent dans les mauvaises années — l'enchère Lehman a imprimé 8,625 %.`],
        },
        {
          intitule: en ? 'c) Surviving the talks' : 'c) Survivre aux négociations',
          enonce: en
            ? `At that implied PD, what is the probability (in %) that the issuer is still alive in 2 years?`
            : `À cette PD implicite, quelle est la probabilité (en %) que l'émetteur soit encore en vie dans 2 ans ?`,
          reponse: repSurvie, tolerance: 0.5, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Time is the enemy\'s ally' : 'Le temps est l\'allié de l\'ennemi',
            contenu: en
              ? `Survival = 100 × (1 − ${f(repPd, 2)}%)² = **${pct(repSurvie, 2)}** — the market gives the issuer roughly a coin flip on surviving the negotiation horizon. This is why restructuring SPEED is worth money: every quarter of talks is a quarter of survival risk, and the m5 formula compounds against the patient. The distressed desk's clock runs on court calendars, not market hours.`
              : `Survie = 100 × (1 − ${f(repPd, 2)} %)² = **${pct(repSurvie, 2)}** — le marché donne à l'émetteur à peu près un pile ou face sur l'horizon de négociation. Voilà pourquoi la VITESSE d'une restructuration vaut de l'argent : chaque trimestre de discussions est un trimestre de risque de survie, et la formule du m5 se compose contre le patient. L'horloge du desk distressed tourne au calendrier des tribunaux, pas aux heures de marché.`,
          }],
          pieges: [en
            ? `2 × ${f(repPd, 2)} = ${pct(r2(2 * pdImp), 2)} of cumulative default is the additive trap again — at distressed PDs the error is no longer a rounding matter.`
            : `2 × ${f(repPd, 2)} = ${pct(r2(2 * pdImp), 2)} de défaut cumulé est encore le piège additif — à des PD distressed, l'erreur n'est plus une affaire d'arrondi.`],
        },
        {
          intitule: en ? 'd) The scenario tree against the price' : 'd) L\'arbre de scénarios contre le prix',
          enonce: en
            ? `At 12 months: default with probability ${pct(q, 0)} and recovery ${f(rLow, 0)}; otherwise re-rating to ${f(pUp, 0)}. What is the expected value of the bond, in points?`
            : `À 12 mois : défaut avec probabilité ${pct(q, 0)} et recouvrement ${f(rLow, 0)} ; sinon repricing à ${f(pUp, 0)}. Quelle est la valeur espérée de l'obligation, en points ?`,
          reponse: repEsp, tolerance: 0.3, toleranceMode: 'absolu', unite: 'points',
          etapes: [{
            titre: en ? 'Two futures, one number' : 'Deux futurs, un seul nombre',
            contenu: en
              ? `E = ${f(q, 0)}% × ${f(rLow, 0)} + ${f(100 - q, 0)}% × ${f(pUp, 0)} = **${f(repEsp, 2)}** points, against a price of ${f(repPrix, 2)}. Notice what the bond has become: a binary bet with two exits — the courtroom (${f(rLow, 0)}) or the re-rating (${f(pUp, 0)}) — where the coupon barely matters. That is the regime change of distressed: the instrument stops behaving like a bond and starts behaving like an option on the restructuring outcome.`
              : `E = ${f(q, 0)} % × ${f(rLow, 0)} + ${f(100 - q, 0)} % × ${f(pUp, 0)} = **${f(repEsp, 2)}** points, contre un prix de ${f(repPrix, 2)}. Voyez ce que l'obligation est devenue : un pari binaire à deux sorties — le tribunal (${f(rLow, 0)}) ou le repricing (${f(pUp, 0)}) — où le coupon ne compte presque plus. C'est le changement de régime du distressed : l'instrument cesse de se comporter comme une obligation et se met à se comporter comme une option sur l'issue de la restructuration.`,
          }],
          pieges: [en
            ? `Comparing E to PAR ("it's worth ${f(repEsp, 0)}, par is 100, terrible") misreads the trade: the buyer's benchmark is the PRICE paid (${f(repPrix, 2)}), not the notional printed on the bond.`
            : `Comparer E au PAIR (« ça vaut ${f(repEsp, 0)}, le pair est 100, terrible ») se trompe de référence : le repère de l'acheteur est le PRIX payé (${f(repPrix, 2)}), pas le nominal imprimé sur l'obligation.`],
        },
        {
          intitule: en ? 'e) The expected return at entry' : 'e) Le rendement espéré à l\'entrée',
          enonce: en
            ? `Against the entry price of question a), what expected return (in %, signed) does the tree offer at 12 months?`
            : `Contre le prix d'entrée de la question a), quel rendement espéré (en %, signé) l'arbre offre-t-il à 12 mois ?`,
          reponse: repRend, tolerance: 1, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'What the panic actually pays' : 'Ce que la panique paie vraiment',
            contenu: en
              ? `Expected return = (${f(repEsp, 2)} / ${f(repPrix, 2)} − 1) × 100 = **${pct(repRend, 1)}**. Read it without romance: the number is ${f(repRend, 1)} — the market at ${f(repPrix, 2)} is pricing the tree ${Math.abs(rendEspere) < 5 ? 'almost exactly' : rendEspere > 0 ? 'with a margin for the buyer' : 'richer than your tree'}. The edge in distressed rarely lives in this first-pass expectation, which everyone computes; it lives in the variable the next question moves — the R your lawyers can CHANGE while the market's R is a guess.`
              : `Rendement espéré = (${f(repEsp, 2)} / ${f(repPrix, 2)} − 1) × 100 = **${pct(repRend, 1)}**. Lisez-le sans romantisme : le nombre est ${f(repRend, 1)} — le marché à ${f(repPrix, 2)} price l'arbre ${Math.abs(rendEspere) < 5 ? 'presque exactement' : rendEspere > 0 ? 'avec une marge pour l\'acheteur' : 'plus cher que votre arbre'}. L'avantage en distressed vit rarement dans cette espérance de premier passage, que tout le monde calcule ; il vit dans la variable que la question suivante bouge — le R que vos avocats peuvent CHANGER quand le R du marché n'est qu'une hypothèse.`,
          }],
          pieges: [en
            ? `An expected return is not a promised one: the realised outcome is ${f(rLow, 0)} or ${f(pUp, 0)}, never ${f(repEsp, 0)} — position sizing, not conviction, is what makes the expectation collectable.`
            : `Un rendement espéré n'est pas un rendement promis : le réalisé sera ${f(rLow, 0)} ou ${f(pUp, 0)}, jamais ${f(repEsp, 0)} — c'est la taille de position, pas la conviction, qui rend l'espérance encaissable.`],
        },
        {
          intitule: en ? 'f) The restructuring that changes R' : 'f) La restructuration qui change R',
          enonce: en
            ? `The negotiated deal lifts the default-branch recovery from ${f(rLow, 0)} to ${f(rRestruct, 0)} points. What does the expected return (in %, signed) become against the same entry price?`
            : `L'accord négocié relève le recouvrement de la branche défaut de ${f(rLow, 0)} à ${f(rRestruct, 0)} points. Que devient le rendement espéré (en %, signé) contre le même prix d'entrée ?`,
          reponse: repRend2, tolerance: 1, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'Trading R, literally' : 'Trader R, littéralement',
              contenu: en
                ? `New E = ${f(q, 0)}% × ${f(rRestruct, 0)} + ${f(100 - q, 0)}% × ${f(pUp, 0)} = ${f(r2(esperance2), 2)}; expected return = (${f(r2(esperance2), 2)} / ${f(repPrix, 2)} − 1) × 100 = **${pct(repRend2, 1)}** — the ${f(deltaR, 0)} points of negotiated recovery moved the expected return by ${f(r1(rendEspere2 - rendEspere), 1)} points. THAT is the distressed trade: everyone can read the quoted spread; the fund that sits on the creditors' committee is trading a variable the market cannot quote — the outcome of a negotiation. The restructuring event, remember, is a credit event in European contracts (chapter 5): the instrument's legal fine print IS the payoff.`
                : `Nouvelle E = ${f(q, 0)} % × ${f(rRestruct, 0)} + ${f(100 - q, 0)} % × ${f(pUp, 0)} = ${f(r2(esperance2), 2)} ; rendement espéré = (${f(r2(esperance2), 2)} / ${f(repPrix, 2)} − 1) × 100 = **${pct(repRend2, 1)}** — les ${f(deltaR, 0)} points de recouvrement négociés ont déplacé le rendement espéré de ${f(r1(rendEspere2 - rendEspere), 1)} points. VOILÀ le trade distressed : tout le monde sait lire le spread coté ; le fonds qui siège au comité des créanciers trade une variable que le marché ne peut pas coter — l'issue d'une négociation. La restructuration, rappelez-vous, est un événement de crédit dans les contrats européens (chapitre 5) : les petites lignes juridiques de l'instrument SONT le payoff.`,
            },
            {
              titre: en ? 'The desk\'s closing wisdom' : 'La sagesse de clôture du desk',
              contenu: en
                ? `Three sentences to keep. One: below ~50 of price, you are long R and the coupon is noise — analyse the balance sheet like a liquidator, not like a lender. Two: the seller at ${f(repPrix, 0)} is not stupid, he is CONSTRAINED — the falaise BBB− manufactures your entry price (chapter 2). Three: expected return is a distribution, not a promise — the courtroom branch happens ${pct(q, 0)} of the time, and no memo survives contact with a judge.`
                : `Trois phrases à garder. Un : sous ~50 de prix, vous êtes long R et le coupon est du bruit — analysez le bilan comme un liquidateur, pas comme un prêteur. Deux : le vendeur à ${f(repPrix, 0)} n'est pas stupide, il est CONTRAINT — la falaise BBB− fabrique votre prix d'entrée (chapitre 2). Trois : un rendement espéré est une distribution, pas une promesse — la branche tribunal arrive ${pct(q, 0)} du temps, et aucun mémo ne survit au contact d'un juge.`,
            },
          ],
          pieges: [en
            ? `Applying the +${f(deltaR, 0)} points to BOTH branches double-counts the deal: the restructuring only changes the default branch — the re-rating branch was already pricing survival.`
            : `Appliquer les +${f(deltaR, 0)} points aux DEUX branches compte l'accord en double : la restructuration ne change que la branche défaut — la branche repricing priçait déjà la survie.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 19. m5-pb-19 — « L'assureur au bord de la falaise » — BOSS N4       */
/* ------------------------------------------------------------------ */
const assureurFalaise: ProblemeMoule = {
  id: 'm5-pb-19', moduleId: M5,
  titre: 'L\'assureur au bord de la falaise : vendre parce qu\'on n\'a pas le choix',
  titreEn: 'The insurer at the cliff edge: selling because there is no choice',
  typeDeCas: 'contrainte de notation',
  typeDeCasEn: 'rating constraint',
  difficulte: 4,
  scenarios: ['Le directeur des investissements avant la vague de dégradations', 'La cellule de crise, le matin des downgrades', 'Le hedge fund qui a lu le calendrier des agences'],
  scenariosEn: ['The CIO before the downgrade wave', 'The crisis unit, the morning of the downgrades', 'The hedge fund that read the agencies\' calendar'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const portefeuille = randInt(rng, 30, 50);
    const partBbb = randInt(rng, 20, 30);
    const pdBbb = randFloat(rng, 0.15, 0.25, 2);
    const pdBb = randFloat(rng, 0.9, 1.2, 1);
    const duration = randFloat(rng, 5, 7, 1);
    const ecart = randInt(rng, 120, 180);
    const decoteVF = randFloat(rng, 1.5, 3, 1);
    const expo = (portefeuille * partBbb) / 100;

    const elAvantM = (perteAttenduePct(pdBbb, 40) / 100) * expo * 1000;
    const elApresM = (perteAttenduePct(pdBb, 40) / 100) * expo * 1000;
    const mtmPct = variationPrixSpreadPct(duration, ecart);
    const mtmM = (mtmPct / 100) * expo * 1000;
    const coutVenteM = Math.abs(mtmM) + expo * 1000 * (decoteVF / 100);
    const pertes5ansM = (probaDefautCumuleePct(pdBb, 5) / 100) * 0.6 * expo * 1000;
    const repElAvant = r1(elAvantM);
    const repElApres = r1(elApresM);
    const repMtmPct = r2(mtmPct);
    const repMtmM = r0(mtmM);
    const repCoutVente = r0(coutVenteM);
    const repPertes5 = r0(pertes5ansM);

    const { en, f, pct, pb: bp } = outils(langue);
    const desc = en
      ? `a life insurer's €${f(portefeuille, 0)}bn bond portfolio holds ${pct(partBbb, 0)} — €${f(r1(expo), 1)}bn — in BBB− names, the last floor of investment grade; historical PDs: about ${pct(pdBbb, 2)} per year at BBB−, about ${pct(pdBb, 1)} at BB+, recovery convention ${pct(40, 0)}; the mandate and the regulator forbid high yield: a downgrade forces the sale of every affected line; the spread duration of the bucket is about ${f(duration, 1)}, a downgrade wave would widen its spreads by roughly ${bp(ecart)}, and dumping that size into a shallow HY market costs an extra ${pct(decoteVF, 1)} of forced-sale discount; chapter 7's warning stands: insurers, natural holders of duration, become MECHANICAL sellers of fallen angels, at the worst moment`
      : `le portefeuille obligataire de ${f(portefeuille, 0)} Md€ d'un assureur-vie loge ${pct(partBbb, 0)} — ${f(r1(expo), 1)} Md€ — en signatures BBB−, le dernier étage de l'investment grade ; PD historiques : environ ${pct(pdBbb, 2)} par an en BBB−, environ ${pct(pdBb, 1)} en BB+, convention de recouvrement ${pct(40, 0)} ; le mandat et le régulateur interdisent le high yield : une dégradation force la vente de chaque ligne touchée ; la spread duration de la poche est d'environ ${f(duration, 1)}, une vague de dégradations écarterait ses spreads d'environ ${bp(ecart)}, et jeter cette taille dans un marché HY peu profond coûte ${pct(decoteVF, 1)} de décote de vente forcée en plus ; l'avertissement du chapitre 7 tient : les assureurs, porteurs naturels de duration, deviennent des vendeurs MÉCANIQUES de fallen angels, au pire moment`;
    const contexte = (en
      ? [
        `Thursday, 6 p.m., the CIO's office. The recession headlines have moved from the business pages to the front page, and two of the three agencies have put a fifth of your BBB− bucket on negative watch. Your board meets Monday. The portfolio: ${desc}.\n\nThe board will ask one question — "what does the cliff cost us, and is holding worse?" — and it deserves six numbers, not adjectives: the expected loss the bucket costs today; what it would cost re-rated one notch down; the mark-to-market of the widening, in percent then in euros; the total bill of selling under constraint; and the credit losses you would actually expect if you were ALLOWED to hold five years. The gap between those last two numbers is the price of your own mandate.`,
        `Monday, 8:10 a.m. The agency moved overnight: a sector-wide downgrade wave, and €${f(r1(expo), 1)}bn of your book crossed the border while you slept. The mandate machine has already flagged every line "SELL — non-compliant". The crisis unit has until 10 a.m. before the market makers widen their quotes in your face. The book: ${desc}.\n\nRun the numbers in the order the CEO will hear them: what these names were costing in expected losses, what they cost now, what the spread widening has already done to the marks, what the forced exit adds — and then the number that will make the room go quiet: what five years of actual expected defaults would have cost, if the mandate had allowed patience. The comparison is the whole scandal, and the whole mechanism.`,
        `Friday, two weeks earlier, a credit hedge fund. Your analyst has mapped the BBB− market: which insurers hold what, whose mandates force selling, and the agencies' review calendar. The prey: ${desc}.\n\nYour trade is to be the liquidity the constrained seller will beg for — at your price. Size the opportunity like the seller sizes his pain: his expected-loss arithmetic before and after, the mark-to-market of the wave, the forced-sale bill he will pay you, and the five-year expected losses that prove the paper is worth more than his exit price. The falaise BBB− is not a risk story; it is a flow story — and flows, unlike risks, have a calendar.`,
      ]
      : [
        `Jeudi, 18 h, le bureau du directeur des investissements. Les gros titres de récession sont passés des pages saumon à la une, et deux des trois agences ont mis un cinquième de votre poche BBB− sous surveillance négative. Votre conseil se réunit lundi. Le portefeuille : ${desc}.\n\nLe conseil posera une seule question — « que nous coûte la falaise, et garder est-il pire ? » — et elle mérite six nombres, pas des adjectifs : la perte attendue que la poche coûte aujourd'hui ; ce qu'elle coûterait recotée un cran plus bas ; le mark-to-market de l'écartement, en pourcentage puis en euros ; la facture totale d'une vente sous contrainte ; et les pertes de crédit que vous attendriez réellement si vous aviez le DROIT de garder cinq ans. L'écart entre ces deux derniers nombres est le prix de votre propre mandat.`,
        `Lundi, 8 h 10. L'agence a bougé dans la nuit : une vague de dégradations sectorielle, et ${f(r1(expo), 1)} Md€ de votre book ont franchi la frontière pendant votre sommeil. La machine des mandats a déjà marqué chaque ligne « VENDRE — non conforme ». La cellule de crise a jusqu'à 10 h avant que les market makers n'écartent leurs cotes à votre nez. Le book : ${desc}.\n\nDéroulez les nombres dans l'ordre où le directeur général les entendra : ce que ces signatures coûtaient en pertes attendues, ce qu'elles coûtent maintenant, ce que l'écartement des spreads a déjà fait aux marks, ce que la sortie forcée ajoute — puis le nombre qui fera taire la salle : ce que cinq ans de défauts réellement attendus auraient coûté, si le mandat avait permis la patience. La comparaison est tout le scandale, et tout le mécanisme.`,
        `Vendredi, deux semaines plus tôt, un hedge fund crédit. Votre analyste a cartographié le marché BBB− : quels assureurs portent quoi, quels mandats forcent la vente, et le calendrier de revue des agences. La proie : ${desc}.\n\nVotre trade est d'être la liquidité que le vendeur contraint suppliera d'avoir — à votre prix. Dimensionnez l'opportunité comme le vendeur dimensionne sa douleur : son arithmétique de pertes attendues avant et après, le mark-to-market de la vague, la facture de vente forcée qu'il vous paiera, et les pertes attendues à cinq ans qui prouvent que le papier vaut plus que son prix de sortie. La falaise BBB− n'est pas une histoire de risque ; c'est une histoire de flux — et les flux, contrairement aux risques, ont un calendrier.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) What the bucket costs today' : 'a) Ce que la poche coûte aujourd\'hui',
          enonce: en
            ? `€${f(r1(expo), 1)}bn at BBB−: PD ${pct(pdBbb, 2)}, R = ${pct(40, 0)}. What annual expected loss, in €m, does the bucket carry?`
            : `${f(r1(expo), 1)} Md€ en BBB− : PD ${pct(pdBbb, 2)}, R = ${pct(40, 0)}. Quelle perte attendue annuelle, en M€, la poche porte-t-elle ?`,
          reponse: repElAvant, tolerance: Math.max(0.5, repElAvant * 0.05), toleranceMode: 'absolu', unite: 'M€',
          etapes: [{
            titre: en ? 'The risk, measured while everyone is calm' : 'Le risque, mesuré pendant que tout est calme',
            contenu: en
              ? `EL = ${f(pdBbb, 2)}% × (1 − ${f(40, 0)}%) = ${pct(r2(perteAttenduePct(pdBbb, 40)), 3)} per year, i.e. ${f(r1(expo), 1)}bn × that = **€${f(repElAvant, 1)}m**. Keep the order of magnitude: on €${f(r1(expo), 1)}bn, the actual credit risk of the last IG floor costs a few million a year — BBB− issuers rarely die. Hold that number; everything that follows dwarfs it, and NONE of it is default.`
              : `EL = ${f(pdBbb, 2)} % × (1 − ${f(40, 0)} %) = ${pct(r2(perteAttenduePct(pdBbb, 40)), 3)} par an, soit ${f(r1(expo), 1)} Md × cela = **${f(repElAvant, 1)} M€**. Gardez l'ordre de grandeur : sur ${f(r1(expo), 1)} Md€, le vrai risque de crédit du dernier étage IG coûte quelques millions par an — les émetteurs BBB− meurent rarement. Retenez ce nombre ; tout ce qui suit l'écrase, et RIEN de ce qui suit n'est du défaut.`,
          }],
          pieges: [en
            ? `Confusing the bucket (€${f(r1(expo), 1)}bn) with the whole portfolio (€${f(portefeuille, 0)}bn): the expected loss applies to the exposed notional, and the units are €m at the end.`
            : `Confondre la poche (${f(r1(expo), 1)} Md€) et le portefeuille entier (${f(portefeuille, 0)} Md€) : la perte attendue s'applique au nominal exposé, et l'unité finale est le M€.`],
        },
        {
          intitule: en ? 'b) The same bucket, one notch lower' : 'b) La même poche, un cran plus bas',
          enonce: en
            ? `Re-rated BB+, the PD moves to ${pct(pdBb, 1)}. What does the annual expected loss become, in €m?`
            : `Recotée BB+, la PD passe à ${pct(pdBb, 1)}. Que devient la perte attendue annuelle, en M€ ?`,
          reponse: repElApres, tolerance: Math.max(1, repElApres * 0.05), toleranceMode: 'absolu', unite: 'M€',
          etapes: [{
            titre: en ? 'The risk did change — by millions, not billions' : 'Le risque a bien changé — de millions, pas de milliards',
            contenu: en
              ? `EL = ${f(pdBb, 1)}% × 0.6 × ${f(r1(expo), 1)}bn = **€${f(repElApres, 1)}m** a year, against €${f(repElAvant, 1)}m before: the downgrade multiplies the expected loss by ${f(r1(elApresM / elAvantM), 1)} — a real deterioration, honestly measured in tens of millions. Now watch the next questions convert one rating notch into BILLIONS of price and forced-exit costs: the cliff's violence is not in this line of arithmetic.`
              : `EL = ${f(pdBb, 1)} % × 0,6 × ${f(r1(expo), 1)} Md = **${f(repElApres, 1)} M€** par an, contre ${f(repElAvant, 1)} M€ avant : la dégradation multiplie la perte attendue par ${f(r1(elApresM / elAvantM), 1)} — une vraie détérioration, honnêtement mesurée en dizaines de millions. Regardez maintenant les questions suivantes convertir un cran de notation en MILLIARDS de prix et de coûts de sortie forcée : la violence de la falaise n'est pas dans cette ligne d'arithmétique.`,
          }],
          pieges: [en
            ? `Announcing "the risk exploded" from the EL alone overstates it: ${f(r1(elApresM / elAvantM), 1)}× a small number is still a small number relative to the coming FLOW effects — keep the two channels separate.`
            : `Annoncer « le risque a explosé » sur la seule EL exagère : ${f(r1(elApresM / elAvantM), 1)} × un petit nombre reste un petit nombre à côté des effets de FLUX qui viennent — gardez les deux canaux séparés.`],
        },
        {
          intitule: en ? 'c) The widening, in percent' : 'c) L\'écartement, en pourcentage',
          enonce: en
            ? `The wave widens the bucket's spreads by ${bp(ecart)} on a spread duration of ${f(duration, 1)}. What price change (in %, signed) does the bucket take?`
            : `La vague écarte les spreads de la poche de ${bp(ecart)} sur une spread duration de ${f(duration, 1)}. Quelle variation de prix (en %, signée) la poche prend-elle ?`,
          reponse: repMtmPct, tolerance: 0.15, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The border priced in one move' : 'La frontière pricée en un mouvement',
            contenu: en
              ? `ΔP = −${f(duration, 1)} × ${f(ecart, 0)}/100 = **${pct(repMtmPct, 2)}**. Why does one notch cost ${bp(ecart)}? Because the border is not one step among twenty: on one side sit ALL the constrained mandates, on the other almost none — the price gap prices the change of BUYER POPULATION, not the change of PD. The spread jump at the falaise is the market pre-charging the forced flows of question e).`
              : `ΔP = −${f(duration, 1)} × ${f(ecart, 0)}/100 = **${pct(repMtmPct, 2)}**. Pourquoi un cran coûte-t-il ${bp(ecart)} ? Parce que la frontière n'est pas un pas parmi vingt : d'un côté siègent TOUS les mandats contraints, de l'autre presque aucun — l'écart de prix price le changement de POPULATION D'ACHETEURS, pas le changement de PD. Le saut de spread à la falaise, c'est le marché qui pré-facture les flux forcés de la question e).`,
          }],
          pieges: [en
            ? `Comparing this ${pct(Math.abs(repMtmPct), 1)} to the PD change as if they were the same object: one is a price effect (reversible if held), the other a cash-flow expectation — mixing them is how committees panic twice.`
            : `Comparer ces ${pct(Math.abs(repMtmPct), 1)} au changement de PD comme si c'était le même objet : l'un est un effet de prix (réversible si l'on garde), l'autre une espérance de flux — les mélanger, c'est la recette des comités qui paniquent deux fois.`],
        },
        {
          intitule: en ? 'd) The widening, in euros' : 'd) L\'écartement, en euros',
          enonce: en
            ? `On the €${f(r1(expo), 1)}bn bucket, what mark-to-market, in €m (signed), does that represent?`
            : `Sur la poche de ${f(r1(expo), 1)} Md€, quel mark-to-market, en M€ (signé), cela représente-t-il ?`,
          reponse: repMtmM, tolerance: Math.max(10, Math.abs(repMtmM) * 0.03), toleranceMode: 'absolu', unite: 'M€',
          etapes: [{
            titre: en ? 'The number the board actually sees' : 'Le nombre que le conseil voit vraiment',
            contenu: en
              ? `MTM = ${pct(repMtmPct, 2)} × ${f(r1(expo), 1)}bn = **€${f(repMtmM, 0)}m**. Set the two scales side by side: the DEFAULT arithmetic of questions a)-b) moved by €${f(r1(elApresM - elAvantM), 1)}m a year; the PRICE arithmetic just moved by €${f(r0(Math.abs(mtmM)), 0)}m in a morning — a ratio of roughly ${f(r0(Math.abs(mtmM) / Math.max(1, elApresM - elAvantM)), 0)} to 1. The cliff is a mark-to-market event wearing a credit-risk costume.`
              : `MTM = ${pct(repMtmPct, 2)} × ${f(r1(expo), 1)} Md = **${f(repMtmM, 0)} M€**. Posez les deux échelles côte à côte : l'arithmétique de DÉFAUT des questions a)-b) a bougé de ${f(r1(elApresM - elAvantM), 1)} M€ par an ; l'arithmétique de PRIX vient de bouger de ${f(r0(Math.abs(mtmM)), 0)} M€ en une matinée — un rapport d'environ ${f(r0(Math.abs(mtmM) / Math.max(1, elApresM - elAvantM)), 0)} pour 1. La falaise est un événement de mark-to-market déguisé en risque de crédit.`,
          }],
          pieges: [en
            ? `Unit slip: ${pct(Math.abs(repMtmPct), 2)} of €${f(r1(expo), 1)}bn is €${f(r0(Math.abs(mtmM)), 0)}m — losses on a Md€ bucket land in HUNDREDS of M€, an order of magnitude worth double-checking before the board hears it.`
            : `Glissade d'unités : ${pct(Math.abs(repMtmPct), 2)} de ${f(r1(expo), 1)} Md€ font ${f(r0(Math.abs(mtmM)), 0)} M€ — les pertes d'une poche en Md€ tombent en CENTAINES de M€, un ordre de grandeur à revérifier avant que le conseil ne l'entende.`],
        },
        {
          intitule: en ? 'e) The full bill of the forced exit' : 'e) La facture complète de la sortie forcée',
          enonce: en
            ? `Selling the whole bucket crystallises the mark-to-market AND pays an extra ${pct(decoteVF, 1)} of forced-sale discount on €${f(r1(expo), 1)}bn. What total realised loss, in €m, does the constrained exit cost?`
            : `Vendre toute la poche cristallise le mark-to-market ET paie ${pct(decoteVF, 1)} de décote de vente forcée en plus sur ${f(r1(expo), 1)} Md€. Quelle perte totale réalisée, en M€, la sortie contrainte coûte-t-elle ?`,
          reponse: repCoutVente, tolerance: Math.max(15, repCoutVente * 0.03), toleranceMode: 'absolu', unite: 'M€',
          etapes: [{
            titre: en ? 'Realising the worst print of the cycle' : 'Réaliser le pire prix du cycle',
            contenu: en
              ? `Bill = ${f(r0(Math.abs(mtmM)), 0)} + ${f(r1(expo), 1)}bn × ${f(decoteVF, 1)}% = **€${f(repCoutVente, 0)}m**, realised, definitive. The double pain of the mechanical seller: he sells AFTER the widening (crystallising the mark) and BECAUSE everyone like him sells the same morning (paying the discount). And the buyer at the bid is the chapter 7 cast: HY funds and distressed desks whose best vintages are built on exactly this print. What the seller calls a loss, the market calls a transfer.`
              : `Facture = ${f(r0(Math.abs(mtmM)), 0)} + ${f(r1(expo), 1)} Md × ${f(decoteVF, 1)} % = **${f(repCoutVente, 0)} M€**, réalisés, définitifs. La double peine du vendeur mécanique : il vend APRÈS l'écartement (cristallisant le mark) et PARCE QUE tous ses semblables vendent le même matin (payant la décote). Et l'acheteur au bid est le casting du chapitre 7 : fonds HY et desks distressed dont les meilleurs millésimes se construisent exactement sur ce prix. Ce que le vendeur appelle une perte, le marché l'appelle un transfert.`,
          }],
          pieges: [en
            ? `Forgetting the second term: the forced-sale discount is paid ON TOP of the widening — €${f(r0(expo * 1000 * decoteVF / 100), 0)}m the seller pays for the privilege of selling with the crowd.`
            : `Oublier le second terme : la décote de vente forcée se paie EN PLUS de l'écartement — ${f(r0(expo * 1000 * decoteVF / 100), 0)} M€ que le vendeur paie pour le privilège de vendre avec la foule.`],
        },
        {
          intitule: en ? 'f) The cost of being allowed to wait' : 'f) Le coût d\'avoir le droit d\'attendre',
          enonce: en
            ? `If the insurer could hold five years at BB+ (PD ${pct(pdBb, 1)}, LGD ${pct(60, 0)}), what CUMULATIVE expected credit loss, in €m, would the bucket actually cost?`
            : `Si l'assureur pouvait garder cinq ans en BB+ (PD ${pct(pdBb, 1)}, LGD ${pct(60, 0)}), quelle perte de crédit attendue CUMULÉE, en M€, la poche coûterait-elle réellement ?`,
          reponse: repPertes5, tolerance: Math.max(10, repPertes5 * 0.03), toleranceMode: 'absolu', unite: 'M€',
          etapes: [
            {
              titre: en ? 'Patience, priced' : 'La patience, pricée',
              contenu: en
                ? `Cumulative default over 5 years = 100 − 100 × (1 − ${f(pdBb, 1)}%)⁵ = ${pct(r2(probaDefautCumuleePct(pdBb, 5)), 2)}; expected loss = that × ${f(60, 0)}% × ${f(r1(expo), 1)}bn = **€${f(repPertes5, 0)}m** over FIVE YEARS — against €${f(repCoutVente, 0)}m of realised loss in ONE MORNING for the constrained exit: the forced sale costs about ${f(r1(coutVenteM / Math.max(1, pertes5ansM)), 1)} times the credit losses patience would actually expect. That ratio is the price of the mandate — and the entire economic argument for why the falaise BBB− is a structural inefficiency someone else gets paid to harvest.`
                : `Défaut cumulé sur 5 ans = 100 − 100 × (1 − ${f(pdBb, 1)} %)⁵ = ${pct(r2(probaDefautCumuleePct(pdBb, 5)), 2)} ; perte attendue = cela × ${f(60, 0)} % × ${f(r1(expo), 1)} Md = **${f(repPertes5, 0)} M€** sur CINQ ANS — contre ${f(repCoutVente, 0)} M€ de perte réalisée en UNE MATINÉE pour la sortie contrainte : la vente forcée coûte environ ${f(r1(coutVenteM / Math.max(1, pertes5ansM)), 1)} fois les pertes de crédit que la patience attendrait réellement. Ce ratio est le prix du mandat — et tout l'argument économique qui fait de la falaise BBB− une inefficience structurelle que quelqu'un d'autre est payé pour moissonner.`,
            },
            {
              titre: en ? 'What the board should conclude' : 'Ce que le conseil doit conclure',
              contenu: en
                ? `Three conclusions worth the meeting. One: the cliff's cost is a FLOW cost, not a default cost — the numbers prove it by an order of magnitude. Two: risk management upstream beats crisis management downstream — trimming BBB− exposure BEFORE the watch list is worth hundreds of millions, which is why the review calendar is itself a risk parameter. Three: whoever is structurally allowed to cross the border — no rating constraint, patient capital — collects the transfer; the m5's recurring lesson that constraints, not opinions, move the biggest prices.`
                : `Trois conclusions qui valent la réunion. Un : le coût de la falaise est un coût de FLUX, pas un coût de défaut — les nombres le prouvent d'un ordre de grandeur. Deux : la gestion du risque en amont bat la gestion de crise en aval — alléger le BBB− AVANT la mise sous surveillance vaut des centaines de millions, et c'est pourquoi le calendrier de revue des agences est lui-même un paramètre de risque. Trois : celui qui a structurellement le droit de traverser la frontière — pas de contrainte de notation, du capital patient — encaisse le transfert ; la leçon récurrente du m5 : ce sont les contraintes, pas les opinions, qui bougent les plus gros prix.`,
            },
          ],
          pieges: [en
            ? `Using 5 × ${f(pdBb, 1)}% as the cumulative default overstates it (${pct(r1(5 * pdBb), 1)} vs ${pct(r2(probaDefautCumuleePct(pdBb, 5)), 2)}): compounding matters exactly when the horizon is long — the whole point of the comparison.`
            : `Prendre 5 × ${f(pdBb, 1)} % comme défaut cumulé le surestime (${pct(r1(5 * pdBb), 1)} contre ${pct(r2(probaDefautCumuleePct(pdBb, 5)), 2)}) : la composition compte précisément quand l'horizon est long — tout l'enjeu de la comparaison.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 20. m5-pb-20 — « Fabriquer du AAA » — BOSS N4                       */
/* ------------------------------------------------------------------ */
const fabriquerAaa: ProblemeMoule = {
  id: 'm5-pb-20', moduleId: M5,
  titre: 'Fabriquer du AAA : le structureur, l\'agence et ce qui reste au sponsor',
  titreEn: 'Manufacturing AAA: the structurer, the agency, and what is left for the sponsor',
  typeDeCas: 'structuration et rehaussement',
  typeDeCasEn: 'structuring and credit enhancement',
  difficulte: 4,
  scenarios: ['Le structureur devant la page blanche', 'L\'agence qui vérifie chaque étage', 'Le comité du sponsor : signer ou ne pas signer'],
  scenariosEn: ['The structurer at the blank page', 'The agency checking every floor', 'The sponsor\'s committee: to sign or not to sign'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const pool = randInt(rng, 400, 700);
    const pd = randFloat(rng, 1.8, 2.2, 1);
    const recouvrement = randInt(rng, 40, 45);
    const multiple = randFloat(rng, 1.8, 2.2, 1);
    const rendPool = randFloat(rng, 6, 6.8, 1);
    const coutTranches = randFloat(rng, 3.8, 4.4, 1);
    const equityPct = randFloat(rng, 4, 6, 1);

    const elAnnuelle = perteAttenduePct(pd, recouvrement);
    const pertes5 = (probaDefautCumuleePct(pd, 5) / 100) * (1 - recouvrement / 100) * 100;
    const attache = multiple * pertes5;
    const excessM = ((rendPool - coutTranches) / 100) * pool;
    const retentionM = 0.05 * pool;
    const equityM = (equityPct / 100) * pool;
    const rendEquity = ((excessM - (elAnnuelle / 100) * pool) / equityM) * 100;
    const repEl = r2(elAnnuelle);
    const repPertes5 = r2(pertes5);
    const repAttache = r2(attache);
    const repExcess = r2(excessM);
    const repRetention = r1(retentionM);
    const repRendEquity = r1(rendEquity);

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `a €${f(pool, 0)}m pool of BBB corporate loans, annual PD about ${pct(pd, 1)}, recovery ${pct(recouvrement, 0)}; the deal is a 5-year securitisation; the agency's methodology for the senior AAA demands subordination equal to ${f(multiple, 1)} times the pool's cumulative expected loss over the deal's life; the pool yields ${pct(rendPool, 1)} while the tranches sold to investors cost an average ${pct(coutTranches, 1)}; the sponsor keeps the equity tranche, sized at ${pct(equityPct, 1)} of the pool, and post-2008 regulation imposes a 5% retention (skin in the game) of the deal on the originator`
      : `un pool de ${f(pool, 0)} M€ de prêts corporate BBB, PD annuelle d'environ ${pct(pd, 1)}, recouvrement ${pct(recouvrement, 0)} ; l'opération est une titrisation à 5 ans ; la méthodologie de l'agence pour le senior AAA exige une subordination égale à ${f(multiple, 1)} fois la perte attendue cumulée du pool sur la vie de l'opération ; le pool rapporte ${pct(rendPool, 1)} quand les tranches vendues aux investisseurs coûtent en moyenne ${pct(coutTranches, 1)} ; le sponsor garde la tranche equity, calibrée à ${pct(equityPct, 1)} du pool, et la régulation post-2008 impose une rétention de 5 % (skin in the game) de l'opération à l'originateur`;
    const contexte = (en
      ? [
        `Monday, 8 a.m., the structuring desk, a blank term sheet. Your mandate: turn a pool of BBB loans into a stack where the top floor is AAA — the chapter 6 alchemy, done honestly this time, with every assumption on the table. The raw material: ${desc}.\n\nBuild it in the order the machine works: the pool's annual expected loss; the cumulative loss the deal must survive; the subordination the agency's multiple demands — the attachment point that IS the rating; the excess spread that absorbs losses before any tranche does; the retention the regulator forces you to keep; and finally the only number the sponsor's committee will read twice — the return on the equity he keeps. The 2007 machine built this without believing its own assumptions; your job is to build it while believing them.`,
        `Wednesday, the agency's committee room. The arranger's file is on the table and your signature turns a pool of BBB into a AAA floor. After 2008, your methodology is public, your multiple is ${f(multiple, 1)}, and your reputation is the collateral. The file: ${desc}.\n\nVerify floor by floor: the annual EL, the 5-year cumulative loss (compounded, not multiplied — the additive error inflates subordination errors too), the attachment the multiple requires, the excess spread's absorption capacity, the sponsor's retention, and the equity economics that reveal whether the sponsor WANTS the deal to perform or just to close. The 2007 lesson is procedural now: an AAA of structure is a conditional statement, and your committee writes the conditions.`,
        `Friday, the sponsor's investment committee. The structurer's deck promises the bank frees its balance sheet, the investors get their AAA, and you — the sponsor — keep the equity and the excess spread. Nothing is free; your job is to find where the risk went. The deal: ${desc}.\n\nRe-run every number the deck glosses over: the pool's EL, the cumulative losses, the subordination that protects the floors ABOVE you, the excess spread that is your income, the 5% the regulator makes you keep — and the equity return net of expected losses, which is either a fair price for holding the first loss, or the deck's way of hiding that you kept ALL the risk and sold all the safety. The committee signs only if the number says so.`,
      ]
      : [
        `Lundi, 8 h, le desk de structuration, une term sheet vierge. Votre mandat : transformer un pool de prêts BBB en un empilement dont le dernier étage est AAA — l'alchimie du chapitre 6, faite honnêtement cette fois, toutes les hypothèses sur la table. La matière première : ${desc}.\n\nConstruisez dans l'ordre où la machine fonctionne : la perte attendue annuelle du pool ; la perte cumulée que l'opération doit survivre ; la subordination que le multiple de l'agence exige — le point d'attache qui EST la notation ; l'excess spread qui absorbe les pertes avant toute tranche ; la rétention que le régulateur vous force à garder ; et enfin le seul nombre que le comité du sponsor lira deux fois — le rendement de l'equity qu'il conserve. La machine de 2007 a construit cela sans croire à ses propres hypothèses ; votre travail est de le construire en y croyant.`,
        `Mercredi, la salle du comité de l'agence. Le dossier de l'arrangeur est sur la table et votre signature transforme un pool de BBB en étage AAA. Après 2008, votre méthodologie est publique, votre multiple est ${f(multiple, 1)}, et votre réputation est le collatéral. Le dossier : ${desc}.\n\nVérifiez étage par étage : l'EL annuelle, la perte cumulée à 5 ans (composée, pas multipliée — l'erreur additive gonfle aussi les erreurs de subordination), l'attache que le multiple exige, la capacité d'absorption de l'excess spread, la rétention du sponsor, et l'économie de l'equity qui révèle si le sponsor VEUT que l'opération performe ou seulement qu'elle se signe. La leçon de 2007 est devenue procédurale : un AAA de structure est un énoncé conditionnel, et votre comité écrit les conditions.`,
        `Vendredi, le comité d'investissement du sponsor. Le deck du structureur promet que la banque libère son bilan, que les investisseurs ont leur AAA, et que vous — le sponsor — gardez l'equity et l'excess spread. Rien n'est gratuit ; votre travail est de trouver où le risque est parti. L'opération : ${desc}.\n\nRefaites chaque nombre que le deck survole : l'EL du pool, les pertes cumulées, la subordination qui protège les étages AU-DESSUS de vous, l'excess spread qui est votre revenu, les 5 % que le régulateur vous fait garder — et le rendement de l'equity net des pertes attendues, qui est soit le juste prix de porter la première perte, soit la façon du deck de cacher que vous avez gardé TOUT le risque et vendu toute la sécurité. Le comité ne signe que si le nombre le dit.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The pool\'s annual expected loss' : 'a) La perte attendue annuelle du pool',
          enonce: en
            ? `PD ${pct(pd, 1)}, recovery ${pct(recouvrement, 0)}. What is the pool's annual expected loss, in % of notional?`
            : `PD ${pct(pd, 1)}, recouvrement ${pct(recouvrement, 0)}. Quelle est la perte attendue annuelle du pool, en % du nominal ?`,
          reponse: repEl, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Everything starts from three letters' : 'Tout part de trois lettres',
            contenu: en
              ? `EL = ${f(pd, 1)}% × (1 − ${f(recouvrement, 0)}%) = **${pct(repEl, 2)}** per year. A BBB pool is honest raw material: it loses a little, every year, predictably ON AVERAGE. The whole securitisation is a machine for deciding who eats that average and who eats the deviations from it.`
              : `EL = ${f(pd, 1)} % × (1 − ${f(recouvrement, 0)} %) = **${pct(repEl, 2)}** par an. Un pool BBB est une matière première honnête : il perd un peu, chaque année, prévisiblement EN MOYENNE. Toute la titrisation est une machine à décider qui mange cette moyenne et qui mange les écarts à la moyenne.`,
          }],
          pieges: [en
            ? `PD × R (${f(r2(pd * recouvrement / 100), 2)}) instead of PD × LGD: the eternal inversion — the loss is what does NOT come back.`
            : `PD × R (${f(r2(pd * recouvrement / 100), 2)}) au lieu de PD × LGD : l'éternelle inversion — la perte est ce qui ne revient PAS.`],
        },
        {
          intitule: en ? 'b) The losses the deal must survive' : 'b) Les pertes que l\'opération doit survivre',
          enonce: en
            ? `Over the deal's 5 years, what CUMULATIVE expected loss (in % of the pool) results from compounding the ${pct(pd, 1)} PD, with LGD ${pct(100 - recouvrement, 0)}?`
            : `Sur les 5 ans de l'opération, quelle perte attendue CUMULÉE (en % du pool) résulte de la composition de la PD de ${pct(pd, 1)}, avec LGD ${pct(100 - recouvrement, 0)} ?`,
          reponse: repPertes5, tolerance: 0.15, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The deal lives five years, not one' : 'L\'opération vit cinq ans, pas un',
            contenu: en
              ? `Cumulative default = 100 − 100 × (1 − ${f(pd, 1)}%)⁵ = ${pct(r2(probaDefautCumuleePct(pd, 5)), 2)}; cumulative EL = that × ${f(100 - recouvrement, 0)}% = **${pct(repPertes5, 2)}** of the pool. This is the number the structure must digest over its life — the equity and mezzanine exist to stand between it and the senior. Compounded, not 5 × EL: the additive shortcut here would misprice every attachment point downstream.`
              : `Défaut cumulé = 100 − 100 × (1 − ${f(pd, 1)} %)⁵ = ${pct(r2(probaDefautCumuleePct(pd, 5)), 2)} ; EL cumulée = cela × ${f(100 - recouvrement, 0)} % = **${pct(repPertes5, 2)}** du pool. C'est le nombre que la structure doit digérer sur sa vie — l'equity et la mezzanine existent pour se tenir entre lui et le senior. Composé, pas 5 × EL : le raccourci additif fausserait ici tous les points d'attache en aval.`,
          }],
          pieges: [en
            ? `5 × ${pct(repEl, 2)} = ${pct(r2(5 * elAnnuelle), 2)} overshoots the compounded ${pct(repPertes5, 2)}: small error, but it propagates into the subordination and the price of every tranche.`
            : `5 × ${pct(repEl, 2)} = ${pct(r2(5 * elAnnuelle), 2)} dépasse le ${pct(repPertes5, 2)} composé : petite erreur, mais elle se propage dans la subordination et le prix de chaque tranche.`],
        },
        {
          intitule: en ? 'c) The subordination the AAA requires' : 'c) La subordination que le AAA exige',
          enonce: en
            ? `The agency demands subordination of ${f(multiple, 1)} times the cumulative expected loss. At what attachment point (in % of the pool) must the senior tranche start?`
            : `L'agence exige une subordination de ${f(multiple, 1)} fois la perte attendue cumulée. À quel point d'attache (en % du pool) la tranche senior doit-elle commencer ?`,
          reponse: repAttache, tolerance: 0.2, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The multiple is the whole methodology' : 'Le multiple est toute la méthodologie',
            contenu: en
              ? `Attachment = ${f(multiple, 1)} × ${f(repPertes5, 2)} = **${pct(repAttache, 2)}**: below the senior, ${pct(repAttache, 1)} of equity and mezzanine must absorb losses first. Read the multiple for what it is — the agency's entire opinion about the SHAPE of the loss distribution compressed into one number. If defaults are independent, ${f(multiple, 1)}× the mean is a fortress (the law of large numbers keeps losses near the mean); if correlation jumps, the same cushion is the Maginot line of chapter 6. The 2007 committees used multiples calibrated on a world where the national scenario "did not exist"; the multiple did not fail arithmetically — its world did.`
              : `Attache = ${f(multiple, 1)} × ${f(repPertes5, 2)} = **${pct(repAttache, 2)}** : sous le senior, ${pct(repAttache, 1)} d'equity et de mezzanine doivent absorber les pertes d'abord. Lisez le multiple pour ce qu'il est — toute l'opinion de l'agence sur la FORME de la distribution des pertes, comprimée en un nombre. Si les défauts sont indépendants, ${f(multiple, 1)} fois la moyenne est une forteresse (la loi des grands nombres tient les pertes près de la moyenne) ; si la corrélation saute, le même coussin est la ligne Maginot du chapitre 6. Les comités de 2007 utilisaient des multiples calibrés sur un monde où le scénario national « n'existait pas » ; le multiple n'a pas échoué arithmétiquement — son monde a échoué.`,
          }],
          pieges: [en
            ? `Sizing on the ANNUAL EL (${f(multiple, 1)} × ${f(repEl, 2)} = ${pct(r2(multiple * elAnnuelle), 2)}) forgets the deal's horizon: the senior must survive five years of accumulation, not one.`
            : `Calibrer sur l'EL ANNUELLE (${f(multiple, 1)} × ${f(repEl, 2)} = ${pct(r2(multiple * elAnnuelle), 2)}) oublie l'horizon de l'opération : le senior doit survivre à cinq ans d'accumulation, pas à un.`],
        },
        {
          intitule: en ? 'd) The excess spread' : 'd) L\'excess spread',
          enonce: en
            ? `The pool yields ${pct(rendPool, 1)}; the tranches cost ${pct(coutTranches, 1)}. What annual excess spread, in €m, does the €${f(pool, 0)}m structure generate?`
            : `Le pool rapporte ${pct(rendPool, 1)} ; les tranches coûtent ${pct(coutTranches, 1)}. Quel excess spread annuel, en M€, la structure de ${f(pool, 0)} M€ génère-t-elle ?`,
          reponse: repExcess, tolerance: Math.max(0.3, repExcess * 0.03), toleranceMode: 'absolu', unite: 'M€',
          etapes: [{
            titre: en ? 'The invisible first cushion' : 'Le premier coussin invisible',
            contenu: en
              ? `Excess spread = (${f(rendPool, 1)} − ${f(coutTranches, 1)})% × ${f(pool, 0)} = **€${f(repExcess, 2)}m per year** — the margin between what the assets earn and what the liabilities cost. It is the FIRST line of defence, before even the equity: current-year defaults are paid out of this flow, and only what exceeds it touches a tranche. Compare it with the pool's annual EL, ${f(r2((elAnnuelle / 100) * pool), 2)}m: in a normal year, the machine absorbs its own losses and the equity collects the difference. The enhancement stack of chapter 6 — subordination, excess spread, reserve account — is now fully priced on your page.`
              : `Excess spread = (${f(rendPool, 1)} − ${f(coutTranches, 1)}) % × ${f(pool, 0)} = **${f(repExcess, 2)} M€ par an** — la marge entre ce que les actifs rapportent et ce que le passif coûte. C'est la PREMIÈRE ligne de défense, avant même l'equity : les défauts de l'année courante se paient sur ce flux, et seul ce qui le dépasse touche une tranche. Comparez-le à l'EL annuelle du pool, ${f(r2((elAnnuelle / 100) * pool), 2)} M : en année normale, la machine absorbe ses propres pertes et l'equity encaisse la différence. L'arsenal de rehaussement du chapitre 6 — subordination, excess spread, compte de réserve — est maintenant entièrement pricé sur votre page.`,
          }],
          pieges: [en
            ? `The excess spread is a FLOW, not a stock: it absorbs the losses of each year as they come — it cannot be "saved up" retroactively against a sudden loss spike beyond its annual size.`
            : `L'excess spread est un FLUX, pas un stock : il absorbe les pertes de chaque année au fil de l'eau — il ne peut pas être « épargné » rétroactivement contre un pic de pertes au-delà de sa taille annuelle.`],
        },
        {
          intitule: en ? 'e) The regulator\'s pound of flesh' : 'e) La part du régulateur',
          enonce: en
            ? `Post-2008 rules impose 5% retention of the deal on the originator. On the €${f(pool, 0)}m pool, how many €m must stay on the sponsor's balance sheet?`
            : `Les règles post-2008 imposent 5 % de rétention de l'opération à l'originateur. Sur le pool de ${f(pool, 0)} M€, combien de M€ doivent rester au bilan du sponsor ?`,
          reponse: repRetention, tolerance: Math.max(0.3, repRetention * 0.02), toleranceMode: 'absolu', unite: 'M€',
          etapes: [{
            titre: en ? 'Skin in the game, by law' : 'Le skin in the game, par la loi',
            contenu: en
              ? `Retention = 5% × ${f(pool, 0)} = **€${f(repRetention, 1)}m** the sponsor cannot sell. The rule attacks the originate-to-distribute vice at the root: when the whole chain was paid on flow — commission at origination, volume, next — credit quality became everyone's business, meaning no one's. With €${f(repRetention, 1)}m staying home, the originator underwrites borrowers he will still own. Add the STS label (no re-securitisation, loan-by-loan data) and the post-crisis doctrine is complete: the tool was not guilty, the incentives were.`
              : `Rétention = 5 % × ${f(pool, 0)} = **${f(repRetention, 1)} M€** que le sponsor ne peut pas vendre. La règle attaque le vice originate-to-distribute à la racine : quand toute la chaîne était payée au flux — commission à l'origination, volume, next —, la qualité du crédit devenait l'affaire de tout le monde, c'est-à-dire de personne. Avec ${f(repRetention, 1)} M€ qui restent à la maison, l'originateur souscrit des emprunteurs qu'il possédera encore. Ajoutez le label STS (pas de re-titrisation, données ligne à ligne) et la doctrine post-crise est complète : l'outil n'était pas coupable, l'usage l'était.`,
          }],
          pieges: [en
            ? `Confusing the 5% regulatory retention with the equity tranche: they can overlap in practice, but one is a LEGAL floor on exposure, the other a COMMERCIAL choice of position in the stack.`
            : `Confondre la rétention réglementaire de 5 % et la tranche equity : elles peuvent se recouvrir en pratique, mais l'une est un plancher LÉGAL d'exposition, l'autre un choix COMMERCIAL de position dans l'empilement.`],
        },
        {
          intitule: en ? 'f) What is left for the sponsor' : 'f) Ce qui reste au sponsor',
          enonce: en
            ? `The sponsor keeps the equity tranche, ${pct(equityPct, 1)} of the pool. Net of the pool's annual expected loss, what return (in % per year) does the excess spread pay on the equity notional?`
            : `Le sponsor garde la tranche equity, ${pct(equityPct, 1)} du pool. Net de la perte attendue annuelle du pool, quel rendement (en % par an) l'excess spread paie-t-il sur le nominal de l'equity ?`,
          reponse: repRendEquity, tolerance: 1, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'The equity economics, honestly' : 'L\'économie de l\'equity, honnêtement',
              contenu: en
                ? `Equity notional = ${f(equityPct, 1)}% × ${f(pool, 0)} = €${f(r2(equityM), 2)}m; net annual flow = ${f(repExcess, 2)} − ${f(r2((elAnnuelle / 100) * pool), 2)} (the pool's EL) = €${f(r2(excessM - (elAnnuelle / 100) * pool), 2)}m; return = **${pct(repRendEquity, 1)} per year** on the equity. Now name what pays it: the sponsor earns this because he holds the FIRST LOSS — the structure's leverage without borrowing. In the average year the number prints; in the tail year the equity is rased first (chapter 6's clamp) and the return was the premium for standing there. High if the pool behaves, zero-minus if it does not: the equity of a securitisation is a sold put on the pool's losses — module 8's grammar, wearing chapter 6's clothes.`
                : `Nominal equity = ${f(equityPct, 1)} % × ${f(pool, 0)} = ${f(r2(equityM), 2)} M€ ; flux annuel net = ${f(repExcess, 2)} − ${f(r2((elAnnuelle / 100) * pool), 2)} (l'EL du pool) = ${f(r2(excessM - (elAnnuelle / 100) * pool), 2)} M€ ; rendement = **${pct(repRendEquity, 1)} par an** sur l'equity. Nommez ce qui le paie : le sponsor gagne cela parce qu'il porte la PREMIÈRE PERTE — le levier sans emprunt de la structure. L'année moyenne, le nombre s'imprime ; l'année de queue, l'equity est rasée en premier (le clamp du chapitre 6) et le rendement était la prime pour se tenir là. Élevé si le pool se comporte, zéro-moins sinon : l'equity d'une titrisation est un put vendu sur les pertes du pool — la grammaire du module 8, en habits du chapitre 6.`,
            },
            {
              titre: en ? 'The committee\'s closing page' : 'La page de clôture du comité',
              contenu: en
                ? `The deal in one paragraph. The pool loses ${pct(repEl, 2)} a year on average, ${pct(repPertes5, 2)} over its life; the agency prices its distribution-shape opinion at ${f(multiple, 1)}× — attachment ${pct(repAttache, 2)}; the excess spread of €${f(repExcess, 1)}m absorbs the ordinary years; the sponsor keeps €${f(repRetention, 1)}m by law and the first loss by choice, paid ${pct(repRendEquity, 1)} for it. Everyone's risk is now visible on one page — which is exactly what 2007 never produced, and exactly what the jury means by "understanding securitisation".`
                : `L'opération en un paragraphe. Le pool perd ${pct(repEl, 2)} par an en moyenne, ${pct(repPertes5, 2)} sur sa vie ; l'agence price son opinion sur la forme de la distribution à ${f(multiple, 1)} fois — attache ${pct(repAttache, 2)} ; l'excess spread de ${f(repExcess, 1)} M€ absorbe les années ordinaires ; le sponsor garde ${f(repRetention, 1)} M€ par la loi et la première perte par choix, payé ${pct(repRendEquity, 1)} pour cela. Le risque de chacun est désormais visible sur une page — exactement ce que 2007 n'a jamais produit, et exactement ce que le jury entend par « comprendre la titrisation ».`,
            },
          ],
          pieges: [en
            ? `Quoting the equity return GROSS (excess spread alone: ${pct(r1((excessM / equityM) * 100), 1)}) hides that the equity eats the pool's EL first — net of expected losses is the only honest quote, the m5's oldest reflex.`
            : `Citer le rendement de l'equity en BRUT (excess spread seul : ${pct(r1((excessM / equityM) * 100), 1)}) cache que l'equity mange d'abord l'EL du pool — net des pertes attendues est la seule cote honnête, le plus vieux réflexe du m5.`],
        },
      ],
    };
  },
};

export const problemesLot2: ProblemGenerator[] = [
  fallenAngel,
  pricingProbabilites,
  structureurClo,
  murRefinancement,
  aigSeptembre,
  baseQuiConverge,
  mezzanine2007,
  deskDistressed,
  assureurFalaise,
  fabriquerAaa,
];
