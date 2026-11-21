# Intégration des PR #1 à #6 (21/11/2026)

Branche `claude/project-thread-i75ldh`, ouverte en PR brouillon. Elle sert à voir le résultat combiné et à valider l'ordre de fusion : la branche d'intégration elle-même ne fusionne rien dans `main`.

**Mise à jour du 21/11/2026, 19 h 00 (UTC)** : la PR #2 (structure) est fusionnée dans `main`. La branche d'intégration a été remise à jour sur le nouveau `main`, sans conflit, et le build passe toujours.

## Ordre de fusion recommandé

| Ordre restant | PR | Pourquoi à ce rang | Conflits rencontrés |
| --- | --- | --- | --- |
| 1 | #1 Copywriting | Ne touche que `content/*.yaml` : la base de texte des autres. Se fusionne sans conflit sur `main` (#2 incluse), `legal.yaml` et `settings.yaml` étant modifiés sur des lignes différentes. | aucun |
| ✅ | #2 Structure | **Fusionnée dans `main` le 21/11.** Crée `routes.ts`, l'en-tête, le pied de page et les nouvelles pages dont les autres dépendent. | aucun |
| 2 | #3 UI et DA | Styles et composants, pages modifiées d'une ligne. | aucun |
| 3 | #4 Studio cadeaux | Nouvelle page, nouveau singleton. | `keystatic.config.ts` |
| 4 | #6 Leviers B2B | Construite sur #4 : se recible sur `main` dès que #4 est fusionnée. | `keystatic.config.ts` |
| 5 | #5 SEO | En dernier : son `Base.astro` accepte l'ancien appel (`title`/`description`), donc toutes les pages fonctionnent, puis le commit d'intégration branche les nouvelles pages sur le bloc SEO complet. | `Photo.astro`, `entreprises/[slug].astro`, `mentions-legales.astro` |

Contrôle sur le nouveau `main` : #1 et #3 se fusionnent proprement ; GitHub signale déjà un conflit sur #4 (`keystatic.config.ts`) et #5 (`mentions-legales.astro`), ceux décrits ci-dessous.

Si Clément fusionne les PR une par une sur GitHub dans cet ordre, il retrouvera les mêmes conflits. Les résolutions ci-dessous s'appliquent telles quelles.

## Conflits résolus

1. **`keystatic.config.ts` (#4 sur #1+#2+#3)** : la navigation Keystatic de #2 (« Pages principales », « Pages ressources », « Pages légales ») est gardée, avec un nouveau groupe « Entreprises · acquisition » pour le singleton `studio`. Le singleton `studio` est ajouté tel quel à côté des singletons de #2.
2. **`keystatic.config.ts` (#6)** : la collection `occasions` et les singletons `calendrier` et `echantillons` sont ajoutés tels quels. Navigation : `echantillons` et `occasions` dans « Entreprises · acquisition », `calendrier` dans « Réglages ».
3. **`src/components/ui/Photo.astro` (#5 sur #3)** : le placeholder « échantillon de cuir » de #3 est gardé, avec le calcul `width`/`height` de #5 (anti-CLS). Le libellé de repli « Photo à fournir » de #5 est retiré, car #3 affiche déjà « Photo à venir ».
4. **`src/pages/entreprises/[slug].astro` (#5 sur #4)** : les deux imports sont gardés (`StudioTeaser` et les helpers SEO).
5. **`src/pages/mentions-legales.astro` (#5 sur #2)** : la version de #2 (composant `LegalPage`) est gardée ; le passage du bloc SEO complet est fait dans `LegalPage.astro`.

## Corrections d'intégration (commit dédié)

- **Menu** : « Studio cadeaux » et « Kit d'échantillons » ajoutés au menu Entreprises et au pied de page (`routes.ts`, libellés dans Réglages globaux › Navigation). Ni #2, ni #4, ni #6 ne les ajoutaient, chacune renvoyant aux autres.
- **BreadcrumbList en double** sur 6 pages : #2 l'ajoutait dans `jsonLd`, et le composant `Breadcrumb` de #5 le génère déjà. La version de #2 (`breadcrumbJsonLd`) est supprimée.
- **FAQ dans Google** : `faqJsonLd` (#2) et les pages occasion (#6) déclaraient aussi les réponses « TODO ». Elles sont maintenant filtrées comme dans les offres (#5).
- **Bloc Référencement** : les pages de #2, #4 et #6 passaient seulement `title` et `description` ; elles passent maintenant tout le bloc (`seo={…}`), donc l'image de partage et la case noindex de #5 fonctionnent partout.
- **Fiches pièces** : les marqueurs `[À CONFIRMER]` sont retirés de la meta description et du JSON-LD `Product` (ils restent visibles sur la page).

## Vérifications

- `npm run build` : OK, 34 pages. Build supplémentaire avec la réalisation et l'article d'exemple publiés : OK.
- Liens internes de tout le HTML généré : 0 lien cassé.
- Chromium en 1440 px et 390 px sur 16 pages clés (accueil, entreprises, studio, échantillons, une occasion, une offre, créations, une fiche, sur-mesure, atelier, contact, FAQ, entretien, journal, mentions, CGV) : toutes en 200, sans défilement horizontal ni erreur console.
- JSON-LD : un seul BreadcrumbList par page, aucun TODO ni [À CONFIRMER].

## Incohérences entre PR à trancher (non corrigées ici)

1. **Police hors charte** : la charte ne donne que Josefin Sans. Les titres utilisent Cormorant Garamond. Ce choix vient du socle initial (`main`) et #3 le conserve. Décision de DA à prendre avec Armonie (alternatives commentées dans `tokens.css`).
2. **Deux « Sur-mesure »** : `/sur-mesure` (particuliers, #2) et `/entreprises/sur-mesure` (offre « Sur-mesure pour les marques »). #2 recommande de renommer le slug de l'offre en `marques-et-cadeaux`. Non fait ici, car ça change une URL et le fichier d'offre réécrit par #1 : à faire dans une petite PR après fusion, avec une redirection.
3. **Quantités minimum et délais à 4 endroits** : studio (10 à 20 pièces, 3 à 6 semaines), FAQ `/entreprises` (TODO « dès 10 pièces »), FAQ des offres ([À CONFIRMER]), FAQ des occasions (TODO). Une seule source de vérité à valider (voir `VISITE-CLIENT.md`, section B).
4. **Paris ou Île-de-France** : le H1 et le title de l'accueil disent « à Paris », le manifeste, les meta descriptions et les réglages disent « Île-de-France ».
5. **Échéance très proche** : le calendrier (#6) affiche « commandez avant le 28 novembre 2026 ». À valider avant toute mise en ligne.
6. **FAQ en double** : la FAQ générale (`/faq`, #2) laisse en TODO l'origine des peaux, déjà traitée (avec [À CONFIRMER]) dans le récit de l'atelier (#1). À aligner une fois validé.
7. Pas de texte réécrit deux fois : #1 ne touche que les fichiers existants, et les nouvelles pages ont leur propre texte (#2, #4, #6). Seuls `legal.yaml` et `settings.yaml` sont modifiés par #1 et #2, sur des lignes différentes.
