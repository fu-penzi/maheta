import { IAudioMetadata } from 'music-metadata-browser';

export interface Track {
  uri?: string;
  metadata?: IAudioMetadata;
  title?: string;
  author?: string;
  thumbUrl?: string;
  duration?: number;
}
