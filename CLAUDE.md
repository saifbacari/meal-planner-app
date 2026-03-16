# CLAUDE.md — Recettes Maison

Instructions persistantes pour Claude Code. Lu automatiquement à chaque session.

---

## Projet

App React Native (Expo) de suggestions de recettes IA. L'utilisateur renseigne son frigo, Claude génère des recettes adaptées à son état physique et ses préférences alimentaires.

**Stack** : Expo SDK ~54 · React 19 · Expo Router v3 · Supabase (Auth + PostgreSQL) · Claude API · AsyncStorage
**Repo** : `github.com/saifbacari/meal-planner-app` · Branche principale : `master`

---

## Setup nouvelle machine

```bash
git clone https://github.com/saifbacari/meal-planner-app.git
cd mon-app
npm install

# Créer le fichier .env (non versionné) :
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
EXPO_PUBLIC_CLAUDE_API_KEY=...

# Créer .mcp.json (non versionné) pour Linear :
# { "mcpServers": { "linear": { "type": "stdio", "command": "npx", "args": ["-y", "mcp-linear"], "env": { "LINEAR_API_KEY": "..." } } } }

npx expo start -c
```

---

## Commandes essentielles

```bash
npx expo start -c          # Démarrer (toujours -c pour vider le cache)
npx expo install <pkg>     # TOUJOURS ça — jamais npm install pour les packages Expo/RN
```

---

## Structure des fichiers

```
app/
  index.tsx                  # Router racine — logique de redirect (auth / onboarding / tabs)
  _layout.tsx                # Stack principal : index, (tabs), auth, onboarding, modal
  auth/
    login.tsx                # Login + signup (toggle tabs)
  onboarding/
    index.tsx                # Welcome screen
    step1.tsx                # Objectifs nutritionnels
    step2.tsx                # Régime + allergies
    step3.tsx                # Temps prépa + niveau cuisine
    step4.tsx                # Ingrédients fréquents (pré-remplit le frigo)
    finish.tsx               # Animation + completeOnboarding() + redirect /(tabs)
  (tabs)/
    index.tsx                # Dashboard — suggestions IA
    fridge.tsx               # Gestion du frigo (catégories)
    favorites.tsx            # Recettes favorites
    profile.tsx              # Profil, préférences, déconnexion, suppression compte

contexts/
  AuthContext.tsx            # Session Supabase, signIn/signUp/signOut/deleteAccount
  FridgeContext.tsx          # Ingrédients frigo, AsyncStorage
  FavoritesContext.tsx       # Recettes favorites, AsyncStorage
  PreferencesContext.tsx     # Préférences user, draft onboarding, sync Supabase

lib/
  claude.ts                  # generateRecipeSuggestions, generateRecipeSteps, filterRecipes
  supabase.ts                # Client Supabase avec AsyncStorageAdapter

components/
  ui/                        # Badge, Chip, RecipeCard, etc.
  modals/
    RecipeDetailModal.tsx    # Détail recette + étapes générées à la demande
    BarcodeScannerModal.tsx  # Scan code-barre + Open Food Facts
    AddIngredientsModal.tsx
  onboarding/
    OnboardingLayout.tsx     # Barre progression + bouton retour + skip/next
    ChoiceCard.tsx           # Carte de choix onboarding

constants/
  theme.ts                   # Design system complet
```

---

## Design system (`constants/theme.ts`)

- **Toujours** `Colors.dark.*` pour les écrans — app 100% dark theme
- Couleur primaire : `#13ec5b` → `ColorPalette.primary`
- Jamais de couleurs en dur — utiliser les tokens : `Spacing`, `Radius`, `FontSize`, `FontWeight`, `ColorPalette`
- `const C = Colors.dark;` en haut de chaque fichier screen

---

## Navigation Expo Router — règles critiques

```typescript
// ❌ NE JAMAIS FAIRE — casse la navigation
useEffect(() => { router.replace('/somewhere'); }, []);
```

```typescript
// ✅ Routing initial → app/index.tsx avec <Redirect>
// ✅ Après signIn/signUp → router.replace('/') → app/index.tsx prend le relais
// ✅ Après signOut → router.replace('/auth/login') depuis profile.tsx
```

- Pas de `unstable_settings` avec `anchor` — ça cassait la navigation (bug résolu)
- `app/index.tsx` n'est actif QUE quand on est sur la route `/`

---

## Contextes disponibles

