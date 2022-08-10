import { Component, OnInit } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';

import { Track } from '@src/app/db/domain/track.schema';
import { MusicControlService } from '@src/app/services/music-control/music-control.service';
import { MusicLibraryService } from '@src/app/services/music-library.service';

interface SliderSettings {
  value: number;
  max: number;
  min: number;
  step: number;
}

@Component({
  selector: 'maheta-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit {
  public sliderSettings: SliderSettings;
  public currentTrackTime: number;
  private _isSliderHeld: boolean = false;

  constructor(
    private readonly musicLibraryService: MusicLibraryService,
    private readonly musicControlService: MusicControlService
  ) {}

  public get track(): Track {
    return this.musicControlService.currentTrack;
  }

  public ngOnInit(): void {
    this.setupSlider();
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

  public isPlaying(): boolean {
    return this.musicControlService.isPlaying;
  }

  public sliderHold(sliderChange: MatSliderChange): void {
    if (!sliderChange?.value) {
      return;
    }
    const time: number = (sliderChange.value * this.track?.duration) / this.sliderSettings.max;
    this._isSliderHeld = true;
    this.currentTrackTime = time;
  }

  public sliderRelease(value: number | null): void {
    if (!value) {
      return;
    }
    const time: number = (value * this.track?.duration) / this.sliderSettings.max;
    this.musicControlService.seekTo(time);
    this._isSliderHeld = false;
  }

  private setupSlider(): void {
    this.sliderSettings = {
      value: 0,
      min: 0,
      max: 1000,
      step: 1,
    };

    this.musicControlService.currentTrackTime.subscribe((currentTrackTime: number) => {
      if (!this._isSliderHeld) {
        this.currentTrackTime = currentTrackTime;
        this.sliderSettings.value =
          (currentTrackTime / this.track?.duration) * this.sliderSettings.max;
      }
    });
  }
}
