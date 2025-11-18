import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@enviroments/environment.development';
import { Observable } from 'rxjs';

@Injectable()
export class Products {

  #url = environment.domain;
  #http = inject(HttpClient);

  getProducts(): Observable<any> { 
    const headers = {
      'Accept': 'application/json',
    };
    return this.#http.get(`${this.#url}vikingousers/products`, { headers });
  }

  //servicio para obtener un producto por slug
  getProductBySlug(slug: string): Observable<any> { 
    const headers = {
      'Accept': 'application/json',
    };
    return this.#http.get(`${this.#url}vikingousers/products/${slug}`, { headers });
  }

  //servicio para obtener productos por categoria
  getProductsByCategory(categorySlug: string): Observable<any> { 
    const headers = {
      'Accept': 'application/json',
    };
    return this.#http.get(`${this.#url}vikingousers/products/category/${categorySlug}`, { headers });
  }
  
}
