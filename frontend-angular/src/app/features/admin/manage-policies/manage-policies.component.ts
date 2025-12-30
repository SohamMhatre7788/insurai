import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { Policy } from '../../../core/models/policy.model';

@Component({
    selector: 'app-manage-policies',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="container" style="padding: 2rem;">
      <h1>Manage Policies</h1>
      <table *ngIf="policies.length > 0" class="policies-table" style="width: 100%; margin-top: 2rem;">
        <thead><tr><th>Name</th><th>Coverage</th><th>Premium</th><th>Actions</th></tr></thead>
        <tbody>
          <tr *ngFor="let policy of policies">
            <td>{{ policy.name }}</td>
            <td>{{ policy.coverageAmount | number }}</td>
            <td>{{ policy.premiumAmount | number }}</td>
            <td>
              <button class="btn btn-outline" style="margin-right: 0.5rem;">Edit</button>
              <button class="btn btn-danger" (click)="deletePolicy(policy.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
    styles: [`th, td { padding: 1rem; text-align: left; }`]
})
export class ManagePoliciesComponent implements OnInit {
    policies: Policy[] = [];

    constructor(private adminService: AdminService) { }

    ngOnInit(): void {
        this.adminService.getAllPolicies().subscribe({ next: (data) => this.policies = data });
    }

    deletePolicy(id: number): void {
        if (confirm('Delete this policy?')) {
            this.adminService.deletePolicy(id).subscribe({ next: () => this.ngOnInit() });
        }
    }
}
