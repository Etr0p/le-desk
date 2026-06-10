import { addJours } from './srs';
import type { EtatApp, Tentative } from './storage';
import type { ModuleContenu } from './types';

/* ─── progressionModule ─── */

/** acquis = chapitres dont checkpointsReussis["<moduleId>/<chapitreId>"], total = m.chapitres.length */
export function progressionModule(
  m: ModuleContenu,
  etat: EtatApp,
): { acquis: number; total: number } {
  const total = m.chapitres.length;
  let acquis = 0;
  for (const chapitre of m.chapitres) {
    const cle = `${m.meta.id}/${chapitre.meta.id}`;
    if (etat.checkpointsReussis[cle]) acquis++;
  }
  return { acquis, total };
}

/* ─── tauxReussite ─── */

/** Moyenne des reussite des tentatives filtrées ; null si aucune. */
export function tauxReussite(
  tentatives: Tentative[],
  filtre?: {
    moduleId?: string;
    type?: Tentative['type'];
    depuisJours?: number;
    aujourdHui?: string;
  },
): number | null {
  let filtrees = tentatives;

  if (filtre?.moduleId !== undefined) {
    filtrees = filtrees.filter(t => t.moduleId === filtre.moduleId);
  }
  if (filtre?.type !== undefined) {
    filtrees = filtrees.filter(t => t.type === filtre.type);
  }
  if (filtre?.depuisJours !== undefined && filtre.aujourdHui !== undefined) {
    const limite = addJours(filtre.aujourdHui, -filtre.depuisJours);
    filtrees = filtrees.filter(t => t.date >= limite);
  }

  if (filtrees.length === 0) return null;
  return filtrees.reduce((sum, t) => sum + t.reussite, 0) / filtrees.length;
}

/* ─── pointsFaibles ─── */

/** Agrège les tentatives type 'qcm' par (moduleId, theme), filtre >= minTentatives, tri croissant par taux, max 5. */
export function pointsFaibles(
  contenus: ModuleContenu[],
  etat: EtatApp,
  minTentatives = 5,
): { moduleId: string; theme: string; taux: number }[] {
  // Construire un index refId → theme via la banque QCM
  const refIdToTheme = new Map<string, { theme: string; moduleId: string }>();
  for (const m of contenus) {
    for (const q of m.qcm) {
      refIdToTheme.set(q.id, { theme: q.theme, moduleId: q.moduleId });
    }
  }

  // Agréger les tentatives qcm par (moduleId, theme)
  const groupes = new Map<string, { moduleId: string; theme: string; somme: number; n: number }>();
  for (const t of etat.tentatives) {
    if (t.type !== 'qcm') continue;
    const info = refIdToTheme.get(t.refId);
    if (!info) continue;
    const cle = `${info.moduleId}|${info.theme}`;
    const g = groupes.get(cle) ?? { moduleId: info.moduleId, theme: info.theme, somme: 0, n: 0 };
    g.somme += t.reussite;
    g.n++;
    groupes.set(cle, g);
  }

  return Array.from(groupes.values())
    .filter(g => g.n >= minTentatives)
    .map(g => ({ moduleId: g.moduleId, theme: g.theme, taux: g.somme / g.n }))
    .sort((a, b) => a.taux - b.taux)
    .slice(0, 5);
}

/* ─── dernieresSessions ─── */

/** Regroupe les tentatives par (date, type), tri par date décroissante, n groupes les plus récents. */
export function dernieresSessions(
  tentatives: Tentative[],
  n = 5,
): { date: string; type: Tentative['type']; nb: number; taux: number }[] {
  const groupes = new Map<string, { date: string; type: Tentative['type']; somme: number; nb: number }>();
  for (const t of tentatives) {
    const cle = `${t.date}|${t.type}`;
    const g = groupes.get(cle) ?? { date: t.date, type: t.type, somme: 0, nb: 0 };
    g.somme += t.reussite;
    g.nb++;
    groupes.set(cle, g);
  }

  return Array.from(groupes.values())
    .sort((a, b) => {
      if (b.date !== a.date) return b.date.localeCompare(a.date);
      return b.type.localeCompare(a.type);
    })
    .slice(0, n)
    .map(g => ({ date: g.date, type: g.type, nb: g.nb, taux: g.nb > 0 ? g.somme / g.nb : 0 }));
}
