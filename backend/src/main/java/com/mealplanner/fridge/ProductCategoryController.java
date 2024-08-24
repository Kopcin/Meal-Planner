package com.mealplanner.fridge;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

@RestController
@RequestMapping("/api/category")
public class ProductCategoryController {
    private final ProductCategoryService categoryService;

    public ProductCategoryController(ProductCategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ProductCategory findCategoryById(@PathVariable Long id) {
        return categoryService.findCategoryById(id)
                .orElseThrow(() -> new ProductCategoryNotFoundException(id));
    }

    @GetMapping("/")
    @ResponseStatus(HttpStatus.OK)
    public Collection<ProductCategory> findCategories() {
        return categoryService.findAllCategories();
    }

    @PostMapping("/")
    @ResponseStatus(HttpStatus.CREATED)
    public ProductCategory createCategory(@RequestBody ProductCategory category) {
        return categoryService.createCategory(category);
    }

    // TODO: put mapping

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCategory(@PathVariable Long id) {
        if (categoryService.findCategoryById(id).isEmpty()) {
            throw new ProductCategoryNotFoundException(id);
        }
        categoryService.deleteCategoryById(id);
    }
}
