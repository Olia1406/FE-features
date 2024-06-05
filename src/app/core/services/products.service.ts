import {
  HttpClient,
  HttpEvent,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  delay,
  map,
  of,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';
import { Product } from '../../shared/interfaces/product.interface';
const URL = 'http://localhost:4200/';

@Injectable()
export class ProductsService {
  currentCategory = 'initialCatList';
  cachedProducts$ = new BehaviorSubject<Product[]>([]);

  constructor(private http: HttpClient) {}

  // getProductsList(categorySearchParams: string[] = []): Observable<Product[]> {  // NOTE: this case is for another way when working not throught url
  //  const categorySearchStr = 'category=' + categorySearchParams.join(',')

  getItems(categorySearchParams: string = ''): Observable<Product[]> {
    const categorySearchStr = 'category=' + categorySearchParams;
    const options = {
      params: new HttpParams({
        fromString: categorySearchStr,
      }),
    };
    if (categorySearchParams === this.currentCategory) {
      return this.cachedProducts$;
    }
    this.currentCategory = categorySearchParams;
    return this.http.get<Product[]>(`${URL}api/products`, options).pipe(
      // delay(300),
      tap((data) => {
        this.cachedProducts$.next(data);
      }),
      shareReplay(1),
    );
  }

  addProduct(productBody: any): Observable<any> {
    return this.http.post<any>(`${URL}api/products/create`, productBody, {
      headers: {
        Accept: '*/*',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
      },
    });
  }

  deleteProduct(productId: string): Observable<string> {
    return this.http.delete<string>(`${URL}api/products/delete/${productId}`);
  }

  getProduct(id: string) {
    return this.http.get<Product[]>(`${URL}api/products/${id}`);
  }

  getInfo() {
    return this.http.get(`${URL}api/products/info`);
  }
}
