import { useMemo, useState } from 'react';
import {
  payoffAutocall,
  prixAutocallMC,
  trajectoireLognormale,
  type ParamsAutocall,
} from '../../content/modules/09-produits-structures/calculs';
import { useLangue } from '../../engine/useLangue';
import type { Langue } from '../../engine/types';
import { Button } from '../ui/Button';

/* ── Simulateur d'autocall Monte-Carlo (module 9, ch3) ──────────────────
   Athena 5 ans, S₀ = 100, r = 3 % fixe. Deux vues : (a) une poignée de
   trajectoires seedées (trajectoireLognormale, graines FIXES : mêmes
   curseurs ⇒ mêmes chemins) avec les barrières matérialisées et le point
   de rappel marqué — chaque trajectoire est classée par payoffAutocall,
   JAMAIS re-décidée à la main ; (b) le prix Monte-Carlo (prixAutocallMC,
   4 000 trajectoires) et la distribution des issues sur 2 000 scénarios
   seedés (rappel an 1…5, capital rendu, perte). Tous les tirages sont
   déterministes (mulberry32 via calculs.ts) et les deux simulations
   vivent dans des useMemo — rien n'est retiré au re-render.           */

const S0 = 100;
const R_PCT = 3; // taux sans risque fixé (affiché dans le sous-titre)
const ANNEES = 5;

const RAPPEL_MIN = 90;
const RAPPEL_MAX = 110;
const RAPPEL_DEFAUT = 100;
const PROT_MIN = 50;
const PROT_MAX = 70;
const PROT_DEFAUT = 60;
const COUPON_MIN = 4;
const COUPON_MAX = 12;
const COUPON_DEFAUT = 6;
const VOL_MIN = 10;
const VOL_MAX = 40;
const VOL_DEFAUT = 20;
const OBS_MIN = 1;
const OBS_MAX = 4;
const OBS_DEFAUT = 1;

/* Monte-Carlo : n calibrés pour rester fluides au drag des curseurs
   (≤ 4 000 × 20 pas ≈ 80 000 tirages, quelques millisecondes). */
const N_PRIX = 4000;
const N_DISTRIBUTION = 2000;
const SEED_PRIX = 90210;
const SEED_DISTRIBUTION = 777000;
/* Graines fixes des trajectoires affichées : déterministes au re-render. */
const SEEDS_TRAJECTOIRES = [2, 5, 11, 17, 23, 31, 41] as const;

/* Géométrie des SVG (unités viewBox). */
const VB_L = 400;
const VB_H = 220;
const M_G = 40;
const M_D = 14;
const M_H = 16;
const M_B = 28;
const TRACE_L = VB_L - M_G - M_D;
const TRACE_H = VB_H - M_H - M_B;

type Vue = 'trajectoires' | 'prix';

