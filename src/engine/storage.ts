import type { CardState } from './srs';
import { addJours } from './srs';
import type { Langue } from './types';

export interface StorageLike { getItem(k: string): string | null; setItem(k: string, v: string): void; }

export interface Tentative {
  date: string; type: 'exercice' | 'probleme' | 'qcm' | 'jury' | 'examen';
  refId: string; moduleId: string; difficulte?: number;
  reussite: number; // 0..1
}
export interface EtatApp {
  version: 1;
  cartes: Record<string, CardState>;
  cartesIntroduites: Record<string, string>; // id carte → date d'introduction
  chapitresLus: Record<string, true>;
  checkpointsReussis: Record<string, true>;
  tentatives: Tentative[];
  reglages: { nouvellesCartesParJour: number; theme: 'sombre' | 'clair'; langue: Langue };
  streak: { dernierJour: string; serie: number };
  reprise?: { chemin: string; libelle: string };
}

const CLE = 'le-desk-etat-v1';

export function etatInitial(): EtatApp {
  return {
    version: 1, cartes: {}, cartesIntroduites: {}, chapitresLus: {}, checkpointsReussis: {},
    tentatives: [], reglages: { nouvellesCartesParJour: 20, theme: 'sombre', langue: 'fr' },
    streak: { dernierJour: '', serie: 0 },
  };
}
export function charger(backend: StorageLike): EtatApp {
  try {
    const brut = backend.getItem(CLE);
    if (!brut) return etatInitial();
    return valider(JSON.parse(brut));
  } catch { return etatInitial(); }
}
export function sauver(etat: EtatApp, backend: StorageLike): void {
  backend.setItem(CLE, JSON.stringify(etat));
}
export function exporter(etat: EtatApp): string { return JSON.stringify(etat, null, 2); }
export function importer(json: string): EtatApp { return valider(JSON.parse(json)); }

// Fix 2 — valider durcie : un import corrompu ne doit pas persister et crasher au prochain lancement
function estObjet(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}
function valider(e: unknown): EtatApp {
  if (!estObjet(e) || e.version !== 1 || !estObjet(e.cartes) || !Array.isArray(e.tentatives)) {
    throw new Error('Sauvegarde invalide ou version inconnue');
  }
  for (const [id, c] of Object.entries(e.cartes)) {
    if (!estObjet(c) || typeof c.ease !== 'number' || typeof c.intervalJours !== 'number'
      || typeof c.echeance !== 'string' || typeof c.repetitions !== 'number') {
      throw new Error(`Sauvegarde invalide : carte « ${id} » corrompue`);
    }
  }
  const base = etatInitial();
  const x = e as unknown as EtatApp;
  // Deep-merge reglages : les champs invalides retombent silencieusement sur les défauts
  const reglages = { ...base.reglages };
  if (estObjet(e.reglages)) {
    const r = e.reglages;
    if (typeof r.nouvellesCartesParJour === 'number' && Number.isFinite(r.nouvellesCartesParJour) && r.nouvellesCartesParJour > 0)
      reglages.nouvellesCartesParJour = r.nouvellesCartesParJour;
    if (r.theme === 'sombre' || r.theme === 'clair') reglages.theme = r.theme;
    if (r.langue === 'fr' || r.langue === 'en') reglages.langue = r.langue;
  }
  // Deep-merge streak : idem
  const streak = { ...base.streak };
  if (estObjet(e.streak)) {
    const s = e.streak;
    if (typeof s.serie === 'number' && Number.isFinite(s.serie) && s.serie >= 0) streak.serie = s.serie;
    if (typeof s.dernierJour === 'string') streak.dernierJour = s.dernierJour;
  }
  return { ...base, ...x, reglages, streak };
}

export function toucherStreak(etat: EtatApp, aujourdHui: string): void {
  const { dernierJour } = etat.streak;
  if (dernierJour === aujourdHui) return;
  etat.streak.serie = dernierJour === addJours(aujourdHui, -1) ? etat.streak.serie + 1 : 1;
  etat.streak.dernierJour = aujourdHui;
}
