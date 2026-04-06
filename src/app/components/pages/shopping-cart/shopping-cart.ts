import { DecimalPipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { environment } from '@enviroments/environment.development';
import { IKeyBoldResponse } from '@interfaces/IKeyBold';
import { ISalesRequest, ISalesResponse } from '@interfaces/ISalesResponse';
import { IShopingCartData, IShopingCartRequest, IShopingCartResponse } from '@interfaces/IShopingCart';
import { AlertService } from '@services/alert/alertService/alert-service';
import { BoldService } from '@services/bold/bold-service';
import { HeaderSevice } from '@services/header/header-sevice';
import { SalesService } from '@services/sales/sales-service';
import { ShoopingCartService } from '@services/shoopingCart/ShoopingCart/shooping-cart-service';
import { CustomAlert } from '@shared/Alerts/custom-alert/custom-alert';
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
    SpinerPages,
    CustomAlert
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
  #unsubscribeSales!: Subscription;
  #shoopingCartService = inject(ShoopingCartService);
  #salesService = inject(SalesService);
  #boldService = inject(BoldService);
  #key = environment.apiKeyBold;
  #domainFrontend = environment.domainFrontend;
  public token = signal<string | null>(this.#cookieService.get('token'));
  public name = signal<string | null>(this.#cookieService.get('name'));
  public headerWhite = signal<boolean>(false);
  public products = signal<IShopingCartData[]>([]);
  public idUser = signal<number>(  Number(this.#cookieService.get('id')));
  public urlImg = environment.domainimage;
  public math = Math;
  public parseFloat = parseFloat;
  public parseInt = parseInt;
  public router = inject(Router)

  public colorSuccess = environment.colorSuccess;
  public colorDanger = environment.colorDanger;

  ngOnInit(): void {
    this.setWhiteHeader();
    this.getCart();
  }

  ngOnDestroy(): void {
    if (this.#unsubscribeShooping) {
      this.#unsubscribeShooping.unsubscribe();
    }
    if (this.#unsubscribeRemoveShoppingCart) {
      this.#unsubscribeRemoveShoppingCart.unsubscribe();
    }
    if (this.#unsubscribeSales) {
      this.#unsubscribeSales.unsubscribe();
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

  public createReserv(amount: number, user_id: number, product_id: number, shopping_cart_id: number): void {
    if (this.token() && this.name()) {
      const saleData: ISalesRequest = {
        description: `Venta del producto desde el frontend de VikingoTech`,
        amount: amount,
        confirm_sale: 'false',
        shopping_cart: 'false',
        user_id: user_id,
        product_id: product_id
      };
      this.#unsubscribeSales = this.#salesService.createSale(saleData).subscribe({
        next: (response: ISalesResponse) => {
          this.#alertService.showAlert('success', 'Reserva creada exitosamente. Recuerde que la reserva sera por 24 horas, luego de ese tiempo se eliminara si no se confirma la venta.');
          this.removeShoopingCart(shopping_cart_id);
        },
        error: (err: ISalesResponse) => {
          console.error('Error al crear la venta:', err);
          if(err.errorVikingo?.message === 'No hay stock suficiente para la venta'){
            this.#alertService.showAlert('error', err.errorVikingo.message);
          }else{
            this.#alertService.showAlert('error', 'Error a la hora de crear la venta. Por favor, intenta nuevamente.');
          }
        }
      });
    }else{
      this.#alertService.showAlert('info', 'Para realizar una compra, por favor inicia sesión o regístrate en nuestra plataforma.');
    }
  }

  async confirmReserv(amount: number, user_id: number, product_id: number, shopping_cart_id: number):  Promise<void>{
     const confirm = await this.#alertService.openAlert('info', 'Recuerda que la reserva sera por 24 horas, luego de ese tiempo se eliminara si no se confirma la venta. ¿Deseas confirmar la reserva?');
    if (confirm) {
      this.createReserv(amount, user_id, product_id, shopping_cart_id);
    }
  }

  async pagar(idProduct: any,salesPrice:number,quantity:number,stock: number, productName:string, shoppingCartId: number) {

    if(stock < quantity){
      this.#alertService.showAlert('error', 'No hay stock suficiente para realizar la compra. Por favor, reduce la cantidad.');
      return;
    }

    const email = this.#cookieService.get('email')
    const fullName = this.#cookieService.get('name') + ' ' + this.#cookieService.get('lastname');

    const product = this.products();
    if (!product) return;

    const orderId = `order_${idProduct}_${this.idUser()}_${Date.now()}`;
    const amount = (salesPrice * quantity).toString();
    localStorage.setItem('orderId', orderId);
    localStorage.setItem('amount', quantity.toString());

      // 1️⃣ Crear orden
    this.#boldService.createOrder({
      orderId,
      amount,
      currency: 'COP'
    }).subscribe(() => {
      // 2️⃣ Generar firma
      this.#boldService.getSignatureBold({
        orderId,
        amount,
        currency: 'COP'
      }).subscribe((res:IKeyBoldResponse) => {
        
        const config = this.#boldService.buildBoldConfig({
          orderId,
          currency: 'COP',
          amount,
          apiKey: this.#key,
          integritySignature: res.data.signature,
          renderMode: 'redirect',

          description: productName,
          redirectionUrl: `${this.#domainFrontend}home/mis-compras`,

          customerData: {
            email: email,
            fullName: fullName
          },

          // billingAddress: {
          //   address: 'Calle 123',
          //   city: 'Bogotá',
          //   country: 'CO'
          // },

          //extraData1: 'usuario-premium'
        });

        const checkout = new (window as any).BoldCheckout(config);
        
        checkout.open();

        this.removeShoopingCart(shoppingCartId);
        this.getCart();
      });
    });
  }
  
  async confirmSale(idProduct: any,salesPrice:number,quantity:number,stock: number, productName:string, shoppingCartId: number): Promise<void>{
    if (this.token() || this.name()) {
      const confirm = await this.#alertService.openAlert('info', '¿Deseas confirmar la compra?<br/><br/> Recuerda que por el momento no tenemos envios a domicilio, por lo que la compra se debera recoger en la tienda.');
  
      if (confirm) {
        this.pagar(idProduct,salesPrice,quantity,stock,productName, shoppingCartId);
      }

    } else {
      this.#alertService.showAlert('alert', 'Para realizar una compra, por favor inicia sesión o regístrate en nuestra plataforma.');
    }
  }

  public blockTyping(event: KeyboardEvent) {
    // Permitir solo teclas de control
    const allowedKeys = [
      'ArrowUp', 'ArrowDown', 'Tab', 'Backspace', 'Delete', 'Enter', 'Escape'
    ];

    if (!allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  public blockAllInput(event: KeyboardEvent) {
    event.preventDefault();
  }

}
