import { useCallback, useEffect, useState } from "react";
import { MealPlanResponse, MealPlanSummaryResponse, DayPlanViewModel } from "@/types/MealPlan";
import { deleteMealPlan, getMealPlan, getMealPlans, saveMealPlan } from "@/services/mealPlanner/mealPlanApi";
import { toMealPlanRequest } from "@/services/mealPlanner/toMealPlanRequest";

type Options = {
  mealPlan: DayPlanViewModel[];
  mealPlanName: string;
  openedPlanId: number | null;
  onPlanLoaded: (plan: MealPlanResponse) => void;
  onPlanDeleted: (id: number) => void;
};

export function useMealPlanPersistence({
  mealPlan,
  mealPlanName,
  openedPlanId,
  onPlanLoaded,
  onPlanDeleted,
}: Options) {
  const [savedPlans, setSavedPlans] = useState<MealPlanSummaryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMealPlans = useCallback(async () => {
    try {
      setError(null);
      setSavedPlans(await getMealPlans());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load meal plans");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMealPlans();
  }, [loadMealPlans]);

  const saveCurrentPlan = useCallback(async () => {
    setIsSaving(true);
    try {
      const payload = toMealPlanRequest(mealPlanName, mealPlan);
      const savedPlan = await saveMealPlan(payload, openedPlanId ?? undefined);
      onPlanLoaded(savedPlan);
      await loadMealPlans();
      return savedPlan;
    } finally {
      setIsSaving(false);
    }
  }, [loadMealPlans, mealPlan, mealPlanName, onPlanLoaded, openedPlanId]);

  const openPlan = useCallback(async (id: number) => {
    const plan = await getMealPlan(id);
    onPlanLoaded(plan);
  }, [onPlanLoaded]);

  const removePlan = useCallback(async (id: number) => {
    await deleteMealPlan(id);
    setSavedPlans((plans) => plans.filter((plan) => plan.id !== id));
    onPlanDeleted(id);
  }, [onPlanDeleted]);

  return {
    savedPlans,
    isLoading,
    isSaving,
    error,
    loadMealPlans,
    saveCurrentPlan,
    openPlan,
    removePlan,
  };
}
