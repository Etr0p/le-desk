import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { mulberry32, newSeed, randInt } from '../../engine/rng';
import type { Rng } from '../../engine/rng';
import {
  executionCarnet,
  milieuFourchette,
  slippage,
  spreadAbsolu,
  spreadPb,
} from '../../content/modules/01-panorama-marches/calculs';
import type { NiveauCarnet, SensOrdre } from '../../content/modules/01-panorama-marches/calculs';
import { Button } from '../ui/Button';

/* ── Simulateur de carnet d'ordres ──────────────────────────────────────
   Carnet à 5 niveaux bid / 5 niveaux ask autour de 100,00 €, tiré de
   mulberry32(graine) : même graine ⇒ même carnet (déterminisme testable).
   Deux gestes : un ordre AU MARCHÉ qui consomme les niveaux un à un
   (animation), chiffré par executionCarnet/slippage du module 1 ; un
   ordre LIMITE qui s'insère dans le carnet et y attend. Aucun flux
   adverse n'est simulé : ce que montre le carnet est exactement ce que
   calculent les fonctions de calculs.ts.                              */

const GRAINE_INITIALE = 20260611;
const TICK = 0.01; // pas de cotation : 1 centime
const NB_NIVEAUX = 5;
const QTE_MIN = 100;
const QTE_MAX = 2000;
const QTE_PAS = 100;
const PRIX_LIM_MIN_C = 9970; // bornes du curseur de prix limite, en centimes
const PRIX_LIM_MAX_C = 10030;
const DUREE_ETAPE_MS = 380; // une étape d'animation = un niveau consommé

export interface NiveauVue {
  prix: number; // € par titre
  taille: number; // taille initiale du niveau
  restant: number; // ce qui reste après les ordres au marché déjà envoyés
}

export interface CarnetSim {
  bids: NiveauVue[]; // triés du meilleur (prix le plus haut) au plus éloigné
  asks: NiveauVue[]; // triés du meilleur (prix le plus bas) au plus éloigné
}

interface OrdreLimite {
  sens: SensOrdre;
  prix: number;
  quantite: number;
}

interface Resultat {
  sens: SensOrdre;
  quantite: number;
  prixMoyen: number;
  coutTotal: number;
  niveauxConsommes: number;
  slippageParTitre: number; // vs milieu avant l'ordre, € par titre (signé)
  milieuAvant: number;
}

function arrondiCent(p: number): number {
  return Math.round(p * 100) / 100;
}

function enCentimes(p: number): number {
  return Math.round(p * 100);
}

/* Une cote : prix qui s'éloignent du meilleur niveau par sauts de 1 à 3
   ticks, tailles en multiples de 100. La profondeur totale est complétée
   à QTE_MAX au moins, pour que le plus gros ordre du curseur passe
   toujours sur un carnet neuf. */
function genererCote(rng: Rng, depart: number, sens: 1 | -1): NiveauVue[] {
  const niveaux: NiveauVue[] = [];
  let prix = depart;
  for (let i = 0; i < NB_NIVEAUX; i++) {
    if (i > 0) prix = arrondiCent(prix + sens * TICK * randInt(rng, 1, 3));
    const taille = 100 * randInt(rng, 3, 8);
    niveaux.push({ prix, taille, restant: taille });
  }
  let total = niveaux.reduce((s, n) => s + n.taille, 0);
  while (total < QTE_MAX) {
    const i = randInt(rng, 0, NB_NIVEAUX - 1);
    niveaux[i].taille += 100;
    niveaux[i].restant += 100;
    total += 100;
  }
  return niveaux;
}

