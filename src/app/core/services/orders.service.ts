import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Order } from '@shared/interfaces/order.interface';
import { Product } from '@shared/interfaces/product.interface';
import { Observable } from 'rxjs';
import { DataService } from '../models/data-service';
const WISH_LIST_KEY = 'productWishList';

@Injectable({
  providedIn: 'root',
})
export class OrdersService implements DataService<Order>{
  Url = '';
  constructor(
    private http: HttpClient,
    // ? чому це не працює
    // @Inject('URL_TOKEN') private Url: string,
  ) {}

  getItems(isDelivered: boolean | string = ''): Observable<any> {
    const params = new HttpParams().set('isDelivered', isDelivered);
    return this.http.get<any>(`${this.Url}api/orders`, { params });
  }

  addOrder(
    order: Order = {
      name: 'User Name',
      wayToPayId: 'card',
      address: 'Lviv',
      isDelivered: true,
      productsList: [],
    },
  ): Observable<any> {
    return this.http.post<any>(`${this.Url}api/orders/create`, order);
  }

  editOrder(orderId: string, bodyPatch: any | { isDelivered: boolean }) {
    return this.http.post<any>(
      `${this.Url}api/orders/update/${orderId}`,
      bodyPatch,
    );
  }

  setLocalWishList(product: Product) {
    let currentWishList: (Product & { qty: number })[] = [];
    let localWishList = localStorage.getItem(WISH_LIST_KEY);
    if (localWishList) {
      currentWishList = JSON.parse(localWishList);
      console.log(currentWishList)
      const existingProdIndex = currentWishList.findIndex(
        (prod) => prod._id === product._id,
      );
      if (existingProdIndex !== -1) {
        currentWishList[existingProdIndex].qty++;
      } else {
        const newlyAddedProd = { ...product, qty: 1 };
        currentWishList.push(newlyAddedProd);
      }
      localStorage.setItem(WISH_LIST_KEY, JSON.stringify(currentWishList));
    } else {
      localStorage.setItem(
        WISH_LIST_KEY,
        JSON.stringify([{ ...product, qty: 1 }]),
      );
    }
  }

  getLocalWishList(): (Product & { qty: number })[] {
    const items = localStorage.getItem(WISH_LIST_KEY) as string;
    return JSON.parse(items) as (Product & { qty: number })[];
  }

  removeLocalWishlist() {
    localStorage.removeItem(WISH_LIST_KEY);
  }
}
