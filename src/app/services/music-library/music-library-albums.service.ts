import { Injectable } from '@angular/core';

import { Album, AlbumDefaultsEnum } from '@src/app/db/domain/album';
import { Track } from '@src/app/db/domain/track.schema';
import { MusicLibraryService } from '@src/app/services/music-library/music-library.service';

import { groupBy, sortBy } from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class MusicLibraryAlbumsService {
  public albums: Album[] = [];

  constructor(private musicLibraryService: MusicLibraryService) {
    this.setupLibrary();
  }

  public setupLibrary(): void {
    this.musicLibraryService.libraryUpdate$.subscribe(() => {
      this.setupAlbums();
    });
  }

  public getAlbum(title: string): Album | undefined {
    return this.albums.find((album: Album) => album.title === title);
  }

  private get tracks(): Track[] {
    return this.musicLibraryService.tracks;
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
