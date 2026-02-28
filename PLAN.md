# Plan de l'Application - Gestionnaire de Recettes Intelligent

## 🎯 Vision du Projet

Application Android (React Native) de gestion quotidienne qui suggère des recettes personnalisées selon les ingrédients disponibles et l'état de l'utilisateur.

**Objectif** : Projet test réaliste en full IA pour tester les capacités de Claude sans code manuel.

---

## 📋 Les 2 Questions Centrales

### 1. Qu'est-ce que vous essayez vraiment de faire ?
Créer un gestionnaire quotidien qui :
- Suggère des recettes selon le contenu du frigo
- S'adapte à l'état de l'utilisateur (pressé, fatigué, motivé, prise de masse...)
- Accompagne au quotidien dans la gestion des repas

### 2. Quelles sont les étapes clés des fonctionnalités ?
- Onboarding pour définir un profil utilisateur (ICP)
- Dashboard adapté avec listing
- *(À compléter au fur et à mesure)*

---

## 🗺️ Plan de Développement

### Phase 1 : Onboarding & Profil Utilisateur
**Objectif** : Créer un profil personnalisé (ICP - Ideal Customer Profile)

**Fonctionnalités** :
- [ ] Questionnaire initial
  - Préférences alimentaires (végétarien, vegan, sans gluten...)
  - Allergies et intolérances
  - Objectifs (perte de poids, prise de masse, équilibre...)
  - Niveau de cuisine (débutant, intermédiaire, expert)
  - Budget moyen par repas
- [ ] Configuration du profil
  - Nombre de personnes au foyer
  - Habitudes alimentaires (fréquence repas maison vs extérieur)
- [ ] Sauvegarde du profil utilisateur

---

### Phase 2 : Gestion du Frigo
**Objectif** : Inventaire intelligent des ingrédients disponibles

**Fonctionnalités** :
- [ ] Ajout manuel d'ingrédients
  - Nom, quantité, unité
  - Catégorie (légumes, viandes, épices...)
- [ ] Gestion des stocks
  - Liste des produits disponibles
  - Modification/suppression
- [ ] Suivi des dates de péremption
  - Alertes pour produits bientôt périmés
  - Priorité dans les suggestions
- [ ] **Bonus** : Scan de produits (code-barres/OCR)
- [ ] **Bonus** : Import depuis liste de courses

---

### Phase 3 : Suggestions de Recettes Intelligentes
**Objectif** : Recommandations personnalisées selon contexte

**Fonctionnalités** :
- [ ] Algorithme de suggestion basé sur :
  - **Ingrédients disponibles** (matching avec frigo)
  - **État actuel** :
    - Pressé → recettes rapides (<20 min)
    - Fatigué → recettes simples (peu d'étapes)
    - Motivé → recettes élaborées
    - Prise de masse → riches en protéines
    - Etc.
  - **Profil utilisateur** (préférences, allergies, objectifs)
- [ ] Filtres et recherche
  - Par temps de préparation
  - Par type de plat (entrée, plat, dessert)
  - Par cuisine (italienne, asiatique, française...)
- [ ] Détails de recette
  - Ingrédients nécessaires
  - Étapes de préparation
  - Temps de cuisson/préparation
  - Valeurs nutritionnelles
  - Ce qui manque du frigo (liste de courses partielle)
- [ ] Interaction avec suggestions
  - Like/Dislike pour améliorer les recommandations
  - Sauvegarder en favoris

---

### Phase 4 : Dashboard Personnalisé
**Objectif** : Vue d'ensemble du gestionnaire quotidien

**Inspiration** : [Google Stitch Project](https://stitch.withgoogle.com/projects/12873048393437500179)

**Fonctionnalités** :
- [ ] Vue d'accueil personnalisée
  - Suggestion du jour
  - État actuel du frigo (nb produits, alertes péremption)
- [ ] Recettes favorites
  - Accès rapide aux recettes likées
  - Historique des recettes préparées
- [ ] Planning des repas
  - Planification hebdomadaire
  - Génération de liste de courses
- [ ] Statistiques & Insights
  - Nutrition (calories, macros)
  - Budget dépensé
  - Variété alimentaire
  - Gaspillage évité
- [ ] Widgets rapides
  - "Qu'est-ce que je mange ce soir ?"
  - "État actuel" (sélecteur d'humeur/contexte)
  - Accès rapide à l'ajout d'ingrédients

---

## 🚀 Fonctionnalités Bonus (V2)

- [ ] Mode liste de courses intelligente
  - Génération automatique selon planning
  - Optimisation par magasin/rayon
- [ ] Partage de recettes
  - Communauté d'utilisateurs
  - Recettes personnelles
- [ ] Intégrations
  - Import depuis sites de recettes
  - Synchronisation avec applications de courses
- [ ] Mode hors-ligne
  - Accès aux recettes favorites sans connexion
- [ ] Assistant vocal
  - Lecture de recette en mode mains libres

---

## 📊 Stack Technique Prévu

- **Framework** : React Native
- **Plateforme** : Android (iOS plus tard)
- **Backend/IA** : Claude AI (full IA)
- **Base de données** : À définir (SQLite locale ? Firebase ?)
- **État** : À définir (Context API ? Redux ? Zustand ?)

---

## 📝 Notes de Développement

*Ce document sera mis à jour au fur et à mesure du développement*

**Dernière mise à jour** : 2026-02-15
