package com.mealplanner.mealplan.dto;

import java.time.LocalDate;
import java.util.List;

public record DayPlanResponse(
        Long id,
        LocalDate date,
        List<MealSlotResponse> mealSlots
) {
}
