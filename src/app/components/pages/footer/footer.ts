import { LoggeInService } from './../../../services/auth/loggeIn/logge-in-service';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderSevice } from '@services/header/header-sevice';

@Component({
  selector: 'app-footer',
  imports: [
    CommonModule
  ],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {

  #routers = inject(Router);
  #headerService = inject(HeaderSevice);
  public LoggeInService = inject(LoggeInService);

  navigateToLogin():void {
    this.#routers.navigate(['/home/iniciar-sesion']);
    this.#headerService.setWhiteHeader(true);
  }

}
