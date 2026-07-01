import { useEffect, useState } from 'react';
import {
  blackScholesCall,
  blackScholesPut,
  deltaCall,
  deltaPut,
  gammaOption,
  payoffCall,
  payoffPut,
  vegaOption,
} from '../../content/modules/08-options-volatilite/calculs';
import { useLangue } from '../../engine/useLangue';
import type { Langue } from '../../engine/types';
import { Button } from '../ui/Button';

/* ── Explorateur Black-Scholes & grecques (module 8, ch5) ───────────────
   Strike K = 100 et r = 5 % fixes (affichés) ; curseurs spot, volatilité
   et maturité. La courbe prix BS = f(spot) vient de blackScholesCall/Put,
   la valeur intrinsèque de payoffCall/payoffPut (le prix À l'échéance) —
   l'écart entre les deux EST la valeur temps, ombrée. Grecques au point
   courant : deltaCall/deltaPut, gammaOption, vegaOption (par point de
   vol), avec mini-jauges et phrase d'interprétation. Le thêta se VOIT :
   « Faire fondre le temps » réduit T pas à pas (interval react, état
   déterministe — aucun Date.now/Math.random dans le rendu) et la courbe
   s'affaisse vers le payoff ; la courbe de départ reste en fantôme.    */

const K = 100;
const R_PCT = 5;

const S_MIN = 60;
const S_MAX = 140;
const VOL_MIN = 5;
const VOL_MAX = 60;
const T_MIN = 0.05;
const T_MAX = 2;
const PAS_T = 0.05;
const PAS_FONTE_MS = 120;

/* Échelles fixes des mini-jauges (plafonnées à 100 %). */
const JAUGE_DELTA = 1;
const JAUGE_GAMMA = 0.1;
const JAUGE_VEGA = 0.8;

/* Géométrie du SVG (unités viewBox). */
const VB_L = 400;
const VB_H = 210;
const M_G = 40;
const M_D = 12;
const M_H = 16;
const M_B = 28;
const TRACE_L = VB_L - M_G - M_D;
const TRACE_H = VB_H - M_H - M_B;

type TypeOption = 'call' | 'put';

