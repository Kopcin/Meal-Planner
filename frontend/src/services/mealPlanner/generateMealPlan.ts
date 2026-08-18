import { DayPlan, Meal } from "@/types/MealPlan";
import { Product } from "@/types/Product";
import { Recipe } from "@/types/Recipe";
import { getTime } from "@/utils/dateFormatter";
import { logInBrowser } from "@/utils/logger";
import { calculateMealIngredients } from "./calculateMealIngredients";
import { scoreRecipe } from "./scoreRecipe";

export const mealTemplates = {
  default: {
    allowedMeals: ["Breakfast", "Lunch", "Dinner", "Snack"],
  },
} as const;

export function generateMealPlan(
  products: Product[],
  recipes: Recipe[],
  numDays: number = 7,
  mealsPerDay: number = 3,
  startDate: string = new Date().toISOString().split("T")[0],
): DayPlan[] {
  const template = mealTemplates.default;
  const mealsForDay = template.allowedMeals.slice(0, mealsPerDay);
  const mealPlan: DayPlan[] = [];

  const usedRecipes = new Set<string>();
  const usedProducts = new Set<string>();
  let randomStartIndex = Math.floor(Math.random() * recipes.length);

  const sortedProducts = products
    .filter((p) => p.expirationDate)
    .sort((a, b) => getTime(a.expirationDate) - getTime(b.expirationDate));

  // const sortedProducts = [...products].sort((a, b) => {
  //   if (!a.expirationDate && !b.expirationDate) return 0;
  //   if (!a.expirationDate) return 1;
  //   if (!b.expirationDate) return 1;

  //   return getTime(a.expirationDate) - getTime(b.expirationDate);
  // });

  logInBrowser("Sorted products by expiration date:", sortedProducts);

  for (let i = 0; i < numDays; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    const dayPlan: DayPlan = {
      date: date.toISOString().split("T")[0],
      mealSlots: [],
    };

    for (const mealType of mealsForDay) {
      if (usedRecipes.size === recipes.length) usedRecipes.clear();

      let bestRecipe: Meal | null = null;
      let bestScore = -Infinity;

      // Evaluate each recipe
      // for (const recipe of recipes) {
      for (let j = 0; j < recipes.length; j++) {
        const recipe = recipes[(randomStartIndex + j) % recipes.length];

        if (usedRecipes.has(recipe.title)) continue;

        const { score, availableIngredients, missingIngredients } = scoreRecipe(
          recipe,
          sortedProducts,
          usedProducts,
        );

        logInBrowser(
          `Day: ${i + 1}, Meal: ${mealType}, Checking recipe: ${recipe.title}`,
        );
        logInBrowser("Available ingredients:", availableIngredients);
        logInBrowser("Missing ingredients:", missingIngredients);
        logInBrowser(`Recipe score: ${score}`);

        if (score > bestScore) {
          bestScore = score;

          bestRecipe = {
            label: mealType,
            recipeName: recipe.title,
            recipeId: recipe.id,
          };
        }
      }

      if (bestRecipe) {
        dayPlan.mealSlots.push(bestRecipe);
        usedRecipes.add(bestRecipe.recipeName);

        const recipe = recipes.find((r) => r.id === bestRecipe!.recipeId);

        if (recipe) {
          const { availableIngredients } = calculateMealIngredients(
            recipe,
            sortedProducts,
            usedProducts,
          );

          availableIngredients.forEach((ingredient) =>
            usedProducts.add(ingredient.name),
          );
        }
      }
    }

    mealPlan.push(dayPlan);
    randomStartIndex = (randomStartIndex + 1) % recipes.length;
  }

  return mealPlan;
}
