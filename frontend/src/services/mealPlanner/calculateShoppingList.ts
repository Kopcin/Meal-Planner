import { DayPlanViewModel } from "@/types/MealPlan";

export function calculateShoppingList(mealPlan: DayPlanViewModel[]): string[] {
  return [
    ...new Set(
      mealPlan
        .flatMap((day) => day.mealSlots)
        .flatMap((meal) => meal.missingIngredients ?? []),
    ),
  ];
}
