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

### 📋 Features Incluses - Detailed Breakdown

#### ✅ **1. Authentication & Signup**
**Status** : ❌ NOT YET IMPLEMENTED
- Email/password signup (Supabase Auth)
- Secure token storage (react-native-secure-store)
- Session persistence across app restarts
- Logout functionality
- Demo/Anonymous mode option

**Files to Create:**
- `app/auth/_layout.tsx`
- `app/auth/login.tsx`
- `contexts/AuthContext.tsx`
- `lib/supabase.ts`

---

#### ✅ **2. Onboarding Simplifié**
**Status** : ❌ NOT YET IMPLEMENTED - **CRITICAL PATH**
- Screen 1: Welcome + Setup intro
- Screen 2: Dietary preferences (omnivore, vegetarian, vegan)
- Screen 3: Allergies (gluten, dairy, nuts, shellfish, eggs)
- Screen 4: Sport goal (prise de masse, sèche, équilibré, découverte)
- Screen 5: Cooking level (débutant, intermédiaire, avancé)
- Screen 6: Review & confirm
- Creation of user profile in Supabase
- Session storage for quick re-access

**Files to Create:**
- `app/onboarding/_layout.tsx`
- `app/onboarding/welcome.tsx`
- `app/onboarding/dietary.tsx`
- `app/onboarding/goals.tsx`
- `app/onboarding/cooking-level.tsx`
- `app/onboarding/review.tsx`
- `hooks/useOnboarding.ts`

---

#### ✅ **3. Dashboard - Suggestion Engine**
**Status** : 🟡 PARTIALLY IMPLEMENTED (80%)
- Header with "Qu'est-ce qu'on mange ?"
- **Forme physique chips** (En forme, Fatigué, Après sport, Sommeil)
- **Envies du moment chips** (Rapide, Réconfortant, Léger, Épicé)
- **Ingredients widget** (Add/Remove with modal)
- **Recipe suggestions display** (3-5 recipes, featured + standard layout)
- **Empty state** when no recipes match ❌ MISSING
- **Loading state** during API calls ❌ MISSING
- **Error state** for network failures ❌ MISSING

**Current Limitation:** Using 16 hardcoded recipes instead of real API
**Next Step:** Integrate TheMealDB API

**Files to Update:**
- `app/(tabs)/index.tsx` - Add loading/error states, empty state
- Add API integration layer

---

#### ✅ **4. Recipe Suggestions via API**
**Status** : ❌ NOT YET IMPLEMENTED
- Fetch recipes from external API (TheMealDB recommended)
- Cache recipes locally for offline access
- Filter recipes based on:
  - User dietary preferences
  - Allergies (exclude incompatible recipes)
  - Selected physical state + cravings
  - Selected ingredients (must-have)
- Display 5-10 matching recipes

**API Choice for MVP:** TheMealDB (free, no auth required)
- Endpoint: `https://www.themealdb.com/api/json/v1/1/search.php?s={meal}`
- Alternative: Spoonacular (requires key but more detailed)

**Files to Create:**
- `lib/api/recipes.ts` - API client
- `hooks/useRecipes.ts` - Recipe fetching hook
- `services/recipeCache.ts` - Local caching logic

---

#### ✅ **5. Recipe Details Screen**
**Status** : ❌ NOT YET IMPLEMENTED
- Full recipe view when user taps a recipe
- Display:
  - Large recipe image
  - Title & author (if available)
  - Cook time, difficulty, servings
  - **Ingredients list** with quantities
  - **Step-by-step instructions**
  - Nutritional info (if available)
  - Favorite button
  - Back navigation
- Ingredient checklist (optional for shopping)

**Files to Create:**
- `app/recipes/_layout.tsx`
- `app/recipes/[id].tsx`
- `components/recipes/IngredientsChecklist.tsx`

---

#### ✅ **6. Favorites Management**
**Status** : 🟡 PARTIALLY IMPLEMENTED (50%)
- Heart icon on recipe cards (visual, not persisted)
- Save recipe to favorites
- Display all favorites in "Favoris" tab
- Remove from favorites
- Empty state: "Aucune recette favorite"
- Persistence via Supabase OR AsyncStorage

