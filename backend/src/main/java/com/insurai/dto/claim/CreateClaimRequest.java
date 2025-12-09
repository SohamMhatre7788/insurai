package com.insurai.dto.claim;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateClaimRequest {

    @NotNull(message = "Client policy ID is required")
    private Long clientPolicyId;

    @NotNull(message = "Claim amount is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Claim amount must be greater than 0")
    private BigDecimal claimAmountRequested;

    @NotBlank(message = "Description is required")
    private String description;
}
