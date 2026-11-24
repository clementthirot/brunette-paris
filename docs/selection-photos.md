# Sélection des photos du site

Généré le 24/11/2026 à partir des planches de `_sources/planches/` (172 photos, `index.csv` fait foi).
Les originaux sont copiés dans `src/assets/images/<rubrique>/` et référencés dans `content/` (champ `image` des photos Keystatic).
Astro les optimise au build (WebP, plusieurs largeurs). Le cadrage éventuel est dans le champ `position` de la photo (Keystatic › Cadrage).

Copie versionnée : `docs/selection-photos.md` (même contenu que `_sources/selection.md`, à garder synchronisée).

Pour un retour du type « dans le hero, remplace la 27 par la 112 » : retrouver la ligne ci-dessous, copier `_sources/photos/brunette-112.jpg` à la place du fichier indiqué (ou sous un nouveau nom et mettre à jour le champ `image` du fichier de contenu), ajuster `alt` et `position`, puis mettre ce tableau à jour.

## Emplacements remplis (52 photos, aucune en double)

| Page | Emplacement | N° | Fichier | Contenu (champ) | Cadrage | Pourquoi |
|---|---|---|---|---|---|---|
| Accueil | Hero plein écran (fond sombre) | 45 | `src/assets/images/accueil/hero-etabli-atelier.jpg` | `content/home.yaml` › `hero.photo` | 50% 60% | Vue d’ensemble de l’établi, riche et calme : elle installe l’atelier sans concurrencer le logo et le titre centrés. |
| Accueil | Double entrée, carte Entreprises (4:3) | 39 | `src/assets/images/accueil/entree-entreprises-serie-porte-cartes.jpg` | `content/home.yaml` › `entree.entreprises.photo` | centré | Une série identique de porte-cartes dit « production pour une marque » mieux qu’une pièce seule ; aucune photo d’événement dans le lot. |
| Accueil | Double entrée, carte Particuliers (4:5) | 53 | `src/assets/images/accueil/entree-particuliers-sac-fauve.jpg` | `content/home.yaml` › `entree.particuliers.photo` | centré | Sac fini emblématique, net et lumineux, cadrage vertical naturel. |
| Accueil | Savoir-faire, étape 1 Sélection (4:5) | 13 | `src/assets/images/accueil/etape-1-peau-de-cuir.jpg` | `content/home.yaml` › `savoirFaire.etapes[0].photo` | centré | Peau entière en lumière rasante : la matière avant toute coupe. |
| Accueil | Savoir-faire, étape 2 Découpe (4:5) | 63 | `src/assets/images/accueil/etape-2-decoupe.jpg` | `content/home.yaml` › `savoirFaire.etapes[1].photo` | centré | Panneaux fraîchement découpés et maillet sur le tapis : l’étape de coupe en une image. |
| Accueil | Savoir-faire, étape 3 Couture (4:5) | 85 | `src/assets/images/accueil/etape-3-couture-sellier.jpg` | `content/home.yaml` › `savoirFaire.etapes[2].photo` | centré | Les deux mains, l’aiguille et le fil : la couture sellier la plus lisible du lot. |
| Accueil | Savoir-faire, étape 4 Marquage (4:5) | 103 | `src/assets/images/accueil/etape-4-marquage-dore.jpg` | `content/home.yaml` › `savoirFaire.etapes[3].photo` | 40% 50% | Le logo doré de la marque bien visible ; cadrage décalé pour garder le marquage dans le format vertical. |
| L’atelier | Hero plein cadre | 88 | `src/assets/images/atelier/hero-armonie-etabli.jpg` | `content/atelier.yaml` › `hero.photo` | 15% 35% | Armonie à l’établi, lumière de fenêtre, toute la pièce visible ; cadrage à gauche pour la garder dans le champ sur mobile. |
| L’atelier | Matières, cuir de vache (4:5) | 58 | `src/assets/images/atelier/matiere-cuir-vache-graine.jpg` | `content/atelier.yaml` › `matieres.items[0].photo` | centré | Grain pleine fleur net et lumineux, couleur proche du céladon de la charte. |
| L’atelier | Matières, python (4:5) | 119 | `src/assets/images/atelier/matiere-python.jpg` | `content/atelier.yaml` › `matieres.items[1].photo` | centré | Macro d’écailles en lumière rasante, exactement le visuel attendu. |
| L’atelier | Matières, crocodile (4:5) | 102 | `src/assets/images/atelier/matiere-crocodile.jpg` | `content/atelier.yaml` › `matieres.items[2].photo` | centré | Seule texture crocodile nette en haute définition ; bleu proche de la couleur reine. |
| L’atelier | Finitions, dorure sur cuir noir (1:1) | 61 | `src/assets/images/atelier/finition-dorure-cuir-noir.jpg` | `content/atelier.yaml` › `finitions.items[1].photo` | 30% 50% | Dorure sur cuir noir saffiano : correspond mot pour mot à la finition décrite. |
| L’atelier | Finitions, marquage sur cuir naturel (1:1) | 122 | `src/assets/images/atelier/finition-marquage-cuir-naturel.jpg` | `content/atelier.yaml` › `finitions.items[2].photo` | centré | Le nom Brunette embossé dans un cuir naturel, gros plan net. |
| L’atelier | Galerie, image 1 (4:5) | 106 | `src/assets/images/atelier/galerie-outils-mur.jpg` | `content/atelier.yaml` › `galerie.photos[0]` | centré | Le mur d’outils de l’atelier, ambiance douce. |
| L’atelier | Galerie, image 2 (1:1) | 76 | `src/assets/images/atelier/galerie-etabli-sac-en-cours.jpg` | `content/atelier.yaml` › `galerie.photos[1]` | centré | Vue d’établi avec une pièce en cours : le quotidien de l’atelier. |
| L’atelier | Galerie, image 3 (1:1) | 2 | `src/assets/images/atelier/galerie-mains-assemblage.jpg` | `content/atelier.yaml` › `galerie.photos[2]` | centré | Mains au travail, photo la mieux définie du lot (4000 px). |
| L’atelier | Galerie, image 4 (4:5) | 51 | `src/assets/images/atelier/galerie-cuir-decoupe-portefeuille.jpg` | `content/atelier.yaml` › `galerie.photos[3]` | centré | Matière brute découpée, tons chauds qui répondent au sable de la charte. |
| L’atelier | Galerie, image 5 (1:1) | 113 | `src/assets/images/atelier/galerie-alene-lanieres.jpg` | `content/atelier.yaml` › `galerie.photos[4]` | centré | Outil et matière en gros plan ; remplace le fil de lin attendu (seules photos de fil en basse définition). |
| L’atelier | Galerie, image 6 (1:1) | 132 | `src/assets/images/atelier/galerie-armonie-machine.jpg` | `content/atelier.yaml` › `galerie.photos[5]` | centré | Second portrait d’Armonie au travail, différent du hero ; pas de photo de fer à marquer exploitable. |
| Entretien | Hero plein cadre | 40 | `src/assets/images/entretien/hero-cuir-patine.jpg` | `content/entretien.yaml` › `hero.photo` | centré | Cuir patiné en lumière chaude : évoque le soin et la durée ; aucune photo d’application de crème dans le lot. |
| Entretien | Cuirs, vache (4:3) | 54 | `src/assets/images/entretien/cuir-vache-naturel.jpg` | `content/entretien.yaml` › `cuirs.items[0].photo` | centré | Cuir naturel qui se patine, distinct de la photo de l’atelier. |
| Entretien | Cuirs, python (4:3) | 89 | `src/assets/images/entretien/cuir-python.jpg` | `content/entretien.yaml` › `cuirs.items[1].photo` | centré | Écailles python bien visibles, différent de l’atelier pour éviter le doublon. |
| Entretien | Cuirs, crocodile (4:3) | 107 | `src/assets/images/entretien/cuir-crocodile.jpg` | `content/entretien.yaml` › `cuirs.items[2].photo` | centré | Grain crocodile en format paysage, idéal pour le 4:3. |
| Entretien | Réparation (4:5) | 70 | `src/assets/images/entretien/reparation-finition-tranches.jpg` | `content/entretien.yaml` › `reparation.photo` | centré | Geste de soin à la main ; les photos de couture en reprise sont en trop basse définition. |
| Sur-mesure | Hero plein cadre | 87 | `src/assets/images/sur-mesure/hero-pieces-decoupees.jpg` | `content/sur-mesure.yaml` › `hero.photo` | centré | Projet en cours, couleurs fortes : le sur-mesure avant assemblage ; aucune photo avec une cliente. |
| Sur-mesure | Intro (3:4) | 19 | `src/assets/images/sur-mesure/intro-gabarit.jpg` | `content/sur-mesure.yaml` › `intro.photo` | centré | Gabarit papier et pièces découpées : le point de départ d’un modèle unique. |
| Sur-mesure | Projets, sac en cours (1:1) | 71 | `src/assets/images/sur-mesure/projet-sac-assemblage.jpg` | `content/sur-mesure.yaml` › `projets.items[0].photo` | centré | Sac en cours d’assemblage avec alêne, correspond exactement. |
| Sur-mesure | Projets, variantes de couleurs (1:1) | 172 | `src/assets/images/sur-mesure/projet-variantes-cuirs.jpg` | `content/sur-mesure.yaml` › `projets.items[1].photo` | centré | Un même modèle décliné en plusieurs cuirs : l’idée du choix des couleurs. |
| Sur-mesure | Projets, personnalisation (1:1) | 141 | `src/assets/images/sur-mesure/projet-personnalisation-prenom.jpg` | `content/sur-mesure.yaml` › `projets.items[2].photo` | centré | Personnalisation au prénom, réelle et parlante ; pas de macro d’initiales dorées dans le lot. |
| Sur-mesure | Projets, objet de passion (1:1) | 14 | `src/assets/images/sur-mesure/projet-objet-cuir.jpg` | `content/sur-mesure.yaml` › `projets.items[3].photo` | centré | Objet hors du commun en cuir : montre ce que le sur-mesure permet. |
| Entreprises | Hero plein cadre | 20 | `src/assets/images/entreprises/hero-porte-cles-logo.jpg` | `content/entreprises.yaml` › `hero.photo` | centré | Pièces marquées au logo d’un établissement : le cœur de l’offre B2B. |
| Entreprises › Marques | Carte de l’offre (3:4) | 29 | `src/assets/images/offres/marques-carte-porte-cartes-marque.jpg` | `content/offres/sur-mesure.yaml` › `card.photo` | centré | Pièce marquée sur fond neutre, format vertical d’origine. |
| Entreprises › Marques | Hero plein cadre | 109 | `src/assets/images/offres/marques-hero-prototypes.jpg` | `content/offres/sur-mesure.yaml` › `hero.photo` | centré | Prototype sur le tapis de coupe, format paysage. |
| Entreprises › Marques | Intro (3:4) | 50 | `src/assets/images/offres/marques-intro-logo-marque.jpg` | `content/offres/sur-mesure.yaml` › `intro.photo` | 65% 50% | Marquage d’un blason sur une pièce tenue en main ; cadrage décalé vers le marquage. |
| Entreprises › Marques | Point clé, cadeaux d’entreprise (1:1) | 126 | `src/assets/images/offres/marques-coffret-cadeaux.jpg` | `content/offres/sur-mesure.yaml` › `pointsCles.items[0].photo` | centré | Plusieurs pièces présentées comme un ensemble cadeau. |
| Entreprises › Marques | Point clé, marquage de logo (1:1) | 24 | `src/assets/images/offres/marques-logo-marque.jpg` | `content/offres/sur-mesure.yaml` › `pointsCles.items[4].photo` | centré | Des dizaines de pastilles marquées : le marquage en série. |
| Entreprises › Marques | Galerie, image 1 | 90 | `src/assets/images/offres/marques-galerie-prototype.jpg` | `content/offres/sur-mesure.yaml` › `galerie.photos[0]` | centré | Prototype et pièces sur l’établi. |
| Entreprises › Marques | Galerie, image 3 | 135 | `src/assets/images/offres/marques-galerie-serie.jpg` | `content/offres/sur-mesure.yaml` › `galerie.photos[2]` | centré | Pièces découpées en nombre : la série limitée. |
| Entreprises › Événements | Carte de l’offre (3:4) | 59 | `src/assets/images/offres/evenements-carte-ceintures.jpg` | `content/offres/evenements-seminaires.yaml` › `card.photo` | centré | Trois ceintures côte à côte : le bar à ceintures en une image. |
| Entreprises › Événements | Point clé, bar à ceintures (1:1) | 98 | `src/assets/images/offres/evenements-bar-ceintures.jpg` | `content/offres/evenements-seminaires.yaml` › `pointsCles.items[0].photo` | centré | Ceinture et boucle, net, distinct de la carte. |
| Entreprises › Événements | Point clé, porte-clés (1:1) | 56 | `src/assets/images/offres/evenements-porte-cles.jpg` | `content/offres/evenements-seminaires.yaml` › `pointsCles.items[1].photo` | centré | Porte-clés cousus main en gros plan. |
| Entreprises › Événements | Point clé, marquage d’initiales (1:1) | 21 | `src/assets/images/offres/evenements-marquage.jpg` | `content/offres/evenements-seminaires.yaml` › `pointsCles.items[3].photo` | centré | Seul marquage de lettres et chiffres du lot (définition moyenne, 540 px). |
| Entreprises › Événements | Galerie, image 2 | 84 | `src/assets/images/offres/evenements-galerie-boucle.jpg` | `content/offres/evenements-seminaires.yaml` › `galerie.photos[1]` | centré | Gros plan boucle de ceinture. |
| Entreprises › Événements | Galerie, image 4 | 41 | `src/assets/images/offres/evenements-galerie-ceinture.jpg` | `content/offres/evenements-seminaires.yaml` › `galerie.photos[3]` | centré | Ceinture terminée, boucle laiton. |
| Entreprises › Événements | Galerie, image 7 | 124 | `src/assets/images/offres/evenements-galerie-porte-cles.jpg` | `content/offres/evenements-seminaires.yaml` › `galerie.photos[6]` | centré | Série de porte-clés : le cadeau d’événement par excellence. |
| Cadeaux › Clients et partenaires | Hero | 171 | `src/assets/images/occasions/clients-partenaires-portefeuille.jpg` | `content/occasions/clients-partenaires.yaml` › `hero.photo` | centré | Portefeuille élégant, le cadeau client type. |
| Cadeaux › Fin d’année | Hero | 164 | `src/assets/images/occasions/fin-d-annee-sapin.jpg` | `content/occasions/fin-d-annee.yaml` › `hero.photo` | centré | Pièces au pied du sapin : la fin d’année sans ambiguïté. |
| Entreprises › Kit d’échantillons | Contenu du kit (4:3) | 33 | `src/assets/images/echantillons/kit-nuancier.jpg` | `content/echantillons.yaml` › `contenu.photo` | centré | Le plus proche d’un nuancier : cuirs et tissus variés côte à côte. |
| Studio cadeaux | Pièce porte-clés (1:1) | 139 | `src/assets/images/studio/porte-cles.jpg` | `content/studio.yaml` › `pieces[0].photo` | centré | Porte-clés sur fond neutre, comme demandé. |
| Studio cadeaux | Pièce porte-cartes (1:1) | 4 | `src/assets/images/studio/porte-cartes.jpg` | `content/studio.yaml` › `pieces[1].photo` | centré | Porte-cartes sur fond clair, format carré d’origine. |
| Studio cadeaux | Pièce portefeuille (1:1) | 32 | `src/assets/images/studio/portefeuille.jpg` | `content/studio.yaml` › `pieces[3].photo` | centré | Portefeuille seul, lisible en vignette. |
| Studio cadeaux | Pièce trousse (1:1) | 123 | `src/assets/images/studio/trousse.jpg` | `content/studio.yaml` › `pieces[5].photo` | centré | Pochette sobre, la plus proche d’une trousse. |

