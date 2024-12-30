import { Track } from '@src/app/db/domain/track';

export interface Playlist {
  id: string;
  name: string;
  tracks: string[];
  thumbSrc: string;
  trackPopulation?: Track[];
}

export enum PlaylistDefaultsEnum {
  NAME = 'Playlist #',
  THUMBSRC = 'assets/note.jpg',
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
