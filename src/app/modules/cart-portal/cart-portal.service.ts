import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { TemplatePortal } from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root'
})
export class CartPortalService {

  private activeCartPortal = new Subject<TemplatePortal | null>();

  readonly cartPortal$ = this.activeCartPortal.asObservable();

  constructor() { }

  setCartPortal(cartPortal: TemplatePortal | null) {
    this.activeCartPortal.next(cartPortal)
  }
  close() {
    this.activeCartPortal.next(null);
    // this.portal$.pipe(map((val) => val?.detach())).subscribe();
  }
}
