import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { CdkTableModule, DataSource } from '@angular/cdk/table';

import { ProductsService } from '../../core/services/products.service';
import { Observable } from 'rxjs/internal/Observable';
import { Product } from '../../shared/interfaces/product.interface';
import { tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { fullImageSrc } from '../../shared/helpers/fullImageSrc';
import { PRODUCT_CATEGORIES } from '../../shared/constants';
import { UsersService } from '../../core/services/users.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule,
    CdkTableModule,
    CommonModule
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
  productForm: FormGroup = this.fb.group({
    name: [''],
    description: [''],
    category: [''],
    image: [null],
    price: [],
  });
  
  categories = PRODUCT_CATEGORIES;
  selectedImgName = '';
  selectedImgSrc = '';
  currentFile?: File | null;

  constructor(private fb: FormBuilder, private prodServ: ProductsService, private authServ: AuthService) { }
  displayedColumns: string[] = ['name', 'description','category', 'image', 'price', 'del'];
  productDataSource = new ProductDataSource(this.prodServ);

  ngOnInit(): void {}

  onImageSelect(event: any): void {
    const selectedFiles = event.target.files;

    if (selectedFiles) {
      const file: File | null = selectedFiles.item(0);

      if (file) {
        this.currentFile = file;

        const reader = new FileReader();

        reader.onload = (e: any) => {
          this.selectedImgSrc = e.target.result;
          this.selectedImgName = this.currentFile?.name as string;
        };

        reader.readAsDataURL(this.currentFile);
      }
    }
  }

  getImageSrc(imagePath: string): string {
    return fullImageSrc(imagePath)
  }

  addProduct() {
    const formData: FormData = new FormData();
    const productModel = this.productForm.value;

    formData.append("name", productModel.name);
    formData.append("description", productModel.description);
    formData.append("category", productModel.category);
    formData.append("image", this.currentFile as any);
    formData.append("price", productModel.price);

    this.prodServ.addProduct(formData).pipe(
      tap(() => {
        this.productDataSource = new ProductDataSource(this.prodServ);
        // this.productForm.reset();
        this.currentFile = null;
        this.selectedImgName = '';
        this.selectedImgSrc = '';
      })
    ).subscribe((product) => {
      //  TODO: to push the product somehow to productDataSource (it is observable) if add was success
      // do it when error handling will be done
      console.log(product)
    })
  }

  onProductDelete(id: string) {
    this.prodServ.deleteProduct(id).subscribe(resp => {
      console.log(resp);
      this.productDataSource = new ProductDataSource(this.prodServ);

      // TODO: to handle error (and everywhere else), when support it on BE and if success do this:
      // this.products = this.products.filter(prod => prod.id !== product.id);
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

  disconnect() { }
}