/* ── Textes d'interface FR/EN ── */
const TXT = {
  fr: {
    titre: 'Simulateur d’autocall (Monte-Carlo)',
    sousTitre: 'Athena — S₀ = 100, r = 3 % fixe, 5 ans',
    vueTraj: 'Trajectoires',
    vuePrix: 'Prix & distribution',
    rappel: 'Barrière de rappel',
    protection: 'Barrière de protection',
    coupon: 'Coupon',
    vol: 'Volatilité σ',
    obs: 'Observations / an',
    parAn: '%/an',
    parObs: 'par observation',
    axeXans: 'années',
    axeYniveau: 'niveau du sous-jacent (base 100)',
    barRappel: 'rappel',
    barProtection: 'protection',
    legRappelee: 'rappelée (100 + coupons courus)',
    legMaturite: 'va à maturité, capital rendu',
    legPerte: 'perte en capital',
    legPointRappel: 'moment du rappel',
    trajRappelees: 'trajectoires rappelées ici',
    prixMC: 'Prix Monte-Carlo',
    duNominal: '% du nominal',
    margeStructureur: 'Marge implicite (100 − prix)',
    pointsNominal: 'pts de nominal',
    probaPerte: 'Proba de perte en capital',
    scenarios: 'scénarios',
    distTitre: 'Distribution des issues',
    axeYfreq: '% des scénarios',
    an: 'An',
    aMaturite: '100 à mat.',
    perte: 'Perte',
    lecture: 'Lecture',
    mecanique:
      'À chaque observation, si le sous-jacent est au-dessus de la barrière de rappel, le produit s’éteint : le client touche 100 + les coupons courus (effet mémoire). Sinon il continue ; à maturité, sous la barrière de protection, le client encaisse toute la baisse.',
    prixSous100: (p: string, m: string) =>
      `Prix modèle ≈ ${p} % du nominal : le client paie 100, l’écart ≈ ${m} pts rémunère le structureur (marge, couverture, distribution).`,
    prixSur100: (p: string) =>
      `Prix modèle ${p} > 100 : à ces paramètres le produit vaut PLUS que ce que paie le client — en salle, le structureur baisserait le coupon offert jusqu’à repasser sous 100.`,
    volEtQueue: (v: number, perte: string, an1: string) =>
      `σ = ${v} % : le coupon est financé par le put down-and-in que le client vend sans le voir. Vol plus haute ⇒ ce put vaut plus ⇒ le structureur PEUT offrir un coupon plus généreux… mais la perte en capital frappe ici ${perte} % des scénarios (et le rappel dès l’an 1 n’arrive que dans ${an1} % des cas).`,
  },
  en: {
    titre: 'Autocall simulator (Monte-Carlo)',
    sousTitre: 'Athena — S₀ = 100, r = 3% fixed, 5 yrs',
    vueTraj: 'Paths',
    vuePrix: 'Price & distribution',
    rappel: 'Autocall barrier',
    protection: 'Protection barrier',
    coupon: 'Coupon',
    vol: 'Volatility σ',
    obs: 'Observations / yr',
    parAn: '%/yr',
    parObs: 'per observation',
    axeXans: 'years',
    axeYniveau: 'underlying level (base 100)',
    barRappel: 'autocall',
    barProtection: 'protection',
    legRappelee: 'called (100 + accrued coupons)',
    legMaturite: 'runs to maturity, capital back',
    legPerte: 'capital loss',
    legPointRappel: 'call event',
    trajRappelees: 'paths called here',
    prixMC: 'Monte-Carlo price',
    duNominal: '% of notional',
    margeStructureur: 'Implicit margin (100 − price)',
    pointsNominal: 'pts of notional',
    probaPerte: 'Probability of capital loss',
    scenarios: 'scenarios',
    distTitre: 'Distribution of outcomes',
    axeYfreq: '% of scenarios',
    an: 'Yr',
    aMaturite: 'Par at mat.',
    perte: 'Loss',
    lecture: 'How to read this',
    mecanique:
      'At each observation date, if the underlying is above the autocall barrier, the product dies: the client gets 100 plus the accrued coupons (memory effect). Otherwise it keeps running; at maturity, below the protection barrier, the client eats the full drop.',
    prixSous100: (p: string, m: string) =>
      `Model price ≈ ${p}% of notional: the client pays 100, the ≈ ${m} pts gap pays the structurer (margin, hedging, distribution).`,
    prixSur100: (p: string) =>
      `Model price ${p} > 100: at these parameters the product is worth MORE than what the client pays — on the desk, the structurer would cut the offered coupon until it drops back below 100.`,
    volEtQueue: (v: number, perte: string, an1: string) =>
      `σ = ${v}%: the coupon is funded by the down-and-in put the client sells without seeing it. Higher vol ⇒ that put is worth more ⇒ the structurer CAN offer a fatter coupon… but capital loss hits ${perte}% of scenarios here (and a year-1 call only happens in ${an1}% of cases).`,
  },
} as const;

/* ── Format : virgule décimale en FR, point en EN ── */
function fmtNombre(v: number, dec: number, langue: Langue): string {
  const arrondiNul = Math.abs(v) < 0.5 * 10 ** -dec;
  const abs = Math.abs(v).toFixed(dec);
  const txt = langue === 'fr' ? abs.replace('.', ',') : abs;
  return (v < 0 && !arrondiNul ? '−' : '') + txt;
}

