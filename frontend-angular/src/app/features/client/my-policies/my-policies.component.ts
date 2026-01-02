import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClientPolicyService } from '../../../core/services/client-policy.service';
import { ClientPolicy } from '../../../core/models/policy.model';

@Component({
  selector: 'app-my-policies',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div *ngIf="loading" class="loading"><div class="spinner"></div></div>
    <div *ngIf="!loading" class="container" style="padding: 2rem;">
      <h1>My Policies</h1>
      <div *ngIf="policies.length === 0" style="text-align: center; padding: 3rem;">
        <p>You don't have any policies yet.</p>
        <a routerLink="/client/buy-policy" class="btn btn-primary">Buy Your First Policy</a>
      </div>
      <table *ngIf="policies.length > 0" class="policies-table" style="width: 100%; margin-top: 2rem;">
        <thead>
          <tr>
            <th>Policy Name</th>
            <th>Company</th>
            <th>Status</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let policy of policies">
            <td>{{ policy.policyName || 'N/A' }}</td>
            <td>{{ policy.companyName }}</td>
            <td><span [class]="'badge badge-' + getBadgeClass(policy.status)">{{ policy.status }}</span></td>
            <td>{{ policy.startDate | date }}</td>
            <td>{{ policy.endDate | date }}</td>
            <td><button class="btn btn-outline" (click)="renewPolicy(policy.id)">Renew</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    th { text-align: left; padding: 1rem; }
    td { padding: 0.75rem 1rem; }
  `]
})
export class MyPoliciesComponent implements OnInit {
  policies: ClientPolicy[] = [];
  loading = true;

  constructor(private clientPolicyService: ClientPolicyService) { }

  ngOnInit(): void {
    this.clientPolicyService.getMyPolicies().subscribe({
      next: (data) => {
        this.policies = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getBadgeClass(status: string): string {
    return status === 'ACTIVE' ? 'success' : status === 'EXPIRED' ? 'danger' : 'warning';
  }

  renewPolicy(id: number): void {
    this.clientPolicyService.renewPolicy(id).subscribe({
      next: () => {
        alert('Policy renewed successfully!');
        this.ngOnInit();
      }
    });
  }
}
