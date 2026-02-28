# Project Spec - Cook App (nom provisoire)

**Date de création** : 2026-02-15
**Statut** : MVP en définition
**Plateforme** : Android (React Native)

---

## 🎯 Vision Produit

Application mobile de gestion quotidienne qui suggère des recettes personnalisées intelligentes via IA, adaptées à l'état de l'utilisateur, ses objectifs sportifs et son frigo.

**Objectif projet** : Projet test réaliste en full IA (Claude génère le code) pour tester les capacités d'implémentation sans intervention humaine dans le code.

---

## 👤 Pour Qui ? (Target Users)

### Persona Principal

**Profil démographique** :
- **Âge** : 18-25 ans et 25-40 ans
- **Situation** : Jeunes actifs, sportifs, étudiants
- **Niveau de vie** : Confortable
- **Compétences cuisine** : Débutant à intermédiaire
- **Pratique sportive** : Régulière (fitness, musculation, running...)

### Personas Types (3 profils MVP)

**1. Le Pressé** - *Tom, 26 ans, consultant*
> Rentre tard du boulot ou de la salle, veut manger vite et bien. Besoin de recettes rapides adaptées à ses objectifs sportifs.

**2. L'Anti-Gaspi** - *Marie, 24 ans, étudiante*
> Budget étudiant, veut éviter de jeter des légumes/produits qui périment. Cherche des idées pour cuisiner ce qu'elle a déjà.

**3. Le Motivé** - *Lucas, 29 ans, développeur*
> Le weekend, envie de cuisiner des plats plus élaborés. Recherche des recettes qui challengent et font découvrir.

---

## 🔥 Quels Problèmes Sont Résolus ?

### Problèmes Prioritaires

1. **Manque d'inspiration culinaire**
   - "Je ne sais jamais quoi faire à manger"
   - "Je fais toujours les mêmes plats, aucune variété"
   - Fatigue décisionnelle quotidienne

2. **Inadéquation alimentation/objectifs sportifs**
   - "Je ne sais pas adapter mon alimentation à mes besoins au quotidien"
   - "Difficile de savoir quoi manger après le sport, pour la prise de masse..."
   - Manque de connaissances en nutrition sportive

3. **Gaspillage alimentaire**
   - "Mes légumes et produits périment régulièrement"
   - "J'achète sans plan, je jette souvent"
   - Culpabilité liée au gaspillage

4. **Manque de temps**
   - "Je veux des repas faciles et rapides à préparer"
   - "Pas le temps de chercher des recettes pendant des heures"
   - Vie active chargée (travail + sport + social)

---

## ✨ Quelle Valeur Apportée ?

### L'Effet Waouh : Recettes Intelligentes et Personnalisées

**Ce qui différencie Cook App** :

🎯 **Personnalisation contextuelle**
- Suggestions adaptées en temps réel selon l'**état actuel** de l'utilisateur
- Tags : Pressé / Fatigué / Motivé / Prise de masse / Sèche / Équilibré...
- Plus besoin de chercher, l'IA comprend le besoin instantané

🧠 **Intelligence artificielle**
- Recommandations basées sur le profil (objectifs sport, allergies, niveau cuisine)
- Filtrage intelligent des recettes existantes (API)
- Apprentissage des préférences au fil du temps

⚡ **Simplicité et fluidité**
- Interface ultra-simple : 2 clics pour avoir une suggestion
- Pas de friction, pas de formulaires complexes
- Expérience fluide pensée pour le quotidien

🌱 **Impact positif**
- Réduction du gaspillage alimentaire (suggestions basées sur le frigo en V1+)
- Alimentation mieux adaptée aux objectifs personnels
- Découverte de nouvelles recettes sans effort

---

## 🏗️ Stack Technique

### Frontend
- **Framework** : React Native
- **Plateforme** : Android (iOS en V2)
- **State Management** : À définir (Context API / Zustand / Redux Toolkit)
- **UI Library** : À définir (React Native Paper / NativeBase / Custom)
- **Navigation** : React Navigation

### Backend
- **Serverless Functions** : Vercel (Node.js)
  - Proxy pour appels API Claude
  - Proxy pour API de recettes externes
  - Logique métier backend
- **Database** : Supabase
  - Authentification utilisateurs
  - Stockage profils utilisateurs
  - Historique recettes
  - Favoris
  - État utilisateur (tags sélectionnés)
- **API IA** : Claude API (Anthropic)
  - Génération de suggestions personnalisées
  - Filtrage intelligent des recettes
- **API Recettes** : À définir pour MVP
  - Options : Spoonacular / Edamam / TheMealDB / Tasty
  - Préférence : gratuite ou abordable pour tester

### Infrastructure
- **Hosting App** : Google Play Store (Android)
- **CI/CD** : À définir (GitHub Actions potentiellement)
- **Monitoring** : À définir selon besoins

---

## 🎯 Scope MVP (v0.1)

### Features Incluses

✅ **1. Onboarding Simplifié**
- Questionnaire rapide :
  - Préférences alimentaires (végétarien, vegan, omnivore...)
  - Allergies principales
  - Objectif principal (prise de masse, sèche, équilibré, découverte)
  - Niveau de cuisine (débutant, intermédiaire)
- Création du profil utilisateur
- Sauvegarde dans Supabase

✅ **2. Dashboard Minimal**
- Widget d'état (tags cliquables) :
  - Pressé
  - Fatigué
  - Motivé
  - Prise de masse
  - Sèche
  - Équilibré
- Bouton principal "Suggère-moi une recette"
- Affichage de l'état sélectionné

