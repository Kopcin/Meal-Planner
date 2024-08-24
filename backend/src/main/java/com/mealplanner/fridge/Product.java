package com.mealplanner.fridge;

import jakarta.persistence.*;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

// import java.math.BigDecimal;

@Entity
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    @Getter
    @NotNull
    private String name;

    @Setter
    @Getter
    private String description;

    @Setter
    @Getter
    @PositiveOrZero
    private Double price;

    @Setter
    @ManyToOne
    @JoinColumn(name = "category_id")
    private ProductCategory category;
// TODO: fix negative numbers

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

}
