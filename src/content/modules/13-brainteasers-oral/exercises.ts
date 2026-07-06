/**
 * Les 14 générateurs d'exercices d'application du module Brainteasers & oral :
 * la règle de 72, l'espérance d'un dé, les cotes, le complémentaire, les
 * anniversaires, Bayes par les effectifs, les combinaisons, les séries, les
 * jeux, Fermi, l'edge, la relance, le prix de l'information — chaque moule
 * entraîne un réflexe de calcul MENTAL des chapitres 1 à 5.
 *
 * BILINGUES : generate(seed, langue = 'fr'). Invariant absolu : TOUS les tirages
 * aléatoires sont effectués AVANT toute branche de langue — un même seed produit
 * exactement les mêmes nombres, la même réponse et la même tolérance en français
 * et en anglais. Seuls les textes (énoncé, étapes, pièges, unité textuelle) changent.
 *
 * Tous les calculs passent par calculs.ts (aucune formule recopiée). Conventions
 * du module (en-tête de calculs.ts) : les PROBABILITÉS se passent et se rendent
 * en % ; les taux de la règle de 72 sont annuels en %, composition discrète ;
 * les cotes s'entendent « POUR 1 » (toucher la cote, mise comprise, pour 1
 * misé) ; les estimations de Fermi prennent la moyenne GÉOMÉTRIQUE des bornes.
 * Ce module est celui du calcul mental : les tolérances sont un peu plus
 * larges qu'ailleurs (l'à-peu-près intelligent EST la compétence testée), et
 * chaque corrigé déroule le CHEMIN mental — décomposer, borner, annoncer —
 * jamais la calculatrice. Les pièges martelés : le doublement linéaire 100/t,
 * le « milieu des faces » lu f/2, la cote confondue avec le gain net, le
 * réflexe additif n × p, l'intuition qui compte les personnes au lieu des
 * paires, la sensibilité prise pour la probabilité a posteriori, le k!
 * oublié, la moyenne arithmétique qui écrase la borne basse de Fermi, et
 * l'information payée sans vérifier qu'elle change une décision. L'ordre des
 * tirages de chaque moule est documenté dans son commentaire « Tirages (ordre
 * strict) ».
 */
import { formatNombreLangue } from '../../../engine/answers';
import { mulberry32, pick, randInt } from '../../../engine/rng';
import type { ExerciseGenerator, Langue } from '../../../engine/types';
import {
  anneesDoublementExactes,
  bayesAPosterioriPct,
  combinaisons,
  coteEquitable,
  erreurRelativePct,
  esperanceJeu,
  esperanceLancerDe,
  estimationFermi,
  probaAnniversairesPct,
  probaAuMoinsUnPct,
  probaSerieConsecutivePct,
  regleDe72,
} from './calculs';

const M13 = '13-brainteasers-oral';

const r2 = (v: number) => Math.round(v * 100) / 100;

/** Formateurs dépendants de la langue : nombre, pourcentage, euros. */
function formatters(langue: Langue) {
  const f = (v: number, d = 2) => formatNombreLangue(langue, v, d);
  const pct = (v: number, d = 2) => (langue === 'en' ? `${f(v, d)}%` : `${f(v, d)} %`);
  const eur = (v: number, d = 2) => (langue === 'en' ? `€${f(v, d)}` : `${f(v, d)} €`);
  return { f, pct, eur };
}

