package com.insurai.dto.policy;

import com.insurai.entity.Policy;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PolicyRequest {

    @NotBlank(message = "Policy name is required")
    private String name;

    private String description;

    @NotNull(message = "Premium per year is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Premium must be greater than 0")
    private BigDecimal premiumPerYear;

    @NotNull(message = "Coverage amount is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Coverage amount must be greater than 0")
    private BigDecimal coverageAmount;

    @NotNull(message = "Risk level is required")
    private Policy.RiskLevel riskLevel;

    @NotNull(message = "Minimum period years is required")
    @Min(value = 1, message = "Minimum period must be at least 1 year")
    private Integer minPeriodYears;

    @NotNull(message = "Maximum period years is required")
    @Min(value = 1, message = "Maximum period must be at least 1 year")
    private Integer maxPeriodYears;

    private String termsAndConditions;
}
