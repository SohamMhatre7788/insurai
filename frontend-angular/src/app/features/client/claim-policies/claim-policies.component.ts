import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClientPolicyService } from '../../../core/services/client-policy.service';
import { ClaimService } from '../../../core/services/claim.service';

@Component({
  selector: 'app-claim-policies',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container" style="padding: 2rem; max-width: 800px; margin: 0 auto;">
      <h1>File a Claim</h1>
      <form [formGroup]="claimForm" (ngSubmit)="onSubmit()" class="card" style="padding: 2rem; margin-top: 2rem;">
        <div *ngIf="error" class="error-message">{{ error }}</div>
        <div *ngIf="success" class="success-message">Claim submitted successfully!</div>
        
        <div class="input-group">
          <label class="input-label">Select Policy</label>
          <select formControlName="clientPolicyId" class="input-field">
            <option value="">Choose a policy...</option>
            <option *ngFor="let policy of policies" [value]="policy.id">
              {{ policy.policy?.name }} - {{ policy.companyName }}
            </option>
          </select>
        </div>

        <div class="input-group">
          <label class="input-label">Claim Amount</label>
          <input type="number" formControlName="claimAmountRequested" class="input-field" />
        </div>

        <div class="input-group">
          <label class="input-label">Description</label>
          <textarea formControlName="description" class="input-field" rows="4"></textarea>
        </div>

        <button type="submit" class="btn btn-primary" [disabled]="loading || claimForm.invalid">
          {{ loading ? 'Submitting...' : 'Submit Claim' }}
        </button>
      </form>
    </div>
  `,
  styles: []
})
export class ClaimPoliciesComponent {
  claimForm: FormGroup;
  policies: any[] = [];
  loading = false;
  error = '';
  success = false;

  constructor(
    private fb: FormBuilder,
    private clientPolicyService: ClientPolicyService,
    private claimService: ClaimService
  ) {
    this.claimForm = this.fb.group({
      clientPolicyId: ['', Validators.required],
      claimAmountRequested: ['', [Validators.required, Validators.min(1)]],
      description: ['', Validators.required]
    });

    this.clientPolicyService.getMyPolicies().subscribe({
      next: (data) => this.policies = data
    });
  }

  onSubmit(): void {
    if (this.claimForm.invalid) return;
    this.loading = true;
    this.error = '';

    this.claimService.createClaim(this.claimForm.value).subscribe({
      next: () => {
        this.success = true;
        this.loading = false;
        this.claimForm.reset();
      },
      error: (err) => {
        this.error = err.error?.error || 'Failed to submit claim';
        this.loading = false;
      }
    });
  }
}
