import { useState } from 'react';
import { forwardFx, pointsDeTerme } from '../../content/modules/06-change-commos-crypto/calculs';
import { Button } from '../ui/Button';
import { NumericInput } from '../ui/NumericInput';

/* ── Explorateur du change à terme (parité couverte des taux) ───────────
   Convention BASE/COTÉE de calculs.ts : EUR/USD = 1,10 ⇒ 1 EUR (base)
   vaut 1,10 USD (cotée). F = S × (1 + r_cotée·T)/(1 + r_base·T), en
   linéaire simple — forwardFx() et pointsDeTerme() sont importés, jamais
   recopiés. Le graphe trace F en fonction de l'horizon (trajectoire du
   report/déport) ; le panneau du bas déroule l'arbitrage CIP dès que le
   forward coté saisi s'écarte du forward théorique de plus de 0,5 pip. */

const SPOT_MIN = 1.0;
const SPOT_MAX = 1.25;
const SPOT_PAS = 0.01;
const TAUX_MIN = 0;
const TAUX_MAX = 6;
const TAUX_PAS = 0.25;
const T_MIN = 0.25;
const T_MAX = 2;
const T_PAS = 0.25;

/* Notionnel de référence du panneau d'arbitrage : 1 million emprunté. */
const NOTIONNEL = 1_000_000;
/* En deçà de 0,5 pip d'écart, on considère le forward coté « au prix CIP ». */
const TOL_PIPS = 0.5;

const N_ECH = 80;

/* Géométrie du viewBox (unités SVG). */
const VB_L = 420;
const VB_H = 240;
const M_GAUCHE = 58;
const M_DROITE = 16;
const M_HAUT = 20;
const M_BAS = 32;
const TRACE_L = VB_L - M_GAUCHE - M_DROITE;
const TRACE_H = VB_H - M_HAUT - M_BAS;
const Y_BAS = M_HAUT + TRACE_H;
/* Amplitude verticale minimale du graphe : 40 pips, pour que le cas
   « différentiel nul » (courbe plate) reste lisible. */
const SPAN_MIN = 0.004;

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

/** Cours de change : 4 décimales (1,1214). */
function fmtCours(v: number): string {
  return fmtNombre(v, 4);
}

/** Montants du panneau d'arbitrage : entiers, séparés par des espaces. */
function fmtMontant(v: number, devise: string): string {
  return fmtNombre(v, 0) + ' ' + devise;
}

/** Points de terme : signe explicite, 1 décimale. */
function fmtPips(v: number): string {
  return (v > 0 ? '+' : '') + fmtNombre(v, 1) + ' pips';
}

/** Valeurs de curseur : 5 → « 5 », 0,25 → « 0,25 ». */
function fmtCurseur(v: number): string {
  return v.toFixed(2).replace(/\.?0+$/, '').replace('.', ',');
}

/** Horizon : 0,5 → « 6 mois », 1 → « 1 an », 2 → « 2 ans ». */
function fmtHorizon(t: number): string {
  if (Number.isInteger(t)) return t === 1 ? '1 an' : `${t} ans`;
  return `${Math.round(t * 12)} mois`;
}

/** Saisie libre (virgule ou point) → nombre strictement positif, ou null. */
function parseCours(s: string): number | null {
  const brut = s.trim().replace(/\s/g, '').replace(',', '.');
  if (brut === '') return null;
  const v = Number(brut);
  return Number.isFinite(v) && v > 0 ? v : null;
}

interface Preset {
  label: string;
  spot: number;
  rUsd: number;
  rEur: number;
  horizon: number;
}

const PRESETS: ReadonlyArray<Preset> = [
  { label: 'Différentiel nul', spot: 1.1, rUsd: 3, rEur: 3, horizon: 1 },
  { label: 'USD rémunère plus', spot: 1.1, rUsd: 5, rEur: 3, horizon: 1 },
  { label: 'Crise : EUR rémunère plus', spot: 1.05, rUsd: 0.5, rEur: 3.5, horizon: 1 },
];

