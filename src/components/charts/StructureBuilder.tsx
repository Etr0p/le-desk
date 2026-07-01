import { useState } from 'react';
import { blackScholesCall } from '../../content/modules/08-options-volatilite/calculs';
import {
  budgetOptions,
  participationCapitalGaranti,
  prixZeroCoupon,
} from '../../content/modules/09-produits-structures/calculs';
import { useLangue } from '../../engine/useLangue';
import type { Langue } from '../../engine/types';

/* ── Constructeur de capital garanti (module 9, ch2) ────────────────────
   Le client apporte 100 € ; le structureur achète le zéro-coupon qui
   garantit le nominal (prixZeroCoupon), prélève sa marge, et le reste —
   budgetOptions — achète des calls ATM valorisés par blackScholesCall du
   m8 (base 100). La participation = budget / call ATM vient de
   participationCapitalGaranti — AUCUNE formule recopiée. Affichage : la
   barre des 100 € décomposée, la participation, et le payoff client à
   maturité (100 garanti + participation × perf positive). Tout est
   dérivé à chaque rendu — aucun aléa.                                  */

const S0 = 100; // base 100 : le call ATM est pricé sur le niveau initial

const R_MIN = 1;
const R_MAX = 6;
const R_DEFAUT = 3;
const T_MIN = 2;
const T_MAX = 10;
const T_DEFAUT = 5;
const VOL_MIN = 10;
const VOL_MAX = 40;
const VOL_DEFAUT = 20;
const MARGE_MIN = 0;
const MARGE_MAX = 2;
const MARGE_DEFAUT = 1;

/* Fenêtre du payoff : niveau final du sous-jacent, base 100. */
const X_MIN = 40;
const X_MAX = 200;

/* Géométrie du SVG (unités viewBox). */
const VB_L = 400;
const VB_H = 200;
const M_G = 40;
const M_D = 12;
const M_H = 16;
const M_B = 28;
const TRACE_L = VB_L - M_G - M_D;
const TRACE_H = VB_H - M_H - M_B;

