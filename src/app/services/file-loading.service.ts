import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Device, DeviceInfo } from '@capacitor/device';
import { Directory, FileInfo, Filesystem, ReaddirResult, StatResult } from '@capacitor/filesystem';

import { Track } from '@src/app/db/domain/track';
import { getDefaultTrackObject, getTrackObject } from '@src/app/helpers/track.helper';
import { LocalStorageEnum } from '@src/app/model/localStorage.enum';
import { MusicFileExtensionEnum } from '@src/app/model/music-file-extension.enum';
import { PlatformEnum } from '@src/app/model/platform.enum';
import { ReadOptionsLocalStorage } from '@src/app/model/read-options-local.storage';
import { RestrictedDirectoriesEnum } from '@src/app/model/restricted-directories.enum';

import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';
import { isArray } from 'lodash';
import * as musicMetadata from 'music-metadata-browser';
import { IAudioMetadata } from 'music-metadata-browser';
import { from, mergeMap, Observable, of } from 'rxjs';

enum FileTypeEnum {
  FILE = 'file',
  DIR = 'directory',
}

const defaultReadOptions: ReadOptionsLocalStorage = {
  path: '',
  directory: Directory.ExternalStorage,
};

export interface TrackChanges {
  addTracks: Track[];
  deleteTracks: Track[];
}

const getFileReadingError = (err: any, path: string): string =>
  `Error: ${err} occurred when loading file: ${path}`;

export type TrackWithoutMetadata = Pick<Track, 'uri' | 'modificationTime' | 'src' | 'lyrics'>;

@Injectable({
  providedIn: 'root',
})
export class FileLoadingService {
  private _tracksMap: Map<string, TrackWithoutMetadata> = new Map();

  constructor(private diagnostic: Diagnostic) {}

  public async getTrackChanges(existingTracks: Track[]): Promise<TrackChanges> {
    const tracksWithoutMetadata: Track[] = await this.getTracksWithoutMetadata();
    const deleteTracks: Track[] = existingTracks.filter(
      (track: Track) => !this._tracksMap.has(track.uri)
    );

    return {
      addTracks: tracksWithoutMetadata.filter(
        (track: Track) =>
          !existingTracks.some(
            (existingTrack: Track) =>
              track.uri === existingTrack.uri &&
              track.modificationTime === existingTrack.modificationTime
          )
      ),
      deleteTracks,
    };
  }

  public getTracksWithMetadata$(tracks: Track[]): Observable<Track> {
    if (Capacitor.getPlatform() !== PlatformEnum.ANDROID) {
      return of(getDefaultTrackObject('', '', 0));
    }

    return of(...tracks).pipe(
      mergeMap((track: Track) => from(this.getTrackWithMetadata(track)), 10)
    );
  }

  private async getTracksWithoutMetadata(): Promise<Track[]> {
    if (Capacitor.getPlatform() !== PlatformEnum.ANDROID) {
      return [];
    }

    this._tracksMap.clear();
    const readOptionsArray: ReadOptionsLocalStorage[] = await this.getReadOptions();
    for (const readOptions of readOptionsArray) {
      const trackWithoutMetadata: TrackWithoutMetadata[] = await this.readTrackPaths(readOptions);

      for (const track of trackWithoutMetadata) {
        this._tracksMap.set(track.uri, track);
      }
    }

    return [...this._tracksMap.values()].map((track: TrackWithoutMetadata) =>
      getDefaultTrackObject(track.uri, track.src, track.modificationTime)
    );
  }

