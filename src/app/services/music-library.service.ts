import { Injectable } from '@angular/core';

import { Album, AlbumDefaultsEnum } from '@src/app/db/domain/album';
import { Track } from '@src/app/db/domain/track.schema';
import { tracksMock } from '@src/mock/tracks';

import { groupBy, sortBy } from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class MusicLibraryService {
  private _tracks: Track[];
  private _albums: Album[];

  public get albums(): Album[] {
    return this._albums;
  }

  public get tracks(): Track[] {
    return this._tracks;
  }

  public set tracks(tracks: Track[]) {
    if (tracks.length === 0) {
      this._tracks = tracksMock;
    } else {
      this._tracks = tracks;
    }
    const tracksByAlbum = groupBy(sortBy(this._tracks, 'album'), 'album');
    this._albums = Object.keys(tracksByAlbum).map((albumTitle: string) => ({
      title: albumTitle ?? AlbumDefaultsEnum.TITLE,
      author: tracksByAlbum[albumTitle][0]?.author ?? AlbumDefaultsEnum.AUTHOR,
      thumbUrl: tracksByAlbum[albumTitle][0]?.thumbUrl ?? AlbumDefaultsEnum.THUMBURL,
      tracks: tracksByAlbum[albumTitle],
    }));
  }

  public getAlbum(title: string): Album | undefined {
    return this._albums.find((album) => album.title === title);
  }
}
