import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Product } from "@/types/Product";
import { Recipe } from "@/types/Recipe";

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
        const token = Cookies.get("token");
        const headers = { Authorization: `Bearer ${token}` };
        const [productsResponse, recipesResponse] = await Promise.all([
          fetch("http://localhost:8080/api/product/", {
            headers,
            signal: controller.signal,
          }),
          fetch("http://localhost:8080/api/recipe/", {
            headers,
            signal: controller.signal,
          }),
        ]);

        if (!productsResponse.ok || !recipesResponse.ok) {
          throw new Error("Failed to load meal planner data");
        }

        const [productsData, recipesData] = await Promise.all([
          productsResponse.json(),
          recipesResponse.json(),
        ]);

        if (!Array.isArray(productsData) || !Array.isArray(recipesData)) {
          throw new Error("Meal planner data has an invalid format");
        }

        setProducts(productsData);
        setRecipes(recipesData);
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
