import { Injectable } from '@angular/core';

import { Album, AlbumDefaultsEnum } from '@src/app/db/domain/album';
import { Track } from '@src/app/db/domain/track.schema';
import { MusicLibraryService } from '@src/app/services/music-library/music-library.service';

import { groupBy, sortBy } from 'lodash';
import { map, Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MusicLibraryAlbumsService {
  public albums: Album[] = [];
  private _albums$: ReplaySubject<Album[]> = new ReplaySubject<Album[]>();

  constructor(private musicLibraryService: MusicLibraryService) {
    this.setupLibrary();
  }

  public get albums$(): Observable<Album[]> {
    return this._albums$.asObservable();
  }

  private get tracks(): Track[] {
    return this.musicLibraryService.tracks;
  }

  public getAlbum(title: string): Observable<Album | undefined> {
    return this._albums$.pipe(
      map((albums: Album[]) => albums.find((album: Album) => album.title === title))
    );
  }

  private setupLibrary(): void {
    this.musicLibraryService.libraryUpdate$.subscribe(() => {
      this.setupAlbums();
      this._albums$.next(this.albums);
    });
  }

  private setupAlbums(): void {
    const tracksByAlbum = groupBy(sortBy(this.tracks, 'album'), 'album');
    this.albums = Object.keys(tracksByAlbum).map((albumTitle: string) => ({
      title: albumTitle ?? AlbumDefaultsEnum.TITLE,
      author: tracksByAlbum[albumTitle][0]?.author ?? AlbumDefaultsEnum.AUTHOR,
      thumbUrl: tracksByAlbum[albumTitle][0]?.thumbUrl ?? AlbumDefaultsEnum.THUMBURL,
      year: tracksByAlbum[albumTitle][0]?.year,
      tracks: tracksByAlbum[albumTitle],
    }));
  }
}
