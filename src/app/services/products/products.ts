import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@enviroments/environment.development';

@Injectable()
export class Products {

  #url = environment.domain;
  #http = inject(HttpClient);

  getProducts() { 
    const headers = {
      'Accept': 'application/json',
    };
    return this.#http.get(`${this.#url}vikingousers/products`, { headers });
  }
  
}
