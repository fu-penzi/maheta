import { TestBed } from '@angular/core/testing';

import { MusicLibraryService } from '@src/app/services/music-library/music-library.service';

describe('MusicLibraryService', () => {
  let service: MusicLibraryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MusicLibraryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
