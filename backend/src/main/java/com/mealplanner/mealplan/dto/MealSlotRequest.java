package com.mealplanner.mealplan.dto;

import jakarta.validation.constraints.NotBlank;

public record MealSlotRequest(
        @NotBlank(message = "Meal label is required") String label,
        Long recipeId
) {
}
