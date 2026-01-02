import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PolicyService } from '../../../core/services/policy.service';
import { ClientPolicyService } from '../../../core/services/client-policy.service';
import { Policy } from '../../../core/models/policy.model';

@Component({
    selector: 'app-buy-policy',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './buy-policy.component.html',
    styleUrls: ['./buy-policy.component.scss']
})
export class BuyPolicyComponent implements OnInit {
    policies: Policy[] = [];
    selectedPolicy: Policy | null = null;
    purchaseForm: FormGroup;
    loading = true;
    purchasing = false;
    error = '';
    success = false;
    showTermsModal = false;

    constructor(
        private fb: FormBuilder,
        private policyService: PolicyService,
        private clientPolicyService: ClientPolicyService,
        private router: Router
    ) {
        this.purchaseForm = this.fb.group({
            policyId: ['', Validators.required],
            companyName: ['', Validators.required],
            numberOfEmployees: ['', [Validators.required, Validators.min(1)]],
            policyPeriodYears: ['', Validators.required],
            acceptedTerms: [false, Validators.requiredTrue]
        });
    }

    ngOnInit(): void {
        this.fetchPolicies();
    }

    fetchPolicies(): void {
        this.policyService.getAllPolicies().subscribe({
            next: (data) => {
                this.policies = data;
                this.loading = false;
            },
            error: () => {
                this.error = 'Failed to load policies';
                this.loading = false;
            }
        });
    }

    selectPolicy(policy: Policy): void {
        this.selectedPolicy = policy;
        this.purchaseForm.patchValue({
            policyId: policy.id,
            policyPeriodYears: policy.minPeriodYears || 1
        });
    }

    calculatePremium(): number {
        if (!this.selectedPolicy || !this.purchaseForm.value.numberOfEmployees) return 0;
        return (this.selectedPolicy.premiumPerYear || 0) * this.purchaseForm.value.numberOfEmployees;
    }

    onSubmit(): void {
        if (this.purchaseForm.invalid) return;

        this.purchasing = true;
        this.error = '';

        this.clientPolicyService.buyPolicy(this.purchaseForm.value).subscribe({
            next: () => {
                this.success = true;
                this.purchasing = false;
            },
            error: (err) => {
                this.error = err.error?.error || 'Failed to purchase policy';
                this.purchasing = false;
            }
        });
    }

    goToDashboard(): void {
        this.router.navigate(['/client']);
    }

    viewMyPolicies(): void {
        this.router.navigate(['/client/my-policies']);
    }

    backToPolicies(): void {
        this.selectedPolicy = null;
    }

    openTermsModal(): void {
        this.showTermsModal = true;
    }

    closeTermsModal(): void {
        this.showTermsModal = false;
    }
}
