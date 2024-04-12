import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, tap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  return inject(AuthService)
    .isLoggined()
    .pipe(
      map((isLog) => {
        if (!isLog) {
          return router.createUrlTree(['/login']);
        } else {
          return isLog
        }
      }),
    );
};
