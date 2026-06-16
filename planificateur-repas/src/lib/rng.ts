/**
 * Générateur de nombres pseudo-aléatoires déterministe (mulberry32).
 * Permet de reproduire une génération à partir d'une graine — utile
 * pour les tests et pour pouvoir « refaire la même semaine ».
 */
export function creerRng(graine: number): () => number {
  let a = graine >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Graine aléatoire fondée sur l'horloge (pour une vraie génération). */
export function graineAleatoire(): number {
  return (Date.now() ^ (Math.random() * 0xffffffff)) >>> 0;
}
