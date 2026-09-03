package com.mealplanner.mealplan;

import com.mealplanner.auth.user.User;
import com.mealplanner.mealplan.dto.MealPlanRequest;
import com.mealplanner.mealplan.dto.MealPlanResponse;
import com.mealplanner.mealplan.dto.MealPlanSummaryResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import java.util.Collection;

@RestController
@RequestMapping("/api/meal-plans")
@RequiredArgsConstructor
public class MealPlanController {

    private final MealPlanService service;

    @GetMapping("/{id}")
    public MealPlanResponse get(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return service.findById(id, user);
    }

    @GetMapping
    public Collection<MealPlanSummaryResponse> findPlans(@AuthenticationPrincipal User user) {
        return service.findAll(user);
    }

    @PostMapping
    public MealPlanResponse create(@Valid @RequestBody MealPlanRequest request, @AuthenticationPrincipal User user) {
        return service.create(request, user);
    }

    @PutMapping("/{id}")
    public MealPlanResponse update(@PathVariable Long id, @Valid @RequestBody MealPlanRequest request,
                                   @AuthenticationPrincipal User user) {
        return service.update(id, request, user);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id, @AuthenticationPrincipal User user) {
        service.delete(id, user);
    }
}
