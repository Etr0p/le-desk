import { useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { normaleCdf } from '../../content/modules/02-methodes-quantitatives/calculs';
import { Button } from '../ui/Button';

/* ── Explorateur de la loi normale (et lognormale) ──────────────────────
   Densité interactive : curseurs μ et σ, bascule normale/lognormale,
   deux bornes a et b glissables sur l'axe. L'aire P(a ≤ X ≤ b) est
   ombrée et chiffrée en continu. Toutes les probabilités passent par
   normaleCdf (calculs.ts) : aucune approximation recopiée ici.        */

type Mode = 'normale' | 'lognormale';
type Borne = 'a' | 'b';

const MU_MIN = -5;
const MU_MAX = 5;
const MU_PAS = 0.5;
const SIGMA_MIN = 0.5;
const SIGMA_MAX = 3;
const SIGMA_PAS = 0.25;

/* Borne « −∞ » pratique : Φ(−4) ≈ 0,00003, invisible à l'échelle du tracé. */
const Z_INFINI = 4;
const N_ECH = 160;

/* Géométrie du viewBox (unités SVG). Pas d'axe vertical : seule la forme
   de la densité et l'aire sous la courbe portent du sens.              */
const VB_L = 400;
const VB_H = 250;
const M_GAUCHE = 14;
const M_DROITE = 14;
const M_HAUT = 18;
const M_BAS = 36;
const TRACE_L = VB_L - M_GAUCHE - M_DROITE;
const TRACE_H = VB_H - M_HAUT - M_BAS;
const Y_BAS = M_HAUT + TRACE_H;

function borner(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

/** Pas « rond » (1/2/5 × 10^k) pour graduations et accroches de drag. */
function pasRond(brut: number): number {
  const mag = 10 ** Math.floor(Math.log10(brut));
  const r = brut / mag;
  if (r <= 1) return mag;
  if (r <= 2) return 2 * mag;
  if (r <= 5) return 5 * mag;
  return 10 * mag;
}

/* ── Formats français : virgule décimale, espaces pour les milliers. ── */
function fmtNombre(v: number, dec: number): string {
  const [ent, fra] = Math.abs(v).toFixed(dec).split('.');
  const groupe = ent.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return (v < 0 ? '−' : '') + groupe + (fra ? ',' + fra : '');
}

/** Décimales adaptées à l'ordre de grandeur (350 / 12,4 / 1,96). */
function fmtX(v: number): string {
  const abs = Math.abs(v);
  if (abs >= 1000) return fmtNombre(v, 0);
  if (abs >= 100) return fmtNombre(v, 1);
  return fmtNombre(v, 2);
}

/** Graduations : zéros traînants retirés (2 / 2,5 / 0,25). */
function fmtTick(v: number): string {
  const s = fmtX(v);
  return s.includes(',') ? s.replace(/,?0+$/, '') : s;
}

/** μ et σ des curseurs : 1 → « 1 », 0,75 → « 0,75 ». */
function fmtCurseur(v: number): string {
  return v.toFixed(2).replace(/\.?0+$/, '').replace('.', ',').replace('-', '−');
}

function fmtPct(p: number): string {
  return fmtNombre(p * 100, 1) + ' %';
}

/* ── Composant ── */
export function NormalExplorer() {
  const [mode, setMode] = useState<Mode>('normale');
  const [mu, setMu] = useState(0);
  const [sigma, setSigma] = useState(1);
  const [a, setA] = useState(-1);
  const [b, setB] = useState(1);
  const [actif, setActif] = useState<Borne | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragRef = useRef<Borne | null>(null);

  /* Domaine tracé : ±4σ autour de μ en normale ; [0 ; e^(μ+2,5σ)] en
     lognormale (le quantile ~99,4 % suffit à montrer la queue droite). */
  const xMin = mode === 'normale' ? mu - 4 * sigma : 0;
  const xMax = mode === 'normale' ? mu + 4 * sigma : Math.exp(mu + 2.5 * sigma);
  const portee = xMax - xMin;
  const accroche = pasRond(portee / 400); // pas d'arrondi du drag
  const pasClavier = pasRond(portee / 80);

  /* Bornes effectives : l'état brut survit aux changements de μ/σ,
     l'affichage et le calcul restent toujours dans le domaine.        */
  const aEff = borner(a, xMin, xMax);
  const bEff = Math.max(aEff, borner(b, xMin, xMax));

  /* z-score d'une abscisse selon le mode ; −∞ sous le support lognormal. */
  function zDe(x: number): number {
    if (mode === 'lognormale') {
      if (x <= 0) return -Infinity;
      return (Math.log(x) - mu) / sigma;
    }
    return (x - mu) / sigma;
  }

  function xDeZ(z: number, m: Mode = mode): number {
    return m === 'normale' ? mu + z * sigma : Math.exp(mu + z * sigma);
  }

  function phi(z: number): number {
    if (z === -Infinity) return 0;
    return normaleCdf(borner(z, -8, 8));
  }

  const zA = zDe(aEff);
  const zB = zDe(bEff);
  const proba = Math.max(0, phi(zB) - phi(zA));

  /* Densité du mode courant (la lognormale est nulle hors de x > 0). */
  function densite(x: number): number {
    if (mode === 'lognormale') {
      if (x <= 0) return 0;
      const u = (Math.log(x) - mu) / sigma;
      return Math.exp((-u * u) / 2) / (x * sigma * Math.sqrt(2 * Math.PI));
    }
    const u = (x - mu) / sigma;
    return Math.exp((-u * u) / 2) / (sigma * Math.sqrt(2 * Math.PI));
  }

  /* Échantillonnage de la courbe ; l'échelle verticale suit le maximum
     échantillonné, avec 8 % de marge sous le bord haut.               */
  const echantillons: Array<{ x: number; d: number }> = [];
  for (let i = 0; i <= N_ECH; i++) {
    const x = xMin + (i * portee) / N_ECH;
    echantillons.push({ x, d: densite(x) });
  }
  const dMax = Math.max(...echantillons.map(e => e.d), 1e-12);

  function xVue(x: number): number {
    return M_GAUCHE + ((x - xMin) / portee) * TRACE_L;
  }

  function yVue(d: number): number {
    return M_HAUT + (1 - (d / dMax) * 0.92) * TRACE_H;
  }

  const cheminCourbe = echantillons
    .map((e, i) => `${i === 0 ? 'M' : 'L'} ${xVue(e.x).toFixed(1)} ${yVue(e.d).toFixed(1)}`)
    .join(' ');

  /* Aire ombrée P(a ≤ X ≤ b) : bornes exactes + échantillons intérieurs. */
  const ptsAire: Array<{ x: number; d: number }> = [{ x: aEff, d: densite(aEff) }];
  for (const e of echantillons) {
    if (e.x > aEff && e.x < bEff) ptsAire.push(e);
  }
  ptsAire.push({ x: bEff, d: densite(bEff) });
  const cheminAire =
    `M ${xVue(aEff).toFixed(1)} ${Y_BAS}` +
    ptsAire.map(p => ` L ${xVue(p.x).toFixed(1)} ${yVue(p.d).toFixed(1)}`).join('') +
    ` L ${xVue(bEff).toFixed(1)} ${Y_BAS} Z`;

  /* Repère de l'espérance : μ en normale, e^(μ+σ²/2) en lognormale —
     l'écart au sommet de la cloche rend l'asymétrie visible.          */
  const xEsperance = mode === 'normale' ? mu : Math.exp(mu + (sigma * sigma) / 2);
  const esperanceVisible = xEsperance > xMin + portee * 0.01 && xEsperance < xMax - portee * 0.01;

  /* Graduations horizontales. */
  const pasTick = pasRond(portee / 5);
  const ticks: number[] = [];
  for (let t = Math.ceil(xMin / pasTick) * pasTick; t <= xMax + pasTick / 1e6; t += pasTick) {
    ticks.push(Math.abs(t) < pasTick / 1e6 ? 0 : t);
  }

  /* ── Interactions ── */
  function fixerBorne(quelle: Borne, x: number) {
    if (quelle === 'a') {
      setA(Math.min(x, bEff));
    } else {
      setB(Math.max(x, aEff));
    }
  }

  function xDepuisClientX(clientX: number): number | null {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    if (rect.width === 0) return null;
    const vx = ((clientX - rect.left) / rect.width) * VB_L;
    const brut = xMin + ((vx - M_GAUCHE) / TRACE_L) * portee;
    return borner(Math.round(brut / accroche) * accroche, xMin, xMax);
  }

  function surPointerDown(e: ReactPointerEvent<SVGRectElement>) {
    const x = xDepuisClientX(e.clientX);
    if (x === null) return;
    /* On saisit la borne la plus proche : cible tactile pleine zone,
       jamais de poignée masquée par l'autre.                          */
    const quelle: Borne = Math.abs(x - aEff) <= Math.abs(x - bEff) ? 'a' : 'b';
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Pointeur déjà disparu (tap très bref) : le drag local reste fonctionnel.
    }
    dragRef.current = quelle;
    setActif(quelle);
    fixerBorne(quelle, x);
  }

  function surPointerMove(e: ReactPointerEvent<SVGRectElement>) {
    const quelle = dragRef.current;
    if (quelle === null) return;
    const x = xDepuisClientX(e.clientX);
    if (x !== null) fixerBorne(quelle, x);
  }

  function surPointerFin(e: ReactPointerEvent<SVGRectElement>) {
    if (dragRef.current === null) return;
    dragRef.current = null;
    setActif(null);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  }

  function surClavier(quelle: Borne, e: KeyboardEvent<SVGCircleElement>) {
    let delta = 0;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') delta = pasClavier;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') delta = -pasClavier;
    else return;
    e.preventDefault();
    const courant = quelle === 'a' ? aEff : bEff;
    fixerBorne(quelle, borner(courant + delta, xMin, xMax));
  }

  /* Présets exprimés en z : identiques dans les deux modes, ce qui rend
     visible l'invariance des probabilités à travers le logarithme.    */
  function appliquerPreset(zBas: number, zHaut: number) {
    const nxMin = xMin;
    const nxMax = xMax;
    const na = borner(xDeZ(zBas), nxMin, nxMax);
    const nb = borner(xDeZ(zHaut), nxMin, nxMax);
    setA(Math.min(na, nb));
    setB(Math.max(na, nb));
  }

  /* Bascule de mode : a et b conservent leur z-score, donc leur
     probabilité — seule la géométrie change.                          */
  function changerMode(nouveau: Mode) {
    if (nouveau === mode) return;
    const zaBrut = zDe(aEff);
    const zbBrut = zDe(bEff);
    const za = borner(zaBrut === -Infinity ? -Z_INFINI : zaBrut, -Z_INFINI, Z_INFINI);
    const zb = borner(zbBrut === -Infinity ? -Z_INFINI : zbBrut, -Z_INFINI, Z_INFINI);
    setMode(nouveau);
    const na = xDeZ(za, nouveau);
    const nb = xDeZ(zb, nouveau);
    setA(Math.min(na, nb));
    setB(Math.max(na, nb));
  }

  const presets: ReadonlyArray<{ label: string; zBas: number; zHaut: number }> = [
    { label: '±1σ (68,3 %)', zBas: -1, zHaut: 1 },
    { label: '±2σ (95,4 %)', zBas: -2, zHaut: 2 },
    { label: '±1,96σ (95,0 %)', zBas: -1.96, zHaut: 1.96 },
    { label: 'Queue gauche 5 %', zBas: -Z_INFINI, zHaut: -1.645 },
  ];

  const bornes: ReadonlyArray<{ id: Borne; x: number; z: number }> = [
    { id: 'a', x: aEff, z: zA },
    { id: 'b', x: bEff, z: zB },
  ];

  const stats: ReadonlyArray<readonly [string, string]> = [
    ['μ', fmtCurseur(mu)],
    ['σ', fmtCurseur(sigma)],
    ['a', fmtX(aEff)],
    ['b', fmtX(bEff)],
    ['z(a)', zA === -Infinity ? '−∞' : fmtNombre(zA, 2)],
    ['z(b)', zB === -Infinity ? '−∞' : fmtNombre(zB, 2)],
  ];

  return (
    <div className="my-6 rounded-lg border border-border bg-surface">
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2.5">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
          Explorateur de la loi normale
        </p>
        <span className="text-[11px] text-text-muted">
          Glissez les bornes a et b (ou flèches ←→ au clavier)
        </span>
      </div>

      {/* Bascule de loi + présets */}
      <div className="flex flex-wrap items-center gap-2 px-4 pt-3">
        <div className="flex gap-1 rounded-md border border-border p-0.5" role="group" aria-label="Choix de la loi">
          <Button
            variante={mode === 'normale' ? 'primaire' : 'fantome'}
            taille="sm"
            aria-pressed={mode === 'normale'}
            onClick={() => changerMode('normale')}
          >
            Normale
          </Button>
          <Button
            variante={mode === 'lognormale' ? 'primaire' : 'fantome'}
            taille="sm"
            aria-pressed={mode === 'lognormale'}
            onClick={() => changerMode('lognormale')}
          >
            Lognormale
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {presets.map(p => (
            <Button
              key={p.label}
              variante="secondaire"
              taille="sm"
              onClick={() => appliquerPreset(p.zBas, p.zHaut)}
            >
              {p.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Curseurs μ et σ */}
      <div className="grid grid-cols-1 gap-x-6 gap-y-2 px-4 pt-3 sm:grid-cols-2">
        <label className="flex flex-col gap-0.5">
          <span className="flex items-baseline justify-between gap-2 text-xs text-text-muted">
            <span>{mode === 'lognormale' ? 'μ (sur le log)' : 'Moyenne μ'}</span>
            <strong className="tabular-nums text-[13px] font-semibold text-text">{fmtCurseur(mu)}</strong>
          </span>
          <input
            type="range"
            min={MU_MIN}
            max={MU_MAX}
            step={MU_PAS}
            value={mu}
            onChange={e => setMu(Number(e.target.value))}
            className="h-5 w-full cursor-pointer"
            style={{ accentColor: 'var(--accent)' }}
          />
        </label>
        <label className="flex flex-col gap-0.5">
          <span className="flex items-baseline justify-between gap-2 text-xs text-text-muted">
            <span>{mode === 'lognormale' ? 'σ (sur le log)' : 'Écart-type σ'}</span>
            <strong className="tabular-nums text-[13px] font-semibold text-text">{fmtCurseur(sigma)}</strong>
          </span>
          <input
            type="range"
            min={SIGMA_MIN}
            max={SIGMA_MAX}
            step={SIGMA_PAS}
            value={sigma}
            onChange={e => setSigma(Number(e.target.value))}
            className="h-5 w-full cursor-pointer"
            style={{ accentColor: 'var(--accent)' }}
          />
        </label>
      </div>

      {/* Graphique */}
      <div className="px-2 pt-1">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VB_L} ${VB_H}`}
          className="mx-auto block w-full max-w-[560px]"
          role="img"
          aria-label={`Densité de la loi ${mode} : l'aire entre les bornes a et b représente la probabilité P(a ≤ X ≤ b), actuellement ${fmtPct(proba)}`}
        >
          {/* Axe horizontal et graduations */}
          <line x1={M_GAUCHE} x2={M_GAUCHE + TRACE_L} y1={Y_BAS} y2={Y_BAS} stroke="var(--border)" strokeWidth={1.2} />
          {ticks.map(t => (
            <g key={t}>
              <line x1={xVue(t)} x2={xVue(t)} y1={Y_BAS} y2={Y_BAS + 4} stroke="var(--border)" strokeWidth={1} />
              <text
                x={xVue(t)}
                y={Y_BAS + 15}
                textAnchor="middle"
                fontSize={10}
                fill="var(--text-muted)"
              >
                {fmtTick(t)}
              </text>
            </g>
          ))}
          <text
            x={M_GAUCHE + TRACE_L / 2}
            y={VB_H - 4}
            textAnchor="middle"
            fontSize={10}
            fill="var(--text-muted)"
          >
            {mode === 'lognormale' ? 'x (support positif uniquement)' : 'x'}
          </text>

          {/* Aire ombrée P(a ≤ X ≤ b) */}
          <path d={cheminAire} fill="var(--accent)" fillOpacity={0.22} stroke="none" />

          {/* Repère de l'espérance */}
          {esperanceVisible && (
            <g>
              <line
                x1={xVue(xEsperance)}
                x2={xVue(xEsperance)}
                y1={M_HAUT + 12}
                y2={Y_BAS}
                stroke="var(--text-muted)"
                strokeWidth={0.8}
                strokeDasharray="3 4"
              />
              <text
                x={xVue(xEsperance)}
                y={M_HAUT + 8}
                textAnchor="middle"
                fontSize={9.5}
                fill="var(--text-muted)"
              >
                E[X]
              </text>
            </g>
          )}

          {/* Courbe de densité */}
          <path d={cheminCourbe} fill="none" stroke="var(--accent)" strokeWidth={2} strokeLinecap="round" />

          {/* Lignes verticales des bornes + poignées sur l'axe */}
          {bornes.map(({ id, x, z }) => {
            const estActive = actif === id;
            return (
              <g key={id}>
                <line
                  x1={xVue(x)}
                  x2={xVue(x)}
                  y1={yVue(densite(x))}
                  y2={Y_BAS}
                  stroke="var(--accent)"
                  strokeWidth={1.2}
                  strokeDasharray="2 3"
                />
                {estActive && (
                  <text
                    x={borner(xVue(x), M_GAUCHE + 22, M_GAUCHE + TRACE_L - 22)}
                    y={Y_BAS - 10}
                    textAnchor="middle"
                    fontSize={10.5}
                    fontWeight={600}
                    fill="var(--text)"
                  >
                    {id} = {fmtX(x)}
                  </text>
                )}
                <circle
                  cx={xVue(x)}
                  cy={Y_BAS}
                  r={estActive ? 8.5 : 7}
                  fill="var(--surface)"
                  stroke="var(--accent)"
                  strokeWidth={2}
                  tabIndex={0}
                  role="slider"
                  aria-orientation="horizontal"
                  aria-valuemin={xMin}
                  aria-valuemax={xMax}
                  aria-valuenow={x}
                  aria-valuetext={`${fmtX(x)} (z = ${z === -Infinity ? 'moins l’infini' : fmtNombre(z, 2)})`}
                  aria-label={`Borne ${id}`}
                  onKeyDown={e => surClavier(id, e)}
                  onFocus={() => setActif(id)}
                  onBlur={() => setActif(prev => (prev === id ? null : prev))}
                />
                <text
                  x={xVue(x)}
                  y={Y_BAS + 3.5}
                  textAnchor="middle"
                  fontSize={9.5}
                  fontWeight={700}
                  fill="var(--accent)"
                  pointerEvents="none"
                >
                  {id}
                </text>
              </g>
            );
          })}

          {/* Zone de saisie pleine largeur : on attrape la borne la plus
              proche — cible tactile généreuse, sans scroll parasite.   */}
          <rect
            x={M_GAUCHE - 8}
            y={M_HAUT}
            width={TRACE_L + 16}
            height={TRACE_H + 16}
            fill="transparent"
            style={{ cursor: 'ew-resize', touchAction: 'none' }}
            onPointerDown={surPointerDown}
            onPointerMove={surPointerMove}
            onPointerUp={surPointerFin}
            onPointerCancel={surPointerFin}
          />
        </svg>
      </div>

      {/* Lecture : probabilité en grand + mesures permanentes */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border px-4 py-3">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-muted">P(a ≤ X ≤ b)</p>
          <p className="tabular-nums text-2xl font-semibold leading-tight text-accent">{fmtPct(proba)}</p>
        </div>
        <dl className="grid flex-1 grid-cols-3 gap-x-4 gap-y-2 sm:grid-cols-6">
          {stats.map(([cle, valeur]) => (
            <div key={cle}>
              <dt className="text-[10px] uppercase tracking-wider text-text-muted">{cle}</dt>
              <dd className="tabular-nums text-[13px] font-semibold text-text">{valeur}</dd>
            </div>
          ))}
        </dl>
        <p className="w-full text-[11px] leading-relaxed text-text-muted">
          {mode === 'lognormale'
            ? 'En mode lognormale, les z-scores sont calculés sur le logarithme : z = (ln x − μ)/σ. Le support est strictement positif et l’espérance E[X] se décale à droite du sommet — l’asymétrie en image.'
            : 'z = (x − μ)/σ : la distance à la moyenne, comptée en nombre d’écarts-types. Les présets retrouvent les aires classiques 68-95-99,7.'}
        </p>
      </div>
    </div>
  );
}
