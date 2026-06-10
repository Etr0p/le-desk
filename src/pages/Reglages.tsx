import { useRef, useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useEtat } from '../engine/useEtat';
import { useLangue } from '../engine/useLangue';
import { useTitre } from './useTitre';
import { exporter, importer, etatInitial } from '../engine/storage';
import { aujourdHuiLocal } from '../engine/srs';
import type { Langue } from '../engine/types';

/* ─── helpers ─── */

const THEMES = [
  { valeur: 'sombre', cle: 'reglages.sombre' },
  { valeur: 'clair', cle: 'reglages.clair' },
] as const;

// Les noms de langues restent dans leur propre langue (convention des sélecteurs de langue).
const LANGUES: { valeur: Langue; libelle: string }[] = [
  { valeur: 'fr', libelle: 'Français' },
  { valeur: 'en', libelle: 'English' },
];

/* ─── Page ─── */

export default function Reglages() {
  const { langue, t } = useLangue();
  useTitre(t('reglages.titre'));
  const { etat, modifier, remplacer } = useEtat();
  const theme = etat.reglages.theme;
  const nouvellesCartes = etat.reglages.nouvellesCartesParJour;

  // Saisie locale pour « nouvelles cartes par jour » : clamp au blur, pas à chaque frappe
  const [nouvellesCartesLocale, setNouvellesCartesLocale] = useState(String(nouvellesCartes));
  // Synchroniser si la valeur persistée change ailleurs
  useEffect(() => { setNouvellesCartesLocale(String(nouvellesCartes)); }, [nouvellesCartes]);

  function enregistrerNouvellesCartes(texte: string) {
    const v = Math.max(5, Math.min(50, Number(texte) || nouvellesCartes));
    setNouvellesCartesLocale(String(v));
    modifier(etat => { etat.reglages.nouvellesCartesParJour = v; });
  }

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
        const msg = err instanceof Error ? err.message : t('reglages.fichierInvalide');
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
      setMessageImport({ type: 'ok', texte: t('reglages.importReussi') });
    } catch (err) {
      const msg = err instanceof Error ? err.message : t('reglages.importErreur');
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
    setMessageImport({ type: 'ok', texte: t('reglages.resetReussi') });
  }

  return (
    <>
      <h1 className="mb-6 text-xl font-semibold tracking-tight text-text">{t('reglages.titre')}</h1>
      <div className="flex flex-col gap-4">

        {/* Apparence */}
        <Card titre={t('reglages.apparence')}>
          <p className="mb-3 text-sm text-text-muted">{t('reglages.themeInterface')}</p>
          <div className="inline-flex rounded-md border border-border bg-surface-2 p-0.5">
            {THEMES.map(th => {
              const actif = theme === th.valeur;
              return (
                <button
                  key={th.valeur}
                  type="button"
                  aria-pressed={actif}
                  onClick={() => modifier(e => { e.reglages.theme = th.valeur; })}
                  className={`h-9 min-w-24 rounded-[5px] px-4 text-sm font-medium transition-colors duration-150 ${
                    actif ? 'border border-border bg-surface text-text shadow-sm' : 'text-text-muted hover:text-text'
                  }`}
                >
                  {t(th.cle)}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Langue / Language */}
        <Card titre="Langue / Language">
          <p className="mb-3 text-sm text-text-muted">{t('reglages.langueDescription')}</p>
          <div className="inline-flex rounded-md border border-border bg-surface-2 p-0.5">
            {LANGUES.map(l => {
              const actif = langue === l.valeur;
              return (
                <button
                  key={l.valeur}
                  type="button"
                  aria-pressed={actif}
                  lang={l.valeur}
                  onClick={() => modifier(e => { e.reglages.langue = l.valeur; })}
                  className={`h-9 min-w-24 rounded-[5px] px-4 text-sm font-medium transition-colors duration-150 ${
                    actif ? 'border border-border bg-surface text-text shadow-sm' : 'text-text-muted hover:text-text'
                  }`}
                >
                  {l.libelle}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-text-muted">{t('reglages.langueFallback')}</p>
        </Card>

        {/* Flashcards */}
        <Card titre={t('reglages.flashcards')}>
          <label className="mb-2 block text-sm text-text-muted" htmlFor="nouvelles-cartes">
            {t('reglages.nouvellesCartesParJour')}
          </label>
          <input
            id="nouvelles-cartes"
            type="number"
            min={5}
            max={50}
            value={nouvellesCartesLocale}
            onChange={e => setNouvellesCartesLocale(e.target.value)}
            onBlur={e => enregistrerNouvellesCartes(e.target.value)}
            className="w-24 rounded-md border border-border bg-surface px-3 py-2 text-sm text-text focus:border-accent focus:outline-none"
          />
          <p className="mt-1.5 text-xs text-text-muted">{t('reglages.entre5et50')}</p>
        </Card>

        {/* Sauvegarde */}
        <Card titre={t('reglages.sauvegarde')}>
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
                {t('reglages.exportDescription')}
              </p>
              <Button variante="secondaire" onClick={handleExporter}>
                {t('reglages.exporter')}
              </Button>
            </div>

            {/* Import */}
            <div>
              <p className="mb-2 text-sm text-text-muted">
                {t('reglages.importDescription')}
              </p>
              <Button
                variante="secondaire"
                onClick={() => fichierRef.current?.click()}
              >
                {t('reglages.importer')}
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
                {t('reglages.resetDescription')}
              </p>
              <Button
                variante="secondaire"
                onClick={() => { setResetConfirm2(false); setModalResetOuvert(true); }}
                className="text-err border-err/30 hover:border-err/60"
              >
                {t('reglages.reinitialiser')}
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Modal confirmation import */}
      <Modal
        ouvert={modalImportOuvert}
        onFermer={() => { setModalImportOuvert(false); setImportEnAttente(null); }}
        titre={t('reglages.importer')}
      >
        <div className="space-y-4">
          <p className="text-sm text-text-muted leading-relaxed">
            {t('reglages.importModalMessage')}
          </p>
          <div className="flex gap-2">
            <Button variante="primaire" onClick={confirmerImport}>
              {t('reglages.confirmerImport')}
            </Button>
            <Button
              variante="secondaire"
              onClick={() => { setModalImportOuvert(false); setImportEnAttente(null); }}
            >
              {t('commun.annuler')}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal confirmation reset */}
      <Modal
        ouvert={modalResetOuvert}
        onFermer={() => { setModalResetOuvert(false); setResetConfirm2(false); }}
        titre={t('reglages.reinitialiser')}
      >
        <div className="space-y-4">
          {!resetConfirm2 ? (
            <>
              <p className="text-sm text-text-muted leading-relaxed">
                {t('reglages.resetModalMessage')}
              </p>
              <div className="flex gap-2">
                <Button variante="secondaire" onClick={confirmerReset} className="text-err border-err/30 hover:border-err/60">
                  {t('reglages.ouiReinitialiser')}
                </Button>
                <Button variante="secondaire" onClick={() => { setModalResetOuvert(false); setResetConfirm2(false); }}>
                  {t('commun.annuler')}
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-err leading-relaxed">
                {t('reglages.derniereConfirmation')}
              </p>
              <div className="flex gap-2">
                <Button variante="primaire" onClick={confirmerReset} className="bg-err hover:bg-err/85">
                  {t('reglages.effacerDefinitivement')}
                </Button>
                <Button variante="secondaire" onClick={() => { setModalResetOuvert(false); setResetConfirm2(false); }}>
                  {t('commun.annuler')}
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </>
  );
}
