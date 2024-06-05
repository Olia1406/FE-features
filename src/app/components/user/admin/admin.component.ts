import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { Order } from '@shared/interfaces/order.interface';
import { tap } from 'rxjs';
import { GeneralDataSource } from '../../../core/models/general-data-source';
import { OrdersService } from '../../../core/services/orders.service';
import { ProductsService } from '../../../core/services/products.service';
import { PRODUCT_CATEGORIES } from '../../../shared/constants';
import { fullImageSrc } from '../../../shared/helpers/fullImageSrc';
import { Product } from '../../../shared/interfaces/product.interface';
import { OrdersComponent } from './orders/orders.component';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalizationModule } from '../../../modules/localization/localization.module';

@Component({
  selector: 'app-admin',
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
    CommonModule,
    MatTabsModule,

    OrdersComponent,
    LocalizationModule,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit {
  selectedTabIndex = 1;
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
  localizData!: any;

  displayedProductColumns: string[] = [
    'name',
    'description',
    'category',
    'image',
    'price',
    'del',
  ];
  displayedOrderColumns = [
    'name',
    'wayToPayId',
    'address',
    'productsList',
    'isDelivered',
    'edit',
  ];
  productDataSource = new ProductDataSource(this.prodServ);
  orderDataSourse = new OrderDataSource(this.orderServ);

  constructor(
    private fb: FormBuilder,
    private prodServ: ProductsService,
    private orderServ: OrdersService,
    private router: Router,
    private actRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const tabInd = this.actRoute.snapshot.queryParamMap.get('selectedTabIndex');
    this.selectedTabIndex = tabInd ? +tabInd : 1;
  }
  saveTabIndex(event: number) {
    this.router.navigate([], {
      queryParams: { selectedTabIndex: event },
    });
  }
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
    return fullImageSrc(imagePath);
  }

  addProduct() {
    const formData: FormData = new FormData();
    const productModel = this.productForm.value;

    formData.append('name', productModel.name);
    formData.append('description', productModel.description);
    formData.append('category', productModel.category);
    formData.append('image', this.currentFile as any);
    formData.append('price', productModel.price);

    this.prodServ
      .addProduct(formData)
      .pipe(
        tap(() => {
          this.productDataSource = new ProductDataSource(this.prodServ);
          this.currentFile = null;
          this.selectedImgName = '';
          this.selectedImgSrc = '';
        }),
      )
      .subscribe((product) => {});
  }

  onProductDelete(id: string) {
    this.prodServ.deleteProduct(id).subscribe((resp) => {
      this.productDataSource = new ProductDataSource(this.prodServ);
    });
  }
}

class ProductDataSource extends GeneralDataSource<Product, ProductsService> {}
class OrderDataSource extends GeneralDataSource<Order, OrdersService> {}
