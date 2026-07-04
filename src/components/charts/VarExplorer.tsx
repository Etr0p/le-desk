import { useState } from 'react';
import {
  varParametrique,
} from '../../content/modules/12-gestion-actifs-risques/calculs';
import { useLangue } from '../../engine/useLangue';
import type { Langue } from '../../engine/types';

/* ── L'explorateur de VaR (module 12) ───────────────────────────────────
   Quatre curseurs (valeur du portefeuille, volatilité annuelle, niveau de
   confiance, horizon) : le composant calcule la VaR paramétrique via
   calculs.ts et dessine la cloche normale des P&L avec la queue au-delà du
   seuil. HONNÊTETÉ PÉDAGOGIQUE : la VaR paramétrique suppose des
   rendements NORMAUX et i.i.d. (racine du temps) — les vraies
   distributions ont des queues épaisses (kurtosis, module 2) et les
   pertes s'auto-corrèlent en crise : la VaR affichée est un plancher
   optimiste, et elle ne dit RIEN de la perte au-delà du seuil.          */

const VAL_MIN = 10;
const VAL_MAX = 500;
const VAL_DEFAUT = 100;
const VAL_PAS = 10;
const VOL_MIN = 5;
const VOL_MAX = 50;
const VOL_DEFAUT = 20;
const HOR_MIN = 1;
const HOR_MAX = 20;
const HOR_DEFAUT = 1;
/* Niveaux de confiance offerts (index de curseur → niveau, z d'usage). */
const NIVEAUX = [
  { conf: 90, z: 1.28 },
  { conf: 95, z: 1.65 },
  { conf: 99, z: 2.33 },
] as const;

/* Géométrie du SVG (unités viewBox). */
const VB_L = 400;
const VB_H = 170;
const M_G = 14;
const M_D = 14;
const M_H = 12;
const M_B = 30;
const TRACE_L = VB_L - M_G - M_D;
const TRACE_H = VB_H - M_H - M_B;

/* ── Textes d'interface FR/EN ── */
const TXT = {
  fr: {
    titre: 'La VaR paramétrique',
    sousTitre: 'un seuil, pas une perte maximale',
    valeur: 'Valeur du portefeuille',
    vol: 'Volatilité annuelle',
    conf: 'Niveau de confiance',
    horizon: 'Horizon',
    jour: 'jour',
    jours: 'jours',
    var: (c: string, h: string) => `VaR ${c} % à ${h}`,
    frequence: 'Dépassement attendu',
    freqVal: (n: string) => `~1 jour de bourse sur ${n}`,
    axe: 'P&L (M€)',
    seuil: 'seuil VaR',
    lecture: 'Lecture',
    honnete:
      'Hypothèses : rendements normaux et indépendants (racine du temps pour l\'horizon). Les vraies distributions ont des queues plus épaisses (kurtosis, module 2) et les pertes s\'enchaînent en crise : la VaR paramétrique est un plancher optimiste. Et par construction, elle ne dit RIEN de la perte au-delà du seuil — c\'est le rôle de l\'expected shortfall et des stress tests.',
    msg: (varTxt: string, conf: string, freq: string) =>
      `La zone rouge est tout ce que la VaR promet : « la perte ne devrait pas dépasser ${varTxt} M€, ${conf} % du temps ». Le dépassement n\'est pas un échec du modèle, il est PRÉVU : environ un jour sur ${freq}. La question qui tue en salle : « et ce jour-là, on perd combien ? » — la VaR ne le sait pas. LTCM avait une VaR impeccable (module 11, chapitre 3) ; c\'est la taille de la queue qui l\'a tué.`,
    msgHorizon:
      ' L\'horizon s\'étire en racine du temps (√h) : doubler l\'horizon ne double PAS la VaR — hypothèse d\'indépendance qui casse précisément quand les pertes s\'enchaînent.',
  },
  en: {
    titre: 'Parametric VaR',
    sousTitre: 'a threshold, not a maximum loss',
    valeur: 'Portfolio value',
    vol: 'Annual volatility',
    conf: 'Confidence level',
    horizon: 'Horizon',
    jour: 'day',
    jours: 'days',
    var: (c: string, h: string) => `${c}% VaR over ${h}`,
    frequence: 'Expected breach',
    freqVal: (n: string) => `~1 trading day in ${n}`,
    axe: 'P&L (€m)',
    seuil: 'VaR threshold',
    lecture: 'How to read this',
    honnete:
      'Assumptions: normal, independent returns (square-root-of-time scaling). Real distributions have fatter tails (kurtosis, module 2) and losses cluster in crises: parametric VaR is an optimistic floor. And by construction it says NOTHING about the loss beyond the threshold — that is what expected shortfall and stress tests are for.',
    msg: (varTxt: string, conf: string, freq: string) =>
      `The red zone is all that VaR promises: "the loss should not exceed €${varTxt}m, ${conf}% of the time". A breach is not a model failure, it is EXPECTED: about one day in ${freq}. The killer floor question: "and on that day, how much do we lose?" — VaR does not know. LTCM had impeccable VaR (module 11, chapter 3); the size of the tail is what killed it.`,
    msgHorizon:
      ' The horizon scales with the square root of time (√h): doubling the horizon does NOT double the VaR — an independence assumption that breaks precisely when losses cluster.',
  },
} as const;

