# Karumap - Carte Interactive de la Guadeloupe

Karumap est un projet de carte interactive exploitant les données de l'API Karudata de la région Guadeloupe. Ce projet permet de visualiser, d'ajouter, de modifier et de supprimer des points d'intérêts directement sur une carte interactive.

## Installation et lancement

Pour mettre en place et lancer le projet Karumap, suivez les étapes ci-dessous :

### Prérequis

- Avoir Node.js installé sur votre machine.
- Avoir un système de gestion de base de données (MySQL, PostgreSQL, etc.) installé et configuré.

### Configuration de la base de données

1. Configurez le fichier `db.js` qui se trouve dans le répertoire `map` du projet avec les paramètres de votre base de données.
2. Créez la base de données en important le fichier `script.sql` qui se trouve à la racine du l'archive du projet. Cela créera la structure nécessaire à l'application.

### Installation des dépendances

Ouvrez un terminal, placez-vous dans le dossier `map` du projet et exécutez la commande suivante pour installer les dépendances nécessaires (il y en a beaucoup) : 
`npm install`

### Lancement du projet

Toujours dans le dossier `map`, lancez le projet avec la commande :

`npm run serve`


## Fonctionnalités

- **Importation des données depuis l'API :** Utilisez le bouton dédié pour charger les données depuis Karudata.
- **Rafraîchissement des données :** Les ajouts à la base de données peuvent être visualisés en rechargeant la page.
- **Gestion des points d'intérêts :** Il est possible d'ajouter, de modifier et de supprimer des points d'intérêts. Ces modifications seront reflétées sur la carte.
- **Navigation GPS :** À partir du menu caché sur la droite (bouton vert), il est possible d'ouvrir la position GPS d'un point d'intérêt dans Waze ou Google Maps pour débuter un itinéraire.
- **Mode Sombre :** Un mode sombre et clair est disponible pour une meilleure visibilité. Il est possible de changer de mode en appuyant sur le bouton dédié. Par défaut, le mode sombre.

## Notes

- **Performance des fenêtres modales :** La librairie utilisée pour les fenêtres modales peut présenter des problèmes de performance, causant des délais dans l'ouverture de la fenêtre d'ajout d'un point sur la carte.
- **Gestion du curseur :** La librairie de gestion du curseur peut parfois afficher un double du curseur bloqué en haut à gauche de l'écran.

Nous espérons que vous aprécierez notre projet.
Edwin Barnabot & Alix Danican