package com.mealplanner.fridge;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class ProductCategoryNotFoundException extends RuntimeException {
    public ProductCategoryNotFoundException(Long id) {
        super("Category not found with id: " + id);
    }
}
