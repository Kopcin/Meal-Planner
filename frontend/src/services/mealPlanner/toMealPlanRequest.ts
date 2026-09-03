import { DayPlanViewModel, MealPlanRequest } from "@/types/MealPlan";

export function toMealPlanRequest(
  name: string,
  mealPlan: DayPlanViewModel[],
  startDate = new Date(),
): MealPlanRequest {
  const startDateString = startDate.toISOString().split("T")[0];

  return {
    name,
    startDate: startDateString,
    dayPlans: mealPlan.map((day, dayIndex) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + dayIndex);

      return {
        date: date.toISOString().split("T")[0],
        mealSlots: day.mealSlots.map((meal) => ({
          label: meal.label,
          recipeId: meal.recipeId,
        })),
      };
    }),
  };
}
