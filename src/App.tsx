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

/** Applique le theme sur <html> : sombre = defaut (sans attribut), clair = data-theme.
    Met egalement a jour <meta name="theme-color"> pour que la barre du navigateur
    (PWA, mobile) suive le theme actif. */
function ApplicateurTheme() {
  const { etat, version } = useEtat();
  useEffect(() => {
    const clair = etat.reglages.theme === 'clair';
    if (clair) document.documentElement.dataset.theme = 'clair';
    else delete document.documentElement.dataset.theme;

    // Mettre a jour la meta theme-color pour la PWA / barre mobile.
    const themeColor = clair ? '#f3f5f9' : '#0c1118';
    let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      document.head.appendChild(meta);
    }
    meta.content = themeColor;
  }, [etat, version]);
  return null;
}

/** Synchronise l'attribut lang de <html> avec la langue active (a11y, lecteurs d'ecran,
    cesure). Meme schema que ApplicateurTheme : effet pilote par l'etat persiste. */
function ApplicateurLangue() {
  const { etat, version } = useEtat();
  useEffect(() => {
    document.documentElement.lang = etat.reglages.langue;
  }, [etat, version]);
  return null;
}

export default function App() {
  return (
    <EtatProvider>
      <ApplicateurTheme />
      <ApplicateurLangue />
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
