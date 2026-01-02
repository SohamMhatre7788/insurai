import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Claim, CreateClaimRequest } from '../models/policy.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ClaimService {
    private apiUrl = `${environment.apiBaseUrl}/claims`;

    constructor(private http: HttpClient) { }

    createClaim(formData: FormData): Observable<Claim> {
        return this.http.post<Claim>(this.apiUrl, formData);
    }

    getMyClaims(): Observable<Claim[]> {
        return this.http.get<Claim[]>(`${this.apiUrl}/my`);
    }
}
