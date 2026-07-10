package com.mealplanner.mealplan.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
public class MealPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private LocalDate startDate;

    @CreationTimestamp
    private LocalDateTime creationDate;

    @OneToMany(
            mappedBy = "mealPlan",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<DayPlan> dayPlans = new ArrayList<>();

    public void addDayPlan(DayPlan dayPlan) {
        dayPlans.add(dayPlan);
        dayPlan.setMealPlan(this);
    }
}
