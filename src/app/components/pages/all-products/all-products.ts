import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { environment } from '@enviroments/environment.development';
import { Products } from '@services/products/products';
import { CardProducts } from '@shared/card-products/card-products';
import { SpinerPages } from '@shared/spiner-pages/spiner-pages';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-all-products',
  imports: [
    CardProducts,
    SpinerPages
  ],
  templateUrl: './all-products.html',
  styleUrl: './all-products.scss',
})
export class AllProducts implements OnInit, OnDestroy {

  #productsService = inject(Products);
  #unsubscribe!: Subscription;

  public urlImage = environment.domainimage;
  public products = signal<any[]>([]);
  public successMessage = signal<string>('');


  ngOnInit(): void {
    this.getProducts();
  }
  ngOnDestroy(): void {
    if(this.#unsubscribe){
      this.#unsubscribe.unsubscribe();
    }
  }

  getProducts():void {
    this.#unsubscribe = this.#productsService.getProducts().subscribe({
      next: (response) => {
        this.products.set(response.data);
        this.successMessage.set(response.response);
        console.log(this.products());
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

}
