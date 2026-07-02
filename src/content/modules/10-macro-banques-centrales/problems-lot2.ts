/**
 * Moules de problèmes multi-étapes du module Macro & banques centrales —
 * LOT 2 : les 6 boss N4 (m10-pb-09 à m10-pb-14), alignés sur les chapitres
 * 5 et 7 relus : Volcker octobre 1979, le taper tantrum de mai 2013, les gilts
 * et le LDI de septembre 2022, SVB mars 2023, le trade de la décennie (2022),
 * et la conférence de presse (surprise vs crédibilité).
 * Chaque moule : 3 scénarios FR + EN, sous-questions chaînées (la sortie de a)
 * nourrit b), c)…), corrigés calculés via calculs.ts (m10) — jamais de texte figé.
 * INVARIANT BILINGUE : tous les tirages aléatoires ont lieu AVANT toute branche
 * de langue — même seed + même scénario ⇒ mêmes nombres en français et en anglais.
 * FAITS HISTORIQUES : exactement ceux des chapitres relus (ch2, ch4, ch5, ch6,
 * ch7), ordres de grandeur prudents (« de l'ordre de ») sourcés dans les
 * corrigés — fed funds ~20 % en 1980-81, 10 ans US vers 16 % en septembre 1981,
 * inflation ~13 % (1980) → ~4 % fin 1982, chômage 10,8 % ; 10 ans US 1,6 % → 3 %
 * mai-septembre 2013, Fragile Five ; 30 ans gilt +130 pb en trois séances,
 * BoE 13 jours ouvrés, Truss 44 jours ; SVB : HTM ~90 Md$, pertes latentes
 * ~15 Md$ ≈ fonds propres, 42 Md$ de retraits le 9 mars ; 2022 : Fed 0,25 % →
 * Taylor ~12 %, 60/40 autour de −17 %.
 * Conventions (en-tête de calculs.ts) : taux, inflations et gaps en %, durées
 * en années, composition DISCRÈTE annuelle (1 + x)^n — jamais d'actualisation
 * continue ; pas de politique monétaire en POINTS DE BASE (100 pb = 1 %) ;
 * variationPrixObligationDuration reçoit des pb et rend du %.
 */
import { formatNombreLangue } from '../../../engine/answers';
import { mulberry32, pick, randFloat, randInt } from '../../../engine/rng';
import type { Langue, ProblemGenerator } from '../../../engine/types';
import {
  ratioSacrifice, regleDeTaylor, tauxNominalRequis, tauxReelFisher,
  tauxTerminalAnticipe, variationPrixObligationDuration,
} from './calculs';

/** Un « moule » de problème est un ProblemGenerator de l'engine (alias local). */
export type ProblemeMoule = ProblemGenerator;

const M10 = '10-macro-banques-centrales';
const r0 = (v: number) => Math.round(v);
const r1 = (v: number) => Math.round(v * 10) / 10;
const r2 = (v: number) => Math.round(v * 100) / 100;

/** Petits formateurs liés à la langue (les tirages sont déjà faits quand on les crée). */
function outils(langue: Langue) {
  const en = langue === 'en';
  const f = (v: number, d = 2) => formatNombreLangue(langue, v, d);
  const pct = (v: number, d = 2) => (en ? `${f(v, d)}%` : `${f(v, d)} %`);
  const pb = (v: number, d = 0) => (en ? `${f(v, d)} bp` : `${f(v, d)} pb`);
  // Montant en devise. Le dollar est échappé (\$) : règle du mini-parser markdown,
  // un $ nu ouvrirait un segment KaTeX.
  const mnt = (v: number, sym: string, d = 2) => {
    const s = sym === '$' ? '\\$' : sym;
    return en ? `${s}${f(v, d)}` : `${f(v, d)} ${s}`;
  };
  return { en, f, pct, pb, mnt };
}

