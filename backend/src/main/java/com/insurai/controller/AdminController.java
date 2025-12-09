package com.insurai.controller;

import com.insurai.dto.claim.ApproveClaimRequest;
import com.insurai.dto.claim.ClaimResponse;
import com.insurai.dto.claim.RejectClaimRequest;
import com.insurai.dto.policy.PolicyRequest;
import com.insurai.dto.policy.PolicyResponse;
import com.insurai.dto.user.UpdateProfileRequest;
import com.insurai.dto.user.UserProfileResponse;
import com.insurai.entity.Claim;
import com.insurai.service.ClaimService;
import com.insurai.service.PolicyService;
import com.insurai.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final PolicyService policyService;
    private final ClaimService claimService;
    private final UserService userService;

    // Policy Management
    @PostMapping(value = "/policies", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PolicyResponse> createPolicy(
            @Valid @ModelAttribute PolicyRequest request,
            @RequestParam(value = "document", required = false) MultipartFile document) throws IOException {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(policyService.createPolicy(request, document));
    }

    @GetMapping("/policies")
    public ResponseEntity<List<PolicyResponse>> getAllPolicies() {
        return ResponseEntity.ok(policyService.getAllPolicies());
    }

    @GetMapping("/policies/{id}")
    public ResponseEntity<PolicyResponse> getPolicyById(@PathVariable Long id) {
        return ResponseEntity.ok(policyService.getPolicyById(id));
    }

    @PutMapping(value = "/policies/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PolicyResponse> updatePolicy(
            @PathVariable Long id,
            @Valid @ModelAttribute PolicyRequest request,
            @RequestParam(value = "document", required = false) MultipartFile document) throws IOException {
        return ResponseEntity.ok(policyService.updatePolicy(id, request, document));
    }

    @DeleteMapping("/policies/{id}")
    public ResponseEntity<Void> deletePolicy(@PathVariable Long id) {
        policyService.deletePolicy(id);
        return ResponseEntity.noContent().build();
    }

    // Claim Management
    @GetMapping("/claims")
    public ResponseEntity<List<ClaimResponse>> getAllClaims(
            @RequestParam(required = false) Claim.ClaimStatus status) {
        return ResponseEntity.ok(claimService.getAllClaims(status));
    }

    @GetMapping("/claims/{id}")
    public ResponseEntity<ClaimResponse> getClaimById(@PathVariable Long id) {
        return ResponseEntity.ok(claimService.getClaimById(id));
    }

    @PutMapping("/claims/{id}/approve")
    public ResponseEntity<ClaimResponse> approveClaim(
            @PathVariable Long id,
            @Valid @RequestBody ApproveClaimRequest request) {
        return ResponseEntity.ok(claimService.approveClaim(id, request));
    }

    @PutMapping("/claims/{id}/reject")
    public ResponseEntity<ClaimResponse> rejectClaim(
            @PathVariable Long id,
            @Valid @RequestBody RejectClaimRequest request) {
        return ResponseEntity.ok(claimService.rejectClaim(id, request));
    }

    // User Management
    @GetMapping("/users")
    public ResponseEntity<List<UserProfileResponse>> getAllClients() {
        return ResponseEntity.ok(userService.getAllClients());
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserProfileResponse> getClientById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserProfile(id));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<UserProfileResponse> updateClient(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(userService.updateClient(id, request));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable Long id) {
        userService.deleteClient(id);
        return ResponseEntity.noContent().build();
    }
}
