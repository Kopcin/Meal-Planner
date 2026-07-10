package com.mealplanner.mealplan;

import com.mealplanner.mealplan.dto.CreateMealPlanRequest;
import com.mealplanner.mealplan.entity.MealPlan;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

@RestController
@RequestMapping("api/meal-plans")
@RequiredArgsConstructor
public class MealPlanController {

    private final MealPlanService service;

    @GetMapping("/{id}")
    public MealPlan get(@PathVariable Long id) {
        return service.findById(id);
    }

    @GetMapping
    public Collection<MealPlan> findPlans() {
        return service.findAll();
    }

    @PostMapping
    public MealPlan create(@RequestBody CreateMealPlanRequest request) {
        return service.create(request);
    }
}
