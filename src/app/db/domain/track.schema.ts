import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem, StatResult } from '@capacitor/filesystem';

import { Lyrics } from '@src/app/db/domain/lyrics';
import { compressAndSavePicture, randomFileName } from '@src/app/helpers/file.helper';
import { parseLyrics } from '@src/app/helpers/string.helper';
import { TrackWithoutMetadata } from '@src/app/services/file-loading.service';

import { ITag } from 'music-metadata/lib/type';
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
  lyrics?: Lyrics;
  modificationTime?: number;
}

export enum TrackDefaultsEnum {
  TITLE = 'Unknown',
  AUTHOR = 'Unknown',
  ALBUM = 'Unknown',
  THUMBURL = 'assets/note.jpg',
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
      type: 'object',
      properties: {
        isLrcFormat: {
          type: 'boolean',
        },
        text: {
          type: 'string',
        },
        lines: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              text: {
                type: 'string',
              },
              word: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    text: {
                      type: 'string',
                    },
                    showWhitespace: {
                      type: 'boolean',
                    },
                  },
                },
              },
              time: {
                type: 'number',
              },
            },
          },
        },
      },
    },
    modificationTime: {
      type: 'number',
    },
  },
  required: ['uri', 'src', 'title', 'author', 'duration', 'album', 'thumbUrl'],
  // indexes: ['duration'],
};

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
    lyrics: { isLrcFormat: false, text: '', lines: [] },
    metadataLoaded: false,
    modificationTime,
  };
}

export async function getTrackObject(
  trackWithoutMetadata: TrackWithoutMetadata,
  fileModified: boolean,
  lyrics?: Lyrics,
  metadata?: IAudioMetadata | undefined
): Promise<Track> {
  let thumbSrc: string | null = '';
  const picture: IPicture | undefined = metadata?.common.picture?.shift();
  const trackName: string | undefined =
    metadata?.common.title ?? trackWithoutMetadata.uri.split('/').pop();

  if (picture) {
    const pictureFileName: string = (metadata?.common.album || trackName || randomFileName())
      .trim()
      .replace(/#/g, '')
      .replace(/\s+/g, '_');

    /* Overwrite existing picture if music file modified */
    const thumbDetails: StatResult | null = await Filesystem.stat({
      path: pictureFileName,
      directory: Directory.Library,
    }).catch(() => null);

    thumbSrc = thumbDetails ? Capacitor.convertFileSrc(thumbDetails.uri) : null;

    if (fileModified && thumbSrc && thumbDetails?.mtime) {
      const secondsSinceLastModification: number = (Date.now() - thumbDetails.mtime) / 1000;
      thumbSrc =
        secondsSinceLastModification > 5
          ? await Filesystem.deleteFile({ path: pictureFileName, directory: Directory.Library })
              .then(() => compressAndSavePicture(picture, pictureFileName))
              .catch(() => null)
          : thumbSrc;
    }

    if (!thumbSrc) {
      thumbSrc = await compressAndSavePicture(picture, pictureFileName).catch(() => null);
    }
  }

  const lyricsMetadata: string | undefined =
    metadata?.common?.lyrics?.[0] ||
    metadata?.native['ID3v2.4']?.find((el: ITag) => el.id === 'USLT' || el.id === 'SYLT')?.value
      ?.text;

  return {
    uri: trackWithoutMetadata.uri,
    src: trackWithoutMetadata.src,
    title: trackName ?? TrackDefaultsEnum.TITLE,
    author: metadata?.common.artist?.trim() ?? TrackDefaultsEnum.AUTHOR,
    album: metadata?.common.album?.trim() ?? TrackDefaultsEnum.ALBUM,
    year: metadata?.common.year,
    thumbUrl: thumbSrc || TrackDefaultsEnum.THUMBURL,
    duration: metadata?.format.duration ?? 0,
    lyrics: lyricsMetadata ? parseLyrics(lyricsMetadata) : lyrics,
    metadataLoaded: true,
    modificationTime: trackWithoutMetadata.modificationTime,
  };
}
