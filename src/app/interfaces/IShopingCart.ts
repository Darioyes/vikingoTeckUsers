export interface IShopingCartRequest {
    _method: string;
    product_id: number;
    user_id: number;
    amount: number;
}

export interface IShopingCartResponse {
  response: string;
  message:  string;
  data:     IShopingCartData[];
  error:    boolean;
  errors?:  { [key: string]: string[] };
  errorVikingo?:IErrorVikingo;
}

export interface IShopingCartData {
  id: number;
  amount: number;
  user_id: number;
  product_id: number;
  product: Product;
  user: User;
}


export interface Product {
  id:                     number;
  name:                   string;
  slug:                   string;
  reference:              null |string;
  barcode:                null |string;
  description:            string;
  stock:                  number;
  sale_price:             string;
  visible:                null |string;
  image1:                 string;
  image2:                 null | string;
  image3:                 null | string;
  image4:                 null | string;
  image5:                 null | string;
  color?:                  string;
}

export interface User {
  id:                number;
  name:              string;
  email:             string;
}

export interface IErrorVikingo {
  error?:boolean;
  message?:string;
  response?:string;
  errors?: { [key: string]: string[] };
}