import { RxJsonSchema } from 'rxdb';

export interface Playlist {
  id: string;
  name: string;
  tracks: string[];
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
      type: 'string',
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
  required: ['id', 'name', 'thumbUrl', 'tracks'],
};
