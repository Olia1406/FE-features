import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../../shared/interfaces/product.interface';
const URL = 'http://localhost:4200/'

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) { }

  getProductsList(): Observable<Product[]> {
    return this.http.get<Product[]>(`${URL}api/products`)
  }

  addProduct(productBody: Product): Observable<any> {
    return this.http.post<any>(`${URL}api/products/create`, productBody)
  }

  deleteProduct(productId: string): Observable<string> {
    return this.http.delete<string>(`${URL}api/products/delete/${productId}`)
  }

  getProduct(id: string) {
    return this.http.get<Product[]>(`${URL}api/products/${id}`)
  }
}
