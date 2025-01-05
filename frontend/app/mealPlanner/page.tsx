"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { Product } from "@/types/Product";
import { Recipe } from "@/types/Recipe";
import { formatExpirationDateString, getTime } from "@/utils/dateFormatter";
import styles from "./mealPlannerPage.module.css";

// obsługa w trybie offline:
// Można użyć przeglądarkowego magazynu danych (np. localStorage),
// aby aplikacja działała bez połączenia z internetem.

// TODO: podzieł na grupy posiłków: obiady, desery itp.

function generateMealPlan(products: Product[], recipes: Recipe[]) {
  const sortedProducts = products.sort((a, b) => {
    const timeA = getTime(a.expirationDate);
    const timeB = getTime(b.expirationDate);

    return timeA - timeB;
  });

  const mealPlan = [];

  // Logic to generate a meal plan for 7 days based on recipes and available products.
  for (let i = 0; i < 7; i++) {
    const recipe = recipes[i % recipes.length]; // Cycle through recipes.
    const availableProducts = sortedProducts.map((product) => product.name);

    // Check which products are available in the stock
    const availableDatabaseProducts = recipe.databaseProducts.filter(
      (dbProduct) => availableProducts.includes(dbProduct.name)
    );

    // Missing ingredients are those that are in databaseProducts but not in stock
    const missingDatabaseProducts = recipe.databaseProducts
      .filter((dbProduct) => !availableProducts.includes(dbProduct.name))
      .map((dbProduct) => dbProduct.name);

   // Missing products from unassignedProducts
    const missingUnassignedProducts = recipe.unassignedProducts.filter(
      (productName) => !availableProducts.includes(productName)
    );

    // Prioritize the ingredients that are closest to expiration
    const sortedAvailableDatabaseProducts = availableDatabaseProducts.sort(
      (a, b) => {
        const timeA = getTime(a.expirationDate);
        const timeB = getTime(b.expirationDate);
        return timeA - timeB;
      }
    );

    mealPlan.push({
      day: `Day ${i + 1}`,
      recipe: recipe.title,
      availableIngredients: sortedAvailableDatabaseProducts,
      missingIngredients: [
        ...missingDatabaseProducts,
        ...missingUnassignedProducts,
      ],
    });
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
