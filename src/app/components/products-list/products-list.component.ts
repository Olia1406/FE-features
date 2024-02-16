import { Component, OnInit } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ProductsService } from '../../core/services/products.service';
import { Product } from '../../shared/interfaces/product.interface';


@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss'
})
export class ProductsListComponent implements OnInit {
  products!: Product[];

  constructor(private prodServ: ProductsService) { }
  ngOnInit(): void {
    this.getProductlist();
  }

  getProductlist() {
    this.prodServ.getProductsList().subscribe(products => {
      this.products = products;
    })
  }

  deleteProduct(product: Product) {
    this.prodServ.deleteProduct(product.id as string).subscribe(resp => {
      console.log(resp);
      this.getProductlist();
      // TODO: to handle error (and everywhere else), when support it on BE and if success do this:
      // this.products = this.products.filter(prod => prod.id !== product.id);
    })
  }

  getDetails(product: Product) {
    this.prodServ.getProduct(product.id as string).subscribe(details => {
      console.log(details)
    })
  }

}
