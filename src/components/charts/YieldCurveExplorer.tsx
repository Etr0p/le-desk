import { useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { Badge } from '../ui/Badge';
import type { VarianteBadge } from '../ui/Badge';
import { Button } from '../ui/Button';

/* ── Explorateur de courbe des taux ─────────────────────────────────────
   SVG interactif autonome : 8 points glissables verticalement (souris,
   tactile, clavier), étiquette de forme et spread 2s10s en temps réel.
   Aucune donnée externe, aucune dépendance de chart.                   */

const MATURITES = [1, 2, 3, 5, 7, 10, 20, 30] as const;
const IDX_2ANS = 1;
const IDX_10ANS = 5;

const PRESET_NORMALE = [2.2, 2.4, 2.6, 2.9, 3.1, 3.3, 3.6, 3.8];
const PRESET_INVERSEE = [4.8, 4.7, 4.5, 4.2, 4.0, 3.9, 3.9, 4.0];
const PRESET_PLATE = [3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0];

const TAUX_MIN = 0;
const TAUX_MAX = 8;
const PAS_CLAVIER = 0.1; // ±10 pb par appui de flèche

/* Géométrie du viewBox (unités SVG). Positions X équidistantes :
   l'échelle n'est pas linéaire en années, mais la lecture y gagne. */
const VB_L = 400;
const VB_H = 280;
const M_GAUCHE = 36;
const M_DROITE = 14;
const M_HAUT = 16;
const M_BAS = 38;
const TRACE_L = VB_L - M_GAUCHE - M_DROITE;
const TRACE_H = VB_H - M_HAUT - M_BAS;
const Y_BAS = M_HAUT + TRACE_H;

function xDuPoint(i: number): number {
  return M_GAUCHE + (i * TRACE_L) / (MATURITES.length - 1);
}

function yDuTaux(taux: number): number {
  return M_HAUT + (1 - taux / TAUX_MAX) * TRACE_H;
}

function borner(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

/** Format français : virgule décimale, zéros traînants retirés (3 / 2,9 / 2,95). */
function fmtTaux(taux: number): string {
  return taux.toFixed(2).replace(/\.?0+$/, '').replace('.', ',');
}

/* ── Courbe lissée : Catmull-Rom converti en segments cubiques ── */
function cheminLisse(pts: ReadonlyArray<{ x: number; y: number }>): string {
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

/* ── Détection de la forme ──────────────────────────────────────────────
   Règles simples, priorité : bossée > inversée > plate > normale.      */
type Forme = 'normale' | 'inversee' | 'plate' | 'bossee';

function spread2s10sPb(taux: number[]): number {
  return Math.round((taux[IDX_10ANS] - taux[IDX_2ANS]) * 100);
}

function detecterForme(taux: number[]): Forme {
  // Bossée : maximum global strictement intérieur avant 10 ans, puis décrue.
  const EPS = 0.01;
  let m = 0;
  for (let i = 1; i < taux.length; i++) if (taux[i] > taux[m]) m = i;
  const bossee =
    m >= 1 &&
    m < IDX_10ANS &&
    taux[m] > taux[m - 1] + EPS &&
    taux.slice(m + 1).every(t => t < taux[m] - EPS);
  if (bossee) return 'bossee';

  const spread = spread2s10sPb(taux);
  if (spread < -10) return 'inversee';
  if (Math.abs(spread) <= 30) return 'plate';
  return 'normale';
}

const FORMES: Record<Forme, { label: string; badge: VarianteBadge; phrase: string }> = {
  normale: {
    label: 'Normale',
    badge: 'ok',
    phrase: 'Les taux longs dépassent les taux courts : le marché facture le temps et son incertitude — la configuration la plus fréquente.',
  },
  inversee: {
    label: 'Inversée',
    badge: 'err',
    phrase: 'Les taux courts dépassent les taux longs : le marché anticipe des baisses de taux directeurs — signal récessif historique, à manier avec prudence.',
  },
  plate: {
    label: 'Plate',
    badge: 'neutre',
    phrase: 'Courts et longs au même niveau : phase de transition, le marché hésite sur la trajectoire des taux.',
  },
  bossee: {
    label: 'Bossée',
    badge: 'n3',
    phrase: 'Maximum sur les maturités intermédiaires puis décrue : configuration rare, typique des fins de cycle de resserrement monétaire.',
  },
};

/* ── Composant ── */
export function YieldCurveExplorer() {
  const [taux, setTaux] = useState<number[]>(PRESET_NORMALE);
  const [actif, setActif] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragIdx = useRef<number | null>(null);

  function tauxDepuisClientY(clientY: number): number | null {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    if (rect.height === 0) return null;
    const yVue = ((clientY - rect.top) / rect.height) * VB_H;
    const brut = ((Y_BAS - yVue) / TRACE_H) * TAUX_MAX;
    // Arrondi à 5 pb : valeurs propres à l'affichage comme à la lecture.
    return borner(Math.round(brut * 20) / 20, TAUX_MIN, TAUX_MAX);
  }

  function fixerTaux(i: number, valeur: number) {
    setTaux(prev => prev.map((t, j) => (j === i ? valeur : t)));
  }

  function surPointerDown(i: number, e: ReactPointerEvent<SVGRectElement>) {
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Pointeur déjà disparu (tap très bref) : le drag local reste fonctionnel.
    }
    dragIdx.current = i;
    setActif(i);
    const v = tauxDepuisClientY(e.clientY);
    if (v !== null) fixerTaux(i, v);
  }

  function surPointerMove(e: ReactPointerEvent<SVGRectElement>) {
    const i = dragIdx.current;
    if (i === null) return;
    const v = tauxDepuisClientY(e.clientY);
    if (v !== null) fixerTaux(i, v);
  }

  function surPointerFin(e: ReactPointerEvent<SVGRectElement>) {
    if (dragIdx.current === null) return;
    dragIdx.current = null;
    setActif(null);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  }

  function surClavier(i: number, e: KeyboardEvent<SVGCircleElement>) {
    let delta = 0;
    if (e.key === 'ArrowUp') delta = PAS_CLAVIER;
    else if (e.key === 'ArrowDown') delta = -PAS_CLAVIER;
    else return;
    e.preventDefault();
    // Forme fonctionnelle : robuste aux appuis rapprochés (état jamais périmé).
    setTaux(prev =>
      prev.map((t, j) =>
        j === i ? borner(Math.round((t + delta) * 20) / 20, TAUX_MIN, TAUX_MAX) : t,
      ),
    );
  }

  const points = taux.map((t, i) => ({ x: xDuPoint(i), y: yDuTaux(t) }));
  const forme = FORMES[detecterForme(taux)];
  const spread = spread2s10sPb(taux);
  const spreadPositif = spread >= 0;
  const demiColonne = TRACE_L / (MATURITES.length - 1) / 2;

  return (
    <div className="my-6 rounded-lg border border-border bg-surface">
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2.5">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
          Explorateur de courbe des taux
        </p>
        <span className="text-[11px] text-text-muted">
          Glissez les points (ou flèches ↑↓ au clavier)
        </span>
      </div>

      {/* Présets */}
      <div className="flex flex-wrap gap-2 px-4 pt-3">
        <Button variante="secondaire" taille="sm" onClick={() => setTaux(PRESET_NORMALE)}>
          Normale
        </Button>
        <Button variante="secondaire" taille="sm" onClick={() => setTaux(PRESET_INVERSEE)}>
          Inversée (type 2022-2023 US)
        </Button>
        <Button variante="secondaire" taille="sm" onClick={() => setTaux(PRESET_PLATE)}>
          Plate
        </Button>
        <Button variante="fantome" taille="sm" onClick={() => setTaux(PRESET_NORMALE)}>
          Réinitialiser
        </Button>
      </div>

      {/* Graphique */}
      <div className="px-2 pt-1">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VB_L} ${VB_H}`}
          className="mx-auto block w-full max-w-[560px]"
          role="img"
          aria-label="Courbe des taux interactive : taux en pourcentage selon la maturité en années"
        >
          {/* Grille horizontale : 0 à 8 %, tous les 2 % */}
          {[0, 2, 4, 6, 8].map(t => (
            <g key={t}>
              <line
                x1={M_GAUCHE}
                x2={M_GAUCHE + TRACE_L}
                y1={yDuTaux(t)}
                y2={yDuTaux(t)}
                stroke="var(--border)"
                strokeWidth={t === 0 ? 1.2 : 0.6}
                strokeDasharray={t === 0 ? undefined : '3 4'}
              />
              <text
                x={M_GAUCHE - 7}
                y={yDuTaux(t) + 3.5}
                textAnchor="end"
                fontSize={10.5}
                fill="var(--text-muted)"
              >
                {t} %
              </text>
            </g>
          ))}

          {/* Libellés de maturité */}
          {MATURITES.map((m, i) => (
            <text
              key={m}
              x={xDuPoint(i)}
              y={Y_BAS + 15}
              textAnchor="middle"
              fontSize={10.5}
              fill="var(--text-muted)"
            >
              {m}
            </text>
          ))}
          <text
            x={M_GAUCHE + TRACE_L / 2}
            y={VB_H - 6}
            textAnchor="middle"
            fontSize={10}
            fill="var(--text-muted)"
          >
            Maturité (années)
          </text>

          {/* Courbe lissée */}
          <path
            d={cheminLisse(points)}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={2}
            strokeLinecap="round"
          />

          {/* Points : poignée visible + valeur du point actif */}
          {points.map((p, i) => {
            const estActif = actif === i;
            return (
              <g key={MATURITES[i]}>
                {estActif && (
                  <text
                    x={borner(p.x, M_GAUCHE + 14, M_GAUCHE + TRACE_L - 14)}
                    y={p.y < M_HAUT + 24 ? p.y + 22 : p.y - 13}
                    textAnchor="middle"
                    fontSize={11}
                    fontWeight={600}
                    fill="var(--text)"
                  >
                    {fmtTaux(taux[i])} %
                  </text>
                )}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={estActif ? 7.5 : 6}
                  fill="var(--surface)"
                  stroke="var(--accent)"
                  strokeWidth={2}
                  tabIndex={0}
                  role="slider"
                  aria-orientation="vertical"
                  aria-valuemin={TAUX_MIN}
                  aria-valuemax={TAUX_MAX}
                  aria-valuenow={taux[i]}
                  aria-valuetext={`${fmtTaux(taux[i])} %`}
                  aria-label={`Taux ${MATURITES[i]} ${MATURITES[i] > 1 ? 'ans' : 'an'} : ${fmtTaux(taux[i])} %`}
                  onKeyDown={e => surClavier(i, e)}
                  onFocus={() => setActif(i)}
                  onBlur={() => setActif(prev => (prev === i ? null : prev))}
                />
              </g>
            );
          })}

          {/* Zones de saisie : une colonne par maturité, pleine hauteur —
              cible tactile très large, drag vertical sans scroll parasite. */}
          {points.map((p, i) => (
            <rect
              key={`hit-${MATURITES[i]}`}
              x={p.x - demiColonne}
              y={M_HAUT - 8}
              width={demiColonne * 2}
              height={TRACE_H + 16}
              fill="transparent"
              style={{ cursor: 'ns-resize', touchAction: 'none' }}
              onPointerDown={e => surPointerDown(i, e)}
              onPointerMove={surPointerMove}
              onPointerUp={surPointerFin}
              onPointerCancel={surPointerFin}
              onPointerEnter={() => {
                if (dragIdx.current === null) setActif(i);
              }}
              onPointerLeave={() => {
                if (dragIdx.current === null) setActif(prev => (prev === i ? null : prev));
              }}
            />
          ))}
        </svg>
      </div>

      {/* Lecture : spread 2s10s + forme + interprétation */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border px-4 py-3">
        <span className="text-sm text-text">
          Spread 2s10s{' '}
          <strong className={`tabular-nums font-semibold ${spreadPositif ? 'text-accent' : 'text-err'}`}>
            {spreadPositif ? '+' : '−'}
            {Math.abs(spread)} pb
          </strong>
        </span>
        <Badge variante={forme.badge}>{forme.label}</Badge>
        <p className="w-full text-[13px] leading-relaxed text-text-muted sm:w-auto sm:flex-1 sm:min-w-[220px]">
          {forme.phrase}
        </p>
      </div>
    </div>
  );
}
