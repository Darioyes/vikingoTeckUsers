import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@enviroments/environment.development';
import { Observable } from 'rxjs';

@Injectable()
export class CategoriesProducts {

  #url = environment.domain;
  #http = inject(HttpClient);

  getCategoriesProducts(): Observable<any> {
    const headers = {
      'Accept': 'application/json',
    };
    return this.#http.get(`${this.#url}vikingousers/categoriesproducts`, { headers });
  }

}
