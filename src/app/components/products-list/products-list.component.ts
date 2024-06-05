import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Injector,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  afterNextRender,
} from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';

import { ProductsService } from '../../core/services/products.service';
import { Product } from '../../shared/interfaces/product.interface';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { PRODUCT_CATEGORIES } from '../../shared/constants';
import { fullImageSrc } from '../../shared/helpers/fullImageSrc';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  switchMap,
  tap,
} from 'rxjs/operators';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  fromEvent,
  of,
} from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { EX_TOKEN } from '../../shared/example-token';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { CartPortalService } from '../../modules/cart-portal/cart-portal.service';
import { TemplatePortal } from '@angular/cdk/portal';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { getTotalPrice } from '@shared/helpers/getTotalSum';
import { OrderComponent } from '../order/order.component';
import { OrdersService } from '@services/orders.service';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatListModule,
    MatMenuModule,
    MatDialogModule,
  ],
  providers: [],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss',
})
export class ProductsListComponent implements OnInit, OnDestroy {
  @ViewChild('descriptionSearch', { static: true, read: ElementRef })
  descriptionSearch!: ElementRef;
  @ViewChild('matSelect', { static: true })
  matSelect!: MatSelect;
  @ViewChild('cartPortalContent', { static: true }) cartPortalContent: any;

  products$!: Observable<Product[]>;
  categoriesForm = this.fb.group({});
  categories = PRODUCT_CATEGORIES;
  searchControl: FormControl = this.fb.control('');
  sortSubject = new BehaviorSubject('asc');

  description = '';
  sort = 'asc';
  name = '';

  wishList: (Product & { qty: number })[] = [];
  getTotalPrice: (prodList: (Product & { qty: number })[]) => number;

  constructor(
    @Inject('def-sort-field') private sortField: any,
    @Inject(EX_TOKEN) private prodServ: ProductsService,
    private orderServ: OrdersService,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private chdtRef: ChangeDetectorRef,
    private cartPortalServ: CartPortalService,
    private viewContRef: ViewContainerRef,
    public dialog: MatDialog,
  ) {
    this.initDynamicCategoriesForm();
    afterNextRender(() => {
      if (localStorage) {
        this.wishList = this.orderServ.getLocalWishList();
      }
    });
    this.getTotalPrice = getTotalPrice;
  }

  ngOnInit(): void {
    // ====================== NOTE: work with cart portal ============================
    const cartPortal = new TemplatePortal(
      this.cartPortalContent,
      this.viewContRef,
    );
    this.cartPortalServ.setCartPortal(cartPortal as TemplatePortal);
    // this.portalContent.attach();
    // ====================== END: work with cart portal ============================

    // ================== NOTE: getting and filtering product data ===================
    let isInitialCall = true;
    this.products$ = this.activatedRoute.queryParams.pipe(
      map((qParams) => {
        return {
          category: qParams['category'] || '',
          prodName: qParams['prodName'],
          description: qParams['description'],
          sortType: qParams['sortType'] || 'asc',
        };
      }),
      tap((qParams) => {
        // this.searchControl.setValue(qParams.prodName);
        // this.descriptionSearch.nativeElement.value = qParams.description;
        // this.matSelect.value = qParams.sortType;
        if (isInitialCall) {
          this.sort = qParams.sortType;
          this.description = qParams.description;
          this.name = qParams.prodName;
          const selectedCat = qParams.category
            .split(',')
            .reduce((acc: any, category: string) => {
              acc[category] = true;
              return acc;
            }, {});
          this.categoriesForm.patchValue(selectedCat || {});
          this.chdtRef.detectChanges();
          isInitialCall = false;
        }
      }),
      switchMap((qParams: any) => {
        return this.prodServ.getItems(qParams.category).pipe(
          map((products) =>
            qParams.description
              ? products.filter((prod: any) =>
                  prod.description
                    .toLowerCase()
                    .includes(qParams.description?.toLowerCase()),
                )
              : products,
          ),
          map((products) =>
            qParams.prodName
              ? products.filter((prod: any) =>
                  prod.name
                    .toLowerCase()
                    .includes(qParams.prodName?.toLowerCase()),
                )
              : products,
          ),
          map((products) =>
            products.sort((a: any, b: any) =>
              this.sortField.sort(qParams.sortType, a, b),
            ),
          ),
          catchError((err) => {
            return of([]);
          }),
        );
      }),
    );
    this.categoriesForm.valueChanges
      .pipe(
        map((categories) => {
          return Object.entries(categories)
            .filter((entry) => entry[1])
            .map((entry) => entry[0]);
        }),
        map((valArr) => valArr.join(',')),
      )
      .subscribe((valueStr) => {
        this.setQueryParams({ category: valueStr });
      });
    // =================== END: getting and filtering product data ===================
  }

