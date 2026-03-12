import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-confirm-alert',
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
          @if(icons === 'alert'){
            <h3><i class="fa-solid fa-triangle-exclamation" ></i></h3>
          }@else if (icons === 'info') {
            <h3><i class="fa-solid fa-info-circle"></i></h3>
          }@else if (icons === 'success') {
            <h3><i class="fa-regular fa-circle-check"></i></h3>';
          }@else if (icons === 'error') {
            <h3><i class="fa-regular fa-circle-xmark"></i></h3>
          }
        </div>
        <div class="modal-body">
          <p [innerHTML]="message"  ></p>
          <!-- <p [innerHTML]="message" [ngStyle]="{'color':color}" ></p> -->
        </div>
        <div class="modal-footer" >
        <!-- <button [ngClass]="'btn btn-' + buttonType" (click)="onClose()">Cerrar</button> -->
          <button class="btn" matButton="tonal" (click)="onConfirm()">Aceptar</button>
          <button class="btn" matButton="filled" (click)="onClose()">Cancelar</button>
        </div>
      </div>
    </div>
  }
  `,
  styleUrl: './confirm-alert.scss',
})
export class ConfirmAlert {

  @Input() icons:string   = '';
  @Input() message: string | object = '';
  @Output() show = new EventEmitter<boolean>();





  public onConfirm(): void {
    this.show.emit(true);

  }

  public onClose(): void {
    this.show.emit(false);
  }

}
