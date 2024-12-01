package com.mealplanner.recipe;

import com.mealplanner.fridge.Product;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Entity
public class Recipe {
    // TODO: add tags, rating, category, instructions

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    @NotNull
    private String title;

    @Setter
    private String description;

    // Store the selected existing products

    @ManyToMany
    @JoinTable(name = "recipe_product",
            joinColumns = @JoinColumn(name = "recipe_id"),
            inverseJoinColumns = @JoinColumn(name = "product_id"))
    private List<Product> existingProducts;

    // Store the product names that are not yet in the database
    @ElementCollection
    @CollectionTable(name = "recipe_ingredients", joinColumns = @JoinColumn(name="recipe_id"))
    @Column(name = "product_name")
    private List<String> newProductNames;

    public Recipe() {
    }

    public Recipe(String title) {
        this.title = title;
    }

    public Recipe(String title, List<String> newProductNames) {
        this.title = title;
        this.newProductNames = newProductNames;
    }

    public Recipe(String title, String description, List<String> newProductNames) {
        this.title = title;
        this.description = description;
        this.newProductNames = newProductNames;
    }

    public Recipe(String title, String description, List<Product> existingProducts, List<String> newProductNames) {
        this.title = title;
        this.description = description;
        this.existingProducts = existingProducts;
        this.newProductNames = newProductNames;
    }
}
