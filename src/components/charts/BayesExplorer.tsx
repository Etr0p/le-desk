import { useState } from 'react';
import { bayesAPosterioriPct } from '../../content/modules/13-brainteasers-oral/calculs';
import { useLangue } from '../../engine/useLangue';
import type { Langue } from '../../engine/types';

/* ── L'explorateur de Bayes (module 13) ─────────────────────────────────
   Trois curseurs (prévalence, sensibilité, taux de faux positifs) : le
   composant applique la « méthode des 10 000 » — convertir les % en
   effectifs — et montre les deux populations qui se disputent un test
   positif : les vrais positifs et les faux positifs. La probabilité a
   posteriori sort de calculs.ts. HONNÊTETÉ PÉDAGOGIQUE : le modèle
   suppose la prévalence connue et le test indépendant du reste — dans la
   vraie vie, la difficulté est justement d'estimer la prévalence (le taux
   de base), et c'est là que l'intuition échoue en premier.              */

const PREV_MIN = 0.1;
const PREV_MAX = 50;
const PREV_DEFAUT = 1;
const PREV_PAS = 0.1;
const SENS_MIN = 80;
const SENS_MAX = 99.9;
const SENS_DEFAUT = 99;
const SENS_PAS = 0.1;
const FP_MIN = 0.5;
const FP_MAX = 20;
const FP_DEFAUT = 5;
const FP_PAS = 0.5;
const POPULATION = 10000;

/* Géométrie du SVG : deux barres horizontales (vrais/faux positifs). */
const VB_L = 400;
const VB_H = 132;
const M_G = 118;
const M_D = 64;
const M_H = 16;
const H_BARRE = 30;
const ECART = 22;
const TRACE_L = VB_L - M_G - M_D;

