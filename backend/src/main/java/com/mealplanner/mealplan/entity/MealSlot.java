package com.mealplanner.mealplan.entity;

import com.mealplanner.recipe.Recipe;
import jakarta.persistence.*;
import lombok.Setter;

@Entity
@Setter
public class MealSlot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String label;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(nullable = false)
    private DayPlan dayPlan;

    @ManyToOne(fetch = FetchType.LAZY)
    private Recipe recipe;
}
