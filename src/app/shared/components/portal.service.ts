import {
  ComponentPortal,
  ComponentType,
  TemplatePortal,
} from '@angular/cdk/portal';
import { Injectable, Injector } from '@angular/core';
import { Subject, map, tap } from 'rxjs';
import { DATA_INJECTION_TOKEN } from '../example-token';
import {
  ErrorMessage,
  ErrorMessageComponent,
} from './error-message/error-message.component';

@Injectable({
  providedIn: 'root',
})
export class PortalService {
  private activePortal = new Subject<TemplatePortal | ComponentPortal<any>>();

  portal$ = this.activePortal.asObservable();

  constructor() {
    const portal = new ComponentPortal(
      ErrorMessageComponent,
      // null,
      // Injector.create({
      //   providers: [{ provide: DATA_INJECTION_TOKEN, useValue: null }],
      // }),
    );
  }

  setPortal(portal: TemplatePortal | ComponentPortal<any>) {
    this.activePortal.next(portal);
  }

  open(component: ComponentType<any>, data?: ErrorMessage) {
    // ...

    const portal = new ComponentPortal(
      component,
      null,
      Injector.create({
        providers: [{ provide: DATA_INJECTION_TOKEN, useValue: data }],
      }),
    );

    this.setPortal(portal);
  }

  close() {
    this.portal$.pipe(map((val) => val.detach()));
  }
}
