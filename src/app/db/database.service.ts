import { Injectable } from '@angular/core';

import { PlaylistCollectionService } from '@src/app/db/collections/playlist-collection.service';
import { TrackCollectionService } from '@src/app/db/collections/track-collection.service';
import { playlistSchema } from '@src/app/db/domain/playlist.schema';
import { Track, trackSchema } from '@src/app/db/domain/track.schema';
import { DatabaseCollectionEnum } from '@src/app/model/database-collection.enum';

import { getRxStorageDexie } from 'rxdb/plugins/dexie';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import { addRxPlugin, createRxDatabase, RxChangeEvent, RxDatabase } from 'rxdb';
import { firstValueFrom, Observable } from 'rxjs';
import { logger } from '@src/devUtils';

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
    const isDatabaseEmpty: boolean = await firstValueFrom(
      this.trackCollectionService.isCollectionEmpty()
    );
    if (isDatabaseEmpty) {
      await this.reloadDatabaseData();
    } else {
      await this.setupDatabase();
    }
  }

  public async resetTracksCollection(backup?: Track[]): Promise<void> {
    const tracksBackup: Track[] =
      backup || (await firstValueFrom(this.trackCollectionService.getAll$()));
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

    await this.trackCollectionService.reloadCollectionData(tracksBackup);
  }

  private async reloadDatabaseData(): Promise<void> {
    const tracksBackup: Track[] = await firstValueFrom(this.trackCollectionService.getAll$());
    await this._trackDB?.remove();
    await this.setupDatabase();
    await this.resetTracksCollection(tracksBackup);
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
