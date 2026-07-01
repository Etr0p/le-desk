import { useState } from 'react';
import {
  blackScholesCall,
  blackScholesPut,
  payoffCall,
  payoffPut,
  pnlOption,
  pointMortCall,
  pointMortPut,
  pointsMortsStraddle,
} from '../../content/modules/08-options-volatilite/calculs';
import { useLangue } from '../../engine/useLangue';
import type { Langue } from '../../engine/types';
import { Button } from '../ui/Button';

/* ── Constructeur de payoff (module 8, ch2) ─────────────────────────────
   Neuf stratégies prédéfinies sur un sous-jacent à 100 (strike central
   K = 100). Les primes sont INDICATIVES, calculées par blackScholesCall/
   blackScholesPut (r = 5 %, T = 0,5 an, σ réglable au curseur) — jamais
   recopiées. Le P&L à l'échéance de chaque jambe vient de pnlOption ∘
   payoffCall/payoffPut ; les points morts des stratégies canoniques
   viennent de pointMortCall / pointMortPut / pointsMortsStraddle, les
   autres sont lus sur la courbe (interpolation exacte : le P&L est
   linéaire par morceaux entre les strikes). Tout est dérivé à chaque
   rendu — aucun aléa, aucun Date.now.                                  */

const S0 = 100; // cours d'achat de référence du titre = strike central
const K_CENTRAL = 100;
const R_PCT = 5;
const T_ANNEES = 0.5;

const VOL_MIN = 10;
const VOL_MAX = 40;
const VOL_DEFAUT = 20;

const S_MIN = 60;
const S_MAX = 140;

/* Géométrie du SVG (unités viewBox). */
const VB_L = 400;
const VB_H = 230;
const M_G = 46;
const M_D = 12;
const M_H = 18;
const M_B = 30;
const TRACE_L = VB_L - M_G - M_D;
const TRACE_H = VB_H - M_H - M_B;

/* ── Jambes et stratégies ── */
type Sens = 1 | -1;
type Jambe =
  | { instrument: 'call' | 'put'; sens: Sens; strike: number }
  | { instrument: 'titre'; sens: Sens };

type IdStrategie =
  | 'callAchete' | 'putAchete' | 'callVendu' | 'putVendu'
  | 'coveredCall' | 'protectivePut' | 'bullSpread' | 'straddle' | 'collar';

interface DefStrategie {
  id: IdStrategie;
  nom: Record<Langue, string>;
  jambes: (k2: number) => Jambe[];
  curseurK2?: { label: Record<Langue, string>; min: number; max: number; defaut: number };
}

const STRATEGIES: ReadonlyArray<DefStrategie> = [
  { id: 'callAchete', nom: { fr: 'Call acheté', en: 'Long call' }, jambes: () => [{ instrument: 'call', sens: 1, strike: K_CENTRAL }] },
  { id: 'putAchete', nom: { fr: 'Put acheté', en: 'Long put' }, jambes: () => [{ instrument: 'put', sens: 1, strike: K_CENTRAL }] },
  { id: 'callVendu', nom: { fr: 'Call vendu', en: 'Short call' }, jambes: () => [{ instrument: 'call', sens: -1, strike: K_CENTRAL }] },
  { id: 'putVendu', nom: { fr: 'Put vendu', en: 'Short put' }, jambes: () => [{ instrument: 'put', sens: -1, strike: K_CENTRAL }] },
  {
    id: 'coveredCall', nom: { fr: 'Covered call', en: 'Covered call' },
    curseurK2: { label: { fr: 'Strike du call vendu', en: 'Strike of the sold call' }, min: 100, max: 125, defaut: 110 },
    jambes: k2 => [{ instrument: 'titre', sens: 1 }, { instrument: 'call', sens: -1, strike: k2 }],
  },
  {
    id: 'protectivePut', nom: { fr: 'Protective put', en: 'Protective put' },
    curseurK2: { label: { fr: 'Strike du put de protection', en: 'Strike of the protective put' }, min: 75, max: 100, defaut: 90 },
    jambes: k2 => [{ instrument: 'titre', sens: 1 }, { instrument: 'put', sens: 1, strike: k2 }],
  },
  {
    id: 'bullSpread', nom: { fr: 'Bull call spread', en: 'Bull call spread' },
    curseurK2: { label: { fr: 'Strike du call vendu (2ᵉ jambe)', en: 'Strike of the sold call (2nd leg)' }, min: 105, max: 130, defaut: 115 },
    jambes: k2 => [{ instrument: 'call', sens: 1, strike: K_CENTRAL }, { instrument: 'call', sens: -1, strike: k2 }],
  },
  {
    id: 'straddle', nom: { fr: 'Straddle acheté', en: 'Long straddle' },
    jambes: () => [{ instrument: 'call', sens: 1, strike: K_CENTRAL }, { instrument: 'put', sens: 1, strike: K_CENTRAL }],
  },
  {
    id: 'collar', nom: { fr: 'Collar', en: 'Collar' },
    curseurK2: { label: { fr: 'Strike du put (call vendu en miroir)', en: 'Put strike (call sold at the mirror)' }, min: 80, max: 95, defaut: 90 },
    jambes: k2 => [{ instrument: 'titre', sens: 1 }, { instrument: 'put', sens: 1, strike: k2 }, { instrument: 'call', sens: -1, strike: 200 - k2 }],
  },
];

