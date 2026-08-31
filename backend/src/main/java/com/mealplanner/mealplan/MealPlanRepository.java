package com.mealplanner.mealplan;

import com.mealplanner.auth.user.User;
import com.mealplanner.mealplan.entity.MealPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MealPlanRepository extends JpaRepository<MealPlan, Long> {
    List<MealPlan> findAllByUser(User user);

    Optional<MealPlan> findByIdAndUser(Long id, User user);
}
