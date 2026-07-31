"use client";

import { Recipe } from "@/types/Recipe";
import styles from "./RecipePicker.module.css";
import { Product } from "@/types/Product";
import { useMemo } from "react";
import { calculateMealIngredients } from "@/services/mealPlanner/calculateMealIngredients";

type Props = {
  recipes: Recipe[];
  products: Product[];
};

export default function RecipePicker({ recipes, products }: Props) {
  const sortedRecipes = useMemo(() => {
    return recipes
      .map((recipe) => {
        const {
          availableIngredients,
          missingIngredients,
          missingUnassignedProducts,
        } = calculateMealIngredients(recipe, products, new Set());

        return {
          recipe,
          availableIngredients,
          missingIngredients: [
            ...missingIngredients,
            ...missingUnassignedProducts,
          ],
        };
      })
      .sort((a, b) => {
        if (b.availableIngredients.length !== a.availableIngredients.length) {
          return b.availableIngredients.length - a.availableIngredients.length;
        }

        return a.missingIngredients.length - b.missingIngredients.length;
      });
  }, [recipes, products]);

  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    recipeId: number,
  ) => {
    event.dataTransfer.setData("recipeId", recipeId.toString());
  };

  return (
    <div className={styles.picker}>
      <div className={styles.header}>
        <h2 className={styles.title}>Recipes</h2>

        <span className={styles.recipeCount}>{recipes.length} recipes</span>
      </div>

      <div className={styles.recipeList}>
        {sortedRecipes.map(
          ({ recipe, availableIngredients, missingIngredients }) => (
            <div
              key={recipe.id}
              className={styles.recipeCard}
              draggable
              onDragStart={(e) => handleDragStart(e, recipe.id)}
            >
              <div className={styles.recipeTitle}>{recipe.title}</div>

              <div className={styles.ingredients}>
                {availableIngredients.map((ingredient) => (
                  <div key={ingredient.name} className={styles.available}>
                    ✅ {ingredient.name}
                  </div>
                ))}

                {missingIngredients.map((ingredient) => (
                  <div key={ingredient} className={styles.missing}>
                    ❌ {ingredient}
                  </div>
                ))}
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
