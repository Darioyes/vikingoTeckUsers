import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@enviroments/environment.development';
import { IMaintenance } from '@interfaces/IMaintenance';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class maintenanceService {

  #cookieService = inject(CookieService);
  
  #url = environment.domain;
  #http = inject(HttpClient);

  public getOneMaintenance(id: number):Observable<IMaintenance> {
    const token = this.#cookieService.get('token');
    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    return this.#http.get<IMaintenance>(`${this.#url}vikingousers/maintenances/${id}`, { headers });
  }
  
}
