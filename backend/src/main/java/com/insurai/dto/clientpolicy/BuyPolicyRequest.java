package com.insurai.dto.clientpolicy;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BuyPolicyRequest {

    @NotNull(message = "Policy ID is required")
    private Long policyId;

    @NotBlank(message = "Company name is required")
    private String companyName;

    @NotNull(message = "Number of employees is required")
    @Min(value = 1, message = "Number of employees must be at least 1")
    private Integer numberOfEmployees;

    @NotNull(message = "Policy period years is required")
    @Min(value = 1, message = "Policy period must be at least 1 year")
    private Integer policyPeriodYears;
}
