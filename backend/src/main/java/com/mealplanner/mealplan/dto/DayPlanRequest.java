package com.mealplanner.mealplan.dto;

import java.time.LocalDate;
import java.util.List;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record DayPlanRequest(
        @NotNull(message = "Day date is required") LocalDate date,
        @NotNull(message = "Meal slots are required") @Valid List<MealSlotRequest> mealSlots
) {
}
