import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClientPolicy, BuyPolicyRequest } from '../models/policy.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ClientPolicyService {
    private apiUrl = `${environment.apiBaseUrl}/client-policies`;

    constructor(private http: HttpClient) { }

    buyPolicy(data: BuyPolicyRequest): Observable<ClientPolicy> {
        const payload = {
            policyId: Number(data.policyId),
            companyName: data.companyName,
            numberOfEmployees: Number(data.numberOfEmployees),
            policyPeriodYears: Number(data.policyPeriodYears)
        };
        return this.http.post<ClientPolicy>(this.apiUrl, payload);
    }

    getMyPolicies(): Observable<ClientPolicy[]> {
        return this.http.get<ClientPolicy[]>(this.apiUrl);
    }

    getPolicyById(id: number): Observable<ClientPolicy> {
        return this.http.get<ClientPolicy>(`${this.apiUrl}/${id}`);
    }

    renewPolicy(id: number): Observable<ClientPolicy> {
        return this.http.post<ClientPolicy>(`${this.apiUrl}/${id}/renew`, {});
    }
}
