import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User, AuthResponse, LoginRequest, SignupRequest } from '../models/auth.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private userSubject = new BehaviorSubject<User | null>(null);
    private tokenSubject = new BehaviorSubject<string | null>(null);
    private loadingSubject = new BehaviorSubject<boolean>(true);

    public user$ = this.userSubject.asObservable();
    public token$ = this.tokenSubject.asObservable();
    public loading$ = this.loadingSubject.asObservable();

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        this.initializeAuth();
    }

    private initializeAuth(): void {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            try {
                const user = JSON.parse(storedUser);
                this.tokenSubject.next(storedToken);
                this.userSubject.next(user);
            } catch (error) {
                console.error('Error parsing stored user:', error);
                this.clearAuth();
            }
        }
        this.loadingSubject.next(false);
    }

    login(credentials: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${environment.apiBaseUrl}/auth/login`, credentials)
            .pipe(
                tap(response => this.handleAuthResponse(response))
            );
    }

    signup(data: SignupRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${environment.apiBaseUrl}/auth/signup`, data)
            .pipe(
                tap(response => this.handleAuthResponse(response))
            );
    }

    private handleAuthResponse(authData: AuthResponse): void {
        const { token, id, email, first_name, last_name, role } = authData;

        const userData: User = {
            id,
            email,
            firstName: first_name,
            lastName: last_name,
            role
        };

        this.tokenSubject.next(token);
        this.userSubject.next(userData);

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
    }

    logout(): void {
        this.clearAuth();
        this.router.navigate(['/login']);
    }

    private clearAuth(): void {
        this.tokenSubject.next(null);
        this.userSubject.next(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    getToken(): string | null {
        return this.tokenSubject.value;
    }

    getUser(): User | null {
        return this.userSubject.value;
    }

    isAuthenticated(): boolean {
        return !!this.tokenSubject.value;
    }

    isClient(): boolean {
        return this.userSubject.value?.role === 'CLIENT';
    }

    isAdmin(): boolean {
        return this.userSubject.value?.role === 'ADMIN';
    }

    isLoading(): boolean {
        return this.loadingSubject.value;
    }
}
