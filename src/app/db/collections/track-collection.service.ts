import { Injectable } from '@angular/core';

import { CollectionService } from '@src/app/db/collections/collection.service';
import { Track } from '@src/app/db/domain/track.schema';
import { FileLoadingService } from '@src/app/services/file-loading.service';
import { MahetaService } from '@src/app/services/maheta.service';

import { finalize } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TrackCollectionService extends CollectionService<Track> {
  constructor(
    private fileLoadingService: FileLoadingService,
    private mahetaService: MahetaService
  ) {
    super();
  }

  public async reloadCollectionData(tracksBackup: Track[]): Promise<void> {
    let tracksLoadingResult: Track[] = await this.fileLoadingService.getTracksWithoutMetadata();
    tracksLoadingResult = tracksLoadingResult.map((track: Track) => ({
      ...track,
      lyrics: this.getLyricsFromBackup(track, tracksBackup),
    }));

    await this.collection.bulkUpsert(tracksLoadingResult);

    const trackNumber: number = tracksLoadingResult.length;
    let i = 0;
    this.mahetaService.showProgressBar();
    this.fileLoadingService
      .getTracksWithMetadata$(tracksLoadingResult)
      .pipe(finalize(() => this.mahetaService.hideProgressBar()))
      .subscribe((track: Track) => {
        this.collection.upsert(track);
        i++;
        this.mahetaService.updateProgressBar((i / trackNumber) * 100);
      });
  }

  private getLyricsFromBackup(track: Track, trackBackupArray: Track[]): string | undefined {
    const backupTrack: Track | undefined = trackBackupArray.find(
      (backupTrack: Track) => track.uri === backupTrack.uri
    );
    return backupTrack?.lyrics || track?.lyrics;
  }
}
