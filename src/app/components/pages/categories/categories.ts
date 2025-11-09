import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { HeaderSevice } from '@services/header/header-sevice';

@Component({
  selector: 'app-categories',
  imports: [],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class Categories implements OnInit, OnDestroy {

  #headerService = inject(HeaderSevice)
  
  public headerWhite = signal<boolean>(false);

  ngOnInit(): void {
    this.setWhiteHeader();
  }

  ngOnDestroy(): void {

  }

   public getWhiteHeader(): void {
      this.#headerService.getWhiteHeader().subscribe((value) => {
      this.headerWhite.set(value);
    });
  }
  
  public setWhiteHeader(): void {
    this.#headerService.setWhiteHeader(true);
  }

}
