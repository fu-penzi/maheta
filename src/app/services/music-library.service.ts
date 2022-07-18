import { Injectable } from '@angular/core';

import { Track } from '@src/app/model/track.types';
import { tracksMock } from '@src/mock/tracks';

@Injectable({
  providedIn: 'root',
})
export class MusicLibraryService {
  private _tracks: Track[];

  public get tracks(): Track[] {
    return this._tracks;
  }

  public set tracks(tracks: Track[]) {
    if (tracks.length === 0) {
      this._tracks = tracksMock;
    } else {
      this._tracks = tracks;
    }
  }
}
