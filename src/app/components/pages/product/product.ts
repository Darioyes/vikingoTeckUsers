import { DecimalPipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal,AfterViewInit, ElementRef, ViewChild, effect } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, ParamMap, Router, RouterModule } from '@angular/router';
import { environment } from '@enviroments/environment.development';
import { IKeyBoldResponse } from '@interfaces/IKeyBold';
import { ISalesRequest, ISalesResponse } from '@interfaces/ISalesResponse';
import { IShopingCartRequest, IShopingCartResponse, IShopingCartData, User } from '@interfaces/IShopingCart';
import { AlertService } from '@services/alert/alertService/alert-service';
import { BoldService } from '@services/bold/bold-service';
import { HeaderSevice } from '@services/header/header-sevice';
import { Products } from '@services/products/products';
import { SalesService } from '@services/sales/sales-service';
import { ShoopingCartService } from '@services/shoopingCart/ShoopingCart/shooping-cart-service';
import { CustomAlert } from '@shared/Alerts/custom-alert/custom-alert';
import { SpinerPages } from '@shared/spiner-pages/spiner-pages';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product',
  imports: [
    MatIconModule,
    MatButtonModule,
    RouterModule,
    DecimalPipe,
    SpinerPages,
    CustomAlert,
  ],
  templateUrl: './product.html',
  styleUrl: './product.scss',
  //schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Product implements OnInit, OnDestroy {
  @ViewChild('boldContainer', { static: false }) boldContainer!: ElementRef;

  #headerService = inject(HeaderSevice)
  #route = inject(ActivatedRoute);
  #productsService = inject(Products);  
  #unsubscribe!: Subscription;
  #cokieService = inject(CookieService);
  #shoopingCartService = inject(ShoopingCartService);
  #unsubscribeAddToCart!:  Subscription;
  #unsubscribeSales!: Subscription;
  #alertService = inject(AlertService);
  #salesService = inject(SalesService);
  #routers = inject(Router);
  #boldService = inject(BoldService);
  #key = environment.apiKeyBold;

  public token = signal<string | null>(this.#cokieService.get('token'));
  public name = signal<string | null>(this.#cokieService.get('name'));
  public idUser = signal<number>(  Number(this.#cokieService.get('id')));

  #touchStartX = 0;
  #touchEndX = 0;
  
  public headerWhite = signal<boolean>(false);
  public product = signal<any>(null);
  public slug = signal<any>('');
  public urlImage = environment.domainimage;

  public currentImage = signal(0);
  public images = signal<string[]>([]);
  public successMessage = signal<string>('');

  public zoomActive = signal(false);
  public zoomPosition = signal('50% 50%');
  public lensX = signal('0px');
  public lensY = signal('0px');
  public loading = signal<boolean>(false);

  public quantity = signal(1);

  

  ngOnInit(): void {
    this.setWhiteHeader();
    this.getProductBySlug();
    
  }

  ngOnDestroy(): void {
    if(this.#unsubscribe){
      this.#unsubscribe.unsubscribe();
    }
    if (this.#unsubscribeAddToCart) {
      this.#unsubscribeAddToCart.unsubscribe();
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

  //obtener el slug de la url
  public getSlugFromUrl(): void {
    this.#route.paramMap.subscribe((params: ParamMap) => {
      this.slug.set(String(params.get('slug')));
    });
  }

  //funcion para obtener el producto por slug
  public getProductBySlug(): void {
    this.getSlugFromUrl();
    this.#unsubscribe = this.#productsService.getProductBySlug(this.slug()).subscribe({
      next: (response) => {
        const data = response.data;
          const imgs = [
            data.image1,
            data.image2,
            data.image3,
            data.image4,
            data.image5
          ].filter(img => img != null);

        this.product.set(data);
        this.images.set(imgs);
        this.successMessage.set(response.response);
        //this.initBold(data);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  // Solo para mover el carrusel
  public prev(): void {
    const total = this.images().length;
    if (total === 0) return;

   this.currentImage.update(i => (i - 1 + total) % total);
  }

  public next(): void {
    const total = this.images().length;
    if (total === 0) return;
    this.currentImage.update(i => (i + 1) % total);
  }

  public selectImage(index: number): void {
    this.currentImage.set(index);
  }

  // ====== SWIPE TOUCH ======

  public onTouchStart(event: TouchEvent | MouseEvent): void {
    this.#touchStartX = ('touches' in event) ? event.touches[0].clientX : event.clientX;
  }

  public onTouchEnd(event: TouchEvent | MouseEvent): void {
    this.#touchEndX = ('changedTouches' in event) ? event.changedTouches[0].clientX : event.clientX;

    const diff = this.#touchEndX - this.#touchStartX;

    if (Math.abs(diff) < 50) return;

    if (diff < 0) this.next();   // deslizó a la izquierda
    else this.prev();            // deslizó a la derecha
  }

  public increase() {

    this.quantity.update(q => q <= this.product().stock -1 ? q + 1 : q);
  }

  public decrease() {
    this.quantity.update(q => q > 1 ? q - 1 : 1);
  }
  
  public onMouseEnter() {
  this.zoomActive.set(true);
}

public onMouseLeave() {
  this.zoomActive.set(false);
}

public onMouseMove(event: MouseEvent) {
  const img = event.target as HTMLElement;
  const rect = img.getBoundingClientRect();

  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const posXPercent = (x / rect.width) * 100;
  const posYPercent = (y / rect.height) * 100;

  // Zona de zoom dentro de background
  this.zoomPosition.set(`${posXPercent}% ${posYPercent}%`);

  // Posición de la lupa
  const lensSize = 150; // tamaño de la lupa
  this.lensX.set(`${x - lensSize / 2}px`);
  this.lensY.set(`${y - lensSize / 2}px`);
}

  //metodo para agrega el producto si no esta logeado al indexedDB
  public addToCart(): void {
    const token = this.#cokieService.get('token');
    
    if (token) {
        if (this.loading()) return; // Si ya está procesando, no hagas nada
        this.loading.set(true);
        const request: IShopingCartRequest = {
        _method: 'POST',
        product_id: this.product().id,
        user_id: parseInt(this.#cokieService.get('id'), 10),
        amount: this.quantity()
      };
      // Aquí deberías llamar a tu servicio para agregar al carrito usando el request
      this.#unsubscribeAddToCart = this.#shoopingCartService.addToCart(request).subscribe({
        next: (response:IShopingCartResponse) => {
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
      const existingItem = cart.find(item => item.product_id === this.product().id);

      if (existingItem) {
        // 3. Validamos stock antes de sumar
        if (existingItem.product.stock > existingItem.amount) {
          existingItem.amount += this.quantity();
        } else {
          console.warn('No hay más stock disponible');
        }
        console.log('Item existente0:', existingItem);
      } else {
        
        // 4. Creamos el nuevo item respetando la interfaz IShopingCartData
       
        console.log('Item existente1:', existingItem);
        const newItem: IShopingCartData = {
          id: Date.now(), // ID temporal para el carrito local
          amount: this.quantity(),
          user_id: this.product()?.id,
          product_id: this.product()?.id,
          user: {} as User, // Objeto vacío o datos genéricos
          product: {
            id: this.product()?.id,
            name: this.product()?.name,
            slug: this.product()?.slug,
            stock: this.product()?.stock,
            sale_price: this.product()?.sale_price,
            image1: this.urlImage+this.product()?.image1.replace('public', 'storage'),
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

   public createReserv(amount: number, user_id: number, product_id: number): void {
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
            this.rediretToHome();
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
  
  async confirmReserv(amount: number, product_id: number):  Promise<void>{
       const confirm = await this.#alertService.openAlert('info', 'Recuerda que la reserva sera por 24 horas, luego de ese tiempo se eliminara si no se confirma la venta. ¿Deseas confirmar la reserva?');
      if (confirm) {
        this.createReserv(amount, this.idUser(), product_id);
      }
    }
  public rediretToHome(): void {
    this.#routers.navigate(['/home']);
  }

//   async initBold(product: any) {

//   const orderId = `order-${product.id}-${product.slug}-${Date.now()}`;
//   const amount = product.sale_price * this.quantity(); ;
//   const currency = 'COP';
//   console.log('Generando orden con ID:', orderId, 'y monto:', amount);

//   // 1️⃣ Obtener firma primero
//   this.#boldService.getSignatureBold({
//     orderId,
//     amount,
//     currency
//   }).subscribe(async (res) => {

//     // 2️⃣ Esperar un pequeño ciclo para asegurar DOM
//     setTimeout(async () => {

//       // 3️⃣ Cargar script
//       await this.#boldService.loadScript();

//       // 4️⃣ Renderizar botón
//       this.#boldService.renderButtonElement(
//         this.boldContainer.nativeElement,
//         {
//           apiKey: 'puqMNhY4pOUZ4cYv-89DYdIXbhicaJdKRvWy_yNzabU',
//           amount,
//           currency,
//           orderId,
//           description: product.name,
//           integritySignature: res.data.signature,
//           buttonStyle: 'light-S'
//         }
//       );

//     }, 1000);
//   });
// }

  async pagar() {

    const email = this.#cokieService.get('email')
    const fullName = this.#cokieService.get('name') + ' ' + this.#cokieService.get('lastname');

    const product = this.product();
    if (!product) return;

    const orderId = `order_${product.id}-${this.idUser()}_${Date.now()}`;
    const amount = (product.sale_price * this.quantity()).toString();
    localStorage.setItem('orderId', orderId);

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
          renderMode: 'embedded',

          description: product.name,
          redirectionUrl: 'https://vikingotech-online.dariocode.com/#/home/mis-compras',

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

      });
    });
  }

//   async pagar() {

//   const email = this.#cokieService.get('email')
//   const fullName = this.#cokieService.get('name') + ' ' + this.#cokieService.get('lastname');

//   const product = this.product();
//   if (!product) return;

//   const orderId = `order-${product.id}-${Date.now()}`;
//   const amount = product.sale_price * this.quantity();

//   // 1️⃣ Crear orden
//   this.#boldService.createOrder({
//     orderId,
//     amount,
//     currency: 'COP'
//   }).subscribe(() => {

//     // 2️⃣ Generar firma
//     this.#boldService.getSignatureBold({
//       orderId,
//       amount,
//       currency: 'COP'
//     }).subscribe((res:IKeyBoldResponse) => {

//       const config = this.#boldService.buildBoldConfig({
//         orderId,
//         currency: 'COP',
//         amount,
//         apiKey: this.#key,
//         integritySignature: res.data.signature,

//         description: product.name,
//         //redirectionUrl: 'https://tusitio.com/resultado',

//         customerData: {
//           email: email,
//           fullName: fullName
//         },

//         // billingAddress: {
//         //   address: 'Calle 123',
//         //   city: 'Bogotá',
//         //   country: 'CO'
//         // },

//         //extraData1: 'usuario-premium'
//       });

//       const checkout = new (window as any).BoldCheckout(config);
//       checkout.open(); // 🚀
//     });

//   });
// }

  async confirmSale(): Promise<void>{
    if (this.token() || this.name()) {
      const confirm = await this.#alertService.openAlert('info', '¿Deseas confirmar la compra?<br/><br/> Recuerda que por el momento no tenemos envios a domicilio, por lo que la compra se debera recoger en la tienda.');
  
      if (confirm) {
        this.pagar();
      }

    } else {
      this.#alertService.showAlert('alert', 'Para realizar una compra, por favor inicia sesión o regístrate en nuestra plataforma.');
    }
  }
}
