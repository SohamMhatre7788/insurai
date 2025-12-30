import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { UserProfile } from '../../../core/models/user.model';

@Component({
    selector: 'app-manage-clients',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="container" style="padding: 2rem;">
      <h1>Manage Clients</h1>
      <table *ngIf="clients.length > 0" class="policies-table" style="width: 100%; margin-top: 2rem;">
        <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Actions</th></tr></thead>
        <tbody>
          <tr *ngFor="let client of clients">
            <td>{{ client.firstName }} {{ client.lastName }}</td>
            <td>{{ client.email }}</td>
            <td>{{ client.phoneNumber }}</td>
            <td><button class="btn btn-danger" (click)="deleteClient(client.id)">Delete</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
    styles: [`th, td { padding: 1rem; text-align: left; }`]
})
export class ManageClientsComponent implements OnInit {
    clients: UserProfile[] = [];

    constructor(private adminService: AdminService) { }

    ngOnInit(): void {
        this.adminService.getAllClients().subscribe({ next: (data) => this.clients = data });
    }

    deleteClient(id: number): void {
        if (confirm('Delete this client?')) {
            this.adminService.deleteClient(id).subscribe({ next: () => this.ngOnInit() });
        }
    }
}
