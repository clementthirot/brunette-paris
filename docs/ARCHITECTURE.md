# Arborescence du site Brunette Paris

Source unique des adresses et des menus : `src/lib/routes.ts`. Les libellés se modifient dans
Keystatic › Réglages globaux › Navigation / Pied de page.

## Plan du site

```
/                                   Accueil (double entrée pro / particuliers)
│
├── ENTREPRISES ▾
│   ├── /entreprises                    NOUVEAU · page d'accueil pro (arguments, offres, méthode, réalisations, FAQ pro)
│   ├── /entreprises/<offre>            Offres (Événements, Sur-mesure marques, Hôtellerie-golf)
│   ├── /entreprises/realisations       NOUVEAU · études de cas (collection « Réalisations »)
│   └── /entreprises/realisations/<cas> NOUVEAU · fiche étude de cas (chiffres, demande/réponse/résultat, témoignage, 3D optionnelle)
│
├── CRÉATIONS ▾ (parcours particulier)
│   ├── /creations                      Galerie filtrable
│   ├── /creations/<pièce>              Fiche pièce (lien ajouté vers /entretien)
│   ├── /sur-mesure                     NOUVEAU · commande sur mesure particulier (projets, étapes, repères prix/délais, FAQ)
│   └── /entretien                      NOUVEAU · conseils par cuir, bons gestes, réparation, FAQ
│
├── L'ATELIER ▾
│   ├── /atelier                        Histoire, matières, finitions, galerie
│   ├── /journal                        NOUVEAU · coulisses, savoir-faire, conseils, presse (filtres par rubrique)
│   ├── /journal/<article>              NOUVEAU · article (sections, pièces liées). Une parution presse peut pointer vers le média.
│   └── /faq                            NOUVEAU · FAQ générale par thèmes, sommaire d'ancres
│
├── /contact                            Formulaire. Préremplissage : ?profil=entreprise|particulier, ?piece=…, ?objet=reparation
│
└── Pied de page légal
    ├── /mentions-legales
    ├── /confidentialite                NOUVEAU (RGPD, formulaire)
    └── /conditions-generales-de-vente  NOUVEAU (prérequis à la vente Stripe)
```

## Parcours

- **Acheteur pro** : Accueil › Entreprises › offre › réalisation (preuve) › devis (`/contact?profil=entreprise`).
- **Particulier** : Accueil › Créations › fiche pièce › « Demander cette pièce » ; ou Créations › Sur-mesure › devis (`?profil=particulier`).
- **Après achat** : fiche pièce › Entretien › réparation.
- **Référencement** : Journal et FAQ captent les recherches longues (« entretenir sac cuir », « sac cuir sur mesure Paris »…).

## Données structurées ajoutées

`FAQPage` (Entreprises, Sur-mesure, Entretien, FAQ), `BreadcrumbList` (toutes les nouvelles pages),
`Service` (Sur-mesure), `Article` (journal). Le `LocalBusiness` global reste dans `Base.astro`.

## Contenus à fournir par la cliente

Tout est éditable dans Keystatic ; chaque photo manquante affiche un cadre décrivant la photo attendue.
Rechercher `TODO` dans `content/` pour la liste des textes à valider (FAQ, délais, prix, CGV, confidentialité).

- Réalisations et articles : un **exemple non publié** sert de gabarit (`content/realisations/exemple-*.yaml`,
  `content/articles/exemple-*.yaml`). Cocher « Publiée » pour l'afficher. Tant que rien n'est publié,
  les pages liste affichent un texte d'attente et la section « Réalisations » de /entreprises est masquée.
- Lettre d'information : renseigner le lien dans Réglages › Pied de page › Lettre d'information pour afficher le bloc.
