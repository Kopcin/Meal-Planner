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
        assertEquals(2, foundProduct.getCategories().size(), "Product should have 2 categories");

        Set<ProductCategory> categories = foundProduct.getCategories();
        assertTrue(categories.contains(category1), "Product should contain the 'Dairy' category");
        assertTrue(categories.contains(category2), "Product should contain the 'Beverages' category");

        ProductCategory updatedCategory1 = productCategoryRepository.findById(category1.getId()).orElse(null);
        assert updatedCategory1 != null;
        assertNotNull(updatedCategory1, "Category " + updatedCategory1.getName() + " should be found");

        Set<Product> dairyProducts = updatedCategory1.getProducts();
        assertTrue(dairyProducts.contains(product), "Category " + updatedCategory1.getName() + " should contain the product: " + product.getName());

        ProductCategory updatedCategory2 = productCategoryRepository.findById(category2.getId()).orElse(null);
        assert updatedCategory2 != null;
        assertNotNull(updatedCategory2, "Category " + updatedCategory2.getName() + " should be found");

        Set<Product> beverageProducts = updatedCategory2.getProducts();
        assertTrue(beverageProducts.contains(product), "Category " + updatedCategory2.getName() + " should contain the product: " + product.getName());
    }

    @Test
    void testRemovingCategoryFromProduct() {
        ProductCategory category1 = new ProductCategory("Dairy");
        ProductCategory category2 = new ProductCategory("Beverages");

        productCategoryRepository.save(category1);
        productCategoryRepository.save(category2);

        Product product = new Product("Milk", "Fresh milk", 3.99);
        product.addCategory(category1);
        product.addCategory(category2);

        productRepository.save(product);

        product.removeCategory(category2);
        productRepository.save(product);

        Product foundProduct = productRepository.findById(product.getId()).orElse(null);
        assertNotNull(foundProduct);
        assertEquals(1, foundProduct.getCategories().size(), "Product should have only 1 category after removal");

        ProductCategory updatedCategory2 = productCategoryRepository.findById(category2.getId()).orElse(null);
        assertNotNull(updatedCategory2, "Category Beverages should be found");

        Set<Product> beverageProducts = updatedCategory2.getProducts();
        assertFalse(beverageProducts.contains(product), "Product should not belong to the Beverages category");
    }

    @Test
    void testDeletingProductStaysInCategory() {
        ProductCategory category = new ProductCategory("Dairy");
        productCategoryRepository.save(category);

        Product product = new Product("Milk", "Fresh milk", 3.99);
        product.addCategory(category);
        productRepository.save(product);

        productRepository.delete(product);

        ProductCategory updatedCategory = productCategoryRepository.findById(category.getId()).orElse(null);
        assertNotNull(updatedCategory, "Dairy category should still exist after product deletion");

        Set<Product> dairyProducts = updatedCategory.getProducts();
        assertTrue(dairyProducts.contains(product), "After deleting the product, it should stay in the Dairy category");
    }
}
