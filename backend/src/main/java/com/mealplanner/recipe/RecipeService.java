package com.mealplanner.recipe;

import com.mealplanner.auth.user.User;
import com.mealplanner.fridge.Product;
import com.mealplanner.fridge.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Service
public class RecipeService {
    private final RecipeRepository recipeRepository;
    private final ProductRepository productRepository;

    public RecipeService(RecipeRepository recipeRepository, ProductRepository productRepository) {
        this.recipeRepository = recipeRepository;
        this.productRepository = productRepository;
    }

    public Optional<Recipe> findRecipeById(Long id, User user) {
        return recipeRepository.findByIdAndUser(id, user);
    }

    public Collection<Recipe> findAllRecipes(User user) {
        return recipeRepository.findAllByUser(user);
    }

    public void createRecipe(String title) {
        createRecipe(new Recipe(title));
    }

    public void createRecipe(String title, List<String> ingredients) {
        createRecipe(new Recipe(title, ingredients));
    }

    public void createRecipe(String title, String description, List<Product> existingProducts, List<String> newProductNames) {
        createRecipe(new Recipe(title, description, existingProducts, newProductNames));
    }

    public Recipe createRecipe(Recipe recipe, User user) {
        if (recipeRepository.existsByTitleAndUser(recipe.getTitle(), user)) {
            throw new IllegalArgumentException("Recipe " + recipe.getTitle() + " already exists");
        }

        if (recipe.getDatabaseProducts() != null) {
            List<Product> ownedProducts = recipe.getDatabaseProducts().stream()
                    .map(product -> productRepository.findByIdAndUserId(product.getId(), user.getId())
                            .orElseThrow(() -> new IllegalArgumentException(
                                    "Product does not belong to the current user: " + product.getId())))
                    .toList();
            recipe.setDatabaseProducts(ownedProducts);
        }

        recipe.setUser(user);
        return recipeRepository.save(recipe);
    }

    public void deleteRecipeById(Long id, User user) {
        recipeRepository.findByIdAndUser(id, user).ifPresent(recipeRepository::delete);
    }

    /**
     * Kept for development data initialization. Application requests should
     * always use createRecipe(recipe, user).
     */
    public Recipe createRecipe(Recipe recipe) {
        return recipeRepository.save(recipe);
    }

    public Collection<Recipe> findAllRecipes() {
        return recipeRepository.findAll();
    }

    public Optional<Recipe> findRecipeById(Long id) {
        return recipeRepository.findById(id);
    }

    public void deleteRecipeById(Long id) {
        if (recipeRepository.existsById(id)) {
            recipeRepository.deleteById(id);
        }
    }
}
