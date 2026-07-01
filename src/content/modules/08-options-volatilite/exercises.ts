/**
 * Les 14 générateurs d'exercices d'application du module Options & volatilité.
 *
 * BILINGUES : generate(seed, langue = 'fr'). Invariant absolu : TOUS les tirages
 * aléatoires sont effectués AVANT toute branche de langue — un même seed produit
 * exactement les mêmes nombres, la même réponse et la même tolérance en français
 * et en anglais. Seuls les textes (énoncé, étapes, pièges, unité textuelle) changent.
 *
 * Tous les calculs passent par calculs.ts (aucune formule recopiée). Conventions
 * du module (en-tête de calculs.ts) : Black-Scholes et parité call-put en
 * composition CONTINUE (e^{−rT}) — différente du linéaire ≤ 1 an du m4/m7 ;
 * l'arbre binomial à UNE période reste en capitalisation LINÉAIRE sur la période ;
 * vega exprimé PAR POINT de volatilité ; sens = +1 acheteur, −1 vendeur ;
 * quotité standard 100 actions par contrat. Les pièges martelés ici : l'acheteur
 * perd AU PLUS la prime et le vendeur gagne AU PLUS la prime (l'asymétrie de
 * l'assureur), la probabilité risque-neutre n'est PAS une prévision, le strike
 * s'actualise dans la parité comme dans Black-Scholes, le vendeur de calls
 * ACHÈTE le sous-jacent pour se couvrir, et σ s'annualise en √252 (les variances
 * s'additionnent, pas les écarts-types). L'ordre des tirages de chaque moule est
 * documenté dans son commentaire « Tirages (ordre strict) ».
 */
import { formatNombreLangue } from '../../../engine/answers';
import { mulberry32, pick, randFloat, randInt } from '../../../engine/rng';
import type { ExerciseGenerator, Langue } from '../../../engine/types';
import { normaleCdf } from '../02-methodes-quantitatives/calculs';
import {
  actionsDeltaHedge,
  blackScholesCall,
  blackScholesPut,
  d1BlackScholes,
  d2BlackScholes,
  deltaCall,
  deltaPut,
  densiteNormale,
  dfContinu,
  gammaOption,
  payoffCall,
  payoffPut,
  pnlOption,
  pointMortCall,
  pointMortPut,
  pointsMortsStraddle,
  probaRisqueNeutre,
  putDepuisParite,
  valeurBinomiale,
  vegaOption,
  volAnnualiseePct,
  volImplicitePct,
} from './calculs';

const M8 = '08-options-volatilite';

const r2 = (v: number) => Math.round(v * 100) / 100;
const r4 = (v: number) => Math.round(v * 10_000) / 10_000;
const r6 = (v: number) => Math.round(v * 1_000_000) / 1_000_000;

/** Formateurs dépendants de la langue : nombre, euros, pourcentage, nombre signé. */
function formatters(langue: Langue) {
  const f = (v: number, d = 2) => formatNombreLangue(langue, v, d);
  const eur = (v: number, d = 2) => (langue === 'en' ? `€${f(v, d)}` : `${f(v, d)} €`);
  const pct = (v: number, d = 2) => (langue === 'en' ? `${f(v, d)}%` : `${f(v, d)} %`);
  /** Nombre signé (+4,20 / −12), pour afficher des P&L ou des écarts. */
  const sgn = (v: number, d = 2) => (v > 0 ? `+${f(v, d)}` : f(v, d));
  return { f, eur, pct, sgn };
}

/** « 3 mois » / « 6 mois » / « 1 an » / « 2 ans » selon la maturité en années. */
function libelleMaturite(annees: number, en: boolean): string {
  if (annees < 1) {
    const mois = Math.round(annees * 12);
    return en ? `${mois} months` : `${mois} mois`;
  }
  if (annees === 1) return en ? '1 year' : '1 an';
  return en ? `${annees} years` : `${annees} ans`;
}

