/**
 * Les 13 générateurs d'exercices d'application du module Taux & obligations.
 *
 * BILINGUES : generate(seed, langue = 'fr'). Invariant absolu : TOUS les tirages
 * aléatoires sont effectués AVANT toute branche de langue — un même seed produit
 * exactement les mêmes nombres, la même réponse et la même tolérance en français
 * et en anglais. Seuls les textes (énoncé, étapes, pièges, unité textuelle) changent.
 *
 * Tous les calculs financiers passent par calculs.ts (aucune formule recopiée).
 * L'ordre des tirages de chaque moule est documenté dans son commentaire
 * « Tirages (ordre strict) » : exercises.test.ts les rejoue avec mulberry32(seed)
 * pour recouper chaque réponse par un calcul direct via calculs.ts.
 */
import { formatNombreLangue } from '../../../engine/answers';
import { mulberry32, pick, randFloat, randInt } from '../../../engine/rng';
import type { ExerciseGenerator, Langue } from '../../../engine/types';
import {
  convexite,
  couponCouru,
  durationMacaulay,
  durationModifiee,
  interetMonetaire,
  prixObligation,
  prixZeroCoupon,
  tauxEffectif,
  tauxForward,
  va,
  ytm2Ans,
} from './calculs';

const M4 = '04-taux-obligations';

const r2 = (v: number) => Math.round(v * 100) / 100;
const r3 = (v: number) => Math.round(v * 1000) / 1000;
const r4 = (v: number) => Math.round(v * 10000) / 10000;

/** Formateurs dépendants de la langue : nombre, montant en euros, pourcentage. */
function formatters(langue: Langue) {
  const f = (v: number, d = 2) => formatNombreLangue(langue, v, d);
  const eur = (v: number, d = 2) => (langue === 'en' ? `€${f(v, d)}` : `${f(v, d)} €`);
  const pct = (v: number, d = 2) => (langue === 'en' ? `${f(v, d)}%` : `${f(v, d)} %`);
  return { f, eur, pct };
}

