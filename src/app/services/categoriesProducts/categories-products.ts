import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@enviroments/environment.development';
import { ILoginResponse } from '@interfaces/ILoginResponse';
import { Observable } from 'rxjs';

@Injectable()
export class CategoriesProducts {

  #url = environment.domain;
  #http = inject(HttpClient);

  getCategoriesProducts(): Observable<ILoginResponse> {
    const headers = {
      'Accept': 'application/json',
    };
    return this.#http.get<ILoginResponse>(`${this.#url}vikingousers/categoriesproducts`, { headers });
  }

}
