import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
    signupForm: FormGroup;
    error = '';
    loading = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.signupForm = this.fb.group({
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', [Validators.required]]
        }, { validators: this.passwordMatchValidator });
    }

    passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
        const password = control.get('password');
        const confirmPassword = control.get('confirmPassword');

        if (!password || !confirmPassword) {
            return null;
        }

        return password.value === confirmPassword.value ? null : { passwordMismatch: true };
    }

    get firstName() {
        return this.signupForm.get('firstName');
    }

    get lastName() {
        return this.signupForm.get('lastName');
    }

    get email() {
        return this.signupForm.get('email');
    }

    get password() {
        return this.signupForm.get('password');
    }

    get confirmPassword() {
        return this.signupForm.get('confirmPassword');
    }

    onSubmit(): void {
        if (this.signupForm.invalid) {
            this.signupForm.markAllAsTouched();
            return;
        }

        this.loading = true;
        this.error = '';

        const { confirmPassword, ...signupData } = this.signupForm.value;

        this.authService.signup(signupData).subscribe({
            next: () => {
                this.router.navigate(['/client']); // New users are always clients
            },
            error: (err) => {
                this.error = err.error?.error || 'Signup failed. Please try again.';
                this.loading = false;
            }
        });
    }
}
