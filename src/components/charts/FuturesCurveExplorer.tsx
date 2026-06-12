import { useState } from 'react';
import { forwardCommodity, rollYieldAnnualise } from '../../content/modules/06-change-commos-crypto/calculs';
import { Button } from '../ui/Button';

/* ── Explorateur de courbe des futures ──────────────────────────────────
   Courbe F(T) d'une matière première fictive sur 24 mois, calculée par
   forwardCommodity (calculs.ts du module 6) : spot et trois composantes
   du coût de portage aux curseurs. Étiquette contango / backwardation
   selon le signe du portage net ; panneau « roll yield » (position
   longue rollée tous les 3 mois) via rollYieldAnnualise. Saisonnalité
   sinusoïdale optionnelle (préset « Gaz hiver ») en facteur
   multiplicatif, nul en T = 0 : le spot reste le spot.              */

const SPOT_MIN = 60;
const SPOT_MAX = 100;
const FIN_MAX = 6;
const STOCK_MAX = 4;
const CONV_MAX = 8;
const PAS_PCT = 0.25;

const MOIS_MAX = 24;
const N_ECH = 48; // un échantillon par demi-mois
const ROLL_MOIS = 3; // roll trimestriel

/* Saisonnalité (gaz) : facteur 1 + AMP·sin(2π·mois/12). Nul en T = 0,
   maximal à +3 et +15 mois — la courbe vue d'un automne, une bosse sur
   chacun des deux hivers suivants.                                    */
const AMP_SAISON = 0.06;

/* Sous ±0,25 pt de portage net, la courbe est considérée comme plate. */
const SEUIL_PLAT = 0.25;

/* Géométrie du viewBox (unités SVG). */
const VB_L = 400;
const VB_H = 250;
const M_GAUCHE = 46;
const M_DROITE = 16;
const M_HAUT = 20;
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

/* ── Formats français : virgule décimale, signe moins typographique. ── */
function fmtNombre(v: number, dec: number): string {
  return (v < 0 ? '−' : '') + Math.abs(v).toFixed(dec).replace('.', ',');
}

/** Valeurs de curseur : 4 → « 4 », 0,25 → « 0,25 ». */
function fmtCurseur(v: number): string {
  return v.toFixed(2).replace(/\.?0+$/, '').replace('.', ',');
}

