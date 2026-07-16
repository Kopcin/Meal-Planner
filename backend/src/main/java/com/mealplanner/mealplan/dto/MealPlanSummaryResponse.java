package com.mealplanner.mealplan.dto;

import java.time.LocalDate;

public record MealPlanSummaryResponse(
        Long id,
        String name,
        LocalDate startDate
) {
}
