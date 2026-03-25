export interface ICarouselResponse {
  response: string;
  message: string;
  data: ICarousel[];
  error: boolean;
}
export interface IProduct {
  id: number;
  name: string;
  description: string;
  slug: string;
  stock: number;
  sale_price: string;
  image1: string;
}

export interface ICarousel {
  id: number;
  carousel: 'active' | 'inactive'; // Muchas mejoras de autocomplete 😎
  order: number;
  image: string | null;
  image2: string | null;
  image3?: string | null;
  created_at?: string;
  updated_at?: string;
  product_id: number;
  product: IProduct;
}


