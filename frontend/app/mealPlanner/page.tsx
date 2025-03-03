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

const mealTemplates = {
  standard: {
    Monday: ["Breakfast", "Lunch", "Dinner"],
    Tuesday: ["Breakfast", "Snack", "Lunch", "Dinner"],
    Wednesday: ["Brunch", "Dinner"],
    Thursday: ["Breakfast", "Lunch", "Dinner"],
    Friday: ["Breakfast", "Snack", "Lunch", "Dinner"],
    Saturday: ["Brunch", "Dinner"],
    Sunday: ["Breakfast", "Lunch", "Dinner"],
  },
  intermittentFasting: {
    Monday: ["Lunch", "Dinner"],
    Tuesday: ["Lunch", "Dinner"],
    Wednesday: ["Lunch", "Dinner"],
    Thursday: ["Lunch", "Dinner"],
    Friday: ["Lunch", "Dinner"],
    Saturday: ["Brunch", "Dinner"],
    Sunday: ["Brunch", "Dinner"],
  },
};

function generateMealPlan(products: Product[], recipes: Recipe[], templateType = "standard") {
  const template = mealTemplates[templateType] || mealTemplates.standard;
  const mealPlan = [];
  let usedRecipes = new Set();
  let usedProducts = new Set();
  let randomStartIndex = Math.floor(Math.random() * recipes.length);

  const sortedProducts = products
    .filter(p => p.expirationDate)
    .sort((a, b) => getTime(a.expirationDate) - getTime(b.expirationDate));

  console.log("Sorted products by expiration date:", sortedProducts);

  for (const [day, mealTypes] of Object.entries(template)) {
    const dayPlan = { day, meals: [] };

    for (const mealType of mealTypes) {
      if (usedRecipes.size === recipes.length) usedRecipes.clear();

      let bestRecipe = null;
      let bestScore = -Infinity;

      // Evaluate each recipe
      // for (const recipe of recipes) {
      for (let j = 0; j < recipes.length; j++) {
        const recipe = recipes[(randomStartIndex + j) % recipes.length];
        if (usedRecipes.has(recipe.title)) continue;

        const availableIngredients = sortedProducts.filter(p => recipe.databaseProducts.some(dbP => dbP.name === p.name) && !usedProducts.has(p.name));
        const missingIngredients = recipe.databaseProducts.filter(dbP => !availableIngredients.some(p => p.name === dbP.name)).map(p => p.name);
        const missingUnassignedProducts = recipe.unassignedProducts.filter(productName => !availableIngredients.some(p => p.name === productName));

        console.log(`Day: ${day}, Meal: ${mealType}, Checking recipe: ${recipe.title}`);
        console.log("Available ingredients:", availableIngredients);
        console.log("Missing ingredients:", missingIngredients, missingUnassignedProducts);

        let expirationScore = 0;
        availableIngredients.forEach(ing => {
          const expirationTime = getTime(ing.expirationDate);
          const daysUntilExpiration = Math.floor((expirationTime - Date.now()) / (1000 * 60 * 60 * 24)); // ms -> days

          // if (daysUntilExpiration <= 0) expirationScore += 100;
          // else if (daysUntilExpiration <= 3) expirationScore += 30;
          // else if (daysUntilExpiration <= 7) expirationScore += 15;
          // else expirationScore += 5;
          expirationScore += Math.max(0, -daysUntilExpiration + 100);

          console.log(`Ingredient: ${ing.name}, Expiration in: ${daysUntilExpiration} days, Score contribution: ${expirationScore}`);
        });

        // Matching score based on available and missing ingredients
        let matchingScore = availableIngredients.length * 5 - (missingIngredients.length + missingUnassignedProducts.length) * 5;
        if (matchingScore < 0) matchingScore = 0;

        const totalScore = expirationScore + matchingScore;

        console.log(`Recipe: ${recipe.title}, expScore: ${expirationScore}, matchScore: ${matchingScore}, Score: ${totalScore}`);

        if (totalScore > bestScore) {
          bestScore = totalScore;
          bestRecipe = {
            type: mealType,
            recipe: recipe.title,
            availableIngredients,
            missingIngredients: [...missingIngredients, ...missingUnassignedProducts],
          };
        }
      }

      if (bestRecipe) {
        dayPlan.meals.push(bestRecipe);
        usedRecipes.add(bestRecipe.recipe);

        bestRecipe.availableIngredients.forEach(ingredient => usedProducts.add(ingredient.name));
      }
    }

    mealPlan.push(dayPlan)
    randomStartIndex = (randomStartIndex + 1) % recipes.length;
  }

  return mealPlan;
}

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
