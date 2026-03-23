import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { IResetPassword, IResetPasswordResponse } from '@interfaces/IResetPassword';
import { AlertService } from '@services/alert/alertService/alert-service';
import { ResetPasswordService } from '@services/auth/resetPassword/reset-password-service';
import { Subscription } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { CustomAlert } from '@shared/Alerts/custom-alert/custom-alert';
import { HeaderSevice } from '@services/header/header-sevice';
import { Router } from '@angular/router';


@Component({
  selector: 'app-reset-password',
  imports: [
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    CustomAlert
  ],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
})
export class ResetPassword implements OnInit, OnDestroy {

  public token = signal('');
  public email = signal('');
  public resetForm: any = new FormGroup({});
  public formbuilder = inject(FormBuilder);
  public padLock = signal<boolean>(true);
  public headerWhite = signal<boolean>(false);

  #route = inject(ActivatedRoute);
  #resetPasswordService = inject(ResetPasswordService);
  #alertService = inject(AlertService);
  #unsubscribeReset!: Subscription;
  #headerService = inject(HeaderSevice);
  #router = inject(Router);
  

  ngOnInit() {
    this.setWhiteHeader();
    this.routeResetPassword();
    this.resetValidatePassword();
  }

  ngOnDestroy() {
    if (this.#unsubscribeReset) {
      this.#unsubscribeReset.unsubscribe();
    }
  }

  public resetValidatePassword():void{
    this.resetForm = this.formbuilder.group({
      password: ['',Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(255), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).*$')])],
      password_confirmation: ['',Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(255), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).*$')])]
    });
  }

  get password(){return this.resetForm.get('password')}
  get password_confirmation(){return this.resetForm.get('password_confirmation')}

  public routeResetPassword() {
   this.#route.queryParams.subscribe(params => {
      this.token.set(params['token']);
      this.email.set(params['email']);
    });

    if (this.token()=== undefined && this.email()=== undefined) {
      this.#alertService.showAlert('alert','Faltan datos de la url, por favor revisa el enlace de restablecimiento de contraseña.','home/iniciar-sesion');
      console.error('Faltan datos de la url, por favor revisa el enlace de restablecimiento de contraseña.');
      this.#router.navigate(['home/iniciar-sesion']);
    }
  }

public resetPassword(): void {
  this.#alertService.showAlert('alert', 'Restableciendo contraseña');
  if (this.resetForm.valid) {
    const data = {
      token: this.token(),
      email: this.email(),
      password: this.resetForm.value.password,
      password_confirmation: this.resetForm.value.password_confirmation
    };

    this.#unsubscribeReset = this.#resetPasswordService.resetPassword(data).subscribe({
      next: (response: IResetPasswordResponse) => {
        this.#alertService.showAlert('success', response.message, 'home/iniciar-sesion');
      },
      error: (error: IResetPasswordResponse) => {
        console.error(error);
        const msg = error.errorVikingo?.message;
        this.#alertService.showAlert('alert', msg, 'home/iniciar-sesion');
      }
    });
  } else {
    this.#alertService.showAlert('alert', 'Por favor completa el formulario correctamente.');
  }
}

  public setWhiteHeader(): void {
    this.#headerService.setWhiteHeader(true);
  }

  public setPadLock(): void {
    this.padLock.set(!this.padLock());
  }

  public navgateHome(): void {
    this.#router.navigate(['home/principal']);
    this.#headerService.setWhiteHeader(true);
  }

    public getWhiteHeader(): void {
      this.#headerService.getWhiteHeader().subscribe((value) => {
      this.headerWhite.set(value);
    });
  }

}
