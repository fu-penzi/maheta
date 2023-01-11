import { Capacitor } from '@capacitor/core';

import { getTrackObject, Track } from '@src/app/db/domain/track.schema';
const tracks: Track[] = [];
getTrackObject('assets/vp.mp3', Capacitor.convertFileSrc('assets/vp.mp3')).then((track) =>
  tracks.push(track)
);

export const tracksMock: Track[] = tracks;
