import { Routes } from '@angular/router';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { ProductsDetailsComponent } from './components/products-details/products-details.component';
import { InfoComponent } from './components/info/info.component';
import { UserComponent } from './components/user/user.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { RegistrationComponent } from './components/authentication/registration/registration.component';
import { authGuard } from './core/guards/auth.guard';
import { isAdminGuard } from './core/guards/is-admin.guard';

export const routes: Routes = [
    { path: '', pathMatch: 'full', component: ProductsListComponent },
    { path: 'products', component: ProductsListComponent },
    { path: 'products/:id', component: ProductsDetailsComponent },
    { path: 'info', component: InfoComponent, canActivate: [authGuard] },
    { path: 'user', component: UserComponent, canActivate: [isAdminGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegistrationComponent },
];
