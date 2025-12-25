package com.insurai.service;

import com.insurai.dto.PolicySummaryDTO;
import com.insurai.entity.Policy;
import com.insurai.entity.ClientPolicy;
import com.insurai.repository.PolicyRepository;
import com.insurai.repository.ClientPolicyRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AiDataService {

    @Autowired
    private PolicyRepository policyRepository;

    @Autowired
    private ClientPolicyRepository clientPolicyRepository;
  
    /**
     * Fetches all policies (admin view)
     */
    public List<PolicySummaryDTO> getAllAdminPolicies() {
        List<Policy> policies = policyRepository.findAll();
        return policies.stream()
                .map(this::mapPolicyToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Fetches client-specific policies
     */
    public List<PolicySummaryDTO> getClientPolicies(Long clientId) {
        List<ClientPolicy> clientPolicies = clientPolicyRepository.findByClientId(clientId);

        return clientPolicies.stream()
                .map(cp -> mapPolicyToDTO(cp.getPolicy()))
                .collect(Collectors.toList());
    }


    /**
     * Fetch policies dynamically based on role
     */
    public List<PolicySummaryDTO> getPolicies(Long clientId, boolean isAdmin) {
        if (isAdmin) {
            return getAllAdminPolicies();
        }
        return getClientPolicies(clientId);
    }

    /**
     * Maps Policy entity to PolicySummaryDTO
     */
    private PolicySummaryDTO mapPolicyToDTO(Policy policy) {
        PolicySummaryDTO dto = new PolicySummaryDTO();
        dto.setName(policy.getName());
        dto.setRiskLevel(policy.getRiskLevel() != null ? policy.getRiskLevel().name() : "UNKNOWN");
        dto.setCoverageAmount(policy.getCoverageAmount());
        dto.setPremiumPerYear(policy.getPremiumPerYear());
        dto.setMaxPeriodYears(policy.getMaxPeriodYears());
        dto.setMinPeriodYears(policy.getMinPeriodYears());
        return dto;
    }
}
