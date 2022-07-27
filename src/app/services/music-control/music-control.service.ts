import { Injectable } from '@angular/core';

import { Track } from '@src/app/model/track.types';
import { QueueService } from '@src/app/services/queue.service';

@Injectable()
export class MusicControlService {
  private _playing: boolean = false;
  private _currentTrackAudio: HTMLAudioElement;
  private _nextQueue: Track[] | null = null;

  constructor(private queueService: QueueService<Track>) {}

  public get isPlaying(): boolean {
    return this._playing;
  }

  public get currentTrack(): Track {
    return this.queueService.currentItem;
  }

  public set nextQueue(tracks: Track[]) {
    if (this._nextQueue !== tracks) {
      this._nextQueue = tracks;
    }
  }

  public play(trackId?: number): void {
    this.pauseCurrentTrack();

    if (this._nextQueue) {
      this.setQueue(this._nextQueue);
      this._nextQueue = null;
    }
    if (trackId) {
      this.queueService.moveTo(trackId);
      this._currentTrackAudio = new Audio(this.currentTrack.src);
    }

    this.playCurrentTrack();
    this._playing = true;
  }

  public pause(): void {
    this.pauseCurrentTrack();
    this._playing = false;
  }

  public next(): void {
    this.pauseCurrentTrack();
    this.queueService.moveBy(1);
    this.updateCurrentTrackAudio();
    this.playCurrentTrack();
  }

  public prev(): void {
    this.pauseCurrentTrack();
    this.queueService.moveBy(-1);
    this.updateCurrentTrackAudio();
    this.playCurrentTrack();
  }

  private setQueue(tracks: Track[]): void {
    this.queueService.clear();
    this.queueService.add(tracks);
  }

  private pauseCurrentTrack(): void {
    if (this._currentTrackAudio) {
      this._currentTrackAudio.pause();
    }
  }

  private updateCurrentTrackAudio(): void {
    this._currentTrackAudio = new Audio(this.currentTrack.src);
  }

  private playCurrentTrack(): void {
    if (!this._currentTrackAudio) {
      this.updateCurrentTrackAudio();
    }
    this._currentTrackAudio.play();
  }
}
