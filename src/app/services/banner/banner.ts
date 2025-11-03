import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@enviroments/environment.development';
import { ICarousel, ICarouselResponse } from '@interfaces/ICarousel';
import { map, Observable } from 'rxjs';

@Injectable()
export class Banner {

  #url = environment.domain;
  #http = inject(HttpClient);

   getBanners():Observable<ICarousel[]>{
    const headers = {
      'Accept': 'application/json',
    };
   return this.#http
      .get<ICarouselResponse>(`${this.#url}vikingousers/carousel`, { headers })
      .pipe(
        map(resp =>
          resp.data.filter((item: ICarousel) => item.carousel === 'active')
        )
      );
    }
  
}