**Current Issue:** Favorites don't persist between app sessions

**Files to Create/Update:**
- `app/(tabs)/favorites.tsx` - Implement full screen
- `hooks/useFavorites.ts` - Favorite state management
- Database migration for user_favorites table

---

#### ✅ **7. User Profile & Preferences**
**Status** : ❌ NOT YET IMPLEMENTED
- Display user name (from auth)
- Show current preferences (dietary, goals, cooking level)
- Edit preferences (re-run onboarding flow)
- Logout button
- Account deletion option (optional)

**Files to Create:**
- `app/(tabs)/profile.tsx`
- `components/profile/UserPreferences.tsx`
- `components/profile/EditProfileModal.tsx`

---

#### ✅ **8. Dark Mode / Light Mode**
**Status** : ✅ IMPLEMENTED
- Design system supports both themes
- Color palette in `constants/theme.ts`
- `useColorScheme` hook handles switching
- Applies across all components

---

### ❌ Features Explicitly Excluded from MVP

| Feature | Target Version | Reason |
|---------|----------------|--------|
| **Gestion du frigo** (Fridge management) | V1 | Requires inventory tracking + UX for addition |
| **Planning hebdo** (Weekly meal planning) | V2 | Complex calendar UI, out of MVP scope |
| **Scan de codes-barres** (Barcode scanning) | V2 | Requires camera permissions, OCR library |
| **Statistiques nutritionnelles avancées** | V2 | Requires detailed recipe API, complex calculations |
| **Partage de recettes** | V2+ | Requires social features, backend infrastructure |
| **Mode hors-ligne complet** | V2 | MVP requires connectivity |
| **Intégrations tierces** (Fitness trackers, etc) | V3+ | Integration complexity, APIs may change |

**Note:** These features are **placeholders only** in the MVP:
- Fridge tab: "À venir en V1 - Gestion du frigo"
- All other excluded features: Similar placeholder messages

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

| Constraint | Requirement | Impact |
|-----------|-------------|--------|
| **API Response Time** | <3 seconds for recipe fetch | User won't wait longer for suggestions |
| **Network Connectivity** | MVP requires internet | Offline mode → V2 |
| **Storage** | AsyncStorage or Supabase | Both viable; Supabase = better for scaling |
| **Auth Token** | Secure storage required | Use `react-native-secure-store` |
| **Image Loading** | Use `expo-image` not native Image | Better performance, URL handling |
| **App Size** | Keep under 50MB | Monitor bundle size with EAS |
| **Memory** | No memory leaks on navigation | Test with React DevTools |
| **Frame Rate** | 60 fps on recipe scroll | No janky animations |

### Contraintes Produit

| Constraint | Solution | Owner |
|-----------|----------|-------|
| **Onboarding time** | Must be <2 minutes | Product design |
| **Recipe match rate** | Should match ≥3 recipes for most queries | API choice (TheMealDB good) |
| **Empty state handling** | Clear messaging when 0 recipes match | UX/Frontend |
| **User confusion** | Clear navigation hints + intuitive flow | UX/Product |
| **Error messages** | Friendly, actionable error text | Frontend/Copy |

### Privacy & Données

| Item | MVP Approach | V1+ Plan |
|------|-------------|----------|
| **Allergies & health data** | Stored in Supabase (plain) | Evaluate encryption |
| **Auth credentials** | Supabase Auth handles | Ensure tokens are secure stored |
| **Recipe preferences** | Saved in user_profiles table | Consider GDPR compliance if EU users |
| **Claude API calls** | Skip for MVP (local filtering) | Never send raw health data to 3rd parties |
| **Data retention** | No deletion policy yet | Implement in V1 |

### Performance Targets (MVP)

- **App Launch**: <3 seconds from cold start
- **Dashboard Load**: <500ms to show initial recipes
- **Filter Update**: <300ms when selecting chips
- **Recipe Detail**: <1 second to navigate to detail screen
- **API Call**: <2 seconds for TheMealDB response
- **Favorite Toggle**: <100ms local update (optimistic)

