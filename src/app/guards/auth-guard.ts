import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const authGuard: CanActivateFn = (route, state) => {

  const cookieService = inject(CookieService);

  const token = cookieService.get('token');
  const success = cookieService.get('success');
  const user = cookieService.get('name');

  if (!token && !success && !user) {
    const router = inject(Router);
    router.navigate(['/login']);
    return false;
  }

  return true;
};
