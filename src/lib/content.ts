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
export const pieceUrl = (slug: string) => `/creations/${slug}`;
