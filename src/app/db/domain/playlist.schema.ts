import { Playlist } from '@src/app/db/domain/playlist';

import { RxJsonSchema } from 'rxdb';

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
    thumbSrc: {
      type: 'string',
    },
    trackPopulation: {
      type: 'array',
    },
  },
  required: ['id', 'name', 'thumbSrc', 'tracks'],
};
