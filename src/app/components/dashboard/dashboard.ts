import { Component } from '@angular/core';
import { Footer } from '@components/pages/footer/footer';
import { Header } from '@components/pages/header/header';
import { Navbar } from '@components/pages/navbar/navbar';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  imports: [
    RouterOutlet,
    Header,
    Navbar,
    Footer,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

}
