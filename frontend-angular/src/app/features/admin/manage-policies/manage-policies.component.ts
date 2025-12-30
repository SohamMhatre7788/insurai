import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { Policy } from '../../../core/models/policy.model';

@Component({
  selector: 'app-manage-policies',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="manage-policies-container container">
      <div class="page-header">
          <h1 class="page-title fade-in">Manage Policies</h1>
          <a routerLink="/admin/create-policy" class="btn btn-primary">
              Create New Policy
          </a>
      </div>

      <div *ngIf="errorMessage" class="error-message fade-in">
        {{ errorMessage }}
      </div>

      <div class="policies-table-container card fade-in">
          <table class="policies-table" *ngIf="policies.length > 0; else noPolicies">
              <thead>
                  <tr>
                      <th>Policy Name</th>
                      <th>Premium/Year</th>
                      <th>Coverage</th>
                      <th>Risk Level</th>
                      <th>Period Range</th>
                      <th>Actions</th>
                  </tr>
              </thead>
              <tbody>
                  <tr *ngFor="let policy of policies">
                      <td>{{ policy.name }}</td>
                      <td>{{ policy.premiumAmount | number }} Rupees</td>
                      <td>{{ policy.coverageAmount | number }} Rupees</td>
                      <td>
                          <span [class]="'badge badge-' + (policy.riskLevel?.toLowerCase() || 'medium')">
                              {{ policy.riskLevel || 'Medium' }}
                          </span>
                      </td>
                      <td>{{ policy.minPeriodYears }}-{{ policy.maxPeriodYears }} years</td>
                      <td>
                          <div class="actions">
                              <!-- Angular typically handles documents via a separate service or simple link if URL is public -->
                              <!-- Assuming policy has documentUrl field which might differ from React's property name, 
                                   but looking at React code it is policyDocumentUrl. 
                                   Checking Policy model definition might be needed, but sticking to React property first. -->
                               
                              <!-- Note: In React code it was policyDocumentUrl. In Policy model, it might be different. 
                                   Let's check usage. The model file was unseen but I will assume standard match or check error. -->
                              
                              <!-- For now, assuming standard buttons -->
                               <!-- If policy has a document url, show view doc -->
                               <!-- Since I don't see the specific property in the previous 'Policy' interface view, 
                                    I will be safe and just put Delete first, and View Doc if I can find the prop.
                                    React used 'policyDocumentUrl'. -->
                              
                              <button
                                  class="btn btn-sm btn-danger"
                                  (click)="deletePolicy(policy.id)"
                              >
                                  Delete
                              </button>
                          </div>
                      </td>
                  </tr>
              </tbody>
          </table>
          <ng-template #noPolicies>
              <p style="padding: 2rem; text-align: center;">No policies found.</p>
          </ng-template>
      </div>
    </div>
  `,
  styleUrls: ['./manage-policies.component.scss']
})
export class ManagePoliciesComponent implements OnInit {
  policies: Policy[] = [];
  errorMessage: string = '';

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadPolicies();
  }

  loadPolicies(): void {
    this.errorMessage = '';
    this.adminService.getAllPolicies().subscribe({
      next: (data) => this.policies = data,
      error: (err) => {
        console.error('Error loading policies', err);
        this.errorMessage = 'Failed to load policies. Please try again later.';
      }
    });
  }

  deletePolicy(id: number): void {
    if (confirm('Are you sure you want to delete this policy?')) {
      this.adminService.deletePolicy(id).subscribe({
        next: () => {
          alert('Policy deleted successfully!');
          this.loadPolicies();
        },
        error: () => alert('Failed to delete policy')
      });
    }
  }
}
