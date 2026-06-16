import { useEffect, useState } from 'react';
import type { Criteres, EtatApp, Plat, SemaineGeneree } from './types';
import { chargerEtat, sauvegarderEtat } from './lib/stockage';
import Planificateur from './components/Planificateur';
import MesPlats from './components/MesPlats';
import Historique from './components/Historique';

type Onglet = 'planificateur' | 'plats' | 'historique';

export default function App() {
  const [etat, setEtat] = useState<EtatApp>(() => chargerEtat());
  const [onglet, setOnglet] = useState<Onglet>('planificateur');

  // Sauvegarde automatique à chaque changement d'état.
  useEffect(() => {
    sauvegarderEtat(etat);
  }, [etat]);

  function changerCriteres(criteres: Criteres) {
    setEtat((e) => ({ ...e, criteres }));
  }

  function changerPlats(plats: Plat[]) {
    setEtat((e) => ({ ...e, plats }));
  }

  function enregistrerSemaine(semaine: SemaineGeneree) {
    setEtat((e) => ({ ...e, historique: [semaine, ...e.historique] }));
    setOnglet('historique');
  }

  function supprimerSemaine(id: string) {
    setEtat((e) => ({ ...e, historique: e.historique.filter((s) => s.id !== id) }));
  }

  function viderHistorique() {
    setEtat((e) => ({ ...e, historique: [] }));
  }

  return (
    <div className="app">
      <header>
        <h1>🍽️ Planificateur de repas</h1>
        <p>
          Génère ta liste de plats de la semaine selon tes critères, avec de la
          variété d'une semaine à l'autre.
        </p>
      </header>

      <nav className="onglets">
        <button
          className={`onglet ${onglet === 'planificateur' ? 'actif' : ''}`}
          onClick={() => setOnglet('planificateur')}
        >
          Planificateur
        </button>
        <button
          className={`onglet ${onglet === 'plats' ? 'actif' : ''}`}
          onClick={() => setOnglet('plats')}
        >
          Mes plats
        </button>
        <button
          className={`onglet ${onglet === 'historique' ? 'actif' : ''}`}
          onClick={() => setOnglet('historique')}
        >
          Historique
        </button>
      </nav>

      {onglet === 'planificateur' && (
        <Planificateur
          plats={etat.plats}
          criteres={etat.criteres}
          historique={etat.historique}
          onChangerCriteres={changerCriteres}
          onEnregistrer={enregistrerSemaine}
        />
      )}

      {onglet === 'plats' && (
        <MesPlats plats={etat.plats} onChanger={changerPlats} />
      )}

      {onglet === 'historique' && (
        <Historique
          historique={etat.historique}
          onSupprimer={supprimerSemaine}
          onVider={viderHistorique}
        />
      )}

      <footer>
        <p>
          Données enregistrées localement dans ton navigateur. ·{' '}
          Planificateur de repas
        </p>
      </footer>
    </div>
  );
}
