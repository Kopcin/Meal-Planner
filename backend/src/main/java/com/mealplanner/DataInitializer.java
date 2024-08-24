package com.mealplanner;

import com.mealplanner.fridge.ProductCategoryController;
import com.mealplanner.fridge.ProductCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    @Autowired
    private ProductCategoryService categoryService;

    @Override
    public void run(String... args) throws Exception {
        categoryService.createCategory("Meat");
        categoryService.createCategory("Dairy Products", "Products made from milk");
        categoryService.createCategory("Beverages", "Drinks and beverages");
    }
}