/** Pas « rond » (1/2/5 × 10^n) pour les graduations Y. */
function pasNice(brut: number): number {
  const exp = Math.floor(Math.log10(brut));
  const base = brut / 10 ** exp;
  const nice = base <= 1 ? 1 : base <= 2 ? 2 : base <= 5 ? 5 : 10;
  return nice * 10 ** exp;
}

/* ── Composant ── */
export function AutocallSimulator() {
  const { langue } = useLangue();
  const L = TXT[langue];
  const [vue, setVue] = useState<Vue>('trajectoires');
  const [barriereRappelPct, setBarriereRappelPct] = useState(RAPPEL_DEFAUT);
  const [barriereProtectionPct, setBarriereProtectionPct] = useState(PROT_DEFAUT);
  const [couponAnnuelPct, setCouponAnnuelPct] = useState(COUPON_DEFAUT);
  const [volPct, setVolPct] = useState(VOL_DEFAUT);
  const [obsParAn, setObsParAn] = useState(OBS_DEFAUT);

  const nbPeriodes = ANNEES * obsParAn;
  const dtAnnees = 1 / obsParAn;
  const couponPeriodePct = couponAnnuelPct * dtAnnees;

  /* ── Vue (a) : trajectoires seedées, classées par payoffAutocall ──
     Chemins sous-échantillonnés finement (≈ 48 pas au total) pour un
     tracé lisse ; les OBSERVATIONS sont lues sur ces mêmes chemins aux
     dates i·dt, donc le classement colle exactement au dessin. */
  const trajectoires = useMemo(() => {
    const params: ParamsAutocall = {
      barriereRappelPct,
      couponPct: couponPeriodePct,
      barriereProtectionPct,
      rPct: R_PCT,
      dtAnnees,
      nbPeriodes,
    };
    const sous = Math.max(1, Math.round(48 / nbPeriodes));
    return SEEDS_TRAJECTOIRES.map(graine => {
      const chemin = trajectoireLognormale(graine, S0, R_PCT, volPct, dtAnnees / sous, nbPeriodes * sous);
      const observations: number[] = [];
      for (let i = 1; i <= nbPeriodes; i++) observations.push(chemin[i * sous]);
      const resultat = payoffAutocall(observations, S0, params);
      /* Le produit meurt au rappel : le chemin s'arrête là. */
      const finIndex = resultat.periodeRappel !== null ? resultat.periodeRappel * sous : chemin.length - 1;
      const points = chemin.slice(0, finIndex + 1).map((niveau, i) => ({ t: (i * dtAnnees) / sous, niveau }));
      return { graine, points, resultat };
    });
  }, [volPct, barriereRappelPct, barriereProtectionPct, couponPeriodePct, dtAnnees, nbPeriodes]);

  /* ── Vue (b) : prix MC + distribution des issues, tout seedé ── */
  const monteCarlo = useMemo(() => {
    const params: ParamsAutocall = {
      barriereRappelPct,
      couponPct: couponPeriodePct,
      barriereProtectionPct,
      rPct: R_PCT,
      dtAnnees,
      nbPeriodes,
    };
    const prix = prixAutocallMC(SEED_PRIX, N_PRIX, S0, volPct, params);
    const rappelsParAn = new Array<number>(ANNEES).fill(0);
    let rembourse = 0;
    let perte = 0;
    for (let i = 0; i < N_DISTRIBUTION; i++) {
      const chemin = trajectoireLognormale(SEED_DISTRIBUTION + i, S0, R_PCT, volPct, dtAnnees, nbPeriodes);
      const resultat = payoffAutocall(chemin.slice(1), S0, params);
      if (resultat.periodeRappel !== null) {
        rappelsParAn[Math.ceil(resultat.periodeRappel * dtAnnees - 1e-9) - 1]++;
      } else if (resultat.flux >= 100 - 1e-9) {
        rembourse++;
      } else {
        perte++;
      }
    }
    const enPct = (n: number) => (n / N_DISTRIBUTION) * 100;
    return {
      prix,
      rappelsParAnPct: rappelsParAn.map(enPct),
      remboursePct: enPct(rembourse),
      pertePct: enPct(perte),
    };
  }, [volPct, barriereRappelPct, barriereProtectionPct, couponPeriodePct, dtAnnees, nbPeriodes]);

  /* ── Échelles de la vue trajectoires ── */
  const niveauxAffiches = trajectoires.flatMap(t => t.points.map(p => p.niveau));
  let yLo = Math.min(barriereProtectionPct - 8, ...niveauxAffiches);
  let yHi = Math.max(barriereRappelPct + 8, ...niveauxAffiches);
  const margeY = (yHi - yLo) * 0.06;
  yLo = Math.max(0, yLo - margeY);
  yHi += margeY;

  const eX = (t: number) => M_G + (t / ANNEES) * TRACE_L;
  const eY = (v: number) => M_H + TRACE_H - ((v - yLo) / (yHi - yLo)) * TRACE_H;

  const pasY = pasNice((yHi - yLo) / 4);
  const ticksY: number[] = [];
  for (let v = Math.ceil(yLo / pasY) * pasY; v <= yHi; v += pasY) ticksY.push(v);
  const ticksAnnees = [0, 1, 2, 3, 4, 5];

  const couleurIssue = (resultat: (typeof trajectoires)[number]['resultat']) =>
    resultat.periodeRappel !== null ? 'var(--ok)' : resultat.flux >= 100 - 1e-9 ? 'var(--text-muted)' : 'var(--err)';

  const nbRappelees = trajectoires.filter(t => t.resultat.periodeRappel !== null).length;

  /* ── Barres de la distribution ── */
  const categories = [
    ...monteCarlo.rappelsParAnPct.map((pct, i) => ({
      cle: `an${i + 1}`,
      libelle: `${L.an} ${i + 1}`,
      pct,
      couleur: 'var(--ok)',
    })),
    { cle: 'rembourse', libelle: L.aMaturite, pct: monteCarlo.remboursePct, couleur: 'var(--text-muted)' },
    { cle: 'perte', libelle: L.perte, pct: monteCarlo.pertePct, couleur: 'var(--err)' },
  ];
  const pctMax = Math.max(10, ...categories.map(c => c.pct)) * 1.18;
  const largeurCase = TRACE_L / categories.length;
  const largeurBarre = largeurCase * 0.62;
  const eYBarre = (pct: number) => M_H + TRACE_H - (pct / pctMax) * TRACE_H;

  /* ── Textes dérivés ── */
  const fPrix = fmtNombre(monteCarlo.prix, 2, langue);
  const fMarge = fmtNombre(100 - monteCarlo.prix, 2, langue);
  const fPerte = fmtNombre(monteCarlo.pertePct, 1, langue);
  const fAn1 = fmtNombre(monteCarlo.rappelsParAnPct[0], 1, langue);
  const phrasePrix = monteCarlo.prix <= 100 ? L.prixSous100(fPrix, fMarge) : L.prixSur100(fPrix);
  const phraseVol = L.volEtQueue(volPct, fPerte, fAn1);

  const curseurs: ReadonlyArray<{
    libelle: string;
    valeur: number;
    affichage: string;
    min: number;
    max: number;
    pas: number;
    surChange: (v: number) => void;
  }> = [
    { libelle: L.rappel, valeur: barriereRappelPct, affichage: `${barriereRappelPct} %`, min: RAPPEL_MIN, max: RAPPEL_MAX, pas: 1, surChange: setBarriereRappelPct },
    { libelle: L.protection, valeur: barriereProtectionPct, affichage: `${barriereProtectionPct} %`, min: PROT_MIN, max: PROT_MAX, pas: 1, surChange: setBarriereProtectionPct },
    { libelle: L.coupon, valeur: couponAnnuelPct, affichage: `${fmtNombre(couponAnnuelPct, 1, langue)} ${L.parAn}`, min: COUPON_MIN, max: COUPON_MAX, pas: 0.5, surChange: setCouponAnnuelPct },
    { libelle: L.vol, valeur: volPct, affichage: `${volPct} %`, min: VOL_MIN, max: VOL_MAX, pas: 1, surChange: setVolPct },
    { libelle: L.obs, valeur: obsParAn, affichage: `${obsParAn}`, min: OBS_MIN, max: OBS_MAX, pas: 1, surChange: setObsParAn },
  ];

  const ariaTraj =
    langue === 'fr'
      ? `${SEEDS_TRAJECTOIRES.length} trajectoires simulées sur 5 ans, barrière de rappel à ${barriereRappelPct} %, barrière de protection à ${barriereProtectionPct} %. ${nbRappelees} trajectoires rappelées avant maturité.`
      : `${SEEDS_TRAJECTOIRES.length} simulated paths over 5 years, autocall barrier at ${barriereRappelPct}%, protection barrier at ${barriereProtectionPct}%. ${nbRappelees} paths called before maturity.`;
  const ariaDist =
    langue === 'fr'
      ? `Distribution des issues sur ${N_DISTRIBUTION} scénarios : ${categories.map(c => `${c.libelle} ${fmtNombre(c.pct, 1, langue)} %`).join(', ')}.`
      : `Distribution of outcomes over ${N_DISTRIBUTION} scenarios: ${categories.map(c => `${c.libelle} ${fmtNombre(c.pct, 1, langue)}%`).join(', ')}.`;

  return (
    <div className="my-6 rounded-lg border border-border bg-surface">
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2.5">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">{L.titre}</p>
        <span className="text-[11px] text-text-muted">{L.sousTitre}</span>
      </div>

      {/* Choix de la vue */}
      <div className="flex flex-wrap items-center gap-2 px-4 pt-3">
        <Button
          variante={vue === 'trajectoires' ? 'primaire' : 'secondaire'}
          taille="sm"
          onClick={() => setVue('trajectoires')}
          aria-pressed={vue === 'trajectoires'}
        >
          {L.vueTraj}
        </Button>
        <Button
          variante={vue === 'prix' ? 'primaire' : 'secondaire'}
          taille="sm"
          onClick={() => setVue('prix')}
          aria-pressed={vue === 'prix'}
        >
          {L.vuePrix}
        </Button>
      </div>

      {/* Curseurs */}
      <div className="grid grid-cols-1 gap-x-6 gap-y-2 px-4 pt-3 sm:grid-cols-2 lg:grid-cols-3">
        {curseurs.map(c => (
          <label key={c.libelle} className="flex flex-col gap-0.5">
            <span className="flex items-baseline justify-between gap-2 text-xs text-text-muted">
              <span>{c.libelle}</span>
              <strong className="tabular-nums text-[13px] font-semibold text-text">{c.affichage}</strong>
            </span>
            <input
              type="range"
              min={c.min}
              max={c.max}
              step={c.pas}
              value={c.valeur}
              onChange={e => c.surChange(Number(e.target.value))}
              className="h-5 w-full cursor-pointer"
              style={{ accentColor: 'var(--accent)' }}
              aria-label={`${c.libelle} : ${c.affichage}`}
            />
          </label>
        ))}
        <p className="self-end pb-0.5 text-[11px] tabular-nums text-text-muted">
          {fmtNombre(couponAnnuelPct, 1, langue)} {L.parAn} = {fmtNombre(couponPeriodePct, 2, langue)} % {L.parObs} × {nbPeriodes}
        </p>
      </div>

      {vue === 'trajectoires' ? (
        <>
          {/* Vue (a) : trajectoires et barrières */}
          <div className="px-2 pt-1">
            <svg viewBox={`0 0 ${VB_L} ${VB_H}`} className="block w-full" role="img" aria-label={ariaTraj}>
              {/* Grille */}
              {ticksY.map(v => (
                <g key={v}>
                  <line
                    x1={M_G} x2={M_G + TRACE_L} y1={eY(v)} y2={eY(v)}
                    stroke="var(--border)" strokeWidth={0.6} strokeDasharray="3 4"
                  />
                  <text x={M_G - 5} y={eY(v) + 3} textAnchor="end" fontSize={8.5} fill="var(--text-muted)">
                    {fmtNombre(v, 0, langue)}
                  </text>
                </g>
              ))}
              {ticksAnnees.map(a => (
                <g key={a}>
                  <line
                    x1={eX(a)} x2={eX(a)} y1={M_H} y2={M_H + TRACE_H}
                    stroke="var(--border)" strokeWidth={0.5} strokeDasharray="2 5"
                  />
                  <text x={eX(a)} y={M_H + TRACE_H + 12} textAnchor="middle" fontSize={8.5} fill="var(--text-muted)">
                    {a}
                  </text>
                </g>
              ))}

              {/* Barrières matérialisées */}
              <line
                x1={M_G} x2={M_G + TRACE_L} y1={eY(barriereRappelPct)} y2={eY(barriereRappelPct)}
                stroke="var(--accent)" strokeWidth={1.3} strokeDasharray="6 4"
              />
              <text x={M_G + TRACE_L - 2} y={eY(barriereRappelPct) - 4} textAnchor="end" fontSize={8} fontWeight={600} fill="var(--accent)">
                {L.barRappel} {barriereRappelPct} %
              </text>
              <line
                x1={M_G} x2={M_G + TRACE_L} y1={eY(barriereProtectionPct)} y2={eY(barriereProtectionPct)}
                stroke="var(--err)" strokeWidth={1.3} strokeDasharray="6 4"
              />
              <text x={M_G + TRACE_L - 2} y={eY(barriereProtectionPct) - 4} textAnchor="end" fontSize={8} fontWeight={600} fill="var(--err)">
                {L.barProtection} {barriereProtectionPct} %
              </text>

              {/* Trajectoires, coloriées par leur issue (payoffAutocall) */}
              {trajectoires.map(t => (
                <path
                  key={t.graine}
                  d={t.points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${eX(p.t).toFixed(1)} ${eY(p.niveau).toFixed(1)}`).join(' ')}
                  fill="none"
                  stroke={couleurIssue(t.resultat)}
                  strokeWidth={1.4}
                  strokeLinejoin="round"
                  opacity={0.8}
                />
              ))}

              {/* Moments du rappel */}
              {trajectoires
                .filter(t => t.resultat.periodeRappel !== null)
                .map(t => {
                  const dernier = t.points[t.points.length - 1];
                  return (
                    <circle
                      key={`rappel-${t.graine}`}
                      cx={eX(dernier.t)}
                      cy={eY(dernier.niveau)}
                      r={3.5}
                      fill="var(--ok)"
                      stroke="var(--surface)"
                      strokeWidth={1.2}
                    />
                  );
                })}

              <text x={M_G + TRACE_L / 2} y={VB_H - 4} textAnchor="middle" fontSize={8.5} fill="var(--text-muted)">
                {L.axeXans}
              </text>
              <text x={M_G} y={9} fontSize={8.5} fontWeight={600} fill="var(--text-muted)">
                {L.axeYniveau}
              </text>
            </svg>
          </div>

          {/* Légende */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 px-4 pb-1 text-[11px] text-text-muted">
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-0.5 w-4" style={{ backgroundColor: 'var(--ok)' }} aria-hidden="true" />
              {L.legRappelee}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-0.5 w-4" style={{ backgroundColor: 'var(--text-muted)' }} aria-hidden="true" />
              {L.legMaturite}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-0.5 w-4" style={{ backgroundColor: 'var(--err)' }} aria-hidden="true" />
              {L.legPerte}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: 'var(--ok)' }} aria-hidden="true" />
              {L.legPointRappel}
            </span>
            <span className="tabular-nums font-semibold text-text">
              {nbRappelees}/{SEEDS_TRAJECTOIRES.length} {L.trajRappelees}
            </span>
          </div>

          {/* Lecture : la mécanique */}
          <div className="border-t border-border px-4 py-3" aria-live="polite">
            <p className="text-[11px] leading-relaxed text-text-muted">
              <strong className="text-text">{L.lecture} :</strong> {L.mecanique}
            </p>
          </div>
        </>
      ) : (
        <>
          {/* Vue (b) : prix MC et distribution des issues */}
          <div className="flex flex-wrap items-end gap-x-6 gap-y-2 px-4 pt-3" aria-live="polite">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-text-muted">
                {L.prixMC} ({N_PRIX.toLocaleString(langue === 'fr' ? 'fr-FR' : 'en-US')} {L.scenarios})
              </p>
              <p className="tabular-nums text-2xl font-semibold leading-tight text-accent">
                {fPrix} <span className="text-sm font-medium text-text-muted">{L.duNominal}</span>
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-x-6">
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-text-muted">{L.margeStructureur}</dt>
                <dd className="tabular-nums text-[13px] font-semibold text-text">
                  {fMarge} {L.pointsNominal}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-text-muted">{L.probaPerte}</dt>
                <dd className="tabular-nums text-[13px] font-semibold" style={{ color: 'var(--err)' }}>
                  {fPerte} %
                </dd>
              </div>
            </dl>
          </div>

          <div className="px-2 pt-1">
            <p className="px-2 pt-1 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
              {L.distTitre} — {N_DISTRIBUTION.toLocaleString(langue === 'fr' ? 'fr-FR' : 'en-US')} {L.scenarios}
            </p>
            <svg viewBox={`0 0 ${VB_L} ${VB_H}`} className="block w-full" role="img" aria-label={ariaDist}>
              {/* Grille horizontale */}
              {[0, 25, 50, 75].filter(p => p <= pctMax).map(p => (
                <g key={p}>
                  <line
                    x1={M_G} x2={M_G + TRACE_L} y1={eYBarre(p)} y2={eYBarre(p)}
                    stroke="var(--border)" strokeWidth={p === 0 ? 1.2 : 0.6}
                    strokeDasharray={p === 0 ? undefined : '3 4'}
                  />
                  <text x={M_G - 5} y={eYBarre(p) + 3} textAnchor="end" fontSize={8.5} fill="var(--text-muted)">
                    {p}
                  </text>
                </g>
              ))}

              {/* Barres */}
              {categories.map((c, i) => {
                const x = M_G + i * largeurCase + (largeurCase - largeurBarre) / 2;
                const y = eYBarre(c.pct);
                return (
                  <g key={c.cle}>
                    <rect
                      x={x.toFixed(1)}
                      y={y.toFixed(1)}
                      width={largeurBarre.toFixed(1)}
                      height={Math.max(0, eYBarre(0) - y).toFixed(1)}
                      rx={2}
                      fill={c.couleur}
                      opacity={0.8}
                    >
                      <title>{`${c.libelle} : ${fmtNombre(c.pct, 1, langue)} %`}</title>
                    </rect>
                    <text
                      x={x + largeurBarre / 2}
                      y={y - 4}
                      textAnchor="middle"
                      fontSize={8}
                      fontWeight={600}
                      fill="var(--text)"
                      className="tabular-nums"
                    >
                      {fmtNombre(c.pct, 1, langue)}
                    </text>
                    <text
                      x={x + largeurBarre / 2}
                      y={M_H + TRACE_H + 12}
                      textAnchor="middle"
                      fontSize={8}
                      fill="var(--text-muted)"
                    >
                      {c.libelle}
                    </text>
                  </g>
                );
              })}

              <text x={M_G} y={9} fontSize={8.5} fontWeight={600} fill="var(--text-muted)">
                {L.axeYfreq}
              </text>
            </svg>
          </div>

          {/* Lecture : prix, marge, vol et queue de perte */}
          <div className="border-t border-border px-4 py-3" aria-live="polite">
            <p className="text-[11px] leading-relaxed text-text-muted">
              <strong className="text-text">{L.lecture} :</strong> {phrasePrix}
            </p>
            <p className="mt-1.5 text-[11px] leading-relaxed text-text-muted">{phraseVol}</p>
          </div>
        </>
      )}
    </div>
  );
}
