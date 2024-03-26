import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListItem, MatListModule, MatNavList } from '@angular/material/list';

import { ProductsService } from './core/services/products.service';
import { EX_TOKEN } from './shared/example-token';
import { Product } from './shared/interfaces/product.interface';
import { UsersService } from './core/services/users.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatListItem,
    MatNavList,
    MatButtonModule,
    RouterModule
  ],
  providers: [
    ProductsService,
    UsersService,
    {
      provide: EX_TOKEN,
      useClass: ProductsService
    },
    {
      provide: 'URL_TOKEN',
      useValue: 'http://localhost:4200/'
    },
    {
      provide: 'def-sort-field',
      useValue: {
        sort: (sortType: 'asc' | 'desc', a: Product, b: Product, sortFld: keyof Product = 'price') => {
          const pa = a[sortFld];
          const pb = b[sortFld];
          const order = sortType === 'asc' ? 1 : -1;
          return (pa > pb ? 1 : (pa < pb ? -1 : 0)) * order;
        },
      }
    },
    // {
    // provide: ProductsService, // пр  обєкт
    // useClass: AuthGoogleService  //пр
    // підміна сервісів, але з одинаоквими методами
    // },
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'FE-features';

  constructor() { }
}
