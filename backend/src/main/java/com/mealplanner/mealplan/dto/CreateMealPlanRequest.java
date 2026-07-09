package com.mealplanner.mealplan.dto;

import java.time.LocalDate;
import java.util.List;

public record CreateMealPlanRequest(
        String name,
        LocalDate startDate,
        List<CreateDayPlanRequest> dayPlans
) {
}
