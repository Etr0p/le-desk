/**
 * Les 14 générateurs d'exercices d'application du module Change, matières
 * premières & crypto.
 *
 * BILINGUES : generate(seed, langue = 'fr'). Invariant absolu : TOUS les tirages
 * aléatoires sont effectués AVANT toute branche de langue — un même seed produit
 * exactement les mêmes nombres, la même réponse et la même tolérance en français
 * et en anglais. Seuls les textes (énoncé, étapes, pièges, unité textuelle) changent.
 *
 * Tous les calculs passent par calculs.ts (aucune formule recopiée). Convention
 * FX du module (en-tête de calculs.ts) : une paire s'écrit BASE/COTÉE —
 * EUR/USD = 1,10 signifie 1 EUR (base) = 1,10 USD (cotée). Le piège n° 1 du
 * module est le SENS de lecture : il est explicité dans chaque corrigé concerné.
 * L'ordre des tirages de chaque moule est documenté dans son commentaire
 * « Tirages (ordre strict) ».
 */
import { formatNombreLangue } from '../../../engine/answers';
import { mulberry32, pick, randFloat, randInt } from '../../../engine/rng';
import type { ExerciseGenerator, Langue } from '../../../engine/types';
import {
  baseFutures,
  coutSpreadFx,
  forwardCommodity,
  forwardFx,
  pnlCarryTrade,
  pointsDeTerme,
  rollYieldAnnualise,
  surSousEvaluation,
  tauxPpa,
  variationAnnualiseePct,
} from './calculs';

const M6 = '06-change-commos-crypto';

const r2 = (v: number) => Math.round(v * 100) / 100;
const r4 = (v: number) => Math.round(v * 10_000) / 10_000;

/** Formateurs dépendants de la langue : nombre, cotation à décimales fixes, devises, pourcentage. */
function formatters(langue: Langue) {
  const f = (v: number, d = 2) => formatNombreLangue(langue, v, d);
  /** Cotation à décimales FIXES (zéros conservés) : 1,0200 et non 1,02. */
  const fix = (v: number, d: number) => {
    const s = formatNombreLangue(langue, v, d);
    if (d === 0) return s;
    const sep = langue === 'en' ? '.' : ',';
    const [ent, frac = ''] = s.split(sep);
    return `${ent}${sep}${frac.padEnd(d, '0')}`;
  };
  const eur = (v: number, d = 2) => (langue === 'en' ? `€${f(v, d)}` : `${f(v, d)} €`);
  const usd = (v: number, d = 2) => (langue === 'en' ? `$${f(v, d)}` : `${f(v, d)} $`);
  const pct = (v: number, d = 2) => (langue === 'en' ? `${f(v, d)}%` : `${f(v, d)} %`);
  /** Nombre signé (+2 / −1), pour afficher des P&L, des pips ou des écarts. */
  const sgn = (v: number, d = 2) => (v > 0 ? `+${f(v, d)}` : f(v, d));
  return { f, fix, eur, usd, pct, sgn };
}

/** « 6 mois » / « 1 an » / « 2 ans » selon l'horizon en années. */
function libelleHorizon(annees: number, en: boolean): string {
  if (annees < 1 || !Number.isInteger(annees)) {
    const mois = Math.round(annees * 12);
    return en ? `${mois} months` : `${mois} mois`;
  }
  if (annees === 1) return en ? '1 year' : '1 an';
  return en ? `${annees} years` : `${annees} ans`;
}