/* ── Composant ── */
export function ForwardFxExplorer() {
  /* Valeurs initiales = l'exemple canonique du chapitre :
     forwardFx(1,10, 5, 3, 1) = 1,1214, soit +213,6 pips de report. */
  const [spot, setSpot] = useState(1.1);
  const [rUsd, setRUsd] = useState(5);
  const [rEur, setREur] = useState(3);
  const [horizon, setHorizon] = useState(1);
  const [saisieFwd, setSaisieFwd] = useState('');

  /* EUR/USD : la devise COTÉE est le dollar, la devise de BASE l'euro. */
  const fTheo = forwardFx(spot, rUsd, rEur, horizon);
  const points = pointsDeTerme(spot, fTheo);
  const regime: 'report' | 'deport' | 'nul' =
    points > TOL_PIPS ? 'report' : points < -TOL_PIPS ? 'deport' : 'nul';

  /* ── Panneau d'arbitrage ── */
  const fMarche = parseCours(saisieFwd);
  const saisieInvalide = saisieFwd.trim() !== '' && fMarche === null;
  const ecartPips = fMarche === null ? null : pointsDeTerme(fTheo, fMarche);

  /* ── Échelles du graphe F(T), T de 0 à 2 ans ── */
  const echantillons = Array.from({ length: N_ECH + 1 }, (_, i) => {
    const t = (i * T_MAX) / N_ECH;
    return { t, f: forwardFx(spot, rUsd, rEur, t) };
  });
  let vMin = spot;
  let vMax = spot;
  for (const e of echantillons) {
    if (e.f < vMin) vMin = e.f;
    if (e.f > vMax) vMax = e.f;
  }
  /* Le forward coté entre dans le cadre s'il reste à distance raisonnable. */
  const marqueurMarche = fMarche !== null && Math.abs(fMarche - spot) <= 0.08;
  if (fMarche !== null && marqueurMarche) {
    vMin = Math.min(vMin, fMarche);
    vMax = Math.max(vMax, fMarche);
  }
  if (vMax - vMin < SPAN_MIN) {
    const centre = (vMin + vMax) / 2;
    vMin = centre - SPAN_MIN / 2;
    vMax = centre + SPAN_MIN / 2;
  }
  const marge = (vMax - vMin) * 0.18;
  const yLo = vMin - marge;
  const yHi = vMax + marge;

  function xVue(t: number): number {
    return M_GAUCHE + (t / T_MAX) * TRACE_L;
  }
  function yVue(v: number): number {
    return Y_BAS - ((v - yLo) / (yHi - yLo)) * TRACE_H;
  }

  const chemin = echantillons
    .map((e, i) => `${i === 0 ? 'M' : 'L'} ${xVue(e.t).toFixed(1)} ${yVue(e.f).toFixed(1)}`)
    .join(' ');

  /* Graduations. */
  const pasTickY = pasRond((yHi - yLo) / 4);
  const ticksY: number[] = [];
  for (let v = Math.ceil(yLo / pasTickY) * pasTickY; v <= yHi + 1e-9; v += pasTickY) ticksY.push(v);
  const ticksX = [0.5, 1, 1.5, 2];

  const fFin = echantillons[N_ECH].f;
  const couleurRegime = regime === 'deport' ? 'var(--warn)' : 'var(--accent)';

  function appliquerPreset(p: Preset) {
    setSpot(p.spot);
    setRUsd(p.rUsd);
    setREur(p.rEur);
    setHorizon(p.horizon);
    setSaisieFwd('');
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
    { libelle: 'Spot EUR/USD', valeur: spot, affichage: fmtCours(spot), min: SPOT_MIN, max: SPOT_MAX, pas: SPOT_PAS, surChange: setSpot },
    { libelle: 'Taux USD (devise cotée)', valeur: rUsd, affichage: fmtCurseur(rUsd) + ' %', min: TAUX_MIN, max: TAUX_MAX, pas: TAUX_PAS, surChange: setRUsd },
    { libelle: 'Taux EUR (devise de base)', valeur: rEur, affichage: fmtCurseur(rEur) + ' %', min: TAUX_MIN, max: TAUX_MAX, pas: TAUX_PAS, surChange: setREur },
    { libelle: 'Horizon T', valeur: horizon, affichage: fmtHorizon(horizon), min: T_MIN, max: T_MAX, pas: T_PAS, surChange: setHorizon },
  ];

  /* ── Détail de l'arbitrage (par million emprunté) ── */
  let arbitrage: { titre: string; etapes: string[]; pnl: string; conclusion: string } | null = null;
  if (fMarche !== null && ecartPips !== null && Math.abs(ecartPips) > TOL_PIPS) {
    if (ecartPips > 0) {
      /* Forward coté trop HAUT : l'euro à terme est surpayé — on le vend à
         terme et on le fabrique par le marché monétaire (cash and carry). */
      const dette = NOTIONNEL * (1 + (rUsd / 100) * horizon);
      const eurSpot = NOTIONNEL / spot;
      const eurTerme = eurSpot * (1 + (rEur / 100) * horizon);
      const usdTerme = eurTerme * fMarche;
      const pnl = usdTerme - dette;
      arbitrage = {
        titre: `Le forward coté (${fmtCours(fMarche)}) dépasse le forward théorique (${fmtCours(fTheo)}) de ${fmtPips(ecartPips)} : l'euro à terme est trop cher. Vendez-le à terme, fabriquez-le au comptant.`,
        etapes: [
          `Empruntez ${fmtMontant(NOTIONNEL, 'USD')} à ${fmtCurseur(rUsd)} % sur ${fmtHorizon(horizon)} — dette à l'échéance : ${fmtMontant(dette, 'USD')}.`,
          `Vendez ces dollars au comptant à ${fmtCours(spot)} : vous obtenez ${fmtMontant(eurSpot, 'EUR')}.`,
          `Placez ces euros à ${fmtCurseur(rEur)} % : ${fmtMontant(eurTerme, 'EUR')} à l'échéance.`,
          `Vendez dès aujourd'hui ces ${fmtMontant(eurTerme, 'EUR')} à terme à ${fmtCours(fMarche)} : ${fmtMontant(usdTerme, 'USD')} garantis.`,
        ],
        pnl: `+${fmtNombre(pnl, 0)} USD`,
        conclusion: `À l'échéance : ${fmtMontant(usdTerme, 'USD')} encaissés contre ${fmtMontant(dette, 'USD')} remboursés, sans mise de départ ni risque de change. La ruée des arbitragistes vend le forward jusqu'à le ramener à ${fmtCours(fTheo)}.`,
      };
    } else {
      /* Forward coté trop BAS : l'euro à terme est bradé — on l'achète à
         terme et on porte le dollar en attendant. */
      const dette = NOTIONNEL * (1 + (rEur / 100) * horizon);
      const usdSpot = NOTIONNEL * spot;
      const usdTerme = usdSpot * (1 + (rUsd / 100) * horizon);
      const eurTerme = usdTerme / fMarche;
      const pnl = eurTerme - dette;
      arbitrage = {
        titre: `Le forward coté (${fmtCours(fMarche)}) est sous le forward théorique (${fmtCours(fTheo)}) de ${fmtPips(ecartPips)} : l'euro à terme est bradé. Achetez-le à terme, portez le dollar en attendant.`,
        etapes: [
          `Empruntez ${fmtMontant(NOTIONNEL, 'EUR')} à ${fmtCurseur(rEur)} % sur ${fmtHorizon(horizon)} — dette à l'échéance : ${fmtMontant(dette, 'EUR')}.`,
          `Vendez ces euros au comptant à ${fmtCours(spot)} : vous obtenez ${fmtMontant(usdSpot, 'USD')}.`,
          `Placez ces dollars à ${fmtCurseur(rUsd)} % : ${fmtMontant(usdTerme, 'USD')} à l'échéance.`,
          `Achetez dès aujourd'hui vos euros à terme à ${fmtCours(fMarche)} : ${fmtMontant(usdTerme, 'USD')} / ${fmtCours(fMarche)} = ${fmtMontant(eurTerme, 'EUR')} garantis.`,
        ],
        pnl: `+${fmtNombre(pnl, 0)} EUR`,
        conclusion: `À l'échéance : ${fmtMontant(eurTerme, 'EUR')} reçus contre ${fmtMontant(dette, 'EUR')} remboursés, sans mise de départ ni risque de change. Les acheteurs à terme font remonter le forward vers ${fmtCours(fTheo)}.`,
      };
    }
  }

  const libelleRegime =
    regime === 'report'
      ? 'Report de l’euro : la base cote plus cher à terme (F > S)'
      : regime === 'deport'
        ? 'Déport de l’euro : la base cote moins cher à terme (F < S)'
        : 'Différentiel nul : F = S sur tout l’horizon';

  return (
    <div className="my-6 rounded-lg border border-border bg-surface">
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2.5">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
          Explorateur du change à terme
        </p>
        <span className="text-[11px] text-text-muted">
          F = S × (1 + r<sub>cotée</sub>·T) / (1 + r<sub>base</sub>·T)
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

      {/* Curseurs spot, taux USD, taux EUR, horizon */}
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

      {/* Graphe : forward en fonction de l'horizon */}
      <div className="px-2 pt-1">
        <svg
          viewBox={`0 0 ${VB_L} ${VB_H}`}
          className="mx-auto block w-full max-w-[560px]"
          role="img"
          aria-label={`Forward EUR/USD en fonction de l'horizon. Spot ${fmtCours(spot)}, taux USD ${fmtCurseur(rUsd)} %, taux EUR ${fmtCurseur(rEur)} %. À ${fmtHorizon(horizon)}, le forward théorique vaut ${fmtCours(fTheo)}, soit ${fmtPips(points)} de points de terme. ${libelleRegime}.`}
        >
          {/* Graduations verticales (cours) */}
          {ticksY.map(v => (
            <g key={v.toFixed(4)}>
              <line x1={M_GAUCHE} x2={M_GAUCHE + TRACE_L} y1={yVue(v)} y2={yVue(v)} stroke="var(--border)" strokeWidth={0.6} />
              <text x={M_GAUCHE - 5} y={yVue(v) + 3} textAnchor="end" fontSize={8.5} fill="var(--text-muted)">
                {fmtCours(v)}
              </text>
            </g>
          ))}

          {/* Axe horizontal et graduations (horizon en années) */}
          <line x1={M_GAUCHE} x2={M_GAUCHE + TRACE_L} y1={Y_BAS} y2={Y_BAS} stroke="var(--border)" strokeWidth={1.2} />
          {ticksX.map(t => (
            <g key={t}>
              <line x1={xVue(t)} x2={xVue(t)} y1={Y_BAS} y2={Y_BAS + 4} stroke="var(--border)" strokeWidth={1} />
              <text x={xVue(t)} y={Y_BAS + 14} textAnchor="middle" fontSize={9} fill="var(--text-muted)">
                {fmtCurseur(t)}
              </text>
            </g>
          ))}
          <text x={M_GAUCHE + TRACE_L / 2} y={VB_H - 4} textAnchor="middle" fontSize={9.5} fill="var(--text-muted)">
            horizon T (années)
          </text>

          {/* Ligne du spot (référence du report/déport) */}
          <line
            x1={M_GAUCHE}
            x2={M_GAUCHE + TRACE_L}
            y1={yVue(spot)}
            y2={yVue(spot)}
            stroke="var(--text-muted)"
            strokeWidth={1}
            strokeDasharray="4 4"
          />
          <text x={M_GAUCHE + 4} y={yVue(spot) - 4} fontSize={8.5} fill="var(--text-muted)">
            spot {fmtCours(spot)}
          </text>

          {/* Trajectoire du forward */}
          <path d={chemin} fill="none" stroke={couleurRegime} strokeWidth={2} strokeLinecap="round" />
          {regime !== 'nul' && (
            <text
              x={xVue(T_MAX) - 4}
              y={yVue(fFin) + (regime === 'report' ? -7 : 13)}
              textAnchor="end"
              fontSize={9}
              fontWeight={600}
              fill={couleurRegime}
            >
              {regime === 'report' ? 'report' : 'déport'}
            </text>
          )}

          {/* Forward coté par le marché (panneau d'arbitrage) */}
          {fMarche !== null && marqueurMarche && (
            <g>
              <line
                x1={xVue(horizon)}
                x2={xVue(horizon)}
                y1={yVue(fTheo)}
                y2={yVue(fMarche)}
                stroke="var(--err)"
                strokeWidth={1.1}
                strokeDasharray="2 3"
              />
              <rect
                x={xVue(horizon) - 3.5}
                y={yVue(fMarche) - 3.5}
                width={7}
                height={7}
                fill="var(--err)"
                stroke="var(--surface)"
                strokeWidth={1.2}
                transform={`rotate(45 ${xVue(horizon)} ${yVue(fMarche)})`}
              />
              <text
                x={Math.min(xVue(horizon) + 7, M_GAUCHE + TRACE_L - 30)}
                y={yVue(fMarche) + 3}
                fontSize={8.5}
                fontWeight={600}
                fill="var(--err)"
              >
                coté
              </text>
            </g>
          )}

          {/* Point courant : forward théorique à l'horizon choisi */}
          <line
            x1={xVue(horizon)}
            x2={xVue(horizon)}
            y1={Math.min(yVue(fTheo), Y_BAS)}
            y2={Y_BAS}
            stroke={couleurRegime}
            strokeWidth={1.1}
            strokeDasharray="2 3"
          />
          <circle
            cx={xVue(horizon)}
            cy={yVue(fTheo)}
            r={5}
            fill={couleurRegime}
            stroke="var(--surface)"
            strokeWidth={1.6}
          />
        </svg>
      </div>

      {/* Lecture : forward en grand + points de terme */}
      <div className="flex flex-wrap items-start gap-x-6 gap-y-3 border-t border-border px-4 py-3">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-muted">Forward théorique à {fmtHorizon(horizon)}</p>
          <p className="tabular-nums text-2xl font-semibold leading-tight" style={{ color: couleurRegime }}>
            {fmtCours(fTheo)}
          </p>
        </div>
        <dl className="grid flex-1 grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
          <div>
            <dt className="text-[10px] uppercase tracking-wider text-text-muted">Points de terme</dt>
            <dd className="tabular-nums text-[13px] font-semibold text-text">{fmtPips(points)}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-wider text-text-muted">Spot</dt>
            <dd className="tabular-nums text-[13px] font-semibold text-text">{fmtCours(spot)}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-wider text-text-muted">Taux USD / taux EUR</dt>
            <dd className="tabular-nums text-[13px] font-semibold text-text">
              {fmtCurseur(rUsd)} % / {fmtCurseur(rEur)} %
            </dd>
          </div>
        </dl>
        <p className="w-full text-[11px] leading-relaxed text-text-muted">
          {libelleRegime}. Le forward ne « prévoit » rien : il compense exactement le différentiel de
          portage entre les deux devises — la devise au taux le plus bas se revalorise à terme.
        </p>
      </div>

      {/* Panneau d'arbitrage : la CIP au banc d'essai */}
      <div className="border-t border-border px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
          Arbitrage — testez la parité couverte
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <div className="w-44">
            <NumericInput
              value={saisieFwd}
              onChange={setSaisieFwd}
              label="Forward coté par le marché"
              placeholder={fmtCours(fTheo)}
            />
          </div>
          <Button
            variante="fantome"
            taille="sm"
            onClick={() => setSaisieFwd(fTheo.toFixed(4).replace('.', ','))}
          >
            Partir du théorique
          </Button>
          {saisieFwd !== '' && (
            <Button variante="fantome" taille="sm" onClick={() => setSaisieFwd('')}>
              Effacer
            </Button>
          )}
        </div>

        <div className="mt-3" aria-live="polite">
          {fMarche === null && !saisieInvalide && (
            <p className="text-[11px] leading-relaxed text-text-muted">
              Saisissez le forward coté par le marché — par exemple le forward théorique décalé de
              50 pips — et regardez ce qui se passe : si le prix coté s'écarte du prix d'arbitrage,
              un P&amp;L sans risque apparaît. C'est exactement pour cela qu'il ne s'en écarte
              (presque) jamais.
            </p>
          )}
          {saisieInvalide && (
            <p className="text-[11px] leading-relaxed text-warn">
              Valeur illisible : entrez un cours comme 1,1300 (virgule ou point).
            </p>
          )}
          {fMarche !== null && arbitrage === null && (
            <div className="rounded-md bg-ok/8 px-3.5 py-3">
              <p className="text-[12px] leading-relaxed text-ok">
                Aucun arbitrage : à {fmtCours(fMarche)}, le forward coté colle au forward théorique
                (écart inférieur à 0,5 pip). Les deux chemins — convertir puis placer, ou placer
                puis vendre à terme — rapportent exactement pareil. C'est l'équilibre de la parité
                couverte.
              </p>
            </div>
          )}
          {arbitrage !== null && (
            <div className="flex flex-col gap-2">
              <p className="text-[12px] leading-relaxed text-text">{arbitrage.titre}</p>
              <ol className="list-decimal space-y-1 pl-5 text-[12px] leading-relaxed text-text">
                {arbitrage.etapes.map(e => (
                  <li key={e} className="tabular-nums">{e}</li>
                ))}
              </ol>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <p className="text-[10px] uppercase tracking-wider text-text-muted">
                  P&amp;L sans risque par million emprunté
                </p>
                <p className="tabular-nums text-xl font-semibold leading-tight text-ok">
                  {arbitrage.pnl}
                </p>
              </div>
              <p className="text-[11px] leading-relaxed text-text-muted">{arbitrage.conclusion}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
