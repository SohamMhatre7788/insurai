package com.insurai.service;

import com.insurai.dto.policy.PolicyRequest;
import com.insurai.dto.policy.PolicyResponse;
import com.insurai.entity.Policy;
import com.insurai.exception.ResourceNotFoundException;
import com.insurai.repository.PolicyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PolicyService {

    private final PolicyRepository policyRepository;
    private final CloudinaryService cloudinaryService;

    public List<PolicyResponse> getAllPolicies() {
        return policyRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public PolicyResponse getPolicyById(Long id) {
        Policy policy = policyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Policy not found"));
        return mapToResponse(policy);
    }

    @Transactional
    public PolicyResponse createPolicy(PolicyRequest request, MultipartFile document) throws IOException {
        Policy policy = new Policy();
        policy.setName(request.getName());
        policy.setDescription(request.getDescription());
        policy.setPremiumPerYear(request.getPremiumPerYear());
        policy.setCoverageAmount(request.getCoverageAmount());
        policy.setRiskLevel(request.getRiskLevel());
        policy.setMinPeriodYears(request.getMinPeriodYears());
        policy.setMaxPeriodYears(request.getMaxPeriodYears());

        if (document != null && !document.isEmpty()) {
            String documentUrl = cloudinaryService.uploadFile(document, "policies");
            policy.setPolicyDocumentUrl(documentUrl);
        }

        policy = policyRepository.save(policy);
        return mapToResponse(policy);
    }

    @Transactional
    public PolicyResponse updatePolicy(Long id, PolicyRequest request, MultipartFile document) throws IOException {
        Policy policy = policyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Policy not found"));

        policy.setName(request.getName());
        policy.setDescription(request.getDescription());
        policy.setPremiumPerYear(request.getPremiumPerYear());
        policy.setCoverageAmount(request.getCoverageAmount());
        policy.setRiskLevel(request.getRiskLevel());
        policy.setMinPeriodYears(request.getMinPeriodYears());
        policy.setMaxPeriodYears(request.getMaxPeriodYears());

        if (document != null && !document.isEmpty()) {
            String documentUrl = cloudinaryService.uploadFile(document, "policies");
            policy.setPolicyDocumentUrl(documentUrl);
        }

        policy = policyRepository.save(policy);
        return mapToResponse(policy);
    }

    @Transactional
    public void deletePolicy(Long id) {
        Policy policy = policyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Policy not found"));
        policyRepository.delete(policy);
    }

    private PolicyResponse mapToResponse(Policy policy) {
        return new PolicyResponse(
                policy.getId(),
                policy.getName(),
                policy.getDescription(),
                policy.getPremiumPerYear(),
                policy.getCoverageAmount(),
                policy.getRiskLevel(),
                policy.getMinPeriodYears(),
                policy.getMaxPeriodYears(),
                policy.getPolicyDocumentUrl(),
                policy.getCreatedAt(),
                policy.getUpdatedAt());
    }
}
