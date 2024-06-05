import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UsersService } from '@services/users.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent {
  constructor(private userServ: UsersService, private router: Router) {}

  onRegistFormSubmit(event: Event, email: string, password: string,) {
    event.preventDefault();

    this.userServ.reggister({ email, password }).subscribe({
      next: () => {
        this.router.navigate(['/login'])
      }
    }
    );
  }
}
