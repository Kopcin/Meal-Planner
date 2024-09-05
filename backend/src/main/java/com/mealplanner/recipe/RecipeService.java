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

    public void createRecipe(String name) {
        createRecipe(new Recipe(name));
    }

    public void createRecipe(String name, String description) {
        createRecipe(new Recipe(name, description));
    }

    public Recipe createRecipe(Recipe recipe) {
        if (recipeRepository.existsByName(recipe.getName())) {
            throw new IllegalArgumentException("Recipe name " + recipe.getName() + " already exists");
        }
        return recipeRepository.save(recipe);
    }

    public void deleteRecipeById(Long id) {
        if (recipeRepository.existsById(id)) {
            recipeRepository.deleteById(id);
        }
    }
}
