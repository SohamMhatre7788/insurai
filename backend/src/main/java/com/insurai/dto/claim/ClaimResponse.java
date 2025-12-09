package com.insurai.dto.claim;

import com.insurai.entity.Claim;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClaimResponse {

    private Long id;
    private Long clientPolicyId;
    private String policyName;
    private String companyName;
    private BigDecimal claimAmountRequested;
    private String description;
    private BigDecimal maxCoverageForPolicy;
    private Claim.ClaimStatus status;
    private String rejectionReason;
    private BigDecimal approvedCoverageAmount;
    private List<String> supportingDocumentUrls;
    private LocalDateTime createdAt;
}
