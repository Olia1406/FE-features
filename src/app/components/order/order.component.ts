import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Order } from '@shared/interfaces/order.interface';
import { OrdersService } from '@services/orders.service';
import { MessageContentComponent } from '../message-content/message-content.component';
import { PortalService } from '../../modules/message-portal/portal.service';
import { MessageBgColors } from '@shared/enums';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [
    MatSelectModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
})
export class OrderComponent implements OnInit {
  orderForm!: FormGroup;
  waysToPay = ['Card', 'While delivered'];
  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { _id: string; qty: number }[],
    private orderServ: OrdersService,
    private portalBridgeService: PortalService,
    public dialogRef: MatDialogRef<OrderComponent>
  ) {
    this.orderForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      wayToPay: ['', Validators.required],
      address: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  onOrderSubmit() {
    const orderToSubmit: Order = {
      name: this.orderForm.value.name,
      wayToPayId: this.orderForm.value.wayToPay,
      address: this.orderForm.value.address,
      isDelivered: false,
      productsList: this.data,
    };

    this.orderServ.addOrder(orderToSubmit).subscribe({
      next: () => {
        this.portalBridgeService.open( {
          message: 'Thank you! Your order is submitted.',
          bgColor: MessageBgColors.Green,
          component: MessageContentComponent
        });
        this.orderServ.removeLocalWishlist();
        this.dialogRef.close(); 
      },
    });
  }
}
