/**
 * Moules de problèmes multi-étapes du module Taux & obligations — lot 1 (Task B8).
 * Chaque moule : 3 scénarios FR + EN, sous-questions chaînées (les valeurs de a)
 * servent en b), c)…), corrigés calculés via calculs.ts — jamais de texte figé.
 * Les tirages aléatoires ont lieu AVANT toute branche de langue : même seed +
 * même scénario ⇒ mêmes nombres en français et en anglais.
 */
import { formatNombreLangue } from '../../../engine/answers';
import { mulberry32, pick, randFloat, randInt } from '../../../engine/rng';
import type { Etape, Langue, ProblemGenerator } from '../../../engine/types';
import {
  couponCouru, durationMacaulay, durationModifiee,
  prixObligation, prixZeroCoupon, tauxForward, va, ytm2Ans,
} from './calculs';

const M4 = '04-taux-obligations';
const r2 = (v: number) => Math.round(v * 100) / 100;
const r3 = (v: number) => Math.round(v * 1000) / 1000;

/** Petits formateurs liés à la langue (les tirages sont déjà faits quand on les crée). */
function outils(langue: Langue) {
  const en = langue === 'en';
  const f = (v: number, d = 2) => formatNombreLangue(langue, v, d);
  const eur = (v: number, d = 2) => (en ? `€${f(v, d)}` : `${f(v, d)} €`);
  const pct = (v: number, d = 2) => (en ? `${f(v, d)}%` : `${f(v, d)} %`);
  return { en, f, eur, pct };
}

/** Corrigé complet du prix d'une obligation à coupon annuel (3 étapes calculées). */
function etapesPrix(langue: Langue, nominal: number, coupon: number, n: number, taux: number): Etape[] {
  const { en, f, eur, pct } = outils(langue);
  const c = (nominal * coupon) / 100;
  const prix = prixObligation(nominal, coupon, n, taux);
  const lignes = Array.from({ length: n }, (_, i) => {
    const t = i + 1;
    const flux = t < n ? c : c + nominal;
    return en
      ? `- Year ${t}: ${eur(flux)} → ${f(flux)} / (1 + ${pct(taux)})^${t} = ${eur(va(flux, taux, t))}`
      : `- Année ${t} : ${eur(flux)} → ${f(flux)} / (1 + ${pct(taux)})^${t} = ${eur(va(flux, taux, t))}`;
  }).join('\n');
  const surcote = prix > nominal;
  if (en) {
    return [
      { titre: 'Identify the cash flows', contenu: `The bond pays an annual coupon of ${f(nominal)} × ${pct(coupon)} = **${eur(c)}** for ${n} years, plus the redemption of the face value (${eur(nominal)}) in year ${n}. The final cash flow is therefore ${f(c)} + ${f(nominal)} = **${eur(c + nominal)}**.` },
      { titre: 'Discount each flow', contenu: `Each flow is divided by $(1+r)^t$ with $r$ = ${pct(taux)}:\n${lignes}` },
      { titre: 'Sum the present values', contenu: `The price is the sum of the discounted flows: **${eur(r2(prix))}**. ${surcote ? `The bond trades **above par**: its coupon (${pct(coupon)}) beats the market yield (${pct(taux)}).` : `The bond trades **below par**: its coupon (${pct(coupon)}) sits below the market yield (${pct(taux)}).`}` },
    ];
  }
  return [
    { titre: 'Identifier les flux', contenu: `L'obligation verse un coupon annuel de ${f(nominal)} × ${pct(coupon)} = **${eur(c)}** pendant ${n} ans, plus le remboursement du nominal (${eur(nominal)}) l'année ${n}. Le flux final vaut donc ${f(c)} + ${f(nominal)} = **${eur(c + nominal)}**.` },
    { titre: 'Actualiser chaque flux', contenu: `Chaque flux est divisé par $(1+r)^t$ avec $r$ = ${pct(taux)} :\n${lignes}` },
    { titre: 'Sommer les valeurs actuelles', contenu: `Le prix est la somme des flux actualisés : **${eur(r2(prix))}**. ${surcote ? `Le titre cote **au-dessus du pair** : son coupon (${pct(coupon)}) dépasse le taux de marché (${pct(taux)}).` : `Le titre cote **sous le pair** : son coupon (${pct(coupon)}) est inférieur au taux de marché (${pct(taux)}).`}` },
  ];
}

/** Corrigé complet de la duration de Macaulay (3 étapes calculées). */
function etapesDurationMac(langue: Langue, nominal: number, coupon: number, n: number, taux: number): Etape[] {
  const { en, f, eur } = outils(langue);
  const c = (nominal * coupon) / 100;
  const prix = prixObligation(nominal, coupon, n, taux);
  const d = durationMacaulay(nominal, coupon, n, taux);
  const lignes = Array.from({ length: n }, (_, i) => {
    const t = i + 1;
    const flux = t < n ? c : c + nominal;
    const vAct = va(flux, taux, t);
    return en
      ? `- t = ${t}: PV = ${eur(vAct)} → weight ${t} × ${f(vAct)} = ${f(t * vAct)}`
      : `- t = ${t} : VA = ${eur(vAct)} → pondération ${t} × ${f(vAct)} = ${f(t * vAct)}`;
  }).join('\n');
  if (en) {
    return [
      { titre: 'Start from the price', contenu: `Sum of discounted flows: $P$ = **${eur(r2(prix))}** (annual coupon ${eur(c)}, final flow ${eur(c + nominal)}).` },
      { titre: 'Weight each flow by its date', contenu: `${lignes}\n\nSum of the time-weighted present values: **${f(d * prix)}**.` },
      { titre: 'Divide by the price', contenu: `$D_{Mac}$ = ${f(d * prix)} / ${f(prix)} = **${f(r3(d), 3)} years**. It is the time-weighted barycentre of the cash flows: the higher the coupon, the earlier the value comes back, the shorter the duration.` },
    ];
  }
  return [
    { titre: 'Partir du prix', contenu: `Somme des flux actualisés : $P$ = **${eur(r2(prix))}** (coupon annuel ${eur(c)}, flux final ${eur(c + nominal)}).` },
    { titre: 'Pondérer chaque flux par sa date', contenu: `${lignes}\n\nSomme des valeurs actuelles pondérées par le temps : **${f(d * prix)}**.` },
    { titre: 'Diviser par le prix', contenu: `$D_{Mac}$ = ${f(d * prix)} / ${f(prix)} = **${f(r3(d), 3)} années**. C'est le barycentre temporel des flux : plus le coupon est élevé, plus la valeur revient tôt, plus la duration est courte.` },
  ];
}

