import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info.component.html',
  styleUrl: './info.component.scss',
})
export class InfoComponent implements OnInit {
  userData$!: Observable<any>;
  userData: any
  constructor(
    private authServ: AuthService,
  ) {}

  ngOnInit(): void {
    this.userData = this.authServ.userData;
  }

}
