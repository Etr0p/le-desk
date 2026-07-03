/**
 * Les 12 générateurs d'exercices d'application du module Histoire & crises
 * financières — module de CULTURE à socle quantitatif : chaque exercice chiffre
 * un mécanisme de crise du cours (levier, drawdown, asymétrie des pertes, run
 * sur le repo, run bancaire, doom loop, spirale de désendettement), jamais une
 * virtuosité calculatoire.
 *
 * BILINGUES : generate(seed, langue = 'fr'). Invariant absolu : TOUS les tirages
 * aléatoires sont effectués AVANT toute branche de langue — un même seed produit
 * exactement les mêmes nombres, la même réponse et la même tolérance en français
 * et en anglais. Seuls les textes (énoncé, étapes, pièges) changent.
 *
 * Tous les calculs passent par calculs.ts (aucune formule recopiée). Conventions
 * du module (en-tête de calculs.ts) : pourcentages partout ; levier = multiple
 * SANS UNITÉ (actifs/fonds propres) ; les pertes se passent en magnitude
 * POSITIVE aux fonctions de récupération, les drawdowns et impacts de levier se
 * rendent SIGNÉS ; les spreads en POINTS DE BASE (100 pb = 1 %) ; composition
 * DISCRÈTE annuelle. Le pont quantitatif avec le m10 (duration ⇒ perte SVB)
 * s'IMPORTE depuis ce module, jamais recopié. Deux exceptions documentées,
 * conformes au chapitre 1 : la taille de la vente forcée au levier cible,
 * S = (A − λE)/(1 − λd), dérivée dans le GoFurther du chapitre 1 et utilisée
 * par LeverageSpiralSim, n'a pas de fonction dédiée dans calculs.ts (ex-12 la
 * dérive pas à pas en s'appuyant sur venteForceePourCash pour l'intuition) ;
 * et l'interpolation linéaire des tirages de l'ex-03 dans les bandes
 * historiques de chaque krach est de la pure mise en scène, pas un calcul.
 * Les pièges martelés ici : le levier oublié (répondre le choc au lieu de
 * levier × choc), la symétrie naïve des pourcentages (−50 % ≠ +50 %), le
 * haircut pris pour un taux d'intérêt, la vente qui multiplie par (1 + d) au
 * lieu de diviser par (1 − d), la charge d'intérêts confondue avec le taux,
 * les pb non convertis, le « sans risque » lu comme « sans risque de prix ».
 * L'ordre des tirages de chaque moule est documenté dans son commentaire
 * « Tirages (ordre strict) ».
 */
import { formatNombreLangue } from '../../../engine/answers';
import { mulberry32, pick, randFloat, randInt } from '../../../engine/rng';
import type { ExerciseGenerator, Langue } from '../../../engine/types';
import { variationPrixObligationDuration } from '../10-macro-banques-centrales/calculs';
import {
  anneesDeRecuperation,
  chargeInteretsDette,
  drawdownPct,
  financementRepo,
  gainRequisPourRecuperer,
  impactLevierSurFondsPropres,
  levierBilan,
  levierMaximalRepo,
  spreadSouverainPb,
  tauxCouvertureDepots,
  variationActifsFatale,
  venteForceePourCash,
} from './calculs';

const M11 = '11-histoire-crises';

const r2 = (v: number) => Math.round(v * 100) / 100;

/** Formateurs dépendants de la langue : nombre, pourcentage, signé, dollars, milliards. */
function formatters(langue: Langue) {
  const f = (v: number, d = 2) => formatNombreLangue(langue, v, d);
  const pct = (v: number, d = 2) => (langue === 'en' ? `${f(v, d)}%` : `${f(v, d)} %`);
  /** Nombre signé (+2,50 / −5,09), pour afficher des variations. */
  const sgn = (v: number, d = 2) => (v > 0 ? `+${f(v, d)}` : f(v, d));
  /** Montant en dollars courants (le boursicoteur de 1929). */
  const dol = (v: number, d = 0) => (langue === 'en' ? `$${f(v, d)}` : `${f(v, d)} $`);
  /** Montant en milliards, devise paramétrée ($ par défaut, £ pour gilts et Northern Rock). */
  const md = (v: number, d = 0, dev: '$' | '£' = '$') =>
    langue === 'en' ? `${dev}${f(v, d)}bn` : `${f(v, d)} Md${dev}`;
  return { f, pct, sgn, dol, md };
}

