import { useState } from 'react';
import { variationPrixObligationDuration } from '../../content/modules/10-macro-banques-centrales/calculs';
import { useLangue } from '../../engine/useLangue';
import type { Langue } from '../../engine/types';

/* ── Le choc de taux et les classes d'actifs (module 10) ────────────────
   Un seul choc Δy (en pb) + la duration du portefeuille obligataire, et
   la transmission en barres divergentes. HONNÊTETÉ PÉDAGOGIQUE : seule
   la jambe obligataire est un CALCUL (variationPrixObligationDuration,
   ΔP/P ≈ −D·Δy) ; les actions sont une APPROXIMATION affichée en
   fourchette (duration implicite ~15-25 : les cash-flows longs se
   réactualisent comme une obligation très longue — ordre de grandeur,
   pas une loi) ; croissance/value, change et or sont des DIRECTIONS
   qualitatives, dessinées en barres hachurées SANS chiffre. Rien n'est
   recopié : chaque barre chiffrée passe par la fonction du m10.       */

const CHOC_MIN = -200;
const CHOC_MAX = 300;
const CHOC_DEFAUT = 100;
const CHOC_PAS = 25;
const DUR_MIN = 2;
const DUR_MAX = 20;
const DUR_DEFAUT = 8;

/* Duration implicite des actions : les flux longs (dividendes lointains)
   réagissent à l'actualisation comme une obligation très longue. */
const DUR_ACTIONS_BASSE = 15;
const DUR_ACTIONS_HAUTE = 25;

/* Géométrie du SVG (unités viewBox). */
const VB_L = 400;
const VB_H = 190;
const M_G = 92;
const M_D = 14;
const M_H = 12;
const M_B = 24;
const TRACE_L = VB_L - M_G - M_D;
const H_BARRE = 15;
const PAS_LIGNE = (VB_H - M_H - M_B) / 5;

