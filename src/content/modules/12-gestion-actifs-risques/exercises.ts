/**
 * Les 14 générateurs d'exercices d'application du module Gestion d'actifs &
 * risques : moyenner le rendement, composer le risque, prix du systématique
 * (CAPM), mesurer le talent (Sharpe, alpha, ratio d'information), chiffrer la
 * perte (VaR, stress), tenir le bilan (RWA, CET1, LCR) et payer les frais —
 * chaque moule martèle un piège des chapitres 1 à 6.
 *
 * BILINGUES : generate(seed, langue = 'fr'). Invariant absolu : TOUS les tirages
 * aléatoires sont effectués AVANT toute branche de langue — un même seed produit
 * exactement les mêmes nombres, la même réponse et la même tolérance en français
 * et en anglais. Seuls les textes (énoncé, étapes, pièges, unité textuelle) changent.
 *
 * Tous les calculs passent par calculs.ts (aucune formule recopiée). Conventions
 * du module (en-tête de calculs.ts) : pourcentages partout ; les POIDS de
 * portefeuille se passent en % et le complément à 100 va au second actif ; les
 * corrélations et les bêtas sont sans unité ; les ratios (Sharpe, information)
 * sont sans unité ; valeurs et bilans en MILLIONS, VaR en MILLIONS, année de
 * 252 jours de bourse ; la VaR paramétrique prend son quantile z EXPLICITE
 * (1,65 pour 95 %, 2,33 pour 99 %). Les pièges martelés ici : la volatilité
 * moyennée naïvement (elle ne se moyenne jamais, le rendement si), le ρ oublié
 * dans le bêta (σa/σm tout court), le talent lu brut (r − r_m sans payer le
 * bêta), l'excès de rendement oublié dans le Sharpe, la surperformance divisée
 * par la volatilité totale au lieu de la tracking error, le √(1/252) sauté et
 * le z de 95 confondu avec celui de 99, la VaR multipliée par h au lieu de √h,
 * le stress test sans le bêta, le capital calculé sur l'exposition brute au
 * lieu des RWA (c'est le ratio de levier), le LCR inversé, et les frais
 * annualisés linéairement (frais × n) quand ils se composent. L'ordre des
 * tirages de chaque moule est documenté dans son commentaire
 * « Tirages (ordre strict) ».
 */
import { formatNombreLangue } from '../../../engine/answers';
import { mulberry32, pick, randFloat, randInt } from '../../../engine/rng';
import type { ExerciseGenerator, Langue } from '../../../engine/types';
import {
  actifsPonderesRisqueMillions,
  alphaJensen,
  betaActif,
  lcrPct,
  perteStressMillions,
  ratioCet1Pct,
  ratioInformation,
  ratioSharpe,
  rendementCapm,
  rendementPortefeuille2Actifs,
  valeurNetteDeFrais,
  varHorizon,
  varParametrique,
  volatilitePortefeuille2Actifs,
} from './calculs';

const M12 = '12-gestion-actifs-risques';

const r2 = (v: number) => Math.round(v * 100) / 100;

/** Formateurs dépendants de la langue : nombre, pourcentage, signé, euros, millions. */
function formatters(langue: Langue) {
  const f = (v: number, d = 2) => formatNombreLangue(langue, v, d);
  const pct = (v: number, d = 2) => (langue === 'en' ? `${f(v, d)}%` : `${f(v, d)} %`);
  /** Nombre signé (+0,6 / −24), pour les alphas et les pertes de stress. */
  const sgn = (v: number, d = 2) => (v > 0 ? `+${f(v, d)}` : f(v, d));
  const eur = (v: number, d = 0) => (langue === 'en' ? `€${f(v, d)}` : `${f(v, d)} €`);
  const meur = (v: number, d = 0) => (langue === 'en' ? `€${f(v, d)}m` : `${f(v, d)} M€`);
  return { f, pct, sgn, eur, meur };
}

