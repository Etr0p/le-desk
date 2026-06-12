import { useState } from 'react';
import {
  appelDeMarge,
  effetLevier,
  margeVariation,
  pnlFutures,
} from '../../content/modules/07-derives-fermes/calculs';
import { Button } from '../ui/Button';

/* ── Simulateur d'appels de marge sur futures indice ─────────────────────
   Futures fictif sur indice : départ 5 000 points, multiplicateur 10 €/pt.
   Tout le compte est DÉRIVÉ de (trajectoire, paramètres) à chaque rendu :
   margeVariation() donne le flux quotidien signé, appelDeMarge() le
   versement (convention US de calculs.ts : retour à la marge INITIALE),
   pnlFutures() vérifie que la somme des flux retombe sur le P&L soldé —
   les fonctions de calculs.ts sont importées, jamais recopiées.
   L'aléa vient d'un générateur seedé LOCAL (mulberry32) : « Réinitialiser »
   change la graine, donc la trajectoire — jamais de Math.random nu. */

const SPOT_DEPART = 5000;
const MULTIPLICATEUR = 10; // €/point d'indice
const MAX_JOURS_ALEA = 12;

const CONTRATS_MIN = 1;
const CONTRATS_MAX = 10;
const INITIALE_MIN = 5;
const INITIALE_MAX = 15;
const MAINTENANCE_MIN = 3;
const MAINTENANCE_MAX = 12;

