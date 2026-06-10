import type { CardState } from './srs';
import { addJours } from './srs';

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
  reglages: { nouvellesCartesParJour: number; theme: 'sombre' | 'clair' };
  streak: { dernierJour: string; serie: number };
  reprise?: { chemin: string; libelle: string };
}

const CLE = 'le-desk-etat-v1';

export function etatInitial(): EtatApp {
  return {
    version: 1, cartes: {}, cartesIntroduites: {}, chapitresLus: {}, checkpointsReussis: {},
    tentatives: [], reglages: { nouvellesCartesParJour: 20, theme: 'sombre' },
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

function valider(e: unknown): EtatApp {
  const x = e as EtatApp;
  if (!x || x.version !== 1 || typeof x.cartes !== 'object' || !Array.isArray(x.tentatives)) {
    throw new Error('Sauvegarde invalide ou version inconnue');
  }
  return { ...etatInitial(), ...x };
}
export function toucherStreak(etat: EtatApp, aujourdHui: string): void {
  const { dernierJour } = etat.streak;
  if (dernierJour === aujourdHui) return;
  etat.streak.serie = dernierJour === addJours(aujourdHui, -1) ? etat.streak.serie + 1 : 1;
  etat.streak.dernierJour = aujourdHui;
}