// ---------------------------------------------------------------------------
// 1. La règle de 72 (N1)
// ---------------------------------------------------------------------------
export const genRegleDe72: ExerciseGenerator = {
  id: 'm13-ex-01',
  moduleId: M13,
  titre: 'La règle de 72',
  titreEn: 'The rule of 72',
  difficulte: 1,
  // Tirages (ordre strict) : 1. taux = pick([2, 3, 4, 6, 8, 9, 12]) — les
  // diviseurs amis de 72, pour que la division de tête tombe juste ·
  // 2. habillage = pick(['portefeuille', 'inflation', 'client']).
  // Réponse = regleDe72(taux), en années. Le corrigé affiche aussi le
  // doublement EXACT (anneesDoublementExactes) pour installer le réflexe
  // « annoncer le chiffre AVEC sa limite » ; le faux linéaire 100/t est
  // recalculé dans les pièges.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const taux = pick(rng, [2, 3, 4, 6, 8, 9, 12] as const);
    const habillage = pick(rng, ['portefeuille', 'inflation', 'client'] as const);

    const reponse = r2(regleDe72(taux));
    const exact = r2(anneesDoublementExactes(taux));
    const fauxLineaire = r2(100 / taux);
    const surestime = reponse > exact;

    const en = langue === 'en';
    const { f, pct } = formatters(langue);
    const estPf = habillage === 'portefeuille';
    const estInflation = habillage === 'inflation';
    return {
      enonce: en
        ? estPf
          ? `The jury, no calculator in sight: "Your portfolio compounds at ${pct(taux, 0)} a year.\n\n**Roughly how many years until it doubles?**"`
          : estInflation
            ? `Inflation settles at ${pct(taux, 0)} a year.\n\n**Roughly how many years until the price level doubles?**`
            : `A client earns ${pct(taux, 0)} a year, compounded, on a savings account.\n\n**Roughly how many years until the capital doubles?**`
        : estPf
          ? `Le jury, sans calculatrice en vue : « Votre portefeuille rend ${pct(taux, 0)} par an, composés.\n\n**En combien d'années double-t-il, environ ?** »`
          : estInflation
            ? `L'inflation s'installe à ${pct(taux, 0)} par an.\n\n**En combien d'années le niveau des prix double-t-il, environ ?**`
            : `Un client touche ${pct(taux, 0)} par an, composés, sur un placement.\n\n**En combien d'années son capital double-t-il, environ ?**`,
      reponse,
      tolerance: 0.01,
      unite: en ? 'years' : 'ans',
      etapes: [
        {
          titre: en ? 'One division, out loud' : 'Une division, à voix haute',
          contenu: en
            ? `Rule of 72: doubling time ≈ $72/t = 72/${f(taux, 0)}$ = **${f(reponse, 2)} years**. That is the whole mental path — 72 was chosen precisely because it divides by 2, 3, 4, 6, 8, 9 and 12, so every classic rate lands on a whole answer. The anchors to know cold: 8% ⇒ 9 years, 6% ⇒ 12 years, 2% ⇒ 36 years.`
            : `Règle de 72 : temps de doublement ≈ $72/t = 72/${f(taux, 0)}$ = **${f(reponse, 2)} ans**. C'est tout le chemin mental — 72 a été choisi précisément parce qu'il se divise par 2, 3, 4, 6, 8, 9 et 12 : chaque taux classique tombe juste. Les ancres à savoir par cœur : 8 % ⇒ 9 ans, 6 % ⇒ 12 ans, 2 % ⇒ 36 ans.`,
        },
        {
          titre: en ? 'Know the exact value — and the sign of the error' : 'Connaître l\'exact — et le signe de l\'erreur',
          contenu: en
            ? `The exact doubling time is $\\ln 2 / \\ln(1 + t/100)$ = **${f(exact, 2)} years**. At ${pct(taux, 0)}, the rule ${surestime ? 'OVERSTATES slightly' : taux === 8 ? 'is almost exact (−0.07%)' : 'UNDERSTATES slightly'}: near 8% it is essentially perfect (9 vs 9.006468), at low rates it overshoots by about a year (36 vs 35.0 at 2%), at high rates it undershoots. One tool, one domain of validity, one known error — the contract of every approximation in the course.`
            : `Le doublement exact vaut $\\ln 2 / \\ln(1 + t/100)$ = **${f(exact, 2)} ans**. À ${pct(taux, 0)}, la règle ${surestime ? 'SURESTIME légèrement' : taux === 8 ? 'est quasi exacte (−0,07 %)' : 'SOUS-ESTIME légèrement'} : vers 8 % elle est pratiquement parfaite (9 contre 9,006468), aux taux bas elle surestime d'environ un an (36 contre 35,0 à 2 %), aux taux hauts elle sous-estime. Un outil, un domaine de validité, une erreur connue — le contrat de toutes les approximations du cours.`,
        },
        {
          titre: en ? 'Say it like the desk' : 'L\'annoncer comme au desk',
          contenu: en
            ? `The three-beat answer the jury wants: "about ${f(reponse, 0)} years — rule of 72, ${taux === 8 ? 'essentially exact at this rate' : surestime ? 'which slightly overstates at low rates' : 'which slightly understates at high rates'} — ${f(exact, 2)} if you want the decimal." Announce, bound, refine on demand: ten seconds, and the jury has heard a mastered tool, a lucidity about its limits, and precision available but never imposed.`
            : `La réponse en trois temps que le jury attend : « environ ${f(reponse, 0)} ans — règle de 72, ${taux === 8 ? 'quasi exacte à ce niveau de taux' : surestime ? 'qui surestime un peu aux taux bas' : 'qui sous-estime un peu aux taux hauts'} — ${f(exact, 2)} si vous voulez la décimale. » Annoncer, borner, raffiner à la demande : dix secondes, et le jury a entendu un outil maîtrisé, une lucidité sur ses limites, une précision disponible mais jamais imposée.`,
        },
      ],
      pieges: [
        en
          ? `The linear reflex: "${pct(taux, 0)} a year, so 100/${f(taux, 0)} = ${f(fauxLineaire, 1)} years to gain 100%". That ignores compounding — the interest earns interest, so doubling comes FASTER: ${f(reponse, 0)} years, not ${f(fauxLineaire, 1)}. Same lesson as module 4: returns compound, they do not add.`
          : `Le réflexe linéaire : « ${pct(taux, 0)} par an, donc 100/${f(taux, 0)} = ${f(fauxLineaire, 1)} ans pour gagner 100 % ». C'est oublier la composition — les intérêts portent intérêt, donc le doublement arrive PLUS VITE : ${f(reponse, 0)} ans, pas ${f(fauxLineaire, 1)}. Même leçon qu'au module 4 : les rendements se composent, ils ne s'additionnent pas.`,
        en
          ? `Reciting 72/t as an exact law: it is a calibrated approximation, near-perfect around 8%, off by about a year at 2%. The candidate who states the number WITHOUT its domain of validity has shown a formula; the one who states both has shown judgement.`
          : `Réciter 72/t comme une loi exacte : c'est une approximation calibrée, quasi parfaite vers 8 %, décalée d'environ un an à 2 %. Le candidat qui donne le chiffre SANS son domaine de validité a montré une formule ; celui qui donne les deux a montré du jugement.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 2. L'espérance d'un dé (N1)
// ---------------------------------------------------------------------------
export const genEsperanceDe: ExerciseGenerator = {
  id: 'm13-ex-02',
  moduleId: M13,
  titre: 'L\'espérance d\'un dé',
  titreEn: 'The expected value of a die',
  difficulte: 1,
  // Tirages (ordre strict) : 1. faces = pick([6, 8, 10, 12, 20, 100]) ·
  // 2. habillage = pick(['coter', 'prix']).
  // Réponse = esperanceLancerDe(faces) = (f + 1)/2, en euros (« vous gagnez la
  // face en euros »). Le faux du piège — le « milieu des faces » lu f/2 — est
  // recalculé dans le corrigé. Ancres du ch5 : E[d6] = 3,5, E[d100] = 50,5.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const faces = pick(rng, [6, 8, 10, 12, 20, 100] as const);
    const habillage = pick(rng, ['coter', 'prix'] as const);

    const reponse = r2(esperanceLancerDe(faces));
    const fauxMilieu = r2(faces / 2);
    const bid = r2(reponse - 0.2);
    const ask = r2(reponse + 0.2);
    const estCoter = habillage === 'coter';

    const en = langue === 'en';
    const { f, eur } = formatters(langue);
    return {
      enonce: en
        ? estCoter
          ? `The jury slides a ${f(faces, 0)}-sided die across the table: "You win the face value in euros. Quote me this die." Before showing any bid/ask, you need the value.\n\n**What is the expected value of one roll, in euros?**`
          : `A game: you roll a ${f(faces, 0)}-sided die once and win the face value in euros.\n\n**What is the fair price of the game — the expected value of one roll, in euros?**`
        : estCoter
          ? `Le jury pousse un dé à ${f(faces, 0)} faces sur la table : « Vous gagnez la face en euros. Cotez-moi ce dé. » Avant d'afficher le moindre bid/ask, il vous faut la valeur.\n\n**Quelle est l'espérance d'un lancer, en euros ?**`
          : `Un jeu : vous lancez une fois un dé à ${f(faces, 0)} faces et gagnez la face en euros.\n\n**Quel est le prix équitable du jeu — l'espérance d'un lancer, en euros ?**`,
      reponse,
      tolerance: 0.01,
      unite: '€',
      etapes: [
        {
          titre: en ? 'Symmetry does the work' : 'La symétrie fait le travail',
          contenu: en
            ? `The faces 1 to ${f(faces, 0)} are equally likely, so the mean is the midpoint of the FIRST and LAST face: $E = (1 + ${f(faces, 0)})/2$ = **${eur(reponse)}**. No sum of ${f(faces, 0)} terms needed — pair the extremes (1 with ${f(faces, 0)}, 2 with ${f(faces - 1, 0)}…): every pair averages the same ${f(reponse, 2)}.`
            : `Les faces 1 à ${f(faces, 0)} sont équiprobables, donc la moyenne est le milieu de la PREMIÈRE et de la DERNIÈRE face : $E = (1 + ${f(faces, 0)})/2$ = **${eur(reponse)}**. Aucune somme de ${f(faces, 0)} termes à faire — appariez les extrêmes (1 avec ${f(faces, 0)}, 2 avec ${f(faces - 1, 0)}…) : chaque paire a la même moyenne, ${f(reponse, 2)}.`,
        },
        {
          titre: en ? 'The mental shortcut' : 'Le raccourci mental',
          contenu: en
            ? `Out loud: "half of ${f(faces, 0)}, plus a half" — $${f(faces, 0)}/2 + 0{,}5 = ${f(reponse, 2)}$. The anchors to have in cache: E[d6] = 3.5, E[d100] = 50.5. The +0.5 exists because the faces start at 1, not at 0 — that half-point is exactly what the classic error forgets.`
            : `À voix haute : « la moitié de ${f(faces, 0)}, plus une demie » — $${f(faces, 0)}/2 + 0{,}5 = ${f(reponse, 2)}$. Les ancres à garder en mémoire vive : E[d6] = 3,5, E[d100] = 50,5. Le +0,5 existe parce que les faces commencent à 1, pas à 0 — cette demi-unité est exactement ce que l'erreur classique oublie.`,
        },
        {
          titre: en ? 'What the number is for' : 'À quoi sert le chiffre',
          contenu: en
            ? `This E is the anchor of everything that follows in a market game: a fair entry price of ${eur(reponse)}, and a quote built symmetrically around it — say ${f(bid, 2)} / ${f(ask, 2)} — whose width pays for your risk (module 1: the market maker lives off the spread). The non-negotiable reflex of chapter 5: compute E BEFORE opening your mouth; a price announced before the calculation is a random quote, and no desk forgives that.`
            : `Cette espérance est l'ancre de toute la suite d'un jeu de marché : un prix d'entrée équitable de ${eur(reponse)}, et une cotation symétrique autour — par exemple ${f(bid, 2)} / ${f(ask, 2)} — dont la largeur rémunère votre risque (module 1 : le market maker vit de la fourchette). Le réflexe non négociable du chapitre 5 : calculer E AVANT d'ouvrir la bouche ; un prix annoncé avant le calcul est une cote au hasard, et aucun desk ne le pardonne.`,
        },
      ],
      pieges: [
        en
          ? `Reading the "middle of the faces" too fast: ${f(faces, 0)}/2 = ${eur(fauxMilieu)} instead of ${eur(reponse)}. The faces run from 1 to ${f(faces, 0)}, not from 0 — the true midpoint is (1 + ${f(faces, 0)})/2. Half a euro of error on a d6 quote is the entire margin of your bid/ask.`
          : `Lire le « milieu des faces » trop vite : ${f(faces, 0)}/2 = ${eur(fauxMilieu)} au lieu de ${eur(reponse)}. Les faces vont de 1 à ${f(faces, 0)}, pas de 0 — le vrai milieu est (1 + ${f(faces, 0)})/2. Un demi-euro d'erreur sur la cote d'un d6, c'est toute la marge de votre bid/ask.`,
        en
          ? `Quoting before computing: announcing a bid/ask and then reaching for E disqualifies you — you priced at random. The sequence is E first, in silence, then two prices around it, then requote when the flow talks (adverse selection, module 1).`
          : `Coter avant de calculer : annoncer un bid/ask puis chercher E disqualifie — vous avez pricé au hasard. La séquence : E d'abord, en silence, puis deux prix autour, puis requoter quand le flux parle (sélection adverse, module 1).`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 3. La cote équitable (N1)
// ---------------------------------------------------------------------------
export const genCoteEquitable: ExerciseGenerator = {
  id: 'm13-ex-03',
  moduleId: M13,
  titre: 'La cote équitable',
  titreEn: 'Fair odds',
  difficulte: 1,
  // Tirages (ordre strict) : 1. proba = pick([5, 10, 20, 25, 40, 50]) — des
  // probabilités dont l'inverse tombe juste de tête · 2. habillage =
  // pick(['jury', 'bookmaker']).
  // Réponse = coteEquitable(proba) = 100/p, « pour 1 » (mise comprise).
  // L'ancre du ch5 : 25 % ⇒ cote 4. Le faux « gain net » (100/p − 1) est
  // recalculé dans les pièges ; la vérification passe par esperanceJeu.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const proba = pick(rng, [5, 10, 20, 25, 40, 50] as const);
    const habillage = pick(rng, ['jury', 'bookmaker'] as const);

    const reponse = r2(coteEquitable(proba));
    const fauxNet = r2(reponse - 1);
    const verifEsperance = r2(esperanceJeu([proba], [reponse]));
    const estJury = habillage === 'jury';

    const en = langue === 'en';
    const { f, pct } = formatters(langue);
    return {
      enonce: en
        ? estJury
          ? `The jury offers you a bet on an event with a ${pct(proba, 0)} probability of happening. Odds are quoted "to 1": you collect the odds (stake included) per 1 staked if the event occurs, nothing otherwise.\n\n**What odds make the bet fair (zero expected value)?**`
          : `A bookmaker wants to price an event that occurs with probability ${pct(proba, 0)}. Odds are quoted "to 1": the winner collects the odds, stake included, per 1 staked.\n\n**What are the fair odds — the quote at which neither side has an edge?**`
        : estJury
          ? `Le jury vous propose un pari sur un événement qui a ${pct(proba, 0)} de chances de se produire. La cote s'entend « pour 1 » : vous touchez la cote (mise comprise) pour 1 misé si l'événement arrive, rien sinon.\n\n**Quelle cote rend le pari équitable (espérance nulle) ?**`
          : `Un bookmaker doit coter un événement qui se produit avec probabilité ${pct(proba, 0)}. La cote s'entend « pour 1 » : le gagnant touche la cote, mise comprise, pour 1 misé.\n\n**Quelle est la cote équitable — celle à laquelle personne n'a d'edge ?**`,
      reponse,
      tolerance: 0.01,
      unite: en ? 'to 1' : 'pour 1',
      etapes: [
        {
          titre: en ? 'Invert the probability' : 'Inverser la probabilité',
          contenu: en
            ? `Fair odds are the inverse of the probability: $\\text{odds} = 100/p = 100/${f(proba, 0)}$ = **${f(reponse, 2)} to 1**. Chapter 5's anchor: winning at 25% deserves odds of 4; a 6 on a die (16.7%) deserves odds of 6. Rare event, high odds — the price of a bet IS a probability, written upside down.`
            : `La cote équitable est l'inverse de la probabilité : $\\text{cote} = 100/p = 100/${f(proba, 0)}$ = **${f(reponse, 2)} pour 1**. L'ancre du chapitre 5 : gagner à 25 % mérite une cote de 4 ; un 6 sur un dé (16,7 %) mérite une cote de 6. Événement rare, cote haute — le prix d'un pari EST une probabilité, écrite à l'envers.`,
        },
        {
          titre: en ? 'Check it with the expectation' : 'Vérifier par l\'espérance',
          contenu: en
            ? `Per 1 staked: with probability ${pct(proba, 0)} you collect ${f(reponse, 2)}, otherwise 0 — expected payout $= ${f(proba, 0)}\\,\\% × ${f(reponse, 2)}$ = **${f(verifEsperance, 2)}**, exactly the 1 you staked. Zero expected profit: that is what "fair" means. Any odds ABOVE ${f(reponse, 2)} hand the edge to the bettor, below to the house.`
            : `Pour 1 misé : avec probabilité ${pct(proba, 0)} vous touchez ${f(reponse, 2)}, sinon 0 — encaissement espéré $= ${f(proba, 0)}\\,\\% × ${f(reponse, 2)}$ = **${f(verifEsperance, 2)}**, exactement le 1 misé. Profit espéré nul : c'est la définition d'« équitable ». Toute cote AU-DESSUS de ${f(reponse, 2)} donne l'edge au parieur, en dessous à la maison.`,
        },
        {
          titre: en ? 'The reading that matters: the inverse' : 'La lecture qui compte : l\'inverse',
          contenu: en
            ? `The most useful direction is the reverse one: the implied probability of quoted odds is 1/odds (exercise 12 exploits it). Tell the jury you already know this gymnastics: extracting a probability from a price is EXACTLY the implied default probability of a credit spread in module 5 — the price contains the probability; you just invert it.`
            : `Le sens le plus utile est le sens inverse : la probabilité implicite d'une cote affichée vaut 1/cote (l'exercice 12 l'exploite). Dites au jury que cette gymnastique vous est déjà familière : extraire une probabilité d'un prix, c'est EXACTEMENT la PD implicite d'un spread de crédit au module 5 — le prix contient la probabilité, il suffit de l'inverser.`,
        },
      ],
      pieges: [
        en
          ? `Confusing "to 1" with the NET gain: fair NET odds would be $100/${f(proba, 0)} - 1 = ${f(fauxNet, 2)}$, because the collected ${f(reponse, 2)} includes your stake. Always state the convention before answering — a desk that mixes gross and net payout quotes is a desk that loses money silently.`
          : `Confondre « pour 1 » et gain NET : la cote nette équitable vaudrait $100/${f(proba, 0)} - 1 = ${f(fauxNet, 2)}$, parce que les ${f(reponse, 2)} touchés incluent la mise. Énoncez la convention avant de répondre — un desk qui mélange encaissement brut et gain net perd de l'argent en silence.`,
        en
          ? `Answering the probability itself, or its complement — the question asks for a PRICE. Probability and odds live on inverse scales: the rarer the event (${pct(proba, 0)} here), the LARGER the fair odds (${f(reponse, 2)}).`
          : `Répondre la probabilité elle-même, ou son complément — la question demande un PRIX. Probabilité et cote vivent sur des échelles inverses : plus l'événement est rare (${pct(proba, 0)} ici), plus la cote équitable est GRANDE (${f(reponse, 2)}).`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 4. La règle de 72 face au calcul exact (N2)
// ---------------------------------------------------------------------------
export const genErreurRegle72: ExerciseGenerator = {
  id: 'm13-ex-04',
  moduleId: M13,
  titre: 'La règle de 72 face au calcul exact',
  titreEn: 'The rule of 72 versus the exact answer',
  difficulte: 2,
  // Tirages (ordre strict) : 1. taux = pick([2, 3, 4, 6, 8, 9, 12]) ·
  // 2. habillage = pick(['jury', 'risque']).
  // Chaîné : approx = regleDe72(taux) → exact = anneesDoublementExactes(taux)
  // → réponse = erreurRelativePct(approx, exact), SIGNÉE (positive = la règle
  // surestime). Ancres : −0,07 % à 8 %, +2,85 % à 2 %. Tolérance ABSOLUE de
  // 0,05 point : une tolérance relative n'aurait aucun sens sur une réponse
  // qui frôle zéro à 8 %.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const taux = pick(rng, [2, 3, 4, 6, 8, 9, 12] as const);
    const habillage = pick(rng, ['jury', 'risque'] as const);

    const approx = r2(regleDe72(taux));
    const exactBrut = anneesDoublementExactes(taux);
    const exact = r2(exactBrut);
    const reponse = r2(erreurRelativePct(regleDe72(taux), exactBrut));
    const ecartAnnees = r2(approx - exact);
    const estJury = habillage === 'jury';

    const en = langue === 'en';
    const { f, pct } = formatters(langue);
    return {
      enonce: en
        ? estJury
          ? `You just answered "72/${f(taux, 0)} = ${f(approx, 2)} years" to a doubling question at ${pct(taux, 0)}. The jury follows up: "And how wrong is your rule?"\n\n**What is the relative error of the rule of 72 at ${pct(taux, 0)}, in % (signed: positive if the rule overstates the exact doubling time)?**`
          : `Before quoting the rule of 72 in front of a risk manager, you want its error bar at ${pct(taux, 0)} (annual compounding).\n\n**What is the relative error of the rule of 72 at ${pct(taux, 0)}, in % (signed: positive if the rule overstates the exact doubling time)?**`
        : estJury
          ? `Vous venez de répondre « 72/${f(taux, 0)} = ${f(approx, 2)} ans » à une question de doublement à ${pct(taux, 0)}. Le jury enchaîne : « Et de combien votre règle se trompe-t-elle ? »\n\n**Quelle est l'erreur relative de la règle de 72 à ${pct(taux, 0)}, en % (signée : positive si la règle surestime le doublement exact) ?**`
          : `Avant de réciter la règle de 72 devant un risk manager, vous voulez sa barre d'erreur à ${pct(taux, 0)} (composition annuelle).\n\n**Quelle est l'erreur relative de la règle de 72 à ${pct(taux, 0)}, en % (signée : positive si la règle surestime le doublement exact) ?**`,
      reponse,
      tolerance: 0.05,
      toleranceMode: 'absolu',
      unite: '%',
      etapes: [
        {
          titre: en ? 'The approximation' : 'L\'approximation',
          contenu: en
            ? `Rule of 72: $72/${f(taux, 0)}$ = **${f(approx, 2)} years** — the three-second answer of exercise 1. Now we do what chapter 1 calls the fourth gesture, the rarest and best-paid one: bound the error of your own tool.`
            : `Règle de 72 : $72/${f(taux, 0)}$ = **${f(approx, 2)} ans** — la réponse en trois secondes de l'exercice 1. Reste à faire ce que le chapitre 1 appelle le quatrième geste, le plus rare et le mieux payé : borner l'erreur de son propre outil.`,
        },
        {
          titre: en ? 'The exact doubling time' : 'Le doublement exact',
          contenu: en
            ? `Discrete annual compounding: $n = \\ln 2 / \\ln(1 + ${f(taux, 0)}/100)$ = **${f(exact, 2)} years**. Nobody computes a logarithm out loud — what the jury expects is the CALIBRATION, known in advance: the rule was tuned near 8% (where the error is −0.07%), overstates at low rates, understates at high rates.`
            : `Composition discrète annuelle : $n = \\ln 2 / \\ln(1 + ${f(taux, 0)}/100)$ = **${f(exact, 2)} ans**. Personne ne calcule un logarithme à voix haute — ce que le jury attend, c'est la CALIBRATION, connue d'avance : la règle a été réglée vers 8 % (où l'erreur vaut −0,07 %), surestime aux taux bas, sous-estime aux taux hauts.`,
        },
        {
          titre: en ? 'The signed relative error' : 'L\'erreur relative signée',
          contenu: en
            ? `$\\text{error} = \\dfrac{\\text{approx} - \\text{exact}}{\\text{exact}} × 100 = \\dfrac{${f(approx, 2)} - ${f(exact, 2)}}{${f(exact, 2)}} × 100$ = **${pct(reponse, 2)}** (${f(ecartAnnees, 2)} years of gap). Reading: ${reponse > 0 ? 'positive, the rule OVERSTATES — at low rates it promises the doubling later than it comes' : 'negative, the rule UNDERSTATES — at this rate it promises the doubling slightly earlier than it comes'}. Under 2% of error between roughly 4 and 12%, never above 3.5% on 1-15%: an error bar you can recite, which is exactly what makes the tool usable.`
            : `$\\text{erreur} = \\dfrac{\\text{approx} - \\text{exact}}{\\text{exact}} × 100 = \\dfrac{${f(approx, 2)} - ${f(exact, 2)}}{${f(exact, 2)}} × 100$ = **${pct(reponse, 2)}** (soit ${f(ecartAnnees, 2)} an(s) d'écart). Lecture : ${reponse > 0 ? 'positive, la règle SURESTIME — aux taux bas, elle promet le doublement plus tard qu\'il n\'arrive' : 'négative, la règle SOUS-ESTIME — à ce taux, elle promet le doublement un peu plus tôt qu\'il n\'arrive'}. Moins de 2 % d'erreur entre 4 et 12 % environ, jamais plus de 3,5 % sur 1-15 % : une barre d'erreur récitable, et c'est exactement ce qui rend l'outil utilisable.`,
        },
      ],
      pieges: [
        en
          ? `Giving the ABSOLUTE error (${f(ecartAnnees, 2)} years) when the question asks for the RELATIVE one (${pct(reponse, 2)}): an error only means something scaled by what it measures — one year of gap is nothing on 36 years, enormous on 6.`
          : `Donner l'erreur ABSOLUE (${f(ecartAnnees, 2)} an(s)) quand la question demande la RELATIVE (${pct(reponse, 2)}) : une erreur n'a de sens que rapportée à ce qu'elle mesure — un an d'écart n'est rien sur 36 ans, énorme sur 6.`,
        en
          ? `Getting the sign backwards: the convention here is (approx − exact)/exact, positive when the rule overstates. At ${pct(taux, 0)} the rule ${reponse > 0 ? 'overstates' : 'understates'} — announcing the right magnitude with the wrong direction tells the jury you memorised the number without the mechanism.`
          : `Inverser le signe : la convention ici est (approx − exact)/exact, positive quand la règle surestime. À ${pct(taux, 0)} la règle ${reponse > 0 ? 'surestime' : 'sous-estime'} — annoncer la bonne amplitude avec le mauvais sens dit au jury qu'on a mémorisé le chiffre sans le mécanisme.`,
        en
          ? `Believing the error is negligible everywhere because it is at 8%: at 2% the rule is off by a full year (+2.85%). One tool, one domain — quoting 72/t outside 1-15% without a caveat is quoting a formula you do not own.`
          : `Croire l'erreur négligeable partout parce qu'elle l'est à 8 % : à 2 %, la règle se trompe d'une année pleine (+2,85 %). Un outil, un domaine — réciter 72/t hors de 1-15 % sans réserve, c'est réciter une formule qu'on ne possède pas.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 5. Au moins un succès (N2)
// ---------------------------------------------------------------------------
export const genAuMoinsUn: ExerciseGenerator = {
  id: 'm13-ex-05',
  moduleId: M13,
  titre: 'Au moins un succès',
  titreEn: 'At least one success',
  difficulte: 2,
  // Tirages (ordre strict) : 1. proba = pick([10, 20, 25, 50]) · 2. essais =
  // randInt(2, 6) · 3. habillage = pick(['correction', 'trade', 'alerte']).
  // Réponse = probaAuMoinsUnPct(p, n). LE piège du moule — le réflexe additif
  // n × p — est recalculé et chiffré (il peut dépasser 100 %, la formule
  // s'auto-dénonce). Ancre du ch3 : au moins un 6 en 4 lancers = 51,77 %
  // (pari de Méré), pas 66,7 %.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const proba = pick(rng, [10, 20, 25, 50] as const);
    const essais = randInt(rng, 2, 6);
    const habillage = pick(rng, ['correction', 'trade', 'alerte'] as const);

    const reponse = r2(probaAuMoinsUnPct(proba, essais));
    const survie = r2(100 - probaAuMoinsUnPct(proba, essais));
    const fauxAdditif = r2(essais * proba);
    const ecart = r2(fauxAdditif - reponse);
    const estCorrection = habillage === 'correction';
    const estTrade = habillage === 'trade';

    const en = langue === 'en';
    const { f, pct } = formatters(langue);
    return {
      enonce: en
        ? estCorrection
          ? `Each year, independently, there is a ${pct(proba, 0)} probability that the equity market suffers a correction of more than 10%.\n\n**What is the probability, in %, of at least one such correction over ${f(essais, 0)} years?**`
          : estTrade
            ? `Each of your ${f(essais, 0)} independent trades has a ${pct(proba, 0)} probability of hitting its stop-loss.\n\n**What is the probability, in %, that at least one of them gets stopped out?**`
            : `A monitoring system fires a false alarm on any given day with probability ${pct(proba, 0)}, independently from day to day.\n\n**What is the probability, in %, of at least one false alarm over ${f(essais, 0)} days?**`
        : estCorrection
          ? `Chaque année, indépendamment, le marché actions a ${pct(proba, 0)} de chances de subir une correction de plus de 10 %.\n\n**Quelle est la probabilité, en %, d'au moins une correction sur ${f(essais, 0)} ans ?**`
          : estTrade
            ? `Chacun de vos ${f(essais, 0)} trades indépendants a ${pct(proba, 0)} de chances de toucher son stop-loss.\n\n**Quelle est la probabilité, en %, qu'au moins l'un d'eux soit stoppé ?**`
            : `Un système de surveillance déclenche une fausse alerte un jour donné avec probabilité ${pct(proba, 0)}, indépendamment d'un jour à l'autre.\n\n**Quelle est la probabilité, en %, d'au moins une fausse alerte sur ${f(essais, 0)} jours ?**`,
      reponse,
      tolerance: 0.01,
      unite: '%',
      etapes: [
        {
          titre: en ? 'THE reflex: go through the complement' : 'LE réflexe : passer par le complémentaire',
          contenu: en
            ? `"At least one" is a nightmare to count directly (one, or two, or three…) and a one-liner through its complement: "at least one success" = 1 − "zero successes". The entire skill is recognising the trigger phrase — whenever you hear "at least one", think complement before you think anything else.`
            : `« Au moins un » est un cauchemar à compter directement (un, ou deux, ou trois…) et une ligne par son complémentaire : « au moins un succès » = 1 − « zéro succès ». Toute la compétence tient dans le déclencheur — dès que vous entendez « au moins un », pensez complémentaire avant de penser à quoi que ce soit d'autre.`,
        },
        {
          titre: en ? 'Compound the failures' : 'Composer les échecs',
          contenu: en
            ? `Zero successes in ${f(essais, 0)} independent trials: $(1 - ${f(proba, 0)}\\,\\%)^{${f(essais, 0)}} = (${f(r2((100 - proba) / 100), 2)})^{${f(essais, 0)}}$ = **${pct(survie, 2)}**. Mentally: multiply ${f(r2(1 - proba / 100), 2)} by itself ${f(essais, 0)} times, rounding as you go — the intelligent approximation is the skill, announce "roughly ${f(Math.round(survie), 0)}" and refine.`
            : `Zéro succès en ${f(essais, 0)} essais indépendants : $(1 - ${f(proba, 0)}\\,\\%)^{${f(essais, 0)}} = (${f(r2((100 - proba) / 100), 2)})^{${f(essais, 0)}}$ = **${pct(survie, 2)}**. De tête : multiplier ${f(r2(1 - proba / 100), 2)} par lui-même ${f(essais, 0)} fois, en arrondissant en route — l'à-peu-près intelligent est la compétence : annoncez « environ ${f(Math.round(survie), 0)} » puis affinez.`,
        },
        {
          titre: en ? 'Take the complement — and size the trap' : 'Prendre le complément — et chiffrer le piège',
          contenu: en
            ? `$P(\\text{at least one}) = 100 - ${f(survie, 2)}$ = **${pct(reponse, 2)}**. The additive reflex says $${f(essais, 0)} × ${f(proba, 0)} = ${pct(fauxAdditif, 0)}$ — ${f(ecart, 2)} points too high${fauxAdditif >= 100 ? ', and already at or beyond certainty, which is absurd' : ''}: successes do not add, they compound, exactly like cumulative default in module 5 (you must have survived to fail later). De Méré's anchor: at least one 6 in 4 rolls = 51.77%, not 4/6 = 66.7%.`
            : `$P(\\text{au moins un}) = 100 - ${f(survie, 2)}$ = **${pct(reponse, 2)}**. Le réflexe additif dit $${f(essais, 0)} × ${f(proba, 0)} = ${pct(fauxAdditif, 0)}$ — ${f(ecart, 2)} points de trop${fauxAdditif >= 100 ? ', et déjà au niveau ou au-delà de la certitude, ce qui est absurde' : ''} : les succès ne s'additionnent pas, ils se composent, exactement comme le défaut cumulé du module 5 (il faut avoir survécu pour échouer plus tard). L'ancre de Méré : au moins un 6 en 4 lancers = 51,77 %, pas 4/6 = 66,7 %.`,
        },
      ],
      pieges: [
        en
          ? `THE trap: n × p = ${pct(fauxAdditif, 0)} instead of ${pct(reponse, 2)}. The formula denounces itself — push the horizon and it sails past 100%. Probabilities of independent events never add; their COMPLEMENTS multiply.`
          : `LE piège : n × p = ${pct(fauxAdditif, 0)} au lieu de ${pct(reponse, 2)}. La formule s'auto-dénonce — allongez l'horizon et elle dépasse 100 %. Les probabilités d'événements indépendants ne s'additionnent jamais ; ce sont leurs COMPLÉMENTS qui se multiplient.`,
        en
          ? `Computing "exactly one" instead of "at least one": the question includes the scenarios with two, three… successes. The complement handles them all in a single subtraction — that is precisely why the reflex is worth installing.`
          : `Calculer « exactement un » au lieu d'« au moins un » : la question inclut les scénarios à deux, trois… succès. Le complémentaire les traite tous en une seule soustraction — c'est précisément pour cela que le réflexe vaut d'être installé.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 6. Le paradoxe des anniversaires (N2)
// ---------------------------------------------------------------------------
export const genAnniversaires: ExerciseGenerator = {
  id: 'm13-ex-06',
  moduleId: M13,
  titre: 'Le paradoxe des anniversaires',
  titreEn: 'The birthday paradox',
  difficulte: 2,
  // Tirages (ordre strict) : 1. personnes = pick([15, 20, 23, 30, 40, 50]) ·
  // 2. habillage = pick(['salle', 'promo']).
  // Réponse = probaAnniversairesPct(n) — 365 jours équiprobables. Ancres du
  // ch3 : 23 ⇒ 50,73 %, 50 ⇒ 97,04 %, 70 ⇒ 99,92 %. Le chemin mental passe
  // par les PAIRES, n(n − 1)/2 — l'intuition rate parce qu'elle compte les
  // personnes (n) au lieu des collisions possibles (en n²). Tolérance élargie
  // à 2 % : c'est l'ordre de grandeur qui se joue à l'oral.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const personnes = pick(rng, [15, 20, 23, 30, 40, 50] as const);
    const habillage = pick(rng, ['salle', 'promo'] as const);

    const reponse = r2(probaAnniversairesPct(personnes));
    const paires = (personnes * (personnes - 1)) / 2;
    const fauxIntuitif = r2((100 * personnes) / 365);
    const estSalle = habillage === 'salle';

    const en = langue === 'en';
    const { f, pct } = formatters(langue);
    return {
      enonce: en
        ? estSalle
          ? `The jury looks around the interview room: "${f(personnes, 0)} people in here. What is the probability that at least two of them share a birthday?" (365 equally likely days, no leap year.)\n\n**Give the probability, in %.**`
          : `A graduating class has ${f(personnes, 0)} students (365 equally likely birthdays, no leap year).\n\n**What is the probability, in %, that at least two students share a birthday?**`
        : estSalle
          ? `Le jury balaie la salle du regard : « ${f(personnes, 0)} personnes ici. Quelle est la probabilité qu'au moins deux d'entre elles partagent leur anniversaire ? » (365 jours équiprobables, pas d'année bissextile.)\n\n**Donnez la probabilité, en %.**`
          : `Une promotion compte ${f(personnes, 0)} étudiants (365 jours d'anniversaire équiprobables, pas d'année bissextile).\n\n**Quelle est la probabilité, en %, qu'au moins deux étudiants partagent leur anniversaire ?**`,
      reponse,
      tolerance: 0.02,
      unite: '%',
      etapes: [
        {
          titre: en ? 'Count the pairs, not the people' : 'Compter les paires, pas les personnes',
          contenu: en
            ? `Intuition fails because it counts ${f(personnes, 0)} people against 365 days. The collision, though, happens between PAIRS: $C(${f(personnes, 0)}, 2) = ${f(personnes, 0)} × ${f(personnes - 1, 0)} / 2$ = **${f(paires, 0)} pairs**, each a chance in 365 of a match. The number of possible collisions grows in n², not in n — that is the entire paradox, and the one sentence the jury wants to hear.`
            : `L'intuition rate parce qu'elle compare ${f(personnes, 0)} personnes à 365 jours. Or la collision se joue entre PAIRES : $C(${f(personnes, 0)}, 2) = ${f(personnes, 0)} × ${f(personnes - 1, 0)} / 2$ = **${f(paires, 0)} paires**, chacune une chance sur 365 de coïncider. Le nombre de collisions possibles croît en n², pas en n — c'est tout le paradoxe, et LA phrase que le jury veut entendre.`,
        },
        {
          titre: en ? 'The exact route: the complement again' : 'Le chemin exact : encore le complémentaire',
          contenu: en
            ? `"At least two share" = 1 − "all ${f(personnes, 0)} birthdays distinct". Fill the room person by person: the second must avoid 1 date (364/365), the third 2 dates (363/365)… the product of these survival fractions gives $P(\\text{all distinct}) = ${pct(r2(100 - reponse), 2)}$, hence $P$ = **${pct(reponse, 2)}**. Same complement reflex as exercise 5 — "at least one collision" is counted through its opposite.`
            : `« Au moins deux partagent » = 1 − « les ${f(personnes, 0)} anniversaires sont tous distincts ». Remplissez la salle personne par personne : la deuxième doit éviter 1 date (364/365), la troisième 2 dates (363/365)… le produit de ces fractions de survie donne $P(\\text{tous distincts}) = ${pct(r2(100 - reponse), 2)}$, donc $P$ = **${pct(reponse, 2)}**. Même réflexe complémentaire qu'à l'exercice 5 — « au moins une collision » se compte par son contraire.`,
        },
        {
          titre: en ? 'The anchors to recite' : 'Les ancres à réciter',
          contenu: en
            ? `Nobody unrolls the product out loud: you recite the anchors and interpolate. 23 people ⇒ 50.73% (the famous tipping point), 50 ⇒ 97.04%, 70 ⇒ 99.92%. With ${f(personnes, 0)} people, announce "about ${f(Math.round(reponse), 0)}%" with the pair count as justification — the mechanism plus one anchor beats a decimal recited without understanding.`
            : `Personne ne déroule le produit à voix haute : on récite les ancres et on interpole. 23 personnes ⇒ 50,73 % (le point de bascule célèbre), 50 ⇒ 97,04 %, 70 ⇒ 99,92 %. Avec ${f(personnes, 0)} personnes, annoncez « environ ${f(Math.round(reponse), 0)} % » avec le compte des paires en justification — le mécanisme plus une ancre bat une décimale récitée sans comprendre.`,
        },
      ],
      pieges: [
        en
          ? `The linear intuition n/365 = ${pct(fauxIntuitif, 1)} instead of ${pct(reponse, 2)}: it counts people when the collisions live among the ${f(paires, 0)} pairs. That is why the 50% threshold arrives at 23 people already — far earlier than intuition expects.`
          : `L'intuition linéaire n/365 = ${pct(fauxIntuitif, 1)} au lieu de ${pct(reponse, 2)} : elle compte les personnes quand les collisions vivent parmi les ${f(paires, 0)} paires. C'est pour cela que le seuil des 50 % arrive dès 23 personnes — bien plus tôt que l'intuition ne l'attend.`,
        en
          ? `Confusing with "someone shares MY birthday": that one is a different, much rarer event (you need 253 people to pass 50%), because it pins one date instead of letting all ${f(paires, 0)} pairs collide. State which question you are answering before computing.`
          : `Confondre avec « quelqu'un partage MON anniversaire » : c'est un autre événement, bien plus rare (il faut 253 personnes pour passer 50 %), parce qu'il fige une date au lieu de laisser les ${f(paires, 0)} paires entrer en collision. Dites quelle question vous traitez avant de calculer.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 7. Bayes par la méthode des 10 000 (N2)
// ---------------------------------------------------------------------------
export const genBayes: ExerciseGenerator = {
  id: 'm13-ex-07',
  moduleId: M13,
  titre: 'Bayes par la méthode des 10 000',
  titreEn: 'Bayes by the 10,000 method',
  difficulte: 2,
  // Tirages (ordre strict) : 1. prevalence = pick([1, 2, 5]) · 2. sensibilite =
  // pick([90, 95, 99]) · 3. fauxPositifsPct = pick([5, 10]) · 4. habillage =
  // pick(['test', 'signal', 'fraude']). Ces valeurs garantissent des EFFECTIFS
  // ENTIERS sur 10 000 — la méthode d'oral du ch3, déroulée telle quelle dans
  // le corrigé. Réponse = bayesAPosterioriPct. L'ancre absolue : (1 %, 99 %,
  // 5 %) ⇒ 16,67 % — les faux positifs noient les vrais quand la prévalence
  // est faible. Le faux du piège (répondre la sensibilité) est chiffré.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const prevalence = pick(rng, [1, 2, 5] as const);
    const sensibilite = pick(rng, [90, 95, 99] as const);
    const fauxPositifsPct = pick(rng, [5, 10] as const);
    const habillage = pick(rng, ['test', 'signal', 'fraude'] as const);

    const reponse = r2(bayesAPosterioriPct(prevalence, sensibilite, fauxPositifsPct));
    const positifsReels = (10000 * prevalence) / 100;
    const detectes = (positifsReels * sensibilite) / 100;
    const sains = 10000 - positifsReels;
    const fauxDetectes = (sains * fauxPositifsPct) / 100;
    const totalPositifs = detectes + fauxDetectes;
    const estTest = habillage === 'test';
    const estSignal = habillage === 'signal';

    const en = langue === 'en';
    const { f, pct } = formatters(langue);
    return {
      enonce: en
        ? estTest
          ? `A disease affects ${pct(prevalence, 0)} of the population. A test detects it in ${pct(sensibilite, 0)} of sick patients, but also returns a (false) positive for ${pct(fauxPositifsPct, 0)} of healthy ones. Your test comes back positive.\n\n**What is the probability, in %, that you actually have the disease?**`
          : estSignal
            ? `A crisis indicator flags ${pct(sensibilite, 0)} of the years that precede a crash; but it also fires, wrongly, in ${pct(fauxPositifsPct, 0)} of quiet years. Crashes follow ${pct(prevalence, 0)} of years. The indicator just fired.\n\n**What is the probability, in %, that a crash is actually coming?**`
            : `${pct(prevalence, 0)} of transactions are fraudulent. Your detection model catches ${pct(sensibilite, 0)} of frauds but also flags ${pct(fauxPositifsPct, 0)} of legitimate transactions. A transaction gets flagged.\n\n**What is the probability, in %, that it is actually fraudulent?**`
        : estTest
          ? `Une maladie touche ${pct(prevalence, 0)} de la population. Un test la détecte chez ${pct(sensibilite, 0)} des malades, mais rend aussi un (faux) positif chez ${pct(fauxPositifsPct, 0)} des personnes saines. Votre test revient positif.\n\n**Quelle est la probabilité, en %, que vous soyez réellement malade ?**`
          : estSignal
            ? `Un indicateur de crise signale ${pct(sensibilite, 0)} des années qui précèdent un krach ; mais il se déclenche aussi, à tort, dans ${pct(fauxPositifsPct, 0)} des années calmes. Les krachs suivent ${pct(prevalence, 0)} des années. L'indicateur vient de se déclencher.\n\n**Quelle est la probabilité, en %, qu'un krach arrive vraiment ?**`
            : `${pct(prevalence, 0)} des transactions sont frauduleuses. Votre modèle de détection attrape ${pct(sensibilite, 0)} des fraudes mais signale aussi ${pct(fauxPositifsPct, 0)} des transactions légitimes. Une transaction vient d'être signalée.\n\n**Quelle est la probabilité, en %, qu'elle soit réellement frauduleuse ?**`,
      reponse,
      tolerance: 0.01,
      unite: '%',
      etapes: [
        {
          titre: en ? 'Lay out 10,000 cases' : 'Poser 10 000 cas',
          contenu: en
            ? `Forget the formula; take a population of 10,000 — the oral method that makes Bayes impossible to get wrong. Truly positive: $10\\,000 × ${f(prevalence, 0)}\\,\\%$ = **${f(positifsReels, 0)}**. The rest, $10\\,000 - ${f(positifsReels, 0)}$ = **${f(sains, 0)}**, are negative. The base rate is now a headcount, not an abstraction — and headcounts do not get forgotten.`
            : `Oubliez la formule ; prenez une population de 10 000 — la méthode d'oral qui rend Bayes impossible à rater. Réellement positifs : $10\\,000 × ${f(prevalence, 0)}\\,\\%$ = **${f(positifsReels, 0)}**. Le reste, $10\\,000 - ${f(positifsReels, 0)}$ = **${f(sains, 0)}**, est négatif. La prévalence est devenue un effectif, pas une abstraction — et un effectif ne s'oublie pas.`,
        },
        {
          titre: en ? 'Count the two kinds of positives' : 'Compter les deux familles de positifs',
          contenu: en
            ? `Among the ${f(positifsReels, 0)} true cases, the signal catches $${f(positifsReels, 0)} × ${f(sensibilite, 0)}\\,\\%$ = **${f(detectes, 0)}** (true positives). Among the ${f(sains, 0)} others, it fires wrongly on $${f(sains, 0)} × ${f(fauxPositifsPct, 0)}\\,\\%$ = **${f(fauxDetectes, 0)}** (false positives). Total alarms: $${f(detectes, 0)} + ${f(fauxDetectes, 0)} = ${f(totalPositifs, 0)}$ — and look at the two camps: the false positives ${fauxDetectes > detectes ? 'OUTNUMBER the real ones' : 'rival the real ones'}, because they are drawn from the huge healthy pool.`
            : `Parmi les ${f(positifsReels, 0)} vrais cas, le signal en attrape $${f(positifsReels, 0)} × ${f(sensibilite, 0)}\\,\\%$ = **${f(detectes, 0)}** (vrais positifs). Parmi les ${f(sains, 0)} autres, il se déclenche à tort sur $${f(sains, 0)} × ${f(fauxPositifsPct, 0)}\\,\\%$ = **${f(fauxDetectes, 0)}** (faux positifs). Total des alarmes : $${f(detectes, 0)} + ${f(fauxDetectes, 0)} = ${f(totalPositifs, 0)}$ — et regardez les deux camps : les faux positifs ${fauxDetectes > detectes ? 'DÉPASSENT les vrais' : 'rivalisent avec les vrais'}, parce qu'ils sont tirés de l'immense population saine.`,
        },
        {
          titre: en ? 'The ratio — and the lesson' : 'Le ratio — et la leçon',
          contenu: en
            ? `$P(\\text{real} \\mid \\text{positive}) = \\dfrac{${f(detectes, 0)}}{${f(totalPositifs, 0)}}$ = **${pct(reponse, 2)}**. The absolute anchor: prevalence 1%, sensitivity 99%, false positives 5% ⇒ 16.67% — one alarm in six is real. When the event is rare, the false positives DROWN the true ones: the exact structure of a rare-crisis indicator (modules 10 and 11) — a "reliable" signal on a rare event is mostly noise.`
            : `$P(\\text{réel} \\mid \\text{positif}) = \\dfrac{${f(detectes, 0)}}{${f(totalPositifs, 0)}}$ = **${pct(reponse, 2)}**. L'ancre absolue : prévalence 1 %, sensibilité 99 %, faux positifs 5 % ⇒ 16,67 % — une alarme sur six est réelle. Quand l'événement est rare, les faux positifs NOIENT les vrais : la structure exacte d'un indicateur de crise rare (modules 10 et 11) — un signal « fiable » sur un événement rare est surtout du bruit.`,
        },
      ],
      pieges: [
        en
          ? `Answering the sensitivity — ${pct(sensibilite, 0)} — instead of ${pct(reponse, 2)}: that is P(positive | real), the question asks P(real | positive). Inverting a conditional without paying the base rate is THE interview trap; the 10,000 method makes the inversion physically visible.`
          : `Répondre la sensibilité — ${pct(sensibilite, 0)} — au lieu de ${pct(reponse, 2)} : c'est P(positif | réel), la question demande P(réel | positif). Inverser une conditionnelle sans payer la prévalence est LE piège d'entretien ; la méthode des 10 000 rend l'inversion physiquement visible.`,
        en
          ? `Neglecting the base rate: with only ${f(positifsReels, 0)} real cases in 10,000, even a small false-positive rate applied to ${f(sains, 0)} people produces ${f(fauxDetectes, 0)} false alarms — the healthy pool is where the alarms come from. Forget the prevalence and every calculation that follows is fiction.`
          : `Négliger la prévalence : avec seulement ${f(positifsReels, 0)} vrais cas sur 10 000, même un petit taux de faux positifs appliqué à ${f(sains, 0)} personnes produit ${f(fauxDetectes, 0)} fausses alertes — c'est la population saine qui fabrique les alarmes. Oubliez la prévalence et tout le calcul qui suit est une fiction.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 8. Les combinaisons (N2)
// ---------------------------------------------------------------------------
export const genCombinaisons: ExerciseGenerator = {
  id: 'm13-ex-08',
  moduleId: M13,
  titre: 'Les combinaisons',
  titreEn: 'Combinations',
  difficulte: 2,
  // Tirages (ordre strict) : 1. habillage = pick(['cartes', 'equipe',
  // 'portefeuille']) · 2. nCartes = pick([32, 52]) · 3. kCartes = randInt(2, 3)
  // · 4. nEquipe = randInt(6, 12) · 5. kEquipe = randInt(2, 4) · 6. nPf =
  // randInt(10, 20) · 7. kPf = randInt(2, 5). Tous les tirages sont effectués
  // à chaque seed (invariant bilingue), n et k sont ensuite sélectionnés par
  // l'habillage — n couvre 6-52, k couvre 2-5. Réponse = combinaisons(n, k),
  // ENTIÈRE : tolérance absolue de 0,5 (on attend le compte exact). Le faux
  // « arrangements » (k! oublié) est recalculé dans les pièges. Ancre :
  // C(52, 5) = 2 598 960 mains de poker.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const habillage = pick(rng, ['cartes', 'equipe', 'portefeuille'] as const);
    const nCartes = pick(rng, [32, 52] as const);
    const kCartes = randInt(rng, 2, 3);
    const nEquipe = randInt(rng, 6, 12);
    const kEquipe = randInt(rng, 2, 4);
    const nPf = randInt(rng, 10, 20);
    const kPf = randInt(rng, 2, 5);

    const estCartes = habillage === 'cartes';
    const estEquipe = habillage === 'equipe';
    const n = estCartes ? nCartes : estEquipe ? nEquipe : nPf;
    const k = estCartes ? kCartes : estEquipe ? kEquipe : kPf;
    const reponse = combinaisons(n, k);
    let arrangements = 1;
    for (let i = 0; i < k; i++) arrangements *= n - i;
    let kFact = 1;
    for (let i = 2; i <= k; i++) kFact *= i;

    const en = langue === 'en';
    const { f } = formatters(langue);
    return {
      enonce: en
        ? estCartes
          ? `From a ${f(n, 0)}-card deck you draw ${f(k, 0)} cards, without caring about the order.\n\n**How many distinct hands of ${f(k, 0)} cards are there?**`
          : estEquipe
            ? `A desk of ${f(n, 0)} traders must send ${f(k, 0)} of them to cover the morning meeting — the order does not matter.\n\n**How many distinct groups of ${f(k, 0)} can be formed?**`
            : `From a universe of ${f(n, 0)} stocks, you build an equally-weighted portfolio holding exactly ${f(k, 0)} of them.\n\n**How many distinct portfolios can be formed?**`
        : estCartes
          ? `D'un jeu de ${f(n, 0)} cartes, vous tirez ${f(k, 0)} cartes, sans vous soucier de l'ordre.\n\n**Combien de mains distinctes de ${f(k, 0)} cartes existe-t-il ?**`
          : estEquipe
            ? `Un desk de ${f(n, 0)} traders doit en envoyer ${f(k, 0)} couvrir le morning meeting — l'ordre n'a pas d'importance.\n\n**Combien de groupes distincts de ${f(k, 0)} peut-on former ?**`
            : `Dans un univers de ${f(n, 0)} actions, vous construisez un portefeuille équipondéré qui en détient exactement ${f(k, 0)}.\n\n**Combien de portefeuilles distincts peut-on former ?**`,
      reponse,
      tolerance: 0.5,
      toleranceMode: 'absolu',
      unite: en ? 'combinations' : 'combinaisons',
      etapes: [
        {
          titre: en ? 'First, the ordered draws' : 'D\'abord, les tirages ordonnés',
          contenu: en
            ? `Choosing ${f(k, 0)} objects IN ORDER: ${f(n, 0)} choices for the first, ${f(n - 1, 0)} for the second… — the descending product $${f(n, 0)} × ${f(n - 1, 0)} × \\ldots$ (${f(k, 0)} factors) = **${f(arrangements, 0)}** ordered draws. That is the easy half of the count.`
            : `Choisir ${f(k, 0)} objets DANS L'ORDRE : ${f(n, 0)} choix pour le premier, ${f(n - 1, 0)} pour le deuxième… — le produit descendant $${f(n, 0)} × ${f(n - 1, 0)} × \\ldots$ (${f(k, 0)} facteurs) = **${f(arrangements, 0)}** tirages ordonnés. C'est la moitié facile du compte.`,
        },
        {
          titre: en ? 'Then kill the order' : 'Puis tuer l\'ordre',
          contenu: en
            ? `Each group of ${f(k, 0)} has been counted once per way of ordering it: $${f(k, 0)}! = ${f(kFact, 0)}$ times. So $C(${f(n, 0)}, ${f(k, 0)}) = ${f(arrangements, 0)} / ${f(kFact, 0)}$ = **${f(reponse, 0)}**. The mental-arithmetic version: SIMPLIFY before multiplying — divide the ${f(kFact, 0)} into the descending product factor by factor, and the numbers stay small all the way.`
            : `Chaque groupe de ${f(k, 0)} a été compté une fois par façon de l'ordonner : $${f(k, 0)}! = ${f(kFact, 0)}$ fois. Donc $C(${f(n, 0)}, ${f(k, 0)}) = ${f(arrangements, 0)} / ${f(kFact, 0)}$ = **${f(reponse, 0)}**. La version calcul mental : SIMPLIFIER avant de multiplier — absorbez le ${f(kFact, 0)} dans le produit descendant facteur par facteur, et les nombres restent petits jusqu'au bout.`,
        },
        {
          titre: en ? 'The anchor and the sanity check' : 'L\'ancre et le garde-fou',
          contenu: en
            ? `The anchor to have in cache: $C(52, 5) = 2\\,598\\,960$ poker hands — about 2.6 million. Sanity checks worth saying out loud: $C(n, 1) = n$, $C(n, n) = 1$, and $C(n, k) = C(n, n-k)$ (choosing the ${f(k, 0)} you take is choosing the ${f(n - k, 0)} you leave). A result that violates one of these has a lost factor somewhere.`
            : `L'ancre à garder en mémoire : $C(52, 5) = 2\\,598\\,960$ mains de poker — environ 2,6 millions. Les garde-fous à dire à voix haute : $C(n, 1) = n$, $C(n, n) = 1$, et $C(n, k) = C(n, n-k)$ (choisir les ${f(k, 0)} qu'on prend, c'est choisir les ${f(n - k, 0)} qu'on laisse). Un résultat qui viole l'un d'eux a perdu un facteur en route.`,
        },
      ],
      pieges: [
        en
          ? `Forgetting the k!: answering the ${f(arrangements, 0)} ORDERED draws instead of ${f(reponse, 0)} — a factor of ${f(kFact, 0)}. Ask the killer question before multiplying: does the order matter? Here it does not, so divide.`
          : `Oublier le k! : répondre les ${f(arrangements, 0)} tirages ORDONNÉS au lieu de ${f(reponse, 0)} — un facteur ${f(kFact, 0)}. Posez la question qui tue avant de multiplier : l'ordre compte-t-il ? Ici non, donc on divise.`,
        en
          ? `Computing $${f(n, 0)}^{${f(k, 0)}}$ — draws WITH replacement: the same card cannot be drawn twice. The descending product ${f(n, 0)} × ${f(n - 1, 0)} × … exists precisely because each draw removes an object from the pool.`
          : `Calculer $${f(n, 0)}^{${f(k, 0)}}$ — des tirages AVEC remise : la même carte ne peut pas sortir deux fois. Le produit descendant ${f(n, 0)} × ${f(n - 1, 0)} × … existe précisément parce que chaque tirage retire un objet du pool.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 9. La série consécutive (N2)
// ---------------------------------------------------------------------------
export const genSerieConsecutive: ExerciseGenerator = {
  id: 'm13-ex-09',
  moduleId: M13,
  titre: 'La série consécutive',
  titreEn: 'The consecutive streak',
  difficulte: 2,
  // Tirages (ordre strict) : 1. habillage = pick(['pile', 'trades']) ·
  // 2. pTrades = pick([60, 70, 80, 90]) · 3. essais = randInt(3, 6). Les deux
  // tirages de probabilité sont toujours effectués (invariant bilingue) ;
  // p = 50 pour l'habillage pile. Réponse = probaSerieConsecutivePct(p, n) —
  // l'ancre du ch3 : cinq piles d'affilée = 3,125 %. Le miroir du moule 5 :
  // ici on multiplie les SUCCÈS, là-bas on multipliait les échecs. Le faux
  // « au moins un » est recalculé dans les pièges.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const habillage = pick(rng, ['pile', 'trades'] as const);
    const pTrades = pick(rng, [60, 70, 80, 90] as const);
    const essais = randInt(rng, 3, 6);

    const estPile = habillage === 'pile';
    const proba = estPile ? 50 : pTrades;
    const reponse = r2(probaSerieConsecutivePct(proba, essais));
    const fauxAuMoinsUn = r2(probaAuMoinsUnPct(proba, essais));

    const en = langue === 'en';
    const { f, pct } = formatters(langue);
    return {
      enonce: en
        ? estPile
          ? `You flip a fair coin ${f(essais, 0)} times.\n\n**What is the probability, in %, of getting heads ${f(essais, 0)} times in a row?**`
          : `Each of your trades wins with probability ${pct(proba, 0)}, independently of the others.\n\n**What is the probability, in %, of a streak of ${f(essais, 0)} winning trades in a row?**`
        : estPile
          ? `Vous lancez une pièce équilibrée ${f(essais, 0)} fois.\n\n**Quelle est la probabilité, en %, d'obtenir ${f(essais, 0)} piles d'affilée ?**`
          : `Chacun de vos trades gagne avec probabilité ${pct(proba, 0)}, indépendamment des autres.\n\n**Quelle est la probabilité, en %, d'une série de ${f(essais, 0)} trades gagnants d'affilée ?**`,
      reponse,
      tolerance: 0.01,
      unite: '%',
      etapes: [
        {
          titre: en ? 'An intersection multiplies' : 'Une intersection se multiplie',
          contenu: en
            ? `"${f(essais, 0)} in a row" means success on trial 1 AND trial 2 AND … AND trial ${f(essais, 0)} — an intersection of independent events, so the probabilities MULTIPLY: $P = (${f(proba, 0)}\\,\\%)^{${f(essais, 0)}}$. No complement needed this time: the event itself is the clean product.`
            : `« ${f(essais, 0)} d'affilée » signifie succès à l'essai 1 ET à l'essai 2 ET … ET à l'essai ${f(essais, 0)} — une intersection d'événements indépendants, donc les probabilités se MULTIPLIENT : $P = (${f(proba, 0)}\\,\\%)^{${f(essais, 0)}}$. Pas besoin de complémentaire cette fois : l'événement lui-même est le produit propre.`,
        },
        {
          titre: en ? 'The mental path' : 'Le chemin mental',
          contenu: en
            ? `${estPile ? `At 50%, each extra flip HALVES the probability: 50, 25, 12.5… ${f(essais, 0)} halvings of 100% give` : `Multiply ${f(r2(proba / 100), 2)} by itself ${f(essais, 0)} times, rounding as you go (${f(r2(proba / 100), 2)} squared first, then build up):`} **${pct(reponse, 2)}**. Chapter 3's anchor: five heads in a row = 3.125% — about 3%, one chance in 32.`
            : `${estPile ? `À 50 %, chaque lancer supplémentaire DIVISE la probabilité par deux : 50, 25, 12,5… ${f(essais, 0)} divisions par deux de 100 % donnent` : `Multipliez ${f(r2(proba / 100), 2)} par lui-même ${f(essais, 0)} fois, en arrondissant en route (d'abord ${f(r2(proba / 100), 2)} au carré, puis on empile) :`} **${pct(reponse, 2)}**. L'ancre du chapitre 3 : cinq piles d'affilée = 3,125 % — environ 3 %, une chance sur 32.`,
        },
        {
          titre: en ? 'The mirror of "at least one"' : 'Le miroir du « au moins un »',
          contenu: en
            ? `This mould is the exact mirror of exercise 5: here the SUCCESSES multiply ($p^n$), there the FAILURES did ($(1-p)^n$, then complement). And keep the independence sentence ready for the jury: after ${f(essais - 1, 0)} successes, the probability of one more is still ${pct(proba, 0)} — the coin has no memory; the streak was improbable BEFORE it started, not after.`
            : `Ce moule est le miroir exact de l'exercice 5 : ici les SUCCÈS se multiplient ($p^n$), là-bas c'étaient les ÉCHECS ($(1-p)^n$, puis complément). Et gardez la phrase d'indépendance prête pour le jury : après ${f(essais - 1, 0)} succès, la probabilité d'un de plus vaut toujours ${pct(proba, 0)} — la pièce n'a pas de mémoire ; la série était improbable AVANT de commencer, pas après.`,
        },
      ],
      pieges: [
        en
          ? `Confusing the two families: "at least one success in ${f(essais, 0)} trials" gives ${pct(fauxAuMoinsUn, 2)}, a completely different number from the streak's ${pct(reponse, 2)}. Before computing, say which event you hold: ALL successes (product of p) or AT LEAST one (complement of the product of 1 − p).`
          : `Confondre les deux familles : « au moins un succès en ${f(essais, 0)} essais » donne ${pct(fauxAuMoinsUn, 2)}, un nombre sans rapport avec les ${pct(reponse, 2)} de la série. Avant de calculer, dites quel événement vous tenez : TOUS les succès (produit des p) ou AU MOINS un (complément du produit des 1 − p).`,
        en
          ? `The gambler's fallacy, in either direction: believing a streak "must" break (the next trial is still ${pct(proba, 0)}), or that a hot hand raises the odds. Independence means the past trials change NOTHING — what was rare is the streak seen from the start, not its continuation.`
          : `Le sophisme du parieur, dans les deux sens : croire qu'une série « doit » s'arrêter (l'essai suivant reste à ${pct(proba, 0)}), ou qu'une main chaude augmente les chances. L'indépendance signifie que le passé ne change RIEN — ce qui était rare, c'est la série vue du départ, pas sa continuation.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 10. L'espérance d'un jeu (N2)
// ---------------------------------------------------------------------------
export const genEsperanceJeu: ExerciseGenerator = {
  id: 'm13-ex-10',
  moduleId: M13,
  titre: 'L\'espérance d\'un jeu',
  titreEn: 'The expected value of a game',
  difficulte: 2,
  // Tirages (ordre strict) : 1. p1 = pick([10, 20, 25]) · 2. p2 = pick([30,
  // 40, 50]) · 3. g1 = randInt(8, 20) · 4. g2 = randInt(2, 6) · 5. habillage =
  // pick(['jury', 'stand']). Trois issues : gros gain g1 (proba p1), petit
  // gain g2 (proba p2), zéro sinon (p0 = 100 − p1 − p2 ≥ 25). Réponse =
  // esperanceJeu([p1, p2, p0], [g1, g2, 0]). Le faux « moyenne simple des
  // gains » est recalculé ; le corrigé martèle le réflexe du ch5 : le prix
  // d'un jeu, c'est son espérance — et on paie MOINS pour dégager une marge.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const p1 = pick(rng, [10, 20, 25] as const);
    const p2 = pick(rng, [30, 40, 50] as const);
    const g1 = randInt(rng, 8, 20);
    const g2 = randInt(rng, 2, 6);
    const habillage = pick(rng, ['jury', 'stand'] as const);

    const p0 = 100 - p1 - p2;
    const reponse = r2(esperanceJeu([p1, p2, p0], [g1, g2, 0]));
    const contrib1 = r2((p1 / 100) * g1);
    const contrib2 = r2((p2 / 100) * g2);
    const fauxMoyenne = r2((g1 + g2) / 3);
    const estJury = habillage === 'jury';

    const en = langue === 'en';
    const { f, pct, eur } = formatters(langue);
    return {
      enonce: en
        ? estJury
          ? `The jury describes a game: with probability ${pct(p1, 0)} you win ${eur(g1, 0)}, with probability ${pct(p2, 0)} you win ${eur(g2, 0)}, otherwise nothing. "How much do you pay to play?"\n\n**Compute the game's expected value, in euros — the maximum price a rational player pays.**`
          : `A game stand offers: ${pct(p1, 0)} chance of winning ${eur(g1, 0)}, ${pct(p2, 0)} chance of winning ${eur(g2, 0)}, nothing otherwise.\n\n**What is the expected value of one play, in euros — the fair ticket price?**`
        : estJury
          ? `Le jury décrit un jeu : avec probabilité ${pct(p1, 0)} vous gagnez ${eur(g1, 0)}, avec probabilité ${pct(p2, 0)} vous gagnez ${eur(g2, 0)}, rien sinon. « Combien payez-vous pour jouer ? »\n\n**Calculez l'espérance du jeu, en euros — le prix maximal qu'un joueur rationnel paie.**`
          : `Un stand de jeu propose : ${pct(p1, 0)} de chances de gagner ${eur(g1, 0)}, ${pct(p2, 0)} de chances de gagner ${eur(g2, 0)}, rien sinon.\n\n**Quelle est l'espérance d'une partie, en euros — le prix équitable du ticket ?**`,
      reponse,
      tolerance: 0.01,
      unite: '€',
      etapes: [
        {
          titre: en ? 'Lay out the outcome table' : 'Poser le tableau des issues',
          contenu: en
            ? `Three outcomes: ${eur(g1, 0)} at ${pct(p1, 0)}, ${eur(g2, 0)} at ${pct(p2, 0)}, and ${eur(0, 0)} for the remaining $100 - ${f(p1, 0)} - ${f(p2, 0)} = ${pct(p0, 0)}$. First check, out loud: the probabilities sum to 100. A game whose outcomes do not cover 100% is a game you have not understood yet.`
            : `Trois issues : ${eur(g1, 0)} à ${pct(p1, 0)}, ${eur(g2, 0)} à ${pct(p2, 0)}, et ${eur(0, 0)} pour les $100 - ${f(p1, 0)} - ${f(p2, 0)} = ${pct(p0, 0)}$ restants. Première vérification, à voix haute : les probabilités somment à 100. Un jeu dont les issues ne couvrent pas 100 %, c'est un jeu qu'on n'a pas encore compris.`,
        },
        {
          titre: en ? 'Weight and sum — the commutativity trick' : 'Pondérer et sommer — l\'astuce de commutativité',
          contenu: en
            ? `$E = \\sum p_i g_i = ${f(p1, 0)}\\,\\% × ${f(g1, 0)} + ${f(p2, 0)}\\,\\% × ${f(g2, 0)} + ${f(p0, 0)}\\,\\% × 0 = ${f(contrib1, 2)} + ${f(contrib2, 2)} + 0$ = **${eur(reponse)}**. Mental shortcut from chapter 1: x% of y = y% of x — read "${f(p1, 0)}% of ${f(g1, 0)}" as "${f(g1, 0)}% of ${f(p1, 0)}" whenever that direction is friendlier. The zero outcome contributes nothing to E, but its ${pct(p0, 0)} weight is what drags the value down.`
            : `$E = \\sum p_i g_i = ${f(p1, 0)}\\,\\% × ${f(g1, 0)} + ${f(p2, 0)}\\,\\% × ${f(g2, 0)} + ${f(p0, 0)}\\,\\% × 0 = ${f(contrib1, 2)} + ${f(contrib2, 2)} + 0$ = **${eur(reponse)}**. Le raccourci mental du chapitre 1 : x % de y = y % de x — lisez « ${f(p1, 0)} % de ${f(g1, 0)} » comme « ${f(g1, 0)} % de ${f(p1, 0)} » chaque fois que ce sens est plus amical. L'issue nulle ne contribue rien à E, mais son poids de ${pct(p0, 0)} est ce qui tire la valeur vers le bas.`,
        },
        {
          titre: en ? 'From value to price' : 'De la valeur au prix',
          contenu: en
            ? `The value is ${eur(reponse)}; the desk answer to "how much do you pay?" is "at most ${eur(reponse)} — and less, to keep a margin". Pay E exactly and you work for free while carrying the variance; the market maker of module 1 buys BELOW value and sells above. And remember the follow-up is always about repetition: a positive edge only becomes revenue through the law of large numbers, sized small (module 12).`
            : `La valeur est ${eur(reponse)} ; la réponse desk à « combien payez-vous ? » est « au plus ${eur(reponse)} — et moins, pour garder une marge ». Payer E exactement, c'est travailler gratuitement en portant la variance ; le market maker du module 1 achète SOUS la valeur et vend au-dessus. Et la relance porte toujours sur la répétition : un edge positif ne devient un revenu que par la loi des grands nombres, avec une mise petite (module 12).`,
        },
      ],
      pieges: [
        en
          ? `The simple average of the payoffs: $(${f(g1, 0)} + ${f(g2, 0)} + 0)/3 = ${eur(fauxMoyenne)}$ instead of ${eur(reponse)} — it treats a ${pct(p1, 0)} outcome as if it were as likely as the ${pct(p0, 0)} one. An expectation without its weights is not an expectation.`
          : `La moyenne simple des gains : $(${f(g1, 0)} + ${f(g2, 0)} + 0)/3 = ${eur(fauxMoyenne)}$ au lieu de ${eur(reponse)} — elle traite une issue à ${pct(p1, 0)} comme si elle pesait autant que celle à ${pct(p0, 0)}. Une espérance sans ses poids n'est pas une espérance.`,
        en
          ? `Answering the most likely payoff (${eur(0, 0)}, at ${pct(p0, 0)}) or the headline gain (${eur(g1, 0)}): the mode and the maximum are not the mean. The price of a game is its probability-weighted average — nothing else.`
          : `Répondre le gain le plus probable (${eur(0, 0)}, à ${pct(p0, 0)}) ou le gain d'affiche (${eur(g1, 0)}) : le mode et le maximum ne sont pas la moyenne. Le prix d'un jeu est sa moyenne pondérée par les probabilités — rien d'autre.`,
        en
          ? `Forgetting the zero outcome when checking the weights: ${f(p1, 0)} + ${f(p2, 0)} only covers ${pct(p1 + p2, 0)} — the missing ${pct(p0, 0)} is precisely where the game makes its money.`
          : `Oublier l'issue nulle en vérifiant les poids : ${f(p1, 0)} + ${f(p2, 0)} ne couvre que ${pct(p1 + p2, 0)} — les ${pct(p0, 0)} manquants sont précisément là où le jeu gagne son argent.`,
      ],
    };
  },
};

// __SUITE__

