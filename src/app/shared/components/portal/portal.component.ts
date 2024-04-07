import { ComponentPortal, PortalModule, TemplatePortal } from '@angular/cdk/portal';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { PortalService } from '../portal.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-portal',
  standalone: true,
  imports: [AsyncPipe, PortalModule],
  templateUrl: './portal.component.html',
  styleUrl: './portal.component.scss'
})
export class PortalComponent implements OnInit {
    portal$: Observable<TemplatePortal | ComponentPortal<any>>;

    constructor(private portalBridge: PortalService) {
       this.portal$ = this.portalBridge.portal$;
    }

    ngOnInit(): void {
    }

}
