import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { mulberry32, newSeed } from '../../engine/rng';
import type { Rng } from '../../engine/rng';
import {
  ecartTypeEchantillon,
  moyenneArithmetique,
  normaleCdf,
} from '../../content/modules/02-methodes-quantitatives/calculs';
import { Button } from '../ui/Button';

/* ── TCL & Monte-Carlo ──────────────────────────────────────────────────
   Deux modes : (1) théorème central limite — histogramme de 1 000
   moyennes d'échantillon confronté à la normale théorique N(μ, σ/√n) ;
   (2) Monte-Carlo — trajectoires de prix lognormales, distribution des
   prix finaux et convergence de P(S₁ > seuil) vers la valeur exacte
   donnée par normaleCdf (calculs.ts du module 2).
   Tout le hasard sort de mulberry32(seed) : même seed ⇒ mêmes chiffres,
   mêmes graphiques (déterminisme testable). Rendu SVG assumé : les
   simulations sont AGRÉGÉES (histogrammes, courbe de convergence) et
   seules ~40 trajectoires sont tracées, donc le nombre de nœuds SVG
   reste borné quel que soit N — le canvas serait superflu.            */

const GRAINE_INITIALE = 20260611;

/* Mode TCL */
const N_MOYENNES = 1000;
const N_ECH_MIN = 1;
const N_ECH_MAX = 50;
const NB_BACS_TCL = 36;

/* Mode Monte-Carlo : dynamique lognormale simple, paramètres figés. */
const PRIX_INITIAL = 100;
const MU_AN = 0.05; // dérive : 5 % par an
const SIGMA_AN = 0.2; // volatilité : 20 % par an
const HORIZON = 1; // 1 an
const N_PAS_TRAJ = 52; // pas hebdomadaire
const SEUIL = 110;
const SIM_MIN = 100;
const SIM_MAX = 5000;
const SIM_PAS = 100;
const N_TRAJ_AFFICHEES = 40;
const NB_BACS_FINAUX = 40;

/* P(S₁ > seuil) exacte : ln(S₁/S₀) ~ N((μ−σ²/2)T, σ√T). */
const Z_SEUIL =
  (Math.log(SEUIL / PRIX_INITIAL) - (MU_AN - (SIGMA_AN * SIGMA_AN) / 2) * HORIZON) /
  (SIGMA_AN * Math.sqrt(HORIZON));
const P_EXACTE = 1 - normaleCdf(Z_SEUIL);

