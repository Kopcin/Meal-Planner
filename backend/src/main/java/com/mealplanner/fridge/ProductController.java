package com.mealplanner.fridge;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

@RestController
@RequestMapping("/api/product")
public class ProductController {
    @Autowired
    private ProductRepository repository;

    @GetMapping("/{id}")
    public Product findById(@PathVariable long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
    }

    @GetMapping("/")
    public Collection<Product> findProducts() {
        return repository.findAll();
    }

    @PostMapping("/")
    @ResponseStatus(HttpStatus.CREATED)
    public Product addProduct(@RequestBody Product product) {
        return repository.save(product);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Product updateProduct(@PathVariable("id") final long id, @RequestBody final Product product) {
        return repository.findById(id)
                .map(existingProduct -> {
                    existingProduct.setName(product.getName());
                    existingProduct.setDescription(product.getDescription());
                    existingProduct.setPrice(product.getPrice());
                    return repository.save(existingProduct);
                })
                .orElseThrow(() -> new ProductNotFoundException(id));
    }
}