/* ── Générateur pseudo-aléatoire seedé (mulberry32) ── */
function mulberry32(graine: number): () => number {
  let a = graine >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Rendement quotidien aléatoire en %, en cloche, borné ≈ ±3 %. */
function rendementAleatoire(graine: number, jour: number): number {
  const rnd = mulberry32(graine * 7919 + jour * 104729);
  const somme = rnd() + rnd() + rnd();
  return ((somme - 1.5) / 1.5) * 3;
}

/* ── Trajectoires prédéfinies (remplacent l'aléa) ── */
type Mode = 'aleatoire' | 'calme' | 'crash' | 'hausse';

const PRESETS: ReadonlyArray<{ id: Mode; label: string; rendements: number[] }> = [
  { id: 'calme', label: 'Marché calme', rendements: [0.4, -0.5, 0.3, -0.2, 0.5, -0.4, 0.2, -0.5, 0.4, -0.1] },
  { id: 'crash', label: 'Le crash', rendements: [0.5, -1, -12, -2, 1.5, -0.5, 1, 0.5, -0.5, 1] },
  { id: 'hausse', label: 'Hausse régulière', rendements: [0.8, 0.6, 1, 0.7, 0.9, 0.5, 0.8, 1.1, 0.6, 0.9] },
];

/* ── Formats français : virgule décimale, espaces pour les milliers ── */
function fmtNombre(v: number, dec: number): string {
  const [ent, fra] = Math.abs(v).toFixed(dec).split('.');
  const groupe = ent.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return (v < 0 ? '−' : '') + groupe + (fra ? ',' + fra : '');
}

function fmtEuros(v: number): string {
  return fmtNombre(v, 0) + ' €';
}

/** Flux signé : « +1 600 € » / « −800 € ». */
function fmtFlux(v: number): string {
  return (v > 0 ? '+' : '') + fmtEuros(v);
}

function fmtPct(v: number, dec = 1): string {
  return (v > 0 ? '+' : '') + fmtNombre(v, dec) + ' %';
}

/* ── Lignes du compte, dérivées jour par jour ── */
interface LigneJour {
  jour: number;
  rendement: number;
  prix: number;
  flux: number;
  soldeAvantAppel: number;
  appel: number;
  soldeApres: number;
}

/* ── Géométrie commune des deux mini-graphes ── */
const VB_L = 320;
const VB_H = 170;
const M_G = 52;
const M_D = 10;
const M_H = 14;
const M_B = 24;
const TRACE_L = VB_L - M_G - M_D;
const TRACE_H = VB_H - M_H - M_B;

function faireEchelles(xMax: number, yLo: number, yHi: number) {
  const x = (v: number) => M_G + (v / xMax) * TRACE_L;
  const y = (v: number) => M_H + TRACE_H - ((v - yLo) / (yHi - yLo)) * TRACE_H;
  return { x, y };
}

function cheminDepuisPoints(points: ReadonlyArray<{ x: number; y: number }>): string {
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
}

/* ── Composant ── */
export function MarginCallSim() {
  const [sens, setSens] = useState(1); // long = +1, short = −1 (convention calculs.ts)
  const [nbContrats, setNbContrats] = useState(2);
  const [margeInitialePct, setMargeInitialePct] = useState(12);
  const [margeMaintenancePct, setMargeMaintenancePct] = useState(9);
  const [mode, setMode] = useState<Mode>('aleatoire');
  const [graine, setGraine] = useState(1);
  const [nbJours, setNbJours] = useState(0);

  /* Contrainte : la maintenance reste STRICTEMENT sous l'initiale. */
  function changerInitiale(v: number) {
    setMargeInitialePct(v);
    if (margeMaintenancePct >= v) setMargeMaintenancePct(v - 1);
  }
  function changerMaintenance(v: number) {
    setMargeMaintenancePct(Math.min(v, margeInitialePct - 1));
  }

  /* Marges en euros, figées à l'ouverture (comme les marges fixées en € par
     la chambre) sur le notionnel de départ : 5 000 × 10 € × nb contrats. */
  const notionnelDepart = SPOT_DEPART * MULTIPLICATEUR * nbContrats;
  const margeInitiale = (notionnelDepart * margeInitialePct) / 100;
  const margeMaintenance = (notionnelDepart * margeMaintenancePct) / 100;

  const preset = PRESETS.find(p => p.id === mode);
  const maxJours = preset ? preset.rendements.length : MAX_JOURS_ALEA;

  /* ── Déroulé du compte : entièrement dérivé, recalculé à chaque rendu ── */
  const lignes: LigneJour[] = [];
  let prix = SPOT_DEPART;
  let solde = margeInitiale;
  let cashInjecte = 0;
  let nbAppels = 0;
  for (let j = 1; j <= nbJours; j++) {
    const rendement = preset ? preset.rendements[j - 1] : rendementAleatoire(graine, j);
    const prixVeille = prix;
    prix = Math.round(prixVeille * (1 + rendement / 100));
    const flux = margeVariation(prixVeille, prix, MULTIPLICATEUR, nbContrats, sens);
    const soldeAvantAppel = solde + flux;
    const appel = appelDeMarge(soldeAvantAppel, margeMaintenance, margeInitiale);
    solde = soldeAvantAppel + appel;
    cashInjecte += appel;
    if (appel > 0) nbAppels++;
    lignes.push({ jour: j, rendement, prix, flux, soldeAvantAppel, appel, soldeApres: solde });
  }

  const derniere = lignes.length > 0 ? lignes[lignes.length - 1] : null;
  const pnlCumule = pnlFutures(SPOT_DEPART, prix, MULTIPLICATEUR, nbContrats, sens);
  const sommeFlux = lignes.reduce((a, l) => a + l.flux, 0);
  const finTrajectoire = nbJours >= maxJours;

  function jourSuivant() {
    if (!finTrajectoire) setNbJours(nbJours + 1);
  }
  function reinitialiser() {
    setNbJours(0);
    setGraine(graine + 1); // nouvelle trajectoire en mode aléatoire
  }
  function choisirMode(m: Mode) {
    setMode(m);
    setNbJours(0);
  }

  /* ── Graphe 1 : prix du futures ── */
  const tousPrix = [SPOT_DEPART, ...lignes.map(l => l.prix)];
  let pLo = Math.min(...tousPrix);
  let pHi = Math.max(...tousPrix);
  const spanMinPrix = SPOT_DEPART * 0.02;
  if (pHi - pLo < spanMinPrix) {
    const c = (pLo + pHi) / 2;
    pLo = c - spanMinPrix / 2;
    pHi = c + spanMinPrix / 2;
  }
  const margePrix = (pHi - pLo) * 0.15;
  const ePrix = faireEchelles(maxJours, pLo - margePrix, pHi + margePrix);
  const cheminPrix = cheminDepuisPoints(tousPrix.map((v, j) => ({ x: ePrix.x(j), y: ePrix.y(v) })));

  /* ── Graphe 2 : solde du compte (avant appel, avec le saut du versement) ── */
  const tousSoldes = [margeInitiale, ...lignes.flatMap(l => (l.appel > 0 ? [l.soldeAvantAppel, l.soldeApres] : [l.soldeAvantAppel]))];
  let sLo = Math.min(0, ...tousSoldes);
  let sHi = Math.max(margeInitiale * 1.15, ...tousSoldes);
  const margeSolde = (sHi - sLo) * 0.12;
  sLo -= margeSolde;
  sHi += margeSolde;
  const eSolde = faireEchelles(maxJours, sLo, sHi);
  const pointsSolde: Array<{ x: number; y: number }> = [{ x: eSolde.x(0), y: eSolde.y(margeInitiale) }];
  for (const l of lignes) {
    pointsSolde.push({ x: eSolde.x(l.jour), y: eSolde.y(l.soldeAvantAppel) });
    if (l.appel > 0) pointsSolde.push({ x: eSolde.x(l.jour), y: eSolde.y(l.soldeApres) });
  }
  const cheminSolde = cheminDepuisPoints(pointsSolde);
  const yMaintenance = eSolde.y(margeMaintenance);
  const yInitiale = eSolde.y(margeInitiale);
  const basZone = eSolde.y(sLo);

  /* ── Message du jour (annoncé en aria-live : les appels surtout) ── */
  let messageJour: string;
  if (derniere === null) {
    messageJour = `Position ouverte : ${sens === 1 ? 'long' : 'short'} ${nbContrats} contrat${nbContrats > 1 ? 's' : ''} à ${fmtNombre(SPOT_DEPART, 0)} points. Dépôt de marge initiale : ${fmtEuros(margeInitiale)}. Cliquez « Jour suivant ».`;
  } else if (derniere.appel > 0) {
    messageJour = `Jour ${derniere.jour} : le solde tombe à ${fmtEuros(derniere.soldeAvantAppel)}, sous la maintenance (${fmtEuros(margeMaintenance)}). Appel de marge : versement automatique de ${fmtEuros(derniere.appel)} pour revenir à la marge initiale (${fmtEuros(margeInitiale)}) — pas à la maintenance.`;
  } else {
    messageJour = `Jour ${derniere.jour} : ${fmtPct(derniere.rendement)} sur l'indice, flux de marge de variation ${fmtFlux(derniere.flux)}, solde ${fmtEuros(derniere.soldeApres)} — au-dessus de la maintenance, pas d'appel.`;
  }

  const curseurs: ReadonlyArray<{
    libelle: string;
    valeur: number;
    affichage: string;
    min: number;
    max: number;
    surChange: (v: number) => void;
  }> = [
    { libelle: 'Nombre de contrats', valeur: nbContrats, affichage: String(nbContrats), min: CONTRATS_MIN, max: CONTRATS_MAX, surChange: setNbContrats },
    { libelle: 'Marge initiale', valeur: margeInitialePct, affichage: `${margeInitialePct} % (${fmtEuros(margeInitiale)})`, min: INITIALE_MIN, max: INITIALE_MAX, surChange: changerInitiale },
    { libelle: 'Marge de maintenance', valeur: margeMaintenancePct, affichage: `${margeMaintenancePct} % (${fmtEuros(margeMaintenance)})`, min: MAINTENANCE_MIN, max: MAINTENANCE_MAX, surChange: changerMaintenance },
  ];

  return (
    <div className="my-6 rounded-lg border border-border bg-surface">
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2.5">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
          Simulateur d&rsquo;appels de marge
        </p>
        <span className="text-[11px] text-text-muted">
          Futures indice fictif — 5 000 pts, 10 €/pt
        </span>
      </div>

      {/* Position : long / short + curseurs */}
      <div className="flex flex-wrap items-center gap-2 px-4 pt-3">
        <span className="text-xs text-text-muted">Position :</span>
        <Button variante={sens === 1 ? 'primaire' : 'secondaire'} taille="sm" onClick={() => setSens(1)} aria-pressed={sens === 1}>
          Long (+1)
        </Button>
        <Button variante={sens === -1 ? 'primaire' : 'secondaire'} taille="sm" onClick={() => setSens(-1)} aria-pressed={sens === -1}>
          Short (−1)
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-2 px-4 pt-3 sm:grid-cols-3">
        {curseurs.map(c => (
          <label key={c.libelle} className="flex flex-col gap-0.5">
            <span className="flex items-baseline justify-between gap-2 text-xs text-text-muted">
              <span>{c.libelle}</span>
              <strong className="tabular-nums text-[12px] font-semibold text-text">{c.affichage}</strong>
            </span>
            <input
              type="range"
              min={c.min}
              max={c.max}
              step={1}
              value={c.valeur}
              onChange={e => c.surChange(Number(e.target.value))}
              className="h-5 w-full cursor-pointer"
              style={{ accentColor: 'var(--accent)' }}
            />
          </label>
        ))}
      </div>

      {/* Trajectoires : aléa seedé ou présets */}
      <div className="flex flex-wrap items-center gap-2 px-4 pt-3">
        <span className="text-xs text-text-muted">Trajectoire :</span>
        <Button variante={mode === 'aleatoire' ? 'primaire' : 'secondaire'} taille="sm" onClick={() => choisirMode('aleatoire')} aria-pressed={mode === 'aleatoire'}>
          Aléatoire
        </Button>
        {PRESETS.map(p => (
          <Button key={p.id} variante={mode === p.id ? 'primaire' : 'secondaire'} taille="sm" onClick={() => choisirMode(p.id)} aria-pressed={mode === p.id}>
            {p.label}
          </Button>
        ))}
      </div>
      {mode === 'crash' && (
        <p className="px-4 pt-2 text-[11px] leading-relaxed text-warn">
          Jour 3 du préset : −12 % en séance. Avec {margeInitialePct} % de marge initiale, l&rsquo;effet
          de levier transforme ce −12 % du sous-jacent en {fmtPct(effetLevier(-12, margeInitialePct), 0)} de
          la mise{margeInitialePct === 10 ? ' — −120 % : la mise est plus que perdue' : ''} pour le long.
        </p>
      )}

      {/* Commandes du déroulé */}
      <div className="flex flex-wrap items-center gap-2 px-4 pt-3">
        <Button taille="sm" onClick={jourSuivant} disabled={finTrajectoire}>
          Jour suivant
        </Button>
        <Button variante="fantome" taille="sm" onClick={reinitialiser}>
          Réinitialiser
        </Button>
        <span className="text-[11px] tabular-nums text-text-muted">
          Jour {nbJours}/{maxJours}
          {finTrajectoire ? ' — fin de la trajectoire, réinitialisez' : ''}
        </span>
      </div>

      {/* Message du jour : les appels de marge sont annoncés aux lecteurs d'écran */}
      <div className="px-4 pt-2" aria-live="polite">
        <p className={`rounded-md px-3 py-2 text-[12px] leading-relaxed ${derniere !== null && derniere.appel > 0 ? 'bg-warn/10 text-warn' : 'bg-surface-2/60 text-text-muted'}`}>
          {messageJour}
        </p>
      </div>

      {/* Les deux mini-graphes : prix du futures, solde du compte */}
      <div className="grid grid-cols-1 gap-2 px-2 pt-2 sm:grid-cols-2">
        <svg
          viewBox={`0 0 ${VB_L} ${VB_H}`}
          className="block w-full"
          role="img"
          aria-label={`Prix du futures jour par jour. Départ ${fmtNombre(SPOT_DEPART, 0)} points, prix courant ${fmtNombre(prix, 0)} points au jour ${nbJours}.`}
        >
          <text x={M_G} y={9} fontSize={8.5} fontWeight={600} fill="var(--text-muted)">PRIX DU FUTURES (points)</text>
          <line x1={M_G} x2={M_G + TRACE_L} y1={M_H + TRACE_H} y2={M_H + TRACE_H} stroke="var(--border)" strokeWidth={1} />
          {/* Prix d'entrée en pointillés */}
          <line x1={M_G} x2={M_G + TRACE_L} y1={ePrix.y(SPOT_DEPART)} y2={ePrix.y(SPOT_DEPART)} stroke="var(--text-muted)" strokeWidth={0.8} strokeDasharray="3 3" />
          <text x={M_G - 4} y={ePrix.y(SPOT_DEPART) + 3} textAnchor="end" fontSize={8} fill="var(--text-muted)">
            {fmtNombre(SPOT_DEPART, 0)}
          </text>
          {tousPrix.length > 1 && (
            <text x={M_G - 4} y={ePrix.y(prix) + 3} textAnchor="end" fontSize={8} fontWeight={600} fill="var(--accent)">
              {fmtNombre(prix, 0)}
            </text>
          )}
          <path d={cheminPrix} fill="none" stroke="var(--accent)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
          {derniere !== null && <circle cx={ePrix.x(nbJours)} cy={ePrix.y(prix)} r={3.5} fill="var(--accent)" stroke="var(--surface)" strokeWidth={1.2} />}
          <text x={M_G + TRACE_L / 2} y={VB_H - 4} textAnchor="middle" fontSize={8.5} fill="var(--text-muted)">jours</text>
        </svg>

        <svg
          viewBox={`0 0 ${VB_L} ${VB_H}`}
          className="block w-full"
          role="img"
          aria-label={`Solde du compte de marge jour par jour. Marge initiale ${fmtEuros(margeInitiale)}, maintenance ${fmtEuros(margeMaintenance)}, solde courant ${fmtEuros(solde)}, ${nbAppels} appel${nbAppels > 1 ? 's' : ''} de marge.`}
        >
          <text x={M_G} y={9} fontSize={8.5} fontWeight={600} fill="var(--text-muted)">SOLDE DU COMPTE (€)</text>
          {/* Zone d'appel : sous la maintenance */}
          <rect x={M_G} y={yMaintenance} width={TRACE_L} height={Math.max(0, basZone - yMaintenance)} fill="var(--warn)" opacity={0.08} />
          <line x1={M_G} x2={M_G + TRACE_L} y1={M_H + TRACE_H} y2={M_H + TRACE_H} stroke="var(--border)" strokeWidth={1} />
          {/* Marge initiale et maintenance en pointillés */}
          <line x1={M_G} x2={M_G + TRACE_L} y1={yInitiale} y2={yInitiale} stroke="var(--text-muted)" strokeWidth={0.8} strokeDasharray="3 3" />
          <text x={M_G - 4} y={yInitiale + 3} textAnchor="end" fontSize={8} fill="var(--text-muted)">
            {fmtNombre(margeInitiale, 0)}
          </text>
          <line x1={M_G} x2={M_G + TRACE_L} y1={yMaintenance} y2={yMaintenance} stroke="var(--warn)" strokeWidth={0.8} strokeDasharray="3 3" />
          <text x={M_G - 4} y={yMaintenance + 3} textAnchor="end" fontSize={8} fill="var(--warn)">
            {fmtNombre(margeMaintenance, 0)}
          </text>
          <text x={M_G + TRACE_L - 2} y={yMaintenance + 9} textAnchor="end" fontSize={7.5} fill="var(--warn)">
            zone d&rsquo;appel
          </text>
          <path d={cheminSolde} fill="none" stroke="var(--accent)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
          {/* Marqueurs des appels : le creux sous la maintenance */}
          {lignes.filter(l => l.appel > 0).map(l => (
            <circle key={l.jour} cx={eSolde.x(l.jour)} cy={eSolde.y(l.soldeAvantAppel)} r={3.5} fill="var(--warn)" stroke="var(--surface)" strokeWidth={1.2} />
          ))}
          <text x={M_G + TRACE_L / 2} y={VB_H - 4} textAnchor="middle" fontSize={8.5} fill="var(--text-muted)">jours</text>
        </svg>
      </div>

      {/* Tableau du compte */}
      {lignes.length > 0 && (
        <div className="overflow-x-auto px-4 pt-2">
          <table className="w-full min-w-[300px] border-collapse text-[11px] tabular-nums">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wider text-text-muted">
                <th className="py-1 pr-2 font-semibold">Jour</th>
                <th className="py-1 pr-2 font-semibold">Prix</th>
                <th className="py-1 pr-2 text-right font-semibold">Flux du jour</th>
                <th className="py-1 pr-2 text-right font-semibold">Solde</th>
                <th className="py-1 text-right font-semibold">Appel</th>
              </tr>
            </thead>
            <tbody>
              {lignes.map(l => (
                <tr key={l.jour} className="border-t border-border/60 text-text">
                  <td className="py-1 pr-2">{l.jour}</td>
                  <td className="py-1 pr-2">{fmtNombre(l.prix, 0)}</td>
                  <td className={`py-1 pr-2 text-right ${l.flux < 0 ? 'text-err' : 'text-ok'}`}>{fmtFlux(l.flux)}</td>
                  <td className="py-1 pr-2 text-right">{fmtEuros(l.soldeApres)}</td>
                  <td className={`py-1 text-right ${l.appel > 0 ? 'font-semibold text-warn' : 'text-text-muted'}`}>
                    {l.appel > 0 ? fmtFlux(l.appel) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Lecture : P&L, cash injecté, équivalence avec le forward */}
      <div className="flex flex-wrap items-start gap-x-6 gap-y-2 border-t border-border px-4 py-3">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-muted">P&amp;L cumulé</p>
          <p className={`tabular-nums text-xl font-semibold leading-tight ${pnlCumule < 0 ? 'text-err' : 'text-ok'}`}>
            {fmtFlux(pnlCumule)}
          </p>
        </div>
        <dl className="grid flex-1 grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
          <div>
            <dt className="text-[10px] uppercase tracking-wider text-text-muted">Cash injecté (appels)</dt>
            <dd className="tabular-nums text-[13px] font-semibold text-text">{fmtEuros(cashInjecte)}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-wider text-text-muted">Appels de marge</dt>
            <dd className="tabular-nums text-[13px] font-semibold text-text">{nbAppels}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-wider text-text-muted">Somme des flux quotidiens</dt>
            <dd className="tabular-nums text-[13px] font-semibold text-text">{fmtFlux(sommeFlux)}</dd>
          </div>
        </dl>
        <p className="w-full text-[11px] leading-relaxed text-text-muted">
          La somme des flux quotidiens ({fmtFlux(sommeFlux)}) est exactement le P&amp;L d&rsquo;une position
          soldée à {fmtNombre(prix, 0)} ({fmtFlux(pnlCumule)}) : le mark-to-market n&rsquo;invente rien, il
          étale. <strong className="text-text">P&amp;L final identique au forward — mais la trésorerie peut
          vous tuer avant l&rsquo;échéance.</strong>
        </p>
      </div>
    </div>
  );
}