/* ------------------------------------------------------------------ */
/* 9. m10-pb-09 — Volcker, octobre 1979 — BOSS N4                      */
/* ------------------------------------------------------------------ */
const volckerOctobre79: ProblemeMoule = {
  id: 'm10-pb-09', moduleId: M10,
  titre: 'Volcker, octobre 1979 : la crédibilité achetée comptant',
  titreEn: 'Volcker, October 1979: credibility bought in cash',
  typeDeCas: 'désinflation et crédibilité',
  typeDeCasEn: 'disinflation and credibility',
  difficulte: 4,
  scenarios: ['Le conseiller du nouveau président de la Fed, veille du 6 octobre', 'L\'audition au Congrès, tracteurs garés devant le bâtiment', 'Grand oral : l\'autopsie de la désinflation Volcker'],
  scenariosEn: ['The new Fed chairman\'s adviser, on the eve of October 6', 'The congressional hearing, tractors parked outside the building', 'Final viva: the autopsy of the Volcker disinflation'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const piC = randFloat(rng, 12.5, 13.5, 1);
    const gap = randFloat(rng, -3, -1, 1);
    const iActuel = randFloat(rng, 10.5, 11.5, 1);
    const reelVise = randFloat(rng, 1.5, 2.5, 1);
    const desinf = randFloat(rng, 9.5, 10.5, 1);
    const cumGap = randInt(rng, 13, 18);
    const y0 = randFloat(rng, 9, 10, 1);
    const y1 = randFloat(rng, 15.5, 16, 1);
    const dur = randFloat(rng, 5.5, 6.5, 1);
    const piFin = randFloat(rng, 3.5, 4.5, 1);

    const taylor = regleDeTaylor(2, piC, 2, gap);
    const reel = tauxReelFisher(iActuel, piC);
    const iRequis = tauxNominalRequis(reelVise, piC);
    const ratio = ratioSacrifice(desinf, -cumGap);
    const deltaPb = (y1 - y0) * 100;
    const perte = variationPrixObligationDuration(dur, deltaPb);
    const reelPorteur = tauxReelFisher(y1, piFin);
    const repTaylor = r1(taylor);
    const repReel = r2(reel);
    const repRequis = r2(iRequis);
    const repRatio = r2(ratio);
    const repPerte = r1(perte);
    const repPorteur = r2(reelPorteur);

    const { en, f, pct, pb } = outils(langue);
    const desc = en
      ? `US inflation is running at ${pct(piC, 1)} — the third wave in a decade, expectations de-anchored, everyone asking for wage rises because everyone expects price rises; the fed funds rate stands at ${pct(iActuel, 1)}, the output gap is estimated around ${pct(gap, 1)}, the neutral real rate around 2% and the (implicit) target at 2%; the 10-year Treasury yields ${pct(y0, 1)} (modified duration about ${f(dur, 1)})`
      : `l'inflation américaine court à ${pct(piC, 1)} — troisième vague en une décennie, anticipations désancrées, chacun demande des hausses de salaires parce que chacun attend des hausses de prix ; les fed funds sont à ${pct(iActuel, 1)}, l'écart de production est estimé vers ${pct(gap, 1)}, le taux neutre réel vers 2 % et la cible (implicite) à 2 % ; le 10 ans Treasury rend ${pct(y0, 1)} (duration modifiée d'environ ${f(dur, 1)})`;
    const contexte = (en
      ? [
        `Friday, October 5, 1979. Paul Volcker, appointed in August, locks the door of his office and asks you — his adviser — for one page of numbers before tomorrow night's extraordinary announcement: the Fed will stop steering the rate and start targeting the money supply, which translates as "rates will go where they must". The situation: ${desc}.\n\nYour page must say five things, in order: what a Taylor-type rule prescribes against this inflation (the rule will only be written in 1993, but the arithmetic is timeless); what the CURRENT policy really is once Fisher deflates it — the number that justifies everything; what nominal rate a genuinely restrictive stance requires; what the disinflation will cost in output — the sacrifice ratio the Congress will throw at you; and what the bond market's disbelief will do to whoever holds the 10-year. The last line of the page is for 1982: the reward for whoever believes.`,
        `Washington, 1981. Farmers have driven their tractors up to the Fed's headquarters and parked them there; mortgage rates have crossed 18%; the chairman testifies before Congress this morning and you carry his briefing book. The data the committee will fire at him: ${desc} — and the fed funds pushed to the order of 20% in 1980 and again in 1981.\n\nThe defence holds in numbers, not adjectives: the rule-based prescription that says the brutality was arithmetic, not madness; the real rate the previous policy concealed (negative — a stimulus dressed as rigour); the nominal rate an actually restrictive policy demands; the sacrifice ratio — because the committee will count the recessions (1980, then 1981-82, unemployment peaking at 10.8%) —; the bond holder's loss while the market still refuses to believe; and the real yield locked in by whoever finally does. Chapter 4 calls this buying back credibility; your job is to price it.`,
        `The examiner writes one date on the board — "October 6, 1979" — and one sentence: "Show me why Volcker was arithmetic, not folly." The data: ${desc}.\n\nHe expects the full chain of chapters 2, 4 and 7: the Taylor prescription against ${pct(piC, 1)} inflation; the negative real rate that made double-digit nominal rates ACCOMMODATIVE; Fisher inverted to find the truly restrictive nominal; the sacrifice ratio of the two recessions; the 10-year's climb to about 16% in September 1981 read as a premium of disbelief, priced through duration; and the closing figure — the real yield captured at the top by whoever trusted the disinflation, seed of four decades of falling rates. The lesson to land: credibility is the central bank's asset; Volcker paid cash, his successors spent the interest for forty years.`,
      ]
      : [
        `Vendredi 5 octobre 1979. Paul Volcker, nommé en août, ferme la porte de son bureau et vous demande — à vous, son conseiller — une page de chiffres avant l'annonce extraordinaire de demain soir : la Fed cessera de piloter le taux pour cibler la masse monétaire, ce qui se traduit par « les taux iront où ils devront aller ». La situation : ${desc}.\n\nVotre page doit dire cinq choses, dans l'ordre : ce qu'une règle à la Taylor prescrit contre cette inflation (la règle ne sera écrite qu'en 1993, mais l'arithmétique est intemporelle) ; ce que la politique ACTUELLE est vraiment une fois que Fisher l'a déflatée — le nombre qui justifie tout ; quel taux nominal exigerait une politique réellement restrictive ; ce que la désinflation coûtera en production — le ratio de sacrifice que le Congrès lui jettera au visage ; et ce que l'incrédulité du marché obligataire fera à qui porte le 10 ans. La dernière ligne de la page est pour 1982 : la récompense de qui croira.`,
        `Washington, 1981. Des agriculteurs ont conduit leurs tracteurs jusqu'au siège de la Fed et les y ont garés ; les taux hypothécaires ont dépassé 18 % ; le président témoigne devant le Congrès ce matin et vous portez son dossier. Les données que la commission lui enverra : ${desc} — et les fed funds poussés de l'ordre de 20 % en 1980, puis de nouveau en 1981.\n\nLa défense tient en nombres, pas en adjectifs : la prescription de règle qui dit que la brutalité était de l'arithmétique, pas de la folie ; le taux réel que la politique précédente cachait (négatif — une relance déguisée en rigueur) ; le nominal qu'exige une politique réellement restrictive ; le ratio de sacrifice — car la commission comptera les récessions (1980, puis 1981-82, chômage culminant à 10,8 %) — ; la perte du porteur obligataire tant que le marché refuse de croire ; et le rendement réel verrouillé par qui finit par croire. Le chapitre 4 appelle cela racheter la crédibilité ; votre travail est de la pricer.`,
        `L'examinateur écrit une date au tableau — « 6 octobre 1979 » — et une phrase : « Montrez-moi que Volcker, c'était de l'arithmétique, pas de la folie. » Les données : ${desc}.\n\nIl attend la chaîne complète des chapitres 2, 4 et 7 : la prescription de Taylor contre ${pct(piC, 1)} d'inflation ; le réel négatif qui rendait ACCOMMODANTS des nominaux à deux chiffres ; Fisher inversé pour trouver le nominal réellement restrictif ; le ratio de sacrifice des deux récessions ; la montée du 10 ans vers 16 % en septembre 1981 lue comme une prime d'incrédulité, pricée par la duration ; et le chiffre de clôture — le réel capturé au sommet par qui a cru à la désinflation, germe de quatre décennies de baisse des taux. La leçon à faire atterrir : la crédibilité est l'actif de la banque centrale ; Volcker l'a payée comptant, ses successeurs en ont dépensé les intérêts pendant quarante ans.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) What the rule prescribes' : 'a) Ce que la règle prescrit',
          enonce: en
            ? `Neutral real rate 2%, inflation ${pct(piC, 1)}, target 2%, output gap ${pct(gap, 1)}, coefficients 0.5. What policy rate does the Taylor rule prescribe, in %?`
            : `Taux neutre réel 2 %, inflation ${pct(piC, 1)}, cible 2 %, écart de production ${pct(gap, 1)}, coefficients 0,5. Quel taux directeur la règle de Taylor prescrit-elle, en % ?`,
          reponse: repTaylor, tolerance: 0.1, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The brutality was the prescription' : 'La brutalité était la prescription',
            contenu: en
              ? `i = 2 + ${f(piC, 1)} + 0.5 × (${f(piC, 1)} − 2) + 0.5 × (${f(gap, 1)}) = **${pct(repTaylor, 1)}**. Volcker pushed the fed funds to the order of 20% in 1980-81: within half a point of what the rule — written fourteen years later — would have prescribed. Chapter 2's experiment, replayed at the source: the historical brutality was not madness, it was arithmetic. Everything below measures the gap between this number and the policy actually in place.`
              : `i = 2 + ${f(piC, 1)} + 0,5 × (${f(piC, 1)} − 2) + 0,5 × (${f(gap, 1)}) = **${pct(repTaylor, 1)}**. Volcker a poussé les fed funds de l'ordre de 20 % en 1980-81 : à un demi-point près, ce que la règle — écrite quatorze ans plus tard — aurait prescrit. L'expérience du chapitre 2, rejouée à la source : la brutalité historique n'était pas une folie, c'était de l'arithmétique. Tout ce qui suit mesure l'écart entre ce nombre et la politique réellement en place.`,
          }],
          pieges: [en
            ? `Forgetting the "+ π" term (the rule sets a NOMINAL rate: r* + π is the neutral nominal, the zero of policy) understates the prescription by ${f(piC, 1)} points — the classic error at high inflation.`
            : `Oublier le terme « + π » (la règle fixe un taux NOMINAL : r* + π est le nominal neutre, le zéro de la politique) sous-estime la prescription de ${f(piC, 1)} points — l'erreur classique à haute inflation.`],
        },
        {
          intitule: en ? 'b) What the current policy really is' : 'b) Ce que la politique actuelle est vraiment',
          enonce: en
            ? `The fed funds stand at ${pct(iActuel, 1)} against ${pct(piC, 1)} inflation. Using exact Fisher, what is the current REAL policy rate, in %?`
            : `Les fed funds sont à ${pct(iActuel, 1)} contre ${pct(piC, 1)} d'inflation. Par Fisher exact, quel est le taux directeur RÉEL courant, en % ?`,
          reponse: repReel, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'A stimulus dressed as rigour' : 'Une relance déguisée en rigueur',
            contenu: en
              ? `r = (1 + ${f(iActuel, 1)}%)/(1 + ${f(piC, 1)}%) − 1 = **${pct(repReel, 2)}**. A double-digit nominal rate, and the policy is NEGATIVE in real terms: borrowers are being paid to borrow, savers taxed for saving — financial repression, chapter 4. This is the number that justifies October 6: ten years of rates that looked high and were actually accommodative is exactly how expectations de-anchor. Restrictive or not is never read on the nominal.`
              : `r = (1 + ${f(iActuel, 1)} %)/(1 + ${f(piC, 1)} %) − 1 = **${pct(repReel, 2)}**. Un nominal à deux chiffres, et la politique est NÉGATIVE en termes réels : on paie les emprunteurs pour emprunter, on taxe les épargnants d'épargner — la répression financière du chapitre 4. C'est le nombre qui justifie le 6 octobre : dix ans de taux qui avaient l'air hauts et étaient en réalité accommodants, voilà exactement comment des anticipations désancrent. Restrictif ou pas ne se lit jamais sur le nominal.`,
          }],
          pieges: [en
            ? `The head approximation i − π = ${f(r2(iActuel - piC), 2)}% overstates the real rate (it drops the cross term i·π) — at these levels the gap is a few tenths, and the interview reflex is: give the approximation, THEN flag the bias and its sign.`
            : `L'approximation de tête i − π = ${f(r2(iActuel - piC), 2)} % surestime le réel (elle néglige le terme croisé i·π) — à ces niveaux l'écart fait quelques dixièmes, et le réflexe d'entretien est : donner l'approximation, PUIS signaler le biais et son signe.`],
        },
        {
          intitule: en ? 'c) The truly restrictive nominal' : 'c) Le nominal réellement restrictif',
          enonce: en
            ? `To hold a real rate of ${pct(reelVise, 1)} under ${pct(piC, 1)} inflation, what nominal policy rate is required (exact Fisher, inverted), in %?`
            : `Pour tenir un taux réel de ${pct(reelVise, 1)} sous ${pct(piC, 1)} d'inflation, quel taux nominal faut-il (Fisher exact, inversé), en % ?`,
          reponse: repRequis, tolerance: 0.1, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Fisher, driven in reverse' : 'Fisher, conduit à l\'envers',
            contenu: en
              ? `i = (1 + ${f(reelVise, 1)}%) × (1 + ${f(piC, 1)}%) − 1 = **${pct(repRequis, 2)}** — that is ${pb(r0((iRequis - iActuel) * 100))} above the current ${pct(iActuel, 1)}. The whole meaning of "the rates will go where they must" is in that gap: from ${pct(iActuel, 1)}, merely reaching NEUTRAL requires a nominal equal to inflation compounded with r*, and biting requires more. Mortgage rates above 18% and fed funds near 20% were not an accident of the new operating procedure; they were this line of arithmetic.`
              : `i = (1 + ${f(reelVise, 1)} %) × (1 + ${f(piC, 1)} %) − 1 = **${pct(repRequis, 2)}** — soit ${pb(r0((iRequis - iActuel) * 100))} au-dessus des ${pct(iActuel, 1)} courants. Tout le sens de « les taux iront où ils devront aller » tient dans cet écart : depuis ${pct(iActuel, 1)}, atteindre seulement le NEUTRE exige un nominal égal à l'inflation composée avec r*, et mordre exige davantage. Des hypothécaires au-dessus de 18 % et des fed funds vers 20 % n'étaient pas un accident de la nouvelle procédure opérationnelle ; ils étaient cette ligne d'arithmétique.`,
          }],
          pieges: [en
            ? `Adding r + π = ${f(r1(reelVise + piC), 1)}% forgets the cross term: composition works both ways, and at 13% inflation the shortcut misses the target by about ${pb(r0((iRequis - reelVise - piC) * 100))}.`
            : `Additionner r + π = ${f(r1(reelVise + piC), 1)} % oublie le terme croisé : la composition joue dans les deux sens, et à 13 % d'inflation le raccourci manque la cible d'environ ${pb(r0((iRequis - reelVise - piC) * 100))}.`],
        },
        {
          intitule: en ? 'd) The bill: the sacrifice ratio' : 'd) La facture : le ratio de sacrifice',
          enonce: en
            ? `The disinflation removes ${f(desinf, 1)} points of inflation (from about 13% in 1980 to about 4% by late 1982) at the cost of cumulative output gaps of −${f(cumGap, 0)} points of GDP across the two recessions. What is the sacrifice ratio?`
            : `La désinflation retire ${f(desinf, 1)} points d'inflation (d'environ 13 % en 1980 à environ 4 % fin 1982) au prix d'écarts de production cumulés de −${f(cumGap, 0)} points de PIB sur les deux récessions. Quel est le ratio de sacrifice ?`,
          reponse: repRatio, tolerance: 0.05, toleranceMode: 'absolu', unite: en ? 'pt of GDP / pt' : 'pt de PIB / pt',
          etapes: [{
            titre: en ? 'The price of lost credibility' : 'Le prix de la crédibilité perdue',
            contenu: en
              ? `Ratio = |−${f(cumGap, 0)}| / ${f(desinf, 1)} = **${f(repRatio, 2)} points of output per point of disinflation**. Two recessions back to back (1980, then the severe 1981-82), unemployment peaking at 10.8% — that is what the ratio looks like in the street. Chapter 4's key sentence: the ratio is not a constant of nature, it is the price of disinflation FOR A GIVEN STOCK OF CREDIBILITY. Ten years of broken promises had destroyed the Fed's word: conviction was no longer for sale, only force remained. Compare 2021-23: anchored expectations, near-zero ratio — the sacrifice was prepaid by forty years of targets held.`
              : `Ratio = |−${f(cumGap, 0)}| / ${f(desinf, 1)} = **${f(repRatio, 2)} point de production par point de désinflation**. Deux récessions enchaînées (1980, puis la sévère 1981-82), chômage culminant à 10,8 % — voilà à quoi ressemble le ratio dans la rue. La phrase clé du chapitre 4 : le ratio n'est pas une constante de la nature, c'est le prix de la désinflation POUR UN STOCK DE CRÉDIBILITÉ DONNÉ. Dix ans de promesses non tenues avaient détruit la parole de la Fed : la conviction n'était plus à vendre, il ne restait que la force. Comparez 2021-23 : anticipations ancrées, ratio quasi nul — le sacrifice avait été payé d'avance, par quarante ans de cible tenue.`,
          }],
        },
        {
          intitule: en ? 'e) The disbelief premium, priced' : 'e) La prime d\'incrédulité, pricée',
          enonce: en
            ? `The bond market takes time to believe: the 10-year climbs from ${pct(y0, 1)} to ${pct(y1, 1)} by September 1981. On a modified duration of ${f(dur, 1)}, what price change does the duration approximation give the holder, in %?`
            : `Le marché obligataire met du temps à croire : le 10 ans monte de ${pct(y0, 1)} à ${pct(y1, 1)} en septembre 1981. Sur une duration modifiée de ${f(dur, 1)}, quelle variation de prix l'approximation par la duration donne-t-elle au porteur, en % ?`,
          reponse: repPerte, tolerance: Math.max(1, Math.abs(repPerte) * 0.03), toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Bonds price a disinflation they do not believe' : 'Les obligations pricent une désinflation à laquelle elles ne croient pas',
            contenu: en
              ? `ΔP/P ≈ −D × Δy = −${f(dur, 1)} × ${f(r2(deltaPb / 100), 2)} = **${pct(repPerte, 1)}**. The 10-year at ${pct(y1, 1)} is a premium of disbelief: two years into the fight, the market still demands 16% for ten years — it is pricing an inflation Volcker has already condemned. Caveat for a jury: on ${pb(r0(deltaPb))} the linear approximation overstates the loss (convexity, module 4) and the huge coupons cushion the carnage — read it as an order of magnitude, which is exactly how chapter 7 uses it.`
              : `ΔP/P ≈ −D × Δy = −${f(dur, 1)} × ${f(r2(deltaPb / 100), 2)} = **${pct(repPerte, 1)}**. Le 10 ans à ${pct(y1, 1)} est une prime d'incrédulité : deux ans après le début du combat, le marché exige encore 16 % sur dix ans — il price une inflation que Volcker a déjà condamnée. Réserve pour un jury : sur ${pb(r0(deltaPb))}, l'approximation linéaire surestime la perte (convexité, module 4) et les coupons énormes amortissent le carnage — lisez un ordre de grandeur, exactement l'usage qu'en fait le chapitre 7.`,
          }],
          pieges: [en
            ? `Feeding Δy in percent instead of converting the ${pb(r0(deltaPb))} properly (−D × Δy with Δy = ${f(r2(deltaPb / 100), 2)}, not ${f(r0(deltaPb), 0)}) multiplies the loss by a hundred: basis points are the committee's language, percent is the formula's.`
            : `Passer Δy en pourcent sans convertir correctement les ${pb(r0(deltaPb))} (−D × Δy avec Δy = ${f(r2(deltaPb / 100), 2)}, pas ${f(r0(deltaPb), 0)}) multiplie la perte par cent : le point de base est la langue des comités, le pourcent celle de la formule.`],
        },
        {
          intitule: en ? 'f) 1982: the reward for believing' : 'f) 1982 : la récompense de qui croit',
          enonce: en
            ? `An investor buys the 10-year at ${pct(y1, 1)} at the top. Inflation settles around ${pct(piFin, 1)} by late 1982. What real yield (exact Fisher) has he locked in, in %?`
            : `Un investisseur achète le 10 ans à ${pct(y1, 1)} au sommet. L'inflation s'installe vers ${pct(piFin, 1)} fin 1982. Quel rendement réel (Fisher exact) a-t-il verrouillé, en % ?`,
          reponse: repPorteur, tolerance: 0.1, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'The disbelief premium becomes the windfall' : 'La prime d\'incrédulité devient l\'aubaine',
              contenu: en
                ? `r = (1 + ${f(y1, 1)}%)/(1 + ${f(piFin, 1)}%) − 1 = **${pct(repPorteur, 2)}** real, per year, for ten years — the bond trade of the century, offered precisely to those who believed the disinflation before the market did. Once credibility was established, the 10-year began four decades of decline: every buyer of the disbelief premium was repaid twice, by the coupon and by the capital gain.`
                : `r = (1 + ${f(y1, 1)} %)/(1 + ${f(piFin, 1)} %) − 1 = **${pct(repPorteur, 2)}** réels, par an, pendant dix ans — le trade obligataire du siècle, offert précisément à ceux qui ont cru à la désinflation avant le marché. La crédibilité établie, le 10 ans a entamé quatre décennies de baisse : chaque acheteur de la prime d'incrédulité a été payé deux fois, par le coupon et par la plus-value.`,
            },
            {
              titre: en ? 'The sentence that closes the file' : 'La phrase qui referme le dossier',
              contenu: en
                ? `Credibility is the central bank's asset — ruinously expensive to buy back once lost. Volcker paid cash: ${f(repRatio, 2)} points of output per point of disinflation, tractors at the door, 10.8% unemployment. His successors spent the interest for forty years, steering inflation with communiqués where he had needed 20% rates. The 2021-23 "immaculate disinflation" is not a refutation of Volcker: it is his dividend.`
                : `La crédibilité est l'actif de la banque centrale — hors de prix à racheter une fois perdue. Volcker a payé comptant : ${f(repRatio, 2)} point de production par point de désinflation, des tracteurs à la porte, 10,8 % de chômage. Ses successeurs en ont dépensé les intérêts pendant quarante ans, pilotant l'inflation à coups de communiqués là où il avait eu besoin de 20 % de taux. La « désinflation immaculée » de 2021-23 n'est pas une réfutation de Volcker : c'est son dividende.`,
            },
          ],
          pieges: [en
            ? `Computing the real yield against the ${pct(piC, 1)} inflation of 1979-80 instead of the ${pct(piFin, 1)} that materialises misses the whole point: the buyer locks a NOMINAL 16% — his real return depends on the inflation that actually comes, and betting on which is exactly what "believing the central bank" means.`
            : `Calculer le réel contre les ${pct(piC, 1)} d'inflation de 1979-80 au lieu des ${pct(piFin, 1)} qui se matérialisent manque tout le propos : l'acheteur verrouille un NOMINAL de 16 % — son réel dépend de l'inflation qui vient réellement, et parier dessus est exactement ce que « croire la banque centrale » veut dire.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 10. m10-pb-10 — Le taper tantrum, mai 2013 — BOSS N4                */
/* ------------------------------------------------------------------ */
const taperTantrum: ProblemeMoule = {
  id: 'm10-pb-10', moduleId: M10,
  titre: 'Mai 2013 : le taper tantrum, ou le prix d\'une phrase',
  titreEn: 'May 2013: the taper tantrum, or the price of one sentence',
  typeDeCas: 'communication et anticipations',
  typeDeCasEn: 'communication and expectations',
  difficulte: 4,
  scenarios: ['Le gérant obligataire émergents, au matin du 23 mai', 'Le comité d\'investissement qui veut tout vendre', 'Grand oral : rien n\'avait changé, tout avait changé'],
  scenariosEn: ['The emerging-markets bond manager, on the morning of May 23', 'The investment committee that wants to sell everything', 'Final viva: nothing had changed, everything had changed'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const y0 = 1.6;
    const y1 = randFloat(rng, 2.9, 3.1, 1);
    const dUs = randFloat(rng, 7.5, 8.5, 1);
    const dEm = randFloat(rng, 5, 6, 1);
    const spreadEm = randInt(rng, 80, 120);
    const devise = randFloat(rng, 10, 15, 1);
    const nHausses = randInt(rng, 4, 6);
    const yEnd = randFloat(rng, 2.5, 2.7, 1);

    const deltaPb = (y1 - y0) * 100;
    const perteUs = variationPrixObligationDuration(dUs, deltaPb);
    const deltaEmPb = deltaPb + spreadEm;
    const perteEm = variationPrixObligationDuration(dEm, deltaEmPb);
    const perteTotEm = ((1 + perteEm / 100) * (1 - devise / 100) - 1) * 100;
    const terminal = tauxTerminalAnticipe(0.25, nHausses, 25);
    const rebond = variationPrixObligationDuration(dUs, (yEnd - y1) * 100);
    const repDelta = r0(deltaPb);
    const repUs = r1(perteUs);
    const repEm = r1(perteEm);
    const repTot = r1(perteTotEm);
    const repTerm = r2(terminal);
    const repRebond = r1(rebond);

    const { en, f, pct, pb } = outils(langue);
    const desc = en
      ? `on May 22, 2013, before Congress, Ben Bernanke cautiously mentions the possibility of REDUCING the pace of the Fed's asset purchases (\\$85 billion a month) at coming meetings — no rate hike, no sale, no date; by early September the US 10-year has moved from about ${pct(y0, 1)} to ${pct(y1, 1)}; your US Treasury book has a modified duration of ${f(dUs, 1)}; your local-currency emerging book has a duration of ${f(dEm, 1)}, its yields rise ${pb(spreadEm)} MORE than US yields, and the currencies of the deficit countries drop about ${pct(devise, 1)} against the dollar; before the speech, the futures priced an unchanged 0.25% policy rate as far as the eye could see — after it, they price ${f(nHausses, 0)} hikes of 25 bp over the horizon`
      : `le 22 mai 2013, devant le Congrès, Ben Bernanke évoque prudemment la possibilité de RÉDUIRE le rythme des achats d'actifs de la Fed (85 Md\\$ par mois) lors des prochaines réunions — ni hausse de taux, ni vente, ni date ; début septembre, le 10 ans américain est passé d'environ ${pct(y0, 1)} à ${pct(y1, 1)} ; votre book de Treasuries a une duration modifiée de ${f(dUs, 1)} ; votre book émergent en devise locale a une duration de ${f(dEm, 1)}, ses taux montent de ${pb(spreadEm)} de PLUS que les taux américains, et les devises des pays déficitaires perdent environ ${pct(devise, 1)} contre le dollar ; avant le discours, les futures pricaient un taux directeur inchangé à 0,25 % à perte de vue — après, ils pricent ${f(nHausses, 0)} hausses de 25 pb sur l'horizon`;
    const contexte = (en
      ? [
        `Thursday, May 23, 2013, 7 a.m. Your screens are a sea of red that no economic release explains: no bad CPI, no central-bank decision, nothing — one sentence in a congressional hearing, and the entire yield curve is repricing. You run an emerging-markets bond fund built on three years of cheap dollars flowing south in search of yield: ${desc}.\n\nBefore the morning call, rebuild the shock in numbers: the move in basis points, what it does to the Treasury book through duration, what it does to the emerging book where rates AND the currency give way together — the Fragile Five (Brazil, India, Indonesia, Turkey, South Africa) are precisely the deficit countries your inflows were financing. Then the two numbers that make the lesson: the repriced path of the policy rate (the Fed has DONE nothing — the anticipation died, that is all), and what happened in December when the actual taper began and the market did not blink.`,
        `June 2013, the investment committee. The chairman slides the performance sheet across the table and says one word: "explain." Then a second: "sell?" The fund's positions: ${desc}.\n\nYour defence must separate what happened from what people think happened. Nothing changed in the fundamentals — not one dollar less has been purchased, the policy rate has not moved, the deficits of the Fragile Five are the same as in April. Everything changed in the anticipations: walk the committee through the basis points, the duration arithmetic on both books, the currency leg that turns a bond drawdown into an emerging rout, and the futures curve that went from "zero forever" to ${f(nHausses, 0)} hikes. End with the December fact — the taper itself, absorbed without a tremor because it was priced — and let the committee draw the conclusion about selling at the bottom.`,
        `The examiner reads a single sentence aloud — Bernanke's, May 22, 1013 words of caution about "moderating the pace of purchases" — and asks: "The Fed did nothing for seven more months. Explain to me why this sentence cost bond markets ten points and shook five currencies." The data: ${desc}.\n\nHe expects chapter 7's chain, quantified: the ${pb(r0((y1 - y0) * 100))} on the 10-year in four months; the duration loss on Treasuries; the double punishment of local emerging debt (rates plus currency, and the composition trap in adding them); the repriced rate path that shows WHERE the shock really lived; and the counterfactual of December 2013 — the taper begins, nothing happens, because this time it is in the prices. The closing sentence he wants: when a central bank steers expectations, every word is an instrument, and a miscalibrated word is a 130-basis-point shock.`,
      ]
      : [
        `Jeudi 23 mai 2013, 7 h. Vos écrans sont une mer de rouge qu'aucune publication n'explique : pas de mauvais CPI, pas de décision de banque centrale, rien — une phrase dans une audition au Congrès, et toute la courbe des taux se re-price. Vous gérez un fonds obligataire émergent construit sur trois ans de dollars bon marché partis chercher du rendement au sud : ${desc}.\n\nAvant le morning call, reconstruisez le choc en nombres : le mouvement en points de base, ce qu'il fait au book de Treasuries par la duration, ce qu'il fait au book émergent où les taux ET la devise cèdent ensemble — les Fragile Five (Brésil, Inde, Indonésie, Turquie, Afrique du Sud) sont précisément les pays déficitaires que vos flux finançaient. Puis les deux nombres qui font la leçon : le sentier de taux repricé (la Fed n'a RIEN fait — une anticipation est morte, c'est tout), et ce qui s'est passé en décembre quand le taper effectif a commencé et que le marché n'a pas cillé.`,
        `Juin 2013, le comité d'investissement. Le président fait glisser la feuille de performance sur la table et dit un mot : « expliquez. » Puis un second : « on vend ? » Les positions du fonds : ${desc}.\n\nVotre défense doit séparer ce qui s'est passé de ce que les gens croient qu'il s'est passé. Rien n'a changé dans les fondamentaux — pas un dollar d'achats en moins, le taux directeur n'a pas bougé, les déficits des Fragile Five sont les mêmes qu'en avril. Tout a changé dans les anticipations : déroulez pour le comité les points de base, l'arithmétique de duration sur les deux books, la jambe devise qui transforme un drawdown obligataire en déroute émergente, et la courbe des futures passée de « zéro pour toujours » à ${f(nHausses, 0)} hausses. Finissez par le fait de décembre — le taper lui-même, absorbé sans un frémissement parce qu'il était dans les prix — et laissez le comité tirer la conclusion sur vendre au plus bas.`,
        `L'examinateur lit une seule phrase à voix haute — celle de Bernanke, le 22 mai, toute en précautions sur « modérer le rythme des achats » — et demande : « La Fed n'a rien fait pendant encore sept mois. Expliquez-moi pourquoi cette phrase a coûté dix points aux marchés obligataires et secoué cinq devises. » Les données : ${desc}.\n\nIl attend la chaîne du chapitre 7, quantifiée : les ${pb(r0((y1 - y0) * 100))} sur le 10 ans en quatre mois ; la perte de duration sur les Treasuries ; la double peine de la dette émergente locale (taux plus devise, et le piège de composition quand on les additionne) ; le sentier de taux repricé qui montre OÙ le choc vivait vraiment ; et le contrefactuel de décembre 2013 — le taper commence, il ne se passe rien, parce que cette fois c'est dans les prix. La phrase de clôture qu'il veut : quand une banque centrale pilote les anticipations, chaque mot est un instrument, et un mot mal calibré est un choc de 130 points de base.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The shock, in the committee\'s language' : 'a) Le choc, dans la langue des comités',
          enonce: en
            ? `The 10-year moves from ${pct(y0, 1)} to ${pct(y1, 1)} between early May and early September. How big is the move, in basis points?`
            : `Le 10 ans passe de ${pct(y0, 1)} à ${pct(y1, 1)} entre début mai et début septembre. Quelle est l'ampleur du mouvement, en points de base ?`,
          reponse: repDelta, tolerance: 2, toleranceMode: 'absolu', unite: 'pb',
          etapes: [{
            titre: en ? 'Four months, one sentence' : 'Quatre mois, une phrase',
            contenu: en
              ? `Δy = ${f(y1, 1)}% − ${f(y0, 1)}% = ${pct(r2(y1 - y0), 2)} = **${pb(repDelta)}** in four months — for a sentence. No hike, no sale of a single bond, not even a date: the purchases continued at \\$85 billion a month throughout. Chapter 7's classification matters here: this is a SHOCK, not an orderly tightening — a rise the prices did not contain. What counts is never the level of rates; it is the gap between the path realised and the path already priced.`
              : `Δy = ${f(y1, 1)} % − ${f(y0, 1)} % = ${pct(r2(y1 - y0), 2)} = **${pb(repDelta)}** en quatre mois — pour une phrase. Pas de hausse, pas une obligation vendue, pas même une date : les achats ont continué à 85 Md\\$ par mois pendant tout l'épisode. La classification du chapitre 7 compte ici : c'est un CHOC, pas un resserrement ordonné — une hausse que les prix ne contenaient pas. Ce qui compte n'est jamais le niveau des taux ; c'est l'écart entre le chemin réalisé et le chemin déjà pricé.`,
          }],
        },
        {
          intitule: en ? 'b) The Treasury book through duration' : 'b) Le book de Treasuries par la duration',
          enonce: en
            ? `On the Treasury book (modified duration ${f(dUs, 1)}), what price change does the duration approximation give for those ${pb(repDelta)}, in %?`
            : `Sur le book de Treasuries (duration modifiée ${f(dUs, 1)}), quelle variation de prix l'approximation par la duration donne-t-elle pour ces ${pb(repDelta)}, en % ?`,
          reponse: repUs, tolerance: Math.max(0.3, Math.abs(repUs) * 0.03), toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The most mechanical channel there is' : 'Le canal le plus mécanique qui soit',
            contenu: en
              ? `ΔP/P ≈ −D × Δy = −${f(dUs, 1)} × ${f(r2(deltaPb / 100), 2)} = **${pct(repUs, 1)}**. Around ten points lost on the "risk-free" asset, in four months, without one dollar of policy actually changing — chapter 7's order of magnitude (duration 8, about −10% for the tantrum). "Risk-free" qualifies default, never price: the sentence to repeat until it bores you.`
              : `ΔP/P ≈ −D × Δy = −${f(dUs, 1)} × ${f(r2(deltaPb / 100), 2)} = **${pct(repUs, 1)}**. De l'ordre de dix points perdus sur l'actif « sans risque », en quatre mois, sans qu'un dollar de politique ait réellement changé — l'ordre de grandeur du chapitre 7 (duration 8, environ −10 % pour le tantrum). « Sans risque » qualifie le défaut, jamais le prix : la phrase à répéter jusqu'à l'ennui.`,
          }],
        },
        {
          intitule: en ? 'c) The emerging book: rates first' : 'c) Le book émergent : les taux d\'abord',
          enonce: en
            ? `Capital flees back to a dollar that pays again: local emerging yields rise ${pb(spreadEm)} MORE than US yields. On the local book (duration ${f(dEm, 1)}), what is the bond price change, in %?`
            : `Les capitaux refluent vers un dollar qui paie de nouveau : les taux locaux émergents montent de ${pb(spreadEm)} de PLUS que les taux américains. Sur le book local (duration ${f(dEm, 1)}), quelle est la variation de prix obligataire, en % ?`,
          reponse: repEm, tolerance: Math.max(0.3, Math.abs(repEm) * 0.03), toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The receiving end of the flow' : 'Le bout récepteur du flux',
            contenu: en
              ? `Total local move = ${pb(repDelta)} + ${pb(spreadEm)} = ${pb(r0(deltaEmPb))}; ΔP/P ≈ −${f(dEm, 1)} × ${f(r2(deltaEmPb / 100), 2)} = **${pct(repEm, 1)}**. The mechanism is chapter 7's transmission read in reverse: three years of QE had pushed yield-hungry capital toward the deficit countries; the day US rates pay again, the flow turns around — and the countries that were living off it (the Fragile Five: Brazil, India, Indonesia, Turkey, South Africa) see their bonds AND their currencies sold at once.`
              : `Mouvement local total = ${pb(repDelta)} + ${pb(spreadEm)} = ${pb(r0(deltaEmPb))} ; ΔP/P ≈ −${f(dEm, 1)} × ${f(r2(deltaEmPb / 100), 2)} = **${pct(repEm, 1)}**. Le mécanisme est la transmission du chapitre 7 lue à l'envers : trois ans de QE avaient poussé les capitaux affamés de rendement vers les pays déficitaires ; le jour où les taux américains paient de nouveau, le flux se retourne — et les pays qui en vivaient (les Fragile Five : Brésil, Inde, Indonésie, Turquie, Afrique du Sud) voient leurs obligations ET leurs devises vendues en même temps.`,
          }],
        },
        {
          intitule: en ? 'd) …then the currency: the double punishment' : 'd) …puis la devise : la double peine',
          enonce: en
            ? `On top of the ${pct(repEm, 1)} bond loss, the currencies drop ${pct(devise, 1)} against the dollar. What is the total loss in dollars on the local book (compounded, not added), in %?`
            : `Par-dessus la perte obligataire de ${pct(repEm, 1)}, les devises perdent ${pct(devise, 1)} contre le dollar. Quelle est la perte totale en dollars sur le book local (composée, pas additionnée), en % ?`,
          reponse: repTot, tolerance: Math.max(0.3, Math.abs(repTot) * 0.03), toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Two losses multiply, they do not add' : 'Deux pertes se multiplient, elles ne s\'additionnent pas',
            contenu: en
              ? `Total = (1 − ${f(r2(Math.abs(perteEm)), 2)}%) × (1 − ${f(devise, 1)}%) − 1 = **${pct(repTot, 1)}** in dollars. The currency loss applies to a bond position ALREADY marked down — composition, the same arithmetic as the price indices of chapter 4, played against the investor twice. This is what "the Fragile Five" meant on a P&L: a bond drawdown turned into an emerging rout by the exchange rate, for holders who thought they owned "local yield".`
              : `Total = (1 − ${f(r2(Math.abs(perteEm)), 2)} %) × (1 − ${f(devise, 1)} %) − 1 = **${pct(repTot, 1)}** en dollars. La perte de change s'applique à une position obligataire DÉJÀ dépréciée — la composition, la même arithmétique que les indices de prix du chapitre 4, jouée deux fois contre l'investisseur. Voilà ce que « les Fragile Five » voulait dire sur un P&L : un drawdown obligataire transformé en déroute émergente par le change, pour des porteurs qui croyaient détenir du « rendement local ».`,
          }],
          pieges: [en
            ? `Adding ${pct(repEm, 1)} + (−${pct(devise, 1)}) = ${pct(r1(perteEm - devise), 1)} overstates the loss: the two effects compound — the currency hit lands on capital already reduced. Small here, systematic everywhere: one never adds returns, one composes them.`
            : `Additionner ${pct(repEm, 1)} + (−${pct(devise, 1)}) = ${pct(r1(perteEm - devise), 1)} surestime la perte : les deux effets se composent — le coup de change tombe sur un capital déjà réduit. Petit ici, systématique partout : on n'additionne jamais des rendements, on les compose.`],
        },
        {
          intitule: en ? 'e) Where the shock actually lived' : 'e) Où le choc vivait vraiment',
          enonce: en
            ? `Before the speech, futures priced the policy rate unchanged at 0.25% as far as the eye could see; after it, they price ${f(nHausses, 0)} hikes of 25 bp over the horizon. What terminal rate does the new path imply, in %?`
            : `Avant le discours, les futures pricaient le taux directeur inchangé à 0,25 % à perte de vue ; après, ils pricent ${f(nHausses, 0)} hausses de 25 pb sur l'horizon. Quel taux terminal le nouveau sentier implique-t-il, en % ?`,
          reponse: repTerm, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The Fed did nothing; the anticipated Fed did everything' : 'La Fed n\'a rien fait ; la Fed anticipée a tout fait',
            contenu: en
              ? `Terminal = 0.25% + ${f(nHausses, 0)} × 25 bp = **${pct(repTerm, 2)}**. There is the shock's real address: not in the purchases (unchanged), not in the rate (unchanged until… 2015, as it turned out), but in the DISTRIBUTION of future rates in the market's head. A 10-year is an average of anticipated short rates plus a term premium (chapter 5): kill the "zero forever" anticipation and the whole curve jumps, no act required. The market did not react to a policy; it reacted to the death of an expectation.`
              : `Terminal = 0,25 % + ${f(nHausses, 0)} × 25 pb = **${pct(repTerm, 2)}**. Voilà la vraie adresse du choc : pas dans les achats (inchangés), pas dans le taux (inchangé jusqu'en… 2015, en fait), mais dans la DISTRIBUTION des taux futurs dans la tête du marché. Un 10 ans, c'est une moyenne de taux courts anticipés plus une prime de terme (chapitre 5) : tuez l'anticipation « zéro pour toujours » et toute la courbe saute, sans qu'aucun acte soit nécessaire. Le marché n'a pas réagi à une politique ; il a réagi à la mort d'une anticipation.`,
          }],
          pieges: [en
            ? `"The market panicked because the Fed withdrew liquidity" gets the facts wrong: purchases continued at full pace until December, and the first hike came in 2015. Nothing changed in the fundamentals; everything changed in the anticipations — that asymmetry IS the lesson.`
            : `« Le marché a paniqué parce que la Fed a retiré la liquidité » se trompe de faits : les achats ont continué à plein rythme jusqu'en décembre, et la première hausse n'est venue qu'en 2015. Rien n'avait changé dans les fondamentaux ; tout avait changé dans les anticipations — cette asymétrie EST la leçon.`],
        },
        {
          intitule: en ? 'f) December: the counterfactual that proves it' : 'f) Décembre : le contrefactuel qui le prouve',
          enonce: en
            ? `In December 2013 the actual taper begins — and the market absorbs it without a tremor; by mid-2014 the 10-year has even drifted back to ${pct(yEnd, 1)}. On the Treasury book (duration ${f(dUs, 1)}), what price change does that pull-back from ${pct(y1, 1)} imply, in %?`
            : `En décembre 2013, le taper effectif commence — et le marché l'absorbe sans un frémissement ; mi-2014, le 10 ans est même retombé à ${pct(yEnd, 1)}. Sur le book de Treasuries (duration ${f(dUs, 1)}), quelle variation de prix ce reflux depuis ${pct(y1, 1)} implique-t-il, en % ?`,
          reponse: repRebond, tolerance: Math.max(0.2, Math.abs(repRebond) * 0.05), toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'The act, absorbed; the word, fatal' : 'L\'acte, absorbé ; le mot, fatal',
              contenu: en
                ? `ΔP/P ≈ −${f(dUs, 1)} × (${f(r2(yEnd - y1), 2)}) = **${pct(repRebond, 1)}** — a gain. The irony completes the lesson: the REDUCTION itself, when it actually starts, moves nothing (it is in the prices since September), and yields drift back down. The tantrum was never caused by the policy conducted; it was caused by the communication — an anticipation brutally recalibrated. Whoever sold at the bottom in the committee's panic paid the whole shock and missed the repair.`
                : `ΔP/P ≈ −${f(dUs, 1)} × (${f(r2(yEnd - y1), 2)}) = **${pct(repRebond, 1)}** — un gain. L'ironie complète la leçon : la RÉDUCTION elle-même, quand elle commence réellement, ne bouge rien (elle est dans les prix depuis septembre), et les taux refluent. Le tantrum n'a jamais été causé par la politique menée ; il a été causé par la communication — une anticipation brutalement recalée. Qui a vendu au plus bas dans la panique du comité a payé tout le choc et raté la réparation.`,
            },
            {
              titre: en ? 'What the next exit learned' : 'Ce que la sortie suivante a appris',
              contenu: en
                ? `The 2021-2022 exit was telegraphed for months precisely because of May 2013: taper announced in advance, hikes trailed in the dot plots, each step priced before being taken. When a central bank pilots expectations, every word is an instrument, and a miscalibrated word is a ${pb(repDelta)} shock. Keep the symmetric case in mind for the press-conference boss: a surprise can also be a deliberate weapon — Jackson Hole 2022, eight minutes, whole curve repriced, on purpose.`
                : `La sortie de 2021-2022 a été télégraphiée des mois à l'avance précisément à cause de mai 2013 : taper annoncé d'avance, hausses préparées dans les dot plots, chaque pas pricé avant d'être fait. Quand une banque centrale pilote les anticipations, chaque mot est un instrument, et un mot mal calibré est un choc de ${pb(repDelta)}. Gardez le cas symétrique en tête pour le boss de la conférence de presse : une surprise peut aussi être une arme délibérée — Jackson Hole 2022, huit minutes, toute la courbe repricée, exprès.`,
            },
          ],
          pieges: [en
            ? `"December proves the market had overreacted" misses the mechanism: the market had not overreacted to the taper, it had CORRECTLY priced a new rate path — December moved nothing because the news was already in the curve, exactly like a consensus-matching CPI (chapter 6).`
            : `« Décembre prouve que le marché avait surréagi » manque le mécanisme : le marché n'avait pas surréagi au taper, il avait CORRECTEMENT pricé un nouveau sentier de taux — décembre n'a rien bougé parce que la nouvelle était déjà dans la courbe, exactement comme un CPI conforme au consensus (chapitre 6).`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 11. m10-pb-11 — Gilts et LDI, septembre 2022 — BOSS N4              */
/* ------------------------------------------------------------------ */
const giltsLdi: ProblemeMoule = {
  id: 'm10-pb-11', moduleId: M10,
  titre: 'Septembre 2022 : les gilts, le LDI et l\'appel de marge qui fait vendre',
  titreEn: 'September 2022: gilts, LDI and the margin call that forces sales',
  typeDeCas: 'liquidité et couverture',
  typeDeCasEn: 'liquidity and hedging',
  difficulte: 4,
  scenarios: ['Le directeur des risques du fonds de pension, lundi 26 septembre', 'La cellule de crise de la Banque d\'Angleterre', 'Grand oral : le hedge qui a failli tuer le couvert'],
  scenariosEn: ['The pension fund\'s chief risk officer, Monday September 26', 'The Bank of England\'s crisis unit', 'Final viva: the hedge that almost killed the hedged'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const y0 = 3.6;
    const y1 = randFloat(rng, 4.9, 5.1, 1);
    const passif = randInt(rng, 8, 12);
    const hedgeRatio = randInt(rng, 60, 80);
    const cash = randFloat(rng, 0.3, 0.6, 1);
    const yBack = randFloat(rng, 3.9, 4.2, 1);
    const dur = 20;

    const deltaPb = (y1 - y0) * 100;
    const chute = variationPrixObligationDuration(dur, deltaPb);
    const notionnel = (passif * hedgeRatio) / 100;
    const appel = (Math.abs(chute) / 100) * notionnel;
    const baissePassif = (Math.abs(chute) / 100) * passif;
    const netEco = baissePassif - appel;
    const deficit = appel - cash;
    const rebond = variationPrixObligationDuration(dur, (yBack - y1) * 100);
    const repDelta = r0(deltaPb);
    const repChute = r1(chute);
    const repAppel = r2(appel);
    const repNet = r2(netEco);
    const repDeficit = r2(deficit);
    const repRebond = r1(rebond);

    const { en, f, pct, pb } = outils(langue);
    const desc = en
      ? `on Friday September 23, 2022, the Truss government — in office for three weeks — unveils a "mini-budget": about £45 billion of unfunded tax cuts, no independent costing, in a country where inflation exceeds 10%; the 30-year gilt yield jumps from about ${pct(y0, 1)} to ${pct(y1, 1)} in three sessions; your fund carries £${f(passif, 0)}bn of long-dated pension liabilities (duration about 20), hedged through an LDI programme — receiver swaps and gilts on repo, with leverage — covering ${pct(hedgeRatio, 0)} of the liabilities, all duration 20; the daily margin calls on those hedges are collateralised in cash, of which the fund holds £${f(cash, 1)}bn readily available`
      : `le vendredi 23 septembre 2022, le gouvernement Truss — en poste depuis trois semaines — présente un « mini-budget » : environ 45 Md£ de baisses d'impôts non financées, sans chiffrage indépendant, dans un pays où l'inflation dépasse 10 % ; le rendement du gilt 30 ans saute d'environ ${pct(y0, 1)} à ${pct(y1, 1)} en trois séances ; votre fonds porte ${f(passif, 0)} Md£ d'engagements de retraite de long terme (duration environ 20), couverts par un programme LDI — swaps receveurs et gilts en repo, avec du levier — sur ${pct(hedgeRatio, 0)} des engagements, le tout en duration 20 ; les appels de marge quotidiens sur ces couvertures se règlent en cash, dont le fonds détient ${f(cash, 1)} Md£ immédiatement disponibles`;
    const contexte = (en
      ? [
        `Monday, September 26, 2022, 7:30 a.m., London. Your phone shows three missed calls from the LDI manager and one line in the subject of an email: "collateral — URGENT". The weekend has not calmed anything: ${desc}.\n\nYou are the chief risk officer, and this morning's paradox is the whole file: the rise in yields makes your fund RICHER — pension liabilities are a promise discounted at the long rate, and the promise just got cheaper. Yet the LDI manager is asking for cash you do not have. Walk the numbers in order: the move in basis points, what duration 20 does to it, the margin call on the hedge, the economic enrichment nobody can spend, the collateral gap that forces you to sell gilts into a falling market — and what the Bank of England's about-face changes. Module 7 taught you margin calls on futures; here they come for the "safe" side of the balance sheet.`,
        `Wednesday, September 28, 2022, Threadneedle Street. The Financial Policy Committee's screens show the 30-year gilt in free fall for a fifth session, and the calls from the LDI funds all say the same thing: no more eligible collateral by Friday. The Bank was about to start SELLING gilts under its QT programme; it is now discussing the exact opposite. On the table, the file of one representative fund: ${desc}.\n\nBefore the governor signs, the unit must put numbers on the spiral: the shock in basis points, the mark-to-market of a duration-20 hedge, the margin call, the paradox of a fund that is solvent — richer, even — and about to fail on liquidity, the forced sales feeding the very yields that trigger the next calls. Then design the intervention so that it does NOT look like financing the budget: temporary, bounded — thirteen business days, until October 14 — and calibrate what it must achieve on yields. The prime minister will resign on October 20, after 44 days.`,
        `The examiner draws a loop on the board — "yields up → margin calls → gilt sales → yields up" — and says: "September 2022. The funds were solvent. The hedge worked. Explain to me why the Bank of England had to intervene in the middle of its own tightening." The data: ${desc}.\n\nHe expects chapter 7's autopsy, in order: the ${pb(r0((y1 - y0) * 100))} in three sessions on the 30-year; the −D×Δy on duration 20 — a quarter of the value of the kingdom's safest asset —; the margin call in billions; the proof of solvency (liabilities fall MORE than the hedge loses); the collateral gap that turns an accounting gain into forced sales; and the intervention read as a lesson — explicitly temporary, thirteen business days, so the firefighter does not become a budget financier. The closing sentence: the accounting hedge created a liquidity risk; risk is MEASURED by duration, it MATERIALISES through liquidity.`,
      ]
      : [
        `Lundi 26 septembre 2022, 7 h 30, Londres. Votre téléphone affiche trois appels manqués du gérant LDI et une ligne en objet d'un mail : « collatéral — URGENT ». Le week-end n'a rien calmé : ${desc}.\n\nVous êtes le directeur des risques, et le paradoxe de ce matin est tout le dossier : la hausse des taux rend votre fonds PLUS RICHE — un engagement de retraite est une promesse actualisée au taux long, et la promesse vient de devenir moins chère. Pourtant le gérant LDI réclame du cash que vous n'avez pas. Déroulez les nombres dans l'ordre : le mouvement en points de base, ce que la duration 20 en fait, l'appel de marge sur la couverture, l'enrichissement économique que personne ne peut dépenser, le trou de collatéral qui vous force à vendre des gilts dans un marché qui baisse — et ce que la volte-face de la Banque d'Angleterre change. Le module 7 vous a appris les appels de marge sur futures ; les voici qui viennent pour le côté « sûr » du bilan.`,
        `Mercredi 28 septembre 2022, Threadneedle Street. Les écrans du comité de politique financière montrent le gilt 30 ans en chute libre pour une cinquième séance, et les appels des fonds LDI disent tous la même chose : plus de collatéral éligible d'ici vendredi. La Banque s'apprêtait à commencer à VENDRE des gilts au titre de son QT ; elle discute maintenant de l'exact inverse. Sur la table, le dossier d'un fonds représentatif : ${desc}.\n\nAvant que le gouverneur signe, la cellule doit chiffrer la spirale : le choc en points de base, le mark-to-market d'une couverture de duration 20, l'appel de marge, le paradoxe d'un fonds solvable — enrichi, même — au bord du défaut de liquidité, les ventes forcées qui nourrissent les taux mêmes qui déclenchent les appels suivants. Puis dessiner l'intervention pour qu'elle ne ressemble PAS à un financement du budget : temporaire, bornée — treize jours ouvrés, jusqu'au 14 octobre — et calibrer ce qu'elle doit obtenir sur les taux. La Première ministre démissionnera le 20 octobre, après 44 jours.`,
        `L'examinateur dessine une boucle au tableau — « taux en hausse → appels de marge → ventes de gilts → taux en hausse » — et dit : « Septembre 2022. Les fonds étaient solvables. La couverture fonctionnait. Expliquez-moi pourquoi la Banque d'Angleterre a dû intervenir au milieu de son propre resserrement. » Les données : ${desc}.\n\nIl attend l'autopsie du chapitre 7, dans l'ordre : les ${pb(r0((y1 - y0) * 100))} en trois séances sur le 30 ans ; le −D×Δy sur duration 20 — un quart de la valeur de l'actif le plus sûr du royaume — ; l'appel de marge en milliards ; la preuve de solvabilité (le passif baisse PLUS que la couverture ne perd) ; le trou de collatéral qui transforme un gain comptable en ventes forcées ; et l'intervention lue comme une leçon — explicitement temporaire, treize jours ouvrés, pour que le pompier ne devienne pas financeur du budget. La phrase de clôture : la couverture comptable a créé un risque de liquidité ; le risque de taux se MESURE par la duration, il se MATÉRIALISE par la liquidité.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) Three sessions, in basis points' : 'a) Trois séances, en points de base',
          enonce: en
            ? `The 30-year gilt moves from ${pct(y0, 1)} to ${pct(y1, 1)} in three sessions. How big is the shock, in basis points?`
            : `Le gilt 30 ans passe de ${pct(y0, 1)} à ${pct(y1, 1)} en trois séances. Quelle est l'ampleur du choc, en points de base ?`,
          reponse: repDelta, tolerance: 2, toleranceMode: 'absolu', unite: 'pb',
          etapes: [{
            titre: en ? 'A budget, not a central bank' : 'Un budget, pas une banque centrale',
            contenu: en
              ? `Δy = ${f(y1, 1)}% − ${f(y0, 1)}% = **${pb(repDelta)}** in three sessions — on the longest, most rate-sensitive point of the safest market in the kingdom. Note the trigger: not a central-bank decision but a BUDGET — £45bn of unfunded cuts, no independent costing, 10%+ inflation. The pound simultaneously hits its historic low against the dollar. Chapter 7's trigger taxonomy: a sentence in 2013, a budget in 2022, a loss announcement in 2023 — always an anticipation recalibrated at once.`
              : `Δy = ${f(y1, 1)} % − ${f(y0, 1)} % = **${pb(repDelta)}** en trois séances — sur le point le plus long, le plus sensible aux taux, du marché le plus sûr du royaume. Notez le déclencheur : pas une décision de banque centrale mais un BUDGET — 45 Md£ de baisses non financées, sans chiffrage indépendant, sous 10 % d'inflation. La livre touche au même moment son plus bas historique contre le dollar. La taxonomie des déclencheurs du chapitre 7 : une phrase en 2013, un budget en 2022, un communiqué de perte en 2023 — toujours une anticipation recalée d'un coup.`,
          }],
        },
        {
          intitule: en ? 'b) Duration 20 does the rest' : 'b) La duration 20 fait le reste',
          enonce: en
            ? `On a modified duration of 20, what price change does the duration approximation give for those ${pb(repDelta)}, in %?`
            : `Sur une duration modifiée de 20, quelle variation de prix l'approximation par la duration donne-t-elle pour ces ${pb(repDelta)}, en % ?`,
          reponse: repChute, tolerance: Math.max(0.5, Math.abs(repChute) * 0.03), toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'A quarter of a "risk-free" asset, in three days' : 'Un quart d\'un actif « sans risque », en trois jours',
            contenu: en
              ? `ΔP/P ≈ −20 × ${f(r2(deltaPb / 100), 2)} = **${pct(repChute, 1)}**. That is chapter 7's number: on duration 20, +130 bp costs about −26% — a quarter of the value of a 30-year gilt, in three sessions. Duration is a lever: the same shock on a 2-year barely dents it. Pension funds live at the long end BY CONSTRUCTION — their liabilities are decades away — which is why this corner of the market is where the accident happened.`
              : `ΔP/P ≈ −20 × ${f(r2(deltaPb / 100), 2)} = **${pct(repChute, 1)}**. C'est le chiffre du chapitre 7 : sur une duration 20, +130 pb coûtent environ −26 % — un quart de la valeur d'un gilt 30 ans, en trois séances. La duration est un levier : le même choc sur un 2 ans le raye à peine. Les fonds de pension vivent sur la partie longue PAR CONSTRUCTION — leurs engagements sont à des décennies — et c'est pourquoi l'accident est arrivé dans ce coin-là du marché.`,
          }],
        },
        {
          intitule: en ? 'c) The margin call on the hedge' : 'c) L\'appel de marge sur la couverture',
          enonce: en
            ? `The LDI hedge covers ${pct(hedgeRatio, 0)} of the £${f(passif, 0)}bn of liabilities, at duration 20. Its mark-to-market moves like the gilt. What margin call, in £bn, do the three sessions generate?`
            : `La couverture LDI porte sur ${pct(hedgeRatio, 0)} des ${f(passif, 0)} Md£ d'engagements, en duration 20. Son mark-to-market bouge comme le gilt. Quel appel de marge, en Md£, les trois séances génèrent-elles ?`,
          reponse: repAppel, tolerance: Math.max(0.05, repAppel * 0.03), toleranceMode: 'absolu', unite: 'Md£',
          etapes: [{
            titre: en ? 'Module 7 knocks on the door' : 'Le module 7 frappe à la porte',
            contenu: en
              ? `Hedged notional = ${pct(hedgeRatio, 0)} × ${f(passif, 0)} = £${f(r2(notionnel), 2)}bn; call = ${pct(r1(Math.abs(chute)), 1)} × ${f(r2(notionnel), 2)} = **£${f(repAppel, 2)}bn** of cash collateral, demanded within days. A receiver swap gains when rates fall and LOSES when they rise — that is its job: it mirrors the liabilities. But a swap is marked to market daily and margined daily (module 7): the hedge is economically right and cash-flow brutal. The fund insured its solvency and mortgaged its liquidity.`
              : `Notionnel couvert = ${pct(hedgeRatio, 0)} × ${f(passif, 0)} = ${f(r2(notionnel), 2)} Md£ ; appel = ${pct(r1(Math.abs(chute)), 1)} × ${f(r2(notionnel), 2)} = **${f(repAppel, 2)} Md£** de collatéral cash, exigés en quelques jours. Un swap receveur gagne quand les taux baissent et PERD quand ils montent — c'est son travail : il réplique le passif. Mais un swap est valorisé au marché chaque jour et margé chaque jour (module 7) : la couverture est économiquement juste et brutale en trésorerie. Le fonds a assuré sa solvabilité et hypothéqué sa liquidité.`,
          }],
        },
        {
          intitule: en ? 'd) The paradox: the fund got richer' : 'd) Le paradoxe : le fonds s\'est enrichi',
          enonce: en
            ? `The same rate rise cuts the present value of the FULL £${f(passif, 0)}bn of liabilities by ${pct(r1(Math.abs(chute)), 1)}, while the hedge only loses on its ${pct(hedgeRatio, 0)} notional. By how much, in £bn, does the fund's net economic position IMPROVE?`
            : `La même hausse de taux réduit de ${pct(r1(Math.abs(chute)), 1)} la valeur actuelle des ${f(passif, 0)} Md£ d'engagements ENTIERS, quand la couverture ne perd que sur son notionnel de ${pct(hedgeRatio, 0)}. De combien, en Md£, la position économique nette du fonds s'AMÉLIORE-t-elle ?`,
          reponse: repNet, tolerance: Math.max(0.05, repNet * 0.05), toleranceMode: 'absolu', unite: 'Md£',
          etapes: [{
            titre: en ? 'Solvent — richer, even' : 'Solvable — enrichi, même',
            contenu: en
              ? `Liabilities fall by ${pct(r1(Math.abs(chute)), 1)} × ${f(passif, 0)} = £${f(r2(baissePassif), 2)}bn; the hedge loses £${f(repAppel, 2)}bn; net improvement = ${f(r2(baissePassif), 2)} − ${f(repAppel, 2)} = **£${f(repNet, 2)}bn** (the ${f(r0(100 - hedgeRatio), 0)}% of liabilities left unhedged deflates for free). This is the sentence the whole episode hangs on: economically, the rate rise HELPS the fund. It will nearly die anyway — because the gain sits in a discounted liability nobody will pay today, while the loss is a cash call due tomorrow morning. Solvency and liquidity are different clocks.`
              : `Le passif baisse de ${pct(r1(Math.abs(chute)), 1)} × ${f(passif, 0)} = ${f(r2(baissePassif), 2)} Md£ ; la couverture perd ${f(repAppel, 2)} Md£ ; amélioration nette = ${f(r2(baissePassif), 2)} − ${f(repAppel, 2)} = **${f(repNet, 2)} Md£** (les ${f(r0(100 - hedgeRatio), 0)} % d'engagements non couverts se dégonflent gratuitement). C'est la phrase à laquelle tout l'épisode est suspendu : économiquement, la hausse des taux ARRANGE le fonds. Il va pourtant presque mourir — parce que le gain loge dans un passif actualisé que personne ne paiera aujourd'hui, quand la perte est un appel de cash exigible demain matin. Solvabilité et liquidité n'ont pas la même horloge.`,
          }],
          pieges: [en
            ? `"The funds were losing money, hence the crisis" inverts the balance sheet: pension liabilities are a DEBT whose present value falls when yields rise — the crisis was a cash-flow problem on a hedge, not a solvency hole.`
            : `« Les fonds perdaient de l'argent, d'où la crise » inverse le bilan : les engagements de retraite sont une DETTE dont la valeur actuelle baisse quand les taux montent — la crise fut un problème de trésorerie sur une couverture, pas un trou de solvabilité.`],
        },
        {
          intitule: en ? 'e) The collateral gap that forces the sales' : 'e) Le trou de collatéral qui force les ventes',
          enonce: en
            ? `The fund holds £${f(cash, 1)}bn of readily available cash against the £${f(repAppel, 2)}bn call. How much, in £bn, must it raise by selling assets — in practice its most liquid ones, gilts — within days?`
            : `Le fonds détient ${f(cash, 1)} Md£ de cash immédiatement disponible face à l'appel de ${f(repAppel, 2)} Md£. Combien, en Md£, doit-il lever en vendant des actifs — en pratique ses plus liquides, des gilts — en quelques jours ?`,
          reponse: repDeficit, tolerance: Math.max(0.05, repDeficit * 0.03), toleranceMode: 'absolu', unite: 'Md£',
          etapes: [
            {
              titre: en ? 'The spiral, mechanised' : 'La spirale, mécanisée',
              contenu: en
                ? `Gap = ${f(repAppel, 2)} − ${f(cash, 1)} = **£${f(repDeficit, 2)}bn** of gilts to sell into a market already falling. Now multiply by a whole industry: every LDI fund in the country carries the same hedge, the same duration, the same call, the same week. Their sales push yields higher, higher yields mark the swaps further down, further marks call more margin, more margin forces more sales — the forced-sales spiral, on the market reputed the safest in the kingdom. When a whole sector sells the same asset at the same time, the price stops informing and starts amplifying.`
                : `Trou = ${f(repAppel, 2)} − ${f(cash, 1)} = **${f(repDeficit, 2)} Md£** de gilts à vendre dans un marché qui baisse déjà. Multipliez maintenant par toute une industrie : chaque fonds LDI du pays porte la même couverture, la même duration, le même appel, la même semaine. Leurs ventes poussent les taux plus haut, des taux plus hauts dégradent le mark-to-market des swaps, la dégradation appelle plus de marge, plus de marge force plus de ventes — la spirale de ventes forcées, sur le marché réputé le plus sûr du royaume. Quand tout un secteur vend le même actif au même moment, le prix cesse d'informer, il amplifie.`,
            },
            {
              titre: en ? 'Where the risk had hidden' : 'Où le risque s\'était caché',
              contenu: en
                ? `The risk was not in the gilts, nor in the liabilities: it was in the LEVERAGE and the daily margining of the hedge itself. Chapter 7's transversal lesson, word for word: the accident never breaks out where the risk is visible, but where it is carried with leverage and margin calls — the margin turns a paper loss into a forced sale, and the forced sale of some is the shock of others.`
                : `Le risque n'était ni dans les gilts, ni dans les engagements : il était dans le LEVIER et la marge quotidienne de la couverture elle-même. La leçon transversale du chapitre 7, mot pour mot : l'accident n'éclate jamais là où le risque est visible, mais là où il est porté avec du levier et des appels de marge — la marge transforme une moins-value latente en vente forcée, et la vente forcée des uns est le choc des autres.`,
            },
          ],
        },
        {
          intitule: en ? 'f) The fire brigade, strictly bounded' : 'f) Les pompiers, strictement bornés',
          enonce: en
            ? `On September 28 the Bank of England — which was about to SELL gilts under QT — announces temporary emergency purchases: thirteen business days, until October 14. The 30-year falls back from ${pct(y1, 1)} to ${pct(yBack, 1)}. On duration 20, what price change does that produce, in %?`
            : `Le 28 septembre, la Banque d'Angleterre — qui s'apprêtait à VENDRE des gilts au titre du QT — annonce des achats d'urgence temporaires : treize jours ouvrés, jusqu'au 14 octobre. Le 30 ans retombe de ${pct(y1, 1)} à ${pct(yBack, 1)}. Sur duration 20, quelle variation de prix cela produit-il, en % ?`,
          reponse: repRebond, tolerance: Math.max(0.5, Math.abs(repRebond) * 0.03), toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'Breaking the loop, not financing the budget' : 'Casser la boucle, pas financer le budget',
              contenu: en
                ? `ΔP/P ≈ −20 × (${f(r2(yBack - y1), 2)}) = **${pct(repRebond, 1)}** — the spiral breaks almost on the announcement, exactly like the OMT logic of chapter 5: against a self-feeding loop, what counts is the credibility of the buyer, not the quantity bought. But note what the Bank did NOT do: open-ended purchases. Thirteen business days, hard deadline — the firefighter bounds his own intervention so that buying gilts in an inflation crisis does not become financing the government that caused it. Truss resigns on October 20, after 44 days.`
                : `ΔP/P ≈ −20 × (${f(r2(yBack - y1), 2)}) = **${pct(repRebond, 1)}** — la spirale casse presque à l'annonce, exactement la logique OMT du chapitre 5 : contre une boucle auto-entretenue, ce qui compte est la crédibilité de l'acheteur, pas la quantité achetée. Mais notez ce que la Banque n'a PAS fait : des achats sans borne. Treize jours ouvrés, échéance ferme — le pompier borne sa propre intervention pour qu'acheter des gilts en pleine crise d'inflation ne devienne pas financer le gouvernement qui l'a provoquée. Truss démissionne le 20 octobre, après 44 jours.`,
            },
            {
              titre: en ? 'The lesson to carry into module 12' : 'La leçon à emporter vers le module 12',
              contenu: en
                ? `Solvent funds, almost killed by liquidity; a hedge that was economically right and operationally lethal; a central bank forced to play firefighter in the middle of its own tightening — financial stability and monetary policy can contradict each other on a Tuesday morning. The hierarchy to recite: rate risk is MEASURED by duration, it MATERIALISES through liquidity. Asset-liability management that survives this is module 12's programme.`
                : `Des fonds solvables, presque tués par la liquidité ; une couverture économiquement juste et opérationnellement mortelle ; une banque centrale forcée de jouer les pompiers au milieu de son propre resserrement — stabilité financière et politique monétaire peuvent se contredire un mardi matin. La hiérarchie à réciter : le risque de taux se MESURE par la duration, il se MATÉRIALISE par la liquidité. La gestion actif-passif qui survit à cela, c'est le programme du module 12.`,
            },
          ],
          pieges: [en
            ? `"The BoE pivoted back to QE" misreads the design: the purchases were explicitly temporary and bounded (13 business days), the OPPOSITE of an open-ended programme — the bound was the message, precisely to protect the tightening's credibility.`
            : `« La BoE est repartie en QE » lit mal le dispositif : les achats étaient explicitement temporaires et bornés (13 jours ouvrés), l'OPPOSÉ d'un programme ouvert — la borne était le message, précisément pour protéger la crédibilité du resserrement.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 12. m10-pb-12 — SVB, mars 2023 — BOSS N4                            */
/* ------------------------------------------------------------------ */
const svbDuration: ProblemeMoule = {
  id: 'm10-pb-12', moduleId: M10,
  titre: 'Mars 2023 : SVB, la duration cachée au bilan d\'une banque',
  titreEn: 'March 2023: SVB, the duration hidden on a bank\'s balance sheet',
  typeDeCas: 'risque de taux au bilan',
  typeDeCasEn: 'balance-sheet rate risk',
  difficulte: 4,
  scenarios: ['L\'analyste risque qui relit le rapport annuel, février 2023', 'La cellule du régulateur, le 9 mars au soir', 'Grand oral : autopsie d\'une banque tuée par la duration'],
  scenariosEn: ['The risk analyst rereading the annual report, February 2023', 'The regulator\'s task force, the evening of March 9', 'Final viva: autopsy of a bank killed by duration'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const htm = randInt(rng, 85, 95);
    const dur = randFloat(rng, 5.8, 6.4, 1);
    const deltaPb = randInt(rng, 260, 290);
    const fp = randFloat(rng, 15, 17, 1);
    const depots = randInt(rng, 180, 195);
    const retraits = randInt(rng, 40, 44);
    const coutDep = randFloat(rng, 4.25, 4.75, 2);
    const nonAss = randInt(rng, 88, 94);

    const pertePct = variationPrixObligationDuration(dur, deltaPb);
    const perteMd = (Math.abs(pertePct) / 100) * htm;
    const ratioFp = (perteMd / fp) * 100;
    const partFuite = (retraits / depots) * 100;
    const hemorragie = ((coutDep - 1.5) / 100) * htm;
    const nonAssureMd = (nonAss / 100) * depots;
    const repPct = r1(pertePct);
    const repMd = r1(perteMd);
    const repRatio = r0(ratioFp);
    const repFuite = r1(partFuite);
    const repHemo = r2(hemorragie);
    const repNonAss = r0(nonAssureMd);

    const { en, f, pct, pb } = outils(langue);
    const desc = en
      ? `between 2020 and 2021, venture-capital money pours in and Silicon Valley Bank's deposits more than triple, toward \\$${f(depots, 0)}bn; startups deposit rather than borrow, so the bank invests massively in LONG government bonds and MBS, bought at the top of the bond market at yields around 1.5%, and classifies the bulk — about \\$${f(htm, 0)}bn, average modified duration ${f(dur, 1)} — as held-to-maturity (HTM), an accounting category where securities stay at cost; in 2022 the Fed hikes by more than 400 bp, of which about ${pb(deltaPb)} hit the portfolio's relevant maturities; the bank's equity stands at about \\$${f(fp, 1)}bn, more than ${pct(nonAss, 0)} of deposits exceed the \\$250,000 insurance cap, and replacing a fleeing deposit costs money-market rates of about ${pct(coutDep, 2)}`
      : `entre 2020 et 2021, l'argent du capital-risque ruisselle et les dépôts de Silicon Valley Bank font plus que tripler, vers ${f(depots, 0)} Md\\$ ; les startups déposent au lieu d'emprunter, la banque investit donc massivement en obligations d'État et MBS LONGS, achetés au sommet du marché obligataire à des rendements de l'ordre de 1,5 %, et en classe l'essentiel — environ ${f(htm, 0)} Md\\$, duration modifiée moyenne ${f(dur, 1)} — en held-to-maturity (HTM), une catégorie comptable où les titres restent au coût d'achat ; en 2022, la Fed monte de plus de 400 pb, dont environ ${pb(deltaPb)} touchent les maturités pertinentes du portefeuille ; les fonds propres de la banque sont d'environ ${f(fp, 1)} Md\\$, plus de ${pct(nonAss, 0)} des dépôts dépassent le plafond de garantie de 250 000 \\$, et remplacer un dépôt qui fuit coûte le taux du marché monétaire, environ ${pct(coutDep, 2)}`;
    const contexte = (en
      ? [
        `February 2023, an asset-management risk desk. Your fund holds SVB bonds, and your job this week is to reread its annual report with module 4's eyes rather than an accountant's. Page after page, the same anomaly: a bank whose deposits tripled, whose loans barely grew, and whose balance sheet is essentially a giant bond portfolio bought at the top: ${desc}.\n\nThe accounting sees nothing — HTM stays at cost. The economics sees everything: run the numbers in order. The latent loss in percent, then in billions; the comparison with equity that turns an accounting footnote into an insolvency; the deposit base that can leave by smartphone; the negative carry that bleeds the bank even if nobody runs; and the fraction of deposits with every incentive to run first. You are about to discover that the diagnosis takes two words from module 4 — duration mismatch — and that the only missing ingredient is someone saying it out loud.`,
        `Thursday, March 9, 2023, 9 p.m., the regulator's crisis room. Yesterday SVB sold \\$21bn of securities, crystallising \\$1.8bn of losses, and announced a capital raise; the signal crossed the venture-capital group chats in hours, and the advice went out to startups: get out. Today the bank received \\$42bn of withdrawal requests — in one day, from smartphones, without a single queue. On the table, the file: ${desc}.\n\nBefore deciding whether the bank opens tomorrow, the task force needs the numbers that explain how it died in 48 hours: the latent loss the HTM accounting hid in plain sight; its size against equity; the arithmetic of a one-day run; the negative-carry wound that made survival expensive even without a run; and the uninsured share that made the run rational for every single depositor. The bank will not open on Friday morning. Signature falls two days later; Credit Suisse is absorbed the following week — but the contagion is module 11's business.`,
        `The examiner projects a balance sheet reduced to four lines — deposits, HTM portfolio, equity, and a yield of 1.5% — and says: "March 2023. No credit losses, no fraud, no trading. Explain to me how this kills a bank in 48 hours." The data: ${desc}.\n\nHe expects the full chain: −D×Δy on the portfolio; the billions compared with equity — economically insolvent, accountingly intact —; the run quantified (a quarter of deposits in a day); the carry arithmetic that shows the position was doomed even in slow motion; and the coordination problem of ${pct(nonAss, 0)} uninsured deposits. Two closing sentences: the diagnosis is a duration mismatch — sight deposits of duration zero funding an asset of duration ${f(dur, 1)}, unhedged; and the fix is asset-liability management, module 12's programme, while the panic mechanics belong to module 11.`,
      ]
      : [
        `Février 2023, un desk risque de société de gestion. Votre fonds détient des obligations SVB, et votre travail cette semaine est de relire son rapport annuel avec les yeux du module 4 plutôt que ceux d'un comptable. Page après page, la même anomalie : une banque dont les dépôts ont triplé, dont les prêts ont à peine grossi, et dont le bilan est essentiellement un portefeuille obligataire géant acheté au sommet : ${desc}.\n\nLa comptabilité ne voit rien — le HTM reste au coût. L'économie voit tout : déroulez les nombres dans l'ordre. La perte latente en pourcent, puis en milliards ; la comparaison aux fonds propres qui transforme une note de bas de page comptable en insolvabilité ; la base de dépôts qui peut partir par smartphone ; le portage négatif qui saigne la banque même si personne ne court ; et la fraction des dépôts qui a toutes les raisons de courir en premier. Vous êtes sur le point de découvrir que le diagnostic tient en deux mots du module 4 — duration mismatch — et qu'il ne manque que quelqu'un pour le dire tout haut.`,
        `Jeudi 9 mars 2023, 21 h, la salle de crise du régulateur. Hier, SVB a vendu 21 Md\\$ de titres en actant 1,8 Md\\$ de pertes et annoncé une augmentation de capital ; le signal a traversé les group chats du capital-risque en quelques heures, et le conseil est parti vers les startups : sortez. Aujourd'hui, la banque a reçu 42 Md\\$ de demandes de retraits — en une journée, depuis des smartphones, sans une seule file d'attente. Sur la table, le dossier : ${desc}.\n\nAvant de décider si la banque ouvre demain, la cellule a besoin des nombres qui expliquent comment elle est morte en 48 heures : la perte latente que la comptabilité HTM cachait en pleine lumière ; sa taille face aux fonds propres ; l'arithmétique d'une ruée d'un jour ; la blessure de portage négatif qui rendait la survie coûteuse même sans ruée ; et la part non assurée qui rendait la ruée rationnelle pour chaque déposant. La banque n'ouvrira pas vendredi matin. Signature tombe le surlendemain ; Credit Suisse est absorbée la semaine suivante — mais la contagion est l'affaire du module 11.`,
        `L'examinateur projette un bilan réduit à quatre lignes — dépôts, portefeuille HTM, fonds propres, et un rendement de 1,5 % — et dit : « Mars 2023. Pas de pertes de crédit, pas de fraude, pas de trading. Expliquez-moi comment cela tue une banque en 48 heures. » Les données : ${desc}.\n\nIl attend la chaîne complète : −D×Δy sur le portefeuille ; les milliards comparés aux fonds propres — économiquement insolvable, comptablement intacte — ; la ruée quantifiée (un quart des dépôts en un jour) ; l'arithmétique de portage qui montre que la position était condamnée même au ralenti ; et le problème de coordination de ${pct(nonAss, 0)} de dépôts non assurés. Deux phrases de clôture : le diagnostic est un duration mismatch — des dépôts à vue de duration zéro finançant un actif de duration ${f(dur, 1)}, sans couverture ; et le remède est la gestion actif-passif, programme du module 12, quand la mécanique de panique relève du module 11.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The latent loss, in percent' : 'a) La perte latente, en pourcent',
          enonce: en
            ? `About ${pb(deltaPb)} of rate rises hit a portfolio of modified duration ${f(dur, 1)}. What latent price change does the duration approximation give, in %?`
            : `Environ ${pb(deltaPb)} de hausses de taux frappent un portefeuille de duration modifiée ${f(dur, 1)}. Quelle variation de prix latente l'approximation par la duration donne-t-elle, en % ?`,
          reponse: repPct, tolerance: Math.max(0.3, Math.abs(repPct) * 0.03), toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The economics does not read the accounting' : 'L\'économie ne lit pas la comptabilité',
            contenu: en
              ? `ΔP/P ≈ −${f(dur, 1)} × ${f(r2(deltaPb / 100), 2)} = **${pct(repPct, 1)}**. The HTM classification keeps the securities at cost — the income statement shows nothing, the balance sheet shows nothing. But an accounting category does not change a bond's price: the loss exists, footnoted, published, visible to whoever multiplies two numbers. Bought at 1.5% yield at the very top of the bond market, the portfolio had maximum duration and zero coupon cushion — chapter 7's 2022 configuration, parked inside a bank.`
              : `ΔP/P ≈ −${f(dur, 1)} × ${f(r2(deltaPb / 100), 2)} = **${pct(repPct, 1)}**. La classification HTM garde les titres au coût — le compte de résultat ne montre rien, le bilan ne montre rien. Mais une catégorie comptable ne change pas le prix d'une obligation : la perte existe, en note de bas de page, publiée, visible pour qui multiplie deux nombres. Acheté à 1,5 % de rendement au sommet exact du marché obligataire, le portefeuille avait une duration maximale et un coussin de coupon nul — la configuration 2022 du chapitre 7, garée dans une banque.`,
          }],
        },
        {
          intitule: en ? 'b) …then in billions' : 'b) …puis en milliards',
          enonce: en
            ? `On the \\$${f(htm, 0)}bn HTM portfolio, how many billions of dollars of latent losses does that represent?`
            : `Sur les ${f(htm, 0)} Md\\$ du portefeuille HTM, combien de milliards de dollars de pertes latentes cela représente-t-il ?`,
          reponse: repMd, tolerance: Math.max(0.3, repMd * 0.03), toleranceMode: 'absolu', unite: 'Md$',
          etapes: [{
            titre: en ? 'Chapter 7\'s order of magnitude' : 'L\'ordre de grandeur du chapitre 7',
            contenu: en
              ? `${pct(r1(Math.abs(pertePct)), 1)} × ${f(htm, 0)} = **\\$${f(repMd, 1)}bn** of latent losses — the order of magnitude of the real file (about \\$15bn at end-2022). Nothing exotic produced it: government bonds and agency MBS, the safest credit on earth. "Risk-free" qualifies default, never price — and a bank is precisely the kind of holder that may be forced to sell before maturity, which is the one scenario HTM accounting assumes away.`
              : `${pct(r1(Math.abs(pertePct)), 1)} × ${f(htm, 0)} = **${f(repMd, 1)} Md\\$** de pertes latentes — l'ordre de grandeur du dossier réel (environ 15 Md\\$ fin 2022). Rien d'exotique ne les a produites : des obligations d'État et des MBS d'agences, le crédit le plus sûr du monde. « Sans risque » qualifie le défaut, jamais le prix — et une banque est précisément le genre de porteur qui peut être forcé de vendre avant l'échéance, l'unique scénario que la comptabilité HTM suppose impossible.`,
          }],
        },
        {
          intitule: en ? 'c) The comparison that changes the word' : 'c) La comparaison qui change le mot',
          enonce: en
            ? `Equity stands at \\$${f(fp, 1)}bn. What fraction of it do the latent losses represent, in %?`
            : `Les fonds propres sont de ${f(fp, 1)} Md\\$. Quelle fraction en représentent les pertes latentes, en % ?`,
          reponse: repRatio, tolerance: 3, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'From "unrealised" to "insolvent"' : 'De « latent » à « insolvable »',
            contenu: en
              ? `${f(repMd, 1)} / ${f(fp, 1)} = **${pct(repRatio, 0)}** of equity. Around one hundred percent: mark the portfolio to market and the bank's net worth is approximately zero — economically insolvent, accountingly intact. From that point the situation is a loaded spring: nothing has to happen, but if ANYTHING forces the latent to become real — a sale, a downgrade, a tweet — the equity is gone. On March 8 the bank sells \\$21bn of securities, crystallises \\$1.8bn of losses, announces a capital raise: someone said it out loud.`
              : `${f(repMd, 1)} / ${f(fp, 1)} = **${pct(repRatio, 0)}** des fonds propres. Environ cent pour cent : valorisez le portefeuille au marché et l'actif net de la banque est à peu près nul — économiquement insolvable, comptablement intacte. À partir de là, la situation est un ressort armé : rien n'est obligé d'arriver, mais si QUOI QUE CE SOIT force le latent à devenir réel — une vente, une dégradation, un tweet — les fonds propres ont disparu. Le 8 mars, la banque vend 21 Md\\$ de titres, acte 1,8 Md\\$ de pertes, annonce une augmentation de capital : quelqu'un l'a dit tout haut.`,
          }],
          pieges: [en
            ? `"The losses were only latent, so the bank was fine as long as it held to maturity" assumes the LIABILITY side waits too: sight deposits can leave any morning, and holding to maturity is a promise the depositors never signed.`
            : `« Les pertes n'étaient que latentes, la banque tenait tant qu'elle portait à l'échéance » suppose que le PASSIF attend aussi : des dépôts à vue peuvent partir n'importe quel matin, et porter à l'échéance est une promesse que les déposants n'ont jamais signée.`],
        },
        {
          intitule: en ? 'd) The run, quantified' : 'd) La ruée, quantifiée',
          enonce: en
            ? `On March 9, \\$${f(retraits, 0)}bn of withdrawals are requested in one day, out of \\$${f(depots, 0)}bn of deposits. What share of the deposit base asked to leave in a single day, in %?`
            : `Le 9 mars, ${f(retraits, 0)} Md\\$ de retraits sont demandés en une journée, sur ${f(depots, 0)} Md\\$ de dépôts. Quelle part de la base de dépôts a demandé à partir en un seul jour, en % ?`,
          reponse: repFuite, tolerance: 0.5, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The 19th century at fibre speed' : 'Le XIXᵉ siècle à la vitesse de la fibre',
            contenu: en
              ? `${f(retraits, 0)} / ${f(depots, 0)} = **${pct(repFuite, 1)}** — about a quarter of the deposits, in one day, from smartphones, without a single queue on a pavement. The 19th-century bank run at fibre speed: the signal crossed the venture-capital group chats in hours, and the very concentration that had built the deposit base (one industry, one valley, everyone in the same chats) turned it into a single coordinated depositor. The bank was closed by the regulator the next morning: 48 hours from the announcement.`
              : `${f(retraits, 0)} / ${f(depots, 0)} = **${pct(repFuite, 1)}** — environ un quart des dépôts, en une journée, depuis des smartphones, sans une seule file sur un trottoir. La panique bancaire du XIXᵉ siècle à la vitesse de la fibre : le signal a traversé les group chats du capital-risque en quelques heures, et la concentration même qui avait construit la base de dépôts (une industrie, une vallée, tout le monde dans les mêmes conversations) l'a transformée en un unique déposant coordonné. La banque est fermée par le régulateur le lendemain matin : 48 heures depuis l'annonce.`,
          }],
        },
        {
          intitule: en ? 'e) Doomed even in slow motion: the carry' : 'e) Condamnée même au ralenti : le portage',
          enonce: en
            ? `Suppose nobody runs, but the deposits must now be paid (or replaced) at money-market rates of ${pct(coutDep, 2)} while the portfolio yields 1.5%. On the \\$${f(htm, 0)}bn, what annual negative carry does that imply, in \\$bn per year?`
            : `Supposez que personne ne court, mais que les dépôts doivent désormais être rémunérés (ou remplacés) au taux du marché monétaire, ${pct(coutDep, 2)}, quand le portefeuille rend 1,5 %. Sur les ${f(htm, 0)} Md\\$, quel portage négatif annuel cela implique-t-il, en Md\\$ par an ?`,
          reponse: repHemo, tolerance: Math.max(0.1, repHemo * 0.03), toleranceMode: 'absolu', unite: 'Md$',
          etapes: [{
            titre: en ? 'The slow death behind the fast one' : 'La mort lente derrière la rapide',
            contenu: en
              ? `(${f(coutDep, 2)}% − 1.5%) × ${f(htm, 0)} = **\\$${f(repHemo, 2)}bn per year** of negative carry. This is the second, quieter way the position was doomed: even with perfectly loyal depositors, an asset locked at 1.5% funded by liabilities repricing to ${pct(coutDep, 2)} bleeds the income statement year after year. The rate hike hurts the bank on BOTH sides — a stock loss (the latent \\$${f(repMd, 1)}bn) and a flow loss (this carry). The run merely chose the fast death over the slow one.`
              : `(${f(coutDep, 2)} % − 1,5 %) × ${f(htm, 0)} = **${f(repHemo, 2)} Md\\$ par an** de portage négatif. C'est la seconde façon, plus silencieuse, dont la position était condamnée : même avec des déposants parfaitement fidèles, un actif verrouillé à 1,5 % financé par un passif qui se re-price à ${pct(coutDep, 2)} saigne le compte de résultat année après année. La hausse des taux frappe la banque des DEUX côtés — une perte de stock (les ${f(repMd, 1)} Md\\$ latents) et une perte de flux (ce portage). La ruée n'a fait que choisir la mort rapide plutôt que la lente.`,
          }],
          pieges: [en
            ? `"The bank just needed to hold to maturity and collect par" ignores the funding leg: holding a 1.5% asset costs ${pct(coutDep, 2)} to finance — par at maturity does not repair ${f(r1(coutDep - 1.5), 1)} points of negative carry compounding for years.`
            : `« La banque n'avait qu'à porter à l'échéance et toucher le pair » ignore la jambe de financement : porter un actif à 1,5 % coûte ${pct(coutDep, 2)} à financer — le pair à l'échéance ne répare pas ${f(r1(coutDep - 1.5), 1)} points de portage négatif composés pendant des années.`],
        },
        {
          intitule: en ? 'f) Why running first was rational' : 'f) Pourquoi courir en premier était rationnel',
          enonce: en
            ? `More than ${pct(nonAss, 0)} of the \\$${f(depots, 0)}bn of deposits exceed the \\$250,000 insurance cap. How many billions of dollars of deposits were NOT insured?`
            : `Plus de ${pct(nonAss, 0)} des ${f(depots, 0)} Md\\$ de dépôts dépassent le plafond de garantie de 250 000 \\$. Combien de milliards de dollars de dépôts n'étaient PAS assurés ?`,
          reponse: repNonAss, tolerance: Math.max(2, repNonAss * 0.02), toleranceMode: 'absolu', unite: 'Md$',
          etapes: [
            {
              titre: en ? 'A coordination game with one equilibrium' : 'Un jeu de coordination à un seul équilibre',
              contenu: en
                ? `${pct(nonAss, 0)} × ${f(depots, 0)} = **\\$${f(repNonAss, 0)}bn** uninsured. Deposit insurance exists precisely to remove the incentive to run; above the cap, the incentive returns intact: whoever withdraws first gets 100 cents, whoever waits gets the liquidation. With ${pct(nonAss, 0)} of the base uninsured, running first was individually rational for almost everyone — which is what makes the panic collectively unstoppable. Bank runs, contagion (Signature two days later, Credit Suisse the next week): module 11's programme.`
                : `${pct(nonAss, 0)} × ${f(depots, 0)} = **${f(repNonAss, 0)} Md\\$** non assurés. La garantie des dépôts existe précisément pour supprimer l'incitation à courir ; au-dessus du plafond, l'incitation revient intacte : qui retire en premier touche 100 cents, qui attend touche la liquidation. Avec ${pct(nonAss, 0)} de la base non assurée, courir en premier était individuellement rationnel pour presque tout le monde — c'est ce qui rend la panique collectivement inarrêtable. Ruées bancaires, contagion (Signature le surlendemain, Credit Suisse la semaine suivante) : le programme du module 11.`,
            },
            {
              titre: en ? 'The two-word diagnosis, and the cure' : 'Le diagnostic en deux mots, et le remède',
              contenu: en
                ? `Duration mismatch: sight deposits of duration ZERO funding an asset of duration ${f(dur, 1)}, without a rate hedge worth the name — module 4's vocabulary, printed on a bank's death certificate. The cure existed and has a name, asset-liability management: match durations, hedge the gap with swaps (the gilts boss shows the cost of doing it with leverage), and never let an accounting category stand in for a risk measure. That is module 12's programme; SVB is its founding cautionary tale.`
                : `Duration mismatch : des dépôts à vue de duration ZÉRO finançant un actif de duration ${f(dur, 1)}, sans couverture de taux digne de ce nom — le vocabulaire du module 4, imprimé sur l'acte de décès d'une banque. Le remède existait et porte un nom, la gestion actif-passif : apparier les durations, couvrir l'écart par des swaps (le boss des gilts montre le coût de le faire avec du levier), et ne jamais laisser une catégorie comptable tenir lieu de mesure de risque. C'est le programme du module 12 ; SVB en est le conte d'avertissement fondateur.`,
            },
          ],
          pieges: [en
            ? `"SVB died of its risky startup loans" gets the asset wrong: the portfolio was government paper — no default anywhere in the story. The killer was rate risk plus a runnable liability; credit risk never showed up.`
            : `« SVB est morte de ses prêts risqués aux startups » se trompe d'actif : le portefeuille était du papier d'État — aucun défaut nulle part dans l'histoire. Le tueur fut le risque de taux plus un passif capable de courir ; le risque de crédit n'est jamais apparu.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 13. m10-pb-13 — Le trade de la décennie, 2022 — BOSS N4             */
/* ------------------------------------------------------------------ */
const tradeDecennie: ProblemeMoule = {
  id: 'm10-pb-13', moduleId: M10,
  titre: '2022, le trade de la décennie : short duration, long dollar',
  titreEn: '2022, the trade of the decade: short duration, long dollar',
  typeDeCas: 'macro trading',
  typeDeCasEn: 'macro trading',
  difficulte: 4,
  scenarios: ['Le macro trader devant son comité, janvier 2022', 'Le CIO qui doit défendre son 60/40', 'Grand oral : reconstruire le trade de 2022'],
  scenariosEn: ['The macro trader facing his committee, January 2022', 'The CIO who must defend his 60/40', 'Final viva: rebuilding the 2022 trade'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const rStar = randFloat(rng, 1.5, 2, 1);
    const gap = randFloat(rng, 0.5, 1.5, 1);
    const piC = randFloat(rng, 6.8, 7.2, 1);
    const nPricees = randInt(rng, 3, 4);
    const y0 = randFloat(rng, 1.5, 1.7, 1);
    const y1 = randFloat(rng, 3.8, 4.2, 1);
    const dur = randFloat(rng, 7, 8, 1);
    const spotFx = randFloat(rng, 12, 15, 1);
    const carry = randFloat(rng, 1.5, 2.5, 1);
    const actions = randFloat(rng, -20, -18, 1);

    const taylor = regleDeTaylor(rStar, piC, 2, gap);
    const reel = tauxReelFisher(0.25, piC);
    const terminal = tauxTerminalAnticipe(0.25, nPricees, 25);
    const manque = Math.round((taylor - terminal) / 0.25);
    const deltaPb = (y1 - y0) * 100;
    const oblig = variationPrixObligationDuration(dur, deltaPb);
    const gainShort = -oblig;
    const gainFx = ((1 + spotFx / 100) * (1 + carry / 100) - 1) * 100;
    const p6040 = 0.6 * actions + 0.4 * oblig;
    const repTaylor = r2(taylor);
    const repReel = r2(reel);
    const repManque = r0(manque);
    const repShort = r1(gainShort);
    const repFx = r1(gainFx);
    const rep6040 = r1(p6040);

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `US inflation printed ${pct(piC, 1)} for December 2021 — a forty-year high — while the fed funds rate still sits at 0.25% and the Fed is STILL buying bonds; the 10-year yields ${pct(y0, 1)}; futures price only ${f(nPricees, 0)} hikes of 25 bp for the whole of 2022; consensus estimates put the neutral real rate around ${pct(rStar, 1)} and the output gap around +${pct(gap, 1)} (an economy running hot); the Bank of Japan, meanwhile, is defending its yield-curve control and will not budge — the short-rate differential on a long-dollar position yields about ${pct(carry, 1)} of carry over the year`
      : `l'inflation américaine est ressortie à ${pct(piC, 1)} pour décembre 2021 — un plus haut de quarante ans — pendant que les fed funds sont encore à 0,25 % et que la Fed achète ENCORE des obligations ; le 10 ans rend ${pct(y0, 1)} ; les futures ne pricent que ${f(nPricees, 0)} hausses de 25 pb pour toute l'année 2022 ; le consensus estime le taux neutre réel vers ${pct(rStar, 1)} et l'écart de production vers +${pct(gap, 1)} (une économie en surchauffe) ; la Banque du Japon, elle, défend son contrôle de la courbe et ne bougera pas — le différentiel de taux courts sur une position longue dollar rapporte environ ${pct(carry, 1)} de portage sur l'année`;
    const contexte = (en
      ? [
        `January 2022, the investment committee of a global macro fund. You have asked for thirty minutes and a whiteboard. Your pitch holds in one sentence: the largest gap between arithmetic and prices you will see in your career. The data: ${desc}.\n\nThe committee will want the whole chain, in order: what a Taylor rule prescribes against this inflation; what the real policy rate actually is (the most negative in decades); how far the priced path stands from the prescription — the fuel of the trade —; then the two legs, each quantified: short duration (the 10-year cannot stay at ${pct(y0, 1)} if the Fed must chase ${pct(r2(taylor), 0)}), long dollar against the one big central bank that will not follow (module 6: capital flows toward the currency that pays). And because half the committee runs balanced portfolios, close with what this same scenario does to a 60/40 — the correlation they trust is about to change sign.`,
        `December 2022, the year-end review of a large balanced fund. The CIO's 60/40 has just signed its worst year since 2008, and the board wants to understand why the "diversified" portfolio diversified nothing. On the table, the January data everyone had: ${desc}.\n\nRebuild what the board did not see at the time: the Taylor prescription that made 0.25% untenable; the deeply negative real rate that said, in January, that policy was massively accommodative in the middle of an inflation shock; the handful of hikes the market priced against the dozens the arithmetic demanded; the duration loss that followed on bonds; the dollar leg someone else monetised; and the 60/40 arithmetic itself — both legs falling together, the insurance failing exactly when needed. The lesson is chapter 7's: the stock-bond correlation changes sign with the inflation regime, and 2022 was the regime change.`,
        `The examiner pins two numbers side by side — "${pct(piC, 1)}" and "0.25%" — and says: "January 2022. Build me the trade, leg by leg, and tell me what it did to the portfolios that did not see it." The data: ${desc}.\n\nHe expects the full reconstruction: Taylor against ${pct(piC, 1)} inflation; exact Fisher on the policy rate — the real rate that made "behind the curve" an understatement —; the gap between the priced terminal and the prescription, converted into 25 bp steps; the short-duration leg priced through −D×Δy as the 10-year normalises; the long-dollar leg with its carry compounded on the spot move (the yen, pinned by YCC, is the natural short); and the 60/40's year, computed, with its lesson: when inflation dominates, the rate hits both legs at once — the correlation turns positive, the pillow becomes a second anvil. Module 12 will build the portfolio that survives this; 2022 is its motivation.`,
      ]
      : [
        `Janvier 2022, le comité d'investissement d'un fonds global macro. Vous avez demandé trente minutes et un tableau blanc. Votre pitch tient en une phrase : le plus grand écart entre l'arithmétique et les prix que vous verrez dans votre carrière. Les données : ${desc}.\n\nLe comité voudra la chaîne entière, dans l'ordre : ce qu'une règle de Taylor prescrit contre cette inflation ; ce que le taux directeur réel est vraiment (le plus négatif depuis des décennies) ; à quelle distance le sentier pricé se tient de la prescription — le carburant du trade — ; puis les deux jambes, chacune chiffrée : short duration (le 10 ans ne peut pas rester à ${pct(y0, 1)} si la Fed doit courir vers ${pct(r2(taylor), 0)}), long dollar contre la seule grande banque centrale qui ne suivra pas (module 6 : le capital coule vers la devise qui paie). Et parce que la moitié du comité gère des portefeuilles équilibrés, finissez par ce que ce même scénario fait à un 60/40 — la corrélation à laquelle ils font confiance est sur le point de changer de signe.`,
        `Décembre 2022, la revue de fin d'année d'un grand fonds équilibré. Le 60/40 du CIO vient de signer sa pire année depuis 2008, et le conseil veut comprendre pourquoi le portefeuille « diversifié » n'a rien diversifié. Sur la table, les données de janvier que tout le monde avait : ${desc}.\n\nReconstruisez ce que le conseil n'a pas vu à l'époque : la prescription de Taylor qui rendait 0,25 % intenable ; le réel profondément négatif qui disait, dès janvier, que la politique était massivement accommodante au milieu d'un choc d'inflation ; la poignée de hausses que le marché pricait contre les dizaines que l'arithmétique exigeait ; la perte de duration qui a suivi sur les obligations ; la jambe dollar que d'autres ont monétisée ; et l'arithmétique du 60/40 lui-même — les deux jambes tombant ensemble, l'assurance faisant défaut exactement quand on en avait besoin. La leçon est celle du chapitre 7 : la corrélation actions-obligations change de signe avec le régime d'inflation, et 2022 fut le changement de régime.`,
        `L'examinateur punaise deux nombres côte à côte — « ${pct(piC, 1)} » et « 0,25 % » — et dit : « Janvier 2022. Construisez-moi le trade, jambe par jambe, et dites-moi ce qu'il a fait aux portefeuilles qui ne l'ont pas vu. » Les données : ${desc}.\n\nIl attend la reconstruction complète : Taylor contre ${pct(piC, 1)} d'inflation ; Fisher exact sur le taux directeur — le réel qui faisait de « behind the curve » un euphémisme — ; l'écart entre le terminal pricé et la prescription, converti en pas de 25 pb ; la jambe short duration pricée par −D×Δy quand le 10 ans se normalise ; la jambe longue dollar avec son portage composé sur le mouvement spot (le yen, cloué par le YCC, est le short naturel) ; et l'année du 60/40, calculée, avec sa leçon : quand l'inflation domine, le taux frappe les deux jambes à la fois — la corrélation passe en positif, l'oreiller devient une seconde enclume. Le module 12 construira le portefeuille qui survit à cela ; 2022 est sa motivation.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) What the arithmetic demands' : 'a) Ce que l\'arithmétique exige',
          enonce: en
            ? `Neutral real rate ${pct(rStar, 1)}, inflation ${pct(piC, 1)}, target 2%, output gap +${pct(gap, 1)}, coefficients 0.5. What policy rate does the Taylor rule prescribe, in %?`
            : `Taux neutre réel ${pct(rStar, 1)}, inflation ${pct(piC, 1)}, cible 2 %, écart de production +${pct(gap, 1)}, coefficients 0,5. Quel taux directeur la règle de Taylor prescrit-elle, en % ?`,
          reponse: repTaylor, tolerance: 0.1, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? '"Behind the curve", measured' : '« Behind the curve », mesuré',
            contenu: en
              ? `i = ${f(rStar, 1)} + ${f(piC, 1)} + 0.5 × (${f(piC, 1)} − 2) + 0.5 × ${f(gap, 1)} = **${pct(repTaylor, 2)}** — against an actual rate of 0.25%, with purchases still running. Chapter 2's 2022 experiment: the rule prescribes about 12% while the Fed sits at zero. Nobody expects the Fed to GO to ${pct(r0(repTaylor), 0)} (the prescription is a moving target — it falls as inflation falls); the trade does not need it to. It only needs the gap to start closing, and 525 bp of hikes in sixteen months is what "starting to close" looked like.`
              : `i = ${f(rStar, 1)} + ${f(piC, 1)} + 0,5 × (${f(piC, 1)} − 2) + 0,5 × ${f(gap, 1)} = **${pct(repTaylor, 2)}** — contre un taux effectif de 0,25 %, achats toujours en cours. L'expérience 2022 du chapitre 2 : la règle prescrit environ 12 % pendant que la Fed est à zéro. Personne n'attend que la Fed AILLE à ${pct(r0(repTaylor), 0)} (la prescription est une cible mouvante — elle baisse quand l'inflation baisse) ; le trade n'en a pas besoin. Il a seulement besoin que l'écart commence à se refermer, et 525 pb de hausses en seize mois, voilà à quoi « commencer à se refermer » a ressemblé.`,
          }],
        },
        {
          intitule: en ? 'b) The real rate nobody wants to say aloud' : 'b) Le taux réel que personne ne veut dire tout haut',
          enonce: en
            ? `Fed funds at 0.25%, inflation at ${pct(piC, 1)}. By exact Fisher, what is the real policy rate, in %?`
            : `Fed funds à 0,25 %, inflation à ${pct(piC, 1)}. Par Fisher exact, quel est le taux directeur réel, en % ?`,
          reponse: repReel, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The most accommodative policy in decades' : 'La politique la plus accommodante depuis des décennies',
            contenu: en
              ? `r = (1 + 0.25%)/(1 + ${f(piC, 1)}%) − 1 = **${pct(repReel, 2)}**. A real rate more than six points BELOW zero, in an overheating economy — not neutral, not cautious: massively stimulative in the middle of an inflation shock. This is the number that makes the trade asymmetric: for the position to lose, policy must stay THIS loose while inflation runs at ${pct(piC, 1)} — the one scenario the Volcker chapter rules out for any central bank that intends to keep its mandate.`
              : `r = (1 + 0,25 %)/(1 + ${f(piC, 1)} %) − 1 = **${pct(repReel, 2)}**. Un taux réel à plus de six points SOUS zéro, dans une économie en surchauffe — ni neutre, ni prudent : massivement stimulant au milieu d'un choc d'inflation. C'est le nombre qui rend le trade asymétrique : pour que la position perde, il faudrait que la politique reste AUSSI lâche pendant que l'inflation court à ${pct(piC, 1)} — l'unique scénario que le chapitre Volcker interdit à toute banque centrale qui tient à son mandat.`,
          }],
        },
        {
          intitule: en ? 'c) The fuel: what is NOT priced' : 'c) Le carburant : ce qui n\'est PAS pricé',
          enonce: en
            ? `Futures price ${f(nPricees, 0)} hikes of 25 bp for 2022 (terminal ${pct(r2(terminal), 2)}). How many ADDITIONAL 25 bp steps separate that priced terminal from the Taylor prescription of ${pct(repTaylor, 2)}?`
            : `Les futures pricent ${f(nPricees, 0)} hausses de 25 pb pour 2022 (terminal ${pct(r2(terminal), 2)}). Combien de pas de 25 pb SUPPLÉMENTAIRES séparent ce terminal pricé de la prescription de Taylor de ${pct(repTaylor, 2)} ?`,
          reponse: repManque, tolerance: 1, toleranceMode: 'absolu', unite: en ? 'hikes' : 'hausses',
          etapes: [{
            titre: en ? 'The market prices a tenth of the arithmetic' : 'Le marché price un dixième de l\'arithmétique',
            contenu: en
              ? `Priced terminal = 0.25% + ${f(nPricees, 0)} × 25 bp = ${pct(r2(terminal), 2)}; gap to the prescription = ${f(repTaylor, 2)} − ${f(r2(terminal), 2)} = ${pct(r2(taylor - terminal), 2)}, i.e. **about ${f(repManque, 0)} steps of 25 bp** not in the prices. A trade is never "rates will rise" — that is an opinion; a trade is "MORE than what is priced will happen" (chapter 6: only the gap to consensus moves prices). The realised 2022 path — +425 bp to 4.50% by December — filled a large part of that gap, and every step of it was profit for whoever was short the priced path.`
              : `Terminal pricé = 0,25 % + ${f(nPricees, 0)} × 25 pb = ${pct(r2(terminal), 2)} ; écart à la prescription = ${f(repTaylor, 2)} − ${f(r2(terminal), 2)} = ${pct(r2(taylor - terminal), 2)}, soit **environ ${f(repManque, 0)} pas de 25 pb** absents des prix. Un trade n'est jamais « les taux vont monter » — ça, c'est une opinion ; un trade, c'est « il arrivera PLUS que ce qui est pricé » (chapitre 6 : seul l'écart au consensus bouge les prix). Le sentier réalisé de 2022 — +425 pb jusqu'à 4,50 % en décembre — a comblé une large part de cet écart, et chacun de ses pas a payé qui était short le sentier pricé.`,
          }],
          pieges: [en
            ? `"Inflation is at ${pct(piC, 1)}, so buy inflation hedges" misses where the mispricing lives: the inflation PRINT is public and priced — what is mispriced is the POLICY PATH it implies. The trade shorts the rates market, not the CPI.`
            : `« L'inflation est à ${pct(piC, 1)}, donc achetons des couvertures d'inflation » se trompe d'endroit : le CHIFFRE d'inflation est public et pricé — ce qui est mal pricé, c'est le SENTIER DE POLITIQUE qu'il implique. Le trade shorte le marché des taux, pas le CPI.`],
        },
        {
          intitule: en ? 'd) Leg one: short duration' : 'd) Jambe un : short duration',
          enonce: en
            ? `Over the year the 10-year moves from ${pct(y0, 1)} to ${pct(y1, 1)}. On a modified duration of ${f(dur, 1)}, what does the SHORT position gain (opposite of the bond holder's loss), in %?`
            : `Sur l'année, le 10 ans passe de ${pct(y0, 1)} à ${pct(y1, 1)}. Sur une duration modifiée de ${f(dur, 1)}, que gagne la position SHORT (l'opposé de la perte du porteur), en % ?`,
          reponse: repShort, tolerance: Math.max(0.5, repShort * 0.03), toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The holder\'s worst year is the short\'s best' : 'La pire année du porteur est la meilleure du short',
            contenu: en
              ? `Holder: ΔP/P ≈ −${f(dur, 1)} × ${f(r2(deltaPb / 100), 2)} = ${pct(r1(oblig), 1)}; the short gains **${pct(repShort, 1)}**. This is chapter 7's 2022 in one line: +250 to +300 bp on durations of 7 to 8 is mechanically −20% and worse — the worst year in the modern history of the "risk-free" asset, with no coupon cushion because yields started near zero. The short-duration leg simply stood on the other side of that formula.`
              : `Porteur : ΔP/P ≈ −${f(dur, 1)} × ${f(r2(deltaPb / 100), 2)} = ${pct(r1(oblig), 1)} ; le short gagne **${pct(repShort, 1)}**. C'est le 2022 du chapitre 7 en une ligne : +250 à +300 pb sur des durations de 7 à 8, c'est mécaniquement −20 % et pire — la pire année de l'histoire moderne de l'actif « sans risque », sans coussin de coupon parce que les taux partaient de presque zéro. La jambe short duration s'est simplement tenue de l'autre côté de cette formule.`,
          }],
        },
        {
          intitule: en ? 'e) Leg two: long dollar' : 'e) Jambe deux : long dollar',
          enonce: en
            ? `The yen, pinned by the BoJ's yield-curve control, gives way: the spot gains ${pct(spotFx, 1)} over the year, ON TOP of about ${pct(carry, 1)} of rate-differential carry. What is the total gain of the long-dollar leg (compounded, not added), in %?`
            : `Le yen, cloué par le contrôle de la courbe de la BoJ, cède : le spot gagne ${pct(spotFx, 1)} sur l'année, EN PLUS d'environ ${pct(carry, 1)} de portage de différentiel de taux. Quel est le gain total de la jambe longue dollar (composé, pas additionné), en % ?`,
          reponse: repFx, tolerance: Math.max(0.3, repFx * 0.03), toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Module 6, played at its purest' : 'Le module 6, joué à l\'état pur',
            contenu: en
              ? `Total = (1 + ${f(spotFx, 1)}%) × (1 + ${f(carry, 1)}%) − 1 = **${pct(repFx, 1)}**. Why the yen: 2022's currency moves are pure rate differential (module 6) — the Fed hikes faster and higher than everyone, and the ONE major central bank that explicitly refuses to follow is the BoJ, defending its YCC band (chapter 5). Capital flows toward the currency that pays; the trade shorts the currency whose central bank has promised not to pay. The dollar index gains on the order of 8% over the year (peak near +19% in September); the yen leg does far better, precisely because of the YCC anchor.`
              : `Total = (1 + ${f(spotFx, 1)} %) × (1 + ${f(carry, 1)} %) − 1 = **${pct(repFx, 1)}**. Pourquoi le yen : les mouvements de change de 2022 sont du pur différentiel de taux (module 6) — la Fed monte plus vite et plus haut que tout le monde, et LA grande banque centrale qui refuse explicitement de suivre est la BoJ, qui défend sa bande de YCC (chapitre 5). Le capital coule vers la devise qui paie ; le trade shorte la devise dont la banque centrale a promis de ne pas payer. Le dollar index gagne de l'ordre de 8 % sur l'année (pic proche de +19 % en septembre) ; la jambe yen fait bien mieux, précisément à cause de l'ancre YCC.`,
          }],
          pieges: [en
            ? `Adding ${pct(spotFx, 1)} + ${pct(carry, 1)} = ${pct(r1(spotFx + carry), 1)} understates the leg: the carry accrues on a position whose dollar value has grown — returns compose, the same arithmetic as chapter 4's price indices.`
            : `Additionner ${pct(spotFx, 1)} + ${pct(carry, 1)} = ${pct(r1(spotFx + carry), 1)} sous-estime la jambe : le portage court sur une position dont la valeur en dollars a grossi — les rendements se composent, la même arithmétique que les indices de prix du chapitre 4.`],
        },
        {
          intitule: en ? 'f) The other side: the 60/40\'s year' : 'f) L\'autre côté : l\'année du 60/40',
          enonce: en
            ? `Equities finish the year at ${pct(actions, 1)}; the bond leg takes the ${pct(r1(oblig), 1)} computed above. What does a 60/40 portfolio (60% equities, 40% bonds) return, in %?`
            : `Les actions finissent l'année à ${pct(actions, 1)} ; la jambe obligataire prend les ${pct(r1(oblig), 1)} calculés plus haut. Que rend un portefeuille 60/40 (60 % actions, 40 % obligations), en % ?`,
          reponse: rep6040, tolerance: Math.max(0.3, Math.abs(rep6040) * 0.03), toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'The insurance fails on schedule' : 'L\'assurance fait défaut à l\'heure dite',
              contenu: en
                ? `0.6 × (${f(actions, 1)}) + 0.4 × (${f(r1(oblig), 1)}) = **${pct(rep6040, 1)}** — the order of magnitude of the real 2022 (US 60/40 around −17%, its worst year since 2008; S&P 500 about −19%, bonds −13 to −17%). For twenty years of tame inflation, the correlation was negative: growth scares sank equities and lifted bonds — the 40 was insurance. When inflation becomes the problem, the rate hits BOTH legs: discounting crushes equities, duration crushes bonds, the correlation turns positive, and the insurance fails exactly when it is needed.`
                : `0,6 × (${f(actions, 1)}) + 0,4 × (${f(r1(oblig), 1)}) = **${pct(rep6040, 1)}** — l'ordre de grandeur du 2022 réel (60/40 américain autour de −17 %, sa pire année depuis 2008 ; S&P 500 vers −19 %, obligations −13 à −17 %). Pendant vingt ans d'inflation sage, la corrélation était négative : les peurs de croissance coulaient les actions et portaient les obligations — le 40 était une assurance. Quand l'inflation devient le problème, le taux frappe les DEUX jambes : l'actualisation écrase les actions, la duration écrase les obligations, la corrélation passe en positif, et l'assurance fait défaut exactement quand on en a besoin.`,
            },
            {
              titre: en ? 'The closing sentence for the jury' : 'La phrase de clôture pour le jury',
              contenu: en
                ? `"The 60/40 is dead," said the headlines — it was not dead, it was in an inflation regime: the sign of the stock-bond correlation is a REGIME variable, set by what the central bank is fighting. The trade of the decade and the disaster of the decade were the same position with opposite signs. Building the portfolio that survives the regime change is module 12's programme; knowing which regime you are in is half the job, and it is this module's.`
                : `« Le 60/40 est mort », titrait la presse — il n'était pas mort, il était en régime d'inflation : le signe de la corrélation actions-obligations est une variable de RÉGIME, fixée par ce que la banque centrale combat. Le trade de la décennie et le désastre de la décennie étaient la même position avec des signes opposés. Construire le portefeuille qui survit au changement de régime est le programme du module 12 ; savoir dans quel régime on est, c'est la moitié du métier, et c'est celui de ce module.`,
            },
          ],
          pieges: [en
            ? `"Bonds diversify equities" is not a law of nature: it held in the growth-shock regime of 1998-2021 and broke in 2022 — check WHICH shock dominates before trusting the correlation, because the same +2σ CPI surprise that sinks equities sinks bonds too (chapter 6).`
            : `« Les obligations diversifient les actions » n'est pas une loi de la nature : c'était vrai dans le régime de chocs de croissance 1998-2021 et faux en 2022 — vérifiez QUEL choc domine avant de faire confiance à la corrélation, car la même surprise CPI à +2σ qui coule les actions coule aussi les obligations (chapitre 6).`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 14. m10-pb-14 — La conférence de presse — BOSS N4                   */
/* ------------------------------------------------------------------ */
const conferenceDePresse: ProblemeMoule = {
  id: 'm10-pb-14', moduleId: M10,
  titre: 'La conférence de presse : le prix d\'une surprise',
  titreEn: 'The press conference: the price of a surprise',
  typeDeCas: 'communication de banque centrale',
  typeDeCasEn: 'central bank communication',
  difficulte: 4,
  scenarios: ['La plume du gouverneur, veille du comité', 'Le chef économiste qui simule les scénarios de marché', 'Grand oral : rédiger la forward guidance'],
  scenariosEn: ['The governor\'s speechwriter, the eve of the committee', 'The chief economist simulating the market scenarios', 'Final viva: drafting the forward guidance'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const tauxActuel = pick(rng, [3.0, 3.5, 4.0] as const);
    const proba = randInt(rng, 55, 70);
    const dur = randFloat(rng, 6.5, 7.5, 1);
    const ttPb = randInt(rng, 130, 145);

    const tauxAttendu = tauxActuel + (proba * 0.25) / 100;
    const quote = r2(100 - tauxAttendu);
    const surprise50 = 50 - proba * 0.25;
    const perte50 = variationPrixObligationDuration(dur, surprise50);
    const surprise0 = -proba * 0.25;
    const gain0 = variationPrixObligationDuration(dur, surprise0);
    const effetGuidance = (25 - proba * 0.25) + 25;
    const perteTt = variationPrixObligationDuration(8, ttPb);
    const repProba = r0(proba);
    const repSurprise = r1(surprise50);
    const repPerte = r2(perte50);
    const repStatuQuo = r1(surprise0);
    const repGuidance = r1(effetGuidance);
    const repTt = r1(perteTt);

    const { en, f, pct, pb } = outils(langue);
    const desc = en
      ? `the policy rate stands at ${pct(tauxActuel, 2)} and a 25 bp hike is in play at tomorrow's meeting; the futures contract for the month after the meeting quotes ${f(quote, 2)}; inflation is still above target but decelerating, and two committee members are pushing the governor to "strike hard" with 50 bp; the reference bond index has a modified duration of ${f(dur, 1)}`
      : `le taux directeur est à ${pct(tauxActuel, 2)} et une hausse de 25 pb est en jeu à la réunion de demain ; le future du mois suivant la réunion cote ${f(quote, 2)} ; l'inflation est encore au-dessus de la cible mais décélère, et deux membres du comité poussent le gouverneur à « frapper fort » avec 50 pb ; l'indice obligataire de référence a une duration modifiée de ${f(dur, 1)}`;
    const contexte = (en
      ? [
        `The eve of the committee, 10 p.m., the governor's office. You write the speeches, and tomorrow's is the hardest kind: the decision is close, the committee is split, and whatever is said at 2:30 p.m. will move every price on the continent within seconds. The situation: ${desc}.\n\nThe governor asks for one page before midnight. First the mirror: what exactly does the market price — the futures arithmetic of chapter 6, three subtractions. Then the price list of every option on the table: the 50 bp the hawks want, converted into basis points of surprise and points of bond index; the status quo, which surprises in the OTHER direction; and the third path — deliver the 25 bp everyone can absorb, and move the rest of the tightening into the WORDS, a conditional guidance that shifts the anticipated path without breaking the golden rule: never surprise involuntarily. The last paragraph of the page is the counterexample everyone in the room remembers: May 2013.`,
        `Committee morning, the chief economist's office. Your job before the decision: quantify each scenario the governor might announce at the press conference, because "the market will not like it" is not a sentence one says to a governor — a number is. The inputs: ${desc}.\n\nRun the four cells of the matrix: the implied probability the futures already contain; the surprise, in basis points, of a 50 bp hike (the hawks' option); the surprise of doing nothing (the doves' option — and note that it is NOT zero); and the guidance arithmetic — how a 25 bp move plus one sentence about the future path can deliver the same repricing as the brutal option, spread over words instead of shocks. Attach the taper-tantrum precedent, priced through duration, as the cost of getting one sentence wrong. The press conference is not commentary on policy; since the curve prices the anticipated path, the press conference IS policy.`,
        `The examiner hands you a single sheet: a futures quote, a policy rate, a split committee — ${desc} — and says: "You are drafting the governor's statement. Show me the arithmetic behind every sentence you would write." \n\nHe expects the full grammar of chapters 2, 5 and 6: the implied probability extracted from the future (three subtractions, the FedWatch arithmetic); the surprise in basis points of each option — 50 bp, 25 bp, status quo — because what moves prices is never the decision, it is the gap to what was priced; the duration translation into portfolio damage; the conditional forward guidance that substitutes words for basis points (and its price: it only works while credibility lasts); and the counterexample that closes every discussion of the subject — May 2013, one miscalibrated sentence, ${pb(ttPb)} in four months. His last question will be the trap: "if surprise moves markets, why not surprise on purpose?" Jackson Hole 2022 is the answer — deliberately, rarely, and with the credibility to pay for it.`,
      ]
      : [
        `Veille du comité, 22 h, le bureau du gouverneur. Vous écrivez ses discours, et celui de demain est de l'espèce la plus difficile : la décision est serrée, le comité est divisé, et ce qui sera dit à 14 h 30 déplacera chaque prix du continent en quelques secondes. La situation : ${desc}.\n\nLe gouverneur demande une page avant minuit. D'abord le miroir : que price exactement le marché — l'arithmétique des futures du chapitre 6, trois soustractions. Puis le tarif de chaque option sur la table : les 50 pb que veulent les faucons, convertis en points de base de surprise et en points d'indice obligataire ; le statu quo, qui surprend dans l'AUTRE sens ; et la troisième voie — livrer les 25 pb que tout le monde peut absorber, et déplacer le reste du resserrement dans les MOTS, une guidance conditionnelle qui déplace le sentier anticipé sans casser la règle d'or : ne jamais surprendre involontairement. Le dernier paragraphe de la page est le contre-exemple dont tout le monde dans la pièce se souvient : mai 2013.`,
        `Matin du comité, le bureau du chef économiste. Votre travail avant la décision : chiffrer chaque scénario que le gouverneur pourrait annoncer en conférence de presse, parce que « le marché ne va pas aimer » n'est pas une phrase qu'on dit à un gouverneur — un nombre, si. Les données : ${desc}.\n\nDéroulez les quatre cases de la matrice : la probabilité implicite que les futures contiennent déjà ; la surprise, en points de base, d'une hausse de 50 pb (l'option des faucons) ; la surprise de ne rien faire (l'option des colombes — et notez qu'elle n'est PAS nulle) ; et l'arithmétique de la guidance — comment 25 pb plus une phrase sur le sentier futur peuvent livrer le même repricing que l'option brutale, étalé en mots plutôt qu'en chocs. Joignez le précédent du taper tantrum, pricé par la duration, comme coût d'une phrase ratée. La conférence de presse n'est pas un commentaire de la politique ; puisque la courbe price le sentier anticipé, la conférence de presse EST la politique.`,
        `L'examinateur vous tend une seule feuille : une cote de future, un taux directeur, un comité divisé — ${desc} — et dit : « Vous rédigez le communiqué du gouverneur. Montrez-moi l'arithmétique derrière chaque phrase que vous écririez. »\n\nIl attend la grammaire complète des chapitres 2, 5 et 6 : la probabilité implicite extraite du future (trois soustractions, l'arithmétique de FedWatch) ; la surprise en points de base de chaque option — 50 pb, 25 pb, statu quo — parce que ce qui bouge les prix n'est jamais la décision, c'est l'écart à ce qui était pricé ; la traduction par la duration en dégâts de portefeuille ; la forward guidance conditionnelle qui substitue des mots aux points de base (et son prix : elle ne fonctionne que tant que la crédibilité dure) ; et le contre-exemple qui clôt toute discussion du sujet — mai 2013, une phrase mal calibrée, ${pb(ttPb)} en quatre mois. Sa dernière question sera le piège : « si la surprise bouge les marchés, pourquoi ne pas surprendre exprès ? » Jackson Hole 2022 est la réponse — délibérément, rarement, et avec la crédibilité pour le payer.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The mirror: what the market prices' : 'a) Le miroir : ce que le marché price',
          enonce: en
            ? `The future for the month after the meeting quotes ${f(quote, 2)}, the current rate is ${pct(tauxActuel, 2)} and a 25 bp hike is in play. What probability of a hike does the market price, in %?`
            : `Le future du mois suivant la réunion cote ${f(quote, 2)}, le taux actuel est ${pct(tauxActuel, 2)} et une hausse de 25 pb est en jeu. Quelle probabilité de hausse le marché price-t-il, en % ?`,
          reponse: repProba, tolerance: 2, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Three subtractions' : 'Trois soustractions',
            contenu: en
              ? `Implied mean rate = 100 − ${f(quote, 2)} = ${pct(r2(tauxAttendu), 2)}; that is neither ${f(tauxActuel, 2)} (no hike) nor ${f(r2(tauxActuel + 0.25), 2)} (certain hike), so it is a probability-weighted average: P = (${f(r2(tauxAttendu), 2)} − ${f(tauxActuel, 2)}) / 0.25 = **${pct(repProba, 0)}**. The FedWatch arithmetic of chapter 6, nothing more. This number is the committee's mirror: before deciding anything, the governor must know what world the prices already live in — because tomorrow the market will react to the DIFFERENCE from this, not to the decision itself.`
              : `Taux moyen implicite = 100 − ${f(quote, 2)} = ${pct(r2(tauxAttendu), 2)} ; ce n'est ni ${f(tauxActuel, 2)} (pas de hausse) ni ${f(r2(tauxActuel + 0.25), 2)} (hausse certaine), donc c'est une moyenne pondérée par les probabilités : P = (${f(r2(tauxAttendu), 2)} − ${f(tauxActuel, 2)}) / 0,25 = **${pct(repProba, 0)}**. L'arithmétique FedWatch du chapitre 6, rien de plus. Ce nombre est le miroir du comité : avant de décider quoi que ce soit, le gouverneur doit savoir dans quel monde les prix vivent déjà — car demain, le marché réagira à l'ÉCART à ceci, pas à la décision elle-même.`,
          }],
          pieges: [en
            ? `Reading 100 − ${f(quote, 2)} = ${f(r2(tauxAttendu), 2)}% as "the market expects a hike to ${f(r2(tauxAttendu), 2)}%" misses the mixture: no committee sets a rate of ${f(r2(tauxAttendu), 2)}% — the odd number IS the tell that it averages two discrete outcomes.`
            : `Lire 100 − ${f(quote, 2)} = ${f(r2(tauxAttendu), 2)} % comme « le marché attend une hausse à ${f(r2(tauxAttendu), 2)} % » manque le mélange : aucun comité ne fixe un taux de ${f(r2(tauxAttendu), 2)} % — le chiffre bâtard EST l'indice qu'il moyenne deux issues discrètes.`],
        },
        {
          intitule: en ? 'b) The hawks\' option: +50, priced' : 'b) L\'option des faucons : +50, pricée',
          enonce: en
            ? `If the committee hikes 50 bp, the realised rate is ${pct(r2(tauxActuel + 0.5), 2)} against the ${pct(r2(tauxAttendu), 2)} priced. What is the surprise, in basis points?`
            : `Si le comité monte de 50 pb, le taux réalisé est ${pct(r2(tauxActuel + 0.5), 2)} contre les ${pct(r2(tauxAttendu), 2)} pricés. Quelle est la surprise, en points de base ?`,
          reponse: repSurprise, tolerance: 1, toleranceMode: 'absolu', unite: 'pb',
          etapes: [{
            titre: en ? 'The decision is 50; the news is less' : 'La décision fait 50 ; la nouvelle fait moins',
            contenu: en
              ? `Surprise = (${f(tauxActuel, 2)} + 0.50) − ${f(r2(tauxAttendu), 2)} = **${pb(repSurprise, 1)}**. Not 50: the market had already priced ${pct(repProba, 0)} of a 25 bp move, so part of the hike is old news. This subtraction is the whole grammar of central-bank watching (chapter 6): the consensus is already in the prices, only the gap moves them — the same rule as an NFP or a CPI, applied to the committee's own decision.`
              : `Surprise = (${f(tauxActuel, 2)} + 0,50) − ${f(r2(tauxAttendu), 2)} = **${pb(repSurprise, 1)}**. Pas 50 : le marché pricait déjà ${pct(repProba, 0)} d'une hausse de 25 pb, donc une partie de la hausse est une vieille nouvelle. Cette soustraction est toute la grammaire du central-bank watching (chapitre 6) : le consensus est déjà dans les prix, seul l'écart les bouge — la même règle qu'un NFP ou un CPI, appliquée à la décision du comité lui-même.`,
          }],
        },
        {
          intitule: en ? 'c) The surprise through duration' : 'c) La surprise par la duration',
          enonce: en
            ? `Suppose the ${pb(repSurprise, 1)} of surprise pass into the curve. On the bond index (modified duration ${f(dur, 1)}), what price change does that imply, in %?`
            : `Supposez que les ${pb(repSurprise, 1)} de surprise passent dans la courbe. Sur l'indice obligataire (duration modifiée ${f(dur, 1)}), quelle variation de prix cela implique-t-il, en % ?`,
          reponse: repPerte, tolerance: 0.15, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Minutes of press conference, points of index' : 'Des minutes de conférence, des points d\'indice',
            contenu: en
              ? `ΔP/P ≈ −${f(dur, 1)} × ${f(r2(surprise50 / 100), 2)} = **${pct(repPerte, 2)}** — in the minutes following the announcement, on every bond portfolio watching. The chain of chapter 6, run forward: the surprise moves the anticipated path, the path moves the whole curve, the curve moves everything else — equities through discounting, the currency through the differential. A simplification to flag before a jury: we pass the full surprise into a parallel shift; in reality the short end takes more than the long end — the order of magnitude survives.`
              : `ΔP/P ≈ −${f(dur, 1)} × ${f(r2(surprise50 / 100), 2)} = **${pct(repPerte, 2)}** — dans les minutes qui suivent l'annonce, sur chaque portefeuille obligataire qui regarde. La chaîne du chapitre 6, jouée vers l'avant : la surprise déplace le sentier anticipé, le sentier déplace toute la courbe, la courbe déplace tout le reste — les actions par l'actualisation, la devise par le différentiel. Une simplification à signaler devant un jury : nous passons toute la surprise en translation parallèle ; en réalité la partie courte prend plus que la longue — l'ordre de grandeur survit.`,
          }],
        },
        {
          intitule: en ? 'd) The doves\' option surprises too' : 'd) L\'option des colombes surprend aussi',
          enonce: en
            ? `If the committee does NOTHING, the realised rate is ${pct(tauxActuel, 2)} against the ${pct(r2(tauxAttendu), 2)} priced. What is the surprise, in basis points (sign included)?`
            : `Si le comité ne fait RIEN, le taux réalisé est ${pct(tauxActuel, 2)} contre les ${pct(r2(tauxAttendu), 2)} pricés. Quelle est la surprise, en points de base (signe compris) ?`,
          reponse: repStatuQuo, tolerance: 1, toleranceMode: 'absolu', unite: 'pb',
          etapes: [{
            titre: en ? 'There is no neutral option left' : 'Il ne reste aucune option neutre',
            contenu: en
              ? `Surprise = ${f(tauxActuel, 2)} − ${f(r2(tauxAttendu), 2)} = **${pb(repStatuQuo, 1)}** — negative: yields fall, bonds rally about ${pct(r2(gain0), 2)} on duration ${f(dur, 1)}. The uncomfortable truth of the mirror: once the market prices ${pct(repProba, 0)} of a hike, "doing nothing" is not prudence, it is a dovish SHOCK — it repudiates a path the committee's own communication allowed to form. The status-quo option would also whisper something worse: that the committee flinches, which is a message about every future meeting. Whatever the committee does tomorrow, it moves prices; the only choice is which direction and whether it chose it.`
              : `Surprise = ${f(tauxActuel, 2)} − ${f(r2(tauxAttendu), 2)} = **${pb(repStatuQuo, 1)}** — négative : les taux baissent, les obligations rallyent d'environ ${pct(r2(gain0), 2)} sur duration ${f(dur, 1)}. La vérité inconfortable du miroir : dès que le marché price ${pct(repProba, 0)} de hausse, « ne rien faire » n'est pas de la prudence, c'est un CHOC accommodant — cela renie un sentier que la communication du comité lui-même a laissé se former. Et le statu quo murmurerait pire : que le comité flanche, ce qui est un message sur toutes les réunions futures. Quoi que le comité fasse demain, il bouge les prix ; le seul choix est la direction, et de l'avoir choisie.`,
          }],
          pieges: [en
            ? `"No decision, no market reaction" reads the level instead of the gap: against ${pct(r2(tauxAttendu), 2)} priced, doing nothing IS a decision worth ${pb(repStatuQuo, 1)} — a catastrophic number perfectly anticipated moves nothing, an "absence of news" badly anticipated moves everything (chapter 6).`
            : `« Pas de décision, pas de réaction de marché » lit le niveau au lieu de l'écart : contre ${pct(r2(tauxAttendu), 2)} pricés, ne rien faire EST une décision qui vaut ${pb(repStatuQuo, 1)} — un chiffre catastrophique parfaitement anticipé ne bouge rien, une « absence de nouvelle » mal anticipée bouge tout (chapitre 6).`],
        },
        {
          intitule: en ? 'e) The third path: words instead of shocks' : 'e) La troisième voie : des mots plutôt que des chocs',
          enonce: en
            ? `The governor delivers the 25 bp (residual surprise: 25 − ${f(r2(proba * 0.25), 2)} = ${f(r1(25 - proba * 0.25), 1)} bp) AND adds a conditional guidance — "further tightening will be warranted as long as core inflation has not clearly turned" — that shifts the anticipated terminal rate up by 25 bp. What total move in anticipations, in basis points, does the package deliver?`
            : `Le gouverneur livre les 25 pb (surprise résiduelle : 25 − ${f(r2(proba * 0.25), 2)} = ${f(r1(25 - proba * 0.25), 1)} pb) ET ajoute une guidance conditionnelle — « de nouveaux resserrements seront justifiés tant que l'inflation sous-jacente n'aura pas clairement tourné » — qui déplace le taux terminal anticipé de 25 pb vers le haut. Quel mouvement total des anticipations, en points de base, le paquet livre-t-il ?`,
          reponse: repGuidance, tolerance: 1, toleranceMode: 'absolu', unite: 'pb',
          etapes: [
            {
              titre: en ? 'The same repricing, without the shock' : 'Le même repricing, sans le choc',
              contenu: en
                ? `Total = ${f(r1(25 - proba * 0.25), 1)} (residual surprise on the day) + 25 (terminal shifted by the words) = **${pb(repGuidance, 1)}** — the SAME move in anticipations as the brutal 50 bp option of question b). That equality is the whole art of the press conference: since the curve prices the anticipated path (chapter 2), a sentence that credibly shifts the terminal is worth exactly the basis points it shifts — delivered without breaking the golden rule, never surprise involuntarily. The desks will read the hike as confirmation and the sentence as the news.`
                : `Total = ${f(r1(25 - proba * 0.25), 1)} (surprise résiduelle du jour) + 25 (terminal déplacé par les mots) = **${pb(repGuidance, 1)}** — le MÊME mouvement d'anticipations que l'option brutale des 50 pb de la question b). Cette égalité est tout l'art de la conférence de presse : puisque la courbe price le sentier anticipé (chapitre 2), une phrase qui déplace crédiblement le terminal vaut exactement les points de base qu'elle déplace — livrés sans casser la règle d'or, ne jamais surprendre involontairement. Les desks liront la hausse comme une confirmation et la phrase comme la nouvelle.`,
            },
            {
              titre: en ? 'Why conditional, and what it costs' : 'Pourquoi conditionnelle, et ce que ça coûte',
              contenu: en
                ? `Conditional, not calendar-based (chapter 5): "as long as core inflation has not turned" self-adjusts to the data, whereas "until next June" becomes a trap if the economy turns first. And the price of the tool: it spends credibility — a guidance later repudiated cannot be reused, which is why the sentence must promise a REACTION FUNCTION, never a date. The tool costs nothing but its credibility; that is also the only thing it can lose.`
                : `Conditionnelle, pas calendaire (chapitre 5) : « tant que l'inflation sous-jacente n'a pas tourné » s'ajuste tout seul aux données, quand « jusqu'à juin prochain » devient un piège si l'économie tourne d'abord. Et le prix de l'outil : il dépense de la crédibilité — une guidance reniée ne peut plus resservir, c'est pourquoi la phrase doit promettre une FONCTION DE RÉACTION, jamais une date. L'outil ne coûte que sa crédibilité ; c'est aussi la seule chose qu'il puisse perdre.`,
            },
          ],
        },
        {
          intitule: en ? 'f) The counterexample everyone remembers' : 'f) Le contre-exemple dont tout le monde se souvient',
          enonce: en
            ? `May 2013: one miscalibrated sentence about "moderating purchases" and the US 10-year takes ${pb(ttPb)} in four months. On a duration of 8, what price change did that sentence inflict, in %?`
            : `Mai 2013 : une phrase mal calibrée sur la « modération des achats », et le 10 ans américain prend ${pb(ttPb)} en quatre mois. Sur une duration de 8, quelle variation de prix cette phrase a-t-elle infligée, en % ?`,
          reponse: repTt, tolerance: Math.max(0.3, Math.abs(repTt) * 0.03), toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'The price of one sentence, again' : 'Le prix d\'une phrase, encore',
              contenu: en
                ? `ΔP/P ≈ −8 × ${f(r2(ttPb / 100), 2)} = **${pct(repTt, 1)}** — for a sentence that announced no hike, no sale, no date. The taper tantrum is the file every speechwriter keeps open on the desk: Bernanke's words did not change the policy, they killed an anticipation, and the market repriced the entire path at once. The 2021-22 exit was telegraphed for months precisely to never repeat it. Guidance moves basis points for free — in BOTH directions.`
                : `ΔP/P ≈ −8 × ${f(r2(ttPb / 100), 2)} = **${pct(repTt, 1)}** — pour une phrase qui n'annonçait ni hausse, ni vente, ni date. Le taper tantrum est le dossier que toute plume garde ouvert sur le bureau : les mots de Bernanke n'ont pas changé la politique, ils ont tué une anticipation, et le marché a re-pricé tout le sentier d'un coup. La sortie de 2021-22 a été télégraphiée des mois à l'avance précisément pour ne jamais le rejouer. La guidance déplace des points de base gratuitement — dans les DEUX sens.`,
            },
            {
              titre: en ? 'When surprising is the point' : 'Quand surprendre est le but',
              contenu: en
                ? `Close the file with the exception that proves the rule: Jackson Hole, August 2022 — eight minutes of Powell, promising "pain" rather than a pivot, deliberately repricing the whole curve. A central bank may surprise ON PURPOSE, rarely, when the market refuses to hear the message; what it must never do is surprise by accident. The speech you hand the governor tomorrow contains exactly the basis points it intends to contain — that is the job.`
                : `Refermez le dossier avec l'exception qui confirme la règle : Jackson Hole, août 2022 — huit minutes de Powell, promettant de la « douleur » plutôt qu'un pivot, re-priçant délibérément toute la courbe. Une banque centrale peut surprendre EXPRÈS, rarement, quand le marché refuse d'entendre le message ; ce qu'elle ne doit jamais faire, c'est surprendre par accident. Le discours que vous tendez au gouverneur demain contient exactement les points de base qu'il veut contenir — c'est ça, le métier.`,
            },
          ],
          pieges: [en
            ? `"The tantrum proves guidance does not work" reads it backwards: the tantrum proves guidance works VIOLENTLY — the anticipation had held the whole curve down, and one sentence releasing it moved ${pb(ttPb)}. An instrument that powerful is not discarded; it is calibrated.`
            : `« Le tantrum prouve que la guidance ne marche pas » lit à l'envers : le tantrum prouve que la guidance marche VIOLEMMENT — l'anticipation tenait toute la courbe basse, et une phrase qui la relâche a déplacé ${pb(ttPb)}. Un instrument aussi puissant ne se jette pas ; il se calibre.`],
        },
      ],
    };
  },
};

export const problemesLot2: ProblemeMoule[] = [
  volckerOctobre79, taperTantrum, giltsLdi, svbDuration,
  tradeDecennie, conferenceDePresse,
];
