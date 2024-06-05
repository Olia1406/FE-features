import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalPlaceComponent } from './portal-place.component';

describe('PortalPlaceComponent', () => {
  let component: PortalPlaceComponent;
  let fixture: ComponentFixture<PortalPlaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortalPlaceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PortalPlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
