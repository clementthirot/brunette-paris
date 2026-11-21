// Post-build de la version de test GitHub Pages (DEPLOY_TARGET=pages).
//
// Sur GitHub Pages, le site est servi sous un sous-chemin (https://<compte>.github.io/brunette-paris/).
// Astro préfixe déjà ses propres fichiers (/_astro/…, sitemap), mais pas les liens écrits en dur dans
// le code ou dans les contenus Keystatic (« /contact », « /models/x.glb », « /og-image.jpg »…), ni les URL
// absolues construites avec new URL('/chemin', site), qui perdent le sous-chemin.
// Plutôt que de toucher à chaque lien (et de risquer le build Vercel, servi à la racine), ce script
// réécrit le dossier dist/ une fois généré :
//   1. attributs HTML à chemin racine (href, src, srcset, action, poster, content, data-*) → BASE + chemin ;
//   2. URL absolues du site sans le sous-chemin (canonique, Open Graph, JSON-LD, sitemap) → avec.
// Les chemins déjà préfixés et les URL protocole-relatives (//cdn…) ne sont pas touchés.
//
// Usage : BASE_PATH=/brunette-paris SITE_URL=https://clementthirot.github.io node scripts/pages-base-path.mjs [dist]

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const DIST = process.argv[2] || 'dist';
const BASE = (process.env.BASE_PATH || '').replace(/\/+$/, '');
const SITE = (process.env.SITE_URL || '').replace(/\/+$/, '');

if (!BASE) {
  console.log('[pages-base-path] BASE_PATH vide : rien à réécrire.');
  process.exit(0);
}

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const baseNoSlash = BASE.slice(1); // « brunette-paris »

/** Préfixe un chemin racine (« /x ») s'il ne l'est pas déjà. */
const prefix = (path) => {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  if (path === BASE || path.startsWith(`${BASE}/`) || path.startsWith(`${BASE}?`) || path.startsWith(`${BASE}#`)) return path;
  return BASE + path;
};

const ATTRS = 'href|src|action|poster|content|data-[\\w-]+';
const attrRe = new RegExp(`(\\s(?:${ATTRS})=)(["'])(/(?!/)[^"']*)\\2`, 'g');
const srcsetRe = /(\s(?:srcset|imagesrcset)=)(["'])([^"']*)\2/g;
const absRe = SITE ? new RegExp(`${escapeRe(SITE)}(?!/${escapeRe(baseNoSlash)}(?:[/"'?#<\\s]|$))(/[^\\s"'<>)]*)?`, 'g') : null;

const fixAbsolute = (text) => (absRe ? text.replace(absRe, (_, path = '/') => SITE + prefix(path)) : text);

const rewriteHtml = (html) =>
  fixAbsolute(
    html
      .replace(attrRe, (_, a, q, path) => `${a}${q}${prefix(path)}${q}`)
      .replace(srcsetRe, (_, a, q, list) =>
        `${a}${q}${list.split(',').map((c) => c.replace(/^(\s*)(\S+)/, (m, sp, url) => sp + prefix(url))).join(',')}${q}`,
      ),
  );

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

let changed = 0;
for (const file of walk(DIST)) {
  const ext = extname(file);
  if (!['.html', '.xml', '.txt', '.webmanifest', '.json'].includes(ext)) continue;
  const before = readFileSync(file, 'utf8');
  let after = ext === '.html' ? rewriteHtml(before) : fixAbsolute(before);
  if (file.endsWith('robots.txt')) {
    // Le robots.txt d'un sous-chemin n'est pas lu par les moteurs (seul celui de la racine du domaine compte),
    // mais on le rend cohérent : rien n'est à explorer sur la version de test.
    after = 'User-agent: *\nDisallow: /\n# Version de test GitHub Pages : pages servies en noindex.\n';
  }
  if (after !== before) {
    writeFileSync(file, after);
    changed++;
  }
}
console.log(`[pages-base-path] ${changed} fichier(s) réécrit(s) sous ${BASE}.`);
