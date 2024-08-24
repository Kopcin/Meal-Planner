package com.mealplanner.fridge;

import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Optional;

/**
 * Service for managing product categories.
 */
@Service
public class ProductCategoryService {
    private final ProductCategoryRepository categoryRepository;

    public ProductCategoryService(ProductCategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public Optional<ProductCategory> findCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    public Collection<ProductCategory> findAllCategories() {
        return categoryRepository.findAll();
    }

    public void createCategory(String name) {
        createCategory(new ProductCategory(name, null));
    }

    public void createCategory(String name, String description) {
        createCategory(new ProductCategory(name, description));
    }

    public ProductCategory createCategory(ProductCategory category) {
        if (categoryRepository.existsByName(category.getName())) {
            throw new IllegalArgumentException("Category name " + category.getName() + " already exists");
        }
        return categoryRepository.save(category);
    }

    public void deleteCategoryById(Long id) {
        if (categoryRepository.existsById(id)) {
            categoryRepository.deleteById(id);
        }
    }
}
