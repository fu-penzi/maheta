// noinspection SpellCheckingInspection

import { Injectable } from '@angular/core';
import { Directory, Filesystem, ReadFileResult } from '@capacitor/filesystem';

import { Track } from '@src/app/db/domain/track.schema';
import { LocalStorageEnum } from '@src/app/model/localStorage.enum';
import { QueueService, RepeatModeEnum } from '@src/app/services/queue.service';

import { MediaSession } from '@jofr/capacitor-media-session';
import { isNil } from 'lodash';
import { BehaviorSubject, interval, map, Observable, ReplaySubject, take } from 'rxjs';

const defaultNoteBase64: string =
  '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';

enum MediaSessionPlaybackStateEnum {
  NONE = 'none',
  PAUSED = 'paused',
  PLAYING = 'playing',
}

export const swipeBackThreshold: number = 2;

interface MusicControlState {
  queuePosition: number;
  currentTrackAudioTime: number;
}

@Injectable()
export class MusicControlService {
  public isPlaying: boolean = false;
  public currentTrackDuration: number = 0;

  private _nextQueue: Track[] | null = null;
  private _currentTrackAudio: HTMLAudioElement;

  private _repeatMode$: ReplaySubject<RepeatModeEnum> = new ReplaySubject<RepeatModeEnum>(1);
  private _currentTrack$: ReplaySubject<Track> = new ReplaySubject<Track>();
  private _currentQueue$: BehaviorSubject<Track[]> = new BehaviorSubject<Track[]>([]);
  private _currentTrackAudioTime$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private _restoreMusicControlState: ReplaySubject<void> = new ReplaySubject<void>(1);

  constructor(private queueService: QueueService<Track>) {
    this._repeatMode$.next(this.queueService.repeatMode);
    this._currentTrackAudio = new Audio();
    this._currentTrackAudio.preload = 'metadata';
    this._currentTrackAudio.addEventListener('play', () => this.updatePlaybackState());
    this._currentTrackAudio.addEventListener('pause', () => this.updatePlaybackState());
    this._currentTrackAudio.addEventListener('ended', () => this.onTrackEnded());
    this._currentTrackAudio.addEventListener('loadedmetadata', () => this.onLoadedMetadata());
    MediaSession.setActionHandler({ action: 'play' }, () => this.play());
    MediaSession.setActionHandler({ action: 'pause' }, () => this.pause());
    MediaSession.setActionHandler({ action: 'previoustrack' }, () => this.prev());
    MediaSession.setActionHandler({ action: 'nexttrack' }, () => this.next());
    MediaSession.setActionHandler(
      { action: 'seekto' },
      (details) => details.seekTime && this.seekTo(details.seekTime)
    );
    this.updatePlaybackState();
    this.watchCurrentItemChanges();
    this.setupCureentTrackAudioTimeSubject();
    this.onRestoreMusicControlState();
  }

  public get queuePosition(): number {
    return this.queueService.queuePosition;
  }

  public get queueSize(): number {
    return this._currentQueue$.value?.length;
  }

  public get currentTrack(): Track {
    return this.queueService.currentItem;
  }

  public get currentQueue$(): Observable<Track[]> {
    return this._currentQueue$.asObservable();
  }

  public get currentTrack$(): Observable<Track> {
    return this._currentTrack$.asObservable();
  }

  public get currentTrackAudioTime$(): Observable<number> {
    return this._currentTrackAudioTime$.asObservable();
  }