/** Exportée pour la vérification : même graine ⇒ même carnet. */
export function genererCarnet(graine: number): CarnetSim {
  const rng = mulberry32(graine);
  const milieuTicks = randInt(rng, -2, 2); // milieu entre 99,98 et 100,02
  const demiSpreadTicks = randInt(rng, 2, 5); // fourchette de 4 à 10 centimes
  const meilleurBid = arrondiCent(100 + (milieuTicks - demiSpreadTicks) * TICK);
  const meilleurAsk = arrondiCent(100 + (milieuTicks + demiSpreadTicks) * TICK);
  return {
    bids: genererCote(rng, meilleurBid, -1),
    asks: genererCote(rng, meilleurAsk, +1),
  };
}

/* ── Formats français : virgule décimale, espaces pour les milliers. ── */
function fmtNombre(v: number, dec: number): string {
  const [ent, fra] = Math.abs(v).toFixed(dec).split('.');
  const groupe = ent.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return (v < 0 ? '−' : '') + groupe + (fra ? ',' + fra : '');
}

function fmtPrix(v: number): string {
  return fmtNombre(v, 2);
}

/* ── Bouton segment (sens, type d'ordre) ── */
interface SegmentProps {
  actif: boolean;
  onClick: () => void;
  children: ReactNode;
}

function Segment({ actif, onClick, children }: SegmentProps) {
  return (
    <button
      type="button"
      aria-pressed={actif}
      onClick={onClick}
      className={`rounded-md border px-3 py-1.5 text-[12px] font-medium transition-colors duration-150 ${
        actif
          ? 'border-accent/60 bg-accent/12 text-accent'
          : 'border-border bg-surface-2 text-text-muted hover:border-text-muted/40 hover:text-text'
      }`}
    >
      {children}
    </button>
  );
}

/* ── Curseur : input range natif étiqueté, accessible au clavier. ── */
interface CurseurProps {
  label: string;
  affichage: string;
  min: number;
  max: number;
  pas: number;
  valeur: number;
  onChange: (v: number) => void;
}

function Curseur({ label, affichage, min, max, pas, valeur, onChange }: CurseurProps) {
  return (
    <label className="flex flex-col gap-0.5">
      <span className="flex items-baseline justify-between gap-2 text-xs text-text-muted">
        <span>{label}</span>
        <strong className="tabular-nums text-[13px] font-semibold text-text">{affichage}</strong>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={pas}
        value={valeur}
        onChange={e => onChange(Number(e.target.value))}
        className="h-5 w-full cursor-pointer"
        style={{ accentColor: 'var(--accent)' }}
      />
    </label>
  );
}

/* ── Lignes du carnet affiché (ordre limite de l'utilisateur inséré) ── */
interface Ligne {
  cle: string;
  type: 'ask' | 'bid';
  prix: number;
  restant: number;
  cumul: number; // profondeur cumulée depuis la meilleure limite du côté
  votreOrdre: boolean;
}

function lignesCote(niveaux: NiveauVue[], type: 'ask' | 'bid', ordre: OrdreLimite | null): Ligne[] {
  const items: Array<{ prix: number; restant: number; votreOrdre: boolean }> = niveaux.map(n => ({
    prix: n.prix,
    restant: n.restant,
    votreOrdre: false,
  }));
  const ordreIci =
    ordre !== null &&
    ((type === 'bid' && ordre.sens === 'achat') || (type === 'ask' && ordre.sens === 'vente'));
  if (ordre && ordreIci) {
    // Position dans la file : meilleur prix d'abord ; à prix égal, derrière
    // les ordres déjà présents (priorité prix, puis temps).
    const c = enCentimes(ordre.prix);
    let i = 0;
    while (
      i < items.length &&
      (type === 'bid' ? enCentimes(items[i].prix) >= c : enCentimes(items[i].prix) <= c)
    ) {
      i++;
    }
    items.splice(i, 0, { prix: ordre.prix, restant: ordre.quantite, votreOrdre: true });
  }
  let cumul = 0;
  return items.map((n, i) => {
    cumul += n.restant;
    return { cle: `${type}-${i}`, type, prix: n.prix, restant: n.restant, cumul, votreOrdre: n.votreOrdre };
  });
}

