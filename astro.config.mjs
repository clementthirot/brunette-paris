// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import { readFileSync, readdirSync, existsSync } from 'node:fs';

// Domaine de production : canonique, sitemap, Open Graph et données structurées en dépendent.
// TODO : confirmer le nom de domaine définitif (www ou non) avant la première mise en production ;
// l'autre variante doit rediriger en 301 vers celle-ci (réglage « Domains » de Vercel).
// SITE_URL permet de le surcharger sans toucher au code.
const SITE = process.env.SITE_URL || 'https://www.brunette-paris.fr';

// Variante « version de test » sur GitHub Pages (DEPLOY_TARGET=pages, voir .github/workflows/pages.yml) :
// site 100 % statique, sans adaptateur Vercel ni administration Keystatic, servi sous un sous-chemin
// (BASE_PATH, ex. /brunette-paris). Les liens écrits en dur (« /contact ») sont préfixés après le build
// par scripts/pages-base-path.mjs. Sans DEPLOY_TARGET, la configuration Vercel reste inchangée.
const IS_PAGES = process.env.DEPLOY_TARGET === 'pages';
const BASE = IS_PAGES ? process.env.BASE_PATH || '/' : '/';

// Pages dont la case « Masquer cette page des moteurs de recherche » est cochée dans Keystatic :
// elles sont retirées du sitemap (la balise noindex est posée par le composant Seo).
const PAGE_FILES = { home: '/', atelier: '/atelier', contact: '/contact', creations: '/creations', legal: '/mentions-legales' };
const isNoindex = (file) => existsSync(file) && /^\s+noindex:\s*true\s*$/m.test(readFileSync(file, 'utf8'));
const NOINDEX_PATHS = new Set([
  ...Object.entries(PAGE_FILES).filter(([f]) => isNoindex(`content/${f}.yaml`)).map(([, p]) => p),
  ...(existsSync('content/offres') ? readdirSync('content/offres') : [])
    .filter((f) => isNoindex(`content/offres/${f}`))
    .map((f) => `/entreprises/${f.replace(/\.ya?ml$/, '')}`),
]);

export default defineConfig({
  site: SITE,
  ...(IS_PAGES ? { base: BASE } : {}),
  output: 'static',
  ...(IS_PAGES ? {} : { adapter: vercel() }),
  trailingSlash: 'ignore',
  vite: {
    // Pré-optimise les dépendances chargées à la demande pour éviter les rechargements en dev.
    optimizeDeps: { include: ['gsap', 'gsap/ScrollTrigger', 'gsap/Flip', 'three'] },
  },
  integrations: [
    ...(IS_PAGES ? [] : [react(), keystatic()]),
    sitemap({
      // Exclut l'administration, les API et les pages cochées « noindex » dans Keystatic.
      filter: (page) => {
        const path = new URL(page).pathname.replace(/\/+$/, '') || '/';
        return !/^\/(keystatic|api)(\/|$)/.test(path) && !NOINDEX_PATHS.has(path);
      },
    }),
  ],
});
