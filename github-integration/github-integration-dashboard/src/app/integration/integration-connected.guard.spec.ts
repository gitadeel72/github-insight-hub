import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { integrationConnectedGuard } from './integration-connected.guard';

describe('integrationConnectedGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => integrationConnectedGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
