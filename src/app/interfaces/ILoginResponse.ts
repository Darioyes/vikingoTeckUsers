export interface ILogin{
  email: string;
  password: string;
}

export interface ILoginResponse {
  response: string;
  message:  string;
  token:    string;
  data:     IUserData;
  error:    boolean;
  errors?:  { [key: string]: string[] };
  errorVikingo?:IErrorVikingo;
}

export interface IUserData {
  id:                number;
  status:            string;
  name:              string;
  lastname:          string;
  email:             string;
  gender:            string;
  birthday:          string;
  phone1:            string;
  phone2:            string;
  address:           string;
  image:             string;
  email_verified_at: string;
  created_at:        string;
  updated_at:        string;
  cities_id:         number;
  vikingo_roles_id:  number;
}

export interface IErrorVikingo {
    error?:boolean;
    message?:string;
    response?:string;
    errors?: { [key: string]: string[] };
}