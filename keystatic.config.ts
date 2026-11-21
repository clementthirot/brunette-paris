import { config, fields, collection, singleton } from '@keystatic/core';

/**
 * Keystatic : tous les textes et visuels du site sont éditables ici.
 * Interface d'administration : /keystatic (en local : npm run dev).
 *
 * TODO (stockage) : en local, les contenus sont écrits directement dans le dossier `content/`.
 * Une fois le dépôt GitHub créé, passer `storage` en `{ kind: 'github', repo: 'OWNER/REPO' }`
 * (ou Keystatic Cloud) pour que la cliente puisse éditer depuis le site en ligne.
 * Voir README, section « Mise en ligne de l'administration ».
 */

// ---------------------------------------------------------------------------
// Champs réutilisables
// ---------------------------------------------------------------------------

/** Photo avec description de la photo attendue (affichée en placeholder tant que l'image manque). */
const photo = (label: string, dir: string, placeholder = '') =>
  fields.object(
    {
      image: fields.image({
        label: 'Image',
        directory: `public/images/${dir}`,
        publicPath: `/images/${dir}/`,
      }),
      alt: fields.text({ label: 'Texte alternatif (accessibilité et référencement)' }),
      placeholder: fields.text({
        label: 'Photo attendue (texte affiché tant que l’image n’est pas fournie)',
        defaultValue: placeholder,
      }),
    },
    { label }
  );

/** Image de partage (Open Graph) : 1200 × 630 px, JPG ou PNG. */
const ogImage = (label = 'Image de partage (réseaux sociaux)', description = '') =>
  fields.image({
    label,
    description: description || 'Format 1200 × 630 px (JPG ou PNG). Affichée quand la page est partagée (WhatsApp, LinkedIn, Facebook…).',
    directory: 'public/images/partage',
    publicPath: '/images/partage/',
  });

const seo = (title = '', description = '') =>
  fields.object(
    {
      title: fields.text({
        label: 'Titre SEO (balise title)',
        description: 'Environ 50 à 60 caractères : le mot-clé principal en premier, « Brunette Paris » à la fin.',
        defaultValue: title,
      }),
      description: fields.text({
        label: 'Meta description',
        description: 'Environ 140 à 155 caractères : ce que la page apporte, avec une incitation à cliquer.',
        multiline: true,
        defaultValue: description,
      }),
      ogImage: ogImage('Image de partage (optionnelle)', 'Format 1200 × 630 px. Sinon : photo principale de la page, puis image de partage par défaut (Réglages globaux › Référencement).'),
      ogImageAlt: fields.text({ label: 'Description de l’image de partage' }),
      noindex: fields.checkbox({
        label: 'Masquer cette page des moteurs de recherche (noindex)',
        description: 'À cocher seulement pour une page sans intérêt dans Google.',
        defaultValue: false,
      }),
    },
    { label: 'Référencement' }
  );

const txt = (label: string, defaultValue = '') => fields.text({ label, defaultValue });
const para = (label: string, defaultValue = '') => fields.text({ label, multiline: true, defaultValue });

/** Liste de questions / réponses (FAQ), réutilisée par plusieurs pages. */
const faqItems = (label = 'Questions') =>
  fields.array(
    fields.object({ question: txt('Question'), answer: para('Réponse') }),
    { label, itemLabel: (p) => p.fields.question.value || 'Question' }
  );

/** Hero commun aux pages éditoriales (titre, accroche, photo plein cadre). */
const pageHero = (photoLabel: string, dir: string, placeholder = '') =>
  fields.object(
    {
      eyebrow: txt('Surtitre (petite ligne au-dessus du titre)'),
      h1: txt('Titre H1'),
      accroche: para('Phrase d’accroche'),
      photo: photo(photoLabel, dir, placeholder),
    },
    { label: 'Hero' }
  );

/** Schéma commun des pages légales (mentions, confidentialité, CGV). */
const legalSchema = () => ({
  seo: seo(),
  h1: txt('Titre H1'),
  updated: fields.date({ label: 'Date de dernière mise à jour' }),
  sections: fields.array(
    fields.object({ title: txt('Titre'), text: para('Texte') }),
    { label: 'Sections', itemLabel: (p) => p.fields.title.value || 'Section' }
  ),
});

/** Appel à l'action de fin de page, propre à chaque page (laisser vide pour utiliser celui des réglages globaux). */
const pageCta = () =>
  fields.object(
    {
      title: txt('Titre'),
      text: para('Texte'),
      button: txt('Bouton'),
      href: txt('Lien du bouton', '/contact'),
    },
    { label: 'Appel à l’action de fin de page (vide = celui des réglages globaux)' }
  );

// Valeurs techniques des filtres (les libellés affichés sont éditables dans « Page Créations »).
export const CATEGORIES = [
  { label: 'Sacs', value: 'sacs' },
  { label: 'Ceintures', value: 'ceintures' },
  { label: 'Petite maroquinerie', value: 'petite-maroquinerie' },
  { label: 'Golf', value: 'golf' },
  { label: 'Musique', value: 'musique' },
] as const;

export const CUIRS = [
  { label: 'Vache', value: 'vache' },
  { label: 'Python', value: 'python' },
  { label: 'Crocodile', value: 'crocodile' },
] as const;

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

