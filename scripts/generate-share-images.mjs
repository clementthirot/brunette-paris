import sharp from 'sharp';
import { readFileSync } from 'node:fs';
// Génère les images de partage et icônes à partir des logos vectoriels : node scripts/generate-share-images.mjs
const root = process.cwd();
const sable = '#e1be80', bg = '#151311';
const logo = readFileSync(`${root}/src/assets/logos/logo-principal.svg`, 'utf8').replace('fill="currentColor"', `fill="${sable}"`);
const mono = readFileSync(`${root}/src/assets/logos/logo-secondaire.svg`, 'utf8').replace('fill="currentColor"', `fill="${sable}"`);
const logoPng = await sharp(Buffer.from(logo), { density: 600 }).resize({ width: 760 }).png().toBuffer();
const meta = await sharp(logoPng).metadata();
await sharp({ create: { width: 1200, height: 630, channels: 3, background: bg } })
  .composite([{ input: logoPng, left: Math.round((1200 - meta.width) / 2), top: Math.round((630 - meta.height) / 2) }])
  .jpeg({ quality: 86, mozjpeg: true }).toFile(`${root}/public/og-image.jpg`);
const sq = async (size, pad, out) => {
  const inner = await sharp(Buffer.from(mono), { density: 600 }).resize({ width: size - pad * 2, height: size - pad * 2, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  await sharp({ create: { width: size, height: size, channels: 3, background: bg } }).composite([{ input: inner, gravity: 'center' }]).png({ compressionLevel: 9 }).toFile(out);
};
await sq(512, 64, `${root}/public/logo-brunette-paris.png`);
await sq(180, 24, `${root}/public/apple-touch-icon.png`);