/* ── Textes d'interface FR/EN ── */
const TXT = {
  fr: {
    titre: 'Bayes : la méthode des 10 000',
    sousTitre: 'qui se cache derrière un test positif ?',
    prev: 'Prévalence (taux de base)',
    sens: 'Sensibilité du test',
    fp: 'Taux de faux positifs',
    posterior: 'P(vrai | test positif)',
    vrais: 'Vrais positifs',
    faux: 'Faux positifs',
    sur: (n: string) => `sur ${n} personnes`,
    lecture: 'Lecture',
    honnete:
      'Le modèle suppose la prévalence CONNUE et le test indépendant de tout le reste. Dans la vraie vie, la difficulté est précisément d\'estimer le taux de base — et l\'erreur d\'intuition universelle (le « base rate neglect ») consiste à l\'ignorer : on lit « test fiable à 99 % » et on répond 99 %, en oubliant de demander « fiable sur QUELLE population ? ».',
    msgNoye: (post: string, vrais: string, faux: string) =>
      `À cette prévalence, un test positif ne dit presque rien : ${post} % seulement de chances d\'être un vrai positif. Regardez les barres : sur 10 000 personnes, ${vrais} vrais positifs contre ${faux} faux positifs — la maladie est si rare que les erreurs du test, même peu fréquentes, NOIENT les vrais cas. C\'est LE piège d\'entretien : l\'intuition répond « 99 % » en confondant P(test+ | malade) et P(malade | test+).`,
    msgEquilibre: (post: string) =>
      `Zone d\'équilibre : ${post} % — le test informe, mais ne conclut pas. La méthode à réciter : partir de 10 000 personnes, compter les malades détectés, compter les faux positifs chez les sains, faire le ratio. Trois lignes de calcul mental qui remplacent la formule — et qui montrent au jury que vous RAISONNEZ au lieu de réciter.',
    msgDomine: (post: string) =>
      `À prévalence élevée, le test devient concluant : ${post} %. Le taux de base porte le résultat — la même mécanique qui rend un signal de crise crédible quand les fragilités sont déjà visibles (m10, m11) et douteux en temps calme. Bayes en une phrase d\'oral : « la force d\'un signal dépend de la rareté de ce qu\'il cherche ».`,
  },
  en: {
    titre: 'Bayes: the 10,000 method',
    sousTitre: 'who is hiding behind a positive test?',
    prev: 'Prevalence (base rate)',
    sens: 'Test sensitivity',
    fp: 'False positive rate',
    posterior: 'P(true | positive test)',
    vrais: 'True positives',
    faux: 'False positives',
    sur: (n: string) => `out of ${n} people`,
    lecture: 'How to read this',
    honnete:
      'The model assumes the prevalence is KNOWN and the test independent of everything else. In real life the hard part is precisely estimating the base rate — and the universal intuition error ("base rate neglect") is to ignore it: people read "99% reliable test" and answer 99%, forgetting to ask "reliable on WHICH population?".',
    msgNoye: (post: string, vrais: string, faux: string) =>
      `At this prevalence, a positive test says almost nothing: only ${post}% odds of being a true positive. Look at the bars: out of 10,000 people, ${vrais} true positives against ${faux} false positives — the condition is so rare that the test\'s errors, however infrequent, DROWN the true cases. THE interview trap: intuition answers "99%", confusing P(test+ | sick) with P(sick | test+).`,
    msgEquilibre: (post: string) =>
      `Balanced zone: ${post}% — the test informs but does not conclude. The method to recite: start from 10,000 people, count the detected sick, count the false positives among the healthy, take the ratio. Three lines of mental arithmetic replacing the formula — showing the jury you REASON instead of reciting.',
    msgDomine: (post: string) =>
      `At high prevalence the test becomes conclusive: ${post}%. The base rate carries the result — the same mechanics that make a crisis signal credible when fragilities are already visible (m10, m11) and dubious in calm times. Bayes in one oral sentence: "the strength of a signal depends on the rarity of what it is looking for".`,
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
export function BayesExplorer() {
  const { langue } = useLangue();
  const L = TXT[langue];
  const [prevPct, setPrevPct] = useState(PREV_DEFAUT);
  const [sensPct, setSensPct] = useState(SENS_DEFAUT);
  const [fpPct, setFpPct] = useState(FP_DEFAUT);

  const posterior = bayesAPosterioriPct(prevPct, sensPct, fpPct);
  const vraisPositifs = POPULATION * (prevPct / 100) * (sensPct / 100);
  const fauxPositifs = POPULATION * (1 - prevPct / 100) * (fpPct / 100);
  const maxBarre = Math.max(vraisPositifs, fauxPositifs, 1);

  const barres = [
    { nom: L.vrais, valeur: vraisPositifs, couleur: 'var(--accent)' },
    { nom: L.faux, valeur: fauxPositifs, couleur: 'var(--err)' },
  ];

  const message =
    posterior < 40
      ? L.msgNoye(fmtNombre(posterior, 1, langue), fmtNombre(Math.round(vraisPositifs), 0, langue), fmtNombre(Math.round(fauxPositifs), 0, langue))
      : posterior < 80
        ? L.msgEquilibre(fmtNombre(posterior, 1, langue))
        : L.msgDomine(fmtNombre(posterior, 1, langue));

  const curseurs: ReadonlyArray<{
    libelle: string;
    valeur: number;
    affichage: string;
    min: number;
    max: number;
    pas: number;
    surChange: (v: number) => void;
  }> = [
    { libelle: L.prev, valeur: prevPct, affichage: `${fmtNombre(prevPct, 1, langue)} %`, min: PREV_MIN, max: PREV_MAX, pas: PREV_PAS, surChange: setPrevPct },
    { libelle: L.sens, valeur: sensPct, affichage: `${fmtNombre(sensPct, 1, langue)} %`, min: SENS_MIN, max: SENS_MAX, pas: SENS_PAS, surChange: setSensPct },
    { libelle: L.fp, valeur: fpPct, affichage: `${fmtNombre(fpPct, 1, langue)} %`, min: FP_MIN, max: FP_MAX, pas: FP_PAS, surChange: setFpPct },
  ];

  const ariaGraphe =
    langue === 'fr'
      ? `Sur 10 000 personnes : ${Math.round(vraisPositifs)} vrais positifs, ${Math.round(fauxPositifs)} faux positifs — probabilité a posteriori ${fmtNombre(posterior, 1, langue)} %.`
      : `Out of 10,000 people: ${Math.round(vraisPositifs)} true positives, ${Math.round(fauxPositifs)} false positives — posterior probability ${fmtNombre(posterior, 1, langue)}%.`;

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

      {/* Chiffre clé */}
      <div className="flex flex-wrap items-end gap-x-6 gap-y-2 px-4 pt-3" aria-live="polite">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-muted">{L.posterior}</p>
          <p className={`tabular-nums text-2xl font-semibold leading-tight ${posterior < 40 ? 'text-err' : posterior < 80 ? 'text-warn' : 'text-accent'}`}>
            {fmtNombre(posterior, 1, langue)} %
          </p>
        </div>
        <p className="pb-1 text-[11px] text-text-muted">{L.sur(langue === 'fr' ? '10 000' : '10,000')}</p>
      </div>

      {/* Barres : vrais vs faux positifs */}
      <div className="px-2 pt-2">
        <svg viewBox={`0 0 ${VB_L} ${VB_H}`} className="block w-full" role="img" aria-label={ariaGraphe}>
          {barres.map((b, i) => {
            const y = M_H + i * (H_BARRE + ECART);
            const l = Math.max((b.valeur / maxBarre) * TRACE_L, 2);
            return (
              <g key={b.nom}>
                <text x={M_G - 8} y={y + H_BARRE / 2 + 3} textAnchor="end" fontSize={9} fontWeight={600} fill="var(--text)">
                  {b.nom}
                </text>
                <rect x={M_G} y={y} width={TRACE_L} height={H_BARRE} rx={3} fill="var(--border)" opacity={0.35} />
                <rect x={M_G} y={y} width={l} height={H_BARRE} rx={3} fill={b.couleur} opacity={0.85} />
                <text x={VB_L - M_D + 8} y={y + H_BARRE / 2 + 3.5} textAnchor="start" fontSize={10} fontWeight={700} fill={b.couleur} className="tabular-nums">
                  {Math.round(b.valeur).toLocaleString(langue === 'fr' ? 'fr-FR' : 'en-US')}
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
