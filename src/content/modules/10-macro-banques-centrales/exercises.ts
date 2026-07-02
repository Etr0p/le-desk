/**
 * Les 12 générateurs d'exercices d'application du module Macro & banques
 * centrales — module de CULTURE à socle quantitatif : chaque exercice chiffre
 * une idée du cours (Fisher, Taylor, érosion, effets de base, sigmas, futures,
 * duration), jamais une virtuosité calculatoire.
 *
 * BILINGUES : generate(seed, langue = 'fr'). Invariant absolu : TOUS les tirages
 * aléatoires sont effectués AVANT toute branche de langue — un même seed produit
 * exactement les mêmes nombres, la même réponse et la même tolérance en français
 * et en anglais. Seuls les textes (énoncé, étapes, pièges) changent.
 *
 * Tous les calculs passent par calculs.ts (aucune formule recopiée). Conventions
 * du module (en-tête de calculs.ts) : composition DISCRÈTE annuelle (1 + x)^n —
 * celle des indices de prix et des taux directeurs, PAS le continu du m8/m9 ;
 * taux et inflations en % ; pas de politique monétaire en POINTS DE BASE
 * (100 pb = 1 %) ; surprise d'indicateur SANS UNITÉ (en sigmas). Seule exception
 * documentée : la probabilité implicite d'une hausse depuis un future (ex-10)
 * est une interpolation à trois soustractions — prix = 100 − taux — qui n'a pas
 * de fonction dédiée dans calculs.ts, conformément au chapitre 6. Les pièges
 * martelés ici : l'approximation de Fisher (i − π) et son terme croisé, le
 * nominal qui ne dit jamais si une politique est restrictive, l'addition de
 * taux qui devrait être une composition (×12 contre (1 + m)^12), le chiffre
 * publié qui ne bouge rien quand il était dans les prix, la chute de glissement
 * annuel qui n'est qu'un anniversaire de choc, les pb confondus avec des %.
 * L'ordre des tirages de chaque moule est documenté dans son commentaire
 * « Tirages (ordre strict) ».
 */
import { formatNombreLangue } from '../../../engine/answers';
import { mulberry32, pick, randFloat, randInt } from '../../../engine/rng';
import type { ExerciseGenerator, Langue } from '../../../engine/types';
import {
  indiceDesPrix,
  inflationAnnualiseeDepuisMensuelle,
  interetsComposesInflation,
  regleDeTaylor,
  surpriseIndicateur,
  tauxNominalRequis,
  tauxReelApproche,
  tauxReelFisher,
  tauxTerminalAnticipe,
  variationPrixObligationDuration,
} from './calculs';

const M10 = '10-macro-banques-centrales';

const r2 = (v: number) => Math.round(v * 100) / 100;

/** Formateurs dépendants de la langue : nombre, euros, pourcentage, nombre signé. */
function formatters(langue: Langue) {
  const f = (v: number, d = 2) => formatNombreLangue(langue, v, d);
  const eur = (v: number, d = 2) => (langue === 'en' ? `€${f(v, d)}` : `${f(v, d)} €`);
  const pct = (v: number, d = 2) => (langue === 'en' ? `${f(v, d)}%` : `${f(v, d)} %`);
  /** Nombre signé (+2,50 / −5,09), pour afficher des variations ou des surprises. */
  const sgn = (v: number, d = 2) => (v > 0 ? `+${f(v, d)}` : f(v, d));
  return { f, eur, pct, sgn };
}

