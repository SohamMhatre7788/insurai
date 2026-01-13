import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientPolicyService } from '../../../core/services/client-policy.service';

interface AdminClientPolicy {
    id: number;
    clientId: number;
    clientName: string;
    clientEmail: string;
    policyId: number;
    policyName: string;
    companyName: string;
    numberOfEmployees: number;
    policyPeriodYears: number;
    premiumAmount: number;
    coverageAmount: number;
    startDate: string;
    endDate: string;
    status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
}

@Component({
    selector: 'app-manage-client-policies',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './manage-client-policies.component.html',
    styleUrls: ['./manage-client-policies.component.scss']
})
export class ManageClientPoliciesComponent implements OnInit {
    clientPolicies: AdminClientPolicy[] = [];
    filteredPolicies: AdminClientPolicy[] = [];
    searchTerm: string = '';
    statusFilter: string = 'ALL';
    loading: boolean = false;
    error: string = '';

    constructor(private clientPolicyService: ClientPolicyService) { }

    ngOnInit(): void {
        this.loadAllClientPolicies();
    }

    loadAllClientPolicies(): void {
        this.loading = true;
        this.error = '';

        this.clientPolicyService.getAllClientPolicies().subscribe({
            next: (policies) => {
                this.clientPolicies = policies;
                this.applyFilters();
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading client policies:', err);
                this.error = 'Failed to load client policies. Please try again.';
                this.loading = false;
            }
        });
    }

    applyFilters(): void {
        this.filteredPolicies = this.clientPolicies.filter(policy => {
            const matchesSearch =
                policy.clientName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                policy.clientEmail.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                policy.policyName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                policy.companyName.toLowerCase().includes(this.searchTerm.toLowerCase());

            const matchesStatus =
                this.statusFilter === 'ALL' || policy.status === this.statusFilter;

            return matchesSearch && matchesStatus;
        });
    }

    onSearchChange(): void {
        this.applyFilters();
    }

    onStatusFilterChange(): void {
        this.applyFilters();
    }

    updatePolicyStatus(policy: AdminClientPolicy, newStatus: string): void {
        if (confirm(`Are you sure you want to change policy status to ${newStatus}?`)) {
            this.clientPolicyService.updatePolicyStatus(policy.id, newStatus).subscribe({
                next: (updatedPolicy) => {
                    // Update the policy in the list
                    const index = this.clientPolicies.findIndex(p => p.id === policy.id);
                    if (index !== -1) {
                        this.clientPolicies[index] = updatedPolicy;
                        this.applyFilters();
                    }
                    alert('Policy status updated successfully!');
                },
                error: (err) => {
                    console.error('Error updating policy status:', err);
                    alert('Failed to update policy status. Please try again.');
                }
            });
        }
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'ACTIVE':
                return 'status-active';
            case 'EXPIRED':
                return 'status-expired';
            case 'CANCELLED':
                return 'status-cancelled';
            default:
                return '';
        }
    }

    formatDate(dateString: string): string {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    formatCurrency(amount: number): string {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    }
}
