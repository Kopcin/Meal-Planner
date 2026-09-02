package com.mealplanner.recipe;

import com.mealplanner.auth.user.User;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    boolean existsByTitleAndUser(@NotNull String title, User user);
    java.util.List<Recipe> findAllByUser(User user);
    java.util.Optional<Recipe> findByIdAndUser(Long id, User user);
}
