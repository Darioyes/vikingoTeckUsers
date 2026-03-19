export interface ICitiesResponse {
  response: string;
  message: string;
  data: ICities[];
  error: boolean;
  errors?: { [key: string]: string[] };
  errorVikingo?: IErrorVikingo;
}

export interface ICities {
  id: number;
  city: string;
  created_at: string;
  updated_at: string;
}

export interface IErrorVikingo {
  error?: boolean;
  message?: string;
  response?: string;
  errors?: { [key: string]: string[] };
}
