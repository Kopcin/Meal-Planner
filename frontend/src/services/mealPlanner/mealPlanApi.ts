import {
  MealPlanRequest,
  MealPlanSummaryResponse,
  MealPlanResponse,
} from "@/types/MealPlan";
import Cookies from "js-cookie";

const API_URL = "http://localhost:8080/api/meal-plans";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${Cookies.get("token")}`,
});

export async function saveMealPlan(
  payload: MealPlanRequest,
  id?: number,
): Promise<MealPlanResponse> {
  const url = id ? `${API_URL}/${id}` : API_URL;

  const response = await fetch(url, {
    method: id ? "PUT" : "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to save meal plan: ${response.status} ${errorText}`,
    );
  }

  return response.json();
}

export async function getMealPlans(): Promise<MealPlanSummaryResponse[]> {
  const response = await fetch(API_URL, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch meal plans: ${response.status} ${errorText}`);
  }

  return response.json();
}

export async function getMealPlan(id: number): Promise<MealPlanResponse> {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch meal plan ${id}: ${response.status} ${errorText}`);
  }

  return response.json();
}