/* ── Textes d'interface FR/EN ── */
const TXT = {
  fr: {
    titre: 'Constructeur de payoff',
    sousTitre: 'Sous-jacent à 100 — primes Black-Scholes, r = 5 %, T = 0,5 an',
    strategie: 'Stratégie :',
    vol: 'Volatilité (prime indicative)',
    coutNet: 'Coût net des options',
    debit: 'débit payé',
    credit: 'crédit encaissé',
    pointsMorts: 'Point(s) mort(s)',
    gainMax: 'Gain max',
    perteMax: 'Perte max',
    illimite: 'Illimité',
    illimitee: 'Illimitée',
    pari: 'Ce que vous pariez',
    axeX: 'cours du sous-jacent à l’échéance',
    axeY: 'P&L',
    zoneGain: 'zone de gain',
    zonePerte: 'zone de perte',
    legGain: 'gain à l’échéance',
    legPerte: 'perte à l’échéance',
    legPm: 'point mort',
    titreJambe: 'Titre acheté à 100',
    achete: 'acheté',
    vendu: 'vendu',
    prime: 'prime',
  },
  en: {
    titre: 'Payoff builder',
    sousTitre: 'Underlying at 100 — Black-Scholes premiums, r = 5%, T = 0.5 yr',
    strategie: 'Strategy:',
    vol: 'Volatility (indicative premium)',
    coutNet: 'Net option cost',
    debit: 'debit paid',
    credit: 'credit received',
    pointsMorts: 'Breakeven(s)',
    gainMax: 'Max gain',
    perteMax: 'Max loss',
    illimite: 'Unlimited',
    illimitee: 'Unlimited',
    pari: 'What you are betting on',
    axeX: 'underlying price at expiry',
    axeY: 'P&L',
    zoneGain: 'profit zone',
    zonePerte: 'loss zone',
    legGain: 'profit at expiry',
    legPerte: 'loss at expiry',
    legPm: 'breakeven',
    titreJambe: 'Stock bought at 100',
    achete: 'long',
    vendu: 'short',
    prime: 'premium',
  },
} as const;

/* ── Format : virgule décimale en FR, point en EN ── */
function fmtNombre(v: number, dec: number, langue: Langue): string {
  const arrondiNul = Math.abs(v) < 0.5 * 10 ** -dec;
  const abs = Math.abs(v).toFixed(dec);
  const txt = langue === 'fr' ? abs.replace('.', ',') : abs;
  return (v < 0 && !arrondiNul ? '−' : '') + txt;
}

function fmtSigne(v: number, dec: number, langue: Langue): string {
  return (v > 0 ? '+' : '') + fmtNombre(v, dec, langue);
}

