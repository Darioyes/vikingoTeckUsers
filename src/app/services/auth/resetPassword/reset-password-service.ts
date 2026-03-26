import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@enviroments/environment.development';
import { IResetPassword, IResetPasswordResponse } from '@interfaces/IResetPassword';
import { Observable } from 'rxjs';

@Injectable()
export class ResetPasswordService {
  
  #url = environment.domain;
  #http = inject(HttpClient);

  public emailResetPassword(data: { email: string }): Observable<IResetPasswordResponse> {
    const headers = {
      'Accept': 'application/json',
    };
    return this.#http.post<IResetPasswordResponse>(`${this.#url}password/email`, data, { headers: headers });
  }

  public resetPassword(data: IResetPassword | FormData): Observable<IResetPasswordResponse> {
    const headers = {
      'Accept': 'application/json',
    };
    return this.#http.post<IResetPasswordResponse>(`${this.#url}password/reset`, data, { headers: headers });
  }

}
