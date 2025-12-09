package com.insurai.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private String role;
    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
}
