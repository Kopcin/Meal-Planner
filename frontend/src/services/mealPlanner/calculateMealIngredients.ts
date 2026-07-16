import { Product } from "@/types/Product";
import { Recipe } from "@/types/Recipe";

export function calculateMealIngredients(
  recipe: Recipe,
  products: Product[],
  usedProducts: Set<string> = new Set<string>(),
) {
  const availableIngredients = products.filter(
    (product) =>
      !usedProducts.has(product.name) &&
      recipe.databaseProducts.some(
        (dbProduct) => dbProduct.name === product.name,
      ),
  );

  const missingIngredients = recipe.databaseProducts
    .filter(
      (dbProduct) =>
        !availableIngredients.some(
          (product) => product.name === dbProduct.name,
        ),
    )
    .map((product) => product.name);

  const missingUnassignedProducts = recipe.unassignedProducts.filter(
    (productName) =>
      !availableIngredients.some((product) => product.name === productName),
  );

  return {
    availableIngredients,
    missingIngredients,
    missingUnassignedProducts,
  };
}
