import { Routes } from '@angular/router';

// Placeholder routes - components to be created
export const CLIENT_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./dashboard/client-dashboard.component').then(m => m.ClientDashboardComponent)
    },
    {
        path: 'buy-policy',
        loadComponent: () => import('./buy-policy/buy-policy.component').then(m => m.BuyPolicyComponent)
    },
    {
        path: 'my-policies',
        loadComponent: () => import('./my-policies/my-policies.component').then(m => m.MyPoliciesComponent)
    },
    {
        path: 'claim',
        loadComponent: () => import('./claim-policies/claim-policies.component').then(m => m.ClaimPoliciesComponent)
    },
    {
        path: 'profile',
        loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent)
    },
    {
        path: 'corporate-ai',
        loadComponent: () => import('./corporate-ai/corporate-ai-assistant.component').then(m => m.CorporateAiAssistantComponent)
    }
];
