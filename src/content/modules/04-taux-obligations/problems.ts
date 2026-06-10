/**
 * Moules de problèmes multi-étapes du module Taux & obligations — lots 1 et 2 (Tasks B8 + B9).
 * Chaque moule : 3 scénarios FR + EN, sous-questions chaînées (les valeurs de a)
 * servent en b), c)…), corrigés calculés via calculs.ts — jamais de texte figé.
 * Les tirages aléatoires ont lieu AVANT toute branche de langue : même seed +
 * même scénario ⇒ mêmes nombres en français et en anglais.
 * Le lot 2 ajoute les trois « boss » de niveau 4 (immunisation, trade de courbe,
 * convexité sur gros choc) : leurs vérifications « ≈ 0 » utilisent toleranceMode
 * 'absolu' avec un seuil dimensionné à la taille de la position.
 */
import { formatNombreLangue } from '../../../engine/answers';
import { mulberry32, pick, randFloat, randInt } from '../../../engine/rng';
import type { Etape, Langue, ProblemGenerator } from '../../../engine/types';
import {
  convexite, couponCouru, durationMacaulay, durationModifiee, interetMonetaire,
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

/* ================================================================== */
/* Lot 2 (Task B9) — cinq moules N3, puis les trois « boss » N4        */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/* 9. m4-pb-portefeuille-duration — N3                                 */
/* ------------------------------------------------------------------ */
const portefeuilleDuration: ProblemGenerator = {
  id: 'm4-pb-portefeuille-duration', moduleId: M4,
  titre: "Piloter la duration d'un portefeuille",
  titreEn: 'Steering a portfolio duration',
  typeDeCas: 'gestion de portefeuille',
  typeDeCasEn: 'portfolio management',
  difficulte: 3,
  scenarios: ['Fonds obligataire avant un cycle de hausse', "Assureur qui resserre l'écart actif-passif", 'Mandat institutionnel sous budget de risque'],
  scenariosEn: ['Bond fund ahead of a hiking cycle', 'Insurer narrowing its asset-liability gap', 'Institutional mandate under a risk budget'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const nominal = 1000;
    const taux = randFloat(rng, 2, 4.5, 2);
    const couponA = randFloat(rng, 4, 6, 2);
    const nA = randInt(rng, 2, 4);
    const couponB = randFloat(rng, 1.5, 3, 2);
    const nB = randInt(rng, 8, 12);
    const qA = pick(rng, [3000, 5000, 8000] as const);
    const qB = pick(rng, [3000, 4000, 6000] as const);
    const reduction = pick(rng, [0.5, 0.75, 1] as const);

    const pA = prixObligation(nominal, couponA, nA, taux);
    const pB = prixObligation(nominal, couponB, nB, taux);
    const dA = durationMacaulay(nominal, couponA, nA, taux);
    const dB = durationMacaulay(nominal, couponB, nB, taux);
    const mvA = qA * pA;
    const mvB = qB * pB;
    const valeur = mvA + mvB;
    const wA = mvA / valeur;
    const wApct = r2(wA * 100);
    const wBpct = r2((1 - wA) * 100);
    const dPtf = wA * dA + (1 - wA) * dB;
    const dModPtf = durationModifiee(dPtf, taux);
    const deltaV = -dModPtf * 0.0075 * valeur;
    const cible = r2(dPtf - reduction);
    const aVendre = (valeur * reduction) / dB;
    const aVendreA = (valeur * reduction) / dA;
    const aVendreProrata = (valeur * reduction) / dPtf;
    const repPA = r2(pA);
    const repPB = r2(pB);
    const repDPtf = r3(dPtf);
    const repDeltaV = r2(deltaV);
    const repVendre = r2(aVendre);

    const { en, f, eur, pct } = outils(langue);
    const lignes = en
      ? `${f(qA)} bonds A (face value ${eur(nominal)}, ${pct(couponA)} coupon, ${nA} years) and ${f(qB)} bonds B (face value ${eur(nominal)}, ${pct(couponB)} coupon, ${nB} years), with the curve at a flat yield of ${pct(taux)} on both maturities`
      : `${f(qA)} obligations A (nominal ${eur(nominal)}, coupon ${pct(couponA)}, ${nA} ans) et ${f(qB)} obligations B (nominal ${eur(nominal)}, coupon ${pct(couponB)}, ${nB} ans), avec une courbe plate à ${pct(taux)} sur les deux maturités`;
    const contexte = (en
      ? [
        `You run a bond fund and the central bank has all but announced a hiking cycle. The book holds two lines: ${lignes}. Before the next investment committee, you must lay out the fund's rate risk in hard numbers — and the trade that cuts it.`,
        `At a life insurer, the ALM unit flags that the asset side runs longer than the liabilities. Your bond pocket holds ${lignes}. The committee wants the portfolio duration, the euro sensitivity, and a concrete sale to shorten the book.`,
        `You manage an institutional mandate whose guidelines cap the duration. The custody statement shows ${lignes}. The risk controller asks for the portfolio figures — and, since the cap is breached, for the exact amount to sell.`,
      ]
      : [
        `Vous gérez un fonds obligataire et la banque centrale a quasiment annoncé un cycle de hausse. Le book détient deux lignes : ${lignes}. Avant le prochain comité d'investissement, vous devez poser le risque de taux du fonds en chiffres — et le trade qui le réduit.`,
        `Chez un assureur-vie, l'ALM signale que l'actif est plus long que le passif. Votre poche obligataire détient ${lignes}. Le comité veut la duration du portefeuille, la sensibilité en euros, et une cession concrète pour raccourcir le book.`,
        `Vous gérez un mandat institutionnel dont les directives plafonnent la duration. Le relevé affiche ${lignes}. Le contrôleur des risques demande les chiffres du portefeuille — et, le plafond étant dépassé, le montant exact à céder.`,
      ])[sIdx];

    const lectureChoc = (en
      ? [
        `If the hiking cycle delivers its 75bp, the fund gives back ${eur(r2(-deltaV))} — the number that opens the committee, and the reason question e) exists.`,
        `On the asset side, ${eur(r2(-deltaV))} of unrealised loss; the liabilities fall with rates too — the duration GAP between the two is the real risk, hence the reduction requested in e).`,
        `${eur(r2(-deltaV))} on a 75bp shock: set against the mandate's risk budget, that is what forces the target of question e).`,
      ]
      : [
        `Si le cycle de hausse livre ses 75 pb, le fonds rend ${eur(r2(-deltaV))} — le chiffre qui ouvre le comité, et la raison d'être de la question e).`,
        `Côté actif, ${eur(r2(-deltaV))} de moins-value latente ; le passif baisse lui aussi avec les taux — c'est l'ÉCART de duration entre les deux qui fait le vrai risque, d'où la réduction demandée en e).`,
        `${eur(r2(-deltaV))} sur un choc de 75 pb : rapporté au budget de risque du mandat, c'est ce qui impose la cible de la question e).`,
      ])[sIdx];

    const clauseA = aVendreA > mvA
      ? (en ? ' — more than the fund even holds' : ' — davantage que la position détenue')
      : '';

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) Price of line A' : 'a) Le prix de la ligne A',
          enonce: en ? `What is the price of one bond A, in euros?` : `Quel est le prix d'une obligation A, en euros ?`,
          reponse: repPA, tolerance: 0.002, unite: '€',
          etapes: etapesPrix(langue, nominal, couponA, nA, taux),
        },
        {
          intitule: en ? 'b) Price of line B' : 'b) Le prix de la ligne B',
          enonce: en ? `Same question for one bond B.` : `Même question pour une obligation B.`,
          reponse: repPB, tolerance: 0.002, unite: '€',
          etapes: etapesPrix(langue, nominal, couponB, nB, taux),
        },
        {
          intitule: en ? 'c) The portfolio duration' : 'c) La duration du portefeuille',
          enonce: en
            ? `Compute the portfolio's Macaulay duration (market-value-weighted average), in years.`
            : `Calculez la duration de Macaulay du portefeuille (moyenne pondérée par les valeurs de marché), en années.`,
          reponse: repDPtf, tolerance: 0.005, unite: en ? 'years' : 'années',
          etapes: [
            {
              titre: en ? 'The duration of each line' : 'La duration de chaque ligne',
              contenu: en
                ? `Same method as in chapter 6 (time-weighted barycentre of the discounted flows): $D_A$ = **${f(r3(dA), 3)} years** for the short line, $D_B$ = **${f(r3(dB), 3)} years** for the long one. High coupon and short maturity shorten $D_A$; low coupon and long maturity stretch $D_B$.`
                : `Même méthode qu'au chapitre 6 (barycentre temporel des flux actualisés) : $D_A$ = **${f(r3(dA), 3)} années** pour la ligne courte, $D_B$ = **${f(r3(dB), 3)} années** pour la longue. Coupon élevé et maturité courte raccourcissent $D_A$ ; coupon faible et maturité longue allongent $D_B$.`,
            },
            {
              titre: en ? 'The market-value weights' : 'Les poids de marché',
              contenu: en
                ? `Line A: ${f(qA)} × ${f(repPA)} = ${eur(r2(mvA))}; line B: ${f(qB)} × ${f(repPB)} = ${eur(r2(mvB))}. Portfolio: **${eur(r2(valeur))}**, hence $w_A$ = ${pct(wApct)} and $w_B$ = ${pct(wBpct)}.`
                : `Ligne A : ${f(qA)} × ${f(repPA)} = ${eur(r2(mvA))} ; ligne B : ${f(qB)} × ${f(repPB)} = ${eur(r2(mvB))}. Portefeuille : **${eur(r2(valeur))}**, d'où $w_A$ = ${pct(wApct)} et $w_B$ = ${pct(wBpct)}.`,
            },
            {
              titre: en ? 'The weighted average' : 'La moyenne pondérée',
              contenu: en
                ? `$D_p = w_A D_A + w_B D_B$ = ${f(wApct)}% × ${f(r3(dA), 3)} + ${f(wBpct)}% × ${f(r3(dB), 3)} = **${f(repDPtf, 3)} years**. One number now sums up the rate risk of the whole book.`
                : `$D_p = w_A D_A + w_B D_B$ = ${f(wApct)} % × ${f(r3(dA), 3)} + ${f(wBpct)} % × ${f(r3(dB), 3)} = **${f(repDPtf, 3)} années**. Une seule grandeur résume désormais le risque de taux de tout le book.`,
            },
          ],
          pieges: [en
            ? `Weighting by face values instead of market values: with prices far from par, the weights — and the duration — come out wrong.`
            : `Pondérer par les nominaux au lieu des valeurs de marché : avec des prix éloignés du pair, les poids — donc la duration — sont faux.`],
        },
        {
          intitule: en ? 'd) ΔP of the portfolio for +75 bp' : 'd) Le ΔP du portefeuille pour +75 pb',
          enonce: en
            ? `Rates rise by 75 bp across the curve. Estimate the change in portfolio value, in euros (signed answer).`
            : `Les taux montent de 75 pb sur toute la courbe. Estimez la variation de valeur du portefeuille, en euros (réponse signée).`,
          reponse: repDeltaV, tolerance: 0.01, unite: '€',
          etapes: [
            {
              titre: en ? 'Convert to modified duration' : 'Convertir en duration modifiée',
              contenu: en
                ? `$D_{mod} = D_p / (1+y)$ = ${f(repDPtf, 3)} / ${f(1 + taux / 100, 4)} = **${f(r3(dModPtf), 3)}**.`
                : `$D_{mod} = D_p / (1+y)$ = ${f(repDPtf, 3)} / ${f(1 + taux / 100, 4)} = **${f(r3(dModPtf), 3)}**.`,
            },
            {
              titre: en ? 'Apply the 75bp shock' : 'Appliquer le choc de 75 pb',
              contenu: en
                ? `$\\Delta P \\approx -D_{mod} \\times \\Delta y \\times V$ = −${f(r3(dModPtf), 3)} × 0.0075 × ${f(r2(valeur))} = **${eur(repDeltaV)}**.`
                : `$\\Delta P \\approx -D_{mod} \\times \\Delta y \\times V$ = −${f(r3(dModPtf), 3)} × 0,0075 × ${f(r2(valeur))} = **${eur(repDeltaV)}**.`,
            },
            { titre: en ? 'Read the number' : 'Lire le chiffre', contenu: lectureChoc },
          ],
          pieges: [en
            ? `Using the Macaulay duration unconverted gives ${eur(r2(-dPtf * 0.0075 * valeur))} — the gap matters at portfolio scale.`
            : `Utiliser la duration de Macaulay sans la convertir donnerait ${eur(r2(-dPtf * 0.0075 * valeur))} — l'écart compte à l'échelle d'un portefeuille.`],
        },
        {
          intitule: en ? 'e) The amount to sell' : 'e) Le montant à céder',
          enonce: en
            ? `The committee sets a duration target of ${f(cible, 2)} years — ${f(reduction)} year(s) less. What amount of line B must be sold (proceeds kept in cash, zero duration) to hit the target, in euros?`
            : `Le comité fixe une duration cible de ${f(cible, 2)} années — soit ${f(reduction)} année(s) de moins. Quel montant de la ligne B faut-il céder (produit conservé en liquidités, duration nulle) pour atteindre la cible, en euros ?`,
          reponse: repVendre, tolerance: 0.01, unite: '€',
          etapes: [
            {
              titre: en ? 'Pick the line to sell' : 'Choisir la ligne à céder',
              contenu: en
                ? `Each euro of B sold removes ${f(r3(dB), 3)} euro-years of duration, against ${f(r3(dA), 3)} for A: the long line works hardest. Going through A would require ${eur(r2(aVendreA))}${clauseA} — the long line concentrates the effect where it costs the least turnover.`
                : `Chaque euro de B cédé retire ${f(r3(dB), 3)} années-euros de duration, contre ${f(r3(dA), 3)} pour A : la ligne longue travaille le plus. Passer par A exigerait ${eur(r2(aVendreA))}${clauseA} — la ligne longue concentre l'effet là où il coûte le moins de rotation.`,
            },
            {
              titre: en ? 'Size the sale' : 'Calibrer le montant',
              contenu: en
                ? `Proceeds stay in cash (zero duration), total value unchanged: $D_{new} = (V D_p - x D_B)/V$. Target ${f(cible, 2)} ⇒ $x = V \\times ${f(reduction)} / D_B$ = ${f(r2(valeur))} × ${f(reduction)} / ${f(r3(dB), 3)} = **${eur(repVendre)}**.`
                : `Le produit reste en liquidités (duration nulle), la valeur totale ne change pas : $D_{nouvelle} = (V D_p - x D_B)/V$. Cible ${f(cible, 2)} ⇒ $x = V \\times ${f(reduction)} / D_B$ = ${f(r2(valeur))} × ${f(reduction)} / ${f(r3(dB), 3)} = **${eur(repVendre)}**.`,
            },
            {
              titre: en ? 'Check' : 'Vérifier',
              contenu: en
                ? `After the sale: (${f(r2(valeur))} × ${f(repDPtf, 3)} − ${f(repVendre)} × ${f(r3(dB), 3)}) / ${f(r2(valeur))} = ${f(cible, 2)} years — the target, exactly.`
                : `Après cession : (${f(r2(valeur))} × ${f(repDPtf, 3)} − ${f(repVendre)} × ${f(r3(dB), 3)}) / ${f(r2(valeur))} = ${f(cible, 2)} années — la cible, exactement.`,
            },
          ],
          pieges: [en
            ? `Selling a pro-rata slice of the whole book also works but needs ${eur(r2(aVendreProrata))} of turnover — duration management is about WHERE you sell, not just how much.`
            : `Vendre une tranche au prorata des deux lignes marche aussi, mais demande ${eur(r2(aVendreProrata))} de cessions — piloter la duration, c'est choisir OÙ l'on vend, pas seulement combien.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 10. m4-pb-couverture-futures — N3                                   */
/* ------------------------------------------------------------------ */
const couvertureFutures: ProblemGenerator = {
  id: 'm4-pb-couverture-futures', moduleId: M4,
  titre: 'Couvrir un portefeuille avec des futures',
  titreEn: 'Hedging a portfolio with futures',
  typeDeCas: 'couverture',
  typeDeCasEn: 'hedging',
  difficulte: 3,
  scenarios: ["Desk qui aplatit son risque avant l'IPC", 'Gérant qui passe la réunion BCE couvert', 'Trésorier qui fige un portefeuille avant cession'],
  scenariosEn: ['Desk flattening its risk before the CPI print', 'Manager going into the ECB meeting hedged', 'Treasurer locking a portfolio ahead of a sale'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const mvM = pick(rng, [20, 50, 100] as const);
    const dModPtf = randFloat(rng, 3.5, 7.5, 2);
    const fPct = randFloat(rng, 96, 132, 2);
    const dModFut = randFloat(rng, 7.5, 9.5, 2);

    const mv = mvM * 1_000_000;
    const dv01Ptf = mv * dModPtf * 0.0001;
    const valeurContrat = (100_000 * fPct) / 100;
    const dv01Fut = valeurContrat * dModFut * 0.0001;
    const contrats = Math.round(dv01Ptf / dv01Fut);
    const repDv01Ptf = r2(dv01Ptf);
    const repDv01Fut = r2(dv01Fut);
    // P&L net calculé sur les DV01 AFFICHÉS : le corrigé retombe au centime sur ses propres chiffres.
    const pnl = r2((contrats * repDv01Fut - repDv01Ptf) * 40);
    const tolPnl = r2(Math.max(10, Math.abs(pnl) * 0.05));

    const { en, f, eur, pct } = outils(langue);
    const instruments = en
      ? `Portfolio: €${f(mvM)}m of market value, modified duration ${f(dModPtf)}. Hedging tool: the government-bond futures contract, €100,000 notional, quoted at ${pct(fPct)} of notional, tracking the cheapest-to-deliver bond, modified duration ${f(dModFut)}`
      : `Portefeuille : ${f(mvM)} M€ de valeur de marché, duration modifiée ${f(dModPtf)}. Instrument de couverture : le contrat à terme sur emprunt d'État, notionnel 100 000 €, coté ${pct(fPct)} du notionnel, qui réplique l'obligation la moins chère à livrer, de duration modifiée ${f(dModFut)}`;
    const contexte = (en
      ? [
        `The CPI print lands the day after tomorrow and the head of desk wants the book flat in rates by tonight. ${instruments}. Your job before the close: the two DV01s, the number of contracts, and what is left if the print moves rates 40bp.`,
        `The ECB meets on Thursday and your committee refuses to carry rate risk through the press conference. ${instruments}. You document the hedge: DV01 of the book, DV01 of one contract, contracts to sell, residual on a 40bp move.`,
        `The group will sell its bond portfolio next quarter; until then the CFO insists its value be locked. ${instruments}. You build the hedge file the auditors will read: both DV01s, the contract count, and the residual P&L on a 40bp shock.`,
      ]
      : [
        `L'IPC tombe après-demain et le head of desk veut le book plat en taux d'ici ce soir. ${instruments}. Votre travail avant la clôture : les deux DV01, le nombre de contrats, et ce qui reste si la statistique déplace les taux de 40 pb.`,
        `La BCE se réunit jeudi et votre comité refuse de porter du risque de taux pendant la conférence de presse. ${instruments}. Vous documentez la couverture : DV01 du book, DV01 d'un contrat, contrats à vendre, résidu sur un mouvement de 40 pb.`,
        `Le groupe cédera son portefeuille obligataire au prochain trimestre ; d'ici là, le directeur financier exige d'en figer la valeur. ${instruments}. Vous montez le dossier de couverture que les auditeurs liront : les deux DV01, le nombre de contrats, le P&L résiduel sur un choc de 40 pb.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The portfolio DV01' : 'a) Le DV01 du portefeuille',
          enonce: en
            ? `What is the portfolio's DV01 — the value change for a 1bp move — in euros?`
            : `Quel est le DV01 du portefeuille — la variation de valeur pour 1 pb —, en euros ?`,
          reponse: repDv01Ptf, tolerance: 0.002, unite: en ? '€/bp' : '€/pb',
          etapes: [
            {
              titre: en ? 'The desk formula' : 'La formule du desk',
              contenu: en
                ? `$DV01 = V \\times D_{mod} \\times 0.0001$ — the gain or loss per basis point. It is THE risk unit traders quote all day.`
                : `$DV01 = V \\times D_{mod} \\times 0{,}0001$ — le gain ou la perte par point de base. C'est L'unité de risque que les traders se citent toute la journée.`,
            },
            {
              titre: 'Application',
              contenu: en
                ? `€${f(mvM)}m × ${f(dModPtf)} × 0.0001 = **${eur(repDv01Ptf)}** per basis point.`
                : `${f(mvM)} M€ × ${f(dModPtf)} × 0,0001 = **${eur(repDv01Ptf)}** par point de base.`,
            },
          ],
          pieges: [en
            ? `Taking 1% instead of 1bp gives ${eur(r2(dv01Ptf * 100))} — a factor of 100, the classic units slip.`
            : `Prendre 1 % au lieu de 1 pb donne ${eur(r2(dv01Ptf * 100))} — un facteur 100, l'erreur d'unité classique.`],
        },
        {
          intitule: en ? 'b) The DV01 of one contract' : "b) Le DV01 d'un contrat",
          enonce: en ? `What is the DV01 of ONE futures contract, in euros?` : `Quel est le DV01 d'UN contrat à terme, en euros ?`,
          reponse: repDv01Fut, tolerance: 0.002, unite: en ? '€/bp' : '€/pb',
          etapes: [
            {
              titre: en ? 'The contract value' : 'La valeur du contrat',
              contenu: en
                ? `Notional × quote = 100,000 × ${pct(fPct)} = **${eur(r2(valeurContrat))}**.`
                : `Notionnel × cours = 100 000 × ${pct(fPct)} = **${eur(r2(valeurContrat))}**.`,
            },
            {
              titre: en ? 'Its DV01' : 'Son DV01',
              contenu: en
                ? `${f(r2(valeurContrat))} × ${f(dModFut)} × 0.0001 = **${eur(repDv01Fut)}** per bp — the sensitivity of the cheapest-to-deliver (CTD), the bond the contract actually tracks.`
                : `${f(r2(valeurContrat))} × ${f(dModFut)} × 0,0001 = **${eur(repDv01Fut)}** par pb — la sensibilité de la moins chère à livrer (CTD), celle que le contrat réplique réellement.`,
            },
          ],
          pieges: [en
            ? `Applying the duration to the bare notional (${eur(r2(100_000 * dModFut * 0.0001))}) ignores the quote: the contract's exposure follows its market value.`
            : `Appliquer la duration au notionnel brut (${eur(r2(100_000 * dModFut * 0.0001))}) oublie le cours : l'exposition du contrat suit sa valeur de marché.`],
        },
        {
          intitule: en ? 'c) The number of contracts to sell' : 'c) Le nombre de contrats à vendre',
          enonce: en
            ? `How many contracts must be sold to neutralise the portfolio's DV01?`
            : `Combien de contrats faut-il vendre pour neutraliser le DV01 du portefeuille ?`,
          reponse: contrats, tolerance: 0.99, toleranceMode: 'absolu', unite: en ? 'contracts' : 'contrats',
          etapes: [
            {
              titre: en ? 'Equalise the DV01s' : 'Égaliser les DV01',
              contenu: en
                ? `$N = DV01_{portfolio} / DV01_{contract}$ = ${f(repDv01Ptf)} / ${f(repDv01Fut)} = ${f(r2(dv01Ptf / dv01Fut))} — chapter 6's hedge-ratio formula.`
                : `$N = DV01_{portefeuille} / DV01_{contrat}$ = ${f(repDv01Ptf)} / ${f(repDv01Fut)} = ${f(r2(dv01Ptf / dv01Fut))} — la formule du ratio de couverture du chapitre 6.`,
            },
            {
              titre: en ? 'Round to whole contracts' : 'Arrondir au contrat entier',
              contenu: en
                ? `Only whole contracts trade: **${f(contrats)} contracts** sold. The rounding leaves a hedge residual — priced in d).`
                : `On ne traite que des contrats entiers : **${f(contrats)} contrats** à la vente. L'arrondi laisse un résidu de couverture — chiffré en d).`,
            },
          ],
        },
        {
          intitule: en ? 'd) The net P&L on +40 bp' : 'd) Le P&L net sur +40 pb',
          enonce: en
            ? `Rates rise uniformly by 40 bp. What is the net first-order P&L (portfolio + sold contracts), in euros? (signed answer)`
            : `Les taux montent uniformément de 40 pb. Quel est le P&L net au premier ordre (portefeuille + contrats vendus), en euros ? (réponse signée)`,
          reponse: pnl, tolerance: tolPnl, toleranceMode: 'absolu', unite: '€',
          etapes: [
            {
              titre: en ? 'The portfolio leg' : 'La jambe portefeuille',
              contenu: en
                ? `−${f(repDv01Ptf)} × 40 = **${eur(r2(-repDv01Ptf * 40))}**: the book bleeds its DV01 forty times over.`
                : `−${f(repDv01Ptf)} × 40 = **${eur(r2(-repDv01Ptf * 40))}** : le book perd quarante fois son DV01.`,
            },
            {
              titre: en ? 'The futures leg' : 'La jambe futures',
              contenu: en
                ? `Short ${f(contrats)} contracts, you gain as prices fall: +${f(contrats)} × ${f(repDv01Fut)} × 40 = **+${eur(r2(contrats * repDv01Fut * 40))}**.`
                : `Vendeur de ${f(contrats)} contrats, vous gagnez quand les prix baissent : +${f(contrats)} × ${f(repDv01Fut)} × 40 = **+${eur(r2(contrats * repDv01Fut * 40))}**.`,
            },
            {
              titre: en ? 'The net — an imperfect hedge, by how much' : 'Le net — une couverture imparfaite, chiffrée',
              contenu: en
                ? `Net P&L = **${eur(pnl)}**: the rounding residual of c), against a naked loss of ${eur(r2(repDv01Ptf * 40))}. The hedge wiped out ${pct(r2(100 - Math.abs(pnl) / (repDv01Ptf * 40) * 100))} of the move. What remains beyond rounding is basis risk: the contract tracks the CTD, not your exact portfolio.`
                : `P&L net = **${eur(pnl)}** : le résidu d'arrondi du c), contre une perte à nu de ${eur(r2(repDv01Ptf * 40))}. La couverture a effacé ${pct(r2(100 - Math.abs(pnl) / (repDv01Ptf * 40) * 100))} du mouvement. Ce qui reste au-delà de l'arrondi, c'est le risque de base : le contrat suit la CTD, pas exactement votre portefeuille.`,
            },
          ],
          pieges: [en
            ? `Reading the residual as a failed hedge: without it, the book loses ${eur(r2(repDv01Ptf * 40))}. A hedge is judged by what it removes, not by the crumbs it leaves.`
            : `Lire le résidu comme une couverture ratée : sans elle, le book perd ${eur(r2(repDv01Ptf * 40))}. Une couverture se juge à ce qu'elle retire, pas aux miettes qu'elle laisse.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 11. m4-pb-ytm-realise — N3                                          */
/* ------------------------------------------------------------------ */
const ytmRealise: ProblemGenerator = {
  id: 'm4-pb-ytm-realise', moduleId: M4,
  titre: 'YTM affiché, rendement réalisé',
  titreEn: 'Quoted YTM versus realised return',
  typeDeCas: 'rendement réalisé',
  typeDeCasEn: 'realised return',
  difficulte: 3,
  scenarios: ["Placement bloqué jusqu'à l'échéance", "Audit de performance d'un mandat arrivé à terme", 'Pédagogie client : le piège du réinvestissement'],
  scenariosEn: ['Buy-and-hold investment to maturity', 'Performance audit of a matured mandate', 'Client teach-in on the reinvestment trap'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const nominal = 1000;
    const n = randInt(rng, 4, 6);
    const coupon = randFloat(rng, 3.5, 6, 2);
    const y0 = randFloat(rng, 2.5, 5, 2);
    const reinvest = r2(y0 + pick(rng, [-2, -1.5, 1.5] as const));

    const c = (nominal * coupon) / 100;
    const p0 = prixObligation(nominal, coupon, n, y0);
    const facteur = ((1 + reinvest / 100) ** n - 1) / (reinvest / 100);
    const fv = c * facteur;
    const total = nominal + fv;
    const realise = ((total / p0) ** (1 / n) - 1) * 100;
    const ecartPb = r2((realise - y0) * 100);
    const repP0 = r2(p0);
    const repFv = r2(fv);
    const repRealise = r3(realise);
    const moyenneArith = r2(((total / p0 - 1) / n) * 100);

    const { en, f, eur, pct } = outils(langue);
    const titreDesc = en
      ? `a ${n}-year bond — face value ${eur(nominal)}, ${pct(coupon)} annual coupon — at the market yield of ${pct(y0)}`
      : `une obligation de maturité ${n} ans — nominal ${eur(nominal)}, coupon annuel ${pct(coupon)} — au taux de marché de ${pct(y0)}`;
    const contexte = (en
      ? [
        `You buy ${titreDesc} today, to hold to redemption. Coupons will be rolled each year at the money-market rate of the day; your central scenario: ${pct(reinvest)} throughout. Before signing, you want what this investment will REALLY return — not what the YTM column on the screen says.`,
        `A client mandate has just matured and the client disputes the performance. The file: ${titreDesc}, bought at issue, held to maturity, coupons reinvested at ${pct(reinvest)} on average over the period. The client compares the realised return with the YTM quoted at purchase — your audit must rebuild, then explain, the gap.`,
        `A client read that "the YTM is the return you will get" and wants it in writing. You build the counter-example: ${titreDesc}, held to maturity, coupons reinvested at ${pct(reinvest)}. Walking the numbers will show what the YTM promises — and what it quietly assumes.`,
      ]
      : [
        `Vous achetez aujourd'hui ${titreDesc}, pour la porter jusqu'au remboursement. Les coupons seront replacés chaque année au taux monétaire du moment ; votre scénario central : ${pct(reinvest)} sur toute la période. Avant de signer, vous voulez ce que ce placement rapportera VRAIMENT — pas ce qu'affiche la colonne YTM de l'écran.`,
        `Un mandat client vient d'arriver à échéance et le client conteste la performance. Le dossier : ${titreDesc}, achetée à l'émission, portée jusqu'au bout, coupons réinvestis à ${pct(reinvest)} en moyenne sur la période. Le client compare le rendement réalisé au YTM annoncé à l'achat — votre audit doit reconstituer, puis expliquer, l'écart.`,
        `Un client a lu que « le YTM est le rendement que vous toucherez » et en veut la démonstration. Vous construisez le contre-exemple : ${titreDesc}, portée jusqu'à l'échéance, coupons réinvestis à ${pct(reinvest)}. Dérouler les chiffres montrera ce que le YTM promet — et ce qu'il suppose sans le dire.`,
      ])[sIdx];

    const lignesCoupons = Array.from({ length: n }, (_, i) => {
      const t = i + 1;
      const valeurAcquise = c * (1 + reinvest / 100) ** (n - t);
      return en
        ? `- Year-${t} coupon: ${eur(c)} rolled for ${n - t} year(s) → ${f(c)} × (1 + ${pct(reinvest)})^${n - t} = ${eur(r2(valeurAcquise))}`
        : `- Coupon de l'année ${t} : ${eur(c)} replacé ${n - t} an(s) → ${f(c)} × (1 + ${pct(reinvest)})^${n - t} = ${eur(r2(valeurAcquise))}`;
    }).join('\n');

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The purchase price' : "a) Le prix d'achat",
          enonce: en ? `What price do you pay for the bond, in euros?` : `Quel prix payez-vous l'obligation, en euros ?`,
          reponse: repP0, tolerance: 0.002, unite: '€',
          etapes: etapesPrix(langue, nominal, coupon, n, y0),
          pieges: [en
            ? `Bought at the market yield, the bond's quoted YTM is exactly ${pct(y0)} — hold that number for question d).`
            : `Achetée au taux de marché, l'obligation affiche un YTM d'exactement ${pct(y0)} — gardez ce chiffre pour la question d).`],
        },
        {
          intitule: en ? 'b) The reinvested coupons' : 'b) Les coupons réinvestis',
          enonce: en
            ? `What is the accumulated value of all the coupons at maturity, reinvested at ${pct(reinvest)}, in euros?`
            : `Quelle est la valeur acquise de tous les coupons à l'échéance, réinvestis à ${pct(reinvest)}, en euros ?`,
          reponse: repFv, tolerance: 0.005, unite: '€',
          etapes: [
            {
              titre: en ? 'Each coupon works until maturity' : "Chaque coupon travaille jusqu'à l'échéance",
              contenu: lignesCoupons,
            },
            {
              titre: en ? 'Sum — or use the annuity formula' : 'Sommer — ou utiliser la formule de la rente',
              contenu: en
                ? `$FV = C \\times \\frac{(1+r)^n - 1}{r}$ = ${f(c)} × ${f(facteur, 4)} = **${eur(repFv)}**.`
                : `$FV = C \\times \\frac{(1+r)^n - 1}{r}$ = ${f(c)} × ${f(facteur, 4)} = **${eur(repFv)}**.`,
            },
          ],
          pieges: [en
            ? `Compounding the final coupon one year too many gives ${eur(r2(fv * (1 + reinvest / 100)))}: the year-${n} coupon lands on redemption day — it never gets reinvested.`
            : `Capitaliser le dernier coupon une année de trop donne ${eur(r2(fv * (1 + reinvest / 100)))} : le coupon de l'année ${n} tombe le jour du remboursement — il n'est jamais replacé.`],
        },
        {
          intitule: en ? 'c) The realised annual return' : 'c) Le rendement annualisé réalisé',
          enonce: en
            ? `What annualised return did the investment actually deliver, in %?`
            : `Quel rendement annualisé le placement a-t-il réellement servi, en % ?`,
          reponse: repRealise, tolerance: 0.005, unite: '%',
          etapes: [
            {
              titre: en ? 'The final wealth' : 'La richesse finale',
              contenu: en
                ? `Face value redeemed + compounded coupons: ${f(nominal)} + ${f(repFv)} = **${eur(r2(total))}**.`
                : `Nominal remboursé + coupons capitalisés : ${f(nominal)} + ${f(repFv)} = **${eur(r2(total))}**.`,
            },
            {
              titre: en ? 'Annualise geometrically' : 'Annualiser géométriquement',
              contenu: en
                ? `$r_{realised} = (W_n / P_0)^{1/n} - 1$ = (${f(r2(total))} / ${f(repP0)})^{1/${n}} − 1 = **${pct(repRealise, 3)}** per year.`
                : `$r_{réalisé} = (W_n / P_0)^{1/n} - 1$ = (${f(r2(total))} / ${f(repP0)})^{1/${n}} − 1 = **${pct(repRealise, 3)}** par an.`,
            },
          ],
          pieges: [en
            ? `The arithmetic shortcut ((${f(r2(total))}/${f(repP0)} − 1)/${n}) = ${pct(moyenneArith)} ignores compounding — returns annualise geometrically, never by simple division.`
            : `Le raccourci arithmétique ((${f(r2(total))}/${f(repP0)} − 1)/${n}) = ${pct(moyenneArith)} ignore la capitalisation — un rendement s'annualise géométriquement, jamais par simple division.`],
        },
        {
          intitule: en ? 'd) The gap to the initial YTM' : "d) L'écart au YTM initial",
          enonce: en
            ? `By how many basis points does the realised return differ from the YTM at purchase? (signed answer: below the YTM is negative)`
            : `De combien de points de base le rendement réalisé s'écarte-t-il du YTM à l'achat ? (réponse signée : en dessous du YTM, l'écart est négatif)`,
          reponse: ecartPb, tolerance: 1, toleranceMode: 'absolu', unite: en ? 'bp' : 'pb',
          etapes: [
            {
              titre: en ? 'What the YTM assumed' : 'Ce que le YTM supposait',
              contenu: en
                ? `Bought at the market yield, the bond promised a YTM of ${pct(y0)} — under the assumption, never printed in bold, that every coupon would be reinvested AT ${pct(y0)}. Here they were rolled at ${pct(reinvest)}.`
                : `Achetée au taux de marché, l'obligation promettait un YTM de ${pct(y0)} — sous l'hypothèse, jamais écrite en gras, que chaque coupon serait réinvesti À ${pct(y0)}. Ils l'ont été à ${pct(reinvest)}.`,
            },
            {
              titre: en ? 'The gap, in basis points' : "L'écart, en points de base",
              contenu: en
                ? `${f(repRealise, 3)} − ${f(y0)} = ${f(r3(realise - y0), 3)} point, i.e. **${f(ecartPb)} bp** ${reinvest < y0 ? `lost to reinvesting below the YTM. The promise was conditional — the condition failed.` : `gained from reinvesting above the YTM. The "trap" cuts both ways — it is an assumption, not a ceiling.`} The only bond whose YTM is truly locked in is the zero-coupon: it has nothing to reinvest.`
                : `${f(repRealise, 3)} − ${f(y0)} = ${f(r3(realise - y0), 3)} point, soit **${f(ecartPb)} pb** ${reinvest < y0 ? `perdus à réinvestir sous le YTM. La promesse était conditionnelle — la condition n'a pas tenu.` : `gagnés à réinvestir au-dessus du YTM. Le « piège » joue dans les deux sens — c'est une hypothèse, pas un plafond.`} La seule obligation dont le YTM est réellement verrouillé est le zéro-coupon : il n'a rien à réinvestir.`,
            },
          ],
          pieges: [en
            ? `Treating the YTM as guaranteed: it is the bond's internal rate of return IF held to maturity AND reinvested at that same rate — two assumptions, not one.`
            : `Tenir le YTM pour garanti : c'est le taux de rendement interne du titre SI on le porte à l'échéance ET si l'on réinvestit à ce même taux — deux hypothèses, pas une.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 12. m4-pb-obligation-indexee — N3                                   */
/* ------------------------------------------------------------------ */
const obligationIndexee: ProblemGenerator = {
  id: 'm4-pb-obligation-indexee', moduleId: M4,
  titre: "L'obligation indexée sur l'inflation",
  titreEn: 'The inflation-linked bond',
  typeDeCas: 'inflation',
  typeDeCasEn: 'inflation linkers',
  difficulte: 3,
  scenarios: ["Souscription d'une OATi pour un client", 'Épargnant rattrapé par l\'inflation', 'Gérant « rendement réel » devant son comité'],
  scenariosEn: ['Pitching an OATi to a client', 'Saver outpaced by inflation', 'Real-return manager facing the committee'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const nominal = 1000;
    const couponReel = randFloat(rng, 0.5, 1.8, 2);
    const n = randInt(rng, 4, 8);
    const infl = randFloat(rng, 1.6, 3.2, 2);
    const yReel = randFloat(rng, 0.4, 1.6, 2);
    const yNom = r2(yReel + randFloat(rng, 1.5, 2.6, 2));

    const coef = (1 + infl / 100) ** n;
    const nominalIndexe = nominal * coef;
    const couponN = (nominalIndexe * couponReel) / 100;
    const breakeven = ((1 + yNom / 100) / (1 + yReel / 100) - 1) * 100;
    const approx = r2(yNom - yReel);
    const repCouponN = r2(couponN);
    const repNominalIndexe = r2(nominalIndexe);
    const repBreakeven = r3(breakeven);

    const { en, f, eur, pct } = outils(langue);
    const titreDesc = en
      ? `an OATi: initial face value ${eur(nominal)}, ${pct(couponReel)} real coupon, ${pct(yReel)} real yield at purchase, ${n}-year maturity; the conventional OAT of the same maturity yields ${pct(yNom)}`
      : `une OATi : nominal initial ${eur(nominal)}, coupon réel ${pct(couponReel)}, rendement réel à l'achat ${pct(yReel)}, maturité ${n} ans ; l'OAT nominale de même maturité rend ${pct(yNom)}`;
    const contexte = (en
      ? [
        `You pitch a client ${titreDesc}. The client hesitates: "the real coupon looks tiny". To settle it, you price what the linker actually pays if inflation runs at ${pct(infl)} a year — then the inflation level that makes both bonds equivalent.`,
        `Your savings account has stopped keeping up with prices and you are looking at ${titreDesc}. Before switching, you want to see, in euros, what ${pct(infl)} annual inflation would do to the linker's cash flows — and above which inflation it beats the conventional bond.`,
        `Before the allocation committee, you defend a real-return pocket built on ${titreDesc}. The committee wants hard numbers: the cash flows under ${pct(infl)} inflation, and the breakeven that splits the linker from the nominal bond.`,
      ]
      : [
        `Vous proposez à un client ${titreDesc}. Le client hésite : « le coupon réel a l'air minuscule ». Pour trancher, vous chiffrez ce que l'indexée verse réellement si l'inflation s'installe à ${pct(infl)} par an — puis le niveau d'inflation qui rend les deux titres équivalents.`,
        `Votre livret ne suit plus les prix et vous regardez ${titreDesc}. Avant d'arbitrer, vous voulez voir, en euros, ce que ${pct(infl)} d'inflation annuelle ferait aux flux de l'indexée — et au-delà de quelle inflation elle bat la nominale.`,
        `Devant le comité d'allocation, vous défendez une poche « rendement réel » construite sur ${titreDesc}. Le comité veut du concret : les flux sous ${pct(infl)} d'inflation, et le point mort qui départage l'indexée et la nominale.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? `a) The year-${n} coupon` : `a) Le coupon de l'année ${n}`,
          enonce: en
            ? `If inflation runs at ${pct(infl)} a year, what coupon (in euros) does the OATi pay in year ${n}?`
            : `Si l'inflation s'établit à ${pct(infl)} par an, quel coupon (en euros) l'OATi verse-t-elle l'année ${n} ?`,
          reponse: repCouponN, tolerance: 0.005, unite: '€',
          etapes: [
            {
              titre: en ? 'The face value indexes first' : "Le nominal s'indexe d'abord",
              contenu: en
                ? `Indexed face value = ${f(nominal)} × (1 + ${pct(infl)})^${n} = ${f(nominal)} × ${f(coef, 4)} = **${eur(repNominalIndexe)}**.`
                : `Nominal indexé = ${f(nominal)} × (1 + ${pct(infl)})^${n} = ${f(nominal)} × ${f(coef, 4)} = **${eur(repNominalIndexe)}**.`,
            },
            {
              titre: en ? 'The real coupon applies to the indexed face' : "Le coupon réel s'applique au nominal indexé",
              contenu: en
                ? `${f(repNominalIndexe)} × ${pct(couponReel)} = **${eur(repCouponN)}**. The coupon RATE never moves: it is the base that tracks prices — that is the whole design of a linker.`
                : `${f(repNominalIndexe)} × ${pct(couponReel)} = **${eur(repCouponN)}**. Le TAUX du coupon ne bouge jamais : c'est l'assiette qui suit les prix — toute la mécanique d'une indexée tient là.`,
            },
          ],
          pieges: [en
            ? `Applying the real coupon to the initial face value, ${eur(r2((nominal * couponReel) / 100))} forever: that is a conventional bond — precisely what an OATi is not.`
            : `Appliquer le coupon réel au nominal initial, soit ${eur(r2((nominal * couponReel) / 100))} pour toujours : c'est une obligation classique — précisément ce qu'une OATi n'est pas.`],
        },
        {
          intitule: en ? 'b) The redeemed face value' : 'b) Le nominal remboursé',
          enonce: en
            ? `After those ${n} years of inflation, what face value does the OATi redeem, in euros?`
            : `Après ces ${n} années d'inflation, quel nominal l'OATi rembourse-t-elle, en euros ?`,
          reponse: repNominalIndexe, tolerance: 0.002, unite: '€',
          etapes: [
            {
              titre: en ? 'The indexation coefficient' : "Le coefficient d'indexation",
              contenu: en
                ? `Redemption = ${f(nominal)} × (1 + ${pct(infl)})^${n} = **${eur(repNominalIndexe)}**: the principal itself has kept its purchasing power, coupon after coupon and at redemption.`
                : `Remboursement = ${f(nominal)} × (1 + ${pct(infl)})^${n} = **${eur(repNominalIndexe)}** : le capital lui-même a conservé son pouvoir d'achat, coupon après coupon et au remboursement.`,
            },
            {
              titre: en ? 'The par floor' : 'Le plancher au pair',
              contenu: en
                ? `Had prices FALLEN over the period, the OATi would still redeem ${eur(nominal)}: redemption is floored at par — a free option against deflation, written into the bond's terms.`
                : `Si les prix avaient BAISSÉ sur la période, l'OATi aurait tout de même remboursé ${eur(nominal)} : le remboursement est planché au pair — une option gratuite contre la déflation, inscrite dans le contrat d'émission.`,
            },
          ],
        },
        {
          intitule: en ? 'c) The breakeven inflation rate' : "c) Le point mort d'inflation",
          enonce: en
            ? `The conventional OAT yields ${pct(yNom)}; the OATi offers ${pct(yReel)} real. What average annual inflation (in %) makes the two investments equivalent (the breakeven)?`
            : `L'OAT nominale rend ${pct(yNom)} ; l'OATi offre ${pct(yReel)} réel. Quelle inflation annuelle moyenne (en %) rend les deux placements équivalents (le point mort, ou breakeven) ?`,
          reponse: repBreakeven, tolerance: 0.005, unite: '%',
          etapes: [
            {
              titre: en ? 'Set up the equivalence (Fisher)' : "Poser l'équivalence (relation de Fisher)",
              contenu: en
                ? `The linker compounds the real rate AND inflation; the nominal bond compounds its quoted rate. Equivalence: $(1 + ${f(yReel)}\\%) \\times (1 + \\pi^*) = 1 + ${f(yNom)}\\%$.`
                : `L'indexée capitalise le taux réel ET l'inflation ; la nominale capitalise son taux facial. Équivalence : $(1 + ${f(yReel)}\\,\\%) \\times (1 + \\pi^*) = 1 + ${f(yNom)}\\,\\%$.`,
            },
            {
              titre: en ? 'Solve' : 'Résoudre',
              contenu: en
                ? `$\\pi^*$ = ${f(1 + yNom / 100, 4)} / ${f(1 + yReel / 100, 4)} − 1 = **${pct(repBreakeven, 3)}**.`
                : `$\\pi^*$ = ${f(1 + yNom / 100, 4)} / ${f(1 + yReel / 100, 4)} − 1 = **${pct(repBreakeven, 3)}**.`,
            },
            {
              titre: en ? 'Read the breakeven' : 'Lire le point mort',
              contenu: en
                ? `Realised inflation above ${pct(repBreakeven, 3)}: the linker wins; below: the nominal bond. ${infl > breakeven ? `Your ${pct(infl)} scenario sits ABOVE the breakeven — the linker carries the day.` : `Your ${pct(infl)} scenario stays BELOW the breakeven — the nominal bond keeps the edge.`} Markets quote this number live: it is the bond market's own inflation forecast — a break-even, not a promise.`
                : `Inflation réalisée au-dessus de ${pct(repBreakeven, 3)} : l'indexée gagne ; en dessous : la nominale. ${infl > breakeven ? `Votre scénario de ${pct(infl)} est AU-DESSUS du point mort — l'indexée l'emporte.` : `Votre scénario de ${pct(infl)} reste SOUS le point mort — la nominale garde l'avantage.`} Le marché cote ce chiffre en continu : c'est sa propre prévision d'inflation — un point mort, pas une promesse.`,
            },
          ],
          pieges: [en
            ? `The shortcut "nominal minus real" gives ${pct(approx)}, off by ${f(Math.abs(r2((approx - breakeven) * 100)))} bp from the exact breakeven: fine for a ballpark, not for pricing.`
            : `Le raccourci « nominal moins réel » donne ${pct(approx)}, à ${f(Math.abs(r2((approx - breakeven) * 100)))} pb du point mort exact : bon pour un ordre de grandeur, pas pour un pricing.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 13. m4-pb-repo-financement — N3                                     */
/* ------------------------------------------------------------------ */
const repoFinancement: ProblemGenerator = {
  id: 'm4-pb-repo-financement', moduleId: M4,
  titre: 'Financer une position en repo',
  titreEn: 'Funding a position in repo',
  typeDeCas: 'financement',
  typeDeCasEn: 'funding',
  difficulte: 3,
  scenarios: ['Desk qui finance une position avec levier', 'Trésorerie titres qui met l\'inventaire au travail', "Prime broker qui chiffre le financement d'un client"],
  scenariosEn: ['Leveraged desk funding a position', 'Securities treasury putting the inventory to work', "Prime broker pricing a client's funding"],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const faceM = pick(rng, [5, 10, 20] as const);
    const prixPct = randFloat(rng, 97, 105, 2);
    const haircut = pick(rng, [1, 2, 3, 5] as const);
    const tauxRepo = randFloat(rng, 1.8, 3.6, 2);
    const jours = pick(rng, [30, 60, 90] as const);
    const couponPct = randFloat(rng, 2.5, 5.5, 2);

    const faceEur = faceM * 1_000_000;
    const mv = (faceEur * prixPct) / 100;
    const cash = mv * (1 - haircut / 100);
    const cout = interetMonetaire(cash, tauxRepo, jours);
    const couru = couponCouru(couponPct, faceEur, jours, 365);
    const carry = couru - cout;
    const seuil = ((couru / cash) * 360 * 100) / jours;
    const repCash = r2(cash);
    const repCout = r2(cout);
    const repCarry = r2(carry);
    const repSeuil = r3(seuil);

    const { en, f, eur, pct } = outils(langue);
    const termes = en
      ? `€${f(faceM)}m face value of an OAT, valued (accrued included) at ${pct(prixPct)} of par, repoed out over ${jours} days at ${pct(tauxRepo)} (Actual/360) with a ${pct(haircut, 0)} haircut; the bond carries a ${pct(couponPct)} coupon, accruing Actual/365 on face value`
      : `${f(faceM)} M€ de nominal d'une OAT, valorisée (coupon couru compris) à ${pct(prixPct)} du nominal, mise en pension sur ${jours} jours au taux repo de ${pct(tauxRepo)} (Exact/360) avec un haircut de ${pct(haircut, 0)} ; le titre porte un coupon de ${pct(couponPct)}, couru en Exact/365 sur le nominal`;
    const contexte = (en
      ? [
        `Your desk just bought the position and has no intention of tying up the cash: ${termes}. The carry arithmetic — what the repo costs against what the bond earns while you hold it — will decide how big the position gets.`,
        `At the securities treasury, the inventory must not sit idle: ${termes}. Before the trade ticket goes out, the desk wants the full arithmetic: cash raised, funding cost, net carry, and the repo level where the trade stops paying.`,
        `As a prime broker, you quote a hedge fund the funding of its new position: ${termes}. The client wants two numbers before noon: the net carry over the period, and the repo rate that would kill it.`,
      ]
      : [
        `Votre desk vient d'acheter la position et n'entend pas immobiliser le cash : ${termes}. L'arithmétique du carry — ce que coûte le repo contre ce que rapporte le titre pendant qu'on le porte — décidera de la taille de la position.`,
        `À la trésorerie titres, l'inventaire ne doit pas dormir : ${termes}. Avant d'envoyer le ticket, le desk veut l'arithmétique complète : cash levé, coût du financement, carry net, et le niveau de repo où l'opération cesse de payer.`,
        `Prime broker, vous cotez à un hedge fund le financement de sa nouvelle position : ${termes}. Le client veut deux chiffres avant midi : le carry net sur la période, et le taux repo qui le tuerait.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The cash raised' : 'a) Le cash levé',
          enonce: en
            ? `How much cash does the repo raise, in euros?`
            : `Quel montant de cash la mise en pension permet-elle de lever, en euros ?`,
          reponse: repCash, tolerance: 0.002, unite: '€',
          etapes: [
            {
              titre: en ? 'The collateral value' : 'La valeur du collatéral',
              contenu: en
                ? `€${f(faceM)}m × ${pct(prixPct)} = **${eur(r2(mv))}** of market value pledged.`
                : `${f(faceM)} M€ × ${pct(prixPct)} = **${eur(r2(mv))}** de valeur de marché apportée en garantie.`,
            },
            {
              titre: en ? 'The haircut' : 'Le haircut',
              contenu: en
                ? `The cash lender never funds 100% of the collateral: cash = ${f(r2(mv))} × (1 − ${pct(haircut, 0)}) = **${eur(repCash)}**. The haircut is the lender's cushion if the bond drops during the repo.`
                : `Le prêteur de cash ne finance jamais 100 % du collatéral : cash = ${f(r2(mv))} × (1 − ${pct(haircut, 0)}) = **${eur(repCash)}**. Le haircut est son coussin de sécurité si le titre baisse pendant la pension.`,
            },
          ],
          pieges: [en
            ? `Forgetting the haircut (${eur(r2(mv))}) — or applying it to face value instead of market value (${eur(r2(faceEur * (1 - haircut / 100)))}).`
            : `Oublier le haircut (${eur(r2(mv))}) — ou l'appliquer au nominal plutôt qu'à la valeur de marché (${eur(r2(faceEur * (1 - haircut / 100)))}).`],
        },
        {
          intitule: en ? 'b) The funding cost' : 'b) Le coût du financement',
          enonce: en
            ? `What does the funding cost over the ${jours} days, in euros?`
            : `Que coûte le financement sur les ${jours} jours, en euros ?`,
          reponse: repCout, tolerance: 0.005, unite: '€',
          etapes: [
            {
              titre: en ? 'The money-market convention' : 'La convention monétaire',
              contenu: en
                ? `Repo interest accrues Actual/360 — the money-market base: interest = cash × rate × days/360.`
                : `L'intérêt du repo court en Exact/360 — la base du marché monétaire : intérêt = cash × taux × jours/360.`,
            },
            {
              titre: 'Application',
              contenu: en
                ? `${f(repCash)} × ${pct(tauxRepo)} × ${jours}/360 = **${eur(repCout)}**.`
                : `${f(repCash)} × ${pct(tauxRepo)} × ${jours}/360 = **${eur(repCout)}**.`,
            },
          ],
          pieges: [en
            ? `A 365-day base gives ${eur(r2(interetMonetaire(cash, tauxRepo, jours, 365)))}: repo counts in Actual/360, like everything on the money market.`
            : `Une base 365 donnerait ${eur(r2(interetMonetaire(cash, tauxRepo, jours, 365)))} : la pension se compte en Exact/360, comme tout le marché monétaire.`],
        },
        {
          intitule: en ? 'c) The net carry' : 'c) Le carry net',
          enonce: en
            ? `During the repo, the accrued coupon keeps belonging to you. What is the position's net carry over the period (accrued earned − repo cost), in euros? (signed answer)`
            : `Pendant la pension, le coupon couru continue de vous appartenir. Quel est le carry net de la position sur la période (couru gagné − coût du repo), en euros ? (réponse signée)`,
          reponse: repCarry, tolerance: 0.005, unite: '€',
          etapes: [
            {
              titre: en ? 'The accrued you earn' : 'Le couru que vous gagnez',
              contenu: en
                ? `€${f(faceM)}m × ${pct(couponPct)} × ${jours}/365 = **${eur(r2(couru))}** — you remain the economic owner of the bond: the accrued is yours.`
                : `${f(faceM)} M€ × ${pct(couponPct)} × ${jours}/365 = **${eur(r2(couru))}** — vous restez le propriétaire économique du titre : le couru vous revient.`,
            },
            {
              titre: en ? 'The carry' : 'Le carry',
              contenu: en
                ? `${f(r2(couru))} − ${f(repCout)} = **${eur(repCarry)}**. ${carry >= 0 ? `Positive carry: the position funds itself — the trade "pays you to wait", as long as nothing moves.` : `Negative carry: every day of holding costs money — the price has to move your way to justify the position.`}`
                : `${f(r2(couru))} − ${f(repCout)} = **${eur(repCarry)}**. ${carry >= 0 ? `Carry positif : la position se finance toute seule — l'opération « vous paie pour attendre », tant que rien ne bouge.` : `Carry négatif : chaque jour de portage coûte — il faut que le prix aille dans votre sens pour justifier la position.`}`,
            },
          ],
          pieges: [en
            ? `Accruing the coupon on the market value (${eur(r2(couponCouru(couponPct, mv, jours, 365)))}): coupons run on FACE value, whatever the price does.`
            : `Faire courir le coupon sur la valeur de marché (${eur(r2(couponCouru(couponPct, mv, jours, 365)))}) : le coupon court sur le NOMINAL, quoi que fasse le prix.`],
        },
        {
          intitule: en ? 'd) The break-even repo rate' : 'd) Le taux repo qui annule le carry',
          enonce: en
            ? `At what repo rate (in %) does the period's carry become exactly zero?`
            : `À quel taux repo (en %) le carry de la période devient-il exactement nul ?`,
          reponse: repSeuil, tolerance: 0.005, unite: '%',
          etapes: [
            {
              titre: en ? 'Set cost equal to accrued' : 'Égaliser coût et couru',
              contenu: en
                ? `Cost = accrued: ${f(repCash)} × r* × ${jours}/360 = ${f(r2(couru))}.`
                : `Coût = couru : ${f(repCash)} × r* × ${jours}/360 = ${f(r2(couru))}.`,
            },
            {
              titre: en ? 'Solve' : 'Résoudre',
              contenu: en
                ? `r* = ${f(r2(couru))} × 360 / (${f(repCash)} × ${jours}) = **${pct(repSeuil, 3)}**. ${seuil > tauxRepo ? `Current cushion: ${f(r2((seuil - tauxRepo) * 100))} bp of repo-rate rise before the carry dies.` : `The current rate (${pct(tauxRepo)}) already sits above this threshold: the carry is negative from day one.`} This is the arithmetic the desk reruns at every repo fixing — and why a bond that funds far below the GC rate is called "special": everyone wants to borrow it.`
                : `r* = ${f(r2(couru))} × 360 / (${f(repCash)} × ${jours}) = **${pct(repSeuil, 3)}**. ${seuil > tauxRepo ? `Marge actuelle : ${f(r2((seuil - tauxRepo) * 100))} pb de hausse du repo avant que le carry ne meure.` : `Le taux actuel (${pct(tauxRepo)}) dépasse déjà ce seuil : le carry est négatif dès le premier jour.`} C'est l'arithmétique que le desk refait à chaque fixing du repo — et la raison pour laquelle un titre qui se finance loin sous le taux GC est dit « spécial » : tout le monde veut l'emprunter.`,
            },
          ],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 14. m4-pb-immunisation — N4, boss 1                                 */
/* Le « problème de niveau 4 » promis à la fin du chapitre 6.          */
/* ------------------------------------------------------------------ */
const immunisation: ProblemGenerator = {
  id: 'm4-pb-immunisation', moduleId: M4,
  titre: 'Immuniser un passif unique',
  titreEn: 'Immunising a single liability',
  typeDeCas: 'immunisation',
  typeDeCasEn: 'liability immunisation',
  difficulte: 4,
  scenarios: ['Assureur-vie qui adosse une prestation certaine', 'Fonds de pension qui sécurise une échéance', 'Mandat dédié à passif unique'],
  scenariosEn: ['Life insurer backing a known payout', 'Pension fund locking in a future payment', 'Dedicated single-liability mandate'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const h = randInt(rng, 5, 9);
    const taux = randFloat(rng, 2, 4, 2);
    const passifM = pick(rng, [2, 5, 8, 10] as const);
    const n1 = h - randInt(rng, 2, 3);
    const coupon1 = randFloat(rng, 3.5, 6, 2);
    const n2 = h + randInt(rng, 3, 5);
    const coupon2 = randFloat(rng, 1.5, 3, 2);

    const passifEur = passifM * 1_000_000;
    const vaPassif = va(passifEur, taux, h);
    const d1 = durationMacaulay(1000, coupon1, n1, taux);
    const d2 = durationMacaulay(1000, coupon2, n2, taux);
    const w = (d2 - h) / (d2 - d1);
    const montant1 = w * vaPassif;
    const montant2 = vaPassif - montant1;
    // Vérification à ±100 pb par revalorisation exacte.
    const p1Ini = prixObligation(1000, coupon1, n1, taux);
    const p2Ini = prixObligation(1000, coupon2, n2, taux);
    const tauxUp = r2(taux + 1);
    const tauxDown = r2(taux - 1);
    const ratio1Up = prixObligation(1000, coupon1, n1, tauxUp) / p1Ini;
    const ratio2Up = prixObligation(1000, coupon2, n2, tauxUp) / p2Ini;
    const actifUp = montant1 * ratio1Up + montant2 * ratio2Up;
    const passifUp = va(passifEur, tauxUp, h);
    const ecartUp = actifUp - passifUp;
    const actifDown = montant1 * (prixObligation(1000, coupon1, n1, tauxDown) / p1Ini)
      + montant2 * (prixObligation(1000, coupon2, n2, tauxDown) / p2Ini);
    const ecartDown = actifDown - va(passifEur, tauxDown, h);
    const repVaPassif = r2(vaPassif);
    const repW = r2(w * 100);
    const repMontant1 = r2(montant1);
    const repEcart = r2(ecartUp);
    const tolEcart = r2(Math.max(25, ecartUp * 0.08));

    const { en, f, eur, pct } = outils(langue);
    const marche = en
      ? `The curve is flat at ${pct(taux)}. Two bonds are available to back it: bond 1 (${pct(coupon1)} coupon, ${n1}-year maturity) and bond 2 (${pct(coupon2)} coupon, ${n2}-year maturity), both with a €1,000 face value, both priced at the market yield`
      : `La courbe est plate à ${pct(taux)}. Deux obligations sont disponibles pour l'adosser : l'obligation 1 (coupon ${pct(coupon1)}, maturité ${n1} ans) et l'obligation 2 (coupon ${pct(coupon2)}, maturité ${n2} ans), toutes deux de nominal 1 000 €, toutes deux cotées au taux de marché`;
    const contexte = (en
      ? [
        `As a life insurer, you owe a certain payout of €${f(passifM)}m in ${h} years — a single liability, no uncertainty. ${marche}. The ALM committee's brief: build a portfolio that pays the claim WHATEVER rates do — the immunisation promised at the end of chapter 6, now for real.`,
        `Your pension fund must pay out €${f(passifM)}m in ${h} years for a retirement wave already locked in. ${marche}. The board does not want a speech about prudence: it wants the construction, number by number, and a stress test at the end.`,
        `Your asset-management firm wins a dedicated mandate: secure €${f(passifM)}m payable in ${h} years, directional bets forbidden. ${marche}. The client's consultant will check every figure — including how the portfolio behaves if rates jump 100bp the day after funding.`,
      ]
      : [
        `Assureur-vie, vous devez verser une prestation certaine de ${f(passifM)} M€ dans ${h} ans — un passif unique, sans aléa. ${marche}. La commande du comité ALM : construire un portefeuille qui paie la prestation QUOI QUE FASSENT les taux — l'immunisation promise à la fin du chapitre 6, en vrai cette fois.`,
        `Votre fonds de pension doit sortir ${f(passifM)} M€ dans ${h} ans pour une vague de départs déjà actée. ${marche}. Le conseil ne veut pas un discours sur la prudence : il veut la construction, chiffre par chiffre, et un test de résistance à la fin.`,
        `Votre société de gestion remporte un mandat dédié : sécuriser ${f(passifM)} M€ payables dans ${h} ans, pari directionnel interdit. ${marche}. Le consultant du client vérifiera chaque chiffre — y compris le comportement du portefeuille si les taux sautent de 100 pb au lendemain de la mise en place.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) Present value of the liability' : 'a) La valeur actuelle du passif',
          enonce: en
            ? `What is the present value of the liability, in euros?`
            : `Quelle est la valeur actuelle du passif, en euros ?`,
          reponse: repVaPassif, tolerance: 0.002, unite: '€',
          etapes: [{
            titre: en ? 'A single flow to discount' : 'Un seul flux à actualiser',
            contenu: en
              ? `$VA$ = €${f(passifM)}m / (1 + ${pct(taux)})^${h} = **${eur(repVaPassif)}**. This is the envelope to invest today — the whole immunisation is built on it.`
              : `$VA$ = ${f(passifM)} M€ / (1 + ${pct(taux)})^${h} = **${eur(repVaPassif)}**. C'est l'enveloppe à investir aujourd'hui — toute l'immunisation se construit dessus.`,
          }],
          pieges: [en
            ? `Backing the face amount (€${f(passifM)}m) instead of its present value: ${eur(r2(passifEur - vaPassif))} would be invested for nothing.`
            : `Adosser le montant facial (${f(passifM)} M€) au lieu de sa valeur actuelle : ${eur(r2(passifEur - vaPassif))} seraient investis pour rien.`],
        },
        {
          intitule: en ? 'b) Duration of the liability' : 'b) La duration du passif',
          enonce: en
            ? `What is the liability's duration, in years?`
            : `Quelle est la duration du passif, en années ?`,
          reponse: h, tolerance: 0.005, unite: en ? 'years' : 'années',
          etapes: [
            {
              titre: en ? 'The liability is a zero-coupon' : 'Le passif est un zéro-coupon',
              contenu: en
                ? `A single flow in ${h} years: its time-weighted barycentre is… ${h} years. $D_{liability}$ = **${h} years**, no computation needed — the zero-coupon is the one case where duration IS maturity.`
                : `Un flux unique dans ${h} ans : son barycentre temporel est… ${h} ans. $D_{passif}$ = **${h} ans**, sans aucun calcul — le zéro-coupon est le seul cas où la duration EST la maturité.`,
            },
            {
              titre: en ? 'Why this number drives everything' : 'Pourquoi cette grandeur pilote tout',
              contenu: en
                ? `Immunising = matching the asset's PRESENT VALUE and DURATION to the liability's. With a flat curve, matching Macaulay or modified durations is the same thing: everything divides by the same (1 + y).`
                : `Immuniser = égaliser la VALEUR ACTUELLE et la DURATION de l'actif sur celles du passif. À courbe plate, caler les durations de Macaulay ou les durations modifiées revient au même : tout se divise par le même (1 + y).`,
            },
          ],
        },
        {
          intitule: en ? 'c) The weight of bond 1' : "c) Le poids de l'obligation 1",
          enonce: en
            ? `Your prep work gives D1 = ${f(r3(d1), 3)} years for bond 1 and D2 = ${f(r3(d2), 3)} years for bond 2. What weight w (in % of the assets) must bond 1 carry so that the asset duration equals the liability's?`
            : `Vos calculs préalables donnent D1 = ${f(r3(d1), 3)} ans pour l'obligation 1 et D2 = ${f(r3(d2), 3)} ans pour l'obligation 2. Quel poids w (en % de l'actif) faut-il donner à l'obligation 1 pour que la duration de l'actif égale celle du passif ?`,
          reponse: repW, tolerance: 0.005, unite: '%',
          etapes: [
            {
              titre: en ? 'Set up the 2×2 system' : 'Poser le système 2×2',
              contenu: en
                ? `Two constraints, two unknowns — the amounts $M_1$ and $M_2$: (i) $M_1 + M_2 = VA_{liability}$ (the envelope from a)); (ii) $w D_1 + (1-w) D_2 = H$ with $w = M_1/VA$, because a portfolio's duration is the market-value-weighted average of its lines (chapter 6).`
                : `Deux contraintes, deux inconnues — les montants $M_1$ et $M_2$ : (i) $M_1 + M_2 = VA_{passif}$ (l'enveloppe du a)) ; (ii) $w D_1 + (1-w) D_2 = H$ avec $w = M_1/VA$, car la duration d'un portefeuille est la moyenne de celles de ses lignes pondérée par les valeurs de marché (chapitre 6).`,
            },
            {
              titre: en ? 'Solve the duration constraint' : 'Résoudre la contrainte de duration',
              contenu: en
                ? `w × ${f(r3(d1), 3)} + (1 − w) × ${f(r3(d2), 3)} = ${h} ⟹ $w = \\frac{D_2 - H}{D_2 - D_1}$ = (${f(r3(d2), 3)} − ${h}) / (${f(r3(d2), 3)} − ${f(r3(d1), 3)}) = **${pct(repW)}**.`
                : `w × ${f(r3(d1), 3)} + (1 − w) × ${f(r3(d2), 3)} = ${h} ⟹ $w = \\frac{D_2 - H}{D_2 - D_1}$ = (${f(r3(d2), 3)} − ${h}) / (${f(r3(d2), 3)} − ${f(r3(d1), 3)}) = **${pct(repW)}**.`,
            },
            {
              titre: en ? 'Why the bracketing matters' : "Pourquoi l'encadrement compte",
              contenu: en
                ? `${pct(repW)} on the short bond, ${pct(r2(100 - w * 100))} on the long one. Both weights are positive precisely because H = ${h} years sits BETWEEN D1 and D2: with two bonds on the same side of H, no long-only combination could hit the target.`
                : `${pct(repW)} sur la courte, ${pct(r2(100 - w * 100))} sur la longue. Les deux poids sont positifs précisément parce que H = ${h} ans est ENTRE D1 et D2 : avec deux titres du même côté de H, aucune combinaison sans vente à découvert n'atteindrait la cible.`,
            },
          ],
          pieges: [en
            ? `Weighting by maturities (${n1} and ${n2} years) instead of durations gives w = ${pct(r2(((n2 - h) / (n2 - n1)) * 100))}: coupons shorten true sensitivity — maturity is not duration.`
            : `Pondérer par les maturités (${n1} et ${n2} ans) au lieu des durations donne w = ${pct(r2(((n2 - h) / (n2 - n1)) * 100))} : les coupons raccourcissent la vraie sensibilité — maturité n'est pas duration.`],
        },
        {
          intitule: en ? 'd) The amounts in euros' : 'd) Les montants en euros',
          enonce: en
            ? `What amounts do you invest? Give the amount placed in bond 1, in euros (the solution also gives bond 2).`
            : `Quels montants investissez-vous ? Donnez le montant placé sur l'obligation 1, en euros (le corrigé donne aussi l'obligation 2).`,
          reponse: repMontant1, tolerance: 0.005, unite: '€',
          etapes: [
            {
              titre: en ? 'Apply the weights to the envelope' : "Appliquer les poids à l'enveloppe",
              contenu: en
                ? `$M_1$ = ${pct(repW)} × ${f(repVaPassif)} = **${eur(repMontant1)}**; $M_2$ = ${eur(r2(montant2))}. Total: ${eur(repVaPassif)} — the liability's present value, not a euro more.`
                : `$M_1$ = ${pct(repW)} × ${f(repVaPassif)} = **${eur(repMontant1)}** ; $M_2$ = ${eur(r2(montant2))}. Total : ${eur(repVaPassif)} — la valeur actuelle du passif, pas un euro de plus.`,
            },
            {
              titre: en ? 'What you just built' : 'Ce que vous venez de construire',
              contenu: en
                ? `A barbell: one short leg, one long leg, whose barycentre lands exactly on the ${h}-year horizon. If rates rise, prices fall but coupons reinvest better; if they fall, the reverse — at the horizon, the two effects offset. That is the immunisation mechanism.`
                : `Un barbell : une jambe courte, une jambe longue, dont le barycentre tombe exactement sur l'horizon de ${h} ans. Si les taux montent, les prix baissent mais les coupons se replacent mieux ; s'ils baissent, l'inverse — à l'horizon, les deux effets se compensent. C'est le mécanisme même de l'immunisation.`,
            },
          ],
          pieges: [en
            ? `Applying w to the face liability (€${f(passifM)}m) gives ${eur(r2(w * passifEur))} — ${eur(r2(w * passifEur - montant1))} too much on bond 1 alone.`
            : `Appliquer w au passif facial (${f(passifM)} M€) donne ${eur(r2(w * passifEur))} — soit ${eur(r2(w * passifEur - montant1))} de trop sur la seule obligation 1.`],
        },
        {
          intitule: en ? 'e) The ±100 bp check' : 'e) La vérification à ±100 pb',
          enonce: en
            ? `The committee's stress test: rates jump tomorrow from ${pct(taux)} to ${pct(tauxUp)} (+100 bp). Reprice the assets and the liability exactly; by how much do the assets exceed the liability, in euros?`
            : `Le test du comité : les taux sautent demain de ${pct(taux)} à ${pct(tauxUp)} (+100 pb). Revalorisez exactement l'actif et le passif ; de combien l'actif dépasse-t-il le passif, en euros ?`,
          reponse: repEcart, tolerance: tolEcart, toleranceMode: 'absolu', unite: '€',
          etapes: [
            {
              titre: en ? 'Reprice the two bonds' : 'Revaloriser les deux obligations',
              contenu: en
                ? `Per €1,000 of face: bond 1 goes from ${f(r2(p1Ini))} to ${f(r2(p1Ini * ratio1Up))} € (×${f(ratio1Up, 4)}); bond 2 from ${f(r2(p2Ini))} to ${f(r2(p2Ini * ratio2Up))} € (×${f(ratio2Up, 4)}). The long bond drops more — that is its duration speaking.`
                : `Pour 1 000 € de nominal : l'obligation 1 passe de ${f(r2(p1Ini))} à ${f(r2(p1Ini * ratio1Up))} € (×${f(ratio1Up, 4)}) ; l'obligation 2 de ${f(r2(p2Ini))} à ${f(r2(p2Ini * ratio2Up))} € (×${f(ratio2Up, 4)}). La longue baisse plus — c'est sa duration qui parle.`,
            },
            {
              titre: en ? 'The assets after the shock' : "L'actif après le choc",
              contenu: en
                ? `${f(repMontant1)} × ${f(ratio1Up, 4)} + ${f(r2(montant2))} × ${f(ratio2Up, 4)} = **${eur(r2(actifUp))}**.`
                : `${f(repMontant1)} × ${f(ratio1Up, 4)} + ${f(r2(montant2))} × ${f(ratio2Up, 4)} = **${eur(r2(actifUp))}**.`,
            },
            {
              titre: en ? 'The liability after the shock' : 'Le passif après le choc',
              contenu: en
                ? `€${f(passifM)}m / (1 + ${pct(tauxUp)})^${h} = **${eur(r2(passifUp))}** — the liability is rate-sensitive too: that is the whole point of matching durations rather than freezing anything.`
                : `${f(passifM)} M€ / (1 + ${pct(tauxUp)})^${h} = **${eur(r2(passifUp))}** — le passif aussi est sensible aux taux : c'est tout l'intérêt de caler les durations plutôt que de « geler » quoi que ce soit.`,
            },
            {
              titre: en ? 'The residual gap — and where it comes from' : "L'écart résiduel — et d'où il vient",
              contenu: en
                ? `Assets − liability = **+${eur(repEcart)}**: the immunisation holds, and the residual is even POSITIVE. At −100 bp the gap is +${eur(r2(ecartDown))} — positive again. No accident: your barbell, more dispersed than the single-date liability, is MORE CONVEX than it. At equal duration, the higher convexity wins on both sides of the shock — this is the residual convexity gap. The flip side: the duration match decays as time passes and rates move, so an immunised portfolio is REBALANCED, not locked in a drawer.`
                : `Actif − passif = **+${eur(repEcart)}** : l'immunisation tient, et le résidu est même POSITIF. À −100 pb, l'écart vaut +${eur(r2(ecartDown))} — positif là aussi. Ce n'est pas un hasard : votre barbell, plus dispersé que le passif à date unique, est PLUS CONVEXE que lui. À duration égale, la convexité supérieure gagne des deux côtés du choc — c'est l'écart résiduel dû à la convexité. Revers de la médaille : l'égalité des durations se défait avec le temps et les mouvements de taux — une immunisation se REBALANCE, elle ne se range pas dans un tiroir.`,
            },
          ],
          pieges: [en
            ? `Comparing the shocked assets to the UNSHOCKED liability and reporting a ${eur(r2(Math.abs(actifUp - vaPassif)))} "loss": the liability moved too — immunisation is judged on the GAP, never on one side alone.`
            : `Comparer l'actif choqué au passif NON choqué et annoncer ${eur(r2(Math.abs(actifUp - vaPassif)))} de « perte » : le passif a bougé lui aussi — une immunisation se juge sur l'ÉCART, jamais sur un seul côté.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 15. m4-pb-strategie-courbe — N4, boss 2                             */
/* « La duration couvre le niveau, pas la pente » (chapitre 6).        */
/* ------------------------------------------------------------------ */
const strategieCourbe: ProblemGenerator = {
  id: 'm4-pb-strategie-courbe', moduleId: M4,
  titre: 'Monter un steepener 2s10s duration-neutre',
  titreEn: 'Building a duration-neutral 2s10s steepener',
  typeDeCas: 'trade de courbe',
  typeDeCasEn: 'curve trade',
  difficulte: 4,
  scenarios: ['Hedge fund qui met en place un steepener 2s10s', 'Desk de prop trading avec une vue de pente', "Club d'investissement averti qui dissèque le trade"],
  scenariosEn: ['Hedge fund putting on a 2s10s steepener', 'Prop desk with a curve-steepening view', 'Sophisticated investment club dissecting the trade'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const y2 = randFloat(rng, 1.6, 2.8, 2);
    const spreadPb = randInt(rng, 80, 160);
    const y10 = r2(y2 + spreadPb / 100);
    const mv2M = pick(rng, [5, 10, 20] as const);
    const steepPb = pick(rng, [20, 30, 50] as const);
    const translPb = pick(rng, [40, 50, 60] as const);

    const dMac2 = durationMacaulay(1000, y2, 2, y2);
    const dMod2 = durationModifiee(dMac2, y2);
    const dMac10 = durationMacaulay(1000, y10, 10, y10);
    const dMod10 = durationModifiee(dMac10, y10);
    const mv2 = mv2M * 1_000_000;
    const mv10 = (mv2 * dMod2) / dMod10;
    // Pentification : seul le 10 ans bouge.
    const p10Steep = prixObligation(1000, y10, 10, r2(y10 + steepPb / 100));
    const pnlSteep = (mv10 / 1000) * (1000 - p10Steep);
    // Translation parallèle : les deux pattes bougent du même montant.
    const p2T = prixObligation(1000, y2, 2, r2(y2 + translPb / 100));
    const p10T = prixObligation(1000, y10, 10, r2(y10 + translPb / 100));
    const pnlLong = (mv2 / 1000) * (p2T - 1000);
    const pnlShort = (mv10 / 1000) * (1000 - p10T);
    const pnlTransl = pnlLong + pnlShort;
    const repDMod2 = r3(dMod2);
    const repDMod10 = r3(dMod10);
    const repMv10 = r2(mv10);
    const repPnlSteep = r2(pnlSteep);
    const repPnlTransl = r2(pnlTransl);
    const tolTransl = r2(Math.max(30, Math.abs(pnlTransl) * 0.1));
    const approxSteep = r2(mv10 * dMod10 * (steepPb / 10000));

    const { en, f, eur, pct } = outils(langue);
    const marche = en
      ? `Market: the 2-year trades at par with a ${pct(y2)} coupon, the 10-year at par with a ${pct(y10)} coupon — 2s10s spread: ${spreadPb}bp. You put on €${f(mv2M)}m of the 2-year leg (at par, market value = face value)`
      : `Marché : le 2 ans cote au pair avec un coupon de ${pct(y2)}, le 10 ans au pair avec un coupon de ${pct(y10)} — spread 2s10s : ${spreadPb} pb. Vous montez ${f(mv2M)} M€ sur la jambe 2 ans (au pair, valeur de marché = nominal)`;
    const contexte = (en
      ? [
        `Your fund expects the 2s10s to steepen: the 10-year will sell off more than the 2-year. The classic trade: long the 2-year / short the 10-year, sized duration-neutral so the bet rides ONLY the slope, not the level. ${marche}. Now size the short leg — and prove to the risk committee that a parallel move leaves you flat.`,
        `On the prop desk, your view: the central bank will cut fast while the long end resists — steepening. ${marche}. The risk manager signs off only if the package is duration-neutral: he wants the two durations, the leg sizes, and the P&L in both scenarios — slope and level.`,
        `Your investment club (advanced group) wants to understand how desks "trade the slope without trading the level". Today's worked example: ${marche}. You will run the full calibration, then test the package against both a steepening and a parallel shift.`,
      ]
      : [
        `Votre fonds anticipe une pentification du 2s10s : le 10 ans se tendra plus que le 2 ans. Le trade classique : long 2 ans / short 10 ans, calibré duration-neutre pour ne porter QUE la pente, pas le niveau. ${marche}. Reste à calibrer la jambe vendue — et à prouver au comité des risques qu'une translation parallèle vous laisse à plat.`,
        `Au desk de prop, votre vue : la banque centrale baissera vite pendant que le long bout résistera — pentification. ${marche}. Le risk manager ne signe que si le paquet est duration-neutre : il veut les deux durations, les tailles, et le P&L dans les deux scénarios — pente et niveau.`,
        `Votre club d'investissement (niveau avancé) veut comprendre comment les desks « tradent la pente sans trader le niveau ». L'exemple du jour : ${marche}. Vous déroulez le calibrage complet, puis testez le paquet contre une pentification et contre une translation parallèle.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) Modified duration of the 2-year leg' : 'a) La duration modifiée de la patte 2 ans',
          enonce: en
            ? `Compute the modified duration of the 2-year bond.`
            : `Calculez la duration modifiée de l'obligation 2 ans.`,
          reponse: repDMod2, tolerance: 0.005,
          etapes: [
            ...etapesDurationMac(langue, 1000, y2, 2, y2),
            {
              titre: en ? 'Convert to modified duration' : 'Convertir en duration modifiée',
              contenu: en
                ? `$D_{mod} = ${f(r3(dMac2), 3)} / ${f(1 + y2 / 100, 4)}$ = **${f(repDMod2, 3)}**.`
                : `$D_{mod} = ${f(r3(dMac2), 3)} / ${f(1 + y2 / 100, 4)}$ = **${f(repDMod2, 3)}**.`,
            },
          ],
        },
        {
          intitule: en ? 'b) Modified duration of the 10-year leg' : 'b) La duration modifiée de la patte 10 ans',
          enonce: en
            ? `Same question for the 10-year bond.`
            : `Même question pour l'obligation 10 ans.`,
          reponse: repDMod10, tolerance: 0.005,
          etapes: [
            ...etapesDurationMac(langue, 1000, y10, 10, y10),
            {
              titre: en ? 'Convert to modified duration' : 'Convertir en duration modifiée',
              contenu: en
                ? `$D_{mod} = ${f(r3(dMac10), 3)} / ${f(1 + y10 / 100, 4)}$ = **${f(repDMod10, 3)}**.`
                : `$D_{mod} = ${f(r3(dMac10), 3)} / ${f(1 + y10 / 100, 4)}$ = **${f(repDMod10, 3)}**.`,
            },
          ],
          pieges: [en
            ? `At par, duration is NOT maturity: the 10-year's coupons pull its barycentre back to ${f(r2(dMac10), 2)} years — using 10 would oversize the hedge ratio.`
            : `Au pair, la duration n'est PAS la maturité : les coupons du 10 ans ramènent son barycentre à ${f(r2(dMac10), 2)} ans — prendre 10 fausserait tout le calibrage.`],
        },
        {
          intitule: en ? 'c) The size of the short leg' : 'c) La taille de la jambe vendue',
          enonce: en
            ? `What market value of the 10-year must be SOLD for the package to be duration-neutral (zero net DV01), in euros?`
            : `Quelle valeur de marché du 10 ans faut-il VENDRE pour que le paquet soit duration-neutre (DV01 net nul), en euros ?`,
          reponse: repMv10, tolerance: 0.005, unite: '€',
          etapes: [
            {
              titre: en ? 'Equalise the DV01s of the two legs' : 'Égaliser les DV01 des deux jambes',
              contenu: en
                ? `$MV_{10} \\times D_{mod,10} = MV_2 \\times D_{mod,2}$: each leg must gain or lose the same per basis point — only then does a LEVEL move cancel out.`
                : `$MV_{10} \\times D_{mod,10} = MV_2 \\times D_{mod,2}$ : chaque jambe doit gagner ou perdre autant par point de base — c'est la condition pour qu'un mouvement de NIVEAU s'annule.`,
            },
            {
              titre: en ? 'Solve for the short leg' : 'Résoudre pour la jambe vendue',
              contenu: en
                ? `$MV_{10}$ = €${f(mv2M)}m × ${f(repDMod2, 3)} / ${f(repDMod10, 3)} = **${eur(repMv10)}**. The 10-year being about ${f(r2(dMod10 / dMod2), 1)} times more sensitive, the short leg is about ${f(r2(dMod10 / dMod2), 1)} times smaller.`
                : `$MV_{10}$ = ${f(mv2M)} M€ × ${f(repDMod2, 3)} / ${f(repDMod10, 3)} = **${eur(repMv10)}**. Le 10 ans étant environ ${f(r2(dMod10 / dMod2), 1)} fois plus sensible, la jambe vendue est environ ${f(r2(dMod10 / dMod2), 1)} fois plus petite.`,
            },
          ],
          pieges: [en
            ? `Selling the same size as the long leg (€${f(mv2M)}m of 10-year) would leave a net DV01 of ${eur(r2((mv2 * dMod2 - mv2 * dMod10) * 0.0001))} per bp: a massive short on the LEVEL of rates, not a slope trade.`
            : `Vendre la même taille que la jambe longue (${f(mv2M)} M€ de 10 ans) laisserait un DV01 net de ${eur(r2((mv2 * dMod2 - mv2 * dMod10) * 0.0001))} par pb : un énorme pari à la baisse sur le NIVEAU des taux, plus du tout un trade de pente.`],
        },
        {
          intitule: en ? 'd) P&L if the curve steepens' : 'd) Le P&L si la courbe se pentifie',
          enonce: en
            ? `Your scenario plays out: the 10-year yield rises by ${steepPb} bp, the 2-year does not move. What is the package P&L, by exact repricing, in euros?`
            : `Votre scénario se réalise : le taux 10 ans se tend de ${steepPb} pb, le 2 ans ne bouge pas. Quel est le P&L du paquet, par revalorisation exacte, en euros ?`,
          reponse: repPnlSteep, tolerance: 0.01, unite: '€',
          etapes: [
            {
              titre: en ? 'Only the short leg moves' : 'Seule la jambe vendue bouge',
              contenu: en
                ? `New 10-year price at ${pct(r2(y10 + steepPb / 100))}: ${f(r2(p10Steep))} € per 1,000 of face. The 2-year leg, unchanged, contributes nothing.`
                : `Nouveau prix du 10 ans à ${pct(r2(y10 + steepPb / 100))} : ${f(r2(p10Steep))} € pour 1 000 € de pair. La jambe 2 ans, inchangée, ne contribue pas.`,
            },
            {
              titre: en ? 'P&L of the short leg' : 'Le P&L de la jambe vendue',
              contenu: en
                ? `Short ${eur(repMv10)} of face: P&L = ${f(repMv10)} × (1 000 − ${f(r2(p10Steep))}) / 1 000 = **+${eur(repPnlSteep)}**. Short the bond, you book the price drop.`
                : `Short ${eur(repMv10)} de nominal : P&L = ${f(repMv10)} × (1 000 − ${f(r2(p10Steep))}) / 1 000 = **+${eur(repPnlSteep)}**. Vendeur du titre, vous encaissez la baisse du prix.`,
            },
            {
              titre: en ? 'Cross-check with duration' : 'Recouper avec la duration',
              contenu: en
                ? `≈ $MV_{10} \\times D_{mod,10} \\times \\Delta y$ = ${eur(approxSteep)} — same ballpark (the gap is convexity). The package monetises the SLOPE: exactly the view. A steepening through a 2-year rally would even pay on both legs.`
                : `≈ $MV_{10} \\times D_{mod,10} \\times \\Delta y$ = ${eur(approxSteep)} — même ordre de grandeur (l'écart, c'est la convexité). Le paquet monétise la PENTE : exactement la vue. Une pentification par détente du 2 ans aurait même payé sur les deux jambes.`,
            },
          ],
        },
        {
          intitule: en ? 'e) P&L if the curve shifts in parallel' : 'e) Le P&L si la courbe se translate',
          enonce: en
            ? `The risk manager's counter-scenario: no steepening, but a parallel shift of +${translPb} bp on both yields. What is the exact package P&L, in euros? (signed answer — this is the test of "duration-neutral")`
            : `Le contre-scénario du risk manager : pas de pentification, mais une translation parallèle de +${translPb} pb des deux taux. Quel est le P&L exact du paquet, en euros ? (réponse signée — c'est le test du « duration-neutre »)`,
          reponse: repPnlTransl, tolerance: tolTransl, toleranceMode: 'absolu', unite: '€',
          etapes: [
            {
              titre: en ? 'Reprice both legs' : 'Revaloriser les deux jambes',
              contenu: en
                ? `2-year at ${pct(r2(y2 + translPb / 100))}: ${f(r2(p2T))} €; 10-year at ${pct(r2(y10 + translPb / 100))}: ${f(r2(p10T))} € (per 1,000 of face).`
                : `2 ans à ${pct(r2(y2 + translPb / 100))} : ${f(r2(p2T))} € ; 10 ans à ${pct(r2(y10 + translPb / 100))} : ${f(r2(p10T))} € (pour 1 000 € de pair).`,
            },
            {
              titre: en ? 'The two leg P&Ls' : 'Les P&L des deux jambes',
              contenu: en
                ? `Long leg: ${f(mv2M)}m × (${f(r2(p2T))} − 1 000)/1 000 = ${eur(r2(pnlLong))}. Short leg: ${f(repMv10)} × (1 000 − ${f(r2(p10T))})/1 000 = +${eur(r2(pnlShort))}.`
                : `Jambe longue : ${f(mv2M)} M€ × (${f(r2(p2T))} − 1 000)/1 000 = ${eur(r2(pnlLong))}. Jambe vendue : ${f(repMv10)} × (1 000 − ${f(r2(p10T))})/1 000 = +${eur(r2(pnlShort))}.`,
            },
            {
              titre: en ? 'The net — and how to read it' : 'Le net — et sa lecture',
              contenu: en
                ? `${eur(r2(pnlLong))} + ${eur(r2(pnlShort))} = **${eur(repPnlTransl)}**. The first-order terms cancel BY CONSTRUCTION (equal DV01s): on legs that each move about ${eur(r2(Math.abs(pnlLong)))}, only this residual survives — that was the whole point of c). Its sign is no accident either: per euro of DV01, the 10-year is more convex than the 2-year, so a duration-neutral steepener is slightly SHORT convexity and bleeds a little on parallel moves, up or down. Chapter 6 said it: "duration hedges the level, not the slope" — and the level only to first order.`
                : `${eur(r2(pnlLong))} + ${eur(r2(pnlShort))} = **${eur(repPnlTransl)}**. Les premiers ordres s'annulent PAR CONSTRUCTION (DV01 égaux) : sur des jambes qui bougent chacune d'environ ${eur(r2(Math.abs(pnlLong)))}, seul ce résidu survit — c'était tout l'objet du c). Son signe non plus n'est pas un hasard : par euro de DV01, le 10 ans est plus convexe que le 2 ans — un steepener duration-neutre est légèrement SHORT convexité et perd un peu dans les translations, à la hausse comme à la baisse. Le chapitre 6 l'annonçait : « la duration couvre le niveau, pas la pente » — et le niveau, seulement au premier ordre.`,
            },
          ],
          pieges: [en
            ? `Reading the residual as a sizing error: without c), a ${translPb} bp parallel move would have cost (or paid) about ${eur(r2(Math.abs(pnlLong)))} on a single leg — the calibration removed ${pct(r2(100 - Math.abs(pnlTransl) / Math.abs(pnlLong) * 100))} of it.`
            : `Lire le résidu comme une erreur de calibrage : sans le c), une translation de ${translPb} pb aurait coûté (ou rapporté) environ ${eur(r2(Math.abs(pnlLong)))} sur une seule jambe — le calibrage en a effacé ${pct(r2(100 - Math.abs(pnlTransl) / Math.abs(pnlLong) * 100))}.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 16. m4-pb-convexite-gros-choc — N4, boss 3                          */
/* Les limites de la duration sur ±250 pb : hiérarchie des erreurs.    */
/* ------------------------------------------------------------------ */
const convexiteGrosChoc: ProblemGenerator = {
  id: 'm4-pb-convexite-gros-choc', moduleId: M4,
  titre: 'Quand la duration ne suffit plus : choc de 250 pb',
  titreEn: 'When duration breaks down: a 250bp shock',
  typeDeCas: 'limites de la duration',
  typeDeCasEn: 'limits of duration',
  difficulte: 4,
  scenarios: ['Contrôle des risques après un rally de 250 pb', 'Stress test réglementaire à +250 pb', 'Post-mortem du krach obligataire de 2022'],
  scenariosEn: ['Risk control after a 250bp rally', 'Regulatory stress test at +250bp', 'Post-mortem of the 2022 bond rout'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const nominal = 1000;
    const coupon = randFloat(rng, 2, 4.5, 2);
    const n = randInt(rng, 8, 12);
    const y0 = randFloat(rng, 3, 5.5, 2);
    const chocPb = sIdx === 0 ? -250 : 250; // scénario 0 : rally ; 1 et 2 : krach
    const y1 = r2(y0 + chocPb / 100);
    const dy = chocPb / 10000;

    const p0 = prixObligation(nominal, coupon, n, y0);
    const dMac = durationMacaulay(nominal, coupon, n, y0);
    const dMod = durationModifiee(dMac, y0);
    const conv = convexite(nominal, coupon, n, y0);
    const pDur = p0 * (1 - dMod * dy);
    const termeConv = 0.5 * conv * dy * dy * p0;
    const pDurConv = pDur + termeConv;
    const pExact = prixObligation(nominal, coupon, n, y1);
    const errDur = Math.abs(pDur - pExact);
    const errConv = Math.abs(pDurConv - pExact);
    const repP0 = r2(p0);
    const repPDur = r2(pDur);
    const repPDurConv = r2(pDurConv);
    const repPExact = r2(pExact);
    const repErrDur = r2(errDur);
    const hausse = chocPb > 0;

    const { en, f, eur, pct } = outils(langue);
    const titreDesc = en
      ? `face value ${eur(nominal)}, ${pct(coupon)} coupon, ${n}-year maturity, starting yield ${pct(y0)}`
      : `nominal ${eur(nominal)}, coupon ${pct(coupon)}, maturité ${n} ans, taux de départ ${pct(y0)}`;
    const contexte = (en
      ? [
        `Six months of brutal easing: yields on the ${n}-year point fell from ${pct(y0)} to ${pct(y1)} — a 250bp rally. The actual P&L on your line (${titreDesc}) came out WELL above what the risk tool, which runs on duration alone, had predicted. Risk control wants the full decomposition: duration-only estimate, duration + convexity, exact price — and the two errors, ranked.`,
        `The regulator imposes an instantaneous +250bp stress. Your line: ${titreDesc}. The in-house tool only uses duration; the model validator demands a number on what that approximation misses at this size of shock — through all four prices, then the error hierarchy.`,
        `Post-mortem of 2022: in a few months, yields rose by roughly 250bp and actual losses did not match the duration-based estimates in the reports. Reconstruction on a typical bond — ${titreDesc}: duration alone, then convexity, then the exact price. The error gap tells you why 2022 surprised even serious people.`,
      ]
      : [
        `Six mois de détente brutale : les taux du point ${n} ans sont passés de ${pct(y0)} à ${pct(y1)} — un rally de 250 pb. Le P&L réel de votre ligne (${titreDesc}) a LARGEMENT dépassé ce que l'outil de risque, calé sur la seule duration, avait prédit. Le contrôle des risques veut la décomposition complète : estimation duration seule, duration + convexité, prix exact — et les deux erreurs, classées.`,
        `Le régulateur impose un stress instantané de +250 pb. Votre ligne : ${titreDesc}. L'outil interne n'utilise que la duration ; le validateur de modèles exige de chiffrer ce que cette approximation rate sur un choc de cette taille — en passant par les quatre prix, puis par la hiérarchie des erreurs.`,
        `Post-mortem de 2022 : en quelques mois, les taux étaient montés d'environ 250 pb, et les pertes réelles ne collaient pas aux estimations « duration » des reportings. Reconstitution sur un titre type — ${titreDesc} : duration seule, puis convexité, puis prix exact. L'écart entre les erreurs raconte pourquoi 2022 a surpris même les gens sérieux.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The initial price' : 'a) Le prix initial',
          enonce: en
            ? `What is the bond's price at the starting yield of ${pct(y0)}, in euros?`
            : `Quel est le prix du titre au taux de départ de ${pct(y0)}, en euros ?`,
          reponse: repP0, tolerance: 0.002, unite: '€',
          etapes: etapesPrix(langue, nominal, coupon, n, y0),
        },
        {
          intitule: en ? 'b) The duration-only estimate' : "b) L'estimation duration seule",
          enonce: en
            ? `Estimate the price after the ${hausse ? '+250' : '−250'} bp shock using duration ALONE, in euros.`
            : `Estimez le prix après le choc de ${hausse ? '+250' : '−250'} pb avec la duration SEULE, en euros.`,
          reponse: repPDur, tolerance: 0.005, unite: '€',
          etapes: [
            {
              titre: en ? 'The modified duration' : 'La duration modifiée',
              contenu: en
                ? `$D_{Mac}$ = ${f(r3(dMac), 3)} years (barycentre of the discounted flows, chapter 6 method), hence $D_{mod}$ = ${f(r3(dMac), 3)} / ${f(1 + y0 / 100, 4)} = **${f(r3(dMod), 3)}**.`
                : `$D_{Mac}$ = ${f(r3(dMac), 3)} années (barycentre des flux actualisés, méthode du chapitre 6), d'où $D_{mod}$ = ${f(r3(dMac), 3)} / ${f(1 + y0 / 100, 4)} = **${f(r3(dMod), 3)}**.`,
            },
            {
              titre: en ? 'Follow the tangent' : 'Suivre la tangente',
              contenu: en
                ? `$P \\approx P_0 (1 - D_{mod} \\Delta y)$ = ${f(repP0)} × (1 − ${f(r3(dMod), 3)} × ${f(dy, 3)}) = **${eur(repPDur)}**. This is a LINEAR estimate: it rides the tangent of the price-yield curve over a full 250bp.`
                : `$P \\approx P_0 (1 - D_{mod} \\Delta y)$ = ${f(repP0)} × (1 − ${f(r3(dMod), 3)} × ${f(dy, 3)}) = **${eur(repPDur)}**. C'est une estimation LINÉAIRE : elle suit la tangente de la courbe prix-taux sur 250 pb entiers.`,
            },
          ],
          pieges: [en
            ? `Starting from the face value instead of the price gives ${eur(r2(nominal * (1 - dMod * dy)))}: ΔP applies to the PRICE ${f(repP0)} €, never to par.`
            : `Partir du nominal au lieu du prix donne ${eur(r2(nominal * (1 - dMod * dy)))} : le ΔP s'applique au PRIX ${f(repP0)} €, jamais au pair.`],
        },
        {
          intitule: en ? 'c) Adding the convexity term' : 'c) En ajoutant le terme de convexité',
          enonce: en
            ? `Same estimate, adding the convexity correction, in euros.`
            : `Même estimation, en ajoutant la correction de convexité, en euros.`,
          reponse: repPDurConv, tolerance: 0.005, unite: '€',
          etapes: [
            {
              titre: en ? 'The bond’s convexity' : 'La convexité du titre',
              contenu: en
                ? `$C$ = ${f(r2(conv))} (chapter 6 computation, second derivative of the price).`
                : `$C$ = ${f(r2(conv))} (calcul du chapitre 6, dérivée seconde du prix).`,
            },
            {
              titre: en ? 'The second-order term' : "Le terme d'ordre 2",
              contenu: en
                ? `$+\\tfrac{1}{2} C (\\Delta y)^2 P_0$ = 0.5 × ${f(r2(conv))} × (${f(dy, 3)})² × ${f(repP0)} = **+${eur(r2(termeConv))}** — positive whichever way the shock goes: $(\\Delta y)^2$ erases the sign.`
                : `$+\\tfrac{1}{2} C (\\Delta y)^2 P_0$ = 0,5 × ${f(r2(conv))} × (${f(dy, 3)})² × ${f(repP0)} = **+${eur(r2(termeConv))}** — positif quel que soit le sens du choc : $(\\Delta y)^2$ efface le signe.`,
            },
            {
              titre: en ? 'The corrected price' : 'Le prix corrigé',
              contenu: en
                ? `${f(repPDur)} + ${f(r2(termeConv))} = **${eur(repPDurConv)}**.`
                : `${f(repPDur)} + ${f(r2(termeConv))} = **${eur(repPDurConv)}**.`,
            },
          ],
          pieges: [en
            ? `Subtracting the convexity term "because rates ${hausse ? 'rose' : 'fell'}" gives ${eur(r2(pDur - termeConv))}: the correction is ALWAYS added — convexity bends the price curve upward on both sides of the tangent.`
            : `Soustraire le terme de convexité « parce que les taux ${hausse ? 'montent' : 'baissent'} » donne ${eur(r2(pDur - termeConv))} : la correction s'AJOUTE toujours — la convexité bombe la courbe de prix au-dessus de la tangente des deux côtés.`],
        },
        {
          intitule: en ? 'd) The exact price' : 'd) Le prix exact',
          enonce: en
            ? `Reprice the bond exactly at the new yield of ${pct(y1)}, in euros.`
            : `Recalculez le prix exact au nouveau taux de ${pct(y1)}, en euros.`,
          reponse: repPExact, tolerance: 0.002, unite: '€',
          etapes: etapesPrix(langue, nominal, coupon, n, y1),
        },
        {
          intitule: en ? 'e) The error hierarchy' : 'e) La hiérarchie des erreurs',
          enonce: en
            ? `Quantify the error of the duration-only estimate against the exact price, in euros (absolute value). The solution ranks it against the duration + convexity error.`
            : `Chiffrez l'erreur de l'estimation « duration seule » par rapport au prix exact, en euros (valeur absolue). Le corrigé la compare à l'erreur « duration + convexité ».`,
          reponse: repErrDur, tolerance: 0.01, unite: '€',
          etapes: [
            {
              titre: en ? 'The two errors, side by side' : 'Les deux erreurs, côte à côte',
              contenu: en
                ? `Duration only: |${f(repPDur)} − ${f(repPExact)}| = **${eur(repErrDur)}**. Duration + convexity: |${f(repPDurConv)} − ${f(repPExact)}| = **${eur(r2(errConv))}** — about ${f(Math.round(errDur / Math.max(errConv, 0.01)))} times smaller. Per €1,000 of face; multiply by the position size to feel it.`
                : `Duration seule : |${f(repPDur)} − ${f(repPExact)}| = **${eur(repErrDur)}**. Duration + convexité : |${f(repPDurConv)} − ${f(repPExact)}| = **${eur(r2(errConv))}** — environ ${f(Math.round(errDur / Math.max(errConv, 0.01)))} fois moins. Le tout pour 1 000 € de nominal ; multipliez par la taille de la position pour le sentir.`,
            },
            {
              titre: en ? 'Why the hierarchy ALWAYS goes this way' : 'Pourquoi la hiérarchie va TOUJOURS dans ce sens',
              contenu: en
                ? `|duration error| > |duration + convexity error|: each extra Taylor term absorbs most of what the previous one missed. Duration (order 1) rides the tangent and ignores ALL the curvature — about ${eur(r2(termeConv))} over 250bp. Convexity (order 2) captures precisely that curvature; what survives (${eur(r2(errConv))}) is third order and higher — negligible even on a giant shock. On ±25bp the three prices would be near-indistinguishable: the hierarchy exists at every size, it just stops mattering on small moves.`
                : `|erreur duration| > |erreur duration + convexité| : chaque terme de Taylor supplémentaire absorbe l'essentiel de ce que le précédent ratait. La duration (ordre 1) suit la tangente et ignore TOUTE la courbure — environ ${eur(r2(termeConv))} sur 250 pb. La convexité (ordre 2) capture précisément cette courbure ; ce qui survit (${eur(r2(errConv))}) relève des ordres supérieurs — négligeable même sur un choc géant. Sur ±25 pb, les trois prix seraient presque indiscernables : la hiérarchie existe à toute taille de choc, elle ne cesse simplement de compter sur les petits.`,
            },
            {
              titre: en ? 'The desk takeaway' : 'La leçon de desk',
              contenu: en
                ? `${hausse ? `The tangent runs BELOW the price curve: duration alone overstated the loss.` : `The tangent runs below the curve here too: duration alone understated the rally's gain.`} Both ways, the duration-only error sits on the same side — that asymmetry IS convexity, and it is why chapter 6 calls it a quality. Practical rule: small moves, duration is fine; ±250bp, a desk reprices everything exactly — which is precisely what stress tests do.`
                : `${hausse ? `La tangente passe SOUS la courbe de prix : la duration seule a surestimé la perte.` : `La tangente passe sous la courbe ici aussi : la duration seule a sous-estimé le gain du rally.`} Dans les deux sens, l'erreur de la duration seule tombe du même côté — cette asymétrie EST la convexité, et c'est pourquoi le chapitre 6 en fait une qualité. Règle pratique : petits mouvements, la duration suffit ; ±250 pb, un desk revalorise tout en exact — c'est précisément ce que font les stress tests.`,
            },
          ],
          pieges: [en
            ? `Believing duration errs "symmetrically": its error always lands on the pessimistic side for the holder — losses overstated when rates rise, gains understated when they fall.`
            : `Croire que la duration se trompe « symétriquement » : son erreur tombe toujours du côté pessimiste pour le porteur — perte surestimée quand les taux montent, gain sous-estimé quand ils baissent.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* Lot 3 (4 boss N4 supplémentaires) — outillage local                  */
/* ------------------------------------------------------------------ */
/** YTM d'une obligation à coupon annuel, par dichotomie sur prixObligation (compose calculs.ts, ne recopie aucune formule). */
function ytmParDichotomie(nominal: number, couponPct: number, n: number, prix: number): number {
  let bas = 0.0001;
  let haut = 25;
  for (let i = 0; i < 80; i++) {
    const mid = (bas + haut) / 2;
    if (prixObligation(nominal, couponPct, n, mid) > prix) bas = mid;
    else haut = mid;
  }
  return (bas + haut) / 2;
}

/* ------------------------------------------------------------------ */
/* 17. m4-pb-butterfly — N4, boss 4                                    */
/* Barbell contre bullet à duration égale : le convexity pickup,       */
/* et son prix en portage.                                             */
/* ------------------------------------------------------------------ */
const butterfly: ProblemGenerator = {
  id: 'm4-pb-butterfly', moduleId: M4,
  titre: 'Barbell contre bullet : acheter de la convexité',
  titreEn: 'Barbell versus bullet: buying convexity',
  typeDeCas: 'arbitrage de convexité',
  typeDeCasEn: 'convexity trade',
  difficulte: 4,
  scenarios: ['Gérant total return qui restructure sa poche souveraine', 'Desk relative value qui monte le butterfly', "Comité d'allocation qui tranche entre les deux structures"],
  scenariosEn: ['Total-return manager restructuring the sovereign bucket', 'Relative-value desk putting on the butterfly', 'Allocation committee arbitrating between the two structures'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const y2 = randFloat(rng, 1.8, 3, 2);
    const slopePb = randInt(rng, 60, 140);
    const humpPb = randInt(rng, 25, 45); // le ventre cote AU-DESSUS de la corde 2-10 : courbe bossue réaliste
    const vM = pick(rng, [10, 20, 50] as const);
    const y10 = r2(y2 + slopePb / 100);
    const y5 = r2(y2 + (3 / 8) * (slopePb / 100) + humpPb / 100);

    const dMac2 = durationMacaulay(1000, y2, 2, y2);
    const dMac5 = durationMacaulay(1000, y5, 5, y5);
    const dMac10 = durationMacaulay(1000, y10, 10, y10);
    const dMod2 = durationModifiee(dMac2, y2);
    const dMod5 = durationModifiee(dMac5, y5);
    const dMod10 = durationModifiee(dMac10, y10);
    const w = (dMod10 - dMod5) / (dMod10 - dMod2);
    const conv2 = convexite(1000, y2, 2, y2);
    const conv5 = convexite(1000, y5, 5, y5);
    const conv10 = convexite(1000, y10, 10, y10);
    const convBarbell = w * conv2 + (1 - w) * conv10;
    const repD5 = r3(dMod5);
    const repW = r2(w * 100);
    const repPickup = r2(convBarbell - conv5);
    const v = vM * 1_000_000;
    // P&L à ±150 pb calculés sur le poids et les prix AFFICHÉS : le corrigé retombe au centime sur ses propres chiffres.
    const wAff = repW / 100;
    const rp2Up = r2(prixObligation(1000, y2, 2, y2 + 1.5));
    const rp5Up = r2(prixObligation(1000, y5, 5, y5 + 1.5));
    const rp10Up = r2(prixObligation(1000, y10, 10, y10 + 1.5));
    const rp2Dn = r2(prixObligation(1000, y2, 2, y2 - 1.5));
    const rp5Dn = r2(prixObligation(1000, y5, 5, y5 - 1.5));
    const rp10Dn = r2(prixObligation(1000, y10, 10, y10 - 1.5));
    const bulletUp = (v * rp5Up) / 1000;
    const barbellUp = (v * (wAff * rp2Up + (1 - wAff) * rp10Up)) / 1000;
    const diffUp = r2(barbellUp - bulletUp);
    const bulletDn = (v * rp5Dn) / 1000;
    const barbellDn = (v * (wAff * rp2Dn + (1 - wAff) * rp10Dn)) / 1000;
    const diffDn = r2(barbellDn - bulletDn);
    const portageBarbell = w * y2 + (1 - w) * y10;
    const repGiveUp = r2((y5 - portageBarbell) * 100);
    const giveUpEur = r2((v * (y5 - portageBarbell)) / 100);
    const wMat = r2(((10 - 5) / (10 - 2)) * 100); // le faux poids « par les maturités »

    const { en, f, eur, pct } = outils(langue);
    const marche = en
      ? `Market, all three lines at par (coupon = yield): the 2-year at ${pct(y2)}, the 5-year at ${pct(y5)}, the 10-year at ${pct(y10)} — an upward-sloping curve with a rich belly. The reference position is a €${f(vM)}m bullet in the 5-year; the alternative, a barbell of the 2-year and the 10-year built to the SAME overall duration`
      : `Marché, trois souches au pair (coupon = taux) : le 2 ans à ${pct(y2)}, le 5 ans à ${pct(y5)}, le 10 ans à ${pct(y10)} — courbe croissante, ventre cher. La position de référence est un bullet de ${f(vM)} M€ sur le 5 ans ; l'alternative, un barbell 2 ans + 10 ans construit à la MÊME duration globale`;
    const contexte = (en
      ? [
        `Total-return mandate: your sovereign bucket sits entirely in the 5-year, and the house strategist calls for large rate swings — direction unknown. ${marche}. Before switching, the CIO wants the full file: durations, weights, convexities, exact P&L both ways, and what the swap gives up in carry.`,
        `On the relative-value desk, the 2s5s10s butterfly screens attractive: the belly looks expensive against the wings. ${marche}. You calibrate the duration-matched version, then price what it wins on big moves — and what it bleeds in carry while you wait.`,
        `The allocation committee must decide how to hold its sovereign pocket: bullet or barbell. ${marche}. Your memo must put numbers on both structures: same duration, different convexities, P&L under ±150bp, and the carry bill the committee keeps forgetting.`,
      ]
      : [
        `Mandat total return : votre poche souveraine est entièrement sur le 5 ans, et le stratégiste maison annonce de grands mouvements de taux — sens inconnu. ${marche}. Avant d'arbitrer, le directeur des gestions veut le dossier complet : durations, poids, convexités, P&L exacts dans les deux sens, et ce que la bascule abandonne en portage.`,
        `Au desk relative value, le butterfly 2-5-10 ressort à l'écran : le ventre paraît cher contre les ailes. ${marche}. Vous calibrez la version duration-neutre, puis chiffrez ce qu'elle gagne sur les gros mouvements — et ce qu'elle saigne en portage en attendant.`,
        `Le comité d'allocation doit trancher la détention de sa poche souveraine : bullet ou barbell. ${marche}. Votre note doit chiffrer les deux structures : même duration, convexités différentes, P&L sous ±150 pb, et la facture de portage que le comité oublie toujours.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The durations of the three lines' : 'a) Les durations des trois souches',
          enonce: en
            ? `Compute the modified duration of the 5-year bullet (the solution also gives the 2-year and the 10-year).`
            : `Calculez la duration modifiée du bullet 5 ans (le corrigé donne aussi le 2 ans et le 10 ans).`,
          reponse: repD5, tolerance: 0.005,
          etapes: [
            {
              titre: en ? 'Macaulay durations, all three' : 'Les durations de Macaulay, toutes les trois',
              contenu: en
                ? `At par, coupon = yield; the barycentre of discounted flows (chapter 6 method) gives: 2-year ${f(r3(dMac2), 3)} years, 5-year ${f(r3(dMac5), 3)} years, 10-year ${f(r3(dMac10), 3)} years. Duration grows MORE SLOWLY than maturity: the 10-year's coupons pull its barycentre far below 10.`
                : `Au pair, coupon = taux ; le barycentre des flux actualisés (méthode du chapitre 6) donne : 2 ans ${f(r3(dMac2), 3)} ans, 5 ans ${f(r3(dMac5), 3)} ans, 10 ans ${f(r3(dMac10), 3)} ans. La duration croît MOINS vite que la maturité : les coupons du 10 ans ramènent son barycentre loin sous 10.`,
            },
            {
              titre: en ? 'Convert to modified durations' : 'Convertir en durations modifiées',
              contenu: en
                ? `Each $D_{Mac}$ divides by its own (1 + y): 2-year → ${f(r3(dMod2), 3)}, 5-year → **${f(repD5, 3)}**, 10-year → ${f(r3(dMod10), 3)}. The requested answer is the bullet's: **${f(repD5, 3)}**.`
                : `Chaque $D_{Mac}$ se divise par son propre (1 + y) : 2 ans → ${f(r3(dMod2), 3)}, 5 ans → **${f(repD5, 3)}**, 10 ans → ${f(r3(dMod10), 3)}. La réponse demandée est celle du bullet : **${f(repD5, 3)}**.`,
            },
            {
              titre: en ? 'The concavity that drives the whole problem' : 'La concavité qui pilote tout le problème',
              contenu: en
                ? `Plot duration against maturity: the line is CONCAVE. That concavity is what the butterfly monetises — a 2s-10s mix can replicate the 5-year's duration without replicating anything else about it.`
                : `Tracez la duration contre la maturité : la courbe est CONCAVE. C'est cette concavité que le butterfly monétise — un mélange 2-10 peut répliquer la duration du 5 ans sans rien répliquer d'autre.`,
            },
          ],
          pieges: [en
            ? `Reading durations off maturities (2, 5, 10): at these coupon levels the 10-year's true sensitivity is ${f(r3(dMod10), 3)}, not 10 — every later weight would be wrong.`
            : `Lire les durations sur les maturités (2, 5, 10) : à ces niveaux de coupon, la vraie sensibilité du 10 ans est ${f(r3(dMod10), 3)}, pas 10 — tous les poids de la suite seraient faux.`],
        },
        {
          intitule: en ? 'b) The barbell weights' : 'b) Les poids du barbell',
          enonce: en
            ? `Your work in a) gives, in modified duration: D(2y) = ${f(r3(dMod2), 3)}, D(5y) = ${f(repD5, 3)}, D(10y) = ${f(r3(dMod10), 3)}. What weight w (in % of portfolio value) must the 2-year carry so the barbell replicates the 5-year bullet's duration?`
            : `Vos calculs du a) donnent, en duration modifiée : D(2 ans) = ${f(r3(dMod2), 3)}, D(5 ans) = ${f(repD5, 3)}, D(10 ans) = ${f(r3(dMod10), 3)}. Quel poids w (en % de la valeur du portefeuille) faut-il mettre sur le 2 ans pour que le barbell réplique la duration du bullet 5 ans ?`,
          reponse: repW, tolerance: 0.005, unite: '%',
          etapes: [
            {
              titre: en ? 'Set up the weight equation' : "Poser l'équation des poids",
              contenu: en
                ? `A portfolio's duration is the market-value-weighted average of its lines (chapter 6): $w D_2 + (1-w) D_{10} = D_5$. One equation, one unknown — the budget constraint is already inside w.`
                : `La duration d'un portefeuille est la moyenne de celles de ses lignes pondérée par les valeurs de marché (chapitre 6) : $w D_2 + (1-w) D_{10} = D_5$. Une équation, une inconnue — la contrainte de budget est déjà dans w.`,
            },
            {
              titre: en ? 'Solve' : 'Résoudre',
              contenu: en
                ? `$w = \\frac{D_{10} - D_5}{D_{10} - D_2}$ = (${f(r3(dMod10), 3)} − ${f(repD5, 3)}) / (${f(r3(dMod10), 3)} − ${f(r3(dMod2), 3)}) = **${pct(repW)}** in the 2-year, ${pct(r2(100 - repW))} in the 10-year. Both weights are positive because D₅ sits BETWEEN the wings' durations.`
                : `$w = \\frac{D_{10} - D_5}{D_{10} - D_2}$ = (${f(r3(dMod10), 3)} − ${f(repD5, 3)}) / (${f(r3(dMod10), 3)} − ${f(r3(dMod2), 3)}) = **${pct(repW)}** sur le 2 ans, ${pct(r2(100 - repW))} sur le 10 ans. Les deux poids sont positifs parce que D₅ est ENTRE les durations des ailes.`,
            },
          ],
          pieges: [en
            ? `Weighting by maturities — w = (10 − 5)/(10 − 2) = ${pct(wMat)} — ignores the coupons: the barbell would carry the wrong duration from the start, and d) would measure a level bet, not convexity.`
            : `Pondérer par les maturités — w = (10 − 5)/(10 − 2) = ${pct(wMat)} — ignore les coupons : le barbell partirait avec une duration fausse, et le d) mesurerait un pari de niveau, pas la convexité.`],
        },
        {
          intitule: en ? 'c) The convexity pickup' : 'c) Le surcroît de convexité',
          enonce: en
            ? `By how much does the barbell's convexity exceed the bullet's? (chapter 6 convexities; the solution gives all three values)`
            : `De combien la convexité du barbell dépasse-t-elle celle du bullet ? (convexités au sens du chapitre 6 ; le corrigé donne les trois valeurs)`,
          reponse: repPickup, tolerance: 0.01,
          etapes: [
            {
              titre: en ? 'The three convexities' : 'Les trois convexités',
              contenu: en
                ? `Chapter 6 computation (second derivative of price): C(2y) = ${f(r2(conv2))}, C(5y) = ${f(r2(conv5))}, C(10y) = ${f(r2(conv10))}. Convexity grows roughly with the SQUARE of maturity — much faster than duration.`
                : `Calcul du chapitre 6 (dérivée seconde du prix) : C(2 ans) = ${f(r2(conv2))}, C(5 ans) = ${f(r2(conv5))}, C(10 ans) = ${f(r2(conv10))}. La convexité croît à peu près comme le CARRÉ de la maturité — bien plus vite que la duration.`,
            },
            {
              titre: en ? "The barbell's convexity" : 'La convexité du barbell',
              contenu: en
                ? `Same weighting rule as duration: $C_{barbell}$ = ${pct(repW)} × ${f(r2(conv2))} + ${pct(r2(100 - repW))} × ${f(r2(conv10))} = **${f(r2(convBarbell))}**.`
                : `Même règle de pondération que la duration : $C_{barbell}$ = ${pct(repW)} × ${f(r2(conv2))} + ${pct(r2(100 - repW))} × ${f(r2(conv10))} = **${f(r2(convBarbell))}**.`,
            },
            {
              titre: en ? 'The pickup — and where it comes from' : "Le surcroît — et d'où il vient",
              contenu: en
                ? `${f(r2(convBarbell))} − ${f(r2(conv5))} = **+${f(repPickup)}** of convexity at EQUAL duration. No magic: convexity weights flows by t(t+1), so dispersing the flows away from the barycentre (wings instead of belly) always adds convexity. Same duration, more curvature.`
                : `${f(r2(convBarbell))} − ${f(r2(conv5))} = **+${f(repPickup)}** de convexité à duration ÉGALE. Aucune magie : la convexité pondère les flux par t(t+1) — disperser les flux loin du barycentre (les ailes plutôt que le ventre) ajoute toujours de la convexité. Même duration, plus de courbure.`,
            },
          ],
          pieges: [en
            ? `Comparing C(10y) = ${f(r2(conv10))} to C(5y): the barbell is not the 10-year alone — its convexity is the weighted MIX, ${f(r2(convBarbell))}.`
            : `Comparer C(10 ans) = ${f(r2(conv10))} à C(5 ans) : le barbell n'est pas le 10 ans seul — sa convexité est le MÉLANGE pondéré, ${f(r2(convBarbell))}.`],
        },
        {
          intitule: en ? 'd) Exact P&L under ±150 bp' : 'd) Le P&L exact sous ±150 pb',
          enonce: en
            ? `Uniform +150 bp shock. Reprice both €${f(vM)}m portfolios exactly; by how much does the barbell outperform the bullet, in euros? (the solution reruns the same computation at −150 bp)`
            : `Choc uniforme de +150 pb. Revalorisez exactement les deux portefeuilles de ${f(vM)} M€ ; de combien le barbell surperforme-t-il le bullet, en € ? (le corrigé refait le même calcul à −150 pb)`,
          reponse: diffUp, tolerance: 0.01, unite: '€',
          etapes: [
            {
              titre: en ? 'Reprice the three lines at +150 bp' : 'Revaloriser les trois souches à +150 pb',
              contenu: en
                ? `Per €1,000 of face: 2-year at ${pct(r2(y2 + 1.5))} → ${f(rp2Up)} €; 5-year at ${pct(r2(y5 + 1.5))} → ${f(rp5Up)} €; 10-year at ${pct(r2(y10 + 1.5))} → ${f(rp10Up)} €.`
                : `Pour 1 000 € de pair : 2 ans à ${pct(r2(y2 + 1.5))} → ${f(rp2Up)} € ; 5 ans à ${pct(r2(y5 + 1.5))} → ${f(rp5Up)} € ; 10 ans à ${pct(r2(y10 + 1.5))} → ${f(rp10Up)} €.`,
            },
            {
              titre: en ? 'The two portfolios after the shock' : 'Les deux portefeuilles après le choc',
              contenu: en
                ? `Bullet: €${f(vM)}m × ${f(rp5Up)}/1 000 = ${eur(r2(bulletUp))}. Barbell: €${f(vM)}m × (${pct(repW)} × ${f(rp2Up)} + ${pct(r2(100 - repW))} × ${f(rp10Up)})/1 000 = ${eur(r2(barbellUp))}. Outperformance: **+${eur(diffUp)}**.`
                : `Bullet : ${f(vM)} M€ × ${f(rp5Up)}/1 000 = ${eur(r2(bulletUp))}. Barbell : ${f(vM)} M€ × (${pct(repW)} × ${f(rp2Up)} + ${pct(r2(100 - repW))} × ${f(rp10Up)})/1 000 = ${eur(r2(barbellUp))}. Surperformance : **+${eur(diffUp)}**.`,
            },
            {
              titre: en ? 'The same shock downwards' : 'Le même choc à la baisse',
              contenu: en
                ? `At −150 bp: 2-year ${f(rp2Dn)} €, 5-year ${f(rp5Dn)} €, 10-year ${f(rp10Dn)} €. Bullet ${eur(r2(bulletDn))}, barbell ${eur(r2(barbellDn))}: outperformance **+${eur(diffDn)}**. The barbell wins on BOTH sides — at equal duration the first-order terms cancel, and the extra convexity of c) decides, whichever way rates jump.`
                : `À −150 pb : 2 ans ${f(rp2Dn)} €, 5 ans ${f(rp5Dn)} €, 10 ans ${f(rp10Dn)} €. Bullet ${eur(r2(bulletDn))}, barbell ${eur(r2(barbellDn))} : surperformance **+${eur(diffDn)}**. Le barbell gagne DES DEUX CÔTÉS — à duration égale, les premiers ordres s'annulent et le surcroît de convexité du c) tranche, quel que soit le sens du choc.`,
            },
          ],
          pieges: [en
            ? `Concluding from equal durations that the P&Ls will match: true to FIRST order only. Over 150bp, the second-order term — ½ × ΔC × Δy² × V ≈ ${eur(r2(0.5 * repPickup * 0.015 * 0.015 * v))} — is precisely what you are measuring.`
            : `Conclure de l'égalité des durations que les P&L seront égaux : vrai au PREMIER ordre seulement. Sur 150 pb, le terme d'ordre 2 — ½ × ΔC × Δy² × V ≈ ${eur(r2(0.5 * repPickup * 0.015 * 0.015 * v))} — est précisément ce que vous mesurez.`],
        },
        {
          intitule: en ? 'e) The price of the pickup: carry' : 'e) Le prix du pickup : le portage',
          enonce: en
            ? `What running yield does the barbell give up against the bullet, in bp per year? (weighted yield of the wings versus the 5-year's yield)`
            : `Quel rendement de portage le barbell abandonne-t-il face au bullet, en pb par an ? (rendement pondéré des ailes contre le rendement du 5 ans)`,
          reponse: repGiveUp, tolerance: 0.005, unite: en ? 'bp' : 'pb',
          etapes: [
            {
              titre: en ? 'The two running yields' : 'Les deux rendements de portage',
              contenu: en
                ? `Barbell: ${pct(repW)} × ${pct(y2)} + ${pct(r2(100 - repW))} × ${pct(y10)} = ${pct(r2(portageBarbell), 3)}. Bullet: ${pct(y5)}. The belly trades ABOVE the 2s-10s chord (the curve is humped): the bullet carries better.`
                : `Barbell : ${pct(repW)} × ${pct(y2)} + ${pct(r2(100 - repW))} × ${pct(y10)} = ${pct(r2(portageBarbell), 3)}. Bullet : ${pct(y5)}. Le ventre cote AU-DESSUS de la corde 2-10 (courbe bossue) : le bullet porte mieux.`,
            },
            {
              titre: en ? 'The give-up, in bp and in euros' : 'Le manque à gagner, en pb et en euros',
              contenu: en
                ? `(${pct(y5)} − ${pct(r2(portageBarbell), 3)}) × 100 = **${f(repGiveUp)} bp per year**, i.e. about ${eur(giveUpEur)} per year on €${f(vM)}m.`
                : `(${pct(y5)} − ${pct(r2(portageBarbell), 3)}) × 100 = **${f(repGiveUp)} pb par an**, soit environ ${eur(giveUpEur)} par an sur ${f(vM)} M€.`,
            },
            {
              titre: en ? 'The desk conclusion' : 'La conclusion de desk',
              contenu: en
                ? `The barbell beat the bullet by ${eur(diffUp)} at +150bp AND by ${eur(diffDn)} at −150bp: that is the convexity pickup of c) at work — it pays whenever rates MOVE big, either way. Its price is e): ${f(repGiveUp)} bp of carry given up every year the curve stays still. Selling the belly to buy the wings is therefore a volatility trade financed by carry — and the reverse trade (bullet against barbell) is what a carry-hungry desk does when it expects calm. Nothing is free: you are choosing between being paid to wait and being paid to be surprised.`
                : `Le barbell a battu le bullet de ${eur(diffUp)} à +150 pb ET de ${eur(diffDn)} à −150 pb : c'est le surcroît de convexité du c) au travail — il paie dès que les taux BOUGENT fort, dans un sens comme dans l'autre. Son prix, c'est le e) : ${f(repGiveUp)} pb de portage abandonnés chaque année où la courbe ne bouge pas. Vendre le ventre pour acheter les ailes est donc un pari de volatilité financé par du portage — et le trade inverse (bullet contre barbell) est celui d'un desk avide de portage qui anticipe le calme. Rien n'est gratuit : vous choisissez entre être payé à attendre et être payé à être surpris.`,
            },
          ],
          pieges: [en
            ? `Reading d) as a free lunch: over a still year, the barbell loses ${eur(giveUpEur)} of carry — it takes a large move (±150bp pays ${eur(diffUp)}) for the convexity to repay the waiting.`
            : `Lire le d) comme un repas gratuit : sur une année sans mouvement, le barbell perd ${eur(giveUpEur)} de portage — il faut un grand mouvement (±150 pb paie ${eur(diffUp)}) pour que la convexité rembourse l'attente.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 18. m4-pb-portage-leve — N4, boss 5                                 */
/* Carry trade financé en repo : le portage encaissé, et le mouvement  */
/* de taux qui l'efface.                                               */
/* ------------------------------------------------------------------ */
const portageLeve: ProblemGenerator = {
  id: 'm4-pb-portage-leve', moduleId: M4,
  titre: 'Carry trade financé en repo : le portage et son piège',
  titreEn: 'A repo-funded carry trade: the carry and its trap',
  typeDeCas: 'portage avec levier',
  typeDeCasEn: 'leveraged carry',
  difficulte: 4,
  scenarios: ['Hedge fund qui monte un carry trade avec levier', 'Desk de trésorerie qui porte du papier financé en pension', 'Book de prop interne qui défend sa position au risque'],
  scenariosEn: ['Hedge fund running a leveraged carry trade', 'Treasury desk carrying repo-funded paper', 'Internal prop book defending the position to risk'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const faceM = pick(rng, [5, 10, 20] as const);
    const prixPct = randFloat(rng, 96, 104, 2);
    const haircut = pick(rng, [1, 2, 3] as const);
    const tauxRepo = randFloat(rng, 1.8, 3.2, 2);
    const couponPct = r2(tauxRepo + randFloat(rng, 0.9, 2.4, 2)); // coupon > repo : carry positif par construction
    const jours = pick(rng, [60, 90, 120] as const);
    const dMod = randFloat(rng, 5.5, 8.5, 2);
    const haussePb = pick(rng, [10, 15, 25] as const);

    const faceEur = faceM * 1_000_000;
    const mv = (faceEur * prixPct) / 100;
    const cash = mv * (1 - haircut / 100);
    const couru = couponCouru(couponPct, faceEur, jours, 365);
    const cout = interetMonetaire(cash, tauxRepo, jours);
    const repCouru = r2(couru);
    const repCout = r2(cout);
    // Carry, P&L et point mort calculés sur les chiffres AFFICHÉS en a) et b).
    const carryEur = r2(repCouru - repCout);
    const repCarryBp = r2(((repCouru - repCout) / cash) * (360 / jours) * 10000);
    const seuil = ((couru / cash) * 360 * 100) / jours;
    const repSeuil = r3(seuil);
    const effetPrix = dMod * (haussePb / 10000) * mv;
    const pnl = r2(carryEur - effetPrix);
    const tolPnl = r2(Math.min(1000, Math.max(150, Math.abs(pnl) * 0.02)));
    const mouvPointMortPb = r2((carryEur / (dMod * mv)) * 10000); // la hausse qui efface exactement le carry

    const { en, f, eur, pct } = outils(langue);
    const termes = en
      ? `€${f(faceM)}m face value of an OAT bought at ${pct(prixPct)} of par, carrying a ${pct(couponPct)} coupon (accrued Actual/365 on face value) and a modified duration of ${f(dMod)}; the position is financed in repo over ${jours} days at a repo rate of ${pct(tauxRepo)} (Actual/360), with a ${pct(haircut, 0)} haircut on market value`
      : `${f(faceM)} M€ de nominal d'une OAT achetée à ${pct(prixPct)} du pair, coupon ${pct(couponPct)} (couru en Exact/365 sur le nominal), duration modifiée ${f(dMod)} ; position financée en pension sur ${jours} jours au taux repo de ${pct(tauxRepo)} (Exact/360), avec un haircut de ${pct(haircut, 0)} sur la valeur de marché`;
    const contexte = (en
      ? [
        `Your hedge fund's rates book runs on leverage — own the bond, repo it out, pocket the difference: ${termes}. The PM signs off only on a full carry file: accrued earned, funding cost, net carry in annualised basis points, break-even repo — and the stress that kills the trade.`,
        `On the bank's treasury desk, the position is supposed to "pay you to hold it": ${termes}. Before rolling the repo, the head of desk wants the period arithmetic, the margin in basis points, and the level beyond which the carry turns into a loss.`,
        `Your internal prop book defends the position at the monthly risk committee: ${termes}. The risk manager's two questions never change: what does it earn if nothing moves — and what move wipes it out?`,
      ]
      : [
        `Le book taux de votre hedge fund tourne au levier — détenir le titre, le mettre en pension, encaisser la différence : ${termes}. Le gérant ne signe que sur un dossier de carry complet : couru gagné, coût du financement, carry net en points de base annualisés, repo de point mort — et le stress qui tue le trade.`,
        `À la trésorerie de la banque, la position est censée « vous payer pour la porter » : ${termes}. Avant de rouler la pension, le chef de desk veut l'arithmétique de la période, la marge en points de base, et le niveau au-delà duquel le carry devient une perte.`,
        `Votre book de prop interne défend la position au comité des risques mensuel : ${termes}. Les deux questions du risk manager ne changent jamais : combien ça rapporte si rien ne bouge — et quel mouvement efface tout ?`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The accrued earned' : 'a) Le couru gagné',
          enonce: en
            ? `How much accrued coupon does the position earn over the ${jours} days, in euros?`
            : `Combien de coupon couru la position gagne-t-elle sur les ${jours} jours, en euros ?`,
          reponse: repCouru, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'The coupon runs on face value' : 'Le coupon court sur le nominal',
            contenu: en
              ? `During the repo you remain the bond's economic owner: the accrued is yours. €${f(faceM)}m × ${pct(couponPct)} × ${jours}/365 = **${eur(repCouru)}**.`
              : `Pendant la pension, vous restez le propriétaire économique du titre : le couru vous revient. ${f(faceM)} M€ × ${pct(couponPct)} × ${jours}/365 = **${eur(repCouru)}**.`,
          }],
          pieges: [en
            ? `Accruing on market value (${eur(r2(couponCouru(couponPct, mv, jours, 365)))}): the coupon runs on FACE value whatever the price did.`
            : `Faire courir le coupon sur la valeur de marché (${eur(r2(couponCouru(couponPct, mv, jours, 365)))}) : le coupon court sur le NOMINAL, quoi qu'ait fait le prix.`],
        },
        {
          intitule: en ? 'b) The repo cost' : 'b) Le coût du repo',
          enonce: en
            ? `What does the repo funding cost over the period, in euros? (cash raised = market value less the haircut)`
            : `Que coûte le financement en pension sur la période, en euros ? (cash levé = valeur de marché moins le haircut)`,
          reponse: repCout, tolerance: 0.005, unite: '€',
          etapes: [
            {
              titre: en ? 'The cash actually raised' : 'Le cash réellement levé',
              contenu: en
                ? `Collateral: €${f(faceM)}m × ${pct(prixPct)} = ${eur(r2(mv))}. The lender keeps a cushion: cash = ${f(r2(mv))} × (1 − ${pct(haircut, 0)}) = **${eur(r2(cash))}**.`
                : `Collatéral : ${f(faceM)} M€ × ${pct(prixPct)} = ${eur(r2(mv))}. Le prêteur garde un coussin : cash = ${f(r2(mv))} × (1 − ${pct(haircut, 0)}) = **${eur(r2(cash))}**.`,
            },
            {
              titre: en ? 'Money-market interest' : "L'intérêt monétaire",
              contenu: en
                ? `Actual/360, like everything on the money market: ${f(r2(cash))} × ${pct(tauxRepo)} × ${jours}/360 = **${eur(repCout)}**.`
                : `Exact/360, comme tout le marché monétaire : ${f(r2(cash))} × ${pct(tauxRepo)} × ${jours}/360 = **${eur(repCout)}**.`,
            },
          ],
          pieges: [
            en
              ? `Forgetting the haircut and funding the full ${eur(r2(mv))} — or accruing the repo Actual/365 (${eur(r2(interetMonetaire(cash, tauxRepo, jours, 365)))}): repo counts Actual/360.`
              : `Oublier le haircut et financer les ${eur(r2(mv))} entiers — ou faire courir le repo en Exact/365 (${eur(r2(interetMonetaire(cash, tauxRepo, jours, 365)))}) : la pension se compte en Exact/360.`,
          ],
        },
        {
          intitule: en ? 'c) The net carry, annualised in bp' : 'c) Le carry net, annualisé en pb',
          enonce: en
            ? `What is the net carry of the period (accrued − repo cost) expressed in basis points per year on the cash raised (Actual/360)? (the solution also gives the euro figure)`
            : `Quel est le carry net de la période (couru − coût du repo), exprimé en points de base par an sur le cash levé (Exact/360) ? (le corrigé donne aussi le montant en euros)`,
          reponse: repCarryBp, tolerance: 0.005, unite: en ? 'bp' : 'pb',
          etapes: [
            {
              titre: en ? 'The carry in euros' : 'Le carry en euros',
              contenu: en
                ? `${f(repCouru)} − ${f(repCout)} = **${eur(carryEur)}** over ${jours} days. Positive: the position pays you to hold it — so far.`
                : `${f(repCouru)} − ${f(repCout)} = **${eur(carryEur)}** sur ${jours} jours. Positif : la position vous paie pour la porter — jusqu'ici.`,
            },
            {
              titre: en ? 'Annualise on the cash at work' : 'Annualiser sur le cash mobilisé',
              contenu: en
                ? `${f(carryEur)} / ${f(r2(cash))} × 360/${jours} × 10 000 = **${f(repCarryBp)} bp per year**. This is the trade's net margin — THE comparable number from one carry trade to the next, whatever the size or the holding period.`
                : `${f(carryEur)} / ${f(r2(cash))} × 360/${jours} × 10 000 = **${f(repCarryBp)} pb par an**. C'est la marge nette du trade — LE chiffre comparable d'un carry trade à l'autre, quelles que soient la taille et la durée de détention.`,
            },
          ],
          pieges: [en
            ? `Annualising on face value instead of the cash raised gives ${f(r2(((repCouru - repCout) / faceEur) * (360 / jours) * 10000))} bp: the margin of a LEVERAGED trade is measured against the funding it consumes.`
            : `Annualiser sur le nominal plutôt que sur le cash levé donne ${f(r2(((repCouru - repCout) / faceEur) * (360 / jours) * 10000))} pb : la marge d'un trade à LEVIER se mesure contre le financement qu'il consomme.`],
        },
        {
          intitule: en ? 'd) The break-even repo rate' : 'd) Le taux repo de point mort',
          enonce: en
            ? `At what repo rate (in %) does the period's carry fall exactly to zero?`
            : `À quel taux repo (en %) le carry de la période tombe-t-il exactement à zéro ?`,
          reponse: repSeuil, tolerance: 0.005, unite: '%',
          etapes: [
            {
              titre: en ? 'Set funding cost equal to accrued' : 'Égaliser coût du financement et couru',
              contenu: en
                ? `${f(r2(cash))} × r* × ${jours}/360 = ${f(repCouru)} ⟹ r* = ${f(repCouru)} × 360 / (${f(r2(cash))} × ${jours}) = **${pct(repSeuil, 3)}**.`
                : `${f(r2(cash))} × r* × ${jours}/360 = ${f(repCouru)} ⟹ r* = ${f(repCouru)} × 360 / (${f(r2(cash))} × ${jours}) = **${pct(repSeuil, 3)}**.`,
            },
            {
              titre: en ? 'Cross-check with c)' : 'Recouper avec le c)',
              contenu: en
                ? `r* − current repo = ${pct(repSeuil, 3)} − ${pct(tauxRepo)} ≈ ${f(r2((repSeuil - tauxRepo) * 100))} bp — exactly the annualised carry of c). The margin in basis points IS the distance to break-even: one number, two readings. The desk reruns it at every repo fixing; a bond funding far below GC is "special" — its carry survives much higher rates.`
                : `r* − repo actuel = ${pct(repSeuil, 3)} − ${pct(tauxRepo)} ≈ ${f(r2((repSeuil - tauxRepo) * 100))} pb — exactement le carry annualisé du c). La marge en points de base EST la distance au point mort : un seul chiffre, deux lectures. Le desk le refait à chaque fixing du repo ; un titre qui se finance loin sous le GC est « spécial » — son carry survit à des taux bien plus hauts.`,
            },
          ],
        },
        {
          intitule: en ? 'e) Total P&L if rates drift up' : 'e) Le P&L total si les taux montent',
          enonce: en
            ? `Stress the trade: over the holding period, yields on the line rise by ${haussePb} bp. What is the trade's total P&L (net carry + first-order price effect on market value), in euros? (signed answer)`
            : `Stressez le trade : sur la période de détention, les taux de la souche montent de ${haussePb} pb. Quel est le P&L total de l'opération (carry net + effet prix au premier ordre sur la valeur de marché), en € ? (réponse signée)`,
          reponse: pnl, tolerance: tolPnl, toleranceMode: 'absolu', unite: '€',
          etapes: [
            {
              titre: en ? 'The price effect' : "L'effet prix",
              contenu: en
                ? `$\\Delta P \\approx -D_{mod} \\times \\Delta y \\times MV$ = −${f(dMod)} × ${f(haussePb / 10000, 4)} × ${f(r2(mv))} = **${eur(r2(-effetPrix))}** — on the bond's market value, not on the cash raised: the price risk sits on the WHOLE position, leverage or not.`
                : `$\\Delta P \\approx -D_{mod} \\times \\Delta y \\times MV$ = −${f(dMod)} × ${f(haussePb / 10000, 4)} × ${f(r2(mv))} = **${eur(r2(-effetPrix))}** — sur la valeur de marché du titre, pas sur le cash levé : le risque de prix porte sur TOUTE la position, levier ou pas.`,
            },
            {
              titre: en ? 'Carry plus price' : 'Carry plus prix',
              contenu: en
                ? `${eur(carryEur)} + (${eur(r2(-effetPrix))}) = **${eur(pnl)}**. ${pnl < 0 ? `The carry patiently earned over ${jours} days is wiped out by a ${haussePb}bp drift: THE classic carry-trade trap — you collect basis points and risk percents.` : `The carry survives this time — but look how little margin ${haussePb}bp leaves: the trade collects basis points and risks percents.`}`
                : `${eur(carryEur)} + (${eur(r2(-effetPrix))}) = **${eur(pnl)}**. ${pnl < 0 ? `Le carry patiemment gagné sur ${jours} jours est effacé par une dérive de ${haussePb} pb : LE piège classique du carry trade — on encaisse des points de base et on risque des pourcents.` : `Le carry survit cette fois — mais voyez le peu de marge que laissent ${haussePb} pb : le trade encaisse des points de base et risque des pourcents.`}`,
            },
            {
              titre: en ? 'The move that erases the carry' : 'Le mouvement qui efface le carry',
              contenu: en
                ? `Break-even move: carry / (D_mod × MV) = ${f(carryEur)} / (${f(dMod)} × ${f(r2(mv))}) ≈ **${f(mouvPointMortPb)} bp**. Beyond that, the leverage works against you. A funded carry position is implicitly SHORT rate volatility: capped gain (the carry), open-ended loss via duration — which is why desks cap it with a stop or a hedge, and why "picking up carry" before a central-bank meeting is a desk classic that risk committees love to reread.`
                : `Mouvement de point mort : carry / (D_mod × MV) = ${f(carryEur)} / (${f(dMod)} × ${f(r2(mv))}) ≈ **${f(mouvPointMortPb)} pb**. Au-delà, le levier travaille contre vous. Une position de portage financée est implicitement SHORT volatilité des taux : gain plafonné (le carry), perte ouverte via la duration — c'est pourquoi les desks la bornent d'un stop ou d'une couverture, et pourquoi « ramasser du carry » avant une réunion de banque centrale est un classique que les comités des risques adorent relire.`,
            },
          ],
          pieges: [
            en
              ? `Applying the duration to face value (${eur(r2(dMod * (haussePb / 10000) * faceEur))} of price effect) — or comparing the ${haussePb}bp move to the ANNUALISED carry of c): over the period, the cushion is only ${eur(carryEur)}, i.e. ${f(mouvPointMortPb)} bp of move.`
              : `Appliquer la duration au nominal (${eur(r2(dMod * (haussePb / 10000) * faceEur))} d'effet prix) — ou comparer la hausse de ${haussePb} pb au carry ANNUALISÉ du c) : sur la période, le coussin n'est que de ${eur(carryEur)}, soit ${f(mouvPointMortPb)} pb de mouvement.`,
          ],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 19. m4-pb-adjudication-svt — N4, boss 6                             */
/* Soumettre à l'adjudication : courbe ZC → prix → YTM → prix limite   */
/* → winner's curse (chapitre 2 : enchère à prix multiples).           */
/* ------------------------------------------------------------------ */
const adjudicationSvt: ProblemGenerator = {
  id: 'm4-pb-adjudication-svt', moduleId: M4,
  titre: "Soumettre à l'adjudication : prix, marge, winner's curse",
  titreEn: "Bidding at the auction: price, margin, winner's curse",
  typeDeCas: 'marché primaire',
  typeDeCasEn: 'primary market',
  difficulte: 4,
  scenarios: ["SVT qui prépare sa soumission à l'adjudication d'OAT", 'Hedge fund qui passe son ordre via un SVT', "Trésorier institutionnel qui suit l'adjudication pour acheter au secondaire"],
  scenariosEn: ['Primary dealer (SVT) preparing its OAT auction bid', 'Hedge fund routing its order through a primary dealer', 'Institutional treasurer tracking the auction for a secondary purchase'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const z1 = randFloat(rng, 1.6, 3, 2);
    const z2 = r2(z1 + randInt(rng, 15, 40) / 100);
    const z3 = r2(z2 + randInt(rng, 15, 40) / 100);
    const coupon = randFloat(rng, 1, 4.5, 2); // coupon HÉRITÉ de la souche réémise : peut être loin des taux du jour
    const margePb = pick(rng, [4, 6, 8] as const);
    const servisM = pick(rng, [50, 100, 200] as const);

    const c = (1000 * coupon) / 100;
    const va1 = va(c, z1, 1);
    const va2 = va(c, z2, 2);
    const va3 = va(c + 1000, z3, 3);
    const pTheo = va1 + va2 + va3;
    const ytm = ytmParDichotomie(1000, coupon, 3, pTheo);
    const pz2 = prixObligation(1000, coupon, 3, z2);
    const pz3 = prixObligation(1000, coupon, 3, z3);
    const yInterp = z2 + ((pz2 - pTheo) / (pz2 - pz3)) * (z3 - z2);
    const repPTheo = r2(pTheo);
    const repYtm = r3(ytm);
    // Le prix limite se déduit du YTM AFFICHÉ en b) : l'élève qui enchaîne retombe au centime.
    const repPLim = r2(prixObligation(1000, coupon, 3, repYtm + margePb / 100));
    const titres = servisM * 1000; // servisM M€ de nominal / 1 000 € par titre
    const pnl = r2((repPTheo - repPLim) * titres);
    const pAgressif = r2(prixObligation(1000, coupon, 3, repYtm - margePb / 100));
    const perteCurse = r2((pAgressif - repPTheo) * titres);
    const dModSouche = durationModifiee(durationMacaulay(1000, coupon, 3, repYtm), repYtm);
    const ecartZ3Pb = r2((z3 - repYtm) * 100);

    const { en, f, eur, pct } = outils(langue);
    const marche = en
      ? `This morning the AFT taps an existing line: ${pct(coupon)} coupon (annual, just detached — no accrued), €1,000 face value, exactly 3 years to maturity. The zero-coupon curve off your pricer reads: 1-year ${pct(z1)}, 2-year ${pct(z2)}, 3-year ${pct(z3)}`
      : `Ce matin, l'AFT abonde une souche existante : coupon ${pct(coupon)} (annuel, tout juste détaché — pas de couru), nominal 1 000 €, exactement 3 ans à courir. La courbe zéro-coupon de votre pricer : 1 an ${pct(z1)}, 2 ans ${pct(z2)}, 3 ans ${pct(z3)}`;
    const contexte = (en
      ? [
        `As a primary dealer (SVT), you are committed to bid at today's multiple-price auction. ${marche}. Before the deadline you need four numbers: the fair price off the curve, the yield it implies, your limit price for the margin the committee demands — and what the trade pays if you are filled and the line reverts to fair value.`,
        `Your hedge fund wants the paper and routes its order through one of the fifteen SVTs. ${marche}. The dealer executes, but the homework is yours: fair value flow by flow, implied yield, the limit price you give him, and the P&L if you are served and exit at fair.`,
        `As an institutional treasurer you will not bid, but the auction will reprice the whole 3-year sector and you plan to buy just after the results. ${marche}. You rerun the SVT arithmetic to tell a rich auction from a cheap one: fair price, yield, the limit a margin-driven bidder would post, and what that margin is worth.`,
      ]
      : [
        `SVT, vous êtes engagé à soumissionner à l'adjudication à prix multiples du jour. ${marche}. Avant l'heure limite, il vous faut quatre chiffres : le prix théorique lu sur la courbe, le rendement qu'il implique, votre prix limite pour la marge exigée par le comité — et ce que rapporte l'opération si vous êtes servi et que la souche revient à sa juste valeur.`,
        `Votre hedge fund veut du papier et passe son ordre par l'un des quinze SVT. ${marche}. Le dealer exécute, mais les devoirs sont pour vous : juste valeur flux par flux, rendement implicite, prix limite à lui transmettre, et P&L si vous êtes servi et sortez au juste prix.`,
        `Trésorier institutionnel, vous ne soumissionnerez pas, mais l'adjudication va repricer tout le secteur 3 ans et vous comptez acheter juste après les résultats. ${marche}. Vous refaites l'arithmétique des SVT pour distinguer une adjudication chère d'une adjudication bon marché : prix théorique, rendement, prix limite d'un soumissionnaire à marge, et ce que vaut cette marge.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The fair price off the curve' : 'a) Le prix théorique sur la courbe',
          enonce: en
            ? `Discounting each flow on the zero-coupon curve, what is the theoretical price of the reopened line, in euros?`
            : `En actualisant chaque flux sur la courbe zéro-coupon, quel est le prix théorique de la souche réémise, en euros ?`,
          reponse: repPTheo, tolerance: 0.002, unite: '€',
          etapes: [
            {
              titre: en ? 'Three flows, three zero rates' : 'Trois flux, trois taux zéro',
              contenu: en
                ? `Each flow discounts at ITS pillar — never at an average rate:\n- Year 1: ${eur(c)} / (1 + ${pct(z1)})¹ = ${eur(r2(va1))}\n- Year 2: ${eur(c)} / (1 + ${pct(z2)})² = ${eur(r2(va2))}\n- Year 3: ${eur(c + 1000)} / (1 + ${pct(z3)})³ = ${eur(r2(va3))}`
                : `Chaque flux s'actualise à SON pilier — jamais à un taux moyen :\n- Année 1 : ${eur(c)} / (1 + ${pct(z1)})¹ = ${eur(r2(va1))}\n- Année 2 : ${eur(c)} / (1 + ${pct(z2)})² = ${eur(r2(va2))}\n- Année 3 : ${eur(c + 1000)} / (1 + ${pct(z3)})³ = ${eur(r2(va3))}`,
            },
            {
              titre: en ? 'Sum — and remember why the coupon is what it is' : "Sommer — et se rappeler pourquoi le coupon est ce qu'il est",
              contenu: en
                ? `Fair price: **${eur(repPTheo)}**. At a tap (assimilation), the coupon is INHERITED from the existing line: the price adjusts, never the coupon — that is exactly what makes the new paper fungible with the old.`
                : `Prix théorique : **${eur(repPTheo)}**. À l'abondement (assimilation), le coupon est HÉRITÉ de la souche existante : c'est le prix qui s'ajuste, jamais le coupon — c'est précisément ce qui rend le papier neuf fongible avec l'ancien.`,
            },
          ],
          pieges: [en
            ? `Discounting all three flows at the 3-year zero alone gives ${eur(r2(pz3))}: that flattens the curve you were given — the whole point of a zero curve is one rate per date.`
            : `Tout actualiser au seul zéro 3 ans donne ${eur(r2(pz3))} : c'est écraser la courbe qu'on vous donne — l'intérêt d'une courbe zéro est justement un taux par date.`],
        },
        {
          intitule: en ? 'b) The implied yield (by bracketing)' : 'b) Le rendement implicite (par encadrement)',
          enonce: en
            ? `What yield to maturity does that price imply, in %? The chapter's closed-form ytm2Ans only works at 2 years: bracket the YTM between the 2-year and 3-year zeros, then interpolate (the solution gives the exact value).`
            : `Quel rendement actuariel (YTM) ce prix implique-t-il, en % ? La formule fermée ytm2Ans du chapitre ne vaut qu'à 2 ans : encadrez le YTM entre les zéros 2 ans et 3 ans, puis interpolez (le corrigé donne la valeur exacte).`,
          reponse: repYtm, tolerance: 0.005, unite: '%',
          etapes: [
            {
              titre: en ? 'Bracket' : 'Encadrer',
              contenu: en
                ? `Reprice the bond at a single rate: at ${pct(z2)}, P = ${eur(r2(pz2))} > ${eur(repPTheo)}; at ${pct(z3)}, P = ${eur(r2(pz3))} < ${eur(repPTheo)}. The YTM therefore sits BETWEEN ${pct(z2)} and ${pct(z3)} — price and yield move in opposite directions.`
                : `Revalorisez le titre à taux unique : à ${pct(z2)}, P = ${eur(r2(pz2))} > ${eur(repPTheo)} ; à ${pct(z3)}, P = ${eur(r2(pz3))} < ${eur(repPTheo)}. Le YTM est donc ENTRE ${pct(z2)} et ${pct(z3)} — prix et rendement varient en sens inverse.`,
            },
            {
              titre: en ? 'Interpolate, then state the exact value' : 'Interpoler, puis donner la valeur exacte',
              contenu: en
                ? `Linear interpolation: y ≈ ${f(z2)} + (${f(r2(pz2))} − ${f(repPTheo)}) / (${f(r2(pz2))} − ${f(r2(pz3))}) × (${f(z3)} − ${f(z2)}) = ${pct(r3(yInterp), 3)}. Numerical solution: **${pct(repYtm, 3)}** — the interpolation lands within a fraction of a basis point, because price is almost linear over such a narrow bracket.`
                : `Interpolation linéaire : y ≈ ${f(z2)} + (${f(r2(pz2))} − ${f(repPTheo)}) / (${f(r2(pz2))} − ${f(r2(pz3))}) × (${f(z3)} − ${f(z2)}) = ${pct(r3(yInterp), 3)}. Résolution numérique : **${pct(repYtm, 3)}** — l'interpolation tombe à une fraction de point de base, le prix étant quasi linéaire sur un encadrement aussi étroit.`,
            },
            {
              titre: en ? 'What the YTM is — and is not' : "Ce que le YTM est — et n'est pas",
              contenu: en
                ? `The YTM is a present-value-weighted BLEND of the zero rates. The final flow (face + last coupon) dominates, so it hugs the 3-year zero without reaching it: ${pct(z3)} − ${pct(repYtm, 3)} = ${f(ecartZ3Pb)} bp. One number to quote the line; the curve still does the pricing.`
                : `Le YTM est un MÉLANGE des taux zéro pondéré par les valeurs actuelles. Le flux final (nominal + dernier coupon) domine : il colle au zéro 3 ans sans l'atteindre — ${pct(z3)} − ${pct(repYtm, 3)} = ${f(ecartZ3Pb)} pb. Un seul chiffre pour coter la souche ; c'est toujours la courbe qui valorise.`,
            },
          ],
          pieges: [en
            ? `Quoting the 3-year zero (${pct(z3)}) as the line's YTM: ${f(ecartZ3Pb)} bp off — real money on €${f(servisM)}m of bids.`
            : `Annoncer le zéro 3 ans (${pct(z3)}) comme YTM de la souche : ${f(ecartZ3Pb)} pb d'écart — du vrai argent sur ${f(servisM)} M€ de soumission.`],
        },
        {
          intitule: en ? 'c) The limit price to bid' : 'c) Le prix limite à soumettre',
          enonce: en
            ? `Your committee demands a margin of ${margePb} bp of yield over fair value to pay for underwriting risk. What limit price do you post, in euros?`
            : `Votre comité exige une marge de ${margePb} pb de rendement au-dessus de la juste valeur pour rémunérer le risque de prise ferme. Quel prix limite affichez-vous, en € ?`,
          reponse: repPLim, tolerance: 0.002, unite: '€',
          etapes: [
            {
              titre: en ? 'The margin is taken in YIELD' : 'La marge se prend en RENDEMENT',
              contenu: en
                ? `Bidding yield: ${pct(repYtm, 3)} + ${margePb} bp = ${pct(r3(repYtm + margePb / 100), 3)}. A primary margin is always quoted in basis points of yield — that is the language of the auction.`
                : `Taux de soumission : ${pct(repYtm, 3)} + ${margePb} pb = ${pct(r3(repYtm + margePb / 100), 3)}. Une marge de primaire se cote toujours en points de base de rendement — c'est la langue de l'adjudication.`,
            },
            {
              titre: en ? 'Reprice at the bidding yield' : 'Revaloriser au taux de soumission',
              contenu: en
                ? `P(${pct(r3(repYtm + margePb / 100), 3)}) = **${eur(repPLim)}**. Duration cross-check: ΔP ≈ −D_mod × Δy × P = −${f(r3(dModSouche), 3)} × ${f(margePb / 10000, 4)} × ${f(repPTheo)} = ${eur(r2(-dModSouche * (margePb / 10000) * repPTheo))} — consistent with ${f(repPLim)} − ${f(repPTheo)} = ${eur(r2(repPLim - repPTheo))}.`
                : `P(${pct(r3(repYtm + margePb / 100), 3)}) = **${eur(repPLim)}**. Recoupement duration : ΔP ≈ −D_mod × Δy × P = −${f(r3(dModSouche), 3)} × ${f(margePb / 10000, 4)} × ${f(repPTheo)} = ${eur(r2(-dModSouche * (margePb / 10000) * repPTheo))} — cohérent avec ${f(repPLim)} − ${f(repPTheo)} = ${eur(r2(repPLim - repPTheo))}.`,
            },
          ],
          pieges: [en
            ? `Knocking ${margePb} cents off the price (${eur(r2(repPTheo - margePb / 100))}): the margin lives in yield space — ${margePb} bp of yield are worth ≈ ${eur(r2(dModSouche * (margePb / 10000) * repPTheo))} of price here, via the duration.`
            : `Retrancher ${margePb} centimes au prix (${eur(r2(repPTheo - margePb / 100))}) : la marge vit dans l'espace des rendements — ${margePb} pb de taux valent ici ≈ ${eur(r2(dModSouche * (margePb / 10000) * repPTheo))} de prix, via la duration.`],
        },
        {
          intitule: en ? "d) P&L if filled — and the winner's curse" : "d) Le P&L si servi — et la winner's curse",
          enonce: en
            ? `The auction clears and you are filled on €${f(servisM)}m of face value at your limit price. Minutes later the line trades in the secondary at the fair price from a). What P&L does your margin lock in, in euros?`
            : `L'adjudication tombe : vous êtes servi sur ${f(servisM)} M€ de nominal à votre prix limite. Quelques minutes plus tard, la souche traite au secondaire au prix théorique du a). Quel P&L votre marge verrouille-t-elle, en € ?`,
          reponse: pnl, tolerance: 0.005, unite: '€',
          etapes: [
            {
              titre: en ? 'The price gap, scaled to the allotment' : "L'écart de prix, à l'échelle du montant servi",
              contenu: en
                ? `Bought at ${eur(repPLim)}, worth ${eur(repPTheo)}: +${eur(r2(repPTheo - repPLim))} per €1,000 bond, × ${f(titres)} bonds = **+${eur(pnl)}**. That is the underwriting margin doing its job — paid for warehousing the paper.`
                : `Acheté ${eur(repPLim)}, vaut ${eur(repPTheo)} : +${eur(r2(repPTheo - repPLim))} par titre de 1 000 €, × ${f(titres)} titres = **+${eur(pnl)}**. C'est la marge de prise ferme qui fait son travail — la rémunération du portage du papier.`,
            },
            {
              titre: en ? "The winner's curse, with numbers" : "La winner's curse, chiffrée",
              contenu: en
                ? `The dealer who wanted CERTAINTY of allocation bid ${margePb} bp BELOW fair yield: he paid ${eur(pAgressif)} per bond and, marked back to fair value, books ${eur(perteCurse)} on the same €${f(servisM)}m. Same margin, wrong side: in a multiple-price auction each bidder pays ITS OWN price — being served big because you overpaid is exactly the chapter-2 winner's curse.`
                : `Le dealer qui voulait la CERTITUDE d'être servi a soumis ${margePb} pb SOUS le juste rendement : il a payé ${eur(pAgressif)} par titre et, ramené à la juste valeur, inscrit ${eur(perteCurse)} sur les mêmes ${f(servisM)} M€. Même marge, mauvais côté : à prix multiples, chacun paie SON prix — être largement servi parce qu'on a surpayé, c'est exactement la winner's curse du chapitre 2.`,
            },
            {
              titre: en ? 'The discipline of the primary desk' : 'La discipline du desk de primaire',
              contenu: en
                ? `Anchor the limit on the curve (a → b → c), accept partial fills, and read the bid-to-cover before crying victory: a 0.5bp "win" on a rich auction is a loss wearing makeup. The margin is set BEFORE the results, never after.`
                : `Ancrer le prix limite sur la courbe (a → b → c), accepter d'être servi partiellement, et lire le bid-to-cover avant de crier victoire : « gagner » 0,5 pb sur une adjudication chère est une perte maquillée. La marge se fixe AVANT les résultats, jamais après.`,
            },
          ],
          pieges: [en
            ? `Assuming you pay the auction's stop price as in a uniform-price auction: the French format is multiple-price — every filled bid pays its own price, which is why the limit price IS the risk decision.`
            : `Croire qu'on paie le prix limite de l'adjudication comme dans une enchère à prix uniforme : le format français est à prix multiples — chaque ordre servi paie son propre prix, et c'est pourquoi le prix limite EST la décision de risque.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 20. m4-pb-alm-gap — N4, boss 7                                      */
/* Mini-ALM bancaire : duration gap, ΔEVE, couverture — et les limites */
/* du gap en une étape qualitative.                                    */
/* ------------------------------------------------------------------ */
const almGap: ProblemGenerator = {
  id: 'm4-pb-alm-gap', moduleId: M4,
  titre: 'Duration gap : la transformation bancaire sous +100 pb',
  titreEn: 'Duration gap: bank maturity transformation under +100bp',
  typeDeCas: 'gestion actif-passif',
  typeDeCasEn: 'asset-liability management',
  difficulte: 4,
  scenarios: ["Desk ALM d'une banque de détail", 'Comité des risques qui challenge le gap', "Mission d'inspection du superviseur"],
  scenariosEn: ['Retail-bank ALM desk', 'Risk committee challenging the gap', "Supervisor's on-site inspection team"],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const aMd = pick(rng, [2, 5, 10] as const);
    const fpPct = pick(rng, [6, 8, 10] as const);
    const tauxCredit = randFloat(rng, 3, 5, 2);
    const tauxDepot = randFloat(rng, 0.8, 2, 2);
    const fPct = randFloat(rng, 96, 132, 2);
    const dModFut = randFloat(rng, 7.5, 9.5, 2);

    const aEur = aMd * 1_000_000_000;
    const lMd = r2(aMd * (1 - fpPct / 100));
    const lEur = lMd * 1_000_000_000;
    const fpEur = aEur - lEur;
    const dModA = durationModifiee(durationMacaulay(1000, tauxCredit, 7, tauxCredit), tauxCredit);
    const dModL = durationModifiee(durationMacaulay(1000, tauxDepot, 2, tauxDepot), tauxDepot);
    const levier = lEur / aEur;
    const gap = dModA - dModL * levier;
    const repDModA = r3(dModA);
    const repDModL = r3(dModL);
    const repGap = r3(gap);
    const dEve = r2(-gap * 0.01 * aEur);
    const dv01Eve = gap * 1e-4 * aEur;
    const valeurContrat = (100_000 * fPct) / 100;
    const dv01Fut = valeurContrat * dModFut * 1e-4;
    const contrats = Math.round(dv01Eve / dv01Fut);
    const tolContrats = Math.min(1000, Math.max(1, Math.round(contrats * 0.005)));
    const partFpPct = r2((Math.abs(dEve) / fpEur) * 100);
    const nNaif = Math.round(dv01Eve / (100_000 * dModFut * 1e-4));

    const { en, f, eur, pct } = outils(langue);
    const bilan = en
      ? `Balance sheet, simplified for the exercise: €${f(aMd)}bn of assets — a bullet 7-year loan book at a ${pct(tauxCredit)} client rate, treated as a par bond — funded by €${f(lMd, 2)}bn of deposit-like resources, modelled as a 2-year par liability at ${pct(tauxDepot)}, the remainder being equity. Hedging instrument available: the bond future, €100,000 notional, quoted at ${pct(fPct)} of notional, CTD modified duration ${f(dModFut)}`
      : `Bilan simplifié pour l'exercice : ${f(aMd)} Md€ d'actifs — un portefeuille de crédits in fine 7 ans au taux client de ${pct(tauxCredit)}, traité comme une obligation au pair — financé par ${f(lMd, 2)} Md€ de ressources assimilées à des dépôts, modélisées comme une dette 2 ans au pair à ${pct(tauxDepot)}, le solde étant les fonds propres. Instrument de couverture disponible : le future sur emprunt d'État, notionnel 100 000 €, coté ${pct(fPct)} du notionnel, duration modifiée de la CTD ${f(dModFut)}`;
    const contexte = (en
      ? [
        `On the retail bank's ALM desk, the quarterly file is due: how much economic value does the bank lose if rates jump? ${bilan}. The ALM committee wants both durations, the duration gap, the EVE hit at +100bp, and the size of the futures hedge that would flatten it — plus the caveats, in writing.`,
        `At the risk committee, a board member asks the only question that matters: "if rates rise 100 basis points, what happens to the VALUE of this bank?" ${bilan}. Your job: answer with four numbers — and one honest paragraph on what the gap does not capture.`,
        `The supervisor's inspection team is on site and wants the bank's interest-rate-risk arithmetic reproducible line by line. ${bilan}. You rebuild the file under their eyes: durations of both sides, duration gap, the EVE sensitivity their outlier test watches, and the hedge that would neutralise it.`,
      ]
      : [
        `Au desk ALM de la banque de détail, le dossier trimestriel est dû : combien de valeur économique la banque perd-elle si les taux sautent ? ${bilan}. Le comité ALM veut les deux durations, le duration gap, l'impact EVE à +100 pb, et la taille de la couverture futures qui l'aplatirait — plus les réserves, par écrit.`,
        `Au comité des risques, un administrateur pose la seule question qui compte : « si les taux montent de 100 points de base, qu'arrive-t-il à la VALEUR de cette banque ? » ${bilan}. Votre travail : répondre par quatre chiffres — et un paragraphe honnête sur ce que le gap ne capture pas.`,
        `La mission d'inspection du superviseur est dans les murs et veut une arithmétique du risque de taux reproductible ligne à ligne. ${bilan}. Vous reconstruisez le dossier sous leurs yeux : durations des deux côtés, duration gap, la sensibilité EVE que surveille leur test des outliers, et la couverture qui la neutraliserait.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) Duration of the asset side' : "a) La duration de l'actif",
          enonce: en
            ? `What is the modified duration of the asset side (the 7-year loan book, treated as a par bond)?`
            : `Quelle est la duration modifiée de l'actif (le portefeuille de crédits 7 ans, traité comme une obligation au pair) ?`,
          reponse: repDModA, tolerance: 0.005,
          etapes: [
            ...etapesDurationMac(langue, 1000, tauxCredit, 7, tauxCredit),
            {
              titre: en ? 'Convert to modified duration' : 'Convertir en duration modifiée',
              contenu: en
                ? `$D_{mod}$ = ${f(r3(durationMacaulay(1000, tauxCredit, 7, tauxCredit)), 3)} / ${f(1 + tauxCredit / 100, 4)} = **${f(repDModA, 3)}**. A loan is a bond the market never sees: same flows, same arithmetic.`
                : `$D_{mod}$ = ${f(r3(durationMacaulay(1000, tauxCredit, 7, tauxCredit)), 3)} / ${f(1 + tauxCredit / 100, 4)} = **${f(repDModA, 3)}**. Un crédit est une obligation que le marché ne voit jamais : mêmes flux, même arithmétique.`,
            },
          ],
          pieges: [en
            ? `Taking 7 years because the loans run 7 years: the interest payments pull the barycentre down to ${f(r3(durationMacaulay(1000, tauxCredit, 7, tauxCredit)), 3)} years — maturity is not duration, on a balance sheet either.`
            : `Prendre 7 ans parce que les crédits courent 7 ans : les flux d'intérêts ramènent le barycentre à ${f(r3(durationMacaulay(1000, tauxCredit, 7, tauxCredit)), 3)} ans — la maturité n'est pas la duration, au bilan non plus.`],
        },
        {
          intitule: en ? 'b) Duration of the liability side' : 'b) La duration du passif',
          enonce: en
            ? `Same question for the liability side (the deposit base, modelled as a 2-year par liability).`
            : `Même question pour le passif (la collecte de dépôts, modélisée comme une dette 2 ans au pair).`,
          reponse: repDModL, tolerance: 0.005,
          etapes: [
            ...etapesDurationMac(langue, 1000, tauxDepot, 2, tauxDepot),
            {
              titre: en ? 'Convert to modified duration' : 'Convertir en duration modifiée',
              contenu: en
                ? `$D_{mod}$ = ${f(r3(durationMacaulay(1000, tauxDepot, 2, tauxDepot)), 3)} / ${f(1 + tauxDepot / 100, 4)} = **${f(repDModL, 3)}**.`
                : `$D_{mod}$ = ${f(r3(durationMacaulay(1000, tauxDepot, 2, tauxDepot)), 3)} / ${f(1 + tauxDepot / 100, 4)} = **${f(repDModL, 3)}**.`,
            },
            {
              titre: en ? 'A convention, not a contract' : 'Une convention, pas un contrat',
              contenu: en
                ? `Contractually, sight deposits are due ON DEMAND — duration zero. The 2 years are a BEHAVIOURAL life, estimated from the observed stickiness of the deposit base. Every figure downstream inherits this modelling choice; e) will come back to it.`
                : `Contractuellement, les dépôts à vue sont exigibles À VUE — duration nulle. Les 2 ans sont une durée COMPORTEMENTALE, estimée sur la stabilité observée de la collecte. Tous les chiffres d'aval héritent de ce choix de modélisation ; le e) y reviendra.`,
            },
          ],
        },
        {
          intitule: en ? 'c) The duration gap' : 'c) Le duration gap',
          enonce: en
            ? `Compute the bank's duration gap: gap = D_A − D_L × L/A.`
            : `Calculez le duration gap de la banque : gap = D_A − D_L × L/A.`,
          reponse: repGap, tolerance: 0.005, unite: en ? 'years' : 'années',
          etapes: [
            {
              titre: en ? 'Why the leverage ratio L/A' : 'Pourquoi le ratio de levier L/A',
              contenu: en
                ? `Equity = A − L. Its rate sensitivity is the asset's MINUS the liability's, each weighted by its size: scaling by assets, gap = D_A − D_L × L/A, with L/A = ${f(lMd, 2)}/${f(aMd)} = ${f(r2(levier * 100) / 100, 2)}. The liability only "protects" ${pct(r2(levier * 100), 0)} of the balance sheet.`
                : `Fonds propres = A − L. Leur sensibilité aux taux est celle de l'actif MOINS celle du passif, chacune pesée par sa taille : rapporté à l'actif, gap = D_A − D_L × L/A, avec L/A = ${f(lMd, 2)}/${f(aMd)} = ${f(r2(levier * 100) / 100, 2)}. Le passif ne « protège » que ${pct(r2(levier * 100), 0)} du bilan.`,
            },
            {
              titre: 'Application',
              contenu: en
                ? `gap = ${f(repDModA, 3)} − ${f(repDModL, 3)} × ${f(r2(levier * 100) / 100, 2)} = **${f(repGap, 3)} years**.`
                : `gap = ${f(repDModA, 3)} − ${f(repDModL, 3)} × ${f(r2(levier * 100) / 100, 2)} = **${f(repGap, 3)} années**.`,
            },
            {
              titre: en ? 'Read the sign' : 'Lire le signe',
              contenu: en
                ? `A large POSITIVE gap is the signature of maturity transformation — lend long, fund short. It earns the margin in calm times and loses economic value the day rates RISE: the gap is the price tag of the business model.`
                : `Un gap nettement POSITIF est la signature de la transformation — prêter long, se financer court. Il gagne la marge par temps calme et perd de la valeur économique le jour où les taux MONTENT : le gap est l'étiquette de prix du modèle d'affaires.`,
            },
          ],
          pieges: [en
            ? `Computing D_A − D_L without the leverage (${f(r3(dModA - dModL), 3)}): it understates the gap — the liability weighs only ${pct(r2(levier * 100), 0)} of the assets, so its protection must be scaled down.`
            : `Calculer D_A − D_L sans le levier (${f(r3(dModA - dModL), 3)}) : cela sous-estime le gap — le passif ne pèse que ${pct(r2(levier * 100), 0)} de l'actif, sa protection doit être réduite d'autant.`],
        },
        {
          intitule: en ? 'd) The EVE hit at +100 bp' : "d) L'impact EVE à +100 pb",
          enonce: en
            ? `Parallel shock of +100 bp. Using ΔEVE ≈ −gap × Δy × A, what is the impact on the economic value of equity, in euros? (signed answer)`
            : `Choc parallèle de +100 pb. Avec ΔEVE ≈ −gap × Δy × A, quel est l'impact sur la valeur économique des fonds propres, en € ? (réponse signée)`,
          reponse: dEve, tolerance: 0.01, unite: '€',
          etapes: [
            {
              titre: 'Application',
              contenu: en
                ? `ΔEVE ≈ −${f(repGap, 3)} × 0.01 × ${eur(aEur)} = **${eur(dEve)}** (about €${f(r2(dEve / 1_000_000))}m). The formula is the bank-wide twin of ΔP ≈ −D × Δy × P: the balance sheet is one big bond portfolio, long the assets, short the liabilities.`
                : `ΔEVE ≈ −${f(repGap, 3)} × 0,01 × ${eur(aEur)} = **${eur(dEve)}** (environ ${f(r2(dEve / 1_000_000))} M€). La formule est la jumelle, à l'échelle du bilan, de ΔP ≈ −D × Δy × P : le bilan est un grand portefeuille obligataire, long de l'actif, short du passif.`,
            },
            {
              titre: en ? 'The scale that hurts' : "L'échelle qui fait mal",
              contenu: en
                ? `Equity is worth ${eur(fpEur)}: the shock consumes about ${pct(partFpPct)} of it. This EVE-to-equity ratio is precisely what the supervisor's outlier test monitors — a bank can be profitable every quarter and still be economically fragile to a rate shock.`
                : `Les fonds propres valent ${eur(fpEur)} : le choc en consomme environ ${pct(partFpPct)}. Ce ratio ΔEVE / fonds propres est précisément ce que surveille le test des outliers du superviseur — une banque peut être rentable chaque trimestre et rester économiquement fragile à un choc de taux.`,
            },
          ],
          pieges: [en
            ? `Applying the gap to equity (${eur(r2(-gap * 0.01 * fpEur))}) or to the liabilities: the gap formula is already scaled to TOTAL assets — A is the only consistent base.`
            : `Appliquer le gap aux fonds propres (${eur(r2(-gap * 0.01 * fpEur))}) ou au passif : la formule du gap est déjà rapportée au TOTAL d'actif — A est la seule assiette cohérente.`],
        },
        {
          intitule: en ? 'e) The futures hedge — and the honest caveats' : 'e) La couverture futures — et les réserves honnêtes',
          enonce: en
            ? `How many futures contracts must be SOLD to neutralise the gap, i.e. bring the EVE's DV01 to zero?`
            : `Combien de contrats futures faut-il VENDRE pour annuler le gap, c'est-à-dire ramener le DV01 de l'EVE à zéro ?`,
          reponse: contrats, tolerance: tolContrats, toleranceMode: 'absolu', unite: en ? 'contracts' : 'contrats',
          etapes: [
            {
              titre: en ? "The EVE's DV01" : "Le DV01 de l'EVE",
              contenu: en
                ? `Per basis point: gap × A × 0.0001 = ${f(repGap, 3)} × ${f(aEur)} × 0.0001 = **${eur(r2(dv01Eve))}/bp**.`
                : `Par point de base : gap × A × 0,0001 = ${f(repGap, 3)} × ${f(aEur)} × 0,0001 = **${eur(r2(dv01Eve))}/pb**.`,
            },
            {
              titre: en ? 'The DV01 of one contract' : "Le DV01 d'un contrat",
              contenu: en
                ? `Contract value: 100,000 × ${pct(fPct)} = ${eur(r2(valeurContrat))}; DV01 = ${f(r2(valeurContrat))} × ${f(dModFut)} × 0.0001 = **${eur(r2(dv01Fut))}/bp** (chapter 6 hedge arithmetic, CTD duration).`
                : `Valeur du contrat : 100 000 × ${pct(fPct)} = ${eur(r2(valeurContrat))} ; DV01 = ${f(r2(valeurContrat))} × ${f(dModFut)} × 0,0001 = **${eur(r2(dv01Fut))}/pb** (arithmétique de couverture du chapitre 6, duration de la CTD).`,
            },
            {
              titre: en ? 'The contract count' : 'Le nombre de contrats',
              contenu: en
                ? `N = ${f(r2(dv01Eve))} / ${f(r2(dv01Fut))} = ${f(r2(dv01Eve / dv01Fut))} → **${f(contrats)} contracts** sold. Selling futures injects negative duration: the hedged balance sheet behaves, to first order, as if the gap were zero.`
                : `N = ${f(r2(dv01Eve))} / ${f(r2(dv01Fut))} = ${f(r2(dv01Eve / dv01Fut))} → **${f(contrats)} contrats** à la vente. Vendre des futures injecte de la duration négative : le bilan couvert se comporte, au premier ordre, comme si le gap était nul.`,
            },
            {
              titre: en ? 'What this number does NOT say' : 'Ce que ce chiffre ne dit PAS',
              contenu: en
                ? `Three honest caveats before anyone signs. (1) The gap is ONE number built for a PARALLEL shock: a steepening or a flattening can hit a "gap-neutral" bank — real ALM stresses several curve shapes, not one. (2) The 2-year deposit duration is a BEHAVIOURAL model: if rates rise and customers migrate to term accounts, D_L shrinks exactly when it hurts — the model risk sits on the liability side. (3) EVE is only one leg of banking rate risk; the other is the net interest income (NII), and a hedge that flattens EVE can destabilise NII. That is why real desks hedge mostly with swaps, run EVE AND NII under multiple scenarios, and report both to the supervisor.`
                : `Trois réserves honnêtes avant toute signature. (1) Le gap est UN chiffre construit pour un choc PARALLÈLE : une pentification ou un aplatissement peut frapper une banque « gap-neutre » — l'ALM réel stresse plusieurs déformations de courbe, pas une seule. (2) Les 2 ans de duration des dépôts sont un modèle COMPORTEMENTAL : si les taux montent et que la clientèle migre vers les comptes à terme, D_L raccourcit exactement au mauvais moment — le risque de modèle loge au passif. (3) L'EVE n'est qu'une jambe du risque de taux bancaire ; l'autre est la marge nette d'intérêt (NII), et une couverture qui aplatit l'EVE peut déstabiliser le NII. C'est pourquoi les desks réels couvrent surtout en swaps, font tourner EVE ET NII sous plusieurs scénarios, et rendent compte des deux au superviseur.`,
            },
          ],
          pieges: [en
            ? `Ignoring the futures quote and using the bare notional: N = ${f(nNaif)} contracts — ${f(Math.abs(nNaif - contrats))} contracts of mis-hedge, a level bet nobody approved.`
            : `Ignorer le cours du future et prendre le notionnel brut : N = ${f(nNaif)} contrats — ${f(Math.abs(nNaif - contrats))} contrats d'écart de couverture, un pari de niveau que personne n'a validé.`],
        },
      ],
    };
  },
};

export const problemes: ProblemGenerator[] = [
  // Lot 1 (B8)
  analyseLigne,
  couponCouruTransaction,
  comparaisonDeuxObligations,
  zcVsCoupon,
  nouvelleEmission,
  bootstrapCourbe,
  frnVsFixe,
  spreadSouverain,
  // Lot 2 (B9)
  portefeuilleDuration,
  couvertureFutures,
  ytmRealise,
  obligationIndexee,
  repoFinancement,
  immunisation,
  strategieCourbe,
  convexiteGrosChoc,
  // Lot 3 — quatre boss N4 supplémentaires
  butterfly,
  portageLeve,
  adjudicationSvt,
  almGap,
];
