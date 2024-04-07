import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MatSnackBar
} from '@angular/material/snack-bar';


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
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  switchMap,
  tap,
} from 'rxjs/operators';
import { BehaviorSubject, Observable, combineLatest, fromEvent } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { EX_TOKEN } from '../../shared/example-token';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
// import { CustomModalService } from '../../shared/custom modal/custom-modal.service';

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
  ],
  templateUrl: './products-list-form.component.html',
  styleUrl: './products-list.component.scss',
})
export class ProductsListComponent implements OnInit {
  @ViewChild('descriptionSearch', { static: true, read: ElementRef })
  descriptionSearch!: ElementRef;
  @ViewChild('matSelect', { static: true })
  matSelect!: MatSelect;

  products$!: Observable<Product[]>;
  categoriesForm = this.fb.group({});
  categories = PRODUCT_CATEGORIES;
  searchControl: FormControl = this.fb.control('');
  sortSubject = new BehaviorSubject('asc');

  description = '';
  sort = 'asc';
  name = '';

  constructor(
    @Inject('def-sort-field') private sortField: any,
    @Inject(EX_TOKEN) private prodServ: ProductsService,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private chdtRef: ChangeDetectorRef,
    private authServ: AuthService,
    private snackBar: MatSnackBar,
    // private custModalServ: CustomModalService
  ) {
    this.initDynamicCategoriesForm();
  }

  ngOnInit(): void {
    // this.custModalServ.show()

    let isInitialCall = true;
    this.getUser();

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
        console.log(qParams);
        return this.prodServ.getProductsList(qParams.category).pipe(
          map((products) =>
            qParams.description
              ? products.filter((prod: any) =>
                  prod.description
                    .toLowerCase()
                    .includes(qParams.description.toLowerCase()),
                )
              : products,
          ),
          map((products) =>
            qParams.prodName
              ? products.filter((prod: any) =>
                  prod.name
                    .toLowerCase()
                    .includes(qParams.prodName.toLowerCase()),
                )
              : products,
          ),
          map((products) =>
            products.sort((a: any, b: any) =>
              this.sortField.sort(qParams.sortType, a, b),
            ),
          ),
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
  }

  getUser() {
    this.authServ.getUserInfo().subscribe({
      next: (user) => console.log('user', user),
      // error: (err) => this.snackBar.open('wrroongggg', 'x')
      error: (err) => console.log('err.message')
    })
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
    // console.trace('this.setQueryParams', queryParams);
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

  getProdStream() {
    const categoryFilterStream$ = this.categoriesForm.valueChanges.pipe(
      startWith(this.categoriesForm.value),
      map((categories) => {
        return Object.entries(categories)
          .filter((entry) => entry[1])
          .map((entry) => entry[0]);
      }),
      switchMap((categoryQueryArr) => {
        // return this.prodServ.getProductsList(categoryQueryArr); // becouse of changes in the servise
        return this.prodServ.getProductsList(categoryQueryArr.join(','));
      }),
    );

    const descriptionStream$ = fromEvent(
      this.descriptionSearch.nativeElement,
      'input',
    ).pipe(
      debounceTime(500),
      distinctUntilChanged(),
      startWith(this.descriptionSearch.nativeElement?.target?.value),
      map((inputEvent: any) => inputEvent?.target?.value || ''),
    );

    const nameSearchStream$: Observable<string> =
      this.searchControl.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        startWith(this.searchControl.value),
      );

    const sortPriceStream$ = this.sortSubject;

    const searches$ = combineLatest([
      descriptionStream$,
      nameSearchStream$,
      sortPriceStream$,
    ]);

    this.products$ = combineLatest([categoryFilterStream$, searches$]).pipe(
      tap(([products, [descrSearch, nameSearch, sortOrder]]) =>
        console.log(products, descrSearch, nameSearch, sortOrder),
      ),
      map(([products, [descrSearch, nameSearch, sortOrder]]) =>
        products
          .filter(
            (prod: any) =>
              prod.description
                .toLowerCase()
                .includes((descrSearch as string).toLowerCase()) &&
              prod.name.toLowerCase().includes(nameSearch.toLowerCase()),
          )
          .sort((a: any, b: any) => this.sortField.sort(sortOrder, a, b)),
      ),
    );
  }

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

  // NOTE: the first version of one stream  // didn't work correctly

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
