import { NgClass } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '@enviroments/environment.development';
import { ICarousel } from '@interfaces/ICarousel';
import { Banner } from '@services/banner/banner';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-carousel',
  imports: [
    MatIconModule,
    NgClass,
    MatButtonModule
  ],
  templateUrl: './carousel.html',
  styleUrl: './carousel.scss',
})
export class Carousel implements OnInit, OnDestroy {

  #bannerService = inject(Banner);
  #unsubscribe!: Subscription;

  public urlImage = environment.domainimage;
  public banners = signal<ICarousel[]>([]);
  public currentIndex = signal(0);
  public isAnimating = signal(false);
  private intervalId: any;

  ngOnInit(): void {
    this.getBanners();
    this.intervalId = setInterval(() => {
      this.next();
  }, 10000); // 10 segundos
  }

  ngOnDestroy(): void {
    if(this.#unsubscribe){
      this.#unsubscribe.unsubscribe();
    }
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  getBanners():void {
    this.#bannerService.getBanners().subscribe({
      next: (response) => {
        console.log(response);
      
        const sorted = response.sort((a, b) => a.order - b.order);
        this.banners.set(sorted);
        
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  next(): void {
    const total = this.banners().length;
    this.animateChange(() => {
      this.currentIndex.update(i => (i + 1) % total);
    });
  }

  prev(): void {
    const total = this.banners().length;
    this.animateChange(() => {
      this.currentIndex.update(i => (i - 1 + total) % total);
    });
  }

  animateChange(changeFn: () => void): void {
    this.isAnimating.set(true);

    // Primero desvanecemos la imagen actual
    setTimeout(() => {
      changeFn(); // Aquí se cambia la imagen

      // Luego activamos fade-in
      setTimeout(() => {
        this.isAnimating.set(false);
      }, 50); // Un pequeño retraso para permitir reflow
    }, 300); // Tiempo del fade-out
  }

  pauseCarousel(): void {
  if (this.intervalId) {
    clearInterval(this.intervalId);
    this.intervalId = null;
  }
}

resumeCarousel(): void {
  if (!this.intervalId) {
    this.intervalId = setInterval(() => {
      this.next();
    }, 10000);
  }
}

}
