/**
 * Moules de problèmes multi-étapes du module Macro & banques centrales —
 * LOT 1 : les 8 moules N1/N2 (m10-pb-01 à m10-pb-08).
 * 4 N1 (la première réunion du comité et la règle de Taylor, mon salaire et
 * l'inflation, lire un chiffre d'inflation, la mensualité et le canal des
 * taux) et 4 N2 (le desk obligataire face au CPI, pricer les réunions par
 * les futures, le QE en pratique, taux réels et classes d'actifs).
 * Chaque moule : 3 scénarios FR + EN (habillages ET bornes de tirage
 * différents), sous-questions chaînées (la sortie de a) nourrit b), c)…),
 * corrigés calculés via calculs.ts (m10 + m4) — jamais de texte figé.
 * INVARIANT BILINGUE : tous les tirages aléatoires ont lieu AVANT toute branche
 * de langue — même seed + même scénario ⇒ mêmes nombres en français et en anglais.
 * Conventions (en-tête de calculs.ts) : taux, inflations et gaps en % ;
 * composition DISCRÈTE annuelle (1 + x)^n, celle des indices de prix et des
 * taux directeurs — PAS l'actualisation continue du m8/m9 ; les pas de
 * politique monétaire en POINTS DE BASE (25 pb = 0,25 %) ; la surprise
 * d'indicateur SANS UNITÉ (en sigmas). L'annuité du crédit du canal des taux
 * est composée depuis va() du m4 (aucune formule recopiée) : le facteur
 * d'annuité est la somme des va(1, taux mensuel, t) — la convention du
 * tableau « 250 000 € sur 20 ans : 1 150 € à 1 %, 1 515 € à 4 % » du ch3.
 * Les chiffres institutionnels et historiques des habillages (cibles, bornes
 * de cycle 2022-2023, bilans, épisodes Volcker/taper tantrum/gilts) sont ceux
 * des sept chapitres relus du module.
 */
import { formatNombreLangue } from '../../../engine/answers';
import { mulberry32, randFloat, randInt } from '../../../engine/rng';
import type { Langue, ProblemGenerator } from '../../../engine/types';
import { va } from '../04-taux-obligations/calculs';
import {
  indiceDesPrix, inflationAnnualiseeDepuisMensuelle, interetsComposesInflation,
  regleDeTaylor, surpriseIndicateur, tauxNominalRequis, tauxReelApproche,
  tauxReelFisher, tauxTerminalAnticipe, variationPrixObligationDuration,
} from './calculs';

/** Un « moule » de problème est un ProblemGenerator de l'engine (alias local). */
export type ProblemeMoule = ProblemGenerator;

const M10 = '10-macro-banques-centrales';
const r2 = (v: number) => Math.round(v * 100) / 100;

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

/**
 * Facteur d'annuité mensuel : somme des va(1, taux annuel/12, t) du m4 sur
 * `mois` mensualités — le prix aujourd'hui d'un euro par mois. La mensualité
 * d'un crédit de C est C / facteur ; la capacité d'emprunt d'une mensualité M
 * est M × facteur. Convention du ch3 (taux mensuel = taux annuel / 12).
 */
function facteurAnnuite(tauxAnnuelPct: number, mois: number): number {
  let s = 0;
  for (let t = 1; t <= mois; t++) s += va(1, tauxAnnuelPct / 12, t);
  return s;
}

