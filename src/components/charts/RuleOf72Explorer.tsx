import { useState } from 'react';
import {
  regleDe72,
  anneesDoublementExactes,
  erreurRelativePct,
} from '../../content/modules/13-brainteasers-oral/calculs';
import { useLangue } from '../../engine/useLangue';
import type { Langue } from '../../engine/types';

/* ── L'explorateur de la règle de 72 (module 13) ────────────────────────
   Un curseur de taux : le composant trace les années de doublement exactes
   (ln 2 / ln(1 + r)) contre l'approximation 72/r sur toute la plage, et
   affiche l'erreur relative au taux choisi. Tout passe par calculs.ts.
   HONNÊTETÉ PÉDAGOGIQUE : la règle de 72 vaut pour la composition
   ANNUELLE discrète ; en composition continue, la constante juste est
   100·ln 2 ≈ 69,3 — c'est précisément pourquoi 72 marche si bien vers
   8 % : l'écart 72 − 69,3 compense la discrétisation.                   */

const TAUX_MIN = 1;
const TAUX_MAX = 15;
const TAUX_DEFAUT = 8;
const TAUX_PAS = 0.5;

/* Géométrie du SVG (unités viewBox). */
const VB_L = 400;
const VB_H = 190;
const M_G = 38;
const M_D = 14;
const M_H = 14;
const M_B = 28;
const TRACE_L = VB_L - M_G - M_D;
const TRACE_H = VB_H - M_H - M_B;
const ANNEES_MAX = 72; // l'axe vertical couvre 72/1 = 72 ans

