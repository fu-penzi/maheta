import { Injectable } from '@angular/core';

import { Track, trackSchema } from '@src/app/db/domain/track.schema';
import { FileLoadingService } from '@src/app/services/file-loading.service';

import { getRxStorageDexie } from 'rxdb/plugins/dexie';
import { createRxDatabase, RxCollection, RxDatabase } from 'rxdb';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private _trackDB: RxDatabase;
  private _trackCollection: RxCollection;

  constructor(private fileLoadingService: FileLoadingService) {}

  public getTracks(): Promise<Track[]> {
    return this._trackCollection.find().exec();
  }

  public async reloadDatabaseData(): Promise<void> {
    const tracks: Track[] = await this.fileLoadingService.loadMusic();
    await this._trackCollection.remove();
    await this._trackCollection.bulkInsert(tracks);
  }

  public async initDatabase(): Promise<void> {
    this._trackDB = await createRxDatabase({
      name: 'trackdb',
      storage: getRxStorageDexie(),
    });

    this._trackCollection = await this._trackDB
      .addCollections({
        tracks: {
          schema: trackSchema,
        },
      })
      .then((res) => res.tracks);
  }
}
