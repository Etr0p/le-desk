import { useState } from 'react';
import {
  levierBilan,
  variationActifsFatale,
} from '../../content/modules/11-histoire-crises/calculs';
import { useLangue } from '../../engine/useLangue';
import type { Langue } from '../../engine/types';

/* ── La spirale du levier (module 11) ───────────────────────────────────
   Un bilan levié encaisse un choc, doit se désendetter, vend sous décote,
   la vente re-valorise le book à la baisse, et on recommence : la mécanique
   commune à 1929 (call loans), 1987 (assurance de portefeuille), 1998
   (LTCM), 2008 (repo/CDO) et 2022 (gilts). HONNÊTETÉ PÉDAGOGIQUE :
   l'arithmétique de bilan (levier, choc sur fonds propres, taille de la
   vente forcée, coût de la décote) est EXACTE et passe par calculs.ts ;
   la re-valorisation du book après chaque vente (décote × poids de la
   vente) est une ILLUSTRATION de l'impact de marché, pas une loi.

   Taille de la vente forcée pour revenir au levier cible λ sous décote d
   (dérivée en annexe du ch1) : vendre S en valeur de marché rembourse
   S·(1 − d) de dette et coûte S·d de fonds propres, donc
   A − S = λ·(E − S·d)  ⇒  S = (A − λE)/(1 − λd).
   Si λ·d ≥ 1, le dénominateur s'annule ou change de signe : VENDRE NE
   DÉSENDETTE PLUS — la zone de mort, affichée comme telle.             */

const LEV_MIN = 2;
const LEV_MAX = 40;
const LEV_DEFAUT = 10;
const CHOC_MIN = -10;
const CHOC_MAX = -0.5;
const CHOC_DEFAUT = -3;
const CHOC_PAS = 0.5;
const DEC_MIN = 0;
const DEC_MAX = 8;
const DEC_DEFAUT = 2;
const DEC_PAS = 0.5;
const TOURS_MAX = 7;
const SEUIL_STABILISATION = 0.05; // % de re-valorisation en deçà duquel la spirale s'éteint

/* Géométrie du SVG (unités viewBox). */
const VB_L = 400;
const VB_H = 180;
const M_G = 34;
const M_D = 14;
const M_H = 14;
const M_B = 30;
const TRACE_L = VB_L - M_G - M_D;
const TRACE_H = VB_H - M_H - M_B;

type Tour = {
  numero: number;
  chocPct: number; // re-valorisation subie en début de tour (%)
  fondsPropres: number; // après choc et vente, base 100 au départ
  actifs: number;
  levierCourant: number;
  venteForcee: number; // valeur de marché vendue ce tour
  mort: boolean;
};

/* ── Simulation déterministe de la cascade ── */
function simulerSpirale(levierCible: number, chocInitialPct: number, decotePct: number): {
  tours: Tour[];
  mort: boolean;
  venteImpossible: boolean;
} {
  const d = decotePct / 100;
  const venteImpossible = levierCible * d >= 1;
  let actifs = 100 * levierCible;
  let dette = actifs - 100;
  let fondsPropres = 100;
  let choc = chocInitialPct;
  const tours: Tour[] = [];

  for (let k = 1; k <= TOURS_MAX; k++) {
    // 1. Le choc frappe les actifs ; les fonds propres absorbent tout.
    const perte = (actifs * choc) / 100;
    actifs += perte;
    fondsPropres += perte;
    if (fondsPropres <= 0) {
      tours.push({ numero: k, chocPct: choc, fondsPropres: 0, actifs, levierCourant: Infinity, venteForcee: 0, mort: true });
      return { tours, mort: true, venteImpossible };
    }

    // 2. Retour au levier cible par vente forcée : S = (A − λE)/(1 − λd),
    //    plafonné à la taille du book (au-delà : liquidation totale).
    let vente = 0;
    const exces = actifs - levierCible * fondsPropres;
    if (exces > 0 && !venteImpossible) {
      vente = Math.min(exces / (1 - levierCible * d), actifs);
      actifs -= vente;
      dette -= vente * (1 - d);
      fondsPropres -= vente * d;
      if (fondsPropres <= 0) {
        tours.push({ numero: k, chocPct: choc, fondsPropres: 0, actifs, levierCourant: Infinity, venteForcee: vente, mort: true });
        return { tours, mort: true, venteImpossible };
      }
      if (actifs <= 0) {
        // Tout est vendu : le fonds est liquidé, il reste le cash résiduel.
        tours.push({ numero: k, chocPct: choc, fondsPropres, actifs: 0, levierCourant: 0, venteForcee: vente, mort: false });
        return { tours, mort: false, venteImpossible };
      }
    }

    const levierCourant = levierBilan(actifs, fondsPropres);
    tours.push({ numero: k, chocPct: choc, fondsPropres, actifs, levierCourant, venteForcee: vente, mort: false });

    // 3. La vente re-valorise le book restant (ILLUSTRATIF : décote × poids
    //    de la vente dans le book pré-vente) — le choc du tour suivant.
    if (venteImpossible) {
      // Sans possibilité de vendre, le levier dérive : on subit le même choc de marché affaibli.
      choc = choc / 2;
      if (Math.abs(choc) < SEUIL_STABILISATION) break;
      continue;
    }
    const poidsVente = vente / (actifs + vente);
    choc = -(decotePct * poidsVente);
    if (Math.abs(choc) < SEUIL_STABILISATION) break;
  }
  void dette;
  return { tours, mort: false, venteImpossible };
}

