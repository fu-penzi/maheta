import { Injectable } from '@angular/core';

import { CollectionService } from '@src/app/db/collections/collection.service';
import { Track } from '@src/app/db/domain/track.schema';
import { FileLoadingService, TrackLoadingResult } from '@src/app/services/file-loading.service';

@Injectable({
  providedIn: 'root',
})
export class TrackCollectionService extends CollectionService<Track> {
  constructor(private fileLoadingService: FileLoadingService) {
    super();
  }

  public async reloadCollectionData(): Promise<void> {
    const tracksLoadingResult: TrackLoadingResult = await this.fileLoadingService.loadTracks();
    await this.collection.bulkUpsert(tracksLoadingResult.tracksWithoutMetadata);
    tracksLoadingResult.trackWithMetadata$.subscribe((track: Track) => {
      this.collection.upsert(track);
    });
  }
}