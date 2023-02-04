import { Injectable } from '@angular/core';

import { CollectionService } from '@src/app/db/collections/collection.service';
import { Track } from '@src/app/db/domain/track.schema';
import { FileLoadingService } from '@src/app/services/file-loading.service';
import { MahetaService } from '@src/app/services/maheta.service';

import { bufferTime, finalize, map, switchMap, takeWhile, tap } from 'rxjs';

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

  public async resetCollectionData(): Promise<void> {
    const { addTracks } = await this.fileLoadingService.getTrackChanges([]);
    await this.collection.bulkUpsert(addTracks);
    this.loadTracksMetadata();
  }

  private loadTracksMetadata(): void {
    let trackNumber: number;
    let progress: number;
    this.getAll$()
      .pipe(
        map((tracks: Track[]) => tracks.filter((track: Track) => !track.metadataLoaded)),
        takeWhile((tracks: Track[]) => !!tracks.length),
        tap((tracks: Track[]) => {
          this.mahetaService.showProgressBar();
          progress = 0;
          trackNumber = tracks.length;
        }),
        switchMap((tracks: Track[]) => this.fileLoadingService.getTracksWithMetadata$(tracks)),
        bufferTime(1500),
        map((track: Track[]) => {
          progress = progress + track.length;
          this.collection.bulkUpsert(track);
          const barProgress = (progress / trackNumber) * 100;
          this.mahetaService.updateProgressBar(parseInt(barProgress.toFixed(0)));
        }),
        finalize(() => this.mahetaService.hideProgressBar())
      )
      .subscribe();
  }

  private getLyricsFromBackup(track: Track, trackBackupArray: Track[]): string | undefined {
    const backupTrack: Track | undefined = trackBackupArray.find(
      (backupTrack: Track) => track.uri === backupTrack.uri
    );
    return backupTrack?.lyrics || track?.lyrics;
  }
}