// ---------------------------------------------------------------------------
// 1. Le taux réel de Fisher (N1)
// ---------------------------------------------------------------------------
export const genTauxReelFisher: ExerciseGenerator = {
  id: 'm10-ex-01',
  moduleId: M10,
  titre: 'Le taux réel de Fisher',
  titreEn: 'The Fisher real rate',
  difficulte: 1,
  // Tirages (ordre strict) : 1. scenario = pick(['epargne', 'repression'])
  // · 2. iHaut = randFloat(4.5, 9, 1) · 3. piBas = randFloat(1.5, 3, 1)
  // · 4. iBas = randFloat(1, 3.5, 1) · 5. piHaut = randFloat(4.5, 9, 1).
  // 'epargne' : i = iHaut, π = piBas (réel positif) ; 'repression' : i = iBas,
  // π = piHaut (réel négatif). Les bornes garantissent |i − π| ≥ 1 : l'écart de
  // l'approximation i − π reste supérieur à la tolérance (0,02 absolu), qui la
  // rejette donc toujours — l'écart est chiffré en pb dans le corrigé.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const scenario = pick(rng, ['epargne', 'repression'] as const);
    const iHaut = randFloat(rng, 4.5, 9, 1);
    const piBas = randFloat(rng, 1.5, 3, 1);
    const iBas = randFloat(rng, 1, 3.5, 1);
    const piHaut = randFloat(rng, 4.5, 9, 1);

    const estRepression = scenario === 'repression';
    const i = estRepression ? iBas : iHaut;
    const piVal = estRepression ? piHaut : piBas;
    const exact = tauxReelFisher(i, piVal);
    const reponse = r2(exact);
    const approx = r2(tauxReelApproche(i, piVal));
    const ecartPb = r2(Math.abs(tauxReelApproche(i, piVal) - exact) * 100);

    const en = langue === 'en';
    const { f, pct, sgn } = formatters(langue);
    return {
      enonce: en
        ? estRepression
          ? `A savings account pays a nominal rate of ${pct(i, 1)} per year while inflation runs at ${pct(piVal, 1)}.\n\n**What is the exact real rate of this savings account, in % (sign included)?**`
          : `A bond investment pays a nominal rate of ${pct(i, 1)} per year while inflation runs at ${pct(piVal, 1)}.\n\n**What is the exact real rate of this investment, in % (sign included)?**`
        : estRepression
          ? `Un livret d'épargne sert un taux nominal de ${pct(i, 1)} par an pendant que l'inflation court à ${pct(piVal, 1)}.\n\n**Quel est le taux réel exact de ce livret, en % (signe compris) ?**`
          : `Un placement obligataire sert un taux nominal de ${pct(i, 1)} par an pendant que l'inflation court à ${pct(piVal, 1)}.\n\n**Quel est le taux réel exact de ce placement, en % (signe compris) ?**`,
      reponse,
      tolerance: 0.02,
      toleranceMode: 'absolu',
      unite: '%',
      etapes: [
        {
          titre: en ? 'The exact Fisher equation' : 'L\'équation de Fisher exacte',
          contenu: en
            ? `What a placement really earns is what is left once inflation is deducted — a division, not a subtraction: $r = \\dfrac{1 + i}{1 + \\pi} - 1 = \\dfrac{1 + ${f(i, 1)}\\,\\%}{1 + ${f(piVal, 1)}\\,\\%} - 1$ = **${pct(reponse, 2)}**. One euro placed grows by the nominal rate, but the basket it must buy has grown by π: the real rate is the ratio of the two forces.`
            : `Ce qu'un placement rapporte vraiment, c'est ce qui reste une fois l'inflation déduite — une division, pas une soustraction : $r = \\dfrac{1 + i}{1 + \\pi} - 1 = \\dfrac{1 + ${f(i, 1)}\\,\\%}{1 + ${f(piVal, 1)}\\,\\%} - 1$ = **${pct(reponse, 2)}**. L'euro placé grossit au taux nominal, mais le panier qu'il doit acheter a grossi de π : le réel est le rapport des deux forces.`,
        },
        {
          titre: en ? 'The desk shortcut, and its bias' : 'Le raccourci des salles, et son biais',
          contenu: en
            ? estRepression
              ? `The mental arithmetic of trading floors is $r ≈ i - \\pi = ${sgn(approx, 2)}\\,\\%$ — off by ${f(ecartPb, 0)} bp from the exact ${f(reponse, 2)}. The approximation drops the cross term i×π; in negative-real territory it even paints the picture DARKER than it is (the exact division softens the punishment). The interview reflex: give the approximation, THEN flag the gap and its direction.`
              : `The mental arithmetic of trading floors is $r ≈ i - \\pi = ${sgn(approx, 2)}\\,\\%$ — off by ${f(ecartPb, 0)} bp from the exact ${f(reponse, 2)}. The approximation drops the cross term i×π and therefore OVERSTATES the real rate, all the more as levels rise: (5, 2) gives 3 against 2.94 exact (6 bp), but (10, 8) gives 2 against 1.85 (15 bp). The interview reflex: give the approximation, THEN flag the gap and its direction.`
            : estRepression
              ? `L'arithmétique de tête des salles de marché est $r ≈ i - \\pi = ${sgn(approx, 2)}\\,\\%$ — soit ${f(ecartPb, 0)} pb d'écart avec l'exact ${f(reponse, 2)}. L'approximation néglige le terme croisé i×π ; en territoire de réel négatif, elle noircit même le tableau (la division exacte adoucit la punition). Le réflexe d'entretien : donner l'approximation, PUIS signaler l'écart et son sens.`
              : `L'arithmétique de tête des salles de marché est $r ≈ i - \\pi = ${sgn(approx, 2)}\\,\\%$ — soit ${f(ecartPb, 0)} pb d'écart avec l'exact ${f(reponse, 2)}. L'approximation néglige le terme croisé i×π et SURESTIME donc le réel, d'autant plus que les niveaux sont élevés : (5, 2) donne 3 contre 2,94 exact (6 pb), mais (10, 8) donne 2 contre 1,85 (15 pb). Le réflexe d'entretien : donner l'approximation, PUIS signaler l'écart et son sens.`,
        },
        {
          titre: en ? 'What the sign says' : 'Ce que dit le signe',
          contenu: en
            ? estRepression
              ? `A NEGATIVE real rate of ${pct(reponse, 2)}: the saver is paying for the privilege of lending — every year, the account balance buys less. This regime has a name, financial repression, and it is a silent tax on unindexed savings. The same grid reads monetary policy: restrictive or not is NEVER read on the nominal rate — it is read on the real rate, compared with the neutral rate r*.`
              : `A positive real rate of ${pct(reponse, 2)}: this is what the investment genuinely adds in purchasing power, the variable that drives savings decisions. The same grid reads monetary policy: a policy is restrictive when the REAL rate exceeds the neutral rate r*, accommodative below — the nominal rate alone never answers the question.`
            : estRepression
              ? `Un réel NÉGATIF de ${pct(reponse, 2)} : l'épargnant paie pour prêter — chaque année, le solde du livret achète moins. Ce régime a un nom, la répression financière, et c'est une taxe silencieuse sur l'épargne non indexée. La même grille lit la politique monétaire : restrictif ou pas ne se lit JAMAIS sur le nominal — ça se lit sur le réel, comparé au taux neutre r*.`
              : `Un réel positif de ${pct(reponse, 2)} : c'est ce que le placement ajoute vraiment en pouvoir d'achat, la variable qui pilote les décisions d'épargne. La même grille lit la politique monétaire : une politique est restrictive quand le taux RÉEL dépasse le taux neutre r*, accommodante en dessous — le nominal seul ne répond jamais à la question.`,
        },
      ],
      pieges: [
        en
          ? `Answering the approximation ${sgn(approx, 2)}% (i − π): ${f(ecartPb, 0)} bp away from the exact figure, and rejected here. The subtraction drops the cross term i×π — harmless at (2%, 1%), material precisely in the regimes where the real rate matters most.`
          : `Répondre l'approximation ${sgn(approx, 2)} % (i − π) : ${f(ecartPb, 0)} pb d'écart avec l'exact, et rejetée ici. La soustraction néglige le terme croisé i×π — anodin à (2 %, 1 %), significatif précisément dans les régimes où le réel compte le plus.`,
        en
          ? estRepression
            ? `Believing a positive nominal rate protects: at ${pct(i, 1)} nominal under ${pct(piVal, 1)} inflation, the account LOSES ${f(Math.abs(reponse), 2)}% of purchasing power a year. In summer 2022, a central bank at 2.5% facing 8% inflation showed a real rate of −5.09% — four hikes in, the policy was still massively accommodative.`
            : `Flipping the division — $\\dfrac{1 + \\pi}{1 + i} - 1$ returns a figure of the opposite sign and has no economic meaning. A guardrail: with i > π, the real rate must be positive and BELOW i − π; any result violating either is wrong before it is even checked.`
          : estRepression
            ? `Croire qu'un nominal positif protège : à ${pct(i, 1)} de nominal sous ${pct(piVal, 1)} d'inflation, le livret PERD ${f(Math.abs(reponse), 2)} % de pouvoir d'achat par an. À l'été 2022, une banque centrale à 2,5 % face à 8 % d'inflation affichait un réel de −5,09 % — quatre hausses plus tard, la politique restait massivement accommodante.`
            : `Inverser la division — $\\dfrac{1 + \\pi}{1 + i} - 1$ donne un chiffre de signe opposé et n'a aucun sens économique. Un garde-fou : avec i > π, le réel doit être positif et INFÉRIEUR à i − π ; tout résultat qui viole l'un des deux est faux avant même d'être vérifié.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 2. Le taux nominal requis (N1)
// ---------------------------------------------------------------------------
export const genTauxNominalRequis: ExerciseGenerator = {
  id: 'm10-ex-02',
  moduleId: M10,
  titre: 'Le taux nominal requis',
  titreEn: 'The required nominal rate',
  difficulte: 1,
  // Tirages (ordre strict) : 1. rVise = randFloat(1.5, 3.5, 1) · 2. piVal =
  // randFloat(3, 8, 1) · 3. contexte = pick(['epargnant', 'fonds']).
  // Fisher inversé : tauxNominalRequis(rVise, π) = ((1 + r)(1 + π) − 1)·100 ;
  // l'aller-retour par tauxReelFisher retombe sur rVise. La tolérance (0,02)
  // rejette l'addition naïve r + π, dont l'écart (le terme croisé) est en pb.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const rVise = randFloat(rng, 1.5, 3.5, 1);
    const piVal = randFloat(rng, 3, 8, 1);
    const contexte = pick(rng, ['epargnant', 'fonds'] as const);

    const exact = tauxNominalRequis(rVise, piVal);
    const reponse = r2(exact);
    const fauxAdd = r2(rVise + piVal);
    const ecartPb = r2((exact - (rVise + piVal)) * 100);
    const verif = r2(tauxReelFisher(exact, piVal));

    const en = langue === 'en';
    const { f, pct } = formatters(langue);
    return {
      enonce: en
        ? contexte === 'fonds'
          ? `A pension fund must earn a real return of ${pct(rVise, 1)} per year to honour its commitments, in an economy where inflation runs at ${pct(piVal, 1)}.\n\n**What exact nominal rate must its portfolio deliver, in %?**`
          : `A saver wants her investments to gain ${pct(rVise, 1)} per year in purchasing power, while inflation runs at ${pct(piVal, 1)}.\n\n**What exact nominal rate must she demand, in %?**`
        : contexte === 'fonds'
          ? `Un fonds de pension doit dégager un rendement réel de ${pct(rVise, 1)} par an pour honorer ses engagements, dans une économie où l'inflation court à ${pct(piVal, 1)}.\n\n**Quel taux nominal exact son portefeuille doit-il servir, en % ?**`
          : `Une épargnante veut que ses placements gagnent ${pct(rVise, 1)} par an en pouvoir d'achat, pendant que l'inflation court à ${pct(piVal, 1)}.\n\n**Quel taux nominal exact doit-elle exiger, en % ?**`,
      reponse,
      tolerance: 0.02,
      toleranceMode: 'absolu',
      unite: '%',
      etapes: [
        {
          titre: en ? 'Fisher, run backwards' : 'Fisher, à l\'envers',
          contenu: en
            ? `The real rate is a ratio, so the required nominal is a PRODUCT: $i = (1 + r)(1 + \\pi) - 1 = (1 + ${f(rVise, 1)}\\,\\%) × (1 + ${f(piVal, 1)}\\,\\%) - 1$ = **${pct(reponse, 2)}**. The nominal must first replace what inflation eats, then add the real gain — and the real gain itself must be protected from inflation: that is the cross term.`
            : `Le réel est un rapport, donc le nominal requis est un PRODUIT : $i = (1 + r)(1 + \\pi) - 1 = (1 + ${f(rVise, 1)}\\,\\%) × (1 + ${f(piVal, 1)}\\,\\%) - 1$ = **${pct(reponse, 2)}**. Le nominal doit d'abord remplacer ce que l'inflation mange, puis ajouter le gain réel — et ce gain réel doit lui-même être protégé de l'inflation : c'est le terme croisé.`,
        },
        {
          titre: en ? 'The round trip that checks everything' : 'L\'aller-retour qui vérifie tout',
          contenu: en
            ? `Feed the answer back through exact Fisher: $\\dfrac{1 + ${f(reponse, 2)}\\,\\%}{1 + ${f(piVal, 1)}\\,\\%} - 1$ = **${pct(verif, 2)}** — exactly the targeted real rate. This round trip is the cheapest self-check in the whole module: whenever a Fisher computation does not close the loop, one of the two legs is wrong.`
            : `Repassez la réponse dans Fisher exact : $\\dfrac{1 + ${f(reponse, 2)}\\,\\%}{1 + ${f(piVal, 1)}\\,\\%} - 1$ = **${pct(verif, 2)}** — exactement le réel visé. Cet aller-retour est l'auto-contrôle le moins cher du module : quand un calcul de Fisher ne boucle pas, l'une des deux jambes est fausse.`,
        },
        {
          titre: en ? 'The limiting case that speaks' : 'Le cas limite qui parle',
          contenu: en
            ? `Target a real rate of ZERO and the formula collapses to i = π: a nominal rate equal to inflation protects, it does not enrich. Everything below ${pct(piVal, 1)} nominal is a real loss — financial repression — and every basis point above only counts once deflated. ${contexte === 'fonds' ? 'That is why pension funds think in real terms: their commitments are promises of future purchasing power, not of euros.' : 'That is the grid that reads every savings product: the printed rate means nothing until inflation has been deducted.'}`
            : `Visez un réel NUL et la formule s'effondre en i = π : un nominal égal à l'inflation protège, il n'enrichit pas. Tout ce qui est sous ${pct(piVal, 1)} de nominal est une perte réelle — la répression financière — et chaque point de base au-dessus ne compte qu'une fois déflaté. ${contexte === 'fonds' ? 'C\'est pourquoi les fonds de pension raisonnent en réel : leurs engagements sont des promesses de pouvoir d\'achat futur, pas d\'euros.' : 'C\'est la grille qui lit tous les produits d\'épargne : le taux affiché ne dit rien tant que l\'inflation n\'a pas été déduite.'}`,
        },
      ],
      pieges: [
        en
          ? `Adding instead of compounding: $r + \\pi = ${pct(fauxAdd, 2)}$, which is ${f(ecartPb, 0)} bp SHORT of the required ${f(reponse, 2)}. The missing piece is the cross term r×π: the real gain must itself be shielded from inflation. Small at low levels, the gap grows with both inputs — exactly when the computation matters.`
          : `Additionner au lieu de composer : $r + \\pi = ${pct(fauxAdd, 2)}$, soit ${f(ecartPb, 0)} pb de MOINS que le ${f(reponse, 2)} requis. La pièce manquante est le terme croisé r×π : le gain réel doit lui-même être protégé de l'inflation. Petit aux niveaux bas, l'écart grossit avec les deux entrées — exactement quand le calcul compte.`,
        en
          ? `Confusing the direction: computing the real rate of a given nominal (a division) instead of the nominal required for a target real (a multiplication). The question tells you which way: "what does this placement really earn?" divides; "what must I demand?" multiplies.`
          : `Confondre le sens : calculer le réel d'un nominal donné (une division) au lieu du nominal requis pour un réel visé (une multiplication). La question dit le sens : « que rapporte vraiment ce placement ? » divise ; « que dois-je exiger ? » multiplie.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 3. La règle de Taylor, terme à terme (N2)
// ---------------------------------------------------------------------------
export const genRegleTaylor: ExerciseGenerator = {
  id: 'm10-ex-03',
  moduleId: M10,
  titre: 'La règle de Taylor, terme à terme',
  titreEn: 'The Taylor rule, term by term',
  difficulte: 2,
  // Tirages (ordre strict) : 1. rStar = randFloat(0.5, 2.5, 1) · 2. piVal =
  // randFloat(3, 9, 1) · 3. gap = pick([−3, −2.5, −2, −1.5, −1, 1, 1.5, 2]).
  // Cible fixe à 2 %, coefficients 0,5 (Taylor 1993). Réponse = regleDeTaylor,
  // décomposée en 4 termes : r* + π (nominal neutre) + 0,5(π − 2) + 0,5·gap.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const rStar = randFloat(rng, 0.5, 2.5, 1);
    const piVal = randFloat(rng, 3, 9, 1);
    const gap = pick(rng, [-3, -2.5, -2, -1.5, -1, 1, 1.5, 2] as const);

    const cible = 2;
    const reponse = r2(regleDeTaylor(rStar, piVal, cible, gap));
    const nominalNeutre = r2(rStar + piVal);
    const penalite = r2(0.5 * (piVal - cible));
    const correction = r2(0.5 * gap);
    const fauxSansPi = r2(regleDeTaylor(rStar, piVal, cible, gap) - piVal);
    const fauxSigneGap = r2(regleDeTaylor(rStar, piVal, cible, -gap));
    const enRecession = gap < 0;

    const en = langue === 'en';
    const { f, pct, sgn } = formatters(langue);
    return {
      enonce: en
        ? `An economy: real neutral rate ${pct(rStar, 1)}, current inflation ${pct(piVal, 1)}, inflation target ${pct(cible, 0)}, output gap ${sgn(gap, 1)}% (${enRecession ? 'the economy is running below potential' : 'the economy is running above potential'}). Coefficients: 0.5 on both gaps (Taylor 1993).\n\n**What policy rate does the Taylor rule prescribe, in %?**`
        : `Une économie : taux neutre réel ${pct(rStar, 1)}, inflation courante ${pct(piVal, 1)}, cible d'inflation ${pct(cible, 0)}, écart de production ${sgn(gap, 1)} % (${enRecession ? 'l\'économie tourne sous son potentiel' : 'l\'économie tourne au-dessus de son potentiel'}). Coefficients : 0,5 sur les deux écarts (Taylor 1993).\n\n**Quel taux directeur la règle de Taylor prescrit-elle, en % ?**`,
      reponse,
      tolerance: 0.05,
      toleranceMode: 'absolu',
      unite: '%',
      etapes: [
        {
          titre: en ? 'The zero point: the neutral nominal rate' : 'Le point zéro : le taux nominal neutre',
          contenu: en
            ? `The rule sets a NOMINAL rate, so it starts from $r^* + \\pi = ${f(rStar, 1)} + ${f(piVal, 1)}$ = **${pct(nominalNeutre, 2)}** — the rate that neither stimulates nor brakes, given today's inflation. Forgetting the π here is the classic exam accident: a central bank that ignored current inflation would set a nominal rate for a world that no longer exists.`
            : `La règle fixe un taux NOMINAL, elle part donc de $r^* + \\pi = ${f(rStar, 1)} + ${f(piVal, 1)}$ = **${pct(nominalNeutre, 2)}** — le taux qui ne stimule ni ne freine, à l'inflation d'aujourd'hui. Oublier le π ici est l'accident classique de copie : une banque centrale qui ignorerait l'inflation courante fixerait un nominal pour un monde qui n'existe plus.`,
        },
        {
          titre: en ? 'The two corrections' : 'Les deux corrections',
          contenu: en
            ? `Inflation penalty: $a\\,(\\pi - \\pi^*) = 0{,}5 × (${f(piVal, 1)} - ${f(cible, 0)})$ = **${sgn(penalite, 2)}** — inflation overshoots the target, the rule tightens. Cyclical correction: $b × \\text{gap} = 0{,}5 × (${sgn(gap, 1)})$ = **${sgn(correction, 2)}** — ${enRecession ? 'the gap is negative (slack), it pulls the rate DOWN: the rule arbitrates between the two mandates in one line' : 'the gap is positive (overheating), it pushes the rate UP: both terms pull the same way'}.`
            : `Pénalité d'inflation : $a\\,(\\pi - \\pi^*) = 0{,}5 × (${f(piVal, 1)} - ${f(cible, 0)})$ = **${sgn(penalite, 2)}** — l'inflation dépasse la cible, la règle serre. Correction conjoncturelle : $b × \\text{gap} = 0{,}5 × (${sgn(gap, 1)})$ = **${sgn(correction, 2)}** — ${enRecession ? 'le gap est négatif (sous-régime), il tire le taux vers le BAS : la règle arbitre les deux mandats en une ligne' : 'le gap est positif (surchauffe), il pousse le taux vers le HAUT : les deux termes tirent dans le même sens'}.`,
        },
        {
          titre: en ? 'The prescription — and what the rule does not say' : 'La prescription — et ce que la règle ne dit pas',
          contenu: en
            ? `$i = ${f(nominalNeutre, 2)} ${penalite >= 0 ? '+' : '−'} ${f(Math.abs(penalite), 2)} ${correction >= 0 ? '+' : '−'} ${f(Math.abs(correction), 2)}$ = **${pct(reponse, 2)}**. Handle with care: r* is UNOBSERVABLE (estimated with one-point error bars) and the real-time output gap is massively revised after the fact — part of the 1970s drift came from gaps believed deep that were not. No central bank follows the rule mechanically; all compare themselves to it — "the Fed is 300 bp below its Taylor" is a sentence desks actually say.`
            : `$i = ${f(nominalNeutre, 2)} ${penalite >= 0 ? '+' : '−'} ${f(Math.abs(penalite), 2)} ${correction >= 0 ? '+' : '−'} ${f(Math.abs(correction), 2)}$ = **${pct(reponse, 2)}**. À manier avec précaution : r* est INOBSERVABLE (estimé avec des barres d'erreur d'un point) et le gap mesuré en temps réel est massivement révisé après coup — une partie de la dérive des années 70 vient de gaps crus très creusés qui ne l'étaient pas. Aucune banque centrale ne suit la règle mécaniquement ; toutes s'y comparent — « la Fed est 300 pb sous sa Taylor » est une phrase qui se dit sur un desk.`,
        },
      ],
      pieges: [
        en
          ? `Dropping current inflation: $r^* + 0{,}5(\\pi - \\pi^*) + 0{,}5 × \\text{gap} = ${pct(fauxSansPi, 2)}$ instead of ${pct(reponse, 2)}. The rule prescribes a NOMINAL rate: r* + π is its floor of relevance — π points lower, the "prescription" would be deeply negative in real terms in the middle of an inflation flare.`
          : `Oublier l'inflation courante : $r^* + 0{,}5(\\pi - \\pi^*) + 0{,}5 × \\text{gap} = ${pct(fauxSansPi, 2)}$ au lieu de ${pct(reponse, 2)}. La règle prescrit un taux NOMINAL : r* + π est son socle de pertinence — π points plus bas, la « prescription » serait profondément négative en réel en pleine flambée.`,
        en
          ? enRecession
            ? `Flipping the gap's sign: adding 0.5 × ${f(Math.abs(gap), 1)} gives ${pct(fauxSigneGap, 2)} — tightening BECAUSE of the recession. The gap enters with its own sign, negative in a slump: it is the term through which the rule acknowledges the second mandate.`
            : `Flipping the gap's sign: subtracting 0.5 × ${f(Math.abs(gap), 1)} gives ${pct(fauxSigneGap, 2)} — easing in the middle of an overheating. A positive gap (economy above potential) adds inflationary pressure: it pushes the prescription UP, same direction as the inflation penalty.`
          : enRecession
            ? `Se tromper de signe sur le gap : ajouter 0,5 × ${f(Math.abs(gap), 1)} donne ${pct(fauxSigneGap, 2)} — resserrer À CAUSE de la récession. Le gap entre avec son signe, négatif en sous-régime : c'est le terme par lequel la règle reconnaît le second mandat.`
            : `Se tromper de signe sur le gap : retrancher 0,5 × ${f(Math.abs(gap), 1)} donne ${pct(fauxSigneGap, 2)} — assouplir en pleine surchauffe. Un gap positif (économie au-dessus du potentiel) ajoute de la pression inflationniste : il pousse la prescription vers le HAUT, dans le même sens que la pénalité d'inflation.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 4. Le principe de Taylor : qui resserre vraiment ? (N3)
// ---------------------------------------------------------------------------
export const genPrincipeTaylor: ExerciseGenerator = {
  id: 'm10-ex-04',
  moduleId: M10,
  titre: 'Le principe de Taylor : qui resserre vraiment ?',
  titreEn: 'The Taylor principle: who is really tightening?',
  difficulte: 3,
  // Tirages (ordre strict) : 1. i0 = randFloat(0.5, 2, 1) · 2. pi0 =
  // randFloat(1.5, 2.5, 1) · 3. deltaPi = randInt(4, 7) · 4. hausseA =
  // pick([100, 150, 200]) · 5. extraB = pick([50, 100, 150]) · 6. banque =
  // pick(['A', 'B']). π passe de π₀ à π₀ + Δπ ; la banque A monte de hausseA pb
  // (MOINS que Δπ), la banque B de Δπ·100 + extraB pb (PLUS que Δπ). Réponse =
  // tauxReelFisher du nouveau couple (i, π) de la banque tirée — le réel de A
  // a BAISSÉ malgré les hausses, celui de B a monté : le principe de Taylor.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const i0 = randFloat(rng, 0.5, 2, 1);
    const pi0 = randFloat(rng, 1.5, 2.5, 1);
    const deltaPi = randInt(rng, 4, 7);
    const hausseA = pick(rng, [100, 150, 200] as const);
    const extraB = pick(rng, [50, 100, 150] as const);
    const banque = pick(rng, ['A', 'B'] as const);

    const pi1 = r2(pi0 + deltaPi);
    const hausseB = deltaPi * 100 + extraB;
    const iA = r2(i0 + hausseA / 100);
    const iB = r2(i0 + hausseB / 100);
    const reel0 = r2(tauxReelFisher(i0, pi0));
    const reelA = r2(tauxReelFisher(iA, pi1));
    const reelB = r2(tauxReelFisher(iB, pi1));
    const estA = banque === 'A';
    const iChoisi = estA ? iA : iB;
    const reponse = estA ? reelA : reelB;
    const approxChoisi = r2(tauxReelApproche(iChoisi, pi1));
    const ecartPb = r2(Math.abs(tauxReelApproche(iChoisi, pi1) - tauxReelFisher(iChoisi, pi1)) * 100);

    const en = langue === 'en';
    const { f, pct, sgn } = formatters(langue);
    return {
      enonce: en
        ? `Two central banks start from the same policy rate of ${pct(i0, 1)}, with inflation at ${pct(pi0, 1)}. An inflation shock takes inflation to ${pct(pi1, 1)}. Central bank A hikes by ${f(hausseA, 0)} bp; central bank B hikes by ${f(hausseB, 0)} bp.\n\n**What is the exact real policy rate of central bank ${banque} after the shock, in % (sign included)?**`
        : `Deux banques centrales partent du même taux directeur de ${pct(i0, 1)}, avec une inflation à ${pct(pi0, 1)}. Un choc porte l'inflation à ${pct(pi1, 1)}. La banque centrale A relève son taux de ${f(hausseA, 0)} pb ; la banque centrale B de ${f(hausseB, 0)} pb.\n\n**Quel est le taux directeur réel exact de la banque ${banque} après le choc, en % (signe compris) ?**`,
      reponse,
      tolerance: 0.05,
      toleranceMode: 'absolu',
      unite: '%',
      etapes: [
        {
          titre: en ? 'The starting point, in real terms' : 'Le point de départ, en réel',
          contenu: en
            ? `Before the shock, both banks stand at $\\dfrac{1 + ${f(i0, 1)}\\,\\%}{1 + ${f(pi0, 1)}\\,\\%} - 1$ = **${pct(reel0, 2)}** real. What brakes or stimulates the economy is never the posted rate: it is this real rate, compared with the neutral rate r*.`
            : `Avant le choc, les deux banques sont à $\\dfrac{1 + ${f(i0, 1)}\\,\\%}{1 + ${f(pi0, 1)}\\,\\%} - 1$ = **${pct(reel0, 2)}** de réel. Ce qui freine ou stimule l'économie n'est jamais le taux affiché : c'est ce réel, comparé au taux neutre r*.`,
        },
        {
          titre: en ? 'Two hikes, two opposite stories' : 'Deux hausses, deux histoires opposées',
          contenu: en
            ? `Bank A: ${f(hausseA, 0)} bp of hikes take the nominal to ${pct(iA, 1)}, but inflation rose by ${f(deltaPi, 0)} points — MORE than the rate. Real rate: $\\dfrac{1 + ${f(iA, 1)}\\,\\%}{1 + ${f(pi1, 1)}\\,\\%} - 1$ = **${pct(reelA, 2)}**, DOWN from ${pct(reel0, 2)}: the policy got looser while hiking. Bank B moved ${f(hausseB, 0)} bp, more than inflation: real rate $\\dfrac{1 + ${f(iB, 1)}\\,\\%}{1 + ${f(pi1, 1)}\\,\\%} - 1$ = **${pct(reelB, 2)}**, UP — this one actually tightened.`
            : `Banque A : ${f(hausseA, 0)} pb de hausses portent le nominal à ${pct(iA, 1)}, mais l'inflation a monté de ${f(deltaPi, 0)} points — PLUS que le taux. Réel : $\\dfrac{1 + ${f(iA, 1)}\\,\\%}{1 + ${f(pi1, 1)}\\,\\%} - 1$ = **${pct(reelA, 2)}**, en BAISSE depuis ${pct(reel0, 2)} : la politique s'est assouplie en montant les taux. La banque B a bougé de ${f(hausseB, 0)} pb, plus que l'inflation : réel $\\dfrac{1 + ${f(iB, 1)}\\,\\%}{1 + ${f(pi1, 1)}\\,\\%} - 1$ = **${pct(reelB, 2)}**, en HAUSSE — celle-là a vraiment resserré.`,
        },
        {
          titre: en ? 'The Taylor principle' : 'Le principe de Taylor',
          contenu: en
            ? `The requested answer is **${pct(reponse, 2)}** (bank ${banque}). The general lesson is the Taylor principle: to tighten, the nominal rate must move MORE than one-for-one with inflation — otherwise the real rate falls while prices flare, and the policy turns more accommodative precisely when it should bite: the exact recipe of the 1970s. Summer 2022 is the live example: a central bank at 2.5% nominal facing 8% inflation showed a real rate of −5.09% — four hikes in, still massively accommodative.`
            : `La réponse demandée est **${pct(reponse, 2)}** (banque ${banque}). La leçon générale est le principe de Taylor : pour resserrer, le nominal doit bouger PLUS qu'un pour un avec l'inflation — sinon le réel baisse pendant que les prix flambent, et la politique devient plus accommodante précisément quand elle devrait mordre : la recette exacte des années 70. L'été 2022 en est l'exemple en direct : une banque centrale à 2,5 % de nominal face à 8 % d'inflation affichait un réel de −5,09 % — quatre hausses plus tard, encore massivement accommodante.`,
        },
      ],
      pieges: [
        en
          ? `Judging on the nominal: "bank A hiked by ${f(hausseA, 0)} bp, so it tightened" — the real rate says the opposite (${pct(reel0, 2)} → ${pct(reelA, 2)}). Hiking is not tightening: only a real rate that RISES tightens, and that requires moving more than inflation.`
          : `Juger sur le nominal : « la banque A a monté de ${f(hausseA, 0)} pb, donc elle a resserré » — le réel dit l'inverse (${pct(reel0, 2)} → ${pct(reelA, 2)}). Monter ses taux n'est pas resserrer : seul un réel qui MONTE resserre, et cela exige de bouger plus que l'inflation.`,
        en
          ? `Using the shortcut at these levels: $i - \\pi = ${sgn(approxChoisi, 2)}\\,\\%$ against ${sgn(reponse, 2)}% exact — ${f(ecartPb, 0)} bp of gap, because the cross term grows with inflation. The approximation is precisely least reliable in the regimes where the question matters most.`
          : `Utiliser le raccourci à ces niveaux : $i - \\pi = ${sgn(approxChoisi, 2)}\\,\\%$ contre ${sgn(reponse, 2)} % exact — ${f(ecartPb, 0)} pb d'écart, car le terme croisé grossit avec l'inflation. L'approximation est précisément la moins fiable dans les régimes où la question compte le plus.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 5. L'érosion du pouvoir d'achat (N1)
// ---------------------------------------------------------------------------
export const genErosionPouvoirAchat: ExerciseGenerator = {
  id: 'm10-ex-05',
  moduleId: M10,
  titre: 'L\'érosion du pouvoir d\'achat',
  titreEn: 'The erosion of purchasing power',
  difficulte: 1,
  // Tirages (ordre strict) : 1. montant = pick([100, 500, 1000, 5000]) · 2. piVal
  // = randFloat(2, 8, 1) · 3. annees = pick([5, 8, 10, 15, 20]).
  // Réponse = interetsComposesInflation (l'actualisation va du m4 au « taux »
  // d'inflation) ; le faux « indice » (montant × (1 + π)^n) via indiceDesPrix.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const montant = pick(rng, [100, 500, 1000, 5000] as const);
    const piVal = randFloat(rng, 2, 8, 1);
    const annees = pick(rng, [5, 8, 10, 15, 20] as const);

    const reponse = r2(interetsComposesInflation(montant, piVal, annees));
    const perte = r2(montant - reponse);
    const pertePct = r2((1 - interetsComposesInflation(montant, piVal, annees) / montant) * 100);
    const fauxLineairePct = r2(piVal * annees);
    const fauxIndice = r2(indiceDesPrix(montant, Array(annees).fill(piVal)));

    const en = langue === 'en';
    const { f, eur, pct } = formatters(langue);
    return {
      enonce: en
        ? `${eur(montant, 0)} sit on a non-interest-bearing account for ${f(annees, 0)} years while inflation runs at ${pct(piVal, 1)} per year.\n\n**What is this money worth at the end, in purchasing-power euros (today's euros)?**`
        : `${eur(montant, 0)} dorment sur un compte non rémunéré pendant ${f(annees, 0)} ans, sous une inflation de ${pct(piVal, 1)} par an.\n\n**Que vaut cet argent au bout du compte, en euros de pouvoir d'achat (euros d'aujourd'hui) ?**`,
      reponse,
      tolerance: 0.005,
      toleranceMode: 'relatif',
      unite: '€',
      etapes: [
        {
          titre: en ? 'Inflation discounts, like a rate' : 'L\'inflation actualise, comme un taux',
          contenu: en
            ? `Compound interest, played AGAINST the saver: $\\dfrac{${montant}}{(1 + ${f(piVal, 1)}\\,\\%)^{${f(annees, 0)}}}$ = **${eur(reponse, 2)}**. Technically this is module 4's discounting (the course function calls va under the hood) at the "rate" of inflation: inflation discounts purchasing power exactly as a rate discounts a cash flow. Discrete annual compounding — the convention of price indices.`
            : `Les intérêts composés, joués CONTRE l'épargnant : $\\dfrac{${montant}}{(1 + ${f(piVal, 1)}\\,\\%)^{${f(annees, 0)}}}$ = **${eur(reponse, 2)}**. Techniquement, c'est l'actualisation du module 4 (la fonction du cours appelle va sous le capot) au « taux » d'inflation : l'inflation actualise le pouvoir d'achat exactement comme un taux actualise un flux. Composition discrète annuelle — la convention des indices de prix.`,
        },
        {
          titre: en ? 'The size of the bite' : 'La taille de la morsure',
          contenu: en
            ? `${eur(perte, 2)} of purchasing power gone — **${pct(pertePct, 1)}** of the balance — without a crash, without a default, without the account balance moving by one cent. The benchmarks to memorise, on 100 over ten years: at the 2% target there remain 82.03 (erosion is an accepted choice, a margin against deflation); at 5% — the 2022 regime — 61.39.`
            : `${eur(perte, 2)} de pouvoir d'achat envolés — **${pct(pertePct, 1)}** du solde — sans krach, sans défaut, sans que le solde du compte ait bougé d'un centime. Les repères à mémoriser, sur 100 en dix ans : à la cible de 2 %, il reste 82,03 (l'érosion est un choix assumé, une marge contre la déflation) ; à 5 % — le régime de 2022 — 61,39.`,
        },
        {
          titre: en ? 'Who pays, who collects' : 'Qui paie, qui encaisse',
          contenu: en
            ? `This erosion is the inflation tax: levied without a vote on whoever holds cash, a poorly paid savings account, a fixed-rate bond. Symmetrically, fixed-rate DEBTORS collect — first among them the State, the economy's largest fixed-rate borrower, whose debt silently melts in real terms. Massive, silent, and regressive in a precise sense: sophisticated wealth indexes itself (property, equities, linkers), the small saver in a passbook pays full price.`
            : `Cette érosion est la taxe d'inflation : prélevée sans vote sur quiconque détient du cash, un livret mal rémunéré, une obligation à taux fixe. Symétriquement, les DÉBITEURS à taux fixe encaissent — au premier rang l'État, plus gros emprunteur à taux fixe de l'économie, dont la dette fond silencieusement en termes réels. Massif, silencieux, et régressif en un sens précis : les patrimoines sophistiqués s'indexent (immobilier, actions, obligations indexées), le petit épargnant en livret paie plein pot.`,
        },
      ],
      pieges: [
        en
          ? `The linear computation: ${f(annees, 0)} years at ${pct(piVal, 1)} is NOT a loss of ${f(fauxLineairePct, 0)}% ${fauxLineairePct >= 100 ? '(an absurdity: more than everything!)' : ''} but of ${pct(pertePct, 1)}: rates compound, they never add. The linear figure overstates the loss — each year's erosion applies to an already shrunken base.`
          : `Le calcul linéaire : ${f(annees, 0)} ans à ${pct(piVal, 1)} ne font PAS ${f(fauxLineairePct, 0)} % de perte ${fauxLineairePct >= 100 ? '(une absurdité : plus que tout !)' : ''} mais ${pct(pertePct, 1)} : les taux se composent, ils ne s'additionnent jamais. Le chiffre linéaire exagère la perte — l'érosion de chaque année s'applique à une base déjà réduite.`,
        en
          ? `Multiplying instead of dividing: ${f(montant, 0)} × (1 + π)^n = ${eur(fauxIndice, 2)} is the future price of today's ${eur(montant, 0)} basket — the price index — not what the money will buy. Purchasing power DIVIDES by the index; only the basket multiplies.`
          : `Multiplier au lieu de diviser : ${f(montant, 0)} × (1 + π)^n = ${eur(fauxIndice, 2)} est le prix futur du panier qui coûte ${eur(montant, 0)} aujourd'hui — l'indice des prix — pas ce que l'argent achètera. Le pouvoir d'achat se DIVISE par l'indice ; seul le panier se multiplie.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 6. Le chaînage de l'indice des prix (N2)
// ---------------------------------------------------------------------------
export const genChainageIndice: ExerciseGenerator = {
  id: 'm10-ex-06',
  moduleId: M10,
  titre: 'Le chaînage de l\'indice des prix',
  titreEn: 'Chaining the price index',
  difficulte: 2,
  // Tirages (ordre strict) : 1. mode = pick(['chainage', 'asymetrie']) · 2. p1 =
  // randFloat(1.5, 4, 1) · 3. p2 = randFloat(2, 6, 1) · 4. p3 = randFloat(6, 12, 1)
  // · 5. x = randInt(8, 15).
  // 'chainage' : trois années p1, p2, p3 — indiceDesPrix(100, [p1, p2, p3]) contre
  // l'addition naïve. 'asymetrie' : +x % puis −x % — indiceDesPrix(100, [x, −x])
  // ne revient PAS à 100 : la baisse travaille sur une base plus haute.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const mode = pick(rng, ['chainage', 'asymetrie'] as const);
    const p1 = randFloat(rng, 1.5, 4, 1);
    const p2 = randFloat(rng, 2, 6, 1);
    const p3 = randFloat(rng, 6, 12, 1);
    const x = randInt(rng, 8, 15);

    const estAsymetrie = mode === 'asymetrie';
    const reponse = estAsymetrie ? r2(indiceDesPrix(100, [x, -x])) : r2(indiceDesPrix(100, [p1, p2, p3]));
    const fauxAdd = estAsymetrie ? 100 : r2(100 + p1 + p2 + p3);
    const ecartAdd = r2(reponse - fauxAdd);
    const niveauApresChoc = r2(indiceDesPrix(100, [x]));

    const en = langue === 'en';
    const { f, pct } = formatters(langue);
    return {
      enonce: en
        ? estAsymetrie
          ? `A price index starts at 100. An inflationary flare pushes it up by ${pct(x, 0)} in year one; year two brings deflation of −${pct(x, 0)}.\n\n**What is the index level after the two years?**`
          : `A price index starts at 100 and goes through three years of inflation: ${pct(p1, 1)}, then ${pct(p2, 1)}, then ${pct(p3, 1)}.\n\n**What is the index level after the three years?**`
        : estAsymetrie
          ? `Un indice des prix part de 100. Une poussée inflationniste le fait monter de ${pct(x, 0)} la première année ; la deuxième année apporte une déflation de −${pct(x, 0)}.\n\n**Quel est le niveau de l'indice au bout des deux ans ?**`
          : `Un indice des prix part de 100 et traverse trois années d'inflation : ${pct(p1, 1)}, puis ${pct(p2, 1)}, puis ${pct(p3, 1)}.\n\n**Quel est le niveau de l'indice au bout des trois ans ?**`,
      reponse,
      tolerance: 0.05,
      toleranceMode: 'absolu',
      unite: 'points',
      etapes: [
        {
          titre: en ? 'Chaining: multiply, never add' : 'Le chaînage : multiplier, jamais additionner',
          contenu: en
            ? `An index is built by CHAINING: each year, the level is multiplied by one plus that year's inflation — that is how official CPIs are constructed. ${estAsymetrie ? `Here: $100 × (1 + ${f(x, 0)}\\,\\%) × (1 - ${f(x, 0)}\\,\\%)$.` : `Here: $100 × (1 + ${f(p1, 1)}\\,\\%) × (1 + ${f(p2, 1)}\\,\\%) × (1 + ${f(p3, 1)}\\,\\%)$.`}`
            : `Un indice se construit par CHAÎNAGE : chaque année, le niveau est multiplié par un plus l'inflation de l'année — c'est ainsi que se fabriquent les CPI officiels. ${estAsymetrie ? `Ici : $100 × (1 + ${f(x, 0)}\\,\\%) × (1 - ${f(x, 0)}\\,\\%)$.` : `Ici : $100 × (1 + ${f(p1, 1)}\\,\\%) × (1 + ${f(p2, 1)}\\,\\%) × (1 + ${f(p3, 1)}\\,\\%)$.`}`,
        },
        {
          titre: en ? 'The number' : 'Le chiffre',
          contenu: en
            ? estAsymetrie
              ? `After the flare the index stands at ${f(niveauApresChoc, 0)}; the −${f(x, 0)}% then applies to THAT higher base: $${f(niveauApresChoc, 0)} × (1 - ${f(x, 0)}\\,\\%)$ = **${f(reponse, 2)}** — below 100. Up ${f(x, 0)}% then down ${f(x, 0)}% does not return to the start: the fall "works" on more. Same trap as module 2's portfolio performances, applied to prices.`
              : `The product gives **${f(reponse, 2)}** — against ${f(fauxAdd, 1)} by simple addition, a gap of ${f(ecartAdd, 2)} points. Compounding always bites, in the direction unfavourable to the consumer: each rise applies to a level already lifted by the previous ones.`
            : estAsymetrie
              ? `Après la poussée, l'indice est à ${f(niveauApresChoc, 0)} ; le −${f(x, 0)} % s'applique alors à CETTE base plus haute : $${f(niveauApresChoc, 0)} × (1 - ${f(x, 0)}\\,\\%)$ = **${f(reponse, 2)}** — sous 100. Monter de ${f(x, 0)} % puis baisser de ${f(x, 0)} % ne ramène pas au départ : la baisse « travaille » sur plus. Le même piège que les performances de portefeuille du module 2, appliqué aux prix.`
              : `Le produit donne **${f(reponse, 2)}** — contre ${f(fauxAdd, 1)} par simple addition, soit ${f(ecartAdd, 2)} points d'écart. La composition mord toujours, dans le sens défavorable au consommateur : chaque hausse s'applique à un niveau déjà relevé par les précédentes.`,
        },
        {
          titre: en ? 'An index never forgets' : 'Un indice n\'oublie jamais',
          contenu: en
            ? `The level is acquired FOREVER: disinflation (the pace slowing back to 2%) never brings yesterday's prices back — the index keeps climbing, just more slowly. That is the most misunderstood distinction in the public debate, hence the most valuable at the orals: disinflation is the derivative coming down; deflation is a NEGATIVE pace, a different pathology altogether, which central banks fear even more than inflation. "Inflation is falling but everything stays expensive" states exactly the difference between the derivative and the level.`
            : `Le niveau est acquis POUR TOUJOURS : la désinflation (le rythme qui revient vers 2 %) ne ramène jamais les prix d'hier — l'indice continue de monter, juste plus lentement. C'est la distinction la plus mal comprise du débat public, donc la plus rentable à l'oral : la désinflation, c'est la dérivée qui redescend ; la déflation, c'est un rythme NÉGATIF, une tout autre pathologie, que les banques centrales craignent plus encore que l'inflation. « L'inflation baisse mais tout reste cher » énonce exactement la différence entre la dérivée et le niveau.`,
        },
      ],
      pieges: [
        en
          ? estAsymetrie
            ? `Answering 100: +${f(x, 0)}% then −${f(x, 0)}% "cancel out" only in additive arithmetic. Chaining is multiplicative: $(1 + x)(1 - x) = 1 - x^2 < 1$ — the index lands at ${f(reponse, 2)}, and the gap grows with the square of the swing.`
            : `Adding the inflations: $100 + ${f(p1, 1)} + ${f(p2, 1)} + ${f(p3, 1)} = ${f(fauxAdd, 1)}$ instead of ${f(reponse, 2)}. Rates compound, they never add — the addition always understates the true level, and the error grows with the number of years and the size of the rates.`
          : estAsymetrie
            ? `Répondre 100 : +${f(x, 0)} % puis −${f(x, 0)} % ne « s'annulent » qu'en arithmétique additive. Le chaînage est multiplicatif : $(1 + x)(1 - x) = 1 - x^2 < 1$ — l'indice atterrit à ${f(reponse, 2)}, et l'écart grandit avec le carré de l'ampleur.`
            : `Additionner les inflations : $100 + ${f(p1, 1)} + ${f(p2, 1)} + ${f(p3, 1)} = ${f(fauxAdd, 1)}$ au lieu de ${f(reponse, 2)}. Les taux se composent, ils ne s'additionnent jamais — l'addition sous-estime toujours le vrai niveau, et l'erreur grossit avec le nombre d'années et la taille des taux.`,
        en
          ? `Confusing pace and level: reading a return of inflation to 2% as a return of prices to their old level. The 2021 prices will never come back — only DEflation would bring the index down, and no central bank wishes that upon itself (postponed purchases, debts heavier in real terms, the Japanese spiral).`
          : `Confondre rythme et niveau : lire un retour de l'inflation à 2 % comme un retour des prix à leur ancien niveau. Les prix de 2021 ne reviendront jamais — seule une DÉflation ferait baisser l'indice, et aucune banque centrale ne se la souhaite (achats reportés, dettes alourdies en réel, spirale japonaise).`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 7. Annualiser le chiffre du mois (N2)
// ---------------------------------------------------------------------------
export const genAnnualisationMensuelle: ExerciseGenerator = {
  id: 'm10-ex-07',
  moduleId: M10,
  titre: 'Annualiser le chiffre du mois',
  titreEn: 'Annualising the monthly print',
  difficulte: 2,
  // Tirages (ordre strict) : 1. m = randFloat(0.3, 1.2, 1).
  // Réponse = inflationAnnualiseeDepuisMensuelle : ((1 + m)^12 − 1)·100. La
  // tolérance (0,02 absolu) rejette le naïf 12·m, dont l'écart est chiffré.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const m = randFloat(rng, 0.3, 1.2, 1);

    const exact = inflationAnnualiseeDepuisMensuelle(m);
    const reponse = r2(exact);
    const fauxNaif = r2(12 * m);
    const ecart = r2(exact - 12 * m);

    const en = langue === 'en';
    const { f, pct } = formatters(langue);
    return {
      enonce: en
        ? `The monthly CPI comes out at +${pct(m, 1)} month-on-month. A hurried commentator translates: "that is ${pct(fauxNaif, 1)} at an annual rate".\n\n**What is the correctly annualised pace, in %?**`
        : `Le CPI du mois ressort à +${pct(m, 1)} sur le mois. Un commentateur pressé traduit : « soit ${pct(fauxNaif, 1)} en rythme annuel ».\n\n**Quel est le rythme annualisé correct, en % ?**`,
      reponse,
      tolerance: 0.02,
      toleranceMode: 'absolu',
      unite: '%',
      etapes: [
        {
          titre: en ? 'Compound, never multiply' : 'Composer, jamais multiplier',
          contenu: en
            ? `Price rises COMPOUND, exactly like module 4's interest: each month's increase applies to a level already lifted by the previous ones. The annualised pace is $(1 + ${f(m, 1)}\\,\\%)^{12} - 1$ = **${pct(reponse, 2)}** — never $12 × m$.`
            : `Les hausses de prix se COMPOSENT, exactement comme les intérêts du module 4 : la hausse de chaque mois s'applique à un niveau déjà relevé par les précédentes. Le rythme annualisé est $(1 + ${f(m, 1)}\\,\\%)^{12} - 1$ = **${pct(reponse, 2)}** — jamais $12 × m$.`,
        },
        {
          titre: en ? 'The gap to the naive figure' : 'L\'écart au chiffre naïf',
          contenu: en
            ? `The naive $12 × ${f(m, 1)} = ${pct(fauxNaif, 1)}$ falls ${f(ecart, 2)} points short — and the gap GROWS with the monthly print: 0.5% a month runs at 6.17% (not 6%), 1% a month at 12.68% (not 12%). The interview reflex: annualise at 12× in your head for the order of magnitude, THEN flag that compounding adds a few tenths.`
            : `Le naïf $12 × ${f(m, 1)} = ${pct(fauxNaif, 1)}$ rate ${f(ecart, 2)} point(s) — et l'écart GROSSIT avec le chiffre mensuel : 0,5 % par mois court à 6,17 % (pas 6 %), 1 % par mois à 12,68 % (pas 12 %). Le réflexe d'oral : annualiser de tête à 12× pour l'ordre de grandeur, PUIS signaler que la composition ajoute quelques dixièmes.`,
        },
        {
          titre: en ? 'Why desks annualise the monthly print' : 'Pourquoi les desks annualisent le mensuel',
          contenu: en
            ? `The published year-on-year figure drags twelve months of history — including base effects that have nothing to do with today's pace. The month-on-month print is the FRESH information: annualised, it says at what pace prices are running NOW, directly comparable with the 2% target. That comparison — core MoM annualised versus target — is what central banks actually watch between two meetings.`
            : `Le glissement annuel publié traîne douze mois d'histoire — effets de base compris, qui ne disent rien du rythme d'aujourd'hui. Le chiffre mensuel est l'information FRAÎCHE : annualisé, il dit à quel rythme les prix courent MAINTENANT, directement comparable à la cible de 2 %. C'est cette comparaison — core MoM annualisé contre cible — que les banques centrales regardent vraiment entre deux réunions.`,
        },
      ],
      pieges: [
        en
          ? `Multiplying by 12: ${pct(fauxNaif, 1)} instead of ${pct(reponse, 2)} — rejected here. The naive figure ALWAYS understates (compounding works against the consumer), and by more as the monthly print grows. One never multiplies rates; one compounds them: $(1 + m)^{12} - 1$, not $12m$.`
          : `Multiplier par 12 : ${pct(fauxNaif, 1)} au lieu de ${pct(reponse, 2)} — rejeté ici. Le chiffre naïf sous-estime TOUJOURS (la composition joue contre le consommateur), et d'autant plus que le mensuel grossit. On ne multiplie jamais des taux, on les compose : $(1 + m)^{12} - 1$, pas $12m$.`,
        en
          ? `Confusing this annualised MoM with the published year-on-year figure: the two can differ wildly the same day — the YoY carries a year of history (and its base effects), the annualised MoM extrapolates the current pace. When they diverge, the MoM is telling you where the YoY is heading.`
          : `Confondre ce MoM annualisé avec le glissement annuel publié : les deux peuvent différer fortement le même jour — le YoY porte un an d'histoire (et ses effets de base), le MoM annualisé extrapole le rythme courant. Quand ils divergent, le MoM dit où le YoY s'en va.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 8. L'effet de base (N3)
// ---------------------------------------------------------------------------
export const genEffetDeBase: ExerciseGenerator = {
  id: 'm10-ex-08',
  moduleId: M10,
  titre: 'L\'effet de base',
  titreEn: 'The base effect',
  difficulte: 3,
  // Tirages (ordre strict) : 1. choc = randFloat(2, 4, 1) · 2. croisiere =
  // randFloat(0.2, 0.4, 1).
  // Un mois de choc (+choc %) suivi d'un rythme de croisière (+croisiere %/mois).
  // Glissement annuel AVANT la sortie du choc : indiceDesPrix(100, [choc, 11 ×
  // croisiere]) ; APRÈS : indiceDesPrix(100, [12 × croisiere]). Réponse = chute
  // en points — le rythme courant n'a pas changé d'un iota. La tolérance (0,02)
  // rejette le naïf « la chute = le choc ».
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const choc = randFloat(rng, 2, 4, 1);
    const croisiere = randFloat(rng, 0.2, 0.4, 1);

    const avantExact = (indiceDesPrix(100, [choc, ...Array<number>(11).fill(croisiere)]) / 100 - 1) * 100;
    const apresExact = (indiceDesPrix(100, Array<number>(12).fill(croisiere)) / 100 - 1) * 100;
    const avant = r2(avantExact);
    const apres = r2(apresExact);
    const reponse = r2(avantExact - apresExact);

    const en = langue === 'en';
    const { f, pct } = formatters(langue);
    return {
      enonce: en
        ? `An energy shock lifts the price index by +${pct(choc, 1)} in the single month of March; every other month, prices rise at a cruising pace of +${pct(croisiere, 1)}. Twelve months later (the following March), the year-on-year figure still includes the shock month; one month later (April), the shock drops out of the twelve-month window.\n\n**By how many percentage points does the year-on-year inflation figure fall between these two publications?**`
        : `Un choc énergétique fait bondir l'indice des prix de +${pct(choc, 1)} sur le seul mois de mars ; tous les autres mois, les prix montent à un rythme de croisière de +${pct(croisiere, 1)}. Douze mois plus tard (le mars suivant), le glissement annuel inclut encore le mois du choc ; un mois après (avril), le choc sort de la fenêtre de douze mois.\n\n**De combien de points de pourcentage le glissement annuel chute-t-il entre ces deux publications ?**`,
      reponse,
      tolerance: 0.02,
      toleranceMode: 'absolu',
      unite: 'points',
      etapes: [
        {
          titre: en ? 'Before: the shock is still in the window' : 'Avant : le choc est encore dans la fenêtre',
          contenu: en
            ? `The year-on-year figure compares this month's index with the same month a year ago — twelve chained months. In March, the window holds the shock month plus eleven cruising months: $(1 + ${f(choc, 1)}\\,\\%) × (1 + ${f(croisiere, 1)}\\,\\%)^{11} - 1$ = **${pct(avant, 2)}**.`
            : `Le glissement annuel compare l'indice du mois au même mois un an plus tôt — douze mois chaînés. En mars, la fenêtre contient le mois du choc plus onze mois de croisière : $(1 + ${f(choc, 1)}\\,\\%) × (1 + ${f(croisiere, 1)}\\,\\%)^{11} - 1$ = **${pct(avant, 2)}**.`,
        },
        {
          titre: en ? 'After: the shock has left the window' : 'Après : le choc est sorti de la fenêtre',
          contenu: en
            ? `In April, the shock month leaves the window, replaced by an ordinary cruising month: $(1 + ${f(croisiere, 1)}\\,\\%)^{12} - 1$ = **${pct(apres, 2)}**. The fall is **${f(reponse, 2)} points** in a single month — while the CURRENT pace of prices has not changed by an iota: pure rolling-window arithmetic.`
            : `En avril, le mois du choc sort de la fenêtre, remplacé par un mois de croisière ordinaire : $(1 + ${f(croisiere, 1)}\\,\\%)^{12} - 1$ = **${pct(apres, 2)}**. La chute est de **${f(reponse, 2)} points** en un seul mois — alors que le rythme COURANT des prix n'a pas changé d'un iota : pure arithmétique de fenêtre glissante.`,
        },
        {
          titre: en ? 'Reading base effects like a desk' : 'Lire les effets de base comme un desk',
          contenu: en
            ? `Central bankers know it and announce it; markets price it; only the unprepared candidate marvels at a disinflation that is merely a shock's first anniversary. Spring 2023 played this in real life: the mechanical exit of the 2022 energy spikes did the first part of the headline's descent. The reflex in front of ANY year-on-year figure: ask what is ENTERING the window and what is LEAVING it.`
            : `Les banquiers centraux le savent et l'annoncent ; les marchés le pricent ; seul le candidat mal préparé s'extasie devant une désinflation qui n'est que le premier anniversaire d'un choc. Le printemps 2023 l'a joué en grandeur réelle : la sortie mécanique des pics énergétiques de 2022 a fait la première partie de la descente du headline. Le réflexe devant TOUT glissement annuel : demander ce qui ENTRE dans la fenêtre et ce qui en SORT.`,
        },
      ],
      pieges: [
        en
          ? `Answering "${pct(choc, 1)} — the shock leaves, the figure loses the shock": close, but wrong twice over. The shock month is REPLACED by a cruising month (+${pct(croisiere, 1)}), and the eleven other months rescale the whole difference — the exact fall is ${f(reponse, 2)} points, not ${f(choc, 1)}.`
          : `Répondre « ${pct(choc, 1)} — le choc sort, le chiffre perd le choc » : proche, mais faux deux fois. Le mois du choc est REMPLACÉ par un mois de croisière (+${pct(croisiere, 1)}), et les onze autres mois remettent à l'échelle toute la différence — la chute exacte est ${f(reponse, 2)} points, pas ${f(choc, 1)}.`,
        en
          ? `Reading the fall as a real slowdown: between March and April, nothing happened to prices — the monthly pace is +${pct(croisiere, 1)} on both sides. A desk that "celebrates the disinflation" of that April is trading a calendar artefact; the current pace was readable months in advance in the annualised MoM figure.`
          : `Lire la chute comme un ralentissement réel : entre mars et avril, il n'est rien arrivé aux prix — le rythme mensuel est de +${pct(croisiere, 1)} des deux côtés. Un desk qui « célèbre la désinflation » de cet avril-là trade un artefact de calendrier ; le rythme courant se lisait des mois à l'avance dans le MoM annualisé.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 9. La surprise en sigmas (N1)
// ---------------------------------------------------------------------------
export const genSurpriseSigmas: ExerciseGenerator = {
  id: 'm10-ex-09',
  moduleId: M10,
  titre: 'La surprise en sigmas',
  titreEn: 'The surprise in sigmas',
  difficulte: 1,
  // Tirages (ordre strict) : 1. mode = pick(['nfp', 'cpi']) · 2. consensusNfp =
  // randInt(150, 210) (milliers) · 3. sigmaNfp = pick([40, 50, 60]) (milliers)
  // · 4. signe = pick([1, −1]) · 5. magNfp = randInt(50, 130) (milliers)
  // · 6. consensusCpiDixiemes = randInt(28, 84) (→ ÷10 %) · 7. sigmaCpiCentiemes
  // = pick([10, 15, 20]) (→ ÷100 pt) · 8. magCpiCentiemes = randInt(20, 50) (→ ÷100 pt).
  // Réponse = surpriseIndicateur(consensus, publié, σ) — SANS UNITÉ, en sigmas.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const mode = pick(rng, ['nfp', 'cpi'] as const);
    const consensusNfp = randInt(rng, 150, 210);
    const sigmaNfp = pick(rng, [40, 50, 60] as const);
    const signe = pick(rng, [1, -1] as const);
    const magNfp = randInt(rng, 50, 130);
    const consensusCpiDixiemes = randInt(rng, 28, 84);
    const sigmaCpiCentiemes = pick(rng, [10, 15, 20] as const);
    const magCpiCentiemes = randInt(rng, 20, 50);

    const estNfp = mode === 'nfp';
    const consensus = estNfp ? consensusNfp : consensusCpiDixiemes / 10;
    const publie = estNfp ? consensusNfp + signe * magNfp : r2(consensusCpiDixiemes / 10 + (signe * magCpiCentiemes) / 100);
    const sigma = estNfp ? sigmaNfp : sigmaCpiCentiemes / 100;
    const ecartBrut = r2(publie - consensus);
    const reponse = r2(surpriseIndicateur(consensus, publie, sigma));
    const grosse = Math.abs(reponse) >= 1.5;

    const en = langue === 'en';
    const { f, sgn, pct } = formatters(langue);
    return {
      enonce: en
        ? estNfp
          ? `First Friday of the month, 8:30 in New York: the NFP comes out at ${f(publie * 1000, 0)} job creations against a consensus of ${f(consensus * 1000, 0)}. The historical standard deviation of NFP surprises is ${f(sigma * 1000, 0)}.\n\n**What is the standardised surprise, in sigmas (sign included)?**`
          : `CPI day: year-on-year inflation comes out at ${pct(publie, 2)} against a consensus of ${pct(consensus, 1)}. The historical standard deviation of CPI surprises is ${f(sigma, 2)} point.\n\n**What is the standardised surprise, in sigmas (sign included)?**`
        : estNfp
          ? `Premier vendredi du mois, 8 h 30 à New York : le NFP ressort à ${f(publie * 1000, 0)} créations d'emplois contre un consensus de ${f(consensus * 1000, 0)}. L'écart-type historique des surprises du NFP est de ${f(sigma * 1000, 0)}.\n\n**Quelle est la surprise standardisée, en sigmas (signe compris) ?**`
          : `Jour de CPI : l'inflation en glissement annuel ressort à ${pct(publie, 2)} contre un consensus de ${pct(consensus, 1)}. L'écart-type historique des surprises du CPI est de ${f(sigma, 2)} point.\n\n**Quelle est la surprise standardisée, en sigmas (signe compris) ?**`,
      reponse,
      tolerance: 0.05,
      toleranceMode: 'absolu',
      unite: 'σ',
      etapes: [
        {
          titre: en ? 'The consensus is already in the prices' : 'Le consensus est déjà dans les prix',
          contenu: en
            ? `Before the release, rates, the dollar and equities already quote a world at ${estNfp ? f(consensus * 1000, 0) : pct(consensus, 1)} — module 1's efficiency at work. Only the GAP to consensus moves prices: ${estNfp ? `${sgn(ecartBrut * 1000, 0)} jobs` : `${sgn(ecartBrut, 2)} point`} here. A figure in line with consensus, however spectacular in absolute terms, is a non-event.`
            : `Avant la publication, les taux, le dollar et les actions cotent déjà un monde à ${estNfp ? f(consensus * 1000, 0) : pct(consensus, 1)} — l'efficience du module 1 au travail. Seul l'ÉCART au consensus bouge les prix : ${estNfp ? `${sgn(ecartBrut * 1000, 0)} emplois` : `${sgn(ecartBrut, 2)} point`} ici. Un chiffre conforme au consensus, même spectaculaire dans l'absolu, est un non-événement.`,
        },
        {
          titre: en ? 'Standardise by the historical sigma' : 'Standardiser par le sigma historique',
          contenu: en
            ? `The same raw gap is colossal on one indicator and negligible on another: the yardstick is the historical standard deviation of surprises — module 2's σ, recycled. $\\text{surprise} = \\dfrac{\\text{published} - \\text{consensus}}{\\sigma} = \\dfrac{${sgn(ecartBrut, estNfp ? 0 : 2)}}{${f(sigma, estNfp ? 0 : 2)}}$${estNfp ? ' (in thousands)' : ''} = **${sgn(reponse, 2)}σ** — unitless, hence comparable across indicators: a CPI at +2σ and an NFP at +2σ are the same size of shock.`
            : `Le même écart brut est colossal sur un indicateur et négligeable sur un autre : l'étalon est l'écart-type historique des surprises — le σ du module 2, recyclé. $\\text{surprise} = \\dfrac{\\text{publié} - \\text{consensus}}{\\sigma} = \\dfrac{${sgn(ecartBrut, estNfp ? 0 : 2)}}{${f(sigma, estNfp ? 0 : 2)}}$${estNfp ? ' (en milliers)' : ''} = **${sgn(reponse, 2)}σ** — sans unité, donc comparable entre indicateurs : un CPI à +2σ et un NFP à +2σ sont la même taille de choc.`,
        },
        {
          titre: en ? 'Reading the size — and the direction' : 'Lire la taille — et la direction',
          contenu: en
            ? `${grosse ? `At ${sgn(reponse, 1)}σ, this is a genuine event — surprises of this size are a few percent of publications, and prices jump in milliseconds.` : `At ${sgn(reponse, 1)}σ, this is closer to noise than to an event: ±0.5σ is the daily weather of the calendar.`} Direction: a ${reponse > 0 ? 'positive' : 'negative'} ${estNfp ? 'employment' : 'inflation'} surprise ${reponse > 0 ? 'pushes the anticipated rate path UP — bad for bonds, and for equities in a "good news is bad news" regime like 2022' : 'pushes the anticipated rate path DOWN — good for bonds, and for equities when the central bank is the adversary'}. It is never the figure that moves the market: it is what the figure does to the central bank as anticipated.`
            : `${grosse ? `À ${sgn(reponse, 1)}σ, c'est un vrai événement — les surprises de cette taille font quelques pour cent des publications, et les prix sautent en millisecondes.` : `À ${sgn(reponse, 1)}σ, on est plus près du bruit que de l'événement : ±0,5σ est la météo ordinaire du calendrier.`} La direction : une surprise ${reponse > 0 ? 'haussière' : 'baissière'} ${estNfp ? 'd\'emploi' : 'd\'inflation'} ${reponse > 0 ? 'pousse le sentier de taux anticipé vers le HAUT — mauvais pour les obligations, et pour les actions en régime « good news is bad news » comme 2022' : 'pousse le sentier de taux anticipé vers le BAS — bon pour les obligations, et pour les actions quand la banque centrale est l\'adversaire'}. Ce n'est jamais le chiffre qui bouge le marché : c'est ce que le chiffre fait à la banque centrale anticipée.`,
        },
      ],
      pieges: [
        en
          ? `Reasoning on the published level ("${estNfp ? `${f(publie * 1000, 0)} jobs, the economy is doing great` : `${pct(publie, 2)} of inflation, bonds will collapse`}"): TV-news reasoning, not desk reasoning. If the consensus had been exactly there, nothing would have moved — the consensus is in the prices, only the surprise trades.`
          : `Raisonner sur le niveau publié (« ${estNfp ? `${f(publie * 1000, 0)} emplois, l'économie va très bien` : `${pct(publie, 2)} d'inflation, les obligations vont s'effondrer`} ») : un raisonnement de journal télévisé, pas de desk. Si le consensus avait été exactement là, rien n'aurait bougé — le consensus est dans les prix, seule la surprise se trade.`,
        en
          ? `Stopping at the raw gap (${estNfp ? `${sgn(ecartBrut * 1000, 0)} jobs` : `${sgn(ecartBrut, 2)} point`}): without the σ yardstick, unreadable — 40,000 is colossal for weekly claims, negligible for an NFP whose surprises spread over ±100,000. Dividing by sigma is what turns a number into a size.`
          : `S'arrêter à l'écart brut (${estNfp ? `${sgn(ecartBrut * 1000, 0)} emplois` : `${sgn(ecartBrut, 2)} point`}) : sans l'étalon σ, illisible — 40 000, c'est colossal pour des claims hebdomadaires, négligeable pour un NFP dont les surprises s'étalent sur ±100 000. Diviser par le sigma, c'est ce qui transforme un chiffre en taille.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 10. La probabilité implicite dans le future (N2)
// ---------------------------------------------------------------------------
export const genProbabiliteImplicite: ExerciseGenerator = {
  id: 'm10-ex-10',
  moduleId: M10,
  titre: 'La probabilité implicite dans le future',
  titreEn: 'The probability implied by the future',
  difficulte: 2,
  // Tirages (ordre strict) : 1. tauxActuel = pick([2, 2.5, 3, 3.5, 3.75, 4, 4.25])
  // · 2. pas = pick([25, 50]) · 3. prob = 4 × randInt(5, 22) (20 à 88 %, multiple
  // de 4 pour que le prix du future tombe juste au centième).
  // Prix affiché = 100 − (taux + prob·pas/10000) — la convention prix = 100 − taux
  // et l'interpolation à trois soustractions du chapitre 6 (pas de fonction dédiée
  // dans calculs.ts : c'est l'arithmétique FedWatch elle-même).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const tauxActuel = pick(rng, [2, 2.5, 3, 3.5, 3.75, 4, 4.25] as const);
    const pas = pick(rng, [25, 50] as const);
    const prob = 4 * randInt(rng, 5, 22);

    const tauxImplicite = r2(tauxActuel + (prob / 100) * (pas / 100));
    const prix = r2(100 - tauxImplicite);
    const tauxHausse = r2(tauxActuel + pas / 100);
    const reponse = prob;
    const fauxComplement = 100 - prob;

    const en = langue === 'en';
    const { f, pct } = formatters(langue);
    return {
      enonce: en
        ? `The effective overnight rate stands at ${pct(tauxActuel, 2)}, and a single question is on the table for the next meeting: a hike of ${f(pas, 0)} bp, or nothing. The rate future for the month following the meeting quotes ${f(prix, 2)}.\n\n**What probability of a hike is the market pricing, in %?**`
        : `Le taux effectif au jour le jour est à ${pct(tauxActuel, 2)}, et une seule question est sur la table pour la prochaine réunion : une hausse de ${f(pas, 0)} pb, ou rien. Le future de taux du mois qui suit la réunion cote ${f(prix, 2)}.\n\n**Quelle probabilité de hausse le marché price-t-il, en % ?**`,
      reponse,
      tolerance: 1,
      toleranceMode: 'absolu',
      unite: '%',
      etapes: [
        {
          titre: en ? 'From the price to the implied rate' : 'Du prix au taux implicite',
          contenu: en
            ? `The futures convention: price = 100 − expected average rate. So $100 - ${f(prix, 2)}$ = **${pct(tauxImplicite, 2)}** — the average rate the market expects over that month. It is neither ${pct(tauxActuel, 2)} (no hike) nor ${pct(tauxHausse, 2)} (certain hike): it sits in between, and that in-between is information.`
            : `La convention des futures : prix = 100 − taux moyen attendu. Donc $100 - ${f(prix, 2)}$ = **${pct(tauxImplicite, 2)}** — le taux moyen que le marché attend sur ce mois-là. Ce n'est ni ${pct(tauxActuel, 2)} (aucune hausse) ni ${pct(tauxHausse, 2)} (hausse certaine) : c'est entre les deux, et cet entre-deux est une information.`,
        },
        {
          titre: en ? 'The probability-weighted average' : 'La moyenne pondérée par les probabilités',
          contenu: en
            ? `With only two outcomes, the implied rate is an expectation: $p × ${f(tauxHausse, 2)} + (1 - p) × ${f(tauxActuel, 2)} = ${f(tauxImplicite, 2)}$, hence $p = \\dfrac{${f(tauxImplicite, 2)} - ${f(tauxActuel, 2)}}{${f(tauxHausse, 2)} - ${f(tauxActuel, 2)}}$ = **${pct(reponse, 0)}**. Three subtractions — this is exactly how the "according to markets" probabilities quoted in the press are made (CME's FedWatch does nothing else).`
            : `À deux issues seulement, le taux implicite est une espérance : $p × ${f(tauxHausse, 2)} + (1 - p) × ${f(tauxActuel, 2)} = ${f(tauxImplicite, 2)}$, d'où $p = \\dfrac{${f(tauxImplicite, 2)} - ${f(tauxActuel, 2)}}{${f(tauxHausse, 2)} - ${f(tauxActuel, 2)}}$ = **${pct(reponse, 0)}**. Trois soustractions — c'est exactement ainsi que se fabriquent les probabilités « selon les marchés » citées dans la presse (le FedWatch du CME ne fait rien d'autre).`,
        },
        {
          titre: en ? 'From one meeting to the whole path' : 'D\'une réunion au sentier complet',
          contenu: en
            ? `Chain the futures month after month and you rebuild the whole anticipated path, up to the terminal rate. This is where indicator surprises land: a +2σ CPI shifts this very price within seconds, the probability jumps from ${pct(reponse, 0)} to something else, the path moves, the curve follows, then the dollar and equities. The indicator never moves prices directly — it moves the anticipated central bank, which moves everything else.`
            : `Chaînez les futures de mois en mois et vous reconstruisez tout le sentier anticipé, jusqu'au taux terminal. C'est ici qu'atterrissent les surprises d'indicateurs : un CPI à +2σ déplace ce prix-là en quelques secondes, la probabilité saute de ${pct(reponse, 0)} à autre chose, le sentier bouge, la courbe suit, puis le dollar et les actions. L'indicateur ne bouge jamais les prix directement — il bouge la banque centrale anticipée, qui bouge tout le reste.`,
        },
      ],
      pieges: [
        en
          ? `Reading 100 − price as a probability: ${pct(tauxImplicite, 2)} is a RATE, not a probability. The futures price encodes the expected average rate; the probability only appears once you interpolate that rate between the two possible outcomes.`
          : `Lire 100 − prix comme une probabilité : ${pct(tauxImplicite, 2)} est un TAUX, pas une probabilité. Le prix du future encode le taux moyen attendu ; la probabilité n'apparaît qu'en interpolant ce taux entre les deux issues possibles.`,
        en
          ? `Taking the complement: ${pct(fauxComplement, 0)} instead of ${pct(reponse, 0)}. Anchor the interpolation: implied rate AT the current rate ⇒ 0% chance of a hike; AT the hiked rate ⇒ 100%. The probability measures how far the implied rate has travelled TOWARDS the hike.`
          : `Prendre le complément : ${pct(fauxComplement, 0)} au lieu de ${pct(reponse, 0)}. Ancrez l'interpolation : taux implicite AU taux actuel ⇒ 0 % de chances de hausse ; AU taux relevé ⇒ 100 %. La probabilité mesure le chemin parcouru par le taux implicite VERS la hausse.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 11. Le taux terminal anticipé (N1)
// ---------------------------------------------------------------------------
export const genTauxTerminal: ExerciseGenerator = {
  id: 'm10-ex-11',
  moduleId: M10,
  titre: 'Le taux terminal anticipé',
  titreEn: 'The anticipated terminal rate',
  difficulte: 1,
  // Tirages (ordre strict) : 1. sens = pick(['hausse', 'baisse']) · 2. departHausse
  // = pick([0.5, 1, 1.5, 2, 2.5, 3]) · 3. departBaisse = pick([4, 4.5, 5, 5.25, 5.5])
  // · 4. n = randInt(3, 6) · 5. pas = pick([25, 50]).
  // Réponse = tauxTerminalAnticipe(taux, n, ±pas) — pas en pb, résultat en %.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const sens = pick(rng, ['hausse', 'baisse'] as const);
    const departHausse = pick(rng, [0.5, 1, 1.5, 2, 2.5, 3] as const);
    const departBaisse = pick(rng, [4, 4.5, 5, 5.25, 5.5] as const);
    const n = randInt(rng, 3, 6);
    const pas = pick(rng, [25, 50] as const);

    const estBaisse = sens === 'baisse';
    const taux = estBaisse ? departBaisse : departHausse;
    const pasSigne = estBaisse ? -pas : pas;
    const reponse = r2(tauxTerminalAnticipe(taux, n, pasSigne));
    const totalPb = n * pas;
    const totalPct = r2(totalPb / 100);
    const fauxSansConversion = r2(taux + (estBaisse ? -1 : 1) * n * pas);
    const fauxDixieme = r2(taux + (estBaisse ? -1 : 1) * (n * pas) / 1000);

    const en = langue === 'en';
    const { f, pct } = formatters(langue);
    return {
      enonce: en
        ? estBaisse
          ? `The policy rate stands at ${pct(taux, 2)} and the futures market prices ${f(n, 0)} cuts of ${f(pas, 0)} bp each for the cycle under way.\n\n**What terminal rate is the market anticipating, in %?**`
          : `The policy rate stands at ${pct(taux, 2)} and the futures market prices ${f(n, 0)} hikes of ${f(pas, 0)} bp each for the cycle under way.\n\n**What terminal rate is the market anticipating, in %?**`
        : estBaisse
          ? `Le taux directeur est à ${pct(taux, 2)} et le marché des futures price ${f(n, 0)} baisses de ${f(pas, 0)} pb chacune pour le cycle en cours.\n\n**Quel taux terminal le marché anticipe-t-il, en % ?**`
          : `Le taux directeur est à ${pct(taux, 2)} et le marché des futures price ${f(n, 0)} hausses de ${f(pas, 0)} pb chacune pour le cycle en cours.\n\n**Quel taux terminal le marché anticipe-t-il, en % ?**`,
      reponse,
      tolerance: 0.01,
      toleranceMode: 'absolu',
      unite: '%',
      etapes: [
        {
          titre: en ? 'Basis points, the committees\' language' : 'Les points de base, la langue des comités',
          contenu: en
            ? `Policy steps are quoted in BASIS POINTS — 25 or 50 bp, the granularity of committees — and 100 bp = 1%. The cycle's total move: $${f(n, 0)} × ${f(pas, 0)}$ = **${f(totalPb, 0)} bp**, i.e. ${pct(totalPct, 2)}.`
            : `Les pas de politique monétaire se cotent en POINTS DE BASE — 25 ou 50 pb, la granularité des comités — et 100 pb = 1 %. Le mouvement total du cycle : $${f(n, 0)} × ${f(pas, 0)}$ = **${f(totalPb, 0)} pb**, soit ${pct(totalPct, 2)}.`,
        },
        {
          titre: en ? 'The terminal rate' : 'Le taux terminal',
          contenu: en
            ? `$\\text{terminal} = ${f(taux, 2)} ${estBaisse ? '−' : '+'} ${f(totalPct, 2)}$ = **${pct(reponse, 2)}** — the ${estBaisse ? 'floor' : 'peak'} the market expects for this cycle. The sophistication is never in the formula: it is in what the market puts into n and into the step, read continuously from fed funds futures and €STR swaps, meeting by meeting.`
            : `$\\text{terminal} = ${f(taux, 2)} ${estBaisse ? '−' : '+'} ${f(totalPct, 2)}$ = **${pct(reponse, 2)}** — le ${estBaisse ? 'plancher' : 'sommet'} que le marché attend pour ce cycle. La sophistication n'est jamais dans la formule : elle est dans ce que le marché met dans n et dans le pas, lu en continu dans les futures fed funds et les swaps €STR, réunion par réunion.`,
        },
        {
          titre: en ? 'The scale of real cycles' : 'L\'échelle des vrais cycles',
          contenu: en
            ? `Keep 2022-2023 as the yardstick: ECB from −0.50% to 4.00% in fourteen months (+450 bp), Fed from 0.25% to 5.50% in sixteen (+525 bp) — the most violent tightening since Volcker, entirely readable, meeting after meeting, in this step arithmetic. Desks compare this market-implied terminal with the Fed's dot plots and with their in-house Taylor rule: three versions of the same number, and the gaps between them are the trade.`
            : `Gardez 2022-2023 comme étalon : BCE de −0,50 % à 4,00 % en quatorze mois (+450 pb), Fed de 0,25 % à 5,50 % en seize (+525 pb) — les resserrements les plus violents depuis Volcker, entièrement lisibles, réunion après réunion, dans cette arithmétique de pas. Les desks comparent ce terminal implicite du marché aux dot plots de la Fed et à leur règle de Taylor maison : trois versions du même chiffre, et les écarts entre elles font le trade.`,
        },
      ],
      pieges: [
        en
          ? `The bp conversion, both ways to fail it: no conversion gives ${f(fauxSansConversion, 2)}% (adding raw basis points to a percentage), dividing by 1,000 gives ${pct(fauxDixieme, 2)}. Anchor: ${f(pas, 0)} bp = ${pct(pas / 100, 2)} — neither ${pct(pas, 0)} nor ${pct(pas / 1000, 3)}.`
          : `La conversion des pb, deux façons de la rater : sans conversion, ${f(fauxSansConversion, 2)} % (additionner des points de base bruts à un pourcentage) ; en divisant par 1 000, ${pct(fauxDixieme, 2)}. L'ancre : ${f(pas, 0)} pb = ${pct(pas / 100, 2)} — ni ${pct(pas, 0)} ni ${pct(pas / 1000, 3)}.`,
        en
          ? `Reading the terminal as a promise: it is an ANTICIPATION, repriced continuously — every indicator surprise moves n and the step (that is exactly what "the CPI shifted the path" means). The terminal of a given morning is a photograph of the market's mind, not the central bank's commitment.`
          : `Lire le terminal comme une promesse : c'est une ANTICIPATION, re-pricée en continu — chaque surprise d'indicateur déplace n et le pas (c'est exactement ce que « le CPI a déplacé le sentier » veut dire). Le terminal d'un matin donné est une photographie de la tête du marché, pas un engagement de la banque centrale.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 12. Le choc de taux sur le portefeuille obligataire (N2)
// ---------------------------------------------------------------------------
export const genChocDuration: ExerciseGenerator = {
  id: 'm10-ex-12',
  moduleId: M10,
  titre: 'Le choc de taux sur le portefeuille obligataire',
  titreEn: 'The rate shock on the bond portfolio',
  difficulte: 2,
  // Tirages (ordre strict) : 1. duration = randFloat(3, 9, 1) · 2. deltaPb =
  // pick([50, 75, 100, 150, 200, 300]) · 3. sens = pick(['hausse', 'hausse',
  // 'baisse']) (le cycle 2022 en scénario dominant).
  // Réponse = variationPrixObligationDuration(D, ±Δy en pb) — Δy en POINTS DE
  // BASE, réponse en % (le pont m4 : ΔP/P ≈ −D_mod × Δy).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const duration = randFloat(rng, 3, 9, 1);
    const deltaPb = pick(rng, [50, 75, 100, 150, 200, 300] as const);
    const sens = pick(rng, ['hausse', 'hausse', 'baisse'] as const);

    const estHausse = sens === 'hausse';
    const deltaSigne = estHausse ? deltaPb : -deltaPb;
    const reponse = r2(variationPrixObligationDuration(duration, deltaSigne));
    const fauxSansConversion = r2(-duration * deltaSigne);
    const deltaPct = r2(deltaPb / 100);

    const en = langue === 'en';
    const { f, pct, sgn } = formatters(langue);
    return {
      enonce: en
        ? estHausse
          ? `A surprise turn in central-bank communication pushes the whole curve up by ${f(deltaPb, 0)} bp. You hold a government-bond portfolio with a modified duration of ${f(duration, 1)}.\n\n**What is the approximate price impact on the portfolio, in % (sign included)?**`
          : `A dovish pivot pushes the whole curve down by ${f(deltaPb, 0)} bp. You hold a government-bond portfolio with a modified duration of ${f(duration, 1)}.\n\n**What is the approximate price impact on the portfolio, in % (sign included)?**`
        : estHausse
          ? `Un tournant surprise de la communication de la banque centrale pousse toute la courbe de ${f(deltaPb, 0)} pb vers le haut. Vous détenez un portefeuille d'obligations d'État de duration modifiée ${f(duration, 1)}.\n\n**Quel est l'impact approché sur le prix du portefeuille, en % (signe compris) ?**`
          : `Un pivot accommodant pousse toute la courbe de ${f(deltaPb, 0)} pb vers le bas. Vous détenez un portefeuille d'obligations d'État de duration modifiée ${f(duration, 1)}.\n\n**Quel est l'impact approché sur le prix du portefeuille, en % (signe compris) ?**`,
      reponse,
      tolerance: 0.05,
      toleranceMode: 'absolu',
      unite: '%',
      etapes: [
        {
          titre: en ? 'The most mechanical channel there is' : 'Le canal le plus mécanique qui soit',
          contenu: en
            ? `Module 4's formula, applied to monetary policy: $\\dfrac{\\Delta P}{P} ≈ -D_{mod} × \\Delta y$, with Δy in BASIS POINTS and the answer in %. Convert first: ${f(deltaPb, 0)} bp = ${pct(deltaPct, 2)} ${estHausse ? '' : '(downwards)'}.`
            : `La formule du module 4, appliquée à la politique monétaire : $\\dfrac{\\Delta P}{P} ≈ -D_{mod} × \\Delta y$, avec Δy en POINTS DE BASE et la réponse en %. Convertir d'abord : ${f(deltaPb, 0)} pb = ${pct(deltaPct, 2)} ${estHausse ? '' : '(vers le bas)'}.`,
        },
        {
          titre: en ? 'The number' : 'Le chiffre',
          contenu: en
            ? `$\\Delta P/P ≈ -${f(duration, 1)} × ${estHausse ? '' : '(−'}${f(deltaPct, 2)}\\,\\%${estHausse ? '' : ')'}$ = **${sgn(reponse, 2)}%**. ${estHausse ? 'Rates up, prices down: the minus sign in front of the duration is the whole transmission — the promised cash flows have not changed, only the rate that discounts them.' : 'Rates down, prices up: the symmetry explains why rate-cutting years are the great bond vintages.'} Duration is a lever: the same shock on a duration of 2 barely bends a short bond, and triples the damage on a 30-year.`
            : `$\\Delta P/P ≈ -${f(duration, 1)} × ${estHausse ? '' : '(−'}${f(deltaPct, 2)}\\,\\%${estHausse ? '' : ')'}$ = **${sgn(reponse, 2)} %**. ${estHausse ? 'Taux en hausse, prix en baisse : le signe moins devant la duration est toute la transmission — les flux promis n\'ont pas changé, seul le taux qui les actualise a bougé.' : 'Taux en baisse, prix en hausse : la symétrie explique pourquoi les années de baisse de taux sont les grands crus obligataires.'} La duration est un levier : le même choc sur une duration de 2 plie à peine une obligation courte, et triple les dégâts sur un 30 ans.`,
        },
        {
          titre: en ? '2022, the full-scale demonstration' : '2022, la démonstration grandeur nature',
          contenu: en
            ? `Put the 2022 cycle into the formula: +300 bp on a duration of 7 gives −21%, on a duration of 8, −24% — that is how the "risk-free asset" signed the worst year of its modern history (Bloomberg Global Aggregate around −17%). Risk-free means free of DEFAULT risk, never of price risk. One refinement from module 4: this linear approximation is pessimistic for the holder — convexity makes the true loss smaller and the true gain larger.`
            : `Mettez le cycle 2022 dans la formule : +300 pb sur une duration de 7 donnent −21 %, sur une duration de 8, −24 % — c'est ainsi que « l'actif sans risque » a signé la pire année de son histoire moderne (Bloomberg Global Aggregate autour de −17 %). Sans risque signifie sans risque de DÉFAUT, jamais sans risque de prix. Un raffinement du module 4 : cette approximation linéaire est pessimiste pour le porteur — la convexité rend la vraie perte plus petite et le vrai gain plus grand.`,
        },
      ],
      pieges: [
        en
          ? `Skipping the bp conversion: $-${f(duration, 1)} × ${f(deltaSigne, 0)}$ = ${f(fauxSansConversion, 0)}% — an absurdity (a bond cannot lose more than everything). Δy enters the formula in basis points and the conversion returns %: 100 bp = 1%, always.`
          : `Sauter la conversion des pb : $-${f(duration, 1)} × ${f(deltaSigne, 0)}$ = ${f(fauxSansConversion, 0)} % — une absurdité (une obligation ne peut pas perdre plus que tout). Δy entre dans la formule en points de base et la conversion rend des % : 100 pb = 1 %, toujours.`,
        en
          ? estHausse
            ? `Getting the sign wrong: rates UP means prices DOWN — the answer is ${sgn(reponse, 2)}%, not +${f(Math.abs(reponse), 2)}%. And remember where duration hides beyond bonds: growth stocks, pension funds, bank balance sheets (SVB) — everywhere a distant promise meets a rate.`
            : `Getting the sign wrong: rates DOWN means prices UP — the answer is ${sgn(reponse, 2)}%, not −${f(Math.abs(reponse), 2)}%. And remember where duration hides beyond bonds: growth stocks, pension funds, bank balance sheets (SVB) — everywhere a distant promise meets a rate.`
          : estHausse
            ? `Se tromper de signe : des taux en HAUSSE font des prix en BAISSE — la réponse est ${sgn(reponse, 2)} %, pas +${f(Math.abs(reponse), 2)} %. Et retenez où la duration se cache au-delà des obligations : valeurs de croissance, fonds de pension, bilans bancaires (SVB) — partout où une promesse lointaine rencontre un taux.`
            : `Se tromper de signe : des taux en BAISSE font des prix en HAUSSE — la réponse est ${sgn(reponse, 2)} %, pas −${f(Math.abs(reponse), 2)} %. Et retenez où la duration se cache au-delà des obligations : valeurs de croissance, fonds de pension, bilans bancaires (SVB) — partout où une promesse lointaine rencontre un taux.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// Export : les 12 générateurs du module, dans l'ordre de progression du cours
// ---------------------------------------------------------------------------
export const exercices: ExerciseGenerator[] = [
  genTauxReelFisher,
  genTauxNominalRequis,
  genRegleTaylor,
  genPrincipeTaylor,
  genErosionPouvoirAchat,
  genChainageIndice,
  genAnnualisationMensuelle,
  genEffetDeBase,
  genSurpriseSigmas,
  genProbabiliteImplicite,
  genTauxTerminal,
  genChocDuration,
];
