import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@enviroments/environment.development';
import { ICitiesResponse } from '@interfaces/ICities';
import { Observable } from 'rxjs';

@Injectable()
export class CitiesService {
    #url = environment.domain;
    #http = inject(HttpClient)

  public getCities():Observable<ICitiesResponse> {
    const headers = {
      'Accept': 'application/json',
    };

    return this.#http.get<ICitiesResponse>(`${this.#url}vikingousers/cities`, { headers });
  }
}
