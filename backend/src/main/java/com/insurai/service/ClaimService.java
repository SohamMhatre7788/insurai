package com.insurai.service;

import com.insurai.dto.claim.ApproveClaimRequest;
import com.insurai.dto.claim.ClaimResponse;
import com.insurai.dto.claim.CreateClaimRequest;
import com.insurai.dto.claim.RejectClaimRequest;
import com.insurai.entity.Claim;
import com.insurai.entity.ClientPolicy;
import com.insurai.entity.Policy;
import com.insurai.entity.User;
import com.insurai.exception.BadRequestException;
import com.insurai.exception.ResourceNotFoundException;
import com.insurai.repository.ClaimRepository;
import com.insurai.repository.ClientPolicyRepository;
import com.insurai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClaimService {

    private final ClaimRepository claimRepository;
    private final ClientPolicyRepository clientPolicyRepository;
    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;
    private final EmailService emailService;

    @Transactional
    public ClaimResponse createClaim(Long userId, CreateClaimRequest request, List<MultipartFile> documents)
            throws IOException {
        User client = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found"));

        ClientPolicy clientPolicy = clientPolicyRepository.findById(request.getClientPolicyId())
                .orElseThrow(() -> new ResourceNotFoundException("Client policy not found"));

        if (!clientPolicy.getClient().getId().equals(userId)) {
            throw new BadRequestException("This policy does not belong to you");
        }

        if (clientPolicy.getStatus() != ClientPolicy.PolicyStatus.ACTIVE) {
            throw new BadRequestException("Cannot claim on inactive policy");
        }

        Policy policy = clientPolicy.getPolicy();

        // Validate claim amount
        if (request.getClaimAmountRequested().compareTo(policy.getCoverageAmount()) > 0) {
            throw new BadRequestException("Claim amount exceeds policy coverage");
        }

        Claim claim = new Claim();
        claim.setClientPolicy(clientPolicy);
        claim.setClient(client);
        claim.setClaimAmountRequested(request.getClaimAmountRequested());
        claim.setDescription(request.getDescription());
        claim.setMaxCoverageForPolicy(policy.getCoverageAmount());
        claim.setStatus(Claim.ClaimStatus.PENDING);

        // Upload supporting documents
        List<String> documentUrls = new ArrayList<>();
        if (documents != null && !documents.isEmpty()) {
            for (MultipartFile document : documents) {
                if (!document.isEmpty()) {
                    String url = cloudinaryService.uploadFile(document, "claims");
                    documentUrls.add(url);
                }
            }
        }
        claim.setSupportingDocumentUrls(documentUrls);

        // Auto-approval logic for LOW risk policies
        if (policy.getRiskLevel() == Policy.RiskLevel.LOW &&
                request.getClaimAmountRequested().compareTo(policy.getCoverageAmount()) <= 0) {
            claim.setStatus(Claim.ClaimStatus.APPROVED);
            claim.setApprovedCoverageAmount(request.getClaimAmountRequested());
            emailService.sendClaimApprovedEmail(
                    client.getEmail(),
                    "Claim #" + claim.getId(),
                    request.getClaimAmountRequested().toString());
        } else {
            // Send email to admin for manual review
            emailService.sendClaimSubmittedEmail(
                    "admin@insurai.com",
                    "New claim from " + clientPolicy.getCompanyName() + " for policy " + policy.getName());
        }

        claim = claimRepository.save(claim);

        return mapToResponse(claim);
    }

    public List<ClaimResponse> getClientClaims(Long userId) {
        return claimRepository.findByClientId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Admin methods
    public List<ClaimResponse> getAllClaims(Claim.ClaimStatus status) {
        if (status != null) {
            return claimRepository.findByStatus(status).stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
        }
        return claimRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ClaimResponse getClaimById(Long claimId) {
        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found"));
        return mapToResponse(claim);
    }

    @Transactional
    public ClaimResponse approveClaim(Long claimId, ApproveClaimRequest request) {
        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found"));

        if (claim.getStatus() != Claim.ClaimStatus.PENDING) {
            throw new BadRequestException("Only pending claims can be approved");
        }

        if (request.getApprovedCoverageAmount().compareTo(claim.getMaxCoverageForPolicy()) > 0) {
            throw new BadRequestException("Approved amount cannot exceed max coverage");
        }

        claim.setStatus(Claim.ClaimStatus.APPROVED);
        claim.setApprovedCoverageAmount(request.getApprovedCoverageAmount());

        claim = claimRepository.save(claim);

        // Send email to client
        emailService.sendClaimApprovedEmail(
                claim.getClient().getEmail(),
                "Claim #" + claimId + " for " + claim.getClientPolicy().getPolicy().getName(),
                request.getApprovedCoverageAmount().toString());

        return mapToResponse(claim);
    }

    @Transactional
    public ClaimResponse rejectClaim(Long claimId, RejectClaimRequest request) {
        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found"));

        if (claim.getStatus() != Claim.ClaimStatus.PENDING) {
            throw new BadRequestException("Only pending claims can be rejected");
        }

        claim.setStatus(Claim.ClaimStatus.REJECTED);
        claim.setRejectionReason(request.getRejectionReason());

        claim = claimRepository.save(claim);

        // Send email to client
        emailService.sendClaimRejectedEmail(
                claim.getClient().getEmail(),
                "Claim #" + claimId + " for " + claim.getClientPolicy().getPolicy().getName(),
                request.getRejectionReason());

        return mapToResponse(claim);
    }

    private ClaimResponse mapToResponse(Claim claim) {
        return new ClaimResponse(
                claim.getId(),
                claim.getClientPolicy().getId(),
                claim.getClientPolicy().getPolicy().getName(),
                claim.getClientPolicy().getCompanyName(),
                claim.getClaimAmountRequested(),
                claim.getDescription(),
                claim.getMaxCoverageForPolicy(),
                claim.getStatus(),
                claim.getRejectionReason(),
                claim.getApprovedCoverageAmount(),
                claim.getSupportingDocumentUrls(),
                claim.getCreatedAt());
    }
}
