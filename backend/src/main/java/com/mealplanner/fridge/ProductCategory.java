package com.mealplanner.fridge;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

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
    @OneToMany(mappedBy = "parent")
    private final Set<ProductCategory> subcategories = new HashSet<>();

    @OneToMany(mappedBy = "category")
    private List<Product> products;

    public ProductCategory() {}

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
        subcategories.add(subcategory);
        subcategory.setParent(this);
    }

    public void removeSubcategory(ProductCategory subcategory) {
        subcategories.remove(subcategory);
        subcategory.setParent(null);
    }

    private void setParent(ProductCategory productCategory) {
        this.parent = productCategory;
    }

    public void addProduct(Product product) {
        products.add(product);
        product.setCategory(this);
    }

    public void removeProduct(Product product) {
        products.remove(product);
        product.setCategory(null);
    }
}