// ---------------------------------------------------------------------------
// 1. Prix d'une obligation à coupon annuel (N1) — modèle du plan, bilingue
// ---------------------------------------------------------------------------
export const genPrixObligation: ExerciseGenerator = {
  id: 'm4-app-prix-obligation',
  moduleId: M4,
  titre: "Prix d'une obligation à coupon annuel",
  titreEn: 'Price of an annual-coupon bond',
  difficulte: 1,
  // Tirages (ordre strict) : 1. nominal = pick([100, 1000]) · 2. coupon = randFloat(1, 6, 2)
  // · 3. taux = randFloat(0.5, 7, 2), puis si |taux − coupon| < 0,3 : taux = arrondi2(taux + 0,7)
  // · 4. n = randInt(2, 8).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const nominal = pick(rng, [100, 1000] as const);
    const coupon = randFloat(rng, 1, 6, 2);
    let taux = randFloat(rng, 0.5, 7, 2);
    if (Math.abs(taux - coupon) < 0.3) taux = Math.round((taux + 0.7) * 100) / 100;
    const n = randInt(rng, 2, 8);

    const c = (nominal * coupon) / 100;
    const prix = prixObligation(nominal, coupon, n, taux);
    const reponse = r2(prix);
    const prixSansNominal = r2(prix - va(nominal, taux, n));

    const en = langue === 'en';
    const { f, eur, pct } = formatters(langue);
    const lignes = Array.from({ length: n }, (_, i) => {
      const t = i + 1;
      const flux = t < n ? c : c + nominal;
      return en
        ? `- Year ${t}: cash flow of ${eur(flux)} → ${f(flux)} / (1 + ${pct(taux)})^${t} = ${eur(va(flux, taux, t))}`
        : `- Année ${t} : flux de ${eur(flux)} → ${f(flux)} / (1 + ${pct(taux)})^${t} = ${eur(va(flux, taux, t))}`;
    });
    return {
      enonce: en
        ? `A bond with a face value of ${eur(nominal)} pays an annual coupon of ${pct(coupon)} and matures in ${n} years (next coupon in exactly one year). The market yield for this maturity and credit quality is ${pct(taux)}.\n\n**What is the price of this bond, in euros?**`
        : `Une obligation de nominal ${eur(nominal)}, coupon annuel de ${pct(coupon)}, arrive à maturité dans ${n} ans (prochain coupon dans un an exactement). Le taux de marché pour cette maturité et cette qualité de crédit est de ${pct(taux)}.\n\n**Quel est le prix de cette obligation, en euros ?**`,
      reponse,
      tolerance: 0.002,
      unite: '€',
      etapes: [
        {
          titre: en ? 'Identify the cash flows' : 'Identifier les flux',
          contenu: en
            ? `The bond pays a coupon of ${f(nominal)} × ${pct(coupon)} = **${eur(c)}** every year for ${n} years, plus the repayment of the face value (${eur(nominal)}) in the final year. The year-${n} cash flow is therefore ${f(c)} + ${f(nominal)} = **${eur(c + nominal)}**.`
            : `L'obligation verse un coupon de ${f(nominal)} × ${pct(coupon)} = **${eur(c)}** chaque année pendant ${n} ans, plus le remboursement du nominal (${eur(nominal)}) la dernière année. Le flux de l'année ${n} est donc ${f(c)} + ${f(nominal)} = **${eur(c + nominal)}**.`,
        },
        {
          titre: en ? 'Discount each cash flow' : 'Actualiser chaque flux',
          contenu: en
            ? `Each cash flow is divided by $(1+r)^t$ with $r = ${f(taux)}\\,\\%$:\n${lignes.join('\n')}`
            : `Chaque flux est divisé par $(1+r)^t$ avec $r = ${f(taux)}\\,\\%$ :\n${lignes.join('\n')}`,
        },
        {
          titre: en ? 'Add up' : 'Sommer',
          contenu: en
            ? `The price is the sum of the present values: $P = ${eur(reponse)}$. ${prix > nominal ? `The bond trades **above par**: its coupon (${pct(coupon)}) exceeds the market yield (${pct(taux)}).` : `The bond trades **below par**: its coupon (${pct(coupon)}) is lower than the market yield (${pct(taux)}).`}`
            : `Le prix est la somme des valeurs actuelles : $P = ${eur(reponse)}$. ${prix > nominal ? `Le titre cote **au-dessus du pair** : son coupon (${pct(coupon)}) est supérieur au taux de marché (${pct(taux)}).` : `Le titre cote **sous le pair** : son coupon (${pct(coupon)}) est inférieur au taux de marché (${pct(taux)}).`}`,
        },
      ],
      pieges: [
        en
          ? `Do not forget the repayment of the face value in the year-${n} cash flow — the classic mistake prices only the coupons and gives about ${eur(prixSansNominal)}.`
          : `Ne pas oublier le remboursement du nominal dans le flux de l'année ${n} — l'erreur classique n'actualise que les coupons et donne un prix d'environ ${eur(prixSansNominal)}.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 2. Duration de Macaulay (N2) — modèle du plan, bilingue
// ---------------------------------------------------------------------------
export const genDurationMacaulay: ExerciseGenerator = {
  id: 'm4-app-duration-macaulay',
  moduleId: M4,
  titre: 'Duration de Macaulay',
  titreEn: 'Macaulay duration',
  difficulte: 2,
  // Tirages (ordre strict) : 1. coupon = randFloat(2, 6, 1) · 2. taux = randFloat(1, 6, 1)
  // · 3. n = randInt(2, 5). Nominal fixé à 1 000.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const coupon = randFloat(rng, 2, 6, 1);
    const taux = randFloat(rng, 1, 6, 1);
    const n = randInt(rng, 2, 5);

    const nominal = 1000;
    const prix = prixObligation(nominal, coupon, n, taux);
    const d = durationMacaulay(nominal, coupon, n, taux);
    const reponse = r2(d);
    const c = (nominal * coupon) / 100;

    const en = langue === 'en';
    const { f, eur, pct } = formatters(langue);
    const lignes = Array.from({ length: n }, (_, i) => {
      const t = i + 1;
      const flux = t < n ? c : c + nominal;
      return en
        ? `- t = ${t}: PV = ${eur(va(flux, taux, t))} → weighting ${t} × ${f(va(flux, taux, t))} = ${f(t * va(flux, taux, t))}`
        : `- t = ${t} : VA = ${eur(va(flux, taux, t))} → pondération ${t} × ${f(va(flux, taux, t))} = ${f(t * va(flux, taux, t))}`;
    });
    return {
      enonce: en
        ? `Bond: face value ${eur(nominal)}, annual coupon ${pct(coupon, 1)}, maturity ${n} years, market yield ${pct(taux, 1)}.\n\n**Compute its Macaulay duration (in years).**`
        : `Obligation : nominal ${eur(nominal)}, coupon annuel ${pct(coupon, 1)}, maturité ${n} ans, taux de marché ${pct(taux, 1)}.\n\n**Calculez sa duration de Macaulay (en années).**`,
      reponse,
      tolerance: 0.01,
      unite: en ? 'years' : 'années',
      etapes: [
        {
          titre: en ? 'Compute the price' : 'Calculer le prix',
          contenu: en
            ? `Sum of the discounted cash flows: $P = ${eur(prix)}$ (coupon ${eur(c)} per year, final cash flow ${eur(c + nominal)}).`
            : `Somme des flux actualisés : $P = ${eur(prix)}$ (coupon ${eur(c)}/an, dernier flux ${eur(c + nominal)}).`,
        },
        {
          titre: en ? 'Weight each cash flow by its date' : 'Pondérer chaque flux par sa date',
          contenu: en
            ? `${lignes.join('\n')}\n\nSum of the date-weighted flows: **${f(d * prix)}**.`
            : `${lignes.join('\n')}\n\nSomme des flux pondérés : **${f(d * prix)}**.`,
        },
        {
          titre: en ? 'Divide by the price' : 'Diviser par le prix',
          contenu: en
            ? `$D_{Mac}$ = ${f(d * prix)} / ${f(prix)} = **${f(reponse)} years**. It is the time centre of gravity of the cash flows: the higher the coupon, the earlier the value comes back, the shorter the duration.`
            : `$D_{Mac}$ = ${f(d * prix)} / ${f(prix)} = **${f(reponse)} années**. C'est le « centre de gravité » temporel des flux : plus le coupon est élevé, plus la valeur revient tôt, plus la duration est courte.`,
        },
      ],
      pieges: [
        en
          ? 'Do not confuse Macaulay duration (in years) with modified duration (a sensitivity): the modified duration is obtained by dividing by (1 + y).'
          : "Confondre duration de Macaulay (en années) et duration modifiée (sensibilité) : la modifiée s'obtient en divisant par (1 + y).",
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 3. Intérêts simples vs composés (N1)
// ---------------------------------------------------------------------------
export const genSimpleCompose: ExerciseGenerator = {
  id: 'm4-app-simple-compose',
  moduleId: M4,
  titre: 'Intérêts simples vs composés',
  titreEn: 'Simple vs compound interest',
  difficulte: 1,
  // Tirages (ordre strict) : 1. capitalK = randInt(10, 500) (capital = capitalK × 1000)
  // · 2. taux = randFloat(1, 5, 1) · 3. n = randInt(2, 6).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const capitalK = randInt(rng, 10, 500);
    const taux = randFloat(rng, 1, 5, 1);
    const n = randInt(rng, 2, 6);

    const capital = capitalK * 1000;
    // n années d'intérêts simples = prorata Exact/360 sur n × 360 jours (composition de calculs.ts).
    const vfSimple = capital + interetMonetaire(capital, taux, n * 360, 360);
    // Capitaliser est l'inverse d'actualiser : VF = capital / VA(1).
    const vfCompose = capital / va(1, taux, n);
    const reponse = r2(vfCompose - vfSimple);
    const interetAnnuel = interetMonetaire(capital, taux, 360, 360);

    const en = langue === 'en';
    const { f, eur, pct } = formatters(langue);
    return {
      enonce: en
        ? `You invest ${eur(capital)} in a term deposit at an annual rate of ${pct(taux, 1)} for ${n} years. The bank offers two conventions: **simple interest** (paid out each year, never reinvested) or **compound interest** (capitalised each year).\n\n**By how many euros does the compound-interest final value exceed the simple-interest one?**`
        : `Vous placez ${eur(capital)} sur un compte à terme au taux annuel de ${pct(taux, 1)} pendant ${n} ans. La banque propose deux conventions : **intérêts simples** (versés chaque année, jamais replacés) ou **intérêts composés** (capitalisés chaque année).\n\n**De combien d'euros la valeur finale à intérêts composés dépasse-t-elle celle à intérêts simples ?**`,
      reponse,
      tolerance: 0.01,
      unite: '€',
      etapes: [
        {
          titre: en ? 'Final value with simple interest' : 'Valeur finale à intérêts simples',
          contenu: en
            ? `Each year earns ${f(capital)} × ${pct(taux, 1)} = **${eur(interetAnnuel)}** of interest, never reinvested. After ${n} years: $VF_{simple}$ = ${f(capital)} + ${n} × ${f(interetAnnuel)} = **${eur(vfSimple)}**.`
            : `Chaque année rapporte ${f(capital)} × ${pct(taux, 1)} = **${eur(interetAnnuel)}** d'intérêts, jamais replacés. Au bout de ${n} ans : $VF_{simple}$ = ${f(capital)} + ${n} × ${f(interetAnnuel)} = **${eur(vfSimple)}**.`,
        },
        {
          titre: en ? 'Final value with compound interest' : 'Valeur finale à intérêts composés',
          contenu: en
            ? `Interest is reinvested at ${pct(taux, 1)} every year: $VF_{composé} = ${f(capital)} × (1 + ${f(taux, 1)}\\,\\%)^{${n}}$ = **${eur(vfCompose)}**.`
            : `Les intérêts sont réinvestis à ${pct(taux, 1)} chaque année : $VF_{composé} = ${f(capital)} × (1 + ${f(taux, 1)}\\,\\%)^{${n}}$ = **${eur(vfCompose)}**.`,
        },
        {
          titre: en ? 'The gap' : "L'écart",
          contenu: en
            ? `${f(vfCompose)} − ${f(vfSimple)} = **${eur(reponse)}**. This is the "interest on interest" effect: invisible in year one, it grows faster than linearly with the horizon — over decades it is what makes compounding the engine of long-term investing.`
            : `${f(vfCompose)} − ${f(vfSimple)} = **${eur(reponse)}**. C'est l'effet « intérêts sur les intérêts » : invisible la première année, il croît plus que linéairement avec l'horizon — sur plusieurs décennies, c'est lui qui fait toute la puissance de la capitalisation.`,
        },
      ],
      pieges: [
        en
          ? `Mixing up the two conventions — using (1 + ${n} × r) instead of (1 + r)^${n}, or the other way round — shifts the result by exactly ${eur(reponse)} here.`
          : `Confondre les deux conventions — appliquer (1 + ${n} × r) au lieu de (1 + r)^${n}, ou l'inverse — fausse le résultat d'exactement ${eur(reponse)} ici.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 4. Intérêt d'un placement monétaire, base Exact/360 (N1)
// ---------------------------------------------------------------------------
export const genMonetaire360: ExerciseGenerator = {
  id: 'm4-app-monetaire-360',
  moduleId: M4,
  titre: "Intérêt d'un placement monétaire",
  titreEn: 'Money-market interest (Act/360)',
  difficulte: 1,
  // Tirages (ordre strict) : 1. montantM = randFloat(0.5, 10, 1) (montant = montantM × 1e6)
  // · 2. taux = randFloat(2, 4.5, 2) · 3. jours = pick([30, 60, 90, 180]).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const montantM = randFloat(rng, 0.5, 10, 1);
    const taux = randFloat(rng, 2, 4.5, 2);
    const jours = pick(rng, [30, 60, 90, 180] as const);

    const montant = montantM * 1e6;
    const interet = interetMonetaire(montant, taux, jours);
    const reponse = r2(interet);
    const interet365 = r2(interetMonetaire(montant, taux, jours, 365));
    const interetAnneePleine = interetMonetaire(montant, taux, 360);

    const en = langue === 'en';
    const { f, eur, pct } = formatters(langue);
    return {
      enonce: en
        ? `A corporate treasury invests ${eur(montant)} in a certificate of deposit at ${pct(taux)} for ${jours} days. Money-market convention: **Act/360**.\n\n**How much interest does the deposit earn at maturity, in euros?**`
        : `Une trésorerie d'entreprise place ${eur(montant)} en certificat de dépôt à ${pct(taux)} pour ${jours} jours. Convention du marché monétaire : **Exact/360**.\n\n**Quel montant d'intérêts le placement rapporte-t-il à l'échéance, en euros ?**`,
      reponse,
      tolerance: 0.002,
      unite: '€',
      etapes: [
        {
          titre: en ? 'State the day-count convention' : 'Poser la convention de base',
          contenu: en
            ? `Money markets (Euribor, CDs, T-bills) count days **exactly** but divide by a conventional **360-day** year: interest = nominal × rate × days / 360.`
            : `Le marché monétaire (Euribor, certificats de dépôt, BTF) compte les jours **exactement** mais divise par une année conventionnelle de **360 jours** : intérêts = nominal × taux × jours / 360.`,
        },
        {
          titre: en ? 'Apply the formula' : 'Appliquer la formule',
          contenu: en
            ? `Interest = ${f(montant)} × ${pct(taux)} × ${jours}/360 = **${eur(reponse)}**.`
            : `Intérêts = ${f(montant)} × ${pct(taux)} × ${jours}/360 = **${eur(reponse)}**.`,
        },
        {
          titre: en ? 'Sanity-check the order of magnitude' : "Vérifier l'ordre de grandeur",
          contenu: en
            ? `A full conventional year at ${pct(taux)} would earn ${eur(interetAnneePleine)}; over ${jours} days the deposit takes the fraction ${jours}/360 of it — consistent. Note that Act/360 slightly **inflates** the interest compared with a true 365-day year: the convention itself is worth money.`
            : `Une année conventionnelle pleine à ${pct(taux)} rapporterait ${eur(interetAnneePleine)} ; sur ${jours} jours, on en prend la fraction ${jours}/360 — cohérent. Notez que la base Exact/360 **gonfle** légèrement l'intérêt par rapport à une vraie année de 365 jours : la convention elle-même vaut de l'argent.`,
        },
      ],
      pieges: [
        en
          ? `Dividing by 365 gives ${eur(interet365)}, i.e. ${eur(r2(reponse - interet365))} less — the Act/360 basis is exactly what sets money markets apart from bond markets.`
          : `Diviser par 365 donnerait ${eur(interet365)}, soit ${eur(r2(reponse - interet365))} de moins — la base Exact/360 est précisément ce qui distingue le monétaire de l'obligataire.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 5. Prix d'un zéro-coupon (N1)
// ---------------------------------------------------------------------------
export const genPrixZeroCoupon: ExerciseGenerator = {
  id: 'm4-app-prix-zc',
  moduleId: M4,
  titre: "Prix d'un zéro-coupon",
  titreEn: 'Price of a zero-coupon bond',
  difficulte: 1,
  // Tirages (ordre strict) : 1. taux = randFloat(1, 5, 2) · 2. n = randInt(2, 15).
  // Nominal fixé à 1 000.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const taux = randFloat(rng, 1, 5, 2);
    const n = randInt(rng, 2, 15);

    const nominal = 1000;
    const prix = prixZeroCoupon(nominal, taux, n);
    const reponse = r2(prix);
    const prixLineaire = r2(nominal / (1 + (taux / 100) * n)); // piège : actualisation simple

    const en = langue === 'en';
    const { f, eur, pct } = formatters(langue);
    return {
      enonce: en
        ? `An investor wants to lock in a capital of ${eur(nominal)} in ${n} years and buys a zero-coupon bond with a face value of ${eur(nominal)}. The market yield for that maturity is ${pct(taux)}.\n\n**What price does the investor pay today, in euros?**`
        : `Un investisseur veut garantir un capital de ${eur(nominal)} dans ${n} ans et achète pour cela une obligation zéro-coupon de nominal ${eur(nominal)}. Le taux de marché pour cette maturité est de ${pct(taux)}.\n\n**Quel prix paie-t-il aujourd'hui, en euros ?**`,
      reponse,
      tolerance: 0.002,
      unite: '€',
      etapes: [
        {
          titre: en ? 'A single cash flow' : 'Un seul flux',
          contenu: en
            ? `A zero-coupon bond pays nothing before maturity: one single cash flow of ${eur(nominal)} in ${n} years. Its price is simply the present value of that flow.`
            : `Le zéro-coupon ne verse rien avant l'échéance : un unique flux de ${eur(nominal)} dans ${n} ans. Son prix est simplement la valeur actuelle de ce flux.`,
        },
        {
          titre: en ? 'Discount' : 'Actualiser',
          contenu: en
            ? `$P = ${f(nominal)} / (1 + ${f(taux)}\\,\\%)^{${n}}$ = **${eur(reponse)}**.`
            : `$P = ${f(nominal)} / (1 + ${f(taux)}\\,\\%)^{${n}}$ = **${eur(reponse)}**.`,
        },
        {
          titre: en ? 'Read the discount' : 'Lire la décote',
          contenu: en
            ? `The investor pays ${eur(reponse)} to receive ${eur(nominal)}: the difference of ${eur(r2(nominal - reponse))} is the entire return, fully embedded in the initial discount. The longer the maturity or the higher the rate, the deeper the discount. Bonus fact for the oral: the duration of a zero-coupon equals its maturity — ${n} years here.`
            : `L'investisseur paie ${eur(reponse)} pour recevoir ${eur(nominal)} : la différence de ${eur(r2(nominal - reponse))} constitue toute sa rémunération, entièrement logée dans la décote initiale. Plus la maturité est longue ou le taux élevé, plus la décote se creuse. À ressortir à l'oral : la duration d'un zéro-coupon est égale à sa maturité — ici ${n} ans.`,
        },
      ],
      pieges: [
        en
          ? `Discounting linearly — ${f(nominal)} / (1 + ${n} × ${pct(taux)}) = ${eur(prixLineaire)} — instead of compounding: the gap of ${eur(r2(prixLineaire - reponse))} widens with maturity.`
          : `Actualiser linéairement — ${f(nominal)} / (1 + ${n} × ${pct(taux)}) = ${eur(prixLineaire)} — au lieu de composer : l'écart de ${eur(r2(prixLineaire - reponse))} se creuse avec la maturité.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 6. Taux effectif annuel (N2)
// ---------------------------------------------------------------------------
export const genTauxEffectif: ExerciseGenerator = {
  id: 'm4-app-taux-effectif',
  moduleId: M4,
  titre: 'Taux effectif annuel',
  titreEn: 'Effective annual rate',
  difficulte: 2,
  // Tirages (ordre strict) : 1. tauxNominal = randFloat(2, 8, 2) · 2. m = pick([2, 4, 12]).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const tauxNominal = randFloat(rng, 2, 8, 2);
    const m = pick(rng, [2, 4, 12] as const);

    const te = tauxEffectif(tauxNominal, m);
    const reponse = r4(te);
    const tauxPeriode = tauxNominal / m;
    const ecartPb = (te - tauxNominal) * 100;

    const en = langue === 'en';
    const { f, pct } = formatters(langue);
    const labelFr = m === 2 ? 'semestrielle' : m === 4 ? 'trimestrielle' : 'mensuelle';
    const labelEn = m === 2 ? 'semi-annual' : m === 4 ? 'quarterly' : 'monthly';
    return {
      enonce: en
        ? `A bank quotes a **nominal** annual rate of ${pct(tauxNominal)} with ${labelEn} compounding (interest credited ${m} times a year).\n\n**What is the corresponding effective annual rate (EAR), in %?**`
        : `Une banque affiche un taux annuel **nominal** de ${pct(tauxNominal)} à composition ${labelFr} (intérêts crédités ${m} fois par an).\n\n**Quel est le taux effectif annuel correspondant, en % ?**`,
      reponse,
      tolerance: 0.001,
      unite: '%',
      etapes: [
        {
          titre: en ? 'The per-period rate' : 'Le taux par période',
          contenu: en
            ? `Each compounding period credits ${f(tauxNominal)} / ${m} = **${pct(tauxPeriode, 4)}** of interest.`
            : `Chaque période de capitalisation crédite ${f(tauxNominal)} / ${m} = **${pct(tauxPeriode, 4)}** d'intérêts.`,
        },
        {
          titre: en ? `Compound ${m} times` : `Composer ${m} fois`,
          contenu: en
            ? `Interest earns interest within the year: $TEA = (1 + ${f(tauxPeriode, 4)}\\,\\%)^{${m}} - 1$ = **${pct(reponse, 4)}**.`
            : `Les intérêts portent intérêt à l'intérieur de l'année : $TEA = (1 + ${f(tauxPeriode, 4)}\\,\\%)^{${m}} - 1$ = **${pct(reponse, 4)}**.`,
        },
        {
          titre: en ? 'Read the spread' : "Lire l'écart",
          contenu: en
            ? `The effective rate exceeds the nominal rate by ${f(ecartPb, 1)} bp — the pure effect of intra-year compounding, which grows with both the rate level and the compounding frequency. Always compare offers on the EAR, never on the nominal rate.`
            : `Le taux effectif dépasse le taux nominal de ${f(ecartPb, 1)} pb — pur effet de la capitalisation infra-annuelle, d'autant plus marqué que le taux est élevé et la fréquence grande. On compare toujours des offres sur le taux effectif, jamais sur le nominal.`,
        },
      ],
      pieges: [
        en
          ? `Treating the quoted ${pct(tauxNominal)} as the true annual return: with ${labelEn} compounding the money actually earns ${pct(reponse, 4)}, i.e. ${f(ecartPb, 1)} bp more.`
          : `Prendre le ${pct(tauxNominal)} affiché pour le rendement annuel réel : avec la composition ${labelFr}, l'argent rapporte en réalité ${pct(reponse, 4)}, soit ${f(ecartPb, 1)} pb de plus.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 7. Coupon couru et prix sale (N2)
// ---------------------------------------------------------------------------
export const genCouponCouru: ExerciseGenerator = {
  id: 'm4-app-coupon-couru',
  moduleId: M4,
  titre: 'Coupon couru et prix sale',
  titreEn: 'Accrued interest and dirty price',
  difficulte: 2,
  // Tirages (ordre strict) : 1. coupon = randFloat(2, 6, 2) · 2. jours = randInt(30, 330)
  // · 3. prixProprePct = randFloat(92, 108, 2). Nominal fixé à 1 000, base Exact/365.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const coupon = randFloat(rng, 2, 6, 2);
    const jours = randInt(rng, 30, 330);
    const prixProprePct = randFloat(rng, 92, 108, 2);

    const nominal = 1000;
    const c = (nominal * coupon) / 100;
    const couru = couponCouru(coupon, nominal, jours, 365);
    const prixPropre = (nominal * prixProprePct) / 100;
    const reponse = r2(prixPropre + couru);

    const en = langue === 'en';
    const { f, eur, pct } = formatters(langue);
    return {
      enonce: en
        ? `You buy a bond with a face value of ${eur(nominal)} and a ${pct(coupon)} annual coupon, ${jours} days after the last coupon payment (Act/365 basis). It is quoted at ${pct(prixProprePct)} of face value — that quote is the **clean price**.\n\n**What dirty price do you actually pay, in euros?**`
        : `Vous achetez une obligation de nominal ${eur(nominal)}, coupon annuel ${pct(coupon)}, ${jours} jours après le détachement du dernier coupon (base Exact/365). Elle cote ${pct(prixProprePct)} du nominal — cette cote est le **prix propre** (*clean price*).\n\n**Quel prix sale (*dirty price*) payez-vous effectivement, en euros ?**`,
      reponse,
      tolerance: 0.002,
      unite: '€',
      etapes: [
        {
          titre: en ? 'Accrued interest' : 'Le coupon couru',
          contenu: en
            ? `The seller has carried the bond for ${jours} days since the last coupon and is owed that fraction of the annual coupon of ${eur(c)}. Accrued interest = ${f(c)} × ${jours}/365 = **${eur(couru)}**.`
            : `Le vendeur a porté le titre ${jours} jours depuis le dernier coupon : il a droit à cette fraction du coupon annuel de ${eur(c)}. Coupon couru = ${f(c)} × ${jours}/365 = **${eur(couru)}**.`,
        },
        {
          titre: en ? 'From clean price to dirty price' : 'Du prix propre au prix sale',
          contenu: en
            ? `The percentage quote (${pct(prixProprePct)}) is the clean price: ${eur(prixPropre)}. The amount actually settled adds the accrued interest: dirty price = ${f(prixPropre)} + ${f(couru)} = **${eur(reponse)}**.`
            : `La cote en pourcentage (${pct(prixProprePct)}) est le prix propre : ${eur(prixPropre)}. Le montant effectivement réglé ajoute le couru : prix sale = ${f(prixPropre)} + ${f(couru)} = **${eur(reponse)}**.`,
        },
        {
          titre: en ? 'Why the convention exists' : 'Pourquoi cette convention',
          contenu: en
            ? `Quoting clean prevents the quote from sawtoothing at every coupon date: accrued interest grows linearly, resets to zero at the coupon, and the clean quote stays comparable from one day to the next — it reflects the market, not the calendar.`
            : `Coter en prix propre évite que la cote fasse des « dents de scie » à chaque détachement : le couru croît linéairement, retombe à zéro au coupon, et la cote reste comparable d'un jour à l'autre — elle reflète le marché, pas le calendrier.`,
        },
      ],
      pieges: [
        en
          ? `Settling only the clean price (${eur(prixPropre)}): the ${eur(couru)} owed to the seller are missing. Conversely, do not read the dirty price as the bond trading "above" its quote.`
          : `Régler le seul prix propre (${eur(prixPropre)}) : il manque les ${eur(couru)} dus au vendeur. À l'inverse, ne pas lire le prix sale comme une « surcote » du titre.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 8. Rendement courant (N1)
// ---------------------------------------------------------------------------
export const genRendementCourant: ExerciseGenerator = {
  id: 'm4-app-rendement-courant',
  moduleId: M4,
  titre: 'Rendement courant',
  titreEn: 'Current yield',
  difficulte: 1,
  // Tirages (ordre strict) : 1. coupon = randFloat(2, 6, 2) · 2. prixPct = randFloat(88, 112, 2).
  // Nominal fixé à 1 000.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const coupon = randFloat(rng, 2, 6, 2);
    const prixPct = randFloat(rng, 88, 112, 2);

    const nominal = 1000;
    const c = (nominal * coupon) / 100;
    const prix = (nominal * prixPct) / 100;
    const reponse = r3((c / prix) * 100);
    const sousLePair = prixPct < 100;

    const en = langue === 'en';
    const { f, eur, pct } = formatters(langue);
    return {
      enonce: en
        ? `A bond with a face value of ${eur(nominal)} pays a ${pct(coupon)} annual coupon and is quoted at ${pct(prixPct)} of face value.\n\n**What is its current yield, in %?**`
        : `Une obligation de nominal ${eur(nominal)} sert un coupon annuel de ${pct(coupon)} et cote ${pct(prixPct)} du nominal.\n\n**Quel est son rendement courant, en % ?**`,
      reponse,
      tolerance: 0.005,
      unite: '%',
      etapes: [
        {
          titre: en ? 'The coupon in euros' : 'Le coupon en euros',
          contenu: en
            ? `${f(nominal)} × ${pct(coupon)} = **${eur(c)}** per year, and the price paid is ${pct(prixPct)} × ${f(nominal)} = **${eur(prix)}**.`
            : `${f(nominal)} × ${pct(coupon)} = **${eur(c)}** par an, et le prix payé est ${pct(prixPct)} × ${f(nominal)} = **${eur(prix)}**.`,
        },
        {
          titre: en ? 'Divide by the price paid' : 'Rapporter au prix payé',
          contenu: en
            ? `Current yield = coupon / price = ${f(c)} / ${f(prix)} = **${pct(reponse, 3)}**. ${sousLePair ? `The bond trades below par, so the current yield exceeds the coupon rate (${pct(coupon)}).` : `The bond trades above par, so the current yield is below the coupon rate (${pct(coupon)}).`}`
            : `Rendement courant = coupon / prix = ${f(c)} / ${f(prix)} = **${pct(reponse, 3)}**. ${sousLePair ? `Le titre cote sous le pair : le rendement courant dépasse donc le taux de coupon (${pct(coupon)}).` : `Le titre cote au-dessus du pair : le rendement courant est donc inférieur au taux de coupon (${pct(coupon)}).`}`,
        },
        {
          titre: en ? 'The limits of the measure' : 'Les limites de la mesure',
          contenu: en
            ? `Current yield ignores the pull to par — the ${sousLePair ? 'gain' : 'loss'} of ${eur(Math.abs(r2(nominal - prix)))} at redemption — and the timing of the cash flows. Only the yield to maturity prices them in: here the YTM would be ${sousLePair ? 'higher' : 'lower'} than the current yield.`
            : `Le rendement courant ignore la convergence vers le pair — ${sousLePair ? 'le gain' : 'la perte'} de ${eur(Math.abs(r2(nominal - prix)))} au remboursement — et le calendrier des flux. Seul le rendement actuariel (YTM) les intègre : ici, le YTM serait ${sousLePair ? 'supérieur' : 'inférieur'} au rendement courant.`,
        },
      ],
      pieges: [
        en
          ? `Quoting the current yield as "the" return of the bond: it is a snapshot. The gap between coupon rate (${pct(coupon)}) and current yield (${pct(reponse, 3)}) comes purely from the price paid, and neither figure is the YTM.`
          : `Présenter le rendement courant comme « le » rendement du titre : c'est une photographie. L'écart entre taux de coupon (${pct(coupon)}) et rendement courant (${pct(reponse, 3)}) vient uniquement du prix payé, et aucun des deux n'est le YTM.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 9. YTM d'une obligation 2 ans (N3)
// ---------------------------------------------------------------------------
export const genYtm2Ans: ExerciseGenerator = {
  id: 'm4-app-ytm-2ans',
  moduleId: M4,
  titre: "YTM d'une obligation 2 ans",
  titreEn: 'YTM of a 2-year bond',
  difficulte: 3,
  // Tirages (ordre strict) : 1. coupon = randFloat(2, 5, 2) · 2. prixPct = randFloat(94, 106, 2).
  // Nominal fixé à 1 000.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const coupon = randFloat(rng, 2, 5, 2);
    const prixPct = randFloat(rng, 94, 106, 2);

    const nominal = 1000;
    const prix = (nominal * prixPct) / 100;
    const c = (nominal * coupon) / 100;
    const y = ytm2Ans(nominal, coupon, prix);
    const reponse = r3(y);
    const a = c + nominal;
    const disc = c * c + 4 * a * prix;
    const x = (-c + Math.sqrt(disc)) / (2 * a);
    const verif = prixObligation(nominal, coupon, 2, y);
    const rendCourant = r3((c / prix) * 100);
    const decote = prixPct < 100;

    const en = langue === 'en';
    const { f, eur, pct } = formatters(langue);
    return {
      enonce: en
        ? `A 2-year bond, face value ${eur(nominal)}, annual coupon ${pct(coupon)}, is quoted at ${pct(prixPct)} of face value, i.e. ${eur(prix)}.\n\n**What is its yield to maturity (YTM), in %?**`
        : `Une obligation 2 ans, nominal ${eur(nominal)}, coupon annuel ${pct(coupon)}, cote ${pct(prixPct)} du nominal, soit ${eur(prix)}.\n\n**Quel est son rendement actuariel (YTM), en % ?**`,
      reponse,
      tolerance: 0.005,
      unite: '%',
      etapes: [
        {
          titre: en ? 'Set up the YTM equation' : "Poser l'équation du YTM",
          contenu: en
            ? `The YTM is the rate $y$ that equates price and discounted cash flows: $P = \\frac{C}{1+y} + \\frac{C+N}{(1+y)^2}$, i.e. ${f(prix)} = ${f(c)}/(1+y) + ${f(a)}/(1+y)².`
            : `Le YTM est le taux $y$ qui égalise prix et flux actualisés : $P = \\frac{C}{1+y} + \\frac{C+N}{(1+y)^2}$, soit ${f(prix)} = ${f(c)}/(1+y) + ${f(a)}/(1+y)².`,
        },
        {
          titre: en ? 'Solve the quadratic' : 'Résoudre la quadratique',
          contenu: en
            ? `Set $x = 1/(1+y)$: ${f(a)}·x² + ${f(c)}·x − ${f(prix)} = 0. Discriminant: ${f(c)}² + 4 × ${f(a)} × ${f(prix)} = ${f(disc)}; hence x = (−${f(c)} + √${f(disc)}) / (2 × ${f(a)}) = ${f(x, 6)}.`
            : `On pose $x = 1/(1+y)$ : ${f(a)}·x² + ${f(c)}·x − ${f(prix)} = 0. Discriminant : ${f(c)}² + 4 × ${f(a)} × ${f(prix)} = ${f(disc)} ; d'où x = (−${f(c)} + √${f(disc)}) / (2 × ${f(a)}) = ${f(x, 6)}.`,
        },
        {
          titre: en ? 'Back out the rate and check' : 'Revenir au taux et vérifier',
          contenu: en
            ? `$y = 1/x - 1$ = **${pct(reponse, 3)}**. Check: repricing the bond at that rate gives ${eur(verif)} ≈ ${eur(prix)}. ${decote ? `The bond trades at a discount, so the YTM (${pct(reponse, 3)}) exceeds the coupon rate (${pct(coupon)}).` : `The bond trades at a premium, so the YTM (${pct(reponse, 3)}) is below the coupon rate (${pct(coupon)}).`}`
            : `$y = 1/x - 1$ = **${pct(reponse, 3)}**. Vérification : re-pricer le titre à ce taux redonne ${eur(verif)} ≈ ${eur(prix)}. ${decote ? `Le titre décote : le YTM (${pct(reponse, 3)}) dépasse donc le taux de coupon (${pct(coupon)}).` : `Le titre surcote : le YTM (${pct(reponse, 3)}) est donc inférieur au taux de coupon (${pct(coupon)}).`}`,
        },
      ],
      pieges: [
        en
          ? `Confusing YTM with current yield: coupon/price = ${pct(rendCourant, 3)}, whereas the YTM, which prices in the pull to par at maturity, is ${pct(reponse, 3)}.`
          : `Confondre YTM et rendement courant : coupon/prix = ${pct(rendCourant, 3)}, alors que le YTM, qui intègre la convergence vers le pair à l'échéance, vaut ${pct(reponse, 3)}.`,
        en
          ? 'Assuming YTM = coupon rate: that only holds for a bond trading exactly at par.'
          : 'Supposer YTM = taux de coupon : ce n\'est vrai que pour un titre cotant exactement au pair.',
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 10. Duration modifiée et ΔP (N2)
// ---------------------------------------------------------------------------
export const genDurationModifiee: ExerciseGenerator = {
  id: 'm4-app-duration-modifiee',
  moduleId: M4,
  titre: 'Duration modifiée et ΔP',
  titreEn: 'Modified duration and price impact',
  difficulte: 2,
  // Tirages (ordre strict) : 1. coupon = randFloat(2, 6, 1) · 2. taux = randFloat(1, 6, 1)
  // · 3. n = randInt(3, 8) · 4. choc = pick([-100, -75, -50, -25, 25, 50, 75, 100]) (en pb).
  // Nominal fixé à 1 000.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const coupon = randFloat(rng, 2, 6, 1);
    const taux = randFloat(rng, 1, 6, 1);
    const n = randInt(rng, 3, 8);
    const choc = pick(rng, [-100, -75, -50, -25, 25, 50, 75, 100] as const);

    const nominal = 1000;
    const prix = prixObligation(nominal, coupon, n, taux);
    const dMac = durationMacaulay(nominal, coupon, n, taux);
    const dMod = durationModifiee(dMac, taux);
    const deltaY = choc / 10000;
    const reponse = r2(-dMod * deltaY * prix);
    const fauxAvecDMac = r2(-dMac * deltaY * prix);
    const hausse = choc > 0;
    const chocAbs = Math.abs(choc);

    const en = langue === 'en';
    const { f, eur, pct } = formatters(langue);
    const signeChoc = hausse ? '+' : '−';
    return {
      enonce: en
        ? `Your desk holds a bond: face value ${eur(nominal)}, annual coupon ${pct(coupon, 1)}, maturity ${n} years, market yield ${pct(taux, 1)}. The central bank surprises the market and yields ${hausse ? 'rise' : 'fall'} by ${chocAbs} bp.\n\n**Use duration to estimate the price change of the bond, in euros (with its sign).**`
        : `Votre desk détient une obligation : nominal ${eur(nominal)}, coupon annuel ${pct(coupon, 1)}, maturité ${n} ans, taux de marché ${pct(taux, 1)}. La banque centrale surprend le marché : les taux ${hausse ? 'montent' : 'baissent'} de ${chocAbs} pb.\n\n**Estimez par la duration la variation de prix du titre, en euros (avec son signe).**`,
      reponse,
      tolerance: 0.01,
      unite: '€',
      etapes: [
        {
          titre: en ? 'Price and Macaulay duration' : 'Prix et duration de Macaulay',
          contenu: en
            ? `Via the discounted cash flows: $P = ${eur(prix)}$ and $D_{Mac} = ${f(dMac)}$ years (the time barycentre of the flows).`
            : `Via la somme des flux actualisés : $P = ${eur(prix)}$ et $D_{Mac} = ${f(dMac)}$ années (barycentre temporel des flux).`,
        },
        {
          titre: en ? 'Switch to modified duration' : 'Passer à la duration modifiée',
          contenu: en
            ? `$D_{mod} = D_{Mac}/(1+y)$ = ${f(dMac)} / (1 + ${f(taux, 1)}\\,\\%) = **${f(dMod)}**. Modified duration — not Macaulay — is the sensitivity measure.`
            : `$D_{mod} = D_{Mac}/(1+y)$ = ${f(dMac)} / (1 + ${f(taux, 1)}\\,\\%) = **${f(dMod)}**. C'est elle — pas la Macaulay — qui mesure la sensibilité.`,
        },
        {
          titre: en ? 'Apply the shock' : 'Appliquer le choc',
          contenu: en
            ? `$\\Delta P \\approx -D_{mod} \\times \\Delta y \\times P$ = −${f(dMod)} × (${signeChoc}${f(chocAbs / 100)}\\,%) × ${f(prix)} = **${eur(reponse)}**. ${hausse ? 'Yields up ⇒ price down' : 'Yields down ⇒ price up'} — the fundamental inverse relationship.`
            : `$\\Delta P \\approx -D_{mod} \\times \\Delta y \\times P$ = −${f(dMod)} × (${signeChoc}${f(chocAbs / 100)}\\,%) × ${f(prix)} = **${eur(reponse)}**. ${hausse ? 'Hausse des taux ⇒ le prix baisse' : 'Baisse des taux ⇒ le prix monte'} — la relation inverse fondamentale.`,
        },
      ],
      pieges: [
        en
          ? `Using Macaulay duration instead of modified: that gives ${eur(fauxAvecDMac)} — the gap widens as the yield level rises.`
          : `Utiliser la duration de Macaulay au lieu de la modifiée : on obtiendrait ${eur(fauxAvecDMac)} — l'écart grandit avec le niveau des taux.`,
        en
          ? `Getting Δy's unit wrong: ${chocAbs} bp = ${f(chocAbs / 100)}% = ${f(deltaY, 4)} in decimal — and do not drop the sign.`
          : `Se tromper d'unité sur Δy : ${chocAbs} pb = ${f(chocAbs / 100)} % = ${f(deltaY, 4)} en décimal — et ne pas oublier le signe.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 11. Correction de convexité (N3)
// ---------------------------------------------------------------------------
export const genConvexite: ExerciseGenerator = {
  id: 'm4-app-convexite',
  moduleId: M4,
  titre: 'Correction de convexité',
  titreEn: 'Convexity adjustment',
  difficulte: 3,
  // Tirages (ordre strict) : 1. coupon = randFloat(2, 6, 1) · 2. taux = randFloat(2, 6, 1)
  // · 3. n = randInt(5, 12) · 4. choc = pick([-300, -250, -200, -150, 150, 200, 250, 300]) (en pb).
  // Nominal fixé à 1 000.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const coupon = randFloat(rng, 2, 6, 1);
    const taux = randFloat(rng, 2, 6, 1);
    const n = randInt(rng, 5, 12);
    const choc = pick(rng, [-300, -250, -200, -150, 150, 200, 250, 300] as const);

    const nominal = 1000;
    const prix = prixObligation(nominal, coupon, n, taux);
    const dMac = durationMacaulay(nominal, coupon, n, taux);
    const dMod = durationModifiee(dMac, taux);
    const conv = convexite(nominal, coupon, n, taux);
    const deltaY = choc / 10000;
    const estimDuration = r2(-dMod * deltaY * prix);
    const correction = 0.5 * conv * deltaY * deltaY * prix;
    const reponse = r2(correction);
    const chocAbs = Math.abs(choc);
    const signeChoc = choc > 0 ? '+' : '−';

    const en = langue === 'en';
    const { f, eur, pct } = formatters(langue);
    return {
      enonce: en
        ? `Stress test: on a bond with face value ${eur(nominal)}, ${pct(coupon, 1)} coupon, ${n}-year maturity, ${pct(taux, 1)} yield, you simulate a ${signeChoc}${chocAbs} bp shock. The duration-only estimate is too crude for a move that size.\n\n**By how many euros does the convexity adjustment improve the estimate (gap between the duration-only and the duration-plus-convexity estimates)?**`
        : `Stress test : sur une obligation de nominal ${eur(nominal)}, coupon ${pct(coupon, 1)}, maturité ${n} ans, taux ${pct(taux, 1)}, on simule un choc de ${signeChoc}${chocAbs} pb. L'estimation par la duration seule est trop grossière pour un choc de cette taille.\n\n**De combien d'euros la correction de convexité améliore-t-elle l'estimation (écart entre l'estimation duration seule et l'estimation duration + convexité) ?**`,
      reponse,
      tolerance: 0.01,
      unite: '€',
      etapes: [
        {
          titre: en ? "The bond's risk measures" : 'Les mesures du titre',
          contenu: en
            ? `From the discounted cash flows: $P = ${eur(prix)}$, $D_{mod} = ${f(dMod)}$, convexity $C = ${f(conv)}$.`
            : `Via les flux actualisés : $P = ${eur(prix)}$, $D_{mod} = ${f(dMod)}$, convexité $C = ${f(conv)}$.`,
        },
        {
          titre: en ? 'Duration-only estimate' : 'Estimation duration seule',
          contenu: en
            ? `$\\Delta P_1 \\approx -D_{mod} \\times \\Delta y \\times P$ = −${f(dMod)} × (${signeChoc}${f(chocAbs / 100)}\\,%) × ${f(prix)} = **${eur(estimDuration)}** — a straight-line (tangent) approximation.`
            : `$\\Delta P_1 \\approx -D_{mod} \\times \\Delta y \\times P$ = −${f(dMod)} × (${signeChoc}${f(chocAbs / 100)}\\,%) × ${f(prix)} = **${eur(estimDuration)}** — une approximation en ligne droite (la tangente).`,
        },
        {
          titre: en ? 'The convexity term' : 'Le terme de convexité',
          contenu: en
            ? `Adjustment = $\\tfrac{1}{2} C (\\Delta y)^2 P$ = ½ × ${f(conv)} × (${f(deltaY, 4)})² × ${f(prix)} = **${eur(reponse)}**. It is **always positive** (Δy is squared): convexity softens losses when yields rise and amplifies gains when they fall — which is why convexity is a quality.`
            : `Correction = $\\tfrac{1}{2} C (\\Delta y)^2 P$ = ½ × ${f(conv)} × (${f(deltaY, 4)})² × ${f(prix)} = **${eur(reponse)}**. Elle est **toujours positive** (Δy est au carré) : la convexité amortit les pertes en hausse de taux et amplifie les gains en baisse — c'est pourquoi on dit qu'elle est une qualité.`,
        },
      ],
      pieges: [
        en
          ? `Dropping the ½ factor: you would report ${eur(r2(2 * correction))} instead of ${eur(reponse)}.`
          : `Oublier le facteur ½ : on annoncerait ${eur(r2(2 * correction))} au lieu de ${eur(reponse)}.`,
        en
          ? `Leaving Δy in bp or % without converting to decimal (${chocAbs} bp = ${f(deltaY, 4)}): the squared term then blows up by several orders of magnitude.`
          : `Garder Δy en pb ou en % sans le convertir en décimal (${chocAbs} pb = ${f(deltaY, 4)}) : le terme au carré explose alors de plusieurs ordres de grandeur.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 12. Taux forward implicite (N2)
// ---------------------------------------------------------------------------
export const genForward: ExerciseGenerator = {
  id: 'm4-app-forward',
  moduleId: M4,
  titre: 'Taux forward implicite',
  titreEn: 'Implied forward rate',
  difficulte: 2,
  // Tirages (ordre strict) : 1. z1 = randFloat(1, 4, 2) · 2. pente = randFloat(0.1, 1.2, 2)
  // (z2 = arrondi2(z1 + pente), courbe croissante) · 3. paire = pick([[1,2], [2,3], [1,3]]).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const z1 = randFloat(rng, 1, 4, 2);
    const pente = randFloat(rng, 0.1, 1.2, 2);
    const z2 = r2(z1 + pente);
    const paire = pick(rng, [[1, 2], [2, 3], [1, 3]] as const);

    const [t1, t2] = paire;
    const fwd = tauxForward(z1, t1, z2, t2);
    const reponse = r3(fwd);
    const naive = r3((z2 * t2 - z1 * t1) / (t2 - t1));
    const ratio = (1 + z2 / 100) ** t2 / (1 + z1 / 100) ** t1;
    const duree = t2 - t1;

    const en = langue === 'en';
    const { f, pct } = formatters(langue);
    const an1 = en ? (t1 > 1 ? 'years' : 'year') : t1 > 1 ? 'ans' : 'an';
    return {
      enonce: en
        ? `The zero-coupon curve shows ${pct(z1)} at ${t1} ${an1} and ${pct(z2)} at ${t2} years.\n\n**What ${t1}y→${t2}y forward rate does the market imply, in % per annum?**`
        : `La courbe zéro-coupon affiche ${pct(z1)} à ${t1} ${an1} et ${pct(z2)} à ${t2} ans.\n\n**Quel taux forward ${t1} ${an1} → ${t2} ans le marché implique-t-il, en % par an ?**`,
      reponse,
      tolerance: 0.005,
      unite: '%',
      etapes: [
        {
          titre: en ? 'The no-arbitrage identity' : "L'égalité d'absence d'arbitrage",
          contenu: en
            ? `Investing for ${t2} years at $z_2$ must be equivalent to investing ${t1} ${an1} at $z_1$ then rolling at the forward: $(1+z_2)^{${t2}} = (1+z_1)^{${t1}} (1+f)^{${duree}}$. Otherwise a riskless round trip would print money.`
            : `Placer ${t2} ans à $z_2$ doit équivaloir à placer ${t1} ${an1} à $z_1$ puis réinvestir au forward : $(1+z_2)^{${t2}} = (1+z_1)^{${t1}} (1+f)^{${duree}}$. Sinon, un aller-retour sans risque rapporterait de l'argent.`,
        },
        {
          titre: en ? 'Solve for the forward' : 'Isoler le forward',
          contenu: en
            ? `$(1+f)^{${duree}}$ = (1 + ${f(z2)}\\,%)^${t2} / (1 + ${f(z1)}\\,%)^${t1} = ${f(ratio, 6)}, hence $f$ = **${pct(reponse, 3)}**${duree > 1 ? ` (annualised over the ${duree}-year period)` : ''}.`
            : `$(1+f)^{${duree}}$ = (1 + ${f(z2)}\\,%)^${t2} / (1 + ${f(z1)}\\,%)^${t1} = ${f(ratio, 6)}, d'où $f$ = **${pct(reponse, 3)}**${duree > 1 ? ` (annualisé sur la période de ${duree} ans)` : ''}.`,
        },
        {
          titre: en ? 'Read the forward' : 'Lire le forward',
          contenu: en
            ? `The forward is not a forecast: it is the break-even rate embedded in the curve. Here $f$ (${pct(reponse, 3)}) sits above $z_2$ (${pct(z2)}) because the curve slopes upward — the marginal period ${t1}y→${t2}y must pay more than the average to pull it up.`
            : `Le forward n'est pas une prévision : c'est le taux d'équilibre que la courbe contient déjà. Ici $f$ (${pct(reponse, 3)}) dépasse $z_2$ (${pct(z2)}) parce que la courbe est croissante — la période marginale ${t1} ${an1} → ${t2} ans doit payer plus que la moyenne pour la tirer vers le haut.`,
        },
      ],
      pieges: [
        en
          ? `The arithmetic shortcut (${f(z2)} × ${t2} − ${f(z1)} × ${t1}) / ${duree} = ${pct(naive, 3)} ignores compounding: against the true forward (${pct(reponse, 3)}), the gap is paid in basis points on desk-sized notionals.`
          : `Le raccourci arithmétique (${f(z2)} × ${t2} − ${f(z1)} × ${t1}) / ${duree} = ${pct(naive, 3)} ignore la composition : face au vrai forward (${pct(reponse, 3)}), l'écart se paie en points de base sur des notionnels de desk.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 13. Coût d'un repo (N2)
// ---------------------------------------------------------------------------
export const genRepo: ExerciseGenerator = {
  id: 'm4-app-repo',
  moduleId: M4,
  titre: "Coût d'un repo",
  titreEn: 'Cost of a repo',
  difficulte: 2,
  // Tirages (ordre strict) : 1. positionM = randInt(5, 50) (position = positionM × 1e6)
  // · 2. tauxRepo = randFloat(1.5, 4, 2) · 3. jours = randInt(1, 30) · 4. haircut = randInt(1, 5).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const positionM = randInt(rng, 5, 50);
    const tauxRepo = randFloat(rng, 1.5, 4, 2);
    const jours = randInt(rng, 1, 30);
    const haircut = randInt(rng, 1, 5);

    const position = positionM * 1e6;
    const cash = position * (1 - haircut / 100);
    const reponse = r2(interetMonetaire(cash, tauxRepo, jours));
    const coutSansHaircut = r2(interetMonetaire(position, tauxRepo, jours));
    const cout365 = r2(interetMonetaire(cash, tauxRepo, jours, 365));

    const en = langue === 'en';
    const { f, eur, pct } = formatters(langue);
    const jourTxt = en ? (jours > 1 ? 'days' : 'day') : jours > 1 ? 'jours' : 'jour';
    return {
      enonce: en
        ? `A desk finances a ${eur(position)} position in OATs through a repo (*repurchase agreement*). Terms: ${pct(haircut, 0)} haircut, ${pct(tauxRepo)} repo rate, ${jours} ${jourTxt}, Act/360 basis.\n\n**What is the financing cost of the trade, in euros?**`
        : `Un desk finance en pension livrée (*repo*) une position de ${eur(position)} d'OAT. Conditions : haircut ${pct(haircut, 0)}, taux repo ${pct(tauxRepo)}, durée ${jours} ${jourTxt}, base Exact/360.\n\n**Quel est le coût de financement de l'opération, en euros ?**`,
      reponse,
      tolerance: 0.005,
      unite: '€',
      etapes: [
        {
          titre: en ? 'Cash raised' : 'Le cash levé',
          contenu: en
            ? `The cash lender applies a ${pct(haircut, 0)} haircut: it lends only ${pct(100 - haircut, 0)} of the collateral value, i.e. ${f(position)} × ${f(1 - haircut / 100)} = **${eur(cash)}**.`
            : `Le prêteur de cash applique un haircut (décote) de ${pct(haircut, 0)} : il ne prête que ${pct(100 - haircut, 0)} de la valeur des titres, soit ${f(position)} × ${f(1 - haircut / 100)} = **${eur(cash)}**.`,
        },
        {
          titre: en ? 'Repo interest' : "L'intérêt repo",
          contenu: en
            ? `Interest accrues on the cash actually borrowed, on the money-market Act/360 basis: ${f(cash)} × ${pct(tauxRepo)} × ${jours}/360 = **${eur(reponse)}**.`
            : `L'intérêt court sur le cash effectivement emprunté, en base monétaire Exact/360 : ${f(cash)} × ${pct(tauxRepo)} × ${jours}/360 = **${eur(reponse)}**.`,
        },
        {
          titre: en ? "The desk's reading" : 'La lecture du desk',
          contenu: en
            ? `This cost is the financing leg of the carry: the position only makes money if what it earns over the period (accrued coupon, roll-down) exceeds ${eur(reponse)}. The haircut, meanwhile, ties up ${eur(position - cash)} of the desk's own resources — that is where leverage finds its limit.`
            : `Ce coût est la jambe « financement » du carry : la position ne gagne de l'argent que si ce qu'elle rapporte sur la période (coupon couru, roll-down) dépasse ${eur(reponse)}. Le haircut, lui, immobilise ${eur(position - cash)} de ressources propres du desk — c'est là que le levier trouve sa limite.`,
        },
      ],
      pieges: [
        en
          ? `Charging interest on the collateral value (${eur(position)}) instead of the cash lent: ${eur(coutSansHaircut)} instead of ${eur(reponse)}.`
          : `Calculer l'intérêt sur la valeur des titres (${eur(position)}) au lieu du cash prêté : ${eur(coutSansHaircut)} au lieu de ${eur(reponse)}.`,
        en
          ? `Using a 365-day basis: ${eur(cout365)} — the repo is a money-market instrument, Act/360 applies.`
          : `Utiliser la base 365 : ${eur(cout365)} — le repo est un instrument monétaire, la base Exact/360 s'applique.`,
      ],
    };
  },
};

export const exercices: ExerciseGenerator[] = [
  genPrixObligation,
  genDurationMacaulay,
  genSimpleCompose,
  genMonetaire360,
  genPrixZeroCoupon,
  genTauxEffectif,
  genCouponCouru,
  genRendementCourant,
  genYtm2Ans,
  genDurationModifiee,
  genConvexite,
  genForward,
  genRepo,
];
