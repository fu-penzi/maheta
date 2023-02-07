import { Component, Input, OnInit } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';

import { Track } from '@src/app/db/domain/track.schema';
import { BaseComponent } from '@src/app/modules/shared/base.component';
import { MusicControlService } from '@src/app/services/music-control/music-control.service';

import { takeUntil } from 'rxjs';

interface SliderSettings {
  value: number;
  max: number;
  min: number;
  step: number;
}

const initSliderSettings: SliderSettings = {
  value: 0,
  min: 0,
  max: 1000,
  step: 1,
};

export const sliderStartThreshold: number = 0.04;

@Component({
  selector: 'maheta-player-controls',
  templateUrl: './player-controls.component.html',
  styleUrls: ['./player-controls.component.scss'],
})
export class PlayerControlsComponent extends BaseComponent implements OnInit {
  @Input() track: Track;

  public currentTrackTime: number = 0;
  public sliderSettings: SliderSettings = { ...initSliderSettings };

  private _isSliderHeld: boolean = false;

  constructor(private musicControlService: MusicControlService) {
    super();
  }

  public get duration(): number {
    return this.musicControlService.currentTrackDuration;
  }

  public get isPlaying(): boolean {
    return this.musicControlService.isPlaying;
  }

  public get isRepeatOne(): boolean {
    return this.musicControlService.isRepeatOne;
  }

  public get isRepeatQueue(): boolean {
    return this.musicControlService.isRepeatQueue;
  }

  public get isShuffle(): boolean {
    return this.musicControlService.isShuffle;
  }

  public ngOnInit(): void {
    this.setupSlider();
  }

  public sliderHold(sliderChange: MatSliderChange): void {
    if (!sliderChange?.value) {
      return;
    }
    this._isSliderHeld = true;
    this.currentTrackTime = this.getSliderStartTime(sliderChange.value);
  }

  public sliderRelease(value: number | null): void {
    if (!value) {
      return;
    }
    this.musicControlService.seekTo(this.getSliderStartTime(value));
    this._isSliderHeld = false;
  }

  public onTouchEnd(): void {
    if (this._isSliderHeld) {
      this.musicControlService.seekTo(this.currentTrackTime);
      this._isSliderHeld = false;
    }
  }

  public play(): void {
    this.musicControlService.play();
  }

  public pause(): void {
    this.musicControlService.pause();
  }

  public next(): void {
    this.musicControlService.next();
  }

  public prev(): void {
    this.musicControlService.prev();
  }

  public toggleShuffle(): void {
    this.musicControlService.isShuffle = !this.musicControlService.isShuffle;
  }

  public nextRepeatMode(): void {
    this.musicControlService.nextRepeatMode();
  }

  private getSliderStartTime(sliderValue: number): number {
    const time: number = (sliderValue * this.duration) / this.sliderSettings.max;
    return time < this.duration * sliderStartThreshold ? 0 : time;
  }

  private setupSlider(): void {
    this.musicControlService.currentTrackAudioTime$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((currentTrackTime: number) => {
        if (!this._isSliderHeld) {
          this.currentTrackTime = currentTrackTime;
          this.sliderSettings.value = (currentTrackTime / this.duration) * this.sliderSettings.max;
        }
      });
  }
}
