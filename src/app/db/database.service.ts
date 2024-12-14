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
    if (await this.trackCollectionService.isCollectionEmpty()) {
      await this.reloadTracksCollection();
    }
  }

  public async dropTracksCollection(): Promise<void> {
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

    await this.trackCollectionService.resetCollectionData();
  }

  public async reloadTracksCollection(): Promise<void> {
    const tracksBackup: Track[] = await firstValueFrom(this.trackCollectionService.getAll$());
    await this.trackCollectionService.reloadCollectionData(tracksBackup);
  }

  private async dropDatabaseData(): Promise<void> {
    await this._trackDB?.remove();
    await this.setupDatabase();
    await this.dropTracksCollection();
  }

  private async setupDatabase(): Promise<void> {
    this._trackDB = await createRxDatabase({
      name: 'trackdb',
      storage: getRxStorageDexie(),
      eventReduce: true,
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
