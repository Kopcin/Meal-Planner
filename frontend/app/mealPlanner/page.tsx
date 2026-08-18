"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import MealPlanHeader from "@/components/MealPlan/MealPlanHeader";
import MealPlanControls from "@/components/MealPlan/MealPlanControls";
import MealPlanView from "@/components/MealPlan/MealPlanView";
import { DayPlanViewModel, MealPlanSummaryResponse } from "@/types/MealPlan";
import { Product } from "@/types/Product";
import { Recipe } from "@/types/Recipe";
import { generateMealPlan } from "@/services/mealPlanner/generateMealPlan";
import {
  saveMealPlan,
  getMealPlans,
  getMealPlan,
} from "@/services/mealPlanner/mealPlanApi";
import styles from "./mealPlannerPage.module.css";
import { enrichMealPlan } from "@/services/mealPlanner/enrichMealPlan";
import { calculateShoppingList } from "@/services/mealPlanner/calculateShoppingList";
import RecipePicker from "@/components/Recipe/RecipePicker";
import { calculateMealIngredients } from "@/services/mealPlanner/calculateMealIngredients";
import { getTime } from "@/utils/dateFormatter";
import { scoreRecipe } from "@/services/mealPlanner/scoreRecipe";

// Offline mode handling:
// You can use browser storage (e.g., localStorage)
// to allow the app to work without an internet connection.

// TODO: Group meals into categories like lunches, desserts, etc.

