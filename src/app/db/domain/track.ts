import { Lyrics } from '@src/app/db/domain/lyrics';

export interface Track {
  uri: string;
  src: string;
  title: string;
  author: string;
  album: string;
  thumbSrc: string;
  thumbFileName: string;
  duration: number;
  year?: number;
  metadataLoaded?: boolean;
  lyrics?: Lyrics;
  number?: number | null;
  modificationTime?: number;
}

export enum TrackDefaultsEnum {
  TITLE = 'Unknown',
  AUTHOR = 'Unknown',
  ALBUM = 'Unknown',
  THUMBSRC = 'assets/note.jpg',
  THUMBFILENAME = 'note.jpg',
}
