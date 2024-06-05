import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable, catchError, map, of, shareReplay, tap } from 'rxjs';
import { User } from '../../shared/interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _isAdmin = false;

  get isAdmin() {
    return this._isAdmin;
  }

  userData: any = null;
  isAdmin$ = new BehaviorSubject(false);

  constructor(
    private cookieService: CookieService,
    private http: HttpClient,
  ) {}

  isLoggined(): Observable<boolean> {
    return this.getUserInfo().pipe(
      map((res) => true),
      catchError((err) => {
        return of(false);
      }),
    );
  }

  getUserInfo(): Observable<User> {
    return this.http
      .get<User>(`http://localhost:4200/api/users/user-info`)
      .pipe(
        tap((user: User) => {
          this.userData = user;
          this._isAdmin = user.role === 'admin';
          this.isAdmin$.next(this._isAdmin);
        }),
        shareReplay(1)
      );
  }


}
