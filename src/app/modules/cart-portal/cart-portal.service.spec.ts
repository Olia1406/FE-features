import { TestBed } from '@angular/core/testing';

import { CartPortalService } from './cart-portal.service';

describe('CartPortalService', () => {
  let service: CartPortalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartPortalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
