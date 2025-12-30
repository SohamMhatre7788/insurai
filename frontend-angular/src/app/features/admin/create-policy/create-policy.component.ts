import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';

@Component({
    selector: 'app-create-policy',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="container" style="padding: 2rem; max-width: 800px; margin: 0 auto;">
      <h1>Create New Policy</h1>
      <form [formGroup]="policyForm" (ngSubmit)="onSubmit()" class="card" style="padding: 2rem; margin-top: 2rem;">
        <div *ngIf="error" class="error-message">{{ error }}</div>
        <div *ngIf="success" class="success-message">Policy created successfully!</div>
        
        <div class="input-group">
          <label class="input-label">Policy Name</label>
          <input type="text" formControlName="name" class="input-field" />
        </div>

        <div class="input-group">
          <label class="input-label">Description</label>
          <textarea formControlName="description" class="input-field" rows="3"></textarea>
        </div>

        <div class="input-group">
          <label class="input-label">Coverage Amount</label>
          <input type="number" formControlName="coverageAmount" class="input-field" />
        </div>

        <div class="input-group">
          <label class="input-label">Premium Amount</label>
          <input type="number" formControlName="premiumAmount" class="input-field" />
        </div>

        <div class="input-group">
          <label class="input-label">Terms & Conditions</label>
          <textarea formControlName="termsAndConditions" class="input-field" rows="5"></textarea>
        </div>

        <button type="submit" class="btn btn-primary" [disabled]="loading || policyForm.invalid">
          {{ loading ? 'Creating...' : 'Create Policy' }}
        </button>
      </form>
    </div>
  `,
    styles: []
})
export class CreatePolicyComponent {
    policyForm: FormGroup;
    loading = false;
    error = '';
    success = false;

    constructor(
        private fb: FormBuilder,
        private adminService: AdminService,
        private router: Router
    ) {
        this.policyForm = this.fb.group({
            name: ['', Validators.required],
            description: ['', Validators.required],
            coverageAmount: ['', [Validators.required, Validators.min(1)]],
            premiumAmount: ['', [Validators.required, Validators.min(1)]],
            termsAndConditions: ['', Validators.required]
        });
    }

    onSubmit(): void {
        if (this.policyForm.invalid) return;
        this.loading = true;
        this.error = '';

        this.adminService.createPolicy(this.policyForm.value).subscribe({
            next: () => {
                this.success = true;
                this.loading = false;
                setTimeout(() => this.router.navigate(['/admin/policies']), 2000);
            },
            error: (err) => {
                this.error = err.error?.error || 'Failed to create policy';
                this.loading = false;
            }
        });
    }
}
