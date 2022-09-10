import { Injectable } from '@angular/core';

import { Playlist, PlaylistDefaultsEnum, playlistSchema } from '@src/app/db/domain/playlist.schema';
import { Track, trackSchema } from '@src/app/db/domain/track.schema';
import { DatabaseCollectionEnum } from '@src/app/model/database-collection.enum';
import { FileLoadingService } from '@src/app/services/file-loading.service';

import { getRxStorageDexie } from 'rxdb/plugins/dexie';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import {
  addRxPlugin,
  createRxDatabase,
  RxChangeEvent,
  RxCollection,
  RxDatabase,
  RxDocument,
} from 'rxdb';
import { from, Observable, switchMap, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private _trackDB: RxDatabase;
  private _trackCollection: RxCollection;
  private _playlistCollection: RxCollection;

  constructor(private fileLoadingService: FileLoadingService) {
    addRxPlugin(RxDBUpdatePlugin);
  }

  public get databaseChanges$(): Observable<RxChangeEvent<unknown>> {
    return this._trackDB.$;
  }

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
    return this._trackCollection
      .find()
      .exec()
      .then((documents: RxDocument[]) =>
        documents.map((trackDocument: RxDocument) => trackDocument.toMutableJSON() as Track)
      );
  }

  public updateTrack$(track: Track): Observable<unknown> {
    return this.getTrackDocument$(track).pipe(
      switchMap((document: RxDocument) => document.update(track))
    );
  }

  public getPlaylists(): Promise<Playlist[]> {
    return this._playlistCollection
      .find()
      .exec()
      .then((documents: RxDocument[]) =>
        documents.map(
          (playlistDocument: RxDocument) => playlistDocument.toMutableJSON() as Playlist
        )
      );
  }

  public createPlaylist(name?: string): Promise<void> {
    const id: string = `${Math.floor(Math.random() * 1000)}`;
    const playlist: Playlist = {
      id,
      name: name || PlaylistDefaultsEnum.NAME + id,
      thumbUrl: PlaylistDefaultsEnum.THUMBURL,
      tracks: [],
    };
    return this._playlistCollection.upsert(playlist);
  }

  public deletePlaylist$(playlist: Playlist): Observable<boolean> {
    return this.getPlaylistDocument$(playlist).pipe(
      switchMap((document: RxDocument) => document.remove())
    );
  }

  public updatePlaylist$(playlist: Playlist): Observable<unknown> {
    return this.getPlaylistDocument$(playlist).pipe(
      switchMap((document: RxDocument) => document.update(playlist))
    );
  }

  public getPlaylistTrackPopulation$(playlist: Playlist): Observable<Track[]> {
    return this.getPlaylistDocument$(playlist).pipe(
      switchMap((document: RxDocument) => from(document.populate('tracks')))
    );
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

  private getPlaylistDocument$(playlist: Playlist): Observable<RxDocument> {
    return this._playlistCollection
      .findOne({
        selector: {
          id: playlist.id,
        },
      })
      .$.pipe(take(1));
  }

  private getTrackDocument$(track: Track): Observable<RxDocument> {
    return this._trackCollection
      .findOne({
        selector: {
          uri: track.uri,
        },
      })
      .$.pipe(take(1));
  }
}
