import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { User } from '../../shared/interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _isAdmin = false;

  get isAdmin() {
    return this._isAdmin;
  }

  private _isLogginedUser = false;

  get isLogginedUser() {
    return this._isLogginedUser;
  }

  constructor(
    private cookieService: CookieService,
    private http: HttpClient,
  ) {}

  isLoggined(): Observable<boolean> {
    return this.getUserInfo().pipe(
      map((res) => true),
      catchError((err) => {
        this._isLogginedUser === false;
        return of(false);
      }),
    );
  }

  getUserInfo(): Observable<User> {
    return this.http
      .get<User>(`http://localhost:4200/api/users/user-info`)
      .pipe(
        tap((user: User) => {
          this._isLogginedUser = true;
          this._isAdmin = user.role === 'admin';
        }),
      );
  }
}
