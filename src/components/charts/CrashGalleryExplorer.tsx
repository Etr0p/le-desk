import { useState } from 'react';
import {
  drawdownPct,
  gainRequisPourRecuperer,
  anneesDeRecuperation,
} from '../../content/modules/11-histoire-crises/calculs';
import { useLangue } from '../../engine/useLangue';
import type { Langue } from '../../engine/types';

/* ── Le musée des krachs (module 11) ────────────────────────────────────
   Six catastrophes de référence, pic et creux RÉELS des indices : le
   drawdown, le gain requis pour récupérer et les années de récupération
   théoriques sortent tous de calculs.ts (drawdownPct,
   gainRequisPourRecuperer, anneesDeRecuperation) — rien n'est recopié.
   La récupération RÉELLE (dates historiques, prix seuls, hors dividendes)
   est affichée à côté de la théorie : l'écart EST la leçon (dividendes,
   valorisation de départ, déflation ou stagnation les expliquent).      */

const CROISSANCE_MIN = 3;
const CROISSANCE_MAX = 12;
const CROISSANCE_DEFAUT = 7;

type Krach = {
  id: string;
  indice: string;
  pic: number;
  creux: number;
  datePic: { fr: string; en: string };
  dateCreux: { fr: string; en: string };
  dureeChute: { fr: string; en: string };
  recuperationReelleAnnees: number;
  dateRetour: { fr: string; en: string };
  nom: { fr: string; en: string };
  histoire: { fr: string; en: string };
};

/* Pics et creux de clôture des indices (prix seuls, hors dividendes). */
const KRACHS: Krach[] = [
  {
    id: '1929',
    indice: 'Dow Jones',
    pic: 381.17, creux: 41.22,
    datePic: { fr: '3 sept. 1929', en: 'Sep 3, 1929' },
    dateCreux: { fr: '8 juil. 1932', en: 'Jul 8, 1932' },
    dureeChute: { fr: '34 mois', en: '34 months' },
    recuperationReelleAnnees: 25.2,
    dateRetour: { fr: 'nov. 1954', en: 'Nov 1954' },
    nom: { fr: '1929 — la Grande Dépression', en: '1929 — the Great Depression' },
    histoire: {
      fr: 'Levier 10:1 sur call loans, ruées bancaires en chaîne, Fed passive : le krach devient dépression. Le pire drawdown de l\'histoire des indices américains.',
      en: '10:1 leverage on call loans, chain bank runs, a passive Fed: the crash becomes a depression. The worst drawdown in US index history.',
    },
  },
  {
    id: '1987',
    indice: 'Dow Jones',
    pic: 2722.42, creux: 1738.74,
    datePic: { fr: '25 août 1987', en: 'Aug 25, 1987' },
    dateCreux: { fr: '19 oct. 1987', en: 'Oct 19, 1987' },
    dureeChute: { fr: '2 mois (dont −22,6 % en UN jour)', en: '2 months (incl. −22.6% in ONE day)' },
    recuperationReelleAnnees: 2,
    dateRetour: { fr: 'août 1989', en: 'Aug 1989' },
    nom: { fr: '1987 — le lundi noir', en: '1987 — Black Monday' },
    histoire: {
      fr: 'L\'assurance de portefeuille vend mécaniquement dans la baisse : la pire séance de l\'histoire (−22,6 %), sans récession derrière — récupéré en deux ans.',
      en: 'Portfolio insurance sells mechanically into the fall: the worst session in history (−22.6%), with no recession behind it — recovered in two years.',
    },
  },
  {
    id: '1989',
    indice: 'Nikkei 225',
    pic: 38915.87, creux: 7054.98,
    datePic: { fr: '29 déc. 1989', en: 'Dec 29, 1989' },
    dateCreux: { fr: '10 mars 2009', en: 'Mar 10, 2009' },
    dureeChute: { fr: '19 ans (creux final en 2009)', en: '19 years (final trough in 2009)' },
    recuperationReelleAnnees: 34.2,
    dateRetour: { fr: 'févr. 2024', en: 'Feb 2024' },
    nom: { fr: '1989 — la bulle japonaise', en: '1989 — the Japanese bubble' },
    histoire: {
      fr: 'Actions ET immobilier en bulle, banques zombies, déflation : le Nikkei ne revoit son pic de 1989 qu\'en février 2024 — 34 ans. Acheter cher n\'est jamais neutre.',
      en: 'Equities AND real estate in a bubble, zombie banks, deflation: the Nikkei only saw its 1989 peak again in February 2024 — 34 years. Buying expensive is never neutral.',
    },
  },
  {
    id: '2000',
    indice: 'Nasdaq Composite',
    pic: 5048.62, creux: 1114.11,
    datePic: { fr: '10 mars 2000', en: 'Mar 10, 2000' },
    dateCreux: { fr: '9 oct. 2002', en: 'Oct 9, 2002' },
    dureeChute: { fr: '31 mois', en: '31 months' },
    recuperationReelleAnnees: 15.1,
    dateRetour: { fr: 'avr. 2015', en: 'Apr 2015' },
    nom: { fr: '2000 — la bulle dot-com', en: '2000 — the dot-com bubble' },
    histoire: {
      fr: 'Des valorisations sans bénéfices (« les clics remplacent les profits ») : le Nasdaq perd 78 % en 31 mois et met 15 ans à revoir 5 000 points.',
      en: 'Valuations without earnings (“clicks replace profits”): the Nasdaq loses 78% in 31 months and takes 15 years to see 5,000 again.',
    },
  },
  {
    id: '2008',
    indice: 'S&P 500',
    pic: 1565.15, creux: 676.53,
    datePic: { fr: '9 oct. 2007', en: 'Oct 9, 2007' },
    dateCreux: { fr: '9 mars 2009', en: 'Mar 9, 2009' },
    dureeChute: { fr: '17 mois', en: '17 months' },
    recuperationReelleAnnees: 5.5,
    dateRetour: { fr: 'mars 2013', en: 'Mar 2013' },
    nom: { fr: '2008 — la crise systémique', en: '2008 — the systemic crisis' },
    histoire: {
      fr: 'Des subprimes au run sur le repo : le système bancaire parallèle s\'effondre, Lehman tombe, et il faut le QE et des taux zéro pour récupérer en 5 ans et demi.',
      en: 'From subprime to the repo run: shadow banking collapses, Lehman falls, and it takes QE and zero rates to recover in five and a half years.',
    },
  },
  {
    id: '2020',
    indice: 'S&P 500',
    pic: 3386.15, creux: 2237.4,
    datePic: { fr: '19 févr. 2020', en: 'Feb 19, 2020' },
    dateCreux: { fr: '23 mars 2020', en: 'Mar 23, 2020' },
    dureeChute: { fr: '23 séances', en: '23 sessions' },
    recuperationReelleAnnees: 0.5,
    dateRetour: { fr: 'août 2020', en: 'Aug 2020' },
    nom: { fr: '2020 — le krach COVID', en: '2020 — the COVID crash' },
    histoire: {
      fr: 'Le krach le plus rapide de l\'histoire (−34 % en 23 séances, dash for cash compris) — et la récupération la plus rapide : la Fed écrase la spirale en trois semaines.',
      en: 'The fastest crash in history (−34% in 23 sessions, dash for cash included) — and the fastest recovery: the Fed crushes the spiral in three weeks.',
    },
  },
];

