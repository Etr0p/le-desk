import { useState } from 'react';
import {
  regleDeTaylor,
  tauxReelFisher,
} from '../../content/modules/10-macro-banques-centrales/calculs';
import { useLangue } from '../../engine/useLangue';
import type { Langue } from '../../engine/types';
import { Button } from '../ui/Button';

/* ── Explorateur de la règle de Taylor (module 10) ──────────────────────
   i = r* + π + a·(π − π*) + b·gap, tout en %. Six curseurs (π, π*, gap,
   r*, a, b), le taux préconisé en gros chiffre (regleDeTaylor), le taux
   réel qui en découle (tauxReelFisher) et la décomposition en cascade
   SVG. AUCUNE formule recopiée : les quatre briques de la cascade sont
   DÉRIVÉES de regleDeTaylor par différences (annuler un coefficient et
   soustraire isole sa contribution). Trois épisodes cliquables
   positionnent les curseurs : Volcker 1980, la borne zéro de 2015, la
   poussée de 2022 — le curseur d'inflation monte à 14 % pour héberger
   le pic Volcker (π ≈ 13 %).                                          */

const PI_MIN = 0;
const PI_MAX = 14; // 0-10 % en régime normal ; étendu pour l'épisode Volcker (π ≈ 13 %)
const CIBLE_MIN = 1;
const CIBLE_MAX = 3;
const GAP_MIN = -4;
const GAP_MAX = 4;
const RSTAR_MIN = 0;
const RSTAR_MAX = 3;
const COEF_MIN = 0;
const COEF_MAX = 1.5;

type Reglages = {
  inflation: number;
  cible: number;
  gap: number;
  rStar: number;
  coefA: number;
  coefB: number;
};

const DEFAUTS: Reglages = { inflation: 2, cible: 2, gap: 0, rStar: 2, coefA: 0.5, coefB: 0.5 };

/* ── Épisodes : trois configurations historiques ── */
const EPISODES: ReadonlyArray<{ cle: 'volcker' | 'zlb' | 'inflation2022'; reglages: Reglages }> = [
  { cle: 'volcker', reglages: { inflation: 13, cible: 2, gap: -2, rStar: 2, coefA: 0.5, coefB: 0.5 } },
  { cle: 'zlb', reglages: { inflation: 0.2, cible: 2, gap: -2, rStar: 0.5, coefA: 0.5, coefB: 0.5 } },
  { cle: 'inflation2022', reglages: { inflation: 8, cible: 2, gap: 1, rStar: 0.5, coefA: 0.5, coefB: 0.5 } },
];

/* Géométrie du SVG de la cascade (unités viewBox). */
const VB_L = 400;
const VB_H = 168;
const M_G = 108;
const M_D = 46;
const M_H = 10;
const M_B = 22;
const TRACE_L = VB_L - M_G - M_D;
const H_BARRE = 15;
const PAS_LIGNE = (VB_H - M_H - M_B) / 5;

