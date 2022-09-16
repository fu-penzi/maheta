import { Injectable } from '@angular/core';

import { TrackCollectionService } from '@src/app/db/collections/track-collection.service';
import { DatabaseService } from '@src/app/db/database.service';
import { Track } from '@src/app/db/domain/track.schema';
import { MusicLibraryService } from '@src/app/services/music-library/music-library.service';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MusicLibraryTracksService {
  constructor(
    private databaseService: DatabaseService,
    private musicLibraryService: MusicLibraryService,
    private trackCollectionService: TrackCollectionService
  ) {
    this.setupLibrary();
  }

  public get tracks(): Track[] {
    return this.musicLibraryService.tracks;
  }

  public setupLibrary(): void {
    this.musicLibraryService.libraryUpdate$.pipe().subscribe();
  }

  public addLyricsToTrack$(track: Track, lyrics: string): Observable<unknown> {
    const trackUpdate: Track = {
      ...track,
      lyrics,
    };
    return this.trackCollectionService.upsert$(trackUpdate);
  }

  public dropTracksLibrary(): Promise<void> {
    return this.databaseService.dropTracksCollection();
  }

  public reloadTracksLibrary(): Promise<void> {
    return this.databaseService.reloadTracksCollection();
  }
}
