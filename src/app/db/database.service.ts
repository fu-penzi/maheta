import { Injectable } from '@angular/core';

import { playlistSchema } from '@src/app/db/domain/playlist.schema';
import { trackSchema } from '@src/app/db/domain/track.schema';
import { PlaylistCollectionService } from '@src/app/db/playlist-collection/playlist-collection.service';
import { TrackCollectionService } from '@src/app/db/track-collection/track-collection.service';
import { DatabaseCollectionEnum } from '@src/app/model/database-collection.enum';

import { getRxStorageDexie } from 'rxdb/plugins/dexie';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import { addRxPlugin, createRxDatabase, RxChangeEvent, RxDatabase } from 'rxdb';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private _trackDB: RxDatabase;

  constructor(
    private trackCollectionService: TrackCollectionService,
    private playlistCollectionService: PlaylistCollectionService
  ) {
    addRxPlugin(RxDBUpdatePlugin);
  }

  public get databaseChanges$(): Observable<RxChangeEvent<unknown>> {
    return this._trackDB.$;
  }

  public async initDatabase(): Promise<void> {
    await this.setupDatabase();
    const isDatabaseEmpty: boolean = await firstValueFrom(
      this.trackCollectionService.isCollectionEmpty()
    );
    if (isDatabaseEmpty) {
      await this.reloadDatabaseData();
    }
  }

  public async resetTracksCollection(): Promise<void> {
    await this.trackCollectionService.collection.remove();
    await this._trackDB
      .addCollections({
        [DatabaseCollectionEnum.TRACKS]: {
          schema: trackSchema,
        },
      })
      .then((res) => {
        this.trackCollectionService.collection = res[DatabaseCollectionEnum.TRACKS];
      });

    await this.trackCollectionService.reloadCollectionData();
  }

  private async reloadDatabaseData(): Promise<void> {
    await this._trackDB.remove();
    await this.setupDatabase();
    await this.resetTracksCollection();
  }

  private async setupDatabase(): Promise<void> {
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
        this.trackCollectionService.collection = res[DatabaseCollectionEnum.TRACKS];
        this.playlistCollectionService.collection = res[DatabaseCollectionEnum.PLAYLISTS];
      });
  }
}
