"use client";

import { useCallback, useState } from "react";
import MealPlanControls from "@/components/MealPlan/MealPlanControls";
import MealPlanHeader from "@/components/MealPlan/MealPlanHeader";
import MealPlanView from "@/components/MealPlan/MealPlanView";
import SavedPlansList from "@/components/MealPlan/SavedPlansList";
import ShoppingList from "@/components/MealPlan/ShoppingList";
import RecipePicker from "@/components/Recipe/RecipePicker";
import { useMealPlanEditor } from "@/hooks/useMealPlanEditor";
import { useMealPlanPersistence } from "@/hooks/useMealPlanPersistence";
import { useMealPlannerData } from "@/hooks/useMealPlannerData";
import { MealPlanResponse } from "@/types/MealPlan";
import styles from "./MealPlannerWorkspace.module.css";

export default function MealPlannerWorkspace() {
  const { products, recipes, isLoading: isDataLoading, error: dataError } = useMealPlannerData();
  const [numDays, setNumDays] = useState(7);
  const [mealsPerDay, setMealsPerDay] = useState(3);
  const editor = useMealPlanEditor(recipes, products);

  const handlePlanLoaded = useCallback((plan: MealPlanResponse) => {
    editor.applySavedPlan(plan);
  }, [editor.applySavedPlan]);

  const handlePlanDeleted = useCallback((id: number) => {
    if (editor.openedPlanId === id) editor.clearEditor();
  }, [editor.clearEditor, editor.openedPlanId]);

  const persistence = useMealPlanPersistence({
    mealPlan: editor.mealPlan,
    mealPlanName: editor.mealPlanName,
    openedPlanId: editor.openedPlanId,
    onPlanLoaded: handlePlanLoaded,
    onPlanDeleted: handlePlanDeleted,
  });

  const handleGenerate = () => editor.generateNewPlan(numDays, mealsPerDay);

  const handleSave = async () => {
    if (!editor.hasMealPlan) return;
    try {
      await persistence.saveCurrentPlan();
      alert("Meal plan saved!");
    } catch (error) {
      console.error("Failed to save meal plan:", error);
      alert("Failed to save meal plan.");
    }
  };

  const handleOpen = async (id: number) => {
    if (editor.openedPlanId === id) {
      editor.clearEditor();
      return;
    }
    try {
      await persistence.openPlan(id);
    } catch (error) {
      console.error("Failed to open meal plan:", error);
      alert("Failed to open meal plan.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this meal plan?")) return;
    try {
      await persistence.removePlan(id);
    } catch (error) {
      console.error("Failed to delete meal plan:", error);
      alert("Failed to delete meal plan.");
    }
  };

  return (
    <main className={styles.container}>
      <MealPlanHeader
        canSave={editor.hasMealPlan && !persistence.isSaving}
        onGenerate={handleGenerate}
        onSave={handleSave}
      />
      <MealPlanControls
        mealPlanName={editor.mealPlanName}
        numDays={numDays}
        mealsPerDay={mealsPerDay}
        setMealPlanName={editor.setMealPlanName}
        setNumDays={setNumDays}
        setMealsPerDay={setMealsPerDay}
      />

      {isDataLoading && <p>Loading meal planner data...</p>}
      {dataError && <p className={styles.errorMessage}>{dataError}</p>}
      {persistence.error && <p className={styles.errorMessage}>{persistence.error}</p>}
      {persistence.isLoading && <p>Loading saved meal plans...</p>}

      {editor.hasMealPlan && (
        <div className={styles.editorLayout}>
          <RecipePicker recipes={recipes} products={products} />
          <MealPlanView
            mealPlan={editor.mealPlan}
            onMoveMeal={editor.moveMeal}
            onChangeRecipe={editor.changeRecipe}
            onAddMeal={editor.addMeal}
            onAddDay={editor.addDay}
            changedMeals={editor.changedMeals}
          />
        </div>
      )}

      <SavedPlansList
        plans={persistence.savedPlans}
        openedPlanId={editor.openedPlanId}
        onOpen={handleOpen}
        onDelete={handleDelete}
      />
      
      <ShoppingList items={editor.shoppingList} />
    </main>
  );
}
