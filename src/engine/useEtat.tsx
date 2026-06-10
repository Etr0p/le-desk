import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import { charger, sauver, type EtatApp, type StorageLike } from './storage';

interface EtatContexte {
  etat: EtatApp;
  modifier: (fn: (e: EtatApp) => void) => void;
  remplacer: (nouvelEtat: EtatApp) => void;
  // `version` s'incrémente à chaque mutation — utilisez-le comme dépendance d'effet/mémo.
  // ATTENTION : les sous-objets de `etat` (cartes, reglages…) ont une identité stable entre
  // mutations (mutation en place). Ne les utilisez jamais seuls en dépendance — dépendez de
  // `version` à la place, sinon votre effet ne se déclenchera pas.
  version: number;
}
const Ctx = createContext<EtatContexte | null>(null);

// Fix 3a — backend injectable (testabilité sans mock de localStorage global)
export function EtatProvider({ children, backend = localStorage }: { children: ReactNode; backend?: StorageLike }) {
  // ref.current est muté en place par `modifier` — l'identité objet reste stable,
  // `etat` est donc toujours à jour via mutation. setVersion force le re-render.
  // `remplacer` swap l'objet : version est inclus dans les deps de useMemo
  // pour que la nouvelle référence soit bien exposée aux consommateurs.
  const ref = useRef<EtatApp | null>(null);
  if (ref.current === null) ref.current = charger(backend);
  const [version, setVersion] = useState(0);

  const modifier = useCallback((fn: (e: EtatApp) => void) => {
    fn(ref.current!);
    // Fix 3b — la sauvegarde ne doit jamais bloquer la mutation (quota dépassé, mode privé…)
    try { sauver(ref.current!, backend); } catch (err) { console.warn('Le Desk : sauvegarde locale impossible', err); }
    setVersion(v => v + 1);
  }, [backend]);
  const remplacer = useCallback((nouvelEtat: EtatApp) => {
    ref.current = nouvelEtat;
    // Fix 3b — idem
    try { sauver(nouvelEtat, backend); } catch (err) { console.warn('Le Desk : sauvegarde locale impossible', err); }
    setVersion(v => v + 1);
  }, [backend]);

  // Fix 3c — version exposé dans le contexte
  const valeur = useMemo(() => ({ etat: ref.current!, modifier, remplacer, version }), [version, modifier, remplacer]);
  return <Ctx.Provider value={valeur}>{children}</Ctx.Provider>;
}
export function useEtat(): EtatContexte {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useEtat doit être utilisé sous <EtatProvider>');
  return ctx;
}
