import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile, UpdateProfileRequest, ChangePasswordRequest } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = `${environment.apiBaseUrl}/client/me`;

    constructor(private http: HttpClient) { }

    getProfile(userId: number): Observable<UserProfile> {
        return this.http.get<UserProfile>(`${this.apiUrl}?userId=${userId}`);
    }

    updateProfile(userId: number, data: UpdateProfileRequest): Observable<UserProfile> {
        return this.http.put<UserProfile>(`${this.apiUrl}?userId=${userId}`, data);
    }

    changePassword(userId: number, data: ChangePasswordRequest): Observable<any> {
        return this.http.put(`${this.apiUrl}/password?userId=${userId}`, data);
    }
    getCurrentUser() {
  return this.http.get(`${environment.apiBaseUrl}/client/me`);
}

}
