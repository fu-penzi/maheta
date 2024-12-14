import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem, StatResult, WriteFileResult } from '@capacitor/filesystem';

import { TrackWithoutMetadata } from '@src/app/services/file-loading.service';

import { IAudioMetadata, IPicture } from 'music-metadata-browser';
import { RxJsonSchema } from 'rxdb';

export interface Track {
  uri: string;
  src: string;
  title: string;
  author: string;
  album: string;
  thumbUrl: string;
  duration: number;
  year?: number;
  metadataLoaded?: boolean;
  lyrics?: string;
  modificationTime?: number;
}

export enum TrackDefaultsEnum {
  TITLE = 'Unknown',
  AUTHOR = 'Unknown',
  ALBUM = 'Unknown',
  THUMBURL = 'assets/note.jpg',
}

export function getDefaultTrackObject(
  trackPath?: string,
  capacitorPath?: string,
  modificationTime?: number
): Track {
  return {
    uri: trackPath || '',
    src: capacitorPath || '',
    title: trackPath?.split('/').pop() ?? TrackDefaultsEnum.TITLE,
    author: TrackDefaultsEnum.AUTHOR,
    album: TrackDefaultsEnum.ALBUM,
    thumbUrl: TrackDefaultsEnum.THUMBURL,
    duration: 0,
    lyrics: '',
    metadataLoaded: false,
    modificationTime,
  };
}

export async function getTrackObject(
  trackWithoutMetadata: TrackWithoutMetadata,
  fileModified: boolean,
  lyrics?: string,
  metadata?: IAudioMetadata | undefined
): Promise<Track> {
  let thumbSrc: string | null = '';
  const picture: IPicture | undefined = metadata?.common.picture?.shift();
  if (picture) {
    const albumName: string = metadata?.common.album || `${Math.random() * 2342412342352}`;

    /* Overwrite existing picture if music file modified */
    const thumbDetails: StatResult | null = await Filesystem.stat({
      path: albumName,
      directory: Directory.Library,
    }).catch(() => null);

    thumbSrc = thumbDetails ? Capacitor.convertFileSrc(thumbDetails.uri) : null;

    if (fileModified && thumbSrc && thumbDetails?.mtime) {
      const secondsSinceLastModification: number = (Date.now() - thumbDetails.mtime) / 1000;
      thumbSrc =
        secondsSinceLastModification > 5
          ? await Filesystem.deleteFile({ path: albumName, directory: Directory.Library })
              .then(() => compressAndSavePicture(picture, albumName))
              .catch(() => null)
          : thumbSrc;
    }

    if (!thumbSrc) {
      thumbSrc = await compressAndSavePicture(picture, albumName).catch(() => null);
    }
  }

  return {
    uri: trackWithoutMetadata.uri,
    src: trackWithoutMetadata.src,
    title:
      metadata?.common.title ??
      trackWithoutMetadata.uri.split('/').pop() ??
      TrackDefaultsEnum.TITLE,
    author: metadata?.common.artist?.trim() ?? TrackDefaultsEnum.AUTHOR,
    album: metadata?.common.album?.trim() ?? TrackDefaultsEnum.ALBUM,
    year: metadata?.common.year,
    thumbUrl: thumbSrc || TrackDefaultsEnum.THUMBURL,
    duration: metadata?.format.duration ?? 0,
    lyrics: lyrics || '',
    metadataLoaded: true,
    modificationTime: trackWithoutMetadata.modificationTime,
  };
}

function compressAndSavePicture(picture: IPicture, albumName: string): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();

    img.src = `data:${picture.format};base64,${picture.data.toString('base64')}`;

    img.onload = async (e: any) => {
      const canvas: HTMLCanvasElement = document.createElement('canvas');
      const ratio: number = 500 / e.target.width;

      canvas.width = 500;
      canvas.height = e.target.height * ratio;

      const context = canvas.getContext('2d') as CanvasRenderingContext2D;
      context.drawImage(img, 0, 0, canvas.width, canvas.height);

      const quality: number = 70;
      const thumbPath = await Filesystem.writeFile({
        path: albumName,
        data: context.canvas.toDataURL('image/jpeg', quality),
        directory: Directory.Library,
      }).then((res: WriteFileResult) => Capacitor.convertFileSrc(res.uri));

      resolve(thumbPath);
    };

    img.onerror = () => {
      resolve(null);
    };
  });
}

export const trackSchema: RxJsonSchema<Track> = {
  title: 'track schema',
  version: 0,
  primaryKey: 'uri',
  type: 'object',
  properties: {
    uri: {
      type: 'string',
      maxLength: 10000, // <- the primary key must have set maxLength
    },
    src: {
      type: 'string',
    },
    title: {
      type: 'string',
    },
    author: {
      type: 'string',
    },
    thumbUrl: {
      type: 'string',
    },
    album: {
      type: 'string',
    },
    metadataLoaded: {
      type: 'boolean',
    },
    year: {
      type: 'number',
    },
    duration: {
      description: 'track duration',
      type: 'number',
    },
    lyrics: {
      type: 'string',
    },
    modificationTime: {
      type: 'number',
    },
  },
  required: ['uri', 'src', 'title', 'author', 'duration', 'album', 'thumbUrl'],
  // indexes: ['duration'],
};
