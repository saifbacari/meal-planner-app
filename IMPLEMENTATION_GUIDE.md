# Implementation Guide - Cook App MVP

**Date** : 2026-02-24
**Purpose** : Detailed breakdown of all MVP features with implementation requirements
**Status** : Comprehensive checklist for feature completeness

---

## 📋 Feature Completeness Checklist

### ✅ DASHBOARD (Suggestions Tab)

**Current Status** : 80% complete
**Files** : `app/(tabs)/index.tsx`

#### Implemented
- [x] Header with title "Qu'est-ce qu'on mange ?"
- [x] Forme physique chips (En forme, Fatigué, Après sport, Sommeil)
- [x] Envies du moment chips (Rapide, Réconfortant, Léger, Épicé)
- [x] Recipe suggestions with mock data (16 recipes)
- [x] Recipe cards (featured + standard layouts)
- [x] Favorite toggle functionality
- [x] Ingredient filtering modal
- [x] Selected ingredients display with removal
- [x] Recipe filtering based on selections

#### Missing / Incomplete
- [ ] **Empty state when no recipes match** - Need messaging when filters yield 0 results
- [ ] **Loading state** - Show spinner while fetching suggestions (for future API calls)
- [ ] **Error handling** - Handle network errors gracefully
- [ ] **Proper state management** - Currently using useState, should use Context/Zustand for app-wide state

**Implementation Tasks:**
1. Add empty state UI when `filteredRecipes.length === 0`
2. Add loading spinner during recipe fetch simulation
3. Add error boundary component
4. Implement Context API for global state (selected chips, ingredients, favorites)
5. Add pull-to-refresh functionality

---

### ❌ ONBOARDING (Not Implemented)

**Current Status** : 0% complete
**Priority** : HIGH - Required for MVP

#### What Needs to Be Built

**Screen 1: Welcome**
- Title: "Bienvenue dans Cook App"
- Subtitle: "Découvrez des recettes adaptées à vous"
- CTA Button: "Commencer"
- Skip option for demo/existing users

**Screen 2: Dietary Preferences**
- Radio buttons: Omnivore, Végétarien, Vegan
- Multi-select: Common allergies (gluten, dairy, nuts, shellfish, eggs)
- Next/Back navigation

**Screen 3: Sport & Goals**
- Single select dropdown:
  - Prise de masse (protein-focused)
  - Sèche (low-cal)
  - Équilibré (balanced)
  - Découverte (variety)
- Frequency selector: Casual, Regular, Intense

**Screen 4: Cooking Level**
- Radio buttons: Débutant, Intermédiaire, Avancé
- Time availability: How much time willing to spend on cooking

**Screen 5: Review & Confirm**
- Summary of preferences
- "Commencer" button to save profile

#### State Structure
```typescript
interface UserProfile {
  id: string; // UUID from Supabase auth
  dietaryPreference: 'omnivore' | 'vegetarian' | 'vegan';
  allergies: string[];
  sportGoal: 'prise_de_masse' | 'seche' | 'equilibre' | 'decouverte';
  sportFrequency: 'casual' | 'regular' | 'intense';
  cookingLevel: 'beginner' | 'intermediate' | 'advanced';
  maxCookingTime: number; // minutes
  createdAt: string;
  updatedAt: string;
}
```

#### Files to Create
- `app/onboarding/_layout.tsx` - Onboarding stack navigator
- `app/onboarding/welcome.tsx` - Welcome screen
- `app/onboarding/dietary.tsx` - Dietary preferences
- `app/onboarding/goals.tsx` - Sport goals
- `app/onboarding/cooking-level.tsx` - Cooking level
- `app/onboarding/review.tsx` - Review & confirm
- `components/onboarding/OnboardingSlider.tsx` - Navigation component
- `hooks/useOnboarding.ts` - State management for onboarding flow

---

### ❌ AUTHENTICATION (Not Implemented)

**Current Status** : 0% complete
**Priority** : HIGH - Required for MVP

#### What Needs to Be Built

**Auth Screen**
- Option 1: Email/Password signup
- Option 2: Google Sign-In (if possible on Android)
- Option 3: Anonymous/Demo mode

**Implementation Points:**
1. Supabase Auth integration
2. Store auth token securely (SecureStore)
3. Persist user session across app restarts
4. Redirect to onboarding if first-time user
5. Redirect to dashboard if already profiled

