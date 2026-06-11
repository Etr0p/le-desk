/**
 * Moules de problèmes multi-étapes du module Actions & indices — les 20 moules.
 * 7 N2 (Gordon complet, comparables, EV/EBITDA, calendrier de dividende, split,
 * panier d'indice, rendement total), 7 N3 (DDM deux étapes, DCF ± 1 pt, DPS,
 * buyback, IPO, greenshoe, short couvert), 6 boss N4 (DCF + matrice, triangulation,
 * short squeeze, dilution/relution, rebalancement d'indice, anomalie momentum).
 * Chaque moule : 3 scénarios FR + EN, sous-questions chaînées (les valeurs de a)
 * servent en b), c)…), corrigés calculés via calculs.ts — jamais de texte figé.
 * Les tirages aléatoires ont lieu AVANT toute branche de langue : même seed +
 * même scénario ⇒ mêmes nombres en français et en anglais.
 */
import { formatNombreLangue } from '../../../engine/answers';
import { mulberry32, pick, randFloat, randInt } from '../../../engine/rng';
import type { Langue, ProblemGenerator } from '../../../engine/types';
import { statT } from '../02-methodes-quantitatives/calculs';
import {
  ajustementSplit, bpa, coutEmprunTitres, dcfSimple, ddmDeuxEtapes, evSurEbitda,
  gordon, indiceCapiPonderee, per, pnlVenteADecouvert, poidsDansIndice,
  prixTheoriqueExDividende, valeurDroitSouscription, valeurTerminaleGordon,
} from './calculs';

const M3 = '03-actions-indices';
const r1 = (v: number) => Math.round(v * 10) / 10;
const r2 = (v: number) => Math.round(v * 100) / 100;

/** Petits formateurs liés à la langue (les tirages sont déjà faits quand on les crée). */
function outils(langue: Langue) {
  const en = langue === 'en';
  const f = (v: number, d = 2) => formatNombreLangue(langue, v, d);
  const eur = (v: number, d = 2) => (en ? `€${f(v, d)}` : `${f(v, d)} €`);
  const pct = (v: number, d = 2) => (en ? `${f(v, d)}%` : `${f(v, d)} %`);
  return { en, f, eur, pct };
}

/** Médiane de trois valeurs. */
const mediane3 = (a: number, b: number, c: number) => [a, b, c].sort((x, y) => x - y)[1];

/* ------------------------------------------------------------------ */
/* 1. m3-pb-valorisation-gordon-complete — N2                          */
/* ------------------------------------------------------------------ */
const gordonComplete: ProblemGenerator = {
  id: 'm3-pb-valorisation-gordon-complete', moduleId: M3,
  titre: 'Valoriser par Gordon, de g soutenable au verdict',
  titreEn: 'A full Gordon valuation, from sustainable g to the verdict',
  typeDeCas: 'valorisation par les dividendes',
  typeDeCasEn: 'dividend-based valuation',
  difficulte: 2,
  scenarios: ["Analyste buy-side devant une utility", "Comité d'investissement d'une foncière", "Candidat qui prépare l'oral"],
  scenariosEn: ['Buy-side analyst covering a utility', 'Investment committee of a property company', 'Student drilling for the viva'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const roe = randFloat(rng, 9, 16, 1);
    const payout = pick(rng, [50, 60, 70] as const);
    const bpaV = randFloat(rng, 4, 8, 2);
    const marge = randFloat(rng, 2, 4, 1);
    const facteur = pick(rng, [0.82, 0.9, 1.12, 1.25] as const);

    const b = (100 - payout) / 100;
    const g = (roe * (100 - payout)) / 100;
    const r = r2(g + marge);
    const d0 = (bpaV * payout) / 100;
    const d1 = d0 * (1 + g / 100);
    const v = gordon(d1, r, g);
    const cours = r2(v * facteur);
    const cher = cours > v;
    const repG = r2(g);
    const repD1 = r2(d1);
    const repV = r2(v);
    const repEcart = r2((cours / v - 1) * 100);

    const { en, f, eur, pct } = outils(langue);
    const desc = en
      ? `an ROE of ${f(roe, 1)}%, a payout ratio of ${payout}%, EPS of €${f(bpaV)}, a required return of ${f(r)}% and a share price of €${f(cours)} on the tape`
      : `un ROE de ${f(roe, 1)} %, un taux de distribution de ${payout} %, un BPA de ${f(bpaV)} €, un taux exigé de ${f(r)} % et un cours de ${f(cours)} € à l'écran`;
    const contexte = (en
      ? [
        `As a buy-side analyst, you cover a regulated utility — Gordon's natural habitat: ${desc}. Before the morning meeting you rebuild the whole chain: the growth the fundamentals can sustain, next year's dividend, the intrinsic value, and the verdict on the market price.`,
        `The investment committee of a property company reviews a listed peer with ${desc}. The chair wants the four numbers in order — sustainable g, expected dividend, Gordon value, and whether the screen price is rich or cheap — before authorising a single euro.`,
        `Viva drill: the examiner hands you a stable dividend payer with ${desc}, and expects the classic four-step run — derive g from ROE and retention, roll the dividend forward, discount the perpetuity, then dare to call the market price expensive or not.`,
      ]
      : [
        `Analyste buy-side, vous couvrez une utility régulée — l'habitat naturel de Gordon : ${desc}. Avant le morning meeting, vous reconstruisez toute la chaîne : la croissance que les fondamentaux peuvent soutenir, le dividende de l'an prochain, la valeur intrinsèque, et le verdict sur le cours.`,
        `Le comité d'investissement d'une foncière examine une consœur cotée : ${desc}. Le président veut les quatre chiffres dans l'ordre — g soutenable, dividende attendu, valeur de Gordon, et si le cours affiché est cher ou bon marché — avant d'engager un seul euro.`,
        `Entraînement d'oral : l'examinateur vous tend une valeur de rendement stable avec ${desc}, et attend le déroulé classique en quatre temps — déduire g du couple ROE-rétention, faire rouler le dividende, actualiser la perpétuité, puis oser dire si le cours est cher ou non.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The sustainable growth rate' : 'a) La croissance soutenable',
          enonce: en
            ? `What dividend growth rate can the fundamentals sustain, in %?`
            : `Quelle croissance du dividende les fondamentaux peuvent-ils soutenir, en % ?`,
          reponse: repG, tolerance: 0.02, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'g = ROE × b' : 'g = ROE × b',
            contenu: en
              ? `Retention $b$ = 1 − payout = ${f(b * 100, 0)}%. Each retained euro earns the ROE: $g = ROE \\times b$ = ${f(roe, 1)} × ${f(b)} = **${pct(repG)}**.`
              : `Rétention $b$ = 1 − payout = ${f(b * 100, 0)} %. Chaque euro mis en réserve rapporte le ROE : $g = ROE \\times b$ = ${f(roe, 1)} × ${f(b)} = **${pct(repG)}**.`,
          }],
          pieges: [en
            ? `Using the full ROE as g forgets that ${payout}% of earnings leave as dividends: only the retained share compounds.`
            : `Prendre le ROE entier comme g oublie que ${payout} % du bénéfice sort en dividende : seule la part retenue capitalise.`],
        },
        {
          intitule: en ? "b) Next year's dividend" : "b) Le dividende de l'an prochain",
          enonce: en
            ? `What dividend per share should be expected next year (D₁), in euros?`
            : `Quel dividende par action attendre l'an prochain (D₁), en euros ?`,
          reponse: repD1, tolerance: 0.02, toleranceMode: 'absolu', unite: '€',
          etapes: [
            {
              titre: en ? 'Current dividend first' : "Le dividende d'aujourd'hui d'abord",
              contenu: en
                ? `$D_0$ = EPS × payout = ${f(bpaV)} × ${f(payout / 100)} = ${eur(r2(d0))}.`
                : `$D_0$ = BPA × payout = ${f(bpaV)} × ${f(payout / 100)} = ${eur(r2(d0))}.`,
            },
            {
              titre: en ? 'Roll it one year forward' : "Le faire rouler d'un an",
              contenu: en
                ? `$D_1 = D_0 \\times (1+g)$ = ${f(r2(d0))} × ${f(1 + g / 100, 4)} = **${eur(repD1)}**. Gordon discounts NEXT year's dividend, never the current one.`
                : `$D_1 = D_0 \\times (1+g)$ = ${f(r2(d0))} × ${f(1 + g / 100, 4)} = **${eur(repD1)}**. Gordon actualise le dividende de L'AN PROCHAIN, jamais celui d'aujourd'hui.`,
            },
          ],
          pieges: [en
            ? `Plugging D₀ into Gordon shifts the whole valuation down by a factor (1+g) — the classic off-by-one of the formula.`
            : `Mettre D₀ dans Gordon décale toute la valorisation d'un facteur (1+g) — le décalage d'un an classique de la formule.`],
        },
        {
          intitule: en ? 'c) The Gordon value' : 'c) La valeur de Gordon',
          enonce: en
            ? `What is the intrinsic value per share, in euros?`
            : `Quelle est la valeur intrinsèque par action, en euros ?`,
          reponse: repV, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'The growing perpetuity' : 'La perpétuité croissante',
            contenu: en
              ? `$V_0 = \\frac{D_1}{r - g}$ = ${f(repD1)} / (${f(r)}% − ${pct(repG)}) = ${f(repD1)} / ${f((r - g) / 100, 4)} = **${eur(repV)}**. The whole value hangs on the thin spread r − g = ${pct(r2(r - g))}.`
              : `$V_0 = \\frac{D_1}{r - g}$ = ${f(repD1)} / (${f(r)} % − ${pct(repG)}) = ${f(repD1)} / ${f((r - g) / 100, 4)} = **${eur(repV)}**. Toute la valeur tient dans le mince écart r − g = ${pct(r2(r - g))}.`,
          }],
        },
        {
          intitule: en ? 'd) Rich or cheap?' : 'd) Cher ou pas cher ?',
          enonce: en
            ? `By how much does the market price deviate from your intrinsic value, in % (positive = the share looks expensive)?`
            : `De combien le cours s'écarte-t-il de votre valeur intrinsèque, en % (positif = le titre paraît cher) ?`,
          reponse: repEcart, tolerance: 0.2, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'Price against value' : 'Le cours contre la valeur',
              contenu: en
                ? `Gap = ${f(cours)} / ${f(repV)} − 1 = **${pct(repEcart)}**. ${cher ? 'The market pays more than the dividends justify: expensive against your model.' : 'The market pays less than the dividends justify: cheap against your model.'}`
                : `Écart = ${f(cours)} / ${f(repV)} − 1 = **${pct(repEcart)}**. ${cher ? 'Le marché paie plus que ce que les dividendes justifient : cher contre votre modèle.' : 'Le marché paie moins que ce que les dividendes justifient : bon marché contre votre modèle.'}`,
            },
            {
              titre: en ? 'What the verdict really says' : 'Ce que le verdict dit vraiment',
              contenu: en
                ? `"${cher ? 'Expensive' : 'Cheap'}" only means: AT your couple (r = ${pct(r)}, g = ${pct(repG)}). The market may simply price another g or another risk — the model frames the debate, it does not close it.`
                : `« ${cher ? 'Cher' : 'Pas cher'} » signifie seulement : À votre couple (r = ${pct(r)}, g = ${pct(repG)}). Le marché price peut-être un autre g ou un autre risque — le modèle cadre le débat, il ne le clôt pas.`,
            },
          ],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 2. m3-pb-per-comparables — N2                                       */
