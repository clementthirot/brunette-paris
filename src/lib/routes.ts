/**
 * Arborescence du site : source unique des adresses et des menus (en-tête, menu mobile, pied de page).
 * Les libellés viennent de Keystatic (Réglages globaux › Navigation) ; ici, seulement la structure.
 * Pour ajouter une page au menu : l'ajouter dans `mainNav` ou `footerNav`, rien d'autre à modifier.
 */
import { offreUrl, type Offre, type getSettings } from './content';

type Settings = Awaited<ReturnType<typeof getSettings>>;

export const ROUTES = {
  home: '/',
  entreprises: '/entreprises',
  realisations: '/entreprises/realisations',
  creations: '/creations',
  surMesure: '/sur-mesure',
  atelier: '/atelier',
  entretien: '/entretien',
  journal: '/journal',
  faq: '/faq',
  contact: '/contact',
  contactPro: '/contact?profil=entreprise',
  contactPerso: '/contact?profil=particulier',
  mentions: '/mentions-legales',
  confidentialite: '/confidentialite',
  cgv: '/conditions-generales-de-vente',
} as const;

export interface NavLink { label: string; href: string }
export interface NavItem extends NavLink { children?: NavLink[] }

/** Menu principal : Entreprises ▾ · Créations ▾ · L'atelier ▾ · Contact. */
export function mainNav(settings: Settings, offres: Offre[]): NavItem[] {
  const { nav } = settings;
  return [
    {
      label: nav.entreprises,
      href: ROUTES.entreprises,
      children: [
        { label: nav.entreprisesHub, href: ROUTES.entreprises },
        ...offres.map((o) => ({ label: o.title, href: offreUrl(o.slug) })),
        { label: nav.realisations, href: ROUTES.realisations },
      ],
    },
    {
      label: nav.creations,
      href: ROUTES.creations,
      children: [
        { label: nav.toutesCreations, href: ROUTES.creations },
        { label: nav.surMesure, href: ROUTES.surMesure },
        { label: nav.entretien, href: ROUTES.entretien },
      ],
    },
    {
      label: nav.atelier,
      href: ROUTES.atelier,
      children: [
        { label: nav.atelier, href: ROUTES.atelier },
        { label: nav.journal, href: ROUTES.journal },
        { label: nav.faq, href: ROUTES.faq },
      ],
    },
    { label: nav.contact, href: ROUTES.contact },
  ];
}

/** Colonnes du pied de page. */
export function footerNav(settings: Settings, offres: Offre[]): { title: string; links: NavLink[] }[] {
  const { nav, footer } = settings;
  return [
    {
      title: nav.entreprises,
      links: [
        { label: nav.entreprisesHub, href: ROUTES.entreprises },
        ...offres.map((o) => ({ label: o.title, href: offreUrl(o.slug) })),
        { label: nav.realisations, href: ROUTES.realisations },
      ],
    },
    {
      title: footer.particuliersTitle,
      links: [
        { label: nav.creations, href: ROUTES.creations },
        { label: nav.surMesure, href: ROUTES.surMesure },
        { label: nav.entretien, href: ROUTES.entretien },
      ],
    },
    {
      title: footer.maisonTitle,
      links: [
        { label: nav.atelier, href: ROUTES.atelier },
        { label: nav.journal, href: ROUTES.journal },
        { label: nav.faq, href: ROUTES.faq },
        { label: nav.contact, href: ROUTES.contact },
      ],
    },
  ];
}

export function legalNav(settings: Settings): NavLink[] {
  const { footer } = settings;
  return [
    { label: footer.legalLabel, href: ROUTES.mentions },
    { label: footer.confidentialiteLabel, href: ROUTES.confidentialite },
    { label: footer.cgvLabel, href: ROUTES.cgv },
  ];
}