export default function MealPlanPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [numDays, setNumDays] = useState(7);
  const [mealsPerDay, setMealsPerDay] = useState(3);
  const [mealPlan, setMealPlan] = useState<DayPlanViewModel[]>([]);
  const [mealPlanName, setMealPlanName] = useState<string>("My Meal Plan");
  const [shoppingList, setShoppingList] = useState<string[]>([]);
  const [savedPlans, setSavedPlans] = useState<MealPlanSummaryResponse[]>([]);
  const [openedPlanId, setOpenedPlanId] = useState<number | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [changedMeals, setChangedMeals] = useState<Set<string>>(new Set());

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

    const enrichedPlan = enrichMealPlan(plan, recipes, products);

    setMealPlan(enrichedPlan);
    setShoppingList(calculateShoppingList(enrichedPlan));

    setOpenedPlanId(null);
    setHasUnsavedChanges(false);
    setChangedMeals(new Set());
  };

  const handleSaveMealPlan = async () => {
    if (!hasMealPlan) {
      return;
    }

    const startDate = new Date();
    const startDateString = startDate.toISOString().split("T")[0];

    const payload = {
      name: mealPlanName,
      startDate: startDateString,
      dayPlans: mealPlan.map((day, index) => {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + index);

        return {
          date: date.toISOString().split("T")[0],
          mealSlots: day.mealSlots.map((meal) => ({
            label: meal.label,
            recipeId: meal.recipeId,
          })),
        };
      }),
    };

    console.log("Saving meal plan:", payload);

    try {
      const savedPlan = await saveMealPlan(payload, openedPlanId ?? undefined);

      console.log("Saved meal plan:", savedPlan);

      await loadMealPlans();

      const enrichedPlan = enrichMealPlan(
        savedPlan.dayPlans,
        recipes,
        products,
      );

      setMealPlan(enrichedPlan);
      setOpenedPlanId(savedPlan.id);
      setShoppingList(calculateShoppingList(enrichedPlan));
      setHasUnsavedChanges(false);
      setChangedMeals(new Set());

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
      setMealPlan([]);
      setShoppingList([]);
      setHasUnsavedChanges(false);
      setChangedMeals(new Set());
      return;
    }

    try {
      const plan = await getMealPlan(planId);

      const enrichedPlan = enrichMealPlan(plan.dayPlans, recipes, products);

      setMealPlan(enrichedPlan);
      setOpenedPlanId(planId);
      setShoppingList(calculateShoppingList(enrichedPlan));
      setHasUnsavedChanges(false);
      setChangedMeals(new Set());
    } catch (error) {
      console.error(`Failed to open meal plan ${planId}:`, error);
    }
  };

  const handleMoveMeal = (
    fromDayIndex: number,
    fromMealIndex: number,
    toDayIndex: number,
    toMealIndex: number,
  ) => {
    const updatedMealPlan = structuredClone(mealPlan);
    const [movedMeal] = updatedMealPlan[fromDayIndex].mealSlots.splice(
      fromMealIndex,
      1,
    );
    updatedMealPlan[toDayIndex].mealSlots.splice(toMealIndex, 0, movedMeal);
    const enrichedPlan = enrichMealPlan(updatedMealPlan, recipes, products);

    setMealPlan(enrichedPlan);
    setShoppingList(calculateShoppingList(enrichedPlan));

    if (openedPlanId !== null) {
      setHasUnsavedChanges(true);
    }

    setChangedMeals((prev) => {
      const next = new Set(prev);

      next.add(`${fromDayIndex}-${fromMealIndex}`);
      next.add(`${toDayIndex}-${toMealIndex}`);

      return next;
    });
  };

  const handleChangeRecipe = (
    dayIndex: number,
    mealIndex: number,
    recipeId: number,
  ) => {
    const updatedMealPlan = structuredClone(mealPlan);

    updatedMealPlan[dayIndex].mealSlots[mealIndex].recipeId = recipeId;

    const enrichedPlan = enrichMealPlan(updatedMealPlan, recipes, products);

    setMealPlan(enrichedPlan);
    setShoppingList(calculateShoppingList(enrichedPlan));

    if (openedPlanId !== null) {
      setHasUnsavedChanges(true);
    }

    setChangedMeals((prev) => {
      const next = new Set(prev);

      next.add(`${dayIndex}-${mealIndex}`);

      return next;
    });
  };

  const createNewMeal = (dayIndex: number) => {
    const usedProducts = new Set<string>();
    const usedRecipes = new Set<string>();

    // Odtwórz stan produktów wykorzystanych przez posiłki,
    // które już znajdują się w planie przed nowym mealem.
    for (
      let currentDayIndex = 0;
      currentDayIndex <= dayIndex;
      currentDayIndex++
    ) {
      const day = mealPlan[currentDayIndex];

      for (const meal of day.mealSlots) {
        const recipe = recipes.find((r) => r.id === meal.recipeId);

        if (!recipe) {
          continue;
        }

        const { availableIngredients } = calculateMealIngredients(
          recipe,
          products,
          usedProducts,
        );

        availableIngredients.forEach((ingredient) => {
          usedProducts.add(ingredient.name);
        });

        usedRecipes.add(recipe.title);
      }
    }

    // Jeżeli wykorzystaliśmy już wszystkie przepisy,
    // pozwól ponownie użyć dowolnego przepisu.
    const availableRecipes =
      usedRecipes.size === recipes.length
        ? recipes
        : recipes.filter((recipe) => !usedRecipes.has(recipe.title));

    let bestRecipe: Recipe | null = null;
    let bestScore = -Infinity;

    for (const recipe of availableRecipes) {
      const { score } = scoreRecipe(recipe, products, usedProducts);

      if (score > bestScore) {
        bestScore = score;
        bestRecipe = recipe;
      }
    }

    if (!bestRecipe) {
      return null;
    }

    return {
      label: "New Meal",
      recipeId: bestRecipe.id,
      recipeName: bestRecipe.title,
      availableIngredients: [],
      missingIngredients: [],
    };
  };

  const handleAddMeal = (dayIndex: number) => {
    const newMeal = createNewMeal(dayIndex);

    if (!newMeal) {
      return;
    }

    const updatedMealPlan = structuredClone(mealPlan);

    updatedMealPlan[dayIndex].mealSlots.push(newMeal);

    const enrichedPlan = enrichMealPlan(updatedMealPlan, recipes, products);

    setMealPlan(enrichedPlan);
    setShoppingList(calculateShoppingList(enrichedPlan));
    setHasUnsavedChanges(true);

    setChangedMeals((prev) => {
      const next = new Set(prev);

      next.add(`${dayIndex}-${enrichedPlan[dayIndex].mealSlots.length - 1}`);

      return next;
    });
  };

  const handleAddDay = () => {
    const lastDay = mealPlan.at(-1);

    const nextDate = lastDay ? new Date(lastDay.date) : new Date();

    nextDate.setDate(nextDate.getDate() + 1);

    const newDay = {
      date: nextDate.toISOString().split("T")[0],
      mealSlots: [],
    };

    setMealPlan((prev) => [...prev, newDay]);

    setHasUnsavedChanges(true);
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
          mealPlanName={mealPlanName}
          numDays={numDays}
          mealsPerDay={mealsPerDay}
          setMealPlanName={setMealPlanName}
          setNumDays={setNumDays}
          setMealsPerDay={setMealsPerDay}
        />

        {hasMealPlan && (
          <div className={styles.editorLayout}>
            <RecipePicker recipes={recipes} products={products} />

            <MealPlanView
              mealPlan={mealPlan}
              onMoveMeal={handleMoveMeal}
              onChangeRecipe={handleChangeRecipe}
              onAddMeal={handleAddMeal}
              onAddDay={handleAddDay}
              changedMeals={changedMeals}
            />
          </div>
        )}

        <section className={styles.savedPlansContainer}>
          <h2 className={styles.sectionTitle}>Saved Meal Plans</h2>
          {savedPlans.map((plan) => (
            <div key={plan.id} className={styles.savedPlanItem}>
              <button onClick={() => handleOpenMealPlan(plan.id)}>
                {openedPlanId === plan.id ? "✎" : "○"} {plan.name}
              </button>
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
