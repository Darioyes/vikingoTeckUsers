import { DatePipe, DecimalPipe, NgStyle } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '@enviroments/environment.development';
import { IMaintenance } from '@interfaces/IMaintenance';
import { AlertService } from '@services/alert/alertService/alert-service';
import { HeaderSevice } from '@services/header/header-sevice';
import { maintenanceService } from '@services/maintenance/maintenanceService';
import { SpinerPages } from '@shared/spiner-pages/spiner-pages';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-maintenance',
  imports: [
    MatIconModule,
    DecimalPipe,
    DatePipe,
    SpinerPages,
    NgStyle
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

  public id!: number;
  public headerWhite = signal<boolean>(false);
  public maintenanceData = signal<IMaintenance | null>(null);
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
          console.log(response);
        },
        error: (error: IMaintenance) => {
          console.error(error);
          this.#alertService.showAlert('error', 'Error al obtener el mantenimiento');
        }
      });

    }else{
      this.#alertService.showAlert('info', 'Ya has iniciado sesión');
    }
  }


}
