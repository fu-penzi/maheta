import { Injectable } from '@angular/core';

import { DatabaseService } from '@src/app/db/database.service';
import { Album, AlbumDefaultsEnum } from '@src/app/db/domain/album';
import { Playlist } from '@src/app/db/domain/playlist.schema';
import { Track } from '@src/app/db/domain/track.schema';
import { FileLoadingService } from '@src/app/services/file-loading.service';
import { tracksMock } from '@src/mock/tracks';

import { groupBy, sortBy } from 'lodash';
import { startWith } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MusicLibraryService {
  public tracks: Track[];
  public playlists: Playlist[];
  public albums: Album[];

  constructor(
    private fileLoadingService: FileLoadingService,
    private databaseService: DatabaseService
  ) {}

  public async initLibrary(): Promise<void> {
    this.databaseService.databaseChanges$.pipe(startWith({})).subscribe(async () => {
      this.tracks = (await this.databaseService.getTracks()) || tracksMock;
      this.playlists = await this.databaseService.getPlaylists();
      this.setupAlbums();
    });
  }

  public getAlbum(title: string): Album | undefined {
    return this.albums.find((album: Album) => album.title === title);
  }

  public getPlaylist(id: string): Playlist | undefined {
    return this.playlists.find((playlist: Playlist) => playlist.id === id);
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
