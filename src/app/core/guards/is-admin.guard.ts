import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const isAdminGuard: CanActivateFn = (route, state) => {
  let loginServ = inject(AuthService);
  console.log(loginServ.isLoggined(), loginServ.isAdmin)
  return loginServ.isLoggined() && loginServ.isAdmin
};
