import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class NavbarMenu {
  #menuActive: Subject<boolean> = new Subject<boolean>();

  //servicio que setea el submenu activo
  setSubmenuActive(value: boolean): void {
    this.#menuActive.next(value);
  }

  //service que obtiene el submenu activo
  getSubmenuActive(): Subject<boolean> {
    return this.#menuActive;
  }
}
