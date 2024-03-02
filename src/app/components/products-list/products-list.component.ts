import { Component, OnInit } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { ProductsService } from '../../core/services/products.service';
import { Product } from '../../shared/interfaces/product.interface';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PRODUCT_CATEGORIES } from '../../shared/constants';
import { fullImageSrc } from '../../shared/helpers/fullImageSrc';
import { map, startWith, switchMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatSidenavModule, FormsModule, ReactiveFormsModule, MatCheckboxModule],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss'
})
export class ProductsListComponent implements OnInit {
  products$!: Observable<Product[]>;
  categoriesForm = this.fb.group({});
  categories = PRODUCT_CATEGORIES;

  constructor(private prodServ: ProductsService, private fb: FormBuilder) {
    this.initDynamicCategoriesForm();
  }

  ngOnInit(): void {
    this.products$ = this.categoriesForm.valueChanges.pipe(
      startWith(this.categoriesForm.value),
      map(categories => {
        return Object.entries(categories).filter(entry => entry[1]).map(entry => entry[0])
      }),
      tap(res => console.log(res)),
      switchMap(categoryQueryArr => {
        return this.prodServ.getProductsList(categoryQueryArr)
      })
    )
  }

  initDynamicCategoriesForm() {
    this.categories.forEach(category => {
      this.categoriesForm.addControl(category, this.fb.control(false));
    })
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
