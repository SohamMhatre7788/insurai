import { Routes } from '@angular/router';

// Placeholder routes - components to be created
export const ADMIN_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
    },
    {
        path: 'create-policy',
        loadComponent: () => import('./create-policy/create-policy.component').then(m => m.CreatePolicyComponent)
    },
    {
        path: 'create-policy/:id',
        loadComponent: () => import('./create-policy/create-policy.component').then(m => m.CreatePolicyComponent)
    },
    {
        path: 'policies',
        loadComponent: () => import('./manage-policies/manage-policies.component').then(m => m.ManagePoliciesComponent)
    },
    {
        path: 'claims',
        loadComponent: () => import('./manage-claims/manage-claims.component').then(m => m.ManageClaimsComponent)
    },
    {
        path: 'clients',
        loadComponent: () => import('./manage-clients/manage-clients.component').then(m => m.ManageClientsComponent)
    },
    {
        path: 'corporate-ai',
        loadComponent: () => import('./corporate-ai/corporate-ai-assistant.component').then(m => m.CorporateAiAssistantComponent)
    }
];
