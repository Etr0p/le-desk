import { useState } from 'react';
import {
  perteAttenduePct,
  spreadTheoriquePb,
  probaDefautCumuleePct,
} from '../../content/modules/05-credit/calculs';
import { useLangue } from '../../engine/useLangue';
import type { Langue } from '../../engine/types';

/* ── L'explorateur du spread de crédit (module 5) ───────────────────────
   Deux curseurs (probabilité de défaut annuelle, taux de recouvrement) et
   un horizon : le composant relie la formule centrale du module
   EL = PD × LGD ⇒ spread théorique, et trace la probabilité de défaut
   CUMULÉE (composition discrète (1 − PD)^n, via calculs.ts) contre le
   piège additif n × PD. HONNÊTETÉ PÉDAGOGIQUE : le « spread théorique »
   est le spread actuariel qui compense la seule perte attendue — les
   spreads observés sont systématiquement AU-DESSUS (prime de risque, de
   liquidité, fiscalité), et l'écran le rappelle en permanence.          */

const PD_MIN = 0.1;
const PD_MAX = 10;
const PD_DEFAUT = 2;
const PD_PAS = 0.1;
const REC_MIN = 0;
const REC_MAX = 80;
const REC_DEFAUT = 40;
const REC_PAS = 5;
const HOR_MIN = 1;
const HOR_MAX = 30;
const HOR_DEFAUT = 10;

/* Géométrie du SVG (unités viewBox). */
const VB_L = 400;
const VB_H = 190;
const M_G = 36;
const M_D = 14;
const M_H = 16;
const M_B = 26;
const TRACE_L = VB_L - M_G - M_D;
const TRACE_H = VB_H - M_H - M_B;

