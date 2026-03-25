import { NgClass } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { environment } from '@enviroments/environment.development';
import { ICarousel } from '@interfaces/ICarousel';
import { IShopingCartData, IShopingCartRequest, IShopingCartResponse, User } from '@interfaces/IShopingCart';
import { Banner } from '@services/banner/banner';
import { ShoopingCartService } from '@services/shoopingCart/ShoopingCart/shooping-cart-service';
import { SpinerPages } from '@shared/spiner-pages/spiner-pages';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-carousel',
  imports: [
    MatIconModule,
    NgClass,
    MatButtonModule,
    SpinerPages
  ],
  templateUrl: './carousel.html',
  styleUrl: './carousel.scss',
})
export class Carousel implements OnInit, OnDestroy {

  #bannerService = inject(Banner);
  #unsubscribe!: Subscription;
  #cokieService = inject(CookieService);
  #shoopingCartService = inject(ShoopingCartService);
  #unsubscribeAddToCart!:  Subscription;
  #urlImage = environment.domainimage;

  public urlImage = environment.domainimage;
  public banners = signal<ICarousel[]>([]);
  public currentIndex = signal(0);
  public isAnimating = signal(false);
  private intervalId: any;
  public loading = signal<boolean>(false);
  public router = inject(Router)

  ngOnInit(): void {
    this.getBanners();
    this.resumeCarousel();
  }

  ngOnDestroy(): void {
    if(this.#unsubscribe){
      this.#unsubscribe.unsubscribe();
    }
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  this.pauseCarousel();
    if (this.#unsubscribeAddToCart) {
      this.#unsubscribeAddToCart.unsubscribe();
    }
  }

  getBanners():void {
    this.#unsubscribe =this.#bannerService.getBanners().subscribe({
      next: (response) => {
        const sorted = response.sort((a, b) => a.order - b.order);
        this.banners.set(sorted);
        
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  next(): void {
    const total = this.banners().length;
    this.animateChange(() => {
      this.currentIndex.update(i => (i + 1) % total);
    });
  }

  prev(): void {
    const total = this.banners().length;
    this.animateChange(() => {
      this.currentIndex.update(i => (i - 1 + total) % total);
    });
  }

  animateChange(changeFn: () => void): void {
    this.isAnimating.set(true);

    // Primero desvanecemos la imagen actual
      setTimeout(() => {
        changeFn(); // Aquí se cambia la imagen

        // Luego activamos fade-in
        setTimeout(() => {
          this.isAnimating.set(false);
        }, 50); // Un pequeño retraso para permitir reflow
      }, 300); // Tiempo del fade-out
    }

  pauseCarousel(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  resumeCarousel(): void {
    if (!this.intervalId) {
      this.intervalId = setInterval(() => {
        this.next();
      }, 10000);
    }
  }

  // Agrega esto a tu clase Carousel
  selectProduct(): void {
    const currentBanner:ICarousel = this.banners()[this.currentIndex()];

    if (currentBanner) {

      const token = this.#cokieService.get('token');

      if (token) {
        this.addProductToCartLogin(currentBanner);

      }else{

        this.addProductToCartLocalStorage(currentBanner);
        
      }
    }
  }

  public addProductToCartLogin(currentBanner: ICarousel): void {

    if (this.loading()) return; 
    
    this.loading.set(true);
    const request: IShopingCartRequest = {
      _method: 'POST',
      product_id: currentBanner.product.id,
      user_id: parseInt(this.#cokieService.get('id'), 10),
      amount: 1
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
  }

  public addProductToCartLocalStorage(currentBanner: ICarousel): void {
    
    const cart: IShopingCartData[] = JSON.parse(localStorage.getItem('cart') || '[]');
    if(cart){
      this.#shoopingCartService.setRedPointActive(true);
      this.#cokieService.set('cart_updated', 'true');
    }

    const existingItem = cart.find(item => item.product_id === currentBanner.product.id);

    if (existingItem) {
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
        user_id: currentBanner.product.id, // Aquí puedes usar el ID del producto o cualquier otro identificador
        product_id: currentBanner.product.id,
        user: {} as User, // Objeto vacío o datos genéricos
        product: {
          id: currentBanner.product.id,
          name: currentBanner.product.name,
          slug: currentBanner.product.slug,
          stock: currentBanner.product.stock,
          sale_price: currentBanner.product.sale_price,
          image1:  this.#urlImage+currentBanner?.product?.image1?.replace('public', 'storage'),
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

  public goToProductPage(): void {
    const currentBanner:ICarousel = this.banners()[this.currentIndex()];
    //redireccionar a la pagina del producto usando el slug
    this.router.navigate(['/home/producto', currentBanner.product.slug.toLowerCase()]);
  }
}
