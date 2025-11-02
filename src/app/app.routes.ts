import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        title: 'VikingoTech',
        loadComponent: () => import('./components/dashboard/dashboard').then(c=> c.Dashboard),
        children: [
            {
                path: '',
                redirectTo: 'principal',
                pathMatch: 'full',
            },
            {
                path: 'principal',
                title: 'vikingoTech - Home',
                loadComponent: () => import('./components/pages/main/main').then(c => c.Main),
            },
        ],
    },
];
