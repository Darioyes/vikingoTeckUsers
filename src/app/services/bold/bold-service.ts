import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@enviroments/environment.development';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { IBoldCheckoutConfig } from '@interfaces/IBoldCheckoutConfig';
import { IkeyBoldRequest, IKeyBoldResponse } from '@interfaces/IKeyBold';

@Injectable({
  providedIn: 'root'
})
export class BoldService {
  #url = environment.domain;
  #http = inject(HttpClient);
  #cookieService = inject(CookieService);

  private scriptLoaded = false;

  // 🔥 Cargar script UNA sola vez
  loadScript(): Promise<void> {
    return new Promise((resolve) => {

      if (this.scriptLoaded || document.querySelector('script[src*="boldPaymentButton"]')) {
        this.scriptLoaded = true;
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://checkout.bold.co/library/boldPaymentButton.js';
      script.async = true;

      script.onload = () => {
        this.scriptLoaded = true;
        resolve();
      };

      document.body.appendChild(script); // 🔥 FALTABA ESTO
    });
  }

  renderButtonElement(
    container: HTMLElement,
    config: {
      apiKey: string;
      amount: number;
      currency?: string;
      orderId?: string;
      description?: string;
      customerData?: {
        email?: string;
        fullName?: string;
      };
      buttonStyle?: string;
      integritySignature?: string;
    }
  ) {
    if (!container) return;

    container.innerHTML = '';

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://checkout.bold.co/library/boldPaymentButton.js';

    script.setAttribute('data-bold-button', config.buttonStyle || 'light-M');
    script.setAttribute('data-api-key', config.apiKey);
    script.setAttribute('data-amount', config.amount.toString());
    script.setAttribute('data-render-mode',"embedded");

    if (config.currency) {
      script.setAttribute('data-currency', config.currency);
    }

    if (config.orderId) {
      script.setAttribute('data-order-id', config.orderId);
    }

    if (config.description) {
      script.setAttribute('data-description', config.description);
    }

    if (config.customerData) {
      script.setAttribute(
        'data-customer-data',
        JSON.stringify(config.customerData)
      );
    }

    if (config.integritySignature) {
      script.setAttribute(
        'data-integrity-signature',
        config.integritySignature
      );
    }

    container.appendChild(script);
  }

  getSignatureBold(data:IkeyBoldRequest): Observable<IKeyBoldResponse>{
      const token = this.#cookieService.get('token');
      const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    return this.#http.post<IKeyBoldResponse>(`${this.#url}bold/signature`, data, { headers }); 
  }

  buildBoldConfig(base: IBoldCheckoutConfig): any {

    const config: any = {
      orderId: base.orderId,
      currency: base.currency,
      amount: base.amount,
      apiKey: base.apiKey,
      integritySignature: base.integritySignature
    };

    if (base.description) config.description = base.description;
    if (base.tax) config.tax = base.tax;
    if (base.originUrl) config.originUrl = base.originUrl;
    if (base.redirectionUrl) config.redirectionUrl = base.redirectionUrl;
    if (base.expirationDate) config.expirationDate = base.expirationDate;
    if (base.renderMode) config.renderMode = base.renderMode;

    if (base.customerData) {
      config.customerData = JSON.stringify(base.customerData);
    }

    if (base.billingAddress) {
      config.billingAddress = JSON.stringify(base.billingAddress);
    }

    if (base.extraData1) config.extraData1 = base.extraData1;
    if (base.extraData2) config.extraData2 = base.extraData2;

    return config;
  }

  public createOrder(data: any): Observable<any> {
    const token = this.#cookieService.get('token');
    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    return this.#http.post<any>(`${this.#url}bold/create-order`, data, { headers }); 
  }
}