/* ── Textes d'interface FR/EN ── */
const TXT = {
  fr: {
    titre: 'PD × LGD : de la perte attendue au spread',
    sousTitre: 'défaut cumulé composé vs le piège additif',
    pd: 'Probabilité de défaut annuelle',
    rec: 'Taux de recouvrement',
    horizon: 'Horizon',
    ans: 'ans',
    an: 'an',
    el: 'Perte attendue (EL)',
    spread: 'Spread théorique',
    cumul: (n: string) => `Défaut cumulé à ${n} ans`,
    parAn: '/an',
    legendeCompose: 'défaut cumulé (composé)',
    legendeNaif: 'piège additif n × PD',
    lecture: 'Lecture',
    honnete:
      'Le spread théorique compense la SEULE perte attendue : les spreads observés sont systématiquement au-dessus (prime de risque — la perte réelle d\'une année est 0 ou −LGD, jamais −EL —, prime de liquidité, fiscalité). Un investment grade à PD 0,1 %/an « mérite » 6 pb et cote 80-120 pb : l\'écart EST la rémunération du stress.',
    msgIg: (spread: string, el: string) =>
      `Territoire investment grade : ${el} % de perte attendue par an, soit ${spread} pb de spread actuariel — presque rien. C\'est le paradoxe du crédit de qualité : on ne gagne pas grand-chose à avoir raison, on perd beaucoup à avoir tort. D\'où la prime : le marché paie 5 à 15 fois l\'EL sur ces signatures.`,
    msgHy: (spread: string, cumul: string, n: string) =>
      `Territoire high yield : le spread actuariel atteint ${spread} pb et le défaut cumulé ${cumul} % à ${n} ans. À ce niveau, le coupon N\'est PLUS du rendement : c\'est un remboursement anticipé de pertes quasi certaines — comparez toujours le rendement NET des défauts au sans-risque.`,
    msgDistressed: (cumul: string, n: string) =>
      `Territoire distressed : ${cumul} % de défaut cumulé à ${n} ans — le marché ne price plus « si » mais « quand et combien ». À ces niveaux, l\'obligation ne se lit plus en spread mais en PRIX (pourcentage du nominal), et la valeur se joue entièrement sur le recouvrement.`,
    msgEcart: (naif: string, compose: string, n: string) =>
      ` Le piège additif donnerait ${naif} % à ${n} ans ; la composition rend ${compose} % — il faut être vivant pour mourir, et l\'écart grandit avec l\'horizon.`,
    msgRecZero:
      ' Recouvrement 0 % : chaque défaut coûte tout le nominal — la LGD est maximale, le spread aussi. C\'est l\'hypothèse prudente des dettes subordonnées profondes.',
    msgRecHaut:
      ' Recouvrement élevé : même une PD forte coûte peu quand on récupère presque tout — c\'est toute la logique des dettes SÉCURISÉES (covered bonds, senior secured).',
  },
  en: {
    titre: 'PD × LGD: from expected loss to spread',
    sousTitre: 'compounded cumulative default vs the additive trap',
    pd: 'Annual default probability',
    rec: 'Recovery rate',
    horizon: 'Horizon',
    ans: 'years',
    an: 'year',
    el: 'Expected loss (EL)',
    spread: 'Actuarial spread',
    cumul: (n: string) => `Cumulative default over ${n} years`,
    parAn: '/yr',
    legendeCompose: 'cumulative default (compounded)',
    legendeNaif: 'additive trap n × PD',
    lecture: 'How to read this',
    honnete:
      'The actuarial spread compensates the expected loss ONLY: observed spreads sit systematically above it (risk premium — a single year\'s actual loss is 0 or −LGD, never −EL —, liquidity premium, taxes). An investment-grade name at 0.1%/yr PD "deserves" 6 bp and trades at 80-120 bp: the gap IS the price of stress.',
    msgIg: (spread: string, el: string) =>
      `Investment-grade territory: ${el}% expected loss per year, i.e. ${spread} bp of actuarial spread — almost nothing. That is the paradox of quality credit: you earn little by being right and lose a lot by being wrong. Hence the premium: the market pays 5 to 15 times EL on these names.`,
    msgHy: (spread: string, cumul: string, n: string) =>
      `High-yield territory: the actuarial spread reaches ${spread} bp and cumulative default ${cumul}% over ${n} years. At this level the coupon is NOT yield any more: it is an advance repayment of near-certain losses — always compare the default-NET yield to the risk-free rate.`,
    msgDistressed: (cumul: string, n: string) =>
      `Distressed territory: ${cumul}% cumulative default over ${n} years — the market no longer prices "if" but "when and how much". At these levels the bond is no longer quoted in spread but in PRICE (percent of par), and the whole value rides on recovery.`,
    msgEcart: (naif: string, compose: string, n: string) =>
      ` The additive trap would give ${naif}% over ${n} years; compounding gives ${compose}% — you must be alive to die, and the gap widens with the horizon.`,
    msgRecZero:
      ' Recovery 0%: every default costs the entire notional — LGD is maximal, so is the spread. That is the prudent assumption for deeply subordinated debt.',
    msgRecHaut:
      ' High recovery: even a large PD costs little when you get almost everything back — that is the whole logic of SECURED debt (covered bonds, senior secured).',
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
export function CreditSpreadExplorer() {
  const { langue } = useLangue();
  const L = TXT[langue];
  const [pdPct, setPdPct] = useState(PD_DEFAUT);
  const [recPct, setRecPct] = useState(REC_DEFAUT);
  const [horizon, setHorizon] = useState(HOR_DEFAUT);

  const el = perteAttenduePct(pdPct, recPct);
  const spread = spreadTheoriquePb(pdPct, recPct);
  const cumulHorizon = probaDefautCumuleePct(pdPct, horizon);
  const naifHorizon = Math.min(100, pdPct * horizon);

  /* ── Courbes année par année, bornées par le max affiché ── */
  const maxY = Math.max(10, Math.ceil(Math.max(cumulHorizon, naifHorizon) / 10) * 10);
  const xAn = (n: number) => M_G + (n / horizon) * TRACE_L;
  const yPct = (v: number) => M_H + TRACE_H * (1 - Math.min(v, maxY) / maxY);
  const pointsCompose = Array.from({ length: horizon + 1 }, (_, n) =>
    `${xAn(n)},${yPct(probaDefautCumuleePct(pdPct, n))}`).join(' ');
  const pointsNaif = `${xAn(0)},${yPct(0)} ${xAn(horizon)},${yPct(naifHorizon)}`;

  /* ── Message dynamique : territoire de spread + écart additif/composé ── */
  const ecart =
    naifHorizon - cumulHorizon >= 1
      ? L.msgEcart(fmtNombre(naifHorizon, 1, langue), fmtNombre(cumulHorizon, 1, langue), String(horizon))
      : '';
  const noteRec = recPct === 0 ? L.msgRecZero : recPct >= 70 ? L.msgRecHaut : '';
  const message =
    (spread < 100
      ? L.msgIg(fmtNombre(spread, 0, langue), fmtNombre(el, 2, langue))
      : spread < 400
        ? L.msgHy(fmtNombre(spread, 0, langue), fmtNombre(cumulHorizon, 1, langue), String(horizon))
        : L.msgDistressed(fmtNombre(cumulHorizon, 1, langue), String(horizon))) + ecart + noteRec;

  const curseurs: ReadonlyArray<{
    libelle: string;
    valeur: number;
    affichage: string;
    min: number;
    max: number;
    pas: number;
    surChange: (v: number) => void;
  }> = [
    { libelle: L.pd, valeur: pdPct, affichage: `${fmtNombre(pdPct, 1, langue)} %${L.parAn}`, min: PD_MIN, max: PD_MAX, pas: PD_PAS, surChange: setPdPct },
    { libelle: L.rec, valeur: recPct, affichage: `${fmtNombre(recPct, 0, langue)} %`, min: REC_MIN, max: REC_MAX, pas: REC_PAS, surChange: setRecPct },
    { libelle: L.horizon, valeur: horizon, affichage: `${horizon} ${horizon > 1 ? L.ans : L.an}`, min: HOR_MIN, max: HOR_MAX, pas: 1, surChange: setHorizon },
  ];

  const ariaGraphe =
    langue === 'fr'
      ? `Défaut cumulé sur ${horizon} ans à PD ${fmtNombre(pdPct, 1, langue)} % par an : ${fmtNombre(cumulHorizon, 1, langue)} % en composé contre ${fmtNombre(naifHorizon, 1, langue)} % en additif.`
      : `Cumulative default over ${horizon} years at ${fmtNombre(pdPct, 1, langue)}% annual PD: ${fmtNombre(cumulHorizon, 1, langue)}% compounded vs ${fmtNombre(naifHorizon, 1, langue)}% additive.`;

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
          <p className="text-[10px] uppercase tracking-wider text-text-muted">{L.el}</p>
          <p className="tabular-nums text-2xl font-semibold leading-tight text-text">
            {fmtNombre(el, 2, langue)} %{L.parAn}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-muted">{L.spread}</p>
          <p className="tabular-nums text-2xl font-semibold leading-tight text-accent">
            {fmtNombre(spread, 0, langue)} pb
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-muted">{L.cumul(String(horizon))}</p>
          <p className="tabular-nums text-2xl font-semibold leading-tight text-warn">
            {fmtNombre(cumulHorizon, 1, langue)} %
          </p>
        </div>
      </div>

      {/* Courbe : défaut cumulé composé vs droite additive */}
      <div className="px-2 pt-1">
        <svg viewBox={`0 0 ${VB_L} ${VB_H}`} className="block w-full" role="img" aria-label={ariaGraphe}>
          {/* Grille horizontale */}
          {[0, 0.25, 0.5, 0.75, 1].map(f => (
            <g key={f}>
              <line
                x1={M_G} x2={VB_L - M_D} y1={yPct(f * maxY)} y2={yPct(f * maxY)}
                stroke="var(--border)" strokeWidth={f === 0 ? 1.2 : 0.5}
                strokeDasharray={f === 0 ? undefined : '2 4'}
              />
              <text x={M_G - 5} y={yPct(f * maxY) + 2.5} textAnchor="end" fontSize={7.5} fill="var(--text-muted)" className="tabular-nums">
                {fmtNombre(f * maxY, 0, langue)}
              </text>
            </g>
          ))}
          {/* Axe des années */}
          {Array.from({ length: 4 }, (_, i) => Math.round(((i + 1) / 4) * horizon)).filter((v, i, a) => v > 0 && a.indexOf(v) === i).map(n => (
            <text key={n} x={xAn(n)} y={VB_H - M_B + 12} textAnchor="middle" fontSize={7.5} fill="var(--text-muted)" className="tabular-nums">
              {n}
            </text>
          ))}

          {/* Piège additif (droite pointillée) */}
          <polyline points={pointsNaif} fill="none" stroke="var(--err)" strokeWidth={1.2} strokeDasharray="5 4" opacity={0.8} />
          {/* Défaut cumulé composé */}
          <polyline points={pointsCompose} fill="none" stroke="var(--accent)" strokeWidth={2} />
          <circle cx={xAn(horizon)} cy={yPct(cumulHorizon)} r={3} fill="var(--accent)" />

          {/* Légende */}
          <g fontSize={7.5}>
            <line x1={M_G + 6} x2={M_G + 24} y1={M_H + 4} y2={M_H + 4} stroke="var(--accent)" strokeWidth={2} />
            <text x={M_G + 28} y={M_H + 6.5} fill="var(--text-muted)">{L.legendeCompose}</text>
            <line x1={M_G + 6} x2={M_G + 24} y1={M_H + 15} y2={M_H + 15} stroke="var(--err)" strokeWidth={1.2} strokeDasharray="5 4" />
            <text x={M_G + 28} y={M_H + 17.5} fill="var(--text-muted)">{L.legendeNaif}</text>
          </g>
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