### Browser/Device Compatibility

**MVP Target:**
- ✅ Android 10+ (Expo minimum)
- ✅ Physical devices (tested via Expo Go)
- ⚠️ Tablet mode not optimized (portrait-focused)
- ❌ iOS (V2)
- ❌ Web (V3)

---

## 🔗 Data Flow & Integration Points

### Authentication Flow
```
User → Login Screen → Supabase Auth → JWT Token
                           ↓
                    Secure Store (device)
                           ↓
                    Check if Has Profile
                      ↙          ↘
                Onboarding    Dashboard
```

### Recipe Suggestion Flow
```
User selects chips →
  ├─ Local state update (instant feedback)
  ├─ useRecipeFilter applied (local memory)
  └─ Display filtered results

OR (with API)

User selects chips →
  ├─ Local state update
  ├─ Fetch from TheMealDB
  ├─ Apply useRecipeFilter
  └─ Display results (500ms)
```

### Favorites Persistence
```
User taps heart icon →
  ├─ Optimistic: heart fills immediately
  ├─ Async: Save to user_favorites table (Supabase)
  └─ Sync: Fetch favorites on Profile load

App reopens →
  ├─ Auth check
  ├─ Fetch user_favorites from Supabase
  └─ Hydrate favorites state
```

---

## ⚠️ Risk Assessment & Mitigation

### High Risk Items

| Risk | Impact | Mitigation |
|------|--------|-----------|
| **No real recipe data** | Can't validate UX with real recipes | Integrate TheMealDB early (Phase 1) |
| **No auth system** | Can't verify user flows | Implement Supabase + onboarding by Week 1 |
| **Network-dependent** | Offline = broken MVP | Accept as MVP limitation, plan offline for V2 |
| **Hardcoded recipes** | Doesn't feel "alive" | Replace with API ASAP |
| **No state persistence** | Favorites/prefs lost on refresh | Add Supabase by week 2 |

### Medium Risk Items

| Risk | Mitigation |
|------|-----------|
| **TheMealDB API downtime** | Add fallback to locally cached recipes |
| **Slow API response** | Implement timeout + error message |
| **Poor recipe matching** | Manual testing needed; may show "no match" often |
| **Supabase rate limits** | MVP low traffic; unlikely issue |

---

## 📊 Success Metrics (MVP Validation)

The MVP is successful if:

✅ **Functionality**
- [ ] User can create account
- [ ] User completes onboarding (>80% completion rate)
- [ ] User sees suggestions matching their preferences
- [ ] User can favorite recipes persistently
- [ ] No console errors in daily usage

✅ **Performance**
- [ ] App loads in <3 seconds
- [ ] Recipe filter updates in <300ms
- [ ] No visible lag when scrolling
- [ ] API calls don't timeout (>80% success rate)

✅ **UX**
- [ ] User understands the flow intuitively
- [ ] No ambiguous error messages
- [ ] Dark mode works everywhere
- [ ] All text is readable

✅ **Stability**
- [ ] No crashes in 1-hour usage session
- [ ] Navigation works smoothly
- [ ] Favorites don't randomly disappear
- [ ] Network errors are handled gracefully

---

## 📝 Development Milestones

### Milestone 1: Foundation (Week 1)
- [ ] Supabase project setup
- [ ] Auth system (signup/login)
- [ ] Onboarding flow (5 screens)
- [ ] State management (Context API)
- [ ] Database schema created

**Definition of Done:** User can sign up, complete onboarding, and see dashboard.

### Milestone 2: Core Features (Week 2)
- [ ] TheMealDB API integration
- [ ] Recipe detail screen
- [ ] Favorites system (persist to DB)
- [ ] Profile screen (display + edit prefs)
- [ ] Loading & error states everywhere

**Definition of Done:** Complete user flow works end-to-end.

### Milestone 3: Polish (Week 3+)
- [ ] Empty states messaging
- [ ] Skeleton loaders
- [ ] Pull-to-refresh
- [ ] Comprehensive testing
- [ ] Performance optimization
- [ ] Build optimization

**Definition of Done:** Ready for beta testing with real users.

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
