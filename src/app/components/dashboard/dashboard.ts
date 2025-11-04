import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Footer } from '@components/pages/footer/footer';
import { Header } from '@components/pages/header/header';
import { Navbar } from '@components/pages/navbar/navbar';
import { RouterOutlet } from '@angular/router';
import { NavbarMenu } from '@services/navbarMenu/navbar-menu';
import { NgClass } from '@angular/common';


@Component({
  selector: 'app-dashboard',
  imports: [
    RouterOutlet,
    Header,
    Navbar,
    Footer,
    NgClass
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit, OnDestroy {

  #navbarMenuService = inject(NavbarMenu);

  public activeMenu = signal<boolean>(false);

  ngOnInit(): void {
    this.openMenu();
  }

  ngOnDestroy(): void {}

  public openMenu(): void {
      this.#navbarMenuService.getSubmenuActive().subscribe((value) => {
      this.activeMenu.set(value);
    });
  }

  public closeMenu(): void {
    this.#navbarMenuService.setSubmenuActive(false);
  }

}
