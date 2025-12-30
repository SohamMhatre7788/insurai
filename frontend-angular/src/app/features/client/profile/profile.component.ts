import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="container" style="padding: 2rem; max-width: 600px; margin: 0 auto;">
      <h1>Profile Settings</h1>
      <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="card" style="padding: 2rem; margin-top: 2rem;">
        <div *ngIf="error" class="error-message">{{ error }}</div>
        <div *ngIf="success" class="success-message">Profile updated successfully!</div>
        
        <div class="input-group">
          <label class="input-label">First Name</label>
          <input type="text" formControlName="firstName" class="input-field" />
        </div>

        <div class="input-group">
          <label class="input-label">Last Name</label>
          <input type="text" formControlName="lastName" class="input-field" />
        </div>

        <div class="input-group">
          <label class="input-label">Phone Number</label>
          <input type="text" formControlName="phoneNumber" class="input-field" />
        </div>

        <div class="input-group">
          <label class="input-label">Address</label>
          <textarea formControlName="address" class="input-field" rows="3"></textarea>
        </div>

        <button type="submit" class="btn btn-primary" [disabled]="loading || profileForm.invalid">
          {{ loading ? 'Updating...' : 'Update Profile' }}
        </button>
      </form>
    </div>
  `,
    styles: []
})
export class ProfileComponent implements OnInit {
    profileForm: FormGroup;
    loading = false;
    error = '';
    success = false;

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private authService: AuthService
    ) {
        this.profileForm = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            phoneNumber: ['', Validators.required],
            address: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        const user = this.authService.getUser();
        if (user) {
            this.userService.getProfile(user.id).subscribe({
                next: (profile) => {
                    this.profileForm.patchValue(profile);
                }
            });
        }
    }

    onSubmit(): void {
        if (this.profileForm.invalid) return;
        this.loading = true;
        this.error = '';

        const user = this.authService.getUser();
        if (!user) return;

        this.userService.updateProfile(user.id, this.profileForm.value).subscribe({
            next: () => {
                this.success = true;
                this.loading = false;
            },
            error: (err) => {
                this.error = err.error?.error || 'Failed to update profile';
                this.loading = false;
            }
        });
    }
}
