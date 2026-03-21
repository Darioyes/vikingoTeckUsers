export interface IResetPassword{
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
}


export interface IResetPasswordResponse {
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