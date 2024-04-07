import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { PortalService } from '../../shared/components/portal.service';
import { ErrorMessageComponent } from '../../shared/components/error-message/error-message.component';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [],
  templateUrl: './info.component.html',
  styleUrl: './info.component.scss'
})
export class InfoComponent implements OnInit {

  constructor(private authServ: AuthService, private portalBridgeService: PortalService) {}

  ngOnInit(): void {
    this.authServ.getUserInfo().subscribe((info) => {
      console.log(info)
      console.log('isAdmin',this.authServ.isAdmin)
    });

    this.getUser();
   }

   getUser() {
    this.authServ.getUserInfo().subscribe({
      next: (user) => console.log('user', user),
      error: (err) => this.portalBridgeService.open(ErrorMessageComponent, err.error),
    });
  }
}

