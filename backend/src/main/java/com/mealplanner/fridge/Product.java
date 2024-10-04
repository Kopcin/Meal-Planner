package com.mealplanner.fridge;

import jakarta.persistence.*;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

// import java.math.BigDecimal;

@Getter
@Entity
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    @NotNull
    private String name;

    @Setter
    private String description;

    @Setter
    @PositiveOrZero
    private Double price;
    // TODO: fix negative numbers

    @Setter
    private LocalDate expirationDate;

    @ManyToMany
    @JoinTable(
            name = "product_category_join_table",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private Set<ProductCategory> categories = new HashSet<>();

    public Product() {
    }

    public Product(String name) {
        this.name = name;
    }

    public Product(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public Product(String name, String description, Double price) {
        this.name = name;
        this.description = description;
        this.price = price;
    }

    public Product(String name, String description, Double price, LocalDate expirationDate) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.expirationDate = expirationDate;
    }

    public void addCategory(ProductCategory category) {
        categories.add(category);
        category.getProducts().add(this);
    }

    public void removeCategory(ProductCategory category) {
        categories.remove(category);
        category.getProducts().remove(this);
    }
}
