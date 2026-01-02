import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClientPolicyService } from '../../../core/services/client-policy.service';
import { ClaimService } from '../../../core/services/claim.service';
import { ClientPolicy } from '../../../core/models/policy.model';

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
              {{ policy.policyName }} - {{ policy.companyName }}
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

        <div class="input-group">
          <label class="input-label">Supporting Documents (PDF or Images) *</label>
          <input 
            type="file" 
            #fileInput
            (change)="onFileSelect($event)" 
            accept=".pdf,.jpg,.jpeg,.png"
            multiple
            class="input-field"
            style="padding: 0.5rem;"
          />
          <small style="color: var(--text-secondary); margin-top: 0.25rem; display: block;">
            Upload PDF or images (JPG, PNG). At least one document required.
          </small>
        </div>

        <div *ngIf="selectedFiles.length > 0" class="file-preview-section">
          <strong>Selected Files ({{ selectedFiles.length }}):</strong>
          <div class="file-list">
            <div *ngFor="let file of selectedFiles; let i = index" class="file-item">
              <span class="file-name">{{ file.name }} ({{ formatFileSize(file.size) }})</span>
              <button type="button" class="btn-remove" (click)="removeFile(i)">&times;</button>
            </div>
          </div>
        </div>

        <div *ngIf="fileError" class="error-message" style="margin-top: 0.5rem;">
          {{ fileError }}
        </div>

        <button type="submit" class="btn btn-primary" [disabled]="loading || claimForm.invalid">
          {{ loading ? 'Submitting...' : 'Submit Claim' }}
        </button>
      </form>
    </div>
  `,
  styles: [`
    .file-preview-section {
      margin-top: 1rem;
      padding: 1rem;
      background: var(--bg-muted);
      border-radius: 0.5rem;
      border: 1px solid var(--border-color);
    }

    .file-list {
      margin-top: 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .file-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0.75rem;
      background: var(--bg-primary);
      border-radius: 0.375rem;
      border: 1px solid var(--border-color);
    }

    .file-name {
      color: var(--text-primary);
      font-size: 0.875rem;
      flex: 1;
    }

    .btn-remove {
      background: none;
      border: none;
      color: var(--text-secondary);
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.15s ease;
    }

    .btn-remove:hover {
      color: #ef4444;
    }
  `]
})
export class ClaimPoliciesComponent implements OnInit {
  claimForm: FormGroup;
  policies: ClientPolicy[] = [];
  selectedFiles: File[] = [];
  loading = false;
  error = '';
  success = false;
  fileError = '';

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
  }

  ngOnInit(): void {
    this.clientPolicyService.getMyPolicies().subscribe({
      next: (data) => this.policies = data,
      error: (err) => console.error('Failed to load policies', err)
    });
  }

  onFileSelect(event: any): void {
    const files: FileList = event.target.files;
    this.fileError = '';

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate file type
      const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        this.fileError = `Invalid file type: ${file.name}. Only PDF and images (JPG, PNG) are allowed.`;
        continue;
      }

      // Validate file size (10MB max)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        this.fileError = `File too large: ${file.name}. Maximum size is 10MB.`;
        continue;
      }

      this.selectedFiles.push(file);
    }
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.fileError = '';
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  onSubmit(): void {
    if (this.claimForm.invalid) return;

    // Validate files
    if (this.selectedFiles.length === 0) {
      this.fileError = 'At least one supporting document is required.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.fileError = '';

    // Create FormData
    const formData = new FormData();
    formData.append('clientPolicyId', this.claimForm.get('clientPolicyId')?.value);
    formData.append('claimAmountRequested', this.claimForm.get('claimAmountRequested')?.value);
    formData.append('description', this.claimForm.get('description')?.value);

    // Append all files
    this.selectedFiles.forEach((file) => {
      formData.append('documents', file);
    });

    this.claimService.createClaim(formData).subscribe({
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
