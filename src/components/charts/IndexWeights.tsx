import { useState } from 'react';
import { poidsDansIndice } from '../../content/modules/03-actions-indices/calculs';
import { Button } from '../ui/Button';

/* ── Pondérations d'indice ──────────────────────────────────────────────
   Le même panier de quatre sociétés fictives, trois règles de pondération
   basculables : prix (type Dow Jones), capitalisation flottante (type
   CAC 40 / S&P 500) et équipondération. Les poids en capi sortent de
   poidsDansIndice (calculs.ts) — aucune formule recopiée. Un curseur
   déplace le cours de PetiteTech de ±50 % : son poids s'emballe en mode
   prix, bouge modérément en capi, reste figé en équipondéré.           */

interface Societe {
  nom: string;
  profil: string;
  prixBase: number;    // cours en €
  nbTitresM: number;   // millions de titres en circulation
  flottantPct: number; // part du capital réellement négociable, en %
}

/* Caractéristiques volontairement contrastées : PetiteTech est la plus
   petite capitalisation du panier mais, de loin, l'action la plus chère.
   La somme des cours de base vaut 1 000 € : les poids « prix » se lisent
   de tête (50 € → 5 %, 800 € → 80 %…).                                 */
const SOCIETES: readonly Societe[] = [
  { nom: 'MegaCorp', profil: 'le mastodonte de la cote', prixBase: 50, nbTitresM: 2000, flottantPct: 100 },
  { nom: 'PetiteTech', profil: 'petite capi, action chère', prixBase: 800, nbTitresM: 20, flottantPct: 100 },
  { nom: 'IndusGroupe', profil: 'industriel familial', prixBase: 120, nbTitresM: 500, flottantPct: 55 },
  { nom: 'Bancassur', profil: 'bancassureur', prixBase: 30, nbTitresM: 1500, flottantPct: 80 },
];

const IDX_PETITETECH = 1;
const VAR_MIN = -50;
const VAR_MAX = 50;
const VAR_PAS = 5;

type Mode = 'prix' | 'capi' | 'equi';

const MODES: ReadonlyArray<{ id: Mode; label: string }> = [
  { id: 'prix', label: 'Prix (type Dow)' },
  { id: 'capi', label: 'Capi flottante (type CAC / S&P)' },
  { id: 'equi', label: 'Équipondéré' },
];

/* ── Formats français : virgule décimale, espaces pour les milliers. ── */
function fmtNombre(v: number, dec: number): string {
  const [ent, fra] = Math.abs(v).toFixed(dec).split('.');
  const groupe = ent.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return (v < 0 ? '−' : '') + groupe + (fra ? ',' + fra : '');
}

/** Poids en % : une décimale, virgule française (80 → « 80,0 »). */
function fmtPct(v: number): string {
  return fmtNombre(v, 1);
}

/** Capi en Md€ : une décimale, « ,0 » retiré (16 / 16,8). */
function fmtCapi(v: number): string {
  return fmtNombre(v, 1).replace(/,0$/, '');
}

/** Variation signée : +25, −50, 0. */
function fmtSigne(v: number): string {
  if (v === 0) return '0';
  return (v > 0 ? '+' : '−') + Math.abs(v);
}

/* Les nbTitres sont en millions : les poids étant des ratios, l'unité
   se simplifie — poidsDansIndice reçoit des grandeurs homogènes. */
function poidsSelonMode(mode: Mode, prix: number[]): number[] {
  if (mode === 'prix') {
    const total = prix.reduce((s, p) => s + p, 0);
    return prix.map(p => (p / total) * 100);
  }
  if (mode === 'capi') {
    return poidsDansIndice(
      SOCIETES.map((s, i) => ({ prix: prix[i], nbTitres: s.nbTitresM, flottantPct: s.flottantPct })),
    );
  }
  return SOCIETES.map(() => 100 / SOCIETES.length);
}

function messagePedagogique(mode: Mode, poidsPT: number, poidsPTBase: number, variation: number): string {
  const courant = fmtPct(poidsPT);
  const base = fmtPct(poidsPTBase);
  if (mode === 'prix') {
    const constat = `Seul le cours unitaire compte : PetiteTech, la plus petite capitalisation du panier, pèse ${courant} % de l'indice parce que son action cote cher.`;
    return variation === 0
      ? `${constat} Bougez son prix avec le curseur : son poids va s'emballer.`
      : `${constat} Son cours a bougé de ${fmtSigne(variation)} % et son poids est passé de ${base} % à ${courant} % — le poids suit le prix, pas la taille.`;
  }
  if (mode === 'capi') {
    const constat = `Le poids reflète la capitalisation réellement négociable : MegaCorp domine et PetiteTech retombe à ${courant} %.`;
    return variation === 0
      ? `${constat} Le même curseur ne produira ici qu'un effet modéré.`
      : `${constat} Le même mouvement de ${fmtSigne(variation)} % sur son cours ne l'a déplacée que de ${base} % à ${courant} % — un effet réel, mais proportionné à sa taille.`;
  }
  return `Chaque société pèse ${fmtPct(100 / SOCIETES.length)} %, par décision : le cours ne joue aucun rôle et le curseur ne change rien — à condition de rééquilibrer régulièrement le panier, ce qui a un coût de transaction.`;
}