/* ── Textes d'interface FR/EN ── */
const TXT = {
  fr: {
    titre: 'Choc de taux : la transmission aux actifs',
    sousTitre: 'ΔP/P ≈ −D·Δy — la jambe obligataire est exacte, le reste est un ordre de grandeur',
    choc: 'Choc de taux Δy',
    duration: 'Duration du portefeuille obligataire',
    ans: 'ans',
    obligations: 'Obligations',
    actions: 'Actions',
    croissanceValue: 'Croissance vs value',
    change: 'Devise',
    or: 'Or',
    exact: 'exact',
    fourchette: 'duration implicite ~15-25',
    qualitatif: 'direction seulement',
    impactOblig: 'Impact obligataire',
    chocNul: 'Pas de choc, pas de transmission : bougez le curseur.',
    dirCroissanceBaisse: 'la croissance sous-performe la value (ses profits sont lointains, donc plus actualisés)',
    dirCroissanceHausse: 'la croissance surperforme la value (l\'actualisation se détend sur ses profits lointains)',
    dirDeviseHausse: 'devise soutenue : les capitaux courent après le rendement (pont module 6, parité des taux)',
    dirDeviseBaisse: 'devise pénalisée : le différentiel de taux se dégrade (pont module 6)',
    dirOrBaisse: 'taux réels en hausse ⇒ le coût d\'opportunité de l\'or (zéro coupon, zéro dividende) monte ⇒ or pénalisé',
    dirOrHausse: 'taux réels en baisse ⇒ détenir un actif qui ne rapporte rien coûte moins ⇒ l\'or adore',
    lecture: 'Lecture',
    honnete:
      'Seule la barre obligataire sort d\'une formule (ΔP/P ≈ −D·Δy). Les actions sont un ordre de grandeur, pas une loi : la « duration implicite » de 15-25 capture l\'effet actualisation mais ignore les profits, qui bougent aussi. Croissance/value, devise et or sont des directions — hachurées pour le rappeler.',
    msg2022: (impact: string, d: string) =>
      `+300 pb sur une duration ${d} : ${impact} % — le cycle 2022 en une barre. C'est exactement ce qu'ont vécu les portefeuilles obligataires « sans risque », pendant que la value écrasait la croissance et que le dollar s'envolait.`,
    msgBaisse:
      'Choc de taux NÉGATIF : tout se lit en miroir — les obligations montent (d\'autant plus que la duration est longue), la croissance respire, et l\'or adore les taux réels qui baissent.',
    msgDurLongue: (d: string) =>
      `Duration ${d} ans : chaque point de base frappe fort. C'est le portefeuille des assureurs et des fonds de pension — la « sécurité » obligataire est une sécurité de CRÉDIT, pas une sécurité de TAUX.`,
    msgDefaut:
      'La duration est le multiplicateur du choc : la même hausse de taux égratigne un portefeuille court et ampute un portefeuille long. Tout le reste de l\'écran découle de la même mécanique d\'actualisation.',
  },
  en: {
    titre: 'Rate shock: transmission across assets',
    sousTitre: 'ΔP/P ≈ −D·Δy — the bond leg is exact, the rest is an order of magnitude',
    choc: 'Rate shock Δy',
    duration: 'Bond portfolio duration',
    ans: 'yrs',
    obligations: 'Bonds',
    actions: 'Equities',
    croissanceValue: 'Growth vs value',
    change: 'Currency',
    or: 'Gold',
    exact: 'exact',
    fourchette: 'implied duration ~15-25',
    qualitatif: 'direction only',
    impactOblig: 'Bond impact',
    chocNul: 'No shock, no transmission: move the slider.',
    dirCroissanceBaisse: 'growth underperforms value (its profits are distant, hence more heavily discounted)',
    dirCroissanceHausse: 'growth outperforms value (discounting eases on its distant profits)',
    dirDeviseHausse: 'currency supported: capital chases yield (module 6 bridge, interest-rate parity)',
    dirDeviseBaisse: 'currency penalised: the rate differential deteriorates (module 6 bridge)',
    dirOrBaisse: 'real rates up ⇒ the opportunity cost of gold (no coupon, no dividend) rises ⇒ gold penalised',
    dirOrHausse: 'real rates down ⇒ holding an asset that pays nothing costs less ⇒ gold loves it',
    lecture: 'How to read this',
    honnete:
      'Only the bond bar comes from a formula (ΔP/P ≈ −D·Δy). Equities are an order of magnitude, not a law: the 15-25 “implied duration” captures the discounting effect but ignores earnings, which move too. Growth/value, currency and gold are directions — hatched as a reminder.',
    msg2022: (impact: string, d: string) =>
      `+300 bp on a duration of ${d}: ${impact}% — the 2022 cycle in one bar. That is exactly what “risk-free” bond portfolios lived through, while value crushed growth and the dollar soared.`,
    msgBaisse:
      'NEGATIVE rate shock: read everything in the mirror — bonds rally (the longer the duration, the more), growth breathes, and gold loves falling real rates.',
    msgDurLongue: (d: string) =>
      `Duration ${d} yrs: every basis point hits hard. That is the insurer and pension-fund portfolio — bond “safety” is CREDIT safety, not RATE safety.`,
    msgDefaut:
      'Duration is the shock multiplier: the same rate rise scratches a short portfolio and maims a long one. Everything else on this screen follows from the same discounting mechanics.',
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
export function RateShockExplorer() {
  const { langue } = useLangue();
  const L = TXT[langue];
  const [chocPbs, setChocPbs] = useState(CHOC_DEFAUT);
  const [duration, setDuration] = useState(DUR_DEFAUT);

  /* ── La jambe exacte et la fourchette actions — TOUT via le m10 ── */
  const impactOblig = variationPrixObligationDuration(duration, chocPbs);
  const impactActionsBas = variationPrixObligationDuration(DUR_ACTIONS_HAUTE, chocPbs);
  const impactActionsHaut = variationPrixObligationDuration(DUR_ACTIONS_BASSE, chocPbs);
  const actionsMin = Math.min(impactActionsBas, impactActionsHaut);
  const actionsMax = Math.max(impactActionsBas, impactActionsHaut);

  /* ── Directions qualitatives : signe du choc, amplitude ILLUSTRATIVE
     (un tiers de l'échelle), jamais chiffrée à l'écran ── */
  const sens = Math.sign(chocPbs);
  const ampleurQualitative = Math.max(Math.abs(impactOblig), Math.abs(actionsMin), 4) / 3;
  const dirCroissance = -sens * ampleurQualitative; // hausse des taux : croissance sous-performe la value
  const dirDevise = sens * ampleurQualitative; // hausse des taux : devise soutenue (m6)
  const dirOr = -sens * ampleurQualitative; // hausse du réel : or pénalisé

  type Barre = {
    cle: string;
    libelle: string;
    note: string;
    valeur: number;
    etiquette: string | null;
    fourchette: [number, number] | null;
    qualitatif: boolean;
    couleur: string;
  };

  const fPct = (v: number) => `${v > 0 ? '+' : ''}${fmtNombre(v, 1, langue)} %`;
  const barres: Barre[] = [
    {
      cle: 'oblig', libelle: L.obligations, note: L.exact,
      valeur: impactOblig, etiquette: fPct(impactOblig), fourchette: null,
      qualitatif: false, couleur: 'var(--accent)',
    },
    {
      cle: 'actions', libelle: L.actions, note: L.fourchette,
      valeur: (actionsMin + actionsMax) / 2,
      etiquette: chocPbs === 0 ? fPct(0) : `${fPct(actionsMin)} … ${fPct(actionsMax)}`,
      fourchette: [actionsMin, actionsMax],
      qualitatif: false, couleur: 'var(--warn)',
    },
    {
      cle: 'croissance', libelle: L.croissanceValue, note: L.qualitatif,
      valeur: dirCroissance, etiquette: null, fourchette: null,
      qualitatif: true, couleur: 'var(--text-muted)',
    },
    {
      cle: 'devise', libelle: L.change, note: L.qualitatif,
      valeur: dirDevise, etiquette: null, fourchette: null,
      qualitatif: true, couleur: 'var(--text-muted)',
    },
    {
      cle: 'or', libelle: L.or, note: L.qualitatif,
      valeur: dirOr, etiquette: null, fourchette: null,
      qualitatif: true, couleur: 'var(--text-muted)',
    },
  ];

  /* Échelle x symétrique-ish : couvre toutes les barres et fourchettes. */
  const etendue = Math.max(
    5,
    ...barres.map(b => Math.abs(b.valeur)),
    Math.abs(actionsMin),
    Math.abs(actionsMax),
  ) * 1.15;
  const eX = (v: number) => M_G + ((v + etendue) / (2 * etendue)) * TRACE_L;

  const pasTick = etendue > 40 ? 20 : etendue > 16 ? 10 : 5;
  const ticks: number[] = [];
  for (let v = -Math.floor(etendue / pasTick) * pasTick; v <= etendue; v += pasTick) ticks.push(v);

  /* ── Message dynamique ── */
  const fImpact = fmtNombre(impactOblig, 1, langue);
  const message =
    chocPbs === 0 ? L.chocNul
    : chocPbs >= 250 && duration >= 7
      ? L.msg2022(fImpact, String(duration))
    : chocPbs <= -100 ? L.msgBaisse
    : duration >= 14 ? L.msgDurLongue(String(duration))
    : L.msgDefaut;

  const phraseDirections =
    chocPbs === 0 ? '' :
    ` ${sens > 0 ? L.dirCroissanceBaisse : L.dirCroissanceHausse} ; ${sens > 0 ? L.dirDeviseHausse : L.dirDeviseBaisse} ; ${sens > 0 ? L.dirOrBaisse : L.dirOrHausse}.`;

  const curseurs: ReadonlyArray<{
    libelle: string;
    valeur: number;
    affichage: string;
    min: number;
    max: number;
    pas: number;
    surChange: (v: number) => void;
  }> = [
    { libelle: L.choc, valeur: chocPbs, affichage: `${chocPbs > 0 ? '+' : ''}${fmtNombre(chocPbs, 0, langue)} pb`, min: CHOC_MIN, max: CHOC_MAX, pas: CHOC_PAS, surChange: setChocPbs },
    { libelle: L.duration, valeur: duration, affichage: `${duration} ${L.ans}`, min: DUR_MIN, max: DUR_MAX, pas: 1, surChange: setDuration },
  ];

  const ariaGraphe =
    langue === 'fr'
      ? `Impact d'un choc de ${chocPbs} points de base : obligations ${fmtNombre(impactOblig, 1, langue)} % (exact, duration ${duration}), actions entre ${fmtNombre(actionsMin, 1, langue)} et ${fmtNombre(actionsMax, 1, langue)} % (ordre de grandeur) ; croissance/value, devise et or en direction seulement.`
      : `Impact of a ${chocPbs} basis point shock: bonds ${fmtNombre(impactOblig, 1, langue)}% (exact, duration ${duration}), equities between ${fmtNombre(actionsMin, 1, langue)} and ${fmtNombre(actionsMax, 1, langue)}% (order of magnitude); growth/value, currency and gold as direction only.`;

  return (
    <div className="my-6 rounded-lg border border-border bg-surface">
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2.5">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">{L.titre}</p>
        <span className="text-[11px] text-text-muted">{L.sousTitre}</span>
      </div>

      {/* Curseurs : le choc et la duration */}
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

      {/* L'impact obligataire : le chiffre exact */}
      <div className="flex flex-wrap items-end gap-x-6 gap-y-2 px-4 pt-3" aria-live="polite">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-muted">
            {L.impactOblig} ({L.exact}, D = {duration})
          </p>
          <p className={`tabular-nums text-3xl font-semibold leading-tight ${impactOblig < 0 ? 'text-err' : 'text-accent'}`}>
            {fPct(impactOblig)}
          </p>
        </div>
      </div>

      {/* Barres divergentes : la transmission */}
      <div className="px-2 pt-1">
        <svg viewBox={`0 0 ${VB_L} ${VB_H}`} className="block w-full" role="img" aria-label={ariaGraphe}>
          <defs>
            <pattern id="hachures-choc" width={5} height={5} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1={0} y1={0} x2={0} y2={5} stroke="var(--text-muted)" strokeWidth={2} />
            </pattern>
          </defs>

          {/* Grille verticale (%) */}
          {ticks.map(v => (
            <g key={v}>
              <line
                x1={eX(v)} x2={eX(v)} y1={M_H} y2={VB_H - M_B}
                stroke="var(--border)" strokeWidth={v === 0 ? 1.2 : 0.5}
                strokeDasharray={v === 0 ? undefined : '2 4'}
              />
              <text x={eX(v)} y={VB_H - M_B + 11} textAnchor="middle" fontSize={8} fill="var(--text-muted)">
                {fmtNombre(v, 0, langue)} %
              </text>
            </g>
          ))}

          {/* Une barre par classe d'actifs */}
          {barres.map((b, i) => {
            const y = M_H + i * PAS_LIGNE + (PAS_LIGNE - H_BARRE) / 2;
            const x0 = eX(Math.min(0, b.valeur));
            const larg = Math.max(Math.abs(eX(b.valeur) - eX(0)), 0.75);
            const versLaDroite = b.valeur >= 0;
            const fleche = b.qualitatif ? (versLaDroite ? '→' : '←') : null;
            return (
              <g key={b.cle}>
                <text x={M_G - 6} y={y + H_BARRE / 2} textAnchor="end" fontSize={8.5} fontWeight={600} fill="var(--text)">
                  {b.libelle}
                </text>
                <text x={M_G - 6} y={y + H_BARRE / 2 + 9} textAnchor="end" fontSize={7} fill="var(--text-muted)">
                  {b.note}
                </text>

                {/* Fourchette actions : bande claire derrière la barre médiane */}
                {b.fourchette && Math.abs(b.fourchette[1] - b.fourchette[0]) > 0 && (
                  <rect
                    x={eX(Math.min(...b.fourchette))} y={y + 1.5}
                    width={Math.max(Math.abs(eX(b.fourchette[1]) - eX(b.fourchette[0])), 0.5)}
                    height={H_BARRE - 3} rx={2}
                    fill={b.couleur} opacity={0.22}
                  />
                )}

                <rect
                  x={x0} y={b.fourchette ? y + 4 : y}
                  width={larg} height={b.fourchette ? H_BARRE - 8 : H_BARRE} rx={2}
                  fill={b.qualitatif ? 'url(#hachures-choc)' : b.couleur}
                  opacity={b.qualitatif ? 0.5 : 0.85}
                />

                {/* Étiquette : chiffre pour les barres calculées, flèche pour les directions */}
                {b.etiquette !== null ? (
                  <text
                    x={versLaDroite ? Math.max(eX(b.fourchette ? b.fourchette[1] : b.valeur), eX(0)) + 4 : Math.min(eX(b.fourchette ? b.fourchette[0] : b.valeur), eX(0)) - 4}
                    y={y + H_BARRE / 2 + 3}
                    textAnchor={versLaDroite ? 'start' : 'end'}
                    fontSize={8.5} fontWeight={600} fill="var(--text)"
                    className="tabular-nums"
                  >
                    {b.etiquette}
                  </text>
                ) : (
                  chocPbs !== 0 && (
                    <text
                      x={versLaDroite ? eX(b.valeur) + 4 : eX(b.valeur) - 4}
                      y={y + H_BARRE / 2 + 3}
                      textAnchor={versLaDroite ? 'start' : 'end'}
                      fontSize={9} fontWeight={600} fill="var(--text-muted)"
                    >
                      {fleche}
                    </text>
                  )
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Lecture pédagogique dynamique + avertissement d'honnêteté */}
      <div className="border-t border-border px-4 py-3" aria-live="polite">
        <p className="text-[11px] leading-relaxed text-text-muted">
          <strong className="text-text">{L.lecture} :</strong> {message}
          {phraseDirections && <span> {sens > 0 ? '↑' : '↓'} {chocPbs > 0 ? '+' : ''}{fmtNombre(chocPbs, 0, langue)} pb —{phraseDirections}</span>}
        </p>
        <p className="mt-1.5 text-[11px] italic leading-relaxed text-text-muted">{L.honnete}</p>
      </div>
    </div>
  );
}
