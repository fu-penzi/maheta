import { IAudioMetadata } from 'music-metadata-browser';
import { RxJsonSchema } from 'rxdb';
import { Directory, Filesystem, WriteFileResult } from '@capacitor/filesystem';
import { logger } from '@src/devUtils';
import { Capacitor } from '@capacitor/core';

export interface Track {
  uri: string;
  src: string;
  title: string;
  author: string;
  album: string;
  thumbUrl: string;
  duration: number;
  lyrics?: string;
}

export enum TrackDefaultsEnum {
  TITLE = 'Unknown',
  AUTHOR = 'Unknown',
  ALBUM = 'Unknown',
  THUMBURL = 'assets/note.jpg',
}

export function getDefaultTrackObject(trackPath: string, capacitorPath: string): Track {
  return {
    uri: trackPath,
    src: capacitorPath,
    title: trackPath.split('/').pop() ?? TrackDefaultsEnum.TITLE,
    author: TrackDefaultsEnum.AUTHOR,
    album: TrackDefaultsEnum.ALBUM,
    thumbUrl: TrackDefaultsEnum.THUMBURL,
    duration: 0,
    lyrics: '',
  };
}

export async function getTrackObject(
  trackPath: string,
  capacitorPath: string,
  lyrics?: string,
  metadata?: IAudioMetadata | undefined
): Promise<Track> {
  let thumbUrl: string = '';
  if (metadata?.common.picture) {
    thumbUrl = await Filesystem.writeFile({
      path: metadata?.common.album ? metadata?.common.album : `${Math.random() * 2342412342352}`,
      data: `data:${
        metadata?.common.picture[0].format
      };base64,${metadata?.common.picture[0].data.toString('base64')}`,
      directory: Directory.Library,
    }).then((res: WriteFileResult) => Capacitor.convertFileSrc(res.uri));
  }
  return {
    uri: trackPath,
    src: capacitorPath,
    title: metadata?.common.title ?? trackPath.split('/').pop() ?? TrackDefaultsEnum.TITLE,
    author: metadata?.common.artist ?? TrackDefaultsEnum.AUTHOR,
    album: metadata?.common.album ?? TrackDefaultsEnum.ALBUM,
    thumbUrl: thumbUrl || TrackDefaultsEnum.THUMBURL,
    duration: metadata?.format.duration ?? 0,
    lyrics: lyrics || '',
  };
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
    duration: {
      description: 'track duration',
      type: 'number',

      // number fields that are used in an index, must have set minimum, maximum and multipleOf
      // minimum: 0,
      // maximum: 150,
      // multipleOf: 1,
    },
    lyrics: {
      type: 'string',
    },
  },
  required: ['uri', 'src', 'title', 'author', 'duration', 'album', 'thumbUrl'],
  // indexes: ['duration'],
};