/** Pourcentage signé : +3,09 % / −4,76 %. */
function fmtPctSigne(v: number): string {
  return (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(2).replace('.', ',') + ' %';
}

type Regime = 'contango' | 'backwardation' | 'plate';

const REGIMES: Record<Regime, { label: string; classeBadge: string; couleur: string; phrase: string }> = {
  contango: {
    label: 'Contango',
    classeBadge: 'border-accent/30 bg-accent/10 text-accent',
    couleur: 'var(--accent)',
    phrase:
      'Courbe montante : le portage net est positif (financement + stockage > convenience yield), la configuration des marchés bien approvisionnés. En contango, l’ETF long saigne à chaque roll : tous les 3 mois, il vend le contrat proche moins cher qu’il ne rachète le suivant — le coût annualisé s’affiche ci-dessus, sans que le spot ait bougé.',
  },
  backwardation: {
    label: 'Backwardation',
    classeBadge: 'border-warn/30 bg-warn/10 text-warn',
    couleur: 'var(--warn)',
    phrase:
      'Courbe descendante : le convenience yield domine le coût de portage — détenir le physique maintenant vaut cher, signature d’un marché tendu. Le roll devient un gain : la position longue vend le proche plus cher qu’elle ne rachète le lointain, et encaisse le rendement annualisé ci-dessus à spot inchangé.',
  },
  plate: {
    label: 'Courbe plate',
    classeBadge: 'border-border bg-surface-2 text-text-muted',
    couleur: 'var(--accent)',
    phrase:
      'Portage net quasi nul : financement et stockage sont compensés par le convenience yield. Le roll ne coûte ni ne rapporte — poussez un curseur pour faire basculer la courbe d’un régime à l’autre.',
  },
};

interface Preset {
  label: string;
  spot: number;
  financement: number;
  stockage: number;
  convenience: number;
  saison: boolean;
}

/* Préset par défaut = l'exemple canonique du chapitre :
   forwardCommodity(80, 4, 2, 1, 1) = 84.                              */
const PRESET_DEFAUT: Preset = { label: 'Réinitialiser', spot: 80, financement: 4, stockage: 2, convenience: 1, saison: false };

const PRESETS: ReadonlyArray<Preset> = [
  { label: 'Or (stockage faible, pas de convenience)', spot: 85, financement: 4, stockage: 0.5, convenience: 0, saison: false },
  { label: 'Pétrole tendu (backwardation)', spot: 90, financement: 4, stockage: 2, convenience: 8, saison: false },
  { label: 'Gaz hiver (saisonnier)', spot: 70, financement: 3, stockage: 4, convenience: 2, saison: true },
];

/* ── Composant ── */
export function FuturesCurveExplorer() {
  const [spot, setSpot] = useState(PRESET_DEFAUT.spot);
  const [financement, setFinancement] = useState(PRESET_DEFAUT.financement);
  const [stockage, setStockage] = useState(PRESET_DEFAUT.stockage);
  const [convenience, setConvenience] = useState(PRESET_DEFAUT.convenience);
  const [saison, setSaison] = useState(PRESET_DEFAUT.saison);

  /** F(mois) : forwardCommodity en années, facteur saisonnier optionnel. */
  function prix(mois: number): number {
    const base = forwardCommodity(spot, financement, stockage, convenience, mois / 12);
    if (!saison) return base;
    return base * (1 + AMP_SAISON * Math.sin((2 * Math.PI * mois) / 12));
  }

  const portageNet = financement + stockage - convenience;
  const regimeCle: Regime =
    portageNet > SEUIL_PLAT ? 'contango' : portageNet < -SEUIL_PLAT ? 'backwardation' : 'plate';
  const regime = REGIMES[regimeCle];

  /* Roll trimestriel d'une position longue : on vend le contrat arrivant
     à échéance (≈ spot, convergence de la base) et on rachète l'échéance
     à 3 mois. rollYieldAnnualise donne directement le coût/gain annualisé. */
  const prixProche = prix(0);
  const prixLointain = prix(ROLL_MOIS);
  const rollYield = rollYieldAnnualise(prixProche, prixLointain, ROLL_MOIS / 12);
  const f12 = prix(12);

  /* Échantillonnage de la courbe et échelle verticale dynamique. */
  const echantillons = Array.from({ length: N_ECH + 1 }, (_, i) => {
    const mois = (i * MOIS_MAX) / N_ECH;
    return { mois, valeur: prix(mois) };
  });
  const valeurs = echantillons.map(e => e.valeur).concat(spot);
  const vMin = Math.min(...valeurs);
  const vMax = Math.max(...valeurs);
  const marge = Math.max((vMax - vMin) * 0.18, spot * 0.015);
  const yMin = vMin - marge;
  const yMax = vMax + marge;

  function xVue(mois: number): number {
    return M_GAUCHE + (mois / MOIS_MAX) * TRACE_L;
  }

  function yVue(v: number): number {
    return Y_BAS - ((v - yMin) / (yMax - yMin)) * TRACE_H;
  }

  const chemin = echantillons
    .map((e, i) => `${i === 0 ? 'M' : 'L'} ${xVue(e.mois).toFixed(1)} ${yVue(e.valeur).toFixed(1)}`)
    .join(' ');

  /* Échéances rollées : un point tous les 3 mois sur la courbe. */
  const echeancesRoll = Array.from({ length: MOIS_MAX / ROLL_MOIS }, (_, i) => (i + 1) * ROLL_MOIS);

  /* Graduations. */
  const pasTickY = pasRond((yMax - yMin) / 4);
  const ticksY: number[] = [];
  for (let t = Math.ceil(yMin / pasTickY) * pasTickY; t <= yMax + 1e-9; t += pasTickY) ticksY.push(t);
  const ticksX = [0, 6, 12, 18, 24];

  function appliquerPreset(p: Preset) {
    setSpot(p.spot);
    setFinancement(p.financement);
    setStockage(p.stockage);
    setConvenience(p.convenience);
    setSaison(p.saison);
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
    { libelle: 'Spot S', valeur: spot, affichage: fmtCurseur(spot) + ' $', min: SPOT_MIN, max: SPOT_MAX, pas: 1, surChange: setSpot },
    { libelle: 'Financement', valeur: financement, affichage: fmtCurseur(financement) + ' %', min: 0, max: FIN_MAX, pas: PAS_PCT, surChange: setFinancement },
    { libelle: 'Stockage', valeur: stockage, affichage: fmtCurseur(stockage) + ' %', min: 0, max: STOCK_MAX, pas: PAS_PCT, surChange: setStockage },
    { libelle: 'Convenience yield', valeur: convenience, affichage: fmtCurseur(convenience) + ' %', min: 0, max: CONV_MAX, pas: PAS_PCT, surChange: setConvenience },
  ];

  const couleurRoll = rollYield < -0.05 ? 'var(--warn)' : rollYield > 0.05 ? 'var(--ok)' : 'var(--text)';

  return (
    <div className="my-6 rounded-lg border border-border bg-surface">
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2.5">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
          Explorateur de courbe des futures
        </p>
        <span className="text-[11px] text-text-muted">
          F(T) = S × (1 + portage net × T) — jouez sur le portage
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

      {/* Curseurs */}
      <div className="grid grid-cols-1 gap-x-6 gap-y-2 px-4 pt-3 sm:grid-cols-2">
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
      <label className="mt-1 flex cursor-pointer items-center gap-2 px-4 text-xs text-text-muted">
        <input
          type="checkbox"
          checked={saison}
          onChange={e => setSaison(e.target.checked)}
          style={{ accentColor: 'var(--accent)' }}
        />
        Saisonnalité hivernale (gaz) : bosse sur chaque hiver, spot inchangé
      </label>

      {/* Graphique */}
      <div className="px-2 pt-1">
        <svg
          viewBox={`0 0 ${VB_L} ${VB_H}`}
          className="mx-auto block w-full max-w-[560px]"
          role="img"
          aria-label={`Courbe des prix futures sur 24 mois. Spot ${fmtCurseur(spot)} dollars, portage net ${fmtPctSigne(portageNet)} par an : régime ${regime.label}. Futures à 12 mois : ${fmtNombre(f12, 2)} dollars. Roll yield annualisé d'une position longue rollée tous les 3 mois : ${fmtPctSigne(rollYield)}.`}
        >
          {/* Graduations verticales (prix) */}
          {ticksY.map(t => (
            <g key={t}>
              <line x1={M_GAUCHE} x2={M_GAUCHE + TRACE_L} y1={yVue(t)} y2={yVue(t)} stroke="var(--border)" strokeWidth={0.6} strokeDasharray="3 4" />
              <text x={M_GAUCHE - 6} y={yVue(t) + 3} textAnchor="end" fontSize={9} fill="var(--text-muted)">
                {fmtNombre(t, 0)} $
              </text>
            </g>
          ))}

          {/* Axe horizontal et graduations (mois) */}
          <line x1={M_GAUCHE} x2={M_GAUCHE + TRACE_L} y1={Y_BAS} y2={Y_BAS} stroke="var(--border)" strokeWidth={1.2} />
          {ticksX.map(t => (
            <g key={t}>
              <line x1={xVue(t)} x2={xVue(t)} y1={Y_BAS} y2={Y_BAS + 4} stroke="var(--border)" strokeWidth={1} />
              <text x={xVue(t)} y={Y_BAS + 15} textAnchor="middle" fontSize={9} fill="var(--text-muted)">
                {t}
              </text>
            </g>
          ))}
          <text x={M_GAUCHE + TRACE_L / 2} y={VB_H - 3} textAnchor="middle" fontSize={9.5} fill="var(--text-muted)">
            échéance (mois)
          </text>

          {/* Ligne du spot : la référence horizontale */}
          <line
            x1={M_GAUCHE}
            x2={M_GAUCHE + TRACE_L}
            y1={yVue(spot)}
            y2={yVue(spot)}
            stroke="var(--text-muted)"
            strokeWidth={1}
            strokeDasharray="2 4"
          />
          <text x={M_GAUCHE + 4} y={yVue(spot) - 4} fontSize={8.5} fill="var(--text-muted)">
            spot {fmtCurseur(spot)} $
          </text>

          {/* Courbe F(T), colorée selon le régime */}
          <path d={chemin} fill="none" stroke={regime.couleur} strokeWidth={2} strokeLinecap="round" />

          {/* Échéances rollées : un point tous les 3 mois */}
          {echeancesRoll.map(m => (
            <circle
              key={m}
              cx={xVue(m)}
              cy={yVue(prix(m))}
              r={3}
              fill="var(--surface)"
              stroke={regime.couleur}
              strokeWidth={1.6}
            />
          ))}
        </svg>
      </div>

      {/* Lecture : régime + portage net + F(12 m) + roll yield + message */}
      <div className="flex flex-wrap items-start gap-x-6 gap-y-3 border-t border-border px-4 py-3">
        <div>
          <p className="mb-1 text-[10px] uppercase tracking-wider text-text-muted">Régime</p>
          <span className={`inline-flex items-center rounded border px-1.5 py-px text-[11px] font-semibold tracking-wide ${regime.classeBadge}`}>
            {regime.label}
          </span>
        </div>
        <dl className="grid flex-1 grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
          <div>
            <dt className="text-[10px] uppercase tracking-wider text-text-muted">Portage net</dt>
            <dd className="tabular-nums text-[13px] font-semibold text-text">{fmtPctSigne(portageNet)} / an</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-wider text-text-muted">Futures 12 mois</dt>
            <dd className="tabular-nums text-[13px] font-semibold text-text">{fmtNombre(f12, 2)} $</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-wider text-text-muted">Roll yield annualisé (roll / 3 mois)</dt>
            <dd className="tabular-nums text-[13px] font-semibold" style={{ color: couleurRoll }}>
              {fmtPctSigne(rollYield)}
            </dd>
          </div>
        </dl>
        <p className="w-full text-[11px] leading-relaxed text-text-muted">{regime.phrase}</p>
      </div>
    </div>
  );
}
