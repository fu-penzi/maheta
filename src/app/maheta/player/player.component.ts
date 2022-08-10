import { Component, OnInit } from '@angular/core';

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
  public sliderHold: boolean = false;

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

  public setSliderHold(sliderHold: boolean): void {
    this.sliderHold = sliderHold;
  }

  public sliderValueChanges(value: number | null): void {
    if (!value) {
      return;
    }

    this.musicControlService.seekTo((value * this.track?.duration) / this.sliderSettings.max);
    this.setSliderHold(false);
  }

  private setupSlider(): void {
    this.sliderSettings = {
      value: 0,
      min: 0,
      max: 1000,
      step: 1,
    };

    this.musicControlService.currentTrackTime.subscribe((currentTrackTime: number) => {
      this.currentTrackTime = currentTrackTime;
      if (!this.sliderHold) {
        this.sliderSettings.value =
          (currentTrackTime / this.track?.duration) * this.sliderSettings.max;
      }
    });
  }
}
