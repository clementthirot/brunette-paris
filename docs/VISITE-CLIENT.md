# Visite chez Armonie : ce qu'il faut récupérer et valider

Checklist consolidée à partir des PR #1 à #6 (état de la branche d'intégration du 21/11/2026).
Le site est complet : une fois cette liste cochée, il ne reste qu'à déposer les fichiers dans Keystatic (`/keystatic`) et à retirer les marqueurs.

**Ordre conseillé pendant la visite** : 1) les décisions qui bloquent la mise en ligne (section A), 2) les chiffres (B), 3) le tour de l'atelier pour les photos (C) et les pièces à scanner en 3D (D), 4) la relecture des textes (E).

Repères dans le code :
- `[À CONFIRMER : …]` : fait à valider, visible sur le site tant qu'il n'est pas retiré (liste détaillée dans `docs/copywriting-a-valider.md`).
- `TODO` : texte ou chiffre manquant. Les réponses de FAQ qui en contiennent ne sont pas envoyées à Google.
- Pour tout retrouver : `grep -rn "TODO\|À CONFIRMER" content`.

---

## A. Bloquant avant la mise en ligne

- [ ] **Identité légale** : raison sociale, forme juridique, adresse, SIRET, responsable de la publication, email (Keystatic › Mentions légales). Vérifier les coordonnées de Vercel.
- [ ] **Confidentialité** : responsable du traitement, outils utilisés (formulaire, mesure d'audience, lettre d'information), durée de conservation, cookies (Keystatic › Confidentialité).
- [ ] **CGV** : à faire rédiger ou valider par un professionnel avant toute vente en ligne Stripe : prix TTC/HT, acompte, paiement, livraison, rétractation (exclusion des pièces personnalisées), garanties, médiateur (Keystatic › Conditions générales de vente).
- [ ] **Coordonnées** : email définitif (`contact@brunette-paris.fr` à confirmer), téléphone, adresse de l'atelier, ville affichée (le site dit « Paris », la fiche entreprise dit « Île-de-France » : trancher) (Keystatic › Réglages globaux).
- [ ] **Formulaire** : créer le compte Formspree (ou équivalent) et coller l'adresse dans Réglages globaux › `formEndpoint`. Sans elle, le contact, le studio cadeaux et le kit d'échantillons ouvrent la messagerie avec la demande rédigée (ça marche, mais c'est moins pro).
- [ ] **Domaine** : nom définitif, avec ou sans `www`, redirection 301 dans Vercel. D'ici là, garder `SEO_INDEX=false` dans Vercel.
- [ ] **CITES** : certificats des peaux de python et de crocodile (pièces Riviera, Ondine, Saint-Germain, textes de l'atelier). Sans certificat, retirer ces pièces ou ces mentions.
- [ ] **Calendrier des commandes** : la première échéance affichée est « Cadeaux de fin d'année : commandez avant le **28 novembre 2026**, livrés avant le 15 décembre ». Valider qu'Armonie peut tenir ces dates, sinon les décaler ou décocher l'affichage (Keystatic › Calendrier des commandes).
- [ ] **Références clients** : quelles marques peut-on citer, avec autorisation écrite (Keystatic › Références clients ; l'exemple livré est masqué).

## B. Chiffres et conditions à valider

### Studio cadeaux (valeurs provisoires, Keystatic › Studio cadeaux)

| Pièce | Prix unitaire | Minimum | Délai |
| --- | --- | --- | --- |
| Porte-clés | 24 à 32 € | 20 | 3 sem. |
| Porte-cartes | 42 à 58 € | 15 | 4 sem. |
| Étiquette de bagage | 26 à 36 € | 20 | 3 sem. |
| Portefeuille | 110 à 150 € | 10 | 5 sem. |
| Protège-club de golf | 75 à 98 € | 10 | 5 sem. |
| Trousse de voyage | 85 à 120 € | 10 | 5 sem. |
| Sous-main ou set de table | 65 à 95 € | 10 | 4 sem. |
| Couverture de vinyle | 120 à 180 € | 10 | 6 sem. |

- [ ] Prix, minimums et délais ci-dessus (ou décocher « Afficher une estimation chiffrée » pour masquer tous les prix).
- [ ] Remises par palier : −8 % dès 50, −15 % dès 100, −22 % dès 250 pièces.
- [ ] Marquages : à sec (90 € de frais fixes), dorure or ou argent (+4 €/pièce, 90 € fixes), rivet gravé (+6 €/pièce, 60 € fixes). Proposez-vous bien les quatre ?
- [ ] Nuancier de cuirs (Naturel, Cognac, Ébène, Bleu reine, Céladon, Bordeaux) et de fils : remplacer par ce qui est réellement en stock. Ce nuancier alimente aussi le kit d'échantillons.

### Une seule réponse sur les quantités minimum et les délais

La quantité minimum (MOQ) et les délais apparaissent à **quatre endroits** qui doivent dire la même chose :
- [ ] le studio cadeaux (tableau ci-dessus) ;
- [ ] la FAQ de `/entreprises` (« dès une pièce pour un prototype, dès 10 pièces pour une série ? », « 3 à 6 semaines ? ») ;
- [ ] les FAQ des offres (marques : quantité, délais prototype et série, délai et coût du fer ; événements : délai minimum avant la date) ;
- [ ] les FAQ des pages occasion.

### Autres conditions
- [ ] **Fer à marquer au logo** : délai de fabrication et coût (cité dans 2 offres).
- [ ] **Événements** : taille de groupe idéale et capacité, durées par format, surface et mobilier du stand.
- [ ] **Hôtellerie** : fiche d'entretien remise, offre de réassort.
- [ ] **Kit d'échantillons** : gratuit ? zone d'envoi ? délai (le texte dit « sous une semaine en France métropolitaine, ou en main propre à Paris ») ?
- [ ] **Sur-mesure particulier** : délai type (ex. 4 à 8 semaines), prix d'entrée (ex. dès 150 €), acompte (ex. 30 %), nombre d'allers-retours, nuancier de fils, envoi, bon cadeau.
- [ ] **Créations** : prix affichés (Héritage 180 €, Pivoine 45 €, Birdie 120 €, Camille 690 €) et disponibilités ; pas de prix pour le portefeuille Saint-Germain.
- [ ] **FAQ générale** : origine des peaux et tanneries, moyens de paiement, zones et délais de livraison, retours.
- [ ] **Entretien** : produit recommandé par Armonie, conditions de réparation des pièces d'autres marques.
- [ ] **Facturation pro** : statut, TVA applicable ou non ; rendez-vous à l'atelier, chez le client ou en visio.
- [ ] **Lettre d'information** : outil (Brevo, Mailchimp) et lien d'inscription, sinon le bloc reste masqué.

## C. Photos à fournir (105 emplacements)

Chaque emplacement affiche aujourd'hui un « échantillon de cuir » avec la légende de la photo attendue : on peut donc montrer le site à Armonie page par page et cocher en direct. Formats : 4:5 vertical sauf mention, 2400 px de large au moins pour les pleins cadres, JPG ou WebP. Pensez au texte alternatif (déjà prérempli, à ajuster).

**Priorité 1 (ce que tout le monde voit)** : la vidéo ou photo du hero d'accueil, le portrait d'Armonie, les 9 pièces (2 photos chacune), les 3 heros d'offres, le hero `/entreprises`.
**Priorité 2** : galeries des offres, matières et savoir-faire, pages occasion, kit d'échantillons.
**Priorité 3** : vignettes du studio (facultatives : à défaut, une silhouette dessinée s'affiche), entretien.

À prévoir aussi pour remplir les gabarits livrés non publiés : 1 photo de couverture + 3 photos par **réalisation** (étude de cas) et 1 couverture + photos d'illustration par **article du journal**.

### Accueil (`/`)
Keystatic › Accueil.

- [ ] Plein cadre, mains travaillant le cuir à l’établi (photo ou vidéo)
- [ ] Atelier de personnalisation en événement, invités autour du poste de travail
- [ ] Sac en cuir fini, lumière naturelle, fond d’atelier
- [ ] Peaux de cuir empilées, main qui en éprouve le grain
- [ ] Gros plan tranchet découpant le cuir sur gabarit
- [ ] Gros plan mains + couture sellier
- [ ] Macro marquage à chaud du logo dans le cuir

### L’atelier (`/atelier`)
Keystatic › L’atelier.

- [ ] Portrait d’Armonie à son établi, lumière de fenêtre
- [ ] Macro texture cuir de vache pleine fleur
- [ ] Macro écailles de python, lumière rasante
- [ ] Macro écailles de crocodile
- [ ] Macro rivet laiton gravé du logo secondaire
- [ ] Macro dorure à chaud du logo sur cuir noir
- [ ] Macro marquage à chaud du logo sur cuir naturel
- [ ] Outils alignés (tranchet, alênes, griffes)
- [ ] Vue d’ensemble de l’établi
- [ ] Mains au travail, couture sellier
- [ ] Peaux suspendues ou roulées
- [ ] Gros plan fil de lin ciré et aiguilles
- [ ] Fer à marquer et presse

### Entreprises (hub pro) (`/entreprises`)
Keystatic › Entreprises.

- [ ] Plein cadre, pièces marquées au logo d’une marque sur l’établi

### Offre Événements et séminaires (`/entreprises/evenements-seminaires`)
Keystatic › Offres professionnelles.

- [ ] Bar à ceintures en événement, cuirs et boucles présentés sur table (vertical)
- [ ] Plein cadre, invités autour de l’atelier nomade pendant une soirée d’entreprise
- [ ] Vertical, artisane gravant des initiales au poste de marquage
- [ ] Carré, présentoir de ceintures et boucles
- [ ] Carré, porte-clés en cuir alignés avec initiales
- [ ] Carré, étiquettes de bagage en cuir avec sangles
- [ ] Carré, gros plan fer à marquer sur cuir
- [ ] Carré, participants apprenant la couture main
- [ ] Atelier nomade en soirée d’entreprise
- [ ] Gros plan boucles de ceinture laiton
- [ ] Invitée gravant ses initiales
- [ ] Ceintures terminées alignées sur l’établi
- [ ] Stand atelier en salon professionnel
- [ ] Mains et outils sur l’établi nomade
- [ ] Porte-clés gravés posés dans une coupelle

### Offre Hôtellerie, restauration et golf (`/entreprises/hotellerie-restauration-golf`)
Keystatic › Offres professionnelles.

- [ ] Protège-menu en cuir sur table de restaurant dressée (vertical)
- [ ] Plein cadre, table de restaurant gastronomique avec protège-menu en cuir
- [ ] Vertical, porte-addition en cuir tenu en main par un serveur
- [ ] Carré, protège-menus en cuir empilés
- [ ] Carré, porte-addition en cuir ouvert
- [ ] Carré, protège-clubs en cuir sur un sac de golf
- [ ] Carré, étui de carte de score en cuir sur le green
- [ ] Table dressée avec protège-menu
- [ ] Porte-addition posé sur nappe blanche
- [ ] Protège-clubs en cuir alignés
- [ ] Étui golf posé sur le green
- [ ] Macro nom d’établissement gravé à chaud
- [ ] Pochette en cuir pour clé d’hôtel

### Offre Sur-mesure pour les marques (`/entreprises/sur-mesure`)
Keystatic › Offres professionnelles.

- [ ] Pièce en cuir avec logo marqué à chaud, ambiance studio (vertical)
- [ ] Plein cadre, prototypes et gabarits sur l’établi
- [ ] Vertical, dorure à chaud d’un logo sur cuir
- [ ] Carré, coffret de cadeaux d’entreprise en cuir
- [ ] Carré, protège-caméra en cuir pour maison de luxe
- [ ] Carré, couverture de vinyle en cuir marquée à chaud
- [ ] Carré, accessoires de voyage en cuir
- [ ] Carré, macro logo marqué dans le cuir
- [ ] Prototype et gabarit papier sur l’établi
- [ ] Macro logo en dorure à chaud
- [ ] Série limitée de pièces alignées
- [ ] Protège-caméra en situation
- [ ] Couverture de vinyle en cuir
- [ ] Pièces emballées prêtes à la livraison

### Studio cadeaux (vignettes des pièces, optionnel) (`/entreprises/studio-cadeaux`)
Keystatic › Studio cadeaux.

- [ ] Porte-clés en cuir, fond neutre
- [ ] Porte-cartes en cuir, fond neutre
- [ ] Étiquette de bagage en cuir, fond neutre
- [ ] Portefeuille en cuir, fond neutre
- [ ] Protège-club de golf en cuir, fond neutre
- [ ] Trousse de voyage en cuir, fond neutre
- [ ] Sous-main en cuir sur un bureau
- [ ] Couverture de vinyle en cuir, fond neutre

### Kit d’échantillons (`/entreprises/echantillons`)
Keystatic › Kit d’échantillons.

- [ ] Kit d’échantillons ouvert sur un bureau, nuancier de cuirs et plaque marquée d’un logo

### Sur-mesure particuliers (`/sur-mesure`)
Keystatic › Sur-mesure.

- [ ] Plein cadre, Armonie présente des échantillons de cuir à une cliente
- [ ] Vertical, croquis et gabarit papier d’un sac sur l’établi
- [ ] Carré, sac en cours d’assemblage
- [ ] Carré, nuancier de cuirs autour d’une pièce
- [ ] Carré, macro d’initiales en dorure à chaud
- [ ] Carré, étui de golf ou couverture de vinyle sur mesure

### Entretien du cuir (`/entretien`)
Keystatic › Entretien.

- [ ] Plein cadre, mains appliquant une crème sur un sac en cuir
- [ ] Macro texture cuir de vache patiné
- [ ] Macro écailles de python
- [ ] Macro écailles de crocodile
- [ ] Couture sellier en cours de reprise sur une anse

### Pages cadeaux par occasion (`/entreprises/cadeaux/…`)
Keystatic › Cadeaux par occasion. Une photo de haut de page par occasion.

- [ ] **clients-partenaires** : Portefeuille en cuir dans son emballage, carte manuscrite posée dessus
- [ ] **fin-d-annee** : Coffrets de fin d’année, papier kraft, pièces en cuir marquées d’un logo doré
- [ ] **golf** : Protège-club en cuir marqué d’un logo, sur un sac de golf au bord du green
- [ ] **seminaire** : Table de séminaire dressée, étiquettes de bagage en cuir marquées au logo devant chaque place

### Fiches créations (`/creations/…`)
Keystatic › Créations. Deux photos par pièce, format 4:5 (la 2e s’affiche au survol de la carte).

- [ ] **ceinture-heritage** : Ceinture Héritage enroulée, boucle laiton (4:5)
- [ ] **ceinture-heritage** : Gros plan boucle laiton et passant cousu main
- [ ] **ceinture-riviera** : Ceinture Riviera en python, enroulée (4:5)
- [ ] **ceinture-riviera** : Gros plan écailles et boucle
- [ ] **couverture-vinyle-nocturne** : Couverture vinyle Nocturne, dorure à chaud (4:5)
- [ ] **couverture-vinyle-nocturne** : Disque glissé dans la couverture en cuir
- [ ] **etui-golf-albatros** : Étui de carte de score Albatros, posé sur le green (4:5)
- [ ] **etui-golf-albatros** : Détail du marquage à chaud sur l’étui
- [ ] **pochette-soiree-python** : Pochette Ondine en python, fond sombre (4:5)
- [ ] **pochette-soiree-python** : Gros plan écailles du python à la lumière rasante
- [ ] **porte-cles-pivoine** : Porte-clés Pivoine, anneau laiton (4:5)
- [ ] **porte-cles-pivoine** : Porte-clés Pivoine tenu en main
- [ ] **portefeuille-crocodile** : Portefeuille Saint-Germain en crocodile, fermé (4:5)
- [ ] **portefeuille-crocodile** : Portefeuille ouvert, détail des poches cousues main
- [ ] **protege-club-birdie** : Protège-club Birdie sur un driver (4:5)
- [ ] **protege-club-birdie** : Détail de la couture main et du marquage
- [ ] **sac-besace-camille** : Besace Camille, cuir de vache naturel, face, fond neutre (4:5)
- [ ] **sac-besace-camille** : Gros plan couture sellier et fermoir de la besace

## D. Modèles 3D attendus (.glb)

La visionneuse 3D des fiches créations affiche un objet provisoire en cuir piqué tant qu'aucun modèle n'est fourni. Un seul modèle réel existe aujourd'hui : `public/models/sac-besace-camille/model3d.glb`.

- [ ] Choisir 2 à 4 pièces phares à scanner (photogrammétrie avec Polycam ou équivalent, ou modélisation). Suggestion : la besace Camille (à remplacer si le modèle actuel est provisoire), la pochette Ondine, le protège-club Birdie, la couverture vinyle Nocturne.
- [ ] Format : `.glb`, moins de 5 Mo, textures 2048 px maximum, objet centré, échelle réelle.
- [ ] Dépôt : Keystatic › Créations › la pièce › Modèle 3D. Sinon, choisir la forme provisoire la plus proche (pochette, étui allongé, ceinture roulée, porte-clés).

| Pièce | Forme provisoire | Modèle réel |
| --- | --- | --- |
| Besace Camille | pochette | ✅ fourni (à vérifier) |
| Pochette Ondine (python) | pochette | à fournir |
| Portefeuille Saint-Germain (crocodile) | pochette | à fournir |
| Couverture vinyle Nocturne | pochette | à fournir |
| Étui golf Albatros | étui allongé | à fournir |
| Protège-club Birdie | étui allongé | à fournir |
| Ceinture Héritage | ceinture roulée | à fournir |
| Ceinture Riviera (python) | ceinture roulée | à fournir |
| Porte-clés Pivoine | porte-clés | à fournir |

Les réalisations (études de cas) acceptent aussi un modèle 3D facultatif.

## E. Textes à relire avec Armonie

- [ ] **Récit de l'atelier** (première personne) : parcours avant le cuir, tannage végétal, origine des peaux, provenance du python et du crocodile.
- [ ] **Les 15 points `[À CONFIRMER]`** listés dans `docs/copywriting-a-valider.md`.
- [ ] **Chiffres du manifeste** sur l'accueil.
- [ ] **Les 4 pages occasion** (fin d'année, séminaire, clients et partenaires, golf) et leurs FAQ marquées TODO.
- [ ] **Gabarits** : une première vraie réalisation et un premier article du journal (sujets possibles : coulisses d'une commande, la couture sellier, l'entretien du cuir).
- [ ] **Typographie des titres** : la charte ne mentionne que Josefin Sans ; le site utilise Cormorant Garamond pour les grands titres (choix à valider, alternatives prêtes dans `src/styles/tokens.css`).

## F. Comptes et accès à récupérer

- [ ] Accès Etsy et Instagram (liens déjà en place), et souhait d'afficher ou non le lien Etsy.
- [ ] Fiche Google Business Profile (à créer ou réclamer, voir `docs/seo-recommandations.md`).
- [ ] Logo vectoriel des clients cités en référence.
- [ ] Qui met à jour le site ensuite : Armonie dans Keystatic (prévoir 30 minutes de prise en main) ou Clément.
