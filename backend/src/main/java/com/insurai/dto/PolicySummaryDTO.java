package com.insurai.dto;

import java.math.BigDecimal;

public class PolicySummaryDTO {
    private String name;
    private String riskLevel;
    private BigDecimal coverageAmount;
    private BigDecimal premiumPerYear;
    private Integer minPeriodYears;
    private Integer maxPeriodYears;

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }

    public BigDecimal getCoverageAmount() { return coverageAmount; }
    public void setCoverageAmount(BigDecimal coverageAmount) { this.coverageAmount = coverageAmount; }

    public BigDecimal getPremiumPerYear() { return premiumPerYear; }
    public void setPremiumPerYear(BigDecimal premiumPerYear) { this.premiumPerYear = premiumPerYear; }

    public Integer getMinPeriodYears() { return minPeriodYears; }
    public void setMinPeriodYears(Integer minPeriodYears) { this.minPeriodYears = minPeriodYears; }

    public Integer getMaxPeriodYears() { return maxPeriodYears; }
    public void setMaxPeriodYears(Integer maxPeriodYears) { this.maxPeriodYears = maxPeriodYears; }
}
