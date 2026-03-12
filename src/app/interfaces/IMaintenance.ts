export interface IMaintenance {
  response: string;
  message: string;
  data: IMaintenanceItem[];
  error: boolean;
  errors?: { [key: string]: string[] };
  errorVikingo?: IErrorVikingo;
}

export interface IMaintenanceItem {
  id: number;
  product: string;
  description: string;
  reference: string;
  price: string;
  cost_price: string;
  delivery_date: string;
  image1: string | null;
  image2: string | null;
  image3: string | null;
  image4: string | null;
  advance: string;
  created_at: string;
  updated_at: string;
  repaired: string; // Viene como "false" o "true"
  warranty: string;
  users_id: number;
}

export interface IErrorVikingo {
  error?: boolean;
  message?: string;
  response?: string;
  errors?: { [key: string]: string[] };
}
