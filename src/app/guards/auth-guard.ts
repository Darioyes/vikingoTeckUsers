import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const authGuard: CanActivateFn = (route, state) => {

  const cookieService = inject(CookieService);

  const token = cookieService.get('token');

  if (!token) {
    const router = inject(Router);
    router.navigate(['/login']);
    return false;
  }




  return true;
};
