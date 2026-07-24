import { DayPlan } from "@/types/MealPlan";

export function calculateShoppingList(mealPlan: DayPlan[]): string[] {
  return [
    ...new Set(
      mealPlan
        .flatMap((day) => day.mealSlots)
        .flatMap((meal) => meal.missingIngredients ?? []),
    ),
  ];
}
