import { NgClass, NgStyle } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { environment } from '@enviroments/environment.development';
import { CategoriesProducts } from '@services/categoriesProducts/categories-products';
import { NavbarMenu } from '@services/navbarMenu/navbar-menu';
import { Subscription, timeInterval } from 'rxjs';
import { Header } from '../header/header';
import { HeaderSevice } from '@services/header/header-sevice';

@Component({
  selector: 'app-navbar',
  imports: [
    MatIconModule,
    NgStyle,
    RouterModule,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit, OnDestroy {

  #navbarMenuService = inject(NavbarMenu);
  #categoriesProductsService = inject(CategoriesProducts);
  #headerService = inject(HeaderSevice);//servicion del header que cambia de color segun la pagina
  #unsubscribe!: Subscription;
  router = inject(RouterModule);

  public activeMenu = signal<boolean>(true);
  public visibleMenu= signal<string>('hidden');
  public categoriesProducts = signal<any>([]);
  public activeRoute = signal<boolean>(false);

  public colorBlackTransparent = environment.colorBlackTransparent;

  ngOnInit(): void {
    this.visibleMenu.set('visible');
    this.getCategoriesProducts();
    //console.log('URL actual ->', this.router);
  }

  ngOnDestroy(): void {
    if(this.#unsubscribe){
      this.#unsubscribe.unsubscribe();
    }
  }

  getCategoriesProducts(): void {
    this.#unsubscribe = this.#categoriesProductsService.getCategoriesProducts().subscribe({
      next: (response) => {
        //console.log(response);
        this.categoriesProducts.set(response);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  toggleMenu(white:boolean=false):void {
    this.activeMenu.set(!this.activeMenu());
    this.#navbarMenuService.getSubmenuActive().subscribe((value) => {
      this.activeMenu.set(value);
      if(this.activeMenu()){
        setTimeout(() => {
          this.visibleMenu.set('visible');
        }, 600);
      }
    });
    this.#navbarMenuService.setSubmenuActive(this.activeMenu());
    this.visibleMenu.set('hidden');
    this.#headerService.setWhiteHeader(white);
  }

  whiteHeader(white:boolean):void {
    // this.#headerService.getWhiteHeader().subscribe((value) => {
    //   this.activeMenu.set(value);

    // });
    this.#headerService.setWhiteHeader(white);

  }


}
