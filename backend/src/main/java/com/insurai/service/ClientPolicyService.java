package com.insurai.service;

import com.insurai.dto.clientpolicy.BuyPolicyRequest;
import com.insurai.dto.clientpolicy.ClientPolicyResponse;
import com.insurai.entity.ClientPolicy;
import com.insurai.entity.Policy;
import com.insurai.entity.User;
import com.insurai.exception.BadRequestException;
import com.insurai.exception.ResourceNotFoundException;
import com.insurai.repository.ClientPolicyRepository;
import com.insurai.repository.PolicyRepository;
import com.insurai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClientPolicyService {

    private final ClientPolicyRepository clientPolicyRepository;
    private final PolicyRepository policyRepository;
    private final UserRepository userRepository;

    @Transactional
    public ClientPolicyResponse buyPolicy(Long userId, BuyPolicyRequest request) {
        User client = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found"));

        Policy policy = policyRepository.findById(request.getPolicyId())
                .orElseThrow(() -> new ResourceNotFoundException("Policy not found"));

        // Validate policy period
        if (request.getPolicyPeriodYears() < policy.getMinPeriodYears() ||
                request.getPolicyPeriodYears() > policy.getMaxPeriodYears()) {
            throw new BadRequestException("Policy period must be between " +
                    policy.getMinPeriodYears() + " and " + policy.getMaxPeriodYears() + " years");
        }

        ClientPolicy clientPolicy = new ClientPolicy();
        clientPolicy.setClient(client);
        clientPolicy.setPolicy(policy);
        clientPolicy.setCompanyName(request.getCompanyName());
        clientPolicy.setNumberOfEmployees(request.getNumberOfEmployees());
        clientPolicy.setPolicyPeriodYears(request.getPolicyPeriodYears());

        // Calculate premium and dates
        BigDecimal premiumAmount = policy.getPremiumPerYear()
                .multiply(BigDecimal.valueOf(request.getPolicyPeriodYears()));
        clientPolicy.setPremiumAmount(premiumAmount);

        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusYears(request.getPolicyPeriodYears());
        clientPolicy.setStartDate(startDate);
        clientPolicy.setEndDate(endDate);

        clientPolicy.setStatus(ClientPolicy.PolicyStatus.ACTIVE);

        clientPolicy = clientPolicyRepository.save(clientPolicy);

        return mapToResponse(clientPolicy);
    }

    public List<ClientPolicyResponse> getClientPolicies(Long userId) {
        return clientPolicyRepository.findByClientId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ClientPolicyResponse getClientPolicyById(Long userId, Long clientPolicyId) {
        ClientPolicy clientPolicy = clientPolicyRepository.findById(clientPolicyId)
                .orElseThrow(() -> new ResourceNotFoundException("Client policy not found"));

        if (!clientPolicy.getClient().getId().equals(userId)) {
            throw new BadRequestException("This policy does not belong to you");
        }

        return mapToResponse(clientPolicy);
    }

    @Transactional
    public ClientPolicyResponse renewPolicy(Long userId, Long clientPolicyId) {
        ClientPolicy clientPolicy = clientPolicyRepository.findById(clientPolicyId)
                .orElseThrow(() -> new ResourceNotFoundException("Client policy not found"));

        if (!clientPolicy.getClient().getId().equals(userId)) {
            throw new BadRequestException("This policy does not belong to you");
        }

        // Check if policy can be renewed
        if (clientPolicy.getStatus() == ClientPolicy.PolicyStatus.CANCELLED) {
            throw new BadRequestException("Cannot renew a cancelled policy");
        }

        // Extend end date
        LocalDate newEndDate = clientPolicy.getEndDate().plusYears(clientPolicy.getPolicyPeriodYears());
        clientPolicy.setEndDate(newEndDate);

        // Recalculate premium for the extended period
        BigDecimal additionalPremium = clientPolicy.getPolicy().getPremiumPerYear()
                .multiply(BigDecimal.valueOf(clientPolicy.getPolicyPeriodYears()));
        clientPolicy.setPremiumAmount(clientPolicy.getPremiumAmount().add(additionalPremium));

        clientPolicy.setStatus(ClientPolicy.PolicyStatus.ACTIVE);

        clientPolicy = clientPolicyRepository.save(clientPolicy);

        return mapToResponse(clientPolicy);
    }

    private ClientPolicyResponse mapToResponse(ClientPolicy clientPolicy) {
        return new ClientPolicyResponse(
                clientPolicy.getId(),
                clientPolicy.getPolicy().getId(),
                clientPolicy.getPolicy().getName(),
                clientPolicy.getCompanyName(),
                clientPolicy.getNumberOfEmployees(),
                clientPolicy.getPolicyPeriodYears(),
                clientPolicy.getPremiumAmount(),
                clientPolicy.getPolicy().getCoverageAmount(),
                clientPolicy.getStartDate(),
                clientPolicy.getEndDate(),
                clientPolicy.getStatus());
    }
}
