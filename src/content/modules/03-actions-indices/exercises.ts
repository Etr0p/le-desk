/**
 * Les 13 générateurs d'exercices d'application du module Actions & indices.
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
  ajustementSplit,
  bpa,
  coutEmprunTitres,
  dcfSimple,
  ddmDeuxEtapes,
  evSurEbitda,
  gordon,
  indiceCapiPonderee,
  per,
  pnlVenteADecouvert,
  poidsDansIndice,
  prixTheoriqueExDividende,
  rendementDividende,
  tauxDistribution,
  valeurDroitSouscription,
  valeurTerminaleGordon,
  type ConstituantIndice,
} from './calculs';

const M3 = '03-actions-indices';

const r2 = (v: number) => Math.round(v * 100) / 100;

/** Formateurs dépendants de la langue : nombre, euros, pourcentage, millions d'euros. */
function formatters(langue: Langue) {
  const f = (v: number, d = 2) => formatNombreLangue(langue, v, d);
  const eur = (v: number, d = 2) => (langue === 'en' ? `€${f(v, d)}` : `${f(v, d)} €`);
  const pct = (v: number, d = 2) => (langue === 'en' ? `${f(v, d)}%` : `${f(v, d)} %`);
  const meur = (v: number, d = 0) => (langue === 'en' ? `€${f(v, d)}m` : `${f(v, d)} M€`);
  /** Nombre signé (+2 / −1), pour afficher des P&L ou des écarts. */
  const sgn = (v: number, d = 2) => (v > 0 ? `+${f(v, d)}` : f(v, d));
  return { f, eur, pct, meur, sgn };
}

