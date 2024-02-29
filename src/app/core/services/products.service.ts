import { HttpClient, HttpEvent, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../../shared/interfaces/product.interface';
const URL = 'http://localhost:4200/'

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) { }

  getProductsList(categorySearchParams: string = 'category=phone,player'): Observable<Product[]> {
    const options = {
      params: new HttpParams({
        // fromObject
        fromString: categorySearchParams
      })
    }
    return this.http.get<Product[]>(`${URL}api/products`, options)
  }

  addProduct(productBody: any): Observable<any> {
    return this.http.post<any>(`${URL}api/products/create`, productBody, {
      headers: {
        'Accept': '*/*',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*'
      }
    })
  }

  deleteProduct(productId: string): Observable<string> {
    return this.http.delete<string>(`${URL}api/products/delete/${productId}`)
  }

  getProduct(id: string) {
    return this.http.get<Product[]>(`${URL}api/products/${id}`)
  }

}
