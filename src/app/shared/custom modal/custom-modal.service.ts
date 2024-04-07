import { ComponentPortal, DomPortal, DomPortalHost, DomPortalOutlet, Portal, TemplatePortal } from '@angular/cdk/portal';
import { ApplicationRef, ComponentFactoryResolver, ComponentRef, ElementRef, Inject, Injectable, Injector, ViewChild, ViewContainerRef } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomModalComponent } from './custom-modal/custom-modal.component';

@Injectable({
  providedIn: 'root'
})
export class CustomModalService {

  private insertialzContainerportal!: ComponentPortal<CustomModalComponent>
  insertialzContainerPort!: DomPortalOutlet;
  private bodyPortal!: DomPortal;
  private bodyPortalHost!: DomPortalHost;
  @ViewChild('domPortalContent') domPortalContent!: ElementRef<HTMLElement>;

  constructor(
    @Inject(Document) private document: any,
    // private appRef: ApplicationRef,
    // private componentfactoryResolver: ComponentFactoryResolver,
    private viewConRef: ViewContainerRef,
    private injector: Injector
  ) { 
    this.insertialzContainerportal = new ComponentPortal(CustomModalComponent);
    // this.insertialzContainerPort = new DomPortalOutlet(domPortalContent)
    this.bodyPortal = new DomPortal(document.body)
    // this.bodyPortalHost = new DomPortalHost(document.body, this.componentfactoryResolver, this.appRef )
  }

  show() {
    // const componentRef: ComponentRef<CustomModalComponent> = this.bodyPortalHost.attach(this.insertialzContainerportal)
    // const componentRef: ComponentRef<CustomModalComponent> = this.bodyPortal.attach(this.viewConRef.createComponent(CustomModalComponent))
  
    // componentRef.instance.close.subscribe(()=> this.hide())
  }

  hide() {
    this.bodyPortalHost.detach()
  }


}




// @Injectable({providedIn: 'root'})
// export class CustomModalService {

//   private state$ = new BehaviorSubject<any>(undefined);
//   private portal$ = new BehaviorSubject<any>(undefined);
    
//   get state(): Observable<any> {
//     return this.state$.asObservable();
//   }

//   get portal(): Observable<any> {
//     return this.portal$.asObservable();
//   }
    
//   open(position: any) {
//     this.state$.next({open: true, position});
//   }

//   close() {
//     this.state$.next({open: false, position: undefined});
//   }

//   setModalPortal(portal: TemplatePortal) {
//     this.portal$.next(portal);
//   }
// }