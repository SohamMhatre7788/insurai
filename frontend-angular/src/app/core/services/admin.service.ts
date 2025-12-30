import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Policy, Claim } from '../models/policy.model';
import { UserProfile } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private apiUrl = `${environment.apiBaseUrl}/admin`;

    constructor(private http: HttpClient) { }

    // Policy Management
    createPolicy(data: any): Observable<Policy> {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (key !== 'document' && data[key] !== null && data[key] !== undefined) {
                formData.append(key, data[key]);
            }
        });
        if (data.document) {
            formData.append('document', data.document);
        }

        return this.http.post<Policy>(`${this.apiUrl}/policies`, formData);
    }

    getAllPolicies(): Observable<Policy[]> {
        return this.http.get<Policy[]>(`${this.apiUrl}/policies`);
    }

    getPolicyById(id: number): Observable<Policy> {
        return this.http.get<Policy>(`${this.apiUrl}/policies/${id}`);
    }

    updatePolicy(id: number, data: any): Observable<Policy> {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (key !== 'document' && data[key] !== null && data[key] !== undefined) {
                formData.append(key, data[key]);
            }
        });
        if (data.document) {
            formData.append('document', data.document);
        }

        return this.http.put<Policy>(`${this.apiUrl}/policies/${id}`, formData);
    }

    deletePolicy(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/policies/${id}`);
    }

    // Claim Management
    getAllClaims(status?: string): Observable<Claim[]> {
        let params = new HttpParams();
        if (status) {
            params = params.set('status', status);
        }
        return this.http.get<Claim[]>(`${this.apiUrl}/claims`, { params });
    }

    getClaimById(id: number): Observable<Claim> {
        return this.http.get<Claim>(`${this.apiUrl}/claims/${id}`);
    }

    approveClaim(id: number, approvedCoverageAmount: number): Observable<Claim> {
        return this.http.put<Claim>(`${this.apiUrl}/claims/${id}/approve`, {
            approvedCoverageAmount
        });
    }

    rejectClaim(id: number, rejectionReason: string): Observable<Claim> {
        return this.http.put<Claim>(`${this.apiUrl}/claims/${id}/reject`, {
            rejectionReason
        });
    }

    // User Management
    getAllClients(): Observable<UserProfile[]> {
        return this.http.get<UserProfile[]>(`${this.apiUrl}/users`);
    }

    getClientById(id: number): Observable<UserProfile> {
        return this.http.get<UserProfile>(`${this.apiUrl}/users/${id}`);
    }

    updateClient(id: number, data: any): Observable<UserProfile> {
        return this.http.put<UserProfile>(`${this.apiUrl}/users/${id}`, data);
    }

    deleteClient(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/users/${id}`);
    }
}
