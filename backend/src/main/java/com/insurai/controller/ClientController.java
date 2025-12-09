package com.insurai.controller;

import com.insurai.dto.user.ChangePasswordRequest;
import com.insurai.dto.user.UpdateProfileRequest;
import com.insurai.dto.user.UserProfileResponse;
import com.insurai.security.JwtUtil;
import com.insurai.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/client")
@RequiredArgsConstructor
public class ClientController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    private Long getCurrentUserId(Authentication authentication) {
        String email = authentication.getName();
        // In a real scenario, extract from JWT or SecurityContext
        // For now, we'll add a helper method
        return jwtUtil.extractUserId(
                ((org.springframework.security.core.userdetails.User) authentication.getPrincipal()).getUsername());
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getProfile(Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        return ResponseEntity.ok(userService.getUserProfile(userId));
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request,
            Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        return ResponseEntity.ok(userService.updateProfile(userId, request));
    }

    @PutMapping("/me/password")
    public ResponseEntity<Void> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        userService.changePassword(userId, request);
        return ResponseEntity.ok().build();
    }
}
