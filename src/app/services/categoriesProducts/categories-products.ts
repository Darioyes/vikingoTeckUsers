import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@enviroments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CategoriesProducts {

  #url = environment.domain;
  #http = inject(HttpClient);

  getCategoriesProducts() {
    const headers = {
      'Accept': 'application/json',
    };
    return this.#http.get(`${this.#url}vikingousers/categoriesproducts`, { headers });
  }

}
