import { Injectable } from '@angular/core';
import {
  Directory,
  Filesystem,
  GetUriResult,
  ReaddirResult,
  StatResult,
} from '@capacitor/filesystem';

import { createRxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/dexie';

import { Capacitor } from '@capacitor/core';

const restrictedDirs: string[] = ['Android'];
enum FileTypeEnum {
  FILE = 'file',
  DIR = 'directory',
}
@Injectable()
export class FileLoadingService {
  private _trackDirPath: string = '';
  private _trackPaths: any;
  constructor() {}

  public loadMusic(): void {
    if (Capacitor.getPlatform() === 'android') {
      Filesystem.getUri({
        path: this._trackDirPath,
        directory: Directory.ExternalStorage,
      })
        .then((uriResult: GetUriResult) => this.readDirRecursive(uriResult.uri))
        .then((res) => (this._trackPaths = [res].flat(Infinity)))
        .then(() => (this._trackPaths = this._trackPaths.filter((t: string) => !!t)))
        .catch((err) =>
          console.error(
            `Error: ${err} occurred when loading tracks from directory:${this._trackDirPath}`
          )
        );
    }

    this.testInitDatabase().catch((err) => console.error(`Failed on database init ${err}`));
  }

  private async testInitDatabase() {
    const myDatabase = await createRxDatabase({
      name: 'tracksdb',
      storage: getRxStorageDexie(),
    });

    const mySchema = {
      title: 'track schema',
      version: 0,
      primaryKey: 'title',
      type: 'object',
      properties: {
        title: {
          type: 'string',
          maxLength: 100, // <- the primary key must have set maxLength
        },
        author: {
          type: 'string',
        },
        thumbUrl: {
          type: 'string',
        },
        duration: {
          description: 'track duration',
          type: 'integer',

          // number fields that are used in an index, must have set minium, maximum and multipleOf
          minimum: 0,
          maximum: 150,
          multipleOf: 1,
        },
      },
      required: ['title', 'author', 'duration'],
      indexes: ['duration'],
    };

    const myCollections = await myDatabase.addCollections({
      tracks: {
        schema: mySchema,
      },
    });

    await myDatabase['tracks'].insert({
      title: 'Lost Sanctuary',
      author: 'Adrian von Ziegler',
      thumbUrl: 'assets/3.webp',
      duration: 3,
    });

    await myDatabase['tracks'].insert({
      title: 'Fack',
      author: 'Eminem',
      thumbUrl: 'assets/1.webp',
      duration: 5,
    });

    const docs = await myCollections.tracks.find().exec();
    docs.forEach((val) => val.$.subscribe((val: any) => console.warn(val)));
    await myDatabase.remove();
  }

  private readDirRecursive = async (path: string): Promise<unknown> => {
    const filePaths: string[] = await Filesystem.readdir({ path: path }).then(
      (files: ReaddirResult) => files.files.map((file: string) => `${path}/${file}`)
    );
    if (!filePaths.length || !(await this.isValidDir(path))) {
      return '';
    }

    const promises: Promise<unknown>[] = filePaths.map(async (filePath: string) => {
      if (await this.isValidDir(filePath)) {
        return this.readDirRecursive(filePath).catch((err) =>
          console.error(`Error: ${err} occurred when loading tracks from directory:${filePath}`)
        );
      }
      return (await this.isValidMusicFile(filePath)) ? filePath : '';
    });

    return Promise.all(promises);
  };

  private isValidDir(path: string): Promise<boolean> {
    return Filesystem.stat({ path: path })
      .then((stats: StatResult) => stats.type)
      .then(
        (fileType: string) =>
          !!path &&
          !restrictedDirs.some((restrictedFile: string) => path.endsWith(restrictedFile)) &&
          fileType === FileTypeEnum.DIR
      );
  }

  private isValidMusicFile(path: string): Promise<boolean> {
    return Filesystem.stat({ path: path })
      .then((stats: StatResult) => stats.type)
      .then(
        (fileType: string) =>
          !!path &&
          !restrictedDirs.some((restrictedFile: string) => path.endsWith(restrictedFile)) &&
          fileType === FileTypeEnum.FILE &&
          path.endsWith('.mp3')
      );
  }
}
