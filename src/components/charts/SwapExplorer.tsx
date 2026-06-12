import { useState } from 'react';
import {
  facteurActualisation,
  tauxSwapParitaire,
  valeurSwapPayeurFixe,
} from '../../content/modules/07-derives-fermes/calculs';
import { Button } from '../ui/Button';

/* ── Explorateur de swap de taux ────────────────────────────────────────
   Trois curseurs de taux zéro (1, 2 et 3 ans) → facteurs d'actualisation
   (facteurActualisation), taux de swap paritaire (tauxSwapParitaire) et
   mini-courbe. Diagramme des flux annuels : jambe fixe au taux paritaire
   contre jambe variable aux forwards implicites de la courbe (calcul
   local en composition annuelle, cohérent avec les df : f_i =
   df_{i−1}/df_i − 1, de sorte que Σ df_i·f_i = 1 − df_n — exactement la
   jambe variable du cours). Panneau mark-to-market : taux fixe payé
   (par défaut le paritaire, suivi en continu tant que l'utilisateur n'a
   rien saisi) et choc parallèle de courbe → valeurSwapPayeurFixe sur la
   courbe choquée, verdict coloré. Notionnel : 100 M€.               */

const TAUX_MIN = 0;
const TAUX_MAX = 8;
const PAS_TAUX = 0.25;

const NOTIONNEL_M = 100;
const MATURITES = [1, 2, 3] as const;

const CHOC_MIN_PB = -200;
const CHOC_MAX_PB = 200;
const PAS_CHOC_PB = 25;

/* Sous ce seuil (en M€), la valeur du swap est affichée comme nulle :
   c'est la démonstration visuelle du taux paritaire.                  */
const SEUIL_NUL_M = 0.0005;

/* Géométrie des deux SVG (unités viewBox). */
const VB_L = 400;
const VB_COURBE_H = 150;
const VB_FLUX_H = 190;
const M_GAUCHE = 40;
const M_DROITE = 14;
const M_HAUT = 18;
const M_BAS = 30;

/* ── Formats français : virgule décimale, signe moins typographique. ── */
function fmtNombre(v: number, dec: number): string {
  return (v < 0 ? '−' : '') + Math.abs(v).toFixed(dec).replace('.', ',');
}

/** Valeurs de curseur : 4 → « 4 », 3,25 → « 3,25 ». */
function fmtCurseur(v: number): string {
  return v.toFixed(2).replace(/\.?0+$/, '').replace('.', ',');
}