// ---------------------------------------------------------------------------
// 1. Lire une cotation : le sens d'abord (N1)
// ---------------------------------------------------------------------------
export const genLectureCotation: ExerciseGenerator = {
  id: 'm6-ex-01',
  moduleId: M6,
  titre: 'Lire une cotation : le sens d\'abord',
  titreEn: 'Reading an FX quote: direction first',
  difficulte: 1,
  // Tirages (ordre strict) : 1. spot = randFloat(1.02, 1.25, 4) · 2. mK = randInt(20, 800).
  // montantUsd = mK × 1 000 ; réponse = montantUsd/spot (des dollars vers des euros, on DIVISE).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const spot = randFloat(rng, 1.02, 1.25, 4);
    const mK = randInt(rng, 20, 800);

    const montantUsd = mK * 1000;
    const reponse = r2(montantUsd / spot);
    const fauxMult = r2(montantUsd * spot);
    const inverse = r4(1 / spot);

    const en = langue === 'en';
    const { f, fix, eur, usd } = formatters(langue);
    return {
      enonce: en
        ? `Your company has just received ${usd(montantUsd, 0)}. The EUR/USD rate stands at ${fix(spot, 4)}.\n\n**How many euros is this amount worth, in euros?**`
        : `Votre entreprise vient de recevoir ${usd(montantUsd, 0)}. Le cours EUR/USD s'affiche à ${fix(spot, 4)}.\n\n**Combien d'euros ce montant vaut-il, en euros ?**`,
      reponse,
      tolerance: 0.005,
      unite: '€',
      etapes: [
        {
          titre: en ? 'Read the pair in the right direction' : 'Lire la paire dans le bon sens',
          contenu: en
            ? `A pair reads BASE/QUOTED: EUR/USD = ${fix(spot, 4)} is the price of **one euro in dollars** — 1 € is worth ${fix(spot, 4)} $. The rate converts euros INTO dollars when you multiply; here you are going the other way.`
            : `Une paire se lit BASE/COTÉE : EUR/USD = ${fix(spot, 4)} est le prix d'**un euro en dollars** — 1 € vaut ${fix(spot, 4)} $. Le cours convertit des euros EN dollars quand on multiplie ; ici, vous faites le chemin inverse.`,
        },
        {
          titre: en ? 'Dollars to euros: divide' : 'Des dollars vers des euros : diviser',
          contenu: en
            ? `$\\text{euros} = \\dfrac{\\text{dollars}}{S} = \\dfrac{${f(montantUsd, 0)}}{${fix(spot, 4)}}$ = **${eur(reponse)}**. Dimensional check: dollars divided by (dollars per euro) leaves euros — the units do the thinking for you.`
            : `$\\text{euros} = \\dfrac{\\text{dollars}}{S} = \\dfrac{${f(montantUsd, 0)}}{${fix(spot, 4)}}$ = **${eur(reponse)}**. Contrôle dimensionnel : des dollars divisés par des (dollars par euro) laissent des euros — les unités réfléchissent à votre place.`,
        },
        {
          titre: en ? 'Check by going back' : 'Vérifier en sens inverse',
          contenu: en
            ? `${f(reponse)} € × ${fix(spot, 4)} ≈ ${usd(montantUsd, 0)}: the round trip lands back on the invoice. Equivalent reflex: 1 $ is worth $1/S = ${fix(inverse, 4)}$ € — multiplying the dollars by ${fix(inverse, 4)} gives the same ${eur(reponse)}.`
            : `${f(reponse)} € × ${fix(spot, 4)} ≈ ${usd(montantUsd, 0)} : l'aller-retour retombe sur la facture. Réflexe équivalent : 1 $ vaut $1/S = ${fix(inverse, 4)}$ € — multiplier les dollars par ${fix(inverse, 4)} redonne les mêmes ${eur(reponse)}.`,
        },
      ],
      pieges: [
        en
          ? `Multiplying instead of dividing: ${f(montantUsd, 0)} × ${fix(spot, 4)} = ${eur(fauxMult)} — wildly off. The rate is the price of ONE EURO in dollars, not the price of one dollar in euros: getting the direction wrong is THE classic FX mistake.`
          : `Multiplier au lieu de diviser : ${f(montantUsd, 0)} × ${fix(spot, 4)} = ${eur(fauxMult)} — complètement faux. Le cours est le prix d'UN EURO en dollars, pas celui d'un dollar en euros : se tromper de sens est LE piège classique du change.`,
        en
          ? 'Thinking a rising EUR/USD helps the dollar holder: the opposite — if the rate climbs, the divisor grows and your dollars buy FEWER euros. A rising pair is always an appreciation of the BASE currency.'
          : "Croire qu'un EUR/USD qui monte arrange le détenteur de dollars : c'est l'inverse — si le cours grimpe, le diviseur grossit et vos dollars achètent MOINS d'euros. Une paire qui monte est toujours une appréciation de la devise de BASE.",
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 2. Compter les pips (N1)
// ---------------------------------------------------------------------------
export const genVariationPips: ExerciseGenerator = {
  id: 'm6-ex-02',
  moduleId: M6,
  titre: 'Compter les pips',
  titreEn: 'Counting pips',
  difficulte: 1,
  // Tirages (ordre strict) : 1. estYen = pick([false, true]) · 2. c4 = randFloat(1.02, 1.24, 4)
  // · 3. cY = randFloat(132, 158, 2) · 4. sens = pick([1, −1]) · 5. nbPips = randInt(15, 240).
  // Tous les tirages ont lieu, puis on retient c4 (pip 0,0001) ou cY (paire yen, pip 0,01) ;
  // cours2 = cours1 + sens × nbPips × pip, arrondi aux décimales de la paire.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const estYen = pick(rng, [false, true] as const);
    const c4 = randFloat(rng, 1.02, 1.24, 4);
    const cY = randFloat(rng, 132, 158, 2);
    const sens = pick(rng, [1, -1] as const);
    const nbPips = randInt(rng, 15, 240);

    const paire = estYen ? 'USD/JPY' : 'EUR/USD';
    const dec = estYen ? 2 : 4;
    const pip = estYen ? 0.01 : 0.0001;
    const cours1 = estYen ? cY : c4;
    const fac = 10 ** dec;
    const cours2 = Math.round((cours1 + sens * nbPips * pip) * fac) / fac;
    // pointsDeTerme = écart × 10 000 ; sur une paire yen, le pip vaut 0,01 = 100 × 0,0001.
    const reponse = Math.round(pointsDeTerme(cours1, cours2) / (estYen ? 100 : 1));
    const diff = Math.round((cours2 - cours1) * fac) / fac;
    const fauxConvention = estYen ? reponse * 100 : reponse / 100;

    const en = langue === 'en';
    const { fix, sgn } = formatters(langue);
    const baseFr = estYen ? 'le dollar' : "l'euro";
    const coteeFr = estYen ? 'le yen' : 'le dollar';
    const baseEn = estYen ? 'the dollar' : 'the euro';
    const coteeEn = estYen ? 'the yen' : 'the dollar';
    return {
      enonce: en
        ? `During the session, ${paire} moves from ${fix(cours1, dec)} to ${fix(cours2, dec)}.\n\n**By how many pips has the pair moved? (positive sign if the base currency appreciated)**`
        : `Dans la séance, ${paire} passe de ${fix(cours1, dec)} à ${fix(cours2, dec)}.\n\n**De combien de pips la paire a-t-elle varié ? (signe positif si la devise de base s'est appréciée)**`,
      reponse,
      tolerance: 0.5,
      toleranceMode: 'absolu',
      unite: 'pips',
      etapes: [
        {
          titre: en ? 'Pin down the pip size first' : "D'abord verrouiller la taille du pip",
          contenu: en
            ? `On pairs quoted to 4 decimals, the pip is the **4th decimal** (0.0001). Exception that matters: yen pairs quote to 2 decimals, so their pip is the **2nd decimal** (0.01). Here, ${paire} → pip = ${fix(pip, dec)}.`
            : `Sur les paires cotées à 4 décimales, le pip est la **4ᵉ décimale** (0,0001). Exception d'importance : les paires en yen cotent à 2 décimales, leur pip est la **2ᵉ décimale** (0,01). Ici, ${paire} → pip = ${fix(pip, dec)}.`,
        },
        {
          titre: en ? 'Count the move' : 'Compter le mouvement',
          contenu: en
            ? `Move = ${fix(cours2, dec)} − ${fix(cours1, dec)} = ${sgn(diff, dec)}; divided by the pip size ${fix(pip, dec)}: **${sgn(reponse, 0)} pips**. Same mechanics as the forward points of chapter 2 — an FX gap expressed in conventional ticks.`
            : `Variation = ${fix(cours2, dec)} − ${fix(cours1, dec)} = ${sgn(diff, dec)} ; divisée par la taille du pip ${fix(pip, dec)} : **${sgn(reponse, 0)} pips**. Même mécanique que les points de terme du chapitre 2 — un écart de change exprimé en pas de cotation conventionnels.`,
        },
        {
          titre: en ? 'Read the sign' : 'Lire le signe',
          contenu: en
            ? `${reponse > 0 ? `The rate rose: ${baseEn} (the base) appreciated against ${coteeEn}.` : `The rate fell: ${baseEn} (the base) depreciated against ${coteeEn}.`} A rising pair is ALWAYS an appreciation of the base — never read it any other way. Desk shorthand: the big figure (${fix(Math.floor(cours1 * (estYen ? 1 : 100)) / (estYen ? 1 : 100), estYen ? 0 : 2)}) is assumed known, traders often quote the pips alone.`
            : `${reponse > 0 ? `Le cours a monté : ${baseFr} (la base) s'est apprécié contre ${coteeFr}.` : `Le cours a baissé : ${baseFr} (la base) s'est déprécié contre ${coteeFr}.`} Une paire qui monte est TOUJOURS une appréciation de la base — aucune autre lecture. Raccourci de desk : la figure (${fix(Math.floor(cours1 * (estYen ? 1 : 100)) / (estYen ? 1 : 100), estYen ? 0 : 2)}) étant supposée connue, les cambistes n'annoncent souvent que les pips.`,
        },
      ],
      pieges: [
        en
          ? estYen
            ? `Applying the 4-decimal convention to a yen pair: 0.0001 as the pip would give ${sgn(fauxConvention, 0)} pips instead of ${sgn(reponse, 0)} — off by a factor of 100. On USD/JPY, the pip is 0.01.`
            : `Applying the yen convention here: taking 0.01 as the pip would give ${sgn(fauxConvention, 2)} pips instead of ${sgn(reponse, 0)} — off by a factor of 100. On 4-decimal pairs, the pip is 0.0001.`
          : estYen
            ? `Appliquer la convention 4 décimales à une paire en yen : prendre 0,0001 comme pip donnerait ${sgn(fauxConvention, 0)} pips au lieu de ${sgn(reponse, 0)} — un facteur 100 d'écart. Sur USD/JPY, le pip vaut 0,01.`
            : `Appliquer ici la convention yen : prendre 0,01 comme pip donnerait ${sgn(fauxConvention, 2)} pips au lieu de ${sgn(reponse, 0)} — un facteur 100 d'écart. Sur les paires à 4 décimales, le pip vaut 0,0001.`,
        en
          ? `Announcing the move of the QUOTED currency: "${paire} ${reponse > 0 ? 'rose' : 'fell'}" means ${baseEn} ${reponse > 0 ? 'strengthened' : 'weakened'} — and ${coteeEn} did the exact opposite. "The dollar is up" stays ambiguous until you name the pair and the dollar's seat in it.`
          : `Annoncer la variation de la devise COTÉE : « ${paire} ${reponse > 0 ? 'monte' : 'baisse'} » signifie que ${baseFr} se ${reponse > 0 ? 'renforce' : 'déprécie'} — et que ${coteeFr} fait exactement l'inverse. « Le dollar monte » reste ambigu tant qu'on n'a pas nommé la paire et la place du dollar dedans.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 3. Le coût du spread bid/ask (N1)
// ---------------------------------------------------------------------------
export const genCoutSpread: ExerciseGenerator = {
  id: 'm6-ex-03',
  moduleId: M6,
  titre: 'Le coût du spread bid/ask',
  titreEn: 'The cost of the bid-ask spread',
  difficulte: 1,
  // Tirages (ordre strict) : 1. milieu = randFloat(1.04, 1.22, 2) · 2. spreadPips = pick([2, 4, 6, 8, 10])
  // · 3. montantM = randInt(1, 10). bid/ask = milieu ∓ spreadPips/2 × 0,0001 (symétriques, exacts) ;
  // coût via coutSpreadFx (montant en euros, coût en euros).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const milieu = randFloat(rng, 1.04, 1.22, 2);
    const spreadPips = pick(rng, [2, 4, 6, 8, 10] as const);
    const montantM = randInt(rng, 1, 10);

    const bid = r4(milieu - (spreadPips / 2) * 0.0001);
    const ask = r4(milieu + (spreadPips / 2) * 0.0001);
    const montant = montantM * 1_000_000;
    const reponse = r2(coutSpreadFx(montant, bid, ask));
    const fauxDollars = r2(montant * (ask - bid));
    const coutPct = r2(((ask - bid) / milieu) * 100 * 100) / 100; // % du montant, 2 déc.

    const en = langue === 'en';
    const { f, fix, eur, usd, pct } = formatters(langue);
    return {
      enonce: en
        ? `A bank quotes EUR/USD at ${fix(bid, 4)} / ${fix(ask, 4)}. You buy €${f(montantM, 0)}m at the ask and sell it back immediately at the bid.\n\n**What is the cost of this round trip, in euros?**`
        : `Une banque cote EUR/USD ${fix(bid, 4)} / ${fix(ask, 4)}. Vous achetez ${f(montantM, 0)} M€ à l'ask et les revendez aussitôt au bid.\n\n**Quel est le coût de cet aller-retour, en euros ?**`,
      reponse,
      tolerance: 0.005,
      unite: '€',
      etapes: [
        {
          titre: en ? 'Spread and mid' : 'Le spread et le milieu',
          contenu: en
            ? `Spread = ask − bid = ${fix(ask, 4)} − ${fix(bid, 4)} = ${fix(ask - bid, 4)}, i.e. **${spreadPips} pips**; mid = (bid + ask)/2 = ${fix(milieu, 4)}. The spread is the market maker's pay — module 1's mechanics running at the tightest setting in the world.`
            : `Spread = ask − bid = ${fix(ask, 4)} − ${fix(bid, 4)} = ${fix(ask - bid, 4)}, soit **${spreadPips} pips** ; milieu = (bid + ask)/2 = ${fix(milieu, 4)}. Le spread est la rémunération du teneur de marché — la mécanique du module 1, au réglage le plus serré du monde.`,
        },
        {
          titre: en ? 'The cost: relative spread × amount' : 'Le coût : spread relatif × montant',
          contenu: en
            ? `Cost $= M × \\dfrac{ask - bid}{\\text{mid}} = ${f(montant, 0)} × \\dfrac{${fix(ask - bid, 4)}}{${fix(milieu, 4)}}$ = **${eur(reponse)}**. Step by step: the ${spreadPips} pips collect in DOLLARS — ${usd(fauxDollars, 0)} on €${f(montantM, 0)}m — and must be converted back at the mid (${f(fauxDollars, 0)}/${fix(milieu, 4)}) to be expressed in euros.`
            : `Coût $= M × \\dfrac{ask - bid}{\\text{milieu}} = ${f(montant, 0)} × \\dfrac{${fix(ask - bid, 4)}}{${fix(milieu, 4)}}$ = **${eur(reponse)}**. Pas à pas : les ${spreadPips} pips s'encaissent en DOLLARS — ${usd(fauxDollars, 0)} sur ${f(montantM, 0)} M€ —, qu'il faut reconvertir au milieu (${f(fauxDollars, 0)}/${fix(milieu, 4)}) pour les exprimer en euros.`,
        },
        {
          titre: en ? 'Put the figure in perspective' : 'Mettre le chiffre en perspective',
          contenu: en
            ? `That is ${pct(coutPct, 3)} of the amount: trivial for one trade, considerable for whoever turns the book over several times a day. On the majors at liquid hours the spread routinely sits around one pip — and it is paid at EXECUTION, whatever the rate does afterwards.`
            : `Soit ${pct(coutPct, 3)} du montant : dérisoire pour une opération isolée, considérable pour qui tourne son portefeuille plusieurs fois par jour. Sur les majors aux heures liquides, le spread descend couramment autour d'un pip — et il se paie à l'EXÉCUTION, quoi que fasse le cours ensuite.`,
        },
      ],
      pieges: [
        en
          ? `Announcing ${eur(fauxDollars, 0)}: amount × spread does give ${f(fauxDollars, 0)}, but in the QUOTED currency — dollars. Forgetting to convert back at the mid inflates the cost by the level of the rate (about ${f(milieu)}×).`
          : `Annoncer ${eur(fauxDollars, 0)} : montant × spread donne bien ${f(fauxDollars, 0)}, mais en devise COTÉE — des dollars. Oublier la reconversion au milieu gonfle le coût du niveau du cours (environ ${f(milieu)}×).`,
        en
          ? 'Hoping to "wait it out": the spread is not a price move, it is a friction cashed in by the market maker the moment you trade. Waiting exposes you to rate risk on top — it never refunds the spread.'
          : "Espérer « attendre que ça revienne » : le spread n'est pas un mouvement de cours, c'est une friction encaissée par le teneur de marché à l'instant où vous traitez. Attendre ajoute un risque de cours par-dessus — cela ne rembourse jamais le spread.",
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 4. Le cours croisé EUR/JPY (N2)
// ---------------------------------------------------------------------------
export const genCoursCroise: ExerciseGenerator = {
  id: 'm6-ex-04',
  moduleId: M6,
  titre: 'Le cours croisé EUR/JPY',
  titreEn: 'The EUR/JPY cross rate',
  difficulte: 2,
  // Tirages (ordre strict) : 1. eurUsd = randFloat(1.02, 1.25, 4) · 2. usdJpy = randFloat(128, 162, 2).
  // EUR/JPY = EUR/USD × USD/JPY (le dollar s'annule), arrondi à 2 décimales (paire yen).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const eurUsd = randFloat(rng, 1.02, 1.25, 4);
    const usdJpy = randFloat(rng, 128, 162, 2);

    const reponse = r2(eurUsd * usdJpy);
    const fauxDivision = r2(usdJpy / eurUsd);

    const en = langue === 'en';
    const { f, fix } = formatters(langue);
    return {
      enonce: en
        ? `Your screens show EUR/USD at ${fix(eurUsd, 4)} and USD/JPY at ${fix(usdJpy, 2)}, but no direct EUR/JPY quote.\n\n**What is the implied EUR/JPY cross rate?**`
        : `Vos écrans affichent EUR/USD à ${fix(eurUsd, 4)} et USD/JPY à ${fix(usdJpy, 2)}, mais aucune cotation directe EUR/JPY.\n\n**Quel est le cours croisé EUR/JPY implicite ?**`,
      reponse,
      tolerance: 0.005,
      unite: '¥',
      etapes: [
        {
          titre: en ? 'What the cross must mean' : 'Ce que le cross doit signifier',
          contenu: en
            ? `EUR/JPY reads BASE/QUOTED like any pair: the price of **1 euro in yen**. To build it, walk the euro to the yen through the dollar: 1 € → dollars (via EUR/USD) → yen (via USD/JPY).`
            : `EUR/JPY se lit BASE/COTÉE comme toute paire : le prix d'**1 euro en yens**. Pour le construire, faites voyager l'euro jusqu'au yen en passant par le dollar : 1 € → dollars (via EUR/USD) → yens (via USD/JPY).`,
        },
        {
          titre: en ? 'The dollars cancel: multiply' : 'Les dollars s\'annulent : multiplier',
          contenu: en
            ? `1 € = ${fix(eurUsd, 4)} $, and each dollar = ${fix(usdJpy, 2)} ¥: $\\text{EUR/JPY} = ${fix(eurUsd, 4)} × ${fix(usdJpy, 2)}$ = **${f(reponse)}**. Dimensionally, ($/€) × (¥/$) = ¥/€ — the dollar appears once on top, once below, and vanishes.`
            : `1 € = ${fix(eurUsd, 4)} $, et chaque dollar = ${fix(usdJpy, 2)} ¥ : $\\text{EUR/JPY} = ${fix(eurUsd, 4)} × ${fix(usdJpy, 2)}$ = **${f(reponse)}**. Dimensionnellement, ($/€) × (¥/$) = ¥/€ — le dollar apparaît une fois en haut, une fois en bas, et disparaît.`,
        },
        {
          titre: en ? 'Why the implied cross holds' : 'Pourquoi le cross implicite tient',
          contenu: en
            ? `If a bank quoted EUR/JPY away from ${f(reponse)}, a triangular arbitrage (€ → $ → ¥ → € or the reverse) would lock in a free profit — desks monitor crosses against this implied value permanently. Sanity check: the cross sits near the yen pair's order of magnitude (around ${f(Math.round(reponse), 0)}), with 2-decimal quoting since it is a yen pair.`
            : `Si une banque cotait EUR/JPY loin de ${f(reponse)}, un arbitrage triangulaire (€ → $ → ¥ → € ou l'inverse) verrouillerait un gain gratuit — les desks surveillent en permanence les crosses contre cette valeur implicite. Contrôle d'ordre de grandeur : le cross vit près du niveau des paires en yen (autour de ${f(Math.round(reponse), 0)}), coté à 2 décimales puisque c'est une paire en yen.`,
        },
      ],
      pieges: [
        en
          ? `Dividing instead of multiplying: ${fix(usdJpy, 2)}/${fix(eurUsd, 4)} = ${f(fauxDivision)} — a plausible-looking number, which is what makes it dangerous. Run the dimensional check: (¥/$) ÷ ($/€) = ¥·€/$² — meaningless. Division is only right when the SAME currency is the base of both pairs.`
          : `Diviser au lieu de multiplier : ${fix(usdJpy, 2)}/${fix(eurUsd, 4)} = ${f(fauxDivision)} — un chiffre d'allure plausible, et c'est ce qui le rend dangereux. Faites le contrôle dimensionnel : (¥/$) ÷ ($/€) = ¥·€/$² — aucun sens. La division n'est correcte que lorsque la MÊME devise est en base des deux paires.`,
        en
          ? 'Forgetting the BASE/QUOTED hierarchy: the market quotes EUR/JPY (euro as base, per the EUR > GBP > AUD > NZD > USD convention), never JPY/EUR. Announcing the inverse of the cross is the same direction mistake as in exercise 1.'
          : "Oublier la hiérarchie BASE/COTÉE : la place cote EUR/JPY (euro en base, selon la convention EUR > GBP > AUD > NZD > USD), jamais JPY/EUR. Annoncer l'inverse du cross est la même faute de sens qu'à l'exercice 1.",
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 5. Forward FX par la parité couverte (N2)
// ---------------------------------------------------------------------------
export const genForwardCip: ExerciseGenerator = {
  id: 'm6-ex-05',
  moduleId: M6,
  titre: 'Forward FX par la parité couverte',
  titreEn: 'FX forward via covered interest parity',
  difficulte: 2,
  // Tirages (ordre strict) : 1. spot = randFloat(1.02, 1.25, 4) · 2. rLow = randFloat(0.5, 4.5, 2)
  // · 3. gap = randFloat(0.75, 3, 2) · 4. regime = pick(['report', 'deport'])
  // · 5. T = pick([0.5, 0.75, 1, 1.5, 2]). rHigh = r2(rLow + gap) ; report ⇒ rCotee = rHigh
  // (la cotée rémunère plus ⇒ F > S), déport ⇒ rCotee = rLow. F = forwardFx, arrondi à 4 déc.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const spot = randFloat(rng, 1.02, 1.25, 4);
    const rLow = randFloat(rng, 0.5, 4.5, 2);
    const gap = randFloat(rng, 0.75, 3, 2);
    const regime = pick(rng, ['report', 'deport'] as const);
    const T = pick(rng, [0.5, 0.75, 1, 1.5, 2] as const);

    const rHigh = r2(rLow + gap);
    const rCotee = regime === 'report' ? rHigh : rLow;
    const rBase = regime === 'report' ? rLow : rHigh;
    const fExact = forwardFx(spot, rCotee, rBase, T);
    const reponse = r4(fExact);
    const facteur = fExact / spot;
    const numerateur = 1 + (rCotee / 100) * T;
    const denominateur = 1 + (rBase / 100) * T;
    const points = Math.round(pointsDeTerme(spot, fExact) * 10) / 10;
    const fauxInverse = r4(forwardFx(spot, rBase, rCotee, T));
    const enReport = regime === 'report';

    const en = langue === 'en';
    const { f, fix, pct, sgn } = formatters(langue);
    const horizon = libelleHorizon(T, en);
    return {
      enonce: en
        ? `Spot EUR/USD trades at ${fix(spot, 4)}. The ${horizon} money-market rate is ${pct(rCotee)} on the dollar and ${pct(rBase)} on the euro (simple linear rates).\n\n**What is the ${horizon} forward rate under covered interest parity (4 decimals)?**`
        : `Le spot EUR/USD cote ${fix(spot, 4)}. Le taux monétaire à ${horizon} ressort à ${pct(rCotee)} sur le dollar et ${pct(rBase)} sur l'euro (taux linéaires simples).\n\n**Quel est le cours forward à ${horizon} selon la parité des taux d'intérêt couverte (4 décimales) ?**`,
      reponse,
      tolerance: 0.001,
      etapes: [
        {
          titre: en ? 'Seat the rates: quoted on top, base below' : 'Placer les taux : la cotée en haut, la base en bas',
          contenu: en
            ? `CIP in simple linear terms: $F = S × \\dfrac{1 + r_{\\text{quoted}}\\,T}{1 + r_{\\text{base}}\\,T}$. On EUR/USD, the QUOTED currency is the dollar (${pct(rCotee)} goes to the numerator) and the BASE is the euro (${pct(rBase)} to the denominator). No forecast enters: spot and two observable rates — pure no-arbitrage arithmetic.`
            : `La CIP en linéaire simple : $F = S × \\dfrac{1 + r_{\\text{cotée}}\\,T}{1 + r_{\\text{base}}\\,T}$. Sur EUR/USD, la devise COTÉE est le dollar (${pct(rCotee)} va au numérateur) et la BASE est l'euro (${pct(rBase)} au dénominateur). Aucune prévision n'entre ici : le spot et deux taux observables — de la pure arithmétique d'absence d'arbitrage.`,
        },
        {
          titre: en ? 'Compute the carry factor, then the forward' : 'Calculer le facteur de portage, puis le forward',
          contenu: en
            ? `$F = ${fix(spot, 4)} × \\dfrac{1 + ${f(rCotee)}\\,\\% × ${f(T)}}{1 + ${f(rBase)}\\,\\% × ${f(T)}} = ${fix(spot, 4)} × \\dfrac{${f(numerateur, 5)}}{${f(denominateur, 5)}} = ${fix(spot, 4)} × ${f(facteur, 6)}$ = **${fix(reponse, 4)}**. The forward differs from spot by exactly the interest differential carried over ${horizon} — nothing more.`
            : `$F = ${fix(spot, 4)} × \\dfrac{1 + ${f(rCotee)}\\,\\% × ${f(T)}}{1 + ${f(rBase)}\\,\\% × ${f(T)}} = ${fix(spot, 4)} × \\dfrac{${f(numerateur, 5)}}{${f(denominateur, 5)}} = ${fix(spot, 4)} × ${f(facteur, 6)}$ = **${fix(reponse, 4)}**. Le forward s'écarte du spot d'exactement le différentiel d'intérêt porté sur ${horizon} — rien de plus.`,
        },
        {
          titre: en ? (enReport ? 'Name the regime: premium (report)' : 'Name the regime: discount (déport)') : enReport ? 'Nommer le régime : report' : 'Nommer le régime : déport',
          contenu: en
            ? enReport
              ? `F = ${fix(reponse, 4)} > S = ${fix(spot, 4)}: the euro (base) trades at a **premium** of ${sgn(points, 1)} pips. Logical: the dollar pays more (${pct(rCotee)} vs ${pct(rBase)}), so the forward must hand that advantage back — the rule "the LOW-rate currency appreciates forward" in action. The forward neutralises the carry; it rewards no one.`
              : `F = ${fix(reponse, 4)} < S = ${fix(spot, 4)}: the euro (base) trades at a **discount** of ${sgn(points, 1)} pips. Logical: the euro pays more (${pct(rBase)} vs ${pct(rCotee)}), so the forward claws that advantage back — the rule "the LOW-rate currency appreciates forward" in action. The forward neutralises the carry; it rewards no one.`
            : enReport
              ? `F = ${fix(reponse, 4)} > S = ${fix(spot, 4)} : l'euro (la base) cote en **report** de ${sgn(points, 1)} pips. Logique : le dollar rémunère plus (${pct(rCotee)} contre ${pct(rBase)}), le forward doit donc rendre cet avantage — la règle « la devise au taux le plus BAS se revalorise à terme » en action. Le forward neutralise le portage ; il ne récompense personne.`
              : `F = ${fix(reponse, 4)} < S = ${fix(spot, 4)} : l'euro (la base) cote en **déport** de ${sgn(points, 1)} pips. Logique : l'euro rémunère plus (${pct(rBase)} contre ${pct(rCotee)}), le forward reprend donc cet avantage — la règle « la devise au taux le plus BAS se revalorise à terme » en action. Le forward neutralise le portage ; il ne récompense personne.`,
        },
      ],
      pieges: [
        en
          ? `Flipping the ratio: putting the base rate on top gives ${fix(fauxInverse, 4)} instead of ${fix(reponse, 4)} — the no. 1 mistake of the whole module. Lock the anchor: QUOTED currency rate in the numerator, BASE rate in the denominator, always.`
          : `Inverser le ratio : mettre le taux de la base au numérateur donne ${fix(fauxInverse, 4)} au lieu de ${fix(reponse, 4)} — LA faute n° 1 du module. Verrouillez l'ancrage : taux de la devise COTÉE au numérateur, taux de la BASE au dénominateur, toujours.`,
        en
          ? `Reading the ${enReport ? 'premium' : 'discount'} as a forecast ("the market expects a ${enReport ? 'stronger' : 'weaker'} euro"): the forward is an arbitrage price built from three observable numbers, not an expectation — if it deviated, borrowing one currency to lend the other fully hedged would print free money.`
          : `Lire le ${enReport ? 'report' : 'déport'} comme une prévision (« le marché anticipe un euro plus ${enReport ? 'fort' : 'faible'} ») : le forward est un prix d'arbitrage construit sur trois nombres observables, pas une anticipation — s'il s'en écartait, emprunter une devise pour placer l'autre, couvert à terme, imprimerait de l'argent gratuit.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 6. Les points de terme (N2)
// ---------------------------------------------------------------------------
export const genPointsTerme: ExerciseGenerator = {
  id: 'm6-ex-06',
  moduleId: M6,
  titre: 'Les points de terme',
  titreEn: 'Forward points',
  difficulte: 2,
  // Tirages (ordre strict) : 1. spot = randFloat(1.03, 1.24, 4) · 2. rLow = randFloat(0.5, 4.5, 2)
  // · 3. gap = randFloat(0.5, 3, 2) · 4. regime = pick(['report', 'deport']) · 5. T = pick([0.25, 0.5, 1]).
  // rHigh = r2(rLow + gap) ; F = forwardFx (pleine précision) ; réponse = pointsDeTerme(spot, F)
  // arrondie à 1 décimale (en pips, avec son signe).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const spot = randFloat(rng, 1.03, 1.24, 4);
    const rLow = randFloat(rng, 0.5, 4.5, 2);
    const gap = randFloat(rng, 0.5, 3, 2);
    const regime = pick(rng, ['report', 'deport'] as const);
    const T = pick(rng, [0.25, 0.5, 1] as const);

    const rHigh = r2(rLow + gap);
    const rCotee = regime === 'report' ? rHigh : rLow;
    const rBase = regime === 'report' ? rLow : rHigh;
    const fExact = forwardFx(spot, rCotee, rBase, T);
    const fAff = r4(fExact);
    const reponse = Math.round(pointsDeTerme(spot, fExact) * 10) / 10;
    const ecartBrut = r4(fExact - spot);
    const enReport = regime === 'report';

    const en = langue === 'en';
    const { f, fix, pct, sgn } = formatters(langue);
    const horizon = libelleHorizon(T, en);
    return {
      enonce: en
        ? `Spot EUR/USD stands at ${fix(spot, 4)}; the ${horizon} dollar rate is ${pct(rCotee)} and the euro rate ${pct(rBase)} (simple linear rates).\n\n**How many forward points (in pips, with their sign) does the ${horizon} forward carry?**`
        : `Le spot EUR/USD s'établit à ${fix(spot, 4)} ; le taux dollar à ${horizon} vaut ${pct(rCotee)} et le taux euro ${pct(rBase)} (taux linéaires simples).\n\n**Combien de points de terme (en pips, avec leur signe) le forward à ${horizon} porte-t-il ?**`,
      reponse,
      tolerance: 1,
      toleranceMode: 'absolu',
      unite: 'pips',
      etapes: [
        {
          titre: en ? 'The forward first, via CIP' : "D'abord le forward, par la CIP",
          contenu: en
            ? `$F = S × \\dfrac{1 + r_{\\text{quoted}}\\,T}{1 + r_{\\text{base}}\\,T} = ${fix(spot, 4)} × \\dfrac{1 + ${f(rCotee)}\\,\\% × ${f(T)}}{1 + ${f(rBase)}\\,\\% × ${f(T)}} = ${fix(fAff, 4)}$. Same machine as the previous exercise — quoted-currency rate on top.`
            : `$F = S × \\dfrac{1 + r_{\\text{cotée}}\\,T}{1 + r_{\\text{base}}\\,T} = ${fix(spot, 4)} × \\dfrac{1 + ${f(rCotee)}\\,\\% × ${f(T)}}{1 + ${f(rBase)}\\,\\% × ${f(T)}} = ${fix(fAff, 4)}$. Même machine qu'à l'exercice précédent — le taux de la devise cotée au numérateur.`,
        },
        {
          titre: en ? 'From the gap to the points: × 10,000' : "De l'écart aux points : × 10 000",
          contenu: en
            ? `Forward points $= (F - S) × 10\\,000 = (${fix(fAff, 4)} - ${fix(spot, 4)}) × 10\\,000$ = **${sgn(reponse, 1)} pips**. The raw gap, ${sgn(ecartBrut, 4)}, is unreadable on a screen; expressed in pips (the 4th decimal) it becomes the number dealers actually exchange.`
            : `Points de terme $= (F - S) × 10\\,000 = (${fix(fAff, 4)} - ${fix(spot, 4)}) × 10\\,000$ = **${sgn(reponse, 1)} pips**. L'écart brut, ${sgn(ecartBrut, 4)}, est illisible à l'écran ; exprimé en pips (la 4ᵉ décimale), il devient le nombre que les cambistes s'échangent réellement.`,
        },
        {
          titre: en ? 'Read the sign like a dealer' : 'Lire le signe comme un cambiste',
          contenu: en
            ? `${enReport ? `Positive points: the base (euro) trades at a forward **premium** — consistent with the dollar paying more (${pct(rCotee)} > ${pct(rBase)}).` : `Negative points: the base (euro) trades at a forward **discount** — consistent with the euro paying more (${pct(rBase)} > ${pct(rCotee)}).`} Screens quote exactly this: spot ${fix(spot, 4)}, ${horizon} points "${sgn(reponse, 1)}" → outright ${fix(fAff, 4)}. One glance at the sign gives the regime.`
            : `${enReport ? `Points positifs : la base (l'euro) cote en **report** à terme — cohérent avec un dollar qui rémunère plus (${pct(rCotee)} > ${pct(rBase)}).` : `Points négatifs : la base (l'euro) cote en **déport** à terme — cohérent avec un euro qui rémunère plus (${pct(rBase)} > ${pct(rCotee)}).`} Les écrans cotent exactement cela : spot ${fix(spot, 4)}, points ${horizon} « ${sgn(reponse, 1)} » → outright ${fix(fAff, 4)}. Un coup d'œil au signe donne le régime.`,
        },
      ],
      pieges: [
        en
          ? `Reporting the raw gap ${sgn(ecartBrut, 4)} as "the points": forward points are quoted in PIPS — multiply by 10,000. (And on a yen pair, quoted to 2 decimals, the factor would be 100, not 10,000.)`
          : `Annoncer l'écart brut ${sgn(ecartBrut, 4)} comme « les points » : les points de terme se cotent en PIPS — multipliez par 10 000. (Et sur une paire en yen, cotée à 2 décimales, le facteur serait 100, pas 10 000.)`,
        en
          ? `Flipping the CIP ratio flips the sign of the points (about ${sgn(-reponse, 1)} pips instead of ${sgn(reponse, 1)}): you would announce a ${enReport ? 'discount' : 'premium'} where the market quotes a ${enReport ? 'premium' : 'discount'} — a sign error a counterparty will charge you for.`
          : `Inverser le ratio de la CIP inverse le signe des points (environ ${sgn(-reponse, 1)} pips au lieu de ${sgn(reponse, 1)}) : vous annonceriez un ${enReport ? 'déport' : 'report'} là où le marché cote un ${enReport ? 'report' : 'déport'} — une erreur de signe qu'une contrepartie vous facturera.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 7. Arbitrage CIP : le forward mal coté (N3)
// ---------------------------------------------------------------------------
export const genArbitrageCip: ExerciseGenerator = {
  id: 'm6-ex-07',
  moduleId: M6,
  titre: 'Arbitrage CIP : le forward mal coté',
  titreEn: 'CIP arbitrage: a mispriced forward',
  difficulte: 3,
  // Tirages (ordre strict) : 1. spot = randFloat(1.03, 1.24, 4) · 2. rLow = randFloat(0.5, 4, 2)
  // · 3. gap = randFloat(1, 3, 2) · 4. regime = pick(['report', 'deport']) · 5. T = pick([0.5, 1])
  // · 6. ecartPips = randInt(25, 110). Fth = forwardFx ; Fcote = r4(Fth + ecartPips × 0,0001)
  // (toujours AU-DESSUS du prix CIP : la base se vend à terme trop cher — cas du chapitre 2).
  // Machine : emprunter 1 M$ à rCotee, vendre spot contre euros, placer à rBase, vendre à terme à Fcote.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const spot = randFloat(rng, 1.03, 1.24, 4);
    const rLow = randFloat(rng, 0.5, 4, 2);
    const gap = randFloat(rng, 1, 3, 2);
    const regime = pick(rng, ['report', 'deport'] as const);
    const T = pick(rng, [0.5, 1] as const);
    const ecartPips = randInt(rng, 25, 110);

    const rHigh = r2(rLow + gap);
    const rCotee = regime === 'report' ? rHigh : rLow;
    const rBase = regime === 'report' ? rLow : rHigh;
    const fTh = forwardFx(spot, rCotee, rBase, T);
    const fThAff = r4(fTh);
    const fCote = r4(fTh + ecartPips * 0.0001);
    const ecartReel = Math.round(pointsDeTerme(fTh, fCote) * 10) / 10;

    const notionnel = 1_000_000; // dollars empruntés
    const dette = notionnel * (1 + (rCotee / 100) * T);
    const eurosSpot = notionnel / spot;
    const eurosTerme = eurosSpot * (1 + (rBase / 100) * T);
    const dollarsTerme = eurosTerme * fCote;
    const reponse = r2(dollarsTerme - dette);
    const fauxBrut = r2(notionnel * (fCote - fTh));

    const en = langue === 'en';
    const { f, fix, pct, usd, eur } = formatters(langue);
    const horizon = libelleHorizon(T, en);
    return {
      enonce: en
        ? `Spot EUR/USD trades at ${fix(spot, 4)}, the ${horizon} dollar rate is ${pct(rCotee)} and the euro rate ${pct(rBase)} (simple linear rates). A market maker quotes the ${horizon} forward at ${fix(fCote, 4)}.\n\nYou borrow $1,000,000, sell them spot for euros, invest the euros, and sell the proceeds forward at the quoted rate.\n\n**What riskless profit, in dollars, does the strategy lock in per million dollars borrowed?**`
        : `Le spot EUR/USD cote ${fix(spot, 4)}, le taux dollar à ${horizon} vaut ${pct(rCotee)} et le taux euro ${pct(rBase)} (taux linéaires simples). Un teneur de marché cote le forward à ${horizon} à ${fix(fCote, 4)}.\n\nVous empruntez 1 000 000 $, les vendez au comptant contre euros, placez ces euros, et vendez le produit du placement à terme au cours coté.\n\n**Quel gain sans risque, en dollars, la stratégie verrouille-t-elle par million de dollars emprunté ?**`,
      reponse,
      tolerance: 5,
      toleranceMode: 'absolu',
      unite: '$',
      etapes: [
        {
          titre: en ? 'The arbitrage price first' : "D'abord le prix d'arbitrage",
          contenu: en
            ? `CIP gives the only forward compatible with no free money: $F_{th} = ${fix(spot, 4)} × \\dfrac{1 + ${f(rCotee)}\\,\\% × ${f(T)}}{1 + ${f(rBase)}\\,\\% × ${f(T)}} = ${fix(fThAff, 4)}$. The quote ${fix(fCote, 4)} sits **${f(ecartReel, 1)} pips above**: the euro sells forward too expensive — someone is paying more dollars per future euro than the money market justifies.`
            : `La CIP donne le seul forward compatible avec l'absence d'argent gratuit : $F_{th} = ${fix(spot, 4)} × \\dfrac{1 + ${f(rCotee)}\\,\\% × ${f(T)}}{1 + ${f(rBase)}\\,\\% × ${f(T)}} = ${fix(fThAff, 4)}$. La cote ${fix(fCote, 4)} se situe **${f(ecartReel, 1)} pips au-dessus** : l'euro se vend à terme trop cher — quelqu'un paie plus de dollars par euro futur que le marché monétaire ne le justifie.`,
        },
        {
          titre: en ? 'Build the machine (zero outlay)' : 'Monter la machine (zéro mise)',
          contenu: en
            ? `Borrow $${f(notionnel, 0)}$ \\$ at ${pct(rCotee)}: debt at maturity $= ${f(notionnel, 0)} × (1 + ${f(rCotee)}\\,\\% × ${f(T)}) = ${usd(r2(dette))}$. Sell the dollars spot: ${f(notionnel, 0)}/${fix(spot, 4)} = ${eur(r2(eurosSpot))}. Invest at ${pct(rBase)}: ${eur(r2(eurosTerme))} at maturity — and sell those euros forward TODAY at ${fix(fCote, 4)}. Every number is locked at inception: no market risk remains.`
            : `Empruntez $${f(notionnel, 0)}$ \\$ à ${pct(rCotee)} : dette à l'échéance $= ${f(notionnel, 0)} × (1 + ${f(rCotee)}\\,\\% × ${f(T)}) = ${usd(r2(dette))}$. Vendez les dollars au comptant : ${f(notionnel, 0)}/${fix(spot, 4)} = ${eur(r2(eurosSpot))}. Placez à ${pct(rBase)} : ${eur(r2(eurosTerme))} à l'échéance — et vendez ces euros à terme DÈS AUJOURD'HUI à ${fix(fCote, 4)}. Tous les nombres sont fixés au départ : aucun risque de marché ne subsiste.`,
        },
        {
          titre: en ? 'Unwind and count' : 'Dénouer et compter',
          contenu: en
            ? `At maturity: ${f(r2(eurosTerme))} € × ${fix(fCote, 4)} = ${usd(r2(dollarsTerme))} collected; ${usd(r2(dette))} repaid. Net: **${usd(reponse)}** per million borrowed, with no initial capital and no risk. Dozens of desks running the same trade is precisely what pushes the quoted forward back onto ${fix(fThAff, 4)} — the CIP price is the only one nobody can profit from.`
            : `À l'échéance : ${f(r2(eurosTerme))} € × ${fix(fCote, 4)} = ${usd(r2(dollarsTerme))} encaissés ; ${usd(r2(dette))} remboursés. Net : **${usd(reponse)}** par million emprunté, sans capital initial ni risque. Des dizaines de desks déroulant le même trade : voilà exactement ce qui ramène le forward coté sur ${fix(fThAff, 4)} — le prix CIP est le seul auquel personne ne gagne plus rien.`,
        },
      ],
      pieges: [
        en
          ? `Shortcutting with notional × pip gap: ${f(notionnel, 0)} × ${fix(r4(fCote - fTh), 4)} = ${usd(fauxBrut)} instead of ${usd(reponse)}. The mispricing is earned on the EUROS sold forward — $(1 + r_{base}T)/S$ per dollar borrowed — not on the raw million of dollars: walk the cash flows, never shortcut an arbitrage.`
          : `Court-circuiter par notionnel × écart en pips : ${f(notionnel, 0)} × ${fix(r4(fCote - fTh), 4)} = ${usd(fauxBrut)} au lieu de ${usd(reponse)}. L'écart se gagne sur les EUROS vendus à terme — $(1 + r_{base}T)/S$ par dollar emprunté —, pas sur le million de dollars brut : déroulez les flux, ne raccourcissez jamais un arbitrage.`,
        en
          ? 'Buying spot "and waiting for the rate to converge" is speculation, not arbitrage — nothing forces the spot anywhere. And if the quote had been BELOW the CIP price, everything flips: borrow the euros, invest the dollars, BUY the base forward. An arbitrage has no favourite side.'
          : "Acheter au comptant « en attendant que le cours converge » est de la spéculation, pas de l'arbitrage — rien n'oblige le spot à aller où que ce soit. Et si la cote avait été SOUS le prix CIP, tout s'inverse : emprunter les euros, placer les dollars, ACHETER la base à terme. Un arbitrage n'a pas de camp préféré.",
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 8. PPA : le test du Big Mac (N2)
// ---------------------------------------------------------------------------
export const genPpa: ExerciseGenerator = {
  id: 'm6-ex-08',
  moduleId: M6,
  titre: 'PPA : le test du Big Mac',
  titreEn: 'PPP: the Big Mac test',
  difficulte: 2,
  // Tirages (ordre strict) : 1. pEur = randFloat(4.2, 6.2, 2) · 2. ratio = randFloat(0.95, 1.35, 4)
  // · 3. ecartPct = randFloat(3, 15, 1) · 4. sens = pick([−1, 1]).
  // pUsd = r2(pEur × ratio) ; PPA = tauxPpa(pUsd, pEur) ; spot = r4(PPA × (1 + sens × ecart/100)) ;
  // réponse = surSousEvaluation(spot, PPA) ≈ sens × ecart (négatif ⇒ euro sous-évalué).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const pEur = randFloat(rng, 4.2, 6.2, 2);
    const ratio = randFloat(rng, 0.95, 1.35, 4);
    const ecartPct = randFloat(rng, 3, 15, 1);
    const sens = pick(rng, [-1, 1] as const);

    const pUsd = r2(pEur * ratio);
    const ppa = tauxPpa(pUsd, pEur);
    const ppaAff = r4(ppa);
    const spot = r4(ppa * (1 + (sens * ecartPct) / 100));
    const reponse = r2(surSousEvaluation(spot, ppa));
    const sousEvalue = reponse < 0;
    const fauxPpaInverse = r4(pEur / pUsd);
    const panierAuSpot = r2(pEur * spot);

    const en = langue === 'en';
    const { f, fix, usd, eur, sgn } = formatters(langue);
    return {
      enonce: en
        ? `The same Big Mac costs ${usd(pUsd)} in the United States and ${eur(pEur)} in the euro area. Spot EUR/USD trades at ${fix(spot, 4)}.\n\n**By how much is the euro over- or under-valued against PPP, in % (with its sign)?**`
        : `Le même Big Mac coûte ${usd(pUsd)} aux États-Unis et ${eur(pEur)} en zone euro. Le spot EUR/USD cote ${fix(spot, 4)}.\n\n**De combien l'euro est-il sur- ou sous-évalué par rapport à la PPA, en % (avec son signe) ?**`,
      reponse,
      tolerance: 0.05,
      toleranceMode: 'absolu',
      unite: '%',
      etapes: [
        {
          titre: en ? 'The PPP rate: one basket, two prices' : 'Le taux PPA : un panier, deux prix',
          contenu: en
            ? `The law of one price applied to the burger: the rate that equalises the two price tags is $\\text{PPP} = \\dfrac{P_{\\$}}{P_{€}} = \\dfrac{${f(pUsd)}}{${f(pEur)}} = ${fix(ppaAff, 4)}$ — homogeneous to a BASE/QUOTED price (dollars per euro), like the spot itself.`
            : `La loi du prix unique appliquée au hamburger : le taux qui égalise les deux étiquettes vaut $\\text{PPA} = \\dfrac{P_{\\$}}{P_{€}} = \\dfrac{${f(pUsd)}}{${f(pEur)}} = ${fix(ppaAff, 4)}$ — homogène à un cours BASE/COTÉE (des dollars par euro), comme le spot lui-même.`,
        },
        {
          titre: en ? 'The gap to parity' : "L'écart à la parité",
          contenu: en
            ? `$\\left(\\dfrac{S}{\\text{PPP}} - 1\\right) × 100 = \\left(\\dfrac{${fix(spot, 4)}}{${fix(ppaAff, 4)}} - 1\\right) × 100$ = **${sgn(reponse)} %**. The number measures the valuation of the BASE currency, the euro, against its parity.`
            : `$\\left(\\dfrac{S}{\\text{PPA}} - 1\\right) × 100 = \\left(\\dfrac{${fix(spot, 4)}}{${fix(ppaAff, 4)}} - 1\\right) × 100$ = **${sgn(reponse)} %**. Le chiffre mesure la valorisation de la devise de BASE, l'euro, par rapport à sa parité.`,
        },
        {
          titre: en ? 'State the DIRECTION — and verify it' : 'Énoncer le SENS — et le vérifier',
          contenu: en
            ? `${sousEvalue ? `Spot < PPP: one euro buys only ${fix(spot, 4)} $ where the basket would justify ${fix(ppaAff, 4)} — the euro is **under-valued** by ${f(Math.abs(reponse))}% (and the dollar, symmetrically, over-valued).` : `Spot > PPP: one euro buys ${fix(spot, 4)} $ where the basket only justifies ${fix(ppaAff, 4)} — the euro is **over-valued** by ${f(Math.abs(reponse))}% (and the dollar, symmetrically, under-valued).`} Cross-check with the basket: the European Big Mac converted at spot costs ${f(pEur)} × ${fix(spot, 4)} = ${usd(panierAuSpot)} vs ${usd(pUsd)} in the US — the ${sousEvalue ? 'cheaper' : 'pricier'} burger sits on the ${sousEvalue ? 'under' : 'over'}-valued side. PPP is a long-run compass (half-life of gaps: several years), nearly mute about next quarter.`
            : `${sousEvalue ? `Spot < PPA : 1 euro n'achète que ${fix(spot, 4)} $ là où le panier en justifierait ${fix(ppaAff, 4)} — l'euro est **sous-évalué** de ${f(Math.abs(reponse))} % (et le dollar, symétriquement, surévalué).` : `Spot > PPA : 1 euro achète ${fix(spot, 4)} $ là où le panier n'en justifie que ${fix(ppaAff, 4)} — l'euro est **surévalué** de ${f(Math.abs(reponse))} % (et le dollar, symétriquement, sous-évalué).`} Recoupez par le panier : le Big Mac européen converti au spot coûte ${f(pEur)} × ${fix(spot, 4)} = ${usd(panierAuSpot)} contre ${usd(pUsd)} aux États-Unis — le hamburger le ${sousEvalue ? 'moins cher' : 'plus cher'} est du côté de la devise ${sousEvalue ? 'sous' : 'sur'}-évaluée. La PPA est une boussole de long terme (demi-vie des écarts : plusieurs années), à peu près muette sur le trimestre qui vient.`,
        },
      ],
      pieges: [
        en
          ? `Flipping the conclusion ("the ${sousEvalue ? 'dollar' : 'euro'} is under-valued"): the sign of (S/PPP − 1) always reads on the BASE currency. Spot ${sousEvalue ? 'below' : 'above'} parity ⇒ base ${sousEvalue ? 'under' : 'over'}-valued — the direction is where exam papers die, not the division.`
          : `Inverser la conclusion (« le ${sousEvalue ? 'dollar' : "l'euro"} est sous-évalué ») : le signe de (S/PPA − 1) se lit toujours sur la devise de BASE. Spot ${sousEvalue ? 'sous' : 'au-dessus de'} la parité ⇒ base ${sousEvalue ? 'sous' : 'sur'}-évaluée — c'est sur le sens, pas sur la division, que les copies se perdent.`,
        en
          ? `Building the PPP upside down: ${f(pEur)}/${f(pUsd)} = ${fix(fauxPpaInverse, 4)} is euros per dollar — not comparable to an EUR/USD spot. Keep the parity homogeneous to the pair: quoted-currency price over base-currency price.`
          : `Construire la PPA à l'envers : ${f(pEur)}/${f(pUsd)} = ${fix(fauxPpaInverse, 4)} est en euros par dollar — incomparable à un spot EUR/USD. Gardez la parité homogène à la paire : prix en devise cotée sur prix en devise de base.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 9. P&L d'un carry trade (N2)
// ---------------------------------------------------------------------------
export const genCarryTrade: ExerciseGenerator = {
  id: 'm6-ex-09',
  moduleId: M6,
  titre: 'P&L d\'un carry trade',
  titreEn: 'Carry trade P&L',
  difficulte: 2,
  // Tirages (ordre strict) : 1. notionnelM = randInt(1, 10) · 2. rCible = randFloat(6, 11, 1)
  // · 3. rFin = randFloat(0.5, 3, 1) · 4. scenario = pick(['calme', 'crash']) · 5. un randFloat
  // selon le scénario : calme ⇒ variation = randFloat(−2, 3, 1) (P&L > 0 garanti, carry ≥ 3 pts) ;
  // crash ⇒ extra = randFloat(2, 8, 1) et variation = −r2(carry + extra) (P&L < 0 garanti).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const notionnelM = randInt(rng, 1, 10);
    const rCible = randFloat(rng, 6, 11, 1);
    const rFin = randFloat(rng, 0.5, 3, 1);
    const scenario = pick(rng, ['calme', 'crash'] as const);
    const carry = r2(rCible - rFin);
    const variation = scenario === 'calme' ? randFloat(rng, -2, 3, 1) : -r2(carry + randFloat(rng, 2, 8, 1));

    const notionnel = notionnelM * 1_000_000;
    const reponse = r2(pnlCarryTrade(notionnel, rCible, rFin, variation));
    const jambePortage = r2(notionnel * (carry / 100));
    const jambeChange = r2(notionnel * (variation / 100));
    const fauxSansFinancement = r2(notionnel * ((rCible + variation) / 100));
    const crash = scenario === 'crash';

    const en = langue === 'en';
    const { f, pct, sgn } = formatters(langue);
    const variationTexteFr = variation >= 0 ? `s'est appréciée de ${f(variation, 1)} %` : `s'est dépréciée de ${f(Math.abs(variation), 1)} %`;
    const variationTexteEn = variation >= 0 ? `appreciated by ${f(variation, 1)}%` : `depreciated by ${f(Math.abs(variation), 1)}%`;
    return {
      enonce: en
        ? `You run a one-year carry trade on a notional of $${f(notionnelM, 0)}m: you borrow the funding currency at ${pct(rFin, 1)} and invest in a high-yield currency at ${pct(rCible, 1)}. Over the year, the target currency ${variationTexteEn} against the funding currency.\n\n**What is the P&L of the trade, in dollars (with its sign)?**`
        : `Vous montez un carry trade à 1 an sur un notionnel de ${f(notionnelM, 0)} M$ : vous empruntez la devise de financement à ${pct(rFin, 1)} et placez dans une devise à haut rendement à ${pct(rCible, 1)}. Sur l'année, la devise cible ${variationTexteFr} contre la devise de financement.\n\n**Quel est le P&L de l'opération, en dollars (avec son signe) ?**`,
      reponse,
      tolerance: 0.005,
      unite: '$',
      etapes: [
        {
          titre: en ? 'The carry leg: the differential you pocket' : 'La jambe de portage : le différentiel empoché',
          contenu: en
            ? `Carry $= r_{\\text{target}} - r_{\\text{funding}} = ${f(rCible, 1)}\\,\\% - ${f(rFin, 1)}\\,\\% = ${f(carry, 1)}$ points: on $${f(notionnelM, 0)}$m that is $${f(notionnel, 0)} × ${f(carry, 1)}\\,\\% = ${sgn(jambePortage, 0)}$ \\$ — collected if nothing moves. This is the UIP failure being harvested: theory says the exchange rate should claw the differential back; history often lets you keep it.`
            : `Portage $= r_{\\text{cible}} - r_{\\text{fin}} = ${f(rCible, 1)}\\,\\% - ${f(rFin, 1)}\\,\\% = ${f(carry, 1)}$ points : sur ${f(notionnelM, 0)} M\\$, cela fait $${f(notionnel, 0)} × ${f(carry, 1)}\\,\\% = ${sgn(jambePortage, 0)}$ \\$ — encaissés si rien ne bouge. C'est l'échec de l'UIP qu'on moissonne : la théorie dit que le change devrait reprendre le différentiel ; l'histoire le laisse souvent dans la poche.`,
        },
        {
          titre: en ? 'The FX leg: the bill or the bonus' : 'La jambe de change : la facture ou le bonus',
          contenu: en
            ? `The target currency moved by ${sgn(variation, 1)}%: on the notional, $${f(notionnel, 0)} × ${sgn(variation, 1)}\\,\\% = ${sgn(jambeChange, 0)}$ \\$. ${variation >= 0 ? 'Here the FX adds to the carry — the "wrong-sign beta" years.' : 'Here the FX eats into the carry — the leg the calm years make you forget.'}`
            : `La devise cible a varié de ${sgn(variation, 1)} % : sur le notionnel, $${f(notionnel, 0)} × ${sgn(variation, 1)}\\,\\% = ${sgn(jambeChange, 0)}$ \\$. ${variation >= 0 ? 'Ici, le change s\'ajoute au portage — les années du « bêta du mauvais signe ».' : 'Ici, le change mord dans le portage — la jambe que les années calmes font oublier.'}`,
        },
        {
          titre: en ? 'Net it — and remember the steamroller' : 'Solder — et se rappeler le rouleau compresseur',
          contenu: en
            ? `P&L $= N × \\left(\\dfrac{r_{\\text{target}} - r_{\\text{funding}}}{100} + \\dfrac{\\Delta}{100}\\right) = ${sgn(jambePortage, 0)} ${jambeChange >= 0 ? '+' : '−'} ${f(Math.abs(jambeChange), 0)}$ = **${sgn(reponse, 0)} \\$**. ${crash ? `One bad year wipes out the equivalent of ${f(r2(Math.abs(reponse) / Math.max(jambePortage, 1)), 1)} year(s) of carry: picking up coins in front of the steamroller — 2008 and August 2024 ran exactly this script.` : 'A quiet year: the coins get picked up. The profile stays the same — many small regular gains, rare massive losses; the steamroller simply has not passed this year.'}`
            : `P&L $= N × \\left(\\dfrac{r_{\\text{cible}} - r_{\\text{fin}}}{100} + \\dfrac{\\Delta}{100}\\right) = ${sgn(jambePortage, 0)} ${jambeChange >= 0 ? '+' : '−'} ${f(Math.abs(jambeChange), 0)}$ = **${sgn(reponse, 0)} \\$**. ${crash ? `Une seule mauvaise année efface l'équivalent de ${f(r2(Math.abs(reponse) / Math.max(jambePortage, 1)), 1)} année(s) de portage : ramasser des pièces devant le rouleau compresseur — 2008 et août 2024 ont déroulé exactement ce scénario.` : 'Année calme : les pièces se ramassent. Le profil reste le même — beaucoup de petits gains réguliers, de rares pertes massives ; le rouleau compresseur n\'est simplement pas passé cette année.'}`,
        },
      ],
      pieges: [
        en
          ? `Forgetting the funding cost: ${f(notionnel, 0)} × (${f(rCible, 1)}% + Δ) = ${sgn(fauxSansFinancement, 0)} $ instead of ${sgn(reponse, 0)} $ — the borrowed leg charges ${pct(rFin, 1)} a year whatever happens; a carry trade is a SPREAD, not a deposit.`
          : `Oublier le coût de financement : ${f(notionnel, 0)} × (${f(rCible, 1)} % + Δ) = ${sgn(fauxSansFinancement, 0)} $ au lieu de ${sgn(reponse, 0)} $ — la jambe empruntée facture ${pct(rFin, 1)} par an quoi qu'il arrive ; un carry trade est un DIFFÉRENTIEL, pas un placement.`,
        en
          ? 'Selling the strategy on its quiet-year Sharpe ratio: carry returns have negative skewness and fat tails — the risk is not in the observed variance but in the rare jump that has not happened in your sample yet, and it strikes in risk-off, exactly when everything else bleeds too.'
          : "Vendre la stratégie sur son ratio de Sharpe des années calmes : les rendements du carry ont une skewness négative et des queues épaisses — le risque n'est pas dans la variance observée mais dans le saut rare qui n'a pas encore eu lieu dans l'échantillon, et il frappe en risk-off, exactement quand tout le reste saigne aussi.",
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 10. Forward de matière première par le portage (N2)
// ---------------------------------------------------------------------------
export const genForwardCommo: ExerciseGenerator = {
  id: 'm6-ex-10',
  moduleId: M6,
  titre: 'Forward de matière première par le portage',
  titreEn: 'Commodity forward via cost of carry',
  difficulte: 2,
  // Tirages (ordre strict) : 1. spot = randInt(45, 110) · 2. financement = randFloat(1.5, 6, 1)
  // · 3. stockage = randFloat(0.5, 4, 1) · 4. regime = pick(['contango', 'backwardation'])
  // · 5. un randFloat selon le régime : contango ⇒ convenience = randFloat(0, fin+stock−1.5, 1)
  // (portage net ≥ +1,5 pt) ; backwardation ⇒ convenience = randFloat(fin+stock+1.5, fin+stock+5, 1)
  // (portage net ≤ −1,5 pt) · 6. T = pick([0.5, 1]).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const spot = randInt(rng, 45, 110);
    const financement = randFloat(rng, 1.5, 6, 1);
    const stockage = randFloat(rng, 0.5, 4, 1);
    const regime = pick(rng, ['contango', 'backwardation'] as const);
    const convenience =
      regime === 'contango'
        ? randFloat(rng, 0, r2(financement + stockage - 1.5), 1)
        : randFloat(rng, r2(financement + stockage + 1.5), r2(financement + stockage + 5), 1);
    const T = pick(rng, [0.5, 1] as const);

    const portageNet = r2(financement + stockage - convenience);
    const reponse = r2(forwardCommodity(spot, financement, stockage, convenience, T));
    const fauxToutAdditionne = r2(forwardCommodity(spot, financement, stockage, -convenience, T));
    const enContango = regime === 'contango';

    const en = langue === 'en';
    const { f, usd, pct, sgn } = formatters(langue);
    const horizon = libelleHorizon(T, en);
    return {
      enonce: en
        ? `A barrel of crude trades at ${usd(spot, 0)} spot. Financing costs ${pct(financement, 1)} a year, storage ${pct(stockage, 1)} a year, and holders of the physical enjoy a convenience yield of ${pct(convenience, 1)} a year.\n\n**What is the ${horizon} forward price by cash and carry, in dollars?**`
        : `Le baril de brut cote ${usd(spot, 0)} au comptant. Le financement coûte ${pct(financement, 1)} par an, le stockage ${pct(stockage, 1)} par an, et la détention du physique procure un convenience yield de ${pct(convenience, 1)} par an.\n\n**Quel est le prix forward à ${horizon} par cash and carry, en dollars ?**`,
      reponse,
      tolerance: 0.002,
      unite: '$',
      etapes: [
        {
          titre: en ? 'Net out the cost of carry' : 'Solder le coût de portage',
          contenu: en
            ? `$c = \\text{financing} + \\text{storage} - \\text{convenience} = ${f(financement, 1)} + ${f(stockage, 1)} - ${f(convenience, 1)} = ${sgn(portageNet, 1)}\\,\\%$ a year. Financing and storage make the forward dearer; the convenience yield — the "availability dividend" of holding the physical (the refinery that never stops for lack of crude) — reduces it, exactly as a dividend reduces an equity's cost of carry.`
            : `$c = \\text{financement} + \\text{stockage} - \\text{convenience} = ${f(financement, 1)} + ${f(stockage, 1)} - ${f(convenience, 1)} = ${sgn(portageNet, 1)}\\,\\%$ par an. Financement et stockage renchérissent le terme ; le convenience yield — le « dividende de disponibilité » du détenteur du physique (la raffinerie qui ne s'arrête jamais faute de brut) — le réduit, exactement comme un dividende réduit le portage d'une action.`,
        },
        {
          titre: en ? 'Cash and carry: spot plus net carry' : 'Cash and carry : le spot plus le portage net',
          contenu: en
            ? `$F = S × \\left(1 + \\dfrac{c}{100} × T\\right) = ${f(spot, 0)} × \\left(1 + \\dfrac{${sgn(portageNet, 1)}}{100} × ${f(T)}\\right)$ = **${usd(reponse)}**. Same no-arbitrage logic as the FX forward: buy spot, finance, store, sell forward — F cannot durably stray from the full cost of that operation.`
            : `$F = S × \\left(1 + \\dfrac{c}{100} × T\\right) = ${f(spot, 0)} × \\left(1 + \\dfrac{${sgn(portageNet, 1)}}{100} × ${f(T)}\\right)$ = **${usd(reponse)}**. Même logique d'absence d'arbitrage que le forward de change : acheter comptant, financer, stocker, vendre à terme — F ne peut durablement s'écarter du coût complet de l'opération.`,
        },
        {
          titre: en ? (enContango ? 'Name the regime: contango' : 'Name the regime: backwardation') : enContango ? 'Nommer le régime : contango' : 'Nommer le régime : backwardation',
          contenu: en
            ? enContango
              ? `F = ${f(reponse)} > S = ${f(spot, 0)}: the curve rises — **contango**, the "normal" regime of a well-supplied market (comfortable stocks, nobody pays a premium for immediacy; gold lives there almost permanently). The curve prices the carry, it does NOT forecast the spot.`
              : `F = ${f(reponse)} < S = ${f(spot, 0)}: the curve falls — **backwardation**, the signature of a physically tight market (low stocks, fear of shortage: the availability dividend crushes the carrying costs). The curve prices that tension, it does NOT forecast the spot.`
            : enContango
              ? `F = ${f(reponse)} > S = ${f(spot, 0)} : la courbe monte — **contango**, le régime « normal » d'un marché bien approvisionné (stocks confortables, personne ne paie de prime pour l'immédiat ; l'or y vit quasi en permanence). La courbe cote le portage, elle ne PRÉDIT pas le spot.`
              : `F = ${f(reponse)} < S = ${f(spot, 0)} : la courbe descend — **backwardation**, la signature d'un marché physiquement tendu (stocks bas, peur de la rupture : le dividende de disponibilité écrase les coûts de portage). La courbe cote cette tension, elle ne PRÉDIT pas le spot.`,
        },
      ],
      pieges: [
        en
          ? `Adding all three costs: counting the convenience yield as a cost instead of subtracting it gives ${usd(fauxToutAdditionne)} instead of ${usd(reponse)}. The convenience yield is a BENEFIT of holding the physical — it always enters with a minus sign.`
          : `Tout additionner : compter le convenience yield comme un coût au lieu de le soustraire donne ${usd(fauxToutAdditionne)} au lieu de ${usd(reponse)}. Le convenience yield est un AVANTAGE de la détention du physique — il entre toujours avec un signe moins.`,
        en
          ? `Reading the slope as a forecast ("the curve ${enContango ? 'rises' : 'falls'}, so the market expects ${enContango ? 'higher' : 'lower'} oil"): the slope reflects carry and availability premium, nothing else — and the basis converges to zero at expiry whatever path the spot takes.`
          : `Lire la pente comme une prévision (« la courbe ${enContango ? 'monte' : 'descend'}, donc le marché attend un pétrole plus ${enContango ? 'cher' : 'bas'} ») : la pente reflète le portage et la prime de disponibilité, rien d'autre — et la base converge vers zéro à l'échéance quelle que soit la trajectoire du spot.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 11. Le roll yield : le tapis roulant (N3)
// ---------------------------------------------------------------------------
export const genRollYield: ExerciseGenerator = {
  id: 'm6-ex-11',
  moduleId: M6,
  titre: 'Le roll yield : le tapis roulant',
  titreEn: 'Roll yield: the conveyor belt',
  difficulte: 3,
  // Tirages (ordre strict) : 1. proche = randFloat(50, 100, 2) · 2. regime = pick(['contango',
  // 'backwardation']) · 3. ecartPct = randFloat(1.5, 6, 1) · 4. deltaT = pick([0.25, 0.5]).
  // lointain = r2(proche × (1 ± ecart/100)) : plus cher en contango, moins cher en backwardation.
  // Réponse via rollYieldAnnualise(proche, lointain, deltaT) ; perRoll = réponse × deltaT.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const proche = randFloat(rng, 50, 100, 2);
    const regime = pick(rng, ['contango', 'backwardation'] as const);
    const ecartPct = randFloat(rng, 1.5, 6, 1);
    const deltaT = pick(rng, [0.25, 0.5] as const);

    const enContango = regime === 'contango';
    const lointain = r2(proche * (1 + ((enContango ? 1 : -1) * ecartPct) / 100));
    const ryExact = rollYieldAnnualise(proche, lointain, deltaT);
    const reponse = r2(ryExact);
    const perRoll = r2(ryExact * deltaT);
    const fauxInverse = r2(rollYieldAnnualise(lointain, proche, deltaT));
    const mois = Math.round(deltaT * 12);

    const en = langue === 'en';
    const { f, usd, sgn } = formatters(langue);
    return {
      enonce: en
        ? `A long futures position must be rolled every ${mois} months: the expiring contract trades at ${usd(proche)} and the next one, ${mois} months further out, at ${usd(lointain)}.\n\n**What is the annualised roll yield, in % (with its sign)?**`
        : `Une position longue en futures doit être roulée tous les ${mois} mois : le contrat qui expire cote ${usd(proche)} et le suivant, à ${mois} mois de là, ${usd(lointain)}.\n\n**Quel est le roll yield annualisé, en % (avec son signe) ?**`,
      reponse,
      tolerance: 0.005,
      unite: '%',
      etapes: [
        {
          titre: en ? 'The roll gesture: sell the near, buy the far' : 'Le geste du roll : vendre le proche, racheter le lointain',
          contenu: en
            ? `To stay long, the fund SELLS the expiring contract at ${usd(proche)} and BUYS the next at ${usd(lointain)}. Per roll: $\\left(\\dfrac{F_{\\text{near}}}{F_{\\text{far}}} - 1\\right) × 100 = \\left(\\dfrac{${f(proche)}}{${f(lointain)}} - 1\\right) × 100 = ${sgn(perRoll)}\\,\\%$ — ${enContango ? 'it sells cheap and buys back dear: the slope is paid at every roll.' : 'it sells dear and buys back cheap: the slope is pocketed at every roll.'}`
            : `Pour rester long, le fonds VEND le contrat qui expire à ${usd(proche)} et RACHÈTE le suivant à ${usd(lointain)}. Par roll : $\\left(\\dfrac{F_{\\text{proche}}}{F_{\\text{lointain}}} - 1\\right) × 100 = \\left(\\dfrac{${f(proche)}}{${f(lointain)}} - 1\\right) × 100 = ${sgn(perRoll)}\\,\\%$ — ${enContango ? 'il vend bas et rachète haut : la pente se paie à chaque roll.' : 'il vend haut et rachète bas : la pente s\'encaisse à chaque roll.'}`,
        },
        {
          titre: en ? 'Annualise the friction' : 'Annualiser la friction',
          contenu: en
            ? `The ${sgn(perRoll)}% recurs every ${mois} months, i.e. ${f(1 / deltaT, 0)} times a year: $\\dfrac{${sgn(perRoll)}\\,\\%}{${f(deltaT)}}$ = **${sgn(reponse)} % a year**. This is the pace at which the position ${enContango ? 'erodes' : 'earns'} with the spot UNCHANGED.`
            : `Les ${sgn(perRoll)} % se répètent tous les ${mois} mois, soit ${f(1 / deltaT, 0)} fois par an : $\\dfrac{${sgn(perRoll)}\\,\\%}{${f(deltaT)}}$ = **${sgn(reponse)} % par an**. C'est le rythme auquel la position ${enContango ? 's\'érode' : 'gagne'} à spot INCHANGÉ.`,
        },
        {
          titre: en ? 'Interpret the sign' : 'Interpréter le signe',
          contenu: en
            ? enContango
              ? `Negative roll yield = **contango** (near < far): the long walks up a conveyor belt running the wrong way — the structural erosion of retail commodity trackers (USO in April 2020 being the textbook disaster: forced to roll into a super-contango). The spot can be flat while the tracker bleeds ${f(Math.abs(reponse))}% a year.`
              : `Positive roll yield = **backwardation** (near > far): the conveyor belt now runs in the long's favour — this is how specialised funds earn a living on markets that "don't go up": the performance comes from the slope, not from the spot.`
            : enContango
              ? `Roll yield négatif = **contango** (proche < lointain) : le long remonte un tapis roulant pris à l'envers — l'érosion structurelle des trackers matières premières grand public (USO en avril 2020, contraint de roller dans un super-contango, en est le cas d'école). Le spot peut faire du surplace pendant que le tracker perd ${f(Math.abs(reponse))} % par an.`
              : `Roll yield positif = **backwardation** (proche > lointain) : le tapis roulant tourne désormais dans le sens du long — c'est ainsi que des fonds spécialisés gagnent leur vie sur des marchés qui « ne montent pas » : la performance vient de la pente, pas du spot.`,
        },
      ],
      pieges: [
        en
          ? `Flipping the ratio (far over near): ${sgn(fauxInverse)}% instead of ${sgn(reponse)}% — sign reversed. Anchor on the GESTURE: the long sells the near and buys the far, so the near goes to the numerator.`
          : `Inverser le ratio (lointain sur proche) : ${sgn(fauxInverse)} % au lieu de ${sgn(reponse)} % — signe retourné. Ancrez-vous sur le GESTE : le long vend le proche et rachète le lointain, donc le proche va au numérateur.`,
        en
          ? `Stopping at ${sgn(perRoll)}% per roll: the question asks for an ANNUALISED figure — the friction recurs at every expiry (${f(1 / deltaT, 0)}× a year). And remember: "the barrel did +20%, my ETF +6%" is not theft, it is spot return PLUS roll yield.`
          : `S'arrêter aux ${sgn(perRoll)} % par roll : la question demande un chiffre ANNUALISÉ — la friction se répète à chaque échéance (${f(1 / deltaT, 0)} fois par an). Et retenez : « le baril a fait +20 %, mon ETF +6 % » n'est pas un vol, c'est spot PLUS roll yield.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 12. La base et sa convergence (N2)
// ---------------------------------------------------------------------------
export const genBaseConvergence: ExerciseGenerator = {
  id: 'm6-ex-12',
  moduleId: M6,
  titre: 'La base et sa convergence',
  titreEn: 'The basis and its convergence',
  difficulte: 2,
  // Tirages (ordre strict) : 1. spot = randFloat(55, 95, 2) · 2. regime = pick(['contango',
  // 'backwardation']) · 3. ecartAbs = randFloat(0.8, 6, 2) · 4. echeanceMois = pick([1, 2, 3, 6]).
  // futures = r2(spot ± ecartAbs) : plus cher en contango (base < 0), moins cher en backwardation
  // (base > 0). Réponse via baseFutures(spot, futures).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const spot = randFloat(rng, 55, 95, 2);
    const regime = pick(rng, ['contango', 'backwardation'] as const);
    const ecartAbs = randFloat(rng, 0.8, 6, 2);
    const echeanceMois = pick(rng, [1, 2, 3, 6] as const);

    const enContango = regime === 'contango';
    const futures = r2(spot + (enContango ? 1 : -1) * ecartAbs);
    const reponse = r2(baseFutures(spot, futures));
    const fauxSigne = r2(-reponse);

    const en = langue === 'en';
    const { f, usd, sgn } = formatters(langue);
    return {
      enonce: en
        ? `Spot crude trades at ${usd(spot)} while the futures contract expiring in ${echeanceMois} month${echeanceMois > 1 ? 's' : ''} trades at ${usd(futures)}.\n\n**What is the basis, in dollars (with its sign)?**`
        : `Le brut au comptant cote ${usd(spot)} tandis que le contrat futures qui expire dans ${echeanceMois} mois cote ${usd(futures)}.\n\n**Que vaut la base, en dollars (avec son signe) ?**`,
      reponse,
      tolerance: 0.01,
      toleranceMode: 'absolu',
      unite: '$',
      etapes: [
        {
          titre: en ? 'The basis: spot MINUS futures' : 'La base : le spot MOINS le futures',
          contenu: en
            ? `$\\text{Basis} = S - F = ${f(spot)} - ${f(futures)}$ = **${sgn(reponse)} $**. The order is a convention, but it is THE convention: spot first, futures subtracted.`
            : `$\\text{Base} = S - F = ${f(spot)} - ${f(futures)}$ = **${sgn(reponse)} $**. L'ordre est une convention, mais c'est LA convention : le spot d'abord, le futures en soustraction.`,
        },
        {
          titre: en ? 'Read the sign as a diagnosis' : 'Lire le signe comme un diagnostic',
          contenu: en
            ? enContango
              ? `Negative basis (F > S): **contango** — a well-supplied market where the term simply quotes the spot plus the cost of carrying it. The deferred price is dearer because storing and financing until then costs money.`
              : `Positive basis (F < S): **backwardation** — a tight physical market where having the barrel NOW commands a premium over the promise of a barrel later: low stocks, dominant convenience yield. Desks read the front of the crude curve as a real-time stocks gauge.`
            : enContango
              ? `Base négative (F > S) : **contango** — un marché bien approvisionné où le terme cote simplement le spot plus le coût de le porter jusque-là. L'échéance se paie plus cher parce que stocker et financer d'ici là coûte.`
              : `Base positive (F < S) : **backwardation** — un marché physique tendu où avoir le baril MAINTENANT vaut une prime sur la promesse d'un baril plus tard : stocks bas, convenience yield dominant. Les desks lisent le début de la courbe du brut comme une jauge de stocks en temps réel.`,
        },
        {
          titre: en ? 'Convergence: the basis dies at expiry' : "La convergence : la base meurt à l'échéance",
          contenu: en
            ? `In ${echeanceMois} month${echeanceMois > 1 ? 's' : ''}, the expiring futures BECOMES spot: F → S and the basis goes mechanically to zero, whatever the spot does meanwhile. Today's ${sgn(reponse)} $ must melt away by expiry — that convergence is what anchors a hedger's protection (his only residual exposure is the basis moving before he unwinds: basis risk).`
            : `Dans ${echeanceMois} mois, le futures qui expire DEVIENT du spot : F → S et la base tend mécaniquement vers zéro, quoi que fasse le spot entre-temps. Les ${sgn(reponse)} $ d'aujourd'hui doivent fondre d'ici l'échéance — cette convergence est ce qui ancre la protection du hedger (sa seule exposition résiduelle est le mouvement de la base avant le débouclage : le risque de base).`,
        },
      ],
      pieges: [
        en
          ? `Computing F − S: ${sgn(fauxSigne)} $ — right magnitude, wrong sign, opposite diagnosis (you would call ${enContango ? 'this contango a backwardation' : 'this backwardation a contango'}). The basis is always spot minus futures.`
          : `Calculer F − S : ${sgn(fauxSigne)} $ — bonne grandeur, signe inversé, diagnostic contraire (vous appelleriez ${enContango ? 'ce contango une backwardation' : 'cette backwardation un contango'}). La base est toujours le spot moins le futures.`,
        en
          ? 'Reading the basis as a forecast ("the futures is below spot, so the market sees oil falling"): the basis prices carry and availability, not a trajectory — and it converges to zero at expiry regardless of where the spot goes.'
          : "Lire la base comme une prévision (« le futures est sous le spot, donc le marché voit le pétrole baisser ») : la base cote le portage et la disponibilité, pas une trajectoire — et elle converge vers zéro à l'échéance, où que le spot aille.",
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 13. Annualiser un actif sans flux (N2)
// ---------------------------------------------------------------------------
export const genCagrSansFlux: ExerciseGenerator = {
  id: 'm6-ex-13',
  moduleId: M6,
  titre: 'Annualiser un actif sans flux',
  titreEn: 'Annualising a no-cash-flow asset',
  difficulte: 2,
  // Tirages (ordre strict) : 1. actif = pick(['or', 'bitcoin']) · 2. annees = pick([2, 3, 4, 5])
  // · 3. un randInt selon l'actif : or ⇒ debut = randInt(1200, 2300) ($/once) ; bitcoin ⇒
  // debut = randInt(15, 70) × 1000 · 4. un randFloat selon l'actif : cagrCible = randFloat(3, 14, 1)
  // (or) ou randFloat(8, 35, 1) (bitcoin). fin = round(debut × (1 + cagr/100)^annees) ;
  // réponse via variationAnnualiseePct(debut, fin, annees).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const actif = pick(rng, ['or', 'bitcoin'] as const);
    const annees = pick(rng, [2, 3, 4, 5] as const);
    const estOr = actif === 'or';
    const debut = estOr ? randInt(rng, 1200, 2300) : randInt(rng, 15, 70) * 1000;
    const cagrCible = estOr ? randFloat(rng, 3, 14, 1) : randFloat(rng, 8, 35, 1);

    const fin = Math.round(debut * (1 + cagrCible / 100) ** annees);
    const reponse = r2(variationAnnualiseePct(debut, fin, annees));
    const totalPct = r2((fin / debut - 1) * 100);
    const fauxArith = r2(totalPct / annees);
    const ratio = fin / debut;

    const en = langue === 'en';
    const { f, usd, pct } = formatters(langue);
    const nomFr = estOr ? "l'once d'or" : 'le bitcoin';
    const nomEn = estOr ? 'an ounce of gold' : 'one bitcoin';
    return {
      enonce: en
        ? `${annees} years ago, ${nomEn} traded at ${usd(debut, 0)}; it now trades at ${usd(fin, 0)}. The asset paid no coupon and no dividend over the period.\n\n**What is the annualised (compound) return, in % per year?**`
        : `Il y a ${annees} ans, ${nomFr} cotait ${usd(debut, 0)} ; ${estOr ? 'elle' : 'il'} cote aujourd'hui ${usd(fin, 0)}. L'actif n'a versé ni coupon ni dividende sur la période.\n\n**Quel est le rendement annualisé (composé), en % par an ?**`,
      reponse,
      tolerance: 0.005,
      unite: '%',
      etapes: [
        {
          titre: en ? 'Total change first' : "D'abord la variation totale",
          contenu: en
            ? `$\\dfrac{${f(fin, 0)}}{${f(debut, 0)}} = ${f(ratio, 4)}$, i.e. ${pct(totalPct)} over ${annees} years. With no coupon and no dividend, the price IS the whole performance — nothing else to add, unlike an equity or a bond.`
            : `$\\dfrac{${f(fin, 0)}}{${f(debut, 0)}} = ${f(ratio, 4)}$, soit ${pct(totalPct)} sur ${annees} ans. Sans coupon ni dividende, le prix EST toute la performance — rien d'autre à ajouter, contrairement à une action ou une obligation.`,
        },
        {
          titre: en ? 'Annualise the COMPOUND way' : 'Annualiser en COMPOSÉ',
          contenu: en
            ? `$\\left(\\dfrac{${f(fin, 0)}}{${f(debut, 0)}}\\right)^{1/${annees}} - 1 = ${f(ratio, 4)}^{${f(1 / annees, 2)}} - 1$ = **${pct(reponse)} a year**. This is the CAGR: the single steady rate that, compounded ${annees} times, exactly reproduces the journey from ${usd(debut, 0)} to ${usd(fin, 0)}.`
            : `$\\left(\\dfrac{${f(fin, 0)}}{${f(debut, 0)}}\\right)^{1/${annees}} - 1 = ${f(ratio, 4)}^{${f(1 / annees, 2)}} - 1$ = **${pct(reponse)} par an**. C'est le CAGR : l'unique taux régulier qui, composé ${annees} fois, reproduit exactement le trajet de ${usd(debut, 0)} à ${usd(fin, 0)}.`,
        },
        {
          titre: en ? 'Why the arithmetic shortcut lies' : 'Pourquoi le raccourci arithmétique ment',
          contenu: en
            ? `${pct(totalPct)}/${annees} = ${pct(fauxArith)} — always ABOVE the true ${pct(reponse)}, because it ignores compounding (each year grows on the previous year's base). ${estOr ? 'For gold, honesty also requires netting off storage and insurance costs: a no-cash-flow asset has carry costs, not carry income.' : 'For bitcoin, the smooth CAGR hides violently jagged paths: same start, same end, very different journeys — an annualised figure says nothing about the drawdowns in between.'}`
            : `${pct(totalPct)}/${annees} = ${pct(fauxArith)} — toujours AU-DESSUS du vrai ${pct(reponse)}, parce qu'il ignore la composition (chaque année croît sur la base de la précédente). ${estOr ? "Pour l'or, l'honnêteté impose aussi de retrancher stockage et assurance : un actif sans flux a des coûts de portage, pas des revenus de portage." : 'Pour le bitcoin, le CAGR lisse des trajectoires violemment heurtées : même départ, même arrivée, voyages très différents — un chiffre annualisé ne dit rien des drawdowns intermédiaires.'}`,
        },
      ],
      pieges: [
        en
          ? `Dividing the total change by the years: ${pct(fauxArith)} instead of ${pct(reponse)} — the arithmetic mean systematically overstates a compound return; the gap widens with the horizon and the size of the move.`
          : `Diviser la variation totale par les années : ${pct(fauxArith)} au lieu de ${pct(reponse)} — la moyenne arithmétique surestime systématiquement un rendement composé ; l'écart grandit avec l'horizon et l'ampleur du mouvement.`,
        en
          ? `Treating the past CAGR as a promised rate: a bond's yield is contractual, ${estOr ? "gold's" : "bitcoin's"} ${pct(reponse)} is purely retrospective — with no cash flow to anchor a valuation, nothing guarantees the next ${annees} years repeat the last ${annees}.`
          : `Prendre le CAGR passé pour un taux promis : le rendement d'une obligation est contractuel, les ${pct(reponse)} ${estOr ? "de l'or" : 'du bitcoin'} sont purement rétrospectifs — sans flux pour ancrer une valorisation, rien ne garantit que les ${annees} prochaines années répètent les ${annees} dernières.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 14. Couverture de l'exportateur (N3)
// ---------------------------------------------------------------------------
export const genCouvertureExport: ExerciseGenerator = {
  id: 'm6-ex-14',
  moduleId: M6,
  titre: 'Couverture de l\'exportateur',
  titreEn: 'The exporter\'s hedge',
  difficulte: 3,
  // Tirages (ordre strict) : 1. montantM = randInt(2, 20) · 2. spot = randFloat(1.02, 1.22, 4)
  // · 3. rEur = randFloat(2.5, 4.5, 2) · 4. gap = randFloat(0.5, 2.5, 2) · 5. sensTaux = pick([1, −1])
  // · 6. T = pick([0.25, 0.5, 0.75, 1]) · 7. haussePct = randFloat(6, 14, 1).
  // rUsd = r2(rEur + sensTaux × gap) ∈ [0, 7] ; F = forwardFx(spot, rUsd, rEur, T) — |F/S − 1| ≤ 2,5 % × T ;
  // spotFinal = r4(spot × (1 + hausse/100)) > F (euro plus fort : scénario défavorable garanti).
  // Réponse = montantUsd / F (les dollars se DIVISENT par le cours).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const montantM = randInt(rng, 2, 20);
    const spot = randFloat(rng, 1.02, 1.22, 4);
    const rEur = randFloat(rng, 2.5, 4.5, 2);
    const gap = randFloat(rng, 0.5, 2.5, 2);
    const sensTaux = pick(rng, [1, -1] as const);
    const T = pick(rng, [0.25, 0.5, 0.75, 1] as const);
    const haussePct = randFloat(rng, 6, 14, 1);

    const rUsd = r2(rEur + sensTaux * gap);
    const montantUsd = montantM * 1_000_000;
    const fExact = forwardFx(spot, rUsd, rEur, T);
    const fAff = r4(fExact);
    const spotFinal = r4(spot * (1 + haussePct / 100));
    const reponse = r2(montantUsd / fExact);
    const nonCouvert = r2(montantUsd / spotFinal);
    const gainCouverture = r2(reponse - nonCouvert);
    const fauxMult = r2(montantUsd * fExact);
    const enReport = fExact > spot;

    const en = langue === 'en';
    const { f, fix, eur, usd, pct } = formatters(langue);
    const horizon = libelleHorizon(T, en);
    return {
      enonce: en
        ? `A European exporter has just signed a contract worth ${usd(montantUsd, 0)}, payable in ${horizon}. Spot EUR/USD trades at ${fix(spot, 4)}, the ${horizon} dollar rate is ${pct(rUsd)} and the euro rate ${pct(rEur)} (simple linear rates). Its bank offers to buy the dollars forward at the covered-parity rate.\n\n**How many euros does the forward sale lock in?** (The walkthrough compares with an unhedged scenario where EUR/USD ends at ${fix(spotFinal, 4)}.)`
        : `Un exportateur européen vient de signer un contrat de ${usd(montantUsd, 0)}, payables dans ${horizon}. Le spot EUR/USD cote ${fix(spot, 4)}, le taux dollar à ${horizon} vaut ${pct(rUsd)} et le taux euro ${pct(rEur)} (taux linéaires simples). Sa banque lui propose de racheter ses dollars à terme au cours de parité couverte.\n\n**Combien d'euros la vente à terme verrouille-t-elle ?** (Le corrigé compare avec un scénario sans couverture où EUR/USD finit à ${fix(spotFinal, 4)}.)`,
      reponse,
      tolerance: 0.005,
      unite: '€',
      etapes: [
        {
          titre: en ? 'Price the forward — CIP, no forecast' : 'Coter le forward — CIP, zéro prévision',
          contenu: en
            ? `$F = S × \\dfrac{1 + r_{\\text{quoted}}\\,T}{1 + r_{\\text{base}}\\,T} = ${fix(spot, 4)} × \\dfrac{1 + ${f(rUsd)}\\,\\% × ${f(T)}}{1 + ${f(rEur)}\\,\\% × ${f(T)}} = ${fix(fAff, 4)}$ — the euro forward in ${enReport ? 'premium' : 'discount'} (the ${enReport ? 'dollar' : 'euro'} pays more). The exporter's margin was computed at signature; every day unhedged leaves it hostage to the rate.`
            : `$F = S × \\dfrac{1 + r_{\\text{cotée}}\\,T}{1 + r_{\\text{base}}\\,T} = ${fix(spot, 4)} × \\dfrac{1 + ${f(rUsd)}\\,\\% × ${f(T)}}{1 + ${f(rEur)}\\,\\% × ${f(T)}} = ${fix(fAff, 4)}$ — l'euro à terme en ${enReport ? 'report' : 'déport'} (le ${enReport ? 'dollar' : "l'euro"} rémunère plus). La marge de l'exportateur a été calculée à la signature ; chaque jour sans couverture la laisse en otage du cours.`,
        },
        {
          titre: en ? 'Lock in the euros: divide' : 'Verrouiller les euros : diviser',
          contenu: en
            ? `Selling the dollars forward converts them at ${fix(fAff, 4)}: $\\dfrac{${f(montantUsd, 0)}}{${fix(fAff, 4)}}$ = **${eur(reponse)}**, fixed today for ${horizon} ahead. Dollars DIVIDE by the rate (the price of one euro in dollars) — the same direction reflex as exercise 1, now with real money on the line.`
            : `Vendre les dollars à terme les convertit à ${fix(fAff, 4)} : $\\dfrac{${f(montantUsd, 0)}}{${fix(fAff, 4)}}$ = **${eur(reponse)}**, figés aujourd'hui pour dans ${horizon}. Les dollars se DIVISENT par le cours (le prix d'un euro en dollars) — le même réflexe de sens qu'à l'exercice 1, avec cette fois la marge en jeu.`,
        },
        {
          titre: en ? 'The scenario that pays for the hedge' : 'Le scénario qui paie la couverture',
          contenu: en
            ? `Suppose the euro strengthens ${pct(haussePct, 1)} and EUR/USD ends at ${fix(spotFinal, 4)}. Unhedged, the dollars would only fetch ${f(montantUsd, 0)}/${fix(spotFinal, 4)} = ${eur(nonCouvert)} — i.e. **${eur(gainCouverture)} less** than the locked amount, often the entire operating margin. And had the euro weakened instead, the forward would still apply: a forward is a firm commitment, not an option — the exporter hedges a margin, he does not speculate.`
            : `Supposez que l'euro se renforce de ${pct(haussePct, 1)} et qu'EUR/USD finisse à ${fix(spotFinal, 4)}. Sans couverture, les dollars ne vaudraient plus que ${f(montantUsd, 0)}/${fix(spotFinal, 4)} = ${eur(nonCouvert)} — soit **${eur(gainCouverture)} de moins** que le montant verrouillé, souvent la marge d'exploitation entière. Et si l'euro avait baissé, le forward s'appliquerait quand même : un forward est un engagement ferme, pas une option — l'exportateur couvre une marge, il ne spécule pas.`,
        },
      ],
      pieges: [
        en
          ? `Multiplying by the forward: ${f(montantUsd, 0)} × ${fix(fAff, 4)} = ${eur(fauxMult, 0)} — dimensionally absurd (dollars × dollars-per-euro). Dollars convert to euros by DIVISION; getting the direction wrong on a real invoice does not cost points, it costs the margin.`
          : `Multiplier par le forward : ${f(montantUsd, 0)} × ${fix(fAff, 4)} = ${eur(fauxMult, 0)} — dimensionnellement absurde (des dollars × des dollars-par-euro). Des dollars se convertissent en euros par DIVISION ; se tromper de sens sur une vraie facture ne coûte pas des points, mais la marge.`,
        en
          ? `Judging the hedge after the fact: if the spot had ended below ${fix(fAff, 4)}, the unhedged route would have beaten the forward — and the treasurer would still have been right to hedge. The objective was a locked margin, not a winning bet: a hedge is judged at inception, against the risk, never against the realised path.`
          : `Juger la couverture après coup : si le spot avait fini sous ${fix(fAff, 4)}, la route non couverte aurait battu le forward — et le trésorier aurait quand même eu raison de couvrir. L'objectif était une marge verrouillée, pas un pari gagnant : une couverture se juge au départ, face au risque, jamais sur la trajectoire réalisée.`,
      ],
    };
  },
};

export const exercices: ExerciseGenerator[] = [
  genLectureCotation,
  genVariationPips,
  genCoutSpread,
  genCoursCroise,
  genForwardCip,
  genPointsTerme,
  genArbitrageCip,
  genPpa,
  genCarryTrade,
  genForwardCommo,
  genRollYield,
  genBaseConvergence,
  genCagrSansFlux,
  genCouvertureExport,
];
