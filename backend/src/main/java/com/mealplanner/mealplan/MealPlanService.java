package com.mealplanner.mealplan;

import com.mealplanner.auth.user.User;
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

    public MealPlanResponse create(MealPlanRequest request, User user) {
        MealPlan plan = new MealPlan();
        plan.setUser(user);
        plan = buildMealPlan(plan, request);

        MealPlan savedPlan = mealPlanRepository.save(plan);

        return mealPlanMapper.toResponse(savedPlan);
    }

    public MealPlanResponse findById(Long id, User user) {

        MealPlan plan = mealPlanRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new EntityNotFoundException("Meal plan not found"));

        return mealPlanMapper.toResponse(plan);
    }

    public List<MealPlanSummaryResponse> findAll(User user) {

        return mealPlanRepository.findAllByUser(user)
                .stream()
                .map(mealPlanMapper::toSummary)
                .toList();
    }

    public MealPlanResponse update(Long id, MealPlanRequest request, User user) {
        MealPlan plan = mealPlanRepository.findByIdAndUser(id, user)
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
                            .findByIdAndUser(mealRequest.recipeId(), plan.getUser())
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
