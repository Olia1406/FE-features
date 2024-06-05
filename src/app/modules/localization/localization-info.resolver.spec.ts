import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { localizationInfoResolver } from './localization-info.resolver';

describe('localizationInfoResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => localizationInfoResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
