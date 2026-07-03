import { useState } from 'react';
import { perteTranchePct } from '../../content/modules/05-credit/calculs';
import { useLangue } from '../../engine/useLangue';
import type { Langue } from '../../engine/types';

/* ── La cascade des tranches (module 5) ─────────────────────────────────
   Un portefeuille titrisé découpé en trois tranches (equity, mezzanine,
   senior) définies par leurs points d'attache/détachement ; un curseur de
   pertes du pool montre la subordination à l'œuvre : les pertes mangent
   les tranches DE BAS EN HAUT, chaque tranche transforme une perte
   continue en falaise (clamp de perteTranchePct, calculs.ts).
   HONNÊTETÉ PÉDAGOGIQUE : les pertes sont appliquées d'un coup et en
   pourcentage du pool — la vraie cascade distribue des FLUX (intérêts
   puis principal) dans le temps, avec des tests de couverture qui
   re-routent les flux ; l'ordre de subordination, lui, est exact.       */

const PERTE_MIN = 0;
const PERTE_MAX = 20;
const PERTE_DEFAUT = 2;
const PERTE_PAS = 0.25;
const ATT_MIN = 1;
const ATT_MAX = 5;
const ATT_DEFAUT = 3;
const DET_MIN = 5;
const DET_MAX = 12;
const DET_DEFAUT = 6;

/* Géométrie du SVG : trois barres horizontales (une par tranche). */
const VB_L = 400;
const VB_H = 150;
const M_G = 96;
const M_D = 58;
const M_H = 14;
const TRACE_L = VB_L - M_G - M_D;
const H_BARRE = 26;
const ECART = 14;