  onChange(paramName: string, value: string) {
    this.setQueryParams({ [paramName]: value });
  }

  setQueryParams(queryParams = {}) {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }

  initDynamicCategoriesForm() {
    this.categories.forEach((category) => {
      this.categoriesForm.addControl(category, this.fb.control(false));
    });
  }

  onSortTypeSelection(event: any) {
    this.sortSubject.next(event.value);
  }

  getDetails(product: Product) {
    this.prodServ.getProduct(product._id as string).subscribe((details) => {
      console.log(details);
    });
  }

  getImageSrc(imagePath: string): string {
    return fullImageSrc(imagePath);
  }

  addToCart(product: Product) {
    this.orderServ.setLocalWishList(product);
    this.wishList = this.orderServ.getLocalWishList();
  }

  confirmOrder() {
    const wishListShortInfo = this.wishList.map(({ _id, qty }) => ({
      _id,
      qty,
    }));
    this.dialog.open(OrderComponent, {
      data: wishListShortInfo,
    });
  }

  ngOnDestroy(): void {
    this.cartPortalServ.close();
  }

  // =============== NOTE: get product stream prev version ==============
  // getProdStream() {
  //   const categoryFilterStream$ = this.categoriesForm.valueChanges.pipe(
  //     startWith(this.categoriesForm.value),
  //     map((categories) => {
  //       return Object.entries(categories)
  //         .filter((entry) => entry[1])
  //         .map((entry) => entry[0]);
  //     }),
  //     switchMap((categoryQueryArr) => {
  //       // return this.prodServ.getProductsList(categoryQueryArr); // becouse of changes in the servise
  //       return this.prodServ.getItems(categoryQueryArr.join(','));
  //     }),
  //   );

  //   const descriptionStream$ = fromEvent(
  //     this.descriptionSearch.nativeElement,
  //     'input',
  //   ).pipe(
  //     debounceTime(500),
  //     distinctUntilChanged(),
  //     startWith(this.descriptionSearch.nativeElement?.target?.value),
  //     map((inputEvent: any) => inputEvent?.target?.value || ''),
  //   );

  //   const nameSearchStream$: Observable<string> =
  //     this.searchControl.valueChanges.pipe(
  //       debounceTime(500),
  //       distinctUntilChanged(),
  //       startWith(this.searchControl.value),
  //     );

  //   const sortPriceStream$ = this.sortSubject;

  //   const searches$ = combineLatest([
  //     descriptionStream$,
  //     nameSearchStream$,
  //     sortPriceStream$,
  //   ]);

  //   this.products$ = combineLatest([categoryFilterStream$, searches$]).pipe(
  //     tap(([products, [descrSearch, nameSearch, sortOrder]]) =>
  //       console.log(products, descrSearch, nameSearch, sortOrder),
  //     ),
  //     map(([products, [descrSearch, nameSearch, sortOrder]]) =>
  //       products
  //         .filter(
  //           (prod: any) =>
  //             prod.description
  //               .toLowerCase()
  //               .includes((descrSearch as string).toLowerCase()) &&
  //             prod.name.toLowerCase().includes(nameSearch.toLowerCase()),
  //         )
  //         .sort((a: any, b: any) => this.sortField.sort(sortOrder, a, b)),
  //     ),
  //   );
  // }
  // =============== END: get product stream prev version ==============

  // urlSetsFromStreams() {
  // const categoryStream$ = this.categoriesForm.valueChanges.pipe(
  //   startWith(this.categoriesForm.value),
  //   map((categories) => {
  //     return Object.entries(categories)
  //       .filter((entry) => entry[1])
  //       .map((entry) => entry[0]);
  //   }),
  //   map((valArr) => valArr.join(',')),
  // );

