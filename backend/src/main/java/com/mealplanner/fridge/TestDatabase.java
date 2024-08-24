package com.mealplanner.fridge;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TestDatabase {
    @Bean
    CommandLineRunner initDatabase(ProductRepository productRepository, ProductCategoryService categoryService) {
        return args -> {
            addCategories(categoryService);
            addProducts(productRepository);
        };
    }

    private void addCategories(ProductCategoryService service) {
        ProductCategory dairy = new ProductCategory("Dairy", "Milk and cheese products");
        service.createCategory(dairy);
        service.createCategory("Drink");
        //service.createCategory("Meat");
        // TODO: make that "Category name already exists" doesnt
        //  prevent application from starting
    }

    private void addProducts(ProductRepository repository) {
        Product milk = new Product("Milk", "1 liter of milk");
        repository.save(milk);
        repository.save(new Product("Product 1", "Description for product 1", 10.00));
        repository.save(new Product("Product 2", "Description for product 2", 20.00));
        repository.save(new Product("Product 3", "Description for product 3", 30.00));
    }
}
