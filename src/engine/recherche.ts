/** Normalise une chaîne : minuscules + suppression des diacritiques (NFD). */
export function normaliser(s: string): string {
  return s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

/**
 * Cherche dans une liste d'items.
 * - Requête vide → tous les items.
 * - Match = chaque mot de la requête est inclus dans au moins une clé normalisée.
 * - Tri : items dont la PREMIÈRE clé normalisée commence par la requête normalisée en premier,
 *         puis alphabétique par première clé.
 */
export function chercher<T>(
  items: T[],
  requete: string,
  cles: (item: T) => string[],
): T[] {
  const requeteNorm = normaliser(requete.trim());

  if (requeteNorm === '') return [...items];

  const mots = requeteNorm.split(/\s+/).filter(m => m.length > 0);

  const correspondants = items.filter(item => {
    const clesNorm = cles(item).map(normaliser);
    // Chaque mot doit être présent dans au moins une clé
    return mots.every(mot => clesNorm.some(c => c.includes(mot)));
  });

  correspondants.sort((a, b) => {
    const premA = normaliser(cles(a)[0] ?? '');
    const premB = normaliser(cles(b)[0] ?? '');
    const aPrefix = premA.startsWith(requeteNorm);
    const bPrefix = premB.startsWith(requeteNorm);
    if (aPrefix && !bPrefix) return -1;
    if (!aPrefix && bPrefix) return 1;
    return premA.localeCompare(premB, 'fr');
  });

  return correspondants;
}
