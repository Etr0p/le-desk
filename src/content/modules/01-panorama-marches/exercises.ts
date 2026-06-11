/**
 * Les 7 générateurs d'exercices d'application du module Panorama des marchés
 * & acteurs. Module de culture (quantitatif: false) : peu de moules, tous
 * concrets, tous en microstructure — fourchette, carnet d'ordres, coûts
 * d'exécution, économie des intermédiaires (chapitres 4 et 5).
 *
 * BILINGUES : generate(seed, langue = 'fr'). Invariant absolu : TOUS les tirages
 * aléatoires sont effectués AVANT toute branche de langue — un même seed produit
 * exactement les mêmes nombres, la même réponse et la même tolérance en français
 * et en anglais. Seuls les textes (énoncé, étapes, pièges) changent.
 *
 * Tous les calculs passent par calculs.ts (aucune formule recopiée).
 * L'ordre des tirages de chaque moule est documenté dans son commentaire
 * « Tirages (ordre strict) » : exercises.test.ts les rejoue avec mulberry32(seed)
 * pour recouper chaque réponse par un calcul direct via calculs.ts.
 */
import { formatNombreLangue } from '../../../engine/answers';
import { mulberry32, pick, randInt } from '../../../engine/rng';
import type { ExerciseGenerator, Langue } from '../../../engine/types';
import {
  commissionTotale,
  coutTraverseeSpread,
  executionCarnet,
  milieuFourchette,
  pnlMarketMaker,
  slippage,
  spreadAbsolu,
  spreadPb,
} from './calculs';

const M1 = '01-panorama-marches';

const r2 = (v: number) => Math.round(v * 100) / 100;

/** Formateurs dépendants de la langue : nombre, montant en euros, points de base. */
function formatters(langue: Langue) {
  const f = (v: number, d = 2) => formatNombreLangue(langue, v, d);
  const eur = (v: number, d = 2) => (langue === 'en' ? `€${f(v, d)}` : `${f(v, d)} €`);
  const pb = (v: number, d = 2) => (langue === 'en' ? `${f(v, d)} bp` : `${f(v, d)} pb`);
  return { f, eur, pb };
}

