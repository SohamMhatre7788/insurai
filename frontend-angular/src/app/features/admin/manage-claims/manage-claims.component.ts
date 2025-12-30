import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { Claim } from '../../../core/models/policy.model';

@Component({
  selector: 'app-manage-claims',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
    </div>

    <div class="manage-claims-container container" *ngIf="!loading">
        <h1 class="page-title fade-in">Manage Claims</h1>

        <div *ngIf="errorMessage" class="error-message fade-in">
            {{ errorMessage }}
        </div>

        <div class="filter-buttons fade-in">
            <button 
                (click)="setFilter('PENDING')" 
                class="btn" 
                [ngClass]="filter === 'PENDING' ? 'btn-primary' : 'btn-outline'">
                Pending
            </button>
            <button 
                (click)="setFilter('APPROVED')" 
                class="btn" 
                [ngClass]="filter === 'APPROVED' ? 'btn-primary' : 'btn-outline'">
                Approved
            </button>
            <button 
                (click)="setFilter('REJECTED')" 
                class="btn" 
                [ngClass]="filter === 'REJECTED' ? 'btn-primary' : 'btn-outline'">
                Rejected
            </button>
            <button 
                (click)="setFilter(null)" 
                class="btn" 
                [ngClass]="filter === null ? 'btn-primary' : 'btn-outline'">
                All
            </button>
        </div>

        <div class="claims-table-container card fade-in">
            <table class="policies-table" *ngIf="claims.length > 0; else noClaims">
                <thead>
                    <tr>
                        <th>Company</th>
                        <th>Policy</th>
                        <th>Claim Amount</th>
                        <th>Max Coverage</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr *ngFor="let claim of claims">
                        <td>{{ claim.companyName }}</td>
                        <td>{{ claim.policyName }}</td>
                        <td>{{ claim.claimAmountRequested | number }} Rupees</td>
                        <td>{{ claim.maxCoverageForPolicy | number }} Rupees</td>
                        <td>
                            <span [class]="'badge badge-' + claim.status.toLowerCase()">
                                {{ claim.status }}
                            </span>
                        </td>
                        <td>{{ claim.createdAt | date }}</td>
                        <td>
                            <button 
                                class="btn btn-sm btn-primary"
                                (click)="viewClaim(claim)"
                            >
                                View
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <ng-template #noClaims>
                <div style="padding: 2rem; text-align: center;">No claims found.</div>
            </ng-template>
        </div>

        <!-- Detail Modal -->
        <div class="modal-overlay" *ngIf="selectedClaim" (click)="closeModal()">
            <div class="modal-content card" (click)="$event.stopPropagation()">
                <h2>Claim Details</h2>
                <div class="claim-details">
                    <p><strong>Company:</strong> {{ selectedClaim.companyName }}</p>
                    <p><strong>Policy:</strong> {{ selectedClaim.policyName }}</p>
                    <p><strong>Claim Amount:</strong> {{ selectedClaim.claimAmountRequested | number }} Rupees</p>
                    <p><strong>Max Coverage:</strong> {{ selectedClaim.maxCoverageForPolicy | number }} Rupees</p>
                    <p><strong>Description:</strong> {{ selectedClaim.description }}</p>
                    <p><strong>Status:</strong> {{ selectedClaim.status }}</p>
                    
                    <div *ngIf="selectedClaim.supportingDocumentUrls?.length">
                        <strong>Documents:</strong>
                        <ul>
                            <li *ngFor="let url of selectedClaim.supportingDocumentUrls; let i = index">
                                <a [href]="url" target="_blank">Document {{ i + 1 }}</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="modal-actions" *ngIf="selectedClaim.status === 'PENDING'">
                    <div class="input-group">
                        <label class="input-label">Approved Amount</label>
                        <input 
                            type="number" 
                            [(ngModel)]="modalData.approvedAmount" 
                            class="input-field" 
                            placeholder="Enter approved amount"
                        >
                    </div>
                    <button class="btn btn-success" (click)="approveClaim()">Approve Claim</button>

                    <div class="input-group">
                        <label class="input-label">Rejection Reason</label>
                        <textarea 
                            [(ngModel)]="modalData.rejectionReason" 
                            class="input-field" 
                            placeholder="Enter rejection reason" 
                            rows="3"
                        ></textarea>
                    </div>
                    <button class="btn btn-danger" (click)="rejectClaim()">Reject Claim</button>
                </div>

                <div style="margin-top: 1rem; text-align: right;">
                    <button class="btn btn-outline" (click)="closeModal()">Close</button>
                </div>
            </div>
        </div>
    </div>
  `,
  styleUrls: ['./manage-claims.component.scss']
})
export class ManageClaimsComponent implements OnInit {
  claims: Claim[] = [];
  errorMessage: string = '';
  filter: string | null = 'PENDING';
  loading: boolean = true;
  selectedClaim: Claim | null = null;
  modalData = {
    approvedAmount: '',
    rejectionReason: ''
  };

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.fetchClaims();
  }

  setFilter(status: string | null): void {
    this.filter = status;
    this.fetchClaims();
  }

  fetchClaims(): void {
    this.loading = true;
    this.errorMessage = '';
    this.adminService.getAllClaims(this.filter || undefined).subscribe({
      next: (data) => {
        this.claims = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching claims', err);
        this.errorMessage = 'Failed to load claims. Please try again later.';
        this.loading = false;
      }
    });
  }

  viewClaim(claim: Claim): void {
    this.selectedClaim = claim;
    this.modalData = { approvedAmount: '', rejectionReason: '' };
  }

  closeModal(): void {
    this.selectedClaim = null;
  }

  approveClaim(): void {
    if (!this.selectedClaim) return;

    const amount = Number(this.modalData.approvedAmount);
    if (!amount || amount <= 0) {
      alert('Please enter a valid approved amount');
      return;
    }

    this.adminService.approveClaim(this.selectedClaim.id, amount).subscribe({
      next: () => {
        alert('Claim approved successfully!');
        this.closeModal();
        this.fetchClaims();
      },
      error: () => alert('Failed to approve claim')
    });
  }

  rejectClaim(): void {
    if (!this.selectedClaim) return;

    if (!this.modalData.rejectionReason) {
      alert('Please enter a rejection reason');
      return;
    }

    this.adminService.rejectClaim(this.selectedClaim.id, this.modalData.rejectionReason).subscribe({
      next: () => {
        alert('Claim rejected successfully!');
        this.closeModal();
        this.fetchClaims();
      },
      error: () => alert('Failed to reject claim')
    });
  }
}
