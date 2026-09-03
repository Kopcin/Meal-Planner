import {
  MealPlanRequest,
  MealPlanSummaryResponse,
  MealPlanResponse,
} from "@/types/MealPlan";
import { apiRequest } from "@/services/apiClient";

const API_PATH = "/meal-plans";

export async function saveMealPlan(
  payload: MealPlanRequest,
  id?: number,
): Promise<MealPlanResponse> {
  return apiRequest<MealPlanResponse>(id ? `${API_PATH}/${id}` : API_PATH, {
    method: id ? "PUT" : "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function getMealPlans(): Promise<MealPlanSummaryResponse[]> {
  return apiRequest<MealPlanSummaryResponse[]>(API_PATH);
}

export async function getMealPlan(id: number): Promise<MealPlanResponse> {
  return apiRequest<MealPlanResponse>(`${API_PATH}/${id}`);
}

export async function deleteMealPlan(id: number): Promise<void> {
  await apiRequest<void>(`${API_PATH}/${id}`, {
    method: "DELETE",
  });
}
