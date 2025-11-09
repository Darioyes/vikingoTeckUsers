import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { HeaderSevice } from '@services/header/header-sevice';

@Component({
  selector: 'app-myshooping',
  imports: [],
  templateUrl: './myshooping.html',
  styleUrl: './myshooping.scss',
})
export class Myshooping implements OnInit, OnDestroy {

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
