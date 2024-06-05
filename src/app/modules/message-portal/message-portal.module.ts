import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomMessageComponent } from './custom-message/custom-message.component';
import { PortalPlaceComponent } from './portal-place/portal-place.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, CustomMessageComponent, PortalPlaceComponent],
  exports: [CustomMessageComponent, PortalPlaceComponent],
})
export class MessagePortalModule {}
