"use client";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { Product } from "@/types/Product";
import { Recipe } from "@/types/Recipe";
import { formatExpirationDateString } from "@/utils/dateFormatter";
import styles from "./mealPlannerPage.module.css";
import {
  DayPlan,
  generateMealPlan,
} from "@/services/mealPlanner/generateMealPlan";

// Offline mode handling:
// You can use browser storage (e.g., localStorage)
// to allow the app to work without an internet connection.

// TODO: Group meals into categories like lunches, desserts, etc.

export default function MealPlanPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [numDays, setNumDays] = useState(7);
  const [mealsPerDay, setMealsPerDay] = useState(3);
  const [mealPlan, setMealPlan] = useState<DayPlan[]>([]);
  const [shoppingList, setShoppingList] = useState<string[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsResponse, recipesResponse] = await Promise.all([
          fetch("http://localhost:8080/api/product/"),
          fetch("http://localhost:8080/api/recipe/"),
        ]);

        const [productsData, recipesData] = await Promise.all([
          productsResponse.json(),
          recipesResponse.json(),
        ]);

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
    const plan = generateMealPlan(products, recipes, numDays, mealsPerDay);
    setMealPlan(plan);

    const allMissingIngredients = plan
      .flatMap((day) => day.meals)
      .flatMap((meal) => meal.missingIngredients);

    setShoppingList([...new Set(allMissingIngredients)]);
  };

  const hasMealPlan = mealPlan.length > 0;

  return (
    <div className={styles.page}>
      <Navbar />

      <main className={styles.container}>
        <section className={styles.headerCard}>
          <div>
            <h1 className={styles.title}>Meal Planner</h1>
            <p className={styles.subtitle}>
              Generate a plan based on what you already have in the fridge.
            </p>
          </div>

          <button
            onClick={handleGenerateMealPlan}
            className={styles.generateButton}
          >
            Generate New Plan
          </button>
        </section>

        <section className={styles.controlsCard}>
          <div className={styles.controlsGrid}>
            <label className={styles.control}>
              <span>Number of Days</span>
              <input
                className={styles.input}
                type="number"
                min="1"
                max="14"
                value={numDays}
                onChange={(e) => setNumDays(parseInt(e.target.value) || 1)}
              />
            </label>

            <label className={styles.control}>
              <span>Meals per Day</span>
              <input
                className={styles.input}
                type="number"
                min="1"
                max="5"
                value={mealsPerDay}
                onChange={(e) => setMealsPerDay(parseInt(e.target.value) || 1)}
              />
            </label>
          </div>
        </section>

        {!hasMealPlan ? (
          <section className={styles.emptyState}>
            <p>
              No meal plan generated yet. Select options and click the button
              above.
            </p>
          </section>
        ) : (
          <section className={styles.planGrid}>
            {mealPlan.map((dayPlan, index) => (
              <article key={index} className={styles.dayCard}>
                <header className={styles.dayHeader}>
                  <h2 className={styles.dayTitle}>{dayPlan.day}</h2>
                  <span className={styles.dayBadge}>
                    {dayPlan.meals.length} meals
                  </span>
                </header>

                <div className={styles.mealsList}>
                  {dayPlan.meals.map((meal, mealIndex) => (
                    <div key={mealIndex} className={styles.mealCard}>
                      <div className={styles.mealTopRow}>
                        <h3 className={styles.mealTitle}>
                          <span className={styles.mealType}>{meal.type}</span>
                          <span className={styles.mealRecipe}>
                            {meal.recipe}
                          </span>
                        </h3>
                      </div>

                      <div className={styles.infoBlock}>
                        <p className={styles.infoLabel}>
                          Available ingredients
                        </p>
                        <div className={styles.tagWrap}>
                          {meal.availableIngredients.length > 0 ? (
                            meal.availableIngredients.map((product, idx) => (
                              <span key={idx} className={styles.availableTag}>
                                {product.name}
                                <span className={styles.tagMeta}>
                                  {" "}
                                  ·{" "}
                                  {formatExpirationDateString(
                                    product.expirationDate,
                                  )}
                                </span>
                              </span>
                            ))
                          ) : (
                            <span className={styles.emptyTag}>None</span>
                          )}
                        </div>
                      </div>

                      <div className={styles.infoBlock}>
                        <p className={styles.infoLabel}>Missing ingredients</p>
                        <div className={styles.tagWrap}>
                          {meal.missingIngredients.length > 0 ? (
                            meal.missingIngredients.map((ingredient, idx) => (
                              <span key={idx} className={styles.missingTag}>
                                {ingredient}
                              </span>
                            ))
                          ) : (
                            <span className={styles.emptyTag}>None</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </section>
        )}

        {shoppingList.length > 0 && (
          <section className={styles.shoppingCard}>
            <div className={styles.shoppingHeader}>
              <h2 className={styles.sectionTitle}>Shopping List</h2>
              <span className={styles.dayBadge}>
                {shoppingList.length} items
              </span>
            </div>

            <div className={styles.shoppingList}>
              {shoppingList.map((ingredient, index) => (
                <span key={index} className={styles.shoppingItem}>
                  {ingredient}
                </span>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
