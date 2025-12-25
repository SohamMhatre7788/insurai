package com.insurai.dto;

import java.util.List;

public class AiContextDTO {
    private String role; // "CLIENT" or "ADMIN"
    private List<PolicySummaryDTO> availablePolicies;
    private List<String> claimStatuses; // List of claim status names
    private List<String> policyNames;   // Optional: just names for quick reference

    // Getters and Setters
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public List<PolicySummaryDTO> getAvailablePolicies() { return availablePolicies; }
    public void setAvailablePolicies(List<PolicySummaryDTO> availablePolicies) { this.availablePolicies = availablePolicies; }

    public List<String> getClaimStatuses() { return claimStatuses; }
    public void setClaimStatuses(List<String> claimStatuses) { this.claimStatuses = claimStatuses; }

    public List<String> getPolicyNames() { return policyNames; }
    public void setPolicyNames(List<String> policyNames) { this.policyNames = policyNames; }
}

