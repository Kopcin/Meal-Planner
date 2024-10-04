package com.mealplanner.recipe;

import com.mealplanner.fridge.Product;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
public class Recipe {
    // TODO: add tags, rating, category, instructions

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    @Getter
    @NotNull
    private String title;

    @Setter
    @Getter
    private String description;

    @Setter
    @Getter
    @ManyToMany
    @JoinTable(name = "recipe_product",
            joinColumns = @JoinColumn(name = "recipe_id"),
            inverseJoinColumns = @JoinColumn(name = "product_id"))
    private List<Product> products;

    public Recipe() {
    }

    public Recipe(String title) {
        this.title = title;
    }

    public Recipe(String title, String description) {
        this.title = title;
        this.description = description;
    }

    public Recipe(String title, String description, List<Product> products) {
        this.title = title;
        this.description = description;
        this.products = products;
    }
}