/* ── Composant ── */
export function IndexWeights() {
  const [mode, setMode] = useState<Mode>('prix');
  const [variation, setVariation] = useState(0);

  const prix = SOCIETES.map((s, i) =>
    i === IDX_PETITETECH ? s.prixBase * (1 + variation / 100) : s.prixBase,
  );
  const poids = poidsSelonMode(mode, prix);
  const poidsBase = poidsSelonMode(mode, SOCIETES.map(s => s.prixBase));
  const message = messagePedagogique(mode, poids[IDX_PETITETECH], poidsBase[IDX_PETITETECH], variation);

  return (
    <div className="my-6 rounded-lg border border-border bg-surface">
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2.5">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
          Pondérations d&rsquo;indice
        </p>
        <span className="text-[11px] text-text-muted">Le même panier, trois indices</span>
      </div>

      {/* Modes de pondération */}
      <div className="flex flex-wrap gap-2 px-4 pt-3" role="group" aria-label="Règle de pondération de l'indice">
        {MODES.map(m => (
          <Button
            key={m.id}
            variante={mode === m.id ? 'primaire' : 'secondaire'}
            taille="sm"
            aria-pressed={mode === m.id}
            onClick={() => setMode(m.id)}
          >
            {m.label}
          </Button>
        ))}
      </div>

      {/* Curseur : choc sur le cours de PetiteTech */}
      <div className="flex flex-wrap items-end gap-x-4 gap-y-2 px-4 pt-3">
        <label className="flex min-w-[220px] flex-1 flex-col gap-0.5">
          <span className="flex items-baseline justify-between gap-2 text-xs text-text-muted">
            <span>Le cours de PetiteTech bouge de…</span>
            <strong className="tabular-nums text-[13px] font-semibold text-text">
              {fmtSigne(variation)} % → {fmtNombre(prix[IDX_PETITETECH], 0)} €
            </strong>
          </span>
          <input
            type="range"
            min={VAR_MIN}
            max={VAR_MAX}
            step={VAR_PAS}
            value={variation}
            onChange={e => setVariation(Number(e.target.value))}
            className="h-5 w-full cursor-pointer"
            style={{ accentColor: 'var(--warn)' }}
          />
        </label>
        <Button
          variante="fantome"
          taille="sm"
          onClick={() => setVariation(0)}
          disabled={variation === 0}
        >
          Réinitialiser
        </Button>
      </div>

      {/* Barres de poids */}
      <div className="space-y-3 px-4 pt-4 pb-1">
        {SOCIETES.map((s, i) => {
          const capiFlottanteMd = (prix[i] * s.nbTitresM * (s.flottantPct / 100)) / 1000;
          const estPetiteTech = i === IDX_PETITETECH;
          return (
            <div key={s.nom}>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[13px] font-medium text-text">
                  {s.nom}{' '}
                  <span className="text-[11px] font-normal text-text-muted">— {s.profil}</span>
                </span>
                <strong className="tabular-nums text-[13px] font-semibold text-text">
                  {fmtPct(poids[i])} %
                </strong>
              </div>
              <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-surface-2">
                <div
                  className="h-full rounded-full transition-[width] duration-500 ease-out"
                  style={{
                    width: `${poids[i]}%`,
                    background: estPetiteTech ? 'var(--warn)' : 'var(--accent)',
                  }}
                />
              </div>
              <p className="mt-0.5 text-[11px] tabular-nums text-text-muted">
                {fmtNombre(prix[i], 0)} € × {fmtNombre(s.nbTitresM, 0)} M de titres · flottant{' '}
                {s.flottantPct} % · capi flottante {fmtCapi(capiFlottanteMd)} Md€
              </p>
            </div>
          );
        })}
      </div>

      {/* Lecture pédagogique selon le mode */}
      <div className="mt-3 border-t border-border px-4 py-3">
        <p className="text-[13px] leading-relaxed text-text-muted" aria-live="polite">
          {message}
        </p>
      </div>
    </div>
  );
}
