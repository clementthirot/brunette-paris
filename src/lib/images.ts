import sharp from 'sharp';
import path from 'node:path';

const cache = new Map<string, Promise<{ width: number; height: number } | null>>();

/**
 * Dimensions d'une image de `public/` (ex. `/images/pieces/x.jpg`), lues au build.
 * Servent aux attributs width/height (pas de décalage de mise en page, CLS) et aux balises og:image:width/height.
 */
export function imageSize(publicPath: string | null | undefined) {
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
