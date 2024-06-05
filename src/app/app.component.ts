import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListItem, MatListModule, MatNavList } from '@angular/material/list';

import { ProductsService } from './core/services/products.service';
import { EX_TOKEN } from './shared/example-token';
import { Product } from './shared/interfaces/product.interface';
import { UsersService } from './core/services/users.service';
import { PortalModule, TemplatePortal } from '@angular/cdk/portal';
import { AuthService } from './core/services/auth.service';
import { Observable, delay, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CartPortalService } from './modules/cart-portal/cart-portal.service';
import { MatMenuModule } from '@angular/material/menu';
import { LocalizationModule } from './modules/localization/localization.module';
import { LocalizationService } from './modules/localization';
import { LANGUAGES } from './modules/localization/constants';
import {
  MessagePortalModule,
} from './modules/message-portal';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,

    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatListItem,
    MatMenuModule,
    MatNavList,
    MatButtonModule,
    RouterModule,
    PortalModule,

    LocalizationModule,
    MessagePortalModule,
  ],
  providers: [
    ProductsService,
    UsersService,
    {
      provide: EX_TOKEN,
      useClass: ProductsService,
    },
    {
      provide: 'URL_TOKEN',
      useValue: 'http://localhost:4200/',
    },
    {
      provide: 'def-sort-field',
      useValue: {
        sort: (
          sortType: 'asc' | 'desc',
          a: Product,
          b: Product,
          sortFld: keyof Product = 'price',
        ) => {
          const pa = a[sortFld];
          const pb = b[sortFld];
          const order = sortType === 'asc' ? 1 : -1;
          return (pa > pb ? 1 : pa < pb ? -1 : 0) * order;
        },
      },
    },
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'FE-features';
  isAdmin$: Observable<boolean>;
  isLogginedUser$: Observable<boolean>;
  cartPortal$!: Observable<TemplatePortal | null>;
  languages: { name: string; shortcut: string }[];
  userData: any;

  constructor(
    private autServ: AuthService,
    private cartPortalServ: CartPortalService,
    private userServ: UsersService,
    private router: Router,
    private localizationServ: LocalizationService,
    private ref: ChangeDetectorRef,
  ) {
    this.isAdmin$ = this.autServ.isAdmin$;
    this.cartPortal$ = this.cartPortalServ.cartPortal$.pipe(delay(100));
    this.isLogginedUser$ = this.userServ.isLogginedUser$;
    this.languages = LANGUAGES;
    this.userData = this.autServ.userData;
  }

  ngOnInit() {}

  loguot() {
    this.userServ.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  selectLanguage(language: { name: string; shortcut: string }) {
    this.localizationServ.setLanguage(language.shortcut);
    this.localizationServ.getTranslationMap(language.shortcut).pipe(
      tap(() => {
        this.ref.markForCheck();
      }),
    );
  }
}
