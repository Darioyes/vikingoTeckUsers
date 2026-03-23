import { DecimalPipe } from '@angular/common';
import { Component, inject, input, OnDestroy, OnInit, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { IShopingCartData, IShopingCartRequest, IShopingCartResponse, User } from '@interfaces/IShopingCart';
import { AlertService } from '@services/alert/alertService/alert-service';
import { ShoopingCartService } from '@services/shoopingCart/ShoopingCart/shooping-cart-service';
import { CustomAlert } from '@shared/Alerts/custom-alert/custom-alert';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-card-products',
  imports: [
    MatIconModule,
    MatButtonModule,
    DecimalPipe,
    RouterModule,
    CustomAlert
  ],
  templateUrl: './card-products.html',
  styleUrl: './card-products.scss',
})
export class CardProducts implements OnInit, OnDestroy {

  #cokieService = inject(CookieService);
  #shoopingCartService = inject(ShoopingCartService);
  #unsubscribeAddToCart!:  Subscription;
  #alertService = inject(AlertService);

  public id = input<number>(1);
  public image = input<string>('./../../../assets/images/imagenPrueba.jpg');
  public name = input<string>('nombre del producto de lo mejor que hay en vikingoTech');
  public price = input<number>(1000000);
  public stock = input<number>(1);
  public color = input<string>('color');
  public slug = input<string>('nombre-del-producto-de-lo-mejor-que-hay-en-vikingotech');

  public message = output<string>();

  public loading = signal<boolean>(false);

  public router = inject(Router)

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    if (this.#unsubscribeAddToCart) {
      this.#unsubscribeAddToCart.unsubscribe();
    }
  }

  //funcion para redirigir a la pagina del producto usando
  public goToProductPage(): void {
    //redireccionar a la pagina del producto usando el slug
    this.router.navigate(['/home/producto', this.slug().toLowerCase()]);
  }

  //metodo para agrega el producto si no esta logeado al indexedDB
  public addToCart(): void {

    const token = this.#cokieService.get('token');
    
    if (token) {
        if (this.loading()) return; // Si ya está procesando, no hagas nada
        this.loading.set(true);
        const request: IShopingCartRequest = {
        _method: 'POST',
        product_id: this.id(),
        user_id: parseInt(this.#cokieService.get('id'), 10),
        amount: 1
      };
      // Aquí deberías llamar a tu servicio para agregar al carrito usando el request
      this.#unsubscribeAddToCart = this.#shoopingCartService.addToCart(request).subscribe({
        next: (response:IShopingCartResponse) => {
          this.message.emit('Producto agregado al carrito');
          this.#shoopingCartService.setRedPointActive(true); // Activar el punto rojo en el header
          this.#cokieService.set('cart_updated', 'true'); // Opcional: Puedes usar una cookie para indicar que el carrito se ha actualizado
        },
        error: (err:IShopingCartResponse) => {
          console.log(err);
        },
        complete: () => {
          this.loading.set(false);
        }
      });
     
     
    } else {
         // 1. Obtenemos el carrito actual (arreglo de datos del carrito)
      const cart: IShopingCartData[] = JSON.parse(localStorage.getItem('cart') || '[]');
      if(cart){
        this.#shoopingCartService.setRedPointActive(true);
        this.#cokieService.set('cart_updated', 'true');
      }

      // 2. Buscamos si el producto ya existe en el carrito local
      const existingItem = cart.find(item => item.product_id === this.id());

      if (existingItem) {
        // 3. Validamos stock antes de sumar
        if (existingItem.product.stock > existingItem.amount) {
          existingItem.amount += 1;
        } else {
          console.warn('No hay más stock disponible');
        }
      } else {
        // 4. Creamos el nuevo item respetando la interfaz IShopingCartData
        const newItem: IShopingCartData = {
          id: Date.now(), // ID temporal para el carrito local
          amount: 1,
          user_id: this.id(), 
          product_id: this.id(),
          user: {} as User, // Objeto vacío o datos genéricos
          product: {
            id: this.id(),
            name: this.name(),
            slug: this.slug(),
            stock: this.stock(),
            sale_price: this.price().toString(),
            image1: this.image(),
            description: 'Carrito de compras local - producto agregado sin sesión', 
            reference: null,
            barcode: null,
            visible: null,
            image2: null, 
            image3: null, 
            image4: null, 
            image5: null
          }
        };
        cart.push(newItem);
      }

      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }

  //metodo para enviar el output del mensaje al componente padre
  public sendMessage(message: string): void {
    this.message.emit(message);  
  }
}
