import { Track } from '@src/app/db/domain/track.schema';

import { RxJsonSchema } from 'rxdb';

export enum PlaylistDefaultsEnum {
  NAME = 'Playlist #',
  THUMBURL = 'assets/note.jpg',
}

export interface Playlist {
  id: string;
  name: string;
  tracks: string[];
  thumbUrl: string;
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
    thumbUrl: PlaylistDefaultsEnum.THUMBURL,
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
    thumbUrl: {
      type: 'string',
    },
    trackPopulation: {
      type: 'array',
    },
  },
  required: ['id', 'name', 'thumbUrl', 'tracks'],
};
