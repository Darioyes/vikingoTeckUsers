import { DecimalPipe } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, ParamMap, RouterModule } from '@angular/router';
import { environment } from '@enviroments/environment.development';
import { HeaderSevice } from '@services/header/header-sevice';
import { Products } from '@services/products/products';
import { SpinerPages } from '@shared/spiner-pages/spiner-pages';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product',
  imports: [
    MatIconModule,
    MatButtonModule,
    RouterModule,
    DecimalPipe,
    SpinerPages
  ],
  templateUrl: './product.html',
  styleUrl: './product.scss',
  //schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Product implements OnInit, OnDestroy {

  #headerService = inject(HeaderSevice)
  #route = inject(ActivatedRoute);
  #productsService = inject(Products);  
  #unsubscribe!: Subscription;
  //#route = inject(RouterModule);
  //#slug = inject(ActivatedRoute);

  #touchStartX = 0;
  #touchEndX = 0;
  
  public headerWhite = signal<boolean>(false);
  public product = signal<any>(null);
  public slug = signal<any>('');
  public urlImage = environment.domainimage;

  public currentImage = signal(0);
  public images = signal<string[]>([]);
  public successMessage = signal<string>('');

  public quantity = signal(1);

  

  ngOnInit(): void {
    this.setWhiteHeader();
    this.getProductBySlug();
  }

  ngOnDestroy(): void {
    if(this.#unsubscribe){
      this.#unsubscribe.unsubscribe();
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
  this.quantity.update(q => q + 1);
  }

  public decrease() {
    this.quantity.update(q => q > 1 ? q - 1 : 1);
  } 

}
