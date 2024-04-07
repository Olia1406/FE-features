import { Component, Inject } from '@angular/core';
import { DATA_INJECTION_TOKEN } from '../../example-token';
import { PortalService } from '../portal.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ErrorMessage {
  message: string
}
@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './error-message.component.html',
  styleUrl: './error-message.component.scss'
})
export class ErrorMessageComponent {

  messageText = '';

  constructor(@Inject(DATA_INJECTION_TOKEN) data: ErrorMessage, private portalBridgeServ: PortalService) {
    this.messageText = data.message;
  }
 
  close() {
    this.portalBridgeServ.close()
  }

}
