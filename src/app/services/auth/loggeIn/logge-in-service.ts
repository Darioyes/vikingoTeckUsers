import { inject, Injectable } from '@angular/core';
import { ILoginResponse } from '@interfaces/ILoginResponse';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { AuthService } from '../login/auth-service';
import { Router } from '@angular/router';

@Injectable()
export class LoggeInService {

  #cookieService = inject(CookieService);
  // BehaviorSubject para mantener el estado de login, se inicializa con el valor del token en las cookies sin importar la recarga de la página
  #loggedIn = new BehaviorSubject<boolean>(this.#cookieService.check('token'));
  #authService = inject<AuthService>(AuthService);
  #router = inject(Router);

  //se declara asObservable para que los componentes puedan subscribirse a los cambios de estado de login
  public isLoggedIn$ = this.#loggedIn.asObservable();

  upDateLoginStatus(status: boolean): void {
    this.#loggedIn.next(status);
  }

    public logoutUser(): void {
      this.#authService.logout().subscribe({
        next:(response:ILoginResponse) => {  
          console.log('Logout exitoso:', response);
          this.#cookieService.delete('token');
          this.#cookieService.delete('id');
          this.#cookieService.delete('name');
          this.#cookieService.delete('lastname');
          this.#cookieService.delete('success');  
          this.#cookieService.delete('avatar');
          this.upDateLoginStatus(false);
          this.#router.navigate(['/home/iniciar-sesion']);
        },
        error: (error:ILoginResponse) => {
          console.error('Error en el logout:', error);
        }
     });
   }
  
}
