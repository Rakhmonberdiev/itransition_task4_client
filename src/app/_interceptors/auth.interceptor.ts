import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CurrentUserService } from '../_services/current-user.service';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const currentUserService = inject(CurrentUserService);
  const router = inject(Router);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (
        (error.status === 401 || error.status === 403) &&
        currentUserService.isAuthenticated()
      ) {
        currentUserService.setUser(null);
        router.navigateByUrl('/login');
      }
      return throwError(() => error);
    })
  );
};
