export interface ProductResponse {
  response: string;
  message: string;
  data: PaginatedData;
  error: boolean;
  errors?: { [key: string]: string[] };
  errorVikingo?: IErrorVikingo;
}

export interface Product {
  id:                     number;
  name:                   string;
  slug:                   string;
  reference:              null |string;
  barcode:                null |string;
  description:            string;
  stock:                  string;
  sale_price:             string;
  cost_price:             string;
  visible:                null |string;
  image1:                 string;
  image2:                 null | string;
  image3:                 null | string;
  image4:                 null | string;
  image5:                 null | string;
  color?:                  string;
  created_at:             string;
  updated_at:             string;
  categories_products_id: number;
  amount: number; // Agregamos la propiedad amount para manejar la cantidad en el carrito de compras
}

export interface PaginatedData {
  current_page: number;
  data: Product[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Link[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface Link {
  url: string | null;
  label: string;
  active: boolean;
}

export interface IErrorVikingo {
  error?: boolean;
  message?: string;
  response?: string;
  errors?: { [key: string]: string[] };
}