function Rangee({ ligne, maxCumul }: { ligne: Ligne; maxCumul: number }) {
  const estAsk = ligne.type === 'ask';
  const vide = ligne.restant === 0;
  const largeur = vide ? 0 : Math.max(3, (ligne.cumul / maxCumul) * 100);
  return (
    <div
      role="row"
      className={`relative grid grid-cols-[64px_1fr_64px] items-center gap-2 px-3 py-[5px] text-[13px] tabular-nums ${
        ligne.votreOrdre ? 'rounded-md border border-accent/60 bg-accent/10' : ''
      }`}
    >
      {/* Barre de profondeur cumulée : bids ancrées à gauche (accent),
          asks à droite (err) — miroir symétrique autour du spread. */}
      <div
        aria-hidden="true"
        className={`absolute inset-y-[3px] rounded-sm transition-all duration-300 ${
          estAsk ? 'right-0 bg-err/15' : 'left-0 bg-accent/15'
        }`}
        style={{ width: `${largeur}%` }}
      />
      <span
        role="cell"
        className={`relative font-semibold ${
          vide ? 'text-text-muted/50 line-through' : estAsk ? 'text-err' : 'text-accent'
        }`}
      >
        {fmtPrix(ligne.prix)}
      </span>
      <span role="cell" className="relative flex items-center justify-end gap-2">
        {ligne.votreOrdre && (
          <span className="rounded border border-accent/50 px-1 py-px text-[9px] font-semibold uppercase tracking-widest text-accent">
            votre ordre
          </span>
        )}
        <span className={vide ? 'text-text-muted/50' : 'text-text'}>{fmtNombre(ligne.restant, 0)}</span>
      </span>
      <span role="cell" className="relative text-right text-[11px] text-text-muted">
        {fmtNombre(ligne.cumul, 0)}
      </span>
    </div>
  );
}

/* ── Composant principal ── */
type TypeOrdre = 'marche' | 'limite';

const EXPLICATION_INITIALE =
  'Choisissez un sens et une quantité, puis envoyez un ordre au marché : vous verrez les niveaux du carnet se consommer un à un. Ou placez un ordre limite pour le voir patienter dans la file.';

