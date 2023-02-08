import { TestBed } from '@angular/core/testing';

import { StackingContextService } from '@src/app/services/stacking-context.service';

describe('StackingContextService', () => {
  let service: StackingContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StackingContextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
