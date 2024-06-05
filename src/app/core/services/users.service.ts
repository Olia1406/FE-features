import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  isLogginedUser$ = new BehaviorSubject(false);

  constructor(
    private http: HttpClient,
    @Inject('URL_TOKEN') private Url: string,
  ) {}

  reggister(user: any): Observable<any> {
    return this.http.post<any>(`${this.Url}api/users/create`, user).pipe(
      tap(() => {
        this.isLogginedUser$.next(true);
      }),
    );
  }

  logIn(user: any): Observable<any> {
    return this.http.post<any>(`${this.Url}api/users/login`, user).pipe(
      tap(() => {
        this.isLogginedUser$.next(true);
      }),
    );
  }

  logout(): Observable<string> {
    return this.http.post<any>(`${this.Url}api/users/logout`, {}).pipe(
      tap(() => {
        this.isLogginedUser$.next(false);
      }),
    );
  }
}
