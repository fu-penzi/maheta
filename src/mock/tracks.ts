import { Capacitor } from '@capacitor/core';

import { Track } from '@src/app/db/domain/track';
import { getTrackObject } from '@src/app/helpers/track.helper';
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
