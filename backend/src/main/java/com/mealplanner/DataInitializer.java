package com.mealplanner;

import com.mealplanner.auth.user.Role;
import com.mealplanner.auth.user.User;
import com.mealplanner.auth.user.UserRepository;
import com.mealplanner.fridge.ProductCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Profile("dev")
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ProductCategoryService categoryService;

    @Override
    public void run(String... args) throws Exception {
        categoryService.createCategory("Meat");
        categoryService.createCategory("Dairy Products", "Products made from milk");
        categoryService.createCategory("Beverages", "Drinks and beverages");

        createAdminIfNotExists();
    }

    private void createAdminIfNotExists() {
        boolean exists = userRepository.findByUsername("admin").isPresent();

        if (!exists) {
            User admin = User.builder()
                    .username("admin")
                    .email("admin@dev.local")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .build();

            userRepository.save(admin);

            System.out.println("DEV ADMIN CREATED: admin / admin123");
        }
    }
}