/* ── Textes d'interface FR/EN ── */
const TXT = {
  fr: {
    titre: 'La règle de 72',
    sousTitre: 'l\'outil de calcul mental le plus rentable en entretien',
    taux: 'Taux annuel composé',
    approx: 'Règle de 72',
    exact: 'Doublement exact',
    erreur: 'Erreur relative',
    ans: 'ans',
    axeX: 'Taux (%)',
    axeY: 'Années',
    legendeExact: 'exact : ln 2 / ln(1 + r)',
    legende72: 'approximation 72/r',
    lecture: 'Lecture',
    honnete:
      'La règle vaut pour la composition ANNUELLE discrète. En composition continue, la constante juste serait 100 × ln 2 ≈ 69,3 — et c\'est précisément pourquoi 72 marche si bien autour de 8 % : l\'écart entre 72 et 69,3 compense la discrétisation. 72 a un autre mérite, décisif de tête : il se divise par 2, 3, 4, 6, 8, 9 et 12.',
    msgSweet: (err: string) =>
      `Vous êtes dans la zone douce de la règle : l\'erreur n\'est que de ${err} % — indétectable à l\'oral. Autour de 8 %, 72/r et la vraie courbe se confondent : c\'est là que la règle a été calibrée, et c\'est l\'ordre de grandeur des rendements actions de long terme — la question « votre portefeuille double en combien de temps ? » se règle en une division.`,
    msgBas: (approx: string, exact: string) =>
      `Aux taux bas, la règle SURESTIME légèrement : 72/r donne ${approx} ans contre ${exact} exacts. L\'ordre de grandeur reste excellent — et le réflexe qui impressionne est justement d\'annoncer le chiffre PUIS sa limite : « environ ${approx} ans, la règle de 72 surestime un peu à ces niveaux ». Montrer l\'outil et sa tolérance vaut mieux que la précision seule.`,
    msgHaut: (approx: string, exact: string) =>
      `Aux taux élevés, la règle SOUS-estime : ${approx} ans annoncés contre ${exact} exacts — la discrétisation pèse de plus en plus. Au-delà de ~15 %, préférez des jalons mémorisés (à 26 %, on double en 3 ans). Le méta-réflexe du module : toute approximation a un domaine de validité, et le candidat qui le connaît inspire plus confiance que celui qui récite.`,
  },
  en: {
    titre: 'The rule of 72',
    sousTitre: 'the highest-yielding mental-math tool in interviews',
    taux: 'Compound annual rate',
    approx: 'Rule of 72',
    exact: 'Exact doubling',
    erreur: 'Relative error',
    ans: 'years',
    axeX: 'Rate (%)',
    axeY: 'Years',
    legendeExact: 'exact: ln 2 / ln(1 + r)',
    legende72: '72/r approximation',
    lecture: 'How to read this',
    honnete:
      'The rule holds for ANNUAL discrete compounding. Under continuous compounding the right constant would be 100 × ln 2 ≈ 69.3 — which is precisely why 72 works so well around 8%: the gap between 72 and 69.3 offsets the discretisation. And 72 has one more decisive mental merit: it divides by 2, 3, 4, 6, 8, 9 and 12.',
    msgSweet: (err: string) =>
      `You are in the rule\'s sweet spot: the error is only ${err}% — undetectable in an oral. Around 8%, 72/r and the true curve merge: that is where the rule was calibrated, and it is the order of magnitude of long-run equity returns — "how long until your portfolio doubles?" becomes a single division.`,
    msgBas: (approx: string, exact: string) =>
      `At low rates the rule slightly OVERSTATES: 72/r gives ${approx} years against ${exact} exact. The order of magnitude remains excellent — and the reflex that impresses is precisely to give the number THEN its limit: "about ${approx} years, the rule of 72 overshoots a little down here". Showing the tool and its tolerance beats raw precision.`,
    msgHaut: (approx: string, exact: string) =>
      `At high rates the rule UNDERSTATES: ${approx} years quoted against ${exact} exact — discretisation weighs more and more. Beyond ~15%, prefer memorised milestones (at 26%, money doubles in 3 years). The module\'s meta-reflex: every approximation has a domain of validity, and the candidate who knows it inspires more trust than the one who recites.`,
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
export function RuleOf72Explorer() {
  const { langue } = useLangue();
  const L = TXT[langue];
  const [tauxPct, setTauxPct] = useState(TAUX_DEFAUT);

  const approx = regleDe72(tauxPct);
  const exact = anneesDoublementExactes(tauxPct);
  const erreur = erreurRelativePct(approx, exact);

  /* Courbes sur la plage de taux. */
  const xTaux = (t: number) => M_G + ((t - TAUX_MIN) / (TAUX_MAX - TAUX_MIN)) * TRACE_L;
  const yAns = (a: number) => M_H + TRACE_H * (1 - Math.min(a, ANNEES_MAX) / ANNEES_MAX);
  const N = 90;
  const ptsExact: string[] = [];
  const ptsApprox: string[] = [];
  for (let i = 0; i <= N; i++) {
    const t = TAUX_MIN + ((TAUX_MAX - TAUX_MIN) * i) / N;
    ptsExact.push(`${xTaux(t)},${yAns(anneesDoublementExactes(t))}`);
    ptsApprox.push(`${xTaux(t)},${yAns(regleDe72(t))}`);
  }

  const message =
    tauxPct >= 6 && tauxPct <= 10
      ? L.msgSweet(fmtNombre(Math.abs(erreur), 2, langue))
      : tauxPct < 6
        ? L.msgBas(fmtNombre(approx, 1, langue), fmtNombre(exact, 1, langue))
        : L.msgHaut(fmtNombre(approx, 1, langue), fmtNombre(exact, 1, langue));

  const ariaGraphe =
    langue === 'fr'
      ? `À ${fmtNombre(tauxPct, 1, langue)} % par an : doublement en ${fmtNombre(exact, 2, langue)} ans exactement, ${fmtNombre(approx, 2, langue)} ans par la règle de 72 (erreur ${fmtNombre(erreur, 2, langue)} %).`
      : `At ${fmtNombre(tauxPct, 1, langue)}% per year: doubling in exactly ${fmtNombre(exact, 2, langue)} years, ${fmtNombre(approx, 2, langue)} by the rule of 72 (${fmtNombre(erreur, 2, langue)}% error).`;

  return (
    <div className="my-6 rounded-lg border border-border bg-surface">
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2.5">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">{L.titre}</p>
        <span className="text-[11px] text-text-muted">{L.sousTitre}</span>
      </div>

      {/* Curseur */}
      <div className="px-4 pt-3">
        <label className="flex flex-col gap-0.5">
          <span className="flex items-baseline justify-between gap-2 text-xs text-text-muted">
            <span>{L.taux}</span>
            <strong className="tabular-nums text-[13px] font-semibold text-text">{fmtNombre(tauxPct, 1, langue)} %</strong>
          </span>
          <input
            type="range"
            min={TAUX_MIN}
            max={TAUX_MAX}
            step={TAUX_PAS}
            value={tauxPct}
            onChange={e => setTauxPct(Number(e.target.value))}
            className="h-5 w-full cursor-pointer"
            style={{ accentColor: 'var(--accent)' }}
            aria-label={`${L.taux} : ${fmtNombre(tauxPct, 1, langue)} %`}
          />
        </label>
      </div>

      {/* Chiffres clés */}
      <div className="flex flex-wrap items-end gap-x-6 gap-y-2 px-4 pt-3" aria-live="polite">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-muted">{L.approx}</p>
          <p className="tabular-nums text-2xl font-semibold leading-tight text-accent">
            {fmtNombre(approx, 1, langue)} {L.ans}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-muted">{L.exact}</p>
          <p className="tabular-nums text-2xl font-semibold leading-tight text-text">
            {fmtNombre(exact, 2, langue)} {L.ans}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-muted">{L.erreur}</p>
          <p className="tabular-nums text-2xl font-semibold leading-tight text-warn">
            {fmtNombre(erreur, 2, langue)} %
          </p>
        </div>
      </div>

      {/* Courbes années de doublement vs taux */}
      <div className="px-2 pt-1">
        <svg viewBox={`0 0 ${VB_L} ${VB_H}`} className="block w-full" role="img" aria-label={ariaGraphe}>
          {/* Grille */}
          {[12, 24, 36, 48, 60, 72].map(a => (
            <g key={a}>
              <line x1={M_G} x2={VB_L - M_D} y1={yAns(a)} y2={yAns(a)} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="2 4" />
              <text x={M_G - 5} y={yAns(a) + 2.5} textAnchor="end" fontSize={7.5} fill="var(--text-muted)" className="tabular-nums">{a}</text>
            </g>
          ))}
          {[2, 5, 8, 11, 14].map(t => (
            <text key={t} x={xTaux(t)} y={VB_H - M_B + 12} textAnchor="middle" fontSize={7.5} fill="var(--text-muted)" className="tabular-nums">{t}</text>
          ))}
          <line x1={M_G} x2={VB_L - M_D} y1={yAns(0)} y2={yAns(0)} stroke="var(--border)" strokeWidth={1.2} />
          <text x={VB_L - M_D} y={VB_H - M_B + 22} textAnchor="end" fontSize={7} fill="var(--text-muted)">{L.axeX}</text>
          <text x={M_G + 4} y={M_H + 2} fontSize={7} fill="var(--text-muted)">{L.axeY}</text>

          {/* Approximation 72/r (pointillée) puis exacte */}
          <polyline points={ptsApprox.join(' ')} fill="none" stroke="var(--warn)" strokeWidth={1.4} strokeDasharray="5 4" opacity={0.9} />
          <polyline points={ptsExact.join(' ')} fill="none" stroke="var(--accent)" strokeWidth={2} />
          {/* Point courant */}
          <line x1={xTaux(tauxPct)} x2={xTaux(tauxPct)} y1={M_H} y2={yAns(0)} stroke="var(--text-muted)" strokeWidth={0.75} strokeDasharray="3 3" opacity={0.6} />
          <circle cx={xTaux(tauxPct)} cy={yAns(exact)} r={3.5} fill="var(--accent)" />
          <circle cx={xTaux(tauxPct)} cy={yAns(approx)} r={3} fill="var(--warn)" />

          {/* Légende */}
          <g fontSize={7.5}>
            <line x1={VB_L - M_D - 150} x2={VB_L - M_D - 132} y1={M_H + 4} y2={M_H + 4} stroke="var(--accent)" strokeWidth={2} />
            <text x={VB_L - M_D - 128} y={M_H + 6.5} fill="var(--text-muted)">{L.legendeExact}</text>
            <line x1={VB_L - M_D - 150} x2={VB_L - M_D - 132} y1={M_H + 15} y2={M_H + 15} stroke="var(--warn)" strokeWidth={1.4} strokeDasharray="5 4" />
            <text x={VB_L - M_D - 128} y={M_H + 17.5} fill="var(--text-muted)">{L.legende72}</text>
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
