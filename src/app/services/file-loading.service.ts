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

import { MusicFileExtensionEnum } from '@src/app/model/music-file-extension.enum';
import { PlatformEnum } from '@src/app/model/platform.enum';
import { RestrictedDirectoriesEnum } from '@src/app/model/restricted-directories.enum';
import { Track } from '@src/app/model/track.interface';

import { getRxStorageDexie } from 'rxdb/plugins/dexie';
import * as musicMetadata from 'music-metadata-browser';
import { IAudioMetadata } from 'music-metadata-browser';
import { createRxDatabase } from 'rxdb';

enum FileTypeEnum {
  FILE = 'file',
  DIR = 'directory',
}

@Injectable({
  providedIn: 'root',
})
export class FileLoadingService {
  // TODO _searchDirPath from user input (let user select library root)
  private _searchDirPath: string = 'Music';
  private _trackPaths: string[] = [];
  private _tracks: Track[] = [];

  public async loadMusic(): Promise<Track[]> {
    if (Capacitor.getPlatform() === PlatformEnum.ANDROID) {
      this._trackPaths = await this.readMusicPaths();
      this._tracks = await Promise.all(
        this._trackPaths.map(async (trackPath) => {
          // const metadata = await this.readTrackMetadata(trackPath).catch((err) =>
          //   console.error(`Failed to get ${trackPath} metadata: ${err}`)
          // );
          return {
            uri: Capacitor.convertFileSrc(trackPath),
            title: trackPath.split('/').pop(),
            // ...(metadata && { metadata: metadata }),
          };
        })
      );
    }
    return this._tracks;

    //TODO add db and handling for other platforms
    // this.testInitDatabase().catch((err) => console.error(`Failed on database init ${err}`));
  }

  // private async testInitDatabase() {
  //   console.log(Capacitor.getPlatform());
  //   const myDatabase = await createRxDatabase({
  //     name: 'tracksdb',
  //     storage: getRxStorageDexie(),
  //   });
  //
  //   const mySchema = {
  //     title: 'track schema',
  //     version: 0,
  //     primaryKey: 'path',
  //     type: 'object',
  //     properties: {
  //       path: {
  //         type: 'string',
  //       },
  //       title: {
  //         type: 'string',
  //         maxLength: 100, // <- the primary key must have set maxLength
  //       },
  //       author: {
  //         type: 'string',
  //       },
  //       thumbUrl: {
  //         type: 'string',
  //       },
  //       duration: {
  //         description: 'track duration',
  //         type: 'integer',
  //
  //         // number fields that are used in an index, must have set minimum, maximum and multipleOf
  //         minimum: 0,
  //         maximum: 150,
  //         multipleOf: 1,
  //       },
  //     },
  //     required: ['path', 'title', 'author', 'duration'],
  //     indexes: ['duration'],
  //   };
  //   const myCollections = await myDatabase.addCollections({
  //     tracks: {
  //       schema: mySchema,
  //     },
  //   });
  //
  //   await myDatabase['tracks'].insert({
  //     path: `file///sdcard/206.mp3`,
  //     title: 'Lost Sanctuary',
  //     author: 'Adrian von Ziegler',
  //     thumbUrl: 'assets/3.webp',
  //     duration: 3,
  //   });
  //
  //   await myDatabase['tracks'].insert({
  //     path: 'file///sdcard/test.mp3',
  //     title: 'Fack',
  //     author: 'Eminem',
  //     thumbUrl: 'assets/1.webp',
  //     duration: 5,
  //   });
  //
  //   const docs = await myCollections.tracks.find().exec();
  //   docs.forEach((val) => val.$.subscribe((v: any) => console.warn(v)));
  //   await myDatabase.remove();
  // }

  // private readMusicMetadata(): void {}

  private readTrackMetadata(path: string): Promise<IAudioMetadata> {
    return Filesystem.readFile({ path: path })
      .then((res: ReadFileResult) => fetch(`data:audio/mpeg;base64, ${res.data}`))
      .then((res: Response) => res.blob())
      .then((res: Blob) => musicMetadata.parseBlob(res));
    // .catch((error) => console.error(error));
  }

  private readMusicPaths(): Promise<string[]> {
    //TODO change getUri params
    return Filesystem.getUri({
      path: this._searchDirPath,
      directory: Directory.ExternalStorage,
    })
      .then((uriResult) => this.readDirRecursive(`/storage/3833-3334`))
      .then((res) => [res].flat(Infinity).filter((t: unknown) => typeof t == 'string' && !!t))
      .then((res) => res as string[])
      .catch((err) => {
        console.error(
          `Error: ${err} occurred when loading tracks from directory:${this._searchDirPath}`
        );
        return [];
      });
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
    const restrictedDirs = Object.values(RestrictedDirectoriesEnum);

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
    const validFileExtensions = Object.values(MusicFileExtensionEnum);
    const restrictedDirs = Object.values(RestrictedDirectoriesEnum);

    return Filesystem.stat({ path: path })
      .then((stats: StatResult) => stats.type)
      .then(
        (fileType: string) =>
          !!path &&
          !restrictedDirs.some((restrictedFile: string) => path.endsWith(restrictedFile)) &&
          validFileExtensions.some((validFileExtension) => path.endsWith(validFileExtension)) &&
          fileType === FileTypeEnum.FILE
      );
  }
}