/* Géométrie du SVG (unités viewBox). */
const VB_L = 400;
const VB_H = 170;
const M_G = 118;
const M_D = 52;
const M_H = 10;
const M_B = 20;
const TRACE_L = VB_L - M_G - M_D;
const PAS_LIGNE = (VB_H - M_H - M_B) / KRACHS.length;
const H_BARRE = 13;

/* ── Textes d'interface FR/EN ── */
const TXT = {
  fr: {
    titre: 'Le musée des krachs',
    sousTitre: 'drawdowns réels de clôture, prix seuls (hors dividendes)',
    croissance: 'Croissance hypothétique de récupération',
    parAn: '%/an',
    drawdown: 'Drawdown pic-à-creux',
    gainRequis: 'Gain requis pour récupérer',
    theorique: 'Récupération théorique',
    reelle: 'Récupération réelle',
    ans: 'ans',
    an: 'an',
    chute: 'Chute',
    duree: 'Durée',
    retour: 'retour au pic',
    lecture: 'Lecture',
    honnete:
      'Le drawdown, le gain requis et la récupération théorique sortent des formules du module (prix seuls, croissance composée constante). La récupération réelle est historique, hors dividendes : l\'écart entre les deux est la leçon — les dividendes accélèrent (1929 réel « total return » ≈ 7 ans), la déflation japonaise et les valorisations de départ ralentissent.',
    msgTheoriePlusRapide: (t: string, r: string) =>
      `Théorie ${t} ans, réalité ${r} ans : quand la réalité est PLUS LENTE que la théorie, c'est que la croissance retenue était trop optimiste pour l'époque — valorisation de départ délirante (Nasdaq 2000, Nikkei 1989) ou déflation (1929, Japon). L'hypothèse de croissance est LA variable héroïque de tout plan de récupération.`,
    msgTheoriePlusLente: (t: string, r: string) =>
      `Théorie ${t} ans, réalité ${r} ans : la réalité a été PLUS RAPIDE — dividendes réinvestis, politique monétaire massive (2008, 2020) ou simple krach technique sans récession (1987). Le prix seul sous-estime toujours la récupération d'un investisseur qui réinvestit.`,
  },
  en: {
    titre: 'The crash museum',
    sousTitre: 'actual closing drawdowns, price only (excluding dividends)',
    croissance: 'Hypothetical recovery growth',
    parAn: '%/yr',
    drawdown: 'Peak-to-trough drawdown',
    gainRequis: 'Gain required to recover',
    theorique: 'Theoretical recovery',
    reelle: 'Actual recovery',
    ans: 'yrs',
    an: 'yr',
    chute: 'Fall',
    duree: 'Duration',
    retour: 'back to peak',
    lecture: 'How to read this',
    honnete:
      'The drawdown, required gain and theoretical recovery come from the module\'s formulas (price only, constant compound growth). The actual recovery is historical, excluding dividends: the gap between the two is the lesson — dividends accelerate (1929 total-return reality ≈ 7 years), Japanese deflation and starting valuations slow things down.',
    msgTheoriePlusRapide: (t: string, r: string) =>
      `Theory ${t} yrs, reality ${r} yrs: when reality is SLOWER than theory, the assumed growth was too optimistic for the era — absurd starting valuation (Nasdaq 2000, Nikkei 1989) or deflation (1929, Japan). The growth assumption is THE heroic variable of any recovery plan.`,
    msgTheoriePlusLente: (t: string, r: string) =>
      `Theory ${t} yrs, reality ${r} yrs: reality was FASTER — reinvested dividends, massive monetary policy (2008, 2020) or a purely technical crash with no recession (1987). Price alone always understates the recovery of an investor who reinvests.`,
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
export function CrashGalleryExplorer() {
  const { langue } = useLangue();
  const L = TXT[langue];
  const [selection, setSelection] = useState('1929');
  const [croissancePct, setCroissancePct] = useState(CROISSANCE_DEFAUT);

  const krach = KRACHS.find(k => k.id === selection) ?? KRACHS[0];

  /* ── Tout le chiffré passe par calculs.ts ── */
  const dd = drawdownPct(krach.pic, krach.creux);
  const gain = gainRequisPourRecuperer(-dd);
  const recupTheorique = anneesDeRecuperation(-dd, croissancePct);

  const ddMax = Math.max(...KRACHS.map(k => Math.abs(drawdownPct(k.pic, k.creux))));
  const eX = (v: number) => M_G + (Math.abs(v) / (ddMax * 1.08)) * TRACE_L;

  const fAns = (v: number) =>
    `${fmtNombre(v, 1, langue)} ${v < 1.5 ? L.an : L.ans}`;

  const message =
    recupTheorique < krach.recuperationReelleAnnees
      ? L.msgTheoriePlusRapide(fmtNombre(recupTheorique, 1, langue), fmtNombre(krach.recuperationReelleAnnees, 1, langue))
      : L.msgTheoriePlusLente(fmtNombre(recupTheorique, 1, langue), fmtNombre(krach.recuperationReelleAnnees, 1, langue));

  const ariaGraphe =
    langue === 'fr'
      ? `Drawdowns comparés de six krachs, de ${fmtNombre(drawdownPct(KRACHS[5].pic, KRACHS[5].creux), 1, langue)} % (COVID) à ${fmtNombre(drawdownPct(KRACHS[0].pic, KRACHS[0].creux), 1, langue)} % (1929). Sélection : ${krach.nom.fr}.`
      : `Compared drawdowns of six crashes, from ${fmtNombre(drawdownPct(KRACHS[5].pic, KRACHS[5].creux), 1, langue)}% (COVID) to ${fmtNombre(drawdownPct(KRACHS[0].pic, KRACHS[0].creux), 1, langue)}% (1929). Selected: ${krach.nom.en}.`;

  return (
    <div className="my-6 rounded-lg border border-border bg-surface">
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2.5">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">{L.titre}</p>
        <span className="text-[11px] text-text-muted">{L.sousTitre}</span>
      </div>

      {/* Barres cliquables : un krach par ligne */}
      <div className="px-2 pt-2">
        <svg viewBox={`0 0 ${VB_L} ${VB_H}`} className="block w-full" role="img" aria-label={ariaGraphe}>
          {/* Grille verticale */}
          {[0, 25, 50, 75].map(v => (
            <g key={v}>
              <line
                x1={eX(-v)} x2={eX(-v)} y1={M_H} y2={VB_H - M_B}
                stroke="var(--border)" strokeWidth={v === 0 ? 1.2 : 0.5}
                strokeDasharray={v === 0 ? undefined : '2 4'}
              />
              <text x={eX(-v)} y={VB_H - M_B + 11} textAnchor="middle" fontSize={8} fill="var(--text-muted)">
                −{v} %
              </text>
            </g>
          ))}

          {KRACHS.map((k, i) => {
            const v = drawdownPct(k.pic, k.creux);
            const y = M_H + i * PAS_LIGNE + (PAS_LIGNE - H_BARRE) / 2;
            const actif = k.id === selection;
            return (
              <g
                key={k.id}
                onClick={() => setSelection(k.id)}
                style={{ cursor: 'pointer' }}
                role="button"
                aria-label={`${k.nom[langue]} : ${fmtNombre(v, 1, langue)} %`}
              >
                {/* Zone de clic pleine largeur */}
                <rect x={0} y={M_H + i * PAS_LIGNE} width={VB_L} height={PAS_LIGNE} fill="transparent" />
                <text
                  x={M_G - 6} y={y + H_BARRE / 2 + 3} textAnchor="end" fontSize={8.5}
                  fontWeight={actif ? 700 : 500}
                  fill={actif ? 'var(--text)' : 'var(--text-muted)'}
                >
                  {k.nom[langue].split('—')[0].trim()} · {k.indice}
                </text>
                <rect
                  x={M_G} y={y} width={Math.max(eX(v) - M_G, 1)} height={H_BARRE} rx={2}
                  fill={actif ? 'var(--err)' : 'var(--text-muted)'}
                  opacity={actif ? 0.9 : 0.35}
                />
                <text
                  x={eX(v) + 4} y={y + H_BARRE / 2 + 3} textAnchor="start" fontSize={8.5}
                  fontWeight={actif ? 700 : 500} fill={actif ? 'var(--err)' : 'var(--text-muted)'}
                  className="tabular-nums"
                >
                  {fmtNombre(v, 1, langue)} %
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Détail du krach sélectionné */}
      <div className="border-t border-border px-4 py-3" aria-live="polite">
        <p className="text-sm font-semibold text-text">{krach.nom[langue]}</p>
        <p className="mt-1 text-[11px] leading-relaxed text-text-muted">{krach.histoire[langue]}</p>

        <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-text-muted">{L.drawdown}</p>
            <p className="tabular-nums text-lg font-semibold leading-tight text-err">{fmtNombre(dd, 1, langue)} %</p>
            <p className="text-[10px] text-text-muted">
              {fmtNombre(krach.pic, krach.pic > 10000 ? 0 : 2, langue)} → {fmtNombre(krach.creux, krach.creux > 10000 ? 0 : 2, langue)}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-text-muted">{L.gainRequis}</p>
            <p className="tabular-nums text-lg font-semibold leading-tight text-warn">+{fmtNombre(gain, 0, langue)} %</p>
            <p className="text-[10px] text-text-muted">{L.duree} : {krach.dureeChute[langue]}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-text-muted">{L.theorique} ({fmtNombre(croissancePct, 0, langue)} {L.parAn})</p>
            <p className="tabular-nums text-lg font-semibold leading-tight text-text">{fAns(recupTheorique)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-text-muted">{L.reelle}</p>
            <p className="tabular-nums text-lg font-semibold leading-tight text-accent">{fAns(krach.recuperationReelleAnnees)}</p>
            <p className="text-[10px] text-text-muted">{krach.dateRetour[langue]} — {L.retour}</p>
          </div>
        </div>

        {/* Curseur de croissance hypothétique */}
        <label className="mt-3 flex flex-col gap-0.5">
          <span className="flex items-baseline justify-between gap-2 text-xs text-text-muted">
            <span>{L.croissance}</span>
            <strong className="tabular-nums text-[13px] font-semibold text-text">
              {fmtNombre(croissancePct, 0, langue)} {L.parAn}
            </strong>
          </span>
          <input
            type="range"
            min={CROISSANCE_MIN}
            max={CROISSANCE_MAX}
            step={1}
            value={croissancePct}
            onChange={e => setCroissancePct(Number(e.target.value))}
            className="h-5 w-full cursor-pointer"
            style={{ accentColor: 'var(--accent)' }}
            aria-label={`${L.croissance} : ${croissancePct} ${L.parAn}`}
          />
        </label>
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
