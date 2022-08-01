import { Injectable } from '@angular/core';

import { QueueService } from '@src/app/services/queue.service';
import { tracksMock } from '@src/mock/tracks';
import { Track } from '@src/app/db/domain/track.schema';

@Injectable()
export class MusicControlService {
  private _playing: boolean = false;
  private _nextQueue: Track[] | null = null;
  private _currentTrackAudio: HTMLAudioElement = new Audio();

  constructor(private queueService: QueueService<Track>) {}

  public get isPlaying(): boolean {
    return this._playing;
  }

  public get currentTrack(): Track {
    // if (this.queueService.currentItem?.track) {
    return this.queueService.currentItem;
    // }
    return tracksMock[0];
  }

  private get currentTrackAudio(): HTMLAudioElement {
    return this._currentTrackAudio;
  }

  public set nextQueue(tracks: Track[]) {
    if (this._nextQueue !== tracks) {
      this._nextQueue = tracks;
    }
  }

  public playPosition(position: number): void {
    if (this._nextQueue) {
      console.log('tekst dolny');
      this.setQueue(this._nextQueue);
      this._nextQueue = null;
    }

    this.setQueuePosition(position);
    this.updateCurrentTrackAudio();

    this.play();
  }

  public play(): void {
    this.currentTrackAudio.play();
    this._playing = true;
  }

  public pause(): void {
    this.currentTrackAudio.pause();
    this._playing = false;
  }

  public next(): void {
    this.queueService.moveBy(1);
    this.updateCurrentTrackAudio();

    if (this._playing) {
      this.play();
    }
  }

  public prev(): void {
    this.queueService.moveBy(-1);
    this.updateCurrentTrackAudio();

    if (this._playing) {
      this.play();
    }
  }

  private setQueue(tracks: Track[]): void {
    this.queueService.clear();
    this.queueService.add(tracks);
  }

  private setQueuePosition(position: number): void {
    this.currentTrackAudio.pause();
    this.queueService.moveTo(position);
    this.currentTrackAudio.play();
  }

  private updateCurrentTrackAudio(): void {
    this._currentTrackAudio.pause();
    this._currentTrackAudio = new Audio(this.currentTrack.src);
  }
}
