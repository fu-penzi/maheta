import { TestBed } from '@angular/core/testing';

import { AppStateCacheService } from '@src/app/app-state-cache.service';

describe('AppStateCacheService', () => {
  let service: AppStateCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppStateCacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
