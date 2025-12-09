package com.insurai.service;

import com.insurai.dto.auth.AuthResponse;
import com.insurai.dto.auth.LoginRequest;
import com.insurai.dto.auth.SignupRequest;
import com.insurai.entity.User;
import com.insurai.exception.BadRequestException;
import com.insurai.repository.UserRepository;
import com.insurai.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(User.Role.CLIENT); // Default role for signup

        user = userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getId());

        return new AuthResponse(
                token,
                user.getRole().name(),
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getId());

        return new AuthResponse(
                token,
                user.getRole().name(),
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail());
    }
}
