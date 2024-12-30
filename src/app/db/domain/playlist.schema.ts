import { Track } from '@src/app/db/domain/track';

import { RxJsonSchema } from 'rxdb';

export enum PlaylistDefaultsEnum {
  NAME = 'Playlist #',
  THUMBSRC = 'assets/note.jpg',
}

export interface Playlist {
  id: string;
  name: string;
  tracks: string[];
  thumbSrc: string;
  trackPopulation?: Track[];
}

export enum PlaylistPopulationEnum {
  tracks = 'tracks',
}

export function getPlaylistObject(name?: string): Playlist {
  const id: string = `${Math.floor(Math.random() * 1000)}`;
  return {
    id,
    name: name || PlaylistDefaultsEnum.NAME + id,
    thumbSrc: PlaylistDefaultsEnum.THUMBSRC,
    tracks: [],
  };
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
    thumbSrc: {
      type: 'string',
    },
    trackPopulation: {
      type: 'array',
    },
  },
  required: ['id', 'name', 'thumbSrc', 'tracks'],
};
