package com.mealplanner.mealplan;

import com.mealplanner.mealplan.dto.*;
import com.mealplanner.mealplan.entity.DayPlan;
import com.mealplanner.mealplan.entity.MealPlan;
import com.mealplanner.mealplan.entity.MealSlot;
import com.mealplanner.recipe.Recipe;
import com.mealplanner.recipe.RecipeRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MealPlanService {
    private final MealPlanMapper mealPlanMapper;
    private final MealPlanRepository mealPlanRepository;
    private final RecipeRepository recipeRepository;

    public MealPlanResponse create(MealPlanRequest request) {
        MealPlan plan = buildMealPlan(new MealPlan(), request);

        MealPlan savedPlan = mealPlanRepository.save(plan);

        return mealPlanMapper.toResponse(savedPlan);
    }

    public MealPlanResponse findById(Long id) {

        MealPlan plan = mealPlanRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Meal plan not found"));

        return mealPlanMapper.toResponse(plan);
    }

    public List<MealPlanSummaryResponse> findAll() {

        return mealPlanRepository.findAll()
                .stream()
                .map(mealPlanMapper::toSummary)
                .toList();
    }

    public MealPlanResponse update(Long id, MealPlanRequest request) {
        MealPlan plan = mealPlanRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Meal plan not found"));

        plan.getDayPlans().clear();

        MealPlan updatedPlan = buildMealPlan(plan, request);

        MealPlan savedPlan = mealPlanRepository.save(updatedPlan);

        return mealPlanMapper.toResponse(savedPlan);
    }

    private MealPlan buildMealPlan(MealPlan plan, MealPlanRequest request) {

        plan.setName(request.name());
        plan.setStartDate(request.startDate());

        for (DayPlanRequest dayRequest : request.dayPlans()) {

            DayPlan day = new DayPlan();
            day.setDate(dayRequest.date());

            for (MealSlotRequest mealRequest : dayRequest.mealSlots()) {

                MealSlot meal = new MealSlot();
                meal.setLabel(mealRequest.label());

                if (mealRequest.recipeId() != null) {
                    Recipe recipe = recipeRepository
                            .findById(mealRequest.recipeId())
                            .orElseThrow(() ->
                                    new EntityNotFoundException("Recipe not found")
                            );
                    meal.setRecipe(recipe);
                }
                day.addMealSlot(meal);
            }
            plan.addDayPlan(day);
        }

        return plan;
    }
}
