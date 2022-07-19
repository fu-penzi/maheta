export interface Track {
  uri: string;
  src: string;
  title: string;
  author: string;
  thumbUrl?: string;
  duration?: number;
}

export enum TrackDefaultsEnum {
  TITLE = 'Unknown',
  AUTHOR = 'Unknown',
}
