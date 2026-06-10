import type { ReactNode } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

/* ── Icônes : SVG inline, géométriques, trait 1.6 ─────────────────── */

function Icone({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

const IconeTableau = (p: { className?: string }) => (
  <Icone {...p}>
    <rect x="3.5" y="3.5" width="7" height="7" rx="1" />
    <rect x="13.5" y="3.5" width="7" height="7" rx="1" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="1" />
    <rect x="13.5" y="13.5" width="7" height="7" rx="1" />
  </Icone>
);
const IconeCours = (p: { className?: string }) => (
  <Icone {...p}>
    <path d="M12 5.5C10.2 4.2 7.6 3.5 4.5 3.5v14.2c3.1 0 5.7.7 7.5 2 1.8-1.3 4.4-2 7.5-2V3.5c-3.1 0-5.7.7-7.5 2z" />
    <path d="M12 5.5v14.2" />
  </Icone>
);
const IconeCible = (p: { className?: string }) => (
  <Icone {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="12" cy="12" r="0.8" fill="currentColor" stroke="none" />
  </Icone>
);
const IconeChrono = (p: { className?: string }) => (
  <Icone {...p}>
    <circle cx="12" cy="13.5" r="7.5" />
    <path d="M12 9.8v3.7l2.6 2M9.5 3h5" />
  </Icone>
);
const IconeMarquePage = (p: { className?: string }) => (
  <Icone {...p}>
    <path d="M6.5 3.5h11v17L12 16.6l-5.5 3.9z" />
  </Icone>
);
const IconeCurseurs = (p: { className?: string }) => (
  <Icone {...p}>
    <path d="M3.5 7.5h3.5M12.5 7.5h8M3.5 16.5h8M17 16.5h3.5" />
    <circle cx="9.75" cy="7.5" r="2.4" />
    <circle cx="14.25" cy="16.5" r="2.4" />
  </Icone>
);

/* ── Navigation : 5 espaces + Réglages ─────────────────────────────── */

interface Entree {
  vers: string;
  libelle: string;
  /** Libellé compact pour la barre d'onglets mobile. */
  libelleCourt: string;
  icone: (p: { className?: string }) => ReactNode;
  fin?: boolean;
}

const ENTREES: Entree[] = [
  { vers: '/', libelle: 'Tableau de bord', libelleCourt: 'Tableau', icone: IconeTableau, fin: true },
  { vers: '/cours', libelle: 'Cours', libelleCourt: 'Cours', icone: IconeCours },
  { vers: '/entrainement', libelle: 'Entraînement', libelleCourt: 'Entraînement', icone: IconeCible },
  { vers: '/examen', libelle: 'Examen blanc', libelleCourt: 'Examen', icone: IconeChrono },
  { vers: '/glossaire', libelle: 'Glossaire', libelleCourt: 'Glossaire', icone: IconeMarquePage },
];

function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex flex-col">
      <span className="flex items-center gap-2">
        <span className="size-2 rounded-[2px] bg-accent" aria-hidden="true" />
        <span className={`font-semibold tracking-[0.18em] text-text ${compact ? 'text-[13px]' : 'text-[15px]'}`}>
          LE&nbsp;DESK
        </span>
      </span>
      {!compact && <span className="pl-4 text-[11px] tracking-wide text-text-muted">Finance de marché</span>}
    </span>
  );
}

function LienLateral({ entree }: { entree: Entree }) {
  const Ico = entree.icone;
  return (
    <NavLink
      to={entree.vers}
      end={entree.fin}
      className={({ isActive }) =>
        `group flex h-10 items-center gap-3 rounded-md px-3 text-sm transition-colors duration-150 ${
          isActive ? 'bg-surface-2 font-medium text-text' : 'text-text-muted hover:bg-surface-2/50 hover:text-text'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Ico
            className={`size-[18px] shrink-0 transition-colors duration-150 ${
              isActive ? 'text-accent' : 'text-text-muted group-hover:text-text'
            }`}
          />
          {entree.libelle}
        </>
      )}
    </NavLink>
  );
}

const REGLAGES: Entree = { vers: '/reglages', libelle: 'Réglages', libelleCourt: 'Réglages', icone: IconeCurseurs };

/* Réglages sur mobile : icône dans l'en-tête compact (accessible partout)
   plutôt qu'un sixième onglet — la barre reste à 5 entrées lisibles. */

export function AppShell() {
  return (
    <div className="min-h-dvh bg-bg text-text">
      {/* Navigation latérale — desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-border bg-surface lg:flex">
        <NavLink to="/" className="rounded-md px-5 pb-6 pt-6" aria-label="Le Desk — Tableau de bord">
          <Wordmark />
        </NavLink>
        <nav className="flex flex-1 flex-col gap-0.5 px-3" aria-label="Navigation principale">
          {ENTREES.map(e => (
            <LienLateral key={e.vers} entree={e} />
          ))}
        </nav>
        <div className="border-t border-border p-3">
          <LienLateral entree={REGLAGES} />
        </div>
      </aside>

      {/* En-tête compact — mobile */}
      <header className="fixed inset-x-0 top-0 z-30 flex h-12 items-center justify-between border-b border-border bg-surface/95 pl-4 pr-1 backdrop-blur lg:hidden">
        <NavLink to="/" aria-label="Le Desk — Tableau de bord">
          <Wordmark compact />
        </NavLink>
        <NavLink
          to="/reglages"
          aria-label="Réglages"
          className={({ isActive }) =>
            `flex size-11 items-center justify-center rounded-md transition-colors duration-150 ${
              isActive ? 'text-accent' : 'text-text-muted hover:text-text'
            }`
          }
        >
          <IconeCurseurs className="size-[20px]" />
        </NavLink>
      </header>

      {/* Barre d'onglets — mobile */}
      <nav
        aria-label="Navigation principale"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
      >
        <div className="grid grid-cols-5">
          {ENTREES.map(e => {
            const Ico = e.icone;
            return (
              <NavLink
                key={e.vers}
                to={e.vers}
                end={e.fin}
                className={({ isActive }) =>
                  `flex h-14 flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors duration-150 ${
                    isActive ? 'text-accent' : 'text-text-muted'
                  }`
                }
              >
                <Ico className="size-[22px]" />
                {e.libelleCourt}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Contenu */}
      <main className="pb-[calc(3.5rem+env(safe-area-inset-bottom))] pt-12 lg:pl-60 lg:pb-0 lg:pt-0">
        <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
