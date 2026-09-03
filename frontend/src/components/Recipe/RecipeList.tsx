"use client";

import { useEffect, useState } from "react";
import { Recipe } from "@/types/Recipe";
import RecipeCard from "@/components/Recipe/RecipeCard";
import { apiRequest } from "@/services/apiClient";
import styles from "./RecipeList.module.css";

export default function RecipeList() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchRecipes() {
      try {
        const data = await apiRequest<Recipe[]>("/recipe/", {
          signal: controller.signal,
        });
        if (!Array.isArray(data)) throw new Error("Invalid recipes response");
        setRecipes(data);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setError(error instanceof Error ? error.message : "Failed to load recipes");
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    fetchRecipes();
    return () => controller.abort();
  }, []);

  if (isLoading) return <p className={styles.message}>Loading recipes...</p>;
  if (error) return <p className={styles.error}>Failed to load recipes: {error}</p>;

  return (
    <div className={styles.list}>
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
        //   onClick={() => onProductClick(product.id)}
        />
      ))}
    </div>
  );
}
