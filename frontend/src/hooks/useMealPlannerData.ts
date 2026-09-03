import { useEffect, useState } from "react";
import { Product } from "@/types/Product";
import { Recipe } from "@/types/Recipe";
import { apiRequest } from "@/services/apiClient";

type MealPlannerData = {
  products: Product[];
  recipes: Recipe[];
  isLoading: boolean;
  error: string | null;
};

export function useMealPlannerData(): MealPlannerData {
  const [products, setProducts] = useState<Product[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadData() {
      try {
        const [productsResponse, recipesResponse] = await Promise.all([
          apiRequest<Product[]>("/product/", {
            signal: controller.signal,
          }),
          apiRequest<Recipe[]>("/recipe/", {
            signal: controller.signal,
          }),
        ]);

        if (!Array.isArray(productsResponse) || !Array.isArray(recipesResponse)) {
          throw new Error("Meal planner data has an invalid format");
        }

        setProducts(productsResponse);
        setRecipes(recipesResponse);
      } catch (loadError) {
        if (loadError instanceof DOMException && loadError.name === "AbortError") {
          return;
        }

        setError(loadError instanceof Error ? loadError.message : "Failed to load data");
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    loadData();
    return () => controller.abort();
  }, []);

  return { products, recipes, isLoading, error };
}
