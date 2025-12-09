package com.insurai.controller;

import com.insurai.dto.clientpolicy.BuyPolicyRequest;
import com.insurai.dto.clientpolicy.ClientPolicyResponse;
import com.insurai.repository.UserRepository;
import com.insurai.service.ClientPolicyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/client-policies")
@RequiredArgsConstructor
public class ClientPolicyController {

    private final ClientPolicyService clientPolicyService;
    private final UserRepository userRepository;

    private Long getCurrentUserId(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }

    @PostMapping
    public ResponseEntity<ClientPolicyResponse> buyPolicy(
            @Valid @RequestBody BuyPolicyRequest request,
            Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(clientPolicyService.buyPolicy(userId, request));
    }

    @GetMapping
    public ResponseEntity<List<ClientPolicyResponse>> getMyPolicies(Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        return ResponseEntity.ok(clientPolicyService.getClientPolicies(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClientPolicyResponse> getClientPolicyById(
            @PathVariable Long id,
            Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        return ResponseEntity.ok(clientPolicyService.getClientPolicyById(userId, id));
    }

    @PostMapping("/{id}/renew")
    public ResponseEntity<ClientPolicyResponse> renewPolicy(
            @PathVariable Long id,
            Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        return ResponseEntity.ok(clientPolicyService.renewPolicy(userId, id));
    }
}
