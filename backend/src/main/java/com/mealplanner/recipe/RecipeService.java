package com.mealplanner.recipe;

import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Optional;

@Service
public class RecipeService {
    private final RecipeRepository recipeRepository;

    public RecipeService(RecipeRepository recipeRepository) {
        this.recipeRepository = recipeRepository;
    }

    public Optional<Recipe> findRecipeById(Long id) {
        return recipeRepository.findById(id);
    }

    public Collection<Recipe> findAllRecipes() {
        return recipeRepository.findAll();
    }

    public void createRecipe(String title) {
        createRecipe(new Recipe(title));
    }

    public void createRecipe(String title, String description) {
        createRecipe(new Recipe(title, description));
    }

    public Recipe createRecipe(Recipe recipe) {
        if (recipeRepository.existsByTitle(recipe.getTitle())) {
            throw new IllegalArgumentException("Recipe " + recipe.getTitle() + " already exists");
        }
        return recipeRepository.save(recipe);
    }

    public void deleteRecipeById(Long id) {
        if (recipeRepository.existsById(id)) {
            recipeRepository.deleteById(id);
        }
    }
}
