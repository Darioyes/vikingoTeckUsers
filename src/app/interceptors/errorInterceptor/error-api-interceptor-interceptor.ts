import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorApiInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse)  => {
      let errorMessage = 'Algo ha ocurrido mal, por favor intentalo de nuevo';
      let errorVikingo ='true';

      if (error.status === 400 && error.error && error.error.errors) {
        errorMessage = error.error.message;
        errorVikingo = error.error.errorVikingo;
      }else{
        errorMessage = error.error;
        errorVikingo = error.error;
      }

      return throwError(() =>  ({
        message: errorMessage,
        //errors: error.error,
        errorVikingo: errorVikingo
      }));
    })
  );
};
