# Engineering Design - Cook App

**Date de création** : 2026-02-15
**Version** : MVP v0.1
**Statut** : Design validé

---

## 📋 Table des Matières

1. [Tech Stack Complète](#tech-stack-complète)
2. [Architecture Globale](#architecture-globale)
3. [Structure du Projet](#structure-du-projet)
4. [Database Schema](#database-schema)
5. [Backend Architecture (Vercel)](#backend-architecture-vercel)
6. [Data Flow](#data-flow)
7. [Stores Zustand](#stores-zustand)
8. [Navigation Architecture](#navigation-architecture)
9. [Composants Clés](#composants-clés)
10. [API Intégrations](#api-intégrations)
11. [Type Definitions](#type-definitions)
12. [Error Handling](#error-handling)
13. [Performance Considerations](#performance-considerations)

---

## 1. Tech Stack Complète

### Frontend (Mobile App)

| Catégorie | Technologie | Version | Justification |
|-----------|-------------|---------|---------------|
| **Framework** | React Native | Latest | Cross-platform (Android prioritaire) |
| **Runtime** | Expo | SDK 50+ | Développement rapide, OTA updates |
| **Langage** | TypeScript | 5.x | Type safety, meilleure DX |
| **State Management** | Zustand | 4.x | Simple, performant, peu de boilerplate |
| **UI Library** | React Native Paper | 5.x | Material Design, composants prêts |
| **Navigation** | React Navigation | 6.x | Standard industrie |
| **Data Fetching** | TanStack Query | 5.x | Cache auto, retry, gestion erreurs |
| **Forms** | React Hook Form | 7.x | Performances, peu de re-renders |
| **Validation** | Zod | 3.x | Schema validation TypeScript |
| **HTTP Client** | Axios | 1.x | Intercepteurs, gestion erreurs |

### Backend (Serverless)

| Catégorie | Technologie | Justification |
|-----------|-------------|---------------|
| **Serverless Platform** | Vercel Functions | Déploiement simple, edge functions |
| **Runtime** | Node.js | JavaScript/TypeScript natif |
| **Framework** | Express (minimal) | Routing API simple |
| **API IA** | Claude API (Anthropic) | Suggestions intelligentes |
| **API Recettes** | Spoonacular | Base de recettes, filtres, nutrition |

### Database & Auth

| Catégorie | Technologie | Justification |
|-----------|-------------|---------------|
| **Database** | Supabase (PostgreSQL) | Backend-as-a-Service, temps réel |
| **Authentication** | Supabase Auth | Intégré, OAuth, email/password |
| **Storage** | Supabase Storage | Stockage images (avatars, futurs scans) |

### DevOps (V1+)

| Catégorie | Technologie | Justification |
|-----------|-------------|---------------|
| **Version Control** | Git + GitHub | Standard |
| **CI/CD** | GitHub Actions | Automatisation builds |
| **Testing** | Jest + RTL | Tests unitaires/intégration (V1) |
| **Monitoring** | Sentry | Error tracking (V1) |

---

## 2. Architecture Globale

### Vue d'Ensemble

```
┌─────────────────────────────────────────────────────────────┐
│                     MOBILE APP (Expo/RN)                    │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │  UI Layer   │  │ State (Zustand)│ │ Data (TanStack) │   │
│  │ (RN Paper)  │←→│    Stores      │←→│     Query       │   │
│  └─────────────┘  └──────────────┘  └──────────────────┘   │
│         ↑                                    ↓               │
│         └────────────────────────────────────┘               │
│                        API Calls                             │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│              VERCEL SERVERLESS FUNCTIONS                    │
│  ┌──────────────────┐  ┌──────────────────────────────┐    │
│  │  /api/suggestions│  │  /api/recipes/[id]           │    │
│  │  /api/profile    │  │  /api/favorites              │    │
│  └──────────────────┘  └──────────────────────────────┘    │
│         ↓                        ↓                           │
│    Claude API          Spoonacular API                      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    SUPABASE (Backend)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │ PostgreSQL   │  │  Auth        │  │  Storage        │  │
│  │ (Database)   │  │  (Users)     │  │  (Images)       │  │
│  └──────────────┘  └──────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Flux de Données Principal

1. **User Action** → Sélectionne tags d'état (Pressé, Prise de masse)
2. **UI** → Dispatch action vers Zustand store
3. **Store** → Met à jour state local
4. **TanStack Query** → Déclenche appel API vers Vercel
5. **Vercel Function** →
   - Récupère profil user depuis Supabase
   - Appelle Claude API avec contexte (profil + état + tags)
   - Claude génère des critères de recherche intelligents
   - Appelle Spoonacular API avec ces critères
   - Filtre et trie les résultats
6. **Response** → Retourne les suggestions à l'app
7. **TanStack Query** → Met en cache, met à jour UI
8. **UI** → Affiche les 3-5 recettes suggérées

---

## 3. Structure du Projet

### Architecture Feature-based

```
mon-app/
├─ src/
│  ├─ features/              # Features de l'app (feature-based)
│  │  ├─ onboarding/
│  │  │  ├─ screens/
│  │  │  │  └─ OnboardingScreen.tsx
│  │  │  ├─ components/
│  │  │  │  ├─ StepIndicator.tsx
│  │  │  │  ├─ PreferenceSelector.tsx
│  │  │  │  ├─ AllergyInput.tsx
│  │  │  │  └─ GoalPicker.tsx
│  │  │  ├─ hooks/
│  │  │  │  └─ useOnboardingForm.ts
│  │  │  └─ types.ts
│  │  │
│  │  ├─ dashboard/
│  │  │  ├─ screens/
│  │  │  │  └─ DashboardScreen.tsx
│  │  │  ├─ components/
│  │  │  │  ├─ StateTagSelector.tsx
│  │  │  │  ├─ SuggestionButton.tsx
│  │  │  │  └─ QuickStats.tsx
│  │  │  ├─ hooks/
│  │  │  │  └─ useDashboard.ts
│  │  │  └─ types.ts
│  │  │
│  │  ├─ recipes/
│  │  │  ├─ screens/
│  │  │  │  ├─ RecipeSuggestionsScreen.tsx
│  │  │  │  └─ RecipeDetailScreen.tsx
│  │  │  ├─ components/
│  │  │  │  ├─ RecipeCard.tsx
│  │  │  │  ├─ RecipeList.tsx
│  │  │  │  ├─ IngredientsList.tsx
│  │  │  │  ├─ CookingSteps.tsx
│  │  │  │  └─ NutritionInfo.tsx
│  │  │  ├─ hooks/
│  │  │  │  ├─ useRecipeSuggestions.ts
│  │  │  │  └─ useRecipeDetail.ts
│  │  │  └─ types.ts
│  │  │
│  │  ├─ favorites/
│  │  │  ├─ screens/
│  │  │  │  └─ FavoritesScreen.tsx
│  │  │  ├─ components/
│  │  │  │  └─ FavoritesList.tsx
│  │  │  ├─ hooks/
│  │  │  │  └─ useFavorites.ts
│  │  │  └─ types.ts
│  │  │
│  │  └─ profile/
│  │     ├─ screens/
│  │     │  └─ ProfileScreen.tsx
│  │     ├─ components/
│  │     │  ├─ ProfileHeader.tsx
│  │     │  └─ SettingsList.tsx
│  │     └─ hooks/
│  │        └─ useProfile.ts
│  │
│  ├─ shared/                # Code partagé entre features
│  │  ├─ components/
│  │  │  ├─ Button.tsx
│  │  │  ├─ Card.tsx
│  │  │  ├─ Input.tsx
│  │  │  ├─ Loader.tsx
│  │  │  ├─ ErrorView.tsx
│  │  │  └─ Tag.tsx
│  │  ├─ hooks/
│  │  │  ├─ useAuth.ts
│  │  │  └─ useToast.ts
│  │  ├─ utils/
│  │  │  ├─ formatters.ts
│  │  │  ├─ validators.ts
│  │  │  └─ constants.ts
│  │  └─ types/
│  │     └─ common.ts
│  │
│  ├─ services/              # Services externes et logique métier
│  │  ├─ api/
│  │  │  ├─ client.ts               # Axios instance configurée
│  │  │  ├─ endpoints.ts            # URLs des endpoints
│  │  │  ├─ suggestions.ts          # API calls suggestions
│  │  │  ├─ recipes.ts              # API calls recettes
│  │  │  ├─ profile.ts              # API calls profil
│  │  │  └─ favorites.ts            # API calls favoris
│  │  │
│  │  ├─ supabase/
│  │  │  ├─ client.ts               # Supabase client
│  │  │  ├─ auth.ts                 # Auth methods
│  │  │  ├─ database.ts             # DB queries
│  │  │  └─ types.ts                # Supabase types
│  │  │
│  │  └─ stores/             # Zustand stores
│  │     ├─ userStore.ts            # État utilisateur (profil, auth)
│  │     ├─ recipeStore.ts          # État recettes (suggestions, cache)
│  │     └─ uiStore.ts              # État UI (loading, modals, toasts)
│  │
│  ├─ navigation/
│  │  ├─ RootNavigator.tsx          # Navigation principale
│  │  ├─ AuthNavigator.tsx          # Stack auth (onboarding)
│  │  ├─ AppNavigator.tsx           # Tabs + Stack app
│  │  └─ types.ts                   # Navigation types
│  │
│  ├─ config/
│  │  ├─ theme.ts                   # Thème React Native Paper
│  │  └─ env.ts                     # Variables d'environnement
│  │
│  └─ App.tsx                        # Point d'entrée
│
├─ backend/                  # Vercel Serverless Functions
│  ├─ api/
│  │  ├─ suggestions.ts             # POST /api/suggestions
│  │  ├─ recipes/
│  │  │  └─ [id].ts                 # GET /api/recipes/:id
│  │  ├─ profile.ts                 # GET/PUT /api/profile
│  │  └─ favorites.ts               # GET/POST/DELETE /api/favorites
│  │
│  ├─ lib/
│  │  ├─ claude.ts                  # Claude API client
│  │  ├─ spoonacular.ts             # Spoonacular API client
│  │  ├─ supabase.ts                # Supabase admin client
│  │  └─ types.ts                   # Backend types
│  │
│  └─ middleware/
│     ├─ auth.ts                    # Auth middleware
│     └─ errorHandler.ts            # Error handling
│
├─ assets/                   # Images, fonts, etc.
├─ .env.example
├─ .gitignore
├─ app.json                  # Expo config
├─ package.json
├─ tsconfig.json
├─ vercel.json               # Vercel config
├─ PLAN.md
├─ PROJECT_SPEC.md
└─ ENGINEERING_DESIGN.md (ce fichier)
```

---

## 4. Database Schema

### Supabase PostgreSQL Tables

#### Table: `users` (gérée par Supabase Auth)
```sql
-- Créée automatiquement par Supabase Auth
users (
  id: uuid PRIMARY KEY,
  email: text UNIQUE NOT NULL,
  created_at: timestamp,
  updated_at: timestamp
)
```

#### Table: `user_profiles`
```sql
CREATE TABLE user_profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,

  -- Onboarding data
  dietary_preferences jsonb DEFAULT '[]'::jsonb,
    -- Ex: ["vegetarian", "vegan", "pescatarian", "omnivore"]

  allergies text[] DEFAULT ARRAY[]::text[],
    -- Ex: ["gluten", "lactose", "nuts", "shellfish"]

  main_goal text NOT NULL,
    -- Ex: "muscle_gain", "weight_loss", "balanced", "discovery"

  cooking_level text NOT NULL,
    -- Ex: "beginner", "intermediate", "advanced"

  -- Metadata
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Index for faster lookups
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
```

#### Table: `user_states`
```sql
CREATE TABLE user_states (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,

  -- Current state tags
  tags text[] DEFAULT ARRAY[]::text[],
    -- Ex: ["hurried", "tired", "motivated", "muscle_gain"]

  -- Metadata
  updated_at timestamp DEFAULT now()
);

-- Index
CREATE INDEX idx_user_states_user_id ON user_states(user_id);
```

#### Table: `favorites`
```sql
CREATE TABLE favorites (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Recipe info (from external API)
  recipe_id text NOT NULL,
    -- ID from Spoonacular API

  recipe_data jsonb NOT NULL,
    -- Cache de la recette complète
    -- Ex: { title, image, ingredients, steps, nutrition, ... }

  -- Metadata
  created_at timestamp DEFAULT now()
);

-- Indexes
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_recipe_id ON favorites(recipe_id);

-- Constraint: un user ne peut pas favoriser 2x la même recette
CREATE UNIQUE INDEX unique_user_recipe ON favorites(user_id, recipe_id);
```

#### Table: `recipe_history` (Optionnel MVP, utile pour analytics V1)
```sql
CREATE TABLE recipe_history (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  recipe_id text NOT NULL,
  recipe_title text,

  -- Interaction
  viewed boolean DEFAULT true,
  liked boolean DEFAULT NULL,
    -- NULL = pas d'avis, true = liked, false = disliked

  -- Context at time of view
  user_tags text[],
    -- Tags de l'utilisateur au moment de la vue

  -- Metadata
  created_at timestamp DEFAULT now()
);

-- Indexes
CREATE INDEX idx_recipe_history_user_id ON recipe_history(user_id);
CREATE INDEX idx_recipe_history_created_at ON recipe_history(created_at DESC);
```

### Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_history ENABLE ROW LEVEL SECURITY;

-- Policies: users can only access their own data

-- user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- user_states
CREATE POLICY "Users can view own state"
  ON user_states FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own state"
  ON user_states FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own state"
  ON user_states FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- favorites
CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);

-- recipe_history
CREATE POLICY "Users can view own history"
  ON recipe_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own history"
  ON recipe_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

---

## 5. Backend Architecture (Vercel)

### Endpoints API

#### POST `/api/suggestions`

**Description** : Génère des suggestions de recettes personnalisées

**Request Body** :
```typescript
{
  userId: string;
  tags: string[];  // ["hurried", "muscle_gain"]
}
```

**Flow** :
1. Valide le userId (vérifier que l'user existe)
2. Récupère le profil user depuis Supabase (dietary_preferences, allergies, main_goal, cooking_level)
3. Construit le prompt pour Claude :
   ```
   Tu es un assistant culinaire intelligent.
   Contexte utilisateur:
   - Préférences: [végétarien]
   - Allergies: [gluten]
   - Objectif: prise de masse
   - Niveau cuisine: débutant
   - État actuel: pressé, besoin de protéines

   Génère des critères de recherche pour l'API Spoonacular pour trouver 5 recettes adaptées.
   Réponds au format JSON:
   {
     "query": "high protein vegetarian",
     "diet": "vegetarian",
     "intolerances": "gluten",
     "maxReadyTime": 20,
     "type": "main course",
     "number": 5
   }
   ```
4. Appelle Claude API avec ce prompt
5. Parse la réponse JSON de Claude
6. Appelle Spoonacular API avec ces critères
7. Filtre/trie les résultats selon pertinence
8. Retourne les 3-5 meilleures recettes

**Response** :
```typescript
{
  suggestions: Array<{
    id: string;
    title: string;
    image: string;
    readyInMinutes: number;
    servings: number;
    healthScore: number;
    summary: string;
  }>;
}
```

#### GET `/api/recipes/:id`

**Description** : Récupère les détails complets d'une recette

**Flow** :
1. Appelle Spoonacular GET `/recipes/{id}/information`
2. Parse et formate la réponse
3. Retourne les détails complets

**Response** :
```typescript
{
  recipe: {
    id: string;
    title: string;
    image: string;
    readyInMinutes: number;
    servings: number;
    ingredients: Array<{
      name: string;
      amount: number;
      unit: string;
    }>;
    instructions: Array<{
      step: number;
      description: string;
    }>;
    nutrition: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    };
  };
}
```

#### GET `/api/profile`

**Description** : Récupère le profil utilisateur

**Query** : `?userId=xxx`

**Flow** :
1. Valide userId
2. Récupère depuis Supabase `user_profiles`
3. Retourne le profil

#### PUT `/api/profile`

**Description** : Met à jour le profil utilisateur

**Request Body** :
```typescript
{
  userId: string;
  dietary_preferences?: string[];
  allergies?: string[];
  main_goal?: string;
  cooking_level?: string;
}
```

**Flow** :
1. Valide les données
2. Update Supabase `user_profiles`
3. Retourne le profil mis à jour

#### GET `/api/favorites`

**Description** : Récupère les favoris de l'utilisateur

**Query** : `?userId=xxx`

#### POST `/api/favorites`

**Description** : Ajoute une recette aux favoris

**Request Body** :
```typescript
{
  userId: string;
  recipeId: string;
  recipeData: object;  // Cache de la recette complète
}
```

#### DELETE `/api/favorites/:id`

**Description** : Supprime un favori

---

## 6. Data Flow

### Flow 1 : Onboarding

```
User lands in app
    ↓
OnboardingScreen (Step 1/3: Dietary Preferences)
    ↓
User selects preferences → Store in local state (React Hook Form)
    ↓
Next → Step 2/3 (Allergies)
    ↓
User inputs allergies → Store in local state
    ↓
Next → Step 3/3 (Goal + Cooking Level)
    ↓
User selects goal/level → Store in local state
    ↓
Submit → Call POST /api/profile
    ↓
Backend saves to Supabase user_profiles
    ↓
Response → Update Zustand userStore
    ↓
Navigate to Dashboard
```

### Flow 2 : Génération de Suggestions

```
User on Dashboard
    ↓
Selects tags (Pressé, Prise de masse) → Update userStore.tags
    ↓
Clicks "Suggère-moi une recette"
    ↓
TanStack Query calls POST /api/suggestions { userId, tags }
    ↓
Backend:
  1. Fetch user profile from Supabase
  2. Build Claude prompt with context
  3. Call Claude API
  4. Parse response → Spoonacular criteria
  5. Call Spoonacular API
  6. Filter/sort results
  7. Return top 3-5 recipes
    ↓
Response → TanStack Query caches result
    ↓
Navigate to RecipeSuggestionsScreen
    ↓
Display RecipeCard list
    ↓
User clicks on a recipe → Navigate to RecipeDetailScreen
    ↓
TanStack Query calls GET /api/recipes/:id (if not in cache)
    ↓
Display full recipe details
```

### Flow 3 : Ajouter aux Favoris

```
User on RecipeDetailScreen
    ↓
Clicks "Add to Favorites" button
    ↓
TanStack Query mutation POST /api/favorites { userId, recipeId, recipeData }
    ↓
Backend saves to Supabase favorites
    ↓
Response → TanStack Query invalidates favorites query
    ↓
Update UI (button → "Added ✓")
    ↓
User navigates to Favorites tab
    ↓
TanStack Query GET /api/favorites?userId=xxx (cache or fresh)
    ↓
Display FavoritesList
```

---

## 7. Stores Zustand

### `userStore.ts`

```typescript
import { create } from 'zustand';

interface UserProfile {
  id: string;
  userId: string;
  dietary_preferences: string[];
  allergies: string[];
  main_goal: string;
  cooking_level: string;
}

interface UserState {
  isAuthenticated: boolean;
  userId: string | null;
  profile: UserProfile | null;
  currentTags: string[];

  // Actions
  setAuthenticated: (userId: string) => void;
  setProfile: (profile: UserProfile) => void;
  setTags: (tags: string[]) => void;
  toggleTag: (tag: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  isAuthenticated: false,
  userId: null,
  profile: null,
  currentTags: [],

  setAuthenticated: (userId) => set({ isAuthenticated: true, userId }),

  setProfile: (profile) => set({ profile }),

  setTags: (tags) => set({ currentTags: tags }),

  toggleTag: (tag) => set((state) => ({
    currentTags: state.currentTags.includes(tag)
      ? state.currentTags.filter(t => t !== tag)
      : [...state.currentTags, tag]
  })),

  logout: () => set({
    isAuthenticated: false,
    userId: null,
    profile: null,
    currentTags: []
  }),
}));
```

### `recipeStore.ts`

```typescript
import { create } from 'zustand';

interface Recipe {
  id: string;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
}

interface RecipeState {
  currentSuggestions: Recipe[];
  lastSuggestionTags: string[];

  // Actions
  setSuggestions: (suggestions: Recipe[], tags: string[]) => void;
  clearSuggestions: () => void;
}

export const useRecipeStore = create<RecipeState>((set) => ({
  currentSuggestions: [],
  lastSuggestionTags: [],

  setSuggestions: (suggestions, tags) => set({
    currentSuggestions: suggestions,
    lastSuggestionTags: tags
  }),

  clearSuggestions: () => set({
    currentSuggestions: [],
    lastSuggestionTags: []
  }),
}));
```

### `uiStore.ts`

```typescript
import { create } from 'zustand';

interface UIState {
  isLoading: boolean;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;

  // Actions
  setLoading: (loading: boolean) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isLoading: false,
  toast: null,

  setLoading: (loading) => set({ isLoading: loading }),

  showToast: (message, type) => set({ toast: { message, type } }),

  hideToast: () => set({ toast: null }),
}));
```

---

## 8. Navigation Architecture

### Structure de Navigation

```
RootNavigator
├─ AuthNavigator (Stack) - Si non authentifié
│  └─ OnboardingScreen
│
└─ AppNavigator (Tabs) - Si authentifié
   ├─ Tab 1: Dashboard (Stack)
   │  ├─ DashboardScreen
   │  ├─ RecipeSuggestionsScreen
   │  └─ RecipeDetailScreen
   │
   ├─ Tab 2: Favorites (Stack)
   │  ├─ FavoritesScreen
   │  └─ RecipeDetailScreen
   │
   └─ Tab 3: Profile (Stack)
      └─ ProfileScreen
```

### Navigation Types

```typescript
// navigation/types.ts

export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};

export type AuthStackParamList = {
  Onboarding: undefined;
};

export type DashboardStackParamList = {
  Dashboard: undefined;
  RecipeSuggestions: { tags: string[] };
  RecipeDetail: { recipeId: string };
};

export type FavoritesStackParamList = {
  Favorites: undefined;
  RecipeDetail: { recipeId: string };
};

export type ProfileStackParamList = {
  Profile: undefined;
};

export type AppTabParamList = {
  DashboardStack: undefined;
  FavoritesStack: undefined;
  ProfileStack: undefined;
};
```

### Bottom Tabs Config

```typescript
// navigation/AppNavigator.tsx

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator<AppTabParamList>();

export function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceDisabled,
      }}
    >
      <Tab.Screen
        name="DashboardStack"
        component={DashboardStackNavigator}
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="FavoritesStack"
        component={FavoritesStackNavigator}
        options={{
          title: 'Favoris',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="heart" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStackNavigator}
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
```

---

## 9. Composants Clés

### Dashboard

#### `StateTagSelector.tsx`
```typescript
// Component pour sélectionner les tags d'état
// Props: selectedTags, onTagToggle
// UI: Chips Material Design cliquables
// Tags disponibles: Pressé, Fatigué, Motivé, Prise de masse, Sèche, Équilibré
```

#### `SuggestionButton.tsx`
```typescript
// Bouton principal "Suggère-moi une recette"
// Props: onPress, disabled, loading
// UI: Large FAB (Floating Action Button) Material Design
```

### Recipes

#### `RecipeCard.tsx`
```typescript
// Card affichant une recette en liste
// Props: recipe (id, title, image, readyInMinutes, healthScore)
// UI: Card Material Design avec image, titre, temps, score
// Actions: onPress → navigate to detail
```

#### `RecipeList.tsx`
```typescript
// FlatList de RecipeCards
// Props: recipes, loading, onRecipePress
// UI: Vertical scrollable list avec pull-to-refresh
```

#### `IngredientsList.tsx`
```typescript
// Liste des ingrédients d'une recette
// Props: ingredients Array<{ name, amount, unit }>
// UI: Liste à puces Material Design
```

#### `CookingSteps.tsx`
```typescript
// Étapes de cuisson
// Props: steps Array<{ step, description }>
// UI: Timeline verticale numérotée
```

#### `NutritionInfo.tsx`
```typescript
// Informations nutritionnelles
// Props: nutrition { calories, protein, carbs, fat }
// UI: Cards ou chips avec icônes
```

### Shared

#### `Tag.tsx`
```typescript
// Tag/Chip réutilisable
// Props: label, selected, onPress, color
// UI: Chip Material Design
```

#### `ErrorView.tsx`
```typescript
// Vue d'erreur générique
// Props: message, onRetry
// UI: Illustration + message + bouton retry
```

#### `Loader.tsx`
```typescript
// Loader full screen ou inline
// Props: fullScreen (boolean)
// UI: ActivityIndicator Material Design
```

---

## 10. API Intégrations

### Claude API Integration

**File** : `backend/lib/claude.ts`

```typescript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

export async function generateRecipeCriteria(userContext: {
  dietary_preferences: string[];
  allergies: string[];
  main_goal: string;
  cooking_level: string;
  currentTags: string[];
}): Promise<SpoonacularCriteria> {

  const prompt = `Tu es un assistant culinaire intelligent.

Contexte utilisateur:
- Préférences alimentaires: ${userContext.dietary_preferences.join(', ')}
- Allergies: ${userContext.allergies.join(', ')}
- Objectif principal: ${userContext.main_goal}
- Niveau de cuisine: ${userContext.cooking_level}
- État actuel: ${userContext.currentTags.join(', ')}

Génère des critères de recherche optimaux pour l'API Spoonacular afin de trouver les meilleures recettes adaptées à ce contexte.

Réponds UNIQUEMENT avec un JSON valide au format suivant:
{
  "query": "terme de recherche principal",
  "diet": "type de régime (vegetarian, vegan, etc. ou null)",
  "intolerances": "intolérances séparées par virgule",
  "maxReadyTime": nombre de minutes max,
  "type": "type de plat (main course, dessert, etc.)",
  "number": 5
}`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: prompt,
    }],
  });

  const content = response.content[0].text;
  const criteria = JSON.parse(content);

  return criteria;
}
```

### Spoonacular API Integration

**File** : `backend/lib/spoonacular.ts`

```typescript
import axios from 'axios';

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com';

export interface SpoonacularCriteria {
  query?: string;
  diet?: string;
  intolerances?: string;
  maxReadyTime?: number;
  type?: string;
  number: number;
}

export async function searchRecipes(criteria: SpoonacularCriteria) {
  const response = await axios.get(`${BASE_URL}/recipes/complexSearch`, {
    params: {
      apiKey: SPOONACULAR_API_KEY,
      ...criteria,
      addRecipeInformation: true,
      fillIngredients: false,
      instructionsRequired: true,
    },
  });

  return response.data.results;
}

export async function getRecipeDetails(recipeId: string) {
  const response = await axios.get(`${BASE_URL}/recipes/${recipeId}/information`, {
    params: {
      apiKey: SPOONACULAR_API_KEY,
      includeNutrition: true,
    },
  });

  return response.data;
}
```

### Supabase Integration

**File** : `src/services/supabase/client.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

**File** : `src/services/supabase/database.ts`

```typescript
import { supabase } from './client';

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>) {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserFavorites(userId: string) {
  const { data, error } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// ... autres méthodes
```

---

## 11. Type Definitions

### Shared Types

```typescript
// src/shared/types/common.ts

export type DietaryPreference =
  | 'vegetarian'
  | 'vegan'
  | 'pescatarian'
  | 'omnivore';

export type MainGoal =
  | 'muscle_gain'
  | 'weight_loss'
  | 'balanced'
  | 'discovery';

export type CookingLevel =
  | 'beginner'
  | 'intermediate'
  | 'advanced';

export type StateTag =
  | 'hurried'       // Pressé
  | 'tired'         // Fatigué
  | 'motivated'     // Motivé
  | 'muscle_gain'   // Prise de masse
  | 'cutting'       // Sèche
  | 'balanced';     // Équilibré

export interface UserProfile {
  id: string;
  userId: string;
  dietary_preferences: DietaryPreference[];
  allergies: string[];
  main_goal: MainGoal;
  cooking_level: CookingLevel;
  created_at: string;
  updated_at: string;
}

export interface Recipe {
  id: string;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  healthScore?: number;
  summary?: string;
  ingredients?: Ingredient[];
  instructions?: CookingStep[];
  nutrition?: Nutrition;
}

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

export interface CookingStep {
  step: number;
  description: string;
}

export interface Nutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Favorite {
  id: string;
  userId: string;
  recipeId: string;
  recipeData: Recipe;
  created_at: string;
}
```

---

## 12. Error Handling

### Error Types

```typescript
// src/shared/types/errors.ts

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export class NetworkError extends Error {
  constructor(message: string = 'Problème de connexion') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}
```

### Error Handling Strategy

**Frontend** :
- TanStack Query gère automatiquement les retry (3 tentatives)
- Affichage de messages d'erreur user-friendly via `ErrorView` component
- Toast notifications pour erreurs non critiques via `uiStore`

**Backend** :
- Try/catch dans chaque endpoint
- Middleware `errorHandler` pour formater les erreurs
- Logging des erreurs (console.error pour MVP, Sentry pour V1)

```typescript
// backend/middleware/errorHandler.ts

export function errorHandler(error: any, req: any, res: any, next: any) {
  console.error('Error:', error);

  if (error instanceof ValidationError) {
    return res.status(400).json({
      error: 'Validation Error',
      message: error.message,
      field: error.field,
    });
  }

  if (error.response?.status) {
    // Erreur API externe (Spoonacular, Claude)
    return res.status(error.response.status).json({
      error: 'External API Error',
      message: error.message,
    });
  }

  // Erreur générique
  return res.status(500).json({
    error: 'Internal Server Error',
    message: 'Une erreur est survenue',
  });
}
```

---

## 13. Performance Considerations

### Frontend Optimizations

1. **TanStack Query Cache**
   - Cache time: 5 minutes pour les recettes
   - Stale time: 1 minute pour les suggestions
   - Invalidation intelligente (après favoris, après update profil)

2. **FlatList Optimization**
   - `removeClippedSubviews={true}`
   - `maxToRenderPerBatch={5}`
   - `windowSize={10}`
   - `getItemLayout` si possible

3. **Image Optimization**
   - Utiliser `<Image>` avec `resizeMode="cover"`
   - Lazy loading des images
   - Placeholder pendant le chargement

4. **Zustand Store**
   - Stores séparés par domaine (éviter re-renders globaux)
   - Sélecteurs précis (ne pas subscribe au store entier)

### Backend Optimizations

1. **Vercel Edge Functions** (V1)
   - Déployer certains endpoints en Edge pour latence réduite

2. **Rate Limiting**
   - Limiter les appels Claude/Spoonacular par user
   - Cache côté serveur pour requêtes identiques

3. **Database Indexes**
   - Déjà définis dans le schema
   - Monitoring des slow queries (V1)

### API Cost Management

1. **Claude API**
   - Utiliser Sonnet (moins cher qu'Opus)
   - Limiter la longueur des prompts
   - Cache les réponses similaires côté backend

2. **Spoonacular API**
   - Plan gratuit: 150 req/jour
   - Cache agressif des recettes populaires
   - Passer au plan payant si nécessaire (V1)

---

## 📝 Notes Finales

### Prochaines Étapes

1. ✅ Setup projet Expo + TypeScript
2. ✅ Configuration Supabase (database + auth)
3. ✅ Setup Vercel Functions
4. ✅ Implémentation navigation
5. ✅ Implémentation onboarding
6. ✅ Implémentation dashboard + suggestions
7. ✅ Intégration Claude + Spoonacular
8. ✅ Implémentation favoris
9. ✅ Tests manuels
10. ✅ Déploiement alpha

### Questions Ouvertes

- [ ] Choix du plan Spoonacular (gratuit vs payant)
- [ ] Stratégie de gestion des quotas API
- [ ] Design des écrans (wireframes/mockups)
- [ ] Nom final de l'app

---

**Dernière mise à jour** : 2026-02-15
**Statut** : Prêt pour implémentation
