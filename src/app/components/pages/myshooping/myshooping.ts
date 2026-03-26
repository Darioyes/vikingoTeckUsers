import { ISalesResponse, Sale } from './../../../interfaces/ISalesResponse';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { HeaderSevice } from '@services/header/header-sevice';
import { SalesService } from '@services/sales/sales-service';
import { Subscription } from 'rxjs';
import { environment } from '@enviroments/environment.development';
import { DatePipe, DecimalPipe, NgStyle } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-myshooping',
  imports: [
    DecimalPipe,
    DatePipe,
    NgStyle,
  ],
  templateUrl: './myshooping.html',
  styleUrl: './myshooping.scss',
})
export class Myshooping implements OnInit, OnDestroy {

  #headerService = inject(HeaderSevice)
  #salesService = inject(SalesService)
  #unsubscribeSales!: Subscription;
  url = environment.domainimage;

  public headerWhite = signal<boolean>(false);
  public sales = signal<Sale[]>([]);
  public colorSuccess = environment.colorSuccess;
  public colorDanger = environment.colorDanger;
  public router = inject(Router)

  public Math = Math;

  ngOnInit(): void {
    this.setWhiteHeader();
    this.getSales();
  }

  ngOnDestroy(): void {

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

}
