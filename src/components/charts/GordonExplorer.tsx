import { useId, useState } from 'react';
import { gordon } from '../../content/modules/03-actions-indices/calculs';
import { Button } from '../ui/Button';

/* ── Explorateur du modèle de Gordon-Shapiro ────────────────────────────
   Courbe de la valeur V₀ = D₁/(r − g) en fonction de g, pour D₁ et r
   fixés aux curseurs. Le curseur g est borné à r − 0,25 pt : gordon()
   (calculs.ts) lève une erreur si r ≤ g, la borne garantit qu'on ne
   l'atteint jamais. La zone r − g < 1 pt est ombrée en warn et
   l'asymptote verticale g = r est tracée en pointillés.              */

const D1_MIN = 1;
const D1_MAX = 10;
const D1_PAS = 0.5;
const R_MIN = 4;
const R_MAX = 12;
const R_PAS = 0.5;
const G_PAS = 0.25;
/* Écart minimal r − g imposé au curseur : gordon() exige r > g. */
const G_MARGE = 0.25;
/* Largeur de la zone « tous les dangers » : r − g < 1 point. */
const SEUIL_DANGER = 1;

const N_ECH = 140;

/* Géométrie du viewBox (unités SVG). */
const VB_L = 400;
const VB_H = 250;
const M_GAUCHE = 52;
const M_DROITE = 16;
const M_HAUT = 22;
const M_BAS = 34;
const TRACE_L = VB_L - M_GAUCHE - M_DROITE;
const TRACE_H = VB_H - M_HAUT - M_BAS;
const Y_BAS = M_HAUT + TRACE_H;

/** Pas « rond » (1/2/5 × 10^k) pour les graduations verticales. */
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

/** Montants en euros : 2 décimales sous 1 000 €, aucune au-delà. */
function fmtEuro(v: number): string {
  return fmtNombre(v, Math.abs(v) >= 1000 ? 0 : 2) + ' €';
}

/** Valeurs de curseur : 8 → « 8 », 1,5 → « 1,5 », 0,25 → « 0,25 ». */
function fmtCurseur(v: number): string {
  return v.toFixed(2).replace(/\.?0+$/, '').replace('.', ',');
}

interface Preset {
  label: string;
  d1: number;
  r: number;
  g: number;
}

const PRESETS: ReadonlyArray<Preset> = [
  { label: 'Utility mature', d1: 5, r: 7, g: 1.5 },
  { label: 'Croissance raisonnable', d1: 3, r: 8, g: 4 },
  { label: 'Tech en hypercroissance ?', d1: 1, r: 8, g: 7.5 },
];

