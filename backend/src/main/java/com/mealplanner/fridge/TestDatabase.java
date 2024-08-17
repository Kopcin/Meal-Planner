package com.mealplanner.fridge;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;

@Configuration
public class TestDatabase {
    @Bean
    CommandLineRunner initDatabase(ProductRepository repository) {
        return args -> {
            repository.save(new Product("Product 1", "Description for product 1", 10.00));
            repository.save(new Product("Product 2", "Description for product 2", 20.00));
            repository.save(new Product("Product 3", "Description for product 3", 30.00));
        };
    }
}
