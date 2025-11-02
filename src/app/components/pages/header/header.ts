import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import { environment } from '@enviroments/environment.development';


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
export class Header {

  isScrolled = false;
  public colorPrimary = environment.colorPrimay;
  public colorWhite = environment.colorWhite;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 60; // altura en la que cambia el fondo
  }

}