/** Tirage N(0, 1) par Box-Muller : deux uniformes → une normale centrée réduite. */
function tireeNormale(rng: Rng): number {
  const u1 = 1 - rng(); // dans (0, 1] : exclut 0, donc ln(u1) est défini
  const u2 = rng();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

/* ── Populations du mode TCL ── */
type ClePopulation = 'uniforme' | 'de' | 'asymetrique';

interface Population {
  label: string;
  description: string;
  mu: number;
  sigma: number;
  min: number;
  max: number;
  ticks: number[];
  tirer: (rng: Rng) => number;
}

const POPULATIONS: Record<ClePopulation, Population> = {
  uniforme: {
    label: 'Uniforme 0–10',
    description: 'Chaque valeur entre 0 et 10 est équiprobable : une distribution plate, sans aucune cloche',
    mu: 5,
    sigma: 10 / Math.sqrt(12),
    min: 0,
    max: 10,
    ticks: [0, 2, 4, 6, 8, 10],
    tirer: rng => rng() * 10,
  },
  de: {
    label: 'Dé à 6 faces',
    description: 'Les valeurs 1 à 6, équiprobables : une distribution discrète en six bâtons',
    mu: 3.5,
    sigma: Math.sqrt(35 / 12),
    min: 0.5,
    max: 6.5,
    ticks: [1, 2, 3, 4, 5, 6],
    tirer: rng => Math.floor(rng() * 6) + 1,
  },
  asymetrique: {
    label: 'Très asymétrique',
    description: '90 % de chances de tirer 0, 10 % de tirer 10 : deux pics extrêmes, rien entre les deux',
    mu: 1,
    sigma: 3,
    min: 0,
    max: 10,
    ticks: [0, 2, 4, 6, 8, 10],
    tirer: rng => (rng() < 0.9 ? 0 : 10),
  },
};

const CLES_POPULATIONS: ClePopulation[] = ['uniforme', 'de', 'asymetrique'];

/* ── Formats français : virgule décimale, espaces pour les milliers. ── */
function fmtNombre(v: number, dec: number): string {
  const [ent, fra] = Math.abs(v).toFixed(dec).split('.');
  const groupe = ent.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return (v < 0 ? '−' : '') + groupe + (fra ? ',' + fra : '');
}

/** 5 → « 5 », 3,50 → « 3,5 » (zéros traînants retirés). */
function fmtCourt(v: number): string {
  return v.toFixed(2).replace(/\.?0+$/, '').replace('.', ',').replace('-', '−');
}

function fmtPct(v: number, dec = 1): string {
  return fmtNombre(v * 100, dec) + ' %';
}

function fmtEcartPts(v: number): string {
  return (v >= 0 ? '+' : '−') + fmtNombre(Math.abs(v) * 100, 2) + ' pt';
}

/** Pas « rond » (1/2/5 × 10^k) pour les graduations. */
function pasGrille(brut: number): number {
  const mag = 10 ** Math.floor(Math.log10(brut));
  const r = brut / mag;
  if (r <= 1) return mag;
  if (r <= 2) return 2 * mag;
  if (r <= 5) return 5 * mag;
  return 10 * mag;
}

/** Comptage par bac sur [min, max] (valeurs hors bornes rabattues aux bacs extrêmes). */
function histogramme(valeurs: number[], min: number, max: number, nBacs: number): number[] {
  const bacs = new Array<number>(nBacs).fill(0);
  const largeur = (max - min) / nBacs;
  for (const v of valeurs) {
    let i = Math.floor((v - min) / largeur);
    if (i < 0) i = 0;
    if (i >= nBacs) i = nBacs - 1;
    bacs[i]++;
  }
  return bacs;
}

/* ── Curseur : input range natif étiqueté, accessible au clavier. ── */
interface CurseurProps {
  label: string;
  affichage: string;
  min: number;
  max: number;
  pas: number;
  valeur: number;
  onChange: (v: number) => void;
}

function Curseur({ label, affichage, min, max, pas, valeur, onChange }: CurseurProps) {
  return (
    <label className="flex flex-col gap-0.5">
      <span className="flex items-baseline justify-between gap-2 text-xs text-text-muted">
        <span>{label}</span>
        <strong className="tabular-nums text-[13px] font-semibold text-text">{affichage}</strong>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={pas}
        value={valeur}
        onChange={e => onChange(Number(e.target.value))}
        className="h-5 w-full cursor-pointer"
        style={{ accentColor: 'var(--accent)' }}
      />
    </label>
  );
}

/* ── Bouton segment (choix de mode / de population) ── */
interface SegmentProps {
  actif: boolean;
  onClick: () => void;
  children: ReactNode;
}

function Segment({ actif, onClick, children }: SegmentProps) {
  return (
    <button
      type="button"
      aria-pressed={actif}
      onClick={onClick}
      className={`rounded-md border px-3 py-1.5 text-[12px] font-medium transition-colors duration-150 ${
        actif
          ? 'border-accent/60 bg-accent/12 text-accent'
          : 'border-border bg-surface-2 text-text-muted hover:border-text-muted/40 hover:text-text'
      }`}
    >
      {children}
    </button>
  );
}

/* ── Graphique 1 : histogramme des moyennes + normale théorique ── */
interface PropsHistoTcl {
  moyennes: number[];
  pop: Population;
  n: number;
}

function HistogrammeTcl({ moyennes, pop, n }: PropsHistoTcl) {
  const VB_L = 400;
  const VB_H = 200;
  const MG = 10;
  const MD = 10;
  const MH = 14;
  const MB = 26;
  const L = VB_L - MG - MD;
  const H = VB_H - MH - MB;
  const Y_BAS = MH + H;

  const bacs = histogramme(moyennes, pop.min, pop.max, NB_BACS_TCL);
  const largeurBac = (pop.max - pop.min) / NB_BACS_TCL;
  const se = pop.sigma / Math.sqrt(n);

  /* Densité normale théorique, mise à l'échelle des effectifs attendus par bac. */
  const courbe: Array<{ x: number; y: number }> = [];
  for (let i = 0; i <= 120; i++) {
    const x = pop.min + (i * (pop.max - pop.min)) / 120;
    const dens = Math.exp(-0.5 * ((x - pop.mu) / se) ** 2) / (se * Math.sqrt(2 * Math.PI));
    courbe.push({ x, y: moyennes.length * largeurBac * dens });
  }

  let yMax = 0;
  for (const b of bacs) if (b > yMax) yMax = b;
  for (const c of courbe) if (c.y > yMax) yMax = c.y;
  yMax *= 1.08;

  const xSvg = (x: number) => MG + ((x - pop.min) / (pop.max - pop.min)) * L;
  const ySvg = (y: number) => MH + (1 - y / yMax) * H;
  const largeurSvg = L / NB_BACS_TCL;

  const cheminCourbe = courbe
    .map((c, i) => `${i === 0 ? 'M' : 'L'} ${xSvg(c.x).toFixed(1)} ${ySvg(c.y).toFixed(1)}`)
    .join(' ');

  return (
    <svg
      viewBox={`0 0 ${VB_L} ${VB_H}`}
      className="mx-auto block w-full max-w-[560px]"
      role="img"
      aria-label={`Histogramme de 1 000 moyennes d'échantillons de taille ${n} et densité normale théorique superposée`}
    >
      {bacs.map((b, i) =>
        b === 0 ? null : (
          <rect
            key={i}
            x={(MG + i * largeurSvg + 0.4).toFixed(1)}
            y={ySvg(b).toFixed(1)}
            width={Math.max(largeurSvg - 0.8, 0.6).toFixed(1)}
            height={(Y_BAS - ySvg(b)).toFixed(1)}
            fill="var(--accent)"
            fillOpacity={0.55}
          />
        )
      )}
      <path d={cheminCourbe} fill="none" stroke="var(--warn)" strokeWidth={2} strokeLinecap="round" />
      <line x1={MG} x2={MG + L} y1={Y_BAS} y2={Y_BAS} stroke="var(--border)" strokeWidth={1.2} />
      {pop.ticks.map(t => (
        <g key={t}>
          <line x1={xSvg(t)} x2={xSvg(t)} y1={Y_BAS} y2={Y_BAS + 3} stroke="var(--border)" strokeWidth={1} />
          <text x={xSvg(t)} y={Y_BAS + 14} textAnchor="middle" fontSize={10} fill="var(--text-muted)">
            {fmtCourt(t)}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ── Graphique 2 : trajectoires de prix lognormales ── */
function GraphTrajectoires({ trajectoires }: { trajectoires: number[][] }) {
  const VB_L = 400;
  const VB_H = 190;
  const MG = 36;
  const MD = 40;
  const MH = 10;
  const MB = 22;
  const L = VB_L - MG - MD;
  const H = VB_H - MH - MB;
  const Y_BAS = MH + H;

  let pMin = Math.min(SEUIL, PRIX_INITIAL);
  let pMax = Math.max(SEUIL, PRIX_INITIAL);
  for (const traj of trajectoires) {
    for (const p of traj) {
      if (p < pMin) pMin = p;
      if (p > pMax) pMax = p;
    }
  }
  const marge = (pMax - pMin) * 0.05;
  pMin -= marge;
  pMax += marge;

  const xSvg = (k: number) => MG + (k / N_PAS_TRAJ) * L;
  const ySvg = (p: number) => MH + (1 - (p - pMin) / (pMax - pMin)) * H;

  const pas = pasGrille((pMax - pMin) / 4);
  const ticks: number[] = [];
  for (let t = Math.ceil(pMin / pas) * pas; t <= pMax; t += pas) ticks.push(t);

  return (
    <svg
      viewBox={`0 0 ${VB_L} ${VB_H}`}
      className="mx-auto block w-full max-w-[560px]"
      role="img"
      aria-label={`${trajectoires.length} trajectoires de prix simulées sur un an, avec le seuil de ${SEUIL} euros`}
    >
      {ticks.map(t => (
        <g key={t}>
          <line
            x1={MG}
            x2={MG + L}
            y1={ySvg(t)}
            y2={ySvg(t)}
            stroke="var(--border)"
            strokeWidth={0.6}
            strokeDasharray="3 4"
          />
          <text x={MG - 5} y={ySvg(t) + 3.5} textAnchor="end" fontSize={9.5} fill="var(--text-muted)">
            {fmtNombre(t, 0)}
          </text>
        </g>
      ))}
      {trajectoires.map((traj, i) => (
        <polyline
          key={i}
          points={traj.map((p, k) => `${xSvg(k).toFixed(1)},${ySvg(p).toFixed(1)}`).join(' ')}
          fill="none"
          stroke="var(--accent)"
          strokeOpacity={0.3}
          strokeWidth={1}
        />
      ))}
      <line
        x1={MG}
        x2={MG + L}
        y1={ySvg(SEUIL)}
        y2={ySvg(SEUIL)}
        stroke="var(--warn)"
        strokeWidth={1.4}
        strokeDasharray="5 4"
      />
      <text x={MG + L + 4} y={ySvg(SEUIL) + 3.5} fontSize={9.5} fill="var(--warn)">
        {SEUIL} €
      </text>
      <line x1={MG} x2={MG + L} y1={Y_BAS} y2={Y_BAS} stroke="var(--border)" strokeWidth={1.2} />
      <text x={MG} y={Y_BAS + 13} textAnchor="middle" fontSize={9.5} fill="var(--text-muted)">
        0
      </text>
      <text x={MG + L / 2} y={Y_BAS + 13} textAnchor="middle" fontSize={9.5} fill="var(--text-muted)">
        6 mois
      </text>
      <text x={MG + L} y={Y_BAS + 13} textAnchor="middle" fontSize={9.5} fill="var(--text-muted)">
        1 an
      </text>
    </svg>
  );
}

/* ── Graphique 3 : distribution des prix finaux ── */
function HistogrammeFinaux({ finaux }: { finaux: number[] }) {
  const VB_L = 400;
  const VB_H = 170;
  const MG = 10;
  const MD = 10;
  const MH = 16;
  const MB = 26;
  const L = VB_L - MG - MD;
  const H = VB_H - MH - MB;
  const Y_BAS = MH + H;

  let vMin = Infinity;
  let vMax = -Infinity;
  for (const v of finaux) {
    if (v < vMin) vMin = v;
    if (v > vMax) vMax = v;
  }
  vMin = Math.min(vMin, SEUIL - 5);
  vMax = Math.max(vMax, SEUIL + 5);

  const bacs = histogramme(finaux, vMin, vMax, NB_BACS_FINAUX);
  let bMax = 0;
  for (const b of bacs) if (b > bMax) bMax = b;

  const xSvg = (v: number) => MG + ((v - vMin) / (vMax - vMin)) * L;
  const ySvg = (c: number) => MH + (1 - c / (bMax * 1.08)) * H;
  const largeurSvg = L / NB_BACS_FINAUX;
  const largeurBac = (vMax - vMin) / NB_BACS_FINAUX;

  const pasT = pasGrille((vMax - vMin) / 5);
  const ticks: number[] = [];
  for (let t = Math.ceil(vMin / pasT) * pasT; t <= vMax; t += pasT) ticks.push(t);

  return (
    <svg
      viewBox={`0 0 ${VB_L} ${VB_H}`}
      className="mx-auto block w-full"
      role="img"
      aria-label={`Histogramme des prix finaux simulés ; les barres au-delà de ${SEUIL} euros sont mises en évidence`}
    >
      {bacs.map((b, i) => {
        if (b === 0) return null;
        const centre = vMin + (i + 0.5) * largeurBac;
        return (
          <rect
            key={i}
            x={(MG + i * largeurSvg + 0.4).toFixed(1)}
            y={ySvg(b).toFixed(1)}
            width={Math.max(largeurSvg - 0.8, 0.6).toFixed(1)}
            height={(Y_BAS - ySvg(b)).toFixed(1)}
            fill={centre > SEUIL ? 'var(--accent)' : 'var(--text-muted)'}
            fillOpacity={centre > SEUIL ? 0.75 : 0.3}
          />
        );
      })}
      <line
        x1={xSvg(SEUIL)}
        x2={xSvg(SEUIL)}
        y1={MH - 4}
        y2={Y_BAS}
        stroke="var(--warn)"
        strokeWidth={1.4}
        strokeDasharray="5 4"
      />
      <text x={xSvg(SEUIL)} y={MH - 6} textAnchor="middle" fontSize={9.5} fill="var(--warn)">
        {SEUIL} €
      </text>
      <line x1={MG} x2={MG + L} y1={Y_BAS} y2={Y_BAS} stroke="var(--border)" strokeWidth={1.2} />
      {ticks.map(t => (
        <text key={t} x={xSvg(t)} y={Y_BAS + 14} textAnchor="middle" fontSize={9.5} fill="var(--text-muted)">
          {fmtNombre(t, 0)}
        </text>
      ))}
    </svg>
  );
}

/* ── Graphique 4 : convergence de l'estimation vers la valeur exacte ── */
interface PropsConvergence {
  points: Array<{ n: number; p: number }>;
  nSim: number;
}

function GraphConvergence({ points, nSim }: PropsConvergence) {
  const VB_L = 400;
  const VB_H = 170;
  const MG = 44;
  const MD = 10;
  const MH = 12;
  const MB = 30;
  const L = VB_L - MG - MD;
  const H = VB_H - MH - MB;
  const Y_BAS = MH + H;

  let pMin = P_EXACTE;
  let pMax = P_EXACTE;
  for (const pt of points) {
    if (pt.p < pMin) pMin = pt.p;
    if (pt.p > pMax) pMax = pt.p;
  }
  const marge = Math.max(0.02, (pMax - pMin) * 0.15);
  pMin = Math.max(0, pMin - marge);
  pMax = Math.min(1, pMax + marge);

  const xSvg = (k: number) => MG + (k / nSim) * L;
  const ySvg = (p: number) => MH + (1 - (p - pMin) / (pMax - pMin)) * H;

  const chemin = points
    .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${xSvg(pt.n).toFixed(1)} ${ySvg(pt.p).toFixed(1)}`)
    .join(' ');

  const ticksY = [pMin, (pMin + pMax) / 2, pMax];

  return (
    <svg
      viewBox={`0 0 ${VB_L} ${VB_H}`}
      className="mx-auto block w-full"
      role="img"
      aria-label="Estimation de la probabilité en fonction du nombre de simulations, avec la valeur exacte en pointillé"
    >
      {ticksY.map((t, i) => (
        <g key={i}>
          <line
            x1={MG}
            x2={MG + L}
            y1={ySvg(t)}
            y2={ySvg(t)}
            stroke="var(--border)"
            strokeWidth={0.6}
            strokeDasharray="3 4"
          />
          <text x={MG - 5} y={ySvg(t) + 3.5} textAnchor="end" fontSize={9.5} fill="var(--text-muted)">
            {fmtPct(t)}
          </text>
        </g>
      ))}
      <line
        x1={MG}
        x2={MG + L}
        y1={ySvg(P_EXACTE)}
        y2={ySvg(P_EXACTE)}
        stroke="var(--warn)"
        strokeWidth={1.4}
        strokeDasharray="5 4"
      />
      <text x={MG + L - 2} y={ySvg(P_EXACTE) - 4} textAnchor="end" fontSize={9.5} fill="var(--warn)">
        valeur exacte
      </text>
      <path d={chemin} fill="none" stroke="var(--accent)" strokeWidth={1.8} strokeLinecap="round" />
      <line x1={MG} x2={MG + L} y1={Y_BAS} y2={Y_BAS} stroke="var(--border)" strokeWidth={1.2} />
      {[0, nSim / 2, nSim].map(t => (
        <text key={t} x={xSvg(t)} y={Y_BAS + 13} textAnchor="middle" fontSize={9.5} fill="var(--text-muted)">
          {fmtNombre(t, 0)}
        </text>
      ))}
      <text x={MG + L / 2} y={VB_H - 4} textAnchor="middle" fontSize={9.5} fill="var(--text-muted)">
        Nombre de simulations N
      </text>
    </svg>
  );
}

/* ── Composant principal ── */
type Mode = 'tcl' | 'mc';

export function MonteCarloViz() {
  const [mode, setMode] = useState<Mode>('tcl');
  const [seed, setSeed] = useState(GRAINE_INITIALE);
  const [clePop, setClePop] = useState<ClePopulation>('uniforme');
  const [n, setN] = useState(5);
  const [nSim, setNSim] = useState(1000);

  const pop = POPULATIONS[clePop];

  /* Mode TCL : 1 000 moyennes d'échantillons de taille n. */
  const tcl = useMemo(() => {
    const rng = mulberry32(seed);
    const tirer = POPULATIONS[clePop].tirer;
    const moyennes = new Array<number>(N_MOYENNES);
    for (let i = 0; i < N_MOYENNES; i++) {
      let s = 0;
      for (let j = 0; j < n; j++) s += tirer(rng);
      moyennes[i] = s / n;
    }
    return {
      moyennes,
      moyObs: moyenneArithmetique(moyennes),
      etObs: ecartTypeEchantillon(moyennes),
    };
  }, [seed, clePop, n]);

  /* Mode Monte-Carlo : N prix finaux lognormaux (flux rng distinct du TCL).
     Les ~40 premières simulations sont déroulées pas à pas pour l'affichage
     des trajectoires (le produit des pas hebdomadaires reste exactement
     lognormal à l'horizon) ; les suivantes sautent directement à T = 1 an. */
  const mc = useMemo(() => {
    const rng = mulberry32((seed ^ 0x9e3779b9) >>> 0);
    const dt = HORIZON / N_PAS_TRAJ;
    const derivePas = (MU_AN - (SIGMA_AN * SIGMA_AN) / 2) * dt;
    const chocPas = SIGMA_AN * Math.sqrt(dt);
    const nAffichees = Math.min(N_TRAJ_AFFICHEES, nSim);
    const trajectoires: number[][] = [];
    const finaux = new Array<number>(nSim);
    for (let i = 0; i < nAffichees; i++) {
      const points = new Array<number>(N_PAS_TRAJ + 1);
      points[0] = PRIX_INITIAL;
      let s = PRIX_INITIAL;
      for (let k = 1; k <= N_PAS_TRAJ; k++) {
        s *= Math.exp(derivePas + chocPas * tireeNormale(rng));
        points[k] = s;
      }
      trajectoires.push(points);
      finaux[i] = s;
    }
    const deriveTotale = (MU_AN - (SIGMA_AN * SIGMA_AN) / 2) * HORIZON;
    const chocTotal = SIGMA_AN * Math.sqrt(HORIZON);
    for (let i = nAffichees; i < nSim; i++) {
      finaux[i] = PRIX_INITIAL * Math.exp(deriveTotale + chocTotal * tireeNormale(rng));
    }
    /* Convergence : proportion cumulée au-delà du seuil, ~100 points relevés. */
    const pasConv = Math.max(1, Math.floor(nSim / 100));
    const convergence: Array<{ n: number; p: number }> = [];
    let nbAuDessus = 0;
    for (let i = 0; i < nSim; i++) {
      if (finaux[i] > SEUIL) nbAuDessus++;
      const k = i + 1;
      if ((k >= 20 && k % pasConv === 0) || k === nSim) convergence.push({ n: k, p: nbAuDessus / k });
    }
    return { trajectoires, finaux, convergence, pEstimee: nbAuDessus / nSim };
  }, [seed, nSim]);

  function relancer() {
    setSeed(newSeed());
  }

  const seTheorique = pop.sigma / Math.sqrt(n);
  const erreurType = Math.sqrt((mc.pEstimee * (1 - mc.pEstimee)) / nSim);

  const statsTcl: ReadonlyArray<readonly [string, string]> = [
    ['Moyenne des moyennes', fmtNombre(tcl.moyObs, 3)],
    ['μ (population)', fmtCourt(pop.mu)],
    ['É.-t. des moyennes', fmtNombre(tcl.etObs, 3)],
    ['σ/√n (théorie)', fmtNombre(seTheorique, 3)],
  ];

  const statsMc: ReadonlyArray<readonly [string, string]> = [
    [`P(S₁ > ${SEUIL} €) estimée`, fmtPct(mc.pEstimee)],
    ['P exacte (loi normale)', fmtPct(P_EXACTE)],
    ['Écart', fmtEcartPts(mc.pEstimee - P_EXACTE)],
    ['Erreur type ≈', fmtNombre(erreurType * 100, 2) + ' pt'],
  ];

  return (
    <div className="my-6 rounded-lg border border-border bg-surface">
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2.5">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
          TCL &amp; Monte-Carlo
        </p>
        <Button variante="secondaire" taille="sm" onClick={relancer}>
          Relancer
        </Button>
      </div>

      {/* Choix du mode */}
      <div className="flex flex-wrap gap-2 px-4 pt-3" role="group" aria-label="Choix du mode">
        <Segment actif={mode === 'tcl'} onClick={() => setMode('tcl')}>
          1 — Théorème central limite
        </Segment>
        <Segment actif={mode === 'mc'} onClick={() => setMode('mc')}>
          2 — Monte-Carlo
        </Segment>
      </div>

      {mode === 'tcl' ? (
        <>
          {/* Population de départ */}
          <div className="px-4 pt-3">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Population de départ">
              {CLES_POPULATIONS.map(cle => (
                <Segment key={cle} actif={clePop === cle} onClick={() => setClePop(cle)}>
                  {POPULATIONS[cle].label}
                </Segment>
              ))}
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-text-muted">
              {pop.description} — μ = {fmtCourt(pop.mu)}, σ ≈ {fmtCourt(Math.round(pop.sigma * 100) / 100)}.
            </p>
          </div>

          {/* Curseur n + tirage */}
          <div className="grid grid-cols-1 items-end gap-x-6 gap-y-2 px-4 pt-2 sm:grid-cols-2">
            <Curseur
              label="Taille d'échantillon n"
              affichage={String(n)}
              min={N_ECH_MIN}
              max={N_ECH_MAX}
              pas={1}
              valeur={n}
              onChange={setN}
            />
            <div className="flex sm:justify-end">
              <Button variante="secondaire" taille="sm" onClick={relancer}>
                Tirer 1 000 moyennes
              </Button>
            </div>
          </div>

          {/* Légende */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 px-4 pt-2 text-[11px] text-text-muted">
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-[2px]" style={{ background: 'var(--accent)', opacity: 0.55 }} />
              1 000 moyennes simulées
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-[3px] w-4 rounded-full" style={{ background: 'var(--warn)' }} />
              Normale théorique N(μ, σ/√n)
            </span>
          </div>

          <div className="px-2 pt-1">
            <HistogrammeTcl moyennes={tcl.moyennes} pop={pop} n={n} />
          </div>

          {/* Mesures */}
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-border px-4 py-3 sm:grid-cols-4">
            {statsTcl.map(([cle, valeur]) => (
              <div key={cle}>
                <dt className="text-[10px] uppercase tracking-wider text-text-muted">{cle}</dt>
                <dd className="tabular-nums text-[13px] font-semibold text-text">{valeur}</dd>
              </div>
            ))}
          </dl>

          <p className="border-t border-border px-4 py-3 text-[11px] leading-relaxed text-text-muted">
            Quelle que soit la forme de la population — même les deux pics extrêmes du 90/10 —,
            l'histogramme des moyennes se resserre en cloche autour de μ quand n grandit, à la
            vitesse σ/√n : c'est le théorème central limite à l'œuvre.
          </p>
        </>
      ) : (
        <>
          {/* Paramètres du modèle */}
          <p className="px-4 pt-3 text-[11px] leading-relaxed text-text-muted">
            Prix initial 100 €, dérive μ = 5 % par an, volatilité σ = 20 % par an, horizon 1 an,
            pas hebdomadaire. Cible : P(S₁ &gt; {SEUIL} €), estimée par simulation puis comparée à
            la valeur exacte du modèle lognormal.
          </p>

          <div className="px-4 pt-2">
            <Curseur
              label="Nombre de simulations N"
              affichage={fmtNombre(nSim, 0)}
              min={SIM_MIN}
              max={SIM_MAX}
              pas={SIM_PAS}
              valeur={nSim}
              onChange={setNSim}
            />
          </div>

          <div className="px-2 pt-1">
            <p className="px-2 pb-0.5 text-[11px] text-text-muted">
              Trajectoires simulées ({mc.trajectoires.length} affichées sur {fmtNombre(nSim, 0)})
            </p>
            <GraphTrajectoires trajectoires={mc.trajectoires} />
          </div>

          <div className="grid grid-cols-1 gap-2 px-2 pt-2 sm:grid-cols-2">
            <div>
              <p className="px-2 pb-0.5 text-[11px] text-text-muted">Distribution des prix finaux</p>
              <HistogrammeFinaux finaux={mc.finaux} />
            </div>
            <div>
              <p className="px-2 pb-0.5 text-[11px] text-text-muted">Convergence de l'estimation</p>
              <GraphConvergence points={mc.convergence} nSim={nSim} />
            </div>
          </div>

          {/* Mesures */}
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-border px-4 py-3 sm:grid-cols-4">
            {statsMc.map(([cle, valeur]) => (
              <div key={cle}>
                <dt className="text-[10px] uppercase tracking-wider text-text-muted">{cle}</dt>
                <dd className="tabular-nums text-[13px] font-semibold text-text">{valeur}</dd>
              </div>
            ))}
          </dl>

          <p className="border-t border-border px-4 py-3 text-[11px] leading-relaxed text-text-muted">
            L'estimation Monte-Carlo est une moyenne de tirages 0/1 : son erreur type vaut
            √(p(1−p)/N) et décroît en 1/√N — pour gagner une décimale de précision, il faut
            environ cent fois plus de simulations.
          </p>
        </>
      )}
    </div>
  );
}
