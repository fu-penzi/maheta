import { Injectable } from '@angular/core';

import { Playlist, PlaylistDefaultsEnum, playlistSchema } from '@src/app/db/domain/playlist.schema';
import { Track, trackSchema } from '@src/app/db/domain/track.schema';
import { DatabaseCollectionEnum } from '@src/app/model/database-collection.enum';
import { FileLoadingService } from '@src/app/services/file-loading.service';

import { getRxStorageDexie } from 'rxdb/plugins/dexie';
import { createRxDatabase, RxCollection, RxDatabase } from 'rxdb';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private _trackDB: RxDatabase;
  private _trackCollection: RxCollection;
  private _playlistCollection: RxCollection;

  constructor(private fileLoadingService: FileLoadingService) {}

  public async initDatabase(): Promise<void> {
    this._trackDB = await createRxDatabase({
      name: 'trackdb',
      storage: getRxStorageDexie(),
    });
    await this._trackDB
      .addCollections({
        [DatabaseCollectionEnum.TRACKS]: {
          schema: trackSchema,
        },
        [DatabaseCollectionEnum.PLAYLISTS]: {
          schema: playlistSchema,
        },
      })
      .then((res) => {
        this._trackCollection = res[DatabaseCollectionEnum.TRACKS];
        this._playlistCollection = res[DatabaseCollectionEnum.PLAYLISTS];
      });
  }

  public getTracks(): Promise<Track[]> {
    return this._trackCollection.find().exec();
  }

  public getPlaylists(): Promise<Playlist[]> {
    return this._playlistCollection.find().exec();
  }

  public async createPlaylist(): Promise<void> {
    const playlist: Playlist = {
      id: `${Math.random()}`,
      name: PlaylistDefaultsEnum.NAME,
      thumbUrl: PlaylistDefaultsEnum.THUMBURL,
      tracks: [''],
    };
    await this._playlistCollection.upsert(playlist);
  }

  public addTrackToPlaylist(track: Track, playlist: Playlist): void {
    //  TODO
  }

  public async isTrackCollectionEmpty(): Promise<boolean> {
    const tracks: Track[] = await this.getTracks();
    return !tracks?.length;
  }

  public async reloadDatabaseData(): Promise<void> {
    const tracks: Track[] = await this.fileLoadingService.loadMusic();
    await this._trackDB.remove();
    await this.initDatabase();
    await this._trackCollection.bulkInsert(tracks);
  }
}
