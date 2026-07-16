package com.mealplanner.mealplan.dto;

import java.time.LocalDate;
import java.util.List;

public record MealPlanRequest(
        String name,
        LocalDate startDate,
        List<DayPlanRequest> dayPlans
) {
}
