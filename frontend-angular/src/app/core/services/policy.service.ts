import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Policy } from '../models/policy.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PolicyService {
    private apiUrl = `${environment.apiBaseUrl}/policies`;

    constructor(private http: HttpClient) { }

    getAllPolicies(): Observable<Policy[]> {
        return this.http.get<Policy[]>(this.apiUrl);
    }

    getPolicyById(id: number): Observable<Policy> {
        return this.http.get<Policy>(`${this.apiUrl}/${id}`);
    }
}
