import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userId!: number;

  // ===== FORMS =====
  profileForm!: FormGroup;
  passwordForm!: FormGroup;

  // ===== STATE =====
  loading = true;
  profileSuccess = '';
  profileError = '';
  passwordSuccess = '';
  passwordError = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService
  ) {}

ngOnInit(): void {
  this.initForms();

  // 🔥 DIRECT BACKEND CALL – single source of truth
  this.userService.getCurrentUser().subscribe({
    next: (user: any) => {
      console.log('BACKEND USER =>', user);

      this.userId = Number(user.id);

      this.profileForm.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      });

      this.loading = false;
    },
    error: (err) => {
      console.error('CURRENT USER ERROR', err);
      this.profileError = 'Failed to load user profile';
      this.loading = false;
    }
  });
}


  // =========================
  // INIT FORMS
  // =========================
  initForms(): void {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmNewPassword: ['', Validators.required]
    });
  }

  // =========================
  // FETCH PROFILE
  // =========================
fetchProfile(): void {
  this.userService.getProfile(this.userId).subscribe({
    next: (data: any) => {
      this.profileForm.patchValue({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email
      });
      this.loading = false;
    },
    error: (err) => {
      console.error('PROFILE LOAD ERROR', err);
      this.profileError = 'Failed to load profile';
      this.loading = false;
    }
  });
}





  // =========================
  // UPDATE PROFILE
  // =========================
onProfileSubmit(): void {
  if (this.profileForm.invalid) return;

  console.log('UPDATING PROFILE FOR USER ID =>', this.userId);

  this.userService
    .updateProfile(this.userId, this.profileForm.value)
    .subscribe({
      next: (updatedUser: any) => {
        const existingUser = this.authService.getUser();

        this.authService.setUser({
          ...existingUser,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email
        });

        this.profileSuccess = 'Profile updated successfully!';
      },
      error: (err) => {
        console.error('UPDATE ERROR', err);
        this.profileError = err.error?.error || 'Profile update failed';
      }
    });
}



  // =========================
  // CHANGE PASSWORD
  // =========================
 onPasswordSubmit(): void {
  if (this.passwordForm.invalid) return;

  const { newPassword, confirmNewPassword } = this.passwordForm.value;

  if (newPassword !== confirmNewPassword) {
    this.passwordError = 'New passwords do not match';
    return;
  }

  console.log('CHANGING PASSWORD FOR USER ID =>', this.userId);

  this.userService
    .changePassword(this.userId, this.passwordForm.value)
    .subscribe({
      next: () => {
        this.passwordSuccess = 'Password changed successfully!';
        this.passwordForm.reset();
      },
      error: (err) => {
        console.error('PASSWORD ERROR', err);
        this.passwordError = err.error?.error || 'Password change failed';
      }
    });
}


}