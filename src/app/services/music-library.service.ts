import { Injectable } from '@angular/core';

import { DatabaseService } from '@src/app/db/database.service';
import { Album, AlbumDefaultsEnum } from '@src/app/db/domain/album';
import { Playlist, PlaylistPopulationEnum } from '@src/app/db/domain/playlist.schema';
import { Track } from '@src/app/db/domain/track.schema';
import { PlaylistCollectionService } from '@src/app/db/playlist-collection/playlist-collection.service';
import { TrackCollectionService } from '@src/app/db/track-collection/track-collection.service';
import { FileLoadingService } from '@src/app/services/file-loading.service';
import { tracksMock } from '@src/mock/tracks';

import { groupBy, sortBy } from 'lodash';
import { concatMap, filter, map, mergeMap, Observable, of, startWith, Subject, zip } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MusicLibraryService {
  public tracks: Track[];
  public playlists: Playlist[];
  public albums: Album[];

  public databaseUpdate$: Subject<void> = new Subject<void>();

  constructor(
    private fileLoadingService: FileLoadingService,
    private databaseService: DatabaseService,
    private trackCollectionService: TrackCollectionService,
    private playlistCollectionService: PlaylistCollectionService
  ) {}

  public async initLibrary(): Promise<void> {
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
        this.setupAlbums();
        this.databaseUpdate$.next();
      });
  }

  public getAlbum(title: string): Album | undefined {
    return this.albums.find((album: Album) => album.title === title);
  }

  public getPlaylist$(id: string): Observable<Playlist> {
    return this.databaseUpdate$.pipe(
      startWith({}),
      map(() => this.playlists.find((playlist: Playlist) => playlist.id === id) as Playlist),
      filter((playlist: Playlist) => !!playlist),
      mergeMap((playlist: Playlist) =>
        zip(
          of(playlist),
          this.playlistCollectionService.getPopulation$<Track>(
            playlist,
            PlaylistPopulationEnum.tracks
          )
        )
      ),
      map(([playlist, trackPopulation]) => ({
        ...playlist,
        trackPopulation: trackPopulation ?? [],
      }))
    );
  }

  public deletePlaylist$(playlist: Playlist): Observable<boolean> {
    return this.playlistCollectionService.delete$(playlist);
  }

  public addTrackToPlaylist$(playlist: Playlist, track: Track): Observable<unknown> {
    if (playlist.tracks.includes(track.uri)) {
      return of([]);
    }

    const playlistUpdate: Playlist = {
      ...playlist,
      trackPopulation: undefined,
      tracks: [...playlist.tracks, track.uri],
    };
    return this.playlistCollectionService.update$(playlistUpdate);
  }

  public removeTrackFromPlaylist$(playlist: Playlist, track: Track): Observable<unknown> {
    if (!playlist.tracks.includes(track.uri)) {
      return of();
    }
    const playlistUpdate: Playlist = {
      ...playlist,
      trackPopulation: undefined,
      tracks: playlist.tracks.filter((trackUri: string) => trackUri !== track.uri),
    };
    return this.playlistCollectionService.update$(playlistUpdate);
  }

  public addLyricsToTrack$(track: Track, lyrics: string): Observable<unknown> {
    const trackUpdate: Track = {
      ...track,
      lyrics,
    };
    return this.trackCollectionService.update$(trackUpdate);
  }

  private setupAlbums(): void {
    const tracksByAlbum = groupBy(sortBy(this.tracks, 'album'), 'album');
    this.albums = Object.keys(tracksByAlbum).map((albumTitle: string) => ({
      title: albumTitle ?? AlbumDefaultsEnum.TITLE,
      author: tracksByAlbum[albumTitle][0]?.author ?? AlbumDefaultsEnum.AUTHOR,
      thumbUrl: tracksByAlbum[albumTitle][0]?.thumbUrl ?? AlbumDefaultsEnum.THUMBURL,
      tracks: tracksByAlbum[albumTitle],
    }));
  }
}
