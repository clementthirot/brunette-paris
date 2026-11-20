// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// TODO: remplacer par le nom de domaine définitif une fois réservé.
const SITE = 'https://www.brunette-paris.fr';

export default defineConfig({
  site: SITE,
  output: 'static',
  adapter: vercel(),
  trailingSlash: 'ignore',
  vite: {
    // Pré-optimise les dépendances chargées à la demande pour éviter les rechargements en dev.
    optimizeDeps: { include: ['gsap', 'gsap/ScrollTrigger', 'gsap/Flip', 'three'] },
  },
  integrations: [
    react(),
    keystatic(),
    sitemap({
      filter: (page) => !page.includes('/keystatic') && !page.includes('/api/'),
    }),
  ],
});
