import { HttpClient } from '@angular/common/http';
import { effect, inject, Injectable, signal, untracked } from '@angular/core';
import { environment } from '@enviroments/environment.development';
import { IShopingCartRequest, IShopingCartResponse } from '@interfaces/IShopingCart';
import { AlertService } from '@services/alert/alertService/alert-service';
import { CookieService } from 'ngx-cookie-service';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShoopingCartService {

  #url = environment.domain;
  #http = inject(HttpClient);
  #cookieService = inject(CookieService);
  #alertService = inject(AlertService);
  // Signal que guarda el último cambio pendiente
  #pendingUpdate = signal<{ shopId: number, data: IShopingCartRequest } | null>(null);

  #redPointActive: Subject<boolean> = new Subject<boolean>();

  constructor() {
    effect((onCleanup) => {
      const update = this.#pendingUpdate();
      if (!update) return;

      const timeout = setTimeout(() => {
        // Usamos untracked para evitar dependencias circulares accidentales
        untracked(() => {
          this.updateCartItem(update.shopId, update.data)
            .subscribe({
              next: (res) => console.log('Carrito sincronizado'),
              error: (err) => {
                console.error('Error al sincronizar:', err);
                // Aquí podrías disparar una alerta o revertir el cambio
                this.#pendingUpdate.set(null);
                this.#alertService.showAlert('error','Error al sincronizar el carrito');
              }
            });
        });
      }, 800);

      onCleanup(() => clearTimeout(timeout));
    });
  }

  public queueUpdate(shopId: number, data: IShopingCartRequest) {
    this.#pendingUpdate.set({ shopId, data });
  }

  public getCartItems(): Observable<IShopingCartResponse> {
    const token = this.#cookieService.get('token');
    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    return this.#http.get<IShopingCartResponse>(`${this.#url}vikingousers/shoopingcart`, { headers: headers });

  }

  public getCartItemsByUser(userId: number): Observable<IShopingCartResponse> {
    const token = this.#cookieService.get('token');
    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    return this.#http.get<IShopingCartResponse>(`${this.#url}vikingousers/shoopingcart/user/${userId}`, { headers: headers });
  }

  getOneCartItem(shopId: number): Observable<IShopingCartResponse> {
    const token = this.#cookieService.get('token');
    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    return this.#http.get<IShopingCartResponse>(`${this.#url}vikingousers/shoopingcart/${shopId}`, { headers: headers });
  }

  public addToCart(data: IShopingCartRequest): Observable<IShopingCartResponse> {
    const token = this.#cookieService.get('token');
    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    return this.#http.post<IShopingCartResponse>(`${this.#url}vikingousers/shoopingcart`, data, { headers: headers });
  }

  public removeFromCart(shopId: number): Observable<IShopingCartResponse> {
    const token = this.#cookieService.get('token');
    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    return this.#http.delete<IShopingCartResponse>(`${this.#url}vikingousers/shoopingcart/${shopId}`, { headers: headers });
  }

  public updateCartItem(shopId: number, data: IShopingCartRequest): Observable<IShopingCartResponse> {
    const token = this.#cookieService.get('token');
    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    return this.#http.put<IShopingCartResponse>(`${this.#url}vikingousers/shoopingcart/${shopId}`, data, { headers: headers });
  }
  
  
  //activar o desactivar el punto rojo del carrito de compras
  setRedPointActive(value: boolean): void { 
    //insertar punto rojo en el header cuando haya productos en el carrito
    this.#redPointActive.next(value);
  }

  //obtener el estado del punto rojo del carrito de compras
  getRedPointActive(): Subject<boolean> { //
    return this.#redPointActive;
  }
  
}
