package com.mealplanner.mealplan;

import com.mealplanner.mealplan.dto.DayPlanResponse;
import com.mealplanner.mealplan.dto.MealPlanResponse;
import com.mealplanner.mealplan.dto.MealPlanSummaryResponse;
import com.mealplanner.mealplan.dto.MealSlotResponse;
import com.mealplanner.mealplan.entity.DayPlan;
import com.mealplanner.mealplan.entity.MealPlan;
import com.mealplanner.mealplan.entity.MealSlot;
import org.springframework.stereotype.Component;

@Component
public class MealPlanMapper {
    public MealPlanResponse toResponse(MealPlan mealPlan) {
        return new MealPlanResponse(
                mealPlan.getId(),
                mealPlan.getName(),
                mealPlan.getStartDate(),
                mealPlan.getDayPlans()
                        .stream()
                        .map(this::toResponse)
                        .toList()
        );
    }

    public MealPlanSummaryResponse toSummary(MealPlan mealPlan) {
        return new MealPlanSummaryResponse(
                mealPlan.getId(),
                mealPlan.getName(),
                mealPlan.getStartDate()
        );
    }

    public DayPlanResponse toResponse(DayPlan dayPlan) {
        return new DayPlanResponse(
                dayPlan.getId(),
                dayPlan.getDate(),
                dayPlan.getMealSlots()
                        .stream()
                        .map(this::toResponse)
                        .toList()
        );
    }

    public MealSlotResponse toResponse(MealSlot mealSlot) {
        return new MealSlotResponse(
                mealSlot.getId(),
                mealSlot.getLabel(),
                mealSlot.getRecipe() != null ? mealSlot.getRecipe().getId() : null,
                mealSlot.getRecipe() != null ? mealSlot.getRecipe().getTitle() : null
        );
    }
}
