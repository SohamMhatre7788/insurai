package com.insurai.dto.claim;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApproveClaimRequest {

    @NotNull(message = "Approved coverage amount is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Approved amount must be greater than 0")
    private BigDecimal approvedCoverageAmount;
}
