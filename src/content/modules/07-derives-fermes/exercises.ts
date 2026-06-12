/**
 * Les 14 générateurs d'exercices d'application du module Dérivés fermes :
 * futures, FRA & swaps.
 *
 * BILINGUES : generate(seed, langue = 'fr'). Invariant absolu : TOUS les tirages
 * aléatoires sont effectués AVANT toute branche de langue — un même seed produit
 * exactement les mêmes nombres, la même réponse et la même tolérance en français
 * et en anglais. Seuls les textes (énoncé, étapes, pièges, unité textuelle) changent.
 *
 * Tous les calculs passent par calculs.ts (aucune formule recopiée). Conventions
 * du module (en-tête de calculs.ts) : intérêts LINÉAIRES sur les horizons ≤ 1 an
 * (portage, FRA, forward implicite), composition ANNUELLE au-delà (facteurs
 * d'actualisation, swaps) ; long = +1, short = −1 ; un flux négatif est un
 * décaissement. Les pièges martelés ici : l'appel de marge ramène à la marge
 * INITIALE (pas à la maintenance), le prix d'un futures de taux vaut 100 − taux
 * (le vendeur gagne à la hausse des taux), le long FRA et le payeur fixe gagnent
 * quand les taux montent, et le notionnel n'est pas un risque. Multiplicateurs
 * canoniques : E-mini 50 $/pt, CAC 40 et Euro Stoxx 10 €/pt, Euribor 3 mois
 * 25 €/pb (demi-tick 12,50 €). L'ordre des tirages de chaque moule est documenté
 * dans son commentaire « Tirages (ordre strict) ».
 */
import { formatNombreLangue } from '../../../engine/answers';
import { mulberry32, pick, randFloat, randInt } from '../../../engine/rng';
import type { ExerciseGenerator, Langue } from '../../../engine/types';
import {
  appelDeMarge,
  effetLevier,
  facteurActualisation,
  margeVariation,
  nombreContratsCouverture,
  pnlFutures,
  prixForwardIndice,
  reglementFra,
  tauxForwardImplicite,
  tauxSwapParitaire,
  valeurSwapPayeurFixe,
} from './calculs';

const M7 = '07-derives-fermes';

const r2 = (v: number) => Math.round(v * 100) / 100;
const r4 = (v: number) => Math.round(v * 10_000) / 10_000;
const r6 = (v: number) => Math.round(v * 1_000_000) / 1_000_000;

/** Formateurs dépendants de la langue : nombre, cotation à décimales fixes, devises, pourcentage. */
function formatters(langue: Langue) {
  const f = (v: number, d = 2) => formatNombreLangue(langue, v, d);
  /** Cotation à décimales FIXES (zéros conservés) : 96,50 et non 96,5. */
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
  /** Nombre signé (+2 400 / −800), pour afficher des P&L, des flux ou des écarts. */
  const sgn = (v: number, d = 2) => (v > 0 ? `+${f(v, d)}` : f(v, d));
  return { f, fix, eur, usd, pct, sgn };
}

/** « 3 mois » / « 6 mois » / « 1 an » selon l'horizon en années. */
function libelleHorizon(annees: number, en: boolean): string {
  if (annees < 1 || !Number.isInteger(annees)) {
    const mois = Math.round(annees * 12);
    return en ? `${mois} months` : `${mois} mois`;
  }
  if (annees === 1) return en ? '1 year' : '1 an';
  return en ? `${annees} years` : `${annees} ans`;
}

