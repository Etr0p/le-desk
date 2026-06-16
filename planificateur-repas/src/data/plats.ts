import type { Plat } from '../types';

/**
 * Base de plats par défaut, livrée avec l'application.
 * L'utilisateur peut en ajouter, en modifier ou en supprimer ; ses
 * changements sont alors sauvegardés dans le navigateur (localStorage).
 */
export const PLATS_PAR_DEFAUT: Plat[] = [
  // --- Végétarien ---
  { id: 'veg-ratatouille', nom: 'Ratatouille', categorie: 'vegetarien', tags: ['légumes', 'été'] },
  { id: 'veg-curry-legumes', nom: 'Curry de légumes', categorie: 'vegetarien', tags: ['épicé'] },
  { id: 'veg-risotto-champi', nom: 'Risotto aux champignons', categorie: 'vegetarien', tags: ['riz'] },
  { id: 'veg-gratin-courgettes', nom: 'Gratin de courgettes', categorie: 'vegetarien', tags: ['four'] },
  { id: 'veg-buddha-bowl', nom: 'Buddha bowl', categorie: 'vegetarien', tags: ['froid', 'sain'] },
  { id: 'veg-chili-sin-carne', nom: 'Chili sin carne', categorie: 'vegetarien', tags: ['haricots'] },
  { id: 'veg-tarte-legumes', nom: 'Tarte aux légumes', categorie: 'vegetarien', tags: ['four'] },
  { id: 'veg-dhal-lentilles', nom: 'Dhal de lentilles corail', categorie: 'vegetarien', tags: ['épicé'] },
  { id: 'veg-soupe-legumes', nom: 'Soupe de légumes', categorie: 'vegetarien', tags: ['hiver', 'léger'] },
  { id: 'veg-falafels', nom: 'Falafels et houmous', categorie: 'vegetarien', tags: ['pois chiches'] },

  // --- Pâtes ---
  { id: 'pat-carbonara', nom: 'Pâtes carbonara', categorie: 'pates', tags: ['crème'] },
  { id: 'pat-pesto', nom: 'Pâtes au pesto', categorie: 'pates', tags: ['rapide'] },
  { id: 'pat-lasagnes', nom: 'Lasagnes', categorie: 'pates', tags: ['four'] },
  { id: 'pat-tagliatelles-champi', nom: 'Tagliatelles aux champignons', categorie: 'pates', tags: ['crème'] },
  { id: 'pat-mac-cheese', nom: 'Macaroni au fromage', categorie: 'pates', tags: ['fromage'] },
  { id: 'pat-arrabbiata', nom: 'Penne arrabbiata', categorie: 'pates', tags: ['épicé', 'tomate'] },
  { id: 'pat-gnocchis-creme', nom: 'Gnocchis à la crème', categorie: 'pates', tags: ['crème'] },
  { id: 'pat-tomate-basilic', nom: 'Spaghetti tomate-basilic', categorie: 'pates', tags: ['rapide', 'tomate'] },

  // --- Viande ---
  { id: 'via-poulet-roti', nom: 'Poulet rôti', categorie: 'viande', tags: ['four'] },
  { id: 'via-steak-frites', nom: 'Steak haché frites', categorie: 'viande', tags: ['rapide'] },
  { id: 'via-boeuf-bourguignon', nom: 'Bœuf bourguignon', categorie: 'viande', tags: ['mijoté', 'hiver'] },
  { id: 'via-escalope-veau', nom: 'Escalope de veau', categorie: 'viande', tags: [] },
  { id: 'via-cote-porc', nom: 'Côte de porc et purée', categorie: 'viande', tags: [] },
  { id: 'via-poulet-curry', nom: 'Poulet au curry', categorie: 'viande', tags: ['épicé'] },
  { id: 'via-saucisses-puree', nom: 'Saucisses purée', categorie: 'viande', tags: ['rapide'] },
  { id: 'via-hachis-parmentier', nom: 'Hachis parmentier', categorie: 'viande', tags: ['four'] },
  { id: 'via-blanquette', nom: 'Blanquette de veau', categorie: 'viande', tags: ['mijoté'] },
  { id: 'via-brochettes-poulet', nom: 'Brochettes de poulet', categorie: 'viande', tags: ['grill'] },

  // --- Poisson ---
  { id: 'poi-saumon-grille', nom: 'Saumon grillé', categorie: 'poisson', tags: ['rapide'] },
  { id: 'poi-cabillaud', nom: 'Filet de cabillaud', categorie: 'poisson', tags: ['four'] },
  { id: 'poi-thon-provencale', nom: 'Thon à la provençale', categorie: 'poisson', tags: ['tomate'] },
  { id: 'poi-crevettes-sautees', nom: 'Crevettes sautées', categorie: 'poisson', tags: ['rapide'] },
  { id: 'poi-moules-frites', nom: 'Moules frites', categorie: 'poisson', tags: [] },
  { id: 'poi-saumon-teriyaki', nom: 'Pavé de saumon teriyaki', categorie: 'poisson', tags: ['asiatique'] },

  // --- Œufs ---
  { id: 'oeu-omelette', nom: 'Omelette aux herbes', categorie: 'oeufs', tags: ['rapide'] },
  { id: 'oeu-quiche-lorraine', nom: 'Quiche lorraine', categorie: 'oeufs', tags: ['four'] },
  { id: 'oeu-frittata', nom: 'Frittata aux légumes', categorie: 'oeufs', tags: [] },
  { id: 'oeu-oeufs-cocotte', nom: 'Œufs cocotte', categorie: 'oeufs', tags: ['four'] },
  { id: 'oeu-shakshuka', nom: 'Shakshuka', categorie: 'oeufs', tags: ['épicé', 'tomate'] },
  { id: 'oeu-oeufs-brouilles', nom: 'Œufs brouillés et toasts', categorie: 'oeufs', tags: ['rapide'] },
];
