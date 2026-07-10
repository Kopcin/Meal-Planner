package com.mealplanner.mealplan.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
public class DayPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    private MealPlan mealPlan;

    @OneToMany(
            mappedBy = "dayPlan",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<MealSlot> mealSlots = new ArrayList<>();

    public void addMealSlot(MealSlot mealSlot) {
        mealSlots.add(mealSlot);
        mealSlot.setDayPlan(this);
    }
}
