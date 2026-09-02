package com.mealplanner.recipe;

import com.mealplanner.auth.user.User;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
    public Recipe findRecipeById(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return recipeService.findRecipeById(id, user)
                .orElseThrow(() -> new RecipeNotFoundException(id));
    }

    @GetMapping("/")
    @ResponseStatus(HttpStatus.OK)
    public Collection<Recipe> findRecipes(@AuthenticationPrincipal User user) {
        return recipeService.findAllRecipes(user);
    }

    @PostMapping("/")
    @ResponseStatus(HttpStatus.CREATED)
    public Recipe createRecipe(@RequestBody Recipe recipe, @AuthenticationPrincipal User user) {
        return recipeService.createRecipe(recipe, user);
    }

    // TODO: put mapping

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteRecipe(@PathVariable Long id, @AuthenticationPrincipal User user) {
        if (recipeService.findRecipeById(id, user).isEmpty()) {
            throw new RecipeNotFoundException(id);
        }
        recipeService.deleteRecipeById(id, user);
    }
}
