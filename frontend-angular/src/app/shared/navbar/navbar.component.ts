import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { AuthService } from '../../core/services/auth.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterModule, ThemeToggleComponent],
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
    user$: Observable<any>;
    isAuthenticated$: Observable<any>;

    constructor(private authService: AuthService) {
        this.user$ = this.authService.user$;
        this.isAuthenticated$ = this.authService.user$;
    }

    get isClient(): boolean {
        return this.authService.isClient();
    }

    get isAdmin(): boolean {
        return this.authService.isAdmin();
    }

    logout(): void {
        this.authService.logout();
    }
}
