import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem, WriteFileResult } from '@capacitor/filesystem';

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
}

export enum TrackDefaultsEnum {
  TITLE = 'Werfaerwf fw fawef wef gaer gar ',
  AUTHOR = 'Ulfric Stormcloak',
  ALBUM = 'Unknown',
  THUMBURL = 'assets/note.jpg',
}

export function getDefaultTrackObject(trackPath?: string, capacitorPath?: string): Track {
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
  };
}

export async function getTrackObject(
  trackPath: string,
  capacitorPath: string,
  lyrics?: string,
  metadata?: IAudioMetadata | undefined
): Promise<Track> {
  let thumbUrl: string | undefined = '';
  const picture: IPicture | undefined = metadata?.common.picture?.shift();
  if (picture) {
    const albumName: string = metadata?.common.album || `${Math.random() * 2342412342352}`;
    thumbUrl = await Filesystem.stat({
      path: albumName,
      directory: Directory.Library,
    })
      .then((res) => Capacitor.convertFileSrc(res.uri))
      .catch(() => createPicture(picture, albumName));
  }
  return {
    uri: trackPath,
    src: capacitorPath,
    title: metadata?.common.title ?? trackPath.split('/').pop() ?? TrackDefaultsEnum.TITLE,
    author: metadata?.common.artist ?? TrackDefaultsEnum.AUTHOR,
    album: metadata?.common.album ?? TrackDefaultsEnum.ALBUM,
    year: metadata?.common.year,
    thumbUrl: thumbUrl || TrackDefaultsEnum.THUMBURL,
    duration: metadata?.format.duration ?? 0,
    lyrics: lyrics || '',
    metadataLoaded: true,
  };
}

function createPicture(picture: IPicture, albumName: string): Promise<string> {
  return Filesystem.writeFile({
    path: albumName,
    data: `data:${picture.format};base64,${picture.data.toString('base64')}`,
    directory: Directory.Library,
  }).then((res: WriteFileResult) => Capacitor.convertFileSrc(res.uri));
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
  },
  required: ['uri', 'src', 'title', 'author', 'duration', 'album', 'thumbUrl'],
  // indexes: ['duration'],
};
