export interface IkeyBoldRequest{
    orderId: string;
    amount: string;
    currency: string;
}

export interface IKeyBoldResponse{
    response: string;
    message: string;
    data: IData,
    error:string;
    errors?: { [key: string]: string[] };
    errorVikingo?: IErrorVikingo;
}

export interface IData{
    signature: string;
}

export interface IErrorVikingo {
  error?: boolean;
  message?: string;
  response?: string;
  errors?: { [key: string]: string[] };
}