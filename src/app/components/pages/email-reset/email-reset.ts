import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { IResetPasswordResponse } from '@interfaces/IResetPassword';
import { AlertService } from '@services/alert/alertService/alert-service';
import { ResetPasswordService } from '@services/auth/resetPassword/reset-password-service';
import { HeaderSevice } from '@services/header/header-sevice';
import { CustomAlert } from '@shared/Alerts/custom-alert/custom-alert';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-email-reset',
  imports: [
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    CustomAlert,
    ReactiveFormsModule,
  ],
  templateUrl: './email-reset.html',
  styleUrl: './email-reset.scss',
})
export class EmailReset implements OnInit, OnDestroy {

  #route = inject(ActivatedRoute);
  #resetPasswordService = inject(ResetPasswordService);
  #alertService = inject(AlertService);
  #unsubscribeReset!: Subscription;
  #headerService = inject(HeaderSevice);

  public emailForm: any = new FormGroup({});
  public formbuilder = inject(FormBuilder);
  public padLock = signal<boolean>(true);
  public headerWhite = signal<boolean>(false);

  ngOnInit() {
    this.setWhiteHeader();
    this.formEmail();
  }

  ngOnDestroy() {
    if (this.#unsubscribeReset) {
      this.#unsubscribeReset.unsubscribe();
    }
  }

  public formEmail(): void {
    this.emailForm = this.formbuilder.group({
      email: ['',Validators.compose([Validators.required, Validators.minLength(5), Validators.email])],
    });
  }

  get email(){return this.emailForm.get('email')}

  public sendEmailReset(): void {
    if (this.emailForm.valid) {
      //colocar el boton de inhabilitado mientras se procesa la solicitud
      this.#alertService.showAlert('alert', 'Enviando correo de restablecimiento');
      const emailValue: { email: string } = { email: this.emailForm.value.email };
      this.#unsubscribeReset = this.#resetPasswordService.emailResetPassword(emailValue).subscribe({
        next: (response: IResetPasswordResponse) => {
          this.#alertService.showAlert('alert', response.message,'home/iniciar-sesion');
        },
        error: (error: IResetPasswordResponse) => {
          console.error(error);
          const errorMessage = error.errorVikingo?.message;
          this.#alertService.showAlert('alert', errorMessage);
        }
      });
    }else{
      this.#alertService.showAlert('alert', 'Por favor ingresa un correo electrónico válido.');
    }
  }

  public getWhiteHeader(): void {
      this.#headerService.getWhiteHeader().subscribe((value) => {
      this.headerWhite.set(value);
    });
  }

  public setWhiteHeader(): void {
    this.#headerService.setWhiteHeader(true);
  }

}
