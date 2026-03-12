import { ApplicationRef, ChangeDetectorRef, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AlertService } from '@services/alert/alertService/alert-service';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-custom-alert',
  imports: [
    MatIconModule,
    MatButtonModule,
  ],
      template: `
  @if(show){
    <div class="modal-container" >
      <div class="modal">
        <!-- <div class="modal-header" [ngStyle]="{'border-bottom': '1px solid '+color }"> -->
        <div class="modal-header" >
          @if(icon === 'alert'){
          <h3><mat-icon class="fa-triangle-exclamation">warning</mat-icon></h3>
          }@else if(icon === 'success'){
            <h3><mat-icon class="fa-circle-check">check_circle</mat-icon></h3>
          }@else if(icon === 'error'){
            <h3><mat-icon class="fa-circle-xmark">error</mat-icon></h3>
          }@else if(icon === 'info'){
            <h3><mat-icon class="fa-info-circle">info</mat-icon></h3>
          }
        </div>
        <div class="modal-body">
          <p [innerHTML]="message"  ></p>
          <!-- <p [innerHTML]="message" [ngStyle]="{'color':color}" ></p> -->
        </div>
        <div class="modal-footer" >
        <!-- <button [ngClass]="'btn btn-' + buttonType" (click)="onClose()">Cerrar</button> -->
          <button class="btn" matButton="filled" (click)="onClose()">Cerrar</button>
        </div>
      </div>
    </div>
  }

  `,
  styleUrl: './custom-alert.scss',
})
export class CustomAlert {
  #appRef = inject(ApplicationRef);
  #cdr = inject(ChangeDetectorRef);

  icon: string = '';
  message: string | object = '';
  show: boolean = false;
  #unsubscribeMail!: Subscription;
  #subscription!: Subscription;
  public color = ''
  public buttonType = '';

  #alertService = inject(AlertService);
  #cookieService = inject(CookieService);
  public loadingButton: boolean = false;

    ngOnInit() {
    this.alert();
  }

  ngOnDestroy() {
    if (this.#subscription){
      this.#subscription?.unsubscribe();

    }
    if (this.#unsubscribeMail){
      this.#unsubscribeMail?.unsubscribe();
    }

  }

  alert(){
// Suscríbete al observable de alertas
    this.#subscription = this.#alertService.alertState$.subscribe(alert => {
      //si
      if (alert) {
        this.icon = alert.icon;
        this.message = alert.message;
        this.show = true;
        // Suscríbete a los eventos de clic después de mostrar la alerta
      //this.subscribeToLinkClick();

        if(alert.icon === 'success'){
          this.color = '#198754';
          this.buttonType = 'success';
        }else if(alert.icon === 'error'){
          this.color = '#dc3545';
          this.buttonType = 'danger';
        }else if(alert.icon === 'info'){
          this.color = '#0dcaf0';
          this.buttonType = 'info';
        };
          //this.#cdr.detectChanges();
      } else {
        this.show = false;
      }
    });
  }

  onClose() {
    this.show = false;
  }

}
