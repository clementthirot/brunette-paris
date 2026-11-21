import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';

/** Lecteur Keystatic : lit les contenus du dossier `content/` au moment du build. */
export const reader = createReader(process.cwd(), keystaticConfig);

async function must<T>(p: Promise<T | null>, name: string): Promise<T> {
  const v = await p;
  if (!v) throw new Error(`Contenu Keystatic manquant : ${name}`);
  return v;
}

export const getSettings = () => must(reader.singletons.settings.read(), 'settings');
export const getHome = () => must(reader.singletons.home.read(), 'home');
export const getCreationsPage = () => must(reader.singletons.creationsPage.read(), 'creationsPage');
export const getAtelier = () => must(reader.singletons.atelier.read(), 'atelier');
export const getContact = () => must(reader.singletons.contact.read(), 'contact');
export const getStudio = () => must(reader.singletons.studio.read(), 'studio');
export const getCalendrier = () => must(reader.singletons.calendrier.read(), 'calendrier');
export const getEchantillons = () => must(reader.singletons.echantillons.read(), 'echantillons');
export const getLegal = () => must(reader.singletons.legal.read(), 'legal');

export type Piece = Awaited<ReturnType<typeof getPieces>>[number];
export type Offre = Awaited<ReturnType<typeof getOffres>>[number];
export type Photo = { image: string | null; alt: string; placeholder: string };

export async function getPieces() {
  const all = await reader.collections.pieces.all();
  return all
    .map(({ slug, entry }) => ({ slug, ...entry }))
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));
}

export async function getOffres() {
  const all = await reader.collections.offres.all();
  return all.map(({ slug, entry }) => ({ slug, ...entry })).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function getAuthorizedReferences() {
  const all = await reader.collections.references.all();
  return all.filter(({ entry }) => entry.authorized && entry.logo).map(({ slug, entry }) => ({ slug, ...entry }));
}

export const offreUrl = (slug: string) => `/entreprises/${slug}`;
export const STUDIO_URL = '/entreprises/studio-cadeaux';
export const ECHANTILLONS_URL = '/entreprises/echantillons';
export const occasionUrl = (slug: string) => `/entreprises/cadeaux/${slug}`;

export type Occasion = Awaited<ReturnType<typeof getOccasions>>[number];
export async function getOccasions() {
  const all = await reader.collections.occasions.all();
  return all.map(({ slug, entry }) => ({ slug, ...entry })).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

/**
 * Lien vers le studio avec une composition préremplie (noms de pièce, cuir, marquage),
 * résolus en positions dans les listes du studio. Un nom introuvable est ignoré.
 */
export async function studioLink(preset: { piece?: string; cuir?: string; marquage?: string; quantite?: number | null; occasion?: string }) {
  const s = await getStudio();
  const idx = (list: readonly { nom: string }[], name?: string) => {
    const n = (name ?? '').trim().toLowerCase();
    return n ? list.findIndex((x) => x.nom.trim().toLowerCase() === n) : -1;
  };
  const q = new URLSearchParams();
  const p = idx(s.pieces, preset.piece);
  const c = idx(s.cuirs, preset.cuir);
  const m = idx(s.marquages, preset.marquage);
  if (p >= 0) q.set('piece', String(p));
  if (c >= 0) q.set('cuir', String(c));
  if (m >= 0) q.set('marquage', String(m));
  if (preset.quantite) q.set('qte', String(preset.quantite));
  if (preset.occasion) q.set('occasion', preset.occasion);
  q.set('etape', '1');
  return `${STUDIO_URL}?${q}#studio`;
}
export const pieceUrl = (slug: string) => `/creations/${slug}`;
