import { Injectable } from '@angular/core';

import { TrackCollectionService } from '@src/app/db/collections/track-collection.service';
import { DatabaseService } from '@src/app/db/database.service';
import { Lyrics } from '@src/app/db/domain/lyrics';
import { Track } from '@src/app/db/domain/track';
import { MusicLibraryService } from '@src/app/services/music-library/music-library.service';

import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MusicLibraryTracksService {
  public tracks: Track[] = [];
  private _tracks$: ReplaySubject<Track[]> = new ReplaySubject<Track[]>();

  constructor(
    private databaseService: DatabaseService,
    private musicLibraryService: MusicLibraryService,
    private trackCollectionService: TrackCollectionService
  ) {
    this.setupLibrary();
  }

  public get tracks$(): Observable<Track[]> {
    return this._tracks$.asObservable();
  }

  public setupLibrary(): void {
    this.musicLibraryService.libraryUpdate$.subscribe(() => {
      this.tracks = this.musicLibraryService.tracks;
      this._tracks$.next(this.tracks);
    });
  }

  public addLyricsToTrack$(track: Track, lyrics: Lyrics): Observable<unknown> {
    const trackUpdate: Track = { ...track, lyrics };
    return this.trackCollectionService.upsert$(trackUpdate);
  }

  public dropTracksLibrary(): Promise<void> {
    return this.databaseService.dropTracksCollection();
  }

  public reloadTracksLibrary(): Promise<void> {
    return this.databaseService.reloadTracksCollection();
  }
}
