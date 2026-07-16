import { DayPlan } from "@/types/MealPlan";
import { Product } from "@/types/Product";
import { Recipe } from "@/types/Recipe";
import { calculateMealIngredients } from "./calculateMealIngredients";
import { getTime } from "@/utils/dateFormatter";

export function enrichMealPlan(
  dayPlans: DayPlan[],
  recipes: Recipe[],
  products: Product[],
): DayPlan[] {
  const sortedProducts = products
    .filter((p) => p.expirationDate)
    .sort((a, b) => getTime(a.expirationDate) - getTime(b.expirationDate));

    const usedProducts = new Set<string>();

  return dayPlans.map((day) => ({
    ...day,
    mealSlots: day.mealSlots.map((meal) => {
      const recipe = recipes.find((recipe) => recipe.id === meal.recipeId);

      if (!recipe) {
        return meal;
      }

      const {
        availableIngredients,
        missingIngredients,
        missingUnassignedProducts,
      } = calculateMealIngredients(recipe, sortedProducts, usedProducts);

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