/* ── Textes d'interface FR/EN ── */
const TXT = {
  fr: {
    titre: 'Constructeur de capital garanti',
    sousTitre: 'Nominal 100 € — zéro-coupon + calls ATM (Black-Scholes)',
    r: 'Taux sans risque r',
    maturite: 'Maturité T',
    vol: 'Volatilité σ',
    marge: 'Marge du desk',
    an: 'an',
    ans: 'ans',
    barre: 'Où vont les 100 € du client',
    zc: 'Zéro-coupon',
    budget: 'Budget d’options',
    margeLeg: 'Marge',
    participation: 'Participation',
    callAtm: 'Call ATM',
    formule: 'budget ÷ call ATM',
    payoffTitre: 'Payoff client à maturité',
    axeX: 'niveau du sous-jacent à maturité (base 100)',
    axeY: 'remboursement',
    legProduit: 'produit structuré',
    legDirect: 'action détenue en direct',
    garanti: 'capital garanti : 100',
    delaHausse: 'de la hausse',
    lecture: 'Lecture',
    msgBudgetNul:
      'À ce niveau de taux, le zéro-coupon et la marge absorbent tout le nominal : plus un centime pour les options. Le capital garanti est infaisable — il faut allonger la maturité, rogner la marge… ou renoncer à la garantie.',
    msgTauxBas:
      'Taux bas ⇒ zéro-coupon cher (il faut presque 100 € aujourd’hui pour garantir 100 € demain) ⇒ budget d’options maigre ⇒ participation faible. C’est le monde post-2008 : le capital garanti y est devenu ingrat.',
    msgPartHaute:
      'Le budget approche le prix du call ATM : la participation frôle (ou dépasse) 100 % de la hausse — le luxe des taux élevés, des maturités longues et de la volatilité basse.',
    msgVolHaute:
      'Volatilité élevée ⇒ le call ATM coûte cher ⇒ chaque euro de budget achète moins de participation. C’est pour contourner ce mur que le structureur préfère alors VENDRE de la volatilité (reverse convertible, autocall).',
    msgDefaut:
      'La barre des 100 € est un jeu à somme nulle : chaque euro de marge ou de zéro-coupon en plus se paie en participation en moins. Le métier du structureur, c’est cet arbitrage.',
  },
  en: {
    titre: 'Capital-guaranteed note builder',
    sousTitre: '€100 notional — zero-coupon + ATM calls (Black-Scholes)',
    r: 'Risk-free rate r',
    maturite: 'Maturity T',
    vol: 'Volatility σ',
    marge: 'Desk margin',
    an: 'yr',
    ans: 'yrs',
    barre: 'Where the client’s €100 goes',
    zc: 'Zero-coupon',
    budget: 'Option budget',
    margeLeg: 'Margin',
    participation: 'Participation',
    callAtm: 'ATM call',
    formule: 'budget ÷ ATM call',
    payoffTitre: 'Client payoff at maturity',
    axeX: 'underlying level at maturity (base 100)',
    axeY: 'redemption',
    legProduit: 'structured product',
    legDirect: 'stock held outright',
    garanti: 'guaranteed capital: 100',
    delaHausse: 'of the upside',
    lecture: 'How to read this',
    msgBudgetNul:
      'At this rate level, the zero-coupon plus the margin swallow the whole notional: not a cent left for options. The guaranteed note is unfeasible — extend the maturity, trim the margin… or drop the guarantee.',
    msgTauxBas:
      'Low rates ⇒ expensive zero-coupon (you need almost €100 today to guarantee €100 tomorrow) ⇒ skinny option budget ⇒ weak participation. That is the post-2008 world: guaranteed notes became thankless.',
    msgPartHaute:
      'The budget nears the ATM call price: participation approaches (or exceeds) 100% of the upside — the luxury of high rates, long maturities and low volatility.',
    msgVolHaute:
      'High volatility ⇒ the ATM call is expensive ⇒ each euro of budget buys less participation. That wall is exactly why structurers then prefer to SELL volatility (reverse convertibles, autocalls).',
    msgDefaut:
      'The €100 bar is a zero-sum game: every extra euro of margin or zero-coupon is paid for in lost participation. The structurer’s job is that trade-off.',
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
export function StructureBuilder() {
  const { langue } = useLangue();
  const L = TXT[langue];
  const [rPct, setRPct] = useState(R_DEFAUT);
  const [tAnnees, setTAnnees] = useState(T_DEFAUT);
  const [volPct, setVolPct] = useState(VOL_DEFAUT);
  const [margePct, setMargePct] = useState(MARGE_DEFAUT);

  /* ── La chaîne du structureur : ZC → budget → participation ── */
  const zc = prixZeroCoupon(rPct, tAnnees);
  const budget = budgetOptions(zc, margePct);
  const prixCall = blackScholesCall(S0, S0, rPct, volPct, tAnnees);
  const participation = budget > 0 ? participationCapitalGaranti(budget, prixCall) : 0;
  const budgetAffiche = Math.max(0, budget);

  /* ── Payoff client à maturité : 100 garanti + participation × perf > 0 ── */
  const payoff = (sT: number) => 100 + participation * Math.max(sT - 100, 0);

  const yHi = Math.max(200, payoff(X_MAX)) * 1.08;
  const eX = (s: number) => M_G + ((s - X_MIN) / (X_MAX - X_MIN)) * TRACE_L;
  const eY = (v: number) => M_H + TRACE_H - (v / yHi) * TRACE_H;

  const cheminPayoff =
    `M ${eX(X_MIN).toFixed(1)} ${eY(100).toFixed(1)} ` +
    `L ${eX(100).toFixed(1)} ${eY(100).toFixed(1)} ` +
    `L ${eX(X_MAX).toFixed(1)} ${eY(payoff(X_MAX)).toFixed(1)}`;
  const cheminDirect = `M ${eX(X_MIN).toFixed(1)} ${eY(X_MIN).toFixed(1)} L ${eX(X_MAX).toFixed(1)} ${eY(X_MAX).toFixed(1)}`;

  const ticksX = [50, 100, 150, 200];
  const ticksY: number[] = [];
  for (let v = 0; v <= yHi; v += 50) ticksY.push(v);

  /* ── Message pédagogique dynamique (le premier qui s'applique) ── */
  const message =
    budget <= 0 ? L.msgBudgetNul
    : rPct <= 2 ? L.msgTauxBas
    : participation >= 0.9 ? L.msgPartHaute
    : volPct >= 30 ? L.msgVolHaute
    : L.msgDefaut;

  /* ── Barre des 100 € : segments en % du nominal ── */
  const segments = [
    { cle: 'zc', libelle: L.zc, valeur: zc, couleur: 'var(--accent)', opacite: 0.85 },
    { cle: 'budget', libelle: L.budget, valeur: budgetAffiche, couleur: 'var(--ok)', opacite: 0.85 },
    { cle: 'marge', libelle: L.margeLeg, valeur: margePct, couleur: 'var(--err)', opacite: 0.75 },
  ] as const;

  const curseurs: ReadonlyArray<{
    libelle: string;
    valeur: number;
    affichage: string;
    min: number;
    max: number;
    pas: number;
    surChange: (v: number) => void;
  }> = [
    { libelle: L.r, valeur: rPct, affichage: `${fmtNombre(rPct, 2, langue)} %`, min: R_MIN, max: R_MAX, pas: 0.25, surChange: setRPct },
    { libelle: L.maturite, valeur: tAnnees, affichage: `${tAnnees} ${tAnnees >= 2 ? L.ans : L.an}`, min: T_MIN, max: T_MAX, pas: 1, surChange: setTAnnees },
    { libelle: L.vol, valeur: volPct, affichage: `${volPct} %`, min: VOL_MIN, max: VOL_MAX, pas: 1, surChange: setVolPct },
    { libelle: L.marge, valeur: margePct, affichage: `${fmtNombre(margePct, 1, langue)} %`, min: MARGE_MIN, max: MARGE_MAX, pas: 0.1, surChange: setMargePct },
  ];

  const fPart = fmtNombre(participation * 100, 1, langue);
  const ariaGraphe =
    langue === 'fr'
      ? `Payoff du produit à maturité : 100 garanti sous le niveau initial, puis ${fPart} % de la hausse au-delà. Comparé à l'action détenue en direct (diagonale).`
      : `Product payoff at maturity: 100 guaranteed below the initial level, then ${fPart}% of the upside beyond. Compared with the stock held outright (diagonal).`;
  const ariaBarre =
    langue === 'fr'
      ? `Décomposition des 100 € : zéro-coupon ${fmtNombre(zc, 1, langue)}, budget d'options ${fmtNombre(budgetAffiche, 1, langue)}, marge ${fmtNombre(margePct, 1, langue)}.`
      : `Breakdown of the €100: zero-coupon ${fmtNombre(zc, 1, langue)}, option budget ${fmtNombre(budgetAffiche, 1, langue)}, margin ${fmtNombre(margePct, 1, langue)}.`;

  return (
    <div className="my-6 rounded-lg border border-border bg-surface">
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2.5">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">{L.titre}</p>
        <span className="text-[11px] text-text-muted">{L.sousTitre}</span>
      </div>

      {/* Curseurs r / T / vol / marge */}
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
              aria-label={`${c.libelle} : ${c.affichage}`}
            />
          </label>
        ))}
      </div>

      {/* La barre des 100 € */}
      <div className="px-4 pt-4">
        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-text-muted">{L.barre}</p>
        <div
          className="flex h-8 w-full overflow-hidden rounded-md border border-border bg-surface-2"
          role="img"
          aria-label={ariaBarre}
        >
          {segments.map(s => (
            <div
              key={s.cle}
              className="flex h-full items-center justify-center transition-[width] duration-150"
              style={{ width: `${Math.max(0, s.valeur)}%`, backgroundColor: s.couleur, opacity: s.opacite }}
              title={`${s.libelle} : ${fmtNombre(s.valeur, 2, langue)} €`}
            >
              {s.valeur >= 12 && (
                <span className="tabular-nums text-[11px] font-semibold text-bg">{fmtNombre(s.valeur, 1, langue)}</span>
              )}
            </div>
          ))}
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-5 gap-y-1 text-[11px] text-text-muted">
          {segments.map(s => (
            <span key={s.cle} className="inline-flex items-center gap-1.5 tabular-nums">
              <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: s.couleur, opacity: s.opacite }} aria-hidden="true" />
              {s.libelle} : {fmtNombre(s.valeur, 2, langue)} €
            </span>
          ))}
        </div>
      </div>

      {/* Participation : le chiffre-clé et sa formule */}
      <div className="flex flex-wrap items-end gap-x-6 gap-y-2 px-4 pt-3" aria-live="polite">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-muted">{L.participation}</p>
          <p className="tabular-nums text-2xl font-semibold leading-tight text-accent">{fPart} %</p>
        </div>
        <dl className="grid grid-cols-2 gap-x-6">
          <div>
            <dt className="text-[10px] uppercase tracking-wider text-text-muted">{L.callAtm} ({tAnnees} {tAnnees >= 2 ? L.ans : L.an})</dt>
            <dd className="tabular-nums text-[13px] font-semibold text-text">{fmtNombre(prixCall, 2, langue)}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-wider text-text-muted">{L.formule}</dt>
            <dd className="tabular-nums text-[13px] font-semibold text-text">
              {fmtNombre(budgetAffiche, 2, langue)} ÷ {fmtNombre(prixCall, 2, langue)}
            </dd>
          </div>
        </dl>
      </div>

      {/* Payoff client à maturité */}
      <div className="px-2 pt-1">
        <svg viewBox={`0 0 ${VB_L} ${VB_H}`} className="block w-full" role="img" aria-label={ariaGraphe}>
          {/* Grille */}
          {ticksY.map(v => (
            <g key={v}>
              <line
                x1={M_G} x2={M_G + TRACE_L} y1={eY(v)} y2={eY(v)}
                stroke="var(--border)" strokeWidth={v === 0 ? 1.2 : 0.6}
                strokeDasharray={v === 0 ? undefined : '3 4'}
              />
              <text x={M_G - 5} y={eY(v) + 3} textAnchor="end" fontSize={8.5} fill="var(--text-muted)">
                {fmtNombre(v, 0, langue)}
              </text>
            </g>
          ))}
          {ticksX.map(s => (
            <g key={s}>
              <line
                x1={eX(s)} x2={eX(s)} y1={M_H} y2={M_H + TRACE_H}
                stroke="var(--border)" strokeWidth={s === 100 ? 0.9 : 0.5} strokeDasharray="2 5"
              />
              <text x={eX(s)} y={M_H + TRACE_H + 12} textAnchor="middle" fontSize={8.5} fill="var(--text-muted)">
                {s}
              </text>
            </g>
          ))}

          {/* Action en direct (diagonale) */}
          <path d={cheminDirect} fill="none" stroke="var(--text-muted)" strokeWidth={1.3} strokeDasharray="4 4" opacity={0.8} />

          {/* Payoff du produit : plancher garanti puis pente = participation */}
          <path d={cheminPayoff} fill="none" stroke="var(--accent)" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />

          {/* Annotations : plancher et pente */}
          <text x={eX(68)} y={eY(100) - 5} textAnchor="middle" fontSize={8} fontWeight={600} fill="var(--accent)">
            {L.garanti}
          </text>
          <text
            x={eX(152)}
            y={eY(payoff(152)) - 7}
            textAnchor="middle"
            fontSize={8}
            fontWeight={600}
            fill="var(--accent)"
          >
            {fPart} % {L.delaHausse}
          </text>

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
          <span className="inline-block h-0.5 w-4" style={{ backgroundColor: 'var(--accent)' }} aria-hidden="true" />
          {L.legProduit}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 border-b border-dashed border-text-muted" aria-hidden="true" />
          {L.legDirect}
        </span>
      </div>

      {/* Lecture pédagogique dynamique */}
      <div className="border-t border-border px-4 py-3" aria-live="polite">
        <p className="text-[11px] leading-relaxed text-text-muted">
          <strong className="text-text">{L.lecture} :</strong> {message}
        </p>
      </div>
    </div>
  );
}
