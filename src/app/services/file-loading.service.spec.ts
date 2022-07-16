import { TestBed } from '@angular/core/testing';

import { FileLoadingService } from './file-loading.service';

describe('FileLoaderService', () => {
  let service: FileLoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileLoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
