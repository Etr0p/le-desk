/**
 * Moules de problèmes multi-étapes du module Change, matières premières & crypto
 * — LOT 2 : les niveaux durs. 4 N3 (arbitrage CIP complet, PPA dynamique,
 * producteur qui hedge, couverture en cascade) et 6 boss N4 (défense du peg,
 * carry et rouleau compresseur, 15 janvier 2015, ETF pétrole qui saigne,
 * dépeg de stablecoin, la mine d'or et le board).
 * Chaque moule : 3 scénarios FR + EN, sous-questions chaînées, corrigés calculés
 * via calculs.ts — jamais de texte figé. Les tirages aléatoires ont lieu AVANT
 * toute branche de langue : même seed + même scénario ⇒ mêmes nombres en
 * français et en anglais.
 */
import { formatNombreLangue } from '../../../engine/answers';
import { mulberry32, pick, randFloat, randInt } from '../../../engine/rng';
import type { Langue, ProblemGenerator } from '../../../engine/types';
import {
  forwardCommodity, forwardFx, pnlCarryTrade, pointsDeTerme, rollYieldAnnualise,
  surSousEvaluation, tauxPpa, variationAnnualiseePct,
} from './calculs';

/** Alias local : un « moule » de problème est un ProblemGenerator de l'engine. */
export type ProblemeMoule = ProblemGenerator;

const M6 = '06-change-commos-crypto';
const r0 = (v: number) => Math.round(v);
const r1 = (v: number) => Math.round(v * 10) / 10;
const r2 = (v: number) => Math.round(v * 100) / 100;
const r4 = (v: number) => Math.round(v * 10_000) / 10_000;

/** Petits formateurs liés à la langue (les tirages sont déjà faits quand on les crée). */
function outils(langue: Langue) {
  const en = langue === 'en';
  const f = (v: number, d = 2) => formatNombreLangue(langue, v, d);
  const usd = (v: number, d = 2) => (en ? `$${f(v, d)}` : `${f(v, d)} $`);
  const eur = (v: number, d = 2) => (en ? `€${f(v, d)}` : `${f(v, d)} €`);
  const pct = (v: number, d = 2) => (en ? `${f(v, d)}%` : `${f(v, d)} %`);
  return { en, f, usd, eur, pct };
}

/* ------------------------------------------------------------------ */
/* 11. m6-pb-11 — Arbitrage CIP complet — N3                           */
/* ------------------------------------------------------------------ */
const arbitrageCipComplet: ProblemGenerator = {
  id: 'm6-pb-11', moduleId: M6,
  titre: "Arbitrage CIP : le forward coté qui s'écarte de la parité",
  titreEn: 'CIP arbitrage: when the quoted forward drifts off parity',
  typeDeCas: 'change à terme et arbitrage',
  typeDeCasEn: 'FX forwards and arbitrage',
  difficulte: 3,
  scenarios: ["Desk d'arbitrage d'une banque de la place", 'Trésorier qui contre-vérifie la cote de sa banque', 'Hedge fund fixed income arbitrage en chasse'],
  scenariosEn: ['Arbitrage desk at a major bank', "Treasurer double-checking his bank's quote", 'Fixed-income arbitrage fund on the hunt'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const S = randFloat(rng, 1.05, 1.18, 4);
    const rUsd = randFloat(rng, 3.5, 6, 1);
    const rEur = randFloat(rng, 1, 3, 1);
    const sens = pick(rng, [1, -1] as const);
    const magn = randInt(rng, 55, 120);
    const coutPips = randInt(rng, 8, 100);

    const fTheo = forwardFx(S, rUsd, rEur, 1);
    const fMkt = r4(fTheo + (sens * magn) / 10_000);
    const desal = pointsDeTerme(fTheo, fMkt); // (coté − théorique) × 10 000
    const haut = fMkt > fTheo;
    // Direction A (forward coté trop HAUT) : emprunter 1 M$, vendre spot, placer l'euro, vendre l'euro à terme.
    const detteUsd = 1_000_000 * (1 + rUsd / 100);
    const eurSpotA = 1_000_000 / S;
    const eurTermeA = eurSpotA * (1 + rEur / 100);
    const usdTermeA = eurTermeA * fMkt;
    // Direction B (forward coté trop BAS) : emprunter 1 M€, vendre spot, placer le dollar, racheter l'euro à terme.
    const detteEurB = 1_000_000 * (1 + rEur / 100);
    const usdSpotB = 1_000_000 * S;
    const usdTermeB = usdSpotB * (1 + rUsd / 100);
    const coutRachatB = detteEurB * fMkt;
    const pnlBrut = haut ? usdTermeA - detteUsd : usdTermeB - coutRachatB;
    const eurJambeTerme = haut ? eurTermeA : detteEurB;
    const cout = (coutPips / 10_000) * eurJambeTerme;
    const pnlNet = pnlBrut - cout;
    const survit = pnlNet > 0;
    const repFt = r4(fTheo);
    const repPips = r1(desal);
    const repBrut = r0(pnlBrut);
    const repCout = r0(cout);
    const repNet = r0(pnlNet);

    const { en, f, usd, eur, pct } = outils(langue);
    const desc = en
      ? `spot EUR/USD at ${f(S, 4)}, the one-year dollar rate at ${pct(rUsd, 1)}, the one-year euro rate at ${pct(rEur, 1)}; a market maker quotes the one-year forward at ${f(fMkt, 4)}, and your total friction costs run to ${coutPips} pips on the forward leg`
      : `EUR/USD au comptant à ${f(S, 4)}, taux dollar 1 an à ${pct(rUsd, 1)}, taux euro 1 an à ${pct(rEur, 1)} ; un teneur de marché cote le forward 1 an à ${f(fMkt, 4)}, et vos coûts de friction totaux valent ${coutPips} pips sur la jambe à terme`;
    const contexte = (en
      ? [
        `On the arbitrage desk, the screen blinks: ${desc}. Before committing balance sheet, you run the house discipline — the covered-parity price, the direction of the gap, the four moves of the arbitrage, and the P&L net of frictions. A gap that does not pay its costs is not an arbitrage, it is an anecdote.`,
        `As group treasurer you receive a bank's forward quote for a hedge: ${desc}. Before signing, you rebuild the chapter's machine: what parity demands, how far the quote drifts, what an arbitrageur would pocket — and whether the drift survives real-world frictions.`,
        `Your fixed-income arbitrage fund screens FX forwards all day: ${desc}. The investment memo must show the full chain — theoretical price, misalignment in pips, the four-step arbitrage with its cash flows, and the net P&L that decides whether the trade is typed or skipped.`,
      ]
      : [
        `Au desk d'arbitrage, l'écran clignote : ${desc}. Avant d'engager le bilan, vous déroulez la discipline maison — le prix de la parité couverte, le sens de l'écart, les quatre gestes de l'arbitrage, et le P&L net des frottements. Un écart qui ne paie pas ses coûts n'est pas un arbitrage, c'est une anecdote.`,
        `Trésorier du groupe, vous recevez la cote à terme d'une banque pour une couverture : ${desc}. Avant de signer, vous refaites la machine du chapitre : ce que la parité impose, de combien la cote dérive, ce qu'un arbitragiste empocherait — et si la dérive survit aux frictions du monde réel.`,
        `Votre fonds d'arbitrage passe les forwards FX au crible toute la journée : ${desc}. Le mémo doit montrer la chaîne complète — prix théorique, désalignement en pips, l'arbitrage en quatre étapes avec ses flux, et le P&L net qui décide si le trade part ou non.`,
      ])[sIdx];

    const etapesArb = haut
      ? [
        {
          titre: en ? '① The debt' : '① La dette',
          contenu: en
            ? `The quoted forward overpays the euro: you will SELL euros forward and manufacture them in the money market. Borrow $1,000,000 at ${pct(rUsd, 1)}: debt at maturity = ${usd(r2(detteUsd), 0)}.`
            : `Le forward coté surpaie l'euro : vous allez le VENDRE à terme et le fabriquer par le marché monétaire. Empruntez 1 000 000 $ à ${pct(rUsd, 1)} : dette à l'échéance = ${usd(r2(detteUsd), 0)}.`,
        },
        {
          titre: en ? '② The spot' : '② Le spot',
          contenu: en
            ? `Sell the dollars at spot ${f(S, 4)}: you receive 1,000,000 / ${f(S, 4)} = ${eur(r2(eurSpotA), 0)}.`
            : `Vendez les dollars au comptant à ${f(S, 4)} : vous recevez 1 000 000 / ${f(S, 4)} = ${eur(r2(eurSpotA), 0)}.`,
        },
        {
          titre: en ? '③ The deposit' : '③ Le placement',
          contenu: en
            ? `Place the euros at ${pct(rEur, 1)}: ${eur(r2(eurSpotA), 0)} × ${f(1 + rEur / 100, 3)} = ${eur(r2(eurTermeA), 0)} in one year.`
            : `Placez les euros à ${pct(rEur, 1)} : ${eur(r2(eurSpotA), 0)} × ${f(1 + rEur / 100, 3)} = ${eur(r2(eurTermeA), 0)} dans un an.`,
        },
        {
          titre: en ? '④ The forward — and the P&L' : '④ Le terme — et le P&L',
          contenu: en
            ? `Sell those euros forward TODAY at ${f(fMkt, 4)}: ${eur(r2(eurTermeA), 0)} × ${f(fMkt, 4)} = ${usd(r2(usdTermeA), 0)}. Repay ${usd(r2(detteUsd), 0)}: gross P&L = **${usd(repBrut, 0)}** per million dollars borrowed — no capital, no market risk, every price locked at the start.`
            : `Vendez ces euros à terme DÈS AUJOURD'HUI à ${f(fMkt, 4)} : ${eur(r2(eurTermeA), 0)} × ${f(fMkt, 4)} = ${usd(r2(usdTermeA), 0)}. Remboursez ${usd(r2(detteUsd), 0)} : P&L brut = **${usd(repBrut, 0)}** par million de dollars emprunté — sans capital, sans risque de marché, tous les cours figés au départ.`,
        },
      ]
      : [
        {
          titre: en ? '① The debt' : '① La dette',
          contenu: en
            ? `The quoted forward underpays the euro: you will BUY euros forward and sell the synthetic. Borrow €1,000,000 at ${pct(rEur, 1)}: debt at maturity = ${eur(r2(detteEurB), 0)}.`
            : `Le forward coté sous-paie l'euro : vous allez l'ACHETER à terme et vendre le synthétique. Empruntez 1 000 000 € à ${pct(rEur, 1)} : dette à l'échéance = ${eur(r2(detteEurB), 0)}.`,
        },
        {
          titre: en ? '② The spot' : '② Le spot',
          contenu: en
            ? `Sell the euros at spot ${f(S, 4)}: you receive 1,000,000 × ${f(S, 4)} = ${usd(r2(usdSpotB), 0)}.`
            : `Vendez les euros au comptant à ${f(S, 4)} : vous recevez 1 000 000 × ${f(S, 4)} = ${usd(r2(usdSpotB), 0)}.`,
        },
        {
          titre: en ? '③ The deposit' : '③ Le placement',
          contenu: en
            ? `Place the dollars at ${pct(rUsd, 1)}: ${usd(r2(usdSpotB), 0)} × ${f(1 + rUsd / 100, 3)} = ${usd(r2(usdTermeB), 0)} in one year.`
            : `Placez les dollars à ${pct(rUsd, 1)} : ${usd(r2(usdSpotB), 0)} × ${f(1 + rUsd / 100, 3)} = ${usd(r2(usdTermeB), 0)} dans un an.`,
        },
        {
          titre: en ? '④ The forward — and the P&L' : '④ Le terme — et le P&L',
          contenu: en
            ? `Buy back TODAY, forward at ${f(fMkt, 4)}, the euros of your debt: ${eur(r2(detteEurB), 0)} × ${f(fMkt, 4)} = ${usd(r2(coutRachatB), 0)} to pay. Gross P&L = ${usd(r2(usdTermeB), 0)} − ${usd(r2(coutRachatB), 0)} = **${usd(repBrut, 0)}** per million euros borrowed — locked from day one.`
            : `Rachetez DÈS AUJOURD'HUI à terme, à ${f(fMkt, 4)}, les euros de votre dette : ${eur(r2(detteEurB), 0)} × ${f(fMkt, 4)} = ${usd(r2(coutRachatB), 0)} à payer. P&L brut = ${usd(r2(usdTermeB), 0)} − ${usd(r2(coutRachatB), 0)} = **${usd(repBrut, 0)}** par million d'euros emprunté — verrouillé dès le premier jour.`,
        },
      ];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The theoretical forward' : 'a) Le forward théorique',
          enonce: en
            ? `What one-year forward does covered interest parity impose (4 decimals)?`
            : `Quel forward 1 an la parité couverte impose-t-elle (4 décimales) ?`,
          reponse: repFt, tolerance: 0.001, toleranceMode: 'absolu',
          etapes: [{
            titre: en ? 'Quoted rate up top, base rate below' : 'Taux de la cotée en haut, taux de la base en bas',
            contenu: en
              ? `$F = S \\times \\frac{1 + r_{\\text{quoted}}T}{1 + r_{\\text{base}}T}$ = ${f(S, 4)} × ${f(1 + rUsd / 100, 3)} / ${f(1 + rEur / 100, 3)} = **${f(repFt, 4)}**. Three observable numbers, zero forecast.`
              : `$F = S \\times \\frac{1 + r_{\\text{cotée}}T}{1 + r_{\\text{base}}T}$ = ${f(S, 4)} × ${f(1 + rUsd / 100, 3)} / ${f(1 + rEur / 100, 3)} = **${f(repFt, 4)}**. Trois nombres observables, zéro prévision.`,
          }],
          pieges: [en
            ? `Inverting the ratio — base rate in the numerator — is THE classic mistake: it sends the forward to the wrong side of the spot.`
            : `Inverser le ratio — taux de la base au numérateur — est LA faute classique : elle envoie le forward du mauvais côté du spot.`],
        },
        {
          intitule: en ? 'b) The misalignment' : 'b) Le désalignement',
          enonce: en
            ? `In pips, how far does the quoted forward sit from the theoretical one (positive = quoted above)?`
            : `En pips, de combien le forward coté s'écarte-t-il du théorique (positif = coté au-dessus) ?`,
          reponse: repPips, tolerance: 2, toleranceMode: 'absolu', unite: 'pips',
          etapes: [{
            titre: en ? 'Measure, then read the direction' : "Mesurer, puis lire le sens",
            contenu: en
              ? `(${f(fMkt, 4)} − ${f(fTheo, 4)}) × 10,000 = **${f(repPips, 1)} pips**. ${haut ? 'Quoted ABOVE parity: the forward euro sells too rich — you sell it forward and manufacture it at spot.' : 'Quoted BELOW parity: the forward euro is too cheap — you buy it forward and sell the synthetic built in the money market.'}`
              : `(${f(fMkt, 4)} − ${f(fTheo, 4)}) × 10 000 = **${f(repPips, 1)} pips**. ${haut ? 'Coté AU-DESSUS de la parité : l\'euro à terme se vend trop cher — on le vend à terme et on le fabrique au comptant.' : 'Coté EN DESSOUS de la parité : l\'euro à terme est trop bon marché — on l\'achète à terme et on vend le synthétique fabriqué au marché monétaire.'}`,
          }],
          pieges: [en
            ? `Comparing the quote to the SPOT measures the forward points, not the mispricing: the benchmark is the theoretical forward, never the spot.`
            : `Comparer la cote au SPOT mesure les points de terme, pas l'anomalie : la référence est le forward théorique, jamais le comptant.`],
        },
        {
          intitule: en ? 'c) The arbitrage, played in four moves' : "c) L'arbitrage déroulé en quatre gestes",
          enonce: en
            ? (haut
              ? `Per million dollars borrowed, what gross P&L does the arbitrage lock in at maturity, in dollars?`
              : `Per million euros borrowed, what gross P&L does the arbitrage lock in at maturity, in dollars?`)
            : (haut
              ? `Par million de dollars emprunté, quel P&L brut l'arbitrage verrouille-t-il à l'échéance, en dollars ?`
              : `Par million d'euros emprunté, quel P&L brut l'arbitrage verrouille-t-il à l'échéance, en dollars ?`),
          reponse: repBrut, tolerance: 0.005, unite: '$',
          etapes: etapesArb,
          pieges: [en
            ? `Buying spot and "waiting for the forward to be right" is a speculation, not an arbitrage: the four legs must all be locked on day one.`
            : `Acheter au comptant et « attendre que le forward ait raison » est une spéculation, pas un arbitrage : les quatre jambes doivent toutes être figées au premier jour.`],
        },
        {
          intitule: en ? 'd) The friction bill' : 'd) La facture de friction',
          enonce: en
            ? `At ${coutPips} pips of total costs on the forward leg, what does the friction cost in dollars?`
            : `À ${coutPips} pips de coûts totaux sur la jambe à terme, combien la friction coûte-t-elle, en dollars ?`,
          reponse: repCout, tolerance: 0.01, unite: '$',
          etapes: [{
            titre: en ? 'A pip is 0.0001 dollar per euro traded' : 'Un pip vaut 0,0001 dollar par euro traité',
            contenu: en
              ? `Forward leg notional = ${eur(r2(eurJambeTerme), 0)}; cost = ${eur(r2(eurJambeTerme), 0)} × ${coutPips} × 0.0001 = **${usd(repCout, 0)}**. Rule of thumb: one pip on one million euros is one hundred dollars.`
              : `Notionnel de la jambe à terme = ${eur(r2(eurJambeTerme), 0)} ; coût = ${eur(r2(eurJambeTerme), 0)} × ${coutPips} × 0,0001 = **${usd(repCout, 0)}**. Règle d'or : un pip sur un million d'euros vaut cent dollars.`,
          }],
        },
        {
          intitule: en ? 'e) The net P&L — does the arbitrage survive?' : "e) Le P&L net — l'arbitrage survit-il ?",
          enonce: en
            ? `Net of frictions, what P&L remains, in dollars (negative if the costs eat the gap)?`
            : `Net des frictions, quel P&L reste-t-il, en dollars (négatif si les coûts mangent l'écart) ?`,
          reponse: repNet, tolerance: 150, toleranceMode: 'absolu', unite: '$',
          etapes: [
            {
              titre: en ? 'Gross minus friction' : 'Le brut moins la friction',
              contenu: en
                ? `Net P&L = ${usd(repBrut, 0)} − ${usd(repCout, 0)} = **${usd(repNet, 0)}** per million. ${survit ? 'The arbitrage survives: type the ticket.' : 'The friction eats the whole gap: there is nothing to trade.'}`
                : `P&L net = ${usd(repBrut, 0)} − ${usd(repCout, 0)} = **${usd(repNet, 0)}** par million. ${survit ? 'L\'arbitrage survit : le ticket part.' : 'La friction mange tout l\'écart : il n\'y a rien à trader.'}`,
            },
            {
              titre: en ? 'The market lesson' : 'La leçon de marché',
              contenu: en
                ? `${survit
                  ? `Dozens of desks will spot the same flaw within seconds: the rush itself drags the quote back to ${f(repFt, 4)} — the arbitrage price is the only one at which nobody has anything left to gain.`
                  : `A real but untradeable gap is exactly where the post-2008 world lives: the cross-currency basis persists because closing it consumes bank balance sheet, and balance sheet is a scarce, billed resource. Parity remains the reference; its breaches are a funding-stress thermometer.`}`
                : `${survit
                  ? `Des dizaines de desks logeront la même faille en quelques secondes : la ruée elle-même ramène la cote vers ${f(repFt, 4)} — le prix d'arbitrage est le seul auquel personne n'a plus rien à gagner.`
                  : `Un écart réel mais intradable, c'est exactement le monde d'après 2008 : le cross-currency basis persiste parce que le refermer consomme du bilan bancaire, et le bilan est une ressource rare et facturée. La parité reste la référence ; ses entorses sont un thermomètre du stress de financement.`}`,
            },
          ],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 12. m6-pb-12 — Désinflation et PPA dynamique — N3                   */
/* ------------------------------------------------------------------ */
const ppaDynamique: ProblemGenerator = {
  id: 'm6-pb-12', moduleId: M6,
  titre: 'PPA dynamique : deux inflations, une parité qui marche',
  titreEn: 'Dynamic PPP: two inflations, one walking parity',
  typeDeCas: 'parités économiques',
  typeDeCasEn: 'economic parities',
  difficulte: 3,
  scenarios: ['Économiste de banque centrale devant le comité', "Stratège FX qui rédige l'outlook annuel", 'Grand oral : PPA contre forward'],
  scenariosEn: ['Central-bank economist before the committee', 'FX strategist writing the annual outlook', 'Final viva: PPP versus forward'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const prixUs = randFloat(rng, 5.2, 6.4, 2);
    const prixEur = randFloat(rng, 4.4, 5.6, 2);
    const S0 = randFloat(rng, 1.02, 1.16, 4);
    const piUs = randFloat(rng, 3, 6, 1);
    const piEur = randFloat(rng, 0.8, 2.5, 1);
    const N = randInt(rng, 3, 5);
    const rUsd = randFloat(rng, 3.5, 5.5, 1);
    const rEur = randFloat(rng, 1.5, 3, 1);

    const ppa0 = tauxPpa(prixUs, prixEur);
    const ecart0 = surSousEvaluation(S0, ppa0);
    // Composition année par année : on inflate les deux paniers et on relit la PPA chaque année.
    const chemin: number[] = [];
    let pUs = prixUs;
    let pEur = prixEur;
    for (let t = 0; t < N; t++) {
      pUs *= 1 + piUs / 100;
      pEur *= 1 + piEur / 100;
      chemin.push(tauxPpa(pUs, pEur));
    }
    const ppaN = chemin[chemin.length - 1];
    const fwdN = forwardFx(S0, rUsd, rEur, N);
    const ratioAnnuel = (1 + piUs / 100) / (1 + piEur / 100);
    const ecartFP = (fwdN / ppaN - 1) * 100;
    const sousEvaluee = ecart0 < 0;
    const repPpa0 = r4(ppa0);
    const repEcart0 = r2(ecart0);
    const repPpaN = r4(ppaN);
    const repFwdN = r4(fwdN);
    const repEcartFP = r2(ecartFP);

    const { en, f, usd, eur, pct } = outils(langue);
    const desc = en
      ? `the reference basket costs ${usd(prixUs)} in the United States and ${eur(prixEur)} in the euro area; spot EUR/USD trades at ${f(S0, 4)}; expected inflation runs at ${pct(piUs, 1)} a year on the American side and ${pct(piEur, 1)} on the euro side over ${N} years; the ${N}-year rates stand at ${pct(rUsd, 1)} in dollars and ${pct(rEur, 1)} in euros`
      : `le panier de référence coûte ${usd(prixUs)} aux États-Unis et ${eur(prixEur)} en zone euro ; le spot EUR/USD cote ${f(S0, 4)} ; les inflations attendues valent ${pct(piUs, 1)} par an côté américain et ${pct(piEur, 1)} côté euro sur ${N} ans ; les taux à ${N} ans ressortent à ${pct(rUsd, 1)} en dollar et ${pct(rEur, 1)} en euro`;
    const contexte = (en
      ? [
        `Before the monetary policy committee, you must say where the exchange rate "should" be — today and in ${N} years: ${desc}. The discipline: today's PPP, the spot's gap to it, the PPP pushed forward year by year by the inflation differential, the CIP forward over the same horizon — and what each of the two numbers actually claims.`,
        `Annual outlook season: your FX strategy note opens on the long-run anchors: ${desc}. Clients will quote your PPP path for years, so you build it cleanly — compounded annually, not approximated — then set it against the forward the market will actually trade.`,
        `The examiner smiles: "PPP says one thing, the forward another — which one predicts the exchange rate?" The data: ${desc}. You will only survive the question by computing both properly and explaining why their disagreement is not a contradiction.`,
      ]
      : [
        `Devant le comité de politique monétaire, vous devez dire où le change « devrait » être — aujourd'hui et dans ${N} ans : ${desc}. La discipline : la PPA du jour, l'écart du spot à cette parité, la PPA poussée année après année par le différentiel d'inflation, le forward CIP au même horizon — et ce que chacun des deux nombres prétend vraiment.`,
        `Saison de l'outlook annuel : votre note de stratégie FX s'ouvre sur les ancres de long terme : ${desc}. Les clients citeront votre trajectoire de PPA pendant des années, alors vous la construisez proprement — composée année par année, pas approximée — puis vous la confrontez au forward que le marché traite réellement.`,
        `L'examinateur sourit : « la PPA dit une chose, le forward une autre — lequel prédit le change ? » Les données : ${desc}. Vous ne survivrez à la question qu'en calculant les deux proprement et en expliquant pourquoi leur désaccord n'est pas une contradiction.`,
      ])[sIdx];

    const cheminTxt = chemin.map((v, i) => `PPA${en ? '' : ''}₍${i + 1}₎ = ${f(r4(v), 4)}`).join(' ; ');

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? "a) Today's PPP" : "a) La PPA d'aujourd'hui",
          enonce: en
            ? `What PPP exchange rate equalises the price of the basket (4 decimals)?`
            : `Quel taux de change PPA égalise le prix du panier (4 décimales) ?`,
          reponse: repPpa0, tolerance: 0.002, toleranceMode: 'absolu',
          etapes: [{
            titre: en ? 'Quoted-currency price over base-currency price' : 'Prix en devise cotée sur prix en devise de base',
            contenu: en
              ? `$PPA = P^*/P$ = ${f(prixUs)} / ${f(prixEur)} = **${f(repPpa0, 4)}** dollars per euro — the rate at which the basket costs the same on both sides, homogeneous with the BASE/QUOTED quote.`
              : `$PPA = P^*/P$ = ${f(prixUs)} / ${f(prixEur)} = **${f(repPpa0, 4)}** dollars par euro — le taux auquel le panier coûte pareil des deux côtés, homogène à la cotation BASE/COTÉE.`,
          }],
          pieges: [en
            ? `Dividing the euro price by the dollar price quotes USD/EUR, not EUR/USD: the ratio must be homogeneous with the pair you compare it to.`
            : `Diviser le prix en euros par le prix en dollars cote du USD/EUR, pas de l'EUR/USD : le ratio doit être homogène à la paire qu'on lui compare.`],
        },
        {
          intitule: en ? "b) The spot's gap to parity" : "b) L'écart du spot à la parité",
          enonce: en
            ? `By how much does the spot deviate from PPP, in % (negative = the base currency is undervalued)?`
            : `De combien le spot s'écarte-t-il de la PPA, en % (négatif = la devise de base est sous-évaluée) ?`,
          reponse: repEcart0, tolerance: 0.3, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The direction is where marks are lost' : 'Le sens, là où les copies se perdent',
            contenu: en
              ? `Gap = (${f(S0, 4)} / ${f(repPpa0, 4)} − 1) × 100 = **${pct(repEcart0)}**. ${sousEvaluee
                ? `Spot below parity: one euro buys ${f(S0, 4)} dollars where the basket would justify ${f(repPpa0, 4)} — the euro (base) is UNDERVALUED, the dollar symmetrically overvalued.`
                : `Spot above parity: one euro buys ${f(S0, 4)} dollars where the basket would justify only ${f(repPpa0, 4)} — the euro (base) is OVERVALUED, the dollar symmetrically undervalued.`}`
              : `Écart = (${f(S0, 4)} / ${f(repPpa0, 4)} − 1) × 100 = **${pct(repEcart0)}**. ${sousEvaluee
                ? `Spot sous la parité : 1 euro n'achète que ${f(S0, 4)} dollar là où le panier en justifierait ${f(repPpa0, 4)} — l'euro (la base) est SOUS-évalué, le dollar symétriquement surévalué.`
                : `Spot au-dessus de la parité : 1 euro achète ${f(S0, 4)} dollar là où le panier n'en justifierait que ${f(repPpa0, 4)} — l'euro (la base) est SURévalué, le dollar symétriquement sous-évalué.`}`,
          }],
        },
        {
          intitule: en ? `c) The PPP in ${N} years` : `c) La PPA dans ${N} ans`,
          enonce: en
            ? `Compounding the two inflations year by year, where does PPP stand in ${N} years (4 decimals)?`
            : `En composant les deux inflations année par année, où se situe la PPA dans ${N} ans (4 décimales) ?`,
          reponse: repPpaN, tolerance: 0.003, toleranceMode: 'absolu',
          etapes: [
            {
              titre: en ? 'One year of relative PPP' : 'Une année de PPA relative',
              contenu: en
                ? `Each year, both basket prices inflate and the parity moves by their ratio: $\\frac{1+\\pi_{US}}{1+\\pi_{EUR}}$ = ${f(1 + piUs / 100, 3)} / ${f(1 + piEur / 100, 3)} = ${f(r4(ratioAnnuel), 4)} — American inflation running hotter erodes the dollar's parity value, so the EUR/USD PPP RISES.`
                : `Chaque année, les deux paniers s'inflatent et la parité bouge de leur ratio : $\\frac{1+\\pi_{US}}{1+\\pi_{EUR}}$ = ${f(1 + piUs / 100, 3)} / ${f(1 + piEur / 100, 3)} = ${f(r4(ratioAnnuel), 4)} — l'inflation américaine plus chaude érode la valeur de parité du dollar, donc la PPA EUR/USD MONTE.`,
            },
            {
              titre: en ? 'Walked year by year' : 'Déroulée année par année',
              contenu: en
                ? `${cheminTxt} ⇒ in ${N} years, PPP = **${f(repPpaN, 4)}**. Compounded, never multiplied by N: ${N} years of differential are a power, not a sum.`
                : `${cheminTxt} ⇒ dans ${N} ans, PPA = **${f(repPpaN, 4)}**. Composée, jamais multipliée par N : ${N} années de différentiel sont une puissance, pas une somme.`,
            },
          ],
          pieges: [en
            ? `Adding the inflation differential N times (${f(r2((piUs - piEur) * N), 1)}% in one go) overstates the drift: the correction is geometric.`
            : `Additionner N fois le différentiel d'inflation (${f(r2((piUs - piEur) * N), 1)} % d'un coup) exagère la dérive : la correction est géométrique.`],
        },
        {
          intitule: en ? `d) The CIP forward at ${N} years` : `d) Le forward CIP à ${N} ans`,
          enonce: en
            ? `Under the course's simple-linear convention, what ${N}-year forward does covered parity give (4 decimals)?`
            : `Avec la convention linéaire simple du cours, quel forward à ${N} ans la parité couverte donne-t-elle (4 décimales) ?`,
          reponse: repFwdN, tolerance: 0.003, toleranceMode: 'absolu',
          etapes: [{
            titre: en ? 'Arbitrage arithmetic, stretched to N years' : "L'arithmétique d'arbitrage, étirée à N ans",
            contenu: en
              ? `$F = S_0 \\times \\frac{1 + r_{\\$}N}{1 + r_{€}N}$ = ${f(S0, 4)} × ${f(1 + (rUsd / 100) * N, 3)} / ${f(1 + (rEur / 100) * N, 3)} = **${f(repFwdN, 4)}**. The dollar pays more, so the euro quotes at a premium forward — carry neutralised, nothing forecast.`
              : `$F = S_0 \\times \\frac{1 + r_{\\$}N}{1 + r_{€}N}$ = ${f(S0, 4)} × ${f(1 + (rUsd / 100) * N, 3)} / ${f(1 + (rEur / 100) * N, 3)} = **${f(repFwdN, 4)}**. Le dollar rémunère plus, donc l'euro cote en report à terme — portage neutralisé, rien de prédit.`,
          }],
        },
        {
          intitule: en ? 'e) Forward against future PPP — who "predicts" what?' : 'e) Forward contre PPA future — qui « prédit » quoi ?',
          enonce: en
            ? `By how much does the ${N}-year forward deviate from the ${N}-year PPP, in % of the PPP?`
            : `De combien le forward à ${N} ans s'écarte-t-il de la PPA à ${N} ans, en % de la PPA ?`,
          reponse: repEcartFP, tolerance: 0.5, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'Two numbers, same horizon' : 'Deux nombres, même horizon',
              contenu: en
                ? `Gap = (${f(repFwdN, 4)} / ${f(repPpaN, 4)} − 1) × 100 = **${pct(repEcartFP)}**.`
                : `Écart = (${f(repFwdN, 4)} / ${f(repPpaN, 4)} − 1) × 100 = **${pct(repEcartFP)}**.`,
            },
            {
              titre: en ? 'Neither is a forecast — and that is the lesson' : "Aucun des deux n'est une prévision — et c'est la leçon",
              contenu: en
                ? `The forward is arbitrage arithmetic (chapter 2): it neutralises the rate differential and predicts nothing. PPP is a very-long-run compass: classic studies put the half-life of a gap at three to five years, and Balassa-Samuelson keeps rich-country currencies durably "expensive" against it. The two can point in opposite directions without contradiction — they do not measure the same thing, and quoting either one as "the market's forecast" is the mistake that disqualifies.`
                : `Le forward est de l'arithmétique d'arbitrage (chapitre 2) : il neutralise le différentiel de taux et ne prédit rien. La PPA est une boussole de très long terme : les études classiques donnent trois à cinq ans de demi-vie à un écart, et Balassa-Samuelson maintient les devises des pays riches durablement « chères » face à elle. Les deux peuvent pointer dans des directions opposées sans contradiction — ils ne mesurent pas la même chose, et citer l'un ou l'autre comme « la prévision du marché » est le contresens qui disqualifie.`,
            },
          ],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 13. m6-pb-13 — Le producteur qui hedge — N3                         */
