import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [],
  templateUrl: './info.component.html',
  styleUrl: './info.component.scss'
})
export class InfoComponent implements OnInit {

  constructor(private authServ: AuthService) {}

  ngOnInit(): void {
    this.authServ.getUserInfo().subscribe((info) => {
      console.log(info)
      console.log('isAdmin',this.authServ.isAdmin)
    })
   }

}

