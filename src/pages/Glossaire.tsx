import { useMemo, useState } from 'react';
import { useTitre } from './useTitre';
import { useLangue } from '../engine/useLangue';
import { champ, tituleModule } from '../engine/bilingue';
import { glossaire } from '../content/glossary';
import { modules } from '../engine/registry';
import { normaliser, chercher } from '../engine/recherche';
import { Tabs } from '../components/ui/Tabs';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { MathBlock } from '../components/Math';
import type { GlossaireEntree, Formule } from '../engine/types';

/* ─── helpers ─── */

function clesGlossaire(e: GlossaireEntree): string[] {
  return e.en ? [e.terme, e.en, e.definition] : [e.terme, e.definition];
}

function clesFormule(f: Formule): string[] {
  return [f.nom, f.commentaire ?? ''];
}

/* ─── Onglet Glossaire ─── */

function GlossaireOnglet({
  requete,
  langue,
  t,
}: {
  requete: string;
  langue: 'fr' | 'en';
  t: ReturnType<typeof useLangue>['t'];
}) {
  const resultats = useMemo(
    () => chercher(glossaire, requete, clesGlossaire),
    [requete],
  );

  if (glossaire.length === 0) {
    return (
      <EmptyState
        titre={t('glossaire.vide')}
        indice={t('glossaire.videIndice')}
      />
    );
  }

  if (resultats.length === 0) {
    return (
      <EmptyState
        titre={t('glossaire.aucunResultat')}
        indice={t('glossaire.essayezAutreTerme')}
      />
    );
  }

  // Grouper par première lettre
  const parLettre = new Map<string, GlossaireEntree[]>();
  for (const e of resultats) {
    const lettre = normaliser(e.terme[0] ?? '').toUpperCase();
    if (!parLettre.has(lettre)) parLettre.set(lettre, []);
    parLettre.get(lettre)!.push(e);
  }
  const lettres = Array.from(parLettre.keys()).sort();

  return (
    <div className="space-y-6">
      {lettres.map(lettre => (
        <section key={lettre}>
          <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-text-muted border-b border-border pb-1">
            {lettre}
          </h2>
          <ul className="space-y-4">
            {parLettre.get(lettre)!.map((e, i) => {
              const mod = e.moduleId ? modules.find(m => m.meta.id === e.moduleId) : undefined;
              const definition = champ(langue, e.definition, e.definitionEn);
              return (
                <li key={i} className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-sm text-text">{e.terme}</span>
                    {e.en && <Badge variante="neutre">{t('glossaire.equivalentEn')} {e.en}</Badge>}
                    {mod && (
                      <Badge variante="neutre">{tituleModule(mod.meta, langue)}</Badge>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed text-text-muted">{definition}</p>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

/* ─── Onglet Formulaire ─── */

interface FormuleAvecModule extends Formule {
  moduleTitre: string;
  moduleTitreEn?: string;
}

function FormulaireOnglet({
  requete,
  langue,
  t,
}: {
  requete: string;
  langue: 'fr' | 'en';
  t: ReturnType<typeof useLangue>['t'];
}) {
  const toutesFormules: FormuleAvecModule[] = useMemo(
    () =>
      modules.flatMap(m =>
        m.formules.map(f => ({ ...f, moduleTitre: m.meta.titre, moduleTitreEn: m.meta.titreEn })),
      ),
    [],
  );

  const resultats = useMemo(
    () => chercher(toutesFormules, requete, clesFormule),
    [toutesFormules, requete],
  );

  if (toutesFormules.length === 0) {
    return (
      <EmptyState
        titre={t('glossaire.formulaireVide')}
        indice={t('glossaire.formulesAjoutees')}
      />
    );
  }

  if (resultats.length === 0) {
    return (
      <EmptyState
        titre={t('glossaire.aucunResultat')}
        indice={t('glossaire.essayezAutreFormule')}
      />
    );
  }

  // Grouper par module
  const parModule = new Map<string, FormuleAvecModule[]>();
  for (const f of resultats) {
    if (!parModule.has(f.moduleTitre)) parModule.set(f.moduleTitre, []);
    parModule.get(f.moduleTitre)!.push(f);
  }

  return (
    <div className="space-y-8">
      {Array.from(parModule.entries()).map(([titreModule, formules]) => {
        const titreLocalise = champ(langue, titreModule, formules[0]?.moduleTitreEn);
        return (
          <section key={titreModule}>
            <h2 className="mb-3 text-sm font-semibold text-text border-b border-border pb-1">
              {titreLocalise}
            </h2>
            <div className="space-y-5">
              {formules.map((f, i) => {
                const nomLocalise = champ(langue, f.nom, f.nomEn);
                const commentaireLocalise = f.commentaire
                  ? champ(langue, f.commentaire, f.commentaireEn)
                  : undefined;
                return (
                  <div key={i} className="space-y-1">
                    <p className="text-sm font-medium text-text">{nomLocalise}</p>
                    <MathBlock tex={f.latex} />
                    {commentaireLocalise && (
                      <p className="text-xs text-text-muted leading-relaxed">{commentaireLocalise}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

/* ─── Page principale ─── */

export default function Glossaire() {
  const { langue, t } = useLangue();
  useTitre(t('glossaire.titre'));
  const [onglet, setOnglet] = useState<'glossaire' | 'formulaire'>('glossaire');
  const [requete, setRequete] = useState('');

  const onglets = [
    { id: 'glossaire', libelle: t('glossaire.onglet') },
    { id: 'formulaire', libelle: t('glossaire.formulaire') },
  ];

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-semibold tracking-tight text-text">{t('glossaire.titre')}</h1>

      <Tabs
        onglets={onglets}
        actif={onglet}
        onChange={id => {
          setOnglet(id as 'glossaire' | 'formulaire');
          setRequete('');
        }}
        label={t('glossaire.section')}
      />

      {/* Champ de recherche */}
      <div>
        <label htmlFor="recherche-glossaire" className="sr-only">{t('glossaire.rechercher')}</label>
        <input
          id="recherche-glossaire"
          type="search"
          placeholder={onglet === 'glossaire' ? t('glossaire.chercherTerme') : t('glossaire.chercherFormule')}
          value={requete}
          onChange={e => setRequete(e.target.value)}
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-muted focus:border-accent focus:outline-none"
        />
      </div>

      <div role="tabpanel">
        {onglet === 'glossaire' ? (
          <GlossaireOnglet requete={requete} langue={langue} t={t} />
        ) : (
          <FormulaireOnglet requete={requete} langue={langue} t={t} />
        )}
      </div>
    </div>
  );
}
