import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';

import { ProductsService } from '../../core/services/products.service';
import { Product } from '../../shared/interfaces/product.interface';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PRODUCT_CATEGORIES } from '../../shared/constants';
import { fullImageSrc } from '../../shared/helpers/fullImageSrc';
import { debounceTime, distinctUntilChanged, map, share, shareReplay, startWith, switchMap, take, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, fromEvent, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { EX_TOKEN } from '../../shared/example-token';
import { MatSelect, MatSelectModule } from '@angular/material/select';
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
    MatSelectModule
  ],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss'
})
export class ProductsListComponent implements OnInit {
  // @ViewChild('descriptionSearch', { static: true}) descriptionSearch!: ElementRef;
  @ViewChild('descriptionSearch', { static: true,read:ElementRef}) descriptionSearch!: ElementRef;

  products$!: Observable<Product[]>;
  categoriesForm = this.fb.group({});
  categories = PRODUCT_CATEGORIES;
  searchControl: any = this.fb.control('');
  sortSubject = new BehaviorSubject('asc');

  constructor(@Inject('def-sort-field') private sortField: any, @Inject(EX_TOKEN) private prodServ: ProductsService, private fb: FormBuilder) {
    this.initDynamicCategoriesForm();
  }

  ngOnInit(): void {
   const descriptionStream$ = fromEvent(this.descriptionSearch.nativeElement, 'input')
    this.products$ = this.categoriesForm.valueChanges.pipe(
      startWith(this.categoriesForm.value),
      map(categories => {
        console.log('categories')
        return Object.entries(categories).filter(entry => entry[1]).map(entry => entry[0])
      }),
      // tap(res => console.log(res)),
      switchMap(categoryQueryArr => {
        console.log('categoryQueryArr')
        return this.prodServ.getProductsList(categoryQueryArr)
      }),
      switchMap((products: Product[]): Observable<Product[]> => {
        return this.searchControl.valueChanges.pipe(
          startWith(this.searchControl.value),
          map((searchVal: string): Product[] => {
            console.log('searchVal', searchVal)
            return products.filter(prod => prod.name.toLowerCase().includes(searchVal.toLowerCase()))
          }))
      }),
      switchMap((products: Product[]): Observable<Product[]> => {
        return this.sortSubject.pipe(
          map((order: string) => {
            console.log('order')
            return products.sort((a, b) => this.sortField.sort(order, a, b))
          })
        )
      }),
      switchMap((products: Product[]): Observable<Product[]> => {
        return descriptionStream$.pipe(
          debounceTime(500),
          distinctUntilChanged(),
          startWith(this.descriptionSearch.nativeElement?.target?.value),
          map((inputEvent:any) => inputEvent?.target?.value || ''),
          shareReplay(1),
          // startWith(''),
          map((searchVal) => {
            console.log('description', searchVal)
            console.log('products', products)
            // return products.sort((a, b) => this.sortField.sort(value, a, b, 'name'))
            return products.filter(prod => prod.description.toLowerCase().includes(searchVal.toLowerCase()))
          })
        )
      })
    );
  }

  initDynamicCategoriesForm() {
    this.categories.forEach(category => {
      this.categoriesForm.addControl(category, this.fb.control(false));
    })
  }

  onSortTypeSelection(event: any) {
    this.sortSubject.next(event.value);
  }

  getDetails(product: Product) {
    this.prodServ.getProduct(product._id as string).subscribe(details => {
      console.log(details)
    })
  }

  getImageSrc(imagePath: string): string {
    return fullImageSrc(imagePath)
  }

}