/* ── Format : virgule décimale en FR, point en EN ── */
function fmtNombre(v: number, dec: number, langue: Langue): string {
  const arrondiNul = Math.abs(v) < 0.5 * 10 ** -dec;
  const abs = Math.abs(v).toFixed(dec);
  const txt = langue === 'fr' ? abs.replace('.', ',') : abs;
  return (v < 0 && !arrondiNul ? '−' : '') + txt;
}

/* Densité normale standard. */
function phi(x: number): number {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

/* ── Composant ── */
export function VarExplorer() {
  const { langue } = useLangue();
  const L = TXT[langue];
  const [valeurM, setValeurM] = useState(VAL_DEFAUT);
  const [volPct, setVolPct] = useState(VOL_DEFAUT);
  const [idxConf, setIdxConf] = useState(1);
  const [horizon, setHorizon] = useState(HOR_DEFAUT);

  const { conf, z } = NIVEAUX[idxConf];
  const varM = varParametrique(valeurM, volPct, z, horizon);
  const freqJours = Math.round(1 / (1 - conf / 100));

  /* ── Cloche normale de x = −4 à +4, queue sous −z en rouge ── */
  const X_MAX = 4;
  const xPos = (x: number) => M_G + ((x + X_MAX) / (2 * X_MAX)) * TRACE_L;
  const yPos = (d: number) => M_H + TRACE_H * (1 - d / phi(0));
  const N = 120;
  const courbe: string[] = [];
  const queue: string[] = [`${xPos(-X_MAX)},${yPos(0)}`];
  for (let i = 0; i <= N; i++) {
    const x = -X_MAX + (2 * X_MAX * i) / N;
    const pt = `${xPos(x)},${yPos(phi(x))}`;
    courbe.push(pt);
    if (x <= -z) queue.push(pt);
  }
  queue.push(`${xPos(-z)},${yPos(0)}`);

  const horizonTxt = `${horizon} ${horizon > 1 ? L.jours : L.jour}`;
  const message =
    L.msg(fmtNombre(varM, 1, langue), fmtNombre(conf, 0, langue), String(freqJours)) +
    (horizon > 1 ? L.msgHorizon : '');

  const curseurs: ReadonlyArray<{
    libelle: string;
    valeur: number;
    affichage: string;
    min: number;
    max: number;
    pas: number;
    surChange: (v: number) => void;
  }> = [
    { libelle: L.valeur, valeur: valeurM, affichage: `${fmtNombre(valeurM, 0, langue)} M€`, min: VAL_MIN, max: VAL_MAX, pas: VAL_PAS, surChange: setValeurM },
    { libelle: L.vol, valeur: volPct, affichage: `${fmtNombre(volPct, 0, langue)} %`, min: VOL_MIN, max: VOL_MAX, pas: 1, surChange: setVolPct },
    { libelle: L.conf, valeur: idxConf, affichage: `${NIVEAUX[idxConf].conf} % (z ${fmtNombre(NIVEAUX[idxConf].z, 2, langue)})`, min: 0, max: NIVEAUX.length - 1, pas: 1, surChange: setIdxConf },
    { libelle: L.horizon, valeur: horizon, affichage: horizonTxt, min: HOR_MIN, max: HOR_MAX, pas: 1, surChange: setHorizon },
  ];

  const ariaGraphe =
    langue === 'fr'
      ? `Cloche des P&L : VaR ${conf} % à ${horizonTxt} de ${fmtNombre(varM, 1, langue)} millions d'euros, dépassée environ un jour sur ${freqJours}.`
      : `P&L bell curve: ${conf}% VaR over ${horizonTxt} of ${fmtNombre(varM, 1, langue)} million euros, breached about one day in ${freqJours}.`;

  return (
    <div className="my-6 rounded-lg border border-border bg-surface">
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2.5">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">{L.titre}</p>
        <span className="text-[11px] text-text-muted">{L.sousTitre}</span>
      </div>

      {/* Curseurs */}
      <div className="grid grid-cols-1 gap-x-6 gap-y-2 px-4 pt-3 sm:grid-cols-4">
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
      </div>

      {/* Chiffres clés */}
      <div className="flex flex-wrap items-end gap-x-6 gap-y-2 px-4 pt-3" aria-live="polite">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-muted">{L.var(fmtNombre(conf, 0, langue), horizonTxt)}</p>
          <p className="tabular-nums text-2xl font-semibold leading-tight text-err">
            {fmtNombre(varM, 1, langue)} M€
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-muted">{L.frequence}</p>
          <p className="tabular-nums text-2xl font-semibold leading-tight text-warn">
            {L.freqVal(String(freqJours))}
          </p>
        </div>
      </div>

      {/* Cloche normale avec la queue VaR */}
      <div className="px-2 pt-1">
        <svg viewBox={`0 0 ${VB_L} ${VB_H}`} className="block w-full" role="img" aria-label={ariaGraphe}>
          <line x1={M_G} x2={VB_L - M_D} y1={yPos(0)} y2={yPos(0)} stroke="var(--border)" strokeWidth={1.2} />
          {/* Queue au-delà de la VaR */}
          <polygon points={queue.join(' ')} fill="var(--err)" opacity={0.35} />
          {/* Cloche */}
          <polyline points={courbe.join(' ')} fill="none" stroke="var(--accent)" strokeWidth={2} />
          {/* Seuil VaR */}
          <line x1={xPos(-z)} x2={xPos(-z)} y1={M_H + 4} y2={yPos(0)} stroke="var(--err)" strokeWidth={1.4} strokeDasharray="4 3" />
          <text x={xPos(-z) - 5} y={M_H + 10} textAnchor="end" fontSize={8} fontWeight={700} fill="var(--err)">
            −{fmtNombre(varM, 1, langue)} M€
          </text>
          <text x={xPos(-z) - 5} y={M_H + 20} textAnchor="end" fontSize={7} fill="var(--err)">
            {L.seuil} ({fmtNombre(100 - conf, 0, langue)} %)
          </text>
          {/* Axe */}
          <text x={xPos(0)} y={VB_H - M_B + 12} textAnchor="middle" fontSize={7.5} fill="var(--text-muted)">0</text>
          <text x={VB_L - M_D} y={VB_H - M_B + 12} textAnchor="end" fontSize={7} fill="var(--text-muted)">{L.axe}</text>
        </svg>
      </div>

      {/* Lecture pédagogique dynamique + avertissement d'honnêteté */}
      <div className="border-t border-border px-4 py-3" aria-live="polite">
        <p className="text-[11px] leading-relaxed text-text-muted">
          <strong className="text-text">{L.lecture} :</strong> {message}
        </p>
        <p className="mt-1.5 text-[11px] italic leading-relaxed text-text-muted">{L.honnete}</p>
      </div>
    </div>
  );
}
