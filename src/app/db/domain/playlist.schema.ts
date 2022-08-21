import { RxJsonSchema } from 'rxdb';

export interface Playlist {
  id: number;
  name: string;
  tracks?: string[];
  thumbUrl: string;
}

export enum PlaylistDefaultsEnum {
  NAME = 'Playlist #',
  THUMBURL = 'assets/note.jpg',
}

export const playlistSchema: RxJsonSchema<Playlist> = {
  title: 'playlist schema',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'number',
      maxLength: 10000,
    },
    name: {
      type: 'string',
    },
    tracks: {
      type: 'array',
      ref: 'tracks',
      items: {
        type: 'string',
      },
    },
    thumbUrl: {
      type: 'string',
    },
  },
  required: ['id', 'name', 'thumbUrl'],
};
