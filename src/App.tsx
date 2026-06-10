import { useEffect } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { EtatProvider, useEtat } from './engine/useEtat';
import Chapitre from './pages/Chapitre';
import Cours from './pages/Cours';
import Dashboard from './pages/Dashboard';
import Entrainement from './pages/Entrainement';
import ExamenBlanc from './pages/ExamenBlanc';
import Glossaire from './pages/Glossaire';
import Module from './pages/Module';
import Reglages from './pages/Reglages';
import RunnerExercices from './pages/RunnerExercices';
import RunnerFlashcards from './pages/RunnerFlashcards';
import RunnerJury from './pages/RunnerJury';
import RunnerQcm from './pages/RunnerQcm';

/** Applique le thème sur <html> : sombre = défaut (sans attribut), clair = data-theme. */
function ApplicateurTheme() {
  const { etat, version } = useEtat();
  useEffect(() => {
    if (etat.reglages.theme === 'clair') document.documentElement.dataset.theme = 'clair';
    else delete document.documentElement.dataset.theme;
  }, [etat, version]);
  return null;
}

export default function App() {
  return (
    <EtatProvider>
      <ApplicateurTheme />
      <HashRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/cours" element={<Cours />} />
            <Route path="/cours/:moduleId" element={<Module />} />
            <Route path="/cours/:moduleId/:chapitreId" element={<Chapitre />} />
            <Route path="/entrainement" element={<Entrainement />} />
            <Route path="/entrainement/exercices" element={<RunnerExercices />} />
            <Route path="/entrainement/qcm" element={<RunnerQcm />} />
            <Route path="/entrainement/jury" element={<RunnerJury />} />
            <Route path="/entrainement/flashcards" element={<RunnerFlashcards />} />
            <Route path="/examen" element={<ExamenBlanc />} />
            <Route path="/glossaire" element={<Glossaire />} />
            <Route path="/reglages" element={<Reglages />} />
          </Route>
        </Routes>
      </HashRouter>
    </EtatProvider>
  );
}
