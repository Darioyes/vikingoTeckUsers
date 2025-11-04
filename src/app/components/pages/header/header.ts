import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, inject, OnDestroy, OnInit, signal } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import { environment } from '@enviroments/environment.development';
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
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  #navbarMenuService = inject(NavbarMenu);

  public activeMenu = signal<boolean>(false);
  

  isScrolled = false;
  public colorPrimary = environment.colorPrimay;
  public colorWhite = environment.colorWhite;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 60; // altura en la que cambia el fondo
  }

  ngOnInit(): void {

  }
  OnDestroy(): void {}

  toggleMenu():void {
    this.activeMenu.set(!this.activeMenu());
    this.#navbarMenuService.getSubmenuActive().subscribe((value) => {
      this.activeMenu.set(value);
    });
    this.#navbarMenuService.setSubmenuActive(this.activeMenu());
  }
  

}
