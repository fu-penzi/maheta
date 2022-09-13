import { Injectable } from '@angular/core';

import { CollectionService } from '@src/app/db/collections/collection.service';
import { Track } from '@src/app/db/domain/track.schema';
import { FileLoadingService } from '@src/app/services/file-loading.service';
import { logger } from '@src/devUtils';

@Injectable({
  providedIn: 'root',
})
export class TrackCollectionService extends CollectionService<Track> {
  constructor(private fileLoadingService: FileLoadingService) {
    super();
  }

  public async reloadCollectionData(tracksBackup: Track[]): Promise<void> {
    let tracksLoadingResult: Track[] = await this.fileLoadingService.getTracksWithoutMetadata();
    tracksLoadingResult = tracksLoadingResult.map((track: Track) => ({
      ...track,
      lyrics: this.getLyricsFromBackup(track, tracksBackup),
    }));

    await this.collection.bulkUpsert(tracksLoadingResult);
    this.fileLoadingService
      .getTracksWithMetadata$(tracksLoadingResult)
      .subscribe((track: Track) => this.collection.upsert(track));
  }

  private getLyricsFromBackup(track: Track, trackBackupArray: Track[]): string | undefined {
    const backupTrack: Track | undefined = trackBackupArray.find(
      (backupTrack: Track) => track.uri === backupTrack.uri
    );
    return backupTrack?.lyrics || track?.lyrics;
  }
}
