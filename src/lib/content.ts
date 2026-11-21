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
export const getConfidentialite = () => must(reader.singletons.confidentialite.read(), 'confidentialite');
export const getCgv = () => must(reader.singletons.cgv.read(), 'cgv');
export const getEntreprisesPage = () => must(reader.singletons.entreprisesPage.read(), 'entreprisesPage');
export const getRealisationsPage = () => must(reader.singletons.realisationsPage.read(), 'realisationsPage');
export const getSurMesure = () => must(reader.singletons.surMesure.read(), 'surMesure');
export const getEntretien = () => must(reader.singletons.entretien.read(), 'entretien');
export const getFaq = () => must(reader.singletons.faq.read(), 'faq');
export const getJournalPage = () => must(reader.singletons.journalPage.read(), 'journalPage');

export type Piece = Awaited<ReturnType<typeof getPieces>>[number];
export type Offre = Awaited<ReturnType<typeof getOffres>>[number];
export type Realisation = Awaited<ReturnType<typeof getRealisations>>[number];
export type Article = Awaited<ReturnType<typeof getArticles>>[number];
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

/** Réalisations publiées, les plus récentes en premier. */
export async function getRealisations() {
  const all = await reader.collections.realisations.all();
  return all
    .filter(({ entry }) => entry.published)
    .map(({ slug, entry }) => ({ slug, ...entry }))
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));
}

/** Articles du journal publiés, les plus récents en premier. */
export async function getArticles() {
  const all = await reader.collections.articles.all();
  return all
    .filter(({ entry }) => entry.published)
    .map(({ slug, entry }) => ({ slug, ...entry }))
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));
}

/** Découpe un texte multiligne en paragraphes (une ligne vide = nouveau paragraphe). */
export const paragraphs = (text?: string | null) =>
  (text ?? '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

/** Date lisible en français (ex. 21 novembre 2026). */
export const formatDate = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

export const offreUrl = (slug: string) => `/entreprises/${slug}`;
export const pieceUrl = (slug: string) => `/creations/${slug}`;
export const realisationUrl = (slug: string) => `/entreprises/realisations/${slug}`;
export const articleUrl = (slug: string) => `/journal/${slug}`;

/** Données structurées FAQPage (Google) à partir d'une liste de questions. */
export const faqJsonLd = (items: readonly { question: string; answer: string }[]) =>
  items.length
    ? [{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map((q) => ({ '@type': 'Question', name: q.question, acceptedAnswer: { '@type': 'Answer', text: q.answer } })),
      }]
    : [];

/** Données structurées BreadcrumbList (fil d'Ariane dans les résultats Google). */
export const breadcrumbJsonLd = (site: URL | undefined, items: { label: string; href?: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.label,
    ...(it.href ? { item: new URL(it.href, site).href } : {}),
  })),
});
