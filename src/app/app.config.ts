import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { errorApiInterceptor } from './interceptors/errorInterceptor/error-api-interceptor-interceptor';
import { Banner } from '@services/banner/banner';
import { NavbarMenu } from '@services/navbarMenu/navbar-menu';
import { CategoriesProducts } from '@services/categoriesProducts/categories-products';
import { Products } from '@services/products/products';

export const appConfig: ApplicationConfig = {
  providers: [
    Banner,
    NavbarMenu,
    CategoriesProducts,
    Products,

    // provideBrowserGlobalErrorListeners(),//para manejar errores globales en el navegador
    provideBrowserGlobalErrorListeners(),

    // provideZonelessChangeDetection(),//para manejar cambios de zona sin necesidad de Angular
    provideZonelessChangeDetection(),
    
    //providerRouter(routes) es para manejar las rutas de la aplicación
    provideRouter(routes,
      //withHashLocation sirve para que en el servidor siempre vaya al index.html,
    withHashLocation(),
    //es para que localice los id en las rutas ejemplo/:id
    withComponentInputBinding() 
    ),
    { provide: LOCALE_ID, useValue: 'es-CO' },
    
     //provideClientHydration(),//solo se usa con ssr
    provideHttpClient(//para usar httpClient
      withFetch(),//para usar fetch en lugar de XMLHttpRequest
      withInterceptors([ errorApiInterceptor]),//interceptor de errores globales
    ),
  ]
};