  public get currentTrackAudioTime(): number {
    return this._currentTrackAudio.currentTime;
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

  public get repeatMode$(): Observable<RepeatModeEnum> {
    return this._repeatMode$.asObservable();
  }

  public set nextQueue(tracks: Track[]) {
    if (this._nextQueue === tracks) {
      return;
    }
    this._nextQueue = tracks;

    if (this._nextQueue.length !== 0) {
      this._restoreMusicControlState.next();
      this._restoreMusicControlState.complete();
    }
  }

  public backupMusicControlState(): void {
    const musicControlState: MusicControlState = {
      queuePosition: this.queuePosition,
      currentTrackAudioTime: this._currentTrackAudio.currentTime,
    };
    localStorage.setItem(LocalStorageEnum.musicControlState, JSON.stringify(musicControlState));
  }

  public nextRepeatMode(): void {
    this.queueService.repeatMode = (this.repeatMode + 1) % 3;
    this._repeatMode$.next(this.queueService.repeatMode);
  }

  public playPosition(position: number): void {
    this.updateQueue();
    this._currentTrackAudio.pause();
    this.queueService.moveTo(position);
    this.play();
  }

  public play(): Promise<void> {
    this.isPlaying = true;
    return this._currentTrackAudio.play();
  }

  public pause(): void {
    this.isPlaying = false;
    this._currentTrackAudio.pause();
  }

  public next(): void {
    this.queueService.moveToNext();
  }

  public prev(force?: boolean): void {
    if (!force && this._currentTrackAudio.currentTime > swipeBackThreshold) {
      this.seekTo(0);
      return;
    }
    this.queueService.moveToPrev();
  }

  public seekTo(time: number, offset: number = 0): void {
    if (typeof this._currentTrackAudio.fastSeek === 'function') {
      this._currentTrackAudio.fastSeek(time + offset);
    } else {
      this._currentTrackAudio.currentTime = time + offset;
    }
    this.updateNativeMusicControlsPositionState();
  }

  private updateQueue(): void {
    if (this._nextQueue) {
      this.queueService.clear();
      this.queueService.add(this._nextQueue);
      this._currentQueue$.next(this._nextQueue);
      this._nextQueue = null;
    }
  }

  private onTrackEnded(): void {
    if (!this.queueService.isEnd() || this.isRepeatOne) {
      this.next();
    }
  }

  private onLoadedMetadata(): void {
    if (!this.currentTrack?.duration) {
      this.currentTrackDuration = this._currentTrackAudio.duration;
    }
  }

  private watchCurrentItemChanges(): void {
    this.queueService.currentItem$.subscribe((currentTrack: Track) => {
      this._currentTrackAudio.src = this.currentTrack.src;
      if (this.isPlaying) {
        this.play();
      } else {
        this.pause();
      }
      this.currentTrackDuration = this.currentTrack?.duration || this.currentTrackDuration;
      this.updateNativeMusicControls(currentTrack);
      this._currentTrack$.next(this.currentTrack);
    });
  }

  private setupCureentTrackAudioTimeSubject(): void {
    interval(50)
      .pipe(map(() => this.currentTrackAudioTime))
      .subscribe((currentTime: number) => {
        this._currentTrackAudioTime$.next(currentTime);
        this.updateNativeMusicControlsPositionState();
      });
  }

  private updatePlaybackState(): void {
    MediaSession.setPlaybackState({
      playbackState: this._currentTrackAudio.paused
        ? MediaSessionPlaybackStateEnum.PAUSED
        : MediaSessionPlaybackStateEnum.PLAYING,
    }).then(() => this.updateNativeMusicControlsPositionState());
  }

  private updateNativeMusicControlsPositionState(): void {
    if (this.currentTrackDuration && this._currentTrackAudio?.currentTime) {
      MediaSession.setPositionState({
        duration: this.currentTrackDuration,
        position: this.currentTrackAudioTime,
        playbackRate: 1,
      });
    }
  }

  private async updateNativeMusicControls(currentTrack: Track): Promise<void> {
    const base64Image: string = await Filesystem.readFile({
      path: currentTrack.album,
      directory: Directory.Library,
    })
      .then((read: ReadFileResult) => read.data)
      .catch(() => defaultNoteBase64);

    return MediaSession.setMetadata({
      title: currentTrack.title,
      artist: currentTrack.author,
      album: currentTrack.album,
      artwork: [
        {
          src: `data:image/jpeg;base64,${base64Image}`,
          type: 'image/jpeg',
          sizes: '512x512',
        },
      ],
    }).then(() => this.updatePlaybackState());
  }

  private onRestoreMusicControlState(): void {
    this._restoreMusicControlState.pipe(take(1)).subscribe(() => {
      const musicControlStateStorage: string | null = localStorage.getItem(
        LocalStorageEnum.musicControlState
      );
      if (!musicControlStateStorage) {
        return;
      }
      const musicControlState: MusicControlState = JSON.parse(musicControlStateStorage);
      if (!isNil(musicControlState.queuePosition)) {
        this.pause();
        this.updateQueue();
        this.queueService.moveTo(musicControlState.queuePosition);
        this.seekTo(musicControlState.currentTrackAudioTime);
      }
    });
  }
}