/* ------------------------------------------------------------------ */
const perComparables: ProblemGenerator = {
  id: 'm3-pb-per-comparables', moduleId: M3,
  titre: 'Valoriser par un échantillon de comparables',
  titreEn: 'Pricing off a sample of comparables',
  typeDeCas: 'multiples boursiers',
  typeDeCasEn: 'trading multiples',
  difficulte: 2,
  scenarios: ['Analyste M&A qui cale un prix', 'Gérant value en quête de décote', 'Banquier qui pitche une cible'],
  scenariosEn: ['M&A analyst anchoring a price', 'Value manager hunting a discount', 'Banker pitching a target'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const p1 = randFloat(rng, 10, 14, 1);
    const p2 = randFloat(rng, 13, 17, 1);
    const p3 = randFloat(rng, 16, 22, 1);
    const bpaC = randFloat(rng, 2.5, 6, 2);
    const facteur = randFloat(rng, 0.78, 0.92, 2);

    const med = mediane3(p1, p2, p3);
    const implicite = med * bpaC;
    const cours = r2(implicite * facteur);
    const perAct = per(cours, bpaC);
    const decote = (1 - cours / implicite) * 100;
    const moyenne = (p1 + p2 + p3) / 3;
    const repMed = r2(med);
    const repImp = r2(implicite);
    const repPer = r2(perAct);
    const repDec = r2(decote);

    const { en, f, eur, pct } = outils(langue);
    const desc = en
      ? `three listed peers trade at P/E ratios of ${f(p1, 1)}, ${f(p2, 1)} and ${f(p3, 1)}; the target posts an EPS of €${f(bpaC)} and its share trades at €${f(cours)}`
      : `trois comparables cotés affichent des PER de ${f(p1, 1)}, ${f(p2, 1)} et ${f(p3, 1)} ; la cible publie un BPA de ${f(bpaC)} € et son action cote ${f(cours)} €`;
    const contexte = (en
      ? [
        `In the M&A team, you anchor a first price for a client: ${desc}. The managing director wants the standard sequence — the central multiple of the sample, the implied price, where the target actually trades, and the size of the discount.`,
        `As a value manager, you screen for shares trading below their peers: ${desc}. Before adding the line, you quantify exactly how far below the sample the market prices the target — and you stay suspicious about why.`,
        `Pitching the board of a family-owned company, you must show what the market would pay: ${desc}. The slide needs four defendable numbers: sample multiple, implied price, current multiple, discount.`,
      ]
      : [
        `À l'équipe M&A, vous calez un premier prix pour un client : ${desc}. Le directeur veut la séquence standard — le multiple central de l'échantillon, le prix implicite, où la cible cote réellement, et l'ampleur de la décote.`,
        `Gérant value, vous criblez les titres qui cotent sous leurs pairs : ${desc}. Avant d'ajouter la ligne, vous chiffrez précisément de combien le marché price la cible sous l'échantillon — et vous restez méfiant sur le pourquoi.`,
        `Pour pitcher le conseil d'une société familiale, vous devez montrer ce que le marché paierait : ${desc}. La slide exige quatre chiffres défendables : multiple de l'échantillon, prix implicite, multiple actuel, décote.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The central multiple' : 'a) Le multiple central',
          enonce: en
            ? `What P/E should anchor the valuation (median of the sample)?`
            : `Quel PER retenir pour ancrer la valorisation (médiane de l'échantillon) ?`,
          reponse: repMed, tolerance: 0.05, toleranceMode: 'absolu', unite: '×',
          etapes: [{
            titre: en ? 'Median, not mean' : 'La médiane, pas la moyenne',
            contenu: en
              ? `Sorted: ${[p1, p2, p3].sort((a, b) => a - b).map(x => f(x, 1)).join(' < ')}. The median is **${f(repMed, 1)}×** — robust to the outlier, unlike the mean of ${f(r2(moyenne), 1)}× which one exuberant peer can drag.`
              : `Trié : ${[p1, p2, p3].sort((a, b) => a - b).map(x => f(x, 1)).join(' < ')}. La médiane vaut **${f(repMed, 1)}×** — robuste à la valeur extrême, contrairement à la moyenne de ${f(r2(moyenne), 1)}× qu'un seul comparable exubérant peut tirer.`,
          }],
          pieges: [en
            ? `Averaging the three multiples (${f(r2(moyenne), 1)}×) lets the most expensive peer set your price: with 3 points, the median is the defendable anchor.`
            : `Moyenner les trois multiples (${f(r2(moyenne), 1)}×) laisse le comparable le plus cher fixer votre prix : à 3 points, la médiane est l'ancre défendable.`],
        },
        {
          intitule: en ? 'b) The implied price' : 'b) Le prix implicite',
          enonce: en
            ? `Applying the median multiple to the target's EPS, what share price does the sample imply, in euros?`
            : `En appliquant le multiple médian au BPA de la cible, quel prix par action l'échantillon implique-t-il, en euros ?`,
          reponse: repImp, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'Multiple × earnings' : 'Multiple × bénéfice',
            contenu: en
              ? `$P = PER_{med} \\times BPA$ = ${f(repMed, 1)} × ${f(bpaC)} = **${eur(repImp)}**. The whole method in one line: the peers lend the target their price of a euro of earnings.`
              : `$P = PER_{med} \\times BPA$ = ${f(repMed, 1)} × ${f(bpaC)} = **${eur(repImp)}**. Toute la méthode en une ligne : les pairs prêtent à la cible leur prix d'un euro de bénéfice.`,
          }],
        },
        {
          intitule: en ? "c) The target's current multiple" : 'c) Le multiple actuel de la cible',
          enonce: en
            ? `At its market price, what P/E does the target actually trade at?`
            : `À son cours actuel, quel PER la cible affiche-t-elle réellement ?`,
          reponse: repPer, tolerance: 0.05, toleranceMode: 'absolu', unite: '×',
          etapes: [{
            titre: en ? 'Price over earnings' : 'Cours sur bénéfice',
            contenu: en
              ? `$PER = P / BPA$ = ${f(cours)} / ${f(bpaC)} = **${f(repPer)}×**, against ${f(repMed, 1)}× for the sample: the market pays the target's earnings less than its peers'.`
              : `$PER = P / BPA$ = ${f(cours)} / ${f(bpaC)} = **${f(repPer)}×**, contre ${f(repMed, 1)}× pour l'échantillon : le marché paie le bénéfice de la cible moins cher que celui de ses pairs.`,
          }],
        },
        {
          intitule: en ? 'd) The discount' : 'd) La décote',
          enonce: en
            ? `By how much does the market price stand below the implied price, in %?`
            : `De combien le cours se situe-t-il sous le prix implicite, en % ?`,
          reponse: repDec, tolerance: 0.2, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'Measure the gap' : "Mesurer l'écart",
              contenu: en
                ? `Discount = 1 − ${f(cours)} / ${f(repImp)} = **${pct(repDec)}**.`
                : `Décote = 1 − ${f(cours)} / ${f(repImp)} = **${pct(repDec)}**.`,
            },
            {
              titre: en ? 'Cheap, or cheap for a reason?' : 'Décotée, ou décotée pour une raison ?',
              contenu: en
                ? `A ${pct(repDec, 0)} discount is an opportunity only if the comparables truly compare — same growth, same risk, same accounting. Half of the multiples craft is in choosing the sample, the other half in explaining the residual gap.`
                : `Une décote de ${pct(repDec, 0)} n'est une opportunité que si les comparables comparent vraiment — même croissance, même risque, même comptabilité. La moitié du métier des multiples tient dans le choix de l'échantillon, l'autre dans l'explication de l'écart résiduel.`,
            },
          ],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 3. m3-pb-ev-ebitda-complet — N2                                     */
/* ------------------------------------------------------------------ */
const evEbitdaComplet: ProblemGenerator = {
  id: 'm3-pb-ev-ebitda-complet', moduleId: M3,
  titre: "De la capitalisation à l'EV/EBITDA, aller-retour",
  titreEn: 'From market cap to EV/EBITDA and back',
  typeDeCas: 'multiples de valeur d\'entreprise',
  typeDeCasEn: 'enterprise-value multiples',
  difficulte: 2,
  scenarios: ['Analyste crédit qui compare au secteur', 'Fonds de private equity en revue de cible', 'Vendeur sell-side qui défend sa recommandation'],
  scenariosEn: ['Credit analyst benchmarking against the sector', 'Private-equity fund screening a target', 'Sell-side salesperson defending a call'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const nb = randInt(rng, 20, 80);
    const prix = randFloat(rng, 18, 60, 2);
    const dette = randInt(rng, -20, 80) * 10;
    const ebitda = randInt(rng, 150, 600);
    const mult = randFloat(rng, 6, 11, 1);

    const capi = nb * prix;
    const ev = capi + dette;
    const multAct = evSurEbitda(capi, dette, ebitda);
    const prixImp = (mult * ebitda - dette) / nb;
    const ecart = (prix / prixImp - 1) * 100;
    const treso = dette < 0;
    const repCapi = r2(capi);
    const repEv = r2(ev);
    const repMult = r2(multAct);
    const repPrixImp = r2(prixImp);
    const repEcart = r2(ecart);

    const { en, f, eur, pct } = outils(langue);
    const desc = en
      ? `${f(nb, 0)} million shares at €${f(prix)}, net debt of €${f(dette, 0)} million, EBITDA of €${f(ebitda, 0)} million and a sector multiple of ${f(mult, 1)}x`
      : `${f(nb, 0)} millions d'actions à ${f(prix)} €, une dette nette de ${f(dette, 0)} M€, un EBITDA de ${f(ebitda, 0)} M€ et un multiple sectoriel de ${f(mult, 1)}×`;
    const contexte = (en
      ? [
        `As a credit analyst, you benchmark an issuer against its sector: ${desc}. The committee reads EV/EBITDA before anything else — you rebuild it from scratch, then turn the sector multiple into an implied share price.`,
        `A private-equity fund screens a listed target: ${desc}. The partner wants the bridge in full: market cap, enterprise value, the multiple the market currently pays, and what the share would be worth at the sector multiple.`,
        `On the sell-side desk, a client challenges your recommendation: ${desc}. You walk them through the chain — cap, EV, multiple, implied price — and conclude on whether the market over- or under-prices the stock against its sector.`,
      ]
      : [
        `Analyste crédit, vous comparez un émetteur à son secteur : ${desc}. Le comité lit l'EV/EBITDA avant toute chose — vous le reconstruisez de zéro, puis transformez le multiple sectoriel en prix implicite par action.`,
        `Un fonds de private equity passe une cible cotée en revue : ${desc}. L'associé veut le pont complet : capitalisation, valeur d'entreprise, multiple actuellement payé par le marché, et ce que vaudrait l'action au multiple du secteur.`,
        `Au desk sell-side, un client conteste votre recommandation : ${desc}. Vous déroulez la chaîne — capi, EV, multiple, prix implicite — et concluez sur la sur- ou sous-cote du titre face à son secteur.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The market capitalisation' : 'a) La capitalisation boursière',
          enonce: en ? `What is the market cap, in millions of euros?` : `Quelle est la capitalisation, en millions d'euros ?`,
          reponse: repCapi, tolerance: 0.005, unite: 'M€',
          etapes: [{
            titre: en ? 'Shares × price' : 'Titres × cours',
            contenu: en
              ? `Cap = ${f(nb, 0)} × ${f(prix)} = **${eur(repCapi, 0)} million** — the price of all the equity at today's quote.`
              : `Capi = ${f(nb, 0)} × ${f(prix)} = **${f(repCapi, 0)} M€** — le prix de tous les capitaux propres au cours du jour.`,
          }],
        },
        {
          intitule: en ? 'b) The enterprise value' : "b) La valeur d'entreprise",
          enonce: en ? `What is the enterprise value, in millions of euros?` : `Quelle est la valeur d'entreprise, en millions d'euros ?`,
          reponse: repEv, tolerance: 0.005, unite: 'M€',
          etapes: [{
            titre: en ? 'Add what the buyer would assume' : "Ajouter ce que l'acheteur reprendrait",
            contenu: en
              ? `$EV$ = cap + net debt = ${f(repCapi, 0)} ${dette >= 0 ? '+' : '−'} ${f(Math.abs(dette), 0)} = **${eur(repEv, 0)} million**. ${treso ? 'Negative net debt — net cash — LOWERS the EV: the buyer pockets the till.' : 'Buying the equity also means servicing the debt: EV is the full bill.'}`
              : `$EV$ = capi + dette nette = ${f(repCapi, 0)} ${dette >= 0 ? '+' : '−'} ${f(Math.abs(dette), 0)} = **${f(repEv, 0)} M€**. ${treso ? 'Une dette nette négative — une trésorerie nette — DIMINUE l\'EV : l\'acheteur empoche la caisse.' : 'Acheter les actions, c\'est aussi servir la dette : l\'EV est la facture complète.'}`,
          }],
          pieges: [en
            ? `Comparing the bare market cap to an EV multiple mixes two perimeters: EBITDA accrues to ALL capital providers, debt included.`
            : `Comparer la capitalisation nue à un multiple d'EV mélange deux périmètres : l'EBITDA revient à TOUS les apporteurs de capitaux, dette comprise.`],
        },
        {
          intitule: en ? 'c) The multiple the market pays' : 'c) Le multiple payé par le marché',
          enonce: en ? `What EV/EBITDA does the stock currently trade at?` : `Quel EV/EBITDA le titre paie-t-il actuellement ?`,
          reponse: repMult, tolerance: 0.05, toleranceMode: 'absolu', unite: '×',
          etapes: [{
            titre: en ? 'EV over EBITDA' : 'EV sur EBITDA',
            contenu: en
              ? `$EV/EBITDA$ = ${f(repEv, 0)} / ${f(ebitda, 0)} = **${f(repMult)}×**, against ${f(mult, 1)}× for the sector.`
              : `$EV/EBITDA$ = ${f(repEv, 0)} / ${f(ebitda, 0)} = **${f(repMult)}×**, contre ${f(mult, 1)}× pour le secteur.`,
          }],
        },
        {
          intitule: en ? 'd) The implied share price' : "d) Le prix implicite par action",
          enonce: en
            ? `At the sector multiple, what share price is implied, in euros?`
            : `Au multiple sectoriel, quel prix par action est implicite, en euros ?`,
          reponse: repPrixImp, tolerance: 0.005, unite: '€',
          etapes: [
            {
              titre: en ? 'Walk the bridge backwards' : 'Reprendre le pont à l\'envers',
              contenu: en
                ? `Implied EV = ${f(mult, 1)} × ${f(ebitda, 0)} = ${f(r2(mult * ebitda), 0)}; implied cap = ${f(r2(mult * ebitda), 0)} − (${f(dette, 0)}) = ${f(r2(mult * ebitda - dette), 0)}.`
                : `EV implicite = ${f(mult, 1)} × ${f(ebitda, 0)} = ${f(r2(mult * ebitda), 0)} ; capi implicite = ${f(r2(mult * ebitda), 0)} − (${f(dette, 0)}) = ${f(r2(mult * ebitda - dette), 0)}.`,
            },
            {
              titre: en ? 'Per share' : 'Par action',
              contenu: en
                ? `Price = ${f(r2(mult * ebitda - dette), 0)} / ${f(nb, 0)} = **${eur(repPrixImp)}**. The debt must come OFF before dividing by the share count.`
                : `Prix = ${f(r2(mult * ebitda - dette), 0)} / ${f(nb, 0)} = **${eur(repPrixImp)}**. La dette doit SORTIR avant de diviser par le nombre d'actions.`,
            },
          ],
        },
        {
          intitule: en ? 'e) The verdict against the sector' : 'e) Le verdict face au secteur',
          enonce: en
            ? `By how much does the market price deviate from the implied price, in % (positive = the stock trades rich)?`
            : `De combien le cours s'écarte-t-il du prix implicite, en % (positif = le titre cote cher) ?`,
          reponse: repEcart, tolerance: 0.3, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Price against the sector' : 'Le cours contre le secteur',
            contenu: en
              ? `Gap = ${f(prix)} / ${f(repPrixImp)} − 1 = **${pct(repEcart)}**. ${repEcart > 0 ? 'The market pays this EBITDA more than the sector does — justified premium or anomaly: that is the analyst\'s question.' : 'The market pays this EBITDA less than the sector does — discount to explain before calling it cheap.'}`
              : `Écart = ${f(prix)} / ${f(repPrixImp)} − 1 = **${pct(repEcart)}**. ${repEcart > 0 ? 'Le marché paie cet EBITDA plus cher que le secteur — prime justifiée ou anomalie : c\'est la question de l\'analyste.' : 'Le marché paie cet EBITDA moins cher que le secteur — décote à expliquer avant de crier à l\'aubaine.'}`,
          }],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 4. m3-pb-calendrier-dividende — N2                                  */
/* ------------------------------------------------------------------ */
const calendrierDividende: ProblemGenerator = {
  id: 'm3-pb-calendrier-dividende', moduleId: M3,
  titre: 'Le calendrier du dividende, sans miracle',
  titreEn: 'The dividend calendar, no free lunch',
  typeDeCas: 'opérations sur titres',
  typeDeCasEn: 'corporate actions',
  difficulte: 2,
  scenarios: ['Particulier tenté par le dividend capture', 'Assistant de gestion sous règlement T+2', 'Candidat face à la question piège du jury'],
  scenariosEn: ['Retail investor tempted by dividend capture', 'Portfolio assistant under T+2 settlement', 'Candidate facing the jury trick question'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const q = pick(rng, [100, 200, 300, 500] as const);
    const P = randFloat(rng, 40, 120, 2);
    const D = randFloat(rng, 1.5, 5, 2);
    const frais = pick(rng, [0.2, 0.3, 0.5] as const);

    const pex = prixTheoriqueExDividende(P, D);
    const richesse = q * P;
    const fraisTot = (frais / 100) * q * (P + (P - D));
    const repPex = r2(pex);
    const repRichesse = r2(richesse);
    const repNet = r2(-fraisTot);

    const { en, f, eur, pct } = outils(langue);
    const desc = en
      ? `${q} shares of a stock trading at €${f(P)}, a dividend of €${f(D)} going ex tomorrow and brokerage fees of ${f(frais, 1)}% on each leg`
      : `${q} actions d'un titre à ${f(P)} €, un dividende de ${f(D)} € détaché demain et des frais de courtage de ${f(frais, 1)} % par jambe`;
    const contexte = (en
      ? [
        `A friend swears he has found the trick of the century: buy tonight, pocket the dividend tomorrow, sell right away. The case: ${desc}. Before he wires his savings, you run the four numbers that dismantle the scheme.`,
        `As a portfolio assistant, you brief a junior on settlement mechanics: ${desc}. Under T+2, the record date follows the ex-date by one business day — but the date that moves the price is the ex-date, and you prove it with the numbers below.`,
        `The jury smiles and asks its favourite trap: "a stock detaches its dividend tomorrow — quick gain?" The case on the table: ${desc}. Your answer must show the price adjustment, the wealth neutrality, and what fees do to the residual.`,
      ]
      : [
        `Un ami jure avoir trouvé le truc du siècle : acheter ce soir, encaisser le dividende demain, revendre aussitôt. Le dossier : ${desc}. Avant qu'il ne vire ses économies, vous déroulez les quatre chiffres qui démontent le mécanisme.`,
        `Assistant de gestion, vous formez un junior à la mécanique de règlement : ${desc}. Sous T+2, la record date suit l'ex-date d'un jour ouvré — mais la date qui fait bouger le prix est l'ex-date, et vous le prouvez par les chiffres ci-dessous.`,
        `Le jury sourit et pose son piège favori : « un titre détache son dividende demain — gain rapide ? » Le dossier sur la table : ${desc}. Votre réponse doit montrer l'ajustement du cours, la neutralité patrimoniale, et ce que les frais font au résidu.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The theoretical ex-dividend price' : 'a) Le prix théorique ex-dividende',
          enonce: en
            ? `At what price should the share open on the ex-date, all else equal, in euros?`
            : `À quel prix le titre doit-il ouvrir le jour du détachement, toutes choses égales par ailleurs, en euros ?`,
          reponse: repPex, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'The mechanical adjustment' : "L'ajustement mécanique",
            contenu: en
              ? `From the ex-date, buying no longer carries the dividend: the share is worth the dividend less. $P_{ex} = P - D$ = ${f(P)} − ${f(D)} = **${eur(repPex)}**.`
              : `À partir de l'ex-date, acheter ne donne plus droit au dividende : le titre vaut le dividende de moins. $P_{ex} = P - D$ = ${f(P)} − ${f(D)} = **${eur(repPex)}**.`,
          }],
        },
        {
          intitule: en ? "b) The holder's wealth on ex-morning" : "b) La richesse du détenteur au matin du détachement",
          enonce: en
            ? `An investor bought the ${q} shares the day before. On ex-morning, what is his total wealth (shares + dividend receivable), in euros?`
            : `Un investisseur a acheté les ${q} titres la veille. Au matin du détachement, que vaut sa richesse totale (titres + dividende à recevoir), en euros ?`,
          reponse: repRichesse, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'Two pockets, same total' : 'Deux poches, même total',
            contenu: en
              ? `Shares: ${q} × ${f(repPex)} = ${eur(r2(q * pex))}. Dividend: ${q} × ${f(D)} = ${eur(r2(q * D))}. Total = **${eur(repRichesse)}** — exactly ${q} × ${f(P)}: the dividend moved money from the share pocket to the cash pocket, nothing more.`
              : `Titres : ${q} × ${f(repPex)} = ${eur(r2(q * pex))}. Dividende : ${q} × ${f(D)} = ${eur(r2(q * D))}. Total = **${eur(repRichesse)}** — exactement ${q} × ${f(P)} : le dividende a déplacé de l'argent de la poche « titre » vers la poche « espèces », rien de plus.`,
          }],
          pieges: [en
            ? `Counting the dividend as a gain double-counts: the share price already dropped by the same amount at the open.`
            : `Compter le dividende comme un gain est un double compte : le cours a déjà baissé du même montant à l'ouverture.`],
        },
        {
          intitule: en ? 'c) The capture gain, before fees' : 'c) Le gain du capture, avant frais',
          enonce: en
            ? `Buy the day before, collect the dividend, sell at the theoretical ex-price: what is the gain before fees, in euros?`
            : `Acheter la veille, toucher le dividende, revendre au prix théorique ex : quel est le gain avant frais, en euros ?`,
          reponse: 0, tolerance: 0.5, toleranceMode: 'absolu', unite: '€',
          etapes: [{
            titre: en ? 'The arithmetic of nothing' : "L'arithmétique du néant",
            contenu: en
              ? `Sale ${f(repPex)} + dividend ${f(D)} − purchase ${f(P)} = **€0** per share. The "trick" buys a euro for a euro: if it paid, it would have been arbitraged away long ago — that is market efficiency, chapter 7.`
              : `Vente ${f(repPex)} + dividende ${f(D)} − achat ${f(P)} = **0 €** par action. Le « truc » achète un euro contre un euro : s'il rapportait, il serait arbitré depuis longtemps — c'est l'efficience du marché, chapitre 7.`,
          }],
        },
        {
          intitule: en ? 'd) The capture P&L, after fees' : 'd) Le P&L du capture, après frais',
          enonce: en
            ? `With ${f(frais, 1)}% fees on each leg (buy then sell), what is the net P&L of the round trip, in euros?`
            : `Avec ${f(frais, 1)} % de frais sur chaque jambe (achat puis vente), quel est le P&L net de l'aller-retour, en euros ?`,
          reponse: repNet, tolerance: 0.5, toleranceMode: 'absolu', unite: '€',
          etapes: [
            {
              titre: en ? 'Price the two legs' : 'Chiffrer les deux jambes',
              contenu: en
                ? `Buy leg: ${pct(frais, 1)} × ${q} × ${f(P)} = ${eur(r2((frais / 100) * q * P))}. Sell leg: ${pct(frais, 1)} × ${q} × ${f(repPex)} = ${eur(r2((frais / 100) * q * pex))}.`
                : `Jambe achat : ${pct(frais, 1)} × ${q} × ${f(P)} = ${eur(r2((frais / 100) * q * P))}. Jambe vente : ${pct(frais, 1)} × ${q} × ${f(repPex)} = ${eur(r2((frais / 100) * q * pex))}.`,
            },
            {
              titre: en ? 'Zero minus the fees' : 'Zéro moins les frais',
              contenu: en
                ? `Net P&L = 0 − fees = **${eur(repNet)}**. Theoretically neutral, practically destructive — and the dividend tax would deepen the hole further.`
                : `P&L net = 0 − frais = **${eur(repNet)}**. Théoriquement neutre, pratiquement destructeur — et la fiscalité du dividende creuserait encore le trou.`,
            },
          ],
          pieges: [en
            ? `Forgetting the second leg halves the damage: a capture is an aller-retour, both trades pay fees.`
            : `Oublier la seconde jambe divise le dégât par deux : un capture est un aller-retour, les deux ordres paient des frais.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 5. m3-pb-split-et-capi — N2                                         */
/* ------------------------------------------------------------------ */
const splitEtCapi: ProblemGenerator = {
  id: 'm3-pb-split-et-capi', moduleId: M3,
  titre: 'Un split ne crée rien : la preuve par quatre',
  titreEn: 'A split creates nothing: proof in four steps',
  typeDeCas: 'opérations sur titres',
  typeDeCasEn: 'corporate actions',
  difficulte: 2,
  scenarios: ['Conseiller face à un client euphorique', 'Middle-office qui ajuste les positions', "Candidat interrogé sur l'affaire du titre « moins cher »"],
  scenariosEn: ['Adviser facing an euphoric client', 'Middle office adjusting the books', 'Candidate quizzed on the "cheaper share" story'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const ratio = pick(rng, [2, 4, 5, 10] as const);
    const pNew = randFloat(rng, 22, 90, 2);
    const P = r2(pNew * ratio);
    const nb = randInt(rng, 20, 90); // millions de titres avant split
    const q = pick(rng, [100, 200, 400, 500] as const); // titres du client

    const pApres = ajustementSplit(P, ratio);
    const nbApres = nb * ratio;
    const capi = P * nb;
    const position = q * P;
    const repP = r2(pApres);
    const repNb = r2(nbApres);
    const repCapi = r2(capi);
    const repPos = r2(position);

    const { en, f, eur } = outils(langue);
    const desc = en
      ? `the share trades at €${f(P)}, ${f(nb, 0)} million shares are outstanding, the board votes a ${ratio}-for-1 split, and your client holds ${f(q, 0)} shares`
      : `le titre cote ${f(P)} €, ${f(nb, 0)} millions d'actions sont en circulation, le conseil vote un split ${ratio} pour 1, et votre client détient ${f(q, 0)} actions`;
    const contexte = (en
      ? [
        `Your client calls, thrilled: "the share will be ${ratio} times cheaper, I'm buying!" The facts: ${desc}. Before he orders anything, you walk him through the four numbers that show a split changes the wrapper, never the contents.`,
        `In the middle office, you adjust the books on the morning of the operation: ${desc}. The checklist is always the same — new price, new share count, unchanged market cap, unchanged client position — and any breach triggers an alert.`,
        `The jury loves the story of the share that becomes "cheaper": ${desc}. Your answer must produce the post-split price, the post-split share count, and prove twice that nobody got richer — at the company level and at the client level.`,
      ]
      : [
        `Votre client appelle, ravi : « le titre va valoir ${ratio} fois moins cher, j'achète ! » Les faits : ${desc}. Avant qu'il ne passe le moindre ordre, vous déroulez les quatre chiffres qui montrent qu'un split change l'emballage, jamais le contenu.`,
        `Au middle-office, vous ajustez les positions au matin de l'opération : ${desc}. La checklist ne varie pas — nouveau cours, nouveau nombre de titres, capitalisation inchangée, position client inchangée — et tout écart déclenche une alerte.`,
        `Le jury adore l'histoire du titre devenu « moins cher » : ${desc}. Votre réponse doit produire le cours post-split, le nombre de titres post-split, et prouver deux fois que personne ne s'est enrichi — au niveau de la société et au niveau du client.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The post-split price' : 'a) Le cours post-split',
          enonce: en
            ? `At what price should the share open after the ${ratio}-for-1 split, in euros?`
            : `À quel cours le titre doit-il ouvrir après le split ${ratio} pour 1, en euros ?`,
          reponse: repP, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'Divide the price by the ratio' : 'Diviser le cours par le ratio',
            contenu: en
              ? `$P_{new} = P / ${ratio}$ = ${f(P)} / ${ratio} = **${eur(repP)}**. Each old share becomes ${ratio} new ones; each new one carries 1/${ratio} of the old claim.`
              : `$P_{new} = P / ${ratio}$ = ${f(P)} / ${ratio} = **${eur(repP)}**. Chaque action ancienne devient ${ratio} nouvelles ; chacune porte 1/${ratio} du droit ancien.`,
          }],
          pieges: [en
            ? `"Cheaper" here means a smaller ticket, not a better deal: the P/E, the yield and the value are strictly unchanged.`
            : `« Moins cher » signifie ici un ticket plus petit, pas une meilleure affaire : PER, rendement et valeur sont strictement inchangés.`],
        },
        {
          intitule: en ? 'b) The post-split share count' : 'b) Le nombre de titres post-split',
          enonce: en
            ? `How many shares are outstanding after the split, in millions?`
            : `Combien d'actions sont en circulation après le split, en millions ?`,
          reponse: repNb, tolerance: 0.005, unite: en ? 'millions' : 'millions',
          etapes: [{
            titre: en ? 'Multiply the count by the ratio' : 'Multiplier le nombre par le ratio',
            contenu: en
              ? `$N_{new} = N \\times ${ratio}$ = ${f(nb, 0)} × ${ratio} = **${f(repNb, 0)} million** shares. The cake is cut into ${ratio} times more slices.`
              : `$N_{new} = N \\times ${ratio}$ = ${f(nb, 0)} × ${ratio} = **${f(repNb, 0)} millions** de titres. Le gâteau est découpé en ${ratio} fois plus de parts.`,
          }],
        },
        {
          intitule: en ? 'c) The market cap, before and after' : 'c) La capitalisation, avant et après',
          enonce: en
            ? `What is the market capitalisation after the split, in millions of euros?`
            : `Quelle est la capitalisation après le split, en millions d'euros ?`,
          reponse: repCapi, tolerance: 0.005, unite: 'M€',
          etapes: [{
            titre: en ? 'Two routes, one number' : 'Deux routes, un seul chiffre',
            contenu: en
              ? `Before: ${f(nb, 0)} × ${f(P)} = ${f(repCapi, 0)}. After: ${f(repNb, 0)} × ${f(repP)} = **€${f(repCapi, 0)} million** as well. The ${ratio} and the 1/${ratio} cancel exactly: the split is a pure renumbering.`
              : `Avant : ${f(nb, 0)} × ${f(P)} = ${f(repCapi, 0)}. Après : ${f(repNb, 0)} × ${f(repP)} = **${f(repCapi, 0)} M€** aussi. Le ${ratio} et le 1/${ratio} s'annulent exactement : le split est une pure renumérotation.`,
          }],
          pieges: [en
            ? `If your "after" cap differs from the "before" cap, you have created or destroyed money with a stroke of the pen — re-check the arithmetic.`
            : `Si votre capi « après » diffère de la capi « avant », vous avez créé ou détruit de l'argent d'un trait de plume — revoyez le calcul.`],
        },
        {
          intitule: en ? "d) The client's position" : 'd) La position du client',
          enonce: en
            ? `What is the client's position worth right after the split, in euros?`
            : `Que vaut la position du client juste après le split, en euros ?`,
          reponse: repPos, tolerance: 0.005, unite: '€',
          etapes: [
            {
              titre: en ? 'More shares, smaller price' : 'Plus de titres, prix plus petit',
              contenu: en
                ? `He now holds ${f(q, 0)} × ${ratio} = ${f(q * ratio, 0)} shares at ${eur(repP)} each: ${f(q * ratio, 0)} × ${f(repP)} = **${eur(repPos)}** — exactly ${f(q, 0)} × ${f(P)}, his pre-split wealth.`
                : `Il détient désormais ${f(q, 0)} × ${ratio} = ${f(q * ratio, 0)} titres à ${eur(repP)} pièce : ${f(q * ratio, 0)} × ${f(repP)} = **${eur(repPos)}** — exactement ${f(q, 0)} × ${f(P)}, sa richesse d'avant.`,
            },
            {
              titre: en ? 'Why split, then?' : 'Pourquoi splitter, alors ?',
              contenu: en
                ? `Liquidity and accessibility: a smaller ticket widens the shareholder base and tightens spreads. Any price pop around a split is sentiment, not arithmetic.`
                : `Liquidité et accessibilité : un ticket plus petit élargit l'actionnariat et resserre les fourchettes. Toute hausse autour d'un split relève du sentiment, pas de l'arithmétique.`,
            },
          ],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 6. m3-pb-panier-indice — N2                                         */
/* ------------------------------------------------------------------ */
const panierIndice: ProblemGenerator = {
  id: 'm3-pb-panier-indice', moduleId: M3,
  titre: "Trois titres, un indice : poids et variation",
  titreEn: 'Three stocks, one index: weights and moves',
  typeDeCas: 'construction d\'indice',
  typeDeCasEn: 'index construction',
  difficulte: 2,
  scenarios: ["Stagiaire chargé de répliquer un mini-indice", 'Journaliste qui vérifie un chiffre de séance', 'Candidat face à la mécanique du CAC'],
  scenariosEn: ['Intern asked to replicate a mini index', 'Journalist fact-checking an intraday figure', 'Candidate drilled on CAC mechanics'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Le constituant 1 est construit pour être STRICTEMENT le plus lourd :
    // capi flottante min (80 × 210 × 0,9 = 15 120) > max des deux autres (120 × 120 × 1 = 14 400).
    const c1 = { prix: randInt(rng, 80, 150), nbTitres: randInt(rng, 210, 300), flottantPct: pick(rng, [90, 100] as const) };
    const c2 = { prix: randInt(rng, 40, 120), nbTitres: randInt(rng, 60, 120), flottantPct: pick(rng, [70, 80, 90, 100] as const) };
    const c3 = { prix: randInt(rng, 40, 120), nbTitres: randInt(rng, 20, 50), flottantPct: pick(rng, [70, 80, 90, 100] as const) };
    const x = randFloat(rng, 2, 6, 1);
    const L0 = pick(rng, [1000, 1500, 2000, 3000, 4000, 5000] as const);

    const cells = [c1, c2, c3];
    const capiF = indiceCapiPonderee(cells);
    const poids = poidsDansIndice(cells);
    const poidsMax = Math.max(...poids);
    const varPct = (poidsMax * x) / 100;
    const niveau = L0 * (1 + varPct / 100);
    const repCapi = r2(capiF);
    const repPoids = r2(poidsMax);
    const repVar = r2(varPct);
    const repNiveau = r2(niveau);

    const { en, f, pct } = outils(langue);
    const noms = ['Alphacorp', 'Bryotech', 'Cervin'];
    const fiche = (c: { prix: number; nbTitres: number; flottantPct: number }, i: number) => en
      ? `${noms[i]} (price €${f(c.prix, 0)}, ${f(c.nbTitres, 0)} million shares, ${c.flottantPct}% free float)`
      : `${noms[i]} (cours ${f(c.prix, 0)} €, ${f(c.nbTitres, 0)} millions de titres, flottant ${c.flottantPct} %)`;
    const desc = en
      ? `${fiche(c1, 0)}, ${fiche(c2, 1)} and ${fiche(c3, 2)}; the index stands at ${f(L0, 0)} points and ${noms[0]}, the heavyweight, gains ${f(x, 1)}% on blowout results`
      : `${fiche(c1, 0)}, ${fiche(c2, 1)} et ${fiche(c3, 2)} ; l'indice est à ${f(L0, 0)} points et ${noms[0]}, le poids lourd, gagne ${f(x, 1)} % sur des résultats record`;
    const contexte = (en
      ? [
        `As an intern on the index desk, you replicate a three-stock benchmark weighted by free-float market cap: ${desc}. Before the close, you must explain to your manager exactly how much of that single move flows into the index.`,
        `A journalist calls the desk to fact-check a headline: ${desc}. "If only that one stock moves, where should the index land?" You rebuild the float-weighted arithmetic in four steps, on the record.`,
        `The examiner sketches a miniature CAC on the whiteboard: ${desc}. The drill: total floating cap, the heavyweight's true weight, the index move it alone produces, and the resulting level — no shortcuts.`,
      ]
      : [
        `Stagiaire au desk indices, vous répliquez un panier de trois titres pondéré par la capitalisation flottante : ${desc}. Avant la clôture, vous devez expliquer à votre responsable combien ce seul mouvement déverse exactement dans l'indice.`,
        `Un journaliste appelle le desk pour vérifier un titre d'article : ${desc}. « Si seul ce titre bouge, où l'indice doit-il atterrir ? » Vous reconstruisez l'arithmétique flottante en quatre temps, au propre.`,
        `L'examinateur dessine un CAC miniature au tableau : ${desc}. L'exercice : capi flottante totale, vrai poids du titre lourd, variation d'indice qu'il produit à lui seul, et niveau d'arrivée — sans raccourci.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The floating capitalisation' : 'a) La capitalisation flottante',
          enonce: en
            ? `What is the total free-float capitalisation of the basket, in millions of euros?`
            : `Quelle est la capitalisation flottante totale du panier, en millions d'euros ?`,
          reponse: repCapi, tolerance: 0.005, unite: 'M€',
          etapes: [{
            titre: en ? 'Price × shares × float, summed' : 'Prix × titres × flottant, sommé',
            contenu: en
              ? `${cells.map((c, i) => `${noms[i]}: ${f(c.prix, 0)} × ${f(c.nbTitres, 0)} × ${f(c.flottantPct / 100, 2)} = ${f(r2(c.prix * c.nbTitres * c.flottantPct / 100), 0)}`).join('; ')}. Total = **€${f(repCapi, 0)} million**. Only the float counts: locked-up blocks never trade, so they never weigh.`
              : `${cells.map((c, i) => `${noms[i]} : ${f(c.prix, 0)} × ${f(c.nbTitres, 0)} × ${f(c.flottantPct / 100, 2)} = ${f(r2(c.prix * c.nbTitres * c.flottantPct / 100), 0)}`).join(' ; ')}. Total = **${f(repCapi, 0)} M€**. Seul le flottant compte : les blocs verrouillés ne s'échangent jamais, donc ne pèsent jamais.`,
          }],
          pieges: [en
            ? `Using full market caps overweights the most closely-held names — exactly what float weighting is designed to prevent.`
            : `Prendre les capitalisations pleines surpondère les titres les plus verrouillés — précisément ce que la pondération flottante veut éviter.`],
        },
        {
          intitule: en ? "b) The heavyweight's weight" : 'b) Le poids du titre lourd',
          enonce: en
            ? `What weight does ${noms[0]} carry in the index, in %?`
            : `Quel poids ${noms[0]} pèse-t-il dans l'indice, en % ?`,
          reponse: repPoids, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Its float over the total' : 'Son flottant sur le total',
            contenu: en
              ? `$w = \\frac{capi_{${noms[0]}}}{capi_{totale}}$ = ${f(r2(c1.prix * c1.nbTitres * c1.flottantPct / 100), 0)} / ${f(repCapi, 0)} = **${pct(repPoids)}**. The other two weigh ${pct(r2(poids[1]))} and ${pct(r2(poids[2]))}: weights always sum to 100.`
              : `$w = \\frac{capi_{${noms[0]}}}{capi_{totale}}$ = ${f(r2(c1.prix * c1.nbTitres * c1.flottantPct / 100), 0)} / ${f(repCapi, 0)} = **${pct(repPoids)}**. Les deux autres pèsent ${pct(r2(poids[1]))} et ${pct(r2(poids[2]))} : les poids somment toujours à 100.`,
          }],
        },
        {
          intitule: en ? 'c) The index move' : "c) La variation de l'indice",
          enonce: en
            ? `${noms[0]} alone gains ${f(x, 1)}%. By how much does the index rise, in %?`
            : `${noms[0]} gagne ${f(x, 1)} % à lui seul. De combien l'indice monte-t-il, en % ?`,
          reponse: repVar, tolerance: 0.02, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Weight × move' : 'Poids × variation',
            contenu: en
              ? `$\\Delta = w \\times x$ = ${pct(repPoids)} × ${f(x, 1)}% = **${pct(repVar)}**. A cap-weighted index is a weighted average: each stock contributes its weight times its move.`
              : `$\\Delta = w \\times x$ = ${pct(repPoids)} × ${f(x, 1)} % = **${pct(repVar)}**. Un indice capi-pondéré est une moyenne pondérée : chaque titre contribue à hauteur de son poids fois sa variation.`,
          }],
          pieges: [en
            ? `Crediting the full ${f(x, 1)}% to the index forgets the two sleeping constituents: only ${pct(repPoids, 0)} of the basket moved.`
            : `Créditer les ${f(x, 1)} % entiers à l'indice oublie les deux constituants immobiles : seuls ${pct(repPoids, 0)} du panier ont bougé.`],
        },
        {
          intitule: en ? 'd) The closing level' : "d) Le niveau d'arrivée",
          enonce: en
            ? `Starting from ${f(L0, 0)} points, where does the index land, in points?`
            : `Parti de ${f(L0, 0)} points, où l'indice atterrit-il, en points ?`,
          reponse: repNiveau, tolerance: 0.005, unite: 'pts',
          etapes: [{
            titre: en ? 'Apply the move to the level' : 'Appliquer la variation au niveau',
            contenu: en
              ? `$L_1 = L_0 \\times (1 + \\Delta)$ = ${f(L0, 0)} × ${f(1 + varPct / 100, 4)} = **${f(repNiveau)} points**. The level is just floating cap over a divisor: same stocks, same divisor, the move IS the cap move.`
              : `$L_1 = L_0 \\times (1 + \\Delta)$ = ${f(L0, 0)} × ${f(1 + varPct / 100, 4)} = **${f(repNiveau)} points**. Le niveau n'est que la capi flottante sur un diviseur : mêmes titres, même diviseur, la variation EST celle de la capi.`,
          }],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 7. m3-pb-rendement-total — N2                                       */
/* ------------------------------------------------------------------ */
const rendementTotal: ProblemGenerator = {
  id: 'm3-pb-rendement-total', moduleId: M3,
  titre: 'Rendement prix contre rendement total, deux ans de vérité',
  titreEn: 'Price return versus total return, two honest years',
  typeDeCas: 'mesure de performance',
  typeDeCasEn: 'performance measurement',
  difficulte: 2,
  scenarios: ['Épargnant qui relit son relevé', "Sélectionneur de fonds face à un indice prix", 'Candidat sur le piège CAC 40 vs CAC 40 GR'],
  scenariosEn: ['Saver rereading his statement', 'Fund selector against a price index', 'Candidate on the CAC 40 vs CAC 40 GR trap'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const q = pick(rng, [50, 100, 200, 300] as const);
    const p0 = randFloat(rng, 40, 110, 2);
    const y1 = randFloat(rng, 4, 18, 1);
    const y2 = randFloat(rng, -8, 14, 1);
    const D = randFloat(rng, 1, 3.5, 2);

    const p1 = p0 * (1 + y1 / 100);
    const p2 = p1 * (1 + y2 / 100);
    const rPrix = (p2 / p0 - 1) * 100;
    const fTot = (1 + D / p1) * (1 + D / p2);
    const richesse = q * fTot * p2;
    const rTot = (fTot * p2 / p0 - 1) * 100;
    const ann = (Math.sqrt(1 + rTot / 100) - 1) * 100;
    const repP2 = r2(p2);
    const repRPrix = r2(rPrix);
    const repRichesse = r2(richesse);
    const repRTot = r2(rTot);
    const repAnn = r2(ann);

    const { en, f, eur, pct } = outils(langue);
    const desc = en
      ? `you bought ${q} shares at €${f(p0)}; the price returned ${f(y1, 1)}% in year 1 and ${f(y2, 1)}% in year 2, and the company paid a dividend of €${f(D)} per share at the end of each year, immediately reinvested at the year-end price`
      : `vous avez acheté ${q} actions à ${f(p0)} € ; le cours a fait ${f(y1, 1)} % en année 1 et ${f(y2, 1)} % en année 2, et la société a versé un dividende de ${f(D)} € par action à la fin de chaque année, aussitôt réinvesti au cours de fin d'année`;
    const contexte = (en
      ? [
        `Two years ago ${desc}. Tonight you reread the statement and want the honest figures: where the price went, where your wealth went, and why the two diverge — the dividend is the whole story.`,
        `As a fund selector, you catch a manager comparing his fund to a PRICE index. The toy case on your desk: ${desc}. You compute both returns to show how many points the bare price comparison quietly swallows.`,
        `The jury's favourite index trap — "the CAC 40 is a price index" — needs numbers: ${desc}. Walk the chain: final price, price return, final wealth with dividends reinvested, total return, then annualise it properly.`,
      ]
      : [
        `Il y a deux ans, ${desc}. Ce soir, vous relisez le relevé et voulez les chiffres honnêtes : où est allé le cours, où est allée votre richesse, et pourquoi les deux divergent — le dividende est toute l'histoire.`,
        `Sélectionneur de fonds, vous surprenez un gérant comparant son fonds à un indice PRIX. Le cas d'école sur votre bureau : ${desc}. Vous calculez les deux rendements pour montrer combien de points la comparaison au prix nu avale en silence.`,
        `Le piège favori du jury — « le CAC 40 est un indice prix » — réclame des chiffres : ${desc}. Déroulez la chaîne : cours final, rendement prix, richesse finale dividendes réinvestis, rendement total, puis annualisez proprement.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The final price' : 'a) Le cours final',
          enonce: en
            ? `What is the share price after the two years, in euros?`
            : `Quel est le cours après les deux années, en euros ?`,
          reponse: repP2, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'Compound the two price moves' : 'Composer les deux variations',
            contenu: en
              ? `$P_2 = P_0 (1+y_1)(1+y_2)$ = ${f(p0)} × ${f(1 + y1 / 100, 3)} × ${f(1 + y2 / 100, 3)} = **${eur(repP2)}** (via $P_1$ = ${eur(r2(p1))}).`
              : `$P_2 = P_0 (1+y_1)(1+y_2)$ = ${f(p0)} × ${f(1 + y1 / 100, 3)} × ${f(1 + y2 / 100, 3)} = **${eur(repP2)}** (en passant par $P_1$ = ${eur(r2(p1))}).`,
          }],
        },
        {
          intitule: en ? 'b) The price return' : 'b) Le rendement prix',
          enonce: en
            ? `What is the cumulative PRICE return over the two years, in %?`
            : `Quel est le rendement PRIX cumulé sur les deux ans, en % ?`,
          reponse: repRPrix, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'What a price index would show' : "Ce qu'un indice prix afficherait",
            contenu: en
              ? `$r_{prix} = P_2/P_0 - 1$ = ${f(repP2)} / ${f(p0)} − 1 = **${pct(repRPrix)}**. This is the CAC-40-style figure: dividends are invisible to it.`
              : `$r_{prix} = P_2/P_0 - 1$ = ${f(repP2)} / ${f(p0)} − 1 = **${pct(repRPrix)}**. C'est le chiffre façon CAC 40 : les dividendes lui sont invisibles.`,
          }],
        },
        {
          intitule: en ? 'c) The final wealth, dividends reinvested' : 'c) La richesse finale, dividendes réinvestis',
          enonce: en
            ? `Reinvesting each dividend at the year-end price, what is the position worth after two years, in euros?`
            : `En réinvestissant chaque dividende au cours de fin d'année, que vaut la position après deux ans, en euros ?`,
          reponse: repRichesse, tolerance: 0.005, unite: '€',
          etapes: [
            {
              titre: en ? 'Each dividend buys shares' : 'Chaque dividende achète des titres',
              contenu: en
                ? `Year 1: the €${f(D)} buys ${f(D / p1, 4)} share per share held — factor ${f(r2(1 + D / p1), 4)}. Year 2: factor ${f(r2(1 + D / p2), 4)}. Share count factor: ${f(r2(fTot), 4)}.`
                : `Année 1 : les ${f(D)} € achètent ${f(D / p1, 4)} titre par titre détenu — facteur ${f(r2(1 + D / p1), 4)}. Année 2 : facteur ${f(r2(1 + D / p2), 4)}. Facteur sur le nombre de titres : ${f(r2(fTot), 4)}.`,
            },
            {
              titre: en ? 'Value the grown position' : 'Valoriser la position grossie',
              contenu: en
                ? `Wealth = ${q} × ${f(r2(fTot), 4)} × ${f(repP2)} = **${eur(repRichesse)}** — against ${eur(r2(q * p2))} for the bare shares.`
                : `Richesse = ${q} × ${f(r2(fTot), 4)} × ${f(repP2)} = **${eur(repRichesse)}** — contre ${eur(r2(q * p2))} pour les titres nus.`,
            },
          ],
        },
        {
          intitule: en ? 'd) The total return' : 'd) Le rendement total',
          enonce: en
            ? `What is the cumulative TOTAL return over the two years, in %?`
            : `Quel est le rendement TOTAL cumulé sur les deux ans, en % ?`,
          reponse: repRTot, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Wealth against the stake' : 'La richesse contre la mise',
            contenu: en
              ? `$r_{tot}$ = ${f(repRichesse)} / ${f(r2(q * p0))} − 1 = **${pct(repRTot)}**, versus ${pct(repRPrix)} for the price alone: the dividend gap is ${pct(r2(rTot - rPrix))} over two years. That is exactly the CAC 40 GR vs CAC 40 wedge.`
              : `$r_{tot}$ = ${f(repRichesse)} / ${f(r2(q * p0))} − 1 = **${pct(repRTot)}**, contre ${pct(repRPrix)} pour le prix seul : l'écart dividendes fait ${pct(r2(rTot - rPrix))} sur deux ans. C'est exactement le coin CAC 40 GR vs CAC 40.`,
          }],
          pieges: [en
            ? `Adding the two dividend yields to the price return ignores reinvestment compounding: returns multiply, they never add.`
            : `Additionner les deux rendements du dividende au rendement prix ignore la capitalisation du réinvestissement : les rendements se multiplient, ils ne s'additionnent jamais.`],
        },
        {
          intitule: en ? 'e) Annualised, properly' : 'e) Annualisé, proprement',
          enonce: en
            ? `What is the annualised total return, in %?`
            : `Quel est le rendement total annualisé, en % ?`,
          reponse: repAnn, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Geometric, not divided by two' : 'Géométrique, pas divisé par deux',
            contenu: en
              ? `$r_{ann} = \\sqrt{1 + r_{tot}} - 1$ = ${f(1 + rTot / 100, 4)}^{1/2} − 1 = **${pct(repAnn)}** a year. Dividing ${pct(repRTot)} by 2 (${pct(r2(rTot / 2))}) overstates it: compounding is not linear.`
              : `$r_{ann} = \\sqrt{1 + r_{tot}} - 1$ = ${f(1 + rTot / 100, 4)}^{1/2} − 1 = **${pct(repAnn)}** par an. Diviser ${pct(repRTot)} par 2 (${pct(r2(rTot / 2))}) le surestime : la capitalisation n'est pas linéaire.`,
          }],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 8. m3-pb-ddm-deux-etapes-complet — N3                               */
/* ------------------------------------------------------------------ */
const ddmDeuxEtapesComplet: ProblemGenerator = {
  id: 'm3-pb-ddm-deux-etapes-complet', moduleId: M3,
  titre: 'DDM deux étapes : croissance forte, puis croisière',
  titreEn: 'Two-stage DDM: fast lane, then cruise speed',
  typeDeCas: 'valorisation par les dividendes',
  typeDeCasEn: 'dividend-based valuation',
  difficulte: 3,
  scenarios: ['Analyste sur une valeur de croissance qui mûrit', 'Gérant qui conteste un objectif de cours', "Candidat à l'épreuve du modèle en deux blocs"],
  scenariosEn: ['Analyst on a maturing growth stock', 'Manager challenging a price target', 'Candidate facing the two-block model'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const d0 = randFloat(rng, 1.5, 4, 2);
    const g1 = randFloat(rng, 8, 15, 1);
    const n1 = randInt(rng, 3, 5);
    const g2 = randFloat(rng, 1.5, 3, 1);
    const r = r1(g2 + randFloat(rng, 4, 6.5, 1));
    const facteur = pick(rng, [0.85, 0.95, 1.08, 1.2] as const);

    const dn = d0 * (1 + g1 / 100) ** n1;
    const vt = valeurTerminaleGordon(dn, g2, r);
    let vaPhase1 = 0;
    let div = d0;
    for (let t = 1; t <= n1; t++) {
      div *= 1 + g1 / 100;
      vaPhase1 += div / (1 + r / 100) ** t;
    }
    const v0 = ddmDeuxEtapes(d0, g1, n1, g2, r);
    const cours = r2(v0 * facteur);
    const ecart = (cours / v0 - 1) * 100;
    const repDn = r2(dn);
    const repVt = r2(vt);
    const repVa1 = r2(vaPhase1);
    const repV0 = r2(v0);
    const repEcart = r2(ecart);

    const { en, f, eur, pct } = outils(langue);
    const desc = en
      ? `the company just paid €${f(d0)} per share; dividends should grow by ${f(g1, 1)}% a year for ${n1} years, then by ${f(g2, 1)}% forever; the required return is ${f(r, 1)}% and the share trades at €${f(cours)}`
      : `la société vient de verser ${f(d0)} € par action ; le dividende doit croître de ${f(g1, 1)} % par an pendant ${n1} ans, puis de ${f(g2, 1)} % pour toujours ; le taux exigé est ${f(r, 1)} % et le titre cote ${f(cours)} €`;
    const contexte = (en
      ? [
        `You cover a growth stock entering maturity — single-stage Gordon would be a lie, so you split the life in two: ${desc}. The note needs the dividend at the end of the fast phase, the terminal value, the two discounted blocks, and the verdict on the market price.`,
        `A sell-side target price lands on your desk and the PM growls "rebuild it": ${desc}. You re-run the two-stage machine block by block — fast dividends, Gordon tail, discounting — before agreeing or killing the target.`,
        `The two-block exam question, in its classic form: ${desc}. The examiner wants to see the blocks built in order and discounted from the right dates — the terminal value sits at year ${n1}, not at year zero.`,
      ]
      : [
        `Vous couvrez une valeur de croissance qui entre en maturité — un Gordon à une étape serait un mensonge, alors vous coupez la vie en deux : ${desc}. La note exige le dividende de fin de phase rapide, la valeur terminale, les deux blocs actualisés, et le verdict sur le cours.`,
        `Un objectif de cours sell-side atterrit sur votre bureau et le gérant grogne « reconstruis-le » : ${desc}. Vous refaites tourner la machine à deux étapes bloc par bloc — dividendes rapides, queue de Gordon, actualisation — avant de valider ou d'abattre l'objectif.`,
        `La question des deux blocs, dans sa forme classique : ${desc}. L'examinateur veut voir les blocs construits dans l'ordre et actualisés depuis les bonnes dates — la valeur terminale vit en année ${n1}, pas en année zéro.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? `a) The dividend at the end of year ${n1}` : `a) Le dividende de fin d'année ${n1}`,
          enonce: en
            ? `What dividend will be paid in year ${n1} (Dₙ), in euros?`
            : `Quel dividende sera versé en année ${n1} (Dₙ), en euros ?`,
          reponse: repDn, tolerance: 0.02, toleranceMode: 'absolu', unite: '€',
          etapes: [{
            titre: en ? `Compound ${n1} fast years` : `Composer ${n1} années rapides`,
            contenu: en
              ? `$D_{${n1}} = D_0 (1+g_1)^{${n1}}$ = ${f(d0)} × ${f((1 + g1 / 100) ** n1, 4)} = **${eur(repDn)}**.`
              : `$D_{${n1}} = D_0 (1+g_1)^{${n1}}$ = ${f(d0)} × ${f((1 + g1 / 100) ** n1, 4)} = **${eur(repDn)}**.`,
          }],
        },
        {
          intitule: en ? 'b) The terminal value' : 'b) La valeur terminale',
          enonce: en
            ? `What is the terminal value at the end of year ${n1}, in euros?`
            : `Quelle est la valeur terminale en fin d'année ${n1}, en euros ?`,
          reponse: repVt, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? `Gordon on the year-${n1 + 1} dividend` : `Gordon sur le dividende de l'année ${n1 + 1}`,
            contenu: en
              ? `$VT_{${n1}} = \\frac{D_{${n1}} (1+g_2)}{r - g_2}$ = ${f(repDn)} × ${f(1 + g2 / 100, 3)} / ${f((r - g2) / 100, 4)} = **${eur(repVt)}**, expressed in year-${n1} euros: it still has to travel back to today.`
              : `$VT_{${n1}} = \\frac{D_{${n1}} (1+g_2)}{r - g_2}$ = ${f(repDn)} × ${f(1 + g2 / 100, 3)} / ${f((r - g2) / 100, 4)} = **${eur(repVt)}**, exprimée en euros de l'année ${n1} : elle doit encore voyager jusqu'à aujourd'hui.`,
          }],
          pieges: [en
            ? `Feeding Gordon with g₁ instead of g₂ values the cruise phase at the sprint speed — the terminal value explodes for nothing.`
            : `Nourrir Gordon avec g₁ au lieu de g₂ valorise la croisière à la vitesse du sprint — la valeur terminale explose pour rien.`],
        },
        {
          intitule: en ? 'c) The fast-phase block' : 'c) Le bloc de la phase rapide',
          enonce: en
            ? `What is the present value of the ${n1} fast-growth dividends, in euros?`
            : `Que vaut aujourd'hui la somme des ${n1} dividendes de croissance rapide, en euros ?`,
          reponse: repVa1, tolerance: 0.02, toleranceMode: 'absolu', unite: '€',
          etapes: [{
            titre: en ? 'Discount each dividend' : 'Actualiser chaque dividende',
            contenu: en
              ? `Each $D_t = D_0(1+g_1)^t$ discounted at ${pct(r, 1)}: the ${n1} terms sum to **${eur(repVa1)}**. Small against the terminal value — as usual.`
              : `Chaque $D_t = D_0(1+g_1)^t$ actualisé à ${pct(r, 1)} : les ${n1} termes somment à **${eur(repVa1)}**. Petit face à la valeur terminale — comme d'habitude.`,
          }],
        },
        {
          intitule: en ? 'd) The intrinsic value' : 'd) La valeur intrinsèque',
          enonce: en
            ? `Adding the discounted terminal value, what is the share worth today, in euros?`
            : `En ajoutant la valeur terminale actualisée, que vaut l'action aujourd'hui, en euros ?`,
          reponse: repV0, tolerance: 0.005, unite: '€',
          etapes: [
            {
              titre: en ? 'Bring the tail home' : 'Rapatrier la queue',
              contenu: en
                ? `PV of the tail: ${f(repVt)} / ${f((1 + r / 100) ** n1, 4)} = ${eur(r2(vt / (1 + r / 100) ** n1))}.`
                : `VA de la queue : ${f(repVt)} / ${f((1 + r / 100) ** n1, 4)} = ${eur(r2(vt / (1 + r / 100) ** n1))}.`,
            },
            {
              titre: en ? 'Glue the two blocks' : 'Recoller les deux blocs',
              contenu: en
                ? `$V_0$ = ${f(repVa1)} + ${f(r2(vt / (1 + r / 100) ** n1))} = **${eur(repV0)}**. The terminal block carries ${pct(r2(vt / (1 + r / 100) ** n1 / v0 * 100), 0)} of the value: the model lives and dies on g₂.`
                : `$V_0$ = ${f(repVa1)} + ${f(r2(vt / (1 + r / 100) ** n1))} = **${eur(repV0)}**. Le bloc terminal porte ${pct(r2(vt / (1 + r / 100) ** n1 / v0 * 100), 0)} de la valeur : le modèle vit et meurt sur g₂.`,
            },
          ],
          pieges: [en
            ? `Adding the terminal value WITHOUT discounting it mixes year-${n1} euros with today's euros — the single most common two-stage error.`
            : `Ajouter la valeur terminale SANS l'actualiser mélange des euros de l'année ${n1} avec des euros d'aujourd'hui — l'erreur deux-étapes la plus fréquente.`],
        },
        {
          intitule: en ? 'e) The verdict on the price' : 'e) Le verdict sur le cours',
          enonce: en
            ? `By how much does the market price deviate from your value, in % (positive = expensive)?`
            : `De combien le cours s'écarte-t-il de votre valeur, en % (positif = cher) ?`,
          reponse: repEcart, tolerance: 0.2, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Price against the two blocks' : 'Le cours contre les deux blocs',
            contenu: en
              ? `Gap = ${f(cours)} / ${f(repV0)} − 1 = **${pct(repEcart)}**. ${repEcart > 0 ? 'The market prices a longer sprint or a fatter g₂ than you do.' : 'The market prices a shorter sprint or a thinner g₂ than you do.'} The debate is now about assumptions, not arithmetic.`
              : `Écart = ${f(cours)} / ${f(repV0)} − 1 = **${pct(repEcart)}**. ${repEcart > 0 ? 'Le marché price un sprint plus long ou un g₂ plus gras que vous.' : 'Le marché price un sprint plus court ou un g₂ plus maigre que vous.'} Le débat porte désormais sur les hypothèses, plus sur l'arithmétique.`,
          }],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 9. m3-pb-dcf-sensibilite — N3                                       */
/* ------------------------------------------------------------------ */
const dcfSensibilite: ProblemGenerator = {
  id: 'm3-pb-dcf-sensibilite', moduleId: M3,
  titre: 'Un DCF et son WACC : la fourchette à ± 1 point',
  titreEn: 'A DCF and its WACC: the ±1-point range',
  typeDeCas: 'valorisation intrinsèque',
  typeDeCasEn: 'intrinsic valuation',
  difficulte: 3,
  scenarios: ["Analyste qui défend une cible devant le comité", 'Junior dont le WACC est contesté', 'Candidat sommé de montrer la sensibilité'],
  scenariosEn: ['Analyst defending a target before the committee', 'Junior whose WACC is under fire', 'Candidate ordered to show the sensitivity'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const fcf1 = randInt(rng, 80, 200);
    const fcf2 = Math.round(fcf1 * randFloat(rng, 1.06, 1.14, 2));
    const fcf3 = Math.round(fcf2 * randFloat(rng, 1.05, 1.12, 2));
    const g = randFloat(rng, 1.5, 3, 1);
    const r = r1(g + randFloat(rng, 4.5, 7, 1));
    const dette = randInt(rng, 20, 70) * 10;
    const nb = randInt(rng, 40, 120);

    const fcfs = [fcf1, fcf2, fcf3];
    const vt = valeurTerminaleGordon(fcf3, g, r);
    const ev = dcfSimple(fcfs, r, vt);
    const vpa = (ev - dette) / nb;
    const vpaHaut = (dcfSimple(fcfs, r + 1, valeurTerminaleGordon(fcf3, g, r + 1)) - dette) / nb;
    const vpaBas = (dcfSimple(fcfs, r - 1, valeurTerminaleGordon(fcf3, g, r - 1)) - dette) / nb;
    const repVt = r2(vt);
    const repEv = r2(ev);
    const repVpa = r2(vpa);
    const repHaut = r2(vpaHaut);
    const repBas = r2(vpaBas);

    const { en, f, eur, pct } = outils(langue);
    const desc = en
      ? `free cash flows of €${f(fcf1, 0)} million, €${f(fcf2, 0)} million and €${f(fcf3, 0)} million over the next three years, a WACC of ${f(r, 1)}%, perpetual growth of ${f(g, 1)}% beyond, net debt of €${f(dette, 0)} million and ${f(nb, 0)} million shares`
      : `des flux de trésorerie disponibles de ${f(fcf1, 0)} M€, ${f(fcf2, 0)} M€ et ${f(fcf3, 0)} M€ sur trois ans, un WACC de ${f(r, 1)} %, une croissance perpétuelle de ${f(g, 1)} % au-delà, une dette nette de ${f(dette, 0)} M€ et ${f(nb, 0)} millions d'actions`;
    const contexte = (en
      ? [
        `Before the investment committee, you defend a price target built on a three-year DCF: ${desc}. You know the first question by heart — "and at one more point of WACC?" — so you bring the whole range.`,
        `Your model is on the screen and the senior taps the discount-rate cell: ${desc}. To prove the valuation is honest, you produce the base value per share and the two bounds at WACC plus and minus one point.`,
        `The examiner hands you a clean DCF case: ${desc}. The expected run: terminal value, enterprise value, value per share — then the ±1-point sensitivity that separates an estimate from a false certainty.`,
      ]
      : [
        `Devant le comité d'investissement, vous défendez un objectif de cours bâti sur un DCF à trois ans : ${desc}. Vous connaissez la première question par cœur — « et à un point de WACC de plus ? » — alors vous apportez toute la fourchette.`,
        `Votre modèle est à l'écran et le senior tapote la cellule du taux : ${desc}. Pour prouver que la valorisation est honnête, vous produisez la valeur par action de base et les deux bornes à WACC plus et moins un point.`,
        `L'examinateur vous tend un cas de DCF épuré : ${desc}. Le déroulé attendu : valeur terminale, valeur d'entreprise, valeur par action — puis la sensibilité à ± 1 point qui sépare une estimation d'une fausse certitude.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The terminal value' : 'a) La valeur terminale',
          enonce: en
            ? `What is the terminal value at the end of year 3, in millions of euros?`
            : `Quelle est la valeur terminale en fin d'année 3, en millions d'euros ?`,
          reponse: repVt, tolerance: 0.005, unite: 'M€',
          etapes: [{
            titre: en ? 'Gordon on the year-4 flow' : "Gordon sur le flux de l'année 4",
            contenu: en
              ? `$VT_3 = \\frac{FCF_3 (1+g)}{WACC - g}$ = ${f(fcf3, 0)} × ${f(1 + g / 100, 3)} / ${f((r - g) / 100, 4)} = **€${f(repVt, 0)} million**, in year-3 euros.`
              : `$VT_3 = \\frac{FCF_3 (1+g)}{WACC - g}$ = ${f(fcf3, 0)} × ${f(1 + g / 100, 3)} / ${f((r - g) / 100, 4)} = **${f(repVt, 0)} M€**, en euros de l'année 3.`,
          }],
        },
        {
          intitule: en ? 'b) The enterprise value' : "b) La valeur d'entreprise",
          enonce: en
            ? `Discounting the three flows and the terminal value, what is the EV, in millions of euros?`
            : `En actualisant les trois flux et la valeur terminale, quelle est l'EV, en millions d'euros ?`,
          reponse: repEv, tolerance: 0.005, unite: 'M€',
          etapes: [{
            titre: en ? 'Four discountings, one sum' : 'Quatre actualisations, une somme',
            contenu: en
              ? `$EV = \\sum_{t=1}^{3} \\frac{FCF_t}{(1+WACC)^t} + \\frac{VT_3}{(1+WACC)^3}$ = ${f(r2(ev - vt / (1 + r / 100) ** 3), 0)} + ${f(r2(vt / (1 + r / 100) ** 3), 0)} = **€${f(repEv, 0)} million**. The terminal value carries ${pct(r2(vt / (1 + r / 100) ** 3 / ev * 100), 0)} of the total.`
              : `$EV = \\sum_{t=1}^{3} \\frac{FCF_t}{(1+WACC)^t} + \\frac{VT_3}{(1+WACC)^3}$ = ${f(r2(ev - vt / (1 + r / 100) ** 3), 0)} + ${f(r2(vt / (1 + r / 100) ** 3), 0)} = **${f(repEv, 0)} M€**. La valeur terminale porte ${pct(r2(vt / (1 + r / 100) ** 3 / ev * 100), 0)} du total.`,
          }],
          pieges: [en
            ? `Discounting the terminal value over 4 years (or not at all) is the classic off-by-one: it lives at the END of year 3.`
            : `Actualiser la valeur terminale sur 4 ans (ou pas du tout) est le décalage classique : elle vit à la FIN de l'année 3.`],
        },
        {
          intitule: en ? 'c) The value per share' : 'c) La valeur par action',
          enonce: en
            ? `After removing the debt, what is the equity value per share, in euros?`
            : `Après avoir retiré la dette, quelle est la valeur par action, en euros ?`,
          reponse: repVpa, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'From EV to the shareholder' : "De l'EV à l'actionnaire",
            contenu: en
              ? `$V = \\frac{EV - dette}{N}$ = (${f(repEv, 0)} − ${f(dette, 0)}) / ${f(nb, 0)} = **${eur(repVpa)}**. Creditors are served before shareholders — always subtract the net debt first.`
              : `$V = \\frac{EV - dette}{N}$ = (${f(repEv, 0)} − ${f(dette, 0)}) / ${f(nb, 0)} = **${eur(repVpa)}**. Les créanciers passent avant les actionnaires — la dette nette se retire toujours d'abord.`,
          }],
        },
        {
          intitule: en ? 'd) One point of WACC more' : 'd) Un point de WACC en plus',
          enonce: en
            ? `At a WACC of ${f(r + 1, 1)}%, what does the value per share become, in euros?`
            : `À un WACC de ${f(r + 1, 1)} %, que devient la valeur par action, en euros ?`,
          reponse: repHaut, tolerance: 0.01, unite: '€',
          etapes: [{
            titre: en ? 'The whole machine re-runs' : 'Toute la machine retourne',
            contenu: en
              ? `New spread WACC − g = ${pct(r2(r + 1 - g), 1)}: the terminal value deflates, the discounting bites harder, and the share lands at **${eur(repHaut)}** — ${pct(r2((vpaHaut / vpa - 1) * 100), 1)} from base. One point of rate, that much value.`
              : `Nouvel écart WACC − g = ${pct(r2(r + 1 - g), 1)} : la valeur terminale dégonfle, l'actualisation mord plus fort, et l'action atterrit à **${eur(repHaut)}** — soit ${pct(r2((vpaHaut / vpa - 1) * 100), 1)} depuis la base. Un point de taux, voilà ce que ça coûte.`,
          }],
        },
        {
          intitule: en ? 'e) One point of WACC less' : 'e) Un point de WACC en moins',
          enonce: en
            ? `At a WACC of ${f(r - 1, 1)}%, what does the value per share become, in euros?`
            : `À un WACC de ${f(r - 1, 1)} %, que devient la valeur par action, en euros ?`,
          reponse: repBas, tolerance: 0.01, unite: '€',
          etapes: [
            {
              titre: en ? 'The spread tightens, the value swells' : "L'écart se resserre, la valeur gonfle",
              contenu: en
                ? `WACC − g = ${pct(r2(r - 1 - g), 1)} only: the perpetuity divisor shrinks and the share jumps to **${eur(repBas)}**.`
                : `WACC − g = ${pct(r2(r - 1 - g), 1)} seulement : le diviseur de la perpétuité rétrécit et l'action bondit à **${eur(repBas)}**.`,
            },
            {
              titre: en ? 'Read the range, not the point' : 'Lire la fourchette, pas le point',
              contenu: en
                ? `[${eur(repHaut)} ; ${eur(repBas)}] around ${eur(repVpa)}: a DCF outputs a RANGE. Anyone quoting one cent of precision on a DCF has not understood the tool.`
                : `[${eur(repHaut)} ; ${eur(repBas)}] autour de ${eur(repVpa)} : un DCF produit une FOURCHETTE. Qui annonce un centime de précision sur un DCF n'a pas compris l'outil.`,
            },
          ],
          pieges: [en
            ? `Re-running the discounting but keeping the OLD terminal value forgets that the WACC sits in Gordon's denominator too — both must move.`
            : `Refaire l'actualisation en gardant l'ANCIENNE valeur terminale oublie que le WACC vit aussi au dénominateur de Gordon — les deux doivent bouger.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 10. m3-pb-augmentation-capital-dps — N3                             */
/* ------------------------------------------------------------------ */
const augmentationCapitalDps: ProblemGenerator = {
  id: 'm3-pb-augmentation-capital-dps', moduleId: M3,
  titre: "Augmentation de capital : le droit, le TERP, et les trois chemins",
  titreEn: 'Rights issue: the right, the TERP, and the three roads',
  typeDeCas: 'opérations sur titres',
  typeDeCasEn: 'corporate actions',
  difficulte: 3,
  scenarios: ["Conseiller d'un actionnaire individuel", 'Gérant qui arbitre souscrire ou vendre', "Candidat sur la mécanique du droit préférentiel"],
  scenariosEn: ['Adviser to an individual shareholder', 'Manager weighing subscribe versus sell', 'Candidate on preferential-rights mechanics'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const P = randFloat(rng, 30, 80, 2);
    const E = r2(P * pick(rng, [0.7, 0.75, 0.8] as const));
    const k = pick(rng, [4, 5, 8, 10] as const);
    const q = k * pick(rng, [20, 30, 50, 100] as const);

    const dps = valeurDroitSouscription(P, E, k);
    const terp = P - dps;
    const m = q / k;
    const posApres = (q + m) * terp;
    const richesseVente = q * P;
    const perte = q * dps;
    const repDps = r2(dps);
    const repTerp = r2(terp);
    const repPos = r2(posApres);
    const repVente = r2(richesseVente);
    const repPerte = r2(perte);

    const { en, f, eur } = outils(langue);
    const desc = en
      ? `the share trades at €${f(P)}; the company issues one new share for every ${k} existing shares at €${f(E)}; your client holds ${f(q, 0)} shares`
      : `le titre cote ${f(P)} € ; la société émet une action nouvelle pour ${k} anciennes à ${f(E)} € ; votre client détient ${f(q, 0)} actions`;
    const contexte = (en
      ? [
        `A rights issue lands in your client's inbox and he panics — "they are printing shares, I'm being robbed!" The terms: ${desc}. You compute the value of the right, the post-money price, then walk the three roads: subscribe, sell the rights, or do nothing.`,
        `On the buy side, every rights issue triggers the same arbitration: ${desc}. Before the rights start trading, you want the theoretical right, the TERP, and the proof that subscribing and selling both protect the wealth — only inaction destroys it.`,
        `The jury draws the operation on the board: ${desc}. Expected: the right valued by formula, the TERP as price minus right, and the wealth account under each of the three behaviours — the trap being the shareholder who lets his rights expire.`,
      ]
      : [
        `Une augmentation de capital tombe dans la boîte de votre client et il panique — « ils impriment des actions, on me vole ! » Les termes : ${desc}. Vous calculez la valeur du droit, le prix post-opération, puis déroulez les trois chemins : souscrire, vendre ses droits, ou ne rien faire.`,
        `Côté gestion, chaque augmentation de capital déclenche le même arbitrage : ${desc}. Avant la cotation des droits, vous voulez le droit théorique, le TERP, et la preuve que souscrire et vendre protègent tous deux la richesse — seule l'inaction la détruit.`,
        `Le jury dessine l'opération au tableau : ${desc}. Attendu : le droit valorisé par la formule, le TERP comme cours moins droit, et le compte de richesse sous chacun des trois comportements — le piège étant l'actionnaire qui laisse ses droits expirer.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The value of one right' : "a) La valeur d'un droit",
          enonce: en
            ? `What is the theoretical value of one preferential subscription right, in euros?`
            : `Quelle est la valeur théorique d'un droit préférentiel de souscription, en euros ?`,
          reponse: repDps, tolerance: 0.01, toleranceMode: 'absolu', unite: '€',
          etapes: [{
            titre: en ? 'The dilution, shared fairly' : 'La dilution, partagée équitablement',
            contenu: en
              ? `$DPS = \\frac{P - E}{k + 1}$ = (${f(P)} − ${f(E)}) / ${k + 1} = **${eur(repDps)}**. The discount on the new share is spread over the k + 1 = ${k + 1} shares of the post-deal lot.`
              : `$DPS = \\frac{P - E}{k + 1}$ = (${f(P)} − ${f(E)}) / ${k + 1} = **${eur(repDps)}**. La décote de l'action neuve se répartit sur les k + 1 = ${k + 1} titres du lot post-opération.`,
          }],
          pieges: [en
            ? `Dividing by k instead of k + 1 forgets that the new share itself joins the pool that absorbs the discount.`
            : `Diviser par k au lieu de k + 1 oublie que l'action neuve entre elle-même dans le pot qui absorbe la décote.`],
        },
        {
          intitule: en ? 'b) The TERP' : 'b) Le TERP',
          enonce: en
            ? `What is the theoretical ex-rights price, in euros?`
            : `Quel est le cours théorique ex-droit, en euros ?`,
          reponse: repTerp, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'Price minus right' : 'Cours moins droit',
            contenu: en
              ? `$TERP = P - DPS$ = ${f(P)} − ${f(repDps)} = **${eur(repTerp)}** — equivalently (${k} × ${f(P)} + ${f(E)}) / ${k + 1}: the weighted average of old and new shares.`
              : `$TERP = P - DPS$ = ${f(P)} − ${f(repDps)} = **${eur(repTerp)}** — soit aussi (${k} × ${f(P)} + ${f(E)}) / ${k + 1} : la moyenne pondérée des titres anciens et neufs.`,
          }],
        },
        {
          intitule: en ? 'c) Road 1 — subscribe' : 'c) Chemin 1 — souscrire',
          enonce: en
            ? `The client subscribes to his ${f(m, 0)} new shares. What is his position worth after the operation, in euros?`
            : `Le client souscrit ses ${f(m, 0)} actions nouvelles. Que vaut sa position après l'opération, en euros ?`,
          reponse: repPos, tolerance: 0.005, unite: '€',
          etapes: [
            {
              titre: en ? 'Count the shares at the TERP' : 'Compter les titres au TERP',
              contenu: en
                ? `${f(q, 0)} old + ${f(m, 0)} new = ${f(q + m, 0)} shares at ${eur(repTerp)} = **${eur(repPos)}**.`
                : `${f(q, 0)} anciennes + ${f(m, 0)} neuves = ${f(q + m, 0)} titres à ${eur(repTerp)} = **${eur(repPos)}**.`,
            },
            {
              titre: en ? 'No magic: it is his own cash' : 'Pas de magie : c\'est son propre cash',
              contenu: en
                ? `That equals ${eur(r2(q * P))} (initial wealth) + ${eur(r2(m * E))} (cash paid in): the position grew exactly by what he injected. Wealth preserved, stake preserved.`
                : `Soit ${eur(r2(q * P))} (richesse initiale) + ${eur(r2(m * E))} (cash versé) : la position a grossi exactement de ce qu'il a injecté. Richesse préservée, quote-part préservée.`,
            },
          ],
        },
        {
          intitule: en ? 'd) Road 2 — sell the rights' : 'd) Chemin 2 — vendre les droits',
          enonce: en
            ? `The client sells his ${f(q, 0)} rights at theoretical value instead. What is his total wealth (shares + cash), in euros?`
            : `Le client vend plutôt ses ${f(q, 0)} droits à leur valeur théorique. Quelle est sa richesse totale (titres + espèces), en euros ?`,
          reponse: repVente, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'Shares at TERP plus rights cashed' : 'Titres au TERP plus droits encaissés',
            contenu: en
              ? `${f(q, 0)} × ${f(repTerp)} + ${f(q, 0)} × ${f(repDps)} = ${eur(r2(q * terp))} + ${eur(r2(q * dps))} = **${eur(repVente)}** — exactly the initial ${f(q, 0)} × ${f(P)}. Diluted in percentage, intact in euros.`
              : `${f(q, 0)} × ${f(repTerp)} + ${f(q, 0)} × ${f(repDps)} = ${eur(r2(q * terp))} + ${eur(r2(q * dps))} = **${eur(repVente)}** — exactement les ${f(q, 0)} × ${f(P)} initiaux. Dilué en pourcentage, intact en euros.`,
          }],
        },
        {
          intitule: en ? 'e) Road 3 — do nothing' : 'e) Chemin 3 — ne rien faire',
          enonce: en
            ? `If the client lets his rights expire worthless, how much wealth does he lose, in euros?`
            : `Si le client laisse ses droits expirer sans valeur, combien de richesse perd-il, en euros ?`,
          reponse: repPerte, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'The only losing road' : 'Le seul chemin perdant',
            contenu: en
              ? `His shares still drop to the TERP, but no cash compensates: loss = ${f(q, 0)} × ${f(repDps)} = **${eur(repPerte)}**. A rights issue robs nobody — except the shareholder who ignores his mail.`
              : `Ses titres tombent quand même au TERP, mais aucun cash ne compense : perte = ${f(q, 0)} × ${f(repDps)} = **${eur(repPerte)}**. Une augmentation de capital ne vole personne — sauf l'actionnaire qui ignore son courrier.`,
          }],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 11. m3-pb-buyback-bpa — N3                                          */
