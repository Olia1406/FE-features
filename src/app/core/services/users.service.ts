import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient, @Inject('URL_TOKEN') private Url: string) { }

  reggister(user: any): Observable<any> {
    return this.http.post<any>(`${this.Url}api/users/create`, user)
  }

  logIn(user: any): Observable<any> {
    return this.http.post<any>(`${this.Url}api/users/login`, user)
  }
}
