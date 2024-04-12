import { Routes } from '@angular/router';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { ProductsDetailsComponent } from './components/products-details/products-details.component';
import { InfoComponent } from './components/info/info.component';
import { UserComponent } from './components/user/user.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { RegistrationComponent } from './components/authentication/registration/registration.component';
import { authGuard } from './core/guards/auth.guard';
import { isAdminGuard } from './core/guards/is-admin.guard';
import { CommonComponent } from './components/common/common.component';
import { isNotLogginedGuard } from './core/guards/is-not-loggined.guard';

// export const routes: Routes = [
//     { path: '', pathMatch: 'full', component: ProductsListComponent },
//     { path: 'products', component: ProductsListComponent },
//     { path: 'products/:id', component: ProductsDetailsComponent },
//     { path: 'info', component: InfoComponent, canActivate: [authGuard] },
//     { path: 'user', component: UserComponent, canActivate: [authGuard, isAdminGuard] },
//     { path: 'login', component: LoginComponent },
//     { path: 'register', component: RegistrationComponent },
// ];

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [isNotLogginedGuard] },
  { path: 'register', component: RegistrationComponent, canActivate: [isNotLogginedGuard]  },
  { path: 'products', component: ProductsListComponent},
  { path: 'products/:id', component: ProductsDetailsComponent },
  {
    path: 'user',
    component: CommonComponent,
    canActivate: [authGuard],
    children: [
      { path: 'info', component: InfoComponent },
      {
        path: '',
        component: UserComponent,
        canActivate: [isAdminGuard],
      },
    ],
  },
  { path: '', pathMatch: 'full', component: ProductsListComponent },
];
