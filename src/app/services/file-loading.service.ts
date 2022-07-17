import { Injectable } from '@angular/core';

import { Capacitor } from '@capacitor/core';
import {
  Directory,
  Filesystem,
  GetUriResult,
  ReaddirResult,
  ReadFileResult,
  StatResult,
} from '@capacitor/filesystem';

import { getRxStorageDexie } from 'rxdb/plugins/dexie';
import { createRxDatabase } from 'rxdb';

const restrictedDirs: string[] = ['Android'];
enum FileTypeEnum {
  FILE = 'file',
  DIR = 'directory',
}
@Injectable()
export class FileLoadingService {
  private _trackDirPath: string = '';
  private _trackPaths: string[];
  public loadMusic(): void {
    if (Capacitor.getPlatform() === 'android') {
      Filesystem.getUri({
        path: this._trackDirPath,
        directory: Directory.ExternalStorage,
      })
        .then((uriResult: GetUriResult) => this.readDirRecursive(uriResult.uri))
        .then((res) => [res].flat(Infinity).filter((t: unknown) => typeof t === 'string' && !!t))
        .then((res) => (this._trackPaths = res as string[]))
        .catch((err) =>
          console.error(
            `Error: ${err} occurred when loading tracks from directory:${this._trackDirPath}`
          )
        );
    }

    this.testInitDatabase().catch((err) => console.error(`Failed on database init ${err}`));
  }

  private async testInitDatabase() {
    console.log(Capacitor.getPlatform());
    const myDatabase = await createRxDatabase({
      name: 'tracksdb',
      storage: getRxStorageDexie(),
    });

    const mySchema = {
      title: 'track schema',
      version: 0,
      primaryKey: 'path',
      type: 'object',
      properties: {
        path: {
          type: 'string',
        },
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

          // number fields that are used in an index, must have set minimum, maximum and multipleOf
          minimum: 0,
          maximum: 150,
          multipleOf: 1,
        },
      },
      required: ['path', 'title', 'author', 'duration'],
      indexes: ['duration'],
    };
    const myCollections = await myDatabase.addCollections({
      tracks: {
        schema: mySchema,
      },
    });

    await myDatabase['tracks'].insert({
      path: `file///sdcard/206.mp3`,
      title: 'Lost Sanctuary',
      author: 'Adrian von Ziegler',
      thumbUrl: 'assets/3.webp',
      duration: 3,
    });

    await myDatabase['tracks'].insert({
      path: 'file///sdcard/test.mp3',
      title: 'Fack',
      author: 'Eminem',
      thumbUrl: 'assets/1.webp',
      duration: 5,
    });

    const docs = await myCollections.tracks.find().exec();
    docs.forEach((val) => val.$.subscribe((v: any) => console.warn(v)));
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