#### Files to Create
- `app/auth/_layout.tsx` - Auth stack navigator
- `app/auth/login.tsx` - Login/signup screen
- `contexts/AuthContext.tsx` - Auth state management
- `hooks/useAuth.ts` - Auth hook
- `lib/supabase.ts` - Supabase client setup
- `utils/secure-store.ts` - Secure token storage

---

### ❌ RECIPE API INTEGRATION (Not Implemented)

**Current Status** : 0% complete
**Priority** : HIGH - MVP dependency

#### Currently Using
- **Mock data** : 16 hardcoded recipes in `app/(tabs)/index.tsx`

#### What Needs to Change

**Option 1: TheMealDB API (Recommended for MVP)**
- Free, no key required
- 1000+ recipes database
- Endpoint: `https://www.themealdb.com/api/json/v1/1/search.php?s={meal}`

**Option 2: Spoonacular**
- Requires API key
- Free tier: 150 requests/day
- More detailed recipe info

**Option 3: Local Database (Fallback)**
- SQLite with pre-loaded recipes
- No network dependency

#### Implementation Tasks

1. Create `hooks/useRecipes.ts`
   - Fetch from API or local DB
   - Cache results for offline access
   - Handle pagination

2. Create `lib/api/recipes.ts`
   - API client functions
   - Error handling
   - Retry logic

3. Update `app/(tabs)/index.tsx`
   - Replace mock data with API calls
   - Add loading & error states
   - Implement debouncing for filter changes

4. Recipe data structure should include:
```typescript
interface Recipe {
  id: string;
  title: string;
  image: string;
  cookingTime: number; // minutes
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  ingredients: { name: string; quantity: string; unit: string }[];
  instructions: string;
  nutritionInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  tags: string[]; // quick, healthy, vegetarian, etc
}
```

---

### ❌ CLAUDE API INTEGRATION (Not Implemented)

**Current Status** : 0% complete
**Priority** : MEDIUM - Nice to have for MVP

#### Current Approach
- Filtering done locally with `useRecipeFilter` hook

#### What Claude Should Do

**Intelligent Filtering:**
Given:
- User profile (goals, preferences, allergies)
- Current state (selected chips)
- Available recipes

Claude should:
1. Rank recipes by relevance (1-5 stars)
2. Explain why each recipe is suggested
3. Identify recipes that conflict with allergies
4. Suggest variations or substitutions

#### Implementation (Backend-First)

**Serverless Function (Vercel)** : `api/recipes/suggest.ts`
```typescript
POST /api/recipes/suggest
Body: {
  userProfile: UserProfile,
  selectedState: string[],
  availableRecipes: Recipe[],
  selectedIngredients: string[]
}
Response: {
  suggestions: SuggestedRecipe[],
  reasoning: string
}
```

**Frontend**: `hooks/useRecipeSuggestions.ts`
- Call serverless function instead of direct Claude API
- Cache responses
- Handle rate limiting

**Note:** For MVP, this can be **optional**. Local filtering + mock data is sufficient to validate UX.

---

### ✅ RECIPE DETAILS (Partially Implemented)

**Current Status** : 70% complete
**Missing File** : `app/recipes/[id].tsx`

#### Needed
- [ ] Detail screen when user taps a recipe card
- [ ] Full recipe view:
  - Large image
  - Title + chef info
  - Cooking time + difficulty
  - Ingredients list (with checkboxes for shopping list)
  - Step-by-step instructions
  - Nutritional info (if available)
  - Favorite button
  - Share button (optional for MVP)

#### Files to Create
- `app/recipes/_layout.tsx` - Recipe stack
- `app/recipes/[id].tsx` - Recipe detail screen
- `components/recipes/IngredientsChecklist.tsx` - Interactive ingredients

---

### ✅ FAVORITES (Partially Implemented)

**Current Status** : 50% complete
**Files** : `app/(tabs)/favorites.tsx` (placeholder)

#### Currently
- Favorite heart icon on recipes (visual feedback only)
- No persistence

#### What Needs to Be Built

**Favorites Tab:**
1. Display all favorited recipes
2. Show empty state: "Aucune recette favorite"
3. Remove from favorites option
4. Filter by dietary preference option

**Data Persistence:**
- Store in Supabase `user_favorites` table
- OR: AsyncStorage for MVP (simpler, no backend)