// ---------------------------------------------------------------------------
// 1. Fourchette en points de base (N1)
// ---------------------------------------------------------------------------
export const genSpreadPb: ExerciseGenerator = {
  id: 'm1-app-spread-pb',
  moduleId: M1,
  titre: 'Fourchette en points de base',
  titreEn: 'Spread in basis points',
  difficulte: 1,
  // Tirages (ordre strict) : 1. prixBase = randInt(25, 250) · 2. demiCents = randInt(1, 25).
  // bid = prixBase − demiCents/100 ; ask = prixBase + demiCents/100 (milieu = prixBase).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const prixBase = randInt(rng, 25, 250);
    const demiCents = randInt(rng, 1, 25);

    const bid = prixBase - demiCents / 100;
    const ask = prixBase + demiCents / 100;
    const sAbs = spreadAbsolu(bid, ask);
    const milieu = milieuFourchette(bid, ask);
    const reponse = r2(spreadPb(bid, ask));
    const spreadCentimes = 2 * demiCents;
    const enPourcent = r2(spreadPb(bid, ask) / 100);
    const liquide = reponse <= 15;

    const en = langue === 'en';
    const { f, eur, pb } = formatters(langue);
    return {
      enonce: en
        ? `Your screen shows a stock quoted ${eur(bid)} on the bid and ${eur(ask)} on the ask.\n\n**What is the bid-ask spread in basis points of the mid?**`
        : `Sur votre écran, un titre cote ${eur(bid)} au bid et ${eur(ask)} à l'ask.\n\n**Que vaut la fourchette (spread) en points de base du milieu ?**`,
      reponse,
      tolerance: 0.01,
      unite: en ? 'bp' : 'pb',
      etapes: [
        {
          titre: en ? 'The absolute spread' : 'Le spread absolu',
          contenu: en
            ? `$\\text{spread} = \\text{ask} - \\text{bid} = ${f(ask)} - ${f(bid)}$ = **${eur(sAbs)}**, i.e. ${f(spreadCentimes, 0)} cents per share — the price of an immediate round trip (buy at the ask, sell back at the bid).`
            : `$\\text{spread} = \\text{ask} - \\text{bid} = ${f(ask)} - ${f(bid)}$ = **${eur(sAbs)}**, soit ${f(spreadCentimes, 0)} centimes par titre — le prix d'un aller-retour immédiat (acheter à l'ask, revendre au bid).`,
        },
        {
          titre: en ? 'The reference: the mid' : 'La référence : le milieu',
          contenu: en
            ? `$\\text{mid} = (\\text{bid} + \\text{ask})/2$ = **${eur(milieu)}** — the best instantaneous estimate of fair value, and THE denominator of the conversion: ${f(spreadCentimes, 0)} cents are cheap on an expensive stock, expensive on a cheap one.`
            : `$\\text{milieu} = (\\text{bid} + \\text{ask})/2$ = **${eur(milieu)}** — la meilleure estimation instantanée de la valeur, et LE dénominateur de la conversion : ${f(spreadCentimes, 0)} centimes ne pèsent pas pareil sur un titre cher et sur un titre bon marché.`,
        },
        {
          titre: en ? 'Convert into basis points' : 'Convertir en points de base',
          contenu: en
            ? `$\\text{spread (bp)} = \\frac{\\text{ask} - \\text{bid}}{\\text{mid}} \\times 10\\,000 = \\frac{${f(sAbs)}}{${f(milieu)}} \\times 10\\,000$ = **${pb(reponse)}**. ${liquide ? 'Around 10 bp or less: a liquid name — immediacy is cheap.' : 'Several tens of basis points: immediacy is expensive here — typical of a less liquid name.'} Desk reflex: on a stock near €100, one cent of spread = one basis point.`
            : `$\\text{spread (pb)} = \\frac{\\text{ask} - \\text{bid}}{\\text{milieu}} \\times 10\\,000 = \\frac{${f(sAbs)}}{${f(milieu)}} \\times 10\\,000$ = **${pb(reponse)}**. ${liquide ? "Autour de 10 pb ou moins : un titre liquide — l'immédiateté ne coûte presque rien." : "Plusieurs dizaines de points de base : l'immédiateté coûte cher — typique d'une valeur peu liquide."} Réflexe de desk : sur un titre autour de 100 €, un centime de fourchette = un point de base.`,
        },
      ],
      pieges: [
        en
          ? `Quoting the raw spread (${f(spreadCentimes, 0)} cents) "in bp" without dividing by the mid: the bp conversion is spread ÷ mid × 10,000 — drop the mid from the denominator and the figure is meaningless (it would change with the share price level for the same true cost).`
          : `Annoncer le spread brut (${f(spreadCentimes, 0)} centimes) « en pb » sans le rapporter au milieu : la conversion en pb, c'est spread ÷ milieu × 10 000 — sans le milieu au dénominateur, le chiffre ne veut rien dire (il changerait avec le niveau du titre à coût réel identique).`,
        en
          ? `Mixing up % and bp: spread/mid = ${f(enPourcent, 2)}%, which is ${pb(reponse)} — a factor of 100 between the two (1 bp = 0.01%).`
          : `Confondre % et pb : spread/milieu = ${f(enPourcent, 2)} %, soit ${pb(reponse)} — un facteur 100 entre les deux (1 pb = 0,01 %).`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 2. Coût de traversée de la fourchette (N1)
// ---------------------------------------------------------------------------
export const genCoutTraversee: ExerciseGenerator = {
  id: 'm1-app-cout-traversee',
  moduleId: M1,
  titre: 'Coût de traversée de la fourchette',
  titreEn: 'Cost of crossing the spread',
  difficulte: 1,
  // Tirages (ordre strict) : 1. prixBase = randInt(25, 250) · 2. demiCents = randInt(2, 20)
  // · 3. qCent = randInt(2, 20) (quantite = qCent × 100) · 4. sens = pick(['achat', 'vente']).
  // bid = prixBase − demiCents/100 ; ask = prixBase + demiCents/100.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const prixBase = randInt(rng, 25, 250);
    const demiCents = randInt(rng, 2, 20);
    const qCent = randInt(rng, 2, 20);
    const sens = pick(rng, ['achat', 'vente'] as const);

    const bid = prixBase - demiCents / 100;
    const ask = prixBase + demiCents / 100;
    const quantite = qCent * 100;
    const milieu = milieuFourchette(bid, ask);
    const reponse = r2(coutTraverseeSpread(quantite, bid, ask, sens));
    const fauxSpreadEntier = r2(quantite * spreadAbsolu(bid, ask));
    const demiParTitre = r2(spreadAbsolu(bid, ask) / 2);
    const achat = sens === 'achat';

    const en = langue === 'en';
    const { f, eur } = formatters(langue);
    return {
      enonce: en
        ? `A stock is quoted ${eur(bid)} / ${eur(ask)}. You send a **market ${achat ? 'buy' : 'sell'} order** for ${f(quantite, 0)} shares, fully filled at the best ${achat ? 'ask' : 'bid'}.\n\n**How much does this immediate execution cost you versus the mid, in euros?**`
        : `Un titre cote ${eur(bid)} / ${eur(ask)}. Vous envoyez un **ordre ${achat ? "d'achat" : 'de vente'} au marché** de ${f(quantite, 0)} titres, intégralement servi au meilleur ${achat ? 'ask' : 'bid'}.\n\n**Combien vous coûte cette exécution immédiate par rapport au milieu de fourchette, en euros ?**`,
      reponse,
      tolerance: 0.005,
      unite: '€',
      etapes: [
        {
          titre: en ? 'The benchmark: the mid' : 'La référence : le milieu',
          contenu: en
            ? `$\\text{mid} = (${f(bid)} + ${f(ask)})/2$ = **${eur(milieu)}**: the best instantaneous estimate of the stock's value. Every execution cost is measured against it — not against the price you happen to trade at.`
            : `$\\text{milieu} = (${f(bid)} + ${f(ask)})/2$ = **${eur(milieu)}** : la meilleure estimation instantanée de la valeur du titre. Tout coût d'exécution se mesure contre lui — pas contre le prix auquel on a traité.`,
        },
        {
          titre: en ? 'One leg pays HALF the spread' : 'Une jambe paie LA MOITIÉ du spread',
          contenu: en
            ? `${achat ? `Buying immediately means lifting the ask at ${eur(ask)} while the value sits at the mid (${eur(milieu)})` : `Selling immediately means hitting the bid at ${eur(bid)} while the value sits at the mid (${eur(milieu)})`}: the toll is ${eur(demiParTitre)} per share — the **half-spread**, the price of immediacy that pays the market maker for standing there.`
            : `${achat ? `Acheter tout de suite, c'est payer l'ask à ${eur(ask)} alors que la valeur est au milieu (${eur(milieu)})` : `Vendre tout de suite, c'est toucher le bid à ${eur(bid)} alors que la valeur est au milieu (${eur(milieu)})`} : le péage est de ${eur(demiParTitre)} par titre — la **demi-fourchette**, le prix de l'immédiateté qui rémunère le market maker présent en face.`,
        },
        {
          titre: en ? 'Scale by the size' : "Multiplier par la taille de l'ordre",
          contenu: en
            ? `$\\text{cost} = ${f(quantite, 0)} \\times ${f(demiParTitre)}$ = **${eur(reponse)}**. Invisible on the screen — the quoted price never shows it — but very real: it is the first layer of the true cost of any execution.`
            : `$\\text{coût} = ${f(quantite, 0)} \\times ${f(demiParTitre)}$ = **${eur(reponse)}**. Invisible à l'écran — le cours affiché ne le montre jamais — mais bien réel : c'est le premier étage du coût réel de toute exécution.`,
        },
      ],
      pieges: [
        en
          ? `Charging the full spread: ${f(quantite, 0)} × ${f(r2(spreadAbsolu(bid, ask)))} = ${eur(fauxSpreadEntier)}, twice the right answer. The full spread is the cost of a round trip (buy AND sell back); a single leg only travels from the mid to one side — half the spread.`
          : `Compter le spread entier : ${f(quantite, 0)} × ${f(r2(spreadAbsolu(bid, ask)))} = ${eur(fauxSpreadEntier)}, le double de la bonne réponse. Le spread entier est le coût de l'aller-retour (acheter PUIS revendre) ; une seule jambe ne parcourt que le trajet du milieu vers un côté — la moitié du spread.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 3. Marcher le carnet (N2)
// ---------------------------------------------------------------------------
export const genMarcherCarnet: ExerciseGenerator = {
  id: 'm1-app-marcher-carnet',
  moduleId: M1,
  titre: 'Marcher le carnet : le prix moyen d\'exécution',
  titreEn: 'Walking the book: the average fill price',
  difficulte: 2,
  // Tirages (ordre strict) : 1. prixBase = randInt(20, 200) · 2. askCents = randInt(5, 95)
  // · 3. tickCents = pick([5, 10, 20]) · 4. t1c = randInt(2, 6) · 5. t2c = randInt(2, 6)
  // · 6. t3c = randInt(3, 8) · 7. qExtraC = randInt(1, t2c + t3c − 1).
  // Niveaux : prixBase + (askCents + k·tickCents)/100, tailles tkc × 100 ;
  // quantite = (t1c + qExtraC) × 100 → traverse toujours 2 ou 3 niveaux, jamais plus.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const prixBase = randInt(rng, 20, 200);
    const askCents = randInt(rng, 5, 95);
    const tickCents = pick(rng, [5, 10, 20] as const);
    const t1c = randInt(rng, 2, 6);
    const t2c = randInt(rng, 2, 6);
    const t3c = randInt(rng, 3, 8);
    const qExtraC = randInt(rng, 1, t2c + t3c - 1);

    const niveaux = [
      { prix: prixBase + askCents / 100, taille: t1c * 100 },
      { prix: prixBase + (askCents + tickCents) / 100, taille: t2c * 100 },
      { prix: prixBase + (askCents + 2 * tickCents) / 100, taille: t3c * 100 },
    ];
    const quantite = (t1c + qExtraC) * 100;
    const exec = executionCarnet(quantite, niveaux);
    const reponse = r2(exec.prixMoyen);
    // Consommation niveau par niveau (pour le corrigé pas à pas).
    const q1 = niveaux[0].taille;
    const q2 = Math.min(quantite - q1, niveaux[1].taille);
    const q3 = quantite - q1 - q2;
    const c1 = q1 * niveaux[0].prix;
    const c2 = q2 * niveaux[1].prix;
    const c3 = q3 * niveaux[2].prix;
    const troisNiveaux = exec.niveauxConsommes === 3;
    const prixConsommes = troisNiveaux
      ? [niveaux[0].prix, niveaux[1].prix, niveaux[2].prix]
      : [niveaux[0].prix, niveaux[1].prix];
    const fauxMoyenneSimple = r2(prixConsommes.reduce((s, p) => s + p, 0) / prixConsommes.length);

    const en = langue === 'en';
    const { f, eur } = formatters(langue);
    return {
      enonce: en
        ? `The ask side of an order book shows three levels: ${f(niveaux[0].taille, 0)} shares at ${eur(niveaux[0].prix)}, ${f(niveaux[1].taille, 0)} at ${eur(niveaux[1].prix)}, ${f(niveaux[2].taille, 0)} at ${eur(niveaux[2].prix)}. You send a **market buy order** for ${f(quantite, 0)} shares.\n\n**At what average price is your order filled, in euros per share?**`
        : `Le carnet à la vente d'un titre affiche trois niveaux : ${f(niveaux[0].taille, 0)} titres à ${eur(niveaux[0].prix)}, ${f(niveaux[1].taille, 0)} à ${eur(niveaux[1].prix)}, ${f(niveaux[2].taille, 0)} à ${eur(niveaux[2].prix)}. Vous envoyez un **ordre d'achat au marché** de ${f(quantite, 0)} titres.\n\n**À quel prix moyen votre ordre est-il exécuté, en euros par titre ?**`,
      reponse,
      tolerance: 0.005,
      toleranceMode: 'absolu',
      unite: '€',
      etapes: [
        {
          titre: en ? 'Consume the best level first' : "Consommer d'abord le meilleur niveau",
          contenu: en
            ? `Price-time priority: a market order takes the best ask first. ${f(q1, 0)} shares fill at ${eur(niveaux[0].prix)}, i.e. ${eur(c1)}. Still to fill: ${f(quantite - q1, 0)} shares — the order is bigger than the top of book, so it starts **walking the book**.`
            : `Priorité prix-temps : un ordre au marché prend d'abord le meilleur ask. ${f(q1, 0)} titres sont servis à ${eur(niveaux[0].prix)}, soit ${eur(c1)}. Reste à servir : ${f(quantite - q1, 0)} titres — l'ordre est plus gros que le premier niveau, il commence à **marcher le carnet**.`,
        },
        {
          titre: en ? 'Walk to the next level(s)' : 'Marcher vers le(s) niveau(x) suivant(s)',
          contenu: en
            ? troisNiveaux
              ? `The second level is swept entirely: ${f(q2, 0)} shares at ${eur(niveaux[1].prix)} = ${eur(c2)}. The remaining ${f(q3, 0)} shares dig into the third level at ${eur(niveaux[2].prix)} = ${eur(c3)}. Total paid: ${eur(exec.coutTotal)} for ${f(quantite, 0)} shares, across ${f(exec.niveauxConsommes, 0)} levels.`
              : `The remaining ${f(q2, 0)} shares fill on the second level at ${eur(niveaux[1].prix)} = ${eur(c2)}; the third level (${eur(niveaux[2].prix)}) is never touched. Total paid: ${eur(exec.coutTotal)} for ${f(quantite, 0)} shares, across ${f(exec.niveauxConsommes, 0)} levels.`
            : troisNiveaux
              ? `Le deuxième niveau est entièrement balayé : ${f(q2, 0)} titres à ${eur(niveaux[1].prix)} = ${eur(c2)}. Les ${f(q3, 0)} titres restants entament le troisième niveau à ${eur(niveaux[2].prix)} = ${eur(c3)}. Total déboursé : ${eur(exec.coutTotal)} pour ${f(quantite, 0)} titres, sur ${f(exec.niveauxConsommes, 0)} niveaux.`
              : `Les ${f(q2, 0)} titres restants sont servis au deuxième niveau à ${eur(niveaux[1].prix)} = ${eur(c2)} ; le troisième niveau (${eur(niveaux[2].prix)}) n'est jamais touché. Total déboursé : ${eur(exec.coutTotal)} pour ${f(quantite, 0)} titres, sur ${f(exec.niveauxConsommes, 0)} niveaux.`,
        },
        {
          titre: en ? 'The quantity-weighted average price' : 'Le prix moyen pondéré par les quantités',
          contenu: en
            ? `$\\text{average price} = \\frac{${f(exec.coutTotal)}}{${f(quantite, 0)}}$ = **${eur(reponse)}** per share — between the best ask (${eur(niveaux[0].prix)}) and the last level touched. The gap to the best ask is the *depth slippage*: the subject of the next exercise.`
            : `$\\text{prix moyen} = \\frac{${f(exec.coutTotal)}}{${f(quantite, 0)}}$ = **${eur(reponse)}** par titre — entre le meilleur ask (${eur(niveaux[0].prix)}) et le dernier niveau touché. L'écart au meilleur ask, c'est le *slippage de profondeur* : l'objet de l'exercice suivant.`,
        },
      ],
      pieges: [
        en
          ? `Taking the simple average of the quoted prices (${eur(fauxMoyenneSimple)}): it ignores how many shares actually filled at each level — only the quantity-weighted average of the executed shares counts.`
          : `Prendre la moyenne simple des prix affichés (${eur(fauxMoyenneSimple)}) : elle ignore le nombre de titres réellement servis à chaque niveau — seule compte la moyenne pondérée par les quantités exécutées.`,
        en
          ? `Assuming the whole order fills at the best ask (${eur(niveaux[0].prix)}): only the first ${f(q1, 0)} shares get that price — the displayed quote is a price for a SIZE, not for any size.`
          : `Croire que tout l'ordre est servi au meilleur ask (${eur(niveaux[0].prix)}) : seuls les ${f(q1, 0)} premiers titres l'obtiennent — le cours affiché est un prix pour une TAILLE donnée, pas pour n'importe quelle taille.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 4. Slippage total d'un ordre au marché (N2) — suite logique du moule 3
// ---------------------------------------------------------------------------
export const genSlippage: ExerciseGenerator = {
  id: 'm1-app-slippage',
  moduleId: M1,
  titre: 'Slippage total d\'un ordre au marché',
  titreEn: 'Total slippage of a market order',
  difficulte: 2,
  // Tirages (ordre strict) : 1. prixBase = randInt(20, 200) · 2. demiCents = randInt(2, 10)
  // · 3. tickCents = pick([5, 10, 20]) · 4. t1c = randInt(2, 6) · 5. t2c = randInt(2, 6)
  // · 6. t3c = randInt(3, 8) · 7. qExtraC = randInt(1, t2c + t3c − 1).
  // bid = prixBase − demiCents/100 ; niveaux ask : prixBase + (demiCents + k·tickCents)/100 ;
  // quantite = (t1c + qExtraC) × 100 → traverse toujours ≥ 2 niveaux (profondeur > 0).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const prixBase = randInt(rng, 20, 200);
    const demiCents = randInt(rng, 2, 10);
    const tickCents = pick(rng, [5, 10, 20] as const);
    const t1c = randInt(rng, 2, 6);
    const t2c = randInt(rng, 2, 6);
    const t3c = randInt(rng, 3, 8);
    const qExtraC = randInt(rng, 1, t2c + t3c - 1);

    const bid = prixBase - demiCents / 100;
    const niveaux = [
      { prix: prixBase + demiCents / 100, taille: t1c * 100 },
      { prix: prixBase + (demiCents + tickCents) / 100, taille: t2c * 100 },
      { prix: prixBase + (demiCents + 2 * tickCents) / 100, taille: t3c * 100 },
    ];
    const ask1 = niveaux[0].prix;
    const quantite = (t1c + qExtraC) * 100;
    const milieu = milieuFourchette(bid, ask1);
    const exec = executionCarnet(quantite, niveaux);
    const slipParTitre = slippage(exec.prixMoyen, milieu, 'achat');
    const reponse = r2(quantite * slipParTitre);
    const demiFourchette = r2(coutTraverseeSpread(quantite, bid, ask1, 'achat'));
    const profondeur = r2(quantite * slippage(exec.prixMoyen, ask1, 'achat'));

    const en = langue === 'en';
    const { f, eur } = formatters(langue);
    return {
      enonce: en
        ? `A stock shows ${eur(bid)} on the bid; on the ask side, the book reads ${f(niveaux[0].taille, 0)} shares at ${eur(ask1)}, ${f(niveaux[1].taille, 0)} at ${eur(niveaux[1].prix)} and ${f(niveaux[2].taille, 0)} at ${eur(niveaux[2].prix)}. You buy ${f(quantite, 0)} shares **at market**.\n\n**What is the total slippage of the order versus the mid, in euros?**`
        : `Un titre affiche ${eur(bid)} au bid ; à la vente, le carnet montre ${f(niveaux[0].taille, 0)} titres à ${eur(ask1)}, ${f(niveaux[1].taille, 0)} à ${eur(niveaux[1].prix)} et ${f(niveaux[2].taille, 0)} à ${eur(niveaux[2].prix)}. Vous achetez ${f(quantite, 0)} titres **au marché**.\n\n**Quel est le slippage total de l'ordre par rapport au milieu de fourchette, en euros ?**`,
      reponse,
      tolerance: 0.005,
      unite: '€',
      etapes: [
        {
          titre: en ? 'The benchmark is the mid' : 'La référence, c\'est le milieu',
          contenu: en
            ? `$\\text{mid} = (${f(bid)} + ${f(ask1)})/2$ = **${eur(milieu)}**. Slippage is always measured against the mid — the value of the stock — never against the best ask, which already embeds half the spread.`
            : `$\\text{milieu} = (${f(bid)} + ${f(ask1)})/2$ = **${eur(milieu)}**. Le slippage se mesure toujours contre le milieu — la valeur du titre — jamais contre le meilleur ask, qui contient déjà la moitié du spread.`,
        },
        {
          titre: en ? 'Walk the book to the average price' : 'Marcher le carnet jusqu\'au prix moyen',
          contenu: en
            ? `The ${f(quantite, 0)} shares sweep ${f(exec.niveauxConsommes, 0)} levels for a total of ${eur(exec.coutTotal)}: average price ${eur(r2(exec.prixMoyen))}, i.e. ${eur(r2(slipParTitre))} per share above the mid.`
            : `Les ${f(quantite, 0)} titres balayent ${f(exec.niveauxConsommes, 0)} niveaux pour un total de ${eur(exec.coutTotal)} : prix moyen ${eur(r2(exec.prixMoyen))}, soit ${eur(r2(slipParTitre))} par titre au-dessus du milieu.`,
        },
        {
          titre: en ? 'Decompose: half-spread + depth' : 'Décomposer : demi-fourchette + profondeur',
          contenu: en
            ? `Two layers, as in the course: **half-spread** ${f(quantite, 0)} × (${f(ask1)} − ${f(milieu)}) = ${eur(demiFourchette)} (the price of immediacy, paid even by a small order) **+ depth slippage** ${f(quantite, 0)} × (${f(r2(exec.prixMoyen))} − ${f(ask1)}) = ${eur(profondeur)} (the order outgrew the top of book). Total: ${f(demiFourchette)} + ${f(profondeur)} = **${eur(reponse)}** — and commissions would still come on top.`
            : `Deux étages, comme dans le cours : **demi-fourchette** ${f(quantite, 0)} × (${f(ask1)} − ${f(milieu)}) = ${eur(demiFourchette)} (le prix de l'immédiateté, payé même par un petit ordre) **+ slippage de profondeur** ${f(quantite, 0)} × (${f(r2(exec.prixMoyen))} − ${f(ask1)}) = ${eur(profondeur)} (l'ordre a débordé du premier niveau). Total : ${f(demiFourchette)} + ${f(profondeur)} = **${eur(reponse)}** — et les commissions s'ajouteraient encore par-dessus.`,
        },
      ],
      pieges: [
        en
          ? `Measuring against the best ask instead of the mid: that only captures the depth layer (${eur(profondeur)}) and silently drops the half-spread (${eur(demiFourchette)}) — the cost of immediacy vanishes from the bill.`
          : `Mesurer contre le meilleur ask au lieu du milieu : on ne capture que l'étage de profondeur (${eur(profondeur)}) et la demi-fourchette (${eur(demiFourchette)}) disparaît de l'addition — le coût d'immédiateté s'évapore du calcul.`,
        en
          ? `Reporting the per-share slippage (${eur(r2(slipParTitre))}) instead of the order total: the question asks for euros on the whole ticket — multiply by the ${f(quantite, 0)} shares.`
          : `Annoncer le slippage par titre (${eur(r2(slipParTitre))}) au lieu du total de l'ordre : la question demande des euros sur tout le ticket — il faut multiplier par les ${f(quantite, 0)} titres.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 5. P&L quotidien d'un market maker (N2)
// ---------------------------------------------------------------------------
export const genPnlMarketMaker: ExerciseGenerator = {
  id: 'm1-app-pnl-market-maker',
  moduleId: M1,
  titre: 'P&L quotidien d\'un market maker',
  titreEn: 'A market maker\'s daily P&L',
  difficulte: 2,
  // Tirages (ordre strict) : 1. nbAR = randInt(20, 80) · 2. tailleC = randInt(2, 10)
  // (taille = tailleC × 100) · 3. spreadCents = randInt(2, 10)
  // · 4. couvCents = randInt(1, spreadCents − 1) (couverture < spread ⇒ P&L > 0).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const nbAR = randInt(rng, 20, 80);
    const tailleC = randInt(rng, 2, 10);
    const spreadCents = randInt(rng, 2, 10);
    const couvCents = randInt(rng, 1, spreadCents - 1);

    const taille = tailleC * 100;
    const spread = spreadCents / 100;
    const couverture = couvCents / 100;
    const reponse = r2(pnlMarketMaker(nbAR, taille, spread, couverture));
    const brut = r2(pnlMarketMaker(nbAR, taille, spread, 0));
    const margeCents = spreadCents - couvCents;
    const parAllerRetour = r2(taille * (spread - couverture));

    const en = langue === 'en';
    const { f, eur } = formatters(langue);
    return {
      enonce: en
        ? `A market maker quotes a stock with a ${f(spreadCents, 0)}-cent spread. Over the day, he completes ${f(nbAR, 0)} full round trips of ${f(taille, 0)} shares each. Managing his risk (inventory, hedging) costs him ${f(couvCents, 0)} cent(s) per share traded.\n\n**What is his P&L for the day, in euros?**`
        : `Un market maker cote un titre avec une fourchette de ${f(spreadCents, 0)} centimes. Sur la journée, il boucle ${f(nbAR, 0)} allers-retours complets de ${f(taille, 0)} titres chacun. Gérer son risque (inventaire, couverture) lui coûte ${f(couvCents, 0)} centime(s) par titre traité.\n\n**Quel est son P&L de la journée, en euros ?**`,
      reponse,
      tolerance: 0.005,
      unite: '€',
      etapes: [
        {
          titre: en ? 'What one round trip captures' : 'Ce qu\'un aller-retour capture',
          contenu: en
            ? `Buy at the bid, sell back at the ask: a full round trip captures the **entire spread**, ${f(spreadCents, 0)} cents per share. That is the merchant's revenue — he sells immediacy to whoever crosses the spread.`
            : `Acheter au bid, revendre à l'ask : un aller-retour complet capture le **spread entier**, ${f(spreadCents, 0)} centimes par titre. C'est le chiffre d'affaires du commerçant — il vend l'immédiateté à ceux qui traversent la fourchette.`,
        },
        {
          titre: en ? 'Net out the cost of risk' : 'Retrancher le coût du risque',
          contenu: en
            ? `The spread is not all margin: inventory and hedging eat ${f(couvCents, 0)} cent(s) per share (adverse selection is in there too — the spread must cover losses against better-informed flow). Net margin: ${f(spreadCents, 0)} − ${f(couvCents, 0)} = ${f(margeCents, 0)} cent(s) per share, i.e. ${eur(parAllerRetour)} per round trip of ${f(taille, 0)} shares.`
            : `Le spread n'est pas que de la marge : inventaire et couverture mangent ${f(couvCents, 0)} centime(s) par titre (la sélection adverse est logée là aussi — le spread doit financer les pertes face aux flux mieux informés). Marge nette : ${f(spreadCents, 0)} − ${f(couvCents, 0)} = ${f(margeCents, 0)} centime(s) par titre, soit ${eur(parAllerRetour)} par aller-retour de ${f(taille, 0)} titres.`,
        },
        {
          titre: en ? 'Multiply by the flow' : 'Multiplier par le flux',
          contenu: en
            ? `$PnL = ${f(nbAR, 0)} \\times ${f(taille, 0)} \\times (${f(spread)} - ${f(couverture)})$ = **${eur(reponse)}**. A tiny margin per share times an enormous flow: market making is a volume business — which is exactly why it became a machine's job (chapter 5).`
            : `$PnL = ${f(nbAR, 0)} \\times ${f(taille, 0)} \\times (${f(spread)} - ${f(couverture)})$ = **${eur(reponse)}**. Une marge minuscule par titre multipliée par un flux énorme : le market making est un métier de volume — exactement pourquoi il est devenu un métier de machines (chapitre 5).`,
        },
      ],
      pieges: [
        en
          ? `Forgetting the cost of risk: ${f(nbAR, 0)} × ${f(taille, 0)} × ${f(spread)} = ${eur(brut)} is gross revenue, not P&L — the net margin per share is ${f(margeCents, 0)} cent(s), not ${f(spreadCents, 0)}.`
          : `Oublier le coût de couverture : ${f(nbAR, 0)} × ${f(taille, 0)} × ${f(spread)} = ${eur(brut)}, c'est le revenu brut, pas le P&L — la marge nette par titre est de ${f(margeCents, 0)} centime(s), pas ${f(spreadCents, 0)}.`,
        en
          ? `Mixing up the two sides of the counter: the client who crosses pays the half-spread per leg; the market maker who completes the round trip (bid → ask) earns the full spread.`
          : `Confondre les deux côtés du comptoir : le client qui traverse paie la demi-fourchette par jambe ; le market maker qui boucle l'aller-retour (bid → ask) encaisse le spread entier.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 6. Commission de courtage (N1) — le minimum mord ou pas
// ---------------------------------------------------------------------------
export const genCommission: ExerciseGenerator = {
  id: 'm1-app-commission',
  moduleId: M1,
  titre: 'Commission de courtage : le minimum mord-il ?',
  titreEn: 'Brokerage commission: does the minimum bite?',
  difficulte: 1,
  // Tirages (ordre strict) : 1. regime = pick(['minimum', 'proportionnel']) — le régime est
  // TIRÉ pour forcer l'alternance des deux cas selon les seeds · 2. tauxPb = pick([1, 2, 3, 5])
  // · 3. minimum = pick([15, 20, 25, 30]) · 4. notionnelK = randInt(borné selon le régime),
  // avec seuilK = minimum × 10 / tauxPb : régime 'minimum' → randInt(5, ⌊seuilK⌋ − 5) ;
  // régime 'proportionnel' → randInt(⌈seuilK⌉ + 10, ⌈seuilK⌉ + 400). notionnel = notionnelK × 1000.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const regime = pick(rng, ['minimum', 'proportionnel'] as const);
    const tauxPb = pick(rng, [1, 2, 3, 5] as const);
    const minimum = pick(rng, [15, 20, 25, 30] as const);
    const seuilK = (minimum * 10) / tauxPb;
    const notionnelK =
      regime === 'minimum'
        ? randInt(rng, 5, Math.floor(seuilK) - 5)
        : randInt(rng, Math.ceil(seuilK) + 10, Math.ceil(seuilK) + 400);

    const notionnel = notionnelK * 1000;
    const reponse = r2(commissionTotale(notionnel, tauxPb, minimum));
    const proportionnelle = r2((notionnel * tauxPb) / 10_000);
    const mord = regime === 'minimum';
    const pbEffectifs = r2((reponse / notionnel) * 10_000);

    const en = langue === 'en';
    const { f, eur, pb } = formatters(langue);
    return {
      enonce: en
        ? `Your broker charges ${f(tauxPb, 0)} bp of the notional, with a ${eur(minimum, 0)} minimum per ticket. You execute an order worth ${eur(notionnel, 0)}.\n\n**What commission do you pay, in euros?**`
        : `Votre courtier facture ${f(tauxPb, 0)} pb du notionnel, avec un minimum de ${eur(minimum, 0)} par ordre. Vous exécutez un ordre de ${eur(notionnel, 0)}.\n\n**Quelle commission payez-vous, en euros ?**`,
      reponse,
      tolerance: 0.005,
      unite: '€',
      etapes: [
        {
          titre: en ? 'The proportional leg of the schedule' : 'La part proportionnelle du barème',
          contenu: en
            ? `1 bp = 0.01%, so $\\text{commission} = \\text{notional} \\times \\frac{\\text{rate}}{10\\,000} = ${f(notionnel, 0)} \\times \\frac{${f(tauxPb, 0)}}{10\\,000}$ = **${eur(proportionnelle)}**.`
            : `1 pb = 0,01 %, donc $\\text{commission} = \\text{notionnel} \\times \\frac{\\text{taux}}{10\\,000} = ${f(notionnel, 0)} \\times \\frac{${f(tauxPb, 0)}}{10\\,000}$ = **${eur(proportionnelle)}**.`,
        },
        {
          titre: en ? 'Confront it with the minimum' : 'Confronter au minimum',
          contenu: en
            ? `The schedule says max(proportional, minimum): max(${f(proportionnelle)} ; ${f(minimum, 0)}). ${mord ? `Here ${eur(proportionnelle)} < ${eur(minimum, 0)}: the **minimum bites** — you pay` : `Here ${eur(proportionnelle)} > ${eur(minimum, 0)}: the proportional leg wins — the minimum stays dormant and you pay`} **${eur(reponse)}**.`
            : `Le barème dit max(proportionnelle, minimum) : max(${f(proportionnelle)} ; ${f(minimum, 0)}). ${mord ? `Ici ${eur(proportionnelle)} < ${eur(minimum, 0)} : le **minimum mord** — vous payez` : `Ici ${eur(proportionnelle)} > ${eur(minimum, 0)} : la part proportionnelle l'emporte — le minimum reste dormant et vous payez`} **${eur(reponse)}**.`,
        },
        {
          titre: en ? 'Read the effective cost' : 'Lire le coût effectif',
          contenu: en
            ? `In effective terms, the commission is ${pb(pbEffectifs)} of the notional${mord ? ` — more than the advertised ${f(tauxPb, 0)} bp: on small tickets, the minimum turns a "bp" fee into a fixed cost, and the smaller the ticket, the more it hurts` : ` — exactly the advertised rate: on tickets this size, the minimum is irrelevant`}. Desk reflex: always check WHERE the minimum starts biting (here, at ${eur(seuilK * 1000, 0)} of notional).`
            : `En termes effectifs, la commission représente ${pb(pbEffectifs)} du notionnel${mord ? ` — plus que les ${f(tauxPb, 0)} pb affichés : sur les petits ordres, le minimum transforme un tarif « en pb » en coût fixe, et plus le ticket est petit, plus il pique` : ` — exactement le tarif affiché : à cette taille de ticket, le minimum ne joue plus`}. Réflexe de desk : toujours repérer OÙ le minimum commence à mordre (ici, à ${eur(seuilK * 1000, 0)} de notionnel).`,
        },
      ],
      pieges: [
        mord
          ? en
            ? `Applying the bp schedule without checking the minimum: ${eur(proportionnelle)} instead of ${eur(minimum, 0)} — on small orders, the minimum is the rule, not the exception.`
            : `Appliquer le barème en pb sans regarder le minimum : ${eur(proportionnelle)} au lieu de ${eur(minimum, 0)} — sur les petits ordres, le minimum est la règle, pas l'exception.`
          : en
            ? `Answering the minimum (${eur(minimum, 0)}) by reflex: it only applies when the proportional leg (${eur(proportionnelle)} here) falls below it — not the case on a ticket this size.`
            : `Répondre le minimum (${eur(minimum, 0)}) par réflexe : il ne s'applique que si la part proportionnelle (${eur(proportionnelle)} ici) lui est inférieure — pas le cas sur un ticket de cette taille.`,
        en
          ? `Slipping a factor of 10 or 100 in the bp conversion: ${f(tauxPb, 0)} bp = ${f(tauxPb / 100, 2)}% — dividing by 10,000 is the whole point of basis points.`
          : `Glisser un facteur 10 ou 100 dans la conversion : ${f(tauxPb, 0)} pb = ${f(tauxPb / 100, 2)} % — la division par 10 000 est tout l'intérêt des points de base.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 7. Coût total d'une exécution (N3) — l'exercice-signature du module
// ---------------------------------------------------------------------------
export const genCoutTotalExecution: ExerciseGenerator = {
  id: 'm1-app-cout-total-execution',
  moduleId: M1,
  titre: 'Coût total d\'une exécution : les trois étages',
  titreEn: 'Total cost of an execution: the three layers',
  difficulte: 3,
  // Tirages (ordre strict) : 1. prixBase = randInt(20, 200) · 2. demiCents = randInt(2, 10)
  // · 3. tickCents = pick([5, 10, 20]) · 4. t1c = randInt(2, 6) · 5. t2c = randInt(2, 6)
  // · 6. t3c = randInt(3, 8) · 7. qExtraC = randInt(1, t2c + t3c − 1)
  // · 8. tauxPb = pick([1, 2, 3, 5]) · 9. minimum = pick([15, 20, 25, 30]).
  // Mêmes constructions que m1-app-slippage pour la fourchette et le carnet ;
  // la commission s'applique au montant exécuté (executionCarnet(...).coutTotal).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const prixBase = randInt(rng, 20, 200);
    const demiCents = randInt(rng, 2, 10);
    const tickCents = pick(rng, [5, 10, 20] as const);
    const t1c = randInt(rng, 2, 6);
    const t2c = randInt(rng, 2, 6);
    const t3c = randInt(rng, 3, 8);
    const qExtraC = randInt(rng, 1, t2c + t3c - 1);
    const tauxPb = pick(rng, [1, 2, 3, 5] as const);
    const minimum = pick(rng, [15, 20, 25, 30] as const);

    const bid = prixBase - demiCents / 100;
    const niveaux = [
      { prix: prixBase + demiCents / 100, taille: t1c * 100 },
      { prix: prixBase + (demiCents + tickCents) / 100, taille: t2c * 100 },
      { prix: prixBase + (demiCents + 2 * tickCents) / 100, taille: t3c * 100 },
    ];
    const ask1 = niveaux[0].prix;
    const quantite = (t1c + qExtraC) * 100;
    const milieu = milieuFourchette(bid, ask1);
    const exec = executionCarnet(quantite, niveaux);
    const slippageTotal = quantite * slippage(exec.prixMoyen, milieu, 'achat');
    const commission = commissionTotale(exec.coutTotal, tauxPb, minimum);
    const reponse = r2(slippageTotal + commission);
    const demiFourchette = r2(coutTraverseeSpread(quantite, bid, ask1, 'achat'));
    const profondeur = r2(quantite * slippage(exec.prixMoyen, ask1, 'achat'));
    const proportionnelle = r2((exec.coutTotal * tauxPb) / 10_000);
    const mord = proportionnelle < minimum;
    const pbTotal = r2(((slippageTotal + commission) / exec.coutTotal) * 10_000);

    const en = langue === 'en';
    const { f, eur, pb } = formatters(langue);
    return {
      enonce: en
        ? `A stock shows ${eur(bid)} on the bid; on the ask side: ${f(niveaux[0].taille, 0)} shares at ${eur(ask1)}, ${f(niveaux[1].taille, 0)} at ${eur(niveaux[1].prix)}, ${f(niveaux[2].taille, 0)} at ${eur(niveaux[2].prix)}. You buy ${f(quantite, 0)} shares **at market**. Your broker charges ${f(tauxPb, 0)} bp of the executed amount, with a ${eur(minimum, 0)} minimum.\n\n**What is the total friction cost of this execution — half-spread, depth and commission — versus the mid, in euros?**`
        : `Un titre affiche ${eur(bid)} au bid ; à la vente : ${f(niveaux[0].taille, 0)} titres à ${eur(ask1)}, ${f(niveaux[1].taille, 0)} à ${eur(niveaux[1].prix)}, ${f(niveaux[2].taille, 0)} à ${eur(niveaux[2].prix)}. Vous achetez ${f(quantite, 0)} titres **au marché**. Votre courtier facture ${f(tauxPb, 0)} pb du montant exécuté, avec un minimum de ${eur(minimum, 0)}.\n\n**Quel est le coût total de friction de cette exécution — demi-fourchette, profondeur et commission — par rapport au milieu, en euros ?**`,
      reponse,
      tolerance: 0.005,
      unite: '€',
      etapes: [
        {
          titre: en ? 'Layer 1 — the half-spread' : 'Étage 1 — la demi-fourchette',
          contenu: en
            ? `Mid = (${f(bid)} + ${f(ask1)})/2 = ${eur(milieu)}. Buying at the ask while the value sits at the mid costs ${f(quantite, 0)} × (${f(ask1)} − ${f(milieu)}) = **${eur(demiFourchette)}** — the price of immediacy, due even if the order had fit in the top of book.`
            : `Milieu = (${f(bid)} + ${f(ask1)})/2 = ${eur(milieu)}. Acheter à l'ask quand la valeur est au milieu coûte ${f(quantite, 0)} × (${f(ask1)} − ${f(milieu)}) = **${eur(demiFourchette)}** — le prix de l'immédiateté, dû même si l'ordre avait tenu dans le premier niveau.`,
        },
        {
          titre: en ? 'Layer 2 — walk the book: depth slippage' : 'Étage 2 — marcher le carnet : la profondeur',
          contenu: en
            ? `The order sweeps ${f(exec.niveauxConsommes, 0)} levels: ${eur(exec.coutTotal)} in total, average price ${eur(r2(exec.prixMoyen))}. Beyond the best ask, the depth layer adds ${f(quantite, 0)} × (${f(r2(exec.prixMoyen))} − ${f(ask1)}) = **${eur(profondeur)}**. Total slippage versus the mid: ${eur(r2(slippageTotal))}.`
            : `L'ordre balaie ${f(exec.niveauxConsommes, 0)} niveaux : ${eur(exec.coutTotal)} déboursés, prix moyen ${eur(r2(exec.prixMoyen))}. Au-delà du meilleur ask, l'étage de profondeur ajoute ${f(quantite, 0)} × (${f(r2(exec.prixMoyen))} − ${f(ask1)}) = **${eur(profondeur)}**. Slippage total contre le milieu : ${eur(r2(slippageTotal))}.`,
        },
        {
          titre: en ? 'Layer 3 — the commission' : 'Étage 3 — la commission',
          contenu: en
            ? `On the executed amount: ${f(exec.coutTotal, 0)} × ${f(tauxPb, 0)}/10,000 = ${eur(proportionnelle)}. ${mord ? `Below the ${eur(minimum, 0)} minimum — the minimum bites:` : `Above the ${eur(minimum, 0)} minimum — the proportional leg applies:`} commission = **${eur(r2(commission))}**.`
            : `Sur le montant exécuté : ${f(exec.coutTotal, 0)} × ${f(tauxPb, 0)}/10 000 = ${eur(proportionnelle)}. ${mord ? `Sous le minimum de ${eur(minimum, 0)} — le minimum mord :` : `Au-dessus du minimum de ${eur(minimum, 0)} — la part proportionnelle s'applique :`} commission = **${eur(r2(commission))}**.`,
        },
        {
          titre: en ? 'Add up — and convert to basis points' : 'Additionner — et convertir en points de base',
          contenu: en
            ? `$\\text{total} = ${f(demiFourchette)} + ${f(profondeur)} + ${f(r2(commission))}$ = **${eur(reponse)}**, i.e. ${pb(pbTotal)} of the notional. The quoted price showed none of it — this is the true cost of an execution, and exactly why buy-side traders slice large orders (VWAP/TWAP) instead of walking the book in one go.`
            : `$\\text{total} = ${f(demiFourchette)} + ${f(profondeur)} + ${f(r2(commission))}$ = **${eur(reponse)}**, soit ${pb(pbTotal)} du notionnel. Le cours affiché ne montrait rien de tout cela — c'est le coût réel d'une exécution, et la raison exacte pour laquelle les traders buy-side découpent les gros ordres (VWAP/TWAP) au lieu de marcher le carnet d'un coup.`,
        },
      ],
      pieges: [
        en
          ? mord
            ? `Forgetting the commission minimum: the bp schedule gives ${eur(proportionnelle)}, but the minimum bites at ${eur(minimum, 0)} — and skipping the commission entirely leaves only ${eur(r2(slippageTotal))} of slippage.`
            : `Forgetting the commission: the slippage alone (${eur(r2(slippageTotal))}) is not the full bill — the broker adds ${eur(r2(commission))} on top.`
          : mord
            ? `Oublier le minimum de commission : le barème en pb donne ${eur(proportionnelle)}, mais le minimum mord à ${eur(minimum, 0)} — et zapper la commission entièrement ne laisse que ${eur(r2(slippageTotal))} de slippage.`
            : `Oublier la commission : le slippage seul (${eur(r2(slippageTotal))}) n'est pas la facture complète — le courtier ajoute ${eur(r2(commission))} par-dessus.`,
        en
          ? `Measuring against the best ask instead of the mid: the half-spread (${eur(demiFourchette)}) disappears from the bill — yet it is the first layer of the true cost, paid by every market order.`
          : `Mesurer contre le meilleur ask au lieu du milieu : la demi-fourchette (${eur(demiFourchette)}) disparaît de la facture — c'est pourtant le premier étage du coût réel, payé par tout ordre au marché.`,
      ],
    };
  },
};

export const exercices: ExerciseGenerator[] = [
  genSpreadPb,
  genCoutTraversee,
  genMarcherCarnet,
  genSlippage,
  genPnlMarketMaker,
  genCommission,
  genCoutTotalExecution,
];
