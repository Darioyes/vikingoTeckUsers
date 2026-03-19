import { DatePipe, DecimalPipe, NgStyle } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '@enviroments/environment.development';
import { IMaintenance } from '@interfaces/IMaintenance';
import { AlertService } from '@services/alert/alertService/alert-service';
import { UserRegisterService } from '@services/auth/register/user-register-service';
import { HeaderSevice } from '@services/header/header-sevice';
import { maintenanceService } from '@services/maintenance/maintenanceService';
import { CustomAlert } from '@shared/Alerts/custom-alert/custom-alert';
import { SpinerPages } from '@shared/spiner-pages/spiner-pages';
import { CookieService } from 'ngx-cookie-service';
import { single, Subscription } from 'rxjs';

@Component({
  selector: 'app-maintenance',
  imports: [
    MatIconModule,
    DecimalPipe,
    DatePipe,
    SpinerPages,
    NgStyle,
    CustomAlert
  ],
  templateUrl: './maintenance.html',
  styleUrl: './maintenance.scss',
})
export class Maintenance implements OnInit, OnDestroy {

  #headerService = inject(HeaderSevice)
  #unsubcribeMaintenance!: Subscription;
  #maintenanceServ = inject(maintenanceService);
  #cookieService = inject<CookieService>(CookieService);
  #alertService = inject(AlertService);
  #userRegisterService = inject(UserRegisterService);

  public id!: number;
  public headerWhite = signal<boolean>(false);
  public maintenanceData = signal<IMaintenance | null>(null);
  public carge = signal<boolean>(false);
  public verifiqued = signal<boolean>(true);
  public name = this.#cookieService.get('name') ? this.#cookieService.get('name') : 'Usuario';
  public urlImage = environment.domainimage;
  public warning = environment.colorWarning;
  public success = environment.colorSuccess;
  public primary = environment.colorPrimay;
  public danger = environment.colorDanger;

  ngOnInit(): void {
    this.setWhiteHeader();
    this.getMaintenance();
    
  }

  ngOnDestroy(): void {
    if(this.#unsubcribeMaintenance){
      this.#unsubcribeMaintenance.unsubscribe();
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

  public getMaintenance(): void{
    this.id = this.#cookieService.get('id') ? parseInt(this.#cookieService.get('id')) : 0;
    if (this.#cookieService.check('token')) {
      this.#unsubcribeMaintenance = this.#maintenanceServ.getOneMaintenance(this.id).subscribe({
        next: (response: IMaintenance) => {
          this.maintenanceData.set(response);
          this.carge.set(true);
        },
        error: (error: IMaintenance) => {
          console.error(error);
          if(error?.errorVikingo?.message ==='Your email address is not verified.'){
            this.verifiqued.set(false); 
            this.resend();
          }else{
            this.carge.set(true);
          }
        },
      });

    }else{
      this.#alertService.showAlert('info', 'Ya has iniciado sesión');
    }
  }

  public resendVerification(): void {
    this.#userRegisterService.verifyEmail().subscribe({
      next: (response) => {
        this.#alertService.showAlert('success', 'Correo de verificación reenviado. Por favor, revisa tu correo electrónico.','home/principal');
      },
      error: (error) => {
        console.error(error);
        this.#alertService.showAlert('error', 'Error al reenviar el correo de verificación. Por favor, intenta nuevamente.','home/principal');
      }
    });
  }

    async resend(): Promise<void> {
    const confirm = await this.#alertService.openAlert('error', '¿Tu correo electrónico no está verificado. ¿Deseas reenviar el correo de verificación?');
    if (confirm) {
      this.carge.set(false);
      this. resendVerification();
    }else{
      this.#alertService.showAlert('alert', 'Por favor, verifica tu correo electrónico para acceder a esta sección.','home/principal');
    }
  }
}
