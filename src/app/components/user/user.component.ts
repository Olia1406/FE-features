import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import {CdkTableModule, DataSource} from '@angular/cdk/table';

import { ProductsService } from '../../core/services/products.service';
import { Observable } from 'rxjs/internal/Observable';
import { Product } from '../../shared/interfaces/product.interface';
import { tap } from 'rxjs';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    MatButtonModule, 
    MatIconModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatDividerModule,
    CdkTableModule
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
  productForm: FormGroup = this.fb.group({
    name: [''],
    description: [''],
    image: [null],
    price: [null],
  });

  selectedImgName = null;

  constructor(private fb: FormBuilder, private prodServ: ProductsService) { }
  displayedColumns: string[] = ['name', 'description', 'image', 'price'];
  productDataSource = new ProductDataSource(this.prodServ);

  ngOnInit(): void { }

  addProduct() {
    this.prodServ.addProduct(this.productForm.value).pipe(
      tap(() => {
        this.productDataSource = new ProductDataSource(this.prodServ);
      })
     ).subscribe((product) => {
      //  TODO: to push the product somehow to productDataSource (it is observable) if add was success
      // do it when error handling will be done
      console.log(product)
     })
  }
  
}

export class ProductDataSource extends DataSource<Product> {
  data: Observable<Product[]>;
  constructor(private prodServ: ProductsService) {
    super();
  /** Stream of data that is provided to the table. */
    this.data = this.prodServ.getProductsList();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Product[]> {
    return this.data;
  }

  disconnect() {}
}