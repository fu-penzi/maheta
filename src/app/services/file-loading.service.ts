import { Injectable } from '@angular/core';
import {
  Directory,
  Filesystem,
  GetUriResult,
  ReaddirResult,
  StatResult,
} from '@capacitor/filesystem';

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
    Filesystem.getUri({
      path: this._trackDirPath,
      directory: Directory.ExternalStorage,
    })
      .then((uriResult: GetUriResult) => this.readDirRecursive(uriResult.uri))
      .then((res) => (this._trackPaths = [res].flat(Infinity)))
      .then(() => console.error(this._trackPaths.filter((t: string) => !!t)))
      .catch((err) =>
        console.error(
          `Error: ${err} occurred when loading tracks from directory:${this._trackDirPath}`
        )
      );
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
