package com.mealplanner.mealplan.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mealplanner.recipe.Recipe;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class MealSlot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String label;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(nullable = false)
    private DayPlan dayPlan;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    private Recipe recipe;
}
