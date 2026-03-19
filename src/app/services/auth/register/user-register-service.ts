import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@enviroments/environment.development';
import { IRegisterRequest, IRegisterResponse } from '@interfaces/IRegisterRequest';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable()
export class UserRegisterService {

  #url = environment.domain;
  #http = inject(HttpClient);
  #cookieService = inject(CookieService);

  public register(data:IRegisterRequest| any): Observable<IRegisterResponse> {
    const headers = {
      'Accept': 'application/json',
    };
    return this.#http.post<IRegisterResponse>(`${this.#url}vikingousers/register`, data, { headers: headers });
  }

  public verifyEmail(): Observable<IRegisterResponse> {
    const token = this.#cookieService.get('token');
    const email = this.#cookieService.get('email');
    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    return this.#http.post<IRegisterResponse>(`${this.#url}vikingousers/resend-verification/${email}`, { headers: headers });
  }
  
}
