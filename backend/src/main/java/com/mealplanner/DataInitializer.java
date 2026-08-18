package com.mealplanner;

import com.mealplanner.auth.user.Role;
import com.mealplanner.auth.user.User;
import com.mealplanner.auth.user.UserRepository;
import com.mealplanner.fridge.Product;
import com.mealplanner.fridge.ProductCategoryService;
import com.mealplanner.fridge.ProductRepository;
import com.mealplanner.recipe.Recipe;
import com.mealplanner.recipe.RecipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Component
@Profile("dev")
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private final ProductCategoryService categoryService;
    private final ProductRepository productRepository;
    private final RecipeService recipeService;

    @Override
    public void run(String... args) throws Exception {
        createCategories();
        createProducts();
        createRecipes();
        createAdminIfNotExists();
    }

    private void createCategories() {
        if (!categoryExists("Meat")) {
            categoryService.createCategory("Meat");
        }

        if (!categoryExists("Dairy Products")) {
            categoryService.createCategory(
                    "Dairy Products",
                    "Products made from milk"
            );
        }

        if (!categoryExists("Beverages")) {
            categoryService.createCategory(
                    "Beverages",
                    "Drinks and beverages"
            );
        }
    }

    private boolean categoryExists(String name) {
        return categoryService.findAllCategories()
                .stream()
                .anyMatch(category -> category.getName().equalsIgnoreCase(name));
    }

    private void createProducts() {
        if (productRepository.count() > 0) {
            return;
        }

        Product milk = new Product("Milk", "1 liter of milk");
        productRepository.save(milk);

        productRepository.save(
                new Product("Product 1", "Description for product 1", 10.00));

        productRepository.save(
                new Product("Product 2", "Description for product 2", 20.00));

        productRepository.save(
                new Product("Product 3", "Description for product 3", 30.00));

        productRepository.save(
                new Product("ham", "just ham", 16.99,
                        LocalDate.now().plusDays(5)));

        productRepository.save(
                new Product("cheese", "", 8.99,
                        LocalDate.now().plusDays(12)));

        productRepository.save(
                new Product("bread", "", 3.20,
                        LocalDate.now().plusDays(6)));

        productRepository.save(
                new Product("chicken breast", "Boneless chicken breast", 15.00,
                        LocalDate.now().plusDays(7)));

        productRepository.save(
                new Product("tomato", "Fresh tomatoes", 4.99,
                        LocalDate.now().plusDays(3)));

        productRepository.save(
                new Product("cucumber", "Green cucumber", 2.50,
                        LocalDate.now().plusDays(10)));

        productRepository.save(
                new Product("butter", "Salted butter", 5.50,
                        LocalDate.now().plusDays(14)));

        productRepository.save(
                new Product("lettuce", "Fresh lettuce", 2.30,
                        LocalDate.now().plusDays(2)));

        productRepository.save(
                new Product("pasta", "Pasta (spaghetti)", 2.99,
                        LocalDate.now().plusDays(20)));

        productRepository.save(
                new Product("tomato sauce", "Tomato sauce (jar)", 4.50,
                        LocalDate.now().plusDays(30)));

        productRepository.save(
                new Product("parmesan", "Parmesan cheese (grated)", 6.00,
                        LocalDate.now().plusDays(45)));

        productRepository.save(
                new Product("basil", "Fresh basil", 1.80,
                        LocalDate.now().plusDays(120)));
    }

    private void createRecipes() {
        if (recipeService.findAllRecipes().stream()
                .anyMatch(recipe ->
                        recipe.getTitle().equalsIgnoreCase("Spaghetti bolognese"))) {
            return;
        }

        List<Product> allExistingProducts = productRepository.findAll();

        String searchTerm = "cheese";

        Optional<Product> foundProduct = allExistingProducts.stream()
                .filter(product ->
                        product.getName().equalsIgnoreCase(searchTerm))
                .findFirst();

        List<Product> products = new ArrayList<>();
        foundProduct.ifPresent(products::add);

        Recipe spaghetti = new Recipe(
                "Spaghetti bolognese",
                "",
                products,
                List.of());

        recipeService.createRecipe(spaghetti);

        Recipe sandwich = new Recipe(
                "Sandwich",
                "Quick and tasty snack",
                allExistingProducts.stream()
                        .filter(product ->
                                product.getName().equalsIgnoreCase("bread") ||
                                        product.getName().equalsIgnoreCase("ham"))
                        .toList(),
                List.of("lettuce", "tomato"));

        recipeService.createRecipe(sandwich);

        Recipe salad = new Recipe(
                "Fresh Salad",
                "Healthy green salad",
                allExistingProducts.stream()
                        .filter(product ->
                                product.getName().equalsIgnoreCase("lettuce") ||
                                        product.getName().equalsIgnoreCase("cucumber") ||
                                        product.getName().equalsIgnoreCase("cheese"))
                        .toList(),
                List.of("olive oil", "vinegar"));

        recipeService.createRecipe(salad);

        Recipe pancakes = new Recipe(
                "Pancakes",
                "Fluffy breakfast pancakes",
                allExistingProducts.stream()
                        .filter(product ->
                                product.getName().equalsIgnoreCase("flour") ||
                                        product.getName().equalsIgnoreCase("eggs") ||
                                        product.getName().equalsIgnoreCase("milk"))
                        .toList(),
                List.of("syrup"));

        recipeService.createRecipe(pancakes);

        Recipe smoothie = new Recipe(
                "Berry Smoothie",
                "Refreshing drink",
                allExistingProducts.stream()
                        .filter(product ->
                                product.getName().equalsIgnoreCase("yogurt") ||
                                        product.getName().equalsIgnoreCase("strawberries") ||
                                        product.getName().equalsIgnoreCase("bananas"))
                        .toList(),
                List.of());

        recipeService.createRecipe(smoothie);

        Recipe chickenSalad = new Recipe(
                "Chicken Salad",
                "A healthy chicken salad with fresh vegetables",
                allExistingProducts.stream()
                        .filter(product ->
                                product.getName().equalsIgnoreCase("chicken breast") ||
                                        product.getName().equalsIgnoreCase("lettuce") ||
                                        product.getName().equalsIgnoreCase("tomato") ||
                                        product.getName().equalsIgnoreCase("cucumber"))
                        .toList(),
                List.of("olive oil", "salt", "pepper"));

        recipeService.createRecipe(chickenSalad);

        Recipe grilledChicken = new Recipe(
                "Grilled Chicken",
                "Tender and juicy grilled chicken",
                allExistingProducts.stream()
                        .filter(product ->
                                product.getName().equalsIgnoreCase("chicken breast"))
                        .toList(),
                List.of("garlic", "paprika", "olive oil"));

        recipeService.createRecipe(grilledChicken);

        Recipe tomatoSoup = new Recipe(
                "Tomato Soup",
                "Warm and comforting tomato soup",
                allExistingProducts.stream()
                        .filter(product ->
                                product.getName().equalsIgnoreCase("tomato"))
                        .toList(),
                List.of("onion", "garlic", "cream"));

        recipeService.createRecipe(tomatoSoup);

        Recipe cucumberSalad = new Recipe(
                "Cucumber Salad",
                "Refreshing cucumber salad",
                allExistingProducts.stream()
                        .filter(product ->
                                product.getName().equalsIgnoreCase("cucumber") ||
                                        product.getName().equalsIgnoreCase("lettuce"))
                        .toList(),
                List.of("olive oil", "lemon juice"));

        recipeService.createRecipe(cucumberSalad);

        Recipe butteredToast = new Recipe(
                "Buttered Toast",
                "Simple but delicious buttered toast",
                allExistingProducts.stream()
                        .filter(product ->
                                product.getName().equalsIgnoreCase("butter"))
                        .toList(),
                List.of());

        recipeService.createRecipe(butteredToast);

        Recipe pastaWithTomatoSauce = new Recipe(
                "Pasta with Tomato Sauce and Cheese",
                "Delicious pasta with a savory tomato sauce topped with parmesan cheese.",
                allExistingProducts.stream()
                        .filter(product ->
                                product.getName().equalsIgnoreCase("pasta") ||
                                        product.getName().equalsIgnoreCase("tomato sauce") ||
                                        product.getName().equalsIgnoreCase("parmesan") ||
                                        product.getName().equalsIgnoreCase("basil"))
                        .toList(),
                List.of("garlic", "olive oil", "salt"));

        recipeService.createRecipe(pastaWithTomatoSauce);
    }

    private void createAdminIfNotExists() {
        boolean exists = userRepository.findByUsername("admin").isPresent();

        if (!exists) {
            User admin = User.builder()
                    .username("admin")
                    .email("admin@dev.local")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .build();

            userRepository.save(admin);

            System.out.println("DEV ADMIN CREATED: admin / admin123");
        }
    }
}
