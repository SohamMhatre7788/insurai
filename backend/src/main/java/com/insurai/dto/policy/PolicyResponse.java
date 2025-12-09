package com.insurai.dto.policy;

import com.insurai.entity.Policy;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PolicyResponse {

    private Long id;
    private String name;
    private String description;
    private BigDecimal premiumPerYear;
    private BigDecimal coverageAmount;
    private Policy.RiskLevel riskLevel;
    private Integer minPeriodYears;
    private Integer maxPeriodYears;
    private String policyDocumentUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
