import { useCallback, useMemo, useState } from "react";
import { DayPlanViewModel, MealPlanResponse } from "@/types/MealPlan";
import { Product } from "@/types/Product";
import { Recipe } from "@/types/Recipe";
import { calculateShoppingList } from "@/services/mealPlanner/calculateShoppingList";
import { enrichMealPlan } from "@/services/mealPlanner/enrichMealPlan";
import { generateMealPlan } from "@/services/mealPlanner/generateMealPlan";
import { selectNextMeal } from "@/services/mealPlanner/selectNextMeal";

type MealPlanEditor = {
  mealPlan: DayPlanViewModel[];
  mealPlanName: string;
  openedPlanId: number | null;
  changedMeals: Set<string>;
  shoppingList: string[];
  hasMealPlan: boolean;
  setMealPlanName: (name: string) => void;
  generateNewPlan: (numDays: number, mealsPerDay: number) => void;
  applySavedPlan: (plan: MealPlanResponse) => void;
  clearEditor: () => void;
  moveMeal: (
    fromDayIndex: number,
    fromMealIndex: number,
    toDayIndex: number,
    toMealIndex: number,
  ) => void;
  changeRecipe: (dayIndex: number, mealIndex: number, recipeId: number) => void;
  addMeal: (dayIndex: number) => void;
  addDay: () => void;
};

export function useMealPlanEditor(
  recipes: Recipe[],
  products: Product[],
): MealPlanEditor {
  const [mealPlan, setMealPlan] = useState<DayPlanViewModel[]>([]);
  const [mealPlanName, setMealPlanName] = useState("My Meal Plan");
  const [openedPlanId, setOpenedPlanId] = useState<number | null>(null);
  const [changedMeals, setChangedMeals] = useState<Set<string>>(new Set());
  const shoppingList = useMemo(
    () => calculateShoppingList(mealPlan),
    [mealPlan],
  );

  const applyEnrichedPlan = useCallback(
    (plan: DayPlanViewModel[], id: number | null) => {
      setMealPlan(plan);
      setOpenedPlanId(id);
      setChangedMeals(new Set());
    },
    [],
  );

  const generateNewPlan = useCallback(
    (numDays: number, mealsPerDay: number) => {
      const generated = generateMealPlan(
        products,
        recipes,
        numDays,
        mealsPerDay,
      );
      applyEnrichedPlan(enrichMealPlan(generated, recipes, products), null);
    },
    [applyEnrichedPlan, products, recipes],
  );

  const applySavedPlan = useCallback(
    (plan: MealPlanResponse) => {
      setMealPlanName(plan.name);
      applyEnrichedPlan(
        enrichMealPlan(plan.dayPlans, recipes, products),
        plan.id,
      );
    },
    [applyEnrichedPlan, products, recipes],
  );

  const clearEditor = useCallback(() => {
    setMealPlan([]);
    setOpenedPlanId(null);
    setChangedMeals(new Set());
  }, []);

  const moveMeal = useCallback(
    (
      fromDayIndex: number,
      fromMealIndex: number,
      toDayIndex: number,
      toMealIndex: number,
    ) => {
      setMealPlan((current) => {
        const updated = structuredClone(current);
        const [movedMeal] = updated[fromDayIndex].mealSlots.splice(
          fromMealIndex,
          1,
        );
        updated[toDayIndex].mealSlots.splice(toMealIndex, 0, movedMeal);
        const enriched = enrichMealPlan(updated, recipes, products);
        return enriched;
      });
      setChangedMeals((previous) =>
        new Set(previous)
          .add(`${fromDayIndex}-${fromMealIndex}`)
          .add(`${toDayIndex}-${toMealIndex}`),
      );
    },
    [products, recipes],
  );

  const changeRecipe = useCallback(
    (dayIndex: number, mealIndex: number, recipeId: number) => {
      setMealPlan((current) => {
        const updated = structuredClone(current);
        updated[dayIndex].mealSlots[mealIndex].recipeId = recipeId;
        const enriched = enrichMealPlan(updated, recipes, products);
        return enriched;
      });
      setChangedMeals((previous) =>
        new Set(previous).add(`${dayIndex}-${mealIndex}`),
      );
    },
    [products, recipes],
  );

  const addMeal = useCallback(
    (dayIndex: number) => {
      setMealPlan((current) => {
        const newMeal = selectNextMeal(
          current,
          dayIndex,
          recipes,
          products,
        );
        if (!newMeal) return current;

        const updated = structuredClone(current);
        updated[dayIndex].mealSlots.push(newMeal);
        const enriched = enrichMealPlan(updated, recipes, products);
        return enriched;
      });
    },
    [products, recipes],
  );

  const addDay = useCallback(() => {
    setMealPlan((current) => {
      const lastDay = current.at(-1);
      const nextDate = lastDay ? new Date(lastDay.date) : new Date();
      nextDate.setDate(nextDate.getDate() + 1);
      return [
        ...current,
        { date: nextDate.toISOString().split("T")[0], mealSlots: [] },
      ];
    });
  }, []);

  return {
    mealPlan,
    mealPlanName,
    openedPlanId,
    changedMeals,
    shoppingList,
    hasMealPlan: mealPlan.length > 0,
    setMealPlanName,
    generateNewPlan,
    applySavedPlan,
    clearEditor,
    moveMeal,
    changeRecipe,
    addMeal,
    addDay,
  };
}
