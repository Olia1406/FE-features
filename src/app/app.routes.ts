import { Routes } from '@angular/router';
import { LoginComponent } from './components/authentication/login/login.component';
import { RegistrationComponent } from './components/authentication/registration/registration.component';
import { CommonComponent } from './components/common/common.component';
import { InfoComponent } from './components/user/user-info/info.component';
import { ProductsDetailsComponent } from './components/products-details/products-details.component';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { AdminComponent } from './components/user/admin/admin.component';
import { authGuard, isAdminGuard, isNotLogginedGuard } from './core/guards';
import { GeneralComponent } from './components/general/general.component';
import { localizationInfoResolver } from './modules/localization/localization-info.resolver';

export const routes: Routes = [
  {
    path: '',
    resolve: { localization: localizationInfoResolver },
    component: GeneralComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
        // canActivate: [isNotLogginedGuard],
      },
      {
        path: 'register',
        component: RegistrationComponent,
        // canActivate: [isNotLogginedGuard],
      },
      { path: 'products', component: ProductsListComponent },
      { path: 'products/:id', component: ProductsDetailsComponent },
      {
        path: 'user',
        component: CommonComponent,
        canActivate: [authGuard],
        children: [
          { path: 'info', component: InfoComponent },
          {
            path: '',
            component: AdminComponent,
            canActivate: [isAdminGuard],
          },
        ],
      },
      { path: '', pathMatch: 'full', component: ProductsListComponent },
    ],
  },
];
