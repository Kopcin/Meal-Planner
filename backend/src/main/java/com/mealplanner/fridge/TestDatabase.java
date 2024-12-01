package com.mealplanner.fridge;

import com.mealplanner.recipe.Recipe;
import com.mealplanner.recipe.RecipeRepository;
import com.mealplanner.recipe.RecipeService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.sql.Array;
import java.sql.Date;
import java.text.DateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Configuration
public class TestDatabase {
    @Bean
    CommandLineRunner initDatabase(ProductRepository productRepository, ProductCategoryService categoryService, RecipeService recipeService) {
        return args -> {
            addCategories(categoryService);
            addProducts(productRepository);
            addRecipes(recipeService, productRepository);
        };
    }

    private void addCategories(ProductCategoryService service) {
        ProductCategory dairy = new ProductCategory("Dairy", "Milk and cheese products");
        service.createCategory(dairy);
        service.createCategory("Drink");
        //service.createCategory("Meat");
        // TODO: make that "Category name already exists" doesn't
        //  prevent application from starting
    }

    private void addProducts(ProductRepository repository) {
        Product milk = new Product("Milk", "1 liter of milk");
        repository.save(milk);
        repository.save(new Product("Product 1", "Description for product 1", 10.00));
        repository.save(new Product("Product 2", "Description for product 2", 20.00));
        repository.save(new Product("Product 3", "Description for product 3", 30.00));
        repository.save(new Product("ham", "just ham", 16.99, LocalDate.now().plusDays(5)));
        repository.save(new Product("cheese", "", 8.99, LocalDate.now().plusDays(12)));
        repository.save(new Product("bread", "", 3.20, LocalDate.now().plusDays(6)));
    }

    private void addRecipes(RecipeService service, ProductRepository productRepository) {
        List<Product> allExistingProducts = productRepository.findAll();

        String searchTerm = "cheese";
        Optional<Product> foundProduct = allExistingProducts.stream()
                .filter(product -> product.getName().equalsIgnoreCase(searchTerm))
                .findFirst();

        List<Product> products = new ArrayList<>();
        foundProduct.ifPresent(products::add);

        Recipe spaghetti = new Recipe("Spaghetti bolognese", "", products, List.of());
        service.createRecipe(spaghetti);

        Recipe sandwich = new Recipe(
                "Sandwich",
                "Quick and tasty snack",
                allExistingProducts.stream()
                        .filter(product -> product.getName().equalsIgnoreCase("bread") ||
                                product.getName().equalsIgnoreCase("ham"))
                        .toList(),
                List.of("lettuce", "tomato"));
        service.createRecipe(sandwich);

        Recipe salad = new Recipe(
                "Fresh Salad",
                "Healthy green salad",
                allExistingProducts.stream()
                        .filter(product -> product.getName().equalsIgnoreCase("lettuce") ||
                                product.getName().equalsIgnoreCase("cucumber") ||
                                product.getName().equalsIgnoreCase("cheese"))
                        .toList(),
                List.of("olive oil", "vinegar"));
        service.createRecipe(salad);

        Recipe pancakes = new Recipe(
                "Pancakes",
                "Fluffy breakfast pancakes",
                allExistingProducts.stream()
                        .filter(product -> product.getName().equalsIgnoreCase("flour") ||
                                product.getName().equalsIgnoreCase("eggs") ||
                                product.getName().equalsIgnoreCase("milk"))
                        .toList(),
                List.of("syrup"));
        service.createRecipe(pancakes);

        // Przepis 5: Smoothie
        Recipe smoothie = new Recipe(
                "Berry Smoothie",
                "Refreshing drink",
                allExistingProducts.stream()
                        .filter(product -> product.getName().equalsIgnoreCase("yogurt") ||
                                product.getName().equalsIgnoreCase("strawberries") ||
                                product.getName().equalsIgnoreCase("bananas"))
                        .toList(),
                List.of());
        service.createRecipe(smoothie);

    }
}
