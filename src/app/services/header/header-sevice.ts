import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderSevice {

    #whiteHeader: Subject<boolean> = new Subject<boolean>();
  
    //servicio que setea el submenu activo
    setWhiteHeader(value: boolean): void {
      this.#whiteHeader.next(value);
    }
  
    //service que obtiene el submenu activo
    getWhiteHeader(): Subject<boolean> {
      return this.#whiteHeader;
    }
  
}
