export type RecipeIngredient = {
  name: string;
  available: boolean;
};

export type AIRecipe = {
  id: string;
  title: string;
  image: string;
  category: string;
  categoryColor: 'primary' | 'success' | 'warning' | 'error' | 'info';
  ingredients: RecipeIngredient[];
  time: number;
  calories: number;
  physicalState: string[];
  craving: string[];
};

export type RecipeStep = {
  action: string;
  duration?: string;
};

export type RecipeDetails = {
  servings: number;
  equipment: string[];
  steps: RecipeStep[];
};

export async function generateRecipeSteps(
  title: string,
  recipeIngredients: RecipeIngredient[],
  _fridgeItems: string[]
): Promise<RecipeDetails> {
  const apiKey = process.env.EXPO_PUBLIC_CLAUDE_API_KEY;

  const ingredientNames = recipeIngredients.map((i) => i.name).join(', ');

  const prompt = `Recette : "${title}"
Ingrédients : ${ingredientNames}
Basiques disponibles : sel, poivre, huile d'olive, eau, vinaigre

Génère les détails structurés de cette recette.

Règles IMPORTANTES :
- "equipment" : liste uniquement les ustensiles RÉELLEMENT utilisés (poêle, casserole, couteau, etc.). Ne pas lister la poêle/casserole si elles ne sont pas utilisées.
- "steps.action" : l'action culinaire PURE, sans mentionner la durée dans le texte (ex: "Faire revenir l'oignon jusqu'à ce qu'il soit translucide" — pas "pendant 2-3 min")
- "steps.duration" : la durée en string court si pertinente (ex: "2-3 min", "35 min"), null sinon
- 5 à 8 étapes dans l'ordre logique culinaire

Réponds UNIQUEMENT avec cet objet JSON :
{
  "servings": 2,
  "equipment": ["poêle", "couteau", "planche à découper"],
  "steps": [
    { "action": "...", "duration": "X min" },
    { "action": "...", "duration": null }
  ]
}`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 800,
      temperature: 0.2,
      system: "Tu es un chef cuisinier rigoureux. Tu génères des détails de recettes structurés en JSON. Tu n'inventes JAMAIS d'ingrédients. Les étapes sont des actions pures, la durée est séparée.",
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body?.error?.message ?? `Erreur API (${response.status})`);
  }

  const data = await response.json();
  const text: string = data.content[0].text;
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Format invalide');
  const parsed = JSON.parse(jsonMatch[0]);
  return {
    servings: parsed.servings ?? 2,
    equipment: parsed.equipment ?? [],
    steps: (parsed.steps ?? []).map((s: { action: string; duration?: string | null }) => ({
      action: s.action,
      duration: s.duration ?? undefined,
    })),
  };
}

export function filterRecipes(
  recipes: AIRecipe[],
  physicalState: string,
  craving: string
): AIRecipe[] {
  return recipes.filter(
    (r) => r.physicalState.includes(physicalState) && r.craving.includes(craving)
  );
}

export type RecipePreferences = {
  diet?: string[];
  allergies?: string[];
  cooking_level?: string;
  preferred_time?: string;
  goals?: string[];
  equipment?: string[];
};

