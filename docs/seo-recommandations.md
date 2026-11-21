# Référencement : actions restantes

Le socle technique est dans le code (voir README, section « Référencement (SEO) »). Ce qui suit se fait hors code,
par ordre d'impact pour une artisane locale qui vise les particuliers et les entreprises d'Île-de-France.

## Avant la mise en ligne

1. **Domaine** : choisir la forme définitive (`www.brunette-paris.fr` ou sans `www`), la mettre dans `astro.config.mjs`,
   et rediriger l'autre forme en 301 dans Vercel (Settings › Domains). Tant que ce n'est pas fait : variable
   `SEO_INDEX=false` dans Vercel pour que la production ne soit pas indexée sous une mauvaise adresse.
2. **Photos** : chaque photo ajoutée dans Keystatic doit avoir un texte alternatif qui décrit la photo
   (ex. « Besace Camille en cuir de vache naturel, vue de face »), pas seulement le nom de la pièce.
   Exporter en JPG ou WebP, 2 000 px de large au plus, moins de 400 Ko. Les fiches pièces avec photos deviennent
   éligibles aux résultats enrichis produit (Product).
3. **Réponses des FAQ** : les questions dont la réponse contient encore `TODO` ou `[À CONFIRMER]` ne sont pas déclarées
   à Google. Elles le seront automatiquement une fois rédigées.

## Le jour de la mise en ligne

4. **Google Search Console** : ajouter le domaine (validation DNS chez le registraire, ou code dans Keystatic ›
   Réglages globaux › Référencement), puis soumettre `https://<domaine>/sitemap-index.xml`.
   Faire de même dans **Bing Webmaster Tools** (import possible depuis Search Console).
5. **Tester les données structurées** de l'accueil, d'une offre et d'une fiche pièce avec le
   [test des résultats enrichis](https://search.google.com/test/rich-results).

## Visibilité locale (le plus rentable)

6. **Fiche Google Business Profile** : catégorie principale « Maroquinier » (secondaires possibles : « Atelier
   d'artisanat », « Fournisseur de cadeaux d'entreprise »). Zone desservie plutôt qu'adresse si l'atelier ne reçoit pas
   de public. Lien vers le site, photos de l'atelier et des pièces, publications régulières. Coller le lien public de
   la fiche dans Keystatic › Réglages globaux › Référencement : il est relié au site dans les données structurées.
7. **Avis Google** : demander un avis à chaque client (particulier et entreprise) avec le lien direct de la fiche.
   C'est le premier critère du classement local après la proximité.
8. **Cohérence NAP** (nom, adresse, téléphone) : exactement les mêmes sur le site, la fiche Google, Instagram, Etsy et
   les annuaires. Renseigner l'adresse dans Keystatic seulement si elle est identique partout.

## Liens entrants (netlinking local)

9. **Annuaires et labels artisans** : Chambre de métiers et de l'artisanat (annuaire des artisans), Ateliers d'Art de
   France si éligible, Pages Jaunes, Made in France / « fabriqué en France » (annuaires de marques françaises).
10. **Partenaires B2B** : demander un lien depuis les pages « partenaires » ou « nos artisans » des lieux de séminaire,
    hôtels, golfs et agences événementielles avec qui Armonie travaille (une page de référence par client autorisé).
11. **Presse locale et blogs** : portrait d'artisane (Le Parisien éditions locales, magazines de ville, blogs
    « made in Paris », podcasts artisanat). Un article avec lien vaut plus que dix annuaires.
12. **Etsy et Instagram** : lien vers le site dans la bio et la boutique (déjà relié dans les données structurées).

## Contenu (moyen terme)

13. **Pages par intention de recherche** : les trois pages d'offre couvrent le B2B. À envisager ensuite : une page par
    grande famille (« ceinture en cuir sur mesure Paris », « cadeau d'entreprise en cuir », « atelier cuir team
    building »), chacune avec un vrai texte, des photos et des liens vers les pièces liées.
14. **Journal de l'atelier** : 1 article par mois (entretien du cuir, choix d'un cuir, coulisses d'une commande B2B).
    Alimente la longue traîne et les liens internes vers les pièces et les offres.
15. **Boutique en ligne (Stripe)** : au lancement, garder une URL stable par pièce (`/creations/<slug>`), conserver les
    pièces vendues en ligne avec la mention « Vendue » (pas de 404), et compléter prix et disponibilité dans Keystatic :
    ils alimentent déjà les données Product / Offer.

## Performance (Core Web Vitals)

16. **Logos SVG** : les deux logos font 59 à 79 Ko et sont intégrés dans chaque page. Les passer dans SVGO
    (ou réduire la précision des tracés) allégerait chaque page d'environ 100 Ko.
17. **Optimisation des photos** : les photos de Keystatic sont servies telles quelles depuis `public/`. Pour du
    WebP/AVIF et des tailles adaptées à l'écran, activer l'optimisation d'images de Vercel (`imageService` de
    `@astrojs/vercel`) ou déplacer les photos dans `src/assets/` une fois le flux photo stabilisé.
18. **Mesurer** : PageSpeed Insights sur l'accueil et une fiche pièce après l'ajout des vraies photos et de la vidéo
    du hero (viser LCP < 2,5 s sur mobile ; la vidéo doit avoir une image `poster` légère).