// ---------------------------------------------------------------------------
// 1. P&L d'une position futures (N1)
// ---------------------------------------------------------------------------
export const genPnlPosition: ExerciseGenerator = {
  id: 'm7-ex-01',
  moduleId: M7,
  titre: 'P&L d\'une position futures',
  titreEn: 'Futures position P&L',
  difficulte: 1,
  // Tirages (ordre strict) : 1. contrat = pick(['cac', 'emini']) · 2. eCac = randInt(5600, 8200)
  // · 3. eEmini = randInt(4300, 6500) · 4. sens = pick([1, −1]) · 5. nb = randInt(2, 10)
  // · 6. dirMarche = pick([1, −1]) · 7. deltaPts = randInt(20, 180).
  // Tous les tirages ont lieu, puis on retient l'entrée du contrat choisi (CAC 10 €/pt,
  // E-mini 50 $/pt) ; sortie = entrée + dirMarche × deltaPts ; réponse via pnlFutures.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const contrat = pick(rng, ['cac', 'emini'] as const);
    const eCac = randInt(rng, 5600, 8200);
    const eEmini = randInt(rng, 4300, 6500);
    const sens = pick(rng, [1, -1] as const);
    const nb = randInt(rng, 2, 10);
    const dirMarche = pick(rng, [1, -1] as const);
    const deltaPts = randInt(rng, 20, 180);

    const estCac = contrat === 'cac';
    const mult = estCac ? 10 : 50;
    const entree = estCac ? eCac : eEmini;
    const sortie = entree + dirMarche * deltaPts;
    const reponse = r2(pnlFutures(entree, sortie, mult, nb, sens));
    const diff = sortie - entree;
    const valeurPoint = mult * nb;
    const notionnel = entree * mult * nb;
    const fauxSansMult = r2(diff * nb * sens);
    const estLong = sens === 1;

    const en = langue === 'en';
    const { f, sgn } = formatters(langue);
    const cash = estCac ? formatters(langue).eur : formatters(langue).usd;
    const nomContrat = estCac ? 'CAC 40 (Euronext)' : 'E-mini S&P 500 (CME)';
    const multTexte = estCac ? (en ? '€10/point' : '10 €/point') : (en ? '$50/point' : '50 $/point');
    return {
      enonce: en
        ? `On the index desk, you ${estLong ? 'go long' : 'go short'} ${f(nb, 0)} ${nomContrat} futures contracts (${multTexte}) at ${f(entree, 0)} points. A few sessions later, you close the position at ${f(sortie, 0)} points.\n\n**What is your P&L, in ${estCac ? 'euros' : 'dollars'} (with its sign)?**`
        : `Sur le desk indices, vous prenez une position ${estLong ? 'longue (acheteuse)' : 'courte (vendeuse)'} de ${f(nb, 0)} contrats futures ${nomContrat}, multiplicateur ${multTexte}, exécutés à ${f(entree, 0)} points. Quelques séances plus tard, vous soldez la position à ${f(sortie, 0)} points.\n\n**Quel est votre P&L, en ${estCac ? 'euros' : 'dollars'} (avec son signe) ?**`,
      reponse,
      tolerance: 0.005,
      unite: estCac ? '€' : '$',
      etapes: [
        {
          titre: en ? 'Size the position first' : 'D\'abord mesurer la position',
          contenu: en
            ? `Each index point is worth multiplier × contracts = ${f(mult, 0)} × ${f(nb, 0)} = ${cash(valeurPoint, 0)}. The notional at stake is ${f(entree, 0)} × ${f(mult, 0)} × ${f(nb, 0)} = ${cash(notionnel, 0)} — you never pay it (you post a margin instead), but the P&L runs on the FULL notional, not on your deposit.`
            : `Chaque point d'indice vaut multiplicateur × contrats = ${f(mult, 0)} × ${f(nb, 0)} = ${cash(valeurPoint, 0)}. Le notionnel engagé est ${f(entree, 0)} × ${f(mult, 0)} × ${f(nb, 0)} = ${cash(notionnel, 0)} — vous ne le payez jamais (vous déposez une marge), mais le P&L court sur le notionnel ENTIER, pas sur votre dépôt.`,
        },
        {
          titre: en ? 'The P&L formula, sign included' : 'La formule du P&L, signe compris',
          contenu: en
            ? `P&L $= (\\text{exit} - \\text{entry}) × \\text{mult} × n × \\text{dir} = (${f(sortie, 0)} - ${f(entree, 0)}) × ${f(mult, 0)} × ${f(nb, 0)} × (${sens === 1 ? '+1' : '−1'})$ = **${sgn(reponse, 0)} ${estCac ? '€' : '$'}**. The move of ${sgn(diff, 0)} points × ${cash(valeurPoint, 0)} per point, read through your direction (long = +1, short = −1).`
            : `P&L $= (\\text{sortie} - \\text{entrée}) × \\text{mult} × n × \\text{sens} = (${f(sortie, 0)} - ${f(entree, 0)}) × ${f(mult, 0)} × ${f(nb, 0)} × (${sens === 1 ? '+1' : '−1'})$ = **${sgn(reponse, 0)} ${estCac ? '€' : '$'}**. Le mouvement de ${sgn(diff, 0)} points × ${cash(valeurPoint, 0)} le point, lu à travers votre sens (long = +1, short = −1).`,
        },
        {
          titre: en ? 'Zero-sum: read the other side' : 'Somme nulle : lire l\'autre camp',
          contenu: en
            ? `Your counterparty's P&L is exactly ${sgn(-reponse, 0)} ${estCac ? '€' : '$'}: a firm commitment is a zero-sum game — no wealth is created, risk just changes hands. ${reponse > 0 ? 'You were positioned with the move' : 'You were positioned against the move'}: the ${estLong ? 'long gains when the index rises and loses when it falls' : 'short gains when the index falls and loses when it rises'} — linear, symmetric, no floor and no cap.`
            : `Le P&L de votre contrepartie vaut exactement ${sgn(-reponse, 0)} ${estCac ? '€' : '$'} : l'engagement ferme est un jeu à somme nulle — aucune richesse créée, le risque ne fait que changer de mains. ${reponse > 0 ? 'Vous étiez du côté du mouvement' : 'Vous étiez à contre-courant du mouvement'} : le ${estLong ? 'long gagne quand l\'indice monte et perd quand il baisse' : 'short gagne quand l\'indice baisse et perd quand il monte'} — linéaire, symétrique, sans plancher ni plafond.`,
        },
      ],
      pieges: [
        en
          ? `Forgetting the multiplier: ${sgn(diff, 0)} points × ${f(nb, 0)} contracts = ${sgn(fauxSansMult, 0)} — off by a factor of ${f(mult, 0)}. A futures P&L is always points × MULTIPLIER × contracts: the multiplier is what turns an index level into money.`
          : `Oublier le multiplicateur : ${sgn(diff, 0)} points × ${f(nb, 0)} contrats = ${sgn(fauxSansMult, 0)} — un facteur ${f(mult, 0)} d'écart. Un P&L futures vaut toujours points × MULTIPLICATEUR × contrats : c'est le multiplicateur qui transforme un niveau d'indice en argent.`,
        en
          ? `Dropping the direction: announcing ${sgn(-reponse, 0)} instead of ${sgn(reponse, 0)}. A ${estLong ? 'long' : 'short'} position reads the move ${estLong ? 'as it comes' : 'in reverse'} — lock the reflex before computing anything: who gains when the market ${dirMarche === 1 ? 'rises' : 'falls'}?`
          : `Perdre le sens en route : annoncer ${sgn(-reponse, 0)} au lieu de ${sgn(reponse, 0)}. Une position ${estLong ? 'longue lit le mouvement tel quel' : 'courte lit le mouvement à l\'envers'} — verrouillez le réflexe avant tout calcul : qui gagne quand le marché ${dirMarche === 1 ? 'monte' : 'baisse'} ?`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 2. L'effet de levier de la marge (N1)
// ---------------------------------------------------------------------------
export const genEffetLevierMarge: ExerciseGenerator = {
  id: 'm7-ex-02',
  moduleId: M7,
  titre: 'L\'effet de levier de la marge',
  titreEn: 'Margin leverage',
  difficulte: 1,
  // Tirages (ordre strict) : 1. marge = pick([5, 8, 10, 12, 20]) · 2. scenario = pick(['gain', 'crash'])
  // · 3. vGain = randFloat(0.8, 4, 1) · 4. vExtra = randFloat(1, 6, 1).
  // Tous les tirages ont lieu, puis : gain ⇒ variation = vGain ; crash ⇒ variation =
  // −(marge + vExtra) (perte STRICTEMENT supérieure à la mise, garantie). Réponse via effetLevier.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const marge = pick(rng, [5, 8, 10, 12, 20] as const);
    const scenario = pick(rng, ['gain', 'crash'] as const);
    const vGain = randFloat(rng, 0.8, 4, 1);
    const vExtra = randFloat(rng, 1, 6, 1);

    const crash = scenario === 'crash';
    const variation = crash ? -r2(marge + vExtra) : vGain;
    const reponse = r2(effetLevier(variation, marge));
    const levier = r2(100 / marge);
    const manque = r2(Math.abs(reponse) - 100); // en crash : ce qui reste dû au-delà de la mise

    const en = langue === 'en';
    const { f, pct, sgn } = formatters(langue);
    return {
      enonce: en
        ? `You open a long position on an index futures by posting an initial margin of ${pct(marge, 0)} of the notional. ${crash ? `On a crash day, the index collapses by ${f(Math.abs(variation), 1)}%.` : `Over the session, the index gains ${f(variation, 1)}%.`}\n\n**By how much does your stake (the margin deposit) change, in % (with its sign)?**`
        : `Vous ouvrez une position longue sur un futures d'indice en déposant une marge initiale de ${pct(marge, 0)} du notionnel. ${crash ? `Un jour de krach, l'indice s'effondre de ${f(Math.abs(variation), 1)} %.` : `Dans la séance, l'indice progresse de ${f(variation, 1)} %.`}\n\n**De combien varie votre mise (le dépôt de marge), en % (avec son signe) ?**`,
      reponse,
      tolerance: 0.005,
      unite: '%',
      etapes: [
        {
          titre: en ? 'The leverage hidden in the margin' : 'Le levier caché dans la marge',
          contenu: en
            ? `With ${pct(marge, 0)} down, you control 100/${f(marge, 0)} = **×${f(levier, 1)}** your stake: the position runs on the full notional while only the margin is yours. Every move of the underlying is therefore multiplied by ${f(levier, 1)} on the deposit.`
            : `Avec ${pct(marge, 0)} déposés, vous contrôlez 100/${f(marge, 0)} = **×${f(levier, 1)}** votre mise : la position court sur le notionnel entier alors que seule la marge vous appartient. Chaque mouvement du sous-jacent est donc démultiplié par ${f(levier, 1)} sur le dépôt.`,
        },
        {
          titre: en ? 'Apply the leverage to the move' : 'Appliquer le levier au mouvement',
          contenu: en
            ? `$\\text{stake change} = \\dfrac{\\text{underlying move}}{\\text{margin}} = \\dfrac{${sgn(variation, 1)}\\,\\%}{${f(marge, 0)}\\,\\%}$ = **${sgn(reponse, 1)} %** of the deposit. The same division as chapter 1's ${en ? '' : ''}+2 %/10 % = +20 % — leverage is nothing but this ratio.`
            : `$\\text{variation de la mise} = \\dfrac{\\text{variation du sous-jacent}}{\\text{marge}} = \\dfrac{${sgn(variation, 1)}\\,\\%}{${f(marge, 0)}\\,\\%}$ = **${sgn(reponse, 1)} %** du dépôt. La même division que le +2 %/10 % = +20 % du chapitre 1 — le levier n'est rien d'autre que ce ratio.`,
        },
        {
          titre: en ? (crash ? 'Read the disaster in full' : 'Read the seduction — and its mirror') : crash ? 'Lire le désastre en entier' : 'Lire la séduction — et son miroir',
          contenu: en
            ? crash
              ? `${f(Math.abs(reponse), 1)}% of the stake lost: the deposit is wiped out AND you still owe ${pct(manque, 1)} of it in fresh cash — the loss went through your margin and kept running. A stock can only fall to zero (−100%); a firm commitment has no such floor, because you are engaged on the whole notional. This is ruin beyond the margin.`
              : `+${f(reponse, 1)}% in one session, where the cash equity holder makes +${f(variation, 1)}%: that is the seduction. Now run the same arithmetic on a −${f(marge, 0)}% day: the stake is entirely gone — and every point beyond is owed in fresh cash. Leverage creates no return; it dilates BOTH tails of the distribution.`
            : crash
              ? `${f(Math.abs(reponse), 1)} % de la mise perdus : le dépôt est effacé ET vous devez encore ${pct(manque, 1)} de la mise en argent frais — la perte a traversé votre marge et continué sa course. Une action ne peut tomber qu'à zéro (−100 %) ; l'engagement ferme n'a pas ce plancher, car vous êtes engagé sur le notionnel entier. C'est la ruine au-delà de la marge.`
              : `+${f(reponse, 1)} % en une séance, là où l'actionnaire au comptant gagne +${f(variation, 1)} % : voilà la séduction. Déroulez maintenant la même arithmétique un jour à −${f(marge, 0)} % : la mise est intégralement effacée — et chaque point au-delà se paie en argent frais. Le levier ne crée pas de rendement ; il dilate les DEUX queues de la distribution.`,
        },
      ],
      pieges: [
        en
          ? crash
            ? `Capping the loss at −100% "like a stock": a stock is an INVESTED amount, a futures is a COMMITTED signature on the full notional. At ${pct(marge, 0)} margin, any move beyond −${f(marge, 0)}% is paid in fresh cash — here ${pct(manque, 1)} of the stake on top of losing it all.`
            : `Believing the profile is capped like a stock's: the +${f(reponse, 1)}% has an exact mirror image — at ${pct(marge, 0)} margin, a move of −${f(marge, 0)}% wipes the stake and every point beyond is owed in fresh cash. Whoever sells you leverage without the ruin beyond the margin sells you half a product.`
          : crash
            ? `Plafonner la perte à −100 % « comme une action » : une action est une somme INVESTIE, un futures une signature ENGAGÉE sur le notionnel entier. À ${pct(marge, 0)} de marge, tout mouvement au-delà de −${f(marge, 0)} % se paie en argent frais — ici ${pct(manque, 1)} de la mise en plus de sa perte intégrale.`
            : `Croire le profil plafonné comme celui d'une action : le +${f(reponse, 1)} % a un miroir exact — à ${pct(marge, 0)} de marge, un mouvement de −${f(marge, 0)} % efface la mise et chaque point au-delà se doit en argent frais. Qui vous vend le levier sans la ruine au-delà de la marge vous vend la moitié d'un produit.`,
        en
          ? `Confusing the underlying's move with the stake's: ${sgn(variation, 1)}% is the move of the NOTIONAL; on the deposit it is multiplied by ×${f(levier, 1)}. Answering ${sgn(variation, 1)}% means reading a leveraged position as a cash one — the whole point of the margin is precisely that it is small.`
          : `Confondre la variation du sous-jacent et celle de la mise : ${sgn(variation, 1)} % est le mouvement du NOTIONNEL ; sur le dépôt, il est démultiplié ×${f(levier, 1)}. Répondre ${sgn(variation, 1)} %, c'est lire une position à levier comme une position au comptant — tout l'objet de la marge est justement d'être petite.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 3. La marge de variation du soir (N1)
// ---------------------------------------------------------------------------
export const genMargeVariationSoir: ExerciseGenerator = {
  id: 'm7-ex-03',
  moduleId: M7,
  titre: 'La marge de variation du soir',
  titreEn: 'The evening variation margin',
  difficulte: 1,
  // Tirages (ordre strict) : 1. veille = randInt(4600, 7800) · 2. sens = pick([1, −1])
  // · 3. nb = randInt(2, 8) · 4. dirJour = pick([1, −1]) · 5. deltaPts = randInt(15, 120).
  // Multiplicateur 10 €/pt (contrat d'indice type CAC/Euro Stoxx) ; prixJour = veille
  // + dirJour × deltaPts ; réponse via margeVariation (flux signé du soir).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const veille = randInt(rng, 4600, 7800);
    const sens = pick(rng, [1, -1] as const);
    const nb = randInt(rng, 2, 8);
    const dirJour = pick(rng, [1, -1] as const);
    const deltaPts = randInt(rng, 15, 120);

    const mult = 10;
    const prixJour = veille + dirJour * deltaPts;
    const reponse = r2(margeVariation(veille, prixJour, mult, nb, sens));
    const diff = prixJour - veille;
    const estLong = sens === 1;
    const debite = reponse < 0;

    const en = langue === 'en';
    const { f, eur, sgn } = formatters(langue);
    return {
      enonce: en
        ? `You hold a ${estLong ? 'long' : 'short'} position of ${f(nb, 0)} contracts on an index futures (multiplier €10/point). Yesterday's settlement price was ${f(veille, 0)} points; tonight's settlement comes out at ${f(prixJour, 0)} points.\n\n**What variation-margin cash flow hits your margin account tonight, in euros (with its sign)?**`
        : `Vous détenez une position ${estLong ? 'longue' : 'courte'} de ${f(nb, 0)} contrats sur un futures d'indice (multiplicateur 10 €/point). Hier soir, le cours de compensation s'établissait à ${f(veille, 0)} points ; ce soir, il ressort à ${f(prixJour, 0)} points.\n\n**Quel flux de marge de variation votre compte enregistre-t-il ce soir, en euros (avec son signe) ?**`,
      reponse,
      tolerance: 0.005,
      unite: '€',
      etapes: [
        {
          titre: en ? 'The daily mark-to-market' : 'Le mark-to-market quotidien',
          contenu: en
            ? `Every evening, the clearing house fictitiously closes your position at the settlement price: gains are credited, losses debited, in cash, that same night. The P&L of a futures does not wait for expiry — it is paid every single day, one settlement price against the previous one.`
            : `Chaque soir, la chambre solde fictivement votre position au cours de compensation : gains crédités, pertes débitées, en cash, le soir même. Le P&L d'un futures n'attend pas l'échéance — il se paie tous les jours, un cours de compensation contre celui de la veille.`,
        },
        {
          titre: en ? 'Compute tonight\'s flow' : 'Calculer le flux du soir',
          contenu: en
            ? `$\\text{flow} = (\\text{today} - \\text{yesterday}) × \\text{mult} × n × \\text{dir} = (${f(prixJour, 0)} - ${f(veille, 0)}) × ${f(mult, 0)} × ${f(nb, 0)} × (${sens === 1 ? '+1' : '−1'})$ = **${sgn(reponse, 0)} €**. The ${sgn(diff, 0)}-point move, at ${eur(mult * nb, 0)} per point, read through your direction.`
            : `$\\text{flux} = (\\text{jour} - \\text{veille}) × \\text{mult} × n × \\text{sens} = (${f(prixJour, 0)} - ${f(veille, 0)}) × ${f(mult, 0)} × ${f(nb, 0)} × (${sens === 1 ? '+1' : '−1'})$ = **${sgn(reponse, 0)} €**. Le mouvement de ${sgn(diff, 0)} points, à ${eur(mult * nb, 0)} le point, lu à travers votre sens.`,
        },
        {
          titre: en ? 'Read the flow like a treasurer' : 'Lire le flux comme un trésorier',
          contenu: en
            ? `${debite ? `Negative flow: your account is DEBITED ${eur(Math.abs(reponse), 0)} tonight — real cash leaves, whatever you think of the position's future.` : `Positive flow: your account is CREDITED ${eur(reponse, 0)} tonight — cash you can actually withdraw.`} Your counterparty books exactly the opposite (${sgn(-reponse, 0)} €): the clearing house only moves money from one side to the other. Summed over the life of the position, these daily flows rebuild the total P&L — the mark-to-market spreads it out, nothing more.`
            : `${debite ? `Flux négatif : votre compte est DÉBITÉ de ${eur(Math.abs(reponse), 0)} ce soir — du cash sort réellement, quoi que vous pensiez de l'avenir de la position.` : `Flux positif : votre compte est CRÉDITÉ de ${eur(reponse, 0)} ce soir — du cash réellement disponible.`} Votre contrepartie enregistre exactement l'inverse (${sgn(-reponse, 0)} €) : la chambre ne fait que déplacer l'argent d'un camp à l'autre. Sommés sur la vie de la position, ces flux quotidiens reconstituent le P&L total — le mark-to-market l'étale, rien de plus.`,
        },
      ],
      pieges: [
        en
          ? `Thinking nothing happens before you close the position: a futures pays (or charges) every evening — and a string of adverse settlements can drain the account below the maintenance margin and force a margin call long before your view gets a chance to be right. The cash leaves first; the thesis is judged later.`
          : `Croire qu'il ne se passe rien avant le débouclage : un futures paie (ou facture) chaque soir — et une série de compensations adverses peut vider le compte sous la marge de maintenance et déclencher un appel bien avant que votre scénario ait eu le temps d'avoir raison. Le cash sort d'abord ; la thèse se juge ensuite.`,
        en
          ? `Sign slip on the ${estLong ? 'long' : 'short'}: announcing ${sgn(-reponse, 0)} € instead of ${sgn(reponse, 0)} €. The ${estLong ? 'long is debited when the price falls and credited when it rises' : 'short is credited when the price falls and debited when it rises'} — the flow is the daily P&L, signed by the direction, not the price move alone.`
          : `Erreur de signe sur le ${estLong ? 'long' : 'short'} : annoncer ${sgn(-reponse, 0)} € au lieu de ${sgn(reponse, 0)} €. Le ${estLong ? 'long est débité quand le cours baisse et crédité quand il monte' : 'short est crédité quand le cours baisse et débité quand il monte'} — le flux est le P&L du jour, signé par le sens, pas le seul mouvement du prix.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 4. L'appel de marge : retour à l'initiale (N2)
// ---------------------------------------------------------------------------
export const genAppelMarge: ExerciseGenerator = {
  id: 'm7-ex-04',
  moduleId: M7,
  titre: 'L\'appel de marge : retour à l\'initiale',
  titreEn: 'Margin call: back to the initial margin',
  difficulte: 2,
  // Tirages (ordre strict) : 1. initCent = randInt(50, 90) (marge initiale = ×100, 5 000–9 000 €)
  // · 2. ratio = pick([0.7, 0.75, 0.8]) · 3. scenario = pick(['appel', 'appel', 'tampon'])
  // · 4. dSous = randInt(2, 20) · 5. dEntre = randInt(1, gapCent − 1).
  // maintenance = arrondi(initiale × ratio) à la centaine ; appel ⇒ solde = maintenance − dSous×100
  // (strictement sous le seuil) ; tampon ⇒ solde = maintenance + dEntre×100 (sous l'initiale mais
  // AU-DESSUS de la maintenance : aucun appel — réponse 0). Réponse via appelDeMarge.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const initCent = randInt(rng, 50, 90);
    const ratio = pick(rng, [0.7, 0.75, 0.8] as const);
    const scenario = pick(rng, ['appel', 'appel', 'tampon'] as const);
    const dSous = randInt(rng, 2, 20);
    const initiale = initCent * 100;
    const maintenance = Math.round((initiale * ratio) / 100) * 100;
    const gapCent = (initiale - maintenance) / 100;
    const dEntre = randInt(rng, 1, gapCent - 1);

    const estAppel = scenario === 'appel';
    const solde = estAppel ? maintenance - dSous * 100 : maintenance + dEntre * 100;
    const reponse = appelDeMarge(solde, maintenance, initiale);
    const fauxMaintenance = maintenance - solde; // l'erreur classique (positive seulement si appel)

    const en = langue === 'en';
    const { f, eur } = formatters(langue);
    return {
      enonce: en
        ? `On your futures position, the broker requires an initial margin of ${eur(initiale, 0)} and a maintenance margin of ${eur(maintenance, 0)}. After tonight's variation-margin debit, your margin account shows ${eur(solde, 0)}.\n\n**What payment does the margin call require (0 if none), in euros?**`
        : `Sur votre position futures, le courtier exige une marge initiale de ${eur(initiale, 0)} et une marge de maintenance de ${eur(maintenance, 0)}. Après le débit de marge de variation de ce soir, votre compte affiche ${eur(solde, 0)}.\n\n**Quel versement l'appel de marge exige-t-il (0 si aucun), en euros ?**`,
      reponse,
      tolerance: 1,
      toleranceMode: 'absolu',
      unite: '€',
      etapes: [
        {
          titre: en ? 'The trigger: the maintenance margin' : 'Le déclencheur : la maintenance',
          contenu: en
            ? estAppel
              ? `Compare the balance to the MAINTENANCE margin: ${f(solde, 0)} < ${f(maintenance, 0)} — the account sits strictly below the floor, the margin call fires. The size of tonight's loss is irrelevant; only the level of the balance against the threshold matters.`
              : `Compare the balance to the MAINTENANCE margin: ${f(solde, 0)} ≥ ${f(maintenance, 0)} — the account is dented (it sits below the initial margin of ${f(initiale, 0)}) but regulatorily sound. The call only fires STRICTLY below the maintenance floor: tonight, nothing happens.`
              : estAppel
              ? `Comparez le solde à la marge de MAINTENANCE : ${f(solde, 0)} < ${f(maintenance, 0)} — le compte est strictement sous le plancher, l'appel de marge se déclenche. L'ampleur de la perte du soir n'a aucune importance ; seul compte le niveau du solde face au seuil.`
              : `Comparez le solde à la marge de MAINTENANCE : ${f(solde, 0)} ≥ ${f(maintenance, 0)} — le compte est entamé (il vit sous la marge initiale de ${f(initiale, 0)}) mais réglementairement sain. L'appel ne se déclenche que STRICTEMENT sous la maintenance : ce soir, il ne se passe rien.`,
        },
        {
          titre: en ? 'The target: the initial margin' : 'La cible : l\'initiale',
          contenu: en
            ? estAppel
              ? `US futures convention: the payment must bring the account back to the INITIAL margin, not the maintenance — $\\text{call} = \\text{initial} - \\text{balance} = ${f(initiale, 0)} - ${f(solde, 0)}$ = **${eur(reponse, 0)}**. Not ${f(initiale, 0)} − ${f(maintenance, 0)}, and above all not ${f(maintenance, 0)} − ${f(solde, 0)} = ${eur(fauxMaintenance, 0)}.`
              : `The answer is **€0** — but keep the rule loaded for the day the floor breaks: the call would then require coming back to the INITIAL margin (${eur(initiale, 0)}), not the maintenance. One more adverse tick below ${f(maintenance, 0)} and the payment jumps to over ${eur(initiale - maintenance, 0)} at once.`
              : estAppel
              ? `Convention américaine des futures : le versement doit ramener le compte à la marge INITIALE, pas à la maintenance — $\\text{appel} = \\text{initiale} - \\text{solde} = ${f(initiale, 0)} - ${f(solde, 0)}$ = **${eur(reponse, 0)}**. Ni ${f(initiale, 0)} − ${f(maintenance, 0)}, ni surtout ${f(maintenance, 0)} − ${f(solde, 0)} = ${eur(fauxMaintenance, 0)}.`
              : `La réponse est **0 €** — mais gardez la règle chargée pour le jour où le plancher cède : l'appel exigerait alors de revenir à la marge INITIALE (${eur(initiale, 0)}), pas à la maintenance. Un tick adverse de plus sous ${f(maintenance, 0)} et le versement saute d'un coup au-delà de ${eur(initiale - maintenance, 0)}.`,
        },
        {
          titre: en ? 'Why the full cushion' : 'Pourquoi le coussin entier',
          contenu: en
            ? `If the account were only topped back up to the maintenance, the slightest adverse tick the next morning would trigger a new call — the system would ring every day. The triplet to memorise: the maintenance is the TRIGGER, the initial margin is the TARGET of the payment. And a call is not a suggestion: unpaid within the deadline, the broker liquidates the position at market — by construction at the worst possible moment.`
            : `Si l'on ne recomplétait le compte qu'à la maintenance, le moindre tick adverse du lendemain redéclencherait un appel — le système sonnerait tous les jours. Le triplet à mémoriser : la maintenance est le DÉCLENCHEUR, l'initiale est la CIBLE du versement. Et un appel n'est pas une suggestion : non honoré dans le délai, le courtier liquide la position au marché — par construction au pire moment.`,
        },
      ],
      pieges: [
        en
          ? estAppel
            ? `Paying just enough to cross back over the floor: ${f(maintenance, 0)} − ${f(solde, 0)} = ${eur(fauxMaintenance, 0)} instead of ${eur(reponse, 0)} — THE classic, and costly, mistake of the module. The call restores the FULL cushion: target = initial margin, always.`
            : `Triggering an imaginary call because the balance slid below the initial margin: the initial margin is the entry deposit and the refill TARGET, never the trigger. As long as the balance holds at or above ${eur(maintenance, 0)}, no cash is due — answering anything but 0 here is the mirror image of the classic mistake.`
          : estAppel
            ? `Verser juste de quoi repasser le seuil : ${f(maintenance, 0)} − ${f(solde, 0)} = ${eur(fauxMaintenance, 0)} au lieu de ${eur(reponse, 0)} — LA faute classique, et coûteuse, du module. L'appel restaure le coussin ENTIER : cible = marge initiale, toujours.`
            : `Déclencher un appel imaginaire parce que le solde est passé sous la marge initiale : l'initiale est le dépôt d'entrée et la CIBLE du recomplètement, jamais le déclencheur. Tant que le solde tient à ${eur(maintenance, 0)} ou au-dessus, aucun versement n'est dû — répondre autre chose que 0 ici est le miroir de la faute classique.`,
        en
          ? `Treating the call as negotiable: unpaid, it becomes a forced liquidation — the latent loss is crystallised right after a violently adverse move, exactly where one should not have been forced to sell. Size the position on the cash you can mobilise in a storm, not on the P&L you hope for in fair weather.`
          : `Croire l'appel négociable : non honoré, il devient liquidation d'office — la perte latente est cristallisée juste après un mouvement violemment adverse, là précisément où il ne fallait pas être forcé de vendre. Dimensionnez la position sur le cash mobilisable dans la tempête, pas sur le P&L espéré au beau temps.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 5. Prix forward d'un indice par le portage (N2)
// ---------------------------------------------------------------------------
export const genForwardIndice: ExerciseGenerator = {
  id: 'm7-ex-05',
  moduleId: M7,
  titre: 'Prix forward d\'un indice par le portage',
  titreEn: 'Index forward via cost of carry',
  difficulte: 2,
  // Tirages (ordre strict) : 1. spotCent = randInt(40, 82) (spot = ×100) · 2. rLow = randFloat(0.5, 3, 1)
  // · 3. gap = randFloat(0.5, 3, 1) · 4. regime = pick(['report', 'deport']) · 5. T = pick([0.25, 0.5, 0.75, 1]).
  // report ⇒ r = rLow + gap > q = rLow (F > S) ; déport ⇒ q = rLow + gap > r = rLow (F < S).
  // Réponse via prixForwardIndice (linéaire ≤ 1 an).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const spotCent = randInt(rng, 40, 82);
    const rLow = randFloat(rng, 0.5, 3, 1);
    const gap = randFloat(rng, 0.5, 3, 1);
    const regime = pick(rng, ['report', 'deport'] as const);
    const T = pick(rng, [0.25, 0.5, 0.75, 1] as const);

    const spot = spotCent * 100;
    const enReport = regime === 'report';
    const r = enReport ? r2(rLow + gap) : rLow;
    const q = enReport ? rLow : r2(rLow + gap);
    const reponse = r2(prixForwardIndice(spot, r, q, T));
    const ptsFin = r2(spot * (r / 100) * T);
    const ptsDiv = r2(spot * (q / 100) * T);
    const portageNet = r2(r - q);
    const fauxAdd = r2(prixForwardIndice(spot, r, -q, T)); // q compté en coût au lieu de revenu

    const en = langue === 'en';
    const { f, pct, sgn } = formatters(langue);
    const horizon = libelleHorizon(T, en);
    return {
      enonce: en
        ? `An equity index trades at ${f(spot, 0)} points. Financing costs ${pct(r, 1)} a year and the basket pays a dividend yield of ${pct(q, 1)} a year (simple linear rates).\n\n**What is the ${horizon} forward price of the index by cost of carry, in points?**`
        : `Un indice actions cote ${f(spot, 0)} points. Le financement coûte ${pct(r, 1)} par an et le panier verse un rendement du dividende de ${pct(q, 1)} par an (taux linéaires simples).\n\n**Quel est le prix forward de l'indice à ${horizon} par le coût de portage, en points ?**`,
      reponse,
      tolerance: 0.001,
      unite: 'points',
      etapes: [
        {
          titre: en ? 'Manufacture the delivery today' : 'Fabriquer la livraison dès aujourd\'hui',
          contenu: en
            ? `No forecast needed: borrow, buy the basket spot at ${f(spot, 0)}, and carry it. The carry has two legs — financing costs ${f(spot, 0)} × ${f(r, 1)} % × ${f(T)} = **${f(ptsFin, 2)} points**, and the dividends collected along the way pay back ${f(spot, 0)} × ${f(q, 1)} % × ${f(T)} = **${f(ptsDiv, 2)} points**. The full cost of having the index at delivery is spot + financing − dividends.`
            : `Aucune prévision nécessaire : empruntez, achetez le panier au comptant à ${f(spot, 0)}, et portez-le. Le portage a deux jambes — le financement coûte ${f(spot, 0)} × ${f(r, 1)} % × ${f(T)} = **${f(ptsFin, 2)} points**, et les dividendes encaissés en route rapportent ${f(spot, 0)} × ${f(q, 1)} % × ${f(T)} = **${f(ptsDiv, 2)} points**. Le coût de revient complet de l'indice à la livraison vaut spot + financement − dividendes.`,
        },
        {
          titre: en ? 'The formula, linear under one year' : 'La formule, linéaire sous l\'année',
          contenu: en
            ? `$F = S × \\left(1 + \\dfrac{r - q}{100} × T\\right) = ${f(spot, 0)} × \\left(1 + \\dfrac{${f(r, 1)} - ${f(q, 1)}}{100} × ${f(T)}\\right)$ = **${f(reponse, 2)} points**. Net carry: ${sgn(portageNet, 1)} point${Math.abs(portageNet) > 1 ? 's' : ''} of rate a year — financing makes the forward dearer, the dividend cheapens it, exactly like the FX forward's foreign rate or the commodity's convenience yield.`
            : `$F = S × \\left(1 + \\dfrac{r - q}{100} × T\\right) = ${f(spot, 0)} × \\left(1 + \\dfrac{${f(r, 1)} - ${f(q, 1)}}{100} × ${f(T)}\\right)$ = **${f(reponse, 2)} points**. Portage net : ${sgn(portageNet, 1)} point${Math.abs(portageNet) > 1 ? 's' : ''} de taux par an — le financement renchérit le terme, le dividende l'abaisse, exactement comme le taux étranger du forward de change ou le convenience yield des matières premières.`,
        },
        {
          titre: en ? (enReport ? 'Name the regime: premium' : 'Name the regime: discount') : enReport ? 'Nommer le régime : report' : 'Nommer le régime : déport',
          contenu: en
            ? enReport
              ? `F = ${f(reponse, 2)} > S = ${f(spot, 0)}: the forward trades at a **premium**, because r > q — money rents for more than the basket pays. No bullish signal whatsoever: the gap is the rent of money minus the rent of the asset, and it converges to zero at expiry whatever the index does.`
              : `F = ${f(reponse, 2)} < S = ${f(spot, 0)}: the forward trades at a **discount**, because q > r — the basket pays more than money costs (the euro-area configuration of the zero-rate years, 2015-2021). No bearish signal whatsoever: the gap is pure carry arithmetic, and it converges to zero at expiry whatever the index does.`
            : enReport
              ? `F = ${f(reponse, 2)} > S = ${f(spot, 0)} : le terme cote en **report**, parce que r > q — l'argent se loue plus cher que ce que rapporte le panier. Aucun signal haussier : l'écart est le loyer de l'argent moins le loyer de l'actif, et il converge vers zéro à l'échéance quoi que fasse l'indice.`
              : `F = ${f(reponse, 2)} < S = ${f(spot, 0)} : le terme cote en **déport**, parce que q > r — le panier rapporte plus que l'argent ne coûte (la configuration de la zone euro des années de taux zéro, 2015-2021). Aucun signal baissier : l'écart est de la pure arithmétique de portage, et il converge vers zéro à l'échéance quoi que fasse l'indice.`,
        },
      ],
      pieges: [
        en
          ? `Adding the dividend as a cost: ${f(spot, 0)} × (1 + (${f(r, 1)} + ${f(q, 1)}) % × ${f(T)}) = ${f(fauxAdd, 2)} instead of ${f(reponse, 2)}. The dividend is a REVENUE of the carry — it always enters with a minus sign, like the foreign interest rate in the FX forward.`
          : `Additionner le dividende comme un coût : ${f(spot, 0)} × (1 + (${f(r, 1)} + ${f(q, 1)}) % × ${f(T)}) = ${f(fauxAdd, 2)} au lieu de ${f(reponse, 2)}. Le dividende est un REVENU du portage — il entre toujours avec un signe moins, comme le taux étranger dans le forward de change.`,
        en
          ? `Reading the ${enReport ? 'premium' : 'discount'} as a forecast ("the market expects the index ${enReport ? 'up' : 'down'}"): the forward is built from three observable numbers — spot and two rates — by no-arbitrage. If the gap carried information, the cash-and-carry of the next exercise would eat it instantly.`
          : `Lire le ${enReport ? 'report' : 'déport'} comme une prévision (« le marché voit l'indice ${enReport ? 'monter' : 'baisser'} ») : le forward se construit sur trois nombres observables — le spot et deux taux — par absence d'arbitrage. Si l'écart contenait une information, le cash-and-carry de l'exercice suivant la mangerait instantanément.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 6. Arbitrage cash-and-carry (N3)
// ---------------------------------------------------------------------------
export const genArbitrageCashCarry: ExerciseGenerator = {
  id: 'm7-ex-06',
  moduleId: M7,
  titre: 'Arbitrage cash-and-carry',
  titreEn: 'Cash-and-carry arbitrage',
  difficulte: 3,
  // Tirages (ordre strict) : 1. spotCent = randInt(45, 75) (spot = ×100) · 2. rLow = randFloat(0.5, 3, 1)
  // · 3. gap = randFloat(0.5, 2.5, 1) · 4. regime = pick(['report', 'deport']) · 5. T = pick([0.5, 1])
  // · 6. sensEcart = pick([1, −1]) · 7. ecartPts = randInt(20, 60).
  // Fth = prixForwardIndice (exact à 2 décimales par construction des tirages) ; Fcote = Fth
  // + sensEcart × ecartPts. Surcote ⇒ cash and carry ; sous-cote ⇒ reverse cash and carry.
  // Réponse = pnlFutures(Fth, Fcote, 10, 1, sensEcart) = ecartPts × 10 € par contrat (> 0).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const spotCent = randInt(rng, 45, 75);
    const rLow = randFloat(rng, 0.5, 3, 1);
    const gap = randFloat(rng, 0.5, 2.5, 1);
    const regime = pick(rng, ['report', 'deport'] as const);
    const T = pick(rng, [0.5, 1] as const);
    const sensEcart = pick(rng, [1, -1] as const);
    const ecartPts = randInt(rng, 20, 60);

    const spot = spotCent * 100;
    const mult = 10;
    const enReport = regime === 'report';
    const r = enReport ? r2(rLow + gap) : rLow;
    const q = enReport ? rLow : r2(rLow + gap);
    const fTh = prixForwardIndice(spot, r, q, T);
    const fThAff = r2(fTh);
    const fCote = r2(fTh + sensEcart * ecartPts);
    const reponse = r2(pnlFutures(fTh, fCote, mult, 1, sensEcart));
    const surcote = sensEcart === 1;

    const notionnelSpot = spot * mult;
    const detteVal = r2(notionnelSpot * (1 + (r / 100) * T)); // dette (surcote) ou placement (sous-cote)
    const divVal = r2(notionnelSpot * (q / 100) * T);
    const futVal = r2(fCote * mult); // vente à terme (surcote) ou rachat à terme (sous-cote)

    const en = langue === 'en';
    const { f, eur, pct } = formatters(langue);
    const horizon = libelleHorizon(T, en);
    return {
      enonce: en
        ? `An equity index trades at ${f(spot, 0)} points; ${horizon} financing costs ${pct(r, 1)} and the dividend yield is ${pct(q, 1)} (simple linear rates). The ${horizon} futures (multiplier €10/point) trades at ${f(fCote, 2)} points.\n\n**What riskless profit, in euros per contract, does the appropriate arbitrage lock in?**`
        : `Un indice actions cote ${f(spot, 0)} points ; le financement à ${horizon} vaut ${pct(r, 1)} et le rendement du dividende ${pct(q, 1)} (taux linéaires simples). Le futures à ${horizon} (multiplicateur 10 €/point) cote ${f(fCote, 2)} points.\n\n**Quel gain sans risque, en euros par contrat, l'arbitrage approprié verrouille-t-il ?**`,
      reponse,
      tolerance: 0.005,
      unite: '€',
      etapes: [
        {
          titre: en ? 'The arbitrage price first' : 'D\'abord le prix d\'arbitrage',
          contenu: en
            ? `Cost of carry gives the only quote compatible with no free money: $F_{th} = ${f(spot, 0)} × \\left(1 + \\dfrac{${f(r, 1)} - ${f(q, 1)}}{100} × ${f(T)}\\right) = ${f(fThAff, 2)}$ points. The market quotes ${f(fCote, 2)} — **${f(ecartPts, 0)} points ${surcote ? 'above' : 'below'}**: the futures is too ${surcote ? 'expensive: sell it and manufacture the delivery yourself' : 'cheap: buy it and dismantle the carry — the reverse cash and carry'}.`
            : `Le coût de portage donne la seule cote compatible avec l'absence d'argent gratuit : $F_{th} = ${f(spot, 0)} × \\left(1 + \\dfrac{${f(r, 1)} - ${f(q, 1)}}{100} × ${f(T)}\\right) = ${f(fThAff, 2)}$ points. Le marché cote ${f(fCote, 2)} — **${f(ecartPts, 0)} points ${surcote ? 'au-dessus' : 'en dessous'}** : le futures est trop ${surcote ? 'cher : vendez-le et fabriquez la livraison vous-même' : 'bon marché : achetez-le et démontez le portage — le reverse cash and carry'}.`,
        },
        {
          titre: en ? 'Build the machine (zero outlay)' : 'Monter la machine (zéro mise)',
          contenu: en
            ? surcote
              ? `Day one: borrow ${eur(notionnelSpot, 0)} at ${pct(r, 1)}, buy the basket (${f(spot, 0)} pts × €10), SELL the futures at ${f(fCote, 2)}. During the ${horizon}: the basket pays ${eur(divVal, 0)} of dividends; the debt grows to ${eur(detteVal, 0)}. At expiry: deliver the index against ${eur(futVal, 0)}. Total: ${f(futVal, 0)} + ${f(divVal, 0)} − ${f(detteVal, 0)} = **${eur(reponse, 0)}** — every price and rate was locked at inception, wherever the index ends.`
              : `Day one: short-sell the basket via securities lending (${eur(notionnelSpot, 0)} collected), invest at ${pct(r, 1)}, BUY the futures at ${f(fCote, 2)}. During the ${horizon}: the investment grows to ${eur(detteVal, 0)}; you pass the ${eur(divVal, 0)} of dividends back to the stock lender. At expiry: buy the index back through the futures for ${eur(futVal, 0)}. Total: ${f(detteVal, 0)} − ${f(divVal, 0)} − ${f(futVal, 0)} = **${eur(reponse, 0)}** — every price and rate was locked at inception, wherever the index ends.`
            : surcote
              ? `Jour J : empruntez ${eur(notionnelSpot, 0)} à ${pct(r, 1)}, achetez le panier (${f(spot, 0)} pts × 10 €), VENDEZ le futures à ${f(fCote, 2)}. Pendant les ${horizon} : le panier verse ${eur(divVal, 0)} de dividendes ; la dette enfle à ${eur(detteVal, 0)}. À l'échéance : livrez l'indice contre ${eur(futVal, 0)}. Bilan : ${f(futVal, 0)} + ${f(divVal, 0)} − ${f(detteVal, 0)} = **${eur(reponse, 0)}** — tous les prix et les taux ont été figés au départ, où que finisse l'indice.`
              : `Jour J : vendez le panier à découvert via le prêt-emprunt de titres (${eur(notionnelSpot, 0)} encaissés), placez à ${pct(r, 1)}, ACHETEZ le futures à ${f(fCote, 2)}. Pendant les ${horizon} : le placement devient ${eur(detteVal, 0)} ; vous reversez les ${eur(divVal, 0)} de dividendes au prêteur des titres. À l'échéance : rachetez l'indice via le futures pour ${eur(futVal, 0)}. Bilan : ${f(detteVal, 0)} − ${f(divVal, 0)} − ${f(futVal, 0)} = **${eur(reponse, 0)}** — tous les prix et les taux ont été figés au départ, où que finisse l'indice.`,
        },
        {
          titre: en ? 'Why the price holds' : 'Pourquoi le prix tient',
          contenu: en
            ? `The profit is exactly the mispricing: ${f(ecartPts, 0)} points × €10 = ${eur(reponse, 0)} per contract, with no capital and no market risk. Dozens of desks running the same program trade is precisely what pushes the quote back onto ${f(fThAff, 2)} within seconds${surcote ? '' : ' — and the reverse side is somewhat more constrained (stock to borrow, lending fees), which is why prices live in a narrow no-arbitrage BAND rather than on a wire'}.`
            : `Le gain est exactement l'écart de cote : ${f(ecartPts, 0)} points × 10 € = ${eur(reponse, 0)} par contrat, sans capital ni risque de marché. Des dizaines de desks déroulant le même program trading : voilà ce qui ramène la cote sur ${f(fThAff, 2)} en quelques secondes${surcote ? '' : ' — et le sens reverse est un peu plus contraint (titres à emprunter, coût du prêt-emprunt), d\'où des prix qui vivent dans une étroite BANDE de non-arbitrage plutôt que sur un fil'}.`,
        },
      ],
      pieges: [
        en
          ? `Reading the gap as information ("the futures trades ${surcote ? 'above' : 'below'}, the market is ${surcote ? 'bullish' : 'bearish'}"): an arbitrage price is not a poll. The ${f(ecartPts, 0)}-point gap is free money, not an opinion — which is exactly why it cannot last.`
          : `Lire l'écart comme une information (« le futures cote ${surcote ? 'au-dessus' : 'en dessous'}, le marché est ${surcote ? 'haussier' : 'baissier'} ») : un prix d'arbitrage n'est pas un sondage. Les ${f(ecartPts, 0)} points d'écart sont de l'argent gratuit, pas une opinion — et c'est précisément pourquoi ils ne peuvent pas durer.`,
        en
          ? `${surcote ? 'Selling the futures WITHOUT carrying the basket' : 'Buying the futures WITHOUT shorting the basket'} "and waiting for the price to converge": that is speculation, not arbitrage — nothing forces the quote to converge before expiry, and the position bleeds margin calls meanwhile. An arbitrage locks every leg on day one.`
          : `${surcote ? 'Vendre le futures SANS porter le panier' : 'Acheter le futures SANS vendre le panier à découvert'} « en attendant que le cours converge » : c'est de la spéculation, pas de l'arbitrage — rien n'oblige la cote à converger avant l'échéance, et la position saigne des appels de marge entre-temps. Un arbitrage fige toutes ses jambes au jour J.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 7. Le taux forward implicite (FRA) (N2)
// ---------------------------------------------------------------------------
export const genForwardImplicite: ExerciseGenerator = {
  id: 'm7-ex-07',
  moduleId: M7,
  titre: 'Le taux forward implicite (FRA)',
  titreEn: 'The implied forward rate (FRA)',
  difficulte: 2,
  // Tirages (ordre strict) : 1. periode = pick([[0.5, 1], [0.25, 0.75], [0.25, 1]]) · 2. r1 = randFloat(1.5, 4.5, 2)
  // · 3. forme = pick(['croissante', 'croissante', 'plate', 'decroissante']) · 4. ecart = randFloat(0.2, 0.8, 2).
  // rT2 = r1 ± ecart selon la forme (plate ⇒ rT2 = r1 : le piège du linéaire, forward < taux plat).
  // Réponse via tauxForwardImplicite (convention LINÉAIRE — différente du composé du m4 ch5).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const periode = pick(rng, [[0.5, 1], [0.25, 0.75], [0.25, 1]] as const);
    const r1 = randFloat(rng, 1.5, 4.5, 2);
    const forme = pick(rng, ['croissante', 'croissante', 'plate', 'decroissante'] as const);
    const ecart = randFloat(rng, 0.2, 0.8, 2);

    const [t1, t2] = periode;
    const rT2 = forme === 'croissante' ? r2(r1 + ecart) : forme === 'plate' ? r1 : r2(r1 - ecart);
    const reponse = r4(tauxForwardImplicite(r1, t1, rT2, t2));
    const fac1 = 1 + (r1 / 100) * t1;
    const fac2 = 1 + (rT2 / 100) * t2;
    const ratio = fac2 / fac1;
    const m1 = Math.round(t1 * 12);
    const m2 = Math.round(t2 * 12);
    const moisPeriode = m2 - m1;
    const fauxNaif = r2((rT2 * t2 - r1 * t1) / (t2 - t1)); // la règle de trois qui ignore la capitalisation
    const estPlate = forme === 'plate';

    const en = langue === 'en';
    const { f, pct } = formatters(langue);
    return {
      enonce: en
        ? `The money market quotes ${pct(r1)} at ${m1} months and ${pct(rT2)} at ${m2} months (simple linear rates). A corporate treasurer wants to lock in today the rate of a ${moisPeriode}-month borrowing starting in ${m1} months — a ${m1}×${m2} FRA.\n\n**At what equilibrium rate must this FRA be quoted, in % (4 decimals)?**`
        : `Le marché monétaire cote ${pct(r1)} à ${m1} mois et ${pct(rT2)} à ${m2} mois (taux linéaires simples). Une trésorière d'entreprise veut geler dès aujourd'hui le taux d'un emprunt de ${moisPeriode} mois qui démarre dans ${m1} mois — un FRA ${m1}×${m2}.\n\n**À quel taux d'équilibre ce FRA doit-il coter, en % (4 décimales) ?**`,
      reponse,
      tolerance: 0.005,
      unite: '%',
      etapes: [
        {
          titre: en ? 'Two riskless paths, one wealth' : 'Deux chemins sans risque, une seule richesse',
          contenu: en
            ? `Path A — one block: invest €1 to ${m2} months at ${pct(rT2)} → ${f(fac2, 6)}. Path B — two steps: invest ${m1} months at ${pct(r1)} → ${f(fac1, 6)}, then roll at the forward rate $f$ fixed today. Same money, same horizon, no risk on either: the two paths MUST end equal, or an arbitrage opens. No crystal ball enters — the forward is manufactured from the curve.`
            : `Chemin A — d'un bloc : placer 1 € à ${m2} mois à ${pct(rT2)} → ${f(fac2, 6)}. Chemin B — en deux temps : placer ${m1} mois à ${pct(r1)} → ${f(fac1, 6)}, puis rouler au taux forward $f$ fixé aujourd'hui. Même mise, même horizon, aucun risque nulle part : les deux chemins DOIVENT finir égaux, sinon arbitrage. Aucune boule de cristal — le forward se fabrique à partir de la courbe.`,
        },
        {
          titre: en ? 'Extract the forward, linearly' : 'Extraire le forward, en linéaire',
          contenu: en
            ? `$1 + f × ${f(t2 - t1)} = \\dfrac{${f(fac2, 6)}}{${f(fac1, 6)}} = ${f(ratio, 6)}$, hence $f = \\dfrac{${f(ratio, 6)} - 1}{${f(t2 - t1)}} × 100$ = **${f(reponse, 4)} %**. Intuition: to deliver ${pct(rT2)} over the full ${m2} months when the first ${m1} only pay ${pct(r1)}, the remaining ${moisPeriode} months must pay about ${f(reponse, 2)} %.`
            : `$1 + f × ${f(t2 - t1)} = \\dfrac{${f(fac2, 6)}}{${f(fac1, 6)}} = ${f(ratio, 6)}$, d'où $f = \\dfrac{${f(ratio, 6)} - 1}{${f(t2 - t1)}} × 100$ = **${f(reponse, 4)} %**. Intuition : pour servir ${pct(rT2)} sur les ${m2} mois entiers quand les ${m1} premiers n'en rapportent que ${pct(r1)}, les ${moisPeriode} mois restants doivent en rapporter environ ${f(reponse, 2)}.`,
        },
        {
          titre: en ? 'The convention matters' : 'La convention compte',
          contenu: en
            ? estPlate
              ? `Note the linear-world quirk: the curve is FLAT at ${pct(r1)}, yet the forward comes out at ${f(reponse, 4)} % — slightly BELOW. Rolling two linear deposits compounds the first period's interest; the one-block linear deposit does not: the forward must sit under the flat rate to equalise the paths. Under the COMPOUND convention of module 4, a flat curve gives forward = ${f(r1, 2)} % exactly — two conventions, two numbers, know which world you are in.`
              : `Money-market convention: LINEAR under one year (this exercise); the bond world of module 4, chapter 5, COMPOUNDS — and the two do not give the same number. The telltale test: on a flat curve, the linear forward comes out slightly BELOW the flat rate (rolling compounds, the one-block deposit does not), while the compound forward equals it exactly. Saying "linear in money markets, compound in bonds" at the interview is worth real points.`
            : estPlate
              ? `Notez la bizarrerie du monde linéaire : la courbe est PLATE à ${pct(r1)}, et pourtant le forward ressort à ${f(reponse, 4)} % — légèrement EN DESSOUS. Rouler deux placements linéaires capitalise les intérêts de la première période ; le placement linéaire d'un bloc, non : le forward doit s'établir sous le taux plat pour égaliser les chemins. En convention COMPOSÉE (module 4), courbe plate ⇒ forward = ${f(r1, 2)} % exactement — deux conventions, deux chiffres, sachez dans quel monde vous êtes.`
              : `Convention du marché monétaire : LINÉAIRE sous l'année (cet exercice) ; le monde obligataire du module 4, chapitre 5, COMPOSE — et les deux ne donnent pas le même chiffre. Le test révélateur : sur une courbe plate, le forward linéaire ressort légèrement SOUS le taux plat (le roulement capitalise, le placement d'un bloc non), tandis que le forward composé l'égale exactement. Savoir dire « linéaire en monétaire, composé en obligataire » vaut très cher à l'oral.`,
        },
      ],
      pieges: [
        en
          ? estPlate
            ? `Answering ${pct(r1)} flat: "flat curve, so the forward equals the spot rate" only holds in the COMPOUND convention. In linear money-market terms the answer is ${f(reponse, 4)} % — the rolled path compounds, the one-block path does not, and the forward absorbs the difference.`
            : `The naive rule of three: $f_{naive} = \\dfrac{${f(rT2)} × ${f(t2)} - ${f(r1)} × ${f(t1)}}{${f(t2 - t1)}} = ${f(fauxNaif, 2)}$ % instead of ${f(reponse, 4)} % — close enough to feel right, wrong enough to lose the trade. It forgets that the second leg starts from a capital already grown to ${f(fac1, 6)}.`
          : estPlate
            ? `Répondre ${pct(r1)} tout rond : « courbe plate, donc forward égal au taux comptant » n'est vrai qu'en convention COMPOSÉE. En linéaire monétaire, la réponse est ${f(reponse, 4)} % — le chemin roulé capitalise, le chemin d'un bloc non, et le forward absorbe la différence.`
            : `La règle de trois naïve : $f_{naïf} = \\dfrac{${f(rT2)} × ${f(t2)} - ${f(r1)} × ${f(t1)}}{${f(t2 - t1)}} = ${f(fauxNaif, 2)}$ % au lieu de ${f(reponse, 4)} % — assez proche pour sembler juste, assez fausse pour perdre le trade. Elle oublie que la seconde jambe part d'un capital déjà gonflé à ${f(fac1, 6)}.`,
        en
          ? `Reading the forward as a central-bank prediction: ${f(reponse, 2)} % is the rate the curve can MANUFACTURE (borrow long, place short), not a forecast of where rates will be in ${m1} months. Same trap, third costume: FX forward, index forward, rate forward — none of them is a poll.`
          : `Lire le forward comme une prédiction de banque centrale : ${f(reponse, 2)} % est le taux que la courbe peut FABRIQUER (emprunter long, placer court), pas une prévision du taux dans ${m1} mois. Même piège, troisième costume : forward de change, forward d'indice, forward de taux — aucun n'est un sondage.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 8. Règlement différentiel d'un FRA (N2)
// ---------------------------------------------------------------------------
export const genReglementFraEx: ExerciseGenerator = {
  id: 'm7-ex-08',
  moduleId: M7,
  titre: 'Règlement différentiel d\'un FRA',
  titreEn: 'FRA cash settlement',
  difficulte: 2,
  // Tirages (ordre strict) : 1. notionnelM = pick([5, 10, 15, 20, 25, 50]) · 2. tauxFra = randFloat(2, 4.5, 2)
  // · 3. scenario = pick(['hausse', 'baisse']) · 4. mouvement = randFloat(0.4, 1.5, 2)
  // · 5. fraction = pick([0.25, 0.5]) · 6. depart = pick([3, 6]).
  // constaté = FRA ± mouvement ; position LONGUE (payeuse du fixe : l'emprunteuse qui se couvre).
  // Réponse via reglementFra (différentiel ACTUALISÉ au taux constaté — convention FRA).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const notionnelM = pick(rng, [5, 10, 15, 20, 25, 50] as const);
    const tauxFra = randFloat(rng, 2, 4.5, 2);
    const scenario = pick(rng, ['hausse', 'baisse'] as const);
    const mouvement = randFloat(rng, 0.4, 1.5, 2);
    const fraction = pick(rng, [0.25, 0.5] as const);
    const depart = pick(rng, [3, 6] as const);

    const hausse = scenario === 'hausse';
    const constate = hausse ? r2(tauxFra + mouvement) : r2(tauxFra - mouvement);
    const reponse = r2(reglementFra(notionnelM, tauxFra, constate, fraction));
    const brut = r2(notionnelM * 1e6 * ((constate - tauxFra) / 100) * fraction);
    const facteurActu = 1 + (constate / 100) * fraction;
    const moisPeriode = Math.round(fraction * 12);
    const finFra = depart + moisPeriode;

    const en = langue === 'en';
    const { f, pct, sgn } = formatters(langue);
    return {
      enonce: en
        ? `A few months ago, the treasurer of a mid-cap bought (long position, fixed-rate payer) a ${depart}×${finFra} FRA at ${pct(tauxFra)} on €${f(notionnelM, 0)}m, to hedge a future ${moisPeriode}-month borrowing. Fixing day has arrived: the ${moisPeriode}-month rate comes out at ${pct(constate)}.\n\n**What settlement does she receive (negative if she pays), in euros?**`
        : `Il y a quelques mois, la trésorière d'une ETI a acheté (position longue, payeuse du taux fixe) un FRA ${depart}×${finFra} à ${pct(tauxFra)} sur ${f(notionnelM, 0)} M€, pour couvrir un emprunt futur de ${moisPeriode} mois. Le jour du fixing est arrivé : le taux ${moisPeriode} mois ressort à ${pct(constate)}.\n\n**Quel règlement reçoit-elle (négatif si elle paie), en euros ?**`,
      reponse,
      tolerance: 0.005,
      unite: '€',
      etapes: [
        {
          titre: en ? 'The direction first' : 'Le sens d\'abord',
          contenu: en
            ? `Long FRA = fixed-rate payer = the future borrower's hedge: hurt by rising rates, she must be PAID by rising rates. Rates have ${hausse ? `risen (${f(constate)} > ${f(tauxFra)}): she receives` : `fallen (${f(constate)} < ${f(tauxFra)}): she pays`} — the anchor to recite: *long FRA = fixed payer = friend of rate hikes*.`
            : `Long FRA = payeur du taux fixe = la couverture de l'emprunteuse future : blessée par la hausse des taux, elle doit être PAYÉE par la hausse des taux. Les taux ont ${hausse ? `monté (${f(constate)} > ${f(tauxFra)}) : elle reçoit` : `baissé (${f(constate)} < ${f(tauxFra)}) : elle paie`} — l'ancrage à réciter : *long FRA = payeur du fixe = ami des hausses de taux*.`,
        },
        {
          titre: en ? 'The raw interest differential' : 'Le différentiel d\'intérêts brut',
          contenu: en
            ? `$${f(notionnelM, 0)}\\,000\\,000 × \\dfrac{${f(constate)} - ${f(tauxFra)}}{100} × ${f(fraction)} = ${sgn(brut, 2)}$ €: the extra interest the borrowing will ${hausse ? 'cost' : 'save'} over the ${moisPeriode}-month period, at ${sgn(r2(constate - tauxFra), 2)} point${Math.abs(constate - tauxFra) > 1 ? 's' : ''} of rate on €${f(notionnelM, 0)}m.`
            : `$${f(notionnelM, 0)}\\,000\\,000 × \\dfrac{${f(constate)} - ${f(tauxFra)}}{100} × ${f(fraction)} = ${sgn(brut, 2)}$ € : le surcroît d'intérêts que l'emprunt ${hausse ? 'coûtera' : 'épargnera'} sur la période de ${moisPeriode} mois, à ${sgn(r2(constate - tauxFra), 2)} point${Math.abs(constate - tauxFra) > 1 ? 's' : ''} de taux sur ${f(notionnelM, 0)} M€.`,
        },
        {
          titre: en ? 'Discount it back: paid at the START of the period' : 'L\'actualiser : payé au DÉBUT de la période',
          contenu: en
            ? `The differential compensates interest payable at the END of the period, but the FRA settles NOW, at fixing — start of the period. So discount at the observed rate: $\\dfrac{${f(brut, 2)}}{1 + ${f(constate)}\\,\\% × ${f(fraction)}} = \\dfrac{${f(brut, 2)}}{${f(facteurActu, 6)}}$ = **${sgn(reponse, 2)} €**. Consistency check: reinvested ${moisPeriode} months at ${pct(constate)}, this amount grows back to exactly ${f(Math.abs(brut), 2)} — all in, she borrows at ${pct(tauxFra)}, as promised.`
            : `Le différentiel compense des intérêts payables en FIN de période, mais le FRA se règle MAINTENANT, au fixing — début de période. On actualise donc au taux constaté : $\\dfrac{${f(brut, 2)}}{1 + ${f(constate)}\\,\\% × ${f(fraction)}} = \\dfrac{${f(brut, 2)}}{${f(facteurActu, 6)}}$ = **${sgn(reponse, 2)} €**. Preuve de cohérence : replacé ${moisPeriode} mois à ${pct(constate)}, ce montant redonne exactement ${f(Math.abs(brut), 2)} — tout compris, elle emprunte bien à ${pct(tauxFra)}, comme promis.`,
        },
      ],
      pieges: [
        en
          ? `Skipping the discounting: announcing ${sgn(brut, 2)} € instead of ${sgn(reponse, 2)} €. The FRA settles at the START of the interest period it compensates — paying the undiscounted differential would over-compensate by exactly ${moisPeriode} months of interest. The discount rate is the OBSERVED rate, not the FRA rate.`
          : `Oublier l'actualisation : annoncer ${sgn(brut, 2)} € au lieu de ${sgn(reponse, 2)} €. Le FRA se règle au DÉBUT de la période d'intérêt qu'il compense — verser le différentiel non actualisé surcompenserait d'exactement ${moisPeriode} mois d'intérêts. Et le taux d'actualisation est le taux CONSTATÉ, pas le taux du FRA.`,
        en
          ? `Flipping the direction ("rates ${hausse ? 'rose' : 'fell'}, the long must ${hausse ? 'pay' : 'receive'}"): go back to the usage — the hedge of a future borrower must pay when her cost of borrowing rises. The future LENDER (an insurer waiting to reinvest a premium) hedges the opposite way: short the FRA, paid when rates fall.`
          : `Inverser le sens (« les taux ont ${hausse ? 'monté' : 'baissé'}, le long doit ${hausse ? 'payer' : 'recevoir'} ») : revenez à l'usage — la couverture d'une emprunteuse future doit payer quand son coût d'emprunt monte. Le PRÊTEUR futur (l'assureur qui attend une prime à replacer) se couvre dans l'autre sens : short le FRA, payé quand les taux baissent.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 9. Futures de taux : 100 − taux (N2)
// ---------------------------------------------------------------------------
export const genFuturesTaux: ExerciseGenerator = {
  id: 'm7-ex-09',
  moduleId: M7,
  titre: 'Futures de taux : 100 − taux',
  titreEn: 'STIR futures: price = 100 − rate',
  difficulte: 2,
  // Tirages (ordre strict) : 1. taux0 = randFloat(1.8, 4.2, 2) · 2. role = pick(['emprunteur', 'preteur'])
  // · 3. sensTaux = pick([1, −1]) · 4. pb = randInt(8, 60) · 5. nb = randInt(4, 40).
  // Euribor 3 mois : prix = 100 − taux, 1 pb = 25 € (notionnel 1 M€ × 0,01 % × 0,25).
  // L'emprunteur VEND (sens −1), le prêteur ACHÈTE (+1). Réponse via pnlFutures avec un
  // multiplicateur de 2 500 € par point de prix entier (= 100 pb × 25 €).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const taux0 = randFloat(rng, 1.8, 4.2, 2);
    const role = pick(rng, ['emprunteur', 'preteur'] as const);
    const sensTaux = pick(rng, [1, -1] as const);
    const pb = randInt(rng, 8, 60);
    const nb = randInt(rng, 4, 40);

    const estEmprunteur = role === 'emprunteur';
    const sens = estEmprunteur ? -1 : 1;
    const prix0 = r2(100 - taux0);
    const taux1 = r2(taux0 + (sensTaux * pb) / 100);
    const prix1 = r2(100 - taux1);
    const reponse = r2(pnlFutures(prix0, prix1, 2500, nb, sens));
    const totalAbs = pb * 25 * nb;
    const tauxMontent = sensTaux === 1;
    const gagne = reponse > 0;

    const en = langue === 'en';
    const { f, fix, eur, pct, sgn } = formatters(langue);
    return {
      enonce: en
        ? `${estEmprunteur ? 'To lock in the rate of a future borrowing, a treasurer SELLS' : 'To protect the reinvestment rate of a future cash inflow, an insurer BUYS'} ${f(nb, 0)} three-month Euribor futures (notional €1m, 1 basis point = €25) while the implied rate stands at ${pct(taux0)} — the contract therefore quotes ${fix(prix0, 2)}. By unwinding, the implied rate has ${tauxMontent ? 'risen' : 'fallen'} to ${pct(taux1)}.\n\n**What is the P&L of the futures position, in euros (with its sign)?**`
        : `${estEmprunteur ? 'Pour figer le taux d\'un emprunt futur, une trésorière VEND' : 'Pour protéger le taux de replacement d\'une rentrée de trésorerie future, un assureur ACHÈTE'} ${f(nb, 0)} contrats futures Euribor 3 mois (notionnel 1 M€, 1 point de base = 25 €) alors que le taux implicite ressort à ${pct(taux0)} — le contrat cote donc ${fix(prix0, 2)}. Au débouclage, le taux implicite est ${tauxMontent ? 'monté' : 'descendu'} à ${pct(taux1)}.\n\n**Quel est le P&L de la position futures, en euros (avec son signe) ?**`,
      reponse,
      tolerance: 0.005,
      unite: '€',
      etapes: [
        {
          titre: en ? 'The upside-down price' : 'Le prix à l\'envers',
          contenu: en
            ? `Convention: price = 100 − rate. At entry, ${fix(prix0, 2)} = 100 − ${f(taux0)}; at unwinding, the rate at ${pct(taux1)} gives ${fix(prix1, 2)}. The price ${tauxMontent ? 'FELL while rates ROSE' : 'ROSE while rates FELL'} — the convention deliberately recreates the bond reflex of module 4: prices move against rates.`
            : `Convention : prix = 100 − taux. À l'entrée, ${fix(prix0, 2)} = 100 − ${f(taux0)} ; au débouclage, le taux à ${pct(taux1)} donne ${fix(prix1, 2)}. Le prix a ${tauxMontent ? 'BAISSÉ pendant que les taux MONTAIENT' : 'MONTÉ pendant que les taux BAISSAIENT'} — la convention recrée volontairement le réflexe obligataire du module 4 : les prix vont contre les taux.`,
        },
        {
          titre: en ? 'Value the move in basis points' : 'Chiffrer le mouvement en points de base',
          contenu: en
            ? `One basis point is worth €1,000,000 × 0.01% × 0.25 = **€25** per contract (a quarter-year of interest on the notional). The move: ${f(pb, 0)} bp × ${eur(25, 0)} × ${f(nb, 0)} contracts = ${eur(totalAbs, 0)}; signed by the ${estEmprunteur ? 'SHORT' : 'LONG'} position: **${sgn(reponse, 0)} €**. Equivalent general form: (${fix(prix1, 2)} − ${fix(prix0, 2)}) × 2 500 € × ${f(nb, 0)} × (${sens === 1 ? '+1' : '−1'}) — €2,500 being the full price point, i.e. 100 bp.`
            : `Un point de base vaut 1 000 000 € × 0,01 % × 0,25 = **25 €** par contrat (un quart d'année d'intérêts sur le notionnel). Le mouvement : ${f(pb, 0)} pb × ${eur(25, 0)} × ${f(nb, 0)} contrats = ${eur(totalAbs, 0)} ; signé par la position ${estEmprunteur ? 'VENDEUSE' : 'ACHETEUSE'} : **${sgn(reponse, 0)} €**. Forme générale équivalente : (${fix(prix1, 2)} − ${fix(prix0, 2)}) × 2 500 € × ${f(nb, 0)} × (${sens === 1 ? '+1' : '−1'}) — 2 500 € valant le point de prix entier, soit 100 pb.`,
        },
        {
          titre: en ? 'Read the hedge the right way up' : 'Lire la couverture à l\'endroit',
          contenu: en
            ? gagne
              ? `The position gains ${eur(reponse, 0)}: rates moved ${tauxMontent ? 'up' : 'down'}, exactly what the ${estEmprunteur ? 'borrower feared — the futures gain offsets the extra cost of the coming borrowing' : 'lender feared — the futures gain offsets the poorer reinvestment rate of the coming inflow'}. The hedge did its job: the all-in rate stays close to the ${pct(taux0)} locked at inception.`
              : `The position loses ${eur(Math.abs(reponse), 0)} — and that is NOT a failed hedge: rates moved ${tauxMontent ? 'up' : 'down'}, so the underlying ${estEmprunteur ? 'borrowing will cost less' : 'reinvestment will pay more'} by an offsetting amount. A hedge locks a rate; it gives up the favourable scenario in exchange — judge it at inception, against the risk, never on the realised path.`
            : gagne
              ? `La position gagne ${eur(reponse, 0)} : les taux ont ${tauxMontent ? 'monté' : 'baissé'}, exactement ce que ${estEmprunteur ? 'l\'emprunteuse craignait — le gain sur les futures compense le surcoût de l\'emprunt à venir' : 'le prêteur craignait — le gain sur les futures compense le replacement moins bien rémunéré de la rentrée à venir'}. La couverture a fait son travail : le taux tout compris reste proche des ${pct(taux0)} verrouillés au départ.`
              : `La position perd ${eur(Math.abs(reponse), 0)} — et ce n'est PAS une couverture ratée : les taux ont ${tauxMontent ? 'monté' : 'baissé'}, donc ${estEmprunteur ? 'l\'emprunt sous-jacent coûtera moins cher' : 'le replacement sous-jacent rapportera davantage'} d'un montant compensateur. Une couverture verrouille un taux ; elle renonce en échange au scénario favorable — elle se juge au départ, face au risque, jamais sur la trajectoire réalisée.`,
        },
      ],
      pieges: [
        en
          ? `Hedging a future borrowing by BUYING the contract: upside down. Price = 100 − rate, so the SELLER gains when rates rise — the exact mirror of the FRA, where the same borrower goes LONG. Two conventions, one protection: check which instrument you are holding before picking the side.`
          : `Couvrir un emprunt futur en ACHETANT le contrat : à l'envers. Prix = 100 − taux, donc c'est le VENDEUR qui gagne à la hausse des taux — l'exact miroir du FRA, où le même emprunteur est LONG. Deux conventions, une seule protection : vérifiez l'instrument en main avant de choisir le camp.`,
        en
          ? `Confusing the basis point (0.01 of price = €25) with the tick (0.005 = €12.50): a factor-2 error on every P&L. The tick is the minimum quotation step; the basis point is the rate unit — on Euribor and SOFR 3-month contracts, one bp is always a quarter of 0.01% on €1m/$1m, i.e. 25.`
          : `Confondre le point de base (0,01 de prix = 25 €) et le tick (0,005 = 12,50 €) : un facteur 2 d'erreur sur chaque P&L. Le tick est l'échelon minimal de cotation ; le point de base est l'unité de taux — sur l'Euribor et le SOFR 3 mois, le pb vaut toujours un quart de 0,01 % sur 1 M, soit 25.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 10. Le facteur d'actualisation zéro-coupon (N2)
// ---------------------------------------------------------------------------
export const genFacteurActu: ExerciseGenerator = {
  id: 'm7-ex-10',
  moduleId: M7,
  titre: 'Le facteur d\'actualisation zéro-coupon',
  titreEn: 'The zero-coupon discount factor',
  difficulte: 2,
  // Tirages (ordre strict) : 1. taux = randFloat(1.5, 5.5, 1) · 2. annees = pick([2, 3, 4, 5, 7, 10]).
  // Horizon > 1 an ⇒ composition ANNUELLE (convention du module, cohérente m4).
  // Réponse via facteurActualisation, arrondie à 6 décimales (4 suffisent à la saisie).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const taux = randFloat(rng, 1.5, 5.5, 1);
    const annees = pick(rng, [2, 3, 4, 5, 7, 10] as const);

    const reponse = r6(facteurActualisation(taux, annees));
    const capitalisation = r6((1 + taux / 100) ** annees);
    const fauxLineaire = r6(1 / (1 + (taux / 100) * annees));
    const fauxCapital = capitalisation;

    const en = langue === 'en';
    const { f, pct } = formatters(langue);
    return {
      enonce: en
        ? `On the zero-coupon curve your desk has just bootstrapped, the ${annees}-year zero rate comes out at ${pct(taux, 1)} (annual compounding).\n\n**What is the ${annees}-year discount factor df (4 decimals are enough)?**`
        : `Sur la courbe zéro-coupon que votre desk vient de construire, le taux zéro à ${annees} ans ressort à ${pct(taux, 1)} (composition annuelle).\n\n**Que vaut le facteur d'actualisation df à ${annees} ans (4 décimales suffisent) ?**`,
      reponse,
      tolerance: 0.0005,
      toleranceMode: 'absolu',
      etapes: [
        {
          titre: en ? 'What a df measures' : 'Ce qu\'un df mesure',
          contenu: en
            ? `The discount factor is the price TODAY of €1 delivered in ${annees} years, with certainty. Beyond one year, the module's convention is ANNUAL compounding (consistent with module 4's present values): $df = \\dfrac{1}{(1 + z)^{T}}$ — the exact inverse of letting €1 grow at ${pct(taux, 1)} for ${annees} years.`
            : `Le facteur d'actualisation est le prix AUJOURD'HUI d'1 € livré dans ${annees} ans, avec certitude. Au-delà d'un an, la convention du module est la composition ANNUELLE (cohérente avec les valeurs actuelles du module 4) : $df = \\dfrac{1}{(1 + z)^{T}}$ — l'exact inverse du placement d'1 € à ${pct(taux, 1)} pendant ${annees} ans.`,
        },
        {
          titre: en ? 'Compute it' : 'Le calculer',
          contenu: en
            ? `$(1 + ${f(taux, 1)}\\,\\%)^{${annees}} = ${f(capitalisation, 6)}$, hence $df = \\dfrac{1}{${f(capitalisation, 6)}}$ = **${f(reponse, 6)}**. Check by going back: ${f(reponse, 6)} × ${f(capitalisation, 6)} = 1 — the round trip discount-then-compound must land exactly on one euro.`
            : `$(1 + ${f(taux, 1)}\\,\\%)^{${annees}} = ${f(capitalisation, 6)}$, d'où $df = \\dfrac{1}{${f(capitalisation, 6)}}$ = **${f(reponse, 6)}**. Vérification en sens inverse : ${f(reponse, 6)} × ${f(capitalisation, 6)} = 1 — l'aller-retour actualiser-puis-capitaliser doit retomber exactement sur un euro.`,
        },
        {
          titre: en ? 'Why swaps care' : 'Pourquoi les swaps s\'en soucient',
          contenu: en
            ? `A flow of €1m in ${annees} years is worth ${f(reponse, 6)} M€ today — and that is the whole job: dfs turn any schedule of future flows into one number. They are the bricks of the next two exercises: the par swap rate is literally $(1 - df_n)/\\sum df_i$, and a swap's mark-to-market is a sum of df-weighted gaps. Sanity check: for a positive rate, a df always sits strictly below 1.`
            : `Un flux de 1 M€ dans ${annees} ans vaut ${f(reponse, 6)} M€ aujourd'hui — et c'est tout l'enjeu : les df transforment n'importe quel échéancier de flux futurs en un seul nombre. Ce sont les briques des deux exercices suivants : le taux de swap paritaire vaut littéralement $(1 - df_n)/\\sum df_i$, et le mark-to-market d'un swap est une somme d'écarts pondérés par les df. Contrôle d'ordre de grandeur : pour un taux positif, un df est toujours strictement inférieur à 1.`,
        },
      ],
      pieges: [
        en
          ? `Discounting linearly: $1/(1 + ${f(taux, 1)}\\,\\% × ${annees}) = ${f(fauxLineaire, 6)}$ instead of ${f(reponse, 6)}. The linear convention stops at one year (money market); beyond, interest compounds — and the gap between the two grows with the horizon and the rate.`
          : `Actualiser en linéaire : $1/(1 + ${f(taux, 1)}\\,\\% × ${annees}) = ${f(fauxLineaire, 6)}$ au lieu de ${f(reponse, 6)}. La convention linéaire s'arrête à un an (le monétaire) ; au-delà, les intérêts composent — et l'écart entre les deux grandit avec l'horizon et le taux.`,
        en
          ? `Compounding instead of discounting: $(1 + z)^{T} = ${f(fauxCapital, 6)}$ — a factor ABOVE 1, dimensionally a future value, not a price of today. One euro tomorrow is worth less than one euro today: any df above 1 should set off the alarm before any formula does.`
          : `Capitaliser au lieu d'actualiser : $(1 + z)^{T} = ${f(fauxCapital, 6)}$ — un facteur AU-DESSUS de 1, dimensionnellement une valeur future, pas un prix d'aujourd'hui. Un euro demain vaut moins qu'un euro aujourd'hui : tout df supérieur à 1 doit sonner l'alarme avant même toute formule.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 11. Le taux de swap paritaire (N2)
// ---------------------------------------------------------------------------
export const genSwapParitaire: ExerciseGenerator = {
  id: 'm7-ex-11',
  moduleId: M7,
  titre: 'Le taux de swap paritaire',
  titreEn: 'The par swap rate',
  difficulte: 2,
  // Tirages (ordre strict) : 1. z1 = randFloat(2.5, 4.5, 1) · 2. forme = pick(['croissante',
  // 'croissante', 'plate', 'decroissante']) · 3. pas = randFloat(0.2, 0.5, 1) · 4. n = pick([3, 4]).
  // zeros[i] = z1 + signe × pas × i (croissante +, plate 0, décroissante −) ; tous > 1 % par
  // construction. Réponse via tauxSwapParitaire (df par facteurActualisation, composition annuelle).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const z1 = randFloat(rng, 2.5, 4.5, 1);
    const forme = pick(rng, ['croissante', 'croissante', 'plate', 'decroissante'] as const);
    const pas = randFloat(rng, 0.2, 0.5, 1);
    const n = pick(rng, [3, 4] as const);

    const signe = forme === 'croissante' ? 1 : forme === 'plate' ? 0 : -1;
    const zeros = Array.from({ length: n }, (_, i) => r2(z1 + signe * pas * i));
    const reponse = r4(tauxSwapParitaire(zeros));
    const dfs = zeros.map((z, i) => facteurActualisation(z, i + 1));
    const sommeDf = dfs.reduce((a, b) => a + b, 0);
    const dfn = dfs[dfs.length - 1];
    const fauxMoyenne = r4(zeros.reduce((a, b) => a + b, 0) / n);
    const estPlate = forme === 'plate';

    const en = langue === 'en';
    const { f, pct } = formatters(langue);
    const listeCourbe = zeros
      .map((z, i) => (en ? `${pct(z, 1)} at ${i + 1} year${i > 0 ? 's' : ''}` : `${pct(z, 1)} à ${i + 1} an${i > 0 ? 's' : ''}`))
      .join(en ? ', ' : ', ');
    const listeDf = dfs
      .map((df, i) => `$df_{${i + 1}} = ${f(r6(df), 6)}$`)
      .join(' ; ');
    return {
      enonce: en
        ? `Your desk must quote a ${n}-year interest rate swap, annual payments, against the zero-coupon curve: ${listeCourbe}.\n\n**What fixed rate makes the swap fair (zero value) at inception — the par swap rate, in % (4 decimals)?**`
        : `Votre desk doit coter un swap de taux ${n} ans, paiements annuels, contre la courbe zéro-coupon : ${listeCourbe}.\n\n**Quel taux fixe rend le swap équitable (valeur nulle) à la signature — le taux de swap paritaire, en % (4 décimales) ?**`,
      reponse,
      tolerance: 0.005,
      unite: '%',
      etapes: [
        {
          titre: en ? 'The floating leg is worth par — no forecast needed' : 'La jambe variable vaut le pair — aucune prévision',
          contenu: en
            ? `Add the notional fictitiously to both legs: the floating leg + notional becomes a rolled money-market deposit, which is worth its face value at every fixing — par, always. The unknown future fixings have vanished from the problem: only the fixed leg remains to price, and the par rate $C^*$ is the coupon that puts IT at par too.`
            : `Ajoutez fictivement le notionnel aux deux jambes : la jambe variable + notionnel devient un placement monétaire roulé, qui vaut son nominal à chaque fixing — le pair, toujours. Les fixings futurs inconnus ont disparu du problème : il ne reste qu'à valoriser la jambe fixe, et le taux paritaire $C^*$ est le coupon qui la met elle aussi au pair.`,
        },
        {
          titre: en ? 'The discount factors, then the ratio' : 'Les facteurs d\'actualisation, puis le ratio',
          contenu: en
            ? `Annual compounding on each pillar: ${listeDf}. Sum: $\\sum df = ${f(r6(sommeDf), 6)}$; discount of the notional: $1 - df_{${n}} = ${f(r6(1 - dfn), 6)}$. Then $C^* = \\dfrac{1 - df_{${n}}}{\\sum df_i} = \\dfrac{${f(r6(1 - dfn), 6)}}{${f(r6(sommeDf), 6)}} × 100$ = **${f(reponse, 4)} %** — the coupon that exactly amortises the discounted notional's decay.`
            : `Composition annuelle sur chaque pilier : ${listeDf}. Somme : $\\sum df = ${f(r6(sommeDf), 6)}$ ; décote du notionnel : $1 - df_{${n}} = ${f(r6(1 - dfn), 6)}$. Puis $C^* = \\dfrac{1 - df_{${n}}}{\\sum df_i} = \\dfrac{${f(r6(1 - dfn), 6)}}{${f(r6(sommeDf), 6)}} × 100$ = **${f(reponse, 4)} %** — le coupon qui amortit exactement la décote du notionnel actualisé.`,
        },
        {
          titre: en ? 'Read the number against the curve' : 'Lire le chiffre contre la courbe',
          contenu: en
            ? estPlate
              ? `The curve is flat at ${pct(z1, 1)} and the par rate comes out at exactly ${f(reponse, 4)} % — the textbook limit case: with every pillar discounting at the same rate, the weighted average IS the flat rate, whatever the maturity. Any other answer on a flat curve signals a computation slip.`
              : `The par rate ${f(reponse, 4)} % sits between the 1-year (${pct(zeros[0], 1)}) and the ${n}-year (${pct(zeros[n - 1], 1)}), pulled towards the long pillars: it is a df-WEIGHTED average of the curve, not an arithmetic one. ${forme === 'croissante' ? 'Rising curve ⇒ par rate close to, but below, the last pillar.' : 'Inverted curve ⇒ par rate close to, but above, the last pillar — it can even sit below the 1-year rate on steep inversions.'} Limit case to keep handy: flat curve ⇒ par rate = the flat rate, exactly.`
            : estPlate
              ? `La courbe est plate à ${pct(z1, 1)} et le paritaire ressort exactement à ${f(reponse, 4)} % — le cas limite du cours : quand tous les piliers actualisent au même taux, la moyenne pondérée EST le taux plat, quelle que soit la maturité. Toute autre réponse sur courbe plate signale une erreur de calcul.`
              : `Le paritaire ${f(reponse, 4)} % s'installe entre le 1 an (${pct(zeros[0], 1)}) et le ${n} ans (${pct(zeros[n - 1], 1)}), tiré vers les piliers longs : c'est une moyenne de la courbe PONDÉRÉE par les df, pas une moyenne arithmétique. ${forme === 'croissante' ? 'Courbe croissante ⇒ paritaire proche du dernier pilier, mais en dessous.' : 'Courbe inversée ⇒ paritaire proche du dernier pilier, mais au-dessus — il peut même passer sous le taux 1 an sur les inversions marquées.'} Cas limite à garder en poche : courbe plate ⇒ paritaire = taux plat, exactement.`,
        },
      ],
      pieges: [
        en
          ? estPlate
            ? `Generalising the flat case: here the arithmetic mean of the zeros (${f(fauxMoyenne, 4)} %) happens to be the right answer — ONLY because the curve is flat. The moment the curve tilts, each pillar weighs its df and the shortcut breaks: the formula is $(1 - df_n)/\\sum df_i$, never the average of the rates.`
            : `Averaging the zero rates: ${f(fauxMoyenne, 4)} % instead of ${f(reponse, 4)} % — plausible, wrong. Each pillar weighs its discount factor: the near flows weigh more than the far ones, and the notional's decay only depends on the LAST pillar. The only safe route is $(1 - df_n)/\\sum df_i$.`
          : estPlate
            ? `Généraliser le cas plat : ici la moyenne arithmétique des zéros (${f(fauxMoyenne, 4)} %) tombe juste — UNIQUEMENT parce que la courbe est plate. Dès qu'elle penche, chaque pilier pèse son df et le raccourci casse : la formule est $(1 - df_n)/\\sum df_i$, jamais la moyenne des taux.`
            : `Faire la moyenne des taux zéro : ${f(fauxMoyenne, 4)} % au lieu de ${f(reponse, 4)} % — plausible, faux. Chaque pilier pèse son facteur d'actualisation : les flux proches pèsent plus que les lointains, et la décote du notionnel ne dépend que du DERNIER pilier. La seule route sûre est $(1 - df_n)/\\sum df_i$.`,
        en
          ? `Taking the last pillar's rate (${pct(zeros[n - 1], 1)}) as the swap rate: the swap pays a coupon EVERY year, not only at maturity — its rate is an average of the whole curve, not the level of its endpoint. The two only coincide on a flat curve.`
          : `Prendre le taux du dernier pilier (${pct(zeros[n - 1], 1)}) comme taux de swap : le swap verse un coupon CHAQUE année, pas seulement à l'échéance — son taux est une moyenne de toute la courbe, pas le niveau de son point terminal. Les deux ne coïncident que sur une courbe plate.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 12. La valeur du swap pour le payeur fixe (N3)
// ---------------------------------------------------------------------------
export const genValeurSwap: ExerciseGenerator = {
  id: 'm7-ex-12',
  moduleId: M7,
  titre: 'La valeur du swap pour le payeur fixe',
  titreEn: 'Swap value for the fixed-rate payer',
  difficulte: 3,
  // Tirages (ordre strict) : 1. notionnelM = pick([50, 100, 200]) · 2. z = randFloat(2, 4.5, 1)
  // · 3. scenario = pick(['perd', 'gagne']) · 4. ecart = randFloat(0.5, 1.5, 1) · 5. n = pick([3, 4, 5]).
  // Courbe PLATE à z % (⇒ paritaire = z exactement) ; perd ⇒ fixe payé = z + écart (taux ont
  // baissé sous le fixe : valeur négative) ; gagne ⇒ fixe = z − écart (valeur positive).
  // Réponse via valeurSwapPayeurFixe, en M€.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const notionnelM = pick(rng, [50, 100, 200] as const);
    const z = randFloat(rng, 2, 4.5, 1);
    const scenario = pick(rng, ['perd', 'gagne'] as const);
    const ecart = randFloat(rng, 0.5, 1.5, 1);
    const n = pick(rng, [3, 4, 5] as const);

    const perd = scenario === 'perd';
    const fixe = perd ? r2(z + ecart) : r2(z - ecart);
    const zeros = Array.from({ length: n }, () => z);
    const reponse = r4(valeurSwapPayeurFixe(fixe, zeros, notionnelM));
    const dfs = zeros.map((zz, i) => facteurActualisation(zz, i + 1));
    const sommeDf = dfs.reduce((a, b) => a + b, 0);
    const flatAnnuelM = r4(notionnelM * (ecart / 100)); // sur/sous-paiement annuel en M€, toujours > 0
    const fauxSansActu = r2((perd ? -1 : 1) * flatAnnuelM * n);

    const en = langue === 'en';
    const { f, pct, sgn } = formatters(langue);
    const listeDf = dfs.map((df, i) => `$df_{${i + 1}} = ${f(r6(df), 6)}$`).join(' ; ');
    return {
      enonce: en
        ? `Some time ago, you signed a fixed-rate PAYER swap at ${pct(fixe, 1)} on €${f(notionnelM, 0)}m. ${n} years of annual payments remain, and today's zero curve is flat at ${pct(z, 1)}.\n\n**What is the swap worth to you, in €m (with its sign)?**`
        : `Il y a quelque temps, vous avez signé un swap PAYEUR du taux fixe à ${pct(fixe, 1)} sur ${f(notionnelM, 0)} M€. Il reste ${n} années de paiements annuels, et la courbe zéro est aujourd'hui plate à ${pct(z, 1)}.\n\n**Que vaut le swap pour vous, en M€ (avec son signe) ?**`,
      reponse,
      tolerance: 0.005,
      unite: 'M€',
      etapes: [
        {
          titre: en ? 'Locate the market: the par rate' : 'Situer le marché : le taux paritaire',
          contenu: en
            ? `On a flat curve at ${pct(z, 1)}, the par swap rate is ${pct(z, 1)} exactly — that is the price at which NEW swaps sign today. You pay ${pct(fixe, 1)}, i.e. ${f(ecart, 1)} point${ecart > 1 ? 's' : ''} ${perd ? 'ABOVE' : 'BELOW'} the market: every year, against an identical floating leg, you ${perd ? 'overpay' : 'underpay'} ${f(notionnelM, 0)} × ${f(ecart, 1)} % = ${f(flatAnnuelM, 2)} M€ compared with a swap signed today.`
            : `Sur une courbe plate à ${pct(z, 1)}, le taux de swap paritaire vaut ${pct(z, 1)} exactement — c'est le prix auquel les NOUVEAUX swaps se signent aujourd'hui. Vous payez ${pct(fixe, 1)}, soit ${f(ecart, 1)} point${ecart > 1 ? 's' : ''} ${perd ? 'AU-DESSUS' : 'EN DESSOUS'} du marché : chaque année, contre une jambe variable identique, vous ${perd ? 'surpayez' : 'sous-payez'} ${f(notionnelM, 0)} × ${f(ecart, 1)} % = ${f(flatAnnuelM, 2)} M€ par rapport à un swap signé aujourd'hui.`,
        },
        {
          titre: en ? 'Discount the annuity of the gap' : 'Actualiser l\'annuité d\'écart',
          contenu: en
            ? `The ${f(flatAnnuelM, 2)} M€ ${perd ? 'overpayment' : 'saving'} recurs over ${n} years — discount it: ${listeDf}, $\\sum df = ${f(r6(sommeDf), 6)}$. Value $= ${perd ? '−' : '+'}${f(flatAnnuelM, 2)} × ${f(r6(sommeDf), 6)}$ = **${sgn(reponse, 4)} M€** (equivalently: notional − value of the fixed leg priced as a bond — same number).`
            : `Les ${f(flatAnnuelM, 2)} M€ ${perd ? 'de surcoût' : 'd\'économie'} se répètent pendant ${n} ans — actualisez-les : ${listeDf}, $\\sum df = ${f(r6(sommeDf), 6)}$. Valeur $= ${perd ? '−' : '+'}${f(flatAnnuelM, 2)} × ${f(r6(sommeDf), 6)}$ = **${sgn(reponse, 4)} M€** (de façon équivalente : notionnel − valeur de la jambe fixe pricée comme une obligation — même chiffre).`,
        },
        {
          titre: en ? 'Read the sign — and the rule behind it' : 'Lire le signe — et la règle derrière',
          contenu: en
            ? perd
              ? `Negative value: rates have FALLEN below your contractual fixed rate, and the fixed payer loses when rates fall — ${sgn(reponse, 2)} M€ is the unwinding fee your bank would charge today to tear the contract up. The rule, stated the memorable way: **rates up ⇒ fixed payer gains** (like a bond seller); here they went the other way.`
              : `Positive value: rates have RISEN above your contractual fixed rate — you pay ${pct(fixe, 1)} when the market now demands ${pct(z, 1)}, and you receive a floating leg that climbed. ${sgn(reponse, 2)} M€ is what a counterparty would pay you today to take the contract over. The rule to hammer: **rates up ⇒ fixed payer gains** — like a bond seller, the exact mirror of module 4's bondholder.`
            : perd
              ? `Valeur négative : les taux ont BAISSÉ sous votre fixe contractuel, et le payeur fixe perd quand les taux baissent — ${sgn(reponse, 2)} M€ est la soulte que votre banque vous réclamerait aujourd'hui pour déchirer le contrat. La règle, dans le sens mémorable : **les taux montent ⇒ le payeur fixe gagne** (comme un vendeur d'obligations) ; ici, ils ont fait le chemin inverse.`
              : `Valeur positive : les taux ont MONTÉ au-dessus de votre fixe contractuel — vous payez ${pct(fixe, 1)} quand le marché exige désormais ${pct(z, 1)}, et vous encaissez une jambe variable qui a grimpé. ${sgn(reponse, 2)} M€ est ce qu'une contrepartie vous paierait aujourd'hui pour reprendre le contrat. La règle à marteler : **les taux montent ⇒ le payeur fixe gagne** — comme un vendeur d'obligations, l'exact miroir du porteur du module 4.`,
        },
      ],
      pieges: [
        en
          ? `Skipping the discounting: ${perd ? '−' : '+'}${f(flatAnnuelM, 2)} × ${n} = ${sgn(fauxSansActu, 2)} M€ instead of ${sgn(reponse, 4)} M€. A sum of future flows is not a value of today — every annual gap must be weighted by its df, exactly as in module 4's bond pricing.`
          : `Oublier d'actualiser : ${perd ? '−' : '+'}${f(flatAnnuelM, 2)} × ${n} = ${sgn(fauxSansActu, 2)} M€ au lieu de ${sgn(reponse, 4)} M€. Une somme de flux futurs n'est pas une valeur d'aujourd'hui — chaque écart annuel doit être pondéré par son df, exactement comme au pricing obligataire du module 4.`,
        en
          ? `The direction slip that eliminates at the interview: "${perd ? 'rates are lower and I pay fixed, so my floating receipts shrink — but surely my fixed rate adjusts?' : 'rates are higher and I pay interest, so everything costs me more?'}" No: your fixed rate is CONTRACTUAL, frozen forever; what moves is the par rate of NEW swaps, the yardstick your contract is marked against. Rates up ⇒ fixed payer gains, rates down ⇒ fixed payer loses — no exception.`
          : `Le contresens de sens qui élimine à l'oral : « ${perd ? 'les taux ont baissé et je paie le fixe, donc mon variable reçu fond — mais mon fixe ne se renégocie-t-il pas ?' : 'les taux ont monté et je paie des intérêts, donc tout me coûte plus cher ?'} » Non : votre fixe est CONTRACTUEL, figé pour toujours ; ce qui bouge, c'est le paritaire des NOUVEAUX swaps, l'étalon contre lequel votre contrat est valorisé. Taux en hausse ⇒ payeur fixe gagne, taux en baisse ⇒ payeur fixe perd — sans exception.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 13. Combien de contrats pour couvrir ? (N2)
// ---------------------------------------------------------------------------
export const genContratsCouverture: ExerciseGenerator = {
  id: 'm7-ex-13',
  moduleId: M7,
  titre: 'Combien de contrats pour couvrir ?',
  titreEn: 'How many contracts to hedge?',
  difficulte: 2,
  // Tirages (ordre strict) : 1. expositionM = randInt(5, 60) · 2. contrat = pick(['cac', 'stoxx', 'emini'])
  // · 3. pCac = randInt(5600, 8200) · 4. pStoxx = randInt(4200, 5600) · 5. pEmini = randInt(4500, 6800).
  // Tous les tirages ont lieu, puis on retient le prix du contrat choisi (CAC et Euro Stoxx
  // 10 €/pt, E-mini 50 $/pt). Réponse via nombreContratsCouverture (arrondi standard, entier).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const expositionM = randInt(rng, 5, 60);
    const contrat = pick(rng, ['cac', 'stoxx', 'emini'] as const);
    const pCac = randInt(rng, 5600, 8200);
    const pStoxx = randInt(rng, 4200, 5600);
    const pEmini = randInt(rng, 4500, 6800);

    const estEmini = contrat === 'emini';
    const mult = estEmini ? 50 : 10;
    const prix = contrat === 'cac' ? pCac : contrat === 'stoxx' ? pStoxx : pEmini;
    const reponse = nombreContratsCouverture(expositionM, prix, mult);
    const valeurContrat = prix * mult;
    const brut = (expositionM * 1e6) / valeurContrat;
    const fauxSansMult = Math.round((expositionM * 1e6) / prix);
    const derive1pct = r2(expositionM * 1e6 * 0.01);

    const en = langue === 'en';
    const { f, sgn } = formatters(langue);
    const cash = estEmini ? formatters(langue).usd : formatters(langue).eur;
    const sym = estEmini ? '$' : '€';
    const nomContrat = contrat === 'cac' ? 'CAC 40' : contrat === 'stoxx' ? 'Euro Stoxx 50' : 'E-mini S&P 500';
    const multTexte = estEmini ? (en ? '$50/point' : '50 $/point') : (en ? '€10/point' : '10 €/point');
    return {
      enonce: en
        ? `A portfolio manager wants to temporarily neutralise ${sym === '$' ? '$' : '€'}${f(expositionM, 0)}m of ${estEmini ? 'US' : 'European'} equities with ${nomContrat} futures: the contract trades at ${f(prix, 0)} points, multiplier ${multTexte}.\n\n**How many contracts should be traded (one-for-one hedge, beta = 1)?**`
        : `Un gérant souhaite neutraliser temporairement ${f(expositionM, 0)} M${sym} d'actions ${estEmini ? 'américaines' : 'européennes'} avec des futures ${nomContrat} : le contrat cote ${f(prix, 0)} points, multiplicateur ${multTexte}.\n\n**Combien de contrats doit-il traiter (couverture 1 pour 1, bêta = 1) ?**`,
      reponse,
      tolerance: 0.5,
      toleranceMode: 'absolu',
      unite: 'contrats',
      etapes: [
        {
          titre: en ? 'What one contract weighs' : 'Ce que pèse un contrat',
          contenu: en
            ? `One contract carries price × multiplier = ${f(prix, 0)} × ${f(mult, 0)} = **${cash(valeurContrat, 0)}** of index exposure — that is the unit of account of the whole hedge, and the number to compute before anything else.`
            : `Un contrat porte prix × multiplicateur = ${f(prix, 0)} × ${f(mult, 0)} = **${cash(valeurContrat, 0)}** d'exposition à l'indice — c'est l'unité de compte de toute la couverture, et le chiffre à poser avant tout le reste.`,
        },
        {
          titre: en ? 'Divide, then round to a whole contract' : 'Diviser, puis arrondir au contrat entier',
          contenu: en
            ? `$N = \\dfrac{\\text{exposure}}{\\text{price} × \\text{mult}} = \\dfrac{${f(expositionM, 0)}\\,000\\,000}{${f(valeurContrat, 0)}} = ${f(r2(brut), 2)}$ → only WHOLE contracts trade: standard rounding gives **${f(reponse, 0)} contracts**, to SELL — the short futures leg gains when the index falls, offsetting the portfolio's loss.`
            : `$N = \\dfrac{\\text{exposition}}{\\text{prix} × \\text{mult}} = \\dfrac{${f(expositionM, 0)}\\,000\\,000}{${f(valeurContrat, 0)}} = ${f(r2(brut), 2)}$ → on ne traite que des contrats ENTIERS : l'arrondi standard donne **${f(reponse, 0)} contrats**, à la VENTE — la jambe futures courte gagne quand l'indice baisse et compense la perte du portefeuille.`,
        },
        {
          titre: en ? 'What the hedge does NOT cover' : 'Ce que la couverture ne couvre PAS',
          contenu: en
            ? `"Perfect" only under conditions never guaranteed: the portfolio must track the index (beta = 1, no tracking error) and the contract's expiry must match the horizon (otherwise roll, at the cost of the curve's slope). The residual is basis risk: if the portfolio slips just 1% against the index, the hedge leaks ${cash(derive1pct, 0)} — small percentage, real money. A hedge swaps price risk for basis risk; it does not abolish risk.`
            : `« Parfaite » seulement sous des conditions jamais garanties : que le portefeuille suive l'indice (bêta = 1, pas de tracking error) et que l'échéance du contrat colle à l'horizon (sinon roll, au prix de la pente de la courbe). Le résidu s'appelle risque de base : si le portefeuille dévie d'à peine 1 % contre l'indice, la couverture laisse passer ${cash(derive1pct, 0)} — petit pourcentage, vrai argent. Une couverture troque le risque de prix contre le risque de base ; elle n'abolit pas le risque.`,
        },
      ],
      pieges: [
        en
          ? `Forgetting the multiplier: ${f(expositionM, 0)}m/${f(prix, 0)} = ${f(fauxSansMult, 0)} contracts — a massive over-hedge by a factor of ${f(mult, 0)}. The index level is in points; only price × multiplier is in money.`
          : `Oublier le multiplicateur : ${f(expositionM, 0)} M/${f(prix, 0)} = ${f(fauxSansMult, 0)} contrats — une sur-couverture massive, d'un facteur ${f(mult, 0)}. Le niveau d'indice est en points ; seul prix × multiplicateur est en argent.`,
        en
          ? `Saying "hedged, therefore riskless" — the eliminating shortcut at the orals: ${sgn(reponse, 0)} contracts neutralise the INDEX leg only. Beta away from 1, tracking error, a roll on a sloped curve: each leaves a residual P&L — judged in basis points, paid in ${sym === '$' ? 'dollars' : 'euros'}.`
          : `Dire « couvert, donc sans risque » — le raccourci éliminatoire à l'oral : les ${f(reponse, 0)} contrats neutralisent la seule jambe INDICE. Un bêta différent de 1, une tracking error, un roll sur courbe pentue : chacun laisse un P&L résiduel — jugé en points de base, payé en ${sym === '$' ? 'dollars' : 'euros'}.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 14. MtM cumulé : la somme des soirs (N3)
// ---------------------------------------------------------------------------
export const genMtmCumule: ExerciseGenerator = {
  id: 'm7-ex-14',
  moduleId: M7,
  titre: 'MtM cumulé : la somme des soirs',
  titreEn: 'Cumulative MtM: the sum of evenings',
  difficulte: 3,
  // Tirages (ordre strict) : 1. entree = randInt(4600, 7600) · 2. sens = pick([1, −1])
  // · 3. nb = randInt(1, 5) · 4-7. d1..d4 = randInt(−18, 18) × 5 (quatre variations quotidiennes
  // en points, multiples de 5, éventuellement nulles). Multiplicateur 10 €/pt. Les quatre flux
  // sont calculés via margeVariation ; leur somme télescopique EST pnlFutures(entrée, dernier) —
  // la réponse passe par pnlFutures, et le corrigé recoupe les deux chemins.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const entree = randInt(rng, 4600, 7600);
    const sens = pick(rng, [1, -1] as const);
    const nb = randInt(rng, 1, 5);
    const d1 = randInt(rng, -18, 18) * 5;
    const d2 = randInt(rng, -18, 18) * 5;
    const d3 = randInt(rng, -18, 18) * 5;
    const d4 = randInt(rng, -18, 18) * 5;

    const mult = 10;
    const p1 = entree + d1;
    const p2 = p1 + d2;
    const p3 = p2 + d3;
    const p4 = p3 + d4;
    const flux = [
      r2(margeVariation(entree, p1, mult, nb, sens)),
      r2(margeVariation(p1, p2, mult, nb, sens)),
      r2(margeVariation(p2, p3, mult, nb, sens)),
      r2(margeVariation(p3, p4, mult, nb, sens)),
    ];
    const reponse = r2(pnlFutures(entree, p4, mult, nb, sens));
    const totalDebits = r2(flux.filter((x) => x < 0).reduce((a, b) => a + b, 0));
    const estLong = sens === 1;

    const en = langue === 'en';
    const { f, eur, sgn } = formatters(langue);
    const jours = en ? ['Tuesday', 'Wednesday', 'Thursday', 'Friday'] : ['mardi', 'mercredi', 'jeudi', 'vendredi'];
    const prix = [entree, p1, p2, p3, p4];
    const detailFlux = flux
      .map((fx, i) => `${jours[i]} $(${f(prix[i + 1], 0)} - ${f(prix[i], 0)}) × ${f(mult, 0)} × ${f(nb, 0)} × (${sens === 1 ? '+1' : '−1'}) = ${sgn(fx, 0)}$ €`)
      .join(' ; ');
    return {
      enonce: en
        ? `Monday evening, you open a ${estLong ? 'long' : 'short'} position of ${f(nb, 0)} contract${nb > 1 ? 's' : ''} on an index futures (multiplier €10/point) at the settlement price of ${f(entree, 0)} points. The next four evenings, the contract settles at ${f(p1, 0)}, ${f(p2, 0)}, ${f(p3, 0)} then ${f(p4, 0)} points, where you close out.\n\n**What is the cumulative P&L of the position — the sum of the four variation margins — in euros (with its sign)?**`
        : `Lundi soir, vous ouvrez une position ${estLong ? 'longue' : 'courte'} de ${f(nb, 0)} contrat${nb > 1 ? 's' : ''} sur un futures d'indice (multiplicateur 10 €/point) au cours de compensation de ${f(entree, 0)} points. Les quatre soirs suivants, le contrat compense à ${f(p1, 0)}, ${f(p2, 0)}, ${f(p3, 0)} puis ${f(p4, 0)} points, où vous soldez la position.\n\n**Quel est le P&L cumulé de la position — la somme des quatre marges de variation — en euros (avec son signe) ?**`,
      reponse,
      tolerance: 1,
      toleranceMode: 'absolu',
      unite: '€',
      etapes: [
        {
          titre: en ? 'The four evening flows' : 'Les quatre flux du soir',
          contenu: en
            ? `Each evening pays (or charges) settlement against settlement: ${detailFlux}. Four real cash movements, credited or debited on the margin account night after night.`
            : `Chaque soir paie (ou facture) compensation contre compensation : ${detailFlux}. Quatre mouvements de cash bien réels, crédités ou débités sur le compte de marge soir après soir.`,
        },
        {
          titre: en ? 'The telescoping sum' : 'La somme télescopique',
          contenu: en
            ? `Add them: ${flux.map((x) => sgn(x, 0)).join(' ')} = **${sgn(reponse, 0)} €**. No need to sum, actually — the intermediate prices cancel out two by two, and what remains is $(${f(p4, 0)} - ${f(entree, 0)}) × ${f(mult, 0)} × ${f(nb, 0)} × (${sens === 1 ? '+1' : '−1'})$: exactly the P&L of a position closed at ${f(p4, 0)}. The mark-to-market does not change WHAT you make; it changes WHEN you pay it.`
            : `Additionnez-les : ${flux.map((x) => sgn(x, 0)).join(' ')} = **${sgn(reponse, 0)} €**. Inutile de sommer, en réalité — les cours intermédiaires se télescopent deux à deux, et il reste $(${f(p4, 0)} - ${f(entree, 0)}) × ${f(mult, 0)} × ${f(nb, 0)} × (${sens === 1 ? '+1' : '−1'})$ : exactement le P&L d'une position soldée à ${f(p4, 0)}. Le mark-to-market ne change pas CE QUE vous gagnez ; il change QUAND vous le payez.`,
        },
        {
          titre: en ? 'Same P&L as a forward — not the same life' : 'Même P&L qu\'un forward — pas la même vie',
          contenu: en
            ? `A forward unwound at ${f(p4, 0)} would have produced the same ${sgn(reponse, 0)} € in ONE flow at the end. The futures spread it over four evenings${totalDebits < 0 ? `, including ${eur(Math.abs(totalDebits), 0)} of debits to fund IN CASH on the bad nights — possibly margin calls on top` : ' — here without a single losing evening, the comfortable path'}. That is Metallgesellschaft's lesson: an economically sound position can die of treasury before being right. Size on the worst path, not on the destination.`
            : `Un forward dénoué à ${f(p4, 0)} aurait produit le même ${sgn(reponse, 0)} € en UN flux, à la fin. Le futures l'a étalé sur quatre soirées${totalDebits < 0 ? `, dont ${eur(Math.abs(totalDebits), 0)} de débits à financer EN CASH les mauvais soirs — appels de marge possibles en prime` : ' — ici sans une seule soirée perdante, le chemin confortable'}. C'est la leçon de Metallgesellschaft : une position économiquement juste peut mourir de trésorerie avant d'avoir raison. Dimensionnez sur le pire chemin, pas sur l'arrivée.`,
        },
      ],
      pieges: [
        en
          ? `Believing the P&L waits for the close-out: it settles EVERY evening. Two positions with identical start and end points but different paths pay identical totals — yet one of them may have burned through the margin account mid-week and been liquidated before Friday ever came.`
          : `Croire que le P&L attend le débouclage : il se règle CHAQUE soir. Deux positions aux mêmes points de départ et d'arrivée mais aux chemins différents paient le même total — mais l'une des deux peut avoir crevé le compte de marge en milieu de semaine et été liquidée avant même que vendredi n'arrive.`,
        en
          ? `Sign slip on the ${estLong ? 'long' : 'short'}: every flow flips, and the total becomes ${sgn(-reponse, 0)} € instead of ${sgn(reponse, 0)} €. Fix the direction once, before day one — it multiplies EVERY evening of the position's life.`
          : `Erreur de sens sur le ${estLong ? 'long' : 'short'} : chaque flux s'inverse, et le total devient ${sgn(-reponse, 0)} € au lieu de ${sgn(reponse, 0)} €. Fixez le sens une fois pour toutes, avant le premier jour — il multiplie CHAQUE soir de la vie de la position.`,
      ],
    };
  },
};

export const exercices: ExerciseGenerator[] = [
  genPnlPosition,
  genEffetLevierMarge,
  genMargeVariationSoir,
  genAppelMarge,
  genForwardIndice,
  genArbitrageCashCarry,
  genForwardImplicite,
  genReglementFraEx,
  genFuturesTaux,
  genFacteurActu,
  genSwapParitaire,
  genValeurSwap,
  genContratsCouverture,
  genMtmCumule,
];
