"use client";

import { Recipe } from "@/types/Recipe";
import { Product } from "@/types/Product";
import styles from "./RecipeCard.module.css";
import Image from "next/image";

type RecipeCardProps = {
  recipe: Recipe;
  onClick?: () => void;
  isSelected?: boolean;

  availableIngredients?: Product[];
  missingIngredients?: string[];

  draggable?: boolean;
  onDragStart?: (event: React.DragEvent<HTMLDivElement>) => void;

  variant?: "default" | "picker";
};

export default function RecipeCard({
  recipe,
  onClick,
  isSelected,
  availableIngredients,
  missingIngredients,
  draggable,
  onDragStart,
  variant = "default",
}: RecipeCardProps) {
  const image = recipe.image || "/images/placeholderImg150x200.png";

  const isPicker = variant === "picker";

  const showAvailability =
    availableIngredients !== undefined || missingIngredients !== undefined;

  return (
    <div
      className={`${styles.recipeCard} ${
        isPicker ? styles.pickerCard : ""
      } ${isSelected ? styles.selected : ""}`}
      onClick={onClick}
      draggable={draggable}
      onDragStart={onDragStart}
    >
      {recipe.image && (
        <div className={styles.imageWrapper}>
          <Image
            src={image}
            alt={recipe.title}
            width={150}
            height={200}
            sizes="(max-width: 768px) 100vw, 25vw"
            priority
            className={styles.image}
          />
        </div>
      )}
      <div className={styles.content}>
        <h2 className={styles.recipeTitle}>{recipe.title}</h2>

        {!isPicker && (
          <p className={styles.description}>{recipe.description}</p>
        )}

        {showAvailability ? (
          <div className={styles.ingredients}>
            {!isPicker && (
              <h3 className={styles.ingredientsTitle}>Ingredients:</h3>
            )}

            {availableIngredients?.map((ingredient) => (
              <div key={ingredient.name} className={styles.available}>
                ✅ {ingredient.name}
              </div>
            ))}

            {missingIngredients?.map((ingredient) => (
              <div key={ingredient} className={styles.missing}>
                ❌ {ingredient}
              </div>
            ))}
          </div>
        ) : (
          !isPicker && (
          <>
            <div className={styles.ingredientsSection}>
              <h3 className={styles.ingredientsTitle}>Ingredients:</h3>

              <ul className={styles.ingredientsList}>
                {recipe.databaseProducts?.map((product, index) => (
                  <li key={product.id || index}>
                    {product.name} (ID: {product.id})
                  </li>
                )) || <li>No products in database.</li>}
              </ul>
            </div>

            <div className={styles.ingredientsSection}>
              <ul className={styles.ingredientsList}>
                {recipe.unassignedProducts?.map((productName, index) => (
                  <li key={index}>{productName}</li>
                )) || <li>No new products to assign.</li>}
              </ul>
            </div>
          </>
          )
        )}
      </div>
    </div>
  );
}