// ---------------------------------------------------------------------------
// 1. Gordon-Shapiro : la valeur intrinsèque (N1)
// ---------------------------------------------------------------------------
export const genGordon: ExerciseGenerator = {
  id: 'm3-app-gordon',
  moduleId: M3,
  titre: 'Gordon-Shapiro : la valeur intrinsèque',
  titreEn: 'Gordon growth model: intrinsic value',
  difficulte: 1,
  // Tirages (ordre strict) : 1. d0 = randFloat(1, 6, 2) · 2. g = randFloat(0.5, 5, 1)
  // · 3. ecart = randFloat(1.5, 5, 1). r = r2(g + ecart) — zone saine r − g ≥ 1,5 pt
  // garantie par construction ; D1 = d0 × (1 + g/100).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const d0 = randFloat(rng, 1, 6, 2);
    const g = randFloat(rng, 0.5, 5, 1);
    const ecart = randFloat(rng, 1.5, 5, 1);

    const r = r2(g + ecart);
    const d1 = d0 * (1 + g / 100);
    const reponse = r2(gordon(d1, r, g));
    const fauxD0 = r2(gordon(d0, r, g));
    const ecartPiege = r2(reponse - fauxD0);
    const sensible = r2(gordon(d1, r2(r - 0.5), g)); // si r baisse d'un demi-point

    const en = langue === 'en';
    const { f, eur, pct } = formatters(langue);
    return {
      enonce: en
        ? `A company has just paid a dividend of ${eur(d0)} per share. Dividends are expected to grow at ${pct(g, 1)} a year for ever, and shareholders' required return is ${pct(r, 1)}.\n\n**What is the intrinsic value of the share under the Gordon growth model, in euros?**`
        : `Une société vient de verser un dividende de ${eur(d0)} par action. Les dividendes croîtront de ${pct(g, 1)} par an indéfiniment, et le taux de rentabilité exigé par les actionnaires est de ${pct(r, 1)}.\n\n**Quelle est la valeur intrinsèque de l'action selon Gordon-Shapiro, en euros ?**`,
      reponse,
      tolerance: 0.005,
      unite: '€',
      etapes: [
        {
          titre: en ? 'From D₀ to D₁' : 'Passer de D₀ à D₁',
          contenu: en
            ? `Gordon prices **next year's** dividend, not the one just paid: ${eur(d0)} is $D_0$, already gone to the previous holder. The model needs $D_1 = D_0 × (1+g) = ${f(d0)} × ${f(1 + g / 100, 3)} = ${eur(d1)}$.`
            : `Gordon valorise le dividende de **l'an prochain**, pas celui qui vient de tomber : ${eur(d0)} est $D_0$, déjà encaissé par le détenteur précédent. Le modèle exige $D_1 = D_0 × (1+g) = ${f(d0)} × ${f(1 + g / 100, 3)} = ${eur(d1)}$.`,
        },
        {
          titre: en ? 'Divide by the r − g spread' : "Diviser par l'écart r − g",
          contenu: en
            ? `$P_0 = \\dfrac{D_1}{r - g} = \\dfrac{${f(d1)}}{${f(r, 1)}\\,\\% - ${f(g, 1)}\\,\\%} = \\dfrac{${f(d1)}}{${f((r - g) / 100, 3)}}$ = **${eur(reponse)}**. The whole valuation rests on a spread of ${f(ecart, 1)} point(s) — a growing perpetuity, the big sister of the flat perpetuity $F/r$.`
            : `$P_0 = \\dfrac{D_1}{r - g} = \\dfrac{${f(d1)}}{${f(r, 1)}\\,\\% - ${f(g, 1)}\\,\\%} = \\dfrac{${f(d1)}}{${f((r - g) / 100, 3)}}$ = **${eur(reponse)}**. Toute la valorisation repose sur un écart de ${f(ecart, 1)} point(s) — une perpétuité croissante, grande sœur de la perpétuité simple $F/r$.`,
        },
        {
          titre: en ? 'Feel the sensitivity' : 'Sentir la sensibilité',
          contenu: en
            ? `Shave just 0.5 point off the required return (${pct(r2(r - 0.5), 1)} instead of ${pct(r, 1)}) and the value jumps to ${eur(sensible)}. The closer r gets to g, the more explosive the formula — which is why Gordon is reserved for mature, stable payers and "healthy" spreads.`
            : `Retirez seulement 0,5 point au taux exigé (${pct(r2(r - 0.5), 1)} au lieu de ${pct(r, 1)}) et la valeur saute à ${eur(sensible)}. Plus r se rapproche de g, plus la formule devient explosive — c'est pourquoi Gordon se réserve aux valeurs mûres et régulières, avec un écart r − g « sain ».`,
        },
      ],
      pieges: [
        en
          ? `Plugging in ${eur(d0)} directly: that prices $D_0$ and gives ${eur(fauxD0)} instead of ${eur(reponse)} — the forgotten year of growth is worth ${eur(ecartPiege)} here. The numerator is always the dividend you have NOT received yet.`
          : `Brancher ${eur(d0)} tel quel : c'est valoriser $D_0$, ce qui donne ${eur(fauxD0)} au lieu de ${eur(reponse)} — l'année de croissance oubliée pèse ${eur(ecartPiege)} ici. Le numérateur est toujours le dividende que vous n'avez PAS encore touché.`,
        en
          ? 'The formula only exists if r > g: with r ≤ g, the growing perpetuity diverges and Gordon has nothing to say — no stock grows faster than its discount rate for ever.'
          : "La formule n'existe que si r > g : avec r ≤ g, la perpétuité croissante diverge et Gordon ne dit plus rien — aucune action ne croît éternellement plus vite que son taux d'actualisation.",
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 2. Ce que vaut la croissance (N2)
// ---------------------------------------------------------------------------
export const genGordonCroissance: ExerciseGenerator = {
  id: 'm3-app-gordon-croissance',
  moduleId: M3,
  titre: 'Ce que vaut la croissance',
  titreEn: 'What growth is worth',
  difficulte: 2,
  // Tirages (ordre strict) : 1. d1 = randFloat(1.5, 6, 2) · 2. g = randFloat(1, 4, 1)
  // · 3. ecart = randFloat(2, 6, 1). r = r2(g + ecart).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const d1 = randFloat(rng, 1.5, 6, 2);
    const g = randFloat(rng, 1, 4, 1);
    const ecart = randFloat(rng, 2, 6, 1);

    const r = r2(g + ecart);
    const avecG = gordon(d1, r, g);
    const sansG = gordon(d1, r, 0);
    const reponse = r2(avecG - sansG);
    const partPct = r2(((avecG - sansG) / avecG) * 100);

    const en = langue === 'en';
    const { f, eur, pct } = formatters(langue);
    return {
      enonce: en
        ? `A share will pay a dividend of ${eur(d1)} in one year. The required return is ${pct(r, 1)}. Compare two scenarios: perpetual dividend growth of ${pct(g, 1)} a year, versus a flat dividend (g = 0).\n\n**How much of the share's value, in euros, comes from growth alone?**`
        : `Une action versera un dividende de ${eur(d1)} dans un an. Le taux exigé est de ${pct(r, 1)}. Comparez deux scénarios : croissance perpétuelle du dividende de ${pct(g, 1)} par an, ou dividende constant (g = 0).\n\n**Quelle part de la valeur de l'action, en euros, vient de la seule croissance ?**`,
      reponse,
      tolerance: 0.005,
      unite: '€',
      etapes: [
        {
          titre: en ? 'Value WITH growth' : 'La valeur AVEC croissance',
          contenu: en
            ? `Gordon with $g = ${f(g, 1)}\\,\\%$: $P_0 = \\dfrac{${f(d1)}}{${f(r, 1)}\\,\\% - ${f(g, 1)}\\,\\%}$ = **${eur(r2(avecG))}**. This is the full intrinsic value, growth included.`
            : `Gordon avec $g = ${f(g, 1)}\\,\\%$ : $P_0 = \\dfrac{${f(d1)}}{${f(r, 1)}\\,\\% - ${f(g, 1)}\\,\\%}$ = **${eur(r2(avecG))}**. C'est la valeur intrinsèque complète, croissance comprise.`,
        },
        {
          titre: en ? 'Value WITHOUT growth' : 'La valeur SANS croissance',
          contenu: en
            ? `Set $g = 0$ and Gordon collapses into the flat perpetuity $D_1/r$: $\\dfrac{${f(d1)}}{${f(r, 1)}\\,\\%}$ = **${eur(r2(sansG))}** — what the share would be worth if it merely repeated the same dividend for ever.`
            : `Posez $g = 0$ et Gordon dégénère en perpétuité simple $D_1/r$ : $\\dfrac{${f(d1)}}{${f(r, 1)}\\,\\%}$ = **${eur(r2(sansG))}** — ce que vaudrait l'action si elle se contentait de répéter le même dividende pour toujours.`,
        },
        {
          titre: en ? 'The price tag of growth' : "L'étiquette de prix de la croissance",
          contenu: en
            ? `Growth value = ${f(r2(avecG))} − ${f(r2(sansG))} = **${eur(reponse)}**, i.e. ${pct(partPct)} of the share price. This is the spirit of the CFA's *present value of growth opportunities* (PVGO): the market pays today for dividends that do not exist yet — and that slice of the price evaporates first when growth disappoints.`
            : `Valeur de la croissance = ${f(r2(avecG))} − ${f(r2(sansG))} = **${eur(reponse)}**, soit ${pct(partPct)} du prix de l'action. C'est l'esprit de la *present value of growth opportunities* (PVGO) : le marché paie aujourd'hui des dividendes qui n'existent pas encore — et cette tranche du prix s'évapore la première quand la croissance déçoit.`,
        },
      ],
      pieges: [
        en
          ? `Answering the full value ${eur(r2(avecG))}: the question asks for the **gap** between the two scenarios, not the with-growth price.`
          : `Répondre la valeur complète ${eur(r2(avecG))} : la question demande l'**écart** entre les deux scénarios, pas le prix avec croissance.`,
        en
          ? `Forgetting that the no-growth benchmark is the flat perpetuity $D_1/r = ${f(r2(sansG))}$: without it there is nothing to subtract — both scenarios discount the SAME first dividend of ${eur(d1)}.`
          : `Oublier que le scénario de référence est la perpétuité simple $D_1/r = ${f(r2(sansG))}$ : sans elle, rien à soustraire — les deux scénarios actualisent le MÊME premier dividende de ${eur(d1)}.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 3. DDM deux étapes : croissance forte puis sage (N3)
// ---------------------------------------------------------------------------
export const genDdmDeuxEtapes: ExerciseGenerator = {
  id: 'm3-app-ddm-deux-etapes',
  moduleId: M3,
  titre: 'DDM deux étapes : croissance forte puis sage',
  titreEn: 'Two-stage DDM: fast growth, then maturity',
  difficulte: 3,
  // Tirages (ordre strict) : 1. d0 = randFloat(1, 4, 2) · 2. g1 = randInt(8, 15)
  // · 3. n1 = randInt(2, 4) · 4. g2 = randFloat(1.5, 3, 1) · 5. r = randFloat(7, 11, 1).
  // r ≥ 7 > g2 ≤ 3 : la phase terminale ne diverge jamais.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const d0 = randFloat(rng, 1, 4, 2);
    const g1 = randInt(rng, 8, 15);
    const n1 = randInt(rng, 2, 4);
    const g2 = randFloat(rng, 1.5, 3, 1);
    const r = randFloat(rng, 7, 11, 1);

    const reponse = r2(ddmDeuxEtapes(d0, g1, n1, g2, r));
    // Décomposition pour le corrigé (mêmes opérations que ddmDeuxEtapes).
    const rFac = 1 + r / 100;
    const lignes: { t: number; div: number; va: number }[] = [];
    let div = d0;
    let vaDivs = 0;
    for (let t = 1; t <= n1; t++) {
      div *= 1 + g1 / 100;
      const va = div / rFac ** t;
      lignes.push({ t, div, va });
      vaDivs += va;
    }
    const dN1 = div;
    const dSuivant = dN1 * (1 + g2 / 100);
    const vt = valeurTerminaleGordon(dN1, g2, r);
    const vaVT = vt / rFac ** n1;
    const poidsVT = r2((vaVT / (vaDivs + vaVT)) * 100);
    const fauxVtNonActualisee = r2(vaDivs + vt);
    const fauxSansCroissanceVT = r2(vaDivs + gordon(dN1, r, g2) / rFac ** n1);

    const en = langue === 'en';
    const { f, eur, pct } = formatters(langue);
    const tableau = [
      en ? `| Year | Dividend | PV at ${pct(r, 1)} |` : `| Année | Dividende | VA à ${pct(r, 1)} |`,
      '| --- | --- | --- |',
      ...lignes.map((l) => `| ${l.t} | ${eur(l.div)} | ${eur(l.va)} |`),
      en ? `| **Total** | | **${eur(vaDivs)}** |` : `| **Somme** | | **${eur(vaDivs)}** |`,
    ].join('\n');
    return {
      enonce: en
        ? `A company has just paid a dividend of ${eur(d0)}. Analysts expect ${pct(g1, 0)} dividend growth for ${n1} years, then a mature perpetual growth of ${pct(g2, 1)}. The required return is ${pct(r, 1)}.\n\n**What is the share worth today under the two-stage DDM, in euros?**`
        : `Une société vient de verser un dividende de ${eur(d0)}. Les analystes attendent ${pct(g1, 0)} de croissance du dividende pendant ${n1} ans, puis une croissance perpétuelle assagie de ${pct(g2, 1)}. Le taux exigé est de ${pct(r, 1)}.\n\n**Que vaut l'action aujourd'hui selon le DDM deux étapes, en euros ?**`,
      reponse,
      tolerance: 0.005,
      unite: '€',
      etapes: [
        {
          titre: en ? 'Stage 1 — discount the fast-growth dividends' : 'Étape 1 — actualiser les dividendes de croissance forte',
          contenu: en
            ? `Each dividend compounds at ${pct(g1, 0)} from $D_0 = ${f(d0)}$, then is discounted at ${pct(r, 1)}:\n\n${tableau}\n\nPresent value of the explicit dividends: **${eur(vaDivs)}**.`
            : `Chaque dividende se compose à ${pct(g1, 0)} depuis $D_0 = ${f(d0)}$, puis s'actualise à ${pct(r, 1)} :\n\n${tableau}\n\nValeur actuelle des dividendes explicites : **${eur(vaDivs)}**.`,
        },
        {
          titre: en ? 'Stage 2 — the terminal value at year ' + n1 : "Étape 2 — la valeur terminale à l'année " + n1,
          contenu: en
            ? `Beyond year ${n1}, growth settles at ${pct(g2, 1)}: Gordon takes over with the NEXT dividend, $D_{${n1 + 1}} = ${f(dN1)} × ${f(1 + g2 / 100, 3)} = ${f(dSuivant)}$. $VT_{${n1}} = \\dfrac{${f(dSuivant)}}{${f(r, 1)}\\,\\% - ${f(g2, 1)}\\,\\%} = ${eur(vt)}$ — a value dated year ${n1}, not today.`
            : `Au-delà de l'année ${n1}, la croissance s'assagit à ${pct(g2, 1)} : Gordon prend le relais avec le dividende SUIVANT, $D_{${n1 + 1}} = ${f(dN1)} × ${f(1 + g2 / 100, 3)} = ${f(dSuivant)}$. $VT_{${n1}} = \\dfrac{${f(dSuivant)}}{${f(r, 1)}\\,\\% - ${f(g2, 1)}\\,\\%} = ${eur(vt)}$ — une valeur datée de l'année ${n1}, pas d'aujourd'hui.`,
        },
        {
          titre: en ? 'Bring everything back to t = 0' : 'Tout ramener en t = 0',
          contenu: en
            ? `Discount the terminal value over ${n1} years: $\\dfrac{${f(vt)}}{${f(rFac, 3)}^{${n1}}} = ${eur(vaVT)}$. Total: $${f(vaDivs)} + ${f(vaVT)}$ = **${eur(reponse)}**. Note that the terminal value carries ${pct(poidsVT, 1)} of the price: the "wise" phase, not the spectacular one, does most of the work.`
            : `Actualisez la valeur terminale de ${n1} ans : $\\dfrac{${f(vt)}}{${f(rFac, 3)}^{${n1}}} = ${eur(vaVT)}$. Total : $${f(vaDivs)} + ${f(vaVT)}$ = **${eur(reponse)}**. Notez que la valeur terminale porte ${pct(poidsVT, 1)} du prix : c'est la phase « sage », pas la spectaculaire, qui fait l'essentiel du travail.`,
        },
      ],
      pieges: [
        en
          ? `Adding the terminal value without discounting it: ${eur(fauxVtNonActualisee)} instead of ${eur(reponse)} — $VT_{${n1}}$ lives in year ${n1} and must travel ${n1} years back.`
          : `Ajouter la valeur terminale sans l'actualiser : ${eur(fauxVtNonActualisee)} au lieu de ${eur(reponse)} — $VT_{${n1}}$ vit à l'année ${n1} et doit voyager ${n1} ans en arrière.`,
        en
          ? `Feeding Gordon with $D_{${n1}}$ instead of $D_{${n1 + 1}} = D_{${n1}} × (1+g_2)$: ${eur(fauxSansCroissanceVT)} — the terminal formula always eats the dividend of the year AFTER the horizon.`
          : `Nourrir Gordon avec $D_{${n1}}$ au lieu de $D_{${n1 + 1}} = D_{${n1}} × (1+g_2)$ : ${eur(fauxSansCroissanceVT)} — la formule terminale mange toujours le dividende de l'année qui SUIT l'horizon.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 4. DCF : la part de la valeur terminale (N3)
// ---------------------------------------------------------------------------
export const genDcfVt: ExerciseGenerator = {
  id: 'm3-app-dcf-vt',
  moduleId: M3,
  titre: 'DCF : la part de la valeur terminale',
  titreEn: 'DCF: the weight of terminal value',
  difficulte: 3,
  // Tirages (ordre strict) : 1. fcf1 = randInt(40, 120) · 2. g = randInt(3, 8)
  // · 3. n = randInt(3, 5) · 4. r = randFloat(7, 12, 1) · 5. vtC = randInt(10, 25)
  // (vt = vtC × 100). fcfs[t] = r2(fcf1 × (1 + g/100)^t), t = 0..n−1.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const fcf1 = randInt(rng, 40, 120);
    const g = randInt(rng, 3, 8);
    const n = randInt(rng, 3, 5);
    const r = randFloat(rng, 7, 12, 1);
    const vtC = randInt(rng, 10, 25);

    const vt = vtC * 100;
    const fcfs = Array.from({ length: n }, (_, t) => r2(fcf1 * (1 + g / 100) ** t));
    const zeros = fcfs.map(() => 0);
    const vaFcfs = dcfSimple(fcfs, r, 0);
    const vaVT = dcfSimple(zeros, r, vt);
    const reponse = r2(dcfSimple(fcfs, r, vt));
    const poidsVT = r2((vaVT / (vaFcfs + vaVT)) * 100);
    const fauxVtNonActualisee = r2(vaFcfs + vt);
    const rFac = 1 + r / 100;

    const en = langue === 'en';
    const { f, pct, meur } = formatters(langue);
    const listeFr = fcfs.map((v) => `${f(v)} M€`).join(' ; ');
    const listeEn = fcfs.map((v) => `€${f(v)}m`).join(', ');
    const tableau = [
      en ? `| Year | FCF | PV at ${pct(r, 1)} |` : `| Année | FCF | VA à ${pct(r, 1)} |`,
      '| --- | --- | --- |',
      ...fcfs.map((v, i) => `| ${i + 1} | ${meur(v, 2)} | ${meur(v / rFac ** (i + 1), 2)} |`),
      en ? `| **Total** | | **${meur(vaFcfs, 2)}** |` : `| **Somme** | | **${meur(vaFcfs, 2)}** |`,
    ].join('\n');
    return {
      enonce: en
        ? `Analysts project the following free cash flows for a company over ${n} years: ${listeEn}, plus a terminal value of ${meur(vt)} at the end of year ${n}. The cost of capital is ${pct(r, 1)}.\n\n**What is the company worth today, in millions of euros?**`
        : `Les analystes projettent pour une société les free cash-flows suivants sur ${n} ans : ${listeFr}, plus une valeur terminale de ${meur(vt)} en fin d'année ${n}. Le coût du capital est de ${pct(r, 1)}.\n\n**Que vaut la société aujourd'hui, en millions d'euros ?**`,
      reponse,
      tolerance: 0.005,
      unite: 'M€',
      etapes: [
        {
          titre: en ? 'Discount the explicit cash flows' : 'Actualiser les flux explicites',
          contenu: en
            ? `Each FCF comes back to today divided by $(1+r)^t$:\n\n${tableau}\n\nThe explicit horizon contributes **${meur(vaFcfs, 2)}**.`
            : `Chaque FCF revient en t = 0 divisé par $(1+r)^t$ :\n\n${tableau}\n\nL'horizon explicite contribue **${meur(vaFcfs, 2)}**.`,
        },
        {
          titre: en ? 'Discount the terminal value' : 'Actualiser la valeur terminale',
          contenu: en
            ? `The ${meur(vt)} are dated end of year ${n}: $VA(VT) = \\dfrac{${f(vt)}}{${f(rFac, 3)}^{${n}}} = ${meur(vaVT, 2)}$. Same time machine as the cash flows — no exception for being big.`
            : `Les ${meur(vt)} sont datés de fin d'année ${n} : $VA(VT) = \\dfrac{${f(vt)}}{${f(rFac, 3)}^{${n}}} = ${meur(vaVT, 2)}$. Même machine à remonter le temps que les flux — pas d'exception parce qu'elle est grosse.`,
        },
        {
          titre: en ? 'Total — and the weight of the terminal value' : 'Total — et le poids de la valeur terminale',
          contenu: en
            ? `Value today = ${f(vaFcfs, 2)} + ${f(vaVT, 2)} = **${meur(reponse, 2)}**. The terminal value alone carries **${pct(poidsVT, 1)}** of it: the valuation hangs mostly on what happens AFTER the forecast horizon. A professional always reports that weight — it measures how much of the price is assumption rather than forecast.`
            : `Valeur aujourd'hui = ${f(vaFcfs, 2)} + ${f(vaVT, 2)} = **${meur(reponse, 2)}**. La valeur terminale porte à elle seule **${pct(poidsVT, 1)}** du total : la valorisation repose surtout sur ce qui se passe APRÈS l'horizon de prévision. Un professionnel annonce toujours ce poids — il mesure la part d'hypothèse, par opposition à la prévision, dans le prix.`,
        },
      ],
      pieges: [
        en
          ? `Adding the terminal value without discounting it: ${meur(fauxVtNonActualisee, 2)} instead of ${meur(reponse, 2)} — the most expensive oversight in any DCF, precisely because the TV is the biggest number on the page.`
          : `Ajouter la valeur terminale sans l'actualiser : ${meur(fauxVtNonActualisee, 2)} au lieu de ${meur(reponse, 2)} — l'oubli le plus cher de tout DCF, justement parce que la VT est le plus gros chiffre de la page.`,
        en
          ? `Reading the result as precise: with ${pct(poidsVT, 1)} of the value in the terminal block, a small change in its growth or discount assumptions moves the whole valuation — a DCF is a range, never a point.`
          : `Lire le résultat comme précis : avec ${pct(poidsVT, 1)} de la valeur dans le bloc terminal, une petite retouche de ses hypothèses de croissance ou d'actualisation déplace toute la valorisation — un DCF est une fourchette, jamais un point.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 5. Lire un PER (N1)
// ---------------------------------------------------------------------------
export const genPer: ExerciseGenerator = {
  id: 'm3-app-per',
  moduleId: M3,
  titre: 'Lire un PER',
  titreEn: 'Reading the P/E ratio',
  difficulte: 1,
  // Tirages (ordre strict) : 1. bpaV = randFloat(2, 12, 2) · 2. perCible = randFloat(7, 30, 1).
  // prix = r2(bpaV × perCible) — construit pour un PER réaliste.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const bpaV = randFloat(rng, 2, 12, 2);
    const perCible = randFloat(rng, 7, 30, 1);

    const prix = r2(bpaV * perCible);
    const perVal = per(prix, bpaV);
    const reponse = r2(perVal);
    const rendementBenef = r2(100 / perVal);
    const cher = reponse >= 18;
    const bonMarche = reponse <= 11;

    const en = langue === 'en';
    const { f, eur, pct } = formatters(langue);
    return {
      enonce: en
        ? `A share trades at ${eur(prix)} and the company posts earnings per share (EPS) of ${eur(bpaV)}.\n\n**What is its P/E ratio?**`
        : `Une action cote ${eur(prix)} et la société affiche un bénéfice par action (BPA) de ${eur(bpaV)}.\n\n**Quel est son PER ?**`,
      reponse,
      tolerance: 0.005,
      etapes: [
        {
          titre: en ? 'Price over earnings' : 'Le prix sur le bénéfice',
          contenu: en
            ? `$PER = \\dfrac{\\text{price}}{\\text{EPS}} = \\dfrac{${f(prix)}}{${f(bpaV)}}$ = **${f(reponse)}**: the market pays ${f(reponse)} euros for each euro of annual earnings.`
            : `$PER = \\dfrac{\\text{prix}}{\\text{BPA}} = \\dfrac{${f(prix)}}{${f(bpaV)}}$ = **${f(reponse)}** : le marché paie ${f(reponse)} euros chaque euro de bénéfice annuel.`,
        },
        {
          titre: en ? 'Read it as a payback clock' : 'Le lire comme un compteur de remboursement',
          contenu: en
            ? `At constant earnings, the buyer needs ${f(reponse)} years of profits to recoup the price. Flip the ratio for the earnings yield: $1/PER = ${pct(rendementBenef)}$ — directly comparable to a bond yield.`
            : `À bénéfice constant, l'acheteur a besoin de ${f(reponse)} années de profits pour rembourser son prix. Retournez le ratio pour obtenir le rendement bénéficiaire : $1/PER = ${pct(rendementBenef)}$ — directement comparable à un taux obligataire.`,
        },
        {
          titre: en ? 'Place it on the scale' : "Le situer sur l'échelle",
          contenu: en
            ? `Long-run equity markets live around 15×. ${cher ? `At ${f(reponse)}×, the market is pricing in strong earnings growth — pay attention to whether it materialises.` : bonMarche ? `At ${f(reponse)}×, the share looks cheap — either a bargain, or earnings the market expects to shrink (a value trap).` : `At ${f(reponse)}×, the share trades near the historical norm — neither obvious growth premium nor obvious distrust.`} A P/E is never high or low in a vacuum: only against the sector and the growth outlook.`
            : `Les marchés actions vivent à long terme autour de 15×. ${cher ? `À ${f(reponse)}×, le marché paie d'avance une forte croissance des bénéfices — vérifiez qu'elle se matérialise.` : bonMarche ? `À ${f(reponse)}×, l'action semble bon marché — soit une affaire, soit des bénéfices que le marché voit fondre (value trap).` : `À ${f(reponse)}×, l'action se paie près de la norme historique — ni prime de croissance évidente, ni défiance marquée.`} Un PER n'est jamais haut ou bas dans l'absolu : seulement face au secteur et aux perspectives de croissance.`,
        },
      ],
      pieges: [
        en
          ? `Confusing the P/E with a yield: ${f(reponse)} is a multiple (price = ${f(reponse)} × earnings), while the earnings yield is its inverse, ${pct(rendementBenef)}. Announcing "${f(reponse)}%" is meaningless.`
          : `Confondre le PER avec un rendement : ${f(reponse)} est un multiple (prix = ${f(reponse)} × bénéfice), tandis que le rendement bénéficiaire est son inverse, ${pct(rendementBenef)}. Annoncer « ${f(reponse)} % » n'a aucun sens.`,
        en
          ? 'A P/E only compares like with like: trailing vs forward earnings, same sector, same accounting — and it breaks down entirely when earnings are negative.'
          : "Un PER ne compare que ce qui est comparable : bénéfices passés ou prévus, même secteur, même comptabilité — et il perd tout sens quand le bénéfice est négatif.",
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 6. Du bénéfice au prix : le PER sectoriel (N2)
// ---------------------------------------------------------------------------
export const genBpaPerPrix: ExerciseGenerator = {
  id: 'm3-app-bpa-per-prix',
  moduleId: M3,
  titre: 'Du bénéfice au prix : le PER sectoriel',
  titreEn: 'From earnings to price: the sector P/E',
  difficulte: 2,
  // Tirages (ordre strict) : 1. nbActionsM = randInt(20, 200) · 2. bpaCible = randFloat(1, 10, 1)
  // · 3. perSect = randFloat(8, 25, 1). benefM = r2(nbActionsM × bpaCible).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const nbActionsM = randInt(rng, 20, 200);
    const bpaCible = randFloat(rng, 1, 10, 1);
    const perSect = randFloat(rng, 8, 25, 1);

    const benefM = r2(nbActionsM * bpaCible);
    const bpaV = bpa(benefM, nbActionsM);
    const reponse = r2(bpaV * perSect);
    const capiImplicite = r2(benefM * perSect);

    const en = langue === 'en';
    const { f, eur, meur } = formatters(langue);
    return {
      enonce: en
        ? `A company posts a net income of ${meur(benefM, 1)} for ${f(nbActionsM, 0)} million shares outstanding. Comparable companies in the sector trade at ${f(perSect, 1)} times earnings.\n\n**What share price does the sector multiple imply, in euros?**`
        : `Une société affiche un bénéfice net de ${meur(benefM, 1)} pour ${f(nbActionsM, 0)} millions d'actions en circulation. Les comparables du secteur se paient ${f(perSect, 1)} fois les bénéfices.\n\n**Quel prix par action ce multiple sectoriel implique-t-il, en euros ?**`,
      reponse,
      tolerance: 0.005,
      unite: '€',
      etapes: [
        {
          titre: en ? 'Bring the earnings down to one share' : "Ramener le bénéfice à l'action",
          contenu: en
            ? `$BPA = \\dfrac{\\text{net income}}{\\text{shares}} = \\dfrac{${f(benefM, 1)}\\text{m}}{${f(nbActionsM, 0)}\\text{m}} = ${eur(bpaV)}$ — millions over millions: the scale cancels, leaving euros per share.`
            : `$BPA = \\dfrac{\\text{bénéfice net}}{\\text{nb d'actions}} = \\dfrac{${f(benefM, 1)}\\text{ M}}{${f(nbActionsM, 0)}\\text{ M}} = ${eur(bpaV)}$ — des millions sur des millions : l'échelle s'annule, il reste des euros par action.`,
        },
        {
          titre: en ? 'Apply the sector multiple' : 'Appliquer le multiple sectoriel',
          contenu: en
            ? `Implied price = $PER_{\\text{sector}} × BPA = ${f(perSect, 1)} × ${f(bpaV)}$ = **${eur(reponse)}**. This is relative valuation: the company is priced like its peers, no cash-flow forecast needed.`
            : `Prix implicite = $PER_{\\text{secteur}} × BPA = ${f(perSect, 1)} × ${f(bpaV)}$ = **${eur(reponse)}**. C'est la valorisation relative : la société se paie comme ses pairs, sans aucune prévision de flux.`,
        },
        {
          titre: en ? 'Cross-check through the market cap' : 'Recouper par la capitalisation',
          contenu: en
            ? `Same multiple applied to total earnings: implied market cap = ${f(perSect, 1)} × ${f(benefM, 1)} = ${meur(capiImplicite, 1)}; divided by ${f(nbActionsM, 0)} million shares, it lands on the same ${eur(reponse)}. Per-share route and aggregate route must always agree.`
            : `Même multiple appliqué au bénéfice total : capitalisation implicite = ${f(perSect, 1)} × ${f(benefM, 1)} = ${meur(capiImplicite, 1)} ; divisée par ${f(nbActionsM, 0)} millions d'actions, elle retombe sur les mêmes ${eur(reponse)}. Route par action et route agrégée doivent toujours concorder.`,
        },
      ],
      pieges: [
        en
          ? `Reporting ${meur(capiImplicite, 1)} as "the price": multiplying the TOTAL earnings by the P/E yields the market cap in millions, not a share price — keep your units on a leash.`
          : `Annoncer ${meur(capiImplicite, 1)} comme « le prix » : multiplier le bénéfice TOTAL par le PER donne la capitalisation en millions, pas un prix par action — tenez vos unités en laisse.`,
        en
          ? 'A sector P/E embeds the sector\'s average growth and risk: applying it to a company that grows much slower (or faster) than its peers silently misprices it.'
          : "Un PER sectoriel embarque la croissance et le risque moyens du secteur : l'appliquer à une société qui croît bien plus lentement (ou vite) que ses pairs la valorise de travers, sans bruit.",
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 7. EV/EBITDA : le multiple qui voit la dette (N2)
// ---------------------------------------------------------------------------
export const genEvEbitda: ExerciseGenerator = {
  id: 'm3-app-ev-ebitda',
  moduleId: M3,
  titre: 'EV/EBITDA : le multiple qui voit la dette',
  titreEn: 'EV/EBITDA: the multiple that sees the debt',
  difficulte: 2,
  // Tirages (ordre strict) : 1. capiC = randInt(6, 40) (capi = capiC × 100)
  // · 2. detteC = randInt(2, 20) (dette nette = detteC × 50) · 3. mult = randFloat(4, 12, 1).
  // ebitda = Math.round((capi + dette)/mult) — construit pour un multiple réaliste.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const capiC = randInt(rng, 6, 40);
    const detteC = randInt(rng, 2, 20);
    const mult = randFloat(rng, 4, 12, 1);

    const capi = capiC * 100;
    const detteNette = detteC * 50;
    const ebitda = Math.round((capi + detteNette) / mult);
    const ev = capi + detteNette;
    const reponse = r2(evSurEbitda(capi, detteNette, ebitda));
    const sansDette = r2(evSurEbitda(capi, 0, ebitda));
    const ecartPiege = r2(reponse - sansDette);

    const en = langue === 'en';
    const { f, meur } = formatters(langue);
    return {
      enonce: en
        ? `A listed company shows a market capitalisation of ${meur(capi)}, net debt of ${meur(detteNette)} and an EBITDA of ${meur(ebitda)}.\n\n**What is its EV/EBITDA multiple?**`
        : `Une société cotée affiche une capitalisation boursière de ${meur(capi)}, une dette nette de ${meur(detteNette)} et un EBITDA de ${meur(ebitda)}.\n\n**Quel est son multiple EV/EBITDA ?**`,
      reponse,
      tolerance: 0.005,
      etapes: [
        {
          titre: en ? 'Build the enterprise value' : "Construire la valeur d'entreprise",
          contenu: en
            ? `$EV = \\text{market cap} + \\text{net debt} = ${f(capi, 0)} + ${f(detteNette, 0)} = ${meur(ev)}$. Whoever buys the whole company buys its debt along with it: EV is the all-in price of the business, equity AND creditors.`
            : `$EV = \\text{capitalisation} + \\text{dette nette} = ${f(capi, 0)} + ${f(detteNette, 0)} = ${meur(ev)}$. Qui achète toute la société rachète aussi sa dette : l'EV est le prix complet de l'affaire, actionnaires ET créanciers.`,
        },
        {
          titre: en ? 'Divide by EBITDA' : "Diviser par l'EBITDA",
          contenu: en
            ? `$\\dfrac{EV}{EBITDA} = \\dfrac{${f(ev, 0)}}{${f(ebitda, 0)}}$ = **${f(reponse)}×**. EBITDA sits before interest: a pre-debt earnings measure matched with a pre-debt value measure — the ratio is capital-structure neutral, which is exactly why M&A bankers love it.`
            : `$\\dfrac{EV}{EBITDA} = \\dfrac{${f(ev, 0)}}{${f(ebitda, 0)}}$ = **${f(reponse)}×**. L'EBITDA se lit avant intérêts : un résultat avant dette rapporté à une valeur avant dette — le ratio est neutre à la structure financière, exactement pourquoi les banquiers M&A l'adorent.`,
        },
        {
          titre: en ? 'Situate the multiple' : 'Situer le multiple',
          contenu: en
            ? `European industrials change hands around 7–9× EBITDA; infrastructure and software stretch higher, cyclical and capital-hungry businesses sit lower. At ${f(reponse)}×, compare against the sector — and remember a NEGATIVE net debt (net cash) would shrink the EV and the multiple.`
            : `L'industrie européenne se paie autour de 7–9× l'EBITDA ; infrastructures et logiciel s'étirent plus haut, les affaires cycliques et gourmandes en capital plus bas. À ${f(reponse)}×, comparez au secteur — et retenez qu'une dette nette NÉGATIVE (trésorerie nette) réduirait l'EV et le multiple.`,
        },
      ],
      pieges: [
        en
          ? `Computing market cap / EBITDA = ${f(sansDette)}× : forgetting the debt understates the multiple by ${f(ecartPiege)} point(s) here — the classic way to make an indebted company look cheap.`
          : `Calculer capitalisation / EBITDA = ${f(sansDette)}× : oublier la dette sous-estime le multiple de ${f(ecartPiege)} point(s) ici — la façon classique de faire passer une société endettée pour bon marché.`,
        en
          ? 'Never mix levels: EV (equity + debt) goes with EBITDA or EBIT (before interest); market cap goes with net income (after interest). Crossing them compares apples with the orchard.'
          : "Ne jamais croiser les étages : l'EV (capitaux propres + dette) se rapporte à l'EBITDA ou l'EBIT (avant intérêts) ; la capitalisation au résultat net (après intérêts). Les croiser, c'est comparer la pomme au verger.",
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 8. Rendement du dividende et payout (N2)
// ---------------------------------------------------------------------------
export const genRendementPayout: ExerciseGenerator = {
  id: 'm3-app-rendement-payout',
  moduleId: M3,
  titre: 'Rendement du dividende et payout',
  titreEn: 'Dividend yield and payout ratio',
  difficulte: 2,
  // Tirages (ordre strict) : 1. prix = randInt(20, 150) · 2. rdtCible = randFloat(1, 6, 1)
  // · 3. payoutCible = randInt(25, 75). div = r2(prix × rdtCible/100) ;
  // bpaV = r2(div × 100/payoutCible).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const prix = randInt(rng, 20, 150);
    const rdtCible = randFloat(rng, 1, 6, 1);
    const payoutCible = randInt(rng, 25, 75);

    const div = r2((prix * rdtCible) / 100);
    const bpaV = r2((div * 100) / payoutCible);
    const reponse = r2(rendementDividende(div, prix));
    const payout = r2(tauxDistribution(div, bpaV));
    const perVal = r2(per(prix, bpaV));

    const en = langue === 'en';
    const { f, eur, pct } = formatters(langue);
    return {
      enonce: en
        ? `A share trades at ${eur(prix, 0)}, pays an annual dividend of ${eur(div)} and posts an EPS of ${eur(bpaV)}.\n\n**What is the dividend yield, in %?** (The walkthrough also computes the payout ratio.)`
        : `Une action cote ${eur(prix, 0)}, verse un dividende annuel de ${eur(div)} et affiche un BPA de ${eur(bpaV)}.\n\n**Quel est le rendement du dividende, en % ?** (Le corrigé calcule aussi le taux de distribution.)`,
      reponse,
      tolerance: 0.005,
      unite: '%',
      etapes: [
        {
          titre: en ? 'The yield: dividend over PRICE' : 'Le rendement : dividende sur le PRIX',
          contenu: en
            ? `$\\text{Yield} = \\dfrac{D}{P} = \\dfrac{${f(div)}}{${f(prix, 0)}}$ = **${pct(reponse)}**: what one euro invested in the share returns in cash each year. This is the shareholder's perspective.`
            : `$\\text{Rendement} = \\dfrac{D}{P} = \\dfrac{${f(div)}}{${f(prix, 0)}}$ = **${pct(reponse)}** : ce qu'un euro investi dans l'action rapporte en numéraire chaque année. C'est le point de vue de l'actionnaire.`,
        },
        {
          titre: en ? 'The payout: dividend over EARNINGS' : 'Le payout : dividende sur le BÉNÉFICE',
          contenu: en
            ? `$\\text{Payout} = \\dfrac{D}{BPA} = \\dfrac{${f(div)}}{${f(bpaV)}} = ${pct(payout)}$: the share of profits the company hands back rather than reinvests. Same numerator as the yield, but the company's perspective — the other ${pct(r2(100 - payout))} stay inside to fund growth.`
            : `$\\text{Payout} = \\dfrac{D}{BPA} = \\dfrac{${f(div)}}{${f(bpaV)}} = ${pct(payout)}$ : la part du bénéfice que la société rend au lieu de réinvestir. Même numérateur que le rendement, mais le point de vue de l'entreprise — les ${pct(r2(100 - payout))} restants restent à bord pour financer la croissance.`,
        },
        {
          titre: en ? 'The bridge between the two' : 'Le pont entre les deux',
          contenu: en
            ? `The two ratios are welded by the P/E: $\\text{yield} = \\dfrac{\\text{payout}}{PER} = \\dfrac{${f(payout)}}{${f(perVal)}} \\approx ${pct(reponse)}$. Knowing any two of yield, payout and P/E pins down the third — a quick desk cross-check.`
            : `Les deux ratios sont soudés par le PER : $\\text{rendement} = \\dfrac{\\text{payout}}{PER} = \\dfrac{${f(payout)}}{${f(perVal)}} \\approx ${pct(reponse)}$. Deux des trois chiffres (rendement, payout, PER) suffisent à retrouver le troisième — un recoupement rapide de desk.`,
        },
      ],
      pieges: [
        en
          ? `Mixing the denominators: ${f(div)}/${f(bpaV)} = ${pct(payout)} is the payout, NOT the yield ${pct(reponse)} — same dividend on top, price below for the yield, earnings below for the payout.`
          : `Mélanger les dénominateurs : ${f(div)}/${f(bpaV)} = ${pct(payout)} est le payout, PAS le rendement ${pct(reponse)} — même dividende au numérateur, prix en dessous pour le rendement, bénéfice en dessous pour le payout.`,
        en
          ? 'A fat yield is not automatically a gift: if it comes from a collapsing price or a payout drifting above 100%, the dividend is living on borrowed time.'
          : "Un gros rendement n'est pas automatiquement un cadeau : s'il vient d'un prix qui s'effondre ou d'un payout qui dérive au-delà de 100 %, le dividende vit en sursis.",
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 9. Prix théorique ex-dividende (N1)
// ---------------------------------------------------------------------------
export const genExDividende: ExerciseGenerator = {
  id: 'm3-app-ex-dividende',
  moduleId: M3,
  titre: 'Prix théorique ex-dividende',
  titreEn: 'Theoretical ex-dividend price',
  difficulte: 1,
  // Tirages (ordre strict) : 1. prix = randFloat(20, 150, 1) · 2. div = randFloat(0.5, 5, 2).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const prix = randFloat(rng, 20, 150, 1);
    const div = randFloat(rng, 0.5, 5, 2);

    const reponse = r2(prixTheoriqueExDividende(prix, div));
    const baissePct = r2((div / prix) * 100);

    const en = langue === 'en';
    const { f, eur, pct } = formatters(langue);
    return {
      enonce: en
        ? `A share closes at ${eur(prix)} the day before its ex-dividend date. Tomorrow morning it goes ex-dividend for ${eur(div)} per share.\n\n**What is the theoretical opening price, in euros?**`
        : `Une action clôture à ${eur(prix)} la veille de sa date de détachement. Demain matin, elle détache un dividende de ${eur(div)} par action.\n\n**Quel est le prix théorique d'ouverture ex-dividende, en euros ?**`,
      reponse,
      tolerance: 0.002,
      unite: '€',
      etapes: [
        {
          titre: en ? 'Cash leaves the company' : "Du cash sort de l'entreprise",
          contenu: en
            ? `On the ex-date, ${eur(div)} per share leaves the company's till for the shareholders' pockets. The company is worth exactly that much less — the price must record the outflow.`
            : `À la date de détachement, ${eur(div)} par action quittent la caisse de l'entreprise pour la poche des actionnaires. La société vaut exactement cela de moins — le prix doit enregistrer la sortie.`,
        },
        {
          titre: en ? 'Mechanical drop' : 'La baisse mécanique',
          contenu: en
            ? `$P_{ex} = P - D = ${f(prix)} - ${f(div)}$ = **${eur(reponse)}**, a drop of ${pct(baissePct)}. Index providers and option exchanges adjust for it the same way: it is bookkeeping, not bad news.`
            : `$P_{ex} = P - D = ${f(prix)} - ${f(div)}$ = **${eur(reponse)}**, soit une baisse de ${pct(baissePct)}. Fournisseurs d'indices et marchés d'options s'ajustent de la même façon : c'est de la comptabilité, pas une mauvaise nouvelle.`,
        },
        {
          titre: en ? 'The shareholder is made whole' : "L'actionnaire n'a rien perdu",
          contenu: en
            ? `Before: one share at ${eur(prix)}. After: one share at ${eur(reponse)} plus ${eur(div)} of cash — total ${eur(prix)}, to the cent. The dividend moves value from the left pocket to the right one; only taxes and the market's mood make the real open deviate from theory.`
            : `Avant : une action à ${eur(prix)}. Après : une action à ${eur(reponse)} plus ${eur(div)} d'espèces — total ${eur(prix)}, au centime. Le dividende déplace la valeur de la poche gauche vers la poche droite ; seuls la fiscalité et l'humeur du marché écartent l'ouverture réelle de la théorie.`,
        },
      ],
      pieges: [
        en
          ? `Expecting the price to open unchanged at ${eur(prix)}: buying the day before "to grab the dividend" earns nothing — the ${eur(div)} received are clawed back by the ${eur(div)} price drop.`
          : `Attendre une ouverture inchangée à ${eur(prix)} : acheter la veille « pour toucher le dividende » ne rapporte rien — les ${eur(div)} encaissés sont repris par la baisse de ${eur(div)} du cours.`,
        en
          ? 'The drop belongs to the ex-date, not the payment date: entitlement is fixed when the share goes ex, the cash arrives days later.'
          : "La baisse a lieu à la date de détachement, pas à la date de paiement : le droit au dividende se fige au détachement, l'argent n'arrive que quelques jours plus tard.",
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 10. Split : le prix divisé, la capi intacte (N1)
// ---------------------------------------------------------------------------
export const genSplit: ExerciseGenerator = {
  id: 'm3-app-split',
  moduleId: M3,
  titre: 'Split : le prix divisé, la capi intacte',
  titreEn: 'Stock split: price divided, market cap intact',
  difficulte: 1,
  // Tirages (ordre strict) : 1. ratio = pick([2, 3, 4, 5, 10]) · 2. prixU = randInt(30, 180)
  // (prix = prixU × ratio : la division tombe juste) · 3. nbActionsM = randInt(10, 200).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const ratio = pick(rng, [2, 3, 4, 5, 10] as const);
    const prixU = randInt(rng, 30, 180);
    const nbActionsM = randInt(rng, 10, 200);

    const prix = prixU * ratio;
    const reponse = r2(ajustementSplit(prix, ratio));
    const capiAvant = prix * nbActionsM; // en M€
    const nbApres = nbActionsM * ratio;

    const en = langue === 'en';
    const { f, eur, meur } = formatters(langue);
    return {
      enonce: en
        ? `A share trades at ${eur(prix, 0)} and the company has ${f(nbActionsM, 0)} million shares outstanding. It announces a ${ratio}-for-1 stock split.\n\n**What is the theoretical post-split share price, in euros?**`
        : `Une action cote ${eur(prix, 0)} et la société compte ${f(nbActionsM, 0)} millions d'actions en circulation. Elle annonce un split ${ratio}:1.\n\n**Quel est le prix théorique de l'action après le split, en euros ?**`,
      reponse,
      tolerance: 0.002,
      unite: '€',
      etapes: [
        {
          titre: en ? 'Cut every share into ' + ratio : 'Découper chaque action en ' + ratio,
          contenu: en
            ? `Each old share becomes ${ratio} new ones, so the price divides by the same factor: $P_{\\text{post}} = \\dfrac{${f(prix, 0)}}{${ratio}}$ = **${eur(reponse, 0)}**. Nothing else about the company changes — same assets, same earnings, same shareholders.`
            : `Chaque action ancienne devient ${ratio} nouvelles, donc le prix se divise par le même facteur : $P_{\\text{post}} = \\dfrac{${f(prix, 0)}}{${ratio}}$ = **${eur(reponse, 0)}**. Rien d'autre ne change dans la société — mêmes actifs, mêmes bénéfices, mêmes actionnaires.`,
        },
        {
          titre: en ? 'Check: the market cap has not moved' : 'Vérifier : la capitalisation n\'a pas bougé',
          contenu: en
            ? `Before: ${f(prix, 0)} × ${f(nbActionsM, 0)}m shares = ${meur(capiAvant)}. After: ${f(reponse, 0)} × ${f(nbApres, 0)}m shares = ${meur(capiAvant)} — identical to the euro. A split re-slices the pie into thinner pieces; it bakes no new pie.`
            : `Avant : ${f(prix, 0)} × ${f(nbActionsM, 0)} M de titres = ${meur(capiAvant)}. Après : ${f(reponse, 0)} × ${f(nbApres, 0)} M de titres = ${meur(capiAvant)} — identique à l'euro près. Un split redécoupe le gâteau en parts plus fines ; il ne cuit aucun gâteau nouveau.`,
        },
        {
          titre: en ? 'Why bother, then?' : 'Pourquoi le faire, alors ?',
          contenu: en
            ? `A lighter price improves perceived accessibility and lot-size flexibility, and the announcement is often read as management confidence. Historical footnote: price-weighted indices (Dow Jones style) must adjust their divisor on every split — float-weighted indices do not care.`
            : `Un prix plus léger améliore l'accessibilité perçue et la souplesse des quantités, et l'annonce est souvent lue comme un signal de confiance du management. Note d'histoire : les indices pondérés par les prix (style Dow Jones) doivent ajuster leur diviseur à chaque split — les indices à capi flottante ne s'en aperçoivent même pas.`,
        },
      ],
      pieges: [
        en
          ? `Believing the split creates value: you hold ${ratio} times more shares, each worth ${ratio} times less — the wealth effect is exactly zero by construction.`
          : `Croire que le split crée de la valeur : vous détenez ${ratio} fois plus de titres, valant chacun ${ratio} fois moins — l'effet richesse est exactement zéro par construction.`,
        en
          ? `Confusing direction: a REVERSE split (1-for-${ratio}) multiplies the price and is usually a distress signal — the mechanics are the same, the message is the opposite.`
          : `Confondre le sens : un split INVERSÉ (1:${ratio}) multiplie le prix et signale souvent une société en difficulté — même mécanique, message inverse.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 11. La valeur du droit de souscription (N3)
// ---------------------------------------------------------------------------
export const genDps: ExerciseGenerator = {
  id: 'm3-app-dps',
  moduleId: M3,
  titre: 'La valeur du droit de souscription',
  titreEn: 'Valuing the subscription right',
  difficulte: 3,
  // Tirages (ordre strict) : 1. prixCote = randInt(30, 120) · 2. decote = randInt(15, 40)
  // · 3. nbDroits = randInt(2, 8). prixEmission = r2(prixCote × (100 − decote)/100).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const prixCote = randInt(rng, 30, 120);
    const decote = randInt(rng, 15, 40);
    const nbDroits = randInt(rng, 2, 8);

    const prixEmission = r2((prixCote * (100 - decote)) / 100);
    const droitExact = valeurDroitSouscription(prixCote, prixEmission, nbDroits);
    const reponse = r2(droitExact);
    const terp = r2(prixCote - droitExact);
    const panier = nbDroits * prixCote + prixEmission;
    const fauxDecoteTotale = r2(prixCote - prixEmission);
    const fauxSansPlusUn = r2((prixCote - prixEmission) / nbDroits);

    const en = langue === 'en';
    const { f, eur } = formatters(langue);
    return {
      enonce: en
        ? `In a rights issue, a company offers 1 new share at ${eur(prixEmission)} for every ${nbDroits} existing shares held. The share trades at ${eur(prixCote, 0)} before the operation.\n\n**What is the theoretical value of one subscription right, in euros?**`
        : `Lors d'une augmentation de capital, une société offre 1 action neuve à ${eur(prixEmission)} pour ${nbDroits} actions anciennes détenues. L'action cote ${eur(prixCote, 0)} avant l'opération.\n\n**Quelle est la valeur théorique d'un droit préférentiel de souscription, en euros ?**`,
      reponse,
      tolerance: 0.005,
      unite: '€',
      etapes: [
        {
          titre: en ? 'Build the post-issue basket (TERP)' : "Construire le panier après opération (TERP)",
          contenu: en
            ? `After the issue, ${nbDroits} old shares at ${eur(prixCote, 0)} and 1 new share at ${eur(prixEmission)} blend into ${nbDroits + 1} identical shares: $TERP = \\dfrac{${nbDroits} × ${f(prixCote, 0)} + ${f(prixEmission)}}{${nbDroits + 1}} = \\dfrac{${f(panier)}}{${nbDroits + 1}} = ${eur(terp)}$ — the *theoretical ex-rights price*.`
            : `Après l'opération, ${nbDroits} anciennes à ${eur(prixCote, 0)} et 1 neuve à ${eur(prixEmission)} se fondent en ${nbDroits + 1} actions identiques : $TERP = \\dfrac{${nbDroits} × ${f(prixCote, 0)} + ${f(prixEmission)}}{${nbDroits + 1}} = \\dfrac{${f(panier)}}{${nbDroits + 1}} = ${eur(terp)}$ — le cours théorique ex-droit.`,
        },
        {
          titre: en ? 'The right = what the old share gives up' : "Le droit = ce que l'ancienne action abandonne",
          contenu: en
            ? `The old share slips from ${eur(prixCote, 0)} to ${eur(terp)}; the detached right is worth exactly that slide. Closed form: $DPS = \\dfrac{P_{\\text{cum}} - P_{\\text{émission}}}{n + 1} = \\dfrac{${f(prixCote, 0)} - ${f(prixEmission)}}{${nbDroits + 1}}$ = **${eur(reponse)}**. Both routes agree to the cent — they are the same identity rearranged.`
            : `L'ancienne action glisse de ${eur(prixCote, 0)} à ${eur(terp)} ; le droit détaché vaut exactement cette glissade. Forme fermée : $DPS = \\dfrac{P_{\\text{cote}} - P_{\\text{émission}}}{n + 1} = \\dfrac{${f(prixCote, 0)} - ${f(prixEmission)}}{${nbDroits + 1}}$ = **${eur(reponse)}**. Les deux routes concordent au centime — c'est la même identité réarrangée.`,
        },
        {
          titre: en ? 'The fairness valve' : "La soupape d'équité",
          contenu: en
            ? `The shareholder who subscribes pays ${eur(prixEmission)} plus ${nbDroits} rights for a share worth ${eur(terp)}; the one who sells the rights pockets the dilution he suffers on the price. Either way, nobody is expropriated: the right is precisely the instrument that makes the discount fair.`
            : `L'actionnaire qui souscrit paie ${eur(prixEmission)} plus ${nbDroits} droits pour une action valant ${eur(terp)} ; celui qui vend ses droits encaisse la dilution qu'il subit sur le cours. Dans les deux cas, personne n'est exproprié : le droit est précisément l'instrument qui rend la décote équitable.`,
        },
      ],
      pieges: [
        en
          ? `Reporting the full discount ${eur(fauxDecoteTotale)} (price minus issue price): that gap is shared across ${nbDroits + 1} shares — the right is only worth its (n+1)-th slice, ${eur(reponse)}.`
          : `Annoncer la décote totale ${eur(fauxDecoteTotale)} (cote moins prix d'émission) : cet écart se partage entre ${nbDroits + 1} actions — le droit ne vaut que sa part en 1/(n+1), soit ${eur(reponse)}.`,
        en
          ? `Dividing by n instead of n + 1: ${eur(fauxSansPlusUn)} — the new share belongs to the basket too; forgetting the "+1" overprices every right.`
          : `Diviser par n au lieu de n + 1 : ${eur(fauxSansPlusUn)} — l'action neuve fait aussi partie du panier ; oublier le « +1 » surévalue tous les droits.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 12. Poids dans un indice à capi flottante (N2)
// ---------------------------------------------------------------------------
const NOMS_INDICE = ['A', 'B', 'C', 'D'] as const;

export const genPoidsIndice: ExerciseGenerator = {
  id: 'm3-app-poids-indice',
  moduleId: M3,
  titre: 'Poids dans un indice à capi flottante',
  titreEn: 'Float-adjusted index weight',
  difficulte: 2,
  // Tirages (ordre strict) : 1. nb = randInt(3, 4) · 2. pour chaque constituant i
  // (i = 0..nb−1), dans cet ordre : prix = randInt(10, 200), titresM = randInt(5, 100),
  // flottant = pick([40, 50, 60, 70, 80, 90, 100]) · 3. cible = randInt(0, nb − 1).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const nb = randInt(rng, 3, 4);
    const constituants: ConstituantIndice[] = [];
    for (let i = 0; i < nb; i++) {
      const prix = randInt(rng, 10, 200);
      const titresM = randInt(rng, 5, 100);
      const flottant = pick(rng, [40, 50, 60, 70, 80, 90, 100] as const);
      constituants.push({ prix, nbTitres: titresM, flottantPct: flottant });
    }
    const cible = randInt(rng, 0, nb - 1);

    const poids = poidsDansIndice(constituants);
    const reponse = r2(poids[cible]);
    const total = indiceCapiPonderee(constituants); // en M€ (titres en millions)
    const capiCible = constituants[cible].prix * constituants[cible].nbTitres * (constituants[cible].flottantPct / 100);
    const poidsPleine = r2(poidsDansIndice(constituants.map((c) => ({ ...c, flottantPct: 100 })))[cible]);
    const ecartPiege = r2(Math.abs(reponse - poidsPleine));
    const nomCible = NOMS_INDICE[cible];

    const en = langue === 'en';
    const { f, eur, pct, meur } = formatters(langue);
    const lignesFr = constituants
      .map((c, i) => `- **${NOMS_INDICE[i]}** : cours ${eur(c.prix, 0)}, ${f(c.nbTitres, 0)} millions de titres, flottant ${pct(c.flottantPct, 0)}`)
      .join('\n');
    const lignesEn = constituants
      .map((c, i) => `- **${NOMS_INDICE[i]}**: price ${eur(c.prix, 0)}, ${f(c.nbTitres, 0)} million shares, free float ${pct(c.flottantPct, 0)}`)
      .join('\n');
    const tableau = [
      en ? '| Stock | Float-adjusted cap |' : '| Titre | Capi flottante |',
      '| --- | --- |',
      ...constituants.map((c, i) => `| ${NOMS_INDICE[i]} | ${meur(c.prix * c.nbTitres * (c.flottantPct / 100))} |`),
      `| **Total** | **${meur(total)}** |`,
    ].join('\n');
    return {
      enonce: en
        ? `A float-adjusted, capitalisation-weighted index has ${nb} constituents:\n${lignesEn}\n\n**What is the weight of ${nomCible} in the index, in %?**`
        : `Un indice pondéré par la capitalisation flottante compte ${nb} constituants :\n${lignesFr}\n\n**Quel est le poids de ${nomCible} dans l'indice, en % ?**`,
      reponse,
      tolerance: 0.02,
      toleranceMode: 'absolu',
      unite: '%',
      etapes: [
        {
          titre: en ? 'Float-adjusted caps first' : "Les capis flottantes d'abord",
          contenu: en
            ? `For each stock, cap = price × shares × float — only the tradable slice counts:\n\n${tableau}\n\nThe float strips out strategic holdings, founders and states: an index is meant to be *investable*.`
            : `Pour chaque titre, capi = cours × nombre de titres × flottant — seule la tranche négociable compte :\n\n${tableau}\n\nLe flottant écarte participations stratégiques, fondateurs et États : un indice doit rester *investissable*.`,
        },
        {
          titre: en ? 'The weight: one cap over the total' : 'Le poids : une capi sur le total',
          contenu: en
            ? `$w_{${nomCible}} = \\dfrac{${f(capiCible)}}{${f(total)}}$ = **${pct(reponse)}**. All the weights computed this way sum to exactly 100% — your built-in sanity check.`
            : `$w_{${nomCible}} = \\dfrac{${f(capiCible)}}{${f(total)}}$ = **${pct(reponse)}**. Tous les poids ainsi calculés somment exactement à 100 % — votre contrôle de cohérence intégré.`,
        },
        {
          titre: en ? 'What the weight drives' : 'Ce que le poids commande',
          contenu: en
            ? `Every euro tracking this index puts ${f(reponse)} cents on ${nomCible}: weights drive index funds' orders, which is why entering or leaving an index moves prices. And since weights follow prices, cap-weighted indices mechanically let their winners grow heavier.`
            : `Chaque euro qui réplique cet indice place ${f(reponse)} centimes sur ${nomCible} : les poids commandent les ordres des fonds indiciels — d'où les mouvements de cours aux entrées et sorties d'indice. Et comme les poids suivent les prix, un indice capi-pondéré laisse mécaniquement grossir ses gagnants.`,
        },
      ],
      pieges: [
        en
          ? `Using full market caps (ignoring the floats) would give ${pct(poidsPleine)} — the index only weighs what actually trades.${ecartPiege > 0 ? ` Here the slip would move the weight by ${f(ecartPiege)} point(s).` : ''}`
          : `Utiliser les capitalisations pleines (en ignorant les flottants) donnerait ${pct(poidsPleine)} — l'indice ne pèse que ce qui se négocie réellement.${ecartPiege > 0 ? ` Ici, l'erreur déplacerait le poids de ${f(ecartPiege)} point(s).` : ''}`,
        en
          ? 'Weighting by price alone (Dow Jones style) is another animal entirely: a high price does not mean a big company.'
          : "Pondérer par le seul cours (style Dow Jones) est un tout autre animal : un prix élevé ne fait pas une grosse société.",
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 13. P&L d'une vente à découvert (N2)
// ---------------------------------------------------------------------------
export const genShortPnl: ExerciseGenerator = {
  id: 'm3-app-short-pnl',
  moduleId: M3,
  titre: "P&L d'une vente à découvert",
  titreEn: 'P&L of a short sale',
  difficulte: 2,
  // Tirages (ordre strict) : 1. prixVente = randInt(20, 120) · 2. sens = pick(['gain', 'perte'])
  // · 3. mouvPct = randFloat(3, 15, 1) · 4. qC = randInt(1, 20) (quantite = qC × 100)
  // · 5. frais = randFloat(0.5, 4, 1) · 6. jours = pick([30, 45, 60, 90, 180]).
  // prixRachat = r2(prixVente × (1 ± mouvPct/100)) : − si gain, + si perte. Le signe du
  // P&L net suit le sens tiré (mouvement ≥ 3 % > frais maxi 4 % × 180/360 = 2 %).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const prixVente = randInt(rng, 20, 120);
    const sens = pick(rng, ['gain', 'perte'] as const);
    const mouvPct = randFloat(rng, 3, 15, 1);
    const qC = randInt(rng, 1, 20);
    const frais = randFloat(rng, 0.5, 4, 1);
    const jours = pick(rng, [30, 45, 60, 90, 180] as const);

    const quantite = qC * 100;
    const prixRachat = r2(prixVente * (1 + ((sens === 'perte' ? 1 : -1) * mouvPct) / 100));
    const reponse = r2(pnlVenteADecouvert(prixVente, prixRachat, quantite, frais, jours));
    const notionnel = prixVente * quantite;
    const brut = r2((prixVente - prixRachat) * quantite);
    const fraisEmprunt = r2(coutEmprunTitres(notionnel, frais, jours));
    const gagne = reponse > 0;

    const en = langue === 'en';
    const { f, eur, pct, sgn } = formatters(langue);
    return {
      enonce: en
        ? `You sell short ${f(quantite, 0)} shares at ${eur(prixVente, 0)}. ${jours} days later, you buy them back at ${eur(prixRachat)} to close the position. The stock borrow fee is ${pct(frais, 1)} a year (Act/360 convention, accrued on the proceeds of the short sale).\n\n**What is the net P&L of the trade, in euros (with its sign)?**`
        : `Vous vendez à découvert ${f(quantite, 0)} titres à ${eur(prixVente, 0)}. ${jours} jours plus tard, vous les rachetez à ${eur(prixRachat)} pour clôturer la position. Le taux d'emprunt des titres est de ${pct(frais, 1)} par an (convention Exact/360, frais courus sur le notionnel vendu).\n\n**Quel est le P&L net de l'opération, en euros (avec son signe) ?**`,
      reponse,
      tolerance: 0.5,
      toleranceMode: 'absolu',
      unite: '€',
      etapes: [
        {
          titre: en ? 'Gross P&L: sell high, buy back low' : 'P&L brut : vendre haut, racheter bas',
          contenu: en
            ? `A short profits when the price FALLS: gross P&L $= (P_{\\text{sale}} - P_{\\text{buy-back}}) × Q = (${f(prixVente, 0)} - ${f(prixRachat)}) × ${f(quantite, 0)} = ${sgn(brut)}$ €. ${brut > 0 ? `The stock dropped ${pct(mouvPct, 1)}: the position gains.` : `The stock rose ${pct(mouvPct, 1)}: buying back costs more than the sale brought in.`}`
            : `Un short gagne quand le cours BAISSE : P&L brut $= (P_{\\text{vente}} - P_{\\text{rachat}}) × Q = (${f(prixVente, 0)} - ${f(prixRachat)}) × ${f(quantite, 0)} = ${sgn(brut)}$ €. ${brut > 0 ? `Le titre a perdu ${pct(mouvPct, 1)} : la position gagne.` : `Le titre a pris ${pct(mouvPct, 1)} : le rachat coûte plus que la vente n'a rapporté.`}`,
        },
        {
          titre: en ? 'The borrow fee runs no matter what' : "Les frais d'emprunt courent quoi qu'il arrive",
          contenu: en
            ? `To sell what you do not own, you borrowed the shares. Fee = notional × rate × days/360 = $${f(notionnel, 0)} × ${f(frais, 1)}\\,\\% × ${jours}/360 = ${eur(fraisEmprunt)}$. It accrues every day the position stays open — win or lose.`
            : `Pour vendre ce que vous ne possédez pas, vous avez emprunté les titres. Frais = notionnel × taux × jours/360 = $${f(notionnel, 0)} × ${f(frais, 1)}\\,\\% × ${jours}/360 = ${eur(fraisEmprunt)}$. Ils courent chaque jour de position ouverte — gain ou perte.`,
        },
        {
          titre: en ? 'Net the trade' : "Solder l'opération",
          contenu: en
            ? `Net P&L = ${sgn(brut)} − ${f(fraisEmprunt)} = **${sgn(reponse)} €**. ${gagne ? 'The drop was big enough to beat the cost of carry: the short pays.' : 'The trade loses — and note the asymmetry: a short\'s loss is unbounded, since nothing caps how high a price can climb.'}`
            : `P&L net = ${sgn(brut)} − ${f(fraisEmprunt)} = **${sgn(reponse)} €**. ${gagne ? "La baisse a largement payé le coût de portage : le short est gagnant." : "L'opération perd — et notez l'asymétrie : la perte d'un short n'a pas de plafond, car rien ne limite la hausse d'un cours."}`,
        },
      ],
      pieges: [
        en
          ? `Stopping at the gross P&L of ${sgn(brut)} €: the borrow fee of ${eur(fraisEmprunt)} runs whether the trade wins or loses — the answer is the NET figure, ${sgn(reponse)} €.`
          : `S'arrêter au P&L brut de ${sgn(brut)} € : les frais d'emprunt de ${eur(fraisEmprunt)} courent que l'opération gagne ou perde — la réponse est le chiffre NET, ${sgn(reponse)} €.`,
        en
          ? 'Getting the direction wrong: a short LOSES when the price rises. The P&L reads (sale − buy-back), never the other way round.'
          : "Se tromper de sens : un short PERD quand le cours monte. Le P&L se lit (vente − rachat), jamais l'inverse.",
      ],
    };
  },
};

export const exercices: ExerciseGenerator[] = [
  genGordon,
  genGordonCroissance,
  genDdmDeuxEtapes,
  genDcfVt,
  genPer,
  genBpaPerPrix,
  genEvEbitda,
  genRendementPayout,
  genExDividende,
  genSplit,
  genDps,
  genPoidsIndice,
  genShortPnl,
];
