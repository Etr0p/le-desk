import { useId, useState } from 'react';
import {
  convexite,
  durationMacaulay,
  durationModifiee,
  prixObligation,
} from '../../content/modules/04-taux-obligations/calculs';

/* ── Visualiseur duration / convexité ───────────────────────────────────
   Courbe prix-taux exacte, tangente au taux courant (duration seule) et
   parabole d'ordre 2 (duration + convexité), avec table de lecture des
   trois estimations après choc. Tous les chiffres sortent de calculs.ts
   — aucune formule de pricing recopiée ici.                            */

const NOMINAL = 1000;

const COUPON_MIN = 0;
const COUPON_MAX = 8;
const COUPON_PAS = 0.5;
const MAT_MIN = 2;
const MAT_MAX = 30;
const Y0_MIN = 1;
const Y0_MAX = 11;
const Y0_PAS = 0.25;
const CHOC_MIN = -300;
const CHOC_MAX = 300;
const CHOC_PAS = 25;

/* Domaine du graphe : taux de 0,5 % à 12 %, ~60 échantillons exacts. */
const AXE_MIN = 0.5;
const AXE_MAX = 12;
const N_ECH = 60;

/* Géométrie du viewBox (unités SVG). */
const VB_L = 400;
const VB_H = 270;
const M_GAUCHE = 46;
const M_DROITE = 12;
const M_HAUT = 14;
const M_BAS = 34;
const TRACE_L = VB_L - M_GAUCHE - M_DROITE;
const TRACE_H = VB_H - M_HAUT - M_BAS;
const Y_BAS = M_HAUT + TRACE_H;

function xDuTaux(tauxPct: number): number {
  return M_GAUCHE + ((tauxPct - AXE_MIN) / (AXE_MAX - AXE_MIN)) * TRACE_L;
}

/* ── Formats français : virgule décimale, espaces fines pour les milliers. ── */
function fmtNombre(v: number, dec: number): string {
  const [ent, fra] = Math.abs(v).toFixed(dec).split('.');
  const groupe = ent.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return (v < 0 ? '−' : '') + groupe + (fra ? ',' + fra : '');
}

function fmtEuro(v: number, dec = 2): string {
  return fmtNombre(v, dec) + ' €';
}

function fmtEcartEuro(v: number): string {
  return (v >= 0 ? '+' : '−') + fmtNombre(Math.abs(v), 2) + ' €';
}

/** 5 → « 5 », 5,25 → « 5,25 » (zéros traînants retirés). */
function fmtTaux(v: number): string {
  return v.toFixed(2).replace(/\.?0+$/, '').replace('.', ',').replace('-', '−');
}

function fmtChoc(pb: number): string {
  if (pb === 0) return '0 pb';
  return (pb > 0 ? '+' : '−') + Math.abs(pb) + ' pb';
}