/* ── Textes d'interface FR/EN ── */
const TXT = {
  fr: {
    titre: 'La cascade des tranches',
    sousTitre: 'les pertes mangent de bas en haut',
    perte: 'Pertes du portefeuille sous-jacent',
    attache: 'Attache de la mezzanine',
    detachement: 'Détachement de la mezzanine',
    senior: 'Senior',
    mezz: 'Mezzanine',
    equity: 'Equity',
    intacte: 'intacte',
    rasee: 'rasée',
    detruite: 'détruite',
    lecture: 'Lecture',
    honnete:
      'Les pertes sont appliquées d\'un coup, en % du pool — la vraie cascade distribue des FLUX (intérêts puis principal, tests de couverture, re-routage) dans le temps. L\'ordre de subordination, lui, est exact : pas un euro de perte ne touche une tranche tant que celle du dessous n\'est pas entièrement détruite.',
    msgCalme: (a: string) =>
      `Pertes sous le point d\'attache de la mezzanine (${a} %) : seule l\'equity saigne — c\'est exactement son rôle, encaisser les premières pertes pour que les tranches du dessus n\'en voient aucune. Tant que les pertes restent « normales », la subordination fabrique bien de la sécurité.`,
    msgMezz: (m: string) =>
      `La mezzanine perd ${m} % de son notionnel : la falaise est là. Entre son attache et son détachement, chaque point de perte du pool la détruit par blocs entiers — une perte CONTINUE du portefeuille devient une perte à EFFET DE SEUIL pour la tranche. C\'est le levier sans emprunt.`,
    msgSenior: (s: string) =>
      `Les pertes traversent le détachement : le senior perd ${s} % — le scénario que la notation excluait. C\'est 2008 : quand les défauts se corrèlent (retournement NATIONAL de l\'immobilier), les pertes « impossibles » du pool arrivent, et le AAA de structure découvre qu\'il n\'était protégé que par une hypothèse de corrélation.`,
    msgEquityRasee:
      ' L\'equity est rasée — au-delà de ce point, elle n\'absorbe plus rien : la protection des tranches supérieures est une ÉPAISSEUR, pas une immunité.',
  },
  en: {
    titre: 'The tranche waterfall',
    sousTitre: 'losses eat from the bottom up',
    perte: 'Underlying portfolio losses',
    attache: 'Mezzanine attachment',
    detachement: 'Mezzanine detachment',
    senior: 'Senior',
    mezz: 'Mezzanine',
    equity: 'Equity',
    intacte: 'intact',
    rasee: 'wiped out',
    detruite: 'destroyed',
    lecture: 'How to read this',
    honnete:
      'Losses are applied in one shot, as % of the pool — a real waterfall distributes CASH FLOWS (interest then principal, coverage tests, re-routing) over time. The subordination order itself is exact: not one euro of loss touches a tranche until the one below is entirely destroyed.',
    msgCalme: (a: string) =>
      `Losses below the mezzanine attachment point (${a}%): only the equity bleeds — which is exactly its job, absorbing first losses so the tranches above see none. As long as losses stay "normal", subordination genuinely manufactures safety.`,
    msgMezz: (m: string) =>
      `The mezzanine loses ${m}% of its notional: here is the cliff. Between its attachment and detachment points, each point of pool loss destroys it in whole blocks — a CONTINUOUS portfolio loss becomes a THRESHOLD loss for the tranche. Leverage without borrowing.`,
    msgSenior: (s: string) =>
      `Losses break through the detachment point: the senior loses ${s}% — the scenario the rating ruled out. That is 2008: when defaults correlate (a NATIONWIDE housing downturn), the pool\'s "impossible" losses arrive, and structured AAA discovers it was only protected by a correlation assumption.`,
    msgEquityRasee:
      ' The equity is wiped out — beyond this point it absorbs nothing more: the protection of senior tranches is a THICKNESS, not an immunity.',
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
export function TrancheWaterfallSim() {
  const { langue } = useLangue();
  const L = TXT[langue];
  const [pertePct, setPertePct] = useState(PERTE_DEFAUT);
  const [attache, setAttache] = useState(ATT_DEFAUT);
  const [detachement, setDetachement] = useState(DET_DEFAUT);

  const perteEquity = perteTranchePct(pertePct, 0, attache);
  const perteMezz = perteTranchePct(pertePct, attache, detachement);
  const perteSenior = perteTranchePct(pertePct, detachement, 100);

  const tranches = [
    { nom: L.senior, plage: `${fmtNombre(detachement, 0, langue)}-100 %`, perte: perteSenior },
    { nom: L.mezz, plage: `${fmtNombre(attache, 0, langue)}-${fmtNombre(detachement, 0, langue)} %`, perte: perteMezz },
    { nom: L.equity, plage: `0-${fmtNombre(attache, 0, langue)} %`, perte: perteEquity },
  ];

  /* ── Message dynamique selon la hauteur atteinte par les pertes ── */
  const message =
    (pertePct <= attache
      ? L.msgCalme(fmtNombre(attache, 0, langue))
      : pertePct <= detachement
        ? L.msgMezz(fmtNombre(perteMezz, 1, langue))
        : L.msgSenior(fmtNombre(perteSenior, 2, langue))) +
    (perteEquity >= 100 && pertePct > attache ? L.msgEquityRasee : '');

  const curseurs: ReadonlyArray<{
    libelle: string;
    valeur: number;
    affichage: string;
    min: number;
    max: number;
    pas: number;
    surChange: (v: number) => void;
  }> = [
    { libelle: L.perte, valeur: pertePct, affichage: `${fmtNombre(pertePct, 2, langue)} %`, min: PERTE_MIN, max: PERTE_MAX, pas: PERTE_PAS, surChange: setPertePct },
    { libelle: L.attache, valeur: attache, affichage: `${fmtNombre(attache, 0, langue)} %`, min: ATT_MIN, max: ATT_MAX, pas: 1, surChange: setAttache },
    { libelle: L.detachement, valeur: detachement, affichage: `${fmtNombre(detachement, 0, langue)} %`, min: DET_MIN, max: DET_MAX, pas: 1, surChange: setDetachement },
  ];

  const ariaGraphe =
    langue === 'fr'
      ? `Pertes du pool ${fmtNombre(pertePct, 2, langue)} % : equity détruite à ${fmtNombre(perteEquity, 0, langue)} %, mezzanine à ${fmtNombre(perteMezz, 0, langue)} %, senior à ${fmtNombre(perteSenior, 1, langue)} %.`
      : `Pool losses ${fmtNombre(pertePct, 2, langue)}%: equity ${fmtNombre(perteEquity, 0, langue)}% destroyed, mezzanine ${fmtNombre(perteMezz, 0, langue)}%, senior ${fmtNombre(perteSenior, 1, langue)}%.`;

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

      {/* Barres : une par tranche, portion détruite en rouge */}
      <div className="px-2 pt-2">
        <svg viewBox={`0 0 ${VB_L} ${VB_H}`} className="block w-full" role="img" aria-label={ariaGraphe}>
          {tranches.map((t, i) => {
            const y = M_H + i * (H_BARRE + ECART);
            const lDetruite = (t.perte / 100) * TRACE_L;
            const rasee = t.perte >= 100;
            const intacte = t.perte <= 0;
            return (
              <g key={t.nom}>
                {/* Libellé et plage */}
                <text x={M_G - 8} y={y + H_BARRE / 2 - 2} textAnchor="end" fontSize={9} fontWeight={600} fill="var(--text)">
                  {t.nom}
                </text>
                <text x={M_G - 8} y={y + H_BARRE / 2 + 9} textAnchor="end" fontSize={7.5} fill="var(--text-muted)" className="tabular-nums">
                  {t.plage}
                </text>
                {/* Notionnel intact */}
                <rect x={M_G} y={y} width={TRACE_L} height={H_BARRE} rx={3} fill="var(--accent)" opacity={0.25} />
                {/* Portion détruite (depuis la gauche) */}
                {t.perte > 0 && (
                  <rect x={M_G} y={y} width={Math.max(lDetruite, 2)} height={H_BARRE} rx={3} fill="var(--err)" opacity={0.9} />
                )}
                {/* Pourcentage détruit */}
                <text
                  x={VB_L - M_D + 8} y={y + H_BARRE / 2 + 3} textAnchor="start" fontSize={9.5} fontWeight={700}
                  fill={rasee ? 'var(--err)' : intacte ? 'var(--accent)' : 'var(--warn)'} className="tabular-nums"
                >
                  {intacte ? `0 %` : `${fmtNombre(t.perte, t.perte < 10 ? 1 : 0, langue)} %`}
                </text>
                <text x={VB_L - M_D + 8} y={y + H_BARRE / 2 + 13} textAnchor="start" fontSize={7} fill="var(--text-muted)">
                  {rasee ? L.rasee : intacte ? L.intacte : L.detruite}
                </text>
              </g>
            );
          })}
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
