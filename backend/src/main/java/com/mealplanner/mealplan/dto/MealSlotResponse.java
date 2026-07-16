package com.mealplanner.mealplan.dto;

public record MealSlotResponse(
        Long id,
        String label,
        Long recipeId,
        String recipeName
) {
}
