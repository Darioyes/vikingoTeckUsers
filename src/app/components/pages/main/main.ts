import { Component } from '@angular/core';
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
export class Main {

}
