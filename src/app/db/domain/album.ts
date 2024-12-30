import { Track } from '@src/app/db/domain/track';

export interface Album {
  title: string;
  author: string;
  thumbSrc: string;
  tracks: Track[];
  year?: number;
}

export enum AlbumDefaultsEnum {
  TITLE = 'Unknown',
  AUTHOR = 'Unknown',
  THUMBSRC = 'assets/note.jpg',
}

export function getDefaultAlbum(): Album {
  return {
    title: AlbumDefaultsEnum.TITLE,
    tracks: [],
    thumbSrc: AlbumDefaultsEnum.THUMBSRC,
    author: AlbumDefaultsEnum.AUTHOR,
  };
}
