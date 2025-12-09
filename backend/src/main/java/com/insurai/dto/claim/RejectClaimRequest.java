package com.insurai.dto.claim;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RejectClaimRequest {

    @NotBlank(message = "Rejection reason is required")
    private String rejectionReason;
}
