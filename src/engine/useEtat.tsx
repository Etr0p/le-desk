import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import { charger, sauver, type EtatApp } from './storage';

interface EtatContexte {
  etat: EtatApp;
  modifier: (fn: (e: EtatApp) => void) => void;
  remplacer: (nouvelEtat: EtatApp) => void;
}
const Ctx = createContext<EtatContexte | null>(null);

export function EtatProvider({ children }: { children: ReactNode }) {
  // ref.current est muté en place par `modifier` — l'identité objet reste stable,
  // `etat` est donc toujours à jour via mutation. setVersion force le re-render.
  // `remplacer` swap l'objet : version est inclus dans les deps de useMemo
  // pour que la nouvelle référence soit bien exposée aux consommateurs.
  const ref = useRef<EtatApp | null>(null);
  if (ref.current === null) ref.current = charger(localStorage);
  const [version, setVersion] = useState(0);

  const modifier = useCallback((fn: (e: EtatApp) => void) => {
    fn(ref.current!);
    sauver(ref.current!, localStorage);
    setVersion(v => v + 1);
  }, []);
  const remplacer = useCallback((nouvelEtat: EtatApp) => {
    ref.current = nouvelEtat;
    sauver(nouvelEtat, localStorage);
    setVersion(v => v + 1);
  }, []);

  const valeur = useMemo(() => ({ etat: ref.current!, modifier, remplacer }), [version, modifier, remplacer]);
  return <Ctx.Provider value={valeur}>{children}</Ctx.Provider>;
}
export function useEtat(): EtatContexte {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useEtat doit être utilisé sous <EtatProvider>');
  return ctx;
}