/** Pas « rond » (1/2/5 × 10^n) pour les graduations Y. */
function pasNice(brut: number): number {
  const exp = Math.floor(Math.log10(brut));
  const base = brut / 10 ** exp;
  const nice = base <= 1 ? 1 : base <= 2 ? 2 : base <= 5 ? 5 : 10;
  return nice * 10 ** exp;
}

/* ── Composant ── */
export function PayoffBuilder() {
  const { langue } = useLangue();
  const L = TXT[langue];
  const [idStrategie, setIdStrategie] = useState<IdStrategie>('callAchete');
  const [volPct, setVolPct] = useState(VOL_DEFAUT);
  const [k2, setK2] = useState(0);

  const def = STRATEGIES.find(s => s.id === idStrategie) ?? STRATEGIES[0];

  function choisirStrategie(d: DefStrategie) {
    setIdStrategie(d.id);
    setK2(d.curseurK2 ? d.curseurK2.defaut : 0);
  }

  /* ── Jambes valorisées : prime BS par jambe optionnelle ── */
  const jambes = def.jambes(k2).map(j => ({
    jambe: j,
    prime:
      j.instrument === 'call' ? blackScholesCall(S0, j.strike, R_PCT, volPct, T_ANNEES)
      : j.instrument === 'put' ? blackScholesPut(S0, j.strike, R_PCT, volPct, T_ANNEES)
      : 0,
  }));

  /** P&L total de la stratégie à l'échéance, pour un cours final sT. */
  function pnlTotal(sT: number): number {
    let total = 0;
    for (const { jambe, prime } of jambes) {
      if (jambe.instrument === 'titre') total += jambe.sens * (sT - S0);
      else if (jambe.instrument === 'call') total += pnlOption(payoffCall(sT, jambe.strike), prime, jambe.sens);
      else total += pnlOption(payoffPut(sT, jambe.strike), prime, jambe.sens);
    }
    return total;
  }

  /* Coût net des jambes optionnelles : > 0 = débit payé, < 0 = crédit. */
  const coutNet = jambes.reduce((a, { jambe, prime }) => (jambe.instrument === 'titre' ? a : a + jambe.sens * prime), 0);

  /* ── Échantillon du P&L (pas de 1 : les kinks aux strikes entiers sont
        sur la grille, l'interpolation des zéros est donc EXACTE) ── */
  const echantillon: Array<{ s: number; v: number }> = [];
  for (let s = S_MIN; s <= S_MAX; s++) echantillon.push({ s, v: pnlTotal(s) });

  const pointsAvecZeros: Array<{ s: number; v: number }> = [];
  for (let i = 0; i < echantillon.length; i++) {
    pointsAvecZeros.push(echantillon[i]);
    const a = echantillon[i];
    const b = echantillon[i + 1];
    if (b && a.v * b.v < 0) {
      pointsAvecZeros.push({ s: a.s + a.v / (a.v - b.v), v: 0 });
    }
  }

  /* ── Points morts : fonctions canoniques quand elles existent,
        sinon lecture des zéros interpolés ── */
  let pointsMorts: number[];
  if (idStrategie === 'callAchete' || idStrategie === 'callVendu') {
    pointsMorts = [pointMortCall(K_CENTRAL, jambes[0].prime)];
  } else if (idStrategie === 'putAchete' || idStrategie === 'putVendu') {
    pointsMorts = [pointMortPut(K_CENTRAL, jambes[0].prime)];
  } else if (idStrategie === 'straddle') {
    const pm = pointsMortsStraddle(K_CENTRAL, jambes[0].prime + jambes[1].prime);
    pointsMorts = [pm.bas, pm.haut];
  } else {
    /* Zéros interpolés + points de grille exactement nuls, dédupliqués. */
    const bruts = pointsAvecZeros.filter(p => Math.abs(p.v) < 1e-9).map(p => p.s);
    pointsMorts = bruts.filter((s, i) => i === 0 || Math.abs(s - bruts[i - 1]) > 0.01);
  }

  /* ── Extrêmes analytiques : le P&L est linéaire par morceaux, ses
        extrêmes sont aux strikes ou en 0 — sauf branche droite ouverte ── */
  const strikes = def.jambes(k2).flatMap(j => (j.instrument === 'titre' ? [] : [j.strike]));
  const candidats = [0, ...strikes].map(s => pnlTotal(s));
  const sLoin = Math.max(S0, ...strikes) + 50;
  const penteDroite = pnlTotal(sLoin + 1) - pnlTotal(sLoin);
  const gainMax = penteDroite > 1e-9 ? Infinity : Math.max(...candidats);
  const perteMax = penteDroite < -1e-9 ? -Infinity : Math.min(...candidats);

  /* ── Échelles ── */
  let yLo = Math.min(0, ...echantillon.map(p => p.v));
  let yHi = Math.max(0, ...echantillon.map(p => p.v));
  if (yHi - yLo < 10) { const c = (yLo + yHi) / 2; yLo = c - 5; yHi = c + 5; }
  const marge = (yHi - yLo) * 0.14;
  yLo -= marge;
  yHi += marge;

  const eX = (s: number) => M_G + ((s - S_MIN) / (S_MAX - S_MIN)) * TRACE_L;
  const eY = (v: number) => M_H + TRACE_H - ((v - yLo) / (yHi - yLo)) * TRACE_H;
  const y0 = eY(0);

  const cheminPnl = pointsAvecZeros
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${eX(p.s).toFixed(1)} ${eY(p.v).toFixed(1)}`)
    .join(' ');

  /** Polygones des zones gain (v ≥ 0) ou perte (v ≤ 0), fermés sur l'axe. */
  function cheminZone(positif: boolean): string {
    const morceaux: string[] = [];
    let seg: Array<{ s: number; v: number }> = [];
    const fermer = () => {
      if (seg.length >= 2) {
        morceaux.push(
          `M ${eX(seg[0].s).toFixed(1)} ${y0.toFixed(1)} ` +
          seg.map(p => `L ${eX(p.s).toFixed(1)} ${eY(p.v).toFixed(1)}`).join(' ') +
          ` L ${eX(seg[seg.length - 1].s).toFixed(1)} ${y0.toFixed(1)} Z`,
        );
      }
      seg = [];
    };
    for (const p of pointsAvecZeros) {
      if (positif ? p.v >= -1e-9 : p.v <= 1e-9) seg.push(p);
      else fermer();
    }
    fermer();
    return morceaux.join(' ');
  }

  /* Graduations Y « rondes » + verticales X fixes. */
  const pasY = pasNice((yHi - yLo) / 4);
  const ticksY: number[] = [];
  for (let v = Math.ceil(yLo / pasY) * pasY; v <= yHi; v += pasY) ticksY.push(v);
  const ticksX = [60, 80, 100, 120, 140];

  /* Marqueurs gain max / perte max : seulement si l'extrême FINI est
     atteint dans la fenêtre affichée (premier point du plateau). */
  let iMax = 0;
  let iMin = 0;
  echantillon.forEach((p, i) => {
    if (p.v > echantillon[iMax].v) iMax = i;
    if (p.v < echantillon[iMin].v) iMin = i;
  });
  const marqueurGain = Number.isFinite(gainMax) && Math.abs(echantillon[iMax].v - gainMax) < 1e-6 ? echantillon[iMax] : null;
  const marqueurPerte = Number.isFinite(perteMax) && Math.abs(echantillon[iMin].v - perteMax) < 1e-6 ? echantillon[iMin] : null;

  /* ── Textes dérivés ── */
  const pmTexte = pointsMorts.map(p => fmtNombre(p, 1, langue)).join(langue === 'fr' ? ' et ' : ' and ');
  const gainMaxTexte = Number.isFinite(gainMax) ? fmtSigne(gainMax, 2, langue) : L.illimite;
  const perteMaxTexte = Number.isFinite(perteMax) ? fmtSigne(perteMax, 2, langue) : L.illimitee;

  function libelleJambe(j: Jambe, prime: number): string {
    if (j.instrument === 'titre') return L.titreJambe;
    const nomInstr = j.instrument === 'call' ? 'Call' : 'Put';
    const sens = j.sens === 1 ? L.achete : L.vendu;
    const p = `${L.prime} ${fmtNombre(prime, 2, langue)}`;
    return langue === 'fr' ? `${nomInstr} ${j.strike} ${sens} (${p})` : `${sens} ${nomInstr.toLowerCase()} ${j.strike} (${p})`;
  }

  function phrasePari(): string {
    const fr = langue === 'fr';
    const pm = pointsMorts.map(p => fmtNombre(p, 1, langue));
    const cout = fmtNombre(Math.abs(coutNet), 2, langue);
    const kMiroir = 200 - k2;
    switch (idStrategie) {
      case 'callAchete':
        return fr
          ? `Vous pariez sur une hausse au-delà de ${pm[0]} : perte limitée à la prime (${cout}), gain illimité au-dessus.`
          : `You bet on a rise beyond ${pm[0]}: loss capped at the premium (${cout}), unlimited gain above.`;
      case 'putAchete':
        return fr
          ? `Vous pariez sur une baisse sous ${pm[0]} : perte limitée à la prime (${cout}), gain maximal si le titre s'effondre.`
          : `You bet on a fall below ${pm[0]}: loss capped at the premium (${cout}), maximum gain if the stock collapses.`;
      case 'callVendu':
        return fr
          ? `Vous encaissez la prime (${cout}) et pariez que le titre restera sous ${pm[0]} : gain plafonné, perte illimitée à la hausse.`
          : `You collect the premium (${cout}) and bet the stock stays below ${pm[0]}: capped gain, unlimited loss on the upside.`;
      case 'putVendu':
        return fr
          ? `Vous encaissez la prime (${cout}) et pariez que le titre tiendra au-dessus de ${pm[0]} : gain plafonné, grosse perte si le titre s'effondre.`
          : `You collect the premium (${cout}) and bet the stock holds above ${pm[0]}: capped gain, heavy loss if the stock collapses.`;
      case 'coveredCall':
        return fr
          ? `Vous détenez le titre et vendez le call ${k2} : la prime encaissée améliore le rendement, mais la hausse est plafonnée à ${k2}.`
          : `You hold the stock and sell the ${k2} call: the premium boosts the return, but the upside is capped at ${k2}.`;
      case 'protectivePut':
        return fr
          ? `Vous détenez le titre et achetez le put ${k2} en assurance : la perte est plancher, la hausse reste ouverte (moins la prime).`
          : `You hold the stock and buy the ${k2} put as insurance: the loss is floored, the upside stays open (minus the premium).`;
      case 'bullSpread':
        return fr
          ? `Vous pariez sur une hausse modérée vers ${k2} : gain et perte tous deux plafonnés, la vente du call ${k2} réduit la prime.`
          : `You bet on a moderate rise towards ${k2}: both gain and loss are capped, selling the ${k2} call cheapens the trade.`;
      case 'straddle':
        return fr
          ? `Vous pariez sur un GROS mouvement, peu importe le sens : gain sous ${pm[0]} ou au-delà de ${pm[1]}, perte maximale si le titre ne bouge pas.`
          : `You bet on a BIG move, direction irrelevant: gain below ${pm[0]} or beyond ${pm[1]}, maximum loss if the stock goes nowhere.`;
      case 'collar':
        return fr
          ? `Vous détenez le titre, achetez le put ${k2} et financez l'assurance en vendant le call ${kMiroir} : le P&L est encadré dans un tunnel.`
          : `You hold the stock, buy the ${k2} put and fund the insurance by selling the ${kMiroir} call: the P&L is boxed into a tunnel.`;
    }
  }

  const ariaGraphe =
    langue === 'fr'
      ? `P&L à l'échéance de la stratégie ${def.nom.fr}. ${L.pointsMorts} : ${pmTexte}. ${L.gainMax} : ${gainMaxTexte}. ${L.perteMax} : ${perteMaxTexte}.`
      : `P&L at expiry of the ${def.nom.en} strategy. ${L.pointsMorts}: ${pmTexte}. ${L.gainMax}: ${gainMaxTexte}. ${L.perteMax}: ${perteMaxTexte}.`;

  return (
    <div className="my-6 rounded-lg border border-border bg-surface">
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2.5">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">{L.titre}</p>
        <span className="text-[11px] text-text-muted">{L.sousTitre}</span>
      </div>

      {/* Choix de la stratégie */}
      <div className="flex flex-wrap items-center gap-2 px-4 pt-3">
        <span className="text-xs text-text-muted">{L.strategie}</span>
        {STRATEGIES.map(s => (
          <Button
            key={s.id}
            variante={idStrategie === s.id ? 'primaire' : 'secondaire'}
            taille="sm"
            onClick={() => choisirStrategie(s)}
            aria-pressed={idStrategie === s.id}
          >
            {s.nom[langue]}
          </Button>
        ))}
      </div>

      {/* Curseurs : volatilité, et strike de la 2ᵉ jambe si la stratégie en a une */}
      <div className="grid grid-cols-1 gap-x-6 gap-y-2 px-4 pt-3 sm:grid-cols-2">
        <label className="flex flex-col gap-0.5">
          <span className="flex items-baseline justify-between gap-2 text-xs text-text-muted">
            <span>{L.vol}</span>
            <strong className="tabular-nums text-[13px] font-semibold text-text">{volPct} %</strong>
          </span>
          <input
            type="range"
            min={VOL_MIN}
            max={VOL_MAX}
            step={1}
            value={volPct}
            onChange={e => setVolPct(Number(e.target.value))}
            className="h-5 w-full cursor-pointer"
            style={{ accentColor: 'var(--accent)' }}
            aria-label={`${L.vol} : ${volPct} %`}
          />
        </label>
        {def.curseurK2 && (
          <label className="flex flex-col gap-0.5">
            <span className="flex items-baseline justify-between gap-2 text-xs text-text-muted">
              <span>{def.curseurK2.label[langue]}</span>
              <strong className="tabular-nums text-[13px] font-semibold text-text">
                {idStrategie === 'collar' ? `${k2} / ${200 - k2}` : k2}
              </strong>
            </span>
            <input
              type="range"
              min={def.curseurK2.min}
              max={def.curseurK2.max}
              step={1}
              value={k2}
              onChange={e => setK2(Number(e.target.value))}
              className="h-5 w-full cursor-pointer"
              style={{ accentColor: 'var(--accent)' }}
              aria-label={`${def.curseurK2.label[langue]} : ${k2}`}
            />
          </label>
        )}
      </div>

      {/* Jambes et coût net */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 pt-2 text-[11px] text-text-muted">
        {jambes.map(({ jambe, prime }, i) => (
          <span key={i} className="tabular-nums">{libelleJambe(jambe, prime)}</span>
        ))}
        <span className="tabular-nums font-semibold text-text">
          {L.coutNet} : {fmtNombre(Math.abs(coutNet), 2, langue)} ({coutNet >= 0 ? L.debit : L.credit})
        </span>
      </div>

      {/* Graphe du P&L à l'échéance */}
      <div className="px-2 pt-1">
        <svg viewBox={`0 0 ${VB_L} ${VB_H}`} className="block w-full" role="img" aria-label={ariaGraphe}>
          {/* Zones de gain / de perte */}
          <path d={cheminZone(true)} fill="var(--ok)" opacity={0.13} />
          <path d={cheminZone(false)} fill="var(--err)" opacity={0.13} />

          {/* Graduations horizontales + axe zéro */}
          {ticksY.map(v => (
            <g key={v}>
              <line
                x1={M_G} x2={M_G + TRACE_L} y1={eY(v)} y2={eY(v)}
                stroke="var(--border)" strokeWidth={Math.abs(v) < 1e-9 ? 1.3 : 0.6}
                strokeDasharray={Math.abs(v) < 1e-9 ? undefined : '3 4'}
              />
              <text x={M_G - 5} y={eY(v) + 3} textAnchor="end" fontSize={8.5} fill="var(--text-muted)">
                {fmtNombre(v, 0, langue)}
              </text>
            </g>
          ))}

          {/* Graduations verticales (strike central marqué) */}
          {ticksX.map(s => (
            <g key={s}>
              <line
                x1={eX(s)} x2={eX(s)} y1={M_H} y2={M_H + TRACE_H}
                stroke="var(--border)" strokeWidth={s === K_CENTRAL ? 0.9 : 0.5} strokeDasharray="2 5"
              />
              <text x={eX(s)} y={M_H + TRACE_H + 12} textAnchor="middle" fontSize={8.5} fill="var(--text-muted)">
                {s}
              </text>
            </g>
          ))}

          {/* Points morts : verticales pointillées + valeur */}
          {pointsMorts.filter(p => p >= S_MIN && p <= S_MAX).map(p => (
            <g key={p}>
              <line x1={eX(p)} x2={eX(p)} y1={M_H} y2={M_H + TRACE_H} stroke="var(--accent)" strokeWidth={1} strokeDasharray="4 3" />
              <text x={eX(p)} y={M_H - 4} textAnchor="middle" fontSize={8.5} fontWeight={600} fill="var(--accent)">
                {fmtNombre(p, 1, langue)}
              </text>
            </g>
          ))}

          {/* Courbe du P&L */}
          <path d={cheminPnl} fill="none" stroke="var(--accent)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

          {/* Marqueurs gain max / perte max (si atteints dans la fenêtre) */}
          {marqueurGain && (
            <g>
              <circle cx={eX(marqueurGain.s)} cy={eY(marqueurGain.v)} r={3.5} fill="var(--ok)" stroke="var(--surface)" strokeWidth={1.2} />
              <text x={eX(marqueurGain.s)} y={eY(marqueurGain.v) - 6} textAnchor="middle" fontSize={8} fontWeight={600} fill="var(--ok)">
                {L.gainMax.toLowerCase()} {fmtSigne(marqueurGain.v, 1, langue)}
              </text>
            </g>
          )}
          {marqueurPerte && (
            <g>
              <circle cx={eX(marqueurPerte.s)} cy={eY(marqueurPerte.v)} r={3.5} fill="var(--err)" stroke="var(--surface)" strokeWidth={1.2} />
              <text x={eX(marqueurPerte.s)} y={eY(marqueurPerte.v) + 12} textAnchor="middle" fontSize={8} fontWeight={600} fill="var(--err)">
                {L.perteMax.toLowerCase()} {fmtSigne(marqueurPerte.v, 1, langue)}
              </text>
            </g>
          )}

          <text x={M_G + TRACE_L / 2} y={VB_H - 4} textAnchor="middle" fontSize={8.5} fill="var(--text-muted)">
            {L.axeX}
          </text>
          <text x={M_G} y={9} fontSize={8.5} fontWeight={600} fill="var(--text-muted)">
            {L.axeY}
          </text>
        </svg>
      </div>

      {/* Légende */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 px-4 pb-1 text-[11px] text-text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: 'var(--ok)', opacity: 0.35 }} aria-hidden="true" />
          {L.legGain}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: 'var(--err)', opacity: 0.35 }} aria-hidden="true" />
          {L.legPerte}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4" style={{ backgroundColor: 'var(--accent)' }} aria-hidden="true" />
          {L.legPm}
        </span>
      </div>

      {/* Encart de lecture : points morts, extrêmes, pari */}
      <div className="border-t border-border px-4 py-3" aria-live="polite">
        <dl className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-3">
          <div>
            <dt className="text-[10px] uppercase tracking-wider text-text-muted">{L.pointsMorts}</dt>
            <dd className="tabular-nums text-[15px] font-semibold text-accent">{pmTexte}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-wider text-text-muted">{L.gainMax}</dt>
            <dd className="tabular-nums text-[15px] font-semibold" style={{ color: 'var(--ok)' }}>{gainMaxTexte}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-wider text-text-muted">{L.perteMax}</dt>
            <dd className="tabular-nums text-[15px] font-semibold" style={{ color: 'var(--err)' }}>{perteMaxTexte}</dd>
          </div>
        </dl>
        <p className="mt-2 text-[11px] leading-relaxed text-text-muted">
          <strong className="text-text">{L.pari} :</strong> {phrasePari()}
        </p>
      </div>
    </div>
  );
}
