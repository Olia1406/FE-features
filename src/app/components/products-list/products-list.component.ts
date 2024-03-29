import {
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

import { ProductsService } from '../../core/services/products.service';
import { Product } from '../../shared/interfaces/product.interface';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  fromEvent,
} from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { EX_TOKEN } from '../../shared/example-token';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
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
  templateUrl: './products-list.component.html',
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

  constructor(
    @Inject('def-sort-field') private sortField: any,
    @Inject(EX_TOKEN) private prodServ: ProductsService,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.initDynamicCategoriesForm();
  }

  ngOnInit(): void {
    this.searchControl.setValue(this.activatedRoute.snapshot.queryParamMap.get('prodName') || '');
    this.descriptionSearch.nativeElement.value = this.activatedRoute.snapshot.queryParamMap.get('description') || '';
    this.matSelect.value = this.activatedRoute.snapshot.queryParamMap.get('sortType') || '';

    this.prodServ.getInfo().subscribe();

    const categoryStream$ = this.categoriesForm.valueChanges.pipe(
      startWith(this.categoriesForm.value),
      map((categories) => {
        return Object.entries(categories)
          .filter((entry) => entry[1])
          .map((entry) => entry[0]);
      }),
      map((valArr) => valArr.join(',')),
    );

    const descriptionStream$ = fromEvent(
      this.descriptionSearch.nativeElement,
      'input',
    ).pipe(
      debounceTime(500),
      distinctUntilChanged(),
      startWith(this.descriptionSearch.nativeElement.value || ''),
      map((inputEvent: any) => ((inputEvent?.target?.value as string ?? this.activatedRoute.snapshot.queryParamMap.get('description'))) || ''),
    );

    const nameSearchStream$: Observable<string> =
      this.searchControl.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        startWith(this.searchControl.value)
        );

    const sortPriceStream$ = this.sortSubject;
    this.sortSubject.next(this.matSelect.value);

    combineLatest([
      categoryStream$,
      descriptionStream$,
      nameSearchStream$,
      sortPriceStream$,
    ]).subscribe(([category, description, prodName, sortType]) => {
      console.log([category, description, prodName, sortType])
      this.setQueryParams({
        category: category || null,
        description,
        prodName,
        sortType,
      });
    });

    this.products$ = this.activatedRoute.queryParams.pipe(
      switchMap((qParams: any) => {
        return this.prodServ
          .getProductsList(qParams.category)
          .pipe(
            map((products) =>
              products
                .filter(
                  (prod: any) =>
                    prod.description
                      .toLowerCase()
                      .includes(qParams.description.toLowerCase()) &&
                    prod.name
                      .toLowerCase()
                      .includes(qParams.prodName.toLowerCase()),
                )
                .sort((a: any, b: any) =>
                  this.sortField.sort(qParams.sortType, a, b),
                ),
            ),
          );
      }),
    );
    // TODO: додати ще один гард який перевіряє роль юзера

    // NOTE: here is the way to set params on each event separetly
    // this.descriptionSearch.nativeElement.addEventListener(
    //   'input',
    //   (event: any) => {
    //     this.setQueryParams('description', event.target.value);
    //   },
    // );

    // this.searchControl.valueChanges.pipe(
    //   debounceTime(500),
    //   distinctUntilChanged(),
    // ).subscribe((value: string) => this.setQueryParams('name', value))
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