export function OrderBookSim() {
  const [carnet, setCarnet] = useState<CarnetSim>(() => genererCarnet(GRAINE_INITIALE));
  const [sens, setSens] = useState<SensOrdre>('achat');
  const [typeOrdre, setTypeOrdre] = useState<TypeOrdre>('marche');
  const [quantite, setQuantite] = useState(800);
  const [prixLimC, setPrixLimC] = useState<number | null>(null); // centimes ; null = défaut
  const [ordreLimite, setOrdreLimite] = useState<OrdreLimite | null>(null);
  const [resultat, setResultat] = useState<Resultat | null>(null);
  const [explication, setExplication] = useState(EXPLICATION_INITIALE);
  const [animEnCours, setAnimEnCours] = useState(false);
  const timersRef = useRef<number[]>([]);

  useEffect(
    () => () => {
      for (const t of timersRef.current) window.clearTimeout(t);
    },
    [],
  );

  function purgerTimers() {
    for (const t of timersRef.current) window.clearTimeout(t);
    timersRef.current = [];
  }

  /* Meilleures limites restantes (les niveaux vidés ne cotent plus). */
  const meilleurBid = carnet.bids.find(n => n.restant > 0)?.prix ?? null;
  const meilleurAsk = carnet.asks.find(n => n.restant > 0)?.prix ?? null;
  const fourchetteConnue = meilleurBid !== null && meilleurAsk !== null;
  const milieu = fourchetteConnue ? milieuFourchette(meilleurBid, meilleurAsk) : null;
  const spreadCentimes = fourchetteConnue ? enCentimes(spreadAbsolu(meilleurBid, meilleurAsk)) : null;
  const spreadPbAff = fourchetteConnue ? spreadPb(meilleurBid, meilleurAsk) : null;

  const coteOpposee = sens === 'achat' ? carnet.asks : carnet.bids;
  const profondeurDispo = coteOpposee.reduce((s, n) => s + n.restant, 0);
  const profondeurInsuffisante = quantite > profondeurDispo;

  /* Prix limite : par défaut, rejoindre la meilleure limite de son côté. */
  const defautPrixLimC =
    sens === 'achat'
      ? enCentimes(meilleurBid ?? 99.95)
      : enCentimes(meilleurAsk ?? 100.05);
  const prixLimiteC = Math.min(PRIX_LIM_MAX_C, Math.max(PRIX_LIM_MIN_C, prixLimC ?? defautPrixLimC));

  function nouveauCarnet() {
    purgerTimers();
    setCarnet(genererCarnet(newSeed()));
    setOrdreLimite(null);
    setResultat(null);
    setPrixLimC(null);
    setAnimEnCours(false);
    setExplication(EXPLICATION_INITIALE);
  }

  function changerSens(s: SensOrdre) {
    setSens(s);
    setPrixLimC(null); // le défaut du curseur de prix suit le côté choisi
  }

  function envoyerOrdreMarche() {
    if (animEnCours || !fourchetteConnue || profondeurInsuffisante) return;
    const dispo = coteOpposee.filter(n => n.restant > 0);
    const niveaux: NiveauCarnet[] = dispo.map(n => ({ prix: n.prix, taille: n.restant }));
    const res = executionCarnet(quantite, niveaux);
    const milieuAvant = milieu as number;
    const slip = slippage(res.prixMoyen, milieuAvant, sens);
    const meilleurAffiche = sens === 'achat' ? (meilleurAsk as number) : (meilleurBid as number);

    // Plan d'animation : nouveau « restant » de chaque niveau entamé.
    const etapes: Array<{ prix: number; nouveauRestant: number }> = [];
    let reste = quantite;
    for (const n of dispo) {
      if (reste <= 0) break;
      const executee = Math.min(reste, n.restant);
      etapes.push({ prix: n.prix, nouveauRestant: n.restant - executee });
      reste -= executee;
    }

    setAnimEnCours(true);
    setResultat(null);
    setExplication(
      sens === 'achat'
        ? "Exécution en cours : votre ordre d'achat remonte le côté ask, niveau par niveau…"
        : "Exécution en cours : votre ordre de vente descend le côté bid, niveau par niveau…",
    );

    const sensFige = sens;
    etapes.forEach((etape, k) => {
      const t = window.setTimeout(() => {
        setCarnet(prev => {
          const maj = (cote: NiveauVue[]) =>
            cote.map(n => (enCentimes(n.prix) === enCentimes(etape.prix) ? { ...n, restant: etape.nouveauRestant } : n));
          return sensFige === 'achat' ? { ...prev, asks: maj(prev.asks) } : { ...prev, bids: maj(prev.bids) };
        });
      }, (k + 1) * DUREE_ETAPE_MS);
      timersRef.current.push(t);
    });

    const tFin = window.setTimeout(() => {
      setResultat({
        sens: sensFige,
        quantite,
        prixMoyen: res.prixMoyen,
        coutTotal: res.coutTotal,
        niveauxConsommes: res.niveauxConsommes,
        slippageParTitre: slip,
        milieuAvant,
      });
      setExplication(redigerBilan(sensFige, quantite, res.prixMoyen, res.niveauxConsommes, meilleurAffiche, slip, milieuAvant));
      setAnimEnCours(false);
    }, etapes.length * DUREE_ETAPE_MS + 280);
    timersRef.current.push(tFin);
  }

  function redigerBilan(
    s: SensOrdre,
    q: number,
    prixMoyen: number,
    nbNiveaux: number,
    meilleurAffiche: number,
    slip: number,
    milieuAvant: number,
  ): string {
    const genitif = s === 'achat' ? "d'achat" : 'de vente';
    const cote = s === 'achat' ? 'ask' : 'bid';
    // demi-fourchette = écart meilleur prix affiché vs milieu
    const demiFourchette = Math.abs(meilleurAffiche - milieuAvant);
    // slippage de profondeur = écart prix moyen vs meilleur prix affiché
    const slippageProfondeur = Math.abs(prixMoyen - meilleurAffiche);
    if (nbNiveaux <= 1) {
      return `Votre ordre ${genitif} de ${fmtNombre(q, 0)} titres tenait dans le premier niveau : prix moyen ${fmtNombre(prixMoyen, 2)} € = meilleur ${cote} affiché. Coût vs milieu = demi-fourchette seule (${fmtNombre(demiFourchette * 100, 1)} c/titre), aucun slippage de profondeur — l'ordre n'a pas dépassé le meilleur prix affiché.`;
    }
    return `Votre ordre ${genitif} de ${fmtNombre(q, 0)} titres a traversé ${nbNiveaux} niveaux. Coût total vs milieu = demi-fourchette (${fmtNombre(demiFourchette * 100, 1)} c/titre) + slippage de profondeur, c'est-à-dire l'écart au meilleur ${cote} affiché (${fmtPrix(meilleurAffiche)} €) (${fmtNombre(slippageProfondeur * 100, 1)} c/titre) = ${fmtNombre(slip * 100, 1)} c/titre au total, soit ${fmtNombre(slip * q, 2)} € sur l'ordre.`;
  }

  function placerOrdreLimite() {
    if (animEnCours) return;
    const prix = prixLimiteC / 100;
    if (sens === 'achat' && meilleurAsk !== null && prix >= meilleurAsk) {
      setExplication(
        `À ${fmtPrix(prix)} €, votre ordre d'achat croiserait immédiatement le meilleur ask (${fmtPrix(meilleurAsk)} €) : il serait exécuté tout de suite, comme un ordre au marché. Choisissez un prix sous le meilleur ask pour le voir patienter dans le carnet.`,
      );
      return;
    }
    if (sens === 'vente' && meilleurBid !== null && prix <= meilleurBid) {
      setExplication(
        `À ${fmtPrix(prix)} €, votre ordre de vente croiserait immédiatement le meilleur bid (${fmtPrix(meilleurBid)} €) : il serait exécuté tout de suite, comme un ordre au marché. Choisissez un prix au-dessus du meilleur bid pour le voir patienter dans le carnet.`,
      );
      return;
    }
    setOrdreLimite({ sens, prix, quantite });
    setExplication(redigerNoteLimite(sens, prix, quantite));
  }

  function redigerNoteLimite(s: SensOrdre, prix: number, q: number): string {
    const cote = s === 'achat' ? carnet.bids : carnet.asks;
    const meilleur = s === 'achat' ? meilleurBid : meilleurAsk;
    const c = enCentimes(prix);
    const memeNiveau = cote.find(n => n.restant > 0 && enCentimes(n.prix) === c);
    const genitif = s === 'achat' ? "d'achat" : 'de vente';
    const base = `Votre ordre limite ${genitif} de ${fmtNombre(q, 0)} titres à ${fmtPrix(prix)} € est posé dans le carnet.`;
    let position: string;
    if (memeNiveau) {
      position = ` Il rejoint la file derrière les ${fmtNombre(memeNiveau.restant, 0)} titres déjà affichés à ce prix : priorité prix, puis temps.`;
    } else if (meilleur !== null && (s === 'achat' ? prix > meilleur : prix < meilleur)) {
      position = ` Votre ordre devient le meilleur ${s === 'achat' ? 'bid' : 'ask'} affiché aux autres participants : vous serez servi en priorité si un ordre adverse arrive.`;
    } else {
      position = "Il s'insère dans la profondeur, à son rang de prix.";
    }
    return `${base}${position} Il garantit le prix, pas l'exécution : il attendra qu'${s === 'achat' ? 'un vendeur descende' : 'un acheteur monte'} jusqu'à lui — ici, aucun flux adverse n'est simulé, il attend donc indéfiniment.`;
  }

  /* Lignes affichées : asks du plus éloigné au meilleur, puis bids. */
  const lignesAsks = lignesCote(carnet.asks, 'ask', ordreLimite);
  const lignesBids = lignesCote(carnet.bids, 'bid', ordreLimite);
  const maxCumul = Math.max(
    lignesAsks.length > 0 ? lignesAsks[lignesAsks.length - 1].cumul : 0,
    lignesBids.length > 0 ? lignesBids[lignesBids.length - 1].cumul : 0,
    1,
  );

  const stats: ReadonlyArray<readonly [string, string]> = [
    ['Meilleur bid', meilleurBid !== null ? fmtPrix(meilleurBid) + ' €' : '—'],
    ['Meilleur ask', meilleurAsk !== null ? fmtPrix(meilleurAsk) + ' €' : '—'],
    [
      'Spread',
      spreadCentimes !== null && spreadPbAff !== null
        ? `${fmtNombre(spreadCentimes, 0)} c (${fmtNombre(spreadPbAff, 1)} pb)`
        : '—',
    ],
    ['Milieu', milieu !== null ? fmtPrix(milieu) + ' €' : '—'],
  ];

  return (
    <div className="my-6 rounded-lg border border-border bg-surface">
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2.5">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
          Simulateur de carnet d&rsquo;ordres
        </p>
        <Button variante="secondaire" taille="sm" onClick={nouveauCarnet}>
          Nouveau carnet
        </Button>
      </div>

      {/* Contrôles */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-4 pt-3">
        <div className="flex gap-2" role="group" aria-label="Sens de l'ordre">
          <Segment actif={sens === 'achat'} onClick={() => changerSens('achat')}>
            Achat
          </Segment>
          <Segment actif={sens === 'vente'} onClick={() => changerSens('vente')}>
            Vente
          </Segment>
        </div>
        <div className="flex gap-2" role="group" aria-label="Type d'ordre">
          <Segment actif={typeOrdre === 'marche'} onClick={() => setTypeOrdre('marche')}>
            Ordre au marché
          </Segment>
          <Segment actif={typeOrdre === 'limite'} onClick={() => setTypeOrdre('limite')}>
            Ordre limite
          </Segment>
        </div>
      </div>

      <div className="grid grid-cols-1 items-end gap-x-6 gap-y-2 px-4 pt-2 sm:grid-cols-2">
        <Curseur
          label="Quantité"
          affichage={`${fmtNombre(quantite, 0)} titres`}
          min={QTE_MIN}
          max={QTE_MAX}
          pas={QTE_PAS}
          valeur={quantite}
          onChange={setQuantite}
        />
        {typeOrdre === 'limite' ? (
          <Curseur
            label="Prix limite"
            affichage={`${fmtPrix(prixLimiteC / 100)} €`}
            min={PRIX_LIM_MIN_C}
            max={PRIX_LIM_MAX_C}
            pas={1}
            valeur={prixLimiteC}
            onChange={setPrixLimC}
          />
        ) : (
          <div className="flex flex-col items-start gap-1 sm:items-end">
            {profondeurInsuffisante && (
              <p className="text-[11px] leading-snug text-warn">
                Profondeur restante insuffisante côté {sens === 'achat' ? 'ask' : 'bid'} (
                {fmtNombre(profondeurDispo, 0)} titres) : réduisez la quantité ou tirez un nouveau carnet.
              </p>
            )}
          </div>
        )}
      </div>

      <div className="px-4 pt-2">
        {typeOrdre === 'marche' ? (
          <Button
            taille="sm"
            onClick={envoyerOrdreMarche}
            disabled={animEnCours || !fourchetteConnue || profondeurInsuffisante}
          >
            Envoyer l&rsquo;ordre au marché
          </Button>
        ) : (
          <Button taille="sm" onClick={placerOrdreLimite} disabled={animEnCours}>
            Placer l&rsquo;ordre limite
          </Button>
        )}
      </div>

      {/* Mesures de la fourchette */}
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 px-4 pt-3 sm:grid-cols-4">
        {stats.map(([cle, valeur]) => (
          <div key={cle}>
            <dt className="text-[10px] uppercase tracking-wider text-text-muted">{cle}</dt>
            <dd className="tabular-nums text-[13px] font-semibold text-text">{valeur}</dd>
          </div>
        ))}
      </dl>

      {/* Carnet */}
      <div className="px-2 pt-2 sm:px-4">
        <div
          role="table"
          aria-label="Carnet d'ordres : cinq niveaux à la vente (asks) en haut, cinq niveaux à l'achat (bids) en bas, profondeur cumulée en barres"
          className="mx-auto w-full max-w-[480px] rounded-md border border-border"
        >
          <div
            role="row"
            className="grid grid-cols-[64px_1fr_64px] gap-2 border-b border-border bg-surface-2 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted"
          >
            <span role="columnheader">Prix (€)</span>
            <span role="columnheader" className="text-right">
              Taille
            </span>
            <span role="columnheader" className="text-right">
              Cumul
            </span>
          </div>
          {[...lignesAsks].reverse().map(l => (
            <Rangee key={l.cle} ligne={l} maxCumul={maxCumul} />
          ))}
          <div
            role="row"
            className="flex items-center justify-center gap-2 border-y border-border bg-surface-2/60 px-3 py-1.5 text-[11px] text-text-muted"
          >
            <span role="cell">
              {fourchetteConnue && spreadCentimes !== null && milieu !== null
                ? `← spread ${fmtNombre(spreadCentimes, 0)} c — milieu ${fmtPrix(milieu)} € →`
                : 'Un côté du carnet est épuisé — tirez un nouveau carnet.'}
            </span>
          </div>
          {lignesBids.map(l => (
            <Rangee key={l.cle} ligne={l} maxCumul={maxCumul} />
          ))}
        </div>
      </div>

      {/* Ligne pédagogique contextuelle */}
      <p
        aria-live="polite"
        className="mx-4 my-3 border-l-[3px] border-l-accent/60 pl-3 text-[13px] leading-relaxed text-text"
      >
        {explication}
      </p>

      {/* Résultat de la dernière exécution */}
      {resultat && (
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-border px-4 py-3 sm:grid-cols-4">
          <div>
            <dt className="text-[10px] uppercase tracking-wider text-text-muted">Prix moyen</dt>
            <dd className="tabular-nums text-[13px] font-semibold text-text">
              {fmtNombre(resultat.prixMoyen, 3)} €
            </dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-wider text-text-muted">
              Slippage vs milieu ({fmtPrix(resultat.milieuAvant)})
            </dt>
            <dd className="tabular-nums text-[13px] font-semibold text-text">
              {fmtNombre(resultat.slippageParTitre * 100, 1)} c/titre
            </dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-wider text-text-muted">
              {resultat.sens === 'achat' ? 'Coût total' : 'Produit total'}
            </dt>
            <dd className="tabular-nums text-[13px] font-semibold text-text">
              {fmtNombre(resultat.coutTotal, 2)} €
            </dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-wider text-text-muted">Niveaux traversés</dt>
            <dd className="tabular-nums text-[13px] font-semibold text-text">{resultat.niveauxConsommes}</dd>
          </div>
        </dl>
      )}

      <p className="border-t border-border px-4 py-3 text-[11px] leading-relaxed text-text-muted">
        Carnet simulé, déterministe par graine : « Nouveau carnet » retire une nouvelle configuration.
        Le carnet reste dans l&rsquo;état consommé après vos ordres au marché, et aucun flux adverse
        n&rsquo;est simulé — un ordre limite posé reste en attente. Les meilleures limites et le spread
        affichés portent sur les ordres du marché, hors votre ordre limite. Les chiffres sortent des
        fonctions du module (executionCarnet, spreadPb, slippage).
      </p>
    </div>
  );
}
