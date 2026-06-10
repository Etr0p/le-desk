import { useEffect } from 'react';

/** Met à jour le titre du document : « {titre} — Le Desk ». */
export function useTitre(titre: string): void {
  useEffect(() => {
    document.title = `${titre} — Le Desk`;
  }, [titre]);
}
