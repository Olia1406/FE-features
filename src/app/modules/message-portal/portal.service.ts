import {
  ComponentPortal,
  ComponentType,
  TemplatePortal,
} from '@angular/cdk/portal';
import { Injectable, Injector } from '@angular/core';
import { DATA_INJECTION_TOKEN } from '@shared/example-token';
import {
  BehaviorSubject,
  Subject,
  map,
  of,
  take,
  tap,
  timeout,
  timer,
} from 'rxjs';
import { CustomMessageComponent, MessageData } from './custom-message/custom-message.component';

@Injectable({
  providedIn: 'root',
})
export class PortalService {
  private activePortal = new BehaviorSubject<
    TemplatePortal | ComponentPortal<any> | null
  >(null);

  portal$ = this.activePortal.asObservable();

  constructor() {}

  setPortal(portal: TemplatePortal | ComponentPortal<any> | null) {
    this.activePortal.next(portal);
  }

  open( data: MessageData) {
    const portal = new ComponentPortal(
      CustomMessageComponent,
      null,
      Injector.create({
        providers: [{ provide: DATA_INJECTION_TOKEN, useValue: data}],
      }),
    );

    this.setPortal(portal);
    timer(5000).subscribe(() => {
      this.close();
    });
  }

  close() {
    this.activePortal.next(null);
    // this.portal$.pipe(map((val) => val?.detach())).subscribe();
  }
}
