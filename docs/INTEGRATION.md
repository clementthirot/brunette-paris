# Intégration des PR #1 à #6 : bilan (21/11/2026)

## État de `main`

Fusionnées dans cet ordre : #2, #3, #1, #4, #5. La #6 (leviers B2B) a été fusionnée dans la branche du studio, pas dans `main` : la PR #8 l'apporte sur `main` et répare la config Keystatic (les pages de #2 avaient disparu lors de la résolution du conflit de #4).

## Ce qui manquait encore après #8 (corrigé dans la PR qui suit #8)

Vérifié en construisant `main` + #8 :

1. **Build en échec** : `src/pages/entreprises/[slug].astro` utilise `<StudioTeaser />` sans l'importer (l'import de #4 a été perdu au conflit avec #5). Les 3 pages d'offres plantent.
2. **Mentions légales** : la fusion de #5 a remis l'ancienne page (balisage en dur avec `Base`) au lieu du composant `LegalPage` de #2.
3. **Fil d'Ariane déclaré deux fois à Google** sur 6 pages : #2 l'ajoute dans `jsonLd`, et le composant `Breadcrumb` de #5 le génère déjà. La version de #2 (`breadcrumbJsonLd`) est supprimée.
4. **FAQ « TODO » envoyées à Google** : `faqJsonLd` (#2) et les pages occasion (#6) les déclaraient. Elles sont filtrées comme dans les offres (#5), via `isAnswerReady`.
5. **Bloc Référencement incomplet** sur les pages de #2, #4 et #6 : elles passaient seulement `title`/`description`. Elles passent maintenant `seo={…}` (image de partage et case noindex de #5).
6. **Fiches pièces** : les marqueurs `[À CONFIRMER]` sortaient dans la meta description et le JSON-LD `Product`. Ils sont retirés (ils restent visibles sur la page).
7. **Menu** : « Studio cadeaux » et « Kit d'échantillons » ajoutés au menu Entreprises et au pied de page (`routes.ts`, libellés dans Réglages globaux › Navigation). Aucune PR ne le faisait.
8. **Placeholder photo** : le libellé de repli « Photo à fournir » de #5 doublonnait le « Photo à venir » de #3. Retiré.

La navigation Keystatic choisie par #8 (« Entreprises : outils ») est gardée.

## Vérifications (main + #8 + ces corrections)

- `npm run build` OK.
- 0 lien interne cassé, un seul BreadcrumbList par page, aucun TODO ni [À CONFIRMER] dans le JSON-LD.
- Chromium en 1440 px et 390 px sur 16 pages clés : toutes en 200, sans défilement horizontal ni erreur console.

## Incohérences à trancher (non corrigées)

1. **Police hors charte** : la charte ne donne que Josefin Sans ; les titres utilisent Cormorant Garamond (socle initial, conservé par #3). Alternatives commentées dans `tokens.css`.
2. **Deux « Sur-mesure »** : `/sur-mesure` (particuliers) et `/entreprises/sur-mesure` (offre marques). Renommer le slug de l'offre en `marques-et-cadeaux`, avec une redirection.
3. **Quantités minimum et délais à 4 endroits** : studio, FAQ `/entreprises`, FAQ des offres, FAQ des occasions. Voir `VISITE-CLIENT.md`, section B.
4. **Paris ou Île-de-France** : le H1 et le title de l'accueil disent « à Paris », le manifeste, les meta descriptions et les réglages « Île-de-France ».
5. **Échéance du calendrier** au 28 novembre 2026, à valider avant la mise en ligne.
6. **FAQ générale** : l'origine des peaux y est en TODO, alors qu'elle est traitée (avec [À CONFIRMER]) dans le récit de l'atelier.
