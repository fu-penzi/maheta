import { Injectable } from '@angular/core';

import { PlaylistCollectionService } from '@src/app/db/collections/playlist-collection.service';
import { TrackCollectionService } from '@src/app/db/collections/track-collection.service';
import { DatabaseService } from '@src/app/db/database.service';
import { Playlist } from '@src/app/db/domain/playlist.schema';
import { Track } from '@src/app/db/domain/track.schema';
import { tracksMock } from '@src/mock/tracks';

import { concatMap, startWith, Subject, zip } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MusicLibraryService {
  public tracks: Track[];
  public playlists: Playlist[];

  public libraryUpdate$: Subject<void> = new Subject<void>();

  constructor(
    private databaseService: DatabaseService,
    private trackCollectionService: TrackCollectionService,
    private playlistCollectionService: PlaylistCollectionService
  ) {}

  public initLibrary(): void {
    this.databaseService.databaseChanges$
      .pipe(
        startWith({}),
        concatMap(() =>
          zip(this.trackCollectionService.getAll$(), this.playlistCollectionService.getAll$())
        )
      )
      .subscribe(([tracks, playlists]: [Track[], Playlist[]]) => {
        this.tracks = tracks.length > 0 ? tracks : tracksMock;
        this.playlists = playlists;
        this.libraryUpdate$.next();
      });
  }

  public resetTracksCollection(): Promise<void> {
    return this.databaseService.dropTracksCollection();
  }
}
