import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import {
  Directory,
  Filesystem,
  ReaddirResult,
  ReadFileResult,
  StatResult,
} from '@capacitor/filesystem';

import { MusicFileExtensionEnum } from '@src/app/model/music-file-extension.enum';
import { PlatformEnum } from '@src/app/model/platform.enum';
import { RestrictedDirectoriesEnum } from '@src/app/model/restricted-directories.enum';

import * as musicMetadata from 'music-metadata-browser';
import { IAudioMetadata } from 'music-metadata-browser';
import { Track, TrackDefaultsEnum } from '@src/app/db/domain/track.schema';

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
            uri: trackPath,
            src: Capacitor.convertFileSrc(trackPath),
            title: trackPath.split('/').pop() ?? TrackDefaultsEnum.TITLE,
            author: TrackDefaultsEnum.AUTHOR,
            thumbUrl: 'assets/note.jpg',
            // ...(metadata && { metadata: metadata }),
          };
        })
      );
    }
    return this._tracks;

    //TODO add db and handling for other platforms
    // this.testInitDatabase().catch((err) => console.error(`Failed on database init ${err}`));
  }

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
      .then((uriResult) => this.readDirRecursive(uriResult.uri))
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