export default config({
  storage: { kind: 'local' },
  ui: {
    brand: { name: 'Brunette Paris' },
    navigation: {
      'Pages principales': ['home', 'entreprisesPage', 'realisationsPage', 'creationsPage', 'surMesure', 'atelier', 'contact'],
      'Entreprises : outils': ['studio', 'echantillons', 'occasions', 'calendrier'],
      'Pages ressources': ['entretien', 'faq', 'journalPage'],
      'Pages légales': ['legal', 'confidentialite', 'cgv'],
      'Contenus': ['pieces', 'offres', 'realisations', 'articles', 'references'],
      'Réglages': ['settings'],
    },
  },

  collections: {
    // -----------------------------------------------------------------------
    pieces: collection({
      label: 'Pièces (créations)',
      slugField: 'title',
      path: 'content/pieces/*',
      format: { data: 'yaml' },
      columns: ['title', 'category', 'leather'],
      schema: {
        title: fields.slug({
          name: { label: 'Nom de la pièce' },
          slug: { label: 'Adresse de la page (slug)', description: 'Ex. sac-besace-camille → /creations/sac-besace-camille' },
        }),
        date: fields.date({ label: 'Date de création', description: 'Sert à trier les pièces (les plus récentes en premier).', defaultValue: { kind: 'today' } }),
        category: fields.select({ label: 'Catégorie', options: [...CATEGORIES], defaultValue: 'sacs' }),
        leather: fields.select({ label: 'Cuir', options: [...CUIRS], defaultValue: 'vache' }),
        description: para('Description'),
        seoDescription: fields.text({
          label: 'Meta description (optionnelle)',
          description: 'Environ 140 à 155 caractères. Sinon, le début de la description est utilisé.',
          multiline: true,
        }),
        dimensions: txt('Dimensions', 'TODO : dimensions à confirmer'),
        edition: fields.select({
          label: 'Pièce unique ou série limitée',
          options: [
            { label: 'Pièce unique', value: 'unique' },
            { label: 'Série limitée', value: 'limitee' },
          ],
          defaultValue: 'unique',
        }),
        availability: fields.select({
          label: 'Disponibilité',
          options: [
            { label: 'Non renseignée', value: 'none' },
            { label: 'Disponible', value: 'disponible' },
            { label: 'Vendue', value: 'vendue' },
          ],
          defaultValue: 'none',
        }),
        price: fields.number({ label: 'Prix en euros (optionnel)', description: 'Laisser vide pour ne pas afficher de prix.' }),
        paymentLink: fields.url({
          label: 'Lien de paiement Stripe (optionnel)',
          description: 'Si renseigné, le bouton « Acquérir cette pièce » mène à ce lien. Sinon, « Demander cette pièce » mène au formulaire de contact.',
        }),
        photos: fields.array(photo('Photo', 'pieces', 'Photo de la pièce, fond neutre'), {
          label: 'Photos (la 1re est la photo principale, la 2e apparaît au survol)',
          itemLabel: (p) => p.fields.alt.value || p.fields.placeholder.value || 'Photo',
        }),
        model3d: fields.file({
          label: 'Modèle 3D (fichier .glb, optionnel)',
          directory: 'public/models',
          publicPath: '/models/',
          validation: { isRequired: false },
        }),
        placeholderShape: fields.select({
          label: 'Forme provisoire 3D (utilisée tant qu’aucun fichier .glb n’est fourni)',
          options: [
            { label: 'Pochette / maroquinerie plate', value: 'cube' },
            { label: 'Porte-clés / médaillon', value: 'sphere' },
            { label: 'Ceinture roulée', value: 'torus' },
            { label: 'Étui allongé', value: 'capsule' },
          ],
          defaultValue: 'cube',
        }),
      },
    }),

    // -----------------------------------------------------------------------
    offres: collection({
      label: 'Offres professionnelles',
      slugField: 'title',
      path: 'content/offres/*',
      format: { data: 'yaml' },
      schema: {
        title: fields.slug({
          name: { label: 'Nom de l’offre (menu, fil d’Ariane, cartes)' },
          slug: { label: 'Adresse de la page', description: 'Page publiée sous /entreprises/<slug>' },
        }),
        order: fields.integer({ label: 'Ordre d’affichage', defaultValue: 1 }),
        seo: seo(),
        card: fields.object(
          {
            phrase: para('Phrase de la carte (page d’accueil)'),
            photo: photo('Photo verticale de la carte', 'offres'),
          },
          { label: 'Carte sur la page d’accueil' }
        ),
        hero: fields.object(
          {
            h1: txt('Titre H1'),
            accroche: para('Phrase d’accroche'),
            photo: photo('Photo plein cadre', 'offres'),
          },
          { label: 'Hero' }
        ),
        intro: fields.object(
          {
            h2: txt('Titre H2'),
            paragraph1: para('Paragraphe 1 (texte SEO)'),
            paragraph2: para('Paragraphe 2 (texte SEO)'),
            photo: photo('Photo verticale', 'offres'),
          },
          { label: 'Introduction (texte SEO)' }
        ),
        pointsCles: fields.object(
          {
            title: txt('Titre de section', 'Ce que nous proposons'),
            items: fields.array(
              fields.object({
                title: txt('Titre'),
                text: para('Texte (2 lignes)'),
                photo: photo('Photo carrée', 'offres'),
              }),
              { label: 'Cartes (3 à 6)', itemLabel: (p) => p.fields.title.value || 'Carte', validation: { length: { min: 3, max: 6 } } }
            ),
          },
          { label: 'Ce que nous proposons (points clés)' }
        ),
        etapes: fields.object(
          {
            title: txt('Titre de section', 'Comment ça se passe'),
            items: fields.array(
              fields.object({ title: txt('Titre de l’étape'), text: para('Texte (optionnel)') }),
              { label: 'Étapes (4)', itemLabel: (p) => p.fields.title.value || 'Étape', validation: { length: { min: 4, max: 4 } } }
            ),
          },
          { label: 'Comment ça se passe' }
        ),
        galerie: fields.object(
          {
            title: txt('Titre de section', 'Galerie'),
            photos: fields.array(photo('Photo', 'offres'), {
              label: 'Photos (6 à 9)',
              itemLabel: (p) => p.fields.alt.value || p.fields.placeholder.value || 'Photo',
              validation: { length: { min: 6, max: 9 } },
            }),
          },
          { label: 'Galerie' }
        ),
        faq: fields.object(
          {
            title: txt('Titre de section', 'Questions fréquentes'),
            items: fields.array(
              fields.object({ question: txt('Question'), answer: para('Réponse') }),
              { label: 'Questions (4 à 6)', itemLabel: (p) => p.fields.question.value || 'Question' }
            ),
          },
          { label: 'Questions fréquentes' }
        ),
      },
    }),

    // -----------------------------------------------------------------------
    realisations: collection({
      label: 'Réalisations (études de cas pro)',
      slugField: 'title',
      path: 'content/realisations/*',
      format: { data: 'yaml' },
      columns: ['title', 'client', 'date'],
      schema: {
        title: fields.slug({
          name: { label: 'Titre de la réalisation' },
          slug: { label: 'Adresse de la page', description: 'Page publiée sous /entreprises/realisations/<slug>' },
        }),
        date: fields.date({ label: 'Date du projet', defaultValue: { kind: 'today' } }),
        published: fields.checkbox({
          label: 'Publiée',
          description: 'Décocher pour garder la réalisation en brouillon (elle n’apparaît nulle part sur le site).',
          defaultValue: false,
        }),
        featured: fields.checkbox({ label: 'Mise en avant sur la page Entreprises', defaultValue: false }),
        client: txt('Client (ou description anonyme, ex. « Une maison de champagne »)'),
        clientAuthorized: fields.checkbox({
          label: 'Le client a autorisé l’affichage de son nom',
          description: 'Sinon, seule la description anonyme est affichée.',
          defaultValue: false,
        }),
        offre: fields.relationship({ label: 'Offre concernée', collection: 'offres' }),
        secteur: txt('Secteur (ex. Hôtellerie, Golf, Musique)'),
        chiffres: fields.array(
          fields.object({ value: txt('Valeur (ex. « 120 »)'), label: txt('Libellé (ex. « pièces numérotées »)') }),
          { label: 'Chiffres clés (2 à 4)', itemLabel: (p) => `${p.fields.value.value} ${p.fields.label.value}`.trim() || 'Chiffre' }
        ),
        resume: para('Résumé (carte et meta description)'),
        cover: photo('Photo de couverture', 'realisations', 'Pièce livrée en situation chez le client'),
        contexte: para('Le contexte / la demande'),
        reponse: para('Notre réponse (matières, finitions, choix)'),
        resultat: para('Le résultat'),
        photos: fields.array(photo('Photo', 'realisations'), {
          label: 'Photos du projet',
          itemLabel: (p) => p.fields.alt.value || p.fields.placeholder.value || 'Photo',
        }),
        temoignage: fields.object(
          { quote: para('Citation'), author: txt('Nom'), role: txt('Fonction et société') },
          { label: 'Témoignage client (optionnel)' }
        ),
        model3d: fields.file({
          label: 'Modèle 3D (fichier .glb, optionnel)',
          directory: 'public/models/realisations',
          publicPath: '/models/realisations/',
          validation: { isRequired: false },
        }),
      },
    }),

    // -----------------------------------------------------------------------
    articles: collection({
      label: 'Journal (articles, coulisses, presse)',
      slugField: 'title',
      path: 'content/articles/*',
      format: { data: 'yaml' },
      columns: ['title', 'category', 'date'],
      schema: {
        title: fields.slug({
          name: { label: 'Titre de l’article' },
          slug: { label: 'Adresse de la page', description: 'Page publiée sous /journal/<slug>' },
        }),
        date: fields.date({ label: 'Date de publication', defaultValue: { kind: 'today' } }),
        published: fields.checkbox({ label: 'Publié', description: 'Décocher pour garder l’article en brouillon.', defaultValue: false }),
        category: fields.select({
          label: 'Rubrique',
          options: [
            { label: 'À l’atelier', value: 'atelier' },
            { label: 'Matières et savoir-faire', value: 'savoir-faire' },
            { label: 'Conseils', value: 'conseils' },
            { label: 'Presse et événements', value: 'presse' },
          ],
          defaultValue: 'atelier',
        }),
        seo: seo(),
        excerpt: para('Chapeau (affiché sur la carte et en tête d’article)'),
        cover: photo('Photo de couverture', 'journal', 'Photo de couverture (paysage)'),
        externalUrl: fields.url({
          label: 'Lien externe (optionnel)',
          description: 'Pour une parution presse : la carte mène directement vers l’article du média.',
        }),
        sections: fields.array(
          fields.object({
            heading: txt('Intertitre (optionnel)'),
            text: para('Texte (une ligne vide = nouveau paragraphe)'),
            photo: photo('Photo (optionnelle)', 'journal', ''),
            quote: para('Citation mise en exergue (optionnelle)'),
          }),
          { label: 'Contenu (sections)', itemLabel: (p) => p.fields.heading.value || p.fields.text.value.slice(0, 40) || 'Section' }
        ),
        pieces: fields.array(fields.relationship({ label: 'Pièce', collection: 'pieces' }), {
          label: 'Pièces liées (affichées en bas de l’article)',
          itemLabel: (p) => p.value ?? 'Pièce',
        }),
      },
    }),

    // -----------------------------------------------------------------------
    occasions: collection({
      label: 'Cadeaux par occasion (pages entreprises)',
      slugField: 'title',
      path: 'content/occasions/*',
      format: { data: 'yaml' },
      columns: ['title', 'order'],
      schema: {
        title: fields.slug({
          name: { label: 'Nom de l’occasion (ex. Cadeaux de fin d’année)' },
          slug: { label: 'Adresse de la page', description: 'Ex. fin-d-annee → /entreprises/cadeaux/fin-d-annee' },
        }),
        order: fields.integer({ label: 'Ordre d’affichage', defaultValue: 0 }),
        seo: seo(),
        hero: fields.object(
          {
            eyebrow: txt('Surtitre'),
            h1: txt('Titre H1'),
            accroche: para('Accroche'),
            photo: photo('Photo du haut de page', 'occasions'),
          },
          { label: 'Haut de page' }
        ),
        carte: txt('Phrase courte (cartes de liste)'),
        intro: fields.object(
          { h2: txt('Titre'), texte: para('Texte (référencement)') },
          { label: 'Introduction' }
        ),
        arguments: fields.array(
          fields.object({ titre: txt('Titre'), texte: para('Texte') }),
          { label: 'Arguments', itemLabel: (p) => p.fields.titre.value || 'Argument' }
        ),
        suggestions: fields.object(
          {
            titre: txt('Titre de la section'),
            items: fields.array(
              fields.object({
                piece: txt('Nom de la pièce (exactement comme dans Studio cadeaux › Pièces)'),
                pourquoi: txt('Pourquoi cette pièce pour cette occasion'),
              }),
              { label: 'Pièces suggérées', itemLabel: (p) => p.fields.piece.value || 'Pièce' }
            ),
          },
          { label: 'Pièces suggérées' }
        ),
        preset: fields.object(
          {
            piece: txt('Pièce (nom exact)'),
            cuir: txt('Cuir (nom exact)'),
            marquage: txt('Marquage (nom exact)'),
            quantite: fields.integer({ label: 'Quantité', defaultValue: 50 }),
            occasion: txt('Occasion (exactement comme dans Studio cadeaux › Occasions proposées)'),
            bouton: txt('Bouton vers le studio prérempli'),
          },
          { label: 'Composition préremplie dans le studio' }
        ),
        echeance: txt('Échéance du calendrier à mettre en avant (nom exact, vide = la prochaine)'),
        faq: fields.object(
          {
            titre: txt('Titre'),
            items: fields.array(
              fields.object({ question: txt('Question'), reponse: para('Réponse') }),
              { label: 'Questions', itemLabel: (p) => p.fields.question.value || 'Question' }
            ),
          },
          { label: 'Questions fréquentes' }
        ),
      },
    }),

    // -----------------------------------------------------------------------
    references: collection({
      label: 'Références clients',
      slugField: 'name',
      path: 'content/references/*',
      format: { data: 'yaml' },
      columns: ['name', 'authorized'],
      schema: {
        name: fields.slug({ name: { label: 'Nom du client' } }),
        logo: fields.image({ label: 'Logo', directory: 'public/images/references', publicPath: '/images/references/' }),
        authorized: fields.checkbox({
          label: 'Autorisation d’affichage obtenue',
          description: 'Le bandeau de références n’apparaît que si au moins une référence est autorisée.',
          defaultValue: false,
        }),
      },
    }),
  },

  singletons: {
    // -----------------------------------------------------------------------
    settings: singleton({
      label: 'Réglages globaux',
      path: 'content/settings',
      format: { data: 'yaml' },
      schema: {
        coordonnees: fields.object(
          {
            email: txt('Email'),
            phone: txt('Téléphone'),
            city: txt('Ville'),
            region: txt('Région'),
            zone: txt('Zone d’intervention'),
          },
          { label: 'Coordonnées' }
        ),
        reseaux: fields.object(
          {
            instagramHandle: txt('Instagram (pseudo affiché)'),
            instagramUrl: fields.url({ label: 'Instagram (lien)' }),
            etsyUrl: fields.url({ label: 'Etsy (lien)' }),
          },
          { label: 'Réseaux sociaux' }
        ),
        nav: fields.object(
          {
            entreprises: txt('Menu : Entreprises'),
            creations: txt('Menu : Créations'),
            atelier: txt('Menu : L’atelier'),
            contact: txt('Menu : Contact'),
            entreprisesHub: txt('Sous-menu : Vue d’ensemble (page Entreprises)'),
            realisations: txt('Menu : Réalisations'),
            studio: txt('Sous-menu : Studio cadeaux (configurateur)'),
            echantillons: txt('Sous-menu : Kit d’échantillons'),
            toutesCreations: txt('Sous-menu : Toutes les créations'),
            surMesure: txt('Menu : Sur-mesure'),
            entretien: txt('Menu : Entretien'),
            journal: txt('Menu : Journal'),
            faq: txt('Menu : FAQ'),
            devis: txt('Bouton : Demander un devis'),
            menuOpen: txt('Bouton menu mobile (ouvrir)'),
            menuClose: txt('Bouton menu mobile (fermer)'),
            home: txt('Fil d’Ariane : Accueil'),
            skip: txt('Lien d’accessibilité « Aller au contenu »'),
          },
          { label: 'Navigation' }
        ),
        footer: fields.object(
          {
            tagline: txt('Rappel sous le logo'),
            legalLabel: txt('Lien : Mentions légales'),
            confidentialiteLabel: txt('Lien : Politique de confidentialité'),
            cgvLabel: txt('Lien : Conditions générales de vente'),
            particuliersTitle: txt('Titre de colonne : Particuliers'),
            maisonTitle: txt('Titre de colonne : La maison'),
            newsletter: fields.object(
              { title: txt('Titre'), text: para('Texte'), url: fields.url({ label: 'Lien d’inscription (Brevo, Mailchimp…) — vide = bloc masqué' }), button: txt('Bouton') },
              { label: 'Lettre d’information' }
            ),
            copyright: txt('Mention de copyright'),
          },
          { label: 'Pied de page' }
        ),
        ctaFinal: fields.object(
          {
            title: txt('Titre'),
            text: para('Texte'),
            button: txt('Bouton principal'),
            secondary: txt('Lien secondaire'),
          },
          { label: 'Appel à l’action final (accueil et pages d’offre)' }
        ),
        labels: fields.object(
          {
            learnMore: txt('Lien : En savoir plus'),
            unique: txt('Mention : Pièce unique'),
            limitee: txt('Mention : Série limitée'),
            disponible: txt('Mention : Disponible'),
            vendue: txt('Mention : Vendue'),
            scroll: txt('Indicateur de défilement (lecteur d’écran)'),
            close: txt('Bouton : Fermer'),
            previous: txt('Bouton : Précédent'),
            next: txt('Bouton : Suivant'),
            viewer3d: txt('Visionneuse 3D (lecteur d’écran)'),
          },
          { label: 'Libellés communs' }
        ),
        notFound: fields.object(
          {
            seoTitle: txt('Titre SEO'),
            phrase: txt('Phrase'),
            link: txt('Lien vers l’accueil'),
          },
          { label: 'Page 404' }
        ),
        referencement: fields.object(
          {
            ogImage: ogImage('Image de partage par défaut', 'Format 1200 × 630 px. Utilisée par les pages sans photo. Sinon : visuel au logo fourni avec le site.'),
            googleBusinessUrl: fields.url({
              label: 'Lien de la fiche Google Business Profile',
              description: 'Lien public de la fiche (bouton « Partager » sur Google Maps). Relie le site à la fiche dans les données structurées.',
            }),
            streetAddress: fields.text({
              label: 'Adresse de l’atelier (rue)',
              description: 'Facultatif. À ne renseigner que si l’adresse est publique et identique à celle de la fiche Google.',
            }),
            postalCode: fields.text({ label: 'Code postal' }),
            openingHours: fields.text({
              label: 'Horaires (format schema.org)',
              description: 'Facultatif. Ex. « Mo-Fr 10:00-18:00 » ou « Tu-Sa 10:00-19:00 ».',
            }),
            priceRange: fields.text({ label: 'Gamme de prix', description: 'Facultatif. Ex. « €€€ » ou « 50 € - 2 000 € ».' }),
            googleVerification: fields.text({
              label: 'Code de validation Google Search Console',
              description: 'Valeur « content » de la balise HTML proposée par Search Console (inutile si validation par DNS).',
            }),
            bingVerification: fields.text({ label: 'Code de validation Bing Webmaster Tools' }),
          },
          { label: 'Référencement (SEO)' }
        ),
        formEndpoint: fields.url({
          label: 'Adresse d’envoi du formulaire (Formspree ou fonction serverless)',
          description: 'TODO : créer un formulaire Formspree et coller ici son adresse (https://formspree.io/f/xxxx).',
        }),
      },
    }),

    // -----------------------------------------------------------------------
    home: singleton({
      label: 'Accueil',
      path: 'content/home',
      format: { data: 'yaml' },
      schema: {
        seo: seo(),
        hero: fields.object(
          {
            h1: txt('Titre H1'),
            subtitle: para('Sous-titre'),
            photo: photo('Photo de fond (mains travaillant le cuir)', 'accueil'),
            video: fields.file({
              label: 'Vidéo de fond (optionnelle, .mp4)',
              directory: 'public/videos',
              publicPath: '/videos/',
              validation: { isRequired: false },
            }),
          },
          { label: '1. Hero' }
        ),
        entree: fields.object(
          {
            entreprises: fields.object({
              title: txt('Titre'),
              text: para('Texte'),
              button: txt('Bouton'),
              photo: photo('Photo', 'accueil'),
            }, { label: 'Bloc « Pour les entreprises »' }),
            particuliers: fields.object({
              title: txt('Titre'),
              text: para('Texte'),
              button: txt('Bouton'),
              photo: photo('Photo', 'accueil'),
            }, { label: 'Bloc « Pour vous »' }),
          },
          { label: '2. Double entrée' }
        ),
        manifeste: fields.object(
          {
            phrase: para('Phrase'),
            chiffres: fields.array(
              fields.object({
                value: fields.integer({ label: 'Valeur chiffrée (comptée de 0 à la valeur, optionnelle)' }),
                suffix: txt('Suffixe après la valeur (ex. « % »)'),
                label: txt('Libellé'),
              }),
              {
                label: 'Chiffres clés (valeurs à confirmer avec la cliente)',
                itemLabel: (p) => `${p.fields.value.value ?? ''}${p.fields.suffix.value} ${p.fields.label.value}`.trim(),
              }
            ),
          },
          { label: '3. Manifeste' }
        ),
        offres: fields.object(
          {
            title: txt('Titre H2'),
            items: fields.array(fields.relationship({ label: 'Offre', collection: 'offres' }), {
              label: 'Offres affichées (dans l’ordre)',
              itemLabel: (p) => p.value ?? 'Offre',
            }),
          },
          { label: '4. Offres professionnelles' }
        ),
        vedette: fields.object(
          {
            title: txt('Titre H2'),
            pieces: fields.array(fields.relationship({ label: 'Pièce', collection: 'pieces' }), {
              label: 'Pièces en vignettes (4) — la première est affichée au chargement',
              itemLabel: (p) => p.value ?? 'Pièce',
              validation: { length: { max: 4 } },
            }),
            button: txt('Bouton'),
          },
          { label: '5. Pièces en vedette' }
        ),
        savoirFaire: fields.object(
          {
            title: txt('Titre H2'),
            etapes: fields.array(
              fields.object({
                title: txt('Titre'),
                text: para('Texte (2 lignes)'),
                photo: photo('Photo', 'accueil'),
              }),
              { label: 'Étapes (4)', itemLabel: (p) => p.fields.title.value || 'Étape' }
            ),
          },
          { label: '6. Savoir-faire' }
        ),
        references: fields.object(
          { label: txt('Libellé du bandeau (lecteur d’écran)') },
          { label: '7. Références (les logos se gèrent dans « Références clients »)' }
        ),
      },
    }),

    // -----------------------------------------------------------------------
    creationsPage: singleton({
      label: 'Page Créations et fiches pièces',
      path: 'content/creations',
      format: { data: 'yaml' },
      schema: {
        seo: seo(),
        h1: txt('Titre H1'),
        phrase: txt('Phrase'),
        filtres: fields.object(
          {
            type: txt('Libellé du filtre « Type »'),
            cuir: txt('Libellé du filtre « Cuir »'),
            tous: txt('Option « Tous »'),
            vide: txt('Message si aucune pièce ne correspond'),
            categories: fields.object(
              Object.fromEntries(CATEGORIES.map((c) => [c.value, txt(c.label)])) as Record<(typeof CATEGORIES)[number]['value'], ReturnType<typeof txt>>,
              { label: 'Libellés des types' }
            ),
            cuirs: fields.object(
              Object.fromEntries(CUIRS.map((c) => [c.value, txt(c.label)])) as Record<(typeof CUIRS)[number]['value'], ReturnType<typeof txt>>,
              { label: 'Libellés des cuirs' }
            ),
          },
          { label: 'Barre de filtres' }
        ),
        encart: fields.object(
          { text: para('Texte'), button: txt('Bouton') },
          { label: 'Encart bas de page (sur-mesure)' }
        ),
        fiche: fields.object(
          {
            seoTitle: txt('Modèle du titre SEO', '{nom} en cuir de {cuir} | Brunette Paris'),
            leatherPrefix: txt('Préfixe du cuir (ex. « Cuir de »)'),
            dimensions: txt('Libellé : Dimensions'),
            price: txt('Libellé : Prix'),
            tab3d: txt('Onglet : 3D'),
            tabPhotos: txt('Onglet : Photos'),
            buy: txt('Bouton si lien de paiement : Acquérir cette pièce'),
            ask: txt('Bouton sinon : Demander cette pièce'),
            entretienTitle: txt('Bloc repliable : titre'),
            entretienText: para('Bloc repliable : texte'),
            similarTitle: txt('Titre : Vous aimerez aussi'),
          },
          { label: 'Fiche pièce' }
        ),
      },
    }),

    // -----------------------------------------------------------------------
    atelier: singleton({
      label: 'L’atelier',
      path: 'content/atelier',
      format: { data: 'yaml' },
      schema: {
        seo: seo(),
        hero: fields.object({ h1: txt('Titre H1'), photo: photo('Portrait d’Armonie à l’atelier', 'atelier') }, { label: 'Hero' }),
        histoire: fields.object(
          {
            title: txt('Titre H2'),
            paragraphs: fields.array(para('Paragraphe'), { label: 'Paragraphes (texte au « je »)', itemLabel: (p) => p.value.slice(0, 50) || 'Paragraphe' }),
            citation: para('Citation mise en exergue'),
          },
          { label: 'Histoire' }
        ),
        matieres: fields.object(
          {
            title: txt('Titre H2'),
            hint: txt('Indication (survol / toucher)'),
            items: fields.array(
              fields.object({ name: txt('Cuir'), text: para('Texte'), photo: photo('Texture en gros plan', 'atelier') }),
              { label: 'Matières (3)', itemLabel: (p) => p.fields.name.value || 'Matière' }
            ),
          },
          { label: 'Les matières' }
        ),
        finitions: fields.object(
          {
            title: txt('Titre H2'),
            items: fields.array(
              fields.object({ name: txt('Technique'), phrase: para('Phrase'), photo: photo('Photo macro', 'atelier') }),
              { label: 'Finitions (3)', itemLabel: (p) => p.fields.name.value || 'Finition' }
            ),
          },
          { label: 'Les finitions' }
        ),
        galerie: fields.object(
          {
            title: txt('Titre H2'),
            photos: fields.array(photo('Photo', 'atelier'), {
              label: 'Photos (6)',
              itemLabel: (p) => p.fields.alt.value || p.fields.placeholder.value || 'Photo',
            }),
          },
          { label: 'Galerie atelier' }
        ),
      },
    }),

    // -----------------------------------------------------------------------
    contact: singleton({
      label: 'Contact et devis',
      path: 'content/contact',
      format: { data: 'yaml' },
      schema: {
        seo: seo(),
        h1: txt('Titre H1'),
        selecteur: fields.object(
          { entreprise: txt('Option entreprise'), particulier: txt('Option particulier'), legend: txt('Légende (lecteur d’écran)') },
          { label: 'Sélecteur' }
        ),
        champs: fields.object(
          {
            nom: txt('Nom'),
            societe: txt('Société'),
            email: txt('Email'),
            telephone: txt('Téléphone'),
            typeProjet: txt('Type de projet'),
            typesProjet: fields.array(txt('Type'), { label: 'Types de projet proposés', itemLabel: (p) => p.value }),
            date: txt('Date envisagée'),
            quantite: txt('Nombre de personnes ou de pièces'),
            piece: txt('Pièce concernée'),
            message: txt('Message'),
            requis: txt('Mention champ obligatoire'),
            submit: txt('Bouton d’envoi'),
            sending: txt('Texte pendant l’envoi'),
          },
          { label: 'Champs du formulaire' }
        ),
        confirmation: txt('Message de confirmation'),
        erreur: txt('Message d’erreur'),
        aside: fields.object(
          { emailLabel: txt('Libellé email'), instagramLabel: txt('Libellé Instagram'), zoneLabel: txt('Libellé zone d’intervention') },
          { label: 'Colonne latérale' }
        ),
      },
    }),

    // -----------------------------------------------------------------------
    entreprisesPage: singleton({
      label: 'Entreprises (page d’accueil pro)',
      path: 'content/entreprises',
      format: { data: 'yaml' },
      schema: {
        seo: seo(),
        hero: pageHero('Photo plein cadre', 'entreprises', 'Plein cadre, pièces marquées au logo d’une marque sur l’établi'),
        intro: fields.object(
          { h2: txt('Titre H2'), text: para('Texte (une ligne vide = nouveau paragraphe)') },
          { label: 'Introduction' }
        ),
        pourquoi: fields.object(
          {
            title: txt('Titre de section'),
            items: fields.array(
              fields.object({ title: txt('Titre'), text: para('Texte (2 lignes)') }),
              { label: 'Arguments (3 à 4)', itemLabel: (p) => p.fields.title.value || 'Argument' }
            ),
          },
          { label: 'Pourquoi un atelier artisanal' }
        ),
        offresTitle: txt('Titre de la section Offres (les cartes viennent de « Offres professionnelles »)'),
        etapes: fields.object(
          {
            title: txt('Titre de section'),
            items: fields.array(
              fields.object({ title: txt('Titre de l’étape'), text: para('Texte') }),
              { label: 'Étapes (4)', itemLabel: (p) => p.fields.title.value || 'Étape', validation: { length: { min: 4, max: 4 } } }
            ),
          },
          { label: 'Méthode de travail' }
        ),
        realisations: fields.object(
          { title: txt('Titre'), link: txt('Lien « Toutes les réalisations »') },
          { label: 'Réalisations mises en avant (cocher « Mise en avant » sur la réalisation)' }
        ),
        faq: fields.object({ title: txt('Titre de section'), items: faqItems() }, { label: 'Questions fréquentes pro' }),
        cta: pageCta(),
      },
    }),

    // -----------------------------------------------------------------------
    realisationsPage: singleton({
      label: 'Liste des réalisations',
      path: 'content/realisations-page',
      format: { data: 'yaml' },
      schema: {
        seo: seo(),
        h1: txt('Titre H1'),
        phrase: para('Phrase d’introduction'),
        vide: para('Texte affiché tant qu’aucune réalisation n’est publiée'),
        labels: fields.object(
          {
            contexte: txt('Intertitre : Le contexte'),
            reponse: txt('Intertitre : Notre réponse'),
            resultat: txt('Intertitre : Le résultat'),
            offre: txt('Libellé : Offre'),
            secteur: txt('Libellé : Secteur'),
            autres: txt('Titre : Autres réalisations'),
            voir: txt('Lien : Voir la réalisation'),
          },
          { label: 'Libellés des fiches' }
        ),
      },
    }),

    // -----------------------------------------------------------------------
    surMesure: singleton({
      label: 'Sur-mesure particuliers',
      path: 'content/sur-mesure',
      format: { data: 'yaml' },
      schema: {
        seo: seo(),
        hero: pageHero('Photo plein cadre', 'sur-mesure', 'Plein cadre, Armonie présente des échantillons de cuir à une cliente'),
        intro: fields.object(
          { h2: txt('Titre H2'), text: para('Texte (une ligne vide = nouveau paragraphe)'), photo: photo('Photo verticale', 'sur-mesure', 'Vertical, croquis et gabarit papier d’un sac') },
          { label: 'Introduction' }
        ),
        projets: fields.object(
          {
            title: txt('Titre de section'),
            items: fields.array(
              fields.object({ title: txt('Titre'), text: para('Texte (2 lignes)'), photo: photo('Photo carrée', 'sur-mesure') }),
              { label: 'Types de projets (3 à 6)', itemLabel: (p) => p.fields.title.value || 'Projet' }
            ),
          },
          { label: 'Ce que l’on peut créer pour vous' }
        ),
        etapes: fields.object(
          {
            title: txt('Titre de section'),
            items: fields.array(
              fields.object({ title: txt('Titre de l’étape'), text: para('Texte') }),
              { label: 'Étapes (4)', itemLabel: (p) => p.fields.title.value || 'Étape', validation: { length: { min: 4, max: 4 } } }
            ),
          },
          { label: 'Les étapes de votre commande' }
        ),
        reperes: fields.object(
          {
            title: txt('Titre de section'),
            items: fields.array(
              fields.object({ label: txt('Libellé (ex. « Délai »)'), value: txt('Valeur (ex. « 4 à 8 semaines »)') }),
              { label: 'Repères (délais, budget, acompte…)', itemLabel: (p) => p.fields.label.value || 'Repère' }
            ),
            note: para('Note sous les repères'),
          },
          { label: 'Repères pratiques' }
        ),
        faq: fields.object({ title: txt('Titre de section'), items: faqItems() }, { label: 'Questions fréquentes' }),
        cta: pageCta(),
      },
    }),

    // -----------------------------------------------------------------------
    entretien: singleton({
      label: 'Entretien et réparation',
      path: 'content/entretien',
      format: { data: 'yaml' },
      schema: {
        seo: seo(),
        hero: pageHero('Photo plein cadre', 'entretien', 'Plein cadre, mains appliquant une crème sur un sac en cuir'),
        intro: para('Introduction'),
        cuirs: fields.object(
          {
            title: txt('Titre de section'),
            items: fields.array(
              fields.object({
                name: txt('Cuir'),
                conseils: fields.array(txt('Conseil'), { label: 'Conseils', itemLabel: (p) => p.value || 'Conseil' }),
                photo: photo('Texture en gros plan', 'entretien'),
              }),
              { label: 'Conseils par cuir', itemLabel: (p) => p.fields.name.value || 'Cuir' }
            ),
          },
          { label: 'Conseils par cuir' }
        ),
        gestes: fields.object(
          {
            title: txt('Titre de section'),
            faire: fields.array(txt('Geste'), { label: 'À faire', itemLabel: (p) => p.value || 'Geste' }),
            eviter: fields.array(txt('Geste'), { label: 'À éviter', itemLabel: (p) => p.value || 'Geste' }),
            faireLabel: txt('Libellé : À faire'),
            eviterLabel: txt('Libellé : À éviter'),
          },
          { label: 'Les bons gestes' }
        ),
        reparation: fields.object(
          { title: txt('Titre'), text: para('Texte'), button: txt('Bouton'), photo: photo('Photo', 'entretien', 'Couture sellier en cours de reprise sur une anse') },
          { label: 'Réparation et restauration' }
        ),
        faq: fields.object({ title: txt('Titre de section'), items: faqItems() }, { label: 'Questions fréquentes' }),
      },
    }),

    // -----------------------------------------------------------------------
    faq: singleton({
      label: 'FAQ générale',
      path: 'content/faq',
      format: { data: 'yaml' },
      schema: {
        seo: seo(),
        h1: txt('Titre H1'),
        intro: para('Introduction'),
        groupes: fields.array(
          fields.object({ title: txt('Thème'), items: faqItems() }),
          { label: 'Thèmes', itemLabel: (p) => p.fields.title.value || 'Thème' }
        ),
        contact: fields.object(
          { text: txt('Texte'), button: txt('Bouton') },
          { label: 'Encart « Vous ne trouvez pas votre réponse ? »' }
        ),
      },
    }),

    // -----------------------------------------------------------------------
    journalPage: singleton({
      label: 'Journal (page liste)',
      path: 'content/journal',
      format: { data: 'yaml' },
      schema: {
        seo: seo(),
        h1: txt('Titre H1'),
        phrase: para('Phrase d’introduction'),
        tous: txt('Filtre : Toutes les rubriques'),
        categories: fields.object(
          {
            atelier: txt('À l’atelier'),
            'savoir-faire': txt('Matières et savoir-faire'),
            conseils: txt('Conseils'),
            presse: txt('Presse et événements'),
          },
          { label: 'Libellés des rubriques' }
        ),
        vide: para('Texte affiché tant qu’aucun article n’est publié'),
        lire: txt('Lien : Lire l’article'),
        externe: txt('Lien : Lire sur le site du média'),
        piecesTitle: txt('Titre : Pièces citées'),
        autres: txt('Titre : À lire aussi'),
      },
    }),

    // -----------------------------------------------------------------------
    confidentialite: singleton({
      label: 'Politique de confidentialité',
      path: 'content/confidentialite',
      format: { data: 'yaml' },
      schema: legalSchema(),
    }),

    // -----------------------------------------------------------------------
    cgv: singleton({
      label: 'Conditions générales de vente',
      path: 'content/cgv',
      format: { data: 'yaml' },
      schema: legalSchema(),
    }),

    // -----------------------------------------------------------------------
    studio: singleton({
      label: 'Studio cadeaux (configurateur entreprises)',
      path: 'content/studio',
      format: { data: 'yaml' },
      schema: {
        seo: seo(),
        hero: fields.object(
          {
            eyebrow: txt('Surtitre'),
            h1: txt('Titre H1'),
            accroche: para('Accroche'),
            start: txt('Bouton « commencer »'),
          },
          { label: 'Haut de page' }
        ),
        etapes: fields.object(
          {
            piece: txt('Étape 1 : la pièce'),
            cuir: txt('Étape 2 : le cuir'),
            marquage: txt('Étape 3 : le marquage'),
            quantite: txt('Étape 4 : quantité et délai'),
            brief: txt('Étape 5 : envoi du brief'),
            precedent: txt('Bouton « précédent »'),
            suivant: txt('Bouton « suivant »'),
          },
          { label: 'Libellés des étapes' }
        ),
        pieces: fields.array(
          fields.object({
            nom: txt('Nom de la pièce'),
            texte: para('Description courte'),
            forme: fields.select({
              label: 'Silhouette d’aperçu',
              description: 'Dessin utilisé dans l’aperçu interactif.',
              options: [
                { label: 'Porte-clés', value: 'porte-cles' },
                { label: 'Porte-cartes', value: 'porte-cartes' },
                { label: 'Portefeuille', value: 'portefeuille' },
                { label: 'Protège-club de golf', value: 'golf' },
                { label: 'Couverture de vinyle', value: 'vinyle' },
                { label: 'Trousse de voyage', value: 'trousse' },
                { label: 'Étiquette de bagage', value: 'etiquette' },
                { label: 'Sous-main / set de table', value: 'sous-main' },
              ],
              defaultValue: 'porte-cles',
            }),
            prixMin: fields.number({ label: 'Prix unitaire HT bas (€)', description: 'Pour la quantité minimum, marquage à sec inclus.' }),
            prixMax: fields.number({ label: 'Prix unitaire HT haut (€)' }),
            quantiteMin: fields.integer({ label: 'Quantité minimum', defaultValue: 10 }),
            delaiSemaines: fields.integer({ label: 'Délai de fabrication (semaines, à partir du prototype validé)', defaultValue: 4 }),
            photo: photo('Photo (optionnelle, remplace le dessin dans la carte de choix)', 'studio'),
          }),
          { label: 'Pièces proposées', itemLabel: (p) => p.fields.nom.value || 'Pièce' }
        ),
        cuirs: fields.array(
          fields.object({
            nom: txt('Nom du cuir'),
            couleur: txt('Couleur d’aperçu (code hexadécimal, ex. #6b3f26)'),
            texte: txt('Précision (tannage, toucher…)'),
            supplement: fields.number({ label: 'Supplément en % du prix (0 si aucun)', defaultValue: 0 }),
          }),
          { label: 'Cuirs proposés', itemLabel: (p) => p.fields.nom.value || 'Cuir' }
        ),
        fils: fields.array(
          fields.object({ nom: txt('Nom du fil'), couleur: txt('Couleur (code hexadécimal)') }),
          { label: 'Couleurs de fil', itemLabel: (p) => p.fields.nom.value || 'Fil' }
        ),
        marquages: fields.array(
          fields.object({
            nom: txt('Nom du marquage'),
            texte: txt('Précision'),
            rendu: fields.select({
              label: 'Rendu dans l’aperçu',
              options: [
                { label: 'Marquage à sec (ton sur ton)', value: 'sec' },
                { label: 'Dorure or', value: 'or' },
                { label: 'Dorure argent', value: 'argent' },
                { label: 'Rivet gravé', value: 'rivet' },
              ],
              defaultValue: 'sec',
            }),
            supplementUnitaire: fields.number({ label: 'Supplément par pièce HT (€)', defaultValue: 0 }),
            fraisFixes: fields.number({ label: 'Frais fixes HT (€), ex. fabrication du cliché', defaultValue: 0 }),
          }),
          { label: 'Techniques de marquage', itemLabel: (p) => p.fields.nom.value || 'Marquage' }
        ),
        paliers: fields.array(
          fields.object({
            aPartirDe: fields.integer({ label: 'À partir de (pièces)' }),
            remise: fields.number({ label: 'Remise sur le prix unitaire (%)' }),
          }),
          { label: 'Remises par quantité', itemLabel: (p) => `Dès ${p.fields.aPartirDe.value ?? '?'} pièces : −${p.fields.remise.value ?? 0} %` }
        ),
        estimation: fields.object(
          {
            afficher: fields.checkbox({
              label: 'Afficher une estimation chiffrée',
              description: 'Décocher pour masquer tous les prix : seuls le délai et le récapitulatif restent affichés.',
              defaultValue: true,
            }),
            titre: txt('Titre du bloc estimation'),
            unitaire: txt('Libellé prix unitaire'),
            total: txt('Libellé total'),
            fraisFixes: txt('Libellé frais fixes'),
            delai: txt('Libellé délai'),
            semaines: txt('Unité « semaines »'),
            mention: para('Mention sous l’estimation'),
            alerteDelai: para('Alerte si la date souhaitée est trop proche'),
            alerteQuantite: txt('Alerte sous la quantité minimum (« {min} » est remplacé par la quantité)'),
          },
          { label: 'Estimation' }
        ),
        champs: fields.object(
          {
            logo: txt('Libellé import du logo'),
            logoAide: txt('Aide import du logo'),
            initiales: txt('Libellé texte à marquer (si pas de logo)'),
            fil: txt('Libellé couleur de fil'),
            quantite: txt('Libellé quantité'),
            date: txt('Libellé date de remise souhaitée'),
            occasion: txt('Libellé occasion'),
            occasions: fields.array(txt('Occasion'), { label: 'Occasions proposées', itemLabel: (p) => p.value }),
            nom: txt('Nom'),
            societe: txt('Société'),
            email: txt('Email'),
            telephone: txt('Téléphone'),
            message: txt('Message'),
            requis: txt('Mention champ obligatoire'),
            envoyer: txt('Bouton d’envoi'),
            envoi: txt('Texte pendant l’envoi'),
            partager: txt('Bouton « copier le lien de ma composition »'),
            copie: txt('Confirmation lien copié'),
            imprimer: txt('Bouton « imprimer le récapitulatif »'),
          },
          { label: 'Champs et boutons' }
        ),
        recap: fields.object(
          { titre: txt('Titre du récapitulatif'), logoJoint: para('Note sur l’envoi du logo') },
          { label: 'Récapitulatif' }
        ),
        confirmation: para('Message de confirmation'),
        erreur: para('Message d’erreur'),
        messagerie: para('Message quand le brief est envoyé par la messagerie (aucun service de formulaire configuré)'),
        garanties: fields.object(
          {
            titre: txt('Titre'),
            items: fields.array(
              fields.object({ titre: txt('Titre'), texte: para('Texte') }),
              { label: 'Arguments', itemLabel: (p) => p.fields.titre.value || 'Argument' }
            ),
          },
          { label: 'Pourquoi l’atelier (preuves de confiance)' }
        ),
        teaser: fields.object(
          {
            titre: txt('Titre'),
            texte: para('Texte'),
            bouton: txt('Bouton'),
          },
          { label: 'Encart d’invitation (affiché sur les pages entreprises)' }
        ),
        liens: fields.object(
          {
            occasionsTitre: txt('Titre de la section « par occasion »'),
            realisations: txt('Lien vers les réalisations (texte)'),
            realisationsUrl: txt('Lien vers les réalisations (adresse)', '/entreprises/realisations'),
          },
          { label: 'Liens complémentaires' }
        ),
      },
    }),

    // -----------------------------------------------------------------------
    calendrier: singleton({
      label: 'Calendrier des commandes (« commandez avant le… »)',
      path: 'content/calendrier',
      format: { data: 'yaml' },
      schema: {
        afficher: fields.checkbox({ label: 'Afficher le bandeau', defaultValue: true }),
        joursAvant: fields.integer({
          label: 'Afficher le bandeau à partir de combien de jours avant la date limite',
          defaultValue: 60,
        }),
        modele: txt('Phrase du bandeau ({nom}, {date} et {remise} sont remplacés)'),
        compte: txt('Compte à rebours ({n} est remplacé par le nombre de jours)'),
        dernierJour: txt('Texte le jour de la date limite'),
        bouton: txt('Bouton'),
        echeances: fields.array(
          fields.object({
            nom: txt('Nom (ex. Cadeaux de fin d’année)'),
            dateLimite: fields.date({ label: 'Date limite de commande' }),
            remise: txt('Livraison promise (ex. livrés avant le 15 décembre)'),
            lien: txt('Lien du bouton (vide = le studio cadeaux)'),
          }),
          { label: 'Échéances', itemLabel: (p) => `${p.fields.nom.value || 'Échéance'} · ${p.fields.dateLimite.value ?? ''}` }
        ),
      },
    }),

    // -----------------------------------------------------------------------
    echantillons: singleton({
      label: 'Kit d’échantillons',
      path: 'content/echantillons',
      format: { data: 'yaml' },
      schema: {
        seo: seo(),
        hero: fields.object(
          { eyebrow: txt('Surtitre'), h1: txt('Titre H1'), accroche: para('Accroche') },
          { label: 'Haut de page' }
        ),
        contenu: fields.object(
          {
            titre: txt('Titre « ce que contient le kit »'),
            items: fields.array(
              fields.object({ titre: txt('Titre'), texte: txt('Texte') }),
              { label: 'Contenu du kit', itemLabel: (p) => p.fields.titre.value || 'Élément' }
            ),
            photo: photo('Photo du kit', 'echantillons', 'Kit d’échantillons ouvert : nuancier de cuirs et plaque marquée'),
            condition: para('Conditions (gratuité, délai d’envoi…)'),
          },
          { label: 'Le kit' }
        ),
        formulaire: fields.object(
          {
            titre: txt('Titre du formulaire'),
            cuirs: txt('Libellé choix des cuirs'),
            cuirsAide: txt('Aide choix des cuirs ({max} est remplacé)'),
            maxCuirs: fields.integer({ label: 'Nombre maximum de cuirs', defaultValue: 4 }),
            plaque: txt('Case « plaque marquée à notre logo »'),
            plaqueAide: txt('Aide plaque'),
            nom: txt('Nom'),
            societe: txt('Société'),
            fonction: txt('Fonction'),
            email: txt('Email professionnel'),
            telephone: txt('Téléphone'),
            adresse: txt('Adresse de livraison'),
            projet: txt('Projet en quelques mots'),
            requis: txt('Mention champ obligatoire'),
            envoyer: txt('Bouton d’envoi'),
            envoi: txt('Texte pendant l’envoi'),
          },
          { label: 'Formulaire' }
        ),
        confirmation: para('Message de confirmation'),
        messagerie: para('Message quand la demande part par la messagerie'),
        erreur: para('Message d’erreur'),
        teaser: fields.object(
          { titre: txt('Titre'), texte: para('Texte'), bouton: txt('Bouton') },
          { label: 'Encart d’invitation (studio et pages occasion)' }
        ),
      },
    }),

    // -----------------------------------------------------------------------
    legal: singleton({
      label: 'Mentions légales',
      path: 'content/legal',
      format: { data: 'yaml' },
      schema: legalSchema(),
    }),
  },
});
