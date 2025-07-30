import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { CurrentUserService } from '../_services/current-user.service';

function guardFactory(
  requireAuth: boolean,
  redirectPath: string
): CanActivateFn {
  return (): boolean | UrlTree => {
    const currentUser = inject(CurrentUserService).isAuthenticated();
    if (currentUser !== requireAuth) {
      return inject(Router).createUrlTree([redirectPath]);
    }
    return true;
  };
}
export const authGuard = guardFactory(true, '/login');
export const guestGuard = guardFactory(false, '/');
