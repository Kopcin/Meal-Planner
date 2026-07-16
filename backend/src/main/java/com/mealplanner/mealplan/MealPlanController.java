package com.mealplanner.mealplan;

import com.mealplanner.mealplan.dto.MealPlanRequest;
import com.mealplanner.mealplan.dto.MealPlanResponse;
import com.mealplanner.mealplan.dto.MealPlanSummaryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

@RestController
@RequestMapping("api/meal-plans")
@RequiredArgsConstructor
public class MealPlanController {

    private final MealPlanService service;

    @GetMapping("/{id}")
    public MealPlanResponse get(@PathVariable Long id) {
        return service.findById(id);
    }

    @GetMapping
    public Collection<MealPlanSummaryResponse> findPlans() {
        return service.findAll();
    }

    @PostMapping
    public MealPlanResponse create(@RequestBody MealPlanRequest request) {
        return service.create(request);
    }
}
