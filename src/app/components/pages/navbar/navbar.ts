import { CookieService } from 'ngx-cookie-service';
import { LoggeInService } from './../../../services/auth/loggeIn/logge-in-service';
import { CommonModule, NgStyle } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { environment } from '@enviroments/environment.development';
import { CategoriesProducts } from '@services/categoriesProducts/categories-products';
import { NavbarMenu } from '@services/navbarMenu/navbar-menu';
import { Subscription, timeInterval } from 'rxjs';
import { HeaderSevice } from '@services/header/header-sevice';
import { AlertService } from '@services/alert/alertService/alert-service';

@Component({
  selector: 'app-navbar',
  imports: [
    MatIconModule,
    NgStyle,
    RouterModule,
    CommonModule
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit, OnDestroy {

  #navbarMenuService = inject(NavbarMenu);
  #categoriesProductsService = inject(CategoriesProducts);
  #headerService = inject(HeaderSevice);//servicion del header que cambia de color segun la pagina
  #unsubscribe!: Subscription;
  #cookieService = inject(CookieService);
  #alertService = inject(AlertService);
  #routers = inject(Router);
  router = inject(RouterModule);
  public LoggeInService = inject(LoggeInService);

  public activeMenu = signal<boolean>(true);
  public visibleMenu= signal<string>('hidden');
  public categoriesProducts = signal<any>([]);
  public activeRoute = signal<boolean>(false);
  public isLoggedIn = signal<boolean>(false);

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
    this.#headerService.setWhiteHeader(white);

  }

  public ifLogin():boolean{
     
    if(this.#cookieService.get('token')&& this.#cookieService.get('success') && this.#cookieService.get('name')){
      return true;
    }

    return false;
  }

    async confirmLogout(white:boolean): Promise<void> {
    const confirm = await this.#alertService.openAlert('alert', '¿Estás seguro de que quieres cerrar sesión?');
    if (confirm) {
      this.LoggeInService.logoutUser();
      this.#routers.navigate(['/home/iniciar-sesion']);
      this.#headerService.setWhiteHeader(true);
    }
  }

  navigateToShoopingCart(white:boolean):void {
    this.#routers.navigate(['/home/carrito-compras']);
    this.#headerService.setWhiteHeader(white);
  }


}
