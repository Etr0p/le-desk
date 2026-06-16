import { defineConfig } from 'vitest/config';

// Configuration des tests, séparée de vite.config.ts pour éviter les
// conflits de types entre la version de Vite embarquée par Vitest et celle
// du projet. Les tests unitaires tournent dans un environnement Node.
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
});
