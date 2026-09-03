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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private final ProductCategoryService categoryService;
    private final ProductRepository productRepository;
    private final RecipeService recipeService;

    @Override
    public void run(String... args) throws Exception {
        User testUser = createUserIfNotExists("testuser", "testuser@dev.local");
        User testUser2 = createUserIfNotExists("testuser2", "testuser2@dev.local");
        createCategories();
        createProducts(testUser);
        createRecipes(testUser, false);
        createProducts(testUser2);
        createRecipes(testUser2, true);
        createAdminIfNotExists();
    }

    private User createUserIfNotExists(String username, String email) {
        return userRepository.findByUsername(username).orElseGet(() -> userRepository.save(
                User.builder()
                        .username(username)
                        .email(email)
                        .password(passwordEncoder.encode("1234"))
                        .role(Role.USER)
                        .build()));
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

    private void createProducts(User owner) {
        if (!productRepository.findByUserId(owner.getId()).isEmpty()) {
            return;
        }

        productRepository.save(product("Milk", "1 liter of milk", null, owner));
        productRepository.save(product("Product 1", "Description for product 1", 10.00, owner));
        productRepository.save(product("Product 2", "Description for product 2", 20.00, owner));
        productRepository.save(product("Product 3", "Description for product 3", 30.00, owner));
        productRepository.save(product("ham", "just ham", 16.99, LocalDate.now().plusDays(5), owner));
        productRepository.save(product("cheese", "", 8.99, LocalDate.now().plusDays(12), owner));
        productRepository.save(product("bread", "", 3.20, LocalDate.now().plusDays(6), owner));
        productRepository.save(product("chicken breast", "Boneless chicken breast", 15.00, LocalDate.now().plusDays(7), owner));
        productRepository.save(product("tomato", "Fresh tomatoes", 4.99, LocalDate.now().plusDays(3), owner));
        productRepository.save(product("cucumber", "Green cucumber", 2.50, LocalDate.now().plusDays(10), owner));
        productRepository.save(product("butter", "Salted butter", 5.50, LocalDate.now().plusDays(14), owner));
        productRepository.save(product("lettuce", "Fresh lettuce", 2.30, LocalDate.now().plusDays(2), owner));
        productRepository.save(product("pasta", "Pasta (spaghetti)", 2.99, LocalDate.now().plusDays(20), owner));
        productRepository.save(product("tomato sauce", "Tomato sauce (jar)", 4.50, LocalDate.now().plusDays(30), owner));
        productRepository.save(product("parmesan", "Parmesan cheese (grated)", 6.00, LocalDate.now().plusDays(45), owner));
        productRepository.save(product("basil", "Fresh basil", 1.80, LocalDate.now().plusDays(120), owner));
    }

    private Product product(String name, String description, Double price, User owner) {
        return product(name, description, price, null, owner);
    }

    private Product product(String name, String description, Double price, LocalDate expirationDate, User owner) {
        Product product = new Product(name, description, price, expirationDate);
        product.setUser(owner);
        return product;
    }

    private void createRecipes(User owner, boolean onlyThree) {
        if (!recipeService.findAllRecipes(owner).isEmpty()) {
            return;
        }

        List<Product> allExistingProducts = productRepository.findByUserId(owner.getId());

        if (onlyThree) {
            createThreeRecipes(owner, allExistingProducts);
            return;
        }

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

        recipeService.createRecipe(spaghetti, owner);

        Recipe sandwich = new Recipe(
                "Sandwich",
                "Quick and tasty snack",
                allExistingProducts.stream()
                        .filter(product ->
                                product.getName().equalsIgnoreCase("bread") ||
                                        product.getName().equalsIgnoreCase("ham"))
                        .toList(),
                List.of("lettuce", "tomato"));

        recipeService.createRecipe(sandwich, owner);

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

        recipeService.createRecipe(salad, owner);

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

        recipeService.createRecipe(pancakes, owner);

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

        recipeService.createRecipe(smoothie, owner);

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

        recipeService.createRecipe(chickenSalad, owner);

        Recipe grilledChicken = new Recipe(
                "Grilled Chicken",
                "Tender and juicy grilled chicken",
                allExistingProducts.stream()
                        .filter(product ->
                                product.getName().equalsIgnoreCase("chicken breast"))
                        .toList(),
                List.of("garlic", "paprika", "olive oil"));

        recipeService.createRecipe(grilledChicken, owner);

        Recipe tomatoSoup = new Recipe(
                "Tomato Soup",
                "Warm and comforting tomato soup",
                allExistingProducts.stream()
                        .filter(product ->
                                product.getName().equalsIgnoreCase("tomato"))
                        .toList(),
                List.of("onion", "garlic", "cream"));

        recipeService.createRecipe(tomatoSoup, owner);

        Recipe cucumberSalad = new Recipe(
                "Cucumber Salad",
                "Refreshing cucumber salad",
                allExistingProducts.stream()
                        .filter(product ->
                                product.getName().equalsIgnoreCase("cucumber") ||
                                        product.getName().equalsIgnoreCase("lettuce"))
                        .toList(),
                List.of("olive oil", "lemon juice"));

        recipeService.createRecipe(cucumberSalad, owner);

        Recipe butteredToast = new Recipe(
                "Buttered Toast",
                "Simple but delicious buttered toast",
                allExistingProducts.stream()
                        .filter(product ->
                                product.getName().equalsIgnoreCase("butter"))
                        .toList(),
                List.of());

        recipeService.createRecipe(butteredToast, owner);

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

        recipeService.createRecipe(pastaWithTomatoSauce, owner);
    }

    private void createThreeRecipes(User owner, List<Product> products) {
        Recipe sandwich = new Recipe("Sandwich", "Quick and tasty snack",
                products.stream().filter(product -> product.getName().equalsIgnoreCase("bread")
                        || product.getName().equalsIgnoreCase("ham")).toList(),
                List.of("lettuce", "tomato"));
        recipeService.createRecipe(sandwich, owner);

        Recipe salad = new Recipe("Fresh Salad", "Healthy green salad",
                products.stream().filter(product -> product.getName().equalsIgnoreCase("lettuce")
                        || product.getName().equalsIgnoreCase("cucumber")
                        || product.getName().equalsIgnoreCase("cheese")).toList(),
                List.of("olive oil", "vinegar"));
        recipeService.createRecipe(salad, owner);

        Recipe pancakes = new Recipe("Pancakes", "Fluffy breakfast pancakes",
                products.stream().filter(product -> product.getName().equalsIgnoreCase("milk")).toList(),
                List.of("flour", "eggs", "syrup"));
        recipeService.createRecipe(pancakes, owner);
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
