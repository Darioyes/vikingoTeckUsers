import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-card-products',
  imports: [
    MatIconModule,
    MatButtonModule,
    DecimalPipe,
  ],
  templateUrl: './card-products.html',
  styleUrl: './card-products.scss',
})
export class CardProducts {

  public id = input<number>(1);
  public image = input<string>('./../../../assets/images/imagenPrueba.jpg');
  public name = input<string>('nombre del producto de lo mejor que hay en vikingoTech');
  public price = input<number>(1000000);
  public stock = input<number>(1);
  public color = input<string>('color');

}
