export interface ISalesRequest {
  description:   string;
  amount:        number;
  confirm_sale:  string;
  shopping_cart: string;
  user_id:       number;
  product_id:    number;
}

export interface ISalesResponse {
  response:      string;
  message:       string;
  data:          Sale[];
  error:         boolean;
  errors?:  { [key: string]: string[] };
  errorVikingo?:IErrorVikingo;
}

export interface Sale {
  id:            number;
  description:   string;
  amount:        number;
  confirm_sale:  string;
  shopping_cart: string;
  created_at:    string;
  updated_at:    string;
  user_id:       number;
  product_id:    number;
  cost_total:    string;
  product:       Product;
}

export interface Product {
  id:            number;
  name:          string;
  slug:          string;
  sale_price:    string;
  image1:        string;
}

export interface IErrorVikingo {
  error?:boolean;
  message?:string;
  response?:string;
  errors?: { [key: string]: string[] };
}