✅ **3. Suggestions de Recettes**
- Appel API recettes (externe)
- Filtrage intelligent par Claude selon :
  - Profil utilisateur
  - État sélectionné
- Affichage de 3-5 suggestions
- Détail de recette :
  - Titre
  - Image
  - Temps de préparation
  - Ingrédients
  - Étapes
  - Infos nutritionnelles (si disponibles via API)

✅ **4. Favoris Basique**
- Possibilité de sauvegarder une recette en favori
- Liste des recettes favorites
- Stockage dans Supabase

### Features Exclues du MVP

❌ **Gestion du frigo** → V1
❌ **Planning des repas** → V2
❌ **Scan de produits** → V2
❌ **Statistiques nutritionnelles** → V2
❌ **Partage de recettes** → V2+
❌ **Mode hors-ligne avancé** → V2+

---

## 🗺️ Roadmap Prévue

### MVP (v0.1) - Objectif : Validation concept
- Onboarding + Dashboard + Suggestions IA + Favoris
- Test de l'effet waouh des suggestions personnalisées
- Feedback utilisateurs proches

### V1 - Gestionnaire Complet
- Ajout de la gestion du frigo (ajout manuel)
- Suggestions basées sur ingrédients disponibles
- Alertes péremption
- Amélioration des suggestions IA

### V2 - Features Avancées
- Scan de produits (code-barres/OCR)
- Planning des repas hebdomadaire
- Statistiques détaillées (nutrition, budget, gaspillage)
- Génération de listes de courses
- Mode hors-ligne amélioré

### V3+ - Scale & Community
- iOS
- Partage de recettes
- Communauté d'utilisateurs
- Intégrations tierces (apps de courses, fitness trackers)

---

## 🎨 Principes de Design Produit

1. **Simplicité avant tout**
   - Moins de friction possible
   - 2 clics maximum pour arriver à une suggestion

2. **Personnalisation sans effort**
   - L'IA fait le travail, pas l'utilisateur
   - Pas de formulaires complexes

3. **Effet waouh constant**
   - Les suggestions doivent surprendre positivement
   - Découverte de nouvelles recettes adaptées

4. **Mobile-first**
   - Pensé pour être utilisé en cuisine, dans les transports
   - Accessibilité rapide

---

## 📋 Cas d'Usage Concrets (MVP)

### Scénario A - Le Pressé

> **Lundi 19h30** - Tom rentre de la salle de sport. Il a faim, il est pressé et veut des protéines pour sa prise de masse.
>
> **Actions** :
> 1. Ouvre Cook App
> 2. Clique sur les tags "Pressé" + "Prise de masse"
> 3. Appuie sur "Suggère-moi une recette"
> 4. L'IA lui propose 3 recettes rapides (<20min) riches en protéines
> 5. Il choisit un bowl poulet-riz-brocoli
> 6. Consulte les étapes, cuisine en 15 min
>
> **Résultat** : Repas adapté, rapide, sans réflexion

### Scénario B - L'Anti-Gaspi (V1+, pas MVP)

> **Jeudi soir** - Marie a des tomates et courgettes qui vont périmer dans 2 jours.
>
> **Actions** :
> 1. Ouvre Cook App
> 2. Voit une alerte "2 produits bientôt périmés"
> 3. Clique sur "Trouve une recette"
> 4. L'IA suggère des recettes utilisant tomates + courgettes
> 5. Elle choisit une ratatouille express
> 6. Sauve ses légumes et découvre une nouvelle recette
>
> **Résultat** : Zéro gaspillage, découverte culinaire

### Scénario C - Le Motivé

> **Samedi midi** - Lucas est en forme, il a 1h devant lui et envie de cuisiner.
>
> **Actions** :
> 1. Ouvre Cook App
> 2. Sélectionne "Motivé" + "Équilibré"
> 3. Demande une suggestion
> 4. L'IA propose des recettes plus élaborées (40-60min)
> 5. Il choisit un curry thaï maison
> 6. Se fait plaisir en cuisinant, apprend de nouvelles techniques
>
> **Résultat** : Expérience culinaire enrichissante, plat savoureux

---

## 🚧 Contraintes & Considérations

### Contraintes Techniques
- **API Costs** : Surveiller les coûts Claude API (appels fréquents)
- **Latence** : Temps de réponse IA doit être <3s pour bonne UX
- **Offline** : MVP nécessite connexion, gérer les erreurs réseau gracieusement

### Contraintes Produit
- **Qualité des suggestions** : L'effet waouh dépend de la pertinence IA
- **Base de recettes** : Dépendance à l'API externe (disponibilité, qualité)
- **Onboarding** : Doit être rapide (<2min) sinon friction

### Privacy & Données
- **Données de santé** : Objectifs sportifs, allergies (données sensibles)
- **Approche MVP** : Pas de masquage, tout envoyé à Claude API
- **V1+** : Évaluer chiffrement et compliance RGPD si scale

---

## 📝 Notes de Développement

### Questions en Suspens
- [ ] Choix final de l'API de recettes (gratuite vs payante)
- [ ] State management React Native (Context vs Zustand)
- [ ] UI Library (custom vs pré-existante)
- [ ] Stratégie de gestion des erreurs API

### Décisions à Prendre
- [ ] Nom définitif de l'app (après MVP)
- [ ] Design system / Charte graphique
- [ ] Stratégie de monétisation (gratuit, freemium, premium)

---

**Dernière mise à jour** : 2026-02-15
**Prochaines étapes** : Définir l'architecture détaillée et commencer le développement MVP