/* ── Textes d'interface FR/EN ── */
const TXT = {
  fr: {
    titre: 'Explorateur Black-Scholes & grecques',
    sousTitre: 'K = 100 fixe, r = 5 % fixe — modèle Black-Scholes',
    call: 'Call',
    put: 'Put',
    spot: 'Spot S',
    vol: 'Volatilité σ',
    maturite: 'Maturité T',
    an: 'an',
    ans: 'ans',
    fondre: 'Faire fondre le temps (θ)',
    fonteEnCours: 'Le temps fond…',
    prix: 'Prix BS',
    intrinseque: 'Valeur intrinsèque',
    valeurTemps: 'Valeur temps',
    axeX: 'spot du sous-jacent',
    axeY: 'prix de l’option',
    legPrix: 'prix BS aujourd’hui',
    legIntrinseque: 'valeur intrinsèque (payoff à l’échéance)',
    legFantome: 'courbe avant la fonte',
    legTemps: 'valeur temps (ombrée)',
    noteTheta:
      'Quand T fond vers 0, la courbe s’affaisse sur le payoff : l’écart qui disparaît est la valeur temps — son rythme d’érosion, c’est le thêta.',
    grecques: 'Grecques au point courant',
  },
  en: {
    titre: 'Black-Scholes & Greeks explorer',
    sousTitre: 'K = 100 fixed, r = 5% fixed — Black-Scholes model',
    call: 'Call',
    put: 'Put',
    spot: 'Spot S',
    vol: 'Volatility σ',
    maturite: 'Maturity T',
    an: 'yr',
    ans: 'yrs',
    fondre: 'Melt time away (θ)',
    fonteEnCours: 'Time is melting…',
    prix: 'BS price',
    intrinseque: 'Intrinsic value',
    valeurTemps: 'Time value',
    axeX: 'underlying spot',
    axeY: 'option price',
    legPrix: 'BS price today',
    legIntrinseque: 'intrinsic value (payoff at expiry)',
    legFantome: 'curve before the melt',
    legTemps: 'time value (shaded)',
    noteTheta:
      'As T melts towards 0, the curve sinks onto the payoff: the vanishing gap is the time value — its decay rate is theta.',
    grecques: 'Greeks at the current point',
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
export function GreeksExplorer() {
  const { langue } = useLangue();
  const L = TXT[langue];
  const [typeOption, setTypeOption] = useState<TypeOption>('call');
  const [spot, setSpot] = useState(100);
  const [volPct, setVolPct] = useState(20);
  const [maturite, setMaturite] = useState(1);
  const [enFonte, setEnFonte] = useState(false);
  const [tFantome, setTFantome] = useState<number | null>(null);

  /* La fonte du temps : T décroît pas à pas jusqu'à T_MIN. */
  useEffect(() => {
    if (!enFonte) return;
    const id = window.setInterval(() => {
      setMaturite(t => Math.max(T_MIN, Math.round((t - PAS_T) * 100) / 100));
    }, PAS_FONTE_MS);
    return () => window.clearInterval(id);
  }, [enFonte]);
  useEffect(() => {
    if (enFonte && maturite <= T_MIN + 1e-9) setEnFonte(false);
  }, [enFonte, maturite]);

  function basculerFonte() {
    if (enFonte) {
      setEnFonte(false);
    } else {
      setTFantome(maturite);
      setEnFonte(true);
    }
  }

  function changerMaturite(v: number) {
    setMaturite(v);
    setEnFonte(false);
    setTFantome(null);
  }

  const prixOption = (s: number, t: number) =>
    typeOption === 'call' ? blackScholesCall(s, K, R_PCT, volPct, t) : blackScholesPut(s, K, R_PCT, volPct, t);
  const intrinseque = (s: number) => (typeOption === 'call' ? payoffCall(s, K) : payoffPut(s, K));

  /* ── Valeurs au point courant ── */
  const prix = prixOption(spot, maturite);
  const intr = intrinseque(spot);
  const valeurTemps = prix - intr;
  const delta = typeOption === 'call'
    ? deltaCall(spot, K, R_PCT, volPct, maturite)
    : deltaPut(spot, K, R_PCT, volPct, maturite);
  const gamma = gammaOption(spot, K, R_PCT, volPct, maturite);
  const vega = vegaOption(spot, K, R_PCT, volPct, maturite);

  /* ── Échantillons des courbes (pas de 1 sur le spot) ── */
  const spots: number[] = [];
  for (let s = S_MIN; s <= S_MAX; s++) spots.push(s);
  const courbePrix = spots.map(s => prixOption(s, maturite));
  const courbeIntr = spots.map(s => intrinseque(s));
  const courbeFantome = tFantome !== null && tFantome > maturite + 1e-9 ? spots.map(s => prixOption(s, tFantome)) : null;

  let yHi = Math.max(...courbePrix, ...courbeIntr, ...(courbeFantome ?? [0]));
  if (yHi < 10) yHi = 10;
  yHi *= 1.12;

  const eX = (s: number) => M_G + ((s - S_MIN) / (S_MAX - S_MIN)) * TRACE_L;
  const eY = (v: number) => M_H + TRACE_H - (v / yHi) * TRACE_H;

  const chemin = (valeurs: number[]) =>
    valeurs.map((v, i) => `${i === 0 ? 'M' : 'L'} ${eX(spots[i]).toFixed(1)} ${eY(v).toFixed(1)}`).join(' ');

  /* Bande de la valeur temps : courbe BS aller, intrinsèque retour. */
  const cheminValeurTemps =
    chemin(courbePrix) +
    ' ' +
    [...spots].reverse().map((s, i) => `L ${eX(s).toFixed(1)} ${eY(courbeIntr[courbeIntr.length - 1 - i]).toFixed(1)}`).join(' ') +
    ' Z';

  const ticksX = [60, 80, 100, 120, 140];
  const pasYBrut = yHi / 4;
  const expY = Math.floor(Math.log10(pasYBrut));
  const baseY = pasYBrut / 10 ** expY;
  const pasY = (baseY <= 1 ? 1 : baseY <= 2 ? 2 : baseY <= 5 ? 5 : 10) * 10 ** expY;
  const ticksY: number[] = [];
  for (let v = 0; v <= yHi; v += pasY) ticksY.push(v);

  /* ── Grecques : jauges + phrases ── */
  const uniteT = maturite >= 2 ? L.ans : L.an;
  const fDelta = fmtNombre(delta, 2, langue);
  const fGamma = fmtNombre(gamma, 3, langue);
  const fVega = fmtNombre(vega, 2, langue);
  const phraseDelta =
    langue === 'fr'
      ? typeOption === 'call'
        ? `Delta ${fDelta} : le call gagne ≈ ${fDelta} si le sous-jacent prend 1 (et perd autant à la baisse).`
        : `Delta ${fDelta} : le put perd ≈ ${fmtNombre(Math.abs(delta), 2, langue)} si le sous-jacent prend 1 — il gagne quand le titre baisse.`
      : typeOption === 'call'
        ? `Delta ${fDelta}: the call gains ≈ ${fDelta} if the underlying rises by 1 (and loses as much on the way down).`
        : `Delta ${fDelta}: the put loses ≈ ${fmtNombre(Math.abs(delta), 2, langue)} if the underlying rises by 1 — it gains when the stock falls.`;
  const phraseGamma =
    langue === 'fr'
      ? `Gamma ${fGamma} : le delta bouge lui-même de ≈ ${fGamma} par point de sous-jacent — maximal autour du strike, près de l'échéance.`
      : `Gamma ${fGamma}: the delta itself moves by ≈ ${fGamma} per point of underlying — highest around the strike, near expiry.`;
  const phraseVega =
    langue === 'fr'
      ? `Vega ${fVega} : l'option prend ≈ ${fVega} si la volatilité passe de ${volPct} % à ${volPct + 1} %.`
      : `Vega ${fVega}: the option gains ≈ ${fVega} if volatility moves from ${volPct}% to ${volPct + 1}%.`;

  const jauges = [
    { nom: 'Delta', affichage: fmtNombre(delta, 4, langue), part: Math.min(1, Math.abs(delta) / JAUGE_DELTA), phrase: phraseDelta },
    { nom: 'Gamma', affichage: fmtNombre(gamma, 4, langue), part: Math.min(1, gamma / JAUGE_GAMMA), phrase: phraseGamma },
    { nom: 'Vega', affichage: fmtNombre(vega, 4, langue), part: Math.min(1, vega / JAUGE_VEGA), phrase: phraseVega },
  ];

  const curseurs: ReadonlyArray<{
    libelle: string;
    valeur: number;
    affichage: string;
    min: number;
    max: number;
    pas: number;
    surChange: (v: number) => void;
  }> = [
    { libelle: L.spot, valeur: spot, affichage: String(spot), min: S_MIN, max: S_MAX, pas: 1, surChange: setSpot },
    { libelle: L.vol, valeur: volPct, affichage: `${volPct} %`, min: VOL_MIN, max: VOL_MAX, pas: 1, surChange: setVolPct },
    { libelle: L.maturite, valeur: maturite, affichage: `${fmtNombre(maturite, 2, langue)} ${uniteT}`, min: T_MIN, max: T_MAX, pas: PAS_T, surChange: changerMaturite },
  ];

  const nomOption = typeOption === 'call' ? L.call : L.put;
  const ariaGraphe =
    langue === 'fr'
      ? `Prix Black-Scholes du ${nomOption.toLowerCase()} en fonction du spot, strike 100. Au spot ${spot} : prix ${fmtNombre(prix, 2, langue)}, valeur intrinsèque ${fmtNombre(intr, 2, langue)}, valeur temps ${fmtNombre(valeurTemps, 2, langue)}. Maturité ${fmtNombre(maturite, 2, langue)} ${uniteT}, volatilité ${volPct} %.`
      : `Black-Scholes price of the ${nomOption.toLowerCase()} as a function of spot, strike 100. At spot ${spot}: price ${fmtNombre(prix, 2, langue)}, intrinsic value ${fmtNombre(intr, 2, langue)}, time value ${fmtNombre(valeurTemps, 2, langue)}. Maturity ${fmtNombre(maturite, 2, langue)} ${uniteT}, volatility ${volPct}%.`;

  return (
    <div className="my-6 rounded-lg border border-border bg-surface">
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2.5">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">{L.titre}</p>
        <span className="text-[11px] text-text-muted">{L.sousTitre}</span>
      </div>

      {/* Call / put + fonte du temps */}
      <div className="flex flex-wrap items-center gap-2 px-4 pt-3">
        <Button variante={typeOption === 'call' ? 'primaire' : 'secondaire'} taille="sm" onClick={() => setTypeOption('call')} aria-pressed={typeOption === 'call'}>
          {L.call}
        </Button>
        <Button variante={typeOption === 'put' ? 'primaire' : 'secondaire'} taille="sm" onClick={() => setTypeOption('put')} aria-pressed={typeOption === 'put'}>
          {L.put}
        </Button>
        <Button variante="fantome" taille="sm" onClick={basculerFonte} aria-pressed={enFonte}>
          {enFonte ? L.fonteEnCours : L.fondre}
        </Button>
      </div>

      {/* Curseurs spot / vol / maturité */}
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

      {/* Graphe : prix BS vs spot, intrinsèque en pointillés, valeur temps ombrée */}
      <div className="px-2 pt-1">
        <svg viewBox={`0 0 ${VB_L} ${VB_H}`} className="block w-full" role="img" aria-label={ariaGraphe}>
          {/* Bande de la valeur temps */}
          <path d={cheminValeurTemps} fill="var(--accent)" opacity={0.1} />

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
                stroke="var(--border)" strokeWidth={s === K ? 0.9 : 0.5} strokeDasharray="2 5"
              />
              <text x={eX(s)} y={M_H + TRACE_H + 12} textAnchor="middle" fontSize={8.5} fill="var(--text-muted)">
                {s}
              </text>
            </g>
          ))}

          {/* Courbe fantôme : la maturité au départ de la fonte */}
          {courbeFantome && (
            <path d={chemin(courbeFantome)} fill="none" stroke="var(--text-muted)" strokeWidth={1.2} opacity={0.55} strokeDasharray="6 4" />
          )}

          {/* Valeur intrinsèque (= payoff à l'échéance) en pointillés */}
          <path d={chemin(courbeIntr)} fill="none" stroke="var(--text-muted)" strokeWidth={1.4} strokeDasharray="3 3" />

          {/* Courbe du prix BS */}
          <path d={chemin(courbePrix)} fill="none" stroke="var(--accent)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

          {/* Point courant : la valeur temps se lit sur le segment vertical */}
          <line x1={eX(spot)} x2={eX(spot)} y1={eY(intr)} y2={eY(prix)} stroke="var(--accent)" strokeWidth={1.4} strokeDasharray="2 2" />
          <circle cx={eX(spot)} cy={eY(prix)} r={3.8} fill="var(--accent)" stroke="var(--surface)" strokeWidth={1.4} />

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
          {L.legPrix}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 border-b border-dashed border-text-muted" aria-hidden="true" />
          {L.legIntrinseque}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: 'var(--accent)', opacity: 0.25 }} aria-hidden="true" />
          {L.legTemps}
        </span>
        {courbeFantome && (
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-0.5 w-4" style={{ backgroundColor: 'var(--text-muted)', opacity: 0.55 }} aria-hidden="true" />
            {L.legFantome}
          </span>
        )}
      </div>

      {/* Prix, intrinsèque, valeur temps */}
      <div className="flex flex-wrap items-end gap-x-6 gap-y-2 px-4 pt-2">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-muted">{L.prix} ({nomOption})</p>
          <p className="tabular-nums text-2xl font-semibold leading-tight text-accent">{fmtNombre(prix, 4, langue)}</p>
        </div>
        <dl className="grid grid-cols-2 gap-x-6">
          <div>
            <dt className="text-[10px] uppercase tracking-wider text-text-muted">{L.intrinseque}</dt>
            <dd className="tabular-nums text-[13px] font-semibold text-text">{fmtNombre(intr, 2, langue)}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-wider text-text-muted">{L.valeurTemps}</dt>
            <dd className="tabular-nums text-[13px] font-semibold text-text">{fmtNombre(valeurTemps, 2, langue)}</dd>
          </div>
        </dl>
      </div>
      <p className="px-4 pt-2 text-[11px] leading-relaxed text-text-muted">{L.noteTheta}</p>

      {/* Panneau des grecques */}
      <div className="border-t border-border px-4 py-3" aria-live="polite">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-text-muted">{L.grecques}</p>
        <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-3">
          {jauges.map(j => (
            <div key={j.nom}>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-xs font-semibold text-text">{j.nom}</span>
                <span className="tabular-nums text-[13px] font-semibold text-accent">{j.affichage}</span>
              </div>
              <div
                className="mt-1 h-2 overflow-hidden rounded-full bg-surface-2"
                role="img"
                aria-label={`${j.nom} : ${j.affichage}`}
              >
                <div
                  className="h-full rounded-full"
                  style={{ width: `${(j.part * 100).toFixed(1)}%`, backgroundColor: 'var(--accent)' }}
                />
              </div>
              <p className="mt-1.5 text-[11px] leading-relaxed text-text-muted">{j.phrase}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
