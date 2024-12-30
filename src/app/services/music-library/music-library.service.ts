import { Injectable } from '@angular/core';

import { PlaylistCollectionService } from '@src/app/db/collections/playlist-collection.service';
import { TrackCollectionService } from '@src/app/db/collections/track-collection.service';
import { DatabaseService } from '@src/app/db/database.service';
import { Playlist } from '@src/app/db/domain/playlist';
import { Track } from '@src/app/db/domain/track';

import { Observable, ReplaySubject, startWith, switchMap, zip } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MusicLibraryService {
  public tracks: Track[] = [];
  public playlists: Playlist[] = [];

  private _libraryUpdate$: ReplaySubject<void> = new ReplaySubject<void>(1);

  constructor(
    private databaseService: DatabaseService,
    private trackCollectionService: TrackCollectionService,
    private playlistCollectionService: PlaylistCollectionService
  ) {}

  public get libraryUpdate$(): Observable<void> {
    return this._libraryUpdate$.asObservable();
  }

  public initLibrary(): void {
    this.databaseService.databaseChanges$
      .pipe(
        startWith({}),
        switchMap(() =>
          zip(this.trackCollectionService.getAll$(), this.playlistCollectionService.getAll$())
        )
      )
      .subscribe(([tracks, playlists]: [Track[], Playlist[]]) => {
        this.tracks = tracks;
        this.playlists = playlists;
        this._libraryUpdate$.next();
      });
  }
}