// ---------------------------------------------------------------------------
// 1. Le payoff à l'échéance (N1)
// ---------------------------------------------------------------------------
export const genPayoffEcheance: ExerciseGenerator = {
  id: 'm8-ex-01',
  moduleId: M8,
  titre: 'Le payoff à l\'échéance',
  titreEn: 'Payoff at expiry',
  difficulte: 1,
  // Tirages (ordre strict) : 1. type = pick(['call', 'put']) · 2. strike = randInt(40, 200)
  // · 3. fin = pick(['itm', 'itm', 'otm']) · 4. ecart = randInt(3, 30).
  // call : ITM ⇒ S_T = K + écart, OTM ⇒ S_T = K − écart ; put : miroir exact.
  // Réponse via payoffCall/payoffPut — payoff plancher à zéro, jamais négatif.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const type = pick(rng, ['call', 'put'] as const);
    const strike = randInt(rng, 40, 200);
    const fin = pick(rng, ['itm', 'itm', 'otm'] as const);
    const ecart = randInt(rng, 3, 30);

    const estCall = type === 'call';
    const itm = fin === 'itm';
    const sT = estCall ? (itm ? strike + ecart : strike - ecart) : itm ? strike - ecart : strike + ecart;
    const reponse = estCall ? payoffCall(sT, strike) : payoffPut(sT, strike);
    const fauxInverse = estCall ? payoffPut(sT, strike) : payoffCall(sT, strike);

    const en = langue === 'en';
    const { f, eur } = formatters(langue);
    const nomOption = estCall ? 'call' : 'put';
    return {
      enonce: en
        ? `You hold a ${nomOption} struck at ${eur(strike, 0)} on the XYZ share, expiring today. At the expiry fixing, the share trades at ${eur(sT, 0)}.\n\n**What is your option's payoff (its exercise value), in euros per share?**`
        : `Vous détenez un ${nomOption} de strike ${eur(strike, 0)} sur l'action XYZ, qui expire aujourd'hui. Au fixing de l'échéance, l'action cote ${eur(sT, 0)}.\n\n**Quel est le payoff de votre option (sa valeur d'exercice), en euros par action ?**`,
      reponse,
      tolerance: 0.01,
      toleranceMode: 'absolu',
      unite: '€',
      etapes: [
        {
          titre: en ? 'Exercise or walk away?' : 'Exercer ou abandonner ?',
          contenu: en
            ? estCall
              ? itm
                ? `The call grants the RIGHT to buy at ${eur(strike, 0)}. The share is worth ${eur(sT, 0)}: buying at ${f(strike, 0)} what trades at ${f(sT, 0)} pockets ${f(ecart, 0)} — you exercise.`
                : `The call grants the RIGHT to buy at ${eur(strike, 0)}. The share is only worth ${eur(sT, 0)}: nobody pays ${f(strike, 0)} for what the market sells at ${f(sT, 0)} — you walk away, and that is the end of it.`
              : itm
                ? `The put grants the RIGHT to sell at ${eur(strike, 0)}. The share is only worth ${eur(sT, 0)}: selling at ${f(strike, 0)} what trades at ${f(sT, 0)} pockets ${f(ecart, 0)} — you exercise.`
                : `The put grants the RIGHT to sell at ${eur(strike, 0)}. The share is worth ${eur(sT, 0)}: nobody sells at ${f(strike, 0)} what the market buys at ${f(sT, 0)} — you walk away, and that is the end of it.`
            : estCall
              ? itm
                ? `Le call donne le DROIT d'acheter à ${eur(strike, 0)}. L'action vaut ${eur(sT, 0)} : acheter à ${f(strike, 0)} ce qui s'échange à ${f(sT, 0)} rapporte ${f(ecart, 0)} — vous exercez.`
                : `Le call donne le DROIT d'acheter à ${eur(strike, 0)}. L'action ne vaut que ${eur(sT, 0)} : personne n'achète à ${f(strike, 0)} ce qui s'obtient à ${f(sT, 0)} sur le marché — vous abandonnez, et l'affaire s'arrête là.`
              : itm
                ? `Le put donne le DROIT de vendre à ${eur(strike, 0)}. L'action ne vaut que ${eur(sT, 0)} : vendre à ${f(strike, 0)} ce qui s'échange à ${f(sT, 0)} rapporte ${f(ecart, 0)} — vous exercez.`
                : `Le put donne le DROIT de vendre à ${eur(strike, 0)}. L'action vaut ${eur(sT, 0)} : personne ne vend à ${f(strike, 0)} ce qui s'achète à ${f(sT, 0)} sur le marché — vous abandonnez, et l'affaire s'arrête là.`,
        },
        {
          titre: en ? 'The kinked formula' : 'La formule du coude',
          contenu: en
            ? `$\\text{payoff} = \\max(${estCall ? 'S_T - K' : 'K - S_T'},\\ 0) = \\max(${estCall ? `${f(sT, 0)} - ${f(strike, 0)}` : `${f(strike, 0)} - ${f(sT, 0)}`},\\ 0)$ = **${eur(reponse, 0)}** per share. A half-line and a floor at zero, kinked at the strike — the "hockey stick": the profile module 7's straight lines never produced.`
            : `$\\text{payoff} = \\max(${estCall ? 'S_T - K' : 'K - S_T'},\\ 0) = \\max(${estCall ? `${f(sT, 0)} - ${f(strike, 0)}` : `${f(strike, 0)} - ${f(sT, 0)}`},\\ 0)$ = **${eur(reponse, 0)}** par action. Une demi-droite et un plancher à zéro, coudés au strike — la « crosse de hockey » : le profil que les droites du module 7 ne produisaient jamais.`,
        },
        {
          titre: en ? 'Payoff is not P&L' : 'Le payoff n\'est pas le P&L',
          contenu: en
            ? itm
              ? `The payoff is the GROSS value of the right at expiry: the premium paid upfront does not appear in it. To get the full P&L you will subtract that premium — the next exercise's job. For now, one number: the right is worth ${eur(reponse, 0)} per share at the bell.`
              : `Zero — not a loss of ${f(ecart, 0)}. The payoff never goes below zero: the share finished ${f(ecart, 0)} on the wrong side of the strike, but the right dies without charging anything. A firm commitment (module 7) would have billed those ${eur(ecart, 0)}; the option's only cost is the premium, paid upfront — and that belongs to the P&L, not to the payoff.`
            : itm
              ? `Le payoff est la valeur BRUTE du droit à l'échéance : la prime payée au départ n'y figure pas. Pour le P&L complet, il faudra la soustraire — c'est l'objet de l'exercice suivant. Pour l'instant, un seul chiffre : le droit vaut ${eur(reponse, 0)} par action au coup de cloche.`
              : `Zéro — pas une perte de ${f(ecart, 0)}. Le payoff ne descend jamais sous zéro : l'action a fini à ${f(ecart, 0)} du mauvais côté du strike, mais le droit meurt sans rien facturer. Un engagement ferme (module 7) aurait facturé ces ${eur(ecart, 0)} ; le seul coût de l'option est la prime, payée d'avance — et elle relève du P&L, pas du payoff.`,
        },
      ],
      pieges: [
        en
          ? itm
            ? `Subtracting the premium: the question asks for the PAYOFF, not the P&L. The payoff is the exercise value of the right; the P&L then deducts the premium paid. Mixing the two costs points at the orals and money on the desk — keep the vocabulary watertight.`
            : `Announcing −${f(ecart, 0)}: an option never OBLIGES. The payoff is floored at zero — that is the whole difference with module 7's forward, which would have charged those ${eur(ecart, 0)} with no way out.`
          : itm
            ? `Soustraire la prime : la question demande le PAYOFF, pas le P&L. Le payoff est la valeur d'exercice du droit ; le P&L retranche ensuite la prime payée. Confondre les deux coûte des points à l'oral et de l'argent sur le desk — gardez le vocabulaire étanche.`
            : `Annoncer −${f(ecart, 0)} : une option n'OBLIGE jamais. Le payoff est planché à zéro — c'est toute la différence avec le forward du module 7, qui aurait facturé ces ${eur(ecart, 0)} sans échappatoire.`,
        en
          ? `Applying the ${estCall ? 'put' : 'call'}'s formula by reflex: $\\max(${estCall ? 'K - S_T' : 'S_T - K'},\\ 0) = ${f(fauxInverse, 0)}$ instead of ${f(reponse, 0)}. The call is a right to BUY (it pays when $S_T > K$), the put a right to SELL (it pays when $S_T < K$) — anchor the direction before any formula.`
          : `Appliquer par réflexe la formule du ${estCall ? 'put' : 'call'} : $\\max(${estCall ? 'K - S_T' : 'S_T - K'},\\ 0) = ${f(fauxInverse, 0)}$ au lieu de ${f(reponse, 0)}. Le call est un droit d'ACHETER (il paie quand $S_T > K$), le put un droit de VENDRE (il paie quand $S_T < K$) — ancrez le sens avant toute formule.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 2. Le P&L de l'acheteur : payoff moins prime (N1)
// ---------------------------------------------------------------------------
export const genPnlAcheteur: ExerciseGenerator = {
  id: 'm8-ex-02',
  moduleId: M8,
  titre: 'Le P&L de l\'acheteur d\'option',
  titreEn: 'Option buyer\'s P&L',
  difficulte: 1,
  // Tirages (ordre strict) : 1. type = pick(['call', 'put']) · 2. strike = randInt(40, 180)
  // · 3. prime = randFloat(2, 10, 1) · 4. scenario = pick(['gain', 'partiel', 'abandon'])
  // · 5. extra = randInt(2, 25) · 6. fract = randFloat(0.2, 0.8, 1).
  // gain ⇒ S_T au-delà du point mort (payoff = prime + extra) ; partiel ⇒ S_T entre strike et
  // point mort (payoff = prime × fract : exercé mais perdant) ; abandon ⇒ S_T du mauvais côté
  // du strike (payoff nul, perte = prime entière). Réponse via pnlOption(payoff, prime, +1).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const type = pick(rng, ['call', 'put'] as const);
    const strike = randInt(rng, 40, 180);
    const prime = randFloat(rng, 2, 10, 1);
    const scenario = pick(rng, ['gain', 'partiel', 'abandon'] as const);
    const extra = randInt(rng, 2, 25);
    const fract = randFloat(rng, 0.2, 0.8, 1);

    const estCall = type === 'call';
    const distance = scenario === 'gain' ? r2(prime + extra) : scenario === 'partiel' ? r2(prime * fract) : -extra;
    const sT = r2(estCall ? strike + distance : strike - distance);
    const payoff = estCall ? payoffCall(sT, strike) : payoffPut(sT, strike);
    const reponse = r2(pnlOption(payoff, prime, 1));
    const pointMort = estCall ? pointMortCall(strike, prime) : pointMortPut(strike, prime);

    const en = langue === 'en';
    const { f, eur, sgn } = formatters(langue);
    const nomOption = estCall ? 'call' : 'put';
    return {
      enonce: en
        ? `Convinced that an earnings release will send the share ${estCall ? 'sharply higher' : 'sharply lower'}, you buy a ${nomOption} struck at ${eur(strike, 0)}, paying a premium of ${eur(prime, 2)} per share. At expiry, the share trades at ${eur(sT, 2)}.\n\n**What is your P&L at expiry, in euros per share (with its sign)?**`
        : `Persuadé qu'une publication de résultats va faire ${estCall ? 'bondir' : 'décrocher'} le titre, vous achetez un ${nomOption} de strike ${eur(strike, 0)} en payant une prime de ${eur(prime, 2)} par action. À l'échéance, l'action cote ${eur(sT, 2)}.\n\n**Quel est votre P&L à l'échéance, en euros par action (avec son signe) ?**`,
      reponse,
      tolerance: 0.01,
      toleranceMode: 'absolu',
      unite: '€',
      etapes: [
        {
          titre: en ? 'The payoff first' : 'Le payoff d\'abord',
          contenu: en
            ? `${nomOption === 'call' ? 'Right to buy' : 'Right to sell'} at ${eur(strike, 0)} against a share at ${eur(sT, 2)}: $\\text{payoff} = \\max(${estCall ? `${f(sT, 2)} - ${f(strike, 0)}` : `${f(strike, 0)} - ${f(sT, 2)}`},\\ 0)$ = **${eur(payoff, 2)}**. ${payoff > 0 ? 'You exercise — every positive payoff is worth taking.' : 'The right dies unexercised: zero, not a negative number.'}`
            : `Droit ${estCall ? 'd\'acheter' : 'de vendre'} à ${eur(strike, 0)} face à une action à ${eur(sT, 2)} : $\\text{payoff} = \\max(${estCall ? `${f(sT, 2)} - ${f(strike, 0)}` : `${f(strike, 0)} - ${f(sT, 2)}`},\\ 0)$ = **${eur(payoff, 2)}**. ${payoff > 0 ? 'Vous exercez — tout payoff positif est bon à prendre.' : 'Le droit meurt sans être exercé : zéro, pas un nombre négatif.'}`,
        },
        {
          titre: en ? 'Subtract what was paid upfront' : 'Soustraire ce qui a été payé d\'avance',
          contenu: en
            ? `Buyer's P&L $= \\text{direction} × (\\text{payoff} - \\text{premium}) = +1 × (${f(payoff, 2)} - ${f(prime, 2)})$ = **${sgn(reponse, 2)} €** per share. The premium was paid on day one, whatever happens next: it sits in EVERY scenario of the buyer's P&L, winning or losing.`
            : `P&L de l'acheteur $= \\text{sens} × (\\text{payoff} - \\text{prime}) = +1 × (${f(payoff, 2)} - ${f(prime, 2)})$ = **${sgn(reponse, 2)} €** par action. La prime a été payée au premier jour, quoi qu'il arrive ensuite : elle figure dans TOUS les scénarios du P&L de l'acheteur, gagnants comme perdants.`,
        },
        {
          titre: en ? 'Read your scenario on the hockey stick' : 'Lire votre scénario sur la crosse de hockey',
          contenu: en
            ? scenario === 'gain'
              ? `The share cleared the breakeven (${estCall ? 'strike + premium' : 'strike − premium'} = ${eur(pointMort, 2)}): beyond that point, every euro of payoff is net profit. And had the bet failed completely, the loss would have stopped at the premium, ${eur(prime, 2)} — bounded, known, paid upfront.`
              : scenario === 'partiel'
                ? `Exercised, yet losing: the share sits between the strike (${eur(strike, 0)}) and the breakeven (${eur(pointMort, 2)}). The payoff of ${eur(payoff, 2)} pays back part of the premium and shrinks the loss from ${eur(prime, 2)} to ${eur(Math.abs(reponse), 2)} — exercising remains the right move even in the losing zone.`
                : `Total write-off: payoff zero, loss = the full premium, ${eur(prime, 2)} — and not one cent more. That is the buyer's privilege: the worst case is bounded, known and paid on day one, however far the share went (here ${eur(sT, 2)}, ${f(extra, 0)} on the wrong side of the strike).`
            : scenario === 'gain'
              ? `L'action a franchi le point mort (${estCall ? 'strike + prime' : 'strike − prime'} = ${eur(pointMort, 2)}) : au-delà, chaque euro de payoff est du profit net. Et si le pari avait totalement échoué, la perte se serait arrêtée à la prime, ${eur(prime, 2)} — bornée, connue, payée d'avance.`
              : scenario === 'partiel'
                ? `Exercé, mais perdant : l'action vit entre le strike (${eur(strike, 0)}) et le point mort (${eur(pointMort, 2)}). Le payoff de ${eur(payoff, 2)} rembourse une partie de la prime et réduit la perte de ${eur(prime, 2)} à ${eur(Math.abs(reponse), 2)} — exercer reste le bon geste, même dans la zone perdante.`
                : `Perte sèche : payoff nul, perte = la prime entière, ${eur(prime, 2)} — et pas un centime de plus. C'est le privilège de l'acheteur : le pire des cas est borné, connu et payé au premier jour, aussi loin que l'action soit allée (ici ${eur(sT, 2)}, à ${f(extra, 0)} du mauvais côté du strike).`,
        },
      ],
      pieges: [
        en
          ? scenario === 'gain'
            ? `Announcing the payoff (${eur(payoff, 2)}) as the P&L: the premium is not a sunk detail, it is the price of the right — the net gain is ${sgn(reponse, 2)} €. On a desk, forgetting the premium means overstating every winning trade by its entry cost.`
            : scenario === 'partiel'
              ? `"Below the breakeven I don't exercise": false, and it costs money. The exercise threshold is the STRIKE, not the breakeven — by exercising you recover ${eur(payoff, 2)} and lose ${eur(Math.abs(reponse), 2)} instead of the full premium ${eur(prime, 2)}. The breakeven only tells you where the profit zone starts.`
              : `Looking for a loss beyond the premium: impossible for a buyer. However hard the share moves against you, the P&L floor is −${f(prime, 2)} € — the option is the only instrument of the course where the worst case is signed upfront.`
          : scenario === 'gain'
            ? `Annoncer le payoff (${eur(payoff, 2)}) comme P&L : la prime n'est pas un détail enterré, c'est le prix du droit — le gain net vaut ${sgn(reponse, 2)} €. Sur un desk, oublier la prime revient à surestimer chaque trade gagnant de son coût d'entrée.`
            : scenario === 'partiel'
              ? `« Sous le point mort, je n'exerce pas » : faux, et ça coûte de l'argent. Le seuil d'exercice est le STRIKE, pas le point mort — en exerçant, vous récupérez ${eur(payoff, 2)} et perdez ${eur(Math.abs(reponse), 2)} au lieu de la prime entière ${eur(prime, 2)}. Le point mort ne dit qu'une chose : où commence la zone de profit.`
              : `Chercher une perte au-delà de la prime : impossible pour un acheteur. Aussi violent que soit le mouvement adverse, le plancher du P&L est −${f(prime, 2)} € — l'option est le seul instrument du cours dont le pire des cas se signe d'avance.`,
        en
          ? `Direction slip on the instrument: a ${nomOption} bought is a bet on a ${estCall ? 'RISE' : 'FALL'}. Reading the move through the wrong option flips every zone of the hockey stick — fix "call = right to buy, put = right to sell" before plugging numbers.`
          : `Erreur de sens sur l'instrument : un ${nomOption} acheté est un pari à la ${estCall ? 'HAUSSE' : 'BAISSE'}. Lire le mouvement à travers la mauvaise option inverse toutes les zones de la crosse de hockey — verrouillez « call = droit d'acheter, put = droit de vendre » avant de poser les chiffres.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 3. Le P&L du vendeur : l'asymétrie de l'assureur (N1)
// ---------------------------------------------------------------------------
export const genPnlVendeur: ExerciseGenerator = {
  id: 'm8-ex-03',
  moduleId: M8,
  titre: 'Le P&L du vendeur : l\'asymétrie de l\'assureur',
  titreEn: 'Option seller\'s P&L: the insurer\'s asymmetry',
  difficulte: 1,
  // Tirages (ordre strict) : 1. type = pick(['call', 'put']) · 2. strike = randInt(60, 180)
  // · 3. prime = randFloat(2, 10, 1) · 4. scenario = pick(['tranquille', 'sinistre'])
  // · 5. ecart = randInt(5, 30).
  // tranquille ⇒ S_T du bon côté du strike (payoff nul : le vendeur garde la prime entière) ;
  // sinistre ⇒ payoff = prime + écart (la perte du vendeur DÉPASSE la prime encaissée de « écart »).
  // Réponse via pnlOption(payoff, prime, −1) — sens = −1, le miroir exact de l'acheteur.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const type = pick(rng, ['call', 'put'] as const);
    const strike = randInt(rng, 60, 180);
    const prime = randFloat(rng, 2, 10, 1);
    const scenario = pick(rng, ['tranquille', 'sinistre'] as const);
    const ecart = randInt(rng, 5, 30);

    const estCall = type === 'call';
    const sinistre = scenario === 'sinistre';
    const distance = sinistre ? r2(prime + ecart) : ecart;
    const sT = r2(estCall ? (sinistre ? strike + distance : strike - distance) : sinistre ? strike - distance : strike + distance);
    const payoff = estCall ? payoffCall(sT, strike) : payoffPut(sT, strike);
    const reponse = r2(pnlOption(payoff, prime, -1));

    const en = langue === 'en';
    const { f, eur, sgn } = formatters(langue);
    const nomOption = estCall ? 'call' : 'put';
    return {
      enonce: en
        ? `On the options desk, you SELL a ${nomOption} struck at ${eur(strike, 0)} and collect a premium of ${eur(prime, 2)} per share. At expiry, the share trades at ${eur(sT, 2)}.\n\n**What is your P&L at expiry, in euros per share (with its sign)?**`
        : `Sur le desk options, vous VENDEZ un ${nomOption} de strike ${eur(strike, 0)} et encaissez une prime de ${eur(prime, 2)} par action. À l'échéance, l'action cote ${eur(sT, 2)}.\n\n**Quel est votre P&L à l'échéance, en euros par action (avec son signe) ?**`,
      reponse,
      tolerance: 0.01,
      toleranceMode: 'absolu',
      unite: '€',
      etapes: [
        {
          titre: en ? 'The payoff you owe' : 'Le payoff que vous devez',
          contenu: en
            ? `The seller chooses nothing at expiry: the buyer exercises or walks away, and you take the other side. $\\text{payoff} = \\max(${estCall ? 'S_T - K' : 'K - S_T'},\\ 0) = \\max(${estCall ? `${f(sT, 2)} - ${f(strike, 0)}` : `${f(strike, 0)} - ${f(sT, 2)}`},\\ 0)$ = **${eur(payoff, 2)}**. ${sinistre ? `The option finished in the money: the buyer exercises, and those ${eur(payoff, 2)} per share are your DEBT.` : 'The option dies unexercised: you owe nothing — the promise expired without being called.'}`
            : `Le vendeur ne choisit rien à l'échéance : l'acheteur exerce ou abandonne, et vous prenez l'autre côté. $\\text{payoff} = \\max(${estCall ? 'S_T - K' : 'K - S_T'},\\ 0) = \\max(${estCall ? `${f(sT, 2)} - ${f(strike, 0)}` : `${f(strike, 0)} - ${f(sT, 2)}`},\\ 0)$ = **${eur(payoff, 2)}**. ${sinistre ? `L'option a fini dans la monnaie : l'acheteur exerce, et ces ${eur(payoff, 2)} par action sont votre DETTE.` : 'L\'option meurt sans être exercée : vous ne devez rien — la promesse s\'est éteinte sans être appelée.'}`,
        },
        {
          titre: en ? 'Seller\'s P&L: direction −1' : 'Le P&L du vendeur : sens −1',
          contenu: en
            ? `Seller's P&L $= \\text{direction} × (\\text{payoff} - \\text{premium}) = -1 × (${f(payoff, 2)} - ${f(prime, 2)})$ = **${sgn(reponse, 2)} €** per share. The premium collected on day one is your only revenue; the payoff is your only debt — the exact mirror of the buyer's P&L, sign for sign (a zero-sum game).`
            : `P&L du vendeur $= \\text{sens} × (\\text{payoff} - \\text{prime}) = -1 × (${f(payoff, 2)} - ${f(prime, 2)})$ = **${sgn(reponse, 2)} €** par action. La prime encaissée au premier jour est votre seul revenu ; le payoff, votre seule dette — le miroir exact du P&L de l'acheteur, signe pour signe (jeu à somme nulle).`,
        },
        {
          titre: en ? 'The insurer\'s asymmetry' : 'L\'asymétrie de l\'assureur',
          contenu: en
            ? sinistre
              ? `The ${eur(prime, 2)} premium is swallowed whole and ${eur(Math.abs(reponse), 2)} of loss remain: the seller loses BEYOND what he collected — with no floor on the call side (the share can rise without limit) and down to the strike on the put side. Selling an option is selling insurance: premiums come in often, the claim comes rarely — but when it comes, it dwarfs them.`
              : `+${f(prime, 2)} € — and that is the seller's MAXIMUM gain, hit in every scenario where the option dies: the share did not even need to move in your favour, mere immobility was enough. But the ceiling is absolute: however far the market drifts your way, you will never make one cent more than the premium.`
            : sinistre
              ? `La prime de ${eur(prime, 2)} est engloutie en entier et il reste ${eur(Math.abs(reponse), 2)} de perte : le vendeur perd AU-DELÀ de ce qu'il a encaissé — sans plancher côté call (l'action peut monter sans limite) et jusqu'au strike côté put. Vendre une option, c'est vendre de l'assurance : les primes rentrent souvent, le sinistre arrive rarement — mais quand il arrive, il les écrase.`
              : `+${f(prime, 2)} € — et c'est le gain MAXIMUM du vendeur, atteint dans tous les scénarios où l'option meurt : l'action n'avait même pas besoin de bouger en votre faveur, l'immobilité suffisait. Mais le plafond est absolu : aussi loin que le marché dérive dans votre sens, vous ne gagnerez jamais un centime de plus que la prime.`,
        },
      ],
      pieges: [
        en
          ? `Flipping the direction: announcing ${sgn(-reponse, 2)} € — the buyer's P&L. The seller's P&L is $-1 × (\\text{payoff} - \\text{premium})$: he RECEIVES the premium and OWES the payoff. Lock the sign before the arithmetic: the two sides of an option always sum to zero.`
          : `Inverser le sens : annoncer ${sgn(-reponse, 2)} € — le P&L de l'acheteur. Celui du vendeur vaut $-1 × (\\text{payoff} - \\text{prime})$ : il ENCAISSE la prime et DOIT le payoff. Verrouillez le signe avant l'arithmétique : les deux camps d'une option somment toujours à zéro.`,
        en
          ? sinistre
            ? `"I cannot lose more than the premium": that is the BUYER's privilege, not yours. The seller earns at most the premium (${eur(prime, 2)}) and can lose far beyond it — here ${eur(Math.abs(reponse), 2)} net, and nothing in the contract stops the bleeding higher. The asymmetry works against the seller in the tails.`
            : `Hoping for better than the premium because the share finished ${f(ecart, 0)} away from the strike: no. Whether it dies at the strike or ten times further, a dead option pays its seller the same ${eur(prime, 2)} — a sold option has no upside beyond the premium, ever.`
          : sinistre
            ? `« Je ne peux pas perdre plus que la prime » : c'est le privilège de l'ACHETEUR, pas le vôtre. Le vendeur gagne au plus la prime (${eur(prime, 2)}) et peut perdre bien au-delà — ici ${eur(Math.abs(reponse), 2)} nets, et rien dans le contrat n'arrête l'hémorragie plus haut. L'asymétrie joue contre le vendeur dans les queues de distribution.`
            : `Espérer mieux que la prime parce que l'action a fini à ${f(ecart, 0)} du strike : non. Qu'elle meure au strike ou dix fois plus loin, une option morte paie à son vendeur la même prime de ${eur(prime, 2)} — une option vendue n'a aucun upside au-delà de la prime, jamais.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 4. Les points morts : où commence le profit (N1)
// ---------------------------------------------------------------------------
export const genPointsMorts: ExerciseGenerator = {
  id: 'm8-ex-04',
  moduleId: M8,
  titre: 'Les points morts : où commence le profit',
  titreEn: 'Breakevens: where profit begins',
  difficulte: 1,
  // Tirages (ordre strict) : 1. instrument = pick(['call', 'put', 'straddle']) · 2. strike = randInt(40, 180)
  // · 3. primeCall = randFloat(2, 9, 2) · 4. primePut = randFloat(2, 9, 2).
  // call ⇒ pointMortCall(strike, primeCall) ; put ⇒ pointMortPut(strike, primePut) ;
  // straddle ⇒ coût = primeCall + primePut, réponse = point mort HAUT via pointsMortsStraddle
  // (le bas, strike − coût, est donné dans le corrigé).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const instrument = pick(rng, ['call', 'put', 'straddle'] as const);
    const strike = randInt(rng, 40, 180);
    const primeCall = randFloat(rng, 2, 9, 2);
    const primePut = randFloat(rng, 2, 9, 2);

    const estCall = instrument === 'call';
    const estPut = instrument === 'put';
    const cout = r2(primeCall + primePut);
    const bornes = pointsMortsStraddle(strike, cout);
    const reponse = estCall ? r2(pointMortCall(strike, primeCall)) : estPut ? r2(pointMortPut(strike, primePut)) : r2(bornes.haut);
    const pctMove = r2((cout / strike) * 100);

    const en = langue === 'en';
    const { f, eur, pct } = formatters(langue);
    return {
      enonce: en
        ? estCall
          ? `You buy a call struck at ${eur(strike, 0)}, paying a premium of ${eur(primeCall, 2)} per share.\n\n**Above what share price at expiry does the position become exactly profitable (the breakeven), in euros?**`
          : estPut
            ? `You buy a put struck at ${eur(strike, 0)}, paying a premium of ${eur(primePut, 2)} per share.\n\n**Below what share price at expiry does the position become exactly profitable (the breakeven), in euros?**`
            : `Ahead of an earnings release, you buy a straddle struck at ${eur(strike, 0)}: a call paid ${eur(primeCall, 2)} and a put paid ${eur(primePut, 2)} per share.\n\n**Above what share price at expiry does the position become profitable (the UPPER breakeven), in euros?**`
        : estCall
          ? `Vous achetez un call de strike ${eur(strike, 0)} en payant une prime de ${eur(primeCall, 2)} par action.\n\n**Au-dessus de quel cours de l'action à l'échéance la position devient-elle exactement gagnante (le point mort), en euros ?**`
          : estPut
            ? `Vous achetez un put de strike ${eur(strike, 0)} en payant une prime de ${eur(primePut, 2)} par action.\n\n**En dessous de quel cours de l'action à l'échéance la position devient-elle exactement gagnante (le point mort), en euros ?**`
            : `Avant une publication de résultats, vous achetez un straddle de strike ${eur(strike, 0)} : un call payé ${eur(primeCall, 2)} et un put payé ${eur(primePut, 2)} par action.\n\n**Au-dessus de quel cours à l'échéance la position devient-elle gagnante (le point mort HAUT), en euros ?**`,
      reponse,
      tolerance: 0.01,
      toleranceMode: 'absolu',
      unite: '€',
      etapes: [
        {
          titre: en ? 'The premium must be paid back first' : 'La prime à rembourser d\'abord',
          contenu: en
            ? estCall || estPut
              ? `Crossing the strike is NOT enough: at the strike, the payoff is zero and the premium of ${eur(estCall ? primeCall : primePut, 2)} is entirely lost. The share must travel ${estCall ? 'beyond' : 'below'} the strike far enough for the payoff to refund the premium — the breakeven is exactly that point.`
              : `Two premiums, one stake: the straddle costs ${f(primeCall, 2)} + ${f(primePut, 2)} = **${eur(cout, 2)}** per share. Whichever way the market goes, ONE of the two options dies worthless: the winning leg must pay back the FULL cost, both premiums included.`
            : estCall || estPut
              ? `Franchir le strike ne suffit PAS : au strike, le payoff vaut zéro et la prime de ${eur(estCall ? primeCall : primePut, 2)} est entièrement perdue. L'action doit aller ${estCall ? 'au-delà' : 'en dessous'} du strike assez loin pour que le payoff rembourse la prime — le point mort est exactement ce point.`
              : `Deux primes, une seule mise : le straddle coûte ${f(primeCall, 2)} + ${f(primePut, 2)} = **${eur(cout, 2)}** par action. Quel que soit le sens du marché, UNE des deux options meurt sans valeur : la jambe gagnante doit rembourser le coût ENTIER, les deux primes comprises.`,
        },
        {
          titre: en ? 'The formula' : 'La formule',
          contenu: en
            ? estCall
              ? `$\\text{breakeven} = K + \\text{premium} = ${f(strike, 0)} + ${f(primeCall, 2)}$ = **${eur(reponse, 2)}**. Above it, every extra euro of the share is net profit; below it (but above the strike), you exercise yet still lose part of the premium.`
              : estPut
                ? `$\\text{breakeven} = K - \\text{premium} = ${f(strike, 0)} - ${f(primePut, 2)}$ = **${eur(reponse, 2)}**. The put gains DOWNWARDS: the breakeven sits below the strike, and every extra euro of fall beyond it is net profit.`
                : `$\\text{breakevens} = K \\pm \\text{total cost} = ${f(strike, 0)} \\pm ${f(cout, 2)}$: lower breakeven ${eur(r2(bornes.bas), 2)}, upper breakeven **${eur(reponse, 2)}**. Two frontiers, symmetric around the strike — the whole corridor in between is the losing zone.`
            : estCall
              ? `$\\text{point mort} = K + \\text{prime} = ${f(strike, 0)} + ${f(primeCall, 2)}$ = **${eur(reponse, 2)}**. Au-dessus, chaque euro supplémentaire de l'action est du profit net ; en dessous (mais au-dessus du strike), vous exercez tout en perdant encore une partie de la prime.`
              : estPut
                ? `$\\text{point mort} = K - \\text{prime} = ${f(strike, 0)} - ${f(primePut, 2)}$ = **${eur(reponse, 2)}**. Le put gagne vers le BAS : le point mort vit sous le strike, et chaque euro de baisse au-delà est du profit net.`
                : `$\\text{points morts} = K \\pm \\text{coût total} = ${f(strike, 0)} \\pm ${f(cout, 2)}$ : point mort bas ${eur(r2(bornes.bas), 2)}, point mort haut **${eur(reponse, 2)}**. Deux frontières, symétriques autour du strike — tout le couloir entre les deux est la zone perdante.`,
        },
        {
          titre: en ? (estCall || estPut ? 'Three zones, not two' : 'A bet on amplitude, not direction') : estCall || estPut ? 'Trois zones, pas deux' : 'Un pari sur l\'amplitude, pas la direction',
          contenu: en
            ? estCall || estPut
              ? `Read the hockey stick in three zones: ${estCall ? `below ${eur(strike, 0)}` : `above ${eur(strike, 0)}`}, total loss of the premium; between the strike and ${eur(reponse, 2)}, exercise reduces the loss without erasing it; ${estCall ? 'beyond' : 'below'} ${eur(reponse, 2)}, net profit at last. The exercise threshold is the STRIKE; the profit threshold is the BREAKEVEN — two different doors.`
              : `The straddle holder does not care about the direction — only the DISTANCE: the share must move by at least ${eur(cout, 2)}, i.e. about ${pct(pctMove, 1)} of the strike, up OR down. If the market yawns and stays inside [${f(r2(bornes.bas), 2)} ; ${f(reponse, 2)}], both premiums melt: buying a straddle is buying movement itself.`
            : estCall || estPut
              ? `Lisez la crosse de hockey en trois zones : ${estCall ? `sous ${eur(strike, 0)}` : `au-dessus de ${eur(strike, 0)}`}, perte totale de la prime ; entre le strike et ${eur(reponse, 2)}, l'exercice réduit la perte sans l'effacer ; ${estCall ? 'au-delà de' : 'sous'} ${eur(reponse, 2)}, profit net enfin. Le seuil d'exercice est le STRIKE ; le seuil de profit est le POINT MORT — deux portes différentes.`
              : `L'acheteur de straddle se moque de la direction — seule compte la DISTANCE : l'action doit bouger d'au moins ${eur(cout, 2)}, soit environ ${pct(pctMove, 1)} du strike, à la hausse OU à la baisse. Si le marché bâille et reste dans [${f(r2(bornes.bas), 2)} ; ${f(reponse, 2)}], les deux primes fondent : acheter un straddle, c'est acheter du mouvement.`,
        },
      ],
      pieges: [
        en
          ? estCall || estPut
            ? `Confusing strike and breakeven: "${estCall ? 'above' : 'below'} ${eur(strike, 0)} I make money" forgets the ${eur(estCall ? primeCall : primePut, 2)} paid upfront. At the strike exactly, the loss is still the FULL premium — the profit only starts ${eur(estCall ? primeCall : primePut, 2)} further.`
            : `Counting only one premium: ${f(strike, 0)} + ${f(primeCall, 2)} = ${f(r2(strike + primeCall), 2)} instead of ${f(reponse, 2)}. The dead leg is not free: its premium was paid too, and the winning leg must refund BOTH — the straddle's breakevens always use the total cost.`
          : estCall || estPut
            ? `Confondre strike et point mort : « ${estCall ? 'au-dessus' : 'en dessous'} de ${eur(strike, 0)}, je gagne » oublie les ${eur(estCall ? primeCall : primePut, 2)} payés d'avance. Au strike exactement, la perte est encore la prime ENTIÈRE — le profit ne commence que ${eur(estCall ? primeCall : primePut, 2)} plus loin.`
            : `Ne compter qu'une prime : ${f(strike, 0)} + ${f(primeCall, 2)} = ${f(r2(strike + primeCall), 2)} au lieu de ${f(reponse, 2)}. La jambe morte n'est pas gratuite : sa prime a été payée aussi, et la jambe gagnante doit rembourser les DEUX — les points morts d'un straddle se calculent toujours sur le coût total.`,
        en
          ? estPut
            ? `Writing K + premium out of habit: ${f(strike, 0)} + ${f(primePut, 2)} = ${f(r2(strike + primePut), 2)} — the call's breakeven, on the wrong side. The put profits from FALLS: its breakeven is K MINUS the premium, below the strike.`
            : estCall
              ? `"I only exercise beyond the breakeven": no — you exercise from the STRIKE onwards, because any positive payoff shrinks the loss. Between ${eur(strike, 0)} and ${eur(reponse, 2)}, exercising is losing LESS; refusing to exercise is losing the whole premium.`
              : `Forgetting the lower breakeven: the straddle also wins on a crash below ${eur(r2(bornes.bas), 2)}. Announcing only one frontier describes a call, not a straddle — the position has TWO profit zones, one on each side.`
          : estPut
            ? `Écrire K + prime par habitude : ${f(strike, 0)} + ${f(primePut, 2)} = ${f(r2(strike + primePut), 2)} — le point mort du call, du mauvais côté. Le put profite des BAISSES : son point mort est K MOINS la prime, sous le strike.`
            : estCall
              ? `« Je n'exerce qu'au-delà du point mort » : non — on exerce dès le STRIKE, car tout payoff positif réduit la perte. Entre ${eur(strike, 0)} et ${eur(reponse, 2)}, exercer, c'est perdre MOINS ; refuser d'exercer, c'est perdre la prime entière.`
              : `Oublier le point mort bas : le straddle gagne aussi sur un krach sous ${eur(r2(bornes.bas), 2)}. N'annoncer qu'une frontière décrit un call, pas un straddle — la position a DEUX zones de profit, une de chaque côté.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 5. La parité call-put : retrouver le put (N2)
// ---------------------------------------------------------------------------
export const genPariteRetrouverPut: ExerciseGenerator = {
  id: 'm8-ex-05',
  moduleId: M8,
  titre: 'La parité call-put : retrouver le put',
  titreEn: 'Put-call parity: recovering the put',
  difficulte: 2,
  // Tirages (ordre strict) : 1. spot = randInt(40, 150) · 2. ecartK = randInt(−8, 8)
  // · 3. r = randFloat(1, 5, 1) · 4. T = pick([0.25, 0.5, 1]) · 5. extra = randFloat(1.5, 8, 2).
  // strike = spot + ecartK ; call = max(0, S − K·e^{−rT}) + extra (garantit un put strictement
  // positif dans tous les tirages). Réponse via putDepuisParite — actualisation CONTINUE du strike.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const spot = randInt(rng, 40, 150);
    const ecartK = randInt(rng, -8, 8);
    const r = randFloat(rng, 1, 5, 1);
    const T = pick(rng, [0.25, 0.5, 1] as const);
    const extra = randFloat(rng, 1.5, 8, 2);

    const strike = spot + ecartK;
    const df = dfContinu(r, T);
    const call = r2(Math.max(0, spot - strike * df) + extra);
    const reponse = r2(putDepuisParite(call, spot, strike, r, T));
    const kAct = r2(strike * df);
    const fauxSansActu = r2(call - spot + strike);

    const en = langue === 'en';
    const { f, eur, pct } = formatters(langue);
    const horizon = libelleMaturite(T, en);
    return {
      enonce: en
        ? `On the same screen, for the same expiry of ${horizon}: the share trades at ${eur(spot, 2)}, the ${horizon} call struck at ${eur(strike, 0)} quotes ${eur(call, 2)}, and the continuously compounded risk-free rate is ${pct(r, 1)}. The put with the SAME strike and SAME expiry shows no quote.\n\n**Using put-call parity, what should this put be worth, in euros per share?**`
        : `Sur le même écran, pour la même échéance de ${horizon} : l'action cote ${eur(spot, 2)}, le call de strike ${eur(strike, 0)} cote ${eur(call, 2)}, et le taux sans risque en composition continue vaut ${pct(r, 1)}. Le put de MÊME strike et MÊME échéance n'affiche aucune cotation.\n\n**Par la parité call-put, combien ce put doit-il valoir, en euros par action ?**`,
      reponse,
      tolerance: 0.02,
      toleranceMode: 'absolu',
      unite: '€',
      etapes: [
        {
          titre: en ? 'A relation without any model' : 'Une relation sans aucun modèle',
          contenu: en
            ? `Two portfolios: (call + cash of $K e^{-rT}$) and (put + share). At expiry, BOTH are worth $\\max(S_T, K)$ in every state of the world — above K the call wins and the put dies, below K the put wins and the call dies. Same payoff everywhere, therefore same price today: $C - P = S - K\\,e^{-rT}$. No volatility, no distribution, no Black-Scholes — pure no-arbitrage.`
            : `Deux portefeuilles : (call + cash de $K e^{-rT}$) et (put + action). À l'échéance, les DEUX valent $\\max(S_T, K)$ dans tous les états du monde — au-dessus de K le call gagne et le put meurt, en dessous le put gagne et le call meurt. Même payoff partout, donc même prix aujourd'hui : $C - P = S - K\\,e^{-rT}$. Ni volatilité, ni distribution, ni Black-Scholes — pure absence d'arbitrage.`,
        },
        {
          titre: en ? 'Discount the strike — continuously' : 'Actualiser le strike — en continu',
          contenu: en
            ? `The K euros of the strike are only paid AT expiry: today they are worth $K\\,e^{-rT} = ${f(strike, 0)} × e^{-${f(r, 1)}\\,\\% × ${f(T)}} = ${f(strike, 0)} × ${f(r6(df), 4)}$ = **${eur(kAct, 2)}**. The module's convention is continuous compounding ($e^{-rT}$), the natural companion of Black-Scholes — unlike the linear discounting of modules 4 and 7.`
            : `Les K euros du strike ne se paient qu'À l'échéance : aujourd'hui ils valent $K\\,e^{-rT} = ${f(strike, 0)} × e^{-${f(r, 1)}\\,\\% × ${f(T)}} = ${f(strike, 0)} × ${f(r6(df), 4)}$ = **${eur(kAct, 2)}**. La convention du module est la composition continue ($e^{-rT}$), compagne naturelle de Black-Scholes — à la différence de l'actualisation linéaire des modules 4 et 7.`,
        },
        {
          titre: en ? 'Isolate the put' : 'Isoler le put',
          contenu: en
            ? `$P = C - S + K\\,e^{-rT} = ${f(call, 2)} - ${f(spot, 2)} + ${f(kAct, 2)}$ = **${eur(reponse, 2)}**. If the put quoted anything else, one of the two twin portfolios would be cheaper than the other for the same payoff — and the arbitrage of the next exercise would close the gap within seconds. Parity is the tightest handcuff of the chapter: it survives every model, every smile, every crisis.`
            : `$P = C - S + K\\,e^{-rT} = ${f(call, 2)} - ${f(spot, 2)} + ${f(kAct, 2)}$ = **${eur(reponse, 2)}**. Si le put cotait autre chose, l'un des deux portefeuilles jumeaux serait moins cher que l'autre pour le même payoff — et l'arbitrage de l'exercice suivant refermerait l'écart en quelques secondes. La parité est la menotte la plus serrée du chapitre : elle survit à tous les modèles, tous les smiles, toutes les crises.`,
        },
      ],
      pieges: [
        en
          ? `Forgetting to discount the strike: $C - S + K = ${f(call, 2)} - ${f(spot, 2)} + ${f(strike, 0)} = ${f(fauxSansActu, 2)}$ instead of ${f(reponse, 2)}. The strike is a FUTURE flow — it enters parity at its present value $K e^{-rT}$, exactly as it does inside Black-Scholes. On long maturities the gap becomes enormous.`
          : `Oublier d'actualiser le strike : $C - S + K = ${f(call, 2)} - ${f(spot, 2)} + ${f(strike, 0)} = ${f(fauxSansActu, 2)}$ au lieu de ${f(reponse, 2)}. Le strike est un flux FUTUR — il entre dans la parité à sa valeur actuelle $K e^{-rT}$, exactement comme dans Black-Scholes. Sur les maturités longues, l'écart devient énorme.`,
        en
          ? `Believing parity comes out of a pricing model: it needs NO assumption about the share's future — only that two identical payoffs cannot trade at two prices. If a Black-Scholes price violated parity, it is Black-Scholes you should throw away, not parity.`
          : `Croire que la parité sort d'un modèle de valorisation : elle n'exige AUCUNE hypothèse sur le futur de l'action — seulement que deux payoffs identiques ne peuvent pas coter deux prix. Si un prix Black-Scholes violait la parité, c'est Black-Scholes qu'il faudrait jeter, pas la parité.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 6. La parité violée : détecter l'arbitrage (N3)
// ---------------------------------------------------------------------------
export const genPariteArbitrage: ExerciseGenerator = {
  id: 'm8-ex-06',
  moduleId: M8,
  titre: 'La parité violée : détecter l\'arbitrage',
  titreEn: 'Parity violated: spotting the arbitrage',
  difficulte: 3,
  // Tirages (ordre strict) : 1. spot = randInt(50, 140) · 2. ecartK = randInt(−6, 6)
  // · 3. r = randFloat(1, 5, 1) · 4. T = pick([0.25, 0.5, 1]) · 5. extra = randFloat(2, 7, 2)
  // · 6. sensEcart = pick([1, −1]) · 7. ecartArb = randFloat(0.4, 1.5, 2).
  // call = max(0, S − K·e^{−rT}) + extra ; putTh = putDepuisParite (non arrondi) ;
  // putCote = r2(putTh + sensEcart × ecartArb) — surcoté (+1) ou sous-coté (−1).
  // Réponse = |putCote − putTh|, le gain sans risque par action que verrouille le montage.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const spot = randInt(rng, 50, 140);
    const ecartK = randInt(rng, -6, 6);
    const r = randFloat(rng, 1, 5, 1);
    const T = pick(rng, [0.25, 0.5, 1] as const);
    const extra = randFloat(rng, 2, 7, 2);
    const sensEcart = pick(rng, [1, -1] as const);
    const ecartArb = randFloat(rng, 0.4, 1.5, 2);

    const strike = spot + ecartK;
    const df = dfContinu(r, T);
    const call = r2(Math.max(0, spot - strike * df) + extra);
    const putTh = putDepuisParite(call, spot, strike, r, T);
    const putCote = r2(putTh + sensEcart * ecartArb);
    const reponse = r2(Math.abs(putCote - putTh));
    const kAct = r2(strike * df);
    const putThAff = r2(putTh);
    const surcote = sensEcart === 1;
    const fauxTh = r2(call - spot + strike); // « théorique » sans actualisation

    const en = langue === 'en';
    const { f, eur, pct, sgn } = formatters(langue);
    const horizon = libelleMaturite(T, en);
    return {
      enonce: en
        ? `Same expiry of ${horizon}, same strike ${eur(strike, 0)}: the share trades at ${eur(spot, 2)}, the call quotes ${eur(call, 2)}, the put quotes ${eur(putCote, 2)}, and the continuously compounded risk-free rate is ${pct(r, 1)}. Something is off.\n\n**What riskless profit per share does the appropriate parity arbitrage lock in, in euros?**`
        : `Même échéance de ${horizon}, même strike ${eur(strike, 0)} : l'action cote ${eur(spot, 2)}, le call cote ${eur(call, 2)}, le put cote ${eur(putCote, 2)}, et le taux sans risque en composition continue vaut ${pct(r, 1)}. Quelque chose cloche.\n\n**Quel gain sans risque par action l'arbitrage de parité approprié verrouille-t-il, en euros ?**`,
      reponse,
      tolerance: 0.02,
      toleranceMode: 'absolu',
      unite: '€',
      etapes: [
        {
          titre: en ? 'The parity price first' : 'D\'abord le prix de parité',
          contenu: en
            ? `Parity dictates the put's fair price with no model: $P_{th} = C - S + K\\,e^{-rT} = ${f(call, 2)} - ${f(spot, 2)} + ${f(kAct, 2)}$ = **${eur(putThAff, 2)}** (with $K e^{-rT} = ${f(strike, 0)} × ${f(r6(df), 4)} = ${f(kAct, 2)}$). Any other quote hands out free money.`
            : `La parité dicte le juste prix du put sans aucun modèle : $P_{th} = C - S + K\\,e^{-rT} = ${f(call, 2)} - ${f(spot, 2)} + ${f(kAct, 2)}$ = **${eur(putThAff, 2)}** (avec $K e^{-rT} = ${f(strike, 0)} × ${f(r6(df), 4)} = ${f(kAct, 2)}$). Toute autre cotation distribue de l'argent gratuit.`,
        },
        {
          titre: en ? (surcote ? 'The put is rich: sell it, build it' : 'The put is cheap: buy it, sell its twin') : surcote ? 'Le put est trop cher : le vendre, le fabriquer' : 'Le put est trop bon marché : l\'acheter, vendre son jumeau',
          contenu: en
            ? surcote
              ? `The market quotes ${eur(putCote, 2)} against a fair ${eur(putThAff, 2)}: the put is OVERPRICED by ${eur(reponse, 2)}. So sell the expensive one and manufacture the cheap one: SELL the put at ${f(putCote, 2)}, and replicate a long put synthetically — buy the call, short the share, lend $K e^{-rT}$. The two puts cancel at expiry in every state of the world; the price gap stays in your pocket.`
              : `The market quotes ${eur(putCote, 2)} against a fair ${eur(putThAff, 2)}: the put is UNDERPRICED by ${eur(reponse, 2)}. So buy the cheap one and sell its synthetic twin: BUY the put at ${f(putCote, 2)}, sell the call, buy the share, borrow $K e^{-rT}$. Whatever $S_T$, the positions net to zero at expiry; the gap was cashed at inception.`
            : surcote
              ? `Le marché cote ${eur(putCote, 2)} contre un juste prix de ${eur(putThAff, 2)} : le put est SURCOTÉ de ${eur(reponse, 2)}. Donc vendez le cher et fabriquez le bon marché : VENDEZ le put à ${f(putCote, 2)}, et répliquez un put long en synthétique — achetez le call, vendez l'action à découvert, placez $K e^{-rT}$. Les deux puts s'annulent à l'échéance dans tous les états du monde ; l'écart de prix reste dans votre poche.`
              : `Le marché cote ${eur(putCote, 2)} contre un juste prix de ${eur(putThAff, 2)} : le put est SOUS-COTÉ de ${eur(reponse, 2)}. Donc achetez le bon marché et vendez son jumeau synthétique : ACHETEZ le put à ${f(putCote, 2)}, vendez le call, achetez l'action, empruntez $K e^{-rT}$. Quel que soit $S_T$, les positions se compensent à l'échéance ; l'écart est encaissé dès l'initiation.`,
        },
        {
          titre: en ? 'A profit with no scenario' : 'Un gain sans scénario',
          contenu: en
            ? `Locked-in gain: $|${f(putCote, 2)} - ${f(putThAff, 2)}|$ = **${eur(reponse, 2)} per share**, whatever the share does — rise, crash or sleep. That is the definition of arbitrage: no forecast, no risk, only a violated identity. In real markets, algorithms devour such gaps within milliseconds; their appetite is precisely WHY parity holds on every screen you will ever read.`
            : `Gain verrouillé : $|${f(putCote, 2)} - ${f(putThAff, 2)}|$ = **${eur(reponse, 2)} par action**, quoi que fasse l'action — hausse, krach ou sommeil. C'est la définition de l'arbitrage : aucune prévision, aucun risque, seulement une identité violée. Sur les marchés réels, les algorithmes dévorent ces écarts en quelques millisecondes ; leur appétit est précisément la raison POUR LAQUELLE la parité tient sur tous les écrans que vous lirez.`,
        },
      ],
      pieges: [
        en
          ? `Comparing without discounting the strike: the "fair" put becomes $C - S + K = ${f(fauxTh, 2)}$, and the measured gap ${sgn(r2(putCote - fauxTh), 2)} instead of ${surcote ? '+' : '−'}${f(reponse, 2)} — wrong size, sometimes even wrong direction, hence an "arbitrage" that loses money with certainty. The present value of K is not a refinement; it IS the relation.`
          : `Comparer sans actualiser le strike : le put « théorique » devient $C - S + K = ${f(fauxTh, 2)}$, et l'écart mesuré ${sgn(r2(putCote - fauxTh), 2)} au lieu de ${surcote ? '+' : '−'}${f(reponse, 2)} — mauvaise taille, parfois même mauvais sens, donc un « arbitrage » qui perd de l'argent à coup sûr. La valeur actuelle de K n'est pas un raffinement ; elle EST la relation.`,
        en
          ? `Asking "but what if the share falls?": the wrong question, and the sign that the setup is not understood. The arbitrage portfolio has the SAME payoff on both legs at expiry — the market's direction cancels out line by line. If your montage needs a scenario to win, it is a bet, not an arbitrage.`
          : `Demander « mais si l'action baisse ? » : la mauvaise question, et le signe que le montage n'est pas compris. Le portefeuille d'arbitrage a le MÊME payoff sur ses deux jambes à l'échéance — la direction du marché s'annule ligne à ligne. Si votre montage a besoin d'un scénario pour gagner, c'est un pari, pas un arbitrage.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 7. La probabilité risque-neutre (N2)
// ---------------------------------------------------------------------------
export const genProbaRisqueNeutre: ExerciseGenerator = {
  id: 'm8-ex-07',
  moduleId: M8,
  titre: 'La probabilité risque-neutre',
  titreEn: 'The risk-neutral probability',
  difficulte: 2,
  // Tirages (ordre strict) : 1. uPct = randInt(10, 30) (u = 1 + uPct/100) · 2. dPct = randInt(5, 25)
  // (d = 1 − dPct/100) · 3. r = randFloat(1, 6, 1) · 4. T = pick([0.5, 1]).
  // r·T ≤ 6 % < uPct ⇒ q ∈ (0, 1) garanti. Capitalisation LINÉAIRE sur la période
  // (convention de l'arbre, cohérente m4/m7). Réponse = 100 × probaRisqueNeutre(u, d, r, T), en %.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const uPct = randInt(rng, 10, 30);
    const dPct = randInt(rng, 5, 25);
    const r = randFloat(rng, 1, 6, 1);
    const T = pick(rng, [0.5, 1] as const);

    const u = r2(1 + uPct / 100);
    const d = r2(1 - dPct / 100);
    const q = probaRisqueNeutre(u, d, r, T);
    const reponse = r2(100 * q);
    const capi = r4(1 + (r / 100) * T);
    const num = r4(capi - d);
    const den = r4(u - d);
    const fauxSansCapi = r2((100 * (1 - d)) / (u - d));

    const en = langue === 'en';
    const { f, pct } = formatters(langue);
    const horizon = libelleMaturite(T, en);
    return {
      enonce: en
        ? `In a one-period binomial tree over ${horizon}, the share can rise by ${pct(uPct, 0)} (×${f(u, 2)}) or fall by ${pct(dPct, 0)} (×${f(d, 2)}). The risk-free rate is ${pct(r, 1)} a year, simple linear compounding over the period.\n\n**What is the risk-neutral probability of the up move, in %?**`
        : `Dans un arbre binomial à une période sur ${horizon}, l'action peut monter de ${pct(uPct, 0)} (×${f(u, 2)}) ou baisser de ${pct(dPct, 0)} (×${f(d, 2)}). Le taux sans risque vaut ${pct(r, 1)} par an, capitalisation linéaire simple sur la période.\n\n**Quelle est la probabilité risque-neutre de hausse, en % ?**`,
      reponse,
      tolerance: 0.1,
      toleranceMode: 'absolu',
      unite: '%',
      etapes: [
        {
          titre: en ? 'The world where every asset earns r' : 'Le monde où tout actif rapporte r',
          contenu: en
            ? `q is defined by one requirement: under q, the share must earn exactly the risk-free rate — $q\\,u + (1 - q)\\,d = 1 + r\\,T$. It is not measured in any poll and forecasts nothing: it is the weight that makes the discounted underlying a fair game, so that the option can be priced as a discounted expectation without knowing anyone's appetite for risk.`
            : `q se définit par une seule exigence : sous q, l'action doit rapporter exactement le taux sans risque — $q\\,u + (1 - q)\\,d = 1 + r\\,T$. Elle ne se mesure dans aucun sondage et ne prévoit rien : c'est le poids qui rend le sous-jacent actualisé « équitable », pour que l'option puisse se pricer comme une espérance actualisée sans connaître l'appétit au risque de quiconque.`,
        },
        {
          titre: en ? 'The formula' : 'La formule',
          contenu: en
            ? `$q = \\dfrac{(1 + r\\,T) - d}{u - d} = \\dfrac{${f(capi, 3)} - ${f(d, 2)}}{${f(u, 2)} - ${f(d, 2)}} = \\dfrac{${f(num, 3)}}{${f(den, 2)}}$ = **${pct(reponse, 2)}**. The linear factor $1 + r\\,T$ is the tree's convention (consistent with modules 4 and 7); passing to $e^{rT}$ at the limit of infinitely many periods is exactly what Black-Scholes does.`
            : `$q = \\dfrac{(1 + r\\,T) - d}{u - d} = \\dfrac{${f(capi, 3)} - ${f(d, 2)}}{${f(u, 2)} - ${f(d, 2)}} = \\dfrac{${f(num, 3)}}{${f(den, 2)}}$ = **${pct(reponse, 2)}**. Le facteur linéaire $1 + r\\,T$ est la convention de l'arbre (cohérente avec les modules 4 et 7) ; passer à $e^{rT}$ à la limite d'une infinité de périodes, c'est exactement ce que fait Black-Scholes.`,
        },
        {
          titre: en ? 'What q is NOT' : 'Ce que q n\'est PAS',
          contenu: en
            ? `${pct(reponse, 2)} is NOT the market's forecast of the up move. Real-world probabilities carry risk aversion — investors demand a premium for bearing the share's risk, so the true expected return exceeds r. q absorbs that premium into the weights: it is a PRICING tool, the unique probability that makes prices consistent with each other. Reading q as a prediction is the module's conceptual trap number one.`
            : `${pct(reponse, 2)} n'est PAS la prévision de hausse du marché. Les probabilités réelles portent l'aversion au risque — les investisseurs exigent une prime pour porter le risque de l'action, donc son rendement espéré réel dépasse r. q absorbe cette prime dans les poids : c'est un outil de VALORISATION, l'unique probabilité qui rend les prix cohérents entre eux. Lire q comme une prédiction est le piège conceptuel numéro un du module.`,
        },
      ],
      pieges: [
        en
          ? `Dropping the interest rate: $\\dfrac{1 - d}{u - d} = ${pct(fauxSansCapi, 2)}$ instead of ${pct(reponse, 2)}. Money grows at r while it waits: the fair-game condition compares the tree to $1 + r\\,T$, not to 1 — forgetting it systematically underprices calls.`
          : `Laisser tomber le taux : $\\dfrac{1 - d}{u - d} = ${pct(fauxSansCapi, 2)}$ au lieu de ${pct(reponse, 2)}. L'argent fructifie à r pendant qu'il attend : la condition d'équité compare l'arbre à $1 + r\\,T$, pas à 1 — l'oublier sous-évalue systématiquement les calls.`,
        en
          ? `Answering 50%, or "it depends on the analysts' view": the tree's geometry (u, d) and the rate fix q entirely — no opinion enters. Two investors who disagree violently about the share's future must still agree on ${pct(reponse, 2)}: that is what makes option prices objective.`
          : `Répondre 50 %, ou « ça dépend de la vue des analystes » : la géométrie de l'arbre (u, d) et le taux fixent q entièrement — aucune opinion n'y entre. Deux investisseurs en désaccord violent sur l'avenir de l'action doivent quand même tomber d'accord sur ${pct(reponse, 2)} : c'est ce qui rend le prix des options objectif.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 8. La valeur binomiale à une période (N2)
// ---------------------------------------------------------------------------
export const genValeurBinomiale: ExerciseGenerator = {
  id: 'm8-ex-08',
  moduleId: M8,
  titre: 'L\'option dans l\'arbre à une période',
  titreEn: 'One-period binomial option value',
  difficulte: 2,
  // Tirages (ordre strict) : 1. type = pick(['call', 'put']) · 2. spotDix = randInt(6, 14)
  // (spot = ×10) · 3. uPct = randInt(15, 30) · 4. dPct = randInt(10, 25) · 5. r = randFloat(1, 6, 1)
  // · 6. T = pick([0.5, 1]).
  // Option À LA MONNAIE (strike = spot) : une seule branche paie. r·T ≤ 6 % < uPct ⇒ q ∈ (0, 1).
  // Réponse via valeurBinomiale (espérance risque-neutre actualisée en LINÉAIRE).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const type = pick(rng, ['call', 'put'] as const);
    const spotDix = randInt(rng, 6, 14);
    const uPct = randInt(rng, 15, 30);
    const dPct = randInt(rng, 10, 25);
    const r = randFloat(rng, 1, 6, 1);
    const T = pick(rng, [0.5, 1] as const);

    const estCall = type === 'call';
    const spot = spotDix * 10;
    const strike = spot;
    const u = r2(1 + uPct / 100);
    const d = r2(1 - dPct / 100);
    const sUp = r2(spot * u);
    const sDown = r2(spot * d);
    const vUp = estCall ? payoffCall(sUp, strike) : payoffPut(sUp, strike);
    const vDown = estCall ? payoffCall(sDown, strike) : payoffPut(sDown, strike);
    const q = probaRisqueNeutre(u, d, r, T);
    const qPct = r2(100 * q);
    const capi = r4(1 + (r / 100) * T);
    const reponse = r2(valeurBinomiale(vUp, vDown, u, d, r, T));
    const esperance = r4(q * vUp + (1 - q) * vDown);
    const fauxSansActu = r2(q * vUp + (1 - q) * vDown);
    const faux5050 = r2((0.5 * vUp + 0.5 * vDown) / capi);

    const en = langue === 'en';
    const { f, eur, pct } = formatters(langue);
    const horizon = libelleMaturite(T, en);
    const nomOption = estCall ? 'call' : 'put';
    return {
      enonce: en
        ? `The share trades at ${eur(spot, 0)}. Over ${horizon}, it can rise by ${pct(uPct, 0)} (to ${eur(sUp, 2)}) or fall by ${pct(dPct, 0)} (to ${eur(sDown, 2)}). The risk-free rate is ${pct(r, 1)} a year, simple linear compounding.\n\n**In the one-period binomial tree, what is the value today of the at-the-money ${nomOption} struck at ${eur(strike, 0)}, in euros per share?**`
        : `L'action cote ${eur(spot, 0)}. Sur ${horizon}, elle peut monter de ${pct(uPct, 0)} (à ${eur(sUp, 2)}) ou baisser de ${pct(dPct, 0)} (à ${eur(sDown, 2)}). Le taux sans risque vaut ${pct(r, 1)} par an, capitalisation linéaire simple.\n\n**Dans l'arbre binomial à une période, combien vaut aujourd'hui le ${nomOption} à la monnaie de strike ${eur(strike, 0)}, en euros par action ?**`,
      reponse,
      tolerance: 0.02,
      toleranceMode: 'absolu',
      unite: '€',
      etapes: [
        {
          titre: en ? 'The two states and their payoffs' : 'Les deux états et leurs payoffs',
          contenu: en
            ? `Up state: $S = ${f(sUp, 2)}$, the ${nomOption} pays $\\max(${estCall ? `${f(sUp, 2)} - ${f(strike, 0)}` : `${f(strike, 0)} - ${f(sUp, 2)}`},\\ 0) = ${f(vUp, 2)}$. Down state: $S = ${f(sDown, 2)}$, it pays $\\max(${estCall ? `${f(sDown, 2)} - ${f(strike, 0)}` : `${f(strike, 0)} - ${f(sDown, 2)}`},\\ 0) = ${f(vDown, 2)}$. At the money, exactly one branch pays — the option is a bet on one of the two states, and the tree prices that bet.`
            : `État haut : $S = ${f(sUp, 2)}$, le ${nomOption} paie $\\max(${estCall ? `${f(sUp, 2)} - ${f(strike, 0)}` : `${f(strike, 0)} - ${f(sUp, 2)}`},\\ 0) = ${f(vUp, 2)}$. État bas : $S = ${f(sDown, 2)}$, il paie $\\max(${estCall ? `${f(sDown, 2)} - ${f(strike, 0)}` : `${f(strike, 0)} - ${f(sDown, 2)}`},\\ 0) = ${f(vDown, 2)}$. À la monnaie, une seule branche paie — l'option est un pari sur l'un des deux états, et l'arbre price ce pari.`,
        },
        {
          titre: en ? 'The risk-neutral weight' : 'Le poids risque-neutre',
          contenu: en
            ? `$q = \\dfrac{(1 + r\\,T) - d}{u - d} = \\dfrac{${f(capi, 3)} - ${f(d, 2)}}{${f(u, 2)} - ${f(d, 2)}}$ = **${pct(qPct, 2)}**. Not a forecast: the weight under which the share, discounted, is a fair game. The real probability of the up move — whatever it is — has already done its work inside today's price of ${eur(spot, 0)}.`
            : `$q = \\dfrac{(1 + r\\,T) - d}{u - d} = \\dfrac{${f(capi, 3)} - ${f(d, 2)}}{${f(u, 2)} - ${f(d, 2)}}$ = **${pct(qPct, 2)}**. Pas une prévision : le poids sous lequel l'action, actualisée, est un jeu équitable. La vraie probabilité de hausse — quelle qu'elle soit — a déjà fait son travail dans le prix d'aujourd'hui, ${eur(spot, 0)}.`,
        },
        {
          titre: en ? 'Discounted expectation — linear here' : 'L\'espérance actualisée — linéaire ici',
          contenu: en
            ? `$V_0 = \\dfrac{q\\,V_{up} + (1 - q)\\,V_{down}}{1 + r\\,T} = \\dfrac{${f(qPct / 100, 4)} × ${f(vUp, 2)} + ${f(r4(1 - q), 4)} × ${f(vDown, 2)}}{${f(capi, 3)}} = \\dfrac{${f(esperance, 4)}}{${f(capi, 3)}}$ = **${eur(reponse, 2)}**. The tree uses LINEAR compounding over the period (module 4's convention); replace the two branches by a continuum and the periods by instants, and this same discounted expectation becomes the Black-Scholes formula.`
            : `$V_0 = \\dfrac{q\\,V_{up} + (1 - q)\\,V_{down}}{1 + r\\,T} = \\dfrac{${f(qPct / 100, 4)} × ${f(vUp, 2)} + ${f(r4(1 - q), 4)} × ${f(vDown, 2)}}{${f(capi, 3)}} = \\dfrac{${f(esperance, 4)}}{${f(capi, 3)}}$ = **${eur(reponse, 2)}**. L'arbre actualise en LINÉAIRE sur la période (convention du module 4) ; remplacez les deux branches par un continuum et les périodes par des instants, et cette même espérance actualisée devient la formule de Black-Scholes.`,
        },
      ],
      pieges: [
        en
          ? `Weighting the branches 50/50 "since there are two of them": $\\dfrac{0.5 × ${f(vUp, 2)} + 0.5 × ${f(vDown, 2)}}{${f(capi, 3)}} = ${f(faux5050, 2)}$ instead of ${f(reponse, 2)}. The weights come from no-arbitrage (q = ${f(qPct / 100, 4)}), not from symmetry — a tree with a violent up branch and a mild down branch is NOT a coin toss.`
          : `Pondérer les branches 50/50 « puisqu'il y en a deux » : $\\dfrac{0,5 × ${f(vUp, 2)} + 0,5 × ${f(vDown, 2)}}{${f(capi, 3)}} = ${f(faux5050, 2)}$ au lieu de ${f(reponse, 2)}. Les poids sortent de l'absence d'arbitrage (q = ${f(qPct / 100, 4)}), pas de la symétrie — un arbre à branche haute violente et branche basse douce n'est PAS un pile ou face.`,
        en
          ? `Forgetting to discount: $q\\,V_{up} + (1-q)\\,V_{down} = ${f(fauxSansActu, 2)}$ is the expected payoff AT EXPIRY. The option is paid for TODAY: divide by $1 + r\\,T$ — and note it is the tree's linear factor, not the $e^{-rT}$ of Black-Scholes, which belongs to the continuous limit.`
          : `Oublier d'actualiser : $q\\,V_{up} + (1-q)\\,V_{down} = ${f(fauxSansActu, 2)}$ est l'espérance du payoff À L'ÉCHÉANCE. L'option se paie AUJOURD'HUI : divisez par $1 + r\\,T$ — et notez que c'est le facteur linéaire de l'arbre, pas le $e^{-rT}$ de Black-Scholes, qui appartient à la limite continue.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 9. d1, d2 et N(d2) : la probabilité de finir dans la monnaie (N2)
// ---------------------------------------------------------------------------
export const genProbaFinirMonnaie: ExerciseGenerator = {
  id: 'm8-ex-09',
  moduleId: M8,
  titre: 'N(d2) : la probabilité de finir dans la monnaie',
  titreEn: 'N(d2): the probability of finishing in the money',
  difficulte: 2,
  // Tirages (ordre strict) : 1. spot = randInt(80, 120) · 2. ecartK = pick([−10, −5, 0, 5, 10])
  // · 3. r = randFloat(1, 5, 1) · 4. vol = randInt(15, 35) · 5. T = pick([0.25, 0.5, 1]).
  // strike = spot + ecartK. Réponse = 100 × N(d2) en % — la probabilité RISQUE-NEUTRE que
  // S_T > K, PAS une prévision et PAS le delta (qui vaut N(d1)).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const spot = randInt(rng, 80, 120);
    const ecartK = pick(rng, [-10, -5, 0, 5, 10] as const);
    const r = randFloat(rng, 1, 5, 1);
    const vol = randInt(rng, 15, 35);
    const T = pick(rng, [0.25, 0.5, 1] as const);

    const strike = spot + ecartK;
    const d1 = d1BlackScholes(spot, strike, r, vol, T);
    const d2 = d2BlackScholes(spot, strike, r, vol, T);
    const reponse = r2(100 * normaleCdf(d2));
    const nd1Pct = r2(100 * normaleCdf(d1));
    const sigmaRacineT = r4((vol / 100) * Math.sqrt(T));

    const en = langue === 'en';
    const { f, pct, eur } = formatters(langue);
    const horizon = libelleMaturite(T, en);
    return {
      enonce: en
        ? `A European call struck at ${eur(strike, 0)} expires in ${horizon}. The share trades at ${eur(spot, 0)}, implied volatility σ = ${pct(vol, 0)}, continuously compounded risk-free rate ${pct(r, 1)}, no dividend.\n\n**In the Black-Scholes world, what is the risk-neutral probability that the call finishes in the money (S_T > K), in %?**`
        : `Un call européen de strike ${eur(strike, 0)} expire dans ${horizon}. L'action cote ${eur(spot, 0)}, volatilité implicite σ = ${pct(vol, 0)}, taux sans risque en composition continue ${pct(r, 1)}, pas de dividende.\n\n**Dans le monde de Black-Scholes, quelle est la probabilité risque-neutre que le call finisse dans la monnaie (S_T > K), en % ?**`,
      reponse,
      tolerance: 0.5,
      toleranceMode: 'absolu',
      unite: '%',
      etapes: [
        {
          titre: en ? 'd1: the distance to the strike, in standard deviations' : 'd1 : la distance au strike, en écarts-types',
          contenu: en
            ? `$d_1 = \\dfrac{\\ln(S/K) + (r + \\sigma^2/2)\\,T}{\\sigma\\sqrt{T}} = \\dfrac{\\ln(${f(spot, 0)}/${f(strike, 0)}) + (${f(r / 100, 3)} + ${f(vol / 100, 2)}^2/2) × ${f(T)}}{${f(vol / 100, 2)} × \\sqrt{${f(T)}}}$ = **${f(r4(d1), 4)}**. Everything Black-Scholes has to say passes through this number: how far the spot sits from the strike, measured in units of the risk the share will take between now and expiry.`
            : `$d_1 = \\dfrac{\\ln(S/K) + (r + \\sigma^2/2)\\,T}{\\sigma\\sqrt{T}} = \\dfrac{\\ln(${f(spot, 0)}/${f(strike, 0)}) + (${f(r / 100, 3)} + ${f(vol / 100, 2)}^2/2) × ${f(T)}}{${f(vol / 100, 2)} × \\sqrt{${f(T)}}}$ = **${f(r4(d1), 4)}**. Tout ce que Black-Scholes a à dire passe par ce nombre : la distance du spot au strike, mesurée en unités du risque que l'action prendra d'ici l'échéance.`,
        },
        {
          titre: en ? 'd2: one volatility-step below' : 'd2 : un cran de volatilité plus bas',
          contenu: en
            ? `$d_2 = d_1 - \\sigma\\sqrt{T} = ${f(r4(d1), 4)} - ${f(sigmaRacineT, 4)}$ = **${f(r4(d2), 4)}**. The step $\\sigma\\sqrt{T}$ separates the two readings of the same distance: d1 weights the outcomes by the value of the stock (the convexity bonus $+\\sigma^2/2$ of the lognormal), while d2 keeps only the pure "will it cross the strike?" coordinate.`
            : `$d_2 = d_1 - \\sigma\\sqrt{T} = ${f(r4(d1), 4)} - ${f(sigmaRacineT, 4)}$ = **${f(r4(d2), 4)}**. Le cran $\\sigma\\sqrt{T}$ sépare deux lectures de la même distance : d1 pondère les scénarios par la valeur de l'action (le bonus de convexité $+\\sigma^2/2$ de la lognormale), tandis que d2 ne garde que la pure coordonnée du « franchira-t-il le strike ? ».`,
        },
        {
          titre: en ? 'N(d2): read it, then distrust it' : 'N(d2) : la lire, puis s\'en méfier',
          contenu: en
            ? `$N(d_2) = N(${f(r4(d2), 2)})$ = **${pct(reponse, 2)}**: the probability that $S_T > K$ — in the RISK-NEUTRAL world, the one where the share drifts at r. It is exactly the weight of the strike inside the call formula ($K e^{-rT} N(d_2)$: you pay K only if you exercise). It is NOT the market's forecast, and not N(d1) = ${pct(nd1Pct, 2)} either — that one is the delta, a hedge ratio, not a probability of exercise.`
            : `$N(d_2) = N(${f(r4(d2), 2)})$ = **${pct(reponse, 2)}** : la probabilité que $S_T > K$ — dans le monde RISQUE-NEUTRE, celui où l'action dérive au taux r. C'est exactement le poids du strike dans la formule du call ($K e^{-rT} N(d_2)$ : on ne paie K que si l'on exerce). Ce n'est PAS la prévision du marché, et pas non plus N(d1) = ${pct(nd1Pct, 2)} — celui-là est le delta, un ratio de couverture, pas une probabilité d'exercice.`,
        },
      ],
      pieges: [
        en
          ? `Answering N(d1) = ${pct(nd1Pct, 2)}: the classic swap. N(d1) is the DELTA — the slope of the price, the shares to hold in the hedge; N(d2) = ${pct(reponse, 2)} is the exercise probability. They differ by the $\\sigma\\sqrt{T}$ step, and the gap widens with volatility and maturity.`
          : `Répondre N(d1) = ${pct(nd1Pct, 2)} : l'inversion classique. N(d1) est le DELTA — la pente du prix, les actions à détenir dans le hedge ; N(d2) = ${pct(reponse, 2)} est la probabilité d'exercice. Ils diffèrent du cran $\\sigma\\sqrt{T}$, et l'écart s'élargit avec la volatilité et la maturité.`,
        en
          ? `Quoting ${pct(reponse, 2)} to a client as "the odds the option pays off": risk-neutral is a pricing device, not a crystal ball. Under the REAL distribution, the share drifts at its true expected return (unknown, above r), and the true probability differs — usually higher for a call. Say "risk-neutral" out loud, every time.`
          : `Annoncer ${pct(reponse, 2)} à un client comme « la chance que l'option paie » : le risque-neutre est un outil de valorisation, pas une boule de cristal. Sous la distribution RÉELLE, l'action dérive à son vrai rendement espéré (inconnu, supérieur à r), et la vraie probabilité diffère — généralement plus haute pour un call. Dites « risque-neutre » à voix haute, à chaque fois.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 10. Le prix Black-Scholes (N3)
// ---------------------------------------------------------------------------
export const genPrixBlackScholes: ExerciseGenerator = {
  id: 'm8-ex-10',
  moduleId: M8,
  titre: 'Le prix Black-Scholes',
  titreEn: 'The Black-Scholes price',
  difficulte: 3,
  // Tirages (ordre strict) : 1. type = pick(['call', 'put']) · 2. spot = randInt(80, 120)
  // · 3. ecartK = pick([−10, −5, 0, 5, 10]) · 4. r = randFloat(1, 5, 1) · 5. vol = randInt(15, 35)
  // · 6. T = pick([0.25, 0.5, 1]).
  // strike = spot + ecartK. Réponse via blackScholesCall/blackScholesPut (composition CONTINUE).
  // Tolérance dynamique (mêmes tirages ⇒ même tolérance FR/EN) : max(0,1 ; 2 % de la réponse).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const type = pick(rng, ['call', 'put'] as const);
    const spot = randInt(rng, 80, 120);
    const ecartK = pick(rng, [-10, -5, 0, 5, 10] as const);
    const r = randFloat(rng, 1, 5, 1);
    const vol = randInt(rng, 15, 35);
    const T = pick(rng, [0.25, 0.5, 1] as const);

    const estCall = type === 'call';
    const strike = spot + ecartK;
    const d1 = d1BlackScholes(spot, strike, r, vol, T);
    const d2 = d2BlackScholes(spot, strike, r, vol, T);
    const df = dfContinu(r, T);
    const kAct = r2(strike * df);
    const n1 = r4(normaleCdf(estCall ? d1 : -d1));
    const n2 = r4(normaleCdf(estCall ? d2 : -d2));
    const reponse = r2(estCall ? blackScholesCall(spot, strike, r, vol, T) : blackScholesPut(spot, strike, r, vol, T));
    const tolerance = Math.max(0.1, r2(reponse * 0.02));
    const fauxSansActu = r2(estCall ? spot * normaleCdf(d1) - strike * normaleCdf(d2) : strike * normaleCdf(-d2) - spot * normaleCdf(-d1));
    const intrinseque = r2(estCall ? payoffCall(spot, strike) : payoffPut(spot, strike));

    const en = langue === 'en';
    const { f, eur, pct } = formatters(langue);
    const horizon = libelleMaturite(T, en);
    const nomOption = estCall ? 'call' : 'put';
    return {
      enonce: en
        ? `Price a European ${nomOption}: share at ${eur(spot, 0)}, strike ${eur(strike, 0)}, maturity ${horizon}, implied volatility σ = ${pct(vol, 0)}, continuously compounded risk-free rate ${pct(r, 1)}, no dividend.\n\n**What is the Black-Scholes price of this ${nomOption}, in euros per share?**`
        : `Pricez un ${nomOption} européen : action à ${eur(spot, 0)}, strike ${eur(strike, 0)}, maturité ${horizon}, volatilité implicite σ = ${pct(vol, 0)}, taux sans risque en composition continue ${pct(r, 1)}, pas de dividende.\n\n**Quel est le prix Black-Scholes de ce ${nomOption}, en euros par action ?**`,
      reponse,
      tolerance,
      toleranceMode: 'absolu',
      unite: '€',
      etapes: [
        {
          titre: en ? 'The coordinates: d1 and d2' : 'Les coordonnées : d1 et d2',
          contenu: en
            ? `$d_1 = \\dfrac{\\ln(S/K) + (r + \\sigma^2/2)\\,T}{\\sigma\\sqrt{T}} = ${f(r4(d1), 4)}$ and $d_2 = d_1 - \\sigma\\sqrt{T} = ${f(r4(d2), 4)}$. Rates and volatility enter as decimals (${f(r / 100, 3)} and ${f(vol / 100, 2)}), the maturity in years (${f(T)}) — the formula forgives no unit slip.`
            : `$d_1 = \\dfrac{\\ln(S/K) + (r + \\sigma^2/2)\\,T}{\\sigma\\sqrt{T}} = ${f(r4(d1), 4)}$ et $d_2 = d_1 - \\sigma\\sqrt{T} = ${f(r4(d2), 4)}$. Taux et volatilité entrent en décimales (${f(r / 100, 3)} et ${f(vol / 100, 2)}), la maturité en années (${f(T)}) — la formule ne pardonne aucune erreur d'unité.`,
        },
        {
          titre: en ? 'The two weights' : 'Les deux pondérations',
          contenu: en
            ? estCall
              ? `$N(d_1) = ${f(n1, 4)}$ and $N(d_2) = ${f(n2, 4)}$. Two different readings of the same distance: N(d1) weighs the share you will receive (it is also the delta), N(d2) weighs the strike you will pay (the risk-neutral probability of exercising).`
              : `The put uses the MINUS signs: $N(-d_1) = ${f(n1, 4)}$ and $N(-d_2) = ${f(n2, 4)}$ — the option pays in the LOWER tail, so every weight is read on the other side of the distribution. N(−d2) is the risk-neutral probability of finishing below the strike.`
            : estCall
              ? `$N(d_1) = ${f(n1, 4)}$ et $N(d_2) = ${f(n2, 4)}$. Deux lectures de la même distance : N(d1) pondère l'action que vous recevrez (c'est aussi le delta), N(d2) pondère le strike que vous paierez (la probabilité risque-neutre d'exercer).`
              : `Le put utilise les signes MOINS : $N(-d_1) = ${f(n1, 4)}$ et $N(-d_2) = ${f(n2, 4)}$ — l'option paie dans la queue BASSE, donc chaque poids se lit de l'autre côté de la distribution. N(−d2) est la probabilité risque-neutre de finir sous le strike.`,
        },
        {
          titre: en ? 'Assemble — with the discounted strike' : 'Assembler — avec le strike actualisé',
          contenu: en
            ? estCall
              ? `$C = S\\,N(d_1) - K\\,e^{-rT}\\,N(d_2) = ${f(spot, 0)} × ${f(n1, 4)} - ${f(kAct, 2)} × ${f(n2, 4)}$ = **${eur(reponse, 2)}** (with $K e^{-rT} = ${f(strike, 0)} × ${f(r6(df), 4)} = ${f(kAct, 2)}$). Read it as a weighted exchange: what you receive (the share, weighted) minus what you pay (the discounted strike, weighted by the odds of paying it). Intrinsic value today: ${eur(intrinseque, 2)} — everything above it is time value, the price of what can still happen.`
              : `$P = K\\,e^{-rT}\\,N(-d_2) - S\\,N(-d_1) = ${f(kAct, 2)} × ${f(n2, 4)} - ${f(spot, 0)} × ${f(n1, 4)}$ = **${eur(reponse, 2)}** (with $K e^{-rT} = ${f(strike, 0)} × ${f(r6(df), 4)} = ${f(kAct, 2)}$). The mirror of the call: what you receive (the discounted strike, weighted) minus what you deliver (the share, weighted). Intrinsic value today: ${eur(intrinseque, 2)} — everything above it is time value. Check: this put and its call satisfy parity to the cent.`
            : estCall
              ? `$C = S\\,N(d_1) - K\\,e^{-rT}\\,N(d_2) = ${f(spot, 0)} × ${f(n1, 4)} - ${f(kAct, 2)} × ${f(n2, 4)}$ = **${eur(reponse, 2)}** (avec $K e^{-rT} = ${f(strike, 0)} × ${f(r6(df), 4)} = ${f(kAct, 2)}$). Lisez un échange pondéré : ce que vous recevez (l'action, pondérée) moins ce que vous payez (le strike actualisé, pondéré par la probabilité de le payer). Valeur intrinsèque aujourd'hui : ${eur(intrinseque, 2)} — tout ce qui dépasse est de la valeur temps, le prix de ce qui peut encore arriver.`
              : `$P = K\\,e^{-rT}\\,N(-d_2) - S\\,N(-d_1) = ${f(kAct, 2)} × ${f(n2, 4)} - ${f(spot, 0)} × ${f(n1, 4)}$ = **${eur(reponse, 2)}** (avec $K e^{-rT} = ${f(strike, 0)} × ${f(r6(df), 4)} = ${f(kAct, 2)}$). Le miroir du call : ce que vous recevez (le strike actualisé, pondéré) moins ce que vous livrez (l'action, pondérée). Valeur intrinsèque aujourd'hui : ${eur(intrinseque, 2)} — tout ce qui dépasse est de la valeur temps. Vérification : ce put et son call respectent la parité au centime.`,
        },
      ],
      pieges: [
        en
          ? `Forgetting to discount the strike: ${estCall ? `$S\\,N(d_1) - K\\,N(d_2)$` : `$K\\,N(-d_2) - S\\,N(-d_1)$`} = ${f(fauxSansActu, 2)} instead of ${f(reponse, 2)}. The strike is paid AT EXPIRY: it enters at $K e^{-rT}$ — the same present-value reflex as in parity, and the same trap.`
          : `Oublier d'actualiser le strike : ${estCall ? `$S\\,N(d_1) - K\\,N(d_2)$` : `$K\\,N(-d_2) - S\\,N(-d_1)$`} = ${f(fauxSansActu, 2)} au lieu de ${f(reponse, 2)}. Le strike se paie À L'ÉCHÉANCE : il entre à $K e^{-rT}$ — le même réflexe de valeur actuelle que dans la parité, et le même piège.`,
        en
          ? estCall
            ? `Answering the intrinsic value (${eur(intrinseque, 2)}): before expiry, an option is worth intrinsic PLUS time value — ${eur(reponse, 2)} here. Volatility and time left both have a price; quoting intrinsic alone gives the option away for free${intrinseque === 0 ? ' (worse: an out-of-the-money option would be "worth zero")' : ''}.`
            : `Applying the CALL's formula and signs to a put: the put pays in the lower tail, its weights are $N(-d_1)$ and $N(-d_2)$ and the two terms swap order. If you fear the signs, price the call and cross parity: $P = C - S + K e^{-rT}$ lands on the same ${eur(reponse, 2)}.`
          : estCall
            ? `Répondre la valeur intrinsèque (${eur(intrinseque, 2)}) : avant l'échéance, une option vaut l'intrinsèque PLUS la valeur temps — ${eur(reponse, 2)} ici. La volatilité et le temps restant ont un prix ; annoncer la seule intrinsèque brade l'option${intrinseque === 0 ? ' (pire : une option hors de la monnaie « vaudrait zéro »)' : ''}.`
            : `Appliquer au put la formule et les signes du CALL : le put paie dans la queue basse, ses poids sont $N(-d_1)$ et $N(-d_2)$ et les deux termes échangent leur ordre. Si les signes vous inquiètent, pricez le call et traversez la parité : $P = C - S + K e^{-rT}$ retombe sur le même ${eur(reponse, 2)}.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 11. Le delta : la pente du prix (N2)
// ---------------------------------------------------------------------------
export const genDeltaOption: ExerciseGenerator = {
  id: 'm8-ex-11',
  moduleId: M8,
  titre: 'Le delta : la pente du prix',
  titreEn: 'Delta: the slope of the price',
  difficulte: 2,
  // Tirages (ordre strict) : 1. type = pick(['call', 'put']) · 2. spot = randInt(80, 120)
  // · 3. ecartK = pick([−10, −5, 0, 5, 10]) · 4. r = randFloat(1, 5, 1) · 5. vol = randInt(15, 35)
  // · 6. T = pick([0.25, 0.5, 1]).
  // strike = spot + ecartK. Réponse via deltaCall (N(d1) ∈ (0, 1)) ou deltaPut (N(d1) − 1 ∈ (−1, 0)),
  // arrondie à 4 décimales — le delta du put est NÉGATIF, signe compris dans la réponse.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const type = pick(rng, ['call', 'put'] as const);
    const spot = randInt(rng, 80, 120);
    const ecartK = pick(rng, [-10, -5, 0, 5, 10] as const);
    const r = randFloat(rng, 1, 5, 1);
    const vol = randInt(rng, 15, 35);
    const T = pick(rng, [0.25, 0.5, 1] as const);

    const estCall = type === 'call';
    const strike = spot + ecartK;
    const d1 = d1BlackScholes(spot, strike, r, vol, T);
    const dCall = deltaCall(spot, strike, r, vol, T);
    const reponse = r4(estCall ? dCall : deltaPut(spot, strike, r, vol, T));
    const nd1 = r4(dCall);
    const nd2 = r4(normaleCdf(d2BlackScholes(spot, strike, r, vol, T)));
    const centimes = r2(Math.abs(reponse) * 100);
    const atm = ecartK === 0;

    const en = langue === 'en';
    const { f, eur, pct, sgn } = formatters(langue);
    const horizon = libelleMaturite(T, en);
    const nomOption = estCall ? 'call' : 'put';
    return {
      enonce: en
        ? `A European ${nomOption} struck at ${eur(strike, 0)} expires in ${horizon}. The share trades at ${eur(spot, 0)}, implied volatility σ = ${pct(vol, 0)}, continuously compounded risk-free rate ${pct(r, 1)}, no dividend.\n\n**What is the delta (Δ) of this ${nomOption}, with its sign (4 decimals)?**`
        : `Un ${nomOption} européen de strike ${eur(strike, 0)} expire dans ${horizon}. L'action cote ${eur(spot, 0)}, volatilité implicite σ = ${pct(vol, 0)}, taux sans risque en composition continue ${pct(r, 1)}, pas de dividende.\n\n**Quel est le delta (Δ) de ce ${nomOption}, avec son signe (4 décimales) ?**`,
      reponse,
      tolerance: 0.01,
      toleranceMode: 'absolu',
      etapes: [
        {
          titre: en ? 'd1 first, as always' : 'd1 d\'abord, comme toujours',
          contenu: en
            ? `$d_1 = \\dfrac{\\ln(S/K) + (r + \\sigma^2/2)\\,T}{\\sigma\\sqrt{T}} = \\dfrac{\\ln(${f(spot, 0)}/${f(strike, 0)}) + (${f(r / 100, 3)} + ${f(vol / 100, 2)}^2/2) × ${f(T)}}{${f(vol / 100, 2)} × \\sqrt{${f(T)}}}$ = **${f(r4(d1), 4)}**. All the Greeks drink from this well.`
            : `$d_1 = \\dfrac{\\ln(S/K) + (r + \\sigma^2/2)\\,T}{\\sigma\\sqrt{T}} = \\dfrac{\\ln(${f(spot, 0)}/${f(strike, 0)}) + (${f(r / 100, 3)} + ${f(vol / 100, 2)}^2/2) × ${f(T)}}{${f(vol / 100, 2)} × \\sqrt{${f(T)}}}$ = **${f(r4(d1), 4)}**. Toutes les grecques boivent à ce puits.`,
        },
        {
          titre: en ? 'The delta formula' : 'La formule du delta',
          contenu: en
            ? estCall
              ? `$\\Delta_{call} = N(d_1) = N(${f(r4(d1), 2)})$ = **${f(reponse, 4)}**. Between 0 and 1 always: a call never moves more than the share, never against it. ${atm ? 'At the money, Δ sits a touch ABOVE 0.5 — the (r + σ²/2)T term pushes d1 up.' : ecartK < 0 ? 'In the money, Δ climbs towards 1: the call behaves more and more like the share itself.' : 'Out of the money, Δ slides towards 0: the call barely reacts — most likely it dies.'}`
              : `$\\Delta_{put} = N(d_1) - 1 = ${f(nd1, 4)} - 1$ = **${f(reponse, 4)}**. Between −1 and 0 always: the put GAINS when the share falls — its slope is negative by nature. ${atm ? 'At the money, Δ sits a touch above −0.5 (mirror of the call\'s 0.5-and-a-bit).' : ecartK > 0 ? 'In the money (K > S), Δ dives towards −1: the put tracks the share tick for tick, in reverse.' : 'Out of the money (K < S), Δ rises towards 0: the put barely reacts — most likely it dies.'}`
            : estCall
              ? `$\\Delta_{call} = N(d_1) = N(${f(r4(d1), 2)})$ = **${f(reponse, 4)}**. Entre 0 et 1 toujours : un call ne bouge jamais plus que l'action, jamais contre elle. ${atm ? 'À la monnaie, Δ vit un peu AU-DESSUS de 0,5 — le terme (r + σ²/2)T pousse d1 vers le haut.' : ecartK < 0 ? 'Dans la monnaie, Δ grimpe vers 1 : le call se comporte de plus en plus comme l\'action elle-même.' : 'Hors de la monnaie, Δ glisse vers 0 : le call réagit à peine — le plus probable est qu\'il meure.'}`
              : `$\\Delta_{put} = N(d_1) - 1 = ${f(nd1, 4)} - 1$ = **${f(reponse, 4)}**. Entre −1 et 0 toujours : le put GAGNE quand l'action baisse — sa pente est négative par nature. ${atm ? 'À la monnaie, Δ vit un peu au-dessus de −0,5 (le miroir du 0,5 et quelques du call).' : ecartK > 0 ? 'Dans la monnaie (K > S), Δ plonge vers −1 : le put suit l\'action tick pour tick, à l\'envers.' : 'Hors de la monnaie (K < S), Δ remonte vers 0 : le put réagit à peine — le plus probable est qu\'il meure.'}`,
        },
        {
          titre: en ? 'Read the slope like a trader' : 'Lire la pente comme un trader',
          contenu: en
            ? `If the share gains 1 €, this ${nomOption} ${estCall ? 'gains' : 'loses'} about ${f(centimes, 0)} cents (${sgn(reponse, 4)} × 1 €) — locally, for SMALL moves: delta is a tangent, not the whole curve, and gamma will bill the difference. Exact relation to memorise: $\\Delta_{call} - \\Delta_{put} = 1$ (differentiate parity) — here ${f(nd1, 4)} − (${f(r4(nd1 - 1), 4)}) = 1, to the fourth decimal.`
            : `Si l'action gagne 1 €, ce ${nomOption} ${estCall ? 'gagne' : 'perd'} environ ${f(centimes, 0)} centimes (${sgn(reponse, 4)} × 1 €) — localement, pour de PETITS mouvements : le delta est une tangente, pas la courbe entière, et le gamma facturera la différence. Relation exacte à mémoriser : $\\Delta_{call} - \\Delta_{put} = 1$ (dérivez la parité) — ici ${f(nd1, 4)} − (${f(r4(nd1 - 1), 4)}) = 1, à la quatrième décimale.`,
        },
      ],
      pieges: [
        en
          ? estCall
            ? `Quoting Δ = ${f(nd1, 4)} as "the probability the call finishes in the money": that is N(d2) = ${f(nd2, 4)}, one volatility-step lower. N(d1) is a HEDGE RATIO — how many shares replicate the option — and it systematically overstates the exercise odds.`
            : `Announcing a POSITIVE delta: ${f(nd1, 4)} is N(d1), the call's delta. The put's is N(d1) − 1 = ${f(reponse, 4)} — negative, because the put is a bet on the fall. Forget the sign and every hedge built on it trades in the wrong direction.`
          : estCall
            ? `Annoncer Δ = ${f(nd1, 4)} comme « la probabilité que le call finisse dans la monnaie » : ça, c'est N(d2) = ${f(nd2, 4)}, un cran de volatilité plus bas. N(d1) est un RATIO DE COUVERTURE — combien d'actions répliquent l'option — et il surestime systématiquement la probabilité d'exercice.`
            : `Annoncer un delta POSITIF : ${f(nd1, 4)}, c'est N(d1), le delta du call. Celui du put vaut N(d1) − 1 = ${f(reponse, 4)} — négatif, parce que le put est un pari sur la baisse. Oubliez le signe et toute couverture bâtie dessus traite dans le mauvais sens.`,
        en
          ? `Extrapolating the tangent: "Δ = ${f(reponse, 4)}, so a 20 € move pays ${f(r2(Math.abs(reponse) * 20), 2)} €" — false. Delta itself moves along the way (that is gamma): the linear reading only holds for small moves. An option is a curve; delta is its slope AT THIS POINT.`
          : `Extrapoler la tangente : « Δ = ${f(reponse, 4)}, donc un mouvement de 20 € paie ${f(r2(Math.abs(reponse) * 20), 2)} € » — faux. Le delta bouge lui-même en chemin (c'est le gamma) : la lecture linéaire ne vaut que pour les petits mouvements. Une option est une courbe ; le delta est sa pente EN CE POINT.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 12. Le delta-hedge du vendeur de calls (N3)
// ---------------------------------------------------------------------------
export const genDeltaHedgeVendeur: ExerciseGenerator = {
  id: 'm8-ex-12',
  moduleId: M8,
  titre: 'Le delta-hedge du vendeur de calls',
  titreEn: 'Delta-hedging a short call book',
  difficulte: 3,
  // Tirages (ordre strict) : 1. spot = randInt(80, 120) · 2. ecartK = pick([−5, 0, 5])
  // · 3. r = randFloat(1, 5, 1) · 4. vol = randInt(15, 35) · 5. T = pick([0.25, 0.5])
  // · 6. nb = randInt(5, 40).
  // strike = spot + ecartK ; quotité 100 actions/contrat. Réponse via actionsDeltaHedge
  // (entier arrondi). Le piège cardinal du module : le vendeur de calls ACHÈTE le sous-jacent.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const spot = randInt(rng, 80, 120);
    const ecartK = pick(rng, [-5, 0, 5] as const);
    const r = randFloat(rng, 1, 5, 1);
    const vol = randInt(rng, 15, 35);
    const T = pick(rng, [0.25, 0.5] as const);
    const nb = randInt(rng, 5, 40);

    const strike = spot + ecartK;
    const quotite = 100;
    const delta = deltaCall(spot, strike, r, vol, T);
    const reponse = actionsDeltaHedge(delta, nb, quotite);
    const tolerance = Math.max(1, Math.round(reponse * 0.01));
    const brut = r2(delta * nb * quotite);
    const fauxSansQuotite = Math.round(Math.abs(delta) * nb);
    const deltaAff = r4(delta);

    const en = langue === 'en';
    const { f, eur, pct } = formatters(langue);
    const horizon = libelleMaturite(T, en);
    return {
      enonce: en
        ? `A client buys from you (you SELL) ${f(nb, 0)} European calls struck at ${eur(strike, 0)}, ${horizon}, contract size ${f(quotite, 0)} shares. The share trades at ${eur(spot, 0)}, implied volatility σ = ${pct(vol, 0)}, continuously compounded rate ${pct(r, 1)}. House rule: the position is delta-hedged the minute it is booked.\n\n**How many shares must you trade — and in which direction — to neutralise the delta? Answer: the number of shares (the correct direction is to BUY).**`
        : `Un client vous achète (vous VENDEZ) ${f(nb, 0)} calls européens de strike ${eur(strike, 0)}, ${horizon}, quotité ${f(quotite, 0)} actions par contrat. L'action cote ${eur(spot, 0)}, volatilité implicite σ = ${pct(vol, 0)}, taux en composition continue ${pct(r, 1)}. Règle maison : la position se delta-hedge à la minute où elle est bookée.\n\n**Combien d'actions devez-vous traiter — et dans quel sens — pour neutraliser le delta ? Réponse : le nombre d'actions (le bon sens est l'ACHAT).**`,
      reponse,
      tolerance,
      toleranceMode: 'absolu',
      unite: en ? 'shares' : 'actions',
      etapes: [
        {
          titre: en ? 'The book\'s delta after the sale' : 'Le delta du book après la vente',
          contenu: en
            ? `The call's delta: $\\Delta = N(d_1)$ = **${f(deltaAff, 4)}**. You are SHORT the calls, so the book carries $-\\Delta$ per underlying share: every euro the share gains costs you about ${f(r2(delta * 100), 0)} cents per share promised. Sold calls make you an involuntary bear — hence the hedge.`
            : `Le delta du call : $\\Delta = N(d_1)$ = **${f(deltaAff, 4)}**. Vous êtes SHORT les calls, donc le book porte $-\\Delta$ par action promise : chaque euro gagné par l'action vous coûte environ ${f(r2(delta * 100), 0)} centimes par action promise. Des calls vendus font de vous un baissier involontaire — d'où la couverture.`,
        },
        {
          titre: en ? 'Shares to hold: delta × contracts × contract size' : 'Actions à détenir : delta × contrats × quotité',
          contenu: en
            ? `$\\text{shares} = \\Delta × n × \\text{contract size} = ${f(deltaAff, 4)} × ${f(nb, 0)} × ${f(quotite, 0)} = ${f(brut, 1)}$ → **${f(reponse, 0)} shares** (whole shares only — standard rounding). You BUY them: the shares' +${f(reponse, 0)} delta cancels the calls' −${f(brut, 1)}. Now, for SMALL moves of the share, the book's P&L stands still.`
            : `$\\text{actions} = \\Delta × n × \\text{quotité} = ${f(deltaAff, 4)} × ${f(nb, 0)} × ${f(quotite, 0)} = ${f(brut, 1)}$ → **${f(reponse, 0)} actions** (on ne traite que des actions entières — arrondi standard). Vous les ACHETEZ : le delta +${f(reponse, 0)} des actions annule le −${f(brut, 1)} des calls. Désormais, pour les PETITS mouvements de l'action, le P&L du book ne bouge plus.`,
        },
        {
          titre: en ? 'A hedge with an expiry date' : 'Une couverture à durée de vie limitée',
          contenu: en
            ? `This neutrality is instantaneous, not permanent: Δ moves with the share and with time — if the share rises, N(d1) climbs and you must BUY more (after the rise); if it falls, you SELL (after the fall). Buy high, sell low, forced: that is the life of the short-gamma hedger, and gamma decides how often the phone rings. The premium collected is the salary for exactly this chore.`
            : `Cette neutralité est instantanée, pas permanente : Δ bouge avec l'action et avec le temps — si l'action monte, N(d1) grimpe et il faut RACHETER (après la hausse) ; si elle baisse, il faut VENDRE (après la baisse). Acheter haut, revendre bas, de force : c'est la vie du hedger gamma-négatif, et c'est le gamma qui décide de la fréquence des appels. La prime encaissée est le salaire d'exactement cette corvée.`,
        },
      ],
      pieges: [
        en
          ? `Selling the shares "since I sold the calls": that DOUBLES the bearish exposure instead of cancelling it. Sold calls already lose when the share rises; the hedge must WIN on a rise — the call seller BUYS the underlying, always. It is the module's cardinal direction mistake.`
          : `Vendre les actions « puisque j'ai vendu les calls » : cela DOUBLE l'exposition baissière au lieu de l'annuler. Des calls vendus perdent déjà quand l'action monte ; la couverture doit GAGNER à la hausse — le vendeur de calls ACHÈTE le sous-jacent, toujours. C'est l'erreur de sens cardinale du module.`,
        en
          ? `Forgetting the contract size: Δ × n = ${f(fauxSansQuotite, 0)} shares instead of ${f(reponse, 0)} — a hedge one hundred times too small, i.e. no hedge at all. Each contract covers ${f(quotite, 0)} shares: the factor ${f(quotite, 0)} converts contracts into underlying exposure, exactly like module 7's multipliers.`
          : `Oublier la quotité : Δ × n = ${f(fauxSansQuotite, 0)} actions au lieu de ${f(reponse, 0)} — une couverture cent fois trop petite, c'est-à-dire pas de couverture du tout. Chaque contrat porte sur ${f(quotite, 0)} actions : le facteur ${f(quotite, 0)} convertit les contrats en exposition au sous-jacent, exactement comme les multiplicateurs du module 7.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 13. Gamma et vega : les grecques jumelles du second ordre (N3)
// ---------------------------------------------------------------------------
export const genGammaVega: ExerciseGenerator = {
  id: 'm8-ex-13',
  moduleId: M8,
  titre: 'Gamma et vega : le second ordre',
  titreEn: 'Gamma and vega: the second order',
  difficulte: 3,
  // Tirages (ordre strict) : 1. grecque = pick(['gamma', 'vega']) · 2. type = pick(['call', 'put'])
  // · 3. spot = randInt(80, 120) · 4. ecartK = pick([−5, 0, 5]) · 5. r = randFloat(1, 5, 1)
  // · 6. vol = randInt(15, 35) · 7. T = pick([0.25, 0.5, 1]).
  // strike = spot + ecartK. Réponse via gammaOption ou vegaOption (PAR POINT de vol), r4.
  // Gamma et vega sont IDENTIQUES pour le call et le put de mêmes (K, T) — le type tiré ne
  // change que l'habillage de l'énoncé, jamais la réponse (et c'est l'une des leçons).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const grecque = pick(rng, ['gamma', 'vega'] as const);
    const type = pick(rng, ['call', 'put'] as const);
    const spot = randInt(rng, 80, 120);
    const ecartK = pick(rng, [-5, 0, 5] as const);
    const r = randFloat(rng, 1, 5, 1);
    const vol = randInt(rng, 15, 35);
    const T = pick(rng, [0.25, 0.5, 1] as const);

    const estGamma = grecque === 'gamma';
    const strike = spot + ecartK;
    const d1 = d1BlackScholes(spot, strike, r, vol, T);
    const phi = densiteNormale(d1);
    const gamma = gammaOption(spot, strike, r, vol, T);
    const vega = vegaOption(spot, strike, r, vol, T);
    const reponse = r4(estGamma ? gamma : vega);
    const tolerance = estGamma ? 0.002 : 0.01;
    const fauxVega100 = r2(spot * phi * Math.sqrt(T)); // vega sans le /100 (pour σ en unité 1)
    const fauxGammaN = r4(normaleCdf(d1) / (spot * (vol / 100) * Math.sqrt(T))); // N(d1) au lieu de φ(d1)

    const en = langue === 'en';
    const { f, eur, pct } = formatters(langue);
    const horizon = libelleMaturite(T, en);
    const nomOption = type === 'call' ? 'call' : 'put';
    return {
      enonce: en
        ? estGamma
          ? `A European ${nomOption} struck at ${eur(strike, 0)} expires in ${horizon}. The share trades at ${eur(spot, 0)}, implied volatility σ = ${pct(vol, 0)}, continuously compounded rate ${pct(r, 1)}.\n\n**What is the gamma (Γ) of this ${nomOption} (4 decimals)?**`
          : `A European ${nomOption} struck at ${eur(strike, 0)} expires in ${horizon}. The share trades at ${eur(spot, 0)}, implied volatility σ = ${pct(vol, 0)}, continuously compounded rate ${pct(r, 1)}.\n\n**By how much does the ${nomOption}'s price rise if implied volatility moves from ${pct(vol, 0)} to ${pct(vol + 1, 0)} — its vega per volatility point — in euros per share?**`
        : estGamma
          ? `Un ${nomOption} européen de strike ${eur(strike, 0)} expire dans ${horizon}. L'action cote ${eur(spot, 0)}, volatilité implicite σ = ${pct(vol, 0)}, taux en composition continue ${pct(r, 1)}.\n\n**Quel est le gamma (Γ) de ce ${nomOption} (4 décimales) ?**`
          : `Un ${nomOption} européen de strike ${eur(strike, 0)} expire dans ${horizon}. L'action cote ${eur(spot, 0)}, volatilité implicite σ = ${pct(vol, 0)}, taux en composition continue ${pct(r, 1)}.\n\n**De combien le prix du ${nomOption} monte-t-il si la volatilité implicite passe de ${pct(vol, 0)} à ${pct(vol + 1, 0)} — son vega par point de volatilité — en euros par action ?**`,
      reponse,
      tolerance,
      toleranceMode: 'absolu',
      unite: estGamma ? undefined : en ? '€/vol point' : '€/point de vol',
      etapes: [
        {
          titre: en ? 'd1 and the DENSITY φ(d1)' : 'd1 et la DENSITÉ φ(d1)',
          contenu: en
            ? `$d_1 = ${f(r4(d1), 4)}$, and this time the formula wants the bell curve itself, not its area: $\\varphi(d_1) = \\dfrac{e^{-d_1^2/2}}{\\sqrt{2\\pi}}$ = **${f(r4(phi), 4)}**. φ peaks when d1 = 0 — at the money: that is why both second-order Greeks are largest exactly where the option's fate is most undecided.`
            : `$d_1 = ${f(r4(d1), 4)}$, et cette fois la formule veut la cloche elle-même, pas son aire : $\\varphi(d_1) = \\dfrac{e^{-d_1^2/2}}{\\sqrt{2\\pi}}$ = **${f(r4(phi), 4)}**. φ culmine quand d1 = 0 — à la monnaie : voilà pourquoi les deux grecques du second ordre sont maximales exactement là où le sort de l'option est le plus indécis.`,
        },
        {
          titre: en ? 'The formula' : 'La formule',
          contenu: en
            ? estGamma
              ? `$\\Gamma = \\dfrac{\\varphi(d_1)}{S\\,\\sigma\\sqrt{T}} = \\dfrac{${f(r4(phi), 4)}}{${f(spot, 0)} × ${f(vol / 100, 2)} × \\sqrt{${f(T)}}}$ = **${f(reponse, 4)}**. Units: delta per euro of the share — if the share gains 1 €, Δ climbs by about ${f(reponse, 4)}. Gamma is the curvature of the hockey stick before its time.`
              : `$\\text{vega} = \\dfrac{S\\,\\varphi(d_1)\\,\\sqrt{T}}{100} = \\dfrac{${f(spot, 0)} × ${f(r4(phi), 4)} × \\sqrt{${f(T)}}}{100}$ = **${eur(reponse, 4)} per point** of volatility — the desks' convention: σ moving from ${pct(vol, 0)} to ${pct(vol + 1, 0)} adds ≈ ${eur(r2(reponse), 2)} to the premium. Vega grows with √T: long maturities are the natural home of volatility trades.`
            : estGamma
              ? `$\\Gamma = \\dfrac{\\varphi(d_1)}{S\\,\\sigma\\sqrt{T}} = \\dfrac{${f(r4(phi), 4)}}{${f(spot, 0)} × ${f(vol / 100, 2)} × \\sqrt{${f(T)}}}$ = **${f(reponse, 4)}**. Unités : du delta par euro d'action — si l'action gagne 1 €, Δ grimpe d'environ ${f(reponse, 4)}. Le gamma est la courbure de la crosse de hockey avant l'heure.`
              : `$\\text{vega} = \\dfrac{S\\,\\varphi(d_1)\\,\\sqrt{T}}{100} = \\dfrac{${f(spot, 0)} × ${f(r4(phi), 4)} × \\sqrt{${f(T)}}}{100}$ = **${eur(reponse, 4)} par point** de volatilité — la convention des desks : σ passant de ${pct(vol, 0)} à ${pct(vol + 1, 0)} ajoute ≈ ${eur(r2(reponse), 2)} à la prime. Le vega croît en √T : les maturités longues sont le terrain naturel des trades de volatilité.`,
        },
        {
          titre: en ? 'Identical for call and put — and who pays it' : 'Identique call et put — et qui le paie',
          contenu: en
            ? estGamma
              ? `The ${eur(strike, 0)} call and put share this exact Γ = ${f(reponse, 4)}: parity says C − P is LINEAR in S, so all the curvature is common. The sign comes from the position, not the instrument: every option BOUGHT is long gamma (the curve works for you on big moves); every option SOLD is short gamma — and near expiry, at the money, Γ explodes and the seller's re-hedging turns frantic.`
              : `The ${eur(strike, 0)} call and put share this exact vega = ${eur(reponse, 4)}: parity again — C − P contains no σ at all. Bought options are LONG vega (fear rising enriches you), sold options SHORT vega. A book's true size is quoted in vega, not in contracts: "${eur(r2(reponse * 100), 0)} per vol point per contract of 100" says what a 5-point vol shock does to the P&L before the underlying even moves.`
            : estGamma
              ? `Le call et le put de strike ${eur(strike, 0)} partagent ce même Γ = ${f(reponse, 4)} : la parité dit que C − P est LINÉAIRE en S, donc toute la courbure est commune. Le signe vient de la position, pas de l'instrument : toute option ACHETÉE est gamma positif (la courbe travaille pour vous sur les grands mouvements) ; toute option VENDUE est gamma négatif — et près de l'échéance, à la monnaie, Γ explose et le re-hedging du vendeur devient frénétique.`
              : `Le call et le put de strike ${eur(strike, 0)} partagent ce même vega = ${eur(reponse, 4)} : la parité encore — C − P ne contient pas du tout σ. Les options achetées sont vega POSITIF (la peur qui monte vous enrichit), les vendues vega NÉGATIF. La vraie taille d'un book se cote en vega, pas en contrats : « ${eur(r2(reponse * 100), 0)} par point de vol et par contrat de 100 » dit ce qu'un choc de 5 points de vol fait au P&L avant même que le sous-jacent ne bouge.`,
        },
      ],
      pieges: [
        en
          ? estGamma
            ? `Giving the ${type === 'call' ? 'put' : 'call'} a different (or negative) gamma: Γ is IDENTICAL for the call and put of the same (K, T) — differentiate parity twice and the linear term S vanishes. A negative gamma never comes from the instrument, only from SELLING it.`
            : `Forgetting the /100: $S\\,\\varphi(d_1)\\,\\sqrt{T} = ${f(fauxVega100, 2)}$ — the sensitivity for σ jumping a whole unit (100 points!), a hundred times the desk convention. Vega PER POINT is ${eur(reponse, 4)}: check the plausibility — one vol point moving a ${eur(spot, 0)} share's option by ${f(fauxVega100, 0)} € is absurd.`
          : estGamma
            ? `Donner au ${type === 'call' ? 'put' : 'call'} un gamma différent (ou négatif) : Γ est IDENTIQUE pour le call et le put de mêmes (K, T) — dérivez la parité deux fois et le terme linéaire S disparaît. Un gamma négatif ne vient jamais de l'instrument, seulement de sa VENTE.`
            : `Oublier le /100 : $S\\,\\varphi(d_1)\\,\\sqrt{T} = ${f(fauxVega100, 2)}$ — la sensibilité pour un saut de σ d'une unité entière (100 points !), cent fois la convention des desks. Le vega PAR POINT vaut ${eur(reponse, 4)} : testez la vraisemblance — un point de vol qui déplace de ${f(fauxVega100, 0)} € l'option d'une action à ${eur(spot, 0)} est absurde.`,
        en
          ? estGamma
            ? `Using N(d1) instead of φ(d1): ${f(fauxGammaN, 4)} instead of ${f(reponse, 4)}. N is the cumulative area (the delta's ingredient); Γ wants the DENSITY, the height of the bell at d1 — two different functions of the same number, and the formula collapses if you swap them.`
            : `Reading vega as a market forecast ("vol will rise, so I earn vega"): vega measures EXPOSURE, not opinion — it tells you what happens IF implied vol moves. Whether it will move is the trade; vega is only the size of the bet.`
          : estGamma
            ? `Utiliser N(d1) au lieu de φ(d1) : ${f(fauxGammaN, 4)} au lieu de ${f(reponse, 4)}. N est l'aire cumulée (l'ingrédient du delta) ; Γ veut la DENSITÉ, la hauteur de la cloche en d1 — deux fonctions différentes du même nombre, et la formule s'effondre si on les échange.`
            : `Lire le vega comme une prévision (« la vol va monter, donc je gagne le vega ») : le vega mesure une EXPOSITION, pas une opinion — il dit ce qui arrive SI la vol implicite bouge. Qu'elle bouge ou non, c'est le trade ; le vega n'est que la taille du pari.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 14. La volatilité : annualiser en √252, lire l'implicite (N3)
// ---------------------------------------------------------------------------
export const genVolatilites: ExerciseGenerator = {
  id: 'm8-ex-14',
  moduleId: M8,
  titre: 'La volatilité : √252 et l\'implicite',
  titreEn: 'Volatility: √252 and the implied',
  difficulte: 3,
  // Tirages (ordre strict) : 1. mode = pick(['annualisation', 'implicite']) · 2. volQuot = randFloat(0.6, 2.2, 2)
  // · 3. spot = randInt(80, 120) · 4. r = randFloat(1, 5, 1) · 5. volImp = randInt(15, 35)
  // · 6. T = pick([0.25, 0.5]).
  // annualisation ⇒ réponse = volAnnualiseePct(volQuot) (σ_an = σ_j × √252 : les VARIANCES
  // s'additionnent, pas les écarts-types) ; implicite ⇒ prime = BS(call ATM à volImp) arrondie
  // au centime, réponse = volImplicitePct(prime) — le prix d'une option se lit en vol.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const mode = pick(rng, ['annualisation', 'implicite'] as const);
    const volQuot = randFloat(rng, 0.6, 2.2, 2);
    const spot = randInt(rng, 80, 120);
    const r = randFloat(rng, 1, 5, 1);
    const volImp = randInt(rng, 15, 35);
    const T = pick(rng, [0.25, 0.5] as const);

    const estAnnu = mode === 'annualisation';
    const racine252 = r4(Math.sqrt(252));
    const volAnnuelle = r2(volAnnualiseePct(volQuot));
    const faux252 = r2(volQuot * 252);
    const prime = r2(blackScholesCall(spot, spot, r, volImp, T));
    const volRetrouvee = r2(volImplicitePct(prime, spot, spot, r, T));
    const cBas = r2(blackScholesCall(spot, spot, r, volImp - 5, T));
    const cHaut = r2(blackScholesCall(spot, spot, r, volImp + 5, T));
    const reponse = estAnnu ? volAnnuelle : volRetrouvee;
    const tolerance = estAnnu ? 0.05 : 0.5;

    const en = langue === 'en';
    const { f, eur, pct } = formatters(langue);
    const horizon = libelleMaturite(T, en);
    return {
      enonce: en
        ? estAnnu
          ? `From one year of price history, the desk measures a DAILY volatility of ${pct(volQuot, 2)} on the share's returns (252 trading days a year, independent returns).\n\n**What is the annualised volatility, in %?**`
          : `The share trades at ${eur(spot, 0)}. The at-the-money call (strike ${eur(spot, 0)}, ${horizon}) quotes ${eur(prime, 2)} per share; the continuously compounded risk-free rate is ${pct(r, 1)}, no dividend.\n\n**What implied volatility is the market pricing into this call, in % (the σ that Black-Scholes needs to reproduce the quote)?**`
        : estAnnu
          ? `Sur un an d'historique, le desk mesure une volatilité QUOTIDIENNE de ${pct(volQuot, 2)} sur les rendements de l'action (252 jours de bourse par an, rendements indépendants).\n\n**Quelle est la volatilité annualisée, en % ?**`
          : `L'action cote ${eur(spot, 0)}. Le call à la monnaie (strike ${eur(spot, 0)}, ${horizon}) cote ${eur(prime, 2)} par action ; le taux sans risque en composition continue vaut ${pct(r, 1)}, pas de dividende.\n\n**Quelle volatilité implicite le marché price-t-il dans ce call, en % (le σ qu'il faut donner à Black-Scholes pour reproduire la cotation) ?**`,
      reponse,
      tolerance,
      toleranceMode: 'absolu',
      unite: '%',
      etapes: estAnnu
        ? [
          {
            titre: en ? 'Variances add up — not standard deviations' : 'Les variances s\'additionnent — pas les écarts-types',
            contenu: en
              ? `With independent daily returns, the variances stack: $\\sigma_{an}^2 = 252 × \\sigma_{j}^2$. The random walk of chapter 2 again: risk grows with TIME, uncertainty (the standard deviation) with its SQUARE ROOT. Adding standard deviations would count the same shocks twice.`
              : `Avec des rendements quotidiens indépendants, les variances s'empilent : $\\sigma_{an}^2 = 252 × \\sigma_{j}^2$. La marche aléatoire du chapitre 2, encore : le risque croît avec le TEMPS, l'incertitude (l'écart-type) avec sa RACINE CARRÉE. Additionner des écarts-types compterait deux fois les mêmes chocs.`,
          },
          {
            titre: en ? 'Take the square root' : 'Prendre la racine',
            contenu: en
              ? `$\\sigma_{an} = \\sigma_{j} × \\sqrt{252} = ${f(volQuot, 2)}\\,\\% × ${f(racine252, 2)}$ = **${pct(reponse, 2)}**. The same √T law scales any horizon: weekly vol × √52, monthly × √12 — one convention, memorised once.`
              : `$\\sigma_{an} = \\sigma_{j} × \\sqrt{252} = ${f(volQuot, 2)}\\,\\% × ${f(racine252, 2)}$ = **${pct(reponse, 2)}**. La même loi en √T convertit tous les horizons : vol hebdomadaire × √52, mensuelle × √12 — une seule convention, mémorisée une fois.`,
          },
          {
            titre: en ? 'The rule of 16' : 'La règle de 16',
            contenu: en
              ? `√252 ≈ 16: a desk reads "${pct(volQuot, 2)} a day" as "≈ ${f(r2(volQuot * 16), 1)} % a year" without a calculator. The reflex works both ways — an implied vol of 32 % means the market prices daily moves of about 2 %. This annualised number is the HISTORICAL vol: what the share did. The option screen quotes the IMPLIED: what the market fears next — comparing the two is where volatility trading begins.`
              : `√252 ≈ 16 : un desk lit « ${pct(volQuot, 2)} par jour » comme « ≈ ${f(r2(volQuot * 16), 1)} % par an » sans calculatrice. Le réflexe marche dans les deux sens — une vol implicite de 32 % signifie que le marché price des mouvements quotidiens d'environ 2 %. Ce chiffre annualisé est la vol HISTORIQUE : ce que l'action a fait. L'écran d'options cote l'IMPLICITE : ce que le marché craint pour la suite — comparer les deux, c'est le début du trading de volatilité.`,
          },
        ]
        : [
          {
            titre: en ? 'One unknown: σ' : 'Une seule inconnue : σ',
            contenu: en
              ? `In $C = S\\,N(d_1) - K\\,e^{-rT}\\,N(d_2)$, everything is observable — S = ${f(spot, 0)}, K = ${f(spot, 0)}, r = ${pct(r, 1)}, T = ${f(T)} — except σ. And the Black-Scholes price rises STRICTLY with σ (vega > 0): more agitation, more chances for the option, never fewer. One price therefore corresponds to exactly one volatility — the quote can be INVERTED.`
              : `Dans $C = S\\,N(d_1) - K\\,e^{-rT}\\,N(d_2)$, tout est observable — S = ${f(spot, 0)}, K = ${f(spot, 0)}, r = ${pct(r, 1)}, T = ${f(T)} — sauf σ. Et le prix Black-Scholes monte STRICTEMENT avec σ (vega > 0) : plus d'agitation, plus de chances pour l'option, jamais moins. À un prix correspond donc exactement une volatilité — la cotation peut s'INVERSER.`,
          },
          {
            titre: en ? 'Bracket, then converge' : 'Encadrer, puis converger',
            contenu: en
              ? `No closed formula exists: solve numerically. At σ = ${pct(volImp - 5, 0)}, BS gives ${eur(cBas, 2)}; at σ = ${pct(volImp + 5, 0)}, ${eur(cHaut, 2)}. The quote of ${eur(prime, 2)} sits in between: tighten the bracket (bisection, or a solver) until the price matches — **σ ≈ ${pct(reponse, 2)}**. Every pricing screen does this inversion thousands of times a second.`
              : `Aucune formule fermée n'existe : on résout numériquement. À σ = ${pct(volImp - 5, 0)}, BS donne ${eur(cBas, 2)} ; à σ = ${pct(volImp + 5, 0)}, ${eur(cHaut, 2)}. La cotation de ${eur(prime, 2)} vit entre les deux : resserrez l'encadrement (dichotomie, ou un solveur) jusqu'à retrouver le prix — **σ ≈ ${pct(reponse, 2)}**. Tous les écrans de pricing font cette inversion des milliers de fois par seconde.`,
          },
          {
            titre: en ? 'Prices are read in vol' : 'Le prix se lit en vol',
            contenu: en
              ? `Desks do not quote "${eur(prime, 2)}"; they quote "${f(reponse, 1)} vol". The euro premium mixes moneyness, maturity and rates; the implied vol strips all that and leaves the one number traders disagree about: how much the share will MOVE. Implied vol is the price of future fear — set it against the historical (√252) vol of the same screen, and you know who is buying insurance and who is selling it.`
              : `Les desks ne cotent pas « ${eur(prime, 2)} » ; ils cotent « ${f(reponse, 1)} de vol ». La prime en euros mélange moneyness, maturité et taux ; la vol implicite dépouille tout cela et laisse le seul nombre sur lequel les traders s'opposent : combien l'action va BOUGER. La vol implicite est le prix de la peur future — posez-la face à la vol historique (√252) du même écran, et vous savez qui achète de l'assurance et qui en vend.`,
          },
        ],
      pieges: estAnnu
        ? [
          en
            ? `Multiplying by 252: ${f(volQuot, 2)} % × 252 = ${pct(faux252, 0)} — an absurdity (no share moves by ${f(faux252, 0)} % a year, every year). The factor 252 belongs to the VARIANCE; the volatility, its square root, scales in √252 ≈ ${f(racine252, 2)}.`
            : `Multiplier par 252 : ${f(volQuot, 2)} % × 252 = ${pct(faux252, 0)} — une absurdité (aucune action ne bouge de ${f(faux252, 0)} % par an, tous les ans). Le facteur 252 appartient à la VARIANCE ; la volatilité, sa racine, se convertit en √252 ≈ ${f(racine252, 2)}.`,
          en
            ? `Believing risk grows linearly with the horizon: a 1-year vol is NOT 4 times the 3-month vol, it is 2 times (√4). The √T law is the direct signature of independent increments — the random walk — and it is also why the σ√T term rules every formula of this module.`
            : `Croire que le risque croît linéairement avec l'horizon : la vol à 1 an n'est PAS 4 fois la vol à 3 mois, elle en est 2 fois (√4). La loi en √T est la signature directe des accroissements indépendants — la marche aléatoire — et c'est aussi pourquoi le terme σ√T gouverne toutes les formules de ce module.`,
        ]
        : [
          en
            ? `Confusing implied and historical volatility: the historical (√252 on past returns) MEASURES yesterday; the implied is a PRICE, quoted today for tomorrow's fear. They routinely disagree — before earnings, the implied surges while the historical has not moved — and their gap is a trade, not an error.`
            : `Confondre vol implicite et vol historique : l'historique (√252 sur les rendements passés) MESURE hier ; l'implicite est un PRIX, coté aujourd'hui pour la peur de demain. Elles divergent en permanence — avant des résultats, l'implicite bondit alors que l'historique n'a pas bougé — et leur écart est un trade, pas une erreur.`,
          en
            ? `Hunting for a closed formula of σ: none exists — N(·) cannot be inverted analytically inside Black-Scholes. The implied vol is DEFINED as the numerical solution of BS(σ) = quote; monotonicity (vega > 0) guarantees it is unique, which is what makes it usable as a universal quoting language.`
            : `Chercher une formule fermée de σ : elle n'existe pas — N(·) ne s'inverse pas analytiquement dans Black-Scholes. La vol implicite se DÉFINIT comme la solution numérique de BS(σ) = cotation ; la monotonie (vega > 0) garantit son unicité, et c'est elle qui en fait une langue de cotation universelle.`,
        ],
    };
  },
};

export const exercices: ExerciseGenerator[] = [
  genPayoffEcheance,
  genPnlAcheteur,
  genPnlVendeur,
  genPointsMorts,
  genPariteRetrouverPut,
  genPariteArbitrage,
  genProbaRisqueNeutre,
  genValeurBinomiale,
  genProbaFinirMonnaie,
  genPrixBlackScholes,
  genDeltaOption,
  genDeltaHedgeVendeur,
  genGammaVega,
  genVolatilites,
];
