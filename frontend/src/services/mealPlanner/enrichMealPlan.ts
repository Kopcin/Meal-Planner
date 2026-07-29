import { DayPlan, DayPlanViewModel } from "@/types/MealPlan";
import { Product } from "@/types/Product";
import { Recipe } from "@/types/Recipe";
import { calculateMealIngredients } from "./calculateMealIngredients";

export function enrichMealPlan(
  mealPlan: DayPlan[],
  recipes: Recipe[],
  products: Product[],
): DayPlanViewModel[] {
  const usedProducts = new Set<string>();

  return mealPlan.map((day) => ({
    ...day,
    mealSlots: day.mealSlots.map((meal) => {
      const recipe = recipes.find((recipe) => recipe.id === meal.recipeId);

      if (!recipe) {
        return {
          ...meal,
          availableIngredients: [],
          missingIngredients: [],
        };
      }

      const {
        availableIngredients,
        missingIngredients,
        missingUnassignedProducts,
      } = calculateMealIngredients(recipe, products, usedProducts);

      availableIngredients.forEach((ingredient) =>
        usedProducts.add(ingredient.name),
      );

      return {
        ...meal,
        recipeName: recipe.title,
        availableIngredients,
        missingIngredients: [
          ...missingIngredients,
          ...missingUnassignedProducts,
        ],
      };
    }),
  }));
}
