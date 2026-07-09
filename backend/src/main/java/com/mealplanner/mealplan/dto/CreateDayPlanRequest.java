package com.mealplanner.mealplan.dto;

import java.time.LocalDate;
import java.util.List;

public record CreateDayPlanRequest(
        LocalDate date,
        List<CreateMealSlotRequest> mealSlots
) {
}