  private async getReadOptions(): Promise<ReadOptionsLocalStorage[]> {
    const deviceInfo: DeviceInfo = await Device.getInfo();
    const sdCardReadOptions: ReadOptionsLocalStorage[] = await this.diagnostic
      .isExternalStorageAuthorized()
      .then((isAuthorized: boolean) => {
        if (isAuthorized) {
          return [];
        }

        if (deviceInfo.androidSDKVersion && deviceInfo.androidSDKVersion > 33) {
          return this.diagnostic.requestRuntimePermissions([
            this.diagnostic.permission.READ_MEDIA_AUDIO,
            this.diagnostic.permission.READ_MEDIA_IMAGES,
          ]);
        }

        return this.diagnostic.requestExternalStorageAuthorization();
      })
      .then(() => this.diagnostic.getExternalSdCardDetails())
      .then((sdCardDetails: any) =>
        sdCardDetails
          ?.filter((sdCardDetail: any) => sdCardDetail?.path)
          ?.map((sdCardDetail: any) => ({
            path: sdCardDetail.path,
          }))
      );
    const systemDetectedReadOptions: ReadOptionsLocalStorage[] = [
      defaultReadOptions,
      ...sdCardReadOptions,
    ];
    const storageItem = localStorage.getItem(LocalStorageEnum.userTrackReadOptions);
    if (!storageItem) {
      return systemDetectedReadOptions;
    }

    const userReadOptions = JSON.parse(storageItem);
    if (!isArray(userReadOptions)) {
      return systemDetectedReadOptions;
    }

    userReadOptions.filter((readOption) => 'path' in readOption);
    return [...systemDetectedReadOptions, ...userReadOptions];
  }

  private async getTrackWithMetadata(track: Track): Promise<Track> {
    const mtime: number = await Filesystem.stat({ path: track.uri }).then(
      (stats: StatResult) => stats.mtime
    );
    const metadata: IAudioMetadata | null = await musicMetadata
      .fetchFromUrl(track.src)
      .catch((err) => {
        console.error(`Failed to get ${track.src} metadata: ${err}`);
        return null;
      });

    const fileModified: boolean = track.modificationTime === mtime;
    track.modificationTime = mtime;

    return getTrackObject(track, metadata, fileModified);
  }

  private readTrackPaths(readOptions: ReadOptionsLocalStorage): Promise<TrackWithoutMetadata[]> {
    return Filesystem.stat(readOptions)
      .then((uriResult) => this.readDirRecursive(uriResult.uri))
      .then((res) =>
        [res]
          .flat(Infinity)
          .filter(
            (t: unknown) =>
              !!t &&
              !!(t as TrackWithoutMetadata)?.uri &&
              typeof (t as TrackWithoutMetadata)?.uri == 'string'
          )
      )
      .then((res) => res as TrackWithoutMetadata[])
      .catch((err) => {
        console.error(
          `Error: ${err} occurred when loading tracks from directory:${readOptions.path}`
        );
        return [];
      });
  }

  private readDirRecursive = async (path: string): Promise<unknown> => {
    if (path.includes('#') || !(await this.isValidDir(path))) {
      return null;
    }
    const filePaths: string[] = await Filesystem.readdir({ path: path })
      .then((files: ReaddirResult) =>
        files.files
          .filter((file: FileInfo) => !file?.name.includes('#'))
          .map((file: FileInfo) => `${path}/${file.name}`)
      )
      .catch((err) => {
        getFileReadingError(err, path);
        return [];
      });

    if (!filePaths.length) {
      return null;
    }
    const promises: Promise<unknown>[] = filePaths.map(async (filePath: string) => {
      if (await this.isValidDir(filePath)) {
        return this.readDirRecursive(filePath);
      }
      const musicFile: TrackWithoutMetadata | null = await this.isValidMusicFile(filePath);

      return musicFile ? musicFile : null;
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
      )
      .catch((err) => {
        console.error(getFileReadingError(err, path));
        return false;
      });
  }

  private isValidMusicFile(path: string): Promise<TrackWithoutMetadata | null> {
    const validFileExtensions = Object.values(MusicFileExtensionEnum);
    const restrictedDirs = Object.values(RestrictedDirectoriesEnum);

    return Filesystem.stat({ path: path })
      .then((stats: StatResult) => {
        const isValidMusicFile =
          !!path &&
          !restrictedDirs.some((restrictedFile: string) => path.endsWith(restrictedFile)) &&
          validFileExtensions.some((validFileExtension) => path.endsWith(validFileExtension)) &&
          stats.type === FileTypeEnum.FILE;

        return isValidMusicFile
          ? {
              uri: path,
              modificationTime: stats.mtime,
              src: Capacitor.convertFileSrc(path),
            }
          : null;
      })
      .catch((err) => {
        console.error(getFileReadingError(err, path));
        return null;
      });
  }
}
