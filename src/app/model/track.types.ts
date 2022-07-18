export interface Track {
  title: string;
  author: string;
  uri: string;
  thumbUrl?: string;
  duration?: number;
}

export enum TrackDefaultsEnum {
  TITLE = 'Unknown',
  AUTHOR = 'Unknown',
}
