import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    loginForm: FormGroup;
    error = '';
    loading = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    get email() {
        return this.loginForm.get('email');
    }

    get password() {
        return this.loginForm.get('password');
    }

    onSubmit(): void {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }

        this.loading = true;
        this.error = '';

        this.authService.login(this.loginForm.value).subscribe({
            next: (response) => {
                // Redirect based on role
                if (response.role === 'CLIENT') {
                    this.router.navigate(['/client']);
                } else if (response.role === 'ADMIN') {
                    this.router.navigate(['/admin']);
                }
            },
            error: (err) => {
                this.error = err.error?.error || 'Login failed. Please try again.';
                this.loading = false;
            }
        });
    }
}
