import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UsersService } from '../../../core/services/users.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(private userServ: UsersService, private router: Router) {}

  onLoginFormSubmit(event: Event, email: string, password: string) {
    event.preventDefault();
    console.log(email, password);

    this.userServ.logIn({ email, password }).subscribe({
      next: (resp) => {
        this.router.navigateByUrl('/info')
      },
      error: (err) => console.log(err)
    });
  }
}