/* ── Composant ── */
export function GordonExplorer() {
  /* Valeurs initiales = l'exemple canonique du chapitre : gordon(5, 8, 3) = 100 €. */
  const [d1, setD1] = useState(5);
  const [r, setR] = useState(8);
  const [g, setG] = useState(3);
  const idBrut = useId();
  const clipId = 'gordon-clip-' + idBrut.replace(/[^a-zA-Z0-9_-]/g, '');

  /* Borne supérieure du curseur g : r − 0,25 pt, jamais r (divergence). */
  const gMax = r - G_MARGE;
  const gEff = Math.min(g, gMax);

  const valeur = gordon(d1, r, gEff);
  const multiple = valeur / d1; // « multiple de dividende » = 1/(r−g)
  const ecart = r - gEff;
  const enZoneDanger = ecart < SEUIL_DANGER;

  /* Échelle verticale : calée sur la valeur à l'entrée de la zone warn
     (g = r − 1, soit V = 100 × D₁), élargie si le point courant est
     au-delà — la courbe « sort du cadre » près de l'asymptote, et c'est
     exactement le message.                                            */
  const vSeuil = gordon(d1, r, r - SEUIL_DANGER);
  const vMaxTrace = Math.max(vSeuil * 1.35, valeur * 1.12);

  /* Domaine horizontal : g de 0 à r, pour que l'asymptote g = r soit
     visible au bord droit du tracé.                                   */
  function xVue(gx: number): number {
    return M_GAUCHE + (gx / r) * TRACE_L;
  }

  function yVue(v: number): number {
    return Y_BAS - (v / vMaxTrace) * TRACE_H;
  }

  /* Courbe V(g) sur [0 ; r − 0,25] : r > g sur tout l'échantillon,
     gordon() ne lève donc jamais ; le clipPath coupe ce qui dépasse.  */
  const chemin = Array.from({ length: N_ECH + 1 }, (_, i) => {
    const gi = (i * gMax) / N_ECH;
    const vi = gordon(d1, r, gi);
    return `${i === 0 ? 'M' : 'L'} ${xVue(gi).toFixed(1)} ${yVue(vi).toFixed(1)}`;
  }).join(' ');

  /* Graduations. */
  const pasTickX = r > 8 ? 2 : 1;
  const ticksX: number[] = [];
  for (let t = 0; t <= r + 1e-9; t += pasTickX) ticksX.push(t);
  const pasTickY = pasRond(vMaxTrace / 4);
  const ticksY: number[] = [];
  for (let t = pasTickY; t <= vMaxTrace + 1e-9; t += pasTickY) ticksY.push(t);

  const xDanger = xVue(r - SEUIL_DANGER);

  function appliquerPreset(p: Preset) {
    setD1(p.d1);
    setR(p.r);
    setG(Math.min(p.g, p.r - G_MARGE));
  }

  /* r change → g doit rester strictement sous r. */
  function changerR(nr: number) {
    setR(nr);
    setG(prev => Math.min(prev, nr - G_MARGE));
  }

  const curseurs: ReadonlyArray<{
    libelle: string;
    valeur: number;
    affichage: string;
    min: number;
    max: number;
    pas: number;
    surChange: (v: number) => void;
  }> = [
    { libelle: 'Dividende attendu D₁', valeur: d1, affichage: fmtCurseur(d1) + ' €', min: D1_MIN, max: D1_MAX, pas: D1_PAS, surChange: setD1 },
    { libelle: 'Rendement exigé r', valeur: r, affichage: fmtCurseur(r) + ' %', min: R_MIN, max: R_MAX, pas: R_PAS, surChange: changerR },
    { libelle: 'Croissance perpétuelle g', valeur: gEff, affichage: fmtCurseur(gEff) + ' %', min: 0, max: gMax, pas: G_PAS, surChange: setG },
  ];

  return (
    <div className="my-6 rounded-lg border border-border bg-surface">
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2.5">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
          Explorateur du modèle de Gordon
        </p>
        <span className="text-[11px] text-text-muted">
          V₀ = D₁ / (r − g) — faites tendre g vers r
        </span>
      </div>

      {/* Présets */}
      <div className="flex flex-wrap gap-2 px-4 pt-3">
        {PRESETS.map(p => (
          <Button key={p.label} variante="secondaire" taille="sm" onClick={() => appliquerPreset(p)}>
            {p.label}
          </Button>
        ))}
      </div>

      {/* Curseurs D₁, r, g */}
      <div className="grid grid-cols-1 gap-x-6 gap-y-2 px-4 pt-3 sm:grid-cols-3">
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
            />
          </label>
        ))}
      </div>

      {/* Graphique */}
      <div className="px-2 pt-1">
        <svg
          viewBox={`0 0 ${VB_L} ${VB_H}`}
          className="mx-auto block w-full max-w-[560px]"
          role="img"
          aria-label={`Valeur de Gordon en fonction de la croissance g. Avec D₁ = ${fmtCurseur(d1)} €, r = ${fmtCurseur(r)} % et g = ${fmtCurseur(gEff)} %, la valeur vaut ${fmtEuro(valeur)}, soit ${fmtNombre(multiple, 1)} fois le dividende. ${enZoneDanger ? 'Attention : r − g est inférieur à 1 point, la valeur explose à l’approche de l’asymptote g = r.' : ''}`}
        >
          <defs>
            <clipPath id={clipId}>
              <rect x={M_GAUCHE} y={M_HAUT} width={TRACE_L} height={TRACE_H} />
            </clipPath>
          </defs>

          {/* Zone de tous les dangers : r − g < 1 pt */}
          <rect
            x={xDanger}
            y={M_HAUT}
            width={xVue(r) - xDanger}
            height={TRACE_H}
            fill="var(--warn)"
            fillOpacity={0.12}
          />
          <text
            x={(xDanger + xVue(r)) / 2}
            y={M_HAUT - 8}
            textAnchor="middle"
            fontSize={8.5}
            fill="var(--warn)"
          >
            r − g &lt; 1 pt
          </text>

          {/* Graduations verticales (valeur en €) */}
          {ticksY.map(t => (
            <g key={t}>
              <line x1={M_GAUCHE} x2={M_GAUCHE + TRACE_L} y1={yVue(t)} y2={yVue(t)} stroke="var(--border)" strokeWidth={0.6} />
              <text x={M_GAUCHE - 6} y={yVue(t) + 3} textAnchor="end" fontSize={9} fill="var(--text-muted)">
                {fmtNombre(t, 0)} €
              </text>
            </g>
          ))}

          {/* Axe horizontal et graduations (g en %) */}
          <line x1={M_GAUCHE} x2={M_GAUCHE + TRACE_L} y1={Y_BAS} y2={Y_BAS} stroke="var(--border)" strokeWidth={1.2} />
          {ticksX.map(t => (
            <g key={t}>
              <line x1={xVue(t)} x2={xVue(t)} y1={Y_BAS} y2={Y_BAS + 4} stroke="var(--border)" strokeWidth={1} />
              <text x={xVue(t)} y={Y_BAS + 15} textAnchor="middle" fontSize={9} fill="var(--text-muted)">
                {fmtCurseur(t)}
              </text>
            </g>
          ))}
          <text x={M_GAUCHE + TRACE_L / 2} y={VB_H - 3} textAnchor="middle" fontSize={9.5} fill="var(--text-muted)">
            croissance perpétuelle g (%)
          </text>

          {/* Asymptote verticale g = r */}
          <line
            x1={xVue(r)}
            x2={xVue(r)}
            y1={M_HAUT}
            y2={Y_BAS}
            stroke="var(--warn)"
            strokeWidth={1.4}
            strokeDasharray="4 4"
          />
          <text x={xVue(r) - 4} y={M_HAUT + 10} textAnchor="end" fontSize={9} fontWeight={600} fill="var(--warn)">
            g = r
          </text>

          {/* Courbe V(g), coupée au cadre près de l'asymptote */}
          <g clipPath={`url(#${clipId})`}>
            <path d={chemin} fill="none" stroke="var(--accent)" strokeWidth={2} strokeLinecap="round" />
          </g>

          {/* Point courant */}
          <line
            x1={xVue(gEff)}
            x2={xVue(gEff)}
            y1={yVue(valeur)}
            y2={Y_BAS}
            stroke={enZoneDanger ? 'var(--warn)' : 'var(--accent)'}
            strokeWidth={1.1}
            strokeDasharray="2 3"
          />
          <circle
            cx={xVue(gEff)}
            cy={yVue(valeur)}
            r={5}
            fill={enZoneDanger ? 'var(--warn)' : 'var(--accent)'}
            stroke="var(--surface)"
            strokeWidth={1.6}
          />
        </svg>
      </div>

      {/* Lecture : valeur en grand + mesures + message pédagogique */}
      <div className="flex flex-wrap items-start gap-x-6 gap-y-3 border-t border-border px-4 py-3">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-muted">Valeur V₀</p>
          <p
            className="tabular-nums text-2xl font-semibold leading-tight"
            style={{ color: enZoneDanger ? 'var(--warn)' : 'var(--accent)' }}
          >
            {fmtEuro(valeur)}
          </p>
        </div>
        <dl className="grid flex-1 grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
          <div>
            <dt className="text-[10px] uppercase tracking-wider text-text-muted">Multiple de dividende</dt>
            <dd className="tabular-nums text-[13px] font-semibold text-text">× {fmtNombre(multiple, 1)}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-wider text-text-muted">Écart r − g</dt>
            <dd className="tabular-nums text-[13px] font-semibold text-text">{fmtCurseur(ecart)} pt</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-wider text-text-muted">D₁ / r / g</dt>
            <dd className="tabular-nums text-[13px] font-semibold text-text">
              {fmtCurseur(d1)} € / {fmtCurseur(r)} % / {fmtCurseur(gEff)} %
            </dd>
          </div>
        </dl>
        <p className="w-full text-[11px] leading-relaxed text-text-muted">
          {enZoneDanger
            ? 'Zone de tous les dangers : r − g < 1 pt, la valeur explose. À ce niveau, la moindre révision de r ou de g fait varier la valeur de dizaines de pour cent — et elle tend vers l’infini quand g rejoint r. Gordon est inadapté à une hypercroissance : elle n’est jamais perpétuelle, il faut un DDM multi-étapes (suite du chapitre).'
            : 'La valeur ne dépend que de l’écart r − g : V₀/D₁ = 1/(r − g). Plus g se rapproche de r, plus la courbe se cabre — déplacez le curseur g vers la droite, ou essayez le préset « Tech en hypercroissance ? », pour voir la zone où le modèle déraille.'}
        </p>
      </div>
    </div>
  );
}
