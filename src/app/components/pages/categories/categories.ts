import { Component, inject, OnChanges, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { environment } from '@enviroments/environment.development';
import { HeaderSevice } from '@services/header/header-sevice';
import { Products } from '@services/products/products';
import { CardProducts } from '@shared/card-products/card-products';
import { SpinerPages } from '@shared/spiner-pages/spiner-pages';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-categories',
  imports: [
    CardProducts,
    SpinerPages
  ],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class Categories implements OnInit, OnDestroy {

  #headerService = inject(HeaderSevice)
  #route = inject(ActivatedRoute);
  #productsService = inject(Products);  
  #unsubscribe1!: Subscription;
  #unsubscribe2!: Subscription;

  public urlImage = environment.domainimage;
  public successMessage = signal<string>('');
  public products = signal<any[]>([]);
  public categoryName = signal<string>('');
  
  public headerWhite = signal<boolean>(false);
  public slug = signal<any>('');

  ngOnInit(): void {
    this.setWhiteHeader();
    this.#unsubscribe1 = this.#route.paramMap.subscribe((params: ParamMap) => {
      const newSlug = String(params.get('slug'));
      this.slug.set(newSlug);
      this.loadProducts(newSlug);
    });

  }

  ngOnDestroy(): void {
    if(this.#unsubscribe1){
      this.#unsubscribe1.unsubscribe();
    }
    if(this.#unsubscribe2){
      this.#unsubscribe2.unsubscribe();
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

    private loadProducts(slug: string): void {
    this.#unsubscribe2 = this.#productsService.getProductsByCategory(slug).subscribe({
      next: (response) => {
        this.products.set(response.data.products.data);
        this.successMessage.set(response.response);
        this.categoryName.set(response.data.category.name);
        console.log(response);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

}