| Hook | Données exposées |
|---|---|
| `useAuth()` | `user`, `loading`, `signIn`, `signUp`, `signOut`, `deleteAccount` |
| `useFridge()` | `items: FridgeItem[]`, `addItem`, `removeItem`, `clearFridge` |
| `useFavorites()` | `favorites`, `isFavorited(id)`, `toggleFavorite(recipe)` |
| `usePreferences()` | `preferences: UserPreferences`, `loading`, `draft`, `updateDraft`, `savePreferences`, `completeOnboarding` |

**Pattern addItem (CRITIQUE)** — toujours forme fonctionnelle pour éviter stale closure :
```typescript
setItems(prev => [...prev, newItem]); // ✅
setItems([...items, newItem]);        // ❌ stale closure
```

---

## IA / Claude API (`lib/claude.ts`)

- **Modèle** : `claude-haiku-4-5-20251001` · **Temperature** : `0.2`
- `generateRecipeSuggestions(fridgeItems, preferences?)` — génère 5-8 recettes
- `generateRecipeSteps(title, recipeIngredients, fridgeItems)` — étapes à la demande
- `filterRecipes(recipes, physicalState, craving)` — filtrage local
- **1 appel API** par changement de frigo ou de préférences — jamais par sélection de mood
- Filtrage mood/état fait **localement** sur les recettes déjà générées (pas de nouvel appel)

**Contraintes temps par état physique (post-processing inclus côté client) :**
- `tired` → ≤ 20 min
- `sleep` → ≤ 15 min
- `post_sport` → ≤ 30 min
- `fit` → pas de limite

**IDs préférences (utilisés dans onboarding ET dans le prompt Claude) :**
- Objectifs : `lose_weight` · `eat_healthy` · `build_muscle` · `maintain`
- Régimes : `omnivore` · `vegetarian` · `vegan` · `pescatarian` · `halal` · `kosher` · `no_pork`
- Allergies : `gluten` · `lactose` · `nuts` · `seafood` · `eggs` · `soy` · `peanuts`

---

## Supabase

### Table `user_preferences`
```sql
user_id uuid references auth.users(id) on delete cascade unique,
goals text[] default '{}',
diet text[] default '{}',          -- text[] PAS text (choix multiple)
allergies text[] default '{}',
cooking_level text default 'intermediate',
preferred_time text default '15-30',
frequent_ingredients text[] default '{}',
onboarding_completed boolean default false,
updated_at timestamptz default now()
```

### RLS activé — policy : `auth.uid() = user_id` pour SELECT/INSERT/UPDATE/DELETE

### Règles importantes
- `getUser()` au démarrage — pas `getSession()` seul (retourne le cache même si compte supprimé)
- Si Supabase retourne `null` pour les préférences → `AsyncStorage.removeItem()` + reset `DEFAULT_PREFS` (évite stale cache d'un ancien compte)
- Suppression compte : `supabase.rpc('delete_user')` + `AsyncStorage.clear()` + `signOut`
- Session stockée via `AsyncStorageAdapter` (pas SecureStore — token dépasse 2048 bytes)
- Confirmation email désactivée dans Supabase Dashboard

---

## Données & cache

- Stratégie **cache-first** : AsyncStorage chargé en premier, puis sync Supabase en arrière-plan
- `PreferencesContext` : pattern draft pour l'onboarding → `updateDraft()` à chaque step, `completeOnboarding()` sauvegarde tout d'un coup dans `finish.tsx`
- IDs FridgeItem : `${Date.now()}-${Math.random().toString(36).slice(2)}` — jamais `Date.now()` seul (doublons si appels synchrones)

---

## État du projet (2026-03-16)

### ✅ Implémenté
- Auth (login/signup/logout/delete account)
- Onboarding 4 étapes + welcome + finish
- Dashboard avec suggestions IA + filtres mood
- Frigo avec catégories + scan code-barre
- Favoris
- Profil
- Préférences alimentaires injectées dans les suggestions Claude
- Pills "Filtré selon" sur le dashboard

### 🔜 Backlog (Linear)
- REC-6 : Skeleton loaders
- REC-7 : Error handling scan + modal
- REC-8 : Pull-to-refresh Dashboard
- REC-9 : Édition préférences depuis le Profil
- REC-10 : Liste de courses
- REC-13 : Paywall trial 3 jours (RevenueCat) — basse priorité

---

## Git

- **Un commit par feature ou bug fix** — ne pas laisser s'accumuler
- Format : `feat: ...` / `fix: ...` / `chore: ...`
- Ne jamais committer `.env` ni `.mcp.json` (dans `.gitignore`)
- Après chaque commit : `git push`