/* ------------------------------------------------------------------ */
const producteurHedge: ProblemGenerator = {
  id: 'm6-pb-13', moduleId: M6,
  titre: 'Vendre sa production à terme : le hedge, le regret et la prime',
  typeDeCas: 'couverture producteur',
  titreEn: 'Selling production forward: the hedge, the regret and the premium',
  typeDeCasEn: 'producer hedging',
  difficulte: 3,
  scenarios: ["Directeur financier d'un producteur indépendant", "Risk manager d'une compagnie pétrolière nationale", 'Négociant qui conseille un producteur'],
  scenariosEn: ['CFO of an independent producer', 'Risk manager of a national oil company', 'Trader advising a producer'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const Qk = randInt(rng, 150, 400); // milliers de barils
    const S = randFloat(rng, 68, 95, 2);
    const fin = randFloat(rng, 2, 3.5, 1);
    const stock = randFloat(rng, 0.8, 1.6, 1);
    const conv = r1(fin + stock + randFloat(rng, 2, 5, 1)); // convenience dominante ⇒ backwardation
    const spotBas = r2(S * randFloat(rng, 0.78, 0.9, 3));
    const spotHaut = r2(S * randFloat(rng, 1.08, 1.22, 3));

    const Q = Qk * 1000;
    const F = forwardCommodity(S, fin, stock, conv, 1);
    const portageNet = fin + stock - conv; // négatif
    const revenuLockM = (Q * F) / 1e6;
    const gainBasM = (Q * (F - spotBas)) / 1e6;
    const regretHautM = (Q * (F - spotHaut)) / 1e6;
    const espSpot = (spotBas + spotHaut) / 2;
    const prime = espSpot - F;
    const primePos = prime > 0;
    const repF = r2(F);
    const repLock = r2(revenuLockM);
    const repGainBas = r2(gainBasM);
    const repRegret = r2(regretHautM);
    const repPrime = r2(prime);

    const { en, f, usd, pct } = outils(langue);
    const desc = en
      ? `${f(Qk, 0)} thousand barrels deliverable in one year, spot at ${usd(S)} a barrel, financing at ${pct(fin, 1)}, storage at ${pct(stock, 1)} and a convenience yield of ${pct(conv, 1)}; the two landing scenarios your economist hands you for the spot in one year: ${usd(spotBas)} or ${usd(spotHaut)}, equally likely`
      : `${f(Qk, 0)} milliers de barils livrables dans un an, un spot à ${usd(S)} le baril, un financement à ${pct(fin, 1)}, un stockage à ${pct(stock, 1)} et une convenience yield de ${pct(conv, 1)} ; les deux scénarios d'atterrissage que votre économiste vous tend pour le spot dans un an : ${usd(spotBas)} ou ${usd(spotHaut)}, équiprobables`;
    const contexte = (en
      ? [
        `As CFO of an independent producer, your bankers want next year's revenue secured before they extend the credit line: ${desc}. You price the forward off the curve, lock the revenue, then face the question every hedger dreads: what will the hedge have "cost" in each scenario — and who pockets the difference on average?`,
        `Risk manager of a national company, you present the hedging programme to the board: ${desc}. The presentation must show the locked revenue, the hedge's P&L in the bad scenario AND in the good one — because the board only remembers the second — and the implicit premium the desk keeps calling "the price of sleep".`,
        `Advising a producer, you must sell more than a price — an explanation: ${desc}. You walk the client through the backwardated curve, the revenue a forward sale locks, the two faces of the hedge once the spot lands, and Keynes's old story about who pays whom for carrying risk.`,
      ]
      : [
        `Directeur financier d'un producteur indépendant, vos banquiers veulent le revenu de l'an prochain sécurisé avant d'étendre la ligne de crédit : ${desc}. Vous lisez le forward sur la courbe, verrouillez le revenu, puis affrontez la question que tout hedger redoute : qu'aura « coûté » la couverture dans chaque scénario — et qui empoche la différence en moyenne ?`,
        `Risk manager d'une compagnie nationale, vous présentez le programme de couverture au conseil : ${desc}. La présentation doit montrer le revenu verrouillé, le P&L du hedge dans le mauvais scénario ET dans le bon — car le conseil ne retient que le second — et la prime implicite que le desk appelle « le prix du sommeil ».`,
        `Conseil d'un producteur, vous devez vendre plus qu'un prix — une explication : ${desc}. Vous déroulez pour le client la courbe en backwardation, le revenu qu'une vente à terme verrouille, les deux visages du hedge une fois le spot atterri, et la vieille histoire de Keynes sur qui paie qui pour porter le risque.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The one-year forward' : 'a) Le forward 1 an',
          enonce: en
            ? `From the cost of carry, what does the one-year forward quote, in dollars a barrel?`
            : `Par le coût de portage, que cote le forward 1 an, en dollars par baril ?`,
          reponse: repF, tolerance: 0.1, toleranceMode: 'absolu', unite: '$',
          etapes: [{
            titre: en ? 'Convenience dominates: the curve inverts' : 'La convenience domine : la courbe s\'inverse',
            contenu: en
              ? `Net carry = ${f(fin, 1)} + ${f(stock, 1)} − ${f(conv, 1)} = ${pct(r1(portageNet), 1)}; $F = S(1 + c \\cdot T)$ = ${f(S)} × ${f(1 + portageNet / 100, 4)} = **${usd(repF)}**. F < S: backwardation — holding the physical NOW is worth a premium over the promise of it later.`
              : `Portage net = ${f(fin, 1)} + ${f(stock, 1)} − ${f(conv, 1)} = ${pct(r1(portageNet), 1)} ; $F = S(1 + c \\cdot T)$ = ${f(S)} × ${f(1 + portageNet / 100, 4)} = **${usd(repF)}**. F < S : backwardation — détenir le physique MAINTENANT vaut une prime sur sa promesse future.`,
          }],
          pieges: [en
            ? `Adding the three costs (${pct(r1(fin + stock + conv), 1)}) forgets that convenience yield REDUCES the carry — it is the dividend of availability, not a cost.`
            : `Additionner les trois coûts (${pct(r1(fin + stock + conv), 1)}) oublie que la convenience yield RÉDUIT le portage — c'est le dividende de disponibilité, pas un coût.`],
        },
        {
          intitule: en ? 'b) The locked revenue' : 'b) Le revenu verrouillé',
          enonce: en
            ? `Selling the whole production forward, what revenue is locked, in millions of dollars?`
            : `En vendant toute la production à terme, quel revenu est verrouillé, en millions de dollars ?`,
          reponse: repLock, tolerance: 0.005, unite: 'M$',
          etapes: [{
            titre: en ? 'Quantity times forward, whatever happens' : 'Quantité fois forward, quoi qu\'il arrive',
            contenu: en
              ? `Revenue = ${f(Qk, 0)},000 × ${f(repF)} = **${usd(repLock)} million**, banked today on paper: the spot can do anything, this line of the budget no longer moves.`
              : `Revenu = ${f(Qk, 0)} 000 × ${f(repF)} = **${f(repLock)} M$**, inscrit au budget dès aujourd'hui : le spot peut faire n'importe quoi, cette ligne ne bouge plus.`,
          }],
        },
        {
          intitule: en ? 'c) The hedge in the bad scenario' : 'c) Le hedge dans le mauvais scénario',
          enonce: en
            ? `If the spot lands at ${usd(spotBas)}, how much MORE does the hedged producer collect than an unhedged one, in millions of dollars?`
            : `Si le spot atterrit à ${usd(spotBas)}, combien le producteur couvert encaisse-t-il de PLUS qu'un producteur nu, en millions de dollars ?`,
          reponse: repGainBas, tolerance: 0.01, unite: 'M$',
          etapes: [{
            titre: en ? 'The insurance pays out' : "L'assurance paie",
            contenu: en
              ? `Gap = ${f(Qk, 0)},000 × (${f(repF)} − ${f(spotBas)}) = **${usd(repGainBas)} million**. The forward sale was the right call — but notice you only know it now: the decision was made under uncertainty, the judgement comes after.`
              : `Écart = ${f(Qk, 0)} 000 × (${f(repF)} − ${f(spotBas)}) = **${f(repGainBas)} M$**. La vente à terme était le bon choix — mais notez que vous ne le savez que maintenant : la décision se prend sous incertitude, le jugement arrive après.`,
          }],
        },
        {
          intitule: en ? "d) The hedger's regret in the good scenario" : 'd) Le regret du hedger dans le bon scénario',
          enonce: en
            ? `If the spot lands at ${usd(spotHaut)}, what does the hedge "cost" against an unhedged producer, in millions of dollars (negative = forgone)?`
            : `Si le spot atterrit à ${usd(spotHaut)}, que « coûte » le hedge face à un producteur nu, en millions de dollars (négatif = manque à gagner) ?`,
          reponse: repRegret, tolerance: 0.01, unite: 'M$',
          etapes: [{
            titre: en ? 'The regret, quantified' : 'Le regret, chiffré',
            contenu: en
              ? `Gap = ${f(Qk, 0)},000 × (${f(repF)} − ${f(spotHaut)}) = **${usd(repRegret)} million** left on the table. This is the number the board will wave at the next meeting — which is exactly why a hedging POLICY must be written before the outcome, not judged after it.`
              : `Écart = ${f(Qk, 0)} 000 × (${f(repF)} − ${f(spotHaut)}) = **${f(repRegret)} M$** laissés sur la table. C'est le chiffre que le conseil brandira à la prochaine réunion — raison exacte pour laquelle une POLITIQUE de couverture s'écrit avant le tirage, et ne se juge pas après.`,
          }],
          pieges: [en
            ? `Calling this a "loss" misreads the hedge: the producer collects ${usd(repLock)} million as planned — he lost nothing, he renounced an upside he had chosen not to own.`
            : `Appeler cela une « perte » est un contresens : le producteur encaisse ${f(repLock)} M$ comme prévu — il n'a rien perdu, il a renoncé à un upside qu'il avait choisi de ne pas porter.`],
        },
        {
          intitule: en ? "e) Keynes's premium" : 'e) La prime de Keynes',
          enonce: en
            ? `Taking the two scenarios as equally likely, what risk premium per barrel separates the expected spot from the forward (E[S] − F), in dollars?`
            : `En tenant les deux scénarios pour équiprobables, quelle prime de risque par baril sépare le spot espéré du forward (E[S] − F), en dollars ?`,
          reponse: repPrime, tolerance: 0.15, toleranceMode: 'absolu', unite: '$',
          etapes: [
            {
              titre: en ? 'Expected spot against locked price' : 'Spot espéré contre prix verrouillé',
              contenu: en
                ? `E[S] = (${f(spotBas)} + ${f(spotHaut)}) / 2 = ${usd(r2(espSpot))}; premium = ${f(r2(espSpot))} − ${f(repF)} = **${usd(repPrime)}** a barrel.`
                : `E[S] = (${f(spotBas)} + ${f(spotHaut)}) / 2 = ${usd(r2(espSpot))} ; prime = ${f(r2(espSpot))} − ${f(repF)} = **${usd(repPrime)}** par baril.`,
            },
            {
              titre: en ? 'Normal backwardation, the risk-transfer reading' : 'Normal backwardation, la lecture risk-transfer',
              contenu: en
                ? `${primePos
                  ? `F sits below the expected spot: by selling forward, the producer gives up ${usd(repPrime)} a barrel on average — the insurance premium the speculator on the other side collects for absorbing the risk. That is Keynes's normal backwardation.`
                  : `Here F sits ABOVE the expected spot: on these scenarios the hedger is actually paid to insure himself — a reminder that the premium depends on the balance of hedging pressure, not on a law.`} Mind the exam nuance: normal backwardation compares F to the EXPECTED future spot (unobservable); the backwardation you read on screen compares F to the CURRENT spot. The two are not synonyms.`
                : `${primePos
                  ? `F est sous le spot espéré : en vendant à terme, le producteur abandonne ${f(repPrime)} $ par baril en moyenne — la prime d'assurance que le spéculateur d'en face encaisse pour absorber le risque. C'est le normal backwardation de Keynes.`
                  : `Ici F est AU-DESSUS du spot espéré : sur ces scénarios, le hedger est en fait payé pour s'assurer — rappel que la prime dépend de l'équilibre des pressions de couverture, pas d'une loi.`} Nuance de jury : le normal backwardation compare F au spot futur ESPÉRÉ (inobservable) ; la backwardation lue à l'écran compare F au spot ACTUEL. Les deux ne sont pas synonymes.`,
            },
          ],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 14. m6-pb-14 — Couverture en cascade d'un trésorier — N3            */
/* ------------------------------------------------------------------ */
const cascadeTresorier: ProblemGenerator = {
  id: 'm6-pb-14', moduleId: M6,
  titre: 'La cascade de forwards : trois flux, un taux verrouillé',
  titreEn: 'The forward ladder: three flows, one locked rate',
  typeDeCas: 'couverture de change',
  typeDeCasEn: 'FX hedging',
  difficulte: 3,
  scenarios: ["Trésorier d'un exportateur européen", 'Responsable financements face au comité de trésorerie', "Candidat qui déroule la cascade à l'oral"],
  scenariosEn: ['Treasurer of a European exporter', 'Funding head before the treasury committee', 'Candidate walking the ladder in the viva'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const S = randFloat(rng, 1.05, 1.15, 4);
    const rUsd = randFloat(rng, 3.5, 5.5, 1);
    const rEur = randFloat(rng, 1, 3, 1);
    const M1 = randInt(rng, 4, 16) / 2; // M$ à 3 mois
    const M2 = randInt(rng, 4, 16) / 2; // M$ à 6 mois
    const M3 = randInt(rng, 4, 16) / 2; // M$ à 12 mois

    const F3 = forwardFx(S, rUsd, rEur, 0.25);
    const F6 = forwardFx(S, rUsd, rEur, 0.5);
    const F12 = forwardFx(S, rUsd, rEur, 1);
    const e1 = M1 / F3;
    const e2 = M2 / F6;
    const e3 = M3 / F12;
    const totUsd = M1 + M2 + M3;
    const totEur = e1 + e2 + e3;
    const tauxMoyen = totUsd / totEur;
    const manqueK = (totUsd / S - totEur) * 1000; // k€
    const repF3 = r4(F3);
    const repF12 = r4(F12);
    const repTotEur = r2(totEur);
    const repTaux = r4(tauxMoyen);
    const repManque = r1(manqueK);

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `three incoming dollar payments — $${f(M1, 1)} million in 3 months, $${f(M2, 1)} million in 6 months, $${f(M3, 1)} million in 12 months — a spot EUR/USD at ${f(S, 4)}, a dollar rate of ${pct(rUsd, 1)} and a euro rate of ${pct(rEur, 1)} (flat curves)`
      : `trois encaissements en dollars — ${f(M1, 1)} M$ dans 3 mois, ${f(M2, 1)} M$ dans 6 mois, ${f(M3, 1)} M$ dans 12 mois — un spot EUR/USD à ${f(S, 4)}, un taux dollar à ${pct(rUsd, 1)} et un taux euro à ${pct(rEur, 1)} (courbes plates)`;
    const contexte = (en
      ? [
        `As treasurer of a European exporter, the sales team just signed and the CFO wants every dollar of it locked into euros today: ${desc}. You build the ladder — one forward per flow — then compress it into the two numbers the CFO reads: the average locked rate, and the gap against an imaginary "convert everything at today's spot".`,
        `Before the treasury committee, you defend your hedging slate: ${desc}. The committee never argues with a ladder of forwards, but it always asks the same trap question — "why do we get fewer euros than at the spot?" — and your job is to answer it with arithmetic, not adjectives.`,
        `Viva drill, the treasurer's classic: ${desc}. The examiner wants the three forwards priced off parity, the total locked, the weighted average rate, and the explanation of the gap to the spot that does NOT use the word "forecast".`,
      ]
      : [
        `Trésorier d'un exportateur européen, l'équipe commerciale vient de signer et le DAF veut chaque dollar converti en euros verrouillé dès aujourd'hui : ${desc}. Vous montez la cascade — un forward par flux — puis la compressez dans les deux nombres que lit le DAF : le taux moyen verrouillé, et l'écart face à un imaginaire « tout convertir au comptant d'aujourd'hui ».`,
        `Devant le comité de trésorerie, vous défendez votre plan de couverture : ${desc}. Le comité ne discute jamais une cascade de forwards, mais il pose toujours la même question piège — « pourquoi reçoit-on moins d'euros qu'au spot ? » — et votre travail est d'y répondre par l'arithmétique, pas par des adjectifs.`,
        `Entraînement d'oral, le classique du trésorier : ${desc}. L'examinateur attend les trois forwards lus sur la parité, le total verrouillé, le taux moyen pondéré, et l'explication de l'écart au spot qui n'utilise PAS le mot « prévision ».`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The 3-month forward' : 'a) Le forward 3 mois',
          enonce: en
            ? `What 3-month forward does covered parity give (4 decimals)?`
            : `Quel forward 3 mois la parité couverte donne-t-elle (4 décimales) ?`,
          reponse: repF3, tolerance: 0.001, toleranceMode: 'absolu',
          etapes: [{
            titre: en ? 'T = 0.25 in the parity' : 'T = 0,25 dans la parité',
            contenu: en
              ? `$F_{3m} = S \\times \\frac{1 + r_{\\$} \\cdot 0{,}25}{1 + r_{€} \\cdot 0{,}25}$ = ${f(S, 4)} × ${f(1 + (rUsd / 100) * 0.25, 4)} / ${f(1 + (rEur / 100) * 0.25, 4)} = **${f(repF3, 4)}**. The euro quotes at a small premium already: the dollar pays more.`
              : `$F_{3m} = S \\times \\frac{1 + r_{\\$} \\cdot 0{,}25}{1 + r_{€} \\cdot 0{,}25}$ = ${f(S, 4)} × ${f(1 + (rUsd / 100) * 0.25, 4)} / ${f(1 + (rEur / 100) * 0.25, 4)} = **${f(repF3, 4)}**. L'euro cote déjà en léger report : le dollar rémunère plus.`,
          }],
        },
        {
          intitule: en ? 'b) The 12-month forward' : 'b) Le forward 12 mois',
          enonce: en
            ? `Same machine at one year: what 12-month forward (4 decimals)?`
            : `Même machine à un an : quel forward 12 mois (4 décimales) ?`,
          reponse: repF12, tolerance: 0.001, toleranceMode: 'absolu',
          etapes: [{
            titre: en ? 'The premium grows with the horizon' : 'Le report grandit avec l\'horizon',
            contenu: en
              ? `$F_{12m}$ = ${f(S, 4)} × ${f(1 + rUsd / 100, 4)} / ${f(1 + rEur / 100, 4)} = **${f(repF12, 4)}** (and $F_{6m}$ = ${f(r4(F6), 4)} in between). The further the date, the more carry the forward must neutralise: the ladder of forwards climbs away from the spot.`
              : `$F_{12m}$ = ${f(S, 4)} × ${f(1 + rUsd / 100, 4)} / ${f(1 + rEur / 100, 4)} = **${f(repF12, 4)}** (et $F_{6m}$ = ${f(r4(F6), 4)} entre les deux). Plus la date est lointaine, plus le forward doit neutraliser de portage : la cascade s'écarte du spot.`,
          }],
        },
        {
          intitule: en ? 'c) The euros locked in' : 'c) Les euros verrouillés',
          enonce: en
            ? `Selling each dollar flow at its own forward, how many euros are locked in total, in millions?`
            : `En vendant chaque flux de dollars à son propre forward, combien d'euros sont verrouillés au total, en millions ?`,
          reponse: repTotEur, tolerance: 0.02, toleranceMode: 'absolu', unite: 'M€',
          etapes: [{
            titre: en ? 'One division per rung' : 'Une division par barreau',
            contenu: en
              ? `${f(M1, 1)} / ${f(repF3, 4)} = ${f(r2(e1))} M€; ${f(M2, 1)} / ${f(r4(F6), 4)} = ${f(r2(e2))} M€; ${f(M3, 1)} / ${f(repF12, 4)} = ${f(r2(e3))} M€ ⇒ total = **${f(repTotEur)} M€**. Dollars are the QUOTED currency: to turn them into euros (the base), divide by the EUR/USD rate.`
              : `${f(M1, 1)} / ${f(repF3, 4)} = ${f(r2(e1))} M€ ; ${f(M2, 1)} / ${f(r4(F6), 4)} = ${f(r2(e2))} M€ ; ${f(M3, 1)} / ${f(repF12, 4)} = ${f(r2(e3))} M€ ⇒ total = **${f(repTotEur)} M€**. Le dollar est la devise COTÉE : pour en faire des euros (la base), on DIVISE par le cours EUR/USD.`,
          }],
          pieges: [en
            ? `Multiplying the dollars by the rate is the BASE/QUOTED trap n° 1: at ${f(S, 4)} dollars per euro, $1 buys 1/${f(S, 4)} euro — never ${f(S, 4)} euros.`
            : `Multiplier les dollars par le cours est LE piège n° 1 de la convention BASE/COTÉE : à ${f(S, 4)} dollar par euro, 1 $ achète 1/${f(S, 4)} euro — jamais ${f(S, 4)} euros.`],
        },
        {
          intitule: en ? 'd) The weighted average locked rate' : 'd) Le taux moyen pondéré verrouillé',
          enonce: en
            ? `All flows blended, at what average EUR/USD rate is the year locked (4 decimals)?`
            : `Tous flux confondus, à quel cours EUR/USD moyen l'année est-elle verrouillée (4 décimales) ?`,
          reponse: repTaux, tolerance: 0.001, toleranceMode: 'absolu',
          etapes: [{
            titre: en ? 'Total dollars over total euros' : 'Total des dollars sur total des euros',
            contenu: en
              ? `Average rate = ${f(totUsd, 1)} / ${f(repTotEur)} = **${f(repTaux, 4)}** — a weighted average of the three forwards, weighted by the dollar amounts. This single number is what goes into the budget line.`
              : `Taux moyen = ${f(totUsd, 1)} / ${f(repTotEur)} = **${f(repTaux, 4)}** — une moyenne des trois forwards pondérée par les montants en dollars. C'est ce seul nombre qui entre dans la ligne budgétaire.`,
          }],
        },
        {
          intitule: en ? 'e) The gap to "everything at spot"' : "e) L'écart au « tout au comptant »",
          enonce: en
            ? `Against a fictitious conversion of all the dollars at today's spot, how many thousand euros does the ladder give up?`
            : `Face à une conversion fictive de tous les dollars au comptant d'aujourd'hui, combien de milliers d'euros la cascade abandonne-t-elle ?`,
          reponse: repManque, tolerance: 10, toleranceMode: 'absolu', unite: 'k€',
          etapes: [
            {
              titre: en ? 'Measure the gap' : "Mesurer l'écart",
              contenu: en
                ? `At spot: ${f(totUsd, 1)} / ${f(S, 4)} = ${f(r2(totUsd / S))} M€; locked: ${f(repTotEur)} M€ ⇒ gap = **${f(repManque, 0)} k€**.`
                : `Au comptant : ${f(totUsd, 1)} / ${f(S, 4)} = ${f(r2(totUsd / S))} M€ ; verrouillé : ${f(repTotEur)} M€ ⇒ écart = **${f(repManque, 0)} k€**.`,
            },
            {
              titre: en ? 'Neither a fee nor a forecast' : 'Ni un coût ni une prévision',
              contenu: en
                ? `This gap is the interest-rate differential, nothing else: the dollars do not exist yet, so "converting at spot" is fiction — and whoever carried the dollars unhedged would bear the full FX risk for the same expected differential. The forward neutralises the carry; it rewards no one and predicts nothing. Tell the committee exactly that.`
                : `Cet écart est le différentiel de taux d'intérêt, rien d'autre : les dollars n'existent pas encore, donc « convertir au comptant » est une fiction — et qui porterait les dollars sans couverture subirait tout le risque de change pour le même différentiel espéré. Le forward neutralise le portage ; il ne récompense personne et ne prédit rien. Dites exactement cela au comité.`,
            },
          ],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 15. m6-pb-15 — La défense du peg — BOSS N4                          */
/* ------------------------------------------------------------------ */
const defenseDuPeg: ProblemGenerator = {
  id: 'm6-pb-15', moduleId: M6,
  titre: 'La défense du peg : réserves, taux, et qui craque en premier',
  titreEn: 'Defending the peg: reserves, rates, and who breaks first',
  typeDeCas: 'crise de change',
  typeDeCasEn: 'currency crisis',
  difficulte: 4,
  scenarios: ['Gouverneur sous attaque spéculative', "War room : la nuit avant l'assaut", "Grand oral : l'arithmétique d'une défense de parité"],
  scenariosEn: ['Governor under speculative attack', 'War room: the night before the assault', 'Final viva: the arithmetic of defending a parity'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const R = randInt(rng, 24, 60); // Md$ de réserves
    const D = randFloat(rng, 1.5, 5, 1); // Md$ de sorties par jour
    const dev = randFloat(rng, 8, 18, 1); // % de dévaluation anticipée
    const J = randInt(rng, 5, 15); // jours avant la dévaluation attendue
    const r0Taux = randFloat(rng, 4, 9, 1); // % taux directeur actuel

    const survie = R / D;
    const rStar = (dev / J) * 360;
    const coutJourStar = rStar / 360; // = dev/J
    const portageJ = (J * r0Taux) / 360;
    const gainNet = dev - portageJ;
    const asym = dev / portageJ;
    const reservesMeurent = survie < J;
    const repSurvie = r1(survie);
    const repRStar = r0(rStar);
    const repCoutJour = r2(coutJourStar);
    const repPortageJ = r2(portageJ);
    const repGainNet = r2(gainNet);
    const repAsym = r1(asym);

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `$${f(R, 0)} billion of reserves, outflows of $${f(D, 1)} billion a day, a market pricing a devaluation of ${pct(dev, 1)} within ${J} days, and a policy rate already raised to ${pct(r0Taux, 1)}`
      : `${f(R, 0)} milliards de dollars de réserves, des sorties de ${f(D, 1)} Md$ par jour, un marché qui price une dévaluation de ${pct(dev, 1)} sous ${J} jours, et un taux directeur déjà porté à ${pct(r0Taux, 1)}`;
    const contexte = (en
      ? [
        `You are the governor of the central bank and your currency is pegged to the dollar. The trading floor hands you the sheet: ${desc}. The council meets in an hour; the minister wants to know whether you hold. You run the cold numbers — days of survival, the rate that would make the attack unprofitable, what the attack costs the enemy, what he expects to win — and you answer the only question that matters: who breaks first?`,
        `War room, 2 a.m. The peg has held for nine years; tonight the screens say it may not see ten: ${desc}. Around the table, three camps — spend the reserves, raise the rate, let it go. Before anyone speaks again, you put six numbers on the whiteboard, because in a currency crisis arithmetic argues better than conviction.`,
        `The viva's boss question: "a pegged currency comes under attack — walk me through the defence." The data: ${desc}. The examiner wants the survival clock, the Sweden-1992 rate arithmetic, the speculator's one-way bet quantified, and the verdict — not opinions, divisions.`,
      ]
      : [
        `Vous êtes gouverneur de la banque centrale et votre monnaie est arrimée au dollar. La salle des marchés vous tend la feuille : ${desc}. Le conseil se réunit dans une heure ; le ministre veut savoir si l'on tient. Vous faites froidement les comptes — jours de survie, taux qui rendrait l'attaque non rentable, ce que l'attaque coûte à l'ennemi, ce qu'il espère gagner — et vous répondez à la seule question qui compte : qui craque en premier ?`,
        `War room, 2 h du matin. Le peg tient depuis neuf ans ; cette nuit, les écrans disent qu'il ne verra peut-être pas la dixième année : ${desc}. Autour de la table, trois camps — dépenser les réserves, monter le taux, lâcher. Avant que quiconque ne reparle, vous posez six nombres au tableau, car dans une crise de change l'arithmétique argumente mieux que la conviction.`,
        `La question boss de l'oral : « une monnaie à parité fixe est attaquée — déroulez la défense. » Les données : ${desc}. L'examinateur attend l'horloge de survie, l'arithmétique de taux de la Suède 1992, le pari à sens unique chiffré, et le verdict — pas des opinions, des divisions.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The survival clock' : "a) L'horloge de survie",
          enonce: en
            ? `At the current pace of outflows, how many days do the reserves last?`
            : `Au rythme actuel des sorties, combien de jours les réserves tiennent-elles ?`,
          reponse: repSurvie, tolerance: 0.5, toleranceMode: 'absolu', unite: en ? 'days' : 'jours',
          etapes: [{
            titre: en ? 'Finite ammunition, public count' : 'Munitions finies, décompte public',
            contenu: en
              ? `Survival = ${f(R, 0)} / ${f(D, 1)} = **${f(repSurvie, 1)} days**. Worse: the reserve figures are PUBLISHED — the market watches the fuel gauge with you, and the speculation accelerates as the needle drops. To defend the peg you sell finite reserves; to weaken your currency you could print without limit — the asymmetry of every defence.`
              : `Survie = ${f(R, 0)} / ${f(D, 1)} = **${f(repSurvie, 1)} jours**. Pire : les chiffres de réserves sont PUBLIÉS — le marché lit la jauge de carburant avec vous, et la spéculation accélère à mesure que l'aiguille baisse. Pour défendre le peg, on vend des réserves finies ; pour freiner sa devise, on imprimerait sans limite — l'asymétrie de toute défense.`,
          }],
        },
        {
          intitule: en ? 'b) The defence rate' : 'b) Le taux de défense',
          enonce: en
            ? `For a ${J}-day short to cost exactly the expected devaluation, to what annualised rate (360-day basis) must you push the cost of your currency?`
            : `Pour qu'un short de ${J} jours coûte exactement la dévaluation espérée, à quel taux annualisé (base 360) faut-il porter le loyer de votre monnaie ?`,
          reponse: repRStar, tolerance: 0.01, unite: '%',
          etapes: [{
            titre: en ? 'Sweden 1992, generalised' : 'La Suède 1992, généralisée',
            contenu: en
              ? `The short must pay ${pct(dev, 1)} of carry over ${J} days: daily ${f(dev, 1)}/${J} = ${pct(r2(dev / J))}, annualised × 360 = **${pct(repRStar, 0)}**. The Riksbank pushed its marginal rate to 500% in September 1992 on exactly this arithmetic — and capitulated in November anyway.`
              : `Le short doit payer ${pct(dev, 1)} de portage en ${J} jours : ${f(dev, 1)}/${J} = ${pct(r2(dev / J))} par jour, annualisé × 360 = **${pct(repRStar, 0)}**. La Riksbank a porté son taux marginal à 500 % en septembre 1992 sur exactement cette arithmétique — et a capitulé en novembre quand même.`,
          }],
        },
        {
          intitule: en ? 'c) That rate, per day' : 'c) Ce taux, par jour',
          enonce: en
            ? `At that defence rate, what does one day of shorting your currency cost, in % per day?`
            : `À ce taux de défense, que coûte une journée de short sur votre monnaie, en % par jour ?`,
          reponse: repCoutJour, tolerance: 0.05, toleranceMode: 'absolu', unite: en ? '% / day' : '% / jour',
          etapes: [{
            titre: en ? 'Three-digit rates only bite by the day' : 'Les taux à trois chiffres ne mordent qu\'au jour le jour',
            contenu: en
              ? `${pct(repRStar, 0)} / 360 = **${pct(repCoutJour)} a day** — the 500% ≈ 1.4%/day loop of the course. Dissuasive against a position held for months; barely a toll for a bet that resolves within ${J} days. And a rate at that altitude strangles your banks and borrowers long before it strangles London.`
              : `${pct(repRStar, 0)} / 360 = **${pct(repCoutJour)} par jour** — la boucle « 500 % ≈ 1,4 %/jour » du cours. Dissuasif contre une position de plusieurs mois ; à peine un péage pour un pari qui se dénoue sous ${J} jours. Et un taux à cette altitude asphyxie vos banques et vos emprunteurs bien avant d'asphyxier Londres.`,
          }],
        },
        {
          intitule: en ? "d) The speculator's bill at today's rate" : "d) La facture du spéculateur au taux d'aujourd'hui",
          enonce: en
            ? `At the CURRENT policy rate, what does shorting your currency for ${J} days cost, in % of the position?`
            : `Au taux directeur ACTUEL, que coûte un short de ${J} jours sur votre monnaie, en % de la position ?`,
          reponse: repPortageJ, tolerance: 0.03, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The toll, as it stands' : 'Le péage, en l\'état',
            contenu: en
              ? `Carry = ${J} × ${f(r0Taux, 1)}/360 = **${pct(repPortageJ)}** of the position — the price of a ticket to a possible ${pct(dev, 1)} devaluation. (We neglect the interest his dollars earn meanwhile, which makes the bill even SMALLER.)`
              : `Portage = ${J} × ${f(r0Taux, 1)}/360 = **${pct(repPortageJ)}** de la position — le prix du billet pour une dévaluation possible de ${pct(dev, 1)}. (On néglige les intérêts que ses dollars gagnent pendant ce temps, ce qui rend la facture encore PLUS petite.)`,
          }],
        },
        {
          intitule: en ? "e) The speculator's expected prize" : "e) L'espérance de gain du spéculateur",
          enonce: en
            ? `If the devaluation does come within ${J} days, what does the short net, in % of the position?`
            : `Si la dévaluation survient bien sous ${J} jours, que rapporte le short net du portage, en % de la position ?`,
          reponse: repGainNet, tolerance: 0.1, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The one-way bet' : 'Le pari à sens unique',
            contenu: en
              ? `Net = ${pct(dev, 1)} − ${pct(repPortageJ)} = **${pct(repGainNet)}**. And if the peg holds? He loses only the ${pct(repPortageJ)} of carry. Bounded tiny loss, massive gain: that is the one-way bet — and it recruits new sellers precisely as your reserve gauge drops.`
              : `Net = ${pct(dev, 1)} − ${pct(repPortageJ)} = **${pct(repGainNet)}**. Et si le peg tient ? Il ne perd que les ${pct(repPortageJ)} de portage. Perte bornée et minuscule, gain massif : c'est le pari à sens unique — et il recrute de nouveaux vendeurs exactement à mesure que votre jauge de réserves baisse.`,
          }],
        },
        {
          intitule: en ? 'f) The asymmetry — and who breaks first' : "f) L'asymétrie — et qui craque en premier",
          enonce: en
            ? `How many times bigger is the prize than the carry bill (devaluation ÷ ${J}-day carry at the current rate)?`
            : `Combien de fois le gain dépasse-t-il la facture de portage (dévaluation ÷ portage de ${J} jours au taux actuel) ?`,
          reponse: repAsym, tolerance: 0.01, unite: '×',
          etapes: [
            {
              titre: en ? 'The asymmetry, in one division' : "L'asymétrie, en une division",
              contenu: en
                ? `${pct(dev, 1)} / ${pct(repPortageJ)} = **${f(repAsym, 1)}×**. Risk one to win ${f(repAsym, 0)}: at those odds, the market can mobilise sums that dwarf any war chest — daily FX volume runs near $7,500 billion against your $${f(R, 0)} billion.`
                : `${pct(dev, 1)} / ${pct(repPortageJ)} = **${f(repAsym, 1)}×**. Risquer un pour gagner ${f(repAsym, 0)} : à cette cote, le marché mobilise des montants sans commune mesure avec n'importe quel trésor de guerre — le change traite près de 7 500 Md$ par jour contre vos ${f(R, 0)} Md$.`,
            },
            {
              titre: en ? 'The verdict' : 'Le verdict',
              contenu: en
                ? `${reservesMeurent
                  ? `Your reserves last ${f(repSurvie, 1)} days — the market expects the break within ${J}: the reserves die FIRST, before the bet even expires. `
                  : `Your reserves last ${f(repSurvie, 1)} days, longer than the ${J}-day horizon — so the battlefield shifts to the rate: `}to neutralise the bet you must hold ${pct(repRStar, 0)} annualised, and a three-digit rate strangles banks, mortgages and firms within days — politically untenable, and the market knows it. Rates and reserves only buy time: when fundamentals condemn the parity, the defence is lost in advance (Sweden, November 1992); it only wins when fundamentals stand behind it (Hong Kong, 1997-98). YOU break first — the lesson of the chapter.`
                : `${reservesMeurent
                  ? `Vos réserves tiennent ${f(repSurvie, 1)} jours — le marché attend la rupture sous ${J} : les réserves meurent EN PREMIER, avant même l'échéance du pari. `
                  : `Vos réserves tiennent ${f(repSurvie, 1)} jours, plus que l'horizon de ${J} jours — le champ de bataille se déplace donc sur le taux : `}pour neutraliser le pari il faut tenir ${pct(repRStar, 0)} annualisé, et un taux à trois chiffres étrangle banques, crédits immobiliers et entreprises en quelques jours — politiquement intenable, et le marché le sait. Taux et réserves n'achètent que du temps : quand les fondamentaux condamnent la parité, la défense est perdue d'avance (Suède, novembre 1992) ; elle ne gagne que quand les fondamentaux la soutiennent (Hong Kong, 1997-98). C'est VOUS qui craquez en premier — la leçon du chapitre.`,
            },
          ],
          pieges: [en
            ? `Believing the defence rate "punishes the speculators" reverses the bleeding: they pay it for days, your whole economy pays it everywhere, immediately.`
            : `Croire que le taux de défense « punit les spéculateurs » inverse l'hémorragie : eux le paient quelques jours, votre économie entière le paie partout, immédiatement.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 16. m6-pb-16 — Le carry trade et le rouleau compresseur — BOSS N4   */
/* ------------------------------------------------------------------ */
const carryRouleau: ProblemGenerator = {
  id: 'm6-pb-16', moduleId: M6,
  titre: 'Le carry trade et le rouleau compresseur : trois bonnes années, puis le crash',
  titreEn: 'The carry trade and the steamroller: three good years, then the crash',
  typeDeCas: 'carry trade et levier',
  typeDeCasEn: 'carry trade and leverage',
  difficulte: 4,
  scenarios: ['Gérant du fonds au matin du débouclage', 'Risk manager qui avait écrit le mémo', "Grand oral : l'autopsie d'un carry levié"],
  scenariosEn: ['Fund manager on the morning of the unwind', 'Risk manager who had written the memo', 'Final viva: autopsy of a levered carry'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const E = randInt(rng, 8, 25); // M$ de fonds propres
    const L = randInt(rng, 5, 8); // levier
    const rCible = randFloat(rng, 7.5, 9.5, 1);
    const rFin = randFloat(rng, 0.5, 1.5, 1);
    const diff = rCible - rFin; // 6 à 9 points de portage
    const crash = -randFloat(rng, Math.max(8, diff + 4.5), 15, 1); // décrochage de la devise cible
    const X = pick(rng, [15, 20] as const); // perte max tolérée, % des fonds propres

    const N = E * L; // notionnel M$
    const portageAn = pnlCarryTrade(N * 1e6, rCible, rFin, 0) / 1e6;
    const cumul3 = 3 * portageAn;
    const pnlCrash = pnlCarryTrade(N * 1e6, rCible, rFin, crash) / 1e6;
    const pertePct = (-pnlCrash / E) * 100;
    const restant = E + pnlCrash;
    const appel = (N * (1 + crash / 100)) / L - restant;
    const netUnitaire = diff + crash; // % du notionnel, négatif
    const lMax = X / Math.abs(netUnitaire);
    const repPortage = r2(portageAn);
    const repCumul = r2(cumul3);
    const repCrash = r2(pnlCrash);
    const repPerte = r1(pertePct);
    const repAppel = r2(appel);
    const repLMax = r1(lMax);

    const { en, f, usd, pct } = outils(langue);
    const desc = en
      ? `$${f(E, 0)} million of equity, ×${L} leverage, a target currency paying ${pct(rCible, 1)} funded at ${pct(rFin, 1)}; three calm years (stable FX), then a fourth in which the target currency drops ${pct(Math.abs(crash), 1)}; the mandate caps the tolerable loss at ${X}% of equity`
      : `${f(E, 0)} M$ de fonds propres, un levier de ×${L}, une devise cible qui paie ${pct(rCible, 1)} financée à ${pct(rFin, 1)} ; trois années calmes (change stable), puis une quatrième où la devise cible décroche de ${pct(Math.abs(crash), 1)} ; le mandat plafonne la perte tolérable à ${X} % des fonds propres`;
    const contexte = (en
      ? [
        `You run the fund, and this morning the target currency is in free fall: ${desc}. Investors are calling. Before answering, you reconstruct the whole story on one sheet: what the position earned each calm year, what three years piled up, what last night vaporised, the margin call landing at noon — and the size that would have survived.`,
        `You are the risk manager who wrote, two years ago, the memo nobody read: "the Sharpe ratio of this position is a fiction of calm samples." Today the file is back on top: ${desc}. You redo the arithmetic in front of the partners, line by line, ending with the only number that matters: the leverage that survives the night.`,
        `The examiner slides the case over: "a levered carry fund, three good years, one crash — walk me through it." The data: ${desc}. He wants the carry, the cumulation, the wreck, the loss in % of equity, the margin call, and the inverse sizing — the question every carry trader should have asked BEFORE.`,
      ]
      : [
        `Vous dirigez le fonds, et ce matin la devise cible est en chute libre : ${desc}. Les investisseurs appellent. Avant de répondre, vous reconstituez toute l'histoire sur une feuille : ce que la position gagnait chaque année calme, ce que trois ans ont empilé, ce que la nuit a vaporisé, l'appel de marge qui tombe à midi — et la taille qui aurait survécu.`,
        `Vous êtes le risk manager qui a écrit, il y a deux ans, le mémo que personne n'a lu : « le ratio de Sharpe de cette position est une fiction d'échantillon calme. » Aujourd'hui, le dossier est remonté sur la pile : ${desc}. Vous refaites l'arithmétique devant les associés, ligne à ligne, jusqu'au seul nombre qui compte : le levier qui survit à la nuit.`,
        `L'examinateur glisse le cas : « un fonds de carry levié, trois bonnes années, un crash — déroulez. » Les données : ${desc}. Il attend le portage, le cumul, le naufrage, la perte en % des fonds propres, l'appel de marge, et le sizing inverse — la question que tout carry trader aurait dû poser AVANT.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) One calm year of carry' : 'a) Une année calme de portage',
          enonce: en
            ? `With stable FX, what does the position earn in a calm year, in millions of dollars?`
            : `À change stable, que rapporte la position sur une année calme, en millions de dollars ?`,
          reponse: repPortage, tolerance: 0.005, unite: 'M$',
          etapes: [{
            titre: en ? 'Leverage first, differential next' : "Le levier d'abord, le différentiel ensuite",
            contenu: en
              ? `Notional = ${f(E, 0)} × ${L} = ${usd(N, 0)} million; carry = ${f(N, 0)} × (${f(rCible, 1)} − ${f(rFin, 1)})/100 = **${usd(repPortage)} million** a year — a return of ${pct(r1(diff * L), 1)} on equity. This is the number that raises the assets, and the marketing.`
              : `Notionnel = ${f(E, 0)} × ${L} = ${f(N, 0)} M$ ; portage = ${f(N, 0)} × (${f(rCible, 1)} − ${f(rFin, 1)})/100 = **${f(repPortage)} M$** par an — soit ${pct(r1(diff * L), 1)} de rendement sur fonds propres. C'est le chiffre qui lève les encours, et le marketing.`,
          }],
        },
        {
          intitule: en ? 'b) Three years on the conveyor' : 'b) Trois ans sur le tapis roulant',
          enonce: en
            ? `Without reinvestment, what do three calm years pile up, in millions of dollars?`
            : `Sans réinvestissement, que cumulent trois années calmes, en millions de dollars ?`,
          reponse: repCumul, tolerance: 0.005, unite: 'M$',
          etapes: [{
            titre: en ? 'The seductive sample' : "L'échantillon séducteur",
            contenu: en
              ? `3 × ${f(repPortage)} = **${usd(repCumul)} million** of regular gains, low realised volatility, flattering Sharpe. Everything is true — and everything is misleading: the risk is not in the variance you measured, it is in the jump that is not yet in your sample (module 2).`
              : `3 × ${f(repPortage)} = **${f(repCumul)} M$** de gains réguliers, volatilité réalisée faible, Sharpe flatteur. Tout est vrai — et tout est trompeur : le risque n'est pas dans la variance mesurée, il est dans le saut qui n'est pas encore dans votre échantillon (module 2).`,
          }],
        },
        {
          intitule: en ? 'c) The crash year' : "c) L'année du crash",
          enonce: en
            ? `The target currency drops ${pct(Math.abs(crash), 1)}: what is the year's P&L, in millions of dollars?`
            : `La devise cible décroche de ${pct(Math.abs(crash), 1)} : quel est le P&L de l'année, en millions de dollars ?`,
          reponse: repCrash, tolerance: 0.01, unite: 'M$',
          etapes: [{
            titre: en ? 'The carry formula, with Δ alive' : 'La formule du carry, avec Δ vivant',
            contenu: en
              ? `P&L = ${f(N, 0)} × [(${f(rCible, 1)} − ${f(rFin, 1)})/100 + (${f(crash, 1)})/100] = ${f(N, 0)} × ${f(r4(netUnitaire / 100), 4)} = **${usd(repCrash)} million**. The carry was collected; the FX leg devoured it and kept going — the −40,000 of the course, scaled up by leverage.`
              : `P&L = ${f(N, 0)} × [(${f(rCible, 1)} − ${f(rFin, 1)})/100 + (${f(crash, 1)})/100] = ${f(N, 0)} × ${f(r4(netUnitaire / 100), 4)} = **${f(repCrash)} M$**. Le portage a bien été encaissé ; la jambe de change l'a dévoré et a continué — le −40 000 du cours, à l'échelle du levier.`,
          }],
          pieges: [en
            ? `Applying the ${pct(Math.abs(crash), 1)} to equity instead of notional forgets what leverage IS: the FX move strikes the full ${usd(N, 0)} million.`
            : `Appliquer les ${pct(Math.abs(crash), 1)} aux fonds propres au lieu du notionnel oublie ce qu'EST le levier : le choc de change frappe les ${f(N, 0)} M$ entiers.`],
        },
        {
          intitule: en ? 'd) The wound in % of equity' : 'd) La plaie en % des fonds propres',
          enonce: en
            ? `What fraction of the equity does the crash year burn, in %?`
            : `Quelle fraction des fonds propres l'année de crash brûle-t-elle, en % ?`,
          reponse: repPerte, tolerance: 1, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Leverage as a multiplier of pain' : 'Le levier comme multiplicateur de douleur',
            contenu: en
              ? `Loss = ${f(Math.abs(r2(pnlCrash)), 2)} / ${f(E, 0)} = **${pct(repPerte, 1)}** of equity — the unit loss of ${pct(r1(Math.abs(netUnitaire)), 1)} on the notional, times ${L}. Three years of patient carry (${usd(repCumul)} million) against one night at ${usd(repCrash)} million: the steamroller arithmetic.`
              : `Perte = ${f(Math.abs(r2(pnlCrash)), 2)} / ${f(E, 0)} = **${pct(repPerte, 1)}** des fonds propres — la perte unitaire de ${pct(r1(Math.abs(netUnitaire)), 1)} sur le notionnel, multipliée par ${L}. Trois ans de portage patient (${f(repCumul)} M$) contre une nuit à ${f(repCrash)} M$ : l'arithmétique du rouleau compresseur.`,
          }],
        },
        {
          intitule: en ? 'e) The margin call' : "e) L'appel de marge",
          enonce: en
            ? `The prime broker caps leverage at ×${L}: position marked down, equity burnt, how much cash must be wired in, in millions of dollars?`
            : `Le prime broker plafonne le levier à ×${L} : position dépréciée, fonds propres entamés, combien faut-il virer de cash, en millions de dollars ?`,
          reponse: repAppel, tolerance: 0.2, toleranceMode: 'absolu', unite: 'M$',
          etapes: [{
            titre: en ? 'Both sides of the ratio moved against you' : 'Les deux côtés du ratio ont bougé contre vous',
            contenu: en
              ? `Position after the crash: ${f(N, 0)} × ${f(1 + crash / 100, 3)} = ${f(r2(N * (1 + crash / 100)))} M$, requiring ${f(r2(N * (1 + crash / 100)))}/${L} = ${f(r2((N * (1 + crash / 100)) / L))} M$ of equity; remaining equity = ${f(E, 0)} − ${f(Math.abs(r2(pnlCrash)))} = ${f(r2(restant))} M$ ⇒ call = **${usd(repAppel)} million**. Pay within the day, or be liquidated INTO the falling market — that is how unwinds feed themselves: forced sales push the funding currency up, which deepens everyone else's losses.`
              : `Position après le crash : ${f(N, 0)} × ${f(1 + crash / 100, 3)} = ${f(r2(N * (1 + crash / 100)))} M$, exigeant ${f(r2(N * (1 + crash / 100)))}/${L} = ${f(r2((N * (1 + crash / 100)) / L))} M$ de fonds propres ; fonds restants = ${f(E, 0)} − ${f(Math.abs(r2(pnlCrash)))} = ${f(r2(restant))} M$ ⇒ appel = **${f(repAppel)} M$**. À payer dans la journée, sous peine d'être liquidé DANS le marché qui tombe — c'est ainsi que les débouclages s'auto-alimentent : les ventes forcées font monter la devise de financement, ce qui creuse les pertes des autres porteurs.`,
          }],
        },
        {
          intitule: en ? 'f) The size that would have survived' : 'f) La taille qui aurait survécu',
          enonce: en
            ? `To cap the crash-year loss at ${X}% of equity, what maximum leverage should have been run?`
            : `Pour plafonner la perte de l'année de crash à ${X} % des fonds propres, quel levier maximal fallait-il porter ?`,
          reponse: repLMax, tolerance: 0.3, toleranceMode: 'absolu', unite: '×',
          etapes: [
            {
              titre: en ? 'Inverse sizing: start from the worst day' : 'Le sizing inverse : partir du pire jour',
              contenu: en
                ? `Loss in % of equity = L × |carry + Δ| ⇒ $L_{max}$ = ${X} / ${f(r1(Math.abs(netUnitaire)), 1)} = **×${f(repLMax, 1)}**, against the ×${L} you ran. Position size is derived from the scenario that kills, never from the return you covet.`
                : `Perte en % des fonds propres = L × |portage + Δ| ⇒ $L_{max}$ = ${X} / ${f(r1(Math.abs(netUnitaire)), 1)} = **×${f(repLMax, 1)}**, contre le ×${L} que vous portiez. La taille d'une position se déduit du scénario qui tue, jamais du rendement qu'on convoite.`,
            },
            {
              titre: en ? 'The lesson: skewness prices the seats' : 'La leçon : la skewness fixe le prix des places',
              contenu: en
                ? `The carry collects coins in front of a steamroller: negative skewness, fat tails, and the crash lands in risk-off — exactly when everything else in the book bleeds too (2008, August 2024). The calm-sample Sharpe ratio measured the coins and never saw the steamroller; sizing by ${X}% of equity on the crash scenario is how you survive long enough to collect anything at all.`
                : `Le carry ramasse des pièces devant un rouleau compresseur : skewness négative, queues épaisses, et le crash tombe en régime risk-off — exactement quand tout le reste du livre saigne aussi (2008, août 2024). Le Sharpe d'échantillon calme mesurait les pièces et n'a jamais vu le rouleau ; dimensionner à ${X} % des fonds propres sur le scénario de crash est ce qui permet de survivre assez longtemps pour ramasser quoi que ce soit.`,
            },
          ],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 17. m6-pb-17 — 15 janvier 2015 : le courtier FX — BOSS N4           */
/* ------------------------------------------------------------------ */
const quinzeJanvier: ProblemGenerator = {
  id: 'm6-pb-17', moduleId: M6,
  titre: '15 janvier 2015 : le jour où votre marge de 2 % a menti',
  titreEn: 'January 15, 2015: the day your 2% margin lied',
  typeDeCas: 'risque de gap et courtage',
  typeDeCasEn: 'gap risk and brokerage',
  difficulte: 4,
  scenarios: ['Directeur du courtier FX à 10 h 31', 'Liquidateur qui reconstitue la matinée', 'Grand oral : pourquoi les stops n\'ont servi à rien'],
  scenariosEn: ['CEO of the FX broker at 10:31 a.m.', 'Liquidator reconstructing the morning', 'Final viva: why the stops were useless'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const nClients = randInt(rng, 150, 600);
    const posK = randInt(rng, 40, 200); // k€ de notionnel moyen par client
    const gap = randFloat(rng, 15, 22, 1); // % de chute sans cotation
    const C = randFloat(rng, 3, 15, 1); // M€ de fonds propres du courtier
    const rev = randInt(rng, 300, 900); // € de revenu annuel moyen par client

    const pos = posK * 1000;
    const margeClient = pos * 0.02;
    const perteClient = (pos * gap) / 100;
    const soldeNeg = perteClient - margeClient;
    const perteTotaleM = (nClients * soldeNeg) / 1e6;
    const restant = C - perteTotaleM;
    const annees = (perteTotaleM * 1e6) / (nClients * rev);
    const faillite = restant < 0;
    const niveauApres = r4(1.2 * (1 - gap / 100));
    const repMarge = r0(margeClient);
    const repPerteCl = r0(perteClient);
    const repSolde = r0(soldeNeg);
    const repTotale = r2(perteTotaleM);
    const repRestant = r2(restant);
    const repAnnees = r1(annees);

    const { en, f, eur, pct } = outils(langue);
    const desc = en
      ? `${f(nClients, 0)} clients long EUR/CHF with an average notional of ${eur(pos, 0)} each, a required margin of 2%, a rate gapping from 1.2000 to ${f(niveauApres, 4)} (${pct(-gap, 1)}) without a single intermediate quote, ${eur(C, 1)} million of broker equity and an average revenue of ${eur(rev, 0)} per client per year`
      : `${f(nClients, 0)} clients long EUR/CHF pour un notionnel moyen de ${f(pos, 0)} € chacun, une marge requise de 2 %, un cours qui saute de 1,2000 à ${f(niveauApres, 4)} (${pct(-gap, 1)}) sans une seule cotation intermédiaire, ${f(C, 1)} M€ de fonds propres du courtier et un revenu moyen de ${f(rev, 0)} € par client et par an`;
    const contexte = (en
      ? [
        `10:30 a.m., January 15, 2015. The SNB abandons the 1.20 floor; your retail FX brokerage carries ${desc}. At 10:31 your risk screen is a wall of red and the stops have executed nothing — there was no price to execute at. Before calling the regulator, you compute what every broker computed that morning: client losses, negative balances, the hole, and whether the firm sees the evening.`,
        `Months later, as liquidator, you reconstruct the morning minute by minute: ${desc}. The file must establish the chain — margins held, losses gapped, balances gone negative, the loss socialised onto the broker — and conclude on the only structural question: could ANY margin model built on the peg's quiet history have held?`,
        `The viva's killer case: "January 15, 2015 — a broker's book, in numbers." The data: ${desc}. The examiner wants the per-client arithmetic, the aggregation, the equity verdict, and the distributional lesson: what a pegged price's history does NOT contain.`,
      ]
      : [
        `10 h 30, 15 janvier 2015. La BNS abandonne le plancher de 1,20 ; votre courtage FX de détail porte ${desc}. À 10 h 31, votre écran de risque est un mur rouge et les stops n'ont rien exécuté — il n'y avait aucun prix où exécuter. Avant d'appeler le régulateur, vous calculez ce que tous les courtiers ont calculé ce matin-là : pertes clients, soldes négatifs, le trou, et si la maison voit le soir.`,
        `Des mois plus tard, liquidateur, vous reconstituez la matinée minute par minute : ${desc}. Le dossier doit établir la chaîne — marges détenues, pertes en gap, soldes passés négatifs, la perte socialisée sur le courtier — et conclure sur la seule question structurelle : un modèle de marge bâti sur l'historique tranquille du peg pouvait-il tenir ?`,
        `Le cas tueur de l'oral : « 15 janvier 2015 — le livre d'un courtier, en chiffres. » Les données : ${desc}. L'examinateur attend l'arithmétique par client, l'agrégation, le verdict sur les fonds propres, et la leçon distributionnelle : ce que l'historique d'un cours administré ne contient PAS.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The margin on deposit' : 'a) La marge en dépôt',
          enonce: en
            ? `Per client, how many euros of margin does the 2% requirement hold?`
            : `Par client, combien d'euros de marge l'exigence de 2 % détient-elle ?`,
          reponse: repMarge, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'Two percent of the notional — leverage fifty' : 'Deux pour cent du notionnel — levier cinquante',
            contenu: en
              ? `Margin = ${f(pos, 0)} × 2% = **${eur(repMarge, 0)}**. A 2% margin is a ×50 leverage: calibrated for a pair whose measured daily volatility, under the floor, was close to zero. The model saw the calm; it priced the calm.`
              : `Marge = ${f(pos, 0)} × 2 % = **${f(repMarge, 0)} €**. Une marge de 2 %, c'est un levier ×50 : calibré pour une paire dont la volatilité quotidienne mesurée, sous le plancher, était quasi nulle. Le modèle voyait le calme ; il a tarifé le calme.`,
          }],
        },
        {
          intitule: en ? 'b) The client loss in the gap' : 'b) La perte client dans le gap',
          enonce: en
            ? `At ${pct(-gap, 1)} without intermediate quotes, what does each client lose, in euros?`
            : `À ${pct(-gap, 1)} sans cotation intermédiaire, combien chaque client perd-il, en euros ?`,
          reponse: repPerteCl, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'The stop is an order, not a guarantee' : "Le stop est un ordre, pas une garantie",
            contenu: en
              ? `Loss = ${f(pos, 0)} × ${f(gap, 1)}% = **${eur(repPerteCl, 0)}**. The stop at −2% executed nowhere: between 1.2000 and ${f(niveauApres, 4)} there was simply NO price. A stop converts into a market order at the next quote — and the next quote was ${pct(-gap, 1)} away.`
              : `Perte = ${f(pos, 0)} × ${f(gap, 1)} % = **${f(repPerteCl, 0)} €**. Le stop à −2 % ne s'est exécuté nulle part : entre 1,2000 et ${f(niveauApres, 4)}, il n'y avait simplement AUCUN prix. Un stop se convertit en ordre au marché à la cotation suivante — et la cotation suivante était ${pct(-gap, 1)} plus bas.`,
          }],
        },
        {
          intitule: en ? 'c) The negative balance' : 'c) Le solde négatif',
          enonce: en
            ? `After the margin is wiped, how much does each client OWE the broker, in euros?`
            : `Une fois la marge balayée, combien chaque client DOIT-il au courtier, en euros ?`,
          reponse: repSolde, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'The loss went through the floor of the deposit' : 'La perte a traversé le plancher du dépôt',
            contenu: en
              ? `Balance = ${f(repPerteCl, 0)} − ${f(repMarge, 0)} = **${eur(repSolde, 0)}** of debt per client — ${f(r1(gap / 2), 1)} times the margin held. Legally collectable; practically, retail clients facing a debt of that size default, litigate, or vanish.`
              : `Solde = ${f(repPerteCl, 0)} − ${f(repMarge, 0)} = **${f(repSolde, 0)} €** de dette par client — ${f(r1(gap / 2), 1)} fois la marge détenue. Juridiquement exigible ; en pratique, des clients particuliers devant une dette pareille font défaut, plaident, ou disparaissent.`,
          }],
          pieges: [en
            ? `Thinking the broker's risk stops at the client's margin assumes prices move continuously: gap risk is precisely the discontinuity.`
            : `Croire que le risque du courtier s'arrête à la marge du client suppose des prix continus : le risque de gap est précisément la discontinuité.`],
        },
        {
          intitule: en ? "d) The broker's hole" : 'd) Le trou du courtier',
          enonce: en
            ? `If no client repays, what loss lands on the broker, in millions of euros?`
            : `Si aucun client ne rembourse, quelle perte atterrit sur le courtier, en millions d'euros ?`,
          reponse: repTotale, tolerance: 0.005, unite: 'M€',
          etapes: [{
            titre: en ? 'Socialised by the书 book' : 'Socialisée par le livre',
            contenu: en
              ? `Hole = ${f(nClients, 0)} × ${f(repSolde, 0)} = **${eur(repTotale)} million**. The broker was, without ever writing it down, short the tail risk of its own clients: their negative balances are its loss.`
              : `Trou = ${f(nClients, 0)} × ${f(repSolde, 0)} = **${f(repTotale)} M€**. Le courtier était, sans jamais l'avoir écrit, short la queue de distribution de ses propres clients : leurs soldes négatifs sont sa perte.`,
          }],
        },
        {
          intitule: en ? 'e) Does the firm see the evening?' : 'e) La maison voit-elle le soir ?',
          enonce: en
            ? `Equity minus the hole: what remains, in millions of euros (negative = failure)?`
            : `Fonds propres moins le trou : que reste-t-il, en millions d'euros (négatif = faillite) ?`,
          reponse: repRestant, tolerance: 0.1, toleranceMode: 'absolu', unite: 'M€',
          etapes: [{
            titre: en ? 'The verdict' : 'Le verdict',
            contenu: en
              ? `${f(C, 1)} − ${f(repTotale)} = **${eur(repRestant)} million**. ${faillite
                ? 'Insolvent before lunch: the Alpari UK path — administration the same week. '
                : 'Technically alive — but with regulatory capital gutted, the FXCM path: survival only through an emergency loan at punitive terms, equity holders effectively wiped. '}One morning, one gap, and the business model of years is settled.`
              : `${f(C, 1)} − ${f(repTotale)} = **${f(repRestant)} M€**. ${faillite
                ? 'Insolvable avant midi : le chemin Alpari UK — administration judiciaire dans la semaine. '
                : 'Techniquement vivant — mais le capital réglementaire éventré, le chemin FXCM : survie par un prêt d\'urgence à conditions punitives, actionnaires de fait lessivés. '}Un matin, un gap, et le modèle d'affaires de plusieurs années est soldé.`,
          }],
        },
        {
          intitule: en ? 'f) Years of revenue to refill the hole' : 'f) Des années de revenus pour reboucher le trou',
          enonce: en
            ? `At ${eur(rev, 0)} of revenue per client per year, how many years of the WHOLE client base does the hole represent?`
            : `À ${f(rev, 0)} € de revenu par client et par an, combien d'années de TOUTE la base clients le trou représente-t-il ?`,
          reponse: repAnnees, tolerance: 0.01, unite: en ? 'years' : 'années',
          etapes: [
            {
              titre: en ? 'The business, measured against the tail' : 'Le métier, mesuré contre la queue',
              contenu: en
                ? `Annual revenue base = ${f(nClients, 0)} × ${f(rev, 0)} = ${eur(r0(nClients * rev), 0)}; hole / base = **${f(repAnnees, 1)} years** of every client's fees. That is why "holding on" was never an option: there was nothing to hold with.`
                : `Base de revenus annuelle = ${f(nClients, 0)} × ${f(rev, 0)} = ${f(r0(nClients * rev), 0)} € ; trou / base = **${f(repAnnees, 1)} années** des commissions de toute la clientèle. Voilà pourquoi « tenir bon » n'a jamais été une option : il n'y avait rien pour tenir.`,
            },
            {
              titre: en ? 'The lesson: a peg concentrates risk, it does not remove it' : 'La leçon : un peg concentre le risque, il ne le supprime pas',
              contenu: en
                ? `Measured on the floor's history, EUR/CHF volatility was almost zero — and the margin model believed it. The risk had not vanished: it was compressed into one rare, brutal jump (module 2's fat tails). A 2% margin on an administered price is a sold option on the central bank's resolve — premium collected as spreads for years, strike hit on January 15, 2015 at 10:30.`
                : `Mesurée sur l'historique du plancher, la volatilité de l'EUR/CHF était quasi nulle — et le modèle de marge l'a crue. Le risque n'avait pas disparu : il était comprimé en un saut rare et brutal (les queues épaisses du module 2). Une marge de 2 % sur un cours administré est une option vendue sur la détermination de la banque centrale — prime encaissée en spreads pendant des années, strike touché le 15 janvier 2015 à 10 h 30.`,
            },
          ],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 18. m6-pb-18 — L'ETF pétrole qui saigne — BOSS N4                   */
/* ------------------------------------------------------------------ */
const etfQuiSaigne: ProblemGenerator = {
  id: 'm6-pb-18', moduleId: M6,
  titre: "L'ETF pétrole qui saigne : quatre rolls en contango, un spot immobile",
  titreEn: 'The bleeding oil ETF: four rolls in contango, a motionless spot',
  typeDeCas: 'futures et roll yield',
  typeDeCasEn: 'futures and roll yield',
  difficulte: 4,
  scenarios: ["Conseiller face au relevé d'un client furieux", 'Analyste produits qui audite le tracker pétrole', "Grand oral : l'autopsie d'un tracker matières premières"],
  scenariosEn: ["Adviser facing a furious client's statement", 'Product analyst auditing the oil tracker', 'Final viva: autopsy of a commodity tracker'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const S = randFloat(rng, 52, 88, 2);       // spot $/baril, identique en début et fin d'année
    const cTrim = randFloat(rng, 1.5, 3.5, 1); // contango par trimestre, %
    const miseK = randInt(rng, 10, 100);       // k$ investis dans l'ETF au 1er janvier

    const F1 = S * (1 + cTrim / 100);           // contrat du trimestre suivant, au jour du roll
    const ry = rollYieldAnnualise(S, F1, 0.25); // % annualisé, négatif en contango
    const ratioRoll = 1 / (1 + cTrim / 100);    // fraction de valeur conservée à chaque roll
    const perteRoll = (ratioRoll - 1) * 100;
    const ratioAn = ratioRoll ** 4;
    const perfAn = (ratioAn - 1) * 100;
    const valeurFin = miseK * 1000 * ratioAn;
    const ecart = miseK * 1000 - valeurFin;
    const repF1 = r2(F1);
    const repRy = r1(ry);
    const repPerteRoll = r2(perteRoll);
    const repPerfAn = r2(perfAn);
    const repValeur = r0(valeurFin);
    const repEcart = r0(ecart);

    const { en, f, usd, pct } = outils(langue);
    const desc = en
      ? `a barrel quoting ${usd(S)} today — and ${usd(S)} again in one year, the spot ending the year exactly where it began; a futures curve in steady contango of ${pct(cTrim, 1)} a quarter; an ETF holding the nearest contract and rolling it every quarter, four rolls over the year; and $${f(miseK, 0)},000 invested on January 1st`
      : `un baril qui cote ${usd(S)} aujourd'hui — et encore ${usd(S)} dans un an, le spot finissant l'année exactement où il l'a commencée ; une courbe à terme en contango régulier de ${pct(cTrim, 1)} par trimestre ; un ETF qui détient le contrat le plus proche et le roule chaque trimestre, soit quatre rolls dans l'année ; et ${f(miseK, 0)} 000 $ investis au 1er janvier`;
    const contexte = (en
      ? [
        `You are a wealth adviser, and the client who wanted to "buy oil" last year has just received his statement: ${desc}. On the phone, the question cracks: "the barrel went nowhere and I lost money — explain that to me." You rebuild the year roll by roll, because the only honest answer is arithmetic: his ETF never owned oil, it owned a curve.`,
        `As product analyst, you audit the oil tracker the firm distributes: ${desc}. The committee wants a clean figure for the tracking gap and one sentence for the KID: where does the gap between "oil went nowhere" and the ETF's print come from? You strip the roll machinery down, quarter by quarter, to the last dollar.`,
        `The viva's boss question: "can an oil ETF lose big in a year when the spot ends unchanged?" The data: ${desc}. The examiner wants the curve, the roll yield, the compounding of four rolls and the USO loop of April 2020 — not an opinion about oil.`,
      ]
      : [
        `Vous êtes conseiller en gestion de patrimoine, et le client qui voulait « acheter du pétrole » l'an dernier vient de recevoir son relevé : ${desc}. Au téléphone, la question claque : « le baril n'a pas bougé et j'ai perdu de l'argent — expliquez-moi ça. » Vous reconstruisez l'année roll par roll, car la seule réponse honnête est arithmétique : son ETF n'a jamais détenu de pétrole, il détenait une courbe.`,
        `Analyste produits, vous auditez le tracker pétrole que la maison distribue : ${desc}. Le comité veut un chiffre propre pour le tracking gap et une phrase pour le DIC : d'où vient l'écart entre « le pétrole n'a pas bougé » et l'affichage de l'ETF ? Vous démontez la mécanique du roll, trimestre par trimestre, jusqu'au dollar près.`,
        `La question boss du grand oral : « un ETF pétrole peut-il perdre gros sur une année où le spot finit inchangé ? » Les données : ${desc}. L'examinateur attend la courbe, le roll yield, la composition des quatre rolls et la boucle USO d'avril 2020 — pas une opinion sur le pétrole.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The next contract on the curve' : "a) Le contrat d'à côté",
          enonce: en
            ? `On roll day, the near contract expires at ${usd(S)} (it has converged to the spot). With ${pct(cTrim, 1)} of quarterly contango, what does the next quarter's contract quote, in dollars?`
            : `Au jour du roll, le contrat proche expire à ${usd(S)} (il a convergé vers le spot). À ${pct(cTrim, 1)} de contango trimestriel, que cote le contrat du trimestre suivant, en dollars ?`,
          reponse: repF1, tolerance: 0.05, toleranceMode: 'absolu', unite: '$',
          etapes: [{
            titre: en ? 'Carry, read off the curve' : 'Le portage, lu sur la courbe',
            contenu: en
              ? `F = ${f(S)} × (1 + ${f(cTrim, 1)}/100) = **${usd(repF1)}**. The curve climbs with maturity: financing and storage dominate the convenience yield — the chapter's contango.`
              : `F = ${f(S)} × (1 + ${f(cTrim, 1)}/100) = **${usd(repF1)}**. La courbe monte avec l'échéance : financement et stockage dominent la convenience yield — le contango du chapitre.`,
          }],
          pieges: [en
            ? `Reading contango as a forecast that the barrel will rise: it is carry cost, not a prediction — the curve can climb while the spot treads water all year.`
            : `Lire le contango comme une prévision de hausse du baril : c'est du coût de portage, pas un pronostic — la courbe peut monter pendant que le spot fait du surplace toute l'année.`],
        },
        {
          intitule: en ? 'b) The annualised roll yield' : 'b) Le roll yield annualisé',
          enonce: en
            ? `Selling the near at ${usd(S)} and buying the next at ${f(repF1)} (maturities 0.25 years apart): what annualised roll yield does this inflict, in %?`
            : `Vendre le proche à ${usd(S)}, racheter le suivant à ${f(repF1)} $ (échéances espacées de 0,25 an) : quel roll yield annualisé cela inflige-t-il, en % ?`,
          reponse: repRy, tolerance: 0.3, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Sell low, buy high — four times a year' : 'Vendre bas, racheter haut — quatre fois par an',
            contenu: en
              ? `Roll yield = (near/far − 1)/0.25 × 100 = (${f(S)}/${f(repF1)} − 1)/0,25 × 100 = **${pct(repRy, 1)}** a year. Negative in contango: at every roll you sell cheaper than you buy back — the silent erosion of commodity trackers (it is the per-roll loss × 4, linearly annualised).`
              : `Roll yield = (proche/lointain − 1)/0,25 × 100 = (${f(S)}/${f(repF1)} − 1)/0,25 × 100 = **${pct(repRy, 1)}** par an. Négatif en contango : à chaque roll on vend moins cher qu'on ne rachète — l'érosion silencieuse des trackers matières premières (c'est la perte par roll × 4, annualisée en linéaire).`,
          }],
          pieges: [en
            ? `Computing far/near gives the roll yield of a SHORT position: the long tracker sells the near and buys the far, so the ratio is near over far.`
            : `Calculer lointain/proche donne le roll yield d'une position SHORT : le tracker long vend le proche et rachète le lointain, donc le ratio est proche sur lointain.`],
        },
        {
          intitule: en ? "c) One roll's bleeding" : "c) La saignée d'un roll",
          enonce: en
            ? `At each roll, what fraction of its value does the tracker give up, in % (the spot unchanged between two rolls)?`
            : `À chaque roll, quelle fraction de sa valeur le tracker abandonne-t-il, en % (le spot n'ayant pas bougé entre deux rolls) ?`,
          reponse: repPerteRoll, tolerance: 0.1, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Fewer barrels at every pass' : 'Moins de barils à chaque passage',
            contenu: en
              ? `Sell at ${f(S)}, buy back at ${f(repF1)}: only ${f(S)}/${f(repF1)} = ${f(r4(ratioRoll), 4)} of the contracts remain — **${pct(repPerteRoll)}** per roll. The contract bought at ${f(repF1)} will itself converge back to ${f(S)} by the next expiry (flat spot): the loss is realised, quarter after quarter.`
              : `Revendre à ${f(S)}, racheter à ${f(repF1)} : il ne reste que ${f(S)}/${f(repF1)} = ${f(r4(ratioRoll), 4)} des contrats — soit **${pct(repPerteRoll)}** par roll. Le contrat racheté à ${f(repF1)} reconvergera lui-même vers ${f(S)} à l'échéance suivante (spot immobile) : la perte est bien réalisée, trimestre après trimestre.`,
          }],
          pieges: [en
            ? `"Nothing is lost until you sell" does not apply: the roll IS a sale, four times a year, contractually forced on an ETF that cannot take delivery of physical barrels.`
            : `« Rien n'est perdu tant qu'on ne vend pas » ne s'applique pas : le roll EST une vente, quatre fois par an, contractuellement forcée pour un ETF qui ne peut pas prendre livraison de barils physiques.`],
        },
        {
          intitule: en ? 'd) Four rolls, compounded' : 'd) Quatre rolls composés',
          enonce: en
            ? `After the year's four rolls, what performance does the ETF print, in %?`
            : `Après les quatre rolls de l'année, quelle performance l'ETF affiche-t-il, en % ?`,
          reponse: repPerfAn, tolerance: 0.3, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'A power, not a sum' : 'Une puissance, pas une somme',
            contenu: en
              ? `(1/(1 + ${f(cTrim, 1)}/100))⁴ = ${f(r4(ratioAn), 4)} ⇒ performance = **${pct(repPerfAn)}** over the year — with a spot rigorously unchanged.`
              : `(1/(1 + ${f(cTrim, 1)}/100))⁴ = ${f(r4(ratioAn), 4)} ⇒ performance = **${pct(repPerfAn)}** sur l'année — avec un spot rigoureusement inchangé.`,
          }],
          pieges: [en
            ? `Multiplying one roll's loss by four (${pct(r2(perteRoll * 4))}) ignores compounding: each roll strikes a value the previous rolls have already shrunk.`
            : `Multiplier la perte d'un roll par quatre (${pct(r2(perteRoll * 4))}) néglige la composition : chaque roll frappe une valeur déjà réduite par les précédents.`],
        },
        {
          intitule: en ? "e) The client's stake" : 'e) La mise du client',
          enonce: en
            ? `What are the $${f(miseK, 0)},000 invested on January 1st worth at year-end, in dollars?`
            : `Que valent les ${f(miseK, 0)} 000 $ investis au 1er janvier à la fin de l'année, en dollars ?`,
          reponse: repValeur, tolerance: 0.01, unite: '$',
          etapes: [{
            titre: en ? 'The statement line' : 'La ligne du relevé',
            contenu: en
              ? `${f(miseK, 0)},000 × ${f(r4(ratioAn), 4)} = **${usd(repValeur, 0)}** — the figure printed on the statement, under a headline saying oil was flat.`
              : `${f(miseK, 0)} 000 × ${f(r4(ratioAn), 4)} = **${usd(repValeur, 0)}** — le chiffre imprimé sur le relevé, sous un titre de presse disant que le pétrole n'a pas bougé.`,
          }],
        },
        {
          intitule: en ? 'f) The gap to "oil went nowhere"' : "f) L'écart au « le pétrole n'a pas bougé »",
          enonce: en
            ? `How many dollars evaporated while the barrel ended the year exactly at its starting price?`
            : `Combien de dollars se sont évaporés alors que le baril a fini l'année exactement à son prix de départ ?`,
          reponse: repEcart, tolerance: 0.02, unite: '$',
          etapes: [
            {
              titre: en ? 'The roll bill, in dollars' : 'La facture du roll, en dollars',
              contenu: en
                ? `Gap = ${f(miseK, 0)},000 − ${f(repValeur, 0)} = **${usd(repEcart, 0)}** — entirely roll cost: no management fee, no oil decline, just four passages through the contango toll booth.`
                : `Écart = ${f(miseK, 0)} 000 − ${f(repValeur, 0)} = **${usd(repEcart, 0)}** — intégralement du coût de roll : ni frais de gestion, ni baisse du baril, juste quatre passages au péage du contango.`,
            },
            {
              titre: en ? 'The lesson: a futures ETF owns the curve, not the barrel' : "La leçon : un ETF de futures détient la courbe, pas le baril",
              contenu: en
                ? `April 2020, the USO loop: WTI's May contract settled at −$37.63 while the ETF, flooded with retail money come to "buy cheap oil", rolled in panic through a super-contango — months later the spot had rebounded, the tracker had not. Holding physical costs storage; holding futures costs the roll: there is NO free exposure to the spot. For a retail investor, a futures tracker is a short-horizon trading tool, never a long-term "oil" investment — and your client's statement is the proof, computed by hand.`
                : `Avril 2020, la boucle USO : l'échéance mai du WTI clôture à −37,63 $ pendant que l'ETF, gavé d'argent de particuliers venus « acheter le pétrole pas cher », roule en catastrophe dans un super-contango — des mois plus tard, le spot avait rebondi, le tracker non. Détenir du physique coûte du stockage ; détenir des futures coûte le roll : il n'existe AUCUNE exposition gratuite au spot. Pour un particulier, un tracker de futures est un instrument de trading à horizon court, jamais un placement « pétrole » de long terme — et le relevé de votre client en est la preuve, recalculée à la main.`,
            },
          ],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 19. m6-pb-19 — Le dépeg du stablecoin — BOSS N4                     */
/* ------------------------------------------------------------------ */
const depegStablecoin: ProblemGenerator = {
  id: 'm6-pb-19', moduleId: M6,
  titre: 'Le dépeg du stablecoin : acheter sous le pair, espérer le rachat',
  titreEn: 'The stablecoin depeg: buying below par, hoping for redemption',
  typeDeCas: 'crypto et risque de contrepartie',
  typeDeCasEn: 'crypto and counterparty risk',
  difficulte: 4,
  scenarios: ["Trader d'un desk crypto au matin du dépeg", "Gérant tenté par « l'arbitrage du siècle »", "Grand oral : l'espérance contre le pair"],
  scenariosEn: ['Crypto desk trader on the morning of the depeg', 'Manager tempted by "the arbitrage of the century"', 'Final viva: expectation against the par'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const P = randFloat(rng, 0.88, 0.97, 2); // prix de marché après la rupture du peg
    const J = randInt(rng, 10, 30);          // jours de file d'attente au rachat
    const pGel = randInt(rng, 10, 40);       // % de probabilité d'un gel des rachats
    const R = randFloat(rng, 0.2, 0.6, 2);   // récupération par coin si gel
    const Nk = randInt(rng, 250, 1000);      // milliers de coins envisagés

    const N = Nk * 1000;
    const brutPct = (1 / P - 1) * 100;
    const annuPct = variationAnnualiseePct(P, 1, J / 365);
    const esp = (1 - pGel / 100) * 1 + (pGel / 100) * R; // $ par coin
    const pnlEsp = N * (esp - P);
    const rendEspPct = (esp / P - 1) * 100;
    const perteGelPct = (R / P - 1) * 100;
    const pStar = ((1 - P) / (1 - R)) * 100;
    const go = pnlEsp > 0; // ⇔ rendEspPct > 0 ⇔ pGel < pStar
    const repBrut = r2(brutPct);
    const repAnnu = r0(annuPct);
    const repEsp = r4(esp);
    const repPnl = r0(pnlEsp);
    const repRend = r2(rendEspPct);
    const repPStar = r1(pStar);

    const { en, f, usd, pct } = outils(langue);
    const desc = en
      ? `a "one-for-one backed" stablecoin breaks its peg and trades at ${usd(P)}; par redemption ($1.00) remains open at the issuer, but the queue runs ${J} days; the desk puts the probability of a redemption freeze during the queue at ${pGel}%, with a recovery of ${usd(R)} per coin in that case; size contemplated: ${f(Nk, 0)},000 coins`
      : `un stablecoin « adossé un pour un » casse son ancrage et traite à ${usd(P)} ; le rachat au pair (1,00 $) reste ouvert chez l'émetteur, mais la file d'attente est de ${J} jours ; le desk estime à ${pGel} % la probabilité d'un gel des rachats pendant la file, avec une récupération de ${usd(R)} par coin dans ce cas ; taille envisagée : ${f(Nk, 0)} 000 coins`;
    const contexte = (en
      ? [
        `You are the trader on the crypto desk and the screen woke up red: ${desc}. The internal chat is screaming "free money". Before clicking, you do what module 2 taught you: the gain if everything goes through, its vertiginous annualisation, then the expectation — the real one, with the freeze inside — and the probability threshold that separates an arbitrage from a bet.`,
        `A client forwards you the pitch of the year: "buy at ${usd(P)}, redeem at par, riskless". You manage money, so you owe him the full file: ${desc}. Gross return, annualised mirage, expected value coin by coin, expected P&L of the position — and the freeze probability at which the miracle dies.`,
        `The examiner reads the case aloud: "a stablecoin trades below par, redemption is open — arbitrage?" The data: ${desc}. To survive, compute everything: the gross gain, the annualisation that makes juniors dream, the expectation with the freeze, and the break-even probability — then say the word "credit" where everyone says "arbitrage".`,
      ]
      : [
        `Vous êtes le trader du desk crypto et l'écran s'est réveillé en rouge : ${desc}. Le chat interne hurle « free money ». Avant de cliquer, vous faites ce que le module 2 vous a appris : le gain si tout passe, son annualisation vertigineuse, puis l'espérance — la vraie, avec le gel dedans — et le seuil de probabilité qui sépare un arbitrage d'un pari.`,
        `Un client vous transfère le pitch de l'année : « acheter à ${usd(P)}, racheter au pair, sans risque ». Vous gérez son argent, vous lui devez donc le dossier complet : ${desc}. Rendement brut, mirage annualisé, valeur espérée coin par coin, P&L espéré de la position — et la probabilité de gel à laquelle le miracle meurt.`,
        `L'examinateur lit le cas à voix haute : « un stablecoin traite sous le pair, le rachat est ouvert — arbitrage ? » Les données : ${desc}. Pour survivre, tout calculer : le gain brut, l'annualisation qui fait rêver les juniors, l'espérance avec le gel, et la probabilité de bascule — puis dire le mot « crédit » là où tout le monde dit « arbitrage ».`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The gross gain if everything goes through' : 'a) Le gain brut si tout passe',
          enonce: en
            ? `Bought at ${usd(P)}, redeemed at $1.00: what gross return in % of the money invested, if redemption goes through?`
            : `Acheté à ${usd(P)}, remboursé à 1,00 $ : quel rendement brut en % de la mise, si le rachat passe ?`,
          reponse: repBrut, tolerance: 0.2, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The figure that screams in the chat' : 'Le chiffre qui hurle dans le chat',
            contenu: en
              ? `(1.00/${f(P)} − 1) × 100 = **${pct(repBrut)}** in ${J} days — the number that makes the chat scream "free money". Hold that thought: nothing has been said yet about the J days, or about the freeze.`
              : `(1,00/${f(P)} − 1) × 100 = **${pct(repBrut)}** en ${J} jours — le chiffre qui fait hurler « free money » dans le chat. Gardez la tête froide : rien n'a encore été dit sur les ${J} jours, ni sur le gel.`,
          }],
          pieges: [en
            ? `Reading 1.00 − ${f(P)} = ${f(r2(1 - P))} and calling it "${f(r2((1 - P) * 100))}%" measures the discount on the PAR: the return is measured on the ${f(P)} actually invested.`
            : `Lire 1,00 − ${f(P)} = ${f(r2(1 - P))} et l'appeler « ${f(r2((1 - P) * 100))} % » mesure la décote sur le PAIR : le rendement se mesure sur les ${f(P)} réellement engagés.`],
        },
        {
          intitule: en ? 'b) The dream machine: annualisation' : "b) La machine à rêves : l'annualisation",
          enonce: en
            ? `If redemption goes through in exactly ${J} days, what compounded annualised return (in %) would this trade print?`
            : `Si le rachat passe en ${J} jours exactement, quel rendement annualisé composé (en %) cette opération afficherait-elle ?`,
          reponse: repAnnu, tolerance: 0.02, unite: '%',
          etapes: [{
            titre: en ? 'A power of 365/J — and a warning' : 'Une puissance 365/J — et un avertissement',
            contenu: en
              ? `((1.00/${f(P)})^(365/${J}) − 1) × 100 = **${pct(repAnnu, 0)}** annualised. Vertiginous and almost meaningless: the trade cannot be repeated ${f(r1(365 / J), 1)} times a year at will — annualising a single ${J}-day shot manufactures dreams, not returns.`
              : `((1,00/${f(P)})^(365/${J}) − 1) × 100 = **${pct(repAnnu, 0)}** annualisé. Vertigineux et presque dénué de sens : l'opération ne se répète pas ${f(r1(365 / J), 1)} fois par an à volonté — annualiser un coup unique de ${J} jours fabrique du rêve, pas du rendement.`,
          }],
        },
        {
          intitule: en ? 'c) The expected value of one coin' : "c) L'espérance par coin",
          enonce: en
            ? `With ${pGel}% of freeze (recovery ${usd(R)}) and ${100 - pGel}% of par redemption, what is the expected value of one coin, in dollars?`
            : `Avec ${pGel} % de gel (récupération ${usd(R)}) et ${100 - pGel} % de rachat au pair, que vaut l'espérance de valeur d'un coin, en dollars ?`,
          reponse: repEsp, tolerance: 0.005, toleranceMode: 'absolu', unite: '$',
          etapes: [{
            titre: en ? "Module 2's reflex" : 'Le réflexe du module 2',
            contenu: en
              ? `E[V] = ${f(1 - pGel / 100, 2)} × 1.00 + ${f(pGel / 100, 2)} × ${f(R)} = **${usd(repEsp, 4)}**. The ${J}-day queue is not a delay, it is an exposure: while you wait, you are an unsecured creditor of the issuer — and the freeze, if it comes, comes precisely then.`
              : `E[V] = ${f(1 - pGel / 100, 2)} × 1,00 + ${f(pGel / 100, 2)} × ${f(R)} = **${usd(repEsp, 4)}**. La file de ${J} jours n'est pas un délai, c'est une exposition : pendant l'attente, vous êtes créancier non garanti de l'émetteur — et le gel, s'il vient, vient précisément là.`,
          }],
          pieges: [en
            ? `Treating the freeze as a "delay" (par paid later) understates the loss: a frozen redemption ends in a recovery of ${usd(R)}, not in a postponed dollar.`
            : `Traiter le gel comme un « retard » (le pair payé plus tard) sous-estime la perte : un rachat gelé se termine en récupération de ${usd(R)}, pas en dollar différé.`],
        },
        {
          intitule: en ? 'd) The expected P&L of the position' : 'd) Le P&L espéré de la position',
          enonce: en
            ? `On ${f(Nk, 0)},000 coins bought at ${usd(P)}, what is the expected P&L, in dollars?`
            : `Sur ${f(Nk, 0)} 000 coins achetés à ${usd(P)}, quel P&L espéré, en dollars ?`,
          reponse: repPnl, tolerance: 500, toleranceMode: 'absolu', unite: '$',
          etapes: [{
            titre: en ? 'Expectation times size' : "L'espérance fois la taille",
            contenu: en
              ? `Expected P&L = ${f(Nk, 0)},000 × (${f(repEsp, 4)} − ${f(P)}) = **${usd(repPnl, 0)}**. ${go ? 'Positive — but an expectation is an average over worlds, not a promise about THIS world.' : 'Negative: on these numbers, the "free money" is an expected transfer from you to the sellers.'}`
              : `P&L espéré = ${f(Nk, 0)} 000 × (${f(repEsp, 4)} − ${f(P)}) = **${usd(repPnl, 0)}**. ${go ? "Positif — mais une espérance est une moyenne sur des mondes, pas une promesse sur CE monde." : "Négatif : sur ces chiffres, le « free money » est un transfert espéré de votre poche vers celle des vendeurs."}`,
          }],
        },
        {
          intitule: en ? 'e) The expected return — and the decision' : 'e) Le rendement espéré — et la décision',
          enonce: en
            ? `In % of the money invested, what does the return become once the freeze is priced in?`
            : `En % de la mise, que devient le rendement une fois le gel intégré ?`,
          reponse: repRend, tolerance: 0.3, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'The headline against the expectation' : "L'affiche contre l'espérance",
              contenu: en
                ? `(${f(repEsp, 4)}/${f(P)} − 1) × 100 = **${pct(repRend)}**, against ${pct(repBrut)} on the headline: the gap IS the price of the freeze risk, which the gross figure never showed.`
                : `(${f(repEsp, 4)}/${f(P)} − 1) × 100 = **${pct(repRend)}**, contre ${pct(repBrut)} sur l'affiche : l'écart EST le prix du risque de gel, que le chiffre brut ne montrait pas.`,
            },
            {
              titre: en ? 'The decision' : 'La décision',
              contenu: en
                ? `${go
                  ? `The expectation is positive: the position can be taken — but SIZED as a credit bet, never as an arbitrage: in ${pGel}% of worlds the trade returns ${pct(r1(perteGelPct), 1)}. Survival sizing first (module 2: expectation does not protect you from the path), and no leverage on a position that can lose most of its value.`
                  : `The expectation is negative: pass. The market price of ${f(P)} is not an anomaly waiting for you — it already embeds a freeze probability HIGHER than what makes the trade fair. Buying "cheap dollars" here is paying ${f(P)} for an expected ${f(repEsp, 4)}.`}`
                : `${go
                  ? `L'espérance est positive : la position peut se prendre — mais TAILLÉE comme un pari de crédit, jamais comme un arbitrage : dans ${pGel} % des mondes, le trade rend ${pct(r1(perteGelPct), 1)}. Sizing de survie d'abord (module 2 : l'espérance ne protège pas du chemin), et aucun levier sur une position qui peut perdre l'essentiel de sa valeur.`
                  : `L'espérance est négative : on passe. Le prix de marché de ${f(P)} n'est pas une anomalie qui vous attend — il intègre déjà une probabilité de gel SUPÉRIEURE à celle qui rendrait le pari équitable. Acheter des « dollars pas chers » ici, c'est payer ${f(P)} pour une espérance de ${f(repEsp, 4)}.`}`,
            },
          ],
        },
        {
          intitule: en ? 'f) The threshold that kills the trade' : 'f) Le seuil qui tue le trade',
          enonce: en
            ? `At what freeze probability (in %) does the expected gain become exactly zero?`
            : `À quelle probabilité de gel (en %) l'espérance de gain devient-elle exactement nulle ?`,
          reponse: repPStar, tolerance: 0.5, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'Solve E[V] = price' : 'Résoudre E[V] = prix',
              contenu: en
                ? `(1 − p) × 1.00 + p × ${f(R)} = ${f(P)} ⇒ p* = (1 − ${f(P)})/(1 − ${f(R)}) = **${pct(repPStar, 1)}**. ${go
                  ? `The desk estimates ${pGel}%: below the threshold — the expectation holds, but any revision of the freeze beyond ${f(repPStar, 1)}% erases the trade. Your whole P&L rests on ONE estimated parameter.`
                  : `The desk estimates ${pGel}%: ABOVE the threshold — at ${f(P)}, the market "pays" more than the expectation is worth. The discount is fair compensation, not free money.`}`
                : `(1 − p) × 1,00 + p × ${f(R)} = ${f(P)} ⇒ p* = (1 − ${f(P)})/(1 − ${f(R)}) = **${pct(repPStar, 1)}**. ${go
                  ? `Le desk estime ${pGel} % : sous le seuil — l'espérance tient, mais toute révision du gel au-delà de ${f(repPStar, 1)} % efface le trade. Tout votre P&L repose sur UN paramètre estimé.`
                  : `Le desk estime ${pGel} % : AU-DESSUS du seuil — à ${f(P)}, le marché « paie » plus que l'espérance ne vaut. La décote est une rémunération équitable du risque, pas de l'argent gratuit.`}`,
            },
            {
              titre: en ? 'The lesson: Terra, May 2022' : 'La leçon : Terra, mai 2022',
              contenu: en
                ? `UST traded at $0.95, then $0.60, then zero: every step down attracted "arbitrage" buyers who saw the par and not the queue. An arbitrage requires a CERTAIN and DATED convergence mechanism; here convergence depends on the issuer's solvency and goodwill — that is credit, not arbitrage. The market price below par is not an anomaly: it is the market's verdict on the freeze probability — exactly your p*. When someone shows you a peg, ask what stands behind it; when they show you a discount, ask what the queue is hiding.`
                : `L'UST a traité à 0,95 $, puis 0,60 $, puis zéro : chaque palier de baisse a attiré des acheteurs « d'arbitrage » qui voyaient le pair et pas la file. Un arbitrage exige un mécanisme de convergence CERTAIN et DATÉ ; ici la convergence dépend de la solvabilité et du bon vouloir de l'émetteur — c'est du crédit, pas de l'arbitrage. Le prix de marché sous le pair n'est pas une anomalie : c'est le verdict du marché sur la probabilité de gel — exactement votre p*. Quand on vous montre un peg, demandez ce qu'il y a derrière ; quand on vous montre une décote, demandez ce que cache la file.`,
            },
          ],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 20. m6-pb-20 — La mine d'or et le board — BOSS N4                   */
/* ------------------------------------------------------------------ */
const mineOrBoard: ProblemGenerator = {
  id: 'm6-pb-20', moduleId: M6,
  titre: "La mine d'or et le board : verrouiller la marge ou garder l'upside",
  titreEn: 'The gold mine and the board: lock the margin or keep the upside',
  typeDeCas: 'politique de couverture producteur',
  typeDeCasEn: 'producer hedging policy',
  difficulte: 4,
  scenarios: ["Directeur financier devant le conseil d'administration", 'Administrateur indépendant qui challenge le management', "Grand oral : la politique de couverture d'un producteur d'or"],
  scenariosEn: ['CFO before the board of directors', 'Independent director challenging management', "Final viva: a gold producer's hedging policy"],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const aisc = randInt(rng, 1150, 1450);       // $/oz, all-in sustaining cost
    const S = randInt(rng, 1900, 2400);          // spot $/oz
    const fin = randFloat(rng, 2, 3.5, 1);       // % financement
    const stock = randFloat(rng, 0.3, 0.8, 1);   // % stockage/assurance
    const conv = r1(fin + stock + randFloat(rng, 0.3, 1.2, 1)); // convenience > coûts ⇒ légère backwardation
    const Qk = randInt(rng, 150, 350);           // production annuelle, milliers d'onces
    const bear = Math.round(S * randFloat(rng, 0.7, 0.82, 3));
    const base = Math.round(S * randFloat(rng, 0.95, 1.05, 3));
    const bull = Math.round(S * randFloat(rng, 1.18, 1.32, 3));

    const netCarry = r1(fin + stock - conv);     // négatif
    const F2 = forwardCommodity(S, fin, stock, conv, 2);
    const margeSpot = S - aisc;
    const margeLock = F2 - aisc;
    const mHedge = (Qk * margeLock) / 1000;      // M$, identique dans les trois scénarios
    const m0Bear = (Qk * (bear - aisc)) / 1000;
    const m0Base = (Qk * (base - aisc)) / 1000;
    const m0Bull = (Qk * (bull - aisc)) / 1000;
    const regretBull = (Qk * (bull - F2)) / 1000;
    const bearPerd = bear < aisc;                // la mine nue sort l'once à perte en bear
    const compressionPct = (1 - (bear - aisc) / margeSpot) * 100;
    const repMargeSpot = r0(margeSpot);
    const repF2 = r1(F2);
    const repMargeLock = r1(margeLock);
    const repM0Bear = r2(m0Bear);
    const repMHedge = r2(mHedge);
    const repRegret = r2(regretBull);

    const { en, f, usd, pct } = outils(langue);
    const desc = en
      ? `an all-in sustaining cost (AISC) of ${usd(aisc, 0)} an ounce, spot gold at ${usd(S, 0)}, a 2-year curve in slight backwardation (financing ${pct(fin, 1)}, storage ${pct(stock, 1)}, convenience yield ${pct(conv, 1)}), an annual production of ${f(Qk, 0)},000 ounces, and three price scenarios at the 2-year horizon: bear ${usd(bear, 0)}, base ${usd(base, 0)}, bull ${usd(bull, 0)}`
      : `un coût complet (AISC) de ${usd(aisc, 0)} l'once, l'or au comptant à ${usd(S, 0)}, une courbe 2 ans en légère backwardation (financement ${pct(fin, 1)}, stockage ${pct(stock, 1)}, convenience yield ${pct(conv, 1)}), une production annuelle de ${f(Qk, 0)} 000 onces, et trois scénarios de prix à l'horizon 2 ans : bear ${usd(bear, 0)}, base ${usd(base, 0)}, bull ${usd(bull, 0)}`;
    const contexte = (en
      ? [
        `You are the CFO of the gold mine and tonight the board votes the hedging policy: ${desc}. Two camps face off — "lock everything, we are miners, not speculators" against "zero hedge, our shareholders bought gold exposure". Before the vote, you put the full table on the screen: spot margin, locked margin, both policies under all three scenarios — and a recommendation that survives EVERY column.`,
        `Independent director, you have read one slide too many of "natural optimism": ${desc}. Management proposes zero hedging "because gold can only go up". Your fiduciary duty is arithmetic: what the forward locks, what the naked mine earns or loses scenario by scenario, what the hedge gives up in the bull case — and where the company actually dies.`,
        `The examiner ends the viva on the producer's case: "a gold mine, a board, a hedging policy — argue it." The data: ${desc}. He wants the margins computed, the 0% versus 100% table under three scenarios, and a recommendation built on the survival asymmetry — not a price forecast.`,
      ]
      : [
        `Vous êtes le directeur financier de la mine d'or et le conseil vote ce soir la politique de couverture : ${desc}. Deux camps s'affrontent — « tout verrouiller, nous sommes mineurs, pas spéculateurs » contre « zéro hedge, nos actionnaires ont acheté de l'exposition à l'or ». Avant le vote, vous projetez le tableau complet : marge spot, marge verrouillée, les deux politiques sous les trois scénarios — et une recommandation qui survit à TOUTES les colonnes.`,
        `Administrateur indépendant, vous avez lu une slide de trop d'« optimisme naturel » : ${desc}. Le management propose zéro couverture « parce que l'or ne peut que monter ». Votre devoir fiduciaire est arithmétique : ce que le forward verrouille, ce que la mine nue gagne ou perd scénario par scénario, ce que le hedge abandonne en bull — et où l'entreprise meurt vraiment.`,
        `L'examinateur clôt l'oral sur le cas du producteur : « une mine d'or, un board, une politique de couverture — argumentez. » Les données : ${desc}. Il attend les marges calculées, le tableau 0 % contre 100 % sous trois scénarios, et une recommandation bâtie sur l'asymétrie de survie — pas une prévision de prix.`,
      ])[sIdx];

    const tableau = en
      ? `| Gold in 2 years | 0% hedged | 100% hedged |\n|---|---|---|\n| Bear ${f(bear, 0)} $ | ${f(repM0Bear)} M$ | ${f(repMHedge)} M$ |\n| Base ${f(base, 0)} $ | ${f(r2(m0Base))} M$ | ${f(repMHedge)} M$ |\n| Bull ${f(bull, 0)} $ | ${f(r2(m0Bull))} M$ | ${f(repMHedge)} M$ |`
      : `| Or dans 2 ans | 0 % hedgé | 100 % hedgé |\n|---|---|---|\n| Bear ${f(bear, 0)} $ | ${f(repM0Bear)} M$ | ${f(repMHedge)} M$ |\n| Base ${f(base, 0)} $ | ${f(r2(m0Base))} M$ | ${f(repMHedge)} M$ |\n| Bull ${f(bull, 0)} $ | ${f(r2(m0Bull))} M$ | ${f(repMHedge)} M$ |`;

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The cash margin at spot' : 'a) La marge cash au spot',
          enonce: en
            ? `At an AISC of ${usd(aisc, 0)} and a spot of ${usd(S, 0)}, what margin per ounce does the mine clear today, in dollars?`
            : `À l'AISC de ${usd(aisc, 0)} et au spot de ${usd(S, 0)}, quelle marge par once la mine dégage-t-elle aujourd'hui, en dollars ?`,
          reponse: repMargeSpot, tolerance: 1, toleranceMode: 'absolu', unite: en ? '$/oz' : '$/once',
          etapes: [{
            titre: en ? 'AISC: the all-in cost of getting the ounce out' : "L'AISC : le coût complet pour sortir l'once",
            contenu: en
              ? `Margin = ${f(S, 0)} − ${f(aisc, 0)} = **${usd(repMargeSpot, 0)} an ounce** (${pct(r0((margeSpot / aisc) * 100), 0)} above cost). The AISC includes mining, processing, sustaining capex: below it, every ounce produced destroys cash.`
              : `Marge = ${f(S, 0)} − ${f(aisc, 0)} = **${usd(repMargeSpot, 0)} l'once** (${pct(r0((margeSpot / aisc) * 100), 0)} au-dessus du coût). L'AISC inclut extraction, traitement, capex de maintien : en dessous, chaque once produite détruit du cash.`,
          }],
        },
        {
          intitule: en ? 'b) The 2-year forward' : 'b) Le forward 2 ans',
          enonce: en
            ? `Financing ${pct(fin, 1)}, storage ${pct(stock, 1)}, convenience yield ${pct(conv, 1)}: what does the 2-year forward quote, in dollars an ounce?`
            : `Financement ${pct(fin, 1)}, stockage ${pct(stock, 1)}, convenience yield ${pct(conv, 1)} : que cote le forward 2 ans, en dollars l'once ?`,
          reponse: repF2, tolerance: 2, toleranceMode: 'absolu', unite: en ? '$/oz' : '$/once',
          etapes: [{
            titre: en ? 'Net carry below zero: the curve tips over' : 'Portage net sous zéro : la courbe bascule',
            contenu: en
              ? `Net carry = ${f(fin, 1)} + ${f(stock, 1)} − ${f(conv, 1)} = ${pct(netCarry, 1)} a year; F = ${f(S, 0)} × (1 + ${f(netCarry, 1)}/100 × 2) = **${usd(repF2, 1)}**. F < S: slight backwardation — the market pays a premium for metal available NOW.`
              : `Portage net = ${f(fin, 1)} + ${f(stock, 1)} − ${f(conv, 1)} = ${pct(netCarry, 1)} par an ; F = ${f(S, 0)} × (1 + ${f(netCarry, 1)}/100 × 2) = **${usd(repF2, 1)}**. F < S : légère backwardation — le marché paie une prime pour le métal disponible MAINTENANT.`,
          }],
          pieges: [en
            ? `Reading F < S as "the market predicts a gold decline": the curve is carry arithmetic, not a forecast — the same lesson as in FX.`
            : `Lire F < S comme « le marché prédit la baisse de l'or » : la courbe est de l'arithmétique de portage, pas une prévision — même leçon qu'en change.`],
        },
        {
          intitule: en ? 'c) The margin locked for 2 years' : 'c) La marge verrouillée à 2 ans',
          enonce: en
            ? `Selling production forward at ${f(repF2, 1)}, what margin per ounce is locked for the 2-year horizon, in dollars?`
            : `En vendant la production à terme à ${f(repF2, 1)} $, quelle marge par once est verrouillée à l'horizon 2 ans, en dollars ?`,
          reponse: repMargeLock, tolerance: 2, toleranceMode: 'absolu', unite: en ? '$/oz' : '$/once',
          etapes: [{
            titre: en ? 'Certainty has a sticker price' : 'La certitude a un prix affiché',
            contenu: en
              ? `${f(repF2, 1)} − ${f(aisc, 0)} = **${usd(repMargeLock, 1)} an ounce** — a little under the spot margin of ${f(repMargeSpot, 0)}: in backwardation, certainty costs ${f(r1(margeSpot - margeLock), 1)} $ an ounce. Cheap insurance against the bear column you are about to compute.`
              : `${f(repF2, 1)} − ${f(aisc, 0)} = **${usd(repMargeLock, 1)} l'once** — un peu sous la marge spot de ${f(repMargeSpot, 0)} : en backwardation, la certitude se paie ${f(r1(margeSpot - margeLock), 1)} $ l'once. Une assurance bon marché contre la colonne bear que vous allez calculer.`,
          }],
        },
        {
          intitule: en ? 'd) The naked mine in the bear scenario' : 'd) La mine nue dans le scénario bear',
          enonce: en
            ? `0% hedged policy: if gold lands at ${usd(bear, 0)}, what annual margin (production ${f(Qk, 0)},000 ounces), in millions of dollars?`
            : `Politique 0 % hedgé : si l'or atterrit à ${usd(bear, 0)}, quelle marge annuelle (production ${f(Qk, 0)} 000 onces), en millions de dollars ?`,
          reponse: repM0Bear, tolerance: 1, toleranceMode: 'absolu', unite: 'M$',
          etapes: [{
            titre: en ? 'Where companies die' : 'Là où les entreprises meurent',
            contenu: en
              ? `${f(Qk, 0)},000 × (${f(bear, 0)} − ${f(aisc, 0)}) = **${f(repM0Bear)} M$**. ${bearPerd
                ? `Below the AISC, every ounce comes out at a LOSS — and a mine does not pause: maintenance, payroll and debt service keep running. Cash burn, breached covenants, capital raise at the bottom of the cycle: this is the column where the company dies.`
                : `Still positive, but the margin has been compressed by ${pct(r0(compressionPct), 0)} versus today: covenants tighten, the investment plan dies, and the company survives at its bankers' pleasure.`}`
              : `${f(Qk, 0)} 000 × (${f(bear, 0)} − ${f(aisc, 0)}) = **${f(repM0Bear)} M$**. ${bearPerd
                ? `Sous l'AISC, chaque once sort À PERTE — et une mine ne se met pas en pause : maintenance, salaires et service de la dette continuent de courir. Cash burn, covenants cassés, augmentation de capital au plus bas du cycle : c'est la colonne où l'entreprise meurt.`
                : `Encore positive, mais la marge s'est comprimée de ${pct(r0(compressionPct), 0)} par rapport à aujourd'hui : les covenants se tendent, le plan d'investissement meurt, et l'entreprise survit au bon vouloir de ses banquiers.`}`,
          }],
        },
        {
          intitule: en ? 'e) The locked margin, all scenarios' : 'e) La marge verrouillée, tous scénarios',
          enonce: en
            ? `100% hedged policy at ${f(repF2, 1)}: what annual margin, in millions of dollars — whatever gold does?`
            : `Politique 100 % hedgé à ${f(repF2, 1)} $ : quelle marge annuelle, en millions de dollars — quoi que fasse l'or ?`,
          reponse: repMHedge, tolerance: 0.02, unite: 'M$',
          etapes: [
            {
              titre: en ? 'One single line' : 'Une seule et même ligne',
              contenu: en
                ? `${f(Qk, 0)},000 × (${f(repF2, 1)} − ${f(aisc, 0)}) = **${f(repMHedge)} M$** — the same figure in all three columns: that is the entire definition of a hedge.`
                : `${f(Qk, 0)} 000 × (${f(repF2, 1)} − ${f(aisc, 0)}) = **${f(repMHedge)} M$** — le même chiffre dans les trois colonnes : c'est toute la définition d'un hedge.`,
            },
            {
              titre: en ? 'The table the board wants to see' : 'Le tableau que le board veut voir',
              contenu: en
                ? `${tableau}\n\nThe 0% column owns the best cell (bull) AND the worst (bear); the 100% column has only one line. The whole board debate fits in this table.`
                : `${tableau}\n\nLa colonne 0 % possède la meilleure case (bull) ET la pire (bear) ; la colonne 100 % n'a qu'une seule ligne. Tout le débat du conseil tient dans ce tableau.`,
            },
          ],
          pieges: [en
            ? `Comparing the locked margin to TODAY's spot margin misses the point: the alternative is not today's price, it is the unknown price in two years — including the bear column.`
            : `Comparer la marge verrouillée à la marge spot d'AUJOURD'HUI rate le sujet : l'alternative n'est pas le prix du jour, c'est le prix inconnu dans deux ans — colonne bear comprise.`],
        },
        {
          intitule: en ? 'f) The regret in the bull case — and the recommendation' : 'f) Le regret en bull — et la recommandation',
          enonce: en
            ? `If gold runs to ${usd(bull, 0)}, how much does the 100% hedged policy leave on the table against the naked mine, in millions of dollars?`
            : `Si l'or file à ${usd(bull, 0)}, combien la politique 100 % hedgé laisse-t-elle sur la table face à la mine nue, en millions de dollars ?`,
          reponse: repRegret, tolerance: 0.02, unite: 'M$',
          etapes: [
            {
              titre: en ? 'The number the AGM will brandish' : "Le chiffre que l'assemblée générale brandira",
              contenu: en
                ? `${f(Qk, 0)},000 × (${f(bull, 0)} − ${f(repF2, 1)}) = **${f(repRegret)} M$** of forgone upside — survivable financially, explosive politically.`
                : `${f(Qk, 0)} 000 × (${f(bull, 0)} − ${f(repF2, 1)}) = **${f(repRegret)} M$** de manque à gagner — supportable financièrement, explosif politiquement.`,
            },
            {
              titre: en ? 'The recommendation: the survival asymmetry' : "La recommandation : l'asymétrie de survie",
              contenu: en
                ? `Both extremes are indefensible. 0%: in the bear column ${bearPerd
                  ? `the mine LOSES ${f(r2(Math.abs(m0Bear)))} M$ a year — bankruptcy is irreversible, and no future bull market profits a dead miner`
                  : `the margin collapses to ${f(repM0Bear)} M$ — survival passes through covenants and the bankers' mercy`}. 100%: the ${f(repRegret)} M$ of bull-case regret is bearable, but shareholders bought a gold mine FOR the gold exposure — and history punishes total hedgers too (Ashanti and Cambior, 1999: nearly killed by margin calls on their own hedge books when gold jumped; Barrick paid billions in 2009 to close its book). The CFO's answer: a POLICY written before the draw — hedge the fraction that secures the AISC and debt service in the bear scenario (survival first), leave the rest at spot (the upside that justifies the equity), and publish the rule so that nobody judges the policy on ONE column of the table.`
                : `Les deux extrêmes sont indéfendables. 0 % : dans la colonne bear ${bearPerd
                  ? `la mine PERD ${f(r2(Math.abs(m0Bear)))} M$ par an — la faillite est irréversible, et aucun marché haussier futur ne profite à un mineur mort`
                  : `la marge s'effondre à ${f(repM0Bear)} M$ — la survie passe par les covenants et la merci des banquiers`}. 100 % : le regret de ${f(repRegret)} M$ en bull est supportable, mais les actionnaires ont acheté une mine d'or POUR l'exposition à l'or — et l'histoire punit aussi les hedgers totaux (Ashanti et Cambior, 1999 : presque tués par les appels de marge sur leur propre hedge book quand l'or a bondi ; Barrick a payé des milliards en 2009 pour fermer le sien). La réponse du directeur financier : une POLITIQUE écrite avant le tirage — couvrir la fraction qui sécurise l'AISC et le service de la dette dans le scénario bear (la survie d'abord), laisser le reste au spot (l'upside qui justifie l'action), et publier la règle pour que personne ne juge la politique sur UNE colonne du tableau.`,
            },
          ],
          pieges: [en
            ? `Choosing the policy on a price view ("gold will rise") is exactly what a hedging policy exists to forbid: the board decides under uncertainty, the spot is drawn afterwards.`
            : `Choisir la politique sur une vue de prix (« l'or va monter ») est exactement ce qu'une politique de couverture existe pour interdire : le conseil décide sous incertitude, le spot se tire après.`],
        },
      ],
    };
  },
};

export const problemesLot2: ProblemeMoule[] = [
  arbitrageCipComplet, ppaDynamique, producteurHedge, cascadeTresorier,
  defenseDuPeg, carryRouleau, quinzeJanvier, etfQuiSaigne, depegStablecoin, mineOrBoard,
];