/* ── Textes d'interface FR/EN ── */
const TXT = {
  fr: {
    titre: 'Explorateur de la règle de Taylor',
    sousTitre: 'i = r* + π + a·(π − π*) + b·gap',
    episodes: 'Épisodes',
    volcker: 'Volcker 1980',
    zlb: '2015 : borne zéro',
    inflation2022: '2022 : la poussée',
    inflation: 'Inflation π',
    cible: 'Cible π*',
    gap: 'Écart de production',
    rStar: 'Taux neutre r*',
    coefA: 'Coefficient a (inflation)',
    coefB: 'Coefficient b (production)',
    tauxPreconise: 'Taux préconisé',
    tauxReel: 'Taux réel (Fisher)',
    cascade: 'Décomposition du taux',
    segRStar: 'Taux neutre r*',
    segPi: 'Inflation π',
    segReacInfl: 'Réaction inflation',
    segReacGap: 'Réaction au gap',
    segTotal: 'Taux préconisé',
    lecture: 'Lecture',
    reelPositif: (r: string) =>
      `Le taux réel ressort à ${r} % : positif, la politique mord — épargner rapporte plus que l'inflation ne ronge.`,
    reelNegatif: (r: string) =>
      `Le taux réel ressort à ${r} % : NÉGATIF, la politique reste accommodante malgré le taux nominal affiché — l'inflation ronge plus vite que le taux ne rémunère.`,
    principeOk: (k: string) =>
      `Principe de Taylor respecté (a > 0) : un point d'inflation en plus relève le taux préconisé de ${k} point(s) — plus que 1 pour 1, donc le taux réel monte et refroidit vraiment l'économie.`,
    principeFort: (k: string) =>
      `Avec a ≥ 0,5, la banque centrale réagit fort : chaque point d'inflation en plus relève le taux de ${k} points. C'est le cœur du principe de Taylor — réagir PLUS que 1 pour 1 pour faire monter le taux réel.`,
    principeViole:
      'a = 0 : le taux ne monte qu\'un pour un avec l\'inflation — le taux réel ne bouge pas, la politique ne mord jamais. Le principe de Taylor est violé : l\'inflation peut s\'auto-entretenir.',
    tauxNegatif:
      'Le taux préconisé est NÉGATIF : la règle demande plus que ce que la borne zéro permet. C\'est exactement la situation qui a motivé le QE — quand le taux ne peut plus baisser, la banque centrale achète des actifs.',
    epVolcker:
      'Volcker 1980 : inflation à deux chiffres, récession assumée. La règle prescrit un taux vertigineux — la Fed est effectivement montée vers 20 %. Le prix de la crédibilité.',
    epZlb:
      'Milieu des années 2010 : inflation nulle, économie sous son potentiel. La règle prescrit un taux NÉGATIF — impossible à la borne zéro. D\'où le QE et les taux à zéro pendant des années.',
    ep2022:
      'La poussée de 2022 : inflation vers 8-10 %, économie en surchauffe. La règle prescrit bien plus que les taux du moment — le fameux « behind the curve » qui a forcé les hausses de 75 pb.',
  },
  en: {
    titre: 'Taylor rule explorer',
    sousTitre: 'i = r* + π + a·(π − π*) + b·gap',
    episodes: 'Episodes',
    volcker: 'Volcker 1980',
    zlb: '2015: zero lower bound',
    inflation2022: '2022: the surge',
    inflation: 'Inflation π',
    cible: 'Target π*',
    gap: 'Output gap',
    rStar: 'Neutral rate r*',
    coefA: 'Coefficient a (inflation)',
    coefB: 'Coefficient b (output)',
    tauxPreconise: 'Prescribed rate',
    tauxReel: 'Real rate (Fisher)',
    cascade: 'Rate decomposition',
    segRStar: 'Neutral rate r*',
    segPi: 'Inflation π',
    segReacInfl: 'Inflation response',
    segReacGap: 'Gap response',
    segTotal: 'Prescribed rate',
    lecture: 'How to read this',
    reelPositif: (r: string) =>
      `The real rate comes out at ${r}%: positive, policy bites — saving beats inflation.`,
    reelNegatif: (r: string) =>
      `The real rate comes out at ${r}%: NEGATIVE, policy stays accommodative despite the headline nominal rate — inflation erodes faster than the rate pays.`,
    principeOk: (k: string) =>
      `Taylor principle satisfied (a > 0): one extra point of inflation lifts the prescribed rate by ${k} point(s) — more than one-for-one, so the real rate rises and genuinely cools the economy.`,
    principeFort: (k: string) =>
      `With a ≥ 0.5 the central bank reacts hard: each extra point of inflation lifts the rate by ${k} points. That is the heart of the Taylor principle — react MORE than one-for-one so the real rate rises.`,
    principeViole:
      'a = 0: the rate only rises one-for-one with inflation — the real rate never moves, policy never bites. The Taylor principle is violated: inflation can feed on itself.',
    tauxNegatif:
      'The prescribed rate is NEGATIVE: the rule asks for more than the zero lower bound allows. That is exactly what motivated QE — when the rate cannot fall further, the central bank buys assets instead.',
    epVolcker:
      'Volcker 1980: double-digit inflation, recession accepted. The rule prescribes a dizzying rate — the Fed did push towards 20%. The price of credibility.',
    epZlb:
      'Mid-2010s: zero inflation, economy below potential. The rule prescribes a NEGATIVE rate — impossible at the zero bound. Hence QE and years of rates at zero.',
    ep2022:
      'The 2022 surge: inflation at 8-10%, an overheating economy. The rule prescribes far more than prevailing rates — the famous “behind the curve” that forced the 75 bp hikes.',
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
export function TaylorRuleExplorer() {
  const { langue } = useLangue();
  const L = TXT[langue];
  const [reglages, setReglages] = useState<Reglages>(DEFAUTS);
  const [episode, setEpisode] = useState<'volcker' | 'zlb' | 'inflation2022' | null>(null);
  const { inflation, cible, gap, rStar, coefA, coefB } = reglages;

  const regler = (cle: keyof Reglages) => (v: number) => {
    setEpisode(null);
    setReglages(prev => ({ ...prev, [cle]: v }));
  };

  /* ── Tout vient de regleDeTaylor — les briques par DIFFÉRENCES ──
     Annuler un coefficient et soustraire isole sa contribution :
     réaction inflation = i(a, b) − i(0, b) ; réaction gap = i(a, b) − i(a, 0).
     Ce qui reste (i − les deux réactions) est le socle r* + π.            */
  const taux = regleDeTaylor(rStar, inflation, cible, gap, coefA, coefB);
  const reacInflation = taux - regleDeTaylor(rStar, inflation, cible, gap, 0, coefB);
  const reacGap = taux - regleDeTaylor(rStar, inflation, cible, gap, coefA, 0);
  const socle = taux - reacInflation - reacGap; // = r* + π
  const compPi = socle - rStar;
  const tauxReel = tauxReelFisher(taux, inflation);

  /* ── Cascade : chaque brique part du cumul précédent ── */
  const briques = [
    { cle: 'rStar', libelle: L.segRStar, valeur: rStar, depuis: 0, couleur: 'var(--text-muted)', opacite: 0.6 },
    { cle: 'pi', libelle: L.segPi, valeur: compPi, depuis: rStar, couleur: 'var(--accent)', opacite: 0.85 },
    { cle: 'reacInfl', libelle: L.segReacInfl, valeur: reacInflation, depuis: socle, couleur: 'var(--warn)', opacite: 0.85 },
    { cle: 'reacGap', libelle: L.segReacGap, valeur: reacGap, depuis: socle + reacInflation, couleur: 'var(--ok)', opacite: 0.85 },
    { cle: 'total', libelle: L.segTotal, valeur: taux, depuis: 0, couleur: taux < 0 ? 'var(--err)' : 'var(--accent)', opacite: 1 },
  ] as const;

  /* Échelle x : couvre 0 et tous les cumuls, avec un peu d'air. */
  const cumuls = briques.flatMap(b => [b.depuis, b.depuis + b.valeur]);
  const xBas = Math.min(0, ...cumuls) - 0.5;
  const xHaut = Math.max(1, ...cumuls) + 0.5;
  const eX = (v: number) => M_G + ((v - xBas) / (xHaut - xBas)) * TRACE_L;

  const pasTick = xHaut - xBas > 14 ? 5 : xHaut - xBas > 7 ? 2 : 1;
  const ticks: number[] = [];
  for (let v = Math.ceil(xBas / pasTick) * pasTick; v <= xHaut; v += pasTick) ticks.push(v);

  /* ── Lecture dynamique : borne zéro > épisode > principe + réel ── */
  const fReel = fmtNombre(tauxReel, 2, langue);
  const fUnPlusA = fmtNombre(1 + coefA, 2, langue);
  const phraseReel = tauxReel < 0 ? L.reelNegatif(fReel) : L.reelPositif(fReel);
  const phrasePrincipe =
    coefA === 0 ? L.principeViole
    : coefA >= 0.5 ? L.principeFort(fUnPlusA)
    : L.principeOk(fUnPlusA);
  const message =
    taux < 0 ? `${L.tauxNegatif} ${phraseReel}`
    : episode === 'volcker' ? `${L.epVolcker} ${phraseReel}`
    : episode === 'zlb' ? `${L.epZlb} ${phraseReel}`
    : episode === 'inflation2022' ? `${L.ep2022} ${phraseReel}`
    : `${phrasePrincipe} ${phraseReel}`;

  const curseurs: ReadonlyArray<{
    libelle: string;
    valeur: number;
    affichage: string;
    min: number;
    max: number;
    pas: number;
    surChange: (v: number) => void;
  }> = [
    { libelle: L.inflation, valeur: inflation, affichage: `${fmtNombre(inflation, 2, langue)} %`, min: PI_MIN, max: PI_MAX, pas: 0.25, surChange: regler('inflation') },
    { libelle: L.cible, valeur: cible, affichage: `${fmtNombre(cible, 2, langue)} %`, min: CIBLE_MIN, max: CIBLE_MAX, pas: 0.25, surChange: regler('cible') },
    { libelle: L.gap, valeur: gap, affichage: `${fmtNombre(gap, 2, langue)} %`, min: GAP_MIN, max: GAP_MAX, pas: 0.25, surChange: regler('gap') },
    { libelle: L.rStar, valeur: rStar, affichage: `${fmtNombre(rStar, 2, langue)} %`, min: RSTAR_MIN, max: RSTAR_MAX, pas: 0.25, surChange: regler('rStar') },
    { libelle: L.coefA, valeur: coefA, affichage: fmtNombre(coefA, 2, langue), min: COEF_MIN, max: COEF_MAX, pas: 0.25, surChange: regler('coefA') },
    { libelle: L.coefB, valeur: coefB, affichage: fmtNombre(coefB, 2, langue), min: COEF_MIN, max: COEF_MAX, pas: 0.25, surChange: regler('coefB') },
  ];

  const fTaux = fmtNombre(taux, 2, langue);
  const ariaCascade =
    langue === 'fr'
      ? `Décomposition du taux préconisé ${fTaux} % : taux neutre ${fmtNombre(rStar, 2, langue)}, inflation ${fmtNombre(compPi, 2, langue)}, réaction inflation ${fmtNombre(reacInflation, 2, langue)}, réaction au gap ${fmtNombre(reacGap, 2, langue)}.`
      : `Decomposition of the prescribed rate ${fTaux}%: neutral rate ${fmtNombre(rStar, 2, langue)}, inflation ${fmtNombre(compPi, 2, langue)}, inflation response ${fmtNombre(reacInflation, 2, langue)}, gap response ${fmtNombre(reacGap, 2, langue)}.`;

  return (
    <div className="my-6 rounded-lg border border-border bg-surface">
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2.5">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">{L.titre}</p>
        <span className="tabular-nums text-[11px] text-text-muted">{L.sousTitre}</span>
      </div>

      {/* Épisodes : trois presets historiques */}
      <div className="flex flex-wrap items-center gap-2 px-4 pt-3">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">{L.episodes}</span>
        {EPISODES.map(e => (
          <Button
            key={e.cle}
            variante={episode === e.cle ? 'primaire' : 'secondaire'}
            taille="sm"
            onClick={() => {
              setReglages(e.reglages);
              setEpisode(e.cle);
            }}
            aria-pressed={episode === e.cle}
          >
            {L[e.cle]}
          </Button>
        ))}
      </div>

      {/* Curseurs */}
      <div className="grid grid-cols-1 gap-x-6 gap-y-2 px-4 pt-3 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* Le taux préconisé et le réel qui en découle */}
      <div className="flex flex-wrap items-end gap-x-8 gap-y-2 px-4 pt-3" aria-live="polite">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-muted">{L.tauxPreconise}</p>
          <p className={`tabular-nums text-3xl font-semibold leading-tight ${taux < 0 ? 'text-err' : 'text-accent'}`}>
            {fTaux} %
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-muted">{L.tauxReel}</p>
          <p className={`tabular-nums text-xl font-semibold leading-tight ${tauxReel < 0 ? 'text-err' : 'text-text'}`}>
            {fReel} %
          </p>
        </div>
      </div>

      {/* Cascade : la décomposition du taux */}
      <div className="px-2 pt-2">
        <p className="mb-0.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-text-muted">{L.cascade}</p>
        <svg viewBox={`0 0 ${VB_L} ${VB_H}`} className="block w-full" role="img" aria-label={ariaCascade}>
          {/* Grille verticale */}
          {ticks.map(v => (
            <g key={v}>
              <line
                x1={eX(v)} x2={eX(v)} y1={M_H} y2={VB_H - M_B}
                stroke="var(--border)" strokeWidth={v === 0 ? 1.1 : 0.5}
                strokeDasharray={v === 0 ? undefined : '2 4'}
              />
              <text x={eX(v)} y={VB_H - M_B + 11} textAnchor="middle" fontSize={8} fill="var(--text-muted)">
                {fmtNombre(v, 0, langue)}
              </text>
            </g>
          ))}

          {/* Briques de la cascade + connecteurs */}
          {briques.map((b, i) => {
            const y = M_H + i * PAS_LIGNE + (PAS_LIGNE - H_BARRE) / 2;
            const x0 = eX(Math.min(b.depuis, b.depuis + b.valeur));
            const larg = Math.max(Math.abs(eX(b.depuis + b.valeur) - eX(b.depuis)), 0.75);
            const finPrec = i > 0 && i < briques.length - 1 ? eX(b.depuis) : null;
            const fValeur = `${b.valeur >= 0 && b.cle !== 'rStar' && b.cle !== 'total' ? '+' : ''}${fmtNombre(b.valeur, 2, langue)}`;
            return (
              <g key={b.cle}>
                {finPrec !== null && (
                  <line
                    x1={finPrec} x2={finPrec}
                    y1={y - (PAS_LIGNE - H_BARRE) / 2 - H_BARRE / 2} y2={y + H_BARRE / 2}
                    stroke="var(--text-muted)" strokeWidth={0.6} strokeDasharray="2 2" opacity={0.7}
                  />
                )}
                <text x={M_G - 6} y={y + H_BARRE / 2 + 3} textAnchor="end" fontSize={8.5}
                  fontWeight={b.cle === 'total' ? 700 : 400}
                  fill={b.cle === 'total' ? 'var(--text)' : 'var(--text-muted)'}>
                  {b.libelle}
                </text>
                <rect x={x0} y={y} width={larg} height={H_BARRE} rx={2}
                  fill={b.couleur} opacity={b.opacite} />
                <text
                  x={b.depuis + b.valeur >= b.depuis ? x0 + larg + 4 : x0 - 4}
                  y={y + H_BARRE / 2 + 3}
                  textAnchor={b.depuis + b.valeur >= b.depuis ? 'start' : 'end'}
                  fontSize={8.5} fontWeight={b.cle === 'total' ? 700 : 500}
                  fill={b.cle === 'total' ? 'var(--text)' : 'var(--text-muted)'}
                  className="tabular-nums"
                >
                  {fValeur}
                </text>
              </g>
            );
          })}
        </svg>
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
