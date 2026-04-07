import { Component, inject, OnInit } from '@angular/core';
import { HeaderSevice } from '@services/header/header-sevice';

@Component({
  selector: 'app-use-of-cookies',
  imports: [],
  templateUrl: './use-of-cookies.html',
  styleUrl: './use-of-cookies.scss',
})
export class UseOfCookies implements OnInit {

  #headerService = inject(HeaderSevice);
  
  ngOnInit(): void {
    this.setWhiteHeader();
  }
  
  public setWhiteHeader(): void {
    this.#headerService.setWhiteHeader(true);
  }

}
