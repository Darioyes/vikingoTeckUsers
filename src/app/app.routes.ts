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
                canActivate: [authGuard],
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
            {
                path: 'registrarse',
                title: 'vikingoTech - Registrarse',
                loadComponent: () => import('./components/pages/register/register').then(c => c.Register),
            },
            {
                //ruta para restablecer contraseña debe recibir el token y el email por query params
                path: 'reset-password',
                title: 'vikingoTech - Restablecer Contraseña',
                loadComponent: () => import('./components/pages/reset-password/reset-password').then(c => c.ResetPassword),
            },
            {
                //ruta para enviar el correo de restablecimiento de contraseña
                path: 'email-reset',
                title: 'vikingoTech - Correo Restablecer Contraseña',
                loadComponent: () => import('./components/pages/email-reset/email-reset').then(c => c.EmailReset),
            },
            {
                //ruta para política de privacidad
                path: 'politica-privacidad',
                title: 'vikingoTech - Política de Privacidad',
                loadComponent: () => import('./components/pages/term/privacy-policies/privacy-policies').then(c => c.PrivacyPolicies),

            },
            {
                //ruta para los términos y condiciones
                path: 'terminos-condiciones',
                title: 'vikingoTech - Términos y Condiciones',
                loadComponent: () => import('./components/pages/term/term-and-conditions/term-and-conditions').then(c => c.TermAndConditions),
            },
            {
                //ruta para la política de cookies
                path: 'politica-cookies',
                title: 'vikingoTech - Política de Cookies',
                loadComponent: () => import('./components/pages/term/use-of-cookies/use-of-cookies').then(c => c.UseOfCookies),
            },
        ],
    },
   
];
