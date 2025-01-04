"use client";

import { Recipe } from "@/types/Recipe";
import Image from "next/image";

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
  isSelected?: boolean;
}

export default function RecipeCard({
  recipe,
  onClick,
  isSelected,
}: RecipeCardProps) {
  const image = recipe.image || "/images/placeholderImg150x200.png";

  return (
    <div
      className={`recipe-card border rounded-lg shadow-md overflow-hidden bg-white dark:bg-gray-800 ${
        isSelected ? "border-blue-500 scale-105 z-10" : ""
      }`}
      onClick={onClick}
      style={{
        cursor: onClick ? "pointer" : "default",
        transition: "transform 0.2s ease-in-out",
      }}
    >
      {recipe.image && (
      <div className="image-wrapper">
        <Image
          src={image}
          alt={recipe.title}
          width={150}
          height={200}
          layout="responsive"
          objectFit="cover"
          priority
          className="rounded-t-lg"
        />
      </div>
      )}
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          {recipe.title}
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          {recipe.description}
        </p>

        <div className="mb-4">
          <h3 className="text-md font-semibold text-gray-800 dark:text-white">
            Ingredients:
          </h3>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
            {recipe.databaseProducts?.map((product, index) => (
              <li key={product.id || index}>
                {product.name} (ID: {product.id})
              </li>
            )) || <li>No products in database.</li>}
          </ul>
        </div>

        <div className="mb-4">
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
            {recipe.unassignedProducts?.map((productName, index) => (
              <li key={index}>{productName}</li>
            )) || <li>Brak nowych produktów do przypisania.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
