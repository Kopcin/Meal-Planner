package com.mealplanner.mealplan.dto;

import java.time.LocalDate;
import java.util.List;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record MealPlanRequest(
        @NotBlank(message = "Plan name is required") String name,
        @NotNull(message = "Start date is required") LocalDate startDate,
        @NotEmpty(message = "At least one day is required") @Valid List<DayPlanRequest> dayPlans
) {
}
