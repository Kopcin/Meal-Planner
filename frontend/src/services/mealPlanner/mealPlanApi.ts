import {
  MealPlanSaveRequest,
  MealPlanSummary,
  SavedMealPlan,
} from "@/types/MealPlan";

const API_URL = "http://localhost:8080/api/meal-plans";

export async function saveMealPlan(
  payload: MealPlanSaveRequest,
): Promise<SavedMealPlan> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to save meal plan: ${response.status} ${errorText}`);
  }

  return response.json();
}

export async function getMealPlans(): Promise<MealPlanSummary[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch meal plans");
  }

  return response.json();
}

export async function getMealPlan(id: number): Promise<SavedMealPlan> {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch meal plan ${id}`);
  }

  return response.json();
}
