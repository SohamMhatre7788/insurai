import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div *ngIf="loading" class="loading"><div class="spinner"></div></div>
    <div *ngIf="!loading" class="dashboard-container container">
      <div class="dashboard-header fade-in">
        <h1>Admin Dashboard</h1>
        <p>Manage policies, claims, and clients</p>
      </div>

      <div class="stats-grid fade-in">
        <div class="stat-card card">
          <div class="stat-icon">📋</div>
          <div class="stat-content">
            <h3>{{ stats.totalPolicies }}</h3>
            <p>Total Policies</p>
          </div>
        </div>

        <div class="stat-card card">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <h3>{{ stats.totalClients }}</h3>
            <p>Total Clients</p>
          </div>
        </div>

        <div class="stat-card card">
          <div class="stat-icon">⏳</div>
          <div class="stat-content">
            <h3>{{ stats.pendingClaims }}</h3>
            <p>Pending Claims</p>
          </div>
        </div>
      </div>

      <div class="quick-actions fade-in">
        <h2>Quick Actions</h2>
        <div class="actions-grid">
          <a routerLink="/admin/create-policy" class="action-card card card-hover">
            <div class="action-icon">➕</div>
            <h3>Create Policy</h3>
            <p>Add new insurance policy</p>
          </a>

          <a routerLink="/admin/policies" class="action-card card card-hover">
            <div class="action-icon">📄</div>
            <h3>Manage Policies</h3>
            <p>View and update policies</p>
          </a>

          <a routerLink="/admin/claims" class="action-card card card-hover">
            <div class="action-icon">📝</div>
            <h3>Manage Claims</h3>
            <p>Review and process claims</p>
          </a>

          <a routerLink="/admin/clients" class="action-card card card-hover">
            <div class="action-icon">👤</div>
            <h3>Manage Clients</h3>
            <p>View and manage client accounts</p>
          </a>
        </div>
      </div>

      <button class="ai-fab" (click)="navigateToAI()" title="Corporate AI Assistant">🤖</button>
    </div>
  `,
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  stats = { totalPolicies: 0, totalClients: 0, pendingClaims: 0 };
  loading = true;

  constructor(private adminService: AdminService, private router: Router) { }

  ngOnInit(): void {
    this.adminService.getAllPolicies().subscribe({
      next: (policies) => {
        this.adminService.getAllClients().subscribe({
          next: (clients) => {
            this.adminService.getAllClaims('PENDING').subscribe({
              next: (claims) => {
                this.stats = {
                  totalPolicies: policies?.length || 0,
                  totalClients: clients?.length || 0,
                  pendingClaims: claims?.length || 0
                };
                this.loading = false;
              },
              error: () => this.loading = false
            });
          },
          error: () => this.loading = false
        });
      },
      error: () => this.loading = false
    });
  }

  navigateToAI(): void {
    this.router.navigate(['/admin/corporate-ai']);
  }
}
