import { Injectable } from '@angular/core';

import { CollectionService } from '@src/app/db/collections/collection.service';
import { Track } from '@src/app/db/domain/track.schema';
import { FileLoadingService } from '@src/app/services/file-loading.service';
import { MahetaService } from '@src/app/services/maheta.service';

import { concatMap, finalize, map, takeWhile, tap } from 'rxjs';

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
    const { addTracks, deleteTracks } = await this.fileLoadingService.getTrackChanges(tracksBackup);

    deleteTracks.map((track: Track) => this.delete$(track).subscribe());

    const tracksLoadingResult: Track[] = addTracks.map((track: Track) => ({
      ...track,
      lyrics: this.getLyricsFromBackup(track, tracksBackup),
    }));
    await this.collection.bulkUpsert(tracksLoadingResult);
    this.loadTracksMetadata();
  }

  private loadTracksMetadata(): void {
    let trackNumber: number;
    let progress: number = 0;
    this.getAll$()
      .pipe(
        map((tracks: Track[]) => tracks.filter((track: Track) => !track.metadataLoaded)),
        takeWhile((tracks: Track[]) => !!tracks.length),
        tap((tracks: Track[]) => {
          this.mahetaService.showProgressBar();
          trackNumber = tracks.length;
        }),
        concatMap((tracks: Track[]) => this.fileLoadingService.getTracksWithMetadata$(tracks)),
        tap(() => progress++),
        finalize(() => this.mahetaService.hideProgressBar())
      )
      .subscribe((track: Track) => {
        this.collection.upsert(track);
        this.mahetaService.updateProgressBar((progress / trackNumber) * 100);
      });
  }

  private getLyricsFromBackup(track: Track, trackBackupArray: Track[]): string | undefined {
    const backupTrack: Track | undefined = trackBackupArray.find(
      (backupTrack: Track) => track.uri === backupTrack.uri
    );
    return backupTrack?.lyrics || track?.lyrics;
  }
}
