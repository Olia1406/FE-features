import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { isNotLogginedGuard } from './is-not-loggined.guard';

describe('isNotLogginedGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => isNotLogginedGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
