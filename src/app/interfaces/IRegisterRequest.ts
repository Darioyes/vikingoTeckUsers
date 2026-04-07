export interface IRegisterRequest {
  name: string;
  lastname: string;
  email: string;
  gender: string;
  birthday?: string | Date;
  phone1: string;
  phone2?: string;
  address?: string;
  image?: File;
  password: string;
  password_confirmation: string;
  cities_id?: number | string;
  acceptTerms: boolean;
}

export interface IRegisterResponse {
  response: string;
  message:  string;
  error:    boolean;
  errors?:  { [key: string]: string[] };
  errorVikingo?:IErrorVikingo;
}

export interface IErrorVikingo {
    error?:boolean;
    message?:string;
    response?:string;
    errors?: { [key: string]: string[] };
}