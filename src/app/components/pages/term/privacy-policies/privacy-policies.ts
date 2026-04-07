import { Component, inject, OnInit } from '@angular/core';
import { HeaderSevice } from '@services/header/header-sevice';

@Component({
  selector: 'app-privacy-policies',
  imports: [],
  templateUrl: './privacy-policies.html',
  styleUrl: './privacy-policies.scss',
})
export class PrivacyPolicies implements OnInit {

  #headerService = inject(HeaderSevice);
  
  ngOnInit(): void {
    this.setWhiteHeader();
  }
  
  public setWhiteHeader(): void {
    this.#headerService.setWhiteHeader(true);
  }

}
