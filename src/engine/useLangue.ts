import { useCallback } from 'react';
import { useEtat } from './useEtat';
import type { Langue } from './types';
import { t as traduire, type CleTexte } from './textes';

/**
 * Hook de langue : expose la langue active et un traducteur `t` lié à celle-ci.
 * La langue vit dans l'état persisté (reglages.langue) — tout changement via
 * `modifier` re-rend les consommateurs (version incrémentée dans useEtat).
 */
export function useLangue(): { langue: Langue; t: (cle: CleTexte) => string } {
  const { etat, version } = useEtat();
  void version; // dépendance explicite : re-render à chaque mutation de l'état
  const langue = etat.reglages.langue;
  const t = useCallback((cle: CleTexte) => traduire(langue, cle), [langue]);
  return { langue, t };
}