/** Pas « rond » (1/2/5 × 10^k) pour la grille des prix. */
function pasGrille(brut: number): number {
  const mag = 10 ** Math.floor(Math.log10(brut));
  const r = brut / mag;
  if (r <= 1) return mag;
  if (r <= 2) return 2 * mag;
  if (r <= 5) return 5 * mag;
  return 10 * mag;
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

/* ── Composant ── */
export function DurationConvexityViz() {
  const [couponPct, setCouponPct] = useState(5);
  const [maturite, setMaturite] = useState(10);
  const [tauxActuel, setTauxActuel] = useState(5);
  const [chocPb, setChocPb] = useState(100);
  const idClip = 'dcv-' + useId().replace(/[^a-zA-Z0-9_-]/g, '');

  /* Grandeurs au point courant — exclusivement via calculs.ts. */
  const p0 = prixObligation(NOMINAL, couponPct, maturite, tauxActuel);
  const dMac = durationMacaulay(NOMINAL, couponPct, maturite, tauxActuel);
  const dMod = durationModifiee(dMac, tauxActuel);
  const conv = convexite(NOMINAL, couponPct, maturite, tauxActuel);
  const dv01 = dMod * p0 * 0.0001;

  /* Trois estimations du prix après choc. */
  const dy = chocPb / 10_000; // Δy en décimal
  const tauxChoque = tauxActuel + chocPb / 100;
  const prixExact = prixObligation(NOMINAL, couponPct, maturite, tauxChoque);
  const prixDuration = p0 * (1 - dMod * dy);
  const prixDurConv = p0 * (1 - dMod * dy + 0.5 * conv * dy * dy);

  function prixTangente(tauxPct: number): number {
    return p0 * (1 - (dMod * (tauxPct - tauxActuel)) / 100);
  }

  function prixParabole(tauxPct: number): number {
    const h = (tauxPct - tauxActuel) / 100;
    return p0 * (1 - dMod * h + 0.5 * conv * h * h);
  }

  /* Courbe exacte échantillonnée sur tout le domaine. */
  const echantillons: Array<{ taux: number; prix: number }> = [];
  for (let i = 0; i <= N_ECH; i++) {
    const taux = AXE_MIN + (i * (AXE_MAX - AXE_MIN)) / N_ECH;
    echantillons.push({ taux, prix: prixObligation(NOMINAL, couponPct, maturite, taux) });
  }

  /* Échelle des prix : la courbe exacte + les points de choc visibles. */
  const chocVisible = tauxChoque >= AXE_MIN && tauxChoque <= AXE_MAX;
  let pMin = Infinity;
  let pMax = -Infinity;
  for (const e of echantillons) {
    if (e.prix < pMin) pMin = e.prix;
    if (e.prix > pMax) pMax = e.prix;
  }
  if (chocVisible) {
    pMin = Math.min(pMin, prixDuration, prixDurConv);
    pMax = Math.max(pMax, prixDurConv);
  }
  const marge = (pMax - pMin) * 0.07;
  pMin -= marge;
  pMax += marge;

  function yDuPrix(prix: number): number {
    return M_HAUT + (1 - (prix - pMin) / (pMax - pMin)) * TRACE_H;
  }

  function pt(taux: number, prix: number): string {
    return `${xDuTaux(taux).toFixed(1)} ${yDuPrix(prix).toFixed(1)}`;
  }

  const cheminCourbe = echantillons
    .map((e, i) => `${i === 0 ? 'M' : 'L'} ${pt(e.taux, e.prix)}`)
    .join(' ');
  const cheminParabole = echantillons
    .map((e, i) => `${i === 0 ? 'M' : 'L'} ${pt(e.taux, prixParabole(e.taux))}`)
    .join(' ');
  /* Zone entre la courbe (au-dessus) et la tangente : le « cadeau » de la convexité. */
  const cheminZone =
    cheminCourbe + ` L ${pt(AXE_MAX, prixTangente(AXE_MAX))} L ${pt(AXE_MIN, prixTangente(AXE_MIN))} Z`;

  const pas = pasGrille((pMax - pMin) / 4);
  const ticksPrix: number[] = [];
  for (let t = Math.ceil(pMin / pas) * pas; t <= pMax; t += pas) ticksPrix.push(t);

  const stats: ReadonlyArray<readonly [string, string]> = [
    ['Prix P(y₀)', fmtEuro(p0)],
    ['D. Macaulay', `${fmtNombre(dMac, 2)} ans`],
    ['D. modifiée', fmtNombre(dMod, 2)],
    ['Convexité', fmtNombre(conv, 1)],
    ['DV01', `${fmtEuro(dv01)} / pb`],
  ];

  const lignesLecture = [
    { nom: 'Prix exact (courbe)', prix: prixExact, ecart: null as number | null, couleur: 'var(--accent)' },
    { nom: 'Duration seule (tangente)', prix: prixDuration, ecart: prixDuration - prixExact, couleur: 'var(--err)' },
    { nom: 'Duration + convexité (parabole)', prix: prixDurConv, ecart: prixDurConv - prixExact, couleur: 'var(--warn)' },
  ];

  return (
    <div className="my-6 rounded-lg border border-border bg-surface">
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2.5">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
          Duration &amp; convexité
        </p>
        <span className="text-[11px] text-text-muted">La tangente contre la courbe</span>
      </div>

      {/* Curseurs */}
      <div className="grid grid-cols-1 gap-x-6 gap-y-2 px-4 pt-3 sm:grid-cols-2">
        <Curseur
          label="Coupon"
          affichage={`${fmtTaux(couponPct)} %`}
          min={COUPON_MIN}
          max={COUPON_MAX}
          pas={COUPON_PAS}
          valeur={couponPct}
          onChange={setCouponPct}
        />
        <Curseur
          label="Maturité"
          affichage={`${maturite} ans`}
          min={MAT_MIN}
          max={MAT_MAX}
          pas={1}
          valeur={maturite}
          onChange={setMaturite}
        />
        <Curseur
          label="Taux actuel y₀"
          affichage={`${fmtTaux(tauxActuel)} %`}
          min={Y0_MIN}
          max={Y0_MAX}
          pas={Y0_PAS}
          valeur={tauxActuel}
          onChange={setTauxActuel}
        />
        <Curseur
          label="Choc de taux Δy"
          affichage={fmtChoc(chocPb)}
          min={CHOC_MIN}
          max={CHOC_MAX}
          pas={CHOC_PAS}
          valeur={chocPb}
          onChange={setChocPb}
        />
      </div>

      {/* Légende */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 px-4 pt-2 text-[11px] text-text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-[3px] w-4 rounded-full" style={{ background: 'var(--accent)' }} />
          Prix exact
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-[3px] w-4 rounded-full" style={{ background: 'var(--err)' }} />
          Tangente (duration seule)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block w-4 border-t-2 border-dashed" style={{ borderColor: 'var(--warn)' }} />
          Duration + convexité
        </span>
      </div>

      {/* Graphique */}
      <div className="px-2 pt-1">
        <svg
          viewBox={`0 0 ${VB_L} ${VB_H}`}
          className="mx-auto block w-full max-w-[560px]"
          role="img"
          aria-label="Courbe prix-taux exacte, tangente au taux actuel (duration seule) et parabole duration plus convexité ; points des trois estimations après le choc de taux"
        >
          <defs>
            <clipPath id={idClip}>
              <rect x={M_GAUCHE} y={M_HAUT} width={TRACE_L} height={TRACE_H} />
            </clipPath>
          </defs>

          {/* Grille des prix */}
          {ticksPrix.map(t => (
            <g key={t}>
              <line
                x1={M_GAUCHE}
                x2={M_GAUCHE + TRACE_L}
                y1={yDuPrix(t)}
                y2={yDuPrix(t)}
                stroke="var(--border)"
                strokeWidth={0.6}
                strokeDasharray="3 4"
              />
              <text
                x={M_GAUCHE - 6}
                y={yDuPrix(t) + 3.5}
                textAnchor="end"
                fontSize={10}
                fill="var(--text-muted)"
              >
                {fmtNombre(t, 0)}
              </text>
            </g>
          ))}

          {/* Axe horizontal et libellés de taux */}
          <line x1={M_GAUCHE} x2={M_GAUCHE + TRACE_L} y1={Y_BAS} y2={Y_BAS} stroke="var(--border)" strokeWidth={1.2} />
          {[2, 4, 6, 8, 10, 12].map(t => (
            <text
              key={t}
              x={xDuTaux(t)}
              y={Y_BAS + 13}
              textAnchor="middle"
              fontSize={10}
              fill="var(--text-muted)"
            >
              {t}
            </text>
          ))}
          <text
            x={M_GAUCHE + TRACE_L / 2}
            y={VB_H - 5}
            textAnchor="middle"
            fontSize={10}
            fill="var(--text-muted)"
          >
            Taux de marché (%)
          </text>

          {/* Zone ombrée : l'écart tangente → courbe, toujours favorable */}
          <path d={cheminZone} fill="var(--accent)" fillOpacity={0.09} clipPath={`url(#${idClip})`} />

          {/* Tangente (duration seule) */}
          <line
            x1={xDuTaux(AXE_MIN)}
            y1={yDuPrix(prixTangente(AXE_MIN))}
            x2={xDuTaux(AXE_MAX)}
            y2={yDuPrix(prixTangente(AXE_MAX))}
            stroke="var(--err)"
            strokeWidth={1.6}
            clipPath={`url(#${idClip})`}
          />

          {/* Parabole (duration + convexité) */}
          <path
            d={cheminParabole}
            fill="none"
            stroke="var(--warn)"
            strokeWidth={1.6}
            strokeDasharray="5 4"
            clipPath={`url(#${idClip})`}
          />

          {/* Courbe exacte */}
          <path
            d={cheminCourbe}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={2.2}
            strokeLinecap="round"
            clipPath={`url(#${idClip})`}
          />

          {/* Repère vertical du taux choqué + points des trois estimations */}
          {chocVisible && chocPb !== 0 && (
            <line
              x1={xDuTaux(tauxChoque)}
              x2={xDuTaux(tauxChoque)}
              y1={M_HAUT}
              y2={Y_BAS}
              stroke="var(--border)"
              strokeWidth={0.8}
              strokeDasharray="3 4"
            />
          )}
          {chocVisible && (
            <g clipPath={`url(#${idClip})`}>
              <circle cx={xDuTaux(tauxChoque)} cy={yDuPrix(prixDuration)} r={4} fill="var(--err)" stroke="var(--surface)" strokeWidth={1.5} />
              <circle cx={xDuTaux(tauxChoque)} cy={yDuPrix(prixDurConv)} r={4} fill="var(--warn)" stroke="var(--surface)" strokeWidth={1.5} />
              <circle cx={xDuTaux(tauxChoque)} cy={yDuPrix(prixExact)} r={4} fill="var(--accent)" stroke="var(--surface)" strokeWidth={1.5} />
            </g>
          )}

          {/* Point courant (y₀, P) sur la courbe */}
          <circle
            cx={xDuTaux(tauxActuel)}
            cy={yDuPrix(p0)}
            r={5}
            fill="var(--surface)"
            stroke="var(--accent)"
            strokeWidth={2}
          />
          <text
            x={xDuTaux(tauxActuel)}
            y={yDuPrix(p0) - 9}
            textAnchor="middle"
            fontSize={10.5}
            fontWeight={600}
            fill="var(--text)"
          >
            y₀
          </text>
        </svg>
      </div>

      {/* Mesures au point courant */}
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-border px-4 py-3 sm:grid-cols-5">
        {stats.map(([cle, valeur]) => (
          <div key={cle}>
            <dt className="text-[10px] uppercase tracking-wider text-text-muted">{cle}</dt>
            <dd className="tabular-nums text-[13px] font-semibold text-text">{valeur}</dd>
          </div>
        ))}
      </dl>

      {/* Table de lecture du choc */}
      <div className="border-t border-border px-4 py-3">
        <p className="mb-2 text-xs text-text-muted">
          Après un choc de <strong className="tabular-nums font-semibold text-text">{fmtChoc(chocPb)}</strong>{' '}
          (taux à <strong className="tabular-nums font-semibold text-text">{fmtTaux(tauxChoque)} %</strong>) :
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wider text-text-muted">
                <th className="pb-1.5 pr-3 font-semibold">Estimation</th>
                <th className="pb-1.5 pr-3 text-right font-semibold">Nouveau prix</th>
                <th className="pb-1.5 text-right font-semibold">Écart vs exact</th>
              </tr>
            </thead>
            <tbody>
              {lignesLecture.map(l => (
                <tr key={l.nom} className="border-t border-border/60">
                  <td className="py-1.5 pr-3 text-text">
                    <span className="mr-2 inline-block h-2 w-2 rounded-full align-middle" style={{ background: l.couleur }} />
                    {l.nom}
                  </td>
                  <td className="tabular-nums py-1.5 pr-3 text-right font-medium text-text">{fmtEuro(l.prix)}</td>
                  <td className="tabular-nums py-1.5 text-right text-text-muted">
                    {l.ecart === null ? '—' : fmtEcartEuro(l.ecart)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-text-muted">
          La zone ombrée entre la tangente et la courbe est l'erreur de la duration seule : la courbe
          exacte reste toujours au-dessus de sa tangente — c'est le cadeau de la convexité.
        </p>
      </div>
    </div>
  );
}
