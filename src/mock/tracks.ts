import { Capacitor } from '@capacitor/core';

import { getTrackObject, Track } from '@src/app/db/domain/track.schema';
const tracks: Track[] = [];
Array(500)
  .fill(1)
  .map((a, i) =>
    getTrackObject(
      {
        uri: `vp${i + 1}.mp3`,
        src: Capacitor.convertFileSrc('assets/vp.mp3'),
        modificationTime: 0,
      },
      false
    ).then((track) => tracks.push(track))
  );

export const tracksMock: Track[] = tracks;