export async function generateRecipeSuggestions(
  fridgeItems: string[],
  preferences?: RecipePreferences
): Promise<AIRecipe[]> {
  const apiKey = process.env.EXPO_PUBLIC_CLAUDE_API_KEY;

  const prefLines: string[] = [];
  if (preferences?.diet && preferences.diet.length > 0 && !preferences.diet.includes('omnivore')) {
    prefLines.push(`- Régime alimentaire : ${preferences.diet.join(', ')}`);
  }
  if (preferences?.allergies && preferences.allergies.length > 0) {
    prefLines.push(`- Allergies / intolérances : ${preferences.allergies.join(', ')} — AUCUNE recette ne doit contenir ces ingrédients`);
  }
  if (preferences?.cooking_level) {
    const levelMap: Record<string, string> = { beginner: 'débutant', intermediate: 'intermédiaire', advanced: 'avancé' };
    prefLines.push(`- Niveau de cuisine : ${levelMap[preferences.cooking_level] ?? preferences.cooking_level}`);
  }
  if (preferences?.preferred_time) {
    prefLines.push(`- Temps de préparation souhaité : ${preferences.preferred_time} minutes`);
  }
  if (preferences?.goals && preferences.goals.length > 0) {
    const goalLabels: Record<string, string> = {
      lose_weight: 'perte de poids', eat_healthy: 'alimentation saine',
      build_muscle: 'prise de masse musculaire', maintain: 'maintien en forme',
    };
    const goalStr = preferences.goals.map((g) => goalLabels[g] ?? g).join(', ');
    prefLines.push(`- Objectifs nutritionnels : ${goalStr}`);
  }
  if (preferences?.equipment !== undefined) {
    const equipmentLabels: Record<string, string> = {
      oven: 'four', microwave: 'micro-ondes', air_fryer: 'air fryer',
      blender: 'mixeur/blender', steamer: 'cuiseur vapeur', pressure_cooker: 'cocotte-minute',
    };
    const available = ['poêle', 'casserole', ...preferences.equipment.map((e) => equipmentLabels[e] ?? e)];
    prefLines.push(`- Équipement disponible : ${available.join(', ')} — ne propose QUE des recettes réalisables avec cet équipement`);
  }

  const prefSection = prefLines.length > 0
    ? `\n\nPréférences de l'utilisateur à respecter ABSOLUMENT :\n${prefLines.join('\n')}`
    : '';

  const prompt = `Tu es un chef cuisinier expert. L'utilisateur a ces ingrédients dans son frigo : ${fridgeItems.join(', ')}.
Les basiques toujours disponibles : sel, poivre, huile d'olive, eau, vinaigre.${prefSection}

Propose entre 5 et 8 vraies recettes cohérentes et savoureuses, en priorité celles qui utilisent un maximum d'ingrédients du frigo.
Tu peux aussi proposer des recettes qui nécessitent des ingrédients supplémentaires non disponibles — dans ce cas liste TOUS les ingrédients nécessaires à la recette, même ceux absents du frigo.

Règles :
- Chaque recette doit être une vraie recette qui existe et qui a du sens culinaire
- Les ingrédients doivent être ceux RÉELLEMENT nécessaires pour la recette (pas d'invention)
- Les temps et calories doivent être réalistes
- Variété : couvre différents profils (rapide, réconfortant, léger, épicé)

Réponds UNIQUEMENT avec un tableau JSON valide, sans texte avant ni après :
[
  {
    "title": "Nom de la recette",
    "category": "Type court (ex: Léger, Réconfortant, Rapide, Protéiné, Végé, Épicé, Gourmand)",
    "categoryColor": "un parmi: success, primary, warning, error, info",
    "ingredients": ["ingrédient1", "ingrédient2"],
    "time": 15,
    "calories": 400,
    "physicalState": ["fit", "post_sport"],
    "craving": ["quick", "light"]
  }
]

Valeurs possibles pour physicalState : fit, tired, post_sport, sleep
Valeurs possibles pour craving : quick, comforting, light, spicy
Chaque recette doit avoir au moins 1 valeur dans chaque tableau.

Règles STRICTES de cohérence état physique / temps de préparation :
- "tired" ne peut être assigné qu'aux recettes avec time ≤ 20 min (personne fatiguée = effort minimal)
- "sleep" ne peut être assigné qu'aux recettes avec time ≤ 15 min (avant de dormir = ultra rapide et léger)
- "post_sport" ne peut être assigné qu'aux recettes avec time ≤ 30 min (après sport = protéiné et rapide)
- "fit" peut être assigné à n'importe quelle recette (pas de contrainte de temps)
- Si une recette prend plus de 20 min, elle ne peut PAS avoir "tired" dans physicalState
- Si une recette prend plus de 30 min, elle ne peut PAS avoir "post_sport" dans physicalState`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1500,
      temperature: 0.2,
      system: "Tu es un chef cuisinier rigoureux. Tu proposes UNIQUEMENT des recettes réelles et connues. Tu n'inventes JAMAIS d'ingrédients qui ne sont pas dans la liste fournie. Si les ingrédients disponibles sont insuffisants pour une recette, tu ne la proposes pas.",
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const detail = body?.error?.message ?? JSON.stringify(body);
    throw new Error(`Erreur API (${response.status}): ${detail}`);
  }

  const data = await response.json();
  const text: string = data.content[0].text;

  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error('Format de réponse invalide');

  const recipes = JSON.parse(jsonMatch[0]);
  const fridgeLower = fridgeItems.map((i) => i.toLowerCase());
  const BASICS = ['sel', 'poivre', "huile d'olive", 'eau', 'vinaigre'];

  return recipes.map((r: Omit<AIRecipe, 'id' | 'image'> & { ingredients: string[] }, index: number) => {
    const time: number = r.time ?? 30;
    let physicalState: string[] = r.physicalState ?? [];
    if (time > 20) physicalState = physicalState.filter((s) => s !== 'tired');
    if (time > 15) physicalState = physicalState.filter((s) => s !== 'sleep');
    if (time > 30) physicalState = physicalState.filter((s) => s !== 'post_sport');
    if (physicalState.length === 0) physicalState = ['fit'];

    const ingredients: RecipeIngredient[] = (r.ingredients ?? []).map((name: string) => {
      const nameLower = name.toLowerCase();
      const available =
        BASICS.some((b) => nameLower.includes(b)) ||
        fridgeLower.some((f) => f.includes(nameLower) || nameLower.includes(f));
      return { name, available };
    });

    return {
      ...r,
      id: `ai-${Date.now()}-${index}`,
      image: '',
      physicalState,
      craving: r.craving ?? [],
      ingredients,
    };
  });
}
