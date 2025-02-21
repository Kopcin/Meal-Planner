"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { Product } from "@/types/Product";
import { Recipe } from "@/types/Recipe";
import { formatExpirationDateString, getTime } from "@/utils/dateFormatter";
import styles from "./mealPlannerPage.module.css";

// Offline mode handling:
// You can use browser storage (e.g., localStorage)
// to allow the app to work without an internet connection.

// TODO: Group meals into categories like lunches, desserts, etc.

function generateMealPlan(products: Product[], recipes: Recipe[]) {
  const filteredProducts = products.filter(p => p.expirationDate && getTime(p.expirationDate));
  const sortedProducts = filteredProducts.sort((a, b) => getTime(a.expirationDate) - getTime(b.expirationDate));

  console.log("Sorted products by expiration date:", sortedProducts);

  const mealPlan = [];
  const usedProducts = new Set<string>();
  let usedRecipes = new Set<string>();
  const currentTime = Date.now();
  let randomStartIndex = Math.floor(Math.random() * recipes.length);

  // Logic to generate a meal plan for 7 days based on recipes and available products.
  for (let i = 0; i < 7; i++) {
    if (usedRecipes.size === recipes.length) usedRecipes.clear();

    let bestRecipe = null;
    let bestScore = -Infinity;

    // for (const recipe of recipes) {
    for (let j = 0; j < recipes.length; j++) {
      const recipe = recipes[(randomStartIndex + j) % recipes.length];

      if (usedRecipes.has(recipe.title)) continue;

      const availableProducts = sortedProducts.filter(p => !usedProducts.has(p.name)).map((p) => p.name);
      const availableIngredients = recipe.databaseProducts.filter(dbProduct => availableProducts.includes(dbProduct.name));
      const missingIngredients = recipe.databaseProducts.filter(dbProduct => !availableProducts.includes(dbProduct.name)).map((dbProduct) => dbProduct.name);
      const missingUnassignedProducts = recipe.unassignedProducts.filter(productName => !availableProducts.includes(productName));

      console.log(`Checking recipe: ${recipe.title}`);
      console.log("Available ingredients:", availableIngredients);
      console.log("Missing ingredients:", missingIngredients, missingUnassignedProducts);

      let expirationScore = 0;
      for (const ing of availableIngredients) {
        const expirationTime = getTime(ing.expirationDate);
        const daysUntilExpiration = Math.floor((expirationTime - currentTime) / (1000 * 60 * 60 * 24)); // ms -> days

        if (daysUntilExpiration <= 0) expirationScore += 50;
        else if (daysUntilExpiration <= 3) expirationScore += 30;
        else if (daysUntilExpiration <= 7) expirationScore += 15;
        else expirationScore += 5;

        console.log(`Ingredient: ${ing.name}, Expiration in: ${daysUntilExpiration} days, Score contribution: ${expirationScore}`);
      }

      const numAvailable = availableIngredients.length;
      const numMissing = missingIngredients.length + missingUnassignedProducts.length;
      let matchingScore = (numAvailable * 10) - (numMissing * 5);
      if (matchingScore < 0) matchingScore = 0;

      const totalScore = expirationScore + matchingScore;

      console.log(`Recipe: ${recipe.title}, expScore: ${expirationScore}, matchScore: ${matchingScore}, Score: ${totalScore}`);

      if (totalScore > bestScore) {
        bestScore = totalScore;
        bestRecipe = {
          recipe: recipe.title,
          availableIngredients,
          missingIngredients: [...missingIngredients, ...missingUnassignedProducts],
        };
      }
    }

    if (bestRecipe) {
      mealPlan.push({
        day: `Day ${i + 1}`,
        ...bestRecipe,
      });

      usedRecipes.add(bestRecipe.recipe);
      bestRecipe.availableIngredients.forEach(ing => usedProducts.add(ing.name));
    }

    randomStartIndex = (randomStartIndex + 1) % recipes.length;
  }

  return mealPlan;
}

export default function MealPlanPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [mealPlan, setMealPlan] = useState<
    {
      day: string;
      recipe: string;
      availableIngredients: Product[];
      missingIngredients: string[];
    }[]
  >([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const productsResponse = await fetch(
          "http://localhost:8080/api/product/"
        );
        const recipesResponse = await fetch(
          "http://localhost:8080/api/recipe/"
        );
        const productsData: Product[] = await productsResponse.json();
        const recipesData: Recipe[] = await recipesResponse.json();

        setProducts(productsData);
        setRecipes(recipesData);

        const plan = generateMealPlan(productsData, recipesData);
        setMealPlan(plan);
      } catch (error) {
        // add distinct error handling
        console.error("Error fetching products:", error);
        console.error("Error fetching recipes:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      <Navbar />

      <h1>Meal Plan</h1>
      {mealPlan.length > 0 ? (
        <ul>
          {mealPlan.map((meal, index) => (
            <li key={index}>
              <h2>{meal.day}</h2>
              <p>Recipe: {meal.recipe}</p>

              {/* Available Ingredients */}
              <p>
                Available Ingredients:{" "}
                {meal.availableIngredients.length > 0 ? (
                  <span className={styles.available}>
                    {meal.availableIngredients.map((product, idx) => (
                      <span key={idx}>
                        {product.name}(Expires:{" "}
                        {formatExpirationDateString(product.expirationDate)})
                        {idx < meal.availableIngredients.length - 1 && ", "}
                      </span>
                    ))}
                  </span>
                ) : (
                  "None"
                )}
              </p>

              {/* Missing Ingredients */}
              <p>
                Missing Ingredients:{" "}
                {meal.missingIngredients.length > 0 ? (
                  <span className={styles.missing}>
                    {meal.missingIngredients.join(", ")}
                  </span>
                ) : (
                  "None"
                )}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
