import { ApplicationRef, ComponentRef, createComponent, EnvironmentInjector, inject, Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { IAlert } from '@interfaces/IAlrets';
import { ConfirmAlert } from '@shared/Alerts/confirm-alert/confirm-alert';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  appRef = inject(ApplicationRef);
  injector = inject(EnvironmentInjector);

  //instanciamos un observable de tipo Subject para poder emitir y escuchar eventos del custom alert
  #alertSubject = new Subject<IAlert | null>();
  //creamos un observable para poder subscribirnos a los eventos del custom alert
  alertState$ = this.#alertSubject.asObservable();





  //instanciamos un observable de tipo Subject para poder emitir y escuchar eventos del custom alert
  showAlert(icon: string, message: string| Object| any) {
    //emitimos el evento con el icono y el mensaje
    this.#alertSubject.next({ icon, message });

  }
  
  /*
    //instanciamos un observable de tipo Subject para poder emitir y escuchar eventos del custom alert
  public alertState = signal<IAlert | null>(null);
  //creamos un observable para poder subscribirnos a los eventos del custom alert
  public alertState$ = toObservable(this.alertState);



  //instanciamos un observable de tipo Subject para poder emitir y escuchar eventos del custom alert
  showAlert(icon: string, message: string| Object| any) {
    //emitimos el evento con el icono y el mensaje
    this.alertState.set({ icon, message });

  }
  */

  //--------------- confirm alert --------------------------

  //función pública que se llama desde cualquier componente
  async openAlert(icon: 'alert' | 'info' | 'success' | 'error', message: string): Promise<boolean> {
    // ser retorna una promesa para que el componente que llama al modal pueda esperar la respuesta de usuario
    return new Promise((resolve) => {
      // crea el componente o modal
      const componentRef: ComponentRef<ConfirmAlert> = createComponent(ConfirmAlert, {
        environmentInjector: this.injector
      });

      // insertamos el icono al modal
      componentRef.instance.icons = icon;
      // insertamos el mensa
      componentRef.instance.message = message;

      // Esto escucha el @Output() llamado close que el componente dispara cuando el usuario confirma o cancela.
      componentRef.instance.show.subscribe((result: boolean) => {
        this.appRef.detachView(componentRef.hostView);
        componentRef.destroy();
        resolve(result);
      });

      // insertamos el componente en el DOM
      this.appRef.attachView(componentRef.hostView);
      // obtenemos el elemento DOM
      const domElem = (componentRef.hostView as any).rootNodes[0] as HTMLElement;
      // lo insertamos en el body
      document.body.appendChild(domElem);
    });
  }
}
