package com.mealplanner.fridge;

import com.mealplanner.auth.user.User;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

// TODO: make service with injection

/**
 * REST controller for managing products.
 */
@RestController
@RequestMapping("/api/product")
public class ProductController {
    @Autowired
    private ProductRepository repository;

    @GetMapping("/{id}")
    public Product findById(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
    }

    @GetMapping("/")
    public Collection<Product> findProducts(@AuthenticationPrincipal User user) {
        return repository.findByUserId(user.getId());
    }

    @PostMapping("/")
    @ResponseStatus(HttpStatus.CREATED)
    public Product addProduct(@Valid @RequestBody Product product, @AuthenticationPrincipal User user) {
        product.setUser(user);
        return repository.save(product);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Product updateProduct(@Valid @PathVariable("id") final Long id, @RequestBody final Product product) {
        return repository.findById(id)
                .map(existingProduct -> {
                    existingProduct.setName(product.getName());
                    existingProduct.setDescription(product.getDescription());
                    existingProduct.setPrice(product.getPrice());
                    return repository.save(existingProduct);
                })
                .orElseThrow(() -> new ProductNotFoundException(id));
    }

    // TODO: delete mapping
}
