import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';

import { Track } from '@src/app/model/track.interface';

import { Howl } from 'howler';

@Injectable({
  providedIn: 'root',
})
export class MusicControlService {
  private _currentTrackData: Track;
  private _currentTrackAudio: HTMLAudioElement = new Audio();

  public playTrack(track: Track): void {
    // this._currentTrack = track;
    // if (this._currentHowl) {
    //   this._currentHowl.stop();
    // }
    this._currentTrackAudio.pause();
    this._currentTrackAudio = new Audio(track.uri);
    this._currentTrackAudio.play();
    this._currentTrackData = track;
  }
}
