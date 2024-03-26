import { Component } from '@angular/core';
import { UsersService } from '../../../core/services/users.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent {
  constructor(private userServ: UsersService) {}

  onRegistFormSubmit(event: Event, email: string, password: string) {
    event.preventDefault();
    console.log(email, password);

    this.userServ.reggister({ email, password }).subscribe();
  }
}
