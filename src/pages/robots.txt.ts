import type { APIRoute } from 'astro';
import { isIndexable } from '../lib/seo';

/**
 * robots.txt généré au build. En production : tout est explorable sauf l'administration Keystatic,
 * et le sitemap est déclaré. Hors production (prévisualisations Vercel, local) l'exploration reste permise
 * pour que Google lise la balise `noindex` des pages (un `Disallow: /` l'en empêcherait).
 */
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('/sitemap-index.xml', site).href;
  const lines = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /keystatic',
    'Disallow: /api/',
    '',
    ...(isIndexable ? [`Sitemap: ${sitemap}`] : ['# Déploiement hors production : pages servies en noindex.']),
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
