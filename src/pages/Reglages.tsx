import { useRef, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useEtat } from '../engine/useEtat';
import { useTitre } from './useTitre';
import { exporter, importer, etatInitial } from '../engine/storage';
import { aujourdHuiLocal } from '../engine/srs';

/* ─── helpers ─── */

const THEMES = [
  { valeur: 'sombre', libelle: 'Sombre' },
  { valeur: 'clair', libelle: 'Clair' },
] as const;

/* ─── Page ─── */

export default function Reglages() {
  useTitre('Réglages');
  const { etat, modifier, remplacer } = useEtat();
  const theme = etat.reglages.theme;
  const nouvellesCartes = etat.reglages.nouvellesCartesParJour;

  // Import state
  const fichierRef = useRef<HTMLInputElement>(null);
  const [messageImport, setMessageImport] = useState<{ type: 'ok' | 'err'; texte: string } | null>(null);
  const [importEnAttente, setImportEnAttente] = useState<string | null>(null);
  const [modalImportOuvert, setModalImportOuvert] = useState(false);
  const [modalResetOuvert, setModalResetOuvert] = useState(false);
  const [resetConfirm2, setResetConfirm2] = useState(false);

  /* ─── Export ─── */
  function handleExporter() {
    const json = exporter(etat);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const date = aujourdHuiLocal();
    a.href = url;
    a.download = `le-desk-sauvegarde-${date}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /* ─── Import ─── */
  function handleFichierChange(e: React.ChangeEvent<HTMLInputElement>) {
    const fichier = e.target.files?.[0];
    if (!fichier) return;
    const lecteur = new FileReader();
    lecteur.onload = ev => {
      const contenu = ev.target?.result;
      if (typeof contenu !== 'string') return;
      try {
        // Valider sans encore appliquer
        importer(contenu);
        setImportEnAttente(contenu);
        setModalImportOuvert(true);
        setMessageImport(null);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Fichier invalide.';
        setMessageImport({ type: 'err', texte: msg });
      }
      // Reset input pour pouvoir réimporter le même fichier
      if (fichierRef.current) fichierRef.current.value = '';
    };
    lecteur.readAsText(fichier);
  }

  function confirmerImport() {
    if (!importEnAttente) return;
    try {
      const nouvelEtat = importer(importEnAttente);
      remplacer(nouvelEtat);
      setMessageImport({ type: 'ok', texte: 'Progression importée avec succès.' });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de l\'import.';
      setMessageImport({ type: 'err', texte: msg });
    } finally {
      setImportEnAttente(null);
      setModalImportOuvert(false);
    }
  }

  /* ─── Reset ─── */
  function confirmerReset() {
    if (!resetConfirm2) {
      setResetConfirm2(true);
      return;
    }
    remplacer(etatInitial());
    setModalResetOuvert(false);
    setResetConfirm2(false);
    setMessageImport({ type: 'ok', texte: 'Progression réinitialisée.' });
  }

  return (
    <>
      <h1 className="mb-6 text-xl font-semibold tracking-tight text-text">Réglages</h1>
      <div className="flex flex-col gap-4">

        {/* Apparence */}
        <Card titre="Apparence">
          <p className="mb-3 text-sm text-text-muted">Theme de l'interface</p>
          <div className="inline-flex rounded-md border border-border bg-surface-2 p-0.5">
            {THEMES.map(t => {
              const actif = theme === t.valeur;
              return (
                <button
                  key={t.valeur}
                  type="button"
                  aria-pressed={actif}
                  onClick={() => modifier(e => { e.reglages.theme = t.valeur; })}
                  className={`h-9 min-w-24 rounded-[5px] px-4 text-sm font-medium transition-colors duration-150 ${
                    actif ? 'border border-border bg-surface text-text shadow-sm' : 'text-text-muted hover:text-text'
                  }`}
                >
                  {t.libelle}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Flashcards */}
        <Card titre="Flashcards">
          <label className="mb-2 block text-sm text-text-muted" htmlFor="nouvelles-cartes">
            Nouvelles cartes par jour
          </label>
          <input
            id="nouvelles-cartes"
            type="number"
            min={5}
            max={50}
            value={nouvellesCartes}
            onChange={e => {
              const v = Math.max(5, Math.min(50, Number(e.target.value)));
              modifier(etat => { etat.reglages.nouvellesCartesParJour = v; });
            }}
            className="w-24 rounded-md border border-border bg-surface px-3 py-2 text-sm text-text focus:border-accent focus:outline-none"
          />
          <p className="mt-1.5 text-xs text-text-muted">Entre 5 et 50 cartes.</p>
        </Card>

        {/* Sauvegarde */}
        <Card titre="Sauvegarde">
          <div className="space-y-4">
            {/* Message de statut */}
            {messageImport && (
              <p className={`text-sm font-medium ${messageImport.type === 'ok' ? 'text-ok' : 'text-err'}`}>
                {messageImport.texte}
              </p>
            )}

            {/* Export */}
            <div>
              <p className="mb-2 text-sm text-text-muted">
                Téléchargez une copie de votre progression au format JSON.
              </p>
              <Button variante="secondaire" onClick={handleExporter}>
                Exporter ma progression
              </Button>
            </div>

            {/* Import */}
            <div>
              <p className="mb-2 text-sm text-text-muted">
                Restaurez une sauvegarde précédemment exportée.
              </p>
              <Button
                variante="secondaire"
                onClick={() => fichierRef.current?.click()}
              >
                Importer une sauvegarde
              </Button>
              <input
                ref={fichierRef}
                type="file"
                accept=".json,application/json"
                className="sr-only"
                onChange={handleFichierChange}
                aria-hidden="true"
              />
            </div>

            {/* Reset */}
            <div>
              <p className="mb-2 text-sm text-text-muted">
                Supprimez toute votre progression et repartez de zero.
              </p>
              <Button
                variante="secondaire"
                onClick={() => { setResetConfirm2(false); setModalResetOuvert(true); }}
                className="text-err border-err/30 hover:border-err/60"
              >
                Réinitialiser la progression
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Modal confirmation import */}
      <Modal
        ouvert={modalImportOuvert}
        onFermer={() => { setModalImportOuvert(false); setImportEnAttente(null); }}
        titre="Importer une sauvegarde"
      >
        <div className="space-y-4">
          <p className="text-sm text-text-muted leading-relaxed">
            Cette operation remplace votre progression actuelle par la sauvegarde importée.
            Cette action est irréversible.
          </p>
          <div className="flex gap-2">
            <Button variante="primaire" onClick={confirmerImport}>
              Confirmer l'import
            </Button>
            <Button
              variante="secondaire"
              onClick={() => { setModalImportOuvert(false); setImportEnAttente(null); }}
            >
              Annuler
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal confirmation reset */}
      <Modal
        ouvert={modalResetOuvert}
        onFermer={() => { setModalResetOuvert(false); setResetConfirm2(false); }}
        titre="Réinitialiser la progression"
      >
        <div className="space-y-4">
          {!resetConfirm2 ? (
            <>
              <p className="text-sm text-text-muted leading-relaxed">
                Toute votre progression sera definitivement supprimée : tentatives, flashcards, série,
                chapitres lus. Cette action est irréversible.
              </p>
              <div className="flex gap-2">
                <Button variante="secondaire" onClick={confirmerReset} className="text-err border-err/30 hover:border-err/60">
                  Oui, Réinitialiser
                </Button>
                <Button variante="secondaire" onClick={() => { setModalResetOuvert(false); setResetConfirm2(false); }}>
                  Annuler
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-err leading-relaxed">
                Dernière confirmation : êtes-vous certain de vouloir tout effacer ?
              </p>
              <div className="flex gap-2">
                <Button variante="primaire" onClick={confirmerReset} className="bg-err hover:bg-err/85">
                  Effacer définitivement
                </Button>
                <Button variante="secondaire" onClick={() => { setModalResetOuvert(false); setResetConfirm2(false); }}>
                  Annuler
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </>
  );
}