  // const descriptionStream$ = fromEvent(
  //   this.descriptionSearch.nativeElement,
  //   'input',
  // ).pipe(
  //   debounceTime(500),
  //   distinctUntilChanged(),
  //   startWith(this.descriptionSearch.nativeElement.value || ''),
  //   map((inputEvent: any) => ((inputEvent?.target?.value as string ?? this.activatedRoute.snapshot.queryParamMap.get('description'))) || ''),
  // );

  // const nameSearchStream$: Observable<string> =
  //   this.searchControl.valueChanges.pipe(
  //     debounceTime(500),
  //     distinctUntilChanged(),
  //     startWith(this.searchControl.value)
  //     );

  // const sortPriceStream$ = this.sortSubject;
  // this.sortSubject.next(this.matSelect.value);

  // combineLatest([
  //   categoryStream$,
  //   descriptionStream$,
  //   nameSearchStream$,
  //   sortPriceStream$,
  // ]).subscribe(([category, description, prodName, sortType]) => {
  //   console.log([category, description, prodName, sortType])
  //   this.setQueryParams({
  //     category: category || null,
  //     description,
  //     prodName,
  //     sortType,
  //   });
  // });
  // this.products$ = this.activatedRoute.queryParams.pipe(
  //   switchMap((qParams: any) => {
  //     return this.prodServ
  //       .getProductsList(qParams.category)
  //       .pipe(
  //         map((products) =>
  //           products
  //             .filter(
  //               (prod: any) =>
  //                 prod.description
  //                   .toLowerCase()
  //                   .includes(qParams.description?.toLowerCase()) &&
  //                 prod.name
  //                   .toLowerCase()
  //                   .includes(qParams.prodName.toLowerCase()),
  //             )
  //             .sort((a: any, b: any) =>
  //               this.sortField.sort(qParams.sortType, a, b),
  //             ),
  //         ),
  //       );
  //   }),
  // );
  // }

  // NOTE: the first version of one stream 

  // this.products$ = this.categoriesForm.valueChanges.pipe(
  //   startWith(this.categoriesForm.value),
  //   map((categories) => {
  //     console.log('categories');
  //     return Object.entries(categories)
  //       .filter((entry) => entry[1])
  //       .map((entry) => entry[0]);
  //   }),
  //   // tap(res => console.log(res)),
  //   switchMap((categoryQueryArr) => {
  //     console.log('categoryQueryArr');
  //     return this.prodServ.getProductsList(categoryQueryArr);
  //   }),
  //   switchMap((products: Product[]): Observable<Product[]> => {
  //     return this.searchControl.valueChanges.pipe(
  //       startWith(this.searchControl.value),
  //       map((searchVal: string): Product[] => {
  //         console.log('searchVal', searchVal);
  //         return products.filter((prod) =>
  //           prod.name.toLowerCase().includes(searchVal.toLowerCase()),
  //         );
  //       }),
  //     );
  //   }),
  //   switchMap((products: Product[]): Observable<Product[]> => {
  //     return this.sortSubject.pipe(
  //       map((order: string) => {
  //         console.log('order');
  //         return products.sort((a, b) => this.sortField.sort(order, a, b));
  //       }),
  //     );
  //   }),
  //   switchMap((products: Product[]): Observable<Product[]> => {
  //     return descriptionStream$.pipe(
  //       debounceTime(500),
  //       distinctUntilChanged(),
  //       startWith(this.descriptionSearch.nativeElement?.target?.value),
  //       map((inputEvent: any) => inputEvent?.target?.value || ''),
  //       shareReplay(1),
  //       // startWith(''),
  //       map((searchVal) => {
  //         console.log('description', searchVal);
  //         console.log('products', products);
  //         // return products.sort((a, b) => this.sortField.sort(value, a, b, 'name'))
  //         return products.filter((prod) =>
  //           prod.description.toLowerCase().includes(searchVal.toLowerCase()),
  //         );
  //       }),
  //     );
  //   }),
  // );
}
