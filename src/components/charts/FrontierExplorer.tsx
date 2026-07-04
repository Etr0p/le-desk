import { useState } from 'react';
import {
  rendementPortefeuille2Actifs,
  volatilitePortefeuille2Actifs,
} from '../../content/modules/12-gestion-actifs-risques/calculs';
import { useLangue } from '../../engine/useLangue';
import type { Langue } from '../../engine/types';

/* ── La frontière à deux actifs (module 12) ─────────────────────────────
   Deux actifs (A « actions » : 8 % de rendement espéré ; B « obligations » :
   3 %), trois curseurs (corrélation, vol de A, vol de B) : le composant
   trace dans le plan risque/rendement la courbe décrite par le portefeuille
   quand le poids de A va de 0 à 100 % — la frontière de Markowitz à deux
   actifs, calculée point par point par calculs.ts. Le point de variance
   minimale est marqué. HONNÊTETÉ PÉDAGOGIQUE : rendements espérés,
   volatilités et corrélation sont supposés CONNUS et STABLES — dans la
   réalité ils s'estiment mal et bougent (surtout ρ, qui monte vers 1 dans
   les crises, renvoi m11) : c'est la limite pratique de Markowitz brut. */

const R_A = 8; // rendement espéré de l'actif A (%), fixe
const R_B = 3; // rendement espéré de l'actif B (%), fixe
const RHO_MIN = -1;
const RHO_MAX = 1;
const RHO_DEFAUT = 0.3;
const RHO_PAS = 0.1;
const VOLA_MIN = 10;
const VOLA_MAX = 40;
const VOLA_DEFAUT = 20;
const VOLB_MIN = 5;
const VOLB_MAX = 20;
const VOLB_DEFAUT = 10;

/* Géométrie du SVG (unités viewBox). */
const VB_L = 400;
const VB_H = 200;
const M_G = 40;
const M_D = 16;
const M_H = 14;
const M_B = 30;
const TRACE_L = VB_L - M_G - M_D;
const TRACE_H = VB_H - M_H - M_B;

/* ── Textes d'interface FR/EN ── */
const TXT = {
  fr: {
    titre: 'La frontière à deux actifs',
    sousTitre: 'le seul repas gratuit de la finance',
    rho: 'Corrélation A/B',
    volA: 'Volatilité de A (actions, 8 %)',
    volB: 'Volatilité de B (obligations, 3 %)',
    volMin: 'Vol minimale atteignable',
    volNaive: 'Moyenne pondérée (50/50)',
    axeX: 'Volatilité (%)',
    axeY: 'Rendement (%)',
    pointMin: 'variance minimale',
    lecture: 'Lecture',
    honnete:
      'Rendements espérés, volatilités et corrélation sont supposés connus et stables. En réalité, ils s\'estiment mal (surtout les rendements espérés) et bougent — la corrélation, en particulier, monte vers 1 précisément dans les crises (module 11). C\'est la limite pratique de Markowitz brut, et la raison pour laquelle on l\'utilise comme cadre de pensée plus que comme recette.',
    msgDroite:
      'À ρ = 1, la « frontière » est une DROITE : la volatilité du portefeuille est exactement la moyenne pondérée des volatilités, la diversification ne retire rien. Deux actifs parfaitement corrélés sont un seul actif déguisé — le nombre de lignes ne diversifie pas, c\'est la corrélation qui compte.',
    msgCourbe: (volMin: string, naive: string) =>
      `La courbe BOMBE vers la gauche : en mélangeant, on obtient des portefeuilles MOINS volatils que la moyenne pondérée de leurs composants (point de variance minimale : ${volMin} %, contre ${naive} % pour la moyenne 50/50). Ce déplacement vers la gauche est gratuit — aucun rendement n\'a été sacrifié. C\'est le seul repas gratuit de la finance, et il se paie en corrélation.`,
    msgParfaite: (volMin: string) =>
      `À ρ = −1, la couverture parfaite existe : un choix de poids annule TOUTE la volatilité (le minimum affiché est ${volMin} %). C\'est exactement ce que fait une couverture : ajouter un actif corrélé à −1 (un future vendu, module 7) pour éteindre le risque. La frontière touche l\'axe vertical — du rendement sans risque de prix.`,
  },
  en: {
    titre: 'The two-asset frontier',
    sousTitre: 'the only free lunch in finance',
    rho: 'A/B correlation',
    volA: 'Volatility of A (equities, 8%)',
    volB: 'Volatility of B (bonds, 3%)',
    volMin: 'Lowest reachable volatility',
    volNaive: 'Weighted average (50/50)',
    axeX: 'Volatility (%)',
    axeY: 'Return (%)',
    pointMin: 'minimum variance',
    lecture: 'How to read this',
    honnete:
      'Expected returns, volatilities and correlation are assumed known and stable. In reality they are poorly estimated (expected returns above all) and they move — correlation, in particular, rises toward 1 precisely in crises (module 11). That is the practical limit of raw Markowitz, and why it is used as a thinking frame more than a recipe.',
    msgDroite:
      'At ρ = 1, the "frontier" is a STRAIGHT LINE: portfolio volatility is exactly the weighted average of the components\', diversification removes nothing. Two perfectly correlated assets are one asset in disguise — the number of lines does not diversify, correlation does.',
    msgCourbe: (volMin: string, naive: string) =>
      `The curve BULGES to the left: by mixing, you obtain portfolios LESS volatile than the weighted average of their components (minimum-variance point: ${volMin}%, against ${naive}% for the 50/50 average). That leftward shift is free — no return was sacrificed. It is the only free lunch in finance, and it is paid in correlation.`,
    msgParfaite: (volMin: string) =>
      `At ρ = −1, the perfect hedge exists: one choice of weights kills ALL volatility (the displayed minimum is ${volMin}%). That is exactly what a hedge does: add an asset correlated at −1 (a sold future, module 7) to extinguish risk. The frontier touches the vertical axis — return without price risk.`,
  },
} as const;

