package com.mealplanner.recipe;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

@RestController
@RequestMapping("api/recipe")
public class RecipeController {
    private final RecipeService recipeService;

    public RecipeController(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Recipe findRecipeById(@PathVariable Long id) {
        return recipeService.findRecipeById(id)
                .orElseThrow(() -> new RecipeNotFoundException(id));
    }

    @GetMapping("/")
    @ResponseStatus(HttpStatus.OK)
    public Collection<Recipe> findRecipes() {
        return recipeService.findAllRecipes();
    }

    @PostMapping("/")
    @ResponseStatus(HttpStatus.CREATED)
    public Recipe createRecipe(@RequestBody Recipe recipe) {
        return recipeService.createRecipe(recipe);
    }

    // TODO: put mapping

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteRecipe(@PathVariable Long id) {
        if (recipeService.findRecipeById(id).isEmpty()) {
            throw new RecipeNotFoundException(id);
        }
        recipeService.deleteRecipeById(id);
    }
}
