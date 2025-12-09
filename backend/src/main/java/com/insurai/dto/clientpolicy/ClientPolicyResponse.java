package com.insurai.dto.clientpolicy;

import com.insurai.entity.ClientPolicy;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClientPolicyResponse {

    private Long id;
    private Long policyId;
    private String policyName;
    private String companyName;
    private Integer numberOfEmployees;
    private Integer policyPeriodYears;
    private BigDecimal premiumAmount;
    private BigDecimal coverageAmount;
    private LocalDate startDate;
    private LocalDate endDate;
    private ClientPolicy.PolicyStatus status;
}