/* ── Format : virgule décimale en FR, point en EN ── */
function fmtNombre(v: number, dec: number, langue: Langue): string {
  const arrondiNul = Math.abs(v) < 0.5 * 10 ** -dec;
  const abs = Math.abs(v).toFixed(dec);
  const txt = langue === 'fr' ? abs.replace('.', ',') : abs;
  return (v < 0 && !arrondiNul ? '−' : '') + txt;
}

/* ── Composant ── */
export function FrontierExplorer() {
  const { langue } = useLangue();
  const L = TXT[langue];
  const [rho, setRho] = useState(RHO_DEFAUT);
  const [volA, setVolA] = useState(VOLA_DEFAUT);
  const [volB, setVolB] = useState(VOLB_DEFAUT);

  /* Courbe : poids de A de 0 à 100 % par pas de 2 %. */
  const points = Array.from({ length: 51 }, (_, i) => {
    const w = i * 2;
    return {
      w,
      vol: volatilitePortefeuille2Actifs(w, volA, volB, rho),
      rendement: rendementPortefeuille2Actifs(w, R_A, R_B),
    };
  });
  const pMin = points.reduce((a, p) => (p.vol < a.vol ? p : a), points[0]);
  const volNaive5050 = 0.5 * volA + 0.5 * volB;

  /* Échelles : x = vol (0 → max), y = rendement (2 → 9). */
  const volMax = Math.max(volA, volB) * 1.08;
  const xVol = (v: number) => M_G + (v / volMax) * TRACE_L;
  const yRdt = (r: number) => M_H + TRACE_H * (1 - (r - 2) / (9 - 2));
  const chemin = points.map(p => `${xVol(p.vol)},${yRdt(p.rendement)}`).join(' ');

  const message =
    rho >= 0.999
      ? L.msgDroite
      : rho <= -0.999
        ? L.msgParfaite(fmtNombre(pMin.vol, 1, langue))
        : L.msgCourbe(fmtNombre(pMin.vol, 1, langue), fmtNombre(volatilitePortefeuille2Actifs(50, volA, volB, rho), 1, langue) === '' ? '' : fmtNombre(volNaive5050, 1, langue));

  const curseurs: ReadonlyArray<{
    libelle: string;
    valeur: number;
    affichage: string;
    min: number;
    max: number;
    pas: number;
    surChange: (v: number) => void;
  }> = [
    { libelle: L.rho, valeur: rho, affichage: fmtNombre(rho, 1, langue), min: RHO_MIN, max: RHO_MAX, pas: RHO_PAS, surChange: setRho },
    { libelle: L.volA, valeur: volA, affichage: `${fmtNombre(volA, 0, langue)} %`, min: VOLA_MIN, max: VOLA_MAX, pas: 1, surChange: setVolA },
    { libelle: L.volB, valeur: volB, affichage: `${fmtNombre(volB, 0, langue)} %`, min: VOLB_MIN, max: VOLB_MAX, pas: 1, surChange: setVolB },
  ];

  const ariaGraphe =
    langue === 'fr'
      ? `Frontière risque-rendement à corrélation ${fmtNombre(rho, 1, langue)} : volatilité minimale ${fmtNombre(pMin.vol, 1, langue)} % pour ${fmtNombre(pMin.rendement, 1, langue)} % de rendement.`
      : `Risk-return frontier at correlation ${fmtNombre(rho, 1, langue)}: minimum volatility ${fmtNombre(pMin.vol, 1, langue)}% for a ${fmtNombre(pMin.rendement, 1, langue)}% return.`;

  return (
    <div className="my-6 rounded-lg border border-border bg-surface">
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2.5">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">{L.titre}</p>
        <span className="text-[11px] text-text-muted">{L.sousTitre}</span>
      </div>

      {/* Curseurs */}
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
              aria-label={`${c.libelle} : ${c.affichage}`}
            />
          </label>
        ))}
      </div>

      {/* Chiffres clés */}
      <div className="flex flex-wrap items-end gap-x-6 gap-y-2 px-4 pt-3" aria-live="polite">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-muted">{L.volMin}</p>
          <p className="tabular-nums text-2xl font-semibold leading-tight text-accent">
            {fmtNombre(pMin.vol, 1, langue)} %
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-muted">{L.volNaive}</p>
          <p className="tabular-nums text-2xl font-semibold leading-tight text-text-muted">
            {fmtNombre(volNaive5050, 1, langue)} %
          </p>
        </div>
      </div>

      {/* Courbe risque/rendement */}
      <div className="px-2 pt-1">
        <svg viewBox={`0 0 ${VB_L} ${VB_H}`} className="block w-full" role="img" aria-label={ariaGraphe}>
          {/* Grilles */}
          {[3, 5, 7, 9].map(r => (
            <g key={r}>
              <line x1={M_G} x2={VB_L - M_D} y1={yRdt(r)} y2={yRdt(r)} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="2 4" />
              <text x={M_G - 5} y={yRdt(r) + 2.5} textAnchor="end" fontSize={7.5} fill="var(--text-muted)" className="tabular-nums">{r}</text>
            </g>
          ))}
          {[0, 0.25, 0.5, 0.75, 1].map(f => (
            <text key={f} x={xVol(f * volMax)} y={VB_H - M_B + 12} textAnchor="middle" fontSize={7.5} fill="var(--text-muted)" className="tabular-nums">
              {fmtNombre(f * volMax, 0, langue)}
            </text>
          ))}
          <line x1={M_G} x2={VB_L - M_D} y1={yRdt(2)} y2={yRdt(2)} stroke="var(--border)" strokeWidth={1.2} />
          <line x1={M_G} x2={M_G} y1={M_H} y2={yRdt(2)} stroke="var(--border)" strokeWidth={1.2} />
          <text x={VB_L - M_D} y={VB_H - M_B + 22} textAnchor="end" fontSize={7} fill="var(--text-muted)">{L.axeX}</text>
          <text x={M_G + 4} y={M_H + 2} fontSize={7} fill="var(--text-muted)">{L.axeY}</text>

          {/* Segment naïf A-B (moyenne pondérée, référence pointillée) */}
          <line
            x1={xVol(volB)} y1={yRdt(R_B)} x2={xVol(volA)} y2={yRdt(R_A)}
            stroke="var(--text-muted)" strokeWidth={0.75} strokeDasharray="4 3" opacity={0.5}
          />
          {/* La frontière */}
          <polyline points={chemin} fill="none" stroke="var(--accent)" strokeWidth={2} />
          {/* Actifs purs */}
          <circle cx={xVol(volA)} cy={yRdt(R_A)} r={3} fill="var(--text)" />
          <text x={xVol(volA) + 6} y={yRdt(R_A) + 3} fontSize={8} fontWeight={600} fill="var(--text)">A</text>
          <circle cx={xVol(volB)} cy={yRdt(R_B)} r={3} fill="var(--text)" />
          <text x={xVol(volB) + 6} y={yRdt(R_B) + 3} fontSize={8} fontWeight={600} fill="var(--text)">B</text>
          {/* Point de variance minimale */}
          <circle cx={xVol(pMin.vol)} cy={yRdt(pMin.rendement)} r={4} fill="var(--warn)" />
          <text x={xVol(pMin.vol) - 6} y={yRdt(pMin.rendement) - 6} textAnchor="end" fontSize={7.5} fontWeight={600} fill="var(--warn)">
            {L.pointMin}
          </text>
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
