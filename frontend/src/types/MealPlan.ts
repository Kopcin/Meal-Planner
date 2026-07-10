import { Product } from "./Product";

export type Meal = {
  type: string;
  recipe: string;
  recipeId: number;
  availableIngredients: Product[];
  missingIngredients: string[];
};

export type DayPlan = {
  day: string;
  meals: Meal[];
};

export type MealPlanSaveRequest = {
  name: string;
  startDate: string;
  dayPlans: {
    date: string;
    mealSlots: {
      name: string;
      recipeId: number;
    }[];
  }[];
};

export type MealPlanSummary = {
  id: number;
  name: string;
};

export type SavedMealPlan = {
  id: number;
  name: string;
  startDate: string;
  dayPlans: DayPlan[];
};
