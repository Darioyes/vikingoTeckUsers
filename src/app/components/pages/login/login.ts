import { ApplicationRef, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { HeaderSevice } from '@services/header/header-sevice';
import {MatIconModule} from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ILogin, ILoginResponse } from '@interfaces/ILoginResponse';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '@services/auth/login/auth-service';
import { Router } from '@angular/router';
import { LoggeInService } from '@services/auth/loggeIn/logge-in-service';
import { AlertService } from '@services/alert/alertService/alert-service';
import { CustomAlert } from '@shared/Alerts/custom-alert/custom-alert';

@Component({
  selector: 'app-login',
  imports: [
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    CustomAlert
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit, OnDestroy {

  #headerService = inject(HeaderSevice)
  #unsubscribeLogin!: Subscription;
  #unsubscribeLogout!: Subscription;
  #cookieService = inject<CookieService>(CookieService);
  #authService = inject<AuthService>(AuthService);
  #router = inject(Router);
  #loggeInService = inject(LoggeInService);
  appRef = inject(ApplicationRef);

  public alertService = inject(AlertService);
  public loginForm: any = new FormGroup({});
  public formbuilder = inject(FormBuilder);
  
  public headerWhite = signal<boolean>(false);
  public padLock = signal<boolean>(true);
  public loadingButton = signal<boolean>(false);

  ngOnInit(): void {
    this.setWhiteHeader();
    this.formLogin();
  }

  ngOnDestroy(): void {
    if(this.#unsubscribeLogin){
      this.#unsubscribeLogin.unsubscribe();
    }

    if(this.#unsubscribeLogout){
      this.#unsubscribeLogout.unsubscribe();
    }

  }

  public formLogin(): void {
    this.loginForm = this.formbuilder.group({
      email: ['',Validators.compose([Validators.required, Validators.minLength(5), Validators.email])],
      password: ['',Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(100)])],
    });
  }

  get email(){return this.loginForm.get('email')}
  get password(){return this.loginForm.get('password')}

  public getWhiteHeader(): void {
      this.#headerService.getWhiteHeader().subscribe((value) => {
      this.headerWhite.set(value);
    });
  }

  public loginUser(): void {
    //validamos que no hay token en las cookies
    if (!this.#cookieService.check('token')) {
      //validamos que el formulario es valido
      if (this.loginForm.valid) {
        const loginData: ILogin = {
          email: this.loginForm.get('email')?.value || '',
          password: this.loginForm.get('password')?.value || '',
        };
        //llamamos al servicio de login
        this.#unsubscribeLogin = this.#authService.login(loginData).subscribe({
          next: (response:ILoginResponse) => {
            console.log('Login exitoso:', response);
            //calcular la fecha de expiración en 5 días
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 5);
            this.#cookieService.set('token', response.token!, expirationDate, '/', undefined, true, 'Strict');
            // Guardamos el id en las cookies
            this.#cookieService.set('id', response.data!.id.toString(), expirationDate, '/', undefined, true, 'Strict');
            // Guardamos el nombre y el response en las cookies
            this.#cookieService.set('name', response.data!.name!, expirationDate, '/', undefined, true, 'Strict');
            // Guardamos el apellido y el response en las cookies
            this.#cookieService.set('lastname', response.data!.lastname!, expirationDate, '/', undefined, true, 'Strict');
            this.#cookieService.set('success', response.response!, expirationDate, '/', undefined, true, 'Strict');
            this.#cookieService.set('avatar', response.data!.image!, expirationDate, '/', undefined, true, 'Strict');
            this.loadingButton.set(false);
            this.#loggeInService.upDateLoginStatus(true);
            this.#router.navigate(['/home']);
          },
          error: (error:ILoginResponse) => {
            console.error('Error en el login:', error);
            this.loadingButton.set(false);
            if(error.errorVikingo?.errors){
              //el .flat() es para aplanar el array de errores y el object.values es para obtener los valores del objeto de errores
              const errorMessages = Object.values(error.errorVikingo.errors).flat();
              this.alertService.showAlert('error', errorMessages.join(' '));
            }else if(error.errorVikingo){
            this.alertService.showAlert('error', error?.errorVikingo?.message );
            }
            this.loginForm.reset();
          }
        });
      }
    }else{
      this.alertService.showAlert('info', 'Ya has iniciado sesión');
      this.loadingButton.set(false);
      //limpiar el formulario
    }
  }
  
  public setWhiteHeader(): void {
    this.#headerService.setWhiteHeader(true);
  }

  public setPadLock(): void {
    this.padLock.set(!this.padLock());
  }


}
