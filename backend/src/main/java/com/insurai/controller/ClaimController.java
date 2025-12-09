package com.insurai.controller;

import com.insurai.dto.claim.ClaimResponse;
import com.insurai.dto.claim.CreateClaimRequest;
import com.insurai.repository.UserRepository;
import com.insurai.service.ClaimService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/claims")
@RequiredArgsConstructor
public class ClaimController {

    private final ClaimService claimService;
    private final UserRepository userRepository;

    private Long getCurrentUserId(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ClaimResponse> createClaim(
            @Valid @ModelAttribute CreateClaimRequest request,
            @RequestParam(value = "documents", required = false) List<MultipartFile> documents,
            Authentication authentication) throws IOException {
        Long userId = getCurrentUserId(authentication);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(claimService.createClaim(userId, request, documents));
    }

    @GetMapping("/my")
    public ResponseEntity<List<ClaimResponse>> getMyClaims(Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        return ResponseEntity.ok(claimService.getClientClaims(userId));
    }
}
