import { ISalesRequest, ISalesResponse, Sale } from './../../../interfaces/ISalesResponse';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { HeaderSevice } from '@services/header/header-sevice';
import { SalesService } from '@services/sales/sales-service';
import { Subscription } from 'rxjs';
import { environment } from '@enviroments/environment.development';
import { DatePipe, DecimalPipe, NgStyle } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AlertService } from '@services/alert/alertService/alert-service';
import { CustomAlert } from '@shared/Alerts/custom-alert/custom-alert';
import { IShopingCartResponse } from '@interfaces/IShopingCart';
import { ShoopingCartService } from '@services/shoopingCart/ShoopingCart/shooping-cart-service';

@Component({
  selector: 'app-myshooping',
  imports: [
    DecimalPipe,
    DatePipe,
    NgStyle,
    CustomAlert,
  ],
  templateUrl: './myshooping.html',
  styleUrl: './myshooping.scss',
})
export class Myshooping implements OnInit, OnDestroy {

  #headerService = inject(HeaderSevice)
  #salesService = inject(SalesService)
  #unsubscribeSales!: Subscription;
  #route = inject(ActivatedRoute);
  #cokieService = inject(CookieService);
  #alertService = inject(AlertService);
  #unsubscribeRemoveShoppingCart!: Subscription;
  #unsubscribeShooping!: Subscription;
  url = environment.domainimage;

  public headerWhite = signal<boolean>(false);
  public sales = signal<Sale[]>([]);
  public boldOrderId = signal<string>('');
  public boldTxStatus = signal<string>('');
  public confirmSale = signal<string>('false');
  public token = signal<string | null>(this.#cokieService.get('token'));
  public name = signal<string | null>(this.#cokieService.get('name'));
  public idUser = signal<number>(  Number(this.#cokieService.get('id')));
  public amount = signal<any>(this.#cokieService.get('amount'));

  datosOrden = signal<any>({
    tipo: '',
    idProduct: '',
    idUser: '',
    timestamp: ''
  });

  public colorSuccess = environment.colorSuccess;
  public colorDanger = environment.colorDanger;
  public router = inject(Router)

  public Math = Math;

  ngOnInit(): void {
    this.setWhiteHeader();
    this.getSales();
    this.responseBold();
  }

  ngOnDestroy(): void {

    if (this.#unsubscribeSales) {
      this.#unsubscribeSales.unsubscribe();
    }
    if (this.#unsubscribeRemoveShoppingCart) {
      this.#unsubscribeRemoveShoppingCart.unsubscribe();
    }
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

  public getSales(): void {
    this.#unsubscribeSales = this.#salesService.getSales().subscribe({
      next: (ressponse: ISalesResponse) => {
        this.sales.set(ressponse.data);
      },
      error: (err) => {
        console.error('Error al obtener las ventas:', err);
      }
    })
  }

  //funcion para redirigir a la pagina del producto usando
  public goToProductPage(slug: string): void {
    //redireccionar a la pagina del producto usando el slug
    this.router.navigate(['/home/producto', slug.toLowerCase()]);
  }

  public responseBold(){
     this.#route.queryParams.subscribe(params => {
      this.boldOrderId.set(params['bold-order-id']);
      this.boldTxStatus.set(params['bold-tx-status']);
     });

    const [tipo, idProduct, idUser, timestamp] = this.boldOrderId().split('_');
    
     this.datosOrden.set({
      tipo: tipo,
      idProduct: idProduct,
      idUser: idUser,
      timestamp: timestamp
     });
     this.amount.set(localStorage.getItem('amount'));
    setTimeout(() => {
      this.createVenta();
    }, 1000);

  }

  public createVenta(): void {
    this.boldTxStatus() === 'approved' ? this.confirmSale.set('true') : this.confirmSale.set('false');
    if (this.token() && this.name()) {
      if(this.amount()){
        const saleData: ISalesRequest = {
          description:'Compra por medio de Bold con resultado:'+' '+ this.boldTxStatus(),
          amount: this.amount(),
          confirm_sale: this.confirmSale(),
          shopping_cart: 'false',
          user_id: this.datosOrden().idUser,
          product_id: this.datosOrden().idProduct,
          bold_order_id: this.boldOrderId()
        };
        this.#unsubscribeSales = this.#salesService.createSale(saleData).subscribe({
          next: (response: ISalesResponse) => {
            if(this.boldTxStatus() === 'approved'){
              this.#alertService.showAlert('success', '¡Compra realizada con éxito! Te esperamos en nuestra tienda para la entrega. Gracias por tu compra.');
            }
            else if(this.boldTxStatus() === 'rejected'){
              this.#alertService.showAlert('error', 'Tu compra ha sido rechazada. Por favor, intenta nuevamente o contacta a soporte de tu banco para más información <br/><br/>. De todos modos te reservaremos el producto por 24 horas si deseas pagar en efectivo.');
            }

            //borrar el localStorage
            localStorage.removeItem('orderId');
            localStorage.removeItem('amount');
            this.getSales();
          },
          error: (err: ISalesResponse) => {
            console.error('Error al crear la venta:', err);
            if(err.errorVikingo?.message === 'No hay stock suficiente para la venta'){
              this.#alertService.showAlert('error', err.errorVikingo.message);
            }else{
              this.#alertService.showAlert('error', 'Error a la hora de crear la venta. Por favor, contactanos para verificas si se realizo el pago.');
            }
          }
        });
      }else{
        this.#alertService.showAlert('error', 'No se pudo obtener el monto de la compra. Por favor, contactanos para verificas si se realizo el pago.');
      }
    }else{
      this.#alertService.showAlert('info', 'Para realizar una compra, por favor inicia sesión o regístrate en nuestra plataforma.');
    }
  }

}
