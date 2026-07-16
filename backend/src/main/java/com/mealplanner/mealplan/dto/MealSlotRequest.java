package com.mealplanner.mealplan.dto;

public record MealSlotRequest(
        String label,
        Long recipeId
) {
}
