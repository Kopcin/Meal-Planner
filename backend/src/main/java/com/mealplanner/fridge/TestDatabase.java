//package com.mealplanner.fridge;
//
//import com.mealplanner.recipe.Recipe;
//import com.mealplanner.recipe.RecipeService;
//import com.mealplanner.recipe.RecipeRepository;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.context.annotation.Profile;
//import java.time.LocalDate;
//import java.util.ArrayList;
//import java.util.List;
//import java.util.Optional;
//
//@Configuration
//@Profile("dev")
//public class TestDatabase {
//    @Bean
//    CommandLineRunner initDatabase(ProductRepository productRepository,ProductCategoryRepository categoryRepository, ProductCategoryService categoryService, RecipeRepository recipeRepository, RecipeService recipeService) {
//        return args -> {
//
//            addCategories(categoryService);
//            addProducts(productRepository);
//            addRecipes(recipeService, productRepository);
//        };
//    }
//
//    private void addCategories(ProductCategoryService service) {
//        ProductCategory dairy = new ProductCategory("Dairy", "Milk and cheese products");
//        service.createCategory(dairy);
//        service.createCategory("Drink");
//        //service.createCategory("Meat");
//        // TODO: make that "Category name already exists" doesn't
//        //  prevent application from starting
//    }
//
//    private void addProducts(ProductRepository repository) {
//        Product milk = new Product("Milk", "1 liter of milk");
//        repository.save(milk);
//        repository.save(new Product("Product 1", "Description for product 1", 10.00));
//        repository.save(new Product("Product 2", "Description for product 2", 20.00));
//        repository.save(new Product("Product 3", "Description for product 3", 30.00));
//
//        repository.save(new Product("ham", "just ham", 16.99, LocalDate.now().plusDays(5)));
//        repository.save(new Product("cheese", "", 8.99, LocalDate.now().plusDays(12)));
//        repository.save(new Product("bread", "", 3.20, LocalDate.now().plusDays(6)));
//        repository.save(new Product("chicken breast", "Boneless chicken breast", 15.00, LocalDate.now().plusDays(7)));
//        repository.save(new Product("tomato", "Fresh tomatoes", 4.99, LocalDate.now().plusDays(3)));
//        repository.save(new Product("cucumber", "Green cucumber", 2.50, LocalDate.now().plusDays(10)));
//        repository.save(new Product("butter", "Salted butter", 5.50, LocalDate.now().plusDays(14)));
//        repository.save(new Product("lettuce", "Fresh lettuce", 2.30, LocalDate.now().plusDays(2)));
//        repository.save(new Product("pasta", "Pasta (spaghetti)", 2.99, LocalDate.now().plusDays(20)));
//        repository.save(new Product("tomato sauce", "Tomato sauce (jar)", 4.50, LocalDate.now().plusDays(30)));
//        repository.save(new Product("parmesan", "Parmesan cheese (grated)", 6.00, LocalDate.now().plusDays(45)));
//        repository.save(new Product("basil", "Fresh basil", 1.80, LocalDate.now().plusDays(120)));
//    }
//
//    private void addRecipes(RecipeService service, ProductRepository productRepository) {
//        List<Product> allExistingProducts = productRepository.findAll();
//
//        String searchTerm = "cheese";
//        Optional<Product> foundProduct = allExistingProducts.stream()
//                .filter(product -> product.getName().equalsIgnoreCase(searchTerm))
//                .findFirst();
//
//        List<Product> products = new ArrayList<>();
//        foundProduct.ifPresent(products::add);
//
//        Recipe spaghetti = new Recipe("Spaghetti bolognese", "", products, List.of());
//        service.createRecipe(spaghetti);
//
//        Recipe sandwich = new Recipe(
//                "Sandwich",
//                "Quick and tasty snack",
//                allExistingProducts.stream()
//                        .filter(product -> product.getName().equalsIgnoreCase("bread") ||
//                                product.getName().equalsIgnoreCase("ham"))
//                        .toList(),
//                List.of("lettuce", "tomato"));
//        service.createRecipe(sandwich);
//
//        Recipe salad = new Recipe(
//                "Fresh Salad",
//                "Healthy green salad",
//                allExistingProducts.stream()
//                        .filter(product -> product.getName().equalsIgnoreCase("lettuce") ||
//                                product.getName().equalsIgnoreCase("cucumber") ||
//                                product.getName().equalsIgnoreCase("cheese"))
//                        .toList(),
//                List.of("olive oil", "vinegar"));
//        service.createRecipe(salad);
//
//        Recipe pancakes = new Recipe(
//                "Pancakes",
//                "Fluffy breakfast pancakes",
//                allExistingProducts.stream()
//                        .filter(product -> product.getName().equalsIgnoreCase("flour") ||
//                                product.getName().equalsIgnoreCase("eggs") ||
//                                product.getName().equalsIgnoreCase("milk"))
//                        .toList(),
//                List.of("syrup"));
//        service.createRecipe(pancakes);
//
//        Recipe smoothie = new Recipe(
//                "Berry Smoothie",
//                "Refreshing drink",
//                allExistingProducts.stream()
//                        .filter(product -> product.getName().equalsIgnoreCase("yogurt") ||
//                                product.getName().equalsIgnoreCase("strawberries") ||
//                                product.getName().equalsIgnoreCase("bananas"))
//                        .toList(),
//                List.of());
//        service.createRecipe(smoothie);
//
//        Recipe chickenSalad = new Recipe(
//                "Chicken Salad",
//                "A healthy chicken salad with fresh vegetables",
//                allExistingProducts.stream()
//                        .filter(product -> product.getName().equalsIgnoreCase("chicken breast") ||
//                                product.getName().equalsIgnoreCase("lettuce") ||
//                                product.getName().equalsIgnoreCase("tomato") ||
//                                product.getName().equalsIgnoreCase("cucumber"))
//                        .toList(),
//                List.of("olive oil", "salt", "pepper"));
//        service.createRecipe(chickenSalad);
//
//        Recipe grilledChicken = new Recipe(
//                "Grilled Chicken",
//                "Tender and juicy grilled chicken",
//                allExistingProducts.stream()
//                        .filter(product -> product.getName().equalsIgnoreCase("chicken breast"))
//                        .toList(),
//                List.of("garlic", "paprika", "olive oil"));
//        service.createRecipe(grilledChicken);
//
//        Recipe tomatoSoup = new Recipe(
//                "Tomato Soup",
//                "Warm and comforting tomato soup",
//                allExistingProducts.stream()
//                        .filter(product -> product.getName().equalsIgnoreCase("tomato"))
//                        .toList(),
//                List.of("onion", "garlic", "cream"));
//        service.createRecipe(tomatoSoup);
//
//        Recipe cucumberSalad = new Recipe(
//                "Cucumber Salad",
//                "Refreshing cucumber salad",
//                allExistingProducts.stream()
//                        .filter(product -> product.getName().equalsIgnoreCase("cucumber") ||
//                                product.getName().equalsIgnoreCase("lettuce"))
//                        .toList(),
//                List.of("olive oil", "lemon juice"));
//        service.createRecipe(cucumberSalad);
//
//        Recipe butteredToast = new Recipe(
//                "Buttered Toast",
//                "Simple but delicious buttered toast",
//                allExistingProducts.stream()
//                        .filter(product -> product.getName().equalsIgnoreCase("butter"))
//                        .toList(),
//                List.of());
//        service.createRecipe(butteredToast);
//
//        Recipe pastaWithTomatoSauce = new Recipe(
//                "Pasta with Tomato Sauce and Cheese",
//                "Delicious pasta with a savory tomato sauce topped with parmesan cheese.",
//                allExistingProducts.stream()
//                        .filter(product -> product.getName().equalsIgnoreCase("pasta") ||
//                                product.getName().equalsIgnoreCase("tomato sauce") ||
//                                product.getName().equalsIgnoreCase("parmesan") ||
//                                product.getName().equalsIgnoreCase("basil"))
//                        .toList(),
//                List.of("garlic", "olive oil", "salt"));
//        service.createRecipe(pastaWithTomatoSauce);
//    }
//}
