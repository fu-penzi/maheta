import { Injectable } from '@angular/core';

import { Track } from '@src/app/db/domain/track.schema';
import { QueueService, RepeatModeEnum } from '@src/app/services/queue.service';

import { MusicControls } from '@awesome-cordova-plugins/music-controls/ngx';
import { interval, map, Observable, ReplaySubject, Subject } from 'rxjs';

@Injectable()
export class MusicControlService {
  private _playing: boolean = false;
  private _nextQueue: Track[] | null = null;
  private _currentTrackAudio: HTMLAudioElement;
  private _togglePlay$: Subject<void> = new Subject<void>();

  private _currentTrack$: ReplaySubject<Track> = new ReplaySubject<Track>();

  constructor(private musicControls: MusicControls, private queueService: QueueService<Track>) {
    this.setupCurrentTrackAudio();
    this.currentTrackValueChanges();
  }

  public get currentTrack$(): Observable<Track> {
    return this._currentTrack$.asObservable();
  }

  public get isPlaying(): boolean {
    return this._playing;
  }

  public set isPlaying(playing: boolean) {
    this._playing = playing;
    this._togglePlay$.next();
  }

  public get isShuffle(): boolean {
    return this.queueService.shuffle;
  }

  public set isShuffle(shuffle: boolean) {
    this.queueService.shuffle = shuffle;
  }

  public get isRepeatOne(): boolean {
    return this.queueService.isRepeatOne;
  }

  public get isRepeatQueue(): boolean {
    return this.queueService.isRepeatQueue;
  }

  public get repeatMode(): RepeatModeEnum {
    return this.queueService.repeatMode;
  }

  public set repeatMode(repeatMode: RepeatModeEnum) {
    this.queueService.repeatMode = repeatMode;
  }

  public get currentTrackDuration(): number {
    return this._currentTrackAudio.duration;
  }

  public get currentTrack(): Track {
    return this.queueService.currentItem;
  }

  public get currentTrackTime(): Observable<number> {
    return interval(50).pipe(map(() => this._currentTrackAudio.currentTime));
  }

  public set nextQueue(tracks: Track[]) {
    if (this._nextQueue !== tracks) {
      this._nextQueue = tracks;
    }
  }

  public nextRepeatMode(): void {
    this.repeatMode = (this.repeatMode + 1) % 3;
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
    this.isPlaying = true;
  }

  public pause(): void {
    this.isPlaying = false;
  }

  public next(): void {
    this.queueService.moveToNext();

    if (this._playing) {
      this.play();
    }
  }

  public prev(): void {
    this.queueService.moveToPrev();

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
  }

  private updateCurrentTrackAudio(): void {
    this._currentTrackAudio.pause();
    this._currentTrackAudio.src = this.currentTrack.src;
  }

  private async setupNativeMusicControls(currentTrack: Track): Promise<void> {
    await this.musicControls.create({
      track: currentTrack.title,
      artist: currentTrack.author,
      isPlaying: this.isPlaying,
      dismissable: true,
      hasSkipForward: true,
      hasSkipBackward: true,
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
      this._currentTrack$.next(this.currentTrack);
    });
  }

  private setupCurrentTrackAudio(): void {
    this._currentTrackAudio = new Audio();
    this._currentTrackAudio.addEventListener('ended', () => {
      if (this.queueService.isEnd() && !this.isRepeatOne) {
        return;
      }
      this.next();
    });
    this._togglePlay$.subscribe(async () => {
      if (this.isPlaying) {
        await this._currentTrackAudio.play();
      } else {
        await this._currentTrackAudio.pause();
      }
    });
  }
}
