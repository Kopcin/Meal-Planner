package com.mealplanner.mealplan.dto;

import java.time.LocalDate;
import java.util.List;

public record DayPlanRequest(
        LocalDate date,
        List<MealSlotRequest> mealSlots
) {
}