/** Montant signé en M€ : +2,775 M€ / −2,775 M€. */
function fmtMSigne(v: number): string {
  return (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(3).replace('.', ',') + ' M€';
}

/** Choc en pb : +100 pb / −50 pb / 0 pb. */
function fmtPb(v: number): string {
  if (v === 0) return '0 pb';
  return (v > 0 ? '+' : '−') + Math.abs(v) + ' pb';
}

/* ── Présets ── */
interface Preset {
  label: string;
  taux: [number, number, number];
}

/* « Courbe pentue » = l'exemple canonique du chapitre :
   tauxSwapParitaire([3, 3.5, 4]) = 3,9738 %.                          */
const PRESET_DEFAUT: Preset = { label: 'Courbe pentue (3 / 3,5 / 4)', taux: [3, 3.5, 4] };

const PRESETS: ReadonlyArray<Preset> = [
  { label: 'Courbe plate 4 %', taux: [4, 4, 4] },
  PRESET_DEFAUT,
  { label: 'Courbe inversée', taux: [4.75, 4.5, 4.25] },
];

/* ── Composant ── */
export function SwapExplorer() {
  const [taux, setTaux] = useState<number[]>([...PRESET_DEFAUT.taux]);
  /* null = « suivre le taux paritaire » (défaut) ; un nombre = saisie. */
  const [tauxFixeSaisi, setTauxFixeSaisi] = useState<number | null>(null);
  const [chocPb, setChocPb] = useState(0);

  /* Facteurs d'actualisation et taux paritaire de la courbe affichée. */
  const dfs = taux.map((z, i) => facteurActualisation(z, i + 1));
  const tauxParitaire = tauxSwapParitaire(taux);

  /* Forwards implicites en composition annuelle : f_i = df_{i−1}/df_i − 1
     (df_0 = 1). Le flux variable de l'année i vaut notionnel × f_i.    */
  const forwards = dfs.map((df, i) => ((i === 0 ? 1 : dfs[i - 1]) / df - 1) * 100);

  /* Mark-to-market : taux fixe payé (saisi ou paritaire suivi en continu)
     et courbe choquée en parallèle. Sans saisie ni choc, la valeur est
     exactement nulle : c'est la définition du taux paritaire.          */
  const tauxFixePaye = tauxFixeSaisi ?? tauxParitaire;
  const tauxChoques = taux.map(z => z + chocPb / 100);
  const valeurSwap = valeurSwapPayeurFixe(tauxFixePaye, tauxChoques, NOTIONNEL_M);
  const valeurNulle = Math.abs(valeurSwap) < SEUIL_NUL_M;

  /* ── Verdict coloré du panneau mark-to-market ── */
  let couleurVerdict = 'var(--text)';
  let texteVerdict: string;
  if (valeurNulle) {
    texteVerdict =
      'Valeur nulle : au taux paritaire, les deux jambes ont exactement la même valeur actualisée — le swap se signe sans paiement initial.';
  } else if (valeurSwap > 0) {
    couleurVerdict = 'var(--ok)';
    texteVerdict =
      chocPb > 0
        ? 'Les taux ont monté : le payeur fixe gagne — il s’est engagé à payer un fixe devenu bon marché par rapport au nouveau paritaire.'
        : 'Le fixe payé est inférieur au taux paritaire de cette courbe : avantage au payeur fixe.';
  } else {
    couleurVerdict = 'var(--warn)';
    texteVerdict =
      chocPb < 0
        ? 'Les taux ont baissé : le payeur fixe perd — il s’est engagé à payer un fixe devenu trop cher par rapport au nouveau paritaire.'
        : 'Le fixe payé dépasse le taux paritaire de cette courbe : le payeur fixe surpaie, la valeur est négative.';
  }

  function appliquerPreset(p: Preset) {
    setTaux([...p.taux]);
    setTauxFixeSaisi(null);
    setChocPb(0);
  }

  function fixerTauxZero(i: number, v: number) {
    setTaux(prev => prev.map((t, j) => (j === i ? v : t)));
  }

  /* ── Mini-graphe de la courbe ── */
  const traceL = VB_L - M_GAUCHE - M_DROITE;
  const traceCourbeH = VB_COURBE_H - M_HAUT - M_BAS;
  const yBasCourbe = M_HAUT + traceCourbeH;

  function xCourbe(annee: number): number {
    return M_GAUCHE + ((annee - 1) / (MATURITES.length - 1)) * traceL;
  }

  function yCourbe(t: number): number {
    const borne = Math.min(TAUX_MAX, Math.max(TAUX_MIN, t));
    return yBasCourbe - (borne / TAUX_MAX) * traceCourbeH;
  }

  const cheminCourbe = taux
    .map((t, i) => `${i === 0 ? 'M' : 'L'} ${xCourbe(i + 1).toFixed(1)} ${yCourbe(t).toFixed(1)}`)
    .join(' ');
  const cheminChoque = tauxChoques
    .map((t, i) => `${i === 0 ? 'M' : 'L'} ${xCourbe(i + 1).toFixed(1)} ${yCourbe(t).toFixed(1)}`)
    .join(' ');

  /* ── Diagramme des flux : barres fixe vs variable, par année ── */
  const traceFluxH = VB_FLUX_H - M_HAUT - M_BAS;
  const yBasFlux = M_HAUT + traceFluxH;
  const fluxFixe = NOTIONNEL_M * (tauxParitaire / 100);
  const fluxVariables = forwards.map(f => NOTIONNEL_M * (f / 100));
  const fluxMax = Math.max(fluxFixe, ...fluxVariables, 0.5);

  function hauteurFlux(v: number): number {
    return (Math.max(0, v) / fluxMax) * traceFluxH;
  }

  const largeurAnnee = traceL / MATURITES.length;
  const largeurBarre = Math.min(34, largeurAnnee / 3);

  return (
    <div className="my-6 rounded-lg border border-border bg-surface">
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2.5">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
          Explorateur de swap de taux
        </p>
        <span className="text-[11px] text-text-muted">
          3 ans, paiements annuels, notionnel 100 M€ — jamais échangé
        </span>
      </div>

      {/* Présets */}
      <div className="flex flex-wrap gap-2 px-4 pt-3">
        {PRESETS.map(p => (
          <Button key={p.label} variante="secondaire" taille="sm" onClick={() => appliquerPreset(p)}>
            {p.label}
          </Button>
        ))}
        <Button variante="fantome" taille="sm" onClick={() => appliquerPreset(PRESET_DEFAUT)}>
          Réinitialiser
        </Button>
      </div>

      {/* Curseurs de taux zéro */}
      <div className="grid grid-cols-1 gap-x-6 gap-y-2 px-4 pt-3 sm:grid-cols-3">
        {MATURITES.map((m, i) => (
          <label key={m} className="flex flex-col gap-0.5">
            <span className="flex items-baseline justify-between gap-2 text-xs text-text-muted">
              <span>Taux zéro {m} {m > 1 ? 'ans' : 'an'}</span>
              <strong className="tabular-nums text-[13px] font-semibold text-text">
                {fmtCurseur(taux[i])} %
              </strong>
            </span>
            <input
              type="range"
              min={TAUX_MIN}
              max={TAUX_MAX}
              step={PAS_TAUX}
              value={taux[i]}
              onChange={e => fixerTauxZero(i, Number(e.target.value))}
              className="h-5 w-full cursor-pointer"
              style={{ accentColor: 'var(--accent)' }}
              aria-label={`Taux zéro à ${m} ${m > 1 ? 'ans' : 'an'} : ${fmtCurseur(taux[i])} %`}
            />
          </label>
        ))}
      </div>

      {/* Facteurs d'actualisation + taux paritaire */}
      <div className="flex flex-wrap items-end gap-x-6 gap-y-3 px-4 pt-4">
        <dl className="grid grid-cols-3 gap-x-4">
          {dfs.map((df, i) => (
            <div key={MATURITES[i]}>
              <dt className="text-[10px] uppercase tracking-wider text-text-muted">
                df {MATURITES[i]} {MATURITES[i] > 1 ? 'ans' : 'an'}
              </dt>
              <dd className="tabular-nums text-[13px] font-semibold text-text">
                {fmtNombre(df, 6)}
              </dd>
            </div>
          ))}
        </dl>
        <div className="ml-auto text-right">
          <p className="text-[10px] uppercase tracking-wider text-text-muted">Taux de swap paritaire</p>
          <p className="tabular-nums text-2xl font-semibold leading-tight text-accent">
            {fmtNombre(tauxParitaire, 4)} %
          </p>
        </div>
      </div>

      {/* Mini-courbe + diagramme des flux */}
      <div className="grid grid-cols-1 gap-2 px-2 pt-1 sm:grid-cols-2">
        {/* Mini-graphe de la courbe zéro */}
        <svg
          viewBox={`0 0 ${VB_L} ${VB_COURBE_H}`}
          className="block w-full"
          role="img"
          aria-label={`Courbe des taux zéro : ${fmtCurseur(taux[0])} % à 1 an, ${fmtCurseur(taux[1])} % à 2 ans, ${fmtCurseur(taux[2])} % à 3 ans. Taux de swap paritaire : ${fmtNombre(tauxParitaire, 4)} %.${chocPb !== 0 ? ` Courbe choquée de ${fmtPb(chocPb)} en pointillés.` : ''}`}
        >
          {[0, 2, 4, 6, 8].map(t => (
            <g key={t}>
              <line
                x1={M_GAUCHE}
                x2={M_GAUCHE + traceL}
                y1={yCourbe(t)}
                y2={yCourbe(t)}
                stroke="var(--border)"
                strokeWidth={t === 0 ? 1.2 : 0.6}
                strokeDasharray={t === 0 ? undefined : '3 4'}
              />
              <text x={M_GAUCHE - 6} y={yCourbe(t) + 3} textAnchor="end" fontSize={9} fill="var(--text-muted)">
                {t} %
              </text>
            </g>
          ))}
          {MATURITES.map(m => (
            <text key={m} x={xCourbe(m)} y={yBasCourbe + 14} textAnchor="middle" fontSize={9} fill="var(--text-muted)">
              {m} {m > 1 ? 'ans' : 'an'}
            </text>
          ))}
          <text x={M_GAUCHE + traceL / 2} y={VB_COURBE_H - 3} textAnchor="middle" fontSize={9} fill="var(--text-muted)">
            courbe zéro{chocPb !== 0 ? ' (pointillés : courbe choquée)' : ''}
          </text>

          {/* Ligne du taux paritaire */}
          <line
            x1={M_GAUCHE}
            x2={M_GAUCHE + traceL}
            y1={yCourbe(tauxParitaire)}
            y2={yCourbe(tauxParitaire)}
            stroke="var(--text-muted)"
            strokeWidth={1}
            strokeDasharray="2 4"
          />
          <text x={M_GAUCHE + 4} y={yCourbe(tauxParitaire) - 4} fontSize={8.5} fill="var(--text-muted)">
            paritaire {fmtNombre(tauxParitaire, 2)} %
          </text>

          {/* Courbe choquée (visible seulement si choc non nul) */}
          {chocPb !== 0 && (
            <path d={cheminChoque} fill="none" stroke="var(--warn)" strokeWidth={1.6} strokeDasharray="5 4" strokeLinecap="round" />
          )}

          {/* Courbe zéro */}
          <path d={cheminCourbe} fill="none" stroke="var(--accent)" strokeWidth={2} strokeLinecap="round" />
          {taux.map((t, i) => (
            <circle key={MATURITES[i]} cx={xCourbe(i + 1)} cy={yCourbe(t)} r={3.5} fill="var(--surface)" stroke="var(--accent)" strokeWidth={1.8} />
          ))}
        </svg>

        {/* Flux annuels : fixe vs variable */}
        <svg
          viewBox={`0 0 ${VB_L} ${VB_FLUX_H}`}
          className="block w-full"
          role="img"
          aria-label={`Flux annuels du swap sur 100 millions d'euros. Jambe fixe au taux paritaire : ${fmtNombre(fluxFixe, 2)} millions par an. Jambe variable aux forwards implicites : ${fluxVariables.map((f, i) => `année ${i + 1}, ${fmtNombre(f, 2)} millions`).join(' ; ')}.`}
        >
          <line x1={M_GAUCHE} x2={M_GAUCHE + traceL} y1={yBasFlux} y2={yBasFlux} stroke="var(--border)" strokeWidth={1.2} />
          {MATURITES.map((m, i) => {
            const xCentre = M_GAUCHE + (i + 0.5) * largeurAnnee;
            const hFixe = hauteurFlux(fluxFixe);
            const hVar = hauteurFlux(fluxVariables[i]);
            return (
              <g key={m}>
                {/* Barre fixe */}
                <rect
                  x={xCentre - largeurBarre - 2}
                  y={yBasFlux - hFixe}
                  width={largeurBarre}
                  height={hFixe}
                  fill="var(--accent)"
                  opacity={0.85}
                  rx={1.5}
                />
                <text x={xCentre - largeurBarre / 2 - 2} y={yBasFlux - hFixe - 4} textAnchor="middle" fontSize={8.5} fill="var(--text)">
                  {fmtNombre(fluxFixe, 2)}
                </text>
                {/* Barre variable */}
                <rect
                  x={xCentre + 2}
                  y={yBasFlux - hVar}
                  width={largeurBarre}
                  height={hVar}
                  fill="var(--text-muted)"
                  opacity={0.55}
                  rx={1.5}
                />
                <text x={xCentre + largeurBarre / 2 + 2} y={yBasFlux - hVar - 4} textAnchor="middle" fontSize={8.5} fill="var(--text-muted)">
                  {fmtNombre(fluxVariables[i], 2)}
                </text>
                <text x={xCentre} y={yBasFlux + 14} textAnchor="middle" fontSize={9} fill="var(--text-muted)">
                  année {m}
                </text>
              </g>
            );
          })}
          <text x={M_GAUCHE + traceL / 2} y={VB_FLUX_H - 3} textAnchor="middle" fontSize={9} fill="var(--text-muted)">
            flux annuels en M€ — fixe (paritaire) contre variable (forwards implicites)
          </text>
        </svg>
      </div>

      {/* Légende du diagramme des flux */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 px-4 pb-1 text-[11px] text-text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: 'var(--accent)', opacity: 0.85 }} aria-hidden="true" />
          jambe fixe au taux paritaire
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: 'var(--text-muted)', opacity: 0.55 }} aria-hidden="true" />
          jambe variable (forwards implicites, courbe avant choc)
        </span>
      </div>

      {/* Panneau mark-to-market */}
      <div className="border-t border-border px-4 py-3">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
          Mark-to-market du payeur fixe
        </p>
        <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
          <label className="flex flex-col gap-0.5">
            <span className="flex items-baseline justify-between gap-2 text-xs text-text-muted">
              <span>Vous payez fixe à</span>
              <strong className="tabular-nums text-[13px] font-semibold text-text">
                {fmtNombre(tauxFixePaye, 4)} %{tauxFixeSaisi === null ? ' (paritaire)' : ''}
              </strong>
            </span>
            <span className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                max={10}
                step={0.05}
                value={Number(tauxFixePaye.toFixed(4))}
                onChange={e => {
                  const v = Number(e.target.value);
                  if (Number.isFinite(v)) setTauxFixeSaisi(Math.min(10, Math.max(0, v)));
                }}
                className="w-24 rounded border border-border bg-surface-2 px-2 py-1 tabular-nums text-[13px] text-text"
                aria-label="Taux fixe payé, en pourcentage"
              />
              <span className="text-xs text-text-muted">%</span>
              {tauxFixeSaisi !== null && (
                <Button variante="fantome" taille="sm" onClick={() => setTauxFixeSaisi(null)}>
                  Revenir au paritaire
                </Button>
              )}
            </span>
          </label>
          <label className="flex flex-col gap-0.5">
            <span className="flex items-baseline justify-between gap-2 text-xs text-text-muted">
              <span>Choc parallèle de la courbe</span>
              <strong className="tabular-nums text-[13px] font-semibold text-text">{fmtPb(chocPb)}</strong>
            </span>
            <input
              type="range"
              min={CHOC_MIN_PB}
              max={CHOC_MAX_PB}
              step={PAS_CHOC_PB}
              value={chocPb}
              onChange={e => setChocPb(Number(e.target.value))}
              className="h-5 w-full cursor-pointer"
              style={{ accentColor: 'var(--accent)' }}
              aria-label={`Choc parallèle de la courbe : ${fmtPb(chocPb)}`}
            />
          </label>
        </div>
        <div className="mt-3 flex flex-wrap items-start gap-x-6 gap-y-2">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-text-muted">Valeur du swap (payeur fixe)</p>
            <p className="tabular-nums text-xl font-semibold leading-tight" style={{ color: valeurNulle ? 'var(--text)' : couleurVerdict }}>
              {valeurNulle ? '0,000 M€' : fmtMSigne(valeurSwap)}
            </p>
          </div>
          <p className="min-w-[200px] flex-1 text-[11px] leading-relaxed text-text-muted" role="status">
            {texteVerdict}
          </p>
        </div>
      </div>
    </div>
  );
}
