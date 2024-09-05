package com.mealplanner.fridge;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

// Could use Neo4j (graph database) or other hierarchic one
@Entity
public class ProductCategory {
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

    @Getter
    @ManyToOne
    @JoinColumn(name = "parent_id")
    private ProductCategory parent;

    @Getter
    @ManyToMany(mappedBy = "categories")
    private Set<Product> products = new HashSet<>();

    public ProductCategory() {
    }

    public ProductCategory(String name) {
        this.name = name;
    }

    public ProductCategory(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public ProductCategory(String name, String description, ProductCategory parent) {
        this.name = name;
        this.description = description;
        this.parent = parent;
    }

    public void addSubcategory(ProductCategory subcategory) {
        subcategory.setParent(this);
    }

    public void removeSubcategory(ProductCategory subcategory) {
        subcategory.setParent(null);
    }

    private void setParent(ProductCategory parent) {
        this.parent = parent;
    }
}
