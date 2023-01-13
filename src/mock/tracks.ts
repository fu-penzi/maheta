import { Capacitor } from '@capacitor/core';

import { getTrackObject, Track } from '@src/app/db/domain/track.schema';
const tracks: Track[] = [];
Array(500)
  .fill(1)
  .map((a, i) =>
    getTrackObject(`vp${i + 1}.mp3`, Capacitor.convertFileSrc('assets/vp.mp3')).then((track) =>
      tracks.push(track)
    )
  );

export const tracksMock: Track[] = tracks;
