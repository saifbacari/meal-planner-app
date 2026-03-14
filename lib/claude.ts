export type AIRecipe = {
  id: string;
  title: string;
  image: string;
  category: string;
  categoryColor: 'primary' | 'success' | 'warning' | 'error' | 'info';
  ingredients: string[];
  time: number;
  calories: number;
  physicalState: string[];
  craving: string[];
};

export function filterRecipes(
  recipes: AIRecipe[],
  physicalState: string,
  craving: string
): AIRecipe[] {
  return recipes.filter(
    (r) => r.physicalState.includes(physicalState) && r.craving.includes(craving)
  );
}

export async function generateRecipeSuggestions(
  fridgeItems: string[]
): Promise<AIRecipe[]> {
  const apiKey = process.env.EXPO_PUBLIC_CLAUDE_API_KEY;

  const prompt = `Tu es un chef cuisinier. L'utilisateur a ces ingrédients disponibles : ${fridgeItems.join(', ')}.

Propose 8 recettes variées réalisables principalement avec ces ingrédients (sel, poivre, huile considérés disponibles).
Les recettes doivent couvrir différents profils : rapides, réconfortantes, légères, épicées, adaptées à différentes formes physiques.

Réponds UNIQUEMENT avec un tableau JSON valide, sans texte avant ni après :
[
  {
    "title": "Nom de la recette",
    "category": "Type court (ex: Léger, Réconfortant, Rapide, Protéiné, Végé, Épicé, Gourmand)",
    "categoryColor": "un parmi: success, primary, warning, error, info",
    "ingredients": ["ingrédient1", "ingrédient2", "ingrédient3"],
    "time": 15,
    "calories": 400,
    "physicalState": ["fit", "post_sport"],
    "craving": ["quick", "light"]
  }
]

Valeurs possibles pour physicalState : fit, tired, post_sport, sleep
Valeurs possibles pour craving : quick, comforting, light, spicy
Chaque recette doit avoir au moins 1 valeur dans chaque tableau.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1200,
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
  return recipes.map((r: Omit<AIRecipe, 'id' | 'image'>, index: number) => ({
    ...r,
    id: `ai-${Date.now()}-${index}`,
    image: '',
    physicalState: r.physicalState ?? [],
    craving: r.craving ?? [],
  }));
}
