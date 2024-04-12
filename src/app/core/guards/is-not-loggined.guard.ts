import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';

export const isNotLogginedGuard: CanActivateFn = (route, state) => {
  return inject(AuthService)
    .isLoggined()
    .pipe(
      map((isLog) =>  !isLog),
    );
};
