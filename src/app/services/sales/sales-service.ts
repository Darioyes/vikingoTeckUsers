import { effect, inject, Injectable, signal, untracked } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@enviroments/environment.development';
import { CookieService } from 'ngx-cookie-service';
import { forkJoin, Observable} from 'rxjs';
import { ISalesRequest, ISalesResponse } from '@interfaces/ISalesResponse';
import { tap } from 'rxjs/operators';
import { AlertService } from '@services/alert/alertService/alert-service';

@Injectable()
export class SalesService {
  #url = environment.domain;
  #http = inject(HttpClient);
  #cookieService = inject(CookieService);
  #alertService = inject(AlertService);

  public idUser = signal<number>(this.#cookieService.get('id') ? parseInt(this.#cookieService.get('id')) : 0);

  public getSales(): Observable<ISalesResponse> {
    const token = this.#cookieService.get('token');
    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    return this.#http.get<ISalesResponse>(`${this.#url}vikingousers/sales/user/${this.idUser()}`, { headers: headers });
  }

public createSale(saleData: ISalesRequest): Observable<ISalesResponse> {
  const token = this.#cookieService.get('token');
  const headers = {
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  return this.#http.post<ISalesResponse>(`${this.#url}vikingousers/sales`, saleData, { headers });
}

// Método para MÚLTIPLES ventas (el que usarán tus componentes)
public createMultipleSales(salesList: ISalesRequest[]): Observable<ISalesResponse[]> {
  // Creamos un array de observables (peticiones preparadas)
  const requests = salesList.map(sale => this.createSale(sale));

  // forkJoin las ejecuta todas en paralelo y emite un solo resultado al final
  return forkJoin(requests).pipe(
    tap({
      next: (res: ISalesResponse[]) => console.log('Todas las ventas se procesaron:', res),
      error: (err) => console.error('Al menos una venta falló:', err)
    })
  );
}
  
}
