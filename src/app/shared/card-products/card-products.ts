import { DecimalPipe } from '@angular/common';
import { Component, inject, input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-card-products',
  imports: [
    MatIconModule,
    MatButtonModule,
    DecimalPipe,
    RouterModule,
  ],
  templateUrl: './card-products.html',
  styleUrl: './card-products.scss',
})
export class CardProducts implements OnInit {

  public id = input<number>(1);
  public image = input<string>('./../../../assets/images/imagenPrueba.jpg');
  public name = input<string>('nombre del producto de lo mejor que hay en vikingoTech');
  public price = input<number>(1000000);
  public stock = input<number>(1);
  public color = input<string>('color');
  public slug = input<string>('nombre-del-producto-de-lo-mejor-que-hay-en-vikingotech');

  public router = inject(Router)

  ngOnInit(): void {

  }

  //funcion para redirigir a la pagina del producto usando
  goToProductPage(): void {
    //redireccionar a la pagina del producto usando el slug
    this.router.navigate(['/home/producto', this.slug().toLowerCase()]);
  }

}
