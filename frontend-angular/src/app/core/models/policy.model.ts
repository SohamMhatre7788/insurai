export interface Policy {
    id: number;
    name: string;
    description: string;
    coverageAmount: number;
    premiumAmount: number;
    termsAndConditions: string;
    documentPath?: string;
    premiumPerYear?: number;
    minPeriodYears?: number;
    maxPeriodYears?: number;
    riskLevel?: string;
}

export interface ClientPolicy {
    id: number;
    policyId: number;
    companyName: string;
    numberOfEmployees: number;
    policyPeriodYears: number;
    status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
    startDate: string;
    endDate: string;
    policy?: Policy;
}

export interface BuyPolicyRequest {
    policyId: number;
    companyName: string;
    numberOfEmployees: number;
    policyPeriodYears: number;
}

export interface Claim {
    id: number;
    clientPolicyId: number;
    claimAmountRequested: number;
    approvedCoverageAmount?: number;
    description: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    rejectionReason?: string;
    claimDate: string;
}

export interface CreateClaimRequest {
    clientPolicyId: number;
    claimAmountRequested: number;
    description: string;
    documents?: File[];
}
