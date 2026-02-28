import { useMemo } from 'react';

interface Recipe {
  id: string;
  title: string;
  image: string;
  category: string;
  categoryColor?: 'primary' | 'success' | 'warning' | 'error' | 'info';
  ingredients: string[];
  time: number;
  calories: number;
  featured?: boolean;
  physicalState?: string[];
  craving?: string[];
}

export function useRecipeFilter(
  recipes: Recipe[],
  selectedPhysicalState: string,
  selectedCraving: string,
  ingredients: string[]
) {
  return useMemo(() => {
    return recipes.filter((recipe) => {
      // Filter by physical state
      if (recipe.physicalState && !recipe.physicalState.includes(selectedPhysicalState)) {
        return false;
      }

      // Filter by craving
      if (recipe.craving && !recipe.craving.includes(selectedCraving)) {
        return false;
      }

      // Filter by ingredients (if any are selected)
      if (ingredients.length > 0) {
        const hasAllIngredients = ingredients.every((ing) =>
          recipe.ingredients.some((recIng) => recIng.toLowerCase().includes(ing.toLowerCase()))
        );
        if (!hasAllIngredients) {
          return false;
        }
      }

      return true;
    });
  }, [recipes, selectedPhysicalState, selectedCraving, ingredients]);
}
