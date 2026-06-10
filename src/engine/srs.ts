export type Grade = 'encore' | 'difficile' | 'bien' | 'facile';
export interface CardState { ease: number; intervalJours: number; echeance: string; repetitions: number; }

const JOUR_MS = 86_400_000;
export function addJours(dateISO: string, jours: number): string {
  return new Date(new Date(dateISO + 'T00:00:00Z').getTime() + jours * JOUR_MS).toISOString().slice(0, 10);
}
export function nouvelleCarte(aujourdHui: string): CardState {
  return { ease: 2.5, intervalJours: 0, echeance: aujourdHui, repetitions: 0 };
}
export function reviser(etat: CardState, note: Grade, aujourdHui: string): CardState {
  let { ease, intervalJours, repetitions } = etat;
  switch (note) {
    case 'encore':
      return { ease: Math.max(1.3, ease - 0.2), intervalJours: 0, echeance: aujourdHui, repetitions: 0 };
    case 'difficile':
      ease = Math.max(1.3, ease - 0.15);
      intervalJours = Math.max(1, Math.round(intervalJours * 1.2));
      break;
    case 'bien':
      intervalJours = repetitions === 0 ? 1 : repetitions === 1 ? 3 : Math.round(intervalJours * ease);
      break;
    case 'facile':
      ease = Math.min(3.0, ease + 0.15);
      intervalJours = repetitions === 0 ? 2 : Math.max(4, Math.round(intervalJours * ease * 1.3));
      break;
  }
  return { ease, intervalJours, echeance: addJours(aujourdHui, intervalJours), repetitions: repetitions + 1 };
}
export function cartesDues(etats: Record<string, CardState>, aujourdHui: string): string[] {
  return Object.entries(etats).filter(([, e]) => e.echeance <= aujourdHui).map(([id]) => id);
}
