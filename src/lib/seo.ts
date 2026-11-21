/**
 * Référencement : constantes et utilitaires partagés (balises <head>, données structurées, robots.txt).
 * Les réglages éditables (image de partage par défaut, fiche Google, vérifications) sont dans
 * Keystatic › Réglages globaux › Référencement.
 */

export const SITE_NAME = 'Brunette Paris';

/** Image de partage utilisée quand une page n'en a pas (1200 × 630, dans public/). */
export const DEFAULT_OG_IMAGE = { src: '/og-image.jpg', width: 1200, height: 630, alt: 'Brunette Paris, maroquinerie artisanale' };

/**
 * Indexation : seul le déploiement de production Vercel est indexé (`index, follow`).
 * Les prévisualisations Vercel et les builds locaux sont servis en `noindex` pour éviter le contenu dupliqué.
 * `SEO_INDEX=true` force l'indexation (autre hébergeur), `SEO_INDEX=false` la bloque (ex. avant le choix du domaine).
 */
export const isIndexable =
  process.env.SEO_INDEX === 'true' || (process.env.SEO_INDEX !== 'false' && process.env.VERCEL_ENV === 'production');

/**
 * URL absolue et canonique d'un chemin. Les pages sont générées en dossiers (`/creations/index.html`) et le sitemap
 * liste les adresses avec une barre finale : la canonique suit la même forme pour que les deux concordent.
 */
export function absolute(path: string, site: URL | undefined): string {
  const url = new URL(path, site);
  const isFile = /\.[a-z0-9]+$/i.test(url.pathname);
  if (!isFile && !url.pathname.endsWith('/')) url.pathname += '/';
  return url.href;
}

/** URL absolue d'un fichier (image, modèle) sans barre finale. */
export const absoluteFile = (path: string, site: URL | undefined) => new URL(path, site).href;

/** Coupe un texte à `max` caractères sur une fin de mot, avec points de suspension (meta descriptions). */
export function truncate(text: string, max = 155): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[\s,;:.–—-]+$/, '')}…`;
}

/** Identifiants des entités principales, pour que les autres données structurées y renvoient. */
export const businessId = (site: URL | undefined) => new URL('/#atelier', site).href;
export const websiteId = (site: URL | undefined) => new URL('/#site', site).href;

/**
 * Fil d'Ariane au format BreadcrumbList. Un niveau sans lien (ex. « Entreprises », qui n'a pas de page)
 * est omis, sauf le dernier, qui désigne la page courante.
 */
export function breadcrumbLd(items: { label: string; href?: string }[], site: URL | undefined, currentPath: string) {
  const kept = items.filter((it, i) => it.href || i === items.length - 1);
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: kept.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.label,
      item: absolute(i === kept.length - 1 ? currentPath : it.href!, site),
    })),
  };
}