/* ── Textes d'interface FR/EN ── */
const TXT = {
  fr: {
    titre: 'La spirale du levier',
    sousTitre: 'choc → fonds propres → vente forcée → re-valorisation → re-choc',
    levier: 'Levier initial (actifs / fonds propres)',
    choc: 'Choc initial sur les actifs',
    decote: 'Décote de vente forcée',
    tour: 'Tour',
    fondsPropres: 'Fonds propres restants',
    distanceMort: 'Choc fatal (un seul coup)',
    vente: 'vendu',
    mort: 'FONDS PROPRES ÉPUISÉS',
    survie: 'La spirale s\'éteint',
    lecture: 'Lecture',
    honnete:
      'L\'arithmétique de bilan est exacte (levier, perte sur fonds propres, taille de la vente S = (A − λE)/(1 − λd), coût de la décote). La re-valorisation du book après chaque vente — décote × poids de la vente — est une illustration de l\'impact de marché, pas une loi : dans la réalité, elle dépend de la profondeur du marché et de qui d\'autre vend en même temps.',
    msgVenteImpossible: (lev: string, dec: string) =>
      `Zone de mort : au levier ${lev}, une décote de ${dec} % rend le désendettement IMPOSSIBLE (λ·d ≥ 1) — chaque euro vendu détruit plus de fonds propres qu'il ne rembourse de dette. C'est LTCM en septembre 1998 et les fonds LDI en septembre 2022 : il n'y a plus que deux sorties, le sauvetage ou la faillite.`,
    msgMortTour1: (fatal: string) =>
      `Mort au premier choc : à ce levier, le choc fatal était de ${fatal} % (−100/levier) — le choc subi l'a dépassé. Le spéculateur de 1929 sur call loans à 10 % de couverture mourait sur −10 % ; vous venez de reproduire sa journée.`,
    msgMortSpirale: (n: string) =>
      `Le premier choc ne tuait pas — la SPIRALE a tué au tour ${n} : chaque vente forcée re-valorise le book à la baisse, ce qui force la vente suivante. C'est la leçon de 1987, de 2008 et des gilts 2022 : ce n'est pas le choc qui tue, c'est le désendettement forcé sous décote.`,
    msgSurvie: (n: string, e: string) =>
      `La spirale s'éteint au tour ${n} avec ${e} % des fonds propres intacts : le choc initial était absorbable et chaque tour de vente pèse moins que le précédent (série convergente). Baissez la décote ou le levier et regardez la spirale s'éteindre plus vite — c'est exactement le rôle des acheteurs en dernier ressort : casser la boucle en écrasant la décote.`,
    msgRuine: (e: string) =>
      `Techniquement vivant, économiquement mort : il reste ${e} % des fonds propres. C'est le LTCM de septembre 1998 — pas de faillite au sens juridique, mais −92 % et un consortium qui reprend le book. À ce niveau de perte, les investisseurs retirent, les prêteurs coupent, et la liquidation est forcée de toute façon.`,
    msgDefaut:
      'Bougez les curseurs : le levier fixe la distance à la mort (−100/levier), la décote décide si la spirale converge ou diverge.',
  },
  en: {
    titre: 'The leverage spiral',
    sousTitre: 'shock → equity → forced sale → re-marking → new shock',
    levier: 'Initial leverage (assets / equity)',
    choc: 'Initial asset shock',
    decote: 'Fire-sale discount',
    tour: 'Round',
    fondsPropres: 'Remaining equity',
    distanceMort: 'Fatal shock (single blow)',
    vente: 'sold',
    mort: 'EQUITY WIPED OUT',
    survie: 'The spiral dies out',
    lecture: 'How to read this',
    honnete:
      'The balance-sheet arithmetic is exact (leverage, equity hit, sale size S = (A − λE)/(1 − λd), discount cost). The re-marking of the book after each sale — discount × sale weight — is an illustration of market impact, not a law: in reality it depends on market depth and on who else is selling at the same time.',
    msgVenteImpossible: (lev: string, dec: string) =>
      `Death zone: at leverage ${lev}, a ${dec}% discount makes deleveraging IMPOSSIBLE (λ·d ≥ 1) — every euro sold destroys more equity than it repays debt. That is LTCM in September 1998 and the LDI funds in September 2022: only two exits remain, rescue or bankruptcy.`,
    msgMortTour1: (fatal: string) =>
      `Dead on the first shock: at this leverage the fatal shock was ${fatal}% (−100/leverage) — the shock exceeded it. The 1929 call-loan speculator on 10% margin died on −10%; you have just replayed his day.`,
    msgMortSpirale: (n: string) =>
      `The first shock did not kill — the SPIRAL killed at round ${n}: each forced sale re-marks the book lower, which forces the next sale. That is the lesson of 1987, 2008 and the 2022 gilts: it is not the shock that kills, it is forced deleveraging under a discount.`,
    msgSurvie: (n: string, e: string) =>
      `The spiral dies out at round ${n} with ${e}% of equity intact: the initial shock was absorbable and each round of selling weighs less than the previous one (a convergent series). Lower the discount or the leverage and watch the spiral die faster — that is exactly what buyers of last resort do: break the loop by crushing the discount.`,
    msgRuine: (e: string) =>
      `Technically alive, economically dead: ${e}% of equity remains. That is LTCM in September 1998 — no legal bankruptcy, but −92% and a consortium taking over the book. At that level of loss, investors redeem, lenders cut, and liquidation is forced anyway.`,
    msgDefaut:
      'Move the sliders: leverage sets the distance to death (−100/leverage), the discount decides whether the spiral converges or diverges.',
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
export function LeverageSpiralSim() {
  const { langue } = useLangue();
  const L = TXT[langue];
  const [levier, setLevier] = useState(LEV_DEFAUT);
  const [chocPct, setChocPct] = useState(CHOC_DEFAUT);
  const [decotePct, setDecotePct] = useState(DEC_DEFAUT);

  const { tours, mort, venteImpossible } = simulerSpirale(levier, chocPct, decotePct);
  const dernier = tours[tours.length - 1];
  const chocFatal = variationActifsFatale(levier);

  /* ── Échelles : fonds propres 0-100 en barres par tour ── */
  const nbBarres = Math.max(tours.length, 3);
  const largBarre = Math.min(46, (TRACE_L / nbBarres) * 0.6);
  const xBarre = (i: number) => M_G + ((i + 0.5) / nbBarres) * TRACE_L - largBarre / 2;
  const yVal = (v: number) => M_H + TRACE_H * (1 - Math.max(0, Math.min(v, 110)) / 110);

  /* ── Message dynamique ──
     msgMortTour1 seulement si le choc initial dépassait à lui seul le choc
     fatal (−100/levier) ; sinon, mort au tour 1 ou après, c'est la vente
     forcée sous décote qui a tué : msgMortSpirale. */
  const message = venteImpossible
    ? L.msgVenteImpossible(fmtNombre(levier, 0, langue), fmtNombre(decotePct, 1, langue))
    : mort && tours.length === 1 && chocPct <= chocFatal
      ? L.msgMortTour1(fmtNombre(chocFatal, 1, langue))
      : mort
        ? L.msgMortSpirale(String(dernier.numero))
        : dernier.fondsPropres < 25
          ? L.msgRuine(fmtNombre(dernier.fondsPropres, 1, langue))
          : tours.length > 1
            ? L.msgSurvie(String(dernier.numero), fmtNombre(dernier.fondsPropres, 1, langue))
            : L.msgDefaut;

  const curseurs: ReadonlyArray<{
    libelle: string;
    valeur: number;
    affichage: string;
    min: number;
    max: number;
    pas: number;
    surChange: (v: number) => void;
  }> = [
    { libelle: L.levier, valeur: levier, affichage: `× ${fmtNombre(levier, 0, langue)}`, min: LEV_MIN, max: LEV_MAX, pas: 1, surChange: setLevier },
    { libelle: L.choc, valeur: chocPct, affichage: `${fmtNombre(chocPct, 1, langue)} %`, min: CHOC_MIN, max: CHOC_MAX, pas: CHOC_PAS, surChange: setChocPct },
    { libelle: L.decote, valeur: decotePct, affichage: `${fmtNombre(decotePct, 1, langue)} %`, min: DEC_MIN, max: DEC_MAX, pas: DEC_PAS, surChange: setDecotePct },
  ];

  const ariaGraphe =
    langue === 'fr'
      ? `Spirale de désendettement au levier ${levier} : ${tours.length} tours, ${mort ? 'fonds propres épuisés' : `fonds propres finaux ${fmtNombre(dernier.fondsPropres, 1, langue)} %`}.`
      : `Deleveraging spiral at leverage ${levier}: ${tours.length} rounds, ${mort ? 'equity wiped out' : `final equity ${fmtNombre(dernier.fondsPropres, 1, langue)}%`}.`;

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

      {/* Chiffres clés : distance à la mort et état final */}
      <div className="flex flex-wrap items-end gap-x-6 gap-y-2 px-4 pt-3" aria-live="polite">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-muted">{L.distanceMort}</p>
          <p className="tabular-nums text-2xl font-semibold leading-tight text-warn">
            {fmtNombre(chocFatal, 1, langue)} %
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-muted">{L.fondsPropres}</p>
          <p className={`tabular-nums text-2xl font-semibold leading-tight ${mort ? 'text-err' : 'text-accent'}`}>
            {mort ? '0' : fmtNombre(dernier.fondsPropres, 1, langue)} %
          </p>
        </div>
      </div>

      {/* Barres : fonds propres tour par tour */}
      <div className="px-2 pt-1">
        <svg viewBox={`0 0 ${VB_L} ${VB_H}`} className="block w-full" role="img" aria-label={ariaGraphe}>
          {/* Grille horizontale */}
          {[0, 25, 50, 75, 100].map(v => (
            <g key={v}>
              <line
                x1={M_G} x2={VB_L - M_D} y1={yVal(v)} y2={yVal(v)}
                stroke="var(--border)" strokeWidth={v === 0 ? 1.2 : 0.5}
                strokeDasharray={v === 0 ? undefined : '2 4'}
              />
              <text x={M_G - 5} y={yVal(v) + 2.5} textAnchor="end" fontSize={7.5} fill="var(--text-muted)">
                {v}
              </text>
            </g>
          ))}
          {/* Ligne de départ : 100 % de fonds propres */}
          <line
            x1={M_G} x2={VB_L - M_D} y1={yVal(100)} y2={yVal(100)}
            stroke="var(--text-muted)" strokeWidth={0.75} strokeDasharray="4 3" opacity={0.6}
          />

          {/* Une barre de fonds propres par tour */}
          {tours.map((t, i) => {
            const h = Math.max(yVal(0) - yVal(t.fondsPropres), t.mort ? 2 : 0.75);
            return (
              <g key={t.numero}>
                <rect
                  x={xBarre(i)} y={t.mort ? yVal(0) - 2 : yVal(t.fondsPropres)}
                  width={largBarre} height={h} rx={2}
                  fill={t.mort ? 'var(--err)' : 'var(--accent)'}
                  opacity={t.mort ? 0.9 : 0.85}
                />
                <text
                  x={xBarre(i) + largBarre / 2} y={(t.mort ? yVal(0) - 2 : yVal(t.fondsPropres)) - 4}
                  textAnchor="middle" fontSize={8} fontWeight={600}
                  fill={t.mort ? 'var(--err)' : 'var(--text)'} className="tabular-nums"
                >
                  {t.mort ? '✕' : fmtNombre(t.fondsPropres, 0, langue)}
                </text>
                {/* Choc subi et vente du tour */}
                <text x={xBarre(i) + largBarre / 2} y={VB_H - M_B + 10} textAnchor="middle" fontSize={7.5} fill="var(--text-muted)">
                  {L.tour} {t.numero}
                </text>
                <text x={xBarre(i) + largBarre / 2} y={VB_H - M_B + 19} textAnchor="middle" fontSize={7} fill="var(--err)" className="tabular-nums">
                  {fmtNombre(t.chocPct, 1, langue)} %
                </text>
                {t.venteForcee > 0.5 && (
                  <text x={xBarre(i) + largBarre / 2} y={VB_H - M_B + 27} textAnchor="middle" fontSize={6.5} fill="var(--text-muted)" className="tabular-nums">
                    {L.vente} {fmtNombre(t.venteForcee, 0, langue)}
                  </text>
                )}
              </g>
            );
          })}

          {/* Verdict */}
          <text
            x={VB_L - M_D} y={M_H + 4} textAnchor="end" fontSize={8.5} fontWeight={700}
            fill={mort || venteImpossible ? 'var(--err)' : 'var(--accent)'}
          >
            {venteImpossible ? 'λ·d ≥ 1' : mort ? L.mort : tours.length > 1 ? L.survie : ''}
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
