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
             {
                path: 'mis-compras',
                title: 'vikingoTech - Mis Compras',
                loadComponent: () => import('./components/pages/myshooping/myshooping').then(c => c.Myshooping),
                canActivate: [authGuard],
            },
            {
                path: 'mantenimientos',
                title: 'vikingoTech - Mantenimientos',
                loadComponent: () => import('./components/pages/maintenance/maintenance').then(c => c.Maintenance),
            },
            {
                path: 'categorias/:slug',
                title: 'vikingoTech - Categorias',
                loadComponent: () => import('./components/pages/categories/categories').then(c => c.Categories),
            },
            {
                path: 'carrito-compras',
                title: 'vikingoTech - Carrito de Compras',
                loadComponent: () => import('./components/pages/shopping-cart/shopping-cart').then(c => c.ShoppingCart),
            },
            {
                path: 'buscar',
                title: 'vikingoTech - Buscar',
                loadComponent: () => import('./components/pages/search/search').then(c => c.Search),
            },
            {
                path: 'iniciar-sesion',
                title: 'vikingoTech - Iniciar Sesión',
                loadComponent: () => import('./components/pages/login/login').then(c => c.Login),
            },
            {
                path: 'producto/:slug',
                title: 'vikingoTech - Producto',
                loadComponent: () => import('./components/pages/product/product').then(c => c.Product),
            },
        ],
    },
   
];
