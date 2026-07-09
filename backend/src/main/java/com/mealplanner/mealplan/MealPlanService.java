package com.mealplanner.mealplan;

import com.mealplanner.mealplan.dto.CreateDayPlanRequest;
import com.mealplanner.mealplan.dto.CreateMealPlanRequest;
import com.mealplanner.mealplan.dto.CreateMealSlotRequest;
import com.mealplanner.mealplan.entity.DayPlan;
import com.mealplanner.mealplan.entity.MealPlan;
import com.mealplanner.mealplan.entity.MealSlot;
import com.mealplanner.recipe.Recipe;
import com.mealplanner.recipe.RecipeRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Service
@RequiredArgsConstructor
public class MealPlanService {
    private final MealPlanRepository mealPlanRepository;
    private final RecipeRepository recipeRepository;

    public MealPlan create(CreateMealPlanRequest request) {

        MealPlan plan = new MealPlan();

        plan.setName(request.name());
        plan.setStartDate(request.startDate());

        for (CreateDayPlanRequest dayRequest : request.dayPlans()) {

            DayPlan day = new DayPlan();

            day.setDate(dayRequest.date());

            for (CreateMealSlotRequest mealRequest : dayRequest.mealSlots()) {

                MealSlot meal = new MealSlot();

                meal.setLabel(mealRequest.label());

                if (mealRequest.recipeId() != null) {
                    Recipe recipe = recipeRepository
                            .findById(mealRequest.recipeId())
                            .orElseThrow();

                    meal.setRecipe(recipe);
                }

                day.addMealSlot(meal);
            }

            plan.addDayPlan(day);
        }

        return mealPlanRepository.save(plan);
    }

    public MealPlan findById(Long id) {

        return mealPlanRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException("Meal plan not found")
                );
    }

    public Collection<MealPlan> findAll() {
        return mealPlanRepository.findAll();
    }
}
