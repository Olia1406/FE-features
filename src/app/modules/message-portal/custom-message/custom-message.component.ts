import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ComponentType } from '@angular/cdk/portal';
import { NgComponentOutlet } from '@angular/common';
import { PortalService } from '../../../modules/message-portal/portal.service';
import { DATA_INJECTION_TOKEN } from '@shared/example-token';
import { MessageBgColors } from '@shared/enums';

export interface MessageData {
  message: string,
  bgColor?: MessageBgColors,
  time?: number,
  component: ComponentType<any>
}
@Component({
  selector: 'app-custom-message',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, NgComponentOutlet],
  templateUrl: './custom-message.component.html',
  styleUrl: './custom-message.component.scss'
})
export class CustomMessageComponent {

  messageText = '';
  bgColor = MessageBgColors.Green;
  innerComponent!: ComponentType<any>

  constructor(@Inject(DATA_INJECTION_TOKEN) data: MessageData, private portalBridgeServ: PortalService) {
    this.messageText = data.message;
    this.bgColor = data?.bgColor || MessageBgColors.Green;
    this.innerComponent = data.component;
  }
 
  close() {
    this.portalBridgeServ.close()
  }

}
