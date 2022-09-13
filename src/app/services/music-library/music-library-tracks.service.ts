import { Injectable } from '@angular/core';

import { PlaylistCollectionService } from '@src/app/db/collections/playlist-collection.service';
import { TrackCollectionService } from '@src/app/db/collections/track-collection.service';
import { DatabaseService } from '@src/app/db/database.service';
import { Album, AlbumDefaultsEnum } from '@src/app/db/domain/album';
import {
  getPlaylistObject,
  Playlist,
  PlaylistPopulationEnum,
} from '@src/app/db/domain/playlist.schema';
import { Track } from '@src/app/db/domain/track.schema';
import { FileLoadingService } from '@src/app/services/file-loading.service';
import { MusicLibraryService } from '@src/app/services/music-library/music-library.service';
import { tracksMock } from '@src/mock/tracks';

import { groupBy, sortBy } from 'lodash';
import { concatMap, filter, map, mergeMap, Observable, of, startWith, Subject, zip } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MusicLibraryTracksService {
  constructor(
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
}
