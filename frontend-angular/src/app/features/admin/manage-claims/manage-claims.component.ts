import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { Claim } from '../../../core/models/policy.model';

@Component({
    selector: 'app-manage-claims',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="container" style="padding: 2rem;">
      <h1>Manage Claims</h1>
      <table *ngIf="claims.length > 0" class="policies-table" style="width: 100%; margin-top: 2rem;">
        <thead><tr><th>ID</th><th>Amount Requested</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          <tr *ngFor="let claim of claims">
            <td>{{ claim.id }}</td>
            <td>{{ claim.claimAmountRequested | number }}</td>
            <td><span [class]="'badge badge-' + getBadgeClass(claim.status)">{{ claim.status }}</span></td>
            <td *ngIf="claim.status === 'PENDING'">
              <button class="btn btn-success" style="margin-right: 0.5rem;" (click)="approveClaim(claim.id)">Approve</button>
              <button class="btn btn-danger" (click)="rejectClaim(claim.id)">Reject</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
    styles: [`th, td { padding: 1rem; text-align: left; }`]
})
export class ManageClaimsComponent implements OnInit {
    claims: Claim[] = [];

    constructor(private adminService: AdminService) { }

    ngOnInit(): void {
        this.adminService.getAllClaims().subscribe({ next: (data) => this.claims = data });
    }

    getBadgeClass(status: string): string {
        return status === 'APPROVED' ? 'success' : status === 'REJECTED' ? 'danger' : 'warning';
    }

    approveClaim(id: number): void {
        const amount = prompt('Enter approved amount:');
        if (amount) {
            this.adminService.approveClaim(id, Number(amount)).subscribe({ next: () => this.ngOnInit() });
        }
    }

    rejectClaim(id: number): void {
        const reason = prompt('Enter rejection reason:');
        if (reason) {
            this.adminService.rejectClaim(id, reason).subscribe({ next: () => this.ngOnInit() });
        }
    }
}
