# Challenges
## Informations
La platforme permet à des etudients de soumettres des resultat pour des devoirs, l'admin a la creation du challenge présente un script qui permet d'evaluer les resutats des étudiants.
Le projet est fait en DJANGO pour le coté serveur, coté client c'est plutot du reactJS, la gestion des taches asynchrone pour l'evaluation des scripts est faite avec le serveur RabitMQ et la librairie Celery. 
## Base de donnée
Pour le stockage des informations, mon choix c'est porté sur une base de données non relationnelle ( MongoDB ), qui permet le stockage d'information massive, mais aussi pour son fonctionnement interne, en effet une base de données NOSQL, permet de ne pas avoir de schéma prédéfini, cette souplesse aide à avoir une diversité sur la structure des challenges que l'on peut composé j'ai rajouté à ça des contraintes entres les différentes collections pour assuré l'intégrité des données.



## Fonctionnalités
Le site web consiste en deux interfaces, l'une pour les membres du staff l'autre pour les étudiants, la première permet de modifier tout ce qui touche aux cours, challenges, groupes d'étudiant, soumission, et visualisation des statistiques.

La seconde permet la soumission d'une réponse et la consultation du classement des étudiants

Il faut rajouter à ce-là la gestion en file d'attente et la limitation du nombre de requêtes pouvant être envoyé par l'utilisateur pour limité la surcharge du serveur.   

	
Les différentes fonctionnalités:
1. Pour les Administrateurs:
    - Créer un cours.
    - Ajouter/Modifier/Supprimer un challenge à son cours.
    - Ajouter/Modifier/Supprimer un membre du staff à gérer un cours.
    - Création d'un compte étudiant avec envoie d'un lien pour le changement de mot de passe par email.
    - Ajouter/Supprimer un étudiant à son cours.
    - Envoyer un email à tous les étudiants qui suivent un cours.
2. Pour les membres du staff et administrateurs:
    - Ajouter/Modifier/Supprimer un étudiant à un cours que le membre du staff gère.
    - Avoir la liste des étudiants qui suivent un cours.
    - Consulter la liste des groupes.
    - Consulter les challenges.
    - Consulter les statistiques.
    - Avoir la liste des étudiants qui n'ont pas encore répondu à un challenge.
3. Pour les étudiants:
    - Consulter les challenges d'un cours que l'étudiant suit.
    - Ajoute un étudiant à une équipe pour un challenge précis.
    - Soumettre une réponse à un challenge.
    - Possibilité de consulter le score et l'état de chaque soumission.
    - Consulter le leaderboard d'un challenge (Tous les scores des autres équipes).
    - Possibilité de consulter l'historique de chaque soumission.
4. Pour les visiteurs:
    - Possibilité d'envoyer une demande de réinitialisation du mot de passe.
