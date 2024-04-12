import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, tap } from 'rxjs';
import { User } from '../../shared/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAdmin = false;

  constructor(private cookieService: CookieService, private http: HttpClient) { }

  isLoggined() {
    return !!this.cookieService.get('jwt');  
  }

  getUserInfo(): Observable<User> {
    return this.http.get<User>(`http://localhost:4200/api/users/user-info`).pipe(
      tap((user: User) => {
        this.isAdmin = user.role === 'admin'
        console.log(this.isAdmin)
      })
    )

    // return дістати юзера і див роль, додати апі яке повертає юзера
  }
}
