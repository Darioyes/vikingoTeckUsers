import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, inject, OnDestroy, OnInit, signal } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import { Router } from '@angular/router';
import { environment } from '@enviroments/environment.development';
import { HeaderSevice } from '@services/header/header-sevice';
import { NavbarMenu } from '@services/navbarMenu/navbar-menu';



@Component({
  selector: 'app-header',
  imports: [
    MatIconModule,
    NgStyle,
    
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header implements OnInit, OnDestroy {


  #navbarMenuService = inject(NavbarMenu);
  #routers = inject(Router);
  #headerService = inject(HeaderSevice);

  public activeMenu = signal<boolean>(false);
  public headerWhite = signal<boolean>(false);
  

  isScrolled = false;
  public colorPrimary = environment.colorPrimay;
  public colorWhite = environment.colorWhite;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 60; // altura en la que cambia el fondo
    
  }

  ngOnInit(): void {
    this.getWhiteHeader();
    this.headerWhite();
  }
  ngOnDestroy(): void {}

  public getWhiteHeader(): void {
      this.#headerService.getWhiteHeader().subscribe((value) => {
      this.headerWhite.set(value);
    });
  }
  
  public setWhiteHeader(): void {
    this.#headerService.setWhiteHeader(false);
  }

  toggleMenu():void {
    this.activeMenu.set(!this.activeMenu());
    this.#navbarMenuService.getSubmenuActive().subscribe((value) => {
      this.activeMenu.set(value);
    });
    this.#navbarMenuService.setSubmenuActive(this.activeMenu());
  }
  
  navigateToHome():void {
    this.#routers.navigate(['/home']);
    this.#headerService.setWhiteHeader(false);
  }

}