/* ------------------------------------------------------------------ */
const buybackBpa: ProblemGenerator = {
  id: 'm3-pb-buyback-bpa', moduleId: M3,
  titre: 'Le rachat d\'actions : relution mécanique, valeur intacte',
  titreEn: 'The buyback: mechanical accretion, unchanged value',
  typeDeCas: 'politique de distribution',
  typeDeCasEn: 'payout policy',
  difficulte: 3,
  scenarios: ['Analyste devant un communiqué de rachat', "Journaliste tenté d'écrire « création de valeur »", 'Candidat face au piège du BPA gonflé'],
  scenariosEn: ['Analyst reading a buyback announcement', 'Journalist tempted to write "value creation"', 'Candidate facing the inflated-EPS trap'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const B = randInt(rng, 200, 900);
    const N = randInt(rng, 50, 200);
    const P = randFloat(rng, 20, 80, 2);
    const montant = randInt(rng, 2, 8) * 50;

    const bpaAvant = bpa(B, N);
    const nRach = montant / P;
    const bpaApres = bpa(B, N - nRach);
    const relution = (N / (N - nRach) - 1) * 100;
    const capiApres = N * P - montant;
    const repAvant = r2(bpaAvant);
    const repNR = r2(nRach);
    const repApres = r2(bpaApres);
    const repRel = r2(relution);
    const repCapi = r2(capiApres);

    const { en, f, eur, pct } = outils(langue);
    const desc = en
      ? `the company posts a net income of €${f(B, 0)} million, has ${f(N, 0)} million shares outstanding, a share price of €${f(P)} and announces a €${f(montant, 0)} million buyback executed at the current price`
      : `la société affiche un bénéfice net de ${f(B, 0)} M€, compte ${f(N, 0)} millions d'actions en circulation, un cours de ${f(P)} € et annonce un rachat de ${f(montant, 0)} M€ exécuté au cours actuel`;
    const contexte = (en
      ? [
        `A buyback press release crosses the wire and the headline writes itself — "EPS to jump". The facts: ${desc}. Your job: quantify the mechanical accretion, then say out loud what the market cap does — because cash left the building.`,
        `A journalist drafts "the company creates value for shareholders through a buyback" and asks you to check the maths: ${desc}. You run the EPS chain, then show him why a higher EPS on a thinner company is not creation — it is concentration.`,
        `The jury's favourite payout trap: "EPS rises after a buyback, so shareholders are richer — true or false?" The case: ${desc}. Compute everything, then answer with the market-cap line: the value never appears out of thin air.`,
      ]
      : [
        `Un communiqué de rachat tombe sur le fil et le titre s'écrit tout seul — « le BPA va bondir ». Les faits : ${desc}. Votre travail : chiffrer la relution mécanique, puis dire à voix haute ce que fait la capitalisation — car du cash est sorti de la maison.`,
        `Un journaliste rédige « la société crée de la valeur pour l'actionnaire via un rachat » et vous demande de vérifier le calcul : ${desc}. Vous déroulez la chaîne du BPA, puis lui montrez pourquoi un BPA plus haut sur une société amaigrie n'est pas une création — c'est une concentration.`,
        `Le piège favori du jury sur la distribution : « le BPA monte après un rachat, donc l'actionnaire s'enrichit — vrai ou faux ? » Le dossier : ${desc}. Calculez tout, puis répondez par la ligne de capitalisation : la valeur n'apparaît jamais par magie.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) EPS before' : 'a) Le BPA avant',
          enonce: en
            ? `What is the EPS before the buyback, in euros?`
            : `Quel est le BPA avant le rachat, en euros ?`,
          reponse: repAvant, tolerance: 0.01, toleranceMode: 'absolu', unite: '€',
          etapes: [{
            titre: en ? 'Earnings over shares' : 'Bénéfice sur titres',
            contenu: en
              ? `$BPA = B / N$ = ${f(B, 0)} / ${f(N, 0)} = **${eur(repAvant)}** per share.`
              : `$BPA = B / N$ = ${f(B, 0)} / ${f(N, 0)} = **${eur(repAvant)}** par action.`,
          }],
        },
        {
          intitule: en ? 'b) Shares bought back' : 'b) Les titres rachetés',
          enonce: en
            ? `How many shares does the €${f(montant, 0)} million programme retire, in millions?`
            : `Combien de titres le programme de ${f(montant, 0)} M€ retire-t-il, en millions ?`,
          reponse: repNR, tolerance: 0.01, toleranceMode: 'absolu', unite: 'millions',
          etapes: [{
            titre: en ? 'Budget over price' : 'Budget sur cours',
            contenu: en
              ? `$n = montant / P$ = ${f(montant, 0)} / ${f(P)} = **${f(repNR)} million** shares, cancelled. ${f(r2(N - nRach))} million remain.`
              : `$n = montant / P$ = ${f(montant, 0)} / ${f(P)} = **${f(repNR)} millions** de titres, annulés. Il en reste ${f(r2(N - nRach))} millions.`,
          }],
        },
        {
          intitule: en ? 'c) EPS after' : 'c) Le BPA après',
          enonce: en
            ? `Same earnings, fewer shares: what is the pro forma EPS, in euros?`
            : `Même bénéfice, moins de titres : quel est le BPA pro forma, en euros ?`,
          reponse: repApres, tolerance: 0.01, toleranceMode: 'absolu', unite: '€',
          etapes: [{
            titre: en ? 'The same cake, fewer plates' : 'Le même gâteau, moins d\'assiettes',
            contenu: en
              ? `$BPA' = B / (N - n)$ = ${f(B, 0)} / ${f(r2(N - nRach))} = **${eur(repApres)}**. The earnings did not move one euro — only the divisor shrank.`
              : `$BPA' = B / (N - n)$ = ${f(B, 0)} / ${f(r2(N - nRach))} = **${eur(repApres)}**. Le bénéfice n'a pas bougé d'un euro — seul le diviseur a maigri.`,
          }],
          pieges: [en
            ? `In reality the financed cash earned (or saved) something: a full model would trim B by the lost interest on €${f(montant, 0)} million. Here we isolate the share-count effect.`
            : `En réalité le cash mobilisé rapportait (ou économisait) quelque chose : un modèle complet rognerait B des intérêts perdus sur ${f(montant, 0)} M€. Ici on isole l'effet nombre de titres.`],
        },
        {
          intitule: en ? 'd) The accretion' : 'd) La relution',
          enonce: en
            ? `By what percentage does the EPS rise mechanically?`
            : `De quel pourcentage le BPA monte-t-il mécaniquement ?`,
          reponse: repRel, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'A ratio of share counts' : 'Un rapport de nombres de titres',
            contenu: en
              ? `Accretion = $\\frac{N}{N-n} - 1$ = ${f(N, 0)} / ${f(r2(N - nRach))} − 1 = **${pct(repRel)}**. Strictly positive whenever shares are retired: that is why it proves nothing about value.`
              : `Relution = $\\frac{N}{N-n} - 1$ = ${f(N, 0)} / ${f(r2(N - nRach))} − 1 = **${pct(repRel)}**. Strictement positive dès qu'on retire des titres : voilà pourquoi elle ne prouve rien sur la valeur.`,
          }],
        },
        {
          intitule: en ? 'e) The market cap after — the trap' : 'e) La capitalisation après — le piège',
          enonce: en
            ? `All else equal, what is the market cap right after the buyback, in millions of euros?`
            : `Toutes choses égales par ailleurs, quelle est la capitalisation juste après le rachat, en millions d'euros ?`,
          reponse: repCapi, tolerance: 0.005, unite: 'M€',
          etapes: [
            {
              titre: en ? 'The cash really left' : 'Le cash est vraiment sorti',
              contenu: en
                ? `Cap = ${f(N, 0)} × ${f(P)} − ${f(montant, 0)} = **€${f(repCapi, 0)} million**: the company is worth its old value MINUS the cash handed out. Per share: ${f(repCapi, 0)} / ${f(r2(N - nRach))} = ${eur(r2(capiApres / (N - nRach)))} — the price did not move.`
                : `Capi = ${f(N, 0)} × ${f(P)} − ${f(montant, 0)} = **${f(repCapi, 0)} M€** : la société vaut son ancienne valeur MOINS le cash distribué. Par action : ${f(repCapi, 0)} / ${f(r2(N - nRach))} = ${eur(r2(capiApres / (N - nRach)))} — le cours n'a pas bougé.`,
            },
            {
              titre: en ? 'EPS up, wealth flat' : 'BPA en hausse, richesse à plat',
              contenu: en
                ? `A ${pct(repRel, 1)} EPS jump with zero wealth created: the buyback, like the dividend, MOVES money — it does not make any. Value changes only if the shares were bought below (or above) their worth.`
                : `Un BPA en hausse de ${pct(repRel, 1)} et zéro richesse créée : le rachat, comme le dividende, DÉPLACE l'argent — il n'en fabrique pas. La valeur ne change que si les titres ont été payés sous (ou sur) leur valeur.`,
            },
          ],
          pieges: [en
            ? `Multiplying the new EPS by the old P/E to claim a higher price assumes the multiple is a law of nature — it is an opinion of the market.`
            : `Multiplier le nouveau BPA par l'ancien PER pour annoncer un cours plus haut suppose que le multiple est une loi de la nature — c'est une opinion du marché.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 12. m3-pb-ipo-pricing — N3                                          */
/* ------------------------------------------------------------------ */
const ipoPricing: ProblemGenerator = {
  id: 'm3-pb-ipo-pricing', moduleId: M3,
  titre: "IPO : le pop du premier jour et l'argent laissé sur la table",
  titreEn: 'IPO: the first-day pop and the money left on the table',
  typeDeCas: 'introduction en bourse',
  typeDeCasEn: 'equity capital markets',
  difficulte: 3,
  scenarios: ['Fondateur qui relit sa propre introduction', "Analyste ECM au lendemain du pricing", 'Candidat sur le paradoxe du pop célébré'],
  scenariosEn: ['Founder rereading his own listing', 'ECM analyst the morning after pricing', 'Candidate on the celebrated-pop paradox'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const prix = randFloat(rng, 15, 40, 2);
    const n = randInt(rng, 10, 60);
    const facteurPop = randFloat(rng, 1.08, 1.45, 2);
    const close = r2(prix * facteurPop);
    const fee = randFloat(rng, 2, 4, 1);

    const levee = n * prix;
    const pop = (close / prix - 1) * 100;
    const mlott = n * (close - prix);
    const fraisM = (levee * fee) / 100;
    const coutTot = mlott + fraisM;
    const repLevee = r2(levee);
    const repPop = r2(pop);
    const repMlott = r2(mlott);
    const repFrais = r2(fraisM);
    const repCout = r2(coutTot);

    const { en, f, eur, pct } = outils(langue);
    const desc = en
      ? `the deal is finally priced at €${f(prix)}; ${f(n, 0)} million shares are sold to investors; the stock closes at €${f(close)} on day one and the syndicate fees run at ${f(fee, 1)}% of the proceeds`
      : `l'opération est finalement pricée à ${f(prix)} € ; ${f(n, 0)} millions d'actions sont vendues aux investisseurs ; le titre clôture à ${f(close)} € le premier jour et les frais du syndicat s'élèvent à ${f(fee, 1)} % des fonds levés`;
    const contexte = (en
      ? [
        `Champagne in the newsroom: the IPO "popped". The founder rereads the numbers coldly: ${desc}. Help him compute what the company raised, what the pop cost it, and the full bill of going public.`,
        `Morning after the pricing, the ECM desk does its post-mortem: ${desc}. The file must show the proceeds, the first-day pop, the money left on the table and the fees — the two faces of the cost of an IPO.`,
        `The jury raises an eyebrow: "the press celebrates a big first-day pop — should the issuer?" The case: ${desc}. Your numbers must separate what the company received from what it could have received.`,
      ]
      : [
        `Champagne dans la rédaction : l'IPO a « poppé ». Le fondateur, lui, relit froidement : ${desc}. Aidez-le à calculer ce que la société a levé, ce que le pop lui a coûté, et la facture complète de la mise en bourse.`,
        `Au lendemain du pricing, le desk ECM fait son post-mortem : ${desc}. Le dossier doit montrer les fonds levés, le pop du premier jour, l'argent laissé sur la table et les frais — les deux visages du coût d'une IPO.`,
        `Le jury hausse un sourcil : « la presse célèbre un gros pop d'introduction — l'émetteur doit-il s'en réjouir ? » Le dossier : ${desc}. Vos chiffres doivent séparer ce que la société a reçu de ce qu'elle aurait pu recevoir.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The proceeds' : 'a) Les fonds levés',
          enonce: en
            ? `How much does the offering raise, in millions of euros?`
            : `Combien l'opération lève-t-elle, en millions d'euros ?`,
          reponse: repLevee, tolerance: 0.005, unite: 'M€',
          etapes: [{
            titre: en ? 'Shares × offer price' : "Titres × prix d'offre",
            contenu: en
              ? `Proceeds = ${f(n, 0)} × ${f(prix)} = **€${f(repLevee, 0)} million** — at the OFFER price: the issuer never touches the first-day close.`
              : `Levée = ${f(n, 0)} × ${f(prix)} = **${f(repLevee, 0)} M€** — au prix d'OFFRE : l'émetteur ne touche jamais le cours de clôture du premier jour.`,
          }],
        },
        {
          intitule: en ? 'b) The first-day pop' : 'b) Le pop du premier jour',
          enonce: en
            ? `What is the first-day return for allocated investors, in %?`
            : `Quel est le rendement du premier jour pour les investisseurs servis, en % ?`,
          reponse: repPop, tolerance: 0.1, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Close against offer' : 'Clôture contre offre',
            contenu: en
              ? `Pop = ${f(close)} / ${f(prix)} − 1 = **${pct(repPop)}** in one session — the textbook signature of deliberate IPO underpricing.`
              : `Pop = ${f(close)} / ${f(prix)} − 1 = **${pct(repPop)}** en une séance — la signature classique de la décote d'introduction volontaire.`,
          }],
        },
        {
          intitule: en ? 'c) The money left on the table' : "c) L'argent laissé sur la table",
          enonce: en
            ? `How much more would the same shares have raised at the closing price, in millions of euros?`
            : `Combien les mêmes titres auraient-ils rapporté de plus au prix de clôture, en millions d'euros ?`,
          reponse: repMlott, tolerance: 0.01, unite: 'M€',
          etapes: [{
            titre: en ? 'The transfer to allocated clients' : 'Le transfert vers les clients servis',
            contenu: en
              ? `MLOTT = ${f(n, 0)} × (${f(close)} − ${f(prix)}) = **€${f(repMlott, 0)} million**, pocketed on day one by the syndicate's clients instead of the issuer. The pop the press celebrates is this line.`
              : `MLOTT = ${f(n, 0)} × (${f(close)} − ${f(prix)}) = **${f(repMlott, 0)} M€**, empochés dès le premier jour par les clients du syndicat au lieu de l'émetteur. Le pop que la presse célèbre, c'est cette ligne.`,
          }],
          pieges: [en
            ? `"The market was hot" cuts both ways: the very close proves buyers existed at ${eur(close)} — the demand was there, the price was not.`
            : `« Le marché était porteur » se retourne : la clôture même prouve qu'il existait des acheteurs à ${eur(close)} — la demande était là, pas le prix.`],
        },
        {
          intitule: en ? 'd) The explicit fees' : 'd) Les frais explicites',
          enonce: en
            ? `What do the syndicate fees amount to, in millions of euros?`
            : `À combien s'élèvent les frais du syndicat, en millions d'euros ?`,
          reponse: repFrais, tolerance: 0.01, unite: 'M€',
          etapes: [{
            titre: en ? 'A percentage of the proceeds' : 'Un pourcentage de la levée',
            contenu: en
              ? `Fees = ${pct(fee, 1)} × ${f(repLevee, 0)} = **€${f(repFrais)} million** — the visible cost, the one in the prospectus.`
              : `Frais = ${pct(fee, 1)} × ${f(repLevee, 0)} = **${f(repFrais)} M€** — le coût visible, celui du prospectus.`,
          }],
        },
        {
          intitule: en ? 'e) The full bill' : 'e) La facture complète',
          enonce: en
            ? `Money left on the table plus fees: what did going public really cost, in millions of euros?`
            : `Argent laissé sur la table plus frais : combien la mise en bourse a-t-elle réellement coûté, en millions d'euros ?`,
          reponse: repCout, tolerance: 0.01, unite: 'M€',
          etapes: [
            {
              titre: en ? 'Add the two faces' : 'Additionner les deux visages',
              contenu: en
                ? `Total = ${f(repMlott, 0)} + ${f(repFrais)} = **€${f(repCout, 0)} million**, i.e. ${pct(r2(coutTot / levee * 100), 1)} of the proceeds. The implicit cost ${mlott > fraisM ? 'dwarfs' : 'rivals'} the explicit one.`
                : `Total = ${f(repMlott, 0)} + ${f(repFrais)} = **${f(repCout, 0)} M€**, soit ${pct(r2(coutTot / levee * 100), 1)} de la levée. Le coût implicite ${mlott > fraisM ? 'écrase' : 'rivalise avec'} le coût explicite.`,
            },
            {
              titre: en ? 'Why issuers accept it' : 'Pourquoi les émetteurs acceptent',
              contenu: en
                ? `Underpricing buys a successful book, loyal investors and an after-market that holds — but it is a real transfer, and the founder's dilution is its mirror. A "great pop" is a great deal mostly for those who were allocated.`
                : `La décote achète un livre d'ordres rempli, des investisseurs fidèles et un après-marché qui tient — mais c'est un transfert bien réel, dont la dilution du fondateur est le miroir. Un « beau pop » est surtout une belle affaire pour ceux qui ont été servis.`,
            },
          ],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 13. m3-pb-greenshoe — N3                                            */
/* ------------------------------------------------------------------ */
const greenshoe: ProblemGenerator = {
  id: 'm3-pb-greenshoe', moduleId: M3,
  titre: 'Greenshoe : la banque gagne dans les deux scénarios',
  titreEn: 'Greenshoe: the bank wins in both scenarios',
  typeDeCas: 'introduction en bourse',
  typeDeCasEn: 'equity capital markets',
  difficulte: 3,
  scenarios: ["Junior ECM qui découvre l'option de surallocation", 'Régulateur qui vérifie la stabilisation', 'Candidat sur le mécanisme à double détente'],
  scenariosEn: ['ECM junior discovering the over-allotment option', 'Regulator reviewing the stabilisation', 'Candidate on the double-trigger mechanism'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const n = randInt(rng, 20, 80);
    const P = randFloat(rng, 14, 36, 2);
    const Pd = r2(P * randFloat(rng, 0.88, 0.97, 2));

    const s = 0.15 * n;
    const profitBaisse = s * (P - Pd);
    const leveeSupp = s * P;
    const leveeTotale = n * P + leveeSupp;
    const repS = r2(s);
    const repProfit = r2(profitBaisse);
    const repSupp = r2(leveeSupp);
    const repTotale = r2(leveeTotale);

    const { en, f } = outils(langue);
    const desc = en
      ? `the syndicate places ${f(n, 0)} million shares at €${f(P)} with a 15% over-allotment: it actually SELLS 115% of the base deal, short the extra slice, covered by the greenshoe option granted by the issuer; in the bear case the stock slips to €${f(Pd)}`
      : `le syndicat place ${f(n, 0)} millions d'actions à ${f(P)} € avec une surallocation de 15 % : il VEND en réalité 115 % de l'offre de base, à découvert sur la tranche en plus, couvert par l'option greenshoe accordée par l'émetteur ; dans le scénario de baisse, le titre glisse à ${f(Pd)} €`;
    const contexte = (en
      ? [
        `First week on the ECM desk, the MD asks you to explain the greenshoe back to him with numbers: ${desc}. Walk the two scenarios — stock falls, stock rises — and show why the bank is covered in both.`,
        `The market regulator reviews the stabilisation report of a recent listing: ${desc}. The file must quantify the over-allotted slice, the buy-back profit if the stock weakens, and the extra proceeds if the option is exercised.`,
        `The jury loves the elegance of the mechanism: "short yet covered — explain." The case: ${desc}. Two scenarios, four numbers, one conclusion: the greenshoe stabilises the price at no risk to the syndicate.`,
      ]
      : [
        `Première semaine au desk ECM, le directeur vous demande de lui réexpliquer le greenshoe avec des chiffres : ${desc}. Déroulez les deux scénarios — titre en baisse, titre en hausse — et montrez pourquoi la banque est couverte dans les deux.`,
        `Le régulateur examine le rapport de stabilisation d'une introduction récente : ${desc}. Le dossier doit chiffrer la tranche surallouée, le profit de rachat si le titre faiblit, et la levée supplémentaire si l'option est exercée.`,
        `Le jury adore l'élégance du mécanisme : « à découvert et pourtant couvert — expliquez. » Le dossier : ${desc}. Deux scénarios, quatre chiffres, une conclusion : le greenshoe stabilise le cours sans risque pour le syndicat.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The over-allotted slice' : 'a) La tranche surallouée',
          enonce: en
            ? `How many shares does the syndicate sell beyond the base deal, in millions?`
            : `Combien de titres le syndicat vend-il au-delà de l'offre de base, en millions ?`,
          reponse: repS, tolerance: 0.01, toleranceMode: 'absolu', unite: 'millions',
          etapes: [{
            titre: en ? '15% of the base' : '15 % de la base',
            contenu: en
              ? `Slice = 15% × ${f(n, 0)} = **${f(repS)} million** shares, sold short at €${f(P)}: the syndicate owes shares it does not yet own — but holds a call on them at the offer price.`
              : `Tranche = 15 % × ${f(n, 0)} = **${f(repS)} millions** de titres, vendus à découvert à ${f(P)} € : le syndicat doit des titres qu'il ne possède pas encore — mais détient un call dessus au prix d'offre.`,
          }],
        },
        {
          intitule: en ? 'b) Bear case — the stabilisation profit' : 'b) Scénario de baisse — le profit de stabilisation',
          enonce: en
            ? `The stock slips to €${f(Pd)}. The syndicate buys the slice back in the market to close its short. What is its gain, in millions of euros?`
            : `Le titre glisse à ${f(Pd)} €. Le syndicat rachète la tranche en marché pour clore son découvert. Quel est son gain, en millions d'euros ?`,
          reponse: repProfit, tolerance: 0.01, unite: 'M€',
          etapes: [
            {
              titre: en ? 'Sold high, bought back lower' : 'Vendu haut, racheté plus bas',
              contenu: en
                ? `Gain = ${f(repS)} × (${f(P)} − ${f(Pd)}) = **€${f(repProfit)} million**. The buying itself props the price up: stabilisation IS this buy-back.`
                : `Gain = ${f(repS)} × (${f(P)} − ${f(Pd)}) = **${f(repProfit)} M€**. Le rachat lui-même soutient le cours : la stabilisation, C'EST ce rachat.`,
            },
            {
              titre: en ? 'The option dies unexercised' : "L'option meurt non exercée",
              contenu: en
                ? `Why exercise a call at €${f(P)} when the market sells at €${f(Pd)}? The greenshoe lapses; the issuer keeps its base size of ${f(n, 0)} million shares.`
                : `Pourquoi exercer un call à ${f(P)} € quand le marché vend à ${f(Pd)} € ? Le greenshoe expire ; l'émetteur garde sa taille de base de ${f(n, 0)} millions de titres.`,
            },
          ],
        },
        {
          intitule: en ? 'c) Bull case — the extra proceeds' : 'c) Scénario de hausse — la levée supplémentaire',
          enonce: en
            ? `The stock rises instead: the syndicate exercises the greenshoe at €${f(P)}. How much extra does the issuer raise, in millions of euros?`
            : `Le titre monte au contraire : le syndicat exerce le greenshoe à ${f(P)} €. Combien l'émetteur lève-t-il en plus, en millions d'euros ?`,
          reponse: repSupp, tolerance: 0.01, unite: 'M€',
          etapes: [{
            titre: en ? 'New shares at the offer price' : "Des titres neufs au prix d'offre",
            contenu: en
              ? `Extra = ${f(repS)} × ${f(P)} = **€${f(repSupp, 0)} million**: the issuer creates the slice at the offer price, the syndicate delivers it to its short, everyone is square. Buying back in a RISING market would have cost the bank money — that is exactly what the option prevents.`
              : `Supplément = ${f(repS)} × ${f(P)} = **${f(repSupp, 0)} M€** : l'émetteur crée la tranche au prix d'offre, le syndicat la livre à son découvert, tout le monde est à l'équilibre. Racheter dans un marché qui MONTE aurait coûté cher à la banque — c'est exactement ce que l'option évite.`,
          }],
          pieges: [en
            ? `The syndicate never pockets the rise: exercising at €${f(P)} just closes the short at cost. The bull-case winner is the issuer, who sells 15% more.`
            : `Le syndicat n'empoche jamais la hausse : exercer à ${f(P)} € clôt simplement le découvert au prix coûtant. Le gagnant du scénario haussier est l'émetteur, qui vend 15 % de plus.`],
        },
        {
          intitule: en ? 'd) The bull-case total raise' : 'd) La levée totale en cas de hausse',
          enonce: en
            ? `Base deal plus exercised greenshoe: what does the issuer raise in total, in millions of euros?`
            : `Offre de base plus greenshoe exercé : combien l'émetteur lève-t-il au total, en millions d'euros ?`,
          reponse: repTotale, tolerance: 0.01, unite: 'M€',
          etapes: [
            {
              titre: en ? 'Base plus slice' : 'Base plus tranche',
              contenu: en
                ? `Total = ${f(n, 0)} × ${f(P)} + ${f(repSupp, 0)} = **€${f(repTotale, 0)} million**, i.e. 115% of the base proceeds.`
                : `Total = ${f(n, 0)} × ${f(P)} + ${f(repSupp, 0)} = **${f(repTotale, 0)} M€**, soit 115 % de la levée de base.`,
            },
            {
              titre: en ? 'Why "covered" in both worlds' : 'Pourquoi « couvert » dans les deux mondes',
              contenu: en
                ? `Down: buy back below €${f(P)}, profit and support the price. Up: call shares at €${f(P)}, deliver at cost. The short position has a floor on its loss by construction — a short WITH a call is no longer naked.`
                : `Baisse : racheter sous ${f(P)} €, profit et soutien du cours. Hausse : appeler les titres à ${f(P)} €, livrer au prix coûtant. La position courte a une perte plafonnée par construction — un découvert AVEC un call n'est plus nu.`,
            },
          ],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 14. m3-pb-short-couvert — N3                                        */
/* ------------------------------------------------------------------ */
const shortCouvert: ProblemGenerator = {
  id: 'm3-pb-short-couvert', moduleId: M3,
  titre: 'Vente à découvert : le P&L après TOUS les coûts',
  titreEn: 'Short selling: the P&L after ALL the costs',
  typeDeCas: 'vente à découvert',
  typeDeCasEn: 'short selling',
  difficulte: 3,
  scenarios: ['Gérant long-short qui solde une position', 'Risk manager qui audite un P&L de desk', 'Candidat sur les coûts cachés du short'],
  scenariosEn: ['Long-short manager closing a position', 'Risk manager auditing a desk P&L', 'Candidate on the hidden costs of shorting'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const q = pick(rng, [1000, 2000, 5000, 10000] as const);
    const Pv = randFloat(rng, 40, 80, 2);
    const drop = randFloat(rng, 8, 18, 1);
    const Pr = r2(Pv * (1 - drop / 100));
    const j = pick(rng, [30, 45, 60, 90] as const);
    const fEmp = randFloat(rng, 0.5, 3, 1);
    const D = randFloat(rng, 0.5, 1.5, 2);

    const brut = (Pv - Pr) * q;
    const fraisE = coutEmprunTitres(Pv * q, fEmp, j);
    const divDu = q * D;
    const net = pnlVenteADecouvert(Pv, Pr, q, fEmp, j) - divDu;
    const seuil = ((fraisE + divDu) / (q * Pv)) * 100;
    const repBrut = r2(brut);
    const repFrais = r2(fraisE);
    const repDiv = r2(divDu);
    const repNet = r2(net);
    const repSeuil = r2(seuil);

    const { en, f, eur, pct } = outils(langue);
    const desc = en
      ? `the fund shorts ${f(q, 0)} shares at €${f(Pv)} and buys them back ${j} days later at €${f(Pr)}; the borrow fee of ${f(fEmp, 1)}% a year (Act/360, on the proceeds) runs the whole period, and the stock detaches a dividend of €${f(D)} during the loan`
      : `le fonds vend à découvert ${f(q, 0)} titres à ${f(Pv)} € et les rachète ${j} jours plus tard à ${f(Pr)} € ; le taux d'emprunt de ${f(fEmp, 1)} % l'an (Exact/360, sur le notionnel vendu) court toute la période, et le titre détache un dividende de ${f(D)} € pendant le prêt`;
    const contexte = (en
      ? [
        `The thesis worked: the stock fell. Before celebrating, the long-short manager closes the book properly: ${desc}. The P&L must show the gross gain, then every cost the borrow drags along — fee and dividend owed to the lender.`,
        `As risk manager, you audit a desk P&L that looks one cost short: ${desc}. Rebuild the four lines — gross, borrow fee, dividend reimbursed, net — then compute how far the stock had to fall just to break even.`,
        `The jury asks the question every shorter dreads: "the stock dropped, how much did you actually make?" The case: ${desc}. The expected answer separates the price leg from the carry legs — and prices the dividend the short must hand back.`,
      ]
      : [
        `La thèse a fonctionné : le titre a chuté. Avant de trinquer, le gérant long-short solde proprement le livre : ${desc}. Le P&L doit montrer le gain brut, puis chaque coût que l'emprunt traîne — taux et dividende dus au prêteur.`,
        `Risk manager, vous auditez un P&L de desk auquel il manque visiblement un coût : ${desc}. Reconstruisez les quatre lignes — brut, frais d'emprunt, dividende remboursé, net — puis calculez de combien le titre devait chuter rien que pour s'équilibrer.`,
        `Le jury pose la question que tout shorteur redoute : « le titre a baissé, combien avez-vous réellement gagné ? » Le dossier : ${desc}. La réponse attendue sépare la jambe prix des jambes de portage — et chiffre le dividende que le vendeur doit rendre.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The gross gain' : 'a) Le gain brut',
          enonce: en
            ? `Sold high, bought back lower: what is the gross P&L, in euros?`
            : `Vendu haut, racheté plus bas : quel est le P&L brut, en euros ?`,
          reponse: repBrut, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'The price leg' : 'La jambe prix',
            contenu: en
              ? `Gross = (${f(Pv)} − ${f(Pr)}) × ${f(q, 0)} = **${eur(repBrut)}** — a ${pct(drop, 1)} drop captured on ${f(q, 0)} shares.`
              : `Brut = (${f(Pv)} − ${f(Pr)}) × ${f(q, 0)} = **${eur(repBrut)}** — une chute de ${pct(drop, 1)} capturée sur ${f(q, 0)} titres.`,
          }],
        },
        {
          intitule: en ? 'b) The borrow fee' : "b) Les frais d'emprunt",
          enonce: en
            ? `What does borrowing the shares cost over the ${j} days, in euros?`
            : `Que coûte l'emprunt des titres sur les ${j} jours, en euros ?`,
          reponse: repFrais, tolerance: 0.01, unite: '€',
          etapes: [{
            titre: en ? 'Act/360 on the proceeds' : 'Exact/360 sur le notionnel vendu',
            contenu: en
              ? `Fee = ${f(r2(Pv * q), 0)} × ${pct(fEmp, 1)} × ${j}/360 = **${eur(repFrais)}**. Money-market convention: actual days over a 360-day year, on the notional sold.`
              : `Frais = ${f(r2(Pv * q), 0)} × ${pct(fEmp, 1)} × ${j}/360 = **${eur(repFrais)}**. Convention monétaire : jours exacts sur une année de 360 jours, sur le notionnel vendu.`,
          }],
          pieges: [en
            ? `A "hard-to-borrow" name can cost 10 to 50 times this fee — the borrow rate is a market price, not a constant.`
            : `Un titre « hard-to-borrow » peut coûter 10 à 50 fois ces frais — le taux d'emprunt est un prix de marché, pas une constante.`],
        },
        {
          intitule: en ? 'c) The dividend owed' : 'c) Le dividende dû',
          enonce: en
            ? `The stock paid €${f(D)} during the loan. How much must the short hand back to the lender, in euros?`
            : `Le titre a versé ${f(D)} € pendant le prêt. Combien le vendeur doit-il rendre au prêteur, en euros ?`,
          reponse: repDiv, tolerance: 0.01, unite: '€',
          etapes: [{
            titre: en ? 'Manufactured dividend' : 'Dividende reconstitué',
            contenu: en
              ? `Owed = ${f(q, 0)} × ${f(D)} = **${eur(repDiv)}**. The lender never gave up his income: whoever holds the shares short pays it out of pocket. (The ex-date drop works in the short's favour on the price leg — the two effects offset, no free lunch.)`
              : `Dû = ${f(q, 0)} × ${f(D)} = **${eur(repDiv)}**. Le prêteur n'a jamais renoncé à son revenu : celui qui est court du titre le paie de sa poche. (La baisse de l'ex-date joue pour le vendeur sur la jambe prix — les deux effets se compensent, pas de repas gratuit.)`,
          }],
          pieges: [en
            ? `Forgetting the manufactured dividend is THE classic short-book error: the borrow contract transfers every cash flow back to the lender.`
            : `Oublier le dividende reconstitué est L'erreur classique du livre short : le contrat de prêt re-transfère chaque flux au prêteur.`],
        },
        {
          intitule: en ? 'd) The net P&L' : 'd) Le P&L net',
          enonce: en
            ? `After the borrow fee and the dividend, what is the net P&L, in euros?`
            : `Après frais d'emprunt et dividende, quel est le P&L net, en euros ?`,
          reponse: repNet, tolerance: 0.01, unite: '€',
          etapes: [{
            titre: en ? 'Three lines, one number' : 'Trois lignes, un chiffre',
            contenu: en
              ? `Net = ${f(repBrut, 0)} − ${f(repFrais)} − ${f(repDiv, 0)} = **${eur(repNet)}**. The carry shaved ${pct(r2((1 - net / brut) * 100), 1)} off the gross gain — shorting pays rent every single day.`
              : `Net = ${f(repBrut, 0)} − ${f(repFrais)} − ${f(repDiv, 0)} = **${eur(repNet)}**. Le portage a rogné ${pct(r2((1 - net / brut) * 100), 1)} du gain brut — un short paie un loyer chaque jour.`,
          }],
        },
        {
          intitule: en ? 'e) The break-even drop' : 'e) Le point mort de baisse',
          enonce: en
            ? `By what percentage did the stock have to fall over the period just to cover fee and dividend, in %?`
            : `De quel pourcentage le titre devait-il baisser sur la période rien que pour couvrir frais et dividende, en % ?`,
          reponse: repSeuil, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The hurdle before the first euro' : 'La haie avant le premier euro',
            contenu: en
              ? `Break-even = (${f(repFrais)} + ${f(repDiv, 0)}) / ${f(r2(Pv * q), 0)} = **${pct(repSeuil)}** of decline. Below that, the thesis was right and the trade still lost: time is the enemy of the short, never its ally.`
              : `Point mort = (${f(repFrais)} + ${f(repDiv, 0)}) / ${f(r2(Pv * q), 0)} = **${pct(repSeuil)}** de baisse. En deçà, la thèse était juste et le trade perdait quand même : le temps est l'ennemi du short, jamais son allié.`,
          }],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 15. m3-pb-dcf-complet-sensibilites — boss N4                        */
/* ------------------------------------------------------------------ */
const dcfCompletSensibilites: ProblemGenerator = {
  id: 'm3-pb-dcf-complet-sensibilites', moduleId: M3,
  titre: 'DCF complet : la matrice r × g qui rend la valeur honnête',
  titreEn: 'Full DCF: the r × g matrix that keeps the value honest',
  typeDeCas: 'valorisation intrinsèque',
  typeDeCasEn: 'intrinsic valuation',
  difficulte: 4,
  scenarios: ["Associé M&A qui présente la fairness opinion", 'Responsable de la recherche qui signe la note', 'Grand oral : le DCF de bout en bout'],
  scenariosEn: ['M&A partner presenting the fairness opinion', 'Head of research signing off the note', 'Final viva: the DCF end to end'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const fcf1 = randInt(rng, 100, 240);
    const fcf2 = Math.round(fcf1 * randFloat(rng, 1.07, 1.15, 2));
    const fcf3 = Math.round(fcf2 * randFloat(rng, 1.05, 1.12, 2));
    const g = randFloat(rng, 1.5, 2.8, 1);
    const r = r1(g + randFloat(rng, 5, 7, 1));
    const dette = randInt(rng, 30, 90) * 10;
    const nb = randInt(rng, 50, 150);

    const fcfs = [fcf1, fcf2, fcf3];
    const cellule = (rr: number, gg: number) =>
      (dcfSimple(fcfs, rr, valeurTerminaleGordon(fcf3, gg, rr)) - dette) / nb;
    const vt = valeurTerminaleGordon(fcf3, g, r);
    const ev = dcfSimple(fcfs, r, vt);
    const vpaBase = (ev - dette) / nb;
    const vpaPess = cellule(r + 0.5, g - 0.5);
    const vpaOpt = cellule(r - 0.5, g + 0.5);
    const repVt = r2(vt);
    const repEv = r2(ev);
    const repBase = r2(vpaBase);
    const repPess = r2(vpaPess);
    const repOpt = r2(vpaOpt);
    // La fourchette est calculée sur les RÉPONSES arrondies : c'est ce que recoupe le test
    // d'enchaînement, et c'est ce qu'un candidat ferait avec ses propres résultats.
    const repFourchette = r2(((repOpt - repPess) / repBase) * 100);

    const { en, f, eur, pct } = outils(langue);
    const desc = en
      ? `free cash flows of €${f(fcf1, 0)} million, €${f(fcf2, 0)} million and €${f(fcf3, 0)} million over three years, a WACC of ${f(r, 1)}%, perpetual growth of ${f(g, 1)}% beyond, net debt of €${f(dette, 0)} million and ${f(nb, 0)} million shares; the committee wants a 2×2 sensitivity matrix crossing WACC ± 0.5 pt with growth ± 0.5 pt around the base case`
      : `des flux de trésorerie disponibles de ${f(fcf1, 0)} M€, ${f(fcf2, 0)} M€ et ${f(fcf3, 0)} M€ sur trois ans, un WACC de ${f(r, 1)} %, une croissance perpétuelle de ${f(g, 1)} % au-delà, une dette nette de ${f(dette, 0)} M€ et ${f(nb, 0)} millions d'actions ; le comité exige une matrice de sensibilité 2×2 croisant WACC ± 0,5 pt et croissance ± 0,5 pt autour du cas central`;
    const contexte = (en
      ? [
        `Fairness opinion day: the board will challenge every cell of your valuation. The model: ${desc}. You present the full chain — terminal value, EV, value per share — then the matrix whose corners frame what the central figure is really worth.`,
        `As head of research you sign the note, and your name goes under the matrix too: ${desc}. The discipline: base case computed clean, then the pessimistic corner (dear money, slow growth) and the optimistic corner (cheap money, fast growth), and the width between them stated as a percentage.`,
        `The final viva, flagship exercise: a DCF end to end with its sensitivities. The data: ${desc}. The examiner will read your matrix before your base value — because the matrix says whether you understand what a DCF is: a range wearing the costume of a number.`,
      ]
      : [
        `Jour de fairness opinion : le conseil va contester chaque cellule de votre valorisation. Le modèle : ${desc}. Vous présentez la chaîne complète — valeur terminale, EV, valeur par action — puis la matrice dont les coins encadrent ce que vaut vraiment le chiffre central.`,
        `Responsable de la recherche, vous signez la note, et votre nom va aussi sous la matrice : ${desc}. La discipline : cas central calculé au propre, puis le coin pessimiste (argent cher, croissance molle) et le coin optimiste (argent bon marché, croissance vive), et la largeur entre eux exprimée en pourcentage.`,
        `Le grand oral, exercice roi : un DCF de bout en bout avec ses sensibilités. Les données : ${desc}. L'examinateur lira votre matrice avant votre valeur de base — car la matrice dit si vous avez compris ce qu'est un DCF : une fourchette déguisée en nombre.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The terminal value' : 'a) La valeur terminale',
          enonce: en
            ? `What is the terminal value at the end of year 3, in millions of euros?`
            : `Quelle est la valeur terminale en fin d'année 3, en millions d'euros ?`,
          reponse: repVt, tolerance: 0.005, unite: 'M€',
          etapes: [{
            titre: en ? 'Gordon on the year-4 flow' : "Gordon sur le flux de l'année 4",
            contenu: en
              ? `$VT_3 = \\frac{FCF_3(1+g)}{WACC-g}$ = ${f(fcf3, 0)} × ${f(1 + g / 100, 3)} / ${f((r - g) / 100, 4)} = **€${f(repVt, 0)} million** in year-3 euros.`
              : `$VT_3 = \\frac{FCF_3(1+g)}{WACC-g}$ = ${f(fcf3, 0)} × ${f(1 + g / 100, 3)} / ${f((r - g) / 100, 4)} = **${f(repVt, 0)} M€** en euros de l'année 3.`,
          }],
        },
        {
          intitule: en ? 'b) The enterprise value' : "b) La valeur d'entreprise",
          enonce: en
            ? `Discounting flows and terminal value, what is the EV, in millions of euros?`
            : `En actualisant flux et valeur terminale, quelle est l'EV, en millions d'euros ?`,
          reponse: repEv, tolerance: 0.005, unite: 'M€',
          etapes: [{
            titre: en ? 'Four present values' : 'Quatre valeurs actuelles',
            contenu: en
              ? `$EV$ = PV(3 flows) + PV(VT) = ${f(r2(ev - vt / (1 + r / 100) ** 3), 0)} + ${f(r2(vt / (1 + r / 100) ** 3), 0)} = **€${f(repEv, 0)} million**; the terminal block weighs ${pct(r2(vt / (1 + r / 100) ** 3 / ev * 100), 0)} of it — remember that share when judging g.`
              : `$EV$ = VA(3 flux) + VA(VT) = ${f(r2(ev - vt / (1 + r / 100) ** 3), 0)} + ${f(r2(vt / (1 + r / 100) ** 3), 0)} = **${f(repEv, 0)} M€** ; le bloc terminal en pèse ${pct(r2(vt / (1 + r / 100) ** 3 / ev * 100), 0)} — gardez cette part en tête en jugeant g.`,
          }],
        },
        {
          intitule: en ? 'c) The base value per share — the central cell' : 'c) La valeur par action de base — la cellule centrale',
          enonce: en
            ? `At the base couple (WACC ${f(r, 1)}%, g ${f(g, 1)}%), what is the value per share, in euros?`
            : `Au couple central (WACC ${f(r, 1)} %, g ${f(g, 1)} %), quelle est la valeur par action, en euros ?`,
          reponse: repBase, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'EV minus debt, per share' : "L'EV moins la dette, par action",
            contenu: en
              ? `$V = (EV - dette)/N$ = (${f(repEv, 0)} − ${f(dette, 0)}) / ${f(nb, 0)} = **${eur(repBase)}**. This number is the CENTRE of the matrix, nothing more: its dignity depends entirely on the corners.`
              : `$V = (EV - dette)/N$ = (${f(repEv, 0)} − ${f(dette, 0)}) / ${f(nb, 0)} = **${eur(repBase)}**. Ce nombre est le CENTRE de la matrice, rien de plus : sa dignité dépend entièrement des coins.`,
          }],
        },
        {
          intitule: en ? 'd) The pessimistic corner' : 'd) Le coin pessimiste',
          enonce: en
            ? `At WACC ${f(r + 0.5, 1)}% and g ${f(g - 0.5, 1)}%, what is the value per share, in euros?`
            : `À WACC ${f(r + 0.5, 1)} % et g ${f(g - 0.5, 1)} %, quelle est la valeur par action, en euros ?`,
          reponse: repPess, tolerance: 0.01, unite: '€',
          etapes: [{
            titre: en ? 'Both screws tighten' : 'Les deux vis se serrent',
            contenu: en
              ? `Spread WACC − g widens to ${pct(r2(r + 0.5 - (g - 0.5)), 1)}: the terminal value deflates AND discounting bites harder. The whole machine re-runs: **${eur(repPess)}** (${pct(r2((vpaPess / vpaBase - 1) * 100), 1)} vs base).`
              : `L'écart WACC − g s'élargit à ${pct(r2(r + 0.5 - (g - 0.5)), 1)} : la valeur terminale dégonfle ET l'actualisation mord plus fort. Toute la machine retourne : **${eur(repPess)}** (${pct(r2((vpaPess / vpaBase - 1) * 100), 1)} vs base).`,
          }],
          pieges: [en
            ? `Moving the WACC in the discounting but not in Gordon's denominator splits the model in two — every cell of the matrix recomputes BOTH.`
            : `Bouger le WACC dans l'actualisation mais pas au dénominateur de Gordon coupe le modèle en deux — chaque cellule de la matrice recalcule LES DEUX.`],
        },
        {
          intitule: en ? 'e) The optimistic corner' : 'e) Le coin optimiste',
          enonce: en
            ? `At WACC ${f(r - 0.5, 1)}% and g ${f(g + 0.5, 1)}%, what is the value per share, in euros?`
            : `À WACC ${f(r - 0.5, 1)} % et g ${f(g + 0.5, 1)} %, quelle est la valeur par action, en euros ?`,
          reponse: repOpt, tolerance: 0.01, unite: '€',
          etapes: [{
            titre: en ? 'Both screws loosen' : 'Les deux vis se desserrent',
            contenu: en
              ? `Spread down to ${pct(r2(r - 0.5 - (g + 0.5)), 1)}: the perpetuity divisor shrinks at both ends and the share jumps to **${eur(repOpt)}** (+${f(r2((vpaOpt / vpaBase - 1) * 100), 1)}% vs base). One half-point each way, and the value swings asymmetrically — the perpetuity is convex in the spread.`
              : `Écart réduit à ${pct(r2(r - 0.5 - (g + 0.5)), 1)} : le diviseur de la perpétuité rétrécit par les deux bouts et l'action bondit à **${eur(repOpt)}** (+${f(r2((vpaOpt / vpaBase - 1) * 100), 1)} % vs base). Un demi-point de chaque côté, et la valeur balance asymétriquement — la perpétuité est convexe dans l'écart.`,
          }],
        },
        {
          intitule: en ? 'f) The width of the range' : 'f) La largeur de la fourchette',
          enonce: en
            ? `From the pessimistic to the optimistic corner, how wide is the range, in % of the base value?`
            : `Du coin pessimiste au coin optimiste, quelle est la largeur de la fourchette, en % de la valeur de base ?`,
          reponse: repFourchette, tolerance: 0.2, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'Measure the honest band' : 'Mesurer la bande honnête',
              contenu: en
                ? `Width = (${f(repOpt)} − ${f(repPess)}) / ${f(repBase)} = **${pct(repFourchette, 1)}** of the base value, for a mere ± 0.5 pt on each assumption.`
                : `Largeur = (${f(repOpt)} − ${f(repPess)}) / ${f(repBase)} = **${pct(repFourchette, 1)}** de la valeur de base, pour ± 0,5 pt seulement sur chaque hypothèse.`,
            },
            {
              titre: en ? 'What the matrix really says' : 'Ce que la matrice dit vraiment',
              contenu: en
                ? `A committee that sees [${eur(repPess)} ; ${eur(repOpt)}] decides differently from one that sees ${eur(repBase)} alone. Presenting the matrix is not modesty — it is the only honest deliverable of a DCF.`
                : `Un comité qui voit [${eur(repPess)} ; ${eur(repOpt)}] décide autrement qu'un comité qui ne voit que ${eur(repBase)}. Présenter la matrice n'est pas de la modestie — c'est le seul livrable honnête d'un DCF.`,
            },
          ],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 16. m3-pb-valorisation-croisee — boss N4                            */
/* ------------------------------------------------------------------ */
const valorisationCroisee: ProblemGenerator = {
  id: 'm3-pb-valorisation-croisee', moduleId: M3,
  titre: 'Triangulation : Gordon, PER et EV/EBITDA sur la même cible',
  titreEn: 'Triangulation: Gordon, P/E and EV/EBITDA on one target',
  typeDeCas: 'valorisation croisée',
  typeDeCasEn: 'cross-method valuation',
  difficulte: 4,
  scenarios: ['Analyste qui doit rendre UNE fourchette au comité', 'Banquier-conseil en mandat de vente', "Grand oral : trois méthodes, un verdict"],
  scenariosEn: ['Analyst owing the committee ONE range', 'Sell-side advisory banker on a mandate', 'Final viva: three methods, one verdict'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const eps = randFloat(rng, 3, 7, 2);
    const payout = pick(rng, [40, 50, 60] as const);
    const g = randFloat(rng, 2, 4, 1);
    const r = r1(g + randFloat(rng, 4, 6, 1));
    const persect = randFloat(rng, 10, 16, 1);
    const ebps = randFloat(rng, 8, 12, 2);
    const mult = randFloat(rng, 6.5, 8.5, 1);
    const dnet = randFloat(rng, 8, 22, 1);

    const d1 = ((eps * payout) / 100) * (1 + g / 100);
    const vGordon = gordon(d1, r, g);
    const perImp = vGordon / eps;
    const vPer = persect * eps;
    const vEv = mult * ebps - dnet;
    const vals = [vGordon, vPer, vEv];
    const vMin = Math.min(...vals);
    const vMax = Math.max(...vals);
    const spread = ((vMax - vMin) / vMin) * 100;
    const repGordon = r2(vGordon);
    const repPerImp = r2(perImp);
    const repVPer = r2(vPer);
    const repVEv = r2(vEv);
    const repSpread = r2(spread);

    const { en, f, eur, pct } = outils(langue);
    const desc = en
      ? `the target posts an EPS of €${f(eps)} and a payout of ${payout}%; you assume dividend growth of ${f(g, 1)}% and a required return of ${f(r, 1)}%; listed peers trade at ${f(persect, 1)} times earnings; the company generates an EBITDA of €${f(ebps)} per share, carries a net debt of €${f(dnet, 1)} per share, and the sector pays an EV/EBITDA of ${f(mult, 1)}x`
      : `la cible publie un BPA de ${f(eps)} € et un payout de ${payout} % ; vous retenez une croissance du dividende de ${f(g, 1)} % et un taux exigé de ${f(r, 1)} % ; les pairs cotés se paient ${f(persect, 1)} fois les bénéfices ; la société dégage un EBITDA de ${f(ebps)} € par action, porte une dette nette de ${f(dnet, 1)} € par action, et le secteur paie un EV/EBITDA de ${f(mult, 1)}×`;
    const contexte = (en
      ? [
        `The committee does not want three numbers, it wants ONE defensible range. The file: ${desc}. You run the three machines — intrinsic, earnings multiple, EV multiple — then measure how far apart they land and explain why that gap is information, not noise.`,
        `On a sell mandate, the price discussion opens with your triangulation page: ${desc}. Each method anchors a different buyer — the dividend fund, the equity market, the strategic acquirer — and the spread between them frames the negotiation.`,
        `The viva's boss question: "value this company three ways and reconcile." The data: ${desc}. The examiner listens less to each result than to your reading of their disagreement — a multiple is a compressed DCF, so the gaps are assumptions speaking.`,
      ]
      : [
        `Le comité ne veut pas trois nombres, il veut UNE fourchette défendable. Le dossier : ${desc}. Vous faites tourner les trois machines — intrinsèque, multiple de résultat, multiple d'EV — puis mesurez leur écart d'atterrissage et expliquez pourquoi cet écart est une information, pas un bruit.`,
        `En mandat de vente, la discussion de prix s'ouvre sur votre page de triangulation : ${desc}. Chaque méthode ancre un acheteur différent — le fonds de rendement, le marché actions, l'acquéreur stratégique — et l'écart entre elles cadre la négociation.`,
        `La question boss de l'oral : « valorisez cette société de trois façons et réconciliez. » Les données : ${desc}. L'examinateur écoute moins chaque résultat que votre lecture de leur désaccord — un multiple est un DCF compressé, donc les écarts sont des hypothèses qui parlent.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The Gordon value' : 'a) La valeur de Gordon',
          enonce: en
            ? `From EPS, payout, g and r, what is the intrinsic value per share, in euros?`
            : `À partir du BPA, du payout, de g et de r, quelle est la valeur intrinsèque par action, en euros ?`,
          reponse: repGordon, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'Dividend first, perpetuity next' : "Le dividende d'abord, la perpétuité ensuite",
            contenu: en
              ? `$D_1$ = ${f(eps)} × ${f(payout / 100)} × ${f(1 + g / 100, 3)} = ${eur(r2(d1))}; $V = D_1/(r-g)$ = ${f(r2(d1))} / ${f((r - g) / 100, 4)} = **${eur(repGordon)}**.`
              : `$D_1$ = ${f(eps)} × ${f(payout / 100)} × ${f(1 + g / 100, 3)} = ${eur(r2(d1))} ; $V = D_1/(r-g)$ = ${f(r2(d1))} / ${f((r - g) / 100, 4)} = **${eur(repGordon)}**.`,
          }],
        },
        {
          intitule: en ? 'b) The P/E hidden in Gordon' : 'b) Le PER caché dans Gordon',
          enonce: en
            ? `What P/E does your own Gordon value imply for the target?`
            : `Quel PER votre propre valeur de Gordon implique-t-elle pour la cible ?`,
          reponse: repPerImp, tolerance: 0.05, toleranceMode: 'absolu', unite: '×',
          etapes: [{
            titre: en ? 'A multiple is a compressed DCF' : 'Un multiple est un DCF compressé',
            contenu: en
              ? `$PER_{implicite} = V/BPA$ = ${f(repGordon)} / ${f(eps)} = **${f(repPerImp, 1)}×** — that is payout × (1+g)/(r−g) in disguise. Compare it to the peers' ${f(persect, 1)}×: the whole triangulation in one ratio.`
              : `$PER_{implicite} = V/BPA$ = ${f(repGordon)} / ${f(eps)} = **${f(repPerImp, 1)}×** — soit payout × (1+g)/(r−g) déguisé. Comparez-le aux ${f(persect, 1)}× des pairs : toute la triangulation tient dans ce ratio.`,
          }],
          pieges: [en
            ? `If your implied P/E differs wildly from the sector's, your g and r quietly disagree with the market — find out which side is wrong before averaging anything.`
            : `Si votre PER implicite diverge fortement de celui du secteur, vos g et r sont en désaccord silencieux avec le marché — trouvez qui a tort avant de moyenner quoi que ce soit.`],
        },
        {
          intitule: en ? 'c) The peer-multiple value' : 'c) La valeur par les comparables',
          enonce: en
            ? `At the peers' P/E, what is the share worth, in euros?`
            : `Au PER des pairs, que vaut l'action, en euros ?`,
          reponse: repVPer, tolerance: 0.01, unite: '€',
          etapes: [{
            titre: en ? 'The market lends its multiple' : 'Le marché prête son multiple',
            contenu: en
              ? `$V_{PER}$ = ${f(persect, 1)} × ${f(eps)} = **${eur(repVPer)}** — what the equity market pays today for a euro of comparable earnings.`
              : `$V_{PER}$ = ${f(persect, 1)} × ${f(eps)} = **${eur(repVPer)}** — ce que le marché actions paie aujourd'hui un euro de bénéfice comparable.`,
          }],
        },
        {
          intitule: en ? 'd) The EV/EBITDA value' : "d) La valeur par l'EV/EBITDA",
          enonce: en
            ? `At the sector EV/EBITDA, after removing the per-share debt, what is the share worth, in euros?`
            : `Au multiple d'EV/EBITDA sectoriel, après retrait de la dette par action, que vaut l'action, en euros ?`,
          reponse: repVEv, tolerance: 0.01, unite: '€',
          etapes: [{
            titre: en ? 'EV per share, then off comes the debt' : "L'EV par action, puis la dette sort",
            contenu: en
              ? `$V_{EV}$ = ${f(mult, 1)} × ${f(ebps)} − ${f(dnet, 1)} = ${f(r2(mult * ebps))} − ${f(dnet, 1)} = **${eur(repVEv)}**. This is the acquirer's lens: it prices operations first, capital structure second.`
              : `$V_{EV}$ = ${f(mult, 1)} × ${f(ebps)} − ${f(dnet, 1)} = ${f(r2(mult * ebps))} − ${f(dnet, 1)} = **${eur(repVEv)}**. C'est la lunette de l'acquéreur : elle price l'exploitation d'abord, la structure financière ensuite.`,
          }],
          pieges: [en
            ? `Forgetting to subtract the €${f(dnet, 1)} of per-share debt hands the shareholders value that belongs to the creditors.`
            : `Oublier de soustraire les ${f(dnet, 1)} € de dette par action attribue aux actionnaires une valeur qui appartient aux créanciers.`],
        },
        {
          intitule: en ? 'e) The disagreement, measured' : 'e) Le désaccord, mesuré',
          enonce: en
            ? `Between the lowest and the highest of the three values, how wide is the gap, in % of the lowest?`
            : `Entre la plus basse et la plus haute des trois valeurs, quel est l'écart, en % de la plus basse ?`,
          reponse: repSpread, tolerance: 0.2, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'Line the three up' : 'Aligner les trois',
              contenu: en
                ? `Gordon ${eur(repGordon)} · P/E ${eur(repVPer)} · EV/EBITDA ${eur(repVEv)}: spread = (${f(r2(vMax))} − ${f(r2(vMin))}) / ${f(r2(vMin))} = **${pct(repSpread, 1)}**.`
                : `Gordon ${eur(repGordon)} · PER ${eur(repVPer)} · EV/EBITDA ${eur(repVEv)} : écart = (${f(r2(vMax))} − ${f(r2(vMin))}) / ${f(r2(vMin))} = **${pct(repSpread, 1)}**.`,
            },
            {
              titre: en ? 'Triangulate, never average blindly' : 'Trianguler, jamais moyenner aveuglément',
              contenu: en
                ? `${repSpread < 15 ? 'A tight spread: the three lenses roughly agree, the range is your answer.' : 'A wide spread: the methods disagree, and THAT is the finding — intrinsic assumptions vs market mood vs capital structure.'} The committee gets the range [${eur(r2(vMin))} ; ${eur(r2(vMax))}] with the story of each corner — not a fake-precise midpoint.`
                : `${repSpread < 15 ? 'Écart serré : les trois lunettes convergent à peu près, la fourchette est votre réponse.' : "Écart large : les méthodes divergent, et C'EST le résultat — hypothèses intrinsèques contre humeur de marché contre structure financière."} Le comité reçoit la fourchette [${eur(r2(vMin))} ; ${eur(r2(vMax))}] avec l'histoire de chaque borne — pas un milieu faussement précis.`,
            },
          ],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 17. m3-pb-short-squeeze — boss N4                                   */
/* ------------------------------------------------------------------ */
const shortSqueeze: ProblemGenerator = {
  id: 'm3-pb-short-squeeze', moduleId: M3,
  titre: 'Anatomie d\'un short squeeze, façon GameStop',
  titreEn: 'Anatomy of a short squeeze, GameStop style',
  typeDeCas: 'vente à découvert',
  typeDeCasEn: 'short selling',
  difficulte: 4,
  scenarios: ['Risk manager d\'un fonds pris dans la nasse', 'Analyste qui reconstitue janvier 2021', "Grand oral : jusqu'où un short peut-il saigner ?"],
  scenariosEn: ['Risk manager of a cornered fund', 'Analyst reconstructing January 2021', 'Final viva: how far can a short bleed?'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const F = randInt(rng, 30, 80);
    const SI = pick(rng, [85, 95, 110, 120, 140] as const);
    const q = randFloat(rng, 5, 20, 1);
    const P0 = randFloat(rng, 8, 20, 2);
    const P1 = r2(P0 * randFloat(rng, 1.7, 2.3, 2));
    const C = Math.round(q * P0 * randFloat(rng, 2, 2.8, 2));
    const V = randInt(rng, 8, 25);

    const encours = (F * SI) / 100;
    const perte = q * (P1 - P0);
    const appel = 1.3 * q * P1 - 1.5 * q * P0;
    const pStar = (1.5 * q * P0 + C) / (1.3 * q);
    const dtc = encours / V;
    const repEncours = r2(encours);
    const repPerte = r2(perte);
    const repAppel = r2(appel);
    const repPStar = r2(pStar);
    const repDtc = r2(dtc);

    const { en, f, eur, pct } = outils(langue);
    const desc = en
      ? `the float counts ${f(F, 0)} million shares and short interest reaches ${SI}% of it; your fund is short ${f(q, 1)} million shares sold at €${f(P0)}; the stock spikes to €${f(P1)}; margin rules: initial collateral of 150% of the proceeds, maintenance at 130% of the current value of the short; the fund can raise at most €${f(C, 0)} million of extra collateral; daily volume runs at ${f(V, 0)} million shares`
      : `le flottant compte ${f(F, 0)} millions de titres et le short interest en atteint ${SI} % ; votre fonds est court de ${f(q, 1)} millions de titres vendus à ${f(P0)} € ; le titre s'envole à ${f(P1)} € ; règles de marge : collatéral initial de 150 % du produit de vente, maintenance à 130 % de la valeur courante du short ; le fonds peut lever au plus ${f(C, 0)} M€ de collatéral supplémentaire ; le volume quotidien tourne à ${f(V, 0)} millions de titres`;
    const contexte = (en
      ? [
        `The line is burning and the prime broker is on hold: ${desc}. As risk manager you must size the trap — the crowd on the short side, the paper loss, the margin call, and above all the price at which the fund's collateral runs out: the capitulation price.`,
        `Three years later, you reconstruct the mechanics for the post-mortem (module 1 told the story; here are the numbers): ${desc}. Show why a short interest above the float is even possible, then trace the spiral — loss, call, forced buying — to the capitulation price.`,
        `The boss question of the viva: "a short position's loss is unlimited — make it concrete." The case: ${desc}. The examiner wants the four pressure gauges and the exact price at which this fund becomes a forced BUYER — the fuel of the squeeze.`,
      ]
      : [
        `La ligne brûle et le prime broker est en attente : ${desc}. Risk manager, vous devez chiffrer la nasse — la foule au short, la perte latente, l'appel de marge, et surtout le prix auquel le collatéral du fonds s'épuise : le prix de capitulation.`,
        `Trois ans après, vous reconstituez la mécanique pour le post-mortem (le module 1 racontait l'histoire ; voici les chiffres) : ${desc}. Montrez pourquoi un short interest au-delà du flottant est seulement possible, puis suivez la spirale — perte, appel, rachats forcés — jusqu'au prix de capitulation.`,
        `La question boss de l'oral : « la perte d'un short est illimitée — rendez cela concret. » Le dossier : ${desc}. L'examinateur veut les quatre jauges de pression et le prix exact auquel ce fonds devient ACHETEUR forcé — le carburant du squeeze.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The crowd on the short side' : 'a) La foule au short',
          enonce: en
            ? `How many shares are sold short in total, in millions?`
            : `Combien de titres sont vendus à découvert au total, en millions ?`,
          reponse: repEncours, tolerance: 0.05, toleranceMode: 'absolu', unite: 'millions',
          etapes: [
            {
              titre: en ? 'Short interest × float' : 'Short interest × flottant',
              contenu: en
                ? `Outstanding shorts = ${SI}% × ${f(F, 0)} = **${f(repEncours, 1)} million** shares${SI > 100 ? ` — MORE than the ${f(F, 0)} million of the float itself` : ''}.`
                : `Encours short = ${SI} % × ${f(F, 0)} = **${f(repEncours, 1)} millions** de titres${SI > 100 ? ` — PLUS que les ${f(F, 0)} millions du flottant lui-même` : ''}.`,
            },
            {
              titre: en ? 'How can it exceed the float?' : 'Comment dépasser le flottant ?',
              contenu: en
                ? `A borrowed-and-sold share lands in a buyer's account… who can lend it again: the re-lending chain counts the same share several times. Legal, mechanical — and highly flammable: more shares must be bought back than truly circulate.`
                : `Un titre emprunté puis vendu atterrit chez un acheteur… qui peut le reprêter : la chaîne de réemprunt compte le même titre plusieurs fois. Légal, mécanique — et hautement inflammable : il faudra racheter plus de titres qu'il n'en circule vraiment.`,
            },
          ],
        },
        {
          intitule: en ? 'b) The paper loss' : 'b) La perte latente',
          enonce: en
            ? `On the fund's position, what is the unrealised loss at €${f(P1)}, in millions of euros?`
            : `Sur la position du fonds, quelle est la perte latente à ${f(P1)} €, en millions d'euros ?`,
          reponse: repPerte, tolerance: 0.05, toleranceMode: 'absolu', unite: 'M€',
          etapes: [{
            titre: en ? 'Sold low, owes high' : 'Vendu bas, doit haut',
            contenu: en
              ? `Loss = ${f(q, 1)} × (${f(P1)} − ${f(P0)}) = **€${f(repPerte, 1)} million**, i.e. ${pct(r2((P1 / P0 - 1) * 100), 0)} of the proceeds — and the meter is still running: no ceiling caps a short's loss.`
              : `Perte = ${f(q, 1)} × (${f(P1)} − ${f(P0)}) = **${f(repPerte, 1)} M€**, soit ${pct(r2((P1 / P0 - 1) * 100), 0)} du produit de vente — et le compteur tourne encore : aucun plafond ne borne la perte d'un short.`,
          }],
        },
        {
          intitule: en ? 'c) The margin call' : "c) L'appel de marge",
          enonce: en
            ? `The account holds 150% of the original proceeds. Maintenance requires 130% of the CURRENT value of the short. How much extra cash does the broker demand at €${f(P1)}, in millions of euros?`
            : `Le compte détient 150 % du produit de vente initial. La maintenance exige 130 % de la valeur COURANTE du short. Combien de cash supplémentaire le courtier réclame-t-il à ${f(P1)} €, en millions d'euros ?`,
          reponse: repAppel, tolerance: 0.05, toleranceMode: 'absolu', unite: 'M€',
          etapes: [
            {
              titre: en ? 'Required against held' : 'Exigé contre détenu',
              contenu: en
                ? `Required: 130% × ${f(q, 1)} × ${f(P1)} = ${f(r2(1.3 * q * P1), 1)}. Held: 150% × ${f(q, 1)} × ${f(P0)} = ${f(r2(1.5 * q * P0), 1)}. Call = **€${f(repAppel, 1)} million**, due now.`
                : `Exigé : 130 % × ${f(q, 1)} × ${f(P1)} = ${f(r2(1.3 * q * P1), 1)}. Détenu : 150 % × ${f(q, 1)} × ${f(P0)} = ${f(r2(1.5 * q * P0), 1)}. Appel = **${f(repAppel, 1)} M€**, exigible immédiatement.`,
            },
            {
              titre: en ? 'Why the spiral feeds itself' : 'Pourquoi la spirale s\'auto-alimente',
              contenu: en
                ? `Every short that cannot pay must BUY to close — buying that pushes the price higher, which raises the next fund's call. The squeeze is a chain reaction running on margin rules.`
                : `Chaque short qui ne peut pas payer doit ACHETER pour clore — des achats qui poussent le cours, ce qui gonfle l'appel du fonds suivant. Le squeeze est une réaction en chaîne carburant aux règles de marge.`,
            },
          ],
          pieges: [en
            ? `Computing the call on the ORIGINAL value of the short misses the point: maintenance tracks the current price — that is precisely what makes rising prices lethal.`
            : `Calculer l'appel sur la valeur INITIALE du short manque l'essentiel : la maintenance suit le cours courant — c'est précisément ce qui rend la hausse létale.`],
        },
        {
          intitule: en ? 'd) The capitulation price' : 'd) Le prix de capitulation',
          enonce: en
            ? `With at most €${f(C, 0)} million of extra collateral available, above what price is the fund forced to buy back, in euros?`
            : `Avec au plus ${f(C, 0)} M€ de collatéral mobilisable, au-delà de quel cours le fonds est-il contraint de racheter, en euros ?`,
          reponse: repPStar, tolerance: 0.02, toleranceMode: 'absolu', unite: '€',
          etapes: [{
            titre: en ? 'Where the collateral runs dry' : 'Là où le collatéral s\'épuise',
            contenu: en
              ? `Solve $1.3\\,q\\,P^* = 1.5\\,q\\,P_0 + C$: $P^*$ = (${f(r2(1.5 * q * P0), 1)} + ${f(C, 0)}) / (1.3 × ${f(q, 1)}) = **${eur(repPStar)}** — above today's ${eur(P1)}. The fund still stands… until ${eur(repPStar)}. Past it, its own forced buying becomes the squeeze's fuel. That asymmetry — shorts can be FORCED out, longs cannot — is the whole story of January 2021.`
              : `Résoudre $1.3\\,q\\,P^* = 1.5\\,q\\,P_0 + C$ : $P^*$ = (${f(r2(1.5 * q * P0), 1)} + ${f(C, 0)}) / (1,3 × ${f(q, 1)}) = **${eur(repPStar)}** — au-dessus des ${eur(P1)} actuels. Le fonds tient encore… jusqu'à ${eur(repPStar)}. Au-delà, ses propres rachats forcés deviennent le carburant du squeeze. Cette asymétrie — un short peut être SORTI de force, pas un long — est toute l'histoire de janvier 2021.`,
          }],
        },
        {
          intitule: en ? 'e) Days to cover' : 'e) Days to cover',
          enonce: en
            ? `At the current volume, how many days would it take ALL shorts to buy back, in days?`
            : `Au volume actuel, combien de jours faudrait-il à TOUS les shorts pour racheter, en jours ?`,
          reponse: repDtc, tolerance: 0.05, toleranceMode: 'absolu', unite: en ? 'days' : 'jours',
          etapes: [{
            titre: en ? 'The exit-door gauge' : 'La jauge de la porte de sortie',
            contenu: en
              ? `DTC = ${f(repEncours, 1)} / ${f(V, 0)} = **${f(repDtc, 1)} days** of full volume. The squeeze gauge: the narrower the door and the bigger the crowd, the higher the price must go to find sellers. ${repDtc > 3 ? 'Here the door is dangerously narrow.' : 'Here the door is still passable — which only moderates the trap.'}`
              : `DTC = ${f(repEncours, 1)} / ${f(V, 0)} = **${f(repDtc, 1)} jours** de volume entier. La jauge du squeeze : plus la porte est étroite et la foule dense, plus le cours doit monter pour trouver des vendeurs. ${repDtc > 3 ? 'Ici, la porte est dangereusement étroite.' : 'Ici, la porte reste praticable — ce qui ne fait qu\'atténuer la nasse.'}`,
          }],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 18. m3-pb-dilution-relution — boss N4                               */
/* ------------------------------------------------------------------ */
const dilutionRelution: ProblemGenerator = {
  id: 'm3-pb-dilution-relution', moduleId: M3,
  titre: 'Acquisition payée en titres : relutif ou dilutif ?',
  titreEn: 'All-share acquisition: accretive or dilutive?',
  typeDeCas: 'fusions-acquisitions',
  typeDeCasEn: 'mergers and acquisitions',
  difficulte: 4,
  scenarios: ["Analyste M&A la veille de l'annonce", 'Administrateur qui doit voter le deal', "Grand oral : le critère du banquier"],
  scenariosEn: ['M&A analyst the night before the announcement', 'Board member about to vote the deal', "Final viva: the banker's criterion"],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const Ba = randInt(rng, 300, 900);
    const Na = randInt(rng, 80, 250);
    const perA = randFloat(rng, 13, 19, 1);
    const perB = r1(perA + pick(rng, [-4.5, -3, -2, 2, 3.5] as const));
    const Bb = randInt(rng, 60, 250);

    const bpaAvant = bpa(Ba, Na);
    const prixPaye = perB * Bb;
    const Pa = (perA * Ba) / Na;
    const nNew = prixPaye / Pa;
    const bpaPro = (Ba + Bb) / (Na + nNew);
    const relution = (bpaPro / bpaAvant - 1) * 100;
    const ecartPer = perA - perB;
    const relutif = perB < perA;
    const repAvant = r2(bpaAvant);
    const repPrix = r2(prixPaye);
    const repNNew = r2(nNew);
    const repPro = r2(bpaPro);
    const repRel = r2(relution);
    const repEcart = r2(ecartPer);

    const { en, f, eur, pct } = outils(langue);
    const desc = en
      ? `the acquirer earns €${f(Ba, 0)} million with ${f(Na, 0)} million shares and trades at ${f(perA, 1)} times earnings; the target earns €${f(Bb, 0)} million and is paid ${f(perB, 1)} times its earnings, fully in new shares issued at the acquirer's market price (no synergies counted)`
      : `l'acquéreur gagne ${f(Ba, 0)} M€ avec ${f(Na, 0)} millions d'actions et se paie ${f(perA, 1)} fois ses bénéfices ; la cible gagne ${f(Bb, 0)} M€ et est payée ${f(perB, 1)} fois ses bénéfices, intégralement en actions nouvelles émises au cours de l'acquéreur (aucune synergie comptée)`;
    const contexte = (en
      ? [
        `Announcement at dawn, and the press release must state "accretive" or "dilutive" without trembling: ${desc}. You build the pro forma EPS step by step, then check the number against the only criterion that predicts it without a model.`,
        `As a board member you vote tomorrow, and the bankers' deck shows only the conclusion: ${desc}. You redo the arithmetic yourself — price paid, shares issued, pro forma EPS — and you re-derive the rule of thumb that the deck quietly assumes.`,
        `The viva's M&A boss question: "when is an all-share deal accretive?" The case: ${desc}. The examiner wants the chain AND the criterion — paid P/E versus own P/E — AND the warning that accretion is not value creation.`,
      ]
      : [
        `Annonce à l'aube, et le communiqué doit écrire « relutif » ou « dilutif » sans trembler : ${desc}. Vous construisez le BPA pro forma pas à pas, puis confrontez le chiffre au seul critère qui le prédit sans modèle.`,
        `Administrateur, vous votez demain, et le deck des banquiers ne montre que la conclusion : ${desc}. Vous refaites l'arithmétique vous-même — prix payé, titres émis, BPA pro forma — et vous redémontrez la règle que le deck suppose en silence.`,
        `La question boss M&A de l'oral : « quand un deal tout-en-titres est-il relutif ? » Le dossier : ${desc}. L'examinateur veut la chaîne ET le critère — PER payé contre PER propre — ET l'avertissement que la relution n'est pas une création de valeur.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? "a) The acquirer's standalone EPS" : "a) Le BPA de l'acquéreur seul",
          enonce: en
            ? `Before the deal, what is the acquirer's EPS, in euros?`
            : `Avant l'opération, quel est le BPA de l'acquéreur, en euros ?`,
          reponse: repAvant, tolerance: 0.01, toleranceMode: 'absolu', unite: '€',
          etapes: [{
            titre: en ? 'The baseline to beat' : 'La référence à battre',
            contenu: en
              ? `$BPA_A = B_A / N_A$ = ${f(Ba, 0)} / ${f(Na, 0)} = **${eur(repAvant)}** — and its share price is $PER_A \\times BPA_A$ = ${eur(r2(Pa))}.`
              : `$BPA_A = B_A / N_A$ = ${f(Ba, 0)} / ${f(Na, 0)} = **${eur(repAvant)}** — et son cours vaut $PER_A \\times BPA_A$ = ${eur(r2(Pa))}.`,
          }],
        },
        {
          intitule: en ? 'b) The price paid' : 'b) Le prix payé',
          enonce: en
            ? `At ${f(perB, 1)} times the target's earnings, what does the acquisition cost, in millions of euros?`
            : `À ${f(perB, 1)} fois les bénéfices de la cible, combien coûte l'acquisition, en millions d'euros ?`,
          reponse: repPrix, tolerance: 0.01, unite: 'M€',
          etapes: [{
            titre: en ? 'Multiple × earnings, again' : 'Multiple × bénéfice, encore',
            contenu: en
              ? `Price = ${f(perB, 1)} × ${f(Bb, 0)} = **€${f(repPrix, 0)} million**. The deal multiple (premium included) is the variable the negotiation actually fights over.`
              : `Prix = ${f(perB, 1)} × ${f(Bb, 0)} = **${f(repPrix, 0)} M€**. Le multiple de transaction (prime incluse) est la variable pour laquelle la négociation se bat vraiment.`,
          }],
        },
        {
          intitule: en ? 'c) The shares issued' : 'c) Les titres émis',
          enonce: en
            ? `Paid fully in shares at the acquirer's price, how many new shares must be issued, in millions?`
            : `Payée intégralement en titres au cours de l'acquéreur, combien d'actions nouvelles faut-il émettre, en millions ?`,
          reponse: repNNew, tolerance: 0.01, toleranceMode: 'absolu', unite: 'millions',
          etapes: [{
            titre: en ? 'Price paid over own price' : 'Prix payé sur cours propre',
            contenu: en
              ? `$n = prix / P_A$ = ${f(repPrix, 0)} / ${f(r2(Pa))} = **${f(repNNew)} million** new shares — the dilution instrument itself: the seller is paid in slices of the buyer.`
              : `$n = prix / P_A$ = ${f(repPrix, 0)} / ${f(r2(Pa))} = **${f(repNNew)} millions** d'actions nouvelles — l'instrument même de la dilution : le vendeur est payé en parts de l'acheteur.`,
          }],
        },
        {
          intitule: en ? 'd) The pro forma EPS' : 'd) Le BPA pro forma',
          enonce: en
            ? `Combined earnings over the enlarged share count: what is the pro forma EPS, in euros?`
            : `Bénéfices combinés sur le capital élargi : quel est le BPA pro forma, en euros ?`,
          reponse: repPro, tolerance: 0.01, toleranceMode: 'absolu', unite: '€',
          etapes: [{
            titre: en ? 'Two earnings, one share count' : 'Deux bénéfices, un seul capital',
            contenu: en
              ? `$BPA' = \\frac{B_A + B_B}{N_A + n}$ = (${f(Ba, 0)} + ${f(Bb, 0)}) / (${f(Na, 0)} + ${f(repNNew)}) = **${eur(repPro)}**, against ${eur(repAvant)} standalone.`
              : `$BPA' = \\frac{B_A + B_B}{N_A + n}$ = (${f(Ba, 0)} + ${f(Bb, 0)}) / (${f(Na, 0)} + ${f(repNNew)}) = **${eur(repPro)}**, contre ${eur(repAvant)} en solo.`,
          }],
          pieges: [en
            ? `No synergies were counted, by design: announced synergies are a promise, the share issuance is a certainty — prudence prices the certainty first.`
            : `Aucune synergie comptée, à dessein : les synergies annoncées sont une promesse, l'émission de titres une certitude — la prudence price d'abord la certitude.`],
        },
        {
          intitule: en ? 'e) Accretion or dilution' : 'e) Relution ou dilution',
          enonce: en
            ? `By what percentage does the EPS change (positive = accretive)?`
            : `De quel pourcentage le BPA change-t-il (positif = relutif) ?`,
          reponse: repRel, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'The verdict in one ratio' : 'Le verdict en un rapport',
              contenu: en
                ? `${f(repPro)} / ${f(repAvant)} − 1 = **${pct(repRel)}** : the deal is **${relutif ? 'accretive' : 'dilutive'}**.`
                : `${f(repPro)} / ${f(repAvant)} − 1 = **${pct(repRel)}** : l'opération est **${relutif ? 'relutive' : 'dilutive'}**.`,
            },
            {
              titre: en ? 'Accretion is NOT value creation' : "La relution n'est PAS une création de valeur",
              contenu: en
                ? `EPS mixes two earnings pools and a share count — it says nothing about the price paid being right. A deal can be accretive and destroy value (overpaying a low-P/E target), or dilutive and create it. The market votes on the strategy, not on the pro forma EPS line.`
                : `Le BPA mélange deux bénéfices et un nombre de titres — il ne dit rien de la justesse du prix payé. Un deal peut être relutif et détruire de la valeur (surpayer une cible à PER bas), ou dilutif et en créer. Le marché vote sur la stratégie, pas sur la ligne de BPA pro forma.`,
            },
          ],
        },
        {
          intitule: en ? "f) The banker's criterion" : 'f) Le critère du banquier',
          enonce: en
            ? `What is the gap between the acquirer's P/E and the P/E paid (PER_A − PER_paid), in multiple points?`
            : `Quel est l'écart entre le PER de l'acquéreur et le PER payé (PER_A − PER_payé), en points de multiple ?`,
          reponse: repEcart, tolerance: 0.02, toleranceMode: 'absolu', unite: 'pts',
          etapes: [{
            titre: en ? 'The rule that predicts the sign' : 'La règle qui prédit le signe',
            contenu: en
              ? `Gap = ${f(perA, 1)} − ${f(perB, 1)} = **${f(repEcart, 1)} points**. All-share, no synergies: accretive IF AND ONLY IF the P/E paid is below the acquirer's own (${f(perB, 1)} ${relutif ? '<' : '>'} ${f(perA, 1)} here — hence the ${pct(repRel)}). Intuition: you trade paper worth ${f(perA, 1)} years of earnings for earnings priced at ${f(perB, 1)} years. ${relutif ? 'Cheap earnings bought with expensive paper: the EPS rises.' : 'Expensive earnings bought with cheaper paper: the EPS falls.'}`
              : `Écart = ${f(perA, 1)} − ${f(perB, 1)} = **${f(repEcart, 1)} points**. Tout-en-titres, sans synergie : relutif SI ET SEULEMENT SI le PER payé est inférieur au PER propre (${f(perB, 1)} ${relutif ? '<' : '>'} ${f(perA, 1)} ici — d'où les ${pct(repRel)}). Intuition : on échange du papier valant ${f(perA, 1)} années de bénéfices contre des bénéfices payés ${f(perB, 1)} années. ${relutif ? 'Du bénéfice bon marché payé en papier cher : le BPA monte.' : 'Du bénéfice cher payé en papier meilleur marché : le BPA baisse.'}`,
          }],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 19. m3-pb-index-rebalancing — boss N4                               */
/* ------------------------------------------------------------------ */
const indexRebalancing: ProblemGenerator = {
  id: 'm3-pb-index-rebalancing', moduleId: M3,
  titre: "Entrée dans l'indice : les flux, l'impact, et ceux qui se placent devant",
  titreEn: 'Index inclusion: the flows, the impact, and those who step in front',
  typeDeCas: 'gestion indicielle',
  typeDeCasEn: 'index investing',
  difficulte: 4,
  scenarios: ["Stratège qui chiffre une annonce d'inclusion", "Trader d'arbitrage indiciel avant la date effective", "Grand oral : le coût caché de la gestion passive"],
  scenariosEn: ['Strategist sizing an inclusion announcement', 'Index-arb trader before the effective date', 'Final viva: the hidden cost of passive investing'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const T = randInt(rng, 20, 60);
    const w = randFloat(rng, 0.3, 0.8, 2);
    const V = randInt(rng, 20, 60);
    const theta = randFloat(rng, 0.8, 1.5, 1);
    const pos = randInt(rng, 20, 80);
    const fCapt = pick(rng, [40, 50, 60, 70] as const);

    const flux = 10 * T * w;
    const jours = flux / V;
    const impact = theta * Math.sqrt(jours);
    const gain = (pos * impact * fCapt) / 10;
    const coutFonds = (flux * impact) / 100;
    const repFlux = r2(flux);
    const repJours = r2(jours);
    const repImpact = r2(impact);
    const repGain = r2(gain);
    const repCout = r2(coutFonds);

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `€${f(T, 0)} billion of index money tracks the benchmark; the entrant will weigh ${f(w)}% of it; the stock trades €${f(V, 0)} million a day; the desk's impact model is square-root shaped, scaled at ${f(theta, 1)}% per day of volume traded; an arbitrageur runs a €${f(pos, 0)} million position, capturing ${fCapt}% of the impact`
      : `${f(T, 0)} Md€ de gestion indicielle répliquent l'indice ; l'entrant pèsera ${f(w)} % de celui-ci ; le titre traite ${f(V, 0)} M€ par jour ; le modèle d'impact du desk est en racine carrée, calibré à ${f(theta, 1)} % par jour de volume traité ; un arbitragiste monte une position de ${f(pos, 0)} M€, capturant ${fCapt} % de l'impact`;
    const contexte = (en
      ? [
        `The committee just announced the inclusion, effective in three weeks: ${desc}. As index strategist you size the mechanical demand, the days of volume it represents, the price impact — and who pockets it.`,
        `On the index-arbitrage desk, the window between announcement and effective date is the whole business: ${desc}. Quantify the flow the trackers MUST execute on one day, the impact your model predicts, and what your early position captures of it.`,
        `The viva closes on the paradox of passive investing: "who pays for the index's housekeeping?" The case: ${desc}. Walk the chain — forced flow, crowded door, impact — and name the bill the index funds quietly foot.`,
      ]
      : [
        `Le comité vient d'annoncer l'inclusion, effective dans trois semaines : ${desc}. Stratège indiciel, vous chiffrez la demande mécanique, les jours de volume qu'elle représente, l'impact sur le cours — et qui l'empoche.`,
        `Au desk d'arbitrage indiciel, la fenêtre entre annonce et date effective est tout le métier : ${desc}. Quantifiez le flux que les répliquants DEVRONT exécuter en un jour, l'impact que votre modèle prédit, et ce que votre position précoce en capture.`,
        `L'oral se clôt sur le paradoxe du passif : « qui paie l'intendance de l'indice ? » Le dossier : ${desc}. Déroulez la chaîne — flux forcé, porte étroite, impact — et nommez la facture que les fonds indiciels règlent en silence.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The forced flow' : 'a) Le flux forcé',
          enonce: en
            ? `How much of the stock must index funds buy, in millions of euros?`
            : `Combien de titre les fonds indiciels doivent-ils acheter, en millions d'euros ?`,
          reponse: repFlux, tolerance: 0.01, unite: 'M€',
          etapes: [{
            titre: en ? 'AUM × weight' : 'Encours × poids',
            contenu: en
              ? `Flow = ${f(T, 0)} billion × ${pct(w)} = **€${f(repFlux, 0)} million** of mechanical, price-insensitive demand: a tracker's only mandate is to hold the index, whatever the price on inclusion day.`
              : `Flux = ${f(T, 0)} Md€ × ${pct(w)} = **${f(repFlux, 0)} M€** de demande mécanique, insensible au prix : le seul mandat d'un répliquant est de détenir l'indice, quel que soit le prix du jour d'inclusion.`,
          }],
        },
        {
          intitule: en ? 'b) The crowd at the door' : 'b) La foule à la porte',
          enonce: en
            ? `How many days of normal volume does that flow represent?`
            : `Combien de jours de volume normal ce flux représente-t-il ?`,
          reponse: repJours, tolerance: 0.05, toleranceMode: 'absolu', unite: en ? 'days' : 'jours',
          etapes: [{
            titre: en ? 'Flow over daily volume' : 'Flux sur volume quotidien',
            contenu: en
              ? `${f(repFlux, 0)} / ${f(V, 0)} = **${f(repJours, 1)} days** of the stock's entire trading — and most of it concentrates on ONE closing auction, the effective date.`
              : `${f(repFlux, 0)} / ${f(V, 0)} = **${f(repJours, 1)} jours** d'échanges entiers du titre — et l'essentiel se concentre sur UN fixing, celui de la date effective.`,
          }],
        },
        {
          intitule: en ? 'c) The price impact' : "c) L'impact sur le cours",
          enonce: en
            ? `With the square-root model, what price impact should the flow produce, in %?`
            : `Avec le modèle en racine, quel impact de cours ce flux doit-il produire, en % ?`,
          reponse: repImpact, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'The square-root law' : 'La loi en racine',
              contenu: en
                ? `$Impact = \\theta \\sqrt{jours}$ = ${f(theta, 1)} × √${f(repJours, 1)} = **${pct(repImpact)}**. Empirical regularity: impact grows like the square root of the size — doubling the flow does NOT double the dent.`
                : `$Impact = \\theta \\sqrt{jours}$ = ${f(theta, 1)} × √${f(repJours, 1)} = **${pct(repImpact)}**. Régularité empirique : l'impact croît comme la racine de la taille — doubler le flux ne double PAS la trace.`,
            },
            {
              titre: en ? 'A model, not a law of physics' : 'Un modèle, pas une loi physique',
              contenu: en
                ? `θ is calibrated on past episodes; a crowded event can beat the model. Treat ${pct(repImpact)} as an order of magnitude — the prudent reflex of module 2.`
                : `θ est calibré sur les épisodes passés ; un événement encombré peut déborder le modèle. Traitez ${pct(repImpact)} comme un ordre de grandeur — le réflexe prudent du module 2.`,
            },
          ],
        },
        {
          intitule: en ? "d) The front-runner's capture" : "d) La capture de celui qui se place devant",
          enonce: en
            ? `Buying early and selling into the inclusion flow, the arbitrageur captures ${fCapt}% of the impact on his €${f(pos, 0)} million. What is his gain, in thousands of euros?`
            : `Acheté tôt et revendu dans le flux d'inclusion, l'arbitragiste capture ${fCapt} % de l'impact sur ses ${f(pos, 0)} M€. Quel est son gain, en milliers d'euros ?`,
          reponse: repGain, tolerance: 0.5, toleranceMode: 'absolu', unite: 'k€',
          etapes: [
            {
              titre: en ? 'Position × captured impact' : 'Position × impact capturé',
              contenu: en
                ? `Gain = ${f(pos, 0)} M€ × ${pct(repImpact)} × ${fCapt}% = **€${f(repGain, 0)} thousand**, earned by standing between the announcement and the trackers.`
                : `Gain = ${f(pos, 0)} M€ × ${pct(repImpact)} × ${fCapt} % = **${f(repGain, 0)} k€**, gagnés en se tenant entre l'annonce et les répliquants.`,
            },
            {
              titre: en ? 'Legal here — with a bright line' : 'Légal ici — avec une ligne claire',
              contenu: en
                ? `Trading on the PUBLIC announcement is index arbitrage, legal and arguably useful (it spreads the flow over time). Front-running in the strict, illegal sense is trading on a CLIENT's order before executing it. Same word in the papers, different acts in court — keep the distinction sharp.`
                : `Trader sur l'annonce PUBLIQUE relève de l'arbitrage indiciel, légal et sans doute utile (il étale le flux dans le temps). Le front-running au sens strict, illégal, consiste à trader sur l'ordre d'un CLIENT avant de l'exécuter. Même mot dans la presse, actes différents au tribunal — gardez la distinction nette.`,
            },
          ],
        },
        {
          intitule: en ? "e) The index funds' bill" : 'e) La facture des fonds indiciels',
          enonce: en
            ? `Executing the whole flow at the impacted price, what does the inclusion cost the trackers, in millions of euros?`
            : `En exécutant tout le flux au prix impacté, combien l'inclusion coûte-t-elle aux répliquants, en millions d'euros ?`,
          reponse: repCout, tolerance: 0.05, toleranceMode: 'absolu', unite: 'M€',
          etapes: [{
            titre: en ? 'Flow × impact' : 'Flux × impact',
            contenu: en
              ? `Cost = ${f(repFlux, 0)} × ${pct(repImpact)} = **€${f(repCout, 1)} million**, paid by every index-fund holder in a slightly worse entry price. The "free" passive fund pays its housekeeping here — invisibly, at each rebalancing. That is the structural toll the strategy accepts in exchange for its low fees.`
              : `Coût = ${f(repFlux, 0)} × ${pct(repImpact)} = **${f(repCout, 1)} M€**, payés par chaque porteur de fonds indiciel via un prix d'entrée un peu plus mauvais. Le fonds passif « gratuit » règle ici son intendance — invisiblement, à chaque rebalancement. C'est le péage structurel que la stratégie accepte en échange de ses frais réduits.`,
          }],
          pieges: [en
            ? `This cost never shows in the fund's expense ratio: it hides in the tracking against a paper index that rebalances at the unimpacted price.`
            : `Ce coût n'apparaît jamais dans les frais du fonds : il se cache dans l'écart de réplication face à un indice papier qui, lui, se rebalance au prix non impacté.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 20. m3-pb-efficience-anomalie — boss N4                             */
/* ------------------------------------------------------------------ */
const efficienceAnomalie: ProblemGenerator = {
  id: 'm3-pb-efficience-anomalie', moduleId: M3,
  titre: "L'anomalie momentum survit-elle aux frais et au test t ?",
  titreEn: 'Does the momentum anomaly survive costs and the t-test?',
  typeDeCas: 'efficience des marchés',
  typeDeCasEn: 'market efficiency',
  difficulte: 4,
  scenarios: ['Quant qui audite un backtest momentum', 'Allocataire démarché par un fonds factoriel', "Grand oral : l'efficience au tribunal des données"],
  scenariosEn: ['Quant auditing a momentum backtest', 'Allocator pitched by a factor fund', 'Final viva: efficiency on trial by data'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const mBrut = randFloat(rng, 0.6, 1.2, 2);
    const sigma = randFloat(rng, 3, 5, 1);
    const n = pick(rng, [60, 90, 120, 180] as const);
    const tau = pick(rng, [40, 50, 60, 75, 90] as const);
    const cbps = pick(rng, [20, 25, 30, 40] as const);

    const drag = (tau * cbps) / 10000;
    const netM = mBrut - drag;
    const netAnn = ((1 + netM / 100) ** 12 - 1) * 100;
    const tBrut = statT(mBrut, 0, sigma, n);
    const tNet = statT(netM, 0, sigma, n);
    const marge = tNet - 1.96;
    const survit = marge > 0;
    const repDrag = r2(drag);
    const repNetM = r2(netM);
    const repNetAnn = r2(netAnn);
    const repTBrut = r2(tBrut);
    const repTNet = r2(tNet);
    const repMarge = r2(marge);

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `the long-short momentum strategy posts a gross excess return of ${f(mBrut)}% a month with a standard deviation of ${f(sigma, 1)}% over ${n} months of backtest; the portfolio turns over ${tau}% a month and each round trip costs ${cbps} basis points`
      : `la stratégie momentum long-short affiche un excès de rendement brut de ${f(mBrut)} % par mois avec un écart-type de ${f(sigma, 1)} % sur ${n} mois de backtest ; le portefeuille tourne de ${tau} % par mois et chaque aller-retour coûte ${cbps} points de base`;
    const contexte = (en
      ? [
        `A beautiful backtest lands on the quant desk, and your job is to break it: ${desc}. The audit runs in order — cost drag (module 1's frictions), net return, then the module-2 t-test, gross and net — before anyone calls this an "anomaly".`,
        `A factor fund pitches you its momentum product with the gross curve in big print: ${desc}. As allocator, you redo the two subtractions the slide skips — costs first, statistical luck second — and decide whether anything investable remains.`,
        `The viva's closing boss question: "momentum contradicts efficiency — does it?" The case: ${desc}. The examiner wants the full trial: the friction bill, the net figure, the t-statistics, and a verdict that respects both the data and the doubt.`,
      ]
      : [
        `Un beau backtest atterrit au desk quant, et votre travail est de le casser : ${desc}. L'audit se déroule dans l'ordre — ponction des coûts (les frictions du module 1), rendement net, puis le test t du module 2, en brut et en net — avant que quiconque parle d'« anomalie ».`,
        `Un fonds factoriel vous pitche son produit momentum avec la courbe brute en gros caractères : ${desc}. Allocataire, vous refaites les deux soustractions que la slide saute — les coûts d'abord, la chance statistique ensuite — et décidez s'il reste quelque chose d'investissable.`,
        `La question boss qui clôt l'oral : « le momentum contredit l'efficience — vraiment ? » Le dossier : ${desc}. L'examinateur veut le procès complet : la facture des frictions, le chiffre net, les statistiques t, et un verdict qui respecte les données autant que le doute.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The monthly cost drag' : 'a) La ponction mensuelle des coûts',
          enonce: en
            ? `Turnover times cost per round trip: how much do frictions eat each month, in % of the portfolio?`
            : `Rotation fois coût par aller-retour : combien les frictions mangent-elles chaque mois, en % du portefeuille ?`,
          reponse: repDrag, tolerance: 0.005, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Module 1 sends its bill' : 'Le module 1 envoie sa facture',
            contenu: en
              ? `Drag = ${tau}% × ${cbps} bp = ${tau / 100} × ${f(cbps / 100, 2)}% = **${pct(repDrag)}** a month. Momentum is a high-turnover machine: its costs are not a detail, they are a co-star.`
              : `Ponction = ${tau} % × ${cbps} pb = ${tau / 100} × ${f(cbps / 100, 2)} % = **${pct(repDrag)}** par mois. Le momentum est une machine à forte rotation : ses coûts ne sont pas un détail, ils partagent l'affiche.`,
          }],
          pieges: [en
            ? `Forgetting that ${cbps} bp applies to the TRADED fraction only (${tau}%), not the whole book — or worse, ignoring costs entirely, like the marketing slide.`
            : `Oublier que les ${cbps} pb ne frappent que la fraction TRAITÉE (${tau} %), pas tout le livre — ou pire, ignorer les coûts, comme la slide marketing.`],
        },
        {
          intitule: en ? 'b) The net monthly excess return' : "b) L'excès de rendement mensuel net",
          enonce: en
            ? `What does the strategy earn net of costs, in % a month?`
            : `Que rapporte la stratégie nette de coûts, en % par mois ?`,
          reponse: repNetM, tolerance: 0.005, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Gross minus drag' : 'Brut moins ponction',
            contenu: en
              ? `Net = ${f(mBrut)} − ${f(repDrag)} = **${pct(repNetM)}** a month: frictions confiscate ${pct(r2(drag / mBrut * 100), 0)} of the advertised edge before any other question is asked.`
              : `Net = ${f(mBrut)} − ${f(repDrag)} = **${pct(repNetM)}** par mois : les frictions confisquent ${pct(r2(drag / mBrut * 100), 0)} de l'avantage affiché avant toute autre question.`,
          }],
        },
        {
          intitule: en ? 'c) Annualised, for the committee' : 'c) Annualisé, pour le comité',
          enonce: en
            ? `Compounded over twelve months, what is the net annual excess return, in %?`
            : `Composé sur douze mois, quel est l'excès de rendement annuel net, en % ?`,
          reponse: repNetAnn, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Twelve compoundings, not ×12' : 'Douze compositions, pas ×12',
            contenu: en
              ? `$(1 + ${f(repNetM)}\\%)^{12} - 1$ = **${pct(repNetAnn, 1)}** a year — against ${pct(r2(netM * 12), 1)} by lazy multiplication. Returns compound; the committee deck must too.`
              : `$(1 + ${f(repNetM)}\\,\\%)^{12} - 1$ = **${pct(repNetAnn, 1)}** par an — contre ${pct(r2(netM * 12), 1)} en multiplication paresseuse. Les rendements se composent ; le deck du comité aussi.`,
          }],
        },
        {
          intitule: en ? 'd) The gross t-statistic' : 'd) La statistique t brute',
          enonce: en
            ? `Is the GROSS mean statistically distinguishable from zero? Compute its t-statistic.`
            : `La moyenne BRUTE se distingue-t-elle statistiquement de zéro ? Calculez sa statistique t.`,
          reponse: repTBrut, tolerance: 0.02, toleranceMode: 'absolu', unite: 't',
          etapes: [{
            titre: en ? 'Module 2 takes the stand' : 'Le module 2 à la barre',
            contenu: en
              ? `$t = \\frac{\\bar{x} - 0}{\\sigma/\\sqrt{n}}$ = ${f(mBrut)} / (${f(sigma, 1)}/√${n}) = ${f(mBrut)} / ${f(r2(sigma / Math.sqrt(n)), 3)} = **${f(repTBrut)}** ${repTBrut > 1.96 ? '> 1.96: the gross signal clears the 5% bar.' : '≤ 1.96: even gross, the signal could be luck.'}`
              : `$t = \\frac{\\bar{x} - 0}{\\sigma/\\sqrt{n}}$ = ${f(mBrut)} / (${f(sigma, 1)}/√${n}) = ${f(mBrut)} / ${f(r2(sigma / Math.sqrt(n)), 3)} = **${f(repTBrut)}** ${repTBrut > 1.96 ? '> 1,96 : le signal brut passe la barre des 5 %.' : '≤ 1,96 : même brut, le signal pourrait n\'être que chance.'}`,
          }],
        },
        {
          intitule: en ? 'e) The net t-statistic' : 'e) La statistique t nette',
          enonce: en
            ? `Same test on the NET mean: what is its t-statistic?`
            : `Même test sur la moyenne NETTE : quelle est sa statistique t ?`,
          reponse: repTNet, tolerance: 0.02, toleranceMode: 'absolu', unite: 't',
          etapes: [{
            titre: en ? 'Costs shave the significance too' : 'Les coûts rabotent aussi la significativité',
            contenu: en
              ? `$t_{net}$ = ${f(repNetM)} / ${f(r2(sigma / Math.sqrt(n)), 3)} = **${f(repTNet)}**, down from ${f(repTBrut)} gross. Costs shift the mean, not the noise: every basis point of drag converts one-for-one into lost t.`
              : `$t_{net}$ = ${f(repNetM)} / ${f(r2(sigma / Math.sqrt(n)), 3)} = **${f(repTNet)}**, contre ${f(repTBrut)} en brut. Les coûts déplacent la moyenne, pas le bruit : chaque point de base de ponction se convertit un pour un en t perdu.`,
          }],
          pieges: [en
            ? `Testing the gross series and trading the net one is the oldest sleight of hand in factor marketing.`
            : `Tester la série brute et trader la série nette est le plus vieux tour de passe-passe du marketing factoriel.`],
        },
        {
          intitule: en ? 'f) The verdict: the margin over 1.96' : 'f) Le verdict : la marge sur 1,96',
          enonce: en
            ? `By how much does the net t-statistic clear (or miss) the 1.96 threshold?`
            : `De combien la statistique t nette dépasse-t-elle (ou manque-t-elle) le seuil de 1,96 ?`,
          reponse: repMarge, tolerance: 0.02, toleranceMode: 'absolu', unite: 't',
          etapes: [
            {
              titre: en ? 'The number that decides' : 'Le chiffre qui tranche',
              contenu: en
                ? `Margin = ${f(repTNet)} − 1.96 = **${f(repMarge)}**: ${survit ? 'positive — net of real-world frictions, the excess return remains statistically distinguishable from luck. THIS sample says the anomaly survives.' : 'negative — once costs are paid, the data can no longer reject pure luck. The "anomaly" was gross-only: an arbitrage that costs more than it pays is no arbitrage.'}`
                : `Marge = ${f(repTNet)} − 1,96 = **${f(repMarge)}** : ${survit ? 'positive — net des frictions réelles, l\'excès de rendement reste statistiquement distinguable de la chance. CET échantillon dit que l\'anomalie survit.' : 'négative — une fois les coûts payés, les données ne peuvent plus écarter la pure chance. L\'« anomalie » n\'existait qu\'en brut : un arbitrage qui coûte plus qu\'il ne rapporte n\'est pas un arbitrage.'}`,
            },
            {
              titre: en ? 'What this does to efficiency' : "Ce que cela fait à l'efficience",
              contenu: en
                ? `${survit ? 'A surviving anomaly is still not a refutation: it may be a risk premium in disguise, or a backtest-selection artefact across thousands of tried strategies.' : 'An anomaly that dies in costs is efficiency working: the market is exactly inefficient enough to pay the frictions of those who correct it.'} Either way, the honest claim is about THIS sample, THESE costs, THIS period — never a law of nature.`
                : `${survit ? "Une anomalie qui survit ne réfute pas l'efficience pour autant : prime de risque déguisée, ou artefact de sélection parmi des milliers de stratégies essayées." : "Une anomalie qui meurt dans les coûts, c'est l'efficience au travail : le marché est exactement assez inefficient pour payer les frictions de ceux qui le corrigent."} Dans les deux cas, l'affirmation honnête porte sur CET échantillon, CES coûts, CETTE période — jamais sur une loi de la nature.`,
            },
          ],
        },
      ],
    };
  },
};

export const problemes: ProblemGenerator[] = [
  gordonComplete, perComparables, evEbitdaComplet, calendrierDividende,
  splitEtCapi, panierIndice, rendementTotal,
  ddmDeuxEtapesComplet, dcfSensibilite, augmentationCapitalDps,
  buybackBpa, ipoPricing, greenshoe, shortCouvert,
  dcfCompletSensibilites, valorisationCroisee, shortSqueeze, dilutionRelution, indexRebalancing,
  efficienceAnomalie,
];
