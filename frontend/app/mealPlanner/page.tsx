"use client";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { Product } from "@/types/Product";
import { Recipe } from "@/types/Recipe";
import { formatExpirationDateString } from "@/utils/dateFormatter";
import styles from "./mealPlannerPage.module.css";
import { generateMealPlan } from "@/services/mealPlanner/generateMealPlan";

// Offline mode handling:
// You can use browser storage (e.g., localStorage)
// to allow the app to work without an internet connection.

// TODO: Group meals into categories like lunches, desserts, etc.

export default function MealPlanPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [numDays, setNumDays] = useState(7);
  const [mealsPerDay, setMealsPerDay] = useState(3);
  const [mealPlan, setMealPlan] = useState<{
    day: string;
    meals: {
      recipe: string;
      availableIngredients: Product[];
      missingIngredients: string[];
    }[];
  }[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const productsResponse = await fetch("http://localhost:8080/api/product/");
        const recipesResponse = await fetch("http://localhost:8080/api/recipe/");
        const productsData: Product[] = await productsResponse.json();
        const recipesData: Recipe[] = await recipesResponse.json();

        setProducts(productsData);
        setRecipes(recipesData);
      } catch (error) {
        // add distinct error handling
        console.error("Error fetching products:", error);
        console.error("Error fetching recipes:", error);
      }
    }

    fetchData();
  }, []);

  const handleGenerateMealPlan = () => {
    const plan = generateMealPlan(products, recipes);
    setMealPlan(plan);
  };

  return (
    <div>
      <Navbar />

      <h1>Meal Plan</h1>

      <div className={styles.controls}>
        <label>
          Number of Days:
          <input
            className="w-full p-2 border border-gray-300 rounded-md bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="number"
            min="1"
            max="14"
            value={numDays}
            onChange={(e) => setNumDays(parseInt(e.target.value))}
          />
        </label>

        <label>
          Meals per Day:
          <input
            className="w-full p-2 border border-gray-300 rounded-md bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="number"
            min="1"
            max="5"
            value={mealsPerDay}
            onChange={(e) => setMealsPerDay(parseInt(e.target.value))}
          />
        </label>

        <button onClick={handleGenerateMealPlan} className={styles.generateButton}>
          Generate Meal Plan
        </button>
      </div>

      {mealPlan.length > 0 ? (
        <ul>
          {mealPlan.map((dayPlan, index) => (
            <li key={index}>
              <h2>{dayPlan.day}</h2>
              {dayPlan.meals.map((meal, mealIndex) => (
                <div key={mealIndex}>
                  <h3>Meal {mealIndex + 1}: {meal.recipe}</h3>
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
                </div>
              ))}
            </li>
          ))}
        </ul>
      ) : (
        <p>No meal plan generated yet. Select options and click the button above.</p>
      )}
    </div>
  );
}
