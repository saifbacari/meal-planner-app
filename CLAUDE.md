# CLAUDE.md — Recettes Maison

Instructions persistantes pour Claude Code sur ce projet.

---

## Projet

App React Native (Expo) de suggestions de recettes IA. L'utilisateur renseigne son frigo, Claude génère des recettes adaptées à son état physique et ses préférences alimentaires.

**Stack** : Expo SDK ~54 · Expo Router v3 · Supabase · Claude API · AsyncStorage

---

## Commandes essentielles

```bash
npx expo start -c          # Démarrer avec cache vidé (toujours utiliser -c en cas de doute)
npx expo install <pkg>     # TOUJOURS utiliser ça (pas npm install) pour la compatibilité SDK
```

---

## Règles de code

### Packages
- **Toujours** `npx expo install` pour les packages React Native / Expo — jamais `npm install` directement
- Ne pas réinstaller `expo-secure-store` pour la session Supabase — remplacé par AsyncStorage (token > 2048 bytes)

### Design system
- Fichier : `constants/theme.ts`
- Toujours utiliser `Colors.dark.*` pour les écrans (app full dark theme)
- Couleur primaire : `#13ec5b` (`ColorPalette.primary`)
- Ne jamais coder des couleurs en dur — utiliser les tokens du thème (`Spacing`, `Radius`, `FontSize`, `FontWeight`)

### TypeScript
- Pas de `any` sauf cas exceptionnel justifié
- Les types partagés vivent dans le fichier qui les définit (ex: `AIRecipe` dans `lib/claude.ts`)

---

## Architecture navigation (CRITIQUE)

### Ne jamais faire
```typescript
// ❌ router.replace() dans un useEffect au montage d'un layout
useEffect(() => { router.replace('/somewhere'); }, []);
```

### Patterns corrects
- Logique de routing initial → `app/index.tsx` avec composant `<Redirect>`
- Après signIn/signUp → `router.replace('/')` → `app/index.tsx` prend le relais
- Après signOut → `router.replace('/auth/login')` directement depuis `profile.tsx`
- Pas de `unstable_settings` avec `anchor` — casse la navigation

### Structure des screens (`app/_layout.tsx`)
`index` · `(tabs)` · `auth` · `onboarding` · `modal`

---

## Contextes disponibles

| Contexte | Hook | Données |
|---|---|---|
| `AuthContext` | `useAuth()` | `user`, `signIn`, `signUp`, `signOut`, `deleteAccount` |
| `FridgeContext` | `useFridge()` | `items`, `addItem`, `removeItem`, `clearFridge` |
| `FavoritesContext` | `useFavorites()` | `favorites`, `isFavorited`, `toggleFavorite` |
| `PreferencesContext` | `usePreferences()` | `preferences`, `draft`, `updateDraft`, `savePreferences`, `completeOnboarding` |

---

## IA / Claude API

- **Modèle** : `claude-haiku-4-5-20251001`
- **Temperature** : `0.2` (réduit les hallucinations)
- **Fonctions** : `generateRecipeSuggestions(fridgeItems, preferences?)` · `generateRecipeSteps(title, ingredients, fridgeItems)` · `filterRecipes(recipes, physicalState, craving)`
- 1 appel API par changement de frigo ou de préférences — pas par sélection de mood
- Filtrage physicalState/craving fait **localement** sur les recettes déjà générées
- Contraintes temps obligatoires : `tired` ≤ 20min · `sleep` ≤ 15min · `post_sport` ≤ 30min

### IDs importants (onboarding → préférences)
**Objectifs** : `lose_weight` · `eat_healthy` · `build_muscle` · `maintain`
**Régimes** : `omnivore` · `vegetarian` · `vegan` · `pescatarian` · `halal` · `kosher` · `no_pork`
**Allergies** : `gluten` · `lactose` · `nuts` · `seafood` · `eggs` · `soy` · `peanuts`

---

## Données & cache

- Stratégie **cache-first** : AsyncStorage chargé en premier, puis sync Supabase
- `PreferencesContext` : pattern draft pour l'onboarding → `updateDraft()` à chaque step, `completeOnboarding()` sauvegarde tout
- Si Supabase retourne `null` pour les préférences → reset du cache AsyncStorage (évite le stale cache d'un ancien compte)
- `FridgeContext.addItem` : toujours forme fonctionnelle `setItems(prev => ...)` pour éviter le stale closure

---

## Auth

- `getUser()` au démarrage (pas `getSession()` seul — retourne le cache même si compte supprimé)
- Confirmation email désactivée dans Supabase (Authentication → Providers → Email)
- Suppression compte : `supabase.rpc('delete_user')` + `AsyncStorage.clear()` + `signOut`

---

## Git

- **Un commit par feature ou bug fix** — ne pas laisser s'accumuler
- Format : `feat: ...` / `fix: ...` / `chore: ...`
- Ne jamais committer `.env` ni `.mcp.json` (déjà dans `.gitignore`)
- Repo : `github.com/saifbacari/meal-planner-app`
