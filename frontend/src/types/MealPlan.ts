import { Product } from "./Product";

export type Meal = {
  label: string;
  recipeName: string;
  recipeId: number;
  availableIngredients: Product[];
  missingIngredients: string[];
};

export type DayPlan = {
  date: string;
  mealSlots: Meal[];
};

export type MealPlanRequest = {
  name: string;
  startDate: string;
  dayPlans: {
    date: string;
    mealSlots: {
      label: string;
      recipeId: number;
    }[];
  }[];
};

export type MealPlanSummaryResponse = {
  id: number;
  name: string;
};

export type MealPlanResponse = {
  id: number;
  name: string;
  startDate: string;
  dayPlans: DayPlan[];
};
