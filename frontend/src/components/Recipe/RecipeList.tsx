"use client";

import { useEffect, useState } from "react";
import { Recipe } from "@/types/Recipe";
import RecipeCard from "@/components/Recipe/RecipeCard";

export default function RecipeList({}) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const response = await fetch("http://localhost:8080/api/recipe/");
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    }

    fetchRecipes();
  }, []);

  return (
    <div className="recipe-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