/* ------------------------------------------------------------------ */
/* 1. m10-pb-01 — La première réunion du comité (règle de Taylor) — N1 */
/* ------------------------------------------------------------------ */
const premierComite: ProblemeMoule = {
  id: 'm10-pb-01', moduleId: M10,
  titre: 'Ma première réunion du comité : la règle de Taylor de bout en bout',
  titreEn: 'A first policy meeting: the Taylor rule from end to end',
  typeDeCas: 'règle de Taylor',
  typeDeCasEn: 'Taylor rule',
  difficulte: 1,
  scenarios: ["Le nouveau membre du comité prépare son premier vote (zone euro, l'inflation déborde)", "L'économiste du desk vérifie si la Fed est « behind the curve » (printemps 2022)", "L'oral du jury : « prescrivez le taux, puis jugez le banquier central » (petite économie ouverte)"],
  scenariosEn: ['The new committee member prepares her first vote (euro area, inflation overshooting)', 'The desk economist checks whether the Fed is behind the curve (spring 2022)', 'The oral exam: "prescribe the rate, then judge the central banker" (small open economy)'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : taux neutre, inflation, gap, taux directeur courant.
    const cfg = ([
      { rsMin: 1.5, rsMax: 2.5, piMin: 3.6, piMax: 5.5, gMin: -1.5, gMax: 0.5, taMin: 8, taMax: 14 },
      { rsMin: 0.5, rsMax: 1.5, piMin: 6.5, piMax: 9.0, gMin: 0.5, gMax: 1.5, taMin: 1, taMax: 4 },
      { rsMin: 2.0, rsMax: 3.0, piMin: 4.0, piMax: 6.0, gMin: -2.0, gMax: -0.5, taMin: 10, taMax: 16 },
    ] as const)[sIdx];
    const rStar = randFloat(rng, cfg.rsMin, cfg.rsMax, 1);
    const pi = randFloat(rng, cfg.piMin, cfg.piMax, 1);
    const gap = randFloat(rng, cfg.gMin, cfg.gMax, 1);
    const tauxActuel = randInt(rng, cfg.taMin, cfg.taMax) * 0.25; // quarts de point, la granularité des comités
    const cible = 2;
    const nominalNeutre = r2(rStar + pi);
    const taylor = r2(regleDeTaylor(rStar, pi, cible, gap));
    const retard = r2(taylor - tauxActuel);
    const reel = r2(tauxReelFisher(tauxActuel, pi));
    const reelApp = r2(tauxReelApproche(tauxActuel, pi));
    const taylorPlus = r2(regleDeTaylor(rStar, pi + 1, cible, gap));

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `current inflation ${pct(pi, 1)} against a ${pct(cible, 0)} target, real neutral rate estimated at ${pct(rStar, 1)}, output gap ${pct(gap, 1)}, policy rate currently at ${pct(tauxActuel, 2)}; Taylor-1993 coefficients (a = b = 0.5)`
      : `inflation courante ${pct(pi, 1)} contre une cible de ${pct(cible, 0)}, taux neutre réel estimé à ${pct(rStar, 1)}, écart de production ${pct(gap, 1)}, taux directeur actuellement à ${pct(tauxActuel, 2)} ; coefficients Taylor 1993 (a = b = 0,5)`;
    const contexte = (en
      ? [
        `First policy meeting, and the newest committee member wants her own number before hearing anyone else's: ${desc}. Her checklist is the chapter's: the nominal neutral rate, the full Taylor prescription, the distance to the current policy rate — and the real-rate verdict that says whether the institution is actually braking.`,
        `Spring 2022 on the rates desk: CPI prints keep breaking forty-year records while the policy rate has barely left the floor. The economist rebuilds the desk's favourite sentence — "the Fed is N points below its Taylor rule": ${desc}. Prescription, gap to the actual rate, real rate — and what one more point of inflation would do to the prescription.`,
        `Oral exam. The examiner hands over one line of data for a small open economy and wants the full chain: ${desc}. Expected: the nominal neutral rate, the prescription, the "behind or ahead" verdict in points, the real rate that settles the restrictive-or-not debate — and the Taylor principle demonstrated with a one-point inflation shock.`,
      ]
      : [
        `Première réunion de politique monétaire, et la nouvelle membre du comité veut son propre chiffre avant d'écouter ceux des autres : ${desc}. Sa liste de contrôle est celle du chapitre : le taux nominal neutre, la prescription de Taylor complète, la distance au taux directeur courant — et le verdict du taux réel, qui dit si l'institution freine vraiment.`,
        `Printemps 2022 sur le desk taux : les CPI enchaînent les records de quarante ans pendant que le taux directeur quitte à peine le plancher. L'économiste reconstruit la phrase préférée du desk — « la Fed est N points sous sa Taylor » : ${desc}. Prescription, écart au taux effectif, taux réel — et ce qu'un point d'inflation en plus ferait à la prescription.`,
        `Oral de fin de module. L'examinateur tend une ligne de données d'une petite économie ouverte et veut la chaîne complète : ${desc}. Attendu : le taux nominal neutre, la prescription, le verdict « en retard ou en avance » en points, le taux réel qui tranche le débat restrictif-ou-pas — et le principe de Taylor démontré par un choc d'un point d'inflation.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The starting point: the nominal neutral rate' : 'a) Le point de départ : le taux nominal neutre',
          enonce: en
            ? `Before any penalty, where is the "zero" of the policy — the nominal rate that neither stimulates nor brakes, given r* = ${pct(rStar, 1)} and current inflation ${pct(pi, 1)}? In %.`
            : `Avant toute pénalité, où est le « zéro » de la politique — le taux nominal qui ne stimule ni ne freine, avec r* = ${pct(rStar, 1)} et une inflation courante de ${pct(pi, 1)} ? En %.`,
          reponse: nominalNeutre, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'Nominal neutral = r* + π' : 'Nominal neutre = r* + π',
            contenu: en
              ? `The committee sets a NOMINAL rate, but the economy responds to the REAL one: the neutral point is $r^* + \\pi$ = ${f(rStar, 1)} + ${f(pi, 1)} = **${pct(nominalNeutre, 2)}**. Below it, policy stimulates; above it, it brakes. Everything the Taylor rule adds next is a correction around this anchor — and remember from the chapter that r* is UNOBSERVABLE, estimated with error bars of a full point.`
              : `Le comité fixe un taux NOMINAL, mais l'économie répond au RÉEL : le point neutre est $r^* + \\pi$ = ${f(rStar, 1)} + ${f(pi, 1)} = **${pct(nominalNeutre, 2)}**. En dessous, la politique stimule ; au-dessus, elle freine. Tout ce que la règle de Taylor ajoute ensuite n'est qu'une correction autour de cet ancrage — et souvenez-vous du chapitre : r* est INOBSERVABLE, estimé avec des barres d'erreur d'un point entier.`,
          }],
          pieges: [en
            ? `Taking r* alone (${pct(rStar, 1)}) as the neutral policy rate forgets that r* is REAL: the rate the committee sets is nominal, so current inflation must be added back.`
            : `Prendre r* seul (${pct(rStar, 1)}) comme taux neutre oublie que r* est RÉEL : le taux que le comité fixe est nominal, il faut lui rajouter l'inflation courante.`],
        },
        {
          intitule: en ? 'b) The prescription: the full Taylor rule' : 'b) La prescription : la règle de Taylor complète',
          enonce: en
            ? `Add the two corrections to a): the inflation-gap penalty (a = 0.5, target ${pct(cible, 0)}) and the output-gap term (b = 0.5, gap ${pct(gap, 1)}). What policy rate does the rule prescribe, in %?`
            : `Ajoutez au a) les deux corrections : la pénalité d'écart d'inflation (a = 0,5, cible ${pct(cible, 0)}) et le terme d'écart de production (b = 0,5, gap ${pct(gap, 1)}). Quel taux directeur la règle prescrit-elle, en % ?`,
          reponse: taylor, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'i = r* + π + 0.5·(π − π*) + 0.5·gap' : 'i = r* + π + 0,5·(π − π*) + 0,5·gap',
            contenu: en
              ? `$i = r^* + \\pi + a\\,(\\pi - \\pi^*) + b \\cdot \\text{gap}$ = ${f(rStar, 1)} + ${f(pi, 1)} + 0.5 × ${f(r2(pi - cible), 1)} ${gap >= 0 ? '+' : '−'} 0.5 × ${f(Math.abs(gap), 1)} = **${pct(taylor, 2)}**. Written by John Taylor in 1993 to DESCRIBE the Greenspan Fed, recited since then in every desk conversation. The two corrections read separately: ${f(r2(0.5 * (pi - cible)), 2)} point${Math.abs(0.5 * (pi - cible)) >= 1.995 ? 's' : ''} of inflation penalty, ${f(r2(0.5 * gap), 2)} point${Math.abs(0.5 * gap) >= 1.995 ? 's' : ''} of cyclical correction.`
              : `$i = r^* + \\pi + a\\,(\\pi - \\pi^*) + b \\cdot \\text{gap}$ = ${f(rStar, 1)} + ${f(pi, 1)} + 0,5 × ${f(r2(pi - cible), 1)} ${gap >= 0 ? '+' : '−'} 0,5 × ${f(Math.abs(gap), 1)} = **${pct(taylor, 2)}**. Écrite par John Taylor en 1993 pour DÉCRIRE la Fed de Greenspan, récitée depuis dans toutes les conversations de desk. Les deux corrections se lisent séparément : ${f(r2(0.5 * (pi - cible)), 2)} point${Math.abs(0.5 * (pi - cible)) >= 1.995 ? 's' : ''} de pénalité d'inflation, ${f(r2(0.5 * gap), 2)} point${Math.abs(0.5 * gap) >= 1.995 ? 's' : ''} de correction conjoncturelle.`,
          }],
          pieges: [en
            ? `Forgetting the standalone π term (writing i = r* + 0.5·(π − π*) + 0.5·gap) is the classic slip: it prescribes ${pct(r2(taylor - pi), 2)} — a rate that would not even keep up with inflation.`
            : `Oublier le terme π seul (écrire i = r* + 0,5·(π − π*) + 0,5·gap) est l'étourderie classique : cela prescrit ${pct(r2(taylor - pi), 2)} — un taux qui ne suivrait même pas l'inflation.`],
        },
        {
          intitule: en ? `c) Behind or ahead: the gap to ${pct(tauxActuel, 2)}` : `c) En retard ou en avance : l'écart à ${pct(tauxActuel, 2)}`,
          enonce: en
            ? `The policy rate currently sits at ${pct(tauxActuel, 2)}. How many points below the prescription of b) is the central bank? (A positive answer = behind the curve.)`
            : `Le taux directeur est actuellement à ${pct(tauxActuel, 2)}. De combien de points la banque centrale est-elle sous la prescription du b) ? (Réponse positive = en retard, « behind the curve ».)`,
          reponse: retard, tolerance: 0.005, unite: en ? 'points' : 'points',
          etapes: [{
            titre: en ? 'The desk sentence: "N points below its Taylor"' : 'La phrase de desk : « N points sous sa Taylor »',
            contenu: en
              ? `Gap = ${f(taylor, 2)} − ${f(tauxActuel, 2)} = **${f(retard, 2)} points** (${f(r2(retard * 100), 0)} bp). That is the 2022 configuration in miniature: in the spring, the rule prescribed around 12% while the Fed was still at 0.25% — the hiking race that followed (+525 bp in sixteen months, +450 bp for the ECB) was the sprint to close exactly this kind of gap. Nobody follows the rule mechanically (r* uncertain, gap revised) — but a gap this size is a conversation every desk has.`
              : `Écart = ${f(taylor, 2)} − ${f(tauxActuel, 2)} = **${f(retard, 2)} points** (${f(r2(retard * 100), 0)} pb). C'est la configuration 2022 en miniature : au printemps, la règle prescrivait environ 12 % quand la Fed était encore à 0,25 % — la course aux hausses qui a suivi (+525 pb en seize mois, +450 pb pour la BCE) fut le sprint pour combler exactement ce genre d'écart. Personne ne suit la règle mécaniquement (r* incertain, gap révisé) — mais un écart de cette taille est une conversation que tous les desks ont.`,
          }],
          pieges: [en
            ? `Concluding "the bank must hike by ${f(retard, 2)} points tomorrow": the rule is a benchmark for conversation, not an autopilot — r* is unobservable and the real-time output gap gets massively revised.`
            : `Conclure « la banque doit monter de ${f(retard, 2)} points demain » : la règle est un étalon de conversation, pas un pilote automatique — r* est inobservable et le gap en temps réel massivement révisé.`],
        },
        {
          intitule: en ? 'd) The verdict that matters: the real rate' : 'd) Le verdict qui compte : le taux réel',
          enonce: en
            ? `At ${pct(tauxActuel, 2)} nominal under ${pct(pi, 1)} inflation, what is the REAL policy rate (exact Fisher), in %?`
            : `À ${pct(tauxActuel, 2)} de nominal sous ${pct(pi, 1)} d'inflation, quel est le taux directeur RÉEL (Fisher exact), en % ?`,
          reponse: reel, tolerance: 0.03, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'r = (1 + i)/(1 + π) − 1: restrictive is read on the real rate' : 'r = (1 + i)/(1 + π) − 1 : restrictif se lit sur le réel',
            contenu: en
              ? `$r = \\frac{1 + i}{1 + \\pi} - 1$ = ${f(1 + tauxActuel / 100, 4)}/${f(1 + pi / 100, 4)} − 1 = **${pct(reel, 2)}**. The trading-floor shortcut i − π gives ${pct(reelApp, 2)} — the approximation always OVERSTATES the real rate (it drops the cross term), and the error grows with the levels. Verdict: the real rate is ${reel < 0 ? `NEGATIVE — policy is still accommodative whatever the nominal hikes suggest; summer 2022, a central bank at 2.5% against 8% inflation was running a real rate of −5.09%` : `${reel > rStar ? 'above' : 'below'} r* (${pct(rStar, 1)}) — ${reel > rStar ? 'policy actually bites' : 'policy does not truly brake yet'}`}. Restrictive or not is NEVER read on the nominal.`
              : `$r = \\frac{1 + i}{1 + \\pi} - 1$ = ${f(1 + tauxActuel / 100, 4)}/${f(1 + pi / 100, 4)} − 1 = **${pct(reel, 2)}**. L'arithmétique de tête des salles, i − π, donne ${pct(reelApp, 2)} — l'approximation SURESTIME toujours le réel (elle néglige le terme croisé), et l'écart grossit avec les niveaux. Verdict : le taux réel est ${reel < 0 ? `NÉGATIF — la politique reste accommodante quoi que suggèrent les hausses nominales ; été 2022, une banque centrale à 2,5 % face à 8 % d'inflation affichait un réel de −5,09 %` : `${reel > rStar ? 'au-dessus' : 'en dessous'} de r* (${pct(rStar, 1)}) — ${reel > rStar ? 'la politique mord vraiment' : 'la politique ne freine pas encore vraiment'}`}. Restrictif ou pas ne se lit JAMAIS sur le nominal.`,
          }],
          pieges: [en
            ? `Judging the stance on the nominal rate ("${pct(tauxActuel, 2)}, that is high"): what decides saving and borrowing is the real rate compared with r* — a 4% policy rate under 7% inflation is accommodation dressed up as rigour.`
            : `Juger la politique sur le nominal (« ${pct(tauxActuel, 2)}, c'est élevé ») : ce qui pilote épargne et emprunt est le réel comparé à r* — un taux directeur à 4 % sous 7 % d'inflation est de l'accommodation déguisée en rigueur.`],
        },
        {
          intitule: en ? 'e) The Taylor principle: one more point of inflation' : "e) Le principe de Taylor : un point d'inflation en plus",
          enonce: en
            ? `Next print: inflation rises by one point, to ${pct(r2(pi + 1), 1)} (same r*, same gap). What does the rule now prescribe, in %?`
            : `Publication suivante : l'inflation monte d'un point, à ${pct(r2(pi + 1), 1)} (même r*, même gap). Que prescrit désormais la règle, en % ?`,
          reponse: taylorPlus, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'The rate moves by 1 + a = 1.5 points per point of inflation' : 'Le taux bouge de 1 + a = 1,5 point par point d\'inflation',
            contenu: en
              ? `New prescription: **${pct(taylorPlus, 2)}** — ${f(r2(taylorPlus - taylor), 1)} point${taylorPlus - taylor >= 1.995 ? 's' : ''} higher for ONE point of inflation. That is the whole content of the rule: with a > 0, the prescribed rate moves MORE than one-for-one, so the REAL rate rises and policy bites. Moving exactly one-for-one would leave the real rate unchanged (motion without braking); moving less would LOWER it while prices accelerate — the exact recipe of the 1970s. The Taylor principle is what separates a central bank chasing inflation from one catching it.`
              : `Nouvelle prescription : **${pct(taylorPlus, 2)}** — ${f(r2(taylorPlus - taylor), 1)} point${taylorPlus - taylor >= 1.995 ? 's' : ''} de plus pour UN point d'inflation. C'est tout le contenu de la règle : avec a > 0, le taux prescrit bouge PLUS qu'un pour un, donc le taux RÉEL monte et la politique mord. Bouger exactement d'un pour un laisserait le réel inchangé (de l'agitation sans freinage) ; bouger moins le ferait BAISSER pendant que les prix flambent — la recette exacte des années 70. Le principe de Taylor sépare la banque centrale qui court derrière l'inflation de celle qui la rattrape.`,
          }],
          pieges: [en
            ? `Expecting +1 point of prescription for +1 point of inflation: π appears twice in the rule — alone AND inside the penalty — hence the 1 + a = 1.5 slope. Volcker's 20% of 1980 was, to half a point, what the rule prescribed (19.5%).`
            : `Attendre +1 point de prescription pour +1 point d'inflation : π apparaît deux fois dans la règle — seul ET dans la pénalité — d'où la pente 1 + a = 1,5. Le 20 % de Volcker en 1980 était, à un demi-point près, la prescription de la règle (19,5 %).`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 2. m10-pb-02 — Mon salaire et l'inflation — N1                      */
/* ------------------------------------------------------------------ */
const salaireInflation: ProblemeMoule = {
  id: 'm10-pb-02', moduleId: M10,
  titre: "Mon salaire et l'inflation : l'érosion, l'indice et la négociation",
  titreEn: 'My salary and inflation: erosion, the index and the pay talk',
  typeDeCas: 'inflation et pouvoir d\'achat',
  typeDeCasEn: 'inflation and purchasing power',
  difficulte: 1,
  scenarios: ['Le jeune diplômé prépare sa première négociation salariale (inflation de retour)', "L'épargnante découvre ce que « rapporte » vraiment son livret (répression financière)", "La DRH chiffre l'accord salarial annuel sans nourrir la spirale"],
  scenariosEn: ['The young graduate prepares his first pay negotiation (inflation is back)', 'The saver discovers what her savings account really "yields" (financial repression)', 'The HR director prices the annual wage deal without feeding the spiral'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : épargne, horizon, inflation d'érosion, trois années
    // d'indice, augmentation nominale, réel visé, inflation anticipée, choc symétrique.
    const cfg = ([
      { epMin: 8, epMax: 15, nMin: 8, nMax: 12, peMin: 3.0, peMax: 5.0, p1Min: 2.0, p1Max: 3.0, p2Min: 4.0, p2Max: 6.0, p3Min: 3.0, p3Max: 5.0, augMin: 3.0, augMax: 5.0, rvMin: 0.5, rvMax: 1.5, pnMin: 2.5, pnMax: 4.0, xMin: 8, xMax: 12 },
      { epMin: 15, epMax: 30, nMin: 6, nMax: 10, peMin: 4.5, peMax: 7.0, p1Min: 3.0, p1Max: 5.0, p2Min: 6.0, p2Max: 9.0, p3Min: 4.0, p3Max: 6.0, augMin: 2.0, augMax: 3.5, rvMin: 0.5, rvMax: 1.0, pnMin: 3.0, pnMax: 5.0, xMin: 10, xMax: 15 },
      { epMin: 10, epMax: 20, nMin: 10, nMax: 15, peMin: 4.0, peMax: 6.0, p1Min: 4.0, p1Max: 6.0, p2Min: 6.0, p2Max: 10.0, p3Min: 3.0, p3Max: 5.0, augMin: 4.0, augMax: 6.5, rvMin: 1.0, rvMax: 2.0, pnMin: 2.0, pnMax: 3.5, xMin: 9, xMax: 14 },
    ] as const)[sIdx];
    const epargne = randInt(rng, cfg.epMin, cfg.epMax) * 1000;
    const annees = randInt(rng, cfg.nMin, cfg.nMax);
    const piErosion = randFloat(rng, cfg.peMin, cfg.peMax, 1);
    const pi1 = randFloat(rng, cfg.p1Min, cfg.p1Max, 1);
    const pi2 = randFloat(rng, cfg.p2Min, cfg.p2Max, 1);
    const pi3 = randFloat(rng, cfg.p3Min, cfg.p3Max, 1);
    const augm = randFloat(rng, cfg.augMin, cfg.augMax, 1);
    const reelVise = randFloat(rng, cfg.rvMin, cfg.rvMax, 1);
    const piNext = randFloat(rng, cfg.pnMin, cfg.pnMax, 1);
    const choc = randInt(rng, cfg.xMin, cfg.xMax);
    const residuel = r2(interetsComposesInflation(epargne, piErosion, annees));
    const indice3 = r2(indiceDesPrix(100, [pi1, pi2, pi3]));
    const reelAugm = r2(tauxReelFisher(augm, pi3));
    const reelAugmApp = r2(tauxReelApproche(augm, pi3));
    const nominalRequis = r2(tauxNominalRequis(reelVise, piNext));
    const asym = r2(indiceDesPrix(100, [choc, -choc]));

    const { en, f, pct, mnt } = outils(langue);
    const desc = en
      ? `savings of ${mnt(epargne, '€', 0)} on a non-interest-bearing account, ${f(annees, 0)} years at ${pct(piErosion, 1)} inflation; price index over the last three years: ${pct(pi1, 1)}, then ${pct(pi2, 1)}, then ${pct(pi3, 1)}; nominal raise on the table: ${pct(augm, 1)}; expected inflation next year: ${pct(piNext, 1)}`
      : `une épargne de ${mnt(epargne, '€', 0)} sur un compte non rémunéré, ${f(annees, 0)} ans à ${pct(piErosion, 1)} d'inflation ; indice des prix sur les trois dernières années : ${pct(pi1, 1)}, puis ${pct(pi2, 1)}, puis ${pct(pi3, 1)} ; augmentation nominale sur la table : ${pct(augm, 1)} ; inflation attendue l'an prochain : ${pct(piNext, 1)}`;
    const contexte = (en
      ? [
        `Inflation is back and the young graduate wants numbers, not impressions, before his first pay review: ${desc}. His plan: measure what compounding does to idle cash, rebuild the price index his employer keeps quoting, translate the offered raise into REAL terms — and compute the number to write on top of his negotiation sheet.`,
        `"The account statement never went down" — and yet the saver feels poorer every year. Time to follow the chapter and do the arithmetic: ${desc}. What is left of the money in purchasing power, what the index really did over three years, what the proposed raise is worth once deflated — and the nominal rate that would actually protect a real target.`,
        `Wage round at headquarters: the unions quote the price index, the CFO quotes the wage bill, and the HR director must put one defensible number on the table: ${desc}. Her worksheet: the erosion employees actually suffered, the chained index, the real value of the proposed raise — and the nominal figure consistent with a modest real gain, without indexing the whole company to the last print.`,
      ]
      : [
        `L'inflation est de retour et le jeune diplômé veut des chiffres, pas des impressions, avant son premier entretien annuel : ${desc}. Son plan : mesurer ce que la composition fait au cash qui dort, reconstruire l'indice des prix que son employeur cite sans arrêt, traduire l'augmentation proposée en termes RÉELS — et calculer le chiffre à écrire en haut de sa feuille de négociation.`,
        `« Le relevé du compte n'a jamais baissé » — et pourtant l'épargnante se sent plus pauvre chaque année. Faisons l'arithmétique du chapitre : ${desc}. Ce qui reste du billet en pouvoir d'achat, ce que l'indice a vraiment fait en trois ans, ce que vaut l'augmentation proposée une fois déflatée — et le taux nominal qui protégerait vraiment une cible réelle.`,
        `Négociation annuelle au siège : les syndicats citent l'indice des prix, le directeur financier cite la masse salariale, et la DRH doit poser un chiffre défendable sur la table : ${desc}. Sa feuille de calcul : l'érosion réellement subie par les salariés, l'indice chaîné, la valeur réelle de l'augmentation proposée — et le nominal cohérent avec un gain réel modeste, sans indexer toute l'entreprise sur le dernier chiffre publié.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) Compounding against the saver: the erosion' : "a) La composition jouée contre l'épargnant : l'érosion",
          enonce: en
            ? `${mnt(epargne, '€', 0)} sit on a non-interest-bearing account for ${f(annees, 0)} years under ${pct(piErosion, 1)} inflation. What is left in purchasing power, in euros?`
            : `${mnt(epargne, '€', 0)} dorment sur un compte non rémunéré pendant ${f(annees, 0)} ans sous ${pct(piErosion, 1)} d'inflation. Que reste-t-il en pouvoir d'achat, en euros ?`,
          reponse: residuel, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'Residual = amount/(1 + π)^n: the m4 discounting, against you' : 'Résiduel = montant/(1 + π)^n : l\'actualisation du m4, contre vous',
            contenu: en
              ? `$\\text{residual} = \\frac{\\text{amount}}{(1 + \\pi)^n}$ = ${f(epargne, 0)}/(1 + ${f(piErosion / 100, 3)})^${f(annees, 0)} = **${mnt(residuel, '€', 2)}** — ${pct(r2(100 - 100 * residuel / epargne), 1)} of the note eaten without a crash, a default, or the balance moving by a cent. Inflation discounts purchasing power exactly like a rate discounts a cash flow (the chapter's benchmark: 100 at 5% over ten years leaves 61.39; even at the 2% target, 82.03). The symmetric winners are fixed-rate debtors — the State first: the inflation tax, levied without a vote.`
              : `$\\text{résiduel} = \\frac{\\text{montant}}{(1 + \\pi)^n}$ = ${f(epargne, 0)}/(1 + ${f(piErosion / 100, 3)})^${f(annees, 0)} = **${mnt(residuel, '€', 2)}** — ${pct(r2(100 - 100 * residuel / epargne), 1)} du billet rongés sans krach, sans défaut, sans que le solde bouge d'un centime. L'inflation actualise le pouvoir d'achat exactement comme un taux actualise un flux (l'étalon du chapitre : 100 à 5 % sur dix ans laissent 61,39 ; même à la cible de 2 %, 82,03). Les gagnants symétriques sont les débiteurs à taux fixe — l'État en tête : la taxe d'inflation, prélevée sans vote.`,
          }],
          pieges: [en
            ? `Computing the loss linearly (${f(annees, 0)} × ${f(piErosion, 1)} = ${pct(r2(annees * piErosion), 1)} lost) ignores compounding: rates are never multiplied, they compound — (1 + π)^n.`
            : `Calculer la perte en linéaire (${f(annees, 0)} × ${f(piErosion, 1)} = ${pct(r2(annees * piErosion), 1)} perdus) ignore la composition : on ne multiplie jamais des taux, on les compose — (1 + π)^n.`],
        },
        {
          intitule: en ? 'b) The index never forgets: three years chained' : "b) L'indice n'oublie jamais : trois années chaînées",
          enonce: en
            ? `The price index started at 100 three years ago and rose by ${pct(pi1, 1)}, then ${pct(pi2, 1)}, then ${pct(pi3, 1)}. Where does it stand today?`
            : `L'indice des prix partait de 100 il y a trois ans et a monté de ${pct(pi1, 1)}, puis ${pct(pi2, 1)}, puis ${pct(pi3, 1)}. Où est-il aujourd'hui ?`,
          reponse: indice3, tolerance: 0.005, unite: en ? 'index points' : 'points d\'indice',
          etapes: [{
            titre: en ? 'Chaining: level × Π(1 + π_t), never a sum' : 'Chaînage : niveau × Π(1 + π_t), jamais une somme',
            contenu: en
              ? `$100 \\times \\prod\\,(1 + \\pi_t)$ = 100 × ${f(1 + pi1 / 100, 3)} × ${f(1 + pi2 / 100, 3)} × ${f(1 + pi3 / 100, 3)} = **${f(indice3, 2)}** — against ${f(r2(100 + pi1 + pi2 + pi3), 1)} for the naive sum: compounding always bites, in the direction unfavourable to the consumer. This is exactly how official indices (CPI, euro-area HICP) are built. And note what the level says: disinflation would only slow the CLIMB — the ${f(r2(indice3 - 100), 2)} points already gained never come back down. "Inflation is falling but everything stays expensive" is the difference between the derivative and the level.`
              : `$100 \\times \\prod\\,(1 + \\pi_t)$ = 100 × ${f(1 + pi1 / 100, 3)} × ${f(1 + pi2 / 100, 3)} × ${f(1 + pi3 / 100, 3)} = **${f(indice3, 2)}** — contre ${f(r2(100 + pi1 + pi2 + pi3), 1)} pour la somme naïve : la composition mord toujours, dans le sens défavorable au consommateur. C'est exactement ainsi que se construisent les indices officiels (CPI, IPCH de la zone euro). Et notez ce que dit le niveau : une désinflation ne ferait que ralentir la MONTÉE — les ${f(r2(indice3 - 100), 2)} points déjà pris ne redescendront jamais. « L'inflation baisse mais tout reste cher », c'est la différence entre la dérivée et le niveau.`,
          }],
          pieges: [en
            ? `Adding the three rates (${f(r2(pi1 + pi2 + pi3), 1)} points) undershoots the true level: each year's rise applies to an already-raised base — the same trap as portfolio performances in module 2.`
            : `Additionner les trois taux (${f(r2(pi1 + pi2 + pi3), 1)} points) sous-estime le vrai niveau : chaque hausse s'applique à une base déjà relevée — le même piège que les performances de portefeuille du module 2.`],
        },
        {
          intitule: en ? `c) The raise, deflated: +${pct(augm, 1)} under ${pct(pi3, 1)} inflation` : `c) L'augmentation déflatée : +${pct(augm, 1)} sous ${pct(pi3, 1)} d'inflation`,
          enonce: en
            ? `The employer offers a ${pct(augm, 1)} nominal raise while the last year of the index in b) ran at ${pct(pi3, 1)}. What is the REAL raise (exact Fisher), in %?`
            : `L'employeur propose ${pct(augm, 1)} d'augmentation nominale quand la dernière année de l'indice du b) a couru à ${pct(pi3, 1)}. Quelle est l'augmentation RÉELLE (Fisher exact), en % ?`,
          reponse: reelAugm, tolerance: 0.03, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Real = (1 + i)/(1 + π) − 1, and the sign is the message' : 'Réel = (1 + i)/(1 + π) − 1, et le signe est le message',
            contenu: en
              ? `$r = \\frac{1 + i}{1 + \\pi} - 1$ = ${f(1 + augm / 100, 3)}/${f(1 + pi3 / 100, 3)} − 1 = **${pct(reelAugm, 2)}**. The head-count shortcut i − π says ${pct(reelAugmApp, 2)}: the approximation drops the cross term and always overstates the real figure. ${reelAugm < 0 ? `The offered raise is a REAL pay cut dressed as a rise — precisely the nominal-rigidity mechanism of chapter 1: nobody accepts a smaller cheque, so 2% inflation is what lets real wages adjust without the psychology of a cut.` : `The raise beats inflation — a genuine real gain, the number that should anchor the discussion rather than the nominal headline.`}`
              : `$r = \\frac{1 + i}{1 + \\pi} - 1$ = ${f(1 + augm / 100, 3)}/${f(1 + pi3 / 100, 3)} − 1 = **${pct(reelAugm, 2)}**. L'arithmétique de tête i − π dit ${pct(reelAugmApp, 2)} : l'approximation néglige le terme croisé et surestime toujours le réel. ${reelAugm < 0 ? `L'augmentation proposée est une BAISSE de salaire réel déguisée en hausse — exactement le mécanisme des rigidités nominales du chapitre 1 : personne n'accepte un chèque réduit, donc 2 % d'inflation est ce qui permet d'ajuster les salaires réels sans la psychologie d'une baisse.` : `L'augmentation bat l'inflation — un vrai gain réel, le chiffre qui devrait ancrer la discussion plutôt que le nominal affiché.`}`,
          }],
          pieges: [en
            ? `Judging the offer on the nominal ${pct(augm, 1)}: the money illusion is exactly what inflation exploits — always deflate before negotiating.`
            : `Juger l'offre sur le nominal ${pct(augm, 1)} : l'illusion monétaire est précisément ce que l'inflation exploite — toujours déflater avant de négocier.`],
        },
        {
          intitule: en ? `d) The negotiation number: a real ${pct(reelVise, 1)} target` : `d) Le chiffre de la négociation : viser ${pct(reelVise, 1)} de réel`,
          enonce: en
            ? `For next year, inflation is expected at ${pct(piNext, 1)} and the target is a REAL gain of ${pct(reelVise, 1)}. What nominal raise must be asked for (inverse Fisher), in %?`
            : `Pour l'an prochain, l'inflation attendue est ${pct(piNext, 1)} et l'objectif est un gain RÉEL de ${pct(reelVise, 1)}. Quelle augmentation nominale faut-il demander (Fisher inversé), en % ?`,
          reponse: nominalRequis, tolerance: 0.005, unite: '%',
          etapes: [
            {
              titre: en ? 'i = (1 + r)(1 + π) − 1: the round trip closes' : 'i = (1 + r)(1 + π) − 1 : l\'aller-retour se referme',
              contenu: en
                ? `$i = (1 + r)(1 + \\pi) - 1$ = ${f(1 + reelVise / 100, 3)} × ${f(1 + piNext / 100, 3)} − 1 = **${pct(nominalRequis, 2)}** — slightly more than the naive ${pct(r2(reelVise + piNext), 1)} sum, because the real gain itself must be protected from inflation (the cross term, again). Sanity check: run ${pct(nominalRequis, 2)} back through exact Fisher under ${pct(piNext, 1)} and you land on ${pct(reelVise, 1)} exactly. Limit case worth reciting: targeting a real gain of ZERO requires a nominal raise equal to inflation.`
                : `$i = (1 + r)(1 + \\pi) - 1$ = ${f(1 + reelVise / 100, 3)} × ${f(1 + piNext / 100, 3)} − 1 = **${pct(nominalRequis, 2)}** — un peu plus que la somme naïve ${pct(r2(reelVise + piNext), 1)}, parce que le gain réel doit lui-même être protégé de l'inflation (le terme croisé, encore). Vérification : repassez ${pct(nominalRequis, 2)} dans Fisher exact sous ${pct(piNext, 1)} et vous retombez exactement sur ${pct(reelVise, 1)}. Cas limite à réciter : viser un réel NUL exige un nominal égal à l'inflation.`,
            },
            {
              titre: en ? 'The macro footnote: the wage-price spiral' : 'La note macro : la spirale prix-salaires',
              contenu: en
                ? `Multiply this negotiation by a whole economy and you get the central banker's nightmare: prices feed wage demands, wage costs feed prices. The loop only ignites if everyone EXPECTS inflation to last — which is why anchored expectations (the 2% promise believed) are the central bank's most precious asset: 2021-2023 stayed an episode instead of a decade precisely because the loop never took hold.`
                : `Multipliez cette négociation par toute une économie et vous obtenez le cauchemar du banquier central : les prix nourrissent les demandes salariales, les coûts salariaux nourrissent les prix. La boucle ne s'enclenche que si chacun S'ATTEND à ce que l'inflation dure — c'est pourquoi les anticipations ancrées (la promesse des 2 % crue) sont l'actif le plus précieux d'une banque centrale : 2021-2023 est resté un épisode et non une décennie précisément parce que la boucle n'a pas pris.`,
            },
          ],
          pieges: [en
            ? `Asking for ${pct(r2(reelVise + piNext), 1)} (the simple sum): close but systematically short — the missing cross term is exactly what c) showed the approximation losing.`
            : `Demander ${pct(r2(reelVise + piNext), 1)} (la simple somme) : proche mais systématiquement court — le terme croisé manquant est exactement ce que le c) a montré que l'approximation perdait.`],
        },
        {
          intitule: en ? `e) The symmetry trap: +${f(choc, 0)}% then −${f(choc, 0)}%` : `e) Le piège de la symétrie : +${f(choc, 0)} % puis −${f(choc, 0)} %`,
          enonce: en
            ? `A colleague claims: "if prices rose ${pct(choc, 0)} then fell ${pct(choc, 0)}, we are back where we started." Chain the index from 100: where does it actually land?`
            : `Un collègue affirme : « si les prix ont pris ${pct(choc, 0)} puis rendu ${pct(choc, 0)}, on est revenus au départ. » Chaînez l'indice depuis 100 : où atterrit-il vraiment ?`,
          reponse: asym, tolerance: 0.005, unite: en ? 'index points' : 'points d\'indice',
          etapes: [{
            titre: en ? 'The fall works on a higher base' : 'La baisse travaille sur une base plus haute',
            contenu: en
              ? `$100 \\times (1 + x)(1 - x)$ = 100 × ${f(1 + choc / 100, 2)} × ${f(1 - choc / 100, 2)} = **${f(asym, 2)}** — not 100: the −${f(choc, 0)}% applies to a base of ${f(r2(100 + choc), 0)}, so it destroys more than the rise created. The chapter's canonical pair is +10%/−10% → 99. Same asymmetry as portfolio returns in module 2 — and a reminder that returning the price LEVEL to its start would require actual deflation, the pathology central banks fear even more than inflation (postponed purchases, debts heavier in real terms, the Japanese spiral).`
              : `$100 \\times (1 + x)(1 - x)$ = 100 × ${f(1 + choc / 100, 2)} × ${f(1 - choc / 100, 2)} = **${f(asym, 2)}** — pas 100 : le −${f(choc, 0)} % s'applique à une base de ${f(r2(100 + choc), 0)}, donc il détruit plus que la hausse n'avait créé. Le couple canonique du chapitre est +10 %/−10 % → 99. C'est l'asymétrie des performances de portefeuille du module 2 — et un rappel : ramener le NIVEAU des prix au départ exigerait une vraie déflation, la pathologie que les banques centrales craignent plus encore que l'inflation (achats reportés, dettes alourdies en réel, spirale japonaise).`,
          }],
          pieges: [en
            ? `"+${f(choc, 0)} − ${f(choc, 0)} = 0" adds percentages that apply to different bases: percentage moves multiply, they never cancel by addition.`
            : `« +${f(choc, 0)} − ${f(choc, 0)} = 0 » additionne des pourcentages qui s'appliquent à des bases différentes : les variations en % se multiplient, elles ne s'annulent jamais par addition.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 3. m10-pb-03 — Lire un chiffre d'inflation — N1                     */
/* ------------------------------------------------------------------ */
const lireChiffreInflation: ProblemeMoule = {
  id: 'm10-pb-03', moduleId: M10,
  titre: "Lire un chiffre d'inflation sans se faire piéger",
  titreEn: 'Reading an inflation print without falling for the traps',
  typeDeCas: 'lecture du CPI',
  typeDeCasEn: 'reading a CPI print',
  difficulte: 1,
  scenarios: ['Le stagiaire du desk taux décortique le CPI du 13 (États-Unis)', "La journaliste économique refuse d'écrire un contresens (IPCH, zone euro)", "Le comité d'investissement débat : « l'inflation chute-t-elle vraiment ? »"],
  scenariosEn: ['The rates-desk intern dissects the CPI of the 13th (United States)', 'The financial journalist refuses to print a fallacy (euro-area HICP)', 'The investment committee debates: "is inflation really falling?"'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : headline/core en glissement, MoM du core, choc de
    // base, rythme mensuel courant, taux directeur, deux années déjà acquises.
    const cfg = ([
      { hdMin: 6.5, hdMax: 8.5, coMin: 4.5, coMax: 6.0, mMin: 0.4, mMax: 0.7, chMin: 2.5, chMax: 4.0, mcMin: 0.2, mcMax: 0.4, tdMin: 12, tdMax: 20, a1Min: 7.0, a1Max: 9.0 },
      { hdMin: 5.0, hdMax: 7.0, coMin: 3.5, coMax: 5.0, mMin: 0.3, mMax: 0.5, chMin: 2.0, chMax: 3.5, mcMin: 0.15, mcMax: 0.3, tdMin: 8, tdMax: 14, a1Min: 8.0, a1Max: 10.5 },
      { hdMin: 3.5, hdMax: 5.5, coMin: 3.0, coMax: 4.5, mMin: 0.25, mMax: 0.45, chMin: 1.5, chMax: 3.0, mcMin: 0.1, mcMax: 0.25, tdMin: 10, tdMax: 16, a1Min: 5.5, a1Max: 8.0 },
    ] as const)[sIdx];
    const headline = randFloat(rng, cfg.hdMin, cfg.hdMax, 1);
    const core = randFloat(rng, cfg.coMin, cfg.coMax, 1);
    const mensuel = randFloat(rng, cfg.mMin, cfg.mMax, 2);
    const choc = randFloat(rng, cfg.chMin, cfg.chMax, 1);
    const mCourant = randFloat(rng, cfg.mcMin, cfg.mcMax, 2);
    const tauxDirecteur = randInt(rng, cfg.tdMin, cfg.tdMax) * 0.25;
    const annee1 = randFloat(rng, cfg.a1Min, cfg.a1Max, 1);
    const annualise = r2(inflationAnnualiseeDepuisMensuelle(mensuel));
    const naif = r2(12 * mensuel);
    // Effet de base : le mois du choc (il y a douze mois) sort de la fenêtre.
    const onzeMois: number[] = Array.from({ length: 11 }, () => mCourant);
    const yoyAvant = r2((indiceDesPrix(100, [choc, ...onzeMois]) / 100 - 1) * 100);
    const yoyApres = r2((indiceDesPrix(100, Array.from({ length: 12 }, () => mCourant)) / 100 - 1) * 100);
    const chute = r2(yoyAvant - yoyApres);
    const reel = r2(tauxReelFisher(tauxDirecteur, core));
    const niveau = r2(indiceDesPrix(100, [annee1, headline]));

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `headline ${pct(headline, 1)} year-on-year, core (ex energy and food) ${pct(core, 1)}, core month-on-month +${pct(mensuel, 2)}; twelve months ago the index took a one-off energy shock of +${pct(choc, 1)} in a single month, and the current running pace is +${pct(mCourant, 2)} per month; policy rate ${pct(tauxDirecteur, 2)}`
      : `headline ${pct(headline, 1)} en glissement annuel, core (hors énergie et alimentation) ${pct(core, 1)}, core sur le mois +${pct(mensuel, 2)} ; il y a douze mois, l'indice a subi un choc énergétique ponctuel de +${pct(choc, 1)} sur un seul mois, et le rythme courant est de +${pct(mCourant, 2)} par mois ; taux directeur ${pct(tauxDirecteur, 2)}`;
    const contexte = (en
      ? [
        `The 13th of the month, 8:30 in New York: the CPI drops and the intern must brief the desk in four numbers, not four adjectives: ${desc}. The checklist from the chapter: annualise the fresh monthly figure properly, anticipate the base effect everyone will misread next month, deliver the real-rate verdict — and remind the desk what the LEVEL of the index has already locked in.`,
        `The newsroom wants "INFLATION COLLAPSES" as tomorrow's headline; the journalist wants to check what actually collapsed: ${desc}. Her fact-check: what the month-on-month figure really runs at annualised, how much of next month's "fall" is pure window arithmetic, whether the central bank is actually restrictive — and why prices will still feel expensive whatever the headline says.`,
        `Investment committee, quarterly review: half the room says the inflation battle is won, the other half points at the core. The analyst is asked for arithmetic, not opinions: ${desc}. Requested: the annualised pace, the size of the coming base effect, the real policy rate against the core — and the two-year index level that explains why clients keep complaining.`,
      ]
      : [
        `Le 13 du mois, 8 h 30 à New York : le CPI tombe et le stagiaire doit briefer le desk en quatre chiffres, pas en quatre adjectifs : ${desc}. La liste du chapitre : annualiser correctement le chiffre mensuel frais, anticiper l'effet de base que tout le monde lira de travers le mois prochain, livrer le verdict du taux réel — et rappeler au desk ce que le NIVEAU de l'indice a déjà verrouillé.`,
        `La rédaction veut titrer « L'INFLATION S'EFFONDRE » ; la journaliste veut vérifier ce qui s'effondre vraiment : ${desc}. Son fact-checking : à combien court vraiment le chiffre mensuel une fois annualisé, quelle part de la « chute » du mois prochain n'est que de l'arithmétique de fenêtre, si la banque centrale est réellement restrictive — et pourquoi les prix resteront chers quoi que dise le titre.`,
        `Comité d'investissement, revue trimestrielle : la moitié de la salle dit la bataille de l'inflation gagnée, l'autre moitié pointe le core. On demande à l'analyste de l'arithmétique, pas des opinions : ${desc}. Attendu : le rythme annualisé, la taille de l'effet de base qui arrive, le taux directeur réel face au core — et le niveau d'indice sur deux ans qui explique pourquoi les clients continuent de râler.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? `a) The fresh information: +${pct(mensuel, 2)} on the month, annualised` : `a) L'information fraîche : +${pct(mensuel, 2)} sur le mois, annualisé`,
          enonce: en
            ? `The core rose ${pct(mensuel, 2)} month-on-month. At what ANNUALISED pace is it running (composition, not multiplication), in %?`
            : `Le core a pris ${pct(mensuel, 2)} sur le mois. À quel rythme ANNUALISÉ court-il (composition, pas multiplication), en % ?`,
          reponse: annualise, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? '(1 + m)^12 − 1, never 12·m' : '(1 + m)^12 − 1, jamais 12·m',
            contenu: en
              ? `$(1 + m)^{12} - 1$ = (1 + ${f(mensuel / 100, 4)})^12 − 1 = **${pct(annualise, 2)}** — against ${pct(naif, 1)} for the hurried commentator's 12 × m. Price rises compound exactly like the interest of module 4: each month applies to an already-raised level. The gap to the naive figure (${f(r2(annualise - naif), 2)} point${annualise - naif >= 1.995 ? 's' : ''}) grows with the monthly print — the chapter's benchmarks: 0.5%/month → 6.17% (not 6%), 1%/month → 12.68% (not 12%). The MoM annualised is THE fresh number: the year-on-year drags twelve months of history behind it.`
              : `$(1 + m)^{12} - 1$ = (1 + ${f(mensuel / 100, 4)})^12 − 1 = **${pct(annualise, 2)}** — contre ${pct(naif, 1)} pour le 12 × m du commentateur pressé. Les hausses de prix se composent exactement comme les intérêts du module 4 : chaque mois s'applique à un niveau déjà relevé. L'écart au naïf (${f(r2(annualise - naif), 2)} point${annualise - naif >= 1.995 ? 's' : ''}) grossit avec le chiffre mensuel — les étalons du chapitre : 0,5 %/mois → 6,17 % (pas 6 %), 1 %/mois → 12,68 % (pas 12 %). Le MoM annualisé est LE chiffre frais : le glissement annuel traîne douze mois d'histoire derrière lui.`,
          }],
          pieges: [en
            ? `"${pct(mensuel, 2)} a month, so ${pct(naif, 1)} a year" multiplies rates — the reflex to keep: annualise at 12× in your head for the order of magnitude, then SAY that composition adds a few tenths.`
            : `« ${pct(mensuel, 2)} par mois, donc ${pct(naif, 1)} par an » multiplie des taux — le réflexe à garder : annualiser à 12× de tête pour l'ordre de grandeur, puis SIGNALER que la composition ajoute quelques dixièmes.`],
        },
        {
          intitule: en ? 'b) Next month\'s headline: the base effect' : "b) Le titre du mois prochain : l'effet de base",
          enonce: en
            ? `Twelve months ago the index jumped +${pct(choc, 1)} in a single month (energy shock); the running pace since is +${pct(mCourant, 2)}/month. Next month, the shock month LEAVES the twelve-month window. By how many points does the year-on-year figure mechanically fall, nothing else changing?`
            : `Il y a douze mois, l'indice a sauté de +${pct(choc, 1)} en un seul mois (choc énergétique) ; le rythme courant depuis est +${pct(mCourant, 2)}/mois. Le mois prochain, le mois du choc SORT de la fenêtre de douze mois. De combien de points le glissement annuel chute-t-il mécaniquement, toutes choses égales par ailleurs ?`,
          reponse: chute, tolerance: 0.02, toleranceMode: 'absolu', unite: 'points',
          etapes: [{
            titre: en ? 'What enters the window, what leaves it' : 'Ce qui entre dans la fenêtre, ce qui en sort',
            contenu: en
              ? `Year-on-year TODAY (shock month still inside): (1 + ${f(choc / 100, 3)}) × (1 + ${f(mCourant / 100, 4)})^11 − 1 ≈ ${pct(yoyAvant, 2)}. NEXT month (shock out, one ordinary month in): (1 + ${f(mCourant / 100, 4)})^12 − 1 ≈ ${pct(yoyApres, 2)}. Mechanical fall: **${f(chute, 2)} points** — while the CURRENT pace of prices has not changed by an iota. Pure sliding-window arithmetic: central bankers announce it, markets price it, and spring 2023 played it out in real size on the 2022 energy shock. Only the unprepared candidate marvels at a disinflation that is just a shock's first anniversary.`
              : `Glissement AUJOURD'HUI (mois du choc encore dedans) : (1 + ${f(choc / 100, 3)}) × (1 + ${f(mCourant / 100, 4)})^11 − 1 ≈ ${pct(yoyAvant, 2)}. Le mois PROCHAIN (choc sorti, un mois ordinaire entré) : (1 + ${f(mCourant / 100, 4)})^12 − 1 ≈ ${pct(yoyApres, 2)}. Chute mécanique : **${f(chute, 2)} points** — alors que le rythme COURANT des prix n'a pas changé d'un iota. Pure arithmétique de fenêtre glissante : les banquiers centraux l'annoncent, les marchés la pricent, et le printemps 2023 l'a jouée en grandeur réelle sur le choc énergétique de 2022. Seul le candidat mal préparé s'extasie devant une désinflation qui n'est que le premier anniversaire d'un choc.`,
          }],
          pieges: [en
            ? `Reading next month's fall as "policy is finally biting": the transmission lags of chapter 3 run 12-18 months, but THIS fall is calendar arithmetic — ask what enters and what leaves the window before crediting anyone.`
            : `Lire la chute du mois prochain comme « la politique mord enfin » : les délais de transmission du ch3 courent sur 12-18 mois, mais CETTE chute est de l'arithmétique de calendrier — demandez-vous ce qui entre et sort de la fenêtre avant d'en créditer quiconque.`],
        },
        {
          intitule: en ? 'c) The verdict for the central bank: the real rate against the core' : 'c) Le verdict pour la banque centrale : le réel face au core',
          enonce: en
            ? `The policy rate is ${pct(tauxDirecteur, 2)} and the core — the inflation the bank can actually reach — runs at ${pct(core, 1)}. What is the real policy rate (exact Fisher), in %?`
            : `Le taux directeur est à ${pct(tauxDirecteur, 2)} et le core — l'inflation que la banque peut vraiment atteindre — court à ${pct(core, 1)}. Quel est le taux directeur réel (Fisher exact), en % ?`,
          reponse: reel, tolerance: 0.03, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'Headline for the front page, core for the decision' : 'Le headline pour la une, le core pour la décision',
              contenu: en
                ? `$r = \\frac{1 + i}{1 + \\pi_{\\text{core}}} - 1$ = ${f(1 + tauxDirecteur / 100, 4)}/${f(1 + core / 100, 3)} − 1 = **${pct(reel, 2)}**. Why deflate by the CORE (${pct(core, 1)}) and not the headline (${pct(headline, 1)})? Because hiking does not grow wheat or reopen a pipeline: energy and food are volatile and out of the rate's reach — the core estimates the domestic, demand-driven inflation policy can actually bite. ${reel < 0 ? `A negative real rate: whatever the nominal suggests, the stance is still ACCOMMODATIVE — the summer-2022 configuration (2.5% nominal against 8% inflation, real −5.09%).` : `A positive real rate: the stance genuinely bites — provided it stays above the neutral r*.`}`
                : `$r = \\frac{1 + i}{1 + \\pi_{\\text{core}}} - 1$ = ${f(1 + tauxDirecteur / 100, 4)}/${f(1 + core / 100, 3)} − 1 = **${pct(reel, 2)}**. Pourquoi déflater par le CORE (${pct(core, 1)}) et pas le headline (${pct(headline, 1)}) ? Parce que monter les taux ne fait pas pousser le blé ni ne rouvre un gazoduc : énergie et alimentation sont volatiles et hors de portée du taux — le core estime l'inflation domestique et de demande, celle sur laquelle la politique a prise. ${reel < 0 ? `Un réel négatif : quoi que suggère le nominal, la politique reste ACCOMMODANTE — la configuration de l'été 2022 (2,5 % de nominal contre 8 % d'inflation, réel −5,09 %).` : `Un réel positif : la politique mord vraiment — à condition de rester au-dessus du neutre r*.`}`,
            },
          ],
          pieges: [en
            ? `Deflating by the headline (${pct(headline, 1)}) gives ${pct(r2(tauxReelFisher(tauxDirecteur, headline)), 2)}: dramatic, but it judges the bank on components its rates cannot reach — headline 8%/core 3% and headline 8%/core 6% call for two very different policies.`
            : `Déflater par le headline (${pct(headline, 1)}) donne ${pct(r2(tauxReelFisher(tauxDirecteur, headline)), 2)} : spectaculaire, mais cela juge la banque sur des composantes que ses taux ne peuvent pas atteindre — headline 8 %/core 3 % et headline 8 %/core 6 % appellent deux politiques très différentes.`],
        },
        {
          intitule: en ? 'd) What the headline hides: the level is locked in' : 'd) Ce que le titre cache : le niveau est acquis',
          enonce: en
            ? `Over the last two years, prices rose ${pct(annee1, 1)} then ${pct(headline, 1)}. Chain the index from 100: at what level do prices now sit — the level a return to 2% inflation would NOT bring back down?`
            : `Sur les deux dernières années, les prix ont pris ${pct(annee1, 1)} puis ${pct(headline, 1)}. Chaînez l'indice depuis 100 : à quel niveau sont les prix — le niveau qu'un retour à 2 % d'inflation ne fera PAS redescendre ?`,
          reponse: niveau, tolerance: 0.005, unite: en ? 'index points' : 'points d\'indice',
          etapes: [{
            titre: en ? 'Disinflation is a slower climb, not a descent' : 'La désinflation est une montée ralentie, pas une descente',
            contenu: en
              ? `$100 \\times (1 + \\pi_1)(1 + \\pi_2)$ = 100 × ${f(1 + annee1 / 100, 3)} × ${f(1 + headline / 100, 3)} = **${f(niveau, 2)}** — ${f(r2(niveau - 100), 1)} points locked in forever. Disinflation means the RATE slows (from ${pct(headline, 1)} back towards 2%); deflation means the rate turns negative — a different pathology altogether, the one central banks fear more (postponed purchases, heavier real debts, the Japanese spiral). When a household says "inflation is falling but everything stays expensive", it states exactly the difference between the derivative and the level. The 2021 price tags are not coming back.`
              : `$100 \\times (1 + \\pi_1)(1 + \\pi_2)$ = 100 × ${f(1 + annee1 / 100, 3)} × ${f(1 + headline / 100, 3)} = **${f(niveau, 2)}** — ${f(r2(niveau - 100), 1)} points acquis pour toujours. La désinflation, c'est le RYTHME qui ralentit (de ${pct(headline, 1)} vers 2 %) ; la déflation, c'est un rythme négatif — une tout autre pathologie, celle que les banques centrales craignent davantage (achats reportés, dettes alourdies en réel, spirale japonaise). Quand un ménage dit « l'inflation baisse mais tout reste cher », il énonce exactement la différence entre la dérivée et le niveau. Les étiquettes de 2021 ne reviendront pas.`,
          }],
          pieges: [en
            ? `Promising that "when inflation returns to 2%, prices will come back down": at 2% the index still RISES ${f(niveau, 0)} → ${f(r2(niveau * 1.02), 0)} next year — only deflation lowers the level, and nobody sane wishes for it.`
            : `Promettre que « quand l'inflation reviendra à 2 %, les prix redescendront » : à 2 %, l'indice MONTE encore, ${f(niveau, 0)} → ${f(r2(niveau * 1.02), 0)} l'an prochain — seule la déflation abaisse le niveau, et personne de sensé ne la souhaite.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 4. m10-pb-04 — La mensualité et le canal des taux — N1              */
/* ------------------------------------------------------------------ */
const mensualiteCanalTaux: ProblemeMoule = {
  id: 'm10-pb-04', moduleId: M10,
  titre: 'La mensualité qui bondit : le canal des taux, chiffré',
  titreEn: 'The monthly payment that jumps: the rate channel, quantified',
  typeDeCas: 'canal des taux',
  typeDeCasEn: 'interest-rate channel',
  difficulte: 1,
  scenarios: ["Le couple et l'appartement : le crédit d'avant, le crédit d'après (20 ans)", 'Le courtier explique pourquoi les transactions gèlent (25 ans)', "L'analyste chiffre le canal des taux pour la note macro (15 ans)"],
  scenariosEn: ['The couple and the flat: the loan before, the loan after (20 years)', 'The mortgage broker explains why transactions freeze (25 years)', 'The analyst quantifies the rate channel for the macro note (15 years)'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : capital, durée (fixe), taux bas, taux haut.
    const cfg = ([
      { cMin: 20, cMax: 30, ans: 20, tbMin: 0.9, tbMax: 1.5, thMin: 3.6, thMax: 4.6 },
      { cMin: 15, cMax: 25, ans: 25, tbMin: 1.0, tbMax: 1.8, thMin: 3.8, thMax: 5.0 },
      { cMin: 25, cMax: 40, ans: 15, tbMin: 1.2, tbMax: 2.0, thMin: 3.5, thMax: 4.5 },
    ] as const)[sIdx];
    const capital = randInt(rng, cfg.cMin, cfg.cMax) * 10000;
    const tauxBas = randFloat(rng, cfg.tbMin, cfg.tbMax, 1);
    const tauxHaut = randFloat(rng, cfg.thMin, cfg.thMax, 1);
    const mois = cfg.ans * 12;
    const factBas = facteurAnnuite(tauxBas, mois);
    const factHaut = facteurAnnuite(tauxHaut, mois);
    const mensBas = r2(capital / factBas);
    const mensHaut = r2(capital / factHaut);
    const haussePct = r2(100 * (mensHaut / mensBas - 1));
    const capacite = r2(mensBas * factHaut);
    const chutePct = r2(100 * (1 - capacite / capital));
    const intBas = r2(mensBas * mois - capital);
    const intHaut = r2(mensHaut * mois - capital);
    const ratioInterets = r2(intHaut / intBas);

    const { en, f, pct, mnt } = outils(langue);
    const desc = en
      ? `a loan of ${mnt(capital, '€', 0)} over ${f(cfg.ans, 0)} years; mortgage rate ${pct(tauxBas, 1)} in the low-rate world, ${pct(tauxHaut, 1)} after the tightening cycle (monthly payments, monthly rate = annual rate / 12)`
      : `un emprunt de ${mnt(capital, '€', 0)} sur ${f(cfg.ans, 0)} ans ; taux du crédit ${pct(tauxBas, 1)} dans le monde de taux bas, ${pct(tauxHaut, 1)} après le cycle de resserrement (mensualités, taux mensuel = taux annuel / 12)`;
    const contexte = (en
      ? [
        `The couple visited the flat twice, and between the two visits the central bank finished its hiking cycle: ${desc}. The banker's spreadsheet holds the whole rate channel of chapter 3: the payment before, the payment after, what the same monthly budget can still buy — and the total interest bill that quietly multiplied.`,
        `The mortgage broker's phone has gone silent and he wants to show clients why with one table, not a speech: ${desc}. Four cells to fill: both monthly payments, the borrowing capacity at unchanged repayment budget, and the interest multiple — the arithmetic by which a policy rate empties open-house visits.`,
        `For the macro note, the analyst must translate "+450 bp of policy tightening" into something a reader feels: ${desc}. The demonstration: payment at the old rate, payment at the new one, the quarter of borrowing power that evaporates at constant budget, and the interest bill ratio — the rate channel, from Frankfurt to the kitchen table.`,
      ]
      : [
        `Le couple a visité l'appartement deux fois, et entre les deux visites la banque centrale a terminé son cycle de hausses : ${desc}. Le tableur du banquier contient tout le canal des taux du chapitre 3 : la mensualité d'avant, celle d'après, ce que le même budget mensuel peut encore acheter — et la facture d'intérêts totale qui s'est multipliée en silence.`,
        `Le téléphone du courtier ne sonne plus et il veut montrer pourquoi à ses clients avec un tableau, pas un discours : ${desc}. Quatre cases à remplir : les deux mensualités, la capacité d'emprunt à budget de remboursement inchangé, et le multiple d'intérêts — l'arithmétique par laquelle un taux directeur vide les visites d'appartements.`,
        `Pour la note macro, l'analyste doit traduire « +450 pb de resserrement » en quelque chose que le lecteur ressent : ${desc}. La démonstration : mensualité à l'ancien taux, mensualité au nouveau, le quart de pouvoir d'achat immobilier qui s'évapore à budget constant, et le ratio des factures d'intérêts — le canal des taux, de Francfort à la table de la cuisine.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? `a) The old world: the payment at ${pct(tauxBas, 1)}` : `a) L'ancien monde : la mensualité à ${pct(tauxBas, 1)}`,
          enonce: en
            ? `At ${pct(tauxBas, 1)} over ${f(cfg.ans, 0)} years (${f(mois, 0)} monthly payments, monthly rate ${pct(tauxBas, 1)}/12), what monthly payment repays ${mnt(capital, '€', 0)}, in euros?`
            : `À ${pct(tauxBas, 1)} sur ${f(cfg.ans, 0)} ans (${f(mois, 0)} mensualités, taux mensuel ${pct(tauxBas, 1)}/12), quelle mensualité rembourse ${mnt(capital, '€', 0)}, en euros ?`,
          reponse: mensBas, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'Payment = capital / annuity factor (a sum of m4 discountings)' : 'Mensualité = capital / facteur d\'annuité (une somme d\'actualisations du m4)',
            contenu: en
              ? `The annuity factor is the price today of one euro per month: $\\sum_{t=1}^{${f(mois, 0)}} \\frac{1}{(1 + i_m)^t}$ with $i_m$ = ${f(tauxBas, 1)}%/12 = ${pct(r2(tauxBas / 12), 3)}, i.e. ${f(r2(factBas), 2)} here. Payment = ${f(capital, 0)} / ${f(r2(factBas), 2)} = **${mnt(mensBas, '€', 2)}**. Nothing new under the sun: it is the m4 present value run ${f(mois, 0)} times — the chapter's benchmark loan (250 000 € over 20 years at 1%) pays about 1 150 € a month.`
              : `Le facteur d'annuité est le prix aujourd'hui d'un euro par mois : $\\sum_{t=1}^{${f(mois, 0)}} \\frac{1}{(1 + i_m)^t}$ avec $i_m$ = ${f(tauxBas, 1)} %/12 = ${pct(r2(tauxBas / 12), 3)}, soit ${f(r2(factBas), 2)} ici. Mensualité = ${f(capital, 0)} / ${f(r2(factBas), 2)} = **${mnt(mensBas, '€', 2)}**. Rien de neuf sous le soleil : c'est la valeur actuelle du m4 jouée ${f(mois, 0)} fois — le crédit étalon du chapitre (250 000 € sur 20 ans à 1 %) paie environ 1 150 € par mois.`,
          }],
          pieges: [en
            ? `Dividing capital by the number of months (${mnt(r2(capital / mois), '€', 0)}) forgets the interest entirely: even at ${pct(tauxBas, 1)}, the bank does not lend for free.`
            : `Diviser le capital par le nombre de mois (${mnt(r2(capital / mois), '€', 0)}) oublie entièrement les intérêts : même à ${pct(tauxBas, 1)}, la banque ne prête pas gratuitement.`],
        },
        {
          intitule: en ? `b) The new world: the payment at ${pct(tauxHaut, 1)}` : `b) Le nouveau monde : la mensualité à ${pct(tauxHaut, 1)}`,
          enonce: en
            ? `Same flat, same ${mnt(capital, '€', 0)}, same ${f(cfg.ans, 0)} years — but the tightening cycle pushed the mortgage rate to ${pct(tauxHaut, 1)}. New monthly payment, in euros?`
            : `Même appartement, mêmes ${mnt(capital, '€', 0)}, mêmes ${f(cfg.ans, 0)} ans — mais le cycle de hausses a porté le taux du crédit à ${pct(tauxHaut, 1)}. Nouvelle mensualité, en euros ?`,
          reponse: mensHaut, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'Same formula, another discount rate' : 'Même formule, un autre taux d\'actualisation',
            contenu: en
              ? `Annuity factor at ${pct(tauxHaut, 1)}: ${f(r2(factHaut), 2)} (each future euro is discounted harder, the factor shrinks). Payment = ${f(capital, 0)} / ${f(r2(factHaut), 2)} = **${mnt(mensHaut, '€', 2)}** — **+${pct(haussePct, 1)}** versus a). The chapter's benchmark: 1% → 4% turns 1 150 € into 1 515 €, +32%, for the SAME flat. The rate rose by ${f(r2(tauxHaut - tauxBas), 1)} points; the payment rose by ${pct(haussePct, 1)} — this is how a committee decision reaches a household that has never heard of the deposit facility.`
              : `Facteur d'annuité à ${pct(tauxHaut, 1)} : ${f(r2(factHaut), 2)} (chaque euro futur est actualisé plus durement, le facteur rétrécit). Mensualité = ${f(capital, 0)} / ${f(r2(factHaut), 2)} = **${mnt(mensHaut, '€', 2)}** — **+${pct(haussePct, 1)}** par rapport au a). L'étalon du chapitre : 1 % → 4 % transforme 1 150 € en 1 515 €, +32 %, pour le MÊME appartement. Le taux a monté de ${f(r2(tauxHaut - tauxBas), 1)} points ; la mensualité de ${pct(haussePct, 1)} — voilà comment une décision de comité atteint un ménage qui n'a jamais entendu parler du taux de dépôt.`,
          }],
          pieges: [en
            ? `Expecting the payment to rise like the rate ("${f(r2(tauxHaut - tauxBas), 1)} points, so a few %"): the rate applies to the whole outstanding balance over ${f(cfg.ans, 0)} years — the payment jumps ${pct(haussePct, 1)}.`
            : `Attendre que la mensualité monte comme le taux (« ${f(r2(tauxHaut - tauxBas), 1)} points, donc quelques % ») : le taux s'applique à tout le capital restant dû pendant ${f(cfg.ans, 0)} ans — la mensualité bondit de ${pct(haussePct, 1)}.`],
        },
        {
          intitule: en ? 'c) The banker\'s reading: the borrowing capacity' : 'c) La lecture du banquier : la capacité d\'emprunt',
          enonce: en
            ? `The household's repayment budget has not moved: it is the payment of a) (${mnt(mensBas, '€', 2)}). At ${pct(tauxHaut, 1)}, what capital can that budget still finance, in euros?`
            : `Le budget de remboursement du ménage n'a pas bougé : c'est la mensualité du a) (${mnt(mensBas, '€', 2)}). À ${pct(tauxHaut, 1)}, quel capital ce budget peut-il encore financer, en euros ?`,
          reponse: capacite, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'Capacity = payment × annuity factor: the table read backwards' : 'Capacité = mensualité × facteur d\'annuité : le tableau lu à l\'envers',
            contenu: en
              ? `Capacity = ${f(mensBas, 2)} × ${f(r2(factHaut), 2)} = **${mnt(capacite, '€', 2)}** — **−${pct(chutePct, 1)}** of home-buying power, evaporated by discounting arithmetic alone (the chapter's benchmark: 250 000 € falls to 189 775 €, almost a quarter). Less capacity is less housing demand, hence downward pressure on property prices and construction — an entire sector slowing because twenty-odd people moved an overnight rate. That, precisely, is the transmission the committee wants: nobody escapes a monthly payment.`
              : `Capacité = ${f(mensBas, 2)} × ${f(r2(factHaut), 2)} = **${mnt(capacite, '€', 2)}** — **−${pct(chutePct, 1)}** de pouvoir d'achat immobilier, évaporés par la seule arithmétique de l'actualisation (l'étalon du chapitre : 250 000 € tombent à 189 775 €, près d'un quart). Moins de capacité, c'est moins de demande de logements, donc une pression baissière sur les prix immobiliers et la construction — un secteur entier qui ralentit parce qu'une vingtaine de personnes ont bougé un taux au jour le jour. C'est précisément la transmission que veut le comité : personne n'échappe à une mensualité.`,
          }],
          pieges: [en
            ? `Shrinking the capacity by the payment rise (−${pct(haussePct, 1)} applied to capital) mixes the two readings of the table: the capacity is the payment RE-multiplied by the new factor — compute it, do not guess it.`
            : `Réduire la capacité de la hausse de mensualité (−${pct(haussePct, 1)} appliqués au capital) mélange les deux lectures du tableau : la capacité est la mensualité RE-multipliée par le nouveau facteur — on la calcule, on ne la devine pas.`],
        },
        {
          intitule: en ? 'd) The silent bill: total interest, before and after' : "d) La facture silencieuse : les intérêts totaux, avant et après",
          enonce: en
            ? `Total interest = payment × ${f(mois, 0)} − capital, in each world. By what factor does the interest bill get multiplied between ${pct(tauxBas, 1)} and ${pct(tauxHaut, 1)}?`
            : `Intérêts totaux = mensualité × ${f(mois, 0)} − capital, dans chaque monde. Par quel facteur la facture d'intérêts est-elle multipliée entre ${pct(tauxBas, 1)} et ${pct(tauxHaut, 1)} ?`,
          reponse: ratioInterets, tolerance: 0.005, unite: '×',
          etapes: [
            {
              titre: en ? 'The most violent line of the table' : 'La ligne la plus violente du tableau',
              contenu: en
                ? `At ${pct(tauxBas, 1)}: ${f(mensBas, 2)} × ${f(mois, 0)} − ${f(capital, 0)} = ${mnt(intBas, '€', 0)} of interest. At ${pct(tauxHaut, 1)}: ${f(mensHaut, 2)} × ${f(mois, 0)} − ${f(capital, 0)} = ${mnt(intHaut, '€', 0)}. Ratio: **× ${f(ratioInterets, 2)}** — the chapter's benchmark is ×4.4 (25 937 € → 113 588 €). The payment moves by tens of percent, the interest bill by hundreds: near-zero rates made the COST of credit almost invisible, and the tightening made it reappear in full.`
                : `À ${pct(tauxBas, 1)} : ${f(mensBas, 2)} × ${f(mois, 0)} − ${f(capital, 0)} = ${mnt(intBas, '€', 0)} d'intérêts. À ${pct(tauxHaut, 1)} : ${f(mensHaut, 2)} × ${f(mois, 0)} − ${f(capital, 0)} = ${mnt(intHaut, '€', 0)}. Ratio : **× ${f(ratioInterets, 2)}** — l'étalon du chapitre est ×4,4 (25 937 € → 113 588 €). La mensualité bouge de dizaines de pour cent, la facture d'intérêts de centaines : les taux quasi nuls avaient rendu le COÛT du crédit presque invisible, et le resserrement l'a fait réapparaître en entier.`,
            },
            {
              titre: en ? 'The macro chain to recite' : 'La chaîne macro à réciter',
              contenu: en
                ? `Policy rate → interbank rate (€STR/SOFR, on a short leash) → mortgage and corporate rates → payments +${pct(haussePct, 1)}, capacity −${pct(chutePct, 1)} → housing demand and investment slow → inflation cools, with the 12-18 month lags of chapter 3. Same mechanism for firms: a project worth 100 in ten years is worth 100/1.01^10 = 90.5 discounted at 1% but 100/1.04^10 = 67.6 at 4% — the central bank pilots the denominator of the whole economy.`
                : `Taux directeur → taux interbancaire (€STR/SOFR, à laisse courte) → taux des crédits immobiliers et aux entreprises → mensualités +${pct(haussePct, 1)}, capacité −${pct(chutePct, 1)} → la demande de logements et l'investissement ralentissent → l'inflation refroidit, avec les délais de 12-18 mois du chapitre 3. Même mécanique pour les entreprises : un projet qui vaut 100 dans dix ans vaut 90,5 actualisé à 1 % mais 67,6 à 4 % — la banque centrale pilote le dénominateur de toute l'économie.`,
            },
          ],
          pieges: [en
            ? `Comparing the PAYMENTS ratio (× ${f(r2(mensHaut / mensBas), 2)}) instead of the INTEREST ratio: the capital repaid is the same in both worlds — only the interest line explodes, and that is the line that measures the channel.`
            : `Comparer le ratio des MENSUALITÉS (× ${f(r2(mensHaut / mensBas), 2)}) au lieu de celui des INTÉRÊTS : le capital remboursé est le même dans les deux mondes — seule la ligne d'intérêts explose, et c'est elle qui mesure le canal.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 5. m10-pb-05 — Le desk obligataire face au CPI — N2                 */
/* ------------------------------------------------------------------ */
const deskFaceAuCpi: ProblemeMoule = {
  id: 'm10-pb-05', moduleId: M10,
  titre: 'Le desk obligataire face au CPI : de la surprise au P&L',
  titreEn: 'The bond desk on CPI day: from the surprise to the P&L',
  typeDeCas: 'surprise d\'indicateur',
  typeDeCasEn: 'data surprise',
  difficulte: 2,
  scenarios: ['Le desk Treasuries un matin de CPI (2022, régime « inflation dominante »)', "Le gérant obligataire européen et l'IPCH qui déborde", 'La candidate du jeu de bourse déroule la grille en quatre questions'],
  scenariosEn: ['The Treasuries desk on a CPI morning (2022, inflation-dominant regime)', 'The European bond manager and the HICP overshoot', 'The trading-game candidate runs the four-question grid'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : consensus, écart publié−consensus, σ des surprises,
    // taux directeur, hausses pricées avant/après, pas, choc sur le 10 ans,
    // duration du book, nominal.
    const cfg = ([
      { cMin: 7.8, cMax: 8.6, eMin: 2, eMax: 4, sMin: 12, sMax: 18, tMin: 6, tMax: 10, pas: 50, n1Min: 2, n1Max: 3, dnMin: 1, dnMax: 2, dyMin: 14, dyMax: 25, dMin: 6.0, dMax: 8.0, nMin: 3, nMax: 6, sym: '$' },
      { cMin: 5.0, cMax: 6.2, eMin: 2, eMax: 5, sMin: 14, sMax: 22, tMin: 8, tMax: 14, pas: 25, n1Min: 3, n1Max: 5, dnMin: 1, dnMax: 3, dyMin: 8, dyMax: 18, dMin: 5.0, dMax: 7.0, nMin: 2, nMax: 4, sym: '€' },
      { cMin: 3.2, cMax: 4.2, eMin: 2, eMax: 3, sMin: 10, sMax: 15, tMin: 12, tMax: 18, pas: 25, n1Min: 1, n1Max: 2, dnMin: 1, dnMax: 2, dyMin: 6, dyMax: 14, dMin: 4.0, dMax: 6.0, nMin: 1, nMax: 3, sym: '€' },
    ] as const)[sIdx];
    const consensus = randFloat(rng, cfg.cMin, cfg.cMax, 1);
    const ecart = randInt(rng, cfg.eMin, cfg.eMax) / 10;
    const publie = r2(consensus + ecart);
    const sigma = randInt(rng, cfg.sMin, cfg.sMax) / 100;
    const tauxActuel = randInt(rng, cfg.tMin, cfg.tMax) * 0.25;
    const n1 = randInt(rng, cfg.n1Min, cfg.n1Max);
    const n2 = n1 + randInt(rng, cfg.dnMin, cfg.dnMax);
    const dy = randInt(rng, cfg.dyMin, cfg.dyMax);
    const duration = randFloat(rng, cfg.dMin, cfg.dMax, 1);
    const nominal = randInt(rng, cfg.nMin, cfg.nMax) * 100;
    const sigmas = r2(surpriseIndicateur(consensus, publie, sigma));
    const terminalAvant = r2(tauxTerminalAnticipe(tauxActuel, n1, cfg.pas));
    const terminalApres = r2(tauxTerminalAnticipe(tauxActuel, n2, cfg.pas));
    const variation = r2(variationPrixObligationDuration(duration, dy));
    const pnl = r2(nominal * variation / 100);

    const { en, f, pct } = outils(langue);
    // Montants en millions : « \$400m » côté EN (signe AVANT le symbole), « 400 M\$ » côté FR.
    const sSym = cfg.sym === '$' ? '\\$' : cfg.sym;
    const mM = (v: number, d = 0) => (en ? `${v < 0 ? '−' : ''}${sSym}${f(Math.abs(v), d)}m` : `${f(v, d)} M${sSym}`);
    const desc = en
      ? `CPI consensus ${pct(consensus, 1)} year-on-year, print ${pct(publie, 1)}, historical standard deviation of surprises ${f(sigma, 2)} point; policy rate ${pct(tauxActuel, 2)}, market pricing ${f(n1, 0)} more ${f(cfg.pas, 0)} bp hikes before the release, ${f(n2, 0)} after; the 10-year jumps ${f(dy, 0)} bp; the book: ${mM(nominal)} of bonds, modified duration ${f(duration, 1)}`
      : `consensus CPI ${pct(consensus, 1)} en glissement annuel, publié ${pct(publie, 1)}, écart-type historique des surprises ${f(sigma, 2)} point ; taux directeur ${pct(tauxActuel, 2)}, marché pricant ${f(n1, 0)} hausses de ${f(cfg.pas, 0)} pb de plus avant la publication, ${f(n2, 0)} après ; le 10 ans saute de ${f(dy, 0)} pb ; le book : ${mM(nominal)} de titres, duration modifiée ${f(duration, 1)}`;
    const contexte = (en
      ? [
        `8:29 in New York, positions trimmed, spreads widened — the CPI drops in sixty seconds and the junior holds the book: ${desc}. The four questions of the chapter, in order: how big is the surprise in sigmas, where does the terminal rate reprice, what does the 10-year move do to the book through duration — and the P&L line to announce before the morning call.`,
        `Frankfurt morning, HICP day: the flash estimate lands above every forecast in the survey, and the fund's rates book is long duration: ${desc}. The manager wants the professional reading, not adjectives: the standardized surprise, the new terminal rate priced by the €STR curve, the duration hit, the P&L in euros.`,
        `Trading-game final, "macro" round: the jury hands one line of data and a bond book, and wants the full grid recited with numbers: ${desc}. Surprise in sigmas, repricing of the hiking path, duration impact, P&L — and at each step, the sentence that shows the mechanism is understood.`,
      ]
      : [
        `8 h 29 à New York, positions allégées, fourchettes élargies — le CPI tombe dans soixante secondes et le junior tient le book : ${desc}. Les quatre questions du chapitre, dans l'ordre : quelle taille de surprise en sigmas, où se reprice le taux terminal, que fait le mouvement du 10 ans au book via la duration — et la ligne de P&L à annoncer avant le morning call.`,
        `Matin de Francfort, jour d'IPCH : l'estimation flash sort au-dessus de toutes les prévisions du sondage, et le book taux du fonds est long en duration : ${desc}. Le gérant veut la lecture professionnelle, pas des adjectifs : la surprise standardisée, le nouveau taux terminal pricé par la courbe €STR, le choc de duration, le P&L en euros.`,
        `Finale du jeu de bourse, épreuve « macro » : le jury tend une ligne de données et un book obligataire, et veut la grille complète récitée avec des chiffres : ${desc}. Surprise en sigmas, repricing du sentier de hausses, impact duration, P&L — et à chaque étape, la phrase qui montre que le mécanisme est compris.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) How big is it: the surprise in sigmas' : 'a) Quelle taille : la surprise en sigmas',
          enonce: en
            ? `Consensus ${pct(consensus, 1)}, print ${pct(publie, 1)}, historical σ of surprises ${f(sigma, 2)} point. Standardized surprise (no unit)?`
            : `Consensus ${pct(consensus, 1)}, publié ${pct(publie, 1)}, σ historique des surprises ${f(sigma, 2)} point. Surprise standardisée (sans unité) ?`,
          reponse: sigmas, tolerance: 0.005, unite: 'σ',
          etapes: [{
            titre: en ? 'surprise = (print − consensus)/σ: only the gap moves prices' : 'surprise = (publié − consensus)/σ : seul l\'écart bouge les prix',
            contenu: en
              ? `$\\text{surprise} = \\frac{\\text{print} - \\text{consensus}}{\\sigma}$ = (${f(publie, 1)} − ${f(consensus, 1)})/${f(sigma, 2)} = **+${f(sigmas, 2)}σ**. The consensus was already in the prices (module 1's efficiency at work): a print AT consensus, however ugly in absolute terms, is a non-event. Standardizing by the historical σ of surprises turns "${f(ecart, 1)} point above" into a comparable size — ±0.5σ is noise, ±2σ is an event, and a CPI at +2σ and an NFP at +2σ are the same size of shock whatever their units.`
              : `$\\text{surprise} = \\frac{\\text{publié} - \\text{consensus}}{\\sigma}$ = (${f(publie, 1)} − ${f(consensus, 1)})/${f(sigma, 2)} = **+${f(sigmas, 2)}σ**. Le consensus était déjà dans les prix (l'efficience du module 1 au travail) : un chiffre AU consensus, si vilain soit-il dans l'absolu, est un non-événement. Standardiser par le σ historique des surprises transforme « ${f(ecart, 1)} point au-dessus » en taille comparable — ±0,5σ est du bruit, ±2σ un événement, et un CPI à +2σ et un NFP à +2σ sont la même taille de choc quelles que soient leurs unités.`,
          }],
          pieges: [en
            ? `Reacting to the LEVEL ("${pct(publie, 1)}, bonds will crash"): if the consensus had been ${pct(publie, 1)}, nothing would move — the desk trades the gap to consensus, never the headline number.`
            : `Réagir au NIVEAU (« ${pct(publie, 1)}, les obligations vont s'effondrer ») : si le consensus avait été ${pct(publie, 1)}, rien ne bougerait — le desk trade l'écart au consensus, jamais le chiffre brut.`],
        },
        {
          intitule: en ? 'b) Where the cycle now ends: the terminal rate' : 'b) Où finit désormais le cycle : le taux terminal',
          enonce: en
            ? `Before the print, the market priced ${f(n1, 0)} more ${f(cfg.pas, 0)} bp hikes from ${pct(tauxActuel, 2)}; the surprise makes it ${f(n2, 0)}. What terminal rate is now priced, in %?`
            : `Avant la publication, le marché priçait encore ${f(n1, 0)} hausses de ${f(cfg.pas, 0)} pb depuis ${pct(tauxActuel, 2)} ; la surprise en fait pricer ${f(n2, 0)}. Quel taux terminal est désormais pricé, en % ?`,
          reponse: terminalApres, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'terminal = current + n × step/100' : 'terminal = actuel + n × pas/100',
            contenu: en
              ? `$\\text{terminal} = i + n \\times \\frac{\\text{step}}{100}$ = ${f(tauxActuel, 2)} + ${f(n2, 0)} × ${f(cfg.pas / 100, 2)} = **${pct(terminalApres, 2)}**, against ${pct(terminalAvant, 2)} before the print — the whole anticipated path shifted by ${f((n2 - n1) * cfg.pas, 0)} bp in one release. That is the cascade of the chapter: the indicator does not move prices directly, it moves the ANTICIPATED central bank, which moves everything else. For scale: the 2022-2023 cycles ran +525 bp (Fed) and +450 bp (ECB), readable meeting by meeting in exactly this arithmetic.`
              : `$\\text{terminal} = i + n \\times \\frac{\\text{pas}}{100}$ = ${f(tauxActuel, 2)} + ${f(n2, 0)} × ${f(cfg.pas / 100, 2)} = **${pct(terminalApres, 2)}**, contre ${pct(terminalAvant, 2)} avant la publication — tout le sentier anticipé a bougé de ${f((n2 - n1) * cfg.pas, 0)} pb en une publication. C'est la cascade du chapitre : l'indicateur ne bouge pas les prix directement, il bouge la banque centrale ANTICIPÉE, qui bouge tout le reste. Échelle : les cycles 2022-2023 ont couru à +525 pb (Fed) et +450 pb (BCE), lisibles réunion par réunion dans exactement cette arithmétique.`,
          }],
          pieges: [en
            ? `The basis-point conversion: ${f(n2, 0)} × ${f(cfg.pas, 0)} bp is ${pct(r2(n2 * cfg.pas / 100), 2)}, not ${pct(r2(n2 * cfg.pas), 0)} — 100 bp = 1%, the committee's language.`
            : `La conversion en points de base : ${f(n2, 0)} × ${f(cfg.pas, 0)} pb font ${pct(r2(n2 * cfg.pas / 100), 2)}, pas ${pct(r2(n2 * cfg.pas), 0)} — 100 pb = 1 %, la langue des comités.`],
        },
        {
          intitule: en ? `c) The book through duration: the 10-year takes ${f(dy, 0)} bp` : `c) Le book via la duration : le 10 ans prend ${f(dy, 0)} pb`,
          enonce: en
            ? `The repriced path pushes the 10-year up ${f(dy, 0)} bp. With a modified duration of ${f(duration, 1)}, what does the book lose in %?`
            : `Le sentier repricé pousse le 10 ans de ${f(dy, 0)} pb à la hausse. Avec une duration modifiée de ${f(duration, 1)}, que perd le book en % ?`,
          reponse: variation, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'ΔP/P ≈ −D·Δy: the most mechanical channel there is' : 'ΔP/P ≈ −D·Δy : le canal le plus mécanique qui soit',
            contenu: en
              ? `$\\frac{\\Delta P}{P} \\approx -D_{\\text{mod}} \\times \\Delta y$ = −${f(duration, 1)} × ${f(dy / 100, 2)} = **${pct(variation, 2)}**. The m4 duration applied to monetary policy — the linear approximation is slightly pessimistic for the holder (convexity softens the true loss). This is 2022 in miniature: +300 bp on a duration of 7 gives −21%, and the "risk-free" Global Aggregate returned about −17% on the year — risk-free describes the DEFAULT, never the price.`
              : `$\\frac{\\Delta P}{P} \\approx -D_{\\text{mod}} \\times \\Delta y$ = −${f(duration, 1)} × ${f(dy / 100, 2)} = **${pct(variation, 2)}**. La duration du m4 appliquée à la politique monétaire — l'approximation linéaire est légèrement pessimiste pour le porteur (la convexité adoucit la vraie perte). C'est 2022 en miniature : +300 pb sur une duration de 7 donnent −21 %, et le Global Aggregate « sans risque » a rendu environ −17 % sur l'année — sans risque qualifie le DÉFAUT, jamais le prix.`,
          }],
          pieges: [en
            ? `Feeding Δy in percent instead of converting the basis points (−${f(duration, 1)} × ${f(dy, 0)} = ${pct(r2(-duration * dy), 0)}!): Δy enters as ${f(dy, 0)}/100 = ${f(dy / 100, 2)} point.`
            : `Passer Δy en pour cent sans convertir les points de base (−${f(duration, 1)} × ${f(dy, 0)} = ${pct(r2(-duration * dy), 0)} !) : Δy entre comme ${f(dy, 0)}/100 = ${f(dy / 100, 2)} point.`],
        },
        {
          intitule: en ? 'd) The line for the morning call: the P&L' : 'd) La ligne du morning call : le P&L',
          enonce: en
            ? `The book carries ${mM(nominal)} of bonds. Apply c): what is the day's P&L, in millions?`
            : `Le book porte ${mM(nominal)} de titres. Appliquez le c) : quel est le P&L du jour, en millions ?`,
          reponse: pnl, tolerance: 0.005, unite: en ? `${cfg.sym}m` : `M${cfg.sym}`,
          etapes: [
            {
              titre: en ? 'P&L = nominal × ΔP/P' : 'P&L = nominal × ΔP/P',
              contenu: en
                ? `P&L = ${f(nominal, 0)} × ${f(variation, 2)}% = **${mM(pnl, 2)}** — one twelve-month inflation print, read against a consensus, and the book gives back ${mM(Math.abs(pnl), 2)} through pure duration arithmetic. The cascade in one line: surprise (+${f(sigmas, 2)}σ) → path (+${f((n2 - n1) * cfg.pas, 0)} bp of terminal) → curve (+${f(dy, 0)} bp on the 10-year) → book (${pct(variation, 2)}).`
                : `P&L = ${f(nominal, 0)} × ${f(variation, 2)} % = **${mM(pnl, 2)}** — un chiffre d'inflation en glissement, lu contre un consensus, et le book rend ${mM(Math.abs(pnl), 2)} par pure arithmétique de duration. La cascade en une ligne : surprise (+${f(sigmas, 2)}σ) → sentier (+${f((n2 - n1) * cfg.pas, 0)} pb de terminal) → courbe (+${f(dy, 0)} pb sur le 10 ans) → book (${pct(variation, 2)}).`,
            },
            {
              titre: en ? 'The regime footnote: good news is bad news' : 'La note de régime : good news is bad news',
              contenu: en
                ? `In an inflation-dominant regime the same reading applies to EQUITIES: a strong jobs print means more hikes, so lower valuations — the sign of the reaction depends on what the central bank is fighting, not on whether the news is "good". And two desk cautions from the chapter: the first seconds whipsaw (algorithms reprice the headline before reading the core and the revisions — judge the P&L at 3pm, never at the first second), and don't fight the Fed — "the pivot is coming" cost money all through 2022 against 425 bp of delivered hikes.`
                : `En régime d'inflation dominante, la même lecture s'applique aux ACTIONS : un bon chiffre d'emploi signifie plus de hausses, donc des valorisations plus basses — le signe de la réaction dépend de ce que la banque centrale combat, pas du caractère « bon » de la nouvelle. Et deux prudences de desk du chapitre : le whipsaw des premières secondes (les algorithmes repricent le titre avant de lire le core et les révisions — le P&L se juge à 15 h, jamais à la première seconde), et don't fight the Fed — « le pivot arrive » a coûté cher tout 2022 contre 425 pb de hausses délivrées.`,
            },
          ],
          pieges: [en
            ? `Announcing the loss in percent when the call expects millions — and forgetting the sign: the book is LONG duration, a +${f(dy, 0)} bp move is a loss, not a gain.`
            : `Annoncer la perte en pour cent quand le call attend des millions — et oublier le signe : le book est LONG en duration, un mouvement de +${f(dy, 0)} pb est une perte, pas un gain.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 6. m10-pb-06 — Pricer les réunions : futures et probabilités — N2   */
/* ------------------------------------------------------------------ */
const pricerLesReunions: ProblemeMoule = {
  id: 'm10-pb-06', moduleId: M10,
  titre: 'Pricer les réunions : du prix du future au taux terminal',
  titreEn: 'Pricing the meetings: from the futures price to the terminal rate',
  typeDeCas: 'probabilités implicites',
  typeDeCasEn: 'implied probabilities',
  difficulte: 2,
  scenarios: ['Le stagiaire reconstruit FedWatch la veille du FOMC (cycle de hausses)', 'Le desk €STR price les réunions de la BCE (fin de resserrement)', "Le jury : « le marché attend des baisses — prouvez-le, chiffres à l'appui »"],
  scenariosEn: ['The intern rebuilds FedWatch on FOMC eve (hiking cycle)', 'The €STR desk prices the ECB meetings (late tightening)', 'The oral exam: "the market expects cuts — prove it with numbers"'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : taux effectif (quarts de point), proba visée
    // (multiples de 4 %), pas pricés cumulés (multiples de 0,04), sens du
    // cycle (+1 hausses / −1 baisses), nombre de pas et taille pour le d).
    const cfg = ([
      { tMin: 16, tMax: 20, dir: 1, pas: 50, npMin: 2, npMax: 3 },
      { tMin: 10, tMax: 14, dir: 1, pas: 25, npMin: 3, npMax: 5 },
      { tMin: 16, tMax: 21, dir: -1, pas: 25, npMin: 4, npMax: 6 },
    ] as const)[sIdx];
    const tauxActuel = randInt(rng, cfg.tMin, cfg.tMax) * 0.25;
    const q1 = 4 * randInt(rng, 8, 22); // proba de 32 à 88 %, multiple de 4 ⇒ prix à 2 décimales
    const hTot = 0.04 * randInt(rng, 30, 48); // pas de 25 pb cumulés pricés sur deux réunions
    const nbPas = randInt(rng, cfg.npMin, cfg.npMax);
    const dir = cfg.dir;
    const implicite1 = r2(tauxActuel + dir * (q1 / 100) * 0.25);
    const prix1 = r2(100 - implicite1);
    const implicite2 = r2(tauxActuel + dir * hTot * 0.25);
    const prix2 = r2(100 - implicite2);
    const nbPas25 = r2(hTot);
    const terminal = r2(tauxTerminalAnticipe(tauxActuel, nbPas, dir * cfg.pas));
    const up = dir > 0;

    const { en, f, pct } = outils(langue);
    const mvEn = up ? 'hike' : 'cut';
    const mvFr = up ? 'hausse' : 'baisse';
    const desc = en
      ? `effective rate ${pct(tauxActuel, 2)}; a 25 bp ${mvEn} is at stake at the next meeting; the future covering the month after that meeting trades at ${f(prix1, 2)}, the one covering the month after the SECOND meeting at ${f(prix2, 2)} (price = 100 − expected average rate)`
      : `taux effectif ${pct(tauxActuel, 2)} ; une ${mvFr} de 25 pb est en jeu à la prochaine réunion ; le future couvrant le mois qui suit cette réunion cote ${f(prix1, 2)}, celui couvrant le mois qui suit la DEUXIÈME réunion cote ${f(prix2, 2)} (prix = 100 − taux moyen attendu)`;
    const contexte = (en
      ? [
        `FOMC eve, and the intern is asked to rebuild by hand the probabilities the press quotes "according to markets": ${desc}. Three subtractions and a chain: the rate implied by the first future, the probability of a ${mvEn}, the number of moves priced through two meetings — then the terminal rate if the committee delivers the path the dots suggest (${f(nbPas, 0)} ${mvEn}s of ${f(cfg.pas, 0)} bp).`,
        `On the €STR desk, the strategist updates the meeting-by-meeting path before the Governing Council: ${desc}. Requested for the note: the implied rate, the probability priced for the next meeting, the cumulative moves priced over two meetings, and the terminal rate of a ${f(nbPas, 0)} × ${f(cfg.pas, 0)} bp scenario.`,
        `Oral exam: "everyone says the market expects cuts — show me where that sentence lives in a price." The examiner provides: ${desc}. Expected: implied rate, probability of a ${mvEn} at the next meeting, moves priced through two meetings, and the floor if the cycle delivers ${f(nbPas, 0)} cuts of ${f(cfg.pas, 0)} bp.`,
      ]
      : [
        `Veille de FOMC, et le stagiaire doit reconstruire à la main les probabilités que la presse cite « selon les marchés » : ${desc}. Trois soustractions et un chaînage : le taux implicite du premier future, la probabilité de ${mvFr}, le nombre de pas pricés sur deux réunions — puis le taux terminal si le comité délivre le sentier suggéré par les dots (${f(nbPas, 0)} ${mvFr}s de ${f(cfg.pas, 0)} pb).`,
        `Sur le desk €STR, le stratégiste met à jour le sentier réunion par réunion avant le Conseil des gouverneurs : ${desc}. Attendu pour la note : le taux implicite, la probabilité pricée pour la prochaine réunion, les pas cumulés pricés sur deux réunions, et le taux terminal d'un scénario à ${f(nbPas, 0)} × ${f(cfg.pas, 0)} pb.`,
        `Oral : « tout le monde dit que le marché attend des baisses — montrez-moi où cette phrase habite dans un prix. » L'examinateur fournit : ${desc}. Attendu : taux implicite, probabilité de ${mvFr} à la prochaine réunion, pas pricés sur deux réunions, et le plancher si le cycle délivre ${f(nbPas, 0)} baisses de ${f(cfg.pas, 0)} pb.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? `a) The future speaks: the implied rate at ${f(prix1, 2)}` : `a) Le future parle : le taux implicite à ${f(prix1, 2)}`,
          enonce: en
            ? `The future covering the month after the meeting trades at ${f(prix1, 2)}. What average rate does the market expect for that month, in %?`
            : `Le future couvrant le mois qui suit la réunion cote ${f(prix1, 2)}. Quel taux moyen le marché attend-il pour ce mois-là, en % ?`,
          reponse: implicite1, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'Implied rate = 100 − price' : 'Taux implicite = 100 − prix',
            contenu: en
              ? `The convention of short-rate futures (fed funds in Chicago, €STR in Europe — firm derivatives from module 7): $\\text{price} = 100 - \\text{expected average rate}$, so implied = 100 − ${f(prix1, 2)} = **${pct(implicite1, 2)}**. Note what the number is NOT: neither ${pct(tauxActuel, 2)} (no move) nor ${pct(r2(tauxActuel + dir * 0.25), 2)} (certain ${mvEn}) — it sits in between, and that in-between is information.`
              : `La convention des futures de taux courts (fed funds à Chicago, €STR en Europe — dérivés fermes du module 7) : $\\text{prix} = 100 - \\text{taux moyen attendu}$, donc implicite = 100 − ${f(prix1, 2)} = **${pct(implicite1, 2)}**. Notez ce que le chiffre n'est PAS : ni ${pct(tauxActuel, 2)} (aucun mouvement) ni ${pct(r2(tauxActuel + dir * 0.25), 2)} (${mvFr} certaine) — il est entre les deux, et cet entre-deux est de l'information.`,
          }],
          pieges: [en
            ? `Reading the futures price as a bond price ("${f(prix1, 2)}% of par"): it is a RATE convention — a price ABOVE 100 − current rate means cuts priced, below means hikes.`
            : `Lire le prix du future comme un prix d'obligation (« ${f(prix1, 2)} % du nominal ») : c'est une convention de TAUX — un prix AU-DESSUS de 100 − taux actuel signifie des baisses pricées, en dessous des hausses.`],
        },
        {
          intitule: en ? `b) The number the press quotes: the probability of a ${mvEn}` : `b) Le chiffre que cite la presse : la probabilité de ${mvFr}`,
          enonce: en
            ? `The implied rate of a) is a probability-weighted average between ${pct(tauxActuel, 2)} (no move) and ${pct(r2(tauxActuel + dir * 0.25), 2)} (25 bp ${mvEn}). What probability of a ${mvEn} is the market pricing, in %?`
            : `Le taux implicite du a) est une moyenne pondérée par les probabilités entre ${pct(tauxActuel, 2)} (statu quo) et ${pct(r2(tauxActuel + dir * 0.25), 2)} (${mvFr} de 25 pb). Quelle probabilité de ${mvFr} le marché price-t-il, en % ?`,
          reponse: q1, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'p = |implied − current| / step: three subtractions' : 'p = |implicite − actuel| / pas : trois soustractions',
            contenu: en
              ? `$p = \\frac{|\\text{implied} - \\text{current}|}{\\text{step}}$ = |${f(implicite1, 2)} − ${f(tauxActuel, 2)}|/0.25 = ${f(r2(Math.abs(implicite1 - tauxActuel)), 2)}/0.25 = **${pct(q1, 0)}**. Solve it as an expectation if you prefer: p × ${f(r2(tauxActuel + dir * 0.25), 2)} + (1 − p) × ${f(tauxActuel, 2)} = ${f(implicite1, 2)}. This is exactly how the "according to markets" probabilities are built — CME's FedWatch does nothing else. The chapter's benchmark: current 4.00%, future at 95.85 ⇒ implied 4.15% ⇒ 60% chance of a hike.`
              : `$p = \\frac{|\\text{implicite} - \\text{actuel}|}{\\text{pas}}$ = |${f(implicite1, 2)} − ${f(tauxActuel, 2)}|/0,25 = ${f(r2(Math.abs(implicite1 - tauxActuel)), 2)}/0,25 = **${pct(q1, 0)}**. Résolvez-le en espérance si vous préférez : p × ${f(r2(tauxActuel + dir * 0.25), 2)} + (1 − p) × ${f(tauxActuel, 2)} = ${f(implicite1, 2)}. C'est exactement ainsi que se fabriquent les probabilités « selon les marchés » — le FedWatch du CME ne fait rien d'autre. L'étalon du chapitre : taux à 4,00 %, future à 95,85 ⇒ implicite 4,15 % ⇒ 60 % de chances de hausse.`,
          }],
          pieges: [en
            ? `Taking the complement (${pct(100 - q1, 0)}) or reading the raw gap ${f(r2(Math.abs(implicite1 - tauxActuel)), 2)} as the probability: the gap must be scaled by the step at stake, 25 bp.`
            : `Prendre le complément (${pct(100 - q1, 0)}) ou lire l'écart brut ${f(r2(Math.abs(implicite1 - tauxActuel)), 2)} comme la probabilité : l'écart se rapporte au pas en jeu, 25 pb.`],
        },
        {
          intitule: en ? 'c) Two meetings out: how many moves are priced' : 'c) À deux réunions : combien de pas sont pricés',
          enonce: en
            ? `The future covering the month after the SECOND meeting trades at ${f(prix2, 2)}. In 25 bp steps, how many ${mvEn}s does the market price in total by then?`
            : `Le future couvrant le mois qui suit la DEUXIÈME réunion cote ${f(prix2, 2)}. En pas de 25 pb, combien de ${mvFr}s le marché price-t-il au total d'ici là ?`,
          reponse: nbPas25, tolerance: 0.005, unite: en ? '25 bp steps' : 'pas de 25 pb',
          etapes: [{
            titre: en ? 'Chain the futures month by month: the anticipated path' : 'Chaîner les futures mois par mois : le sentier anticipé',
            contenu: en
              ? `Implied rate: 100 − ${f(prix2, 2)} = ${pct(implicite2, 2)}; cumulative move: |${f(implicite2, 2)} − ${f(tauxActuel, 2)}| = ${f(r2(Math.abs(implicite2 - tauxActuel)), 2)} point, i.e. ${f(r2(Math.abs(implicite2 - tauxActuel) * 100), 0)} bp / 25 = **${f(nbPas25, 2)} steps**. A non-integer number of steps is the market speaking probabilities: ${f(nbPas25, 2)} is, for instance, one certain ${mvEn} plus a ${pct(r2((nbPas25 - 1) * 100), 0)} chance of a second. Chaining the futures month by month rebuilds the whole anticipated path — the curve does not follow the central bank, it walks ahead of it.`
              : `Taux implicite : 100 − ${f(prix2, 2)} = ${pct(implicite2, 2)} ; mouvement cumulé : |${f(implicite2, 2)} − ${f(tauxActuel, 2)}| = ${f(r2(Math.abs(implicite2 - tauxActuel)), 2)} point, soit ${f(r2(Math.abs(implicite2 - tauxActuel) * 100), 0)} pb / 25 = **${f(nbPas25, 2)} pas**. Un nombre de pas non entier, c'est le marché qui parle en probabilités : ${f(nbPas25, 2)}, c'est par exemple une ${mvFr} certaine plus ${pct(r2((nbPas25 - 1) * 100), 0)} de chances d'une deuxième. Chaîner les futures mois par mois reconstruit tout le sentier anticipé — la courbe ne suit pas la banque centrale, elle la devance.`,
          }],
          pieges: [en
            ? `Rounding to a whole number of moves: the fractional part IS the information — a desk that reads "${f(nbPas25, 2)} steps" as "${f(Math.round(nbPas25), 0)}" throws away the probability distribution.`
            : `Arrondir à un nombre entier de pas : la partie fractionnaire EST l'information — un desk qui lit « ${f(nbPas25, 2)} pas » comme « ${f(Math.round(nbPas25), 0)} » jette la distribution de probabilités.`],
        },
        {
          intitule: en ? `d) The end of the road: ${f(nbPas, 0)} ${mvEn}s of ${f(cfg.pas, 0)} bp` : `d) Le bout du chemin : ${f(nbPas, 0)} ${mvFr}s de ${f(cfg.pas, 0)} pb`,
          enonce: en
            ? `Scenario consistent with the dots: the committee delivers ${f(nbPas, 0)} ${mvEn}s of ${f(cfg.pas, 0)} bp from ${pct(tauxActuel, 2)}. What ${up ? 'terminal rate' : 'floor'} does that imply, in %?`
            : `Scénario cohérent avec les dots : le comité délivre ${f(nbPas, 0)} ${mvFr}s de ${f(cfg.pas, 0)} pb depuis ${pct(tauxActuel, 2)}. Quel ${up ? 'taux terminal' : 'plancher'} cela implique-t-il, en % ?`,
          reponse: terminal, tolerance: 0.005, unite: '%',
          etapes: [
            {
              titre: en ? 'terminal = current + n × step/100, sign included' : 'terminal = actuel + n × pas/100, signe compris',
              contenu: en
                ? `$\\text{terminal} = i + n \\times \\frac{\\text{step}}{100}$ = ${f(tauxActuel, 2)} ${up ? '+' : '−'} ${f(nbPas, 0)} × ${f(cfg.pas / 100, 2)} = **${pct(terminal, 2)}**. The chapter's benchmarks: from 2.50%, four 50 bp hikes lead to 4.50%; from 4.00%, three 25 bp cuts lead back to 3.25%. A ${up ? 'positive' : 'negative'} step describes a ${up ? 'hiking' : 'cutting'} cycle — same arithmetic, opposite sign.`
                : `$\\text{terminal} = i + n \\times \\frac{\\text{pas}}{100}$ = ${f(tauxActuel, 2)} ${up ? '+' : '−'} ${f(nbPas, 0)} × ${f(cfg.pas / 100, 2)} = **${pct(terminal, 2)}**. Les étalons du chapitre : depuis 2,50 %, quatre hausses de 50 pb mènent à 4,50 % ; depuis 4,00 %, trois baisses de 25 pb ramènent à 3,25 %. Un pas ${up ? 'positif' : 'négatif'} décrit un cycle de ${up ? 'hausse' : 'baisse'} — même arithmétique, signe opposé.`,
            },
            {
              titre: en ? 'What the desk does with it' : 'Ce que le desk en fait',
              contenu: en
                ? `The market-implied path (a-b-c) is compared with the dot plots and with the desk's own Taylor rule: the DIFFERENCE is the trade. And remember the golden rule of the profession — never surprise, at least not involuntarily: on meeting day, a decision already priced moves nothing; what moves markets is the gap between the statement and the expected. A 25 bp hike when 50 were priced is a de facto EASING.`
                : `Le sentier implicite du marché (a-b-c) se compare aux dot plots et à la règle de Taylor maison : la DIFFÉRENCE est le trade. Et souvenez-vous de la règle d'or du métier — ne jamais surprendre, du moins pas involontairement : le jour de la réunion, une décision déjà pricée ne bouge rien ; ce qui bouge les marchés, c'est l'écart entre le communiqué et l'attendu. Une hausse de 25 pb quand 50 étaient pricés est une DÉTENTE de fait.`,
            },
          ],
          pieges: [en
            ? `The bp conversion strikes again: ${f(nbPas, 0)} × ${f(cfg.pas, 0)} bp = ${pct(r2(nbPas * cfg.pas / 100), 2)} of cumulative move, not ${pct(r2(nbPas * cfg.pas), 0)} — and mind the sign of the cycle.`
            : `La conversion en pb frappe encore : ${f(nbPas, 0)} × ${f(cfg.pas, 0)} pb = ${pct(r2(nbPas * cfg.pas / 100), 2)} de mouvement cumulé, pas ${pct(r2(nbPas * cfg.pas), 0)} — et gare au signe du cycle.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 7. m10-pb-07 — Le QE en pratique — N2                               */
/* ------------------------------------------------------------------ */
const qeEnPratique: ProblemeMoule = {
  id: 'm10-pb-07', moduleId: M10,
  titre: 'Le QE en pratique : le bilan, la prime de terme et le portefeuille',
  titreEn: 'QE in practice: the balance sheet, the term premium and the portfolio',
  typeDeCas: 'QE et bilan',
  typeDeCasEn: 'QE and the balance sheet',
  difficulte: 2,
  scenarios: ["L'analyste junior chiffre un programme d'achats de la Fed (façon QE3)", 'La BCE relance un programme APP : le stratégiste taux fait les comptes', "Le jury : « le QE, combien ça pèse, combien ça rapporte ? » (façon mars 2020)"],
  scenariosEn: ['The junior analyst sizes a Fed purchase programme (QE3-style)', 'The ECB restarts an APP-style programme: the rates strategist runs the numbers', 'The oral exam: "QE — how big, how effective?" (March-2020 style)'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : bilan de départ, achats mensuels, durée, PIB,
    // effet annoncé sur le 10 ans (étude d'événement), duration et taille du
    // portefeuille du gérant.
    const cfg = ([
      { bMin: 26, bMax: 30, aMin: 7, aMax: 9, mMin: 15, mMax: 20, pibMin: 160, pibMax: 175, eMin: 30, eMax: 60, dMin: 6.0, dMax: 8.0, pMin: 3, pMax: 8, sym: '$' },
      { bMin: 45, bMax: 65, aMin: 4, aMax: 8, mMin: 12, mMax: 24, pibMin: 110, pibMax: 125, eMin: 30, eMax: 50, dMin: 6.0, dMax: 8.5, pMin: 2, pMax: 6, sym: '€' },
      { bMin: 42, bMax: 50, aMin: 10, aMax: 13, mMin: 10, mMax: 14, pibMin: 200, pibMax: 220, eMin: 50, eMax: 90, dMin: 7.0, dMax: 9.0, pMin: 4, pMax: 9, sym: '$' },
    ] as const)[sIdx];
    const bilan = randInt(rng, cfg.bMin, cfg.bMax) * 100;
    const achats = randInt(rng, cfg.aMin, cfg.aMax) * 10;
    const moisProg = randInt(rng, cfg.mMin, cfg.mMax);
    const pib = randInt(rng, cfg.pibMin, cfg.pibMax) * 100;
    const effetPb = randInt(rng, cfg.eMin, cfg.eMax);
    const duration = randFloat(rng, cfg.dMin, cfg.dMax, 1);
    const portefeuille = randInt(rng, cfg.pMin, cfg.pMax) * 100;
    const nouveauBilan = r2(bilan + achats * moisProg);
    const variation = r2(variationPrixObligationDuration(duration, -effetPb));
    const gain = r2(portefeuille * variation / 100);
    const ratioPib = r2(100 * nouveauBilan / pib);
    const ratioAvant = r2(100 * bilan / pib);

    const { en, f, pct } = outils(langue);
    // Montants en milliards/millions : « \$4,060bn » / « \$500m » côté EN,
    // « 4 060 Md\$ » / « 500 M\$ » côté FR.
    const sSym = cfg.sym === '$' ? '\\$' : cfg.sym;
    const mMd = (v: number, d = 0) => (en ? `${v < 0 ? '−' : ''}${sSym}${f(Math.abs(v), d)}bn` : `${f(v, d)} Md${sSym}`);
    const mM = (v: number, d = 0) => (en ? `${v < 0 ? '−' : ''}${sSym}${f(Math.abs(v), d)}m` : `${f(v, d)} M${sSym}`);
    const desc = en
      ? `starting balance sheet ${mMd(bilan)}, purchases of ${mMd(achats)} a month for ${f(moisProg, 0)} months (government bonds, paid by crediting bank reserves); GDP ${mMd(pib)}; event studies put the announcement effect at about ${f(effetPb, 0)} bp OFF the 10-year yield; the manager's portfolio: ${mM(portefeuille)} of bonds, modified duration ${f(duration, 1)}`
      : `bilan de départ ${mMd(bilan)}, achats de ${mMd(achats)} par mois pendant ${f(moisProg, 0)} mois (titres d'État, payés en créditant les réserves des banques) ; PIB ${mMd(pib)} ; les études d'événement chiffrent l'effet d'annonce à environ ${f(effetPb, 0)} pb de BAISSE du 10 ans ; le portefeuille du gérant : ${mM(portefeuille)} de titres, duration modifiée ${f(duration, 1)}`;
    const contexte = (en
      ? [
        `The policy rate is glued to the floor and the committee announces an open-ended purchase programme, QE3-style ("until substantial improvement"): ${desc}. The junior's brief for the strategy note: the balance sheet after the programme, what the announced yield drop does to a bond portfolio, the gain in cash — and the balance-sheet-to-GDP ratio to place the programme in fifteen years of history.`,
        `Frankfurt reopens the toolbox: an APP-style programme, monthly purchases, reinvestments — and the rates strategist must turn the press release into numbers: ${desc}. Requested: the Eurosystem balance sheet at the end, the duration effect of the announced move on a client portfolio, the euros gained, and the ratio to GDP that the hawks will quote in the next interview.`,
        `Oral exam, and the examiner plays it March-2020: "the central bank buys in weeks what QE3 bought in a year — walk me through the numbers": ${desc}. Expected: the mechanical balance-sheet arithmetic, the portfolio impact through duration, the gain, and the bilan/PIB ratio with the historical anchors that make a good answer.`,
      ]
      : [
        `Le taux directeur est collé au plancher et le comité annonce un programme d'achats ouvert, façon QE3 (« jusqu'à amélioration substantielle ») : ${desc}. La mission du junior pour la note de stratégie : le bilan après le programme, ce que la baisse annoncée du 10 ans fait à un portefeuille obligataire, le gain en cash — et le ratio bilan/PIB pour situer le programme dans quinze ans d'histoire.`,
        `Francfort rouvre la boîte à outils : un programme façon APP, achats mensuels, réinvestissements — et le stratégiste taux doit transformer le communiqué en chiffres : ${desc}. Attendu : le bilan de l'Eurosystème à la fin, l'effet duration du mouvement annoncé sur un portefeuille client, les euros gagnés, et le ratio au PIB que les faucons citeront à la prochaine interview.`,
        `Oral, et l'examinateur joue la partition de mars 2020 : « la banque centrale achète en quelques semaines ce que QE3 achetait en un an — déroulez-moi les chiffres » : ${desc}. Attendu : l'arithmétique mécanique du bilan, l'impact portefeuille via la duration, le gain, et le ratio bilan/PIB avec les ancrages historiques qui font les bonnes réponses.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The accounting: the balance sheet after the programme' : 'a) La comptabilité : le bilan après le programme',
          enonce: en
            ? `${mMd(achats)} a month for ${f(moisProg, 0)} months, added to a starting balance sheet of ${mMd(bilan)}. Where does the balance sheet end, in billions?`
            : `${mMd(achats)} par mois pendant ${f(moisProg, 0)} mois, ajoutés à un bilan de départ de ${mMd(bilan)}. Où finit le bilan, en milliards ?`,
          reponse: nouveauBilan, tolerance: 0.005, unite: en ? `${cfg.sym}bn` : `Md${cfg.sym}`,
          etapes: [{
            titre: en ? 'Balance sheet = start + purchases: money written into existence' : 'Bilan = départ + achats : de la monnaie inscrite, pas prélevée',
            contenu: en
              ? `New balance sheet = ${f(bilan, 0)} + ${f(achats, 0)} × ${f(moisProg, 0)} = **${mMd(nouveauBilan)}** (+${pct(r2(100 * (nouveauBilan / bilan - 1)), 1)}). The double entry of the chapter: +${f(r2(achats * moisProg), 0)} of government bonds on the asset side, +${f(r2(achats * moisProg), 0)} of bank reserves on the liability side — the central bank takes this money from nowhere, it WRITES it. The selling bank merely swaps one asset (a 10-year bond) for another (a sight deposit at the central bank): at this stage, not one euro lands in a household's account — reserves are the banks' money, M0, not M2.`
              : `Nouveau bilan = ${f(bilan, 0)} + ${f(achats, 0)} × ${f(moisProg, 0)} = **${mMd(nouveauBilan)}** (+${pct(r2(100 * (nouveauBilan / bilan - 1)), 1)}). La double écriture du chapitre : +${f(r2(achats * moisProg), 0)} de titres d'État à l'actif, +${f(r2(achats * moisProg), 0)} de réserves bancaires au passif — la banque centrale ne prélève cet argent nulle part, elle l'INSCRIT. La banque vendeuse ne fait qu'échanger un actif (un titre à 10 ans) contre un autre (un dépôt à vue à la banque centrale) : à ce stade, pas un euro n'atterrit sur le compte d'un ménage — les réserves sont la monnaie des banques, M0, pas M2.`,
          }],
          pieges: [en
            ? `"Money printing = inflation" confuses M0 and M2: 2008-2014, the US monetary base nearly quintupled while M2 grew at its pre-crisis ~6% and core inflation sat UNDER the target — money only moves prices when it reaches actual spending (2020-2021, with fiscal transfers, is the counter-example).`
            : `« Planche à billets = inflation » confond M0 et M2 : 2008-2014, la base monétaire américaine a presque quintuplé pendant que M2 croissait à ses ~6 % d'avant-crise et que l'inflation sous-jacente restait SOUS la cible — la monnaie ne fait les prix que lorsqu'elle atteint la dépense réelle (2020-2021, avec les transferts budgétaires, est le contre-exemple).`],
        },
        {
          intitule: en ? `b) The announced effect: −${f(effetPb, 0)} bp through the duration` : `b) L'effet annoncé : −${f(effetPb, 0)} pb via la duration`,
          enonce: en
            ? `Event studies credit the announcement with about ${f(effetPb, 0)} bp off the 10-year. On a portfolio of modified duration ${f(duration, 1)}, what price move does that produce, in %?`
            : `Les études d'événement créditent l'annonce d'environ ${f(effetPb, 0)} pb de baisse du 10 ans. Sur un portefeuille de duration modifiée ${f(duration, 1)}, quelle variation de prix cela produit-il, en % ?`,
          reponse: variation, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'ΔP/P ≈ −D·Δy, with Δy NEGATIVE this time' : 'ΔP/P ≈ −D·Δy, avec Δy NÉGATIF cette fois',
            contenu: en
              ? `$\\frac{\\Delta P}{P} \\approx -D_{\\text{mod}} \\times \\Delta y$ = −${f(duration, 1)} × (−${f(effetPb / 100, 2)}) = **+${pct(variation, 2)}**. Why do yields fall when the central bank buys? The chapter's two channels: the SIGNAL (a balance sheet stuffed with 10-year paper makes the low-for-long promise credible — the expectations term falls) and DURATION SCARCITY (portfolio rebalancing: hundreds of billions of duration leave the market, the term premium compresses, and the evicted buyers migrate to credit and equities). Handle the ${f(effetPb, 0)} bp with care in front of a jury: QE1 measured 50-100 bp on the US 10-year depending on the study, and later programmes measured less — anticipated, hence already in the prices.`
              : `$\\frac{\\Delta P}{P} \\approx -D_{\\text{mod}} \\times \\Delta y$ = −${f(duration, 1)} × (−${f(effetPb / 100, 2)}) = **+${pct(variation, 2)}**. Pourquoi les taux baissent-ils quand la banque centrale achète ? Les deux canaux du chapitre : le SIGNAL (un bilan gavé de titres à 10 ans rend crédible la promesse de taux bas durables — le terme d'anticipations baisse) et la RARETÉ DE LA DURATION (portfolio rebalancing : des centaines de milliards de duration sortent du marché, la prime de terme se comprime, et les évincés migrent vers le crédit et les actions). Maniez les ${f(effetPb, 0)} pb avec des pincettes devant un jury : QE1 s'est mesuré à 50-100 pb sur le 10 ans américain selon les études, et les programmes suivants ont mesuré moins — anticipés, donc déjà dans les prix.`,
          }],
          pieges: [en
            ? `Getting the sign backwards: purchases LOWER yields, so bond PRICES RISE — the holder of duration gains from QE (and that, precisely, is one of the criticisms: QE works by inflating asset prices, held first by the wealthiest).`
            : `Se tromper de signe : les achats font BAISSER les taux, donc MONTER les prix des obligations — le porteur de duration gagne au QE (et c'est précisément l'une des critiques : le QE fonctionne en gonflant les prix d'actifs, détenus d'abord par les plus riches).`],
        },
        {
          intitule: en ? 'c) The manager\'s cash line: the gain in millions' : 'c) La ligne cash du gérant : le gain en millions',
          enonce: en
            ? `The portfolio holds ${mM(portefeuille)} of bonds. Apply b): what does the announcement gain, in millions?`
            : `Le portefeuille porte ${mM(portefeuille)} de titres. Appliquez le b) : que rapporte l'annonce, en millions ?`,
          reponse: gain, tolerance: 0.005, unite: en ? `${cfg.sym}m` : `M${cfg.sym}`,
          etapes: [{
            titre: en ? 'Gain = nominal × ΔP/P' : 'Gain = nominal × ΔP/P',
            contenu: en
              ? `Gain = ${f(portefeuille, 0)} × ${f(variation, 2)}% = **${mM(gain, 2)}** — for a press release. The taper tantrum of 2013 is the same arithmetic run backwards: Bernanke merely EVOKES slowing the purchases, the 10-year jumps about 130 bp in four months, and a duration of 8 loses about 10% — a sentence, priced through the same formula. When the central bank pilots anticipations, every word is an instrument.`
              : `Gain = ${f(portefeuille, 0)} × ${f(variation, 2)} % = **${mM(gain, 2)}** — pour un communiqué. Le taper tantrum de 2013 est la même arithmétique jouée à l'envers : Bernanke ÉVOQUE seulement un ralentissement des achats, le 10 ans bondit d'environ 130 pb en quatre mois, et une duration de 8 perd environ 10 % — une phrase, pricée par la même formule. Quand la banque centrale pilote les anticipations, chaque mot est un instrument.`,
          }],
          pieges: [en
            ? `Applying the effect to the CENTRAL BANK's purchases (${mMd(r2(achats * moisProg))}) instead of the manager's portfolio: the question prices a private book, not the programme.`
            : `Appliquer l'effet aux achats de la BANQUE CENTRALE (${mMd(r2(achats * moisProg))}) au lieu du portefeuille du gérant : la question price un book privé, pas le programme.`],
        },
        {
          intitule: en ? 'd) The order of magnitude: balance sheet over GDP' : "d) L'ordre de grandeur : le bilan sur le PIB",
          enonce: en
            ? `GDP stands at ${mMd(pib)}. After the programme, what does the balance sheet weigh as a % of GDP?`
            : `Le PIB est de ${mMd(pib)}. Après le programme, combien pèse le bilan en % du PIB ?`,
          reponse: ratioPib, tolerance: 0.005, unite: en ? '% of GDP' : '% du PIB',
          etapes: [
            {
              titre: en ? 'The yardstick of fifteen years of balance-sheet inflation' : "L'étalon de quinze ans d'inflation des bilans",
              contenu: en
                ? `Ratio = ${f(nouveauBilan, 0)} / ${f(pib, 0)} = **${pct(ratioPib, 2)}** (from ${pct(ratioAvant, 1)} before the programme). The chapter's anchors: the Fed went from ~6% of GDP mid-2008 to ~26% end-2014 and ~35% at the 2022 peak (~\\$9,000bn); the Eurosystem peaked around 65% of euro-area GDP (~€8,800bn); the pioneer BoJ exceeds 120%, ETFs included. Fifteen years took the big balance sheets from a 5-15% etiage to 30-60% and beyond.`
                : `Ratio = ${f(nouveauBilan, 0)} / ${f(pib, 0)} = **${pct(ratioPib, 2)}** (contre ${pct(ratioAvant, 1)} avant le programme). Les ancrages du chapitre : la Fed est passée de ~6 % du PIB mi-2008 à ~26 % fin 2014 et ~35 % au pic de 2022 (~9 000 Md\\$) ; l'Eurosystème a culminé vers 65 % du PIB de la zone euro (~8 800 Md€) ; la pionnière BoJ dépasse 120 %, ETF compris. Quinze ans ont fait passer les grands bilans d'un étiage de 5-15 % à 30-60 % et au-delà.`,
            },
            {
              titre: en ? 'The exit is not the entry played backwards' : "La sortie n'est pas l'entrée jouée à l'envers",
              contenu: en
                ? `QT shrinks this ratio by run-off — maturing bonds not reinvested, capped monthly (the 2022 Fed: \\$60bn Treasuries + \\$35bn MBS) — almost never by sales. The asymmetry: QE adds reserves to a system that absorbs them; QT withdraws them without knowing where the floor is. September 2019 found it the hard way: repo at ~10% intraday, SOFR at 5.25% against a 2-2.25% target — a plumbing failure, no insolvency anywhere. One discovers the floor by touching it.`
                : `Le QT réduit ce ratio par run-off — titres arrivant à maturité non réinvestis, plafonnés au mois (la Fed de 2022 : 60 Md\\$ de Treasuries + 35 Md\\$ de MBS) — presque jamais par ventes. L'asymétrie : le QE ajoute des réserves à un système qui les absorbe ; le QT en retire sans savoir où est le plancher. Septembre 2019 l'a trouvé à la dure : repo à ~10 % en séance, SOFR à 5,25 % contre une cible de 2-2,25 % — une panne de plomberie, aucune insolvabilité nulle part. Le plancher se découvre en le touchant.`,
            },
          ],
          pieges: [en
            ? `Comparing the balance sheet to the STOCK of public debt or to the budget: the desk convention is % of GDP — it is what makes 2008, 2014 and 2022 comparable, and what feeds the fiscal-dominance debate when the ratio means the central bank holds a quarter of its State's debt.`
            : `Comparer le bilan au STOCK de dette publique ou au budget : la convention de desk est le % du PIB — c'est ce qui rend 2008, 2014 et 2022 comparables, et ce qui nourrit le débat de dominance budgétaire quand le ratio signifie que la banque centrale détient un quart de la dette de son État.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 8. m10-pb-08 — Taux réels et classes d'actifs — N2                  */
/* ------------------------------------------------------------------ */
const tauxReelsClassesActifs: ProblemeMoule = {
  id: 'm10-pb-08', moduleId: M10,
  titre: "Taux réels et classes d'actifs : trois zones au tamis de Fisher",
  titreEn: 'Real rates and asset classes: three zones through the Fisher sieve',
  typeDeCas: 'taux réels',
  typeDeCasEn: 'real rates',
  difficulte: 2,
  scenarios: ['Le CIO passe trois zones au tamis du taux réel (fin 2022)', "La note « or » du stratégiste : pourquoi le métal ne monte pas", "Le jury : « classez ces trois économies et dites-moi où va le capital »"],
  scenariosEn: ['The CIO runs three zones through the real-rate sieve (late 2022)', 'The strategist\'s gold note: why the metal will not rally', 'The oral exam: "rank these three economies and tell me where capital flows"'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : trois zones (nominal, inflation) construites pour
    // que le classement C > A > B tienne sur tout le domaine ; réel visé et
    // inflation anticipée pour le d) ; resserrement et désinflation pour le e).
    const cfg = ([
      { iaMin: 15, iaMax: 19, paMin: 6.5, paMax: 8.0, ibMin: 6, ibMax: 10, pbMin: 8.0, pbMax: 10.0, icMin: 48, icMax: 56, pcMin: 5.5, pcMax: 7.0, rvMin: 0.5, rvMax: 1.5, pnMin: 4.0, pnMax: 6.5, hMin: 8, hMax: 12, pa2Min: 2.5, pa2Max: 4.0 },
      { iaMin: 16, iaMax: 20, paMin: 6.5, paMax: 7.5, ibMin: 4, ibMax: 8, pbMin: 8.0, pbMax: 10.0, icMin: 36, icMax: 44, pcMin: 4.5, pcMax: 5.5, rvMin: 0.5, rvMax: 1.0, pnMin: 4.5, pnMax: 7.0, hMin: 6, hMax: 10, pa2Min: 2.5, pa2Max: 3.5 },
      { iaMin: 20, iaMax: 24, paMin: 3.0, paMax: 4.0, ibMin: 12, ibMax: 16, pbMin: 6.5, pbMax: 8.5, icMin: 36, icMax: 44, pcMin: 4.0, pcMax: 5.0, rvMin: 1.0, rvMax: 2.0, pnMin: 3.5, pnMax: 5.5, hMin: 6, hMax: 10, pa2Min: 2.0, pa2Max: 3.0 },
    ] as const)[sIdx];
    const iA = randInt(rng, cfg.iaMin, cfg.iaMax) * 0.25;
    const pA = randFloat(rng, cfg.paMin, cfg.paMax, 1);
    const iB = randInt(rng, cfg.ibMin, cfg.ibMax) * 0.25;
    const pB = randFloat(rng, cfg.pbMin, cfg.pbMax, 1);
    const iC = randInt(rng, cfg.icMin, cfg.icMax) * 0.25;
    const pC = randFloat(rng, cfg.pcMin, cfg.pcMax, 1);
    const reelVise = randFloat(rng, cfg.rvMin, cfg.rvMax, 1);
    const piNext = randFloat(rng, cfg.pnMin, cfg.pnMax, 1);
    const hausse = randInt(rng, cfg.hMin, cfg.hMax) * 25; // resserrement en pb
    const pA2 = randFloat(rng, cfg.pa2Min, cfg.pa2Max, 1);
    const reelA = r2(tauxReelFisher(iA, pA));
    const reelAApp = r2(tauxReelApproche(iA, pA));
    const reelB = r2(tauxReelFisher(iB, pB));
    const reelC = r2(tauxReelFisher(iC, pC));
    const reelCApp = r2(tauxReelApproche(iC, pC));
    const nominalRequis = r2(tauxNominalRequis(reelVise, piNext));
    const iA2 = r2(iA + hausse / 100);
    const reelA2 = r2(tauxReelFisher(iA2, pA2));

    const { en, f, pct } = outils(langue);
    const nomA = en ? ['zone A (the United States)', 'zone A (the United States)', 'zone A (the disciplined economy)'][sIdx] : ['la zone A (les États-Unis)', 'la zone A (les États-Unis)', 'la zone A (l\'économie disciplinée)'][sIdx];
    const nomB = en ? ['zone B (the euro area)', 'zone B (an economy under financial repression)', 'zone B (the laggard central bank)'][sIdx] : ['la zone B (la zone euro)', 'la zone B (une économie en répression financière)', 'la zone B (la banque centrale en retard)'][sIdx];
    const nomC = en ? ['zone C (a hawkish emerging market)', 'zone C (an orthodox emerging market)', 'zone C (the early hiker)'][sIdx] : ['la zone C (un grand émergent orthodoxe)', 'la zone C (un émergent orthodoxe)', 'la zone C (la banque qui a monté tôt)'][sIdx];
    const desc = en
      ? `${nomA}: policy rate ${pct(iA, 2)}, inflation ${pct(pA, 1)} — ${nomB}: ${pct(iB, 2)} against ${pct(pB, 1)} — ${nomC}: ${pct(iC, 2)} against ${pct(pC, 1)}`
      : `${nomA} : taux directeur ${pct(iA, 2)}, inflation ${pct(pA, 1)} — ${nomB} : ${pct(iB, 2)} contre ${pct(pB, 1)} — ${nomC} : ${pct(iC, 2)} contre ${pct(pC, 1)}`;
    const contexte = (en
      ? [
        `Allocation committee, and the CIO wants one sieve for three zones — the only rate that decides where capital goes: ${desc}. The worksheet: the three real rates by exact Fisher, the ranking, the nominal rate zone B would need to stop taxing its savers — and what happens to the asset-class reading when zone A's tightening finally turns its real rate positive.`,
        `"Inflation is at records, why does gold not rally?" The strategist's answer is one equation applied three times: ${desc}. The note: three real rates, the ranking that gold actually watches, the nominal that would end the repression in zone B — and the real-rate flip in zone A that settles the question in the title.`,
        `Oral exam: "three economies, six numbers — rank them, and tell me where the carry goes, what gold does, who suffers in growth stocks": ${desc}. The examiner wants exact Fisher, not the head-count approximation — and the two follow-ups: the nominal required for a real target in zone B, and zone A's real rate after its cycle ends.`,
      ]
      : [
        `Comité d'allocation, et le CIO veut un seul tamis pour trois zones — le seul taux qui décide où va le capital : ${desc}. La feuille de calcul : les trois taux réels par Fisher exact, le classement, le nominal qu'il faudrait à la zone B pour cesser de taxer ses épargnants — et ce que devient la lecture des classes d'actifs quand le resserrement de la zone A fait enfin repasser son réel en positif.`,
        `« L'inflation est au record, pourquoi l'or ne monte-t-il pas ? » La réponse du stratégiste est une équation appliquée trois fois : ${desc}. La note : trois taux réels, le classement que l'or regarde vraiment, le nominal qui mettrait fin à la répression en zone B — et la bascule du réel en zone A qui tranche la question du titre.`,
        `Oral : « trois économies, six chiffres — classez-les, et dites-moi où va le carry, ce que fait l'or, qui souffre dans les valeurs de croissance » : ${desc}. L'examinateur veut Fisher exact, pas l'approximation de tête — et les deux suites : le nominal requis pour un réel visé en zone B, et le réel de la zone A une fois son cycle terminé.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? `a) ${nomA}: the real rate, exactly` : `a) ${nomA} : le taux réel, exactement`,
          enonce: en
            ? `Nominal ${pct(iA, 2)}, inflation ${pct(pA, 1)}. Real rate by exact Fisher, in %?`
            : `Nominal ${pct(iA, 2)}, inflation ${pct(pA, 1)}. Taux réel par Fisher exact, en % ?`,
          reponse: reelA, tolerance: 0.03, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'r = (1 + i)/(1 + π) − 1, and the approximation flatters' : 'r = (1 + i)/(1 + π) − 1, et l\'approximation flatte',
            contenu: en
              ? `$r = \\frac{1 + i}{1 + \\pi} - 1$ = ${f(1 + iA / 100, 4)}/${f(1 + pA / 100, 3)} − 1 = **${pct(reelA, 2)}**. The head-count i − π says ${pct(reelAApp, 2)}: the approximation drops the cross term i·π and ALWAYS overstates the real rate, the more so as levels rise — the interview reflex: give the approximation, then flag the gap and its sign. ${reelA < 0 ? `Despite the hikes, the real rate is still negative: the stance remains accommodative — the mid-2022 configuration.` : `The real rate is positive: the tightening actually bites.`}`
              : `$r = \\frac{1 + i}{1 + \\pi} - 1$ = ${f(1 + iA / 100, 4)}/${f(1 + pA / 100, 3)} − 1 = **${pct(reelA, 2)}**. L'arithmétique de tête i − π dit ${pct(reelAApp, 2)} : l'approximation néglige le terme croisé i·π et SURESTIME toujours le réel, d'autant plus que les niveaux montent — le réflexe d'entretien : donner l'approximation, puis signaler l'écart et son signe. ${reelA < 0 ? `Malgré les hausses, le réel reste négatif : la politique demeure accommodante — la configuration de la mi-2022.` : `Le réel est positif : le resserrement mord vraiment.`}`,
          }],
          pieges: [en
            ? `Stopping at i − π = ${pct(reelAApp, 2)}: at these levels the cross term is worth ${f(r2(Math.abs(reelAApp - reelA) * 100), 0)} bp — exactly the kind of gap that separates two candidates at an oral.`
            : `S'arrêter à i − π = ${pct(reelAApp, 2)} : à ces niveaux, le terme croisé vaut ${f(r2(Math.abs(reelAApp - reelA) * 100), 0)} pb — exactement le genre d'écart qui sépare deux candidats à l'oral.`],
        },
        {
          intitule: en ? `b) ${nomB}: the silent tax` : `b) ${nomB} : la taxe silencieuse`,
          enonce: en
            ? `Nominal ${pct(iB, 2)}, inflation ${pct(pB, 1)}. Real rate, in % — and read the sign.`
            : `Nominal ${pct(iB, 2)}, inflation ${pct(pB, 1)}. Taux réel, en % — et lisez le signe.`,
          reponse: reelB, tolerance: 0.03, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'A negative real rate has a name: financial repression' : 'Un réel négatif a un nom : la répression financière',
            contenu: en
              ? `$r$ = ${f(1 + iB / 100, 4)}/${f(1 + pB / 100, 3)} − 1 = **${pct(reelB, 2)}**. The saver PAYS to lend, in purchasing power: this regime is called financial repression — the inflation tax of chapter 4, levied on cash, poorly-paid savings accounts and fixed-rate claims, cashed in by fixed-rate debtors with the State at the front of the queue. And remember the summer-2022 benchmark: 2.5% nominal against 8% inflation was a real rate of −5.09% — four hikes in, the policy was still massively accommodative.`
              : `$r$ = ${f(1 + iB / 100, 4)}/${f(1 + pB / 100, 3)} − 1 = **${pct(reelB, 2)}**. L'épargnant PAIE pour prêter, en pouvoir d'achat : ce régime s'appelle la répression financière — la taxe d'inflation du chapitre 4, prélevée sur le cash, les livrets mal rémunérés et les créances à taux fixe, encaissée par les débiteurs à taux fixe, l'État en tête de file. Et gardez l'étalon de l'été 2022 : 2,5 % de nominal contre 8 % d'inflation faisaient un réel de −5,09 % — quatre hausses plus tard, la politique restait massivement accommodante.`,
          }],
          pieges: [en
            ? `Reading ${pct(iB, 2)} of nominal as "already restrictive": under ${pct(pB, 1)} inflation it is a deeply negative real rate — nominal rigour, real accommodation.`
            : `Lire ${pct(iB, 2)} de nominal comme « déjà restrictif » : sous ${pct(pB, 1)} d'inflation, c'est un réel profondément négatif — rigueur nominale, accommodation réelle.`],
        },
        {
          intitule: en ? `c) ${nomC}: the ranking, and where capital goes` : `c) ${nomC} : le classement, et où va le capital`,
          enonce: en
            ? `Nominal ${pct(iC, 2)}, inflation ${pct(pC, 1)}. Real rate, in %? (The corrigé ranks the three zones and reads the asset classes.)`
            : `Nominal ${pct(iC, 2)}, inflation ${pct(pC, 1)}. Taux réel, en % ? (Le corrigé classe les trois zones et lit les classes d'actifs.)`,
          reponse: reelC, tolerance: 0.03, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'The ranking that the currency market reads every morning' : 'Le classement que le marché des changes lit chaque matin',
              contenu: en
                ? `$r$ = ${f(1 + iC / 100, 4)}/${f(1 + pC / 100, 3)} − 1 = **${pct(reelC, 2)}** (the approximation would say ${pct(reelCApp, 2)} — ${f(r2(Math.abs(reelCApp - reelC) * 100), 0)} bp of flattery at these levels). Ranking: C (${pct(reelC, 2)}) > A (${pct(reelA, 2)}) > B (${pct(reelB, 2)}). Capital flows toward the real rate that pays: C is the classic carry destination (module 6 — differentials drive flows), B funds it, and B's currency lives under pressure as long as the repression lasts.`
                : `$r$ = ${f(1 + iC / 100, 4)}/${f(1 + pC / 100, 3)} − 1 = **${pct(reelC, 2)}** (l'approximation dirait ${pct(reelCApp, 2)} — ${f(r2(Math.abs(reelCApp - reelC) * 100), 0)} pb de flatterie à ces niveaux). Classement : C (${pct(reelC, 2)}) > A (${pct(reelA, 2)}) > B (${pct(reelB, 2)}). Le capital coule vers le réel qui paie : C est la destination de carry classique (module 6 — les différentiels pilotent les flux), B le finance, et la devise de B vit sous pression tant que la répression dure.`,
            },
          ],
          pieges: [en
            ? `Ranking on NOMINAL rates: the order can differ — a big nominal under bigger inflation pays less, in real terms, than a modest nominal under tamed inflation. The sieve is Fisher, always.`
            : `Classer sur les taux NOMINAUX : l'ordre peut différer — un gros nominal sous une inflation plus grosse paie moins, en réel, qu'un nominal modeste sous une inflation matée. Le tamis, c'est Fisher, toujours.`],
        },
        {
          intitule: en ? `d) Ending the repression: the nominal zone B needs` : `d) Sortir de la répression : le nominal qu'il faut à la zone B`,
          enonce: en
            ? `Zone B expects ${pct(piNext, 1)} inflation next year and wants a real rate of +${pct(reelVise, 1)}. What nominal policy rate does that require (inverse Fisher), in %?`
            : `La zone B attend ${pct(piNext, 1)} d'inflation l'an prochain et vise un réel de +${pct(reelVise, 1)}. Quel taux nominal cela exige-t-il (Fisher inversé), en % ?`,
          reponse: nominalRequis, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'i = (1 + r)(1 + π) − 1: the size of the catch-up' : 'i = (1 + r)(1 + π) − 1 : la taille du rattrapage',
            contenu: en
              ? `$i = (1 + r)(1 + \\pi) - 1$ = ${f(1 + reelVise / 100, 3)} × ${f(1 + piNext / 100, 3)} − 1 = **${pct(nominalRequis, 2)}** — a hiking path of ${f(r2((nominalRequis - iB) * 100), 0)} bp from today's ${pct(iB, 2)}. For scale, the 2022-2023 cycles delivered +450 bp (ECB, fourteen months) and +525 bp (Fed, sixteen months) — the most violent since Volcker. Limit case to recite: merely STOPPING the repression (real of zero) already requires a nominal equal to expected inflation, ${pct(piNext, 1)}.`
              : `$i = (1 + r)(1 + \\pi) - 1$ = ${f(1 + reelVise / 100, 3)} × ${f(1 + piNext / 100, 3)} − 1 = **${pct(nominalRequis, 2)}** — un sentier de hausses de ${f(r2((nominalRequis - iB) * 100), 0)} pb depuis les ${pct(iB, 2)} d'aujourd'hui. Échelle : les cycles 2022-2023 ont délivré +450 pb (BCE, quatorze mois) et +525 pb (Fed, seize mois) — les plus violents depuis Volcker. Cas limite à réciter : simplement CESSER la répression (réel nul) exige déjà un nominal égal à l'inflation anticipée, ${pct(piNext, 1)}.`,
          }],
          pieges: [en
            ? `Adding r + π = ${pct(r2(reelVise + piNext), 1)}: systematically short of the true requirement — the real target must itself be protected from inflation (the cross term, as everywhere in this module).`
            : `Additionner r + π = ${pct(r2(reelVise + piNext), 1)} : systématiquement court du vrai requis — la cible réelle doit elle-même être protégée de l'inflation (le terme croisé, comme partout dans ce module).`],
        },
        {
          intitule: en ? `e) The flip: zone A after +${f(hausse, 0)} bp and disinflation` : `e) La bascule : la zone A après +${f(hausse, 0)} pb et la désinflation`,
          enonce: en
            ? `Zone A finishes its cycle: +${f(hausse, 0)} bp on the nominal (to ${pct(iA2, 2)}) while inflation recedes to ${pct(pA2, 1)}. New real rate, in %? (The corrigé reads gold, growth and value.)`
            : `La zone A termine son cycle : +${f(hausse, 0)} pb sur le nominal (à ${pct(iA2, 2)}) pendant que l'inflation reflue à ${pct(pA2, 1)}. Nouveau taux réel, en % ? (Le corrigé lit l'or, la croissance et la value.)`,
          reponse: reelA2, tolerance: 0.03, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'Both floors of the fraction moved in the same direction' : 'Les deux étages de la fraction ont bougé dans le même sens',
              contenu: en
                ? `$r$ = ${f(1 + iA2 / 100, 4)}/${f(1 + pA2 / 100, 3)} − 1 = **${pct(reelA2, 2)}**, against ${pct(reelA, 2)} before: the real rate swung by ${f(r2(reelA2 - reelA), 2)} points — the nominal rose AND inflation fell, both pushing the same way. This double move is the true violence of a late tightening cycle: the nominal tells a fraction of the story.`
                : `$r$ = ${f(1 + iA2 / 100, 4)}/${f(1 + pA2 / 100, 3)} − 1 = **${pct(reelA2, 2)}**, contre ${pct(reelA, 2)} avant : le réel a basculé de ${f(r2(reelA2 - reelA), 2)} points — le nominal a monté ET l'inflation a reflué, les deux poussant dans le même sens. Ce double mouvement est la vraie violence d'une fin de cycle de resserrement : le nominal ne raconte qu'une fraction de l'histoire.`,
            },
            {
              titre: en ? 'The chapter-7 reading: gold, growth, value' : 'La lecture du ch7 : or, croissance, value',
              contenu: en
                ? `Gold has zero cash flows: its opportunity cost is ENTIRELY the real rate forgone. At ${pct(reelA, 2)} it cost nothing to hold — it shone; at ${pct(reelA2, 2)} every year of holding gives up real yield — 2022 in one line: inflation at 8-9%, gold flat, because the US 10-year real went from about −1% to +1.5%. Inflation proposed, the real rate disposed. Equities read through the same denominator: growth stocks are long-duration assets (Gordon: r from 8% to 9% costs 33% with g = 6%, only 14% with g = 2%) — rising real rates reprice the DISTANCE of promises, hence the growth/value rotation and the Nasdaq's lost third of 2022.`
                : `L'or n'a aucun flux : son coût d'opportunité est TOUT ENTIER le taux réel auquel on renonce. À ${pct(reelA, 2)}, le détenir ne coûtait rien — il brillait ; à ${pct(reelA2, 2)}, chaque année de détention abandonne du rendement réel — 2022 en une ligne : inflation à 8-9 %, or à plat, parce que le réel 10 ans américain est passé d'environ −1 % à +1,5 %. L'inflation proposait, le réel a disposé. Les actions se lisent par le même dénominateur : les valeurs de croissance sont des actifs à duration longue (Gordon : r de 8 % à 9 % coûte 33 % avec g = 6 %, seulement 14 % avec g = 2 %) — un réel qui monte reprice la DISTANCE des promesses, d'où la rotation growth/value et le tiers perdu du Nasdaq en 2022.`,
            },
          ],
          pieges: [en
            ? `"Record inflation, buy gold" reads the wrong variable: gold watches the REAL rate, not inflation — high inflation with even higher nominal rates is a gold BEAR case, as 2022 demonstrated.`
            : `« Inflation record, achetez de l'or » lit la mauvaise variable : l'or regarde le taux RÉEL, pas l'inflation — une inflation forte sous des nominaux encore plus hauts est un cas BAISSIER pour l'or, 2022 l'a démontré.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* Export du lot 1 — fusionné dans problems.ts par le contrôleur.      */
/* ------------------------------------------------------------------ */
export const problemesLot1: ProblemeMoule[] = [
  premierComite,            // m10-pb-01 · N1
  salaireInflation,         // m10-pb-02 · N1
  lireChiffreInflation,     // m10-pb-03 · N1
  mensualiteCanalTaux,      // m10-pb-04 · N1
  deskFaceAuCpi,            // m10-pb-05 · N2
  pricerLesReunions,        // m10-pb-06 · N2
  qeEnPratique,             // m10-pb-07 · N2
  tauxReelsClassesActifs,   // m10-pb-08 · N2
];
