import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/layout/layout.component';
import { LoginComponent } from './features/auth/login/login.component';
import { SignupComponent } from './features/auth/signup/signup.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '',
                redirectTo: '/login',
                pathMatch: 'full'
            },
            {
                path: 'login',
                component: LoginComponent
            },
            {
                path: 'signup',
                component: SignupComponent
            },
            {
                path: 'client',
                loadChildren: () => import('./features/client/client.routes').then(m => m.CLIENT_ROUTES),
                canActivate: [AuthGuard],
                data: { requiredRole: 'CLIENT' }
            },
            {
                path: 'admin',
                loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
                canActivate: [AuthGuard],
                data: { requiredRole: 'ADMIN' }
            },
            {
                path: '**',
                redirectTo: '/',
                pathMatch: 'full'
            }
        ]
    }
];
