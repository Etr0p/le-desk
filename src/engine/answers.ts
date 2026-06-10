export function reponseCorrecte(saisie: number, attendu: number, tolerance: number, mode: 'relatif' | 'absolu' = 'relatif'): boolean {
  if (!Number.isFinite(saisie)) return false;
  const ecart = Math.abs(saisie - attendu);
  // attendu = 0 : la tolérance relative est indéfinie, on bascule en absolu (la tolérance s'interprète alors en unités, pas en %)
  if (mode === 'absolu' || attendu === 0) return ecart <= tolerance;
  return ecart / Math.abs(attendu) <= tolerance;
}
export function parseSaisie(brut: string): number | null {
  const propre = brut.trim().replace(/[\s\u00a0\u202f]/g, '').replace(',', '.');
  if (propre === '') return null;
  const n = Number(propre);
  return Number.isFinite(n) ? n : null;
}
export function formatNombre(v: number, maxDecimales = 2): string {
  return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: maxDecimales }).format(v);
}
