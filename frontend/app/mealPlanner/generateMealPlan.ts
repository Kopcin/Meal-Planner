import { Product } from "@/types/Product";
import { Recipe } from "@/types/Recipe";
import { getTime } from "@/utils/dateFormatter";

export const mealTemplates = {
  standard: {
    Monday: ["Breakfast", "Lunch", "Dinner"],
    Tuesday: ["Breakfast", "Snack", "Lunch", "Dinner"],
    Wednesday: ["Brunch", "Dinner"],
    Thursday: ["Breakfast", "Lunch", "Dinner"],
    Friday: ["Breakfast", "Snack", "Lunch", "Dinner"],
    Saturday: ["Brunch", "Dinner"],
    Sunday: ["Breakfast", "Lunch", "Dinner"],
  },
  intermittentFasting: {
    Monday: ["Lunch", "Dinner"],
    Tuesday: ["Lunch", "Dinner"],
    Wednesday: ["Lunch", "Dinner"],
    Thursday: ["Lunch", "Dinner"],
    Friday: ["Lunch", "Dinner"],
    Saturday: ["Brunch", "Dinner"],
    Sunday: ["Brunch", "Dinner"],
  },
};

type Meal = {
  type: string;
  recipe: string;
  availableIngredients: Product[];
  missingIngredients: string[];
};

export type DayPlan = {
  day: string;
  meals: Meal[];
};

export function generateMealPlan(
  products: Product[],
  recipes: Recipe[],
  templateType: keyof typeof mealTemplates = "standard"
) {
  const template = mealTemplates[templateType] || mealTemplates.standard;
  const mealPlan: DayPlan[] = [];
  let usedRecipes = new Set();
  let usedProducts = new Set();
  let randomStartIndex = Math.floor(Math.random() * recipes.length);

  const sortedProducts = products
    .filter(p => p.expirationDate)
    .sort((a, b) => getTime(a.expirationDate) - getTime(b.expirationDate));

  console.log("Sorted products by expiration date:", sortedProducts);

  for (const [day, mealTypes] of Object.entries(template)) {
    const dayPlan: DayPlan = { day, meals: [] };

    for (const mealType of mealTypes) {
      if (usedRecipes.size === recipes.length) usedRecipes.clear();

      let bestRecipe = null;
      let bestScore = -Infinity;

      // Evaluate each recipe
      // for (const recipe of recipes) {
      for (let j = 0; j < recipes.length; j++) {
        const recipe = recipes[(randomStartIndex + j) % recipes.length];
        if (usedRecipes.has(recipe.title)) continue;

        const availableIngredients = sortedProducts.filter(p => recipe.databaseProducts.some(dbP => dbP.name === p.name) && !usedProducts.has(p.name));
        const missingIngredients = recipe.databaseProducts.filter(dbP => !availableIngredients.some(p => p.name === dbP.name)).map(p => p.name);
        const missingUnassignedProducts = recipe.unassignedProducts.filter(productName => !availableIngredients.some(p => p.name === productName));

        console.log(`Day: ${day}, Meal: ${mealType}, Checking recipe: ${recipe.title}`);
        console.log("Available ingredients:", availableIngredients);
        console.log("Missing ingredients:", missingIngredients, missingUnassignedProducts);

        let expirationScore = 0;
        availableIngredients.forEach(ing => {
          const expirationTime = getTime(ing.expirationDate);
          const daysUntilExpiration = Math.floor((expirationTime - Date.now()) / (1000 * 60 * 60 * 24)); // ms -> days

          // if (daysUntilExpiration <= 0) expirationScore += 100;
          // else if (daysUntilExpiration <= 3) expirationScore += 30;
          // else if (daysUntilExpiration <= 7) expirationScore += 15;
          // else expirationScore += 5;
          expirationScore += Math.max(0, -daysUntilExpiration + 100);

          console.log(`Ingredient: ${ing.name}, Expiration in: ${daysUntilExpiration} days, Score contribution: ${expirationScore}`);
        });

        // Matching score based on available and missing ingredients
        let matchingScore = availableIngredients.length * 5 - (missingIngredients.length + missingUnassignedProducts.length) * 5;
        if (matchingScore < 0) matchingScore = 0;

        const totalScore = expirationScore + matchingScore;

        console.log(`Recipe: ${recipe.title}, expScore: ${expirationScore}, matchScore: ${matchingScore}, Score: ${totalScore}`);

        if (totalScore > bestScore) {
          bestScore = totalScore;
          bestRecipe = {
            type: mealType,
            recipe: recipe.title,
            availableIngredients,
            missingIngredients: [...missingIngredients, ...missingUnassignedProducts],
          };
        }
      }

      if (bestRecipe) {
        dayPlan.meals.push(bestRecipe);
        usedRecipes.add(bestRecipe.recipe);

        bestRecipe.availableIngredients.forEach(ingredient => usedProducts.add(ingredient.name));
      }
    }

    mealPlan.push(dayPlan);
    randomStartIndex = (randomStartIndex + 1) % recipes.length;
  }

  return mealPlan;
}
