import { ComponentPortal, PortalModule, TemplatePortal } from '@angular/cdk/portal';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { AsyncPipe } from '@angular/common';
import { PortalService } from '../portal.service';

@Component({
  selector: 'app-portal-place',
  standalone: true,
  imports: [AsyncPipe, PortalModule],
  templateUrl: './portal-place.component.html',
  styleUrl: './portal-place.component.scss'
})
export class PortalPlaceComponent implements OnInit {
    portal$: Observable<TemplatePortal | ComponentPortal<any> | null>;

    constructor(private portalBridge: PortalService) {
       this.portal$ = this.portalBridge.portal$;
    }

    ngOnInit(): void {
    }

}
