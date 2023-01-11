import { TestBed } from '@angular/core/testing';

import { Track } from '@src/app/db/domain/track.schema';
import { QueueService } from '@src/app/services/queue.service';

describe('QueueService', () => {
  let service: QueueService<Track[]>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QueueService],
    });
    service = TestBed.inject(QueueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
