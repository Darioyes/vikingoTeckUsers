import { Component, OnInit } from '@angular/core';
import { Carousel } from '../carousel/carousel';
import { AllProducts } from '../all-products/all-products';

@Component({
  selector: 'app-main',
  imports: [
    Carousel,
    AllProducts,
  ],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main implements OnInit {

  ngOnInit(): void {

    const params = new URLSearchParams(window.location.search);

    const orderId = params.get('orderId');
    const status = params.get('status');

    console.log('Resultado pago:', { orderId, status });

  }

}
