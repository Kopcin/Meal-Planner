package com.mealplanner.fridge;


import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@Transactional
@Rollback
class ProductCategoryTest {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductCategoryRepository productCategoryRepository;

    @Test
    void testManyToManyRelationship() {
        ProductCategory category1 = new ProductCategory("Dairy");
        ProductCategory category2 = new ProductCategory("Beverages");

        productCategoryRepository.save(category1);
        productCategoryRepository.save(category2);

        Product product = new Product("Milk", "Fresh milk", 3.99);

        product.addCategory(category1);
        product.addCategory(category2);

        productRepository.save(product);

        Product foundProduct = productRepository.findById(product.getId()).orElse(null);
        assertNotNull(foundProduct);
        assertEquals(2, foundProduct.getCategories().size());

        //TODO: fix add methods in models
        System.out.println("Test dairyProducts:");
        Set<Product> dairyProducts = category1.getProducts();
        for (Product p : dairyProducts) {
            System.out.println(dairyProducts);
        }
        assertTrue(dairyProducts.contains(product));

        Set<Product> beverageProducts = category2.getProducts();
        assertTrue(beverageProducts.contains(product));
    }
}
