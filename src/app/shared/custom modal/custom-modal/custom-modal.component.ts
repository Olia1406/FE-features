import { Component, ViewChild } from '@angular/core';
import { CustomModalService } from '../custom-modal.service';
import { CdkPortalOutlet, PortalOutlet, TemplatePortal } from '@angular/cdk/portal';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-custom-modal',
  standalone: true,
  imports: [],
  templateUrl: './custom-modal.component.html',
  styleUrl: './custom-modal.component.scss'
})
export class CustomModalComponent {

  close = new BehaviorSubject(false)

  // @ViewChild('modal', {static: false}) modal: any;
  // @ViewChild(CdkPortalOutlet, {static: false}) portalOutlet!: PortalOutlet;
  
  // constructor(private customModalService: CustomModalService) {}
  
  // ngOnInit() {
  //   this.customModalService.state
  //     .subscribe((state: any) => {
  //       if (!!state) {
  //         if (state.open) {
  //           this.modal.show();
  //         } else {
  //           this.modal.hide();
  //         }
  //         // this.position = state.position || this.position;
  //       }
  //     });
  
  //   this.customModalService.portal
  //     .subscribe((portal: TemplatePortal) => {
  //       if (!!portal) {
  //         this.portalOutlet.detach();
  //         this.portalOutlet.attach(portal);
  //       }
  //     });
  // }
}
