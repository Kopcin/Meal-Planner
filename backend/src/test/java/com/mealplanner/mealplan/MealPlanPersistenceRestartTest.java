package com.mealplanner.mealplan;

import com.mealplanner.MealPlannerApplication;
import com.mealplanner.auth.user.User;
import com.mealplanner.auth.user.UserRepository;
import com.mealplanner.mealplan.entity.DayPlan;
import com.mealplanner.mealplan.entity.MealPlan;
import com.mealplanner.mealplan.entity.MealSlot;
import com.mealplanner.recipe.Recipe;
import com.mealplanner.recipe.RecipeRepository;
import org.junit.jupiter.api.Test;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

import java.time.LocalDate;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class MealPlanPersistenceRestartTest {

    @Test
    void savedMealPlanSurvivesBackendRestart() {
        String planName = "restart-test-" + UUID.randomUUID();
        Long savedPlanId;
        Long userId;

        try (ConfigurableApplicationContext firstBackend = startBackend()) {
            UserRepository users = firstBackend.getBean(UserRepository.class);
            MealPlanRepository mealPlans = firstBackend.getBean(MealPlanRepository.class);
            RecipeRepository recipes = firstBackend.getBean(RecipeRepository.class);
            User user = users.findByUsername("testuser").orElseThrow();
            Recipe recipe = recipes.findAllByUser(user).stream().findFirst().orElseThrow();

            MealPlan plan = new MealPlan();
            plan.setName(planName);
            plan.setStartDate(LocalDate.now());
            plan.setUser(user);

            DayPlan day = new DayPlan();
            day.setDate(LocalDate.now());
            MealSlot meal = new MealSlot();
            meal.setLabel("Test meal");
            meal.setRecipe(recipe);
            day.addMealSlot(meal);
            plan.addDayPlan(day);

            savedPlanId = mealPlans.saveAndFlush(plan).getId();
            userId = user.getId();
        }

        try (ConfigurableApplicationContext restartedBackend = startBackend()) {
            UserRepository users = restartedBackend.getBean(UserRepository.class);
            MealPlanRepository mealPlans = restartedBackend.getBean(MealPlanRepository.class);
            User restartedUser = users.findById(userId).orElseThrow();
            TransactionTemplate transaction = new TransactionTemplate(
                    restartedBackend.getBean(PlatformTransactionManager.class));

            try {
                transaction.executeWithoutResult(status -> {
                    MealPlan persistedPlan = mealPlans.findByIdAndUser(savedPlanId, restartedUser)
                            .orElseThrow();
                    assertThat(persistedPlan.getName()).isEqualTo(planName);
                    assertThat(persistedPlan.getDayPlans()).hasSize(1);
                    assertThat(persistedPlan.getDayPlans().getFirst().getMealSlots()).hasSize(1);
                    assertThat(persistedPlan.getDayPlans().getFirst().getMealSlots().getFirst().getRecipe())
                            .isNotNull();
                });
            } finally {
                mealPlans.deleteById(savedPlanId);
                mealPlans.flush();
            }
        }
    }

    private ConfigurableApplicationContext startBackend() {
        return new SpringApplicationBuilder(MealPlannerApplication.class)
                .web(WebApplicationType.SERVLET)
                .properties("server.port=0")
                .run();
    }
}
