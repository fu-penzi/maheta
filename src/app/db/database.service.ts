import { Injectable } from '@angular/core';

import { Track, trackSchema } from '@src/app/db/domain/track.schema';
import { FileLoadingService } from '@src/app/services/file-loading.service';

import { getRxStorageDexie } from 'rxdb/plugins/dexie';
import { createRxDatabase, RxCollection, RxDatabase } from 'rxdb';
import { logger } from '@src/devUtils';
import { DatabaseCollectionEnum } from '@src/app/model/database-collection.enum';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private _trackDB: RxDatabase;
  private _trackCollection: RxCollection;

  constructor(private fileLoadingService: FileLoadingService) {}

  public async initDatabase(): Promise<void> {
    this._trackDB = await createRxDatabase({
      name: 'trackdb',
      storage: getRxStorageDexie(),
    });

    this._trackCollection = await this._trackDB
      .addCollections({
        [DatabaseCollectionEnum.TRACKS]: {
          schema: trackSchema,
        },
      })
      .then((res) => res[DatabaseCollectionEnum.TRACKS]);
  }

  public getTracks(): Promise<Track[]> {
    return this._trackCollection.find().exec();
  }

  public async isTrackCollectionEmpty(): Promise<boolean> {
    const tracks: Track[] = await this.getTracks();
    return !tracks?.length;
  }

  public async reloadDatabaseData(): Promise<void> {
    const tracks: Track[] = await this.fileLoadingService.loadMusic();
    await this._trackDB.remove();
    await this.initDatabase();

    await this.isTrackCollectionEmpty();

    await this._trackCollection.bulkUpsert(tracks);

    await this.isTrackCollectionEmpty();
  }
}
