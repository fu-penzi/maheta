import { Injectable } from '@angular/core';

import { Track } from '@src/app/model/track.types';
import { QueueService } from '@src/app/services/queue.service';

interface TrackInfo {
  track: Track;
  audio: HTMLAudioElement;
}

@Injectable()
export class MusicControlService {
  private _playing: boolean = false;
  private _nextQueue: Track[] | null = null;

  constructor(private queueService: QueueService<TrackInfo>) {}

  public get isPlaying(): boolean {
    return this._playing;
  }

  public get currentTrack(): Track {
    return this.queueService.currentItem.track;
  }

  private get currentTrackAudio(): HTMLAudioElement {
    return this.queueService.currentItem.audio;
  }

  public set nextQueue(tracks: Track[]) {
    if (this._nextQueue !== tracks) {
      this._nextQueue = tracks;
    }
  }

  public playPosition(position: number): void {
    if (this._nextQueue) {
      this.setQueue(this._nextQueue);
      this._nextQueue = null;
    }

    this.resetAudio(this.currentTrackAudio);
    this.setQueuePosition(position);

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
    this.resetAudio(this.currentTrackAudio);
    this.queueService.moveBy(1);

    if (this._playing) {
      this.play();
    }
  }

  public prev(): void {
    this.resetAudio(this.currentTrackAudio);
    this.queueService.moveBy(-1);

    if (this._playing) {
      this.play();
    }
  }

  private setQueue(tracks: Track[]): void {
    this.queueService.clear();
    const trackInfos: TrackInfo[] = tracks.map((track: Track) => {
      const audio: HTMLAudioElement = new Audio(track.src);
      audio.load();
      return {
        audio: audio,
        track: track,
      };
    });

    this.queueService.add(trackInfos);
  }

  private setQueuePosition(position: number): void {
    this.currentTrackAudio.pause();
    this.queueService.moveTo(position);
    this.currentTrackAudio.play();
  }

  private resetAudio(audio: HTMLAudioElement): void {
    audio.pause();
    audio.currentTime = 0;
  }
}
