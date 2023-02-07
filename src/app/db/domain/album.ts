import { Track } from '@src/app/db/domain/track.schema';

export interface Album {
  title: string;
  author: string;
  thumbUrl: string;
  tracks: Track[];
  year?: number;
}

export enum AlbumDefaultsEnum {
  TITLE = 'Unknown',
  AUTHOR = 'Unknown',
  THUMBURL = 'assets/note.jpg',
}

export function getDefaultAlbum(): Album {
  return {
    title: AlbumDefaultsEnum.TITLE,
    tracks: [],
    thumbUrl: AlbumDefaultsEnum.THUMBURL,
    author: AlbumDefaultsEnum.AUTHOR,
  };
}