#### Files to Create/Update
- `app/(tabs)/favorites.tsx` - Implement screen
- `hooks/useFavorites.ts` - Favorite management hook
- `contexts/FavoritesContext.tsx` - Shared favorite state

---

### ❌ FRIDGE MANAGEMENT (Not Implemented)

**Current Status** : 0% complete
**Priority** : LOW - Excluded from MVP per spec, but frontend placeholder needed

#### MVP Version
- Empty screen: "Prochainement - Gestion du frigo en V1"

**V1 Features (Future):**
- Add ingredients manually
- Expiration date tracking
- Alert when items about to expire
- Filter recipes by available ingredients

#### Files to Create
- `app/(tabs)/fridge.tsx` - Implement placeholder

---

### ❌ PROFILE SCREEN (Not Implemented)

**Current Status** : 0% complete
**Priority** : MEDIUM for MVP

#### What MVP Version Should Show

**Profile Display:**
- User name (from auth)
- Dietary preferences (from onboarding)
- Sport goals
- Edit preferences button → re-run onboarding flow
- Logout button

**Data:**
- Pull from Supabase user table
- Allow re-editing onboarding answers

#### Files to Create/Update
- `app/(tabs)/profile.tsx` - Implement screen
- `components/profile/UserPreferences.tsx` - Preferences display
- `components/profile/EditProfileModal.tsx` - Edit flow

---

## 🗄️ Data Persistence Strategy

### Current
- Mock data in memory
- No persistence

### MVP Minimum Requirements

**Option 1: AsyncStorage (Simplest)**
```
✅ Favorites list
✅ User preferences (from onboarding)
✅ Selected ingredients
❌ Synced across devices
❌ Backup protection
```

**Option 2: Supabase (Recommended)**
```
✅ User authentication
✅ User profiles
✅ Favorites sync
✅ Cloud backup
✅ Future server-side filtering
```

### Database Schema (Supabase)

```sql
-- Users (managed by Supabase Auth)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  dietary_preference TEXT,
  allergies TEXT[],
  sport_goal TEXT,
  sport_frequency TEXT,
  cooking_level TEXT,
  max_cooking_time INT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Favorites
CREATE TABLE user_favorites (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id),
  recipe_id TEXT,
  created_at TIMESTAMP
);

-- (Optional) Recipe Cache
CREATE TABLE recipe_cache (
  id TEXT PRIMARY KEY,
  data JSONB,
  cached_at TIMESTAMP
);
```

---

## 🎯 State Management Architecture

### Current
- Multiple `useState` calls scattered in components

### Recommended MVP Structure

```typescript
// contexts/AppContext.tsx
interface AppContextType {
  // User
  user: UserProfile | null;
  isAuthenticated: boolean;

  // Dashboard State
  selectedPhysicalState: string;
  selectedCraving: string;
  selectedIngredients: string[];

  // Recipes
  recipes: Recipe[];
  filteredRecipes: Recipe[];
  isLoadingRecipes: boolean;

  // Favorites
  favoriteRecipeIds: Set<string>;

  // Actions
  setUser: (user: UserProfile) => void;
  setSelectedPhysicalState: (state: string) => void;
  setSelectedCraving: (craving: string) => void;
  addIngredient: (ingredient: string) => void;
  removeIngredient: (ingredient: string) => void;
  toggleFavorite: (recipeId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);
```

---

## 🔄 Feature Dependency Graph

```
┌─────────────────────────────────────────┐
│         AUTHENTICATION (Login)           │
│    (Blocks: Onboarding, Profile)         │
└──────────────────┬──────────────────────┘
                   │
       ┌───────────▼───────────┐
       │  ONBOARDING (Profile) │
       │  (Blocks: Dashboard)   │
       └───────────┬───────────┘
                   │
    ┌──────────────┼──────────────┐
    │              │              │
    ▼              ▼              ▼
┌─────────┐  ┌──────────┐  ┌──────────┐
│DASHBOARD│  │ FAVORITES│  │ PROFILE  │
│(Recipe  │  │(Persist  │  │(Edit     │
│ Filter) │  │ favs)    │  │ prefs)   │
└────┬────┘  └──────────┘  └──────────┘
     │
     ▼
┌──────────────┐
│RECIPE DETAIL │
│(Instructions)│
└──────────────┘
```

---

## 📱 Screen Navigation Map

