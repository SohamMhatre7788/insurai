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

    createClaim(data: CreateClaimRequest): Observable<Claim> {
        const formData = new FormData();
        formData.append('clientPolicyId', data.clientPolicyId.toString());
        formData.append('claimAmountRequested', data.claimAmountRequested.toString());
        formData.append('description', data.description);

        if (data.documents && data.documents.length > 0) {
            data.documents.forEach((doc) => {
                formData.append('documents', doc);
            });
        }

        return this.http.post<Claim>(this.apiUrl, formData);
    }

    getMyClaims(): Observable<Claim[]> {
        return this.http.get<Claim[]>(`${this.apiUrl}/my`);
    }
}
