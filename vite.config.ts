/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  plugins: [
    { enforce: 'pre', ...mdx({ remarkPlugins: [remarkGfm, remarkMath], rehypePlugins: [rehypeKatex], providerImportSource: '@mdx-js/react' }) },
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      // Le bundle principal grossit avec chaque module bilingue : on relève le
      // plafond de précache (défaut 2 Mio) pour garantir le 100 % hors ligne.
      workbox: { maximumFileSizeToCacheInBytes: 8 * 1024 * 1024 },
      manifest: {
        name: 'Le Desk — Finance de marché',
        short_name: 'Le Desk',
        description: 'Cours complet de finance de marché, exercices paramétrés, hors ligne.',
        theme_color: '#0c1118',
        background_color: '#0c1118',
        display: 'standalone',
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
});
