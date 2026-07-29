import { DayPlan, Meal } from "@/types/MealPlan";
import { Product } from "@/types/Product";
import { Recipe } from "@/types/Recipe";
import { getTime } from "@/utils/dateFormatter";
import { logInBrowser } from "@/utils/logger";
import { calculateMealIngredients } from "./calculateMealIngredients";

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

        const {
          availableIngredients,
          missingIngredients,
          missingUnassignedProducts,
        } = calculateMealIngredients(recipe, sortedProducts, usedProducts);

        logInBrowser(
          `Day: ${i + 1}, Meal: ${mealType}, Checking recipe: ${recipe.title}`,
        );
        logInBrowser("Available ingredients:", availableIngredients);
        logInBrowser(
          "Missing ingredients:",
          missingIngredients,
          missingUnassignedProducts,
        );

        let expirationScore = 0;

        availableIngredients.forEach((ingredient) => {
          const expirationTime = getTime(ingredient.expirationDate);
          const daysUntilExpiration = Math.floor(
            (expirationTime - Date.now()) / (1000 * 60 * 60 * 24),
          ); // ms -> days

          // if (daysUntilExpiration <= 0) expirationScore += 100;
          // else if (daysUntilExpiration <= 3) expirationScore += 30;
          // else if (daysUntilExpiration <= 7) expirationScore += 15;
          // else expirationScore += 5;
          expirationScore += Math.max(0, -daysUntilExpiration + 100);

          logInBrowser(
            `Ingredient: ${ingredient.name}, Expiration in: ${daysUntilExpiration} days, Score contribution: ${expirationScore}`,
          );
        });

        // Matching score based on available and missing ingredients
        let matchingScore =
          availableIngredients.length * 5 -
          (missingIngredients.length + missingUnassignedProducts.length) * 5;
        if (matchingScore < 0) matchingScore = 0;

        const totalScore = expirationScore + matchingScore;

        logInBrowser(
          `Recipe: ${recipe.title}, expScore: ${expirationScore}, matchScore: ${matchingScore}, Score: ${totalScore}`,
        );

        if (totalScore > bestScore) {
          bestScore = totalScore;
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
