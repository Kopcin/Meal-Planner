"use client";

import { Recipe } from "@/types/Recipe";

type Props = {
  recipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
};

export default function RecipePicker({ recipes, onSelectRecipe }: Props) {
  return (
    <div>
      {recipes.map((recipe) => (
        <button key={recipe.id} onClick={() => onSelectRecipe(recipe)}>
          {recipe.title}
        </button>
      ))}
    </div>
  );
}
