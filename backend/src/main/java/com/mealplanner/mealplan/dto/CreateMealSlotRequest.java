package com.mealplanner.mealplan.dto;

public record CreateMealSlotRequest(
        String label,
        Long recipeId
) {
}
