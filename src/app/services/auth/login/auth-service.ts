import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@enviroments/environment.development';
import { ILogin, ILoginResponse } from '@interfaces/ILoginResponse';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService {

  #cookieService = inject(CookieService);
  
  #url = environment.domain;
  #http = inject(HttpClient);

  public login(data:ILogin): Observable<any> {
    const headers = {
      'Accept': 'application/json',
    };
    return this.#http.post(`${this.#url}vikingousers/login`, data, { headers });
  }

  public logout(): Observable<ILoginResponse> {
    const token = this.#cookieService.get('token');
    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    return this.#http.post<ILoginResponse>(`${this.#url}vikingousers/logout`, null, { headers });
  }

}
