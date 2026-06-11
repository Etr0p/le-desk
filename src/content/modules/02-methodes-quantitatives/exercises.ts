/**
 * Les 14 générateurs d'exercices d'application du module Méthodes quantitatives
 * & probabilités.
 *
 * BILINGUES : generate(seed, langue = 'fr'). Invariant absolu : TOUS les tirages
 * aléatoires sont effectués AVANT toute branche de langue — un même seed produit
 * exactement les mêmes nombres, la même réponse et la même tolérance en français
 * et en anglais. Seuls les textes (énoncé, étapes, pièges, unité textuelle) changent.
 *
 * Tous les calculs passent par calculs.ts (aucune formule recopiée).
 * L'ordre des tirages de chaque moule est documenté dans son commentaire
 * « Tirages (ordre strict) » : exercises.test.ts les rejoue avec mulberry32(seed)
 * pour recouper chaque réponse par un calcul direct via calculs.ts.
 */
import { formatNombreLangue } from '../../../engine/answers';
import { mulberry32, pick, randFloat, randInt } from '../../../engine/rng';
import type { ExerciseGenerator, Langue } from '../../../engine/types';
import {
  bayes,
  combinaisons,
  correlation,
  covarianceEchantillon,
  ecartTypeEchantillon,
  esperanceBinomiale,
  intervalleConfiance,
  moyenneArithmetique,
  moyenneGeometrique,
  normaleCdf,
  ordonneeRegression,
  penteRegression,
  perpetuite,
  probaBinomiale,
  r2Regression,
  statT,
  vaAnnuite,
  van,
  variancePortefeuille2,
  volatiliteAnnualisee,
  zScore,
} from './calculs';

const M2 = '02-methodes-quantitatives';

const r2 = (v: number) => Math.round(v * 100) / 100;
const r4 = (v: number) => Math.round(v * 10000) / 10000;

/** Formateurs dépendants de la langue : nombre, montant en euros, pourcentage. */
function formatters(langue: Langue) {
  const f = (v: number, d = 2) => formatNombreLangue(langue, v, d);
  const eur = (v: number, d = 2) => (langue === 'en' ? `€${f(v, d)}` : `${f(v, d)} €`);
  const pct = (v: number, d = 2) => (langue === 'en' ? `${f(v, d)}%` : `${f(v, d)} %`);
  /** Nombre signé (+2 / −1), pour afficher des séries de rendements. */
  const sgn = (v: number, d = 2) => (v > 0 ? `+${f(v, d)}` : f(v, d));
  return { f, eur, pct, sgn };
}

