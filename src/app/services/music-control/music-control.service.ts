import { Injectable } from '@angular/core';

import { Track } from '@src/app/db/domain/track.schema';
import { QueueService } from '@src/app/services/queue.service';
import { tracksMock } from '@src/mock/tracks';

import { MusicControls } from '@awesome-cordova-plugins/music-controls/ngx';
import { interval, map, Observable } from 'rxjs';

@Injectable()
export class MusicControlService {
  private _playing: boolean = false;
  private _nextQueue: Track[] | null = null;
  private _currentTrackAudio: HTMLAudioElement;

  constructor(private queueService: QueueService<Track>, private musicControls: MusicControls) {
    this.setupCurrentTrackAudio();
    this.currentTrackValueChanges();
  }

  public get isPlaying(): boolean {
    return this._playing;
  }

  public get currentTrack(): Track {
    // if (this.queueService.currentItem?.track) {
    return this.queueService.currentItem;
    // }
    return tracksMock[0];
  }

  public get currentTrackTime(): Observable<number> {
    return interval(50).pipe(map(() => this._currentTrackAudio.currentTime));
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

    this.setQueuePosition(position);

    this.play();
  }

  public play(): void {
    this._currentTrackAudio.play();
    this._playing = true;
  }

  public pause(): void {
    this._currentTrackAudio.pause();
    this._playing = false;
  }

  public next(): void {
    this.queueService.moveBy(1);

    if (this._playing) {
      this.play();
    }
  }

  public prev(): void {
    this.queueService.moveBy(-1);

    if (this._playing) {
      this.play();
    }
  }

  public seekTo(time: number): void {
    if (typeof this._currentTrackAudio.fastSeek === 'function') {
      this._currentTrackAudio.fastSeek(time);
    } else {
      this._currentTrackAudio.currentTime = time;
    }
  }

  private setQueue(tracks: Track[]): void {
    this.queueService.clear();
    this.queueService.add(tracks);
  }

  private setQueuePosition(position: number): void {
    this._currentTrackAudio.pause();
    this.queueService.moveTo(position);
    this._currentTrackAudio.play();
  }

  private updateCurrentTrackAudio(): void {
    this._currentTrackAudio.pause();
    this._currentTrackAudio.src = this.currentTrack.src;
  }

  private setupNativeMusicControls(currentTrack: Track): void {
    this.musicControls.destroy();
    this.musicControls.create({
      track: currentTrack.title,
      artist: currentTrack.author,
      isPlaying: this.isPlaying,
      dismissable: true,
      hasSkipForward: true,
      hasSkipBackward: true,

      ticker: 'Now playing "Time is Running Out"',
      playIcon: 'media_play',
      pauseIcon: 'media_pause',
      prevIcon: 'media_prev',
      nextIcon: 'media_next',
      closeIcon: 'media_close',
      notificationIcon: 'notification',
    });

    this.musicControls.subscribe().subscribe((action) => {
      const message = JSON.parse(action).message;
      switch (message) {
        case 'music-controls-next':
          this.next();
          break;
        case 'music-controls-previous':
          this.prev();
          break;
        case 'music-controls-pause':
          this.pause();
          break;
        case 'music-controls-play':
          this.play();
          break;
        case 'music-controls-destroy':
          break;

        case 'music-controls-media-button':
          this.play();
          break;
        case 'music-controls-headset-unplugged':
          this.pause();
          break;
        case 'music-controls-headset-plugged':
          break;
        default:
          break;
      }
      this.musicControls.updateIsPlaying(this.isPlaying);
    });

    this.musicControls.listen();
  }

  private currentTrackValueChanges(): void {
    this.queueService.currentItem$.subscribe((currentTrack: Track) => {
      this.updateCurrentTrackAudio();
      this.setupNativeMusicControls(currentTrack);
    });
  }

  private setupCurrentTrackAudio(): void {
    this._currentTrackAudio = new Audio();
    this._currentTrackAudio.addEventListener('ended', () => {
      this.next();
    });
  }
}
