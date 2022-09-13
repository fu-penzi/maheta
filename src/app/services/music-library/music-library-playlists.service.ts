import { Injectable } from '@angular/core';

import { PlaylistCollectionService } from '@src/app/db/collections/playlist-collection.service';
import {
  getPlaylistObject,
  Playlist,
  PlaylistPopulationEnum,
} from '@src/app/db/domain/playlist.schema';
import { Track } from '@src/app/db/domain/track.schema';
import { MusicLibraryService } from '@src/app/services/music-library/music-library.service';

import { filter, map, mergeMap, Observable, of, startWith, zip } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MusicLibraryPlaylistsService {
  constructor(
    private musicLibraryService: MusicLibraryService,
    private playlistCollectionService: PlaylistCollectionService
  ) {
    this.setupLibrary();
  }

  public get playlists(): Playlist[] {
    return this.musicLibraryService.playlists;
  }

  public setupLibrary(): void {
    this.musicLibraryService.libraryUpdate$.subscribe();
  }

  public createPlaylist(name?: string): void {
    this.playlistCollectionService.upsert$(getPlaylistObject(name));
  }

  public getPlaylist$(id: string): Observable<Playlist> {
    return this.musicLibraryService.libraryUpdate$.pipe(
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
    return this.playlistUpdate$({
      ...playlist,
      tracks: [...playlist.tracks, track.uri],
    });
  }

  public removeTrackFromPlaylist$(playlist: Playlist, track: Track): Observable<unknown> {
    if (!playlist.tracks.includes(track.uri)) {
      return of();
    }

    return this.playlistUpdate$({
      ...playlist,
      tracks: playlist.tracks.filter((trackUri: string) => trackUri !== track.uri),
    });
  }

  private playlistUpdate$(playlist: Playlist): Observable<unknown> {
    const playlistUpdate: Playlist = {
      ...playlist,
      trackPopulation: undefined,
    };
    return this.playlistCollectionService.upsert$(playlistUpdate);
  }
}
