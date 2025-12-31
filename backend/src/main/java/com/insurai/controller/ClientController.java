package com.insurai.controller;

import com.insurai.dto.user.ChangePasswordRequest;
import com.insurai.dto.user.UpdateProfileRequest;
import com.insurai.dto.user.UserProfileResponse;
import com.insurai.security.CustomUserDetails;
import com.insurai.security.JwtUtil;
import com.insurai.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
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

   @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getProfile(Authentication authentication) {

        Long userId = ((CustomUserDetails) authentication.getPrincipal()).getUserId();

        return ResponseEntity.ok(userService.getUserProfile(userId));
    }

   @PutMapping("/me")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request,
            Authentication authentication) {

        Long userId = ((CustomUserDetails) authentication.getPrincipal()).getUserId();

        return ResponseEntity.ok(userService.updateProfile(userId, request));
    }

  
    // ✅ CHANGE PASSWORD
    @PutMapping("/me/password")
    public ResponseEntity<Void> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Authentication authentication) {

        Long userId = ((CustomUserDetails) authentication.getPrincipal()).getUserId();

        userService.changePassword(userId, request);
        return ResponseEntity.ok().build();
    }
}
