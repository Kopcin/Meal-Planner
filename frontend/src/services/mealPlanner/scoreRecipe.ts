import { Product } from "@/types/Product";
import { Recipe } from "@/types/Recipe";
import { getTime } from "@/utils/dateFormatter";
import { calculateMealIngredients } from "./calculateMealIngredients";

export function scoreRecipe(
  recipe: Recipe,
  products: Product[],
  usedProducts: Set<string>,
) {
  const {
    availableIngredients,
    missingIngredients,
    missingUnassignedProducts,
  } = calculateMealIngredients(recipe, products, usedProducts);

  let expirationScore = 0;

  availableIngredients.forEach((ingredient) => {
    if (!ingredient.expirationDate) {
      return;
    }

    const expirationTime = getTime(ingredient.expirationDate);

    const daysUntilExpiration = Math.floor(
      (expirationTime - Date.now()) / (1000 * 60 * 60 * 24),
    );

    expirationScore = Math.max(
      expirationScore,
      Math.max(0, 100 - daysUntilExpiration),
    );
  });

  const availableScore = availableIngredients.length * 10;

  const matchingScore =
    availableIngredients.length * 5 -
    (missingIngredients.length + missingUnassignedProducts.length) * 5;

  const score = availableIngredients.length === 0 ? 0 : 100 + expirationScore * 100 + availableScore + Math.max(0, matchingScore);

  return {
    score,
    availableIngredients,
    missingIngredients: [...missingIngredients, ...missingUnassignedProducts],
  };
}