// ---------------------------------------------------------------------------
// 1. Le levier de bilan (N1)
// ---------------------------------------------------------------------------
export const genLevierBilan: ExerciseGenerator = {
  id: 'm11-ex-01',
  moduleId: M11,
  titre: 'Le levier de bilan',
  titreEn: 'Balance-sheet leverage',
  difficulte: 1,
  // Tirages (ordre strict) : 1. habillage = pick(['spec1929', 'fonds1998',
  // 'banque2007']) · 2. levSpec = randInt(8, 12) · 3. capSpec = pick([5000,
  // 10000, 20000]) ($) · 4. levFonds = randInt(22, 30) · 5. capFonds =
  // randFloat(4, 6, 1) (Md$) · 6. levBanque = randInt(28, 33) · 7. capBanque =
  // randInt(20, 30) (Md$). Les actifs sont CONSTRUITS comme capital × levier :
  // la réponse (levierBilan) retombe sur un entier propre, et le choc fatal
  // (variationActifsFatale) est chiffré dans le corrigé. Les bornes suivent
  // les ordres de grandeur du cours : ~10 pour la marge de 1929, ~27 pour
  // LTCM (125/4,7), >30 pour Lehman 2007.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const habillage = pick(rng, ['spec1929', 'fonds1998', 'banque2007'] as const);
    const levSpec = randInt(rng, 8, 12);
    const capSpec = pick(rng, [5000, 10000, 20000] as const);
    const levFonds = randInt(rng, 22, 30);
    const capFonds = randFloat(rng, 4, 6, 1);
    const levBanque = randInt(rng, 28, 33);
    const capBanque = randInt(rng, 20, 30);

    const estSpec = habillage === 'spec1929';
    const estFonds = habillage === 'fonds1998';
    const capital = estSpec ? capSpec : estFonds ? capFonds : capBanque;
    const levier = estSpec ? levSpec : estFonds ? levFonds : levBanque;
    const actifs = r2(capital * levier);
    const dette = r2(actifs - capital);
    const reponse = r2(levierBilan(actifs, capital));
    const chocFatal = r2(variationActifsFatale(reponse));

    const en = langue === 'en';
    const { f, pct, dol, md } = formatters(langue);
    const capTxt = estSpec ? dol(capital) : md(capital, estFonds ? 1 : 0);
    const actifsTxt = estSpec ? dol(actifs) : md(actifs, estFonds ? 1 : 0);
    const detteTxt = estSpec ? dol(dette) : md(dette, estFonds ? 1 : 0);
    return {
      enonce: en
        ? estSpec
          ? `New York, summer 1929. A retail speculator buys ${actifsTxt} of stocks while putting up only ${capTxt} of his own money — the rest is a call loan from his broker, renewable day by day.\n\n**What is the leverage of his balance sheet (assets/equity, unitless multiple)?**`
          : estFonds
            ? `Greenwich, 1998. An arbitrage fund carries ${actifsTxt} of assets on ${capTxt} of capital — repo funding, haircuts negotiated close to zero.\n\n**What is the fund's balance-sheet leverage (unitless multiple)?**`
            : `Wall Street, 2007. An investment bank shows ${actifsTxt} of assets against ${capTxt} of equity, funded mostly overnight.\n\n**What is its balance-sheet leverage (unitless multiple)?**`
        : estSpec
          ? `New York, été 1929. Un boursicoteur achète ${actifsTxt} d'actions en n'apportant que ${capTxt} de sa poche — le reste est un call loan de son courtier, renouvelable au jour le jour.\n\n**Quel est le levier de son bilan (actifs/fonds propres, multiple sans unité) ?**`
          : estFonds
            ? `Greenwich, 1998. Un fonds d'arbitrage porte ${actifsTxt} d'actifs pour ${capTxt} de capital — financement en repo, haircuts négociés au ras de zéro.\n\n**Quel est le levier de bilan du fonds (multiple sans unité) ?**`
            : `Wall Street, 2007. Une banque d'investissement affiche ${actifsTxt} d'actifs pour ${capTxt} de fonds propres, financés pour l'essentiel au jour le jour.\n\n**Quel est son levier de bilan (multiple sans unité) ?**`,
      reponse,
      tolerance: 0.1,
      toleranceMode: 'absolu',
      etapes: [
        {
          titre: en ? 'Assets over equity' : 'Actifs sur fonds propres',
          contenu: en
            ? `$\\text{leverage} = \\dfrac{\\text{assets}}{\\text{equity}} = \\dfrac{${f(actifs, estFonds ? 1 : 0)}}{${f(capital, estFonds ? 1 : 0)}}$ = **${f(reponse, 1)}**. Read it as a structure: ${f(reponse, 0)} of assets rest on 1 of equity and ${f(reponse - 1, 0)} of debt — ${detteTxt} borrowed here. The debt does not share the losses: whatever happens to the assets, equity absorbs everything.`
            : `$\\text{levier} = \\dfrac{\\text{actifs}}{\\text{fonds propres}} = \\dfrac{${f(actifs, estFonds ? 1 : 0)}}{${f(capital, estFonds ? 1 : 0)}}$ = **${f(reponse, 1)}**. Lisez-le comme une structure : ${f(reponse, 0)} d'actifs reposent sur 1 de fonds propres et ${f(reponse - 1, 0)} de dette — ${detteTxt} empruntés ici. La dette ne partage pas les pertes : quoi qu'il arrive aux actifs, les fonds propres absorbent tout.`,
        },
        {
          titre: en ? 'The distance to death' : 'La distance à la mort',
          contenu: en
            ? `The shock that wipes out the equity entirely is $-100/\\text{leverage} = -100/${f(reponse, 0)}$ = **${pct(chocFatal, 2)}** of assets. ${estSpec ? 'A bad week in October 1929 was enough — and the call loan gets called precisely when prices fall.' : estFonds ? 'A bad month — August 1998 delivered −44% on LTCM\'s book, more than ten times the fatal shock.' : 'A bad quarter on a mortgage book — and the overnight funding runs long before the accounting loss lands.'} That number, not the return, is the first thing a risk manager reads in a balance sheet.`
            : `Le choc qui efface intégralement les fonds propres est $-100/\\text{levier} = -100/${f(reponse, 0)}$ = **${pct(chocFatal, 2)}** d'actifs. ${estSpec ? 'Une mauvaise semaine d\'octobre 1929 suffisait — et le call loan est rappelé précisément quand les prix baissent.' : estFonds ? 'Un mauvais mois — août 1998 a infligé −44 % au book de LTCM, plus de dix fois le choc fatal.' : 'Un mauvais trimestre sur un book hypothécaire — et le financement au jour le jour fuit bien avant la perte comptable.'} Ce chiffre-là, pas le rendement, est la première chose qu'un risk manager lit dans un bilan.`,
        },
        {
          titre: en ? 'The historical scale' : 'L\'échelle historique',
          contenu: en
            ? `Leverage is THE variable common to every catastrophe of the module: ~10 for the 1929 margin speculator (10% down payment, dead at −10%), ~27 for LTCM in 1998 ($125bn on $4.7bn, dead at −3.7%), above 30 for Lehman in 2007, and 1 for the cash investor — who never goes bankrupt through prices, only through boredom. During the boom, leverage manufactures geniuses; the panic reveals they were merely levered.`
            : `Le levier est LA variable commune à toutes les catastrophes du module : ~10 pour le spéculateur sur marge de 1929 (10 % d'apport, mort à −10 %), ~27 pour LTCM en 1998 (125 Md$ sur 4,7 Md$, mort à −3,7 %), plus de 30 pour Lehman en 2007, et 1 pour l'investisseur au comptant — qui ne fait jamais faillite par les prix, seulement par l'ennui. Pendant le boom, le levier fabrique des génies ; la panique révèle qu'ils n'étaient que leviérés.`,
        },
      ],
      pieges: [
        en
          ? `Computing debt over equity: $${f(dette, estFonds ? 1 : 0)}/${f(capital, estFonds ? 1 : 0)} = ${f(r2(dette / capital), 1)}$ instead of ${f(reponse, 1)}. Balance-sheet leverage is ASSETS over equity — the convention behind the misery formula ΔEquity% = leverage × ΔAssets%; the debt ratio is leverage minus one.`
          : `Calculer dette sur fonds propres : $${f(dette, estFonds ? 1 : 0)}/${f(capital, estFonds ? 1 : 0)} = ${f(r2(dette / capital), 1)}$ au lieu de ${f(reponse, 1)}. Le levier de bilan est ACTIFS sur fonds propres — la convention derrière la formule du malheur ΔFP % = levier × Δactifs % ; le ratio de dette, c'est le levier moins un.`,
        en
          ? `Believing leverage is harmless "as long as the positions are right": at ${f(reponse, 0)}×, a ${pct(chocFatal, 2)} dip kills before the thesis has time to be right — and the overnight funding (call loans, repo) can die of doubt before prices even move. Leverage turns "right in the end" into "dead before".`
          : `Croire le levier inoffensif « tant que les positions sont bonnes » : à ${f(reponse, 0)}×, un creux de ${pct(chocFatal, 2)} tue avant que la thèse ait le temps d'avoir raison — et le financement au jour le jour (call loans, repo) peut mourir du doute avant même que les prix bougent. Le levier transforme « raison à terme » en « mort avant ».`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 2. La formule du malheur (N1)
// ---------------------------------------------------------------------------
export const genFormuleDuMalheur: ExerciseGenerator = {
  id: 'm11-ex-02',
  moduleId: M11,
  titre: 'La formule du malheur',
  titreEn: 'The misery formula',
  difficulte: 1,
  // Tirages (ordre strict) : 1. levier = pick([10, 15, 20, 25, 30]) · 2. chocMag
  // = randFloat(1, 6, 1) · 3. habillage = pick(['fonds', 'banque']).
  // Réponse = impactLevierSurFondsPropres(levier, −chocMag), en % SIGNÉ des
  // fonds propres. La question subsidiaire (survit-il ?) se tranche dans le
  // corrigé contre le choc fatal (variationActifsFatale) : selon le tirage,
  // l'impact peut dépasser −100 % (faillite) — c'est voulu, les deux issues
  // existent et le corrigé les traite.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const levier = pick(rng, [10, 15, 20, 25, 30] as const);
    const chocMag = randFloat(rng, 1, 6, 1);
    const habillage = pick(rng, ['fonds', 'banque'] as const);

    const reponse = r2(impactLevierSurFondsPropres(levier, -chocMag));
    const mort = reponse <= -100;
    const chocFatal = r2(variationActifsFatale(levier));
    const fpRestants = r2(100 + reponse);
    const actifsApres = r2(levier * 100 * (1 - chocMag / 100));
    const levierApres = mort ? 0 : r2(levierBilan(actifsApres, fpRestants));
    const gainSym = r2(impactLevierSurFondsPropres(levier, 2));
    const estFonds = habillage === 'fonds';

    const en = langue === 'en';
    const { f, pct, sgn } = formatters(langue);
    return {
      enonce: en
        ? estFonds
          ? `A hedge fund running at leverage ${f(levier, 0)} sees its assets fall by ${pct(chocMag, 1)} in a single session.\n\n**By how much do its equity holders' funds move, in % (sign included) — and does the fund survive?** (The numeric answer expected is the variation of equity.)`
          : `An investment bank at leverage ${f(levier, 0)} marks its assets down by ${pct(chocMag, 1)}.\n\n**By how much does its equity move, in % (sign included) — and does the bank survive?** (The numeric answer expected is the variation of equity.)`
        : estFonds
          ? `Un fonds spéculatif au levier ${f(levier, 0)} voit ses actifs perdre ${pct(chocMag, 1)} en une seule séance.\n\n**De combien varient ses fonds propres, en % (signe compris) — et le fonds survit-il ?** (La réponse numérique attendue est la variation des fonds propres.)`
          : `Une banque d'investissement au levier ${f(levier, 0)} déprécie ses actifs de ${pct(chocMag, 1)}.\n\n**De combien varient ses fonds propres, en % (signe compris) — et la banque survit-elle ?** (La réponse numérique attendue est la variation des fonds propres.)`,
      reponse,
      tolerance: 0.5,
      toleranceMode: 'absolu',
      unite: '%',
      etapes: [
        {
          titre: en ? 'The debt does not share the losses' : 'La dette ne partage pas les pertes',
          contenu: en
            ? `The misery formula: $\\Delta FP\\,\\% = \\text{leverage} × \\Delta \\text{assets}\\,\\% = ${f(levier, 0)} × (-${f(chocMag, 1)}\\,\\%)$ = **${sgn(reponse, 2)}%**. The mechanics on a base of 100 of equity: assets of ${f(levier * 100, 0)} lose ${f(r2((levier * 100 * chocMag) / 100), 0)}, the debt of ${f(levier * 100 - 100, 0)} does not move by a cent — equity absorbs the entire loss.`
            : `La formule du malheur : $\\Delta FP\\,\\% = \\text{levier} × \\Delta \\text{actifs}\\,\\% = ${f(levier, 0)} × (-${f(chocMag, 1)}\\,\\%)$ = **${sgn(reponse, 2)} %**. La mécanique sur une base de 100 de fonds propres : les actifs de ${f(levier * 100, 0)} perdent ${f(r2((levier * 100 * chocMag) / 100), 0)}, la dette de ${f(levier * 100 - 100, 0)} ne bouge pas d'un centime — les fonds propres absorbent la perte entière.`,
        },
        {
          titre: en ? 'The survival verdict' : 'Le verdict de survie',
          contenu: en
            ? mort
              ? `The fatal shock at leverage ${f(levier, 0)} is $-100/${f(levier, 0)} = ${pct(chocFatal, 2)}$ of assets — and ${pct(-chocMag, 1)} exceeds it. Equity lands at ${f(fpRestants, 0)} per 100: **wiped out and beyond**. This is bankruptcy: the ${f(Math.abs(fpRestants), 0)} below zero is the CREDITORS' loss — which is exactly why lenders watch leverage and call margin long before this point.`
              : `The fatal shock at leverage ${f(levier, 0)} is $-100/${f(levier, 0)} = ${pct(chocFatal, 2)}$ of assets; the shock of ${pct(-chocMag, 1)} stays short of it. **It survives**, with ${f(fpRestants, 2)} of equity per 100 initially — but note the trap: leverage has mechanically RISEN to ${f(levierApres, 1)} (assets ${f(actifsApres, 0)} on equity ${f(fpRestants, 2)}). Weakened balance sheets are more levered, at the worst moment.`
            : mort
              ? `Le choc fatal au levier ${f(levier, 0)} est $-100/${f(levier, 0)} = ${pct(chocFatal, 2)}$ d'actifs — et ${pct(-chocMag, 1)} le dépasse. Les fonds propres atterrissent à ${f(fpRestants, 0)} pour 100 : **effacés, et au-delà**. C'est la faillite : les ${f(Math.abs(fpRestants), 0)} sous zéro sont la perte des CRÉANCIERS — raison exacte pour laquelle les prêteurs surveillent le levier et appellent la marge bien avant ce point.`
              : `Le choc fatal au levier ${f(levier, 0)} est $-100/${f(levier, 0)} = ${pct(chocFatal, 2)}$ d'actifs ; le choc de ${pct(-chocMag, 1)} reste en deçà. **Ça survit**, avec ${f(fpRestants, 2)} de fonds propres pour 100 au départ — mais notez le piège : le levier a mécaniquement MONTÉ à ${f(levierApres, 1)} (actifs ${f(actifsApres, 0)} sur fonds propres ${f(fpRestants, 2)}). Les bilans affaiblis sont plus leviérés, au pire moment.`,
        },
        {
          titre: en ? 'The formula works both ways' : 'La formule marche dans les deux sens',
          contenu: en
            ? `That is precisely why one levers up: at ${f(levier, 0)}×, a mere +2% on assets makes **${sgn(gainSym, 0)}%** on equity. This lived asymmetry is the behavioural engine of every bubble — during Minsky's boom phase, each levered year of gains "proves" the genius of the manager; the crash reveals that the genius was the multiplication table.`
            : `C'est précisément pour cela qu'on se lévier : à ${f(levier, 0)}×, un simple +2 % d'actifs fait **${sgn(gainSym, 0)} %** de fonds propres. Cette asymétrie vécue est le moteur comportemental de toutes les bulles — pendant la phase de boom de Minsky, chaque année de gains leviérés « prouve » le génie du gérant ; le krach révèle que le génie était la table de multiplication.`,
        },
      ],
      pieges: [
        en
          ? `Answering ${pct(-chocMag, 1)} — the assets' move — for the equity: forgetting the multiplier. The debt is FIXED; equity takes the whole variation, hence the × ${f(levier, 0)}. This one-line formula is the entire difference between a bubble that disappoints and a bubble that bankrupts.`
          : `Répondre ${pct(-chocMag, 1)} — la variation des actifs — pour les fonds propres : oublier le multiplicateur. La dette est FIXE ; les fonds propres prennent toute la variation, d'où le × ${f(levier, 0)}. Cette formule d'une ligne est toute la différence entre une bulle qui déçoit et une bulle qui ruine.`,
        en
          ? mort
            ? `Reading −100% as the floor: for the SHAREHOLDER yes, the loss stops at everything; but the hole beyond (${f(Math.abs(fpRestants), 0)} per 100 here) lands on the creditors — that is contagion's first channel (chapter 1), and why a levered failure is never a private affair.`
            : `Believing the danger has passed: equity is down ${f(Math.abs(reponse), 0)}% but leverage is UP (${f(levier, 0)} → ${f(levierApres, 1)}), so the next identical shock hits harder — and the lender may demand a return to target leverage, forcing sales under discount. The deleveraging spiral starts exactly here.`
          : mort
            ? `Lire −100 % comme un plancher : pour l'ACTIONNAIRE oui, la perte s'arrête à tout ; mais le trou au-delà (${f(Math.abs(fpRestants), 0)} pour 100 ici) tombe sur les créanciers — c'est le premier canal de la contagion (chapitre 1), et la raison pour laquelle une faillite leviérée n'est jamais une affaire privée.`
            : `Croire le danger passé : les fonds propres ont perdu ${f(Math.abs(reponse), 0)} % mais le levier a MONTÉ (${f(levier, 0)} → ${f(levierApres, 1)}), donc le prochain choc identique frappe plus fort — et le prêteur peut exiger le retour au levier cible, forçant des ventes sous décote. La spirale de désendettement commence exactement ici.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 3. Le drawdown pic-à-creux (N1)
// ---------------------------------------------------------------------------
export const genDrawdown: ExerciseGenerator = {
  id: 'm11-ex-03',
  moduleId: M11,
  titre: 'Le drawdown pic-à-creux',
  titreEn: 'The peak-to-trough drawdown',
  difficulte: 1,
  // Tirages (ordre strict) : 1. episode = pick(['1929', 'dotcom', '2008',
  // 'covid']) · 2. fracPic = randInt(0, 100) · 3. fracCreux = randInt(0, 100).
  // Les deux fractions interpolent linéairement pic et creux dans la bande
  // réaliste de l'épisode tiré (1929 : pic 355-400 / creux 41-90 ; dot-com :
  // 4800-5150 / 1110-1600 ; 2008 : 1500-1600 / 670-800 ; COVID : 3300-3400 /
  // 2230-2600) — mise en scène pure, le calcul est drawdownPct. Le gain requis
  // pour récupérer (gainRequisPourRecuperer) est chiffré en ouverture de l'ex-04.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const episode = pick(rng, ['1929', 'dotcom', '2008', 'covid'] as const);
    const fracPic = randInt(rng, 0, 100);
    const fracCreux = randInt(rng, 0, 100);

    const bandes = {
      '1929': { picMin: 355, picMax: 400, creuxMin: 41, creuxMax: 90 },
      dotcom: { picMin: 4800, picMax: 5150, creuxMin: 1110, creuxMax: 1600 },
      '2008': { picMin: 1500, picMax: 1600, creuxMin: 670, creuxMax: 800 },
      covid: { picMin: 3300, picMax: 3400, creuxMin: 2230, creuxMax: 2600 },
    } as const;
    const b = bandes[episode];
    const pic = Math.round(b.picMin + (fracPic / 100) * (b.picMax - b.picMin));
    const creux = Math.round(b.creuxMin + (fracCreux / 100) * (b.creuxMax - b.creuxMin));
    const reponse = r2(drawdownPct(pic, creux));
    const niveauResiduel = r2((creux / pic) * 100);
    const gainRequis = r2(gainRequisPourRecuperer(-reponse));

    const en = langue === 'en';
    const { f, pct, sgn } = formatters(langue);
    const contexteFr = {
      '1929': 'Sur le modèle du Dow Jones de 1929-1932, un indice actions',
      dotcom: 'Sur le modèle du Nasdaq de 2000-2002, un indice technologique',
      '2008': 'Sur le modèle du S&P 500 de 2007-2009, un indice actions',
      covid: 'Sur le modèle du S&P 500 de février-mars 2020, un indice actions',
    } as const;
    const contexteEn = {
      '1929': 'Modelled on the 1929-1932 Dow Jones, an equity index',
      dotcom: 'Modelled on the 2000-2002 Nasdaq, a technology index',
      '2008': 'Modelled on the 2007-2009 S&P 500, an equity index',
      covid: 'Modelled on the February-March 2020 S&P 500, an equity index',
    } as const;
    return {
      enonce: en
        ? `${contexteEn[episode]} peaks at ${f(pic, 0)} points, then collapses to a trough of ${f(creux, 0)} points.\n\n**What is the peak-to-trough drawdown, in % (sign included)?**`
        : `${contexteFr[episode]} culmine à ${f(pic, 0)} points, puis s'effondre jusqu'à un creux de ${f(creux, 0)} points.\n\n**Quel est le drawdown pic-à-creux, en % (signe compris) ?**`,
      reponse,
      tolerance: 0.1,
      toleranceMode: 'absolu',
      unite: '%',
      etapes: [
        {
          titre: en ? 'The formula' : 'La formule',
          contenu: en
            ? `$\\text{drawdown} = \\left(\\dfrac{\\text{trough}}{\\text{peak}} - 1\\right) × 100 = \\left(\\dfrac{${f(creux, 0)}}{${f(pic, 0)}} - 1\\right) × 100$ = **${pct(reponse, 2)}**. Negative by convention — the market-screen convention. This single number is the crash's identity card: it says what the most unlucky entrant, who bought the exact top, lived through.`
            : `$\\text{drawdown} = \\left(\\dfrac{\\text{creux}}{\\text{pic}} - 1\\right) × 100 = \\left(\\dfrac{${f(creux, 0)}}{${f(pic, 0)}} - 1\\right) × 100$ = **${pct(reponse, 2)}**. Négatif par convention — celle des écrans de marché. Ce seul chiffre est la carte d'identité du krach : il dit ce qu'a vécu le plus malchanceux des entrants, celui qui a acheté le pic exact.`,
        },
        {
          titre: en ? 'Placing it on the scale of real crashes' : 'Le placer sur l\'échelle des vrais krachs',
          contenu: en
            ? `The reference points, computed with the exact historical closes: DJIA 381.17 → 41.22 (1929-1932) = **−89.19%** ; Nasdaq 5,048.62 → 1,114.11 (2000-2002) = **−77.93%** ; S&P 500 1,565.15 → 676.53 (2007-2009) = **−56.78%** ; COVID 3,386.15 → 2,237.40 (33 days in 2020) = **−33.92%**. Your ${pct(reponse, 1)} sits on this scale — and note that 1987's single Black Monday (−22.6% in ONE day) remains unmatched for speed.`
            : `Les repères, calculés sur les clôtures historiques exactes : DJIA 381,17 → 41,22 (1929-1932) = **−89,19 %** ; Nasdaq 5 048,62 → 1 114,11 (2000-2002) = **−77,93 %** ; S&P 500 1 565,15 → 676,53 (2007-2009) = **−56,78 %** ; COVID 3 386,15 → 2 237,40 (33 jours de 2020) = **−33,92 %**. Votre ${pct(reponse, 1)} se place sur cette échelle — et notez que le lundi noir de 1987 (−22,6 % en UN jour) reste inégalé pour la vitesse.`,
        },
        {
          titre: en ? 'What the number does not yet say' : 'Ce que le chiffre ne dit pas encore',
          contenu: en
            ? `The trough leaves ${f(niveauResiduel, 1)} of every 100 invested at the peak — and getting back requires a gain of **${sgn(gainRequis, 1)}%** (next exercise: the asymmetry of losses). Nor does the drawdown say the DURATION: Kindleberger's "revulsion" lasting a generation is why the Dow needed 25 years to see its 1929 peak again. A drawdown is the beginning of a story, never its end.`
            : `Le creux laisse ${f(niveauResiduel, 1)} de chaque 100 investi au pic — et le retour exige un gain de **${sgn(gainRequis, 1)} %** (exercice suivant : l'asymétrie des pertes). Le drawdown ne dit pas non plus la DURÉE : la « révulsion » de Kindleberger, qui dure une génération, est la raison des 25 ans mis par le Dow pour revoir son pic de 1929. Un drawdown est le début d'une histoire, jamais sa fin.`,
        },
      ],
      pieges: [
        en
          ? `Answering ${f(niveauResiduel, 1)} (trough/peak × 100) : that is the RESIDUAL level, not the variation — the "− 1" is the whole point. A quick sanity check: a drawdown lives between 0 and −100%; anything positive or below −100 is wrong before being checked.`
          : `Répondre ${f(niveauResiduel, 1)} (creux/pic × 100) : c'est le niveau RÉSIDUEL, pas la variation — le « − 1 » est tout le sujet. Garde-fou rapide : un drawdown vit entre 0 et −100 % ; tout résultat positif ou sous −100 est faux avant vérification.`,
        en
          ? `Measuring from one's own entry point or as an annual average: the drawdown is defined from the PEAK to the TROUGH — it is a measure of worst-case sequence risk, not of average performance. An index can post a fine decade average and still have ruined, mid-way, everyone who was forced to sell at the trough.`
          : `Mesurer depuis son propre point d'entrée ou en moyenne annuelle : le drawdown se définit du PIC au CREUX — c'est une mesure du pire risque de séquence, pas de la performance moyenne. Un indice peut afficher une belle moyenne sur la décennie et avoir ruiné, à mi-chemin, tous ceux qui ont été forcés de vendre au creux.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 4. L'asymétrie des pertes (N2)
// ---------------------------------------------------------------------------
export const genAsymetriePertes: ExerciseGenerator = {
  id: 'm11-ex-04',
  moduleId: M11,
  titre: 'L\'asymétrie des pertes',
  titreEn: 'The asymmetry of losses',
  difficulte: 2,
  // Tirages (ordre strict) : 1. perte = randInt(20, 90).
  // Réponse = gainRequisPourRecuperer(perte) — perte en magnitude POSITIVE,
  // la convention de calculs.ts. La référence historique de l'énoncé se
  // déduit de la taille de la perte (≥ 80 : 1932 ; 40-79 : 2000-2002/2008 ;
  // < 40 : 1987), sans tirage supplémentaire. Le piège du corrigé : pourquoi
  // ce n'est PAS symétrique — la base change, −p puis +p laisse à 100 − p²/100.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const perte = randInt(rng, 20, 90);

    const reponse = r2(gainRequisPourRecuperer(perte));
    const reste = 100 - perte;
    const multiple = r2(100 / reste);
    const fauxSym = r2(100 - (perte * perte) / 100);

    const en = langue === 'en';
    const { f, pct, sgn } = formatters(langue);
    const refFr =
      perte >= 80
        ? 'du calibre du Dow Jones de 1929-1932'
        : perte >= 40
          ? 'du calibre du Nasdaq de 2000-2002 ou du S&P 500 de 2008'
          : 'du calibre de l\'automne 1987';
    const refEn =
      perte >= 80
        ? 'of the 1929-1932 Dow Jones calibre'
        : perte >= 40
          ? 'of the 2000-2002 Nasdaq or 2008 S&P 500 calibre'
          : 'of the autumn 1987 calibre';
    return {
      enonce: en
        ? `A crash ${refEn} leaves a portfolio down ${pct(perte, 0)} from its peak.\n\n**What gain, in %, is now required to return exactly to the starting point?**`
        : `Un krach ${refFr} laisse un portefeuille en perte de ${pct(perte, 0)} depuis son pic.\n\n**Quel gain, en %, faut-il désormais pour revenir exactement au point de départ ?**`,
      reponse,
      tolerance: 0.005,
      toleranceMode: 'relatif',
      unite: '%',
      etapes: [
        {
          titre: en ? 'Reason on what REMAINS' : 'Raisonner sur ce qui RESTE',
          contenu: en
            ? `After ${pct(-perte, 0)}, there remain ${f(reste, 0)} per 100 invested. Getting back to 100 means multiplying what remains by $\\dfrac{100}{${f(reste, 0)}} = ${f(multiple, 2)}$, i.e. a gain of $\\dfrac{100}{100 - ${f(perte, 0)}} - 1$ = **${sgn(reponse, 2)}%**. The required gain is computed on the shrunken base — that is the entire secret.`
            : `Après ${pct(-perte, 0)}, il reste ${f(reste, 0)} pour 100 investis. Revenir à 100, c'est multiplier ce qui reste par $\\dfrac{100}{${f(reste, 0)}} = ${f(multiple, 2)}$, soit un gain de $\\dfrac{100}{100 - ${f(perte, 0)}} - 1$ = **${sgn(reponse, 2)} %**. Le gain requis se calcule sur la base rétrécie — c'est tout le secret.`,
        },
        {
          titre: en ? 'The convexity that explodes' : 'La convexité qui explose',
          contenu: en
            ? `Memorise three anchor points: −22.6% (Black Monday 1987) requires "only" +29.2%; −50% requires +100% (doubling!); −89% (the Dow of 1932) requires +809%. The function $100/(100-p) - 1$ is CONVEX: each additional point of loss costs more and more to buy back — from −80 to −90, the required gain jumps from +400% to +900%. The zone where linear intuition is most wrong is exactly the zone of real crashes.`
            : `Mémorisez trois points d'ancrage : −22,6 % (lundi noir 1987) n'exige « que » +29,2 % ; −50 % exige +100 % (doubler !) ; −89 % (le Dow de 1932) exige +809 %. La fonction $100/(100-p) - 1$ est CONVEXE : chaque point de perte supplémentaire coûte de plus en plus cher à racheter — de −80 à −90, le gain requis saute de +400 % à +900 %. La zone où l'intuition linéaire est la plus fausse est exactement celle des vrais krachs.`,
        },
        {
          titre: en ? 'Why it is NOT symmetric' : 'Pourquoi ce n\'est PAS symétrique',
          contenu: en
            ? `Percentages are not symmetric units because the BASE changes along the way: the loss is measured on 100, the required gain on ${f(reste, 0)}. Down ${f(perte, 0)}% then up ${f(perte, 0)}% lands at $(1 - ${f(perte, 0)}\\,\\%)(1 + ${f(perte, 0)}\\,\\%) × 100 = ${f(fauxSym, 1)}$ — the naive round trip loses $p^2/100$ every time. This asymmetry, plus time (ex-05), is why Kindleberger's revulsion lasts a generation: the Dow needed 25 years to revisit its 1929 peak.`
            : `Les pourcentages ne sont pas des unités symétriques parce que la BASE change en chemin : la perte se mesure sur 100, le gain requis sur ${f(reste, 0)}. Perdre ${f(perte, 0)} % puis gagner ${f(perte, 0)} % atterrit à $(1 - ${f(perte, 0)}\\,\\%)(1 + ${f(perte, 0)}\\,\\%) × 100 = ${f(fauxSym, 1)}$ — l'aller-retour naïf perd $p^2/100$ à chaque fois. Cette asymétrie, plus le temps (ex-05), explique que la révulsion de Kindleberger dure une génération : le Dow a mis 25 ans à revoir son pic de 1929.`,
        },
      ],
      pieges: [
        en
          ? `Answering +${f(perte, 0)}% (naive symmetry): after ${pct(-perte, 0)}, a gain of ${f(perte, 0)}% only brings the portfolio back to ${f(fauxSym, 1)} per 100 — still ${f(r2(100 - fauxSym), 1)} short. THE most profitable mental-arithmetic trap in interviews: whenever you are given a drawdown, compute the required gain BEFORE talking about the rebound.`
          : `Répondre +${f(perte, 0)} % (la symétrie naïve) : après ${pct(-perte, 0)}, un gain de ${f(perte, 0)} % ne ramène le portefeuille qu'à ${f(fauxSym, 1)} pour 100 — il manque encore ${f(r2(100 - fauxSym), 1)}. LE piège de calcul mental le plus rentable en entretien : quand on vous donne un drawdown, calculez le gain requis AVANT de parler de rebond.`,
        en
          ? `Eyeballing large losses linearly: between −80% and −90%, ten points of extra loss more than double the required gain (+400% → +900%). Large drawdowns are not "a bit worse" — they are a different category of event, which is why leverage (which manufactures them) and forced selling (which locks them in) matter so much.`
          : `Estimer les grosses pertes « à la louche » linéairement : entre −80 % et −90 %, dix points de perte supplémentaires font plus que doubler le gain requis (+400 % → +900 %). Les grands drawdowns ne sont pas « un peu pires » — c'est une autre catégorie d'événement, et c'est pourquoi le levier (qui les fabrique) et la vente forcée (qui les verrouille) comptent autant.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 5. Les années de récupération (N2)
// ---------------------------------------------------------------------------
export const genAnneesRecuperation: ExerciseGenerator = {
  id: 'm11-ex-05',
  moduleId: M11,
  titre: 'Les années de récupération',
  titreEn: 'The years to recover',
  difficulte: 2,
  // Tirages (ordre strict) : 1. perte = randInt(30, 85) · 2. croissance =
  // pick([3, 5, 7, 10]).
  // Réponse = anneesDeRecuperation(perte, croissance). Le corrigé chiffre la
  // sensibilité à l'hypothèse de croissance en recalculant à g − 2 et g + 2
  // (g − 2 ≥ 1 par construction des bornes). Les deux pièges recalculent les
  // faux naturels perte/g et gainRequis/g.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const perte = randInt(rng, 30, 85);
    const croissance = pick(rng, [3, 5, 7, 10] as const);

    const reponse = r2(anneesDeRecuperation(perte, croissance));
    const gainRequis = r2(gainRequisPourRecuperer(perte));
    const gBas = croissance - 2;
    const gHaut = croissance + 2;
    const annBas = r2(anneesDeRecuperation(perte, gBas));
    const annHaut = r2(anneesDeRecuperation(perte, gHaut));
    const fauxPerteSurG = r2(perte / croissance);
    const fauxGainSurG = r2(gainRequis / croissance);

    const en = langue === 'en';
    const { f, pct, sgn } = formatters(langue);
    return {
      enonce: en
        ? `The morning after a crash, an index is down ${pct(perte, 0)} from its peak. Assume it now grows steadily at ${pct(croissance, 0)} per year.\n\n**How many years does it take to return to the peak?**`
        : `Au lendemain d'un krach, un indice a perdu ${pct(perte, 0)} depuis son pic. On suppose qu'il croît désormais régulièrement à ${pct(croissance, 0)} par an.\n\n**Combien d'années faut-il pour revenir au pic ?**`,
      reponse,
      tolerance: 0.1,
      toleranceMode: 'absolu',
      unite: en ? 'years' : 'ans',
      etapes: [
        {
          titre: en ? 'First, the required gain' : 'D\'abord, le gain requis',
          contenu: en
            ? `The asymmetry of losses (previous exercise) sets the size of the mountain: after ${pct(-perte, 0)}, returning to the peak requires **${sgn(gainRequis, 1)}%** — computed on what remains (${f(100 - perte, 0)} per 100), never on the starting base. It is this gain, not the loss, that time must deliver.`
            : `L'asymétrie des pertes (exercice précédent) donne la taille de la montagne : après ${pct(-perte, 0)}, revenir au pic exige **${sgn(gainRequis, 1)} %** — calculé sur ce qui reste (${f(100 - perte, 0)} pour 100), jamais sur la base de départ. C'est ce gain-là, pas la perte, que le temps doit livrer.`,
        },
        {
          titre: en ? 'Then the logarithm' : 'Puis le logarithme',
          contenu: en
            ? `Steady compound growth of ${pct(croissance, 0)} per year must satisfy $(1 + g)^n = \\dfrac{1}{1 - p}$, hence $n = \\dfrac{\\ln\\!\\left(1/(1 - ${f(perte, 0)}\\,\\%)\\right)}{\\ln(1 + ${f(croissance, 0)}\\,\\%)}$ = **${f(reponse, 1)} years**. The course anchors: recovering −50% at 7%/year takes 10.2 years; −89% at 7%/year would take 32.6 — the order of magnitude of the Dow's quarter-century.`
            : `Une croissance composée régulière de ${pct(croissance, 0)} par an doit satisfaire $(1 + g)^n = \\dfrac{1}{1 - p}$, d'où $n = \\dfrac{\\ln\\!\\left(1/(1 - ${f(perte, 0)}\\,\\%)\\right)}{\\ln(1 + ${f(croissance, 0)}\\,\\%)}$ = **${f(reponse, 1)} ans**. Les ancres du cours : récupérer −50 % à 7 %/an prend 10,2 ans ; −89 % à 7 %/an en prendrait 32,6 — l'ordre de grandeur du quart de siècle du Dow.`,
        },
        {
          titre: en ? 'The fragile hypothesis: growth' : 'L\'hypothèse fragile : la croissance',
          contenu: en
            ? `Re-run the computation around the assumption: at ${pct(gBas, 0)}/year, **${f(annBas, 1)} years**; at ${pct(gHaut, 0)}/year, **${f(annHaut, 1)} years**. A couple of points of growth swing the answer by ${f(r2(annBas - annHaut), 1)} years — the growth assumption is THE fragile variable, not the formula. Historical honesty cuts both ways: dividends and the 1930s deflation made the Dow's real total-return recovery faster than the 25 years of the price alone; conversely, post-bubble revulsion often means BELOW-average growth exactly when it is needed.`
            : `Refaites tourner le calcul autour de l'hypothèse : à ${pct(gBas, 0)}/an, **${f(annBas, 1)} ans** ; à ${pct(gHaut, 0)}/an, **${f(annHaut, 1)} ans**. Deux points de croissance déplacent la réponse de ${f(r2(annBas - annHaut), 1)} ans — l'hypothèse de croissance est LA variable fragile, pas la formule. L'honnêteté historique joue dans les deux sens : dividendes et déflation des années 30 ont rendu la récupération du Dow en rendement total réel plus rapide que les 25 ans du prix seul ; à l'inverse, la révulsion post-bulle signifie souvent une croissance SOUS la moyenne exactement quand on en a besoin.`,
        },
      ],
      pieges: [
        en
          ? `Dividing the loss by the growth rate: $${f(perte, 0)}/${f(croissance, 0)} = ${f(fauxPerteSurG, 1)}$ years — wrong twice over. It ignores the asymmetry (what must be earned is ${sgn(gainRequis, 1)}%, not ${f(perte, 0)}%) AND the compounding of growth. The error is largest exactly for the deepest losses.`
          : `Diviser la perte par la croissance : $${f(perte, 0)}/${f(croissance, 0)} = ${f(fauxPerteSurG, 1)}$ ans — faux deux fois. Cela ignore l'asymétrie (ce qu'il faut gagner est ${sgn(gainRequis, 1)} %, pas ${f(perte, 0)} %) ET la composition de la croissance. L'erreur est maximale précisément pour les pertes les plus profondes.`,
        en
          ? `Dividing the required gain by the growth rate: $${f(gainRequis, 1)}/${f(croissance, 0)} = ${f(fauxGainSurG, 1)}$ years against ${f(reponse, 1)} exact. Better, but still wrong: growth COMPOUNDS, the path is geometric — each year's gain grows on an already higher base, which is why the logarithm, not a division, answers "how long".`
          : `Diviser le gain requis par la croissance : $${f(gainRequis, 1)}/${f(croissance, 0)} = ${f(fauxGainSurG, 1)}$ ans contre ${f(reponse, 1)} exact. Mieux, mais toujours faux : la croissance se COMPOSE, le chemin est géométrique — le gain de chaque année pousse sur une base déjà plus haute, et c'est pourquoi c'est le logarithme, pas une division, qui répond à « combien de temps ».`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 6. Le run sur le repo (N2)
// ---------------------------------------------------------------------------
export const genRunRepo: ExerciseGenerator = {
  id: 'm11-ex-06',
  moduleId: M11,
  titre: 'Le run sur le repo',
  titreEn: 'The run on repo',
  difficulte: 2,
  // Tirages (ordre strict) : 1. valeurTitres = pick([50, 80, 100, 150, 200])
  // (Md$) · 2. haircutInitial = pick([1, 1.5, 2, 2.5, 3]) · 3. haircutCrise =
  // randInt(15, 40).
  // Financement avant/après par financementRepo ; réponse = le trou (avant −
  // après), en Md$, exigible le jour même — la ruée sur les haircuts de Gorton
  // (chapitre 5). Le levier implicite du haircut initial (levierMaximalRepo)
  // est chiffré dans le corrigé, pont vers l'ex-07.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const valeurTitres = pick(rng, [50, 80, 100, 150, 200] as const);
    const haircutInitial = pick(rng, [1, 1.5, 2, 2.5, 3] as const);
    const haircutCrise = randInt(rng, 15, 40);

    const avant = r2(financementRepo(valeurTitres, haircutInitial));
    const apres = r2(financementRepo(valeurTitres, haircutCrise));
    const reponse = r2(avant - apres);
    const levierImplicite = r2(levierMaximalRepo(haircutInitial));
    const levierCrise = r2(levierMaximalRepo(haircutCrise));
    const fauxVFoisH1 = r2((valeurTitres * haircutCrise) / 100);

    const en = langue === 'en';
    const { f, pct, md } = formatters(langue);
    return {
      enonce: en
        ? `Autumn 2008. A broker-dealer funds a ${md(valeurTitres)} portfolio of structured securities in overnight repo. Yesterday the haircut was ${pct(haircutInitial, 1)}; this morning, its lenders demand ${pct(haircutCrise, 0)} on the very same portfolio.\n\n**How much funding evaporates, in $bn, to be found this very day?**`
        : `Automne 2008. Un broker-dealer finance un portefeuille de ${md(valeurTitres)} de titres structurés en repo au jour le jour. Hier, le haircut était de ${pct(haircutInitial, 1)} ; ce matin, ses prêteurs exigent ${pct(haircutCrise, 0)} sur le même portefeuille.\n\n**Combien de financement s'évapore, en Md$, à trouver le jour même ?**`,
      reponse,
      tolerance: 0.005,
      toleranceMode: 'relatif',
      unite: en ? '$bn' : 'Md$',
      etapes: [
        {
          titre: en ? 'Yesterday\'s funding' : 'Le financement d\'hier',
          contenu: en
            ? `Repo funding is the securities' value minus the lender's cushion: $${f(valeurTitres, 0)} × (1 - ${f(haircutInitial, 1)}\\,\\%)$ = **${md(avant, 2)}**. A ${pct(haircutInitial, 1)} haircut is peacetime pricing — and it implicitly allows a leverage of $100/${f(haircutInitial, 1)} = ${f(levierImplicite, 0)}$, invisible in any regulatory ratio.`
            : `Le financement repo est la valeur des titres moins le coussin du prêteur : $${f(valeurTitres, 0)} × (1 - ${f(haircutInitial, 1)}\\,\\%)$ = **${md(avant, 2)}**. Un haircut de ${pct(haircutInitial, 1)} est un prix de temps calme — et il autorise implicitement un levier de $100/${f(haircutInitial, 1)} = ${f(levierImplicite, 0)}$, invisible dans tout ratio réglementaire.`,
        },
        {
          titre: en ? 'This morning\'s funding — and the hole' : 'Le financement de ce matin — et le trou',
          contenu: en
            ? `The lender did not say no; he said ${pct(haircutCrise, 0)}: $${f(valeurTitres, 0)} × (1 - ${f(haircutCrise, 0)}\\,\\%)$ = **${md(apres, 2)}**. The hole is $${f(avant, 2)} - ${f(apres, 2)}$ = **${md(reponse, 2)}** — and because repo rolls every morning, it is due TODAY. Same portfolio, same market value, no default anywhere: only the cushion demanded has changed, and that alone withdraws ${md(reponse, 2)} of funding.`
            : `Le prêteur n'a pas dit non ; il a dit ${pct(haircutCrise, 0)} : $${f(valeurTitres, 0)} × (1 - ${f(haircutCrise, 0)}\\,\\%)$ = **${md(apres, 2)}**. Le trou est $${f(avant, 2)} - ${f(apres, 2)}$ = **${md(reponse, 2)}** — et parce que le repo se renouvelle chaque matin, il est exigible AUJOURD'HUI. Même portefeuille, même valeur de marché, aucun défaut nulle part : seul le coussin exigé a changé, et cela seul retire ${md(reponse, 2)} de financement.`,
        },
        {
          titre: en ? 'Gorton\'s run on haircuts' : 'La ruée sur les haircuts de Gorton',
          contenu: en
            ? `The 2008 run had no queue at any counter: it was THIS number moving, between institutions, on screens only treasurers watched. The way out is the fire sale under discount (ex-08) — which depresses prices, widens everyone else's haircuts, and forces new sales: the chapter-1 spiral in closed loop. And the crisis haircut of ${pct(haircutCrise, 0)} collapses the permitted leverage from ${f(levierImplicite, 0)} to ${f(levierCrise, 1)}: the whole shadow-banking system must deleverage at once. Repo and ABCP were the institutions' "deposits" — without deposit insurance: the pre-1934 bank, rebuilt without the extinguisher.`
            : `Le run de 2008 n'a fait la queue à aucun guichet : c'est CE nombre qui a bougé, entre institutions, sur des écrans que seuls les trésoriers regardaient. L'issue est la vente forcée sous décote (ex-08) — qui déprime les prix, élargit les haircuts des autres, et force de nouvelles ventes : la spirale du chapitre 1 en boucle fermée. Et le haircut de crise de ${pct(haircutCrise, 0)} effondre le levier permis de ${f(levierImplicite, 0)} à ${f(levierCrise, 1)} : tout le système bancaire parallèle doit désendetter en même temps. Le repo et l'ABCP étaient les « dépôts » des institutionnels — sans assurance des dépôts : la banque d'avant 1934, reconstruite sans l'extincteur.`,
        },
      ],
      pieges: [
        en
          ? `Reading the haircut as a price — an interest rate that makes funding "more expensive": a haircut move does not raise the cost of the money, it WITHDRAWS the money. ${md(reponse, 2)} of principal vanish overnight; no profitability, however good, absorbs a funding withdrawal of that size in one day.`
          : `Lire le haircut comme un prix — un taux d'intérêt qui « renchérit » le financement : une hausse de haircut ne renchérit pas l'argent, elle le RETIRE. ${md(reponse, 2)} de principal s'évaporent du jour au lendemain ; aucune rentabilité, si bonne soit-elle, n'absorbe un retrait de financement de cette taille en un jour.`,
        en
          ? `Computing the hole as value × new haircut: $${f(valeurTitres, 0)} × ${f(haircutCrise, 0)}\\,\\% = ${f(fauxVFoisH1, 2)}$ — forgetting that ${f(r2((valeurTitres * haircutInitial) / 100), 2)} was already unfunded yesterday. The hole is the CHANGE in cushion, value × (new − old haircut) = ${md(reponse, 2)}: what matters in a run is never the level, it is the move.`
          : `Calculer le trou comme valeur × nouveau haircut : $${f(valeurTitres, 0)} × ${f(haircutCrise, 0)}\\,\\% = ${f(fauxVFoisH1, 2)}$ — en oubliant que ${f(r2((valeurTitres * haircutInitial) / 100), 2)} n'étaient déjà pas financés hier. Le trou est la VARIATION du coussin, valeur × (haircut nouveau − ancien) = ${md(reponse, 2)} : dans un run, ce qui compte n'est jamais le niveau, c'est le mouvement.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 7. Le levier maximal du haircut (N2)
// ---------------------------------------------------------------------------
export const genLevierMaximalHaircut: ExerciseGenerator = {
  id: 'm11-ex-07',
  moduleId: M11,
  titre: 'Le levier maximal du haircut',
  titreEn: 'The maximum leverage a haircut allows',
  difficulte: 2,
  // Tirages (ordre strict) : 1. haircut = pick([0.5, 1, 2, 2.5, 4, 5, 10]) ·
  // 2. capital = pick([1, 2, 5]) (Md$).
  // Réponse = levierMaximalRepo(haircut) = 100/h — valeurs propres (10 à 200).
  // Le corrigé chiffre les actifs maximaux portables avec le capital tiré et
  // la distance à la mort au levier plein (variationActifsFatale), puis la
  // lecture LTCM (haircuts quasi nuls, 125 Md$ sur 4,7 Md$).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const haircut = pick(rng, [0.5, 1, 2, 2.5, 4, 5, 10] as const);
    const capital = pick(rng, [1, 2, 5] as const);

    const reponse = r2(levierMaximalRepo(haircut));
    const actifsMax = r2(capital * reponse);
    const chocFatal = r2(variationActifsFatale(reponse));

    const en = langue === 'en';
    const { f, pct, md } = formatters(langue);
    return {
      enonce: en
        ? `A fund obtains a ${pct(haircut, 1)} haircut from its repo lenders on its collateral, and can pledge the proceeds of each borrowing again — buy securities, repo them, buy again, and so on.\n\n**What maximum leverage does this haircut allow (unitless multiple)?**`
        : `Un fonds obtient de ses prêteurs repo un haircut de ${pct(haircut, 1)} sur son collatéral, et peut re-nantir le produit de chaque emprunt — acheter des titres, les mettre en repo, racheter, et ainsi de suite.\n\n**Quel levier maximal ce haircut autorise-t-il (multiple sans unité) ?**`,
      reponse,
      tolerance: 0.5,
      toleranceMode: 'absolu',
      etapes: [
        {
          titre: en ? 'The re-pledging mechanics' : 'La mécanique du re-nantissement',
          contenu: en
            ? `Start with 1 of capital: buy 1 of securities, repo them for $1 - h$, buy again, repo again for $(1-h)^2$… The geometric series sums to $1/h$ of assets per 1 of capital: $\\text{max leverage} = \\dfrac{100}{${f(haircut, 1)}}$ = **${f(reponse, 0)}**. Each round, the lender keeps only the haircut as a cushion — so the haircut IS the system's true capital requirement.`
            : `Partez de 1 de capital : achetez 1 de titres, mettez-les en repo contre $1 - h$, rachetez, re-repo contre $(1-h)^2$… La série géométrique somme à $1/h$ d'actifs par 1 de capital : $\\text{levier max} = \\dfrac{100}{${f(haircut, 1)}}$ = **${f(reponse, 0)}**. À chaque tour, le prêteur ne garde que le haircut en coussin — le haircut EST donc la vraie exigence de capital du système.`,
        },
        {
          titre: en ? 'In assets — and in distance to death' : 'En actifs — et en distance à la mort',
          contenu: en
            ? `With ${md(capital)} of capital, this haircut lets the fund carry up to **${md(actifsMax)}** of assets. And at full leverage, the fatal shock is $-100/${f(reponse, 0)}$ = **${pct(chocFatal, 2)}** of assets: the smaller the haircut, the bigger the balance sheet AND the thinner the survivable shock — the two faces of the same division.`
            : `Avec ${md(capital)} de capital, ce haircut permet de porter jusqu'à **${md(actifsMax)}** d'actifs. Et au levier plein, le choc fatal est $-100/${f(reponse, 0)}$ = **${pct(chocFatal, 2)}** d'actifs : plus le haircut est petit, plus le bilan est gros ET plus le choc survivable est mince — les deux faces de la même division.`,
        },
        {
          titre: en ? 'The LTCM reading' : 'La lecture LTCM',
          contenu: en
            ? `LTCM was so courted that it negotiated near-zero haircuts — and a 2% haircut alone permits leverage of 50. That is how $125bn of assets sat on $4.7bn of capital (leverage ≈ 27, comfortably below the theoretical maximum of its haircuts): the Nobel prestige was not an image, it was a FUNDING CONDITION. The haircut is the shadow system's private regulator — and a procyclical one: generous in calm times, brutal in crisis (previous exercise), exactly backwards from what stability would require.`
            : `LTCM était si courtisé qu'il négociait des haircuts quasi nuls — et un haircut de 2 % autorise à lui seul un levier de 50. C'est ainsi que 125 Md$ d'actifs ont tenu sur 4,7 Md$ de capital (levier ≈ 27, confortablement sous le maximum théorique de ses haircuts) : le prestige des Nobel n'était pas une image, c'était une CONDITION DE FINANCEMENT. Le haircut est le régulateur privé du système parallèle — et un régulateur procyclique : généreux par temps calme, brutal en crise (exercice précédent), exactement à l'envers de ce que la stabilité exigerait.`,
        },
      ],
      pieges: [
        en
          ? `Getting the relation upside down or mis-scaled: a ${pct(haircut, 1)} haircut does not cap leverage at ${f(r2(100 - haircut), 1)} or at ${f(r2(haircut), 1)} — the anchors are 10% ⇒ 10, 2% ⇒ 50, 1% ⇒ 100. The relation 100/h is a HYPERBOLA: halving the haircut doubles the permitted leverage, which is why the last basis points of haircut negotiation are worth fortunes.`
          : `Prendre la relation à l'envers ou à la mauvaise échelle : un haircut de ${pct(haircut, 1)} ne plafonne le levier ni à ${f(r2(100 - haircut), 1)} ni à ${f(r2(haircut), 1)} — les ancres sont 10 % ⇒ 10, 2 % ⇒ 50, 1 % ⇒ 100. La relation 100/h est une HYPERBOLE : diviser le haircut par deux double le levier permis, et c'est pourquoi les derniers points de base de négociation de haircut valent des fortunes.`,
        en
          ? `Treating the maximum leverage as an acquired right: the haircut is repriced every morning. When it jumps from 2% to 25% (2008), the permitted leverage collapses from 50 to 4 — and every levered player must shrink AT THE SAME TIME, into the same falling prices. A micro funding parameter becomes the macro deleveraging of an entire system.`
          : `Traiter le levier maximal comme un droit acquis : le haircut est re-coté chaque matin. Quand il saute de 2 % à 25 % (2008), le levier permis s'effondre de 50 à 4 — et tous les acteurs leviérés doivent maigrir EN MÊME TEMPS, dans les mêmes prix qui baissent. Un paramètre micro de financement devient le désendettement macro d'un système entier.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 8. La vente forcée sous décote (N2)
// ---------------------------------------------------------------------------
export const genVenteForcee: ExerciseGenerator = {
  id: 'm11-ex-08',
  moduleId: M11,
  titre: 'La vente forcée sous décote',
  titreEn: 'The fire sale under a discount',
  difficulte: 2,
  // Tirages (ordre strict) : 1. besoinCash = randInt(10, 40) (Md) · 2. decote =
  // pick([2, 4, 5, 8, 10]) · 3. habillage = pick(['repo2008', 'gilts2022',
  // 'marge1987']).
  // Réponse = venteForceePourCash(besoin, décote), en Md ($ ou £ selon
  // l'habillage — la devise ne change aucun nombre). Le corrigé recalcule la
  // vente à décote DOUBLÉE : la décote qui monte fait vendre PLUS — le moteur
  // de la spirale 1987/2008/2022, et ce que le pompier écrase (BoE, 13 jours).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const besoinCash = randInt(rng, 10, 40);
    const decote = pick(rng, [2, 4, 5, 8, 10] as const);
    const habillage = pick(rng, ['repo2008', 'gilts2022', 'marge1987'] as const);

    const reponse = r2(venteForceePourCash(besoinCash, decote));
    const coutSec = r2(reponse - besoinCash);
    const decoteDouble = decote * 2;
    const venteDouble = r2(venteForceePourCash(besoinCash, decoteDouble));
    const deltaVente = r2(venteDouble - reponse);
    const fauxMult = r2(besoinCash * (1 + decote / 100));
    const manqueSiVendBesoin = r2((besoinCash * decote) / 100);
    const dev = habillage === 'gilts2022' ? '£' : '$';

    const en = langue === 'en';
    const { f, pct, md } = formatters(langue);
    const m = (v: number, d = 2) => md(v, d, dev);
    return {
      enonce: en
        ? habillage === 'gilts2022'
          ? `Late September 2022. An LDI fund must post ${m(besoinCash, 0)} of collateral today for its margin calls. The long-gilt market is so impaired that any urgent block sale suffers a ${pct(decote, 0)} liquidation discount.\n\n**What pre-discount market value must it sell, in £bn?**`
          : habillage === 'repo2008'
            ? `Autumn 2008. Stripped of ${m(besoinCash, 0)} of repo funding overnight, a broker-dealer must raise that cash today, in a market where any block sale suffers a ${pct(decote, 0)} liquidation discount.\n\n**What pre-discount market value must it sell, in $bn?**`
            : `October 19, 1987, late afternoon. To honour the evening's margin calls, a leveraged manager must raise ${m(besoinCash, 0)} of cash; blocks only find buyers at a ${pct(decote, 0)} discount.\n\n**What pre-discount market value must he sell, in $bn?**`
        : habillage === 'gilts2022'
          ? `Fin septembre 2022. Un fonds LDI doit poster ${m(besoinCash, 0)} de collatéral aujourd'hui pour ses appels de marge. Le marché des gilts longs est si dégradé que toute vente en bloc en urgence subit une décote de liquidation de ${pct(decote, 0)}.\n\n**Quelle valeur de marché pré-décote doit-il vendre, en Md£ ?**`
          : habillage === 'repo2008'
            ? `Automne 2008. Privé du jour au lendemain de ${m(besoinCash, 0)} de financement repo, un broker-dealer doit lever ce cash aujourd'hui, dans un marché où toute vente en bloc subit une décote de liquidation de ${pct(decote, 0)}.\n\n**Quelle valeur de marché pré-décote doit-il vendre, en Md$ ?**`
            : `19 octobre 1987, fin d'après-midi. Pour honorer les appels de marge du soir, un gérant leviéré doit lever ${m(besoinCash, 0)} de cash ; les blocs ne trouvent preneur qu'avec une décote de ${pct(decote, 0)}.\n\n**Quelle valeur de marché pré-décote doit-il vendre, en Md$ ?**`,
      reponse,
      tolerance: 0.005,
      toleranceMode: 'relatif',
      unite: en ? `${dev}bn` : `Md${dev}`,
      etapes: [
        {
          titre: en ? 'Each unit sold yields only 1 − d' : 'Chaque unité vendue ne rapporte que 1 − d',
          contenu: en
            ? `Selling S of market value under a discount d brings in only $S × (1 - d)$ of cash. To raise ${f(besoinCash, 0)}: $S = \\dfrac{${f(besoinCash, 0)}}{1 - ${f(decote, 0)}\\,\\%}$ = **${m(reponse)}**. Check the loop: ${f(reponse, 2)} × (1 − ${f(decote, 0)} %) = ${f(besoinCash, 0)} ✓. The division by (1 − d) — never a multiplication — is the fire-sale arithmetic.`
            : `Vendre S de valeur de marché sous une décote d ne rapporte que $S × (1 - d)$ de cash. Pour lever ${f(besoinCash, 0)} : $S = \\dfrac{${f(besoinCash, 0)}}{1 - ${f(decote, 0)}\\,\\%}$ = **${m(reponse)}**. Vérification en boucle : ${f(reponse, 2)} × (1 − ${f(decote, 0)} %) = ${f(besoinCash, 0)} ✓. La division par (1 − d) — jamais une multiplication — est l'arithmétique de la vente forcée.`,
        },
        {
          titre: en ? 'The dry cost' : 'Le coût sec',
          contenu: en
            ? `The seller parts with ${m(reponse)} of assets to pocket ${m(besoinCash, 0)}: the difference, **${m(coutSec)}**, is burned in discount — a REALISED loss, taken straight out of equity, in exchange for nothing but survival until tomorrow. Forced selling does not just shrink the balance sheet: it wounds it on the way out.`
            : `Le vendeur se sépare de ${m(reponse)} d'actifs pour empocher ${m(besoinCash, 0)} : la différence, **${m(coutSec)}**, est brûlée en décote — une perte RÉALISÉE, prélevée directement sur les fonds propres, en échange de rien d'autre que la survie jusqu'à demain. La vente forcée ne réduit pas seulement le bilan : elle le blesse en sortant.`,
        },
        {
          titre: en ? 'A rising discount forces MORE selling' : 'La décote qui monte fait vendre PLUS',
          contenu: en
            ? `Re-run the computation at a ${pct(decoteDouble, 0)} discount: $${f(besoinCash, 0)}/(1 - ${f(decoteDouble, 0)}\\,\\%)$ = **${m(venteDouble)}** — ${m(deltaVente)} MORE to sell for the same cash need. And each extra sale depresses prices, which widens the discount, which forces more selling: 1987 (portfolio insurance), 2008 (CDOs), 2022 (gilts) all ran this exact loop. Hence the fire brigade's real lever: the BoE did not buy the whole gilt market — thirteen business days, about £19bn — it CRUSHED the discount, and the spiral died in hours.`
            : `Refaites le calcul à ${pct(decoteDouble, 0)} de décote : $${f(besoinCash, 0)}/(1 - ${f(decoteDouble, 0)}\\,\\%)$ = **${m(venteDouble)}** — soit ${m(deltaVente)} de PLUS à vendre pour le même besoin de cash. Et chaque vente supplémentaire déprime les prix, ce qui élargit la décote, ce qui force à vendre plus : 1987 (assurance de portefeuille), 2008 (CDO), 2022 (gilts) ont tourné exactement sur cette boucle. D'où le vrai levier du pompier : la BoE n'a pas acheté tout le marché des gilts — treize jours ouvrés, environ 19 Md£ — elle a ÉCRASÉ la décote, et la spirale s'est éteinte en heures.`,
        },
      ],
      pieges: [
        en
          ? `Selling exactly ${m(besoinCash, 0)}: under the discount it yields only ${f(r2(besoinCash * (1 - decote / 100)), 2)} — ${m(manqueSiVendBesoin)} short. And coming back to the market tomorrow costs more: the discount will have widened, partly BECAUSE of today's sale. In a fire sale, undersizing the first sale is the most expensive mistake.`
          : `Vendre exactement ${m(besoinCash, 0)} : sous la décote, cela ne rapporte que ${f(r2(besoinCash * (1 - decote / 100)), 2)} — il manque ${m(manqueSiVendBesoin)}. Et revenir au marché demain coûte plus cher : la décote aura monté, en partie À CAUSE de la vente d'aujourd'hui. Dans une vente forcée, sous-dimensionner la première vente est l'erreur la plus chère.`,
        en
          ? `Multiplying instead of dividing: $${f(besoinCash, 0)} × (1 + ${f(decote, 0)}\\,\\%) = ${f(fauxMult, 2)}$ against ${f(reponse, 2)} exact — an underestimate that grows with the discount. Same base error as the asymmetry of losses (ex-04): the factor applies to what is SOLD, not to what is raised; whenever a percentage bites, ask on which base it bites.`
          : `Multiplier au lieu de diviser : $${f(besoinCash, 0)} × (1 + ${f(decote, 0)}\\,\\%) = ${f(fauxMult, 2)}$ contre ${f(reponse, 2)} exact — une sous-estimation qui grandit avec la décote. La même erreur de base que l'asymétrie des pertes (ex-04) : le facteur s'applique à ce qui est VENDU, pas à ce qui est levé ; devant tout pourcentage qui mord, demandez sur quelle base il mord.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 9. Le run bancaire (N2)
// ---------------------------------------------------------------------------
export const genRunBancaire: ExerciseGenerator = {
  id: 'm11-ex-09',
  moduleId: M11,
  titre: 'Le run bancaire',
  titreEn: 'The bank run',
  difficulte: 2,
  // Tirages (ordre strict) : 1. depots = randInt(80, 200) (Md) · 2.
  // couvertureCible = randInt(12, 35) · 3. habillage = pick(['svb',
  // 'northern']). Les actifs liquides sont CONSTRUITS (arrondi de dépôts ×
  // couverture/100) puis la réponse repasse par tauxCouvertureDepots — le taux
  // obtenu est donc proche mais pas exactement égal à la cible tirée, et la
  // fraction des dépôts qui suffit à tuer est ce même chiffre. Habillage SVB
  // (Md$, 42 Md$ en une journée ≈ un quart des dépôts) ou Northern Rock (Md£).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const depots = randInt(rng, 80, 200);
    const couvertureCible = randInt(rng, 12, 35);
    const habillage = pick(rng, ['svb', 'northern'] as const);

    const liquides = Math.round((depots * couvertureCible) / 100);
    const reponse = r2(tauxCouvertureDepots(liquides, depots));
    const estSvb = habillage === 'svb';
    const dev = estSvb ? '$' : '£';

    const en = langue === 'en';
    const { f, pct, md } = formatters(langue);
    const m = (v: number, d = 0) => md(v, d, dev);
    return {
      enonce: en
        ? estSvb
          ? `March 2023. A tech-sector bank holds ${m(depots)} of deposits — largely uninsured, concentrated, and one group chat away from moving — against ${m(liquides)} of liquid assets mobilisable same-day. The rest of the balance sheet sits in long-dated securities and loans.\n\n**What is the coverage ratio of deposits by liquid assets, in %?**`
          : `September 2007. A British mortgage bank funded three-quarters in the wholesale markets holds ${m(depots)} of retail deposits against ${m(liquides)} of same-day liquid assets — the rest of the balance sheet is long mortgages.\n\n**What is the coverage ratio of deposits by liquid assets, in %?**`
        : estSvb
          ? `Mars 2023. Une banque de la tech porte ${m(depots)} de dépôts — largement non assurés, concentrés, et à un group chat de partir — contre ${m(liquides)} d'actifs liquides mobilisables le jour même. Le reste du bilan est en titres longs et en prêts.\n\n**Quel est le taux de couverture des dépôts par les actifs liquides, en % ?**`
          : `Septembre 2007. Une banque hypothécaire britannique financée aux trois quarts sur les marchés porte ${m(depots)} de dépôts de particuliers contre ${m(liquides)} d'actifs liquides du jour même — le reste du bilan est en prêts immobiliers longs.\n\n**Quel est le taux de couverture des dépôts par les actifs liquides, en % ?**`,
      reponse,
      tolerance: 0.1,
      toleranceMode: 'absolu',
      unite: '%',
      etapes: [
        {
          titre: en ? 'The coverage ratio' : 'Le taux de couverture',
          contenu: en
            ? `$\\text{coverage} = \\dfrac{\\text{liquid assets}}{\\text{deposits}} × 100 = \\dfrac{${f(liquides, 0)}}{${f(depots, 0)}} × 100$ = **${pct(reponse, 2)}**. Nothing pathological about it: maturity transformation — funding long assets with demand deposits — IS the banking business. Every bank in the world lives with coverage far below 100%; the whole question is what happens when the deposits actually leave.`
            : `$\\text{couverture} = \\dfrac{\\text{actifs liquides}}{\\text{dépôts}} × 100 = \\dfrac{${f(liquides, 0)}}{${f(depots, 0)}} × 100$ = **${pct(reponse, 2)}**. Rien de pathologique là-dedans : la transformation de maturité — financer des actifs longs avec des dépôts à vue — EST le métier bancaire. Toutes les banques du monde vivent avec une couverture très inférieure à 100 % ; toute la question est ce qui se passe quand les dépôts partent vraiment.`,
        },
        {
          titre: en ? 'The fraction that kills' : 'La fraction qui tue',
          contenu: en
            ? `The same number read as a threshold: it suffices that **${pct(reponse, 1)}** of deposits walk for the same-day liquidity to be exhausted. Beyond, the bank must sell its long assets under discount — latent losses become realised losses, and the illiquid institution BECOMES insolvent by trying to prove it was not (chapter 1's royal distinction). The 2023 yardstick: SVB faced $42bn of requested withdrawals in ONE day — about a quarter of its deposits, at smartphone speed. No bank on earth covers a quarter of its deposits in same-day liquid assets.`
            : `Le même chiffre lu comme un seuil : il suffit que **${pct(reponse, 1)}** des dépôts partent pour épuiser la liquidité du jour. Au-delà, la banque doit vendre ses actifs longs sous décote — les moins-values latentes deviennent des pertes réalisées, et l'institution illiquide DEVIENT insolvable en essayant de prouver qu'elle ne l'était pas (la distinction reine du chapitre 1). L'étalon 2023 : SVB a affronté 42 Md$ de retraits demandés en UNE journée — environ un quart de ses dépôts, à la vitesse du smartphone. Aucune banque au monde ne couvre un quart de ses dépôts en actifs liquides du jour.`,
        },
        {
          titre: en ? 'Why solvency does not protect' : 'Pourquoi la solvabilité ne protège pas',
          contenu: en
            ? `A run is a self-fulfilling prophecy: each depositor is individually right to leave if the others leave — the belief, not the balance sheet, is the battlefield. ${estSvb ? 'In 2023 the run was coordinated by Twitter and VC group chats, and the FDIC closed the bank the next morning.' : 'In 2007 the queues outside Northern Rock were the first British bank-run photographs since 1866 — and they only stopped when the Treasury guaranteed the deposits.'} What stops a run is never the coverage ratio: it is the backstop — deposit insurance (1934), the blanket guarantee on SVB's deposits, the BTFP lending AT PAR against underwater collateral. Bagehot, updated: the lender of last resort is the only actor who can change the belief itself.`
            : `Un run est une prophétie auto-réalisatrice : chaque déposant a individuellement raison de partir si les autres partent — le champ de bataille est la croyance, pas le bilan. ${estSvb ? 'En 2023, le run fut coordonné par Twitter et les group chats du capital-risque, et la FDIC a fermé la banque le lendemain matin.' : 'En 2007, les files devant Northern Rock furent les premières photos de run bancaire britannique depuis 1866 — et elles ne se sont arrêtées que quand le Trésor a garanti les dépôts.'} Ce qui arrête un run n'est jamais le taux de couverture : c'est le backstop — l'assurance des dépôts (1934), la garantie totale des dépôts de SVB, le BTFP qui prête AU PAIR contre du collatéral sous l'eau. Bagehot, mis à jour : le prêteur en dernier ressort est le seul acteur capable de changer la croyance elle-même.`,
        },
      ],
      pieges: [
        en
          ? `Reading 100 − ${f(reponse, 1)} = ${f(r2(100 - reponse), 1)}% of deposits as "safe": every demand deposit is claimable today; the coverage ratio only marks the threshold beyond which the bank must start selling long assets at a loss. The uninsured depositors know it — which is why they run FIRST: the guarantee only anchors what it covers.`
          : `Lire 100 − ${f(reponse, 1)} = ${f(r2(100 - reponse), 1)} % des dépôts comme « en sécurité » : tout dépôt à vue est exigible aujourd'hui ; le taux de couverture ne marque que le seuil au-delà duquel la banque doit commencer à vendre ses actifs longs à perte. Les déposants non assurés le savent — c'est pourquoi ils courent LES PREMIERS : la garantie n'ancre que ce qu'elle couvre.`,
        en
          ? `Confusing liquidity coverage with solvency: a bank can be solvent (assets worth more than debts) and die of a run in 48 hours — Northern Rock and SVB both were, on paper. And the fix is not 100% coverage: a narrow bank that covers everything no longer transforms maturities, i.e. no longer does banking. The fragility is not a flaw of the model; it IS the model — hence the whole architecture of insurance, supervision and last-resort lending built around it.`
          : `Confondre couverture de liquidité et solvabilité : une banque peut être solvable (des actifs qui valent plus que ses dettes) et mourir d'un run en 48 heures — Northern Rock et SVB l'étaient, sur le papier. Et le remède n'est pas une couverture à 100 % : une narrow bank qui couvre tout ne transforme plus les maturités, c'est-à-dire ne fait plus de banque. La fragilité n'est pas un défaut du modèle ; elle EST le modèle — d'où toute l'architecture d'assurance, de supervision et de prêt en dernier ressort construite autour.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 10. La doom loop chiffrée (N3)
// ---------------------------------------------------------------------------
export const genDoomLoop: ExerciseGenerator = {
  id: 'm11-ex-10',
  moduleId: M11,
  titre: 'La doom loop chiffrée',
  titreEn: 'The doom loop in numbers',
  difficulte: 3,
  // Tirages (ordre strict) : 1. dettePib = pick([90, 120, 150, 180]) ·
  // 2. tauxInitial = randFloat(1.5, 3.5, 1) · 3. hausse = pick([1, 1.5, 2,
  // 2.5, 3]) · 4. tauxBund = randFloat(1, 2, 1).
  // Charge avant/après par chargeInteretsDette ; réponse = la charge APRÈS
  // refinancement au nouveau taux, en % du PIB. Le spread contre le Bund
  // (spreadSouverainPb) est chiffré au corrigé — taux après ≥ 2,5 > Bund ≤ 2
  // par construction des bornes, le spread est toujours positif.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const dettePib = pick(rng, [90, 120, 150, 180] as const);
    const tauxInitial = randFloat(rng, 1.5, 3.5, 1);
    const hausse = pick(rng, [1, 1.5, 2, 2.5, 3] as const);
    const tauxBund = randFloat(rng, 1, 2, 1);

    const tauxApres = r2(tauxInitial + hausse);
    const chargeAvant = r2(chargeInteretsDette(dettePib, tauxInitial));
    const reponse = r2(chargeInteretsDette(dettePib, tauxApres));
    const surcharge = r2(reponse - chargeAvant);
    const coutParPoint = r2(dettePib / 100);
    const spread = r2(spreadSouverainPb(tauxApres, tauxBund));
    const chargeDette60 = r2(chargeInteretsDette(60, tauxApres));

    const en = langue === 'en';
    const { f, pct } = formatters(langue);
    return {
      enonce: en
        ? `Euro area, 2011. A sovereign carries ${pct(dettePib, 0)} of debt-to-GDP. Its average refinancing rate used to be ${pct(tauxInitial, 1)}; market distrust pushes it to ${pct(tauxApres, 1)}, while the German Bund stays at ${pct(tauxBund, 1)}.\n\n**Once the debt is refinanced at the new rate, what is the interest burden, in % of GDP?**`
        : `Zone euro, 2011. Un État porte ${pct(dettePib, 0)} de dette/PIB. Son taux moyen de refinancement était de ${pct(tauxInitial, 1)} ; la défiance du marché le porte à ${pct(tauxApres, 1)}, pendant que le Bund allemand reste à ${pct(tauxBund, 1)}.\n\n**Une fois la dette refinancée au nouveau taux, quelle est la charge d'intérêts, en % du PIB ?**`,
      reponse,
      tolerance: 0.05,
      toleranceMode: 'absolu',
      unite: en ? '% of GDP' : '% du PIB',
      etapes: [
        {
          titre: en ? 'Yesterday\'s burden' : 'La charge d\'hier',
          contenu: en
            ? `The interest burden is the product of two numbers: $\\text{burden} = \\dfrac{\\text{debt/GDP} × \\text{average rate}}{100} = \\dfrac{${f(dettePib, 0)} × ${f(tauxInitial, 1)}}{100}$ = **${pct(chargeAvant, 2)} of GDP**. At ${pct(tauxInitial, 1)}, even ${pct(dettePib, 0)} of debt is carryable — a debt is never sustainable or unsustainable in the absolute, only AT A GIVEN RATE.`
            : `La charge d'intérêts est le produit de deux nombres : $\\text{charge} = \\dfrac{\\text{dette/PIB} × \\text{taux moyen}}{100} = \\dfrac{${f(dettePib, 0)} × ${f(tauxInitial, 1)}}{100}$ = **${pct(chargeAvant, 2)} du PIB**. À ${pct(tauxInitial, 1)}, même ${pct(dettePib, 0)} de dette se portent — une dette n'est jamais soutenable ou insoutenable dans l'absolu, seulement À UN TAUX DONNÉ.`,
        },
        {
          titre: en ? 'Tomorrow\'s burden — and the cost of one point' : 'La charge de demain — et le coût d\'un point',
          contenu: en
            ? `At the new rate: $\\dfrac{${f(dettePib, 0)} × ${f(tauxApres, 1)}}{100}$ = **${pct(reponse, 2)} of GDP** — ${f(surcharge, 2)} points of GDP more, before the first euro of school or hospital. The general rule: at ${pct(dettePib, 0)} of debt-to-GDP, each point of rate costs **${f(coutParPoint, 1)} point(s) of GDP**. One honest nuance: the higher rate only hits the stock as it refinances — but the market prices the trajectory immediately, and the shorter the debt, the faster the arithmetic catches up (Greece refinanced fast).`
            : `Au nouveau taux : $\\dfrac{${f(dettePib, 0)} × ${f(tauxApres, 1)}}{100}$ = **${pct(reponse, 2)} du PIB** — ${f(surcharge, 2)} points de PIB de plus, avant le premier euro d'école ou d'hôpital. La règle générale : à ${pct(dettePib, 0)} de dette/PIB, chaque point de taux coûte **${f(coutParPoint, 1)} point(s) de PIB**. Une nuance honnête : le taux plus élevé ne frappe le stock qu'au fil du refinancement — mais le marché price la trajectoire immédiatement, et plus la dette est courte, plus vite l'arithmétique rattrape (la Grèce refinançait vite).`,
        },
        {
          titre: en ? 'The thermometer and the loop' : 'Le thermomètre et la boucle',
          contenu: en
            ? `The spread against the Bund: $(${f(tauxApres, 1)} - ${f(tauxBund, 1)}) × 100$ = **${f(spread, 0)} bp**. The reference marks: the French OAT lives at 30-60 bp, Italy crossed 500 bp in 2011, Greece quoted above 3,000 bp in 2012 — levels that no longer price a risk but the anticipated default itself. The loop is now armed: rates up ⇒ burden up ⇒ solvency down ⇒ rates up — self-fulfilling, and doubled by the bank-sovereign embrace (domestic banks stuffed with their own sovereign's debt). De Grauwe's key: a state borrowing in a currency it does not issue can die of ILLIQUIDITY while solvent — which is why the OMT, by crushing the rate without spending a euro, changed solvency itself.`
            : `Le spread contre le Bund : $(${f(tauxApres, 1)} - ${f(tauxBund, 1)}) × 100$ = **${f(spread, 0)} pb**. Les repères : l'OAT française vit à 30-60 pb, l'Italie a franchi 500 pb en 2011, la Grèce a coté plus de 3 000 pb en 2012 — des niveaux qui ne pricent plus un risque mais le défaut anticipé lui-même. La boucle est alors armée : taux ↑ ⇒ charge ↑ ⇒ solvabilité ↓ ⇒ taux ↑ — auto-réalisatrice, et doublée de l'étreinte banques-souverain (les banques domestiques gavées de la dette de leur propre État). La clé de De Grauwe : un État qui emprunte dans une monnaie qu'il n'émet pas peut mourir d'ILLIQUIDITÉ tout en étant solvable — c'est pourquoi l'OMT, en écrasant le taux sans dépenser un euro, a changé la solvabilité elle-même.`,
        },
      ],
      pieges: [
        en
          ? `Confusing the burden with the rate (answering ${pct(tauxApres, 1)}): the rate must be multiplied by the debt ratio. At ${pct(dettePib, 0)} of debt-to-GDP the same ${pct(tauxApres, 1)} costs ${pct(reponse, 2)} of GDP, while at 60% it would cost only ${pct(chargeDette60, 2)} — the multiplication IS the difference between discomfort and asphyxia, and the whole reason high-debt sovereigns fear the bond market.`
          : `Confondre la charge avec le taux (répondre ${pct(tauxApres, 1)}) : le taux doit être multiplié par le ratio de dette. À ${pct(dettePib, 0)} de dette/PIB, le même ${pct(tauxApres, 1)} coûte ${pct(reponse, 2)} du PIB, quand à 60 % il ne coûterait que ${pct(chargeDette60, 2)} — la multiplication EST la différence entre la gêne et l'asphyxie, et toute la raison pour laquelle les souverains très endettés craignent le marché obligataire.`,
        en
          ? `Quoting the spread in % instead of basis points: ${f(r2(tauxApres - tauxBund), 2)}% IS ${f(spread, 0)} bp — sovereign spreads are quoted in bp, and mixing the units by a factor of 100 is the kind of slip that ends an interview. Anchor: 100 bp = 1%, always.`
          : `Coter le spread en % au lieu de points de base : ${f(r2(tauxApres - tauxBund), 2)} %, c'est ${f(spread, 0)} pb — les spreads souverains se cotent en pb, et mélanger les unités d'un facteur 100 est le genre de glissade qui termine un entretien. L'ancre : 100 pb = 1 %, toujours.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 11. Le bilan SVB (N3)
// ---------------------------------------------------------------------------
export const genBilanSvb: ExerciseGenerator = {
  id: 'm11-ex-11',
  moduleId: M11,
  titre: 'Le bilan SVB',
  titreEn: 'The SVB balance sheet',
  difficulte: 3,
  // Tirages (ordre strict) : 1. portefeuille = pick([80, 100, 120, 140]) (Md$)
  // · 2. duration = randFloat(4.5, 7, 1) · 3. chocPb = pick([150, 200, 250,
  // 300]) · 4. fondsPropres = randInt(10, 18) (Md$).
  // La moins-value latente passe par variationPrixObligationDuration IMPORTÉE
  // du m10 (le pont quantitatif du module, jamais recopié) : pct = −D × Δy/100,
  // montant = portefeuille × |pct|/100. Réponse en Md$ (valeur absolue). Le
  // corrigé compare aux fonds propres tirés (le ratio peut dépasser 100 % —
  // banque économiquement morte — ou non : les deux lectures sont traitées).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const portefeuille = pick(rng, [80, 100, 120, 140] as const);
    const duration = randFloat(rng, 4.5, 7, 1);
    const chocPb = pick(rng, [150, 200, 250, 300] as const);
    const fondsPropres = randInt(rng, 10, 18);

    const pertePct = variationPrixObligationDuration(duration, chocPb); // % signé, négatif
    const pctAbs = r2(-pertePct);
    const reponse = r2((portefeuille * -pertePct) / 100);
    const ratioFp = r2((reponse / fondsPropres) * 100);
    const morte = ratioFp >= 100;
    const fpRestants = r2(fondsPropres - reponse);
    const fauxSansConversion = r2(-duration * chocPb);

    const en = langue === 'en';
    const { f, pct, md } = formatters(langue);
    return {
      enonce: en
        ? `End of 2022. A US regional bank has parked the tech sector's deposits in ${md(portefeuille)} of Treasuries and agency MBS with a modified duration of ${f(duration, 1)}, booked held-to-maturity. Over the year, the Fed lifted the relevant part of the curve by ${f(chocPb, 0)} bp. The bank's equity: ${md(fondsPropres)}.\n\n**What is the latent loss on the portfolio, in $bn (absolute value)?**`
        : `Fin 2022. Une banque régionale américaine a placé les dépôts de la tech dans ${md(portefeuille)} de Treasuries et de MBS d'agences de duration modifiée ${f(duration, 1)}, comptabilisés en held-to-maturity. Sur l'année, la Fed a relevé la partie concernée de la courbe de ${f(chocPb, 0)} pb. Fonds propres de la banque : ${md(fondsPropres)}.\n\n**Quelle est la moins-value latente sur le portefeuille, en Md$ (valeur absolue) ?**`,
      reponse,
      tolerance: 0.005,
      toleranceMode: 'relatif',
      unite: en ? '$bn' : 'Md$',
      etapes: [
        {
          titre: en ? 'Module 10\'s formula, imported as is' : 'La formule du m10, importée telle quelle',
          contenu: en
            ? `The duration bridge (module 4, applied by module 10 to monetary policy): $\\dfrac{\\Delta P}{P} ≈ -D_{mod} × \\Delta y = -${f(duration, 1)} × ${f(chocPb, 0)}\\ \\text{bp}$ = **${pct(-pctAbs, 2)}**. Δy enters in basis points, the formula returns % — 100 bp = 1%, the conversion is built in. Nothing exotic: the same computation prices any bond portfolio against any rate shock.`
            : `Le pont de la duration (module 4, appliqué par le module 10 à la politique monétaire) : $\\dfrac{\\Delta P}{P} ≈ -D_{mod} × \\Delta y = -${f(duration, 1)} × ${f(chocPb, 0)}\\ \\text{pb}$ = **${pct(-pctAbs, 2)}**. Δy entre en points de base, la formule rend des % — 100 pb = 1 %, la conversion est incluse. Rien d'exotique : le même calcul price n'importe quel portefeuille obligataire contre n'importe quel choc de taux.`,
        },
        {
          titre: en ? 'In dollars, against the equity' : 'En dollars, contre les fonds propres',
          contenu: en
            ? `${pct(-pctAbs, 2)} of ${md(portefeuille)} = **${md(reponse, 1)}** of latent loss — against ${md(fondsPropres)} of equity, i.e. **${pct(ratioFp, 0)}** of it. ${morte ? `The bank is economically DEAD — the latent loss exceeds the equity by ${md(r2(reponse - fondsPropres), 1)} — and yet the accounts look presentable:` : `Realising the loss would leave only ${md(fpRestants, 1)} of equity standing — and yet the accounts look presentable:`} held-to-maturity keeps the securities at cost, so as long as nothing forces a sale, the loss does not exist ACCOUNTING-wise. It exists economically all the same: HTM is a shelter against the gaze, not against arithmetic.`
            : `${pct(-pctAbs, 2)} de ${md(portefeuille)} = **${md(reponse, 1)}** de moins-value latente — contre ${md(fondsPropres)} de fonds propres, soit **${pct(ratioFp, 0)}** de ceux-ci. ${morte ? `La banque est économiquement MORTE — la moins-value dépasse les fonds propres de ${md(r2(reponse - fondsPropres), 1)} — et pourtant les comptes restent présentables :` : `Réaliser la perte ne laisserait debout que ${md(fpRestants, 1)} de fonds propres — et pourtant les comptes restent présentables :`} le held-to-maturity garde les titres au coût d'achat, donc tant que rien ne force une vente, la perte n'existe pas COMPTABLEMENT. Elle existe économiquement quand même : le HTM est un abri contre le regard, pas contre l'arithmétique.`,
        },
        {
          titre: en ? 'How a latent loss becomes a failure' : 'Comment une perte latente devient une faillite',
          contenu: en
            ? `The real-life sequence, March 2023: on the 8th, forced to raise cash, SVB sells $21bn of securities — realised loss $1.8bn — and announces a capital raise: the latent loss goes public. On the 9th, coordinated by Twitter and the VC group chats, depositors request $42bn in ONE day — a quarter of the deposits (previous exercise). On the 10th, the FDIC closes the bank. The run forces the sale, the sale realises the loss, the loss confirms the run: rate risk, funding concentration and HTM accounting composed into the second-largest US bank failure — without a single default in the portfolio.`
            : `La séquence réelle, mars 2023 : le 8, contrainte de lever du cash, SVB vend 21 Md$ de titres — perte réalisée 1,8 Md$ — et annonce une augmentation de capital : la perte latente devient publique. Le 9, coordonnés par Twitter et les group chats du capital-risque, les déposants demandent 42 Md$ en UNE journée — un quart des dépôts (exercice précédent). Le 10, la FDIC ferme la banque. Le run force la vente, la vente réalise la perte, la perte confirme le run : risque de taux, concentration du financement et comptabilité HTM composés en deuxième plus grosse faillite bancaire américaine — sans un seul défaut dans le portefeuille.`,
        },
      ],
      pieges: [
        en
          ? `Skipping the bp conversion: $-${f(duration, 1)} × ${f(chocPb, 0)} = ${f(fauxSansConversion, 0)}\\,\\%$ — an absurdity (a bond cannot lose ${f(Math.abs(fauxSansConversion), 0)}% of its value). Δy enters the duration formula in basis points and the result reads in %: ${f(chocPb, 0)} bp = ${pct(chocPb / 100, 2)}.`
          : `Sauter la conversion des pb : $-${f(duration, 1)} × ${f(chocPb, 0)} = ${f(fauxSansConversion, 0)}\\,\\%$ — une absurdité (une obligation ne peut pas perdre ${f(Math.abs(fauxSansConversion), 0)} % de sa valeur). Δy entre dans la formule de duration en points de base et le résultat se lit en % : ${f(chocPb, 0)} pb = ${pct(chocPb / 100, 2)}.`,
        en
          ? `"No risk, they are Treasuries": not one issuer defaulted in that portfolio, and it still ${morte ? 'cost more than the equity' : `destroyed ${pct(ratioFp, 0)} of the equity`}. Rate risk is NOT credit risk — "risk-free" means free of DEFAULT risk, never of price risk (module 10's lesson, fatal here). Duration hides wherever a distant promise meets a rate: bond books, pension funds, bank balance sheets.`
          : `« Aucun risque, ce sont des Treasuries » : pas un émetteur n'a fait défaut dans ce portefeuille, et il a pourtant ${morte ? 'coûté plus que les fonds propres' : `détruit ${pct(ratioFp, 0)} des fonds propres`}. Le risque de taux n'est PAS un risque de crédit — « sans risque » signifie sans risque de DÉFAUT, jamais sans risque de prix (la leçon du module 10, fatale ici). La duration se cache partout où une promesse lointaine rencontre un taux : books obligataires, fonds de pension, bilans bancaires.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 12. La spirale en un tour (N3)
// ---------------------------------------------------------------------------
export const genSpiraleUnTour: ExerciseGenerator = {
  id: 'm11-ex-12',
  moduleId: M11,
  titre: 'La spirale en un tour',
  titreEn: 'One turn of the spiral',
  difficulte: 3,
  // Tirages (ordre strict) : 1. levier = pick([8, 10, 12]) · 2. chocMag =
  // randFloat(1.5, 4, 1) · 3. decote = pick([1, 2, 3]).
  // Base 100 de fonds propres initiaux (actifs = levier × 100). Le choc passe
  // par impactLevierSurFondsPropres ; la taille de la vente forcée au levier
  // cible λ sous décote d est S = (A − λE)/(1 − λd) — la formule du GoFurther
  // du chapitre 1, celle de LeverageSpiralSim, dérivée pas à pas au corrigé en
  // s'appuyant sur venteForceePourCash pour l'intuition (chaque euro vendu ne
  // rapporte que 1 − d de cash et coûte d de fonds propres). Réponse = fonds
  // propres après la vente. Bornes choisies pour rester HORS zone de mort
  // (λ·d ≤ 0,36 < 1) et garder E₂ nettement positif (pire cas ≈ 27) ; la
  // vérification (A − S)/E₂ = λ boucle exactement par construction.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const levier = pick(rng, [8, 10, 12] as const);
    const chocMag = randFloat(rng, 1.5, 4, 1);
    const decote = pick(rng, [1, 2, 3] as const);

    const e0 = 100;
    const a0 = levier * e0;
    const impactPct = impactLevierSurFondsPropres(levier, -chocMag); // % signé des FP
    const e1 = e0 + (e0 * impactPct) / 100;
    const a1 = a0 * (1 - chocMag / 100);
    const levierApresChoc = r2(levierBilan(a1, e1));
    const d = decote / 100;
    const lambdaD = r2(levier * d);
    const excesApparent = r2(a1 - levier * e1);
    const s = (a1 - levier * e1) / (1 - levier * d);
    const sR = r2(s);
    const cashLeve = r2(s * (1 - d));
    const coutDecote = r2(s * d);
    const reponse = r2(e1 - s * d);
    // Piège 1 : ne vendre que l'excès apparent — le levier ne retombe pas à la cible.
    const fpSiExces = e1 - (a1 - levier * e1) * d;
    const levierSiExces = r2(levierBilan(a1 - (a1 - levier * e1), fpSiExces));

    const en = langue === 'en';
    const { f, pct, sgn } = formatters(langue);
    return {
      enonce: en
        ? `A fund runs at leverage ${f(levier, 0)} — base 100 of initial equity, hence ${f(a0, 0)} of assets — when a ${pct(-chocMag, 1)} shock hits its assets. Its lender demands an immediate return to leverage ${f(levier, 0)}; any urgent sale suffers a ${pct(decote, 0)} liquidation discount (a dead loss), and the sale proceeds repay debt.\n\n**What is the equity worth once the deleveraging is done, per 100 of initial equity?**`
        : `Un fonds tourne au levier ${f(levier, 0)} — base 100 de fonds propres initiaux, soit ${f(a0, 0)} d'actifs — quand un choc de ${pct(-chocMag, 1)} frappe ses actifs. Son prêteur exige un retour immédiat au levier ${f(levier, 0)} ; toute vente en urgence subit une décote de liquidation de ${pct(decote, 0)} (perte sèche), et le produit des ventes rembourse la dette.\n\n**Que valent les fonds propres une fois le désendettement accompli, pour 100 de fonds propres initiaux ?**`,
      reponse,
      tolerance: 0.1,
      toleranceMode: 'absolu',
      etapes: [
        {
          titre: en ? 'The shock, levered' : 'Le choc, au levier',
          contenu: en
            ? `The misery formula: $\\Delta FP\\,\\% = ${f(levier, 0)} × (-${f(chocMag, 1)}\\,\\%) = ${sgn(impactPct, 0)}\\,\\%$ — equity falls to **${f(r2(e1), 2)}**, assets to ${f(r2(a1), 0)}. And here is the perversity: current leverage has RISEN to $${f(r2(a1), 0)}/${f(r2(e1), 2)} = ${f(levierApresChoc, 1)}$ — mechanically, at the worst moment. The lender wants ${f(levier, 0)} back: the fund must sell.`
            : `La formule du malheur : $\\Delta FP\\,\\% = ${f(levier, 0)} × (-${f(chocMag, 1)}\\,\\%) = ${sgn(impactPct, 0)}\\,\\%$ — les fonds propres tombent à **${f(r2(e1), 2)}**, les actifs à ${f(r2(a1), 0)}. Et voici la perversité : le levier courant a MONTÉ à $${f(r2(a1), 0)}/${f(r2(e1), 2)} = ${f(levierApresChoc, 1)}$ — mécaniquement, au pire moment. Le prêteur veut retrouver ${f(levier, 0)} : il faut vendre.`,
        },
        {
          titre: en ? 'The size of the sale — the derivation' : 'La taille de la vente — la dérivation',
          contenu: en
            ? `The fire-sale intuition (ex-08): selling S of market value yields only $S(1 - d)$ of cash — which repays debt — and burns $S · d$ of equity. After the sale, we want the target back: $A - S = \\lambda\\,(E - S d)$. Solving for S: $S = \\dfrac{A - \\lambda E}{1 - \\lambda d} = \\dfrac{${f(r2(a1), 0)} - ${f(levier, 0)} × ${f(r2(e1), 2)}}{1 - ${f(lambdaD, 2)}}$ = **${f(sR, 1)}**. Note the two readings: the numerator is the APPARENT excess of assets (${f(excesApparent, 1)}), but the denominator $1 - \\lambda d = ${f(r2(1 - levier * d), 2)}$ amplifies — you must sell ${f(r2(sR / excesApparent), 2)} times the apparent excess, because the sale itself destroys equity as it goes.`
            : `L'intuition de la vente forcée (ex-08) : vendre S de valeur de marché ne rapporte que $S(1 - d)$ de cash — qui rembourse la dette — et brûle $S · d$ de fonds propres. Après la vente, on veut retrouver la cible : $A - S = \\lambda\\,(E - S d)$. En isolant S : $S = \\dfrac{A - \\lambda E}{1 - \\lambda d} = \\dfrac{${f(r2(a1), 0)} - ${f(levier, 0)} × ${f(r2(e1), 2)}}{1 - ${f(lambdaD, 2)}}$ = **${f(sR, 1)}**. Notez les deux lectures : le numérateur est l'excès APPARENT d'actifs (${f(excesApparent, 1)}), mais le dénominateur $1 - \\lambda d = ${f(r2(1 - levier * d), 2)}$ amplifie — il faut vendre ${f(r2(sR / excesApparent), 2)} fois l'excès apparent, parce que la vente elle-même détruit des fonds propres en chemin.`,
        },
        {
          titre: en ? 'Equity after the sale — and what comes next' : 'Les fonds propres après la vente — et la suite',
          contenu: en
            ? `The sale raises ${f(cashLeve, 1)} of cash (debt repaid) and burns ${f(coutDecote, 2)} of equity in discount: $E_2 = ${f(r2(e1), 2)} - ${f(coutDecote, 2)}$ = **${f(reponse, 2)}** per 100 initial. Check: $(A - S)/E_2 = ${f(r2(a1 - sR), 1)}/${f(reponse, 2)} = ${f(levier, 0)}$ ✓ — the target is met. Total bill of the turn: ${f(r2(e0 - reponse), 1)} of the initial 100, of which ${f(coutDecote, 2)} from the deleveraging alone. This is ONE turn of LeverageSpiralSim (chapter 1): in real life the sale re-marks the remaining book, which triggers a new shock and a new turn — convergence or death. The death zone is $\\lambda d \\ge 1$ (here ${f(lambdaD, 2)}, safely below): at LTCM in September 1998 or the LDI funds in September 2022, selling no longer deleveraged — only the rescue or the crushing of d could reopen the exit.`
            : `La vente lève ${f(cashLeve, 1)} de cash (dette remboursée) et brûle ${f(coutDecote, 2)} de fonds propres en décote : $E_2 = ${f(r2(e1), 2)} - ${f(coutDecote, 2)}$ = **${f(reponse, 2)}** pour 100 au départ. Vérification : $(A - S)/E_2 = ${f(r2(a1 - sR), 1)}/${f(reponse, 2)} = ${f(levier, 0)}$ ✓ — la cible est atteinte. Facture totale du tour : ${f(r2(e0 - reponse), 1)} sur les 100 initiaux, dont ${f(coutDecote, 2)} pour le seul désendettement. C'est UN tour du LeverageSpiralSim (chapitre 1) : dans la vraie vie, la vente re-valorise le book restant, ce qui déclenche un nouveau choc et un nouveau tour — convergence ou mort. La zone de mort est $\\lambda d \\ge 1$ (ici ${f(lambdaD, 2)}, largement en deçà) : chez LTCM en septembre 1998 ou les fonds LDI en septembre 2022, vendre ne désendettait plus — seuls le sauvetage ou l'écrasement de d rouvraient la sortie.`,
        },
      ],
      pieges: [
        en
          ? `Selling only the apparent excess $A - \\lambda E = ${f(excesApparent, 1)}$: the sale itself burns equity, so leverage only falls to ${f(levierSiExces, 2)}, not ${f(levier, 0)} — and the lender comes back, forcing a second sale into prices depressed by the first. That IS the spiral in miniature: undersizing each round is what keeps it turning.`
          : `Ne vendre que l'excès apparent $A - \\lambda E = ${f(excesApparent, 1)}$ : la vente elle-même brûle des fonds propres, donc le levier ne retombe qu'à ${f(levierSiExces, 2)}, pas à ${f(levier, 0)} — et le prêteur revient, forçant une deuxième vente dans des prix déprimés par la première. C'est EXACTEMENT la spirale en miniature : sous-dimensionner chaque tour est ce qui la fait tourner.`,
        en
          ? `Forgetting the discount's bill and answering ${f(r2(e1), 2)} (the post-shock equity): the deleveraging itself costs $S × d = ${f(coutDecote, 2)}$ of equity — a realised, definitive loss. Deleveraging under discount is a second shock, self-inflicted; that is why the effective fire-fighter never buys the whole market, but crushes d to make this very term vanish.`
          : `Oublier la facture de la décote et répondre ${f(r2(e1), 2)} (les fonds propres après choc) : le désendettement lui-même coûte $S × d = ${f(coutDecote, 2)}$ de fonds propres — une perte réalisée, définitive. Se désendetter sous décote est un second choc, auto-infligé ; c'est pourquoi le pompier efficace n'achète jamais tout le marché, mais écrase d pour faire disparaître ce terme précis.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// Export : les 12 générateurs du module, dans l'ordre de progression du cours
// ---------------------------------------------------------------------------
export const exercices: ExerciseGenerator[] = [
  genLevierBilan,
  genFormuleDuMalheur,
  genDrawdown,
  genAsymetriePertes,
  genAnneesRecuperation,
  genRunRepo,
  genLevierMaximalHaircut,
  genVenteForcee,
  genRunBancaire,
  genDoomLoop,
  genBilanSvb,
  genSpiraleUnTour,
];
