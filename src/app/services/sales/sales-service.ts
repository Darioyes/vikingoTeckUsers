import { effect, inject, Injectable, signal, untracked } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@enviroments/environment.development';
import { CookieService } from 'ngx-cookie-service';
import { Observable} from 'rxjs';
import { ISalesResponse } from '@interfaces/ISalesResponse';

@Injectable()
export class SalesService {
  #url = environment.domain;
  #http = inject(HttpClient);
  #cookieService = inject(CookieService);

  public idUser = signal<number>(this.#cookieService.get('id') ? parseInt(this.#cookieService.get('id')) : 0);

  public getSales(): Observable<ISalesResponse> {
    const token = this.#cookieService.get('token');
    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    return this.#http.get<ISalesResponse>(`${this.#url}vikingousers/sales/user/${this.idUser()}`, { headers: headers });
  }
  
}
