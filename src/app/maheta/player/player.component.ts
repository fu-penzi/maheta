import { Component, OnInit } from '@angular/core';

import { Track } from '@src/app/db/domain/track.schema';
import { MusicControlService } from '@src/app/services/music-control/music-control.service';
import { MusicLibraryService } from '@src/app/services/music-library.service';

@Component({
  selector: 'maheta-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit {
  public showTicks: boolean = false;
  public autoTicks: boolean = false;
  public tickInterval: number = 1;
  public value = 1;

  constructor(
    private readonly musicLibraryService: MusicLibraryService,
    private readonly musicControlService: MusicControlService
  ) {}

  public get track(): Track {
    return this.musicControlService.currentTrack;
  }

  ngOnInit(): void {
    this.setupButtons();
  }

  public getSliderTickInterval(): number | 'auto' {
    if (this.showTicks) {
      return this.autoTicks ? 'auto' : this.tickInterval;
    }

    return 0;
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

  private setupButtons(): void {
    // this.controlButtons = {
    //   skipPrevious: {
    //     icon: 'skip_previous',
    //     ariaLabel: 'Example icon button with a bookmark icon',
    //   },
    //   playArrow: {
    //     icon: 'play_arrow',
    //     ariaLabel: 'Example icon button with a bookmark icon',
    //   },
    //   skipNext: {
    //     icon: 'skip_next',
    //     ariaLabel: 'Example icon button with a bookmark icon',
    //   },
    // };
    // this.adjacentButtons = {
    //   shuffle: {
    //     icon: 'shuffle',
    //     ariaLabel: 'Example icon button with a bookmark icon',
    //   },
    //   repeat: {
    //     icon: 'repeat',
    //     ariaLabel: 'Example icon button with a bookmark icon',
    //   },
    // };
  }
}
