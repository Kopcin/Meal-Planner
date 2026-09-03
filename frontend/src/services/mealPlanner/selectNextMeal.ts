import { MealViewModel } from "@/types/MealPlan";
import { Product } from "@/types/Product";
import { Recipe } from "@/types/Recipe";
import { calculateMealIngredients } from "./calculateMealIngredients";
import { scoreRecipe } from "./scoreRecipe";

export function selectNextMeal(
  mealPlan: Array<{ mealSlots: Array<{ recipeId: number }> }>,
  dayIndex: number,
  recipes: Recipe[],
  products: Product[],
): MealViewModel | null {
  const usedProducts = new Set<string>();
  const usedRecipes = new Set<string>();

  for (let currentDayIndex = 0; currentDayIndex <= dayIndex; currentDayIndex++) {
    const meals = mealPlan[currentDayIndex]?.mealSlots ?? [];

    for (const meal of meals) {
      const recipe = recipes.find((item) => item.id === meal.recipeId);

      if (!recipe) continue;

      const { availableIngredients } = calculateMealIngredients(
        recipe,
        products,
        usedProducts,
      );

      availableIngredients.forEach((ingredient) => {
        usedProducts.add(ingredient.name);
      });
      usedRecipes.add(recipe.title);
    }
  }

  const availableRecipes =
    usedRecipes.size === recipes.length
      ? recipes
      : recipes.filter((recipe) => !usedRecipes.has(recipe.title));

  let bestRecipe: Recipe | null = null;
  let bestScore = -Infinity;

  for (const recipe of availableRecipes) {
    const { score } = scoreRecipe(recipe, products, usedProducts);

    if (score > bestScore) {
      bestScore = score;
      bestRecipe = recipe;
    }
  }

  if (!bestRecipe) return null;

  return {
    label: "New Meal",
    recipeId: bestRecipe.id,
    recipeName: bestRecipe.title,
    availableIngredients: [],
    missingIngredients: [],
  };
}
