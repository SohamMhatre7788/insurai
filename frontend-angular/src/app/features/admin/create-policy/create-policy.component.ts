import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-create-policy',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="create-policy-container container">
      <div class="page-header">
      <h1 class="page-title">{{ isEditMode ? 'Edit Policy' : 'Create New Policy' }}</h1>
      </div>

      <form [formGroup]="policyForm" (ngSubmit)="onSubmit()" class="form-card fade-in">
        <div *ngIf="error" class="error-message">{{ error }}</div>
        <div *ngIf="success" class="success-message">Policy {{ isEditMode ? 'updated' : 'created' }} successfully!</div>
        
        <div class="input-group">
          <label class="input-label">Policy Name</label>
          <input type="text" formControlName="name" class="input-field" placeholder="ex: Health Shield Plus" />
        </div>

        <div class="input-group">
          <label class="input-label">Description</label>
          <textarea formControlName="description" class="input-field" rows="3" placeholder="Policy details..."></textarea>
        </div>

        <div class="form-row">
            <div class="input-group">
              <label class="input-label">Coverage Amount (₹)</label>
              <input type="number" formControlName="coverageAmount" class="input-field" />
            </div>

            <div class="input-group">
              <label class="input-label">Premium Amount (₹)</label>
              <input type="number" formControlName="premiumPerYear" class="input-field" />
            </div>
        </div>

        <div class="form-row">
            <div class="input-group">
              <label class="input-label">Min Period (Years)</label>
              <input type="number" formControlName="minPeriodYears" class="input-field" />
            </div>

            <div class="input-group">
              <label class="input-label">Max Period (Years)</label>
              <input type="number" formControlName="maxPeriodYears" class="input-field" />
            </div>
        </div>

        <div class="input-group">
          <label class="input-label">Risk Level</label>
          <select formControlName="riskLevel" class="input-field">
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        <div class="input-group">
          <label class="input-label">Terms & Conditions</label>
          <textarea formControlName="termsAndConditions" class="input-field" rows="5"></textarea>
        </div>

        <div class="form-actions">
            <button type="button" class="btn btn-outline" (click)="cancel()">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="loading || policyForm.invalid">
            {{ loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Policy' : 'Create Policy') }}
            </button>
        </div>
      </form>
    </div>
  `,
  styleUrls: ['./create-policy.component.scss']
})
export class CreatePolicyComponent implements OnInit {
  policyForm: FormGroup;
  loading = false;
  error = '';
  success = false;
  isEditMode = false;
  policyId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.policyForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      coverageAmount: ['', [Validators.required, Validators.min(1)]],
      premiumPerYear: ['', [Validators.required, Validators.min(1)]],
      minPeriodYears: ['', [Validators.required, Validators.min(1)]],
      maxPeriodYears: ['', [Validators.required, Validators.min(1)]],
      riskLevel: ['MEDIUM', Validators.required],
      termsAndConditions: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Check if we have a policy ID in the route
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.policyId = +params['id'];
        this.loadPolicyData(this.policyId);
      }
    });
  }

  loadPolicyData(id: number): void {
    this.loading = true;
    this.adminService.getPolicyById(id).subscribe({
      next: (policy) => {
        this.policyForm.patchValue({
          name: policy.name,
          description: policy.description,
          coverageAmount: policy.coverageAmount,
          premiumPerYear: policy.premiumPerYear,
          minPeriodYears: policy.minPeriodYears,
          maxPeriodYears: policy.maxPeriodYears,
          riskLevel: policy.riskLevel,
          termsAndConditions: policy.termsAndConditions
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load policy data';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.policyForm.invalid) return;
    this.loading = true;
    this.error = '';

    const operation = this.isEditMode && this.policyId
      ? this.adminService.updatePolicy(this.policyId, this.policyForm.value)
      : this.adminService.createPolicy(this.policyForm.value);

    operation.subscribe({
      next: () => {
        this.success = true;
        this.loading = false;
        setTimeout(() => this.router.navigate(['/admin/policies']), 2000);
      },
      error: (err) => {
        console.error('Create Policy Error:', err);
        // Try to extract the most specific message
        const backendError = err.error;
        let msg = 'Failed to create policy';

        if (typeof backendError === 'string') {
          msg = backendError;
        } else if (backendError?.message) {
          msg = backendError.message;
        } else if (backendError?.error) {
          msg = backendError.error;
        } else if (backendError?.errors) {
          // Spring validation errors often come as a list or map
          msg = JSON.stringify(backendError.errors);
        }

        this.error = msg;
        this.loading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/policies']);
  }
}