// ---------------------------------------------------------------------------
// 1. Le rendement d'un portefeuille : la moitié facile (N1)
// ---------------------------------------------------------------------------
export const genRendementPortefeuille: ExerciseGenerator = {
  id: 'm12-ex-01',
  moduleId: M12,
  titre: 'Le rendement d\'un portefeuille',
  titreEn: 'Portfolio expected return',
  difficulte: 1,
  // Tirages (ordre strict) : 1. poids = pick([20, 30, 40, 60, 70, 75, 80])
  // (jamais 50, sinon la moyenne simple du piège coïncide avec la réponse) ·
  // 2. rActions = randFloat(5, 10, 1) · 3. rObligations = randFloat(1, 4, 1).
  // Réponse = rendementPortefeuille2Actifs — l'ancre du ch1 : le 60/40
  // (8 %, 3 %) = 6 %. Les faux (moyenne simple, complément oublié) sont
  // recalculés dans le corrigé.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const poids = pick(rng, [20, 30, 40, 60, 70, 75, 80] as const);
    const rActions = randFloat(rng, 5, 10, 1);
    const rObligations = randFloat(rng, 1, 4, 1);

    const poids2 = 100 - poids;
    const reponse = r2(rendementPortefeuille2Actifs(poids, rActions, rObligations));
    const fauxSimple = r2((rActions + rObligations) / 2);
    const fauxSansComplement = r2((poids / 100) * rActions);

    const en = langue === 'en';
    const { f, pct } = formatters(langue);
    return {
      enonce: en
        ? `A balanced fund holds ${pct(poids, 0)} in equities (expected return ${pct(rActions, 1)}) and ${pct(poids2, 0)} in bonds (expected return ${pct(rObligations, 1)}).\n\n**What is the portfolio's expected return, in %?**`
        : `Un fonds diversifié détient ${pct(poids, 0)} d'actions (rendement espéré ${pct(rActions, 1)}) et ${pct(poids2, 0)} d'obligations (rendement espéré ${pct(rObligations, 1)}).\n\n**Quel est le rendement espéré du portefeuille, en % ?**`,
      reponse,
      tolerance: 0.005,
      unite: '%',
      etapes: [
        {
          titre: en ? 'The weights sum to 100' : 'Les poids somment à 100',
          contenu: en
            ? `Two sleeves, ${pct(poids, 0)} and ${pct(poids2, 0)}: every euro is somewhere, and each sleeve contributes its return in proportion to its weight. The expected return of a portfolio is a WEIGHTED average — weighted by the money, not by the number of lines.`
            : `Deux poches, ${pct(poids, 0)} et ${pct(poids2, 0)} : chaque euro est quelque part, et chaque poche apporte son rendement au prorata de son poids. Le rendement espéré d'un portefeuille est une moyenne PONDÉRÉE — pondérée par l'argent, pas par le nombre de lignes.`,
        },
        {
          titre: en ? 'The weighted average' : 'La moyenne pondérée',
          contenu: en
            ? `$r_p = w_1 r_1 + w_2 r_2 = ${f(poids, 0)}\\,\\% × ${f(rActions, 1)}\\,\\% + ${f(poids2, 0)}\\,\\% × ${f(rObligations, 1)}\\,\\%$ = **${pct(reponse, 2)}**. Chapter 1's anchor, the canonical 60/40: 60% equities at 8%, 40% bonds at 3% ⇒ 6%. Linear, no surprise, no magic.`
            : `$r_p = w_1 r_1 + w_2 r_2 = ${f(poids, 0)}\\,\\% × ${f(rActions, 1)}\\,\\% + ${f(poids2, 0)}\\,\\% × ${f(rObligations, 1)}\\,\\%$ = **${pct(reponse, 2)}**. L'ancre du chapitre 1, le 60/40 canonique : 60 % d'actions à 8 %, 40 % d'obligations à 3 % ⇒ 6 %. Linéaire, sans surprise, sans magie.`,
        },
        {
          titre: en ? 'Why this half is the easy one' : 'Pourquoi cette moitié est la facile',
          contenu: en
            ? `The return AVERAGES; the risk does NOT (exercise 4). Diversifying costs no expected return — the whole of Markowitz lives in that asymmetry: you can shed volatility by pure assembly while the return line stays a plain weighted average. Say the sentence at the oral: "the return is linear in the weights; the volatility is not, because of correlation".`
            : `Le rendement SE MOYENNE ; le risque, NON (exercice 4). Diversifier ne coûte aucun rendement espéré — tout Markowitz tient dans cette asymétrie : on fait fondre de la volatilité par pur assemblage pendant que la ligne de rendement reste une banale moyenne pondérée. La phrase à dire à l'oral : « le rendement est linéaire dans les poids ; la volatilité, non, à cause de la corrélation ».`,
        },
      ],
      pieges: [
        en
          ? `The simple average (${f(rActions, 1)} + ${f(rObligations, 1)})/2 = ${pct(fauxSimple, 2)} instead of ${pct(reponse, 2)}: the weights are ${pct(poids, 0)}/${pct(poids2, 0)}, not 50/50. A return averages by the money invested, never by the number of asset classes.`
          : `La moyenne simple (${f(rActions, 1)} + ${f(rObligations, 1)})/2 = ${pct(fauxSimple, 2)} au lieu de ${pct(reponse, 2)} : les poids sont ${pct(poids, 0)}/${pct(poids2, 0)}, pas 50/50. Un rendement se moyenne par l'argent investi, jamais par le nombre de classes d'actifs.`,
        en
          ? `Stopping at ${pct(fauxSansComplement, 2)} — the equity sleeve alone (${f(poids, 0)}% × ${f(rActions, 1)}%) — and forgetting that the other ${pct(poids2, 0)} of the money earns ${pct(rObligations, 1)} too. The complement to 100 is invested, not parked at zero.`
          : `S'arrêter à ${pct(fauxSansComplement, 2)} — la poche actions seule (${f(poids, 0)} % × ${f(rActions, 1)} %) — en oubliant que les autres ${pct(poids2, 0)} de l'argent rapportent aussi ${pct(rObligations, 1)}. Le complément à 100 est investi, pas garé à zéro.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 2. Le rendement exigé par le CAPM (N1)
// ---------------------------------------------------------------------------
export const genRendementCapm: ExerciseGenerator = {
  id: 'm12-ex-02',
  moduleId: M12,
  titre: 'Le rendement exigé par le CAPM',
  titreEn: 'The CAPM required return',
  difficulte: 1,
  // Tirages (ordre strict) : 1. rf = randFloat(1, 4, 1) · 2. beta =
  // randFloat(0.5, 1.8, 1) · 3. prime = randFloat(4, 6, 1) (la prime de
  // marché actions, 4-6 %/an sur longue période — ch2).
  // Réponse = rendementCapm — l'ancre du ch2 : (3, 1,2, 5) = 9 %. Les faux
  // (bêta ignoré = rendement du marché, via rendementCapm(rf, 1, prime) ;
  // tout multiplié par le bêta) sont recalculés dans le corrigé.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const rf = randFloat(rng, 1, 4, 1);
    const beta = randFloat(rng, 0.5, 1.8, 1);
    const prime = randFloat(rng, 4, 6, 1);

    const reponse = r2(rendementCapm(rf, beta, prime));
    const fauxSansBeta = r2(rendementCapm(rf, 1, prime));
    const fauxToutBeta = r2(beta * (rf + prime));
    const amplifie = beta > 1;

    const en = langue === 'en';
    const { f, pct } = formatters(langue);
    return {
      enonce: en
        ? `An equity fund carries a beta of ${f(beta, 1)}. The risk-free rate is ${pct(rf, 1)} and the equity market risk premium is ${pct(prime, 1)}.\n\n**What return does the CAPM require of this fund, in %?**`
        : `Un fonds actions porte un bêta de ${f(beta, 1)}. Le taux sans risque vaut ${pct(rf, 1)} et la prime de risque du marché actions ${pct(prime, 1)}.\n\n**Quel rendement le CAPM exige-t-il de ce fonds, en % ?**`,
      reponse,
      tolerance: 0.005,
      unite: '%',
      etapes: [
        {
          titre: en ? 'The security market line' : 'La security market line',
          contenu: en
            ? `$r = r_f + \\beta × (r_m - r_f) = ${f(rf, 1)}\\,\\% + ${f(beta, 1)} × ${f(prime, 1)}\\,\\%$ = **${pct(reponse, 2)}**. Chapter 2's anchor: 3% + 1.2 × 5% = 9%. The SML prices ONE thing only: the beta — the asset's contribution to systematic risk. Everything else, the market assumes you have diversified it away for free.`
            : `$r = r_f + \\beta × (r_m - r_f) = ${f(rf, 1)}\\,\\% + ${f(beta, 1)} × ${f(prime, 1)}\\,\\%$ = **${pct(reponse, 2)}**. L'ancre du chapitre 2 : 3 % + 1,2 × 5 % = 9 %. La SML ne price qu'UNE chose : le bêta — la contribution de l'actif au risque systématique. Tout le reste, le marché suppose que vous l'avez diversifié gratuitement.`,
        },
        {
          titre: en ? 'Read the number' : 'Lire le chiffre',
          contenu: en
            ? `A beta of ${f(beta, 1)} ${amplifie ? 'amplifies' : 'dampens'} market moves: the fund is "long ${f(beta, 1)} times the market", so it must pay the risk-free rate plus ${f(beta, 1)} times the price of one unit of systematic risk. That price — the market premium — is the key empirical parameter: about 4 to 6% per year over the long run, remarkably stable at the scale of a century.`
            : `Un bêta de ${f(beta, 1)} ${amplifie ? 'amplifie' : 'amortit'} les mouvements du marché : le fonds « est long ${f(beta, 1)} fois le marché », il doit donc payer le taux sans risque plus ${f(beta, 1)} fois le prix d'une unité de risque systématique. Ce prix — la prime de marché — est le paramètre empirique clé : environ 4 à 6 % par an sur longue période, remarquablement stable à l'échelle du siècle.`,
        },
        {
          titre: en ? 'What the number is FOR' : 'À quoi sert le chiffre',
          contenu: en
            ? `These ${pct(reponse, 2)} are not a forecast — they are an ÉTALON. A manager with this beta who delivers more has created alpha (exercise 6); one who delivers less has destroyed value even if the sign was positive. The CAPM predicts imperfectly (value, momentum, low-vol anomalies), but its language — beta bought cheap, alpha rare and expensive — structures every fund sheet you will read.`
            : `Ces ${pct(reponse, 2)} ne sont pas une prévision — c'est un ÉTALON. Un gérant de ce bêta qui livre davantage a créé de l'alpha (exercice 6) ; un qui livre moins a détruit de la valeur même si le signe était positif. Le CAPM prédit imparfaitement (anomalies value, momentum, low-vol), mais son langage — le bêta qui s'achète pour rien, l'alpha rare et cher — structure toutes les fiches de fonds que vous lirez.`,
        },
      ],
      pieges: [
        en
          ? `Ignoring the beta: ${f(rf, 1)} + ${f(prime, 1)} = ${pct(fauxSansBeta, 2)} — that is the required return of the MARKET (β = 1), not of a fund at β = ${f(beta, 1)}. The premium is earned per unit of systematic risk: it scales with the beta.`
          : `Ignorer le bêta : ${f(rf, 1)} + ${f(prime, 1)} = ${pct(fauxSansBeta, 2)} — c'est le rendement exigé du MARCHÉ (β = 1), pas d'un fonds à β = ${f(beta, 1)}. La prime se gagne par unité de risque systématique : elle se multiplie par le bêta.`,
        en
          ? `Multiplying everything by beta: ${f(beta, 1)} × (${f(rf, 1)} + ${f(prime, 1)}) = ${pct(fauxToutBeta, 2)}. The risk-free rate is NOT scaled by beta — it is what a zero-beta position earns; only the premium above it is systematic-risk pay.`
          : `Tout multiplier par le bêta : ${f(beta, 1)} × (${f(rf, 1)} + ${f(prime, 1)}) = ${pct(fauxToutBeta, 2)}. Le taux sans risque ne se multiplie PAS par le bêta — c'est ce que gagne une position de bêta nul ; seule la prime au-dessus rémunère le risque systématique.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 3. Le ratio de Sharpe (N1)
// ---------------------------------------------------------------------------
export const genRatioSharpe: ExerciseGenerator = {
  id: 'm12-ex-03',
  moduleId: M12,
  titre: 'Le ratio de Sharpe',
  titreEn: 'The Sharpe ratio',
  difficulte: 1,
  // Tirages (ordre strict) : 1. rendement = randFloat(5, 12, 1) · 2. rf =
  // randFloat(1, 4, 1) (toujours < rendement : le Sharpe reste positif) ·
  // 3. vol = randInt(6, 20).
  // Réponse = ratioSharpe, SANS UNITÉ — l'ancre du ch3 : (8, 3, 10) = 0,5.
  // Le faux « excès oublié » (r/σ tout court) est recalculé dans le corrigé.
  // Tolérance ABSOLUE 0,02 : un ratio à deux décimales.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const rendement = randFloat(rng, 5, 12, 1);
    const rf = randFloat(rng, 1, 4, 1);
    const vol = randInt(rng, 6, 20);

    const exces = r2(rendement - rf);
    const reponse = r2(ratioSharpe(rendement, rf, vol));
    const fauxSansRf = r2(rendement / vol);

    const en = langue === 'en';
    const { f, pct } = formatters(langue);
    const verdictFr = reponse > 1
      ? 'excellent — et au-delà de 2, ce ne serait plus impressionnant, ce serait suspect'
      : reponse > 0.5
        ? 'bon — nettement au-dessus de ce qu\'un portefeuille actions passif vit sur longue période (0,3-0,5)'
        : reponse >= 0.3
          ? 'dans la norme d\'un portefeuille actions passif sur longue période (0,3-0,5)'
          : 'faible — sous la bande 0,3-0,5 d\'un portefeuille actions passif : le risque a été mal payé';
    const verdictEn = reponse > 1
      ? 'excellent — and above 2 it would no longer be impressive, it would be suspicious'
      : reponse > 0.5
        ? 'good — clearly above what a passive equity portfolio lives at over the long run (0.3-0.5)'
        : reponse >= 0.3
          ? 'in the normal band of a passive equity portfolio over the long run (0.3-0.5)'
          : 'weak — below the 0.3-0.5 band of a passive equity portfolio: the risk was poorly paid';
    return {
      enonce: en
        ? `A portfolio returned ${pct(rendement, 1)} over the year with a volatility of ${pct(vol, 0)}. Cash (the risk-free rate) paid ${pct(rf, 1)}.\n\n**What is its Sharpe ratio?**`
        : `Un portefeuille a rendu ${pct(rendement, 1)} sur l'année avec une volatilité de ${pct(vol, 0)}. Le cash (taux sans risque) a payé ${pct(rf, 1)}.\n\n**Quel est son ratio de Sharpe ?**`,
      reponse,
      tolerance: 0.02,
      toleranceMode: 'absolu',
      etapes: [
        {
          titre: en ? 'First, the excess over cash' : 'D\'abord, l\'excès sur le cash',
          contenu: en
            ? `The most primitive benchmark: was it worth leaving cash at all? Excess return $= r - r_f = ${f(rendement, 1)}\\,\\% - ${f(rf, 1)}\\,\\%$ = **${pct(exces, 2)}**. Only that excess rewards the risk taken — the first ${pct(rf, 1)} were available for free.`
            : `L'étalon le plus primitif : valait-il la peine de quitter le cash ? Excès de rendement $= r - r_f = ${f(rendement, 1)}\\,\\% - ${f(rf, 1)}\\,\\%$ = **${pct(exces, 2)}**. Seul cet excès rémunère le risque pris — les premiers ${pct(rf, 1)} étaient disponibles gratuitement.`,
        },
        {
          titre: en ? 'Divide by the risk' : 'Diviser par le risque',
          contenu: en
            ? `$\\text{Sharpe} = \\dfrac{r - r_f}{\\sigma} = \\dfrac{${f(exces, 2)}}{${f(vol, 0)}}$ = **${f(reponse, 2)}** — a UNITLESS number: how much each point of volatility endured paid above cash. Chapter 3's anchor: (8% − 3%)/10% = 0.5, half a point of excess return per point of risk.`
            : `$\\text{Sharpe} = \\dfrac{r - r_f}{\\sigma} = \\dfrac{${f(exces, 2)}}{${f(vol, 0)}}$ = **${f(reponse, 2)}** — un nombre SANS UNITÉ : combien chaque point de volatilité subie a rapporté au-dessus du cash. L'ancre du chapitre 3 : (8 % − 3 %)/10 % = 0,5, un demi-point d'excès de rendement par point de risque.`,
        },
        {
          titre: en ? 'Read it on the scale' : 'Le lire sur l\'échelle',
          contenu: en
            ? `Your ${f(reponse, 2)} reads as ${verdictEn}. The desk reflex in front of a Sharpe above 2: ask WHERE the return comes from before admiring the ratio — insurance-selling strategies (option writing, carry) show a smooth return and a tiny measured volatility right up until the tail risk realises. LTCM printed a Sharpe above 4 before 1998.`
            : `Votre ${f(reponse, 2)} se lit : ${verdictFr}. Le réflexe de desk devant un Sharpe au-delà de 2 : demander D'OÙ vient le rendement avant d'admirer le ratio — les stratégies qui vendent de l'assurance (vente d'options, portage) affichent un rendement lisse et une volatilité mesurée minuscule jusqu'au jour où le risque de queue se réalise. LTCM affichait un Sharpe supérieur à 4 avant 1998.`,
        },
      ],
      pieges: [
        en
          ? `Forgetting the risk-free rate: ${f(rendement, 1)}/${f(vol, 0)} = ${f(fauxSansRf, 2)} instead of ${f(reponse, 2)}. The Sharpe measures what leaving cash PAID; counting the risk-free part as a reward for risk flatters every portfolio, and flatters the riskless ones most.`
          : `Oublier le taux sans risque : ${f(rendement, 1)}/${f(vol, 0)} = ${f(fauxSansRf, 2)} au lieu de ${f(reponse, 2)}. Le Sharpe mesure ce que quitter le cash a PAYÉ ; compter la part sans risque comme une récompense du risque flatte tous les portefeuilles, et d'abord les moins risqués.`,
        en
          ? `Trusting a spectacular Sharpe: leverage doubles the excess return AND the volatility — the displayed return balloons, the Sharpe does not move. Conversely, a superb Sharpe on a short window may just mean the tail has not shown up yet. The ratio is a question-opener, never a verdict.`
          : `Croire un Sharpe spectaculaire : le levier double l'excès de rendement ET la volatilité — le rendement affiché gonfle, le Sharpe ne bouge pas. Inversement, un Sharpe superbe sur une fenêtre courte peut juste signifier que la queue ne s'est pas encore montrée. Le ratio ouvre une question, il ne rend jamais de verdict.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 4. La volatilité d'un portefeuille : le seul repas gratuit (N2)
// ---------------------------------------------------------------------------
export const genVolatilitePortefeuille: ExerciseGenerator = {
  id: 'm12-ex-04',
  moduleId: M12,
  titre: 'La volatilité d\'un portefeuille',
  titreEn: 'Portfolio volatility',
  difficulte: 2,
  // Tirages (ordre strict) : 1. poids = pick([20, 30, 40, 50, 60, 70, 80]) ·
  // 2. vol1 = randInt(15, 35) (actions) · 3. vol2 = randInt(5, 14)
  // (obligations) · 4. rho = randFloat(-0.5, 0.9, 1).
  // Réponse = volatilitePortefeuille2Actifs — LA formule du module, l'ancre
  // du ch1 : (60, 20, 10, ρ 0,3) = 13,740451 %. LE piège du moule (la moyenne
  // pondérée naïve) est recalculé via la MÊME fonction à ρ = 1 — le cas où
  // la diversification disparaît et où la racine rend exactement la moyenne.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const poids = pick(rng, [20, 30, 40, 50, 60, 70, 80] as const);
    const vol1 = randInt(rng, 15, 35);
    const vol2 = randInt(rng, 5, 14);
    const rho = randFloat(rng, -0.5, 0.9, 1);

    const poids2 = 100 - poids;
    const reponse = r2(volatilitePortefeuille2Actifs(poids, vol1, vol2, rho));
    const fauxMoyenne = r2(volatilitePortefeuille2Actifs(poids, vol1, vol2, 1));
    const ecartRepas = r2(fauxMoyenne - reponse);
    // Les trois termes sous la racine, pour le corrigé pas à pas (affichage).
    const w1 = poids / 100;
    const w2 = poids2 / 100;
    const t1 = r2(w1 * w1 * vol1 * vol1);
    const t2 = r2(w2 * w2 * vol2 * vol2);
    const t3 = r2(2 * w1 * w2 * rho * vol1 * vol2);
    const somme = r2(t1 + t2 + t3);

    const en = langue === 'en';
    const { f, pct } = formatters(langue);
    return {
      enonce: en
        ? `Your portfolio holds ${pct(poids, 0)} in equities (volatility ${pct(vol1, 0)}) and ${pct(poids2, 0)} in bonds (volatility ${pct(vol2, 0)}). The correlation between the two is ${f(rho, 1)}.\n\n**What is the portfolio's volatility, in %?**`
        : `Votre portefeuille détient ${pct(poids, 0)} d'actions (volatilité ${pct(vol1, 0)}) et ${pct(poids2, 0)} d'obligations (volatilité ${pct(vol2, 0)}). La corrélation entre les deux vaut ${f(rho, 1)}.\n\n**Quelle est la volatilité du portefeuille, en % ?**`,
      reponse,
      tolerance: 0.005,
      unite: '%',
      etapes: [
        {
          titre: en ? 'Three terms under the root' : 'Trois termes sous la racine',
          contenu: en
            ? `$\\sigma_p = \\sqrt{w_1^2\\sigma_1^2 + w_2^2\\sigma_2^2 + 2 w_1 w_2 \\rho\\, \\sigma_1\\sigma_2}$ — THE formula of the module, to unroll with your eyes closed. Term by term: ${f(w1, 2)}² × ${f(vol1, 0)}² = **${f(t1, 2)}** (equities alone), ${f(w2, 2)}² × ${f(vol2, 0)}² = **${f(t2, 2)}** (bonds alone), and the CROSS term 2 × ${f(w1, 2)} × ${f(w2, 2)} × ${f(rho, 1)} × ${f(vol1, 0)} × ${f(vol2, 0)} = **${f(t3, 2)}** — the only one where ρ appears, and the one that carries the whole story.`
            : `$\\sigma_p = \\sqrt{w_1^2\\sigma_1^2 + w_2^2\\sigma_2^2 + 2 w_1 w_2 \\rho\\, \\sigma_1\\sigma_2}$ — LA formule du module, à dérouler les yeux fermés. Terme à terme : ${f(w1, 2)}² × ${f(vol1, 0)}² = **${f(t1, 2)}** (les actions seules), ${f(w2, 2)}² × ${f(vol2, 0)}² = **${f(t2, 2)}** (les obligations seules), et le terme CROISÉ 2 × ${f(w1, 2)} × ${f(w2, 2)} × ${f(rho, 1)} × ${f(vol1, 0)} × ${f(vol2, 0)} = **${f(t3, 2)}** — le seul où ρ apparaît, et celui qui porte toute l'histoire.`,
        },
        {
          titre: en ? 'Sum, then the root' : 'Sommer, puis la racine',
          contenu: en
            ? `Under the root: $${f(t1, 2)} + ${f(t2, 2)} + ${f(t3, 2)} = ${f(somme, 2)}$, whose square root gives $\\sigma_p$ = **${pct(reponse, 2)}**. Chapter 1's anchor: the 60/40 at volatilities 20/10 and ρ = 0.3 lands at 13.740451% — against a naive weighted average of 16%.`
            : `Sous la racine : $${f(t1, 2)} + ${f(t2, 2)} + ${f(t3, 2)} = ${f(somme, 2)}$, dont la racine carrée donne $\\sigma_p$ = **${pct(reponse, 2)}**. L'ancre du chapitre 1 : le 60/40 à volatilités 20/10 et ρ = 0,3 tombe à 13,740451 % — contre une moyenne pondérée naïve de 16 %.`,
        },
        {
          titre: en ? 'The free lunch, measured' : 'Le repas gratuit, mesuré',
          contenu: en
            ? `At ρ = 1 the root closes back onto the weighted average, $w_1\\sigma_1 + w_2\\sigma_2 = ${pct(fauxMoyenne, 2)}$ — no diversification left, two perfectly correlated assets are one asset in disguise. Your ρ = ${f(rho, 1)} makes **${f(ecartRepas, 2)} points of volatility disappear** without sacrificing a cent of expected return: the only free lunch in finance. Its fine print, from module 11: correlations climb towards 1 precisely in crises — the cross term that protects you swells at the worst moment.`
            : `À ρ = 1 la racine se referme sur la moyenne pondérée, $w_1\\sigma_1 + w_2\\sigma_2 = ${pct(fauxMoyenne, 2)}$ — plus aucune diversification, deux actifs parfaitement corrélés sont un seul actif déguisé. Votre ρ = ${f(rho, 1)} fait **disparaître ${f(ecartRepas, 2)} points de volatilité** sans sacrifier un centime de rendement espéré : le seul repas gratuit de la finance. Sa clause en petits caractères, héritée du module 11 : les corrélations montent vers 1 précisément dans les crises — le terme croisé qui vous protège gonfle au pire moment.`,
        },
      ],
      pieges: [
        en
          ? `THE trap of the chapter — averaging the volatilities: ${f(w1, 2)} × ${f(vol1, 0)} + ${f(w2, 2)} × ${f(vol2, 0)} = ${pct(fauxMoyenne, 2)} instead of ${pct(reponse, 2)}. That is the ρ = 1 answer: it silently assumes the two assets are perfectly correlated. The return averages; the risk does not — it composes through the root.`
          : `LE piège du chapitre — moyenner les volatilités : ${f(w1, 2)} × ${f(vol1, 0)} + ${f(w2, 2)} × ${f(vol2, 0)} = ${pct(fauxMoyenne, 2)} au lieu de ${pct(reponse, 2)}. C'est la réponse du cas ρ = 1 : elle suppose silencieusement les deux actifs parfaitement corrélés. Le rendement se moyenne ; le risque, non — il se compose sous la racine.`,
        en
          ? `Dropping the cross term (or its factor 2): the whole diversification story lives in $2 w_1 w_2 \\rho \\sigma_1 \\sigma_2$ = ${f(t3, 2)} here — it is the ONLY term that knows the assets talk to each other. Forget it and every portfolio looks like a sum of silos.`
          : `Laisser tomber le terme croisé (ou son facteur 2) : toute l'histoire de la diversification vit dans $2 w_1 w_2 \\rho \\sigma_1 \\sigma_2$ = ${f(t3, 2)} ici — c'est le SEUL terme qui sait que les actifs se parlent. L'oublier, c'est traiter chaque portefeuille comme une somme de silos.`,
        en
          ? `Believing the number of lines diversifies: a thousand assets correlated at 1 behave as one. What diversifies is the correlation between the lines — and it is estimated in calm times, then betrays in storms (module 11). Diversification is a cruising tool, not a life jacket.`
          : `Croire que le nombre de lignes diversifie : mille actifs corrélés à 1 se comportent comme un seul. Ce qui diversifie, c'est la corrélation entre les lignes — estimée par temps calme, elle trahit dans la tempête (module 11). La diversification est un outil de croisière, pas un gilet de sauvetage.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 5. Le bêta depuis la corrélation et les volatilités (N2)
// ---------------------------------------------------------------------------
export const genBetaActif: ExerciseGenerator = {
  id: 'm12-ex-05',
  moduleId: M12,
  titre: 'Le bêta d\'un actif',
  titreEn: 'An asset\'s beta',
  difficulte: 2,
  // Tirages (ordre strict) : 1. rho = randFloat(0.4, 0.9, 1) · 2. volMarche =
  // randInt(14, 20) · 3. volActif = randInt(volMarche, min(40, 2 × volMarche))
  // (bornes calculées : le ratio σa/σm reste dans [1, 2], donc β dans
  // ~[0,4, 1,8] — réaliste, jamais dégénéré).
  // Réponse = betaActif — l'ancre du ch2 : (0,8, 25, 15) = 1,333333. LE piège
  // du moule (ρ oublié) est recalculé via la MÊME fonction à ρ = 1 ; le faux
  // « ratio inversé » via betaActif(ρ, σm, σa).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const rho = randFloat(rng, 0.4, 0.9, 1);
    const volMarche = randInt(rng, 14, 20);
    const volActif = randInt(rng, volMarche, Math.min(40, 2 * volMarche));

    const reponse = r2(betaActif(rho, volActif, volMarche));
    const fauxSansRho = r2(betaActif(1, volActif, volMarche));
    const fauxInverse = r2(betaActif(rho, volMarche, volActif));
    const amplifie = reponse > 1;

    const en = langue === 'en';
    const { f, pct } = formatters(langue);
    return {
      enonce: en
        ? `A stock has an annual volatility of ${pct(volActif, 0)}; the market's volatility is ${pct(volMarche, 0)}, and the correlation between the stock and the market is ${f(rho, 1)}.\n\n**What is the stock's beta?**`
        : `Une action affiche une volatilité annuelle de ${pct(volActif, 0)} ; celle du marché vaut ${pct(volMarche, 0)}, et la corrélation entre l'action et le marché est de ${f(rho, 1)}.\n\n**Quel est le bêta de l'action ?**`,
      reponse,
      tolerance: 0.02,
      toleranceMode: 'absolu',
      etapes: [
        {
          titre: en ? 'Two ingredients, not one' : 'Deux ingrédients, pas un',
          contenu: en
            ? `$\\beta = \\rho × \\dfrac{\\sigma_{\\text{asset}}}{\\sigma_{\\text{market}}} = ${f(rho, 1)} × \\dfrac{${f(volActif, 0)}}{${f(volMarche, 0)}}$ = **${f(reponse, 2)}**. Chapter 2's anchor: 0.8 × 25/15 = 1.333333. Read the formula slowly: the beta mixes the CORRELATION with the market AND the relative volatility — both ingredients count, and each trap of this exercise consists of dropping one.`
            : `$\\beta = \\rho × \\dfrac{\\sigma_{\\text{actif}}}{\\sigma_{\\text{marché}}} = ${f(rho, 1)} × \\dfrac{${f(volActif, 0)}}{${f(volMarche, 0)}}$ = **${f(reponse, 2)}**. L'ancre du chapitre 2 : 0,8 × 25/15 = 1,333333. Lisez la formule lentement : le bêta mêle la CORRÉLATION avec le marché ET la volatilité relative — les deux ingrédients comptent, et chaque piège de cet exercice consiste à en laisser tomber un.`,
        },
        {
          titre: en ? 'What the number says' : 'Ce que le chiffre dit',
          contenu: en
            ? `A beta of ${f(reponse, 2)} means the stock ${amplifie ? `amplifies market moves — when the market does +1%, it tends to do +${f(reponse, 2)}%` : `dampens market moves — when the market does +1%, it tends to do +${f(reponse, 2)}%`}. That is the desk's daily language: "high beta" funds that amplify bull phases, "defensive" low-beta books that cushion the falls — and the hedging arithmetic of module 7, where a book is exposed for value × β, not for its face value.`
            : `Un bêta de ${f(reponse, 2)} signifie que l'action ${amplifie ? `amplifie les mouvements du marché — quand il fait +1 %, elle tend à faire +${f(reponse, 2)} %` : `amortit les mouvements du marché — quand il fait +1 %, elle tend à faire +${f(reponse, 2)} %`}. C'est le langage quotidien du desk : les fonds « high beta » qui amplifient les phases haussières, les books défensifs « low beta » qui amortissent les baisses — et l'arithmétique de couverture du module 7, où un book s'expose pour valeur × β, pas pour sa valeur faciale.`,
        },
        {
          titre: en ? 'Beta is NOT volatility' : 'Le bêta n\'est PAS la volatilité',
          contenu: en
            ? `The oral classic: "must a 40%-volatility asset return more than a 15% one?" CAPM answer: it depends ONLY on their betas. A very volatile but DEcorrelated asset (ρ ≈ 0) has a tiny beta: its risk, however huge, is diversifiable — hence free in the market's eyes. Volatility measures TOTAL risk; beta keeps only the systematic share, the only one a diversified holder actually suffers. You are not paid for the risk you take, but for the risk you cannot eliminate.`
            : `Le classique d'oral : « un actif à 40 % de volatilité doit-il rapporter plus qu'un actif à 15 % ? » Réponse CAPM : cela dépend UNIQUEMENT de leurs bêtas. Un actif très volatil mais DÉcorrélé (ρ ≈ 0) a un bêta minuscule : son risque, aussi énorme soit-il, est diversifiable — donc gratuit aux yeux du marché. La volatilité mesure le risque TOTAL ; le bêta ne retient que la part systématique, la seule qu'un porteur diversifié subit vraiment. On n'est pas payé pour le risque que l'on prend, mais pour celui qu'on ne peut pas éliminer.`,
        },
      ],
      pieges: [
        en
          ? `THE trap — forgetting ρ: ${f(volActif, 0)}/${f(volMarche, 0)} = ${f(fauxSansRho, 2)} instead of ${f(reponse, 2)}. That is the ρ = 1 beta: it assumes the stock moves in lockstep with the market. Only the correlated share of the volatility is systematic — the rest diversifies away.`
          : `LE piège — oublier ρ : ${f(volActif, 0)}/${f(volMarche, 0)} = ${f(fauxSansRho, 2)} au lieu de ${f(reponse, 2)}. C'est le bêta du cas ρ = 1 : il suppose l'action au pas cadencé avec le marché. Seule la part corrélée de la volatilité est systématique — le reste se diversifie.`,
        en
          ? `Inverting the ratio: ${f(rho, 1)} × ${f(volMarche, 0)}/${f(volActif, 0)} = ${f(fauxInverse, 2)}. The asset's volatility goes on TOP: a stock twice as volatile as the market, fully correlated, amplifies it by two — the beta must grow with σ_asset. Sanity-check the direction before writing the fraction.`
          : `Inverser le ratio : ${f(rho, 1)} × ${f(volMarche, 0)}/${f(volActif, 0)} = ${f(fauxInverse, 2)}. La volatilité de l'ACTIF va au numérateur : une action deux fois plus volatile que le marché, parfaitement corrélée, l'amplifie par deux — le bêta doit grandir avec σ_actif. Vérifiez le sens avant d'écrire la fraction.`,
        en
          ? `Answering ρ alone (${f(rho, 1)}): the correlation says how faithfully the stock follows the market, not by how MUCH it moves. Beta is a slope, not a resemblance score.`
          : `Répondre ρ tout court (${f(rho, 1)}) : la corrélation dit avec quelle fidélité l'action suit le marché, pas de COMBIEN elle bouge. Le bêta est une pente, pas un score de ressemblance.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 6. L'alpha de Jensen : le talent net du bêta (N2)
// ---------------------------------------------------------------------------
export const genAlphaJensen: ExerciseGenerator = {
  id: 'm12-ex-06',
  moduleId: M12,
  titre: 'L\'alpha de Jensen',
  titreEn: 'Jensen\'s alpha',
  difficulte: 2,
  // Tirages (ordre strict) : 1. rPortefeuille = randFloat(6, 16, 1) · 2. rf =
  // randFloat(1, 4, 1) · 3. beta = randFloat(0.8, 1.6, 1) · 4. rMarche =
  // randFloat(5, 12, 1) (toujours > rf : la prime réalisée reste positive).
  // Réponse = alphaJensen, SIGNÉE — l'ancre du ch3 : (12, 3, 1,2, 10) =
  // +0,6 %. L'exigence CAPM est chaînée via rendementCapm(rf, β, r_m − r_f).
  // LE piège du moule (le talent lu brut, r − r_m) et le faux « bêta oublié »
  // (alphaJensen à β = 1) sont recalculés. Selon le tirage, l'alpha est
  // positif ou négatif — c'est voulu, le verdict se tranche dans le corrigé.
  // Tolérance ABSOLUE 0,05 : l'alpha peut passer près de zéro.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const rPortefeuille = randFloat(rng, 6, 16, 1);
    const rf = randFloat(rng, 1, 4, 1);
    const beta = randFloat(rng, 0.8, 1.6, 1);
    const rMarche = randFloat(rng, 5, 12, 1);

    const prime = r2(rMarche - rf);
    const exige = r2(rendementCapm(rf, beta, prime));
    const reponse = r2(alphaJensen(rPortefeuille, rf, beta, rMarche));
    const fauxBrut = r2(rPortefeuille - rMarche);
    const fauxSansBeta = r2(alphaJensen(rPortefeuille, rf, 1, rMarche));
    const bat = reponse > 0;

    const en = langue === 'en';
    const { f, pct, sgn } = formatters(langue);
    return {
      enonce: en
        ? `Your manager posted ${sgn(rPortefeuille, 1)}% over the year, with a beta of ${f(beta, 1)}. The market returned ${pct(rMarche, 1)} and cash paid ${pct(rf, 1)}.\n\n**What is the manager's Jensen alpha, in % (sign included)?**`
        : `Votre gérant affiche ${sgn(rPortefeuille, 1)} % sur l'année, avec un bêta de ${f(beta, 1)}. Le marché a rendu ${pct(rMarche, 1)} et le cash ${pct(rf, 1)}.\n\n**Quel est l'alpha de Jensen du gérant, en % (signe compris) ?**`,
      reponse,
      tolerance: 0.05,
      toleranceMode: 'absolu',
      unite: '%',
      etapes: [
        {
          titre: en ? 'First, what the CAPM demanded' : 'D\'abord, ce que le CAPM exigeait',
          contenu: en
            ? `The realised market premium: $r_m - r_f = ${f(rMarche, 1)}\\,\\% - ${f(rf, 1)}\\,\\%$ = **${pct(prime, 2)}**. Required return for a beta of ${f(beta, 1)} (exercise 2's machinery): $r_f + \\beta(r_m - r_f) = ${f(rf, 1)}\\,\\% + ${f(beta, 1)} × ${f(prime, 2)}\\,\\%$ = **${pct(exige, 2)}**. That is what an ETF levered to the same beta would have delivered for almost nothing.`
            : `La prime de marché réalisée : $r_m - r_f = ${f(rMarche, 1)}\\,\\% - ${f(rf, 1)}\\,\\%$ = **${pct(prime, 2)}**. Rendement exigé pour un bêta de ${f(beta, 1)} (la machinerie de l'exercice 2) : $r_f + \\beta(r_m - r_f) = ${f(rf, 1)}\\,\\% + ${f(beta, 1)} × ${f(prime, 2)}\\,\\%$ = **${pct(exige, 2)}**. C'est ce qu'un ETF amené au même bêta aurait livré pour presque rien.`,
        },
        {
          titre: en ? 'The alpha: what is left' : 'L\'alpha : ce qui reste',
          contenu: en
            ? `$\\alpha = r - [r_f + \\beta(r_m - r_f)] = ${f(rPortefeuille, 1)}\\,\\% - ${f(exige, 2)}\\,\\%$ = **${sgn(reponse, 2)}%**. Chapter 3's anchor: +12% at beta 1.2, market +10%, cash 3% ⇒ required 11.4%, alpha +0.6%. The alpha is what remains once the beta has been paid at the CAPM tariff — the most expensive and rarest commodity of the buy-side.`
            : `$\\alpha = r - [r_f + \\beta(r_m - r_f)] = ${f(rPortefeuille, 1)}\\,\\% - ${f(exige, 2)}\\,\\%$ = **${sgn(reponse, 2)} %**. L'ancre du chapitre 3 : +12 % à bêta 1,2, marché +10 %, cash 3 % ⇒ exigé 11,4 %, alpha +0,6 %. L'alpha est ce qui reste une fois le bêta payé au tarif CAPM — la denrée la plus chère et la plus rare du buy-side.`,
        },
        {
          titre: en ? 'The verdict' : 'Le verdict',
          contenu: en
            ? bat
              ? `Alpha ${sgn(reponse, 2)}%: the manager beat HIS OWN risk, not just the market. The naive reading "he did ${sgn(fauxBrut, 1)} points versus the market" confuses amplification bought (the beta of ${f(beta, 1)}) with selection made — the alpha isolates the second. Before celebrating, the chapter 3 checklist still applies: net of fees? over an imposed window? net of survivorship?`
              : `Alpha ${sgn(reponse, 2)}%: the manager destroyed value against his own risk — the CAPM demanded ${pct(exige, 2)} for a beta of ${f(beta, 1)}, and ${pct(rPortefeuille, 1)} fell short${fauxBrut > 0 ? `, even though the raw gap to the market (${sgn(fauxBrut, 1)} points) looked flattering: that gap was amplification bought, not talent` : ''}. A fund at beta 1 that merely matches the market has zero alpha — an ETF would have done it for three basis points.`
            : bat
              ? `Alpha ${sgn(reponse, 2)} % : le gérant a battu SON risque, pas seulement le marché. La lecture naïve « il a fait ${sgn(fauxBrut, 1)} points contre le marché » confond l'amplification achetée (le bêta de ${f(beta, 1)}) avec la sélection réalisée — l'alpha isole la seconde. Avant de féliciter, la checklist du chapitre 3 s'applique encore : net de frais ? sur fenêtre imposée ? net du biais du survivant ?`
              : `Alpha ${sgn(reponse, 2)} % : le gérant a détruit de la valeur contre son propre risque — le CAPM exigeait ${pct(exige, 2)} pour un bêta de ${f(beta, 1)}, et ${pct(rPortefeuille, 1)} n'y suffit pas${fauxBrut > 0 ? `, même si l'écart brut au marché (${sgn(fauxBrut, 1)} points) semblait flatteur : cet écart était de l'amplification achetée, pas du talent` : ''}. Un fonds à bêta 1 qui fait exactement le marché n'a aucun alpha — un ETF l'aurait fait pour trois points de base.`,
        },
      ],
      pieges: [
        en
          ? `THE trap — reading the talent raw: ${f(rPortefeuille, 1)} − ${f(rMarche, 1)} = ${sgn(fauxBrut, 1)} points "versus the market" instead of α = ${sgn(reponse, 2)}%. A beta of ${f(beta, 1)} is amplification BOUGHT, not fabricated: on a rising market a riskier portfolio MUST beat the index — that is risk pay, not selection.`
          : `LE piège — lire le talent brut : ${f(rPortefeuille, 1)} − ${f(rMarche, 1)} = ${sgn(fauxBrut, 1)} points « contre le marché » au lieu de α = ${sgn(reponse, 2)} %. Un bêta de ${f(beta, 1)} est une amplification ACHETÉE, pas fabriquée : sur un marché haussier, un portefeuille plus risqué DOIT battre l'indice — c'est de la rémunération du risque, pas de la sélection.`,
        en
          ? `Forgetting the beta in the benchmark: computing the alpha against $r_f + (r_m - r_f)$ — i.e. β = 1 — gives ${sgn(fauxSansBeta, 2)}% instead of ${sgn(reponse, 2)}%. The étalon must carry the SAME beta as the portfolio, otherwise you compare a levered book to an unlevered index.`
          : `Oublier le bêta dans l'étalon : calculer l'alpha contre $r_f + (r_m - r_f)$ — c'est-à-dire β = 1 — donne ${sgn(fauxSansBeta, 2)} % au lieu de ${sgn(reponse, 2)} %. L'étalon doit porter le MÊME bêta que le portefeuille, sinon on compare un book leveragé à un indice qui ne l'est pas.`,
        en
          ? `Judging on one year: a single realisation of a noisy process. An alpha only means something measured net of fees, on an imposed window, and persistent — chapter 4's arithmetic (Sharpe 1991) guarantees the AVERAGE manager's alpha is negative after fees.`
          : `Juger sur un an : une seule réalisation d'un processus bruité. Un alpha ne veut dire quelque chose que net de frais, sur fenêtre imposée, et persistant — l'arithmétique du chapitre 4 (Sharpe 1991) garantit que l'alpha du gérant MOYEN est négatif après frais.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 7. Le ratio d'information : la liberté rentabilisée (N2)
// ---------------------------------------------------------------------------
export const genRatioInformation: ExerciseGenerator = {
  id: 'm12-ex-07',
  moduleId: M12,
  titre: 'Le ratio d\'information',
  titreEn: 'The information ratio',
  difficulte: 2,
  // Tirages (ordre strict) : 1. rBenchmark = randFloat(4, 10, 1) · 2. surperf
  // = randFloat(0.4, 3, 1) · 3. trackingError = randFloat(2, 6, 1) · 4.
  // volTotale = randInt(8, 18) (donnée-leurre pour LE piège : diviser par la
  // volatilité totale au lieu de la TE).
  // Réponse = ratioInformation(surperf, TE) — l'ancre du ch3 : (2, 4) = 0,5,
  // et > 0,5 maintenu dans la durée est déjà très bon. Les faux (division
  // par la vol totale via la même fonction ; rendement entier divisé par la
  // TE) sont recalculés. Tolérance ABSOLUE 0,02 : un ratio à deux décimales.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const rBenchmark = randFloat(rng, 4, 10, 1);
    const surperf = randFloat(rng, 0.4, 3, 1);
    const trackingError = randFloat(rng, 2, 6, 1);
    const volTotale = randInt(rng, 8, 18);

    const rPortefeuille = r2(rBenchmark + surperf);
    const reponse = r2(ratioInformation(surperf, trackingError));
    const fauxVolTotale = r2(ratioInformation(surperf, volTotale));
    const fauxRendementEntier = r2(ratioInformation(rPortefeuille, trackingError));
    const tresBon = reponse > 0.5;

    const en = langue === 'en';
    const { f, pct } = formatters(langue);
    return {
      enonce: en
        ? `An active manager returned ${pct(rPortefeuille, 1)} over the year against ${pct(rBenchmark, 1)} for the benchmark. The portfolio's tracking error is ${pct(trackingError, 1)} and its total volatility ${pct(volTotale, 0)}.\n\n**What is the manager's information ratio?**`
        : `Un gérant actif a rendu ${pct(rPortefeuille, 1)} sur l'année contre ${pct(rBenchmark, 1)} pour le benchmark. La tracking error du portefeuille vaut ${pct(trackingError, 1)} et sa volatilité totale ${pct(volTotale, 0)}.\n\n**Quel est le ratio d'information du gérant ?**`,
      reponse,
      tolerance: 0.02,
      toleranceMode: 'absolu',
      etapes: [
        {
          titre: en ? 'The outperformance' : 'La surperformance',
          contenu: en
            ? `$r_p - r_b = ${f(rPortefeuille, 1)}\\,\\% - ${f(rBenchmark, 1)}\\,\\%$ = **${pct(surperf, 2)}**. The mandate's étalon is the BENCHMARK, not cash: the client can buy the index for three basis points, so only the gap to it counts as the manager's production.`
            : `$r_p - r_b = ${f(rPortefeuille, 1)}\\,\\% - ${f(rBenchmark, 1)}\\,\\%$ = **${pct(surperf, 2)}**. L'étalon du mandat est le BENCHMARK, pas le cash : le client peut acheter l'indice pour trois points de base, donc seul l'écart à l'indice compte comme production du gérant.`,
        },
        {
          titre: en ? 'Divide by the risk TAKEN AGAINST the benchmark' : 'Diviser par le risque pris CONTRE le benchmark',
          contenu: en
            ? `$IR = \\dfrac{\\text{outperformance}}{\\text{tracking error}} = \\dfrac{${f(surperf, 2)}}{${f(trackingError, 1)}}$ = **${f(reponse, 2)}**. Chapter 3's anchor: 2% of outperformance on 4% of TE ⇒ 0.5. The IR is the active manager's Sharpe: same construction — an excess return divided by the risk taken to get it — but measured against the mandate rather than against cash.`
            : `$IR = \\dfrac{\\text{surperformance}}{\\text{tracking error}} = \\dfrac{${f(surperf, 2)}}{${f(trackingError, 1)}}$ = **${f(reponse, 2)}**. L'ancre du chapitre 3 : 2 % de surperformance pour 4 % de TE ⇒ 0,5. L'IR est le Sharpe du gérant actif : même construction — un excès de rendement divisé par le risque pris pour l'obtenir — mais mesuré contre le mandat plutôt que contre le cash.`,
        },
        {
          titre: en ? 'The TE is chosen, not suffered' : 'La TE se choisit, elle ne se subit pas',
          contenu: en
            ? `Your ${f(reponse, 2)} ${tresBon ? 'sits above 0.5 — very good if MAINTAINED over time; one year proves little' : 'sits below the 0.5 bar that marks a very good active manager over time'}. The deep point: unlike market volatility, the tracking error is a BUDGET — the leash of freedom the mandate grants (an index fund lives under 0.5% of TE, a classic active manager between 2 and 6%). The IR judges the use of that budget: how much benchmark-beating each unit of granted freedom actually produced.`
            : `Votre ${f(reponse, 2)} ${tresBon ? 'dépasse 0,5 — très bon s\'il est MAINTENU dans la durée ; une année seule prouve peu' : 'reste sous la barre de 0,5 qui signale un très bon gérant actif dans la durée'}. Le point profond : contrairement à la volatilité du marché, la tracking error est un BUDGET — la laisse de liberté que le mandat accorde (un fonds indiciel vit sous 0,5 % de TE, un gérant actif classique entre 2 et 6 %). L'IR juge l'usage de ce budget : combien chaque unité de liberté accordée a réellement produit d'écart gagnant au benchmark.`,
        },
      ],
      pieges: [
        en
          ? `Dividing by the TOTAL volatility: ${f(surperf, 2)}/${f(volTotale, 0)} = ${f(fauxVolTotale, 2)} instead of ${f(reponse, 2)}. The total volatility mostly belongs to the benchmark itself — the client accepted it when signing the mandate. The IR's denominator is the volatility of the GAP (r_p − r_b): the risk the manager added on his own.`
          : `Diviser par la volatilité TOTALE : ${f(surperf, 2)}/${f(volTotale, 0)} = ${f(fauxVolTotale, 2)} au lieu de ${f(reponse, 2)}. La volatilité totale appartient surtout au benchmark lui-même — le client l'a acceptée en signant le mandat. Le dénominateur de l'IR est la volatilité de l'ÉCART (r_p − r_b) : le risque que le gérant a ajouté de son propre chef.`,
        en
          ? `Putting the WHOLE return on top: ${f(rPortefeuille, 1)}/${f(trackingError, 1)} = ${f(fauxRendementEntier, 2)} — absurdly flattering. The benchmark's ${pct(rBenchmark, 1)} was available for free; only the ${pct(surperf, 2)} above it is the manager's production.`
          : `Mettre le rendement ENTIER au numérateur : ${f(rPortefeuille, 1)}/${f(trackingError, 1)} = ${f(fauxRendementEntier, 2)} — absurdement flatteur. Les ${pct(rBenchmark, 1)} du benchmark étaient disponibles gratuitement ; seuls les ${pct(surperf, 2)} au-dessus sont la production du gérant.`,
        en
          ? `Confusing the IR with the Sharpe in front of a client: the Sharpe answers "was leaving cash worth it?", the IR answers "was the freedom granted by the mandate worth paying for?". Same skeleton, different étalon — quoting one for the other is a classic oral slip.`
          : `Confondre l'IR et le Sharpe devant un client : le Sharpe répond « quitter le cash valait-il la peine ? », l'IR répond « la liberté accordée par le mandat valait-elle d'être payée ? ». Même squelette, étalon différent — citer l'un pour l'autre est un lapsus d'oral classique.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 8. La VaR paramétrique à 1 jour (N2)
// ---------------------------------------------------------------------------
export const genVarParametrique: ExerciseGenerator = {
  id: 'm12-ex-08',
  moduleId: M12,
  titre: 'La VaR paramétrique à 1 jour',
  titreEn: 'One-day parametric VaR',
  difficulte: 2,
  // Tirages (ordre strict) : 1. valeur = pick([20, 50, 100, 200, 500]) (M€) ·
  // 2. vol = randInt(10, 35) · 3. niveau = pick([95, 99]).
  // z est DÉRIVÉ du niveau (1,65 ou 2,33 — les arrondis d'usage du ch5),
  // pas tiré. Réponse = varParametrique(V, σ, z, 1) — l'ancre du ch5 :
  // (100, 20, 1,65, 1 j) = 2,078805 M. Les faux (√(1/252) oublié = la VaR
  // ANNUELLE, obtenue via la même fonction à h = 252 ; mauvais z) sont
  // recalculés via varParametrique.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const valeur = pick(rng, [20, 50, 100, 200, 500] as const);
    const vol = randInt(rng, 10, 35);
    const niveau = pick(rng, [95, 99] as const);

    const z = niveau === 95 ? 1.65 : 2.33;
    const zAutre = niveau === 95 ? 2.33 : 1.65;
    const reponse = r2(varParametrique(valeur, vol, z, 1));
    const fauxAnnuel = r2(varParametrique(valeur, vol, z, 252));
    const fauxZ = r2(varParametrique(valeur, vol, zAutre, 1));
    const est95 = niveau === 95;

    const en = langue === 'en';
    const { f, pct, meur } = formatters(langue);
    return {
      enonce: en
        ? `Your desk runs a portfolio of ${meur(valeur)} with an annual volatility of ${pct(vol, 0)}. Usual normal quantiles: z = 1.65 (95%) and z = 2.33 (99%); trading year of 252 days.\n\n**What is the one-day parametric VaR at ${pct(niveau, 0)} confidence, in millions of euros?**`
        : `Votre desk porte un portefeuille de ${meur(valeur)} avec une volatilité annuelle de ${pct(vol, 0)}. Quantiles d'usage de la normale : z = 1,65 (95 %) et z = 2,33 (99 %) ; année de 252 jours de bourse.\n\n**Quelle est la VaR paramétrique à 1 jour au seuil de ${pct(niveau, 0)}, en millions d'euros ?**`,
      reponse,
      tolerance: 0.005,
      unite: en ? '€m' : 'M€',
      etapes: [
        {
          titre: en ? 'Pick the right z' : 'Choisir le bon z',
          contenu: en
            ? `${pct(niveau, 0)} confidence ⇒ $z = ${f(z, 2)}$ — the usual rounding of the normal quantile (module 2). The choice of threshold is a MANAGEMENT decision, not a hidden constant: 95% tolerates a breach about one trading day in twenty, 99% about two or three days a year. The z is the price of that tolerance.`
            : `Seuil de ${pct(niveau, 0)} ⇒ $z = ${f(z, 2)}$ — l'arrondi d'usage du quantile de la normale (module 2). Le choix du seuil est une décision de GESTION, pas une constante cachée : 95 % tolère un dépassement environ un jour de bourse sur vingt, 99 % environ deux ou trois jours par an. Le z est le prix de cette tolérance.`,
        },
        {
          titre: en ? 'Scale the year down to one day' : 'Ramener l\'année à un jour',
          contenu: en
            ? `$\\text{VaR} = V × z × \\sigma_{\\text{annual}} × \\sqrt{1/252} = ${f(valeur, 0)} × ${f(z, 2)} × ${f(vol, 0)}\\,\\% × \\sqrt{1/252}$ = **${meur(reponse, 2)}**. The $\\sqrt{1/252}$ (≈ 0.063) converts the annual volatility into a daily one — the same square-root-of-time logic as exercise 9, run downwards. Chapter 5's anchor: 100 M, 20%, 95% ⇒ 2.078805 M.`
            : `$\\text{VaR} = V × z × \\sigma_{\\text{annuelle}} × \\sqrt{1/252} = ${f(valeur, 0)} × ${f(z, 2)} × ${f(vol, 0)}\\,\\% × \\sqrt{1/252}$ = **${meur(reponse, 2)}**. Le $\\sqrt{1/252}$ (≈ 0,063) convertit la volatilité annuelle en volatilité journalière — la même logique de racine du temps que l'exercice 9, prise vers le bas. L'ancre du chapitre 5 : 100 M, 20 %, 95 % ⇒ 2,078805 M.`,
        },
        {
          titre: en ? 'Read it — and read what it does NOT say' : 'La lire — et lire ce qu\'elle ne dit PAS',
          contenu: en
            ? `Reading: "we should not lose more than ${meur(reponse, 2)} in one day, ${est95 ? '19 days out of 20' : '99 days out of 100'}". The VaR is a THRESHOLD, never a maximum loss: it says where the tail begins, not what lives inside it — on the breach day the loss can be ${meur(r2(reponse * 1.1), 1)} or twenty times that, the number is mute by construction. LTCM had an impeccable VaR; it is the size of the tail that killed it. Hence the expected shortfall (the average loss BEYOND the VaR) and the stress tests of exercise 10.`
            : `Lecture : « on ne devrait pas perdre plus de ${meur(reponse, 2)} en un jour, ${est95 ? '19 jours sur 20' : '99 jours sur 100'} ». La VaR est un SEUIL, jamais une perte maximale : elle dit où commence la queue, pas ce qu'il y a dedans — le jour du dépassement, la perte peut être de ${meur(r2(reponse * 1.1), 1)} ou de vingt fois plus, le chiffre est muet par construction. LTCM avait une VaR impeccable ; c'est la taille de la queue qui l'a tué. D'où l'expected shortfall (la moyenne des pertes AU-DELÀ de la VaR) et les stress tests de l'exercice 10.`,
        },
      ],
      pieges: [
        en
          ? `Skipping the $\\sqrt{1/252}$: ${f(valeur, 0)} × ${f(z, 2)} × ${f(vol, 0)}% = ${meur(fauxAnnuel, 2)} — that is the ANNUAL VaR, about 16 times too big for one day. The volatility you were given is annual; the horizon is one day: the conversion is not optional.`
          : `Sauter le $\\sqrt{1/252}$ : ${f(valeur, 0)} × ${f(z, 2)} × ${f(vol, 0)} % = ${meur(fauxAnnuel, 2)} — c'est la VaR ANNUELLE, environ 16 fois trop grosse pour un jour. La volatilité fournie est annuelle ; l'horizon est un jour : la conversion n'est pas optionnelle.`,
        en
          ? `Taking the wrong quantile: z = ${f(zAutre, 2)} gives ${meur(fauxZ, 2)} instead of ${meur(reponse, 2)}. 1.65 goes with 95%, 2.33 with 99% — mixing them up shifts the risk budget by a third and, on a desk, the capital with it.`
          : `Prendre le mauvais quantile : z = ${f(zAutre, 2)} donne ${meur(fauxZ, 2)} au lieu de ${meur(reponse, 2)}. 1,65 va avec 95 %, 2,33 avec 99 % — les confondre décale le budget de risque d'un tiers et, sur un desk, le capital avec.`,
        en
          ? `Reading the VaR as a maximum loss, or its breach as a model failure: at 95%, being exceeded about once in twenty trading days is PLANNED — a VaR never exceeded is a model that over-consumes capital. What backtesting watches is the frequency of breaches, not their absence.`
          : `Lire la VaR comme une perte maximale, ou son dépassement comme une panne du modèle : à 95 %, être dépassé environ un jour de bourse sur vingt est PRÉVU — une VaR jamais dépassée est un modèle qui surconsomme du capital. Ce que le backtesting surveille, c'est la fréquence des dépassements, pas leur absence.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 9. La VaR à horizon : la racine du temps (N2)
// ---------------------------------------------------------------------------
export const genVarHorizon: ExerciseGenerator = {
  id: 'm12-ex-09',
  moduleId: M12,
  titre: 'La VaR à horizon : la racine du temps',
  titreEn: 'VaR at horizon: the square root of time',
  difficulte: 2,
  // Tirages (ordre strict) : 1. varUnJour = randFloat(0.8, 5, 1) (M€) ·
  // 2. horizon = pick([5, 10, 20]) (jours).
  // Réponse = varHorizon — l'ancre du ch5 : (2, 10) = 6,324555 M, la
  // convention réglementaire historique de Bâle (VaR 10 j = 1 j × √10).
  // LE piège du moule (multiplier par h) est recalculé dans le corrigé.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const varUnJour = randFloat(rng, 0.8, 5, 1);
    const horizon = pick(rng, [5, 10, 20] as const);

    const reponse = r2(varHorizon(varUnJour, horizon));
    const fauxLineaire = r2(varUnJour * horizon);
    const racine = r2(Math.sqrt(horizon));

    const en = langue === 'en';
    const { f, meur } = formatters(langue);
    return {
      enonce: en
        ? `Your desk's one-day VaR is ${meur(varUnJour, 1)}. The risk committee asks for the ${f(horizon, 0)}-day figure, under the standard square-root-of-time rule.\n\n**What is the ${f(horizon, 0)}-day VaR, in millions of euros?**`
        : `La VaR 1 jour de votre desk vaut ${meur(varUnJour, 1)}. Le comité des risques demande le chiffre à ${f(horizon, 0)} jours, par la règle standard de la racine du temps.\n\n**Quelle est la VaR à ${f(horizon, 0)} jours, en millions d'euros ?**`,
      reponse,
      tolerance: 0.005,
      unite: en ? '€m' : 'M€',
      etapes: [
        {
          titre: en ? 'Why a root and not a product' : 'Pourquoi une racine et pas un produit',
          contenu: en
            ? `Under i.i.d. returns, VARIANCES add across days — so the standard deviation, and the VaR with it, grows like $\\sqrt{h}$, not like $h$. Losses do not pile up in a straight line: good days partly offset bad ones, and the dispersion of the h-day total only widens with the square root.`
            : `Sous des rendements i.i.d., ce sont les VARIANCES qui s'additionnent d'un jour à l'autre — donc l'écart-type, et la VaR avec lui, croît comme $\\sqrt{h}$, pas comme $h$. Les pertes ne s'empilent pas en ligne droite : les bons jours compensent en partie les mauvais, et la dispersion du total sur h jours ne s'élargit qu'en racine.`,
        },
        {
          titre: en ? 'Scale up' : 'Changer d\'échelle',
          contenu: en
            ? `$\\text{VaR}_{${f(horizon, 0)}\\text{d}} = \\text{VaR}_{1\\text{d}} × \\sqrt{${f(horizon, 0)}} = ${f(varUnJour, 1)} × ${f(racine, 2)}$ = **${meur(reponse, 2)}**. Chapter 5's anchor: a €2m daily VaR gives 2 × √10 = 6.324555 over 10 days — not 20. The 10-day horizon at √10 was Basel's historical convention for the trading book.`
            : `$\\text{VaR}_{${f(horizon, 0)}\\text{j}} = \\text{VaR}_{1\\text{j}} × \\sqrt{${f(horizon, 0)}} = ${f(varUnJour, 1)} × ${f(racine, 2)}$ = **${meur(reponse, 2)}**. L'ancre du chapitre 5 : une VaR de 2 M€ par jour donne 2 × √10 = 6,324555 sur 10 jours — pas 20. L'horizon 10 jours en √10 fut la convention réglementaire historique de Bâle pour le trading book.`,
        },
        {
          titre: en ? 'An optimistic ceiling' : 'Un plafond optimiste',
          contenu: en
            ? `The i.i.d. hypothesis breaks exactly when you need it: in a crisis, losses do not flip a coin each morning — they CHAIN (forced sales, margin calls, the spirals of module 11), and that autocorrelation makes the true multi-day VaR HIGHER than the square-root figure. Keep the rule as a convenient floor in calm weather, an optimistic ceiling in a storm — FRTB drew the consequence with liquidity horizons of up to 120 days for exotic credit, ending the uniform √10.`
            : `L'hypothèse i.i.d. casse exactement quand on en a besoin : en crise, les pertes ne tirent pas à pile ou face chaque matin — elles S'ENCHAÎNENT (ventes forcées, appels de marge, les spirales du module 11), et cette autocorrélation rend la vraie VaR multi-jours SUPÉRIEURE à la racine du temps. Retenez la règle comme un plancher commode par temps calme, un plafond optimiste par gros temps — FRTB en a tiré la conséquence avec des horizons de liquidité jusqu'à 120 jours pour le crédit exotique, fin du √10 uniforme.`,
        },
      ],
      pieges: [
        en
          ? `THE trap — multiplying by the horizon: ${f(varUnJour, 1)} × ${f(horizon, 0)} = ${meur(fauxLineaire, 2)} instead of ${meur(reponse, 2)}. That adds the worst case of every single day, as if the same ${f(horizon, 0)}-sigma day repeated itself: standard deviations do not add, variances do.`
          : `LE piège — multiplier par l'horizon : ${f(varUnJour, 1)} × ${f(horizon, 0)} = ${meur(fauxLineaire, 2)} au lieu de ${meur(reponse, 2)}. C'est additionner le pire cas de chaque jour, comme si le même jour extrême se répétait ${f(horizon, 0)} fois : les écarts-types ne s'additionnent pas, les variances si.`,
        en
          ? `Trusting the root in a crisis: the rule UNDERSTATES multi-day risk precisely when losses autocorrelate. Quoting ${meur(reponse, 2)} to a risk committee without the caveat "under i.i.d., a calm-weather figure" is quoting a number stripped of its hypothesis.`
          : `Croire la racine en crise : la règle SOUS-ESTIME le risque multi-jours précisément quand les pertes s'autocorrèlent. Citer ${meur(reponse, 2)} à un comité des risques sans la réserve « sous i.i.d., un chiffre de temps calme », c'est citer un nombre amputé de son hypothèse.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 10. La perte d'un stress test (N2)
// ---------------------------------------------------------------------------
export const genPerteStress: ExerciseGenerator = {
  id: 'm12-ex-10',
  moduleId: M12,
  titre: 'La perte d\'un stress test',
  titreEn: 'Stress-test loss',
  difficulte: 2,
  // Tirages (ordre strict) : 1. valeur = pick([50, 100, 150, 200, 300, 500])
  // (M€) · 2. choc = pick([−15, −20, −25, −30, −40]) · 3. beta =
  // randFloat(0.6, 1.6, 1) · 4. habillage = pick(['comite', 'mandat',
  // 'reverse']).
  // Réponse = perteStressMillions, SIGNÉE — l'ancre du ch5 : (100, −20, 1,2)
  // = −24 M. LE piège du moule (le bêta oublié) est recalculé via la MÊME
  // fonction à β = 1.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const valeur = pick(rng, [50, 100, 150, 200, 300, 500] as const);
    const choc = pick(rng, [-15, -20, -25, -30, -40] as const);
    const beta = randFloat(rng, 0.6, 1.6, 1);
    const habillage = pick(rng, ['comite', 'mandat', 'reverse'] as const);

    const reponse = r2(perteStressMillions(valeur, choc, beta));
    const fauxSansBeta = r2(perteStressMillions(valeur, choc, 1));
    const amplifie = beta > 1;

    const en = langue === 'en';
    const { f, pct, sgn, meur } = formatters(langue);
    const contexteFr = {
      comite: 'Votre comité des risques applique un scénario hypothétique',
      mandat: 'Le client institutionnel de votre mandat exige un stress test',
      reverse: 'Dans sa revue annuelle, le directeur des risques fait tourner un scénario',
    } as const;
    const contexteEn = {
      comite: 'Your risk committee applies a hypothetical scenario',
      mandat: 'The institutional client of your mandate requires a stress test',
      reverse: 'In its annual review, the chief risk officer runs a scenario',
    } as const;
    return {
      enonce: en
        ? `${contexteEn[habillage]}: an equity market shock of ${pct(choc, 0)}. The portfolio is worth ${meur(valeur)} with a beta of ${f(beta, 1)}.\n\n**What loss does the stress test show, in millions of euros (sign included)?**`
        : `${contexteFr[habillage]} : un choc de ${pct(choc, 0)} sur le marché actions. Le portefeuille vaut ${meur(valeur)} avec un bêta de ${f(beta, 1)}.\n\n**Quelle perte le stress test affiche-t-il, en millions d'euros (signe compris) ?**`,
      reponse,
      tolerance: 0.005,
      unite: en ? '€m' : 'M€',
      etapes: [
        {
          titre: en ? 'No probability — a scenario' : 'Pas de probabilité — un scénario',
          contenu: en
            ? `The stress test gives up on "with what probability?" and asks the only question left when the laws have burned: "WHAT IF?". A ${pct(choc, 0)} market shock is posited, not forecast — historical (1987, 2008, March 2020: nobody can call them impossible, they happened) or hypothetical. No confidence interval will dress the answer.`
            : `Le stress test renonce à « avec quelle probabilité ? » et pose la seule question qui reste quand les lois ont brûlé : « ET SI ? ». Un choc de marché de ${pct(choc, 0)} se postule, il ne se prévoit pas — historique (1987, 2008, mars 2020 : personne ne peut les dire impossibles, ils ont eu lieu) ou hypothétique. Aucun intervalle de confiance n'habillera la réponse.`,
        },
        {
          titre: en ? 'The portfolio takes the shock times ITS beta' : 'Le portefeuille prend le choc fois SON bêta',
          contenu: en
            ? `$\\text{loss} = V × \\text{shock} × \\beta = ${f(valeur, 0)} × (${f(choc, 0)}\\,\\%) × ${f(beta, 1)}$ = **${sgn(reponse, 2)}${en ? ' €m' : ''}**. Chapter 5's anchor: €100m at beta 1.2 in a −20% market ⇒ −24 M€. The beta of ${f(beta, 1)} ${amplifie ? 'amplifies' : 'cushions'} the market's blow: the book is exposed for ${f(valeur, 0)} × ${f(beta, 1)} = ${meur(r2(valeur * beta))} equivalent-index, and THAT is what the shock strikes.`
            : `$\\text{perte} = V × \\text{choc} × \\beta = ${f(valeur, 0)} × (${f(choc, 0)}\\,\\%) × ${f(beta, 1)}$ = **${sgn(reponse, 2)} M€**. L'ancre du chapitre 5 : 100 M€ à bêta 1,2 dans un marché à −20 % ⇒ −24 M€. Le bêta de ${f(beta, 1)} ${amplifie ? 'amplifie' : 'amortit'} le coup du marché : le book est exposé pour ${f(valeur, 0)} × ${f(beta, 1)} = ${meur(r2(valeur * beta))} équivalent-indice, et c'est CELA que le choc frappe.`,
        },
        {
          titre: en ? 'The virtue is in the question' : 'La vertu est dans la question',
          contenu: en
            ? `One multiplication, deliberately crude — because the value is not in the figure's precision but in the conversation it forces: if the market drops ${pct(choc, 0)}, do we hold the margin call? Who sells what, in how long, on which market still open? The 1987 portfolio insurers and LTCM had refined models and had never asked the crude question. The stress test is the anti-VaR: zero probability, zero elegance, and precisely for that it looks where the VaR does not — beyond the threshold (exercise 8).`
            : `Une multiplication, volontairement fruste — parce que la valeur n'est pas dans la précision du chiffre mais dans la conversation qu'il force : si le marché fait ${pct(choc, 0)}, tenons-nous l'appel de marge ? Qui vend quoi, en combien de temps, sur quel marché encore ouvert ? L'assurance de portefeuille de 1987 et LTCM avaient des modèles raffinés et n'avaient jamais posé la question fruste. Le stress test est l'anti-VaR : zéro probabilité, zéro élégance, et précisément pour cela il regarde là où la VaR ne regarde pas — au-delà du seuil (exercice 8).`,
        },
      ],
      pieges: [
        en
          ? `THE trap — forgetting the beta: ${f(valeur, 0)} × ${f(choc, 0)}% = ${sgn(fauxSansBeta, 2)} instead of ${sgn(reponse, 2)}. That stresses a beta-1 portfolio; yours is exposed for ${f(beta, 1)} times the market. The whole point of running the scenario through the book is to apply the book's OWN sensitivity.`
          : `LE piège — oublier le bêta : ${f(valeur, 0)} × ${f(choc, 0)} % = ${sgn(fauxSansBeta, 2)} au lieu de ${sgn(reponse, 2)}. C'est stresser un portefeuille de bêta 1 ; le vôtre est exposé pour ${f(beta, 1)} fois le marché. Tout l'intérêt de passer le scénario dans le book est de lui appliquer SA sensibilité propre.`,
        en
          ? `Rendering a positive number: the question asks for a LOSS, signed. A stress test that prints ${sgn(Math.abs(reponse), 2)} on a ${pct(choc, 0)} shock has confused long and short — lock the sign before the arithmetic.`
          : `Rendre un nombre positif : la question demande une PERTE, signée. Un stress test qui affiche ${sgn(Math.abs(reponse), 2)} sur un choc de ${pct(choc, 0)} a confondu long et short — verrouillez le signe avant l'arithmétique.`,
        en
          ? `Asking the scenario for a probability: it has none, by design. The stress test complements the VaR precisely because it refuses the probabilistic frame — pair the two (a quantile for ordinary days, a scenario for the days that count), never substitute one for the other.`
          : `Demander une probabilité au scénario : il n'en a pas, par construction. Le stress test complète la VaR précisément parce qu'il refuse le cadre probabiliste — on apparie les deux (un quantile pour les jours ordinaires, un scénario pour les jours qui comptent), on ne substitue jamais l'un à l'autre.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 11. Des RWA au capital exigé (N2)
// ---------------------------------------------------------------------------
export const genRwaCapital: ExerciseGenerator = {
  id: 'm12-ex-11',
  moduleId: M12,
  titre: 'Des RWA au capital exigé',
  titreEn: 'From RWA to required capital',
  difficulte: 2,
  // Tirages (ordre strict) : 1. exposition = pick([50, 100, 200, 300, 400,
  // 500]) (M€) · 2. ponderation = pick([20, 50, 75, 100]) (l'échelle du ch6 :
  // 20-50 % banques/corporates bien notés, 75 % détail, 100 % le reste — le
  // 0 % souverain AAA est écarté, il rendrait l'exercice dégénéré) · 3.
  // exigence = pick([4.5, 7, 8, 10.5]) (% des RWA).
  // CHAÎNÉ : RWA = actifsPonderesRisqueMillions(expo, pondération), puis
  // capital = actifsPonderesRisqueMillions(RWA, exigence) — la même fonction
  // composée deux fois (une assiette × un pourcentage). L'ancre du ch6 :
  // (100, 75) = 75 M de RWA. LE piège (capital sur l'exposition brute) est
  // recalculé via la même fonction.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const exposition = pick(rng, [50, 100, 200, 300, 400, 500] as const);
    const ponderation = pick(rng, [20, 50, 75, 100] as const);
    const exigence = pick(rng, [4.5, 7, 8, 10.5] as const);

    const rwa = r2(actifsPonderesRisqueMillions(exposition, ponderation));
    const reponse = r2(actifsPonderesRisqueMillions(rwa, exigence));
    const fauxSurBrut = r2(actifsPonderesRisqueMillions(exposition, exigence));

    const en = langue === 'en';
    const { f, pct, meur } = formatters(langue);
    const portefeuilleFr = ponderation === 20
      ? 'un portefeuille de créances sur des banques bien notées'
      : ponderation === 50
        ? 'un portefeuille de prêts à des entreprises bien notées'
        : ponderation === 75
          ? 'un portefeuille de clientèle de détail'
          : 'un portefeuille de prêts corporate non notés';
    const portefeuilleEn = ponderation === 20
      ? 'a portfolio of claims on well-rated banks'
      : ponderation === 50
        ? 'a portfolio of loans to well-rated corporates'
        : ponderation === 75
          ? 'a retail loan book'
          : 'a portfolio of unrated corporate loans';
    return {
      enonce: en
        ? `A bank carries an exposure of ${meur(exposition)} on ${portefeuilleEn}, risk-weighted at ${pct(ponderation, 0)} under the standardised approach. The supervisor requires capital equal to ${pct(exigence, 1)} of risk-weighted assets.\n\n**How much capital does this exposure require, in millions of euros?**`
        : `Une banque porte une exposition de ${meur(exposition)} sur ${portefeuilleFr}, pondérée à ${pct(ponderation, 0)} sous l'approche standard. Le superviseur exige un capital égal à ${pct(exigence, 1)} des actifs pondérés du risque.\n\n**Quel capital cette exposition exige-t-elle, en millions d'euros ?**`,
      reponse,
      tolerance: 0.005,
      unite: en ? '€m' : 'M€',
      etapes: [
        {
          titre: en ? 'First, weight the exposure' : 'D\'abord, pondérer l\'exposition',
          contenu: en
            ? `$\\text{RWA} = \\text{exposure} × \\text{weight} = ${f(exposition, 0)} × ${f(ponderation, 0)}\\,\\%$ = **${meur(rwa)}** of risk-weighted assets. The weight encodes the regulatory risk: ~0% for AAA sovereigns, 20-50% for well-rated banks and corporates, 75% for retail, 100% and above for the rest — the ratings of module 5, hard-wired into the world's bank capital, cliff effects included. A euro lent to the German state is not a euro lent to an SME.`
            : `$\\text{RWA} = \\text{exposition} × \\text{pondération} = ${f(exposition, 0)} × ${f(ponderation, 0)}\\,\\%$ = **${meur(rwa)}** d'actifs pondérés du risque. La pondération encode le risque réglementaire : ~0 % pour le souverain AAA, 20-50 % pour les banques et entreprises bien notées, 75 % pour le détail, 100 % et plus pour le reste — la notation du module 5, câblée dans le capital bancaire mondial, effets de falaise compris. Un euro prêté à l'État allemand n'est pas un euro prêté à une PME.`,
        },
        {
          titre: en ? 'Then, demand the capital' : 'Puis, exiger le capital',
          contenu: en
            ? `$\\text{capital} = \\text{RWA} × ${f(exigence, 1)}\\,\\% = ${f(rwa, 0)} × ${f(exigence, 1)}\\,\\%$ = **${meur(reponse, 2)}**. Same arithmetic as step 1 — a base times a percentage — run one level up: the RWA are the ASSIETTE of the capital requirement, never the exposure itself. Requirements stack in practice: 4.5% CET1 minimum, +2.5% conservation buffer, plus systemic buffers for the banks whose fall would drag the others.`
            : `$\\text{capital} = \\text{RWA} × ${f(exigence, 1)}\\,\\% = ${f(rwa, 0)} × ${f(exigence, 1)}\\,\\%$ = **${meur(reponse, 2)}**. La même arithmétique qu'à l'étape 1 — une assiette fois un pourcentage — un étage plus haut : les RWA sont l'ASSIETTE de l'exigence de capital, jamais l'exposition elle-même. Les exigences s'empilent en pratique : 4,5 % de CET1 minimum, +2,5 % de coussin de conservation, plus les coussins systémiques pour les banques dont la chute entraînerait les autres.`,
        },
        {
          titre: en ? 'Why the whole edifice exists' : 'Pourquoi tout l\'édifice existe',
          contenu: en
            ? `These ${meur(reponse, 2)} are a cushion built BEFORE the shock: Lehman ran at leverage ~31, so 3% of asset losses wiped its capital (module 11). Basel III's answer fits in one sentence — more capital, of better quality, against weighted risks. And because weights can be gamed (2008 manufactured industrial quantities of "riskless" AAA), a crude backstop watches the whole construction: the leverage ratio, capital over UNWEIGHTED exposure, ≥ 3% — the anti-RWA, exactly as the stress test is the anti-VaR.`
            : `Ces ${meur(reponse, 2)} sont un coussin constitué AVANT le choc : Lehman vivait à levier ~31, donc 3 % de baisse des actifs effaçaient son capital (module 11). La réponse de Bâle III tient en une phrase — plus de capital, de meilleure qualité, contre des risques pondérés. Et parce que les pondérations peuvent se manipuler (2008 a fabriqué du « sans risque » AAA en quantité industrielle), un garde-fou fruste surveille toute la construction : le ratio de levier, capital sur exposition NON pondérée, ≥ 3 % — l'anti-RWA, exactement comme le stress test est l'anti-VaR.`,
        },
      ],
      pieges: [
        en
          ? `Applying the requirement to the raw exposure: ${f(exposition, 0)} × ${f(exigence, 1)}% = ${meur(fauxSurBrut, 2)} instead of ${meur(reponse, 2)}. The whole point of Basel is that capital is charged on the WEIGHTED assets — skipping the weighting charges a retail book like a AAA sovereign, or vice versa.`
          : `Appliquer l'exigence à l'exposition brute : ${f(exposition, 0)} × ${f(exigence, 1)} % = ${meur(fauxSurBrut, 2)} au lieu de ${meur(reponse, 2)}. Tout l'objet de Bâle est que le capital se calcule sur les actifs PONDÉRÉS — sauter la pondération, c'est tarifer un book de détail comme du souverain AAA, ou l'inverse.`,
        en
          ? `Stopping at the RWA (${meur(rwa)}): that is the assiette, not the capital. The chain has two multiplications — exposure × weight, then RWA × requirement — and the question asks for the end of it.`
          : `S'arrêter aux RWA (${meur(rwa)}) : c'est l'assiette, pas le capital. La chaîne compte deux multiplications — exposition × pondération, puis RWA × exigence — et la question demande le bout de la chaîne.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 12. Le ratio CET1 et son verdict (N3)
// ---------------------------------------------------------------------------
export const genRatioCet1: ExerciseGenerator = {
  id: 'm12-ex-12',
  moduleId: M12,
  titre: 'Le ratio CET1 et son verdict',
  titreEn: 'The CET1 ratio and its verdict',
  difficulte: 3,
  // Tirages (ordre strict) : 1. exposition = pick([100, 200, 300, 400, 500])
  // (M€) · 2. ponderation = pick([20, 50, 75, 100]) · 3. cet1Cible =
  // randFloat(6, 16, 1) (les fonds propres sont CONSTRUITS comme
  // RWA × cible/100 : le ratio retombe près de la cible tirée, des deux côtés
  // de l'exigence — c'est voulu, le verdict se tranche dans le corrigé) ·
  // 4. exigence = pick([7, 9, 10.5]) (% : minimum + coussins).
  // CHAÎNÉ : RWA d'abord (actifsPonderesRisqueMillions), puis ratioCet1Pct —
  // l'ancre du ch6 : (12, 100) = 12 %. LE piège (diviser par l'exposition
  // brute = le ratio de levier) est recalculé via ratioCet1Pct.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const exposition = pick(rng, [100, 200, 300, 400, 500] as const);
    const ponderation = pick(rng, [20, 50, 75, 100] as const);
    const cet1Cible = randFloat(rng, 6, 16, 1);
    const exigence = pick(rng, [7, 9, 10.5] as const);

    const rwa = r2(actifsPonderesRisqueMillions(exposition, ponderation));
    const fondsPropres = r2((rwa * cet1Cible) / 100);
    const reponse = r2(ratioCet1Pct(fondsPropres, rwa));
    const conforme = reponse >= exigence;
    const marge = r2(Math.abs(reponse - exigence));
    const fauxLevier = r2(ratioCet1Pct(fondsPropres, exposition));

    const en = langue === 'en';
    const { f, pct, meur } = formatters(langue);
    return {
      enonce: en
        ? `A bank holds ${meur(fondsPropres, 2)} of common equity tier 1 (CET1) against a single exposure of ${meur(exposition)}, risk-weighted at ${pct(ponderation, 0)}. Its supervisor's total CET1 requirement — minimum plus buffers — is ${pct(exigence, 1)}.\n\n**What is the bank's CET1 ratio, in %?** (The compliance verdict is settled in the walkthrough.)`
        : `Une banque détient ${meur(fondsPropres, 2)} de fonds propres durs (CET1) contre une exposition unique de ${meur(exposition)}, pondérée à ${pct(ponderation, 0)}. L'exigence CET1 totale de son superviseur — minimum plus coussins — vaut ${pct(exigence, 1)}.\n\n**Quel est le ratio CET1 de la banque, en % ?** (Le verdict de conformité se tranche dans le corrigé.)`,
      reponse,
      tolerance: 0.005,
      unite: '%',
      etapes: [
        {
          titre: en ? 'The denominator first: the RWA' : 'Le dénominateur d\'abord : les RWA',
          contenu: en
            ? `$\\text{RWA} = ${f(exposition, 0)} × ${f(ponderation, 0)}\\,\\%$ = **${meur(rwa)}** (exercise 11's machinery). The ratio's denominator is NEVER the raw balance sheet: it is the risk-weighted assets, where each euro counts for its regulatory riskiness.`
            : `$\\text{RWA} = ${f(exposition, 0)} × ${f(ponderation, 0)}\\,\\%$ = **${meur(rwa)}** (la machinerie de l'exercice 11). Le dénominateur du ratio n'est JAMAIS le bilan brut : ce sont les actifs pondérés du risque, où chaque euro compte pour sa dangerosité réglementaire.`,
        },
        {
          titre: en ? 'The ratio' : 'Le ratio',
          contenu: en
            ? `$\\text{CET1} = \\dfrac{\\text{common equity}}{\\text{RWA}} × 100 = \\dfrac{${f(fondsPropres, 2)}}{${f(rwa, 0)}} × 100$ = **${pct(reponse, 2)}**. Chapter 6's anchor: 12 of hard capital on 100 of RWA ⇒ 12%. CET1 is the capital that absorbs losses WITHOUT triggering a default — ordinary shares and retained earnings, nothing hybrid.`
            : `$\\text{CET1} = \\dfrac{\\text{fonds propres durs}}{\\text{RWA}} × 100 = \\dfrac{${f(fondsPropres, 2)}}{${f(rwa, 0)}} × 100$ = **${pct(reponse, 2)}**. L'ancre du chapitre 6 : 12 de capital dur sur 100 de RWA ⇒ 12 %. Le CET1 est le capital qui absorbe les pertes SANS déclencher de défaut — actions ordinaires et résultats mis en réserve, rien d'hybride.`,
        },
        {
          titre: en ? 'The verdict' : 'Le verdict',
          contenu: en
            ? conforme
              ? `${pct(reponse, 2)} against a requirement of ${pct(exigence, 1)}: the bank is COMPLIANT, with ${f(marge, 2)} points of headroom. For scale, large European banks live at 12-15% of CET1 — well above the 4.5% minimum + 2.5% conservation buffer + systemic buffers — because the market itself demands the margin. Remember what the ratio answers: can the bank ABSORB losses? It says nothing about surviving a run — that is the LCR, exercise 13, and the whole SVB lesson.`
              : `${pct(reponse, 2)} contre une exigence de ${pct(exigence, 1)} : la banque est NON CONFORME, à ${f(marge, 2)} points sous la barre. Entamer les coussins n'est pas un défaut — c'est un régime de restrictions (dividendes et bonus suspendus) et un plan de retour exigé par le superviseur ; passer sous le minimum dur, lui, déclenche l'intervention. Pour l'échelle : les grandes banques européennes vivent à 12-15 %, précisément pour ne jamais raser cette barre. Et rappelez ce que le ratio ne dit pas : être solvable ne protège pas d'un run — c'est le LCR, exercice 13, et toute la leçon SVB.`
            : conforme
              ? `${pct(reponse, 2)} contre une exigence de ${pct(exigence, 1)} : la banque est CONFORME, avec ${f(marge, 2)} points de marge. Pour l'échelle, les grandes banques européennes vivent à 12-15 % de CET1 — bien au-dessus des 4,5 % de minimum + 2,5 % de coussin de conservation + coussins systémiques — parce que le marché lui-même exige la marge. Retenez ce à quoi le ratio répond : la banque peut-elle ABSORBER des pertes ? Il ne dit rien de la survie à un run — c'est le LCR, exercice 13, et toute la leçon SVB.`
              : `${pct(reponse, 2)} contre une exigence de ${pct(exigence, 1)} : la banque est NON CONFORME, à ${f(marge, 2)} points sous la barre. Entamer les coussins n'est pas un défaut — c'est un régime de restrictions (dividendes et bonus suspendus) et un plan de retour exigé par le superviseur ; passer sous le minimum dur, lui, déclenche l'intervention. Pour l'échelle : les grandes banques européennes vivent à 12-15 %, précisément pour ne jamais raser cette barre. Et rappelez ce que le ratio ne dit pas : être solvable ne protège pas d'un run — c'est le LCR, exercice 13, et toute la leçon SVB.`,
        },
      ],
      pieges: [
        en
          ? `Dividing by the raw exposure: ${f(fondsPropres, 2)}/${f(exposition, 0)} × 100 = ${pct(fauxLevier, 2)} instead of ${pct(reponse, 2)}. That computes something else — the LEVERAGE ratio, Basel III's unweighted backstop (≥ 3%). Useful number, wrong question: the CET1 ratio wants the RWA underneath.`
          : `Diviser par l'exposition brute : ${f(fondsPropres, 2)}/${f(exposition, 0)} × 100 = ${pct(fauxLevier, 2)} au lieu de ${pct(reponse, 2)}. Cela calcule autre chose — le ratio de LEVIER, le garde-fou non pondéré de Bâle III (≥ 3 %). Chiffre utile, mauvaise question : le ratio CET1 veut les RWA au dénominateur.`,
        en
          ? `Comparing to 4.5% alone: the requirement STACKS — 4.5% minimum, +2.5% conservation buffer, plus systemic buffers. A bank at 5% is above the minimum and still in breach of its combined requirement: the verdict is rendered against the full stack, here ${pct(exigence, 1)}.`
          : `Comparer aux seuls 4,5 % : l'exigence S'EMPILE — 4,5 % de minimum, +2,5 % de coussin de conservation, plus les coussins systémiques. Une banque à 5 % est au-dessus du minimum et pourtant en infraction à son exigence combinée : le verdict se rend contre la pile entière, ici ${pct(exigence, 1)}.`,
        en
          ? `Concluding "compliant, therefore safe": solvency and liquidity are two separate risks, measured separately. SVB was regulatorily solvent the day before it died of a run — a balance sheet full of Treasuries can die of illiquidity. One ratio never audits a bank.`
          : `Conclure « conforme, donc sûre » : solvabilité et liquidité sont deux risques distincts, mesurés séparément. SVB était réglementairement solvable la veille de mourir d'un run — un bilan plein de Treasuries peut mourir d'illiquidité. Un ratio seul n'audite jamais une banque.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 13. Le LCR et son verdict (N3)
// ---------------------------------------------------------------------------
export const genLcr: ExerciseGenerator = {
  id: 'm12-ex-13',
  moduleId: M12,
  titre: 'Le LCR et son verdict',
  titreEn: 'The LCR and its verdict',
  difficulte: 3,
  // Tirages (ordre strict) : 1. cash = randInt(20, 100) (M€, cash et réserves
  // banque centrale) · 2. souverains = randInt(30, 150) (M€, souverains
  // liquides) · 3. sorties = randInt(⌈HQLA/1,6⌉, ⌊HQLA/0,75⌋) (bornes
  // calculées : le LCR retombe dans ~[75 %, 160 %], des deux côtés de la
  // barre des 100 % — c'est voulu, le verdict se tranche dans le corrigé).
  // CHAÎNÉ : HQLA = cash + souverains, puis lcrPct — l'ancre du ch6 :
  // (120, 100) = 120 %. LE piège (le ratio inversé) est recalculé via lcrPct.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const cash = randInt(rng, 20, 100);
    const souverains = randInt(rng, 30, 150);
    const hqla = cash + souverains;
    const sorties = randInt(rng, Math.ceil(hqla / 1.6), Math.floor(hqla / 0.75));

    const reponse = r2(lcrPct(hqla, sorties));
    const conforme = reponse >= 100;
    const marge = r2(Math.abs(reponse - 100));
    const fauxInverse = r2(lcrPct(sorties, hqla));

    const en = langue === 'en';
    const { f, pct, meur } = formatters(langue);
    return {
      enonce: en
        ? `A bank's liquidity desk reports ${meur(cash)} in cash and central-bank reserves plus ${meur(souverains)} in liquid sovereign bonds — its entire stock of high-quality liquid assets (HQLA). The prescribed 30-day stress scenario puts net cash outflows at ${meur(sorties)}.\n\n**What is the bank's LCR, in %?** (The compliance verdict is settled in the walkthrough.)`
        : `Le desk de trésorerie d'une banque recense ${meur(cash)} de cash et réserves banque centrale plus ${meur(souverains)} de souverains liquides — tout son stock d'actifs liquides de haute qualité (HQLA). Le scénario de stress prescrit à 30 jours chiffre les sorties nettes de trésorerie à ${meur(sorties)}.\n\n**Quel est le LCR de la banque, en % ?** (Le verdict de conformité se tranche dans le corrigé.)`,
      reponse,
      tolerance: 0.005,
      unite: '%',
      etapes: [
        {
          titre: en ? 'Count what truly sells in a storm' : 'Compter ce qui se vend vraiment dans la tempête',
          contenu: en
            ? `$\\text{HQLA} = ${f(cash, 0)} + ${f(souverains, 0)}$ = **${meur(hqla)}**. Only assets that stay liquid IN STRESS qualify: cash, central-bank reserves, liquid sovereigns. Corporate bonds, equities, loans — however sound — do not save you in a run: 2008's lesson is precisely that "solid" and "sellable within the month" are different properties.`
            : `$\\text{HQLA} = ${f(cash, 0)} + ${f(souverains, 0)}$ = **${meur(hqla)}**. Ne comptent que les actifs qui restent liquides EN STRESS : cash, réserves banque centrale, souverains liquides. Obligations corporate, actions, prêts — si sains soient-ils — ne sauvent pas d'un run : la leçon de 2008 est précisément que « solide » et « vendable dans le mois » sont deux propriétés différentes.`,
        },
        {
          titre: en ? 'The ratio: a month of run, prefunded' : 'Le ratio : un mois de run, préfinancé',
          contenu: en
            ? `$\\text{LCR} = \\dfrac{\\text{HQLA}}{\\text{net 30-day outflows}} × 100 = \\dfrac{${f(hqla, 0)}}{${f(sorties, 0)}} × 100$ = **${pct(reponse, 2)}**. Chapter 6's anchor: 120 of HQLA on 100 of outflows ⇒ 120%. The outflow scenario is PRESCRIBED — a fraction of deposits fleeing, credit lines drawn, market funding drying up — so that every bank prefunds the same standardised month of run.`
            : `$\\text{LCR} = \\dfrac{\\text{HQLA}}{\\text{sorties nettes à 30 j}} × 100 = \\dfrac{${f(hqla, 0)}}{${f(sorties, 0)}} × 100$ = **${pct(reponse, 2)}**. L'ancre du chapitre 6 : 120 de HQLA sur 100 de sorties ⇒ 120 %. Le scénario de sorties est PRESCRIT — fuite d'une fraction des dépôts, tirage des lignes de crédit, assèchement du financement de marché — pour que chaque banque préfinance le même mois de run standardisé.`,
        },
        {
          titre: en ? 'The verdict' : 'Le verdict',
          contenu: en
            ? conforme
              ? `${pct(reponse, 2)} ≥ 100%: COMPLIANT, with ${f(marge, 2)} points of headroom — the bank can survive the standardised month of run WITHOUT the central bank. Two humilities before filing the number. The LCR was born because 2008 killed SOLVENT banks (Northern Rock, Bear Stearns — dead of repo, not of losses). And SVB 2023 showed its perimeter and speed limits: exempted from the full LCR, hit by a smartphone-speed run — 42 billion dollars asked out in ONE day — that outran even the 30-day scenario. Solvency does not protect from illiquidity, and the ratio only protects those it covers.`
              : `${pct(reponse, 2)} < 100%: NON-COMPLIANT, ${f(marge, 2)} points short — under the prescribed scenario the bank runs out of liquid assets BEFORE the month of run ends, and survives only at the central bank's window. The remedies are structural, not cosmetic: more HQLA (which yield less — liquidity has a carry cost) or fewer unstable fundings. The whole point of the rule: 2008 killed solvent banks; the LCR forces the month of run to be prefunded, in peacetime.`
            : conforme
              ? `${pct(reponse, 2)} ≥ 100 % : CONFORME, avec ${f(marge, 2)} points de marge — la banque peut survivre au mois de run standardisé SANS banque centrale. Deux humilités avant de classer le chiffre. Le LCR est né parce que 2008 a tué des banques SOLVABLES (Northern Rock, Bear Stearns — mortes du repo, pas des pertes). Et SVB 2023 a montré ses limites de périmètre et de vitesse : exemptée du LCR complet, frappée par un run à la vitesse du smartphone — 42 milliards de dollars demandés en UNE journée — qui a dépassé même le scénario à 30 jours. La solvabilité ne protège pas de l'illiquidité, et le ratio ne protège que ceux qu'il couvre.`
              : `${pct(reponse, 2)} < 100 % : NON CONFORME, à ${f(marge, 2)} points de la barre — sous le scénario prescrit, la banque épuise ses actifs liquides AVANT la fin du mois de run, et ne survit qu'au guichet de la banque centrale. Les remèdes sont structurels, pas cosmétiques : plus de HQLA (qui rapportent moins — la liquidité a un coût de portage) ou moins de financements instables. Tout l'objet de la règle : 2008 a tué des banques solvables ; le LCR force à préfinancer le mois de run, en temps de paix.`,
        },
      ],
      pieges: [
        en
          ? `Inverting the ratio: ${f(sorties, 0)}/${f(hqla, 0)} × 100 = ${pct(fauxInverse, 2)}. The LCR puts the RESERVE on top and the NEED underneath — it answers "how many months of run can I fund?", so bigger must mean safer. If your number worsens when HQLA grows, the fraction is upside down.`
          : `Inverser le ratio : ${f(sorties, 0)}/${f(hqla, 0)} × 100 = ${pct(fauxInverse, 2)}. Le LCR met la RÉSERVE au numérateur et le BESOIN au dénominateur — il répond « combien de mois de run puis-je financer ? », donc plus grand doit vouloir dire plus sûr. Si votre chiffre se dégrade quand les HQLA grossissent, la fraction est à l'envers.`,
        en
          ? `Confusing the LCR with solvency: this ratio does not ask whether the bank can absorb LOSSES (that is CET1, exercise 12) but whether it can pay a month of OUTFLOWS. The two die separately — SVB was solvent on paper and dead of a run within a day.`
          : `Confondre le LCR avec la solvabilité : ce ratio ne demande pas si la banque peut absorber des PERTES (c'est le CET1, exercice 12) mais si elle peut payer un mois de SORTIES. Les deux se meurent séparément — SVB était solvable sur le papier et morte d'un run en une journée.`,
        en
          ? `Counting everything as HQLA: only stress-liquid assets qualify. Padding the numerator with corporate bonds or equities is exactly the mistake the stress scenario exists to forbid — in the run, those are the assets whose bid disappears first.`
          : `Tout compter en HQLA : seuls les actifs liquides en stress se qualifient. Gonfler le numérateur d'obligations corporate ou d'actions est exactement l'erreur que le scénario de stress existe pour interdire — dans le run, ce sont les actifs dont le prix acheteur disparaît en premier.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 14. L'arithmétique des frais (N3)
// ---------------------------------------------------------------------------
export const genArithmetiqueFrais: ExerciseGenerator = {
  id: 'm12-ex-14',
  moduleId: M12,
  titre: 'L\'arithmétique des frais',
  titreEn: 'The arithmetic of fees',
  difficulte: 3,
  // Tirages (ordre strict) : 1. capitalMilliers = pick([10, 25, 50, 100])
  // (capital initial en milliers d'euros) · 2. rendement = randFloat(5, 8, 1)
  // (brut annuel) · 3. frais = randFloat(0.5, 2.5, 1) · 4. annees =
  // pick([10, 20, 30, 40]).
  // CHAÎNÉ : valeurNetteDeFrais appelée DEUX fois — à frais 0 (le brut) puis
  // aux frais tirés — et la réponse est l'écart. L'ancre du ch4 : 100 investis
  // 30 ans à 7 % font 761,225504 brut, 432,194238 net de 2 % — les frais ont
  // coûté 329,031266, plus de trois fois la mise, soit 43 % de la valeur
  // finale brute. LE piège (frais × n linéaire, capital × f % × n) est
  // recalculé dans le corrigé.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const capitalMilliers = pick(rng, [10, 25, 50, 100] as const);
    const rendement = randFloat(rng, 5, 8, 1);
    const frais = randFloat(rng, 0.5, 2.5, 1);
    const annees = pick(rng, [10, 20, 30, 40] as const);

    const capital = capitalMilliers * 1000;
    const valeurBrute = r2(valeurNetteDeFrais(capital, rendement, 0, annees));
    const valeurNette = r2(valeurNetteDeFrais(capital, rendement, frais, annees));
    const reponse = r2(valeurBrute - valeurNette);
    const fauxLineaire = r2(((capital * frais) / 100) * annees);
    const pctConfisque = r2((reponse / valeurBrute) * 100);
    const netAnnuel = r2(rendement - frais);

    const en = langue === 'en';
    const { f, pct, eur } = formatters(langue);
    return {
      enonce: en
        ? `A client invests ${eur(capital)} for ${f(annees, 0)} years at a gross return of ${pct(rendement, 1)} per year, in a fund charging ${pct(frais, 1)} of annual fees.\n\n**How much do the fees cost in total, in euros — the gap between the final value WITHOUT fees and the final value net of fees?**`
        : `Un client investit ${eur(capital)} pendant ${f(annees, 0)} ans à un rendement brut de ${pct(rendement, 1)} par an, dans un fonds qui prélève ${pct(frais, 1)} de frais annuels.\n\n**Combien les frais coûtent-ils au total, en euros — l'écart entre la valeur finale SANS frais et la valeur finale nette de frais ?**`,
      reponse,
      tolerance: 0.005,
      unite: '€',
      etapes: [
        {
          titre: en ? 'The gross trajectory' : 'La trajectoire brute',
          contenu: en
            ? `Without fees, the capital compounds at the full ${pct(rendement, 1)}: $V_{\\text{gross}} = ${f(capital, 0)} × (1 + ${f(rendement, 1)}\\,\\%)^{${f(annees, 0)}}$ = **${eur(valeurBrute, 2)}**. This is module 4's compounding, working FOR the investor.`
            : `Sans frais, le capital se compose au plein ${pct(rendement, 1)} : $V_{\\text{brut}} = ${f(capital, 0)} × (1 + ${f(rendement, 1)}\\,\\%)^{${f(annees, 0)}}$ = **${eur(valeurBrute, 2)}**. C'est la composition du module 4, au service de l'investisseur.`,
        },
        {
          titre: en ? 'The net trajectory: fees compound too' : 'La trajectoire nette : les frais se composent aussi',
          contenu: en
            ? `The fees skim ${pct(frais, 1)} EVERY year, so the capital only compounds at $r - f = ${f(rendement, 1)} - ${f(frais, 1)} = ${pct(netAnnuel, 2)}$: $V_{\\text{net}} = ${f(capital, 0)} × (1 + ${f(netAnnuel, 2)}\\,\\%)^{${f(annees, 0)}}$ = **${eur(valeurNette, 2)}**. Every euro of fee taken in year 3 also destroys all the returns that euro would have earned until year ${f(annees, 0)} — that is why the bill compounds instead of adding.`
            : `Les frais écrèment ${pct(frais, 1)} CHAQUE année, donc le capital ne se compose plus qu'à $r - f = ${f(rendement, 1)} - ${f(frais, 1)} = ${pct(netAnnuel, 2)}$ : $V_{\\text{net}} = ${f(capital, 0)} × (1 + ${f(netAnnuel, 2)}\\,\\%)^{${f(annees, 0)}}$ = **${eur(valeurNette, 2)}**. Chaque euro de frais prélevé l'année 3 détruit aussi tous les rendements que cet euro aurait produits jusqu'à l'année ${f(annees, 0)} — voilà pourquoi la facture se compose au lieu de s'additionner.`,
        },
        {
          titre: en ? 'The gap — and what it means' : 'L\'écart — et ce qu\'il veut dire',
          contenu: en
            ? `$${f(valeurBrute, 2)} - ${f(valeurNette, 2)}$ = **${eur(reponse, 2)}** confiscated by the fees — ${pct(pctConfisque, 1)} of the gross final value, without any single year ever looking expensive. Chapter 4's anchor: 100 invested 30 years at 7% gross make 761.23; at 2% of fees, 432.19 — the fees cost 329.03, more than three times the initial stake. This is the massue argument of the passive/active debate: to DESERVE ${pct(frais, 1)} a year, the manager must beat the market by that much every year — while Sharpe's 1991 arithmetic guarantees the average manager, before fees, does exactly zero.`
            : `$${f(valeurBrute, 2)} - ${f(valeurNette, 2)}$ = **${eur(reponse, 2)}** confisqués par les frais — ${pct(pctConfisque, 1)} de la valeur finale brute, sans qu'aucune année isolée ne semble chère. L'ancre du chapitre 4 : 100 investis 30 ans à 7 % brut font 761,23 ; avec 2 % de frais, 432,19 — les frais ont coûté 329,03, plus de trois fois la mise de départ. C'est l'argument massue du débat passif/actif : pour MÉRITER ${pct(frais, 1)} par an, le gérant doit battre le marché d'autant chaque année — quand l'arithmétique de Sharpe (1991) garantit que le gérant moyen, avant frais, fait exactement zéro.`,
        },
      ],
      pieges: [
        en
          ? `THE trap — annualising linearly: ${f(frais, 1)}% × ${f(annees, 0)} years × ${f(capital, 0)} = ${eur(fauxLineaire, 0)}, against a true cost of ${eur(reponse, 2)}. The linear estimate misses the compounding of the fees AND the returns the skimmed euros would have earned: over a long horizon it understates the bill by a factor that grows every year.`
          : `LE piège — annualiser linéairement : ${f(frais, 1)} % × ${f(annees, 0)} ans × ${f(capital, 0)} = ${eur(fauxLineaire, 0)}, contre un coût réel de ${eur(reponse, 2)}. L'estimation linéaire rate la composition des frais ET les rendements que les euros écrémés auraient produits : sur un horizon long, elle sous-estime la facture d'un facteur qui grandit chaque année.`,
        en
          ? `Answering one of the two values (${eur(valeurBrute, 0)} or ${eur(valeurNette, 0)}) instead of their gap: the question isolates what the FEES cost, and that only exists as the difference between the twin trajectories — same capital, same gross return, one line of fees apart.`
          : `Répondre l'une des deux valeurs (${eur(valeurBrute, 0)} ou ${eur(valeurNette, 0)}) au lieu de leur écart : la question isole ce que COÛTENT les frais, et cela n'existe que comme différence entre les trajectoires jumelles — même capital, même rendement brut, une ligne de frais d'écart.`,
        en
          ? `Reading "${pct(frais, 1)} a year" as small because each year is small: the client's judgment must be made on final values, net of fees — chapter 3's rule. The compounding works for whoever collects the fees exactly as surely as for the investor.`
          : `Lire « ${pct(frais, 1)} par an » comme petit parce que chaque année est petite : le jugement du client doit se rendre sur les valeurs finales, nettes de frais — la règle du chapitre 3. La composition travaille pour celui qui encaisse les frais aussi sûrement que pour l'investisseur.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// Export : les 14 générateurs du module, dans l'ordre de progression du cours
// ---------------------------------------------------------------------------
export const exercices: ExerciseGenerator[] = [
  genRendementPortefeuille,
  genRendementCapm,
  genRatioSharpe,
  genVolatilitePortefeuille,
  genBetaActif,
  genAlphaJensen,
  genRatioInformation,
  genVarParametrique,
  genVarHorizon,
  genPerteStress,
  genRwaCapital,
  genRatioCet1,
  genLcr,
  genArithmetiqueFrais,
];
