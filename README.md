# Brunette Paris — site vitrine

Site de **Brunette Paris**, maroquinerie artisanale faite main en Île-de-France.
Astro (site statique) · Keystatic (contenus éditables, stockés dans le dépôt) · GSAP · Three.js · Vercel.

## Démarrer

```bash
npm install
npm run dev        # site sur http://localhost:4321, administration sur http://localhost:4321/keystatic
npm run build      # build de production (sortie Vercel)
```

Node 20 ou plus récent.

## Où sont les choses

| Dossier / fichier | Rôle |
| --- | --- |
| `keystatic.config.ts` | Modèle de données : pièces, offres, références, pages, réglages. |
| `content/` | Tous les textes (YAML), modifiés via Keystatic. |
| `public/images/` | Photos ajoutées depuis Keystatic. |
| `public/models/` | Modèles 3D `.glb` ajoutés depuis Keystatic. |
| `src/styles/tokens.css` | Tokens de design : nuanciers, typographies, espacements. |
| `src/assets/logos/` | Logos principal et secondaire (vectoriels, extraits de la charte). |
| `src/scripts/hotstamp.ts` | Animation signature (marquage à chaud). |
| `src/scripts/viewer3d.ts` | Visionneuse 3D réutilisable. |
| `src/pages/` | Pages (accueil, offres, créations, fiche pièce, atelier, contact, mentions légales, 404). |

Aucun texte n'est écrit en dur dans les composants : tout passe par Keystatic.
Tant qu'une photo n'est pas fournie, un placeholder neutre au bon ratio affiche la description de la photo attendue
(champ « Photo attendue » de chaque photo).

## Ajouter une pièce

1. Ouvrir `/keystatic`, puis **Contenus › Pièces (créations) › Add**.
2. Renseigner le nom (l'adresse de la page est générée automatiquement, ex. `/creations/sac-besace-camille`),
   la catégorie, le cuir, la description, les dimensions, « Pièce unique » ou « Série limitée », la disponibilité.
3. Ajouter les photos : la **1re** est la photo principale, la **2e** apparaît au survol dans la galerie.
4. Optionnel : prix, lien de paiement Stripe (le bouton devient alors « Acquérir cette pièce »), modèle 3D.
5. **Save**. En local, le fichier `content/pieces/<slug>.yaml` est créé ; une fois en ligne, l'enregistrement
   crée un commit et Vercel redéploie automatiquement.

Pour mettre une pièce en avant sur l'accueil : **Pages › Accueil › 5. Pièces en vedette** (4 pièces, la première
est affichée au chargement).

## Remplacer un modèle 3D

La visionneuse est un composant unique : elle charge le fichier `.glb` déclaré sur la pièce.
Tant qu'aucun fichier n'est fourni, elle affiche une forme provisoire (cube, sphère, tore ou capsule, au choix
dans le champ « Forme provisoire 3D »).

1. Exporter le modèle au format **glTF binaire (.glb)**, idéalement < 5 Mo (textures 2K max, compression Draco
   possible côté export si besoin d'aller plus loin — non activée dans le code pour l'instant).
2. Dans Keystatic, ouvrir la pièce, champ **Modèle 3D (fichier .glb)**, déposer le fichier, **Save**.
3. C'est tout : le modèle est automatiquement centré et mis à l'échelle, aucun code à modifier.

Sur la fiche pièce : visionneuse 3D si un modèle existe, sinon galerie photos ; onglets « 3D » / « Photos » si les deux existent.

> La pièce « Sac besace Camille » porte un `.glb` provisoire (`public/models/sac-besace-camille/model3d.glb`,
> forme simple générée par code) pour démontrer ce mécanisme. Le supprimer dans Keystatic pour revenir à la forme provisoire.

## Choisir la serif des titres

Trois options sont prévues dans `src/styles/tokens.css` : **Cormorant Garamond** (active), **Bodoni Moda**,
**Playfair Display**. Commenter / décommenter les imports et la variable `--font-serif`.

## Mise en ligne

1. Créer le dépôt GitHub et pousser le code.
2. Importer le dépôt dans Vercel (framework détecté : Astro). Chaque commit redéploie le site.
3. **Administration en ligne** : dans `keystatic.config.ts`, passer `storage` à
   `{ kind: 'github', repo: 'OWNER/REPO' }` (ou Keystatic Cloud), puis suivre l'assistant sur `/keystatic`
   pour créer l'application GitHub et ajouter les variables d'environnement demandées dans Vercel.
4. Mettre le domaine définitif dans `astro.config.mjs` (`SITE`) pour le sitemap et les balises canoniques.

## TODO connus

- Formulaire de contact : créer un formulaire Formspree (ou une fonction serverless) et coller son adresse
  dans **Réglages globaux › Adresse d'envoi du formulaire**. Sans adresse, le formulaire affiche un message d'erreur.
- Coordonnées définitives (email, téléphone), domaine, mentions légales (éditeur, SIRET, données personnelles).
- Réponses des FAQ (pages d'offre) et valeurs des chiffres clés de l'accueil : à confirmer avec la cliente.
- Page Hôtellerie : le gabarit prévoit 4 à 6 questions, le brief en donne 3.
- Toutes les photos, la vidéo du hero et les vrais modèles 3D.
- Stripe : seuls les champs prix / disponibilité / lien de paiement sont prévus, pas de panier.
