import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        if (this.authService.isLoading()) {
            return false;
        }

        if (!this.authService.isAuthenticated()) {
            this.router.navigate(['/login']);
            return false;
        }

        const requiredRole = route.data['requiredRole'] as string;
        const user = this.authService.getUser();

        if (requiredRole && user?.role !== requiredRole) {
            // Redirect to appropriate dashboard based on role
            if (user?.role === 'CLIENT') {
                this.router.navigate(['/client']);
            } else if (user?.role === 'ADMIN') {
                this.router.navigate(['/admin']);
            } else {
                this.router.navigate(['/login']);
            }
            return false;
        }

        return true;
    }
}
