import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ClientPolicyService } from '../../../core/services/client-policy.service';
import { ClaimService } from '../../../core/services/claim.service';

interface DashboardStats {
    totalPolicies: number;
    activePolicies: number;
    pendingClaims: number;
}

@Component({
    selector: 'app-client-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './client-dashboard.component.html',
    styleUrls: ['./client-dashboard.component.scss']
})
export class ClientDashboardComponent implements OnInit {
    stats: DashboardStats = {
        totalPolicies: 0,
        activePolicies: 0,
        pendingClaims: 0
    };
    loading = true;

    constructor(
        private clientPolicyService: ClientPolicyService,
        private claimService: ClaimService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.fetchStats();
    }

    fetchStats(): void {
        this.clientPolicyService.getMyPolicies().subscribe({
            next: (policies) => {
                this.claimService.getMyClaims().subscribe({
                    next: (claims) => {
                        this.stats = {
                            totalPolicies: policies?.length || 0,
                            activePolicies: policies?.filter(p => p.status === 'ACTIVE').length || 0,
                            pendingClaims: claims?.filter(c => c.status === 'PENDING').length || 0
                        };
                        this.loading = false;
                    },
                    error: (error) => {
                        console.error('Error fetching claims:', error);
                        this.loading = false;
                    }
                });
            },
            error: (error) => {
                console.error('Error fetching policies:', error);
                this.loading = false;
            }
        });
    }

    navigateToAI(): void {
        this.router.navigate(['/client/corporate-ai']);
    }
}
