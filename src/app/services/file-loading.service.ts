import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem, ReaddirResult, StatResult } from '@capacitor/filesystem';

import { Track, TrackDefaultsEnum } from '@src/app/db/domain/track.schema';
import { LocalStorageEnum } from '@src/app/model/localStorage.enum';
import { MusicFileExtensionEnum } from '@src/app/model/music-file-extension.enum';
import { PlatformEnum } from '@src/app/model/platform.enum';
import { ReadOptionsLocalStorage } from '@src/app/model/read-options-local.storage';
import { RestrictedDirectoriesEnum } from '@src/app/model/restricted-directories.enum';

import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';
import { isArray } from 'lodash';
import * as musicMetadata from 'music-metadata-browser';
import { IAudioMetadata } from 'music-metadata-browser';
import { concatMap, from, Observable, of, ReplaySubject, Subject, takeUntil, tap } from 'rxjs';

enum FileTypeEnum {
  FILE = 'file',
  DIR = 'directory',
}

export interface TrackLoadingResult {
  tracksWithoutMetadata: Track[];
  trackWithMetadata$: Observable<Track>;
}

const defaultReadOptions: ReadOptionsLocalStorage = {
  path: '',
  directory: Directory.ExternalStorage,
};

@Injectable({
  providedIn: 'root',
})
export class FileLoadingService {
  public trackUpdate$: ReplaySubject<Track> = new ReplaySubject<Track>();

  private _trackPathsSet: Set<string> = new Set<string>();
  private _onReload$: Subject<void> = new Subject<void>();

  constructor(private diagnostic: Diagnostic) {}

  public async loadTracks(): Promise<TrackLoadingResult> {
    this._onReload$.next();
    if (Capacitor.getPlatform() !== PlatformEnum.ANDROID) {
      return {
        tracksWithoutMetadata: [],
        trackWithMetadata$: of(),
      };
    }

    const readOptionsArray: ReadOptionsLocalStorage[] = await this.getReadOptions();
    for (const readOptions of readOptionsArray) {
      const trackPaths = await this.readTrackPaths(readOptions);
      trackPaths.forEach((trackPath: string) => this._trackPathsSet.add(trackPath));
    }

    const tracks: Track[] = [...this._trackPathsSet].map((trackPath) =>
      this.getTrackObject(trackPath, Capacitor.convertFileSrc(trackPath))
    );
    return {
      tracksWithoutMetadata: tracks,
      trackWithMetadata$: this.loadTracksMetadata(tracks),
    };
  }

  private loadTracksMetadata(tracks: Track[]): Observable<Track> {
    return of(...tracks).pipe(
      concatMap((track: Track) => from(this.getTrackWithMetadata(track.uri))),
      tap((track: Track) => this.trackUpdate$.next(track)),
      takeUntil(this._onReload$)
    );
  }

  private async getReadOptions(): Promise<ReadOptionsLocalStorage[]> {
    const sdCardReadOptions: ReadOptionsLocalStorage[] = await this.diagnostic
      .isExternalStorageAuthorized()
      .then((isAuthorized: boolean) =>
        isAuthorized ? [] : this.diagnostic.requestExternalStorageAuthorization()
      )
      .then(() => this.diagnostic.isExternalStorageAuthorized())
      .then((isAuthorized: boolean) =>
        isAuthorized ? [] : this.diagnostic.getExternalSdCardDetails()
      )
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

  private async getTrackWithMetadata(trackPath: string): Promise<Track> {
    const capacitorPath: string = Capacitor.convertFileSrc(trackPath);
    const metadata = await musicMetadata
      .fetchFromUrl(capacitorPath)
      .catch((err) => console.error(`Failed to get ${trackPath} metadata: ${err}`));

    return this.getTrackObject(trackPath, capacitorPath, metadata ?? undefined);
  }

  private getTrackObject(
    trackPath: string,
    capacitorPath: string,
    metadata?: IAudioMetadata | undefined
  ): Track {
    return {
      uri: trackPath,
      src: capacitorPath,
      title: metadata?.common.title ?? trackPath.split('/').pop() ?? TrackDefaultsEnum.TITLE,
      author: metadata?.common.artist ?? TrackDefaultsEnum.AUTHOR,
      album: metadata?.common.album ?? TrackDefaultsEnum.ALBUM,
      thumbUrl: metadata?.common.picture
        ? `data:${
            metadata?.common.picture[0].format
          };base64,${metadata?.common.picture[0].data.toString('base64')}`
        : TrackDefaultsEnum.THUMBURL,
      duration: metadata?.format.duration ?? 0,
    };
  }

  private readTrackPaths(readOptions: ReadOptionsLocalStorage): Promise<string[]> {
    return Filesystem.stat(readOptions)
      .then((uriResult) => this.readDirRecursive(uriResult.uri))
      .then((res) => [res].flat(Infinity).filter((t: unknown) => typeof t == 'string' && !!t))
      .then((res) => res as string[])
      .catch((err) => {
        console.error(
          `Error: ${err} occurred when loading tracks from directory:${readOptions.path}`
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
