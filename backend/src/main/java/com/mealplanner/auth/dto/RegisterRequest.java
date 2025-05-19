package com.mealplanner.auth.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class RegisterRequest {
    private String email;
    private String password;
    private String username;
}
