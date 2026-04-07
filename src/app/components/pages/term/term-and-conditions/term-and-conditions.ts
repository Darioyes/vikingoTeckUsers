import { Component, inject, OnInit } from '@angular/core';
import { HeaderSevice } from '@services/header/header-sevice';

@Component({
  selector: 'app-term-and-conditions',
  imports: [],
  templateUrl: './term-and-conditions.html',
  styleUrl: './term-and-conditions.scss',
})
export class TermAndConditions implements OnInit {

  #headerService = inject(HeaderSevice);
  
  ngOnInit(): void {
    this.setWhiteHeader();
  }
  
  public setWhiteHeader(): void {
    this.#headerService.setWhiteHeader(true);
  }

}