## Emplacements laissés en « Photo à venir » (66)

Aucune photo du lot ne correspond honnêtement à ces sujets. Plutôt que d’y mettre une image trompeuse, ils gardent l’échantillon de cuir avec la légende de la photo attendue.

- **Fiches des 9 pièces** (`content/pieces/`, donc aussi la vitrine de l’accueil et la page Créations) : ce sont des produits nommés (Ceinture Héritage, Besace Camille…). Il faut savoir quelle photo montre quelle pièce, ou renommer les pièces d’après les vraies photos.
- **Hôtellerie, restauration et golf** (offre, occasion golf, protège-club du studio) : aucune photo de table dressée, de protège-menu ni de golf.
- **Séminaires et événements** : aucune photo d’atelier en événement avec des invités (hero, intro, galerie, occasion séminaire, étiquettes de bagage).
- **Protège-caméra, couverture de vinyle, sous-main** : pas dans le lot.
- **Exemples** (réalisation golf, article du journal, collaboration Metal Nature, page Collaborations) : contenus d’exemple ou liés à un partenaire précis.
- **Rivet gravé** (atelier, finitions) : aucun gros plan de rivet.

Liste complète :

- content/articles/exemple-couture-sellier.yaml :: cover — Paysage, mains réalisant une couture sellier à la pince
- content/articles/exemple-couture-sellier.yaml :: sections[0].photo — 
- content/articles/exemple-couture-sellier.yaml :: sections[1].photo — Pince de sellier et alênes posées sur l’établi
- content/atelier.yaml :: finitions.items[0].photo — Macro rivet laiton gravé du logo secondaire
- content/collaborations/metal-nature.yaml :: cover — Le sac de la collaboration, cuir et métal réunis, sur fond sombre
- content/collaborations/metal-nature.yaml :: chapitres[0].photo — Macro de la jonction entre le cuir et l’élément en métal
- content/collaborations/metal-nature.yaml :: chapitres[1].photo — Croquis, gabarits en carton et éléments en métal posés sur l’établi
- content/collaborations/metal-nature.yaml :: galerie[1] — Armonie au travail sur le sac de la collaboration
- content/collaborations/metal-nature.yaml :: galerie[2] — Cuir et métal côte à côte, avant l’assemblage
- content/collaborations-page.yaml :: hero.photo — Mains de deux artisans sur le même établi, cuir et métal côte à côte
- content/occasions/golf.yaml :: hero.photo — Protège-club en cuir marqué d’un logo, sur un sac de golf au bord du green
- content/occasions/seminaire.yaml :: hero.photo — Table de séminaire dressée, étiquettes de bagage en cuir marquées au logo devant chaque place
- content/offres/evenements-seminaires.yaml :: hero.photo — Plein cadre, invités autour de l’atelier nomade pendant une soirée d’entreprise
- content/offres/evenements-seminaires.yaml :: intro.photo — Vertical, artisane gravant des initiales au poste de marquage
- content/offres/evenements-seminaires.yaml :: pointsCles.items[2].photo — Carré, étiquettes de bagage en cuir avec sangles
- content/offres/evenements-seminaires.yaml :: pointsCles.items[4].photo — Carré, participants apprenant la couture main
- content/offres/evenements-seminaires.yaml :: galerie.photos[0] — Atelier nomade en soirée d’entreprise
- content/offres/evenements-seminaires.yaml :: galerie.photos[2] — Invitée gravant ses initiales
- content/offres/evenements-seminaires.yaml :: galerie.photos[4] — Stand atelier en salon professionnel
- content/offres/evenements-seminaires.yaml :: galerie.photos[5] — Mains et outils sur l’établi nomade
- content/offres/hotellerie-restauration-golf.yaml :: card.photo — Protège-menu en cuir sur table de restaurant dressée (vertical)
- content/offres/hotellerie-restauration-golf.yaml :: hero.photo — Plein cadre, table de restaurant gastronomique avec protège-menu en cuir
- content/offres/hotellerie-restauration-golf.yaml :: intro.photo — Vertical, porte-addition en cuir tenu en main par un serveur
- content/offres/hotellerie-restauration-golf.yaml :: pointsCles.items[0].photo — Carré, protège-menus en cuir empilés
- content/offres/hotellerie-restauration-golf.yaml :: pointsCles.items[1].photo — Carré, porte-addition en cuir ouvert
- content/offres/hotellerie-restauration-golf.yaml :: pointsCles.items[2].photo — Carré, protège-clubs en cuir sur un sac de golf
- content/offres/hotellerie-restauration-golf.yaml :: pointsCles.items[3].photo — Carré, étui de carte de score en cuir sur le green
- content/offres/hotellerie-restauration-golf.yaml :: galerie.photos[0] — Table dressée avec protège-menu
- content/offres/hotellerie-restauration-golf.yaml :: galerie.photos[1] — Porte-addition posé sur nappe blanche
- content/offres/hotellerie-restauration-golf.yaml :: galerie.photos[2] — Protège-clubs en cuir alignés
- content/offres/hotellerie-restauration-golf.yaml :: galerie.photos[3] — Étui golf posé sur le green
- content/offres/hotellerie-restauration-golf.yaml :: galerie.photos[4] — Macro nom d’établissement gravé à chaud
- content/offres/hotellerie-restauration-golf.yaml :: galerie.photos[5] — Pochette en cuir pour clé d’hôtel
- content/offres/sur-mesure.yaml :: pointsCles.items[1].photo — Carré, protège-caméra en cuir pour maison de luxe
- content/offres/sur-mesure.yaml :: pointsCles.items[2].photo — Carré, couverture de vinyle en cuir marquée à chaud
- content/offres/sur-mesure.yaml :: pointsCles.items[3].photo — Carré, accessoires de voyage en cuir
- content/offres/sur-mesure.yaml :: galerie.photos[1] — Macro logo en dorure à chaud
- content/offres/sur-mesure.yaml :: galerie.photos[3] — Protège-caméra en situation
- content/offres/sur-mesure.yaml :: galerie.photos[4] — Couverture de vinyle en cuir
- content/offres/sur-mesure.yaml :: galerie.photos[5] — Pièces emballées prêtes à la livraison
- content/pieces/ceinture-heritage.yaml :: photos[0] — Ceinture Héritage enroulée, boucle laiton (4:5)
- content/pieces/ceinture-heritage.yaml :: photos[1] — Gros plan boucle laiton et passant cousu main
- content/pieces/ceinture-riviera.yaml :: photos[0] — Ceinture Riviera en python, enroulée (4:5)
- content/pieces/ceinture-riviera.yaml :: photos[1] — Gros plan écailles et boucle
- content/pieces/couverture-vinyle-nocturne.yaml :: photos[0] — Couverture vinyle Nocturne, dorure à chaud (4:5)
- content/pieces/couverture-vinyle-nocturne.yaml :: photos[1] — Disque glissé dans la couverture en cuir
- content/pieces/etui-golf-albatros.yaml :: photos[0] — Étui de carte de score Albatros, posé sur le green (4:5)
- content/pieces/etui-golf-albatros.yaml :: photos[1] — Détail du marquage à chaud sur l’étui
- content/pieces/pochette-soiree-python.yaml :: photos[0] — Pochette Ondine en python, fond sombre (4:5)
- content/pieces/pochette-soiree-python.yaml :: photos[1] — Gros plan écailles du python à la lumière rasante
- content/pieces/porte-cles-pivoine.yaml :: photos[0] — Porte-clés Pivoine, anneau laiton (4:5)
- content/pieces/porte-cles-pivoine.yaml :: photos[1] — Porte-clés Pivoine tenu en main
- content/pieces/portefeuille-crocodile.yaml :: photos[0] — Portefeuille Saint-Germain en crocodile, fermé (4:5)
- content/pieces/portefeuille-crocodile.yaml :: photos[1] — Portefeuille ouvert, détail des poches cousues main
- content/pieces/protege-club-birdie.yaml :: photos[0] — Protège-club Birdie sur un driver (4:5)
- content/pieces/protege-club-birdie.yaml :: photos[1] — Détail de la couture main et du marquage
- content/pieces/sac-besace-camille.yaml :: photos[0] — Besace Camille, cuir de vache naturel, face, fond neutre (4:5)
- content/pieces/sac-besace-camille.yaml :: photos[1] — Gros plan couture sellier et fermoir de la besace
- content/realisations/exemple-coffrets-golf.yaml :: cover — Étuis de golf en cuir marqués au logo du club, posés sur le green
- content/realisations/exemple-coffrets-golf.yaml :: photos[0] — Prototype et gabarit sur l’établi
- content/realisations/exemple-coffrets-golf.yaml :: photos[1] — Macro du logo marqué à chaud
- content/realisations/exemple-coffrets-golf.yaml :: photos[2] — Série de pièces alignées avant livraison
- content/studio.yaml :: pieces[2].photo — Étiquette de bagage en cuir, fond neutre
- content/studio.yaml :: pieces[4].photo — Protège-club de golf en cuir, fond neutre
- content/studio.yaml :: pieces[6].photo — Sous-main en cuir sur un bureau
- content/studio.yaml :: pieces[7].photo — Couverture de vinyle en cuir, fond neutre

## Photos écartées d’office

Textes incrustés (7, 11, 23, 35, 125, 127, 138, 158), bandes noires de story (17, 27, 47, 55, 60, 66, 68, 78), marque tierce visible (133), hors sujet (fleurs, serre-têtes, portraits sans cuir : 44, 48, 104, 111, 112, 136, 142 à 148), définition trop faible pour leur emplacement (photos de 446 × 792 px : 15, 25, 26, 28, 31, 34, 57…).
