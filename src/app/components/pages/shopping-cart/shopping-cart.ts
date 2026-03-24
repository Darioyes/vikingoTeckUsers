import { DecimalPipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { environment } from '@enviroments/environment.development';
import { IShopingCartData, IShopingCartRequest, IShopingCartResponse } from '@interfaces/IShopingCart';
import { AlertService } from '@services/alert/alertService/alert-service';
import { HeaderSevice } from '@services/header/header-sevice';
import { ShoopingCartService } from '@services/shoopingCart/ShoopingCart/shooping-cart-service';
import { SpinerPages } from '@shared/spiner-pages/spiner-pages';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-cart',
  imports: [
    MatIconModule,
    MatButtonModule,
    RouterModule,
    DecimalPipe,
    SpinerPages
  ],
  templateUrl: './shopping-cart.html',
  styleUrl: './shopping-cart.scss',
})
export class ShoppingCart implements OnInit, OnDestroy {

  #headerService = inject(HeaderSevice)
  #cookieService = inject(CookieService);
  #alertService = inject(AlertService);
  #idUser = this.#cookieService.get('id');
  #unsubscribeShooping!: Subscription;
  #unsubscribeRemoveShoppingCart!: Subscription;
  #shoopingCartService = inject(ShoopingCartService);
  public token = signal<string | null>(this.#cookieService.get('token'));
  public name = signal<string | null>(this.#cookieService.get('name'));
  public headerWhite = signal<boolean>(false);
  public products = signal<IShopingCartData[]>([]);
  public urlImg = environment.domainimage;
  public math = Math;
  public router = inject(Router)

  ngOnInit(): void {
    this.setWhiteHeader();
    this.getCart();
  }

  ngOnDestroy(): void {
    if (this.#unsubscribeShooping) {
      this.#unsubscribeShooping.unsubscribe();
    }
  }

  public getWhiteHeader(): void {
      this.#headerService.getWhiteHeader().subscribe((value) => {
      this.headerWhite.set(value);
    });
  }
  
  public setWhiteHeader(): void {
    this.#headerService.setWhiteHeader(true);
  }

  public getCart() {
    if (this.token() && this.name()) {
      this.#unsubscribeShooping = this.#shoopingCartService.getCartItemsByUser(parseInt(this.#idUser)).subscribe({
        next: (response:IShopingCartResponse) => {
          this.products.set(response.data);
          if(response.data.length > 0){
            this.#cookieService.set('cart_updated', 'true');
            this.#shoopingCartService.setRedPointActive(true);
          } else {
            this.#cookieService.set('cart_updated', 'false');
            this.#shoopingCartService.setRedPointActive(false);
          }
        },
        error: (err) => {
          console.log(err);
        }
      });
    }else{
      const cart= JSON.parse(localStorage.getItem('cart') || '[]');
      this.products.set(cart);
    }
  }

  //metodo para eliminar un producto del carrito de compras usando el id del producto y eliminarlo del localStorage
  public removeFromCart(productId: number) {
    if (!this.token) {
      // 1. Actualizas el signal (lo visual)
      this.products.update(list => list.filter(p => p.id !== productId));  
      // 2. Guardas el valor actual del signal directamente en el localStorage
      localStorage.setItem('cart', JSON.stringify(this.products()));
    }
  }

  public updateAmount(productId: number, delta: number) {
    // 1. Buscamos el producto actual para validar stock antes de actualizar
    const currentProduct = this.products().find(p => p.id === productId);
    // Si no encontramos el producto, no hacemos nada
    if (!currentProduct) return;

    const currentAmount = Math.floor(currentProduct.amount);
    // Calculamos el nuevo monto basado en el delta (puede ser +1 o -1)
    const newAmount = currentAmount + delta;

    // --- VALIDACIONES ---
    // A. No bajar de 1
    if (newAmount < 1) return;

    // B. No superar el stock disponible (si el delta es positivo)
    if (delta > 0 && currentProduct.product.stock !== undefined) {
      if (newAmount > currentProduct.product.stock) {
        this.#alertService.showAlert('error', `Solo quedan ${currentProduct.product.stock} unidades disponibles.`);
        return;
      }
    }

    // 2. ACTUALIZACIÓN
    let productToUpdate: IShopingCartData | undefined;

    this.products.update(list => 
      list.map(p => {
        if (p.id === productId) {
          productToUpdate = { ...p, amount: newAmount };
          return productToUpdate;
        }
        return p;
      })
    );

    if (!productToUpdate) return;

    // 3. PERSISTENCIA (API o LocalStorage)
    if (this.token() && this.name()) {
      // Definimos el objeto según tu interfaz IShopingCartRequest
      const requestData: IShopingCartRequest = { 
        _method: 'PUT', 
        product_id: productToUpdate.product_id, 
        user_id: productToUpdate.user_id, 
        amount: productToUpdate.amount 
      };

      // Enviamos al servicio con Debounce
      this.#shoopingCartService.queueUpdate(productId, requestData);
      
    } else {
      // Sincronizamos LocalStorage si es invitado
      this.updateLocalStorage(productToUpdate);
    }
  }

  private updateLocalStorage(updatedProduct: IShopingCartData) {
    const cart: IShopingCartData[] = JSON.parse(localStorage.getItem('cart') || '[]');
    const index = cart.findIndex(p => p.id === updatedProduct.id);
    if (index !== -1) {
      cart[index].amount = updatedProduct.amount;
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }

  private removeShoopingCart(shoopingCartId: number) {
    if (this.token() && this.name()) {
      this.#unsubscribeRemoveShoppingCart = this.#shoopingCartService.removeFromCart(shoopingCartId).subscribe({
        next: (response:IShopingCartResponse) => {
          this.getCart();
        },
        error: (err:IShopingCartResponse) => {
          console.log(err);
        }
      });
    } else {
      // Si no hay token, eliminamos del localStorage
      const cart: IShopingCartData[] = JSON.parse(localStorage.getItem('cart') || '[]');
      const updatedCart:IShopingCartData[] = cart.filter(p => p.id !== shoopingCartId);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      // Actualizamos el signal para reflejar el cambio en la UI
      this.products.set(updatedCart);
      if(updatedCart.length === 0){
        this.#cookieService.set('cart_updated', 'false');
        this.#shoopingCartService.setRedPointActive(false);
      }
    }
  }

  async confirmRemoveShoppingCart(productId: number): Promise<void> {
    const confirm = await this.#alertService.openAlert('alert', '¿Estás seguro de que quieres eliminar este producto del carrito?');
    if (confirm) {
      this.removeShoopingCart(productId);
    }
  }

  //funcion para redirigir a la pagina del producto usando
  public goToProductPage(slug: string): void {
    //redireccionar a la pagina del producto usando el slug
    this.router.navigate(['/home/producto', slug.toLowerCase()]);
  }
}