/* ------------------------------------------------------------------ */
/* 1. m4-pb-analyse-ligne — N2                                         */
/* ------------------------------------------------------------------ */
const analyseLigne: ProblemGenerator = {
  id: 'm4-pb-analyse-ligne', moduleId: M4,
  titre: "Analyse complète d'une ligne obligataire",
  titreEn: 'Full work-up of a bond position',
  typeDeCas: "analyse d'une ligne obligataire",
  typeDeCasEn: 'bond position analysis',
  difficulte: 2,
  scenarios: ['Gérant assurantiel (passif long)', 'Desk trading souverain', "Trésorier d'entreprise"],
  scenariosEn: ['Insurance portfolio manager (long-dated liabilities)', 'Sovereign bond trading desk', 'Corporate treasurer'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const nominal = 1000;
    const coupon = randFloat(rng, 1.5, 6, 2);
    const n = randInt(rng, 3, 10);
    let taux = randFloat(rng, 1, 6, 2);
    if (Math.abs(taux - coupon) < 0.3) taux = r2(taux + 0.7);

    const prix = prixObligation(nominal, coupon, n, taux);
    const dMac = durationMacaulay(nominal, coupon, n, taux);
    const dMod = durationModifiee(dMac, taux);
    const repPrix = r2(prix);
    const repDMac = r3(dMac);
    const repDMod = r3(dMod);
    const dP = r2(-dMod * 0.005 * prix);
    const dv01 = r2(dMod * 0.0001 * prix);
    const prixSansNominal = r2(prix - va(nominal, taux, n));

    const { en, f, eur, pct } = outils(langue);
    const contexte = (en
      ? [
        `You manage the bond portfolio of a life insurer backed by long-dated liabilities. Ahead of the quarterly ALM committee, you owe a full one-pager on one of your holdings: face value ${eur(nominal)}, ${pct(coupon)} annual coupon, ${n} years to maturity (next coupon in exactly one year). The market yields ${pct(taux)} at that maturity, and senior management is worried about rising rates.`,
        `You run the sovereign bond book. A position hit the book yesterday: face value ${eur(nominal)}, ${pct(coupon)} annual coupon, ${n} years to maturity, with the market yielding ${pct(taux)} on that point of the curve. Before the open, you re-run the numbers risk control will ask for: fair price, duration, sensitivity.`,
        `As treasurer of an industrial group, you parked a lasting cash surplus in a bond: face value ${eur(nominal)}, ${pct(coupon)} annual coupon, ${n} years to maturity. The market rate for that maturity is ${pct(taux)}. Your CFO wants to know what the position is worth today — and what it would lose if rates moved up.`,
      ]
      : [
        `Vous gérez le portefeuille obligataire d'un assureur-vie, adossé à des passifs longs. Avant le comité ALM trimestriel, on vous demande une fiche complète sur l'une de vos lignes : nominal ${eur(nominal)}, coupon annuel de ${pct(coupon)}, maturité ${n} ans (prochain coupon dans un an exactement). Le marché exige ${pct(taux)} sur cette maturité, et la direction s'inquiète d'une remontée des taux.`,
        `Vous tenez le book de trading souverain. Une ligne est entrée en position hier : nominal ${eur(nominal)}, coupon annuel de ${pct(coupon)}, maturité ${n} ans, taux de marché ${pct(taux)} sur ce point de courbe. Avant l'ouverture, vous refaites les calculs que le contrôle des risques vous demandera : prix théorique, duration, sensibilité.`,
        `Trésorier d'un groupe industriel, vous avez placé un excédent durable sur une obligation : nominal ${eur(nominal)}, coupon annuel de ${pct(coupon)}, maturité ${n} ans. Le taux de marché pour cette maturité est de ${pct(taux)}. Votre directeur financier veut savoir ce que vaut la ligne aujourd'hui — et ce qu'elle perdrait si les taux remontaient.`,
      ])[sIdx];

    const lecture = (en
      ? [
        `Insurer's reading: the line would show a ${eur(-dP)} mark-to-market loss. But a life insurer's liabilities are rate-sensitive too — at the ALM committee, this figure is set against the move in the liabilities before concluding that higher rates hurt.`,
        `Desk reading: per basis point, the line loses ${eur(dv01)} — that is its DV01. This is exactly what a hedge (selling futures, paying fixed on a swap) must neutralise before the next inflation print.`,
        `Treasurer's reading: the ${eur(-dP)} is only an unrealised loss — held to maturity, the bond still redeems at par. The figure is there to arbitrate: sell now, or carry.`,
      ]
      : [
        `Lecture de l'assureur : la ligne afficherait une moins-value latente de ${eur(-dP)}. Mais le passif d'un assureur-vie est lui aussi sensible aux taux — au comité ALM, ce chiffre se compare à la variation du passif avant de conclure que la hausse fait mal.`,
        `Lecture du desk : par point de base, la ligne perd ${eur(dv01)} — c'est son DV01. C'est exactement ce qu'une couverture (vente de futures, swap payeur de taux fixe) doit neutraliser avant la prochaine statistique d'inflation.`,
        `Lecture du trésorier : ces ${eur(-dP)} ne sont qu'une moins-value latente — portée jusqu'à l'échéance, l'obligation rembourse son nominal. Le chiffre sert à arbitrer : vendre maintenant, ou porter.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The price' : 'a) Le prix',
          enonce: en ? `What is the bond's price, in euros?` : `Quel est le prix de l'obligation, en euros ?`,
          reponse: repPrix, tolerance: 0.002, unite: '€',
          etapes: etapesPrix(langue, nominal, coupon, n, taux),
          pieges: [en
            ? `Forgetting the redemption of the face value in year ${n}: the classic slip prices the coupons alone, around ${eur(prixSansNominal)}.`
            : `Oublier le remboursement du nominal l'année ${n} : l'erreur classique ne valorise que les coupons, soit environ ${eur(prixSansNominal)}.`],
        },
        {
          intitule: en ? 'b) Macaulay duration' : 'b) La duration de Macaulay',
          enonce: en ? `Compute the bond's Macaulay duration, in years.` : `Calculez la duration de Macaulay de l'obligation, en années.`,
          reponse: repDMac, tolerance: 0.005, unite: en ? 'years' : 'années',
          etapes: etapesDurationMac(langue, nominal, coupon, n, taux),
          pieges: [en
            ? `Confusing Macaulay duration (in years) with modified duration (a sensitivity): the latter comes from dividing by (1 + y) — that is question c).`
            : `Confondre duration de Macaulay (en années) et duration modifiée (une sensibilité) : la seconde s'obtient en divisant par (1 + y) — c'est la question c).`],
        },
        {
          intitule: en ? 'c) Modified duration' : 'c) La duration modifiée',
          enonce: en ? `Deduce the modified duration.` : `Déduisez-en la duration modifiée.`,
          reponse: repDMod, tolerance: 0.005,
          etapes: [{
            titre: en ? 'Divide by (1 + y)' : 'Diviser par (1 + y)',
            contenu: en
              ? `$D_{mod} = D_{Mac} / (1+y)$ = ${f(repDMac, 3)} / ${f(1 + taux / 100, 4)} = **${f(repDMod, 3)}**. Reading: the price loses about ${pct(repDMod, 3)} of its value per 1-point rise in yield.`
              : `$D_{mod} = D_{Mac} / (1+y)$ = ${f(repDMac, 3)} / ${f(1 + taux / 100, 4)} = **${f(repDMod, 3)}**. Lecture : le prix perd environ ${pct(repDMod, 3)} de sa valeur par point de hausse du rendement.`,
          }],
        },
        {
          intitule: en ? 'd) The impact of +50 bp' : "d) L'impact de +50 pb",
          enonce: en
            ? `Rates rise by 50 bp. By how much does the price change, in euros? (signed answer: a loss is negative)`
            : `Les taux montent de 50 pb. De combien varie le prix du titre, en euros ? (réponse signée : une perte est négative)`,
          reponse: dP, tolerance: 0.01, unite: '€',
          etapes: [
            {
              titre: en ? 'Apply the duration formula' : 'Appliquer la formule de la duration',
              contenu: en
                ? `$\\Delta P \\approx -D_{mod} \\times \\Delta y \\times P$. Application: −${f(repDMod, 3)} × 0.005 × ${f(repPrix)} = **${eur(dP)}**. Higher rates, lower price: the sign is negative.`
                : `$\\Delta P \\approx -D_{mod} \\times \\Delta y \\times P$. Application : −${f(repDMod, 3)} × 0,005 × ${f(repPrix)} = **${eur(dP)}**. Hausse des taux, baisse du prix : le signe est négatif.`,
            },
            { titre: en ? 'Read the result in context' : 'Interpréter selon le contexte', contenu: lecture },
          ],
          pieges: [
            en
              ? `Using Macaulay duration instead of modified gives ${eur(r2(-dMac * 0.005 * prix))} — a small gap here, material on a large book.`
              : `Utiliser la duration de Macaulay au lieu de la modifiée donnerait ${eur(r2(-dMac * 0.005 * prix))} — écart modeste ici, significatif sur un gros book.`,
            en
              ? `Answering +${f(-dP)} € is the classic sign error: when yields rise, the price falls.`
              : `Répondre +${f(-dP)} € est l'erreur de signe classique : quand les taux montent, le prix baisse.`,
          ],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 2. m4-pb-coupon-couru-transaction — N2                              */
/* ------------------------------------------------------------------ */
const couponCouruTransaction: ProblemGenerator = {
  id: 'm4-pb-coupon-couru-transaction', moduleId: M4,
  titre: 'Achat entre deux dates de coupon',
  titreEn: 'Buying between two coupon dates',
  typeDeCas: 'achat en cours de coupon',
  typeDeCasEn: 'mid-coupon purchase',
  difficulte: 2,
  scenarios: ['Particulier qui achète via sa banque', "Desk obligataire à l'exécution", 'Back-office qui contrôle un règlement'],
  scenariosEn: ['Retail investor buying through a bank', 'Bond desk executing a client order', 'Back office double-checking a settlement'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const nominal = 1000;
    const coupon = randFloat(rng, 2, 6, 2);
    const jours = randInt(rng, 40, 320);
    const prixProprePct = randFloat(rng, 92, 108, 2);
    const quantite = pick(rng, [10, 25, 50, 100, 200] as const);

    const c = (nominal * coupon) / 100;
    const couru = couponCouru(coupon, nominal, jours, 365);
    const prixPropre = (nominal * prixProprePct) / 100;
    const sale = prixPropre + couru;
    const montant = quantite * sale;
    const repCouru = r2(couru);
    const repSale = r2(sale);
    const repMontant = r2(montant);
    const couru360 = r2(couponCouru(coupon, nominal, jours, 360));

    const { en, f, eur, pct } = outils(langue);
    const contexte = (en
      ? [
        `Your bank offers you ${quantite} bonds of a large corporate: face value ${eur(nominal)} each, ${pct(coupon)} annual coupon, quoted today at ${pct(prixProprePct)} of par. The last coupon was paid ${jours} days ago (Actual/365 basis). The adviser announces an amount to pay that differs from the screen price — you want to redo the arithmetic before signing.`,
        `On the bond desk, you execute a client buy order: ${quantite} bonds, face value ${eur(nominal)}, ${pct(coupon)} annual coupon, clean price on screen ${pct(prixProprePct)} of par, ${jours} days since the last coupon (Actual/365). You rebuild the settlement ticket before validating the trade.`,
        `In the back office, you check yesterday's settlement: purchase of ${quantite} bonds, face value ${eur(nominal)}, ${pct(coupon)} annual coupon, traded at a clean price of ${pct(prixProprePct)} of par, ${jours} days after the last coupon (Actual/365). The cash amount must be justified to the cent before it leaves the account.`,
      ]
      : [
        `Votre banque vous propose ${quantite} obligations d'une grande entreprise : nominal ${eur(nominal)} chacune, coupon annuel de ${pct(coupon)}, cotation du jour ${pct(prixProprePct)} du nominal. Le dernier coupon a été versé il y a ${jours} jours (base Exact/365). Le conseiller annonce un montant à payer différent du cours affiché — vous voulez refaire le calcul avant de signer.`,
        `Au desk obligataire, vous exécutez un ordre d'achat client : ${quantite} titres, nominal ${eur(nominal)}, coupon annuel ${pct(coupon)}, prix propre affiché ${pct(prixProprePct)} du nominal, ${jours} jours écoulés depuis le dernier coupon (Exact/365). Vous reconstituez le décompte de règlement avant de valider le ticket.`,
        `Au back-office, vous contrôlez le règlement-livraison d'hier : achat de ${quantite} obligations, nominal ${eur(nominal)}, coupon annuel ${pct(coupon)}, traitées à un prix propre de ${pct(prixProprePct)} du nominal, ${jours} jours après le dernier coupon (Exact/365). Le montant en espèces doit être justifié au centime avant de partir du compte.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) Accrued interest' : 'a) Le coupon couru',
          enonce: en
            ? `Compute the accrued interest per bond (Actual/365 basis), in euros.`
            : `Calculez le coupon couru par titre (base Exact/365), en euros.`,
          reponse: repCouru, tolerance: 0.005, unite: '€',
          etapes: [
            {
              titre: en ? 'The full annual coupon' : 'Le coupon annuel plein',
              contenu: en
                ? `The bond pays ${f(nominal)} × ${pct(coupon)} = **${eur(c)}** per year.`
                : `Le titre verse ${f(nominal)} × ${pct(coupon)} = **${eur(c)}** par an.`,
            },
            {
              titre: en ? 'Prorate over the elapsed days' : 'Proratiser sur les jours écoulés',
              contenu: en
                ? `Accrued = ${f(c)} × ${jours}/365 = **${eur(repCouru)}**. The seller carried the bond for ${jours} days: the buyer compensates that fraction of the coupon.`
                : `Couru = ${f(c)} × ${jours}/365 = **${eur(repCouru)}**. Le vendeur a porté le titre pendant ${jours} jours : l'acheteur lui rembourse cette fraction du coupon.`,
            },
          ],
          pieges: [en
            ? `Using a 360-day basis gives ${eur(couru360)}: the money-market Actual/360 convention does not apply to this bond.`
            : `Calculer en base 360 donnerait ${eur(couru360)} : la convention monétaire Exact/360 ne s'applique pas à cette obligation.`],
        },
        {
          intitule: en ? 'b) The dirty price' : 'b) Le prix sale',
          enonce: en
            ? `What is the dirty price — the amount actually paid per bond, in euros?`
            : `Quel est le prix sale — le montant effectivement payé par titre, en euros ?`,
          reponse: repSale, tolerance: 0.002, unite: '€',
          etapes: [
            {
              titre: en ? 'Clean price in euros' : 'Le prix propre en euros',
              contenu: en
                ? `The screen quotes ${pct(prixProprePct)} of par: ${f(prixProprePct)}% × ${f(nominal)} = **${eur(prixPropre)}**.`
                : `L'écran cote ${pct(prixProprePct)} du nominal : ${f(prixProprePct)} % × ${f(nominal)} = **${eur(prixPropre)}**.`,
            },
            {
              titre: en ? 'Add the accrued interest' : 'Ajouter le coupon couru',
              contenu: en
                ? `Dirty price = clean price + accrued = ${f(prixPropre)} + ${f(repCouru)} = **${eur(repSale)}**. The accrued is always **added** — it compensates the seller.`
                : `Prix sale = prix propre + couru = ${f(prixPropre)} + ${f(repCouru)} = **${eur(repSale)}**. Le couru s'**ajoute** toujours — il dédommage le vendeur.`,
            },
          ],
          pieges: [en
            ? `Subtracting the accrued (${eur(r2(prixPropre - couru))}) is the classic mistake: the buyer owes the seller the carried coupon, not the reverse.`
            : `Soustraire le couru (${eur(r2(prixPropre - couru))}) est l'erreur classique : l'acheteur doit au vendeur le coupon porté, pas l'inverse.`],
        },
        {
          intitule: en ? 'c) The settlement amount' : 'c) Le montant réglé',
          enonce: en
            ? `What total amount will be settled for the ${quantite} bonds, in euros?`
            : `Quel montant total sera réglé pour les ${quantite} titres, en euros ?`,
          reponse: repMontant, tolerance: 0.002, unite: '€',
          etapes: [{
            titre: en ? 'Quantity × dirty price' : 'Quantité × prix sale',
            contenu: en
              ? `${quantite} × ${f(repSale)} = **${eur(repMontant)}**. This is the cash that leaves the account at settlement — the dirty price of b), not the screen price, drives the wire.`
              : `${quantite} × ${f(repSale)} = **${eur(repMontant)}**. C'est le montant en espèces du règlement-livraison — c'est le prix sale du b), pas le cours affiché, qui pilote le virement.`,
          }],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 3. m4-pb-comparaison-deux-obligations — N2                          */
/* ------------------------------------------------------------------ */
const comparaisonDeuxObligations: ProblemGenerator = {
  id: 'm4-pb-comparaison-deux-obligations', moduleId: M4,
  titre: 'Choisir entre deux obligations',
  titreEn: 'Choosing between two bonds',
  typeDeCas: "choix d'investissement",
  typeDeCasEn: 'investment choice',
  difficulte: 2,
  scenarios: ['Gérant prudent qui plafonne le risque de taux', 'Pari directionnel sur une baisse des taux', "Comité d'investissement qui tranche entre deux lignes"],
  scenariosEn: ['Cautious manager capping rate risk', 'Directional bet on falling rates', 'Investment committee picking between two lines'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const nominal = 1000;
    const taux = randFloat(rng, 2, 5, 2);
    const couponA = randFloat(rng, 4, 6.5, 2);
    const nA = randInt(rng, 3, 5);
    const couponB = randFloat(rng, 1, 3, 2);
    const nB = randInt(rng, 7, 10);
    const baissePb = 50;

    const prixA = prixObligation(nominal, couponA, nA, taux);
    const prixB = prixObligation(nominal, couponB, nB, taux);
    const dA = durationMacaulay(nominal, couponA, nA, taux);
    const dB = durationMacaulay(nominal, couponB, nB, taux);
    const dModB = durationModifiee(dB, taux);
    const gain = r2(dModB * (baissePb / 10000) * prixB);
    const repA = r2(prixA);
    const repB = r2(prixB);
    const repDA = r3(dA);
    const repDB = r3(dB);

    const { en, f, eur, pct } = outils(langue);
    const descTitres = en
      ? `bond A (${pct(couponA)} coupon, ${nA} years) and bond B (${pct(couponB)} coupon, ${nB} years), both with a ${eur(nominal)} face value, both yielding the market rate of ${pct(taux)}`
      : `l'obligation A (coupon ${pct(couponA)}, ${nA} ans) et l'obligation B (coupon ${pct(couponB)}, ${nB} ans), toutes deux de nominal ${eur(nominal)}, toutes deux au taux de marché de ${pct(taux)}`;
    const contexte = (en
      ? [
        `You manage a conservative bond fund whose mandate caps interest-rate risk. Two candidates for the next purchase: ${descTitres}. Before the order, you must document which of the two is the **less** rate-sensitive — with numbers, not intuition.`,
        `You expect the central bank to ease and rates to fall by about 50 bp. Two candidates on screen: ${descTitres}. You want the bond that benefits the **most** from the move, and a euro figure for the expected gain.`,
        `The investment committee must pick between two lines proposed by two managers: ${descTitres}. You prepare the briefing pack: price of each, duration of each, and what 50 bp of falling rates would do to the more sensitive one.`,
      ]
      : [
        `Vous gérez un fonds obligataire prudent dont le mandat plafonne le risque de taux. Deux candidates pour le prochain achat : ${descTitres}. Avant l'ordre, vous devez documenter laquelle des deux est la **moins** sensible aux taux — chiffres à l'appui, pas à l'intuition.`,
        `Vous anticipez un assouplissement de la banque centrale et une baisse des taux d'environ 50 pb. Deux candidates à l'écran : ${descTitres}. Vous cherchez le titre qui profitera le **plus** du mouvement, et le gain attendu en euros.`,
        `Le comité d'investissement doit trancher entre deux lignes proposées par deux gérants : ${descTitres}. Vous préparez le dossier : prix de chacune, duration de chacune, et l'effet d'une baisse de 50 pb sur la plus sensible.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) Price of bond A' : "a) Le prix de l'obligation A",
          enonce: en ? `What is the price of bond A, in euros?` : `Quel est le prix de l'obligation A, en euros ?`,
          reponse: repA, tolerance: 0.002, unite: '€',
          etapes: etapesPrix(langue, nominal, couponA, nA, taux),
        },
        {
          intitule: en ? 'b) Price of bond B' : "b) Le prix de l'obligation B",
          enonce: en ? `Same question for bond B.` : `Même question pour l'obligation B.`,
          reponse: repB, tolerance: 0.002, unite: '€',
          etapes: etapesPrix(langue, nominal, couponB, nB, taux),
        },
        {
          intitule: en ? 'c) Macaulay duration of A' : 'c) La duration de Macaulay de A',
          enonce: en ? `Compute the Macaulay duration of bond A, in years.` : `Calculez la duration de Macaulay de l'obligation A, en années.`,
          reponse: repDA, tolerance: 0.005, unite: en ? 'years' : 'années',
          etapes: etapesDurationMac(langue, nominal, couponA, nA, taux),
        },
        {
          intitule: en ? 'd) Macaulay duration of B' : 'd) La duration de Macaulay de B',
          enonce: en ? `Same question for bond B.` : `Même question pour l'obligation B.`,
          reponse: repDB, tolerance: 0.005, unite: en ? 'years' : 'années',
          etapes: etapesDurationMac(langue, nominal, couponB, nB, taux),
          pieges: [en
            ? `B is longer AND pays a smaller coupon: both effects push its duration up — no calculation can make A the more sensitive bond here.`
            : `B est plus longue ET sert un coupon plus faible : les deux effets allongent sa duration — aucun calcul ne peut rendre A plus sensible ici.`],
        },
        {
          intitule: en ? 'e) The gain on the winner if rates fall 50 bp' : 'e) Le gain sur la gagnante si les taux baissent de 50 pb',
          enonce: en
            ? `Rates fall by ${baissePb} bp. Which bond gains more, and how much does it gain, in euros? (give the gain of the more sensitive bond)`
            : `Les taux baissent de ${baissePb} pb. Laquelle gagne le plus, et combien gagne-t-elle, en euros ? (donnez le gain du titre le plus sensible)`,
          reponse: gain, tolerance: 0.01, unite: '€',
          etapes: [
            {
              titre: en ? 'Identify the more sensitive bond' : 'Identifier le titre le plus sensible',
              contenu: en
                ? `B combines a low coupon (${pct(couponB)}) and a long maturity (${nB} years): its Macaulay duration, ${f(repDB, 2)} years, exceeds A's ${f(repDA, 2)} years. **B** is the bond that benefits most from falling rates.`
                : `B cumule coupon faible (${pct(couponB)}) et maturité longue (${nB} ans) : sa duration de Macaulay, ${f(repDB, 2)} ans, dépasse les ${f(repDA, 2)} ans de A. C'est **B** qui profite le plus d'une baisse des taux.`,
            },
            {
              titre: en ? 'Convert to modified duration' : 'Convertir en duration modifiée',
              contenu: en
                ? `$D_{mod} = D_{Mac}/(1+y)$ = ${f(repDB, 3)} / ${f(1 + taux / 100, 4)} = **${f(r3(dModB), 3)}**.`
                : `$D_{mod} = D_{Mac}/(1+y)$ = ${f(repDB, 3)} / ${f(1 + taux / 100, 4)} = **${f(r3(dModB), 3)}**.`,
            },
            {
              titre: en ? 'Price the move' : 'Chiffrer le mouvement',
              contenu: en
                ? `$\\Delta P \\approx -D_{mod} \\times \\Delta y \\times P$ with $\\Delta y$ = −0.005: ΔP ≈ ${f(r3(dModB), 3)} × 0.005 × ${f(repB)} = **+${eur(gain)}** on bond B. The cautious answer and the directional answer use the same number — only the conclusion differs.`
                : `$\\Delta P \\approx -D_{mod} \\times \\Delta y \\times P$ avec $\\Delta y$ = −0,005 : ΔP ≈ ${f(r3(dModB), 3)} × 0,005 × ${f(repB)} = **+${eur(gain)}** sur l'obligation B. Le gérant prudent et le parieur directionnel utilisent le même chiffre — seule la conclusion change.`,
            },
          ],
          pieges: [
            en
              ? `Picking A because its price is higher: sensitivity is driven by duration, not by price level.`
              : `Choisir A parce que son prix est plus élevé : la sensibilité dépend de la duration, pas du niveau de prix.`,
            en
              ? `Using Macaulay duration without converting would give ${eur(r2(dB * (baissePb / 10000) * prixB))}.`
              : `Utiliser la duration de Macaulay sans la convertir donnerait ${eur(r2(dB * (baissePb / 10000) * prixB))}.`,
          ],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 4. m4-pb-zc-vs-coupon — N2                                          */
/* ------------------------------------------------------------------ */
const zcVsCoupon: ProblemGenerator = {
  id: 'm4-pb-zc-vs-coupon', moduleId: M4,
  titre: 'Zéro-coupon contre obligation à coupons',
  titreEn: 'Zero-coupon versus coupon bond',
  typeDeCas: 'sensibilité comparée',
  typeDeCasEn: 'comparative rate sensitivity',
  difficulte: 2,
  scenarios: ['Épargne de long terme', 'Desk qui compare deux sensibilités', "ALM d'une banque"],
  scenariosEn: ['Long-horizon savings plan', 'Desk comparing two sensitivities', "A bank's ALM unit"],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const nominal = 1000;
    const n = randInt(rng, 5, 10);
    const taux = randFloat(rng, 2, 5, 2);
    const coupon = randFloat(rng, 3, 6, 2);

    const pZC = prixZeroCoupon(nominal, taux, n);
    const pC = prixObligation(nominal, coupon, n, taux);
    const dC = durationMacaulay(nominal, coupon, n, taux);
    const dModZC = durationModifiee(n, taux);
    const dModC = durationModifiee(dC, taux);
    const dPZC = r2(-dModZC * 0.01 * pZC);
    const dPC = r2(-dModC * 0.01 * pC);
    const repZC = r2(pZC);
    const repC = r2(pC);
    const repDC = r3(dC);

    const { en, f, eur, pct } = outils(langue);
    const descTitres = en
      ? `a zero-coupon bond and a ${pct(coupon)} annual-coupon bond, same issuer, same ${n}-year maturity, same ${eur(nominal)} face value, market yield ${pct(taux)} for both`
      : `un zéro-coupon et une obligation à coupon annuel de ${pct(coupon)}, même émetteur, même maturité ${n} ans, même nominal ${eur(nominal)}, taux de marché ${pct(taux)} pour les deux`;
    const contexte = (en
      ? [
        `You advise a client who wants a guaranteed capital in ${n} years and hesitates between ${descTitres}. He may need the money earlier: you must show him what each bond would lose if rates rose by 100 bp before he sells.`,
        `Morning question on the desk: between ${descTitres}, which line takes the bigger hit on a +100 bp shock? You owe the head of desk the two prices, the durations and the two euro impacts before the meeting.`,
        `At the bank's ALM unit, you are placing a stable surplus at a ${n}-year horizon and compare ${descTitres}. The rates committee wants the exact sensitivity figure of each before allocating.`,
      ]
      : [
        `Vous conseillez un client qui veut un capital garanti dans ${n} ans et hésite entre ${descTitres}. Il pourrait avoir besoin des fonds plus tôt : il faut lui montrer ce que chaque titre perdrait si les taux montaient de 100 pb avant la revente.`,
        `Question du matin sur le desk : entre ${descTitres}, quelle ligne encaisse le plus gros choc à +100 pb ? Le responsable attend les deux prix, les durations et les deux impacts en euros avant le point de marché.`,
        `À l'ALM de la banque, vous placez un excédent stable à horizon ${n} ans et comparez ${descTitres}. Le comité de taux veut le chiffre exact de sensibilité de chacun avant d'allouer.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) Price of the zero-coupon' : 'a) Le prix du zéro-coupon',
          enonce: en ? `What is the price of the zero-coupon bond, in euros?` : `Quel est le prix du zéro-coupon, en euros ?`,
          reponse: repZC, tolerance: 0.002, unite: '€',
          etapes: [{
            titre: en ? 'A single discounted flow' : 'Un seul flux à actualiser',
            contenu: en
              ? `The zero-coupon pays nothing until maturity, then ${eur(nominal)}. Price = ${f(nominal)} / (1 + ${pct(taux)})^${n} = **${eur(repZC)}**. The whole return is the gap between this price and par.`
              : `Le zéro-coupon ne verse rien avant l'échéance, puis ${eur(nominal)}. Prix = ${f(nominal)} / (1 + ${pct(taux)})^${n} = **${eur(repZC)}**. Toute la rémunération tient dans l'écart entre ce prix et le pair.`,
          }],
        },
        {
          intitule: en ? 'b) Price of the coupon bond' : "b) Le prix de l'obligation à coupons",
          enonce: en ? `What is the price of the coupon bond, in euros?` : `Quel est le prix de l'obligation à coupons, en euros ?`,
          reponse: repC, tolerance: 0.002, unite: '€',
          etapes: etapesPrix(langue, nominal, coupon, n, taux),
        },
        {
          intitule: en ? 'c) Macaulay duration of the coupon bond' : 'c) La duration de Macaulay de la couponnée',
          enonce: en
            ? `Compute the Macaulay duration of the coupon bond, in years. (That of the zero-coupon needs no computation — say why.)`
            : `Calculez la duration de Macaulay de l'obligation à coupons, en années. (Celle du zéro-coupon ne demande aucun calcul — dites pourquoi.)`,
          reponse: repDC, tolerance: 0.005, unite: en ? 'years' : 'années',
          etapes: [
            ...etapesDurationMac(langue, nominal, coupon, n, taux),
            {
              titre: en ? 'The zero-coupon, a limiting case' : 'Le zéro-coupon, cas limite',
              contenu: en
                ? `A zero-coupon has a single flow, at maturity: its Macaulay duration is exactly its maturity, **${n} years** — longer than the coupon bond's ${f(repDC, 2)} years, because no coupon brings value back earlier.`
                : `Un zéro-coupon n'a qu'un flux, à l'échéance : sa duration de Macaulay vaut exactement sa maturité, **${n} ans** — plus longue que les ${f(repDC, 2)} ans de la couponnée, car aucun coupon ne rapatrie de valeur plus tôt.`,
            },
          ],
        },
        {
          intitule: en ? 'd) ΔP of the zero-coupon for +100 bp' : 'd) Le ΔP du zéro-coupon pour +100 pb',
          enonce: en
            ? `Rates rise by 100 bp. Estimate the price change of the zero-coupon, in euros (signed answer).`
            : `Les taux montent de 100 pb. Estimez la variation de prix du zéro-coupon, en euros (réponse signée).`,
          reponse: dPZC, tolerance: 0.01, unite: '€',
          etapes: [
            {
              titre: en ? 'Modified duration of the zero' : 'Duration modifiée du zéro-coupon',
              contenu: en
                ? `$D_{mod}$ = ${n} / ${f(1 + taux / 100, 4)} = **${f(r3(dModZC), 3)}**.`
                : `$D_{mod}$ = ${n} / ${f(1 + taux / 100, 4)} = **${f(r3(dModZC), 3)}**.`,
            },
            {
              titre: en ? 'Apply the shock' : 'Appliquer le choc',
              contenu: en
                ? `$\\Delta P \\approx -D_{mod} \\times \\Delta y \\times P$ = −${f(r3(dModZC), 3)} × 0.01 × ${f(repZC)} = **${eur(dPZC)}**.`
                : `$\\Delta P \\approx -D_{mod} \\times \\Delta y \\times P$ = −${f(r3(dModZC), 3)} × 0,01 × ${f(repZC)} = **${eur(dPZC)}**.`,
            },
          ],
        },
        {
          intitule: en ? 'e) ΔP of the coupon bond for +100 bp' : 'e) Le ΔP de la couponnée pour +100 pb',
          enonce: en
            ? `Same +100 bp shock: estimate the price change of the coupon bond, in euros (signed answer). Then compare the two losses in % of price.`
            : `Même choc de +100 pb : estimez la variation de prix de la couponnée, en euros (réponse signée). Puis comparez les deux pertes en % du prix.`,
          reponse: dPC, tolerance: 0.01, unite: '€',
          etapes: [
            {
              titre: en ? 'Modified duration of the coupon bond' : 'Duration modifiée de la couponnée',
              contenu: en
                ? `$D_{mod}$ = ${f(repDC, 3)} / ${f(1 + taux / 100, 4)} = **${f(r3(dModC), 3)}**, then ΔP ≈ −${f(r3(dModC), 3)} × 0.01 × ${f(repC)} = **${eur(dPC)}**.`
                : `$D_{mod}$ = ${f(repDC, 3)} / ${f(1 + taux / 100, 4)} = **${f(r3(dModC), 3)}**, puis ΔP ≈ −${f(r3(dModC), 3)} × 0,01 × ${f(repC)} = **${eur(dPC)}**.`,
            },
            {
              titre: en ? 'Compare in % of price' : 'Comparer en % du prix',
              contenu: en
                ? `The zero loses ${pct(r2(Math.abs(dPZC) / pZC * 100))} of its value against ${pct(r2(Math.abs(dPC) / pC * 100))} for the coupon bond. Same maturity, different sensitivity: the coupons bring value back earlier and cushion the shock.`
                : `Le zéro-coupon perd ${pct(r2(Math.abs(dPZC) / pZC * 100))} de sa valeur contre ${pct(r2(Math.abs(dPC) / pC * 100))} pour la couponnée. Même maturité, sensibilité différente : les coupons rapatrient de la valeur plus tôt et amortissent le choc.`,
            },
          ],
          pieges: [en
            ? `Comparing the euro losses alone misleads: the two bonds do not have the same price. Sensitivity is read in % of price — or through duration directly.`
            : `Comparer les seules pertes en euros trompe : les deux titres n'ont pas le même prix. La sensibilité se lit en % du prix — ou directement sur la duration.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 5. m4-pb-nouvelle-emission — N2                                     */
/* ------------------------------------------------------------------ */
const nouvelleEmission: ProblemGenerator = {
  id: 'm4-pb-nouvelle-emission', moduleId: M4,
  titre: "Calibrer une nouvelle émission",
  titreEn: 'Calibrating a new issue',
  typeDeCas: 'marché primaire',
  typeDeCasEn: 'primary market',
  difficulte: 2,
  scenarios: ["Syndication d'un corporate", 'Adjudication souveraine (SVT)', "Desk d'origination qui calibre le coupon"],
  scenariosEn: ['Corporate bond syndication', 'Sovereign auction (primary dealer)', 'Origination desk setting the coupon'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const nominal = 1000;
    const n = randInt(rng, 5, 10);
    const tauxMarche = randFloat(rng, 2.5, 5, 2);
    const ecart = randFloat(rng, 0.4, 1.2, 2);
    const couponEnvisage = r2(tauxMarche - ecart);
    const primePb = pick(rng, [20, 30, 40] as const);

    const pInitial = prixObligation(nominal, couponEnvisage, n, tauxMarche);
    const pPair = prixObligation(nominal, tauxMarche, n, tauxMarche);
    const pPrime = prixObligation(nominal, tauxMarche, n, tauxMarche + primePb / 100);
    const repInitial = r2(pInitial);
    const repPrime = r2(pPrime);

    const { en, f, eur, pct } = outils(langue);
    const contexte = (en
      ? [
        `On the syndication desk, you are structuring a corporate new issue: face value ${eur(nominal)}, ${n}-year maturity. The market currently demands ${pct(tauxMarche)} for this name and maturity. The issuer initially wanted a ${pct(couponEnvisage)} coupon — you must show what that implies for the issue price, then set the coupon so the deal prices at par.`,
        `As a primary dealer, you prepare your bid for a sovereign auction: new ${n}-year line, face value ${eur(nominal)}, with secondary-market yields at ${pct(tauxMarche)} on that maturity. A first internal memo assumed a ${pct(couponEnvisage)} coupon — you quantify what that means for the auction price, then for a coupon set at par.`,
        `On the origination desk, you advise an issuer on the terms of its next deal: face value ${eur(nominal)}, ${n}-year maturity, market yield ${pct(tauxMarche)}. The client suggests a ${pct(couponEnvisage)} coupon to "save on interest" — your job is to show him what he gives up at issue, and how to come out at par.`,
      ]
      : [
        `Au desk de syndication, vous structurez l'émission obligataire d'un corporate : nominal ${eur(nominal)}, maturité ${n} ans. Le marché exige actuellement ${pct(tauxMarche)} sur cette signature et cette maturité. L'émetteur souhaitait initialement un coupon de ${pct(couponEnvisage)} — il faut lui montrer ce que cela implique sur le prix d'émission, puis calibrer le coupon pour sortir au pair.`,
        `Spécialiste en valeurs du Trésor, vous préparez votre soumission à une adjudication : nouvelle souche de maturité ${n} ans, nominal ${eur(nominal)}, avec un rendement secondaire de ${pct(tauxMarche)} sur cette maturité. Une note interne partait d'un coupon de ${pct(couponEnvisage)} — vous chiffrez ce que cela donnerait au prix d'adjudication, puis pour un coupon calé au pair.`,
        `Au desk d'origination, vous conseillez un émetteur sur les termes de sa prochaine opération : nominal ${eur(nominal)}, maturité ${n} ans, taux de marché ${pct(tauxMarche)}. Le client propose un coupon de ${pct(couponEnvisage)} pour « économiser des intérêts » — à vous de lui montrer ce qu'il abandonne à l'émission, et comment sortir au pair.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The price at the planned coupon' : 'a) Le prix au coupon envisagé',
          enonce: en
            ? `With a ${pct(couponEnvisage)} coupon, what would the issue price be at the ${pct(tauxMarche)} market yield, in euros?`
            : `Avec un coupon de ${pct(couponEnvisage)}, quel serait le prix d'émission au taux de marché de ${pct(tauxMarche)}, en euros ?`,
          reponse: repInitial, tolerance: 0.002, unite: '€',
          etapes: etapesPrix(langue, nominal, couponEnvisage, n, tauxMarche),
          pieges: [en
            ? `Believing a low coupon "saves money": the issuer collects ${eur(repInitial)} instead of ${eur(nominal)} per bond at issue — the market always charges its yield, through the coupon or through the price.`
            : `Croire qu'un coupon faible « fait économiser » : l'émetteur encaisse ${eur(repInitial)} au lieu de ${eur(nominal)} par titre à l'émission — le marché prélève toujours son rendement, par le coupon ou par le prix.`],
        },
        {
          intitule: en ? 'b) The coupon to issue at par' : 'b) Le coupon pour émettre au pair',
          enonce: en
            ? `What annual coupon (in %) makes the bond price exactly at par?`
            : `Quel coupon annuel (en %) permet d'émettre exactement au pair ?`,
          reponse: tauxMarche, tolerance: 0.002, unite: '%',
          etapes: [
            {
              titre: en ? 'The par rule' : 'La règle du pair',
              contenu: en
                ? `A bond prices at par when its coupon equals the market yield: each coupon then pays exactly the required return, leaving nothing to adjust through the price. Hence coupon = **${pct(tauxMarche)}**.`
                : `Une obligation cote au pair quand son coupon égale le taux de marché : chaque coupon rémunère alors exactement le rendement exigé, et le prix n'a plus rien à compenser. D'où coupon = **${pct(tauxMarche)}**.`,
            },
            {
              titre: en ? 'Check' : 'Vérification',
              contenu: en
                ? `Pricing the bond with a ${pct(tauxMarche)} coupon at a ${pct(tauxMarche)} yield gives ${eur(r2(pPair))} — par, up to rounding.`
                : `En valorisant le titre avec un coupon de ${pct(tauxMarche)} au taux de ${pct(tauxMarche)}, on retrouve ${eur(r2(pPair))} — le pair, aux arrondis près.`,
            },
          ],
        },
        {
          intitule: en ? 'c) The price if the market demands a premium' : 'c) Le prix si le marché exige une prime',
          enonce: en
            ? `Between announcement and pricing, the market sours: investors now demand a new-issue premium of +${primePb} bp over the initial yield, while the coupon was already fixed at the answer to b). What is the issue price, in euros?`
            : `Entre l'annonce et le pricing, le marché se tend : les investisseurs exigent désormais une prime de nouvelle émission de +${primePb} pb au-dessus du taux initial, alors que le coupon a déjà été figé à la réponse du b). Quel est le prix d'émission, en euros ?`,
          reponse: repPrime, tolerance: 0.002, unite: '€',
          etapes: [
            {
              titre: en ? 'The new required yield' : 'Le nouveau taux exigé',
              contenu: en
                ? `Required yield = ${f(tauxMarche)} + ${f(primePb / 100)} = **${pct(r2(tauxMarche + primePb / 100))}**, while the coupon stays at ${pct(tauxMarche)}: the bond must now price below par.`
                : `Taux exigé = ${f(tauxMarche)} + ${f(primePb / 100)} = **${pct(r2(tauxMarche + primePb / 100))}**, alors que le coupon reste à ${pct(tauxMarche)} : le titre doit désormais sortir sous le pair.`,
            },
            ...etapesPrix(langue, nominal, tauxMarche, n, r2(tauxMarche + primePb / 100)),
            {
              titre: en ? 'Cost for the issuer' : "Coût pour l'émetteur",
              contenu: en
                ? `The issuer collects ${eur(repPrime)} instead of ${eur(nominal)} per bond: the ${primePb} bp premium costs **${eur(r2(nominal - pPrime))}** per bond at settlement — that is what a tense pricing window means in euros.`
                : `L'émetteur encaisse ${eur(repPrime)} au lieu de ${eur(nominal)} par titre : la prime de ${primePb} pb coûte **${eur(r2(nominal - pPrime))}** par obligation au règlement — voilà ce qu'une fenêtre de pricing tendue veut dire en euros.`,
            },
          ],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 6. m4-pb-bootstrap-courbe — N3                                      */
/* ------------------------------------------------------------------ */
const bootstrapCourbe: ProblemGenerator = {
  id: 'm4-pb-bootstrap-courbe', moduleId: M4,
  titre: 'Bootstrapper une courbe zéro-coupon',
  titreEn: 'Bootstrapping a zero-coupon curve',
  typeDeCas: 'construction de courbe',
  typeDeCasEn: 'curve construction',
  difficulte: 3,
  scenarios: ['Desk dérivés qui a besoin de taux zéro-coupon', 'Contrôle des risques qui revalide la courbe', 'Cellule de pricing interne'],
  scenariosEn: ['Derivatives desk needing zero rates', 'Risk control revalidating the curve', 'In-house pricing team'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const nominal = 1000;
    const z1 = randFloat(rng, 1.5, 3.5, 2);
    const pente = randFloat(rng, 0.2, 0.9, 2);
    const z2 = r2(z1 + pente);
    const coupon2 = randFloat(rng, 2, 5, 2);

    const prixBTF = prixZeroCoupon(nominal, z1, 1);
    const c = (nominal * coupon2) / 100;
    const vaCoupon1 = va(c, z1, 1);
    const p2 = vaCoupon1 + va(c + nominal, z2, 2);
    const fwd = tauxForward(z1, 1, z2, 2);
    const repFwd = r3(fwd);
    const fwdNaif = r2(2 * z2 - z1);

    const { en, f, eur, pct } = outils(langue);
    const donnees = en
      ? `a 1-year BTF (zero-coupon T-bill) quoted at ${eur(r2(prixBTF))} per ${eur(nominal)} of face value, and a 2-year government bond, ${pct(coupon2)} annual coupon, quoted at ${eur(r2(p2))}`
      : `un BTF 1 an (zéro-coupon) coté ${eur(r2(prixBTF))} pour ${eur(nominal)} de nominal, et une obligation d'État 2 ans, coupon annuel de ${pct(coupon2)}, cotée ${eur(r2(p2))}`;
    const contexte = (en
      ? [
        `On the derivatives desk, your pricer needs clean zero-coupon rates — not YTMs, which mix maturities. On screen: ${donnees}. Your job: bootstrap the 1-year and 2-year zero rates, then read the forward the curve implies.`,
        `In risk control, you revalidate the zero-coupon curve the front office loaded this morning. You go back to the raw market quotes: ${donnees}. You rebuild the two zero rates independently, then the 1y1y forward, before signing off the curve.`,
        `The in-house pricing team rebuilds its zero curve every morning from market prices: ${donnees}. Today you document the method step by step for the audit file: 1-year zero, 2-year zero by bootstrap, then the implied forward.`,
      ]
      : [
        `Au desk dérivés, votre pricer a besoin de taux zéro-coupon propres — pas de YTM, qui mélangent les maturités. À l'écran : ${donnees}. À vous de bootstrapper le taux zéro 1 an, le taux zéro 2 ans, puis de lire le forward que la courbe implique.`,
        `Au contrôle des risques, vous revalidez la courbe zéro-coupon chargée ce matin par le front. Vous repartez des cotations brutes : ${donnees}. Vous reconstruisez les deux taux zéro de façon indépendante, puis le forward 1 an dans 1 an, avant de valider la courbe.`,
        `La cellule de pricing interne reconstruit chaque matin sa courbe zéro-coupon à partir des prix de marché : ${donnees}. Aujourd'hui, vous documentez la méthode pas à pas pour le dossier d'audit : zéro 1 an, zéro 2 ans par bootstrap, puis le forward implicite.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The 1-year zero rate' : 'a) Le taux zéro-coupon 1 an',
          enonce: en
            ? `From the BTF price, derive the 1-year zero-coupon rate, in %.`
            : `Déduisez du prix du BTF le taux zéro-coupon 1 an, en %.`,
          reponse: z1, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'A single flow gives the zero rate directly' : 'Un flux unique donne directement le taux zéro',
            contenu: en
              ? `The BTF pays ${eur(nominal)} in one year, nothing else: ${f(nominal)} / ${f(r2(prixBTF))} = ${f(nominal / prixBTF, 4)}, so $z_1$ = **${pct(z1)}**. Zero-coupon instruments are the only ones whose yield IS the zero rate.`
              : `Le BTF verse ${eur(nominal)} dans un an, rien d'autre : ${f(nominal)} / ${f(r2(prixBTF))} = ${f(nominal / prixBTF, 4)}, donc $z_1$ = **${pct(z1)}**. Les instruments zéro-coupon sont les seuls dont le rendement EST le taux zéro.`,
          }],
        },
        {
          intitule: en ? 'b) The 2-year zero rate (bootstrap)' : 'b) Le taux zéro-coupon 2 ans (bootstrap)',
          enonce: en
            ? `Using the answer to a), bootstrap the 2-year zero-coupon rate from the 2-year coupon bond, in %.`
            : `À l'aide de la réponse du a), bootstrappez le taux zéro-coupon 2 ans depuis l'obligation couponnée 2 ans, en %.`,
          reponse: z2, tolerance: 0.005, unite: '%',
          etapes: [
            {
              titre: en ? 'Strip out the year-1 coupon at z₁' : 'Retirer le coupon de l’année 1 au taux z₁',
              contenu: en
                ? `The bond pays ${eur(c)} in year 1 and ${eur(c + nominal)} in year 2. The year-1 flow is worth ${f(c)} / ${f(1 + z1 / 100, 4)} = **${eur(r2(vaCoupon1))}** — discounted at $z_1$ = ${pct(z1)} from a), not at some average rate.`
                : `Le titre verse ${eur(c)} dans 1 an et ${eur(c + nominal)} dans 2 ans. Le flux de l'année 1 vaut ${f(c)} / ${f(1 + z1 / 100, 4)} = **${eur(r2(vaCoupon1))}** — actualisé au $z_1$ = ${pct(z1)} du a), pas à un taux moyen.`,
            },
            {
              titre: en ? 'What is left prices the final flow' : 'Le reste du prix valorise le flux final',
              contenu: en
                ? `${f(r2(p2))} − ${f(r2(vaCoupon1))} = **${eur(r2(p2 - vaCoupon1))}** is the present value of ${eur(c + nominal)} due in 2 years.`
                : `${f(r2(p2))} − ${f(r2(vaCoupon1))} = **${eur(r2(p2 - vaCoupon1))}** est la valeur actuelle des ${eur(c + nominal)} dus dans 2 ans.`,
            },
            {
              titre: en ? 'Solve for z₂' : 'Résoudre pour z₂',
              contenu: en
                ? `$(1+z_2)^2$ = ${f(c + nominal)} / ${f(r2(p2 - vaCoupon1))} = ${f((c + nominal) / (p2 - vaCoupon1), 4)}, hence $1+z_2$ = ${f(Math.sqrt((c + nominal) / (p2 - vaCoupon1)), 4)} and $z_2$ = **${pct(z2)}**.`
                : `$(1+z_2)^2$ = ${f(c + nominal)} / ${f(r2(p2 - vaCoupon1))} = ${f((c + nominal) / (p2 - vaCoupon1), 4)}, d'où $1+z_2$ = ${f(Math.sqrt((c + nominal) / (p2 - vaCoupon1)), 4)} et $z_2$ = **${pct(z2)}**.`,
            },
          ],
          pieges: [en
            ? `Using the 2-year bond's YTM (≈ ${pct(r2(ytm2Ans(nominal, coupon2, p2)))}) as the 2-year zero rate: the YTM blends year-1 and year-2 flows — that is precisely what bootstrapping undoes.`
            : `Prendre le YTM de l'obligation 2 ans (≈ ${pct(r2(ytm2Ans(nominal, coupon2, p2)))}) comme taux zéro 2 ans : le YTM mélange les flux de l'année 1 et de l'année 2 — c'est précisément ce que le bootstrap démêle.`],
        },
        {
          intitule: en ? 'c) The 1-year forward, one year out' : 'c) Le forward 1 an dans 1 an',
          enonce: en
            ? `From the two zero rates, compute the implied 1-year rate starting in one year ($f_{1,2}$), in %.`
            : `À partir des deux taux zéro, calculez le taux 1 an dans 1 an implicite ($f_{1,2}$), en %.`,
          reponse: repFwd, tolerance: 0.005, unite: '%',
          etapes: [
            {
              titre: en ? 'No-arbitrage relation' : "Relation d'absence d'arbitrage",
              contenu: en
                ? `Investing 2 years at $z_2$ must equal 1 year at $z_1$ then 1 year at the forward: $(1+z_2)^2 = (1+z_1)(1+f_{1,2})$. Hence $1+f_{1,2}$ = ${f((1 + z2 / 100) ** 2 / (1 + z1 / 100), 4)} and $f_{1,2}$ = **${pct(repFwd, 3)}**.`
                : `Placer 2 ans à $z_2$ doit équivaloir à 1 an à $z_1$ puis 1 an au forward : $(1+z_2)^2 = (1+z_1)(1+f_{1,2})$. D'où $1+f_{1,2}$ = ${f((1 + z2 / 100) ** 2 / (1 + z1 / 100), 4)} et $f_{1,2}$ = **${pct(repFwd, 3)}**.`,
            },
            {
              titre: en ? 'How to read it' : 'Comment le lire',
              contenu: en
                ? `${pct(repFwd, 3)} is the 1-year rate the curve "prices in" one year from now — a break-even, not a forecast: it is the rate that makes both strategies equivalent.`
                : `${pct(repFwd, 3)} est le taux 1 an que la courbe « intègre » dans un an — un point mort, pas une prévision : c'est le taux qui rend les deux stratégies équivalentes.`,
            },
          ],
          pieges: [en
            ? `The linear shortcut 2 × ${f(z2)} − ${f(z1)} = ${pct(fwdNaif)} ignores compounding: close, but the gap costs real basis points on large notionals.`
            : `Le raccourci linéaire 2 × ${f(z2)} − ${f(z1)} = ${pct(fwdNaif)} ignore la capitalisation : proche, mais l'écart se paie en vrais points de base sur de gros nominaux.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 7. m4-pb-frn-vs-fixe — N3                                           */
/* ------------------------------------------------------------------ */
const frnVsFixe: ProblemGenerator = {
  id: 'm4-pb-frn-vs-fixe', moduleId: M4,
  titre: 'Taux fixe ou taux variable ?',
  typeDeCas: 'anticipation de taux',
  titreEn: 'Fixed or floating?',
  typeDeCasEn: 'rate view',
  difficulte: 3,
  scenarios: ["Trésorier qui choisit son format d'emprunt", 'Investisseur qui arbitre fixe contre variable', "ALM d'une banque qui pilote son exposition"],
  scenariosEn: ['Treasurer choosing a funding format', 'Investor weighing fixed against floating', 'Bank ALM steering its rate exposure'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const notionnelM = pick(rng, [5, 10, 20, 50] as const);
    const notionnel = notionnelM * 1_000_000;
    const euribor = randFloat(rng, 1.5, 3.5, 2);
    const margePb = randInt(rng, 30, 120);
    const avantagePb = randInt(rng, 20, 90);
    const tauxFixe = r2(euribor + margePb / 100 + avantagePb / 100);

    const tauxFrn = euribor + margePb / 100;
    const couponFrn = (notionnel * tauxFrn) / 100;
    const interetFixe = (notionnel * tauxFixe) / 100;
    const ecart = interetFixe - couponFrn;
    const euriborPM = tauxFixe - margePb / 100;
    const pointMort = r2((euriborPM - euribor) * 100);
    const repFrn = r2(couponFrn);
    const repFixe = r2(interetFixe);
    const repEcart = r2(ecart);

    const { en, f, eur, pct } = outils(langue);
    const termes = en
      ? `a fixed rate of ${pct(tauxFixe)}, or a floating-rate note (FRN) paying 12-month Euribor + ${margePb} bp, with Euribor currently fixing at ${pct(euribor)}`
      : `un taux fixe de ${pct(tauxFixe)}, ou un titre à taux variable (FRN) payant l'Euribor 12 mois + ${margePb} pb, l'Euribor fixant actuellement à ${pct(euribor)}`;
    const contexte = (en
      ? [
        `As group treasurer, you must raise €${f(notionnelM)}m over several years. Two formats on the table: ${termes}. The CEO's question is blunt: "floating looks cheaper — by how much, and up to what Euribor level?"`,
        `As a portfolio manager, you have €${f(notionnelM)}m to invest in the same issuer, which offers two lines: ${termes}. You frame the choice the desk way: income today on each leg, and the Euribor move that flips the ranking.`,
        `At the bank's ALM desk, the rates committee debates locking the return on a €${f(notionnelM)}m placement: ${termes}. Before taking a view, the committee wants the year-1 cash flows of each format and the break-even Euribor rise.`,
      ]
      : [
        `Trésorier du groupe, vous devez lever ${f(notionnelM)} M€ sur plusieurs années. Deux formats sur la table : ${termes}. La question du directeur général est directe : « le variable a l'air moins cher — de combien, et jusqu'à quel niveau d'Euribor ? »`,
        `Gérant, vous avez ${f(notionnelM)} M€ à placer chez un même émetteur, qui propose deux souches : ${termes}. Vous posez l'arbitrage à la façon du desk : revenu immédiat de chaque jambe, et mouvement d'Euribor qui inverse le classement.`,
        `À l'ALM de la banque, le comité de taux débat de figer ou non le rendement d'un placement de ${f(notionnelM)} M€ : ${termes}. Avant de prendre une vue, le comité veut les flux de la première année dans chaque format et le point mort de hausse de l'Euribor.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The FRN coupon at the current fixing' : 'a) Le coupon du FRN au fixing actuel',
          enonce: en
            ? `At the current Euribor fixing, what does the FRN pay over year 1, in euros?`
            : `Au fixing actuel de l'Euribor, que verse le FRN sur la première année, en euros ?`,
          reponse: repFrn, tolerance: 0.002, unite: '€',
          etapes: [
            {
              titre: en ? 'The FRN rate' : 'Le taux du FRN',
              contenu: en
                ? `FRN rate = Euribor + margin = ${f(euribor)} + ${f(margePb / 100)} = **${pct(r2(tauxFrn))}**.`
                : `Taux du FRN = Euribor + marge = ${f(euribor)} + ${f(margePb / 100)} = **${pct(r2(tauxFrn))}**.`,
            },
            {
              titre: en ? 'Apply to the notional' : 'Appliquer au notionnel',
              contenu: en
                ? `${pct(r2(tauxFrn))} × €${f(notionnelM)}m = **${eur(repFrn)}** for year 1. Beyond that, the coupon resets with each Euribor fixing — that is the whole point of the format.`
                : `${pct(r2(tauxFrn))} × ${f(notionnelM)} M€ = **${eur(repFrn)}** pour la première année. Ensuite, le coupon se recale à chaque fixing de l'Euribor — c'est tout l'intérêt du format.`,
            },
          ],
        },
        {
          intitule: en ? 'b) The annual interest on the fixed leg' : 'b) L\'intérêt annuel du taux fixe',
          enonce: en
            ? `What does the fixed format pay (or cost) per year, in euros?`
            : `Que verse (ou coûte) le format à taux fixe chaque année, en euros ?`,
          reponse: repFixe, tolerance: 0.002, unite: '€',
          etapes: [{
            titre: en ? 'A frozen cash flow' : 'Un flux figé',
            contenu: en
              ? `${pct(tauxFixe)} × €${f(notionnelM)}m = **${eur(repFixe)}**, every year, whatever Euribor does. Certainty has a price: it is the gap with a).`
              : `${pct(tauxFixe)} × ${f(notionnelM)} M€ = **${eur(repFixe)}**, chaque année, quoi que fasse l'Euribor. La certitude a un prix : c'est l'écart avec le a).`,
          }],
        },
        {
          intitule: en ? 'c) The year-1 gap' : "c) L'écart de la première année",
          enonce: en
            ? `At an unchanged Euribor, what is the year-1 gap between the fixed leg and the FRN, in euros?`
            : `À Euribor inchangé, quel est l'écart entre le format fixe et le FRN sur la première année, en euros ?`,
          reponse: repEcart, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'Fixed minus floating' : 'Fixe moins variable',
            contenu: en
              ? `${f(repFixe)} − ${f(repFrn)} = **${eur(repEcart)}**. For a borrower, that is the year-1 cost of locking the rate; for an investor, the extra income of the fixed line as long as Euribor stays put.`
              : `${f(repFixe)} − ${f(repFrn)} = **${eur(repEcart)}**. Pour un emprunteur, c'est le surcoût de la première année pour figer son taux ; pour un investisseur, le surcroît de revenu du fixe tant que l'Euribor ne bouge pas.`,
          }],
        },
        {
          intitule: en ? 'd) The break-even Euribor rise' : "d) Le point mort de hausse de l'Euribor",
          enonce: en
            ? `By how many basis points must Euribor rise for the FRN to pay (or cost) exactly as much as the fixed leg?`
            : `De combien de points de base l'Euribor doit-il monter pour que le FRN verse (ou coûte) exactement autant que le fixe ?`,
          reponse: pointMort, tolerance: 0.005, unite: en ? 'bp' : 'pb',
          etapes: [
            {
              titre: en ? 'Set the two legs equal' : 'Égaliser les deux jambes',
              contenu: en
                ? `The legs match when Euribor + margin = fixed rate, i.e. Euribor* = ${f(tauxFixe)} − ${f(margePb / 100)} = **${pct(r2(euriborPM))}**.`
                : `Les deux jambes s'égalisent quand Euribor + marge = taux fixe, soit Euribor* = ${f(tauxFixe)} − ${f(margePb / 100)} = **${pct(r2(euriborPM))}**.`,
            },
            {
              titre: en ? 'Convert into a rise' : 'Convertir en hausse',
              contenu: en
                ? `From ${pct(euribor)} to ${pct(r2(euriborPM))}: a rise of **${f(pointMort)} bp**. If your scenario sees Euribor higher than that, the fixed leg wins; below, the floater stays cheaper (or the fixed line keeps out-yielding).`
                : `De ${pct(euribor)} à ${pct(r2(euriborPM))} : une hausse de **${f(pointMort)} pb**. Si votre scénario voit l'Euribor au-delà, le fixe gagne ; en deçà, le variable reste moins cher (ou le fixe continue de mieux rémunérer).`,
            },
          ],
          pieges: [en
            ? `Forgetting the margin and computing fixed − Euribor = ${f(r2((tauxFixe - euribor) * 100))} bp: the FRN already pays Euribor PLUS ${margePb} bp — the break-even is ${f(pointMort)} bp, not ${f(r2((tauxFixe - euribor) * 100))}.`
            : `Oublier la marge et calculer fixe − Euribor = ${f(r2((tauxFixe - euribor) * 100))} pb : le FRN paie déjà Euribor PLUS ${margePb} pb — le point mort est à ${f(pointMort)} pb, pas à ${f(r2((tauxFixe - euribor) * 100))}.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 8. m4-pb-spread-souverain — N2                                      */
/* ------------------------------------------------------------------ */
const spreadSouverain: ProblemGenerator = {
  id: 'm4-pb-spread-souverain', moduleId: M4,
  titre: 'Lire et chiffrer un spread souverain',
  titreEn: 'Reading and pricing a sovereign spread',
  typeDeCas: 'analyse de spread',
  typeDeCasEn: 'spread analysis',
  difficulte: 2,
  scenarios: ['Analyste taux', 'Gérant obligataire', 'Brief pour un journaliste économique'],
  scenariosEn: ['Rates analyst', 'Bond fund manager', 'Briefing a financial journalist'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const nominal = 1000;
    const n = randInt(rng, 7, 10);
    const coupon = randFloat(rng, 2.5, 4, 2);
    const yBund = randFloat(rng, 2, 3, 2);
    const spread0Pb = randInt(rng, 50, 90);
    const yOAT = r2(yBund + spread0Pb / 100);
    const ecartementPb = pick(rng, [15, 25, 40] as const);
    const positionM = pick(rng, [5, 10, 20, 50] as const);

    const spreadPb = r2((yOAT - yBund) * 100);
    const p0 = prixObligation(nominal, coupon, n, yOAT);
    const yChoc = r2(yOAT + ecartementPb / 100);
    const p1 = prixObligation(nominal, coupon, n, yChoc);
    const nbTitres = positionM * 1000; // position en M€ de nominal / titres de 1 000 €
    const perte = r2((p0 - p1) * nbTitres);
    const repP0 = r2(p0);
    const repP1 = r2(p1);

    const { en, f, eur, pct } = outils(langue);
    const marche = en
      ? `the ${n}-year OAT, ${pct(coupon)} coupon, yields ${pct(yOAT)}; the German Bund of the same maturity yields ${pct(yBund)}`
      : `l'OAT ${n} ans, coupon ${pct(coupon)}, rend ${pct(yOAT)} ; le Bund allemand de même maturité rend ${pct(yBund)}`;
    const contexte = (en
      ? [
        `As a rates analyst at an asset manager, you cover the France-Germany gap. This morning: ${marche}. The fund holds €${f(positionM)}m of face value of this OAT, and the strategist flags a widening risk of ${ecartementPb} bp (budget, ratings) with the Bund unchanged. You quantify the scenario for the morning meeting.`,
        `As a bond fund manager, you hold €${f(positionM)}m of face value of an OAT: ${marche}. Ahead of a political deadline, you price the scenario your risk committee keeps asking about — the spread widening by ${ecartementPb} bp while the Bund does not move.`,
        `You prepare the briefing of a financial journalist who must explain, with numbers, what "the OAT-Bund spread widens by ${ecartementPb} bp" means. Market data: ${marche}. To make the cost concrete, take an investor holding €${f(positionM)}m of face value of the OAT.`,
      ]
      : [
        `Analyste taux dans une société de gestion, vous suivez l'écart France-Allemagne. Ce matin : ${marche}. Le fonds détient ${f(positionM)} M€ de nominal de cette OAT, et le stratégiste signale un risque d'écartement de ${ecartementPb} pb (budget, notation) à Bund inchangé. Vous chiffrez le scénario pour le point du matin.`,
        `Gérant obligataire, vous détenez ${f(positionM)} M€ de nominal d'une OAT : ${marche}. Avant une échéance politique, vous chiffrez le scénario que le comité des risques vous redemande sans cesse — un écartement du spread de ${ecartementPb} pb, Bund inchangé.`,
        `Vous préparez le brief d'un journaliste économique qui doit expliquer, chiffres à l'appui, ce que signifie « le spread OAT-Bund s'écarte de ${ecartementPb} pb ». Données de marché : ${marche}. Pour rendre le coût concret, prenez un investisseur détenant ${f(positionM)} M€ de nominal de l'OAT.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The OAT-Bund spread' : 'a) Le spread OAT-Bund',
          enonce: en ? `What is the current spread, in basis points?` : `Quel est le spread actuel, en points de base ?`,
          reponse: spreadPb, tolerance: 0.005, unite: en ? 'bp' : 'pb',
          etapes: [{
            titre: en ? 'Yield difference' : 'Différence de rendements',
            contenu: en
              ? `Spread = ${f(yOAT)} − ${f(yBund)} = ${f(r2(yOAT - yBund))} point, i.e. **${f(spreadPb)} bp**. It is the premium investors demand to hold France rather than Germany: credit, liquidity, politics.`
              : `Spread = ${f(yOAT)} − ${f(yBund)} = ${f(r2(yOAT - yBund))} point, soit **${f(spreadPb)} pb**. C'est la prime que les investisseurs exigent pour détenir la France plutôt que l'Allemagne : crédit, liquidité, politique.`,
          }],
        },
        {
          intitule: en ? 'b) The current OAT price' : "b) Le prix actuel de l'OAT",
          enonce: en
            ? `What is the OAT's current price, in euros, per ${eur(nominal)} of face value?`
            : `Quel est le prix actuel de l'OAT, en euros, pour ${eur(nominal)} de nominal ?`,
          reponse: repP0, tolerance: 0.002, unite: '€',
          etapes: etapesPrix(langue, nominal, coupon, n, yOAT),
        },
        {
          intitule: en ? 'c) The price after the widening' : "c) Le prix après l'écartement",
          enonce: en
            ? `The spread widens by ${ecartementPb} bp with the Bund unchanged: the OAT yield moves to ${pct(yChoc)}. What is the new price, in euros?`
            : `Le spread s'écarte de ${ecartementPb} pb à Bund inchangé : le rendement de l'OAT passe à ${pct(yChoc)}. Quel est le nouveau prix, en euros ?`,
          reponse: repP1, tolerance: 0.002, unite: '€',
          etapes: [
            {
              titre: en ? 'Only the OAT yield moves' : "Seul le rendement de l'OAT bouge",
              contenu: en
                ? `Bund unchanged + spread +${ecartementPb} bp ⇒ OAT yield = ${f(yOAT)} + ${f(ecartementPb / 100)} = **${pct(yChoc)}**. A widening spread is a rise in the OAT's own discount rate.`
                : `Bund inchangé + spread +${ecartementPb} pb ⇒ rendement OAT = ${f(yOAT)} + ${f(ecartementPb / 100)} = **${pct(yChoc)}**. Un écartement de spread, c'est une hausse du taux d'actualisation propre à l'OAT.`,
            },
            ...etapesPrix(langue, nominal, coupon, n, yChoc),
            {
              titre: en ? 'The drop per bond' : 'La baisse par titre',
              contenu: en
                ? `${f(repP0)} − ${f(repP1)} = **${eur(r2(p0 - p1))}** lost per ${eur(nominal)} of face value.`
                : `${f(repP0)} − ${f(repP1)} = **${eur(r2(p0 - p1))}** de perte par ${eur(nominal)} de nominal.`,
            },
          ],
          pieges: [en
            ? `Applying the ${ecartementPb} bp to the price instead of the yield: a spread is a yield gap — the price impact goes through discounting (or through duration), never by subtracting basis points from a price.`
            : `Appliquer les ${ecartementPb} pb au prix au lieu du rendement : un spread est un écart de taux — l'impact prix passe par l'actualisation (ou par la duration), jamais en retranchant des points de base à un prix.`],
        },
        {
          intitule: en ? 'd) The loss on the position' : 'd) La perte sur la position',
          enonce: en
            ? `What loss (in euros, positive number) does the widening inflict on the €${f(positionM)}m position?`
            : `Quelle perte (en euros, valeur positive) l'écartement inflige-t-il à la position de ${f(positionM)} M€ ?`,
          reponse: perte, tolerance: 0.01, unite: '€',
          etapes: [
            {
              titre: en ? 'Number of bonds' : 'Nombre de titres',
              contenu: en
                ? `€${f(positionM)}m of face value in ${eur(nominal)} bonds = **${f(nbTitres)} bonds**.`
                : `${f(positionM)} M€ de nominal en titres de ${eur(nominal)} = **${f(nbTitres)} titres**.`,
            },
            {
              titre: en ? 'Scale the per-bond loss' : 'Mettre la perte unitaire à l’échelle',
              contenu: en
                ? `${f(r2(p0 - p1))} × ${f(nbTitres)} = **${eur(perte)}**. ${sIdx === 2 ? `That is the concrete figure for the article: ${ecartementPb} bp of spread on €${f(positionM)}m wipes out ${eur(perte)} — without Germany moving at all.` : `That is the mark-to-market hit of ${ecartementPb} bp of spread on this line — without the Bund moving at all.`}`
                : `${f(r2(p0 - p1))} × ${f(nbTitres)} = **${eur(perte)}**. ${sIdx === 2 ? `Voilà le chiffre concret pour l'article : ${ecartementPb} pb de spread sur ${f(positionM)} M€ effacent ${eur(perte)} — sans que l'Allemagne ait bougé.` : `C'est la moins-value latente qu'infligent ${ecartementPb} pb de spread sur cette ligne — sans que le Bund ait bougé.`}`,
            },
          ],
        },
      ],
    };
  },
};

export const problemes: ProblemGenerator[] = [
  analyseLigne,
  couponCouruTransaction,
  comparaisonDeuxObligations,
  zcVsCoupon,
  nouvelleEmission,
  bootstrapCourbe,
  frnVsFixe,
  spreadSouverain,
];
