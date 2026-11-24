import sharp from 'sharp';
import path from 'node:path';
import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';

/**
 * Photos optimisées : les images déposées dans Keystatic (ou ajoutées à la main) vivent dans
 * `src/assets/images/<rubrique>/` et sont référencées dans `content/` par leur chemin
 * `/src/assets/images/<rubrique>/<fichier>`. Astro les redimensionne et les convertit (WebP) au build.
 * Les anciens chemins `public/` (ex. `/images/collaborations/x.webp`) restent servis tels quels.
 */
const ASSETS = import.meta.glob<{ default: ImageMetadata }>('/src/assets/images/**/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
});

/** Image optimisable d'Astro correspondant à un chemin de contenu, ou null (image de `public/`, URL…). */
export function resolveAsset(src: string | null | undefined): ImageMetadata | null {
  if (!src) return null;
  return ASSETS[decodeURI(src)]?.default ?? null;
}

const cache = new Map<string, Promise<{ width: number; height: number } | null>>();

/**
 * Dimensions d'une image (`src/assets/…` ou `public/`), lues au build.
 * Servent aux attributs width/height (pas de décalage de mise en page, CLS) et aux balises og:image:width/height.
 */
export function imageSize(publicPath: string | null | undefined) {
  const asset = resolveAsset(publicPath);
  if (asset) return Promise.resolve({ width: asset.width, height: asset.height });
  if (!publicPath || !publicPath.startsWith('/')) return Promise.resolve(null);
  let p = cache.get(publicPath);
  if (!p) {
    const file = path.join(process.cwd(), 'public', decodeURI(publicPath));
    p = sharp(file)
      .metadata()
      .then((m) => (m.width && m.height ? { width: m.width, height: m.height } : null))
      .catch(() => null);
    cache.set(publicPath, p);
  }
  return p;
}

/**
 * URL publiable d'une image de contenu (partage, données structurées) : pour une image de `src/assets/`,
 * version JPG de 1200 px de large au plus générée par Astro ; sinon le chemin d'origine.
 */
export async function shareImage(src: string | null | undefined) {
  const asset = resolveAsset(src);
  if (!asset) return src ? { src, width: undefined as number | undefined, height: undefined as number | undefined } : null;
  const width = Math.min(1200, asset.width);
  const img = await getImage({ src: asset, width, format: 'jpg', quality: 82 });
  return { src: img.src, width, height: Math.round((asset.height * width) / asset.width) };
}
