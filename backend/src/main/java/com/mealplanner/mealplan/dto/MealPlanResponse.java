package com.mealplanner.mealplan.dto;

import java.time.LocalDate;
import java.util.List;

public record MealPlanResponse(
        Long id,
        String name,
        LocalDate startDate,
        List<DayPlanResponse> dayPlans
) {
}
