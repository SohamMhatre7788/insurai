package com.insurai.service;

import com.insurai.dto.AiContextDTO;
import com.insurai.dto.PolicySummaryDTO;
import com.insurai.entity.Policy;
import com.insurai.repository.ClientPolicyRepository;
import com.insurai.repository.ClaimRepository;
import com.insurai.repository.PolicyRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AiContextService {

    private final PolicyRepository policyRepository;
    private final ClientPolicyRepository clientPolicyRepository;
    private final ClaimRepository claimRepository;

    public AiContextService(PolicyRepository policyRepository,
                            ClientPolicyRepository clientPolicyRepository,
                            ClaimRepository claimRepository) {
        this.policyRepository = policyRepository;
        this.clientPolicyRepository = clientPolicyRepository;
        this.claimRepository = claimRepository;
    }

    public AiContextDTO buildClientContext(Long clientId) {

        AiContextDTO context = new AiContextDTO();
        context.setRole("CLIENT");

        // Fetch all policies as DTO
        List<PolicySummaryDTO> policies = policyRepository.findAll().stream()
                .map(this::toPolicySummary)
                .collect(Collectors.toList());
        context.setAvailablePolicies(policies);

        // Fetch claim statuses as Strings
        List<String> claimStatuses = claimRepository.findStatusesByClientId(clientId)
                .stream()
                .map(Enum::name)
                .collect(Collectors.toList());
        context.setClaimStatuses(claimStatuses);

        // Fetch policy names
        List<String> policyNames = clientPolicyRepository.findPolicyNamesByClientId(clientId);
        context.setPolicyNames(policyNames);

        return context;
    }

    private PolicySummaryDTO toPolicySummary(Policy policy) {
        PolicySummaryDTO dto = new PolicySummaryDTO();
        dto.setName(policy.getName());
        dto.setRiskLevel(policy.getRiskLevel() != null ? policy.getRiskLevel().toString() : null);
        dto.setCoverageAmount(policy.getCoverageAmount());   // BigDecimal
        dto.setPremiumPerYear(policy.getPremiumPerYear());   // BigDecimal
        dto.setMinPeriodYears(policy.getMinPeriodYears());
        dto.setMaxPeriodYears(policy.getMaxPeriodYears());
        return dto;
    }
}
