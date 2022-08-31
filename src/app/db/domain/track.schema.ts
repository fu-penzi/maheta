import { RxJsonSchema } from 'rxdb';

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
