import { Component, OnInit } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { ProductsService } from '../../core/services/products.service';
import { Product } from '../../shared/interfaces/product.interface';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PRODUCT_CATEGORIES } from '../../shared/constants';
import { fullImageSrc } from '../../shared/helpers/fullImageSrc';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatSidenavModule, FormsModule, ReactiveFormsModule, MatCheckboxModule],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss'
})
export class ProductsListComponent implements OnInit {
  products!: Product[];
  categoriesForm = this.fb.group({});
  categories = PRODUCT_CATEGORIES;

  constructor(private prodServ: ProductsService, private fb: FormBuilder) {
    this.initDynamicCategoriesForm();

    this.categoriesForm.valueChanges.pipe(
      map(categories => {
        return 'category=' + Object.entries(categories).filter(entry => entry[1]).map(entry => entry[0]).join(',')
      }))
      .subscribe(categoryQueryString => {
        this.getProductlist(categoryQueryString)
      })
  
  }

  initDynamicCategoriesForm() {
    this.categories.forEach(category => {
      this.categoriesForm.addControl(category, this.fb.control(false));
    })
  }

  ngOnInit(): void {
    this.getProductlist('');
  }

  getProductlist(categoryQueryString: string) {
    this.prodServ.getProductsList(categoryQueryString).subscribe(products => {
      this.products = products;
    })
  }

  getDetails(product: Product) {
    this.prodServ.getProduct(product.id as string).subscribe(details => {
      console.log(details)
    })
  }

  getImageSrc(imagePath: string): string {
    return fullImageSrc(imagePath)
  }

}
