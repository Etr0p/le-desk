export function reponseCorrecte(saisie: number, attendu: number, tolerance: number, mode: 'relatif' | 'absolu' = 'relatif'): boolean {
  if (!Number.isFinite(saisie)) return false;
  const ecart = Math.abs(saisie - attendu);
  if (mode === 'absolu' || attendu === 0) return ecart <= tolerance;
  return ecart / Math.abs(attendu) <= tolerance;
}
export function parseSaisie(brut: string): number | null {
  const n = Number(brut.trim().replace(/[\s  ]/g, '').replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}
export function formatNombre(v: number, maxDecimales = 2): string {
  return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: maxDecimales }).format(v);
}
