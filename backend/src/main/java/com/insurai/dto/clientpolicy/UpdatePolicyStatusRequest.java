package com.insurai.dto.clientpolicy;

import com.insurai.entity.ClientPolicy;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePolicyStatusRequest {

    @NotNull(message = "Policy status is required")
    private ClientPolicy.PolicyStatus status;
}
