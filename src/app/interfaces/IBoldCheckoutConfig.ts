export interface IBoldCheckoutConfig {
  orderId: string;
  currency: string;
  amount: string;
  apiKey: string;
  integritySignature: string;

  description?: string;
  tax?: string;
  originUrl?: string;
  redirectionUrl?: string;
  expirationDate?: number;
  renderMode?: 'embedded' | 'redirect';

  customerData?: any;
  billingAddress?: any;

  extraData1?: string;
  extraData2?: string;
}