```
Root Navigator
├── Auth Stack (if !authenticated)
│   ├── Login/Signup
│   └── (other auth screens)
├── Onboarding Stack (if !hasProfile)
│   ├── Welcome
│   ├── Dietary
│   ├── Goals
│   ├── Cooking Level
│   └── Review
└── Main Tabs (if authenticated && hasProfile)
    ├── Suggestions (Dashboard)
    │   └── Recipe Detail
    ├── Fridge (Placeholder)
    ├── Favorites
    │   └── Recipe Detail
    └── Profile
        └── Edit Preferences

Modal Layers
├── AddIngredientsModal (from Dashboard)
└── RecipeDetailModal (alternative to full screen)
```

---

## 🧪 Testing Checklist

### Happy Path (Complete User Flow)
- [ ] User signs up with email
- [ ] Completes onboarding (dietary, goals, level)
- [ ] Sees dashboard with chips
- [ ] Selects physical state + craving
- [ ] Adds ingredients
- [ ] Sees filtered recipes
- [ ] Taps recipe → sees details
- [ ] Favorites a recipe
- [ ] Navigates to Favorites tab → sees saved recipe
- [ ] Navigates to Profile → sees preferences
- [ ] Logs out & logs back in → data persists

### Edge Cases
- [ ] Empty recipe results (0 matches)
- [ ] Network error during API call
- [ ] Very long recipe titles (text overflow)
- [ ] Large number of ingredients
- [ ] Ingredient search with no results
- [ ] Device rotation (landscape/portrait)
- [ ] Dark/Light mode switching

### Performance
- [ ] App opens in <3 seconds
- [ ] Scrolling recipes is smooth (60fps)
- [ ] Filter changes reflect in <500ms
- [ ] No memory leaks on navigation

---

## 🚀 Implementation Priority

### Phase 1: Critical Path (Week 1-2)
1. [x] Design System & Components ✅
2. [x] Dashboard UI ✅
3. [x] Recipe Mock Data ✅
4. [ ] **Authentication** (Supabase setup)
5. [ ] **Onboarding Flow** (5 screens)
6. [ ] **Basic State Management** (Context API)

### Phase 2: Core Features (Week 2-3)
7. [ ] Recipe API Integration (TheMealDB)
8. [ ] Favorites Persistence (Supabase/AsyncStorage)
9. [ ] Recipe Detail Screen
10. [ ] Profile Screen Implementation
11. [ ] Error Handling & Empty States

### Phase 3: Polish (Week 3+)
12. [ ] Loading spinners & skeletons
13. [ ] Pull-to-refresh
14. [ ] Offline support (caching)
15. [ ] Performance optimization
16. [ ] Comprehensive testing

---

## 📌 Known Issues & Decisions

### Issue 1: Mock Data vs Real API
**Decision:** Use TheMealDB for MVP to avoid hardcoding
**Timeline:** Phase 2
**Impact:** Recipes become dynamic, more realistic testing

### Issue 2: Backend vs Fully Local
**Decision:** Start fully local, add Supabase later
**Timeline:** MVP can work without backend, sync in V1
**Impact:** Faster MVP, less server costs initially

### Issue 3: Claude API Cost
**Decision:** Skip Claude filtering for MVP
**Timeline:** Use simpler local filtering, add Claude in V1
**Impact:** Saves $, validates UX first

### Issue 4: State Management Library
**Decision:** Use Context API for MVP (no external deps)
**Timeline:** Easy to migrate to Zustand/Redux in V1
**Impact:** Keep dependencies minimal

---

## ✅ Definition of Done (MVP v0.1)

The MVP is complete when:

- [x] Design system fully implemented
- [ ] User can authenticate (email signup)
- [ ] User completes onboarding (5 screens)
- [ ] User sees personalized suggestions on dashboard
- [ ] User can add/remove ingredients
- [ ] User can view recipe details
- [ ] User can favorite/unfavorite recipes
- [ ] Favorites persist across app restarts
- [ ] Profile shows user preferences
- [ ] All screens have loading states
- [ ] All screens have error states
- [ ] Dark/Light mode works everywhere
- [ ] No console errors/warnings
- [ ] App runs on Android device (tested with Expo Go)
- [ ] Navigation between all tabs works smoothly

---

**Last Updated** : 2026-02-24
**Next Review** : After implementing Auth + Onboarding
