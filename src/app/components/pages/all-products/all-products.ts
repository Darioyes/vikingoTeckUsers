import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { environment } from '@enviroments/environment.development';
import { AlertService } from '@services/alert/alertService/alert-service';
import { Products } from '@services/products/products';
import { CustomAlert } from '@shared/Alerts/custom-alert/custom-alert';
import { CardProducts } from '@shared/card-products/card-products';
import { SpinerPages } from '@shared/spiner-pages/spiner-pages';
import { debounceTime, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-all-products',
  imports: [
    CardProducts,
    SpinerPages,
    CustomAlert
  ],
  templateUrl: './all-products.html',
  styleUrl: './all-products.scss',
})
export class AllProducts implements OnInit, OnDestroy {

  #productsService = inject(Products);
  #unsubscribe!: Subscription;
  #alertTrigger$ = new Subject<string>();

  public urlImage = environment.domainimage;
  public products = signal<any[]>([]);
  public successMessage = signal<string>('');
  
    constructor(private alertService: AlertService) {
    // 2. Escucha el Subject con un pequeño retraso de seguridad (200ms)
    this.#alertTrigger$.pipe(
      debounceTime(10000) 
    ).subscribe(message => {
      // Esta lógica solo se ejecutará UNA vez 
      // aunque reciba 5 señales seguidas
      this.alertService.showAlert('success', message);
    });
  }


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
        this.products.set(response.data.data);
        this.successMessage.set(response.response);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  //recibimos el mensaje del hijo para mostrar la alerta
  public receiveMessage(message: string): void {
    //this.#alertTrigger$.next(message);
  }

}
