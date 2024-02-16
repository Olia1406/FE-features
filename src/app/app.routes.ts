import { Routes } from '@angular/router';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { ProductsDetailsComponent } from './components/products-details/products-details.component';
import { InfoComponent } from './components/info/info.component';
import { UserComponent } from './components/user/user.component';

export const routes: Routes = [
    { path: '', pathMatch: 'full', component: ProductsListComponent },
    { path: 'products', component: ProductsListComponent },
    { path: 'products/:id', component: ProductsDetailsComponent },
    { path: 'info', component: InfoComponent },
    { path: 'user', component: UserComponent },
];
