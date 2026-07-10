"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import MealPlanHeader from "@/components/MealPlan/MealPlanHeader";
import MealPlanControls from "@/components/MealPlan/MealPlanControls";
import MealPlanView from "@/components/MealPlan/MealPlanView";
import { DayPlan, MealPlanSummary, SavedMealPlan } from "@/types/MealPlan";
import { Product } from "@/types/Product";
import { Recipe } from "@/types/Recipe";
import { generateMealPlan } from "@/services/mealPlanner/generateMealPlan";
import {
  saveMealPlan,
  getMealPlans,
  getMealPlan,
} from "@/services/mealPlanner/mealPlanApi";
import styles from "./mealPlannerPage.module.css";

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

  const [savedPlans, setSavedPlans] = useState<MealPlanSummary[]>([]);
  const [openedPlanId, setOpenedPlanId] = useState<number | null>(null);
  const [openedPlan, setOpenedPlan] = useState<SavedMealPlan | null>(null);

  const hasMealPlan = mealPlan.length > 0;

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

        await loadMealPlans();
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

  const handleSaveMealPlan = async () => {
    if (!hasMealPlan) {
      return;
    }

    const payload = {
      name: "My meal plan",
      startDate: new Date().toISOString().split("T")[0],
      dayPlans: mealPlan.map((day) => ({
        date: new Date().toISOString().split("T")[0],
        mealSlots: day.meals.map((meal) => ({
          name: meal.type,
          recipeId: meal.recipeId,
        })),
      })),
    };

    console.log("Saving meal plan:", payload);

    try {
      const savedPlan = await saveMealPlan(payload);

      console.log("Saved meal plan:", savedPlan);

      await loadMealPlans();

      alert("Meal plan saved!");
    } catch (error) {
      console.error("Saving meal plan failed:", error);
      alert("Failed to save meal plan.");
    }
  };

  // const handleLoadMealPlan = (planId: number) => {
  //   const planToLoad = savedPlans.find((plan) => plan.id === planId);
  // };

  const loadMealPlans = async () => {
    try {
      const plans = await getMealPlans();
      setSavedPlans(plans);
    } catch (error) {
      console.error("Failed to load meal plans:", error);
    }
  };

  const handleOpenMealPlan = async (planId: number) => {
    if (openedPlanId === planId) {
      setOpenedPlanId(null);
      setOpenedPlan(null);
      return;
    }

    try {
      const plan = await getMealPlan(planId);
      setOpenedPlanId(planId);
      setOpenedPlan(plan);
    } catch (error) {
      console.error(`Failed to open meal plan ${planId}:`, error);
    }
  };

  return (
    <div className={styles.page}>
      <Navbar />

      <main className={styles.container}>
        <MealPlanHeader
          canSave={hasMealPlan}
          onGenerate={handleGenerateMealPlan}
          onSave={handleSaveMealPlan}
        />

        <MealPlanControls
          numDays={numDays}
          mealsPerDay={mealsPerDay}
          setNumDays={setNumDays}
          setMealsPerDay={setMealsPerDay}
        />

        {!hasMealPlan ? (
          <section className={styles.emptyState}>
            <p>
              No meal plan generated yet. Select options and click the button
              above.
            </p>
          </section>
        ) : (
          <MealPlanView mealPlan={mealPlan} />
        )}

        <section className={styles.savedPlansContainer}>
          <h2 className={styles.sectionTitle}>Saved Meal Plans</h2>
          {savedPlans.map((plan) => (
            <div key={plan.id} className={styles.savedPlanItem}>
              <button onClick={() => handleOpenMealPlan(plan.id)}>
                {openedPlanId === plan.id ? "▼" : "▶"} {plan.name}
              </button>

              {openedPlanId === plan.id && openedPlan && (
                <MealPlanView mealPlan={openedPlan.dayPlans} />
              )}
            </div>
          ))}
        </section>

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
