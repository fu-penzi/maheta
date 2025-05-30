import { Injectable } from '@angular/core';

import { Album, AlbumDefaultsEnum } from '@src/app/db/domain/album';
import { Track } from '@src/app/db/domain/track';
import { SortingOrderEnum } from '@src/app/model/sorting-order.enum';
import { MusicLibraryService } from '@src/app/services/music-library/music-library.service';

import { groupBy, isNil, sortBy } from 'lodash';
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
    this.albums = Object.keys(tracksByAlbum).map((albumTitle: string) => {
      const albumTracks: Track[] = tracksByAlbum[albumTitle];
      const title: string = albumTitle ?? AlbumDefaultsEnum.TITLE;

      /*
       * Tracks without album ID3 tag are sorted by file modification time to prevent numeration clash in 'number' ID3 tag
       */
      if (title === AlbumDefaultsEnum.TITLE) {
        this.sortByModificationtime(albumTracks, SortingOrderEnum.DESCENDING);
      } else {
        this.sortByTrackNumber(albumTracks);
      }

      return {
        title,
        author: albumTracks[0]?.author ?? AlbumDefaultsEnum.AUTHOR,
        thumbSrc: albumTracks[0]?.thumbSrc ?? AlbumDefaultsEnum.THUMBSRC,
        year: albumTracks[0]?.year,
        tracks: tracksByAlbum[albumTitle],
      };
    });
  }

  private sortByModificationtime(tracks: Track[], order: SortingOrderEnum): void {
    tracks.sort((track1: Track, track2: Track) =>
      order === SortingOrderEnum.ASCENDING
        ? (track1.modificationTime || 0) - (track2.modificationTime || 0)
        : (track2.modificationTime || 0) - (track1.modificationTime || 0)
    );
  }

  /*
   * Sorting order: Descending by file modification time -> Ascending by track number
   */
  private sortByTrackNumber(tracks: Track[]): void {
    tracks.sort((track1: Track, track2: Track) => {
      if (isNil(track1.number) && isNil(track2.number)) {
        return (track2.modificationTime || 0) - (track1.modificationTime || 0);
      }
      if (isNil(track1.number)) {
        return -1;
      }
      if (isNil(track2.number)) {
        return 1;
      }
      return track1.number - track2.number;
    });
  }
}
