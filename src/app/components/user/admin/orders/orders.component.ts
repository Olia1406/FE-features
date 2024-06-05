import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { fullImageSrc } from '@shared/helpers/fullImageSrc';
import { LocalizationModule } from '../../../../modules/localization/localization.module';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    CdkTableModule,
    CommonModule,
    MatListModule,
    MatMenuModule,

    LocalizationModule
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent {
  @Input() displayedOrderColumns!: string[];
  @Input() orderDataSourse!: any;

  getImageSrc(imagePath: string): string {
    return fullImageSrc(imagePath);
  }
}
