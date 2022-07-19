import { Injectable } from '@angular/core';

import { Track } from '@src/app/model/track.types';

@Injectable({
  providedIn: 'root',
})
export class MusicControlService {
  public currentTrack: Track;

  private _currentTrackAudio: HTMLAudioElement = new Audio();

  public playTrack(track: Track): void {
    this._currentTrackAudio.pause();
    this._currentTrackAudio = new Audio(track.src);
    this._currentTrackAudio.play();
    this.currentTrack = track;
  }
}