// ---------------------------------------------------------------------------
// 1. VA d'une annuité (N1)
// ---------------------------------------------------------------------------
export const genVaAnnuite: ExerciseGenerator = {
  id: 'm2-app-va-annuite',
  moduleId: M2,
  titre: "Valeur actuelle d'une annuité",
  titreEn: 'Present value of an annuity',
  difficulte: 1,
  // Tirages (ordre strict) : 1. fluxD = randInt(5, 50) (flux = fluxD × 10)
  // · 2. taux = randFloat(1, 8, 2) · 3. n = randInt(3, 15).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const fluxD = randInt(rng, 5, 50);
    const taux = randFloat(rng, 1, 8, 2);
    const n = randInt(rng, 3, 15);

    const flux = fluxD * 10;
    const reponse = r2(vaAnnuite(flux, taux, n));
    const facteur = vaAnnuite(1, taux, n);
    const brut = flux * n;
    const rognage = r2(brut - reponse);

    const en = langue === 'en';
    const { f, eur, pct } = formatters(langue);
    return {
      enonce: en
        ? `A contract will pay you ${eur(flux)} at the end of each year for ${n} years (first payment in exactly one year). Rates for that horizon stand at ${pct(taux)}.\n\n**What is this stream of cash flows worth today, in euros?**`
        : `Un contrat vous versera ${eur(flux)} chaque fin d'année pendant ${n} ans (premier versement dans un an exactement). Les taux sur cet horizon sont à ${pct(taux)}.\n\n**Que vaut cette série de flux aujourd'hui, en euros ?**`,
      reponse,
      tolerance: 0.002,
      unite: '€',
      etapes: [
        {
          titre: en ? 'Recognise the annuity' : "Reconnaître l'annuité",
          contenu: en
            ? `A constant cash flow of ${eur(flux)} for ${n} periods, first payment one period from now: a textbook end-of-period **annuity**. By additivity, its value is the sum of the ${n} discounted cash flows — and that sum has a closed form.`
            : `Un flux constant de ${eur(flux)} pendant ${n} périodes, premier versement dans une période : une **annuité** de fin de période classique. Par additivité, sa valeur est la somme des ${n} flux actualisés — et cette somme a une formule fermée.`,
        },
        {
          titre: en ? 'Apply the closed form' : 'Appliquer la formule fermée',
          contenu: en
            ? `$VA = F \\times \\frac{1-(1+r)^{-n}}{r}$. The annuity factor for €1 is $\\frac{1-(1+${f(taux)}\\,\\%)^{-${n}}}{${f(taux)}\\,\\%} = ${f(facteur, 4)}$, hence $VA = ${f(flux)} × ${f(facteur, 4)}$ = **${eur(reponse)}**.`
            : `$VA = F \\times \\frac{1-(1+r)^{-n}}{r}$. Le facteur d'annuité pour 1 € vaut $\\frac{1-(1+${f(taux)}\\,\\%)^{-${n}}}{${f(taux)}\\,\\%} = ${f(facteur, 4)}$, d'où $VA = ${f(flux)} × ${f(facteur, 4)}$ = **${eur(reponse)}**.`,
        },
        {
          titre: en ? 'Read the time-value haircut' : 'Lire le coût du temps',
          contenu: en
            ? `You will receive ${eur(brut)} in total, but the stream is only worth ${eur(reponse)} today: discounting shaves off ${eur(rognage)}. The further away a cash flow, the harder it is trimmed — that gap grows with both the rate and the horizon.`
            : `Vous toucherez ${eur(brut)} au total, mais la série ne vaut que ${eur(reponse)} aujourd'hui : l'actualisation rogne ${eur(rognage)}. Plus un flux est lointain, plus il est rogné — l'écart grandit avec le taux et avec l'horizon.`,
        },
      ],
      pieges: [
        en
          ? `Answering the raw sum ${f(flux)} × ${n} = ${eur(brut)}: that ignores the time value of money entirely — the error is worth ${eur(rognage)} here.`
          : `Répondre la somme brute ${f(flux)} × ${n} = ${eur(brut)} : c'est ignorer toute la valeur temps de l'argent — l'erreur pèse ${eur(rognage)} ici.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 2. Mensualité d'un prêt (N2) — l'annuité lue à l'envers
// ---------------------------------------------------------------------------
export const genMensualite: ExerciseGenerator = {
  id: 'm2-app-mensualite',
  moduleId: M2,
  titre: "Mensualité d'un prêt",
  titreEn: 'Monthly loan payment',
  difficulte: 2,
  // Tirages (ordre strict) : 1. capitalK = randInt(5, 50) (capital = capitalK × 1000)
  // · 2. tauxMensuel = randFloat(0.2, 0.6, 2) · 3. nMois = randInt(12, 120).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const capitalK = randInt(rng, 5, 50);
    const tauxMensuel = randFloat(rng, 0.2, 0.6, 2);
    const nMois = randInt(rng, 12, 120);

    const capital = capitalK * 1000;
    const facteur = vaAnnuite(1, tauxMensuel, nMois);
    const reponse = r2(capital / facteur);
    const tauxAnnuel = r2(tauxMensuel * 12);
    const totalRembourse = r2((capital / facteur) * nMois);
    const interets = r2(totalRembourse - capital);
    const naive = r2(capital / nMois);
    const fauxAnnuel = r2(capital / vaAnnuite(1, tauxAnnuel, nMois));

    const en = langue === 'en';
    const { f, eur, pct } = formatters(langue);
    return {
      enonce: en
        ? `You borrow ${eur(capital)} over ${nMois} months at a monthly rate of ${pct(tauxMensuel)} (a nominal annual rate of ${pct(tauxAnnuel)}).\n\n**What constant monthly payment exactly repays this loan, in euros?**`
        : `Vous empruntez ${eur(capital)} sur ${nMois} mois au taux mensuel de ${pct(tauxMensuel)} (soit un taux nominal annuel de ${pct(tauxAnnuel)}).\n\n**Quelle mensualité constante rembourse exactement ce prêt, en euros ?**`,
      reponse,
      tolerance: 0.002,
      unite: '€',
      etapes: [
        {
          titre: en ? 'A loan is an annuity read backwards' : "Un crédit est une annuité lue à l'envers",
          contenu: en
            ? `The bank pays out ${eur(capital)} today and receives ${nMois} payments of $M$. Equilibrium requires the capital to equal the present value of that annuity: $K = M \\times \\frac{1-(1+r)^{-n}}{r}$ — everything in **monthly** units (rate ${pct(tauxMensuel)}, ${nMois} months).`
            : `La banque décaisse ${eur(capital)} aujourd'hui et reçoit ${nMois} mensualités $M$. L'équilibre impose que le capital soit la valeur actuelle de cette annuité : $K = M \\times \\frac{1-(1+r)^{-n}}{r}$ — tout en unités **mensuelles** (taux ${pct(tauxMensuel)}, ${nMois} mois).`,
        },
        {
          titre: en ? 'Compute the annuity factor' : "Calculer le facteur d'annuité",
          contenu: en
            ? `For €1 of monthly payment: $\\frac{1-(1+${f(tauxMensuel)}\\,\\%)^{-${nMois}}}{${f(tauxMensuel)}\\,\\%} = ${f(facteur, 4)}$. In words: €1 a month for ${nMois} months is worth ${eur(r2(facteur))} today.`
            : `Pour 1 € de mensualité : $\\frac{1-(1+${f(tauxMensuel)}\\,\\%)^{-${nMois}}}{${f(tauxMensuel)}\\,\\%} = ${f(facteur, 4)}$. Autrement dit : 1 € par mois pendant ${nMois} mois vaut ${eur(r2(facteur))} aujourd'hui.`,
        },
        {
          titre: en ? 'Invert to get the payment' : 'Inverser pour obtenir la mensualité',
          contenu: en
            ? `$M = K / \\text{factor} = ${f(capital)} / ${f(facteur, 4)}$ = **${eur(reponse)}**.`
            : `$M = K / \\text{facteur} = ${f(capital)} / ${f(facteur, 4)}$ = **${eur(reponse)}**.`,
        },
        {
          titre: en ? 'Check the cost of the loan' : 'Vérifier le coût du crédit',
          contenu: en
            ? `Total repaid: ${f(reponse)} × ${nMois} = ${eur(totalRembourse)}, of which ${eur(interets)} is interest. Sanity check: the payment must exceed ${f(capital)}/${nMois} = ${eur(naive)} (the zero-interest payment) — it does.`
            : `Total remboursé : ${f(reponse)} × ${nMois} = ${eur(totalRembourse)}, dont ${eur(interets)} d'intérêts. Contrôle de cohérence : la mensualité doit dépasser ${f(capital)}/${nMois} = ${eur(naive)} (la mensualité à taux zéro) — c'est bien le cas.`,
        },
      ],
      pieges: [
        en
          ? `Mixing units: discounting the months at the annual rate of ${pct(tauxAnnuel)} gives ${eur(fauxAnnuel)} — with monthly payments, everything must be monthly (rate AND number of periods).`
          : `Mélanger les unités : actualiser les mois au taux annuel de ${pct(tauxAnnuel)} donne ${eur(fauxAnnuel)} — avec des mensualités, tout passe en mensuel (taux ET nombre de périodes).`,
        en
          ? `Simply dividing ${f(capital)}/${nMois} = ${eur(naive)} forgets the interest: the true payment is ${eur(r2(reponse - naive))} higher every month.`
          : `Diviser simplement ${f(capital)}/${nMois} = ${eur(naive)} oublie les intérêts : la vraie mensualité est plus élevée de ${eur(r2(reponse - naive))} chaque mois.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 3. Perpétuité (N1) — loyer ou dividende
// ---------------------------------------------------------------------------
export const genPerpetuite: ExerciseGenerator = {
  id: 'm2-app-perpetuite',
  moduleId: M2,
  titre: "Valeur d'une perpétuité",
  titreEn: 'Value of a perpetuity',
  difficulte: 1,
  // Tirages (ordre strict) : 1. type = pick(['dividende', 'loyer']) · 2. fluxBase = randInt(4, 60)
  // · 3. taux = randFloat(2, 8, 1). flux = fluxBase × 100 si loyer, fluxBase sinon.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const type = pick(rng, ['dividende', 'loyer'] as const);
    const fluxBase = randInt(rng, 4, 60);
    const taux = randFloat(rng, 2, 8, 1);

    const flux = type === 'loyer' ? fluxBase * 100 : fluxBase;
    const reponse = r2(perpetuite(flux, taux));
    const fauxSansConversion = r2(flux / taux);
    const interetsAnnuels = r2(reponse * (taux / 100));

    const en = langue === 'en';
    const { f, eur, pct } = formatters(langue);
    const loyer = type === 'loyer';
    return {
      enonce: en
        ? loyer
          ? `A commercial property generates a net rent of ${eur(flux)} a year, for ever (first rent in one year). The required rate for this type of asset is ${pct(taux, 1)}.\n\n**What is this asset worth today, in euros?**`
          : `A preference share will pay a fixed dividend of ${eur(flux)} a year, for ever (first payment in one year). The required rate is ${pct(taux, 1)}.\n\n**What is this share worth today, in euros?**`
        : loyer
          ? `Un local commercial rapporte un loyer net de ${eur(flux)} par an, pour toujours (premier loyer dans un an). Le taux exigé pour ce type d'actif est de ${pct(taux, 1)}.\n\n**Que vaut cet actif aujourd'hui, en euros ?**`
          : `Une action préférentielle versera un dividende fixe de ${eur(flux)} par an, pour toujours (premier versement dans un an). Le taux exigé est de ${pct(taux, 1)}.\n\n**Que vaut cette action aujourd'hui, en euros ?**`,
      reponse,
      tolerance: 0.002,
      unite: '€',
      etapes: [
        {
          titre: en ? 'Recognise the perpetuity' : 'Reconnaître la perpétuité',
          contenu: en
            ? `A constant cash flow with no end date, first payment one period from now: a **perpetuity**. Let $n \\to \\infty$ in the annuity formula and $(1+r)^{-n}$ vanishes — what remains is one of the shortest formulas in finance: $P = F/r$.`
            : `Un flux constant sans date de fin, premier versement dans une période : une **perpétuité**. Faites tendre $n$ vers l'infini dans la formule d'annuité : $(1+r)^{-n}$ disparaît, et il reste l'une des formules les plus courtes de la finance : $P = F/r$.`,
        },
        {
          titre: en ? 'Divide by the rate (in decimal!)' : 'Diviser par le taux (en décimal !)',
          contenu: en
            ? `With the rate converted to decimal: $P = ${f(flux)} / ${f(taux / 100, 3)}$ = **${eur(reponse)}**.`
            : `Avec le taux converti en décimal : $P = ${f(flux)} / ${f(taux / 100, 3)}$ = **${eur(reponse)}**.`,
        },
        {
          titre: en ? 'The capital intuition' : "L'intuition du capital",
          contenu: en
            ? `Invested at ${pct(taux, 1)}, ${eur(reponse)} produces exactly ${eur(interetsAnnuels)} of interest a year: the cash flow can be paid for ever without ever touching the principal. An *infinite* sum of cash flows has a *finite* value because distant flows weigh almost nothing once discounted.`
            : `Placés à ${pct(taux, 1)}, ${eur(reponse)} produisent exactement ${eur(interetsAnnuels)} d'intérêts par an : on peut servir le flux éternellement sans jamais entamer le capital. Une somme *infinie* de flux a une valeur *finie* parce que les flux lointains ne pèsent presque rien une fois actualisés.`,
        },
      ],
      pieges: [
        en
          ? `Dividing by the rate without converting it to decimal: ${f(flux)}/${f(taux, 1)} = ${eur(fauxSansConversion)} instead of ${eur(reponse)} — a factor-of-100 error.`
          : `Diviser par le taux sans le convertir en décimal : ${f(flux)}/${f(taux, 1)} = ${eur(fauxSansConversion)} au lieu de ${eur(reponse)} — une erreur d'un facteur 100.`,
        en
          ? `The formula assumes the first cash flow comes in one period. If one were also paid today, you would add it: $P = F + F/r$.`
          : `La formule suppose le premier flux dans une période. Si un flux tombait aussi aujourd'hui, il faudrait l'ajouter : $P = F + F/r$.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 4. VAN d'un projet et décision (N2)
// ---------------------------------------------------------------------------
export const genVan: ExerciseGenerator = {
  id: 'm2-app-van',
  moduleId: M2,
  titre: "VAN d'un projet et décision",
  titreEn: 'Project NPV and the decision',
  difficulte: 2,
  // Tirages (ordre strict) : 1. investK = randInt(1, 10) (invest = investK × 1000)
  // · 2. n = randInt(3, 5) · 3. taux = randFloat(5, 15, 2)
  // · 4. fluxD = randInt(22, 48) (flux = fluxD × investK × 10).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const investK = randInt(rng, 1, 10);
    const n = randInt(rng, 3, 5);
    const taux = randFloat(rng, 5, 15, 2);
    const fluxD = randInt(rng, 22, 48);

    const invest = investK * 1000;
    const flux = fluxD * investK * 10;
    const fluxArr = Array.from({ length: n }, () => flux);
    const reponse = r2(van(invest, fluxArr, taux));
    const vaFlux = r2(vaAnnuite(flux, taux, n));
    const brut = flux * n;
    const positif = reponse > 0;

    const en = langue === 'en';
    const { f, eur, pct } = formatters(langue);
    return {
      enonce: en
        ? `A project requires an investment of ${eur(invest)} today and will generate ${eur(flux)} a year for ${n} years. The cost of capital is ${pct(taux)}.\n\n**What is the NPV of the project, in euros (with its sign)? Should it be accepted?**`
        : `Un projet exige un investissement de ${eur(invest)} aujourd'hui et rapportera ${eur(flux)} par an pendant ${n} ans. Le coût du capital est de ${pct(taux)}.\n\n**Quelle est la VAN du projet, en euros (avec son signe) ? Faut-il l'accepter ?**`,
      reponse,
      tolerance: 0.5,
      toleranceMode: 'absolu',
      unite: '€',
      etapes: [
        {
          titre: en ? 'Set up the NPV' : 'Poser la VAN',
          contenu: en
            ? `$VAN = -I_0 + \\sum_{t=1}^{${n}} \\frac{F_t}{(1+r)^t}$: everything is brought back to today's euros, and the initial outlay of ${eur(invest)} enters **negatively** — it is a cash flow like any other, dated $t = 0$.`
            : `$VAN = -I_0 + \\sum_{t=1}^{${n}} \\frac{F_t}{(1+r)^t}$ : tout est ramené en euros d'aujourd'hui, et le décaissement initial de ${eur(invest)} compte **négativement** — c'est un flux comme les autres, daté de $t = 0$.`,
        },
        {
          titre: en ? 'Discount the cash flows' : 'Actualiser les flux',
          contenu: en
            ? `The ${n} equal cash flows of ${eur(flux)} form an annuity: their present value at ${pct(taux)} is **${eur(vaFlux)}** (against ${eur(brut)} in raw, undiscounted euros).`
            : `Les ${n} flux égaux de ${eur(flux)} forment une annuité : leur valeur actuelle à ${pct(taux)} vaut **${eur(vaFlux)}** (contre ${eur(brut)} en euros bruts, non actualisés).`,
        },
        {
          titre: en ? 'Conclude and decide' : 'Conclure et décider',
          contenu: en
            ? `$VAN = -${f(invest)} + ${f(vaFlux)}$ = **${eur(reponse)}**. ${positif ? `Positive NPV: **accept** — the project creates ${eur(reponse)} of value in today's euros, over and above the required return of ${pct(taux)}.` : `Negative NPV: **reject** — at a cost of capital of ${pct(taux)}, the project destroys ${eur(Math.abs(reponse))} of value in today's euros.`}`
            : `$VAN = -${f(invest)} + ${f(vaFlux)}$ = **${eur(reponse)}**. ${positif ? `VAN positive : **on accepte** — le projet crée ${eur(reponse)} de valeur en euros d'aujourd'hui, au-delà du rendement exigé de ${pct(taux)}.` : `VAN négative : **on refuse** — au coût du capital de ${pct(taux)}, le projet détruit ${eur(Math.abs(reponse))} de valeur en euros d'aujourd'hui.`}`,
        },
      ],
      pieges: [
        en
          ? `Forgetting the initial outlay: the sum of discounted inflows is ${eur(vaFlux)} — that is NOT the NPV; the ${eur(invest)} invested must be subtracted.`
          : `Oublier le décaissement initial : la somme des flux actualisés vaut ${eur(vaFlux)} — ce n'est PAS la VAN ; il faut retrancher les ${eur(invest)} investis.`,
        en
          ? `Comparing the raw sum of inflows (${eur(brut)}) with the investment (${eur(invest)}) ignores the time value of money: the decision rides on discounted cash flows (${eur(vaFlux)}), never on raw ones.`
          : `Comparer la somme brute des flux (${eur(brut)}) à l'investissement (${eur(invest)}) ignore la valeur temps : la décision se joue sur les flux actualisés (${eur(vaFlux)}), jamais sur les bruts.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 5. Rendement annualisé : géométrique vs arithmétique (N2)
// ---------------------------------------------------------------------------
export const genMoyenneGeo: ExerciseGenerator = {
  id: 'm2-app-moyenne-geo',
  moduleId: M2,
  titre: 'Rendement annualisé : géométrique vs arithmétique',
  titreEn: 'Annualised return: geometric vs arithmetic',
  difficulte: 2,
  // Tirages (ordre strict) : 1. nAnnees = randInt(2, 3) · 2. rPos1 = randInt(5, 30)
  // · 3. rNegAbs = randInt(5, 25) · 4. rPos2 = randInt(2, 20) (utilisé seulement si nAnnees = 3).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const nAnnees = randInt(rng, 2, 3);
    const rPos1 = randInt(rng, 5, 30);
    const rNegAbs = randInt(rng, 5, 25);
    const rPos2 = randInt(rng, 2, 20);

    const rendements = nAnnees === 2 ? [rPos1, -rNegAbs] : [rPos1, -rNegAbs, rPos2];
    const reponse = r2(moyenneGeometrique(rendements));
    const arith = r2(moyenneArithmetique(rendements));
    const produit = rendements.reduce((p, r) => p * (1 + r / 100), 1);
    const ecart = r2(arith - reponse);

    const en = langue === 'en';
    const { f, pct, sgn } = formatters(langue);
    const serieFr = rendements.map((r) => `${sgn(r, 0)} %`).join(', ');
    const serieEn = rendements.map((r) => `${sgn(r, 0)}%`).join(', ');
    const facteurs = rendements.map((r) => f(1 + r / 100, 2)).join(' × ');
    return {
      enonce: en
        ? `A fund posts the following annual returns over ${nAnnees} years: ${serieEn}.\n\n**What is its annualised return (geometric mean), in % per year?**`
        : `Un fonds affiche les rendements annuels suivants sur ${nAnnees} ans : ${serieFr}.\n\n**Quel est son rendement annualisé (moyenne géométrique), en % par an ?**`,
      reponse,
      tolerance: 0.02,
      toleranceMode: 'absolu',
      unite: '%',
      etapes: [
        {
          titre: en ? 'Compound the wealth' : 'Composer la richesse',
          contenu: en
            ? `Returns compound — they multiply, they do not add. One euro becomes ${facteurs} = **${f(produit, 4)}** after ${nAnnees} years. The loss applies to whatever base the gains have built (and vice versa): that is the whole story.`
            : `Les rendements se composent — ils se multiplient, ils ne s'additionnent pas. Un euro devient ${facteurs} = **${f(produit, 4)}** au bout de ${nAnnees} ans. La perte s'applique à la base que les gains ont construite (et réciproquement) : tout est là.`,
        },
        {
          titre: en ? 'Annualise' : 'Annualiser',
          contenu: en
            ? `$r_g = ${f(produit, 4)}^{1/${nAnnees}} - 1$ = **${pct(reponse)}** per year: the constant rate which, compounded ${nAnnees} times, produces exactly the same final wealth.`
            : `$r_g = ${f(produit, 4)}^{1/${nAnnees}} - 1$ = **${pct(reponse)}** par an : le taux constant qui, composé ${nAnnees} fois, produit exactement la même richesse finale.`,
        },
        {
          titre: en ? 'Confront the arithmetic mean' : "Confronter à l'arithmétique",
          contenu: en
            ? `The arithmetic mean says ${pct(arith)} — always above the geometric (gap: ${f(ecart)} point(s), the *volatility drag*, roughly $\\sigma^2/2$). Only the geometric mean measures the performance actually earned over several periods; the arithmetic one remains the right estimate for a *single* future period.`
            : `La moyenne arithmétique annonce ${pct(arith)} — toujours au-dessus de la géométrique (écart : ${f(ecart)} point(s), le *volatility drag*, environ $\\sigma^2/2$). Seule la géométrique mesure la performance réellement obtenue sur plusieurs périodes ; l'arithmétique reste la bonne estimation pour *une* période future.`,
        },
      ],
      pieges: [
        en
          ? `Quoting the arithmetic mean (${pct(arith)}) as the realised performance: on compounded returns it always overstates — by ${f(ecart)} point(s) here. A fund can post a flattering "average return" and still have lost money.`
          : `Annoncer la moyenne arithmétique (${pct(arith)}) comme performance réalisée : sur des rendements composés, elle surestime toujours — de ${f(ecart)} point(s) ici. Un fonds peut afficher une « moyenne des rendements » flatteuse et avoir perdu de l'argent.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 6. Annualiser une volatilité (N1)
// ---------------------------------------------------------------------------
export const genVolAnnualisee: ExerciseGenerator = {
  id: 'm2-app-vol-annualisee',
  moduleId: M2,
  titre: 'Annualiser une volatilité',
  titreEn: 'Annualising volatility',
  difficulte: 1,
  // Tirages (ordre strict) : 1. freq = pick(['quotidienne', 'hebdomadaire'])
  // · 2. vol = randFloat(0.5, 3, 2).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const freq = pick(rng, ['quotidienne', 'hebdomadaire'] as const);
    const vol = randFloat(rng, 0.5, 3, 2);

    const quotidien = freq === 'quotidienne';
    const periodes = quotidien ? 252 : 52;
    const racine = Math.sqrt(periodes);
    const reponse = r2(volatiliteAnnualisee(vol, periodes));
    const fauxLineaire = r2(vol * periodes);

    const en = langue === 'en';
    const { f, pct } = formatters(langue);
    const freqFr = quotidien ? 'quotidienne' : 'hebdomadaire';
    const freqEn = quotidien ? 'daily' : 'weekly';
    const convFr = quotidien ? '252 jours de bourse par an' : '52 semaines par an';
    const convEn = quotidien ? '252 trading days a year' : '52 weeks a year';
    return {
      enonce: en
        ? `The ${freqEn} volatility of an index is ${pct(vol)}. Market convention: ${convEn}.\n\n**What is its annualised volatility, in %?**`
        : `La volatilité ${freqFr} d'un indice est de ${pct(vol)}. Convention de marché : ${convFr}.\n\n**Quelle est sa volatilité annualisée, en % ?**`,
      reponse,
      tolerance: 0.005,
      unite: '%',
      etapes: [
        {
          titre: en ? 'Why the square root' : 'Pourquoi la racine carrée',
          contenu: en
            ? `If returns are independent, **variances** add up over time: the annual variance is ${periodes} times the ${freqEn} variance. The standard deviation therefore grows like the **square root of time**: $\\sigma_{an} = \\sigma \\times \\sqrt{${periodes}}$.`
            : `Si les rendements sont indépendants, les **variances** s'additionnent dans le temps : la variance annuelle vaut ${periodes} fois la variance ${freqFr}. L'écart-type croît donc comme la **racine carrée du temps** : $\\sigma_{an} = \\sigma \\times \\sqrt{${periodes}}$.`,
        },
        {
          titre: en ? 'Apply' : 'Appliquer',
          contenu: en
            ? `Numerically: $\\sigma_{an} = ${f(vol)} × \\sqrt{${periodes}} = ${f(vol)} × ${f(racine, 4)}$ = **${pct(reponse)}**.`
            : `Numériquement : $\\sigma_{an} = ${f(vol)} × \\sqrt{${periodes}} = ${f(vol)} × ${f(racine, 4)}$ = **${pct(reponse)}**.`,
        },
        {
          titre: en ? 'Calibrate the order of magnitude' : "Situer l'ordre de grandeur",
          contenu: en
            ? `${quotidien ? `Desk rule of thumb: $\\sqrt{252} \\approx 16$, so 1% daily ≈ 16% annualised.` : `Rule of thumb: $\\sqrt{52} \\approx 7{.}2$, so 1% weekly ≈ 7% annualised.`} For reference, a calm equity index lives around 15% annualised volatility; above 30%, the market is in stress — place ${pct(reponse)} on that scale.`
            : `${quotidien ? `Règle de tête du desk : $\\sqrt{252} \\approx 16$, donc 1 % quotidien ≈ 16 % annualisé.` : `Règle de tête : $\\sqrt{52} \\approx 7{,}2$, donc 1 % hebdomadaire ≈ 7 % annualisé.`} Pour mémoire, un indice actions calme vit autour de 15 % de vol annualisée ; au-delà de 30 %, le marché est en stress — situez ${pct(reponse)} sur cette échelle.`,
        },
      ],
      pieges: [
        en
          ? `Multiplying by ${periodes} instead of √${periodes}: ${pct(fauxLineaire)} — an absurd figure. It is the variance that scales linearly with time, never the standard deviation.`
          : `Multiplier par ${periodes} au lieu de √${periodes} : ${pct(fauxLineaire)} — un chiffre absurde. C'est la variance qui est linéaire en temps, jamais l'écart-type.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 7. Corrélation de deux actifs sur 4 jours (N3)
// ---------------------------------------------------------------------------
export const genCorrelation: ExerciseGenerator = {
  id: 'm2-app-correlation',
  moduleId: M2,
  titre: 'Corrélation de deux actifs sur 4 jours',
  titreEn: 'Correlation of two assets over 4 days',
  difficulte: 3,
  // Tirages (ordre strict) : 1. mx = randInt(−1, 2) · 2. my = randInt(−1, 2) · 3. a1 = randInt(1, 3)
  // · 4. a2 = randInt(1, 3) · 5. b1 = randInt(1, 3) · 6. b2 = randInt(1, 3).
  // xs = [mx+a1, mx−a1, mx+a2, mx−a2] ; ys = [my+b1, my−b1, my−b2, my+b2] : moyennes entières
  // exactes (mx, my), σ > 0 garanti des deux côtés, |ρ| < 1 strict (cas d'égalité de
  // Cauchy-Schwarz impossible avec des écarts tous positifs).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const mx = randInt(rng, -1, 2);
    const my = randInt(rng, -1, 2);
    const a1 = randInt(rng, 1, 3);
    const a2 = randInt(rng, 1, 3);
    const b1 = randInt(rng, 1, 3);
    const b2 = randInt(rng, 1, 3);

    const xs = [mx + a1, mx - a1, mx + a2, mx - a2];
    const ys = [my + b1, my - b1, my - b2, my + b2];
    const reponse = r2(correlation(xs, ys));
    const cov = covarianceEchantillon(xs, ys);
    const sx = ecartTypeEchantillon(xs);
    const sy = ecartTypeEchantillon(ys);
    const sommeProduits = 2 * (a1 * b1 - a2 * b2);

    const en = langue === 'en';
    const { f, sgn } = formatters(langue);
    const serieA = xs.map((v) => sgn(v, 0)).join(en ? ', ' : ' ; ');
    const serieB = ys.map((v) => sgn(v, 0)).join(en ? ', ' : ' ; ');
    const ecartsA = [a1, -a1, a2, -a2].map((v) => sgn(v, 0)).join(', ');
    const ecartsB = [b1, -b1, -b2, b2].map((v) => sgn(v, 0)).join(', ');
    const produits = [a1 * b1, a1 * b1, -a2 * b2, -a2 * b2].map((v) => sgn(v, 0)).join(', ');
    return {
      enonce: en
        ? `Daily returns (in %) over 4 days — asset A: ${serieA}; asset B: ${serieB}.\n\n**Compute the Pearson correlation between A and B (a pure number between −1 and 1).**`
        : `Rendements quotidiens (en %) sur 4 jours — actif A : ${serieA} ; actif B : ${serieB}.\n\n**Calculez la corrélation de Pearson entre A et B (nombre sans dimension, entre −1 et 1).**`,
      reponse,
      tolerance: 0.02,
      toleranceMode: 'absolu',
      etapes: [
        {
          titre: en ? 'Means and deviations' : 'Moyennes et écarts',
          contenu: en
            ? `Means: $\\bar{r}_A = ${f(mx, 0)}$%, $\\bar{r}_B = ${f(my, 0)}$%. Deviations from the mean — A: ${ecartsA}; B: ${ecartsB}. On days 1–2 the two assets move together; on days 3–4 they part ways: the figure will arbitrate.`
            : `Moyennes : $\\bar{r}_A = ${f(mx, 0)}$ %, $\\bar{r}_B = ${f(my, 0)}$ %. Écarts à la moyenne — A : ${ecartsA} ; B : ${ecartsB}. Jours 1-2, les deux actifs bougent ensemble ; jours 3-4, ils divergent : le chiffre va trancher.`,
        },
        {
          titre: en ? 'Covariance' : 'La covariance',
          contenu: en
            ? `Products of deviations: ${produits}; sum = ${f(sommeProduits, 0)}. Sample covariance (divide by $n-1 = 3$): $s_{AB} = ${f(sommeProduits, 0)}/3 = ${f(cov, 4)}$ %² — a sign and a magnitude, but an unreadable unit.`
            : `Produits des écarts : ${produits} ; somme = ${f(sommeProduits, 0)}. Covariance d'échantillon (division par $n-1 = 3$) : $s_{AB} = ${f(sommeProduits, 0)}/3 = ${f(cov, 4)}$ %² — un signe et une amplitude, mais une unité illisible.`,
        },
        {
          titre: en ? 'Normalise by the standard deviations' : 'Normaliser par les écarts-types',
          contenu: en
            ? `$\\sigma_A = ${f(sx, 4)}$%, $\\sigma_B = ${f(sy, 4)}$% (same $n-1$ denominator). Hence $\\rho = \\frac{s_{AB}}{\\sigma_A \\sigma_B} = ${f(cov, 4)} / (${f(sx, 4)} × ${f(sy, 4)})$ = **${f(reponse)}**: ${reponse > 0 ? 'the joint moves (days 1–2) dominate' : reponse < 0 ? 'the opposite moves (days 3–4) dominate' : 'joint and opposite moves exactly offset — no linear link'}, and the bound $|\\rho| \\le 1$ is respected.`
            : `$\\sigma_A = ${f(sx, 4)}$ %, $\\sigma_B = ${f(sy, 4)}$ % (même dénominateur $n-1$). D'où $\\rho = \\frac{s_{AB}}{\\sigma_A \\sigma_B} = ${f(cov, 4)} / (${f(sx, 4)} × ${f(sy, 4)})$ = **${f(reponse)}** : ${reponse > 0 ? 'les co-mouvements (jours 1-2) dominent' : reponse < 0 ? 'les mouvements opposés (jours 3-4) dominent' : "co-mouvements et oppositions s'annulent exactement — aucune liaison linéaire"}, et la borne $|\\rho| \\le 1$ est bien respectée.`,
        },
      ],
      pieges: [
        en
          ? `Reporting the covariance (${f(cov, 4)} %²) as "the correlation": covariance has a unit (%²) and no bounds; only ρ is dimensionless and lives in [−1, 1].`
          : `Annoncer la covariance (${f(cov, 4)} %²) comme « la corrélation » : la covariance a une unité (%²) et aucune borne ; seule ρ est sans dimension et vit dans [−1, 1].`,
        en
          ? `Dividing by n = 4 instead of n − 1 = 3 changes the covariance and both standard deviations but NOT ρ — the factor cancels. Mixing the two conventions within one computation, however, breaks everything.`
          : `Diviser par n = 4 au lieu de n − 1 = 3 change la covariance et les écarts-types mais PAS ρ — le facteur se simplifie. Mélanger les deux conventions dans un même calcul, en revanche, fausse tout.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 8. Bayes contextualisé : la probabilité retournée (N3)
// ---------------------------------------------------------------------------
export const genBayes: ExerciseGenerator = {
  id: 'm2-app-bayes',
  moduleId: M2,
  titre: 'Bayes : la probabilité retournée',
  titreEn: 'Bayes: flipping the conditional',
  difficulte: 3,
  // Tirages (ordre strict) : 1. ctx = pick([0, 1, 2]) (0 test médical · 1 signal de trading
  // · 2 contrôle qualité) · 2. pAPct = pick([1, 2, 5, 10, 20]) · 3. sensPct = pick([80, 90, 95, 99])
  // · 4. fpPct = pick([5, 10, 20, 30]). Paramètres entiers ⇒ effectifs entiers sur 10 000 cas.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const ctx = pick(rng, [0, 1, 2] as const);
    const pAPct = pick(rng, [1, 2, 5, 10, 20] as const);
    const sensPct = pick(rng, [80, 90, 95, 99] as const);
    const fpPct = pick(rng, [5, 10, 20, 30] as const);

    const reponse = r2(bayes(pAPct / 100, sensPct / 100, fpPct / 100) * 100);
    // Méthode des effectifs sur 10 000 cas — tous les comptes sont des entiers exacts.
    const nA = 100 * pAPct;
    const nNonA = 10000 - nA;
    const vraisPositifs = pAPct * sensPct;
    const fauxPositifs = (100 - pAPct) * fpPct;
    const totalPositifs = vraisPositifs + fauxPositifs;

    const en = langue === 'en';
    const { f, pct } = formatters(langue);
    // Vocabulaire par contexte : cas comptés, porteurs de A, non-A, alertes.
    const vocFr = [
      { cas: 'personnes', a: 'malades', alerte: 'tests positifs' },
      { cas: 'configurations', a: 'vraies tendances', alerte: 'signaux' },
      { cas: 'pièces', a: 'défectueuses', alerte: 'alarmes' },
    ][ctx];
    const vocEn = [
      { cas: 'people', a: 'sick', alerte: 'positive tests' },
      { cas: 'market set-ups', a: 'true trends', alerte: 'signals' },
      { cas: 'parts', a: 'defective', alerte: 'alarms' },
    ][ctx];
    const enonceFr = [
      `Une maladie touche ${pct(pAPct, 0)} de la population. Un test la détecte chez ${pct(sensPct, 0)} des malades (sensibilité), mais sonne aussi à tort chez ${pct(fpPct, 0)} des personnes saines. Votre test est positif.\n\n**Quelle est la probabilité que vous soyez réellement malade, en % ?**`,
      `Un vendeur de stratégies présente un signal d'achat qui détecte ${pct(sensPct, 0)} des vraies tendances haussières. Les vraies tendances ne représentent que ${pct(pAPct, 0)} des configurations de marché, et le signal se déclenche aussi à tort dans ${pct(fpPct, 0)} des configurations sans tendance. Le signal vient de sonner.\n\n**Quelle est la probabilité d'être sur une vraie tendance, en % ?**`,
      `Sur une chaîne de production, ${pct(pAPct, 0)} des pièces sont défectueuses. Un contrôle automatique détecte ${pct(sensPct, 0)} des pièces défectueuses, mais déclenche aussi une alarme à tort sur ${pct(fpPct, 0)} des pièces conformes. L'alarme vient de sonner.\n\n**Quelle est la probabilité que la pièce soit réellement défectueuse, en % ?**`,
    ][ctx];
    const enonceEn = [
      `A disease affects ${pct(pAPct, 0)} of the population. A test detects it in ${pct(sensPct, 0)} of the sick (sensitivity), but also fires wrongly in ${pct(fpPct, 0)} of healthy people. Your test is positive.\n\n**What is the probability that you are actually sick, in %?**`,
      `A strategy vendor pitches a buy signal that catches ${pct(sensPct, 0)} of true bullish trends. True trends only account for ${pct(pAPct, 0)} of market set-ups, and the signal also fires wrongly in ${pct(fpPct, 0)} of trendless set-ups. The signal has just fired.\n\n**What is the probability of being on a true trend, in %?**`,
      `On a production line, ${pct(pAPct, 0)} of parts are defective. An automatic check detects ${pct(sensPct, 0)} of defective parts, but also raises a false alarm on ${pct(fpPct, 0)} of compliant parts. The alarm has just gone off.\n\n**What is the probability that the part is actually defective, in %?**`,
    ][ctx];
    return {
      enonce: en ? enonceEn : enonceFr,
      reponse,
      tolerance: 0.005,
      unite: '%',
      etapes: [
        {
          titre: en ? 'Think in counts, not formulas' : 'Penser en effectifs, pas en formules',
          contenu: en
            ? `Take 10,000 ${vocEn.cas}: ${f(nA, 0)} are ${vocEn.a} (${pct(pAPct, 0)}) and ${f(nNonA, 0)} are not. Converting percentages into counts makes the mechanics almost self-evident and removes calculation slips under stress.`
            : `Prenez 10 000 ${vocFr.cas} : ${f(nA, 0)} sont ${vocFr.a} (${pct(pAPct, 0)}) et ${f(nNonA, 0)} ne le sont pas. Convertir les pourcentages en effectifs rend le mécanisme presque évident et élimine les erreurs de calcul sous stress.`,
        },
        {
          titre: en ? 'Count both kinds of alerts' : "Compter les deux familles d'alertes",
          contenu: en
            ? `True positives: ${f(nA, 0)} × ${pct(sensPct, 0)} = **${f(vraisPositifs, 0)}**. False positives: ${f(nNonA, 0)} × ${pct(fpPct, 0)} = **${f(fauxPositifs, 0)}**. Total ${vocEn.alerte}: ${f(vraisPositifs, 0)} + ${f(fauxPositifs, 0)} = ${f(totalPositifs, 0)}.`
            : `Vrais positifs : ${f(nA, 0)} × ${pct(sensPct, 0)} = **${f(vraisPositifs, 0)}**. Faux positifs : ${f(nNonA, 0)} × ${pct(fpPct, 0)} = **${f(fauxPositifs, 0)}**. Total des ${vocFr.alerte} : ${f(vraisPositifs, 0)} + ${f(fauxPositifs, 0)} = ${f(totalPositifs, 0)}.`,
        },
        {
          titre: en ? 'Take the ratio — and read why' : 'Faire le ratio — et lire pourquoi',
          contenu: en
            ? `$P(A \\mid \\text{alert}) = ${f(vraisPositifs, 0)} / ${f(totalPositifs, 0)}$ = **${pct(reponse)}**. The base is rare (${pct(pAPct, 0)}): the ${pct(fpPct, 0)} of false alerts apply to a much larger population (${f(nNonA, 0)}) and ${reponse < 50 ? 'drown' : 'still dilute'} the ${f(vraisPositifs, 0)} true positives. Base-rate rarity beats test reliability.`
            : `$P(A \\mid \\text{alerte}) = ${f(vraisPositifs, 0)} / ${f(totalPositifs, 0)}$ = **${pct(reponse)}**. La base est rare (${pct(pAPct, 0)}) : les ${pct(fpPct, 0)} de fausses alertes s'appliquent à une population bien plus grande (${f(nNonA, 0)}) et ${reponse < 50 ? 'noient' : 'diluent encore'} les ${f(vraisPositifs, 0)} vrais positifs. La rareté de la base écrase la fiabilité du test.`,
        },
      ],
      pieges: [
        en
          ? `Answering ${pct(sensPct, 0)}: that is $P(\\text{alert} \\mid A)$, not $P(A \\mid \\text{alert})$ — the classic inversion of the conditional (the prosecutor's fallacy). Advertised: ${pct(sensPct, 0)}; real: ${pct(reponse)}.`
          : `Répondre ${pct(sensPct, 0)} : c'est $P(\\text{alerte} \\mid A)$, pas $P(A \\mid \\text{alerte})$ — l'inversion du conditionnement (le sophisme du procureur). Annoncé : ${pct(sensPct, 0)} ; réel : ${pct(reponse)}.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 9. Loi binomiale : exactement k succès (N2)
// ---------------------------------------------------------------------------
export const genBinomiale: ExerciseGenerator = {
  id: 'm2-app-binomiale',
  moduleId: M2,
  titre: 'Loi binomiale : exactement k succès',
  titreEn: 'Binomial law: exactly k successes',
  difficulte: 2,
  // Tirages (ordre strict) : 1. n = randInt(5, 12) · 2. pCinq = randInt(6, 14) (p = pCinq × 5 %)
  // · 3. k = randInt(2, n − 2).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const n = randInt(rng, 5, 12);
    const pCinq = randInt(rng, 6, 14);
    const k = randInt(rng, 2, n - 2);

    const pPct = pCinq * 5;
    const p = pPct / 100;
    const reponse = r4(probaBinomiale(n, k, p) * 100);
    const nbChemins = combinaisons(n, k);
    const probaChemin = p ** k * (1 - p) ** (n - k);
    const sansCoeff = r4(probaChemin * 100);
    const esperance = esperanceBinomiale(n, p);

    const en = langue === 'en';
    const { f, pct } = formatters(langue);
    return {
      enonce: en
        ? `A strategy wins each trade with probability ${pct(pPct, 0)}, and trades are independent. You run ${n} trades.\n\n**What is the probability of exactly ${k} winning trades, in %?**`
        : `Une stratégie gagne chaque trade avec une probabilité de ${pct(pPct, 0)}, et les trades sont indépendants. Vous enchaînez ${n} trades.\n\n**Quelle est la probabilité d'obtenir exactement ${k} trades gagnants, en % ?**`,
      reponse,
      tolerance: 0.01,
      unite: '%',
      etapes: [
        {
          titre: en ? 'Recognise the binomial' : 'Reconnaître la binomiale',
          contenu: en
            ? `${n} independent repetitions of a two-outcome experiment (win with $p = ${f(p, 2)}$): the number of wins follows $X \\sim B(${n};\\,${f(p, 2)})$ and $P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k}$.`
            : `${n} répétitions indépendantes d'une expérience à deux issues (gain avec $p = ${f(p, 2)}$) : le nombre de gains suit $X \\sim B(${n};\\,${f(p, 2)})$ et $P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k}$.`,
        },
        {
          titre: en ? 'Count the paths, weigh one path' : 'Compter les chemins, peser un chemin',
          contenu: en
            ? `$\\binom{${n}}{${k}} = ${f(nbChemins, 0)}$ distinct orderings contain exactly ${k} wins. Each single path has probability $${f(p, 2)}^{${k}} × ${f(1 - p, 2)}^{${n - k}} = ${f(probaChemin, 6)}$.`
            : `$\\binom{${n}}{${k}} = ${f(nbChemins, 0)}$ ordres distincts contiennent exactement ${k} gains. Chaque chemin précis a la probabilité $${f(p, 2)}^{${k}} × ${f(1 - p, 2)}^{${n - k}} = ${f(probaChemin, 6)}$.`,
        },
        {
          titre: en ? 'Assemble and situate' : 'Assembler et situer',
          contenu: en
            ? `$P(X = ${k}) = ${f(nbChemins, 0)} × ${f(probaChemin, 6)}$ = **${pct(reponse, 4)}**. For perspective, the expected number of wins is $np = ${f(esperance, 1)}$: asking for exactly ${k} ${k < esperance ? 'falls below' : k > esperance ? 'sits above' : 'sits right at'} the centre of the distribution.`
            : `$P(X = ${k}) = ${f(nbChemins, 0)} × ${f(probaChemin, 6)}$ = **${pct(reponse, 4)}**. Pour situer : l'espérance vaut $np = ${f(esperance, 1)}$ gains ; demander exactement ${k} se place ${k < esperance ? 'sous le' : k > esperance ? 'au-dessus du' : 'exactement au'} centre de la distribution.`,
        },
      ],
      pieges: [
        en
          ? `Dropping the binomial coefficient: $p^k(1-p)^{n-k}$ alone gives ${pct(sansCoeff, 4)} — the probability of ONE specific ordering, not of the event "exactly ${k} wins" (${f(nbChemins, 0)} times more likely).`
          : `Oublier le coefficient binomial : $p^k(1-p)^{n-k}$ seul donne ${pct(sansCoeff, 4)} — la probabilité d'UN ordre précis, pas de l'événement « exactement ${k} gains » (${f(nbChemins, 0)} fois plus probable).`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 10. Probabilité d'un rendement via le z-score (N2)
// ---------------------------------------------------------------------------
export const genZscore: ExerciseGenerator = {
  id: 'm2-app-zscore',
  moduleId: M2,
  titre: "Probabilité d'un rendement via le z-score",
  titreEn: 'Probability of a return via the z-score',
  difficulte: 2,
  // Tirages (ordre strict) : 1. mu = randInt(2, 10) · 2. sigma = randInt(10, 25)
  // · 3. zCible = pick([−2, −1.5, −1, −0.5, 0.5, 1, 1.5, 2]). seuil = mu + zCible × sigma
  // (construit pour que z tombe rond).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const mu = randInt(rng, 2, 10);
    const sigma = randInt(rng, 10, 25);
    const zCible = pick(rng, [-2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2] as const);

    const seuil = mu + zCible * sigma;
    const z = zScore(seuil, mu, sigma);
    const phi = normaleCdf(z);
    const reponse = r2((1 - phi) * 100);
    const fauxPhi = r2(phi * 100);
    const negatif = zCible < 0;
    const uneSurN = Math.round(100 / reponse);

    const en = langue === 'en';
    const { f, pct, sgn } = formatters(langue);
    return {
      enonce: en
        ? `The annual return of an index is assumed normal with mean ${pct(mu, 0)} and standard deviation ${pct(sigma, 0)}.\n\n**What is the probability that next year's return exceeds ${pct(seuil, 1)}, in %?**`
        : `Le rendement annuel d'un indice est supposé normal, de moyenne ${pct(mu, 0)} et d'écart-type ${pct(sigma, 0)}.\n\n**Quelle est la probabilité que le rendement de l'an prochain dépasse ${pct(seuil, 1)}, en % ?**`,
      reponse,
      tolerance: 0.005,
      unite: '%',
      etapes: [
        {
          titre: en ? 'Convert to a z-score' : 'Convertir en z-score',
          contenu: en
            ? `$z = \\frac{x - \\mu}{\\sigma} = \\frac{${f(seuil, 1)} - ${f(mu, 0)}}{${f(sigma, 0)}} = ${sgn(z, 1)}$: the threshold sits ${f(Math.abs(z), 1)} standard deviation(s) ${negatif ? 'below' : 'above'} the mean. The reflex: always reduce to the standard normal before reading any probability.`
            : `$z = \\frac{x - \\mu}{\\sigma} = \\frac{${f(seuil, 1)} - ${f(mu, 0)}}{${f(sigma, 0)}} = ${sgn(z, 1)}$ : le seuil se trouve à ${f(Math.abs(z), 1)} écart(s)-type(s) ${negatif ? 'sous' : 'au-dessus de'} la moyenne. Le réflexe : toujours se ramener à la normale centrée réduite avant de lire une probabilité.`,
        },
        {
          titre: en ? 'Read the bell, take the complement' : 'Lire la cloche, prendre le complément',
          contenu: en
            ? `$\\Phi(${sgn(z, 1)}) = ${f(phi, 4)}$${negatif ? ` (by symmetry, $\\Phi(${sgn(z, 1)}) = 1 - \\Phi(${f(Math.abs(z), 1)})$)` : ''}: that is the probability of finishing **below** the threshold. Above it: $P = 1 - ${f(phi, 4)}$ = **${pct(reponse)}**.`
            : `$\\Phi(${sgn(z, 1)}) = ${f(phi, 4)}$${negatif ? ` (par symétrie, $\\Phi(${sgn(z, 1)}) = 1 - \\Phi(${f(Math.abs(z), 1)})$)` : ''} : c'est la probabilité de finir **sous** le seuil. Au-dessus : $P = 1 - ${f(phi, 4)}$ = **${pct(reponse)}**.`,
        },
        {
          titre: en ? 'Put a frequency on it' : 'Traduire en fréquence',
          contenu: en
            ? `${reponse <= 50 ? `About one year in ${f(uneSurN, 0)}.` : `More often than one year in two.`} Keep the 68–95–99.7 landmarks to sanity-check any z-score reading — and remember the model's limit: real returns have fat tails, so the bell understates extreme years.`
            : `${reponse <= 50 ? `Environ une année sur ${f(uneSurN, 0)}.` : `Plus d'une année sur deux.`} Gardez les repères 68-95-99,7 pour contrôler toute lecture de z-score — et la limite du modèle : les rendements réels ont des queues épaisses, la cloche sous-estime les années extrêmes.`,
        },
      ],
      pieges: [
        en
          ? `Reporting $\\Phi(z)$ = ${pct(fauxPhi)} — the probability of being BELOW the threshold — instead of its complement ${pct(reponse)}: always check which side of the bell the question asks for.`
          : `Annoncer $\\Phi(z)$ = ${pct(fauxPhi)} — la probabilité d'être SOUS le seuil — au lieu de son complément ${pct(reponse)} : toujours vérifier de quel côté de la cloche la question se place.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 11. Intervalle de confiance à 95 % (N2)
// ---------------------------------------------------------------------------
export const genIc: ExerciseGenerator = {
  id: 'm2-app-ic',
  moduleId: M2,
  titre: 'Intervalle de confiance à 95 %',
  titreEn: '95% confidence interval',
  difficulte: 2,
  // Tirages (ordre strict) : 1. moyenne = randFloat(0.2, 2, 1) · 2. s = randFloat(2, 6, 1)
  // · 3. n = pick([25, 36, 49, 64, 100, 144]) (carrés parfaits : √n tombe juste).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const moyenne = randFloat(rng, 0.2, 2, 1);
    const s = randFloat(rng, 2, 6, 1);
    const n = pick(rng, [25, 36, 49, 64, 100, 144] as const);

    const ic = intervalleConfiance(moyenne, s, n);
    const reponse = r2(ic.haute);
    const racineN = Math.sqrt(n);
    const es = s / racineN;
    const marge = 1.96 * es;
    const basse = r2(ic.basse);
    const contientZero = ic.basse < 0;
    const fauxDiviseurN = r2(moyenne + 1.96 * (s / n));

    const en = langue === 'en';
    const { f, pct } = formatters(langue);
    return {
      enonce: en
        ? `A backtest over ${n} months shows an average monthly return of ${pct(moyenne, 1)} with a standard deviation of ${pct(s, 1)}.\n\n**Give the UPPER bound of the 95% confidence interval on the mean (z = 1.96), in %.**`
        : `Un backtest sur ${n} mois affiche un rendement mensuel moyen de ${pct(moyenne, 1)} avec un écart-type de ${pct(s, 1)}.\n\n**Donnez la borne HAUTE de l'intervalle de confiance à 95 % sur la moyenne (z = 1,96), en %.**`,
      reponse,
      tolerance: 0.01,
      unite: '%',
      etapes: [
        {
          titre: en ? 'The standard error' : "L'erreur standard",
          contenu: en
            ? `The sample mean is itself a random variable; its dispersion across samples is the standard error: $ES = s/\\sqrt{n} = ${f(s, 1)}/\\sqrt{${n}} = ${f(s, 1)}/${f(racineN, 0)} = ${f(es, 4)}$ points.`
            : `La moyenne d'échantillon est elle-même une variable aléatoire ; sa dispersion d'un échantillon à l'autre est l'erreur standard : $ES = s/\\sqrt{n} = ${f(s, 1)}/\\sqrt{${n}} = ${f(s, 1)}/${f(racineN, 0)} = ${f(es, 4)}$ point(s).`,
        },
        {
          titre: en ? 'The 95% margin' : 'La marge à 95 %',
          contenu: en
            ? `Margin = $1.96 × ${f(es, 4)} = ${f(marge, 4)}$ points, hence $IC_{95\\,\\%} = [\\,${f(moyenne, 1)} - ${f(marge, 4)}\\;;\\; ${f(moyenne, 1)} + ${f(marge, 4)}\\,] = [\\,${f(basse)}\\;;\\;${f(reponse)}\\,]$. The requested upper bound: **${pct(reponse)}**.`
            : `Marge = $1{,}96 × ${f(es, 4)} = ${f(marge, 4)}$ point(s), d'où $IC_{95\\,\\%} = [\\,${f(moyenne, 1)} - ${f(marge, 4)}\\;;\\; ${f(moyenne, 1)} + ${f(marge, 4)}\\,] = [\\,${f(basse)}\\;;\\;${f(reponse)}\\,]$. La borne haute demandée : **${pct(reponse)}**.`,
        },
        {
          titre: en ? 'Read the interval like a pro' : "Lire l'intervalle en pro",
          contenu: en
            ? `${contientZero ? `The lower bound (${pct(basse)}) is negative: the interval **contains zero** — ${n} months of data are not even enough to claim the true mean is positive. The signal drowns in the noise.` : `The lower bound (${pct(basse)}) stays positive: zero is excluded — at 95%, the data do support a positive mean.`} And mind the wording: the 95% applies to the **method** (95% of such intervals catch μ), not to this particular interval.`
            : `${contientZero ? `La borne basse (${pct(basse)}) est négative : l'intervalle **contient zéro** — ${n} mois de données ne suffisent même pas à affirmer que la vraie moyenne est positive. Le signal se noie dans le bruit.` : `La borne basse (${pct(basse)}) reste positive : zéro est exclu — à 95 %, les données soutiennent bien une moyenne positive.`} Et attention à la formulation : les 95 % portent sur la **méthode** (95 % des intervalles ainsi construits attrapent μ), pas sur cet intervalle-ci.`,
        },
      ],
      pieges: [
        en
          ? `Dividing by n instead of √n: upper bound ${pct(fauxDiviseurN)} — the variance divides by n, the standard deviation by √n. The classic slip.`
          : `Diviser par n au lieu de √n : borne haute ${pct(fauxDiviseurN)} — c'est la variance qui se divise par n, l'écart-type par √n. L'erreur classique.`,
        en
          ? `Saying "there is a 95% chance that μ lies in the interval": μ is fixed, the interval is random — the confidence qualifies the interval-making machine, not the interval made.`
          : `Dire « il y a 95 % de chances que μ soit dans l'intervalle » : μ est fixe, c'est l'intervalle qui est aléatoire — la confiance qualifie la machine à fabriquer des intervalles, pas l'intervalle fabriqué.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 12. Le t de Student d'un alpha (N3)
// ---------------------------------------------------------------------------
export const genStatT: ExerciseGenerator = {
  id: 'm2-app-stat-t',
  moduleId: M2,
  titre: "Le t de Student d'un alpha",
  titreEn: 'The t-statistic of an alpha',
  difficulte: 3,
  // Tirages (ordre strict) : 1. alpha = randFloat(0.5, 3, 1) · 2. s = randFloat(3, 8, 1)
  // · 3. n = pick([16, 25, 36, 49, 64]) (carrés parfaits : √n tombe juste).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const alpha = randFloat(rng, 0.5, 3, 1);
    const s = randFloat(rng, 3, 8, 1);
    const n = pick(rng, [16, 25, 36, 49, 64] as const);

    const reponse = r2(statT(alpha, 0, s, n));
    const racineN = Math.sqrt(n);
    const es = s / racineN;
    const petitN = n < 30;
    const seuilStudent = n === 16 ? 2.13 : 2.06; // Student à n−1 ddl (15 ou 24)
    const signif196 = reponse > 1.96;
    const signifStudent = reponse > seuilStudent;
    const fauxDiviseurN = r2(statT(alpha, 0, s, n) * racineN); // diviser par s/n au lieu de s/√n

    const en = langue === 'en';
    const { f, pct } = formatters(langue);
    const lectureFr = petitN
      ? signif196 && !signifStudent
        ? `$|t| = ${f(reponse)} > 1{,}96$ : significatif au seuil de 5 % bilatéral… d'un cheveu. Mais avec $n = ${n} < 30$, le test exact est un **Student à ${n - 1} degrés de liberté**, dont le seuil vaut ${f(seuilStudent)} : le cheveu casse — non significatif en toute rigueur. L'honnêteté statistique conclut : insuffisant pour écarter le pur hasard.`
        : signifStudent
          ? `$|t| = ${f(reponse)}$ dépasse 1,96 ET le seuil exact du **Student à ${n - 1} degrés de liberté** (${f(seuilStudent)}), exigible avec $n = ${n} < 30$ : l'alpha est statistiquement significatif au seuil de 5 % — probablement pas du simple bruit.`
          : `$|t| = ${f(reponse)} < 1{,}96$ : non significatif au seuil de 5 % bilatéral — et le **Student à ${n - 1} degrés de liberté** (seuil ${f(seuilStudent)}, exigible avec $n = ${n} < 30$) est encore plus sévère. L'écart observé est compatible avec du pur hasard.`
      : signif196
        ? `$|t| = ${f(reponse)} > 1{,}96$ : significatif au seuil de 5 % bilatéral. Avec $n = ${n} \\ge 30$, le seuil normal 1,96 est une bonne approximation du Student à ${n - 1} degrés de liberté.`
        : `$|t| = ${f(reponse)} < 1{,}96$ : non significatif au seuil de 5 % bilatéral — l'alpha observé est compatible avec du pur hasard (et $n = ${n} \\ge 30$ rend le seuil 1,96 fiable).`;
    const lectureEn = petitN
      ? signif196 && !signifStudent
        ? `$|t| = ${f(reponse)} > 1.96$: significant at the 5% two-sided level… by a hair. But with $n = ${n} < 30$, the exact test is a **Student t with ${n - 1} degrees of freedom**, whose threshold is ${f(seuilStudent)}: the hair snaps — not significant, strictly speaking. Statistical honesty concludes: not enough to rule out pure luck.`
        : signifStudent
          ? `$|t| = ${f(reponse)}$ clears both 1.96 AND the exact **Student-t threshold at ${n - 1} degrees of freedom** (${f(seuilStudent)}), required with $n = ${n} < 30$: the alpha is statistically significant at the 5% level — probably not mere noise.`
          : `$|t| = ${f(reponse)} < 1.96$: not significant at the 5% two-sided level — and the **Student t with ${n - 1} degrees of freedom** (threshold ${f(seuilStudent)}, required with $n = ${n} < 30$) is stricter still. The observed gap is compatible with pure luck.`
      : signif196
        ? `$|t| = ${f(reponse)} > 1.96$: significant at the 5% two-sided level. With $n = ${n} \\ge 30$, the normal threshold 1.96 is a good approximation of the Student t at ${n - 1} degrees of freedom.`
        : `$|t| = ${f(reponse)} < 1.96$: not significant at the 5% two-sided level — the observed alpha is compatible with pure luck (and $n = ${n} \\ge 30$ makes the 1.96 threshold reliable).`;
    return {
      enonce: en
        ? `A fund beats its benchmark by ${pct(alpha, 1)} a year on average over ${n} years, with a standard deviation of annual excess returns of ${pct(s, 1)}. Under $H_0$ (no skill), the true excess return is 0.\n\n**Compute the t-statistic of this alpha.**`
        : `Un fonds bat son indice de ${pct(alpha, 1)} par an en moyenne sur ${n} ans, avec un écart-type des excédents annuels de ${pct(s, 1)}. Sous $H_0$ (pas de talent), le vrai excédent vaut 0.\n\n**Calculez la statistique t de cet alpha.**`,
      reponse,
      tolerance: 0.01,
      etapes: [
        {
          titre: en ? 'The standard error of the alpha' : "L'erreur standard de l'alpha",
          contenu: en
            ? `$ES = s/\\sqrt{n} = ${f(s, 1)}/\\sqrt{${n}} = ${f(s, 1)}/${f(racineN, 0)} = ${f(es, 4)}$ points: the dispersion of the average excess return across ${n}-year samples.`
            : `$ES = s/\\sqrt{n} = ${f(s, 1)}/\\sqrt{${n}} = ${f(s, 1)}/${f(racineN, 0)} = ${f(es, 4)}$ point(s) : la dispersion de l'excédent moyen d'un échantillon de ${n} ans à l'autre.`,
        },
        {
          titre: en ? 'Count the gap in standard errors' : "Compter l'écart en erreurs standards",
          contenu: en
            ? `$t = \\frac{\\bar{x} - \\mu_0}{s/\\sqrt{n}} = \\frac{${f(alpha, 1)} - 0}{${f(es, 4)}}$ = **${f(reponse)}**: the outperformance sits ${f(reponse)} standard error(s) away from what pure chance would produce.`
            : `$t = \\frac{\\bar{x} - \\mu_0}{s/\\sqrt{n}} = \\frac{${f(alpha, 1)} - 0}{${f(es, 4)}}$ = **${f(reponse)}** : la surperformance se tient à ${f(reponse)} erreur(s) standard(s) de ce que le hasard seul produirait.`,
        },
        {
          titre: en ? 'Significant or not?' : 'Significatif ou non ?',
          contenu: en ? lectureEn : lectureFr,
        },
      ],
      pieges: [
        en
          ? `Dividing by $s/n$ instead of $s/\\sqrt{n}$ inflates the statistic to ${f(fauxDiviseurN)}: it is the variance that divides by n, the standard deviation by √n.`
          : `Diviser par $s/n$ au lieu de $s/\\sqrt{n}$ gonfle la statistique à ${f(fauxDiviseurN)} : c'est la variance qui se divise par n, l'écart-type par √n.`,
        en
          ? 'Significant ≠ important: a high t says "probably not noise", never "worth money" — and it says nothing about how many funds were tested before this one was shown to you.'
          : "Significatif ≠ important : un t élevé dit « probablement pas du bruit », jamais « ça vaut de l'argent » — et il ne dit rien du nombre de fonds testés avant qu'on vous montre celui-ci.",
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 13. Régression : pente, ordonnée et prédiction (N3)
// ---------------------------------------------------------------------------
export const genRegression: ExerciseGenerator = {
  id: 'm2-app-regression',
  moduleId: M2,
  titre: 'Régression : pente, ordonnée et prédiction',
  titreEn: 'Regression: slope, intercept and prediction',
  difficulte: 3,
  // Tirages (ordre strict) : 1. b = randFloat(0.6, 1.8, 1) · 2. a = pick([−2, −1, 1, 2])
  // · 3. e = randInt(1, 2) · 4. x0 = randInt(4, 6). xs = [−3, −1, 1, 3] (fixes) ;
  // ys = [a − 3b − e, a − b + e, a + b + e, a + 3b − e] : les résidus (−e, +e, +e, −e) somment
  // à zéro ET sont orthogonaux à x, donc la droite MCO vaut exactement ŷ = a + b·x.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const b = randFloat(rng, 0.6, 1.8, 1);
    const a = pick(rng, [-2, -1, 1, 2] as const);
    const e = randInt(rng, 1, 2);
    const x0 = randInt(rng, 4, 6);

    const xs = [-3, -1, 1, 3];
    const ys = [a - 3 * b - e, a - b + e, a + b + e, a + 3 * b - e];
    const pente = penteRegression(xs, ys);
    const ordonnee = ordonneeRegression(xs, ys);
    const reponse = r2(ordonnee + pente * x0);
    const yBar = moyenneArithmetique(ys);
    const sommeXY = 20 * pente; // Σ écarts x × écarts y (car Σ écarts x² = 20)
    const r2pct = r2(r2Regression(xs, ys) * 100);
    const fauxSansOrdonnee = r2(pente * x0);

    const en = langue === 'en';
    const { f, pct, sgn } = formatters(langue);
    const serieX = xs.map((v) => sgn(v, 0)).join(en ? ', ' : ' ; ');
    const serieY = ys.map((v) => sgn(v, 1)).join(en ? ', ' : ' ; ');
    return {
      enonce: en
        ? `Four weeks of returns (in %) — market: ${serieX}; stock: ${serieY}. Next week you expect a market return of ${pct(x0, 0)}.\n\n**What stock return does the OLS regression predict, in %?**`
        : `Quatre semaines de rendements (en %) — marché : ${serieX} ; titre : ${serieY}. La semaine prochaine, vous anticipez un rendement de marché de ${pct(x0, 0)}.\n\n**Quel rendement du titre la régression MCO prédit-elle, en % ?**`,
      reponse,
      tolerance: 0.01,
      unite: '%',
      etapes: [
        {
          titre: en ? 'Means first' : "Les moyennes d'abord",
          contenu: en
            ? `$\\bar{x} = 0$ (symmetric values) and $\\bar{y} = ${f(yBar, 1)}$. The OLS line always passes through the mean point $(\\bar{x}, \\bar{y})$ — keep that as a built-in check.`
            : `$\\bar{x} = 0$ (valeurs symétriques) et $\\bar{y} = ${f(yBar, 1)}$. La droite MCO passe toujours par le point moyen $(\\bar{x}, \\bar{y})$ — gardez-le comme contrôle intégré.`,
        },
        {
          titre: en ? 'The slope: a normalised covariance' : 'La pente : une covariance normalisée',
          contenu: en
            ? `$b = \\frac{\\text{cov}(x,y)}{\\text{var}(x)}$. With $\\bar{x} = 0$: $\\sum (x_i - \\bar{x})^2 = 9+1+1+9 = 20$ and $\\sum (x_i - \\bar{x})(y_i - \\bar{y}) = ${f(sommeXY, 1)}$, hence $b = ${f(sommeXY, 1)}/20 = ${f(pente, 2)}$ — the stock's beta to the market: it amplifies market moves by a factor ${f(pente, 2)}.`
            : `$b = \\frac{\\text{cov}(x,y)}{\\text{var}(x)}$. Avec $\\bar{x} = 0$ : $\\sum (x_i - \\bar{x})^2 = 9+1+1+9 = 20$ et $\\sum (x_i - \\bar{x})(y_i - \\bar{y}) = ${f(sommeXY, 1)}$, d'où $b = ${f(sommeXY, 1)}/20 = ${f(pente, 2)}$ — le beta du titre au marché : il amplifie les mouvements d'un facteur ${f(pente, 2)}.`,
        },
        {
          titre: en ? 'The intercept, then the prediction' : "L'ordonnée, puis la prédiction",
          contenu: en
            ? `$a = \\bar{y} - b\\bar{x} = ${f(yBar, 1)} - ${f(pente, 2)} × 0 = ${f(ordonnee, 1)}$. The fitted line: $\\hat{y} = ${f(ordonnee, 1)} + ${f(pente, 2)}x$ (it explains $R^2 = ${f(r2pct, 0)}$% of the stock's variance). At $x_0 = ${f(x0, 0)}$: $\\hat{y} = ${f(ordonnee, 1)} + ${f(pente, 2)} × ${f(x0, 0)}$ = **${pct(reponse)}**.`
            : `$a = \\bar{y} - b\\bar{x} = ${f(yBar, 1)} - ${f(pente, 2)} × 0 = ${f(ordonnee, 1)}$. La droite estimée : $\\hat{y} = ${f(ordonnee, 1)} + ${f(pente, 2)}x$ (elle explique $R^2 = ${f(r2pct, 0)}$ % de la variance du titre). En $x_0 = ${f(x0, 0)}$ : $\\hat{y} = ${f(ordonnee, 1)} + ${f(pente, 2)} × ${f(x0, 0)}$ = **${pct(reponse)}**.`,
        },
        {
          titre: en ? 'The honesty clause' : "La clause d'honnêteté",
          contenu: en
            ? `Two professional caveats: ${f(x0, 0)}% lies outside the observed range (±3%) — the line only truly exists over the cloud, extrapolation is a leap of faith; and a slope fitted on 4 points carries a huge standard error — a beta on 4 observations is a poll of 4 people.`
            : `Deux réserves de pro : ${f(x0, 0)} % sort de la plage observée (±3 %) — la droite n'existe vraiment que sur le nuage, extrapoler est un acte de foi ; et une pente estimée sur 4 points porte une énorme erreur standard — un beta sur 4 observations est un sondage à 4 personnes.`,
        },
      ],
      pieges: [
        en
          ? `Predicting with the slope alone: ${f(pente, 2)} × ${f(x0, 0)} = ${pct(fauxSansOrdonnee)} — the intercept (${f(ordonnee, 1)}) is part of the line; dropping it shifts the forecast by ${f(Math.abs(ordonnee), 1)} point(s).`
          : `Prédire avec la pente seule : ${f(pente, 2)} × ${f(x0, 0)} = ${pct(fauxSansOrdonnee)} — l'ordonnée à l'origine (${f(ordonnee, 1)}) fait partie de la droite ; l'oublier décale la prévision de ${f(Math.abs(ordonnee), 1)} point(s).`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 14. Volatilité d'un portefeuille 2 actifs (N3)
// ---------------------------------------------------------------------------
export const genPortefeuille2: ExerciseGenerator = {
  id: 'm2-app-portefeuille2',
  moduleId: M2,
  titre: "Volatilité d'un portefeuille 2 actifs",
  titreEn: 'Volatility of a two-asset portfolio',
  difficulte: 3,
  // Tirages (ordre strict) : 1. w5 = randInt(4, 16) (w1 = w5 × 5 %) · 2. sigma1 = randInt(10, 30)
  // · 3. sigma2 = randInt(5, 25) · 4. rho = pick([−0.6, −0.4, −0.2, 0.2, 0.4, 0.6, 0.8])
  // (ρ ≠ 0 pour que le piège « sans covariance » diffère de la réponse, ρ < 1 strict).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const w5 = randInt(rng, 4, 16);
    const sigma1 = randInt(rng, 10, 30);
    const sigma2 = randInt(rng, 5, 25);
    const rho = pick(rng, [-0.6, -0.4, -0.2, 0.2, 0.4, 0.6, 0.8] as const);

    const w1 = (w5 * 5) / 100;
    const w2 = 1 - w1;
    const variance = variancePortefeuille2(w1, sigma1, sigma2, rho);
    const reponse = r2(Math.sqrt(variance));
    const t1 = w1 * w1 * sigma1 * sigma1;
    const t2 = w2 * w2 * sigma2 * sigma2;
    const t3 = variance - t1 - t2; // = 2·w1·w2·ρ·σ1·σ2
    const sansCov = r2(Math.sqrt(variancePortefeuille2(w1, sigma1, sigma2, 0)));
    const moyennePonderee = r2(w1 * sigma1 + w2 * sigma2);
    const gainDiversif = r2(moyennePonderee - reponse);

    const en = langue === 'en';
    const { f, pct, sgn } = formatters(langue);
    return {
      enonce: en
        ? `A portfolio invests ${pct(w1 * 100, 0)} in asset A (volatility ${pct(sigma1, 0)}) and ${pct(w2 * 100, 0)} in asset B (volatility ${pct(sigma2, 0)}). The correlation between A and B is ${f(rho, 1)}.\n\n**What is the volatility (standard deviation) of the portfolio, in %?**`
        : `Un portefeuille investit ${pct(w1 * 100, 0)} en actif A (volatilité ${pct(sigma1, 0)}) et ${pct(w2 * 100, 0)} en actif B (volatilité ${pct(sigma2, 0)}). La corrélation entre A et B vaut ${f(rho, 1)}.\n\n**Quelle est la volatilité (écart-type) du portefeuille, en % ?**`,
      reponse,
      tolerance: 0.005,
      unite: '%',
      etapes: [
        {
          titre: en ? 'The two-asset variance formula' : 'La formule de variance à 2 actifs',
          contenu: en
            ? `$\\sigma_p^2 = w_1^2\\sigma_1^2 + w_2^2\\sigma_2^2 + 2 w_1 w_2 \\rho \\sigma_1 \\sigma_2$. The third term carries the whole story of diversification: it is the only place where the correlation enters.`
            : `$\\sigma_p^2 = w_1^2\\sigma_1^2 + w_2^2\\sigma_2^2 + 2 w_1 w_2 \\rho \\sigma_1 \\sigma_2$. Le troisième terme porte toute l'histoire de la diversification : c'est le seul endroit où la corrélation entre en scène.`,
        },
        {
          titre: en ? 'Term by term' : 'Terme à terme',
          contenu: en
            ? `$w_1^2\\sigma_1^2 = ${f(w1, 2)}^2 × ${f(sigma1, 0)}^2 = ${f(t1, 2)}$; $w_2^2\\sigma_2^2 = ${f(w2, 2)}^2 × ${f(sigma2, 0)}^2 = ${f(t2, 2)}$; covariance term $= 2 × ${f(w1, 2)} × ${f(w2, 2)} × ${f(rho, 1)} × ${f(sigma1, 0)} × ${f(sigma2, 0)} = ${sgn(t3, 2)}$. Total: $\\sigma_p^2 = ${f(variance, 2)}$ %².`
            : `$w_1^2\\sigma_1^2 = ${f(w1, 2)}^2 × ${f(sigma1, 0)}^2 = ${f(t1, 2)}$ ; $w_2^2\\sigma_2^2 = ${f(w2, 2)}^2 × ${f(sigma2, 0)}^2 = ${f(t2, 2)}$ ; terme de covariance $= 2 × ${f(w1, 2)} × ${f(w2, 2)} × ${f(rho, 1)} × ${f(sigma1, 0)} × ${f(sigma2, 0)} = ${sgn(t3, 2)}$. Total : $\\sigma_p^2 = ${f(variance, 2)}$ %².`,
        },
        {
          titre: en ? 'Back to a volatility — and read the gain' : 'Revenir à la volatilité — et lire le gain',
          contenu: en
            ? `$\\sigma_p = \\sqrt{${f(variance, 2)}}$ = **${pct(reponse)}**. Compare with the weighted average of the volatilities, $${f(w1, 2)} × ${f(sigma1, 0)} + ${f(w2, 2)} × ${f(sigma2, 0)} = ${pct(moyennePonderee)}$: as soon as ρ < 1, the portfolio is **less** volatile than the average of its parts — the diversification gain is worth ${f(gainDiversif)} point(s) here${rho < 0 ? ', boosted by the negative correlation' : ''}.`
            : `$\\sigma_p = \\sqrt{${f(variance, 2)}}$ = **${pct(reponse)}**. Comparez à la moyenne pondérée des volatilités, $${f(w1, 2)} × ${f(sigma1, 0)} + ${f(w2, 2)} × ${f(sigma2, 0)} = ${pct(moyennePonderee)}$ : dès que ρ < 1, le portefeuille est **moins** volatil que la moyenne de ses composantes — le gain de diversification vaut ${f(gainDiversif)} point(s) ici${rho < 0 ? ', dopé par la corrélation négative' : ''}.`,
        },
      ],
      pieges: [
        en
          ? `Forgetting the covariance term: $\\sqrt{w_1^2\\sigma_1^2 + w_2^2\\sigma_2^2}$ = ${pct(sansCov)} instead of ${pct(reponse)} — that amounts to silently assuming ρ = 0.`
          : `Oublier le terme de covariance : $\\sqrt{w_1^2\\sigma_1^2 + w_2^2\\sigma_2^2}$ = ${pct(sansCov)} au lieu de ${pct(reponse)} — c'est supposer ρ = 0 sans le dire.`,
        en
          ? `Reporting the variance (${f(variance, 2)} %²) instead of the volatility (${pct(reponse)}): mind the unit — %² is not a readable risk number.`
          : `Annoncer la variance (${f(variance, 2)} %²) au lieu de la volatilité (${pct(reponse)}) : attention à l'unité — des %² ne sont pas un chiffre de risque lisible.`,
      ],
    };
  },
};

export const exercices: ExerciseGenerator[] = [
  genVaAnnuite,
  genMensualite,
  genPerpetuite,
  genVan,
  genMoyenneGeo,
  genVolAnnualisee,
  genCorrelation,
  genBayes,
  genBinomiale,
  genZscore,
  genIc,
  genStatT,
  genRegression,
  genPortefeuille2,
];
